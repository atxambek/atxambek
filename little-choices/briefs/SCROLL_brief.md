# PROMPT FOR CLAUDE CODE — Animated short film "SCROLL"

You are the director, animator and editor of a ~5-minute animated short film. Build it entirely in code and render it to MP4. Read the whole brief before starting, and work in the phases described in section 8.

The film belongs to an existing series of motivational silhouette shorts (previous episodes: "1 MINUTE" about habits, "TEMPER" about anger). It must look and feel like the same series: same visual language, same pacing, same title-card format.

---

## 1. The film in one sentence

A father keeps telling his daughter "five more minutes" while he scrolls his phone, until he sees her drawing of the family in which his face is a phone, and he starts one small habit: at 8 PM the phone goes into a box.

**Theme:** time and attention are the real gift. **Tone:** quiet, warm, honest, never preachy. **No voice acting.** The story is told through images, music and on-screen subtitles in English.

---

## 2. Style bible (match it exactly)

### Characters
- Flat **black silhouette stick figures**: big round head, small rounded-rectangle body, thin rounded limbs, no neck, no fingers except in close-ups (then simple 4-finger hands).
- Faces are **only two white dot eyes + two short eyebrow strokes**. Emotion comes from eyebrow angle, eye size, eyes closed as arcs (happy), head tilt, slumped posture. No mouths except a small open "O" for surprise.
- **Emotion glow:** a soft outer glow on the silhouette edge. Cold cyan-blue = phone hypnosis or sadness, warm amber = warmth or happiness. Neutral = a faint light rim so the black shape separates from dark backgrounds.
- **DAD:** adult height, plain silhouette.
- **MIA (daughter, ~7):** about 55% of Dad's height, two short pigtails, a small **yellow hair clip** (her identifying color). She always carries the book *The Moon Rabbit* (invented title, light-blue cover with a white rabbit and moon).
- A character's design never changes between shots (pigtails, clip, proportions).

