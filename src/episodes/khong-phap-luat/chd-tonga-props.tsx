import React from 'react';
import { Hero, Look, Pose, turnWidth, FONT, clamp, easeOut, rnd } from '../../engine';

// Chapter D scenery (2/3): the six Tongan boys and their props (fire, tally rock, novel, icons, rescue boat).

const SHIRTS = ['#C4623C', '#4C7FA8', '#D9B04A', '#6E9A5A', '#B0587A', '#7C6AA8'];
const SHIRT_SHADE = ['#9C4A2C', '#38627F', '#B08C34', '#527A44', '#8A4260', '#5E508A'];
const SHORTS = ['#3A4A6A', '#5A4A32', '#3A5A4A', '#4A3A5A', '#6A4A3A', '#2F4A5A'];

/** Six plain boys: brown skin, short dark hair, bare arms and feet, one shirt colour each. */
export const boyLook = (i: number): Look => ({
  skin: '#B0703F', skinShade: '#8F5A31', hand: '#B0703F', jacket: SHIRTS[i % 6], jacketShade: SHIRT_SHADE[i % 6], accent: SHIRT_SHADE[i % 6],
  limb: '#B0703F', line: '#2A1810', shoe: '#B0703F', face: '#1A100C', hair: '#1A100C',
});

/** A boy = the rig in his costume plus shorts over the hips (the rig's legs are bare). */
export const Boy: React.FC<{ i: number; pose: Pose; rimId?: string; shadow?: number }> = ({ i, pose, rimId = 'rimR', shadow = 0.6 }) => {
  const hw = 40 * turnWidth(pose.yaw);
  return (
    <g>
      <Hero look={boyLook(i)} pose={pose} rimId={rimId} shadow={shadow} />
      <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.tilt})`}>
        <path d={`M ${-hw} 5 L ${hw} 5 L ${hw + 3} 48 L 5 52 L 0 30 L -5 52 L ${-hw - 3} 48 Z`} fill={SHORTS[i % 6]} stroke="#2A1810" strokeWidth={4} strokeLinejoin="round" />
        <path d={`M ${-hw} 10 L ${hw} 10`} stroke="#2A1810" strokeWidth={3} opacity={0.4} />
      </g>
      {/* short black hair: a cap over the top of the head (the rig only draws a tuft) */}
      <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.tilt})`}>
        <g transform={`rotate(${pose.headTilt} 0 -136) translate(${-pose.yaw * 8} 0)`}>
          <path d="M -54 -206 A 62 62 0 0 1 54 -206 Q 30 -216 0 -209 Q -30 -216 -54 -206 Z" fill="#1A100C" stroke="#1A100C" strokeWidth={4} strokeLinejoin="round" />
        </g>
      </g>
    </g>
  );
};

/** A campfire: crossed logs and three flickering flames. (x, y) = ground. */
export const Fire: React.FC<{ x: number; y: number; s?: number; t: number; size?: number }> = ({ x, y, s = 1, t, size = 1 }) => {
  const fl = (k: number, w: number, h: number, col: string) => {
    const h2 = h * size * (0.86 + 0.14 * Math.sin(t / 2.3 + k * 2) + 0.06 * Math.sin(t / 1.1 + k));
    const sway = Math.sin(t / 4 + k) * 9;
    return <path d={`M ${-w} 0 Q ${-w - 10} ${-h2 * 0.5} ${sway} ${-h2} Q ${w + 10} ${-h2 * 0.5} ${w} 0 Z`} fill={col} />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={92} ry={14} fill="#000" opacity={0.25} />
      <g transform="translate(0 -4)">
        {fl(0, 44, 150, '#E0562A')}
        <g transform="translate(-18 0)">{fl(1, 28, 110, '#F2A33A')}</g>
        <g transform="translate(14 0)">{fl(2, 20, 76, '#FFE48A')}</g>
      </g>
      <rect x={-86} y={-18} width={172} height={22} rx={10} fill="#5A3A22" stroke="#2A1810" strokeWidth={4} transform="rotate(-7)" />
      <rect x={-86} y={-18} width={172} height={22} rx={10} fill="#6E4A2C" stroke="#2A1810" strokeWidth={4} transform="rotate(8)" />
      {Array.from({ length: 6 }).map((_, i) => {
        const p = ((t / 40 + rnd(2, i)) % 1);
        return <circle key={i} cx={(rnd(5, i) - 0.5) * 70 + Math.sin(p * 6 + i) * 14} cy={-60 - p * 190 * size} r={3.5 * (1 - p)} fill="#FFD27A" opacity={1 - p} />;
      })}
    </g>
  );
};

