import React from 'react';
import {
  Street, streetStand, Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, rnd, camT, LOOKS, LEG_LEN, HEAD,
  Schematic, SCH, SchLabel, Glow, LightVeil, Dust, Tabletop, Foreground, Rooftop, Study, Desk, OpenBook, BookTower,
  Bedroom, BEDROOM, WINDOW, stand, ShotProps, FONT,
} from '../../engine';
import { CostCard, Dim, Candle, Grass } from './shots-chc-shared-props-and-cards';

// Chapter C, beats "internet", "nature" and "silence" (C20-C29): the data centres run dry, the phone is a brick, a
// library by candlelight; then the grass comes back; then the quiet.

const PIP = LOOKS.pipHood;
const RED = '#FF5A4A';

// ---------- C20: "5 · INTERNET" ----------
export const C20: React.FC<ShotProps> = ({ t, len }) => <CostCard t={t} len={len} n={5} word="INTERNET" icon="wifi" id="sc20" />;

// ---------- C21: schematic: server racks blinking; the backup generator's fuel runs to empty; the lights go off ----------
const RACKS = [250, 490, 730];
const LEDS = RACKS.flatMap((rx, ri) => Array.from({ length: 12 }).flatMap((_, row) => [0, 1].map((k) => ({ x: rx + 38 + k * 26, y: 300 + row * 50, seed: ri * 40 + row * 2 + k, off: 100 + rnd(5, ri * 24 + row * 2 + k) * 14 }))));
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const level = 1 - clamp((t - 56) / 50);
  const dead = t > 112;
  const col = level < 0.25 ? RED : SCH.live;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sc21" />
      <SchLabel x={490} y={190} t={t - 2} text="TRUNG TÂM DỮ LIỆU" size={44} />
      {RACKS.map((rx) => (
        <g key={rx}>
          <rect x={rx} y={260} width={200} height={640} rx={8} fill="#0C1626" stroke={SCH.line} strokeWidth={5} />
          {Array.from({ length: 12 }).map((_, row) => (
            <path key={row} d={`M ${rx + 12} ${300 + row * 50 - 22} L ${rx + 188} ${300 + row * 50 - 22}`} stroke={SCH.dim} strokeWidth={2} />
          ))}
        </g>
      ))}
      {LEDS.map((l, i) => {
        const alive = t < l.off;
        const blink = alive && rnd(l.seed, Math.floor(t / 4)) > 0.35;
        const c = l.seed % 3 === 0 ? SCH.live : '#5BE38A';
        return <circle key={i} cx={l.x} cy={l.y} r={7} fill={blink ? c : '#1C2C44'} style={blink ? { filter: `drop-shadow(0 0 6px ${c})` } : undefined} />;
      })}
      <SchLabel x={1400} y={350} t={t - 24} text="MÁY PHÁT DỰ PHÒNG" size={44} />
      <rect x={1130} y={460} width={540} height={90} rx={14} fill="none" stroke={level <= 0 && t % 10 < 5 ? RED : SCH.line} strokeWidth={6} />
      <rect x={1140} y={470} width={520 * level} height={70} rx={8} fill={col} style={{ filter: `drop-shadow(0 0 10px ${SCH.glow}88)` }} />
      <text x={1400} y={680} textAnchor="middle" fontFamily={FONT.ui} fontSize={110} fill={col}>
        {`${Math.round(level * 100)}%`}
      </text>
      {dead ? <SchLabel x={1400} y={850} t={t - 112} text="TẮT" size={120} color={RED} /> : null}
    </g>
  );
};

