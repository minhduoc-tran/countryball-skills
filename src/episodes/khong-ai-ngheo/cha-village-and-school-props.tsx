import React from 'react';
import { clamp, rnd, Sun, Glow, FONT } from '../../engine';

// Chapter A props (1/4): the mountain village at dawn (terraces, stilt houses, the school), the water-carrier's pole and
// buckets, the village tap, and the glowing golden FLOOR line (the "sàn") that marks the new world. Pure functions of t.

/** The golden floor: a glowing band from x0 to x1 at y (the ground under people's feet), with light pulses running along it. */
export const GoldFloor: React.FC<{ x0: number; x1: number; y: number; t: number; id: string; th?: number; o?: number; dip?: number; dipX?: number }> = ({
  x0, x1, y, t, id, th = 14, o = 1, dip = 0, dipX = 960,
}) => {
  const d = dip > 0 ? `M ${x0} ${y} Q ${dipX} ${y + 2 * dip} ${x1} ${y}` : `M ${x0} ${y} L ${x1} ${y}`;
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id={`${id}fl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFD36B" stopOpacity={0} />
          <stop offset="0.12" stopColor="#FFD36B" />
          <stop offset="0.88" stopColor="#FFD36B" />
          <stop offset="1" stopColor="#FFD36B" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={d} stroke="#FFB93D" strokeWidth={th * 3.4} fill="none" opacity={0.2} filter="url(#blur10)" />
      <path d={d} stroke={`url(#${id}fl)`} strokeWidth={th} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#FFF4C8" strokeWidth={th * 0.3} fill="none" strokeLinecap="round" opacity={0.85} />
      {[0, 1, 2].map((i) => {
        const p = (((t * 0.012 + i / 3) % 1) + 1) % 1;
        const px = x0 + (x1 - x0) * p;
        const k = Math.sin(p * Math.PI);
        const yy = dip > 0 ? y + 2 * dip * (1 - Math.abs((px - dipX) / (x1 - x0) * 2)) * 0.5 : y;
        return <ellipse key={i} cx={px} cy={yy} rx={90} ry={th * 0.6} fill="#FFFBE0" opacity={0.55 * k} filter="url(#blur6)" />;
      })}
    </g>
  );
};

// ---------- the village ----------
const Terraces: React.FC<{ y: number; c1: string; c2: string; n: number; seed: number }> = ({ y, c1, c2, n, seed }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const yy = y + i * 34;
      const a = 30 + rnd(seed, i) * 50;
      return (
        <path key={i} d={`M -300 ${yy} Q 300 ${yy - a} 960 ${yy + a * 0.3} T 2250 ${yy - a * 0.4} L 2250 ${yy + 40} L -300 ${yy + 40} Z`} fill={i % 2 ? c1 : c2} />
      );
    })}
  </g>
);

