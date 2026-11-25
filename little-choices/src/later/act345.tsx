import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {POSES, StickFigure, walkBob, walkPose} from '../characters/StickFigure';
import {Hand, PhoneClose} from '../props/Inserts';
import {HandPhone} from '../props/Props';
import {COLD, WARM} from '../theme';
import {ease, ramp, useF} from '../time';
import {WhiteFlash} from '../ui/Cards';
import {Camera, Layer, LightPool, Subtitle, usePush, Vignette} from '../ui/UI';
import {DAYS, MOM, SAM, SAM_OUT} from './cast';
import {ChatBubble, DateChip, MarkerHand, NoteClose, NOTE_CLOSE, penAt, Ticket} from './hud';
import {CallTimerScreen, EarPhone, HourglassMeter, KnittingInHands, ReminderScreen, SCARF_RED, ScarfPath, StickyNote, VoicemailScreen} from './props';
import {MomRoom, SnowStreet} from './sets';
import {ColdBlanket, MomHouse, Platform, Restaurant, SamBedroom, SchoolGate, TrainWindow} from './sets2';
import {TablePhone} from './act12';

/* ================================================================= ACT 3 */

/* S6 — that night, in bed, the voicemail list */
export const LS6: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  return (
    <AbsoluteFill style={{background: '#101318'}}>
      <Camera zoom={zoom} ox={700} oy={600}>
        <Layer>
          <SamBedroom f={f} />
          <LightPool id="ls6phone" x={560} y={520} rx={260} ry={200} color={COLD.screen} opacity={0.34} />
          <StickFigure x={470} y={700} scale={4.0} {...SAM} pose={{...POSES.sitRead, armF: [40, 98], headTilt: 20}} eyes="half" brows={2} look={[6, 3]} glow="cyan" glowStrength={0.7}
            itemF={<HandPhone glow={1} angle={-40} />} />
          <ColdBlanket />
        </Layer>
      </Camera>
      <HourglassMeter x={1760} y={600} days={DAYS.dec16} scale={0.9} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* S7 — the voicemail plays */
export const LS7: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.06);
  return (
    <AbsoluteFill style={{background: '#0b0f16'}}>
      <Camera zoom={zoom} ox={860} oy={520}>
        <Layer blur={12}>
          <SamBedroom f={f} />
          <LightPool id="ls7glow" x={860} y={520} rx={700} ry={520} color={COLD.screen} opacity={0.22} />
        </Layer>
        <Layer>
          <PhoneClose cx={860} cy={540} s={1.0} rotate={-5} clock={<text x={30} y={42}>01:12</text>}>
            <VoicemailScreen progress={ramp(f, 20, 280)} />
          </PhoneClose>
          <Hand x={900} y={1080} s={1.9} rotate={-8} curl={0.6} />
        </Layer>
      </Camera>
      <Subtitle text="Hi, sweetheart. Nothing important." kind="phone" x={1400} y={420} from={28} to={130} />
      <Subtitle text="I just wanted to hear your voice." kind="phone" x={1400} y={420} from={150} to={282} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* S8 — close: "Forty-seven days." */
export const LS8: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.06);
  const wide = f > 30 && f < 100;
  const fallen = f >= 100;
  return (
    <AbsoluteFill style={{background: '#101318'}}>
      <Layer blur={12}>
        <SamBedroom f={f} />
      </Layer>
      <Camera zoom={zoom} ox={900} oy={480}>
        <Layer>
          <LightPool id="ls8phone" x={1180} y={760} rx={520} ry={420} color={COLD.screen} opacity={0.3} />
          <StickFigure x={900} y={1080} scale={11} {...SAM} pose={{...POSES.stand, headTilt: fallen ? 10 : 2}} eyes={fallen ? 'sad' : wide ? 'wide' : 'half'} brows={fallen ? 16 : wide ? 6 : 0} browLift={wide ? 1 : 0} look={[5, fallen ? 2 : 1]} glow="cyan" glowStrength={0.6} />
        </Layer>
      </Camera>
      <Subtitle text="Forty-seven days." kind="thought" x={900} y={230} from={118} to={232} />
      <HourglassMeter x={1720} y={560} days={DAYS.dec16} scale={0.9} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* S9 — three memories, one white flash each (1.2 s apart) */
export const LS9: React.FC<{dur: number}> = () => {
  const f = useF();
  const idx = Math.min(2, Math.floor(f / 36));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: 'grayscale(0.75) brightness(0.9) contrast(1.05)', transform: `scale(${1.03 + (f % 36) * 0.0015})`}}>
        {idx === 0 && (
          <Layer>
            <SchoolGate f={f} />
            <StickFigure x={860} y={683} scale={3.6} {...MOM} glasses={false} pose={{...POSES.stand, lean: 28, armF: [100, 30], armB: [80, 40], headTilt: 10}} eyes="happy" brows={4} look={[6, 2]} glow="rim" />
            <StickFigure x={1010} y={751} scale={3.6} kid hair="tuft" scarf={SCARF_RED} facing={-1} pose={{...POSES.stand, headTilt: -12}} eyes="happy" brows={4} look={[5, -2]} glow="rim" />
          </Layer>
        )}
        {idx === 1 && (
          <Layer>
            <Platform />
            <StickFigure x={1080} y={650} scale={3.4} {...SAM_OUT} pose={{...POSES.stand, armF: [150, 10]}} eyes="open" brows={8} look={[6, 0]} glow="rim" />
            <StickFigure x={1450} y={671} scale={3.4} {...MOM} facing={-1} pose={{...POSES.stand, armF: [168, 0]}} eyes="happy" brows={10} look={[6, -1]} glow="rim" />
          </Layer>
        )}
        {idx === 2 && (
          <Layer>
            <MomRoom warmth={0} scarfPile={0.6} />
            <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={POSES.sitKnit} eyes="sad" brows={12} look={[6, 3]} glow="amber" glowStrength={0.3} itemF={<KnittingInHands len={10} />} />
          </Layer>
        )}
      </AbsoluteFill>
      <WhiteFlash at={0} />
      <WhiteFlash at={36} />
      <WhiteFlash at={72} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* S10 — the math on a sticky note */
