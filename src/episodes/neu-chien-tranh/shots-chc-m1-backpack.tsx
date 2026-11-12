import React from 'react';
import { Hero, ShotProps, LOOKS, basePose, Pose, faceAt, kf, clamp, easeOut, camT, Glow, Foreground, Tabletop, Tag, Sparkle, Dust, KITCHEN, KitchenIsland, islandTop, stand } from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { DarkKitchen, Candle } from '../last-one/shots-chc-shared-props-and-cards';
import { armTo } from './chc-pose-utils';
import { PACK, BackpackFront, CatPeek, CatHeld, PowerBankTop, DocsTop, PhotoTop, BookTop, ToyCarTop, BackpackTop } from './chc-backpack-and-cat-props';

// Chapter C, month one, the backpack (look "m1"): the family decides to leave; one backpack each; Pip chooses what
// goes in (top-down: power bank, papers, a family photo) and sis's grey-white cat pops its head out of her pack.

const PIP = LOOKS.pipHood;
const MUM = LOOKS.mom;
const SIS = LOOKS.sis;
const U = { mum: 0.4, pip: 0.55, sis: 0.69 };

/** The family behind the island, as placed in every kitchen shot of this beat. */
const spot = (u: number, small = false) => {
  const p = stand(KITCHEN, u, 0.4, small ? 0.44 : 0.62);
  return p;
};

const FamilyKitchen: React.FC<{ t: number; id: string; pipPose: Partial<Pose>; mumPose: Partial<Pose>; sisPose: Partial<Pose>; children?: React.ReactNode; noCat?: boolean }> = ({ t, id, pipPose, mumPose, sisPose, children, noCat = false }) => {
  const pp = spot(U.pip);
  const mp = spot(U.mum);
  const sp = spot(U.sis, true);
  const cat = islandTop(U.sis - 0.06, 0.45);
  const mk = (p: { x: number; y: number; scale: number }, extra: Partial<Pose>): Pose => ({ ...basePose, x: p.x, y: p.y, scale: p.scale, ...extra });
  return (
    <g>
      <DarkKitchen t={t + 60} id={id} dim={0.5} />
      <Hero look={MUM} pose={mk(mp, mumPose)} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={mk(pp, pipPose)} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={mk(sp, sisPose)} rimId="rimR" shadow={0} />
      <KitchenIsland />
      {noCat ? null : <CatHeld x={cat.x} y={cat.y - 30 * sp.scale} s={sp.scale * 0.95} t={t} flip />}
      {children}
    </g>
  );
};

const candleAt = islandTop(0.47, 0.35);

// ---------- C17: the decision: mum nods, Pip nods, sis holds her cat, a candle on the island ----------
export const C17: React.FC<ShotProps> = ({ t, len }) => {
  const nod = (a: number) => 5 * Math.sin(clamp((t - a) / 14) * Math.PI);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1020]]), 585, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <FamilyKitchen
        t={t}
        id="k17"
        mumPose={{ yaw: 0.45, tilt: 2, headTilt: nod(14), look: 0.6, armL: { a: 14, b: 20 }, armR: { a: 14, b: 20 }, ...faceAt(t, [[0, 'worried'], [16, 'neutral']]) }}
        pipPose={{ yaw: -0.3, tilt: -1, headTilt: -nod(22), look: -0.5, armL: { a: 12, b: 16 }, armR: { a: 12, b: 16 }, ...faceAt(t, [[0, 'worried']]) }}
        sisPose={{ yaw: -0.3, armL: { a: 40, b: 45 }, armR: { a: 40, b: 45 }, ...faceAt(t, [[0, 'worried']]) }}
      >
        <Candle x={candleAt.x} y={candleAt.y} t={t} s={0.55} glow={0.8} />
      </FamilyKitchen>
      <Dust t={t} seed={5} x0={800} y0={300} w={500} h={300} n={14} o={0.4} />
    </g>
  );
};

