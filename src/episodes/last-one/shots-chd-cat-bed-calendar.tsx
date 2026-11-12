import React from 'react';
import {
  Hero, Pose, basePose, poseAt, kf, clamp, easeOut, camT, LOOKS, HEAD, joints, toWorld,
  Bedroom, BedDuvet, BEDROOM, bedSit, bedTop, WallCalendar, calendarDay, Cat, WallTexture, LightVeil, Glow, Dust,
  DuskSky, Sun, Skyline, Haze, Foreground, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { Candle } from './chd-local-props';
import { CatFace, Pigeon, blinkAt } from './chd-cat-and-bird-art';

// Chapter D, the cat and the calendar. D1: day 5 crossed off. D3: pigeons on the cables ("animals are still here").
// D4: Pip in bed with the cat curled up beside him, by candlelight. D5: he talks to it; it only blinks.
// D6: day 10 crossed off. (D2, the cat under the motorbike, is in shots-chd-cat-street.tsx.)

const PIP = LOOKS.pipHood;

/** The wall behind a calendar insert: night blue, faint texture, a candle's pool of light. */
const InsertWall: React.FC<{ id: string; lights: [number, number, number][]; veil?: number }> = ({ id, lights, veil = 0.55 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#2E3352" />
    <WallTexture rect={[-400, -400, 2720, 1880]} />
    <LightVeil id={id} lights={lights} o={veil} />
  </g>
);

/** The marker: from the tip on the page to the fist, dark red with a lit edge. */
const Marker: React.FC<{ tip: { x: number; y: number }; hand: { x: number; y: number } }> = ({ tip, hand }) => (
  <g strokeLinecap="round">
    <path d={`M ${tip.x} ${tip.y} L ${hand.x} ${hand.y}`} stroke="#20141A" strokeWidth={34} />
    <path d={`M ${tip.x} ${tip.y} L ${hand.x} ${hand.y}`} stroke="#B63030" strokeWidth={26} />
    <path d={`M ${tip.x - 5} ${tip.y - 3} L ${hand.x - 5} ${hand.y - 3}`} stroke="#FFB46A" strokeWidth={4} opacity={0.6} />
    <circle cx={tip.x} cy={tip.y} r={8} fill="#7A1A1A" />
  </g>
);

/** Crossing a day off: the hand arrives, draws the two strokes of the cross (lift between), and withdraws. */
const crossing = (t: number, start: number, r: number, rest: { x: number; y: number }) => {
  const s = start;
  const tipX = kf(t, [[s, rest.x], [s + 8, -r], [s + 17, r], [s + 19, r], [s + 26, -r], [s + 34, rest.x]]);
  const tipY = kf(t, [[s, rest.y], [s + 8, -r], [s + 17, r], [s + 19, -r], [s + 26, r], [s + 34, rest.y]]);
  const drawing = (clamp((t - (s + 8)) / 9) + clamp((t - (s + 19)) / 7)) / 2;
  return { tipX, tipY, drawing };
};

// ---------- D1: insert, the bedroom calendar: day 5 gets its cross; a candle burns blurred in the corner ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const W = 640;
  const cx = 880;
  const cy = 90;
  const day = calendarDay(cx, cy, W, 5);
  const c = crossing(t, -2, day.r, { x: 420, y: 560 });
  const tip = { x: day.x + c.tipX, y: day.y + c.tipY };
  const hand = { x: tip.x + 66, y: tip.y + 150 };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <InsertWall id="d1veil" lights={[[cx, 520, 760], [200, 820, 520]]} />
      <WallCalendar x={cx} y={cy} w={W} crossed={4} drawing={c.drawing} />
      <Glow x={200} y={800} r={620} o={0.5} />
      <Marker tip={tip} hand={hand} />
      <InsertArm x={hand.x} y={hand.y} fx={hand.x + 430} fy={hand.y + 640} rot={-30} s={4.8} width={112} fist />
      <Dust t={t + 20} seed={4} x0={300} y0={200} w={1200} h={700} n={26} o={0.5} />
      <Foreground blur={10}>
        <Candle x={170} y={1040} t={t} s={3.2} h={64} seed={1} />
      </Foreground>
    </g>
  );
};

