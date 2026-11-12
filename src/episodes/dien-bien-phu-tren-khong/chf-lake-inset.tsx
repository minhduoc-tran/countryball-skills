import React from 'react';
import { easeOut, hash, prog } from '../../countryball/fx-math';
import { OutText } from './chf-map-scene';

// Hữu Tiệp lake as a SCHEMATIC magnifier (not to scale: the real lake is ~2 px at map zoom): a round lens with the
// little residential blocks of Ba Đình around a lake. `day` 0..1 (0 = night with lit windows), `wreck`: undefined = none,
// -1 = wreck already sitting in the lake, n >= 0 = frame at which the debris lands (it falls in over 22 frames before).
// t in frames. The lens grows in with `grow` 0..1.

const mixc = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('');
};

const CELL = 44;
const HOUSE_COLORS = ['#E9D9A8', '#D8B58C', '#C9C2B4', '#E5C7B8', '#B9C7B0', '#D9A98F'];

export const LakeInset: React.FC<{
  id: string; t: number; cx: number; cy: number; r: number; day?: number; wreck?: number; grow?: number; label?: boolean; labelOpacity?: number;
}> = ({ id, t, cx, cy, r, day = 0, wreck, grow = 1, label = true, labelOpacity = 1 }) => {
  const R = r * easeOut(grow);
  if (R < 4) return null;
  const lakeRx = r * 0.5, lakeRy = r * 0.3;
  const ground = mixc('#1C2A28', '#9DB07F', day), road = mixc('#3A4540', '#D8D2BE', day), water = mixc('#0F2D45', '#3C86A8', day);
  const houses: React.ReactNode[] = [];
  for (let gx = -Math.ceil(r / CELL); gx <= Math.ceil(r / CELL); gx++) {
    for (let gy = -Math.ceil(r / CELL); gy <= Math.ceil(r / CELL); gy++) {
      const x = gx * CELL, y = gy * CELL, k = gx * 31 + gy * 17;
      const ex = x / (lakeRx + 34), ey = y / (lakeRy + 34);
      if (ex * ex + ey * ey < 1 || x * x + y * y > r * r * 1.02 || hash(k, 5) < 0.12) continue;
      const w = CELL * (0.62 + hash(k, 1) * 0.25), h = CELL * (0.55 + hash(k, 2) * 0.3);
      const lit = hash(k, 3) > 0.35 ? (1 - day) : 0;
      houses.push(
        <g key={k}>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} fill={mixc(HOUSE_COLORS[Math.floor(hash(k, 4) * 6)], '#2A3140', 0.55 * (1 - day))} stroke="#15181F" strokeWidth={2.5} />
          {lit > 0.05 && <rect x={x - 6} y={y - 5} width={12} height={9} fill="#FFD98A" opacity={0.9 * lit} />}
        </g>,
      );
    }
  }
  // wreck debris: a few dark angular pieces falling from the upper right into the lake
  const fall = wreck === undefined ? null : wreck < 0 ? 1 : prog(t, wreck - 22, wreck);
  const splash = wreck === undefined || wreck < 0 ? 0 : prog(t, wreck, wreck + 40);
  const pieces = [[-30, 0, 46, 0.5], [18, 8, 38, 1.4], [60, -6, 30, 2.2], [-6, 20, 26, 3.0]];
  return (
    <g>
      <defs><clipPath id={`${id}-lens`}><circle cx={cx} cy={cy} r={R} /></clipPath></defs>
      <circle cx={cx} cy={cy} r={R + 14} fill="#000" opacity={0.35} />
      <g clipPath={`url(#${id}-lens)`}>
        <rect x={cx - R} y={cy - R} width={R * 2} height={R * 2} fill={ground} />
        <g transform={`translate(${cx},${cy})`}>
          <rect x={-r} y={-14} width={r * 2} height={28} fill={road} opacity={0.8} transform={`translate(0,${lakeRy + 52})`} />
          <rect x={-14} y={-r} width={28} height={r * 2} fill={road} opacity={0.8} transform={`translate(${lakeRx + 52},0)`} />
          {houses}
          <ellipse rx={lakeRx + 10} ry={lakeRy + 10} fill={mixc('#33423C', '#D8D2BE', day)} stroke="#15181F" strokeWidth={3} />
          <ellipse rx={lakeRx} ry={lakeRy} fill={water} stroke="#15181F" strokeWidth={4} />
          {[0.35, 0.6, 0.85].map((q, i) => <ellipse key={i} rx={lakeRx * q} ry={lakeRy * q} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.12 + 0.05 * Math.sin(t * 0.08 + i)} />)}
          {splash > 0 && splash < 1 && [0, 1, 2].map((i) => {
            const u = prog(splash, i * 0.12, 0.8 + i * 0.1);
            return <ellipse key={i} cx={20} cy={4} rx={20 + 120 * u} ry={10 + 56 * u} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.8 * (1 - u)} />;
          })}
          {fall !== null && pieces.map(([px, py, sz, ph], i) => {
            const u = easeOut(fall), oy = (1 - u) * -(r * 0.75) - (fall >= 1 ? 0 : 0), ox = (1 - u) * (r * 0.5);
            return (
              <g key={i} transform={`translate(${px + 12 + ox},${py + oy}) rotate(${(1 - u) * 160 * (i % 2 ? 1 : -1) + ph * 20})`}>
                <polygon points={`${-sz * 0.5},${sz * 0.1} ${-sz * 0.2},${-sz * 0.3} ${sz * 0.3},${-sz * 0.2} ${sz * 0.5},${sz * 0.15} ${sz * 0.1},${sz * 0.3}`}
                  fill="#3C3F44" stroke="#15181F" strokeWidth={3.5} strokeLinejoin="round" />
                <line x1={-sz * 0.25} y1={0} x2={sz * 0.2} y2={-sz * 0.05} stroke="#8A8F96" strokeWidth={3} />
              </g>
            );
          })}
        </g>
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#F4F4F4" strokeWidth={8} />
      <circle cx={cx} cy={cy} r={R + 5} fill="none" stroke="#15181F" strokeWidth={3} opacity={0.8} />
      {label && R > r * 0.9 && <OutText x={cx} y={cy - R - 26} text="HỒ HỮU TIỆP" size={54} opacity={labelOpacity} />}
    </g>
  );
};
