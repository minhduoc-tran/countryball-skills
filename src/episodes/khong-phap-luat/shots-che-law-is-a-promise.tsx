import React from 'react';
import { kf, clamp, easeOut, easeIn, backOut, camT, Glow, FONT, Sparkle, Dust, rnd, settle, ShotProps } from '../../engine';
import { ArmIn, Pencil, Eraser } from './che-hands-and-sleeves';
import { LawBook, PinkyPromise, Thread } from './che-law-book-and-board-props';
import { Tiny, SHIRTS, SKINS } from './che-tiny-people';

// Chapter E, "7 insight" first half (236.5-246.8 s), look "peace": E10 a law book falls from the sky and is crossed out,
// E11 many hands write the law together, E12 a good rule ticked and a silly one crossed, E13 eraser and pencil fix a rule,
// E14 a pinky promise, E15 a city of tiny people each holding a glowing thread.

const LINE = '#2A1E24';

// ---------- E10: the book drops out of a cloud over the rooftops, bounces, a red cross stamps on it ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeIn(clamp(t / 30));
  const by = -240 + 1000 * fall + settle(t - 30, 26, 1.4, 4);
  const x = 960 + 40 * Math.sin(t / 6) * (1 - fall);
  const cross = backOut(clamp((t - 32) / 6));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <defs><linearGradient id="e10sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5C8FD6" /><stop offset="1" stopColor="#F9D9A8" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e10sky)" />
      <path d="M 700 -100 L 1220 -100 L 1060 600 L 860 600 Z" fill="#FFF4C8" opacity={0.28} style={{ mixBlendMode: 'screen' }} />
      {[[300, 90, 1.2], [960, 40, 1.6], [1560, 120, 1.1]].map(([cx, cy, k], i) => (
        <g key={i} transform={`translate(${cx + Math.sin(t / 30 + i) * 8} ${cy}) scale(${k})`} fill="#FFFFFF" opacity={0.95}>
          <ellipse cx={0} cy={0} rx={150} ry={54} /><ellipse cx={-80} cy={20} rx={90} ry={44} /><ellipse cx={90} cy={22} rx={100} ry={46} />
        </g>
      ))}
      {Array.from({ length: 9 }).map((_, i) => {
        const hx = 80 + i * 220, h = 130 + rnd(3, i) * 90;
        return (
          <g key={i}>
            <rect x={hx} y={900 - h} width={170} height={h + 300} fill={['#EBD6A6', '#E8B79A', '#C9D8B0'][i % 3]} stroke={LINE} strokeWidth={5} />
            <path d={`M ${hx - 14} ${900 - h} L ${hx + 85} ${900 - h - 70} L ${hx + 184} ${900 - h} Z`} fill="#B8603E" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
            <rect x={hx + 62} y={900 - h + 40} width={46} height={56} fill="#7FC8E0" stroke={LINE} strokeWidth={4} />
          </g>
        );
      })}
      <LawBook x={x} y={by} s={1.5} rot={kf(t, [[0, -18], [30, 14], [len, 6]])} />
      <g transform={`translate(960 640) scale(${cross})`} opacity={clamp(cross * 2)}>
        <path d="M -150 -150 L 150 150 M 150 -150 L -150 150" stroke="#C8202F" strokeWidth={46} strokeLinecap="round" />
        <path d="M -150 -150 L 150 150 M 150 -150 L -150 150" stroke="#FF5A48" strokeWidth={26} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- E11: five hands, five sleeves, one sheet of paper: everybody writes the law together (wobbly lines) ----------
