import React from 'react';
import { clamp, rnd, backOut, Glow, FONT, Pose, basePose } from '../../engine';
import { INK } from './chd-card-props';

// Chapter D props (3/4): the countryside: a hill sky, grandma's wooden porch, the guitar, floating music notes, the bus,
// a sleepy "tomorrow" sun. Pure functions of t (frames, 30 fps).

export const mix = (a: string, b: string, k: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = h(a);
  const B = h(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k)).toString(16).padStart(2, '0')).join('');
};

/** Sky, sun and two layers of far hills. `dusk` 0 (afternoon gold) .. 1 (violet dusk); the sun sits at (sx, sy). */
export const HillSky: React.FC<{ id: string; t: number; dusk?: number; sx?: number; sy?: number; ground?: boolean }> = ({ id, t, dusk = 0, sx = 1450, sy = 380, ground = false }) => {
  const top = mix('#6FB6E6', '#3A2A6A', dusk);
  const mid = mix('#F9D9A0', '#E8789A', dusk);
  const low = mix('#FFE9B8', '#FFAE5C', dusk);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      <rect x={-1400} y={-400} width={4800} height={1500} fill={`url(#${id}sky)`} />
      <Glow x={sx} y={sy} r={620} o={0.75} />
      <circle cx={sx} cy={sy} r={92} fill={mix('#FFF3C4', '#FFC27A', dusk)} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={260 + i * 640 + ((t * 0.12 + i * 90) % 400)} cy={170 + i * 38} rx={150} ry={26} fill="#FFF" opacity={0.35 - dusk * 0.18} />)}
      <path d="M -1400 640 L -400 640 Q 100 470 520 600 Q 900 480 1300 590 Q 1700 470 2320 620 L 3400 620 L 3400 1100 L -1400 1100 Z" fill={mix('#8EB48A', '#5A4A7A', dusk)} />
      <path d="M -1400 720 L -400 720 Q 300 600 760 700 Q 1200 610 1660 700 Q 2000 630 2320 700 L 3400 700 L 3400 1100 L -1400 1100 Z" fill={mix('#6C9C66', '#3F3560', dusk)} />
      {ground ? <path d="M -1400 720 L 3400 1010 L 3400 1100 L -1400 1100 Z" fill={mix('#7BA04F', '#3A3050', dusk)} /> : null}
    </g>
  );
};

export const PORCH_FLOOR_Y = 730;

