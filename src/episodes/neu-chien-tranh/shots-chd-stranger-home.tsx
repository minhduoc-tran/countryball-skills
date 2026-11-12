import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LightVeil, Dust, Glow, Foreground, Sparkle,
  joints, toWorld, LEG_LEN, ShotProps,
} from '../../engine';
import { Wisps } from '../tien-vo-han/chb-food-and-family-props';
import { SpareRoom, Mattresses, Suitcase, Bag, HOST, FLOOR } from './chd-spare-room-props';
import { GreyCat } from './chd-children-props';

// Chapter D (195.0-200.2 s), "year one: stranger" (1/2), look y1: the family in a stranger's spare room in another city.
// D8 wide: two mattresses, the cat, a kind host with a tray of bowls. D9 Pip at the window onto a skyline that is not his.
// D10 he unpacks his bag onto a bare shelf: a notebook, a pencil case, and a photo of him and Mo.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;
const SEAT_LEGS = { legL: { a: 84, b: -84 }, legR: { a: 88, b: -80 } };

// ---------- D8: "Nhà bạn ở nhờ một gia đình xa lạ": wide, the spare room, the host brings a tray ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => {
  const mum: Pose = { ...poseAt(t, [{ f: 0, p: { x: 650, y: FLOOR - 76 * 0.95, scale: 0.95, yaw: 0.8, facing: 1, ...SEAT_LEGS, armL: { a: 20, b: 30 }, armR: { a: 28, b: 44 }, headTilt: 5, look: 0.5 } }, { f: 36, p: { headTilt: -1 } }]), ...faceAt(t, [[0, 'tired']]) };
  const sis: Pose = { ...poseAt(t, [{ f: 0, p: { x: 500, y: FLOOR - 76 * 0.7, scale: 0.7, yaw: 0.8, facing: 1, ...SEAT_LEGS, armL: { a: 20, b: 30 }, armR: { a: 24, b: 46 }, headTilt: 3, look: 0.4 } }]), ...faceAt(t, [[0, 'neutral']]) };
  const pip: Pose = { ...poseAt(t, [{ f: 0, p: { x: 1070, y: FLOOR - LEG_LEN * 1.05, scale: 1.05, yaw: 0.6, facing: 1, armL: { a: 10, b: -6 }, armR: { a: 12, b: -6 }, headTilt: 3, look: 0.6 } }, { f: 24, p: { headTilt: -2 } }]), ...faceAt(t, [[0, 'tired'], [32, 'worried']]) };
  const host: Pose = { ...poseAt(t, [{ f: 0, p: { x: 1560, y: FLOOR - LEG_LEN * 1.05, scale: 1.05, yaw: -0.7, facing: -1, armL: { a: 30, b: 30 }, armR: { a: 10, b: 0 }, headTilt: -3, look: -0.4 } }, { f: 18, p: { armL: { a: 72, b: 14 }, x: 1500 } }]), ...faceAt(t, [[0, 'happy']]) };
  const hand = toWorld(host, joints(host).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 570, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <SpareRoom t={t + 30} id="d8" />
      <Mattresses x0={150} x1={820} />
      <GreyCat x={330} y={FLOOR - 62} s={0.5} t={t} eyes="half" flip />
      <Suitcase x={1790} s={0.9} />
      <Bag x={880} y={FLOOR} s={0.8} color="#F28C6A" star />
      <Bag x={960} y={FLOOR} s={0.95} color="#4A5A7A" />
      <Hero look={SIS} pose={sis} rimId="rimR" shadow={0} />
      <Hero look={MOM} pose={mum} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={1} />
      <Hero look={HOST} pose={host} rimId="rimL" shadow={1} />
      <g transform={`translate(${hand.x - 14} ${hand.y + 8})`}>
        <rect x={-92} y={0} width={184} height={12} rx={5} fill="#B9703A" stroke="#6A3E1A" strokeWidth={3} />
        {[-52, 0, 52].map((dx) => <g key={dx}><path d={`M ${dx - 24} -2 H ${dx + 24} Q ${dx + 20} -26 ${dx} -27 Q ${dx - 20} -26 ${dx - 24} -2 Z`} fill="#E9E2D2" stroke="#8A8272" strokeWidth={2.5} /><ellipse cx={dx} cy={-6} rx={20} ry={4} fill="#E3C28A" /></g>)}
        <Wisps x={0} y={-34} t={t} s={0.7} n={3} o={0.5} />
      </g>
      <LightVeil id="d8veil" lights={[[1190, 600, 640], [1500, 560, 300]]} o={0.4} />
      <Dust t={t} seed={71} x0={900} y0={300} w={700} h={500} n={22} o={0.5} />
    </g>
  );
};

// ---------- D9: "ở một thành phố khác": at the window, a skyline that isn't his, a red light blinking on the tower ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...poseAt(t, [{ f: 0, p: { x: 1250, y: FLOOR - LEG_LEN * 1.05, scale: 1.05, yaw: 0.9, facing: 1, armL: { a: 8, b: -6 }, armR: { a: 12, b: -8 }, headTilt: -5, look: 0.8 } }, { f: len, p: { headTilt: -9 } }]), ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(kf(t, [[0, 1360], [len, 1400]]), 560, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <SpareRoom t={t + 10} id="d9" night={0.4} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={1500} y={390} r={420} kind="cool" o={0.25} />
      <LightVeil id="d9veil" lights={[[1500, 400, 480], [1190, 600, 380]]} o={0.5} />
      <Foreground blur={16}><path d="M 1000 1100 L 1010 800 Q 1080 780 1130 820 L 1150 1100 Z" fill="#0E0A14" /></Foreground>
    </g>
  );
};

