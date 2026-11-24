import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure, walkBob, walkPose} from '../characters/StickFigure';
import {BookSpread, FeedContent, Hand, PhoneClose, SW} from '../props/Inserts';
import {HandBook, HandPhone} from '../props/Props';
import {LivingRoomBack, Rug, Sofa} from '../sets/LivingRoom';
import {COLD} from '../theme';
import {ease, ramp, useF} from '../time';
import {Camera, Layer, LightPool, ScreenTimeMeter, Subtitle, usePush, Vignette} from '../ui/UI';
import {BookTent} from './S04_Asleep';

/* ---------------------------------------------------------------- S2 phone feed insert */

export const S02Feed: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  // flick scrolling: each swipe ~ 24 frames, eased
  const swipe = Math.floor(f / 24);
  const t = ease(Math.min(1, (f % 24) / 14));
  const scroll = (swipe + t) * 300;
  const thumbY = 640 - Math.sin(Math.min(1, (f % 24) / 14) * Math.PI) * 220;
  const clockB = ramp(f, dur * 0.45, dur * 0.75); // dissolve 20:02 -> 20:47
  return (
    <AbsoluteFill style={{background: '#0d1118'}}>
      <Camera zoom={zoom} ox={960} oy={540}>
        <Layer blur={10}>
          <rect width={1920} height={1080} fill="#1d2129" />
          <rect x={0} y={620} width={1920} height={460} fill={COLD.c2} />
          <LightPool id="s2glow" x={960} y={540} rx={900} ry={600} color={COLD.screen} opacity={0.25} />
        </Layer>
        <Layer>
          <PhoneClose cx={960} cy={560} s={1.0} rotate={-4}
            clock={
              <>
                <text x={30} y={42} opacity={1 - clockB}>20:02</text>
                <text x={30} y={42} opacity={clockB}>20:47</text>
              </>
            }>
            <FeedContent scroll={scroll} />
          </PhoneClose>
          <Hand x={1010} y={1080} s={1.9} rotate={-8} curl={0.6} />
          {/* thumb */}
          <g transform={`translate(${960 + SW / 2 - 40} ${thumbY + 40}) rotate(-28)`}>
            <rect x={-30} y={0} width={60} height={320} rx={30} fill="#0a0c10" stroke="#9aa6bb" strokeOpacity={0.4} strokeWidth={3} />
          </g>
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S3 Mia waiting */

export const Pouf: React.FC<{x: number; y: number; color?: string}> = ({x, y, color = '#4a5361'}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={60} rx={90} ry={16} fill="#000" opacity={0.3} />
    <rect x={-80} y={-10} width={160} height={70} rx={30} fill={color} />
    <ellipse cx={0} cy={-8} rx={80} ry={18} fill="#5a6372" />
  </g>
);

export const S03Waiting: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.55, 1.6);
  const stopAt = dur * 0.62;
  const swingAmp = f < stopAt ? 1 : Math.max(0, 1 - (f - stopAt) / 10);
  const sw = Math.sin(f * 0.32) * 26 * swingAmp;
  const jump = f > dur * 0.35 ? 25 : 0; // minute hand jumps 20:15 -> 20:40
  const sag = ramp(f, stopAt, stopAt + 20);
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={1290} oy={610} dx={960 - 1290} dy={540 - 610}>
        <Layer blur={4}>
          <LivingRoomBack clockMinutes={20 * 60 + 15 + jump} />
          <Sofa />
          <LightPool id="s3phone" x={870} y={530} rx={260} ry={200} color={COLD.screen} opacity={0.3} />
          <StickFigure x={800} y={680} scale={3.8} pose={POSES.sitPhone} eyes="half" brows={-4} look={[6, 3]} glow="cyan" itemF={<HandPhone angle={-40} />} />
        </Layer>
        <Layer>
          <Rug />
          <Pouf x={1330} y={860} />
          <StickFigure x={1330} y={846} scale={4.4} kid facing={-1}
            pose={{armF: [40, 60], armB: [30, 60], legF: [80 + sw, -70 - sw * 0.6], legB: [75 - sw, -70 + sw * 0.6], headTilt: 6 + sag * 18, lean: -sag * 6}}
            eyes={sag > 0.5 ? 'sad' : 'open'} brows={4 + sag * 8} look={[5, 1 + sag * 2]} glow="rim"
            itemF={<HandBook angle={80} size={1.4} />} />
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S4 asleep → carried off */

/** Closed book lying flat on the rug (cover up), world px. */
export const BookOnRug: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70,0 L50,-18 L90,6 L-30,26 Z" fill="#f2eee3" />
    <path d="M-70,-6 L50,-24 L90,0 L-30,20 Z" fill="#9fd3f2" />
    <circle cx={22} cy={-4} r={7} fill="#fff" />
  </g>
);