// ---------- C18: one backpack each: three packs on the island, a "1" over each ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => {
  const pp = spot(U.pip);
  const sc = pp.scale;
  const packs = [
    { u: U.mum, color: PACK.mum, k: 1.0 },
    { u: U.pip, color: PACK.pip, k: 1.0 },
    { u: U.sis, color: PACK.sis, k: 0.8 },
  ];
  const pos = packs.map((p) => ({ ...p, pt: islandTop(p.u - 0.05, 0.6) }));
  const touch = (u: number, side: 'armL' | 'armR', yaw: number, extra: Partial<Pose>): Partial<Pose> => {
    const s0 = spot(u, u === U.sis);
    const pt = islandTop(u - 0.05, 0.6);
    const base: Pose = { ...basePose, x: s0.x, y: s0.y, scale: s0.scale, yaw };
    const arm = armTo(base, side, pt.x + 6 * sc, pt.y - 96 * sc * (u === U.sis ? 0.8 : 1));
    return { yaw, [side]: arm, ...extra };
  };
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1000]]), 600, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <FamilyKitchen
        t={t}
        id="k18"
        mumPose={touch(U.mum, 'armR', 0.45, { look: 0.3, ...faceAt(t, [[0, 'neutral']]) })}
        pipPose={touch(U.pip, 'armL', -0.3, { look: -0.3, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) })}
        sisPose={touch(U.sis, 'armL', -0.3, { ...faceAt(t, [[0, 'neutral']]) })}
        noCat
      >
        {pos.map((p, i) => (
          <BackpackFront key={i} x={p.pt.x} y={p.pt.y} s={sc * 0.75 * p.k} color={p.color} />
        ))}
        {pos.map((p, i) => (
          <g key={i} transform={`translate(${p.pt.x} ${p.pt.y - 200 * sc * p.k}) scale(0.4) translate(${-p.pt.x} ${-(p.pt.y - 200 * sc * p.k)})`}>
            <Tag x={p.pt.x} y={p.pt.y - 200 * sc * p.k} t={t - 28 - i * 5} text="1" w={104} mark="check" markT={6} />
          </g>
        ))}
      </FamilyKitchen>
    </g>
  );
};

