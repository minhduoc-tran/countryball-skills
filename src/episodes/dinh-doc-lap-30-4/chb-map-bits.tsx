import React from 'react';
import { backOut, clamp, easeOut, prog } from '../../countryball/fx-math';
import { pathAtDist, samplePath } from '../../countryball/fx-flight-path';
import { useGeo } from '../../countryball/map-context';
import { FrontArrow } from '../../countryball/ground-front-arrows';
import { FlagKind, MapFlag } from '../../countryball/flag-cloth';
import { ShipTop, Veh, VehKind } from './chb-icons';
import { Pop, Txt } from './chb-common';
import { Chip } from './chb-cards';

// Chapter B helpers that live INSIDE <GeoMap> (they project lon/lat through useGeo): pins, lon/lat arrows and roads, vehicle columns,
// a popping map flag and the "steel door" of Xuân Lộc. `t` = frames of the shot, `s` = seconds.
type LL = [number, number];
const INK = '#151515';

/** Place dot + outlined name (anchor r | l | t | b); `ring` = pulsing target ring (frames t). Fades in from second `from`. */
export const Pin: React.FC<{ at: LL; label?: string; size?: number; anchor?: 'r' | 'l' | 't' | 'b'; color?: string; ring?: string; t?: number; from?: number; s?: number }> = ({
  at, label, size = 34, anchor = 'r', color = '#F4F4F4', ring, t = 0, from = 0, s = 99,
}) => {
  const { project } = useGeo(), [x, y] = project(at[0], at[1]), o = clamp((s - from) / 0.3);
  if (o <= 0) return null;
  const off = { r: [18, 0, 'start'], l: [-18, 0, 'end'], t: [0, -26, 'middle'], b: [0, size + 14, 'middle'] }[anchor] as [number, number, 'start' | 'end' | 'middle'];
  const k = (t % 45) / 45;
  return (
    <g opacity={o}>
      {ring && <circle cx={x} cy={y} r={14 + 54 * k} fill="none" stroke={ring} strokeWidth={6} opacity={0.85 * (1 - k)} />}
      <circle cx={x} cy={y} r={9} fill="#F2F2F2" stroke={INK} strokeWidth={4} />
      {label && <Txt x={x + off[0]} y={y + off[1] + size * 0.35} text={label} size={size} anchor={off[2]} color={color} />}
    </g>
  );
};

/** FrontArrow along lon/lat points (screen width px, grows from frame t0). */
export const LLArrow: React.FC<{ id: string; t: number; t0: number; pts: LL[]; color: string; width?: number; dur?: number; label?: string; opacity?: number }> = ({ id, t, t0, pts, color, width = 40, dur = 60, label, opacity }) => {
  const { project } = useGeo();
  return <FrontArrow id={id} t={t} t0={t0} points={pts.map((p) => project(p[0], p[1]))} color={color} width={width} dur={dur} label={label} opacity={opacity} />;
};

/** Road line on the map (dark casing + coloured core), drawn `k` 0..1 along the points. */
export const LLRoad: React.FC<{ pts: LL[]; color: string; k?: number; w?: number; dash?: string }> = ({ pts, color, k = 1, w = 9, dash }) => {
  const { project } = useGeo(), sp = pts.map((p) => project(p[0], p[1]));
  const d = sp.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
  const total = samplePath(sp, 12).total, shown = dash ? undefined : `${(total * clamp(k)).toFixed(1)} ${(total + 40).toFixed(1)}`;
  if (k <= 0.001) return null;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={d} stroke="#0A121C" strokeWidth={w + 6} strokeDasharray={shown} opacity={0.8} />
      <polyline points={d} stroke={color} strokeWidth={w} strokeDasharray={dash ?? shown} />
    </g>
  );
};

/** A column of tiny vehicles flowing along lon/lat points: `n` vehicles `gap` px apart, speed px per frame (frames t); kinds cycle. */
export const LLColumn: React.FC<{ id: string; t: number; pts: LL[]; kinds: VehKind[]; n?: number; gap?: number; speed?: number; size?: number; wobble?: number; start?: number }> = ({
  t, pts, kinds, n = 12, gap = 40, speed = 1.2, size = 14, wobble = 0, start = 0,
}) => {
  const { project } = useGeo(), sp = samplePath(pts.map((p) => project(p[0], p[1])), 12), loop = sp.total + n * gap;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const d = (((t * speed + start - i * gap) % loop) + loop) % loop;
        if (d > sp.total) return null;
        const p = pathAtDist(sp, d), o = clamp(d / 40) * clamp((sp.total - d) / 40), side = wobble ? Math.sin(i * 2.3) * wobble : 0;
        const th = (p.heading * Math.PI) / 180;
        return <g key={i} opacity={o}><Veh x={p.x - Math.sin(th) * side} y={p.y + Math.cos(th) * side} heading={p.heading} s={size} kind={kinds[i % kinds.length]} /></g>;
      })}
    </g>
  );
};

