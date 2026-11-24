import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useF} from '../time';
import {Eyes, POSES, Pose, StickFigure} from '../characters/StickFigure';
import {OpenBook} from '../props/Props';
import {Bed, BedroomBack, Blanket} from '../sets/Bedroom';
import {Season} from '../sets/Window';
import {WARM} from '../theme';
import {Camera, Layer, LightPool, usePush, Vignette} from '../ui/UI';

export const S15_DUR = 6 * 30;

export const DAD_BED = {x: 700, y: 700};
export const MIA_BED = {x: 790, y: 706};

/** Dad reading on the bed with Mia tucked against him. Reused by S15, S17, S20. */
export const BedroomReading: React.FC<{
  dur: number; season?: Season; dadEyes?: Eyes; miaEyes?: Eyes; miaPose?: Pose; miaY?: number; children?: React.ReactNode; bookOpen?: boolean;
}> = ({dur, season = 'winter', dadEyes = 'open', miaEyes = 'open', miaPose, miaY = 0, children, bookOpen = true}) => {
  const f = useF();
  const zoom = usePush(dur, 1.0, 1.05);
  const turn = Math.sin(f * 0.05) * 2;
  return (
    <AbsoluteFill style={{background: '#3a2a1e'}}>
      <Camera zoom={zoom} ox={820} oy={600}>
        <Layer>
          <BedroomBack season={season} />
          <LightPool id="s15lamp" x={454} y={500} rx={760} ry={560} color={WARM.lamp} opacity={0.5} />
          <Bed />
          <StickFigure x={DAD_BED.x} y={DAD_BED.y} scale={4.2} pose={POSES.sitRead} eyes={dadEyes} brows={3} look={[6, 2]} glow="amber" glowStrength={0.8}
            itemF={bookOpen ? <OpenBook angle={-25 + turn} size={1.6} /> : undefined} />
          <StickFigure x={MIA_BED.x} y={MIA_BED.y + miaY} scale={4.2} kid pose={miaPose ?? {...POSES.cuddle, armF: [70, 40]}} eyes={miaEyes} brows={4} look={[5, 1]} glow="amber" glowStrength={0.8} />
          <Blanket />
        </Layer>
      </Camera>
      {children}
      <Vignette />
    </AbsoluteFill>
  );
};

/** S15 wide, warm lamp: Dad reads on the bed, Mia tucked against him. */
export const S15Reading: React.FC = () => <BedroomReading dur={S15_DUR} />;
