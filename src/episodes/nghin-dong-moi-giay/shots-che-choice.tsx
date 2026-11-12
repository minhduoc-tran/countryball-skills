import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, FONT, backOut, rnd, LEG_LEN, ShotProps,
} from '../../engine';
import { Note } from './che-people-and-shop-props';

// Chapter E, the choice: Pip at a fork (E14), the left light is money, 1.000 đ every second, for ever (E15), the right
// light is a warm window with the people he loves, +1 hour a day (E16), and he stands between the two (E17).
// Left = a green-gold glow, right = a warm orange one, in all four shots, so the two sides read at a glance.

const PIP = LOOKS.pipHood;
const MONEY = '#7CF0A8';
const WARM = '#FFB46A';

/** A coloured soft light (screen-blended radial) with its own gradient id. */
const Light: React.FC<{ id: string; x: number; y: number; r: number; c: string; o?: number }> = ({ id, x, y, r, c, o = 0.6 }) => (
  <g style={{ mixBlendMode: 'screen' }} opacity={o}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={c} stopOpacity={0.9} />
        <stop offset="1" stopColor={c} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

export const Night: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0A0818" /><stop offset="1" stopColor="#2A1E34" />
      </linearGradient>
    </defs>
    <rect x={-300} y={-300} width={2520} height={1700} fill={`url(#${id})`} />
    {Array.from({ length: 40 }).map((_, i) => (
      <circle key={i} cx={rnd(5, i) * 1920} cy={rnd(6, i) * 520} r={1.5 + rnd(7, i) * 2} fill="#F6EFE3" opacity={0.3 + 0.4 * rnd(8, i)} />
    ))}
  </g>
);

// ---------- E14: a fork in a night path: money glowing at the end of the left branch, a window at the end of the right ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const ps = 1.05;
  const look = kf(t, [[0, 0], [14, -0.9], [40, -0.9], [54, 0.9], [len, 0.9]]);
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 800 - LEG_LEN * ps, scale: ps, yaw: 0.0, look: 0, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: 0 } },
    { f: 20, p: { headTilt: -4 }, ease: easeOut },
    { f: 52, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Night id="e14sky" />
      <path d="M -300 1100 L -300 640 Q 700 560 960 560 Q 1220 560 2220 640 L 2220 1100 Z" fill="#241C28" />
      {/* the path: a trunk, then two branches diverging up to the left and right */}
      <path d="M 840 1100 L 920 760 Q 930 640 640 420 L 700 400 Q 1000 620 1000 760 Q 1020 640 1220 400 L 1280 420 Q 990 640 1000 760 L 1080 1100 Z" fill="#4A3A44" />
      <path d="M 880 1100 L 940 780" stroke="#6A5460" strokeWidth={4} opacity={0.6} />
      <Light id="e14l" x={640} y={400} r={340} c={MONEY} o={0.4 + 0.2 * Math.sin(t / 6)} />
      <Light id="e14r" x={1280} y={400} r={340} c={WARM} o={0.5} />
      {/* left: a stack of notes glowing on the path's end; right: a lit window */}
      <g transform="translate(610 420) scale(2.1)">
        <rect x={-70} y={-30} width={140} height={46} rx={5} fill="#5FAE72" stroke="#2F6E49" strokeWidth={3} />
        <rect x={-60} y={-60} width={120} height={36} rx={5} fill="#6FBE82" stroke="#2F6E49" strokeWidth={3} />
      </g>
      <g transform="translate(1290 340) scale(1.6)">
        <rect x={-70} y={-60} width={140} height={150} fill="#2A1E1C" />
        <rect x={-58} y={-48} width={116} height={126} fill="#FFD9A0" />
        <path d="M 0 -48 L 0 78 M -58 14 L 58 14" stroke="#2A1E1C" strokeWidth={6} />
      </g>
      <Hero look={PIP} pose={{ ...pose, look, ...faceAt(t, [[0, 'neutral'], [18, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <Dust t={t} seed={14} x0={300} y0={200} w={1300} h={700} n={26} o={0.35} />
    </g>
  );
};

// ---------- E15: the left light: a river of 1.000 đ notes pouring down through green-gold light, "1.000 đ / GIÂY" ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t - 8) / 9));
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 900]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Night id="e15sky" />
      <Light id="e15a" x={960} y={500} r={900} c={MONEY} o={0.35} />
      {Array.from({ length: 16 }).map((_, i) => {
        const p = (t * 0.016 + i / 16) % 1;
        const x = 960 + Math.sin(p * 5 + i) * 320 + (rnd(3, i) - 0.5) * 380;
        const y = -120 + p * 1320;
        return <Note key={i} x={x} y={y} w={150 + rnd(4, i) * 60} rot={Math.sin(p * 9 + i) * 30} />;
      })}
      <g transform={`translate(960 560) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#F6FFF0" stroke="#0A2A18" strokeWidth={16} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 30px ${MONEY})` }}>1.000 đ</text>
        <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={84} letterSpacing={6} fill={MONEY} stroke="#0A2A18" strokeWidth={10} paintOrder="stroke">/ GIÂY</text>
      </g>
    </g>
  );
};

