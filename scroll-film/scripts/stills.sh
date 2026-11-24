#!/usr/bin/env bash
# Phase 1 style frames: shot id + representative frame
set -e
cd "$(dirname "$0")/.."
mkdir -p out/style-frames
for pair in shot-S1:142 shot-S4:110 shot-S7:120 shot-S15:90 shot-S18:120 shot-S21:320; do
  id=${pair%%:*}; fr=${pair##*:}
  npx remotion still "$id" "out/style-frames/${id#shot-}.png" --frame="$fr" --log=error
done
