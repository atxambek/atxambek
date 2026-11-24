import React from 'react';
import {COLD} from '../theme';
import {WallClock} from '../props/Props';
import {WindowView} from './Window';

/** Evening living room, cold palette (Acts 1–2). World px 1920x1080. */
export const LivingRoomBack: React.FC<{clockMinutes: number}> = ({clockMinutes}) => (
  <g>
    <defs>
      <linearGradient id="lrWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#262b34" />
        <stop offset="1" stopColor={COLD.c1} />
      </linearGradient>
      <linearGradient id="lrFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#20252d" />
        <stop offset="1" stopColor="#161a20" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#lrWall)" />
    {/* wainscot stripe */}
    <rect y={600} width={1920} height={170} fill="#2f3540" opacity={0.6} />
    <rect y={760} width={1920} height={320} fill="url(#lrFloor)" />
    <rect y={752} width={1920} height={14} fill={COLD.c2} />
    <WindowView id="lr" x={150} y={190} w={300} h={360} frame={COLD.c2} sky={['#0f1520', '#1b2433']} branch="#0b0e13" season="winter" />
    {/* picture frame above sofa */}
    <rect x={770} y={260} width={220} height={150} rx={4} fill={COLD.c2} />
    <rect x={784} y={274} width={192} height={122} fill="#232831" />
    <path d="M790,390 L850,330 L890,365 L930,320 L972,390 Z" fill="#323946" />
    <WallClock x={1240} y={300} r={58} minutes={clockMinutes} face={COLD.c3} rim={COLD.c2} hand="#1d2129" />
    {/* floor lamp (off) */}
    <g fill={COLD.c2}>
      <rect x={1856} y={420} width={8} height={340} />
      <ellipse cx={1860} cy={762} rx={46} ry={10} />
      <path d="M1805,420 L1915,420 L1890,330 L1830,330 Z" fill={COLD.c3} />
    </g>
    {/* side table + plant */}
    <rect x={430} y={640} width={110} height={120} rx={6} fill={COLD.c2} />
    <rect x={462} y={600} width={44} height={42} rx={6} fill={COLD.c3} />
    <path d="M484,602 C470,560 450,545 440,540 M484,602 C490,560 505,540 520,532 M484,602 C484,570 484,555 486,535" stroke="#3e4a4a" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

export const Sofa: React.FC = () => (
  <g>
    <ellipse cx={870} cy={772} rx={360} ry={18} fill="#000" opacity={0.3} />
    <rect x={540} y={520} width={660} height={200} rx={40} fill={COLD.c2} />
    <rect x={570} y={660} width={600} height={90} rx={22} fill="#4a5361" />
    <rect x={590} y={640} width={290} height={46} rx={20} fill="#525b6a" />
    <rect x={890} y={640} width={280} height={46} rx={20} fill="#525b6a" />
    <rect x={510} y={600} width={90} height={155} rx={34} fill={COLD.c3} />
    <rect x={1140} y={600} width={90} height={155} rx={34} fill={COLD.c3} />
    <rect x={560} y={745} width={18} height={22} fill="#1d2129" />
    <rect x={1165} y={745} width={18} height={22} fill="#1d2129" />
  </g>
);

export const Rug: React.FC<{cx?: number}> = ({cx = 1330}) => (
  <g>
    <ellipse cx={cx} cy={900} rx={420} ry={82} fill={COLD.c2} />
    <ellipse cx={cx} cy={900} rx={360} ry={62} fill="none" stroke="#4a5361" strokeWidth={6} />
    <ellipse cx={cx} cy={900} rx={270} ry={42} fill="none" stroke="#4a5361" strokeWidth={4} />
  </g>
);
