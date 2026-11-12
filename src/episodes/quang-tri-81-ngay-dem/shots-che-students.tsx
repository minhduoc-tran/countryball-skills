import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { cameraAt } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { City, CITIES } from '../../countryball/map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { easeInOut, easeOut, hash, lerp } from '../../countryball/fx-math';
import { Backdrop, LAND, Pop, proj, ramp, sec, Txt } from './chb-common';
import { Push, SoldierIcon, VnmSoldier } from './che-common';

// Chapter E, beat "21 students" (E12-E16, 426.8-439.0 s): the soldiers are very young; Sept 1971 thousands of Hà Nội university
// students put down their books and enlist; a year later many are in Quảng Trị.

/** University building pictogram (pediment, columns, lit windows); (x, y) = bottom centre. */
export const Uni: React.FC<{ x: number; y: number; s?: number; lit?: number }> = ({ x, y, s = 1, lit = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} stroke="#141414" strokeWidth={4} strokeLinejoin="round">
    <rect x={-150} y={-120} width={300} height={120} fill="#C9B88C" />
    <path d="M-170,-120 L0,-200 L170,-120 Z" fill="#B3A275" />
    <circle cx={0} cy={-148} r={13} fill="#F2E7C4" />
    {[-120, -60, 0, 60, 120].map((cx) => <rect key={cx} x={cx - 11} y={-112} width={22} height={100} fill="#E4D8B4" />)}
    <rect x={-190} y={-8} width={380} height={16} fill="#8F8160" />
    {[-90, -30, 30, 90].map((cx) => <rect key={`w${cx}`} x={cx - 12} y={-96} width={24} height={34} fill={lit > 0.5 ? '#FFD98A' : '#2A3340'} strokeWidth={3} />)}
  </g>
);

const Book: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; rot?: number }> = ({ x, y, w = 120, h = 26, color = '#3F6FB3', rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} stroke="#141414" strokeWidth={4} strokeLinejoin="round">
    <rect x={-w / 2} y={-h} width={w} height={h} rx={4} fill={color} />
    <rect x={-w / 2 + 8} y={-h + 6} width={w - 12} height={h - 12} fill="#F4EBD0" strokeWidth={2.5} />
  </g>
);

// ---------- E12: "rất trẻ": a row of young soldier balls ----------
export const E12: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="e12" />
      <Push s={s} dur={1.9} to={1.05} cy={600}>
        {Array.from({ length: 5 }, (_, i) => <Pop key={i} s={s} at={0.05 + i * 0.12} x={340 + i * 310} y={700}>
          <VnmSoldier id={`e12b${i}`} x={340 + i * 310} y={700 + (i % 2) * 24} r={140 - (i % 2) * 12} t={t} ph={i * 12} hops eyes={i % 2 ? 'happy' : 'normal'} /></Pop>)}
      </Push>
      <Txt x={960} y={190} text="CÒN RẤT TRẺ" size={110} o={ramp(s, 0.5, 0.85)} />
    </g>
  );
};

// ---------- E13: "tháng chín 1971": Hà Nội, the universities light up ----------
export const E13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 105.85, lat: 21.0, zoom: 300 }, { t: 2.1, lon: 105.85, lat: 21.0, zoom: 360, ease: 'linear' }], s), [cx, cy] = proj(cam)(105.85, 21.03);
  const off: [number, number][] = [[-330, -190], [-120, -290], [160, -270], [360, -130], [-370, 120]];
  return (
    <g>
      <GeoMap camera={cam} id="e13m" colors={LAND} night={0.15} labels={false}>
        <City {...CITIES.hanoi} anchor="b" size={50} />
      </GeoMap>
      {off.map(([dx, dy], i) => <Pop key={i} s={s} at={0.6 + i * 0.18} x={cx + dx} y={cy + dy}>
        <line x1={cx} y1={cy} x2={cx + dx} y2={cy + dy + 20} stroke="#F4F4F4" strokeWidth={4} strokeDasharray="4 10" opacity={0.7} />
        <Uni x={cx + dx} y={cy + dy + 50} s={0.42} /></Pop>)}
      <Txt x={960} y={960} text="CÁC TRƯỜNG ĐẠI HỌC HÀ NỘI" size={64} o={ramp(s, 0.5, 0.8)} />
      <DateChip label="09.1971" t={s} />
      <MiniMap camera={cam} />
    </g>
  );
};

// ---------- E14: "hàng nghìn sinh viên": a stream of student balls with books walks into the university ----------
export const E14: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="e14" top="#24304A" bottom="#0D1522" />
      <Uni x={960} y={720} s={2.1} />
      <rect x={0} y={720} width={1920} height={360} fill="#101A26" />
      {[0, 1, 2].map((row) => Array.from({ length: 4 }, (_, k) => {
        const i = row * 4 + k, dir = row % 2 ? 1 : -1, r = 62 + row * 16, y = 790 + row * 90;
        const x = ((k * 550 + row * 170 + dir * s * (90 + 40 * row)) % 2200 + 2200) % 2200 - 140;
        return <g key={i}>
          <Ball id={`e14b${i}`} x={x} y={y} r={r} flag="VNM" eyes={i % 3 ? 'normal' : 'happy'} t={t} look={dir * 0.4} motion={mixMotion(breathe(t, 60, 0.03, i), hop(t, 28, 10, i * 5))} />
          <Book x={x + dir * r * 0.55} y={y + r * 0.95} w={r * 0.95} h={r * 0.26} color={i % 2 ? '#3F6FB3' : '#B3472B'} rot={-8} />
        </g>;
      }))}
      <Txt x={960} y={150} text="HÀNG NGHÌN SINH VIÊN" size={92} o={ramp(s, 0.1, 0.45)} />
    </g>
  );
};

