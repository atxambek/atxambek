#!/usr/bin/env python3
"""LATER: English closed captions (SDH) for upload: dialogue, phone voice, thoughts, narration, quotes and key sounds.
Times = shot start (from src/later/timeline.ts) + the frame numbers the scenes use, so retiming shots keeps them in sync."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, 'src', 'later', 'timeline.ts')).read()
shots = [(m.group(1), float(m.group(2))) for m in re.finditer(r"\{id: '([^']+)', act: '[^']+', s: ([\d.]+)", src)]
START, t = {}, 0.0
for sid, s in shots:
    START[sid] = t
    t += s
TOTAL = t

# (shot, from frame, to frame, text) — frames at 30 fps, same numbers as the scene code
CUES = [
    ('C0', 12, 200, '<i>“Later” always sounds like a promise.</i>'),
    ('S1a', 10, 82, '[phone buzzing]'),
    ('S1b', 104, 178, 'SAM (texting): Busy. Call you later.'),
    ('S3', 196, 262, 'MOM (texting): Okay ♥'),
    ('S4', 168, 250, 'SAM (thinking): <i>Too late to call now.</i>'),
    ('S4', 262, 322, 'SAM (thinking): <i>Tomorrow.</i>'),
    ('A2-office', 30, 92, '[phone buzzing]'),
    ('A2-office', 96, 160, 'SAM: Not now.'),
    ('A2-sofa', 132, 236, 'SAM (to himself): She’d call if it was important.'),
    ('S7', 28, 130, 'MOM (voicemail): Hi, sweetheart. Nothing important.'),
    ('S7', 150, 282, 'MOM (voicemail): I just wanted to hear your voice.'),
    ('S8', 118, 232, 'SAM (thinking): <i>Forty-seven days.</i>'),
    ('S9', 4, 110, '[a school bell, a train horn — memories]'),
    ('S10', 272, 356, 'SAM (thinking): <i>Maybe twenty more visits.</i>'),
    ('Q1', 10, 250, '“Procrastination is the thief of time.”\n— Edward Young'),
    ('S11', 30, 148, '[reminder set] SUNDAY 7 PM — CALL MOM\nRepeat: every week'),
    ('S11', 200, 262, '[train ticket] City → Home · Sat, Jan 9'),
    ('S12', 40, 78, '[phone buzzing] SUNDAY 7 PM — CALL MOM'),
    ('S12', 80, 160, 'TEMPTATION: Call her tomorrow.'),
    ('S12', 170, 246, 'TEMPTATION: She’ll understand.'),
    ('S13', 80, 136, '[phone ringing]'),
    ('S13', 150, 202, 'MOM: Hello?'),
    ('S13', 210, 290, 'SAM: Hi, Mom. It’s me.'),
    ('S13', 298, 350, 'MOM: Sam!'),
    ('S13', 360, 432, 'SAM: How are you?'),
    ('S13', 440, 522, 'MOM: Better now.'),
    ('S14', 162, 276, '[Mom’s note] SUN 7PM — SAM ♥'),
    ('Q2', 10, 250, '“The days are long,\nbut the years are short.” — Gretchen Rubin'),
    ('S16', 186, 236, '[knocking]'),
    ('S17', 58, 130, 'SAM: Hi, Mom.'),
    ('S17', 138, 212, 'MOM: You came!'),
    ('S19', 20, 200, '[wind; a train passes far away]'),
    ('C-END', 12, 246, '<i>No calendar has a day called “Later.”</i>'),
    ('TITLE', 6, 290, 'LATER\n<i>Call her today.</i>'),
]


def ts(sec):
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


dur = {sid: s for sid, s in shots}
for sid, a, b, _ in CUES:
    assert sid in START, f'unknown shot {sid}'
    assert 0 <= a < b <= dur[sid] * 30 + 1e-6, f'{sid}: cue {a}-{b} outside the shot ({dur[sid] * 30:.0f} frames)'
rows = sorted((START[sid] + a / 30, START[sid] + b / 30, text) for sid, a, b, text in CUES)
for (a0, a1, _), (b0, _, _) in zip(rows, rows[1:]):
    assert a1 <= b0 + 1e-6, f'overlap at {a0:.2f}s'
out = os.path.join(ROOT, 'marketing', 'later', 'LATER.en.srt')
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, 'w', encoding='utf-8') as f:
    for i, (a, b, text) in enumerate(rows, 1):
        f.write(f'{i}\n{ts(a)} --> {ts(b)}\n{text}\n\n')
print(f'{len(rows)} cues -> {out}  (film {TOTAL:.0f} s)')
# chapter starts for the description
for sid in ['C0', 'S1a', 'A2-Nov9', 'S6', 'S11', 'S15', 'C-END']:
    m, s = divmod(int(START[sid]), 60)
    print(f'  {sid:8s} {m}:{s:02d}')
