#!/usr/bin/env bash
# Channel branding for "Little Choices": profile picture, banner (channel art), video watermark, preview sheet.
set -e
cd "$(dirname "$0")/.."
mkdir -p marketing/channel
npx remotion still channel-logo marketing/channel/LittleChoices_logo_800.png --image-format=png --log=error
npx remotion still channel-banner marketing/channel/LittleChoices_banner_2048x1152.jpg --image-format=jpeg --jpeg-quality=93 --log=error
npx remotion still channel-watermark marketing/channel/LittleChoices_watermark_150.png --image-format=png --log=error
npx remotion still channel-preview marketing/channel/preview.png --image-format=png --log=error
ls -la marketing/channel
