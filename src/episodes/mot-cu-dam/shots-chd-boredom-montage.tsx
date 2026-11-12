import React from 'react';
import { Street, Schematic, ShotProps, kf, camT, clamp, backOut, Hero, basePose, LOOKS, faceAt, WallCalendar, DizzyStars, streetStand } from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { ImpactFlash, Shockwave, Debris, DustCloud, shakeAt } from './punch-fx-kit';
import { PunchPip, punchFist } from './punch-pip-and-fist';
import { GiantCockroach } from './giant-cockroach';
import { RogueRobot, BoltRain } from './rogue-robot';
import { FlyingPages, Robber, TimerChip, EcgMonitor, Tumbler } from './chd-boredom-props';

// Chapter D, boredom montage (D21-D30, 167.56-178.79 s), "bored" look: a week then a month of calendar pages, three
// one-second fights (monster, robot, robber) each stamped 00:01, the stamps side by side, a calm heart monitor,
// Pip's blank face, a steady hand and a glass that never ripples, and him standing nowhere in particular.

const PIP = LOOKS.pipHood;
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// a flat dull wall for the quiet shots
const Wall: React.FC<{ id: string; c0?: string; c1?: string }> = ({ id, c0 = '#5A5E6C', c1 = '#2A2C38' }) => (
  <g>
    <defs>
      <radialGradient id={`${id}wall`} cx="50%" cy="45%" r="80%">
        <stop offset="0%" stopColor={c0} />
        <stop offset="100%" stopColor={c1} />
      </radialGradient>
    </defs>
    <rect x={-100} y={-100} width={2120} height={1280} fill={`url(#${id}wall)`} />
  </g>
);

// D21 (37 f): "Một tuần trôi qua.": a wall calendar, seven days crossed off one by one
export const D21: React.FC<ShotProps> = ({ t }) => {
  const days = Math.min(7, Math.floor(t / 4.2));
  const draw = clamp((t % 4.2) / 3.2);
  return (
    <g>
      <Wall id="d21" />
      <g transform={`translate(0 ${kf(t, [[0, 18], [37, -10]])})`}>
        <WallCalendar x={960} y={130} w={620} crossed={days} drawing={days < 7 ? draw : 0} />
      </g>
    </g>
  );
};

// D22 (32 f): "Rồi một tháng.": the pages rip off and fly
export const D22: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Wall id="d22" c0="#4C5062" c1="#22242E" />
    <WallCalendar x={760} y={150} w={560} crossed={31} />
    <FlyingPages t={t} x={760} y={420} w={420} n={14} step={2} />
    <FlyingPages t={t + 3} x={760} y={420} w={420} n={14} step={2} />
  </g>
);

// ---- one-second fights (D23 monster, D24 robot, D25 robber): street, one punch, 00:01 chip
const FightBase: React.FC<{ t: number; id: string; children: React.ReactNode; zoom?: number; cx?: number; hitT: number }> = ({ t, id, children, zoom = 1.25, cx = 960, hitT }) => {
  const sk = shakeAt(t, hitT, 20, 12);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(cx, 580, zoom)}>
        <Street t={t + 60} id={id} night />
        {children}
      </g>
    </g>
  );
};

export const D23: React.FC<ShotProps> = ({ t }) => {
  const hitT = 9;
  const o = { x: 700, ground: 735, scale: 0.72, side: 1 as const, aim: 98, lunge: 70, windLen: 6 };
  const fist = punchFist(t, hitT, o);
  const rx = kf(t, [[0, 1330], [hitT, 1200]]);
  return (
    <g>
      <FightBase t={t} id="d23" hitT={hitT} zoom={1.3} cx={1000}>
        <GiantCockroach t={t} x={rx} y={690} scale={1.08} facing={-1} hit={clamp((t - hitT) / 24)} flyDist={1500} walk={t < hitT ? 1 : 0.4} rimId="rimBlue" />
        <Shockwave t={t} hitT={hitT} x={fist.x + 20} y={fist.y} r={420} len={14} />
        <DustCloud t={t} hitT={hitT} x={900} y={730} r={100} len={30} />
        <PunchPip t={t} hitT={hitT} {...o} rimId="rimBlue" />
        <Debris t={t} hitT={hitT} x={905} y={540} n={16} power={1.1} dir={-25} cone={200} groundY={725} />
        <ImpactFlash t={t} hitT={hitT} x={fist.x + 30} y={fist.y} r={380} />
      </FightBase>
      <TimerChip t={t} at={hitT + 3} x={330} y={120} />
    </g>
  );
};

