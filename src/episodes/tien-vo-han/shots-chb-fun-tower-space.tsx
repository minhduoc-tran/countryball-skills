import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, Rooftop, Sparkle, Glow, Dust, Foreground, rnd, ShotProps,
} from '../../engine';
import { Tower, RoofDoor, Rocket, Earth, PriceChip, Figure, CROWD_COLORS } from './chb-tower-and-space-props';
import { CardTerminal } from './chb-card-terminal-and-confetti';

// Chapter B, the fun part (4/5): the tallest tower in the city, its roof door thrown open for everyone, a sunset full of
// people, then the rocket and the capsule window with the Earth behind Pip (the ticket price, the swipe).

const PIP = LOOKS.pipHood;

// ---------- B16: low angle at the foot of the tower: Pip looks up, the camera tilts up the whole glass tower ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 1440, scale: 0.8, yaw: 0.2, look: 0.2, headTilt: -14, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 14, p: { armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, squash: -0.05 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 1250], [len, -380]]), kf(t, [[0, 1.0], [len, 0.78]]))}>
      <Tower t={t} id="b16" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Sparkle x={960} y={-2480} t={t - 30} s={4} />
    </g>
  );
};

// ---------- B17: the roof door swings open onto the sunset, people stream out; Pip waves them through ----------
export const B17: React.FC<ShotProps> = ({ t }) => {
  const wave = poseAt(t, [
    { f: 0, p: { x: 460, y: 760, scale: 1.15, yaw: 0.7, look: 0.8, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 6, p: { armR: { a: 120, b: 20 } }, ease: easeOut },
    { f: 18, p: { armR: { a: 95, b: 30 } } },
    { f: 30, p: { armR: { a: 125, b: 18 } } },
    { f: 42, p: { armR: { a: 95, b: 30 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [60, 1000]]), 600, kf(t, [[0, 1.0], [60, 1.12]]))}>
      <RoofDoor t={t} open={(t - 4) / 16} />
      {Array.from({ length: 9 }).map((_, i) => {
        const q = clamp((t - 14 - i * 4) / 34);
        if (q <= 0) return null;
        const side = i % 2 ? 1 : -1;
        const x = 960 + side * (30 + (i * 53) % 330) * easeOut(q) + (i % 3) * 20;
        const y = 800 + 330 * q;
        return <Figure key={i} x={x} y={y} s={0.55 + 0.75 * q} c={CROWD_COLORS[i % 7]} t={t} seed={i} up={0.7} walk={1} flip={side < 0} />;
      })}
      <Hero look={PIP} pose={{ ...wave, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Dust t={t} seed={61} x0={600} y0={200} w={800} h={600} n={26} o={0.6} />
    </g>
  );
};

// ---------- B18: the rooftop at sunset, packed with people watching it, Pip among them ----------
const CROWD = Array.from({ length: 16 }).map((_, i) => ({
  x: 160 + ((i * 197) % 1600), y: 850 + (i % 3) * 70, c: CROWD_COLORS[i % 7], sit: i % 5 === 3, up: i % 4 === 0 ? 0.8 : 0, flip: i % 2 === 0,
}));
export const B18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1010, y: 800, scale: 1.1, yaw: 0.8, look: 0.8, armL: { a: 14, b: -6 }, armR: { a: 150, b: 20 }, headTilt: -4 } },
    { f: 30, p: { armR: { a: 130, b: 20 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 640, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={t + 120} sunX={1290} sunY={620} />
      <Glow x={1290} y={620} r={900} o={0.35} />
      {[...CROWD].sort((a, b) => a.y - b.y).map((p, i) => (
        <Figure key={i} x={p.x} y={p.y + 30} s={1.05 + (p.y - 850) / 450} c={p.c} t={t} seed={i} up={p.up} sit={false} flip={p.flip} />
      ))}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Sparkle x={1290} y={560} t={t % 40} s={1.2} />
    </g>
  );
};

// ---------- B19: the rocket on its pad lifts off in a rush of flame and smoke, Pip waving in the porthole ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => {
  const y = kf(t, [[0, 640], [12, 630], [len, -520]], easeIn);
  const fire = clamp(t / 10);
  const sh = t > 10 ? { x: Math.sin(t * 2.9) * 4, y: Math.cos(t * 3.7) * 3 } : { x: 0, y: 0 };
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(960, 540, 1.0)}`}>
      <defs><linearGradient id="b19s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A1A4A" /><stop offset="0.6" stopColor="#7A4A9A" /><stop offset="1" stopColor="#FFB070" /></linearGradient></defs>
      <rect x={-400} y={-400} width={2720} height={1480} fill="url(#b19s)" />
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={rnd(2, i) * 1920} cy={rnd(3, i) * 500} r={1 + rnd(4, i) * 2} fill="#fff" opacity={0.7} />)}
      <rect x={-400} y={880} width={2720} height={300} fill="#3A3048" />
      <rect x={780} y={860} width={360} height={30} fill="#6A6478" />
      <Rocket x={960} y={y} s={1.0} t={t} fire={fire} />
      {/* smoke at the pad, growing and drifting out */}
      {Array.from({ length: 14 }).map((_, i) => {
        const k = Math.max(0, t - 8 - i);
        const sd = i % 2 ? 1 : -1;
        return k > 0 ? <circle key={i} cx={960 + sd * (40 + k * 11 + rnd(1, i) * 60)} cy={880 - k * 2 - rnd(2, i) * 30} r={30 + k * 2.6} fill="#EDE6F2" opacity={0.45 * clamp(1 - k / 50)} /> : null;
      })}
      <Glow x={960} y={880} r={500} o={0.5 * fire} />
    </g>
  );
};

// ---------- B20: inside the capsule: the Earth in the porthole, Pip floating, the price, and the swipe ----------
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const bob = Math.sin(t / 14) * 22;
  const spin = Math.sin(t / 30) * 10;
  const pose = poseAt(t, [
    { f: 0, p: { x: 560, y: 560, scale: 1.25, yaw: 0.3, look: 0.5, tilt: 8, armL: { a: 40, b: 20 }, armR: { a: 60, b: 20 }, legL: { a: 24, b: -20 }, legR: { a: -14, b: 20 } } },
    { f: 50, p: { armR: { a: 85, b: 10 }, tilt: 4 } },
  ]);
  const k = t - 58;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#23232F" />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#3A3A4E" opacity={0.0} />
      {/* the porthole: stars and the Earth behind */}
      <circle cx={1050} cy={470} r={400} fill="#6A6C80" stroke="#2A2A38" strokeWidth={14} />
      <circle cx={1050} cy={470} r={360} fill="#05061A" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={940 + rnd(5, i) * 480} cy={230 + rnd(6, i) * 480} r={1 + rnd(7, i) * 2.4} fill="#fff" opacity={0.5 + 0.4 * Math.sin(t / 6 + i)} />)}
      <Earth x={1050} y={620} r={250} t={t} id="b20e" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={`b${i}`} cx={1050 + Math.cos((i / 8) * 6.283) * 382} cy={470 + Math.sin((i / 8) * 6.283) * 382} r={9} fill="#8A8CA0" />)}
      <rect x={-300} y={900} width={2520} height={400} fill="#2E2E3C" />
      <path d="M -300 900 H 2300" stroke="#4A4A5E" strokeWidth={6} />
      <Glow x={1050} y={470} r={600} kind="cool" o={0.18} />
      {/* floating items: a pen and a cookie drift past */}
      <g transform={`translate(${300 + Math.sin(t / 20) * 30} ${220 + Math.cos(t / 17) * 20}) rotate(${t * 0.8})`}><rect x={-30} y={-5} width={60} height={10} rx={5} fill="#E9B84A" /></g>
      <Hero look={PIP} pose={{ ...pose, y: pose.y + bob, spin, ...faceAt(t, [[0, 'happy'], [20, 'shock'], [34, 'happy']]), sway: 6 * Math.sin(t / 9) }} rimId="rimR" shadow={0} />
      <PriceChip x={560} y={120} t={t - 12} text="VÉ ≈ 55 TRIỆU USD" />
      {k > -8 ? <g opacity={clamp((k + 8) / 6)}><CardTerminal x={1660} y={950} s={1.2} k={k} hand={false} lean={-5} /></g> : null}
      <Foreground blur={10}><circle cx={-60} cy={1060} r={240} fill="#14141C" /></Foreground>
    </g>
  );
};
