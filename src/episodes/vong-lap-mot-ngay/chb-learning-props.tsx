import React from 'react';
import { clamp, easeOut, backOut, FONT, SCH, UI, Glow } from '../../engine';
import { PAL } from './kit-palette';

// Chapter B props, learning (B16-B27). Pure functions of t. x, y = CENTRE unless said.
//   <DayBar x y w p t />        the waking day: a bar from 06:00 (sun) to 24:00 (moon) filling to p, a little head
//       riding the fill front, "18 GIỜ" over it. ~w x 200.
//   <ColumnsIcon x y s t />     a classical building (pediment, 5 columns, steps) drawing itself on (schematic line).
//   <JpBook x y w h c rot? />   a thick textbook seen from the front: coloured cover, "日本語" and "あ" on it.
//   <Kana x y t s? />           あ い う popping in a row (cream, a cyan underline), from t = 0.
//   <Note x y s c? />           a music note (eighth note).
//   <UprightPiano x y s t />    an upright piano side-on-ish, x y = floor centre, ~420 wide, keys facing right.
//   <Easel x y s paint />       a tripod easel with a canvas; paint 0..1 fills a sunset picture in. x y = floor centre.
//   <SkillIcon kind x y r t />  a round badge with a line icon: guitar, chess, globe, code, ball, camera.
//   <Panel x y w h id t from? children />  a framed panel that slides in from `from` (px offset) over 8 frames.

