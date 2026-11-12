import React from 'react';
import { Hero, Look, LOOKS, Pose, walkPose, Glow, Motorbike, clamp, rnd } from '../../engine';
import { NEIGHBOUR_A, NEIGHBOUR_B, NEIGHBOUR_C, NEIGHBOUR_D } from './chc-neighbours-props';
import { BackpackWorn, PACK } from './chc-backpack-and-cat-props';

// Chapter C, the road: a side-on evacuation road at dusk (processions of people with orange backpacks like Pip's,
// loaded cars and bikes) and the night bus window. Pure functions of the shot clock `t`.

const CROWD_LOOKS: Look[] = [NEIGHBOUR_A, NEIGHBOUR_B, NEIGHBOUR_C, NEIGHBOUR_D, LOOKS.mo, LOOKS.mom, LOOKS.suit];

/** The dusk sky, far hills and the road band. `pan` shifts the hills with parallax. */
export const RoadBackdrop: React.FC<{ id: string; pan?: number }> = ({ id, pan = 0 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="720" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2A2250" />
        <stop offset="0.55" stopColor="#8A4E6A" />
        <stop offset="1" stopColor="#F0A25A" />
      </linearGradient>
      <linearGradient id={`${id}road`} x1="0" y1="700" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#3A3446" />
        <stop offset="1" stopColor="#201C2A" />
      </linearGradient>
    </defs>
    <rect x={-1200} y={-400} width={4400} height={1120} fill={`url(#${id}sky)`} />
    <circle cx={1500 - pan * 0.05} cy={640} r={90} fill="#FFD9A0" opacity={0.85} />
    <Glow x={1500 - pan * 0.05} y={640} r={520} kind="warm" o={0.6} />
    <g transform={`translate(${-pan * 0.15} 0)`}>
      <path d="M -1200 700 L -1200 600 Q -700 520 -200 610 Q 300 540 800 620 Q 1400 530 2000 620 Q 2600 560 3200 610 L 3200 700 Z" fill="#5A3A5E" opacity={0.8} />
    </g>
    <g transform={`translate(${-pan * 0.35} 0)`}>
      <path d="M -1200 710 L -1200 650 Q -800 610 -300 660 Q 200 620 700 668 Q 1300 616 1900 664 Q 2500 626 3200 660 L 3200 710 Z" fill="#2E2342" />
      {Array.from({ length: 34 }).map((_, i) => (
        <g key={i} transform={`translate(${-1100 + i * 130 + rnd(9, i) * 50} ${690})`}>
          <rect x={-3} y={-60 - rnd(10, i) * 30} width={6} height={64} fill="#1E1630" />
          <ellipse cy={-80 - rnd(10, i) * 30} rx={26 + rnd(11, i) * 14} ry={34 + rnd(12, i) * 10} fill="#241A38" />
        </g>
      ))}
    </g>
    <rect x={-1200} y={700} width={4400} height={400} fill={`url(#${id}road)`} />
    <rect x={-1200} y={700} width={4400} height={22} fill="#6A5A70" />
    <rect x={-1200} y={722} width={4400} height={6} fill="#241F30" />
    {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1200 + i * 150 - ((pan * 1) % 150)} y={896} width={80} height={8} rx={3} fill="#D8CDB0" opacity={0.6} />)}
  </g>
);

/** A loaded hatchback in side view (front to the right), a roof stack and a bag on the back. x centre, y ground, ~230 wide at s 1. */
export const RoadCar: React.FC<{ x: number; y: number; s?: number; color?: string; facing?: 1 | -1; bounce?: number }> = ({ x, y, s = 1, color = '#4C7A9A', facing = 1, bounce = 0 }) => (
  <g transform={`translate(${x} ${y + bounce}) scale(${s * facing} ${s})`}>
    <ellipse cx={0} cy={6} rx={140} ry={11} fill="#000" opacity={0.4} />
    <path d="M -118 -22 L -118 -60 Q -118 -74 -100 -76 L -56 -80 Q -34 -118 4 -118 L 54 -118 Q 84 -112 98 -80 L 114 -74 Q 122 -72 122 -56 L 122 -22 Z" fill={color} stroke="#14121A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -44 -80 Q -26 -108 4 -108 L 20 -108 L 20 -80 Z M 32 -108 L 52 -108 Q 74 -104 86 -80 L 32 -80 Z" fill="#FFD890" opacity={0.85} stroke="#14121A" strokeWidth={3} />
    <path d="M -118 -50 L 122 -50" stroke="#000" strokeWidth={3} opacity={0.2} />
    {/* the roof load: a suitcase, a rolled mat and a bag strapped on */}
    <rect x={-60} y={-146} width={64} height={30} rx={6} fill="#8A5A3A" stroke="#2A1810" strokeWidth={3} />
    <rect x={10} y={-138} width={44} height={22} rx={10} fill="#C9B48A" stroke="#2A1810" strokeWidth={3} />
    <path d="M -64 -126 L 58 -126" stroke="#14121A" strokeWidth={3} />
    <circle cx={-72} cy={-22} r={26} fill="#14121A" />
    <circle cx={-72} cy={-22} r={13} fill="#8C8A98" />
    <circle cx={78} cy={-22} r={26} fill="#14121A" />
    <circle cx={78} cy={-22} r={13} fill="#8C8A98" />
    <rect x={116} y={-52} width={10} height={14} rx={3} fill="#FFF1C0" />
    <rect x={-124} y={-52} width={8} height={14} rx={3} fill="#FF4A3A" />
  </g>
);

