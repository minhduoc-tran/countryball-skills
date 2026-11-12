import React from 'react';
import { star } from './ball-flags';
import { FONT } from '../engine/fonts';
import { FlagCloth, FlagKind } from './flag-cloth';
import { Glow, Puff } from './fx-glow';
import { clamp, hash, Pt, polar, prog } from './fx-math';
import { pathAtDist, samplePath } from './fx-flight-path';
import { MuzzleFlash } from './ground-artillery';

// Tanks as icons moving along roads (screen px, t in frames, 30 fps):
//   <TankTop x y heading size? kind? turret? fire? mark? />       TOP view, hull length = size px, gun extends ~0.8 size beyond
//   <TankSide x y size? kind? flip? turret? />                    SIDE view (facing right; flip mirrors)
//   <TankColumn id t t0 t1 points n? gap? size? kind? fireEvery? dust? />   n tanks following a path, spaced `gap` px, dust behind
// kind 't54' = QĐND (olive, red-yellow star on the turret; T-54/T-59/PT-76 look-alike low round turret);
//      'type59' = Chinese Type 59 (same silhouette as the T-54, a touch greener: tank 390 of 30.4.1975); 't54' = T-54B (tank 843: pass
//                 `searchlight` on TankSide for its infrared lamp box on the mantlet);
//      'm48' = VNCH/US (M48 Patton: taller long turret with a bustle, commander cupola, small RVN flag aerial).
// heading in degrees (0 = east, 90 = south). turret = turret angle RELATIVE to the hull (default 0 = straight ahead);
// fire 0..1 = muzzle flash intensity (use MuzzleFlash for a timed shot).
// TankSide extras (all optional, defaults leave the old look): `num` = white hull number painted on the turret side ("390", "843"), `flag` = a flag on the whip antenna
// ('PRG' = Mặt trận DTGP flag, flies behind the tank) with `t` (frames) making it wave, `id` unique per flag.

const INK = '#151515';
const BODY = { t54: { hull: '#66713A', dark: '#4A5429', light: '#848F52' }, type59: { hull: '#5E7440', dark: '#455B2D', light: '#7E9759' }, m48: { hull: '#5C6B45', dark: '#3F4B2F', light: '#7D8C62' } } as const;
export type TankKind = keyof typeof BODY;

