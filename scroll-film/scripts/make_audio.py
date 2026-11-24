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
# Sound design, synthesised from scratch. Timing comes from the same frame numbers the scenes use
# (src/scenes/*.tsx), so footsteps land on the walk cycles, knocks on the knock poses, and so on.
# Two busses: `foley` (dry, gets a short room reverb) and `amb` (location beds, no reverb).
foley = np.zeros((N, 2))
amb = np.zeros((N, 2))
CUES = []
FOLEY_GAIN = 10.0  # dB, calibrated against the music stem with scripts/stem_balance.py
AMB_GAIN = 6.0


def db(x):
    return 10 ** (x / 20)


def norm(x):
    m = np.abs(x).max()
    return x / m if m > 0 else x


def tt(dur):
    return np.arange(max(1, int(round(dur * SR)))) / SR


def cue(t, text):
    CUES.append((t, text))


def place(bus, sig, t, pan=0.0, gain_db=0.0):
    g = db(gain_db)
    if sig.ndim == 1:
        p = max(-1.0, min(1.0, pan))
        l = np.cos((p + 1) * np.pi / 4) * np.sqrt(2)
        r = np.sin((p + 1) * np.pi / 4) * np.sqrt(2)
        st = np.stack([sig * l, sig * r], axis=1)
    else:
        st = sig
    i = int(round(t * SR))
    if i < 0:
        st = st[-i:]
        i = 0
    st = st[: max(0, N - i)]
    bus[i:i + len(st)] += st * g


def fx(sig, t, pan=0.0, gain_db=0.0):
    place(foley, sig, t, pan, gain_db + FOLEY_GAIN)


def px(x):
    """Stereo position from a 1920-px frame x."""
    return max(-0.9, min(0.9, (x - 960) / 1000))


def far(x):
    """Extra attenuation (dB) for a source that is still outside the frame."""
    return -7 * min(1.0, max(0.0, (x - 1850) / 300, (70 - x) / 300))


def at(sid, frames):
    return start(sid) + frames / 30.0


# --- filters -------------------------------------------------------
def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    if lo:
        X[f < lo] = 0
    if hi:
        X[f > hi] = 0
    return np.fft.irfft(X, len(x))


def soft_lp(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X, len(x))


def conv(a, b):
    n = len(a) + len(b) - 1
    nf = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(a, nf) * np.fft.rfft(b, nf), nf)[:n]


def taper(x, frac=.12):
    n = len(x)
    k = max(1, int(n * frac))
    x = x.copy()
    x[-k:] *= np.cos(np.linspace(0, np.pi / 2, k)) ** 2
    return x


def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-d * t)


def smooth_rand(n, rate):
    k = max(3, int(n / SR * rate) + 3)
    pts = rng.uniform(0, 1, k)
    curve = np.interp(np.arange(n), np.linspace(0, n - 1, k), pts)
    m = curve.mean()
    return soft_lp(curve - m, max(0.05, rate * 1.5)) + m


def comp(parts, dur):
    out = np.zeros(int(dur * SR))
    for sig, off, g in parts:
        i = int(off * SR)
        s = sig[: max(0, len(out) - i)]
        out[i:i + len(s)] += s * g
    return norm(out)


# --- sound generators (mono, peak 1) -------------------------------
def burst(dur, lo, hi, a=0.001, d=40.0):
    n = int(dur * SR)
    return norm(taper(fft_filter(rng.standard_normal(n), lo, hi) * env_ad(n, a, d)))


def modal(freqs, decays, amps=None, dur=0.5, a=0.0008):
    t = tt(dur)
    amps = amps if amps is not None else [1.0] * len(freqs)
    out = np.zeros_like(t)
    for f, d, am in zip(freqs, decays, amps):
        if f < SR / 2:
            out += am * np.sin(2 * np.pi * f * t + rng.uniform(0, 2 * np.pi)) * np.exp(-d * t)
    return norm(taper(out * np.minimum(1, t / a), .15))