/**
 * One walker heading right along a road row: x wraps around `span`. Pip's orange backpack on every back. `speed` is a
 * multiple of a natural stride (px per frame = 6.2 * scale), `ring` 0..1 pulses a highlight ring round the pack.
 */
export const Walker: React.FC<{ i: number; t: number; y: number; s: number; speed: number; x0: number; span: number; look?: Look; pack?: string; expr?: Pose['expr']; ring?: number }> = ({
  i, t, y, s, speed, x0, span, look, pack = PACK.pip, expr = 'tired', ring = 0,
}) => {
  const x = ((x0 + t * speed * 6.2 * s) % span + span) % span - 200;
  const phase = t * 0.3 + i * 1.7;
  const pose: Pose = walkPose(x, phase, y, s, { yaw: 0.9, tilt: 7, expr, look: 0.4, armL: { a: 10 * Math.sin(phase), b: 18 }, armR: { a: -10 * Math.sin(phase), b: 18 } }, 1);
  const lk = look ?? CROWD_LOOKS[i % CROWD_LOOKS.length];
  return (
    <g>
      <BackpackWorn pose={pose} layer="back" color={pack} />
      <Hero look={lk} pose={pose} rimId="rimR" shadow={0.8} />
      <BackpackWorn pose={pose} layer="strap" color={pack} />
      {ring > 0 && ring < 1 ? <circle cx={x - 40 * s} cy={pose.y - 62 * s} r={(34 + 46 * ring) * s} fill="none" stroke="#FFB15A" strokeWidth={5 * s + 2} opacity={1 - ring} /> : null}
    </g>
  );
};

/** The whole procession: three rows of walkers and a few loaded vehicles creeping along. `rings` pulses the packs. */
export const RoadProcession: React.FC<{ t: number; seed?: number; rings?: boolean; skipNear?: boolean }> = ({ t, seed = 0, rings = false, skipNear = false }) => {
  const rows: { y: number; s: number; n: number; speed: number }[] = [
    { y: 790, s: 0.4, n: 15, speed: 0.9 },
    { y: 860, s: 0.58, n: 9, speed: 1.0 },
    { y: 975, s: 0.86, n: 5, speed: 1.05 },
  ];
  const span = 3000;
  const pulse = (i: number) => (rings ? clamp((t - 26 - (i % 7) * 4) / 16, 0, 1.2) : 0);
  return (
    <g>
      {Array.from({ length: rows[0].n }).map((_, i) => (
        <Walker key={`f${i}`} i={i + seed} t={t} y={rows[0].y} s={rows[0].s} speed={rows[0].speed} x0={(i * span) / rows[0].n + rnd(3, i) * 70} span={span} pack={i % 4 === 2 ? PACK.crowd[2] : PACK.pip} ring={pulse(i)} />
      ))}
      <RoadCar x={((600 + t * 1.6) % span) - 200} y={850} s={0.6} color="#4C7A9A" bounce={Math.sin(t / 3) * 0.8} />
      <RoadCar x={((1900 + t * 1.6) % span) - 200} y={850} s={0.6} color="#B8574A" bounce={Math.sin(t / 3 + 1) * 0.8} />
      {Array.from({ length: 2 }).map((_, i) => (
        <Motorbike key={`mb${i}`} x={((1200 + i * 1300 + t * 2.4) % span) - 200} y={868} s={0.58} facing={1} color={i ? '#D9A441' : '#3E6A8A'} />
      ))}
      {Array.from({ length: rows[1].n }).map((_, i) => (
        <Walker key={`m${i}`} i={i + 20 + seed} t={t} y={rows[1].y} s={rows[1].s} speed={rows[1].speed} x0={(i * span) / rows[1].n + rnd(5, i) * 90} span={span} pack={i % 5 === 3 ? PACK.crowd[4] : PACK.pip} ring={pulse(i + 3)} />
      ))}
      {skipNear
        ? null
        : Array.from({ length: rows[2].n }).map((_, i) => (
            <Walker key={`n${i}`} i={i + 40 + seed} t={t} y={rows[2].y} s={rows[2].s} speed={rows[2].speed} x0={(i * span) / rows[2].n + rnd(7, i) * 120} span={span} pack={PACK.pip} ring={pulse(i + 5)} />
          ))}
    </g>
  );
};

