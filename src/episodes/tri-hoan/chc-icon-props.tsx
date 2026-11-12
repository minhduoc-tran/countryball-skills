import React from 'react';
import { clamp, easeOut, backOut, FONT, SCH } from '../../engine';
import { INK } from './chc-note-and-object-props';

// Chapter C props (2/3): line icons for the study cards: a thermometer (ốm), a lower grade (điểm), and the four health
// icons: stress, anxiety, sleepless (a moon with open eyes), loneliness (one figure apart). Pure functions of the clock.

const CREAM = '#F6EFE3';
const RED = '#FF5A4A';

/** A thermometer, about 300 tall at s = 1, centred on its middle. `p` (0..1) is how far the mercury has risen. */
export const ThermoIcon: React.FC<{ x: number; y: number; t: number; s?: number; p: number }> = ({ x, y, t, s = 1, p }) => {
  const pop = backOut(clamp(t / 8));
  const sweat = clamp((t - 10) / 12);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`} style={{ filter: 'drop-shadow(0 0 16px rgba(255,90,74,0.45))' }}>
      <rect x={-34} y={-150} width={68} height={230} rx={34} fill="#F3F6FA" stroke={CREAM} strokeWidth={6} />
      <circle cx={0} cy={96} r={52} fill="#F3F6FA" stroke={CREAM} strokeWidth={6} />
      <circle cx={0} cy={96} r={38} fill={RED} />
      <rect x={-12} y={80 - 210 * p} width={24} height={20 + 210 * p} rx={12} fill={RED} />
      {[-110, -80, -50, -20, 10].map((ty, i) => <path key={i} d={`M 34 ${ty} h ${i % 2 ? 14 : 26}`} stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.7} />)}
      <path d={`M 70 -60 q 14 ${24 * sweat} 0 ${34 * sweat} q -14 -${10 * sweat} 0 -${34 * sweat}`} fill="#8FD8FF" opacity={sweat} />
    </g>
  );
};

/** A marked test sheet with a red low grade and a down arrow: about 300 tall at s = 1. */
export const GradeSheet: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const pop = backOut(clamp(t / 8));
  const drop = easeOut(clamp((t - 8) / 10));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop}) rotate(-5)`}>
      <rect x={-118} y={-138} width={240} height={300} rx={8} fill="#000" opacity={0.3} />
      <rect x={-125} y={-150} width={240} height={300} rx={8} fill="#F6EFE3" stroke={INK} strokeWidth={5} />
      <path d="M -92 -104 H 60 M -92 -74 H 84 M -92 -44 H 36 M -92 -14 H 70" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.4} />
      <g transform={`translate(30 ${70 - 10 * drop}) rotate(-8)`}>
        <circle r={58} fill="none" stroke={RED} strokeWidth={9} />
        <text y={32} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={92} fill={RED}>5</text>
      </g>
      <g transform={`translate(-76 ${60 + 18 * drop})`} opacity={drop}>
        <path d="M 0 -50 V 40 M -28 14 L 0 44 L 28 14" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** A round head icon base (outline circle + two eyes); children draw the mood. About 220 wide at s = 1. */
const Head: React.FC<{ eyeY?: number; brow?: number; children?: React.ReactNode }> = ({ eyeY = -10, brow = 0, children }) => (
  <g>
    <circle r={100} fill="#2A3A58" stroke={CREAM} strokeWidth={7} />
    <circle cx={-34} cy={eyeY} r={9} fill={CREAM} /><circle cx={34} cy={eyeY} r={9} fill={CREAM} />
    {brow !== 0 ? <path d={`M -58 ${eyeY - 22 - brow * 8} L -16 ${eyeY - 22 + brow * 8} M 58 ${eyeY - 22 - brow * 8} L 16 ${eyeY - 22 + brow * 8}`} stroke={CREAM} strokeWidth={8} strokeLinecap="round" /> : null}
    {children}
  </g>
);

