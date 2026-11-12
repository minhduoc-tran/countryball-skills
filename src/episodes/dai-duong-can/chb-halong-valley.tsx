import React from 'react';
import { rnd, Glow } from '../../engine';
import { PAL, mix } from './kit-palette';

// Chapter B (2/4): Hạ Long Bay with the water gone. Fills 0..1920 x 1080 (draw under the camera group). Pure function of t.
//   <HaLongValley id t boats? />   horizon y 520, dry cracked valley floor below it. Three tower layers (far hazy, mid, near big
//     limestone karst with green caps and a dark stain band where the waterline was), stranded junk boats with batwing sails.
//   <JunkBoat x y s? rot? />       (x, y) = where the hull rests on the mud; ~230*s wide.
//   <KarstTower x base w h seed ... />  one tower, base centred at x.
export const HL = { H: 520 };

export const KarstTower: React.FC<{ x: number; base: number; w: number; h: number; seed: number; haze?: number; stain?: number }> = ({ x, base, w, h, seed, haze = 0, stain = 0.18 }) => {
  const l = x - w / 2;
  const r = x + w / 2;
  // jagged top: left edge climbs concave, a rounded irregular crown, right edge drops straighter
  const crown = [0.34, 0.2, 0.08, -0.04, -0.2, -0.34].map((u, i) => [x + u * w, base - h * (0.9 + (i % 2) * 0.1 + rnd(seed, i) * 0.06)] as [number, number]);
  const body = `M ${l} ${base} Q ${l + w * 0.06} ${base - h * 0.45} ${x - w * 0.36} ${base - h * 0.78} ` + crown.reverse().map(([px, py]) => `L ${px} ${py}`).join(' ') + ` Q ${r - w * 0.04} ${base - h * 0.5} ${r} ${base} Z`;
  const lit = mix('#D8D0BC', '#C9D2D6', haze);
  const shade = mix('#9C927E', '#B4BEC6', haze);
  const stainC = mix('#7A6B55', '#A9B3B8', haze);
  const id = `kt${Math.round(x)}${Math.round(base)}${seed}`;
  return (
    <g>
      <defs>
        <clipPath id={id}><path d={body} /></clipPath>
      </defs>
      <ellipse cx={x} cy={base + 4} rx={w * 0.7} ry={Math.max(6, w * 0.07)} fill="#000" opacity={0.22 * (1 - haze)} />
      <path d={body} fill={lit} />
      <g clipPath={`url(#${id})`}>
        <rect x={x + w * 0.05} y={base - h - 10} width={w} height={h + 20} fill={shade} opacity={0.75} />
        {[0.2, 0.4, 0.6, 0.8].map((u, i) => <path key={i} d={`M ${l + w * u} ${base} Q ${l + w * (u + 0.05)} ${base - h * 0.5} ${l + w * (u - 0.02) + w * 0.1} ${base - h}`} stroke={shade} strokeWidth={Math.max(2, w * 0.016)} fill="none" opacity={0.55} />)}
        <rect x={l} y={base - h * stain} width={w} height={h * stain} fill={stainC} opacity={0.75} />
        <rect x={l} y={base - h * stain - 4} width={w} height={5} fill={mix('#5B5040', '#9AA6AC', haze)} opacity={0.8} />
        {haze > 0 ? <rect x={l} y={base - h} width={w} height={h} fill="#F3ECD8" opacity={haze * 0.5} /> : null}
      </g>
      <path d={body} fill="none" stroke={mix(PAL.ink, '#8E9AA2', haze)} strokeWidth={Math.max(2, w * 0.014)} strokeLinejoin="round" opacity={0.8} />
      {/* green tufts on the crown */}
      {crown.map(([px, py], i) => <ellipse key={i} cx={px} cy={py + w * 0.015} rx={w * 0.075} ry={w * 0.045} fill={mix('#4E8A52', '#9DB8A2', haze)} stroke={mix('#2C5A33', '#8FA79A', haze)} strokeWidth={Math.max(1.5, w * 0.008)} />)}
    </g>
  );
};

