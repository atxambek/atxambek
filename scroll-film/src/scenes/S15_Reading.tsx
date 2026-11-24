import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {POSES, StickFigure} from '../characters/StickFigure';
import {OpenBook} from '../props/Props';
import {Bed, BedroomBack, Blanket} from '../sets/Bedroom';
import {WARM} from '../theme';
import {Camera, Layer, LightPool, usePush, Vignette} from '../ui/UI';

export const S15_DUR = 6 * 30;

/** S15 wide, warm lamp: Dad reads on the bed, Mia tucked against him. */
export const S15Reading: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = usePush(S15_DUR, 1.0, 1.05);
  const turn = Math.sin(f * 0.05) * 2;
  return (
    <AbsoluteFill style={{background: '#3a2a1e'}}>
      <Camera zoom={zoom} ox={820} oy={600}>
        <Layer>
          <BedroomBack />
          <LightPool id="s15lamp" x={454} y={500} rx={760} ry={560} color={WARM.lamp} opacity={0.5} />
          <Bed />
          <StickFigure x={700} y={700} scale={4.2} pose={POSES.sitRead} eyes="open" brows={3} look={[6, 2]} glow="amber" glowStrength={0.8}
            itemF={<OpenBook angle={-25 + turn} size={1.6} />} />
          <StickFigure x={790} y={706} scale={4.2} kid pose={{...POSES.cuddle, armF: [70, 40]}} eyes="open" brows={4} look={[5, 1]} glow="amber" glowStrength={0.8} />
          <Blanket />
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};
