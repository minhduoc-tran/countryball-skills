import React from 'react';
import { ShotProps, Street, Hero, LOOKS, poseAt, walkPose, joints, toWorld, camT, kf, clamp, easeOut, FONT, Glow } from '../../engine';
import { SpeedLines, StreakLines, ImpactFlash, Shockwave, Debris, DustCloud, BoomWord, shakeAt } from './punch-fx-kit';
import { PunchPip, punchFist } from './punch-pip-and-fist';
import { GiantCockroach } from './giant-cockroach';
import { Rooftops, BLOCKS, RecPhone, PipFaceTile, popIn } from './chb-night-props';
import { FLOOR_Y } from './shots-chb-roach-setup';

// Chapter B, cockroach part 2: B20-B24 (63.79-70.52 s). The hit (Bùm on frame 3 of B20), the flight over three rows of houses,
// the street films it, the morning after: Pip's face on every screen.

const PIP = LOOKS.pipHood;
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// ---------- B20: THE HIT, side-on wide (the kit demo Z1 layout) ----------
export const B20: React.FC<ShotProps> = ({ t }) => {
  const hitT = 3;
  const pipOpts = { x: 700, ground: FLOOR_Y, scale: 0.72, side: 1 as const, aim: 98, lunge: 70 };
  const fist = punchFist(t, hitT, pipOpts);
  const hit = lin(t, hitT, 56);
  const hp = { x: 905, y: 540 };
  const sk = shakeAt(t, hitT, 24, 14);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 960], [hitT + 14, 1010], [hitT + 30, 1250]]), 600, kf(t, [[0, 1.5], [hitT + 30, 1.3]]))}>
        <Street t={t + 259} id="b20" night />
        <GiantCockroach t={t} x={1200} y={690} scale={1.08} facing={-1} hit={hit} flyDist={1500} walk={0.4} rimId="rimBlue" />
        <Glow x={hp.x} y={hp.y} r={t >= hitT ? 420 : 0} o={0.6 * clamp(1 - (t - hitT) / 14)} />
        <Shockwave t={t} hitT={hitT} x={fist.x + 20} y={fist.y} kind="air" />
        <Shockwave t={t} hitT={hitT} x={hp.x + 40} y={720} kind="ground" r={700} />
        <DustCloud t={t} hitT={hitT} x={hp.x + 30} y={730} r={110} />
        <PunchPip t={t} hitT={hitT} {...pipOpts} rimId="rimBlue" />
        <Debris t={t} hitT={hitT} x={hp.x + 30} y={hp.y} n={30} power={1.1} dir={-25} cone={200} groundY={725} />
        <SpeedLines t={t} cx={hp.x} cy={hp.y} o={t >= hitT && t < hitT + 9 ? 0.75 : 0} rIn={260} />
        <ImpactFlash t={t} hitT={hitT} x={fist.x + 30} y={fist.y} r={700} />
        <BoomWord t={t} at={hitT + 3} x={1170} y={440} size={170} />
      </g>
    </g>
  );
};

// ---------- B21: the flight: over three rows of houses, shrinking; the camera pans along ----------
export const B21: React.FC<ShotProps> = ({ t }) => {
  const u = clamp(t / 61);
  const x = 700 + 2700 * u;
  const y = 700 - 1500 * u * (1 - u) - 60 * u;
  const sc = 0.62 - 0.5 * u;
  const spin = 760 * u;
  const cx = kf(t, [[0, 1000], [61, 2500]], (v) => v);
  return (
    <g transform={camT(cx, 520, 1.1)}>
      <Rooftops t={t + 300} id="b21" />
      {BLOCKS.map((bx, i) => {
        const at = ((bx - 700) / 2700) * 61;
        const p = popIn(t, at, 8);
        return p > 0 ? (
          <g key={i} transform={`translate(${bx} 330) scale(${p})`}>
            <circle cx={0} cy={-34} r={58} fill="#FFD23F" stroke="#16101A" strokeWidth={8} />
            <text x={0} y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#16101A">{i + 1}</text>
          </g>
        ) : null;
      })}
      <StreakLines t={t} x={x - 40} y={y - 120 * sc} dir={-30 + 60 * u} n={9} len={520 * (1 - u * 0.6)} spread={60 * sc + 10} o={0.55} />
      <g transform={`rotate(${spin} ${x} ${y - 150 * sc})`}>
        <GiantCockroach t={t} x={x} y={y} scale={sc} facing={1} hit={0.12} flyDist={0} flyH={0} walk={0} rimId="rimBlue" />
      </g>
    </g>
  );
};