// ---------- C19: close-up: Pip has to choose: eyes flicking between things, blurred packs in the foreground ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const pp = spot(U.pip);
  const head = { x: pp.x, y: pp.y - 176 * pp.scale };
  const look = kf(t, [[0, -0.9], [10, 0.9], [20, -0.5], [30, 0.8]], (v) => v);
  return (
    <g transform={camT(head.x + 20, head.y + 20, kf(t, [[0, 3.6], [len, 4.1]]))}>
      <DarkKitchen t={t + 60} id="k19" dim={0.5} />
      <Hero look={PIP} pose={{ ...basePose, x: pp.x, y: pp.y, scale: pp.scale, yaw: -0.25, look, headTilt: 3 * Math.sin(t / 9), ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <Candle x={candleAt.x} y={candleAt.y} t={t} s={0.55} glow={0.8} />
      <Foreground blur={10}>
        <BackpackFront x={head.x - 140} y={head.y + 330} s={pp.scale * 1.3} color={PACK.mum} />
        <BackpackFront x={head.x + 200} y={head.y + 340} s={pp.scale * 1.2} color={PACK.pip} />
      </Foreground>
    </g>
  );
};

// ---------- C20: top-down: Pip's hand puts the power bank, the papers and a photo into his pack; the rest stays ----------
type Item = { id: string; x: number; y: number; t0: number; t1: number; t2: number; t3: number; node: (x: number, y: number, s: number, rot: number) => React.ReactNode };
const BAG = { x: 1130, y: 560 };
const MOUTH = { x: BAG.x, y: BAG.y - 52 };
const ITEMS: Item[] = [
  { id: 'bank', x: 330, y: 340, t0: -8, t1: 7, t2: 21, t3: 31, node: (x, y, s, r) => <PowerBankTop x={x} y={y} s={s} rot={r} /> },
  { id: 'docs', x: 380, y: 760, t0: 24, t1: 38, t2: 52, t3: 62, node: (x, y, s, r) => <DocsTop x={x} y={y} s={s} rot={r} /> },
  { id: 'photo', x: 700, y: 820, t0: 62, t1: 74, t2: 90, t3: 100, node: (x, y, s, r) => <PhotoTop x={x} y={y} s={s} rot={r} /> },
];
const HOME = { x: -120, y: 1240 };

export const C20: React.FC<ShotProps> = ({ t, len }) => {
  // where the hand is, and which item it carries
  let hand = HOME;
  let carry: { item: Item; k: number } | null = null;
  const dropped: Record<string, number> = {};
  for (const it of ITEMS) {
    if (t >= it.t0 && t <= it.t3) {
      const toItem = easeOut(clamp((t - it.t0) / (it.t1 - it.t0)));
      const toBag = easeOut(clamp((t - it.t1 - 2) / (it.t2 - it.t1 - 2)));
      const back = easeOut(clamp((t - it.t2 - 2) / (it.t3 - it.t2 - 2)));
      const p1 = { x: HOME.x + (it.x - HOME.x) * toItem, y: HOME.y + (it.y - HOME.y) * toItem };
      const p2 = { x: it.x + (MOUTH.x - it.x) * toBag, y: it.y + (MOUTH.y - it.y) * toBag - Math.sin(toBag * Math.PI) * 90 };
      hand = t < it.t1 + 2 ? p1 : t < it.t2 ? p2 : { x: MOUTH.x + (HOME.x - MOUTH.x) * back, y: MOUTH.y + (HOME.y - MOUTH.y) * back };
      if (t >= it.t1 + 2 && t < it.t2) carry = { item: it, k: toBag };
    }
    if (t >= it.t2) dropped[it.id] = t - it.t2;
  }
  const dx = hand.x - HOME.x;
  const dy = hand.y - HOME.y;
  const rot = (Math.atan2(-dx, dy) * 180) / Math.PI;
  const fillK = Math.min(1, Object.keys(dropped).length / 3);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <Tabletop edge={1400} />
      <Glow x={420} y={260} r={900} kind="warm" o={0.28} />
      <BookTop x={1590} y={330} s={0.95} rot={-14} />
      <ToyCarTop x={1640} y={760} s={0.9} rot={28} />
      <BackpackTop x={BAG.x} y={BAG.y} s={1} fill={fillK * 0.6} />
      {ITEMS.map((it) => {
        const d = dropped[it.id];
        if (d !== undefined) return d < 7 ? <g key={it.id} opacity={1 - d / 7}>{it.node(MOUTH.x, MOUTH.y + d * 2, 0.7 - d * 0.06, 0)}</g> : null;
        if (carry && carry.item.id === it.id) {
          const k = carry.k;
          return null; // drawn over the mitten below, so the held thing stays readable
        }
        if (t >= it.t1 + 2 && t >= it.t2) return null;
        return <g key={it.id}>{it.node(it.x, it.y, 1, it.id === 'bank' ? -8 : it.id === 'docs' ? 6 : -4)}</g>;
      })}
      <InsertArm x={hand.x} y={hand.y} fx={HOME.x} fy={HOME.y} rot={rot} s={4.1} width={104} />
      {carry ? (() => {
        const L = Math.hypot(dx, dy) || 1;
        const k = carry.k;
        return <g>{carry.item.node(hand.x + (dx / L) * 40, hand.y + (dy / L) * 40, 1 + 0.12 * Math.sin(k * Math.PI) - 0.2 * k, k * 10)}</g>;
      })() : null}
      {ITEMS.map((it) => (dropped[it.id] !== undefined && dropped[it.id] >= 0 && dropped[it.id] < 8 ? <Sparkle key={it.id} x={MOUTH.x + 40} y={MOUTH.y - 20} t={dropped[it.id]} s={0.9} /> : null))}
    </g>
  );
};

// ---------- C21: sis's pink pack on the island: the cat pops its head out, sis smiling behind ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const sp = spot(U.sis, true);
  const pt = islandTop(U.sis - 0.09, 0.5);
  const s = sp.scale * 1.3;
  const pose: Pose = { ...basePose, x: sp.x, y: sp.y, scale: sp.scale, yaw: -0.2, look: -0.4, tilt: -1, ...faceAt(t, [[0, 'neutral'], [10, 'happy']]) };
  const rise = (t - 4) / 12;
  return (
    <g transform={camT(kf(t, [[0, pt.x + 20], [len, pt.x - 6]]), kf(t, [[0, pt.y - 140], [len, pt.y - 170]]), kf(t, [[0, 2.5], [len, 2.9]]))}>
      <DarkKitchen t={t + 60} id="k21" dim={0.5} />
      <Hero look={SIS} pose={pose} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <BackpackFront x={pt.x} y={pt.y} s={s} color={PACK.sis} layer="back" open={1} />
      <CatPeek x={pt.x} y={pt.y - 150 * s - 6 * s} s={s * 1.05} rise={rise} t={t} />
      <BackpackFront x={pt.x} y={pt.y} s={s} color={PACK.sis} layer="front" />
      <Candle x={candleAt.x} y={candleAt.y} t={t} s={0.55} glow={0.8} />
    </g>
  );
};

