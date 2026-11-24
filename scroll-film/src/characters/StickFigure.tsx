import React, {useId} from 'react';
import {INK, MIA_CLIP} from '../theme';

/**
 * Flat black silhouette stick figure.
 * Local coordinates: hip joint at (0,0), +x = the direction the figure faces, y down.
 * Limb angles in degrees: 0 = hanging straight down, 90 = pointing forward, 180 = straight up,
 * negative = backward. The second number of a limb is the elbow/knee bend relative to the first.
 */
export type Limb = [number, number];
export type Pose = {
  armF: Limb; // front arm
  armB: Limb; // back arm
  legF: Limb;
  legB: Limb;
  lean?: number; // torso rotation about hip, + = forward
  headTilt?: number; // + = nod forward
  headDy?: number; // slump the head down (local units)
};

export type Eyes = 'open' | 'happy' | 'sad' | 'wide' | 'closed' | 'half' | 'none'; // none = back of the head
export type Glow = 'none' | 'rim' | 'cyan' | 'amber';

export const POSES: Record<string, Pose> = {
  stand: {armF: [6, 4], armB: [-6, -4], legF: [3, 0], legB: [-3, 0]},
  sitPhone: {armF: [25, 115], armB: [15, 95], legF: [88, -86], legB: [80, -80], lean: -15, headTilt: 26, headDy: 2},
  sitLookUp: {armF: [10, 55], armB: [5, 40], legF: [88, -86], legB: [80, -80], lean: -4, headTilt: -4},
  sitRead: {armF: [35, 80], armB: [28, 75], legF: [90, 0], legB: [88, 0], lean: -18, headTilt: 18},
  bookUp: {armF: [112, 8], armB: [100, 14], legF: [8, 0], legB: [-8, 0], lean: 2, headTilt: -6},
  walk: {armF: [20, 25], armB: [-20, 10], legF: [22, -10], legB: [-18, -30], lean: 3},
  lie: {armF: [28, 40], armB: [6, 4], legF: [4, -6], legB: [0, -4], headTilt: 90},
  holdMug: {armF: [12, 100], armB: [-4, -2], legF: [3, 0], legB: [-3, 0], headTilt: -4},
  cuddle: {armF: [40, 60], armB: [20, 40], legF: [90, 0], legB: [88, 0], lean: -26, headTilt: 6},
};

type Dims = {
  headR: number; torsoH: number; torsoW: number; shoulderY: number;
  armU: number; armL: number; legU: number; legL: number; limbW: number; eyeR: number; k: number;
};
const DAD: Dims = {headR: 14, torsoH: 44, torsoW: 25, shoulderY: -38, armU: 17, armL: 16, legU: 22, legL: 22, limbW: 7, eyeR: 1.9, k: 1};
// Kid: bigger head ratio, ~55% of Dad's total height after k scaling.
const KID: Dims = {headR: 17, torsoH: 28, torsoW: 23, shoulderY: -24, armU: 13, armL: 12, legU: 13, legL: 13, limbW: 6, eyeR: 2.5, k: 0.733};

const rad = (d: number) => (d * Math.PI) / 180;
const dir = (a: number, len: number) => [Math.sin(rad(a)) * len, Math.cos(rad(a)) * len];

const limbPts = (ox: number, oy: number, l: Limb, u: number, lo: number) => {
  const [dx1, dy1] = dir(l[0], u);
  const [dx2, dy2] = dir(l[0] + l[1], lo);
  const p1 = [ox + dx1, oy + dy1];
  const p2 = [p1[0] + dx2, p1[1] + dy2];
  return {path: `M${ox},${oy} L${p1[0]},${p1[1]} L${p2[0]},${p2[1]}`, end: p2, angle: l[0] + l[1]};
};

const GLOW: Record<Glow, {color: string; op: number; dil: number; blur: number}> = {
  none: {color: '#000', op: 0, dil: 0, blur: 0},
  rim: {color: '#9aa6bb', op: 0.45, dil: 0.6, blur: 1.4},
  cyan: {color: '#5fd3ff', op: 0.75, dil: 1.2, blur: 3.2},
  amber: {color: '#ffb35c', op: 0.75, dil: 1.2, blur: 3.2},
};

export type StickFigureProps = {
  x: number;
  y: number; // position of the hip joint in parent coords
  scale?: number;
  facing?: 1 | -1;
  rotate?: number; // whole-body rotation (e.g. lying down)
  pose?: Pose;
  eyes?: Eyes;
  brows?: number; // + = inner ends up (worry/sad), - = angry/focused
  browLift?: number;
  look?: [number, number]; // eye offset on the face (local units, before facing)
  mouth?: 'none' | 'o';
  glow?: Glow;
  glowStrength?: number; // 0..1
  kid?: boolean;
  itemF?: React.ReactNode; // drawn at the front hand (local coords, rotate follows forearm if itemRotate)
  itemB?: React.ReactNode;
  itemBehind?: boolean;
  opacity?: number;
};

