import React from 'react';
import { Hero, poseAt, faceAt, camT, kf, clamp, easeOut, rnd, LOOKS, Glow, Dust, Foreground, FONT, ShotProps } from '../../engine';
import { BreadBag, BreadCart, VENDOR, NEIGHBOURS } from './chc-props-food-and-trade';
import { PriceBoard, PaidChip, Mark, Note, INK } from './chc-props-money-and-prices';
import { BlurStreet } from './chc-street-scenes';
import { InsertArm } from '../last-one/insert-arm-and-icons';

// Chapter C, the bánh mì: Pip buys the whole street's bread (C4), the next morning the cart is empty and the
// neighbours queue for nothing (C5), the seller sees everyone wants it (C6) and the price board flips to 35.000 (C7).

const PIP = LOOKS.pipHood;

// ---------- C4: Pip's arms fill with bags at the cart; the carts down the street are all sold out ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const nb = Math.floor(kf(t, [[0, 0], [10, 1], [20, 3], [32, 5], [44, 7], [56, 9]], (v) => v));
  const wob = Math.sin(t / 5) * (nb / 9) * 3.5;
  const pose = poseAt(t, [
    { f: 0, p: { x: 1250, y: 610, scale: 1.3, yaw: -0.55, facing: -1, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, look: -0.7 } },
    { f: 12, p: { armL: { a: 62, b: -22 }, armR: { a: 58, b: -22 }, tilt: -4 }, ease: easeOut },
    { f: 56, p: { tilt: -7 } },
  ]);
  const k = pose.scale;
  const sx = pose.x - 62 * k, sy = pose.y + 52 * k;
  const bags = Array.from({ length: nb }).map((_, i) => ({ i, row: Math.floor(i / 2), col: i % 2 }));
  const vend = poseAt(t, [
    { f: 0, p: { x: 330, y: 590, scale: 1.25, yaw: 0.5, armR: { a: 20, b: -10 } } },
    { f: 16, p: { armR: { a: 150, b: -20 } }, ease: easeOut },
    { f: 30, p: { armR: { a: 120, b: -10 } } },
  ]);
  const loaves = kf(t, [[0, 1], [56, 0.15]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 900]]), 560, kf(t, [[0, 1], [len, 1.1]]))}>
      <BlurStreet t={t + 40} id="c4" carts={[[-5.2, 9, true], [5.3, 12, true], [-5.4, 16, true], [5.4, 22, true]]} />
      <Hero look={VENDOR} pose={{ ...vend, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <BreadCart x={700} y={830} s={1.5} loaves={loaves} t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'smug']]) }} rimId="rimR" shadow={0} />
      <g transform={`rotate(${wob} ${sx} ${sy})`}>
        {[...bags].reverse().map(({ i, row, col }) => (
          <BreadBag key={i} x={sx + (col - 0.5) * 96 + (rnd(2, i) - 0.5) * 10} y={sy - row * 82} s={0.85} rot={(rnd(3, i) - 0.5) * 10} tone={i % 2} />
        ))}
        {nb > 0 ? [-1, 1].map((d) => <ellipse key={d} cx={sx + d * 62} cy={sy - 8} rx={22} ry={19} fill={PIP.hand} stroke={PIP.line} strokeWidth={4} />) : null}
      </g>
      <PaidChip x={1330} y={230} t={t - 12} />
      <PaidChip x={1330} y={230} t={t - 40} />
      <Glow x={900} y={450} r={800} o={0.3} />
    </g>
  );
};

