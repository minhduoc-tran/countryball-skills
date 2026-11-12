import React from 'react';
import { Schematic, SCH, FONT, clamp, easeOut, backOut } from '../../engine';
import { PAL } from './kit-palette';

// Chapter B (3/4): two stylised blueprint maps (fill 0..1920 x 1080 incl. the <Schematic> ground). Pure functions of t.
//   <VietnamMap id t dry={0..1} walk={0..1} labels? />   S-shaped coast on the left, sea to the east that dries as a tan wipe
//     (dry), a dotted path Đà Nẵng (860, 520) -> Hoàng Sa (1380, 500) with a walker pin (walk), plateaus rising at Hoàng Sa.
//   <SundaMap id t shelf={0..1} walk={0..1} />   SE Asia: dark land today, the Sunda shelf turns to tan land at shelf=1 and a
//     dotted path runs from southern Việt Nam (900, 505) to BORNEO (1180, 640).
const LAND = '#3E6B4B';
const LAND_EDGE = '#9CC79A';
const SEA = '#2E86C1';
const TAN = '#C9AE7A';

/** Smooth closed/open path through points using midpoint quadratics. */
export const smooth = (p: [number, number][], closed = true): string => {
  const n = p.length;
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = '';
  const start = closed ? mid(p[n - 1], p[0]) : p[0];
  d += `M ${start[0]} ${start[1]} `;
  for (let i = closed ? 0 : 1; i < (closed ? n : n - 1); i++) {
    const m = mid(p[i], p[(i + 1) % n]);
    d += `Q ${p[i][0]} ${p[i][1]} ${m[0]} ${m[1]} `;
  }
  if (!closed) d += `L ${p[n - 1][0]} ${p[n - 1][1]}`;
  return d + (closed ? 'Z' : '');
};

const COAST: [number, number][] = [[820, 100], [790, 170], [760, 230], [750, 300], [770, 380], [810, 450], [860, 520], [900, 580], [930, 650], [960, 720], [985, 790], [960, 850], [900, 905], [840, 935], [760, 985], [700, 1010]];
const WEST: [number, number][] = [[640, 980], [610, 900], [640, 800], [700, 720], [730, 640], [690, 560], [660, 470], [700, 400], [640, 330], [580, 250], [560, 180], [600, 100], [640, 60], [820, 60]];

/** A dotted bezier that reveals up to `p`, with a walker pin at the head. */
export const DotPath: React.FC<{ a: [number, number]; c: [number, number]; b: [number, number]; p: number; t: number; n?: number; col?: string }> = ({ a, c, b, p, t, n = 26, col = '#FFE27A' }) => {
  const at = (u: number): [number, number] => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  const head = at(clamp(p));
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const u = i / (n - 1);
        if (u > p) return null;
        const [x, y] = at(u);
        return <circle key={i} cx={x} cy={y} r={7} fill={col} stroke={PAL.ink} strokeWidth={2} />;
      })}
      {p > 0 && p < 1 ? (
        <g transform={`translate(${head[0]} ${head[1] - 4 + Math.sin(t * 0.7) * 3})`}>
          <circle cx={0} cy={-30} r={20} fill="#FF5A48" stroke={PAL.ink} strokeWidth={3.5} />
          <path d="M -14 -16 L 0 8 L 14 -16 Z" fill="#FF5A48" stroke={PAL.ink} strokeWidth={3.5} strokeLinejoin="round" />
          <circle cx={0} cy={-30} r={8} fill="#FFF4DA" />
        </g>
      ) : null}
    </g>
  );
};

const Pill: React.FC<{ x: number; y: number; t: number; text: string; color?: string; size?: number }> = ({ x, y, t, text, color = SCH.line, size = 44 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  const w = text.length * size * 0.62 + 44;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.4} rx={size * 0.7} fill="#0B1220" opacity={0.85} stroke={color} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={color} letterSpacing={2}>{text}</text>
    </g>
  );
};
export { Pill as MapPill };

