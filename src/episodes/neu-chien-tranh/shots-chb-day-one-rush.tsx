import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeInOut, rnd, camT, LOOKS, Street, streetStand, Supermarket, aisleStand, Motorbike,
  Glow, ShotProps, FONT,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BagWalker } from './chb-bag-walker';
import { NoodlePack, Rider, ClockFace, AtmMacro, emptyOrder } from './chb-scene-props';

// Chapter B, "day one" panic buying (B1-B5): the street rushing home with bags (B1), the supermarket aisle emptying
// (B2), the noodle shelf bare in two hours (B3), the petrol queue to the crossroads (B4), the ATM out of cash (B5).

const PIP = LOOKS.pipHood;
const lin = (v: number) => v;

// ---------- B1: wide: the street at a hurry, everyone walking home with stuffed bags ----------
export const B1: React.FC<ShotProps> = ({ t, len: full }) => {
  const len = Math.min(full, 104); // B1 really runs 3.4 s; a one-chapter preview stretches the first shot to the episode end
  return (
  <g transform={camT(kf(t, [[0, 880], [len, 1090]]), 640, kf(t, [[0, 1.75], [len, 1.95]]))}>
    <Street t={t + 20} id="sb1" market={0.6} />
    <BagWalker look={LOOKS.suit} t={t} at={(u) => streetStand(kf(u, [[0, 3.1], [len, 0.5]], lin), 12)} facing={-1} ph={1.3} c={2} speed={0.7} />
    <BagWalker look={LOOKS.mo} t={t} at={(u) => streetStand(kf(u, [[0, -3.4], [len, -0.2]], lin), 8.5)} facing={1} ph={2.4} c={3} speed={0.7} />
    <BagWalker look={PIP} t={t} at={(u) => streetStand(kf(u, [[0, -1.8], [len, 1.9]], lin), 5.4)} facing={1} ph={0} c={0} speed={0.68} faces={[[0, 'worried']]} />
  </g>  );
};

// ---------- B2: wide: the supermarket aisle; shoppers rush through with armfuls, the shelves thin out ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 540], [len, 560]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
    <Supermarket t={t + 60} id="sb2" empty={kf(t, [[0, 0.15], [len, 0.85]], easeInOut)} cart={false} />
    <BagWalker look={LOOKS.mom} t={t} at={(u) => aisleStand(kf(u, [[0, 0.32], [len, 0.42]], lin), kf(u, [[0, 0.86], [len, 0.62]], lin))} facing={1} ph={0.7} c={2} speed={0.7} rim="rimL" />
    <BagWalker look={PIP} t={t} at={(u) => aisleStand(kf(u, [[0, 0.7], [len, 0.58]], lin), kf(u, [[0, 0.48], [len, 0.36]], lin))} facing={-1} ph={2} c={0} speed={0.66} rim="rimR" faces={[[0, 'worried'], [30, 'shock']]} />
  </g>
);

// ---------- B3: macro: the last packs go, a hand takes the very last, the clock whirls to 2:00 ----------
const ROWS = [300, 590, 880];
const SLOTS = 9;
const ORDER = emptyOrder(ROWS.length * SLOTS, 7);
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const hours = 2 * easeInOut(clamp(t / (len - 4)));
  const grab = clamp((t - 6) / 7);
  const back = clamp((t - 15) / 8);
  const armX = 1250 - 560 * easeOut(grab) + 800 * back;
  const lastX = 170 + 150 * 7;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#243247" />
      <rect x={60} y={90} width={1440} height={930} rx={16} fill="#2F3F58" stroke="#12101C" strokeWidth={8} />
      <rect x={60} y={90} width={1440} height={36} fill="#E8453C" />
      <Glow x={780} y={110} r={820} o={0.45} kind="cool" />
      {ROWS.map((y, r) => (
        <g key={r}>
          <rect x={60} y={y} width={1440} height={26} fill="#8C92A4" stroke="#12101C" strokeWidth={4} />
          <rect x={60} y={y + 26} width={1440} height={34} fill="#3A4660" />
          {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={110 + i * 128} y={y + 32} width={74} height={22} rx={3} fill="#F6EFE3" opacity={0.85} />)}
          {Array.from({ length: SLOTS }).map((_, i) => {
            const k = r * SLOTS + i;
            const keepLast = r === 1 && i === 7; // the one pack a hand takes at the end
            if (!keepLast && ORDER[k] >= 9) return null; // the shelf is already mostly bare when this shot starts
            const gone = keepLast ? 12 : 2 + (ORDER[k] / 9) * (len - 16);
            if (t >= gone) return null;
            return <NoodlePack key={i} x={170 + i * 150} y={y} w={118} h={170} c={k + (r % 2)} rot={(rnd(3, k) - 0.5) * 8} />;
          })}
        </g>
      ))}
      <ClockFace x={1590} y={270} r={110} hours={hours} />
      <InsertArm x={lastX + 10} y={ROWS[1] - 70} fx={armX + 900} fy={1250} rot={-12} s={4.2} width={100} fist={grab > 0.95 && back < 0.3} />
    </g>
  );
};

