import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure, walkBob, walkPose} from '../characters/StickFigure';
import {Hand, PhoneClose} from '../props/Inserts';
import {HandPhone} from '../props/Props';
import {COLD, INK} from '../theme';
import {ease, ramp, useF} from '../time';
import {Camera, Layer, LightPool, Subtitle, usePush, Vignette} from '../ui/UI';
import {DAYS, MOM, SAM, SAM_OUT} from './cast';
import {calCell, ChatBubble, DateChip, MarkerHand, NoteClose, penAt} from './hud';
import {ChatScreen, DEC_2026, HourglassMeter, IncomingCallScreen, KnittingInHands, Month, NOV_2026, StickyNote, WallCalendar} from './props';
import {MomRoom, SamFlat} from './sets';
import {OfficeRoom, SamLiving} from './sets2';
import {LaterStack} from './frames';

/** Phone lying on a surface, buzzing and glowing (world px). */
export const TablePhone: React.FC<{x: number; y: number; f: number; ringing: boolean; faceDown?: number}> = ({x, y, f, ringing, faceDown = 0}) => {
  const j = ringing ? Math.sin(f * 2.6) * 3 : 0;
  return (
    <g transform={`translate(${x + j} ${y})`}>
      {ringing && (
        <g stroke="#bdefff" strokeWidth={4} strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(Math.sin(f * 0.8))} fill="none">
          <path d="M-58,-26 q-10,14 0,28 M-74,-34 q-16,22 0,44 M58,-26 q10,14 0,28 M74,-34 q16,22 0,44" />
        </g>
      )}
      <g transform={`scale(1 ${1 - 2 * faceDown})`}>
        <rect x={-40} y={-10} width={80} height={18} rx={5} fill="#11151b" />
        {faceDown < 0.5 && <rect x={-36} y={-8} width={72} height={6} rx={2} fill={COLD.screen} opacity={ringing ? 0.95 : 0.4} />}
      </g>
      {ringing && <ellipse cx={0} cy={-40} rx={90} ry={60} fill={COLD.screen} opacity={0.12} />}
    </g>
  );
};

/* ================================================================= ACT 1 */

/* S1a — Mon, Nov 2, morning: the phone buzzes on the counter, he picks it up */
export const LS1a: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const walking = f < 60;
  const ph = f * 0.32;
  const x = 300 + ease(ramp(f, 0, 60)) * 520;
  const picked = f > 82;
  const reaching = f >= 60 && f <= 82;
  const pose = walking ? walkPose(ph) : reaching ? {...POSES.stand, armF: [82, 8] as [number, number]} : POSES.holdPhone;
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={900} oy={560}>
        <Layer>
          <SamFlat time="morning" clockMinutes={7 * 60 + 52} calendar={{month: NOV_2026, today: 2, crossedThrough: 1}} />
          {!picked && <TablePhone x={990} y={630} f={f} ringing={f > 10} />}
          {picked && <LightPool id="ls1phone" x={x + 60} y={470} rx={260} ry={220} color={COLD.screen} opacity={0.3} />}
          <g transform={`translate(0 ${walking ? walkBob(ph) : 0})`}>
            <StickFigure x={x} y={704} scale={4.0} {...SAM_OUT} pose={pose} eyes="open" brows={picked ? -8 : 0} look={[6, picked ? 3 : 0]} glow={picked ? 'cyan' : 'rim'} glowStrength={0.7}
              itemF={picked ? <HandPhone glow={1} angle={-30} /> : undefined} />
          </g>
        </Layer>
      </Camera>
      <DateChip text="MON · NOV 2" opacity={ramp(f, 0, 10) * (1 - ramp(f, 80, 95))} />
      <HourglassMeter x={1440} y={170} days={DAYS.nov2} opacity={ramp(f, 140, 158)} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* S1b — insert: "Mom" calling → decline → "Busy. Call you later." */
