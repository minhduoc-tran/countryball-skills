import React from 'react';
import { rnd, clamp, easeOut, FONT, UI } from '../../engine';
import { Globe } from './kit-globe';

// Chapter D props (3/4): plankton, the atmosphere tank, air swirls, the three-threat icons, ice, jug, donut, smoke.

const INK = '#14121A';

/** A plankton cell: kind 0 round diatom with spikes, 1 green blob with dots, 2 copepod-ish teardrop. */
export const Plankton: React.FC<{ x: number; y: number; s?: number; kind?: number; t: number }> = ({ x, y, s = 1, kind = 0, t }) => {
  const bob = Math.sin(t / 12 + x) * 8 * s;
  const rot = Math.sin(t / 30 + kind) * 14;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rot}) scale(${s})`}>
      {kind === 0 ? (
        <g>
          {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M ${Math.cos(a) * 46} ${Math.sin(a) * 46} L ${Math.cos(a) * 72} ${Math.sin(a) * 72}`} stroke="#7FE3B0" strokeWidth={6} strokeLinecap="round" />; })}
          <circle r={46} fill="#59D18F" stroke="#1F7A52" strokeWidth={6} />
          <circle r={22} fill="#A8F0C8" opacity={0.8} />
          <circle cx={-12} cy={-12} r={7} fill="#FFFFFF" opacity={0.8} />
        </g>
      ) : null}
      {kind === 1 ? (
        <g>
          <path d="M -60 6 Q -66 -50 -6 -56 Q 58 -60 62 -2 Q 64 52 0 56 Q -56 58 -60 6 Z" fill="#8FD94F" stroke="#4A8A1F" strokeWidth={6} />
          {[[-22, -16], [18, -22], [26, 18], [-14, 22], [2, 0]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={9} fill="#D8F5A0" stroke="#4A8A1F" strokeWidth={3} />)}
        </g>
      ) : null}
      {kind === 2 ? (
        <g>
          <path d="M -70 0 Q -10 -50 50 -10 L 90 -26 L 80 0 L 90 26 L 50 10 Q -10 50 -70 0 Z" fill="#F29E6B" stroke="#A8502A" strokeWidth={6} strokeLinejoin="round" />
          <path d="M -30 -22 q -30 -34 -64 -30 M -10 -30 q -20 -44 -54 -52" stroke="#A8502A" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={-36} cy={-4} r={8} fill={INK} />
        </g>
      ) : null}
    </g>
  );
};

/** O2 bubbles rising from (x, y): `n` bubbles, each with a tiny "O2" in the bigger ones. */
export const O2Bubbles: React.FC<{ x: number; y: number; t: number; n?: number; h?: number; spread?: number; text?: boolean; col?: string }> = ({ x, y, t, n = 8, h = 520, spread = 140, text = true, col = '#CFF5FF' }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = (rnd(50, i) + t * (0.012 + rnd(51, i) * 0.01)) % 1;
      const r = 16 + rnd(52, i) * 26;
      const xx = x + (rnd(53, i) - 0.5) * spread + Math.sin(ph * 9 + i) * 14;
      return (
        <g key={i} opacity={Math.sin(ph * Math.PI)}>
          <circle cx={xx} cy={y - ph * h} r={r} fill={col} fillOpacity={0.25} stroke={col} strokeWidth={4} />
          {text && r > 26 ? <text x={xx} y={y - ph * h + 9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={r * 0.8} fill={col}>O₂</text> : null}
        </g>
      );
    })}
  </g>
);

