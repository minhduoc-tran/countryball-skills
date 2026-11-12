import React from 'react';
import {
  Hero, Pose, basePose, LOOKS, faceAt, kf, clamp, easeOut, easeIn, backOut, joints, toWorld, shake, Gauge, FONT, SCH, ShotProps, Glow,
} from '../../engine';
import { GridPerson } from '../khong-ai-ngheo/cha-number-card-props';
import { BigStat, Cap } from '../khong-ai-ngheo/cha-number-card-props';
import { StickyNote, INK } from './chc-note-and-object-props';
import { ThermoIcon, GradeSheet } from './chc-icon-props';
import { StressChart, CardFrame, stressXY, ORANGE } from './chc-chart-props';

// Chapter C, "4 tice" part 1 (105.43-124.5 s): C1 the year 1997, C2 two psychologists, C3 students followed through a semester,
// C4 a relaxed Pip early in term, C5 the chart's early part (procrastinators calmer), C6 the end of term (their line shoots up),
// C7 a thermometer and a lower grade, C8 "ĐÓ LÀ THẬT". Look "memory" on all of them (sepia study cards).

const WHITE_COAT = { ...LOOKS.mom, jacket: '#EEF1F4', jacketShade: '#C9D0D8', accent: '#3E8C86' };

// ---------- C1: card: the year rolls up to 1997 with the source tag ----------
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const yr = 1900 + Math.round(97 * easeOut(clamp(t / 16)));
  return (
    <CardFrame t={t} len={len} id="c1sc" z0={1.0} z1={1.08}>
      <Glow x={960} y={520} r={760} o={0.35} />
      <BigStat x={960} y={640} t={t} text={String(yr)} size={340} />
      <path d="M 560 706 H 1360" stroke={SCH.live} strokeWidth={8} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={800 * (1 - easeOut(clamp((t - 12) / 12)))} />
      <Cap x={960} y={800} t={t - 18} text="TICE & BAUMEISTER, 1997" size={46} color={SCH.line} />
      {/* a clipboard and a pencil, top left, as the study's icon */}
      <g transform={`translate(430 300) rotate(-8) scale(${backOut(clamp((t - 6) / 8))})`} stroke={SCH.line} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round">
        <rect x={-70} y={-90} width={140} height={180} rx={12} /><rect x={-28} y={-108} width={56} height={32} rx={8} fill={SCH.ground} />
        <path d="M -40 -30 H 40 M -40 6 H 40 M -40 42 H 10" opacity={0.8} />
      </g>
    </CardFrame>
  );
};

