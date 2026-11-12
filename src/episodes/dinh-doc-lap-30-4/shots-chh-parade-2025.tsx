import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { hop } from '../../countryball/ball-motion';
import { FlagCloth } from '../../countryball/flag-cloth';
import { PalacePlan, PlanTank, palaceRoute } from '../../countryball/palace-plan';
import { cameraOnPalace, localToScreen } from '../../countryball/palace-geometry';
import { cameraAt } from '../../countryball/geo-camera';
import { SourceLine } from '../../countryball/hud-chips';
import { SAIGON_ATTRIBUTION } from '../../countryball/sai-gon-map-labels';
import { Slam, Veil } from './cha-common';
import { Cap, Confetti, Firework, Photo, Stage, Tag, prog } from './chh-common';
import { ParadeAvenue } from './chh-parade-scene';

// Chapter H, part 3 (10:05-10:16, beat "12c fifty years"): H13 2025 = 50 năm, H14 the avenue (2014 print), H15 the same road: 1975 tanks, then 2025 balls
// with flags (plan view), H16 the parade (balls with flags, confetti), H17 fireworks over the avenue, no gunfire. There is NO parade photo: this is animation.
// Sound: pop on the confetti burst of H13, sparkle on the fireworks (H17); no weapons sounds anywhere.

/** Ball with a pole flag (VNM), hopping; (x, y) = ball centre. */
const FlagBall: React.FC<{ id: string; t: number; x: number; y: number; r: number; ph?: number; side?: 1 | -1 }> = ({ id, t, x, y, r, ph = 0, side = 1 }) => (
  <g>
    <line x1={x + side * r * 0.95} y1={y + r * 0.3} x2={x + side * r * 0.95} y2={y - r * 2.1} stroke="#1B1B1E" strokeWidth={6} strokeLinecap="round" />
    <g transform={side === -1 ? `translate(${2 * (x - r * 0.95)},0) scale(-1,1)` : undefined}>
      <FlagCloth id={`${id}-f`} x={x + r * 0.95 + 2} y={y - r * 2.1} w={r * 1.5} h={r} kind="VNM" wave={0.9} t={t + ph} />
    </g>
    <Ball id={id} x={x} y={y} r={r} flag="VNM" eyes="happy" motion={hop(t, 28, r * 0.3, ph)} />
  </g>
);

/** H13 "Năm 2025, tròn 50 năm," a big year, fireworks, confetti. */
export const H13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h13" tone="night" />
    <Firework t={t} at={4} x={420} y={300} color="#FFD43B" />
    <Firework t={t} at={20} x={1520} y={260} color="#E0483C" />
    <Firework t={t} at={38} x={960} y={190} color="#6FB6E8" r={230} />
    <Firework t={t} at={58} x={1650} y={420} color="#FFD43B" r={160} />
    <Slam t={t} a={6} x={960} y={540} size={310}>2025</Slam>
    <Cap t={t} at={30} x={960} y={700} text="TRÒN 50 NĂM" size={116} color="#FFE08A" />
    <FlagBall id="h13a" t={t} x={250} y={910} r={100} />
    <FlagBall id="h13b" t={t} x={1590} y={910} r={100} ph={9} />
    <Confetti t={t} n={60} o={prog(t, 10, 24)} />
  </g>
);

/** H14 "đoàn diễu binh lại đi qua chính con đường" the avenue itself, a 2014 print. */
export const H14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h14" tone="dusk" />
    <Photo k="avenue" t={t} x={960} y={585} w={1200} rot={-1} from={0.05} fromSide="right" kb={{ z0: 1.0, z1: 1.12, px0: 0.01, py0: 0, px1: -0.01, py1: 0 }} />
    <Tag t={t} at={12} x={960} y={95} text="ĐƯỜNG LÊ DUẨN" fill="#2F6B4A" size={52} />
  </g>
);

const AVENUE: [number, number][] = [[900, 0], [170, 0]];

/** H15 "mà những chiếc xe tăng đã đi qua." plan view of the avenue: the 1975 column drives to the palace, the 2025 balls follow the same line. */
export const H15: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, cam = cameraAt([{ t: 0, ...cameraOnPalace(520, 0, 1.6), ease: 'linear' }, { t: 2.0, ...cameraOnPalace(400, 0, 1.9), ease: 'linear' }], s);
  const lead = 0.48 + 0.0042 * t;
  const tanks: PlanTank[] = [0, 1, 2].map((i) => { const p = palaceRoute(AVENUE, Math.max(0, lead - i * 0.075)); return { x: p.x, y: p.y, heading: p.heading, kind: i === 0 ? 'type59' : 't54', scale: 2.6 }; });
  const balls = Array.from({ length: 6 }, (_, i) => ({ i, u: lead - 0.3 - i * 0.06 })).filter((b) => b.u > 0.02);
  const tag = (u: number) => { const p = palaceRoute(AVENUE, u), q = localToScreen(cam, p.x, p.y); return q; };
  const tq = tag(lead), bq = tag(Math.max(0.05, lead - 0.42));
  return (
    <g>
      <PalacePlan id="h15" camera={cam} t={t} tanks={tanks} labels={['streets', 'palace']} />
      {balls.map(({ i, u }) => { const p = palaceRoute(AVENUE, u), q = localToScreen(cam, p.x, p.y); return <FlagBall key={i} id={`h15b${i}`} t={t} x={q[0]} y={q[1]} r={40} ph={i * 6} />; })}
      <Veil id="h15" o={0.3} />
      <Tag t={t} at={4} x={tq[0]} y={tq[1] - 150} text="1975" fill="#9B4C3A" size={44} />
      <Tag t={t} at={20} x={bq[0]} y={bq[1] - 130} text="2025" fill="#2F6B4A" size={44} />
      <SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />
    </g>
  );
};

/** H16 "Lần này, trong tiếng reo hò" the parade: balls with flags march along the avenue, garlands, confetti. */
export const H16: React.FC<ShotProps> = ({ t }) => (
  <g>
    <ParadeAvenue id="h16" t={t} />
    <Confetti t={t} n={80} o={prog(t, 0, 12)} />
    <Veil id="h16" o={0.25} />
    <Cap t={t} at={6} x={960} y={1030} text="TIẾNG REO HÒ" size={88} />
  </g>
);

/** H17 "và những lá cờ, không còn tiếng súng." night, fireworks over the avenue. */
export const H17: React.FC<ShotProps> = ({ t }) => (
  <g>
    <ParadeAvenue id="h17" t={t + 40} night />
    <Firework t={t} at={2} x={620} y={190} color="#FFD43B" r={170} />
    <Firework t={t} at={14} x={1320} y={150} color="#E0483C" r={190} />
    <Firework t={t} at={30} x={960} y={110} color="#FFFFFF" r={150} />
    <Firework t={t} at={44} x={1560} y={260} color="#6FB6E8" r={150} />
    <Confetti t={t} n={40} o={0.8} seed={8} />
    <Veil id="h17" o={0.3} />
    <Cap t={t} at={4} x={960} y={1030} text="KHÔNG CÒN TIẾNG SÚNG" size={80} />
  </g>
);
