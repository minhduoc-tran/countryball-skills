import React from 'react';
import { Street, Schematic, SchLabel, CountUp, SCH, FONT, ShotProps, kf, camT, clamp, easeOut, easeIn, easeInOut, Glow, LOOKS, streetStand, proj, rnd } from '../../engine';
import { SpeedLines, StreakLines, ImpactFlash, Shockwave, DustCloud, shakeAt } from './punch-fx-kit';
import { PunchPip, FistInsert, punchFist } from './punch-pip-and-fist';
import { SpeedDial, SpeedBars, MachWaves, Whip, CrackWord } from './chd-speed-and-mach-props';
import { TrueStamp } from './chd-newton-and-shield-props';
import { StreetPane, FacadeWindow, facadeQuad, lotPanes, NEIGHBOURS } from './chd-glass-and-neighbour-props';

// Chapter D, sonic boom science (D1-D12, 131.83-153.18 s): fist vs speedometer, x37, the Mach cone, the whip's CHÁT!,
// "Đó là thật.", then Pip's punch on the street, the boom ring, every window on the street cracking and shattering.

const INK = '#16101A';
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// D1 (77 f): the fist streaks in at the dial; the needle climbs toward 343 but has not crossed
export const D1: React.FC<ShotProps> = ({ t }) => {
  const v = kf(t, [[0, 20], [60, 322], [77, 334]], easeOut) + (t > 20 ? Math.sin(t * 1.9) * 3 : 0);
  const fx = kf(t, [[0, 1900], [16, 1470]], easeOut);
  return (
    <g>
      <Schematic t={t} id="d1" />
      <SchLabel x={760} y={190} t={t - 2} text="TỐC ĐỘ NẮM ĐẤM" size={52} color={SCH.line} />
      <SpeedDial x={760} y={800} r={430} v={v} />
      <text x={760} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={54} fill={SCH.live}>{Math.round(v)} m/s</text>
      <StreakLines t={t} x={fx - 60} y={560} dir={0} n={12} len={520} spread={120} color="#FFF3DC" />
      <g transform={`translate(${fx + Math.sin(t * 2.3) * 3} ${560 + Math.cos(t * 2.9) * 3}) scale(1.5)`}>
        <rect x={-210} y={-52} width={150} height={104} rx={14} fill="#2E2B3D" stroke={INK} strokeWidth={7} />
        <rect x={-80} y={-84} width={190} height={168} rx={44} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
        <path d="M 20 -60 v 44 M 20 -4 v 44 M -30 -70 h 50" stroke={INK} strokeWidth={5} opacity={0.45} strokeLinecap="round" />
      </g>
    </g>
  );
};

// D2 (58 f): the needle crosses 343 (red mark), ring burst, big "343 m/s"
export const D2: React.FC<ShotProps> = ({ t }) => {
  const cross = 9;
  const v = kf(t, [[0, 300], [cross, 346], [cross + 10, 372], [58, 380]], easeOut);
  const sk = shakeAt(t, cross, 12, 8);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <Schematic t={t} id="d2" />
      <SpeedDial x={960} y={760} r={500} v={v} over={lin(t, cross, 18)} />
      {t >= cross ? <CountUp x={960} y={960} t={t - cross - 2} to={343} dur={10} size={150} suffix=" m/s" color="#FFD23F" /> : null}
      <SchLabel x={960} y={210} t={t - cross} text="TỐC ĐỘ ÂM THANH" size={56} color="#FF8A7A" />
      <ImpactFlash t={t} hitT={cross} x={960 + 380} y={470} r={380} />
    </g>
  );
};

// D3 (58 f): x37 against the boxer
export const D3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d3" />
    <SpeedBars t={t} y={350} />
  </g>
);

// D4 (55 f): a body just under the speed of sound: its sound waves bunch up in front
export const D4: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t * 6} id="d4" />
    <MachWaves t={t} x={1200} y={540} c={9} v={8.2} n={11} />
    <SchLabel x={960} y={200} t={t - 3} text="GẦN TỚI TỐC ĐỘ ÂM THANH" size={50} color={SCH.line} />
    <g transform={`translate(1640 330) scale(${clamp(1 - t / 30)})`} />
    <text x={960} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>sóng âm dồn lại phía trước</text>
  </g>
);