export const S04Full: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const p1 = dur * 0.36; // stands, covers her
  const p2 = dur * 0.58; // carries her off
  const p3 = dur * 0.78; // hold on the book
  const looked = f > 40;
  const cross = (a: number) => ramp(f, a - 6, a + 6); // short ghosting dissolve
  const z = f < p3 ? 1.02 + (f / p3) * 0.03 : 1.05 + ramp(f, p3, dur, 0, 0.55);
  const dadX = 800;
  const breathe = Math.sin(f * 0.12) * 2;
  const carryX = 1250 - ramp(f, p2, p3 - 10) * 1550;
  const ph = f * 0.3;
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={z} ox={1320} oy={880}>
        <Layer>
          <LivingRoomBack clockMinutes={22 * 60 + 33} />
          <Rug />
          <Sofa />
        </Layer>
        {/* phase A: still on the sofa */}
        <Layer style={{opacity: 1 - cross(p1)}}>
          <LightPool id="s4phone" x={dadX + 60} y={660} rx={220} ry={150} color={COLD.screen} opacity={0.22} />
          <StickFigure x={dadX} y={680} scale={3.8} pose={looked ? POSES.sitLookUp : POSES.sitPhone}
            eyes={looked ? 'wide' : 'half'} brows={looked ? 10 : -4} look={looked ? [7, 2] : [6, 3]} glow="cyan" glowStrength={0.55}
            itemF={<HandPhone glow={0.8} angle={looked ? 70 : -40} />} />
        </Layer>
        {/* Mia on the rug (A + B) */}
        <Layer style={{opacity: 1 - cross(p2)}}>
          <StickFigure x={1390} y={892} rotate={-90} scale={4.4} kid pose={POSES.lie} eyes="closed" look={[0, -7]} glow="rim" glowStrength={0.7} />
          <BookTent x={1355} y={842 + breathe} s={1.15} />
          {/* blanket appears in B */}
          <path d="M1230,900 C1250,840 1330,830 1420,840 C1470,846 1500,870 1500,905 Z" fill="#6f7d94" opacity={ramp(f, p1 + 12, p1 + 30)} />
        </Layer>
        {/* phase B: Dad kneels over her */}
        <Layer style={{opacity: cross(p1) * (1 - cross(p2))}}>
          <StickFigure x={1210} y={800} scale={3.8} pose={{armF: [70, 30], armB: [60, 30], legF: [70, -110], legB: [20, -70], lean: 30, headTilt: 20}}
            eyes="sad" brows={12} look={[6, 3]} glow="rim" />
        </Layer>
        {/* phase C: carrying her off; the book stays */}
        <Layer style={{opacity: cross(p2)}}>
          <BookOnRug x={1330} y={890} s={1.1} />
          <g transform={`translate(0 ${walkBob(ph) * 2})`}>
            <StickFigure x={carryX} y={760} scale={3.8} facing={-1} pose={{...walkPose(ph), armF: [78, 18], armB: [72, 22], headTilt: 14}} eyes="sad" brows={8} look={[6, 3]} glow="rim" />
            <SleepingBundle x={carryX - 70} y={655} />
          </g>
        </Layer>
      </Camera>
      <Subtitle text="Oh." kind="thought" x={800} y={380} from={48} to={48 + 80} />
      <ScreenTimeMeter x={1610} y={250} minutes={151} opacity={1 - ramp(f, p3, p3 + 20)} />
      <Vignette />
    </AbsoluteFill>
  );
};

/** Mia asleep, wrapped in the blanket and held across Dad's arms (facing left). World px. */
export const SleepingBundle: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-40} y={-26} width={170} height={56} rx={28} fill="#6f7d94" />
    <path d="M-10,-20 q40,10 80,-2 q30,-8 50,6" stroke="#8592a8" strokeWidth={5} fill="none" />
    <g transform="translate(-58 -14)">
      <ellipse cx={-18} cy={-22} rx={13} ry={9} fill="#0a0c10" transform="rotate(-30 -18 -22)" />
      <ellipse cx={22} cy={-26} rx={12} ry={8} fill="#0a0c10" transform="rotate(30 22 -26)" />
      <circle r={30} fill="#0a0c10" />
      <g transform="translate(12 -27) rotate(20)">
        <rect x={-9} y={-4} width={18} height={8} rx={4} fill="#ffd23f" />
      </g>
      <path d="M-16,2 q5,5 10,0 M2,2 q5,5 10,0" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
    </g>
  </g>
);

/* ---------------------------------------------------------------- bookmark inserts */

export const BookmarkInsert: React.FC<{dur: number; page: number; dust?: boolean; end?: boolean; warm?: boolean}> = ({dur, page, dust = false, end = false, warm = false}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.06);
  const d = dust ? ramp(f, 10, dur * 0.8) : 0;
  return (
    <AbsoluteFill style={{background: warm ? '#3a2a1e' : '#14171d'}}>
      <Camera zoom={zoom} ox={1150} oy={700}>
        <Layer>
          <rect width={1920} height={1080} fill={warm ? '#5e4430' : '#2b313b'} />
          <BookSpread cx={960} cy={560} s={1.05} page={page} dust={d} end={end} />
          {warm && <LightPool id="bmw" x={700} y={300} rx={1100} ry={700} color="#ffb35c" opacity={0.3} />}
          {!warm && <rect width={1920} height={1080} fill="#1d2a3a" opacity={0.35} />}
        </Layer>
      </Camera>
      {dust &&
        Array.from({length: 26}).map((_, i) => {
          const y = ((f * (0.6 + (i % 4) * 0.2) + i * 47) % 1200) - 60;
          return <div key={i} style={{position: 'absolute', left: (i * 263) % 1920, top: y, width: 5, height: 5, borderRadius: 3, background: '#cfc8b8', opacity: 0.5 * d}} />;
        })}
      <Vignette />
    </AbsoluteFill>
  );
};
