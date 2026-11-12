import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { cameraAt } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { LowerThird } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { Ball } from '../../countryball/countryball';
import { MuCoi, UsafCap } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion, talk } from '../../countryball/ball-motion';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { hash } from '../../countryball/fx-math';
import { Book, DimMap, Panel, Txt, drift, fade, pop, ramp, sec, GOLD, INK } from './chg-common';

// Chapter G, part 2 (G16-G24, 645.31-668.24 s): historians say the deal ~ the October draft; 8.1.1973 back to Paris.

const BOOKS = ['#B84A36', '#3F6FA8', '#C9A227', '#4E7A4A', '#7A4E8A', '#B8643A', '#2F5F6F'];
const Shelf: React.FC<{ s: number; x: number; y: number; n: number; at: number }> = ({ s, x, y, n, at }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = pop(s, at + i * 0.12, 0.4);
      return <Book key={i} x={x + i * 78} y={y - (1 - Math.min(1, k)) * 90} w={62} h={150 + (i % 3) * 28} color={BOOKS[i % BOOKS.length]} tilt={i === n - 1 ? 9 : 0} />;
    })}
    <rect x={x - 50} y={y} width={n * 78 + 22} height={18} rx={6} fill="#6B4A2E" stroke="#111" strokeWidth={5} />
  </g>
);

export const G16: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g16" keys={drift(106, 17, 14, 1, 1, 1.1, 3)} dim={0.7} cities={false} />
      <Txt x={960} y={230} size={120} fill={GOLD} o={fade(s, 0.05)} dy={(1 - fade(s, 0.05)) * 40}>MỘT SỰ THẬT</Txt>
      <Shelf s={s} x={620} y={720} n={7} at={0.7} />
      <Txt x={960} y={860} size={68} o={fade(s, 1.3)}>NHIỀU NHÀ SỬ HỌC</Txt>
    </g>
  );
};

export const G17: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g17" keys={drift(106, 17, 14, 1, 1, 1.1, 3)} dim={0.7} cities={false} />
      <Shelf s={99} x={160} y={760} n={5} at={0} />
      <g opacity={fade(s, 0.15)} transform={`translate(0,${(1 - fade(s, 0.15)) * 60})`}>
        <Ball id="g17b" x={1250} y={560} r={150} flag="USA" eyes="normal" t={f} motion={mixMotion(breathe(f, 70, 0.03), talk(f, true))} look={-1} />
        {/* the book the US ball holds */}
        <g transform="translate(1110,720) rotate(-12)">
          <rect x={-70} y={-48} width={140} height={96} rx={8} fill="#3F6FA8" stroke="#111" strokeWidth={6} />
          <rect x={-56} y={-30} width={112} height={12} fill="#F2E8C8" /><rect x={-56} y={-8} width={84} height={8} fill="#F2E8C8" opacity={0.7} />
        </g>
      </g>
      <Txt x={1290} y={190} size={80} o={fade(s, 0.1)}>KỂ CẢ SỬ GIA MỸ</Txt>
      <Txt x={1290} y={880} size={64} fill={GOLD} o={fade(s, 1.55)}>cũng chỉ ra điều ấy</Txt>
    </g>
  );
};

export const G18: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const k = pop(s, 0.35, 0.5);
  return (
    <g>
      <DimMap s={s} id="g18" keys={drift(2.35, 48.8, 120, 0, 0, 1.12, 4)} dim={0.72} />
      <Txt x={960} y={170} size={64} o={fade(s, 0.05)}>HIỆP ĐỊNH ĐƯỢC KÝ SAU</Txt>
      <Txt x={960} y={250} size={64} fill={GOLD} o={fade(s, 0.2)}>12 NGÀY ĐÊM ẤY</Txt>
      <g transform={`translate(960,620) scale(${Math.max(0.001, 3.6 * k)}) rotate(${(1 - Math.min(1, k)) * -8})`}>
        <DocumentProp x={0} y={0} title="HIỆP ĐỊNH" />
      </g>
      <Txt x={960} y={920} size={50} fill="#C9D6FF" mono weight={400} o={fade(s, 1.2)}>THÁNG 1.1973</Txt>
    </g>
  );
};

