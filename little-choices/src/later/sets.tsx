import React from 'react';
import {COLD, WARM} from '../theme';
import {WallClock} from '../props/Props';
import {LightPool} from '../ui/UI';
import {Month, ScarfPath, Snowfall, StickyNote, WallCalendar, YarnBall} from './props';

/* ------------------------------------------------------------------ helpers */

export const Skyline: React.FC<{w: number; h: number; night: boolean; seed?: number}> = ({w, h, night, seed = 1}) => {
  const blds = Array.from({length: 9}).map((_, i) => {
    const bw = 40 + ((i * 37 + seed * 11) % 50);
    const bh = h * (0.3 + (((i * 53 + seed * 7) % 45) / 100));
    return {x: (i / 9) * w - 10 + ((i * 13) % 20), w: bw, h: bh};
  });
  return (
    <g>
      {blds.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={h - b.h} width={b.w} height={b.h} fill={night ? '#111823' : '#6f7b8b'} />
          {Array.from({length: Math.floor(b.h / 26) * 2}).map((_, k) => {
            const col = k % 2;
            const row = Math.floor(k / 2);
            const lit = ((i * 7 + k * 5 + seed) % 5) < (night ? 2 : 1);
            if (!lit) return null;
            return <rect key={k} x={b.x + 8 + col * (b.w / 2 - 4)} y={h - b.h + 12 + row * 26} width={b.w / 2 - 16} height={12} fill={night ? (k % 3 ? '#ffd98a' : '#cfefff') : '#dfe6ee'} opacity={night ? 0.8 : 0.5} />;
          })}
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ Sam's flat (cold) */

export const SamFlat: React.FC<{
  time: 'morning' | 'night'; clockMinutes: number; f?: number; snow?: boolean;
  calendar?: {month: Month; today?: number; crossedThrough?: number; note?: number; stack?: {day: number; count: number}};
  fridgeNote?: boolean;
}> = ({time, clockMinutes, f = 0, snow = false, calendar, fridgeNote = false}) => {
  const night = time === 'night';
  return (
    <g>
      <defs>
        <linearGradient id="sfWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#20252e' : '#2e3540'} />
          <stop offset="1" stopColor={night ? '#171b22' : '#232831'} />
        </linearGradient>
        <linearGradient id={`sfSky${time}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#0d1420' : '#8ea4ba'} />
          <stop offset="1" stopColor={night ? '#1a2535' : '#cfd8e1'} />
        </linearGradient>
        <clipPath id="sfWin">
          <rect x={170} y={170} width={420} height={440} />
        </clipPath>
        <linearGradient id="sfFridge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#66707f" />
          <stop offset="1" stopColor="#4c5563" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sfWall)" />
      {Array.from({length: 12}).map((_, i) => (
        <line key={i} x1={i * 170 + 40} y1={0} x2={i * 170 + 40} y2={880} stroke="#000" strokeWidth={2} opacity={0.08} />
      ))}
      {/* window with the city */}
      <rect x={154} y={154} width={452} height={472} rx={6} fill={COLD.c2} />
      <rect x={170} y={170} width={420} height={440} fill={`url(#sfSky${time})`} />
      <g clipPath="url(#sfWin)">
        <g transform="translate(170 300)">
          <Skyline w={420} h={310} night={night} />
        </g>
        {snow && <Snowfall w={1920} h={1080} f={f} n={140} />}
      </g>
      <rect x={374} y={170} width={12} height={440} fill={COLD.c2} />
      <rect x={170} y={380} width={420} height={12} fill={COLD.c2} />
      <rect x={140} y={620} width={480} height={18} rx={4} fill={COLD.c3} />
      {snow && <path d="M150,620 Q260,600 380,612 T610,616 L610,622 L150,622 Z" fill="#e8eef5" />}
      <WallClock x={790} y={205} r={44} minutes={clockMinutes} face={COLD.c3} rim={COLD.c2} hand="#1d2129" />
      {calendar && <WallCalendar x={940} y={190} w={280} month={calendar.month} today={calendar.today} crossedThrough={calendar.crossedThrough} note={calendar.note} stack={calendar.stack} />}
      {/* kitchen counter */}
      <rect x={880} y={640} width={700} height={26} fill={COLD.c3} />
      <rect x={890} y={666} width={680} height={414} fill={COLD.c2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={905 + i * 222} y={690} width={205} height={180} rx={6} fill="none" stroke={COLD.c3} strokeWidth={4} opacity={0.6} />
          <rect x={990 + i * 222} y={712} width={36} height={8} rx={4} fill={COLD.c3} />
        </g>
      ))}
      {/* kettle and a mug on the counter */}
      <path d="M1000,640 L1006,592 Q1040,580 1074,592 L1080,640 Z" fill="#1b2029" />
      <path d="M1080,606 Q1102,606 1096,628" stroke="#1b2029" strokeWidth={8} fill="none" />
      <rect x={1180} y={606} width={34} height={36} rx={6} fill="#1b2029" />
      {/* fridge */}
      <rect x={1600} y={210} width={280} height={870} rx={22} fill="url(#sfFridge)" />
      <line x1={1600} y1={500} x2={1880} y2={500} stroke="#3d4553" strokeWidth={6} />
      <rect x={1620} y={300} width={14} height={140} rx={7} fill="#3d4553" />
      <rect x={1620} y={540} width={14} height={220} rx={7} fill="#3d4553" />
      <circle cx={1820} cy={260} r={12} fill="#47a55a" />
      <rect x={1780} y={560} width={30} height={22} rx={4} fill="#3c8dd6" />
      {fridgeNote && <StickyNote x={1740} y={380} size={110} rotate={4} />}
      {/* floor */}
      <rect y={880} width={1920} height={200} fill={night ? '#12151b' : '#171b22'} />
      <rect y={872} width={1920} height={10} fill={COLD.c2} />
    </g>
  );
};

/* ------------------------------------------------------------------ Mom's room (dim warm / full warm) */

export const MomRoom: React.FC<{warmth?: number; f?: number; snow?: boolean; scarfPile?: number; phoneGlow?: number; tea?: boolean}> = ({
  warmth = 0, f = 0, snow = false, scarfPile = 0, phoneGlow = 0, tea = false,
}) => {
  const mix = (a: string, b: string) => {
    const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
    const pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
    return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * warmth).toString(16).padStart(2, '0')).join('');
  };
  return (
    <g>
      <defs>
        <radialGradient id="mrWall" cx="0.68" cy="0.48" r="0.85">
          <stop offset="0" stopColor={mix('#7a5636', '#c48d57')} />
          <stop offset="0.5" stopColor={mix('#4a3324', '#7e5737')} />
          <stop offset="1" stopColor={mix('#21170f', '#3e2c1e')} />
        </radialGradient>
        <linearGradient id="mrSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#121826" />
          <stop offset="1" stopColor="#25304a" />
        </linearGradient>
        <clipPath id="mrWin">
          <rect x={220} y={180} width={420} height={440} />
        </clipPath>
      </defs>
      <rect width={1920} height={1080} fill="url(#mrWall)" />
      {Array.from({length: 16}).map((_, i) => (
        <line key={i} x1={i * 128 + 30} y1={0} x2={i * 128 + 30} y2={880} stroke="#000" strokeWidth={10} opacity={0.05} />
      ))}
      {/* window onto the garden */}
      <rect x={204} y={164} width={452} height={472} rx={6} fill="#5a3f2a" />
      <rect x={220} y={180} width={420} height={440} fill="url(#mrSky)" />
      <g clipPath="url(#mrWin)">
        <circle cx={300} cy={250} r={26} fill="#e9eef5" opacity={0.85} />
        <path d="M560,620 C540,520 520,420 470,330 M520,470 C580,430 610,400 640,360 M500,390 C440,360 410,330 380,290" stroke="#0c0e12" strokeWidth={12} fill="none" strokeLinecap="round" />
        <rect x={220} y={560} width={420} height={60} fill={snow ? '#dfe7f0' : '#1a2016'} />
        {snow && <Snowfall w={1920} h={1080} f={f} n={160} seed={3} />}
      </g>
      <rect x={424} y={180} width={12} height={440} fill="#5a3f2a" />
      <rect x={220} y={390} width={420} height={12} fill="#5a3f2a" />
      {/* curtains */}
      <path d="M180,150 C200,300 170,480 200,660 L240,660 C220,480 246,300 232,150 Z" fill={mix('#6e4430', '#a0603e')} />
      <path d="M680,150 C660,300 690,480 660,660 L620,660 C640,480 614,300 628,150 Z" fill={mix('#6e4430', '#a0603e')} />
      {/* family photos */}
      <g>
        <rect x={1470} y={220} width={150} height={190} rx={4} fill="#3a2a1e" />
        <rect x={1482} y={232} width={126} height={166} fill={mix('#8a7058', '#e0caa4')} />
        <circle cx={1545} cy={300} r={22} fill="#0a0c10" />
        <rect x={1528} y={322} width={34} height={60} rx={14} fill="#0a0c10" />
        <rect x={1525} y={320} width={40} height={9} rx={4} fill="#d9553b" />
        <rect x={1650} y={260} width={170} height={130} rx={4} fill="#3a2a1e" />
        <rect x={1662} y={272} width={146} height={106} fill={mix('#8a7058', '#e0caa4')} />
        <circle cx={1710} cy={318} r={16} fill="#0a0c10" />
        <circle cx={1758} cy={312} r={19} fill="#0a0c10" />
        <rect x={1696} y={332} width={28} height={46} rx={10} fill="#0a0c10" />
        <rect x={1744} y={330} width={30} height={48} rx={10} fill="#0a0c10" />
      </g>
      <LightPool id="mrLamp" x={1300} y={520} rx={900} ry={640} color={WARM.lamp} opacity={0.2 + 0.32 * warmth} />
      {/* rug + floor */}
      <rect y={880} width={1920} height={200} fill={mix('#1f1610', '#3a2a1e')} />
      <rect y={872} width={1920} height={10} fill="#4a3324" />
      <ellipse cx={1000} cy={960} rx={560} ry={70} fill={mix('#4a2a22', '#8a4a35')} opacity={0.85} />
      {/* armchair */}
      <g fill={mix('#4d3524', '#7d5a3c')}>
        <rect x={810} y={500} width={380} height={320} rx={70} />
        <rect x={780} y={680} width={90} height={190} rx={40} fill={mix('#5a3f2a', '#8f6a48')} />
        <rect x={1130} y={680} width={90} height={190} rx={40} fill={mix('#5a3f2a', '#8f6a48')} />
        <rect x={850} y={740} width={300} height={70} rx={26} fill={mix('#5a3f2a', '#8f6a48')} />
        <rect x={830} y={860} width={18} height={24} fill="#21170f" />
        <rect x={1152} y={860} width={18} height={24} fill="#21170f" />
      </g>
      {/* side table + lamp + phone */}
      <rect x={1250} y={700} width={130} height={180} rx={8} fill="#3a2a1e" />
      <rect x={1240} y={690} width={150} height={16} rx={4} fill="#4a3324" />
      <rect x={1310} y={590} width={10} height={100} fill="#21170f" />
      <path d={`M1255,590 L1375,590 L1350,500 L1280,500 Z`} fill={mix('#c99a64', '#ffd08a')} />
      {tea && (
        <g fill="#21170f">
          <rect x={1340} y={662} width={26} height={28} rx={5} />
          <path d="M1366,668 q10,2 0,14" stroke="#21170f" strokeWidth={4} fill="none" />
        </g>
      )}
      <rect x={1262} y={676} width={52} height={14} rx={3} fill="#11151b" />
      {phoneGlow > 0 && <rect x={1265} y={678} width={46} height={10} rx={2} fill={COLD.screen} opacity={phoneGlow} />}
      {/* knitting basket */}
      <g>
        <path d="M600,900 L620,820 L780,820 L800,900 Z" fill="#6b4a30" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={612 + i * 4} y1={840 + i * 16} x2={788 - i * 4} y2={840 + i * 16} stroke="#4a3324" strokeWidth={4} />
        ))}
        <YarnBall x={700} y={812} r={36} />
        {scarfPile > 0 && (
          <ScarfPath d={`M760,830 C800,${860 + scarfPile * 10} ${740 - scarfPile * 40},${930} ${700 - scarfPile * 120},${935} S${520 - scarfPile * 160},${905} ${450 - scarfPile * 170},${930}`} width={18} />
        )}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ snowy street at night */

