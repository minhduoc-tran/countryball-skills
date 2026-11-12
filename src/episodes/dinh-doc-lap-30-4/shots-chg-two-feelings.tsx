import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { MuCoi, NonLa } from '../../countryball/ball-accessories';
import { Candle } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { Cap, Heart, INK, NameCard, Stage, Tag, easeOut, prog } from './chg-common';
import { Chair, FastSky, House, Portrait } from './chg-icons';
import { M1Helmet } from '../../countryball/ball-accessories-military';

// Chapter G, part 7 (9:10-9:27, beat "11b two feelings"): two feelings, shown with equal respect. G24 reunion (balls hugging), G25 years apart (sun and moon
// chase), G26 loss (RVN ball, empty chair, a candle), G27 separation (a boat leaves), G28 Võ Văn Kiệt name card, G29 his line with "Võ Văn Kiệt, 2005".
// Sound: soft step / tick at the reunion only; the loss, the parting and the line carry no hits.

/** G24 "Với hàng triệu người, ngày ba mươi tháng Tư là ngày đoàn tụ," a returned soldier, a mother and a child hug (all VNM balls, warm light). */
export const G24: React.FC<ShotProps> = ({ t }) => {
  const a = easeOut(prog(t, 0, 36)), hug = easeOut(prog(t, 34, 46)), bounce = Math.sin(prog(t, 34, 60) * Math.PI) * 14;
  return (
    <g>
      <Stage id="g24" tone="dawn" />
      <Glow x={960} y={600} r={620} color="#FFD27A" o={0.35} />
      <rect y={880} width={1920} height={200} fill="#5E6B3A" /><rect y={876} width={1920} height={8} fill="#3E4A26" />
      <House x={1560} y={900} s={1.1} />
      <Ball id="g24c" x={955} y={820 - bounce} r={78} flag="VNM" eyes="happy" tilt={4 * hug} motion={hop(t, 30, 8)} t={t} />
      <Ball id="g24a" x={-200 + a * 1060 - 70 * hug} y={760 - bounce} r={128} flag="VNM" eyes="happy" hat={<MuCoi />} tilt={14 * hug} motion={mixMotion(hop(t, 22, 14 * (1 - hug)))} t={t} />
      <Ball id="g24b" x={2120 - a * 1060 + 70 * hug} y={760 - bounce} r={140} flag="VNM" eyes="happy" hat={<NonLa />} tilt={-14 * hug} motion={mixMotion(hop(t, 26, 12 * (1 - hug)))} t={t} />
      {[0, 1, 2].map((i) => <Heart key={i} x={820 + i * 140} y={500 - ((t + i * 22) % 66) * 2.4} s={0.9 + 0.2 * i} o={hug * (1 - ((t + i * 22) % 66) / 66)} />)}
      <Cap t={t} at={0} x={960} y={150} text="VỚI HÀNG TRIỆU NGƯỜI" size={72} />
      <Cap t={t} at={80} x={960} y={990} text="NGÀY ĐOÀN TỤ" size={104} color="#FFE08A" />
    </g>
  );
};

/** G25 "ngày được trở về sau nhiều năm xa cách." sun and moon chase across the sky, a ball with a bag walks home. */
export const G25: React.FC<ShotProps> = ({ t }) => {
  const k = prog(t, 0, 63), x = 160 + 1000 * k;
  return (
    <g>
      <FastSky id="g25" t={t} period={34} />
      <rect y={860} width={1920} height={220} fill="#4B4A4E" /><rect y={856} width={1920} height={8} fill="#2A2A2E" />
      <House x={1560} y={862} s={1.1} glow={0.4 + 0.6 * k} />
      <g transform={`translate(${x - 130},${690}) rotate(-8)`}><rect x={-30} y={20} width={60} height={46} rx={6} fill="#8A6A44" stroke={INK} strokeWidth={5} /></g>
      <Ball id="g25a" x={x} y={750} r={100} flag="VNM" eyes="normal" hat={<MuCoi />} tilt={4} motion={hop(t, 16, 12)} t={t} />
      <Tag t={t} at={0} x={960} y={720 - 540} text="NGÀY ĐƯỢC TRỞ VỀ" fill="#2F3E58" size={62} />
      <Tag t={t} at={22} x={960} y={300} text="SAU NHIỀU NĂM XA CÁCH" fill="#9B4C3A" size={56} />
    </g>
  );
};

/** G26 "Nhưng với không ít người khác, đó cũng là ngày của mất mát" a sad RVN ball, an empty chair, a portrait with a black ribbon, one candle. */
export const G26: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g26" tone="night" dim={0.15} />
    <rect y={860} width={1920} height={220} fill="#1C2733" />
    <Portrait x={1330} y={470} s={1.15} />
    <Chair x={1330} y={900} s={1.1} />
    <Candle x={1010} y={890} s={190} t={t} seed={2} />
    <Ball id="g26a" x={560} y={760} r={150} flag="RVN" eyes="sad" tear hat={<M1Helmet />} tilt={-5} motion={breathe(t, 120, 0.015)} t={t} />
    <Cap t={t} at={0} x={960} y={140} text="NHƯNG VỚI KHÔNG ÍT NGƯỜI KHÁC" size={56} color="#CFD8E4" />
    <Cap t={t} at={50} x={960} y={250} text="NGÀY CỦA MẤT MÁT" size={88} />
  </g>
);

