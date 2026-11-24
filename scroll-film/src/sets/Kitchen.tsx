import React from 'react';
import {COLD, WARM} from '../theme';
import {FamilyDrawing} from '../props/FamilyDrawing';
import {WindowView} from './Window';

type Mood = 'cold' | 'warm';
const pal = (m: Mood) =>
  m === 'cold'
    ? {wallTop: '#3a424f', wallBot: '#2b313b', tile: '#47505e', counter: COLD.c2, counterTop: COLD.c3, fridge: ['#6a7382', '#545d6b'], fridgeEdge: '#3d4553', frame: COLD.c3, sky: ['#9fb3c8', '#c9d4de'] as [string, string], branch: '#56606c'}
    : {wallTop: '#7a5a3c', wallBot: '#4e3a28', tile: '#8a6a4a', counter: '#5e4430', counterTop: '#8a6a4a', fridge: ['#d8c4a0', '#b39a74'], fridgeEdge: '#7a6248', frame: '#9a7a56', sky: ['#1a2030', '#2a2a3a'] as [string, string], branch: '#120f0c'};

/** Kitchen back wall: tiles, window, counter. World px. */
export const KitchenBack: React.FC<{mood: Mood; season?: 'winter' | 'spring'}> = ({mood, season = 'winter'}) => {
  const p = pal(mood);
  return (
    <g>
      <defs>
        <linearGradient id={`kw${mood}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.wallTop} />
          <stop offset="1" stopColor={p.wallBot} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#kw${mood})`} />
      {Array.from({length: 14}).map((_, i) => (
        <line key={i} x1={i * 140} y1={430} x2={i * 140} y2={700} stroke={p.tile} strokeWidth={3} opacity={0.5} />
      ))}
      {[430, 500, 570, 640].map((y) => (
        <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke={p.tile} strokeWidth={3} opacity={0.5} />
      ))}
      <WindowView id={`k${mood}`} x={1430} y={160} w={330} h={260} frame={p.frame} sky={p.sky} branch={p.branch} season={season} moon={mood === 'warm'} />
      <rect x={0} y={700} width={1920} height={380} fill={p.counter} />
      <rect x={0} y={690} width={1920} height={26} fill={p.counterTop} />
      {Array.from({length: 7}).map((_, i) => (
        <g key={i}>
          <rect x={30 + i * 280} y={740} width={250} height={300} rx={8} fill="none" stroke={p.counterTop} strokeWidth={4} opacity={0.6} />
          <rect x={140 + i * 280} y={770} width={30} height={8} rx={4} fill={p.counterTop} />
        </g>
      ))}
      {mood === 'warm' && (
        <g>
          {/* pendant lamp */}
          <line x1={420} y1={0} x2={420} y2={120} stroke="#2a1d14" strokeWidth={4} />
          <path d="M360,170 L480,170 L450,118 L390,118 Z" fill="#2a1d14" />
          <ellipse cx={420} cy={172} rx={40} ry={10} fill={WARM.lamp} />
        </g>
      )}
    </g>
  );
};

/** Fridge with the drawing on the door. (x,y) = top-left of the fridge, w wide. */
export const Fridge: React.FC<{x: number; y: number; w: number; h?: number; mood: Mood; drawing: 'phone' | 'face'; drawingScale?: number; drawY?: number}> = ({x, y, w, h = 1400, mood, drawing, drawingScale = 1, drawY = 300}) => {
  const p = pal(mood);
  const k = w / 700;
  const ds = drawingScale;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={`fr${mood}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.fridge[0]} />
          <stop offset="1" stopColor={p.fridge[1]} />
        </linearGradient>
      </defs>
      <rect x={-8} y={-8} width={w + 16} height={h} rx={30} fill={p.fridgeEdge} />
      <rect width={w} height={h} rx={26} fill={`url(#fr${mood})`} />
      <line x1={0} y1={250 * k} x2={w} y2={250 * k} stroke={p.fridgeEdge} strokeWidth={6} />
      <rect x={w - 60 * k} y={120 * k} width={20 * k} height={100 * k} rx={10 * k} fill={p.fridgeEdge} />
      <rect x={w - 60 * k} y={300 * k} width={20 * k} height={240 * k} rx={10 * k} fill={p.fridgeEdge} />
      {/* fridge magnets */}
      <circle cx={90 * k} cy={330 * k} r={16 * k} fill="#47a55a" />
      <rect x={w - 180 * k} y={760 * k} width={40 * k} height={30 * k} rx={6 * k} fill="#3c8dd6" />
      <g transform={`translate(${w / 2 - 240 * ds} ${drawY}) rotate(-2) scale(${ds})`}>
        <FamilyDrawing version={drawing} id={`${mood}${drawing}`} />
      </g>
    </g>
  );
};
