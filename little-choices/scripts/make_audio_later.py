#!/usr/bin/env python3
"""
LATER — placeholder score + full sound design (synthesised, no samples).
Timing: shot starts from src/later/timeline.ts + the frame numbers used in src/later/*.tsx.
Outputs public/audio/later_music.wav, public/audio/later_sfx.wav and LATER_SFX_CUES.md.
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from audio_lib import (SR, Mix, rng, piano, pad, hz, norm, step, rustle, paper, tick, tap, type_click, ui_blip, send_whoosh,  # noqa: E402
                       receive_pop, end_call_tone, ringback, ringtone, pickup_click, buzz, thunk, keys_jingle, door_close, latch,
                       creak, knock, fridge_open, fridge_close, note_peel, note_stick, marker_squeak, pen_scratch, needle_click,
                       heartbeat, flash_hit, PRE, shimmer, bell, school_bell, train_horn, clink, cutlery, chair_scrape, whoosh,
                       swell, muffle, room_bed, wind_bed, traffic_bed, hum_bed, tv_bed, murmur_bed, train_bed, read_timeline,
                       write_wav, write_cue_sheet, fft_filter, soft_lp, tone)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
shots, T, TOTAL = read_timeline(os.path.join(ROOT, 'src', 'later', 'timeline.ts'))
N = int(round(TOTAL * SR))
start = lambda sid: T[sid][0]
end = lambda sid: T[sid][1]
at = lambda sid, fr: start(sid) + fr / 30.0


def px(x):
    return max(-0.9, min(0.9, (x - 960) / 1000))


def steps_at(rate, f0, f1, offset=np.pi / 2):
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


def ramp(f, a, b):
    return 0.0 if f <= a else 1.0 if f >= b else (f - a) / (b - a)


def ease(u):
    return u * u * (3 - 2 * u)


# =================================================================== SCORE
music = np.zeros((N, 2))


def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l = gain * np.cos((pan + 1) * np.pi / 4)
    r = gain * np.sin((pan + 1) * np.pi / 4)
    music[i:i + len(sig), 0] += sig * l
    music[i:i + len(sig), 1] += sig * r


def add_pad(sig, t, gain=1.0):
    i = int(t * SR)
    sig = sig[: max(0, N - i)]
    music[i:i + len(sig)] += sig * gain


BEAT = 60 / 66
BAR = 4 * BEAT
Dm, Bb, F, C, Gm, A = (50, 53, 57), (46, 50, 53), (53, 57, 60), (48, 52, 55), (43, 50, 55), (45, 49, 52)
Fw, Cw, Dmw, Bbw = (41, 53, 57, 60), (40, 52, 55, 60), (38, 50, 53, 57), (34, 50, 53, 58)
COLD_PROG = [Dm, Bb, F, C]
LINE_PROG = [Dm, Bb, Gm, A]
WARM_PROG = [Fw, Cw, Dmw, Bbw]


def section(t0, t1, prog, mode, pad_level, bright, vel=0.45, density=1.0):
    t = t0
    i = 0
    while t < t1 - 0.05:
        ch = prog[i % len(prog)]
        bar = min(BAR, t1 - t)
        add_pad(pad(list(ch), bar + 1.6, level=pad_level, bright=bright, attack=0.9, release=1.4), t)
        top = max(ch)
        if mode == 'later':
            # the falling "la-ter" figure, then the chord's top note held
            motif = [(0, top + 17), (0.5, top + 15), (1.0, top + 12), (2.5, ch[1] + 12)]
            for k, (bt, m) in enumerate(motif):
                if density < 1 and k == 3:
                    continue
                if t + bt * BEAT < t1:
                    add(piano(m, vel * (0.9 if k == 0 else 0.7), 2.6), t + bt * BEAT, pan=0.2)
            add(piano(ch[0] - 12, vel * 0.32, 1.6), t, pan=-0.2)
        elif mode == 'line':
            line = [74, 72, 70, 69, 70, 72, 74, 69]
            for b in (0, 2):
                if t + b * BEAT < t1:
                    add(piano(line[(i * 2 + b // 2) % len(line)], vel * 0.8, 3.2), t + b * BEAT, pan=0.1)
        elif mode == 'warm':
            for b, m in enumerate([ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 24, ch[1] + 24, ch[3] + 12, ch[2] + 12, ch[1] + 12]):
                if t + b * BEAT / 2 < t1 and (density >= 1 or b % 2 == 0):
                    add(piano(m, vel * (1.0 if b == 0 else 0.65), 2.4), t + b * BEAT / 2, pan=(b % 3 - 1) * 0.25)
            add(piano(ch[0], vel * 0.5, 2.8), t, pan=-0.3)
        t += BAR
        i += 1


# opening: drone + two notes
add_pad(pad(Dm, end('C0') + 1.0, level=0.07, bright=2, attack=2.5, release=1.5), 0)
add(piano(74, 0.45, 5.5), 1.0)
add(piano(69, 0.32, 5.0), 4.0)
# Act 1–2: sparse, hollow, the "later" figure
section(start('S1a'), start('A2-stack'), COLD_PROG, 'later', 0.085, 2, vel=0.42)
section(start('A2-stack'), end('A2-scarf'), COLD_PROG, 'later', 0.07, 2, vel=0.3, density=0.5)
# Act 3: near silence under the voicemail, then one soft line
add_pad(pad(Dm, end('S7') - start('S6') + 1.0, level=0.06, bright=2, attack=2.0, release=2.5), start('S6'))
add(piano(62, 0.25, 4.0), start('S6') + 0.5)
section(start('S8'), end('Q1'), LINE_PROG, 'line', 0.062, 2, vel=0.4)
# Act 4: the decision (soft line), then warm strings enter on the call
section(start('S11'), at('S13', 290), LINE_PROG, 'line', 0.068, 3, vel=0.38)
section(at('S13', 290), start('S14'), WARM_PROG, 'warm', 0.085, 4, vel=0.36, density=0.5)
section(start('S14'), end('Q2'), WARM_PROG, 'warm', 0.09, 5, vel=0.42)
# Act 5: full warm theme, gentle resolve
section(start('S15'), start('S19'), WARM_PROG, 'warm', 0.1, 5, vel=0.46)
section(start('S19'), start('C-END'), [Fw, Bbw, Cw, Fw], 'warm', 0.095, 4, vel=0.4, density=0.5)
res = start('C-END')
add_pad(pad((41, 53, 60, 65, 69), TOTAL - res, level=0.09, bright=4, attack=1.2, release=6.0), res)
for k, m in enumerate([77, 72, 69, 65]):
    add(piano(m, 0.42 - k * 0.04, 6.0), res + 0.3 + k * 2.3, pan=0.15)
for m in (65, 69, 72):
    add(piano(m, 0.32, 7.0), start('TITLE') + 0.5)
fade = int(4.0 * SR)
music[-fade:] *= np.linspace(1, 0, fade)[:, None]

# =================================================================== SOUND DESIGN
mx = Mix(TOTAL)
fx, bed, cue = mx.fx, mx.bed, mx.cue
CLOCK = px(790)

# ---------------- ambiences
bed(room_bed, 2.5, end('C0'), -62, 1.5, .2)
mx.ticks(3.0, end('C0'), -38, CLOCK)
cue(3.0, 'Black opening: a clock starts ticking (the film\'s motif)')

for a, b in [('S1a', 'S2')]:
    bed(room_bed, start(a), end(b), -54)
    bed(traffic_bed, start(a), end(b), -50)
    mx.ticks(start(a), end(b), -33, CLOCK)
bed(hum_bed, start('S2'), end('S2'), -46, .1, .2)
cue(start('S1a'), "Sam's flat, morning: room tone, city traffic outside, wall clock ticking")

bed(room_bed, start('S4'), end('S5'), -55)
bed(traffic_bed, start('S4'), end('S5'), -54)
mx.ticks(start('S4'), end('S5'), -32, CLOCK)
for sid in ['A2-Nov9', 'A2-Nov22']:
    bed(room_bed, start(sid), end(sid), -55)
    mx.ticks(start(sid), end(sid), -30, CLOCK)
bed(room_bed, start('A2-pass'), end('A2-stack'), -55)
bed(wind_bed, start('A2-pass'), end('A2-stack'), -52)
mx.ticks(start('A2-pass'), end('A2-stack'), -31, CLOCK)
cue(start('S4'), "Sam's flat at night: room tone, traffic, clock ticking louder than the day")

for sid, w in [('S3', -56), ('A2-mom', -56), ('A2-scarf', -56)]:
    bed(room_bed, start(sid), end(sid), -56)
    bed(wind_bed, start(sid), end(sid), w)
cue(start('S3'), "Mom's room: warm room tone, wind outside, her knitting needles")

bed(room_bed, start('A2-office'), end('A2-office'), -53)
bed(lambda d: hum_bed(d, 100, .6), start('A2-office'), end('A2-office'), -50)
bed(room_bed, start('A2-sofa'), end('A2-sofa'), -55)
bed(tv_bed, start('A2-sofa'), end('A2-sofa'), -40)
bed(traffic_bed, start('A2-sofa'), end('A2-sofa'), -56)
cue(start('A2-office'), 'Office: air-con hum, keyboards, the phone rattling on the table')
cue(start('A2-sofa'), 'Sunday on the sofa: a muffled TV, the city outside')

bed(room_bed, start('S6'), end('S8'), -57)
bed(wind_bed, start('S6'), end('S8'), -53)
bed(room_bed, start('S10'), end('S10'), -57)
cue(start('S6'), 'Bedroom at night: wind and snow outside, phone taps')

bed(room_bed, start('S11'), end('S11'), -57)
bed(murmur_bed, start('S12'), end('S12'), -44)
cue(start('S12'), 'Restaurant: soft room wash, cutlery, glasses')

# S13: street (left) and Mom's room (right)
bed(wind_bed, start('S13'), end('S13'), -50)
bed(lambda d: traffic_bed(d) * np.array([1.0, 0.4]), start('S13'), end('S13'), -54)
bed(lambda d: room_bed(d) * np.array([0.4, 1.0]), start('S13'), end('S13'), -55)
bed(lambda d: wind_bed(d) * 0.6, start('S14'), end('S14'), -54)
bed(train_bed, start('S15'), end('S15'), -37, .4, .4)
bed(wind_bed, start('S15'), end('S15'), -54)
bed(wind_bed, start('S16'), end('S17'), -50)
bed(room_bed, at('S17', 30), end('S17'), -56, .6, .2)
bed(room_bed, start('S18'), end('S18'), -55)
bed(lambda d: wind_bed(d) * 0.5, start('S18'), end('S18'), -56)
bed(wind_bed, start('S19'), end('S19') + 2.0, -50, .3, 2.0)
cue(start('S13'), 'The call: snowy street on the left, Mom\'s warm room on the right')
cue(start('S15'), 'Train: rumble and wheel clacks')
cue(start('S19'), 'Snowy night: wind, a train passing far away')

# ---------------- ACT 1
# S1a — phone buzzing on the counter, he walks over and picks it up
t = at('S1a', 10)
while t < at('S1a', 82):
    fx(buzz(.4, True), t, px(990), -24)
    t += .7
for f in steps_at(.32, 0, 60):
    x = 300 + ease(ramp(f, 0, 60)) * 520
    fx(step('adult'), at('S1a', f), px(x), -18)
fx(rustle(.3, 600, 5000, 10), at('S1a', 80), px(900), -24)
fx(ui_blip(), at('S1a', 140), .5, -26)
cue(start('S1a'), 'Phone buzzing on the counter, footsteps, he picks it up')
# S1b — decline, type, send
t = start('S1b')
while t < at('S1b', 55):
    fx(muffle(buzz(.4, False), 2500), t, 0, -26)
    t += .7
fx(tap(), at('S1b', 55), .1, -20)
fx(end_call_tone(), at('S1b', 58), .1, -24)
for k in range(9):
    fx(type_click(), at('S1b', 66 + k * 4 + rng.uniform(-1, 1)), .15, -26)
fx(send_whoosh(), at('S1b', 102), .2, -21)
cue(start('S1b'), 'Decline tap, call-ended tone, typing, message sent')
# S2 — marker squeaks, slap
for f0, segs in [(14, [.5, .55]), (58, [.4, .35, .45])]:
    t = at('S2', f0)
    for d in segs:
        fx(marker_squeak(d), t, .1, -29)
        t += d + .04
fx(thunk(220, .12, 45), at('S2', 124), 0, -20)
fx(note_stick(), at('S2', 124), 0, -22)
cue(start('S2'), 'Marker squeaks "CALL MOM", the note slapped onto the fridge')
# S3 — Mom: knitting, phone buzz, reads, types slowly, sends, back to knitting


def knitting(t0, t1, pan, g=-26, every=0.22):
    t = t0
    k = 0
    while t < t1:
        fx(needle_click(), t, pan, g + (2 if k % 2 else 0))
        t += every * rng.uniform(.85, 1.15)
        k += 1


knitting(start('S3'), at('S3', 60), px(1050), -26)
t = at('S3', 58)
while t < at('S3', 96):
    fx(buzz(.35, True), t, px(1290), -24)
    t += .6
fx(rustle(.35, 600, 5000, 10), at('S3', 96), px(1150), -26)
fx(receive_pop(), at('S3', 104), px(1100), -26)
for k in range(6):
    fx(type_click(), at('S3', 150 + k * 7 + rng.uniform(-1, 2)), px(1080), -28)
fx(send_whoosh(), at('S3', 196), px(1100), -24)
fx(thunk(160, .15, 40), at('S3', 238), px(1290), -26)
knitting(at('S3', 250), end('S3'), px(1050), -26)
cue(start('S3'), 'Mom: needle clicks, phone buzzes, message received, slow typing, sent, knitting again')
# S4 — door, steps, keys, fridge, the note peeled and stuck on tomorrow
fx(door_close(), at('S4', 6), -.9, -20)
for f in steps_at(.3, 0, 110):
    x = -150 + ease(ramp(f, 0, 110)) * 1600
    fx(step('adult'), at('S4', f), px(x), -18)
fx(keys_jingle(), at('S4', 116), px(1300), -22)
fx(fridge_open(), at('S4', 128), px(1700), -20)
bed(hum_bed, at('S4', 128), at('S4', 305), -44, .1, .2)
fx(fridge_close(), at('S4', 304), px(1700), -18)
fx(note_peel(), at('S4', 326), px(1700), -22)
for f in steps_at(.3, 340, 385):
    x = 1450 - ease(ramp(f, 340, 385)) * 300
    fx(step('adult', soft=True), at('S4', f), px(x), -20)
fx(note_stick(), at('S4', 392), px(1080), -20)
fx(ui_blip(False), at('S4', 396), .7, -26)
cue(start('S4'), 'Night: door, footsteps, keys, fridge opens (hum), note peeled, footsteps, note stuck on tomorrow')
fx(paper(.3), at('S5', 4), 0, -26)

# ---------------- ACT 2
for sid in ['A2-Nov9', 'A2-Nov22']:
    fx(whoosh(1.0, 3500, 400), start(sid) - .3, 0, -26)
    fx(paper(.25), at(sid, 10), .2, -27)
cue(start('A2-Nov9'), 'Each calendar card: a time whoosh and a paper flick')
# office: keyboards around the table, the phone, the flip
t = start('A2-office')
while t < end('A2-office') - .1:
    fx(type_click(), t, rng.uniform(-.8, .8), -34)
    t += rng.uniform(.08, .35) if rng.uniform() < .7 else rng.uniform(.6, 1.2)
t = at('A2-office', 30)
while t < at('A2-office', 92):
    fx(buzz(.4, True), t, px(1240), -22)
    t += .7
fx(thunk(180, .14, 40), at('A2-office', 94), px(1240), -18)
cue(at('A2-office', 94), 'He flips the phone face-down (thunk)')
# Mom almost calls
knitting(start('A2-mom'), at('A2-mom', 38), px(1050), -26)
fx(rustle(.3, 600, 5000, 10), at('A2-mom', 40), px(1150), -26)
for k in range(3):
    fx(tap(), at('A2-mom', 70 + k * 18), px(1080), -30)
fx(thunk(160, .15, 40), at('A2-mom', 206), px(1290), -25)
knitting(at('A2-mom', 232), end('A2-mom'), px(1050), -26)
cue(start('A2-mom'), 'Mom picks up the phone, two taps… sets it down, knits again')
# sofa: he turns twice
fx(rustle(.5, 300, 3000, 8), at('A2-sofa', 116), px(1180), -24)
fx(rustle(.5, 300, 3000, 8), at('A2-sofa', 234), px(1180), -25)
# Dec 16: walks past on the phone
for f in steps_at(.3, 20, 180):
    x = -150 + ramp(f, 20, 180) * 2250
    fx(step('adult'), at('A2-pass', f), px(x), -19)
mx.phone_taps(at('A2-pass', 20), at('A2-pass', 180), -28, 0)
cue(start('A2-pass'), 'Dec 16: wind and snow, he walks past the stack, tapping his phone')
fx(swell(end('A2-stack') - start('A2-stack') + .3), start('A2-stack'), 0, -28)
mx.ticks(start('A2-stack'), end('A2-stack'), -27, CLOCK)
knitting(start('A2-scarf'), end('A2-scarf'), 0, -22, 0.18)
fx(rustle(1.2, 400, 4000, 6), at('A2-scarf', 30), -.3, -26)
cue(start('A2-scarf'), 'The scarf pile: close knitting clicks, yarn rustle')

# ---------------- ACT 3
fx(rustle(.6, 300, 3000, 7), at('S6', 4), px(470), -26)
mx.phone_taps(at('S6', 20), at('S6', 230), -28, px(560))
fx(tap(), at('S7', 18), 0, -22)
fx(tone(1000, .22, 1.0), at('S7', 22), 0, -30)
bed(lambda d: np.stack([fft_filter(rng.standard_normal(int(d * SR)), 300, 3400)] * 2, axis=1) / 3.0, at('S7', 25), at('S7', 285), -52, .2, .4)
cue(start('S7'), 'Voicemail: play tap, beep, faint phone-speaker hiss (the words are subtitles)')
for k in range(4):
    fx(heartbeat(), at('S8', 110) + k * .95, 0, -22 + 2 * min(k, 2))
cue(at('S8', 110), 'Heartbeat as his brows fall')
for k in range(3):
    fx(flash_hit(), at('S9', 36 * k) - PRE, 0, -18)
fx(muffle(school_bell(.9)), at('S9', 4), -.2, -26)
fx(muffle(train_horn(1.0)), at('S9', 40), .2, -26)
fx(muffle(tick()), at('S9', 80), .1, -24)
fx(muffle(tick(True)), at('S9', 95), .1, -24)
cue(start('S9'), 'Three memory flashes: a school bell, a train horn, a clock — all muffled')
for f0, f1 in [(14, 56), (68, 132), (144, 166), (188, 224), (234, 272)]:
    fx(pen_scratch((f1 - f0) / 30), at('S10', f0), .15, -27)
cue(start('S10'), 'Marker scratching the math on a note, then circling "20"')

# ---------------- ACT 4
for k, f in enumerate([30, 70, 100]):
    fx(tap(), at('S11', f), -.3, -22)
fx(pickup_click(), at('S11', 112), -.3, -26)
fx(ui_blip(), at('S11', 120), -.3, -26)
fx(whoosh(.6, 600, 3000), at('S11', 145), .5, -24)
fx(paper(.35), at('S11', 190), .5, -24)
cue(start('S11'), 'Reminder set (taps, toggle, blip), the ticket slides in')
# restaurant
t = start('S12')
while t < end('S12') - .2:
    fx(cutlery(), t, rng.uniform(-.7, .7), -32)
    t += rng.uniform(.4, 1.4)
fx(clink(), at('S12', 20), -.2, -28)
t = at('S12', 40)
while t < at('S12', 130):
    fx(buzz(.35, True), t, px(1400), -24)
    t += .65
fx(receive_pop(), at('S12', 44), px(1400), -26)
fx(chair_scrape(.45), at('S12', 252), px(1330), -22)
fx(rustle(.6, 500, 5000, 9), at('S12', 276), px(1330), -23)
for f in steps_at(.32, 292, 330):
    x = 1330 + ramp(f, 292, 330) * 720
    fx(step('adult'), at('S12', f), px(x), -20)
fx(door_close(), at('S12', 326), .9, -22)
cue(start('S12'), 'Reminder buzz at dinner; chair scrape, scarf, footsteps, the door')
# the call
for f in steps_at(.32, 0, 50):
    fx(step(snow=True), at('S13', f), -.6, -19)
for k in range(3):
    fx(tap(), at('S13', 56 + k * 5), -.6, -24)
for f in (76, 106):
    fx(ringback(), at('S13', f), -.6, -30)
for f in (80, 108):
    fx(ringtone(), at('S13', f), .5, -19)
knitting(start('S13'), at('S13', 80), .5, -27)
fx(needle_click(), at('S13', 92), .45, -20)
fx(pickup_click(), at('S13', 138), .5, -20)
fx(shimmer(), at('S13', 298), .3, -21)
cue(start('S13'), 'Snow footsteps, dialling, ringback in his ear, her phone rings, a needle drops, she picks up — a warm shimmer on "Sam!"')
# Sundays
for k in range(3):
    fx(pickup_click(), at('S14', k * 140 + 4), 0, -26)
for f in (140, 280):
    fx(whoosh(1.0, 3500, 400), at('S14', f) - .5, 0, -25)
fx(note_stick(), at('S14', 160), .3, -20)
cue(start('S14'), 'Sundays: call connects, time whooshes, Mom sticks her note')

# ---------------- ACT 5
fx(bell(880, 1.6), at('S15', 50), .4, -30)
fx(bell(698.5, 1.8), at('S15', 58), .4, -30)
fx(paper(.4), at('S15', 30), px(1250), -26)
cue(start('S15'), 'Train: a soft two-note station chime, gift paper')
for f in steps_at(.3, 0, 170):
    k = ease(ramp(f, 0, 170))
    x = 420 + 530 * k
    fx(step(snow=True), at('S16', f), px(x), -17 - 8 * k)
peaks = [186 + (np.pi / 2 + i * np.pi) / 0.55 for i in range(9)]
for i in [0, 1, 2, 5, 6, 7]:
    fx(knock(), at('S16', peaks[i]), .05, -16)
cue(start('S16'), 'Snow footsteps up the path, two sets of knocks')
fx(latch(), at('S17', 16), .1, -22)
fx(creak(.7), at('S17', 18), .1, -21)
fx(shimmer(), at('S17', 118), .1, -22)
fx(step(snow=True), at('S17', 228), -.1, -22)
fx(rustle(.8, 400, 4500, 7), at('S17', 222), 0, -22)
cue(start('S17'), 'Latch, creak, warm air; a shimmer as she smiles; the hug')
fx(clink(), at('S18', 20), -.1, -30)
fx(rustle(1.4, 400, 4500, 6), at('S18', 60), -.1, -22)
fx(rustle(2.2, 300, 3500, 5), at('S18', 112), .2, -23)
fx(shimmer(), at('S18', 200), .2, -24)
cue(start('S18'), 'The long scarf rustles around them; a shimmer')
tr = int((end('S19') - start('S19')) * SR)
env = np.exp(-((np.linspace(0, 1, tr) - 0.45) / 0.22) ** 2)
mx._place(mx.amb, train_bed(tr / SR) * env[:, None], start('S19'), gain_db=-35 + mx.ag)
fx(muffle(train_horn(1.2), 900), at('S19', 130), .6, -30)
cue(at('S19', 40), 'A train passes far away; a distant horn')

# ---------------- write
sfx = mx.mixdown()
out = os.path.join(ROOT, 'public', 'audio')
os.makedirs(out, exist_ok=True)
music *= 0.5 / np.abs(music).max()
pk = np.abs(sfx).max()
if pk > 0.97:
    sfx *= 0.97 / pk
write_wav(os.path.join(out, 'later_music.wav'), music)
write_wav(os.path.join(out, 'later_sfx.wav'), sfx)
write_cue_sheet(os.path.join(ROOT, 'LATER_SFX_CUES.md'), 'LATER', mx.cues, T)
print(f'shots={len(shots)} total={TOTAL:.1f}s  sfx peak={pk:.2f}  cues={len(mx.cues)}')
