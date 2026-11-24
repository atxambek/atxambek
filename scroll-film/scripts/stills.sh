#!/usr/bin/env bash
# Phase 1 style frames: shot id + representative frame
set -e
cd "$(dirname "$0")/.."
mkdir -p out/style-frames
for pair in S01:142 S04:110 S07:120 S15:90 S18:120 S21:235; do
  id=${pair%%:*}; fr=${pair##*:}
  npx remotion still "$id" "out/style-frames/${id}.png" --frame="$fr" --log=error
done
