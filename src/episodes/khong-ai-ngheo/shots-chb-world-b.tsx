import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Sparkle, Bokeh, Foreground, ShotProps } from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { VILLAGE_GIRL } from './cast-looks';
import { VillageBg, GoldFloor, GROUND_Y } from './chb-village-scenes';
import { SchoolBag, SchoolLine, SchoolGate } from './chb-props-world';
import { NumCard, TickStamp, LookArm } from './chb-cards-and-marks';

// Chapter B, "Khắp thế giới..." (2/2): a school bag handed to a child who never went to class, the card "250 TRIỆU" children
// out of school, the school gate shut, and the green tick "Đó là thật".

const PIP = LOOKS.pipHood;

// ---------- B16: insert, a hand holds a school bag up by its handle; it sways and shines ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const sw = Math.sin(t / 7) * 4 * clamp(1 - t / 40) + 1;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
      <rect x={-300} y={-300} width={2520} height={1500} fill="#3A4A5E" />
      <Bokeh seed={16} n={12} x0={0} y0={40} w={1920} h={700} t={t} o={0.6} />
      <Glow x={960} y={560} r={720} o={0.7} />
      <g transform={`rotate(${sw} 1010 250)`}>
        <SchoolBag x={1010} y={600} s={2.05} />
        <LookArm look={PIP} x={1010} y={270} fx={1700} fy={-120} rot={-20} s={4.2} width={100} fist />
      </g>
      <Sparkle x={780} y={420} t={t - 8} s={1.2} />
      <Sparkle x={1250} y={560} t={t - 15} s={1} />
      <Foreground blur={14}><rect x={-100} y={1040} width={2200} height={200} fill="#0A1018" /></Foreground>
    </g>
  );
};

// ---------- B17: medium, the girl who never went to class takes the bag, hugs it, hops ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const g = GROUND_Y + 22;
  const come = easeOut(clamp(t / 16));
  const hug = easeOut(clamp((t - 14) / 8));
  const hop = t > 24 ? Math.abs(Math.sin((t - 24) / 3.2)) * 22 * clamp(1 - (t - 24) / 24) : 0;
  const pose = poseAt(t, [
    { f: 0, p: { x: 1020, y: g - 140, scale: 1, yaw: -0.2, look: -0.4, armL: { a: 40, b: 30 }, armR: { a: 40, b: 30 } } },
    { f: 14, p: { armL: { a: 55, b: 40 }, armR: { a: 55, b: 40 } } },
    { f: 24, p: { armL: { a: 38, b: 96 }, armR: { a: 38, b: 96 }, look: 0.1 } },
  ]);
  const bx = 360 + come * 520 + hug * 140;
  const by = 690 - hug * 14;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 600, kf(t, [[0, 1.25], [len, 1.45]]))}>
      <VillageBg id="b17" t={t + 20} sunX={1520} />
      <GoldFloor t={t} />
      <Hero look={VILLAGE_GIRL} pose={{ ...pose, y: pose.y - hop, ...faceAt(t, [[0, 'neutral'], [16, 'happy']]) }} rimId="rimR" shadow={1} />
      <SchoolBag x={bx} y={by - hop} s={0.62} rot={-8 + hug * 8} />
      {hug < 1 ? <LookArm look={PIP} x={bx - 70} y={by - 20} fx={-260} fy={780 - come * 40} rot={-84} s={3.4} width={84} /> : null}
      {t > 20 ? <Sparkle x={1100} y={420} t={t - 20} s={1.3} /> : null}
    </g>
  );
};

// ---------- B18: card "250 TRIỆU": a school on the left, small figures standing outside it ----------
export const B18: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="b18" to={250} unit="TRIỆU" caption="TRẺ EM NGOÀI TRƯỜNG" cx={1200} dur={40}>
    <SchoolLine x={440} y={400} s={2.0} t={t} />
    {[0, 1, 2, 3, 4].map((i) => (
      <PersonIcon key={i} x={250 + i * 90} y={690 + (i % 2) * 14} s={0.75} o={0.5 + 0.2 * Math.sin(t / 8 + i)} />
    ))}
    <path d="M 220 640 H 660" stroke="#7E8DA6" strokeWidth={4} strokeDasharray="10 12" />
  </NumCard>
);

// ---------- B19: the school gate, shut and padlocked; a small bag waits on the step ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 960]]), 620, kf(t, [[0, 1.0], [len, 1.16]]))}>
    <VillageBg id="b19" t={t + 40} sunX={300} />
    <GoldFloor y={GROUND_Y + 2} t={t} o={0.0} />
    <SchoolGate x={1000} y={GROUND_Y + 20} t={t} />
    <SchoolBag x={520} y={GROUND_Y - 30} s={0.5} rot={-12} />
  </g>
);

// ---------- B20: the green tick "Đó là thật." ----------
export const B20: React.FC<ShotProps> = ({ t }) => <TickStamp t={t} id="b20" />;
