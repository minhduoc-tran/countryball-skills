import React from 'react';
import { ShotProps, kf, camT, clamp, easeOut, easeIn, backOut, Sparkle, SchLabel, CountUp, Arrow, DrawOn, SCH, FONT } from '../../engine';
import { TankBack, MantisShrimp, PreyCrab, clubTip } from './chc-shrimp';
import { FistIcon } from './chc-science-props';
import { ImpactFlash, Shockwave, StreakLines, Debris } from './punch-fx-kit';

// CHAPTER C science, part 2 (C26-C33): the mantis shrimp (tôm tít): 23 m/s club, cavitation bubbles, a second hit.
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);
/** One strike every `per` frames starting at `at`: 0 (folded) .. 1 (extended), fast out, slower back. */
const strikeAt = (t: number, at: number, per = 30) => {
  const p = (((t - at) % per) + per) % per;
  return t < at ? 0 : p < 3 ? p / 3 : p < 8 ? 1 : Math.max(0, 1 - (p - 8) / 14);
};

// ---------- C26: "Tay đấm nhanh nhất trong tự nhiên": a burrow in the sand, two eyes peek out ----------
export const C26: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(kf(t, [[0, 960], [48, 1000]]), kf(t, [[0, 640], [48, 760]]), kf(t, [[0, 1.0], [48, 1.5]]))}>
    <TankBack t={t} id="c26" burrow />
    {t > 22 ? (
      <g opacity={clamp((t - 22) / 4)}>
        {[940, 1060].map((x) => <g key={x}><circle cx={x} cy={896 - lin(t, 22, 10) * 14} r={22} fill="#FFD23F" stroke="#16101A" strokeWidth={5} /><circle cx={x + 4} cy={896 - lin(t, 22, 10) * 14} r={8} fill="#0B0816" /></g>)}
      </g>
    ) : null}
    <SchLabel x={960} y={300} t={t - 6} text="TAY ĐẤM NHANH NHẤT" size={54} />
  </g>
);

