"""
Shared, sample-free sound synthesis for Little Choices films (music instruments, SFX generators,
location beds, a simple room reverb and a timeline-aware mixer). Used by make_audio_later.py.
All generators return mono float arrays with peak 1.0; beds return stereo arrays.
"""
import os
import re
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(11)


# ------------------------------------------------------------------ basics
def db(x):
    return 10 ** (x / 20)


def norm(x):
    m = np.abs(x).max()
    return x / m if m > 0 else x


def tt(dur):
    return np.arange(max(1, int(round(dur * SR)))) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


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
    k = max(1, int(len(x) * frac))
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


def unit_rms(x):
    return x / max(1e-12, np.sqrt(np.mean(x ** 2)))


# ------------------------------------------------------------------ music instruments
def piano(midi, vel=0.5, dur=3.0):
    f = hz(midi)
    t = tt(dur)
    out = np.zeros_like(t)
    for k, a in enumerate([1, 0.45, 0.25, 0.12, 0.06, 0.03], start=1):
        fk = f * k * (1 + 0.0004 * k * k)
        if fk > 12000:
            break
        out += a * np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.1 + 0.7 * k) * (f / 400) ** 0.3)
    return out * np.minimum(1, t / 0.004) * np.minimum(1, (dur - t) / 0.08) * vel * 0.25


def pad(midis, dur, level=0.1, bright=3, attack=1.5, release=1.5):
    t = tt(dur)
    L = np.zeros_like(t)
    R = np.zeros_like(t)
    for m in midis:
        f = hz(m)
        for k in range(1, bright + 1):
            a = 1 / (k ** 1.6)
            L += a * np.sin(2 * np.pi * f * k * 0.9985 * t + m)
            R += a * np.sin(2 * np.pi * f * k * 1.0015 * t + 2 * m)
    env = np.minimum(1, t / attack) * np.minimum(1, np.maximum(0, (dur - t) / release))
    trem = 1 + 0.06 * np.sin(2 * np.pi * 0.23 * t)
    s = level / max(1, len(midis))
    return np.stack([L * env * trem * s, R * env * trem * s], axis=1)


# ------------------------------------------------------------------ SFX generators (mono, peak 1)
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


def tone(f, dur, level=1.0):
    t = tt(dur)
    return np.sin(2 * np.pi * f * t) * np.minimum(1, t / .01) * np.minimum(1, (dur - t) / .02) * level


