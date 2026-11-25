import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure} from '../characters/StickFigure';
import {PhoneClose} from '../props/Inserts';
import {HandPhone} from '../props/Props';
import {COLD, WARM} from '../theme';
import {Layer, LightPool, Vignette} from '../ui/UI';
import {ORANGE, Punch, Scaled, Wordmark} from '../thumbnails';
import {MOM, SAM, SAM_OUT} from './cast';
import {DEC_2026, EarPhone, KnittingInHands, Snowfall, VoicemailScreen, WallCalendar} from './props';
import {MomRoom, SnowStreet} from './sets';
import {SamBedroom} from './sets2';

/** LATER thumbnails (1280x720 from the 1920x1080 world) and the vertical cover. */

const RedRing: React.FC<{cx: number; cy: number; rx: number; ry: number; id: string}> = ({cx, cy, rx, ry, id}) => (
  <g>
    <defs>
      <filter id={id} x="-10%" y="-20%" width="120%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={5} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <path d={`M${cx + rx * 0.2},${cy - ry} C${cx + rx * 1.12},${cy - ry * 1.05} ${cx + rx * 1.1},${cy + ry * 1.05} ${cx},${cy + ry} C${cx - rx * 1.12},${cy + ry * 0.98} ${cx - rx * 1.1},${cy - ry * 1.1} ${cx - rx * 0.1},${cy - ry * 1.1} L${cx + rx * 0.45},${cy - ry * 0.98}`}
      stroke="#e3262b" strokeWidth={10} strokeLinecap="round" fill="none" filter={`url(#${id})`} />
  </g>
);

/* A — the voicemail: "SHE LEFT THIS…" */
export const LaterThumbVoicemail: React.FC = () => (
  <Scaled w={1280}>
    <Layer blur={10}>
      <SamBedroom f={40} />
      <LightPool id="ltaGlow" x={620} y={540} rx={700} ry={520} color={COLD.screen} opacity={0.3} />
    </Layer>
    <Layer>
      <PhoneClose cx={600} cy={560} s={1.12} rotate={-6} clock={<text x={30} y={42}>01:12</text>}>
        <VoicemailScreen progress={0} playing={false} />
        <RedRing cx={200} cy={220} rx={200} ry={64} id="ltaRing" />
      </PhoneClose>
    </Layer>
    <Vignette strength={0.45} />
    <Punch lines={['She left', <span key="t" style={{color: ORANGE}}>this…</span>]} x={1080} y={60} size={215} align="left" />
    <Wordmark x={46} y={985} text="LATER" />
  </Scaled>
);

const BottomShade: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(5,8,14,0.85) 0%, rgba(5,8,14,0.0) 24%)'}} />
);

/* B — the stack: "47 DAYS." Sam walks past it on his phone, against the snowy window */
export const LaterThumbStack: React.FC = () => (
  <Scaled w={1280}>
    <Layer>
      <rect width={1920} height={1080} fill="#20252e" />
      <rect x={1010} y={60} width={860} height={1020} fill="#101824" />
    </Layer>
    <Layer blur={8}>
      <rect x={1020} y={70} width={840} height={1010} fill="#1a2535" />
      <g transform="translate(1020 70)">
        <Snowfall w={840} h={1010} f={40} n={110} seed={7} size={1.8} />
      </g>
      <rect x={1020} y={780} width={840} height={300} fill="#dfe7f0" opacity={0.9} />
    </Layer>
    <Layer>
      <WallCalendar x={40} y={150} w={820} month={DEC_2026} today={16} crossedThrough={15} stack={{day: 16, count: 34}} />
      <LightPool id="ltbPhone" x={1560} y={650} rx={260} ry={220} color={COLD.screen} opacity={0.35} />
      <StickFigure x={1430} y={770} scale={5.2} {...SAM} pose={POSES.holdPhone} eyes="half" brows={-2} look={[6, 3]} glow="cyan" glowStrength={0.8}
        itemF={<HandPhone glow={1} angle={-30} />} />
    </Layer>
    <Vignette strength={0.45} />
    <BottomShade />
    <Punch lines={[<span key="d"><span style={{color: ORANGE}}>47</span> days</span>]} x={960} y={70} size={230} align="left" />
    <Wordmark x={46} y={985} text="LATER" />
  </Scaled>
);

/* C — the call, split screen: "CALL HER." */
const SplitCall: React.FC<{vertical?: boolean}> = ({vertical = false}) => (
  <>
    <AbsoluteFill style={{clipPath: vertical ? 'polygon(0 0, 100% 0, 100% 54%, 0 60%)' : 'polygon(0 0, 54% 0, 44% 100%, 0 100%)'}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: vertical ? 'translate(-240px, 120px) scale(1.0)' : 'translate(-420px, -30px) scale(1.08)'}}>
        <Layer>
          <SnowStreet f={60} warmSpill={0} />
          <StickFigure x={960} y={700} scale={4.0} {...SAM_OUT} pose={POSES.phoneEar} eyes="open" brows={10} look={[5, 0]} glow="rim" glowStrength={0.9} itemB={<EarPhone />} />
        </Layer>
      </AbsoluteFill>
    </AbsoluteFill>
    <AbsoluteFill style={{clipPath: vertical ? 'polygon(0 60%, 100% 54%, 100% 100%, 0 100%)' : 'polygon(54% 0, 100% 0, 100% 100%, 44% 100%)'}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: vertical ? 'translate(-760px, 560px) scale(1.25)' : 'translate(520px, -120px) scale(1.18)'}}>
        <Layer>
          <MomRoom warmth={1} scarfPile={1.8} />
          <LightPool id={`ltcLamp${vertical ? 'v' : 'h'}`} x={1300} y={520} rx={700} ry={500} color={WARM.lamp} opacity={0.3} />
          <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={POSES.sitPhoneEar} eyes="happy" brows={8} look={[6, 0]} glow="amber" glowStrength={0.9} itemB={<EarPhone />} itemF={<KnittingInHands len={14} />} />
        </Layer>
      </AbsoluteFill>
    </AbsoluteFill>
  </>
);

const Seam: React.FC<{d: [number, number, number, number]; w: number; h: number}> = ({d, w, h}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <linearGradient id="ltSeam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={COLD.screen} />
        <stop offset="1" stopColor={WARM.lamp} />
      </linearGradient>
      <filter id="ltSeamGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={10} />
      </filter>
    </defs>
    <line x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} stroke="url(#ltSeam)" strokeWidth={26} filter="url(#ltSeamGlow)" opacity={0.8} />
    <line x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} stroke="#ffffff" strokeWidth={6} opacity={0.9} />
  </svg>
);

export const LaterThumbCall: React.FC = () => (
  <Scaled w={1280}>
    <SplitCall />
    <Seam d={[1037, 0, 845, 1080]} w={1920} h={1080} />
    <Vignette strength={0.4} />
    <BottomShade />
    <Punch lines={['Call her.']} x={0} y={30} size={230} align="center" rotate={0} width={1920} />
    <Wordmark x={46} y={985} text="LATER" />
  </Scaled>
);

/* vertical cover (1080x1920), matches C */
export const LaterCoverVertical: React.FC = () => (
  <AbsoluteFill style={{background: '#0a1120', overflow: 'hidden'}}>
    <SplitCall vertical />
    <Seam d={[0, 1152, 1080, 1037]} w={1080} h={1920} />
    <Vignette strength={0.4} />
    <Punch lines={['Call her.']} x={0} y={285} size={175} align="center" rotate={0} width={1080} />
  </AbsoluteFill>
);

