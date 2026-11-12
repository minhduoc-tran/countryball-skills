import React from 'react';
import { clamp } from './anim';
import { Pose, basePose, joints } from './rig';
import { mixHex } from './street-geom';
import { Glow } from './light';

// Street props, drawn side-on in "street units": 100 px per metre at s = 1 (so a 1.8 m scooter is 180 px long, and a
// character at Hero scale 0.42 stands next to it at 1.6 m). All of them take (x, y) = where the wheels/pole meet the
// ground, `s` scale and `facing` 1 (front to the right) or -1. In <Street> they are placed with propScale(Z) from
// street-geom. Flat fills, a darker side away from the light, a warm rim line on the lit edge, a contact shadow.
// Bigger props (Bus, MarketStall) live in street-bus-market.tsx and are re-exported at the bottom.

const INK = '#14121A';
const RIM = '#FFB46A';

// ---------- wheels ----------
const Wheel: React.FC<{ cx: number; cy: number; r: number; spin: number; spokes?: number; rimC?: string }> = ({ cx, cy, r, spin, spokes = 0, rimC = '#8C8A98' }) => (
  <g transform={`translate(${cx} ${cy})`}>
    {spokes ? <circle r={r - 3} fill="none" stroke={INK} strokeWidth={7} /> : <circle r={r} fill={INK} />}
    <circle r={spokes ? r - 7 : r * 0.62} fill={spokes ? 'none' : rimC} stroke={spokes ? rimC : 'none'} strokeWidth={2.4} />
    {spokes ? (
      <g stroke="#6E6C7C" strokeWidth={1.3} transform={`rotate(${spin})`}>
        {Array.from({ length: spokes }).map((_, i) => <path key={i} d={`M 0 0 L 0 ${-(r - 6)}`} transform={`rotate(${(i * 360) / spokes})`} />)}
      </g>
    ) : (
      <g transform={`rotate(${spin})`}>
        <circle r={r * 0.4} fill="#2A2833" />
        {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={0} cy={-r * 0.25} r={2.2} fill="#8C8A98" transform={`rotate(${a})`} />)}
      </g>
    )}
    <circle r={4.5} fill="#B8B6C4" />
    <path d={`M ${-r * 0.7} ${-r * 0.7} A ${r} ${r} 0 0 1 ${r * 0.7} ${-r * 0.7}`} stroke={RIM} strokeWidth={2} fill="none" opacity={0.45} />
  </g>
);

// ---------- the scooter ----------
/**
 * A side-view scooter (generic, no brand marks). x, y: on the ground between the wheels; s: scale (1 = 1.8 m long);
 * facing 1 = front to the right. `keys` shows a key in the ignition with a red tag that swings with t; `lean` tips it
 * (degrees, about the rear wheel) for an abandoned look; `lamp` (0..1) lights the head and tail lamps; `helmet` hangs
 * a helmet on the handlebar; `spin` turns the wheels (degrees).
 */
