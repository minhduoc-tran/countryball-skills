import React from 'react';
import {
  Street, ShotProps, kf, camT, clamp, easeOut, easeInOut, backOut, LOOKS, Hero, poseAt, faceAt, Foreground, TitleCard, LEG_LEN, FONT, Glow,
} from '../../engine';
import { SpeedLines, StreakLines, ImpactFlash, Shockwave, BoomWord, shakeAt } from './punch-fx-kit';
import { PunchPip, FistInsert, punchFist } from './punch-pip-and-fist';
import { GiantCockroach } from './giant-cockroach';
import { RogueRobot } from './rogue-robot';
import { CloudDeck, Rain } from './storm-sky';
import { CloudCeiling, Rubble } from './cha-local-props';

// Chapter A cold open, part 2: the cloud (A10-A14), the hook (A15-A17), the premise title (A18-A20).
const PIP = LOOKS.pipHood;
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// ---------- A10: the black cloud deck over the whole city (wide) ----------
export const A10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [32, 1.12]]))}>
      <CloudDeck t={t} id="a10" />
    </g>
    <Rain t={t} intensity={0.9} />
  </g>
);

// ---------- A11: street level, the cloud ceiling swallows the sky, small figures look up ----------
export const A11: React.FC<ShotProps> = ({ t }) => {
  const base = kf(t, [[0, 120], [36, 640]], easeInOut);
  const look = (x: number, g: number, s: number, who: number) => (
    <Hero
      look={[LOOKS.mo, LOOKS.mom, PIP][who]}
      pose={{ ...poseAt(t, [{ f: 0, p: { x, y: g - s * LEG_LEN, scale: s, yaw: 0.1, headTilt: -10 - 2 * Math.sin(t / 6 + x), look: 0, armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } } }]), ...faceAt(t, [[0, 'worried']]) }}
      rimId="rimBlue" shadow={0.6}
    />
  );
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1.0], [36, 1.1]]))}>
        <Street t={t + 60} id="a11" night />
        {look(520, 880, 0.55, 0)}
        {look(1420, 870, 0.5, 1)}
        {look(960, 905, 0.6, 2)}
      </g>
      <CloudCeiling t={t} base={base} flash={t > 22 && t < 25 ? 0.8 : 0} />
      <Rain t={t} intensity={0.6 * clamp(t / 20)} />
    </g>
  );
};

// ---------- A12 / A13 / A14: Pip on the rooftop, fist at the sky: wind-up, the hit, the sky opens (shared clock tg) ----------
const CHIT = 29;
const C_OPTS = { x: 420, ground: 1010, scale: 1.0, side: 1 as const, aim: 125, lunge: 24, lean: -8 };
const SkyPunch: React.FC<{ tg: number; id: string; zoom?: number; cx?: number; cy?: number; boom?: boolean }> = ({ tg, id, zoom = 1, cx = 700, cy = 650, boom = true }) => {
  const fist = punchFist(tg, CHIT, C_OPTS);
  const split = easeInOut(lin(tg, CHIT + 2, 34));
  const sk = shakeAt(tg, CHIT, 14, 10);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(cx, cy, zoom)}>
        <CloudDeck t={tg} id={id} split={split} />
        <Rain t={tg} intensity={1.1 * (1 - split)} />
        <rect x={-50} y={1010} width={1000} height={300} fill="#0E0C18" stroke="#1A1630" strokeWidth={6} />
        <Shockwave t={tg} hitT={CHIT} x={fist.x} y={fist.y} kind="air" r={700} />
        <PunchPip t={tg} hitT={CHIT} {...C_OPTS} rimId="rimBlue" />
        <StreakLines t={tg} x={fist.x} y={fist.y} dir={-52} n={tg >= CHIT - 2 && tg < CHIT + 5 ? 10 : 0} len={500} />
        <ImpactFlash t={tg} hitT={CHIT} x={fist.x} y={fist.y} r={600} full={false} />
        {boom ? <BoomWord t={tg} at={CHIT + 6} x={1330} y={820} size={230} rot={-5} /> : null}
      </g>
    </g>
  );
};
export const A12: React.FC<ShotProps> = ({ t }) => <SkyPunch tg={t} id="a12" zoom={kf(t, [[0, 1.1], [27, 1.25]])} />;
export const A13: React.FC<ShotProps> = ({ t }) => <SkyPunch tg={t + 27} id="a13" zoom={1.3} />;
export const A14: React.FC<ShotProps> = ({ t }) => <SkyPunch tg={t + 45} id="a14" zoom={kf(t, [[0, 1.3], [22, 0.95]])} cx={kf(t, [[0, 700], [22, 960]])} cy={kf(t, [[0, 650], [22, 540]])} boom={false} />;

