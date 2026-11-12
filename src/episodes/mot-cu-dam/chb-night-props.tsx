import React from 'react';
import { FONT, Hero, LOOKS, Pose, poseAt, rnd, clamp, easeOut, backOut, NightSky, Stars, Moon } from '../../engine';

// Chapter B local props for the night street and the morning-after: rooftops for the cockroach's flight,
// a phone filming (REC), a tile showing Pip's face (TV / phone feed).
//   <Rooftops t id x0 x1 />                 night sky, moon, far skyline and 3 blocks of houses (block centres: BLOCKS)
//   <RecPhone x y w t at rot? />            phone seen from the back-front: its screen shows the live view + "● REC"
//   <PipFaceTile x y w h t? />              a screen rectangle with Pip's face on a warm panel (clipped)

const INK = '#12101C';
export const BLOCKS = [1350, 2250, 3150]; // x centres of the three rows of houses
export const SKY_H = 1000; // roof base line

const House: React.FC<{ x: number; w: number; h: number; k: number; tint: string; lit: number }> = ({ x, w, h, k, tint, lit }) => (
  <g>
    <rect x={x} y={SKY_H - h} width={w} height={h} fill={tint} stroke={INK} strokeWidth={6} />
    <polygon points={`${x - 10},${SKY_H - h} ${x + w / 2},${SKY_H - h - 70} ${x + w + 10},${SKY_H - h}`} fill="#3A2F52" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[0, 1].map((r) => [0, 1].map((c) => {
      const on = rnd(k * 7 + r, c + lit) > 0.4;
      return <rect key={`${r}${c}`} x={x + 22 + c * (w / 2 - 6)} y={SKY_H - h + 36 + r * 90} width={w / 2 - 38} height={56} rx={5} fill={on ? '#FFD98A' : '#1E1A32'} stroke={INK} strokeWidth={4} opacity={on ? 0.95 : 0.9} />;
    }))}
  </g>
);

export const Rooftops: React.FC<{ t: number; id: string; x0?: number; x1?: number }> = ({ t, id, x0 = -400, x1 = 4000 }) => (
  <g>
    <NightSky id={`${id}ns`} x0={x0} y0={-400} w={x1 - x0} h={1900} horizonY={760} />
    <Stars seed={9} x0={x0} y0={-300} w={x1 - x0} h={700} t={t} n={90} />
    <Moon x={2000} y={130} r={70} />
    {/* far skyline */}
    {Array.from({ length: 34 }).map((_, i) => {
      const h = 140 + rnd(3, i) * 230;
      return <rect key={i} x={x0 + i * 135} y={SKY_H - h - 40} width={118} height={h + 40} fill="#241C44" stroke="#18122E" strokeWidth={4} />;
    })}
    {/* three blocks of houses */}
    {BLOCKS.map((cx, b) =>
      [0, 1, 2, 3].map((i) => {
        const w = 150 + rnd(b * 5 + 1, i) * 40;
        const h = 190 + rnd(b * 5 + 2, i) * 150;
        const x = cx - 380 + i * 195;
        return <House key={`${b}${i}`} x={x} w={w} h={h} k={b * 4 + i} tint={['#4A3C70', '#3A3060', '#54447A'][(b + i) % 3]} lit={b} />;
      }),
    )}
    <rect x={x0} y={SKY_H} width={x1 - x0} height={400} fill="#120E22" />
  </g>
);

/** A phone held up filming: screen faces the camera, showing a dark view lit blue, a blinking red "● REC" and corner brackets. `at` = frame it pops up. */
export const RecPhone: React.FC<{ x: number; y: number; w?: number; t: number; at?: number; rot?: number }> = ({ x, y, w = 120, t, at = 0, rot = 0 }) => {
  const h0 = t - at;
  if (h0 < 0) return null;
  const pop = h0 < 6 ? backOut(clamp(h0 / 6)) : 1;
  const h = w * 1.9;
  const s = w / 120;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${pop})`}>
      <circle cx={0} cy={0} r={w * 1.1} fill="#5AB8FF" opacity={0.18} style={{ mixBlendMode: 'screen' }} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill="#0E0D14" stroke="#3A3846" strokeWidth={4 * s} />
      <rect x={-w / 2 + 7 * s} y={-h / 2 + 7 * s} width={w - 14 * s} height={h - 14 * s} rx={w * 0.1} fill="#27406A" />
      <ellipse cx={0} cy={h * 0.1} rx={w * 0.28} ry={w * 0.15} fill="#8A4A22" />
      <circle cx={-w * 0.12} cy={h * 0.02} r={w * 0.05} fill="#FFFFFF" opacity={0.7} />
      <circle cx={-w / 2 + 22 * s} cy={-h / 2 + 24 * s} r={6 * s} fill="#FF3B3B" opacity={h0 % 30 < 18 ? 1 : 0.2} />
      <text x={-w / 2 + 34 * s} y={-h / 2 + 31 * s} fontFamily={FONT.ui} fontSize={17 * s} fill="#FFFFFF" fontWeight={700}>REC</text>
    </g>
  );
};

/** A screen showing Pip's face: warm panel, the hero's head clipped to it. (x, y) = centre. */
export const PipFaceTile: React.FC<{ x: number; y: number; w: number; h: number; id: string; expr?: Pose['expr']; tint?: string }> = ({ x, y, w, h, id, expr = 'cool', tint = '#F2B84B' }) => {
  const sc = h / 150;
  const pose = poseAt(0, [{ f: 0, p: { x, y: y + h * 0.5 + 176 * sc * 0.28, scale: sc, yaw: 0, facing: 1, expr } }]);
  return (
    <g>
      <defs><clipPath id={`${id}c`}><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={Math.min(w, h) * 0.06} /></clipPath></defs>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={Math.min(w, h) * 0.06} fill={tint} />
      <g clipPath={`url(#${id}c)`}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h * 0.4} fill="#FFFFFF" opacity={0.12} />
        <Hero look={LOOKS.pipHood} pose={pose} shadow={0} rimId="rimR" />
      </g>
    </g>
  );
};
export const popIn = (t: number, at: number, len = 7) => (t < at ? 0 : backOut(clamp((t - at) / len)));
export const ease = easeOut;