/** Grandma's porch: a wooden house wall with a window and door, a roof beam, two posts, boards underfoot, flower pots. Feet stand at y 800. */
export const Porch: React.FC<{ id: string; t: number; dusk?: number }> = ({ id, t, dusk = 0 }) => {
  const wall = mix('#B5835A', '#5E4A5E', dusk * 0.8);
  const wallD = mix('#9A6D48', '#4E3C4E', dusk * 0.8);
  const floor = mix('#8C5E3C', '#4A3A44', dusk * 0.8);
  const lit = 0.25 + 0.6 * dusk;
  return (
    <g>
      <HillSky id={`${id}s`} t={t} dusk={dusk} sx={1560} sy={420 + dusk * 120} />
      {/* the house: wall with planks */}
      <rect x={260} y={150} width={1480} height={PORCH_FLOOR_Y - 150} fill={wall} />
      {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={260} y={150 + i * 37} width={1480} height={4} fill={wallD} opacity={0.7} />)}
      <rect x={200} y={90} width={1600} height={70} fill={mix('#5C3A2E', '#2E2236', dusk * 0.7)} />
      <rect x={200} y={150} width={1600} height={14} fill="#000" opacity={0.25} />
      {/* window with light, and a door */}
      <rect x={560} y={270} width={250} height={230} fill={mix('#9A6D48', '#4E3C4E', dusk)} />
      <rect x={576} y={286} width={218} height={198} fill={mix('#FFE7A8', '#FFC25E', dusk)} opacity={0.85} />
      <path d="M 685 286 L 685 484 M 576 385 L 794 385" stroke={wallD} strokeWidth={8} />
      <rect x={1130} y={250} width={230} height={PORCH_FLOOR_Y - 250} fill={mix('#6E4A32', '#3A2C38', dusk)} />
      <rect x={1146} y={268} width={198} height={PORCH_FLOOR_Y - 290} fill={mix('#85593B', '#46364A', dusk)} />
      <circle cx={1326} cy={520} r={8} fill="#E9C46A" />
      {/* hanging lamp and pots */}
      <path d="M 960 164 L 960 220" stroke={INK} strokeWidth={4} />
      <path d="M 930 262 Q 960 214 990 262 Z" fill="#3A2E3E" />
      <Glow x={960} y={270} r={230 + 120 * dusk} o={lit} />
      {[420, 1560].map((x, i) => (
        <g key={i}>
          <path d={`M ${x - 36} ${PORCH_FLOOR_Y + 60} L ${x + 36} ${PORCH_FLOOR_Y + 60} L ${x + 28} ${PORCH_FLOOR_Y + 120} L ${x - 28} ${PORCH_FLOOR_Y + 120} Z`} fill="#C9684A" stroke={INK} strokeWidth={4} />
          {[-1, 0, 1].map((k) => <ellipse key={k} cx={x + k * 22} cy={PORCH_FLOOR_Y + 40 - Math.abs(k) * 12 + Math.sin(t / 22 + k + i) * 2} rx={16} ry={32} fill={['#4E8A52', '#6BAA5C', '#3F7646'][k + 1]} transform={`rotate(${k * 22} ${x + k * 22} ${PORCH_FLOOR_Y + 40})`} />)}
        </g>
      ))}
      {/* boards underfoot */}
      <rect x={-1400} y={PORCH_FLOOR_Y} width={4800} height={500} fill={floor} />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M -1400 ${PORCH_FLOOR_Y + 12 + i * i * 6 + i * 18} L 3400 ${PORCH_FLOOR_Y + 12 + i * i * 6 + i * 18}`} stroke="#000" strokeWidth={3} opacity={0.3} />)}
      <rect x={-1400} y={PORCH_FLOOR_Y} width={4800} height={10} fill="#C9946A" opacity={0.6} />
      {/* posts */}
      {[230, 1770].map((x) => <rect key={x} x={x - 22} y={90} width={44} height={PORCH_FLOOR_Y - 60} fill={mix('#6E4A32', '#33283A', dusk * 0.7)} />)}
    </g>
  );
};

/** A wooden bench for two seated in profile: seat top at `y`. */
export const Bench: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => (
  <g>
    <ellipse cx={(x0 + x1) / 2} cy={806} rx={(x1 - x0) / 2 + 20} ry={12} fill="#000" opacity={0.3} />
    <rect x={x0 + 14} y={y} width={16} height={806 - y} fill="#4E3424" />
    <rect x={x1 - 30} y={y} width={16} height={806 - y} fill="#4E3424" />
    <rect x={x0} y={y} width={x1 - x0} height={18} rx={5} fill="#9A6A44" />
    <rect x={x0} y={y} width={x1 - x0} height={5} rx={2} fill="#C9946A" />
  </g>
);

/** The acoustic guitar, body centred on (x, y), neck up-right by `rot` degrees. `dust` 0..1 greys it; `strum` 0..1 shakes the strings; `s` scale. */
export const Guitar: React.FC<{ x: number; y: number; rot?: number; s?: number; dust?: number; t?: number; strum?: number; shine?: number }> = ({ x, y, rot = 0, s = 1, dust = 0, t = 0, strum = 0, shine = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -6 -140 L 6 -140 L 8 -430 L -8 -430 Z" fill="#5A3A28" stroke={INK} strokeWidth={4} />
    <rect x={-17} y={-478} width={34} height={56} rx={8} fill="#4A2E20" stroke={INK} strokeWidth={4} />
    {[-9, 9].map((dx) => [0, 1, 2].map((k) => <circle key={`${dx}${k}`} cx={dx * 2.2} cy={-466 + k * 15} r={3.4} fill="#E9D8B0" />))}
    <path d="M -72 -14 C -108 -6 -112 78 -84 96 C -60 112 60 112 84 96 C 112 78 108 -6 72 -14 C 58 -20 52 -46 62 -70 C 74 -98 54 -150 0 -150 C -54 -150 -74 -98 -62 -70 C -52 -46 -58 -20 -72 -14 Z" fill="#C9843A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 42 100 C 100 82 110 10 74 -14 C 90 20 78 76 42 100 Z" fill="#8A5624" opacity={0.7} />
    <path d="M -50 -110 C -36 -136 20 -138 36 -116" fill="none" stroke="#F2C078" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    <circle cx={0} cy={-34} r={30} fill="#2A1810" stroke={INK} strokeWidth={4} />
    <circle cx={0} cy={-34} r={36} fill="none" stroke="#6A3E20" strokeWidth={5} />
    <rect x={-34} y={52} width={68} height={14} rx={4} fill="#3A2216" />
    {[-5, -3, -1, 1, 3, 5].map((k) => <path key={k} d={`M ${k * 1.4} 58 L ${k * 0.8} -430`} stroke="#EDE6D2" strokeWidth={1.8} opacity={0.9} transform={`translate(${strum * Math.sin(t * 2.6 + k) * 3} 0)`} />)}
    {dust > 0 ? (
      <g opacity={dust}>
        <path d="M -72 -14 C -108 -6 -112 78 -84 96 C -60 112 60 112 84 96 C 112 78 108 -6 72 -14 C 58 -20 52 -46 62 -70 C 74 -98 54 -150 0 -150 C -54 -150 -74 -98 -62 -70 C -52 -46 -58 -20 -72 -14 Z" fill="#B8B2A6" opacity={0.7} />
        {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={(rnd(2, i) - 0.5) * 150} cy={-100 + rnd(3, i) * 200} rx={10 + rnd(4, i) * 14} ry={6 + rnd(5, i) * 6} fill="#D4CEC2" opacity={0.6} />)}
      </g>
    ) : null}
    {shine > 0 ? <path d="M -48 -100 C -34 -128 20 -130 34 -108" fill="none" stroke="#FFF6D6" strokeWidth={8} strokeLinecap="round" opacity={shine * 0.8} /> : null}
  </g>
);

/** Music notes floating up from (x, y): n notes, each a loop of 60 frames, staggered. */
export const Notes: React.FC<{ x: number; y: number; t: number; n?: number; s?: number; color?: string }> = ({ x, y, t, n = 5, s = 1, color = '#FFE27A' }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = ((t + i * (60 / n) * 1.0) % 60) / 60;
      const nx = x + (rnd(11, i) - 0.4) * 260 * s + Math.sin(p * 6 + i) * 24;
      const ny = y - p * 330 * s;
      return (
        <g key={i} transform={`translate(${nx} ${ny}) rotate(${Math.sin(p * 5 + i) * 14}) scale(${s})`} opacity={Math.min(1, p * 6) * (1 - p * p)}>
          <ellipse cx={0} cy={0} rx={14} ry={10} fill={color} stroke={INK} strokeWidth={4} transform="rotate(-20)" />
          <path d="M 12 -2 L 12 -52" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          {i % 2 === 0 ? <path d="M 12 -52 Q 36 -44 30 -24" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
        </g>
      );
    })}
  </g>
);

/** A countryside bus from the side (faces right), centred on its wheels' ground line at (x, y). Pip waves from a window. */
export const Bus: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const bob = Math.sin(t * 0.9) * 2;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={290} ry={14} fill="#000" opacity={0.3} />
      <rect x={-280} y={-200} width={560} height={170} rx={30} fill="#E9654B" stroke={INK} strokeWidth={6} />
      <rect x={-280} y={-100} width={560} height={26} fill="#F6EFE3" />
      <path d="M 280 -200 Q 310 -150 296 -50 L 296 -30 L 280 -30 Z" fill="#E9654B" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-250 + i * 118} y={-176} width={96} height={70} rx={10} fill="#BFE3F0" stroke={INK} strokeWidth={5} />)}
      <rect x={236} y={-176} width={44} height={70} rx={8} fill="#BFE3F0" stroke={INK} strokeWidth={5} />
      <rect x={282} y={-70} width={16} height={14} rx={4} fill="#FFE27A" />
      {[-170, 150].map((wx) => (
        <g key={wx} transform={`translate(${wx} -24)`}>
          <circle r={42} fill="#2A2630" stroke={INK} strokeWidth={5} />
          <circle r={18} fill="#B8B4C0" />
          <g transform={`rotate(${t * 14})`}><path d="M -18 0 L 18 0 M 0 -18 L 0 18" stroke="#6E6A78" strokeWidth={4} /></g>
        </g>
      ))}
    </g>
  );
};

/** The sleepy "tomorrow" sun on a calendar sheet: eyes shut, zzz drifting, doing nothing. */
export const SleepySun: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-210} width={380} height={420} rx={22} fill="#F6EFE3" stroke={INK} strokeWidth={6} />
    <rect x={-190} y={-210} width={380} height={86} rx={22} fill="#E0644E" stroke={INK} strokeWidth={6} />
    <text y={-148} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#FFF">NGÀY MAI</text>
    <g transform={`translate(0 20) rotate(${Math.sin(t / 18) * 3})`}>
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${Math.cos(i * 0.628) * 82} ${Math.sin(i * 0.628) * 82} L ${Math.cos(i * 0.628) * 104} ${Math.sin(i * 0.628) * 104}`} stroke="#F2A93A" strokeWidth={9} strokeLinecap="round" />)}
      <circle r={72} fill="#FFD25E" stroke={INK} strokeWidth={6} />
      <path d="M -40 -6 Q -26 8 -12 -6 M 12 -6 Q 26 8 40 -6" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={30} rx={12} ry={8 + Math.sin(t / 12) * 2} fill={INK} />
    </g>
    {[0, 1, 2].map((i) => {
      const p = ((t / 50 + i / 3) % 1);
      return <text key={i} x={96 + p * 40} y={-30 - p * 110} fontFamily={FONT.hand} fontWeight={700} fontSize={36 + i * 8} fill={INK} opacity={Math.sin(p * Math.PI)}>z</text>;
    })}
  </g>
);