// ---------- A15: the hook, three panels pop in: the beaten roach, the bursting robot, the split sky ----------
const Panel: React.FC<{ cx: number; t: number; t0: number; id: string; n: string; rot: number; children: React.ReactNode }> = ({ cx, t, t0, id, n, rot, children }) => {
  const s = backOut(clamp((t - t0) / 8));
  if (t < t0) return null;
  return (
    <g transform={`translate(${cx} 540) rotate(${rot}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={-270} y={-380} width={540} height={760} rx={26} />
        </clipPath>
      </defs>
      <rect x={-286} y={-396} width={572} height={792} rx={34} fill="#F6EFE3" stroke="#1A1230" strokeWidth={8} />
      <g clipPath={`url(#${id}clip)`}>{children}</g>
      <text x={-232} y={346} fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFE27A" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{n}</text>
    </g>
  );
};
export const A15: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#14122A" />
    <Glow x={960} y={540} r={1100} kind="warm" o={0.25} />
    <Panel cx={330} t={t} t0={2} id="a15p1" n="1" rot={-3}>
      <rect x={-270} y={-380} width={540} height={760} fill="#1B2140" />
      <rect x={-270} y={120} width={540} height={260} fill="#2A2A3C" />
      <GiantCockroach t={t} x={0} y={270} scale={0.5} facing={1} hit={1} flyDist={0} walk={0} id="a15c" rimId="rimBlue" />
      <path d="M -60 -150 L -20 -230 M 40 -170 L 90 -240 M 0 -120 L 0 -200" stroke="#FFE27A" strokeWidth={10} strokeLinecap="round" />
    </Panel>
    <Panel cx={960} t={t} t0={9} id="a15p2" n="2" rot={2}>
      <rect x={-270} y={-380} width={540} height={760} fill="#2B1A2A" />
      <Glow x={0} y={-30} r={420} kind="warm" o={0.8} />
      <RogueRobot t={t + 20} x={0} y={330} scale={0.36} burst={0.5} walk={0} id="a15r" />
    </Panel>
    <Panel cx={1590} t={t} t0={16} id="a15p3" n="3" rot={-2}>
      <g transform="translate(-480 -300) scale(0.5)">
        <CloudDeck t={t} id="a15s" split={1} />
      </g>
    </Panel>
  </g>
);

// ---------- A16: three tally strokes slam down one by one ("ba cú đấm") ----------
export const A16: React.FC<ShotProps> = ({ t }) => {
  const marks = [3, 12, 21];
  return (
    <g>
      <defs>
        <radialGradient id="a16bg" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#FF6B3D" />
          <stop offset="55%" stopColor="#A31D2E" />
          <stop offset="100%" stopColor="#240A20" />
        </radialGradient>
      </defs>
      <rect x={-50} y={-50} width={2020} height={1180} fill="url(#a16bg)" />
      <SpeedLines t={t} cx={960} cy={540} n={60} rIn={380} rOut={1700} o={0.45} seed={4} />
      {marks.map((m, i) => {
        const cx = 560 + i * 400;
        const p = clamp((t - m) / 3);
        const sk = shakeAt(t, m + 3, 12, 8);
        return t < m ? null : (
          <g key={i} transform={`translate(${sk.x} ${sk.y})`}>
            <Shockwave t={t} hitT={m + 3} x={cx} y={760} kind="air" r={300} />
            <g transform={`translate(${cx} ${540 - 200 * (1 - easeOut(p))}) rotate(${(i - 1) * 4}) scale(${1 + 0.8 * (1 - p)})`} opacity={clamp(p * 3)}>
              <rect x={-52} y={-300} width={104} height={600} rx={50} fill="#F6EFE3" stroke="#1A1230" strokeWidth={14} />
              <rect x={14} y={-270} width={22} height={540} rx={11} fill="#E2D3BE" />
            </g>
            <ImpactFlash t={t} hitT={m + 3} x={cx} y={760} r={420} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- A17: bored: Pip slumped on a heap of rubble, yawning, the city quiet behind ----------
export const A17: React.FC<ShotProps> = ({ t }) => {
  const yawn = t > 8 && t < 32 ? 1 : 0;
  const open = kf(t, [[8, 0], [18, 1], [28, 1], [34, 0]]);
  const pose = poseAt(t, [
    { f: 0, p: { x: 930, y: 640, scale: 0.9, yaw: 0.9, facing: 1, tilt: 8, headTilt: 4, legL: { a: 80, b: -78 }, legR: { a: 70, b: -70 }, armL: { a: 30, b: 70 }, armR: { a: 32, b: 75 }, look: 0.4 } },
    { f: 10, p: { headTilt: 4 } },
    { f: 20, p: { headTilt: -12, tilt: 4 }, ease: easeOut },
    { f: 32, p: { headTilt: -12 } },
    { f: 40, p: { headTilt: 6, tilt: 10 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [45, 940]]), 640, kf(t, [[0, 1.35], [45, 1.55]]))}>
      <Street t={t + 20} id="a17" grass={0.5} />
      <Rubble x={930} y={900} s={1.5} seed={3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [8, 'shock'], [34, 'tired']]), blink: yawn ? 1 : 0 }} rimId="rimR" shadow={0} />
      <g opacity={open * 0.9}>
        {[0, 1, 2].map((i) => <text key={i} x={1130 + i * 46} y={420 - i * 60 - 18 * clamp((t - 18) / 14)} fontFamily={FONT.hand} fontSize={50 + i * 14} fill="#F6EFE3" stroke="#1A1230" strokeWidth={5} paintOrder="stroke">z</text>)}
      </g>
      <Foreground blur={10}>
        <Rubble x={300} y={1120} s={1.6} seed={8} />
      </Foreground>
    </g>
  );
};

// ---------- A18 / A19: the title over a ruined street (wide, then closer on Pip); the title stays up across the cut ----------
const RuinedStreet: React.FC<{ t: number; id: string; zoom: number; cx: number; cy: number }> = ({ t, id, zoom, cx, cy }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 880, y: 800 - 0.62 * LEG_LEN, scale: 0.62, yaw: 0.3, look: 0.3, armL: { a: 14, b: 8 }, armR: { a: 14, b: 8 } } },
    { f: 40, p: { yaw: -0.2, look: -0.5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(cx, cy, zoom)}>
      <Street t={t + 100} id={id} grass={0.8} />
      <Rubble x={620} y={800} s={0.9} seed={5} />
      <Rubble x={1240} y={815} s={0.8} seed={9} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'cool']]) }} rimId="rimR" shadow={0.7} />
    </g>
  );
};
const PremiseTitle: React.FC<{ t: number }> = ({ t }) => (
  <TitleCard t={t} lines={['SẼ RA SAO NẾU BẠN CHỈ CẦN', 'MỘT CÚ ĐẤM?']} accent="MỘT" accentT={78} size={118} y={150} />
);
export const A18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RuinedStreet t={t} id="a18" zoom={kf(t, [[0, 1.0], [38, 1.04]])} cx={960} cy={560} />
    <PremiseTitle t={t} />
  </g>
);
export const A19: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RuinedStreet t={t + 38} id="a19" zoom={kf(t, [[0, 1.1], [60, 1.45]])} cx={kf(t, [[0, 940], [60, 900]])} cy={kf(t, [[0, 600], [60, 640]])} />
    <PremiseTitle t={t + 38} />
  </g>
);

// ---------- A20: the fist, "một cú đấm?": clenches and thrusts at the lens ----------
export const A20: React.FC<ShotProps> = ({ t }) => {
  const sk = shakeAt(t, 17, 22, 12);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <FistInsert t={t} id="a20" clenchAt={0} thrustAt={14} side={-1} />
      <Shockwave t={t} hitT={17} x={960} y={560} r={900} />
      <ImpactFlash t={t} hitT={17} x={960} y={560} r={900} full />
    </g>
  );
};