const StiltHouse: React.FC<{ x: number; y: number; s: number; roof: string; wall: string; t: number; smoke?: boolean }> = ({ x, y, s, roof, wall, t, smoke = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={90} ry={9} fill="#000" opacity={0.22} />
    {[-62, -22, 22, 62].map((px) => <rect key={px} x={px - 4} y={-34} width={8} height={38} fill="#5A4030" />)}
    <rect x={-80} y={-110} width={160} height={78} fill={wall} stroke="#3A281C" strokeWidth={3} />
    <rect x={-22} y={-90} width={44} height={58} fill="#3A281C" />
    <rect x={40} y={-92} width={26} height={24} fill="#FFE3A0" />
    <path d="M -100 -108 L 0 -168 L 100 -108 Z" fill={roof} stroke="#3A281C" strokeWidth={3} strokeLinejoin="round" />
    {smoke ? (
      <g filter="url(#blur6)">
        {[0, 1, 2].map((i) => {
          const ph = ((t * 0.5 + i * 20) % 60) / 60;
          return <circle key={i} cx={30 + Math.sin(ph * 5 + i) * 12} cy={-170 - ph * 90} r={9 + ph * 20} fill="#F3EAE0" opacity={Math.sin(ph * Math.PI) * 0.45} />;
        })}
      </g>
    ) : null}
  </g>
);

/** The school in the village: a long yellow single-storey building with a red roof and a bell by the door (about 560 wide). */
export const VillageSchool: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={320} ry={14} fill="#000" opacity={0.25} />
    <rect x={-280} y={-190} width={560} height={190} fill="#F4D77E" stroke="#8A6A2E" strokeWidth={4} />
    <path d="M -310 -186 L -240 -250 L 240 -250 L 310 -186 Z" fill="#C9553A" stroke="#7A2E1E" strokeWidth={4} strokeLinejoin="round" />
    {[-210, -130, 130, 210].map((wx) => (
      <g key={wx}>
        <rect x={wx - 28} y={-150} width={56} height={70} fill="#7FB3C9" stroke="#8A6A2E" strokeWidth={4} />
        <path d={`M ${wx} -150 V -80 M ${wx - 28} -115 H ${wx + 28}`} stroke="#8A6A2E" strokeWidth={3} />
      </g>
    ))}
    <rect x={-52} y={-130} width={104} height={130} fill="#8A4A2E" stroke="#4A2A18" strokeWidth={4} />
    <path d={`M -52 -130 L ${-52 - 70 * open} -112 L ${-52 - 70 * open} -8 L -52 0 Z`} fill="#5A3018" opacity={open > 0 ? 1 : 0} />
    <rect x={-66} y={-232} width={132} height={40} rx={6} fill="#2F8F6A" stroke="#1B5A42" strokeWidth={3} />
    <text x={0} y={-203} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#FFF6D8" letterSpacing={2}>TRƯỜNG</text>
  </g>
);

/** The mountain village at dawn: sky, sun, three ridges, terraces, stilt houses, the school (right), the dirt path (y ~ 880). */
export const VillageBackdrop: React.FC<{ t: number; id: string; school?: boolean }> = ({ t, id, school = true }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8FB4D6" />
        <stop offset="0.5" stopColor="#F2C9A4" />
        <stop offset="1" stopColor="#FBE3B8" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1700} fill={`url(#${id}sky)`} />
    <Sun x={420} y={400} r={64} t={t} />
    <path d="M -400 520 L -60 330 L 220 470 L 560 250 L 900 480 L 1240 300 L 1560 470 L 1900 280 L 2320 520 L 2320 800 L -400 800 Z" fill="#8E9CB8" />
    <path d="M -400 600 L 100 430 L 480 580 L 900 400 L 1380 590 L 1800 440 L 2320 610 L 2320 800 L -400 800 Z" fill="#6E8AA0" />
    <Terraces y={610} c1="#86AE62" c2="#A6C277" n={5} seed={3} />
    <g filter="url(#blur6)" opacity={0.55}>
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((t * 0.5 + i * 700) % 2800) - 400} cy={560 + i * 40} rx={420} ry={26} fill="#FFF2E0" />)}
    </g>
    <StiltHouse x={250} y={800} s={0.9} roof="#9A4A32" wall="#D9B98A" t={t} />
    <StiltHouse x={780} y={780} s={0.7} roof="#7A5236" wall="#E3C79C" t={t + 20} />
    <StiltHouse x={1900} y={800} s={0.8} roof="#9A4A32" wall="#D6B284" t={t + 40} />
    {school ? <VillageSchool x={1420} y={860} s={0.95} /> : null}
    <path d="M -400 900 Q 500 840 1100 880 T 2320 860 L 2320 1300 L -400 1300 Z" fill="#B58B5C" />
    <path d="M -400 900 Q 500 840 1100 880 T 2320 860" stroke="#E8C68F" strokeWidth={6} fill="none" />
    <Glow x={420} y={420} r={600} o={0.3} />
  </g>
);

