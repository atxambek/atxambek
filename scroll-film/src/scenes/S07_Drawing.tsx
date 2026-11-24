import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {POSES, StickFigure} from '../characters/StickFigure';
import {HandPhone, Mug} from '../props/Props';
import {Fridge, KitchenBack} from '../sets/Kitchen';
import {COLD} from '../theme';
import {Camera, Layer, LightPool, usePush, Vignette} from '../ui/UI';

export const S7_DUR = 5 * 30;

/** S7 push-in: the "MY FAMILY" drawing on the fridge — Dad's head is a phone. */
export const S07Drawing: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = usePush(S7_DUR, 1.0, 1.12);
  return (
    <AbsoluteFill style={{background: '#2b313b'}}>
      <Camera zoom={zoom} ox={960} oy={600}>
        <Layer blur={7}>
          <KitchenBack mood="cold" />
        </Layer>
        <Layer>
          <Fridge x={610} y={40} w={700} mood="cold" drawing="phone" />
        </Layer>
      </Camera>
      {/* out-of-focus foreground: Dad's head and shoulder, phone glow */}
      <Layer blur={14}>
        <LightPool id="s7fg" x={260} y={900} rx={260} ry={200} color={COLD.screen} opacity={0.25} />
        <StickFigure x={120 - f * 0.15} y={1560} scale={13} pose={{...POSES.holdMug, armF: [40, 90]}} eyes="none" glow="cyan" glowStrength={0.5}
          itemF={<Mug />} itemB={<HandPhone glow={0.7} />} />
      </Layer>
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};