export const Motorbike: React.FC<{ x: number; y: number; s?: number; facing?: 1 | -1; color?: string; keys?: boolean; t?: number; lean?: number; lamp?: number; helmet?: boolean; spin?: number; shadow?: number }> = ({
  x, y, s = 1, facing = 1, color = '#B8483E', keys = false, t = 0, lean = 0, lamp = 0, helmet = false, spin = 0, shadow = 1,
}) => {
  const shade = mixHex(color, '#10101A', 0.4);
  const lite = mixHex(color, '#FFFFFF', 0.28);
  const sway = Math.sin(t / 9) * 7 + Math.sin(t / 4.3) * 2.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx={0} cy={2} rx={108} ry={9} fill="#000" opacity={0.42 * shadow} />
      <g transform={`rotate(${lean} -60 0)`}>
        <Wheel cx={-60} cy={-27} r={27} spin={spin} />
        <Wheel cx={60} cy={-27} r={27} spin={spin} />
        {/* exhaust and kickstand */}
        <path d="M -66 -20 L -18 -16" stroke="#6E6C7C" strokeWidth={9} strokeLinecap="round" />
        <path d="M -66 -24 L -18 -20" stroke="#B8B6C4" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
        <path d="M -22 -34 L -12 0" stroke="#2A2833" strokeWidth={4} strokeLinecap="round" />
        {/* rear cowl, the seat on it, a small rack */}
        <path d="M -96 -56 Q -98 -82 -78 -86 L -8 -86 Q 3 -72 1 -56 Q -1 -44 -12 -44 L -26 -45 A 37 37 0 0 0 -94 -45 Q -97 -48 -96 -56 Z" fill={color} />
        <path d="M -8 -86 Q 3 -72 1 -56 Q -1 -44 -12 -44 L -26 -45 Q -4 -60 -8 -86 Z" fill={shade} opacity={0.55} />
        <path d="M -80 -92 Q -40 -99 0 -93 L 0 -85 L -82 -85 Z" fill="#1A1820" />
        <path d="M -78 -97 Q -40 -104 -2 -98" stroke={RIM} strokeWidth={2.5} fill="none" opacity={0.55} />
        <path d="M -100 -66 L -84 -66 M -98 -60 L -84 -60" stroke="#2A2833" strokeWidth={4} strokeLinecap="round" />
        <rect x={-100} y={-76} width={8} height={14} rx={3} fill={lamp > 0 ? '#FF4A3A' : '#8A2A2A'} />
        {lamp > 0 ? <Glow x={-100} y={-70} r={46} kind="red" o={0.7 * lamp} /> : null}
        {/* floorboard and front leg shield */}
        <path d="M 2 -38 L 50 -34 L 52 -26 L 2 -26 Z" fill={shade} />
        <path d="M 46 -32 Q 52 -64 60 -98 L 76 -100 Q 72 -62 68 -34 Z" fill={color} />
        <path d="M 60 -98 L 76 -100" stroke={RIM} strokeWidth={2.5} opacity={0.55} />
        <path d="M 70 -96 L 62 -27" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M 70 -96 L 62 -27" stroke="#8C8A98" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        <path d="M 26 -27 A 34 34 0 0 1 94 -27" stroke={color} strokeWidth={6} fill="none" />
        <path d="M -94 -27 A 34 34 0 0 1 -26 -27" stroke={color} strokeWidth={6} fill="none" />
        {/* handlebar, mirror, headlamp */}
        <path d="M 70 -100 L 66 -114" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M 52 -116 L 84 -120" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M 62 -116 L 56 -142" stroke="#6E6C7C" strokeWidth={2.5} />
        <ellipse cx={54} cy={-145} rx={9} ry={5.5} fill={INK} />
        <ellipse cx={51} cy={-146} rx={3} ry={1.6} fill="#9FC0FF" opacity={0.7} />
        <ellipse cx={78} cy={-106} rx={13} ry={10} fill={color} />
        <ellipse cx={86} cy={-105} rx={6} ry={7.5} fill={lamp > 0 ? '#FFF1C0' : '#CFC6A8'} />
        {lamp > 0 ? <Glow x={92} y={-105} r={80} o={0.8 * lamp} /> : null}
        <path d="M 66 -118 L 88 -122" stroke={RIM} strokeWidth={2} opacity={0.5} />
        {helmet ? (
          <g transform="translate(62 -128)">
            <path d="M -15 0 A 15 15 0 0 1 15 0 L 15 4 L -15 4 Z" fill="#E9C46A" stroke={INK} strokeWidth={2.5} />
            <path d="M -10 -6 Q 0 -13 10 -6" stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.5} />
          </g>
        ) : null}
        {/* the ignition, and the key with its red tag (the story's insert) */}
        <circle cx={62} cy={-92} r={8} fill={INK} stroke="#6A6878" strokeWidth={2} />
        {keys ? (
          <g>
            <rect x={60} y={-96} width={22} height={5} rx={2} fill="#D8D8E2" />
            <circle cx={86} cy={-93} r={9} fill="#E8C050" stroke={INK} strokeWidth={2} />
            <circle cx={86} cy={-93} r={4} fill={INK} opacity={0.55} />
            <path d="M 83 -99 Q 86 -102 90 -100" stroke="#FFF4C0" strokeWidth={2} fill="none" />
            <g transform={`translate(86 -84) rotate(${sway})`}>
              <circle cx={0} cy={0} r={4.5} fill="none" stroke="#C8C8D4" strokeWidth={2} />
              <rect x={-9} y={3} width={18} height={30} rx={5} fill="#D8483C" stroke={INK} strokeWidth={2} />
              <rect x={-9} y={17} width={18} height={6} fill="#FFFFFF" opacity={0.85} />
              <circle cx={0} cy={9} r={2.6} fill={INK} opacity={0.6} />
            </g>
          </g>
        ) : null}
      </g>
    </g>
  );
};

