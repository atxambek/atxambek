import React from 'react';
import {Shot, shotFrames} from '../timeline';
import {toFrames} from '../time';
import {BlackCard, NarrationCard, QuoteCard, TitleCard} from '../ui/Cards';
import {LCalCard, LMomAlmost, LOffice, LPass, LS1a, LS1b, LS2, LS3, LS4, LScarfPile, LSofa, LStack} from './act12';
import {LS10, LS11, LS12, LS13, LS14, LS15, LS16, LS17, LS18, LS19, LS6, LS7, LS8, LS9} from './act345';
import {NOV_2026} from './props';

/**
 * LATER — single source of truth for the edit (seconds per shot). Same rules as SCROLL's timeline.
 * Day counts on screen follow DAYS in cast.ts (last call: Fri, Oct 30 2026).
 */
const h = React.createElement;

export const LATER_TIMELINE: Shot[] = [
  // OPENING
  {id: 'C0', act: 'Opening', s: 7, render: (d) => h(NarrationCard, {dur: d, lines: ['“Later” always sounds like a promise.']})},

  // ACT 1 — The promise
  {id: 'S1a', act: 'Act 1', s: 7, fadeIn: true, render: (d) => h(LS1a, {dur: d})},
  {id: 'S1b', act: 'Act 1', s: 6, render: (d) => h(LS1b, {dur: d})},
  {id: 'S2', act: 'Act 1', s: 5, render: (d) => h(LS2, {dur: d})},
  {id: 'S3', act: 'Act 1', s: 9, render: (d) => h(LS3, {dur: d})},
  {id: 'S4', act: 'Act 1', s: 15, render: (d) => h(LS4, {dur: d})},
  {id: 'S5', act: 'Act 1', s: 4, fadeOut: true, render: (d) => h(LCalCard, {dur: d, month: NOV_2026, today: 2, note: 3, crossed: 1})},

  // ACT 2 — The pattern
  {id: 'A2-Nov9', act: 'Act 2', s: 3, fadeIn: true, render: (d) => h(LCalCard, {dur: d, month: NOV_2026, today: 9, note: 9, label: 'MON · NOV 9'})},
  {id: 'A2-office', act: 'Act 2', s: 9, render: (d) => h(LOffice, {dur: d})},
  {id: 'A2-mom', act: 'Act 2', s: 9, render: (d) => h(LMomAlmost, {dur: d})},
  {id: 'A2-Nov22', act: 'Act 2', s: 3, render: (d) => h(LCalCard, {dur: d, month: NOV_2026, today: 22, note: 22, label: 'SUN · NOV 22'})},
  {id: 'A2-sofa', act: 'Act 2', s: 10, render: (d) => h(LSofa, {dur: d})},
  {id: 'A2-pass', act: 'Act 2', s: 7, render: (d) => h(LPass, {dur: d})},
  {id: 'A2-stack', act: 'Act 2', s: 5, render: (d) => h(LStack, {dur: d})},
  {id: 'A2-scarf', act: 'Act 2', s: 5, fadeOut: true, render: (d) => h(LScarfPile, {dur: d})},

  // ACT 3 — The mirror
  {id: 'S6', act: 'Act 3', s: 8, fadeIn: true, render: (d) => h(LS6, {dur: d})},
  {id: 'S7', act: 'Act 3', s: 10, render: (d) => h(LS7, {dur: d})},
  {id: 'S8', act: 'Act 3', s: 9, render: (d) => h(LS8, {dur: d})},
  {id: 'S9', act: 'Act 3', s: 4, render: (d) => h(LS9, {dur: d})},
  {id: 'S10', act: 'Act 3', s: 12, fadeOut: true, render: (d) => h(LS10, {dur: d})},
  {id: 'black-1', act: 'Act 3', s: 2, render: () => h(BlackCard)},
  {id: 'Q1', act: 'Act 3', s: 9, render: (d) => h(QuoteCard, {dur: d, quote: ['“Procrastination is the thief of time.”'], author: 'Edward Young'})},

  // ACT 4 — One small step
  {id: 'S11', act: 'Act 4', s: 9, fadeIn: true, render: (d) => h(LS11, {dur: d})},
  {id: 'S12', act: 'Act 4', s: 11, render: (d) => h(LS12, {dur: d})},
  {id: 'S13', act: 'Act 4', s: 22, render: (d) => h(LS13, {dur: d})},
  {id: 'S14', act: 'Act 4', s: 14, fadeOut: true, render: (d) => h(LS14, {dur: d})},
  {id: 'Q2', act: 'Act 4', s: 9, render: (d) => h(QuoteCard, {dur: d, quote: ['“The days are long,', 'but the years are short.”'], author: 'Gretchen Rubin'})},

  // ACT 5 — The payoff
  {id: 'S15', act: 'Act 5', s: 9, fadeIn: true, render: (d) => h(LS15, {dur: d})},
  {id: 'S16', act: 'Act 5', s: 9, render: (d) => h(LS16, {dur: d})},
  {id: 'S17', act: 'Act 5', s: 12, render: (d) => h(LS17, {dur: d})},
  {id: 'S18', act: 'Act 5', s: 13, render: (d) => h(LS18, {dur: d})},
  {id: 'S19', act: 'Act 5', s: 11, fadeOut: true, render: (d) => h(LS19, {dur: d})},
  {id: 'C-END', act: 'Ending', s: 9, render: (d) => h(NarrationCard, {dur: d, lines: ['No calendar has a day called “Later.”']})},
  {id: 'TITLE', act: 'Ending', s: 10, render: (d) => h(TitleCard, {dur: d, title: 'LATER', tagline: 'Call her today.'})},
];

export const laterTotal = (fps: number) => LATER_TIMELINE.reduce((a, s) => a + toFrames(shotFrames(s), fps), 0);
