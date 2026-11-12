import React from 'react';
import { clamp, easeInOut, hash, prog } from './fx-math';
import { AXIS_DEG, BUILDING, GROUNDS, MAIN_GATE, ptsD, SIDE_GATE_L, SIDE_GATE_R, localToPalace, palaceToLocal } from './palace-geometry';
import { FlagCloth, FlagKind } from './flag-cloth';
import { PAL } from './palace-plan-town-layer';
import { tone } from './citadel-palette';

// The grounds of Dinh Độc Lập in local metres, drawn over the town layer: perimeter fence, the lawn with the oval and its fountain, the
// driveway, the palace roof (OSM footprint, flat roof, the 5th-floor pavilion with its wide canopy, the roof helipad), the front steps,
// the three gates in the fence (main gate with `gate` 0..1 = intact -> bent -> down; two side gates), and the roof flag.
// Palace frame = `rotate(AXIS_DEG)` group: x = front (towards the gate), y = side (to the right when looking at the gate).

const INK = '#2B2B30';
const [MF] = localToPalace(MAIN_GATE[0], MAIN_GATE[1]);       // front distance of the main gate (~164 m)

const Leaf: React.FC<{ sg: 1 | -1; u: number; hinge: number; tone: (c: string) => string }> = ({ sg, u, hinge, tone: T }) => {
  // leaf hinged at `hinge` (side), reaching to the centre of the opening; it falls inwards (-front) as u goes 0 -> 1 and buckles on the way
  const e = easeInOut(u), kink = Math.sin(clamp(u) * Math.PI) * 1.6, d = 0.5 + 3.4 * e, tip = sg * (0.3 + 1.8 * e);
  const a = [MF, sg * hinge], b = [MF - 0.4 * e, tip + sg * kink], c = [MF - d, tip + sg * kink * 0.4 + sg * 0.8 * e], dd = [MF - d, sg * hinge];
  return (
    <g>
      <polygon points={[a, b, c, dd].map((p) => p.map((v) => v.toFixed(2)).join(',')).join(' ')} fill={T('#35353C')} stroke={T('#0F0F12')} strokeWidth={0.25} strokeLinejoin="round" />
      {e > 0.05 && Array.from({ length: 5 }, (_, i) => <line key={i} x1={MF - (d * (i + 0.5)) / 5} y1={sg * hinge} x2={MF - (d * (i + 0.5)) / 5} y2={tip + sg * kink * 0.7} stroke={T('#6A6A72')} strokeWidth={0.18} />)}
    </g>
  );
};

