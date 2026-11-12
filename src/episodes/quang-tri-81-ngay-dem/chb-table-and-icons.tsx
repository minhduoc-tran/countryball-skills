import React from 'react';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { breathe, hop, mixMotion, talk } from '../../countryball/ball-motion';
import { clamp, easeOut, Pt } from '../../countryball/fx-math';
import { ramp, Txt } from './chb-common';

// Chapter B props: the Paris negotiating table (balls behind a table with papers / cards), playing cards for
// "mỗi vùng đất là một con bài", 5-point star, artillery-shell glyph. Pure functions of s (seconds) / t (frames).

export const star = (cx: number, cy: number, r: number): string =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * (Math.PI / 180), rr = i % 2 ? r * 0.42 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

/** One playing card (centre x, y), face up or back; `glow` 0..1 gold halo. */
export const PlayCard: React.FC<{ x: number; y: number; w?: number; rot?: number; label?: string; sub?: string; up?: boolean; glow?: number; hot?: boolean }> = ({
  x, y, w = 220, rot = 0, label = '', sub, up = true, glow = 0, hot = false,
}) => {
  const h = w * 1.42;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {glow > 0.02 && <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={24} fill="#FFD166" opacity={glow * 0.55} />}
      <rect x={-w / 2 + 7} y={-h / 2 + 9} width={w} height={h} rx={16} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill={up ? '#F6F0E0' : '#8E2F2F'} stroke="#15151A" strokeWidth={5} />
      {up ? (
        <g>
          <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={9} fill="none" stroke={hot ? '#C8573F' : '#8B8472'} strokeWidth={3} />
          <polygon points={star(0, -h * 0.1, w * 0.26)} fill={hot ? '#C8573F' : '#C9C2AE'} stroke="#15151A" strokeWidth={4} strokeLinejoin="round" />
          <text x={0} y={h * 0.26} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.15} fill="#15151A">{label}</text>
          {sub && <text x={0} y={h * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={w * 0.1} fill="#5A5444">{sub}</text>}
        </g>
      ) : (
        <rect x={-w / 2 + 16} y={-h / 2 + 16} width={w - 32} height={h - 32} rx={9} fill="none" stroke="#E7C9A0" strokeWidth={4} strokeDasharray="12 8" />
      )}
    </g>
  );
};

/** The Paris table seen from the front: three balls behind it, papers and name plates on it.
 *  `big` makes the VNM ball larger and puts a stack of cards in front of it. */
export const ParisTable: React.FC<{ s: number; t: number; id: string; big?: boolean }> = ({ s, t, id, big = false }) => {
  const rises = (at: number) => easeOut(ramp(s, at, at + 0.35));
  const r = (own: boolean) => (own && big ? 150 : big ? 92 : 112);
  const place: { f: string; x: number; at: number; eyes: 'determined' | 'worried' | 'normal'; plate: string; own: boolean }[] = [
    { f: 'VNM', x: 540, at: 0.05, eyes: 'determined', plate: 'PHÍA VIỆT NAM', own: true },
    { f: 'USA', x: 1000, at: 0.2, eyes: 'normal', plate: 'MỸ', own: false },
    { f: 'RVN', x: 1380, at: 0.35, eyes: 'worried', plate: 'SÀI GÒN', own: false },
  ];
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#101C2B" />
      <rect x={0} y={0} width={1920} height={560} fill="#18293D" />
      <path d="M0,300 L1920,300" stroke="#2A4058" strokeWidth={6} />
      <Txt x={960} y={140} text="HỘI NGHỊ PARIS" size={70} color="#E2B95A" o={ramp(s, 0, 0.3)} />
      {place.map((p, i) => {
        const rr = r(p.own), yy = 700 - rr - (1 - rises(p.at)) * 260;
        return <Ball key={i} id={`${id}-${p.f}`} x={p.x} y={yy} r={rr} flag={p.f} eyes={p.eyes} t={t} shadow={false}
          motion={mixMotion(breathe(t, 70, 0.03, i * 12), p.own && big ? hop(t, 46, 12) : talk(t, i === 0 && s > 0.5))} />;
      })}
      {/* table: top, front face, legs */}
      <path d="M200,700 L1720,700 L1800,800 L120,800 Z" fill="#7A5638" stroke="#15151A" strokeWidth={6} strokeLinejoin="round" />
      <rect x={120} y={800} width={1680} height={74} fill="#4C331F" stroke="#15151A" strokeWidth={6} />
      <rect x={200} y={874} width={70} height={150} fill="#3B2818" stroke="#15151A" strokeWidth={5} />
      <rect x={1650} y={874} width={70} height={150} fill="#3B2818" stroke="#15151A" strokeWidth={5} />
      {place.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 110} y={816} width={220} height={44} rx={8} fill="#F1EBD8" stroke="#15151A" strokeWidth={3} />
          <text x={p.x} y={848} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#15151A">{p.plate}</text>
          {[0, 1].map((k) => {
            const u = easeOut(ramp(s, 0.4 + i * 0.12 + k * 0.1, 0.8 + i * 0.12 + k * 0.1));
            return <g key={k} transform={`translate(${p.x - 60 + k * 70 + (1 - u) * 90},${742 + k * 8 - (1 - u) * 60}) rotate(${-6 + k * 9})`} opacity={u}>
              <rect width={96} height={58} fill="#FBFAF4" stroke="#15151A" strokeWidth={3} />
              {[12, 26, 40].map((yy) => <line key={yy} x1={10} x2={86} y1={yy} y2={yy} stroke="#9AA2AD" strokeWidth={3} />)}
            </g>;
          })}
        </g>
      ))}
      {big && [0, 1, 2].map((k) => {
        const u = easeOut(ramp(s, 0.5 + k * 0.25, 0.9 + k * 0.25));
        return <g key={k} opacity={u}><PlayCard x={200 + k * 82} y={770 - (1 - u) * 120 - k * 6} w={110} rot={-12 + k * 12} label={k === 2 ? 'QUẢNG TRỊ' : ''} hot={k === 2} glow={k === 2 ? 0.5 + 0.3 * Math.sin(s * 6) : 0} /></g>;
      })}
    </g>
  );
};

/** Artillery shell glyph (nose to the right) at (x, y) with length `len`. */
export const ShellGlyph: React.FC<{ x: number; y: number; len?: number; rot?: number; o?: number }> = ({ x, y, len = 60, rot = -90, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${len / 60})`} opacity={o}>
    <path d="M-30,-9 L10,-9 Q30,-7 34,0 Q30,7 10,9 L-30,9 Z" fill="#C9A24A" stroke="#15151A" strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={-30} y={-9} width={11} height={18} fill="#8A6A2A" stroke="#15151A" strokeWidth={3} />
    <path d="M10,-9 Q30,-7 34,0 Q30,7 10,9 Z" fill="#5E6B3A" stroke="#15151A" strokeWidth={3} />
  </g>
);

/** Little 3-line label box: used for "Theo ..." source tags. */
export const SourceTag: React.FC<{ x: number; y: number; text: string; o?: number; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, text, o = 1, anchor = 'middle' }) => {
  const w = text.length * 17 + 56, x0 = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x : x - w;
  return (
    <g opacity={clamp(o)}>
      <rect x={x0} y={y - 36} width={w} height={54} rx={27} fill="#15181F" fillOpacity={0.9} stroke="#E2B95A" strokeWidth={3.5} />
      <text x={x0 + w / 2} y={y} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#E2B95A">{text}</text>
    </g>
  );
};

export type { Pt };
