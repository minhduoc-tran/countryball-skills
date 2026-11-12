import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, rnd, camT, LOOKS, LEG_LEN, Glow, Dust, Rooftop, Supermarket, aisleStand,
  Schematic, SCH, SchLabel, Tag, ShotProps,
} from '../../engine';
import { PersonIcon } from './insert-arm-and-icons';

// Chapter E, "weigh": what pressing the button costs, as quick inserts (the supermarket E19; the
// city and the bike are in shots-che-memory-street.tsx), what the free things can't buy (E22), and a memory of his best friend (E23).

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;

// ---------- E19: "cả siêu thị": the supermarket with the power off, daylight only from the doors; Pip in the aisle with a torch ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const st = aisleStand(0.5, 0.62);
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: st.x, y: st.y, scale: st.scale, yaw: 0.2, look: 0.6, armR: { a: 70, b: 20 }, armL: { a: 10, b: 6 }, sway: 3 } },
    { f: 10, p: { yaw: -0.2, look: -0.7, headTilt: -3 } },
    { f: 22, p: { yaw: 0.25, look: 0.5, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 470], [len, 480]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <Supermarket t={t + 40} id="e19mkt" dark={1} night empty={0.25} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [12, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <Glow x={st.x + 40} y={st.y - 60} r={150} o={0.3} />
    </g>
  );
};

// ---------- E22: schematic: heaps of free things pop on, then a lone person icon: the price tag says it cannot be bought ----------
const ITEMS = Array.from({ length: 24 }).map((_, i) => ({ x: 250 + (i % 6) * 120, y: 330 + Math.floor(i / 6) * 130, at: 4 + rnd(i, 3) * 42, kind: i % 3 }));
const Item: React.FC<{ kind: number; s: number }> = ({ kind, s }) => (
  <g transform={`scale(${s})`} stroke={SCH.line} strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round">
    {kind === 0 ? <g><rect x={-28} y={-22} width={56} height={46} /><path d="M -28 -6 L 28 -6 M 0 -22 L 0 24" /></g> : null}
    {kind === 1 ? <g><path d="M -22 -10 L -16 26 L 16 26 L 22 -10 Z" /><path d="M -22 -10 Q 0 -34 22 -10" /></g> : null}
    {kind === 2 ? <g><circle r={26} /><path d="M -12 -4 L -12 -4 M 12 -4 L 12 -4 M -12 10 Q 0 20 12 10" /></g> : null}
  </g>
);
export const E22: React.FC<ShotProps> = ({ t, len }) => {
  const dim = clamp((t - 56) / 12);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t + 90} id="e22sch" />
      <SchLabel x={570} y={210} t={t - 2} text="MỌI THỨ MIỄN PHÍ" size={46} />
      {ITEMS.map((it, i) => {
        const k = t - it.at;
        if (k < 0) return null;
        const s = k < 5 ? 0.5 + 0.7 * easeOut(k / 5) - 0.2 * clamp((k - 3) / 2) : 1;
        return (
          <g key={i} transform={`translate(${it.x} ${it.y})`} opacity={1 - 0.65 * dim}>
            <Item kind={it.kind} s={s} />
          </g>
        );
      })}
      <path d="M 1010 300 L 1010 860" stroke={SCH.dim} strokeWidth={3} strokeDasharray="10 12" opacity={0.7} />
      <PersonIcon x={1440} y={560} s={4.4} on glow={t > 56} o={0.5 + 0.5 * clamp((t - 50) / 10)} />
      <SchLabel x={1440} y={240} t={t - 60} text="MỘT NGƯỜI" size={46} color={SCH.live} />
      <Tag x={1380} y={850} t={t - 64} text="MUA ĐƯỢC?" w={440} mark="x" markT={14} />
    </g>
  );
};

// ---------- E23: MEMORY, warm: Pip and his best friend Mo laughing on the roof; the camera drifts in to end on Pip's face ----------
export const E23: React.FC<ShotProps> = ({ t, len }) => {
  const bounce = (k: number) => 0.06 * Math.max(0, Math.sin(t * 0.9 + k));
  const pip: Pose = {
    ...basePose, x: 790, y: 842 - LEG_LEN * 1.2, scale: 1.2, yaw: 0.45, facing: 1, tilt: -6, headTilt: kf(t, [[0, -6], [len, 4]]),
    armL: { a: 20, b: 20 }, armR: { a: 36, b: 20 }, squash: bounce(0), ...faceAt(t, [[0, 'happy']]),
  };
  const mo: Pose = {
    ...basePose, x: 1110, y: 842 - LEG_LEN * 1.2, scale: 1.2, yaw: -0.45, facing: -1, tilt: 7, headTilt: 6,
    armL: { a: 32, b: 24 }, armR: { a: 20, b: 20 }, squash: bounce(2), ...faceAt(t, [[0, 'happy']]),
  };
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 830]]), kf(t, [[0, 560], [len, 500]]), kf(t, [[0, 1.5], [len, 2.3]]))}>
      <Rooftop t={t + 120} sunX={1250} sunY={600} cityLit={1.4} />
      <Hero look={MO} pose={mo} rimId="rimL" shadow={0.5} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0.5} />
      <Dust t={t} seed={23} x0={500} y0={250} w={900} h={500} n={22} o={0.5} />
    </g>
  );
};
