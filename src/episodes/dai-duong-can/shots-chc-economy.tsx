import React from 'react';
import { kf, clamp, easeOut, camT, Schematic, SCH, DrawOn, shake, settle, ShotProps, rnd } from '../../engine';
import { DrySeabed, StrandedShip } from './kit-dry-seabed';
import { BigNum } from './kit-hud';
import { PortScene } from './chc-port-scene';
import { PriceTag } from './chc-food-econ-props';

// Chapter C, beat "5 economy" (137.7-149.99 s): C13 falling chart, C14 80%, C15 shipping lanes, C16 a ship slams onto the seabed (look sec1),
// C17 a fleet stranded, C18 cargo badges pop on the dead port (fuel, grain, phones), C19 padlock shuts, C20 price tags climb.
// (Mum at the fish counter: shots-chc-fish-counter.tsx.)

// ---------- C13: "nền kinh tế": a chart line falls, coins drop ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="c13sch" />
    <path d="M 300 200 V 820 H 1640" stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" />
    {[320, 460, 600, 740].map((y) => <path key={y} d={`M 300 ${y} H 1640`} stroke={SCH.dim} strokeWidth={2} opacity={0.4} />)}
    <DrawOn d="M 340 280 L 520 350 L 620 300 L 840 470 L 940 420 L 1150 620 L 1260 570 L 1400 700 L 1560 770" t={t} dur={30} color="#FF5A4A" width={18} />
    {t > 28 ? <path d="M 1560 770 l -52 -18 l 34 -44 z" fill="#FF5A4A" transform={`translate(${Math.sin(t) * 2} 0)`} /> : null}
    {[0, 1, 2, 3, 4].map((i) => {
      const y = ((t * 14 + i * 190) % 1000) - 100;
      return <g key={i} transform={`translate(${1480 + (i % 3) * 70} ${y})`} opacity={0.9}><circle r={32} fill="#F4C542" stroke="#14121A" strokeWidth={5} /><circle r={18} fill="none" stroke="#C9971A" strokeWidth={4} /></g>;
    })}
  </g>
);

// ---------- C14: 80% ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => <BigNum t={t} len={len} id="c14n" text="80%" caption="HÀNG HÓA THẾ GIỚI" size={340} />;

// ---------- C15: shipping lanes: ships glide along arcs between ports ----------
const PORTS: [number, number][] = [[260, 700], [560, 360], [960, 640], [1380, 330], [1680, 720], [820, 250]];
const LANES: [number, number, number, number, number, number][] = [
  [260, 700, 400, 380, 560, 360], [560, 360, 780, 560, 960, 640], [960, 640, 1240, 420, 1380, 330], [960, 640, 1400, 880, 1680, 720], [260, 700, 640, 960, 960, 640], [560, 360, 700, 220, 820, 250],
];
const bez = (L: number[], u: number) => {
  const [x0, y0, cx, cy, x1, y1] = L;
  const a = 1 - u;
  return { x: a * a * x0 + 2 * a * u * cx + u * u * x1, y: a * a * y0 + 2 * a * u * cy + u * u * y1, dx: 2 * a * (cx - x0) + 2 * u * (x1 - cx), dy: 2 * a * (cy - y0) + 2 * u * (y1 - cy) };
};
export const C15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t} id="c15sch" />
    {LANES.map((L, i) => <path key={i} d={`M ${L[0]} ${L[1]} Q ${L[2]} ${L[3]} ${L[4]} ${L[5]}`} stroke={SCH.dim} strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round" fill="none" />)}
    {PORTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={18} fill={SCH.live} stroke="#FFF3DC" strokeWidth={5} />)}
    {LANES.map((L, i) => [0, 1].map((k) => {
      const p = bez(L, ((t * (0.012 + i * 0.002) + k * 0.5 + i * 0.13) % 1));
      const ang = (Math.atan2(p.dy, p.dx) * 180) / Math.PI;
      return (
        <g key={`${i}-${k}`} transform={`translate(${p.x} ${p.y}) rotate(${Math.abs(ang) > 90 ? ang + 180 : ang})`}>
          <path d="M -44 -6 H 44 L 30 18 H -34 Z" fill={SCH.line} stroke="#101A2A" strokeWidth={3} />
          <rect x={-30} y={-24} width={14} height={18} fill={SCH.live} /><rect x={-14} y={-22} width={14} height={16} fill="#7FC4E8" /><rect x={2} y={-24} width={14} height={18} fill={SCH.live} />
        </g>
      );
    }))}
  </g>
);

