import React from 'react';
import {VerticalTimelineFilm, FrameKey, V_FULL} from '../vertical';
import {LATER_TIMELINE} from './timeline';
import type {MeterPlace} from '../ui/frameCtx';

/** LATER — per-shot framing for the 1080x1920 cut: [seconds into shot, focus x (1920 frame px), scale]. */
const FULL = V_FULL;
const FRAMING: Record<string, FrameKey[]> = {
  S1a: [[0, 520], [2.0, 820], [3.0, 860]],
  S1b: [[0, 1000]],
  S2: [[0, 960, 1.3]],
  S3: [[0, 1180, 1.3]],
  S4: [[0, 700, 1.3], [3.5, 1350, 1.3]],
  S5: [[0, 600, 1.3]],
  'A2-Nov9': [[0, 520, 1.3]],
  'A2-office': [[0, 1150]],
  'A2-mom': [[0, 1050]],
  'A2-Nov22': [[0, 1000, 1.3]],
  'A2-sofa': [[0, 1250, 1.3]],
  'A2-pass': [[0, 500], [2.0, 700], [4.0, 1080]],
  'A2-stack': [[0, 600, 1.3]],
  'A2-scarf': [[0, 960]],
  S6: [[0, 560]],
  S7: [[0, 900]],
  S8: [[0, 920]],
  S9: [[0, 940], [1.19, 940], [1.2, 1265, 1.3], [2.39, 1265, 1.3], [2.4, 1000, FULL]],
  S10: [[0, 960, 1.3]],
  S11: [[0, 700], [4.9, 700], [5.6, 1250, 1.3]],
  S12: [[0, 1200, 1.3], [1.2, 1200, 1.3], [1.9, 1450, 1.3]],
  // the call: the frame follows whoever speaks, then opens up on both as the divider fades
  S13: [[0, 480], [3.5, 480], [4.2, 1440], [6.8, 1440], [7.1, 480], [9.6, 480], [9.9, 1440], [11.8, 1440], [12.0, 480], [14.4, 480], [14.7, 1440], [17.4, 1440], [18.2, 960, 1.0]],
  S14: [[0, 960], [4.6, 960], [4.7, 1100], [9.3, 1100], [9.4, 960]],
  S15: [[0, 1150, 1.3]],
  S16: [[0, 700, 1.3], [5.7, 1000, 1.3]],
  S17: [[0, 920, 1.3]],
  S18: [[0, 975]],
  S19: [[0, 820], [7, 940]],
};
const CARDS = new Set(['C0', 'black-1', 'Q1', 'Q2', 'C-END', 'TITLE']);
// lines that would sit on the calendar, the meter or the voicemail row move down (world y of the line's bottom)
const SUB_Y: Record<string, number> = {S4: 1000, 'A2-sofa': 1000, S7: 560, S8: 850};
// where the calendar fills the top right, LAST CALL moves out of its way
const METER: Record<string, MeterPlace> = {
  'A2-sofa': {side: 'left'},
  'A2-pass': {side: 'left', y: 110},
  'A2-stack': {side: 'right', y: 790, card: true},
};

export const LaterVertical: React.FC = () => <VerticalTimelineFilm timeline={LATER_TIMELINE} cut={{framing: FRAMING, subY: SUB_Y, cards: CARDS, meter: METER}} />;
