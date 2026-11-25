import React from 'react';
import {S01Promise} from './scenes/S01_Promise';
import {BookmarkInsert, S02Feed, S03Waiting, S04Full} from './scenes/Act1';
import {LockShot, NightBeat} from './scenes/Act2';
import {S06Kitchen, S08Close, S09Flashbacks, S10Report} from './scenes/Act3';
import {S07Drawing} from './scenes/S07_Drawing';
import {S11Box, S12Alarm, S13IntoBox, S14Knock, S16Setback, S17Montage} from './scenes/Act4';
import {S15Reading} from './scenes/S15_Reading';
import {S18NewDrawing} from './scenes/S18_NewDrawing';
import {S19Tablet, S20Again} from './scenes/Act5';
import {S21Window} from './scenes/S21_Window';
import {BlackCard, NarrationCard, QuoteCard, TitleCard} from './ui/Cards';
import {sec} from './time';

/**
 * SINGLE SOURCE OF TRUTH for the edit. Durations are in seconds.
 * Retiming a shot = change its `s`. Everything downstream (Film, animatic, audio cue sheet) follows.
 * fadeIn / fadeOut = fade from/to black (act boundaries). Default is a hard cut.
 */
export type Shot = {id: string; act: string; s: number; render: (dur: number) => React.ReactNode; fadeIn?: boolean; fadeOut?: boolean; note?: string};

const h = React.createElement;

export const TIMELINE: Shot[] = [
  // OPENING
  {id: 'C0', act: 'Opening', s: 7, render: (d) => h(NarrationCard, {dur: d, lines: ['Five minutes never feels like much.']})},

  // ACT 1 — The promise
  {id: 'S1', act: 'Act 1', s: 9, fadeIn: true, render: () => h(S01Promise)},
  {id: 'S2', act: 'Act 1', s: 6, render: (d) => h(S02Feed, {dur: d})},
  {id: 'S3', act: 'Act 1', s: 8, render: (d) => h(S03Waiting, {dur: d})},
  {id: 'S4', act: 'Act 1', s: 13, render: (d) => h(S04Full, {dur: d})},
  {id: 'S5', act: 'Act 1', s: 4, fadeOut: true, render: (d) => h(BookmarkInsert, {dur: d, page: 3})},

  // ACT 2 — The pattern
  {id: 'A2-Mon-lock', act: 'Act 2', s: 3, fadeIn: true, render: (d) => h(LockShot, {dur: d, date: 'Mon, Mar 2'})},
  {id: 'A2-Mon', act: 'Act 2', s: 6, render: (d) => h(NightBeat, {dur: d, v: 'mon'})},
  {id: 'A2-Tue-lock', act: 'Act 2', s: 3, render: (d) => h(LockShot, {dur: d, date: 'Tue, Mar 3'})},
  {id: 'A2-Tue', act: 'Act 2', s: 9, render: (d) => h(NightBeat, {dur: d, v: 'tue'})},
  {id: 'A2-Tue-bookmark', act: 'Act 2', s: 3, render: (d) => h(BookmarkInsert, {dur: d, page: 3})},
  {id: 'A2-Thu-lock', act: 'Act 2', s: 3, render: (d) => h(LockShot, {dur: d, date: 'Thu, Mar 5'})},
  {id: 'A2-Thu', act: 'Act 2', s: 10, render: (d) => h(NightBeat, {dur: d, v: 'thu'})},
  {id: 'A2-Fri-lock', act: 'Act 2', s: 3, render: (d) => h(LockShot, {dur: d, date: 'Fri, Mar 6'})},
  {id: 'A2-Fri', act: 'Act 2', s: 11, render: (d) => h(NightBeat, {dur: d, v: 'fri'})},
  {id: 'A2-dust', act: 'Act 2', s: 5, fadeOut: true, render: (d) => h(BookmarkInsert, {dur: d, page: 3, dust: true})},

  // ACT 3 — The mirror
  {id: 'S6', act: 'Act 3', s: 10, fadeIn: true, render: (d) => h(S06Kitchen, {dur: d})},
  {id: 'S7', act: 'Act 3', s: 8, render: () => h(S07Drawing)},
  {id: 'S8', act: 'Act 3', s: 9, render: (d) => h(S08Close, {dur: d})},
  {id: 'S9', act: 'Act 3', s: 4, render: (d) => h(S09Flashbacks, {dur: d})},
  {id: 'S10', act: 'Act 3', s: 11, fadeOut: true, render: (d) => h(S10Report, {dur: d})},
  {id: 'black-1', act: 'Act 3', s: 2, render: () => h(BlackCard)},
  {id: 'Q1', act: 'Act 3', s: 10, render: (d) => h(QuoteCard, {dur: d, quote: ['“It is not that we have a short time to live,', 'but that we waste a lot of it.”'], author: 'Seneca'})},

  // ACT 4 — One small step
  {id: 'S11', act: 'Act 4', s: 9, fadeIn: true, render: (d) => h(S11Box, {dur: d})},
  {id: 'S12', act: 'Act 4', s: 5, render: (d) => h(S12Alarm, {dur: d})},
  {id: 'S13', act: 'Act 4', s: 6, render: (d) => h(S13IntoBox, {dur: d})},
  {id: 'S14', act: 'Act 4', s: 10, render: (d) => h(S14Knock, {dur: d})},
  {id: 'S15', act: 'Act 4', s: 6, render: () => h(S15Reading)},
  {id: 'S15-bookmark', act: 'Act 4', s: 3, fadeOut: true, render: (d) => h(BookmarkInsert, {dur: d, page: 7, warm: true})},
  {id: 'S16', act: 'Act 4', s: 14, fadeIn: true, render: (d) => h(S16Setback, {dur: d})},
  {id: 'S17', act: 'Act 4', s: 12, fadeOut: true, render: (d) => h(S17Montage, {dur: d})},
  {id: 'Q2', act: 'Act 4', s: 10, render: (d) => h(QuoteCard, {dur: d, quote: ['“How we spend our days is, of course,', 'how we spend our lives.”'], author: 'Annie Dillard'})},

  // ACT 5 — The payoff
  {id: 'S18', act: 'Act 5', s: 7, fadeIn: true, render: () => h(S18NewDrawing)},
  {id: 'S19', act: 'Act 5', s: 15, render: (d) => h(S19Tablet, {dur: d})},
  {id: 'S20-end', act: 'Act 5', s: 4, render: (d) => h(BookmarkInsert, {dur: d, page: 96, end: true, warm: true})},
  {id: 'S20-again', act: 'Act 5', s: 6, render: (d) => h(S20Again, {dur: d})},
  {id: 'S21', act: 'Act 5', s: 11, fadeOut: true, render: () => h(S21Window)},
  {id: 'C-END', act: 'Ending', s: 9, render: (d) => h(NarrationCard, {dur: d, lines: ['They won’t remember what you scrolled.', 'They’ll remember you.'], gap: 70})},
  {id: 'TITLE', act: 'Ending', s: 10, render: (d) => h(TitleCard, {dur: d})},
];

export const shotFrames = (s: Shot) => sec(s.s);
export const TOTAL_BASE_FRAMES = TIMELINE.reduce((a, s) => a + shotFrames(s), 0);
