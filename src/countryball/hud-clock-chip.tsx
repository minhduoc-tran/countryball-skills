import React from 'react';
import { FONT } from '../engine/fonts';
import { clamp01, easeOutCubic, useT } from './hud-anim';
import { PORTRAIT_HUD, usePortraitHud } from './hud-portrait-safe';

// Clock chip, top-left (same place and look as <DateChip/>): "30.04.1975 · 10:45" with ROLLING minutes, for the last day.
// The times are DATA passed in by the shot, never hard-coded:
//   <ClockChip date="30.04.1975" clock={[{ t: 0, time: '10:45' }, { t: 12, time: '11:30' }]} t? />
//   clock keys: `t` in SECONDS (the HUD convention, like DateChip: pass t = frame / 30), `time` 'HH:MM'. Between two keys the clock runs
//   LINEARLY (minute by minute, digits roll upwards on every change), so 45 minutes in 12 s ticks about every 0.27 s; before the first
//   key it shows the first time, after the last it holds. A single static time: clock="10:45" or time="10:45".
//   `pulse` (default true) flashes the rim when a key is reached (a time jump).
// Pure function of t (no state). Without `t` it reads the current frame. Portrait frames (or `portrait`): PORTRAIT_HUD.date; `x`/`y` override.

export interface ClockKey { t: number; time: string }
const FS = 54, ROLL = 0.3;
const adv = (ch: string) => FS * (ch === '.' || ch === ' ' || ch === ':' || ch === '·' ? 0.34 : 0.62);
const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.round(m) % 60).padStart(2, '0')}`;

/** Minute-of-day shown at time T, the time (s) since the last minute change, seconds per minute step, and the running direction (+1/-1). */
export function clockAt(keys: ClockKey[], T: number): { minute: number; since: number; step: number; dir: number } {
  if (keys.length === 1 || T <= keys[0].t) return { minute: toMin(keys[0].time), since: 1e9, step: 1, dir: 1 };
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].t <= T) i++;
  if (i + 1 >= keys.length) return { minute: toMin(keys[i].time), since: T - keys[i].t, step: 1, dir: 1 };
  const a = keys[i], b = keys[i + 1], ma = toMin(a.time), mb = toMin(b.time), span = Math.max(1e-6, b.t - a.t);
  const dir = mb >= ma ? 1 : -1, per = mb === ma ? 1e9 : span / Math.abs(mb - ma), steps = Math.floor(Math.abs(mb - ma) * ((T - a.t) / span));
  return { minute: ma + dir * steps, since: (T - a.t) - steps * per, step: per, dir };
}

export const ClockChip: React.FC<{ date: string; clock?: ClockKey[] | string; time?: string; t?: number; id?: string; pulse?: boolean; portrait?: boolean; x?: number; y?: number }> = ({ date, clock, time, t, id = 'hud-clock', pulse = true, portrait, x: px, y: py }) => {
  const T = useT(t);
  const pos = usePortraitHud(portrait) ? PORTRAIT_HUD.date : { x: 56, y: 34 };
  const keys: ClockKey[] = Array.isArray(clock) ? clock : [{ t: 0, time: (clock as string | undefined) ?? time ?? '00:00' }];
  const { minute, since, step, dir } = clockAt(keys, T);
  const cur = `${date} · ${fmt(minute)}`, prev = `${date} · ${fmt(minute - dir)}`;
  const rollDur = Math.min(ROLL, step * 0.9), p = easeOutCubic(clamp01(since / rollDur));
  const widths = [...cur].map(adv), total = widths.reduce((a, b) => a + b, 0), W = 112 + total + 40;
  const keyHit = keys.some((k, i) => i > 0 && T - k.t >= 0 && T - k.t < 0.9);
  const flash = pulse && keyHit ? 1 - clamp01(Math.min(...keys.filter((k, i) => i > 0 && T - k.t >= 0).map((k) => T - k.t)) / 0.9) : 0;
  let x = 112;
  const cells = [...cur].map((ch, k) => {
    const x0 = x; x += widths[k];
    const rolling = prev[k] !== undefined && prev[k] !== ch && p < 1 && k >= date.length + 3;   // only the clock digits roll
    const cx = x0 + widths[k] / 2;
    return (
      <g key={k}>
        {rolling && <text x={cx} y={64 - p * 70} textAnchor="middle" fontSize={FS} fontFamily={FONT.title} fontWeight={800} fill="#F2F2F2" opacity={1 - p}>{prev[k]}</text>}
        <text x={cx} y={64 + (rolling ? (1 - p) * 70 : 0)} textAnchor="middle" fontSize={FS} fontFamily={FONT.title} fontWeight={800} fill={rolling ? '#FFE9B0' : k > date.length ? '#FFE9B0' : '#F2F2F2'}>{ch}</text>
      </g>
    );
  });
  return (
    <g transform={`translate(${px ?? pos.x},${py ?? pos.y})`}>
      <clipPath id={`${id}-clip`}><rect x={100} y={8} width={W - 120} height={76} /></clipPath>
      <rect width={W} height={92} rx={46} fill="#15181F" fillOpacity={0.88} stroke={flash > 0 ? '#FFE9B0' : '#E2B95A'} strokeWidth={4 + 3 * flash} />
      <g transform="translate(36,20)" fill="none" stroke="#E2B95A" strokeWidth={5}>
        <circle cx={26} cy={26} r={24} /><path d="M26,10V26L38,34" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g clipPath={`url(#${id}-clip)`}>{cells}</g>
    </g>
  );
};