const WRITERS = [
  { row: -240, side: -1, color: '#2E2B3D' }, { row: -120, side: 1, color: '#7A8A4A' }, { row: 0, side: -1, color: '#C9707A' },
  { row: 120, side: 1, color: '#3E8C86' }, { row: 240, side: -1, color: '#7E6A93' },
];
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const W = 1000, H = 760;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <defs><linearGradient id="e11bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B8854E" /><stop offset="1" stopColor="#7A5230" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e11bg)" />
      <Glow x={960} y={500} r={900} o={0.4} />
      <g transform="translate(960 560) rotate(-2)">
        <rect x={-W / 2 + 14} y={-H / 2 + 18} width={W} height={H} rx={10} fill="#000" opacity={0.25} />
        <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={10} fill="#FBF3DE" stroke={LINE} strokeWidth={6} />
        {WRITERS.map((w, i) => {
          const q = clamp((t - 2 - i * 2) / (len - 8));
          const N = 26, m = Math.floor(q * N);
          const x0 = w.side === -1 ? -W / 2 + 60 : W / 2 - 60, dx = (w.side === -1 ? 1 : -1) * (W - 140) / N;
          const pts = Array.from({ length: m + 1 }).map((_, k) => `${x0 + dx * k},${w.row + Math.sin(k * 1.1 + i) * 16 + (k % 3) * 4}`);
          return <polyline key={i} points={pts.join(' ')} fill="none" stroke={['#3A3A4A', '#5A6A2A', '#B04A5A', '#2A7A74', '#6A5A9A'][i]} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />;
        })}
      </g>
      {WRITERS.map((w, i) => {
        const q = clamp((t - 2 - i * 2) / (len - 8));
        const N = 26;
        const k = q * N;
        const x0 = w.side === -1 ? -500 + 60 : 500 - 60, dx = (w.side === -1 ? 1 : -1) * (1000 - 140) / N;
        const tipX = 960 + x0 + dx * k, tipY = 560 + w.row + Math.sin(k * 1.1 + i) * 16 + 8;
        const out = w.side === -1 ? -1 : 1;
        const hx = tipX + out * 90, hy = tipY - 50;
        return (
          <ArmIn key={i} x={hx} y={hy} fx={hx + out * 900} fy={hy + (i % 2 ? -150 : 170)} color={w.color} rot={0} s={3.6} width={66}>
            <Pencil x={-out * 90} y={50} rot={out === 1 ? -22 : 202} s={0.7} />
          </ArmIn>
        );
      })}
      <Sparkle x={1500} y={230} t={t - 20} s={1.2} />
    </g>
  );
};

// ---------- E12: two rule cards on the board: the good one gets a green tick, the silly one a red cross ----------
const Card: React.FC<{ x: number; y: number; rot: number; lines: string[]; size: number }> = ({ x, y, rot, lines, size }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-290 + 14} y={-210 + 16} width={580} height={420} rx={14} fill="#000" opacity={0.25} />
    <rect x={-290} y={-210} width={580} height={420} rx={14} fill="#FFF8E6" stroke={LINE} strokeWidth={6} />
    <circle cy={-190} r={16} fill="#D9453A" stroke={LINE} strokeWidth={4} />
    {lines.map((l, i) => <text key={i} y={-30 + i * (size + 14)} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={size} fill="#3A2A20">{l}</text>)}
  </g>
);
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const ok = clamp((t - 6) / 8), no = clamp((t - 27) / 8);
  const wob = settle(t - 27, 5, 1.6, 6);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <defs><linearGradient id="e12cork" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C99358" /><stop offset="1" stopColor="#9A6A3A" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e12cork)" />
      {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={rnd(5, i) * 1920} cy={rnd(6, i) * 1080} r={3 + rnd(7, i) * 4} fill="#7A5230" opacity={0.4} />)}
      <Card x={520} y={520} rot={-3} lines={['CHẠY CHẬM', 'QUA CỔNG', 'TRƯỜNG']} size={78} />
      <g transform={`rotate(${wob} 1400 520)`}><Card x={1400} y={520} rot={4} lines={['CẤM', 'CƯỜI TO!']} size={104} /></g>
      <g transform="translate(700 250)" opacity={clamp(ok * 3)}>
        <circle r={86} fill="#2E9E5B" stroke="#14532D" strokeWidth={8} />
        <path d="M -40 4 L -10 36 L 44 -30" stroke="#fff" strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="160" strokeDashoffset={160 * (1 - ok)} />
      </g>
      <g transform={`translate(1580 250) scale(${backOut(no)})`} opacity={clamp(no * 3)}>
        <circle r={86} fill="#D9453A" stroke="#7A1E2E" strokeWidth={8} />
        <path d="M -38 -38 L 38 38 M 38 -38 L -38 38" stroke="#fff" strokeWidth={22} strokeLinecap="round" />
      </g>
      <Sparkle x={420} y={330} t={t - 12} s={1.2} />
    </g>
  );
};

