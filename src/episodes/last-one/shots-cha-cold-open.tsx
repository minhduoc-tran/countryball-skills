import React from 'react';
import {
  LightVeil, Glow, Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, settle, camT, LOOKS, HEAD, joints, toWorld,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Tabletop, Classroom, SchoolDesk, Bedroom,
  Cookie, CookieTop, CookieStack, Plate, PlateTop, Paper, PaperBall, Phone, Foreground, Sparkle, FONT, ShotProps,
  Rooftop, TitleCard, LEG_LEN,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';

// "Sẽ ra sao nếu thế giới chỉ còn mình bạn?" The cold open, A1-A8: three demos of a world with nobody else in it.
// Cookies nobody fights you for (kitchen), a class with no teacher and no test (classroom), then a call to your best
// friend that nobody picks up (the phone at night). Each shot is a pure function of its own clock t.

const PIP = LOOKS.pipHood;

// ---------- A1: medium, the kitchen island: a whole pile of cookies, Pip's arms go up ----------
const S1_STAND = stand(KITCHEN, 0.42, 0.4);
const S1_PILE = islandTop(0.58, 0.45);
const PILE = [4, 3, 2, 1].flatMap((n, row) => Array.from({ length: n }).map((_, i) => ({ x: (i - (n - 1) / 2) * 50, y: -row * 22, seed: row * 4 + i })));
const CookiePile: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Plate x={0} y={8} s={1.1} />
    {PILE.map((c) => (
      <Cookie key={c.seed} x={c.x} y={c.y - 4} s={0.8} rot={(c.seed * 37) % 20 - 10} seed={c.seed + 20} />
    ))}
  </g>
);
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S1_STAND.x, y: S1_STAND.y, scale: S1_STAND.scale, yaw: 0.45, look: 0.8, armL: { a: 14, b: -6 }, armR: { a: 16, b: -8 } } },
    { f: 4, p: { squash: 0.05, headTilt: 3 } },
    { f: 9, p: { armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 }, squash: -0.04, headTilt: 0 }, ease: easeOut },
    { f: 13, p: { armL: { a: 142, b: 18 }, armR: { a: 142, b: 18 }, squash: 0 } },
    { f: 20, p: { armL: { a: 152, b: 10 }, armR: { a: 134, b: 22 }, headTilt: -3, squash: -0.02 } },
    { f: 28, p: { armL: { a: 140, b: 18 }, armR: { a: 146, b: 12 }, headTilt: 2, squash: 0 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [5, 'happy']]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1020]]), 590, kf(t, [[0, 1.8], [len, 1.9]]))}>
      <Kitchen t={t + 40} id="k1" />
      <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <CookiePile x={S1_PILE.x} y={S1_PILE.y} s={0.9} />
      <Sparkle x={S1_PILE.x + 40} y={S1_PILE.y - 90} t={t - 8} s={0.8} />
      <Foreground blur={10}>
        <path d="M 1260 1000 Q 1300 760 1420 700 Q 1380 820 1400 1000 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- A2: top-down over the island: a heaped plate, empty places round it; his mitten drags it all away ----------