export const D24: React.FC<ShotProps> = ({ t }) => {
  const hitT = 9;
  const o = { x: 690, ground: 905, scale: 0.7, side: 1 as const, aim: 70, lunge: 90, windLen: 6 };
  const fist = punchFist(t, hitT, o);
  return (
    <g>
      <FightBase t={t} id="d24" hitT={hitT} zoom={1.0}>
        <RogueRobot t={t} x={1000} y={880} scale={kf(t, [[0, 0.62], [hitT, 0.78]])} burst={clamp((t - hitT - 1) / 18)} walk={t < hitT ? 1 : 0} id="d24r" />
        <Shockwave t={t} hitT={hitT} x={fist.x + 40} y={fist.y} r={420} len={14} />
        <PunchPip t={t} hitT={hitT} {...o} rimId="rimBlue" />
        <Debris t={t} hitT={hitT} x={fist.x + 60} y={fist.y} n={18} power={1.3} dir={-35} cone={240} groundY={910} colors={['#C4622D', '#6B7280', '#8E3F1C', '#3E4450']} />
        <BoltRain t={t} startT={hitT + 3} x0={300} x1={1600} groundY={930} n={40} size={1.7} span={8} />
        <ImpactFlash t={t} hitT={hitT} x={fist.x + 40} y={fist.y} r={400} />
      </FightBase>
      <TimerChip t={t} at={hitT + 3} x={330} y={120} />
    </g>
  );
};

export const D25: React.FC<ShotProps> = ({ t }) => {
  const hitT = 10;
  const o = { x: 640, ground: 735, scale: 0.72, side: 1 as const, aim: 90, lunge: 70, windLen: 6 };
  const fist = punchFist(t, hitT, o);
  return (
    <g>
      <FightBase t={t} id="d25" hitT={hitT} zoom={1.35} cx={1000}>
        <Robber t={t} hitT={hitT} x={1010} ground={735} scale={0.72} side={-1} flyDist={900} />
        <Shockwave t={t} hitT={hitT} x={fist.x + 20} y={fist.y} r={380} len={14} />
        <DustCloud t={t} hitT={hitT} x={860} y={735} r={90} len={30} />
        <PunchPip t={t} hitT={hitT} {...o} rimId="rimBlue" />
        <Debris t={t} hitT={hitT} x={fist.x + 30} y={fist.y} n={12} power={1.0} dir={-20} cone={200} groundY={730} colors={['#8A7A4A', '#E9C46A', '#5E6270']} />
        <ImpactFlash t={t} hitT={hitT} x={fist.x + 30} y={fist.y} r={360} />
      </FightBase>
      <TimerChip t={t} at={hitT + 3} x={330} y={120} />
    </g>
  );
};

// small line icons for the three beaten foes (D26)
const FoeIcon: React.FC<{ kind: 0 | 1 | 2 }> = ({ kind }) => {
  if (kind === 0)
    return (
      <g stroke="#16101A" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
        {[-1, 1].map((sx) => [-60, 0, 60].map((y) => <path key={`${sx}${y}`} d={`M ${sx * 40} ${y} L ${sx * 100} ${y + (y === 0 ? 0 : y > 0 ? 28 : -28)} L ${sx * 124} ${y + 40}`} fill="none" />))}
        <path d="M -14 -112 Q -50 -170 -80 -160 M 14 -112 Q 50 -170 80 -160" fill="none" />
        <ellipse cx={0} cy={0} rx={62} ry={112} fill="#8A4A22" />
        <ellipse cx={0} cy={-102} rx={34} ry={28} fill="#5A2C14" />
        <path d="M 0 -80 V 100" fill="none" opacity={0.5} />
      </g>
    );
  if (kind === 1)
    return (
      <g stroke="#16101A" strokeWidth={6} strokeLinejoin="round">
        <path d="M 0 -80 V -130" fill="none" strokeLinecap="round" />
        <circle cx={0} cy={-138} r={14} fill="#FF2A2A" />
        <rect x={-100} y={-80} width={200} height={170} rx={24} fill="#C4622D" />
        <rect x={-62} y={-44} width={124} height={50} rx={12} fill="#3E4450" />
        <circle cx={0} cy={-19} r={16} fill="#FF2A2A" />
        <rect x={-60} y={44} width={120} height={22} rx={8} fill="#6B7280" />
      </g>
    );
  return (
    <g stroke="#16101A" strokeWidth={6} strokeLinejoin="round">
      <circle cx={0} cy={0} r={96} fill="#F6EFE3" />
      <path d="M -98 -20 Q 0 -150 98 -20 L 94 -50 Q 0 -140 -94 -50 Z" fill="#5E6270" />
      <rect x={-96} y={-26} width={192} height={52} rx={16} fill="#0B0910" />
      <circle cx={-36} cy={0} r={11} fill="#F6EFE3" />
      <circle cx={36} cy={0} r={11} fill="#F6EFE3" />
      <path d="M -30 56 Q 0 74 30 56" fill="none" strokeLinecap="round" />
    </g>
  );
};

