import React from 'react';
import { clamp, easeOut, backOut, rnd, FONT, Glow } from '../../engine';
import { PAL } from './kit-palette';

// Chapter B props, the lottery (B6-B15). Generic, no real logos. Pure functions of t. x, y = CENTRE unless said.
//   NUMS                          the six winning numbers (the same on the TV, in the memory and on the ticket)
//   <Ball x y r n c? />           a numbered lottery ball
//   <DrawScreen t id mode reveal? />  the TV picture in a 1000 x 560 box: 'drum' (MEGA 6/45 studio, 18:00 THỨ TƯ, the drum
//       tumbling, `reveal` balls already out in the tray), 'result' (the six balls big in a row), 'jackpot' ("≥ 12 TỶ ĐỒNG")
//   <TvFrame x y w id children />  a flat TV (bezel + stand) whose screen shows children drawn in the 1000 x 560 box; x y =
//       screen centre, w = screen width
//   <ThoughtBubble x y w h t />    a cloud bubble that pops in from t = 0 with two little puffs toward (x - w/2, y + h/2)
//   <LotteryStall x y s t />       a street lottery cart: red body, "XỔ SỐ" board, tickets fanned under glass; x y = ground
//   <Confetti t seed n x0 x1 y0 />  paper confetti falling (screen or world space)
//   <PartyHat x y s rot />         a cone hat, x y = its base centre

export const NUMS = [5, 12, 19, 27, 33, 41];
const BALL_C = ['#E8553E', '#F2B33D', '#3E8C86', '#5C7CFA', '#C8382E', '#8A6AC9'];

export const Ball: React.FC<{ x: number; y: number; r: number; n: number; c?: string }> = ({ x, y, r, n, c = '#F2B33D' }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={c} stroke="#1D1A24" strokeWidth={r * 0.08} />
    <circle r={r * 0.62} fill="#FFF8EA" />
    <text y={r * 0.26} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={r * 0.72} fill="#1D1A24">{String(n).padStart(2, '0')}</text>
    <path d={`M ${-r * 0.6} ${-r * 0.5} Q ${-r * 0.2} ${-r * 0.95} ${r * 0.35} ${-r * 0.8}`} stroke="#FFFFFF" strokeWidth={r * 0.12} fill="none" opacity={0.55} strokeLinecap="round" />
  </g>
);

