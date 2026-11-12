import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, mixMotion } from '../../countryball/ball-motion';
import { PenProp } from '../../countryball/ball-speech-and-props';
import { RiverCrossing } from '../../countryball/ground-river-crossing';
import { Candle, IncenseBundle } from '../../countryball/ground-memorial-props';
import { Flare } from '../../countryball/fx-tracers-and-lights';
import { Glow } from '../../countryball/fx-glow';
import { cameraOnCitadel, localToScreen } from '../../countryball/citadel-geometry';
import { backOut, easeOut, hash, Pt } from '../../countryball/fx-math';
import { Backdrop, Plan, ramp, sec, Txt, Vignette } from './chd-common';
import { Cutaway, FLOOR_Y } from './chd-cutaway';
import { EmptyHelmet, EnvelopeIcon, HouseIcon } from './chd-icons';
import { posAt } from './chd-river';

// Chapter D, beat "17b letters" (D30-D34, 6:14-6:26): a fighter writes home between battles, a hurried scrap of paper, letters
// carried out across the river at night, some arrive, the writer never returns (quiet: helmet, candles, incense, no hits).

// ---------- D30: writing by the lamp, thinking of home ----------
export const D30: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), px = 1090 + 16 * Math.sin(s * 5), py = 820 + 5 * Math.sin(s * 9);
  return (
    <g>
      <Cutaway id="d30" t={t} camX={400} period={70}>
        <Ball id="d30b" x={900} y={FLOOR_Y - 90} r={90} flag="VNM" eyes="normal" hat={<MuCoi camo />} look={0.5} tilt={6} t={t} motion={breathe(t, 80, 0.02)} />
        <g transform="translate(1090,846) rotate(-8)"><rect x={-70} y={-44} width={140} height={88} rx={4} fill="#F4EBD2" stroke="#151515" strokeWidth={4} />
          {[-22, -4, 14].map((y) => <path key={y} d={`M-52,${y} q14,-8 28,0 t28,0 t24,0`} stroke="#4A4F5C" strokeWidth={4} fill="none" strokeLinecap="round" />)}</g>
        <PenProp x={px} y={py} s={0.9} rot={-40} />
      </Cutaway>
      {/* the thought of home */}
      <g opacity={ramp(s, 0.6, 1.1)} transform="translate(1380,420)">
        {[[-230, 190, 12], [-170, 150, 20], [-110, 100, 30]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#FFF6DC" stroke="#151515" strokeWidth={3} />)}
        <ellipse rx={200} ry={150} fill="#FFF6DC" stroke="#151515" strokeWidth={5} />
        <HouseIcon x={0} y={10} s={1.1} lit={1} />
      </g>
      <Txt x={960} y={140} text="VẪN VIẾT THƯ VỀ NHÀ" size={102} o={ramp(s, 0.1, 0.4)} />
    </g>
  );
};

// ---------- D31: a hurried scrap of paper ----------
const LINES: string[] = [0, 1, 2, 3, 4].map((r) => {
  let d = `M-300,${-150 + r * 78}`;
  for (let i = 0; i < 14; i++) d += ` q${10 + 8 * hash(r * 20 + i, 1)},${-26 * hash(r * 20 + i, 2)} ${22 + 14 * hash(r * 20 + i, 3)},${12 * (hash(r * 20 + i, 4) - 0.5)}`;
  return d;
});
export const D31: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), total = 5 * 0.36, cur = Math.min(4, Math.floor(ramp(s, 0.2, 0.2 + total) * 5 - 0.001)), within = (ramp(s, 0.2, 0.2 + total) * 5) % 1;
  const done = ramp(s, 0.2, 0.2 + total) >= 1;
  return (
    <g>
      <Backdrop s={s} id="d31" top="#2B2118" bottom="#0E0A07" grid={false} />
      <g transform={`translate(960,520) rotate(${-4 + Math.sin(s * 1.2)})`}>
        <rect x={-380} y={-270} width={760} height={540} rx={8} fill="#F4EBD2" stroke="#151515" strokeWidth={6} />
        <path d="M-380,-270 l60,0 l-60,50 Z" fill="#D8CBA6" />
        {LINES.map((d, i) => <path key={i} d={d} pathLength={1} stroke="#2E3A66" strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={done || i < cur ? 0 : i === cur ? 1 - within : 1} />)}
        {!done && <g transform={`translate(${-300 + 620 * within},${-150 + cur * 78 - 10}) rotate(-35)`}><PenProp x={0} y={0} s={1.4} /></g>}
      </g>
      <Txt x={960} y={970} text="VIẾT VỘI TRÊN MẢNH GIẤY NHỎ" size={78} o={ramp(s, 0.2, 0.5)} />
      <Vignette id="d31" o={0.5} />
    </g>
  );
};

