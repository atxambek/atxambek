import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {POSES, StickFigure} from './characters/StickFigure';
import {FamilyDrawing} from './props/FamilyDrawing';
import {HandBook, HandPhone, Mug, OpenBook} from './props/Props';
import {Bed, BedroomBack, Blanket} from './sets/Bedroom';
import {Fridge, KitchenBack} from './sets/Kitchen';
import {LivingRoomBack, Rug, Sofa} from './sets/LivingRoom';
import {SERIF} from './fonts';
import {COLD, WARM} from './theme';
import {Layer, LightPool, Vignette} from './ui/UI';

/**
 * Thumbnails / covers. Each landscape design is drawn in the 1920x1080 world and scaled to 1280x720
 * (YouTube's recommended size). Text is huge and short so it still reads at feed size (~170 px wide).
 */
const DISPLAY = 'Anton';
loadFont({family: DISPLAY, url: staticFile('fonts/Anton.woff2'), weight: '400'});

export const ORANGE = '#ffa24d';

export const Scaled: React.FC<{w: number; children: React.ReactNode}> = ({w, children}) => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${w / 1920})`}}>{children}</div>
  </AbsoluteFill>
);

export const Punch: React.FC<{lines: React.ReactNode[]; x: number; y: number; size: number; align?: 'left' | 'right' | 'center'; rotate?: number; width?: number}> = ({
  lines, x, y, size, align = 'left', rotate = -2, width,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      transform: `rotate(${rotate}deg)`,
      transformOrigin: align === 'right' ? 'right top' : 'left top',
      fontFamily: DISPLAY,
      fontSize: size,
      lineHeight: 0.98,
      color: '#ffffff',
      textAlign: align,
      textTransform: 'uppercase',
      letterSpacing: 2,
      WebkitTextStroke: `${Math.round(size * 0.06)}px #07080b`,
      paintOrder: 'stroke fill',
      textShadow: `0 ${Math.round(size * 0.05)}px 0 rgba(0,0,0,0.55), 0 0 ${Math.round(size * 0.25)}px rgba(0,0,0,0.6)`,
    }}
  >
    {lines.map((l, i) => (
      <div key={i}>{l}</div>
    ))}
  </div>
);

export const Wordmark: React.FC<{x: number; y: number; size?: number; text?: string}> = ({x, y, size = 58, text = 'SCROLL'}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: SERIF, fontWeight: 600, fontSize: size, letterSpacing: size * 0.32, color: '#f3ead8', textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
    {text}
  </div>
);

/** Red crayon ring, drawn in the drawing's own coordinates (paper 480 x 600). */
const CrayonRing: React.FC<{cx: number; cy: number; rx: number; ry: number}> = ({cx, cy, rx, ry}) => (
  <g>
    <defs>
      <filter id="ringCrayon" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <path
      d={`M${cx + rx * 0.2},${cy - ry} C${cx + rx * 1.15},${cy - ry * 1.02} ${cx + rx * 1.1},${cy + ry * 1.05} ${cx},${cy + ry} C${cx - rx * 1.15},${cy + ry * 0.98} ${cx - rx * 1.12},${cy - ry * 1.05} ${cx - rx * 0.1},${cy - ry * 1.08} L${cx + rx * 0.45},${cy - ry * 0.98}`}
      stroke="#e3262b"
      strokeWidth={11}
      strokeLinecap="round"
      fill="none"
      filter="url(#ringCrayon)"
    />
  </g>
);

/* ------------------------------------------------------------------ A: the drawing */
const DrawingWorld: React.FC = () => {
  // fridge with the drawing big on the left; Dad, shocked, on the right
  const fx = 20;
  const fy = -120;
  const fw = 840;
  const ds = 1.5;
  const dx = fx + fw / 2 - 240 * ds; // matches Fridge's own placement of the drawing
  const dy = fy + 170;
  return (
    <>
      <Layer blur={9}>
        <KitchenBack mood="cold" />
        <rect width={1920} height={1080} fill="#0d121a" opacity={0.35} />
      </Layer>
      <Layer>
        <Fridge x={fx} y={fy} w={fw} h={1400} mood="cold" drawing="phone" drawingScale={ds} drawY={170} />
        <g transform={`translate(${dx} ${dy}) rotate(-2) scale(${ds})`}>
          <CrayonRing cx={150} cy={257} rx={92} ry={110} />
        </g>
        <LightPool id="thAglow" x={dx + 150 * ds} y={dy + 257 * ds} rx={300} ry={300} color={COLD.screen} opacity={0.35} />
      </Layer>
      <Layer>
        <LightPool id="thAdad" x={1560} y={820} rx={420} ry={420} color={COLD.screen} opacity={0.22} />
        <StickFigure x={1575} y={1575} scale={13.5} facing={-1} pose={{...POSES.holdMug, headTilt: -6}} eyes="wide" mouth="o" brows={12} browLift={1} look={[5, -1]} glow="cyan" glowStrength={0.9}
          itemF={<Mug />} />
      </Layer>
    </>
  );
};

