import React from 'react';
import {WARM} from '../theme';
import {WindowView, Season} from './Window';

/** Mia's bedroom, warm lamp light (Act 4–5). World px. */
export const BedroomBack: React.FC<{lampOn?: number; season?: Season}> = ({lampOn = 1, season = 'winter'}) => (
  <g>
    <defs>
      <radialGradient id="bwall" cx="0.25" cy="0.45" r="0.9">
        <stop offset="0" stopColor={lampOn > 0.5 ? '#c08a55' : '#5a4a3c'} />
        <stop offset="0.45" stopColor="#7a5636" />
        <stop offset="1" stopColor="#3a2a1e" />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#bwall)" />
    {/* star decals */}
    {[[900, 160], [1040, 230], [1180, 150], [1300, 260], [980, 320], [760, 260]].map(([x, y], i) => (
      <path key={i} transform={`translate(${x} ${y}) scale(${0.8 + (i % 3) * 0.2})`} d="M0,-14 L4,-4 L14,-4 L6,3 L9,13 L0,7 L-9,13 L-6,3 L-14,-4 L-4,-4 Z" fill={WARM.cream} opacity={0.55} />
    ))}
    <WindowView id="bed" x={1520} y={200} w={260} h={330} frame="#8a6a4a" sky={['#121626', '#1e2236']} branch="#0e0b09" season={season} />
    {/* bookshelf */}
    <rect x={1080} y={430} width={260} height={16} fill="#5a3f2a" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={1095 + i * 34} y={370 - (i % 2) * 12} width={26} height={60 + (i % 2) * 12} rx={3} fill={['#c0604a', '#d9a441', '#6f8fb0', '#8fb07a', '#c98fb0', '#e0c080'][i]} opacity={0.8} />
    ))}
    {/* floor */}
    <rect y={850} width={1920} height={230} fill={WARM.floor} />
    <rect y={842} width={1920} height={12} fill="#5a3f2a" />
    {/* bedside table + lamp */}
    <rect x={380} y={640} width={150} height={210} rx={8} fill="#5a3f2a" />
    <rect x={448} y={540} width={12} height={100} fill="#3a2a1e" />
    <ellipse cx={454} cy={640} rx={40} ry={8} fill="#3a2a1e" />
    <path d="M394,540 L514,540 L490,450 L418,450 Z" fill={lampOn > 0.5 ? '#ffd08a' : '#8a6a4a'} />
  </g>
);

export const Bed: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <g>
    <ellipse cx={1050} cy={858} rx={520} ry={20} fill="#000" opacity={0.3} />
    <rect x={560} y={470} width={70} height={390} rx={20} fill="#5a3f2a" />
    <rect x={600} y={700} width={920} height={130} rx={18} fill="#6b4a30" />
    <rect x={610} y={670} width={900} height={60} rx={22} fill="#efe0c0" />
    <rect x={1490} y={640} width={50} height={220} rx={16} fill="#5a3f2a" />
    <rect x={630} y={590} width={150} height={90} rx={36} fill="#f6ead2" />
    {children}
  </g>
);

export const Blanket: React.FC = () => (
  <g>
    <path d="M700,690 C760,640 860,650 960,660 C1060,665 1200,668 1300,672 C1400,676 1480,670 1500,690 L1505,800 C1300,815 900,815 690,800 Z" fill="#d98a5a" />
    <path d="M700,690 C760,640 860,650 960,660 C1060,665 1200,668 1300,672 C1400,676 1480,670 1500,690" stroke="#f3d9a4" strokeWidth={8} fill="none" opacity={0.7} />
    {[820, 980, 1140, 1300].map((x) => (
      <circle key={x} cx={x} cy={740} r={12} fill="#f3d9a4" opacity={0.5} />
    ))}
  </g>
);
