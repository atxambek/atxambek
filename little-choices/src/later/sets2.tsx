import React from 'react';
import {COLD, WARM} from '../theme';
import {LightPool} from '../ui/UI';
import {Sofa} from '../sets/LivingRoom';
import {Month, Snowfall, WallCalendar} from './props';
import {Skyline} from './sets';

/* ------------------------------------------------------------------ office meeting room (cold, day) */
export const OfficeRoom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#262b34" />
    {/* glass wall onto the city */}
    <rect x={150} y={110} width={1620} height={500} fill="#9aaaba" />
    <g transform="translate(150 260)">
      <Skyline w={1620} h={350} night={false} seed={6} />
    </g>
    {Array.from({length: 7}).map((_, i) => (
      <rect key={i} x={150 + i * 270} y={110} width={10} height={500} fill="#3d4553" />
    ))}
    <rect x={150} y={600} width={1620} height={12} fill="#3d4553" />
    {/* screen on the wall with an abstract chart */}
    <rect x={1500} y={160} width={240} height={150} rx={6} fill="#1b222c" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={1530 + i * 40} y={280 - (20 + ((i * 37) % 80))} width={24} height={20 + ((i * 37) % 80)} fill={i === 3 ? COLD.screen : '#5a6372'} />
    ))}
    {/* table */}
    <rect y={880} width={1920} height={200} fill="#171b22" />
    <rect x={260} y={660} width={1400} height={30} rx={8} fill="#4a5361" />
    <rect x={300} y={690} width={1320} height={14} fill="#2b313b" />
    <rect x={340} y={700} width={24} height={180} fill="#2b313b" />
    <rect x={1560} y={700} width={24} height={180} fill="#2b313b" />
  </g>
);

/* ------------------------------------------------------------------ Sam's living room (night): sofa, TV, calendar */
export const SamLiving: React.FC<{calendar?: {month: Month; today?: number; crossedThrough?: number; note?: number; stack?: {day: number; count: number}}; tvGlow?: number; snow?: boolean; f?: number}> = ({
  calendar, tvGlow = 1, snow = false, f = 0,
}) => (
  <g>
    <defs>
      <linearGradient id="slWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#20252e" />
        <stop offset="1" stopColor="#171b22" />
      </linearGradient>
      <clipPath id="slWin">
        <rect x={700} y={170} width={380} height={400} />
      </clipPath>
    </defs>
    <rect width={1920} height={1080} fill="url(#slWall)" />
    <rect x={684} y={154} width={412} height={432} rx={6} fill={COLD.c2} />
    <rect x={700} y={170} width={380} height={400} fill="#0f1622" />
    <g clipPath="url(#slWin)">
      <g transform="translate(700 300)">
        <Skyline w={380} h={270} night seed={2} />
      </g>
      {snow && <Snowfall w={1920} h={1080} f={f} n={120} />}
    </g>
    <rect x={884} y={170} width={12} height={400} fill={COLD.c2} />
    {calendar && <WallCalendar x={1300} y={190} w={280} month={calendar.month} today={calendar.today} crossedThrough={calendar.crossedThrough} note={calendar.note} stack={calendar.stack} />}
    {/* TV on a low cabinet, side-on, glowing towards the sofa */}
    <rect x={110} y={700} width={300} height={170} rx={8} fill="#2b313b" />
    <rect x={250} y={430} width={20} height={270} fill="#0c0f14" />
    <rect x={238} y={420} width={44} height={250} rx={4} fill="#0c0f14" />
    <LightPool id="slTv" x={420} y={540} rx={520} ry={360} color={COLD.screen} opacity={0.32 * tvGlow} />
    <rect y={880} width={1920} height={200} fill="#12151b" />
    <rect y={872} width={1920} height={10} fill={COLD.c2} />
    <g transform="translate(350 120)">
      <Sofa />
    </g>
  </g>
);

