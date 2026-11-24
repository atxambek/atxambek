import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {POSES, StickFigure} from '../characters/StickFigure';
import {HandPhone} from '../props/Props';
import {LivingRoomBack, Rug, Sofa} from '../sets/LivingRoom';
import {BOOK_BLUE, COLD} from '../theme';
import {Camera, Layer, LightPool, ScreenTimeMeter, Subtitle, usePush, Vignette} from '../ui/UI';

export const S4_DUR = 10 * 30;

/** Book lying open, face-down "tent" on a sleeping child's chest. World px. */
export const BookTent: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-64,22 L0,-30 L64,22 Z" fill="#f2eee3" />
    <path d="M-64,16 L0,-34 L64,16 L64,20 L0,-28 L-64,20 Z" fill="#6aa6c8" />
    <path d="M-60,14 L0,-34 L60,14 Z" fill={BOOK_BLUE} />
    <circle cx={22} cy={-6} r={8} fill="#fff" opacity={0.9} />
  </g>
);

/** S4 wide: Mia asleep on the rug, book on her chest; Dad finally looks up. */
export const S04Asleep: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = usePush(S4_DUR, 1.02, 1.06);
  const looked = f > 45;
  const dadX = 800;
  const dadY = 680;
  const breathe = Math.sin(f * 0.12) * 2;
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={1050} oy={700}>
        <Layer>
          <LivingRoomBack clockMinutes={22 * 60 + 33} />
          <Rug />
          <Sofa />
          <LightPool id="s4phone" x={dadX + 60} y={dadY - 20} rx={220} ry={150} color={COLD.screen} opacity={0.22} />
          <StickFigure x={dadX} y={dadY} scale={3.8} pose={looked ? POSES.sitLookUp : POSES.sitPhone}
            eyes={looked ? 'wide' : 'half'} brows={looked ? 10 : -4} look={looked ? [7, 2] : [6, 3]} glow="cyan" glowStrength={0.55}
            itemF={<HandPhone glow={0.8} angle={looked ? 70 : -40} />} />
          {/* Mia asleep on the rug, head to the left */}
          <StickFigure x={1390} y={892} rotate={-90} scale={4.4} kid pose={POSES.lie} eyes="closed" look={[0, -7]} glow="rim" glowStrength={0.7} />
          <BookTent x={1355} y={842 + breathe} s={1.15} />
        </Layer>
      </Camera>
      <Subtitle text="Oh." kind="thought" x={800} y={380} from={60} to={150} />
      <ScreenTimeMeter x={1610} y={250} minutes={151} />
      <Vignette />
    </AbsoluteFill>
  );
};
