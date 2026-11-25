import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure, walkBob, walkPose} from '../characters/StickFigure';
import {LockContent, PhoneClose} from '../props/Inserts';
import {HandBook, HandPhone} from '../props/Props';
import {LivingRoomBack, Rug, Sofa} from '../sets/LivingRoom';
import {COLD} from '../theme';
import {ramp, useF} from '../time';
import {Camera, Layer, LightPool, ScreenTimeMeter, Subtitle, usePush, Vignette} from '../ui/UI';
import {BookTent} from './S04_Asleep';

/* ---------------------------------------------------------------- lock screen */

export const LockShot: React.FC<{dur: number; date: string; time?: string}> = ({dur, date, time = '20:02'}) => {
  const zoom = usePush(dur, 1.0, 1.05);
  return (
    <AbsoluteFill style={{background: '#0d1118'}}>
      <Camera zoom={zoom}>
        <Layer blur={10}>
          <rect width={1920} height={1080} fill="#1d2129" />
          <rect x={0} y={640} width={1920} height={440} fill={COLD.c2} />
          <LightPool id="lockglow" x={960} y={540} rx={800} ry={560} color={COLD.screen} opacity={0.22} />
        </Layer>
        <Layer>
          <PhoneClose cx={960} cy={540} s={1.0} rotate={-3} clock={<text x={30} y={42}>{time}</text>}>
            <LockContent time={time} date={date} />
          </PhoneClose>
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- night beats */

type Variant = 'mon' | 'tue' | 'thu' | 'fri';
const METER: Record<Variant, [number, number]> = {mon: [140, 151], tue: [151, 184], thu: [184, 228], fri: [228, 252]};

/** One evening in the living room. Dad never looks up. */
export const NightBeat: React.FC<{dur: number; v: Variant}> = ({dur, v}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.04);
  const flicker = 0.85 + 0.15 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  const [m0, m1] = METER[v];
  const minutes = m0 + (m1 - m0) * ramp(f, 0, dur * 0.9);

  // Mia's blocking per night
  let mia: React.ReactNode = null;
  let subs: React.ReactNode = null;
  if (v === 'mon') {
    mia = (
      <>
        <StickFigure x={1390} y={892} rotate={-90} scale={4.4} kid pose={POSES.lie} eyes="closed" look={[0, -7]} glow="rim" glowStrength={0.7} />
        <BookTent x={1355} y={842} s={1.15} />
      </>
    );
  } else if (v === 'tue' || v === 'thu') {
    const slow = v === 'thu' ? 1.5 : 1;
    const arrive = 40 * slow;
    const x = 2100 - ramp(f, 0, arrive) * 770;
    const walking = f < arrive;
    const ph = f * (0.42 / slow);
    const ask = v === 'tue' ? [arrive + 6, arrive + 80] : [arrive + 10, arrive + 96];
    const reply = v === 'tue' ? [ask[1] + 4, ask[1] + 90] : [ask[1] + 4, ask[1] + 92];
    const dropped = v === 'thu' && f > reply[1] - 10;
    const lowered = f > reply[0] + 20;
    const pose = walking
      ? walkPose(ph, {armF: v === 'tue' ? [112, 8] : [30, 40]})
      : dropped
        ? {...POSES.stand, armF: [8, 4] as [number, number], headTilt: 30, lean: 4}
        : lowered || v === 'thu'
          ? {...POSES.stand, armF: [35, 50] as [number, number]}
          : POSES.bookUp;
    mia = (
      <g transform={`translate(0 ${walking ? walkBob(ph) : 0})`}>
        <StickFigure x={x} y={858} scale={4.4} facing={-1} kid pose={pose} eyes={dropped ? 'sad' : 'open'} brows={dropped ? 14 : v === 'thu' ? 8 : 4} look={[5, dropped ? 3 : -1]} glow="rim"
          itemF={<HandBook angle={dropped ? 0 : -8} size={1.45} />} />
      </g>
    );
    subs = (
      <>
        <Subtitle text="Story time?" kind="spoken" x={1330} y={560} from={ask[0]} to={ask[1]} size={v === 'thu' ? 38 : 46} />
        <Subtitle text={v === 'tue' ? 'After this one.' : 'Tomorrow, okay?'} kind="excuse" x={800} y={360} from={reply[0]} to={reply[1]} />
      </>
    );
  } else {
    // Friday: she walks past without asking.
    const ph = f * 0.36;
    const x = 2050 - ramp(f, 6, dur * 0.62) * 2350;
    mia = (
      <g transform={`translate(0 ${walkBob(ph)})`}>
        <StickFigure x={x} y={858} scale={4.4} facing={-1} kid pose={walkPose(ph, {armF: [10, 10], headTilt: 14})} eyes="sad" brows={8} look={[5, 2]} glow="rim"
          itemF={<HandBook angle={0} size={1.45} />} />
      </g>
    );
  }
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={1000} oy={560}>
        <Layer>
          <LivingRoomBack clockMinutes={v === 'mon' ? 22 * 60 + 30 : 20 * 60 + 5 + f / 30} />
          <Rug />
          <Sofa />
          <LightPool id={`nb${v}`} x={870} y={530} rx={300 + (v === 'fri' ? 60 : 0)} ry={230} color={COLD.screen} opacity={(0.3 + (v === 'fri' ? 0.12 : 0)) * flicker} />
          <StickFigure x={800} y={680} scale={3.8} pose={POSES.sitPhone} eyes="half" brows={-4} look={[6, 3]} glow="cyan" glowStrength={(v === 'fri' ? 1 : 0.9) * flicker}
            itemF={<HandPhone glow={flicker} angle={-40} />} />
          {mia}
        </Layer>
      </Camera>
      {subs}
      <ScreenTimeMeter x={1610} y={250} minutes={minutes} />
      <Vignette strength={v === 'fri' ? 0.45 : 0.35} />
    </AbsoluteFill>
  );
};
