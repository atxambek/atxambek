import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {FPS, H, W} from './theme';
import {S01Promise, S1_DUR} from './scenes/S01_Promise';
import {S04Asleep, S4_DUR} from './scenes/S04_Asleep';
import {S07Drawing, S7_DUR} from './scenes/S07_Drawing';
import {S15Reading, S15_DUR} from './scenes/S15_Reading';
import {S18NewDrawing, S18_DUR} from './scenes/S18_NewDrawing';
import {S21Window, S21_DUR} from './scenes/S21_Window';

const shots = [
  {id: 'S01', c: S01Promise, d: S1_DUR},
  {id: 'S04', c: S04Asleep, d: S4_DUR},
  {id: 'S07', c: S07Drawing, d: S7_DUR},
  {id: 'S15', c: S15Reading, d: S15_DUR},
  {id: 'S18', c: S18NewDrawing, d: S18_DUR},
  {id: 'S21', c: S21Window, d: S21_DUR},
];

export const RemotionRoot: React.FC = () => (
  <>
    {shots.map((s) => (
      <Composition key={s.id} id={s.id} component={s.c} durationInFrames={s.d} fps={FPS} width={W} height={H} />
    ))}
  </>
);
