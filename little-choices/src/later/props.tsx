import React from 'react';
import {interpolate} from 'remotion';
import {HAND} from '../fonts';
import {COLD, WARM} from '../theme';
import {useFrameWindow} from '../ui/frameCtx';
import {SW, SH} from '../props/Inserts';

export const SCARF_RED = '#d9553b';
export const NOTE_YELLOW = '#ffe066';

/* ------------------------------------------------------------------ sticky notes (world px) */

export const StickyNote: React.FC<{x: number; y: number; size?: number; rotate?: number; text?: [string, string] | null; shade?: number}> = ({
  x, y, size = 120, rotate = -3, text = ['CALL', 'MOM'], shade = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-size / 2 + size * 0.04} y={-size / 2 + size * 0.06} width={size} height={size} fill="#000" opacity={0.28} />
    <rect x={-size / 2} y={-size / 2} width={size} height={size} fill={NOTE_YELLOW} />
    <rect x={-size / 2} y={-size / 2} width={size} height={size * 0.16} fill="#e8c94a" opacity={0.55} />
    <path d={`M${size / 2},${size / 2 - size * 0.16} L${size / 2},${size / 2} L${size / 2 - size * 0.16},${size / 2} Z`} fill="#d9b93c" />
    {shade > 0 && <rect x={-size / 2} y={-size / 2} width={size} height={size} fill="#000" opacity={shade} />}
    {text && (
      <text x={0} y={size * 0.02} textAnchor="middle" fontFamily={HAND} fontSize={size * 0.3} fill="#26221a">
        <tspan x={0} dy={0}>{text[0]}</tspan>
        <tspan x={0} dy={size * 0.32}>{text[1]}</tspan>
      </text>
    )}
  </g>
);

/** A thick stack of the same note, top note readable. */
export const StickyStack: React.FC<{x: number; y: number; size?: number; count: number}> = ({x, y, size = 120, count}) => (
  <g>
    {Array.from({length: count}).map((_, i) => {
      const top = i === count - 1;
      const jx = Math.sin(i * 2.3) * size * 0.06;
      const jy = -i * size * 0.022;
      const rot = Math.sin(i * 1.7) * 7;
      return <StickyNote key={i} x={x + jx} y={y + jy} size={size} rotate={top ? -4 : rot} text={top ? ['CALL', 'MOM'] : null} shade={top ? 0 : 0.04 + 0.1 * (1 - i / count)} />;
    })}
  </g>
);

/* ------------------------------------------------------------------ wall calendar (world px) */

export type Month = {title: string; firstDow: number; days: number}; // firstDow: 0 = Monday
export const NOV_2026: Month = {title: 'NOVEMBER 2026', firstDow: 6, days: 30};
export const DEC_2026: Month = {title: 'DECEMBER 2026', firstDow: 1, days: 31};
export const JAN_2027: Month = {title: 'JANUARY 2027', firstDow: 4, days: 31};