// ---------- C27: "con tôm tít.": the shrimp pops out, colourful ----------
export const C27: React.FC<ShotProps> = ({ t }) => {
  const up = easeOut(lin(t, 0, 12));
  return (
    <g transform={camT(960, 640, 1.1)}>
      <TankBack t={t + 50} id="c27" />
      <MantisShrimp x={900} y={840 - 120 * up} s={1.25} t={t} />
      <Sparkle x={1170} y={600} t={t - 6} s={2} />
      <Sparkle x={620} y={620} t={t - 10} s={1.5} />
      <g transform={`translate(960 330) scale(${backOut(lin(t, 12, 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#FFD23F" stroke="#16101A" strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">TÔM TÍT</text>
      </g>
    </g>
  );
};

// ---------- C28: "Nó vung càng nhanh tới 23 mét mỗi giây": the club strike, 23 against the boxer's 9 ----------
export const C28: React.FC<ShotProps> = ({ t }) => {
  const st = strikeAt(t, 12, 28);
  const tip = clubTip(470, 700, 1.4, st);
  const bar = (y: number, v: number, a: number, col: string, label: string) => (
    <g transform={`translate(1100 ${y})`}>
      <rect width={v * 28 * easeOut(lin(t, a, 14))} height={44} rx={10} fill={col} stroke="#16101A" strokeWidth={4} />
      <text x={0} y={-12} fontFamily={FONT.ui} fontSize={32} fill={SCH.line}>{label}</text>
    </g>
  );
  return (
    <g transform={camT(960, 540, 1.0)}>
      <TankBack t={t + 100} id="c28" />
      <MantisShrimp x={470} y={700} s={1.4} t={t} strike={st} />
      {st > 0.3 && st < 1 ? <StreakLines t={t} x={tip.x} y={tip.y} dir={0} n={9} len={380} spread={80} /> : null}
      {strikeAt(t, 12, 28) >= 1 ? <ImpactFlash t={t} hitT={Math.floor((t - 12) / 28) * 28 + 15} x={tip.x + 60} y={tip.y} r={260} /> : null}
      {bar(330, 9, 22, '#F6EFE3', 'VÕ SĨ  9 m/s')}
      {bar(450, 23, 34, '#FF8A3D', 'TÔM TÍT  23 m/s')}
      <CountUp x={1440} y={720} t={t - 36} to={23} dur={24} size={150} format={(v) => `${Math.round(v)} m/s`} />
    </g>
  );
};

const bubbleField = (t: number, cx: number, cy: number, n: number, rMax: number, a: number, seed: number) =>
  Array.from({ length: n }).map((_, i) => {
    const g = clamp((t - a - i * 1.4) / 10);
    const ang = i * 2.4 + seed;
    const d = 40 + (i / n) * rMax * 1.6;
    const r = (10 + 30 * ((i * 37) % 10) / 10) * easeOut(g) * (rMax / 140);
    return g > 0 ? <circle key={i} cx={cx + Math.cos(ang) * d} cy={cy + Math.sin(ang) * d * 0.7} r={r} fill="#DFF6FF" fillOpacity={0.28} stroke="#F2FBFF" strokeWidth={5} /> : null;
  });

// ---------- C29: "nước quanh càng sôi lên thành bong bóng": close on the club, bubbles boil around it ----------
export const C29: React.FC<ShotProps> = ({ t }) => {
  const st = strikeAt(t, 6, 36);
  const tip = clubTip(300, 780, 2.4, st);
  return (
    <g transform={camT(kf(t, [[0, 640], [72, 720]]), 640, 1.0)}>
      <TankBack t={t + 150} id="c29" />
      <MantisShrimp x={300} y={780} s={2.4} t={t} strike={st} />
      {bubbleField(t, tip.x - 40, tip.y, 26, 220, 14, 1)}
      {bubbleField(t, tip.x - 40, tip.y, 26, 220, 50, 4)}
      <SchLabel x={1250} y={250} t={t - 30} text="BONG BÓNG" size={64} color="#FFFFFF" />
      <Arrow x0={1250} y0={290} x1={tip.x + 40} y1={tip.y - 120} t={t - 34} dur={10} color="#FFFFFF" />
    </g>
  );
};

// ---------- C30: "khi bong bóng vỡ": the bubbles collapse to a point and flash ----------
export const C30: React.FC<ShotProps> = ({ t }) => {
  const k = lin(t, 4, 14);
  const r = 190 * (1 - easeIn(k));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <TankBack t={t + 200} id="c30" />
      {t < 18 ? <circle cx={960} cy={540} r={Math.max(2, r)} fill="#DFF6FF" fillOpacity={0.3} stroke="#F2FBFF" strokeWidth={7} /> : null}
      {t < 18 ? [[-210, -120, 60], [220, -90, 46], [-150, 150, 52], [180, 150, 40]].map(([dx, dy, br], i) => <circle key={i} cx={960 + dx * (1 - 0.8 * easeIn(k))} cy={540 + dy * (1 - 0.8 * easeIn(k))} r={Math.max(1, br * (1 - easeIn(k)))} fill="#DFF6FF" fillOpacity={0.3} stroke="#F2FBFF" strokeWidth={5} />) : null}
      <Shockwave t={t} hitT={18} x={960} y={540} kind="air" r={620} len={16} color="#BFEFFF" />
      <ImpactFlash t={t} hitT={18} x={960} y={540} r={430} />
      <Debris t={t} hitT={18} x={960} y={540} n={0} sparks />
      <SchLabel x={960} y={880} t={t - 20} text="BONG BÓNG VỠ" size={60} />
    </g>
  );
};

// ---------- C31: "con mồi lãnh thêm một cú nữa": hit one by the club, hit two when the bubble pops ----------
export const C31: React.FC<ShotProps> = ({ t }) => {
  const h1 = 8;
  const h2 = 32;
  const st = t < 6 ? t / 6 * 0.0 + lin(t, 2, 4) : Math.max(0, 1 - (t - h1) / 16);
  const hit = t < h1 ? 0 : t < h2 ? lin(t, h1, 4) * Math.exp(-(t - h1) / 8) : 1;
  const crab = { x: 1200, y: 860 };
  const slide = t < h1 ? 0 : -1 * Math.min(1, (t - h1) / 6) * 20;
  const n = (txt: string, at: number, x: number) => (
    <g transform={`translate(${x} 470) scale(${backOut(lin(t, at, 6))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={180} fill="#FFD23F" stroke="#16101A" strokeWidth={16} paintOrder="stroke" strokeLinejoin="round">{txt}</text>
    </g>
  );
  return (
    <g transform={camT(kf(t, [[0, 960], [55, 1000]]), 640, 1.0)}>
      <TankBack t={t + 250} id="c31" />
      <MantisShrimp x={420} y={800} s={1.5} t={t} strike={st} />
      <PreyCrab x={crab.x + slide} y={crab.y} s={1.5} t={t} hit={t < h2 ? hit : lin(t, h2, 4) * Math.exp(-(t - h2) / 10)} cracks={t >= h2 ? 1 : 0} />
      <ImpactFlash t={t} hitT={h1} x={1100} y={800} r={360} />
      <ImpactFlash t={t} hitT={h2} x={1130} y={780} r={420} />
      <Shockwave t={t} hitT={h2} x={1130} y={780} kind="air" r={520} len={16} color="#BFEFFF" />
      {t > h2 - 6 && t < h2 ? <circle cx={1130} cy={780} r={Math.max(2, 70 * (1 - (t - (h2 - 6)) / 6))} fill="#DFF6FF" fillOpacity={0.3} stroke="#F2FBFF" strokeWidth={5} /> : null}
      {n('1', h1 + 2, 980)}
      {n('2', h2 + 2, 1330)}
    </g>
  );
};

// ---------- C32: "Một cú đấm thành hai.": one fist becomes two ----------
export const C32: React.FC<ShotProps> = ({ t }) => {
  const sp = easeOut(lin(t, 19, 10));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <TankBack t={t + 300} id="c32" />
      {t < 19 ? <FistIcon x={960} y={520} s={2.2} t={t} fill="#14375A" /> : (
        <g>
          <FistIcon x={960 - 320 * sp} y={520} s={2.0} fill="#14375A" />
          <FistIcon x={960 + 320 * sp} y={520} s={2.0} fill="#14375A" col={SCH.live} />
        </g>
      )}
      <SchLabel x={t < 19 ? 960 : 700} y={830} t={t - 2} text="1 CÚ" size={90} />
      {t >= 19 ? <SchLabel x={1240} y={830} t={t - 19} text="2 CÚ" size={90} color={SCH.live} /> : null}
    </g>
  );
};

// ---------- C33: "Đó là thật.": the tick is stamped ----------
export const C33: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [24, 1.04]]))}>
    <TankBack t={t + 400} id="c33" />
    <circle cx={960} cy={440} r={190} fill="#14375A" fillOpacity={0.7} />
    <DrawOn d="M 960 250 A 190 190 0 1 1 959.9 250" t={t} dur={8} color="#5BE08A" width={14} />
    <DrawOn d="M 870 450 L 935 520 L 1065 370" t={t - 5} dur={8} color="#5BE08A" width={26} />
    <g transform={`translate(960 780) scale(${backOut(lin(t, 8, 6))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFFFFF" stroke="#16101A" strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">ĐÓ LÀ THẬT</text>
    </g>
    <Sparkle x={1170} y={290} t={t - 6} s={1.6} />
  </g>
);