def step(kind='adult', soft=False, snow=False):
    v = rng.uniform(0.9, 1.1)
    if snow:
        n = int(.22 * SR)
        crunch = fft_filter(rng.standard_normal(n), 900, 7000) * (np.clip(smooth_rand(n, 60), 0, None) ** 3) * env_ad(n, .015, 11)
        x = comp([(norm(crunch), 0, .9), (modal([80 * v], [30], None, .15), 0, .4)], .24)
    elif kind == 'kid':
        x = comp([(modal([150 * v, 330 * v], [50, 80], [1, .3], .12), 0, .7), (burst(.05, 600, 5000, .0008, 80), .002, .5)], .14)
    elif kind == 'slipper':
        x = comp([(burst(.18, 900, 6500, .035, 16), 0, .6), (modal([95 * v], [40], None, .12), .02, .5)], .22)
    else:
        x = comp([(modal([88 * v, 176 * v], [32, 55], [1, .35], .2), 0, .8), (burst(.07, 300, 3500, .0008, 55), .001, .55),
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


def tap():
    return comp([(burst(.018, 1800, 8000, .0004, 260), 0, .7), (modal([190], [90], None, .05), 0, .4)], .05)


def type_click():
    return comp([(burst(.012, 2000, 9000, .0003, 400), 0, .7), (modal([rng.uniform(900, 1400)], [220], None, .03), 0, .3)], .035)


def swipe():
    n = int(.13 * SR)
    return norm(fft_filter(rng.standard_normal(n), 2500, 9000) * np.sin(np.linspace(0, np.pi, n)) ** 2)


def ui_blip(up=True):
    return glide(900, 1500, .09, 25) if up else glide(1300, 800, .12, 20)


def send_whoosh():
    return comp([(glide(700, 1600, .14, 12, .1), 0, .6), (burst(.14, 2000, 8000, .02, 18), 0, .4)], .16)


def receive_pop():
    return comp([(modal([1568, 2093], [18, 24], [1, .6], .3), 0, 1), (modal([2093], [20], None, .25), .08, .7)], .36)


def end_call_tone():
    return comp([(tone(620, .14), 0, 1), (tone(480, .18), .18, 1)], .4)


def ringback():
    """What the caller hears: two short tones, a pause."""
    return comp([(tone(440, .4, .6) + tone(480, .4, .4), 0, 1), (tone(440, .4, .6) + tone(480, .4, .4), .6, 1)], 1.0)


def ringtone():
    """Mom's phone ringing (a soft melodic ring)."""
    parts = []
    for k, m in enumerate([76, 79, 84, 79]):
        parts.append((modal([hz(m), hz(m) * 2.76], [9, 18], [1, .3], .35), k * .14, 1))
    return comp(parts, .9)


def pickup_click():
    return comp([(modal([1800, 3100], [200, 260], None, .04), 0, .8), (burst(.02, 500, 4000, .0005, 200), 0, .5)], .05)


def buzz(dur=0.4, rattle=True, surface='table'):
    t = tt(dur)
    sq = np.sign(np.sin(2 * np.pi * 155 * t))
    x = fft_filter(0.5 * sq + 0.5 * np.sin(2 * np.pi * 310 * t), 100, 2500)
    x = x / np.abs(x).max()
    if rattle:
        r = fft_filter(rng.standard_normal(len(t)), 500 if surface == 'table' else 300, 3500) * (0.5 + 0.5 * sq)
        x = x + 0.6 * r / np.abs(r).max()
    return norm(x * np.minimum(1, t / .01) * np.minimum(1, (dur - t) / .02))


def thunk(f=140, dur=.2, d=30):
    return comp([(modal([f, f * 2.1], [d, d * 1.6], [1, .4], dur), 0, .9), (burst(.03, 300, 3000, .0005, 120), 0, .4)], dur)


def keys_jingle():
    parts = []
    for k in range(5):
        parts.append((modal([rng.uniform(2800, 5200), rng.uniform(5600, 8800)], [25, 40], [1, .5], .5), rng.uniform(0, .18), rng.uniform(.4, 1)))
    return comp(parts, .7)


def door_close():
    return comp([(modal([95, 190, 410], [18, 30, 50], [1, .5, .25], .5), 0, 1), (burst(.05, 200, 2500, .001, 60), 0, .5), (modal([2600, 4100], [180, 240], None, .05), .02, .25)], .55)


def latch():
    return comp([(modal([2800, 4500, 6200], [240, 300, 380], [1, .6, .3], .05), 0, .8), (modal([900], [60], None, .1), .015, .4)], .12)


def creak(dur=.8):
    n = int(dur * SR)
    imp = np.zeros(n)
    pos = 0.0
    while pos < dur:
        imp[min(n - 1, int(pos * SR))] += rng.uniform(.6, 1.0)
        pos += 1 / (32 + 50 * np.sin(np.pi * pos / dur) + rng.uniform(-6, 6))
    ir = modal([520, 1130, 1760, 2600], [70, 90, 120, 150], [1, .7, .4, .2], .05)
    return norm(conv(imp, ir)[:n] * np.sin(np.linspace(0, np.pi, n)) ** .5)


def knock():
    return comp([(modal([115, 240, 470], [30, 45, 70], [1, .55, .25], .22), 0, .9), (burst(.02, 300, 3000, .0005, 140), 0, .5)], .24)


def fridge_open():
    """Rubber seal pop + a short airy release."""
    return comp([(burst(.06, 200, 1500, .002, 45), 0, .9), (burst(.35, 1500, 7000, .02, 9), .03, .35)], .4)


def fridge_close():
    return comp([(modal([75, 160], [22, 35], [1, .4], .35), 0, 1), (burst(.04, 300, 2500, .001, 80), 0, .5)], .38)


def note_peel():
    n = int(.18 * SR)
    x = fft_filter(rng.standard_normal(n), 1500, 9000) * (np.clip(smooth_rand(n, 90), 0, None) ** 4) * np.linspace(1, .3, n)
    return norm(x)


def note_stick():
    return comp([(burst(.03, 400, 4000, .001, 120), 0, .8), (modal([260], [60], None, .08), 0, .3)], .08)


def marker_squeak(dur):
    t = tt(dur)
    f = 2050 + 300 * np.sin(2 * np.pi * rng.uniform(1.5, 3.5) * t + rng.uniform(0, 6)) + 150 * (smooth_rand(len(t), 10) - .5)
    ph = 2 * np.pi * np.cumsum(f) / SR
    grit = fft_filter(rng.standard_normal(len(t)), 2500, 9000)
    grit /= np.abs(grit).max() + 1e-9
    amp = .45 + .55 * np.clip(smooth_rand(len(t), 7), 0, 1)
    e = np.minimum(1, t / .03) * np.minimum(1, (dur - t) / .04)
    return norm((.55 * (np.sin(ph) + .3 * np.sin(2 * ph)) + .3 * grit) * amp * e)


def pen_scratch(dur):
    n = int(dur * SR)
    x = fft_filter(rng.standard_normal(n), 2500, 10000) * (0.4 + 0.6 * np.clip(smooth_rand(n, 18), 0, None) ** 2)
    return norm(x * np.minimum(1, np.arange(n) / (.02 * SR)) * np.minimum(1, (n - np.arange(n)) / (.03 * SR)))


def needle_click():
    return modal([rng.uniform(3000, 3600), rng.uniform(5200, 6400)], [260, 340], [1, .5], .05)


def heartbeat():
    return comp([(modal([52, 104], [11, 20], [1, .25], .35), 0, 1), (burst(.05, 80, 450, .002, 40), 0, .35),
                 (modal([64, 128], [14, 24], [1, .2], .3), .22, .7), (burst(.04, 80, 450, .002, 45), .22, .25)], .6)


PRE = 0.45


def flash_hit():
    n_pre = int(PRE * SR)
    sw = norm(fft_filter(rng.standard_normal(n_pre), 300, 7000) * np.linspace(0, 1, n_pre) ** 3)
    t = tt(1.6)
    ring = np.sin(2 * np.pi * 2900 * t) * np.exp(-2.2 * t) * 0.12
    return comp([(sw, 0, .6), (modal([70, 140], [18, 30], None, .6), PRE, .8), (burst(.25, 1000, 9000, .001, 14), PRE, .5), (ring, PRE, 1.0)], PRE + 1.6)


def shimmer():
    parts = []
    for k, m in enumerate([72, 76, 79, 84, 88]):
        f = hz(m)
        parts.append((modal([f, 2.01 * f, 3.02 * f], [2.2, 3.5, 5.0], [1, .3, .1], 2.0), k * .07, 1.0 - k * .08))
    return comp(parts, 2.4)


def bell(f=880, dur=2.5):
    return modal([f, 2.0 * f, 2.76 * f, 5.4 * f], [1.6, 2.4, 3.2, 5], [1, .5, .35, .15], dur)


def school_bell(dur=1.0):
    t = tt(dur)
    x = np.sign(np.sin(2 * np.pi * 24 * t)) * 0.5 + 0.5
    ring = modal([1240, 2480, 3420], [6, 9, 12], [1, .4, .2], dur)
    return norm(ring * (0.4 + 0.6 * x))


def train_horn(dur=1.4):
    t = tt(dur)
    x = np.zeros_like(t)
    for f in (311, 370, 466):
        x += np.sign(np.sin(2 * np.pi * f * t)) * 0.3 + np.sin(2 * np.pi * f * 2 * t) * 0.1
    x = soft_lp(x, 1800, 2)
    return norm(x * np.minimum(1, t / .08) * np.minimum(1, (dur - t) / .3))


def clink():
    return modal([2350, 3870, 5600, 7900, 9800], [12, 16, 22, 30, 40], [1, .7, .5, .3, .15], 1.0)


def cutlery():
    return modal([rng.uniform(3200, 4200), rng.uniform(6000, 7600)], [60, 90], [1, .5], .25)


def chair_scrape(dur=.5):
    n = int(dur * SR)
    x = fft_filter(rng.standard_normal(n), 250, 2500) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 38 * np.arange(n) / SR)))
    return norm(x * np.sin(np.linspace(0, np.pi, n)) ** 0.6)


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