### Worlds and color
- Backgrounds are flat vector shapes with soft gradients: walls, sofa, rug, fridge, window, lamp, wall clock. Slightly desaturated.
- **Acts 1–3 palette:** cold blue-grays (#1d2129, #2b313b, #3d4553, #5a6372). The phone screen throws a **cyan glow (#5fd3ff)** onto Dad's face area and the sofa.
- **Acts 4–5 palette:** warm amber lamp light (#ffb35c, #f3d9a4, #8a6a4a shadows). The color temperature shift tells the story, just as TEMPER moved from red to warm.
- Always a **vignette** (dark corners, about 35% opacity).
- **Depth of field:** background layers get a Gaussian blur (4–10 px) when the camera is close. Over-the-shoulder shots use a **huge, blurred, out-of-focus silhouette in the foreground** (head and shoulder of the listener), exactly like the dialogue shots in the series.

### The recurring on-screen meter (the series' signature device)
In "1 MINUTE" it was the calendar, in "TEMPER" a thermometer. Here it is a **SCREEN TIME widget**: a small vertical pill in the **right third of the frame next to Dad**, with a phone icon and a time readout (e.g., "2h 31m"). The fill rises as he scrolls and drains when the phone is in the box. When it is high it glows cyan; in Act 5 it fades out entirely.

### Typography
- **Dialogue subtitles:** a rounded hand-drawn font (Google Font "Gochi Hand" or "Patrick Hand"), 42–48 px at 1080p, placed above or beside the speaker's head, on a soft dark blurred pill (black, 45% opacity, 24 px blur). They fade in over 6 frames and out over 8. For multi-line lines, the second line may appear after a beat.
  - **White** = spoken out loud.
  - **Orange (#ffa24d)** = excuses and the temptation voice ("Five minutes.", "Just check.").
  - **Light gray italic, no pill, slightly smaller** = private inner thought. Inner thoughts must be visually different from spoken lines; this was a flaw in the previous episode.
- **Narration and quote cards:** full black screen, centered serif ("Cormorant Garamond" or "EB Garamond"), italic for narration lines, regular for quotes, author line in small caps preceded by "—". Lines fade in one by one.
- **Final title card:** wide-letterspaced serif caps "SCROLL" with a small tagline underneath.

### Camera and editing grammar
- Slow virtual camera moves on almost every shot: push-in 3–6% over the shot, or a gentle pan. Never fully static, never shaky.
- Shot types: wide establishing shot, medium shot, over-the-shoulder with blurred foreground, extreme close-up inserts (phone screen, book page, bookmark, hand).
- **Transitions:** fade to black between acts; cross-dissolve with ghosting for "time passing"; a hard white flash (2–3 frames) for flashbacks, **at most 1 flash per second** (photosensitivity safety).
- Typical shot length is 2–5 s. Hold any story-critical beat for at least 1.5 s so it reads on a phone.

---

## 3. Script and shot list (target 4:50–5:10 at 30 fps, 1920×1080)

Timecodes are guides; adjust to the music.

### OPENING (0:00–0:06)
- **C0:** Black. Narration fades in: *"Five minutes never feels like much."*

### ACT 1: The promise (0:06–0:45)
- **S1 (wide):** Evening living room, cold palette. Dad slouched on the sofa, face lit cyan by the phone. Mia runs in holding *The Moon Rabbit* up high.
  - Mia (white): "Story time?"
  - Dad, eyes still on the phone (orange): "Five minutes."
  - The SCREEN TIME widget appears: **0h 12m**.
- **S2 (insert, phone):** Thumb swipes through an abstract feed: colored cards, generic icons, little hearts. **No real app UI, logos or brand names.** The status-bar clock dissolves from 20:02 to 20:47.
- **S3 (medium):** Mia sits on the rug waiting, book on her lap, feet swinging. The wall clock's minute hand jumps. Her feet stop swinging.
- **S4 (wide):** Mia asleep on the rug, the book open on her chest. Dad finally looks up. Widget: **2h 31m**.
  - Dad (inner gray): "Oh."
  - He covers her with a blanket and carries her off-screen. The camera holds on the book left on the rug.
- **S5 (insert):** The bookmark is at **page 3**.

### ACT 2: The pattern (0:45–1:45), a montage of 4 nights
Each night opens on the phone lock screen with the date (**Mon, Mar 2 → Tue, Mar 3 → Thu, Mar 5 → Fri, Mar 6**; these weekdays are correct for 2026), then a short beat:
- **Tue:** Mia: "Story time?" Dad (orange): "After this one." Widget **3h 04m**. Insert: bookmark still on page 3.
- **Thu:** Mia, smaller voice: "Story time?" Dad (orange): "Tomorrow, okay?" Mia's head drops. Widget **3h 48m**.
- **Fri:** Mia walks past the sofa with the book **without asking** and goes to her room. Dad doesn't notice. This silence is the strongest beat of the act, so hold it for 3 s. Widget **4h 12m**, glowing cyan.
- Insert: the bookmark is still on page 3, and a little dust settles on the book.

### ACT 3: The mirror (1:45–2:40)
- **S6 (wide):** Saturday morning, kitchen. Dad, half-asleep, walks to the fridge with a mug, phone in hand.
- **S7 (push-in):** On the fridge hangs Mia's crayon drawing titled **"MY FAMILY"**: Mia with a yellow clip, a sun, and Dad, whose **head is a glowing phone rectangle**. Hold for 2.5 s. The music drops almost to silence.
- **S8 (close):** Dad's eyes widen, then his eyebrows fall. The mug stops halfway.
  - Dad (inner gray): "Is that how she sees me?"
- **S9 (flashbacks):** 3 white-flash cuts, 1 s apart, desaturated: Mia waiting on the rug; Mia asleep with the book; Mia walking past in silence.
- **S10 (insert):** A notification slides down on his phone: **"Weekly report — Daily average: 4h 12m."**
  - Dad (inner gray): "Four hours. Every day."
- **QUOTE CARD 1 (6 s):** *"It is not that we have a short time to live, but that we waste a lot of it."* — SENECA

### ACT 4: One small step (2:40–3:45)
- **S11 (night, medium):** Dad takes an empty shoebox and writes **"8 PM"** on the side with a thick red marker, drawn stroke by stroke (a callback to the "1 MIN" sign). He places it on the hallway shelf.
- **S12 (phone insert):** An alarm, 20:00, label **"PHONE BOX"**. He taps STOP, not snooze.
- **S13 (close):** He puts the phone into the box and closes the lid. The widget dims and freezes.
- **S14 (medium):** He goes to Mia's door and knocks.
  - Dad (white): "Story time?"
  - Mia peeks out with a disbelieving face, then her eyes become happy arcs.
  - The lighting begins to warm.
- **S15 (wide, warm lamp):** Dad reads on the bed, Mia tucked against him. Insert: the bookmark moves to **page 7**.
- **SETBACK, S16 (next night, close):** The box **buzzes**: vibration lines, light leaking through the lid gap. Dad's hand hovers over it.
  - Temptation (orange): "Could be important."
  - Temptation (orange): "Just check."
  - Off-screen, Mia (white): "Daddy! Page 12!"
  - He pulls his hand back. Dad (white): "It can wait."
- **S17 (time-passing montage, dissolves):** the bookmark advancing (12 → 31 → 58); the widget readout falling (**3h 10m → 1h 45m → 0h 50m**); the window outside turning from bare winter branches to spring blossoms.
- **QUOTE CARD 2 (6 s):** *"How we spend our days is, of course, how we spend our lives."* — ANNIE DILLARD

### ACT 5: The payoff and bookend (3:45–4:50)
- **S18 (fridge, warm):** The old drawing has been replaced by a **new "MY FAMILY"** drawing: Dad with a real face (eyes and a smile), holding *The Moon Rabbit*, Mia laughing next to him. Dad's eyes become happy arcs. Hold for 2.5 s.
- **S19 (hallway, 20:00):** Before Dad gets there, Mia walks to the box carrying **her own little tablet** and drops it in next to his phone.
  - Mia (white): "Story time."
  - Dad, surprised, then laughing: "Story time."
  - (Mirror of TEMPER's message: children copy what they see.)
- **S20 (insert):** The book's last page reads **"THE END"**.
  - Mia (white): "Again!"
  - Dad (white): "Again."
- **S21 (final wide):** The camera slowly pulls back through the bedroom window into the night. The house window glows amber among dark neighboring windows that flicker cyan with screens. Hold for 4 s.
- **C-END (black):** Narration: *"They won't remember what you scrolled. They'll remember you."*
- **TITLE CARD:** **S C R O L L**, tagline: *"Look up. They're growing."* Hold for 5 s, then fade out with the music.

---

## 4. Sound

- There is no voice-over. Use music and a few sound effects only.
- **Music:** the user will provide a royalty-free track at `public/audio/music.mp3` (or several tracks: `act1.mp3`, …). If none exists yet, render with a silent placeholder track, make the timing easy to re-sync, and tell the user exactly which mood and length each section needs:
  - Act 1–2: light, hollow piano with a slight pulse.
  - Act 3: near silence, then a single soft piano line.
  - Act 4–5: building warm strings or piano.
  - Ending: gentle resolve.
- **SFX (optional, user-provided or free):** phone tap, notification ding, clock tick, phone vibration buzz, box lid, page turn, marker squeak.
- **Loudness rules** (the previous episodes failed these, so treat them as hard requirements):
  - Final mix at **−14 LUFS integrated, true peak ≤ −1.5 dBTP, loudness range ≤ 10 LU**. Use two-pass ffmpeg `loudnorm`.
  - **No jump of more than 6 dB in short-term loudness between neighboring scenes**, especially at the ending and title card. Measure with `ebur128` and report the per-scene values.

---

## 5. Technical approach

- **Recommended stack:** **Remotion** (React + TypeScript). All artwork is drawn as **SVG React components**, with no external image assets, so everything stays editable. Load fonts via `@remotion/google-fonts`.
- **Suggested structure:**
  - `src/characters/StickFigure.tsx`: props for `pose`, `eyes` (`open|happy|sad|wide|closed`), `brows` (angle), `glow` (`none|cyan|amber`), `scale`, plus a variant `kid` with pigtails and clip.
  - `src/sets/`: LivingRoom, Kitchen, Hallway, Bedroom, PhoneScreen, Fridge.
  - `src/ui/`: `Subtitle` (with `kind: spoken|excuse|thought`), `QuoteCard`, `NarrationCard`, `TitleCard`, `ScreenTimeMeter`, `Vignette`, `Blur`, `WhiteFlash`.
  - `src/scenes/` (one file per shot) and `src/Film.tsx`, which sequences everything with `<Series>` / `<Sequence>`.
  - `src/timeline.ts`: a single source of truth for all shot durations, so retiming is one edit.
- **Render settings:** 1920×1080, 30 fps, H.264 CRF 18, AAC 192 kbps.
- **Optional:** a 1080×1920 vertical cut for Shorts/Reels, re-framed per shot (not just center-cropped).
- **Safe zones:** keep all text inside the inner 80% of the frame (and away from the bottom 20% and right 15% in the vertical cut).

---

## 6. Things that must NOT appear
- No real brands, app logos, real UIs or real people.
- No copyrighted characters, songs or artwork.
- Quotes only exactly as written above, with these authors.
- No text smaller than 32 px at 1080p.
- No low-contrast thin gray text on dark gray without a pill or shadow.

---

## 7. Quality checklist (run before delivering)
1. Watch every shot as a frame grid (one frame every 2 s) and confirm each story beat is readable without sound.
2. Every key prop reads clearly when it matters: the bookmark page number, the drawing, the widget value, the "8 PM" box.
3. Continuity:
   - Mia's clip and pigtails are always present.
   - The book cover is identical in every shot.
   - Widget values follow the story order.
   - Lock-screen dates and weekdays match the 2026 calendar.
   - The seasons outside the window progress correctly.
4. Every subtitle is on screen for at least 1.2 s plus 0.06 s per character, and the speaker is unambiguous.
5. Audio: report integrated LUFS, true peak, LRA, and the maximum short-term jump between scenes.
6. Total runtime is between 4:50 and 5:10.

---

## 8. Work in phases (stop and show me after phases 1 and 2)
1. **Style frames:** render 6 PNG stills (S1, S4, S7, S15, S18, S21) and show them to me for approval of the look before animating.
2. **Animatic:** a full-length, low-fps render (e.g., 10 fps, 960×540) with all timing, subtitles and cards, so the pacing can be judged.
3. **Final animation and render** at full quality.
4. **Audio mix and loudness pass**, then run the QA checklist and report the results with any deviations.