export const LS1b: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const declined = f > 58;
  // thumb travels to the decline button (screen 110,680 → world ≈ 905,800)
  const tx = 1150 - ease(ramp(f, 20, 55)) * 250 + ramp(f, 62, 80) * 240;
  const ty = 1150 - ease(ramp(f, 20, 55)) * 330 + ramp(f, 62, 80) * 300;
  return (
    <AbsoluteFill style={{background: '#0d1118'}}>
      <Camera zoom={zoom}>
        <Layer blur={10}>
          <SamFlat time="morning" clockMinutes={7 * 60 + 52} />
          <LightPool id="ls1bg" x={960} y={540} rx={800} ry={560} color={COLD.screen} opacity={0.2} />
        </Layer>
        <Layer>
          <PhoneClose cx={960} cy={540} s={1.0} rotate={-4} clock={<text x={30} y={42}>07:52</text>}>
            {declined ? <ChatScreen show={f > 102 ? 1 : 0} /> : <IncomingCallScreen />}
          </PhoneClose>
          <g transform={`translate(${tx} ${ty}) rotate(-28)`}>
            <rect x={-32} y={0} width={64} height={340} rx={32} fill={INK} stroke="#9aa6bb" strokeOpacity={0.35} strokeWidth={3} />
          </g>
          <Hand x={1080} y={1080} s={1.9} rotate={-8} curl={0.6} />
        </Layer>
      </Camera>
      <Subtitle text="Busy. Call you later." kind="excuse" x={1450} y={430} from={104} to={182} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* S2 — insert: he writes CALL MOM on a sticky note on the fridge */
export const LS2: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const lines = ['CALL', 'MOM'];
  const prog = [ramp(f, 14, 52), ramp(f, 58, 96)];
  const pen = penAt(lines, prog, 150);
  const slap = Math.max(0, 1 - Math.abs(f - 124) / 6);
  const writing = f < 104;
  return (
    <AbsoluteFill style={{background: '#4c5563'}}>
      <Camera zoom={zoom}>
        <Layer>
          <defs>
            <linearGradient id="ls2door" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#6a7483" />
              <stop offset="1" stopColor="#4c5563" />
            </linearGradient>
          </defs>
          <rect width={1920} height={1080} fill="url(#ls2door)" />
          <rect x={1640} y={0} width={30} height={1080} rx={15} fill="#3d4553" />
          <circle cx={360} cy={240} r={30} fill="#47a55a" />
          <rect x={300} y={760} width={70} height={50} rx={8} fill="#3c8dd6" />
          <g transform={`translate(960 520) scale(${1 - 0.03 * slap}) translate(-960 -520)`}>
            <NoteClose lines={lines} prog={prog} fontSize={150} />
          </g>
          {writing && <MarkerHand x={pen.x} y={pen.y + 10} Hand={Hand} />}
          {!writing && <Hand x={960 + (1 - ramp(f, 108, 124)) * 500 + ramp(f, 128, 146) * 600} y={720 + (1 - ramp(f, 108, 124)) * 300} s={1.6} rotate={-10} curl={0} />}
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};

/* S3 — Mom reads his text in her dim room and answers "Okay ♥" */
export const LS3: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.08, 1.13);
  const buzzing = f > 58 && f < 96;
  const holding = f >= 98 && f < 236;
  const reaching = f >= 80 && f < 98;
  const knit = Math.sin(f * 0.5) * 6;
  const pose = holding
    ? {...POSES.sitKnit, armF: [62, 96] as [number, number], headTilt: 12}
    : reaching
      ? {...POSES.sitKnit, armF: [78, 20] as [number, number], headTilt: 6}
      : {...POSES.sitKnit, armF: [40 + knit * 0.3, 70] as [number, number], armB: [30 - knit * 0.3, 75] as [number, number]};
  return (
    <AbsoluteFill style={{background: '#21170f'}}>
      <Camera zoom={zoom} ox={1000} oy={600}>
        <Layer>
          <MomRoom warmth={0} phoneGlow={buzzing ? 1 : holding ? 0 : 0.2} />
          {holding && <LightPool id="ls3phone" x={1060} y={520} rx={200} ry={170} color={COLD.screen} opacity={0.3} />}
          <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={pose} eyes={f > 214 && f < 236 ? 'happy' : 'open'} brows={8} look={[6, 3]} glow="amber" glowStrength={0.45}
            itemF={holding ? <HandPhone glow={1} angle={-60} /> : <KnittingInHands len={6} />} itemB={holding ? <KnittingInHands len={6} /> : undefined} />
          <ChatBubble x={1270} y={400} text="Busy. Call you later." size={34} opacity={ramp(f, 104, 114) * (1 - ramp(f, 236, 246))} />
          <ChatBubble x={1330} y={480} text="Okay ♥" mine size={34} opacity={ramp(f, 196, 206) * (1 - ramp(f, 236, 246))} />
        </Layer>
      </Camera>
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

/* S4 — night: the note on the fridge, "Too late to call now." … "Tomorrow." → onto tomorrow's square */
export const LS4: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const calX = 940;
  const calY = 190;
  const cell = calCell(NOV_2026, 280, 3);
  const walkIn = f < 110;
  const ph = f * 0.3;
  let x = -150 + ease(ramp(f, 0, 110)) * 1600; // to 1450, in front of the fridge
  const toCal = f >= 340 && f < 385;
  if (f >= 340) x = 1450 - ease(ramp(f, 340, 385)) * 300; // to 1150, under the calendar
  const walking = walkIn || toCal;
  const facing: 1 | -1 = f >= 252 && f < 330 ? -1 : f >= 340 ? -1 : 1;
  const fridgeOpen = ramp(f, 128, 146) * (1 - ramp(f, 300, 318));
  // the note: on the fridge, then carried, then on the calendar
  const noteFrom = {x: 1740, y: 380};
  const noteTo = {x: calX + cell.cx, y: calY + cell.cy + cell.ch * 0.06};
  const k = ease(ramp(f, 326, 392));
  const nx = noteFrom.x + (noteTo.x - noteFrom.x) * k;
  const ny = noteFrom.y + (noteTo.y - noteFrom.y) * k - Math.sin(k * Math.PI) * 120;
  const ns = 110 - (110 - cell.cw * 0.95) * k;
  const pose = walking
    ? walkPose(ph)
    : f < 160
      ? {...POSES.stand, armF: [70, 10] as [number, number]}
      : f >= 318 && f < 340
        ? {...POSES.stand, armF: [150, 10] as [number, number]}
        : f >= 385
          ? {...POSES.stand, armF: [160, 6] as [number, number], headTilt: -8}
          : {...POSES.stand, headTilt: f < 252 ? -12 : -6};
  return (
    <AbsoluteFill style={{background: '#12151b'}}>
      <Camera zoom={zoom} ox={1300} oy={560}>
        <Layer>
          <SamFlat time="night" clockMinutes={23 * 60 + 40} calendar={{month: NOV_2026, today: 2, crossedThrough: 1, note: f > 392 ? 3 : undefined}} />
          {fridgeOpen > 0 && (
            <g>
              <rect x={1600} y={504} width={280} height={576} fill="#eaf6ff" opacity={0.85 * fridgeOpen} />
              <LightPool id="ls4fridge" x={1600} y={720} rx={500} ry={360} color="#dff3ff" opacity={0.35 * fridgeOpen} />
            </g>
          )}
          {f <= 392 && <StickyNote x={nx} y={ny} size={ns} rotate={4 - 9 * k} />}
          <g transform={`translate(0 ${walking ? walkBob(ph) : 0})`}>
            <StickFigure x={x} y={704} scale={4.0} {...SAM_OUT} facing={facing} pose={pose} eyes={f > 160 && f < 330 ? 'half' : 'open'} brows={f > 160 ? 8 : 0} look={[6, -1]} glow={fridgeOpen > 0.3 ? 'cyan' : 'rim'} glowStrength={0.6} />
          </g>
        </Layer>
      </Camera>
      <Subtitle text="Too late to call now." kind="thought" x={1390} y={360} from={168} to={250} />
      <Subtitle text="Tomorrow." kind="thought" x={1300} y={360} from={262} to={322} />
      <HourglassMeter x={1720} y={110} days={f > 392 ? DAYS.nov3 : DAYS.nov2} scale={0.9} />
      <Vignette strength={0.42} />
    </AbsoluteFill>
  );
};

