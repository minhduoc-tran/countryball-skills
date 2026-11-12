import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, talk } from '../../countryball/ball-motion';
import { TankSide } from '../../countryball/ground-tanks';
import { Candle } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { Drift, Veil } from './cha-common';
import { Person } from './chd-icons';
import { Cap, GoldPlaque, INK, Stage, TodayFacade, easeOut, prog, GateToday } from './chh-common';
import { CommentIcon, GateIcon, Sparkles } from './chh-cta-bits';

// Chapter H, part 4 (10:16-10:39, beats "12d memory" + "13 cta"): H18 old tank-crew silhouettes, H19 Bùi Quang Thận card (1948 - 2012) + candles, H20 the iron gate
// in April, H21 old ball tells young ball, H22 the question card, H23 comment prompt, H24 calm closing image (tail ~4 s): the palace at dusk, national flag waving.
// Quiet beats: no hits. Names only as in science (Bùi Quang Thận 1948-2012, người cắm cờ trên nóc Dinh).

/** Faceless elderly man (white hair, optional cane), (x, y) = feet. */
const Elder: React.FC<{ x: number; y: number; s: number; t: number; cane?: boolean; ph?: number }> = ({ x, y, s, t, cane, ph = 0 }) => (
  <g>
    <Person x={x} y={y} s={s} color="#141A26" lean={Math.sin(t / 40 + ph) * 1.1 + 2} />
    <g transform={`translate(${x},${y}) rotate(${Math.sin(t / 40 + ph) * 1.1 + 2}) scale(${s})`}>
      <path d="M-10.2,-63 A10.2 10.2 0 0 1 10.2,-63 Q6,-71 0,-68 Q-6,-70 -10.2,-63 Z" fill="#ECECF2" /><circle cx={-9.5} cy={-62} r={3.2} fill="#ECECF2" /><circle cx={9.5} cy={-62} r={3.2} fill="#ECECF2" />
      {cane && <path d="M-14,-24 L-20,0 M-14,-24 Q-20,-28 -22,-22" stroke="#3A2A1C" strokeWidth={3} fill="none" strokeLinecap="round" />}
    </g>
  </g>
);

/** H18 "Những người lính lái xe tăng năm ấy giờ đã là những ông cụ tóc bạc." four silhouettes, a pale tank behind them. */
export const H18: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(t / 24);
  return (
    <g>
      <Stage id="h18" tone="dusk" dim={0.15} />
      <Glow x={960} y={620} r={640} color="#FFC46B" o={0.3} />
      <g opacity={0.2 * k}><TankSide id="h18t" x={1000} y={900} size={1100} kind="t54" /></g>
      {[560, 780, 1000, 1220].map((x, i) => <g key={i} opacity={easeOut((t - i * 6) / 16)}><Elder x={x} y={930} s={4.3} t={t} cane={i % 2 === 1} ph={i * 1.7} /></g>)}
      <Cap t={t} at={8} x={960} y={190} text="NHỮNG NGƯỜI LÍNH NĂM ẤY" size={88} />
    </g>
  );
};

/** H19 "Bùi Quang Thận, người cắm cờ trên nóc Dinh, qua đời năm 2012." name card, then 1948 - 2012 with two candles; a soft dim. */
export const H19: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(t / 14), swap = prog(t, 70, 82), c = easeOut((t - 80) / 16);
  return (
    <g>
      <Stage id="h19" tone="navy" dim={0.4 * prog(t, 70, 110)} />
      <g transform={`translate(960,${430 + (1 - k) * 40})`} opacity={k}>
        <rect x={-540} y={-130} width={1100} height={300} rx={22} fill="#000" opacity={0.4} />
        <rect x={-550} y={-142} width={1100} height={300} rx={22} fill="#F2EBD8" stroke={INK} strokeWidth={6} />
        <rect x={-550} y={-142} width={16} height={300} rx={8} fill="#C9343A" />
        <rect x={-500} y={-112} width={190} height={240} rx={12} fill="#4A5A6E" stroke={INK} strokeWidth={4} />
        <circle cx={-405} cy={-34} r={46} fill="#8E9CAE" /><path d="M-490,126 Q-405,0 -320,126 Z" fill="#8E9CAE" />
        <text x={-270} y={-30} fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#1C2733">BÙI QUANG THẬN</text>
        <text x={-270} y={46} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill="#5A4A2A" opacity={1 - swap}>người cắm cờ trên nóc Dinh</text>
        <text x={-270} y={96} fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#7A5A1A" opacity={swap}>1948 – 2012</text>
      </g>
      <g opacity={c}>
        <Candle x={420} y={870} s={150} t={t} seed={1} /><Candle x={1500} y={870} s={150} t={t} seed={4} />
      </g>
    </g>
  );
};

/** H20 "Nhưng mỗi dịp tháng Tư, câu chuyện về cánh cổng sắt" the gate at dusk + a calendar page THÁNG 4. */
export const H20: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(t / 16);
  return (
    <g>
      <Drift t={t} len={len} z0={1} z1={1.08} cx={1100} cy={700}><GateToday id="h20" t={t} /></Drift>
      <Veil id="h20" o={0.4} />
      <g transform={`translate(1560,${260 - (1 - k) * 80}) rotate(-4)`} opacity={k}>
        <rect x={-150} y={-150} width={300} height={310} rx={18} fill="#000" opacity={0.35} transform="translate(8,12)" />
        <rect x={-150} y={-150} width={300} height={310} rx={18} fill="#F6F0DC" stroke={INK} strokeWidth={6} />
        <rect x={-150} y={-150} width={300} height={88} rx={18} fill="#C9343A" stroke={INK} strokeWidth={6} />
        <text y={-86} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFFFFF">THÁNG</text>
        <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#1C2733">4</text>
      </g>
      <Cap t={t} at={36} x={960} y={1030} text="CÁNH CỔNG SẮT" size={96} />
    </g>
  );
};

