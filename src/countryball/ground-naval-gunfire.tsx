import React from 'react';
import { Puff } from './fx-glow';
import { deg, hash, Pt, polar, prog } from './fx-math';
import { MuzzleFlash, ShellArc } from './ground-artillery';

// Naval gunfire (Hạm đội 7 off the Quảng Trị coast): ship silhouettes + salvos arcing inland. Screen px, t in frames.
//   <Warship x y heading size? kind? t? aim? recoil? wake? />   TOP view, bow along `heading` (0 = east, 90 = south). size = length px.
//   <WarshipSide x y size? kind? flip? t? />                    SIDE view silhouette on a wave line (close-ups, ship in the corner)
//   <NavalBombardment id t t0 ship target ... />                 the ship fires salvos: turret flashes, smoke, shells arc over to
//                                                                `target` px (impact blasts / splashes), keeps firing until `until`
//   turretPoints(kind, ship) -> muzzle positions (px) for the current pose, if you need to hang your own fx on them
// kind: 'destroyer' (2-3 single 5-inch mounts) | 'cruiser' (3 triple 8-inch turrets). Generic grey silhouettes, not a
// specific hull number: the real ships were US cruisers/destroyers of the 7th Fleet (e.g. USS Newport News, Oklahoma City).

const INK = '#151515';
export type ShipKind = 'destroyer' | 'cruiser';
export interface ShipPose { x: number; y: number; heading: number; size: number; kind?: ShipKind }
// turret positions along the hull in sprite units (100 long, +x = bow) and the barrel length of each kind
const TURRETS: Record<ShipKind, number[]> = { destroyer: [30, -30], cruiser: [32, 20, -34] };
const BARREL: Record<ShipKind, number> = { destroyer: 13, cruiser: 17 };

export const turretPoints = (ship: ShipPose, aim: number): Pt[] => {
  const kind = ship.kind ?? 'destroyer', k = ship.size / 100;
  return TURRETS[kind].map((tx) => { const c = polar(ship.x, ship.y, ship.heading, tx * k); return polar(c[0], c[1], aim, (BARREL[kind] + 2) * k); });
};

export const Warship: React.FC<{ x: number; y: number; heading: number; size?: number; kind?: ShipKind; t?: number; aim?: number; recoil?: number; wake?: boolean }> = ({
  x, y, heading, size = 300, kind = 'destroyer', t = 0, aim, recoil = 0, wake = true,
}) => {
  const k = size / 100, cru = kind === 'cruiser', w = cru ? 12 : 9.5, a = (aim ?? heading) - heading, gid = `wk${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <g transform={`translate(${x},${y}) rotate(${heading}) scale(${k})`} strokeLinejoin="round" strokeLinecap="round">
      {wake && <g opacity={0.8}>
        <defs><linearGradient id={gid} x1="0" x2="1"><stop offset="0" stopColor="#DCEBF7" stopOpacity={0.3} /><stop offset="1" stopColor="#DCEBF7" stopOpacity={0} /></linearGradient></defs>
        <path d={`M-130,${-w * 2.4} L-48,${-w * 0.6} L-48,${w * 0.6} L-130,${w * 2.4} Z`} fill={`url(#${gid})`} />
        {[-1, 1].map((s) => <path key={s} d={`M-44,${s * w * 0.9} L-110,${s * w * 2.3}`} stroke="#F4FAFF" strokeWidth={2.4} strokeDasharray="9 7" strokeDashoffset={-t * 0.9} opacity={0.8} />)}
      </g>}
      <path d={`M-50,${-w * 0.9} L22,${-w} Q46,${-w * 0.6} 58,0 Q46,${w * 0.6} 22,${w} L-50,${w * 0.9} Z`} fill="#7E8892" stroke={INK} strokeWidth={0.9} />
      <path d={`M-46,${-w * 0.62} L24,${-w * 0.7} Q42,${-w * 0.4} 50,0 Q42,${w * 0.4} 24,${w * 0.7} L-46,${w * 0.62} Z`} fill="#A6AEB5" stroke="#4B535B" strokeWidth={0.5} />
      {/* superstructure, bridge, funnels, mast */}
      <rect x={cru ? -10 : -6} y={-w * 0.42} width={cru ? 24 : 18} height={w * 0.84} rx={1.4} fill="#C8CED3" stroke={INK} strokeWidth={0.8} />
      <rect x={cru ? 8 : 8} y={-w * 0.3} width={7} height={w * 0.6} rx={1} fill="#9AA3AB" stroke={INK} strokeWidth={0.7} />
      {(cru ? [-6, -17] : [-14]).map((fx) => <ellipse key={fx} cx={fx} cy={0} rx={4.2} ry={w * 0.3} fill="#4B535B" stroke={INK} strokeWidth={0.8} />)}
      <circle cx={cru ? 4 : 2} cy={0} r={1.5} fill="#2B2E32" />
      {/* turrets: barrels follow `aim` (recoil slides them back) */}
      {TURRETS[kind].map((tx) => (
        <g key={tx} transform={`translate(${tx},0)`}>
          <g transform={`rotate(${a})`}>
            {(cru ? [-2.3, 0, 2.3] : [0]).map((by) => <rect key={by} x={2 - recoil * 3} y={by - 0.8} width={BARREL[kind]} height={1.6} fill="#3C4249" stroke={INK} strokeWidth={0.5} />)}
            <ellipse cx={0} cy={0} rx={cru ? 7 : 5} ry={cru ? 6.6 : 4.6} fill="#8E979F" stroke={INK} strokeWidth={0.9} />
          </g>
        </g>
      ))}
    </g>
  );
};