/** A dark silhouette (head and shoulders) for the window: hair shape by `kind`. */
export const Sil: React.FC<{ x: number; y: number; s: number; kind: 'mum' | 'sis' | 'mo'; bob: number }> = ({ x, y, s, kind, bob }) => (
  <g transform={`translate(${x} ${y + bob}) scale(${s})`} fill="#2A1614">
    <path d="M -70 120 Q -72 36 0 30 Q 72 36 70 120 Z" />
    <circle cx={0} cy={-8} r={46} />
    {kind === 'mum' ? <path d="M -56 -6 Q -60 -66 0 -66 Q 60 -66 56 -6 L 58 34 L 40 30 L 40 -20 L -40 -20 L -40 30 L -58 34 Z" /> : null}
    {kind === 'sis' ? <g><circle cx={-58} cy={-24} r={20} /><circle cx={58} cy={-24} r={20} /><rect x={-12} y={-62} width={24} height={10} /></g> : null}
    {kind === 'mo' ? <g><circle cx={-30} cy={-50} r={22} /><circle cx={0} cy={-58} r={24} /><circle cx={30} cy={-50} r={22} /><path d="M -52 -10 Q 0 -80 52 -10" stroke="#2A1614" strokeWidth={9} fill="none" /><circle cx={-54} cy={4} r={14} /><circle cx={54} cy={4} r={14} /></g> : null}
  </g>
);

// ---------- E16: the right light: a warm window in the dark, mum, her sister and Mo round a table, "+1 GIỜ / NGÀY" ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t - 10) / 9));
  const flick = 0.92 + 0.08 * Math.sin(t / 5);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Night id="e16sky" />
      <rect x={-300} y={780} width={2520} height={600} fill="#1A1220" />
      <Light id="e16a" x={760} y={470} r={780} c={WARM} o={0.5 * flick} />
      {/* the house wall and the window */}
      <rect x={140} y={140} width={1240} height={760} fill="#2E2230" />
      <rect x={260} y={230} width={1000} height={560} rx={8} fill="#FFD9A0" />
      <rect x={260} y={230} width={1000} height={560} rx={8} fill="#FF9A4A" opacity={0.28 * flick} />
      <path d="M 760 230 L 760 790 M 260 510 L 1260 510" stroke="#2E2230" strokeWidth={14} />
      <Sil x={440} y={390} s={1.25} kind="sis" bob={Math.sin(t / 8) * 4} />
      <Sil x={760 - 40} y={350} s={1.5} kind="mum" bob={Math.sin(t / 10 + 1) * 3} />
      <Sil x={1090} y={390} s={1.3} kind="mo" bob={Math.sin(t / 7 + 2) * 4} />
      <rect x={260} y={690} width={1000} height={100} fill="#8A5A3E" opacity={0.9} />
      <rect x={236} y={216} width={1048} height={20} rx={6} fill="#3A2A30" />
      <rect x={236} y={784} width={1048} height={22} rx={6} fill="#3A2A30" />
      <g transform={`translate(1500 520) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={136} fill="#FFF3DC" stroke="#3A1E10" strokeWidth={14} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 28px ${WARM})` }}>+1 GIỜ</text>
        <text y={100} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={74} letterSpacing={6} fill={WARM} stroke="#3A1E10" strokeWidth={10} paintOrder="stroke">/ NGÀY</text>
      </g>
      <Dust t={t} seed={16} x0={200} y0={200} w={1200} h={600} n={22} o={0.4} />
    </g>
  );
};

// ---------- E17: close-up, Pip between the two lights: green-gold on his left cheek, warm on his right ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.3 * (1 + 0.06 * clamp(t / len));
  const head = { x: 960, y: 520 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.0, facing: 1,
    look: kf(t, [[0, -0.9], [18, -0.9], [34, 0.9], [len, 0.9]]), headTilt: kf(t, [[0, -3], [26, 3], [len, 0]]),
    armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, sway: 2, ...faceAt(t, [[0, 'worried']]),
  };
  return (
    <g>
      <Night id="e17sky" />
      <Light id="e17l" x={160} y={520} r={760} c={MONEY} o={0.5 + 0.12 * Math.sin(t / 7)} />
      <Light id="e17r" x={1760} y={520} r={760} c={WARM} o={0.55} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} filter="url(#blur16)">
          <circle cx={120 + rnd(2, i) * 200} cy={200 + i * 210} r={34 + 16 * rnd(3, i)} fill={MONEY} opacity={0.25} />
          <circle cx={1700 + rnd(4, i) * 160} cy={240 + i * 190} r={34 + 16 * rnd(5, i)} fill={WARM} opacity={0.3} />
        </g>
      ))}
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Dust t={t} seed={17} x0={400} y0={200} w={1100} h={700} n={16} o={0.3} />
    </g>
  );
};