// ---------- D32: the letters cross the river by night ----------
export const D32: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraOnCitadel(-340, 10, 1.15), a = localToScreen(cam, -720, 40), b = localToScreen(cam, -400, -10);
  const route: Pt[] = [b, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 90], a];
  return (
    <g>
      <Plan id="d32" cam={cam} t={t} damage={0.65} night={0.9} fires={0.5} flood={0.4} />
      <RiverCrossing id="d32r" t={t} t0={6} t1={66} from={b} to={a} n={3} size={44} spacing={70} drift={40} flares={[{ t0: 4, x: b[0] - 130, y: b[1] - 300 }]} splashes={4} />
      {[0, 1, 2].map((i) => {
        const u = (s * 0.42 + i * 0.33 - 0.1) % 1, p = posAt(route, u);
        return <g key={i} opacity={Math.min(1, u * 6, (1 - u) * 6)}><Glow x={p.x} y={p.y} r={70} color="#FFD98A" o={0.6} /><EnvelopeIcon x={p.x} y={p.y - 20} s={0.9} rot={-8 + 10 * Math.sin(s * 4 + i)} /></g>;
      })}
      <Flare t={t} t0={30} x={a[0] + 130} y={a[1] - 310} r={130} life={140} />
      <Vignette id="d32" o={0.5} />
      <Txt x={960} y={140} text="GỬI THEO NGƯỜI VƯỢT SÔNG" size={92} o={ramp(s, 0.1, 0.4)} />
    </g>
  );
};

// ---------- D33: dawn at home, the letter arrives ----------
export const D33: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), u = easeOut(ramp(s, 0.15, 1.5)), ex = 120 + (960 - 120) * u, ey = 380 - 160 * Math.sin(Math.PI * u) + 380 * u;
  return (
    <g>
      <defs><linearGradient id="d33-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4B6A8F" /><stop offset="0.7" stopColor="#F2B98A" /><stop offset="1" stopColor="#F7D9A8" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#d33-sky)" />
      <Glow x={460} y={700} r={520} color="#FFE3A0" o={0.5} />
      <path d="M0,760 Q500,730 1000,760 T1920,740 V1080 H0 Z" fill="#7E9A55" /><path d="M0,850 Q600,820 1200,860 T1920,840 V1080 H0 Z" fill="#6A8848" />
      {[1500, 1650, 1790].map((x, i) => <g key={x}><path d={`M${x},800 q${-20 - i * 6},-200 ${10 + i * 10},-380`} stroke="#3F6A33" strokeWidth={10} fill="none" strokeLinecap="round" /><path d={`M${x - 30},520 q30,-40 60,-10 M${x - 22},620 q26,-36 54,-8`} stroke="#4F7F3F" strokeWidth={14} strokeLinecap="round" fill="none" /></g>)}
      <HouseIcon x={1230} y={700} s={2.4} lit={1} />
      <Ball id="d33b" x={820} y={760} r={110} flag="VNM" eyes="normal" t={t} motion={mixMotion(breathe(t, 70, 0.03))} look={-0.4} />
      <EnvelopeIcon x={ex} y={ey} s={1.6} rot={-14 + 14 * u} />
      <Txt x={960} y={160} text="CÓ NHỮNG LÁ THƯ ĐÃ VỀ TỚI NƠI" size={84} o={ramp(s, 0.3, 0.6)} />
    </g>
  );
};

// ---------- D34: quiet, the writer does not come back ----------
export const D34: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), z = 1 + 0.06 * (t / len);
  return (
    <g>
      <Backdrop s={s * 0.3} id="d34" top="#101A2C" bottom="#05080F" grid={false} />
      <g transform={`translate(960,560) scale(${z}) translate(-960,-560)`}>
        <ellipse cx={960} cy={860} rx={620} ry={70} fill="#1A2236" />
        <Glow x={960} y={700} r={560} color="#FFC46A" o={0.2} />
        <EmptyHelmet x={960} y={810} r={190} />
        <g transform="translate(1260,830) rotate(-14)"><EnvelopeIcon x={0} y={0} s={1.5} /></g>
        <Candle x={660} y={830} s={170} t={t} /><Candle x={760} y={850} s={130} t={t} seed={3} />
        <IncenseBundle x={1480} y={830} s={200} t={t} n={3} />
      </g>
      <Txt x={960} y={170} text="NGƯỜI VIẾT KHÔNG BAO GIỜ TRỞ VỀ" size={72} color="#D8DEE9" o={0.9 * ramp(s, 0.5, 1.2)} />
      <Vignette id="d34" o={0.7} />
    </g>
  );
};
