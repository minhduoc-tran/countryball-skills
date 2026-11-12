import React from 'react';
import { rnd, Glow, StreetLamp, proj, poly, propScale, groundY, mixHex, fogK } from '../../engine';
import { StarSky } from './chc-sky-and-people-props';

// A street at "noon" with the Sun gone: black starry sky, plain dark blocks with lit windows, every lamp glowing.
// Drawn here instead of the engine's Street because that set has Vietnamese shop signs and a moon (this is the
// English episode, and the Moon is dark too). Same one-point perspective and metres as street-geom.ts (vanishing
// point (960, 470)), so streetStand(X, Z) places a character on it.

const LAMP_Z = [3.6, 6.2, 10, 16, 26, 42, 70];

export const NightStreet: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const parts: React.ReactNode[] = [];
  // road and sidewalks
  parts.push(<polygon key="road" points={poly([[-4.2, 0, 1.6], [4.2, 0, 1.6], [4.2, 0, 400], [-4.2, 0, 400]])} fill="#171A30" />);
  [-1, 1].forEach((s) => {
    parts.push(<polygon key={`sw${s}`} points={poly([[s * 4.2, 0.15, 1.6], [s * 7.2, 0.15, 1.6], [s * 7.2, 0.15, 400], [s * 4.2, 0.15, 400]])} fill="#242842" />);
    parts.push(<polygon key={`kb${s}`} points={poly([[s * 4.2, 0, 1.6], [s * 4.2, 0.15, 1.6], [s * 4.2, 0.15, 400], [s * 4.2, 0, 400]])} fill="#33385A" />);
  });
  // road centre dashes
  for (let z = 2; z < 80; z *= 1.28) {
    parts.push(<polygon key={`d${z}`} points={poly([[-0.12, 0, z], [0.12, 0, z], [0.12, 0, z * 1.14], [-0.12, 0, z * 1.14]])} fill="#6A7098" opacity={0.6} />);
  }
  // blocks (no signs) on both sides, far to near, each tinted toward the sky by distance
  const order: { z0: number; z1: number; s: number; i: number }[] = [];
  [-1, 1].forEach((s) => {
    let z = 2.4 + (s > 0 ? 1.2 : 0);
    for (let i = 0; i < 14; i++) {
      const dz = z * 0.55;
      order.push({ z0: z, z1: z + dz, s, i });
      z += dz + z * 0.05;
    }
  });
  order.sort((a, b) => b.z0 - a.z0).forEach(({ z0, z1, s, i }) => {
    const H = 9 + rnd(3, i + s * 20) * 9;
    const fog = fogK(z0);
    const col = mixHex(mixHex('#1E2040', '#2C2850', rnd(4, i + s * 7)), '#101634', fog);
    parts.push(<polygon key={`b${s}${i}`} points={poly([[s * 7.2, 0, z0], [s * 7.2, H, z0], [s * 7.2, H, z1], [s * 7.2, 0, z1]])} fill={col} />);
    // the face of the block that looks at the camera
    parts.push(<polygon key={`f${s}${i}`} points={poly([[s * 7.2, 0, z0], [s * 7.2, H, z0], [s * 30, H, z0], [s * 30, 0, z0]])} fill={mixHex(col, '#000000', 0.25)} />);
    const bays = Math.max(2, Math.round((z1 - z0) / 1.8));
    for (let f = 0; f < Math.floor(H / 3); f++) {
      for (let b = 0; b < bays; b++) {
        const q = rnd(5 + s, i * 40 + f * 7 + b);
        if (q < 0.45) continue;
        const za = z0 + ((z1 - z0) * (b + 0.2)) / bays;
        const zb = z0 + ((z1 - z0) * (b + 0.8)) / bays;
        const y0 = f * 3 + 1;
        const lit = mixHex(q > 0.9 ? '#9FC0FF' : '#FFC27A', '#101634', fog * 0.7);
        parts.push(<polygon key={`w${s}${i}${f}${b}`} points={poly([[s * 7.2, y0, za], [s * 7.2, y0 + 1.5, za], [s * 7.2, y0 + 1.5, zb], [s * 7.2, y0, zb]])} fill={lit} opacity={0.5 + 0.45 * q + 0.05 * Math.sin(t / 20 + i)} />);
      }
    }
  });
  return (
    <g>
      <StarSky t={t} id={`${id}sky`} horizonY={470} n={110} seed={83} />
      <rect x={-400} y={470} width={2720} height={700} fill="#0E1128" />
      {parts}
      {/* every lamp glowing: the cone, the pool on the road, a halo at the lamp head */}
      {[...LAMP_Z].reverse().flatMap((Z, k) => [-1, 1].map((side) => {
        const Zs = Z * (side > 0 ? 1.18 : 1);
        const b = proj(side * 4.5, 0, Zs);
        const s = propScale(Zs);
        const lx = b.x + (side > 0 ? -138 : 138) * s;
        const ly = b.y - 626 * s;
        return (
          <g key={`l${k}${side}`}>
            <StreetLamp x={b.x} y={b.y} s={s} flip={side > 0} on={0.9 + 0.1 * Math.sin(t / 9 + k)} glow={false} />
            <Glow x={lx} y={ly} r={150 * s + 30} kind="warm" o={0.7} />
            <ellipse cx={lx} cy={groundY(Zs)} rx={150 * s + 20} ry={26 * s + 6} fill="#FFC27A" opacity={0.22} style={{ mixBlendMode: 'screen' }} />
          </g>
        );
      }))}
    </g>
  );
};