// ---------- street lamp ----------
/**
 * A tall street lamp on a bent arm (6.4 m). `on` 0..1 is its brightness (flicker it with t, kill it at a blackout);
 * `flip` swings the arm to the left. Draws its own cone, glow and pool of light on the road unless glow={false}
 * (<Street> adds the glow itself, above its dark veil).
 */
export const StreetLamp: React.FC<{ x: number; y: number; s?: number; flip?: boolean; on?: number; glow?: boolean; shadow?: number }> = ({ x, y, s = 1, flip = false, on = 1, glow = true, shadow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={4} cy={2} rx={22} ry={5} fill="#000" opacity={0.4 * shadow} />
    {on > 0.02 && glow ? (
      <g>
        <path d="M 122 -626 L 164 -626 L 250 0 L 20 0 Z" fill="url(#g3cone)" opacity={0.7 * on} style={{ mixBlendMode: 'screen' }} />
        <ellipse cx={140} cy={-4} rx={130} ry={16} fill="url(#g3warm)" opacity={0.5 * on} style={{ mixBlendMode: 'screen' }} />
      </g>
    ) : null}
    <rect x={-11} y={-16} width={22} height={16} fill="#3A3646" />
    <path d="M -7 -14 L -4 -604 L 4 -604 L 7 -14 Z" fill="#2E2B38" />
    <path d="M 4 -14 L 7 -14 L 4 -604 Z" fill={RIM} opacity={0.22} />
    <path d="M 0 -600 Q 0 -648 60 -652 L 112 -646" stroke="#2E2B38" strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M 100 -650 L 170 -642 Q 182 -636 168 -630 L 106 -630 Z" fill="#3E3A4C" stroke={INK} strokeWidth={2} />
    <path d="M 104 -648 L 168 -641" stroke={RIM} strokeWidth={2} opacity={0.6} />
    <ellipse cx={138} cy={-629} rx={28} ry={4} fill={on > 0.02 ? mixHex('#4A4660', '#FFE7B0', clamp(on)) : '#4A4660'} />
    {on > 0.02 && glow ? <Glow x={138} y={-626} r={170} o={0.85 * on} /> : null}
  </g>
);

// ---------- traffic light ----------
export type LightState = 'red' | 'yellow' | 'green';
/**
 * A traffic light on a mast arm over the road: pole at (x, y), arm out to the right (`flip` for the left), a signal
 * head with visors at the end and a countdown box above it (`count` shows the seconds left in the lit colour).
 */
export const TrafficLight: React.FC<{ x: number; y: number; s?: number; state: LightState; flip?: boolean; count?: number; glow?: boolean; on?: number }> = ({ x, y, s = 1, state, flip = false, count, glow = true, on = 1 }) => {
  const lamps: [LightState, string, number][] = [['red', '#FF4538', -490], ['yellow', '#FFC83A', -458], ['green', '#3DE08A', -426]];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={2} rx={20} ry={5} fill="#000" opacity={0.4} />
      <path d="M -6 0 L -4 -480 L 4 -480 L 6 0 Z" fill="#8E8CA0" />
      <path d="M 3 0 L 6 0 L 4 -480 Z" fill={RIM} opacity={0.3} />
      <rect x={-9} y={-170} width={18} height={44} rx={3} fill="#3E3C4C" />
      <path d="M 0 -476 Q 0 -516 40 -518 L 300 -518" stroke="#8E8CA0" strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* the signal head hangs at the arm's end, facing the camera */}
      <g transform="translate(300 0)">
        <rect x={-23} y={-518} width={46} height={118} rx={8} fill={INK} stroke="#E8E2D0" strokeWidth={2} />
        {lamps.map(([name, c, ly]) => {
          const lit = (name === state ? 1 : 0) * on;
          return (
            <g key={name}>
              <circle cx={0} cy={ly} r={14} fill={mixHex(c, INK, 0.82)} />
              <circle cx={0} cy={ly} r={14} fill={c} opacity={lit} />
              <path d={`M -17 ${ly - 6} Q 0 ${ly - 26} 17 ${ly - 6}`} stroke="#3E3C4C" strokeWidth={4} fill="none" />
              {lit > 0.05 && glow ? <Glow x={0} y={ly} r={74} kind={name === 'red' ? 'red' : 'warm'} o={0.85 * lit} /> : null}
            </g>
          );
        })}
        {count !== undefined ? (
          <g>
            <rect x={-22} y={-552} width={44} height={28} rx={4} fill={INK} stroke="#E8E2D0" strokeWidth={1.5} />
            <text x={0} y={-531} textAnchor="middle" fontFamily="'Space Mono', monospace" fontWeight={700} fontSize={22} fill={state === 'green' ? '#3DE08A' : '#FF4538'} transform={flip ? 'scale(-1 1)' : undefined}>{String(Math.max(0, Math.round(count))).padStart(2, '0')}</text>
          </g>
        ) : null}
      </g>
    </g>
  );
};

