import React from 'react';
import { Hero, Pose, basePose, LOOKS, clamp, backOut, rnd, FONT } from '../../engine';
import { PAL } from './kit-palette';
import { LoopIcon } from './kit-loop-clock';

// Chapter D local props for "lonely": Pip tells Mo about the loop, on the rooftop at dusk; the photo album.
//   ROOF  feet line + the two standing spots on the Rooftop set (Pip left, Mo right, facing each other).
//   roofPose(who, extra?)  standing pose at ROOF for 'pip' | 'mo' (scale 1, three-quarter toward the other).
//   <SpeechBubble x y w h t tx ty children />  a cream rounded bubble (x y = centre) with a tail to (tx, ty), pops in at t 0.
//   <WordBlocks x y t rows step? color? />  "words" as rounded bars in rows (row = list of widths), each lights up
//       `step` frames after the previous one from t 0: the same call in two bubbles = the same words in sync.
//   <LoopTalk t />  the content of Pip's bubble about the loop: the cyan loop icon + a little 06:00 clock.
//   <AlbumPhoto x y w h rot bg mo t id kind />  a printed photo (white border) of Pip and Mo; `mo` 0..1 fades Mo out
//       (cyan flakes rise, a dashed ghost outline stays where he stood). kind 0..3 picks the scene and poses.

export const ROOF = { feet: 832, pip: 790, mo: 1110 };

export const roofPose = (who: 'pip' | 'mo', extra: Partial<Pose> = {}): Pose => ({
  ...basePose,
  x: who === 'pip' ? ROOF.pip : ROOF.mo,
  y: ROOF.feet - 140,
  scale: 1,
  yaw: who === 'pip' ? 0.5 : -0.5,
  look: who === 'pip' ? 0.6 : -0.6,
  facing: who === 'pip' ? 1 : -1,
  armL: { a: 10, b: -8 },
  armR: { a: 10, b: -8 },
  ...extra,
});

export const SpeechBubble: React.FC<{ x: number; y: number; w: number; h: number; t: number; tx: number; ty: number; children?: React.ReactNode }> = ({ x, y, w, h, t, tx, ty, children }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  const bx = Math.max(x - w / 2 + 40, Math.min(x + w / 2 - 80, tx));
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <path d={`M ${bx} ${y + h / 2 - 4} L ${tx} ${ty} L ${bx + 50} ${y + h / 2 - 4} Z`} fill={PAL.paper} stroke="#14121C" strokeWidth={6} strokeLinejoin="round" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.3} fill={PAL.paper} stroke="#14121C" strokeWidth={6} />
      <path d={`M ${bx + 6} ${y + h / 2 - 3} L ${bx + 46} ${y + h / 2 - 3}`} stroke={PAL.paper} strokeWidth={8} />
      <g transform={`translate(${x} ${y})`}>{children}</g>
    </g>
  );
};

export const WordBlocks: React.FC<{ t: number; rows: number[][]; step?: number; color?: string; x?: number; y?: number }> = ({ t, rows, step = 6, color = '#2E6E8A', x = 0, y = 0 }) => {
  let k = 0;
  const rowH = 44;
  const y0 = y - ((rows.length - 1) * rowH) / 2;
  return (
    <g>
      {rows.map((row, ri) => {
        const total = row.reduce((a, b) => a + b, 0) + (row.length - 1) * 16;
        let cx = x - total / 2;
        return row.map((w, wi) => {
          const at = (k++) * step;
          const on = clamp((t - at) / 3);
          const bx = cx;
          cx += w + 16;
          return (
            <g key={`${ri}-${wi}`}>
              <rect x={bx} y={y0 + ri * rowH - 13} width={w} height={26} rx={13} fill="#C9C0AC" />
              <rect x={bx} y={y0 + ri * rowH - 13} width={w * on} height={26} rx={13} fill={color} />
            </g>
          );
        });
      })}
    </g>
  );
};

export const LoopTalk: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <LoopIcon x={-70} y={0} r={44} t={t} spin={-4} />
    <g transform="translate(60 0)">
      <rect x={-62} y={-36} width={124} height={72} rx={14} fill="#1E1A24" />
      <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill={PAL.led}>06:00</text>
    </g>
  </g>
);

