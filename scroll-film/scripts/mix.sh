#!/usr/bin/env bash
# Audio mix + two-pass loudness normalisation + mux, then the per-scene loudness report.
# Music: public/audio/music.mp3 if present, otherwise the synthesised placeholder.
set -euo pipefail
cd "$(dirname "$0")/.."
MUSIC=public/audio/music.mp3
[ -f "$MUSIC" ] || MUSIC=public/audio/placeholder_music.wav
[ -f public/audio/sfx.wav ] && [ -f public/audio/placeholder_music.wav ] || python3 scripts/make_audio.py
VIDEO=${VIDEO:-out/scroll_video.mp4}
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
echo "music: $MUSIC  video: $VIDEO ($DUR s)"

# 0) a real track is matched to the placeholder's loudness, so the designed music/SFX balance holds
lufs(){ ffmpeg -hide_banner -i "$1" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import json,sys;print(json.load(sys.stdin)['input_i'])"; }
MUSIC_GAIN=0
if [ "$MUSIC" != public/audio/placeholder_music.wav ]; then
  MUSIC_GAIN=$(python3 -c "print(round(float('$(lufs public/audio/placeholder_music.wav)') - float('$(lufs "$MUSIC")'), 2))")
  echo "music gain to match placeholder: ${MUSIC_GAIN} dB"
fi

# 1) premix (music + sfx), trimmed/padded to the picture length
ffmpeg -loglevel error -y -i "$MUSIC" -i public/audio/sfx.wav -filter_complex \
  "[0:a]aresample=48000,volume=${MUSIC_GAIN}dB,apad[m];[1:a]aresample=48000,apad[s];[m][s]amix=inputs=2:weights=1 1:normalize=0,atrim=0:$DUR[a]" \
  -map "[a]" -c:a pcm_f32le out/premix.wav

# 2) gain to -14 LUFS, then an oversampled peak limiter (-3 dBFS at 192 kHz, i.e. true-peak control)
#    so short transients (knocks, lid, flashes) do not force loudnorm into its dynamic mode
I1=$(lufs out/premix.wav)
G=$(python3 -c "print(round(-14.0 - float('$I1'), 2))")
ffmpeg -loglevel error -y -i out/premix.wav -af \
  "volume=${G}dB,aresample=192000,alimiter=limit=0.708:attack=1:release=60:level=false:latency=true,aresample=48000" \
  -c:a pcm_s24le out/limited.wav

# 3) loudnorm two-pass, linear (now only a fine trim)
ffmpeg -hide_banner -i out/limited.wav -af loudnorm=I=-14:TP=-1.5:LRA=10:print_format=json -f null - 2> out/loudnorm_pass1.txt
J=$(sed -n '/^{/,/^}/p' out/loudnorm_pass1.txt)
get(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -y -i out/limited.wav -af \
  "loudnorm=I=-14:TP=-1.5:LRA=10:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true:print_format=json" \
  -ar 48000 -c:a pcm_s16le out/mix.wav 2> out/loudnorm_pass2.txt
echo "loudnorm mode: $(sed -n '/^{/,/^}/p' out/loudnorm_pass2.txt | python3 -c "import json,sys;print(json.load(sys.stdin)['normalization_type'])")"

# 4) mux: H.264 video as rendered (CRF 18) + AAC 192 kbps
ffmpeg -loglevel error -y -i "$VIDEO" -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest out/SCROLL_final.mp4

# 4b) the vertical cut (same timeline, same mix) if it has been rendered
if [ -f out/scroll_vertical_video.mp4 ]; then
  ffmpeg -loglevel error -y -i out/scroll_vertical_video.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest out/SCROLL_vertical.mp4
  echo "vertical: out/SCROLL_vertical.mp4"
fi

# 5) report
python3 scripts/loudness_report.py out/mix.wav | tee out/loudness_report.txt