def glide(f0, f1, dur, d=4.0, h2=0.2):
    t = tt(dur)
    f = f0 * (f1 / f0) ** (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    e = np.minimum(1, t / .004) * np.exp(-d * t) * np.minimum(1, (dur - t) / .01)
    return norm((np.sin(ph) + h2 * np.sin(2 * ph)) * e)


def step(kind='adult', soft=False):
    v = rng.uniform(0.9, 1.1)
    if kind == 'kid':
        x = comp([(modal([150 * v, 330 * v], [50, 80], [1, .3], .12), 0, .7),
                  (burst(.05, 600, 5000, .0008, 80), .002, .5)], .14)
    elif kind == 'slipper':
        x = comp([(burst(.18, 900, 6500, .035, 16), 0, .6),
                  (modal([95 * v], [40], None, .12), .02, .5)], .22)
    else:
        x = comp([(modal([88 * v, 176 * v], [32, 55], [1, .35], .2), 0, .8),
                  (burst(.07, 300, 3500, .0008, 55), .001, .55),
                  (burst(.05, 500, 4000, .0008, 70), .07, .3)], .22)
    return norm(soft_lp(x, 1400, 2)) if soft else x


def rustle(dur, lo=700, hi=6500, rate=9.0, crinkle=1.0):
    n = int(dur * SR)
    x = fft_filter(rng.standard_normal(n), lo, hi)
    m = np.clip(smooth_rand(n, rate), 0, None) ** (2 * crinkle)
    return norm(x * m * np.sin(np.linspace(0, np.pi, n)) ** 0.7)


def paper(dur=0.3):
    return rustle(dur, 1500, 11000, 35.0, 2.0)


def page_turn():
    return comp([(rustle(.32, 900, 8000, 14.0), 0, .8), (burst(.06, 300, 3000, .004, 45), .3, .7)], .42)


def tick(tock=False):
    b = [2200, 3700, 5600] if tock else [2600, 4200, 6100]
    return comp([(modal(b, [170, 230, 300], [1, .6, .3], .07), 0, .8), (burst(.006, 3000, 9000, .0003, 600), 0, .4)], .08)


def clunk():
    return comp([(modal([720, 1450, 2300], [45, 65, 90], [1, .6, .3], .3), 0, .8), (modal([125], [30], None, .3), 0, .6)], .32)


def tap():
    return comp([(burst(.018, 1800, 8000, .0004, 260), 0, .7), (modal([190], [90], None, .05), 0, .4)], .05)


def swipe():
    n = int(.13 * SR)
    return norm(fft_filter(rng.standard_normal(n), 2500, 9000) * np.sin(np.linspace(0, np.pi, n)) ** 2)


def pop():
    return glide(520, 1150, .07, 30)


def ui_blip(up=True):
    return glide(900, 1500, .09, 25) if up else glide(1300, 800, .12, 20)


def power_down():
    return norm(soft_lp(glide(900, 150, .8, 2.5, .3), 2500))


def ding():
    return comp([(modal([1318.5, 2637, 3950], [4, 7, 11], [1, .3, .1], 1.2), 0, 1),
                 (modal([1760, 3520], [4, 8], [1, .25], 1.0), .12, .8)], 1.3)


def buzz(dur=0.4, rattle=True):
    t = tt(dur)
    sq = np.sign(np.sin(2 * np.pi * 155 * t))
    x = fft_filter(0.5 * sq + 0.5 * np.sin(2 * np.pi * 310 * t), 100, 2500)
    x = x / np.abs(x).max()
    if rattle:
        r = fft_filter(rng.standard_normal(len(t)), 500, 3500) * (0.5 + 0.5 * sq)
        x = x + 0.6 * r / np.abs(r).max()
    return norm(x * np.minimum(1, t / .01) * np.minimum(1, (dur - t) / .02))


def cardboard(big=1.0):
    return comp([(modal([110 / big, 230 / big, 410 / big], [25, 40, 60], [1, .5, .3], .4), 0, .9),
                 (burst(.08, 200, 2500, .001, 40), 0, .6)], .42)


def plastic_clack():
    return modal([1800, 2950, 4400], [90, 120, 160], [1, .6, .3], .08)


def clink():
    return modal([2350, 3870, 5600, 7900, 9800], [12, 16, 22, 30, 40], [1, .7, .5, .3, .15], 1.0)


def bubble(f0):
    t = tt(.06)
    f = f0 * (1 + 2.5 * t / .06)
    return taper(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-55 * t) * np.minimum(1, t / .002))


def slosh():
    out = np.zeros(int(.4 * SR))
    for _ in range(5):
        b = bubble(rng.uniform(420, 900))
        i = int(rng.uniform(0, .25) * SR)
        out[i:i + len(b)] += b * rng.uniform(.5, 1)
    out += 0.3 * norm(fft_filter(rng.standard_normal(len(out)), 300, 1500)) * env_ad(len(out), .02, 9)
    return norm(out)


def heartbeat():
    return comp([(modal([52, 104], [11, 20], [1, .25], .35), 0, 1), (burst(.05, 80, 450, .002, 40), 0, .35),
                 (modal([64, 128], [14, 24], [1, .2], .3), .22, .7), (burst(.04, 80, 450, .002, 45), .22, .25)], .6)


PRE = 0.45


def flash_hit():
    n_pre = int(PRE * SR)
    sw = norm(fft_filter(rng.standard_normal(n_pre), 300, 7000) * np.linspace(0, 1, n_pre) ** 3)
    t = tt(1.6)
    ring = np.sin(2 * np.pi * 2900 * t) * np.exp(-2.2 * t) * 0.12
    return comp([(sw, 0, .6), (modal([70, 140], [18, 30], None, .6), PRE, .8),
                 (burst(.25, 1000, 9000, .001, 14), PRE, .5), (ring, PRE, 1.0)], PRE + 1.6)


def cap_pop():
    return comp([(glide(1400, 650, .05, 70), 0, .8), (burst(.008, 2000, 8000, .0003, 500), 0, .5)], .06)