/* ------------------------------------------------------------------ Sam's bedroom (night, snow) */
export const SamBedroom: React.FC<{f?: number}> = ({f = 0}) => (
  <g>
    <defs>
      <clipPath id="sbWin">
        <rect x={1200} y={160} width={420} height={400} />
      </clipPath>
    </defs>
    <rect width={1920} height={1080} fill="#181c24" />
    <rect x={1184} y={144} width={452} height={432} rx={6} fill="#2b313b" />
    <rect x={1200} y={160} width={420} height={400} fill="#0f1622" />
    <g clipPath="url(#sbWin)">
      <g transform="translate(1200 290)">
        <Skyline w={420} h={270} night seed={8} />
      </g>
      <Snowfall w={1920} h={1080} f={f} n={130} seed={4} />
    </g>
    <rect x={1404} y={160} width={12} height={400} fill="#2b313b" />
    <rect x={1170} y={570} width={480} height={16} rx={4} fill="#3d4553" />
    <rect y={880} width={1920} height={200} fill="#101318" />
    {/* bed */}
    <rect x={330} y={430} width={70} height={450} rx={18} fill="#2b313b" />
    <rect x={370} y={700} width={980} height={130} rx={18} fill="#2b313b" />
    <rect x={380} y={672} width={960} height={58} rx={22} fill="#c9d4df" />
    <rect x={400} y={600} width={150} height={86} rx={34} fill="#dfe6ee" />
    <rect x={1330} y={640} width={46} height={240} rx={14} fill="#2b313b" />
    {/* nightstand, lamp off */}
    <rect x={160} y={680} width={140} height={200} rx={8} fill="#2b313b" />
    <rect x={222} y={590} width={10} height={90} fill="#1b2029" />
    <path d="M180,590 L276,590 L258,520 L198,520 Z" fill="#3d4553" />
  </g>
);

export const ColdBlanket: React.FC = () => (
  <g>
    <path d="M470,690 C540,646 640,656 760,664 C900,668 1100,670 1240,676 C1300,678 1330,690 1340,700 L1344,800 C1100,816 700,816 460,800 Z" fill="#5a6372" />
    <path d="M470,690 C540,646 640,656 760,664 C900,668 1100,670 1240,676 C1300,678 1330,690 1340,700" stroke="#8a95a6" strokeWidth={6} fill="none" opacity={0.6} />
  </g>
);

/* ------------------------------------------------------------------ flashback: school gate in the snow */
export const SchoolGate: React.FC<{f?: number}> = ({f = 0}) => (
  <g>
    <rect width={1920} height={1080} fill="#b8c4d0" />
    <rect x={980} y={240} width={820} height={520} fill="#7d8896" />
    {Array.from({length: 12}).map((_, i) => (
      <rect key={i} x={1020 + (i % 6) * 128} y={290 + Math.floor(i / 6) * 180} width={80} height={110} fill="#a9b6c3" />
    ))}
    <rect x={960} y={210} width={860} height={40} fill="#5f6a77" />
    {/* fence + open gate */}
    {Array.from({length: 40}).map((_, i) => (i > 18 && i < 23 ? null : <rect key={i} x={i * 48} y={600} width={10} height={220} fill="#4a5361" />))}
    <rect y={620} width={880} height={10} fill="#4a5361" />
    <rect x={1100} y={620} width={820} height={10} fill="#4a5361" />
    <rect y={820} width={1920} height={260} fill="#eef2f6" />
    <Snowfall w={1920} h={1080} f={f} n={160} seed={11} color="#ffffff" size={1.3} />
  </g>
);

/* ------------------------------------------------------------------ flashback: station platform */
export const Platform: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#9aa6b2" />
    <rect x={0} y={330} width={1920} height={20} fill="#6a7482" />
    {/* the train, left side */}
    <rect x={-40} y={380} width={1160} height={420} rx={30} fill="#3d4553" />
    {Array.from({length: 5}).map((_, i) => (
      <rect key={i} x={20 + i * 210} y={440} width={150} height={120} rx={14} fill="#c9d4df" opacity={0.85} />
    ))}
    <rect x={1040} y={420} width={80} height={380} fill="#2b313b" />
    {/* platform */}
    <rect y={800} width={1920} height={280} fill="#7d8896" />
    <rect y={800} width={1920} height={16} fill="#d9c070" />
    {[1300, 1700].map((x) => (
      <g key={x}>
        <rect x={x} y={360} width={12} height={440} fill="#4a5361" />
        <rect x={x - 40} y={350} width={92} height={22} rx={6} fill="#4a5361" />
      </g>
    ))}
  </g>
);