// ---------- E13: close-up: an eraser rubs out NHANH, a pencil writes CHẬM, the rule is fixed ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => {
  const CW = 58, X0 = 190, Y = 560;
  const er = clamp(t / 16), wr = clamp((t - 18) / 18);
  const wx = X0 + 6 * CW;
  const eraserX = wx + 5 * CW * er + Math.sin(t * 1.6) * 20;
  const penX = wx + 5 * CW * wr;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <defs>
        <linearGradient id="e13bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C99358" /><stop offset="1" stopColor="#8A5A38" /></linearGradient>
        <clipPath id="e13old"><rect x={wx + 5 * CW * er} y={Y - 110} width={5 * CW} height={160} /></clipPath>
        <clipPath id="e13new"><rect x={wx} y={Y - 110} width={5 * CW * wr} height={160} /></clipPath>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e13bg)" />
      <g transform="rotate(-1.5 960 540)">
        <rect x={110} y={330} width={1700} height={420} rx={14} fill="#000" opacity={0.22} transform="translate(14 16)" />
        <rect x={110} y={330} width={1700} height={420} rx={14} fill="#FBF3DE" stroke={LINE} strokeWidth={6} />
        <path d="M 110 430 H 1810 M 110 520 H 1810 M 110 610 H 1810" stroke="#B8C8E0" strokeWidth={3} opacity={0.0} />
        <text x={X0} y={Y} fontFamily={FONT.ui} fontWeight={700} fontSize={96} fill="#3A3A4A">CHẠY</text>
        <text x={wx} y={Y} fontFamily={FONT.ui} fontWeight={700} fontSize={96} fill="#3A3A4A" clipPath="url(#e13old)">NHANH</text>
        <text x={wx} y={Y} fontFamily={FONT.ui} fontWeight={700} fontSize={96} fill="#2E7A44" clipPath="url(#e13new)">CHẬM</text>
        <text x={wx + 6 * CW} y={Y} fontFamily={FONT.ui} fontWeight={700} fontSize={96} fill="#3A3A4A">QUA CỔNG</text>
      </g>
      {er < 1 ? Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={eraserX - 20 - i * 14} cy={Y + 30 + Math.abs(Math.sin(t / 2 + i)) * 24} r={4 + (i % 3)} fill="#E8A8B0" opacity={0.8} />) : null}
      {er < 1 ? <ArmIn x={eraserX + 70} y={Y + 20} fx={eraserX + 1000} fy={Y + 330} color="#2E2B3D" rot={0} s={3.6} width={70}><Eraser x={-40} y={-30} rot={-8} s={0.8} /></ArmIn> : null}
      {er >= 1 ? <ArmIn x={penX + 130} y={Y + 50} fx={penX + 1000} fy={Y + 330} color="#2E2B3D" rot={0} s={3.6} width={70}><Pencil x={-90} y={-60} rot={-24} s={0.8} /></ArmIn> : null}
      <Sparkle x={wx + 5 * CW + 20} y={Y - 120} t={t - 38} s={1.2} />
    </g>
  );
};

