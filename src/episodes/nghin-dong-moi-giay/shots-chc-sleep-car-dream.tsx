import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Bedroom, BedDuvet, bedSit, Street, proj, px,
  Rooftop, Tabletop, LightVeil, Sparkle, Tag, FloatLabel, ShotProps, FONT,
} from '../../engine';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';
import { PhoneShell } from '../last-one/cha-feed-screen-ui';
import { SmallCar } from './chc-props-appliance-car-coin';
import { BalanceScreen, GlitchChip, fmtVN } from './chc-ui-phone-screens-cards-chips';
import { Hammock, HammockFront, Briefcase, DayCalendar, ZzzFloat } from './chc-props-hammock-and-desk';

// Chapter C, the fun part, second half: asleep while the balance climbs, the little car with a bow, the hammock dream
// and the moment the dream turns (the ping chip glitches red).

const PIP = LOOKS.pipHood;

// ---------- C9: wide bedroom: Pip asleep, the night turns to morning in the window while the balance counts up ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const dawn = easeOut(clamp((t - len * 0.45) / (len * 0.4)));
  const bal = 28800000 * easeOut(clamp(t / (len - 6)));
  const pose: Pose = poseAt(t, [{ f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: -0.4, look: 0, armL: { a: 8, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 12, tilt: -2 } }, { f: len, p: { headTilt: 8 } }]);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 820], [len, 790]]), 520, kf(t, [[0, 1.35], [len, 1.55]]))}>
        <Bedroom t={t + 20} id="c9n" duvet={false} lamp={0.25} crossed={0} clock="23:00" />
        <g opacity={dawn}><DawnBedroom t={t + 20} id="c9d" duvet={false} clock="06:00" /></g>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]), blink: dawn < 0.8 ? 1 : 0 }} rimId={dawn < 0.5 ? 'rimBlue' : 'rimR'} shadow={0} />
        <BedDuvet knees={1} />
        <ZzzFloat x={b.x - 40} y={b.y - 250} t={t} o={1 - dawn} />
      </g>
      <g transform="translate(150 930)">
        <rect x={-30} y={-52} width={640} height={104} rx={52} fill="#0B0816" opacity={0.78} />
        <text x={20} y={-14} fontFamily={FONT.ui} fontSize={26} fill="#9FB4D8">SỐ DƯ TĂNG TRONG ĐÊM</text>
        <text x={20} y={30} fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#7CF0A8">{`+${fmtVN(bal)} đ`}</text>
      </g>
    </g>
  );
};

// ---------- C10: insert: the phone in the morning light, the night's total on screen, +28.800.000 đ floats up ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <g filter="url(#blur16)"><g transform="translate(-520 -520) scale(1.9)"><DawnBedroom t={t + 40} id="c10b" clock="06:00" /></g></g>
    <rect x={-300} y={-300} width={2600} height={1700} fill="#0A0814" opacity={0.22} />
    <PhoneShell id="c10p" x={700} y={560} s={0.74} rot={-5} glow={0.5}>
      <BalanceScreen t={t} a={-20} b={-10} to={28800000} />
    </PhoneShell>
    <FloatLabel x={1330} y={640} t={t - 12} text="+28.800.000 đ" size={78} color="#7CF0A8" />
    <Sparkle x={1000} y={300} t={t - 10} s={1.6} />
    <Sparkle x={420} y={760} t={t - 16} s={1.2} />
  </g>
);

// ---------- C11: wide street: a small blue car with a gift bow, ~400 TRIỆU ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 6.2;
  const g = proj(-1.6, 0, Z);
  const s = (4.0 * px(Z)) / 470;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 840]]), kf(t, [[0, 600], [len, 630]]), kf(t, [[0, 1.1], [len, 1.5]]))}>
      <Street t={t + 120} id="c11s" />
      <SmallCar x={g.x} y={g.y} s={s} t={t} bow={clamp((t - 4) / 8)} />
      <Glow x={g.x} y={g.y - 120} r={380} o={0.2} />
      <Tag x={g.x} y={g.y - 330} t={t - 18} text="~400 TRIỆU" w={420} />
      <Sparkle x={g.x + 120} y={g.y - 260} t={t - 10} s={1.4} />
    </g>
  );
};

// ---------- C12: close on the car's bow, a calendar fills five days: < 5 NGÀY ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 6.2;
  const g = proj(-1.6, 0, Z);
  const s = (4.0 * px(Z)) / 470;
  return (
    <g transform={camT(kf(t, [[0, g.x - 20], [len, g.x + 10]]), g.y - 160, kf(t, [[0, 2.1], [len, 2.35]]))}>
      <g filter="url(#blur6)"><Street t={t + 130} id="c12s" /></g>
      <SmallCar x={g.x} y={g.y} s={s} t={t} bow={1} />
      <DayCalendar x={g.x} y={g.y - 335} t={t} days={5} s={0.5} title="< 5 NGÀY" />
    </g>
  );
};