export const LS10: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const lines = ['Mom: 67', '1 visit a year', '= ?'];
  const prog = [ramp(f, 14, 56), ramp(f, 68, 132), ramp(f, 144, 166)];
  const bigProg = ramp(f, 188, 224);
  const circle = ramp(f, 234, 272);
  const bigX = NOTE_CLOSE.x + NOTE_CLOSE.size * 0.27;
  const bigY = NOTE_CLOSE.y + NOTE_CLOSE.size * 0.25;
  let pen = penAt(lines, prog, 84);
  if (f >= 180 && f < 230) pen = {x: bigX - 80 + bigProg * 160, y: bigY + 40};
  if (f >= 230) {
    const a = -Math.PI / 2 + circle * Math.PI * 2;
    pen = {x: bigX + Math.cos(a) * NOTE_CLOSE.size * 0.14, y: bigY + Math.sin(a) * NOTE_CLOSE.size * 0.13};
  }
  const handAway = ramp(f, 280, 300);
  return (
    <AbsoluteFill style={{background: '#14110f'}}>
      <Camera zoom={zoom}>
        <Layer>
          <rect width={1920} height={1080} fill="#2a2018" />
          {Array.from({length: 9}).map((_, i) => (
            <line key={i} x1={0} y1={120 * i + 40} x2={1920} y2={120 * i + 60} stroke="#1d160f" strokeWidth={6} opacity={0.5} />
          ))}
          <LightPool id="ls10phone" x={1700} y={300} rx={900} ry={600} color={COLD.screen} opacity={0.16} />
          <NoteClose lines={lines} prog={prog} fontSize={84} big={{text: '20', prog: bigProg}} circle={circle} />
          {handAway < 1 && (
            <g transform={`translate(${handAway * 500} ${handAway * 400})`}>
              <MarkerHand x={pen.x} y={pen.y + 10} Hand={Hand} />
            </g>
          )}
        </Layer>
      </Camera>
      <Subtitle text="Maybe twenty more visits." kind="thought" x={960} y={170} from={272} to={356} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* ================================================================= ACT 4 */

/* S11 — a weekly reminder and a train ticket */
export const LS11: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const tk = Easing.out(Easing.cubic)(ramp(f, 150, 200));
  return (
    <AbsoluteFill style={{background: '#0d1118'}}>
      <Camera zoom={zoom}>
        <Layer blur={12}>
          <SamBedroom f={f} />
        </Layer>
        <Layer>
          <PhoneClose cx={640} cy={540} s={1.0} rotate={-4} clock={<text x={30} y={42}>01:20</text>}>
            <ReminderScreen />
          </PhoneClose>
          <Hand x={680} y={1080} s={1.9} rotate={-8} curl={0.6} />
          <Ticket x={2500 - tk * 1150} y={540} rotate={-4 + tk * 2} opacity={ramp(f, 150, 160)} />
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};

/* S12 — Sun, Dec 20, 7 PM: the reminder at dinner; he goes out into the snow */
export const LS12: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const standing = f >= 252;
  const leaving = f >= 292;
  const ph = f * 0.32;
  const x = leaving ? 1330 + ramp(f, 292, 330) * 720 : 1330;
  const laugh = (i: number) => Math.abs(Math.sin(f * 0.25 + i)) * -6;
  const friend = (fx: number, i: number) => (
    <g key={i} transform={`translate(0 ${laugh(i)})`}>
      <StickFigure x={fx} y={736} scale={3.6} facing={1} pose={{...POSES.sitLookUp, armF: [60, 40], headTilt: -4}} eyes="happy" brows={4} look={[6, -1]} glow="amber" glowStrength={0.5} />
    </g>
  );
  return (
    <AbsoluteFill style={{background: '#3e2a1c'}}>
      <Camera zoom={zoom} ox={1100} oy={560}>
        <Layer>
          <Restaurant f={f} />
          {friend(880, 0)}
          {friend(1060, 1.3)}
          {!standing && (
            <StickFigure x={1330} y={736} scale={3.6} {...SAM} facing={-1} pose={{...POSES.sitLookUp, armF: [60, 40], headTilt: f > 40 && f < 250 ? 14 : -2}} eyes={f > 40 && f < 250 ? 'open' : 'happy'} brows={f > 70 ? 10 : 2} look={[6, 2]} glow="amber" glowStrength={0.5} />
          )}
          <rect x={720} y={650} width={760} height={26} rx={8} fill="#6b4a30" />
          {standing && (
            <g transform={`translate(0 ${leaving ? walkBob(ph) : 0})`}>
              <StickFigure x={x} y={704} scale={4.0} {...(f >= 276 ? SAM_OUT : SAM)} facing={1} pose={leaving ? walkPose(ph) : {...POSES.stand, armF: [150, 30], armB: [140, 40]}} eyes="open" brows={-4} look={[6, 0]} glow="amber" glowStrength={0.5} />
            </g>
          )}
          {!standing && <TablePhone x={1400} y={644} f={f} ringing={f > 40 && f < 130} />}
          <ChatBubble x={1580} y={600} text="7 PM · Call Mom ♥" size={32} opacity={ramp(f, 44, 54) * (1 - ramp(f, 236, 250))} />
        </Layer>
      </Camera>
      <Subtitle text="Call her tomorrow." kind="excuse" x={1240} y={330} from={80} to={160} />
      <Subtitle text="She'll understand." kind="excuse" x={1240} y={330} from={170} to={246} />
      <DateChip text="SUN · DEC 20" opacity={ramp(f, 0, 8) * (1 - ramp(f, 80, 95))} />
      <HourglassMeter x={1740} y={110} days={DAYS.dec20} scale={0.9} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* S13 — the call (split screen) */
export const LS13: React.FC<{dur: number}> = () => {
  const f = useF();
  const ph = f * 0.32;
  const samWalking = f < 50;
  const samX = 300 + ease(ramp(f, 0, 50)) * 660;
  const samOnPhone = f >= 60;
  const momRinging = f > 80 && f < 140;
  const momOnPhone = f >= 138;
  const startled = f > 84 && f < 140;
  const happySam = f >= 290;
  const happyMom = f >= 290;
  const spill = ramp(f, 300, 600);
  const divider = 1 - ramp(f, 520, 600);
  const flip = ramp(f, 300, 320);
  const knit = Math.sin(f * 0.5) * 6;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{clipPath: 'inset(0 50% 0 0)'}}>
        <AbsoluteFill style={{transform: 'translateX(-480px)'}}>
          <Layer>
            <SnowStreet f={f} warmSpill={spill} />
            <g transform={`translate(0 ${samWalking ? walkBob(ph) : 0})`}>
              <StickFigure x={samX} y={700} scale={4.0} {...SAM_OUT} pose={samWalking ? walkPose(ph) : samOnPhone ? POSES.phoneEar : POSES.stand} eyes={happySam ? 'happy' : 'open'} brows={happySam ? 6 : 8} look={[5, 1]}
                glow={spill > 0.3 ? 'amber' : 'rim'} glowStrength={0.4 + 0.4 * spill} itemB={samOnPhone ? <EarPhone /> : undefined} />
            </g>
          </Layer>
        </AbsoluteFill>
        <AbsoluteFill style={{background: `linear-gradient(to left, rgba(255,179,92,${0.32 * spill}), rgba(255,179,92,0) 70%)`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{clipPath: 'inset(0 0 0 50%)'}}>
        <AbsoluteFill style={{transform: 'translateX(440px)'}}>
          <Layer>
            <MomRoom warmth={0.2 + 0.5 * spill} scarfPile={1.8} phoneGlow={momRinging ? 1 : 0} />
            {momRinging && <TablePhone x={1288} y={684} f={f} ringing />}
            <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={momOnPhone ? POSES.sitPhoneEar : {...POSES.sitKnit, armF: [40 + knit * 0.3, 70], armB: [30 - knit * 0.3, 75]}}
              eyes={happyMom ? 'happy' : startled ? 'wide' : 'open'} brows={happyMom ? 8 : startled ? 10 : 6} look={[6, momOnPhone ? 0 : 3]} glow="amber" glowStrength={0.5 + 0.4 * spill}
              itemB={momOnPhone ? <EarPhone /> : undefined} itemF={<KnittingInHands len={14} />} />
          </Layer>
        </AbsoluteFill>
      </AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, opacity: divider}}>
        <defs>
          <linearGradient id="ls13seam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={COLD.screen} />
            <stop offset="1" stopColor={WARM.lamp} />
          </linearGradient>
          <filter id="ls13glow" x="-200%" y="-5%" width="500%" height="110%">
            <feGaussianBlur stdDeviation={9} />
          </filter>
        </defs>
        <rect x={946} y={0} width={28} height={1080} fill="url(#ls13seam)" filter="url(#ls13glow)" opacity={0.8} />
        <rect x={957} y={0} width={6} height={1080} fill="#ffffff" opacity={0.85} />
      </svg>
      <Subtitle text="Hello?" kind="spoken" x={1440} y={420} from={150} to={202} />
      <Subtitle text="Hi, Mom. It's me." kind="spoken" x={480} y={330} from={210} to={290} />
      <Subtitle text="Sam!" kind="spoken" x={1440} y={420} from={298} to={350} />
      <Subtitle text="How are you?" kind="spoken" x={480} y={330} from={360} to={432} />
      <Subtitle text="Better now." kind="spoken" x={1440} y={420} from={440} to={522} />
      <HourglassMeter x={1760} y={110} days={flip < 0.5 ? DAYS.dec20 : 0} flip={flip} warm={ramp(f, 300, 330)} drain={0.95} scale={0.9} />
      <Vignette strength={0.38} />
    </AbsoluteFill>
  );
};

