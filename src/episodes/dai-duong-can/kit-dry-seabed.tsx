import React from 'react';
import { rnd, Glow } from '../../engine';
import { Fish } from '../sun-disappeared/chd-ocean-props';
import { CargoShip } from '../mot-cu-dam/chc-harbour-props';
import { PAL, mix } from './kit-palette';

// The dry ocean floor, fills 0..1920 x 1080 (under the camera group). Pure functions of t.
//   <DrySeabed id t salt={0..1} haze={0..1} dust={0..1} />   horizon y 400; the shelf (cracked ground) is y 660..1080 and
//     ends in a LIP at y 660: past it the continental slope falls away into abyss shadow (y 520..660) and a hazy far plain
//     with seamounts and the mid-ocean ridge on the horizon. salt 0 = dark cracked mud, 1 = white salt crust with blue-grey
//     cracks. haze = hot white-yellow veil over the distance. dust = blowing salt dust (streaks + specks, drift right).
//   <StrandedShip x y sc? rot? t mud? crust? />  CargoShip tilted (rot default -8), hull half sunk in a mud mound; (x, y) =
//     where the hull meets the ground (it is ~900*sc wide, 430*sc tall). Put at y 760..960 on the shelf.
//   <FishFlop x y t s? seed? />  fish lying on the ground flapping in bursts (x, y = the ground under it; ~160*s wide).
//   <Anchor x y s? rot? />  rusty anchor standing up (x, y = bottom of the arms; 300*s tall).
export const SEABED = { H: 400, LIP: 660 };

