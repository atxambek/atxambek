import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure} from './characters/StickFigure';
import {HandBook, HandPhone, OpenBook} from './props/Props';
import {Bed, Blanket} from './sets/Bedroom';
import {Sofa} from './sets/LivingRoom';
import {SERIF} from './fonts';
import {COLD, INK, WARM} from './theme';
import {LightPool} from './ui/UI';

/**
 * Channel branding for "Little Choices".
 * The mark is the series' silhouette head; its rim light is half screen-cyan, half lamp-amber:
 * every film is about one small choice between the two.
 */
export const CHANNEL_NAME = 'LITTLE CHOICES';
export const CHANNEL_TAGLINE = 'Short films about the small choices that shape a life.';

/** The mark, drawn in a 800 x 800 box. `bg` false = transparent (watermark). */
const Mark: React.FC<{bg?: boolean; id: string}> = ({bg = true, id}) => {
  const cx = 400;
  const cy = 395;
  const R = 225;
  const eyeR = 30;
  const gap = 74;
  const browY = cy - 100;
  const browLen = 82;
  const silhouette = (
    <g>
      <circle cx={cx} cy={cy} r={R} />
      <rect x={cx - 190} y={cy + R * 0.72} width={380} height={400} rx={170} />
    </g>
  );
  return (
    <svg width={800} height={800} viewBox="0 0 800 800">
      <defs>
        <radialGradient id={`bg${id}`} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#202838" />
          <stop offset="1" stopColor="#0b0e14" />
        </radialGradient>
        <filter id={`rim${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology operator="dilate" radius={10} />
          <feGaussianBlur stdDeviation={18} />
        </filter>
        {/* soft hand-over from cyan (left) to amber (right) instead of a hard split */}
        <linearGradient id={`gl${id}`} x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.4" stopColor="#fff" />
          <stop offset="0.6" stopColor="#000" />
        </linearGradient>
        <linearGradient id={`gr${id}`} x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.4" stopColor="#000" />
          <stop offset="0.6" stopColor="#fff" />
        </linearGradient>
        <mask id={`left${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={800}>
          <rect width={800} height={800} fill={`url(#gl${id})`} />
        </mask>
        <mask id={`right${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={800}>
          <rect width={800} height={800} fill={`url(#gr${id})`} />
        </mask>
        <linearGradient id={`seam${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.35" stopColor={COLD.screen} />
          <stop offset="0.65" stopColor={WARM.lamp} />
        </linearGradient>
      </defs>
      {bg && <rect width={800} height={800} fill={`url(#bg${id})`} />}
      {bg && (
        <>
          <LightPool id={`lc${id}`} x={210} y={380} rx={330} ry={360} color={COLD.screen} opacity={0.3} />
          <LightPool id={`la${id}`} x={590} y={380} rx={330} ry={360} color={WARM.lamp} opacity={0.34} />
        </>
      )}
      {/* split rim light: cyan on the left, amber on the right */}
      <g mask={`url(#left${id})`} fill={COLD.screen} filter={`url(#rim${id})`} opacity={0.95}>
        {silhouette}
      </g>
      <g mask={`url(#right${id})`} fill={WARM.lamp} filter={`url(#rim${id})`} opacity={0.95}>
        {silhouette}
      </g>
      <g fill={INK}>{silhouette}</g>
      {/* face: two dot eyes, two short brows */}
      <circle cx={cx - gap} cy={cy} r={eyeR} fill="#fff" />
      <circle cx={cx + gap} cy={cy} r={eyeR} fill="#fff" />
      <line x1={cx - gap - browLen / 2} y1={browY} x2={cx - gap + browLen / 2} y2={browY} stroke="#fff" strokeWidth={21} strokeLinecap="round" transform={`rotate(-7 ${cx - gap} ${browY})`} />
      <line x1={cx + gap - browLen / 2} y1={browY} x2={cx + gap + browLen / 2} y2={browY} stroke="#fff" strokeWidth={21} strokeLinecap="round" transform={`rotate(7 ${cx + gap} ${browY})`} />
    </svg>
  );
};

export const ChannelLogo: React.FC = () => (
  <AbsoluteFill style={{background: '#0b0e14'}}>
    <Mark id="logo" />
  </AbsoluteFill>
);

/** 150 x 150 transparent watermark for YouTube's video branding. */
export const ChannelWatermark: React.FC = () => (
  <AbsoluteFill style={{background: 'transparent'}}>
    <div style={{width: 800, height: 800, transformOrigin: '0 0', transform: 'scale(0.1875)'}}>
      <Mark bg={false} id="wm" />
    </div>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ banner 2048 x 1152 */
const BW = 2048;
const BH = 1152;
// YouTube's safe area for text/logos: 1235 x 338 in the middle; desktop shows the full width of that band.
const SAFE = {x: (BW - 1235) / 2, y: (BH - 338) / 2, w: 1235, h: 338};

export const ChannelBanner: React.FC = () => {
  const stars = Array.from({length: 70}).map((_, i) => [(i * 733) % BW, 20 + ((i * 397) % 360), i % 5 === 0 ? 2.6 : 1.5] as const);
  return (
    <AbsoluteFill style={{background: '#101520'}}>
      <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`}>
        <defs>
          <linearGradient id="bnBg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#111a27" />
            <stop offset="0.34" stopColor="#192130" />
            <stop offset="0.5" stopColor="#17171c" />
            <stop offset="0.66" stopColor="#2b2018" />
            <stop offset="1" stopColor="#4a3220" />
          </linearGradient>
          <linearGradient id="bnFloor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0c1118" />
            <stop offset="0.5" stopColor="#0e0e11" />
            <stop offset="1" stopColor="#21170f" />
          </linearGradient>
          <linearGradient id="bnRule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={COLD.screen} />
            <stop offset="1" stopColor={WARM.lamp} />
          </linearGradient>
          <linearGradient id="bnShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity={0.55} />
            <stop offset="0.3" stopColor="#000" stopOpacity={0} />
            <stop offset="0.7" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <rect width={BW} height={BH} fill="url(#bnBg)" />
        {stars.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#e6edf7" opacity={0.25 + (i % 4) * 0.12} />
        ))}
        <LightPool id="bnCyan" x={300} y={600} rx={520} ry={420} color={COLD.screen} opacity={0.32} />
        <LightPool id="bnAmber" x={1760} y={600} rx={560} ry={440} color={WARM.lamp} opacity={0.42} />
        <rect y={738} width={BW} height={BH - 738} fill="url(#bnFloor)" />

        {/* left: he scrolls, she waits */}
        <g transform={`translate(${40 - 510 * 0.55} ${735 - 772 * 0.55}) scale(0.55)`}>
          <Sofa />
          <LightPool id="bnPhone" x={880} y={520} rx={300} ry={230} color={COLD.screen} opacity={0.4} />
          <StickFigure x={800} y={680} scale={3.8} pose={POSES.sitPhone} eyes="half" brows={-4} look={[6, 3]} glow="cyan" itemF={<HandPhone angle={-40} />} />
          <StickFigure x={1150} y={716} scale={4.4} facing={-1} kid pose={{...POSES.stand, armF: [35, 50], headTilt: 20}} eyes="sad" brows={14} look={[5, 3]} glow="rim"
            itemF={<HandBook angle={0} size={1.45} />} />
        </g>

        {/* right: story time */}
        <g transform={`translate(${1585 - 560 * 0.45} ${735 - 860 * 0.45}) scale(0.45)`}>
          <Bed />
          <StickFigure x={700} y={700} scale={4.2} pose={POSES.sitRead} eyes="happy" brows={4} look={[6, 2]} glow="amber" glowStrength={0.9} itemF={<OpenBook angle={-25} size={1.6} />} />
          <StickFigure x={790} y={706} scale={4.2} kid pose={{...POSES.cuddle, armF: [70, 40]}} eyes="happy" brows={4} look={[5, 1]} glow="amber" glowStrength={0.9} />
          <Blanket />
        </g>

        <rect width={BW} height={BH} fill="url(#bnShade)" />
        {/* thin rule under the name: cyan to amber */}
        <rect x={BW / 2 - 90} y={612} width={180} height={4} rx={2} fill="url(#bnRule)" />
      </svg>
      <div style={{position: 'absolute', left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 92, letterSpacing: 15, paddingLeft: 15, color: '#f3ead8', textShadow: '0 3px 18px rgba(0,0,0,0.85)', marginTop: -24}}>{CHANNEL_NAME}</div>
        <div style={{height: 46}} />
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: '#e9c792', textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>{CHANNEL_TAGLINE}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ preview: how it looks on YouTube */
const Window: React.FC<{w: number; crop: {x: number; y: number; w: number; h: number}; children: React.ReactNode; label: string}> = ({w, crop, children, label}) => {
  const s = w / crop.w;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      <div style={{fontFamily: 'sans-serif', fontSize: 22, color: '#aab3c2'}}>{label}</div>
      <div style={{position: 'relative', width: w, height: crop.h * s, overflow: 'hidden', borderRadius: 12, boxShadow: '0 0 0 1px #333'}}>
        <div style={{position: 'absolute', left: -crop.x * s, top: -crop.y * s, width: BW, height: BH, transformOrigin: '0 0', transform: `scale(${s})`}}>{children}</div>
      </div>
    </div>
  );
};

const Avatar: React.FC<{d: number}> = ({d}) => (
  <div style={{width: d, height: d, borderRadius: '50%', overflow: 'hidden', flex: 'none'}}>
    <div style={{width: 800, height: 800, transformOrigin: '0 0', transform: `scale(${d / 800})`}}>
      <ChannelLogo />
    </div>
  </div>
);

export const ChannelPreview: React.FC = () => (
  <AbsoluteFill style={{background: '#0f0f0f', padding: 50, display: 'flex', flexDirection: 'column', gap: 34}}>
    <Window w={1500} crop={{x: 0, y: SAFE.y, w: BW, h: 338}} label="Desktop (full width, 338 px band)">
      <div style={{position: 'relative', width: BW, height: BH}}>
        <ChannelBanner />
      </div>
    </Window>
    <div style={{display: 'flex', gap: 60, alignItems: 'flex-start'}}>
      <Window w={760} crop={{x: (BW - 1546) / 2, y: (BH - 423) / 2, w: 1546, h: 423}} label="Phone (1546 x 423 centre)">
        <div style={{position: 'relative', width: BW, height: BH}}>
          <ChannelBanner />
        </div>
      </Window>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{fontFamily: 'sans-serif', fontSize: 22, color: '#aab3c2'}}>Channel page + comments</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <Avatar d={160} />
          <div>
            <div style={{fontFamily: 'sans-serif', fontWeight: 700, fontSize: 40, color: '#f1f1f1'}}>Little Choices</div>
            <div style={{fontFamily: 'sans-serif', fontSize: 22, color: '#aaaaaa', marginTop: 6}}>@littlechoices · short films</div>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Avatar d={98} />
          <Avatar d={48} />
          <Avatar d={24} />
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
