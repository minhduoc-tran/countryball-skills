import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { Beret, M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, mixMotion } from '../../countryball/ball-motion';
import { Candle } from '../../countryball/ground-memorial-props';
import { easeOut, hash } from '../../countryball/fx-math';
import { CandleRow, fmtVn, GOLD, Head, Panel, Quiet, ramp, sec, SourceTag, SRC_MANY, Txt, UNSETTLED, Vignette } from './chg-common';

// Chapter G, beat "27 cost" (G1-G7, 524.4-542.2 s): the price of the 81 days, for both sides. Quiet: dark cards, candles,
// numbers WITH their source label ("Theo nhiều nguồn"), "Số liệu chưa thống nhất". No hits, no fire.

// ---------- G1: "Cái giá của tám mươi mốt ngày đêm" ----------
export const G1: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Quiet id="g1" s={s} />
      <Head s={s} at={0.1} y={330} text="CÁI GIÁ" size={170} />
      <Head s={s} at={0.7} y={470} text="CỦA 81 NGÀY ĐÊM" size={92} color={GOLD} />
      <CandleRow t={t} xs={[400, 620, 840, 1080, 1300, 1520]} y={900} at0={14} gap={7} />
      <Vignette id="g1" o={0.5} />
    </g>
  );
};

// ---------- G2: "là rất lớn, với cả hai phía" two sad balls, a candle between ----------
export const G2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = easeOut(ramp(s, 0.05, 0.6));
  return (
    <g>
      <Quiet id="g2" s={s} cy={700} />
      <Head s={s} at={0.1} y={200} text="VỚI CẢ HAI PHÍA" size={96} />
      <g transform={`translate(${(1 - k) * -300},0)`}>
        <Ball id="g2v" x={520} y={640} r={170} flag="VNM" eyes="sad" tear t={t} hat={<MuCoi camo />} motion={breathe(t, 80, 0.025)} />
      </g>
      <g transform={`translate(${(1 - k) * 300},0)`}>
        <Ball id="g2r" x={1400} y={640} r={170} flag="RVN" eyes="sad" tear t={t} hat={<M1Helmet />} motion={breathe(t, 84, 0.025, 14)} />
      </g>
      <Candle x={960} y={800} s={170} t={t} seed={2} />
      <Vignette id="g2" o={0.55} />
    </g>
  );
};

// ---------- G3: "Đến nay, các con số vẫn chưa thống nhất." tiles that do not agree ----------
export const G3: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), tiles = [{ x: 480, n: '4.000', r: -4 }, { x: 960, n: '?', r: 2 }, { x: 1440, n: '5.000+', r: 5 }];
  return (
    <g>
      <Quiet id="g3" s={s} />
      <Head s={s} at={0.05} y={210} text="SỐ LIỆU CHƯA THỐNG NHẤT" size={86} color={GOLD} />
      {tiles.map((c, i) => {
        const k = easeOut(ramp(s, 0.4 + i * 0.22, 0.9 + i * 0.22)), wob = Math.sin(s * 2.2 + i * 2) * 8;
        return (
          <g key={i} opacity={k} transform={`translate(${c.x},${600 + (1 - k) * 120 + wob}) rotate(${c.r + Math.sin(s * 1.7 + i) * 1.5})`}>
            <Panel x={0} y={0} w={400} h={300} stroke={i === 1 ? '#8EA3BA' : GOLD} />
            <Txt x={0} y={46} text={c.n} size={i === 1 ? 190 : 94} stroke="none" color={i === 1 ? '#8EA3BA' : '#F4F4F4'} />
          </g>
        );
      })}
      <Vignette id="g3" o={0.5} />
    </g>
  );
};

// ---------- G4: "Theo nhiều nguồn, phía Quân Giải phóng có khoảng bốn nghìn người hy sinh" ----------
export const G4: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), n = 4000 * easeOut(ramp(s, 1.2, 2.6));
  return (
    <g>
      <Quiet id="g4" s={s} cx={1400} cy={760} />
      <Panel x={1090} y={520} w={1160} h={600} />
      <SourceTag x={1090} y={296} text={SRC_MANY} o={ramp(s, 0.1, 0.4)} />
      <Txt x={1090} y={440} text="PHÍA QUÂN GIẢI PHÓNG" size={52} color="#FF9A8A" stroke="none" o={ramp(s, 0.4, 0.8)} />
      <Txt x={1090} y={640} text={`~${fmtVn(n)}`} size={220} stroke="none" o={ramp(s, 1.0, 1.3)} />
      <Txt x={1090} y={730} text="chiến sĩ hy sinh" size={64} color="#E4D8C0" stroke="none" weight={700} o={ramp(s, 2.3, 2.8)} />
      <Ball id="g4v" x={250} y={640} r={150} flag="VNM" eyes="sad" tear t={t} hat={<MuCoi camo />} motion={breathe(t, 80, 0.025)} />
      <Candle x={110} y={900} s={140} t={t} seed={4} /><Candle x={450} y={900} s={120} t={t} seed={5} />
      <Vignette id="g4" o={0.5} />
    </g>
  );
};