export const DayBar: React.FC<{ x: number; y: number; w: number; p: number; t: number }> = ({ x, y, w, p, t }) => {
  const q = clamp(p);
  const x0 = x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - 26} width={w} height={52} rx={26} fill={UI.pill} opacity={0.85} stroke={SCH.line} strokeWidth={3} />
      <defs>
        <linearGradient id="chbDayBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFD9A0" />
          <stop offset="0.55" stopColor="#FF8A3D" />
          <stop offset="1" stopColor="#5C6CC9" />
        </linearGradient>
      </defs>
      <rect x={x0 + 6} y={y - 20} width={Math.max(0, (w - 12) * q)} height={40} rx={20} fill="url(#chbDayBar)" />
      {[0, 3, 6, 9, 12, 15, 18].map((h) => <path key={h} d={`M ${x0 + (w * h) / 18} ${y + 32} v 16`} stroke={SCH.dim} strokeWidth={3} />)}
      {/* sun at the start, moon at the end */}
      <g transform={`translate(${x0 - 70} ${y})`}>
        <circle r={30} fill="#FFD34A" />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${Math.cos(i * 0.785) * 40} ${Math.sin(i * 0.785) * 40} L ${Math.cos(i * 0.785) * 52} ${Math.sin(i * 0.785) * 52}`} stroke="#FFD34A" strokeWidth={6} strokeLinecap="round" transform={`rotate(${t * 2})`} />)}
      </g>
      <g transform={`translate(${x0 + w + 70} ${y})`}>
        <circle r={32} fill="#DDE4FF" />
        <circle cx={14} cy={-10} r={28} fill="#101A2A" />
      </g>
      <text x={x0} y={y + 96} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={SCH.line}>06:00</text>
      <text x={x0 + w} y={y + 96} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={SCH.line}>24:00</text>
      {/* a little Pip head riding the front of the fill */}
      <g transform={`translate(${x0 + 6 + (w - 12) * q} ${y - 70 + Math.abs(Math.sin(t / 3)) * -10})`}>
        <circle r={26} fill="#F6EFE3" stroke="#121019" strokeWidth={4} />
        <path d="M -26 -2 Q -26 -30 0 -32 Q 26 -30 26 -2 Q 20 -20 0 -22 Q -20 -20 -26 -2 Z" fill="#2E2B3D" />
        <circle cx={-8} cy={2} r={3.5} fill="#1D2033" />
        <circle cx={8} cy={2} r={3.5} fill="#1D2033" />
      </g>
    </g>
  );
};

export const ColumnsIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = (d: number) => easeOut(clamp((t - d) / 10));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={SCH.line} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d="M -230 -120 L 0 -230 L 230 -120 Z" opacity={k(0)} />
      <path d="M -210 -100 H 210" opacity={k(2)} />
      {[-160, -80, 0, 80, 160].map((cx, i) => <path key={cx} d={`M ${cx} -90 V ${-90 + 200 * k(4 + i * 2)}`} />)}
      <path d="M -230 120 H 230 M -260 150 H 260" opacity={k(14)} />
      <circle cx={0} cy={-160} r={18} opacity={k(6)} />
    </g>
  );
};

export const JpBook: React.FC<{ x: number; y: number; w: number; h: number; c: string; rot?: number }> = ({ x, y, w, h, c, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w} height={h} rx={8} fill="#000" opacity={0.35} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={c} stroke="#14121C" strokeWidth={5} />
    <rect x={-w / 2} y={-h / 2} width={w * 0.1} height={h} fill="#000" opacity={0.2} />
    <text x={w * 0.05} y={-h * 0.08} textAnchor="middle" fontWeight={700} fontSize={w * 0.2} fill="#FFF6E2">日本語</text>
    <circle cx={w * 0.05} cy={h * 0.24} r={w * 0.14} fill="#FFF6E2" />
    <text x={w * 0.05} y={h * 0.24 + w * 0.07} textAnchor="middle" fontWeight={700} fontSize={w * 0.19} fill={c}>あ</text>
    <path d={`M ${-w / 2 + 4} ${-h / 2 + 4} H ${w / 2 - 4}`} stroke="#FFE2B0" strokeWidth={3} opacity={0.5} />
  </g>
);

export const Kana: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {['あ', 'い', 'う'].map((ch, i) => {
      const k = backOut(clamp((t - i * 5) / 7));
      return k > 0 ? (
        <g key={ch} transform={`translate(${(i - 1) * 190} 0) scale(${k})`}>
          <circle r={78} fill={UI.pill} opacity={0.85} stroke={PAL.cyan} strokeWidth={4} />
          <text y={36} textAnchor="middle" fontWeight={700} fontSize={104} fill={SCH.line}>{ch}</text>
        </g>
      ) : null;
    })}
  </g>
);

export const Note: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = PAL.cyanSoft, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={20} ry={15} transform="rotate(-24)" fill={c} stroke="#14121C" strokeWidth={3} />
    <path d="M 17 -4 V -70 Q 40 -56 44 -30" stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

export const UprightPiano: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={240} ry={16} fill="#000" opacity={0.4} />
    <rect x={-200} y={-420} width={140} height={420} rx={8} fill="#3A2420" stroke="#14100E" strokeWidth={5} />
    <rect x={-60} y={-250} width={180} height={34} rx={4} fill="#4A2E28" stroke="#14100E" strokeWidth={4} />
    <rect x={-60} y={-224} width={180} height={18} fill="#F4EFE4" stroke="#14100E" strokeWidth={3} />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-50 + i * 22} y={-224} width={10} height={10} fill="#14121A" />)}
    <rect x={90} y={-216} width={20} height={216} fill="#2A1A16" />
    <rect x={-190} y={-380} width={10} height={130} fill="#FFC98A" opacity={0.3} />
    <rect x={-120} y={-470} width={70} height={50} rx={4} fill="#F4EEDF" stroke="#7D705C" strokeWidth={3} transform={`rotate(-6 -85 -445)`} />
    <path d="M -110 -455 h 46 M -110 -440 h 40 M -110 -428 h 46" stroke="#5A5262" strokeWidth={3} />
    <Glow x={-60} y={-300} r={80 + 6 * Math.sin(t / 6)} o={0.2} />
  </g>
);

export const Easel: React.FC<{ x: number; y: number; s?: number; paint: number }> = ({ x, y, s = 1, paint }) => {
  const p = clamp(paint);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={150} ry={12} fill="#000" opacity={0.4} />
      <path d="M -110 0 L -20 -420 M 110 0 L 20 -420 M 0 -420 L 0 40" stroke="#6A4A2E" strokeWidth={12} strokeLinecap="round" />
      <rect x={-140} y={-170} width={280} height={14} fill="#5A3E26" />
      <rect x={-150} y={-400} width={300} height={232} rx={6} fill="#F4EEDF" stroke="#2A1E16" strokeWidth={6} />
      <g opacity={p}>
        <rect x={-140} y={-390} width={280} height={140 * p + 1} fill="#F2A65A" />
        <circle cx={40} cy={-300} r={36 * p} fill="#FFE27A" />
        <path d="M -140 -230 L -60 -290 L 0 -250 L 70 -310 L 140 -250 L 140 -178 L -140 -178 Z" fill="#5A3E66" opacity={p} />
      </g>
    </g>
  );
};

export type SkillKind = 'guitar' | 'chess' | 'globe' | 'code' | 'ball' | 'camera';
export const SkillIcon: React.FC<{ kind: SkillKind; x: number; y: number; r?: number; t: number }> = ({ kind, x, y, r = 80, t }) => {
  const k = backOut(clamp(t / 8));
  if (t < 0) return null;
  const st = { stroke: SCH.line, strokeWidth: 7, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 8) * 6}) scale(${k * r / 80})`}>
      <circle r={80} fill={UI.pill} opacity={0.85} stroke={UI.live} strokeWidth={5} />
      {kind === 'guitar' ? <g {...st}><circle cx={-12} cy={22} r={26} /><circle cx={8} cy={-4} r={18} /><path d="M 18 -14 L 46 -46 M 40 -52 l 12 12" /></g> : null}
      {kind === 'chess' ? <g {...st}><path d="M -26 40 H 30 M -20 40 Q -16 10 -2 0 Q -28 -6 -18 -30 Q -4 -50 18 -40 Q 30 -20 18 10 Q 24 26 24 40" /><circle cx={-2} cy={-28} r={3} fill={SCH.line} /></g> : null}
      {kind === 'globe' ? <g {...st}><circle r={44} /><path d="M -44 0 H 44 M 0 -44 Q -30 0 0 44 Q 30 0 0 -44" /></g> : null}
      {kind === 'code' ? <g {...st}><path d="M -18 -30 L -46 0 L -18 30 M 18 -30 L 46 0 L 18 30 M 8 -40 L -8 40" /></g> : null}
      {kind === 'ball' ? <g {...st}><circle r={44} /><path d="M 0 -18 L 17 -6 L 11 15 L -11 15 L -17 -6 Z M 0 -18 V -44 M 17 -6 L 42 -14 M 11 15 L 26 36 M -11 15 L -26 36 M -17 -6 L -42 -14" /></g> : null}
      {kind === 'camera' ? <g {...st}><rect x={-46} y={-26} width={92} height={60} rx={10} /><circle cx={0} cy={4} r={18} /><path d="M -16 -26 l 8 -14 h 16 l 8 14" /></g> : null}
    </g>
  );
};

export const Panel: React.FC<{ x: number; y: number; w: number; h: number; id: string; t: number; from?: number; children: React.ReactNode }> = ({ x, y, w, h, id, t, from = 0, children }) => {
  if (t < 0) return null;
  const k = easeOut(clamp(t / 8));
  return (
    <g transform={`translate(${from * (1 - k)} 0)`} opacity={clamp(t / 3)}>
      <defs><clipPath id={`${id}clip`}><rect x={x} y={y} width={w} height={h} rx={24} /></clipPath></defs>
      <rect x={x + 10} y={y + 14} width={w} height={h} rx={24} fill="#000" opacity={0.45} />
      <g clipPath={`url(#${id}clip)`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={24} fill="none" stroke="#F6EFE3" strokeWidth={8} />
    </g>
  );
};