/* S14 — Sundays: the call timer grows; Mom's own note */
export const LS14: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const beat = dur / 3;
  const X = 12;
  const op = (i: number) => {
    const a = i * beat;
    const b = (i + 1) * beat;
    const inn = i === 0 ? 1 : ramp(f, a - X, a + X);
    const out = i === 2 ? 1 : 1 - ramp(f, b - X, b + X);
    return Math.min(inn, out);
  };
  const phoneBeat = (time: string, i: number) => (
    <AbsoluteFill style={{opacity: op(i), background: '#0d1118'}}>
      <Layer blur={10}>
        <SnowStreet f={f + i * 100} warmSpill={1} />
      </Layer>
      <Layer>
        <PhoneClose cx={960} cy={540} s={1.0} rotate={-3} clock={<text x={30} y={42}>19:0{i}</text>}>
          <CallTimerScreen time={time} />
        </PhoneClose>
        <Hand x={1000} y={1080} s={1.9} rotate={-8} curl={0.6} />
      </Layer>
      <Vignette />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {phoneBeat('04:12', 0)}
      <AbsoluteFill style={{opacity: op(1)}}>
        <Camera zoom={1.9} ox={1420} oy={420} dx={960 - 1420} dy={540 - 420}>
          <Layer>
            <MomRoom warmth={0.8} scarfPile={2.0} />
            <g transform={`translate(1500 540) scale(${ease(ramp(f, beat + 10, beat + 30))}) translate(-1500 -540)`}>
              <StickyNote x={1500} y={540} size={170} rotate={-6} text={['SUN 7PM', 'SAM ♥']} />
            </g>
          </Layer>
        </Camera>
        <Vignette />
      </AbsoluteFill>
      {phoneBeat('52:03', 2)}
      <DateChip text={f < beat ? 'SUN · DEC 20' : f < 2 * beat ? 'SUN · DEC 27' : 'SUN · JAN 3'} />
      <HourglassMeter x={1720} y={150} days={0} flip={1} warm={1} drain={0.95} scale={0.9} />
    </AbsoluteFill>
  );
};