/** The atmosphere as a gas tank: a glass cylinder holding a small Earth, valve on top, a gauge with its needle at "full". */
export const AirTank: React.FC<{ id: string; x: number; y: number; t: number; fill?: number }> = ({ id, x, y, t, fill = 1 }) => {
  const needle = -60 + 120 * (0.97 + 0.03 * Math.sin(t / 40)) * clamp(fill);
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={420} rx={260} ry={30} fill="#000" opacity={0.3} />
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7FD0F5" stopOpacity="0.9" /><stop offset="0.35" stopColor="#CFF0FF" stopOpacity="0.85" /><stop offset="1" stopColor="#4F9BCB" stopOpacity="0.9" /></linearGradient>
      </defs>
      {/* valve and neck */}
      <rect x={-50} y={-440} width={100} height={70} rx={14} fill="#B8C2CC" stroke={INK} strokeWidth={8} />
      <rect x={-110} y={-470} width={220} height={36} rx={16} fill="#E2574C" stroke={INK} strokeWidth={8} />
      {/* body */}
      <path d="M -230 -250 Q -230 -380 0 -380 Q 230 -380 230 -250 L 230 340 Q 230 420 150 420 L -150 420 Q -230 420 -230 340 Z" fill={`url(#${id}t)`} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d="M -190 -250 Q -190 -330 -80 -340" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M -190 -170 L -190 300" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" opacity={0.45} />
      {/* O2 label band + the Earth inside */}
      <Globe id={`${id}g`} t={t} r={150} cx={0} cy={-40} />
      <rect x={-230} y={190} width={460} height={90} fill="#0B0816" opacity={0.78} />
      <text y={256} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#F6EFE3" letterSpacing={6}>O₂</text>
      {/* gauge on the right */}
      <g transform="translate(330 -120)">
        <circle r={96} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
        <path d="M -70 40 A 84 84 0 1 1 70 40" stroke="#D9D2C2" strokeWidth={14} fill="none" />
        <path d="M 28 -70 A 84 84 0 0 1 70 40" stroke="#5BE08A" strokeWidth={14} fill="none" />
        <g transform={`rotate(${needle})`}><path d="M 0 0 L 0 -72" stroke="#E2574C" strokeWidth={10} strokeLinecap="round" /></g>
        <circle r={12} fill={INK} />
      </g>
    </g>
  );
};

