import React from 'react';
import { kf, clamp, easeOut, easeInOut, backOut, camT, Glow, FONT, Sparkle, settle, ShotProps } from '../../engine';
import { Tiny, SHIRTS, SKINS } from './che-tiny-people';
import { SketchPaper, OstromPortrait } from './che-ostrom-portrait-and-medal';

// Chapter E, "6 month one: ostrom" end (232.8-236.5 s), look "peace": E8 the number card "HÀNG TRĂM NĂM" (a rule scroll
// handed down seven generations), E9 the "ĐÓ LÀ THẬT" stamp beside Ostrom's portrait.

const LINE = '#2A1E24';

// ---------- E8: a timeline of generations; the little scroll hops from hand to hand ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const gens = [
    { kid: true, old: false }, { kid: false, old: false }, { kid: false, old: false }, { kid: false, old: true },
    { kid: true, old: false }, { kid: false, old: false }, { kid: false, old: true },
  ];
  const X = (i: number) => 250 + i * 236;
  const prog = clamp((t - 4) / (len - 8)) * (gens.length - 1);
  const seg = Math.min(gens.length - 2, Math.floor(prog));
  const k = easeInOut(prog - seg);
  const sx = X(seg) + (X(seg + 1) - X(seg)) * k;
  const sy = 800 - 110 * Math.sin(Math.PI * k) - 330;
  const title = backOut(clamp((t - 2) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <defs><linearGradient id="e8bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1E4A5C" /><stop offset="1" stopColor="#0E2A36" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e8bg)" />
      <Glow x={960} y={620} r={900} o={0.25} />
      <g transform={`translate(960 260) scale(${title})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={158} letterSpacing={3} fill="#FFE27A" stroke="#0E2A36" strokeWidth={16} paintOrder="stroke">HÀNG TRĂM NĂM</text>
      </g>
      <path d={`M 120 850 H ${120 + 1680 * easeOut(clamp(t / 18))}`} stroke="#FFE27A" strokeWidth={8} strokeLinecap="round" />
      {gens.map((g, i) => {
        const p = backOut(clamp((t - 2 - i * 3) / 8));
        return (
          <g key={i} opacity={clamp(p * 2)}>
            <path d={`M ${X(i)} 850 v 18`} stroke="#FFE27A" strokeWidth={6} />
            <Tiny x={X(i)} y={850} s={4.4 * Math.max(0.01, p)} kid={g.kid} old={g.old} hat={i % 3 === 2} shirt={SHIRTS[(i * 3) % 8]} skin={SKINS[i % 4]} armR={i === Math.round(prog) ? 120 : 14} bob={Math.max(0, Math.sin(t / 4 + i)) * 3} />
          </g>
        );
      })}
      <g transform={`translate(${sx} ${sy})`}>
        <circle r={54} fill="#FFE27A" opacity={0.3} />
        <rect x={-30} y={-24} width={60} height={48} rx={8} fill="#FFF8E6" stroke={LINE} strokeWidth={5} />
        <path d="M -18 -8 H 18 M -18 6 H 8" stroke="#6B4128" strokeWidth={5} strokeLinecap="round" />
      </g>
      <Sparkle x={sx} y={sy - 50} t={t} s={0.9} />
    </g>
  );
};

// ---------- E9: "ĐÓ LÀ THẬT": the stamp slams onto the paper beside her portrait ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const drop = clamp((t - 6) / 5);
  const sc = 2.4 - 1.4 * easeOut(drop);
  const jolt = settle(t - 11, 14, 1.9, 5);
  const tick = clamp((t - 14) / 10);
  return (
    <g transform={camT(960 + jolt * 0.3, 540 + jolt, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <SketchPaper id="e9" />
      <OstromPortrait t={t + 30} x={470} y={560} s={1.25} />
      <g transform={`translate(1290 560) rotate(-6) scale(${sc})`} opacity={clamp(drop * 4)}>
        <rect x={-380} y={-130} width={760} height={260} rx={30} fill="#EAF7E8" opacity={0.9} stroke="#1E7A44" strokeWidth={14} />
        <rect x={-356} y={-106} width={712} height={212} rx={20} fill="none" stroke="#1E7A44" strokeWidth={5} />
        <text y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={112} letterSpacing={2} fill="#1E7A44">ĐÓ LÀ THẬT</text>
      </g>
      <g transform="translate(1290 250)">
        <circle r={80} fill="#2E9E5B" stroke="#14532D" strokeWidth={8} opacity={clamp(tick * 3)} />
        <path d="M -38 4 L -10 34 L 42 -28" stroke="#fff" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="150" strokeDashoffset={150 * (1 - tick)} />
      </g>
      <Sparkle x={1000} y={300} t={t - 14} s={1.3} />
      <Sparkle x={1640} y={430} t={t - 18} s={1.5} />
      <Sparkle x={1560} y={790} t={t - 22} s={1.2} />
    </g>
  );
};