export const PalaceGroundsLayer: React.FC<{ id: string; k: number; night: number; gate: number; flag: FlagKind | 'none'; t: number }> = ({ id, k, night, gate, flag, t }) => {
  const T = (c: string) => tone(c, night), lw = (m: number) => Math.max(m, 1.5 / k);
  const dust = prog(gate, 0.2, 0.55) * (1 - prog(gate, 0.8, 1));
  return (
    <g>
      <path d={ptsD(GROUNDS, true)} fill={T(PAL.groundsFloor)} />
      <g transform={`rotate(${AXIS_DEG})`}>
        {/* the open lawn in front of the palace: the oval, its ring road, the fountain, the driveway to the main gate */}
        <ellipse cx={96} cy={0} rx={46} ry={32} fill={T(PAL.lawn)} stroke={T(PAL.path)} strokeWidth={lw(4.5)} />
        <ellipse cx={96} cy={0} rx={30} ry={19} fill={T(PAL.lawnDark)} opacity={0.55} />
        <path d={`M${MF},0 L${MF - 28},0 M50,0 L56,0`} stroke={T(PAL.path)} strokeWidth={lw(9)} strokeLinecap="round" />
        <path d={`M${MF - 24},0 Q${MF - 40},0 ${96 + 46},0`} stroke={T(PAL.path)} strokeWidth={lw(6)} fill="none" />
        <circle cx={96} cy={0} r={5.2} fill={T('#CFC9B6')} stroke={T('#8A8372')} strokeWidth={lw(0.6)} />
        <circle cx={96} cy={0} r={3.6} fill={T(PAL.water)} />
        <circle cx={96} cy={0} r={0.9} fill="#E9F6FF" />
        <rect x={40} y={-20} width={13} height={40} fill={T('#DAD3BC')} stroke={T('#8C8268')} strokeWidth={lw(0.4)} />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={41.5 + i * 2.6} y1={-19} x2={41.5 + i * 2.6} y2={19} stroke={T('#B7AF98')} strokeWidth={lw(0.3)} />)}
      </g>
      {/* perimeter fence: stone base + iron */}
      <path d={ptsD(GROUNDS, true)} fill="none" stroke={T('#DAD3BC')} strokeWidth={lw(2.4)} strokeLinejoin="round" />
      <path d={ptsD(GROUNDS, true)} fill="none" stroke={T(INK)} strokeWidth={lw(1)} strokeLinejoin="round" />
      {/* the palace roof */}
      <path d={ptsD(BUILDING, true)} fill="#000" opacity={0.25} transform="translate(2.2,3)" />
      <path d={ptsD(BUILDING, true)} fill={T('#E9E3CE')} stroke={T('#7E745C')} strokeWidth={lw(1.1)} strokeLinejoin="round" />
      <g transform={`rotate(${AXIS_DEG})`}>
        <rect x={-14} y={-18} width={34} height={36} fill="#000" opacity={0.18} transform="translate(2,2.4)" />
        <rect x={-14} y={-18} width={34} height={36} fill={T('#F4F0DF')} stroke={T('#8C8268')} strokeWidth={lw(0.9)} />
        <rect x={-8} y={-12} width={22} height={24} fill="none" stroke={T('#B7AF98')} strokeWidth={lw(0.5)} />
        <g transform="translate(-26,22)">
          <circle r={9} fill={T('#CFCAB8')} stroke={T('#6F6A5A')} strokeWidth={lw(0.8)} />
          <circle r={7} fill="none" stroke="#F4F2E8" strokeWidth={lw(0.9)} />
          <path d="M-2.6,-3.6V3.6M2.6,-3.6V3.6M-2.6,0H2.6" stroke="#F4F2E8" strokeWidth={lw(1.1)} fill="none" />
        </g>
        {/* gates: main gate (two leaves + pillars), side gates (closed) */}
        <rect x={MF - 1.2} y={-8.2} width={2.4} height={2.4} fill={T('#EDE8D8')} stroke={T('#7E745C')} strokeWidth={lw(0.3)} />
        <rect x={MF - 1.2} y={5.8} width={2.4} height={2.4} fill={T('#EDE8D8')} stroke={T('#7E745C')} strokeWidth={lw(0.3)} />
        <Leaf sg={-1} u={gate} hinge={5.8} tone={T} />
        <Leaf sg={1} u={gate} hinge={5.8} tone={T} />
        {([SIDE_GATE_L, SIDE_GATE_R] as const).map((g, i) => {
          const [f, s] = localToPalace(g[0], g[1]);
          return <g key={i}><rect x={f - 0.9} y={s - 3.4} width={1.8} height={6.8} fill={T('#35353C')} /><rect x={f - 1.4} y={s - 3.9} width={2.8} height={1.6} fill={T('#EDE8D8')} /><rect x={f - 1.4} y={s + 2.3} width={2.8} height={1.6} fill={T('#EDE8D8')} /></g>;
        })}
      </g>
      {dust > 0.02 && Array.from({ length: 7 }, (_, i) => {
        const p = palaceToLocal(MF - 1 - hash(i, 3) * 6, (hash(i, 4) - 0.5) * 12), r = 3 + 6 * dust * (0.6 + hash(i, 5)) + prog(gate, 0.3, 0.9) * 2;
        return <circle key={i} cx={p[0] + Math.sin(t * 0.05 + i) * 0.8} cy={p[1] - dust * i * 0.5} r={r} fill="#CDBF9B" opacity={0.5 * dust * (1 - i * 0.07)} />;
      })}
      {flag !== 'none' && (
        <g transform={`translate(${palaceToLocal(6, 0)[0]},${palaceToLocal(6, 0)[1]})`}>
          <circle r={0.9} fill={INK} />
          <g transform="rotate(0)"><FlagCloth id={`${id}-pf`} x={0} y={-4.2} w={11} h={7.3} kind={flag} wave={0.6} t={t} /></g>
          <line x1={0} y1={-4.4} x2={0} y2={3.4} stroke={INK} strokeWidth={lw(0.5)} />
        </g>
      )}
    </g>
  );
};