// ---------- the bus at night: window, passing lights, seat backs, a hand rail ----------
/** The night window of a bus: a dark glass with city lights streaking past at several speeds. Box x, y, w, h. */
export const NightWindow: React.FC<{ id: string; x: number; y: number; w: number; h: number; t: number; speed?: number }> = ({ id, x, y, w, h, t, speed = 1 }) => (
  <g>
    <defs>
      <clipPath id={`${id}clip`}><rect x={x} y={y} width={w} height={h} rx={26} /></clipPath>
      <linearGradient id={`${id}glass`} x1="0" y1={y} x2="0" y2={y + h} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0C1030" />
        <stop offset="1" stopColor="#1C2250" />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} rx={26} fill={`url(#${id}glass)`} />
    <g clipPath={`url(#${id}clip)`}>
      {Array.from({ length: 60 }).map((_, i) => {
        const sp = (0.9 + rnd(21, i) * 3.2) * speed;
        const lx = x + w - (((t * sp * 3 + rnd(22, i) * 3000) % (w + 300)) - 100);
        const ly = y + h * (0.55 + rnd(23, i) * 0.4) - (rnd(24, i) > 0.7 ? h * 0.3 : 0);
        const warm = rnd(25, i) > 0.35;
        return (
          <g key={i} opacity={0.4 + 0.5 * rnd(26, i)}>
            <rect x={lx} y={ly} width={14 + sp * 8} height={4 + rnd(27, i) * 4} rx={3} fill={warm ? '#FFD08A' : '#BFD8FF'} />
            <circle cx={lx + 4} cy={ly + 3} r={14} fill={warm ? '#FFB347' : '#8FB8FF'} opacity={0.25} />
          </g>
        );
      })}
      <path d={`M ${x} ${y + h * 0.9} L ${x + w} ${y + h * 0.86}`} stroke="#3A4068" strokeWidth={5} opacity={0.6} />
    </g>
    <rect x={x} y={y} width={w} height={h} rx={26} fill="none" stroke="#14121A" strokeWidth={10} />
    <path d={`M ${x + 20} ${y + 18} L ${x + w * 0.4} ${y + 18} L ${x + w * 0.3} ${y + h - 20} L ${x + 20} ${y + h - 20} Z`} fill="#FFFFFF" opacity={0.04} clipPath={`url(#${id}clip)`} />
  </g>
);

/** The inside of a night bus behind a seated pair: wall, window, a ceiling strip light, the bench back, a hand rail. */
export const BusInterior: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <rect x={-600} y={-400} width={3200} height={1900} fill="#1C1A26" />
    <rect x={-600} y={-400} width={3200} height={260} fill="#2A2634" />
    <rect x={500} y={-150} width={920} height={26} rx={13} fill="#FFE7B0" opacity={0.5} />
    <Glow x={960} y={-130} r={520} kind="warm" o={0.2} />
    <NightWindow id={id} x={380} y={70} w={1160} h={380} t={t} />
    <rect x={380} y={450} width={1160} height={22} fill="#2A2634" />
    {/* the seat rows behind: dark headrests against the wall */}
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={0.9}>
        <rect x={-120 + i * 70} y={500 + i * 8} width={120} height={300} rx={40} fill="#282236" />
        <rect x={1720 - i * 70} y={500 + i * 8} width={120} height={300} rx={40} fill="#282236" />
      </g>
    ))}
    <path d="M 300 -150 L 300 1100 M 1620 -150 L 1620 1100" stroke="#8C8A98" strokeWidth={14} />
    {[0, 1].map((i) => (
      <path key={i} d={`M ${560 + i * 560} -120 L ${560 + i * 560} -40 Q ${560 + i * 560} 10 ${600 + i * 560 + Math.sin(t / 10 + i) * 4} 40`} stroke="#B8B6C4" strokeWidth={6} fill="none" />
    ))}
    {/* the bench they sit against */}
    <rect x={620} y={470} width={760} height={560} rx={44} fill="#3A3050" />
    <rect x={620} y={470} width={760} height={560} rx={44} fill="none" stroke="#201A2E" strokeWidth={6} />
    <path d="M 650 500 L 1350 500" stroke="#5A4E78" strokeWidth={6} opacity={0.7} strokeLinecap="round" />
  </g>
);