// ---------- B22: everyone raises a phone and films ----------
const FANS = [
  { look: LOOKS.mom, x: 330, sc: 0.95, f: 4 }, { look: LOOKS.suit, x: 640, sc: 0.85, f: 10 }, { look: LOOKS.mo, x: 930, sc: 1.0, f: 0 },
  { look: LOOKS.sis, x: 1230, sc: 0.78, f: 14 }, { look: LOOKS.mom, x: 1500, sc: 0.9, f: 7 }, { look: LOOKS.suit, x: 1760, sc: 0.8, f: 18 },
];
export const B22: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(kf(t, [[0, 960], [56, 1020]]), 600, kf(t, [[0, 1.0], [56, 1.18]]))}>
    <Street t={t + 330} id="b22" night />
    <g transform={`translate(${1500 + t * 4} ${150 - t * 0.5}) rotate(${t * 9})`}>
      <GiantCockroach t={t} x={0} y={0} scale={0.06} facing={1} hit={0.12} flyDist={0} flyH={0} walk={0} />
    </g>
    {FANS.map((c, i) => {
      const pose = poseAt(t, [
        { f: 0, p: { x: c.x, y: 880 - 136 * c.sc, scale: c.sc, yaw: 0.45, facing: 1, expr: 'shock', armR: { a: 20, b: 20 }, armL: { a: 15, b: 15 }, look: 0.6 } },
        { f: c.f + 6, p: { armR: { a: 150, b: -10 }, expr: 'happy' }, ease: easeOut },
      ]);
      const hand = toWorld(pose, joints(pose).armR.end);
      return (
        <g key={i}>
          <Hero look={c.look} pose={pose} rimId="rimBlue" />
          <RecPhone x={hand.x + 8} y={hand.y - 34 * c.sc} w={118 * c.sc} t={t} at={c.f + 8} />
        </g>
      );
    })}
  </g>
);

// ---------- B23: the morning after: people on the street staring at their phones ----------
export const B23: React.FC<ShotProps> = ({ t }) => {
  const walkers = [
    { look: LOOKS.mom, x0: 200, v: 9, sc: 0.8, g: 800 }, { look: LOOKS.mo, x0: -150, v: 10, sc: 0.86, g: 830 }, { look: LOOKS.suit, x0: 620, v: 8, sc: 0.72, g: 765 },
  ];
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.0], [29, 1.1]]))}>
      <Street t={t + 20} id="b23" />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#FFB070" opacity={0.12} />
      {walkers.map((w, i) => {
        const x = w.x0 + w.v * t;
        const pose = walkPose(x, t * 0.5 + i, w.g, w.sc, { expr: 'shock', armR: { a: 70, b: 70 }, yaw: 0.8 }, 1);
        const hand = toWorld(pose, joints(pose).armR.end);
        return (
          <g key={i}>
            <Hero look={w.look} pose={pose} rimId="rimR" />
            <PipFaceTile x={hand.x + 14} y={hand.y - 22 * w.sc} w={64 * w.sc} h={104 * w.sc} id={`b23p${i}`} expr="cool" />
          </g>
        );
      })}
    </g>
  );
};

// ---------- B24: TV news and phone feeds: Pip's face everywhere ----------
export const B24: React.FC<ShotProps> = ({ t }) => {
  const phones = [[330, 300, -8], [1590, 300, 7], [260, 760, 6], [1660, 770, -6], [560, 160, 4], [1370, 140, -5]] as const;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [33, 1.1]]))}>
      <defs>
        <radialGradient id="b24bg" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stopColor="#2A3A6A" /><stop offset="1" stopColor="#0E1020" /></radialGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1700} fill="url(#b24bg)" />
      <g transform={`translate(960 520) scale(${0.9 + 0.1 * easeOut(clamp(t / 8))})`}>
        <rect x={-460} y={-290} width={920} height={560} rx={36} fill="#16151E" stroke="#3A3846" strokeWidth={10} />
        <PipFaceTile x={0} y={-20} w={840} h={440} id="b24tv" expr="cool" />
        <rect x={-420} y={150} width={840} height={96} fill="#D8322D" />
        <text x={-390} y={219} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFFFFF">TIN NÓNG</text>
        <circle cx={380} cy={198} r={16} fill="#FFFFFF" opacity={t % 20 < 12 ? 1 : 0.2} />
      </g>
      {phones.map(([px, py, rot], i) => {
        const p = popIn(t, 4 + i * 4, 6);
        return p > 0 ? (
          <g key={i} transform={`translate(${px} ${py}) rotate(${rot}) scale(${p})`}>
            <rect x={-86} y={-150} width={172} height={300} rx={22} fill="#0E0D14" stroke="#4A4858" strokeWidth={6} />
            <PipFaceTile x={0} y={-30} w={150} h={210} id={`b24p${i}`} expr={i % 2 ? 'smug' : 'cool'} tint={['#7CD0FF', '#F2B84B', '#FF8AB0'][i % 3]} />
            <text x={-60} y={112} fontFamily={FONT.ui} fontSize={26} fill="#FF5A7A">{'♥ ' + (12 + i * 37) + 'N'}</text>
          </g>
        ) : null;
      })}
      <SpeedLines t={t} cx={960} cy={540} o={t < 6 ? 0.35 : 0} rIn={600} />
    </g>
  );
};
