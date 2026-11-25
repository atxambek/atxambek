# LATER — QA report (render v1)

Deliverable: `out/later/LATER_final.mp4` (not in git; rebuild with `npm run later:render && npm run later:mix`).

| Check | Result |
|---|---|
| Runtime | 4:56.0 (target 4:50–5:10) ✅ |
| Video | H.264, 1920×1080, 30 fps, CRF 18 ✅ |
| Audio | AAC 192 kbps, 48 kHz stereo ✅ |
| Integrated loudness | −14.0 LUFS ✅ |
| True peak | −2.9 dBTP (limit −1.5) ✅ |
| Loudness range | 5.1 LU (≤ 10) ✅ |
| Max short-term jump between neighbouring shots | 3.9 dB, into S1a (≤ 6) ✅ |
| Loudness normalisation | linear (limiter first, no dynamic compression) ✅ |
| Sound design | 34 cue groups, hundreds of synthesised events: location beds (room tone, city traffic, wind/snow, office hum, muffled TV, restaurant wash, train), the clock-tick motif, footsteps synced to every walk cycle (snow crunch outside), Mom's knitting-needle motif, phone buzz/ring/ringback/pick-up, fridge, keys, door, knocks, marker and pen, flash hits, heartbeat; see `LATER_SFX_CUES.md` ✅ |
| Frame grid (one frame / 5 s) | every beat reads without sound ✅ |
| LAST CALL meter | 3 → 4 → 10 → 23 → 47 → 51 → flips to "today" → fades out ✅ |
| Calendar | Nov 2 2026 = Mon, Nov 9 = Mon, Nov 22 = Sun, Dec 16 = Wed, Dec 20/27 = Sun, Jan 3 2027 = Sun, Jan 9 = Sat ✅ |
| Continuity | Sam's tuft in every shot, his scarf in every outdoor/leaving shot; Mom's bun + glasses in every shot; the scarf she knits only grows ✅ |
| Subtitles | every line ≥ 1.2 s + 0.06 s/char; spoken / excuse / thought / phone-voice styles ✅ |
| Flashes | 3 white flashes, 3 frames each, 1.2 s apart ✅ |
| Brands / real UI | none; all phone screens abstract ✅ |

Per-scene loudness: `LATER_LOUDNESS.txt`.

## Known deviations
- Music is the synthesised placeholder (`scripts/make_audio_later.py`, D minor → F major). Drop a real track at `public/audio/later_music.mp3` and run `npm run later:mix`.
- A few secondary phone-UI labels are 26–30 px (voicemail "3 weeks ago", "0:09", "incoming call…"), under the 32 px rule; the key text on those screens ("Mom", the subtitles) is 36 px and up.
- Some pose changes are cuts between poses rather than in-betweens (standing up at dinner, picking up the phone).
