import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure, walkBob, walkPose} from '../characters/StickFigure';
import {AlarmContent, BookSpread, Hand, PhoneClose, ShoeBox} from '../props/Inserts';
import {DOOR_X, Hallway, SHELF_X, SHELF_Y} from '../sets/Hallway';
import {COLD, WARM} from '../theme';
import {ease, ramp, useF} from '../time';
import {Camera, Layer, LightPool, ScreenTimeMeter, Subtitle, usePush, Vignette} from '../ui/UI';
import {BedroomReading} from './S15_Reading';

/** Phone lying in the box, peeking over the rim. */
export const PhoneInBox: React.FC<{dy?: number; glow?: number; tablet?: boolean; dx?: number}> = ({dy = 0, glow = 0.3, tablet = false, dx = 0}) => (
  <g transform={`translate(${dx} ${dy})`}>
    <rect x={tablet ? -20 : -70} y={-60} width={tablet ? 110 : 60} height={110} rx={10} fill="#11151b" />
    <rect x={tablet ? -12 : -64} y={-52} width={tablet ? 94 : 48} height={94} rx={6} fill={tablet ? '#ff8fb0' : COLD.screen} opacity={glow} />
  </g>
);

/* ---------------------------------------------------------------- S11 the box */

export const S11Box: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const split = dur * 0.6;
  const write = ramp(f, 20, split - 30);
  const zoomA = 1 + (f / split) * 0.05;
  const zoomB = usePush(dur, 1.0, 1.04);
  const cross = ramp(f, split - 8, split + 8);
  // marker hand follows the writing: 3 letters across the box side
  const s = 2.4;
  const boxX = 960;
  const boxY = 760;
  const mx = boxX + (-150 + 50 + write * 190) * s;
  const my = boxY - 80 * s + Math.sin(f * 0.8) * 10 * (write > 0 && write < 1 ? 1 : 0);
  return (
    <AbsoluteFill style={{background: '#14171d'}}>
      <AbsoluteFill style={{opacity: 1 - cross}}>
        <Camera zoom={zoomA}>
          <Layer blur={8}>
            <Hallway clockMinutes={21 * 60 + 40} doorLight={0.3} />
          </Layer>
          <Layer>
            <rect x={0} y={760} width={1920} height={320} fill="#2b313b" />
            <ShoeBox x={boxX} y={boxY} s={s} write={write} lid={1} />
            {/* marker + hand */}
            <g transform={`translate(${mx} ${my}) rotate(28)`}>
              <rect x={-14} y={-20} width={28} height={150} rx={10} fill="#e8e8e8" />
              <rect x={-14} y={-20} width={28} height={36} rx={8} fill="#d6262b" />
              <path d="M-8,-20 L0,-40 L8,-20 Z" fill="#d6262b" />
            </g>
            <Hand x={mx + 70} y={my + 230} s={1.2} rotate={24} curl={0.8} />
          </Layer>
        </Camera>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: cross}}>
        <Camera zoom={zoomB} ox={SHELF_X} oy={600}>
          <Layer>
            <Hallway clockMinutes={21 * 60 + 45} doorLight={0.3} />
            <ShoeBox x={SHELF_X} y={SHELF_Y} s={0.9} />
            <StickFigure x={SHELF_X - 210} y={760} scale={4.0} pose={{...POSES.stand, armF: [100 - ramp(f, split + 30, split + 60) * 70, 0], armB: [90 - ramp(f, split + 30, split + 60) * 80, 10]}}
              eyes="open" brows={4} look={[6, 0]} glow="rim" />
          </Layer>
        </Camera>
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S12 alarm */