def swell(dur):
    t = tt(dur)
    x = np.sin(2 * np.pi * 55 * t) + .7 * np.sin(2 * np.pi * 82.4 * t) + .25 * np.sin(2 * np.pi * 164.8 * t)
    x = x + .4 * norm(fft_filter(rng.standard_normal(len(t)), 100, 900))
    e = np.minimum(1, t / (dur * .6)) ** 2 * np.minimum(1, (dur - t) / .8)
    return norm(x * e)


def muffle(x, fc=1100):
    y = soft_lp(x, fc, 2)
    d = int(.06 * SR)
    z = np.concatenate([y, np.zeros(d)])
    z[d:] += .3 * y
    return norm(z)


# ------------------------------------------------------------------ beds (stereo)
def shaped_noise(n, slope, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / np.maximum(f, 20) ** slope
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, n)


def room_bed(dur):
    n = int(dur * SR)
    return unit_rms(np.stack([shaped_noise(n, .5, 40, 3000), shaped_noise(n, .5, 40, 3000)], axis=1))


def wind_bed(dur):
    n = int(dur * SR)
    g = np.clip(smooth_rand(n, .25), 0, None) ** 2 * .85 + .15
    return unit_rms(np.stack([shaped_noise(n, 1.0, 120, 1200) * g, shaped_noise(n, 1.0, 120, 1200) * g], axis=1))


