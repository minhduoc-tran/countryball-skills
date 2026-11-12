import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { cameraAt } from '../../countryball/geo-camera';
import { Candle } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { CitadelPlanInMap } from '../../countryball/citadel-plan';
import { backOut, clamp, easeOut, hash } from '../../countryball/fx-math';
import { Backdrop, Dim, MapHud, Pop, proj, QtMap, ramp, sec, Silhouette, Txt } from './chb-common';
import { Push } from './che-common';
import { Uni } from './shots-che-students';

// Chapter E, beat "22 thac" (E17-E22, 439.0-456.4 s): Nguyễn Văn Thạc (14.10.1952-30.7.1972), Hà Nội University student, wrote a diary
// on the march and fell in Quảng Trị; the diary was printed as "Mãi mãi tuổi hai mươi". Name card with a plain silhouette, never a face.

/** Handwriting-like scribble lines on a page: u 0..1 = how much is written. */
const Scribble: React.FC<{ x: number; y: number; w: number; lines: number; u: number; seed?: number; color?: string }> = ({ x, y, w, lines, u, seed = 1, color = '#2B3A55' }) => (
  <g fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
    {Array.from({ length: lines }, (_, j) => {
      const prog = clamp(u * lines - j), n = Math.round((w / 15) * prog);
      if (n < 2) return null;
      let d = `M${x},${y + j * 46}`;
      for (let i = 1; i <= n; i++) d += ` q7,${-12 - 8 * hash(i + j * 40, seed)} 14,${(hash(i, seed + j) - 0.5) * 8}`;
      return <path key={j} d={d} />;
    })}
  </g>
);

/** Printed book cover (portrait), (x, y) = centre. */
const BookCover: React.FC<{ x: number; y: number; w?: number; h?: number; rot?: number; title?: boolean; o?: number }> = ({ x, y, w = 200, h = 290, rot = 0, title = false, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o} stroke="#141414" strokeWidth={5} strokeLinejoin="round">
    <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w} height={h} rx={8} fill="#000" opacity={0.3} stroke="none" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#1D3A33" />
    <rect x={-w / 2} y={-h / 2} width={w * 0.1} height={h} rx={6} fill="#122822" />
    <rect x={-w / 2 + w * 0.18} y={-h / 2 + h * 0.07} width={w * 0.74} height={h * 0.86} fill="none" stroke="#E2B95A" strokeWidth={3} />
    {title && <g fontFamily={FONT.title} fontWeight={800} fill="#F2E3B5" stroke="none" textAnchor="middle" fontSize={w * 0.1}>
      <text x={w * 0.05} y={-h * 0.18}>MÃI MÃI</text><text x={w * 0.05} y={-h * 0.08}>TUỔI HAI MƯƠI</text></g>}
  </g>
);

// ---------- E17: name card (plain silhouette, no cap, no face) ----------
export const E17: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = easeOut(ramp(s, 0.2, 0.7));
  return (
    <g>
      <Backdrop s={s} id="e17" />
      <g opacity={0.35}><Uni x={1500} y={760} s={1.6} lit={0.4} /></g>
      <Push s={s} dur={4} to={1.04} cy={500}>
        <g transform={`translate(${(1 - k) * 1100},0)`} opacity={clamp(k * 1.6)}>
          <rect x={248} y={228} width={1440} height={420} rx={26} fill="#000" opacity={0.35} />
          <rect x={240} y={220} width={1440} height={420} rx={26} fill="#15202D" stroke="#E2B95A" strokeWidth={5} />
          <clipPath id="e17-sil"><rect x={262} y={242} width={330} height={376} rx={16} /></clipPath>
          <rect x={262} y={242} width={330} height={376} rx={16} fill="#2A3C50" />
          <g clipPath="url(#e17-sil)"><Silhouette x={427} y={630} s={1.3} color="#101A26" cap={false} /></g>
          <Txt x={650} y={340} text="SINH VIÊN" size={54} color="#E2B95A" anchor="start" stroke="none" />
          <Txt x={650} y={450} text="NGUYỄN VĂN THẠC" size={94} anchor="start" stroke="none" />
          <Txt x={650} y={545} text="Đại học Tổng hợp Hà Nội" size={52} color="#B9C6D6" anchor="start" stroke="none" weight={600} o={ramp(s, 1.6, 2.0)} />
        </g>
      </Push>
    </g>
  );
};

// ---------- E18: the diary written on the march ----------
export const E18: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), u = ramp(s, 0.3, 2.3);
  const pen = (() => { const j = Math.min(4, Math.floor(u * 5)), p = clamp(u * 5 - j); return [380 + p * 380 + 40, 470 + j * 46 - 6]; })();
  return (
    <g>
      <Backdrop s={s} id="e18" top="#1B2432" bottom="#0B111B" />
      <g fill="none" stroke="#E2B95A" strokeWidth={5} strokeDasharray="3 16" strokeLinecap="round" opacity={0.35}>
        <path d={`M0,${960 - s * 20} Q500,820 960,900 T1920,780`} />
      </g>
      <Push s={s} dur={2.5} to={1.05} cy={560}>
        <rect x={300} y={330} width={1320} height={560} rx={14} fill="#000" opacity={0.35} transform="translate(10,12)" />
        <path d="M310,340 L950,360 L950,890 L310,870 Z" fill="#F1E6C8" stroke="#141414" strokeWidth={5} strokeLinejoin="round" />
        <path d="M970,360 L1610,340 L1610,870 L970,890 Z" fill="#F4EBD0" stroke="#141414" strokeWidth={5} strokeLinejoin="round" />
        <line x1={960} y1={360} x2={960} y2={890} stroke="#141414" strokeWidth={5} />
        <Scribble x={380} y={470} w={520} lines={5} u={Math.min(1, u * 2)} seed={3} />
        <Scribble x={1030} y={470} w={520} lines={5} u={clamp(u * 2 - 1)} seed={9} />
        {u < 1 && <g transform={`translate(${pen[0] > 900 ? pen[0] + 650 : pen[0]},${pen[1]}) rotate(35)`}><rect x={0} y={-6} width={110} height={12} rx={5} fill="#3F6FB3" stroke="#141414" strokeWidth={3} /></g>}
      </Push>
      <Txt x={960} y={190} text="NHẬT KÝ HÀNH QUÂN" size={96} o={ramp(s, 0.1, 0.45)} />
    </g>
  );
};