export const DrawScreen: React.FC<{ t: number; id: string; mode: 'drum' | 'result' | 'jackpot'; reveal?: number }> = ({ t, id, mode, reveal = 0 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}bg`} cx="50%" cy="35%" r="75%">
        <stop offset="0" stopColor={mode === 'jackpot' ? '#7A3A12' : '#2C3E86'} />
        <stop offset="1" stopColor={mode === 'jackpot' ? '#2A0E08' : '#0E1636'} />
      </radialGradient>
      <clipPath id={`${id}clip`}><rect width={1000} height={560} /></clipPath>
    </defs>
    <g clipPath={`url(#${id}clip)`}>
      <rect width={1000} height={560} fill={`url(#${id}bg)`} />
      {/* studio light rays */}
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + t * (mode === 'jackpot' ? 0.03 : 0.008);
        return <path key={i} d={`M 500 ${mode === 'jackpot' ? 300 : 120} L ${500 + Math.cos(a) * 900} ${300 + Math.sin(a) * 900} L ${500 + Math.cos(a + 0.18) * 900} ${300 + Math.sin(a + 0.18) * 900} Z`} fill={mode === 'jackpot' ? '#FFD34A' : '#6A86E0'} opacity={mode === 'jackpot' ? 0.16 : 0.08} />;
      })}
      {mode === 'drum' ? (
        <g>
          {/* the drum: a clear sphere with balls tumbling round */}
          <circle cx={500} cy={250} r={158} fill="#BFD6FF" opacity={0.12} stroke="#DDE8FF" strokeWidth={6} />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = rnd(51, i) * 6.28 + t * (0.18 + rnd(52, i) * 0.12);
            const rr = 40 + rnd(53, i) * 95;
            return <Ball key={i} x={500 + Math.cos(a) * rr} y={262 + Math.sin(a) * rr * 0.8} r={22} n={1 + Math.floor(rnd(54, i) * 45)} c={BALL_C[i % 6]} />;
          })}
          <path d="M 380 140 Q 500 90 620 140" stroke="#FFFFFF" strokeWidth={8} opacity={0.35} fill="none" strokeLinecap="round" />
          <rect x={470} y={404} width={60} height={40} fill="#3A4A7A" />
          {/* the tray: the balls drawn so far */}
          <rect x={150} y={440} width={700} height={92} rx={46} fill="#0B1226" opacity={0.85} stroke="#F2C14E" strokeWidth={4} />
          {NUMS.map((n, i) => (i < reveal ? <g key={i} transform={`translate(${210 + i * 116} 486) scale(${backOut(clamp(reveal - i))})`}><Ball x={0} y={0} r={38} n={n} c={BALL_C[i]} /></g> : <circle key={i} cx={210 + i * 116} cy={486} r={34} fill="#1E2A4E" />))}
        </g>
      ) : null}
      {mode === 'result' ? (
        <g>
          <text x={500} y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3" letterSpacing={4}>KẾT QUẢ</text>
          {NUMS.map((n, i) => <Ball key={i} x={500 + (i - 2.5) * 146} y={310} r={62} n={n} c={BALL_C[i]} />)}
        </g>
      ) : null}
      {mode === 'jackpot' ? (
        <g>
          <Glow x={500} y={300} r={420} o={0.7} />
          <text x={500} y={170} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFE27A" letterSpacing={6} stroke="#5A1A08" strokeWidth={6} paintOrder="stroke">JACKPOT</text>
          <g transform={`translate(500 340) scale(${0.85 + 0.15 * backOut(clamp(t / 8))})`}>
            <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={128} fill="#FFFFFF" stroke="#5A1A08" strokeWidth={8} paintOrder="stroke">≥ 12 TỶ</text>
          </g>
          <text x={500} y={470} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#FFE27A" letterSpacing={8}>ĐỒNG</text>
          {Array.from({ length: 14 }).map((_, i) => {
            const y = ((rnd(55, i) * 560 + t * (6 + rnd(56, i) * 6)) % 600) - 20;
            return <ellipse key={i} cx={rnd(57, i) * 1000} cy={y} rx={14} ry={9} fill="#F2C14E" stroke="#8A5A12" strokeWidth={3} />;
          })}
        </g>
      ) : null}
      {mode !== 'jackpot' ? (
        <g>
          <rect x={26} y={22} width={330} height={74} rx={14} fill="#C8382E" />
          <text x={191} y={77} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#FFF6E2" letterSpacing={2}>MEGA 6/45</text>
          <rect x={660} y={26} width={314} height={66} rx={33} fill="#0B1226" opacity={0.85} />
          <circle cx={696} cy={59} r={10} fill="#FF5A48" opacity={Math.floor(t / 12) % 2 ? 0.4 : 1} />
          <text x={950} y={76} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#F6EFE3">18:00 THỨ TƯ</text>
        </g>
      ) : null}
      {Array.from({ length: 28 }).map((_, i) => <rect key={i} x={0} y={i * 20 + (t % 20)} width={1000} height={2} fill="#000" opacity={0.07} />)}
    </g>
  </g>
);

export const TvFrame: React.FC<{ x: number; y: number; w: number; id: string; children: React.ReactNode; stand?: boolean }> = ({ x, y, w, id, children, stand = true }) => {
  const k = w / 1000;
  const h = 560 * k;
  return (
    <g>
      {stand ? <path d={`M ${x - w * 0.08} ${y + h / 2} L ${x - w * 0.12} ${y + h / 2 + 50 * k} L ${x + w * 0.12} ${y + h / 2 + 50 * k} L ${x + w * 0.08} ${y + h / 2} Z`} fill="#1A1A22" /> : null}
      <rect x={x - w / 2 - 22 * k} y={y - h / 2 - 22 * k} width={w + 44 * k} height={h + 44 * k} rx={18 * k} fill="#16161C" stroke="#0A0A0E" strokeWidth={4} />
      <g transform={`translate(${x - w / 2} ${y - h / 2}) scale(${k})`} key={id}>{children}</g>
      <rect x={x - w / 2 - 22 * k} y={y - h / 2 - 22 * k} width={w + 44 * k} height={8 * k} rx={4} fill="#FFFFFF" opacity={0.08} />
    </g>
  );
};