export const G19: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const slide = ramp(s, 0, 0.7);
  const eq = pop(s, 0.9, 0.35);
  return (
    <g>
      <DimMap s={s} id="g19" keys={drift(2.35, 48.8, 120, 0, 0, 1.12, 4)} dim={0.74} />
      {[{ x: 480 + 120 * slide, title: 'DỰ THẢO', sub: 'THÁNG 10.1972' }, { x: 1440 - 120 * slide, title: 'HIỆP ĐỊNH', sub: 'THÁNG 1.1973' }].map((d, i) => (
        <g key={i} transform={`translate(${d.x},520) scale(2.9)`} opacity={fade(s, 0.0, 0.3)}>
          <DocumentProp x={0} y={0} title={d.title} />
          <text y={92} textAnchor="middle" fontFamily={FONT.ui} fontSize={13} fill="#C9D6FF" stroke={INK} strokeWidth={3} paintOrder="stroke">{d.sub}</text>
        </g>
      ))}
      <g transform={`translate(960,520) scale(${Math.max(0, eq)})`}>
        <circle r={80} fill="#15181F" stroke={GOLD} strokeWidth={7} />
        <Txt x={0} y={36} size={110} sw={0} fill={GOLD}>≈</Txt>
      </g>
      <Txt x={960} y={960} size={74} o={fade(s, 1.0)}>GẦN NHƯ GIỐNG HỆT</Txt>
    </g>
  );
};

export const G20: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const N = 15, FALL = 24;
  return (
    <g>
      <DimMap s={s} id="g20" keys={drift(105.0, 22.6, 125, 0, 0, 1.1, 3)} dim={0.5} night={0.7} cities={false} />
      <rect x={0} y={900} width={1920} height={180} fill="#10131A" opacity={0.7} />
      {Array.from({ length: N }, (_, i) => {
        const t0 = 4 + i * 3.2, x = 140 + i * 117 + (hash(i, 2) - 0.5) * 40, u = (t - t0) / FALL;
        const y = -80 + 1000 * u * u;
        return (
          <g key={i}>
            {u >= 0 && u < 1 && (
              <g transform={`translate(${x},${y}) rotate(90)`}>
                <ellipse rx={30} ry={11} fill="#4B5538" stroke="#111" strokeWidth={4} />
                <polygon points="-30,-11 -44,-16 -44,16 -30,11" fill="#66744A" stroke="#111" strokeWidth={3.5} strokeLinejoin="round" />
              </g>
            )}
            {u >= 1 && <GroundBlast t={t} t0={t0 + FALL} x={x} y={930} r={36} linger={80} />}
          </g>
        );
      })}
      <Txt x={960} y={250} size={110} o={fade(s, 0.1)}>NHỮNG TẤN BOM ẤY</Txt>
      <Txt x={960} y={340} size={54} fill={GOLD} o={fade(s, 0.5)} sw={8}>hơn 20.000 tấn</Txt>
    </g>
  );
};

export const G21: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  const st = pop(s, 1.9, 0.3);
  return (
    <g>
      <DimMap s={s} id="g21" keys={drift(2.35, 48.8, 120, 0, 0, 1.12, 4)} dim={0.74} />
      <Txt x={960} y={150} size={58} o={fade(s, 0.05)}>ĐIỀU KHOẢN TRÊN BÀN ĐÀM PHÁN</Txt>
      {[{ x: 560, title: 'DỰ THẢO', sub: 'THÁNG 10.1972' }, { x: 1360, title: 'HIỆP ĐỊNH', sub: 'THÁNG 1.1973' }].map((d, i) => (
        <g key={i} transform={`translate(${d.x},470) scale(2.3)`}>
          <DocumentProp x={0} y={0} title={d.title} />
          <text y={92} textAnchor="middle" fontFamily={FONT.ui} fontSize={13} fill="#C9D6FF" stroke={INK} strokeWidth={3} paintOrder="stroke">{d.sub}</text>
        </g>
      ))}
      <Ball id="g21a" x={330} y={850} r={100} flag="VNM" eyes="normal" hat={<MuCoi />} t={f} motion={breathe(f, 70, 0.03)} look={1} />
      <Ball id="g21b" x={1590} y={850} r={100} flag="USA" eyes="worried" hat={<UsafCap />} t={f} motion={breathe(f, 70, 0.03, 30)} look={-1} />
      <g transform={`translate(960,790) rotate(-4) scale(${Math.max(0, st * 0.8)})`} opacity={Math.min(1, st * 2)}>
        <rect x={-300} y={-70} width={600} height={140} rx={16} fill="#15181F" fillOpacity={0.85} stroke="#E14B4B" strokeWidth={12} />
        <text y={26} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#E14B4B">KHÔNG THAY ĐỔI</text>
      </g>
    </g>
  );
};

