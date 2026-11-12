import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeInOut, backOut, rnd, camT, LOOKS, Kitchen, KITCHEN, KitchenIsland, islandTop, stand,
  Glow, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { Candle, Dim } from '../last-one/shots-chc-shared-props-and-cards';
import { Faucet, WaterBottle, GlassCup, BowlTop } from './chb-place-props';

// Chapter B, "week one: living with less" (B25-B27), under the blackout look: a candle instead of the lamp (B25), bottled
// water instead of the tap (B26), one meal split into two bowls (B27).

const PIP = LOOKS.pipHood;

// ---------- B25: the dark kitchen; Pip tries the switch, nothing; a candle is lit on the island ----------
const AT = stand(KITCHEN, 0.36, 0.4);
const CANDLE_AT = islandTop(0.6, 0.55);
export const B25: React.FC<ShotProps> = ({ t, len }) => {
  const lit = clamp((t - 42) / 8);
  const pop = backOut(clamp((t - 40) / 7));
  const pose = poseAt(t, [
    { f: 0, p: { x: AT.x, y: AT.y, scale: AT.scale, yaw: -0.35, look: -0.5, armL: { a: 12, b: 6 }, armR: { a: 12, b: 6 } } },
    { f: 6, p: { armL: { a: 130, b: 6 }, look: -0.9 } },
    { f: 11, p: { armL: { a: 138, b: 4 } } },
    { f: 15, p: { armL: { a: 134, b: 6 } } },
    { f: 26, p: { armL: { a: 14, b: 8 }, look: 0.1, headTilt: 3 } },
    { f: 46, p: { look: 0.7, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1060]]), kf(t, [[0, 540], [len, 590]]), kf(t, [[0, 1.0], [len, 1.3]]))}>
      <Kitchen t={t + 40} id="sb25" veil={0.6} />
      <Dim o={0.42} />
      <Glow x={790} y={457} r={320} kind="cool" o={0.35} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [18, 'tired'], [44, 'worried']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      {t >= 40 ? (
        <g transform={`translate(${CANDLE_AT.x} ${CANDLE_AT.y}) scale(${pop}) translate(${-CANDLE_AT.x} ${-CANDLE_AT.y})`}>
          <Candle x={CANDLE_AT.x} y={CANDLE_AT.y} t={t} s={0.62} glow={lit} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- B26: bottled water poured into a glass; then the pan left to a dry tap, one drip, a red cross ----------
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const tilt = kf(t, [[0, 0], [12, -115], [40, -115], [52, -70]], easeInOut);
  const fill = clamp((t - 14) / 24) * 0.78;
  const pouring = t >= 12 && t < 40;
  const bx = 1480;
  const by = 380;
  const a = (tilt * Math.PI) / 180;
  const L = 325; // the bottle's length at s 1.3
  const tipX = bx + L * Math.sin(a);
  const tipY = by - L * Math.cos(a);
  const mitX = bx + L * 0.4 * Math.sin(a);
  const mitY = by - L * 0.4 * Math.cos(a);
  const cross = backOut(clamp((t - 46) / 7));
  return (
    <g transform={camT(kf(t, [[0, 1250], [26, 1250], [52, 560]]), 520, kf(t, [[0, 1.05], [len, 1.2]]))}>
      <defs>
        <linearGradient id="sb26wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A2438" /><stop offset="1" stopColor="#14111E" /></linearGradient>
        <linearGradient id="sb26top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A4438" /><stop offset="1" stopColor="#2A1F1C" /></linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1100} fill="url(#sb26wall)" />
      <rect x={-300} y={720} width={2520} height={700} fill="url(#sb26top)" />
      <rect x={-300} y={716} width={2520} height={8} fill="#8A6A58" opacity={0.7} />
      {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={1500 + rnd(6, i) * 500} cy={120 + rnd(7, i) * 380} r={16 + rnd(8, i) * 30} fill="#FFB347" opacity={0.1 + 0.08 * Math.sin(t / 12 + i)} />)}
      <Glow x={1750} y={300} r={700} o={0.5} />
      <Faucet x={430} y={330} s={1.15} t={t} />
      {cross > 0 ? (
        <g transform={`translate(640 250) scale(${cross})`}>
          <circle r={58} fill="none" stroke="#FF4A3A" strokeWidth={12} />
          <path d="M -30 -30 L 30 30 M 30 -30 L -30 30" stroke="#FF4A3A" strokeWidth={12} strokeLinecap="round" />
        </g>
      ) : null}
      <GlassCup x={1190} y={830} s={1.5} fill={fill} />
      {pouring ? (
        <path d={`M ${tipX} ${tipY} Q ${tipX - 4} ${(tipY + 830 - 150 * fill) / 2} ${1190 + Math.sin(t) * 2} ${830 - 150 * fill}`} stroke="#9AD8FF" strokeWidth={11} strokeLinecap="round" fill="none" opacity={0.9} />
      ) : null}
      <WaterBottle x={bx} y={by} s={1.3} rot={tilt} fill={1 - clamp((t - 14) / 26) * 0.4} />
      <InsertArm x={mitX} y={mitY} fx={2250} fy={160} rot={-90} s={3.4} width={90} fist />
    </g>
  );
};