/* Calendar close-up with today's note (S5 and the Act 2 date cards) */
export const LCalCard: React.FC<{dur: number; month: Month; today: number; note?: number; label?: string; crossed?: number}> = ({dur, month, today, note, label, crossed}) => {
  const f = useF();
  const cell = calCell(month, 900, note ?? today);
  const zoom = usePush(dur, 1.0, 1.08);
  return (
    <AbsoluteFill style={{background: '#171b22'}}>
      <Camera zoom={zoom} ox={250 + cell.cx} oy={60 + cell.cy}>
        <Layer>
          <rect width={1920} height={1080} fill="#232831" />
          <WallCalendarAt x={250} y={60} month={month} today={today} note={note} crossed={crossed ?? today - 1} />
        </Layer>
      </Camera>
      {label && <DateChip text={label} opacity={ramp(f, 0, 8)} right />}
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

const WallCalendarAt: React.FC<{x: number; y: number; month: Month; today: number; note?: number; crossed: number}> = ({x, y, month, today, note, crossed}) => (
  <WallCalendar x={x} y={y} w={900} month={month} today={today} crossedThrough={crossed} note={note} />
);

/* ================================================================= ACT 2 */

/* Mon, Nov 9 — the meeting: he flips Mom's call face down */
export const LOffice: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const ringing = f > 30 && f < 92;
  const flip = ramp(f, 88, 100);
  const seated = (x: number, i: number, facing: 1 | -1) => (
    <StickFigure key={i} x={x} y={736} scale={3.6} facing={facing} pose={{...POSES.sitLookUp, armF: [40, 70], headTilt: 4}} eyes="open" brows={2} look={[6, 0]} glow="rim" glowStrength={0.6} />
  );
  return (
    <AbsoluteFill style={{background: '#262b34'}}>
      <Camera zoom={zoom} ox={1100} oy={600}>
        <Layer blur={3}>
          <OfficeRoom />
          {seated(560, 0, 1)}
          {seated(800, 1, 1)}
          {seated(1460, 2, -1)}
          <rect x={260} y={660} width={1400} height={30} rx={8} fill="#4a5361" />
        </Layer>
        <Layer>
          <LightPool id="lofLap" x={1080} y={560} rx={200} ry={160} color={COLD.screen} opacity={0.3} />
          <StickFigure x={1120} y={736} scale={3.6} {...SAM} facing={-1} pose={{...POSES.sitLookUp, armF: [70, 20], headTilt: f > 50 && f < 100 ? 18 : 8}} eyes={f > 50 && f < 100 ? 'half' : 'open'} brows={-6} look={[6, 2]} glow="cyan" glowStrength={0.5} />
          {/* laptop */}
          <path d="M960,656 L1060,656 L1080,560 L990,548 Z" fill="#11151b" />
          <path d="M968,650 L1054,650 L1072,566 L996,556 Z" fill={COLD.screen} opacity={0.18} />
          <rect x={260} y={656} width={1400} height={30} rx={8} fill="#4a5361" />
          <TablePhone x={1240} y={648} f={f} ringing={ringing} faceDown={flip} />
        </Layer>
      </Camera>
      <Subtitle text="Not now." kind="excuse" x={1060} y={330} from={96} to={160} />
      <HourglassMeter x={1720} y={150} days={DAYS.nov9} scale={0.9} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* Same evening — Mom almost calls, then doesn't */
export const LMomAlmost: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.1, 1.16);
  const holding = f >= 40 && f < 205;
  const knit = Math.sin(f * 0.5) * 6;
  const pose = holding
    ? {...POSES.sitKnit, armF: [64, 96] as [number, number], headTilt: 12 + Math.sin(f * 0.08) * 3}
    : {...POSES.sitKnit, armF: [40 + knit * 0.3, 70] as [number, number], armB: [30 - knit * 0.3, 75] as [number, number]};
  return (
    <AbsoluteFill style={{background: '#21170f'}}>
      <Camera zoom={zoom} ox={1000} oy={600}>
        <Layer>
          <MomRoom warmth={0} scarfPile={0.35} phoneGlow={0} />
          {holding && <LightPool id="lmaPhone" x={1060} y={520} rx={200} ry={170} color={COLD.screen} opacity={0.28} />}
          <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={pose} eyes={holding ? 'open' : 'sad'} brows={holding ? 14 : 10} look={[6, 3]} glow="amber" glowStrength={0.4}
            itemF={holding ? <HandPhone glow={1} angle={-60} /> : <KnittingInHands len={12} />} itemB={holding ? <KnittingInHands len={12} /> : undefined} />
        </Layer>
      </Camera>
      <Vignette strength={0.48} />
    </AbsoluteFill>
  );
};

/* Sun, Nov 22 — on the sofa: "She'd call if it was important." */
export const LSofa: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const flick = 0.8 + 0.2 * Math.sin(f * 0.9) * Math.sin(f * 0.31);
  const looking = f > 118 && f < 236;
  return (
    <AbsoluteFill style={{background: '#171b22'}}>
      <Camera zoom={zoom} ox={1100} oy={560}>
        <Layer>
          <SamLiving calendar={{month: NOV_2026, today: 22, crossedThrough: 21, note: 22}} tvGlow={flick} />
          <StickFigure x={1180} y={790} scale={4.0} {...SAM} facing={looking ? 1 : -1} pose={{...POSES.sitLookUp, lean: -12, armF: [30, 60], headTilt: looking ? -14 : 2}} eyes={looking ? 'open' : 'half'} brows={looking ? 4 : -2} look={[6, looking ? -2 : 1]} glow="cyan" glowStrength={0.6 * flick} />
        </Layer>
      </Camera>
      <Subtitle text="She'd call if it was important." kind="excuse" x={880} y={470} from={132} to={236} />
      <HourglassMeter x={1760} y={560} days={DAYS.nov22} scale={0.9} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* Wed, Dec 16 — first snow; he walks past the stack on his phone */
export const LPass: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.03);
  const ph = f * 0.3;
  const x = -150 + ramp(f, 20, 180) * 2250;
  return (
    <AbsoluteFill style={{background: '#12151b'}}>
      <Camera zoom={zoom} ox={1000} oy={560}>
        <Layer>
          <SamFlat time="night" snow f={f} clockMinutes={22 * 60 + 10} calendar={{month: DEC_2026, today: 16, crossedThrough: 15, stack: {day: 16, count: 34}}} />
          <LightPool id="lpPhone" x={x + 60} y={470} rx={200} ry={170} color={COLD.screen} opacity={0.3} />
          <g transform={`translate(0 ${walkBob(ph)})`}>
            <StickFigure x={x} y={704} scale={4.0} {...SAM} pose={walkPose(ph, {armF: [30, 100], headTilt: 18})} eyes="half" brows={-2} look={[6, 3]} glow="cyan" glowStrength={0.7}
              itemF={<HandPhone glow={1} angle={-30} />} />
          </g>
        </Layer>
      </Camera>
      <DateChip text="WED · DEC 16" opacity={ramp(f, 0, 8) * (1 - ramp(f, 80, 95))} />
      <HourglassMeter x={1440} y={170} days={DAYS.dec16} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

/* the stack, held (re-uses the style frame) */
export const LStack: React.FC<{dur: number}> = () => <LaterStack />;

/* insert — the scarf in Mom's basket has grown into loops */
export const LScarfPile: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.9, 2.0);
  const knit = Math.sin(f * 0.5) * 6;
  return (
    <AbsoluteFill style={{background: '#21170f'}}>
      <Camera zoom={zoom} ox={780} oy={860} dx={960 - 780} dy={540 - 860}>
        <Layer>
          <MomRoom warmth={0.1} scarfPile={1.7} />
          <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={{...POSES.sitKnit, armF: [40 + knit * 0.3, 70], armB: [30 - knit * 0.3, 75]}} eyes="open" brows={8} look={[6, 3]} glow="amber" glowStrength={0.4}
            itemF={<KnittingInHands len={14} />} />
        </Layer>
      </Camera>
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