def cap_on():
    return comp([(modal([3200, 5100], [220, 300], None, .04), 0, .7), (burst(.01, 2000, 8000, .0003, 400), 0, .6)], .05)


def squeak(dur):
    t = tt(dur)
    f = 2050 + 300 * np.sin(2 * np.pi * rng.uniform(1.5, 3.5) * t + rng.uniform(0, 6)) + 150 * (smooth_rand(len(t), 10) - .5)
    ph = 2 * np.pi * np.cumsum(f) / SR
    grit = fft_filter(rng.standard_normal(len(t)), 2500, 9000)
    grit /= np.abs(grit).max() + 1e-9
    amp = .45 + .55 * np.clip(smooth_rand(len(t), 7), 0, 1)
    e = np.minimum(1, t / .03) * np.minimum(1, (dur - t) / .04)
    return norm((.55 * (np.sin(ph) + .3 * np.sin(2 * ph)) + .3 * grit) * amp * e)


def marimba(m):
    f = hz(m)
    return modal([f, 3.93 * f, 9.2 * f], [7, 18, 40], [1, .25, .07], .7)


def creak(dur=.8):
    n = int(dur * SR)
    imp = np.zeros(n)
    pos = 0.0
    while pos < dur:
        imp[min(n - 1, int(pos * SR))] += rng.uniform(.6, 1.0)
        pos += 1 / (32 + 50 * np.sin(np.pi * pos / dur) + rng.uniform(-6, 6))
    ir = modal([520, 1130, 1760, 2600], [70, 90, 120, 150], [1, .7, .4, .2], .05)
    return norm(conv(imp, ir)[:n] * np.sin(np.linspace(0, np.pi, n)) ** .5)


def latch():
    return comp([(modal([2800, 4500, 6200], [240, 300, 380], [1, .6, .3], .05), 0, .8), (modal([900], [60], None, .1), .015, .4)], .12)


def knock():
    return comp([(modal([115, 240, 470], [30, 45, 70], [1, .55, .25], .22), 0, .9), (burst(.02, 300, 3000, .0005, 140), 0, .5)], .24)


def shimmer():
    parts = []
    for k, m in enumerate([72, 76, 79, 84, 88]):
        f = hz(m)
        parts.append((modal([f, 2.01 * f, 3.02 * f], [2.2, 3.5, 5.0], [1, .3, .1], 2.0), k * .07, 1.0 - k * .08))
    return comp(parts, 2.4)


def clock_strike():
    f = 262
    return comp([(modal([f, 2.0 * f, 2.4 * f, 3.0 * f, 4.2 * f, 5.4 * f], [.6, .9, 1.2, 1.4, 2.0, 2.6], [1, .6, .35, .3, .2, .12], 5.0), 0, 1),
                 (burst(.01, 1500, 6000, .0003, 300), 0, .3)], 5.0)


def bed_creak(big=True):
    v = rng.uniform(.95, 1.05)
    return comp([(modal([430 * v, 960 * v, 1650 * v, 2400 * v], [9, 13, 18, 25], [1, .6, .35, .15], .5), 0, 1),
                 (rustle(.15, 300, 3000, 20), 0, .3 if big else .15)], .5)


def page_flip_fast(n=12):
    out = np.zeros(int((n * .045 + .1) * SR))
    t = 0.0
    for k in range(n):
        b = burst(.03, 800, 7000, .001, 90) * (1 - k / n * .6)
        i = int(t * SR)
        out[i:i + len(b)] += b
        t += rng.uniform(.035, .045)
    return norm(out)


def book_close():
    return comp([(modal([150, 320], [30, 45], [1, .4], .3), 0, .9), (burst(.12, 300, 2500, .002, 25), 0, .5)], .32)


def fwump():
    return comp([(burst(.4, 50, 500, .05, 6), 0, 1), (rustle(.35, 500, 4000, 10), .05, .4)], .45)


def drip():
    t = tt(.12)
    f = 1100 * (1 + 1.2 * np.minimum(t, .03) / .03)
    return norm(taper(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-28 * t) * np.minimum(1, t / .001)))


def muffle(x):
    y = soft_lp(x, 1100, 2)
    d = int(.06 * SR)
    z = np.concatenate([y, np.zeros(d)])
    z[d:] += .3 * y
    return norm(z)


def whoosh(dur=1.2, f0=250, f1=5000):
    n = int(dur * SR)
    x = rng.standard_normal(n + 2048)
    out = np.zeros(n + 2048)
    win = np.hanning(2048)
    freqs = np.fft.rfftfreq(2048, 1 / SR)
    for s0 in range(0, n, 512):
        c = f0 * (f1 / f0) ** (s0 / n)
        mask = np.exp(-0.5 * (np.log2(np.maximum(freqs, 1) / c) / 0.6) ** 2)
        out[s0:s0 + 2048] += np.fft.irfft(np.fft.rfft(x[s0:s0 + 2048] * win) * mask, 2048) * win
    return norm(out[:n] * np.sin(np.linspace(0, np.pi, n)) ** 1.5)


