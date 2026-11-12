import React from 'react';
import { rnd, clamp, SCH, FONT, mixHex } from '../../engine';

// Chapter C props, part 3: plants and the food chain. A potted plant whose leaves droop, tufts of grass that brown,
// a big tree with a sugar glow in its trunk, and grass / rabbit / fox icons that grey out. Pure functions of `t`.

const GREEN = '#58B368';
const DEAD = '#7A6A4A';
const GREY = '#6A7288';

/** A leaf: base at (0,0), pointing up, length L, curling over with `droop` 0..1, browning. `side` flips it. */
const Leaf: React.FC<{ a: number; L: number; droop: number; side: number }> = ({ a, L, droop, side }) => {
  const col = mixHex(GREEN, DEAD, clamp(droop * 1.1));
  const curl = side * droop * L * 0.5;
  return (
    <g transform={`rotate(${a})`}>
      <path d={`M 0 0 Q ${side * L * 0.55 + curl * 0.3} ${-L * 0.5} ${curl} ${-L * (1 - droop * 0.3)} Q ${-side * L * 0.3 + curl * 0.3} ${-L * 0.5} 0 0 Z`} fill={col} />
      <path d={`M 0 0 Q ${side * L * 0.08 + curl * 0.2} ${-L * 0.5} ${curl} ${-L * (0.95 - droop * 0.3)}`} stroke="#000" strokeOpacity={0.22} strokeWidth={4} fill="none" />
    </g>
  );
};

/** A potted plant: x = pot centre, y = pot base; `droop` 0..1 wilts it; `s` scale. */
export const PottedPlant: React.FC<{ x: number; y: number; s?: number; droop?: number; t: number }> = ({ x, y, s = 1, droop = 0, t }) => {
  const sway = Math.sin(t / 18) * 1.5 * (1 - droop);
  const H = 280 - droop * 70;
  const end = { x: droop * 95 + sway, y: -106 - H };
  const ctrl = { x: droop * 10, y: -106 - H * 0.65 };
  const P = (f: number) => ({
    x: 2 * (1 - f) * f * ctrl.x + f * f * end.x,
    y: (1 - f) * (1 - f) * -106 + 2 * (1 - f) * f * ctrl.y + f * f * end.y,
  });
  const stem = mixHex('#3E8A52', DEAD, droop);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={110} ry={14} fill="#000" opacity={0.35} />
      <path d={`M 0 -100 Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`} stroke={stem} strokeWidth={14} fill="none" strokeLinecap="round" />
      {[0.3, 0.5, 0.68, 0.84].map((f, i) => {
        const pt = P(f);
        const side = i % 2 ? -1 : 1;
        return (
          <g key={i} transform={`translate(${pt.x} ${pt.y}) rotate(${side * (48 + droop * 95)})`}>
            <Leaf a={0} L={120 - i * 8} droop={clamp(droop * (1 + i * 0.08))} side={side} />
          </g>
        );
      })}
      <g transform={`translate(${end.x} ${end.y}) rotate(${droop * 55})`}>
        <Leaf a={0} L={100} droop={droop * 0.7} side={1} />
      </g>
      <path d="M -70 -90 L 70 -90 L 52 0 L -52 0 Z" fill="#B8603A" />
      <path d="M -70 -90 L -30 -90 L -20 0 L -52 0 Z" fill="#000" opacity={0.15} />
      <rect x={-78} y={-106} width={156} height={22} rx={8} fill="#CE7448" />
    </g>
  );
};