export const SnowStreet: React.FC<{f?: number; warmSpill?: number}> = ({f = 0, warmSpill = 0}) => (
  <g>
    <defs>
      <linearGradient id="ssSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0a1120" />
        <stop offset="1" stopColor="#1a2740" />
      </linearGradient>
      <radialGradient id="ssCone" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="#dff3ff" stopOpacity={0.45} />
        <stop offset="1" stopColor="#dff3ff" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#ssSky)" />
    <g transform="translate(0 170)">
      <Skyline w={1920} h={700} night seed={4} />
    </g>
    {/* the restaurant he walked out of */}
    <rect x={300} y={500} width={420} height={360} fill="#101722" />
    <rect x={330} y={540} width={360} height={240} rx={6} fill="#ffcf8a" opacity={0.85} />
    <rect x={330} y={540} width={360} height={240} rx={6} fill="#ffb35c" opacity={0.35} />
    {[390, 470, 560, 640].map((cx, i) => (
      <g key={cx} fill="#2a1d14" opacity={0.75}>
        <circle cx={cx} cy={680 - (i % 2) * 8} r={20} />
        <rect x={cx - 22} y={700 - (i % 2) * 8} width={44} height={80} rx={14} />
      </g>
    ))}
    <rect x={320} y={780} width={380} height={10} fill="#3d2a1c" />
    {/* street light */}
    <rect x={1356} y={330} width={10} height={560} fill="#0c1016" />
    <path d="M1361,330 Q1361,300 1320,300 L1290,300" stroke="#0c1016" strokeWidth={10} fill="none" />
    <rect x={1262} y={296} width={50} height={18} rx={6} fill="#dff3ff" />
    <path d="M1240,314 L1340,314 L1500,880 L1080,880 Z" fill="url(#ssCone)" />
    {/* snowy pavement */}
    <rect y={860} width={1920} height={220} fill="#c9d4df" />
    <rect y={860} width={1920} height={16} fill="#eef3f8" />
    <ellipse cx={1290} cy={900} rx={260} ry={40} fill="#ffffff" opacity={0.35} />
    {warmSpill > 0 && <rect width={1920} height={1080} fill={WARM.lamp} opacity={0.12 * warmSpill} />}
    <Snowfall w={1920} h={1080} f={f} n={220} seed={5} color={warmSpill > 0.5 ? '#ffe2b8' : '#ffffff'} size={1.2} />
  </g>
);