def dust(dur=4.0):
    n = int(dur * SR)
    out = np.zeros(n)
    for _ in range(45):
        b = modal([rng.uniform(6000, 10000)], [rng.uniform(60, 120)], None, .04)
        i = int(rng.uniform(0, dur - .05) * SR)
        out[i:i + len(b)] += b * rng.uniform(.2, 1)
    air = norm(fft_filter(rng.standard_normal(n), 5000, 12000)) * .3
    return norm((out + air) * np.sin(np.linspace(0, np.pi, n)))


def swell(dur):
    t = tt(dur)
    x = np.sin(2 * np.pi * 55 * t) + .7 * np.sin(2 * np.pi * 82.4 * t) + .25 * np.sin(2 * np.pi * 164.8 * t)
    x = x + .4 * norm(fft_filter(rng.standard_normal(len(t)), 100, 900))
    e = np.minimum(1, t / (dur * .6)) ** 2 * np.minimum(1, (dur - t) / .8)
    return norm(x * e)


# --- location beds (stereo) ----------------------------------------
def shaped_noise(n, slope, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / np.maximum(f, 20) ** slope
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, n)


def unit_rms(x):
    return x / max(1e-12, np.sqrt(np.mean(x ** 2)))


def room_bed(dur):
    n = int(dur * SR)
    return unit_rms(np.stack([shaped_noise(n, .5, 40, 3000), shaped_noise(n, .5, 40, 3000)], axis=1))


def wind_bed(dur):
    n = int(dur * SR)
    g = (np.clip(smooth_rand(n, .25), 0, None) ** 2 * .85 + .15)
    return unit_rms(np.stack([shaped_noise(n, 1.0, 120, 1200) * g, shaped_noise(n, 1.0, 120, 1200) * g], axis=1))


def fridge_bed(dur):
    t = tt(dur)
    x = (.4 * np.sin(2 * np.pi * 60 * t) + np.sin(2 * np.pi * 120 * t) + .3 * np.sin(2 * np.pi * 180 * t)
         + .15 * np.sin(2 * np.pi * 240 * t)) * (1 + .05 * np.sin(2 * np.pi * .3 * t))
    x = unit_rms(x) + .25 * unit_rms(shaped_noise(len(t), .5, 80, 400))
    return unit_rms(np.stack([x, x], axis=1))


def chirp_sig(f0, f1, dur, h=.15):
    t = tt(dur)
    f = f0 * (f1 / f0) ** (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) + h * np.sin(2 * ph)) * np.sin(np.pi * t / dur) ** 2


def bird_phrase():
    style = rng.integers(0, 3)
    parts = []
    t = 0.0
    if style == 0:
        base = rng.uniform(3800, 5200)
        for _ in range(rng.integers(2, 5)):
            parts.append((chirp_sig(base, base * .68, .06), t, 1.0))
            t += rng.uniform(.1, .14)
    elif style == 1:
        base = rng.uniform(3000, 3800)
        for _ in range(rng.integers(7, 12)):
            parts.append((chirp_sig(base, base * 1.25, .025), t, .8))
            t += .035
    else:
        a = rng.uniform(2300, 2900)
        parts += [(chirp_sig(a, a * 1.12, .16), 0, 1), (chirp_sig(a * .8, a * .78, .2), .2, .9)]
        t = .42
    return comp(parts, t + .3)


def scatter_bed(dur, make, every, jitter, pans=(-.7, .7), gains=(.35, 1.0)):
    """Place events from make() at random times (mean spacing `every` seconds)."""
    n = int(dur * SR)
    out = np.zeros((n, 2))
    t = rng.uniform(0, every)
    while t < dur - .3:
        s = make()
        p = rng.uniform(*pans)
        g = rng.uniform(*gains)
        l = np.cos((p + 1) * np.pi / 4) * np.sqrt(2)
        r = np.sin((p + 1) * np.pi / 4) * np.sqrt(2)
        i = int(t * SR)
        s = s[: n - i]
        out[i:i + len(s), 0] += s * l * g
        out[i:i + len(s), 1] += s * r * g
        t += max(.08, every * rng.uniform(1 - jitter, 1 + jitter))
    return out / max(1e-9, np.abs(out).max())


def crickets_bed(dur, n_crickets=3):
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for _ in range(n_crickets):
        fc = rng.uniform(4200, 4900)
        per = rng.uniform(.5, .75)
        pan = rng.uniform(-.8, .8)
        g = rng.uniform(.4, 1)
        pt = tt(.018)
        pulse = np.sin(2 * np.pi * fc * pt) * np.sin(np.pi * pt / .018) ** 2
        ch = np.zeros(int(.1 * SR))
        for k in range(3):
            i = int(k * .03 * SR)
            ch[i:i + len(pulse)] += pulse
        l = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
        r = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        t = rng.uniform(0, per)
        while t < dur - .12:
            i = int(t * SR)
            out[i:i + len(ch), 0] += ch * l * g
            out[i:i + len(ch), 1] += ch * r * g
            t += per * rng.uniform(.92, 1.08)
    return out / max(1e-9, np.abs(out).max())


