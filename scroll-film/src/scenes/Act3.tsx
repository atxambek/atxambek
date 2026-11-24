import React from 'react';
import {AbsoluteFill, Freeze, useVideoConfig} from 'remotion';
import {POSES, StickFigure, walkBob, walkPose} from '../characters/StickFigure';
import {Hand, NotificationBanner, PhoneClose} from '../props/Inserts';
import {HandPhone, Mug} from '../props/Props';
import {Fridge, KitchenBack} from '../sets/Kitchen';
import {COLD} from '../theme';
import {ease, ramp, toFrames, useF} from '../time';
import {WhiteFlash} from '../ui/Cards';
import {Camera, Layer, LightPool, ScreenTimeMeter, Subtitle, usePush, Vignette} from '../ui/UI';
import {S03Waiting, S04Full} from './Act1';
import {NightBeat} from './Act2';

/* ---------------------------------------------------------------- S6 kitchen wide */

export const S06Kitchen: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const arrive = dur * 0.6;
  const walking = f < arrive;
  const ph = f * 0.28;
  const x = -150 + ease(ramp(f, 0, arrive)) * 1130;
  return (
    <AbsoluteFill style={{background: '#2b313b'}}>
      <Camera zoom={zoom} ox={1250} oy={560}>
        <Layer>
          <KitchenBack mood="cold" />
          <Fridge x={1240} y={150} w={400} h={800} mood="cold" drawing="phone" drawingScale={0.5} drawY={200} />
          <LightPool id="s6p" x={x - 40} y={560} rx={200} ry={160} color={COLD.screen} opacity={0.25} />
          <g transform={`translate(0 ${walking ? walkBob(ph) : 0})`}>
            <StickFigure x={x} y={820} scale={4.0} pose={walking ? walkPose(ph, {armF: [70, 40], armB: [20, 110], headTilt: 18}) : {...POSES.holdMug, armB: [20, 110], headTilt: 20}}
              eyes="half" brows={-2} look={[6, 3]} glow="cyan" glowStrength={0.6}
              itemF={<Mug />} itemB={<HandPhone angle={-30} />} />
          </g>
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S8 close on Dad */

export const S08Close: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.06);
  const wide = f > 50 && f < 110;
  const fallen = f >= 110;
  const mugLift = ramp(f, 0, 50, 0, 1);
  return (
    <AbsoluteFill style={{background: '#2b313b'}}>
      <Layer blur={12}>
        <KitchenBack mood="cold" />
        <Fridge x={-300} y={-200} w={700} mood="cold" drawing="phone" />
      </Layer>
      <Camera zoom={zoom} ox={1060} oy={520}>
        <Layer>
          <StickFigure x={1120} y={1330} scale={13} facing={-1}
            pose={{...POSES.holdMug, armF: [12 + mugLift * 50, 100 + mugLift * 10], headTilt: fallen ? 10 : -2}}
            eyes={fallen ? 'sad' : wide ? 'wide' : 'half'} brows={fallen ? 16 : wide ? 6 : -2} browLift={wide ? 1 : 0} look={[5, fallen ? 2 : 0]}
            glow="rim" itemF={<Mug />} />
        </Layer>
      </Camera>
      <Subtitle text="Is that how she sees me?" kind="thought" x={1120} y={170} from={125} to={dur - 10} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S9 flashbacks */

const FLASH_GAP = 36; // base frames between flashes (> 1 s)
export const S09Flashbacks: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const {fps} = useVideoConfig();
  const idx = Math.min(2, Math.floor(f / FLASH_GAP));
  const shots = [
    <Freeze key="a" frame={toFrames(150, fps)}><S03Waiting dur={240} /></Freeze>,
    <Freeze key="b" frame={toFrames(20, fps)}><S04Full dur={390} /></Freeze>,
    <Freeze key="c" frame={toFrames(150, fps)}><NightBeat dur={330} v="fri" /></Freeze>,
  ];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: 'grayscale(0.85) brightness(0.85) contrast(1.05)', transform: `scale(${1.04 + (f % FLASH_GAP) * 0.001})`}}>{shots[idx]}</AbsoluteFill>
      <WhiteFlash at={0} />
      <WhiteFlash at={FLASH_GAP} />
      <WhiteFlash at={FLASH_GAP * 2} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S10 weekly report */

export const S10Report: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.06);
  const slide = ease(ramp(f, 24, 44));
  return (
    <AbsoluteFill style={{background: '#14171d'}}>
      <Camera zoom={zoom} ox={900} oy={420}>
        <Layer blur={10}>
          <KitchenBack mood="cold" />
        </Layer>
        <Layer>
          <PhoneClose cx={860} cy={560} s={1.0} rotate={-4} clock={<text x={30} y={42}>09:14</text>}>
            <rect width={400} height={820} fill="#1b3550" />
            <NotificationBanner t={slide} />
          </PhoneClose>
          <Hand x={900} y={1080} s={1.9} rotate={-6} curl={0.6} />
        </Layer>
      </Camera>
      <Subtitle text="Four hours. Every day." kind="thought" x={1420} y={470} from={100} to={dur - 30} />
      <ScreenTimeMeter x={1610} y={560} minutes={252} scale={0.8} opacity={ramp(f, 60, 80)} />
      <Vignette />
    </AbsoluteFill>
  );
};
