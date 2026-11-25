#!/usr/bin/env python3
"""English closed captions (SDH) for upload: dialogue, thoughts, narration, quotes and key sounds.
Times = shot start (from src/timeline.ts) + the frame numbers the scenes use, so retiming shots keeps them in sync."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, 'src', 'timeline.ts')).read()
shots = [(m.group(1), float(m.group(2))) for m in re.finditer(r"\{id: '([^']+)', act: '[^']+', s: ([\d.]+)", src)]
START, t = {}, 0.0
for sid, s in shots:
    START[sid] = t
    t += s

# (shot, from frame, to frame, text) — frames at 30 fps, same numbers as the scene code
CUES = [
    ('C0', 12, 200, '<i>Five minutes never feels like much.</i>'),
    ('S1', 50, 125, 'MIA: Story time?'),
    ('S1', 127, 230, 'DAD: Five minutes.'),
    ('S3', 6, 78, '[clock ticking]'),
    ('S4', 48, 128, 'DAD (thinking): <i>Oh.</i>'),
    ('A2-Tue', 46, 120, 'MIA: Story time?'),
    ('A2-Tue', 124, 214, 'DAD: After this one.'),
    ('A2-Thu', 70, 166, 'MIA (quietly): Story time?'),
    ('A2-Thu', 170, 262, 'DAD: Tomorrow, okay?'),
    ('A2-Fri', 30, 200, '[Mia walks past without a word]'),
    ('S8', 125, 260, 'DAD (thinking): <i>Is that how she sees me?</i>'),
    ('S10', 22, 95, '[phone buzzes]\nWEEKLY REPORT — Daily average: 4h 12m'),
    ('S10', 100, 300, 'DAD (thinking): <i>Four hours. Every day.</i>'),
    ('Q1', 10, 276, '“It is not that we have a short time to live,\nbut that we waste a lot of it.” — Seneca'),
    ('S12', 3, 75, '[alarm] 20:00 — PHONE BOX'),
    ('S14', 98, 133, '[knocking]'),
    ('S14', 135, 210, 'DAD: Story time?'),
    ('S16', 15, 58, '[phone buzzing in the box]'),
    ('S16', 60, 140, 'TEMPTATION: Could be important.'),
    ('S16', 150, 215, 'TEMPTATION: Just check.'),
    ('S16', 220, 290, 'MIA (off-screen): Daddy! Page 12!'),
    ('S16', 305, 385, 'DAD: It can wait.'),
    ('Q2', 10, 276, '“How we spend our days is, of course,\nhow we spend our lives.” — Annie Dillard'),
    ('S19', 4, 70, '[clock strikes eight]'),
    ('S19', 255, 335, 'MIA: Story time.'),
    ('S19', 345, 430, 'DAD: Story time.'),
    ('S20-again', 12, 80, 'MIA: Again!'),
    ('S20-again', 88, 165, 'DAD: Again.'),
    ('S21', 10, 90, '[crickets]'),
    ('C-END', 12, 81, '<i>They won’t remember what you scrolled.</i>'),
    ('C-END', 82, 246, '<i>They won’t remember what you scrolled.\nThey’ll remember you.</i>'),
    ('TITLE', 6, 290, 'SCROLL\n<i>Look up. They’re growing.</i>'),
]


def ts(sec):
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


rows = sorted((START[sid] + a / 30, START[sid] + b / 30, text) for sid, a, b, text in CUES)
for (a0, a1, _), (b0, _, _) in zip(rows, rows[1:]):
    assert a1 <= b0 + 1e-6, f'overlap at {a0:.2f}s'
out = os.path.join(ROOT, 'marketing', 'SCROLL.en.srt')
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, 'w', encoding='utf-8') as f:
    for i, (a, b, text) in enumerate(rows, 1):
        f.write(f'{i}\n{ts(a)} --> {ts(b)}\n{text}\n\n')
print(f'{len(rows)} cues -> {out}')