// ---------- E19: 30.07.1972, Quảng Trị at night (day 33/81): the map flies down onto the ruined Citadel ----------
export const E19: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), T = CAMERAS.triThienFront;
  const cam = cameraAt([{ t: 0, ...T }, { t: 2.9, lon: 107.1896, lat: 16.7539, zoom: 34000, ease: 'out' }], s), [qx, qy] = proj(cam)(107.1896, 16.7539), pulse = (s * 0.9) % 1;
  return (
    <g>
      <QtMap cam={cam} id="e19m" night={0.65} sites={['quangTri', 'dongHa']}><CitadelPlanInMap damage={0.85} fires={0.4} flood={0.3} /></QtMap>
      <circle cx={qx} cy={qy} r={18 + pulse * 90} fill="none" stroke="#FFE9B0" strokeWidth={4} opacity={(1 - pulse) * 0.8} />
      <Dim o={0.12} />
      <Txt x={960} y={940} text="MẶT TRẬN QUẢNG TRỊ" size={64} o={ramp(s, 1.0, 1.4)} />
      <MapHud s={s} cam={cam} date="30.07.1972" day="NGÀY 33/81" />
    </g>
  );
};

// ---------- E20: quiet card: candles, 1952 - 1972, not yet twenty ----------
export const E20: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="e20" top="#0F1824" bottom="#05090F" />
      <Glow x={960} y={600} r={760} color="#FFB347" o={0.16} />
      <Push s={s} dur={3.1} to={1.04} cy={560}>
        <Silhouette x={960} y={880} s={1.5} color="#0B121B" cap={false} rim="#8C7A52" />
        <Candle x={520} y={900} s={170} t={t} seed={1} /><Candle x={1400} y={900} s={170} t={t} seed={2} />
      </Push>
      <Txt x={960} y={190} text="NGUYỄN VĂN THẠC" size={70} color="#E2B95A" o={ramp(s, 0.1, 0.5)} />
      <Txt x={960} y={330} text="1952 – 1972" size={130} o={ramp(s, 0.3, 0.8)} />
      <Txt x={960} y={420} text="CHƯA TRÒN HAI MƯƠI TUỔI" size={58} color="#DCE4EC" o={ramp(s, 1.55, 1.95)} />
    </g>
  );
};

// ---------- E21: the diary becomes a printed book (copies pop up) ----------
export const E21: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), slide = easeOut(ramp(s, 0.2, 1.0));
  return (
    <g>
      <Backdrop s={s} id="e21" />
      <g transform={`translate(${520 - 40 * slide},${600}) rotate(${-6 + 4 * slide})`} stroke="#141414" strokeWidth={5} strokeLinejoin="round">
        <rect x={-150} y={-190} width={300} height={380} rx={10} fill="#8A6B3F" /><rect x={-150} y={-190} width={36} height={380} fill="#5A4426" />
        <rect x={-90} y={-120} width={190} height={70} rx={6} fill="#EDE0BC" strokeWidth={3.5} />
        <Scribble x={-76} y={-84} w={160} lines={1} u={1} seed={4} />
      </g>
      <Txt x={520} y={880} text="NHẬT KÝ" size={52} color="#DCE4EC" o={ramp(s, 0.3, 0.6)} />
      <g fill="none" stroke="#E2B95A" strokeWidth={10} strokeLinecap="round" opacity={ramp(s, 1.2, 1.5)}>
        <line x1={780} y1={600} x2={1000} y2={600} /><path d="M980,560 L1030,600 L980,640" />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <Pop key={i} s={s} at={1.3 + i * 0.16} x={1330 + (i - 2) * 56} y={600}>
          <BookCover x={1330 + (i - 2) * 56} y={610 - Math.abs(i - 2) * 12} w={230} h={330} rot={(i - 2) * 6} />
        </Pop>
      ))}
      <Txt x={1330} y={880} text="IN THÀNH SÁCH" size={64} color="#FFD166" o={ramp(s, 1.7, 2.0)} />
    </g>
  );
};

// ---------- E22: the title: "MÃI MÃI TUỔI HAI MƯƠI" ----------
export const E22: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = backOut(ramp(s, 0, 0.45));
  return (
    <g>
      <Backdrop s={s} id="e22" top="#13263B" bottom="#06101B" />
      <Glow x={960} y={560} r={760} color="#FFD98A" o={0.14} />
      <g transform={`translate(960,520) scale(${(0.5 + 0.5 * k) * (1 + 0.03 * s)}) rotate(${(1 - k) * -10 - 2})`}><BookCover x={0} y={0} w={700} h={720} /></g>
      <Txt x={960} y={470} text="MÃI MÃI" size={70} color="#F2E3B5" o={ramp(s, 0.55, 0.8)} />
      <Txt x={960} y={555} text="TUỔI HAI MƯƠI" size={70} color="#F2E3B5" o={ramp(s, 1.0, 1.4)} />
      <Txt x={960} y={940} text="Nhật ký Nguyễn Văn Thạc" size={50} color="#B9C6D6" o={ramp(s, 1.4, 1.8)} />
    </g>
  );
};
