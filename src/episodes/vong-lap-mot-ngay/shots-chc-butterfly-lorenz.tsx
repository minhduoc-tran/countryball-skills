import React from 'react';
import { kf, clamp, easeOut, easeInOut, camT, faceAt, poseAt, ShotProps, Hero, Pose, basePose, LOOKS, Look, Classroom, Rooftop, Street, streetStand, TitleCard, DrawOn, Glow, FONT, UI, HEAD, Foreground, rnd } from '../../engine';
import { HeadOverlay } from './kit-cast-figures';
import { Butterfly } from './kit-props';
import { PAL } from './kit-palette';
import { PIP } from './chc-pip-in-bed';
import { YearRoll } from './chc-forgetting-props';
import { AmericasMap, MapLabel, Tornado, LORENZ_D, TEXAS, BRAZIL, AirSwirls } from './chc-butterfly-map-props';

// Chapter C, beat "5 butterfly" part 2 (165.93-180.02 s): C23 the calendar page rolls back to 1972 (C6's motif), C24 the meteorologist's talk
// (his attractor drawing itself on the board, name tag EDWARD LORENZ), C25 a butterfly flaps over Brazil, C26 the
// whirl crosses the map and a tornado spins up over Texas, C27 title "HIỆU ỨNG CÁNH BƯỚM" over the rooftop, C28 Pip
// in the street inside a giant butterfly's wings.

const SPEAKER: Look = { ...LOOKS.suit, jacket: '#4A4E5E', jacketShade: '#3A3E4C', accent: '#7A2E36', limb: '#4A4E5E', hair: '#A9A6B0' };

// ---------- C23: "Năm 1972": the calendar page from C6 rolls back again, landing on 1972 ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <rect x={-300} y={-300} width={2520} height={1680} fill="#141A28" />
    <Glow x={960} y={440} r={760} kind="cool" o={0.45} />
    {Array.from({ length: 6 }).map((_, k) => <path key={k} d={`M -200 ${140 + k * 170} C 400 ${60 + k * 170 + rnd(61, k) * 80} 1200 ${220 + k * 170} 2120 ${120 + k * 170}`} stroke="#3A5A7A" strokeWidth={4} fill="none" opacity={0.6} strokeDasharray="2 0" transform={`translate(${-((t * 2) % 200)} 0)`} />)}
    <YearRoll x={960} y={560} t={t} s={1.15} to={1972} />
  </g>
);

// ---------- C24: wide lecture: the speaker points at his chaotic double-loop on the board; name tag pops ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 1150, y: 745, scale: 0.82, yaw: -0.6, facing: -1, look: -0.4, armL: { a: 14, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 12, p: { armL: { a: 100, b: -14 }, handL: 'point' }, ease: easeOut },
    { f: 60, p: { armL: { a: 108, b: -10 }, headTilt: -4 } },
    { f: 80, p: { yaw: -0.2, look: 0.3, armL: { a: 60, b: 20 }, headTilt: 0 } },
  ]);
  const board = (
    <g>
      <g style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>
        <DrawOn d={LORENZ_D} t={t - 2} dur={86} color="#EDE8DA" width={2.6} />
      </g>
      <path d="M 450 524 L 1030 524 M 470 210 L 470 520" stroke="#EDE8DA" strokeWidth={3} opacity={0.5} />
    </g>
  );
  const tag = easeOut(clamp((t - 24) / 9));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 900], [len, 860]]), kf(t, [[0, 500], [len, 470]]), kf(t, [[0, 1.08], [len, 1.22]]))}>
        <Classroom t={t + 30} id="c24c" board={board} />
        <Hero look={SPEAKER} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [70, 'happy']]) }} rimId="rimL" shadow={0.4} />
        <HeadOverlay pose={pose} rimId="rimL">
          <g transform={`translate(${pose.yaw * 30} 0) scale(${1 - 0.28 * Math.abs(pose.yaw)} 1)`}>
            {[-21, 21].map((cx) => <rect key={cx} x={cx - 17} y={HEAD.y - 17} width={34} height={25} rx={7} fill="#FFFFFF" fillOpacity={0.1} stroke="#14121C" strokeWidth={4} />)}
            <path d={`M -4 ${HEAD.y - 8} L 4 ${HEAD.y - 8}`} stroke="#14121C" strokeWidth={4} />
          </g>
        </HeadOverlay>
        <Foreground blur={16}>
          {[[470, 940, '#1A1420'], [1290, 970, '#20141A']].map(([x, y, c], k) => (
            <g key={k}>
              <ellipse cx={x as number} cy={(y as number) + 160} rx={190} ry={140} fill="#0C0A12" />
              <circle cx={x as number} cy={y as number} r={110} fill={c as string} />
              <path d={`M ${(x as number) - 110} ${y} Q ${(x as number) - 100} ${(y as number) - 120} ${x} ${(y as number) - 112} Q ${(x as number) + 100} ${(y as number) - 120} ${(x as number) + 110} ${y} Z`} fill="#0A080E" />
            </g>
          ))}
        </Foreground>
      </g>
      {tag > 0 ? (
        <g transform={`translate(${110 - (1 - tag) * 60} 900)`} opacity={tag}>
          <rect x={0} y={-56} width={640} height={112} rx={20} fill={UI.pill} opacity={0.86} />
          <rect x={0} y={-56} width={12} height={112} rx={6} fill="#FF8A3D" />
          <text x={40} y={-6} fontFamily={FONT.ui} fontWeight={700} fontSize={48} fill={UI.text} letterSpacing={2}>EDWARD LORENZ</text>
          <text x={40} y={38} fontFamily={FONT.ui} fontSize={30} fill="#FFB15A" letterSpacing={3}>1972</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- C25: map close-up on Brazil: one butterfly flapping, air swirls curling off its wings ----------
export const C25: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 2.5], [len, 2.75]]);
  const b = { x: BRAZIL.x + Math.sin(t / 20) * 10, y: BRAZIL.y + Math.cos(t / 16) * 6 };
  return (
    <g transform={camT(BRAZIL.x + 20, BRAZIL.y + 10, z)}>
      <AmericasMap t={t} id="c25m" />
      <Glow x={b.x} y={b.y} r={160} o={0.4} />
      <AirSwirls x={b.x} y={b.y} t={t} s={0.5} />
      <Butterfly x={b.x} y={b.y} s={0.62} t={t} />
      <MapLabel x={BRAZIL.x - 110} y={BRAZIL.y + 140} t={t - 8} text="BRAZIL" s={0.5} />
    </g>
  );
};