export const ThumbDrawing: React.FC = () => (
  <Scaled w={1280}>
    <DrawingWorld />
    <Vignette strength={0.45} />
    <Punch lines={['She drew', <span key="t" style={{color: ORANGE}}>this…</span>]} x={1060} y={40} size={215} align="left" />
    <Wordmark x={46} y={985} />
  </Scaled>
);

/* ------------------------------------------------------------------ B: five more minutes */
export const ThumbFiveMinutes: React.FC = () => (
  <Scaled w={1280}>
    <AbsoluteFill style={{transformOrigin: '760px 600px', transform: 'scale(1.32)'}}>
      <Layer>
        <LivingRoomBack clockMinutes={22 * 60 + 33} />
        <Rug />
        <Sofa />
        <LightPool id="thBphone" x={880} y={500} rx={360} ry={280} color={COLD.screen} opacity={0.45} />
        <StickFigure x={800} y={680} scale={3.8} pose={POSES.sitPhone} eyes="half" brows={-4} look={[6, 3]} glow="cyan" glowStrength={1}
          itemF={<HandPhone glow={1} angle={-40} />} />
      </Layer>
    </AbsoluteFill>
    <Layer>
      <rect width={1920} height={1080} fill="#0a0f18" opacity={0.18} />
      <StickFigure x={1470} y={1160} scale={7.6} facing={-1} kid pose={{...POSES.bookUp, headTilt: -14}} eyes="sad" brows={16} look={[4, -4]} glow="rim" glowStrength={1}
        itemF={<HandBook angle={-8} size={1.5} />} />
    </Layer>
    <Vignette strength={0.45} />
    <Punch lines={[<span key="5"><span style={{color: ORANGE}}>5</span> more</span>, 'minutes…']} x={1030} y={36} size={205} align="left" />
    <Wordmark x={46} y={985} />
  </Scaled>
);

/* ------------------------------------------------------------------ C: look up (before / after) */
export const ThumbLookUp: React.FC = () => (
  <Scaled w={1280}>
    {/* before: cold, he scrolls, she waits */}
    <AbsoluteFill style={{clipPath: 'polygon(0 0, 54% 0, 44% 100%, 0 100%)'}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: 'translate(-380px, -40px) scale(1.08)'}}>
        <Layer>
          <LivingRoomBack clockMinutes={22 * 60 + 33} />
          <Rug cx={1150} />
          <Sofa />
          <LightPool id="thCphone" x={880} y={520} rx={330} ry={250} color={COLD.screen} opacity={0.42} />
          <StickFigure x={800} y={680} scale={3.8} pose={POSES.sitPhone} eyes="half" brows={-4} look={[6, 3]} glow="cyan" itemF={<HandPhone angle={-40} />} />
          <StickFigure x={1080} y={858} scale={4.6} facing={-1} kid pose={{...POSES.stand, armF: [35, 50], headTilt: 22}} eyes="sad" brows={14} look={[5, 3]} glow="rim"
            itemF={<HandBook angle={0} size={1.45} />} />
        </Layer>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,18,30,0.15), rgba(10,18,30,0))'}} />
    </AbsoluteFill>
    {/* after: warm, reading together */}
    <AbsoluteFill style={{clipPath: 'polygon(54% 0, 100% 0, 100% 100%, 44% 100%)'}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: 'translate(560px, -130px) scale(1.22)'}}>
        <Layer>
          <BedroomBack season="spring" />
          <LightPool id="thClamp" x={454} y={500} rx={760} ry={560} color={WARM.lamp} opacity={0.5} />
          <Bed />
          <StickFigure x={700} y={700} scale={4.2} pose={POSES.sitRead} eyes="happy" brows={4} look={[6, 2]} glow="amber" glowStrength={0.9}
            itemF={<OpenBook angle={-25} size={1.6} />} />
          <StickFigure x={790} y={700} scale={4.2} kid pose={{armF: [165, 10], armB: [155, 15], legF: [90, 0], legB: [88, 0], lean: 4, headTilt: -8}} eyes="happy" brows={4} look={[5, 1]} glow="amber" glowStrength={0.9} />
          <Blanket />
        </Layer>
      </AbsoluteFill>
    </AbsoluteFill>
    {/* the seam */}
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="seam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLD.screen} />
          <stop offset="1" stopColor={WARM.lamp} />
        </linearGradient>
        <filter id="seamGlow" x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      <line x1={1037} y1={0} x2={845} y2={1080} stroke="url(#seam)" strokeWidth={26} filter="url(#seamGlow)" opacity={0.8} />
      <line x1={1037} y1={0} x2={845} y2={1080} stroke="#ffffff" strokeWidth={6} opacity={0.9} />
    </svg>
    <Vignette strength={0.4} />
    <Punch lines={['Look up.']} x={0} y={30} size={230} align="center" rotate={0} width={1920} />
    <Wordmark x={46} y={985} />
  </Scaled>
);

