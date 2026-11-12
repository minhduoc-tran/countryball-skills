import React from 'react';
import { Hero, LOOKS, Bicycle, bikePose, poseAt, faceAt, kf, camT, clamp, easeOut, backOut, rnd, Foreground, FocusRings, Sparkle, Schematic, SCH, FONT, ShotProps } from '../../engine';
import { Anchor } from './kit-dry-seabed';
import { BigNum } from './kit-hud';
import { PAL } from './kit-palette';
import { Fish } from '../sun-disappeared/chd-ocean-props';
import { LookArm } from '../khong-ai-ngheo/chb-cards-and-marks';
import { Rod, standAt } from './chb-cast-helpers';
import { CableRun, Seabed } from './chb-seabed-props';

// Chapter B, bikes + anchor + Internet (B18-B23, 102.88-117.50 s): Pip and Mo ride down the shelf, find a rusty anchor, Pip's
// phone still loads, "> 99%" of data, the cable under the sea, and the same cable lying in the desert.

// ---------- B18: Pip and Mo pedal down the continental shelf (camera tracks them, dust behind the wheels) ----------
export const B18: React.FC<ShotProps> = ({ t, len }) => {
  const p = t / len;
  const sc = 0.62 + 0.2 * p;
  const x = 260 + t * 15;
  const y = 770 + t * 3.4;
  const mx = x - 215 * sc;
  const my = y - 6;
  const pip = { ...bikePose(t, x, y, sc), expr: 'happy' as const };
  const mo = { ...bikePose(t + 4, mx, my, sc), expr: 'neutral' as const };
  return (
    <g transform={camT(x + 190, kf(t, [[0, 760], [len, 840]]), 1.2)}>
      <Seabed id="b18" t={t} haze={0.25} />
      {Array.from({ length: 9 }).map((_, i) => {
        const age = (t * 0.9 + i * 4) % 36;
        const px = x - 40 - age * 14;
        return <ellipse key={i} cx={px} cy={y - 8 - age * 0.7} rx={20 + age * 2.4} ry={10 + age * 1.3} fill="#E9D3A3" opacity={0.5 * (1 - age / 36)} />;
      })}
      <Rod x={mo.x} y={mo.y} s={sc} t={t} />
      <Bicycle x={mx} y={my} s={sc} t={t + 4} color="#3E9C6B" />
      <Hero look={LOOKS.mo} pose={mo} rimId="rimR" shadow={0} />
      <Bicycle x={x} y={y} s={sc} t={t} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B19: the rusty anchor stands in the mud; Pip points, Mo stares ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.85;
  const pop = backOut(clamp((t - 2) / 9));
  const pip = poseAt(t, [
    { f: 0, p: standAt(660, 1010, sc, { yaw: 0.5, armR: { a: 12, b: -6 }, tilt: -2 }) },
    { f: 12, p: { armR: { a: 112, b: -4 }, tilt: 3 } },
    { f: 16, p: { armR: { a: 104, b: -6 } } },
  ]);
  const mo = poseAt(t, [{ f: 0, p: standAt(1430, 1020, sc, { yaw: -0.5, armR: { a: 14, b: -30 }, facing: -1 }) }]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), kf(t, [[0, 800], [len, 770]]), kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Seabed id="b19" t={t} haze={0.2} />
      <Bicycle x={330} y={900} s={0.55} facing={1} t={0} shadow={1} />
      <Bicycle x={1700} y={890} s={0.5} facing={-1} t={0} color="#3E9C6B" />
      <g transform={`translate(1040 1000) scale(1) translate(-1040 -1000)`} opacity={clamp((t - 1) / 3)}>
        <g transform={`translate(1040 1000) scale(${pop}) translate(-1040 -1000)`}>
          <Anchor x={1040} y={1000} s={1.35} rot={-4} />
        </g>
      </g>
      <Rod x={mo.x} y={mo.y} s={sc} facing={-1} t={t} />
      <Hero look={LOOKS.mo} pose={{ ...mo, ...faceAt(t, [[0, 'neutral'], [14, 'shock']]) }} rimId="rimL" shadow={1} />
      <Hero look={LOOKS.pipHood} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [10, 'happy']]) }} rimId="rimR" shadow={1} />
      <Sparkle x={1000} y={760} t={t - 12} s={1.3} />
      <Sparkle x={1110} y={880} t={t - 20} s={1} />
      <FocusRings x={1040} y={760} t={t - 6} r0={90} color="#FFE7B3" />
    </g>
  );
};