// ---------- E15: books go down, the helmet goes on ----------
export const E15: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), on = s >= 1.3;
  return (
    <g>
      <Backdrop s={s} id="e15" top="#2A3446" bottom="#0E1520" />
      <rect x={160} y={720} width={760} height={40} fill="#6B4A2B" stroke="#141414" strokeWidth={5} /><rect x={220} y={760} width={30} height={240} fill="#4A331D" /><rect x={830} y={760} width={30} height={240} fill="#4A331D" />
      {[0, 1, 2, 3].map((i) => {
        const k = easeOut(ramp(s, 0.1 + i * 0.16, 0.45 + i * 0.16));
        return <Book key={i} x={540 + (i % 2) * 14} y={720 - i * 34 - (1 - k) * 420} w={230 - i * 12} h={34} color={['#3F6FB3', '#B3472B', '#2F6B3A', '#8A5CB3'][i]} rot={(i - 1.5) * 3 * k} />;
      })}
      <Ball id="e15b" x={1330} y={640} r={190} flag="VNM" eyes={on ? 'determined' : 'normal'} hat={on ? <MuCoi camo /> : undefined} t={t}
        motion={mixMotion(breathe(t, 70, 0.03), hopOnce(t, 39, 22, 50))} />
      {on && <circle cx={1330} cy={640} r={190 + 120 * ramp(s, 1.3, 1.7)} fill="none" stroke="#FFE9B0" strokeWidth={6} opacity={1 - ramp(s, 1.3, 1.7)} />}
      <Txt x={540} y={300} text="GÁC SÁCH VỞ" size={86} o={ramp(s, 0.15, 0.45) * (1 - ramp(s, 1.2, 1.4))} />
      <Txt x={560} y={300} text="NHẬP NGŨ" size={110} color="#FFD166" o={ramp(s, 1.3, 1.6)} />
    </g>
  );
};

// ---------- E16: "một năm sau": the road south from Hà Nội to Quảng Trị, tiny soldier icons march along ----------
const ROUTE: [number, number][] = [[105.85, 21.03], [105.97, 20.25], [105.78, 19.8], [105.68, 18.68], [105.9, 18.34], [106.6, 17.47], [107.1, 17.0], [107.19, 16.75]];
export const E16: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 106.3, lat: 18.95, zoom: 160 }, { t: 3.5, lon: 106.4, lat: 18.6, zoom: 175, ease: 'linear' }], s), P = proj(cam);
  const pts = ROUTE.map(([lo, la]) => P(lo, la)), seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), total = seg.reduce((a, b) => a + b, 0);
  const at = (d: number): [number, number] => { let r = d; for (let i = 0; i < seg.length; i++) { if (r <= seg[i]) return [lerp(pts[i][0], pts[i + 1][0], r / seg[i]), lerp(pts[i][1], pts[i + 1][1], r / seg[i])]; r -= seg[i]; } return pts[pts.length - 1]; };
  const head = easeInOut(ramp(s, 0.1, 3.2)) * total;
  const done: string[] = []; let acc = 0;
  for (let i = 0; i < seg.length && acc < head; i++) { if (!done.length) done.push(`M${pts[0][0]},${pts[0][1]}`); const e = at(Math.min(head, acc + seg[i])); done.push(`L${e[0]},${e[1]}`); acc += seg[i]; }
  const qt = P(107.19, 16.75), pulse = (s * 1.3) % 1;
  return (
    <g>
      <GeoMap camera={cam} id="e16m" colors={LAND} night={0.15}>
        <City {...CITIES.hanoi} size={36} /><City {...CITIES.vinh} size={30} />
      </GeoMap>
      <path d={done.join(' ')} fill="none" stroke="#E0483C" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 18" />
      {[0, 1, 2].map((k) => { const [x, y] = at(Math.max(0, head - k * 34)); return <SoldierIcon key={k} x={x} y={y - 14} s={1.1} o={1 - k * 0.25} />; })}
      <circle cx={qt[0]} cy={qt[1]} r={14 + 60 * pulse} fill="none" stroke="#FF5A5F" strokeWidth={5} opacity={(1 - pulse) * ramp(s, 2.2, 2.6)} />
      <Txt x={qt[0] + 40} y={qt[1] + 14} text="QUẢNG TRỊ" size={50} anchor="start" o={ramp(s, 2.4, 2.8)} />
      <DateChip dates={[{ t: 0, label: '09.1971' }, { t: 0.4, label: '1972' }]} t={s} />
      <MiniMap camera={cam} />
    </g>
  );
};