/* ================================================================= ACT 5 */

const GiftBox: React.FC = () => (
  <g>
    <rect x={-8} y={-7} width={16} height={12} rx={1.5} fill="#c9433a" />
    <rect x={-1.3} y={-7} width={2.6} height={12} fill="#ffd98a" />
    <rect x={-8} y={-2.2} width={16} height={2.6} fill="#ffd98a" />
    <path d="M0,-7 q-6,-6 -7,-1 q3,2 7,1 q4,1 7,-1 q-1,-5 -7,1z" fill="#ffd98a" />
  </g>
);

/* S15 — Sat, Jan 9: the train home */
export const LS15: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={1000} oy={540}>
        <Layer>
          <TrainWindow f={f} />
          <LightPool id="ls15" x={860} y={420} rx={800} ry={420} color="#ffffff" opacity={0.12} />
          <StickFigure x={1250} y={800} scale={4.0} {...SAM_OUT} facing={-1} pose={{...POSES.sitLookUp, armF: [40, 70], armB: [30, 70], headTilt: -4}} eyes="open" brows={4} look={[6, -1]} glow="rim" glowStrength={0.8}
            itemF={<GiftBox />} />
        </Layer>
      </Camera>
      <DateChip text="SAT · JAN 9" opacity={ramp(f, 0, 8) * (1 - ramp(f, 80, 95))} />
      <HourglassMeter x={1720} y={150} days={0} flip={1} warm={1} drain={0.95} scale={0.9} opacity={1 - ramp(f, 120, 200)} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* S16 — up the snowy path; he knocks */
