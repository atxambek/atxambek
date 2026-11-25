#!/usr/bin/env bash
# LATER phase 1: style frames + contact sheet
set -e
cd "$(dirname "$0")/.."
mkdir -p out/later/style-frames
for pair in later-S01:90 later-S03:120 later-stack:120 later-S07:150 later-S13:150 later-S18:180; do
  id=${pair%%:*}; fr=${pair##*:}
  npx remotion still "$id" "out/later/style-frames/${id#later-}.png" --frame="$fr" --log=error
done
cd out/later/style-frames
ffmpeg -loglevel error -y -i S01.png -i S03.png -i stack.png -i S07.png -i S13.png -i S18.png \
  -filter_complex "[0][1][2][3][4][5]xstack=inputs=6:layout=0_0|w0_0|0_h0|w0_h0|0_h0+h0|w0_h0+h0,scale=1920:-1" ../contact_sheet.png
ls -la