export const WarshipSide: React.FC<{ x: number; y: number; size?: number; kind?: ShipKind; flip?: boolean; t?: number }> = ({ x, y, size = 520, kind = 'cruiser', flip = false, t = 0 }) => {
  const k = size / 200, cru = kind === 'cruiser';
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -k : k},${k})`} strokeLinejoin="round">
      <path d="M-100,-10 L-96,2 L96,2 Q104,-12 112,-24 L90,-24 L-100,-24 Z" fill="#7E8892" stroke={INK} strokeWidth={2.4} />
      <path d="M-100,-24 L90,-24 L84,-14 L-100,-12 Z" fill="#A6AEB5" />
      <rect x={-34} y={-46} width={64} height={22} rx={3} fill="#C8CED3" stroke={INK} strokeWidth={2.2} />
      <rect x={-14} y={-64} width={30} height={18} rx={3} fill="#B5BCC2" stroke={INK} strokeWidth={2.2} />
      {[-50, -4].slice(0, cru ? 2 : 1).map((fx) => <rect key={fx} x={fx - (cru ? 0 : -14)} y={-66} width={15} height={22} fill="#4B535B" stroke={INK} strokeWidth={2.2} />)}
      <path d="M0,-64 L0,-92 M-12,-84 L12,-84 M0,-92 L10,-98" stroke={INK} strokeWidth={2.6} fill="none" /><ellipse cx={0} cy={-72} rx={20} ry={2.4} fill="#8E979F" stroke={INK} strokeWidth={1.4} />
      {(cru ? [62, 40, -70] : [60, -66]).map((tx) => (
        <g key={tx}><rect x={tx - 11} y={-36} width={22} height={12} rx={4} fill="#8E979F" stroke={INK} strokeWidth={2} />
          {(cru && tx > 0 ? [-3, 3] : [0]).map((by) => <rect key={by} x={tx + 4} y={-33 + by - 1} width={30} height={3} rx={1} fill="#3C4249" stroke={INK} strokeWidth={1.2} transform={`rotate(${tx > 0 ? -12 : 12} ${tx} -30)`} />)}</g>
      ))}
      <path d={`M-130,2 ${Array.from({ length: 12 }, (_, i) => `Q${-120 + i * 24 + 6},${-5 + 5 * Math.sin(t * 0.12 + i)} ${-120 + i * 24 + 12},2`).join(' ')} L170,2 L170,40 L-130,40 Z`} fill="#2D6A9A" opacity={0.9} />
    </g>
  );
};

/** The ship fires salvos from t0 until `until` (frames): every `every` frames each turret flashes (staggered by 3 f), a shell leaves
 *  each muzzle and arcs (`lift` px, `flight` frames) to a point scattered around `target` (±`spread` px); `water` makes them splash. */
export const NavalBombardment: React.FC<{ id: string; t: number; t0: number; ship: ShipPose; target: Pt; until?: number; every?: number; flight?: number; lift?: number; spread?: number; r?: number; water?: boolean; seed?: number; wake?: boolean }> = ({
  t, t0, ship, target, until = 1e9, every = 80, flight = 62, lift = 260, spread = 90, r = 38, water = false, seed = 1, wake = true,
}) => {
  const aim = deg(Math.atan2(target[1] - ship.y, target[0] - ship.x)), kind = ship.kind ?? 'destroyer';
  const salvo = Math.floor((t - t0) / every), shown: React.ReactNode[] = [];
  let recoil = 0;
  for (let s = Math.max(0, salvo - 2); s <= salvo; s++) {
    const ts = t0 + s * every;
    if (ts > until || t < ts) continue;
    TURRETS[kind].forEach((_, j) => {
      const tj = ts + j * 3, mp = turretPoints(ship, aim)[j], tgt: Pt = [target[0] + (hash(s * 7 + j, seed) - 0.5) * 2 * spread, target[1] + (hash(s * 7 + j, seed + 1) - 0.5) * spread];
      if (t - tj < 6) recoil = Math.max(recoil, 1 - (t - tj) / 6);
      shown.push(<g key={`${s}-${j}`}><MuzzleFlash x={mp[0]} y={mp[1]} dir={aim} t={t} t0={tj} size={ship.size * 0.11} />
        <ShellArc t={t} t0={tj + 2} from={mp} to={tgt} dur={flight} lift={lift} water={water} r={r} linger={150} /></g>);
    });
    // black funnel-like smoke over the hull after a salvo
    shown.push(...[0, 1, 2].map((i) => { const age = t - ts; const p = polar(ship.x, ship.y, ship.heading, (i - 1) * ship.size * 0.2); return age < 100 ? <Puff key={`sm${s}-${i}`} x={p[0] + age * 0.12} y={p[1] - 6 - age * 0.18} r={ship.size * (0.04 + 0.05 * prog(age, 0, 50))} color="#3A3A3E" o={0.45 * (1 - prog(age, 20, 100))} seed={i + s} /> : null; }));
  }
  return <g><Warship x={ship.x} y={ship.y} heading={ship.heading} size={ship.size} kind={kind} t={t} aim={aim} recoil={recoil} wake={wake} />{shown}</g>;
};