export const VietnamMap: React.FC<{ id: string; t: number; dry?: number; walk?: number; labels?: boolean; qmark?: number }> = ({ id, t, dry = 0, walk = 0, labels = true, qmark = 0 }) => {
  const land = smooth([...COAST, ...WEST]);
  const seaPts = [...COAST].reverse();
  const sea = `M 820 60 L 1920 60 L 1920 1080 L 700 1080 L 700 1010 ` + seaPts.map(([x, y]) => `L ${x} ${y}`).join(' ') + ' Z';
  const edge = 640 + easeOut(clamp(dry)) * 1350;
  const wob = (k: number) => Math.sin(k * 0.9 + t * 0.2) * 8;
  const plateau = labels ? clamp((dry - 0.55) / 0.35) : 0;
  return (
    <g>
      <Schematic t={t} id={id} />
      <defs>
        <clipPath id={`${id}sea`}><path d={sea} /></clipPath>
      </defs>
      <path d={sea} fill={SEA} opacity={0.88} />
      <g clipPath={`url(#${id}sea)`}>
        <path d={`M 640 0 L ${edge} 0 ` + Array.from({ length: 12 }).map((_, k) => `L ${edge + wob(k)} ${k * 100}`).join(' ') + ` L ${edge} 1120 L 640 1120 Z`} fill={TAN} />
        {[0.3, 0.55, 0.8].map((k, i) => <path key={i} d={smooth(COAST.map(([x, y]) => [x + k * 560, y] as [number, number]), false)} stroke="#8D7A52" strokeWidth={3} fill="none" strokeDasharray="14 12" opacity={dry > k ? 0.7 : 0} />)}
        <rect x={edge - 8} y={0} width={14} height={1120} fill="#E8F7FC" opacity={dry > 0.02 && dry < 0.99 ? 0.8 : 0} />
      </g>
      <path d={land} fill={LAND} stroke={LAND_EDGE} strokeWidth={5} strokeLinejoin="round" />
      {/* Hoàng Sa plateaus: a few mesas lifting out of the dry sea */}
      {[[1330, 520, 70], [1385, 495, 92], [1450, 525, 62]].map(([x, y, w], i) => (
        <g key={i} opacity={plateau} transform={`translate(0 ${(1 - plateau) * 30})`}>
          <path d={`M ${x - w} ${y + 24} L ${x - w * 0.8} ${y - 18} L ${x + w * 0.8} ${y - 18} L ${x + w} ${y + 24} Z`} fill="#A07A4E" stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M ${x - w * 0.8} ${y - 18} L ${x + w * 0.8} ${y - 18}`} stroke="#E0C48E" strokeWidth={5} />
        </g>
      ))}
      {labels ? (
        <g>
          <circle cx={860} cy={520} r={12} fill="#FFE27A" stroke={PAL.ink} strokeWidth={3} />
          <text x={836} y={532} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#F6EFE3">ĐÀ NẴNG</text>
        </g>
      ) : null}
      {qmark > 0 ? <text x={1180} y={420} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={220 * backOut(clamp(qmark))} fill="#FFE27A" stroke={PAL.ink} strokeWidth={6} paintOrder="stroke">?</text> : null}
      {walk > 0 ? <DotPath a={[870, 524]} c={[1100, 430]} b={[1330, 500]} p={walk} t={t} n={22} /> : null}
      {labels && walk > 0.9 ? <Pill x={1390} y={400} t={t - 0} text="HOÀNG SA" color="#FFE27A" /> : null}
    </g>
  );
};

const MAIN = 'M -50 -50 L 1000 -50 L 970 100 L 1020 200 L 1040 300 L 1010 400 L 940 470 L 905 520 L 840 480 L 770 420 L 700 380 L 690 440 L 740 530 L 800 620 L 840 720 L 780 745 L 720 670 L 660 590 L 620 500 L 600 400 L 560 300 L 520 200 L 480 -50 Z';
const SUMATRA = 'M 330 620 L 420 600 L 560 690 L 700 800 L 780 880 L 740 910 L 600 860 L 440 760 L 340 680 Z';
const BORNEO = 'M 1060 600 L 1130 540 L 1250 520 L 1340 570 L 1380 660 L 1330 780 L 1230 830 L 1130 800 L 1080 720 Z';
const JAVA = 'M 830 930 L 980 915 L 1150 930 L 1140 960 L 980 955 L 840 960 Z';
const SHELF = 'M 700 400 Q 900 380 1100 440 Q 1350 480 1440 620 Q 1450 780 1300 870 Q 1100 930 900 900 Q 650 850 480 740 Q 330 650 300 610 L 400 590 Q 560 560 640 440 Z';

export const SundaMap: React.FC<{ id: string; t: number; shelf?: number; walk?: number; showStamp?: boolean }> = ({ id, t, shelf = 0, walk = 0 }) => {
  const k = easeOut(clamp(shelf));
  const g = (d: string) => <path d={d} fill={LAND} stroke={LAND_EDGE} strokeWidth={4} strokeLinejoin="round" />;
  return (
    <g>
      <Schematic t={t} id={id} />
      <rect x={-100} y={-100} width={2120} height={1300} fill={SEA} opacity={0.72} />
      <path d={SHELF} fill={TAN} opacity={k} />
      <path d={SHELF} fill="none" stroke="#E8D5A5" strokeWidth={4} strokeDasharray="16 12" opacity={k} />
      {g(MAIN)}{g(SUMATRA)}{g(BORNEO)}{g(JAVA)}
      <text x={800} y={230} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#F6EFE3" letterSpacing={3}>VIỆT NAM</text>
      <text x={1235} y={690} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={54} fill="#F6EFE3" letterSpacing={4}>BORNEO</text>
      {walk > 0 ? <DotPath a={[900, 508]} c={[1010, 560]} b={[1170, 640]} p={walk} t={t} n={14} /> : null}
      <Pill x={1520} y={260} t={t - 4} text="−120 M" color="#FFE27A" size={64} />
    </g>
  );
};