// ---------- C13: insert: a briefcase on the table, a big red cross slams across it: no more going to work ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 8) / 6));
  const shake = t > 13 && t < 18 ? Math.sin(t * 3) * 5 : 0;
  return (
    <g transform={`translate(${shake} 0) translate(960 540) rotate(${-2 + t * 0.05}) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#8A6A52" grain="#785A44" lip="#947258" kind="wood" floor="#2C2430" floorLines="#231C28" />
      <LightVeil id="c13veil" lights={[[960, 540, 700]]} o={0.5} />
      <Briefcase x={960} y={600} s={1.5} />
      <g opacity={k} transform={`translate(960 580) scale(${1.4 - 0.4 * k})`} stroke="#E2453C" strokeWidth={46} strokeLinecap="round">
        <path d="M -300 -220 L 300 220" /><path d="M 300 -220 L -300 220" />
      </g>
      <Sparkle x={1300} y={300} t={t - 12} s={1.2} />
    </g>
  );
};

// ---------- hammock shots: Pip lying in a hammock on the rooftop at sunset ----------
const lying = (t: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: 975, y: 790, scale: 1.0, yaw: -0.2, spin: -86, facing: 1, look: 0,
  armL: { a: 150, b: 120 }, armR: { a: 150, b: 100 }, legL: { a: 6, b: 10 }, legR: { a: 14, b: 16 }, headTilt: 4, sway: Math.sin(t * 0.1) * 6, ...extra,
});
/** `ft` is the shot's own clock for the face swaps (t is offset so the set's idle motion carries across cuts). */
const HammockScene: React.FC<{ t: number; ft: number; id: string; pose: Pose; expr: [number, Pose['expr']][]; }> = ({ t, ft, id, pose, expr }) => {
  const sw = Math.sin(t * 0.07) * 1.6;
  return (
    <g>
      <Rooftop t={t + 90} sunX={1250} sunY={575} low={0} />
      <g transform={`rotate(${sw} 975 520)`}>
        <Hammock t={t} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(ft, expr) }} rimId="rimR" shadow={0} />
        <HammockFront t={t} />
      </g>
      <Dust t={t} seed={id.length} x0={500} y0={300} w={900} h={400} n={18} o={0.4} />
    </g>
  );
};

// ---------- C14: wide: the hammock between two posts at sunset, a few bills drift off on the breeze ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 975]]), 640, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <HammockScene t={t} ft={t} id="c14" pose={lying(t)} expr={[[0, 'happy']]} />
    {[0, 1, 2].map((i) => {
      const p = clamp((t - i * 6) / 44);
      return <rect key={i} x={1000 + p * 900} y={620 - p * 260 + Math.sin(t * 0.3 + i) * 14} width={48} height={32} rx={4} fill="#F6EFE3" opacity={0.9 * (1 - p * p)} transform={`rotate(${p * 200 + i * 40} ${1020 + p * 900} ${640 - p * 260})`} />;
    })}
  </g>
);

// ---------- C15: medium: slow push-in on Pip swinging gently, the smile wide ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 700], [len, 730]]), kf(t, [[0, 1.5], [len, 2.1]]))}>
    <HammockScene t={t + 30} ft={t} id="c15" pose={lying(t + 30, { headTilt: 52 })} expr={[[0, 'happy'], [40, 'smug']]} />
    <Sparkle x={1320} y={560} t={t - 10} s={1.2} />
  </g>
);

// ---------- C16: medium from the other end of the hammock (mirrored, the sun swings to the left), still pushing in ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform="translate(1950 0) scale(-1 1)">
    <g transform={camT(kf(t, [[0, 985], [len, 965]]), kf(t, [[0, 730], [len, 745]]), kf(t, [[0, 1.8], [len, 2.2]]))}>
      <HammockScene t={t + 70} ft={t} id="c16" pose={lying(t + 70, { headTilt: 52 })} expr={[[0, 'smug']]} />
    </g>
  </g>
);

// ---------- C17: close: the ping chip glitches red, Pip's smile drops; no ping look here, the chip is drawn by hand ----------
export const C17: React.FC<ShotProps> = ({ t, len }) => {
  const turn = clamp((t - 22) / 8);
  const tint = easeOut(turn) * 0.5;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 955], [len, 940]]), 750, kf(t, [[0, 2.5], [len, 2.8]]))}>
        <HammockScene t={t + 100} ft={t} id="c17" pose={lying(t + 100, { headTilt: 52, look: kf(t, [[0, 0], [30, 0.6]]) })} expr={[[0, 'smug'], [22, 'worried']]} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#7A0F14" opacity={tint} style={{ mixBlendMode: 'multiply' }} />
      <g transform={`translate(${t > 20 ? Math.sin(t * 5) * 3 * (1 - clamp((t - 20) / 20)) : 0} 0)`}><GlitchChip t={t} /></g>
    </g>
  );
};