/** A boulder with scratched tally marks: `n` marks drawn (fractional = the last mark is half-drawn); groups of five get a slash. */
export const TallyRock: React.FC<{ x: number; y: number; s?: number; n: number }> = ({ x, y, s = 1, n }) => {
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < 15; i++) {
    const p = clamp(n - i);
    if (p <= 0) continue;
    const g = Math.floor(i / 5);
    const k = i % 5;
    const bx = -250 + g * 230 + (k < 4 ? k * 38 : 0);
    const y0 = -90 + g * 4;
    if (k < 4) marks.push(<path key={i} d={`M ${bx} ${y0} L ${bx + 3} ${y0 + 150 * p}`} stroke="#2E2218" strokeWidth={14} strokeLinecap="round" />);
    else marks.push(<path key={i} d={`M ${bx - 150} ${y0 + 130} L ${bx - 150 + 160 * p} ${y0 + 130 - 120 * p}`} stroke="#2E2218" strokeWidth={14} strokeLinecap="round" />);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={118} rx={420} ry={30} fill="#000" opacity={0.3} />
      <path d="M -400 110 Q -440 -10 -330 -110 Q -200 -190 0 -180 Q 220 -190 340 -100 Q 430 -10 400 110 Z" fill="#9A8A74" stroke="#4A3A2A" strokeWidth={7} strokeLinejoin="round" />
      <path d="M 120 -186 Q 300 -170 360 -90 Q 440 -10 400 110 L 150 110 Q 220 0 120 -186 Z" fill="#6E5E4C" opacity={0.5} />
      {marks}
    </g>
  );
};

/** A closed novel: dark red cover, gold frame and a diamond ornament, no title. `cross` 0..1 draws a red X over it. */
export const Novel: React.FC<{ x: number; y: number; s?: number; rot?: number; cross?: number }> = ({ x, y, s = 1, rot = 0, cross = 0 }) => {
  const a = easeOut(clamp(cross * 2));
  const b = easeOut(clamp(cross * 2 - 1));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={20} cy={300} rx={270} ry={30} fill="#000" opacity={0.3} />
      <rect x={-210} y={-280} width={440} height={580} rx={14} fill="#F2E6C8" stroke="#6E5230" strokeWidth={6} />
      <rect x={-224} y={-290} width={440} height={580} rx={14} fill="#7C1F2B" stroke="#3E0E16" strokeWidth={7} />
      <rect x={-224} y={-290} width={52} height={580} rx={10} fill="#5E1520" />
      <rect x={-146} y={-250} width={340} height={500} rx={8} fill="none" stroke="#E2B655" strokeWidth={6} />
      <rect x={-130} y={-234} width={308} height={468} rx={4} fill="none" stroke="#E2B655" strokeWidth={2.5} />
      <path d="M 24 -150 L 100 -20 L 24 110 L -52 -20 Z" fill="none" stroke="#E2B655" strokeWidth={6} strokeLinejoin="round" />
      <path d="M 24 -90 L 62 -20 L 24 50 L -14 -20 Z" fill="#E2B655" opacity={0.85} />
      <path d="M -90 -190 H -30 M 78 -190 H 138 M -90 190 H -30 M 78 190 H 138" stroke="#E2B655" strokeWidth={5} strokeLinecap="round" />
      <path d={`M -210 -240 L ${-210 + 440 * a} ${-240 + 480 * a}`} stroke="#FF3B30" strokeWidth={34} strokeLinecap="round" />
      <path d={`M 230 -240 L ${230 - 440 * b} ${-240 + 480 * b}`} stroke="#FF3B30" strokeWidth={34} strokeLinecap="round" />
    </g>
  );
};

