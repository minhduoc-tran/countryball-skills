import React from 'react';
import { rnd, clamp, easeOut, backOut, FONT, Glow } from '../../engine';
import { PAL } from './kit-palette';

// Chapter D props (1/4): sky, steam, rain, the boiling pot, the thermometer and the air-conditioner.
// All pure functions of the frame counters they are given.

const INK = '#14121A';

/** A puffy cloud centred at (x, y), about 300*s wide. `o` opacity, `col` body colour. */
export const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; col?: string; shade?: string }> = ({ x, y, s = 1, o = 1, col = '#FFFFFF', shade = '#C9DDEB' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -150 40 Q -190 40 -184 6 Q -176 -26 -138 -22 Q -128 -70 -78 -64 Q -50 -108 0 -92 Q 52 -100 70 -56 Q 118 -70 132 -22 Q 184 -20 180 14 Q 178 42 140 40 Z" fill={col} />
    <path d="M -150 40 Q -190 40 -184 6 Q -176 -10 -150 12 Q -60 28 40 22 Q 120 22 176 4 Q 178 42 140 40 Z" fill={shade} opacity={0.75} />
  </g>
);

/** Falling rain streaks across x0..x1 from y0 to y1; `dens` 0..1 how many of the n streaks fall. */
export const Rain: React.FC<{ x0: number; x1: number; y0: number; y1: number; t: number; n?: number; dens?: number; col?: string; seed?: number }> = ({ x0, x1, y0, y1, t, n = 46, dens = 1, col = '#8FD0F5', seed = 3 }) => (
  <g stroke={col} strokeWidth={5} strokeLinecap="round" opacity={0.9}>
    {Array.from({ length: n }).map((_, i) => {
      if (i / n >= dens) return null;
      const sp = 0.035 + rnd(seed, i) * 0.02;
      const ph = (rnd(seed + 1, i) + t * sp) % 1;
      const x = x0 + rnd(seed + 2, i) * (x1 - x0) - ph * 30;
      const y = y0 + ph * (y1 - y0);
      return <path key={i} d={`M ${x} ${y} l -6 26`} />;
    })}
  </g>
);

/** Soft sky gradient rect covering the frame between y -100 and h. */
export const SkyBand: React.FC<{ id: string; top: string; bottom: string; h?: number }> = ({ id, top, bottom, h = 1180 }) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient></defs>
    <rect x={-100} y={-100} width={2120} height={h + 100} fill={`url(#${id})`} />
  </g>
);

/** Wavy blue sea surface strip from x0..x1, top at y, filling down to y + depth. */
export const SeaStrip: React.FC<{ id: string; x0: number; x1: number; y: number; depth?: number; t: number }> = ({ id, x0, x1, y, depth = 400, t }) => {
  const top = Array.from({ length: Math.ceil((x1 - x0) / 40) + 1 }).map((_, i) => `L ${x0 + i * 40} ${y + Math.sin(i * 0.9 + t * 0.18) * 7}`).join(' ');
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PAL.seaTop} /><stop offset="1" stopColor={PAL.seaDeep} /></linearGradient></defs>
      <path d={`M ${x0} ${y + depth} ${top} L ${x1} ${y + depth} Z`} fill={`url(#${id})`} />
      <path d={`M ${x0} ${y} ${top}`} stroke="#BFE6FA" strokeWidth={5} fill="none" />
    </g>
  );
};

/** Steam curl rising from (x, y): `n` wisps drifting up and fading. */
export const Steam: React.FC<{ x: number; y: number; t: number; n?: number; h?: number; col?: string; w?: number }> = ({ x, y, t, n = 5, h = 420, col = '#FFFFFF', w = 14 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = (i / n + t * 0.012) % 1;
      const yy = y - ph * h;
      const xx = x + (i - n / 2) * 34 + Math.sin(ph * 7 + i) * 26;
      return <path key={i} d={`M ${xx} ${yy} q 22 -26 0 -52 q -22 -26 0 -52`} stroke={col} strokeWidth={w * (1 - ph * 0.5)} fill="none" strokeLinecap="round" opacity={0.75 * Math.sin(ph * Math.PI)} />;
    })}
  </g>
);

