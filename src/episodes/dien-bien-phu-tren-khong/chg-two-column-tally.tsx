import React from 'react';
import { FONT } from '../../engine/fonts';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { MuCoi, UsafCap } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { Ball } from '../../countryball/countryball';
import { INK, Panel, USA_BLUE, VNM_RED, GOLD, ramp, fade } from './chg-common';

// The two-column "who counts what" card: Theo phía Việt Nam (left, red) / Theo phía Mỹ (right, blue).
// Each column reveals its lines at times given in `at` (seconds on the shot clock `s`), so the same component
// serves several shots (G6..G10) with a growing state. `dim` fades a column that is not being narrated.

type Reveal = { head: number; big: number; row: number; big2: number; row2?: number };
// column clocks: VN column runs over G6+G7 (81 at ~1.4 s, 34 at ~4.4 s), US over G8+G9 (15 at ~2.4 s, ~12 at ~4.4 s)
export const VN_AT: Reveal = { head: 0.0, big: 0.7, big2: 4.1, row: 4.25 };
export const US_AT: Reveal = { head: 0.0, big: 1.9, big2: 4.25, row: 2.05, row2: 4.4 };

const Count: React.FC<{ s: number; at: number; to: number; dur?: number; pre?: string }> = ({ s, at, to, dur = 0.8, pre = '' }) => (
  <>{pre}{Math.round(to * ramp(s, at, at + dur))}</>
);

const Icons: React.FC<{ s: number; at: number; n: number; per: number; kind: 'b52' | 'f4'; size: number; x: number; y: number; id: string; rowGap: number; step: number }> = ({ s, at, n, per, kind, size, x, y, id, rowGap, step }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = at + i * 0.04, k = ramp(s, a, a + 0.25);
      if (k <= 0) return null;
      const cx = x + (i % per) * step, cy = y + Math.floor(i / per) * rowGap;
      return <AircraftTop key={i} id={`${id}-${i}`} kind={kind} x={cx} y={cy - (1 - k) * 22} size={size} heading={0} opacity={k} shadow={false} variant="D" />;
    })}
  </g>
);

const Column: React.FC<{ side: 'vn' | 'us'; s: number; show: boolean; dim: number; a: Reveal; f: number }> = ({ side, s, show, dim, a, f }) => {
  const vn = side === 'vn', x0 = vn ? 60 : 1020, accent = vn ? VNM_RED : USA_BLUE;
  const enter = show ? fade(s, a.head, 0.45) : 0;
  const pulse = (k: number) => 1 + 0.12 * Math.max(0, 1 - Math.abs(s - k) / 0.4);
  const num = (x: number, y: number, v: React.ReactNode, size: number, fill = '#F4F4F4', at = 0, anchor: 'start' | 'middle' = 'start') => (
    <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke={INK} strokeWidth={size * 0.1} paintOrder="stroke"
      textAnchor={anchor} opacity={fade(s, at, 0.2)} transform={`translate(${x},${y}) scale(${pulse(at + 0.7)}) translate(${-x},${-y})`}>{v}</text>
  );
  const lab = (x: number, y: number, t: string, at: number, size = 36, fill = '#E8EEF4') => (
    <text x={x} y={y} fontFamily={FONT.title} fontWeight={700} fontSize={size} fill={fill} opacity={fade(s, at, 0.3)}>{t}</text>
  );
  return (
    <g opacity={enter * (1 - dim * 0.65)}>
      <Panel x={x0} y={140} w={840} h={800} accent={accent} />
      <Ball id={`g-col-${side}`} x={x0 + 120} y={290} r={72} flag={vn ? "VNM" : "USA"} eyes="normal" hat={vn ? <MuCoi /> : <UsafCap />} t={f}
        motion={breathe(f, 70, 0.03, vn ? 0 : 20)} shadow={false} />
      <text x={x0 + 240} y={262} fontFamily={FONT.title} fontWeight={700} fontSize={34} fill={GOLD}>THEO PHÍA</text>
      <text x={x0 + 240} y={326} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F4F4F4">{vn ? 'VIỆT NAM' : 'MỸ'}</text>
      {!vn && <text x={x0 + 240} y={366} fontFamily={FONT.title} fontWeight={600} fontSize={26} fill="#9DB4CC">thống kê chính thức</text>}
      {vn ? (
        <>
          {num(x0 + 50, 520, <Count s={s} at={a.big} to={81} />, 150, '#F4F4F4', a.big)}
          {lab(x0 + 260, 512, 'máy bay Mỹ', a.big + 0.1, 44)}
          {lab(x0 + 260, 462, 'bị bắn rơi', a.big + 0.1, 32, '#9DB4CC')}
          {num(x0 + 50, 700, <Count s={s} at={a.big2} to={34} dur={0.6} />, 130, '#FF8A6E', a.big2)}
          {lab(x0 + 230, 692, 'trong đó là B-52', a.big2 + 0.1, 44)}
          <Icons s={s} at={a.row} n={34} per={12} kind="b52" size={50} x={x0 + 70} y={780} id="g-vn" rowGap={62} step={66} />
        </>
      ) : (
        <>
          {num(x0 + 50, 520, <Count s={s} at={a.big} to={15} dur={0.5} />, 150, '#F4F4F4', a.big)}
          {lab(x0 + 260, 512, 'B-52', a.big + 0.1, 64)}
          <Icons s={s} at={a.row} n={15} per={8} kind="b52" size={62} x={x0 + 80} y={610} id="g-us" rowGap={76} step={98} />
          {num(x0 + 50, 830, <Count s={s} at={a.big2} to={12} dur={0.5} pre="~" />, 130, '#8EC3FF', a.big2)}
          {lab(x0 + 290, 820, 'máy bay chiến thuật', a.big2 + 0.1, 36)}
          <Icons s={s} at={a.row2 ?? 4.4} n={12} per={12} kind="f4" size={52} x={x0 + 70} y={896} id="g-usf" rowGap={0} step={64} />
        </>
      )}
    </g>
  );
};

/** vnS / usS = each column's own clock in seconds (99 = finished); a dim of 1 greys a column out. */
export const TwoColumns: React.FC<{ f: number; vnS: number; usS: number; dimVn?: number; dimUs?: number }> = ({ f, vnS, usS, dimVn = 0, dimUs = 0 }) => (
  <g>
    <Column side="vn" s={vnS} show dim={dimVn} a={VN_AT} f={f} />
    <Column side="us" s={usS} show dim={dimUs} a={US_AT} f={f} />
  </g>
);
