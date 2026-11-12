import React from 'react';
import { SCH, FONT, clamp, easeOut, backOut } from '../../engine';

// Chapter D, "relative poverty": the explanation card. Nine people stand on bars of income sorted low to high; the
// middle one is "MỨC GIỮA"; a red line sits at 60% of it; everyone under the line is flagged red. Geometry comes from
// one function, so growing every bar (`u`) moves the line with them: the same three stay under it.

const INK = '#1D2033';
const RED = '#FF5A48';
export const VALS = [28, 36, 42, 58, 72, 92, 118, 150, 190];
export const BASE = 910;
const BAR_W = 118;
const GAP = 172;
export const barX = (i: number) => 960 + (i - 4) * GAP;
export const barTop = (i: number, u: number) => BASE - VALS[i] * u;
/** The red line: 60% of the middle bar. */
export const lineY = (u: number) => BASE - 0.6 * VALS[4] * u;
export const UNDER = [0, 1, 2]; // the people under the line (28, 36, 42 < 43.2)

/** A person standing at (x, y) = feet: head, shoulders, a dark outline; `c` the fill. */
export const Standee: React.FC<{ x: number; y: number; s?: number; c?: string; o?: number }> = ({ x, y, s = 1, c = '#F6EFE3', o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={2} rx={34} ry={7} fill="#000" opacity={0.3} />
    <path d="M -28 0 Q -30 -48 0 -52 Q 30 -48 28 0 Z" fill={c} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={0} cy={-80} r={25} fill={c} stroke={INK} strokeWidth={5} />
  </g>
);

export const IncomeCard: React.FC<{
  t: number; id: string; u: number;
  pop?: number; // 0..1: bars and people grow in, left to right
  line?: number; // 0..1: the red line draws on from the left
  mid?: number; // 0..1: the "MỨC GIỮA" marker pops
  flag?: number; // 0..1: the people under the line turn red
  cmp?: number; // 0..1: a compare arrow between the lowest and highest
  ghostU?: number; // a dashed ghost of the bars at this older scale
}> = ({ t, id, u, pop = 1, line = 0, mid = 0, flag = 0, cmp = 0, ghostU }) => {
  const ly = lineY(u);
  const lp = easeOut(clamp(line));
  const pulse = 0.65 + 0.35 * Math.sin(t / 3.2);
  return (
    <g>
      <rect x={150} y={BASE} width={1620} height={8} rx={4} fill={SCH.dim} />
      {VALS.map((v, i) => {
        const q = easeOut(clamp(pop * 1.6 - i * 0.075));
        const under = UNDER.includes(i);
        const red = under ? flag : 0;
        const x = barX(i);
        const h = v * u * q;
        return (
          <g key={i}>
            <rect x={x - BAR_W / 2} y={BASE - h} width={BAR_W} height={h} rx={8} fill={red > 0 ? '#8A2E36' : '#2F4F86'} stroke={red > 0 ? RED : '#6F93D6'} strokeWidth={4} />
            <rect x={x - BAR_W / 2 + 10} y={BASE - h + 10} width={14} height={Math.max(0, h - 20)} rx={7} fill="#fff" opacity={0.1} />
          </g>
        );
      })}
      {ghostU ? VALS.map((v, i) => <rect key={`g${i}`} x={barX(i) - BAR_W / 2 + 6} y={BASE - v * ghostU} width={BAR_W - 12} height={v * ghostU} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={3} strokeDasharray="10 8" />) : null}
      {/* the red line at 60%: behind the people, in front of the bars */}
      {line > 0 ? (
        <g>
          <line x1={170} y1={ly} x2={170 + 1520 * lp} y2={ly} stroke={RED} strokeWidth={8} strokeDasharray="22 12" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${RED}99)` }} />
          <g transform={`translate(1752 ${ly}) scale(${backOut(clamp((lp - 0.85) * 6))})`}>
            <rect x={-62} y={-34} width={124} height={68} rx={34} fill={RED} stroke={INK} strokeWidth={5} />
            <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#fff">60%</text>
          </g>
        </g>
      ) : null}
      {VALS.map((v, i) => {
        const q = easeOut(clamp(pop * 1.6 - i * 0.075));
        const red = UNDER.includes(i) ? flag : 0;
        return q > 0.05 ? <Standee key={i} x={barX(i)} y={BASE - v * u * q - 2} s={1.25} c={red > 0.5 ? RED : '#F6EFE3'} /> : null;
      })}
      {/* the middle bar's marker */}
      {mid > 0 ? (
        <g opacity={clamp(mid * 3)}>
          <rect x={barX(4) - BAR_W / 2 - 8} y={barTop(4, u) - 8} width={BAR_W + 16} height={VALS[4] * u + 8} rx={12} fill="none" stroke="#FFE27A" strokeWidth={6} />
          <g transform={`translate(${barX(4)} ${barTop(4, u) - 190 + Math.sin(t / 5) * 6}) scale(${backOut(clamp(mid))})`}>
            <rect x={-150} y={-34} width={300} height={62} rx={31} fill="#FFE27A" stroke={INK} strokeWidth={5} />
            <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill={INK} letterSpacing={2}>MỨC GIỮA</text>
            <path d="M -14 28 L 0 52 L 14 28 Z" fill="#FFE27A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          </g>
        </g>
      ) : null}
      {/* "NGUY CƠ NGHÈO" over the flagged three */}
      {flag > 0 ? (
        <g transform={`translate(${(barX(0) + barX(2)) / 2} ${barTop(2, u) - 170}) scale(${backOut(clamp(flag * 1.5))})`} opacity={pulse * 0.4 + 0.6}>
          <rect x={-250} y={-34} width={500} height={64} rx={32} fill={RED} stroke={INK} strokeWidth={5} />
          <text y={11} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#fff" letterSpacing={2}>NGUY CƠ NGHÈO</text>
        </g>
      ) : null}
      {/* compare arrow between the lowest and the highest */}
      {cmp > 0 ? (
        <g opacity={clamp(cmp * 3)}>
          <circle cx={barX(0)} cy={barTop(0, u) - 150} r={10} fill={SCH.live} />
          <circle cx={barX(8)} cy={barTop(8, u) - 150} r={10} fill={SCH.live} opacity={easeOut(clamp(cmp * 1.5 - 0.5))} />
          <path id={`${id}cmp`} d={`M ${barX(0)} ${barTop(0, u) - 150} Q ${960} ${barTop(8, u) - 330} ${barX(8)} ${barTop(8, u) - 150}`} stroke={SCH.live} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - easeOut(clamp(cmp))} />
          <g transform={`translate(960 ${barTop(8, u) - 292}) scale(${backOut(clamp((cmp - 0.5) * 3))})`}>
            <rect x={-130} y={-32} width={260} height={60} rx={30} fill="#0B1226" stroke={SCH.live} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill={SCH.live} letterSpacing={2}>SO SÁNH</text>
          </g>
        </g>
      ) : null}
    </g>
  );
};
