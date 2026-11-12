import React from 'react';
import { FONT } from '../engine/fonts';
import { clamp01, easeOutCubic, useT } from './hud-anim';
import { PORTRAIT_HUD, usePortraitHud } from './hud-portrait-safe';

// Date chip, top-left. Static (`label`) or animated (`dates`: [{t, label}]): when the date changes the digits that
// differ roll upwards (old one out, new one in) and the chip rim flashes. Portrait frames (or `portrait`): PORTRAIT_HUD.date (x 48, y 176,
// below TikTok's top bar); `x`/`y` override the top-left corner.

export interface DateKey { t: number; label: string }
const ROLL = 0.6;       // seconds the roll lasts
const FS = 54;          // font size
const adv = (ch: string) => FS * (ch === '.' || ch === ' ' || ch === '/' ? 0.32 : 0.62); // fixed advances: stable columns

export const DateChip: React.FC<{ label?: string; dates?: DateKey[]; t?: number; id?: string; portrait?: boolean; x?: number; y?: number }> = ({ label, dates, t, id = 'hud-date', portrait, x: px, y: py }) => {
  const T = useT(t);
  const pos = usePortraitHud(portrait) ? PORTRAIT_HUD.date : { x: 56, y: 34 };
  let cur = label ?? '', prev = cur, since = 1e9;
  if (dates && dates.length) {
    let i = 0;
    while (i + 1 < dates.length && dates[i + 1].t <= T) i++;
    cur = dates[i].label; prev = i > 0 ? dates[i - 1].label : cur; since = T - dates[i].t;
  }
  const p = easeOutCubic(clamp01(since / ROLL));
  const n = Math.max(cur.length, prev.length);
  const c = cur.padStart(n), pr = prev.padStart(n);
  const widths = [...c].map(adv), total = widths.reduce((a, b) => a + b, 0);
  const W = Math.max(300, 112 + total + 40);
  const flash = since < 0.9 ? 1 - clamp01(since / 0.9) : 0;
  let x = 112;
  const cells = [...c].map((ch, k) => {
    const x0 = x; x += widths[k];
    const rolling = pr[k] !== ch && p < 1;
    const cx = x0 + widths[k] / 2;
    return (
      <g key={k}>
        {rolling && <text x={cx} y={64 - p * 70} textAnchor="middle" fontSize={FS} fontFamily={FONT.title} fontWeight={800} fill="#F2F2F2" opacity={1 - p}>{pr[k]}</text>}
        <text x={cx} y={64 + (rolling ? (1 - p) * 70 : 0)} textAnchor="middle" fontSize={FS} fontFamily={FONT.title} fontWeight={800} fill={rolling ? '#FFE9B0' : '#F2F2F2'}>{ch}</text>
      </g>
    );
  });
  return (
    <g transform={`translate(${px ?? pos.x},${py ?? pos.y})`}>
      <clipPath id={`${id}-clip`}><rect x={100} y={8} width={W - 120} height={76} /></clipPath>
      <rect width={W} height={92} rx={46} fill="#15181F" fillOpacity={0.88} stroke={flash > 0 ? '#FFE9B0' : '#E2B95A'} strokeWidth={4 + 3 * flash} />
      <g transform="translate(40,22)" fill="none" stroke="#E2B95A" strokeWidth={5}>
        <rect y={6} width={44} height={40} rx={6} /><line x1={0} y1={18} x2={44} y2={18} />
        <line x1={11} y1={0} x2={11} y2={10} /><line x1={33} y1={0} x2={33} y2={10} />
        {[0, 1, 2].map((i) => <rect key={i} x={7 + i * 12} y={26} width={6} height={6} fill="#E2B95A" stroke="none" />)}
      </g>
      <g clipPath={`url(#${id}-clip)`}>{cells}</g>
    </g>
  );
};
