#!/usr/bin/env python3
"""
Placeholder score + SFX for SCROLL, synthesised from scratch (no samples, no copyrighted material).
Timing is read from src/timeline.ts, so retiming the edit and re-running this keeps everything in sync.

Outputs (48 kHz, stereo, 16-bit):
  public/audio/placeholder_music.wav
  public/audio/sfx.wav
Replace the music with a real track by dropping public/audio/music.mp3 (see scripts/mix.sh).
"""
import os
import re
import sys
import wave

import numpy as np

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(7)

# ------------------------------------------------------------------ timeline
src = open(os.path.join(ROOT, 'src', 'timeline.ts')).read()
shots = [(m.group(1), float(m.group(2))) for m in re.finditer(r"\{id: '([^']+)', act: '[^']+', s: ([\d.]+)", src)]
T = {}
t = 0.0
for sid, s in shots:
    T[sid] = (t, t + s)
    t += s
TOTAL = t
N = int(round(TOTAL * SR))
start = lambda sid: T[sid][0]
end = lambda sid: T[sid][1]
fr = lambda f: f / 30.0  # base frames -> seconds

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def add(buf, sig, at, pan=0.0, gain=1.0):
    i = int(at * SR)
    if i >= N or i + len(sig) <= 0:
        return
    sig = sig[: N - i]
    l = gain * np.cos((pan + 1) * np.pi / 4)
    r = gain * np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(sig), 0] += sig * l
    buf[i:i + len(sig), 1] += sig * r


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# ------------------------------------------------------------------ instruments
def piano(midi, vel=0.5, dur=3.0):
    f = hz(midi)
    tt = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(tt)
    for k, a in enumerate([1, 0.45, 0.25, 0.12, 0.06, 0.03], start=1):
        fk = f * k * (1 + 0.0004 * k * k)
        if fk > 12000:
            break
        out += a * np.sin(2 * np.pi * fk * tt) * np.exp(-tt * (1.1 + 0.7 * k) * (f / 400) ** 0.3)
    att = np.minimum(1, tt / 0.004)
    rel = np.minimum(1, (dur - tt) / 0.08)
    return out * att * rel * vel * 0.25


def pad(midis, dur, level=0.1, bright=3, attack=1.5, release=1.5):
    tt = np.arange(int(dur * SR)) / SR
    L = np.zeros_like(tt)
    R = np.zeros_like(tt)
    for m in midis:
        f = hz(m)
        for k in range(1, bright + 1):
            a = 1 / (k ** 1.6)
            L += a * np.sin(2 * np.pi * f * k * 0.9985 * tt + m)
            R += a * np.sin(2 * np.pi * f * k * 1.0015 * tt + 2 * m)
    env = np.minimum(1, tt / attack) * np.minimum(1, np.maximum(0, (dur - tt) / release))
    trem = 1 + 0.06 * np.sin(2 * np.pi * 0.23 * tt)
    s = level / max(1, len(midis))
    return np.stack([L * env * trem * s, R * env * trem * s], axis=1)


def add_pad(sig, at, gain=1.0):
    i = int(at * SR)
    sig = sig[: max(0, N - i)]
    music[i:i + len(sig)] += sig * gain


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def bandpass(x, lo, hi):
    X = np.fft.rfft(x)
    fq = np.fft.rfftfreq(len(x), 1 / SR)
    X[(fq < lo) | (fq > hi)] = 0
    return np.fft.irfft(X, len(x))


# ------------------------------------------------------------------ score
BPM = 72
BEAT = 60 / BPM
BAR = 4 * BEAT
# chords as midi tuples (low register for pads)
Am, F, C, G, Em, Dm = (57, 60, 64), (53, 57, 60), (48, 55, 60, 64), (55, 59, 62), (52, 55, 59), (50, 53, 57)
COLD_PROG = [Am, F, C, G]
WARM_PROG = [C, G, Am, F]