export const JunkBoat: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={150} ry={15} fill="#000" opacity={0.3} />
    <path d="M -110 -34 L 120 -34 Q 134 -34 140 -52 L 112 0 L -90 0 Q -118 -8 -110 -34 Z" fill="#6B3E26" stroke={PAL.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -108 -34 L 120 -34 L 126 -42 L -112 -42 Z" fill="#8F5A36" stroke={PAL.ink} strokeWidth={3} />
    <rect x={-30} y={-72} width={52} height={32} rx={5} fill="#C9A66B" stroke={PAL.ink} strokeWidth={3.5} />
    <path d="M 0 -42 L 0 -190" stroke="#4A2E1A" strokeWidth={7} strokeLinecap="round" />
    <path d="M 0 -186 Q 70 -170 96 -92 L 74 -54 L 0 -64 Z" fill="#B24A2E" stroke={PAL.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 0 -150 L 82 -138 M 0 -112 L 88 -108 M 0 -78 L 80 -76" stroke="#7A2E1C" strokeWidth={3.5} />
  </g>
);

export const HaLongValley: React.FC<{ id: string; t: number; boats?: boolean }> = ({ id, t, boats = true }) => {
  const H = HL.H;
  const farT = [90, 250, 380, 560, 700, 820, 980, 1110, 1260, 1390, 1520, 1650, 1790, 1900];
  const midT = [150, 470, 760, 1050, 1330, 1620, 1860];
  const crack = (rows: number) => {
    let d = '';
    for (let j = 0; j < rows; j++) {
      const f = Math.pow((j + 1) / rows, 1.8);
      const y = H + 14 + (1080 - H) * f;
      const cell = 60 + 220 * f;
      d += `M -40 ${y} ` + Array.from({ length: Math.ceil(2000 / cell) + 1 }).map((_, k) => `L ${-40 + k * cell} ${y + (rnd(200 + j, k) - 0.5) * (4 + 12 * f)}`).join(' ') + ' ';
      for (let k = 0; k < 2000 / cell; k++) d += `M ${-40 + (k + rnd(220 + j, k)) * cell} ${y} l ${(rnd(240 + j, k) - 0.5) * cell * 0.4} ${(1080 - H) * 0.09 * (0.4 + f)} `;
    }
    return d;
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7CC3EC" /><stop offset="0.7" stopColor="#D6EBF1" /><stop offset="1" stopColor="#F8EDCF" /></linearGradient>
        <linearGradient id={`${id}gnd`} gradientUnits="userSpaceOnUse" x1="0" y1={H} x2="0" y2="1080"><stop offset="0" stopColor="#E3CE9F" /><stop offset="1" stopColor="#9A8560" /></linearGradient>
        <linearGradient id={`${id}hz`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4D6" stopOpacity="0" /><stop offset="0.6" stopColor="#FFF4D6" stopOpacity="0.8" /><stop offset="1" stopColor="#FFF4D6" stopOpacity="0" /></linearGradient>
      </defs>
      <rect x={-100} y={-100} width={2120} height={H + 110} fill={`url(#${id}sky)`} />
      <Glow x={1500} y={130} r={540} o={0.6} />
      <circle cx={1500} cy={130} r={66} fill="#FFFDEB" />
      <rect x={-100} y={H} width={2120} height={1100} fill={`url(#${id}gnd)`} />
      {farT.map((x, i) => <KarstTower key={`f${i}`} x={x} base={H + 6} w={90 + rnd(1, i) * 60} h={150 + rnd(2, i) * 130} seed={10 + i} haze={0.62} />)}
      <rect x={-100} y={H - 80} width={2120} height={110} fill={`url(#${id}hz)`} opacity={0.8} />
      {midT.map((x, i) => <KarstTower key={`m${i}`} x={x + rnd(3, i) * 40} base={H + 70 + (i % 3) * 14} w={190 + rnd(4, i) * 90} h={300 + rnd(5, i) * 170} seed={30 + i} haze={0.22} />)}
      <path d={crack(14)} stroke="#6E5C42" strokeWidth={2.4} fill="none" opacity={0.5} strokeLinejoin="round" />
      {Array.from({ length: 18 }).map((_, i) => {
        const f = Math.pow(rnd(260, i), 1.4);
        return <ellipse key={i} cx={rnd(261, i) * 1920} cy={H + 40 + f * 520} rx={30 + f * 150} ry={4 + f * 15} fill={i % 2 ? '#FFFFFF' : '#5B4B3A'} opacity={i % 2 ? 0.18 : 0.14} />;
      })}
      {boats ? (
        <g>
          <JunkBoat x={560} y={800} s={0.7} rot={-6} />
          <JunkBoat x={1400} y={900} s={0.95} rot={7} />
          <JunkBoat x={1010} y={700} s={0.42} rot={-3} />
        </g>
      ) : null}
      {/* near giants framing the left and right edges */}
      <KarstTower x={-30} base={1000} w={470} h={820} seed={50} stain={0.16} />
      <KarstTower x={1900} base={1010} w={420} h={740} seed={52} stain={0.16} />
      <KarstTower x={1040} base={880} w={300} h={560} seed={55} stain={0.17} />
      {/* heat shimmer */}
      {Array.from({ length: 5 }).map((_, i) => {
        const y = H + 24 + i * 38;
        const d = 'M 0 ' + y + Array.from({ length: 33 }).map((__, k) => ` L ${k * 60} ${y + Math.sin(k * 0.8 + t * 0.14 + i * 1.7) * 4}`).join('');
        return <path key={i} d={d} stroke="#FFF1D0" strokeWidth={3} fill="none" opacity={0.22 - i * 0.03} />;
      })}
    </g>
  );
};