export const LS16: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const k = ease(ramp(f, 0, 170));
  const walking = f < 170;
  const ph = f * 0.3;
  const footX = 420 + (950 - 420) * k;
  const footY = 1060 + (830 - 1060) * k;
  const s = 4.4 + (2.5 - 4.4) * k;
  const knocking = f > 186 && f < 236;
  const kn = knocking ? Math.abs(Math.sin((f - 186) * 0.55)) : 0;
  return (
    <AbsoluteFill style={{background: '#0b1120'}}>
      <Camera zoom={zoom} ox={960} oy={700}>
        <Layer>
          <MomHouse f={f} />
          <g transform={`translate(0 ${walking ? walkBob(ph) * (s / 4) : 0})`}>
            <StickFigure x={footX} y={footY - 44 * s} scale={s} {...SAM_OUT} pose={walking ? walkPose(ph, {armF: [40, 70]}) : {...POSES.stand, armF: [92 + kn * 20, -20 - kn * 40]}} eyes="open" brows={6} look={[6, -1]} glow="rim" glowStrength={0.7}
              itemB={<GiftBox />} />
          </g>
          {knocking && kn > 0.85 && (
            <g stroke="#ffd98a" strokeWidth={4} strokeLinecap="round">
              <line x1={980} y1={660} x2={955} y2={645} />
              <line x1={980} y1={684} x2={950} y2={684} />
              <line x1={980} y1={708} x2={955} y2={723} />
            </g>
          )}
        </Layer>
      </Camera>
      <Vignette strength={0.42} />
    </AbsoluteFill>
  );
};