// D5 (72 f): past it: the Mach cone fans out behind, label "NỔ SIÊU THANH"
export const D5: React.FC<ShotProps> = ({ t }) => {
  const sk = shakeAt(t, 18, 10, 8);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <Schematic t={t * 8} id="d5" />
      <MachWaves t={t} x={1380} y={540} c={9} v={20} n={11} cone={easeOut(lin(t, 4, 14))} />
      <SchLabel x={1400} y={210} t={t - 18} text="NỔ SIÊU THANH" size={96} color="#FFD23F" />
      <SchLabel x={1400} y={900} t={t - 24} text="sóng xung kích hình nón" size={40} color={SCH.dim} anchor="middle" />
      <ImpactFlash t={t} hitT={16} x={1380} y={540} r={420} />
    </g>
  );
};

// D6 (82 f): a whip in a hand: the flick, the loop runs out to the tip, CHÁT! at frame 17
export const D6: React.FC<ShotProps> = ({ t }) => {
  const crack = 17;
  const p = lin(t, 0, crack);
  const sk = shakeAt(t, crack, 14, 8);
  const hand = kf(t, [[0, 330], [crack - 3, 380], [crack + 4, 360]], easeInOut);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <Schematic t={t} id="d6" />
      <g transform="rotate(-13 380 700)"><Whip t={t} hx={hand} hy={700} p={p} L={1050} /></g>
      <Shockwave t={t} hitT={crack} x={1380} y={430} r={360} />
      <Shockwave t={t} hitT={crack + 3} x={1380} y={430} r={240} />
      <ImpactFlash t={t} hitT={crack} x={1380} y={430} r={260} />
      <CrackWord t={t} at={crack + 1} x={1300} y={300} size={230} />
    </g>
  );
};

// D7 (76 f): zoom on the tip: it runs ahead of its own sound waves (cone behind it), label "> 343 m/s"
export const D7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t * 6} id="d7" />
    <MachWaves t={t} x={1280} y={560} c={9} v={17} n={11} body={false} />
    <path d={`M 1280 560 Q 1000 ${560 + 60 * Math.sin(t * 0.4)} 760 ${560 - 20}`} stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d={`M 1280 560 Q 1000 ${560 + 60 * Math.sin(t * 0.4)} 760 ${560 - 20}`} stroke="#B8793F" strokeWidth={11} fill="none" strokeLinecap="round" />
    <circle cx={1280} cy={560} r={16} fill="#FFD23F" stroke={INK} strokeWidth={5} />
    <SchLabel x={1560} y={200} t={t - 2} text="ĐẦU ROI BAY NHANH" size={52} color={SCH.line} />
    <SchLabel x={1560} y={270} t={t - 4} text="HƠN ÂM THANH" size={52} color={SCH.line} />
    <CountUp x={1500} y={880} t={t - 12} to={343} dur={14} size={96} format={(v) => `> ${Math.round(v)}`} suffix=" m/s" color="#FFD23F" />
  </g>
);

// D8 (23 f): "Đó là thật." stamp over the dimmed cone
export const D8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t * 8} id="d8" />
    <g opacity={0.35}>
      <MachWaves t={t + 40} x={1400} y={540} c={9} v={20} n={11} />
    </g>
    <TrueStamp x={960} y={540} t={t - 1} />
  </g>
);

// D9 (35 f): the fist clenches and trembles, speed lines gather (wind-up of the street punch)
export const D9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <FistInsert t={t} id="d9" clenchAt={2} thrustAt={80} />
  </g>
);

const PANES = lotPanes(50);
/** The boom travels down the street: a pane at depth z breaks (hit frame + this) frames after the punch. */
const breakFor = (hitT: number, z: number) => hitT + 8 + z * 0.8;