// ---------- D3: low angle up at the cables at dusk: pigeons on the wires; one takes off ----------
const CABLES: [number, number, number][] = [[160, 200, 120], [330, 360, 150], [500, 480, 110]];
const cableY = (k: number, x: number, bump: number) => {
  const [ya, yb, sag] = CABLES[k];
  const u = (x + 100) / 2120;
  return ya + (yb - ya) * u + sag * 4 * u * (1 - u) + bump;
};
const BIRDS = [
  { k: 0, x: 300, flip: false }, { k: 0, x: 430, flip: true }, { k: 1, x: 760, flip: false },
  { k: 1, x: 1560, flip: true }, { k: 2, x: 1180, flip: false }, { k: 2, x: 1290, flip: true }, { k: 2, x: 480, flip: false },
];
const LEAVER = 4;
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const tt = Math.max(0, t - 9);
  const bx = BIRDS[LEAVER].x;
  const bump = (k: number, x: number) => (k === BIRDS[LEAVER].k && t > 9 ? Math.sin(tt * 0.8) * Math.exp(-tt / 9) * 9 * Math.exp(-Math.abs(x - bx) / 260) : 0);
  const cable = (k: number) => {
    let d = '';
    for (let x = -120; x <= 2040; x += 60) d += `${d ? ' L' : 'M'} ${x} ${cableY(k, x, bump(k, x))}`;
    return d;
  };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 990]]), kf(t, [[0, 480], [len, 440]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <DuskSky id="d3sky" horizonY={830} />
      <Sun x={1300} y={800} r={150} t={t + 40} />
      <Skyline y={930} seed={11} color="#3A2650" h={250} />
      <Skyline y={990} seed={6} color="#241838" h={170} />
      <Haze y={800} h={260} o={0.4} />
      {CABLES.map((_, k) => (
        <g key={k}>
          <path d={cable(k)} stroke="#150F1C" strokeWidth={6} fill="none" />
          <path d={cable(k)} stroke="#FFB46A" strokeWidth={1.8} fill="none" opacity={0.45} transform="translate(0 -3)" />
        </g>
      ))}
      {BIRDS.map((b, i) => {
        const leaving = i === LEAVER && t > 9;
        const base = { x: b.x, y: cableY(b.k, b.x, bump(b.k, b.x)) };
        const x = leaving ? b.x + tt * 11 + tt * tt * 0.5 : b.x;
        const y = leaving ? base.y - tt * 8 - tt * tt * 0.55 : base.y;
        return <Pigeon key={i} x={x} y={y} t={t} s={1.15 + b.k * 0.08} flip={b.flip} fly={leaving ? 1 : 0} seed={i * 2.3} />;
      })}
      <Glow x={1300} y={800} r={560} o={0.35} />
      <Foreground blur={6}>
        <rect x={150} y={-200} width={34} height={1500} fill="#0E0A14" />
        <rect x={110} y={120} width={116} height={14} fill="#0E0A14" />
      </Foreground>
    </g>
  );
};

// ---------- D4: medium, Pip in bed by candlelight, the cat curled on the duvet beside him; he strokes it ----------
const BED_S = bedSit(0.2);
const CAT_AT = bedTop(0.345, 0.2);
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const stroke = Math.sin(t / 6) * 7;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: BED_S.x, y: BED_S.y, scale: BED_S.scale, yaw: 0.45, look: 0.4, armL: { a: 12, b: -6 }, armR: { a: 52, b: 36 }, legL: { a: 80, b: 4 }, legR: { a: 80, b: 4 }, handR: 'open' } },
    { f: 22, p: { look: 0.9, headTilt: 3 } },
  ]);
  pose.armR = { a: 56 + stroke, b: 34 - stroke * 0.5 };
  const face = t < 24 ? 'neutral' : 'happy';
  const cs = BEDROOM.s(0.2) * 0.95;
  const candle = bedTop(0.47, 0.07);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 830]]), 580, kf(t, [[0, 1.55], [len, 1.68]]))}>
      <Bedroom t={t + 60} id="bd4" lamp={0} duvet={false} crossed={5} clock="--:--" />
      <Hero look={PIP} pose={{ ...pose, expr: face, blink: t % 70 > 66 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      <g transform={`translate(${CAT_AT.x} ${CAT_AT.y + 4}) scale(${cs})`}>
        <Cat x={0} y={0} mood="sleep" f={t} />
      </g>
      <Candle x={candle.x} y={bedTop(0.47, 0.07).y - 8} t={t} s={1.4} h={34} seed={2} />
      <Glow x={candle.x} y={candle.y - 70} r={360} o={0.4} />
    </g>
  );
};

// ---------- D5: close-up two-shot: Pip's lips move, he talks and talks; the cat only blinks (twice, slowly) ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.3 * (1 + 0.05 * clamp(t / len));
  const head = { x: 640, y: 600 };
  const talking = t < 26;
  const flap = Math.floor(t / 3) % 2 === 0;
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.45, look: 0.8,
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    headTilt: talking ? Math.sin(t / 4) * 3 : kf(t, [[26, 0], [34, -7]]),
    expr: talking ? (flap ? 'worried' : 'neutral') : 'oops', blink: 0,
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-460 -400) scale(1.8)">
          <Bedroom t={t + 300} id="bd5" lamp={0} crossed={5} clock="--:--" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.35} />
      <Glow x={960} y={820} r={760} o={0.32} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <CatFace x={1380} y={690 - 6 * clamp(t / len)} r={200} blink={blinkAt(t, [12, 30])} look={-0.3} />
      <Candle x={1700} y={1040} t={t + 11} s={3} h={60} seed={5} />
    </g>
  );
};

// ---------- D6: insert, the calendar again, a little crooked: day 10 gets its cross ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const W = 560;
  const cx = 1040;
  const cy = 130;
  const day = calendarDay(cx, cy, W, 10);
  const c = crossing(t, -14, day.r, { x: -560, y: 380 });
  const tip = { x: day.x + c.tipX, y: day.y + c.tipY };
  const hand = { x: tip.x - 62, y: tip.y + 150 };
  return (
    <g transform={`translate(960 540) rotate(${-3 + t * 0.06}) scale(${kf(t, [[0, 1.02], [len, 1.1]])}) translate(-960 -540)`}>
      <InsertWall id="d6veil" lights={[[cx, 500, 700], [1700, 760, 520]]} />
      <WallCalendar x={cx} y={cy} w={W} crossed={9} drawing={c.drawing} />
      <Glow x={1700} y={760} r={600} o={0.45} />
      <Marker tip={tip} hand={hand} />
      <InsertArm x={hand.x} y={hand.y} fx={hand.x - 420} fy={hand.y + 640} rot={30} s={4.8} width={112} fist />
      <Dust t={t + 50} seed={9} x0={400} y0={200} w={1200} h={700} n={24} o={0.5} />
      <Foreground blur={10}>
        <Candle x={1760} y={1050} t={t + 30} s={3.2} h={64} seed={3} />
      </Foreground>
    </g>
  );
};