def bed(make, t0, t1, gain_db, fade_in=.3, fade_out=.3):
    sig = make(t1 - t0)
    n = len(sig)
    e = np.ones(n)
    fi, fo = int(fade_in * SR), int(fade_out * SR)
    if fi:
        e[:fi] = np.linspace(0, 1, fi)
    if fo:
        e[-fo:] = np.minimum(e[-fo:], np.linspace(1, 0, fo))
    place(amb, sig * e[:, None], t0, gain_db=gain_db + AMB_GAIN)


def ticks(t0, t1, gain_db, pan):
    k = int(np.ceil(t0 - .37))
    while k + .37 < t1:
        fx(tick(k % 2 == 1), k + .37, pan, gain_db + rng.uniform(-1, 1))
        k += 1


def phone_taps(t0, t1, gain_db=-30, pan=-.15, swipes=True):
    t = t0 + rng.uniform(.2, .8)
    while t < t1 - .1:
        fx(tap(), t, pan, gain_db + rng.uniform(-2, 1))
        if swipes and rng.uniform() < .5:
            fx(swipe(), t + .03, pan, gain_db - 4)
        t += rng.uniform(.6, 1.8)


def steps_at(rate, f0, f1, offset=np.pi / 2):
    """Frames where a walk cycle with phase = f * rate puts a foot down."""
    out = []
    k = int(np.ceil((f0 * rate - offset) / np.pi))
    while True:
        f = (offset + k * np.pi) / rate
        if f > f1:
            break
        if f >= f0:
            out.append(f)
        k += 1
    return out


def ramp(f, a, b, lo=0.0, hi=1.0):
    u = 0.0 if f <= a else 1.0 if f >= b else (f - a) / (b - a)
    return lo + (hi - lo) * u


def ease(u):
    return u * u * (3 - 2 * u)


# =================================================================== AMBIENCE
LIVING = ('S1', 'A2-dust')
bed(room_bed, start(LIVING[0]), end(LIVING[1]), -54)
bed(wind_bed, start(LIVING[0]), end(LIVING[1]), -53)
ticks(start('S1'), end('A2-dust'), -34, .28)
cue(start('S1'), 'Living room: room tone, winter wind outside, wall clock ticking (runs through Act 1–2)')

bed(room_bed, start('S6'), end('S10'), -54)
for sid, g in [('S6', -46), ('S7', -52), ('S8', -50), ('S10', -46)]:
    bed(fridge_bed, start(sid), end(sid), g, .05, .05)
bed(lambda d: scatter_bed(d, bird_phrase, 2.6, .5), start('S6'), end('S6'), -31, .5, .1)
bed(lambda d: scatter_bed(d, bird_phrase, 3.0, .5), start('S10'), end('S10'), -32, .2, .5)
cue(start('S6'), 'Kitchen (winter morning): room tone, fridge hum, a few birds outside')

for a, b in [('S11', 'S14'), ('S16', 'S16'), ('S19', 'S19')]:
    bed(room_bed, start(a), end(b), -54)
    ticks(start(a), end(b), -31 if a == 'S16' else -35, .08)
cue(start('S11'), 'Hallway: room tone, hallway clock ticking')

bed(room_bed, start('S15'), end('S15-bookmark'), -55)
bed(wind_bed, start('S15'), end('S15-bookmark'), -56)
cue(start('S15'), "Mia's room (winter): soft room tone, wind outside")

beat = 4.0
bed(wind_bed, start('S17'), start('S17') + beat, -53, .2, .3)
bed(lambda d: scatter_bed(d, drip, .9, .4, (-.4, .4), (.5, 1)), start('S17') + beat, start('S17') + 2 * beat, -27, .2, .3)
bed(lambda d: crickets_bed(d), start('S17') + 2 * beat, end('S17'), -34, .3, .6)
bed(room_bed, start('S17'), end('S17'), -55)
cue(start('S17'), 'Time passing: winter wind → melting drips → spring crickets')

bed(room_bed, start('S18'), end('S18'), -54)
bed(fridge_bed, start('S18'), end('S18'), -46)
bed(lambda d: scatter_bed(d, bird_phrase, .8, .6), start('S18'), end('S18'), -26, .4, .4)
cue(start('S18'), 'Kitchen (spring morning): fridge hum, lots of birds')

bed(room_bed, start('S20-end'), end('S20-again'), -55)
bed(lambda d: crickets_bed(d), start('S20-end'), end('S20-again'), -35)
bed(lambda d: crickets_bed(d, 5), start('S21'), end('S21') + 2.5, -30, .3, 2.5)
bed(wind_bed, start('S21'), end('S21'), -55, .3, 1.5)
cue(start('S21'), 'Night street: crickets, light wind (crickets fade into the end card)')