def section(t0, t1, prog, piano_mode, pad_level, pad_bright, vel=0.45, density=1.0):
    """Lay chords bar by bar from t0 to t1 with a piano pattern."""
    t = t0
    i = 0
    while t < t1 - 0.05:
        ch = prog[i % len(prog)]
        bar = min(BAR, t1 - t)
        add_pad(pad([m for m in ch], bar + 1.6, level=pad_level, bright=pad_bright, attack=0.9, release=1.4), t)
        root = ch[0]
        if piano_mode == 'hollow':
            # sparse arpeggio + soft pulse on each beat (the "slight pulse")
            for b in range(4):
                if t + b * BEAT < t1:
                    add(music, piano(root - 12, vel * 0.35, 1.2), t + b * BEAT, pan=-0.2)
            pat = [(0, ch[-1] + 12), (1.5, ch[1] + 12), (2.5, ch[0] + 24), (3, ch[1] + 12)]
            for k, (bt, m) in enumerate(pat):
                if density < 1 and k % 2 == 1:
                    continue
                if t + bt * BEAT < t1:
                    add(music, piano(m, vel * (0.9 if bt == 0 else 0.7), 2.6), t + bt * BEAT, pan=0.25)
        elif piano_mode == 'line':
            # a single soft line, one note every two beats
            line = [76, 74, 72, 69, 71, 72, 74, 72]
            for b in (0, 2):
                if t + b * BEAT < t1:
                    add(music, piano(line[(i * 2 + b // 2) % len(line)], vel * 0.8, 3.2), t + b * BEAT, pan=0.1)
        elif piano_mode == 'warm':
            for b, m in enumerate([ch[0] + 12, ch[1] + 12, ch[-1] + 12, ch[1] + 24, ch[0] + 24, ch[-1] + 12, ch[1] + 12, ch[0] + 12]):
                if t + b * BEAT / 2 < t1 and (density >= 1 or b % 2 == 0):
                    add(music, piano(m, vel * (1.0 if b == 0 else 0.65), 2.4), t + b * BEAT / 2, pan=(b % 3 - 1) * 0.25)
            add(music, piano(root - 12, vel * 0.5, 2.8), t, pan=-0.3)
        t += BAR
        i += 1


# Opening: one held note over a soft drone
add_pad(pad(Am, end('C0') + 1.0, level=0.07, bright=2, attack=2.5, release=1.5), 0)
add(music, piano(69, 0.5, 5.5), 1.0)
add(music, piano(64, 0.35, 5.0), 4.0)

# Acts 1–2: light, hollow piano with a slight pulse
section(start('S1'), start('A2-Fri'), COLD_PROG, 'hollow', 0.09, 2, vel=0.45)
# Friday: almost bare
section(start('A2-Fri'), end('A2-dust'), COLD_PROG, 'hollow', 0.075, 2, vel=0.33, density=0.5)

# Act 3: near silence, then a single soft piano line
add_pad(pad(Am, end('S7') - start('S6') + 1.0, level=0.065, bright=2, attack=1.5, release=2.5), start('S6'))
add(music, piano(57, 0.3, 4.0), start('S6') + 0.5)
add(music, piano(64, 0.25, 4.0), start('S6') + 4.0)
section(start('S8'), end('Q1'), [Am, F, Dm, Em], 'line', 0.065, 2, vel=0.42)

# Act 4: warm strings/piano building
section(start('S11'), start('S14'), WARM_PROG, 'line', 0.075, 3, vel=0.4)
section(start('S14'), start('S16'), WARM_PROG, 'warm', 0.085, 4, vel=0.38, density=0.5)
section(start('S16'), end('S16'), [F, C, F, G], 'line', 0.07, 3, vel=0.36)  # hold back while the box buzzes
section(start('S17'), end('Q2'), WARM_PROG, 'warm', 0.095, 5, vel=0.44)

# Act 5: full warm theme, then a gentle resolve
section(start('S18'), start('S21'), WARM_PROG, 'warm', 0.1, 5, vel=0.48)
section(start('S21'), start('C-END'), [F, G, Am, F], 'warm', 0.095, 4, vel=0.42, density=0.5)
res_t = start('C-END')
add_pad(pad((48, 55, 64, 67), TOTAL - res_t, level=0.09, bright=4, attack=1.2, release=6.0), res_t)
for k, m in enumerate([72, 67, 64, 60]):
    add(music, piano(m, 0.42 - k * 0.04, 6.0), res_t + 0.3 + k * 2.3, pan=0.15)
add(music, piano(60, 0.4, 7.0), start('TITLE') + 0.5)
add(music, piano(64, 0.32, 7.0), start('TITLE') + 0.5)
add(music, piano(67, 0.3, 7.0), start('TITLE') + 0.5)

# master fade-out with the title card
fade_len = int(4.0 * SR)
music[-fade_len:] *= np.linspace(1, 0, fade_len)[:, None]

# ------------------------------------------------------------------ SFX
def click(dur=0.025, lo=1500, hi=7000, decay=180):
    x = bandpass(noise(dur), lo, hi)
    return x * np.exp(-np.arange(len(x)) / SR * decay) / (np.abs(x).max() + 1e-9)


def thump(f=90, dur=0.25, decay=18):
    tt = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * f * tt * (1 - 0.3 * tt)) * np.exp(-tt * decay) + 0.3 * click(dur, 200, 1500, 60)[: len(tt)]


def bell(freqs=(1318.5, 1760.0), dur=1.2):
    tt = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(tt)
    for i, f in enumerate(freqs):
        d = np.zeros_like(tt)
        o = int(i * 0.12 * SR)
        d[o:] = np.sin(2 * np.pi * f * tt[: len(tt) - o]) * np.exp(-tt[: len(tt) - o] * 4)
        out += d
    return out * 0.5


def swoosh(dur=0.45):
    x = bandpass(noise(dur), 800, 6000)
    env = np.sin(np.linspace(0, np.pi, len(x))) ** 2
    return x * env / (np.abs(x).max() + 1e-9)


def squeak(dur=0.35):
    tt = np.arange(int(dur * SR)) / SR
    f = 2200 + 500 * np.sin(2 * np.pi * 3 * tt)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.sin(np.linspace(0, np.pi, len(tt)))
    return (np.sin(ph) * 0.4 + 0.3 * bandpass(noise(dur), 2000, 6000) / 3) * env


def buzz(dur=0.4):
    tt = np.arange(int(dur * SR)) / SR
    x = np.sign(np.sin(2 * np.pi * 155 * tt)) * 0.5 + 0.5 * np.sin(2 * np.pi * 310 * tt)
    env = np.minimum(1, tt / 0.01) * np.minimum(1, (dur - tt) / 0.02)
    return bandpass(x * env, 100, 2500)


def beep(dur=0.18, f=1046.5):
    tt = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / 0.005) * np.minimum(1, (dur - tt) / 0.02) * 0.6


# S2 thumb swipes
for k in range(int(6 * 30 / 24) + 1):
    tt = start('S2') + fr(k * 24)
    if tt < end('S2'):
        add(sfx, click(0.03, 2000, 8000), tt, pan=0.2, gain=0.25)
# S3 clock ticks, louder on the jump
dur3 = end('S3') - start('S3')
for k in range(int(dur3)):
    add(sfx, click(0.02, 2500, 7000, 300), start('S3') + k + 0.3, pan=0.3, gain=0.12)
add(sfx, click(0.03, 1500, 6000, 150), start('S3') + dur3 * 0.35, pan=0.3, gain=0.45)
# page turns on every book insert
for sid in ['S5', 'A2-Tue-bookmark', 'A2-dust', 'S15-bookmark', 'S20-end']:
    add(sfx, swoosh(), start(sid) + 0.05, gain=0.3)
for i in range(3):
    add(sfx, swoosh(), start('S17') + i * 4 + 2.2, gain=0.25)
# S10 weekly report notification
add(sfx, bell(), start('S10') + fr(24), pan=-0.2, gain=0.3)
# S11 marker squeaks (three strokes)
for i in range(3):
    add(sfx, squeak(0.5), start('S11') + fr(20) + i * fr(37), gain=0.14)
# S12 alarm, then STOP
for k in range(6):
    add(sfx, beep(), start('S12') + 0.1 + k * 0.4, gain=0.22)
add(sfx, click(0.03, 1000, 5000), start('S12') + fr(75), gain=0.35)
# S13 phone set down, lid closes
add(sfx, thump(140, 0.2, 30), start('S13') + fr(70), gain=0.25)
add(sfx, thump(85, 0.35, 14), start('S13') + fr(118), gain=0.5)
# S14 knocks
for k in [98.6, 104.3, 110.0]:
    add(sfx, thump(110, 0.18, 35), start('S14') + fr(k), pan=0.4, gain=0.5)
# S16 vibration buzz, until he pulls his hand back
tt = start('S16') + fr(15)
while tt < start('S16') + fr(285):
    add(sfx, buzz(), tt, pan=0.25, gain=0.22)
    tt += 1.0
# S19 tablet goes into the box
add(sfx, thump(150, 0.2, 30), start('S19') + fr(170), gain=0.25)


# ------------------------------------------------------------------ write
def write(path, buf, peak=0.5):
    m = np.abs(buf).max()
    if m > 0:
        buf = buf / m * peak
    data = (np.clip(buf, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


out = os.path.join(ROOT, 'public', 'audio')
os.makedirs(out, exist_ok=True)
write(os.path.join(out, 'placeholder_music.wav'), music, 0.5)
write(os.path.join(out, 'sfx.wav'), sfx, 0.5)
print(f'shots={len(shots)} total={TOTAL:.1f}s')
