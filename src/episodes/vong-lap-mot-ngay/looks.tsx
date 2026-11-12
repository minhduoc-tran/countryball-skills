import React from 'react';
import { LookDef, UI, FONT } from '../../engine';
import { PAL } from './kit-palette';
import { LoopIcon } from './kit-loop-clock';

// The loop episode's looks ("look": "<name>" on edit entries; tools/merge-chapters.py imports `looks`).
// Chips top-left (a cyan loop icon + the label): day2 NGÀY #2, day5 NGÀY #5, day10 NGÀY #10, day50 NGÀY #50,
//   day122 NGÀY #122, year1 1 NĂM, year10 10 NĂM (slightly cooler/flatter as the years pile up).
// midnight: deep blue grade, chip "23:59" (red dot). thursday: fresh bright warm, chip "THỨ NĂM" (green dot).
// No chip: reset (cyan cool grade + subtle rolling scanlines), rain (blue-grey), tired (desaturated, heavy vignette
//   that breathes, slow blur pulse), memory (soft sepia + faint cyan edge: a remembered past loop), perfect (golden
//   hour warm), dawn (peach morning).

const Chip: React.FC<{ label: string; f: number; dot?: string; loop?: boolean }> = ({ label, f, dot = '#FF5A48', loop = false }) => (
  <g transform="translate(70 70)">
    <rect x={0} y={0} width={label.length * 22 + 100} height={72} rx={36} fill={UI.pill} opacity={0.74} />
    {loop ? <LoopIcon x={40} y={36} r={15} t={f} spin={-3} /> : <circle cx={38} cy={36} r={11} fill={dot} opacity={f % 30 < 18 ? 1 : 0.35} />}
    <text x={66} y={48} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={UI.text} letterSpacing={2}>{label}</text>
  </g>
);

type OV = React.FC<{ f: number; lv: number }>;
const chipLook = (label: string, grade: (lv: number) => string, o: { dot?: string; loop?: boolean; extra?: OV } = {}): LookDef => ({
  grade,
  Overlay: ({ f, lv }) => (
    <g>
      {o.extra ? React.createElement(o.extra, { f, lv }) : null}
      <Chip label={label} f={f} dot={o.dot} loop={o.loop} />
    </g>
  ),
});
const plain = (grade: (lv: number) => string, extra?: OV): LookDef => ({ grade, Overlay: extra ? ({ f, lv }) => React.createElement(extra, { f, lv }) : undefined });

/** A colour wash over the frame (multiply darkens toward the colour, screen lifts toward it). */
const wash = (color: string, o: number, mode: 'multiply' | 'screen' | 'normal' = 'multiply'): OV => ({ lv }) => (
  <rect x={0} y={0} width={1920} height={1080} fill={color} opacity={o * lv} style={{ mixBlendMode: mode }} />
);
const Scan: OV = ({ f, lv }) => (
  <g opacity={0.12 * lv}>
    {Array.from({ length: 36 }).map((_, k) => <rect key={k} x={0} y={((k * 30 + f * 2) % 1080)} width={1920} height={4} fill="#0A2A36" />)}
  </g>
);
const Reset: OV = (p) => (
  <g>
    {wash(PAL.cyan, 0.12, 'screen')(p)}
    <Scan {...p} />
  </g>
);
/** Tired: a heavy vignette that breathes like heavy eyelids, and the picture blurring in slow pulses (backdrop blur). */
const Tired: OV = ({ f, lv }) => {
  const pulse = 0.5 + 0.5 * Math.sin(f / 14);
  return (
    <g>
      <defs>
        <radialGradient id="vlTiredVig" cx="50%" cy="50%" r="62%">
          <stop offset="45%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#05040A" stopOpacity={0.9} />
        </radialGradient>
      </defs>
      <foreignObject x={0} y={0} width={1920} height={1080}>
        <div style={{ width: 1920, height: 1080, backdropFilter: `blur(${(0.4 + 2.6 * pulse * pulse) * lv}px)` }} />
      </foreignObject>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#vlTiredVig)" opacity={(0.75 + 0.25 * pulse) * lv} />
    </g>
  );
};
/** Memory: soft sepia with a faint cyan edge glow round the frame. */
const Memory: OV = ({ f, lv }) => (
  <g>
    <defs>
      <radialGradient id="vlMemEdge" cx="50%" cy="50%" r="72%">
        <stop offset="60%" stopColor={PAL.cyan} stopOpacity={0} />
        <stop offset="100%" stopColor={PAL.cyan} stopOpacity={0.4} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#vlMemEdge)" opacity={(0.8 + 0.2 * Math.sin(f / 18)) * lv} style={{ mixBlendMode: 'screen' }} />
  </g>
);
/** Midnight: the picture sinks into deep blue (a blue multiply, then a faint navy lift so blacks read blue, not grey). */
const Midnight: OV = (p) => (
  <g>
    {wash('#2E3E8E', 0.6)(p)}
    {wash(PAL.midnight, 0.25, 'screen')(p)}
  </g>
);

const day = (n: string) => chipLook(`NGÀY #${n}`, (lv) => `saturate(${1 - 0.05 * lv}) contrast(${1 + 0.03 * lv})`, { loop: true });

export const looks = {
  day2: day('2'),
  day5: day('5'),
  day10: day('10'),
  day50: day('50'),
  day122: day('122'),
  year1: chipLook('1 NĂM', (lv) => `saturate(${1 - 0.12 * lv}) contrast(${1 + 0.03 * lv})`, { loop: true }),
  year10: chipLook('10 NĂM', (lv) => `saturate(${1 - 0.2 * lv}) sepia(${0.08 * lv}) contrast(${1 + 0.04 * lv})`, { loop: true }),
  midnight: chipLook('23:59', (lv) => `brightness(${1 - 0.05 * lv}) saturate(${1 - 0.3 * lv}) contrast(${1 + 0.08 * lv})`, { dot: '#FF5A48', extra: Midnight }),
  reset: plain((lv) => `saturate(${1 - 0.35 * lv}) hue-rotate(${-12 * lv}deg) brightness(${1 + 0.06 * lv}) contrast(${1 + 0.08 * lv})`, Reset),
  rain: plain((lv) => `saturate(${1 - 0.5 * lv}) brightness(${1 - 0.04 * lv}) contrast(${1 + 0.03 * lv})`, wash('#6E86AE', 0.5)),
  tired: plain((lv) => `saturate(${1 - 0.6 * lv}) contrast(${1 - 0.06 * lv}) brightness(${1 - 0.05 * lv})`, Tired),
  memory: plain((lv) => `sepia(${0.55 * lv}) saturate(${1 - 0.2 * lv}) contrast(${1 - 0.06 * lv}) brightness(${1 + 0.04 * lv})`, Memory),
  perfect: plain((lv) => `sepia(${0.22 * lv}) saturate(${1 + 0.25 * lv}) brightness(${1 + 0.05 * lv}) contrast(${1 + 0.03 * lv})`, wash('#FFB25A', 0.1, 'screen')),
  thursday: chipLook('THỨ NĂM', (lv) => `brightness(${1 + 0.07 * lv}) saturate(${1 + 0.15 * lv}) contrast(${1 + 0.02 * lv})`, { dot: '#5BE08A', extra: wash('#FFF0C8', 0.08, 'screen') }),
  dawn: plain((lv) => `sepia(${0.12 * lv}) saturate(${1 + 0.12 * lv}) brightness(${1 + 0.04 * lv})`, wash(PAL.dawn, 0.1, 'screen')),
};