export const WallCalendar: React.FC<{
  x: number; y: number; w: number; month: Month; today?: number; crossedThrough?: number;
  note?: number; stack?: {day: number; count: number}; dark?: number;
}> = ({x, y, w, month, today, crossedThrough = 0, note, stack, dark = 0}) => {
  const h = w * 1.12;
  const head = h * 0.15;
  const wk = h * 0.075;
  const cw = w / 7;
  const ch = (h - head - wk) / 6;
  const cell = (day: number) => {
    const idx = month.firstDow + day - 1;
    return {cx: (idx % 7) * cw + cw / 2, cy: head + wk + Math.floor(idx / 7) * ch + ch / 2};
  };
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={6} y={10} width={w} height={h} fill="#000" opacity={0.3} />
      <rect width={w} height={h} fill="#eef0f2" />
      <rect width={w} height={head} fill="#c9433a" />
      {/* ring binding */}
      {[0.2, 0.4, 0.6, 0.8].map((u) => (
        <rect key={u} x={w * u - 6} y={-14} width={12} height={28} rx={6} fill="#5a6372" />
      ))}
      <text x={w / 2} y={head * 0.66} textAnchor="middle" fontFamily={HAND} fontSize={head * 0.5} fill="#fff" letterSpacing={3}>{month.title}</text>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dname, i) => (
        <text key={i} x={i * cw + cw / 2} y={head + wk * 0.72} textAnchor="middle" fontFamily={HAND} fontSize={wk * 0.62} fill={i > 4 ? '#c9433a' : '#5a6372'}>{dname}</text>
      ))}
      {Array.from({length: 7}).map((_, i) => (
        <line key={`v${i}`} x1={i * cw} y1={head + wk} x2={i * cw} y2={h} stroke="#c9ced6" strokeWidth={1.5} />
      ))}
      {Array.from({length: 7}).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={head + wk + i * ch} x2={w} y2={head + wk + i * ch} stroke="#c9ced6" strokeWidth={1.5} />
      ))}
      {Array.from({length: month.days}).map((_, i) => {
        const day = i + 1;
        const {cx, cy} = cell(day);
        return (
          <g key={day}>
            <text x={cx - cw / 2 + cw * 0.1} y={cy - ch / 2 + ch * 0.32} fontFamily={HAND} fontSize={ch * 0.27} fill={today === day ? '#c9433a' : '#3d4553'}>{day}</text>
            {day <= crossedThrough && (
              <g stroke="#c9433a" strokeWidth={Math.max(2, cw * 0.035)} strokeLinecap="round" opacity={0.75}>
                <line x1={cx - cw * 0.28} y1={cy - ch * 0.2} x2={cx + cw * 0.28} y2={cy + ch * 0.32} />
                <line x1={cx + cw * 0.28} y1={cy - ch * 0.2} x2={cx - cw * 0.28} y2={cy + ch * 0.32} />
              </g>
            )}
            {today === day && <circle cx={cx} cy={cy + ch * 0.05} r={Math.min(cw, ch) * 0.46} fill="none" stroke="#c9433a" strokeWidth={Math.max(2, cw * 0.03)} />}
          </g>
        );
      })}
      {note !== undefined && (() => {
        const {cx, cy} = cell(note);
        return <StickyNote x={cx} y={cy + ch * 0.06} size={Math.min(cw, ch) * 0.95} rotate={-5} />;
      })()}
      {stack && (() => {
        const {cx, cy} = cell(stack.day);
        return <StickyStack x={cx} y={cy + ch * 0.1} size={Math.min(cw, ch) * 1.02} count={stack.count} />;
      })()}
      {dark > 0 && <rect width={w} height={h} fill="#0b1018" opacity={dark} />}
    </g>
  );
};

/* ------------------------------------------------------------------ LAST CALL hourglass (HUD, frame px) */

const daysText = (d: number) => (d <= 0 ? 'today' : `${d} ${d === 1 ? 'day' : 'days'}`);

