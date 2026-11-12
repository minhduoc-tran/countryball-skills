import React from 'react';
import { Hero, Street, ShotProps, LOOKS, basePose, Pose, walkPose, faceAt, kf, clamp, easeOut, camT, Glow, Foreground, Sparkle, Dust } from '../../engine';
import { Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { LookArm } from '../khong-ai-ngheo/chb-cards-and-marks';
import { ped, floorOf } from './chc-pose-utils';
import { GRANDMA, NEIGHBOUR_A, NEIGHBOUR_B, NEIGHBOUR_C, NEIGHBOUR_D, Bowl, ChargeStation, WarmBokeh, hipFor } from './chc-neighbours-props';
import { GrandmaPot, BowlHolder, MechanicStation } from './chc-grandma-pot-scene';

// Chapter C, week one (look "w1"): the warm moment. C1 Pip sees steam down the street; C2 grandma stirs the huge pot;
// C3 she ladles for the whole row; C4 the mechanic builds a phone-charging station from a car battery; C5 the battery
// and the phones lighting up; C6 people queue and let each other go first; C7 a dark street with two warm pools of
// light; C8 hands passing a bowl.

const PIP = LOOKS.pipHood;
/** The insert sleeves take the jacket colour (the rig's limb colour is the dark trousers shade). */
const SLEEVE_G = { ...GRANDMA, limb: GRANDMA.jacket };
const SLEEVE_A = { ...NEIGHBOUR_A, limb: NEIGHBOUR_A.jacket };
const NEIGH = [NEIGHBOUR_A, NEIGHBOUR_B, NEIGHBOUR_C, NEIGHBOUR_D];

/** The pot, its cook and a receding queue of neighbours with bowls (street perspective). `mix` serves queue member 0. */
const PotQueue: React.FC<{ Xp: number; Zp: number; t: number; n?: number; mix?: number; glow?: number }> = ({ Xp, Zp, t, n = 4, mix = 0, glow = 1 }) => {
  const g = ped(Xp, Zp);
  const s = g.scale;
  const fy = floorOf(g);
  const first = ped(Xp + 0.96, Zp);
  const handX = first.x - 76 * first.scale;
  const serve = { x: handX, y: fy - 106 * s };
  const people = Array.from({ length: n }).map((_, i) => {
    const q = ped(Xp + 0.96 + i * 0.9, Zp + (i ? 0.2 + i * 1.15 : 0));
    return { q, i };
  });
  return (
    <g>
      {[...people].reverse().filter((p) => p.i > 0).map(({ q, i }) => (
        <BowlHolder key={i} x={q.x} fy={floorOf(q)} s={q.scale} t={t} look={NEIGH[i % 4]} seed={i} reach={0.9} />
      ))}
      <GrandmaPot x={g.x} fy={fy} s={s} t={t} serve={mix > 0 ? serve : null} mix={mix} glow={glow} />
      <BowlHolder x={first.x} fy={floorOf(first)} s={first.scale} t={t} look={NEIGH[0]} got={mix > 0.7 ? 1 : 0} seed={9} />
    </g>
  );
};

// ---------- C1: Pip walks down the street toward a plume of steam ----------
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const X = kf(t, [[0, 1.6], [len, -0.5]], (v) => v);
  const g = ped(X, 4.4);
  const walk = walkPose(g.x, t * 0.5, floorOf(g), g.scale, { look: -0.5, tilt: -2, ...faceAt(t, [[0, 'worried'], [52, 'neutral'], [70, 'happy']]) }, -1);
  const far = ped(-5.4, 14);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 810]]), kf(t, [[0, 660], [len, 610]]), kf(t, [[0, 1.5], [len, 2.0]]))}>
      <Street t={t + 100} id="c1" />
      <PotQueue Xp={-5.4} Zp={14} t={t} n={3} />
      <Glow x={far.x + 24} y={far.y - 20} r={120} kind="warm" o={0.5} />
      <Steam x={far.x + 22} y={far.y - 30} t={t} n={9} h={300} w={34} o={0.7} seed={2} />
      <Hero look={PIP} pose={walk} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- C2: grandma stirs the huge pot; steam, a push-in on the pot ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const g = ped(-4.6, 4.2);
  return (
    <g transform={camT(kf(t, [[0, 520], [len, 470]]), kf(t, [[0, 700], [len, 668]]), kf(t, [[0, 2.0], [len, 2.5]]))}>
      <Street t={t + 40} id="c2" />
      <GrandmaPot x={g.x} fy={floorOf(g)} s={g.scale} t={t} />
      <Dust t={t} seed={7} x0={g.x - 200} y0={g.y - 300} w={400} h={300} n={14} o={0.5} />
    </g>
  );
};

