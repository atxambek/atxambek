import React from 'react';
import {useF} from '../time';
import {AbsoluteFill, interpolate, Easing} from 'remotion';
import {BlossomBranch, Street} from '../sets/Street';
import {Camera, Layer, Vignette} from '../ui/UI';

export const S21_DUR = 11 * 30;

/** S21 final wide: pull back from Mia's window into the night street. */
export const S21Window: React.FC = () => {
  const f = useF();
  // pull back from the amber window (≈ 1078,600) to the full street
  const zoom = interpolate(f, [0, S21_DUR * 0.6], [2.6, 1.0], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const drift = interpolate(f, [S21_DUR * 0.6, S21_DUR], [1.0, 0.985], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#0b1019'}}>
      <Camera zoom={zoom * drift} ox={1076} oy={600}>
        <Layer>
          <Street frame={f} />
        </Layer>
      </Camera>
      <Layer blur={interpolate(zoom, [1, 2.6], [5, 16])} style={{opacity: interpolate(f, [S21_DUR * 0.25, S21_DUR * 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <BlossomBranch x={-40} y={300} s={1.3} />
      </Layer>
      <Vignette strength={0.42} />
    </AbsoluteFill>
  );
};