// ---------- D10: "Bạn học cách làm lại từ đầu.": he unpacks the bag onto a bare shelf, one thing at a time ----------
const SHELF = { x0: 700, x1: 1100, y: 640 };
const SLOTS = [761, 861, 961];
const ITEMS: Array<(k: { t: number }) => React.ReactNode> = [
  () => (<g><rect x={-34} y={-92} width={68} height={92} rx={5} fill="#3E8C86" stroke="#1E4A46" strokeWidth={4} /><rect x={-34} y={-92} width={14} height={92} fill="#2F6E69" /><rect x={-10} y={-70} width={34} height={22} rx={3} fill="#F6EFE3" /></g>),
  () => (<g><rect x={-54} y={-46} width={108} height={46} rx={20} fill="#F2C230" stroke="#9A7A10" strokeWidth={4} /><path d="M -40 -23 H 40" stroke="#9A7A10" strokeWidth={4} strokeDasharray="8 6" /><circle cx={34} cy={-23} r={7} fill="#E8837A" /></g>),
  () => (<g><rect x={-46} y={-108} width={92} height={108} rx={5} fill="#8A6A44" stroke="#4A3220" strokeWidth={4} /><rect x={-36} y={-98} width={72} height={88} fill="#D9C6A0" /><circle cx={-13} cy={-62} r={14} fill="#F6EFE3" stroke="#14121C" strokeWidth={2.5} /><path d="M -30 -10 Q -13 -46 4 -10 Z" fill="#2E2B3D" /><circle cx={16} cy={-60} r={13} fill="#C98E68" stroke="#14121C" strokeWidth={2.5} /><path d="M 3 -10 Q 16 -42 32 -10 Z" fill="#5E6E46" /><path d="M 5 -72 q 4 -14 12 -12 q 8 -4 14 8" stroke="#2A1C18" strokeWidth={5} fill="none" /></g>),
];
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const keys: Array<{ f: number; p: Partial<Pose> }> = [{ f: 0, p: { x: 780, y: FLOOR - LEG_LEN * 1.05, scale: 1.05, yaw: 0.7, facing: 1, armL: { a: 10, b: -6 }, armR: { a: 20, b: 10 }, tilt: 4, headTilt: 3, look: 0.5 } }];
  [0, 1, 2].forEach((i) => {
    const t0 = 4 + i * 16;
    const x = 780 - i * 100;
    keys.push({ f: t0, p: { x, armR: { a: 55, b: 35 }, tilt: 14 } }, { f: t0 + 6, p: { armR: { a: 60, b: 30 }, tilt: 14 } }, { f: t0 + 10, p: { armR: { a: 100, b: -15 }, tilt: 18 } }, { f: t0 + 13, p: { armR: { a: 104, b: -12 }, tilt: 16 } });
  });
  keys.push({ f: 4 + 3 * 16, p: { x: 560, armR: { a: 14, b: 0 }, tilt: 0, headTilt: -3 } });
  const pose: Pose = { ...poseAt(t, keys), ...faceAt(t, [[0, 'neutral'], [58, 'worried']]) };
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 920]]), 600, kf(t, [[0, 1.45], [len, 1.58]]))}>
      <SpareRoom t={t + 50} id="d10" night={0.3} />
      <rect x={SHELF.x0} y={SHELF.y} width={SHELF.x1 - SHELF.x0} height={16} rx={4} fill="#6A4A32" />
      <rect x={SHELF.x0} y={SHELF.y + 16} width={SHELF.x1 - SHELF.x0} height={5} fill="#000" opacity={0.3} />
      {[SHELF.x0 + 30, SHELF.x1 - 30].map((x) => <path key={x} d={`M ${x} ${SHELF.y + 16} V ${SHELF.y + 70} L ${x + (x < 900 ? 36 : -36)} ${SHELF.y + 16}`} stroke="#4A3220" strokeWidth={8} fill="none" />)}
      {ITEMS.map((Item, i) => {
        const t0 = 4 + i * 16;
        const q = clamp((t - (t0 + 6)) / 6);
        const land = t - (t0 + 12);
        const bounce = land > 0 ? Math.sin(land * 0.9) * 5 * Math.exp(-land / 4) : 0;
        if (t < t0 + 6) return null;
        const x = 830 + (SLOTS[2 - i] - 830) * easeOut(q);
        const y = 700 + (SHELF.y - 700) * easeOut(q) - Math.sin(q * Math.PI) * 70 + bounce;
        return <g key={i} transform={`translate(${x} ${y})`}><Item t={t} /></g>;
      })}
      <Bag x={830} y={FLOOR} s={1.2} color="#4A5A7A" />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {t > 4 + 2 * 16 + 14 ? <Sparkle x={961} y={540} t={t - (4 + 2 * 16 + 14)} s={1.1} /> : null}
      <LightVeil id="d10veil" lights={[[1190, 600, 620], [860, 620, 300]]} o={0.42} />
    </g>
  );
};