// ---------- bicycle ----------
const CRANK = 30; // crank length
const BB = { x: 0, y: -64 }; // bottom bracket
const HIP_ON_BIKE = { x: -40, y: -162 }; // where the rider's hips sit (Hero scale 1 = Bicycle s 1)
const GRIP = { x: 70, y: -176 };
/** The crank angle (degrees) at clock t: about 70 rpm at 30 fps. */
export const bikeCrank = (t: number) => t * 14;
const pedalAt = (phi: number) => ({ fx: CRANK * Math.cos((phi * Math.PI) / 180), y: BB.y + CRANK * Math.sin((phi * Math.PI) / 180) });

/**
 * A side-view bicycle sized for the Hero rig: s is the Hero's `scale` (the same number), (x, y) the ground point
 * midway between the wheels. `t` turns the cranks and the wheels (bikeCrank), `spin` adds to the wheels' angle.
 */
export const Bicycle: React.FC<{ x: number; y: number; s?: number; facing?: 1 | -1; t?: number; color?: string; shadow?: number }> = ({ x, y, s = 1, facing = 1, t = 0, color = '#C75B48', shadow = 1 }) => {
  const phi = bikeCrank(t);
  const tube = (a: [number, number], b: [number, number]) => (
    <g>
      <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke={color} strokeWidth={5.5} strokeLinecap="round" />
    </g>
  );
  const p1 = pedalAt(phi);
  const p2 = pedalAt(phi + 180);
  const pedal = (p: { fx: number; y: number }, far: boolean) => (
    <g opacity={far ? 0.75 : 1}>
      <path d={`M ${BB.x} ${BB.y} L ${p.fx} ${p.y}`} stroke="#6E6C7C" strokeWidth={5} strokeLinecap="round" />
      <rect x={p.fx - 12} y={p.y - 3} width={26} height={6} rx={2} fill={INK} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx={0} cy={2} rx={150} ry={8} fill="#000" opacity={0.4 * shadow} />
      <Wheel cx={-110} cy={-70} r={70} spin={phi * 0.9} spokes={14} />
      <Wheel cx={110} cy={-70} r={70} spin={phi * 0.9} spokes={14} />
      {pedal(p2, true)}
      <path d={`M ${BB.x} ${BB.y} L -110 -70`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      {tube([0, -64], [-110, -70])}
      {tube([-34, -140], [-110, -70])}
      {tube([0, -64], [-36, -146])}
      {tube([-34, -140], [84, -146])}
      {tube([0, -64], [80, -124])}
      {tube([80, -124], [86, -158])}
      {tube([84, -152], [110, -70])}
      <path d="M -36 -146 L -40 -158" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M -66 -160 Q -40 -172 -14 -163 L -17 -155 Q -40 -160 -64 -153 Z" fill="#2A2833" stroke={INK} strokeWidth={2} />
      <path d="M 86 -158 L 90 -178 Q 80 -186 66 -177" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={GRIP.x - 2} cy={GRIP.y - 1} rx={7} ry={4.5} fill="#2A2833" />
      <circle cx={98} cy={-168} r={6} fill="#FFE7B0" stroke={INK} strokeWidth={2} />
      <circle cx={BB.x} cy={BB.y} r={17} fill="none" stroke="#8C8A98" strokeWidth={3} />
      <path d="M 0 -80 L -110 -77 M 0 -48 L -110 -63" stroke="#4A4858" strokeWidth={2.2} />
      {pedal(p1, false)}
      <path d="M -62 -163 Q -40 -174 -16 -166" stroke={RIM} strokeWidth={2} fill="none" opacity={0.5} />
      <path d="M -34 -140 L 84 -146" stroke={RIM} strokeWidth={1.8} opacity={0.45} />
    </g>
  );
};

// two-bone IK in "forward-positive" degrees from straight down (the rig's convention); knee=true bends forward
const D2R = Math.PI / 180;
const ik = (l1: number, l2: number, fx: number, dy: number, knee: boolean) => {
  const d = clamp(Math.hypot(fx, dy), Math.abs(l1 - l2) + 1, l1 + l2 - 0.5);
  const th = Math.atan2(fx, dy) / D2R;
  const al = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) / D2R;
  const be = Math.acos((l2 * l2 + d * d - l1 * l1) / (2 * l2 * d)) / D2R;
  if (knee) { const a = th + al; return { a, b: th - be - a }; }
  const a = th - al;
  return { a, b: th + be - a };
};

