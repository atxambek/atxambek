#!/usr/bin/env bash
# Audio mix + loudness pass + mux, then the per-scene loudness report. Works for every film:
#   bash scripts/mix.sh            → SCROLL (default)
#   FILM=later bash scripts/mix.sh → LATER
# Music: a real track (…/music.mp3) if present, otherwise the synthesised placeholder; it is matched to the
# placeholder's loudness so the designed music/SFX balance holds.
set -euo pipefail
cd "$(dirname "$0")/.."
FILM=${FILM:-scroll}
if [ "$FILM" = later ]; then
  NAME=LATER; OUTDIR=out/later; TL=src/later/timeline.ts
  PLACEHOLDER=public/audio/later_music.wav; REAL=public/audio/later_music.mp3; SFX=public/audio/later_sfx.wav
  GEN="python3 scripts/make_audio_later.py"
  VIDEO=${VIDEO:-out/later/later_video.mp4}; VERT=out/later/later_vertical_video.mp4
else
  NAME=SCROLL; OUTDIR=out; TL=src/timeline.ts
  PLACEHOLDER=public/audio/placeholder_music.wav; REAL=public/audio/music.mp3; SFX=public/audio/sfx.wav
  GEN="python3 scripts/make_audio.py"
  VIDEO=${VIDEO:-out/scroll_video.mp4}; VERT=out/scroll_vertical_video.mp4
fi
mkdir -p "$OUTDIR"
[ -f "$SFX" ] && [ -f "$PLACEHOLDER" ] || $GEN
MUSIC=$REAL
[ -f "$MUSIC" ] || MUSIC=$PLACEHOLDER
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
echo "film: $NAME  music: $MUSIC  video: $VIDEO ($DUR s)"

# 0) match a real track to the placeholder's loudness
lufs(){ ffmpeg -hide_banner -i "$1" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import json,sys;print(json.load(sys.stdin)['input_i'])"; }
MUSIC_GAIN=0
if [ "$MUSIC" != "$PLACEHOLDER" ]; then
  MUSIC_GAIN=$(python3 -c "print(round(float('$(lufs "$PLACEHOLDER")') - float('$(lufs "$MUSIC")'), 2))")
  echo "music gain to match placeholder: ${MUSIC_GAIN} dB"
fi

# 1) premix (music + sfx), trimmed/padded to the picture length, float so nothing clips
ffmpeg -loglevel error -y -i "$MUSIC" -i "$SFX" -filter_complex \
  "[0:a]aresample=48000,volume=${MUSIC_GAIN}dB,apad[m];[1:a]aresample=48000,apad[s];[m][s]amix=inputs=2:weights=1 1:normalize=0,atrim=0:$DUR[a]" \
  -map "[a]" -c:a pcm_f32le "$OUTDIR/premix.wav"

# 2) gain to -14 LUFS, then an oversampled peak limiter (-3 dBFS at 192 kHz ≈ true-peak control)
I1=$(lufs "$OUTDIR/premix.wav")
G=$(python3 -c "print(round(-14.0 - float('$I1'), 2))")
ffmpeg -loglevel error -y -i "$OUTDIR/premix.wav" -af \
  "volume=${G}dB,aresample=192000,alimiter=limit=0.708:attack=1:release=60:level=false:latency=true,aresample=48000" \
  -c:a pcm_s24le "$OUTDIR/limited.wav"

# 3) loudnorm two-pass, linear (a fine trim)
ffmpeg -hide_banner -i "$OUTDIR/limited.wav" -af loudnorm=I=-14:TP=-1.5:LRA=10:print_format=json -f null - 2> "$OUTDIR/loudnorm_pass1.txt"
J=$(sed -n '/^{/,/^}/p' "$OUTDIR/loudnorm_pass1.txt")
get(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -y -i "$OUTDIR/limited.wav" -af \
  "loudnorm=I=-14:TP=-1.5:LRA=10:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true:print_format=json" \
  -ar 48000 -c:a pcm_s16le "$OUTDIR/mix.wav" 2> "$OUTDIR/loudnorm_pass2.txt"
echo "loudnorm mode: $(sed -n '/^{/,/^}/p' "$OUTDIR/loudnorm_pass2.txt" | python3 -c "import json,sys;print(json.load(sys.stdin)['normalization_type'])")"

# 4) mux: H.264 video as rendered (CRF 18) + AAC 192 kbps
ffmpeg -loglevel error -y -i "$VIDEO" -i "$OUTDIR/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "$OUTDIR/${NAME}_final.mp4"
echo "final: $OUTDIR/${NAME}_final.mp4"

# 4b) the vertical cut (same timeline, same mix) if it has been rendered
if [ -f "$VERT" ]; then
  ffmpeg -loglevel error -y -i "$VERT" -i "$OUTDIR/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "$OUTDIR/${NAME}_vertical.mp4"
  echo "vertical: $OUTDIR/${NAME}_vertical.mp4"
fi

# 5) report
python3 scripts/loudness_report.py "$OUTDIR/mix.wav" "$TL" | tee "$OUTDIR/loudness_report.txt"