// ---------- C2: two psychologists with clipboards, glasses, writing ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const mk = (x: number, yaw: number, facing: 1 | -1, k: number): Pose => ({
    ...basePose, x, y: 660, scale: 1.5, yaw, facing, look: -facing * 0.4, headTilt: -facing * 3,
    armL: { a: 12, b: 4 }, armR: { a: 62, b: 76 + 5 * Math.sin(t / 2.2 + k) }, ...faceAt(t, [[0, 'neutral'], [18, 'happy']]),
  });
  const pops = (k: number) => backOut(clamp((t - 2 - k * 4) / 8));
  const pa = mk(720, 0.55, 1, 0);
  const pb = mk(1200, -0.55, -1, 1);
  const board = (p: Pose, k: number, flip: number) => {
    const h = toWorld(p, joints(p).armR.end);
    return (
      <g transform={`translate(${h.x + flip * 8} ${h.y - 18}) rotate(${flip * 8})`}>
        <rect x={-46} y={-62} width={92} height={124} rx={8} fill="#8A5A3C" stroke={INK} strokeWidth={4} />
        <rect x={-36} y={-48} width={72} height={100} fill="#F6EFE3" /><rect x={-16} y={-68} width={32} height={14} rx={4} fill="#C9CBD6" />
        <path d={`M -24 -24 H ${-24 + 48 * clamp((t - 4 - k * 6) / 12)} M -24 0 H ${-24 + 40 * clamp((t - 14 - k * 6) / 12)}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <CardFrame t={t} len={len} id="c2sc" cx={960} cy={560} z0={1.0} z1={1.07}>
      <g transform={`translate(0 ${(1 - pops(0)) * 40})`} opacity={pops(0)}><Hero look={LOOKS.suit} pose={pa} rimId="rimR" shadow={0} />{board(pa, 0, 1)}</g>
      <g transform={`translate(0 ${(1 - pops(1)) * 40})`} opacity={pops(1)}><Hero look={WHITE_COAT} pose={pb} rimId="rimL" shadow={0} />{board(pb, 1, -1)}</g>
      <ellipse cx={720} cy={878} rx={120} ry={14} fill="#000" opacity={0.35} /><ellipse cx={1200} cy={878} rx={120} ry={14} fill="#000" opacity={0.35} />
      <Cap x={960} y={990} t={t - 16} text="TICE & BAUMEISTER, 1997" size={40} color={SCH.dim} />
    </CardFrame>
  );
};

// ---------- C3: a row of students under a magnifier, a semester timeline filling ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const scan = kf(t, [[0, 0], [len, 1]]);
  const mx = 420 + scan * 1080;
  const bar = clamp(t / len);
  return (
    <CardFrame t={t} len={len} id="c3sc" z0={1.02} z1={1.0}>
      {Array.from({ length: 8 }).map((_, i) => <GridPerson key={i} x={440 + i * 148} y={410} s={2.1} dim={0} pop={backOut(clamp((t - i * 1.5) / 7))} />)}
      <g transform={`translate(${mx} ${400 + Math.sin(t / 5) * 6})`}>
        <circle r={96} fill="#7FD4FF" opacity={0.12} stroke="#7FD4FF" strokeWidth={9} />
        <path d="M 68 68 L 130 130" stroke="#7FD4FF" strokeWidth={16} strokeLinecap="round" />
      </g>
      <text x={400} y={640} fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill={SCH.dim} letterSpacing={4}>HỌC KỲ</text>
      <rect x={400} y={680} width={1120} height={34} rx={17} fill="#fff" opacity={0.12} />
      <rect x={400} y={680} width={1120 * bar} height={34} rx={17} fill={SCH.live} />
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${400 + i * 70 + 35} 730 v 18`} stroke={SCH.dim} strokeWidth={4} />)}
      <circle cx={400 + 1120 * bar} cy={697} r={22} fill="#FFE27A" stroke="#fff" strokeWidth={4} />
    </CardFrame>
  );
};

// ---------- C4: Pip early in the term: arms behind head, calm; the stress gauge sits low; a MAI LÀM note on the wall ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = {
    ...basePose, x: 720, y: 660, scale: 1.55, yaw: 0.4, facing: 1, look: 0.5, headTilt: 5 + 2 * Math.sin(t / 14), tilt: -3,
    armL: { a: 128, b: -118 }, armR: { a: 128, b: -118 }, legL: { a: 8, b: 0 }, legR: { a: -6, b: 0 }, ...faceAt(t, [[0, 'happy']]),
  };
  const g = 0.12 + 0.03 * Math.sin(t / 9);
  return (
    <CardFrame t={t} len={len} id="c4sc" cx={1000} cy={560} z0={1.0} z1={1.07}>
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" shadow={0} />
      <ellipse cx={720} cy={890} rx={130} ry={14} fill="#000" opacity={0.35} />
      <g transform={`translate(1130 520) scale(${backOut(clamp((t - 8) / 8))})`}><Gauge x={-200} y={0} w={560} p={g} label="CĂNG THẲNG" /></g>
      <g transform={`translate(0 ${Math.sin(t / 11) * 8})`}><StickyNote x={1480} y={300} lines={['MAI', 'LÀM']} s={0.9} rot={6} /></g>
      <Cap x={1130} y={700} t={t - 12} text="ĐẦU KỲ" size={52} color={SCH.line} />
    </CardFrame>
  );
};