/**
 * Pip riding the Bicycle. Pass the same x, y (ground point mid-wheelbase), t and `scale` (= Bicycle s = Hero scale) you
 * give <Bicycle>, and the facing (1 = riding right). The legs pedal (cranks follow bikeCrank(t)); `hands`: 'bars'
 * (leaning on the handlebars) or 'free' (hands free, arms out wide, wobbling). Draw the bike first, then the Hero:
 *   <Bicycle x y s={sc} t={t} /> <Hero pose={{ ...bikePose(t, x, y, sc), expr: 'happy' }} />
 */
export const bikePose = (t: number, x: number, y: number, scale: number, o: { facing?: 1 | -1; hands?: 'bars' | 'free' } = {}): Pose => {
  const { facing = 1, hands = 'bars' } = o;
  const bars = hands === 'bars';
  const tilt = (bars ? 12 : -2) * facing;
  const base: Pose = { ...basePose, x: x + facing * HIP_ON_BIKE.x * scale, y: y + HIP_ON_BIKE.y * scale, scale, facing, yaw: facing, tilt, headTilt: Math.sin(t / 7) * 2, sway: Math.sin(t / 5) * 8 };
  const phi = bikeCrank(t);
  const leg = (ph: number) => {
    const p = pedalAt(ph);
    // aim the ankle a little behind and above the pedal, so the ball of the foot sits on it
    return ik(72, 68, p.fx - HIP_ON_BIKE.x - 7, p.y - 6 - HIP_ON_BIKE.y, true);
  };
  const L1 = leg(phi);
  const L2 = leg(phi + 180);
  // the near leg is the one drawn in front: armR/legR when facing right
  const near = facing === 1 ? 'R' : 'L';
  const far = facing === 1 ? 'L' : 'R';
  const out: Pose = { ...base };
  (out as unknown as Record<string, unknown>)[`leg${near}`] = L1;
  (out as unknown as Record<string, unknown>)[`leg${far}`] = L2;
  if (bars) {
    const j = joints(base);
    const root = near === 'R' ? j.armR.root : j.armL.root;
    const A = ik(62, 58, GRIP.x - HIP_ON_BIKE.x - facing * root.x, GRIP.y - HIP_ON_BIKE.y - root.y, false);
    (out as unknown as Record<string, unknown>)[`arm${near}`] = A;
    (out as unknown as Record<string, unknown>)[`arm${far}`] = { a: -A.a, b: -A.b };
    out.handL = 'open';
    out.handR = 'open';
  } else {
    const w = Math.sin(t / 6) * 7;
    (out as unknown as Record<string, unknown>)[`arm${near}`] = { a: 108 + w, b: -8 };
    (out as unknown as Record<string, unknown>)[`arm${far}`] = { a: 108 - w, b: -8 };
  }
  return out;
};

export * from './street-bus-market';