// ---------- C3: she ladles for the whole row, the queue of bowls going back down the street ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const mix = kf(t, [[2, 0], [14, 1], [24, 1], [36, 0]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 560], [len, 700]]), 690, kf(t, [[0, 1.85], [len, 1.7]]))}>
      <Street t={t + 90} id="c3" />
      <PotQueue Xp={-5.3} Zp={4.8} t={t} n={4} mix={easeOut(mix)} />
    </g>
  );
};

// ---------- C4: the mechanic builds the charging station on a car battery ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const g = ped(-3.0, 4.4);
  const built = kf(t, [[0, 0.05], [len * 0.85, 1]], (v) => v);
  const cheer = easeOut(clamp((t - len * 0.78) / 8));
  return (
    <g transform={camT(kf(t, [[0, 690], [len, 740]]), 640, kf(t, [[0, 2.35], [len, 2.7]]))}>
      <Street t={t + 20} id="c4" />
      <MechanicStation x={g.x} fy={floorOf(g)} s={g.scale} t={t} built={built} cheer={cheer} expr={t > len * 0.78 ? 'happy' : 'neutral'} />
      <Dust t={t} seed={3} x0={g.x} y0={g.y - 300} w={500} h={300} n={12} o={0.4} />
    </g>
  );
};

// ---------- C5: insert: the battery's clamps, then the row of phones lighting up one by one ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const built = kf(t, [[0, 0.3], [len * 0.9, 1]], (v) => v);
  const cx = kf(t, [[0, -40], [len, 110]]);
  return (
    <g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#1B1420" />
      <WarmBokeh t={t} seed={11} />
      <g transform={camT(960 + cx, 745, 3.3)}>
        <g transform="translate(960 880)">
          <ChargeStation x={0} y={0} s={1} t={t + 30} built={built} n={6} sign={false} />
          {[0, 1, 2].map((i) => <Sparkle key={i} x={34 + i * 50} y={-200} t={t - 8 - i * 9} s={0.8} />)}
        </g>
      </g>
      <Foreground blur={10}>
        <ellipse cx={0} cy={1100} rx={600} ry={160} fill="#0A0710" opacity={0.85} />
        <ellipse cx={1920} cy={1100} rx={500} ry={140} fill="#0A0710" opacity={0.85} />
      </Foreground>
    </g>
  );
};

// ---------- C6: people queue at the station and let each other go first ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const st = ped(-3.0, 4.4);
  const s = st.scale;
  const fy = floorOf(st);
  const tableX = st.x + 215 * s;
  const stepA = easeOut(clamp((t - 12) / 14));
  const stepB = easeOut(clamp((t - 26) / 16));
  const ax = tableX + (150 + 140 * stepA) * s;
  const ay = fy + 70 * stepA * s;
  const bx = tableX + (330 - 180 * stepB) * s;
  const mk = (x: number, y: number, sc: number, look: typeof PIP, expr: Pose['expr'], armSide: 'armL' | 'armR', arm: Pose['armL'], extra: Partial<Pose> = {}): Pose => ({
    ...basePose, x, y: hipFor(y, sc), scale: sc, yaw: -0.72, facing: -1, tilt: -2, expr, [armSide]: arm, look: -0.5, ...extra,
  });
  const gesture = easeOut(clamp((t - 12) / 8)) * (1 - clamp((t - 38) / 10));
  const poseA = mk(ax, ay, s * (1 + 0.05 * stepA), NEIGHBOUR_A, t > 10 ? 'happy' : 'neutral', 'armL', { a: 20 + 60 * gesture, b: 4 + 6 * gesture }, { handL: 'open' });
  const poseB = mk(bx, fy, s, NEIGHBOUR_C, t > 30 ? 'happy' : 'neutral', 'armL', { a: 20 + 40 * clamp((t - 34) / 10), b: 30 }, { headTilt: 4 * stepB });
  const poseC = mk(tableX + 520 * s, fy - 10 * s, s * 0.93, NEIGHBOUR_B, 'neutral', 'armL', { a: 16, b: 28 });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 650, kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Street t={t + 20} id="c6" />
      <MechanicStation x={st.x} fy={fy} s={s} t={t} built={1} expr="happy" cheer={0} />
      <Hero look={NEIGHBOUR_B} pose={poseC} rimId="rimR" shadow={0} />
      <Hero look={NEIGHBOUR_C} pose={poseB} rimId="rimR" shadow={0} />
      <Hero look={NEIGHBOUR_A} pose={poseA} rimId="rimR" shadow={0} />
      <Sparkle x={tableX + 110 * s} y={fy - 330 * s} t={t - 44} s={0.9} />
    </g>
  );
};