// ---------- B20: Pip's phone, held up in the desert: the page loads, the signal is full ----------
const PhoneScreen: React.FC<{ t: number }> = ({ t }) => {
  const load = easeOut(clamp((t - 4) / 20));
  const done = t >= 26;
  const ok = backOut(clamp((t - 26) / 8));
  return (
    <g>
      <rect x={-170} y={-350} width={340} height={700} rx={24} fill="#F6F8FB" />
      <rect x={-170} y={-350} width={340} height={64} rx={24} fill="#E4E9F0" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={86 + i * 16} y={-322 - i * 6} width={10} height={10 + i * 6} rx={2} fill="#2D3138" />)}
      <rect x={-148} y={-270} width={296} height={36} rx={18} fill="#FFFFFF" stroke="#C5CCD8" strokeWidth={2} />
      <rect x={-148} y={-272} width={296 * load} height={6} rx={3} fill="#2FBF71" />
      <rect x={-148} y={-216} width={296} height={170} rx={14} fill={done ? '#8FD0F0' : '#DDE3EC'} />
      {done ? <path d="M -30 -168 L 40 -130 L -30 -92 Z" fill="#FFFFFF" /> : <circle cx={0} cy={-131} r={26} fill="none" stroke="#9AA6B8" strokeWidth={7} strokeDasharray="30 100" transform={`rotate(${t * 18} 0 -131)`} />}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-148} y={-26 + i * 44} width={i % 2 ? 220 : 296} height={22} rx={6} fill="#DDE3EC" opacity={clamp((t - 8 - i * 3) / 4)} />)}
      <g transform={`translate(0 270) scale(${ok})`}>
        <rect x={-130} y={-36} width={260} height={72} rx={36} fill="#2FBF71" />
        <path d="M -84 2 L -62 24 L -26 -16" stroke="#E9FFF2" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(40 0)" stroke="#E9FFF2" strokeWidth={7} fill="none" strokeLinecap="round">
          <path d="M -34 -6 Q 0 -34 34 -6" /><path d="M -20 8 Q 0 -8 20 8" /><circle cx={0} cy={22} r={3} fill="#E9FFF2" />
        </g>
      </g>
    </g>
  );
};
export const B20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Foreground blur={10}>
      <Seabed id="b20" t={t} haze={0.3} />
    </Foreground>
    <g transform={`translate(1000 ${570 + Math.sin(t / 12) * 6}) rotate(-6)`}>
      <ellipse cx={20} cy={400} rx={200} ry={20} fill="#000" opacity={0.2} />
      <rect x={-188} y={-368} width={376} height={736} rx={42} fill="#1B1B22" stroke="#4A4858" strokeWidth={6} />
      <PhoneScreen t={t} />
    </g>
    <LookArm look={LOOKS.pipHood} x={1200} y={900} fx={1720} fy={1300} rot={215} s={6.2} width={130} />
  </g>
);

// ---------- B21: "> 99%" of intercontinental data, two continents joined by an arc of pulses ----------
const Blob: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <path d="M -90 30 Q -110 -40 -40 -70 Q 20 -100 70 -50 Q 110 -10 80 40 Q 20 80 -90 30 Z" fill="#3E6B4B" stroke="#9CC79A" strokeWidth={5} strokeLinejoin="round" />
  </g>
);
export const B21: React.FC<ShotProps> = ({ t, len }) => (
  <BigNum t={t} len={len} id="b21" text="> 99%" caption="DỮ LIỆU GIỮA CÁC CHÂU LỤC" size={280}>
    <rect x={-200} y={850} width={2320} height={300} fill={PAL.seaTop} opacity={0.55} />
    <path d="M -200 850 Q 480 820 960 850 T 2120 850" stroke="#E8F7FF" strokeWidth={5} fill="none" />
    <path d="M -200 1000 Q 480 960 960 1000 T 2120 1000" stroke={SCH.dim} strokeWidth={14} fill="none" />
    {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={((t * 9 + i * 340) % 2400) - 240} cy={1000 - Math.sin((((t * 9 + i * 340) % 2400) - 240) / 960 * 3.14) * 0} r={12} fill="#7FE3FF" />)}
    <Blob x={260} y={250} />
    <Blob x={1660} y={250} flip />
    <path d="M 330 230 Q 960 20 1590 230" stroke={SCH.dim} strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round" fill="none" />
    {Array.from({ length: 4 }).map((_, i) => {
      const u = (t * 0.018 + i / 4) % 1;
      const x = (1 - u) * (1 - u) * 330 + 2 * (1 - u) * u * 960 + u * u * 1590;
      const y = (1 - u) * (1 - u) * 230 + 2 * (1 - u) * u * 20 + u * u * 230;
      return <circle key={i} cx={x} cy={y} r={14} fill={SCH.live} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />;
    })}
  </BigNum>
);