// ---------- E14: two fists hook little fingers over a warm glow ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <defs><radialGradient id="e14bg" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stopColor="#F9C98A" /><stop offset="1" stopColor="#6A3A4A" /></radialGradient></defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e14bg)" />
    {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={rnd(8, i) * 1920} cy={rnd(9, i) * 1080 - ((t * (0.4 + rnd(2, i))) % 120)} r={10 + rnd(4, i) * 26} fill="#FFE9B0" opacity={0.18} />)}
    <g transform="translate(960 560) scale(1.5) translate(-960 -560)"><PinkyPromise x={960} y={560} t={t} p={easeOut(clamp(t / 12))} /></g>
    <Thread x1={960} y1={430} x2={1500} y2={-80} sag={-60} ph={(t % 30) / 30} w={6} />
    <Sparkle x={960} y={380} t={t - 8} s={1.6} />
    <Sparkle x={1250} y={470} t={t - 14} s={1.1} />
  </g>
);

// ---------- E15: a city of tiny people, each holding a glowing thread up to one bright knot in the sky ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const rows = [{ y: 930, s: 1.5, n: 12 }, { y: 990, s: 1.7, n: 11 }, { y: 1050, s: 1.9, n: 10 }];
  const ORB = { x: 960, y: 250 };
  let k = 0;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <defs><linearGradient id="e15sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2B2F6B" /><stop offset="0.6" stopColor="#8A4A8A" /><stop offset="1" stopColor="#F29B6B" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e15sky)" />
      {[0, 1, 2].map((layer) => (
        <g key={layer} opacity={0.5 + layer * 0.25}>
          {Array.from({ length: 16 }).map((_, i) => {
            const w = 110 + rnd(layer + 1, i) * 80, h = 200 + rnd(layer + 5, i) * 260 - layer * 50, bx = i * 130 - 60 + layer * 40;
            return (
              <g key={i}>
                <rect x={bx} y={880 - h - layer * 30} width={w} height={h + 200} fill={['#3A2F5A', '#4B3A6A', '#5E4A78'][layer]} />
                {Array.from({ length: 6 }).map((_, j) => <rect key={j} x={bx + 14 + (j % 2) * 42} y={880 - h - layer * 30 + 24 + Math.floor(j / 2) * 52} width={22} height={28} fill="#FFD76A" opacity={rnd(layer + 9, i * 7 + j) > 0.4 ? 0.85 : 0.1} />)}
              </g>
            );
          })}
        </g>
      ))}
      <rect x={-200} y={900} width={2320} height={400} fill="#2A2038" />
      {rows.map((r, ri) => Array.from({ length: r.n }).map((_, i) => {
        const j = k++;
        const x = 70 + i * (1780 / (r.n - 1)) + (ri % 2) * 26;
        const hx = x + 21 * r.s, hy = r.y - 61 * r.s;
        return (
          <g key={`${ri}-${i}`}>
            <Tiny x={x} y={r.y} s={r.s} shirt={SHIRTS[j % 8]} skin={SKINS[j % 4]} hat={j % 5 === 0} armR={150} armL={8} bob={Math.max(0, Math.sin(t / 5 + j)) * 3} />
            <Thread x1={hx} y1={hy} x2={ORB.x + (hx - ORB.x) * 0.05} y2={ORB.y + 40} sag={40} ph={((t * 0.03 + rnd(3, j)) % 1)} o={0.75} w={3} />
          </g>
        );
      }))}
      <Glow x={ORB.x} y={ORB.y} r={380 + 20 * Math.sin(t / 5)} o={0.9} />
      <circle cx={ORB.x} cy={ORB.y} r={46 + 4 * Math.sin(t / 5)} fill="#FFF6CF" />
      <circle cx={ORB.x} cy={ORB.y} r={90 + 10 * Math.sin(t / 5)} fill="none" stroke="#FFE27A" strokeWidth={5} opacity={0.6} />
      <Dust t={t} seed={9} x0={200} y0={300} w={1500} h={600} n={20} o={0.4} />
    </g>
  );
};