// ---------- C22: insert: a dead-network phone: the map and the video app, each crossed out ----------
const Cross: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
  <g stroke={RED} strokeWidth={12} strokeLinecap="round">
    <path d={`M ${x - 70} ${y - 70} L ${x + 70} ${y + 70}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p * 2)} />
    <path d={`M ${x + 70} ${y - 70} L ${x - 70} ${y + 70}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p * 2 - 1)} />
  </g>
);
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const mapIn = clamp((t - 12) / 6);
  const vidIn = clamp((t - 44) / 6);
  const mapX = easeOut(clamp((t - 28) / 8));
  const vidX = easeOut(clamp((t - 58) / 8));
  return (
    <g transform={`translate(960 540) rotate(${kf(t, [[0, -3], [len, 1]])}) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#3E3028" grain="#32261F" lip="#4E3C30" />
      <Glow x={1560} y={160} r={700} o={0.3} />
      <circle cx={960} cy={540} r={760} fill="url(#g3cool)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
      <rect x={720} y={50} width={500} height={980} rx={80} fill="#16151C" stroke="#3A3846" strokeWidth={8} />
      <rect x={742} y={72} width={456} height={936} rx={62} fill="#0E1626" />
      <rect x={742} y={72} width={456} height={420} rx={62} fill="#1C2C48" opacity={0.7} />
      {/* no signal: a wifi fan with a slash, and the words */}
      <g transform="translate(970 230) scale(1.5)" stroke="#CFE6FF" strokeWidth={7} fill="none" strokeLinecap="round">
        <path d="M -56 -12 Q 0 -66 56 -12 M -36 10 Q 0 -24 36 10 M -16 30 Q 0 18 16 30" />
        <circle cx={0} cy={48} r={5} fill="#CFE6FF" />
        <path d="M -60 -50 L 60 62" stroke={RED} strokeWidth={9} />
      </g>
      <text x={970} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3" letterSpacing={2}>KHÔNG CÓ KẾT NỐI</text>
      <g transform={`translate(850 620) scale(${mapIn})`} opacity={1 - 0.5 * mapX}>
        <rect x={-70} y={-70} width={140} height={140} rx={30} fill="#3E8A78" />
        <path d="M -70 -10 L 70 -34 M -20 -70 L 10 70" stroke="#F6EFE3" strokeWidth={6} opacity={0.7} />
        <path d="M 0 -8 Q -26 -34 0 -54 Q 26 -34 0 -8 Z" fill="#E4544A" />
        <circle cx={0} cy={-36} r={6} fill="#F6EFE3" />
      </g>
      <g transform={`translate(1090 620) scale(${vidIn})`} opacity={1 - 0.5 * vidX}>
        <rect x={-70} y={-70} width={140} height={140} rx={30} fill="#C8423C" />
        <path d="M -20 -34 L 36 0 L -20 34 Z" fill="#F6EFE3" />
      </g>
      {mapIn > 0 ? <text x={850} y={730} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#CFE6FF">BẢN ĐỒ</text> : null}
      {vidIn > 0 ? <text x={1090} y={730} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#CFE6FF">VIDEO</text> : null}
      <Cross x={850} y={620} p={mapX} />
      <Cross x={1090} y={620} p={vidX} />
      <Candle x={340} y={470} t={t + 3} s={1.3} glow={0.5} />
    </g>
  );
};

// ---------- C23: medium: Pip in the dark study, thinking: a sprout, then a plaster in his thought cloud ----------
const SPROUT = (
  <g stroke="#4E7B3A" strokeWidth={8} fill="none" strokeLinecap="round">
    <path d="M 0 40 L 0 -6" />
    <path d="M 0 -6 Q -50 -10 -50 -50 Q 0 -50 0 -6 Z" fill="#5E8E42" />
    <path d="M 0 10 Q 44 6 46 -30 Q 0 -30 0 10 Z" fill="#6FAE4C" />
  </g>
);
export const C23: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 780, y: 712, scale: 1.05, yaw: 0.3, look: 0.6, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 18, p: { look: 0.9, headTilt: -5 }, ease: easeOut },
    { f: 46, p: { look: 0.6, headTilt: 4 } },
  ]);
  const cloud = easeOut(clamp((t - 8) / 8));
  const sp = clamp((t - 18) / 6);
  const bd = clamp((t - 46) / 6);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 500, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Study t={t + 200} id="st23" night veil={0.5} />
      <Dim o={0.42} />
      <Glow x={1130} y={480} r={420} kind="cool" o={0.25} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [16, 'worried']]) }} rimId="rimBlue" shadow={0.6} />
      <g transform={`translate(1080 380) scale(${cloud})`}>
        <circle cx={-56} cy={110} r={11} fill="#EDE6D6" />
        <circle cx={-90} cy={140} r={6} fill="#EDE6D6" />
        {[[-120, 0, 86], [-40, -40, 90], [60, -34, 90], [140, 6, 80], [20, 26, 100], [-70, 30, 80]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#EDE6D6" stroke="#8A8A9A" strokeWidth={4} />
        ))}
        {[[-120, 0, 86], [-40, -40, 90], [60, -34, 90], [140, 6, 80], [20, 26, 100], [-70, 30, 80]].map(([x, y, r], i) => (
          <circle key={`f${i}`} cx={x} cy={y} r={r - 3} fill="#EDE6D6" />
        ))}
        <g transform={`translate(-60 4) scale(${sp * 1.1})`}>{SPROUT}</g>
        <g transform={`translate(100 4) rotate(-30) scale(${bd * 1.1})`}>
          <rect x={-62} y={-24} width={124} height={50} rx={12} fill="#E8C49A" stroke="#B8946A" strokeWidth={3} />
          <rect x={-22} y={-24} width={44} height={50} fill="#F6E4C8" />
        </g>
        <text x={20} y={-4} textAnchor="middle" fontFamily={FONT.hand} fontSize={100} fill="#7A6A8A" opacity={t > 62 ? 1 : 0}>?</text>
      </g>
    </g>
  );
};

// ---------- C24: medium: the library by candlelight: a tower of books, an open book, pages turning ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, scale: 1, yaw: 0.2, look: 0, tilt: 7, headTilt: 5, armL: { a: 34, b: 44 }, armR: { a: 34, b: 44 } } },
    { f: 20, p: { headTilt: 2 } },
    { f: 60, p: { headTilt: 6 } },
  ]);
  const flip = (a: number) => clamp((t - a) / 12);
  const turn = [16, 40, 64].map(flip).find((v) => v > 0 && v < 1) ?? 0;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 970]]), 580, kf(t, [[0, 1.65], [len, 1.8]]))}>
      <Study t={t + 100} id="st24" night veil={0.5} />
      <Dim o={0.5} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} laptop={false} lamp={false} />
      <BookTower x={690} y={698} n={8} s={1.1} />
      <BookTower x={1290} y={698} n={4} s={0.9} />
      <OpenBook x={960} y={706} w={300} turn={turn} cover="#7A4A4A" />
      <Candle x={1170} y={700} t={t + 11} s={1.2} />
      <Dust t={t} seed={4} x0={700} y0={420} w={600} h={300} n={22} />
    </g>
  );
};

// ---------- C25 and C27: the roof going green. grow 0..1: weeds along the parapet, tufts on the deck, ivy on the lip ----------
const WEEDS = Array.from({ length: 26 }).map((_, i) => ({ x: -200 + rnd(3, i) * 2300, y: 796 + (i % 3) * 3, h: 50 + rnd(4, i) * 70 }));
const DECK = Array.from({ length: 20 }).map((_, i) => ({ x: -100 + rnd(8, i) * 2100, y: 850 + rnd(9, i) * 190, h: 60 + rnd(10, i) * 90 }));
const Overgrowth: React.FC<{ t: number; grow: number; boost?: number }> = ({ t, grow, boost = 1 }) => (
  <g>
    {WEEDS.map((w, i) => (
      <Grass key={`w${i}`} x={w.x} y={w.y} t={t + i * 3} h={w.h * boost} grow={clamp(grow * 1.4 - rnd(2, i) * 0.4)} w={50} n={8} seed={i + 1} />
    ))}
    {Array.from({ length: 30 }).map((_, i) => {
      const x = -150 + i * 78;
      const g = clamp(grow * 1.5 - rnd(6, i) * 0.5);
      return g > 0 ? <ellipse key={`iv${i}`} cx={x} cy={792 + Math.sin(i * 1.9) * 4} rx={18 * g} ry={10 * g} fill={i % 2 ? '#4E7B3A' : '#3F6A32'} /> : null;
    })}
    {DECK.map((d, i) => (
      <Grass key={`d${i}`} x={d.x} y={d.y} t={t + i * 5} h={d.h * boost * (0.6 + (d.y - 850) / 260)} grow={clamp(grow * 1.3 - rnd(7, i) * 0.3)} w={70} n={10} seed={i + 40} />
    ))}
  </g>
);

export const C25: React.FC<ShotProps> = ({ t, len }) => {
  const at = streetStand(-2.2, 9.5, { k: 1.6 });
  const pose = poseAt(t, [
    { f: 0, p: { ...at, yaw: 0.5, look: 0.7, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 30, p: { look: 0.3, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Street t={t + 400} id="st25" grass={0.25 + 0.4 * easeOut(clamp(t / 50))} blackout={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.5} />
    </g>
  );
};

// ---------- C26: insert: a crack in the paving; grass pushes up through it, a flower opens ----------
export const C26: React.FC<ShotProps> = ({ t, len }) => {
  const crackPts = [[150, 900], [420, 820], [560, 860], [820, 760], [1000, 790], [1260, 690], [1500, 720], [1780, 620]];
  const d = crackPts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const at = (x: number) => {
    for (let i = 0; i < crackPts.length - 1; i++) {
      const [x0, y0] = crackPts[i];
      const [x1, y1] = crackPts[i + 1];
      if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
    return 800;
  };
  const tufts = [[300, 0], [600, 6], [870, 12], [1100, 4], [1380, 14], [1640, 8]];
  const flower = easeOut(clamp((t - 30) / 12));
  const fx = 1100;
  const fy = at(fx);
  return (
    <g transform={`translate(960 540) rotate(${kf(t, [[0, 2], [len, -1]])}) scale(${kf(t, [[0, 1], [len, 1.12]])}) translate(-960 -540)`}>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#3A3944" />
      {[-5, -3, -1, 1, 3, 5].map((i) => (
        <path key={i} d={`M ${960 + i * 520} 1200 L ${960 + i * 70} 60`} stroke="#2A2932" strokeWidth={6} />
      ))}
      {[300, 560, 960].map((y, i) => (
        <path key={y} d={`M -200 ${y} L 2200 ${y - 40 + i * 20}`} stroke="#2A2932" strokeWidth={5} />
      ))}
      <rect x={-400} y={-400} width={2720} height={1880} fill="url(#g3fadeDown)" opacity={0.3} />
      <path d={d} stroke="#0B0B12" strokeWidth={26} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} stroke="#16151E" strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 -6)" />
      {[[240, 980, 22], [700, 960, 14], [1200, 920, 18], [1560, 900, 12]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.6} fill="#55535F" />
      ))}
      {tufts.map(([x, d0], i) => (
        <Grass key={i} x={x} y={at(x) + 4} t={t + i * 4} h={230 + (i % 3) * 50} w={70} n={11} seed={i + 70} grow={easeOut(clamp((t - d0) / 30))} />
      ))}
      {flower > 0 ? (
        <g>
          <path d={`M ${fx} ${fy} Q ${fx + 14} ${fy - 150 * flower} ${fx} ${fy - 260 * flower}`} stroke="#4E7B3A" strokeWidth={8} fill="none" strokeLinecap="round" />
          <g transform={`translate(${fx} ${fy - 260 * flower}) scale(${flower})`}>
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <ellipse key={k} cx={0} cy={-26} rx={14} ry={26} fill="#F4D24A" transform={`rotate(${k * 60})`} />
            ))}
            <circle r={14} fill="#E8833A" />
          </g>
        </g>
      ) : null}
      <Glow x={1700} y={160} r={800} o={0.35} />
      <LightVeil id="c26veil" lights={[[1100, 640, 900]]} o={0.35} />
      <Foreground blur={10}>
        <Grass x={120} y={1100} t={t} h={260} w={160} n={9} seed={90} grow={0.9} />
        <Grass x={1860} y={1110} t={t + 7} h={300} w={160} n={9} seed={91} grow={0.9} />
      </Foreground>
    </g>
  );
};

// ---------- C27: wide: golden light on a city nobody tends; the roof is a meadow; Pip a speck in it ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 480, y: 890 - LEG_LEN * 0.8, scale: 0.8, yaw: 0.6, look: 0.8, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 60, p: { look: 0.3, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 0.98], [len, 1.14]]))}>
      <Rooftop t={t + 500} sunX={1300} sunY={kf(t, [[0, 700], [len, 640]])} blackout={1} lightsOut={1} cityLit={2.6} />
      <Overgrowth t={t} grow={1} boost={1.5} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [60, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Foreground blur={10}>
        <Grass x={-20} y={1130} t={t} h={330} w={240} n={10} seed={95} />
        <Grass x={1900} y={1130} t={t + 9} h={360} w={240} n={10} seed={96} />
      </Foreground>
    </g>
  );
};

// ---------- C28 and C29: the bedroom, power long gone: one candle on the floor, Pip sitting by it ----------
const FLOOR_AT = BEDROOM.P(0.62, 1, 0.34);
const SIT = stand(BEDROOM, 0.62, 0.34);
const sitPose = (t: number): Pose => ({
  ...basePose, x: SIT.x, y: FLOOR_AT.y - 8 * SIT.scale, scale: SIT.scale, yaw: 0.85, facing: 1,
  legL: { a: 86, b: -4 }, legR: { a: 80, b: 4 }, armL: { a: 8, b: 14 }, armR: { a: 12, b: 18 },
  headTilt: 4 + Math.sin(t / 30) * 1.2, look: 0.7, blink: 0,
});
const DeadBedroom: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Bedroom t={t} id={id} lamp={0} clock="" crossed={0} veil={0.6} />
    {/* the window's city is dark now: silhouettes only */}
    <g>
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={WINDOW.x0 + 6 + i * 28} y={WINDOW.y1 - 20 - rnd(14, i) * 46} width={30} height={90} fill="#0B0F24" />
      ))}
    </g>
    <Dim o={0.5} />
    <Glow x={1200} y={470} r={300} kind="cool" o={0.22} />
  </g>
);
const FloorCandle: React.FC<{ t: number }> = ({ t }) => <Candle x={FLOOR_AT.x + 250} y={FLOOR_AT.y - 4} t={t} s={0.7} />;

export const C28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, FLOOR_AT.x + 80], [len, FLOOR_AT.x + 60]]), kf(t, [[0, FLOOR_AT.y - 150], [len, FLOOR_AT.y - 120]]), kf(t, [[0, 1.5], [len, 2.5]]))}>
    <DeadBedroom t={t + 400} id="bd28" />
    <Hero look={PIP} pose={{ ...sitPose(t), ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={0.7} />
    <FloorCandle t={t} />
    <Dust t={t} seed={19} x0={FLOOR_AT.x - 200} y0={FLOOR_AT.y - 400} w={500} h={400} n={22} />
  </g>
);

export const C29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <DeadBedroom t={t + 500} id="bd29" />
    <Hero look={PIP} pose={{ ...sitPose(t + 40), ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={0.7} />
    <FloorCandle t={t + 20} />
    <Dust t={t} seed={23} x0={700} y0={400} w={500} h={400} n={20} />
  </g>
);
