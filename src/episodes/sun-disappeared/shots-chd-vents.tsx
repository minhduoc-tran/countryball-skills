import React from 'react';
import { kf, camT, Glow, ShotProps, rnd } from '../../engine';
import { DeepSeabed, BlackSmoker, TubeWorms, Shrimp } from './chd-vent-props';

// Chapter D, beat "power: vents" (D22-D24): life at the deep-sea vents goes on as if nothing happened.

const Rocks: React.FC<{ y: number; seed: number }> = ({ y, seed }) => (
  <g>
    {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} cx={-100 + rnd(seed, i) * 2100} cy={y + 20 + rnd(seed + 1, i) * 60} rx={50 + rnd(seed + 2, i) * 90} ry={16 + rnd(seed + 3, i) * 26} fill="#1C1620" stroke="#3A2A3C" strokeWidth={2} />)}
  </g>
);

// ---------- D22: wide: the dark seabed, a black smoker steaming; a slow push in ----------
export const D22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 520], [len, 600]]), kf(t, [[0, 0.9], [len, 1.25]]))}>
    <DeepSeabed id="d22" t={t} floor={820} />
    <Rocks y={840} seed={4} />
    <BlackSmoker x={1000} y={850} s={1.3} t={t + 40} />
    <BlackSmoker x={470} y={880} s={0.6} t={t + 90} h={300} />
    <TubeWorms x={1260} y={870} s={0.8} t={t} n={6} seed={11} />
    <Glow x={1000} y={850} r={520} kind="warm" o={0.25} />
  </g>
);

// ---------- D23: closer: tube worms and shrimp glowing around the vent, peaceful ----------
export const D23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 960]]), kf(t, [[0, 700], [len, 680]]), kf(t, [[0, 1.5], [len, 1.8]]))}>
    <DeepSeabed id="d23" t={t + 200} floor={860} />
    <Rocks y={870} seed={9} />
    <BlackSmoker x={1360} y={900} s={0.9} t={t} h={320} />
    <TubeWorms x={820} y={900} s={1.5} t={t} n={9} seed={5} />
    <TubeWorms x={1070} y={910} s={1.0} t={t + 12} n={6} seed={8} />
    <Shrimp x={620} y={720} s={1.5} t={t} seed={1} />
    <Shrimp x={1000} y={640} s={1.2} t={t + 20} seed={3} />
    <Shrimp x={1180} y={760} s={1.0} t={t + 40} seed={5} />
    <Glow x={900} y={800} r={460} kind="red" o={0.22} />
  </g>
);

// ---------- D24: wide again, drifting back: the whole vent field living quietly ----------
const D24_LEN = 74; // real length (207.67 s -> chapter end); `len` is huge when previewed alone
export const D24: React.FC<ShotProps> = ({ t }) => {
  const len = D24_LEN;
  return (
  <g transform={camT(kf(t, [[0, 1000], [len, 940]]), kf(t, [[0, 640], [len, 560]]), kf(t, [[0, 1.25], [len, 0.85]]))}>
    <DeepSeabed id="d24" t={t + 400} floor={820} />
    <Rocks y={840} seed={13} />
    <BlackSmoker x={620} y={860} s={1.1} t={t + 20} />
    <BlackSmoker x={1450} y={870} s={0.9} t={t + 70} h={330} />
    <TubeWorms x={900} y={880} s={1.0} t={t} n={8} seed={21} />
    <TubeWorms x={1180} y={885} s={0.8} t={t + 9} n={7} seed={24} />
    <TubeWorms x={320} y={890} s={0.7} t={t + 5} n={6} seed={27} />
    <Shrimp x={880} y={700} s={1.1} t={t} seed={2} />
    <Shrimp x={1250} y={730} s={1.0} t={t + 30} seed={6} />
    <Shrimp x={540} y={760} s={0.9} t={t + 15} seed={9} />
    <Glow x={620} y={860} r={460} kind="warm" o={0.2} />
    <Glow x={1450} y={870} r={420} kind="warm" o={0.18} />
  </g>
);
};