/** Map flag that pops (back-ease) at second `at`; `kind` after, nothing before (unless `before` is given). */
export const FlagPop: React.FC<{ at: LL; kind: FlagKind; s: number; from: number; t: number; size?: number; id: string; before?: FlagKind }> = ({ at, kind, s, from, t, size = 96, id, before }) => {
  const { project } = useGeo(), [x, y] = project(at[0], at[1]), k = backOut(prog(s, from, from + 0.4));
  if (s < from) return before ? <MapFlag lon={at[0]} lat={at[1]} kind={before} size={size} t={t} id={`${id}b`} /> : null;
  return <g transform={`translate(${x},${y}) scale(${k}) translate(${-x},${-y})`}><MapFlag lon={at[0]} lat={at[1]} kind={kind} size={size} t={t} id={id} /></g>;
};

/** "Cánh cửa thép": a steel gate seen from the front, centred on lon/lat, `open` 0..1 swings the two leaves apart (width `w` px). */
export const SteelDoor: React.FC<{ at: LL; w?: number; open: number; glow?: boolean }> = ({ at, w = 300, open, glow = true }) => {
  const { project } = useGeo(), [x, y] = project(at[0], at[1]), h = w * 0.86, o = easeOut(clamp(open)), leaf = (w / 2) * (1 - 0.82 * o);
  return (
    <g transform={`translate(${x},${y - h * 0.46})`} strokeLinejoin="round">
      <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 44} rx={16} fill="#2B3440" stroke={INK} strokeWidth={8} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={glow ? '#F3C65A' : '#1B232D'} opacity={glow ? 0.35 + 0.65 * o : 1} />
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <rect x={sd < 0 ? -w / 2 : w / 2 - leaf} y={-h / 2} width={leaf} height={h} fill="#7B8794" stroke={INK} strokeWidth={7} />
          {[0.2, 0.4, 0.6, 0.8].map((r) => <line key={r} x1={sd < 0 ? -w / 2 : w / 2 - leaf} x2={sd < 0 ? -w / 2 + leaf : w / 2} y1={-h / 2 + h * r} y2={-h / 2 + h * r} stroke="#4E5964" strokeWidth={6} />)}
          {[0.12, 0.88].map((r) => [0.15, 0.85].map((q) => <circle key={`${r}${q}`} cx={(sd < 0 ? -w / 2 : w / 2 - leaf) + leaf * q} cy={-h / 2 + h * r} r={6} fill="#A9B3BD" stroke={INK} strokeWidth={2} />))}
        </g>
      ))}
      <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={26} rx={10} fill="#3A4654" stroke={INK} strokeWidth={6} />
    </g>
  );
};

/** Refugee ships sailing along lon/lat points (top view, bow first): `n` ships `gap` px apart, speed px per frame (frames t), loops. */
export const LLShips: React.FC<{ t: number; pts: LL[]; n?: number; gap?: number; speed?: number; scale?: number; start?: number }> = ({ t, pts, n = 3, gap = 260, speed = 1.1, scale = 0.62, start = 0 }) => {
  const { project } = useGeo(), sp = samplePath(pts.map((p) => project(p[0], p[1])), 12), loop = sp.total + n * gap;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const d = (((t * speed + start - i * gap) % loop) + loop) % loop;
        if (d > sp.total) return null;
        const p = pathAtDist(sp, d), o = clamp(d / 60) * clamp((sp.total - d) / 60);
        return <g key={i} opacity={o}><ShipTop x={p.x} y={p.y} heading={p.heading} s={scale * (1 - i * 0.08)} t={t + i * 9} /></g>;
      })}
    </g>
  );
};

/** Label chip hung at a lon/lat (child of GeoMap). */
export const MapChip: React.FC<{ at: LL; text: string; dx?: number; dy?: number; size?: number; s: number; from?: number }> = ({ at, text, dx = 0, dy = -70, size = 40, s, from = 0 }) => {
  const { project } = useGeo(), [x, y] = project(at[0], at[1]);
  return <Pop s={s} at={from} x={x + dx} y={y + dy}><Chip x={x + dx} y={y + dy} text={text} size={size} /></Pop>;
};

/** Screen position of a lon/lat inside a map, handed to a render function (for balls / unit boxes / trench rings drawn in map space). */
export const At: React.FC<{ at: LL; children: (x: number, y: number) => React.ReactNode }> = ({ at, children }) => {
  const { project } = useGeo(), [x, y] = project(at[0], at[1]);
  return <>{children(x, y)}</>;
};