export const TankTop: React.FC<{ x: number; y: number; heading?: number; size?: number; kind?: TankKind; turret?: number; fire?: number; mark?: boolean }> = ({
  x, y, heading = 0, size = 70, kind = 't54', turret = 0, fire = 0, mark = true,
}) => {
  const c = BODY[kind], k = size / 100, m = kind === 'm48', W = m ? 27 : 25, sw = Math.max(1.4, 2.2 / k) * 0.9;
  return (
    <g transform={`translate(${x},${y}) rotate(${heading}) scale(${k})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={4} cy={6} rx={60} ry={W + 4} fill="#000" opacity={0.2} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={-52} y={s * W - 8} width={104} height={16} rx={7} fill="#34373B" stroke={INK} strokeWidth={sw} />
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-40 + i * 16} cy={s * W} r={4.2} fill="#5A5F65" />)}
        </g>
      ))}
      <path d={`M-50,${-W + 6} L36,${-W + 6} L52,-10 L52,10 L36,${W - 6} L-50,${W - 6} Z`} fill={c.hull} stroke={INK} strokeWidth={sw} />
      <rect x={-48} y={-9} width={16} height={18} rx={3} fill={c.dark} stroke={INK} strokeWidth={sw * 0.7} />
      <path d="M38,-8 L46,-4 L46,4 L38,8 Z" fill={c.light} opacity={0.9} />
      {m && <><line x1={-48} y1={W - 8} x2={-60} y2={W - 8} stroke={INK} strokeWidth={1.4} /><line x1={-60} y1={W - 8} x2={-60} y2={W - 26} stroke="#E6E0C8" strokeWidth={1.2} />
        <rect x={-72} y={W - 26} width={12} height={8} fill="#F5CE4B" stroke={INK} strokeWidth={0.6} />{[0, 2.4, 4.8].map((o) => <rect key={o} x={-72} y={W - 24.6 + o - 0.3} width={12} height={1} fill="#C62528" />)}</>}
      <g transform={`rotate(${turret})`}>
        {/* gun first (under the turret): long barrel, fume extractor bulge, muzzle */}
        <rect x={16} y={-2.3} width={m ? 92 : 88} height={4.6} rx={1.5} fill={c.dark} stroke={INK} strokeWidth={sw * 0.8} />
        <ellipse cx={m ? 66 : 58} cy={0} rx={m ? 9 : 6} ry={4.6} fill={c.light} stroke={INK} strokeWidth={sw * 0.8} />
        {fire > 0 && <g><Glow x={m ? 112 : 108} y={0} r={36 * fire} color="#FFB347" o={0.9 * fire} /><polygon points={`${m ? 108 : 104},0 ${m ? 128 : 124},-10 ${m ? 118 : 114},0 ${m ? 128 : 124},10`} fill="#FFF1C0" opacity={fire} /></g>}
        {m ? <path d="M-30,0 Q-30,-21 -8,-21 L18,-17 Q32,-12 32,0 Q32,12 18,17 L-8,21 Q-30,21 -30,0 Z" fill={c.hull} stroke={INK} strokeWidth={sw} />
          : <ellipse cx={2} cy={0} rx={24} ry={19} fill={c.hull} stroke={INK} strokeWidth={sw} />}
        <ellipse cx={m ? -4 : -3} cy={m ? 8 : 7} rx={m ? 7.5 : 6} ry={m ? 7.5 : 6} fill={c.dark} stroke={INK} strokeWidth={sw * 0.7} />
        <circle cx={m ? 8 : 10} cy={-8} r={4.4} fill={c.dark} stroke={INK} strokeWidth={sw * 0.7} />
        {mark && !m && <g><circle cx={-3} cy={-5} r={7.6} fill="#DA251D" stroke="#FFCD00" strokeWidth={1.3} /><polygon points={star(-3, -5, 5.4)} fill="#FFCD00" /></g>}
        {mark && m && <rect x={-18} y={-3} width={9} height={6} fill="#E8E4D0" opacity={0.8} />}
      </g>
    </g>
  );
};

export const TankSide: React.FC<{ x: number; y: number; size?: number; kind?: TankKind; flip?: boolean; turret?: number; fire?: number; num?: string; searchlight?: boolean; flag?: FlagKind; t?: number; id?: string }> = ({
  x, y, size = 300, kind = 't54', flip = false, turret = 0, fire = 0, num, searchlight = false, flag, t = 0, id = 'tks',
}) => {
  const c = BODY[kind], k = size / 200, m = kind === 'm48';
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -k : k},${k})`} strokeLinejoin="round" strokeLinecap="round">
      <g transform={`rotate(${-turret} ${m ? 6 : 10} -38)`}>
        <rect x={m ? 30 : 24} y={-56} width={m ? 168 : 160} height={7} rx={2.4} fill={c.dark} stroke={INK} strokeWidth={2.6} />
        <rect x={m ? 112 : 104} y={-59} width={m ? 24 : 16} height={13} rx={4} fill={c.light} stroke={INK} strokeWidth={2.6} />
        {fire > 0 && <polygon points={`${m ? 196 : 188},-53 ${m ? 238 : 230},-76 ${m ? 220 : 212},-53 ${m ? 238 : 230},-30`} fill="#FFF1C0" stroke="#FFA62B" strokeWidth={3} opacity={fire} />}
        {m ? <path d="M-60,-24 Q-60,-62 -20,-68 L38,-62 Q62,-52 62,-30 L62,-24 Z" fill={c.hull} stroke={INK} strokeWidth={3.2} />
          : <path d="M-44,-24 Q-44,-64 6,-66 Q52,-64 54,-24 Z" fill={c.hull} stroke={INK} strokeWidth={3.2} />}
        <rect x={m ? -2 : 8} y={-76} width={16} height={11} rx={3} fill={c.dark} stroke={INK} strokeWidth={2.4} />
        {!m && <g><circle cx={30} cy={-44} r={9} fill="#DA251D" stroke="#FFCD00" strokeWidth={2} /><polygon points={star(30, -44, 6.5)} fill="#FFCD00" /></g>}
        {searchlight && <rect x={34} y={-68} width={22} height={10} rx={2.4} fill={c.light} stroke={INK} strokeWidth={2.2} />}
        {num && <text x={-8} y={-38} textAnchor="middle" fontSize={22} fontFamily={FONT.title} fontWeight={900} fill="#F6F3E6" stroke={INK} strokeWidth={3.2} paintOrder="stroke" letterSpacing={1}>{num}</text>}
      </g>
      {flag && (
        <g>
          <line x1={-30} y1={-62} x2={-40} y2={-184} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <g transform="translate(-40,-184) scale(-1,1)"><FlagCloth id={`${id}-fl`} x={0} y={0} w={64} h={42} kind={flag} wave={0.9} t={t} /></g>
        </g>
      )}
      <path d="M-98,-14 L-84,-34 L66,-34 L98,-10 L98,0 L-98,0 Z" fill={c.hull} stroke={INK} strokeWidth={3.2} />
      <rect x={-104} y={-18} width={208} height={36} rx={17} fill="#34373B" stroke={INK} strokeWidth={3.2} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-74 + i * 30} cy={1} r={11} fill="#5A5F65" stroke={INK} strokeWidth={2.2} />)}
      <circle cx={-92} cy={1} r={9} fill="#5A5F65" stroke={INK} strokeWidth={2.2} /><circle cx={92} cy={1} r={9} fill="#5A5F65" stroke={INK} strokeWidth={2.2} />
    </g>
  );
};

