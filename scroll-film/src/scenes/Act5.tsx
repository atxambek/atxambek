import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure, walkBob, walkPose} from '../characters/StickFigure';
import {ShoeBox} from '../props/Inserts';
import {DOOR_X, Hallway, SHELF_X, SHELF_Y} from '../sets/Hallway';
import {WARM} from '../theme';
import {ease, ramp, useF} from '../time';
import {Camera, Layer, LightPool, Subtitle, usePush, Vignette} from '../ui/UI';
import {PhoneInBox} from './Act4';
import {BedroomReading} from './S15_Reading';

/* ---------------------------------------------------------------- S19 Mia's tablet */

export const S19Tablet: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const miaArrive = 110;
  const miaWalking = f < miaArrive;
  const mph = f * 0.42;
  const miaX = DOOR_X + 120 - ease(ramp(f, 0, miaArrive)) * (DOOR_X + 120 - (SHELF_X + 110));
  const reach = ramp(f, miaArrive + 5, miaArrive + 30) * (1 - ramp(f, miaArrive + 70, miaArrive + 90));
  const drop = ease(ramp(f, miaArrive + 35, miaArrive + 60));
  const turned = f > miaArrive + 95;
  const dadArrive = 240;
  const dph = f * 0.32;
  const dadWalking = f > 170 && f < dadArrive;
  const dadX = -200 + ease(ramp(f, 170, dadArrive)) * (SHELF_X - 280 + 200);
  const surprised = f > dadArrive && f < 330;
  const laughing = f >= 330;
  const laughBob = laughing ? Math.abs(Math.sin(f * 0.5)) * -6 : 0;
  // tablet: travels from her hand into the box
  const tabletInBox = drop >= 1;
  return (
    <AbsoluteFill style={{background: '#3a2a1e'}}>
      <Camera zoom={zoom} ox={1000} oy={600}>
        <Layer>
          <Hallway warmth={1} door={1} doorLight={1} clockMinutes={20 * 60} />
          <LightPool id="s19" x={1000} y={450} rx={1100} ry={700} color={WARM.lamp} opacity={0.3} />
          <ShoeBox x={SHELF_X} y={SHELF_Y} s={0.9} lid={1}
            contents={
              <>
                <PhoneInBox dy={10} glow={0.15} />
                {(tabletInBox || drop > 0) && <PhoneInBox tablet dy={-140 + drop * 150} dx={20} glow={0.4} />}
              </>
            } />
          <g transform={`translate(0 ${miaWalking ? walkBob(mph) : 0})`}>
            <StickFigure x={miaX} y={766} scale={4.4} kid facing={turned ? 1 : -1}
              pose={miaWalking ? walkPose(mph, {armF: [60, 30]}) : turned ? {...POSES.stand, armF: [20, 20]} : {...POSES.stand, armF: [60 + reach * 100, 0], armB: [20 + reach * 80, 0], lean: -4 * reach}}
              eyes={turned ? 'happy' : 'open'} brows={4} look={[5, turned ? 0 : -3]} glow="amber" glowStrength={0.6}
              itemF={!drop && f < miaArrive + 35 ? (
                <g transform="rotate(-10)">
                  <rect x={-9} y={-7} width={18} height={14} rx={2} fill="#11151b" />
                  <rect x={-7.5} y={-5.5} width={15} height={11} rx={1.2} fill="#ff8fb0" opacity={0.6} />
                </g>
              ) : undefined} />
          </g>
          {f > 170 && (
            <g transform={`translate(0 ${(dadWalking ? walkBob(dph) : 0) + laughBob})`}>
              <StickFigure x={dadX} y={760} scale={4.0}
                pose={dadWalking ? walkPose(dph) : laughing ? {...POSES.stand, armF: [30, 40], armB: [-20, 30], headTilt: -8} : {...POSES.stand, headTilt: -6}}
                eyes={laughing ? 'happy' : surprised ? 'wide' : 'open'} mouth={surprised ? 'o' : 'none'} brows={surprised ? 10 : 4} look={[6, 0]} glow="amber" glowStrength={0.7} />
            </g>
          )}
        </Layer>
      </Camera>
      <Subtitle text="Story time." kind="spoken" x={SHELF_X + 110} y={470} from={dadArrive + 15} to={dadArrive + 95} />
      <Subtitle text="Story time." kind="spoken" x={SHELF_X - 280} y={330} from={dadArrive + 105} to={dur - 20} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S20b Again! */

export const S20Again: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const bounce = Math.abs(Math.sin(f * 0.35)) * -14 * (f < 80 ? 1 : 0.3);
  return (
    <BedroomReading dur={dur} season="spring" dadEyes={f > 80 ? 'happy' : 'open'} miaEyes="happy"
      miaPose={{armF: [165, 10], armB: [155, 15], legF: [90, 0], legB: [88, 0], lean: 4, headTilt: -8}} miaY={bounce - 10}>
      <Subtitle text="Again!" kind="spoken" x={880} y={330} from={12} to={80} />
      <Subtitle text="Again." kind="spoken" x={640} y={330} from={88} to={dur - 15} />
    </BedroomReading>
  );
};