/** Swirls of air (wind lines curling) centred on (x, y), scale s. */
export const AirSwirl: React.FC<{ x: number; y: number; s?: number; t: number; col?: string }> = ({ x, y, s = 1, t, col = '#BFEAFF' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={col} strokeWidth={16} strokeLinecap="round">
    <path d="M -220 -60 L 80 -60 C 190 -60 190 -170 100 -170" strokeDasharray="520 80" strokeDashoffset={-(t * 4) % 600} />
    <path d="M -260 20 L 160 20 C 270 20 270 -90 180 -90" strokeDasharray="620 90" strokeDashoffset={-(t * 5) % 710} opacity={0.8} />
    <path d="M -200 100 L 20 100 C 110 100 110 190 40 190" strokeDasharray="420 70" strokeDashoffset={-(t * 4) % 490} opacity={0.9} />
  </g>
);

/** A water drop, a rain cloud, or a fish-and-bowl icon in a flat dark-outlined style. Centred on (0,0), about 220 tall. */
export const ThreatIcon: React.FC<{ kind: 'water' | 'rain' | 'food'; t: number }> = ({ kind, t }) => {
  if (kind === 'water') {
    return (
      <g>
        <path d="M 0 -120 C 60 -40 100 10 100 56 C 100 112 56 142 0 142 C -56 142 -100 112 -100 56 C -100 10 -60 -40 0 -120 Z" fill="#4FB4F0" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M -52 40 C -52 70 -34 96 -6 104" stroke="#FFFFFF" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.8} />
      </g>
    );
  }
  if (kind === 'rain') {
    return (
      <g>
        <g transform="translate(0 -30) scale(0.78)">
          <path d="M -150 40 Q -190 40 -184 6 Q -176 -26 -138 -22 Q -128 -70 -78 -64 Q -50 -108 0 -92 Q 52 -100 70 -56 Q 118 -70 132 -22 Q 184 -20 180 14 Q 178 42 140 40 Z" fill="#DCE6F0" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        </g>
        {[-70, 0, 70].map((x, i) => <path key={i} d={`M ${x} ${30 + ((t * 3 + i * 14) % 44)} l -8 36`} stroke="#4FB4F0" strokeWidth={10} strokeLinecap="round" />)}
      </g>
    );
  }
  return (
    <g>
      <path d="M -110 10 L 110 10 Q 110 120 0 124 Q -110 120 -110 10 Z" fill="#F6EFE3" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -80 10 q 80 -70 160 0" fill="#FFFFFF" stroke={INK} strokeWidth={6} />
      <path d="M -50 0 q 30 -30 70 -6 l 24 -20 l -4 28 l 18 18 l -30 -4 q -50 24 -78 -16 Z" fill="#FF9A4A" stroke={INK} strokeWidth={6} strokeLinejoin="round" transform="translate(-6 -56)" />
      <path d="M -30 -84 q 14 -26 0 -44 M 20 -84 q 14 -26 0 -44" stroke={UI.text} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

/** A chunk of polar ice (angular, cyan-white) at (x, y), s scale. */
export const IceBlock: React.FC<{ x: number; y: number; s?: number; melt?: number }> = ({ x, y, s = 1, melt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * (1 - 0.4 * melt)})`}>
    <path d="M -130 60 L -110 -30 L -50 -90 L 10 -50 L 60 -120 L 130 -30 L 150 60 Z" fill="#E6F6FF" stroke="#7FB8D6" strokeWidth={8} strokeLinejoin="round" />
    <path d="M 60 -120 L 130 -30 L 150 60 L 70 60 L 40 -40 Z" fill="#B7DFF2" />
    <path d="M -50 -90 L 10 -50 L -10 60 L -60 60 L -80 -20 Z" fill="#FFFFFF" opacity={0.75} />
  </g>
);

/** A donut ring: slices [fraction, colour] drawing on with `k` 0..1, radius r, thickness th, centred on (0, 0). */
export const Donut: React.FC<{ slices: [number, string][]; r: number; th: number; k: number }> = ({ slices, r, th, k }) => {
  const kk = easeOut(clamp(k));
  let a0 = -Math.PI / 2;
  return (
    <g>
      {slices.map(([f, col], i) => {
        const a1 = a0 + f * Math.PI * 2 * kk;
        const d = `M ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`;
        a0 = a1;
        return <path key={i} d={d} stroke={col} strokeWidth={th} fill="none" />;
      })}
    </g>
  );
};

/** A small factory silhouette at (x, y) = bottom centre, with three smoking chimneys. */
export const Factory: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-120} width={340} height={120} fill="#3A3F52" stroke={INK} strokeWidth={6} />
    {[-110, -10, 90].map((cx, i) => (
      <g key={cx}>
        <rect x={cx - 24} y={-250 - i * 14} width={48} height={140 + i * 14} fill="#4A5068" stroke={INK} strokeWidth={6} />
        {[0, 1, 2].map((k) => {
          const ph = (t * 0.02 + k / 3 + i * 0.3) % 1;
          return <circle key={k} cx={cx + ph * 60 - 10 + Math.sin(ph * 6) * 14} cy={-260 - i * 14 - ph * 360} r={26 + ph * 50} fill="#6B6F7A" opacity={0.7 * Math.sin(ph * Math.PI)} />;
        })}
      </g>
    ))}
    {[-120, -50, 20, 90, 140].map((wx) => <rect key={wx} x={wx - 14} y={-86} width={28} height={34} fill="#FFD98A" opacity={0.85} />)}
  </g>
);

/** A dark space backdrop with stars; `id` unique. */
export const SpaceBack: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.8"><stop offset="0" stopColor="#1B2A4A" /><stop offset="1" stopColor="#070A14" /></radialGradient></defs>
    <rect x={-100} y={-100} width={2120} height={1280} fill={`url(#${id})`} />
    {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={rnd(70, i) * 1920} cy={rnd(71, i) * 1080} r={1.5 + rnd(72, i) * 2.5} fill="#FFFFFF" opacity={0.3 + 0.5 * Math.abs(Math.sin(t / 20 + i))} />)}
  </g>
);