// ---------- the carrier's pole and buckets (hung from the shoulder point sx, sy; s = the girl's scale) ----------
const Bucket: React.FC<{ x: number; y: number; s: number; water?: boolean }> = ({ x, y, s, water = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -30 -6 L 30 -6 L 24 50 L -24 50 Z" fill="#6E7E92" stroke="#2C3644" strokeWidth={4} strokeLinejoin="round" />
    {water ? <ellipse cx={0} cy={-6} rx={30} ry={7} fill="#7FD0F0" stroke="#2C3644" strokeWidth={3} /> : <ellipse cx={0} cy={-6} rx={30} ry={7} fill="#3A4452" stroke="#2C3644" strokeWidth={3} />}
    <path d="M -30 8 H 28" stroke="#4E5E72" strokeWidth={3} />
    <path d="M -28 -6 Q 0 -44 28 -6" stroke="#2C3644" strokeWidth={3} fill="none" />
  </g>
);

/** A bamboo shoulder pole over the shoulder at (sx, sy) with a bucket at each end; `phase` swings the buckets. */
export const WaterPole: React.FC<{ sx: number; sy: number; s: number; phase: number; tilt?: number }> = ({ sx, sy, s, phase, tilt = 0 }) => {
  const half = 150 * s;
  const sw = Math.sin(phase) * 5;
  const rot = tilt + Math.cos(phase) * 1.8;
  return (
    <g transform={`translate(${sx} ${sy}) rotate(${rot})`}>
      {[-1, 1].map((k) => (
        <g key={k} transform={`translate(${k * half} 0) rotate(${sw * k})`}>
          <path d={`M 0 0 L 0 ${64 * s}`} stroke="#5A4630" strokeWidth={3 * s + 1} />
          <Bucket x={0} y={64 * s} s={s * 0.9} />
        </g>
      ))}
      <path d={`M ${-half - 26 * s} 4 L ${half + 26 * s} -2`} stroke="#B8943E" strokeWidth={9 * s + 2} strokeLinecap="round" />
      <path d={`M ${-half - 26 * s} 1 L ${half + 26 * s} -5`} stroke="#E8CC7A" strokeWidth={3 * s + 1} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

/** The village tap at the school gate: a standpipe with a faucet; water falls in a stream into the bucket below (t drives it). */
export const VillageTap: React.FC<{ x: number; y: number; s?: number; t: number; flow?: number }> = ({ x, y, s = 1, t, flow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={120} ry={12} fill="#000" opacity={0.3} />
    <rect x={-20} y={-300} width={40} height={300} rx={6} fill="#7E8EA2" stroke="#2C3644" strokeWidth={4} />
    <rect x={-8} y={-300} width={10} height={300} fill="#B6C4D6" opacity={0.6} />
    <path d="M 14 -270 L 80 -270 Q 100 -270 100 -250 L 100 -236" stroke="#2C3644" strokeWidth={30} fill="none" strokeLinecap="round" />
    <path d="M 14 -270 L 80 -270 Q 100 -270 100 -250 L 100 -236" stroke="#8E9EB2" strokeWidth={20} fill="none" strokeLinecap="round" />
    <rect x={-6} y={-312} width={12} height={22} rx={3} fill="#C9553A" stroke="#2C3644" strokeWidth={3} />
    {flow > 0 ? (
      <g opacity={flow}>
        <rect x={92} y={-232} width={16} height={196} rx={7} fill="#8FD8F5" opacity={0.85} />
        {Array.from({ length: 6 }).map((_, i) => {
          const ph = ((t * 0.2 + i / 6) % 1);
          return <rect key={i} x={95} y={-232 + ph * 190} width={4} height={26} rx={2} fill="#FFFFFF" opacity={0.7} />;
        })}
        <ellipse cx={100} cy={-30} rx={46 + Math.sin(t / 3) * 3} ry={9} fill="#BDEBFF" opacity={0.6} />
      </g>
    ) : null}
    <g transform="translate(100 0)">
      <Bucket x={0} y={-52} s={1.5} />
      <ellipse cx={0} cy={-62 + Math.sin(t / 3) * 1.5} rx={44} ry={9} fill="#A4E2FA" opacity={clamp(flow)} />
    </g>
  </g>
);
