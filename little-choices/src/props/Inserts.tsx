import React from 'react';
import {HAND as HAND_FONT} from '../fonts';
import {BOOK_BLUE, COLD, INK} from '../theme';

/* ---------------------------------------------------------------- hand */

/** Simple close-up silhouette hand with 4 fingers. Origin = wrist centre, pointing up. Size ~ 1 = 260 px tall. */
export const Hand: React.FC<{x: number; y: number; s?: number; rotate?: number; curl?: number; point?: boolean; rim?: string}> = ({
  x, y, s = 1, rotate = 0, curl = 0, point = false, rim = '#9aa6bb',
}) => {
  const fingers = [
    {x: -46, len: 92},
    {x: -16, len: 108},
    {x: 14, len: 104},
    {x: 42, len: 84},
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <defs>
        <filter id="handRim" x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={2} result="d" />
          <feGaussianBlur in="d" stdDeviation={4} result="b" />
          <feFlood floodColor={rim} floodOpacity={0.55} />
          <feComposite in2="b" operator="in" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill={INK} filter="url(#handRim)">
        <rect x={-50} y={0} width={100} height={170} rx={30} />
        <rect x={-66} y={-110} width={132} height={140} rx={50} />
        {fingers.map((fg, i) => {
          const l = point && i === 1 ? fg.len : fg.len * (1 - curl * 0.55);
          return <rect key={i} x={fg.x - 14} y={-110 - l + 30} width={28} height={l} rx={14} />;
        })}
        <rect x={-30} y={-62} width={30} height={92} rx={15} transform="rotate(-48 -30 30)" />
      </g>
    </g>
  );
};

/* ---------------------------------------------------------------- phone */

export const SW = 400;
export const SH = 820;