// ---------- B22: the cable on the seabed under the sea, data pulses running between two coast stations ----------
// the cable as 4 joined quadratic segments (start, control, end); cablePoint(u) walks along them
const CABLE_SEGS: [number, number][][] = [[[300, 756], [420, 798], [520, 892]], [[520, 892], [700, 950], [960, 940]], [[960, 940], [1240, 950], [1400, 892]], [[1400, 892], [1500, 798], [1620, 756]]];
const cablePoint = (u: number): [number, number] => {
  const i = Math.min(3, Math.floor(u * 4));
  const k = u * 4 - i;
  const [a, c, b] = CABLE_SEGS[i];
  return [(1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * c[0] + k * k * b[0], (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * c[1] + k * k * b[1]];
};
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const pulses = 5;
  const floor = 'M -100 760 L 300 760 Q 420 800 520 900 Q 700 960 960 950 Q 1240 960 1400 900 Q 1500 800 1620 760 L 2020 760 L 2020 1100 L -100 1100 Z';
  const cable = 'M 300 756 Q 420 798 520 892 Q 700 950 960 940 Q 1240 950 1400 892 Q 1500 798 1620 756';
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Schematic t={t} id="b22" />
      <rect x={-100} y={360} width={2120} height={800} fill={PAL.seaTop} opacity={0.82} />
      <path d={`M -100 360 ` + Array.from({ length: 45 }).map((_, i) => `L ${-100 + i * 48} ${360 + Math.sin(i * 0.9 + t * 0.14) * 4}`).join(' ')} stroke="#E8F7FC" strokeWidth={5} fill="none" />
      <path d={floor} fill="#7A6548" stroke="#C9AE7A" strokeWidth={5} />
      {/* coast stations */}
      {[[130, 1], [1790, -1]].map(([x, d], i) => (
        <g key={i} transform={`translate(${x} 760) scale(${d} 1)`}>
          <rect x={-60} y={-130} width={150} height={130} fill="#F1ECE2" stroke={PAL.ink} strokeWidth={5} />
          <rect x={-30} y={-96} width={50} height={40} fill="#7FC4E8" stroke={PAL.ink} strokeWidth={3} />
          <path d="M 60 -130 L 60 -230 M 40 -200 L 80 -200 M 30 -170 L 90 -170" stroke={SCH.line} strokeWidth={6} strokeLinecap="round" />
          <circle cx={60} cy={-236} r={9} fill="#FF4A3F" opacity={0.5 + 0.5 * Math.sin(t / 5 + i)} />
        </g>
      ))}
      <path d={cable} stroke={PAL.ink} strokeWidth={32} fill="none" strokeLinecap="round" />
      <path d={cable} stroke="#2F3E55" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={cable} stroke="#7FE3FF" strokeWidth={4} fill="none" strokeDasharray="6 26" strokeDashoffset={-t * 7} strokeLinecap="round" />
      {Array.from({ length: pulses }).map((_, i) => {
        const [px, py] = cablePoint((t * 0.016 + i / pulses) % 1);
        return <circle key={i} cx={px} cy={py - 4} r={13} fill="#E8FBFF" style={{ filter: 'drop-shadow(0 0 12px #7FE3FF)' }} />;
      })}
      <Fish x={600 + Math.sin(t / 30) * 40} y={560} s={1.1} t={t} dir={1} color="#FF9A4A" />
      <Fish x={1320 - Math.sin(t / 26) * 50} y={650} s={0.9} t={t + 8} dir={-1} color="#C9D2D9" />
      <text x={960} y={250} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill={SCH.line} letterSpacing={4}>CÁP QUANG BIỂN</text>
    </g>
  );
};

// ---------- B23: the same cable now lies bare across the desert seabed, pulses still running ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), kf(t, [[0, 800], [len, 740]]), kf(t, [[0, 1.0], [len, 1.2]]))}>
    <Seabed id="b23" t={t} haze={0.4} dust={0.35} />
    <CableRun t={t} x0={-160} y0={1080} cx={620} cy={900} x1={1560} y1={600} w0={150} w1={6} pulses={6} />
    {Array.from({ length: 3 }).map((_, i) => {
      const u = 0.25 + i * 0.22;
      const x = (1 - u) * (1 - u) * -160 + 2 * (1 - u) * u * 620 + u * u * 1560;
      const y = (1 - u) * (1 - u) * 1080 + 2 * (1 - u) * u * 900 + u * u * 600;
      return <ellipse key={i} cx={x + 40} cy={y + 20 + rnd(5, i) * 8} rx={90 * (1 - u * 0.6)} ry={9 * (1 - u * 0.5)} fill="#FBF8F0" opacity={0.2} />;
    })}
    <Sparkle x={1130} y={730} t={t % 40} s={0.8} />
  </g>
);