const SCENES = [
  { bg: ['#F4A06A', '#7A4A6A'], ground: '#3A2A3A' }, // rooftop sunset
  { bg: ['#9FD3F0', '#5E8AB0'], ground: '#4E7350' }, // the park
  { bg: ['#5E6E86', '#3A4558'], ground: '#2A3040' }, // the rain
  { bg: ['#2A3566', '#141A33'], ground: '#1E1A2A' }, // the night market
];

export const AlbumPhoto: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; mo: number; t: number; id: string; kind: number }> = ({ x, y, w, h, rot = 0, mo, t, id, kind }) => {
  const sc = SCENES[kind % 4];
  const fig = h / 520;
  const gy = h * 0.42; // feet line inside the photo (from centre)
  const pip: Pose = { ...basePose, x: -w * 0.16, y: gy - 140 * fig, scale: fig, yaw: 0.35, expr: 'happy', armL: { a: 10, b: -8 }, armR: kind === 1 ? { a: 150, b: 10 } : { a: 40, b: 30 } };
  const moP: Pose = { ...basePose, x: w * 0.17, y: gy - 140 * fig, scale: fig, yaw: -0.35, expr: kind === 2 ? 'smug' : 'happy', armL: kind === 0 ? { a: 140, b: 20 } : { a: 40, b: 30 }, armR: { a: 10, b: -8 } };
  const o = 1 - clamp(mo);
  const head = { x: moP.x, y: moP.y - 176 * fig };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 70} rx={6} fill="#000" opacity={0.35} transform="translate(10 12)" />
      <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 70} rx={6} fill="#F4EEDF" />
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sc.bg[0]} />
          <stop offset="1" stopColor={sc.bg[1]} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={`url(#${id}g)`} />
        {kind === 0 ? <circle cx={w * 0.3} cy={-h * 0.05} r={h * 0.2} fill="#FFD9A0" /> : null}
        {kind === 2 ? Array.from({ length: 16 }).map((_, k) => <path key={k} d={`M ${-w / 2 + rnd(61, k) * w} ${-h / 2 + rnd(62, k) * h} l -6 22`} stroke="#C9D8EE" strokeWidth={3} opacity={0.6} />) : null}
        {kind === 3 ? Array.from({ length: 10 }).map((_, k) => <circle key={k} cx={-w / 2 + (k + 0.5) * (w / 10)} cy={-h * 0.36 + Math.sin(k) * 8} r={7} fill="#FFC27A" />) : null}
        <rect x={-w / 2} y={gy} width={w} height={h} fill={sc.ground} />
        <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0.5} />
        {kind === 2 ? (
          <g>
            <path d={`M ${-w * 0.02} ${-h * 0.3} L ${-w * 0.02} ${h * 0.02}`} stroke="#3A3446" strokeWidth={4} />
            <path d={`M ${-w * 0.36} ${-h * 0.3} Q ${-w * 0.3} ${-h * 0.47} 0 ${-h * 0.48} Q ${w * 0.3} ${-h * 0.47} ${w * 0.36} ${-h * 0.3} Z`} fill="#D9A441" stroke="#14121C" strokeWidth={3} />
          </g>
        ) : null}
        {/* Mo: fades out of the photo; a dashed ghost of him stays */}
        <g opacity={o}>
          <Hero look={LOOKS.mo} pose={moP} rimId="rimL" shadow={0.5} />
        </g>
        {mo > 0 ? (
          <g opacity={clamp(mo * 1.4)} fill="none" stroke={PAL.cyanSoft} strokeWidth={3} strokeDasharray="8 7">
            <circle cx={head.x} cy={head.y} r={62 * fig} />
            <path d={`M ${moP.x} ${head.y + 62 * fig} L ${moP.x} ${moP.y} M ${moP.x - 20 * fig} ${moP.y} L ${moP.x - 26 * fig} ${gy} M ${moP.x + 20 * fig} ${moP.y} L ${moP.x + 26 * fig} ${gy}`} />
          </g>
        ) : null}
        {mo > 0 && mo < 1
          ? Array.from({ length: 14 }).map((_, k) => (
              <rect key={k} x={moP.x + (rnd(71, k) - 0.5) * 120 * fig} y={moP.y - rnd(72, k) * 260 * fig - mo * 120} width={8} height={8} fill={PAL.cyan} opacity={(1 - mo) * 0.9} transform={`rotate(${k * 30 + t * 5})`} />
            ))
          : null}
      </g>
    </g>
  );
};