// D26 (61 f): "Trận nào cũng kết thúc sau một giây.": three beaten foes side by side, each stamped 00:01
export const D26: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d26" />
    {([0, 1, 2] as const).map((k) => {
      const at = 4 + k * 13;
      const s = backOut(lin(t, at - 3, 8));
      const x = 380 + k * 580;
      return (
        <g key={k} transform={`translate(${x} 0)`}>
          <g transform={`translate(0 440) rotate(${t >= at + 6 ? 8 * (k === 1 ? -1 : 1) : 0}) scale(${s * 1.15})`}>
            <FoeIcon kind={k} />
          </g>
          {t >= at + 6 ? <DizzyStars x={0} y={270} t={t - at - 6} rx={110} ry={30} /> : null}
          <TimerChip t={t} at={at + 4} x={0} y={780} s={1.05} />
        </g>
      );
    })}
  </g>
);

// D27 (53 f): "Tim bạn không còn đập nhanh nữa.": a heart monitor, calm slow tiny beats
export const D27: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Wall id="d27" c0="#222838" c1="#0C0F18" />
    <EcgMonitor t={t} x={330} y={330} w={1260} h={420} period={46} />
    <g transform={`translate(330 200) scale(${1 + 0.06 * Math.max(0, Math.sin((t / 46) * Math.PI * 2 - 1))})`}>
      <path d="M 0 30 C -50 -20 -20 -60 0 -30 C 20 -60 50 -20 0 30 Z" fill="#FF5A6A" stroke="#16101A" strokeWidth={5} />
    </g>
  </g>
);

// D28 (29 f): "Không hồi hộp.": Pip's blank face, huge; one slow blink, no sweat
export const D28: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Wall id="d28" />
    <g transform={camT(960, 470, kf(t, [[0, 3.2], [29, 3.5]]))}>
      <Hero look={PIP} pose={{ ...basePose, x: 960, y: 640, yaw: 0.2, ...faceAt(t, [[0, 'tired']]), blink: t > 12 && t < 17 ? 1 : 0, look: kf(t, [[0, 0.1], [29, -0.2]]) }} rimId="rimR" shadow={0} />
    </g>
  </g>
);

// D29 (31 f): "Không run tay.": a steady fist round a glass, the water perfectly level
export const D29: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Wall id="d29" c0="#6A6E7C" c1="#2E303C" />
    <rect x={-100} y={930} width={2120} height={250} fill="#3A3244" />
    <Tumbler x={960} y={950} s={2.5} />
    <InsertArm x={960} y={760} fx={1950} fy={1250} s={7} width={210} fist rot={-8} />
    <g transform="translate(1480 330)">
      <path d="M -150 0 q 15 -50 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0" stroke="#EAF8FF" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.75} />
      <g transform={`scale(${backOut(lin(t, 6, 8))})`}>
        <path d="M -190 -90 L 190 90 M 190 -90 L -190 90" stroke="#FF5A4A" strokeWidth={22} strokeLinecap="round" />
      </g>
    </g>
  </g>
);

// D30 (28 f): "Không gì cả.": nothing; Pip standing in the middle of the street with no face for it
export const D30: React.FC<ShotProps> = ({ t }) => {
  const s = streetStand(0.3, 4.4);
  return (
    <g transform={camT(kf(t, [[0, 960], [28, 975]]), 560, kf(t, [[0, 1.35], [28, 1.55]]))}>
      <Street t={t + 160} id="d30" />
      <Hero look={PIP} pose={{ ...basePose, x: s.x, y: s.y, scale: s.scale * 1.25, yaw: 0.1, ...faceAt(t, [[0, 'tired']]), armL: { a: 3, b: -2 }, armR: { a: 3, b: -2 } }} rimId="rimR" shadow={1} />
    </g>
  );
};