export const DrySeabed: React.FC<{ id: string; t: number; salt?: number; haze?: number; dust?: number }> = ({ id, t, salt = 0, haze = 0, dust = 0 }) => {
  const { H, LIP } = SEABED;
  const mud = (k: number) => mix(mix('#4E3F31', '#7A6548', k), mix(PAL.salt, '#EADFC8', k), salt);
  const crackCol = mix('#2B2420', PAL.crack, salt);
  const rows = 15;
  let hor = '';
  let ver = '';
  for (let j = 0; j <= rows; j++) {
    const f = Math.pow(j / rows, 1.9);
    const y = LIP + 10 + (1080 - LIP) * f;
    const cell = 46 + 250 * f;
    hor += `M -40 ${y} ` + Array.from({ length: Math.ceil(2000 / cell) + 1 }).map((_, k) => `L ${-40 + k * cell} ${y + (rnd(60 + j, k) - 0.5) * (4 + 14 * f)}`).join(' ');
    if (j < rows) {
      const y2 = LIP + 10 + (1080 - LIP) * Math.pow((j + 1) / rows, 1.9);
      for (let k = 0; k < 2000 / cell; k++) {
        const x = -40 + (k + rnd(80 + j, k) * 0.9 + (j % 2) * 0.5) * cell;
        ver += `M ${x} ${y} L ${x + (rnd(90 + j, k) - 0.5) * cell * 0.5} ${y2} `;
      }
    }
  }
  const ridge = (y0: number, amp: number, seed: number, step: number) => {
    let d = `M -60 ${H + 8} L -60 ${y0}`;
    for (let x = -60; x <= 1980; x += step) d += ` L ${x} ${y0 - Math.abs(Math.sin(x * 0.006 + seed)) * amp - rnd(seed, x / step) * amp * 0.4}`;
    return d + ` L 1980 ${H + 8} Z`;
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6CBDEB" /><stop offset="0.65" stopColor="#CFE8F2" /><stop offset="1" stopColor="#F8EDCF" />
        </linearGradient>
        <linearGradient id={`${id}gnd`} gradientUnits="userSpaceOnUse" x1="0" y1={LIP} x2="0" y2="1080">
          <stop offset="0" stopColor={mud(1)} /><stop offset="1" stopColor={mud(0)} />
        </linearGradient>
        <linearGradient id={`${id}slope`} gradientUnits="userSpaceOnUse" x1="0" y1={LIP} x2="0" y2="500">
          <stop offset="0" stopColor={PAL.abyssDeep} /><stop offset="0.45" stopColor={mix(PAL.abyssTop, '#CDBB96', salt * 0.5)} /><stop offset="1" stopColor={mix('#B9A27E', '#E9E2D2', salt)} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${id}far`} gradientUnits="userSpaceOnUse" x1="0" y1={H} x2="0" y2="520">
          <stop offset="0" stopColor={mix('#E0CFA6', '#F1EBDD', salt)} /><stop offset="1" stopColor={mix('#B49C74', '#E4DCCB', salt)} />
        </linearGradient>
        <linearGradient id={`${id}edge`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F8EDCF" stopOpacity="0.9" /><stop offset="1" stopColor="#F8EDCF" stopOpacity="0" /></linearGradient>
        <linearGradient id={`${id}veil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4D6" stopOpacity="0" /><stop offset="0.5" stopColor="#FFF4D6" stopOpacity="0.8" /><stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={-100} y={-100} width={2120} height={H + 120} fill={`url(#${id}sky)`} />
      <Glow x={1380} y={150} r={560} o={0.6} />
      <circle cx={1380} cy={150} r={70} fill="#FFFDEB" />
      {/* far plain, ridges, seamounts */}
      <rect x={-100} y={H} width={2120} height={130} fill={`url(#${id}far)`} />
      <rect x={-100} y={H - 4} width={2120} height={34} fill={`url(#${id}edge)`} />
      <path d={ridge(H - 6, 70, 2, 90)} fill={mix('#A99F8E', '#D8D6D0', salt)} opacity={0.85} />
      <path d={ridge(H + 6, 42, 5, 70)} fill={mix('#9C8B70', '#CFCBC0', salt)} opacity={0.9} />
      {[330, 1160, 1580].map((x, i) => <path key={x} d={`M ${x - 150} 540 L ${x - 30} ${470 - i * 6} L ${x + 20} ${468 - i * 6} L ${x + 160} 540 Z`} fill={mix('#85745A', '#C9C4B8', salt)} opacity={0.75} />)}
      {/* the slope falling away in shadow, then the lip and the shelf */}
      <rect x={-100} y={500} width={2120} height={LIP - 500 + 6} fill={`url(#${id}slope)`} />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${rnd(70, i) * 1900} ${LIP - 4} l ${20 + rnd(71, i) * 50} ${-30 - rnd(72, i) * 80}`} stroke={PAL.abyssDeep} strokeWidth={10 + rnd(73, i) * 14} strokeLinecap="round" opacity={0.35} />)}
      <path d={`M -100 ${LIP + 6} ` + Array.from({ length: 36 }).map((_, i) => `L ${-100 + i * 60} ${LIP + (rnd(75, i) - 0.5) * 12}`).join(' ') + ' L 2100 1100 L -100 1100 Z'} fill={`url(#${id}gnd)`} />
      <path d={`M -100 ${LIP + 6} ` + Array.from({ length: 36 }).map((_, i) => `L ${-100 + i * 60} ${LIP + (rnd(75, i) - 0.5) * 12}`).join(' ')} stroke={mix('#D8C49A', '#FFFFFF', salt)} strokeWidth={5} fill="none" opacity={0.8} />
      <path d={hor} stroke={crackCol} strokeWidth={2.4} fill="none" opacity={0.35 + 0.5 * salt} strokeLinejoin="round" />
      <path d={ver} stroke={crackCol} strokeWidth={2.4} fill="none" opacity={0.3 + 0.5 * salt} />
      {Array.from({ length: 26 }).map((_, i) => {
        const f = Math.pow(rnd(100, i), 1.4);
        const y = LIP + 30 + (1080 - LIP - 30) * f;
        return <ellipse key={i} cx={rnd(101, i) * 1920} cy={y} rx={20 + f * 130} ry={3 + f * 16} fill={i % 2 ? '#FFFFFF' : '#2B2420'} opacity={i % 2 ? 0.45 * salt : 0.22 * (1 - salt)} />;
      })}
      {salt > 0.2 ? Array.from({ length: 18 }).map((_, i) => {
        const f = Math.pow(rnd(110, i), 1.3);
        return <rect key={i} x={rnd(111, i) * 1900} y={LIP + 20 + f * (1080 - LIP - 40)} width={6 + f * 10} height={2 + f * 3} fill="#FFFFFF" opacity={Math.max(0, Math.sin(t / 6 + i * 2.7)) * 0.9 * salt} />;
      }) : null}
      <rect x={-100} y={H - 40} width={2120} height={300} fill={`url(#${id}veil)`} opacity={0.35 + 0.6 * haze} />
      {haze > 0 ? <rect x={-100} y={-100} width={2120} height={1280} fill="#FFF1CC" opacity={0.2 * haze} /> : null}
      {dust > 0 ? (
        <g opacity={dust}>
          {Array.from({ length: 16 }).map((_, i) => {
            const y = 430 + rnd(120, i) * 600;
            const w = 240 + rnd(121, i) * 420;
            const x = ((rnd(122, i) * 2600 + t * (6 + rnd(123, i) * 9)) % 2700) - 400;
            return <ellipse key={i} cx={x} cy={y} rx={w} ry={8 + (y - 400) * 0.05} fill="#FBF8F0" opacity={0.2 + 0.18 * rnd(124, i)} />;
          })}
          {Array.from({ length: 60 }).map((_, i) => {
            const x = ((rnd(130, i) * 2400 + t * (10 + rnd(131, i) * 14)) % 2400) - 240;
            return <circle key={i} cx={x} cy={450 + rnd(132, i) * 600 + Math.sin(t / 8 + i) * 6} r={2 + rnd(133, i) * 4} fill="#FFFFFF" opacity={0.6} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** A CargoShip tilted in a mud mound. */
export const StrandedShip: React.FC<{ x: number; y: number; sc?: number; rot?: number; t: number; mud?: string; crust?: number }> = ({ x, y, sc = 0.8, rot = -8, t, mud = '#4E3F31', crust = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={18 * sc} rx={560 * sc} ry={28 * sc} fill="#000" opacity={0.28} />
    <g transform={`rotate(${rot} 0 ${-60 * sc})`}>
      <CargoShip x={0} y={4 * sc} sc={sc} t={t} />
      {crust > 0 ? Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={(-380 + rnd(140, i) * 800) * sc} cy={(-110 + rnd(141, i) * 120) * sc} rx={(20 + rnd(142, i) * 40) * sc} ry={(5 + rnd(143, i) * 8) * sc} fill={PAL.salt} opacity={0.7 * crust} />) : null}
    </g>
    <path d={`M ${-540 * sc} ${30 * sc} Q ${-460 * sc} ${-40 * sc} ${-300 * sc} ${-70 * sc} Q ${-60 * sc} ${-92 * sc} ${150 * sc} ${-70 * sc} Q ${400 * sc} ${-64 * sc} ${520 * sc} ${30 * sc} Q 0 ${120 * sc} ${-540 * sc} ${30 * sc} Z`} fill={mud} stroke={PAL.ink} strokeWidth={4} />
    <path d={`M ${-440 * sc} ${-10 * sc} Q ${-250 * sc} ${-66 * sc} ${-40 * sc} ${-62 * sc}`} stroke="#8A7556" strokeWidth={5} fill="none" opacity={0.7} strokeLinecap="round" />
    {[-380, -120, 200, 410].map((cx, i) => <ellipse key={i} cx={cx * sc} cy={(-20 + (i % 2) * 16) * sc} rx={34 * sc} ry={9 * sc} fill="#6B5A44" opacity={0.7} />)}
  </g>
);

/** A fish lying on the ground, flapping in bursts. */
export const FishFlop: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number }> = ({ x, y, t, s = 1, seed = 1 }) => {
  const ph = (t * 0.07 + seed * 0.37) % 1;
  const on = ph < 0.55;
  const hop = on ? Math.pow(Math.sin((ph / 0.55) * Math.PI), 2) : 0;
  const rot = on ? Math.sin(t * 0.85 + seed * 3) * 22 : Math.sin(t * 0.3 + seed) * 2;
  const col = ['#FF9A4A', '#7FB6D9', '#C9D2D9', '#E86A6A'][Math.floor(seed) % 4];
  return (
    <g>
      <ellipse cx={x} cy={y + 4} rx={(70 - hop * 20) * s} ry={(10 - hop * 3) * s} fill="#000" opacity={0.28 - hop * 0.1} />
      <g transform={`translate(${x} ${y - 28 * s - hop * 46 * s}) rotate(${rot}) ${seed % 2 < 1 ? '' : 'scale(-1 1)'}`}>
        <Fish x={0} y={0} s={s * 0.9} t={t * (on ? 2.4 : 0.6) + seed * 9} color={col} />
      </g>
    </g>
  );
};

/** A rusty anchor with a salt crust on its flukes. */
export const Anchor: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={12} fill="#000" opacity={0.28} />
    <g stroke="#3A1F12" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 0 -20 L 0 -270" fill="none" stroke="#8A4B2A" strokeWidth={22} />
      <path d="M -60 -230 L 60 -230" fill="none" stroke="#7A3F22" strokeWidth={16} />
      <circle cx={0} cy={-290} r={26} fill="none" stroke="#9A5430" strokeWidth={12} />
      <path d="M -110 -80 Q -100 0 0 0 Q 100 0 110 -80 Q 70 -30 20 -48 L -20 -48 Q -70 -30 -110 -80 Z" fill="#8A4B2A" />
      <path d="M -126 -92 L -92 -62 L -112 -50 Z M 126 -92 L 92 -62 L 112 -50 Z" fill="#A85A2F" />
    </g>
    {[[-3, -200], [4, -120], [-4, -60], [-80, -30], [78, -34], [40, -10]].map(([px, py], i) => <ellipse key={i} cx={px} cy={py} rx={9} ry={5} fill={i % 2 ? '#C4743A' : '#F4F1EA'} opacity={0.75} />)}
  </g>
);
