#!/usr/bin/env bash
# LATER: YouTube thumbnails (1280x720 JPG) + vertical cover into marketing/later/
set -e
cd "$(dirname "$0")/.."
mkdir -p marketing/later
for id in later-thumb-a-voicemail later-thumb-b-47days later-thumb-c-callher later-cover-vertical; do
  npx remotion still "$id" "marketing/later/LATER_${id#later-}.jpg" --image-format=jpeg --jpeg-quality=92 --log=error
done
ls -la marketing/later/*.jpg