const S2_COOKIES = [[0, 0], [-120, -60], [110, -70], [-130, 80], [120, 70], [0, -140], [0, 130], [-40, -10], [60, 10]];
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const pull = easeOut(clamp((t - 9) / 24));
  const dx = 150 * pull;
  const dy = -90 * pull;
  const hand = { x: kf(t, [[0, 1420], [7, 1190], [9, 1180]]) + dx, y: kf(t, [[0, 120], [7, 300], [9, 310]]) + dy };
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 525]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Tabletop edge={1300} wood="#A89C8A" grain="#968A78" lip="#8E8474" kind="stone" floor="#2C2A30" floorLines="#232127" />
      <LightVeil id="s2veil" lights={[[960, 480, 760]]} o={0.55} />
      <Glow x={960} y={440} r={640} o={0.32} />
      {/* the empty places: a clean plate and a folded napkin at each, nobody coming */}
      {[[330, 260, -12], [1600, 820, 8], [300, 860, 20]].map(([x, y, r], i) => (
        <g key={i}>
          <PlateTop x={x} y={y} r={150} />
          <rect x={x + 170} y={y - 70} width={34} height={150} rx={8} fill="#C9C1B0" transform={`rotate(${r} ${x} ${y})`} />
        </g>
      ))}
      <g transform={`translate(${dx} ${dy})`}>
        <PlateTop x={960} y={540} r={300} />
        {S2_COOKIES.map(([x, y], i) => (
          <CookieTop key={i} x={960 + x} y={540 + y} r={92} rot={i * 40} />
        ))}
      </g>
      <InsertArm x={hand.x} y={hand.y} fx={hand.x + 520} fy={hand.y - 520} rot={225} s={4.8} width={110} />
    </g>
  );
};

// ---------- A3: wide, the whole kitchen: Pip alone at the island, eating; the DÂN SỐ: 1 chip is the look ----------
const S3_STAND = stand(KITCHEN, 0.5, 0.4);
const S3_STACKS = [0.33, 0.4, 0.62, 0.68].map((u, i) => ({ p: islandTop(u, 0.55), n: 3 + ((i * 3) % 4) }));
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const chew = Math.sin(t / 2.2) * 2.5;
  const pose = poseAt(t, [
    { f: 0, p: { x: S3_STAND.x, y: S3_STAND.y, scale: S3_STAND.scale, yaw: 0.15, look: 0.2, armL: { a: 12, b: -6 }, armR: { a: 70, b: 60 } } },
    { f: 8, p: { armR: { a: 128, b: 112 } }, ease: easeOut },
  ]);
  const j = joints(pose);
  const h = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 566]]), kf(t, [[0, 0.98], [len, 1.04]]))}>
      <Kitchen t={t + 70} id="k3" veil={0.36} />
      <Hero look={PIP} pose={{ ...pose, headTilt: chew, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Cookie x={h.x + 4} y={h.y + 14} s={0.9} rot={-14} bite={t > 12 ? 1 : 0} seed={3} />
      <KitchenIsland />
      {S3_STACKS.map((c, i) => (
        <CookieStack key={i} x={c.p.x} y={c.p.y} n={c.n} s={0.9} />
      ))}
    </g>
  );
};

// ---------- A4: wide, the empty classroom: every seat empty, Pip at his desk with his arms out ----------
const ChalkTest: React.FC<{ cross?: number }> = ({ cross = 0 }) => (
  <g fontFamily={FONT.hand} fill="#EDE9DD" opacity={0.88}>
    <text x={740} y={330} textAnchor="middle" fontSize={92}>KIỂM TRA</text>
    <text x={740} y={440} textAnchor="middle" fontSize={84}>15 PHÚT</text>
    {cross > 0 ? (
      <g stroke="#F2B8A0" strokeWidth={14} strokeLinecap="round" fill="none">
        <path d="M 500 230 L 980 480" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(cross * 2)} />
        <path d="M 980 230 L 500 480" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(cross * 2 - 1)} />
      </g>
    ) : null}
  </g>
);
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1260, y: 760, yaw: -0.35, look: -0.8, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 4, p: {} },
    { f: 11, p: { armL: { a: 96, b: 8 }, armR: { a: 96, b: 8 }, look: 0.6 }, ease: easeOut },
    { f: 15, p: { armL: { a: 90, b: 12 }, armR: { a: 90, b: 12 } } },
    { f: 24, p: { armL: { a: 104, b: 6 }, armR: { a: 80, b: 16 }, look: -0.5, headTilt: 3 } },
    { f: 32, p: { armL: { a: 86, b: 14 }, armR: { a: 98, b: 8 }, look: 0.5, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 950]]), 530, kf(t, [[0, 0.9], [len, 0.95]]))}>
      <Classroom t={t + 120} empty board={<ChalkTest />} id="cls4" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [9, 'happy']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={1260} />
    </g>
  );
};

