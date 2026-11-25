# Little Choices — animated shorts studio (Remotion)

The series' Remotion project: silhouette shorts built entirely as SVG React components.

- **SCROLL** (episode 3) — finished: shared code in `src/`, shots in `src/scenes/`, timeline in `src/timeline.ts`.
- **LATER** (episode 4) — in production: brief in `briefs/LATER_brief.md`, code in `src/later/`, compositions prefixed `later-`.

Briefs for every film live in `briefs/`.

## Commands
- `npm run studio` — open Remotion Studio to scrub shots
- `npm run stills` — render the phase-1 style frames to `out/style-frames/`
- `npm run later:stills` — LATER style frames + contact sheet to `out/later/`
- `npm run animatic` / `npm run animatic:vertical` — 10 fps, half-size previews
- `npm run render` — 1920×1080 picture (`out/scroll_video.mp4`)
- `npm run render:vertical` — 1080×1920 re-framed cut for Shorts/Reels (`out/scroll_vertical_video.mp4`)
- `npm run thumbnails` — YouTube thumbnails (1280×720) + vertical cover into `marketing/`
- `python3 scripts/make_srt.py` — English SDH captions `marketing/SCROLL.en.srt`
- `npm run mix` — music + SFX, two-pass loudnorm (−14 LUFS / −1.5 dBTP), mux to `out/SCROLL_final.mp4` (and `out/SCROLL_vertical.mp4` if rendered), per-scene loudness report

Retiming: edit `src/timeline.ts` (seconds per shot). Vertical framing per shot: `src/vertical.tsx` (`FRAMING`).

## Layout
- `src/characters/StickFigure.tsx` — Dad / Mia (`kid`) silhouettes: poses, eyes, brows, glow
- `src/props/` — phone, *The Moon Rabbit* book, clock, mug, Mia's "MY FAMILY" drawings
- `src/sets/` — LivingRoom, Kitchen + Fridge, Bedroom, Street, Window (seasons)
- `src/ui/UI.tsx` — Subtitle (spoken / excuse / thought), ScreenTimeMeter, Vignette, Camera, Layer (DOF blur)
- `src/scenes/` — one file per shot

Fonts (Gochi Hand, Cormorant Garamond; SIL OFL) are bundled in `public/fonts/` so renders never hit the network.

## Marketing
`marketing/` holds the thumbnails, the vertical cover, `SEO.md` (titles, description with chapters, tags, pinned comment, upload settings, translations) and `SCROLL.en.srt`.
