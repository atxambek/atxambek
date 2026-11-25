import React from 'react';
import {AbsoluteFill} from 'remotion';
import {POSES, StickFigure} from '../characters/StickFigure';
import {Hand, PhoneClose} from '../props/Inserts';
import {HandPhone} from '../props/Props';
import {COLD, WARM} from '../theme';
import {useF} from '../time';
import {Camera, Layer, LightPool, Subtitle, usePush, Vignette} from '../ui/UI';
import {DEC_2026, EarPhone, HourglassMeter, KnittingInHands, NOV_2026, SCARF_RED, ScarfPath, VoicemailScreen, WallCalendar, Snowfall} from './props';
import {MomRoom, SamFlat, SnowStreet} from './sets';

/**
 * LATER — phase 1 style frames. Each is an animated shot (so phase 2 can reuse it);
 * the stills script picks a representative frame.
 */
const SAM = {hair: 'tuft' as const, scarf: SCARF_RED};
const MOM = {build: 'elder' as const, hair: 'bun' as const, glasses: true};

/* S1 — Monday morning: he declines Mom's call */
export const LaterS01: React.FC = () => {
  const f = useF();
  const zoom = usePush(300, 1.0, 1.04);
  const buzz = Math.sin(f * 2.2) * (f < 60 ? 1.5 : 0);
  return (
    <AbsoluteFill style={{background: '#1d2129'}}>
      <Camera zoom={zoom} ox={900} oy={560}>
        <Layer>
          <SamFlat time="morning" clockMinutes={7 * 60 + 52} calendar={{month: NOV_2026, today: 2, crossedThrough: 1}} />
          <LightPool id="l1phone" x={700} y={470} rx={260} ry={220} color={COLD.screen} opacity={0.32} />
          <StickFigure x={640 + buzz} y={704} scale={4.0} {...SAM} pose={POSES.holdPhone} eyes="open" brows={-6} look={[6, 3]} glow="cyan" glowStrength={0.7}
            itemF={<HandPhone glow={1} angle={-30} />} />
        </Layer>
      </Camera>
      <Subtitle text="Busy. Call you later." kind="excuse" x={660} y={330} from={0} />
      <HourglassMeter x={1440} y={170} days={3} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* S3 — Mom reads "Busy. Call you later." in her dim room */
export const LaterS03: React.FC = () => {
  const zoom = usePush(240, 1.08, 1.12);
  return (
    <AbsoluteFill style={{background: '#21170f'}}>
      <Camera zoom={zoom} ox={1000} oy={600}>
        <Layer>
          <MomRoom warmth={0} />
          <LightPool id="l3phone" x={1060} y={520} rx={200} ry={170} color={COLD.screen} opacity={0.3} />
          <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={{...POSES.sitKnit, armF: [62, 96], headTilt: 12}} eyes="open" brows={8} look={[6, 3]} glow="amber" glowStrength={0.45}
            itemF={<HandPhone glow={1} angle={-60} />} itemB={<KnittingInHands len={7} />} />
        </Layer>
      </Camera>
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

/* Act 2 — Wed, Dec 16: a thick stack of CALL MOM notes on today's square */
export const LaterStack: React.FC = () => {
  const f = useF();
  const zoom = usePush(240, 1.0, 1.05);
  return (
    <AbsoluteFill style={{background: '#171b22'}}>
      <Camera zoom={zoom} ox={700} oy={560}>
        <Layer>
          <rect width={1920} height={1080} fill="#232831" />
          {/* window with first snow, out of focus, on the right */}
          <rect x={1290} y={110} width={560} height={720} fill="#101824" />
        </Layer>
        <Layer blur={8}>
          <g>
            <rect x={1300} y={120} width={540} height={700} fill="#1a2535" />
            <Snowfall w={1920} h={1080} f={f} n={160} seed={7} size={1.6} />
            <rect x={1300} y={640} width={540} height={180} fill="#dfe7f0" opacity={0.9} />
          </g>
        </Layer>
        <Layer>
          <rect x={1290} y={0} width={30} height={1080} fill="#232831" />
          <rect x={1840} y={0} width={80} height={1080} fill="#232831" />
          <WallCalendar x={250} y={60} w={900} month={DEC_2026} today={16} crossedThrough={15} stack={{day: 16, count: 34}} />
        </Layer>
      </Camera>
      <HourglassMeter x={1570} y={250} days={47} />
      <Vignette strength={0.42} />
    </AbsoluteFill>
  );
};

/* S7 — the voicemail he never played */
export const LaterS07: React.FC = () => {
  const f = useF();
  const zoom = usePush(300, 1.0, 1.05);
  return (
    <AbsoluteFill style={{background: '#0b0f16'}}>
      <Camera zoom={zoom} ox={860} oy={520}>
        <Layer blur={12}>
          <rect width={1920} height={1080} fill="#121822" />
          <rect x={1250} y={160} width={420} height={420} fill="#1a2535" />
          <Snowfall w={1920} h={600} f={f} n={60} seed={9} />
          <rect x={0} y={760} width={1920} height={320} fill="#2b3442" />
          <LightPool id="l7glow" x={860} y={520} rx={700} ry={520} color={COLD.screen} opacity={0.22} />
        </Layer>
        <Layer>
          <PhoneClose cx={860} cy={540} s={1.0} rotate={-5} clock={<text x={30} y={42}>01:12</text>}>
            <VoicemailScreen progress={0.62} />
          </PhoneClose>
          <Hand x={900} y={1080} s={1.9} rotate={-8} curl={0.6} />
        </Layer>
      </Camera>
      <Subtitle text="I just wanted to hear your voice." kind="phone" x={1430} y={470} from={0} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* S13 — the call: split screen, cold street / Mom's room */
export const LaterS13: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* left: Sam in the snow */}
      <AbsoluteFill style={{clipPath: 'inset(0 50% 0 0)'}}>
        <AbsoluteFill style={{transform: 'translateX(-480px)'}}>
          <Layer>
            <SnowStreet f={f} warmSpill={0.6} />
            <StickFigure x={960} y={700} scale={4.0} {...SAM} pose={POSES.phoneEar} eyes="happy" brows={6} look={[5, 1]} glow="amber" glowStrength={0.5}
              itemB={<EarPhone />} />
          </Layer>
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(255,179,92,0.28), rgba(255,179,92,0) 55%)'}} />
      </AbsoluteFill>
      {/* right: Mom in her chair */}
      <AbsoluteFill style={{clipPath: 'inset(0 0 0 50%)'}}>
        <AbsoluteFill style={{transform: 'translateX(440px)'}}>
          <Layer>
            <MomRoom warmth={0.55} scarfPile={1.2} />
            <StickFigure x={1000} y={760} scale={4.0} {...MOM} pose={POSES.sitPhoneEar} eyes="happy" brows={8} look={[6, 0]} glow="amber" glowStrength={0.8}
              itemB={<EarPhone />} itemF={<KnittingInHands len={9} />} />
          </Layer>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* the seam */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id="l13seam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={COLD.screen} />
            <stop offset="1" stopColor={WARM.lamp} />
          </linearGradient>
          <filter id="l13glow" x="-200%" y="-5%" width="500%" height="110%">
            <feGaussianBlur stdDeviation={9} />
          </filter>
        </defs>
        <rect x={946} y={0} width={28} height={1080} fill="url(#l13seam)" filter="url(#l13glow)" opacity={0.8} />
        <rect x={957} y={0} width={6} height={1080} fill="#ffffff" opacity={0.85} />
      </svg>
      <Subtitle text="Hi, Mom. It's me." kind="spoken" x={480} y={330} from={0} />
      <Subtitle text="Sam!" kind="spoken" x={1440} y={420} from={0} />
      <HourglassMeter x={1760} y={120} days={0} flip={1} warm={1} drain={0.95} />
      <Vignette strength={0.38} />
    </AbsoluteFill>
  );
};

/* S18 — the scarf she knitted while she waited */
export const LaterS18: React.FC = () => {
  const f = useF();
  const zoom = usePush(360, 1.0, 1.04);
  const samX = 1045;
  const momX = 905;
  return (
    <AbsoluteFill style={{background: '#3a2a1e'}}>
      <Camera zoom={zoom} ox={980} oy={620}>
        <Layer>
          <MomRoom warmth={1} snow f={f} tea />
          <LightPool id="l18warm" x={980} y={560} rx={700} ry={500} color={WARM.lamp} opacity={0.3} />
          {/* the part of the scarf that is draped over the armchair, behind them */}
          <ScarfPath d="M1132,866 C1124,780 1134,700 1178,692 C1222,686 1234,762 1228,872" width={15} />
          <StickFigure x={momX} y={728} scale={4.0} {...MOM} scarf={SCARF_RED} facing={1} pose={{...POSES.stand, armF: [128, 22], armB: [10, 10], headTilt: -12}} eyes="happy" brows={6} look={[6, -2]} glow="amber" glowStrength={0.85} />
          <StickFigure x={samX} y={704} scale={4.0} {...SAM} facing={-1} pose={{...POSES.stand, armF: [86, 26], armB: [-8, 6], lean: 8, headTilt: 10}} eyes="happy" brows={6} look={[6, 1]} glow="amber" glowStrength={0.85} />
          {/* the endless scarf, in front: from his neck to hers, down her front and away across the floor */}
          <ScarfPath d="M1030,540 C1000,610 940,622 918,580" width={17} />
          <ScarfPath d="M900,590 C872,650 930,760 900,872 C888,930 1000,960 1120,936 C1210,918 1260,890 1300,912 C1360,946 1280,972 1240,948 C1200,920 1330,896 1440,930 C1560,968 1640,950 1700,926 C1760,904 1820,960 1760,972 C1700,982 1740,920 1840,930 S1960,940 2010,936" width={18} />
          <ScarfPath d="M760,900 C720,880 690,940 740,950 C800,962 850,930 880,905" width={15} />
        </Layer>
      </Camera>
      <Vignette strength={0.38} />
    </AbsoluteFill>
  );
};