const Frame: React.FC<{ x: number; y: number; t: number; label: string; s: number; children: React.ReactNode }> = ({ x, y, t, label, s, children }) => {
  const pop = backOut(clamp(t / 8));
  if (t < 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`}>
      {children}
      <text y={176} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={SCH.line} letterSpacing={4}>{label}</text>
    </g>
  );
};

/** Stress: a furrowed head with a tangled scribble and steam puffing from the top. */
export const IconStress: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <Frame x={x} y={y} t={t} s={s} label="CĂNG THẲNG">
    <Head brow={1}>
      <path d="M -36 52 Q -12 40 0 52 Q 12 64 36 50" stroke={CREAM} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={`M -50 -150 q 30 -${34 + 8 * Math.sin(t / 3)} 40 -4 q 22 -${40 + 8 * Math.sin(t / 3 + 1)} 36 4 q 24 -30 36 -2`} stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round" />
      {[-46, 0, 46].map((dx, i) => <path key={i} d={`M ${dx} -108 l ${i % 2 ? 10 : -10} -22 l ${i % 2 ? -4 : 6} -16`} stroke="#FFB15A" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t / 2 + i)} />)}
    </Head>
  </Frame>
);

/** Anxiety: a head that shakes (doubled outline), sweat drops, a wobbly mouth, wide eyes. */
export const IconAnxiety: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <Frame x={x} y={y} t={t} s={s} label="LO ÂU">
    <g transform={`translate(${Math.sin(t * 2.3) * 4} ${Math.cos(t * 2.9) * 2})`}>
      <circle r={100} fill="none" stroke={CREAM} strokeWidth={3} opacity={0.4} transform={`translate(${Math.sin(t * 1.9) * 12} 0)`} />
      <Head eyeY={-12}>
        <circle cx={-34} cy={-12} r={20} fill="none" stroke={CREAM} strokeWidth={5} /><circle cx={34} cy={-12} r={20} fill="none" stroke={CREAM} strokeWidth={5} />
        <path d="M -34 50 q 11 -14 22 0 t 22 0 t 22 0 t 22 0" stroke={CREAM} strokeWidth={7} fill="none" strokeLinecap="round" />
      </Head>
    </g>
    {[0, 1, 2].map((i) => {
      const k = ((t / 14 + i / 3) % 1);
      return <path key={i} transform={`translate(${112 + i * 14} ${-70 + k * 120}) scale(${0.8 + i * 0.1})`} d="M 0 -18 Q 12 4 0 12 Q -12 4 0 -18 Z" fill="#8FD8FF" opacity={1 - k} />;
    })}
  </Frame>
);

/** Sleepless: a moon (craters, tired rings) with two wide-open eyes that dart about. */
export const IconSleepless: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const dart = Math.sin(t / 5) * 9;
  return (
    <Frame x={x} y={y} t={t} s={s} label="MẤT NGỦ">
      <circle r={112} fill="#F7E7A8" stroke={CREAM} strokeWidth={6} style={{ filter: 'drop-shadow(0 0 22px rgba(255,226,122,0.5))' }} />
      <circle cx={-62} cy={52} r={16} fill="#E2CF86" /><circle cx={58} cy={64} r={22} fill="#E2CF86" /><circle cx={70} cy={-60} r={12} fill="#E2CF86" />
      {[-38, 38].map((ex, i) => (
        <g key={i}>
          <ellipse cx={ex} cy={-10} rx={30} ry={34} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
          <circle cx={ex + dart} cy={-8} r={13} fill={INK} />
          <path d={`M ${ex - 30} 20 q 30 22 60 0`} stroke="#8A6AA8" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      ))}
      <path d="M -26 62 h 52" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      {[0, 1, 2].map((i) => <path key={i} transform={`translate(${130 + i * 26} ${-110 - i * 30 + 6 * Math.sin(t / 6 + i)})`} d="M 0 0 l 22 0 l -22 26 l 22 0" stroke="#7FD4FF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.35} />)}
    </Frame>
  );
};

const Person: React.FC<{ x: number; y: number; c: string; s?: number }> = ({ x, y, c, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cy={-34} r={20} fill={c} /><path d="M -32 40 Q -34 -8 0 -8 Q 34 -8 32 40 Z" fill={c} />
  </g>
);

/** Loneliness: three figures huddled on the left, one dim figure far on the right with a gap line and a small raincloud. */
export const IconLonely: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const drift = easeOut(clamp(t / 18));
  return (
    <Frame x={x} y={y} t={t} s={s} label="CÔ ĐƠN">
      <g transform="translate(40 0) scale(1.3)">
      <Person x={-120} y={20} c={CREAM} /><Person x={-70} y={34} c="#E2D3BE" s={0.92} /><Person x={-20} y={20} c={CREAM} />
      <path d="M 40 70 H 76" stroke={SCH.dim} strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" opacity={0.7} />
      <g transform={`translate(${60 + 70 * drift} 24)`}>
        <Person x={0} y={0} c="#7E8DA6" />
        <g transform={`translate(0 -112)`}>
          <path d="M -30 10 Q -48 10 -44 -6 Q -40 -22 -22 -18 Q -16 -38 6 -34 Q 24 -32 26 -16 Q 46 -14 42 4 Q 40 12 28 10 Z" fill="#5C6B88" />
          {[-14, 2, 18].map((dx, i) => <path key={i} d={`M ${dx} 16 v 14`} stroke="#8FD8FF" strokeWidth={4} strokeLinecap="round" opacity={0.4 + 0.5 * ((t / 6 + i) % 2 < 1 ? 1 : 0.3)} />)}
        </g>
      </g>
      </g>
    </Frame>
  );
};