// ---------- B4: side-on pan along the petrol queue: a pump, then scooters nose to tail, away to the crossroads ----------
const QUEUE_N = 15;
const GAP = 232;
const Q0 = 780;
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 700], [len, 2850]], easeInOut);
  const nudge = (i: number) => Math.sin(t / 8 + i) * 1.5;
  const crossX = Q0 + QUEUE_N * GAP + 280;
  return (
    <g transform={camT(cx, 520, kf(t, [[0, 1.05], [len, 0.92]]))}>
      <defs>
        <linearGradient id="sb4sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9A56A" /><stop offset="1" stopColor="#7A5A86" /></linearGradient>
      </defs>
      <rect x={-600} y={-400} width={6600} height={1600} fill="url(#sb4sky)" />
      {/* far shophouses, a gap for the cross street */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = -400 + i * 230;
        if (x > crossX - 360 && x < crossX + 360) return null;
        const h = 260 + rnd(5, i) * 160;
        return (
          <g key={i}>
            <rect x={x} y={760 - h} width={218} height={h} fill={['#8A6A74', '#7A7690', '#9A7A72', '#6E7A8C'][i % 4]} stroke="#12101C" strokeWidth={4} />
            <rect x={x + 30} y={760 - h + 36} width={60} height={70} fill="#26324E" /><rect x={x + 120} y={760 - h + 36} width={60} height={70} fill="#26324E" />
          </g>
        );
      })}
      <rect x={-600} y={760} width={6600} height={500} fill="#4A4658" />
      <rect x={-600} y={752} width={6600} height={14} fill="#8A8496" />
      {/* zebra stripes at the crossroads */}
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={crossX - 140 + i * 42} y={790} width={26} height={150} fill="#EDE6D6" opacity={0.85} />)}
      {/* petrol station: canopy, pump, sign */}
      <rect x={120} y={190} width={440} height={30} fill="#E8453C" stroke="#12101C" strokeWidth={5} />
      <rect x={150} y={220} width={18} height={540} fill="#B8B6C4" stroke="#12101C" strokeWidth={3} />
      <rect x={520} y={220} width={18} height={540} fill="#B8B6C4" stroke="#12101C" strokeWidth={3} />
      <rect x={220} y={140} width={300} height={50} rx={8} fill="#F6EFE3" stroke="#12101C" strokeWidth={4} />
      <text x={370} y={178} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#C8202F" letterSpacing={8}>XĂNG</text>
      <g transform="translate(330 500)">
        <ellipse cx={0} cy={262} rx={80} ry={10} fill="#000" opacity={0.35} />
        <rect x={-46} y={-60} width={92} height={320} rx={10} fill="#D9D5DE" stroke="#12101C" strokeWidth={5} />
        <rect x={-46} y={-60} width={92} height={60} rx={10} fill="#E8453C" />
        <rect x={-30} y={20} width={60} height={50} rx={6} fill="#26324E" /><rect x={-24} y={30} width={48} height={14} fill="#5AE08A" opacity={0.8} />
        <path d="M 46 60 Q 90 60 90 120 V 190" stroke="#12101C" strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>
      {/* the queue: scooters facing the pump, riders waiting */}
      {Array.from({ length: QUEUE_N }).map((_, i) => {
        const x = Q0 + i * GAP + nudge(i);
        return (
          <g key={i}>
            <Motorbike x={x} y={800} s={1.05} facing={-1} color={['#B8483E', '#3E6A8A', '#D9A441', '#2E2B3D', '#EDE6D6', '#2FA595'][i % 6]} t={t} lamp={0.5} />
            <Rider x={x} y={800} s={1.05} facing={-1} c={i} sway={Math.sin(t / 12 + i) * 1.5} />
          </g>
        );
      })}
      {/* the crossroads: a traffic light and a street sign on the far corner */}
      <g transform={`translate(${crossX + 190} 760)`}>
        <rect x={-6} y={-420} width={12} height={420} fill="#2A2A38" />
        <rect x={-28} y={-520} width={56} height={120} rx={12} fill="#12101C" />
        <circle cx={0} cy={-492} r={14} fill="#E8453C" /><circle cx={0} cy={-460} r={14} fill="#4A3A24" /><circle cx={0} cy={-428} r={14} fill="#1E3A2A" />
        <Glow x={0} y={-492} r={90} kind="red" o={0.5} />
      </g>
    </g>
  );
};

// ---------- B5: the ATM close-up; a card goes in, the screen says HẾT TIỀN ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const errAt = 18;
  const inn = kf(t, [[0, 0], [10, 1], [24, 1], [34, 0]], easeInOut);
  const mx = 1170 + 60 * inn;
  const my = 700 + 0 * inn;
  const card = t < 30 ? 1 : 0;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 460], [len, 400]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <AtmMacro t={t} err={t >= errAt ? t - errAt : -1} />
      <g opacity={inn > 0.01 ? 1 : 0}>
        <InsertArm x={mx + 120 - 130 * inn} y={my + 150 - 100 * inn} fx={2100} fy={1250} rot={-70} s={3.6} width={96} />
        {card ? <rect x={mx - 20 - 130 * inn} y={my + 40 - 100 * inn} width={150} height={96} rx={10} fill="#3E9C96" stroke="#12101C" strokeWidth={5} transform={`rotate(-14 ${mx} ${my})`} /> : null}
      </g>
    </g>
  );
};
