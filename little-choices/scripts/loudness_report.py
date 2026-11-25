#!/usr/bin/env python3
"""Per-scene loudness report: integrated LUFS, true peak, LRA, and short-term loudness per shot (ebur128)."""
import math
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = sys.argv[1]
src = open(os.path.join(ROOT, 'src', 'timeline.ts')).read()
shots = [(m.group(1), float(m.group(2))) for m in re.finditer(r"\{id: '([^']+)', act: '[^']+', s: ([\d.]+)", src)]

p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True)
err = p.stderr
pts = [(float(t), float(s)) for t, s in re.findall(r't:\s*([\d.]+)\s+TARGET.*?S:\s*(-?[\d.]+)', err)]
summary = err[err.rfind('Summary:'):]
I = float(re.search(r'I:\s*(-?[\d.]+) LUFS', summary).group(1))
LRA = float(re.search(r'LRA:\s*(-?[\d.]+) LU', summary).group(1))
TP = float(re.search(r'Peak:\s*(-?[\d.]+) dBFS', summary).group(1))


def emean(vals):
    vals = [v for v in vals if v > -70]
    if not vals:
        return float('-inf')
    return 10 * math.log10(sum(10 ** (v / 10) for v in vals) / len(vals))


rows = []
t0 = 0.0
for sid, s in shots:
    vals = [v for t, v in pts if t0 + 0.5 < t <= t0 + s]
    rows.append((sid, t0, emean(vals)))
    t0 += s

print(f'Integrated: {I:.1f} LUFS   (target -14.0)')
print(f'True peak:  {TP:.1f} dBTP  (limit  -1.5)')
print(f'LRA:        {LRA:.1f} LU    (limit  10.0)')
print()
print(f"{'shot':<18}{'start':>7}{'short-term':>12}{'jump':>8}")
maxj = (0.0, '')
prev = None
for sid, st, l in rows:
    j = '' if prev is None else f'{l - prev:+.1f}'
    if prev is not None and abs(l - prev) > abs(maxj[0]):
        maxj = (l - prev, sid)
    print(f'{sid:<18}{int(st)//60}:{int(st)%60:02d}{l:>12.1f}{j:>8}')
    prev = l
print()
print(f'Max short-term jump between neighbouring shots: {abs(maxj[0]):.1f} dB (into {maxj[1]})  (limit 6.0)')
ok = abs(I + 14) <= 1.0 and TP <= -1.5 and LRA <= 10 and abs(maxj[0]) <= 6
print('PASS' if ok else 'FAIL')