/** The ocean as a giant pot: cut-away pot full of sea, the sun as the burner underneath, steam curling off the top. */
export const BoilPot: React.FC<{ x: number; y: number; s?: number; t: number; label?: boolean }> = ({ x, y, s = 1, t, label = true }) => {
  const bubbles = Array.from({ length: 12 }).map((_, i) => {
    const ph = (rnd(8, i) + t * (0.02 + rnd(9, i) * 0.02)) % 1;
    return { x: -300 + rnd(10, i) * 600, y: 70 - ph * 200, r: 8 + rnd(11, i) * 16, o: Math.sin(ph * Math.PI) };
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* the sun under the pot */}
      <g transform="translate(0 330)">
        <Glow x={0} y={0} r={420} o={0.8} />
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2 + t * 0.01;
          return <path key={i} d={`M ${Math.cos(a) * 170} ${Math.sin(a) * 170} L ${Math.cos(a) * (240 + (i % 2) * 40)} ${Math.sin(a) * (240 + (i % 2) * 40)}`} stroke="#FFC24A" strokeWidth={16} strokeLinecap="round" />;
        })}
        <circle r={150} fill="#FFD84A" stroke="#E8921E" strokeWidth={8} />
      </g>
      {/* pot body */}
      <path d="M -380 -140 L -380 150 Q -380 250 -280 250 L 280 250 Q 380 250 380 150 L 380 -140 Z" fill="#7C8794" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <clipPath id="chdPotClip"><path d="M -380 -140 L -380 150 Q -380 250 -280 250 L 280 250 Q 380 250 380 150 L 380 -140 Z" /></clipPath>
      <g clipPath="url(#chdPotClip)">
        <path d={`M -400 -70 ` + Array.from({ length: 21 }).map((_, i) => `L ${-400 + i * 40} ${-70 + Math.sin(i * 1.1 + t * 0.35) * 9}`).join(' ') + ' L 400 300 L -400 300 Z'} fill={PAL.seaTop} />
        <rect x={-400} y={120} width={800} height={160} fill={PAL.seaDeep} opacity={0.55} />
        {bubbles.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#D8F1FF" opacity={0.7 * b.o} />)}
        <rect x={-380} y={-140} width={46} height={400} fill="#FFFFFF" opacity={0.14} />
      </g>
      {/* rim, handles */}
      <rect x={-402} y={-162} width={804} height={36} rx={18} fill="#A5B0BC" stroke={INK} strokeWidth={8} />
      <path d="M -382 -60 q -84 0 -84 60 q 0 52 84 52 M 382 -60 q 84 0 84 60 q 0 52 -84 52" stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M -382 -60 q -84 0 -84 60 q 0 52 84 52 M 382 -60 q 84 0 84 60 q 0 52 -84 52" stroke="#5B6672" strokeWidth={10} fill="none" strokeLinecap="round" />
      {label ? <text y={198} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={60} fill="#F6EFE3" letterSpacing={6}>ĐẠI DƯƠNG</text> : null}
      <g transform="translate(0 -170)"><Steam x={0} y={0} t={t} n={7} h={460} /></g>
    </g>
  );
};

/** A tall thermometer: glass tube + bulb, mercury at `level` 0..1 (red when hot, blue when cold), no numerals. */
export const Thermo: React.FC<{ x: number; y: number; s?: number; level: number; cold?: boolean; wob?: number }> = ({ x, y, s = 1, level, cold = false, wob = 0 }) => {
  const col = cold ? '#4FA8FF' : '#F2452F';
  const top = 330 - clamp(level) * 600; // mercury top in local coordinates (y grows down, bulb at 330)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-46} y={-330} width={92} height={660} rx={46} fill="#F6EFE3" stroke={INK} strokeWidth={8} opacity={0.95} />
      <circle cy={350} r={88} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
      <rect x={-46} y={300} width={92} height={60} fill="#F6EFE3" />
      <rect x={-18} y={top + wob} width={36} height={330 - top - wob} rx={10} fill={col} />
      <circle cy={350} r={62} fill={col} />
      {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M ${i % 2 ? 52 : 62} ${-260 + i * 52} L 84 ${-260 + i * 52}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />)}
      <rect x={-30} y={-312} width={14} height={500} rx={7} fill="#FFFFFF" opacity={0.6} />
    </g>
  );
};

