import React from 'react';
import { kf, clamp, easeOut, camT, Schematic, SchLabel, ShotProps, rnd, Foreground } from '../../engine';
import { DrySeabed, StrandedShip } from './kit-dry-seabed';
import { BigNum } from './kit-hud';
import { SaltPile, SaltTank, RiceField } from './chc-salt-props';

// Chapter C, beat "6 salt" part 1 (154.8-164.6 s): C24 salt grains pour, C25 water drains from a basin and the salt stays, C26 the seabed
// turns white, C27 "~60 M" layer, C28 wind lifts the salt dust, C29 rice fields turn white.

// ---------- C24: "và còn muối nữa": grains pour onto a heap under a spotlight, glints ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <defs><radialGradient id="c24g" cx="0.5" cy="0.55" r="0.7"><stop offset="0" stopColor="#4A3F5C" /><stop offset="1" stopColor="#0B0816" /></radialGradient></defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill="url(#c24g)" />
    <path d="M 760 -100 L 1160 -100 L 1500 1100 L 420 1100 Z" fill="#FFFFFF" opacity={0.07} />
    {Array.from({ length: 34 }).map((_, i) => {
      const ph = ((t * 0.045 + rnd(1, i)) % 1);
      return <rect key={i} x={900 + rnd(2, i) * 120 + Math.sin(ph * 9 + i) * 14} y={-40 + ph * 760} width={9 + rnd(3, i) * 7} height={9 + rnd(3, i) * 7} fill="#F4F1EA" opacity={0.95} transform={`rotate(${ph * 300 + i * 40} ${900 + rnd(2, i) * 120} ${-40 + ph * 760})`} />;
    })}
    <SaltPile x={960} y={930} s={2.8} t={t} n={150} />
    <rect x={-200} y={920} width={2320} height={300} fill="#1B1626" opacity={0.0} />
  </g>
);

// ---------- C25: a basin drains; the water goes, the white salt layer stays on the bottom ----------
export const C25: React.FC<ShotProps> = ({ t, len }) => {
  const water = 1 - easeOut(clamp((t - 8) / 40));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="c25sch" />
      <SaltTank x={460} y={220} w={1000} h={640} water={water} t={t} />
      <rect x={1452} y={820} width={190} height={26} fill="#2E86C1" opacity={water > 0.02 ? 0.9 : 0} />
      {water > 0.02 ? <rect x={1620} y={820} width={26} height={((t * 14) % 240) + 40} fill="#2E86C1" opacity={0.85} /> : null}
      <SchLabel x={620} y={170} t={t - 2} text="NƯỚC" size={64} color="#7FD4FF" />
      <SchLabel x={960} y={950} t={t - 52} text="MUỐI" size={72} color="#F4F1EA" />
    </g>
  );
};

// ---------- C26: salt spreads over the whole seabed: dark mud turns white ----------
export const C26: React.FC<ShotProps> = ({ t, len }) => {
  const salt = easeOut(clamp(t / 46));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), kf(t, [[0, 720], [len, 640]]), kf(t, [[0, 1.12], [len, 1.0]]))}>
      <DrySeabed id="c26s" t={t} salt={salt} haze={0.4} />
      <StrandedShip x={560} y={900} sc={0.7} rot={-7} t={t} crust={salt} />
      <StrandedShip x={1480} y={780} sc={0.4} rot={6} t={t} crust={salt} />
    </g>
  );
};

// ---------- C27: "~60 M": a thick white salt layer over dark rock, a bracket marks its depth ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp(t / 22));
  const top = 960 - 110 * g;
  return (
    <BigNum t={t} len={len} id="c27n" text="~60 M" caption="LỚP MUỐI DƯỚI ĐÁY BIỂN" size={300}>
      <rect x={0} y={960} width={1920} height={120} fill="#3B4B66" />
      <path d={`M 0 ${top + 6} ` + Array.from({ length: 33 }).map((_, k) => `L ${k * 60} ${top + (k % 2 ? -8 : 4) + rnd(5, k) * 6}`).join(' ') + ' L 1920 1080 L 0 1080 Z'} fill="#F4F1EA" stroke="#C9D2DA" strokeWidth={4} />
      <path d={`M 1740 ${top} H 1790 M 1740 960 H 1790 M 1766 ${top + 6} V 954`} stroke="#FF8A3D" strokeWidth={7} strokeLinecap="round" opacity={g} />
    </BigNum>
  );
};

// ---------- C28: wind lifts the salt dust off the seabed and carries it inland ----------
export const C28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 780], [len, 1080]]), 690, 1.15)}>
    <DrySeabed id="c28s" t={t} salt={1} haze={0.25} dust={1} />
    <StrandedShip x={820} y={880} sc={0.55} rot={-6} t={t} crust={1} />
    {Array.from({ length: 5 }).map((_, i) => {
      const ph = (t / 40 + i * 0.21) % 1;
      const x = 300 + ph * 1900 + i * 70;
      return (
        <g key={i} opacity={0.8 * Math.sin(Math.PI * ph)}>
          {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={x - k * 62} cy={800 - k * 8 - i * 70 - Math.sin(t / 7 + k) * 10} r={(46 + k * 12) * (0.8 + i * 0.12)} fill="#FBF8F0" stroke="#D5CDB8" strokeWidth={4} />)}
        </g>
      );
    })}
    {Array.from({ length: 12 }).map((_, i) => {
      const ph = (t / 26 + rnd(21, i)) % 1;
      const y = 380 + rnd(22, i) * 640;
      return <path key={i} d={`M ${-100 + ph * 2600 - 260} ${y} q 130 -30 260 0`} stroke="#FFFFFF" strokeWidth={7 + rnd(23, i) * 8} fill="none" strokeLinecap="round" opacity={0.6 * Math.sin(Math.PI * ph)} />;
    })}
    <Foreground blur={10}>
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((t * 22 + i * 800) % 2600) - 300} cy={900 + i * 40} rx={420} ry={110} fill="#EDE5D2" opacity={0.4} />)}
    </Foreground>
  </g>
);

// ---------- C29: the white dust settles and the green rice fields turn white from the left ----------
export const C29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 700, kf(t, [[0, 1.05], [len, 1.22]]))}>
    <RiceField id="c29r" t={t} white={easeOut(clamp(t / 40))} dust={1} />
    <g transform="translate(1480 640)">
      <rect x={-110} y={-120} width={220} height={120} fill="#B9936A" stroke="#14121A" strokeWidth={6} />
      <path d="M -150 -112 L 0 -210 L 150 -112 Z" fill="#8A6A3E" stroke="#14121A" strokeWidth={6} strokeLinejoin="round" />
      <rect x={-30} y={-84} width={60} height={84} fill="#5A3A22" stroke="#14121A" strokeWidth={4} />
      <ellipse cx={0} cy={6} rx={170} ry={14} fill="#000" opacity={0.2} />
    </g>
  </g>
);