def traffic_bed(dur):
    """Distant city: low rumble with slow passing swells."""
    n = int(dur * SR)
    g = np.clip(smooth_rand(n, .4), 0, None) ** 1.5 * .7 + .3
    return unit_rms(np.stack([shaped_noise(n, 1.2, 40, 500) * g, shaped_noise(n, 1.2, 40, 500) * g[::-1]], axis=1))


def hum_bed(dur, f0=120, noise=.25):
    t = tt(dur)
    x = (.4 * np.sin(2 * np.pi * f0 / 2 * t) + np.sin(2 * np.pi * f0 * t) + .3 * np.sin(2 * np.pi * f0 * 1.5 * t)) * (1 + .05 * np.sin(2 * np.pi * .3 * t))
    x = unit_rms(x) + noise * unit_rms(shaped_noise(len(t), .5, 80, 400))
    return unit_rms(np.stack([x, x], axis=1))


def tv_bed(dur):
    """A TV in the next room: band-limited, syllable-like modulated noise (no words)."""
    n = int(dur * SR)
    x = fft_filter(rng.standard_normal(n), 300, 2800)
    m = np.clip(smooth_rand(n, 6), 0, None) ** 2
    y = soft_lp(x * m, 1600, 2)
    return unit_rms(np.stack([y, y * .9], axis=1))


def murmur_bed(dur):
    """Restaurant room: soft band-limited crowd wash (no words)."""
    n = int(dur * SR)
    L = soft_lp(fft_filter(rng.standard_normal(n), 200, 2000) * (0.6 + 0.4 * np.clip(smooth_rand(n, 3), 0, None)), 1200, 2)
    R = soft_lp(fft_filter(rng.standard_normal(n), 200, 2000) * (0.6 + 0.4 * np.clip(smooth_rand(n, 3), 0, None)), 1200, 2)
    return unit_rms(np.stack([L, R], axis=1))