/* ------------------------------------------------------------------ restaurant (warm) */
export const Restaurant: React.FC<{f?: number}> = ({f = 0}) => (
  <g>
    <defs>
      <radialGradient id="rsWall" cx="0.5" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#b98250" />
        <stop offset="1" stopColor="#3e2a1c" />
      </radialGradient>
      <clipPath id="rsWin">
        <rect x={140} y={170} width={460} height={420} />
      </clipPath>
    </defs>
    <rect width={1920} height={1080} fill="url(#rsWall)" />
    <rect x={124} y={154} width={492} height={452} rx={6} fill="#4a3324" />
    <rect x={140} y={170} width={460} height={420} fill="#101827" />
    <g clipPath="url(#rsWin)">
      <g transform="translate(140 300)">
        <Skyline w={460} h={290} night seed={3} />
      </g>
      <Snowfall w={1920} h={1080} f={f} n={140} seed={6} />
    </g>
    {[760, 1160, 1560].map((x) => (
      <g key={x}>
        <line x1={x} y1={0} x2={x} y2={180} stroke="#2a1d14" strokeWidth={4} />
        <path d={`M${x - 60},230 L${x + 60},230 L${x + 34},176 L${x - 34},176 Z`} fill="#2a1d14" />
        <ellipse cx={x} cy={232} rx={46} ry={10} fill={WARM.lamp} />
      </g>
    ))}
    <LightPool id="rsWarm" x={1160} y={420} rx={900} ry={520} color={WARM.lamp} opacity={0.35} />
    <rect y={880} width={1920} height={200} fill="#2a1d14" />
    {/* table with plates */}
    <rect x={720} y={650} width={760} height={26} rx={8} fill="#6b4a30" />
    <rect x={760} y={676} width={20} height={204} fill="#3e2a1c" />
    <rect x={1420} y={676} width={20} height={204} fill="#3e2a1c" />
    {[860, 1060, 1260].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={648} rx={46} ry={9} fill="#e8dcc6" />
        <rect x={x + 54} y={604} width={14} height={44} rx={4} fill="#d8c4a0" opacity={0.7} />
      </g>
    ))}
  </g>
);

/* ------------------------------------------------------------------ train window, landscape scrolling past */
export const TrainWindow: React.FC<{f: number}> = ({f}) => {
  const far = (f * 2) % 1800;
  const mid = (f * 9) % 1400;
  const near = (f * 26) % 900;
  return (
    <g>
      <defs>
        <clipPath id="twWin">
          <rect x={240} y={170} width={1240} height={470} rx={40} />
        </clipPath>
        <linearGradient id="twSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9bccd" />
          <stop offset="1" stopColor="#e3eaf0" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="#2b313b" />
      <rect x={240} y={170} width={1240} height={470} rx={40} fill="url(#twSky)" />
      <g clipPath="url(#twWin)">
        <g transform={`translate(${-far} 0)`}>
          {Array.from({length: 6}).map((_, i) => (
            <path key={i} d={`M${i * 600 - 100},520 Q${i * 600 + 200},${400 + (i % 2) * 40} ${i * 600 + 520},520 Z`} fill="#c6d1dc" />
          ))}
        </g>
        <rect x={240} y={520} width={1240} height={140} fill="#f2f5f8" />
        <g transform={`translate(${-mid} 0)`}>
          {Array.from({length: 14}).map((_, i) => (
            <g key={i} transform={`translate(${i * 220 + 100} 520)`}>
              <rect x={-4} y={-60} width={8} height={60} fill="#4a5361" />
              <path d="M0,-130 L-34,-50 L34,-50 Z" fill="#4a5361" />
              <path d="M0,-130 L-14,-96 L14,-96 Z" fill="#f2f5f8" />
            </g>
          ))}
        </g>
        <g transform={`translate(${-near} 0)`}>
          {Array.from({length: 6}).map((_, i) => (
            <rect key={i} x={i * 450 + 200} y={170} width={14} height={470} fill="#2b313b" />
          ))}
        </g>
      </g>
      <rect x={240} y={170} width={1240} height={470} rx={40} fill="none" stroke="#3d4553" strokeWidth={22} />
      <rect y={760} width={1920} height={320} fill="#1d2129" />
      {/* seat backs */}
      <rect x={1380} y={430} width={140} height={460} rx={40} fill="#3d4553" />
      <rect x={150} y={480} width={120} height={420} rx={40} fill="#3d4553" />
    </g>
  );
};