/** H21 "lại được kể lại cho thế hệ sau." an old ball (white hair, mũ cối) tells a young ball (red scarf) about the gate. */
export const H21: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(t / 16);
  const hair = (
    <g>
      <MuCoi />
      <circle cx={-0.33} cy={-0.1} r={0.27} fill="none" stroke="#111" strokeWidth={0.045} /><circle cx={0.33} cy={-0.1} r={0.27} fill="none" stroke="#111" strokeWidth={0.045} /><path d="M-0.06,-0.12 Q0,-0.17 0.06,-0.12" fill="none" stroke="#111" strokeWidth={0.04} />
    </g>
  );
  const scarf = <g stroke="#111" strokeWidth={0.05} strokeLinejoin="round" fill="#C8201A"><path d="M-0.7,0.58 Q0,0.95 0.7,0.58 L0.6,0.8 Q0,1.1 -0.6,0.8 Z" /><polygon points="-0.12,0.95 0.12,0.95 0.2,1.2 0,1.12 -0.2,1.2" /></g>;
  return (
    <g>
      <Stage id="h21" tone="dusk" />
      <rect y={820} width={1920} height={260} fill="#4E5E3A" opacity={0.85} /><rect y={820} width={1920} height={8} fill="#000" opacity={0.2} />
      <Glow x={960} y={560} r={600} color="#FFC46B" o={0.2} />
      <g opacity={k}>
        <path d="M790,640 L805,830" stroke="#3A2A1C" strokeWidth={9} strokeLinecap="round" /><path d="M790,640 Q782,620 764,630" stroke="#3A2A1C" strokeWidth={9} strokeLinecap="round" fill="none" />
        <Ball id="h21o" x={600} y={650} r={175} flag="VNM" eyes="normal" hat={hair} tilt={-3} motion={talk(t, true, 0.7)} />
        <Ball id="h21y" x={1260} y={710} r={125} flag="VNM" eyes="happy" look={-0.5} hat={scarf} tilt={4} motion={breathe(t, 60, 0.04)} />
      </g>
      <g opacity={easeOut((t - 14) / 10)} transform={`translate(0,${-4 * Math.sin(t / 14)})`}>
        <GateIcon x={930} y={290} s={1} />
      </g>
      <Cap t={t} at={10} x={960} y={1000} text="KỂ LẠI CHO THẾ HỆ SAU" size={76} />
    </g>
  );
};

/** Shared CTA backdrop: the gate at dusk under a dark veil (H22 + H23). */
const CtaBack: React.FC<{ id: string; t: number; len: number }> = ({ id, t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1.05} z1={1.12} cx={1100} cy={700}><GateToday id={id} t={t} /></Drift>
    <rect width={1920} height={1080} fill="#0A1020" opacity={0.58} />
  </g>
);

/** H22 "Còn bạn, bạn đã từng đứng trước cánh cổng Dinh Độc Lập chưa?" the CTA question card + comment icon. */
export const H22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CtaBack id="h22" t={t} len={len} />
    <GoldPlaque t={t} a={4} x={960} y={470} w={1480} lines={[{ text: 'Bạn đã từng đứng trước', size: 84 }, { text: 'cánh cổng Dinh Độc Lập', size: 104, fill: '#FFD27A' }, { text: 'chưa?', size: 120 }]} />
    <CommentIcon t={t} at={34} x={1580} y={880} s={1.1} />
    <Ball id="h22b" x={330} y={900} r={110} flag="VNM" eyes="happy" look={0.4} motion={breathe(t, 60, 0.04)} />
  </g>
);

/** H23 "Hãy kể cho mình nghe ở phần bình luận nhé." the comment bubble grows, dots bounce, a heart-less warm prompt. */
export const H23: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CtaBack id="h23" t={t + 96} len={len + 96} />
    <Glow x={960} y={520} r={520} color="#FFC46B" o={0.18} />
    <CommentIcon t={t} at={2} x={960} y={420} s={2.5} />
    <Cap t={t} at={12} x={960} y={850} text="KỂ CHO MÌNH NGHE NHÉ" size={88} />
    <Cap t={t} at={22} x={960} y={950} text="Ở PHẦN BÌNH LUẬN" size={60} color="#FFE08A" />
  </g>
);

/** H24 closing image (tail ~4 s): the palace at dusk, the national flag waving, a lone ball on the lawn; slow push-in, a soft fade at the very end. */
export const H24: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1.0} z1={1.05} cx={960} cy={900}>
      <TodayFacade id="h24" x={960} y={930} w={1700} tone="dusk" t={t} windows={0.7} />
      <Ball id="h24b" x={330} y={1000} r={64} flag="VNM" eyes="happy" look={0.6} tilt={3} motion={breathe(t, 90, 0.03)} />
    </Drift>
    <Sparkles t={t} />
    <Veil id="h24" o={0.4} />
    <rect width={1920} height={1080} fill="#02050C" opacity={0.7 * prog(t, len - 36, len)} />
  </g>
);