// ---------- C7: the dark street at night with two warm pools of light: the pot and the station ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const pot = ped(-4.7, 7.2);
  const stn = ped(4.9, 7.0);
  const chat = [ped(-2.7, 7.5), ped(-2.0, 8.4)];
  return (
    <g transform={camT(960, kf(t, [[0, 640], [len, 590]]), kf(t, [[0, 1.55], [len, 1.1]]))}>
      <Street t={t + 160} id="c7" night blackout={0.6} />
      <PotQueue Xp={-4.7} Zp={7.2} t={t} n={3} glow={1.2} />
      <MechanicStation x={stn.x} fy={floorOf(stn)} s={stn.scale} t={t} built={1} expr="happy" rim="rimL" />
      {[0, 1].map((i) => {
        const sc = stn.scale * (1 - i * 0.04);
        const pose: Pose = { ...basePose, x: stn.x + (215 + 300 + i * 90) * stn.scale, y: hipFor(floorOf(stn), sc), scale: sc, yaw: -0.72, facing: -1, tilt: -2, expr: 'neutral', look: -0.5 };
        return <Hero key={i} look={NEIGH[i + 2]} pose={pose} rimId="rimBlue" shadow={0} />;
      })}
      {chat.map((q, i) => (
        <BowlHolder key={i} x={q.x} fy={floorOf(q)} s={q.scale} t={t} look={NEIGH[(i + 1) % 4]} dir={i ? -1 : 1} seed={i + 4} rim="rimBlue" got={1} />
      ))}
      <Glow x={pot.x} y={pot.y - 40} r={260} kind="warm" o={0.45} />
    </g>
  );
};

// ---------- C8: close-up: hands passing a bowl of porridge, a slow push-in ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const mv = easeOut(clamp((t - 6) / 30));
  const bx = 760 + 400 * mv;
  const by = 600 - Math.sin(mv * Math.PI) * 70;
  const leftOut = easeOut(clamp((t - 30) / 22));
  const rightIn = easeOut(clamp((t - 4) / 28));
  const rightPull = easeOut(clamp((t - 38) / 18));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.16]]))}>
      <rect x={-300} y={-300} width={2520} height={1680} fill="#241620" />
      <WarmBokeh t={t} seed={5} />
      <Glow x={960} y={560} r={700} kind="warm" o={0.35} />
      <LookArm look={SLEEVE_G} x={bx - 104 - leftOut * 260} y={by + 78 + leftOut * 120} fx={-120} fy={1150} rot={-135} s={4.2} width={92} />
      <Bowl x={bx} y={by + 92} s={4.2} t={t} full={1} />
      <LookArm look={SLEEVE_A} x={kf(rightIn, [[0, 1500], [1, bx + 104 - rightPull * 70]], (v) => v)} y={by + 70 + rightPull * 60} fx={2100} fy={1150} rot={135} s={4.2} width={92} />
      <Sparkle x={bx + 10} y={by - 120} t={t - 38} s={1.2} />
      <Foreground blur={16}>
        <ellipse cx={120} cy={1090} rx={420} ry={150} fill="#120A10" opacity={0.9} />
        <ellipse cx={1820} cy={1090} rx={380} ry={140} fill="#120A10" opacity={0.9} />
      </Foreground>
    </g>
  );
};

