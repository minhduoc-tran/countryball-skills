import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Schematic, SCH, FONT, Glow, Dust, LightVeil, Foreground, Bokeh, Sparkle, ShotProps, Pose,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { VILLAGE_GIRL } from './cast-looks';
import { VillageBg, GoldFloor, FamilyTable, GROUND_Y } from './chb-village-scenes';
import { Cake, EmptyChair, Blister } from './chb-icons-health';
import { NumCard } from './chb-cards-and-marks';

// Chapter B, "Thay đổi đầu tiên là trẻ em" (1/2): the children arrive in the new world, then today's numbers: 2022, 4,9 TRIỆU,
// the birthday cake with 5 candles beside an empty chair, and "chữa được" (a blister pack with a tick).

/** A kid hopping with both arms up, feet landing on the ground line. */
export const hopPose = (t: number, i: number, x: number, scale: number, o: Partial<Pose> = {}): Pose => {
  const ph = t / 5 + i * 1.7;
  const hop = Math.abs(Math.sin(ph)) * 34 * scale;
  return {
    ...poseAt(t, [{ f: 0, p: { x, y: GROUND_Y + 22 - 140 * scale, scale, yaw: 0.15 * (i - 1), look: 0.2, headTilt: Math.sin(ph) * 4 } }]),
    y: GROUND_Y + 22 - 140 * scale - hop,
    armL: { a: 128 + Math.sin(ph) * 22, b: 12 },
    armR: { a: 140 - Math.sin(ph) * 22, b: 12 },
    squash: Math.cos(ph * 1) > 0.9 ? 0.06 : -0.03,
    ...o,
  };
};

// ---------- B1: wide, the village at sunrise, three kids hop and wave, the golden floor under their feet ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 600, kf(t, [[0, 1.0], [len, 1.22]]))}>
    <VillageBg id="b1" t={t + 30} />
    <GoldFloor t={t} />
    <Hero look={VILLAGE_GIRL} pose={{ ...hopPose(t, 0, 760, 0.95), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
    <Hero look={LOOKS.sis} pose={{ ...hopPose(t, 1, 1010, 0.82), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
    <Hero look={LOOKS.mo} pose={{ ...hopPose(t, 2, 1250, 0.9), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={1} />
    <Sparkle x={880} y={400} t={t - 10} s={1.1} />
    <Sparkle x={1130} y={430} t={t - 18} s={0.9} />
  </g>
);

// ---------- B2: card "2022" ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="b2" to={2022} statik caption="NĂM">
    <Sparkle x={1260} y={250} t={t - 10} s={1.2} />
  </NumCard>
);

// ---------- B3: card "4,9 TRIỆU" counting up, five child icons, the last one fading ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="b3" to={4.9} dec={1} unit="TRIỆU" caption="TRẺ EM MẤT TRƯỚC 5 TUỔI" dur={30}>
    {[0, 1, 2, 3, 4].map((i) => (
      <PersonIcon key={i} x={760 + i * 100} y={880} s={0.95} o={i < 4 ? 0.9 : 0.9 * clamp(1 - (t - 14) / 16)} on={i < 4} />
    ))}
  </NumCard>
);

// ---------- B4: the birthday cake with 5 candles, an empty chair beside it, a limp balloon ----------
export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1080], [len, 1000]]), 700, kf(t, [[0, 1.0], [len, 1.18]]))}>
    <defs>
      <linearGradient id="b4wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A2438" />
        <stop offset="100%" stopColor="#3C3046" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1400} fill="url(#b4wall)" />
    <Bokeh seed={4} n={9} x0={0} y0={60} w={1900} h={420} t={t} o={0.5} />
    <rect x={-400} y={1010} width={2720} height={400} fill="#2A1E24" />
    <EmptyChair x={1480} y={1020} s={1.05} t={t} />
    <FamilyTable x={800} y={780} w={1000} />
    <Glow x={800} y={600} r={520} o={0.8} />
    <Cake x={800} y={772} s={1.0} t={t} />
    <LightVeil id="b4v" lights={[[800, 620, 560], [1480, 780, 200]]} o={0.5} />
    <Glow x={800} y={600} r={380} o={0.55} />
    <Dust t={t} seed={9} x0={400} y0={300} w={900} h={500} n={14} o={0.5} />
  </g>
);

// ---------- B5: "chữa được": a blister pack with a green tick drawing on ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const tick = easeOut(clamp((t - 18) / 9));
  const badge = backOut(clamp((t - 14) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
      <Schematic t={t} id="b5" />
      <Glow x={900} y={470} r={520} kind="cool" o={0.35} />
      <Blister id="b5bl" x={900} y={470} s={1.9} rot={-8 + Math.sin(t / 18) * 2} popped={0} shine={clamp((t - 6) / 24)} />
      <g transform={`translate(1230 280) scale(${badge})`}>
        <circle r={96} fill="#2FBF71" style={{ filter: 'drop-shadow(0 0 22px #2FBF71AA)' }} />
        <path d="M -44 4 L -14 36 L 48 -34" stroke="#E9FFF2" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} />
      </g>
      <text x={900} y={850} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill={SCH.line} letterSpacing={6} opacity={easeOut(clamp((t - 3) / 8))}>
        CHỮA ĐƯỢC
      </text>
      <Sparkle x={620} y={260} t={t - 12} s={1.1} />
      <Foreground blur={10}><rect x={-100} y={1040} width={2200} height={200} fill="#070B14" /></Foreground>
    </g>
  );
};