/* ------------------------------------------------------------------ vertical cover (Shorts / Reels / TikTok) */
export const CoverVertical: React.FC = () => {
  const ds = 1.2;
  const px = (1080 - 480 * ds) / 2 - 40;
  const py = 650;
  return (
    <AbsoluteFill style={{background: '#11161e', overflow: 'hidden'}}>
      {/* kitchen, blurred, behind */}
      <AbsoluteFill style={{filter: 'blur(10px)', transformOrigin: '0 0', transform: 'translate(-700px, 0px) scale(1.78)'}}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <KitchenBack mood="cold" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(10,14,22,0.35)'}} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={70} y={610} width={880} height={1400} rx={40} fill="#5a6372" opacity={0.55} />
        <g transform={`translate(${px} ${py}) rotate(-3) scale(${ds})`}>
          <FamilyDrawing version="phone" id="cov" />
          <CrayonRing cx={150} cy={257} rx={92} ry={110} />
        </g>
        <LightPool id="covGlow" x={px + 150 * ds} y={py + 257 * ds} rx={260} ry={260} color={COLD.screen} opacity={0.35} />
        <LightPool id="covDad" x={800} y={1480} rx={320} ry={320} color={COLD.screen} opacity={0.2} />
        <StickFigure x={800} y={2063} scale={10.5} facing={-1} pose={{...POSES.holdMug, headTilt: -6}} eyes="wide" mouth="o" brows={12} browLift={1} look={[5, -1]} glow="cyan" glowStrength={0.9}
          itemF={<Mug />} />
      </svg>
      <Vignette strength={0.45} />
      <Punch lines={['She drew', <span key="t" style={{color: ORANGE}}>this…</span>]} x={150} y={262} size={175} align="left" />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ vertical cover, "LOOK UP." (before / after) */
export const CoverVerticalLookUp: React.FC = () => (
  <AbsoluteFill style={{background: '#262b34', overflow: 'hidden'}}>
    {/* before (top): cold, he scrolls, she waits */}
    <AbsoluteFill style={{clipPath: 'polygon(0 0, 100% 0, 100% 54%, 0 60%)'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <g transform="translate(-230 120)">
          <LivingRoomBack clockMinutes={22 * 60 + 33} />
          <Rug cx={1150} />
          <Sofa />
          <LightPool id="cvlPhone" x={880} y={520} rx={330} ry={260} color={COLD.screen} opacity={0.45} />
          <StickFigure x={800} y={680} scale={3.8} pose={POSES.sitPhone} eyes="half" brows={-4} look={[6, 3]} glow="cyan" itemF={<HandPhone angle={-40} />} />
          <StickFigure x={1150} y={846} scale={4.4} facing={-1} kid pose={{...POSES.stand, armF: [35, 50], headTilt: 20}} eyes="sad" brows={14} look={[5, 3]} glow="rim"
            itemF={<HandBook angle={0} size={1.45} />} />
        </g>
      </svg>
    </AbsoluteFill>
    {/* after (bottom): warm, story time */}
    <AbsoluteFill style={{clipPath: 'polygon(0 60%, 100% 54%, 100% 100%, 0 100%)'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <g transform="translate(-391 675) scale(1.25)">
          <BedroomBack season="spring" />
          <LightPool id="cvlLamp" x={454} y={500} rx={760} ry={560} color={WARM.lamp} opacity={0.5} />
          <Bed />
          <StickFigure x={700} y={700} scale={4.2} pose={POSES.sitRead} eyes="happy" brows={4} look={[6, 2]} glow="amber" glowStrength={0.9} itemF={<OpenBook angle={-25} size={1.6} />} />
          <StickFigure x={790} y={700} scale={4.2} kid pose={{armF: [165, 10], armB: [155, 15], legF: [90, 0], legB: [88, 0], lean: 4, headTilt: -8}} eyes="happy" brows={4} look={[5, 1]} glow="amber" glowStrength={0.9} />
          <Blanket />
        </g>
      </svg>
    </AbsoluteFill>
    {/* the seam */}
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="cvlSeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COLD.screen} />
          <stop offset="1" stopColor={WARM.lamp} />
        </linearGradient>
        <filter id="cvlGlow" x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      <line x1={0} y1={1152} x2={1080} y2={1037} stroke="url(#cvlSeam)" strokeWidth={26} filter="url(#cvlGlow)" opacity={0.8} />
      <line x1={0} y1={1152} x2={1080} y2={1037} stroke="#ffffff" strokeWidth={6} opacity={0.9} />
    </svg>
    <Vignette strength={0.4} />
    <Punch lines={['Look up.']} x={0} y={285} size={175} align="center" rotate={0} width={1080} />
  </AbsoluteFill>
);