export const S12Alarm: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const tapAt = 75;
  const tap = ramp(f, tapAt, tapAt + 20);
  const fingerY = 1300 - ease(ramp(f, 20, tapAt)) * 590 + (f > tapAt + 10 ? ramp(f, tapAt + 10, tapAt + 40) * 400 : 0);
  return (
    <AbsoluteFill style={{background: '#0d1118'}}>
      <Camera zoom={zoom}>
        <Layer blur={10}>
          <Hallway clockMinutes={20 * 60} doorLight={0.5} />
        </Layer>
        <Layer>
          <PhoneClose cx={960} cy={540} s={1.0} rotate={0} glow={0.6} clock={<text x={30} y={42}>20:00</text>}>
            <AlarmContent tap={f >= tapAt ? Math.min(0.999, tap) : 0} />
          </PhoneClose>
          <Hand x={1000} y={fingerY + 260} s={1.4} rotate={-10} point curl={1} />
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S13 phone into the box */

export const S13IntoBox: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.9, 1.98);
  const drop = ease(ramp(f, 10, 70));
  const lid = 1 - ease(ramp(f, 90, 120));
  const handOut = ramp(f, 75, 100);
  return (
    <AbsoluteFill style={{background: '#14171d'}}>
      <Camera zoom={zoom} ox={SHELF_X} oy={540} dx={960 - SHELF_X} dy={0}>
        <Layer blur={3}>
          <Hallway clockMinutes={20 * 60 + 1} doorLight={0.5} />
        </Layer>
        <Layer>
          <ShoeBox x={SHELF_X} y={SHELF_Y} s={0.9} lid={lid} contents={<PhoneInBox dy={-160 + drop * 150} glow={0.7 - drop * 0.4} />} />
          <Hand x={SHELF_X - 40} y={SHELF_Y - 360 + drop * 140 - handOut * 300} s={0.55} rotate={180} curl={0.7} />
        </Layer>
      </Camera>
      <ScreenTimeMeter x={1610} y={250} minutes={252} dim={ramp(f, 110, 150)} opacity={1 - ramp(f, 150, dur) * 0.6} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S14 knock */

export const S14Knock: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const arrive = 90;
  const walking = f < arrive;
  const ph = f * 0.32;
  const x = 200 + ease(ramp(f, 0, arrive)) * (DOOR_X - 140 - 200);
  const knocking = f > arrive + 6 && f < arrive + 40;
  const knock = knocking ? Math.abs(Math.sin((f - arrive) * 0.55)) : 0;
  const door = ease(ramp(f, 205, 225)) * 0.3;
  const peek = ramp(f, 210, 230);
  const happy = f > 270;
  const warmth = ramp(f, 230, dur);
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={1250} oy={560}>
        <Layer>
          <Hallway warmth={warmth} door={door} doorLight={0.8} clockMinutes={20 * 60 + 2} />
          <ShoeBox x={SHELF_X} y={SHELF_Y} s={0.9} />
          <LightPool id="s14w" x={DOOR_X + 160} y={560} rx={700 * (0.4 + warmth)} ry={500} color={WARM.lamp} opacity={0.15 + 0.35 * warmth} />
          <g transform={`translate(0 ${walking ? walkBob(ph) : 0})`}>
            <StickFigure x={x} y={760} scale={4.0} pose={walking ? walkPose(ph) : {...POSES.stand, armF: [95 + knock * 25, -20 - knock * 40], headTilt: -4}}
              eyes={f > 230 ? 'happy' : 'open'} brows={6} look={[6, -1]} glow={warmth > 0.3 ? 'amber' : 'rim'} glowStrength={0.4 + warmth * 0.5} />
          </g>
          {knocking && knock > 0.85 && (
            <g stroke="#f3d9a4" strokeWidth={5} strokeLinecap="round">
              <line x1={DOOR_X - 30} y1={500} x2={DOOR_X - 60} y2={480} />
              <line x1={DOOR_X - 30} y1={530} x2={DOOR_X - 70} y2={530} />
              <line x1={DOOR_X - 30} y1={560} x2={DOOR_X - 60} y2={580} />
            </g>
          )}
          {peek > 0 && (
            <g opacity={peek}>
              <StickFigure x={DOOR_X + 60} y={766} scale={4.4} kid facing={-1} pose={{...POSES.stand, lean: -14, headTilt: -10}}
                eyes={happy ? 'happy' : 'wide'} mouth={happy ? 'none' : 'o'} brows={happy ? 4 : 10} look={[5, -1]} glow="amber" glowStrength={0.6} />
            </g>
          )}
        </Layer>
      </Camera>
      <Subtitle text="Story time?" kind="spoken" x={x} y={330} from={arrive + 45} to={arrive + 120} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 70% 50%, rgba(255,179,92,${0.12 * warmth}), rgba(0,0,0,0) 70%)`}} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S16 setback */

export const S16Setback: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const pullBack = 285;
  const buzzing = f > 15 && f < pullBack + 10;
  const reach = ease(ramp(f, 30, 110)) * (1 - ease(ramp(f, pullBack, pullBack + 20)));
  const hover = Math.sin(f * 0.2) * 3 * reach;
  return (
    <AbsoluteFill style={{background: '#3a2a1e'}}>
      <Camera zoom={zoom * 1.7} ox={SHELF_X + 60} oy={560} dx={960 - SHELF_X - 60} dy={0}>
        <Layer blur={4}>
          <Hallway warmth={0.7} doorLight={1} clockMinutes={20 * 60 + 25} />
        </Layer>
        <Layer>
          <ShoeBox x={SHELF_X + 120} y={SHELF_Y} s={0.9} buzz={buzzing ? 1 : 0} frame={f} />
          <LightPool id="s16" x={SHELF_X + 120} y={SHELF_Y - 140} rx={220} ry={120} color={COLD.screen} opacity={buzzing ? 0.25 : 0} />
          <StickFigure x={SHELF_X - 160} y={780} scale={4.0}
            pose={{...POSES.stand, armF: [40 + reach * 62 + hover, 10 - reach * 10], headTilt: 6}}
            eyes={f > pullBack ? 'open' : 'half'} brows={f > pullBack ? 4 : -6} look={[6, 1]} glow={buzzing ? 'cyan' : 'amber'} glowStrength={0.6} />
        </Layer>
      </Camera>
      {/* warm light from Mia's room, off-screen right */}
      <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(255,179,92,0.35), rgba(255,179,92,0) 30%)'}} />
      <Subtitle text="Could be important." kind="excuse" x={1290} y={380} from={60} to={140} />
      <Subtitle text="Just check." kind="excuse" x={1290} y={380} from={150} to={215} />
      <Subtitle text="Daddy! Page 12!" kind="spoken" x={1600} y={520} from={220} to={290} />
      <Subtitle text="It can wait." kind="spoken" x={700} y={250} from={pullBack + 20} to={pullBack + 100} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S17 time passing */

const BEATS = [
  {season: 'winter' as const, page: 12, minutes: 190},
  {season: 'lateWinter' as const, page: 31, minutes: 105},
  {season: 'spring' as const, page: 58, minutes: 50},
];

export const S17Montage: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const beat = dur / 3;
  const X = 12; // ghosting overlap
  const op = (a: number, b: number) => Math.min(ramp(f, a - X, a + X), 1 - ramp(f, b - X, b + X));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {BEATS.map((b, i) => {
        const s0 = i * beat;
        const mid = s0 + beat * 0.55;
        const e = s0 + beat;
        return (
          <React.Fragment key={i}>
            <AbsoluteFill style={{opacity: i === 0 ? 1 - ramp(f, mid - X, mid + X) : op(s0, mid)}}>
              <BedroomReading dur={dur} season={b.season} dadEyes={i === 2 ? 'happy' : 'open'} miaEyes={i > 0 ? 'happy' : 'open'}>
                <ScreenTimeMeter x={1390} y={60} minutes={b.minutes} scale={0.85} dim={0.2} />
              </BedroomReading>
            </AbsoluteFill>
            <AbsoluteFill style={{opacity: i === 2 ? ramp(f, mid - X, mid + X) : op(mid, e)}}>
              <AbsoluteFill style={{background: '#5e4430'}}>
                <svg width={1920} height={1080} viewBox="0 0 1920 1080">
                  <BookSpread cx={960} cy={560} s={1.05} page={b.page} />
                  <rect width={1920} height={1080} fill="#ffb35c" opacity={0.08} />
                </svg>
                <Vignette />
              </AbsoluteFill>
            </AbsoluteFill>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