/* ------------------------------------------------------------------ Mom's house in the snow (night) */
export const MomHouse: React.FC<{f?: number; door?: number; train?: number; insideWarm?: number}> = ({f = 0, door = 0, train = -1, insideWarm = 1}) => (
  <g>
    <defs>
      <linearGradient id="mhSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1120" />
        <stop offset="1" stopColor="#1d2a42" />
      </linearGradient>
      <filter id="mhGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation={18} />
      </filter>
    </defs>
    <rect width={1920} height={1080} fill="url(#mhSky)" />
    {Array.from({length: 60}).map((_, i) => (
      <circle key={i} cx={(i * 613) % 1920} cy={(i * 271) % 420} r={i % 5 === 0 ? 2.4 : 1.4} fill="#e6edf7" opacity={0.3 + (i % 4) * 0.12} />
    ))}
    {/* distant hills + rail line */}
    <path d="M0,560 Q300,500 640,540 T1300,530 T1920,550 L1920,620 L0,620 Z" fill="#26324a" />
    <rect y={600} width={1920} height={6} fill="#3a465e" />
    {train >= 0 && (
      <g transform={`translate(${2100 - train * 3000} 0)`}>
        <rect x={0} y={566} width={760} height={36} rx={8} fill="#141b29" />
        {Array.from({length: 12}).map((_, i) => (
          <rect key={i} x={20 + i * 62} y={574} width={40} height={16} rx={3} fill="#ffd98a" opacity={0.85} />
        ))}
      </g>
    )}
    {/* snowy ground */}
    <rect y={620} width={1920} height={460} fill="#d5dee8" />
    <path d="M0,640 Q500,620 960,640 T1920,636 L1920,660 L0,660 Z" fill="#eef3f8" />
    {/* path to the door */}
    <path d="M300,1080 C500,940 780,860 930,820 L990,820 C900,880 700,980 620,1080 Z" fill="#b9c5d2" />
    {/* the house */}
    <path d="M680,420 L960,250 L1240,420 Z" fill="#141a26" />
    <path d="M660,428 L960,236 L1260,428 L1240,440 L960,262 L680,440 Z" fill="#f2f5f8" />
    <rect x={700} y={420} width={520} height={400} fill="#20283a" />
    {/* window (Mom's room) */}
    <rect x={740} y={500} width={160} height={150} fill={WARM.lamp} opacity={0.55 * insideWarm} filter="url(#mhGlow)" />
    <rect x={750} y={510} width={140} height={130} fill={insideWarm > 0 ? '#ffcf8a' : '#141a26'} />
    <rect x={816} y={510} width={8} height={130} fill="#20283a" />
    <rect x={750} y={570} width={140} height={8} fill="#20283a" />
    {/* door */}
    <rect x={990} y={560} width={150} height={260} fill="#ffcf8a" />
    <rect x={990} y={560} width={150 * (1 - door * 0.85)} height={260} fill="#3a2a1e" />
    <circle cx={990 + 150 * (1 - door * 0.85) - 18} cy={700} r={6} fill="#d8b98c" opacity={door < 0.5 ? 1 : 0} />
    {door > 0 && <path d={`M990,820 L1140,820 L${1180 + door * 120},${1000} L${950 - door * 40},${1000} Z`} fill={WARM.lamp} opacity={0.35 * door} />}
    <circle cx={1065} cy={540} r={10} fill="#ffd98a" />
    <rect x={1055} y={540} width={20} height={6} fill="#ffd98a" opacity={0.5} filter="url(#mhGlow)" />
    {/* tree + fence */}
    <path d="M1500,820 C1490,700 1480,600 1440,520 M1470,640 C1530,600 1560,570 1590,520 M1450,560 C1400,520 1380,500 1360,460" stroke="#0c1016" strokeWidth={16} fill="none" strokeLinecap="round" />
    {Array.from({length: 14}).map((_, i) => (
      <rect key={i} x={1300 + i * 46} y={760} width={10} height={90} fill="#2b313b" />
    ))}
    <rect x={1300} y={780} width={640} height={8} fill="#2b313b" />
    <Snowfall w={1920} h={1080} f={f} n={200} seed={12} />
  </g>
);