# =================================================================== FOLEY, shot by shot
# S1 — Mia runs in with the book; Dad scrolls
for f in steps_at(.5, 0, 44, 0):
    x = 2100 - 770 * (1 - (1 - f / 45) ** 3)
    fx(step('kid', soft=x < 1750), at('S1', f), px(x), -21 + far(x))
cue(start('S1'), "Mia's running footsteps")
fx(paper(.35), at('S1', 44), px(1330), -24)
phone_taps(start('S1'), end('S1'))
fx(ui_blip(), at('S1', 128), .6, -26)
cue(at('S1', 128), 'SCREEN TIME widget appears (blip)')

# S2 — thumb on the feed
for k in range(0, 8):
    f = 24 * k + 1
    if f < 180:
        fx(tap(), at('S2', f), .1, -27)
        fx(swipe(), at('S2', f + 2), .1, -30)
fx(pop(), at('S2', 50), .15, -27)
fx(pop(), at('S2', 122), .15, -28)
fx(whoosh(1.9, 300, 3500), at('S2', 78), 0, -24)
cue(start('S2'), 'Phone taps and swipes, "like" pops, a time-passing whoosh as 20:02 becomes 20:47')

# S3 — waiting: feet swing, the clock jumps, the swinging stops
fx(clunk(), at('S3', 84), .28, -21)
for k in range(20):
    f = (np.pi / 2 + k * np.pi) / .32
    if f < 148:
        fx(rustle(.18, 600, 5000, 12), at('S3', f), .05 * (-1) ** k, -29)
fx(rustle(.4, 500, 5000, 8), at('S3', 150), 0, -27)
ticks(start('S3'), end('S3'), -27, .28)  # the clock is louder in this shot
phone_taps(start('S3'), end('S3'), -36, -.7, False)
cue(start('S3'), 'Feet swinging, louder clock, minute hand clunk, then the swinging stops')

# S4 — he looks up, covers her, carries her off; the book stays
phone_taps(start('S4'), at('S4', 38), -30)
fx(rustle(.3, 600, 5000, 10), at('S4', 44), -.2, -27)
fx(fwump(), at('S4', 128), -.15, -20)
for k, f in enumerate([136, 146]):
    fx(step('adult', soft=True), at('S4', f), -.05 + .2 * k, -22)
fx(knock(), at('S4', 150), .25, -27)  # knee on the rug
fx(rustle(.9, 400, 5000, 7), at('S4', 152), .3, -20)
cue(at('S4', 128), 'Dad gets up from the sofa, kneels, blanket rustle')
fx(rustle(.6, 400, 5000, 8), at('S4', 222), .25, -22)
for f in steps_at(.3, 226, 294):
    x = 1250 - ramp(f, 226.2, 294.2) * 1550
    fx(step('adult', soft=900 < x < 1750), at('S4', f), px(x), -17 - 7 * ramp(f, 226, 294))
cue(at('S4', 226), 'Dad carries Mia away — footsteps fade out left')
fx(muffle(latch()), at('S4', 330), -.9, -26)
cue(at('S4', 330), 'Distant door latch (he puts her to bed)')

# S5 — bookmark
fx(page_turn(), at('S5', 2), 0, -18)
cue(start('S5'), 'Page turn on every bookmark insert (page 3, 3, 3, 7, 12/31/58, THE END)')

# Act 2 — each night opens with the phone waking up
for sid in ['A2-Mon-lock', 'A2-Tue-lock', 'A2-Thu-lock', 'A2-Fri-lock']:
    fx(tap(), at(sid, 6), 0, -24)
    fx(ui_blip(), at(sid, 8), 0, -27)
cue(start('A2-Mon-lock'), 'Lock screens: phone wake tap + blip each night')
phone_taps(start('A2-Mon'), end('A2-Mon'))
# Tuesday
for f in steps_at(.42, 0, 40):
    x = 2100 - ramp(f, 0, 40) * 770
    fx(step('kid', soft=x < 1750), at('A2-Tue', f), px(x), -21 + far(x))
fx(paper(.35), at('A2-Tue', 42), px(1330), -24)
cue(start('A2-Tue'), "Tuesday: Mia's footsteps, book raised and lowered (paper)")
fx(paper(.3), at('A2-Tue', 144), px(1330), -27)
phone_taps(start('A2-Tue'), end('A2-Tue'))
fx(page_turn(), at('A2-Tue-bookmark', 2), 0, -19)
# Thursday — slower, softer steps; her head drops
for f in steps_at(.28, 0, 60):
    x = 2100 - ramp(f, 0, 60) * 770
    fx(step('kid', soft=True), at('A2-Thu', f), px(x), -21 + far(x))
fx(rustle(.5, 500, 4500, 6), at('A2-Thu', 252), px(1330), -26)
cue(start('A2-Thu'), 'Thursday: slower, softer footsteps; a small rustle as her head drops')
phone_taps(start('A2-Thu'), end('A2-Thu'))
# Friday — she walks past without asking
for f in steps_at(.36, 6, 204):
    x = 2050 - ramp(f, 6, 204.6) * 2350
    fx(step('kid', soft=910 < x < 1750), at('A2-Fri', f), px(x), -22 + far(x))
