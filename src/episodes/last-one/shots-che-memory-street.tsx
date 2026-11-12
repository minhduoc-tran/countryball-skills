import React from 'react';
import {
  kf, camT, rnd, easeOut, clamp, Hero, faceAt, LOOKS, Street, Motorbike, Bicycle, bikePose, CrossroadsTop, LyingPipTop, proj, propScale, streetStand, ST, FONT, ShotProps,
} from '../../engine';

// Chapter E, the street shots: the "kẹt xe" memory, the whole road packed with motorbikes (E13); the crossroads
// from above, "cả thành phố" (E20); and Pip riding free down the empty road, "cả sự tự do" (E21).

const PIP = LOOKS.pipHood;
const JACKETS = ['#D94452', '#3A78D4', '#E8E2D2', '#4BAE5A', '#F2C230', '#8A58C8', '#2E2B3D'];
const BIKES = ['#B8483E', '#3E6A8A', '#D9A441', '#2E2B3D', '#EDE6D6', '#2FA595', '#7A5A8A'];

/** A faceless rider on a Motorbike, in the bike's own coordinates (seat at y -92, bars at 62, -116). */
const Rider: React.FC<{ jacket: string; helmet: string; lean: number }> = ({ jacket, helmet, lean }) => (
  <g strokeLinecap="round" strokeLinejoin="round" fill="none" transform={`rotate(${lean} -30 -96)`}>
    <path d="M -30 -94 L 24 -92 L 34 -40" stroke="#1E1C2A" strokeWidth={17} />
    <path d="M -30 -96 L -20 -166" stroke={jacket} strokeWidth={34} />
    <path d="M -18 -158 L 22 -138 L 60 -118" stroke={jacket} strokeWidth={13} />
    <circle cx={-14} cy={-196} r={19} fill={helmet} stroke="#1A1824" strokeWidth={3} />
    <path d="M -2 -200 L 8 -200" stroke="#1A1824" strokeWidth={4} />
  </g>
);

// ---------- E13: MEMORY: the street packed solid with motorbikes, nose to tail, horns ----------
const JAM = (() => {
  const out: { X: number; Z: number; facing: 1 | -1; bike: string; jacket: string; helmet: string; lean: number }[] = [];
  [4.6, 5.8, 7.2, 8.8, 10.6, 13, 16, 20, 25].forEach((Z, r) => {
    const n = Math.max(3, Math.round(7.6 / (0.55 + Z * 0.1)));
    for (let i = 0; i < n; i++) {
      const X = -3.7 + (7.4 * (i + 0.5 * (r % 2))) / Math.max(1, n - 1 + (r % 2) * 0.5) + (rnd(r, i) - 0.5) * 0.4;
      out.push({ X: Math.min(3.9, X), Z, facing: (rnd(r + 3, i) > 0.5 ? 1 : -1) as 1 | -1, bike: BIKES[(i + r) % BIKES.length], jacket: JACKETS[(i * 2 + r) % JACKETS.length], helmet: i % 3 ? '#F2C230' : '#E8E2D2', lean: (rnd(r + 9, i) - 0.5) * 6 });
    }
  });
  return out.sort((a, b) => b.Z - a.Z);
})();
export const E13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 990]]), 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Street t={t + 30} id="e13st" light="red" />
    {JAM.map((b, i) => {
      const p = proj(b.X, 0, b.Z);
      const s = propScale(b.Z);
      return (
        <g key={i}>
          <Motorbike x={p.x} y={p.y} s={s} facing={b.facing} color={b.bike} t={t + i} lamp={0.5} lean={b.lean} />
          <g transform={`translate(${p.x} ${p.y}) scale(${s * b.facing} ${s})`}>
            <Rider jacket={b.jacket} helmet={b.helmet} lean={b.lean} />
          </g>
        </g>
      );
    })}
    {[[470, 330, 0, -8], [1230, 290, 5, 6], [1560, 400, 9, 10]].map(([x, y, d, r], i) => (
      <text key={i} x={x} y={y} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={90} fill="#FFE27A" stroke="#3A1A10" strokeWidth={8} paintOrder="stroke" opacity={(t + d) % 12 < 8 ? 1 : 0.2} transform={`rotate(${r} ${x} ${y})`}>
        BÍP
      </text>
    ))}
  </g>
);

// ---------- E20: "cả thành phố": the empty crossroads from above, Pip lying in the middle of it ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${kf(t, [[0, -3], [len, 3]])}) scale(${kf(t, [[0, 1.0], [len, 1.14]])}) translate(-960 -540)`}>
    <CrossroadsTop t={t + 20} id="e20xr" />
    <LyingPipTop x={960} y={578} scale={0.95} t={t} blink={t % 40 > 36 ? 1 : 0} />
  </g>
);

// ---------- E21: "cả sự tự do": Pip rides the empty road at dusk, hands off the bars ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 4.3;
  const X = kf(t, [[0, -3.0], [len, 1.8]], (k) => k);
  const g = proj(X, 0, Z);
  const sc = streetStand(X, Z, { k: 1.55 }).scale;
  const camX = g.x + 40;
  return (
    <g transform={camT(camX, 640, 1.2)}>
      <Street t={t + 60} id="e21st" light="green" />
      <Bicycle x={g.x} y={g.y} s={sc} t={t} />
      <Hero look={PIP} pose={{ ...bikePose(t, g.x, g.y, sc, { hands: 'free' }), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};