// ---------- B27: a table from above, candlelight: one bowl of rice split into two ----------
export const B27: React.FC<ShotProps> = ({ t, len: full }) => {
  const len = Math.min(full, 54); // B27 really runs 1.8 s; a one-chapter preview stretches the last shot to the episode end
  const a = 1 - 0.5 * easeOut(clamp((t - 6) / 8));
  const b = 0.5 * easeOut(clamp((t - 22) / 8));
  const mx = kf(t, [[0, 1250], [6, 770], [14, 800], [26, 1180], [32, 1190], [44, 1560]]);
  const my = kf(t, [[0, 1250], [6, 690], [14, 560], [26, 560], [32, 660], [44, 1100]]);
  const loaded = t > 10 && t < 30 ? 1 : 0;
  const hx = mx - 130;
  const hy = my - 80;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <defs>
        <linearGradient id="sb27wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7A5744" /><stop offset="1" stopColor="#3E2A24" /></linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1700} fill="url(#sb27wood)" />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M -300 ${i * 180 - 40} H 2300`} stroke="#2A1C18" strokeWidth={4} opacity={0.5} />)}
      <Glow x={1640} y={220} r={1000} o={0.65} />
      <circle cx={1640} cy={230} r={46} fill="#5A4A6A" stroke="#12101C" strokeWidth={5} />
      <circle cx={1640} cy={230} r={22} fill="#FFF2C4" />
      <Glow x={1640} y={230} r={160} o={0.9} />
      <path d="M 520 880 L 1160 840 M 540 910 L 1180 868" stroke="#E8DCC0" strokeWidth={9} strokeLinecap="round" opacity={0.9} />
      <BowlTop x={700} y={560} r={190} fill={a} seed={2} />
      <BowlTop x={1230} y={560} r={190} fill={b} seed={5} />
      {[0, 1].map((i) => <path key={i} d={`M ${700 + i * 530} 380 q ${14 + Math.sin(t / 7 + i) * 6} -30 0 -60`} stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.35 * (i ? b * 2 : a)} />)}
      <InsertArm x={mx} y={my} fx={2150} fy={1350} rot={-40} s={3.4} width={92} />
      <path d={`M ${mx - 10} ${my - 6} L ${hx} ${hy}`} stroke="#B98A5A" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={hx} cy={hy} rx={62} ry={44} fill="#B98A5A" stroke="#12101C" strokeWidth={4} transform={`rotate(-25 ${hx} ${hy})`} />
      {loaded ? <ellipse cx={hx} cy={hy} rx={50} ry={34} fill="#FFFDF6" transform={`rotate(-25 ${hx} ${hy})`} /> : <ellipse cx={hx} cy={hy} rx={50} ry={34} fill="#8C6A44" transform={`rotate(-25 ${hx} ${hy})`} />}
    </g>
  );
};
