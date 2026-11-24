import React from 'react';
import {useF} from '../time';
import {AbsoluteFill, interpolate} from 'remotion';
import {StickFigure, POSES} from '../characters/StickFigure';
import {HandBook, HandPhone} from '../props/Props';
import {LivingRoomBack, Rug, Sofa} from '../sets/LivingRoom';
import {COLD} from '../theme';
import {Camera, Layer, LightPool, ScreenTimeMeter, Subtitle, usePush, Vignette} from '../ui/UI';

export const S1_DUR = 9 * 30;

/** S1 wide: Dad on the sofa lit by his phone, Mia runs in with The Moon Rabbit. */
export const S01Promise: React.FC = () => {
  const f = useF();
  const zoom = usePush(S1_DUR, 1.0, 1.04);
  // Mia runs in from the right, stops at x=1330
  const miaX = interpolate(f, [0, 45], [2100, 1330], {extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  const running = f < 45;
  const bob = running ? Math.abs(Math.sin(f * 0.5)) * -8 : 0;
  const flicker = 0.85 + 0.15 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  const dadX = 800;
  const dadY = 680;
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={1000} oy={560}>
        <Layer>
          <LivingRoomBack clockMinutes={20 * 60 + 2} />
          <Rug />
          <Sofa />
          <LightPool id="s1phone" x={dadX + 70} y={dadY - 150} rx={300} ry={230} color={COLD.screen} opacity={0.32 * flicker} />
          <StickFigure x={dadX} y={dadY} scale={3.8} pose={POSES.sitPhone} eyes="half" brows={-4} look={[6, 3]} glow="cyan" glowStrength={0.9 * flicker}
            itemF={<HandPhone glow={flicker} angle={-40} />} />
          <StickFigure x={miaX} y={858 + bob} scale={4.4} facing={-1} kid
            pose={running ? {...POSES.walk, armF: [112, 8], armB: [100, 14], legF: [30 * Math.sin(f * 0.5), -20], legB: [-30 * Math.sin(f * 0.5), -20]} : POSES.bookUp}
            eyes={f > 60 ? 'wide' : 'open'} brows={6} look={[5, -2]} glow="rim"
            itemF={<HandBook angle={-8} size={1.45} />} />
        </Layer>
      </Camera>
      <Subtitle text="Story time?" kind="spoken" x={1330} y={560} from={50} to={150} />
      <Subtitle text="Five minutes." kind="excuse" x={800} y={360} from={125} to={230} />
      <ScreenTimeMeter x={1610} y={250} minutes={12} opacity={interpolate(f, [128, 140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Vignette />
    </AbsoluteFill>
  );
};
