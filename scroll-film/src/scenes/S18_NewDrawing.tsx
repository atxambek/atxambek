import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {POSES, StickFigure} from '../characters/StickFigure';
import {Mug} from '../props/Props';
import {Fridge, KitchenBack} from '../sets/Kitchen';
import {WARM} from '../theme';
import {Camera, Layer, LightPool, usePush, Vignette} from '../ui/UI';

export const S18_DUR = 6 * 30;

/** S18 warm: the new "MY FAMILY" drawing — Dad has a real face. Dad's eyes become happy arcs. */
export const S18NewDrawing: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = usePush(S18_DUR, 1.0, 1.05);
  const happy = f > 45;
  return (
    <AbsoluteFill style={{background: WARM.wallLo}}>
      <Camera zoom={zoom} ox={800} oy={560}>
        <Layer blur={6}>
          <KitchenBack mood="warm" season="spring" />
          <LightPool id="s18lamp" x={420} y={200} rx={700} ry={520} color={WARM.lamp} opacity={0.45} />
        </Layer>
        <Layer>
          <Fridge x={280} y={40} w={700} mood="warm" drawing="face" />
          <LightPool id="s18warm" x={1380} y={480} rx={420} ry={420} color={WARM.lamp} opacity={0.25} />
          <StickFigure x={1420} y={1010} facing={-1} scale={6.6} pose={POSES.holdMug} eyes={happy ? 'happy' : 'open'} brows={happy ? 6 : 0} look={[5, -1]}
            glow="amber" glowStrength={0.8} itemF={<Mug />} />
        </Layer>
      </Camera>
      <Vignette />
    </AbsoluteFill>
  );
};
