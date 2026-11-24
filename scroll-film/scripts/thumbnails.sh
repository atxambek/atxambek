#!/usr/bin/env bash
# YouTube thumbnails (1280x720 JPG, < 2 MB) and the vertical cover for Shorts / Reels / TikTok.
set -e
cd "$(dirname "$0")/.."
mkdir -p marketing
for id in thumb-a-drawing thumb-b-5min thumb-c-lookup cover-vertical cover-vertical-lookup; do
  npx remotion still "$id" "marketing/SCROLL_${id}.jpg" --image-format=jpeg --jpeg-quality=92 --log=error
done
ls -la marketing/*.jpg