def train_bed(dur):
    """Inside a train: rumble + wheel clacks over rail joints."""
    n = int(dur * SR)
    rumble = shaped_noise(n, 1.0, 40, 700)
    clack = np.zeros(n)
    t = 0.0
    while t < dur - .2:
        for off in (0, .12):
            s = modal([110, 230], [40, 60], [1, .4], .15)
            i = int((t + off) * SR)
            s = s[: n - i]
            clack[i:i + len(s)] += s
        t += .72
    x = unit_rms(rumble) + 0.8 * unit_rms(clack)
    return unit_rms(np.stack([x, x * .95], axis=1))


# ------------------------------------------------------------------ mixer
class Mix:
    """Two stereo busses: foley (gets a short room reverb) and amb (location beds)."""

    def __init__(self, total, foley_gain=10.0, amb_gain=6.0):
        self.N = int(round(total * SR))
        self.foley = np.zeros((self.N, 2))
        self.amb = np.zeros((self.N, 2))
        self.cues = []
        self.fg = foley_gain
        self.ag = amb_gain

    def _place(self, bus, sig, t, pan=0.0, gain_db=0.0):
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
        st = st[: max(0, self.N - i)]
        bus[i:i + len(st)] += st * g

    def fx(self, sig, t, pan=0.0, gain_db=0.0):
        self._place(self.foley, sig, t, pan, gain_db + self.fg)

    def bed(self, make, t0, t1, gain_db, fade_in=.3, fade_out=.3):
        if t1 <= t0:
            return
        sig = make(t1 - t0)
        n = len(sig)
        e = np.ones(n)
        fi, fo = int(fade_in * SR), int(fade_out * SR)
        if fi:
            e[:fi] = np.linspace(0, 1, fi)
        if fo:
            e[-fo:] = np.minimum(e[-fo:], np.linspace(1, 0, fo))
        self._place(self.amb, sig * e[:, None], t0, gain_db=gain_db + self.ag)

    def cue(self, t, text):
        self.cues.append((t, text))

    def ticks(self, t0, t1, gain_db, pan=0.0):
        k = int(np.ceil(t0 - .37))
        while k + .37 < t1:
            self.fx(tick(k % 2 == 1), k + .37, pan, gain_db + rng.uniform(-1, 1))
            k += 1

    def phone_taps(self, t0, t1, gain_db=-30, pan=0.0):
        t = t0 + rng.uniform(.2, .8)
        while t < t1 - .1:
            self.fx(tap(), t, pan, gain_db + rng.uniform(-2, 1))
            if rng.uniform() < .5:
                self.fx(swipe(), t + .03, pan, gain_db - 4)
            t += rng.uniform(.6, 1.6)

    def mixdown(self, rt=.45, wet_db=-16):
        n_ir = int(rt * 1.2 * SR)
        t = np.arange(n_ir) / SR
        wet = np.zeros_like(self.foley)
        for ch in range(2):
            ir = rng.standard_normal(n_ir) * np.exp(-6.9 * t / rt)
            ir = soft_lp(ir, 5000, 1)
            ir[: int(.012 * SR)] = 0
            ir /= np.sqrt(np.sum(ir ** 2))
            wet[:, ch] = conv(self.foley[:, ch], ir)[: self.N]
        return self.foley + wet * db(wet_db) + self.amb


# ------------------------------------------------------------------ timeline + io
def read_timeline(path):
    src = open(path).read()
    shots = [(m.group(1), float(m.group(2))) for m in re.finditer(r"\{id: '([^']+)', act: '[^']+', s: ([\d.]+)", src)]
    T, t = {}, 0.0
    for sid, s in shots:
        T[sid] = (t, t + s)
        t += s
    return shots, T, t


def write_wav(path, buf):
    data = (np.clip(buf, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def write_cue_sheet(path, title, cues, T):
    def shot_of(t):
        for sid, (a, b) in T.items():
            if a <= t < b:
                return sid
        return '-'
    lines = [f'# {title} — sound effects cue sheet', '', 'Generated with the audio (all sounds synthesised; no samples). Times are film time.', '',
             '| Time | Shot | Sound |', '|---|---|---|']
    for t, text in sorted(cues):
        lines.append(f'| {int(t // 60)}:{t % 60:04.1f} | {shot_of(t)} | {text} |')
    open(path, 'w').write('\n'.join(lines) + '\n')
