#!/usr/bin/env bash
# Audio mix + two-pass loudness normalisation + mux, then the per-scene loudness report.
# Music: public/audio/music.mp3 if present, otherwise the synthesised placeholder.
set -euo pipefail
cd "$(dirname "$0")/.."
MUSIC=public/audio/music.mp3
[ -f "$MUSIC" ] || MUSIC=public/audio/placeholder_music.wav
[ -f public/audio/sfx.wav ] || python3 scripts/make_audio.py
VIDEO=${VIDEO:-out/scroll_video.mp4}
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
echo "music: $MUSIC  video: $VIDEO ($DUR s)"

# 1) premix (music + sfx), trimmed/padded to the picture length
ffmpeg -loglevel error -y -i "$MUSIC" -i public/audio/sfx.wav -filter_complex \
  "[0:a]aresample=48000,apad[m];[1:a]aresample=48000,apad[s];[m][s]amix=inputs=2:weights=1 0.8:normalize=0,atrim=0:$DUR[a]" \
  -map "[a]" -c:a pcm_s16le out/premix.wav

# 2) loudnorm pass 1 (measure)
ffmpeg -hide_banner -i out/premix.wav -af loudnorm=I=-14:TP=-1.5:LRA=10:print_format=json -f null - 2> out/loudnorm_pass1.txt
J=$(sed -n '/^{/,/^}/p' out/loudnorm_pass1.txt)
get(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }

# 3) loudnorm pass 2 (apply, linear)
ffmpeg -loglevel error -y -i out/premix.wav -af \
  "loudnorm=I=-14:TP=-1.5:LRA=10:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true:print_format=summary" \
  -ar 48000 -c:a pcm_s16le out/mix.wav

# 4) mux: H.264 video as rendered (CRF 18) + AAC 192 kbps
ffmpeg -loglevel error -y -i "$VIDEO" -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest out/SCROLL_final.mp4

# 5) report
python3 scripts/loudness_report.py out/mix.wav | tee out/loudness_report.txt