/** A wall air-conditioner (split unit) with a wave logo. `on` 1 -> 0 powers it down: display, fan louvre and logo go dark. */
export const ACUnit: React.FC<{ x: number; y: number; s?: number; on: number; t: number }> = ({ x, y, s = 1, on, t }) => {
  const lit = on > 0.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-460} y={-150} width={920} height={300} rx={46} fill="#F2F5F8" stroke={INK} strokeWidth={8} />
      <rect x={-460} y={-150} width={920} height={110} rx={46} fill="#FFFFFF" opacity={0.7} />
      {/* logo: a wave in a blue disc, dims when off */}
      <circle cx={-340} cy={-40} r={52} fill={lit ? PAL.seaTop : '#8C97A3'} />
      <path d="M -372 -40 q 16 -22 32 0 t 32 0" stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* display */}
      <rect x={270} y={-76} width={150} height={64} rx={14} fill="#1B2430" />
      <text x={345} y={-26} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill={lit ? '#5BE0FF' : '#FF5A4A'} opacity={lit ? 1 : 0.5 + 0.5 * (Math.floor(t / 8) % 2)}>{lit ? '18°' : 'OFF'}</text>
      {/* louvre: open when on, shut when off */}
      <path d={`M -400 90 L 400 90 L 400 ${120 + 34 * on} L -400 ${120 + 34 * on} Z`} fill="#CFD6DD" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

/** Cool air streaming out of the AC (cyan curves, flowing), strength `k` 0..1. */
export const ColdAir: React.FC<{ x: number; y: number; t: number; k: number }> = ({ x, y, t, k }) => (
  <g opacity={k} fill="none" stroke="#8FE3FF" strokeWidth={9} strokeLinecap="round">
    {Array.from({ length: 9 }).map((_, i) => {
      const ph = (rnd(21, i) + t * 0.025) % 1;
      const xx = x - 360 + i * 90 + Math.sin(ph * 6 + i) * 18;
      return <path key={i} d={`M ${xx} ${y + ph * 340} q 14 30 0 60`} opacity={Math.sin(ph * Math.PI)} />;
    })}
  </g>
);

/** Sweat drops flying off a head at (x, y). */
export const Sweat: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.045 + i / 3) % 1;
      const dir = i === 1 ? 0 : i - 1;
      return <path key={i} transform={`translate(${x + dir * 70 * s * (0.4 + ph)} ${y - 40 * s + ph * 90 * s}) scale(${s})`} d="M 0 -16 Q 12 4 0 14 Q -12 4 0 -16 Z" fill="#9AD8FF" stroke="#2E86C1" strokeWidth={3} opacity={Math.sin(ph * Math.PI)} />;
    })}
  </g>
);

/** Pop-in pill label (mono face), anchored at its centre. */
export const Pill: React.FC<{ x: number; y: number; t: number; text: string; size?: number; col?: string; bg?: string }> = ({ x, y, t, text, size = 52, col = '#F6EFE3', bg = '#0B0816' }) => {
  if (t < 0) return null;
  const w = text.length * size * 0.62 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 7))})`} opacity={easeOut(clamp(t / 3))}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.7} rx={size * 0.85} fill={bg} opacity={0.82} />
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.7} rx={size * 0.85} fill="none" stroke={col} strokeWidth={3} opacity={0.7} />
      <text y={size * 0.3} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={col} letterSpacing={2}>{text}</text>
    </g>
  );
};