// ---------- C5: chart, first half of the term: the procrastinators' line sits UNDER the others ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / (len - 8)));
  const a = stressXY(0.5 * k, 'p');
  const happy = backOut(clamp((t - 22) / 8));
  return (
    <CardFrame t={t} len={len} id="c5sc" cx={900} cy={540} z0={1.0} z1={1.06}>
      <StressChart t={t} pa={0.5 * k} pb={0.5 * k} />
      <g transform={`translate(${a.x + 70} ${a.y + 50}) scale(${happy})`}>
        <circle r={44} fill="#FFE27A" stroke={INK} strokeWidth={5} /><circle cx={-15} cy={-10} r={5} fill={INK} /><circle cx={15} cy={-10} r={5} fill={INK} />
        <path d="M -20 12 Q 0 32 20 12" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </CardFrame>
  );
};

// ---------- C6: end of term: the orange line shoots up past the others (on "họ căng thẳng hơn"), red pulse, shake ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const rise = easeIn(clamp((t - 32) / 26));
  const pa = 0.5 + 0.5 * rise;
  const pb = 0.5 + 0.5 * clamp(t / (len - 4));
  const s = shake(t, 56, 14, 9);
  const tip = stressXY(pa, 'p');
  return (
    <CardFrame t={t} len={len} id="c6sc" cx={kf(t, [[0, 1000], [len, 1200]])} cy={kf(t, [[0, 560], [len, 400]])} z0={1.04} z1={1.3}>
      <g transform={`translate(${s.x} ${s.y})`}>
        <StressChart t={t} pa={pa} pb={pb} />
        {rise > 0.9 ? <Glow x={tip.x} y={tip.y} r={380} kind="red" o={0.6} /> : null}
        {rise > 0.9 ? <text x={tip.x - 120} y={tip.y - 36} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={96} fill="#FF5A4A" stroke="#1A1230" strokeWidth={8} paintOrder="stroke" transform={`rotate(-8 ${tip.x - 120} ${tip.y})`}>!!</text> : null}
      </g>
    </CardFrame>
  );
};

// ---------- C7: a thermometer climbs (ốm nhiều hơn), then a marked sheet with a low grade (điểm thấp hơn) ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const shiver = Math.sin(t * 2.4) * 2.5 * clamp((t - 6) / 4);
  return (
    <CardFrame t={t} len={len} id="c7sc" z0={1.0} z1={1.06}>
      <g transform={`translate(${shiver} 0)`}><ThermoIcon x={640} y={500} t={t} s={1.55} p={easeOut(clamp((t - 4) / 18))} /></g>
      <GradeSheet x={1280} y={500} t={t - 29} s={1.5} />
      <path d="M 960 300 V 700" stroke={SCH.dim} strokeWidth={3} strokeDasharray="6 14" opacity={0.5} />
    </CardFrame>
  );
};

// ---------- C8: "ĐÓ LÀ THẬT": a stamp slams down ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 5));
  const sc = 2.4 - 1.4 * k;
  const sh = shake(t, 5, 8, 12);
  return (
    <CardFrame t={t} len={len} id="c8sc" z0={1.0} z1={1.05}>
      <Glow x={960} y={540} r={700} o={0.4 * k} />
      <g transform={`translate(${960 + sh.x} ${600 + sh.y}) rotate(-5) scale(${sc})`} opacity={clamp(t / 2)}>
        <rect x={-640} y={-170} width={1280} height={240} rx={26} fill="none" stroke="#FF5A4A" strokeWidth={14} />
        <text textAnchor="middle" y={44} fontFamily={FONT.title} fontWeight={900} fontSize={190} fill="#FF5A4A" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">ĐÓ LÀ THẬT</text>
      </g>
    </CardFrame>
  );
};
