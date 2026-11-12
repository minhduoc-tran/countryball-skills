import React from 'react';
import { hash } from './fx-math';
import { breakState, CITADEL, WALL_PIECES, WALL_PIECES_PER_SIDE } from './citadel-geometry';
import { PAL, tone } from './citadel-palette';

// The fortress itself, drawn in the CITADEL FRAME (u, v metres, centre 0,0, rotated by <CitadelPlan>):
//   square 480 m, 4 corner bastions (arrowheads), brick-faced rampart 12 m thick, moat ~18 m, 4 gates with curved
//   bridges, a dusty enclosure with a few 1972 barracks and old trees (trees are drawn by the caller).
// damage 0..1: every wall piece / bastion / gate / building has its own seeded threshold; the Đông (east) gate survives.
// `memorial` = the site today (monument + museum) for the ending; use it with damage 0.

const H = CITADEL.half, TIP = CITADEL.tip;

/** Outline of the wall's outer face with the 4 bastions, clockwise from the top-left corner; s scales it (centre line = 0.975). */
const outline = (s: number): string => {
  const c: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]], pts: [number, number][] = [];
  c.forEach(([sx, sy], i) => {
    // clockwise walk: TL and BR arrive along a side wall (v first), TR and BL arrive along the top / bottom wall (u first)
    const set: [number, number][] = i % 2 === 0 ? [[240, 190], [262, 222], [270, 270], [222, 262], [190, 240]] : [[190, 240], [222, 262], [270, 270], [262, 222], [240, 190]];
    set.forEach(([a, b]) => pts.push([sx * a * s, sy * b * s]));
  });
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('') + 'Z';
};
const BASTION_PTS: [number, number][] = [[240, 190], [262, 222], [270, 270], [222, 262], [190, 240]];

