import React from 'react';
import { kf, clamp, camT, Street, Glow, Dust, Moon, ShotProps } from '../../engine';
import { IconBackdrop, DustSweep, LawBook, SignPole } from './cha-law-icons-props';

// Chapter A cold open, the reveal: "since last night, there is no law": a law book crumbles into glowing dust in the
// moonlight (A8), then the street's rule signs fade away in the night (A9).

// ---------- A8: insert, night: the law book on a desk in moonlight crumbles left to right into dust ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 5) / (len - 9));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <IconBackdrop t={t} night id="sa8" />
      <Moon x={1500} y={190} r={80} bloom={1} />
      <Glow x={1500} y={190} r={700} kind="cool" o={0.5} />
      <path d="M 1500 190 L 1180 1000 L 560 1000 Z" fill="#9FC0FF" opacity={0.08} />
      <rect x={-200} y={900} width={2320} height={300} fill="#1A1E3A" />
      <rect x={-200} y={900} width={2320} height={10} fill="#4A5A9A" opacity={0.7} />
      <DustSweep id="sa8d" p={p} box={{ x0: 700, x1: 1220, y0: 480, y1: 900 }} color="#CFE0FF" n={190} rise={380}>
        <LawBook x={960} y={900} s={1.0} />
      </DustSweep>
      <Dust t={t} seed={33} x0={600} y0={300} w={800} h={600} n={30} o={0.5} />
    </g>
  );
};

// ---------- A9: wide, the moonlit street: the no-parking and speed signs on their poles fade into dust ----------
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const p1 = clamp((t - 8) / 26);
  const p2 = clamp((t - 18) / 26);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Street t={t + 80} id="sa9" night />
      <DustSweep id="sa9a" p={p1} box={{ x0: 470, x1: 650, y0: 330, y1: 720 }} color="#CFE0FF" n={50} rise={240}>
        <SignPole x={560} y={880} kind="noPark" h={520} r={82} />
      </DustSweep>
      <DustSweep id="sa9b" p={p2} box={{ x0: 1290, x1: 1470, y0: 330, y1: 720 }} color="#CFE0FF" n={50} rise={240}>
        <SignPole x={1380} y={880} kind="speed" h={520} r={82} />
      </DustSweep>
    </g>
  );
};