// ---------- A5: top-down on his school desk: the test paper; his mitten crumples it and flicks it away ----------
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const crush = clamp((t - 7) / 4);
  const fly = easeOut(clamp((t - 14) / 10));
  const ball = { x: 960 + 700 * fly, y: 560 - 620 * fly + 140 * fly * fly };
  const hand = t < 7
    ? { x: kf(t, [[0, 1500], [6, 1110]]), y: kf(t, [[0, 1180], [6, 720]]) }
    : t < 14 ? { x: kf(t, [[7, 1110], [11, 1010]]), y: kf(t, [[7, 720], [11, 620]]) } : { x: kf(t, [[14, 1010], [18, 1150]]), y: kf(t, [[14, 620], [18, 760]]) };
  return (
    <g transform={`translate(960 540) rotate(${-2 + t * 0.06}) scale(${1 + t * 0.002}) translate(-960 -540)`}>
      <Tabletop edge={1400} wood="#B08A5E" grain="#9C7A50" />
      <Glow x={1000} y={420} r={720} o={0.3} />
      {/* a pencil case, an eraser and a ruler by the edge of the desk */}
      <rect x={200} y={180} width={360} height={110} rx={40} fill="#3E6A8A" transform="rotate(-12 380 235)" />
      <rect x={1460} y={260} width={120} height={60} rx={10} fill="#E9A0A0" transform="rotate(16 1520 290)" />
      <rect x={220} y={860} width={420} height={44} fill="#D9C8A8" transform="rotate(-6 430 882)" />
      {crush < 1 ? (
        <g transform={`translate(960 560) scale(${1 - 0.7 * crush} ${1 - 0.75 * crush}) rotate(${crush * 30}) translate(-960 -560)`}>
          <Paper x={960} y={560} w={440} rot={-4} done={false} />
          <text x={960} y={318} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill="#3A4A6A" transform="rotate(-4 960 560)">KIỂM TRA 15 PHÚT</text>
        </g>
      ) : (
        <PaperBall x={ball.x} y={ball.y} r={100 * (1 + 0.08 * settle(t - 11, 4, 1.4, 4))} rot={t * 24} />
      )}
      <InsertArm x={hand.x} y={hand.y} fx={hand.x + 420} fy={hand.y + 620} rot={-30} s={5} width={116} fist={t >= 7 && t < 14} />
    </g>
  );
};

// ---------- A6: medium at the board: the test crossed out in chalk, Pip cheers; the DÂN SỐ: 1 chip again ----------
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    // he faces the board, so the hand that goes up is the near one (screen-left), clear of his hood
    { f: 0, p: { x: 1260, y: 760, yaw: -0.35, armL: { a: 10, b: -8 } } },
    { f: 3, p: {} },
    { f: 8, p: { armL: { a: 160, b: -18 }, sway: 10 }, ease: easeOut },
    { f: 11, p: { armL: { a: 150, b: -12 }, sway: -4 } },
    { f: 15, p: { sway: 0 } },
    { f: 21, p: { armL: { a: 168, b: -22 }, sway: 8, headTilt: 3 }, ease: easeOut },
    { f: 27, p: { armL: { a: 152, b: -12 }, sway: -3, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1040]]), kf(t, [[0, 540], [len, 532]]), kf(t, [[0, 1.7], [len, 1.78]]))}>
      <Classroom t={t + 240} empty board={<ChalkTest cross={clamp(t / 12)} />} id="cls6" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [14, 'smug']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={1260} />
    </g>
  );
};

