import React from 'react';
import {COLD, WARM} from '../theme';
import {WallClock} from '../props/Props';

/**
 * Hallway with the shelf (box goes at SHELF_X, SHELF_Y) and Mia's door on the right.
 * warmth 0 = cold night, 1 = warm lamp. door 0 closed .. 1 open (light spills out).
 */
export const SHELF_X = 820;
export const SHELF_Y = 610;
export const DOOR_X = 1360;

const mix = (a: string, b: string, t: number) => {
  const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

export const Hallway: React.FC<{warmth?: number; door?: number; doorLight?: number; clockMinutes?: number}> = ({warmth = 0, door = 0, doorLight = 1, clockMinutes = 20 * 60}) => {
  const wallTop = mix('#2b313b', '#7a5636', warmth);
  const wallBot = mix('#1d2129', '#4a3626', warmth);
  const trim = mix(COLD.c2, '#8a6a4a', warmth);
  const floor = mix('#161a20', '#3a2a1e', warmth);
  return (
    <g>
      <defs>
        <linearGradient id="hw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={wallTop} />
          <stop offset="1" stopColor={wallBot} />
        </linearGradient>
        <linearGradient id="doorSpill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={WARM.lamp} stopOpacity={0.55 * doorLight} />
          <stop offset="1" stopColor={WARM.lamp} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#hw)" />
      <rect y={850} width={1920} height={230} fill={floor} />
      <rect y={842} width={1920} height={12} fill={trim} />
      {/* runner rug */}
      <path d="M200,900 L1700,900 L1800,1000 L100,1000 Z" fill={mix(COLD.c2, '#8a4a30', warmth)} opacity={0.8} />
      {/* coat hooks + coats */}
      <rect x={160} y={330} width={260} height={14} rx={7} fill={trim} />
      <path d="M200,344 C170,420 175,560 200,600 L260,600 C275,520 270,420 240,344 Z" fill={mix('#3d4553', '#6b4a30', warmth)} />
      <path d="M320,344 C300,400 300,500 320,540 L370,540 C385,480 380,400 360,344 Z" fill={mix('#353c48', '#5e4430', warmth)} />
      {/* framed photos */}
      <rect x={560} y={260} width={150} height={190} rx={4} fill={trim} />
      <rect x={574} y={274} width={122} height={162} fill={mix('#232831', '#d8c4a0', warmth * 0.7)} />
      <circle cx={620} cy={340} r={20} fill="#0a0c10" />
      <circle cx={655} cy={360} r={13} fill="#0a0c10" />
      <WallClock x={1040} y={330} r={52} minutes={clockMinutes} face={mix(COLD.c3, '#f3d9a4', warmth)} rim={trim} hand="#1d2129" />
      {/* shelf */}
      <rect x={SHELF_X - 230} y={SHELF_Y} width={460} height={22} rx={4} fill={trim} />
      <path d={`M${SHELF_X - 190},${SHELF_Y + 22} l0,40 l30,-40 Z M${SHELF_X + 190},${SHELF_Y + 22} l0,40 l-30,-40 Z`} fill={trim} />
      {/* Mia's door */}
      <rect x={DOOR_X - 16} y={250} width={352} height={600} rx={6} fill={trim} />
      <rect x={DOOR_X} y={266} width={320} height={584} fill={door > 0 ? '#ffcf8a' : mix('#1d2129', '#3a2a1e', warmth)} />
      {door > 0 && <rect x={DOOR_X - 300} y={266} width={300} height={584} fill="url(#doorSpill)" />}
      <g transform={`translate(${DOOR_X} 266) scale(${1 - door * 0.82} 1)`}>
        <rect width={320} height={584} fill={mix('#3d4553', '#9a6a44', warmth)} />
        <rect x={40} y={50} width={240} height={200} rx={6} fill="none" stroke={mix('#2b313b', '#7a5636', warmth)} strokeWidth={8} />
        <rect x={40} y={300} width={240} height={230} rx={6} fill="none" stroke={mix('#2b313b', '#7a5636', warmth)} strokeWidth={8} />
        <circle cx={280} cy={320} r={12} fill={mix('#5a6372', '#f3d9a4', warmth)} />
        {/* Mia's star sign */}
        <path transform="translate(160 150) scale(2.4)" d="M0,-14 L4,-4 L14,-4 L6,3 L9,13 L0,7 L-9,13 L-6,3 L-14,-4 L-4,-4 Z" fill="#ffd23f" opacity={0.9} />
      </g>
      {door === 0 && doorLight > 0 && <rect x={DOOR_X} y={846} width={320} height={6} fill={WARM.lamp} opacity={0.8 * doorLight} />}
    </g>
  );
};