/** A row of grass tufts across [x0, x1] at ground y; `brown` 0..1 greens to dead straw, `lean` 0..1 flops them over. */
export const GrassRow: React.FC<{ x0: number; x1: number; y: number; n: number; brown: number; lean?: number; h?: number; t: number; seed?: number }> = ({ x0, x1, y, n, brown, lean = 0, h = 120, t, seed = 3 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const bx = x0 + ((x1 - x0) * (i + rnd(seed, i) * 0.8)) / n;
      const hh = h * (0.6 + rnd(seed + 1, i) * 0.6);
      const k = clamp(brown * 1.2 - rnd(seed + 2, i) * 0.2);
      const col = mixHex(mixHex('#4E9A5A', '#7DBF6A', rnd(seed + 3, i)), DEAD, k);
      const dir = rnd(seed + 5, i) > 0.5 ? 1 : -1;
      return (
        <g key={i} transform={`translate(${bx} ${y})`}>
          {[-1, 0, 1].map((b) => {
            const bend = (rnd(seed + 4, i * 3 + b + 1) - 0.5) * 24 + lean * dir * (hh * 0.5) + Math.sin(t / 20 + i) * 3 * (1 - lean);
            const tipY = -hh * (1 - lean * 0.6) + Math.abs(b) * 10;
            return (
              <path key={b} d={`M ${b * 8 - 5} 0 Q ${b * 8 + bend * 0.15} ${tipY * 0.7} ${b * 12 + bend} ${tipY} Q ${b * 8 + bend * 0.15 + 8} ${tipY * 0.6} ${b * 8 + 5} 0 Z`} fill={col} />
            );
          })}
        </g>
      );
    })}
  </g>
);

/** A big tree in silhouette against a dark sky; x = trunk base, y = ground. `glow` 0..1 lights sugar inside the trunk. */
export const BigTree: React.FC<{ x: number; y: number; s?: number; t: number; glow?: number; leaves?: number }> = ({ x, y, s = 1, t, glow = 0, leaves = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={190} ry={20} fill="#000" opacity={0.45} />
    <path d="M -90 0 Q -50 -60 -52 -200 Q -50 -420 -34 -520 L 34 -520 Q 50 -420 52 -200 Q 54 -60 100 0 Z" fill="#2A1E1C" />
    <path d="M 20 -520 Q 40 -420 38 -200 Q 36 -60 64 0 L 100 0 Q 54 -60 52 -200 Q 50 -420 34 -520 Z" fill="#6A4A40" opacity={0.55} />
    <path d="M -34 -440 Q -130 -500 -210 -470 M 34 -420 Q 120 -520 220 -500 M -20 -380 Q -80 -330 -170 -340" stroke="#2A1E1C" strokeWidth={26} fill="none" strokeLinecap="round" />
    {leaves > 0 ? (
      <g fill="#152A20" opacity={leaves}>
        {[[-90, -620, 170], [90, -640, 190], [-230, -520, 130], [240, -540, 140], [0, -720, 160], [-30, -560, 170]].map(([cx, cy, r], i) => (
          <ellipse key={i} cx={cx + Math.sin(t / 40 + i) * 2} cy={cy} rx={r * 1.15} ry={r * 0.82} />
        ))}
      </g>
    ) : null}
    {leaves > 0 ? (
      <g fill="#244A32" opacity={0.5 * leaves}>
        {[[-120, -660, 90], [110, -680, 100], [-10, -760, 90]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r * 1.1} ry={r * 0.7} />)}
      </g>
    ) : null}
    {glow > 0 ? (
      <g opacity={glow}>
        <g filter="url(#blur6)"><path d="M -30 -70 Q -32 -200 -20 -290 L 20 -290 Q 32 -200 30 -70 Z" fill="#FFB15A" opacity={0.5} /></g>
        <ellipse cx={0} cy={-170} rx={60} ry={190} fill="url(#treeSugarGlow)" />
        {Array.from({ length: 16 }).map((_, i) => {
          const p = (t * 0.012 + rnd(5, i)) % 1;
          return <circle key={i} cx={(rnd(6, i) - 0.5) * 40} cy={-40 - p * 340} r={4 + rnd(7, i) * 4} fill="#FFE2A8" opacity={0.9 * Math.sin(p * Math.PI)} />;
        })}
      </g>
    ) : null}
    <defs>
      <radialGradient id="treeSugarGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFC85A" stopOpacity={0.9} />
        <stop offset="1" stopColor="#FF8A3D" stopOpacity={0} />
      </radialGradient>
    </defs>
  </g>
);