phone_taps(start('A2-Fri'), end('A2-Fri'), -29)
cue(start('A2-Fri'), "Friday: only Mia's footsteps passing and Dad's taps")
fx(page_turn(), at('A2-dust', 2), 0, -19)
fx(dust(4.0), at('A2-dust', 20), 0, -25)
cue(start('A2-dust'), 'Dust settles on page 3 (shimmer)')

# Act 3 — the mirror
for f in steps_at(.28, 0, 180):
    x = -150 + ease(ramp(f, 0, 180)) * 1130
    fx(step('slipper'), at('S6', f), px(x), -20 + far(x))
fx(clink(), at('S6', 186), px(980), -24)
phone_taps(at('S6', 200), end('S6'), -31, px(940), False)
cue(start('S6'), 'Dad shuffles in wearing slippers, mug clink')
fx(swell(end('S7') - start('S7') + .5), start('S7'), 0, -26)
cue(start('S7'), 'The drawing: kitchen goes quiet, low swell')
fx(rustle(1.4, 500, 4000, 6), at('S8', 2), -.1, -27)
fx(slosh(), at('S8', 50), -.15, -24)
fx(clink(), at('S8', 51), -.15, -30)
for k in range(5):
    fx(heartbeat(), at('S8', 112) + k * .95, 0, -22 + 2 * min(k, 2))
cue(at('S8', 50), 'Mug stops mid-air (slosh), heartbeat')
for k in range(3):
    fx(flash_hit(), at('S9', 36 * k) - PRE, 0, -18)
fx(muffle(tick()), at('S9', 8), .3, -24)
fx(muffle(tick(True)), at('S9', 22), .3, -24)
for k in range(3):
    fx(muffle(step('kid')), at('S9', 76 + 9 * k), -.5 + .2 * k, -24)
cue(start('S9'), 'Flashbacks: three flash hits with muffled echoes (clock, footsteps)')
fx(buzz(.25, False), at('S10', 22), -.1, -25)
fx(ding(), at('S10', 24), -.1, -22)
for k in range(2):
    fx(heartbeat(), at('S10', 105) + k * .95, 0, -24)
cue(at('S10', 24), 'Weekly report: vibrate + ding, two heartbeats')

# Act 4 — one small step
fx(cardboard(), at('S11', 3), 0, -18)
fx(rustle(.3, 300, 3000, 28, 1.5), at('S11', 6), 0, -24)
fx(cap_pop(), at('S11', 13), .2, -22)
strokes = [(20, [.62, .6]), (57.3, [.42, .7]), (94.7, [.26, .26, .26, .3])]
for f0, segs in strokes:
    t = at('S11', f0)
    for d in segs:
        fx(squeak(d), t, .15, -27)
        t += d + .05
fx(cap_on(), at('S11', 138), .2, -24)
fx(cardboard(1.1), at('S11', 190), -.1, -19)
cue(start('S11'), 'Box set down, marker cap off, "8 PM" squeaks stroke by stroke, cap on, box onto the shelf')
for cyc in range(3):
    for k, m in enumerate([84, 88, 91, 88]):
        t = start('S12') + .1 + cyc * .8 + k * .14
        if t < at('S12', 74):
            fx(marimba(m), t, 0, -25)
fx(tap(), at('S12', 75), 0, -24)
fx(marimba(79), at('S12', 77), 0, -28)
fx(marimba(72), at('S12', 81), 0, -28)
cue(start('S12'), 'PHONE BOX alarm (gentle marimba), tap STOP')
fx(rustle(1.6, 500, 4500, 6), at('S13', 8), -.1, -27)
fx(cardboard(.6), at('S13', 70), 0, -21)
fx(plastic_clack(), at('S13', 70), 0, -23)
fx(cardboard(1.2), at('S13', 120), 0, -21)
fx(power_down(), at('S13', 116), .6, -20)
cue(at('S13', 70), 'Phone into the box, lid closes, widget powers down')
for f in steps_at(.32, 0, 90):
    x = 200 + ease(ramp(f, 0, 90)) * 1020
    fx(step('adult', soft=True), at('S14', f), px(x), -21)
for k, f in enumerate([98.6, 104.3, 110.0, 115.7, 121.4, 127.1]):
    fx(knock(), at('S14', f), .35, -19 if k < 3 else -22)
fx(latch(), at('S14', 203), .4, -21)
fx(creak(.75), at('S14', 205), .4, -19)
fx(shimmer(), at('S14', 232), .3, -21)
cue(start('S14'), 'Footsteps to her door, knocks, door latch + creak, warm shimmer as she smiles')
fx(rustle(.6, 400, 4500, 7), at('S15', 6), -.1, -25)
fx(page_turn(), at('S15', 48), -.1, -21)
fx(page_turn(), at('S15', 132), -.1, -21)
fx(page_turn(), at('S15-bookmark', 2), 0, -19)
fx(paper(.4), at('S15-bookmark', 30), 0, -25)
cue(start('S15'), 'Reading in bed: blanket, page turns')
t = at('S16', 15)
while t < at('S16', 285) - .1:
    d = min(.4, at('S16', 285) - t)
    fx(buzz(d), t, .25, -23)
    t += 1.0
