import React from 'react';
import {
  Schematic, SCH, SchLabel, CountUp, DrawOn, FocusRings, kf, clamp, easeOut, backOut, camT, FONT, ShotProps,
} from '../../engine';
import { NumCard, fmtVN } from '../khong-ai-ngheo/chb-cards-and-marks';
import { VnOutline } from '../tien-vo-han/cha-vietnam-map-props';
import { WorldDots, BarrelIcon, PumpIcon, SourceTag, ThatStamp, mapXY } from './chb-card-props';

// Chapter B, "week one" the oil price (B19-B24): 2022 (B19), Ukraine on a plain map and the oil (B20), the barrel at
// about 140 USD with its spike (B21), thousands of km to Vietnam (B22), about 33.000 đ a litre (B23), and where there is
// war, a price tag shooting off the card (B24). Places are only labels on the dot map.

const UK = mapXY(31, 49);
const VN = mapXY(106, 16);

// ---------- B19: "2022" ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="sb19" to={2022} statik>
    <WorldDots o={0.22} />
  </NumCard>
);

// ---------- B20: the map pushes in on Ukraine (a pin and a quiet ring); the barrel of oil appears beside it ----------
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const pin = backOut(clamp((t - 33) / 7));
  const barrel = backOut(clamp((t - 55) / 8));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, UK.x + 130]]), kf(t, [[0, 540], [len, UK.y]]), kf(t, [[0, 1.0], [len, 1.9]]))}>
      <Schematic t={t} id="sb20" />
      <WorldDots o={0.95} />
      <g transform={`translate(${UK.x} ${UK.y}) scale(${pin})`}>
        <circle r={9} fill={SCH.live} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} />
        <circle r={9 + ((t * 0.5) % 22)} fill="none" stroke={SCH.live} strokeWidth={2.5} opacity={1 - ((t * 0.5) % 22) / 22} />
      </g>
      <SchLabel x={UK.x + 20} y={UK.y - 30} t={t - 36} text="UKRAINE" size={34} color={SCH.line} anchor="start" />
      <g transform={`translate(${UK.x + 215} ${UK.y + 60}) scale(${barrel * 0.62})`}>
        <BarrelIcon x={0} y={0} />
      </g>
      <SchLabel x={UK.x + 215} y={UK.y + 142} t={t - 60} text="GIÁ DẦU" size={30} />
    </g>
  );
};

// ---------- B21: the barrel, "≈ 140 USD / THÙNG", and the price line that spikes ----------
export const B21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="sb21" />
    <g transform={`translate(0 ${Math.sin(t / 9) * 4})`}><BarrelIcon x={360} y={450} s={2.1} /></g>
    <CountUp x={1090} y={500} t={t} to={140} dur={30} size={300} format={(v) => `≈ ${Math.round(v)}`} />
    <text x={1090} y={622} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={100} fill={SCH.line} letterSpacing={5} opacity={easeOut(clamp((t - 6) / 7))}>USD / THÙNG</text>
    <path d="M 300 930 L 1700 930" stroke={SCH.dim} strokeWidth={3} />
    <DrawOn t={t - 14} dur={34} color={SCH.live} width={9} d="M 320 915 L 480 905 L 620 910 L 760 890 L 900 870 L 1000 790 L 1080 740 L 1140 716 L 1210 770 L 1340 800 L 1520 806" />
    {t > 44 ? <circle cx={1140} cy={716} r={14} fill={SCH.live} style={{ filter: `drop-shadow(0 0 10px ${SCH.glow})` }} /> : null}
    <FocusRings x={1140} y={716} t={t - 46} r0={10} color={SCH.glow} />
    <SourceTag x={140} y={1010} t={t - 8} text="ICE BRENT · 2022" />
  </g>
);