/** A crossed-out sign: a big grey icon with a red bar through it and a short caption. `p` 0..1 pops it in. */
export const NoSign: React.FC<{ x: number; y: number; p: number; label: string; children: React.ReactNode }> = ({ x, y, p, label, children }) => {
  const k = easeOut(clamp(p));
  const bar = easeOut(clamp((p - 0.35) / 0.4));
  return (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}>
      <rect x={-250} y={-300} width={500} height={600} rx={44} fill="#2A1E14" opacity={0.78} />
      <rect x={-250} y={-300} width={500} height={600} rx={44} fill="none" stroke="#F2D9A0" strokeWidth={7} />
      <g transform="translate(0 -40)">{children}</g>
      <path d={`M -170 -190 L ${-170 + 340 * bar} ${-190 + 340 * bar}`} stroke="#FF3B30" strokeWidth={30} strokeLinecap="round" />
      <text y={250} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={48} fill="#FFF3CF" letterSpacing={2}>{label}</text>
    </g>
  );
};

/** An adult silhouette (head, shoulders, tie) for the "no adults" sign. */
export const AdultIcon: React.FC = () => (
  <g fill="#D8C8A8" stroke="#F2D9A0" strokeWidth={4}>
    <circle cx={0} cy={-90} r={52} />
    <path d="M -110 160 Q -116 0 0 -20 Q 116 0 110 160 Z" />
    <path d="M -8 -16 L 8 -16 L 14 90 L 0 112 L -14 90 Z" fill="#A8323E" stroke="none" />
  </g>
);

/** The scales of justice, for the "no law" sign. */
export const ScalesIcon: React.FC = () => (
  <g stroke="#E8D6AA" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 0 -130 V 140 M -50 150 H 50 M -130 -90 H 130" />
    <path d="M -130 -90 L -170 20 M -130 -90 L -90 20 M 130 -90 L 90 20 M 130 -90 L 170 20" strokeWidth={5} />
    <path d="M -190 20 H -70 Q -80 70 -130 72 Q -180 70 -190 20 Z M 70 20 H 190 Q 180 70 130 72 Q 80 70 70 20 Z" fill="#E8D6AA" fillOpacity={0.3} />
  </g>
);

/** A white rescue boat with a cabin and a flag. (x, y) = waterline. */
export const RescueBoat: React.FC<{ x: number; y: number; s?: number; rot?: number; t: number; children?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, t, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -300 -40 L 300 -40 Q 270 60 190 76 L -200 76 Q -280 56 -300 -40 Z" fill="#F4EEDD" stroke="#4A3A2A" strokeWidth={7} strokeLinejoin="round" />
    <path d="M -292 -4 L 292 -4 L 280 22 L -280 22 Z" fill="#2F6E9A" />
    <rect x={40} y={-170} width={150} height={132} rx={10} fill="#E6DCC4" stroke="#4A3A2A" strokeWidth={6} />
    <rect x={60} y={-150} width={50} height={50} rx={6} fill="#9CC8D8" stroke="#4A3A2A" strokeWidth={4} />
    <path d="M 120 -170 V -260" stroke="#4A3A2A" strokeWidth={6} />
    <path d={`M 120 -258 q 30 ${-8 + 8 * Math.sin(t / 5)} 60 0 q -30 ${14 + 8 * Math.sin(t / 5)} -60 18 Z`} fill="#C8202F" stroke="#4A3A2A" strokeWidth={3} />
    {children}
  </g>
);