/** n tanks drive `points` between frames t0 and t1 (constant speed, the last tank leaves the path end at t1), turrets point ahead
 *  (or `turret` degrees); dust puffs trail each tank; `fireEvery` > 0 makes them fire in turn once they are moving. */
export const TankColumn: React.FC<{ id: string; t: number; t0: number; t1: number; points: Pt[]; n?: number; gap?: number; size?: number; kind?: TankKind; turret?: number; fireEvery?: number; dust?: boolean }> = ({
  t, t0, t1, points, n = 3, gap = 120, size = 64, kind = 't54', turret = 0, fireEvery = 0, dust = true,
}) => {
  const sp = samplePath(points), total = sp.total + (n - 1) * gap, u = prog(t, t0, t1);
  const poses = Array.from({ length: n }, (_, i) => {
    const s = u * total - i * gap;
    if (s < -size || s > sp.total + size || t < t0 || t > t1 + 1) return null;
    return { i, s, p: pathAtDist(sp, clamp(s, 0, sp.total)) };
  }).filter((q): q is { i: number; s: number; p: ReturnType<typeof pathAtDist> } => q !== null);
  return (
    <g>
      {/* dust first, so no tank is ever washed out by the cloud of the one in front */}
      {dust && poses.map(({ i, s }) => [0, 1, 2].map((j) => {
        const q = pathAtDist(sp, clamp(s - size * 0.55 - j * size * 0.3, 0, sp.total));
        return <Puff key={`${i}-${j}`} x={q.x + (hash(i * 4 + j, 3) - 0.5) * 10} y={q.y - j * 3} r={size * (0.14 + 0.06 * j)} color="#CDBF9B" o={0.3 - j * 0.07} seed={i + j} />;
      }))}
      {poses.map(({ i, p }) => {
        const cycle = fireEvery > 0 ? (t - t0 + i * (fireEvery / n)) % fireEvery : 99, flash = fireEvery > 0 && cycle < 5 ? 1 - cycle / 5 : 0;
        const mp = polar(p.x, p.y, p.heading + turret, size * (kind === 'm48' ? 1.15 : 1.1));
        return (
          <g key={i}>
            <TankTop x={p.x} y={p.y} heading={p.heading} size={size} kind={kind} turret={turret} fire={flash} />
            {fireEvery > 0 && <MuzzleFlash x={mp[0]} y={mp[1]} dir={p.heading + turret} t={cycle} t0={0} size={size * 0.4} />}
          </g>
        );
      })}
    </g>
  );
};
