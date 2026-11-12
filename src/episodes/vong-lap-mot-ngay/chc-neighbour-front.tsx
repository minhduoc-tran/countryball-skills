import React from 'react';
import { rnd, Glow, LightVeil, Dust, DuskSky, Cat, Motorbike, WallTexture } from '../../engine';
import { FlowerPot } from './kit-props';
import { NEIGHBOUR } from './kit-cast';

// The neighbour's house front, seen straight on from across the lane (chapter C's butterfly beat): a Vietnamese tube
// house with the shop shutter half up (its lit interior is the light), the balcony above with the flower pot and the cat
// on the ledge, a wall light, a parked scooter, the sidewalk. World space 1920 x 1080. Draw characters after it.
//   <NeighbourFront t id />   FRONT.GROUND = feet line (y 935); FRONT.DOOR = the lit doorway; FRONT.LEDGE = balcony top.
//   frontStand(x, scale?)      hip point + scale for someone standing on the sidewalk at x.
//   <WateringCan x y rot s />  the neighbour's green watering can (x y = the handle), pouring when rot > 30.

export const FRONT = { GROUND: 935, DOOR: { x0: 520, x1: 1010, y0: 520 }, LEDGE: { x0: 1000, x1: 1480, y: 470 }, POT: { x: 1330, y: 470 }, CAT: { x: 1120, y: 470 } };
export const frontStand = (x: number, scale = 1.55) => ({ x, y: FRONT.GROUND - 140 * scale, scale });

