import React from 'react';
import { clamp, easeOut, rnd } from '../../engine';

// RogueRobot: a generic 10-storey industrial robot (boxy, rust-orange and grey, one red eye), seen from the front.
// Stomping walk, smoke from two exhaust stacks. `burst` 0..1 blows it into a fireball, flying limbs and plates.
// BoltRain: nuts, bolts and washers raining down and pinging off the floor. Both are pure functions of t.
//
//   <RogueRobot t x y scale? burst? walk? id? />
//     t, x, y   shot clock; x = centre, y = floor line under its feet (world units)
//     scale     1 = 1000 units tall (fills the frame); 0.5-0.7 for a wide with the skyline, 1+ for a low-angle close
//     walk      stomp speed multiplier (0 = standing; smoke and the eye still move). A step lands every ~14 frames at 1
//     burst     0 = intact, 0..0.5 the fireball swells (white->yellow->orange), parts fly out and tumble, 1 = debris
//               far away and falling, black smoke left behind. Drive it: kf(t, [[hitT, 0], [hitT + 40, 1]])
//   <BoltRain t startT x0 x1 groundY top? n? seed? size? span? />
//     from startT, n nuts/bolts/washers fall between x0..x1 from y = top, bounce once off groundY with a white ping,
//     and settle; `size` scales them (1 = 14-34 units), `span` frames over which the rain starts.

const INK = '#1A1218';
const C = { rust: '#C4622D', rustDark: '#8E3F1C', rustLight: '#E0833E', grey: '#6B7280', greyDark: '#3E4450', greyLight: '#9AA3AE', red: '#FF2A2A' };

const Bx: React.FC<{ x: number; y: number; w: number; h: number; fill: string; r?: number; rivets?: boolean }> = ({ x, y, w, h, fill, r = 12, rivets = false }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={INK} strokeWidth={8} />
    <rect x={x + w * 0.74} y={y + 5} width={w * 0.26 - 5} height={h - 10} rx={r * 0.6} fill="#000" opacity={0.22} />
    <rect x={x + 8} y={y + 8} width={w * 0.5} height={9} rx={4} fill="#FFF" opacity={0.2} />
    {rivets
      ? [0.1, 0.9].flatMap((u) => [0.12, 0.88].map((v) => <circle key={`${u}${v}`} cx={x + w * u} cy={y + h * v} r={6} fill={C.greyDark} stroke={INK} strokeWidth={2.5} />))
      : null}
  </g>
);

const Smoke: React.FC<{ t: number; x: number; y: number; k: number; big: number }> = ({ t, x, y, k, big }) => (
  <g>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const p = (((t * 0.018 + i / 6 + k * 0.37) % 1) + 1) % 1;
      const r = (20 + 70 * p) * (1 + big);
      return (
        <g key={i} opacity={0.75 * (1 - p)}>
          <circle cx={x + Math.sin(p * 6 + i + k) * 26 + p * 90} cy={y - p * 340 * (1 + big * 0.6)} r={r} fill="#2B2A33" stroke={INK} strokeOpacity={0.5} strokeWidth={4} />
          <circle cx={x + Math.sin(p * 6 + i + k) * 26 + p * 90 - r * 0.25} cy={y - p * 340 * (1 + big * 0.6) - r * 0.25} r={r * 0.55} fill="#4A4958" opacity={0.7} />
        </g>
      );
    })}
  </g>
);

// burst parts: centre (for the spin), travel direction, spin in degrees
type Part = { cx: number; cy: number; vx: number; vy: number; rot: number };
const PARTS: Record<string, Part> = {
  head: { cx: 0, cy: -905, vx: 0.15, vy: -1.15, rot: 220 },
  torso: { cx: 0, cy: -650, vx: -0.12, vy: -0.45, rot: -40 },
  armL: { cx: -330, cy: -640, vx: -1.1, vy: -0.6, rot: -280 },
  armR: { cx: 330, cy: -640, vx: 1.1, vy: -0.7, rot: 320 },
  legL: { cx: -130, cy: -250, vx: -0.7, vy: -0.25, rot: -110 },
  legR: { cx: 130, cy: -250, vx: 0.7, vy: -0.15, rot: 130 },
};