export const ThoughtBubble: React.FC<{ x: number; y: number; w: number; h: number; t: number; children?: React.ReactNode }> = ({ x, y, w, h, t, children }) => {
  const p = backOut(clamp(t / 9));
  if (t < 0) return null;
  const bumps = 10;
  const d = Array.from({ length: bumps }).map((_, i) => {
    const a0 = (i / bumps) * Math.PI * 2;
    const a1 = ((i + 1) / bumps) * Math.PI * 2;
    const mid = (a0 + a1) / 2;
    const p0 = `${x + Math.cos(a0) * w / 2} ${y + Math.sin(a0) * h / 2}`;
    const c = `${x + Math.cos(mid) * w * 0.62} ${y + Math.sin(mid) * h * 0.62}`;
    const p1 = `${x + Math.cos(a1) * w / 2} ${y + Math.sin(a1) * h / 2}`;
    return `${i === 0 ? `M ${p0}` : ''} Q ${c} ${p1}`;
  }).join(' ');
  return (
    <g transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}>
      <circle cx={x - w * 0.42} cy={y + h * 0.62} r={w * 0.035} fill="#F6EFE3" stroke="#1D2033" strokeWidth={4} />
      <circle cx={x - w * 0.33} cy={y + h * 0.5} r={w * 0.055} fill="#F6EFE3" stroke="#1D2033" strokeWidth={4} />
      <path d={`${d} Z`} fill="#F6EFE3" stroke="#1D2033" strokeWidth={6} />
      {children}
    </g>
  );
};

export const LotteryStall: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={230} ry={18} fill="#000" opacity={0.4} />
    {/* legs, the red cart body, the glass top with tickets fanned under it */}
    {[-180, 180].map((dx) => <rect key={dx} x={dx - 8} y={-120} width={16} height={120} fill="#2A1E1C" />)}
    {[-170, 170].map((dx) => <circle key={`w${dx}`} cx={dx} cy={-14} r={16} fill="#1A1820" stroke="#5A5262" strokeWidth={4} />)}
    <rect x={-210} y={-260} width={420} height={160} rx={10} fill="#B8342E" stroke="#4A1410" strokeWidth={5} />
    <rect x={-210} y={-260} width={420} height={14} fill="#F2C14E" />
    <rect x={-196} y={-226} width={392} height={110} rx={6} fill="#7A1E1A" />
    <text x={0} y={-150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFE27A" letterSpacing={4}>XỔ SỐ</text>
    <path d="M -224 -262 L 224 -262 L 204 -300 L -204 -300 Z" fill="#BFD6FF" opacity={0.45} stroke="#E6F0FF" strokeWidth={3} />
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={i} transform={`translate(${-170 + i * 48} -282) rotate(${-8 + i * 2})`}>
        <rect x={-22} y={-12} width={44} height={24} rx={3} fill={i % 2 ? '#FFF6E2' : '#F7E2C8'} stroke="#7A4A12" strokeWidth={2} />
        <rect x={-22} y={-12} width={44} height={8} fill="#C8382E" />
      </g>
    ))}
    {/* the board on a pole, with the umbrella edge above */}
    <rect x={196} y={-470} width={12} height={220} fill="#2A1E1C" />
    <path d={`M -40 -470 Q 200 ${-560 + Math.sin(t / 12) * 4} 440 -470 Z`} fill="#2F8F8A" stroke="#14403E" strokeWidth={4} />
    <path d="M -40 -470 Q 200 -500 440 -470" stroke="#FFE2B0" strokeWidth={3} opacity={0.5} fill="none" />
    <path d="M -210 -246 L 210 -246" stroke="#FFE2B0" strokeWidth={3} opacity={0.5} />
  </g>
);