// ---------- A7: top-down on his desk at night: the phone calling BẠN THÂN, the only light in the room ----------
export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const ring = t % 24 < 14 ? 1 : 0;
  const tap = { x: kf(t, [[0, 1500], [4, 1040], [6, 1032], [12, 1500]]), y: kf(t, [[0, 1240], [4, 760], [6, 752], [12, 1240]]) };
  const dots = '.'.repeat(1 + (Math.floor(t / 6) % 3));
  return (
    <g transform={`translate(960 540) rotate(${3 - t * 0.05}) scale(${1.02 + t * 0.0015}) translate(-960 -540)`}>
      <Tabletop edge={1400} wood="#5A4636" grain="#4C3B2D" />
      <LightVeil id="s7veil" lights={[[960, 540, 520]]} o={0.72} />
      <rect x={1380} y={760} width={300} height={14} rx={7} fill="#B89A5A" transform="rotate(-24 1530 767)" opacity={0.6} />
      <Phone x={960} y={520} w={300} rot={-5} on={1} caller="BẠN THÂN" buzz={ring} f={t} />
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} fill="#CFE6FF" letterSpacing={6} opacity={0.9}>
        {`ĐANG GỌI${dots}`}
      </text>
      {t < 12 ? <InsertArm x={tap.x} y={tap.y} fx={tap.x + 420} fy={tap.y + 640} rot={-35} s={5} width={116} point /> : null}
    </g>
  );
};

// ---------- A8: close-up: phone to his ear in the dark bedroom, waiting; the smile drops ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.05 * clamp(t / len));
  const head = { x: 1040, y: 580 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: kf(t, [[0, 0.5], [14, 0.9], [24, -0.3]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 2], [20, -5]]), ...faceAt(t, [[0, 'happy'], [12, 'neutral'], [20, 'worried']]),
  };
  // the phone held to the ear on the back of his head (screen-left), the arm drawn after him so the head can't hide it
  const ear = { x: head.x - HEAD.r * sc * 0.95, y: head.y + 10 };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -420) scale(1.8)">
          <Bedroom t={t + 300} id="bd8" clock="21:40" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.3} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      <g filter="url(#rimBlueL)">
        <path d={`M ${ear.x - 40} ${ear.y + 120} Q ${ear.x - 220} ${ear.y + 380} ${ear.x - 160} 1240`} stroke={PIP.line} strokeWidth={200} fill="none" strokeLinecap="round" />
        <path d={`M ${ear.x - 40} ${ear.y + 120} Q ${ear.x - 220} ${ear.y + 380} ${ear.x - 160} 1240`} stroke={PIP.limb} strokeWidth={176} fill="none" strokeLinecap="round" />
        <rect x={ear.x - 70} y={ear.y - 190} width={90} height={330} rx={26} fill="#16151C" stroke="#3A3846" strokeWidth={6} transform={`rotate(-12 ${ear.x} ${ear.y})`} />
        <ellipse cx={ear.x - 40} cy={ear.y + 90} rx={92} ry={78} fill={PIP.hand} stroke={PIP.line} strokeWidth={10} />
      </g>
    </g>
  );
};

// ---------- A9: the title, wide on the roof at dusk: Pip tiny over a silent city; holds ~3 s with a slow look round ----------
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 840 - LEG_LEN * 0.62, scale: 0.62, yaw: 0, look: 0, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } },
    { f: 20, p: {} },
    { f: 30, p: { yaw: -0.5, look: -0.8 }, ease: easeOut },
    { f: 48, p: {} },
    { f: 58, p: { yaw: 0.5, look: 0.8 }, ease: easeOut },
    { f: 74, p: {} },
    { f: 84, p: { yaw: 0.05, look: 0, headTilt: 3, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 548]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={t + 40} sunX={960} sunY={690 - 40 * easeOut(clamp(t / 40))} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [64, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <TitleCard t={t} lines={['SẼ RA SAO NẾU', 'THẾ GIỚI CHỈ CÒN MÌNH BẠN?']} accent="BẠN" accentT={44} size={84} y={170} />
    </g>
  );
};