// ---------- C5: next morning, the cart is empty (HẾT BÁNH MÌ) and the neighbours queue, slumping one by one ----------
const QUEUE: [number, number, number][] = [[1190, 660, 1.2], [1400, 640, 1.08], [1600, 625, 1.0], [1780, 610, 0.92]];
export const C5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1020], [len, 1080]]), 560, kf(t, [[0, 1], [len, 1.12]]))}>
    <BlurStreet t={t + 70} id="c5" warm={1} carts={[[-5.2, 11, true], [5.4, 15, true]]} />
    <BreadCart x={620} y={880} s={2.1} loaves={0} sold t={t} />
    {QUEUE.map(([x, y, s], i) => {
      const slump = easeOut(clamp((t - 14 - i * 12) / 12));
      const pose = poseAt(t, [{ f: 0, p: { x: x + Math.sin(t / 20 + i) * 3, y, scale: s, yaw: -0.6, facing: -1, tilt: -2 + slump * 10, headTilt: slump * -8, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, sway: 1 } }]);
      const f = faceAt(t, [[0, 'neutral'], [14 + i * 12, i % 2 ? 'tired' : 'worried']]);
      return (
        <g key={i}>
          <Hero look={NEIGHBOURS[i]} pose={{ ...pose, ...f }} rimId="rimR" shadow={0} />
          <Mark x={x - 20} y={y - 300 * s} t={t - 22 - i * 12} ch="?" s={0.8} color="#4A6EB0" />
        </g>
      );
    })}
    <Dust t={t} seed={51} x0={100} y0={200} w={1700} h={600} n={26} o={0.45} />
  </g>
);

// ---------- C6: the seller, eyes glinting gold, sees a forest of hands waving notes (blurred, big, in front) ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 800, y: 600, scale: 1.7, yaw: 0.4, armL: { a: 14, b: -10 }, armR: { a: 14, b: -10 } } },
    { f: 14, p: { armR: { a: 40, b: -90 }, armL: { a: 40, b: -90 }, headTilt: -4 }, ease: easeOut },
  ]);
  const glint = clamp((t - 12) / 8);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 600, kf(t, [[0, 1], [len, 1.1]]))}>
      <BlurStreet t={t + 30} id="c6" warm={0.8} blur={10} carts={[[-5.2, 8, false]]} />
      <BreadCart x={1250} y={900} s={1.7} loaves={0.35} t={t} />
      <Hero look={VENDOR} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [12, 'happy']]), glint, glintColor: '#FFD25A' }} rimId="rimR" shadow={0} />
      {['đ', '₫', 'đ'].map((c, i) => {
        const p = clamp((t - 14 - i * 6) / 24);
        return <text key={i} x={640 + i * 150 + Math.sin(t / 6 + i) * 8} y={300 - p * 120} fontFamily={FONT.hand} fontWeight={700} fontSize={80} fill="#FFD25A" stroke={INK} strokeWidth={3} opacity={Math.sin(p * Math.PI)}>{c}</text>;
      })}
      <Foreground blur={6}>
        {[[170, 0], [440, 1], [1040, 2], [1400, 3], [1700, 4]].map(([x, i]) => {
          const hy = 640 + Math.sin(t / 4 + i * 2) * 26 - (i % 2) * 60;
          const hx = x + Math.sin(t / 6 + i) * 18;
          return (
            <g key={i}>
              <InsertArm x={hx} y={hy} fx={x - 60 + i * 20} fy={1250} s={2.6} width={92} rot={-8 + Math.sin(t / 4 + i) * 10} />
              <Note x={hx + 10} y={hy - 110} rot={-14 + Math.sin(t / 4 + i * 1.7) * 18} s={1.15} c={i % 2 ? '#7FA6D6' : '#6FB38A'} />
            </g>
          );
        })}
      </Foreground>
    </g>
  );
};

// ---------- C7: the price board flips from 25.000 to 35.000 (macro, bokeh street behind) ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <BlurStreet t={t + 90} id="c7" blur={16} warm={0.6} zoom={2.2} />
    <rect x={-100} y={-100} width={2200} height={1300} fill="#140F1A" opacity={0.45} />
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.1]]))}>
      <PriceBoard x={900} y={470} s={1.5} from="25.000" to="35.000" p={kf(t, [[6, 0], [20, 1]], (v) => v)} t={t} />
    </g>
  </g>
);