export const StickFigure: React.FC<StickFigureProps> = ({
  x, y, scale = 1, facing = 1, rotate = 0, pose = POSES.stand, eyes = 'open', brows = 0, browLift = 0,
  look, mouth = 'none', glow = 'rim', glowStrength = 1, kid = false, itemF, itemB, itemBehind = false, opacity = 1,
}) => {
  const id = useId().replace(/:/g, '');
  const d = kid ? KID : DAD;
  const g = GLOW[glow];
  const lean = pose.lean ?? 0;
  const headCY = -d.torsoH - d.headR * 0.82 + (pose.headDy ?? 0);
  const lx = look?.[0] ?? d.headR * 0.32;
  const ly = look?.[1] ?? 0;
  const gap = d.headR * 0.33;

  const armF = limbPts(2, d.shoulderY, pose.armF, d.armU, d.armL);
  const armB = limbPts(-2, d.shoulderY, pose.armB, d.armU, d.armL);
  const legF = limbPts(3.5, -3, pose.legF, d.legU, d.legL);
  const legB = limbPts(-3.5, -3, pose.legB, d.legU, d.legL);

  const r = d.eyeR;
  const eye = (ex: number, ey: number) => {
    switch (eyes) {
      case 'happy':
        return <path d={`M${ex - r * 1.5},${ey + r * 0.6} Q${ex},${ey - r * 1.9} ${ex + r * 1.5},${ey + r * 0.6}`} stroke="#fff" strokeWidth={r * 0.85} fill="none" strokeLinecap="round" />;
      case 'closed':
        return <path d={`M${ex - r * 1.4},${ey} Q${ex},${ey + r * 1.5} ${ex + r * 1.4},${ey}`} stroke="#fff" strokeWidth={r * 0.75} fill="none" strokeLinecap="round" />;
      case 'half':
        return <ellipse cx={ex} cy={ey + r * 0.2} rx={r * 1.05} ry={r * 0.55} fill="#fff" />;
      case 'wide':
        return <circle cx={ex} cy={ey} r={r * 1.5} fill="#fff" />;
      case 'sad':
        return <circle cx={ex} cy={ey + r * 0.2} r={r * 0.9} fill="#fff" />;
      default:
        return <circle cx={ex} cy={ey} r={r} fill="#fff" />;
    }
  };
  const browY = ly - r * 3.3 - browLift - (eyes === 'wide' ? r * 0.8 : 0);
  const browLen = r * 2.6;
  const brow = (bx: number, sign: number) => (
    <line
      x1={bx - browLen / 2} y1={browY} x2={bx + browLen / 2} y2={browY}
      stroke="#fff" strokeWidth={r * 0.7} strokeLinecap="round"
      transform={`rotate(${-sign * brows} ${bx} ${browY})`}
    />
  );

  const limbStyle = {stroke: INK, strokeWidth: d.limbW, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const at = (p: number[], node: React.ReactNode) => node ? <g transform={`translate(${p[0]} ${p[1]})`}>{node}</g> : null;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale * d.k * facing} ${scale * d.k})`} opacity={opacity}>
      <defs>
        <filter id={`gl${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={g.dil} result="d" />
          <feGaussianBlur in="d" stdDeviation={g.blur} result="b" />
          <feFlood floodColor={g.color} floodOpacity={g.op * glowStrength} />
          <feComposite in2="b" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={glow === 'none' ? undefined : `url(#gl${id})`}>
        {itemBehind && at(armB.end, itemB)}
        <path d={legB.path} {...limbStyle} />
        <path d={legF.path} {...limbStyle} />
        <g transform={`rotate(${lean})`}>
          <path d={armB.path} {...limbStyle} />
          {!itemBehind && at(armB.end, itemB)}
          <rect x={-d.torsoW / 2} y={-d.torsoH} width={d.torsoW} height={d.torsoH + 2} rx={d.torsoW * 0.42} fill={INK} />
          <g transform={`translate(0 ${headCY}) rotate(${pose.headTilt ?? 0})`}>
            {kid && (
              <g fill={INK}>
                {/* pigtails */}
                <ellipse cx={-d.headR * 1.05} cy={-d.headR * 0.35} rx={d.headR * 0.42} ry={d.headR * 0.3} transform={`rotate(-25 ${-d.headR * 1.05} ${-d.headR * 0.35})`} />
                <ellipse cx={d.headR * 1.0} cy={-d.headR * 0.55} rx={d.headR * 0.38} ry={d.headR * 0.28} transform={`rotate(30 ${d.headR} ${-d.headR * 0.55})`} />
              </g>
            )}
            <circle r={d.headR} fill={INK} />
            {kid && (
              <g transform={`translate(${d.headR * 0.45} ${-d.headR * 0.86}) rotate(20)`}>
                <rect x={-4.2} y={-1.9} width={8.4} height={3.8} rx={1.9} fill={MIA_CLIP} />
                <circle cx={-4.4} cy={0} r={1.9} fill={MIA_CLIP} />
                <circle cx={4.4} cy={0} r={1.9} fill={MIA_CLIP} />
              </g>
            )}
            {eyes !== 'none' && eye(lx - gap, ly)}
            {eyes !== 'none' && eye(lx + gap, ly)}
            {eyes !== 'closed' && eyes !== 'none' && brow(lx - gap, 1)}
            {eyes !== 'closed' && eyes !== 'none' && brow(lx + gap, -1)}
            {mouth === 'o' && <ellipse cx={lx} cy={ly + r * 3.4} rx={r * 0.8} ry={r * 1.1} fill="#fff" />}
          </g>
          <path d={armF.path} {...limbStyle} />
          {at(armF.end, itemF)}
        </g>
      </g>
    </g>
  );
};

/** Walk cycle. phase in radians (advance ~0.35 per base frame for a normal walk). */
export const walkPose = (phase: number, over: Partial<Pose> = {}): Pose => {
  const s = Math.sin(phase);
  return {
    armF: [-22 * s, 18],
    armB: [22 * s, 18],
    legF: [26 * s, s > 0 ? -6 : -26 * -s],
    legB: [-26 * s, s < 0 ? -6 : -26 * s],
    lean: 3,
    ...over,
  };
};
/** Small vertical bob that goes with walkPose (local px after scale handled by caller). */
export const walkBob = (phase: number) => -Math.abs(Math.cos(phase)) * 6;