export const G22: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const cam = cameraAt([{ t: 0, lon: 85, lat: 32, zoom: 7 }, { t: 2.7, lon: 2.35, lat: 47.5, zoom: 70 }], s);
  return (
    <g>
      <GeoMap camera={cam} highlight={['FRA']} id="g22"><City {...CITIES.paris} size={34} /></GeoMap>
      <DateChip label="8.1.1973" t={s} />
      <LowerThird title="Paris" sub="Hai bên quay lại bàn đàm phán" from={0.8} to={2.7} t={s} />
      <MiniMap camera={cam} />
    </g>
  );
};

export const G23: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g23" keys={drift(2.35, 48.86, 200, 0, 0, 1.12, 4)} dim={0.72} cities={false} />
      <Txt x={960} y={150} size={70} o={fade(s, 0.1)}>BÀN ĐÀM PHÁN PARIS</Txt>
      <Ball id="g23c" x={960} y={400} r={78} flag="FRA" eyes="normal" t={f} motion={breathe(f, 80, 0.03, 10)} />
      <Ball id="g23a" x={600} y={560} r={120} flag="VNM" eyes="normal" hat={<MuCoi />} t={f} motion={mixMotion(breathe(f, 70, 0.03), hop(f, 60, 12, 0))} look={1} />
      <Ball id="g23b" x={1320} y={560} r={120} flag="USA" eyes="normal" hat={<UsafCap />} t={f} motion={mixMotion(breathe(f, 70, 0.03, 30), hop(f, 60, 12, 30))} look={-1} />
      <rect x={380} y={640} width={1160} height={120} rx={26} fill="#7A5A3A" stroke="#111" strokeWidth={7} />
      <rect x={380} y={640} width={1160} height={32} rx={16} fill="#9A7650" />
      <g transform={`translate(960,${690 - (1 - fade(s, 0.4)) * 80}) scale(0.9) rotate(-4)`} opacity={fade(s, 0.4)}><DocumentProp x={0} y={0} /></g>
      <Txt x={960} y={900} size={46} fill={GOLD} o={fade(s, 1.0)}>Paris, 8.1.1973</Txt>
    </g>
  );
};

export const G24: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const u = ramp(s, 0.15, 1.9), day = 8 + Math.floor(19.99 * u);
  return (
    <g>
      <DimMap s={s} id="g24" keys={drift(2.35, 48.86, 200, 0, 0, 1.12, 4)} dim={0.78} cities={false} />
      <Panel x={460} y={230} w={1000} h={520} accent={GOLD} />
      <text x={960} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#9DB4CC">THÁNG 1.1973</text>
      <text x={960} y={640} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={250} fill="#F4F4F4" stroke={INK} strokeWidth={18} paintOrder="stroke">{day}</text>
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} cx={420 + i * 64} cy={850} r={i + 8 === day ? 19 : 15} fill={i + 8 <= day ? GOLD : '#2D3644'} stroke="#111" strokeWidth={4} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = ((s * 1700 + i * 520) % 2200) - 150;
        return <line key={i} x1={x} y1={140 + i * 190} x2={x + 190} y2={140 + i * 190} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.35} />;
      })}
      <Txt x={960} y={970} size={78} o={fade(s, 0.9)} dy={(1 - fade(s, 0.9)) * 30}>RẤT NHANH</Txt>
      <Txt x={460} y={800} size={36} anchor="start" fill="#C9D6FF" o={0.9} sw={5} weight={600}>8.1</Txt>
      <Txt x={1460} y={800} size={36} anchor="end" fill="#E8EEF4" o={0.9} sw={5} weight={600}>27.1</Txt>
    </g>
  );
};
