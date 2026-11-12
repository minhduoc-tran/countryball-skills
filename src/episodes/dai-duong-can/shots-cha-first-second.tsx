import React from 'react';
import { kf, clamp, camT, rnd, ShotProps, Dust } from '../../engine';
import { DanangBeach } from './kit-danang-beach';
import { DrySeabed, FishFlop, StrandedShip } from './kit-dry-seabed';
import { SpeakerMute } from './cha-beach-props';
import { PAL } from './kit-palette';

// Chapter A, the first second (15.7-22.9 s): the sound cuts and the world freezes; billions of fish flop on the seabed;
// huge ships lie tilted in the mud. Looks (sec1 chip) are set on A10-A12 in the chapter json.

// ---------- A10: silence: the speaker's arcs die and slash out, and the whole beach freezes (palms stop) ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <DanangBeach id="cb10" t={Math.min(t, 40) + 200} drain={1} people={[]} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={kf(t, [[40, 0.12], [48, 0.3]])} />
    <SpeakerMute x={960} y={400} t={t} at={40} />
  </g>
);

// fish on the shelf: [x, ground y, size]: nearer (lower) is bigger
const FISH: [number, number, number][] = [
  [300, 780, 0.55], [560, 840, 0.75], [830, 790, 0.58], [1090, 920, 1.0], [1390, 830, 0.7], [1650, 960, 1.15], [210, 1010, 1.3],
  [980, 700, 0.36], [1250, 722, 0.38], [700, 712, 0.34], [1520, 735, 0.4], [420, 705, 0.33], [1800, 760, 0.5], [60, 840, 0.7],
];
const TINY = Array.from({ length: 22 }).map((_, i) => [80 + rnd(40, i) * 1760, 676 + rnd(41, i) * 40, 0.17 + rnd(42, i) * 0.07] as [number, number, number]);

// ---------- A11: wide: the dry shelf is covered in flapping fish, hundreds in the distance ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1150], [len, 800]]), 560, kf(t, [[0, 1.08], [len, 1.18]]))}>
    <DrySeabed id="cb11" t={t + 30} haze={0.25} />
    {TINY.map(([x, y, s], i) => <FishFlop key={`t${i}`} x={x} y={y} t={t} s={s} seed={i + 20} />)}
    {FISH.map(([x, y, s], i) => <FishFlop key={i} x={x} y={y} t={t} s={s} seed={i + 1} />)}
  </g>
);

// ---------- A12: macro: one big fish thrashing on the cracked ground, dust kicking up ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 990]]), 740, kf(t, [[0, 1.5], [len, 1.7]]))}>
    <DrySeabed id="cb12" t={t + 60} haze={0.2} />
    <FishFlop x={960} y={880} t={t} s={2.6} seed={6} />
    {Array.from({ length: 10 }).map((_, i) => {
      const ph = ((t * 0.07 + i * 0.1) % 1) * 20;
      return <circle key={i} cx={960 + (rnd(50, i) - 0.5) * 460 + ph * (rnd(51, i) - 0.5) * 8} cy={880 - ph * 6 + 20} r={4 + rnd(52, i) * 5} fill="#D8C49A" opacity={clamp(1 - ph / 20) * 0.7} />;
    })}
    <g filter="url(#blur6)"><FishFlop x={520} y={1000} t={t + 8} s={2.2} seed={3} /></g>
  </g>
);

// A foreground rock to hide the lifted end of a tilted hull
const Rock: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <path d={`M ${x - w / 2} ${y} Q ${x - w * 0.45} ${y - h} ${x - w * 0.1} ${y - h * 0.95} Q ${x + w * 0.3} ${y - h * 1.1} ${x + w / 2} ${y} Z`} fill="#4E3F31" stroke={PAL.ink} strokeWidth={4} />
    <path d={`M ${x - w * 0.3} ${y - h * 0.7} Q ${x} ${y - h * 0.95} ${x + w * 0.2} ${y - h * 0.8}`} stroke="#8A7556" strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
  </g>
);

// ---------- A13: low angle: a container ship towers over the camera, tipped in the mud ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 840], [len, 930]]), kf(t, [[0, 580], [len, 560]]), kf(t, [[0, 1.04], [len, 1.14]]))}>
    <DrySeabed id="cb13" t={t + 90} haze={0.3} />
    <StrandedShip x={900} y={950} sc={1.2} rot={-13} t={t} />
    <Rock x={420} y={1010} w={340} h={110} />
    <Rock x={1470} y={1020} w={300} h={90} />
    <FishFlop x={1180} y={1040} t={t} s={1.2} seed={9} />
    <Dust t={t} seed={13} x0={0} y0={500} w={1920} h={500} n={26} o={0.35} />
  </g>
);

// ---------- A14: wide: more ships in the mud, tilted every which way, the nearest slowly settling ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 1000]]), 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
    <DrySeabed id="cb14" t={t + 110} haze={0.35} />
    <StrandedShip x={1280} y={740} sc={0.55} rot={11} t={t} />
    <StrandedShip x={640} y={900} sc={0.8} rot={-12} t={t + 30} />
    <Rock x={330} y={930} w={260} h={80} />
    <Rock x={960} y={940} w={240} h={70} />
    <StrandedShip x={1720} y={690} sc={0.38} rot={-9} t={t + 60} />
    <Rock x={1380} y={760} w={170} h={50} />
  </g>
);