/* S17 — the door opens: "Hi, Mom." / "You came!" — a hug */
export const LS17: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 2.3, 2.4);
  const door = ease(ramp(f, 18, 48));
  const surprised = f > 48 && f < 118;
  const hug = f >= 220;
  const samX = 930 + ease(ramp(f, 220, 250)) * 70;
  return (
    <AbsoluteFill style={{background: '#0b1120'}}>
      <Camera zoom={zoom} ox={1065} oy={690}>
        <Layer>
          <MomHouse f={f} door={door} />
          <LightPool id="ls17" x={1065} y={700} rx={260} ry={260} color={WARM.lamp} opacity={0.35 * door} />
          {door > 0.3 && (
            <StickFigure x={1065} y={748} scale={1.9} {...MOM} facing={-1} pose={hug ? {...POSES.hugSide, armF: [70, 30]} : POSES.stand} eyes={surprised ? 'wide' : 'happy'} mouth={surprised ? 'o' : 'none'} brows={surprised ? 10 : 6} look={[6, -1]} glow="amber" glowStrength={0.9} />
          )}
          <StickFigure x={samX} y={733} scale={2.2} {...SAM_OUT} pose={hug ? {...POSES.hugSide, armF: [72, 30], lean: 8} : POSES.stand} eyes={f > 120 ? 'happy' : 'open'} brows={6} look={[6, 0]} glow={door > 0.3 ? 'amber' : 'rim'} glowStrength={0.8} itemB={hug ? undefined : <GiftBox />} />
        </Layer>
      </Camera>
      <Subtitle text="Hi, Mom." kind="spoken" x={760} y={380} from={58} to={130} />
      <Subtitle text="You came!" kind="spoken" x={1200} y={420} from={138} to={212} />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

/* S18 — the scarf she knitted while she waited (animated version of the style frame) */
export const LS18: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const link = ramp(f, 60, 130);
  const trail = ramp(f, 110, 250);
  const laughing = f >= 250;
  const bob = laughing ? Math.abs(Math.sin(f * 0.45)) * -5 : 0;
  const bundle = 1 - ramp(f, 60, 220);
  return (
    <AbsoluteFill style={{background: '#3a2a1e'}}>
      <Camera zoom={zoom} ox={980} oy={620}>
        <Layer>
          <MomRoom warmth={1} snow f={f} tea />
          <LightPool id="ls18warm" x={980} y={560} rx={700} ry={500} color={WARM.lamp} opacity={0.3} />
          <g transform={`translate(0 ${bob})`}>
            <StickFigure x={905} y={728} scale={4.0} {...MOM} scarf={link > 0.6 ? SCARF_RED : undefined} facing={1} pose={{...POSES.stand, armF: [128, 22], armB: [10, 10], headTilt: -12}} eyes={f > 120 ? 'happy' : 'open'} brows={6} look={[6, -2]} glow="amber" glowStrength={0.85}
              itemF={bundle > 0.05 ? <ellipse rx={9 * bundle + 2} ry={6 * bundle + 1.5} fill={SCARF_RED} /> : undefined} />
          </g>
          <g transform={`translate(0 ${bob * 0.8})`}>
            <StickFigure x={1045} y={704} scale={4.0} {...SAM} scarf={link > 0.3 ? SCARF_RED : undefined} facing={-1} pose={{...POSES.stand, armF: [86, 26], armB: [-8, 6], lean: 8, headTilt: 10}} eyes={f > 100 ? 'happy' : 'open'} brows={6} look={[6, 1]} glow="amber" glowStrength={0.85} />
          </g>
          <ScarfPath id="link" reveal={link} d="M1030,540 C1000,610 940,622 918,580" width={17} />
          <ScarfPath id="trail" reveal={trail} d="M900,590 C872,650 930,760 900,872 C888,930 1000,960 1120,936 C1210,918 1260,890 1300,912 C1360,946 1280,972 1240,948 C1200,920 1330,896 1440,930 C1560,968 1640,950 1700,926 C1760,904 1820,960 1760,972 C1700,982 1740,920 1840,930 S1960,940 2010,936" width={18} />
          <ScarfPath id="loop" reveal={trail} d="M760,900 C720,880 690,940 740,950 C800,962 850,930 880,905" width={15} />
        </Layer>
      </Camera>
      <Vignette strength={0.38} />
    </AbsoluteFill>
  );
};

/* S19 — pull back into the snowy night; a train passes */
export const LS19: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const z = interpolate(f, [0, dur * 0.65], [2.4, 1.0], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: '#0b1120'}}>
      <Camera zoom={z} ox={820} oy={575}>
        <Layer>
          <MomHouse f={f} train={ramp(f, 40, 330)} />
          <defs>
            <clipPath id="ls19win">
              <rect x={750} y={510} width={140} height={130} />
            </clipPath>
          </defs>
          <g clipPath="url(#ls19win)">
            <StickFigure x={795} y={612} scale={0.95} {...MOM} scarf={SCARF_RED} pose={{...POSES.sitKnit, armF: [60, 40]}} eyes="happy" brows={4} look={[6, 0]} glow="none" />
            <StickFigure x={850} y={606} scale={0.95} {...SAM} scarf={SCARF_RED} facing={-1} pose={{...POSES.sitLookUp, armF: [50, 40]}} eyes="happy" brows={4} look={[6, 0]} glow="none" />
            <path d="M780,575 C800,600 840,600 852,570" stroke={SCARF_RED} strokeWidth={4} fill="none" />
          </g>
        </Layer>
      </Camera>
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};