/** G27 "và chia ly." a small boat leaves the shore at dusk; a sad RVN ball stays on the pier. "Nhiều năm sau" chip for the next line. */
export const G27: React.FC<ShotProps> = ({ t }) => {
  const k = prog(t, 0, 60), bx = 760 + 700 * k, bs = 1 - 0.45 * k;
  return (
    <g>
      <Stage id="g27" tone="dusk" />
      <circle cx={1500} cy={560} r={110} fill="#FFE9B0" opacity={0.75} />
      <rect y={600} width={1920} height={480} fill="#1F4A70" /><rect y={600} width={1920} height={6} fill="#0E2A44" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${100 + i * 480 + Math.sin(t / 20 + i) * 20},${720 + i * 60} q60,-18 120,0 q60,18 120,0`} fill="none" stroke="#7FB1D8" strokeWidth={5} opacity={0.5} />)}
      <g transform={`translate(${bx},${650 + Math.sin(t / 12) * 4}) scale(${bs})`} strokeLinejoin="round">
        <path d="M-150,-30 L150,-30 L110,30 L-110,30 Z" fill="#6A4A2C" stroke={INK} strokeWidth={6} />
        <rect x={-60} y={-92} width={90} height={62} fill="#E8E4D6" stroke={INK} strokeWidth={5} />
        <line x1={70} y1={-30} x2={70} y2={-150} stroke={INK} strokeWidth={6} /><path d="M70,-148 L150,-50 L70,-50 Z" fill="#F2EBD8" stroke={INK} strokeWidth={5} />
      </g>
      <rect x={0} y={800} width={560} height={40} fill="#6A4A2C" stroke={INK} strokeWidth={5} /><rect x={0} y={840} width={560} height={240} fill="#4A3320" />
      <Ball id="g27a" x={330} y={690} r={100} flag="RVN" eyes="sad" tear hat={<M1Helmet />} tilt={6} motion={breathe(t, 100, 0.015)} t={t} />
      <Cap t={t} at={6} x={960} y={190} text="CHIA LY" size={120} />
      <Tag t={t} at={33} x={1480} y={900} text="NHIỀU NĂM SAU" fill="#2F3E58" size={46} />
    </g>
  );
};

/** G28 "cố Thủ tướng Võ Văn Kiệt đã nói một câu được nhắc lại rất nhiều:" name card (no photo in the manifest: plain card + silhouette). */
export const G28: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g28" tone="navy" />
    <NameCard t={t} at={0} x={800} y={400} name="VÕ VĂN KIỆT" sub="cố Thủ tướng" w={980} accent="#E2B95A" />
    <text x={1500} y={560} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={460} fill="#E2B95A" opacity={0.85 * easeOut(prog(t, 30, 54))}>“</text>
    <Cap t={t} at={54} x={960} y={800} text="MỘT CÂU ĐƯỢC NHẮC LẠI" size={72} />
    <Cap t={t} at={68} x={960} y={900} text="RẤT NHIỀU" size={72} color="#FFE08A" />
  </g>
);

/** Plain dark-on-paper line (no outline: the stroke of Cap is too heavy on a cream card). */
const Line: React.FC<{ t: number; at: number; y: number; text: string; color: string }> = ({ t, at, y, text, color }) => {
  const k = easeOut((t - at) / 8);
  return k <= 0.01 ? null : <text x={960} y={y + (1 - k) * 20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill={color} opacity={k}>{text}</text>;
};

/** G29 "có triệu người vui, cũng có triệu người buồn." the line on a card with "Võ Văn Kiệt, 2005": warm light left, cool light right. */
export const G29: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g29" tone="night" dim={0.1} />
    <Glow x={330} y={560} r={520} color="#FFC864" o={0.3} /><Glow x={1590} y={560} r={520} color="#6F8FC4" o={0.28} />
    <rect x={160} y={250} width={1600} height={440} rx={26} fill="#F2EBD8" stroke={INK} strokeWidth={6} opacity={easeOut(prog(t, 0, 10))} />
    <Line t={t} at={2} y={430} text="Có triệu người vui," color="#B5573B" />
    <Line t={t} at={34} y={580} text="cũng có triệu người buồn" color="#2F3E58" />
    <Tag t={t} at={46} x={960} y={770} text="Võ Văn Kiệt, 2005" fill="#2F3E58" size={52} />
    <Ball id="g29a" x={340} y={880} r={100} flag="VNM" eyes="normal" hat={<MuCoi />} tilt={-3} motion={breathe(t, 90, 0.02)} t={t} />
    <Ball id="g29b" x={1580} y={880} r={100} flag="RVN" eyes="normal" hat={<M1Helmet />} tilt={3} motion={breathe(t, 110, 0.015, 20)} t={t} />
    <Candle x={960} y={960} s={130} t={t} seed={4} />
  </g>
);
