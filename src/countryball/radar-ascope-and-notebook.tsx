import React from 'react';
import { FONT } from '../engine/fonts';
import { Glow } from './fx-glow';
import { clamp, hash, prog } from './fx-math';
import { star } from './ball-flags';

// Radar side panel + notebook prop.
//   <AScope id t x y w h noise? reveal? peakAt? label? />   A-scope: range along x, echo strength up. Noise hash re-rolls every
//        2 frames; `reveal` 0..1 grows a steady spike at peakAt (0..1 of the width) out of the noise, which stays high.
//   <ManualNotebook x y s? rot? title? />                    "cẩm nang đánh B-52" notebook (red cover, yellow star, ring spine)

const G = '#46FF7A';

export const AScope: React.FC<{ id: string; t: number; x: number; y: number; w: number; h: number; noise?: number; reveal?: number; peakAt?: number; label?: string }> = ({
  id, t, x, y, w, h, noise = 0.8, reveal = 0, peakAt = 0.62, label = 'CỰ LY',
}) => {
  const n = 110, k = Math.floor(t / 2), base = y + h * 0.82;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, nz = (hash(i, k * 0.9) * 0.6 + hash(i + 1, k * 0.9 + 4) * 0.4) * noise * h * 0.5 * (0.5 + 0.5 * Math.sin(u * 9 + k * 0.3) ** 2 + 0.3);
    const spike = reveal * h * 0.62 * Math.exp(-Math.pow((u - peakAt) / 0.014, 2)) * (0.92 + 0.08 * hash(k, 3));
    pts.push(`${(x + u * w).toFixed(1)},${(base - clamp(nz * 0.8 + spike, 0, h * 0.8)).toFixed(1)}`);
  }
  return (
    <g>
      <defs><clipPath id={`as-clip-${id}`}><rect x={x} y={y} width={w} height={h} rx={10} /></clipPath></defs>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={14} fill="#23282E" stroke="#0C0E10" strokeWidth={5} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#04120A" />
      <g clipPath={`url(#as-clip-${id})`}>
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={x + (w * (i + 1)) / 10} y1={y} x2={x + (w * (i + 1)) / 10} y2={y + h} stroke="#145A2C" strokeWidth={1.5} />)}
        {Array.from({ length: 4 }, (_, i) => <line key={i} x1={x} y1={y + (h * (i + 1)) / 5} x2={x + w} y2={y + (h * (i + 1)) / 5} stroke="#145A2C" strokeWidth={1.5} />)}
        <polyline points={pts.join(' ')} fill="none" stroke={G} strokeWidth={9} opacity={0.18} strokeLinejoin="round" />
        <polyline points={pts.join(' ')} fill="none" stroke="#B8FFC9" strokeWidth={2.6} strokeLinejoin="round" />
      </g>
      {reveal > 0.3 && <Glow x={x + peakAt * w} y={base - h * 0.5 * reveal} r={h * 0.25} color="#FFD43B" o={0.18 * reveal} />}
      <text x={x + 10} y={y + h - 10} fontFamily={FONT.ui} fontSize={Math.max(11, h * 0.09)} fill="#2E9E56">{label}</text>
    </g>
  );
};

export const ManualNotebook: React.FC<{ x: number; y: number; s?: number; rot?: number; title?: string[] }> = ({ x, y, s = 1, rot = 0, title = ['CẨM NANG', 'ĐÁNH B-52'] }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-96} width={150} height={196} rx={8} fill="#E9E1CB" stroke="#111" strokeWidth={5} transform="translate(8,8)" />
    <rect x={-80} y={-100} width={150} height={196} rx={8} fill="#B3281F" stroke="#111" strokeWidth={5} />
    <rect x={-80} y={-100} width={20} height={196} rx={6} fill="#7E1A14" stroke="#111" strokeWidth={5} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-90} y={-82 + i * 30} width={22} height={10} rx={5} fill="#C9CDD2" stroke="#111" strokeWidth={3.5} />)}
    <polygon points={star(8, -52, 24)} fill="#FFCD00" stroke="#111" strokeWidth={3} strokeLinejoin="round" />
    <rect x={-48} y={-12} width={112} height={72} rx={4} fill="#F4ECD3" stroke="#111" strokeWidth={4} />
    {title.map((l, i) => <text key={l} x={8} y={14 + i * 24} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={title.some((q) => q.length > 8) ? 19 : 22} fill="#1B1B20">{l}</text>)}
    <line x1={-34} y1={50} x2={50} y2={50} stroke="#B3281F" strokeWidth={3} />
  </g>
);