// ---------- C26: the whole map: the whirl arcs north from Brazil and a tornado spins up over Texas ----------
export const C26: React.FC<ShotProps> = ({ t, len }) => {
  const arc = `M ${BRAZIL.x} ${BRAZIL.y} C ${BRAZIL.x + 260} ${BRAZIL.y - 360} ${TEXAS.x + 300} ${TEXAS.y + 120} ${TEXAS.x + 10} ${TEXAS.y + 30}`;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <AmericasMap t={t + 40} id="c26m" />
      <g style={{ filter: `drop-shadow(0 0 10px ${PAL.cyan})` }} strokeDasharray="1 0">
        <DrawOn d={arc} t={t} dur={24} color={PAL.cyanSoft} width={8} />
      </g>
      <Butterfly x={BRAZIL.x} y={BRAZIL.y} s={0.3} t={t} />
      <Tornado x={TEXAS.x + 20} y={TEXAS.y + 30} s={0.6} t={t} grow={easeOut(clamp((t - 20) / 26))} />
      <MapLabel x={TEXAS.x - 190} y={TEXAS.y + 70} t={t - 26} text="TEXAS" s={0.9} />
      <MapLabel x={BRAZIL.x + 40} y={BRAZIL.y + 150} t={t - 2} text="BRAZIL" s={0.8} />
    </g>
  );
};

// ---------- C27: low angle on the rooftop at dusk: a butterfly crosses past Pip; title "HIỆU ỨNG / CÁNH BƯỚM" ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => {
  const low = 120;
  const bx = kf(t, [[0, 1500], [len, 820]]);
  const by = 560 + Math.sin(t / 8) * 30;
  const pose: Pose = { ...basePose, x: 700, y: 820 + low - 140 * 1.05, scale: 1.05, yaw: 0.45, facing: 1, look: clamp((bx - 700) / 600, -1, 1), headTilt: -8, armL: { a: 10, b: -8 }, armR: { a: 12, b: -8 } };
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 200} low={low} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Glow x={bx} y={by} r={140} o={0.45} />
      <Butterfly x={bx} y={by} s={0.75} t={t} />
      <TitleCard t={t} lines={['HIỆU ỨNG', 'CÁNH BƯỚM']} accent="BƯỚM" accentT={30} y={190} size={150} />
    </g>
  );
};

// ---------- C28: pull back: Pip stands in the street, a giant butterfly's wings open behind him: he lives in it ----------
export const C28: React.FC<ShotProps> = ({ t, len }) => {
  const st = streetStand(-0.2, 6.2);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, ...st, yaw: 0.12, facing: 1, look: -0.2, headTilt: -10, armL: { a: 14, b: -8 }, armR: { a: 14, b: -8 } } },
    { f: 30, p: { armL: { a: 34, b: -6 }, armR: { a: 36, b: -6 }, headTilt: -14 } },
  ]);
  const chest = { x: st.x, y: st.y - 120 * st.scale };
  const z = kf(t, [[0, 3.0], [len, 1.0]], easeInOut);
  const cy = kf(t, [[0, chest.y - 60], [len, 540]], easeInOut);
  const cx = kf(t, [[0, chest.x], [len, 960]], easeInOut);
  const wings = easeOut(clamp(t / 30));
  return (
    <g>
      <g transform={camT(cx, cy, z)}>
        <Street t={t + 700} id="c28s" veil={0.25} />
        <Glow x={chest.x} y={chest.y} r={700} o={0.55 * wings} />
        <g opacity={0.62 * wings} style={{ filter: 'drop-shadow(0 0 30px #FFB15A)' }}>
          <Butterfly x={chest.x} y={chest.y - 40} s={2.4 + 1.8 * wings} t={t * 0.18 + 6} />
        </g>
        <Glow x={st.x} y={st.y - 100 * st.scale} r={260 * st.scale * 2} o={0.5} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [26, 'happy']]) }} rimId="rimR" shadow={0.6} />
      </g>
    </g>
  );
};
