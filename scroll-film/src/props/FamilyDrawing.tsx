import React from 'react';
import {HAND} from '../fonts';
import {BOOK_BLUE, COLD, MIA_CLIP} from '../theme';

/**
 * Mia's crayon drawing "MY FAMILY". Paper 480 x 600, origin top-left.
 * version 'phone': Dad's head is a glowing phone. version 'face': Dad has a real face, holds the book.
 */
export const FamilyDrawing: React.FC<{version: 'phone' | 'face'; id: string; paper?: string}> = ({version, id, paper = '#f3f0e6'}) => {
  const crayon = {fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const title = 'MY FAMILY';
  const tColors = ['#e2574c', '#f0a030', '#3c8dd6', '#e2574c', '#47a55a', '#9b59b6', '#f0a030', '#3c8dd6', '#e2574c'];
  const happy = version === 'face';
  return (
    <g>
      <defs>
        <filter id={`cray${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves={1} seed={9} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.2 1.4" result="holes" />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
        <filter id={`screenGlow${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {/* paper with a slight shadow */}
      <rect x={6} y={8} width={480} height={600} fill="#000" opacity={0.25} />
      <rect width={480} height={600} fill={paper} />
      {/* magnet */}
      <circle cx={240} cy={14} r={14} fill="#e2574c" />
      <g filter={`url(#cray${id})`}>
        <text x={44} y={94} fontFamily={HAND} fontSize={66} letterSpacing={4}>
          {title.split('').map((ch, i) => (
            <tspan key={i} fill={tColors[i]} dy={i === 0 ? 0 : i % 2 ? 5 : -5}>
              {ch}
            </tspan>
          ))}
        </text>
        {/* sun */}
        <circle cx={405} cy={170} r={34} fill="#ffd23f" />
        {Array.from({length: 9}).map((_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return <line key={i} x1={405 + Math.cos(a) * 46} y1={170 + Math.sin(a) * 46} x2={405 + Math.cos(a) * 66} y2={170 + Math.sin(a) * 66} stroke="#f0b020" strokeWidth={7} strokeLinecap="round" />;
        })}
        {/* grass */}
        <path d="M10,540 q30,-22 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0" stroke="#47a55a" strokeWidth={9} {...crayon} />
        {/* DAD */}
        <g stroke="#2b2b2b" strokeWidth={8} {...crayon}>
          <line x1={150} y1={330} x2={150} y2={450} />
          <line x1={150} y1={450} x2={118} y2={530} />
          <line x1={150} y1={450} x2={182} y2={530} />
          <line x1={150} y1={360} x2={happy ? 205 : 105} y2={happy ? 395 : 410} />
          <line x1={150} y1={360} x2={happy ? 100 : 200} y2={happy ? 400 : 405} />
        </g>
        {version === 'phone' ? (
          <g>
            <rect x={102} y={182} width={96} height={150} rx={16} fill={COLD.screen} filter={`url(#screenGlow${id})`} opacity={0.9} />
            <rect x={106} y={186} width={88} height={142} rx={14} fill="#1f2a36" />
            <rect x={116} y={198} width={68} height={116} rx={6} fill={COLD.screen} />
            <rect x={124} y={210} width={52} height={22} rx={4} fill="#ffffff" opacity={0.75} />
            <rect x={124} y={242} width={52} height={22} rx={4} fill="#ff8fb0" opacity={0.8} />
            <rect x={124} y={274} width={52} height={22} rx={4} fill="#ffffff" opacity={0.75} />
          </g>
        ) : (
          <g>
            <circle cx={150} cy={270} r={58} fill="#f6d2a8" stroke="#2b2b2b" strokeWidth={7} />
            <path d="M118,262 q10,-12 20,0 M162,262 q10,-12 20,0" stroke="#2b2b2b" strokeWidth={6} {...crayon} />
            <path d="M118,290 q32,34 64,0" stroke="#e2574c" strokeWidth={7} {...crayon} />
            {/* the blue book in his hands */}
            <rect x={178} y={372} width={56} height={72} rx={5} fill={BOOK_BLUE} stroke="#3c8dd6" strokeWidth={4} />
            <circle cx={214} cy={392} r={9} fill="#fff" />
          </g>
        )}
        {/* MIA */}
        <g stroke="#2b2b2b" strokeWidth={7} {...crayon}>
          <line x1={330} y1={400} x2={330} y2={470} />
          <line x1={330} y1={470} x2={310} y2={530} />
          <line x1={330} y1={470} x2={350} y2={530} />
          <line x1={330} y1={418} x2={happy ? 285 : 300} y2={happy ? 380 : 455} />
          <line x1={330} y1={418} x2={happy ? 375 : 360} y2={happy ? 380 : 455} />
        </g>
        <ellipse cx={280} cy={330} rx={16} ry={11} fill="#2b2b2b" />
        <ellipse cx={380} cy={330} rx={16} ry={11} fill="#2b2b2b" />
        <circle cx={330} cy={352} r={46} fill="#f6d2a8" stroke="#2b2b2b" strokeWidth={6} />
        <rect x={334} y={306} width={34} height={14} rx={7} fill={MIA_CLIP} stroke="#d9a800" strokeWidth={3} />
        {happy ? (
          <g>
            <path d="M306,348 q8,-10 16,0 M338,348 q8,-10 16,0" stroke="#2b2b2b" strokeWidth={5} {...crayon} />
            <path d="M310,366 q20,30 40,0 z" fill="#e2574c" stroke="#2b2b2b" strokeWidth={4} />
            <path d="M232,170 c-10,-16 -32,-6 -20,12 l20,18 l20,-18 c12,-18 -10,-28 -20,-12z" fill="#e2574c" />
          </g>
        ) : (
          <g>
            <circle cx={314} cy={346} r={5} fill="#2b2b2b" />
            <circle cx={346} cy={346} r={5} fill="#2b2b2b" />
            <path d="M316,374 q14,8 28,0" stroke="#2b2b2b" strokeWidth={5} {...crayon} />
          </g>
        )}
      </g>
    </g>
  );
};