/** A food-chain link icon: kind = grass | rabbit | fox in a round badge; `g` 0 (alive, coloured) .. 1 (grey, starved). */
export const ChainIcon: React.FC<{ kind: 'grass' | 'rabbit' | 'fox'; x: number; y: number; r?: number; g: number; t: number }> = ({ kind, x, y, r = 130, g, t }) => {
  const c = (live: string) => mixHex(live, GREY, clamp(g));
  const k = r / 130;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={130} fill="#14223A" stroke={mixHex(SCH.line, GREY, g)} strokeWidth={8} />
      {kind === 'grass' ? (
        <g transform="translate(0 70)">
          {[-60, -30, 0, 30, 60].map((b, i) => (
            <path key={i} d={`M ${b} 0 Q ${b + (i - 2) * 8} -60 ${b + (i - 2) * 22 + Math.sin(t / 20 + i) * 3} ${-120 + (i % 2) * 20 + g * 40}`} stroke={c('#58B368')} strokeWidth={14} strokeLinecap="round" fill="none" />
          ))}
        </g>
      ) : null}
      {kind === 'rabbit' ? (
        <g transform="translate(-6 18)">
          <circle cx={-66} cy={34} r={17} fill={c('#FFFFFF')} />
          <ellipse cx={-6} cy={36} rx={66} ry={44} fill={c('#E8E0D8')} />
          <rect x={14} y={58} width={46} height={16} rx={8} fill={c('#E8E0D8')} />
          <circle cx={50} cy={-8} r={34} fill={c('#E8E0D8')} />
          <g transform={`rotate(${g * 38} 50 -30)`}>
            <ellipse cx={40} cy={-66} rx={11} ry={38} fill={c('#E8E0D8')} transform="rotate(-10 40 -66)" />
            <ellipse cx={40} cy={-66} rx={5} ry={26} fill={c('#F2A8B8')} transform="rotate(-10 40 -66)" />
            <ellipse cx={64} cy={-62} rx={11} ry={36} fill={c('#E8E0D8')} transform="rotate(12 64 -62)" />
          </g>
          <circle cx={62} cy={-12} r={5} fill="#14223A" />
          <circle cx={80} cy={-2} r={5} fill={c('#F2A8B8')} />
        </g>
      ) : null}
      {kind === 'fox' ? (
        <g transform="translate(-4 18)">
          <path d="M -50 34 Q -124 14 -98 -52 Q -74 -14 -40 10 Z" fill={c('#F08A3A')} />
          <path d="M -98 -52 Q -108 -26 -92 -8 Q -78 -24 -84 -42 Z" fill={c('#FFFFFF')} />
          <ellipse cx={-4} cy={38} rx={60} ry={36} fill={c('#F08A3A')} />
          <rect x={-30} y={58} width={16} height={28} rx={6} fill={c('#7A4A2A')} />
          <rect x={22} y={58} width={16} height={28} rx={6} fill={c('#7A4A2A')} />
          <polygon points="34,-30 40,-84 66,-46" fill={c('#F08A3A')} />
          <polygon points="60,-48 90,-82 94,-30" fill={c('#F08A3A')} />
          <polygon points="26,-34 68,-48 100,-4 58,26 24,8" fill={c('#F08A3A')} />
          <polygon points="58,26 100,-4 68,8" fill={c('#FFFFFF')} />
          <circle cx={100} cy={-4} r={6} fill="#14223A" />
          <circle cx={66} cy={-16} r={5} fill="#14223A" />
        </g>
      ) : null}
    </g>
  );
};

/** Arrow between two chain icons; `g` greys it. Label "eaten by" is implied. */
export const ChainArrow: React.FC<{ x0: number; x1: number; y: number; g: number }> = ({ x0, x1, y, g }) => {
  const col = mixHex(SCH.live, GREY, clamp(g));
  return (
    <g>
      <path d={`M ${x0} ${y} L ${x1 - 10} ${y}`} stroke={col} strokeWidth={10} strokeLinecap="round" strokeDasharray={g > 0.5 ? '18 16' : '0'} />
      <path d={`M ${x1 - 36} ${y - 24} L ${x1} ${y} L ${x1 - 36} ${y + 24}`} stroke={col} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
};

/** Small mono caption. */
export const Cap: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; o?: number }> = ({ x, y, text, size = 40, color = SCH.line, o = 1 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={size} fill={color} opacity={o} letterSpacing={3}>{text}</text>
);