export const NeighbourFront: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const D = FRONT.DOOR;
  const L = FRONT.LEDGE;
  return (
    <g>
      <DuskSky id={`${id}sky`} x0={-300} y0={-300} w={2520} h={500} horizonY={200} />
      {/* the neighbours' houses either side, darker */}
      <rect x={-300} y={20} width={560} height={1000} fill="#3A3040" />
      <rect x={1640} y={60} width={600} height={960} fill="#34303E" />
      {[0, 1, 2].map((k) => <rect key={k} x={-200 + k * 150} y={160 + (k % 2) * 40} width={90} height={130} fill={k === 1 ? '#FFC27A' : '#241E2A'} opacity={k === 1 ? 0.7 : 1} />)}
      <rect x={1720} y={200} width={120} height={160} fill="#FFB86A" opacity={0.55} />
      {/* the house: facade, roof parapet, water tank */}
      <rect x={260} y={40} width={1380} height={980} fill="#6A5662" />
      <WallTexture rect={[260, 40, 1380, 980]} />
      <rect x={250} y={24} width={1400} height={30} fill="#4E3E4A" />
      <rect x={1380} y={-60} width={170} height={90} rx={30} fill="#9AA0AE" stroke="#2A2630" strokeWidth={5} />
      {/* upstairs: the balcony door, the railing, the ledge (pot + cat sit on it) */}
      <rect x={1080} y={150} width={320} height={320} fill="#2E2630" />
      <rect x={1100} y={170} width={130} height={300} fill="#43384A" />
      <rect x={1250} y={170} width={130} height={300} fill="#43384A" />
      <rect x={1110} y={190} width={110} height={120} fill="#FFC98A" opacity={0.35} />
      <rect x={L.x0} y={L.y} width={L.x1 - L.x0} height={34} fill="#8A8294" stroke="#3A3446" strokeWidth={4} />
      <rect x={L.x0} y={L.y} width={L.x1 - L.x0} height={6} fill="#FFE2B0" opacity={0.4} />
      {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={L.x0 + 20 + k * 38} y={L.y + 34} width={8} height={70} fill="#3A3446" />)}
      <rect x={L.x0} y={L.y + 100} width={L.x1 - L.x0} height={12} fill="#3A3446" />
      {/* a window on the left upstairs, an AC unit */}
      <rect x={420} y={180} width={300} height={220} fill="#2A2230" />
      <rect x={436} y={196} width={268} height={188} fill="#FFB86A" opacity={0.42} />
      <path d="M 570 196 V 384 M 436 290 H 704" stroke="#2A2230" strokeWidth={10} />
      <rect x={780} y={300} width={170} height={100} rx={8} fill="#C9C6CF" stroke="#2A2630" strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M 796 ${318 + k * 15} L 934 ${318 + k * 15}`} stroke="#8A8794" strokeWidth={4} />)}
      {/* downstairs: the shutter half up, the lit shop inside (shelves, a fan), the step */}
      <rect x={D.x0 - 20} y={D.y0 - 30} width={D.x1 - D.x0 + 40} height={FRONT.GROUND - D.y0 + 30} fill="#2A2028" />
      <rect x={D.x0} y={D.y0} width={D.x1 - D.x0} height={FRONT.GROUND - D.y0} fill="#E8A86A" />
      <rect x={D.x0} y={D.y0} width={D.x1 - D.x0} height={FRONT.GROUND - D.y0} fill="#7A4A3A" opacity={0.35} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x={D.x0 + 30} y={D.y0 + 130 + r * 90} width={180} height={10} fill="#5A3A2E" />
          {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={D.x0 + 38 + k * 34} y={D.y0 + 96 + r * 90} width={24} height={34} fill={['#D9534F', '#3E6A8A', '#F2C14E', '#4A8C86', '#EDE6D6'][(k + r) % 5]} />)}
        </g>
      ))}
      <rect x={D.x0} y={D.y0 - 34} width={D.x1 - D.x0} height={92} fill="#8A8494" />
      {Array.from({ length: 6 }).map((_, k) => <path key={k} d={`M ${D.x0} ${D.y0 - 22 + k * 14} H ${D.x1}`} stroke="#5E5868" strokeWidth={3} />)}
      <rect x={D.x0 - 30} y={FRONT.GROUND - 10} width={D.x1 - D.x0 + 60} height={20} fill="#4E4450" />
      {/* the wall light by the door, a potted plant on the step */}
      <rect x={1060} y={600} width={40} height={30} rx={6} fill="#2A2028" />
      <circle cx={1080} cy={640} r={16} fill="#FFE2B0" />
      <g transform={`translate(1160 ${FRONT.GROUND})`}>
        <ellipse cx={0} cy={4} rx={60} ry={10} fill="#000" opacity={0.35} />
        <path d="M -40 0 L -48 -80 L 48 -80 L 40 0 Z" fill="#C2603E" stroke="#5A2A1C" strokeWidth={4} />
        {[-50, -10, 30, 60].map((dx, k) => <path key={k} d={`M 0 -80 Q ${dx * 0.6} -150 ${dx} ${-190 + (k % 2) * 30} Q ${dx * 0.3} -130 0 -80 Z`} fill={k % 2 ? '#3F5E44' : '#4E7350'} stroke="#24361F" strokeWidth={3} />)}
      </g>
      <FlowerPot x={FRONT.POT.x} y={FRONT.POT.y} s={0.6} t={t} fall={0} ledge={false} />
      <g transform={`translate(${FRONT.CAT.x} ${FRONT.CAT.y}) scale(0.9)`}><Cat x={0} y={0} mood="alert" f={t} /></g>
      {/* power cables across the top */}
      {[0, 1, 2].map((k) => <path key={k} d={`M -300 ${70 + k * 26} Q 960 ${150 + k * 30 + Math.sin(t / 40 + k) * 4} 2220 ${60 + k * 24}`} stroke="#14121A" strokeWidth={4} fill="none" />)}
      {/* the sidewalk and the kerb */}
      <rect x={-300} y={FRONT.GROUND - 10} width={2520} height={400} fill="#4A4250" />
      {Array.from({ length: 14 }).map((_, k) => <path key={k} d={`M ${-300 + k * 190} ${FRONT.GROUND} L ${-420 + k * 210} 1100`} stroke="#3A3440" strokeWidth={3} />)}
      <path d={`M -300 ${FRONT.GROUND + 60} H 2220`} stroke="#3A3440" strokeWidth={3} />
      <rect x={-300} y={1040} width={2520} height={60} fill="#2A2630" />
      <Motorbike x={1560} y={FRONT.GROUND + 20} s={1.1} facing={-1} color="#3E6A8A" />
      <LightVeil id={`${id}veil`} lights={[[(D.x0 + D.x1) / 2, 760, 420], [1080, 640, 200], [570, 290, 200], [1240, 240, 180], [960, 0, 500]]} o={0.4} />
      <Glow x={(D.x0 + D.x1) / 2} y={760} r={460} o={0.45} />
      <Glow x={1080} y={640} r={160} o={0.5} />
      <Dust t={t} seed={44} x0={D.x0} y0={D.y0} w={D.x1 - D.x0} h={400} n={14} o={0.5} />
      {Array.from({ length: 5 }).map((_, k) => <circle key={k} cx={300 + rnd(45, k) * 1300} cy={980 + rnd(46, k) * 50} r={2} fill="#FFE2B0" opacity={0.3} />)}
    </g>
  );
};

export const WateringCan: React.FC<{ x: number; y: number; rot?: number; s?: number; t: number }> = ({ x, y, rot = 0, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -30 0 L 30 0 L 34 70 L -34 70 Z" fill="#4E8A5A" stroke="#1E2A20" strokeWidth={4} />
    <path d="M -30 10 Q -10 -30 30 10" stroke="#1E2A20" strokeWidth={6} fill="none" />
    <path d="M 32 40 L 90 10 L 96 20 L 34 58 Z" fill="#3E7048" stroke="#1E2A20" strokeWidth={4} />
    {rot > 30
      ? Array.from({ length: 5 }).map((_, k) => <path key={k} d={`M ${96 + k * 3} ${16 + ((t * 9 + k * 13) % 40)} l 2 14`} stroke="#9FD3F0" strokeWidth={4} strokeLinecap="round" />)
      : null}
  </g>
);

export { NEIGHBOUR };