/** Big phone for inserts. Screen content drawn in a 400x820 local box. */
export const PhoneClose: React.FC<{cx: number; cy: number; s?: number; rotate?: number; clock?: React.ReactNode; glow?: number; children?: React.ReactNode}> = ({
  cx, cy, s = 1, rotate = 0, clock, glow = 1, children,
}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${s}) translate(${-SW / 2} ${-SH / 2})`}>
    <defs>
      <filter id="phoneGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation={40} />
      </filter>
      <clipPath id="screenClip">
        <rect width={SW} height={SH} rx={34} />
      </clipPath>
    </defs>
    <rect x={-30} y={-30} width={SW + 60} height={SH + 60} rx={60} fill={COLD.screen} opacity={0.35 * glow} filter="url(#phoneGlow)" />
    <rect x={-22} y={-22} width={SW + 44} height={SH + 44} rx={56} fill="#0d1015" />
    <g clipPath="url(#screenClip)">
      <rect width={SW} height={SH} fill="#0f1c26" />
      {children}
      {/* status bar */}
      <rect width={SW} height={56} fill="#0f1c26" opacity={0.85} />
      <g fontFamily={HAND_FONT} fontSize={34} fill="#e9f6ff">{clock}</g>
      <rect x={SW - 80} y={20} width={40} height={18} rx={4} fill="none" stroke="#e9f6ff" strokeWidth={3} />
      <rect x={SW - 77} y={23} width={26} height={12} rx={2} fill="#e9f6ff" />
    </g>
    <rect x={SW / 2 - 60} y={10} width={120} height={26} rx={13} fill="#0d1015" />
  </g>
);

/** Abstract feed: coloured cards, generic shapes, little hearts. No real UI. */
export const FeedContent: React.FC<{scroll: number}> = ({scroll}) => {
  const colors = ['#ff8fb0', '#ffd23f', '#7fe0c4', '#a98bff', '#5fd3ff', '#ffa24d'];
  const cardH = 300;
  const items = Array.from({length: 14});
  return (
    <g transform={`translate(0 ${70 - (scroll % (cardH * 6))})`}>
      {items.map((_, i) => {
        const c = colors[i % colors.length];
        const y = i * cardH;
        return (
          <g key={i} transform={`translate(20 ${y})`}>
            <rect width={SW - 40} height={cardH - 24} rx={22} fill="#18303f" />
            <circle cx={34} cy={34} r={18} fill={colors[(i + 2) % 6]} />
            <rect x={62} y={24} width={150} height={18} rx={9} fill="#3c5a6c" />
            <rect x={16} y={66} width={SW - 72} height={150} rx={16} fill={c} opacity={0.85} />
            {i % 3 === 0 && <circle cx={SW / 2 - 20} cy={140} r={40} fill="#fff" opacity={0.6} />}
            {i % 3 === 1 && <path d={`M${80},200 L${160},110 L${220},170 L${270},120 L${SW - 70},200 Z`} fill="#fff" opacity={0.5} />}
            {i % 3 === 2 && <rect x={120} y={100} width={120} height={80} rx={12} fill="#fff" opacity={0.5} />}
            <path d="M34,246 c-6,-10 -20,-4 -12,8 l12,10 l12,-10 c8,-12 -6,-18 -12,-8z" fill="#ff6b8a" />
            <rect x={60} y={240} width={60} height={14} rx={7} fill="#3c5a6c" />
          </g>
        );
      })}
    </g>
  );
};

/** Generic lock screen with time and date. */
export const LockContent: React.FC<{time: string; date: string}> = ({time, date}) => (
  <g>
    <defs>
      <linearGradient id="lockBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1b3550" />
        <stop offset="1" stopColor="#0c1622" />
      </linearGradient>
    </defs>
    <rect width={SW} height={SH} fill="url(#lockBg)" />
    <circle cx={SW * 0.75} cy={SH * 0.72} r={120} fill={COLD.screen} opacity={0.12} />
    <circle cx={SW * 0.2} cy={SH * 0.88} r={80} fill="#a98bff" opacity={0.12} />
    <text x={SW / 2} y={200} textAnchor="middle" fontFamily={HAND_FONT} fontSize={40} fill="#cfe9ff">{date}</text>
    <text x={SW / 2} y={330} textAnchor="middle" fontFamily={HAND_FONT} fontSize={140} fill="#ffffff">{time}</text>
    <rect x={SW / 2 - 70} y={SH - 40} width={140} height={10} rx={5} fill="#cfe9ff" opacity={0.7} />
  </g>
);

/** Weekly report banner sliding in from the top. t: 0 hidden .. 1 shown */
export const NotificationBanner: React.FC<{t: number}> = ({t}) => (
  <g transform={`translate(16 ${-190 + t * 260})`}>
    <rect width={SW - 32} height={180} rx={26} fill="#f2f6fa" />
    <rect x={20} y={22} width={44} height={44} rx={12} fill="#5a6372" />
    <rect x={33} y={30} width={18} height={28} rx={4} fill="none" stroke="#fff" strokeWidth={3} />
    <text x={80} y={56} fontFamily={HAND_FONT} fontSize={32} fill="#2b313b">Weekly report</text>
    <text x={24} y={116} fontFamily={HAND_FONT} fontSize={34} fill="#1d2129">Daily average:</text>
    <text x={24} y={160} fontFamily={HAND_FONT} fontSize={42} fill="#0b6f99">4h 12m</text>
  </g>
);

/** Alarm screen: 20:00 PHONE BOX, STOP / SNOOZE. tap 0..1 ripple on STOP. */
export const AlarmContent: React.FC<{tap: number}> = ({tap}) => (
  <g>
    <rect width={SW} height={SH} fill="#15202b" />
    <text x={SW / 2} y={250} textAnchor="middle" fontFamily={HAND_FONT} fontSize={150} fill="#ffffff">20:00</text>
    <text x={SW / 2} y={330} textAnchor="middle" fontFamily={HAND_FONT} fontSize={48} fill="#ffb35c" letterSpacing={4}>PHONE BOX</text>
    <rect x={40} y={520} width={SW - 80} height={90} rx={45} fill="#2b313b" />
    <text x={SW / 2} y={578} textAnchor="middle" fontFamily={HAND_FONT} fontSize={40} fill="#9aa6bb">snooze</text>
    <rect x={40} y={640} width={SW - 80} height={100} rx={50} fill={tap > 0 ? '#ffb35c' : '#e86a4c'} />
    <text x={SW / 2} y={705} textAnchor="middle" fontFamily={HAND_FONT} fontSize={52} fill="#ffffff">STOP</text>
    {tap > 0 && tap < 1 && <circle cx={SW / 2} cy={690} r={30 + tap * 140} fill="none" stroke="#fff" strokeWidth={6} opacity={1 - tap} />}
  </g>
);

/* ---------------------------------------------------------------- book spread */

/**
 * Close-up of the open book with the bookmark and a big page number. World px around (cx, cy).
 * page: number shown on the right page. end: shows THE END instead of text.
 */
export const BookSpread: React.FC<{cx: number; cy: number; s?: number; page: number; dust?: number; end?: boolean}> = ({cx, cy, s = 1, page, dust = 0, end = false}) => {
  const lines = (x0: number) =>
    Array.from({length: 9}).map((_, i) => <rect key={i} x={x0} y={-230 + i * 42} width={i === 8 ? 180 : 300 - (i % 3) * 30} height={12} rx={6} fill="#b9b1a0" />);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <ellipse cx={0} cy={330} rx={820} ry={40} fill="#000" opacity={0.35} />
      <rect x={-790} y={-330} width={1580} height={650} rx={20} fill="#6aa6c8" />
      <path d="M-760,-310 Q-380,-350 0,-300 L0,300 Q-380,260 -760,300 Z" fill="#f5f0e4" />
      <path d="M760,-310 Q380,-350 0,-300 L0,300 Q380,260 760,300 Z" fill="#f8f3e8" />
      <rect x={-6} y={-300} width={12} height={600} fill="#d9d0bd" />
      {/* left page: illustration */}
      <g transform="translate(-380 -40)">
        <circle cx={-110} cy={-120} r={70} fill="#e9eef5" />
        <circle cx={-80} cy={-140} r={60} fill="#f5f0e4" />
        <g fill={BOOK_BLUE} transform="translate(30 60) scale(5)">
          <ellipse cx={0} cy={8} rx={13} ry={11} />
          <circle cx={9} cy={-6} r={7.5} />
          <ellipse cx={6} cy={-19} rx={2.6} ry={9} transform="rotate(-12 6 -19)" />
          <ellipse cx={12} cy={-19} rx={2.6} ry={9} transform="rotate(10 12 -19)" />
        </g>
      </g>
      {/* right page */}
      {end ? (
        <text x={380} y={30} textAnchor="middle" fontFamily="Georgia, serif" fontSize={110} fill="#3a3226" letterSpacing={10}>THE END</text>
      ) : (
        <g transform="translate(220 0)">{lines(0)}</g>
      )}
      <text x={-640} y={270} fontFamily="Georgia, serif" fontSize={54} fill="#6b604e">{end ? '' : page - 1}</text>
      <text x={640} y={270} textAnchor="end" fontFamily="Georgia, serif" fontSize={64} fontWeight={700} fill="#3a3226">{page}</text>
      {/* bookmark ribbon */}
      {!end && <path d="M150,-330 L150,250 L180,220 L210,250 L210,-330 Z" fill="#e2574c" />}
      {dust > 0 && (
        <g>
          <rect x={-790} y={-330} width={1580} height={650} fill="#9c9585" opacity={dust * 0.35} />
          {Array.from({length: 70}).map((_, i) => (
            <circle key={i} cx={-760 + ((i * 397) % 1520)} cy={-300 + ((i * 211) % 600)} r={2 + (i % 3)} fill="#d8d2c4" opacity={dust * 0.8} />
          ))}
        </g>
      )}
    </g>
  );
};

/* ---------------------------------------------------------------- shoebox */

/**
 * The PHONE BOX. Origin = bottom centre, 300 wide x 150 tall.
 * write: 0..1 progress of the red "8 PM" marker strokes. lid: 0 closed .. 1 open (lid tilted back).
 */
export const ShoeBox: React.FC<{x: number; y: number; s?: number; write?: number; lid?: number; buzz?: number; contents?: React.ReactNode; frame?: number}> = ({
  x, y, s = 1, write = 1, lid = 0, buzz = 0, contents, frame = 0,
}) => {
  const jitter = buzz > 0 ? Math.sin(frame * 2.7) * 3 * buzz : 0;
  const strokes = [
    // "8"
    'M70,-110 C40,-110 40,-80 70,-78 C100,-76 100,-44 70,-44 C40,-44 40,-76 70,-78 C100,-80 100,-110 70,-110',
    // "P"
    'M130,-44 L130,-110 C170,-112 172,-76 130,-78',
    // "M"
    'M190,-44 L190,-110 L215,-70 L240,-110 L240,-44',
  ];
  const lens = [260, 150, 220];
  const per = 1 / strokes.length;
  return (
    <g transform={`translate(${x + jitter} ${y}) scale(${s})`}>
      {buzz > 0 && (
        <g stroke="#bdefff" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(Math.sin(frame * 0.9))}>
          <path d="M-190,-120 q-12,20 0,40 M-215,-130 q-18,30 0,60 M190,-120 q12,20 0,40 M215,-130 q18,30 0,60" fill="none" />
        </g>
      )}
      {lid > 0 && <rect x={-146} y={-166} width={292} height={20} rx={4} fill="#6e5234" />}
      {contents && <g transform="translate(0 -150)">{contents}</g>}
      <rect x={-150} y={-150} width={300} height={150} rx={6} fill="#c9a77a" />
      <rect x={-150} y={-150} width={300} height={18} fill="#b08d62" />
      {/* lid */}
      <g transform={`translate(0 -150) rotate(${-lid * 70} -160 0)`}>
        <rect x={-160} y={-26} width={320} height={34} rx={6} fill="#d8b98c" />
        {buzz > 0 && lid === 0 && <rect x={-150} y={6} width={300} height={6} fill={COLD.screen} opacity={0.6 + 0.4 * Math.sin(frame * 1.3)} />}
      </g>
      {/* 8 PM, drawn stroke by stroke */}
      <g transform="translate(-150 0)" fill="none" stroke="#d6262b" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((d, i) => {
          const p = Math.max(0, Math.min(1, (write - i * per) / per));
          if (p <= 0) return null;
          return <path key={i} d={d} strokeDasharray={lens[i]} strokeDashoffset={lens[i] * (1 - p)} />;
        })}
      </g>
    </g>
  );
};
