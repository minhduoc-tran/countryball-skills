import React from 'react';
import { FONT } from '../engine/fonts';
import { easeInOutCubic, useT } from './hud-anim';
import { PORTRAIT_HUD, usePortraitHud } from './hud-portrait-safe';

// Counter pill, top-right: optional label + a number that counts up smoothly between keys (`steps`) and pulses
// (scale + rim flash) every time the shown integer changes. Static use: value="9.180.000" or value={34}.
// Portrait frames (or `portrait`): right edge 1032, second HUD row (y 290), width 500; `right`/`y` override the anchor.

export interface CountKey { t: number; value: number }
/** 34 -> "34", 9180000 -> "9.180.000" (Vietnamese thousands dot). */
export const fmtVi = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Counter value at time t: eased between consecutive keys, held before the first / after the last. */
export function countAt(steps: CountKey[], t: number): number {
  if (t <= steps[0].t) return steps[0].value;
  for (let i = 0; i + 1 < steps.length; i++) {
    const a = steps[i], b = steps[i + 1];
    if (t < b.t) return a.value + (b.value - a.value) * easeInOutCubic((t - a.t) / (b.t - a.t));
  }
  return steps[steps.length - 1].value;
}

const FPS_SCAN = 30;
export const Counter: React.FC<{
  value?: number | string; unit?: string; label?: string; steps?: CountKey[]; t?: number; width?: number; accent?: string; portrait?: boolean; right?: number; y?: number;
}> = ({ value = 0, unit, label, steps, t, width: w0, accent = '#C9343A', portrait, right, y }) => {
  const T = useT(t);
  const P = usePortraitHud(portrait), width = w0 ?? (P ? PORTRAIT_HUD.counter.width : 560);
  const ax = right ?? (P ? PORTRAIT_HUD.counter.right : 1864), ay = y ?? (P ? PORTRAIT_HUD.counter.y : 34);
  let shown: string;
  let pulse = 0;
  if (steps && steps.length) {
    const v = Math.round(countAt(steps, T));
    shown = fmtVi(v);
    // time since the shown integer last changed (scan back 0.4 s): drives the pulse
    for (let k = 1; k <= Math.round(0.4 * FPS_SCAN); k++) {
      if (Math.round(countAt(steps, T - k / FPS_SCAN)) !== v) { pulse = 1 - (k - 1) / (0.4 * FPS_SCAN); break; }
    }
  } else shown = typeof value === 'number' ? fmtVi(value) : value;
  const k = 1 + 0.16 * pulse * pulse; // pop on change, settles 0.4 s after the last change
  const txt = { fontFamily: FONT.title, fontWeight: 800, fill: '#F2F2F2' } as const;
  const anchorX = label ? -38 : -width / 2;
  return (
    <g transform={`translate(${ax},${ay})`}>
      <rect x={-width} width={width} height={92} rx={46} fill="#15181F" fillOpacity={0.88} stroke={pulse > 0 ? '#FF6F6F' : accent} strokeWidth={4 + 3 * pulse} />
      {label && <text x={-width + 40} y={59} fontSize={30} fill="#E2B95A" fontFamily={FONT.title} fontWeight={800} letterSpacing={1}>{label}</text>}
      <g transform={`translate(${anchorX},0)`}>
        <g transform={`translate(0,64) scale(${k}) translate(0,-64)`}>
          <text textAnchor={label ? 'end' : 'middle'} y={64} fontSize={50} {...txt}>
            {shown}{unit && <tspan fontSize={34} fill="#E2B95A" dx={14}>{unit}</tspan>}
          </text>
        </g>
      </g>
    </g>
  );
};
