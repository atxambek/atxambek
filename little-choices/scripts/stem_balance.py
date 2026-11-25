#!/usr/bin/env python3
"""Per-shot balance between the music stem and the SFX stem (EBU R128 short-term / momentary)."""
import math
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# usage: stem_balance.py [music.wav sfx.wav timeline.ts]
ARGS = sys.argv[1:]
src = open(ARGS[2] if len(ARGS) > 2 else os.path.join(ROOT, 'src', 'timeline.ts')).read()
shots = [(m.group(1), float(m.group(2))) for m in re.finditer(r"\{id: '([^']+)', act: '[^']+', s: ([\d.]+)", src)]


def meter(path):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True)
    return [(float(t), float(m), float(s)) for t, m, s in re.findall(r't:\s*([\d.]+)\s+TARGET.*?M:\s*(-?[\d.]+)\s+S:\s*(-?[\d.]+)', p.stderr)]


def emean(v):
    v = [x for x in v if x > -70]
    return 10 * math.log10(sum(10 ** (x / 10) for x in v) / len(v)) if v else float('-inf')


mu = meter(ARGS[0] if ARGS else os.path.join(ROOT, 'public', 'audio', 'placeholder_music.wav'))
fx = meter(ARGS[1] if len(ARGS) > 1 else os.path.join(ROOT, 'public', 'audio', 'sfx.wav'))
print(f"{'shot':<17}{'music S':>9}{'sfx S':>8}{'sfx-mus':>9}{'sfx M max':>11}")
t0 = 0.0
for sid, s in shots:
    m_s = emean([S for t, M, S in mu if t0 + .5 < t <= t0 + s])
    f_s = emean([S for t, M, S in fx if t0 + .5 < t <= t0 + s])
    f_m = max([M for t, M, S in fx if t0 < t <= t0 + s] or [-99])
    print(f'{sid:<17}{m_s:>9.1f}{f_s:>8.1f}{f_s - m_s:>9.1f}{f_m:>11.1f}')
    t0 += s
