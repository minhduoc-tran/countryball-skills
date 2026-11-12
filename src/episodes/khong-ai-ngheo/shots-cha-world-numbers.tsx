import React from 'react';
import { kf, clamp, easeOut, backOut, camT, Schematic, SchLabel, Arrow, SCH, FONT, Sparkle, Glow, ShotProps } from '../../engine';
import { VnOutline } from '../tien-vo-han/cha-vietnam-map-props';
import { PeopleGrid, BigStat, Cap, BigTick, Magnifier, Storybook } from './cha-number-card-props';

// Chapter A, the world scale beat (27.21-42.38 s), look "before": the real numbers. A fairy-tale book, a magnifier on the
// crowd, 1990: 2 TỶ (more than 1 in 3 dimmed), today ≈ 700 TRIỆU, seven Vietnams, "Đó là thật". 50 people = the world.

const G = { x0: 240, y0: 300, dx: 100, dy: 124, cols: 10, rows: 5, s: 1.2 };
const CREAM = '#F6EFE3';
const grid1990 = (t: number) => (i: number) => (i < 19 ? clamp((t - (26 + i * 1.2)) / 6) : 0);
const gridAll = () => (i: number) => (i < 19 ? 1 : 0);

// ---------- A17: "Nghe như chuyện cổ tích": an open storybook, a castle rises from its pages, stars drift up ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <defs><linearGradient id="a17bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B1535" /><stop offset="1" stopColor="#4A2E5A" /></linearGradient></defs>
    <rect x={-400} y={-400} width={2720} height={1900} fill="url(#a17bg)" />
    <Storybook x={960} y={680} t={t} rise={clamp((t - 4) / 14)} />
    <Sparkle x={1150} y={330} t={t - 16} s={1.6} />
    <Sparkle x={780} y={420} t={t - 22} s={1.1} />
  </g>
);

// ---------- A18: "nhìn con số thật": a magnifier sweeps across a crowd of 50 people ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const people = <PeopleGrid t={t} {...G} x0={G.x0 + 150} dimOf={() => 0} />;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="a18sch" />
      {people}
      <Magnifier id="a18m" lx={kf(t, [[0, 560], [len, 1380]])} ly={kf(t, [[0, 520], [len, 600]])} zoom={1.7}>{people}</Magnifier>
      <SchLabel x={960} y={940} t={t - 6} text="CON SỐ THẬT" size={64} />
    </g>
  );
};

// ---------- A19: "Năm 1990": the year rolls up and lands ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const yr = Math.round(1990 - 44 * (1 - easeOut(clamp((t - 2) / 20))));
  const k = 1 + 0.06 * Math.max(0, Math.sin(((t - 22) / 8) * Math.PI)) * (t > 22 && t < 30 ? 1 : 0);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t + 30} id="a19sch" />
      <g opacity={0.2}><PeopleGrid t={99} {...G} dimOf={() => 0} /></g>
      <Cap x={960} y={360} t={t - 2} text="NĂM" size={64} />
      <g transform={`translate(960 640) scale(${k})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={330} fill={CREAM} stroke="#101A2A" strokeWidth={14} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 24px ${SCH.glow}55)` }}>{yr}</text>
      </g>
      <path d="M 560 700 H 1360" stroke={SCH.live} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - easeOut(clamp((t - 20) / 12))} />
    </g>
  );
};

const Side: React.FC<{ t: number; big: string; cap: string; capT: number; bigT: number; size?: number }> = ({ t, big, cap, capT, bigT, size = 220 }) => (
  <g>
    <BigStat x={1540} y={560} t={t - bigT} text={big} size={size} />
    <Cap x={1540} y={640} t={t - capT} text={cap} size={40} color={CREAM} />
  </g>
);

// ---------- A20: 1990, about 2 TỶ people in extreme poverty: 19 of the 50 dim down ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(2 * easeOut(clamp((t - 6) / 14)));
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 940]]), 560, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t + 60} id="a20sch" />
      <PeopleGrid t={t} {...G} dimOf={grid1990(t)} />
      <Side t={t} big={`${n} TỶ`} cap="NGHÈO CÙNG CỰC" capT={30} bigT={5} />
      <Cap x={690} y={900} t={t - 2} text="1990" size={54} />
    </g>
  );
};