// ---------- G5: "và còn rất nhiều người chưa tìm thấy hài cốt." a field of candles, some still dark ----------
export const G5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cols = 9, rows = 3;
  return (
    <g>
      <Quiet id="g5" s={s} cy={620} glow={0.8} />
      <Head s={s} at={0.05} y={190} text="CHƯA TÌM THẤY HÀI CỐT" size={92} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols), x = 260 + c * 175 + (r % 2) * 40, y = 470 + r * 190;
        const lit = hash(i, 11) < 0.55 && t > 6 + hash(i, 12) * 40;
        return <Candle key={i} x={x} y={y} s={92} t={t} seed={i} lit={lit} />;
      })}
      <Txt x={960} y={1010} text="rất nhiều người vẫn đang được tìm" size={46} color="#C9BFA8" stroke="none" weight={600} o={ramp(s, 1.0, 1.5)} />
      <Vignette id="g5" o={0.6} />
    </g>
  );
};

// ---------- G6: "Phía Sài Gòn, riêng sư đoàn Thủy quân lục chiến" ----------
export const G6: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = easeOut(ramp(s, 0.05, 0.6));
  return (
    <g>
      <Quiet id="g6" s={s} cx={520} cy={760} />
      <g transform={`translate(${(1 - k) * -260},0)`}>
        <Ball id="g6r" x={500} y={560} r={210} flag="RVN" eyes="worried" t={t} hat={<Beret color="#2F6B3A" badge="anchor" />} motion={mixMotion(breathe(t, 84, 0.025))} />
      </g>
      <Panel x={1250} y={540} w={1000} h={440} o={ramp(s, 0.3, 0.7)} stroke="#F2C230" />
      <Txt x={1250} y={470} text="SƯ ĐOÀN" size={56} color="#F2C230" stroke="none" o={ramp(s, 0.5, 0.9)} />
      <Txt x={1250} y={560} text="THỦY QUÂN LỤC CHIẾN" size={70} stroke="none" o={ramp(s, 0.7, 1.1)} />
      <Txt x={1250} y={640} text="Quân lực Việt Nam Cộng hòa" size={44} color="#C9BFA8" stroke="none" weight={600} o={ramp(s, 1.0, 1.5)} />
      <Candle x={230} y={930} s={130} t={t} seed={6} /><Candle x={800} y={930} s={110} t={t} seed={7} />
      <Vignette id="g6" o={0.5} />
    </g>
  );
};

// ---------- G7: "đã có hơn năm nghìn người chết và bị thương." ----------
export const G7: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Quiet id="g7" s={s} cx={520} cy={780} />
      <Panel x={1090} y={520} w={1160} h={700} stroke="#F2C230" />
      <SourceTag x={1090} y={270} text={SRC_MANY} o={ramp(s, 0.1, 0.4)} color="#F2C230" />
      <Txt x={1090} y={650} text="5.000+" size={250} stroke="none" o={ramp(s, 0.3, 0.7)} />
      <Txt x={1090} y={740} text="chết và bị thương" size={66} color="#E4D8C0" stroke="none" weight={700} o={ramp(s, 0.9, 1.3)} />
      <Txt x={1090} y={380} text="TQLC VNCH" size={50} color="#F2C230" stroke="none" o={ramp(s, 0.2, 0.5)} />
      <Txt x={1090} y={830} text={UNSETTLED} size={42} color="#8EA3BA" stroke="none" weight={600} o={ramp(s, 1.6, 2.1)} />
      <Ball id="g7r" x={240} y={640} r={150} flag="RVN" eyes="sad" tear t={t} hat={<Beret color="#2F6B3A" badge="anchor" />} motion={breathe(t, 84, 0.025)} />
      <Candle x={130} y={930} s={130} t={t} seed={8} /><Candle x={440} y={930} s={120} t={t} seed={9} />
      <Vignette id="g7" o={0.5} />
    </g>
  );
};