export const HourglassMeter: React.FC<{
  x: number; y: number; days: number; drain?: number; flip?: number; warm?: number; opacity?: number; scale?: number;
}> = ({x, y, days, drain, flip = 0, warm = 0, opacity = 1, scale = 1}) => {
  const win = useFrameWindow();
  if (win) {
    scale = Math.max(0.6, 1 / win.s);
    x = win.x1 - win.safeRight - 110 * scale;
    y = 40;
  }
  // sand drains from the top as days pass (full at 0 days, almost empty at ~50)
  const d = drain ?? Math.min(0.94, days / 52);
  const cold = interpolate(days, [5, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (1 - warm);
  const glowColor = warm > 0.5 ? WARM.lamp : COLD.screen;
  const glowAmt = Math.max(cold, warm);
  const W = 110;
  const Hh = 150;
  const topLevel = (1 - d) * 58; // sand height in the top bulb
  const botLevel = d * 52;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 220, transform: `translate(-50%, 0) scale(${scale})`, transformOrigin: 'top center', opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
      <div style={{fontFamily: HAND, fontSize: 32, color: '#cfd6e2', letterSpacing: 3, whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)'}}>LAST CALL</div>
      <svg width={W + 60} height={Hh + 40} viewBox={`-30 -20 ${W + 60} ${Hh + 40}`} style={{overflow: 'visible'}}>
        <defs>
          <filter id="hgGlow" x="-80%" y="-50%" width="260%" height="200%">
            <feGaussianBlur stdDeviation={12} />
          </filter>
          <clipPath id="hgTop">
            <path d={`M10,8 L${W - 10},8 C${W - 10},48 ${W / 2 + 6},62 ${W / 2 + 3},74 L${W / 2 - 3},74 C${W / 2 - 6},62 10,48 10,8 Z`} />
          </clipPath>
          <clipPath id="hgBot">
            <path d={`M10,${Hh - 8} L${W - 10},${Hh - 8} C${W - 10},${Hh - 48} ${W / 2 + 6},${Hh - 62} ${W / 2 + 3},${Hh - 74} L${W / 2 - 3},${Hh - 74} C${W / 2 - 6},${Hh - 62} 10,${Hh - 48} 10,${Hh - 8} Z`} />
          </clipPath>
        </defs>
        <rect x={-6} y={-6} width={W + 12} height={Hh + 12} rx={20} fill={glowColor} opacity={0.5 * glowAmt} filter="url(#hgGlow)" />
        <rect x={-14} y={-14} width={W + 28} height={Hh + 28} rx={22} fill="rgba(10,12,16,0.8)" stroke="#5a6372" strokeWidth={3} />
        <g transform={`rotate(${flip * 180} ${W / 2} ${Hh / 2})`}>
          {/* sand */}
          <g clipPath="url(#hgTop)">
            <rect x={0} y={74 - topLevel} width={W} height={topLevel} fill={WARM.lamp} />
          </g>
          <g clipPath="url(#hgBot)">
            <path d={`M10,${Hh - 8} L${W - 10},${Hh - 8} L${W / 2 + 18},${Hh - 8 - botLevel} Q${W / 2},${Hh - 14 - botLevel * 1.12} ${W / 2 - 18},${Hh - 8 - botLevel} Z`} fill={WARM.lamp} opacity={0.85} />
          </g>
          {d > 0.02 && d < 0.98 && <line x1={W / 2} y1={74} x2={W / 2} y2={Hh - 10 - botLevel} stroke={WARM.lamp} strokeWidth={2.4} />}
          {/* glass + frame */}
          <path d={`M10,8 L${W - 10},8 C${W - 10},48 ${W / 2 + 6},62 ${W / 2 + 3},74 C${W / 2 + 6},86 ${W - 10},${Hh - 48} ${W - 10},${Hh - 8} L10,${Hh - 8} C10,${Hh - 48} ${W / 2 - 6},86 ${W / 2 - 3},74 C${W / 2 - 6},62 10,48 10,8 Z`} fill="none" stroke="#dfe6ef" strokeWidth={3} opacity={0.85} />
          <rect x={0} y={0} width={W} height={9} rx={4} fill="#8a6a4a" />
          <rect x={0} y={Hh - 9} width={W} height={9} rx={4} fill="#8a6a4a" />
        </g>
      </svg>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <svg width={30} height={30} viewBox="0 0 30 30">
          <path d="M8,3 C5,3 3,6 4,10 C6,17 12,24 20,26 C24,27 27,25 27,22 L23,18 L19,21 C15,19 11,15 9,11 L12,7 Z" fill="#cfd6e2" />
        </svg>
        <div style={{fontFamily: HAND, fontSize: 44, whiteSpace: 'nowrap', color: warm > 0.5 ? '#ffe3b8' : glowAmt > 0.5 ? '#bdefff' : '#ffffff', textShadow: `0 0 ${6 + 14 * glowAmt}px ${warm > 0.5 ? 'rgba(255,179,92,0.8)' : `rgba(95,211,255,${0.3 + 0.6 * glowAmt})`}, 0 0 4px rgba(0,0,0,0.9)`}}>
          {daysText(days)}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ knitting (figure units, at the hand) */

/** Two crossed needles holding a short knitted piece of `len` figure units. */
export const KnittingInHands: React.FC<{len?: number}> = ({len = 6}) => (
  <g>
    <rect x={-4.5} y={-1} width={9} height={len} rx={1} fill={SCARF_RED} />
    {Array.from({length: Math.max(1, Math.floor(len / 1.4))}).map((_, i) => (
      <line key={i} x1={-4.5} y1={i * 1.4 + 0.7} x2={4.5} y2={i * 1.4 + 0.7} stroke="#a83a28" strokeWidth={0.35} />
    ))}
    <line x1={-8} y1={-4} x2={7} y2={2} stroke="#e8e2d6" strokeWidth={0.8} strokeLinecap="round" />
    <line x1={-7} y1={2} x2={8} y2={-4} stroke="#e8e2d6" strokeWidth={0.8} strokeLinecap="round" />
  </g>
);

/** A long knitted scarf as a thick striped stroke along an SVG path (world px). */
export const ScarfPath: React.FC<{d: string; width?: number}> = ({d, width = 16}) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke="#000" strokeWidth={width + 4} opacity={0.25} transform="translate(3 5)" />
    <path d={d} stroke={SCARF_RED} strokeWidth={width} />
    <path d={d} stroke="#a83a28" strokeWidth={width} strokeDasharray={`${width * 0.35} ${width * 2.2}`} />
    <path d={d} stroke="#f08a6c" strokeWidth={width * 0.18} opacity={0.6} transform={`translate(0 ${-width * 0.22})`} />
  </g>
);

export const YarnBall: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 34}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={SCARF_RED} />
    {[-30, 10, 50, 95].map((a) => (
      <ellipse key={a} rx={r * 0.95} ry={r * 0.35} fill="none" stroke="#a83a28" strokeWidth={r * 0.08} transform={`rotate(${a})`} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ phone screens (400 x 820 box, for PhoneClose) */

const Btn: React.FC<{cx: number; cy: number; color: string; down?: boolean}> = ({cx, cy, color, down}) => (
  <g transform={`translate(${cx} ${cy})`}>
    <circle r={46} fill={color} />
    <path d="M-20,-4 C-10,-14 10,-14 20,-4 L16,6 L8,2 L8,-4 C2,-6 -2,-6 -8,-4 L-8,2 L-16,6 Z" fill="#fff" transform={down ? 'rotate(135)' : 'rotate(0)'} />
  </g>
);

export const IncomingCallScreen: React.FC<{name?: string}> = ({name = 'Mom'}) => (
  <g>
    <rect width={SW} height={SH} fill="#18232e" />
    <circle cx={SW / 2} cy={230} r={70} fill="#c98f55" />
    <text x={SW / 2} y={258} textAnchor="middle" fontFamily={HAND} fontSize={80} fill="#fff">{name[0]}</text>
    <text x={SW / 2} y={370} textAnchor="middle" fontFamily={HAND} fontSize={60} fill="#fff">{name}</text>
    <text x={SW / 2} y={415} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#9fb3c8">incoming call…</text>
    <Btn cx={110} cy={680} color="#e24c3c" down />
    <Btn cx={290} cy={680} color="#3fbf6a" />
  </g>
);

export const ChatScreen: React.FC<{show?: number}> = ({show = 2}) => (
  <g>
    <rect width={SW} height={SH} fill="#121b24" />
    <rect width={SW} height={120} fill="#1b2733" />
    <circle cx={60} cy={88} r={22} fill="#c98f55" />
    <text x={96} y={98} fontFamily={HAND} fontSize={34} fill="#fff">Mom</text>
    {show >= 1 && (
      <g>
        <rect x={60} y={520} width={310} height={84} rx={30} fill="#3c8dd6" />
        <text x={84} y={572} fontFamily={HAND} fontSize={32} fill="#fff">Busy. Call you later.</text>
      </g>
    )}
    {show >= 2 && (
      <g>
        <rect x={30} y={630} width={150} height={74} rx={28} fill="#2b3642" />
        <text x={56} y={677} fontFamily={HAND} fontSize={32} fill="#fff">Okay ♥</text>
      </g>
    )}
  </g>
);

export const VoicemailScreen: React.FC<{progress?: number}> = ({progress = 0.5}) => (
  <g>
    <rect width={SW} height={SH} fill="#10171f" />
    <text x={30} y={110} fontFamily={HAND} fontSize={46} fill="#fff">Voicemail</text>
    {[
      {name: 'Mom', when: '3 weeks ago', len: '0:09', dot: true, y: 170},
      {name: 'Unknown', when: '2 months ago', len: '0:21', dot: false, y: 290},
    ].map((r) => (
      <g key={r.y}>
        <rect x={20} y={r.y} width={SW - 40} height={100} rx={18} fill={r.dot ? '#1d2a36' : '#151d26'} />
        {r.dot && <circle cx={48} cy={r.y + 50} r={9} fill="#3c8dd6" />}
        <text x={70} y={r.y + 46} fontFamily={HAND} fontSize={36} fill="#fff">{r.name}</text>
        <text x={70} y={r.y + 80} fontFamily={HAND} fontSize={26} fill="#8a99ab">{r.when}</text>
        <text x={SW - 40} y={r.y + 60} textAnchor="end" fontFamily={HAND} fontSize={28} fill="#8a99ab">{r.len}</text>
      </g>
    ))}
    {/* playing panel */}
    <rect x={20} y={470} width={SW - 40} height={260} rx={24} fill="#1d2a36" />
    <circle cx={70} cy={560} r={30} fill="#3c8dd6" />
    <rect x={60} y={545} width={7} height={30} rx={2} fill="#fff" />
    <rect x={74} y={545} width={7} height={30} rx={2} fill="#fff" />
    {Array.from({length: 26}).map((_, i) => {
      const h = 12 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) * 48;
      const played = i / 26 < progress;
      return <rect key={i} x={118 + i * 9.6} y={560 - h / 2} width={6} height={h} rx={3} fill={played ? '#5fd3ff' : '#4a5868'} />;
    })}
    <text x={40} y={680} fontFamily={HAND} fontSize={28} fill="#8a99ab">Mom · 0:09</text>
  </g>
);

export const ReminderScreen: React.FC = () => (
  <g>
    <rect width={SW} height={SH} fill="#121b24" />
    <text x={SW / 2} y={140} textAnchor="middle" fontFamily={HAND} fontSize={36} fill="#9fb3c8">New reminder</text>
    <text x={SW / 2} y={300} textAnchor="middle" fontFamily={HAND} fontSize={64} fill="#fff">SUNDAY</text>
    <text x={SW / 2} y={390} textAnchor="middle" fontFamily={HAND} fontSize={96} fill="#ffb35c">7 PM</text>
    <rect x={40} y={460} width={SW - 80} height={90} rx={20} fill="#1d2a36" />
    <text x={70} y={518} fontFamily={HAND} fontSize={40} fill="#fff">Call Mom ♥</text>
    <rect x={40} y={575} width={SW - 80} height={90} rx={20} fill="#1d2a36" />
    <text x={70} y={633} fontFamily={HAND} fontSize={32} fill="#cfd6e2">Repeat: every week</text>
    <rect x={SW - 130} y={603} width={64} height={34} rx={17} fill="#3fbf6a" />
    <circle cx={SW - 83} cy={620} r={14} fill="#fff" />
  </g>
);

export const CallTimerScreen: React.FC<{time: string}> = ({time}) => (
  <g>
    <rect width={SW} height={SH} fill="#1b2a24" />
    <circle cx={SW / 2} cy={230} r={70} fill="#c98f55" />
    <text x={SW / 2} y={258} textAnchor="middle" fontFamily={HAND} fontSize={80} fill="#fff">M</text>
    <text x={SW / 2} y={370} textAnchor="middle" fontFamily={HAND} fontSize={56} fill="#fff">Mom ♥</text>
    <text x={SW / 2} y={430} textAnchor="middle" fontFamily={HAND} fontSize={48} fill="#7fe0a4">{time}</text>
    <Btn cx={SW / 2} cy={690} color="#e24c3c" down />
  </g>
);

/** Phone held at the ear (put it in the BACK hand with POSES.phoneEar / sitPhoneEar): it peeks out behind the head. */
export const EarPhone: React.FC<{glow?: number}> = ({glow = 0.6}) => (
  <g transform="translate(-5 1) rotate(-28)">
    <rect x={-3.2} y={-5.6} width={6.4} height={11.2} rx={1.3} fill="#11151b" />
    <rect x={-2.6} y={-4.9} width={5.2} height={9.6} rx={0.8} fill={COLD.screen} opacity={0.3 + 0.7 * glow} />
  </g>
);

/* ------------------------------------------------------------------ small things */

export const Snowfall: React.FC<{w: number; h: number; f: number; n?: number; color?: string; seed?: number; size?: number}> = ({w, h, f, n = 90, color = '#ffffff', seed = 1, size = 1}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const k = i * 7.13 + seed * 3.1;
      const sp = 0.6 + ((i * 37) % 10) / 10;
      const x0 = ((i * 211.7 + seed * 97) % w);
      const y = ((k * 53 + f * 1.6 * sp) % (h + 40)) - 20;
      const x = x0 + Math.sin((f + i * 13) * 0.03) * 14;
      const r = (1.6 + ((i * 13) % 5) * 0.6) * size;
      return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={0.55 + ((i * 7) % 4) * 0.1} />;
    })}
  </g>
);