// D10 (51 f): the street punch. Hit at f25 (the word "nổ"): the boom ring races down the street, panes ripple
export const D10: React.FC<ShotProps> = ({ t }) => {
  const hitT = 25;
  const s = streetStand(-0.9, 4.6);
  const pipOpts = { x: s.x, ground: proj(-0.9, 0, 4.6).y, scale: s.scale * 1.0, side: 1 as const, aim: 88, lunge: 60 };
  const fist = punchFist(t, hitT, pipOpts);
  const sk = shakeAt(t, hitT, 24, 14);
  const ring = lin(t, hitT, 26);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 900], [hitT, 960], [51, 1010]]), 560, kf(t, [[0, 1.25], [hitT - 4, 1.55], [51, 1.35]]))}>
        <Street t={t + 120} id="d10" />
        {PANES.map((p) => (
          <StreetPane key={p.k} t={t} quad={facadeQuad(p.X, p.y0, p.y1, p.z0, p.z1)} breakAt={breakFor(hitT, p.z0)} seed={p.k + 1} />
        ))}
        <Shockwave t={t} hitT={hitT} x={fist.x + 30} y={fist.y} kind="air" r={900} len={26} color="#FFF3DC" />
        <Shockwave t={t} hitT={hitT + 2} x={fist.x + 30} y={fist.y} kind="air" r={620} len={24} color="#7FD4FF" />
        <Shockwave t={t} hitT={hitT} x={fist.x + 200} y={pipOpts.ground} kind="ground" r={1100} len={28} />
        {ring > 0 && ring < 1 ? <ellipse cx={fist.x + 120} cy={fist.y + 20} rx={170 + 1500 * easeOut(ring)} ry={120 + 680 * easeOut(ring)} fill="none" stroke="#FFFFFF" strokeWidth={22 * (1 - ring) + 2} opacity={0.5 * (1 - ring)} /> : null}
        <DustCloud t={t} hitT={hitT} x={fist.x + 120} y={pipOpts.ground} r={90} />
        <PunchPip t={t} hitT={hitT} {...pipOpts} rimId="rimR" shadow={0} />
        <SpeedLines t={t} cx={fist.x + 40} cy={fist.y} o={t >= hitT && t < hitT + 7 ? 0.7 : 0} rIn={240} />
        <ImpactFlash t={t} hitT={hitT} x={fist.x + 40} y={fist.y} r={330} />
      </g>
    </g>
  );
};

// D11 (22 f): wide on one facade: the boom hits the street, every pane shivers and cracks
export const D11: React.FC<ShotProps> = ({ t }) => {
  const sk = shakeAt(t, 0, 10, 22);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 1500], [22, 1420]]), 470, 2.0)}>
        <Street t={t + 200} id="d11" />
        {PANES.map((p) => (
          <StreetPane key={p.k} t={t + 51} quad={facadeQuad(p.X, p.y0, p.y1, p.z0, p.z1)} breakAt={breakFor(25, p.z0)} seed={p.k + 1} />
        ))}
      </g>
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.14 * Math.abs(Math.sin(t * 1.2))} />
    </g>
  );
};

// D12 (25 f): three neighbours at their windows; the glass explodes at f6 on the word "vỡ"; funny shocked faces
export const D12: React.FC<ShotProps> = ({ t }) => {
  const at = 6;
  const sk = shakeAt(t, at, 24, 14);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#2A2230" />
      <rect x={-100} y={380} width={2120} height={800} fill="#6B4A42" />
      <path d="M -100 540 H 2020 M -100 700 H 2020 M -100 860 H 2020" stroke="#58392F" strokeWidth={5} />
      {NEIGHBOURS.map((n, i) => (
        <FacadeWindow key={i} t={t} id={`d12w${i}`} x={160 + i * 600} y={190 + (i === 1 ? 70 : 0)} w={480} h={520} breakAt={at + (i === 1 ? 1 : i === 2 ? 2 : 0)} look={n.look} expr={n.expr} before="neutral" seed={7 + i * 3} />
      ))}
      <ImpactFlash t={t} hitT={at} x={960} y={450} r={600} />
    </g>
  );
};