// ---------- C16: "chỉ sau một giây": a cargo ship slams onto the seabed mud ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => {
  const ph = clamp(t / 6);
  const y = 900 - 900 * (1 - ph * ph) + (t > 6 ? settle(t - 6, 14, 1.3, 5) : 0);
  const sh = shake(t, 6, 12, 16);
  const dust = clamp((t - 6) / 24);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(960, 640, kf(t, [[0, 1.0], [len, 1.1]]))}`}>
      <DrySeabed id="c16s" t={t} haze={0.4} />
      <StrandedShip x={960} y={Math.min(y, 905)} sc={0.82} rot={t > 6 ? -8 * easeOut(clamp((t - 6) / 8)) : 0} t={t} />
      {dust > 0 ? [-1, 1].map((d) => Array.from({ length: 5 }).map((_, i) => <circle key={`${d}${i}`} cx={960 + d * (260 + dust * 420 + i * 40)} cy={900 - dust * 70 - i * 16} r={(34 + i * 14) * (0.6 + dust)} fill="#D9C8A2" opacity={0.55 * (1 - dust)} />)) : null}
    </g>
  );
};

// ---------- C17: a whole fleet lies stranded across the seabed, camera drifting along it ----------
const FLEET: [number, number, number, number][] = [
  [300, 690, 0.24, -9], [880, 700, 0.27, 7], [1500, 690, 0.25, -6],
  [140, 770, 0.42, 8], [680, 790, 0.45, -10], [1200, 775, 0.43, 6], [1780, 780, 0.44, -8],
  [520, 960, 0.78, -7], [1430, 965, 0.8, 9],
];
export const C17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 1080]]), 700, kf(t, [[0, 1.05], [len, 1.12]]))}>
    <DrySeabed id="c17s" t={t} haze={0.5} />
    {FLEET.map(([x, y, sc, rot], i) => <StrandedShip key={i} x={x} y={y} sc={sc} rot={rot} t={t + i * 7} />)}
  </g>
);

// ---------- C18: the dead port; badges pop on for fuel (145.44), grain (146.30), phones (146.97) ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 640, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <PortScene id="c18" t={t} pops={[3, 29, 49]} />
  </g>
);

// ---------- C19: "tất cả kẹt lại": a padlock slams shut on the cargo ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 9, 10, 12);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(960, 700, kf(t, [[0, 1.2], [len, 1.45]]))}`}>
      <PortScene id="c19" t={t + 50} pops={[0, 0, 0]} lock={clamp(t / 10)} />
    </g>
  );
};

// ---------- C20: price tags climb ----------
export const C20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <defs><radialGradient id="c20g" cx="0.5" cy="0.6" r="0.8"><stop offset="0" stopColor="#7A1F1A" /><stop offset="1" stopColor="#1B0B0D" /></radialGradient></defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill="url(#c20g)" />
    <path d="M 760 700 L 960 440 L 1160 700 M 760 900 L 960 640 L 1160 900" stroke="#F4C542" strokeWidth={46} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.28 + 0.12 * Math.sin(t / 3)} />
    {Array.from({ length: 9 }).map((_, i) => {
      const y = 1250 - ((t * 15 + i * 190) % 1500);
      const x = 240 + ((i * 397) % 1500) + rnd(9, i) * 100;
      return <PriceTag key={i} x={x} y={y} n={1 + (i % 3)} s={0.8 + rnd(10, i) * 0.7} t={t} rot={-14 + rnd(11, i) * 28} bump={(t - i) / 6} />;
    })}
  </g>
);
