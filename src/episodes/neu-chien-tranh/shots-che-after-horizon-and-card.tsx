import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, backOut, LOOKS, LEG_LEN, Glow, Dust, FONT,
  Rooftop, Schematic, SchLabel, SCH, UI, ShotProps,
} from '../../engine';
import { TickStamp } from '../khong-ai-ngheo/chb-cards-and-marks';
import { Birds, SmokeWisps, HatchedVietnam } from './che-props-field-and-deminers';

// Chapter E, "after" part 1 (230.6-243.9 s): E1 the guns stop (a silent horizon, smoke thinning, birds), E2 "the war is not
// over" (Pip's worried face), E3-E6 Vietnam on the blueprint: more than 50 years later, about a fifth of the country
// still hides unexploded ordnance (VNMAC), E7 the "Đó là thật" tick. The card shots carry the "memory" look.

const PIP = LOOKS.pipHood;
const FEET = 842;

// ---------- E1: wide: Pip on the roof at dawn, the horizon silent, thin smoke fading, birds coming back ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.0;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 700, y: FEET - LEG_LEN * sc, scale: sc, yaw: 0.6, facing: 1, look: 0.7, tilt: 1, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, sway: 4 } },
    { f: len, p: { headTilt: -3, tilt: -1 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1000]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={t + 40} sunX={1260} sunY={690} cityLit={0.6} />
      <SmokeWisps t={t} xs={[900, 1080, 1470]} y={735} thin={kf(t, [[0, 0.05], [len, 0.8]])} />
      <Birds t={t + 30} seed={7} x0={-200} y0={190} w={2500} h={230} n={6} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <Glow x={1260} y={690} r={560} o={0.35} />
      <Dust t={t} seed={11} x0={400} y0={300} w={1200} h={500} n={18} o={0.35} />
    </g>
  );
};

// ---------- E2: close-up: Pip's face as the quiet turns heavy; a last column of smoke blurred behind ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.2;
  const pose: Pose = {
    ...basePose, x: 800, y: 470 + 176 * sc, scale: sc, yaw: 0.55, facing: 1, headTilt: kf(t, [[0, 3], [len, -3]]), look: kf(t, [[0, 0.5], [len, 0.9]]),
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3, blink: t > 26 && t < 36 ? Math.sin(((t - 26) / 10) * Math.PI) : 0,
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -260) scale(1.4)">
          <Rooftop t={t + 80} sunX={1240} sunY={690} cityLit={0.6} />
          <SmokeWisps t={t} xs={[1000, 1180, 1470]} y={735} thin={0.45} />
        </g>
      </g>
      <Glow x={1500} y={600} r={760} o={0.4} />
      <g transform={`translate(0 ${kf(t, [[0, 0], [len, -18]])})`}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [22, 'worried']]) }} rimId="rimR" shadow={0} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#1A1030" opacity={kf(t, [[0, 0.04], [len, 0.22]])} />
    </g>
  );
};

/** The Vietnam card's shared frame: blueprint, a slow push, then `children`. */
const Card: React.FC<{ t: number; len: number; id: string; children: React.ReactNode }> = ({ t, len, id, children }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
    <Schematic t={t} id={id} />
    {children}
  </g>
);

const SourceTag: React.FC<{ t: number }> = ({ t }) => (
  <g opacity={easeOut(clamp(t / 8))}>
    <rect x={90} y={940} width={330} height={60} rx={30} fill={UI.pill} opacity={0.85} />
    <text x={255} y={981} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={SCH.dim} letterSpacing={2}>NGUỒN: VNMAC</text>
  </g>
);

// ---------- E3: the Vietnam outline draws on over the blueprint ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => (
  <Card t={t} len={len} id="e3sch">
    <HatchedVietnam id="e3vn" t={t} x={760} y={100} s={0.98} hatch={0} />
    <SchLabel x={1330} y={520} t={t - 14} text="VIỆT NAM" size={96} />
    <SchLabel x={1330} y={590} t={t - 20} text="NƯỚC MÌNH" size={44} color={SCH.dim} />
  </Card>
);

// ---------- E4: "> 50 NĂM SAU": the years count up beside a small outline ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const v = Math.round(50 * easeOut(clamp(t / 22)));
  const pop = 0.92 + 0.08 * backOut(clamp((t + 2) / 8));
  return (
    <Card t={t} len={len} id="e4sch">
      <HatchedVietnam id="e4vn" t={t} x={1290} y={230} s={0.62} hatch={0} />
      <g transform={`translate(560 500) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{`> ${v}`}</text>
      </g>
      <text x={560} y={650} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={128} fill={SCH.line} letterSpacing={6} opacity={easeOut(clamp((t - 6) / 7))}>NĂM SAU</text>
      <text x={560} y={730} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim} letterSpacing={2} opacity={easeOut(clamp((t - 14) / 8))}>KỂ TỪ KHI TIẾNG SÚNG DỪNG</text>
    </Card>
  );
};

// ---------- E5: "≈ 1/5 DIỆN TÍCH": a fifth of the outline hatches in ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => (
  <Card t={t} len={len} id="e5sch">
    <HatchedVietnam id="e5vn" t={t} x={420} y={100} s={0.98} hatch={clamp(t / 30)} />
    <g transform={`translate(0 0) scale(${0.92 + 0.08 * backOut(clamp((t + 2) / 8))})`} style={{ transformOrigin: '1330px 500px' }}>
      <text x={1330} y={470} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={240} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>≈ 1/5</text>
    </g>
    <text x={1330} y={612} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill={SCH.line} letterSpacing={5} opacity={easeOut(clamp((t - 8) / 7))}>DIỆN TÍCH</text>
    <SourceTag t={t - 18} />
  </Card>
);

// ---------- E6: the hatched land hides what is under it; warning marks blink in ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <Card t={t} len={len} id="e6sch">
    <HatchedVietnam id="e6vn" t={t + 30} x={420} y={100} s={0.98} hatch={1} warn />
    <SchLabel x={1330} y={430} t={t - 4} text="BOM MÌN" size={110} color={SCH.live} />
    <SchLabel x={1330} y={540} t={t - 12} text="CHƯA NỔ" size={110} color={SCH.line} />
    <SchLabel x={1330} y={630} t={t - 24} text="nằm dưới lòng đất" size={46} color={SCH.dim} />
    <SourceTag t={t} />
  </Card>
);

// ---------- E7: "Đó là thật": the green tick stamp ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
    <TickStamp t={t} id="e7sch" sub="NGUỒN: VNMAC · ĐIỀU TRA 2014" />
  </g>
);