const CONF_C = ['#F2B33D', '#E8553E', '#5CE1E6', '#8A6AC9', '#5BE08A', '#F6EFE3'];
export const Confetti: React.FC<{ t: number; seed?: number; n?: number; x0?: number; x1?: number; y0?: number; h?: number; s?: number }> = ({ t, seed = 1, n = 60, x0 = 0, x1 = 1920, y0 = -40, h = 1160, s = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 5 + rnd(seed + 1, i) * 7;
      const y = y0 + ((rnd(seed + 2, i) * h + t * sp) % h);
      const x = x0 + rnd(seed + 3, i) * (x1 - x0) + Math.sin(t / 8 + i) * 24;
      const flip = Math.abs(Math.cos(t / 5 + i));
      return <rect key={i} x={-9 * s} y={-5 * s} width={18 * s} height={10 * s} fill={CONF_C[i % CONF_C.length]} transform={`translate(${x} ${y}) rotate(${rnd(seed + 4, i) * 360 + t * 6}) scale(1 ${0.25 + 0.75 * flip})`} />;
    })}
  </g>
);

export const PartyHat: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -42 0 L 0 -110 L 42 0 Z" fill="#8A6AC9" stroke="#1D1A24" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -28 -36 L 24 -50 M -16 -70 L 14 -78 M -36 -14 L 36 -24" stroke="#F2B33D" strokeWidth={7} />
    <circle cx={0} cy={-116} r={14} fill="#E8553E" stroke="#1D1A24" strokeWidth={4} />
  </g>
);

/** A dark living-room wall at dusk around the TV: a window on the left, a floor lamp, a plant (screen space). */
export const LivingWall: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A3466" />
        <stop offset="0.6" stopColor="#C46A6A" />
        <stop offset="1" stopColor="#F2A65A" />
      </linearGradient>
    </defs>
    <rect x={-20} y={-20} width={1960} height={1120} fill="#3A2E3E" />
    <rect x={-20} y={860} width={1960} height={240} fill="#2A2028" />
    <path d="M -20 860 H 1940" stroke="#4A3A44" strokeWidth={6} />
    {/* the window at dusk */}
    <rect x={70} y={170} width={300} height={420} fill={`url(#${id}sky)`} />
    <circle cx={250} cy={520} r={46} fill="#FFD9A0" opacity={0.9} />
    <path d="M 70 520 L 120 470 L 160 500 L 220 440 L 280 490 L 370 450 L 370 590 L 70 590 Z" fill="#2A2238" />
    <rect x={60} y={160} width={320} height={440} fill="none" stroke="#1E1824" strokeWidth={16} />
    <path d="M 220 160 V 600 M 60 360 H 380" stroke="#1E1824" strokeWidth={10} />
    <Glow x={220} y={420} r={360} o={0.45} />
    {/* the floor lamp on the right */}
    <path d="M 1760 860 L 1760 420" stroke="#1A1620" strokeWidth={10} />
    <ellipse cx={1760} cy={862} rx={50} ry={10} fill="#1A1620" />
    <path d="M 1700 420 L 1820 420 L 1790 340 L 1730 340 Z" fill="#F2D2A0" stroke="#1A1620" strokeWidth={4} />
    <Glow x={1760} y={420} r={420} o={0.6 + 0.03 * Math.sin(t / 7)} />
    {/* a plant */}
    <path d="M 1560 860 L 1580 790 L 1640 790 L 1660 860 Z" fill={PAL.terracotta} />
    {[-50, -20, 10, 40].map((dx, i) => <path key={i} d={`M 1610 790 Q ${1610 + dx} ${700 - i * 10} ${1610 + dx * 1.6} ${660 - (i % 2) * 30}`} stroke={PAL.leaf} strokeWidth={14} fill="none" strokeLinecap="round" />)}
  </g>
);