// ---------- A21: "hơn một phần ba thế giới": the dimmed block pulses, "> 1/3" ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t + 120} id="a21sch" />
    <PeopleGrid t={99} {...G} dimOf={gridAll()} ring={0.7 + 0.3 * Math.sin(t / 4)} />
    <path d={`M ${G.x0 - 60} ${G.y0 - 50} H ${G.x0 + 9 * G.dx + 60} V ${G.y0 + 62} H ${G.x0 + 8 * G.dx + 60} V ${G.y0 + G.dy + 62} H ${G.x0 - 60} Z`} fill="none" stroke={SCH.live} strokeWidth={6} strokeLinejoin="round" strokeDasharray="22 14" opacity={clamp((t - 4) / 8)} />
    <Side t={t} big="> 1/3" cap="THẾ GIỚI" capT={14} bigT={6} size={200} />
  </g>
);

// ---------- A22: "Ngày nay": the dimmed people light up again, down to ≈ 700 TRIỆU ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const dimOf = (i: number) => (i < 4 ? 1 : i < 19 ? 1 - clamp((t - (34 + (18 - i) * 1.2)) / 6) : 0);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.07], [len, 1.0]]))}>
      <Schematic t={t + 180} id="a22sch" />
      <PeopleGrid t={99} {...G} dimOf={dimOf} />
      <Cap x={1540} y={370} t={t - 2} text="NGÀY NAY" size={52} color={CREAM} />
      <BigStat x={1540} y={590} t={t - 30} text="≈ 700" size={190} />
      <Cap x={1540} y={680} t={t - 34} text="TRIỆU" size={64} color={CREAM} />
      {[0, 1, 2].map((i) => <Sparkle key={i} x={400 + i * 220 + 120} y={380 + (i % 2) * 120} t={t - 38 - i * 5} s={1.3} />)}
    </g>
  );
};

// ---------- A23: "Ít hơn rất nhiều": two bars, 1990 against today; the second is far shorter ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const h2 = 196 * easeOut(clamp((t - 5) / 10));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t + 220} id="a23sch" />
      <rect x={520} y={340} width={240} height={560} rx={8} fill={SCH.dim} opacity={0.55} stroke={CREAM} strokeWidth={5} />
      <rect x={1160} y={900 - h2} width={240} height={h2} rx={8} fill={SCH.live} stroke={CREAM} strokeWidth={5} />
      <text x={640} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={96} fill={CREAM} stroke="#101A2A" strokeWidth={8} paintOrder="stroke">2 TỶ</text>
      <g opacity={clamp((t - 10) / 6)}><text x={1280} y={614} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={72} fill={SCH.live} stroke="#101A2A" strokeWidth={8} paintOrder="stroke">≈ 700 TRIỆU</text></g>
      <Arrow x0={800} y0={400} x1={1130} y1={800} t={t - 8} dur={9} color={SCH.live} />
      <Cap x={640} y={965} t={t - 2} text="1990" size={44} />
      <Cap x={1280} y={965} t={t - 6} text="NAY" size={44} />
    </g>
  );
};

// ---------- A24: "gần bằng bảy lần dân số Việt Nam": seven Vietnams line up, then x7 ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t + 260} id="a24sch" />
    <Cap x={960} y={190} t={t - 2} text="≈ 700 TRIỆU NGƯỜI" size={58} color={SCH.live} />
    {Array.from({ length: 7 }).map((_, i) => {
      const at = 22 + i * 4;
      const k = backOut(clamp((t - at) / 7));
      return (
        <g key={i} transform={`translate(${176 + i * 232 + 84} 470) scale(${k}) translate(-84 -185)`} opacity={clamp((t - at) / 3)}>
          <g transform="scale(0.42)"><VnOutline id={`a24vn${i}`} t={t - at} dur={6} fillT={4} /></g>
        </g>
      );
    })}
    <Cap x={960} y={725} t={t - 58} text="DÂN SỐ VIỆT NAM" size={44} color={CREAM} />
    <BigStat x={960} y={965} t={t - 50} text="x7" size={230} />
  </g>
);

// ---------- A25: "Đó là thật.": a big green tick ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t + 300} id="a25sch" />
    <Glow x={960} y={440} r={520} o={0.3} kind="cool" />
    <BigTick x={960} y={430} t={t} r={170} />
    <BigStat x={960} y={820} t={t - 8} text="ĐÓ LÀ THẬT" size={130} color={CREAM} glow="#5BE08A" />
    <Sparkle x={1210} y={300} t={t - 10} s={1.5} />
  </g>
);