// ---------- B22: from the Ukraine pin an arc draws all the way to Vietnam: hàng nghìn km ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const mx = (UK.x + VN.x) / 2;
  const my = Math.min(UK.y, VN.y) - 230;
  const pop = backOut(clamp((t - 4) / 7));
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1230]]), 470, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Schematic t={t} id="sb22" />
      <WorldDots o={0.95} />
      <circle cx={UK.x} cy={UK.y} r={9} fill={SCH.live} />
      <SchLabel x={UK.x - 16} y={UK.y - 24} t={t} text="UKRAINE" size={30} color={SCH.line} anchor="end" />
      <DrawOn t={t - 2} dur={30} color={SCH.live} width={6} d={`M ${UK.x} ${UK.y} Q ${mx} ${my} ${VN.x} ${VN.y}`} />
      <g transform={`translate(${VN.x} ${VN.y}) scale(${pop})`}>
        <circle r={11} fill={SCH.live} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} />
      </g>
      <SchLabel x={VN.x + 20} y={VN.y + 46} t={t - 8} text="VIỆT NAM" size={34} anchor="start" />
      <SchLabel x={mx} y={my + 70} t={t - 34} text="HÀNG NGHÌN KM" size={46} />
    </g>
  );
};

// ---------- B23: Vietnam's outline, a pump, "≈ 33.000 đ / lít", then ĐÓ LÀ THẬT ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t} id="sb23" />
    <g transform="translate(150 130) scale(0.9)"><VnOutline id="sb23vn" t={t} dur={24} fillT={14} /></g>
    <g transform={`translate(0 ${Math.sin(t / 9) * 3})`}><PumpIcon x={700} y={440} s={1.5} /></g>
    <CountUp x={1390} y={500} t={t - 4} to={33000} dur={40} size={190} format={(v) => `≈ ${fmtVN(Math.round(v / 10) * 10)}`} />
    <text x={1390} y={620} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill={SCH.line} letterSpacing={5} opacity={easeOut(clamp((t - 8) / 7))}>Đ / LÍT</text>
    <ThatStamp x={1210} y={810} t={t - 74} rot={-3} />
    <SourceTag x={140} y={1010} t={t - 14} text="LIÊN BỘ CÔNG THƯƠNG – TÀI CHÍNH" />
  </g>
);

// ---------- B24: the price tag tears off the card and shoots away; more follow ----------
const FlyTag: React.FC<{ x: number; y: number; rot: number; s: number; label?: string }> = ({ x, y, rot, s, label }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -90 0 L 90 0 L 90 150 L -90 150 Z" fill="#FFE7A8" stroke="#12101C" strokeWidth={5} strokeLinejoin="round" />
    <circle cx={0} cy={22} r={9} fill="#2A2330" />
    {label ? (
      <text x={0} y={104} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#C8202F">{label}</text>
    ) : (
      <path d="M -26 120 L 0 74 L 26 120 M 0 74 V 138" stroke="#C8202F" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </g>
);
const LAUNCH = [{ at: 36, x: 1230, label: '33.000' }, { at: 46, x: 700, label: '' }, { at: 52, x: 1240, label: '' }, { at: 58, x: 470, label: '' }, { at: 62, x: 1480, label: '' }];
export const B24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t} id="sb24" />
    <rect x={560} y={250} width={800} height={500} rx={30} fill="#14223A" stroke={SCH.dim} strokeWidth={4} />
    <text x={960} y={520} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={120} fill={SCH.live} opacity={0.9}>33.000</text>
    <text x={960} y={620} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill={SCH.line} letterSpacing={4}>Đ / LÍT</text>
    <path d="M 860 180 V 250 M 1060 180 V 250" stroke={SCH.dim} strokeWidth={3} strokeDasharray="10 8" />
    {LAUNCH.map((l, i) => {
      const k = t - l.at;
      if (i > 0 && k < 0) return null;
      const first = i === 0;
      const y = first ? 330 - (k > 0 ? 1.4 * k * k : 0) : 1250 - 18 * k - 0.9 * k * k;
      const x = l.x + (first && k > 0 ? 2 * k : 0);
      const wob = (k > 0 ? Math.sin(k * 0.5 + i) * 8 : 0) + (first && k > 0 ? k * 1.5 : 0);
      const s = first ? 1.9 + (k > 0 ? 0.02 * k : 0) : 1.2;
      return (
        <g key={i}>
          {k > 2 ? [0, 1, 2].map((j) => <path key={j} d={`M ${x - 50 + j * 50} ${y + 150 * s + 20} v ${60 + k * 5}`} stroke={SCH.line} strokeWidth={5} strokeLinecap="round" opacity={0.4 - j * 0.08} />) : null}
          <FlyTag x={x} y={y} rot={wob} s={s} label={l.label || undefined} />
        </g>
      );
    })}
    <SchLabel x={960} y={940} t={t - 52} text="ĐẮT HƠN NHIỀU" size={84} color="#FF6A4A" />
  </g>
);