/** A grey storm cloud with rain and a lightning bolt that flashes at `bolt` (frames), centred on (x, y). */
export const StormCloud: React.FC<{ x: number; y: number; t: number; s?: number; bolt?: number; text?: string }> = ({ x, y, t, s = 1, bolt = -99, text }) => {
  const k = backOut(clamp(t / 10));
  const flash = t >= bolt && t < bolt + 5;
  return t < 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      {Array.from({ length: 14 }).map((_, i) => {
        const p = ((t * 0.05 + i * 0.19) % 1);
        return <path key={i} d={`M ${-150 + i * 23} ${60 + p * 190} l -6 22`} stroke="#8CB4E8" strokeWidth={5} strokeLinecap="round" opacity={0.8 * (1 - p)} />;
      })}
      <path d="M -190 40 Q -250 40 -240 -10 Q -236 -60 -176 -54 Q -170 -120 -90 -120 Q -40 -170 30 -126 Q 100 -150 140 -88 Q 230 -86 224 -10 Q 230 40 170 40 Z" fill={flash ? '#8A869C' : '#5A5870'} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M -150 14 Q -60 40 40 20" fill="none" stroke="#FFF" strokeWidth={6} opacity={0.12} strokeLinecap="round" />
      {text ? <text y={-18} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={46} fill="#E8E4F0">{text}</text> : null}
      <path d="M -20 40 L 30 40 L 4 100 L 40 100 L -30 190 L -6 118 L -40 118 Z" fill="#FFE27A" stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={flash || (t > bolt + 8 && t < bolt + 11) ? 1 : 0.0} />
    </g>
  );
};

/** Pip's seated pose on the porch bench (hip above the seat), reused by the ending shots. */
export const benchPose = (x: number, extra: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: 800 - 68 * 1.4 - 36, scale: 1.4, yaw: 0.7, facing: 1, legL: { a: 84, b: -82 }, legR: { a: 78, b: -78 }, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, ...extra });

export const SIT_SEAT_Y = 800 - 68 * 1.4 - 36 + 56;