/** Irregular rubble heap: n lumps around (x, y), each a polygon of 6 points. */
const heap = (x: number, y: number, w: number, h: number, seed: number, n = 3): string => {
  let d = '';
  for (let j = 0; j < n; j++) {
    const cx = x + (hash(seed, j * 3 + 1) - 0.5) * w * 0.7, cy = y + (hash(seed, j * 3 + 2) - 0.5) * h * 0.6, r = (0.28 + 0.25 * hash(seed, j * 3 + 3)) * Math.min(w, h * 1.6);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * 6.283, rr = r * (0.65 + 0.5 * hash(seed + j, i + 9));
      d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.75).toFixed(1)}`;
    }
    d += 'Z';
  }
  return d;
};

// 1972 enclosure: [u, v, w, h, roof, ht]
const BUILDINGS: [number, number, number, number, number, number][] = [
  [0, -70, 52, 20, 0, 0.55], [-120, -140, 62, 15, 2, 0.35], [-40, -150, 62, 15, 2, 0.5], [60, -150, 62, 15, 2, 0.7], [-120, -112, 62, 15, 2, 0.42],
  [-120, 100, 56, 14, 0, 0.38], [-52, 100, 56, 14, 0, 0.6], [16, 100, 56, 14, 0, 0.46], [-120, 132, 56, 14, 3, 0.8], [-52, 132, 56, 14, 3, 0.52],
  [140, 90, 30, 22, 1, 0.65], [140, 130, 30, 22, 1, 0.74], [-165, -30, 26, 18, 3, 0.58], [160, -90, 22, 16, 0, 0.3],
];

export const CitadelFortLayer: React.FC<{ night: number; damage: number; flood: number; memorial: boolean }> = ({ night, damage, flood, memorial }) => {
  const T = (c: string) => tone(c, night);
  const gateHt = [0.8, 1.6, 0.9, 0.86]; // N, E (survives), S, W
  const bastionHt = [0.55, 0.78, 0.66, 0.9];
  return (
    <g>
      {/* moat + berm */}
      <path d={outline(1)} fill="none" stroke={T(PAL.moatEdge)} strokeWidth={2 * CITADEL.moat * (1 + flood * 0.7) + 3} strokeLinejoin="round" />
      <path d={outline(1)} fill="none" stroke={T(flood > 0.3 ? PAL.floodDeep : PAL.moat)} strokeWidth={2 * CITADEL.moat * (1 + flood * 0.7)} strokeLinejoin="round" />
      {/* enclosure ground */}
      <path d={outline(1)} fill={T('#9DA06A')} />
      <path d={`M${-H},0H${H}M0,${-H}V${H}`} stroke={T(PAL.dust)} strokeWidth={9} />
      <rect x={-62} y={-40} width={124} height={86} rx={6} fill={T(PAL.dust)} opacity={0.9} />
      {/* gate-to-gate dusty tracks already drawn; buildings of 1972 */}
      {!memorial && BUILDINGS.map(([u, v, w, h, roof, ht], i) => {
        const st = breakState(damage, ht);
        return st === 2 ? <path key={i} d={heap(u, v, w, h, i + 40, 4)} fill={T(PAL.rubble)} stroke={T('#2E241C')} strokeWidth={0.5} />
          : <g key={i}><rect x={u - w / 2 + 1.5} y={v - h / 2 + 1.5} width={w} height={h} fill="#000" opacity={0.18} />
            <rect x={u - w / 2} y={v - h / 2} width={w} height={h} fill={T(PAL.roofs[roof])} stroke={T('#3A2A22')} strokeWidth={0.8} />
            <line x1={u - w / 2} y1={v} x2={u + w / 2} y2={v} stroke={T('#3A2A22')} strokeWidth={0.5} opacity={0.6} />
            {st === 1 && <path d={`M${u - w * 0.1},${v - h / 2}l5,${h * 0.35}l-4,${h * 0.3}l6,${h * 0.35}`} stroke="#201812" strokeWidth={0.9} fill="none" />}</g>;
      })}
      {memorial && <MemorialToday T={T} />}
      {/* walls: 4 sides x 24 pieces, drawn in the north-wall frame and rotated */}
      {[0, 1, 2, 3].map((side) => (
        <g key={side} transform={`rotate(${side * 90})`}>
          <rect x={-H + 6} y={-H + CITADEL.wall - 0.5} width={2 * H - 12} height={9} fill={T('#8B8856')} opacity={0.9} />
          {WALL_PIECES.filter((p) => p.side === side).map((p) => {
            const x0 = -H + (p.i * 2 * H) / WALL_PIECES_PER_SIDE, L = (2 * H) / WALL_PIECES_PER_SIDE, gate = p.i === 11 || p.i === 12;
            if (gate) return null;
            const st = breakState(damage, p.ht);
            if (st === 2) return <path key={p.i} d={heap(x0 + L / 2, -H + 6, L * 1.15, 14, p.i + side * 31, 3)} fill={T(PAL.rubble)} stroke={T('#2E241C')} strokeWidth={0.5} />;
            return (
              <g key={p.i}>
                <rect x={x0} y={-H} width={L + 0.3} height={CITADEL.wall} fill={T(st ? '#A98A5A' : PAL.rampartTop)} />
                <rect x={x0} y={-H} width={L + 0.3} height={3} fill={T(PAL.brick)} />
                <line x1={x0} y1={-H + 3} x2={x0 + L} y2={-H + 3} stroke={T(PAL.brickDark)} strokeWidth={0.7} strokeDasharray="2.6 1.6" />
                <line x1={x0} y1={-H + CITADEL.wall - 0.4} x2={x0 + L} y2={-H + CITADEL.wall - 0.4} stroke={T(PAL.brickDark)} strokeWidth={0.8} opacity={0.7} />
                {st === 1 && <><path d={`M${x0 + 4},${-H}l3,4l-4,3l3,5`} stroke="#241A12" strokeWidth={0.9} fill="none" /><path d={heap(x0 + L / 2, -H - 1, L * 0.7, 6, p.i + side * 17, 2)} fill={T(PAL.rubbleLight)} /></>}
              </g>
            );
          })}
          <Gate T={T} st={breakState(damage, gateHt[side])} seed={side} />
        </g>
      ))}
      {/* bastions */}
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy], i) => {
        const st = breakState(damage, bastionHt[i]), cx = sx * 238, cy = sy * 238;
        const poly = BASTION_PTS.map(([a, b]) => `${sx * a},${sy * b}`).join(' ');
        return st === 2
          ? <path key={i} d={heap(cx + sx * 12, cy + sy * 12, 60, 50, 80 + i, 5)} fill={T(PAL.rubble)} stroke={T('#2E241C')} strokeWidth={0.6} />
          : (
            <g key={i}>
              <polygon points={poly} fill={T(PAL.rampart)} stroke={T(PAL.brickDark)} strokeWidth={2.2} strokeLinejoin="round" />
              <polygon points={BASTION_PTS.map(([a, b]) => `${sx * (236.8 + (a - 236.8) * 0.68)},${sy * (236.8 + (b - 236.8) * 0.68)}`).join(' ')} fill={T(PAL.rampartTop)} stroke={T(PAL.brick)} strokeWidth={1.4} strokeLinejoin="round" />
              <circle cx={sx * 232} cy={sy * 232} r={6} fill={T('#6E6A62')} stroke="#1B1712" strokeWidth={0.9} />
              {st === 1 && <path d={`M${sx * 244},${sy * 214}l${sx * 6},${sy * 10}l${-sx * 5},${sy * 8}`} stroke="#241A12" strokeWidth={1.1} fill="none" />}
            </g>
          );
      })}
    </g>
  );
};

/** One gate in the north-wall frame (centre u=0): two towers with a 6 m passage, curved bridge outwards over the moat. */
const Gate: React.FC<{ T: (c: string) => string; st: 0 | 1 | 2; seed: number }> = ({ T, st, seed }) => (
  <g>
    <path d={`M0,${-H + 4}V${-H - 6}Q14,${-H - 24} 0,${-H - CITADEL.moat - 14}`} fill="none" stroke={T('#6C5A40')} strokeWidth={9.6} strokeLinecap="butt" />
    <path d={`M0,${-H + 4}V${-H - 6}Q14,${-H - 24} 0,${-H - CITADEL.moat - 14}`} fill="none" stroke={T('#CDB083')} strokeWidth={7.2} strokeLinecap="butt" />
    {st === 2 ? <path d={heap(0, -H + 6, 44, 22, 120 + seed, 4)} fill={T(PAL.rubble)} stroke={T('#2E241C')} strokeWidth={0.5} />
      : (
        <g>
          {[-1, 1].map((s) => (
            <g key={s}>
              <rect x={s < 0 ? -22 : 3.2} y={-H - 3} width={18.8} height={17} fill={T(PAL.brick)} stroke={T(PAL.brickDark)} strokeWidth={1.4} />
              <rect x={s < 0 ? -20 : 5.2} y={-H - 1} width={14.8} height={13} fill={T(PAL.roofs[st === 1 ? 2 : 0])} stroke={T('#3A2A22')} strokeWidth={0.7} />
              <line x1={s < 0 ? -20 : 5.2} y1={-H + 5.5} x2={s < 0 ? -5.2 : 20} y2={-H + 5.5} stroke={T('#3A2A22')} strokeWidth={0.6} />
            </g>
          ))}
          <rect x={-3.2} y={-H - 3} width={6.4} height={17} fill={T(PAL.dust)} />
          {st === 1 && <path d={`M-18,${-H - 3}l4,6l-3,5l5,6`} stroke="#241A12" strokeWidth={0.9} fill="none" />}
        </g>
      )}
  </g>
);

/** The memorial park today: central monument on stepped plinth, the museum in the south-west corner, paths. */
const MemorialToday: React.FC<{ T: (c: string) => string }> = ({ T }) => (
  <g>
    <path d="M-228,-228L228,228M228,-228L-228,228" stroke={T('#D9CDA8')} strokeWidth={4} opacity={0.5} />
    <rect x={-34} y={-34} width={68} height={68} fill={T('#C9C2B0')} stroke="#2E2A22" strokeWidth={1} />
    <rect x={-22} y={-22} width={44} height={44} fill={T('#E4DCC6')} stroke="#2E2A22" strokeWidth={0.8} />
    <rect x={-8} y={-8} width={16} height={16} fill={T('#8B2F25')} stroke="#2E2A22" strokeWidth={0.8} />
    <rect x={-190} y={150} width={70} height={36} fill={T('#D8CFB5')} stroke={T('#3A2A22')} strokeWidth={1} /><rect x={-186} y={154} width={62} height={28} fill={T(PAL.roofs[0])} />
    {[[-120, -90], [120, -100], [110, 110], [-100, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill={T('#E7B9C5')} opacity={0.6} />)}
  </g>
);
