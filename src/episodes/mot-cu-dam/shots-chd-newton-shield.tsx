import React from 'react';
import { Schematic, SchLabel, SCH, FONT, ShotProps, kf, camT, clamp, easeOut, easeInOut, backOut, Hero, basePose, LOOKS, faceAt, rnd } from '../../engine';
import { ImpactFlash, Shockwave, Debris, shakeAt } from './punch-fx-kit';
import { FistInsert } from './punch-pip-and-fist';
import { NewtonCradle, BigArrow, FistIcon, BrickWall, XRayHand, ShieldOutline } from './chd-newton-and-shield-props';

// Chapter D, Newton's third law and the invincible body (D13-D20, 153.18-167.56 s): a Newton's cradle, the title card,
// fist vs wall with two equal opposite arrows, the X-ray of an ordinary hand cracking, then Pip's fist and whole body
// glowing inside an invincible shield outline.

const INK = '#16101A';
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// D13 (48 f): Newton's cradle ticking
export const D13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d13" />
    <NewtonCradle t={t + 8} x={960} y={250} s={1.55} />
    <SchLabel x={960} y={170} t={t - 4} text="MỘT ĐỊNH LUẬT NỮA" size={50} color={SCH.dim} />
  </g>
);

// D14 (45 f): the title card: ĐỊNH LUẬT 3 / NEWTON, and two opposite arrows pop in
export const D14: React.FC<ShotProps> = ({ t }) => {
  const s = backOut(lin(t, 0, 8));
  return (
    <g>
      <Schematic t={t} id="d14" />
      <g transform={`translate(960 400) scale(${s})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={SCH.line} letterSpacing={6}>ĐỊNH LUẬT 3</text>
      </g>
      <g transform={`translate(960 640) scale(${backOut(lin(t, 8, 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={240} fill="#FFD23F" stroke={INK} strokeWidth={16} paintOrder="stroke" strokeLinejoin="round">NEWTON</text>
      </g>
      <BigArrow x0={640} y0={870} x1={920} y1={870} t={t - 18} width={34} />
      <BigArrow x0={1280} y0={870} x1={1000} y1={870} t={t - 22} color="#7FD4FF" width={34} />
    </g>
  );
};

/** Shared stage for the fist-vs-wall shots: wall on the right, the fist's x comes from the caller. */
const WallStage: React.FC<{ fistX: number; t: number; sk: { x: number; y: number }; hitAt: number }> = ({ fistX, t, sk, hitAt }) => (
  <g transform={`translate(${sk.x} ${sk.y})`}>
    <BrickWall x={1200} y={170} w={900} h={760} />
    <rect x={-100} y={930} width={2200} height={200} fill="#1C2C44" />
    <path d="M -100 930 H 2100" stroke={SCH.line} strokeWidth={6} />
    {t >= hitAt ? <path d={`M 1200 520 l 90 -36 l -40 -44 l 100 -50`} stroke="#2A150E" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={clamp((t - hitAt) / 4)} /> : null}
    <FistIcon x={fistX} y={540} s={1.1} />
    <Shockwave t={t} hitT={hitAt} x={1195} y={520} r={260} len={16} />
    <ImpactFlash t={t} hitT={hitAt} x={1195} y={520} r={240} />
  </g>
);

// D15 (52 f): the fist slams the wall at f26
export const D15: React.FC<ShotProps> = ({ t }) => {
  const hit = 26;
  const fx = kf(t, [[0, 330], [hit - 3, 1040], [hit, 1075], [hit + 6, 1030]], easeOut);
  const sk = shakeAt(t, hit, 14, 10);
  return (
    <g>
      <Schematic t={t} id="d15" />
      <WallStage fistX={fx} t={t} sk={sk} hitAt={hit} />
      <BigArrow x0={420} y0={330} x1={1060} y1={330} t={t - hit - 1} label="LỰC ĐẤM" />
    </g>
  );
};

// D16 (84 f): close on the contact: an equal arrow pushes straight back, "=" between them
export const D16: React.FC<ShotProps> = ({ t }) => {
  const sk = shakeAt(t, 0, 8, 12);
  return (
    <g>
      <Schematic t={t} id="d16" />
      <g transform={camT(1130, 540, kf(t, [[0, 1.25], [84, 1.45]]))}>
        <WallStage fistX={1075} t={t + 40} sk={sk} hitAt={-100} />
        <BigArrow x0={700} y0={310} x1={1150} y1={310} t={t - 4} label="F" width={44} />
        <BigArrow x0={1150} y0={780} x1={700} y1={780} t={t - 34} label="F" color="#7FD4FF" width={44} />
        {t >= 54 ? (
          <g transform={`translate(800 545) scale(${backOut(lin(t, 54, 8))})`}>
            <rect x={-70} y={-62} width={140} height={124} rx={26} fill="#0E1A12" stroke="#5BD68A" strokeWidth={8} />
            <path d="M -34 -16 H 34 M -34 20 H 34" stroke="#5BD68A" strokeWidth={14} strokeLinecap="round" />
          </g>
        ) : null}
      </g>
      <SchLabel x={960} y={120} t={t - 50} text="BẰNG NHAU, NGƯỢC CHIỀU" size={52} color={SCH.line} />
    </g>
  );
};

// D17 (54 f): an ordinary hand's X-ray: the knuckle bone cracks at f30 (the word "vỡ")
export const D17: React.FC<ShotProps> = ({ t }) => {
  const at = 30;
  const crack = lin(t, at, 24);
  const sk = shakeAt(t, at, 10, 10);
  const push = kf(t, [[0, 40], [at - 2, -14], [at, -20], [54, -8]], easeOut);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <Schematic t={t} id="d17" />
      <SchLabel x={960} y={130} t={t - 3} text="TAY NGƯỜI BÌNH THƯỜNG" size={56} color={SCH.line} />
      <XRayHand x={960} y={610 + push} s={1.05} t={t} crack={t >= at ? Math.max(0.01, crack) : 0} />
      <Shockwave t={t} hitT={at} x={900} y={500 + push} r={320} len={16} color="#FF8A7A" />
      {t >= at + 4 ? <SchLabel x={1500} y={520} t={t - at - 4} text="NỨT" size={110} color="#FF5A4A" /> : null}
    </g>
  );
};

const Backdrop: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <defs>
      <radialGradient id={`${id}bg`} cx="50%" cy="48%" r="75%">
        <stop offset="0%" stopColor="#1F4E72" />
        <stop offset="60%" stopColor="#10233B" />
        <stop offset="100%" stopColor="#070C18" />
      </radialGradient>
    </defs>
    <rect x={-100} y={-100} width={2120} height={1280} fill={`url(#${id}bg)`} />
    {Array.from({ length: 26 }).map((_, i) => {
      const x = rnd(3, i) * 1920;
      const y = ((rnd(4, i) * 1200 - t * (0.6 + rnd(5, i))) % 1200 + 1200) % 1200 - 60;
      return <circle key={i} cx={x} cy={y} r={2 + rnd(6, i) * 4} fill="#9FDCFF" opacity={0.25 + 0.3 * rnd(7, i)} />;
    })}
  </g>
);

// D18 (47 f): the fist alone, clenched, wrapped in the shield glow
export const D18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Backdrop id="d18" t={t} />
    <g transform="translate(960 560) scale(0.95) translate(-960 -590)">
      <FistInsert t={t} id="d18" clenchAt={0} thrustAt={400} bg={false} />
    </g>
    <ShieldOutline x={960} y={590} w={700} h={800} t={t} o={easeOut(lin(t, 4, 10))} />
    <SchLabel x={960} y={120} t={t - 8} text="NẮM ĐẤM" size={60} color="#9FDCFF" />
  </g>
);

const PIP = LOOKS.pipHood;
// D19 (42 f): the whole body, calm, inside the shield (slow push-in)
export const D19: React.FC<ShotProps> = ({ t }) => {
  const z = kf(t, [[0, 1.0], [42, 1.18]]);
  return (
    <g>
      <Backdrop id="d19" t={t} />
      <g transform={camT(960, 580, z)}>
        <rect x={-300} y={800} width={2520} height={400} fill="#0B1424" />
        <ellipse cx={960} cy={806} rx={300} ry={30} fill="#7FD4FF" opacity={0.25} />
        <Hero look={PIP} pose={{ ...basePose, x: 960, y: 640, yaw: 0.15, ...faceAt(t, [[0, 'cool']]), armL: { a: 8, b: -4 }, armR: { a: 8, b: -4 } }} rimId="rimBlue" shadow={0} />
        <ShieldOutline x={960} y={604} w={420} h={620} t={t} o={easeOut(lin(t, 0, 8))} />
      </g>
      <SchLabel x={960} y={110} t={t - 4} text="CẢ CƠ THỂ" size={64} color="#9FDCFF" />
    </g>
  );
};

// D20 (59 f): close on the face: chunks and sparks bounce off the field, he does not even blink
export const D20: React.FC<ShotProps> = ({ t }) => {
  const sk = shakeAt(t, 19, 8, 10);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <Backdrop id="d20" t={t} />
      <g transform={camT(960, 470, 1.9)}>
        <Hero look={PIP} pose={{ ...basePose, x: 960, y: 640, yaw: 0.1, expr: 'neutral' }} rimId="rimBlue" shadow={0} />
        <ShieldOutline x={960} y={604} w={420} h={620} t={t} />
        <Debris t={t} hitT={19} x={800} y={420} n={14} power={0.6} dir={180} cone={120} seed={11} groundY={900} colors={['#8A7F73', '#5C544B', '#B8AB9A']} />
        <Debris t={t} hitT={26} x={1110} y={500} n={12} power={0.5} dir={0} cone={110} seed={17} groundY={900} colors={['#8A7F73', '#5C544B', '#B8AB9A']} />
        <ImpactFlash t={t} hitT={19} x={790} y={420} r={150} />
        <ImpactFlash t={t} hitT={26} x={1120} y={500} r={130} />
      </g>
      <g transform={`translate(960 940) scale(${backOut(lin(t, 8, 8))})`}>
        <rect x={-380} y={-56} width={760} height={92} rx={46} fill="#0B1424" stroke="#7FD4FF" strokeWidth={6} opacity={0.92} />
        <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill="#E8F6FF" letterSpacing={3}>KHÔNG THỂ PHÁ HỦY</text>
      </g>
    </g>
  );
};