fx(rustle(2.6, 500, 4500, 5), at('S16', 30), -.2, -28)
fx(muffle(bed_creak()), at('S16', 214), .9, -24)
fx(muffle(page_turn()), at('S16', 226), .9, -24)
fx(rustle(.4, 500, 4500, 8), at('S16', 285), -.2, -25)
cue(at('S16', 15), 'The box buzzes and rattles on the shelf; Mia bouncing in her room (muffled); buzzing stops when he pulls back')
for k in range(3):
    fx(page_turn(), at('S17', (k * 4 + 2.2) * 30), 0, -19)
    fx(ui_blip(False), at('S17', (k * 4 + .3) * 30), .6, -26)
fx(whoosh(1.4, 4000, 300), at('S17', 3.3 * 30), 0, -24)
fx(whoosh(1.4, 4000, 300), at('S17', 7.3 * 30), 0, -24)
cue(start('S17'), 'Montage: page turns, widget ticks down, time whooshes between seasons')

# Act 5 — payoff
fx(clink(), at('S18', 14), .4, -23)
fx(shimmer(), at('S18', 44), .3, -26)
cue(start('S18'), 'Mug clink, soft shimmer as Dad smiles at the new drawing')
fx(clock_strike(), at('S19', 4), .08, -22)
cue(start('S19'), 'Clock strikes 8')
for f in steps_at(.42, 0, 110):
    x = 1480 - ease(ramp(f, 0, 110)) * 550
    fx(step('kid', soft=True), at('S19', f), px(x), -23)
fx(rustle(.6, 600, 5000, 9), at('S19', 116), px(930), -26)
fx(plastic_clack(), at('S19', 170), px(820), -20)
fx(cardboard(.6), at('S19', 170), px(820), -24)
for f in steps_at(.32, 170, 240):
    x = -200 + ease(ramp(f, 170, 240)) * 740
    fx(step('adult', soft=True), at('S19', f), px(x), -20 + far(x))
cue(at('S19', 170), 'Mia drops her tablet into the box; Dad walks in')
fx(page_turn(), at('S20-end', 2), 0, -19)
fx(book_close(), at('S20-end', 100), 0, -18)
cue(at('S20-end', 100), 'The book closes')
for k in range(20):
    f = k * np.pi / .35
    if f < 178:
        fx(bed_creak(f < 80), at('S20-again', f), .05, -21 if f < 80 else -30)
fx(page_flip_fast(), at('S20-again', 108), -.1, -19)
cue(start('S20-again'), 'Bed springs as Mia bounces, pages flipped back to the start')
for tt_ in [1.5, 3.2, 5.0, 7.4, 9.1]:
    fx(muffle(ding()), start('S21') + tt_, rng.uniform(-.7, .7), -34)
cue(start('S21'), 'Faint notification pings from the neighbours\' windows')

# --- short room reverb on the foley bus ----------------------------
def reverb(x, rt=.45, wet_db=-16):
    n_ir = int(rt * 1.2 * SR)
    t = np.arange(n_ir) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(n_ir) * np.exp(-6.9 * t / rt)
        ir = soft_lp(ir, 5000, 1)
        ir[: int(.012 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = conv(x[:, ch], ir)[: len(x)]
    return out * db(wet_db)


sfx = foley + reverb(foley) + amb


# ------------------------------------------------------------------ write
def write(path, buf):
    data = (np.clip(buf, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


out = os.path.join(ROOT, 'public', 'audio')
os.makedirs(out, exist_ok=True)
# Music is normalised to a -6 dBFS peak; the SFX stem keeps its designed level relative to it.
music *= 0.5 / np.abs(music).max()
pk = np.abs(sfx).max()
if pk > 0.97:
    sfx *= 0.97 / pk
write(os.path.join(out, 'placeholder_music.wav'), music)
write(os.path.join(out, 'sfx.wav'), sfx)


# ------------------------------------------------------------------ cue sheet
def shot_of(t):
    for sid, (a, b) in T.items():
        if a <= t < b:
            return sid
    return '-'


lines = ['# SCROLL — sound effects cue sheet', '',
         'Generated by `scripts/make_audio.py` (all sounds synthesised; no samples). Times are film time.', '',
         '| Time | Shot | Sound |', '|---|---|---|']
for t, text in sorted(CUES):
    lines.append(f'| {int(t // 60)}:{t % 60:04.1f} | {shot_of(t)} | {text} |')
open(os.path.join(ROOT, 'SFX_CUES.md'), 'w').write('\n'.join(lines) + '\n')
print(f'shots={len(shots)} total={TOTAL:.1f}s  sfx peak={pk:.2f}  cues={len(CUES)}')