export const RogueRobot: React.FC<{ t: number; x: number; y: number; scale?: number; burst?: number; walk?: number; id?: string }> = ({ t, x, y, scale = 0.8, burst = 0, walk = 1, id = 'rr' }) => {
  const b = clamp(burst);
  const d = easeOut(b);
  const ph = t * 0.22 * walk;
  const sL = Math.sin(ph);
  const liftL = Math.max(0, sL) * 62;
  const liftR = Math.max(0, -sL) * 62;
  const bob = walk ? Math.abs(Math.cos(ph)) * 16 : 0;
  const sway = walk ? Math.sin(ph) * 2.2 : 0;
  const part = (name: string, children: React.ReactNode) => {
    const P = PARTS[name];
    const tx = P.vx * 1100 * d;
    const ty = P.vy * 760 * d + 1300 * b * b;
    return <g key={name} transform={`translate(${tx} ${ty}) rotate(${P.rot * d} ${P.cx} ${P.cy})`}>{children}</g>;
  };
  const dust = (liftOfFoot: number, fx: number, k: number) => {
    // a puff right after each foot lands (its lift is back to 0 and the other foot's is rising)
    const u = ((((ph + (k ? 0 : Math.PI)) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI);
    if (!walk || liftOfFoot > 1 || u > 0.4 || b > 0) return null;
    const q = u / 0.4;
    return (
      <g opacity={0.8 * (1 - q)}>
        {[-1, 1].map((sd) => <ellipse key={sd} cx={fx + sd * (110 + 150 * q)} cy={-18 - 40 * q} rx={50 + 70 * q} ry={26 + 40 * q} fill="#A89C8E" stroke={INK} strokeOpacity={0.3} strokeWidth={4} />)}
      </g>
    );
  };
  const leg = (name: string, cxl: number, lift: number) =>
    part(
      name,
      <g transform={`translate(0 ${-lift}) rotate(${(lift / 62) * (cxl < 0 ? -4 : 4)} ${cxl} -490)`}>
        <Bx x={cxl - 70} y={-495} w={140} h={210} fill={C.rust} rivets />
        <Bx x={cxl - 54} y={-292} w={108} h={235} fill={C.grey} />
        <circle cx={cxl} cy={-292} r={34} fill={C.greyDark} stroke={INK} strokeWidth={7} />
        <Bx x={cxl - 105} y={-66} w={210} h={66} fill={C.rustDark} r={16} />
        <path d={`M ${cxl - 60} -66 L ${cxl - 30} 0 M ${cxl - 10} -66 L ${cxl + 20} 0 M ${cxl + 40} -66 L ${cxl + 70} 0`} stroke="#E8B53A" strokeWidth={9} opacity={0.85} />
      </g>,
    );
  const arm = (name: string, sx: number, swing: number) =>
    part(
      name,
      <g transform={`rotate(${swing} ${sx} -800)`}>
        <Bx x={sx - 58} y={-805} w={116} h={250} fill={C.rust} rivets />
        <circle cx={sx} cy={-820} r={64} fill={C.grey} stroke={INK} strokeWidth={8} />
        <circle cx={sx} cy={-820} r={26} fill={C.greyDark} stroke={INK} strokeWidth={5} />
        <Bx x={sx - 78} y={-560} w={156} h={170} fill={C.greyDark} r={22} />
        <path d={`M ${sx - 40} -390 L ${sx - 52} -330 M ${sx + 40} -390 L ${sx + 52} -330 M ${sx} -390 L ${sx} -320`} stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d={`M ${sx - 40} -390 L ${sx - 52} -330 M ${sx + 40} -390 L ${sx + 52} -330 M ${sx} -390 L ${sx} -320`} stroke={C.greyLight} strokeWidth={10} strokeLinecap="round" />
      </g>,
    );
  const eyeX = Math.sin(t * 0.07) * 28;
  const pulse = 0.75 + 0.25 * Math.sin(t * 0.4);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={6} rx={430} ry={34} fill="#000" opacity={0.4 * (1 - d)} />
      {dust(liftL, -130, 0)}
      {dust(liftR, 130, 1)}
      <g transform={`translate(0 ${-bob}) rotate(${sway} 0 0)`}>
        {leg('legL', -130, liftL)}
        {leg('legR', 130, liftR)}
        {arm('armL', -335, walk ? -sL * 14 : 0)}
        {arm('armR', 335, walk ? sL * 14 : 0)}
        {part(
          'torso',
          <g>
            <Smoke t={t} x={-150} y={-855} k={0} big={b * 1.5} />
            <Smoke t={t + 17} x={150} y={-855} k={1} big={b * 1.5} />
            <Bx x={-185} y={-910} w={36} h={70} fill={C.greyDark} r={6} />
            <Bx x={149} y={-910} w={36} h={70} fill={C.greyDark} r={6} />
            <Bx x={-240} y={-840} w={480} h={380} fill={C.rust} r={22} rivets />
            <Bx x={-150} y={-790} w={300} h={170} fill={C.grey} r={14} />
            <path d="M -110 -750 L 110 -750 M -110 -700 L 110 -700" stroke={C.greyDark} strokeWidth={9} strokeLinecap="round" />
            <circle cx={0} cy={-700} r={38} fill={C.greyDark} stroke={INK} strokeWidth={7} />
            <circle cx={0} cy={-700} r={14} fill={C.red} opacity={0.5 + 0.5 * pulse} />
            {[-215, -190, 190, 215].map((vx, i) => <rect key={i} x={vx - 8} y={-780 + (i % 2) * 40} width={16} height={90} rx={5} fill="#1A1218" opacity={0.75} />)}
            <path d="M -240 -520 L 240 -520" stroke={INK} strokeWidth={8} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M ${-224 + i * 56} -516 l 28 0 l 20 40 l -28 0 Z`} fill={i % 2 ? '#E8B53A' : INK} opacity={0.9} />)}
            <path d="M -200 -830 Q -170 -760 -210 -690 M 120 -830 Q 160 -770 130 -700" stroke={C.rustDark} strokeWidth={14} fill="none" opacity={0.55} strokeLinecap="round" />
          </g>,
        )}
        {part(
          'head',
          <g>
            <path d="M 0 -985 L 0 -1060" stroke={INK} strokeWidth={14} strokeLinecap="round" />
            <circle cx={0} cy={-1066} r={14} fill={C.red} stroke={INK} strokeWidth={5} opacity={0.6 + 0.4 * Math.sin(t * 0.5)} />
            <Bx x={-100} y={-990} w={200} h={150} fill={C.grey} r={22} rivets />
            <rect x={-72} y={-950} width={144} height={62} rx={14} fill="#120D16" stroke={INK} strokeWidth={6} />
            <circle cx={eyeX} cy={-919} r={46} fill={C.red} opacity={0.22 * pulse} />
            <circle cx={eyeX} cy={-919} r={32} fill={C.red} opacity={0.4} />
            <circle cx={eyeX} cy={-919} r={22} fill={C.red} stroke="#FF8A8A" strokeWidth={3} />
            <circle cx={eyeX + 6} cy={-926} r={7} fill="#FFFFFF" />
          </g>,
        )}
      </g>
      {b > 0 ? (
        <g>
          {/* fireball: lobes swell and cool, then black smoke hangs */}
          {b < 0.6 ? (
            <g opacity={clamp(1 - b / 0.55)}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const a = (i / 8) * Math.PI * 2 + 0.4;
                const R = (60 + 520 * easeOut(clamp(b / 0.5))) * (0.7 + 0.5 * rnd(7, i));
                return <circle key={i} cx={Math.cos(a) * R * 0.8} cy={-650 + Math.sin(a) * R * 0.8} r={R * 0.55} fill="#FF7A1F" />;
              })}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const a = (i / 8) * Math.PI * 2 + 0.4;
                const R = (60 + 520 * easeOut(clamp(b / 0.5))) * (0.7 + 0.5 * rnd(7, i));
                return <circle key={`c${i}`} cx={Math.cos(a) * R * 0.5} cy={-650 + Math.sin(a) * R * 0.5} r={R * 0.4} fill="#FFC93A" />;
              })}
            </g>
          ) : null}
          {b < 0.35 ? <circle cx={0} cy={-650} r={90 + 700 * easeOut(clamp(b / 0.3))} fill={b < 0.1 ? '#FFFFFF' : '#FFF1B0'} opacity={clamp(1 - b / 0.3)} /> : null}
          <g opacity={0.6 * clamp((b - 0.15) * 4)}>
            {Array.from({ length: 5 }).map((_, i) => {
              const a = (i / 5) * Math.PI * 2 + 1;
              const R = (120 + 330 * d) * (0.8 + 0.4 * rnd(11, i));
              return <circle key={`k${i}`} cx={Math.cos(a) * R * 0.9} cy={-650 + Math.sin(a) * R * 0.7 - 160 * d} r={R * 0.5} fill="#24222B" />;
            })}
          </g>
          {/* plates and scrap flying out of the torso */}
          {Array.from({ length: 22 }).map((_, i) => {
            const a = rnd(21, i) * Math.PI * 2;
            const sp = 0.5 + rnd(22, i) * 1.2;
            const px = (rnd(23, i) - 0.5) * 420;
            const py = -650 + (rnd(24, i) - 0.5) * 360;
            const w = 40 + rnd(25, i) * 80;
            const h = 26 + rnd(26, i) * 50;
            return (
              <g key={`p${i}`} transform={`translate(${px + Math.cos(a) * sp * 1200 * d} ${py + Math.sin(a) * sp * 800 * d - 200 * d + 1500 * b * b}) rotate(${(rnd(27, i) - 0.5) * 900 * d + rnd(28, i) * 90})`}>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill={i % 3 === 0 ? C.grey : i % 3 === 1 ? C.rust : C.rustDark} stroke={INK} strokeWidth={5} />
                <circle cx={-w / 2 + 9} cy={0} r={4} fill={C.greyDark} />
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

/** Nuts, bolts and washers raining down and pinging off the floor. See the header for props. */
export const BoltRain: React.FC<{ t: number; startT: number; x0: number; x1: number; groundY: number; top?: number; n?: number; seed?: number; size?: number; span?: number }> = ({
  t, startT, x0, x1, groundY, top = -160, n = 70, seed = 5, size = 1, span = 70,
}) => {
  const g = 1.5;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const s = startT + rnd(seed, i) * span;
        const tau = t - s;
        if (tau < 0) return null;
        const x = x0 + rnd(seed + 1, i) * (x1 - x0);
        const gy = groundY - rnd(seed + 6, i) * 36 * size; // lands at slightly different depths
        const fall = Math.sqrt((2 * (gy - top)) / g);
        const sz = (14 + rnd(seed + 2, i) * 20) * size;
        const kind = i % 3;
        let y: number;
        let dx = 0;
        const bounceV = g * fall * (0.28 + 0.2 * rnd(seed + 3, i));
        const air = (2 * bounceV) / g;
        if (tau < fall) y = top + 0.5 * g * tau * tau;
        else {
          const u = tau - fall;
          y = u < air ? gy - (bounceV * u - 0.5 * g * u * u) : gy;
          dx = (rnd(seed + 4, i) - 0.5) * 2 * 24 * size * Math.min(u, air) / Math.max(air, 1);
        }
        const spin = tau < fall + air ? tau * (rnd(seed + 5, i) - 0.5) * 40 : (fall + air) * (rnd(seed + 5, i) - 0.5) * 40;
        const col = ['#9AA3AE', '#6B7480', '#B5622E'][Math.floor(rnd(seed + 8, i) * 3)];
        const u = tau - fall;
        return (
          <g key={i}>
            {u >= 0 && u < 5 ? (
              <g opacity={1 - u / 5}>
                <circle cx={x} cy={gy} r={sz * (0.8 + u * 0.9)} fill="none" stroke="#FFFFFF" strokeWidth={3} />
                <path d={`M ${x - sz * 1.4} ${gy - sz * 0.6} L ${x - sz * 0.5} ${gy - sz * 0.15} M ${x + sz * 1.4} ${gy - sz * 0.6} L ${x + sz * 0.5} ${gy - sz * 0.15} M ${x} ${gy - sz * 1.7} L ${x} ${gy - sz * 0.7}`} stroke="#FFF3B0" strokeWidth={4} strokeLinecap="round" />
              </g>
            ) : null}
            {tau < fall ? <line x1={x} y1={y - 3 * g * tau} x2={x} y2={y} stroke="#FFFFFF" strokeWidth={3} opacity={0.25} /> : null}
            <g transform={`translate(${x + dx} ${y}) rotate(${spin})`}>
              {kind === 0 ? (
                <g>
                  <polygon points={[0, 1, 2, 3, 4, 5].map((k) => `${Math.cos((k * Math.PI) / 3) * sz},${Math.sin((k * Math.PI) / 3) * sz * 0.9}`).join(' ')} fill={col} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
                  <circle r={sz * 0.42} fill="#1A1218" />
                </g>
              ) : kind === 1 ? (
                <g>
                  <rect x={-sz * 0.2} y={-sz * 0.2} width={sz * 2} height={sz * 0.4} fill={col} stroke={INK} strokeWidth={3.5} />
                  <polygon points={[0, 1, 2, 3, 4, 5].map((k) => `${Math.cos((k * Math.PI) / 3) * sz * 0.6},${Math.sin((k * Math.PI) / 3) * sz * 0.6}`).join(' ')} fill={col} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
                  <path d={`M ${sz * 0.6} ${-sz * 0.2} l 0 ${sz * 0.4} M ${sz} ${-sz * 0.2} l 0 ${sz * 0.4} M ${sz * 1.4} ${-sz * 0.2} l 0 ${sz * 0.4}`} stroke={INK} strokeWidth={2.5} />
                </g>
              ) : (
                <g>
                  <circle r={sz * 0.8} fill={col} stroke={INK} strokeWidth={4} />
                  <circle r={sz * 0.34} fill="#1A1218" />
                </g>
              )}
              <circle cx={-sz * 0.3} cy={-sz * 0.35} r={sz * 0.16} fill="#FFFFFF" opacity={0.55} />
            </g>
          </g>
        );
      })}
    </g>
  );
};
