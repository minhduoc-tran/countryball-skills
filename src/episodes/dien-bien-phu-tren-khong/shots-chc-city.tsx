import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi, NonLa } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { project } from '../../countryball/geo-camera';
import { AaGun, Searchlights } from '../../countryball/fx-tracers-and-lights';
import { Glow } from '../../countryball/fx-glow';
import { hash, polar } from '../../countryball/fx-math';
import { CITIES, City } from '../../countryball/map-labels';
import { Cap, Dark, GOLD, INK, MapScene, RED, Shelter, Tag, clamp, drift, easeOut, ramp } from './chc-helpers';

// Chapter C, part 5 (4:33-5:03): Hà Nội prepares. C29-C32 evacuation, shelters, "ready"; C33-C36 the loudspeaker, 50 km warning,
// the street going underground; C37-C38 militia on the rooftops beside their machine guns. No casualties drawn.

const HN: [number, number] = [105.85, 21.03];

/** Tube-house street at dusk/night: sky, tall narrow houses with lit windows, pavement strip at y = 840. */
const StreetBg: React.FC<{ id: string; night?: number; t: number }> = ({ id, night = 0.6, t }) => {
  let x = -20;
  const houses: React.ReactNode[] = [];
  for (let i = 0; x < 1960; i++) {
    const w = 150 + hash(i, 3) * 120, h = 330 + hash(i, 5) * 260, col = ['#6B5A4A', '#7A6A55', '#5C6B6E', '#8A7660'][i % 4];
    houses.push(
      <g key={i} transform={`translate(${x},${840 - h})`}>
        <rect width={w} height={h} fill={col} stroke={INK} strokeWidth={5} />
        <rect x={-6} y={-24} width={w + 12} height={28} fill="#4A3A30" stroke={INK} strokeWidth={5} />
        {Array.from({ length: Math.floor(h / 120) }, (_, r) => (
          <rect key={r} x={w * 0.2} y={40 + r * 110} width={w * 0.6} height={64} fill={hash(i + r, 9) > 0.45 ? '#FFD98A' : '#2A2F38'} opacity={hash(i + r, 9) > 0.45 ? 0.55 + 0.4 * (1 - night) : 0.9} stroke={INK} strokeWidth={4} />
        ))}
      </g>,
    );
    x += w - 4;
  }
  return (
    <g>
      <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0A1226" /><stop offset="1" stopColor="#4A4A66" /></linearGradient></defs>
      <rect width={1920} height={1080} fill={`url(#${id}-sky)`} />
      {houses}
      <rect y={840} width={1920} height={240} fill="#55565C" stroke={INK} strokeWidth={6} />
      <rect y={840} width={1920} height={22} fill="#8D8E94" />
      <rect width={1920} height={1080} fill="#050B18" opacity={night * 0.35 + 0.05 * Math.sin(t / 12)} />
    </g>
  );
};

/** C29 "Đầu tháng mười hai, Hà Nội sơ tán." */
export const C29: React.FC<ShotProps> = ({ t }) => (
  <MapScene id="c29" t={t} keys={drift([105.85, 21.02, 220], [105.85, 21.03, 290], 3)} date="12.1972"
    over={(cam) => {
      const [x, y] = project(cam, HN[0], HN[1]);
      return (
        <g>
          <Ball id="c29-v" x={x + 110} y={y - 60} r={44} flag="VNM" eyes="worried" hat={<NonLa />} motion={breathe(t, 50, 0.04)} />
          <Cap t={t} x={960} y={950} text="ĐẦU THÁNG 12: HÀ NỘI SƠ TÁN" size={58} at={6} />
        </g>
      );
    }} />
);

/** C30 "Hàng trăm nghìn người ... rời thành phố về các vùng quê xung quanh." Small balls stream out of Hà Nội to villages. */
export const C30: React.FC<ShotProps> = ({ t }) => (
  <MapScene id="c30" t={t} keys={drift([105.85, 21.02, 330], [105.85, 21.02, 170], 5.4)} date="12.1972"
    over={(cam) => {
      const [cx, cy] = project(cam, HN[0], HN[1]);
      const walkers = Array.from({ length: 48 }, (_, i) => {
        const ang = (i % 8) * 45 + hash(i, 1) * 24 - 12, far = 330 + hash(i, 2) * 150;
        const u = easeOut(clamp((t - i * 2.2) / 90)), d = u * far, p = polar(cx, cy, ang, d + 30), vis = clamp((t - i * 2.2) / 4);
        return <Ball key={i} id={`c30-${i}`} x={p[0]} y={p[1]} r={19} flag="VNM" eyes="normal" hat={i % 3 === 0 ? <NonLa /> : undefined} shadow={false} motion={hop(t, 18, 4, i * 5)} t={0} />;
      });
      const villages = Array.from({ length: 8 }, (_, i) => { const p = polar(cx, cy, i * 45 + 6, 520 + (i % 2) * 40); return [p[0], p[1]] as const; });
      return (
        <g>
          {villages.map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`} opacity={ramp(t, 40, 80)}>
              <rect x={-18} y={-6} width={36} height={24} fill="#E8D5A8" stroke={INK} strokeWidth={4} /><polygon points="-26,-6 0,-30 26,-6" fill="#A8472F" stroke={INK} strokeWidth={4} />
            </g>
          ))}
          {walkers}
          <Tag t={t} at={20} x={960} y={950} text="HÀNG TRĂM NGHÌN NGƯỜI RỜI THÀNH PHỐ" fill="#1D3A5C" size={46} sub="Phần lớn là người già và trẻ em" />
        </g>
      );
    }} />
);

/** C31 "Hầm trú ẩn cá nhân được đào dọc vỉa hè." Round shelters appear one by one along the pavement. */
export const C31: React.FC<ShotProps> = ({ t }) => (
  <g>
    <StreetBg id="c31" t={t} />
    {[260, 620, 980, 1340, 1700].map((x, i) => {
      const k = easeOut((t - 8 - i * 9) / 8);
      return <g key={x} opacity={k} transform={`translate(0,${(1 - k) * -30})`}><Shelter x={x} y={930} s={1.5} /></g>;
    })}
    <Ball id="c31-v" x={440} y={760} r={80} flag="VNM" eyes="determined" hat={<NonLa />} motion={hop(t, 30, 14)} />
    <Cap t={t} x={960} y={160} text="HẦM TRÚ ẨN CÁ NHÂN DỌC VỈA HÈ" size={64} at={4} />
  </g>
);

/** C32 "Thành phố đã sẵn sàng." Hà Nội lit at dusk, calm. */
export const C32: React.FC<ShotProps> = ({ t }) => (
  <MapScene id="c32" t={t} keys={drift([105.85, 21.1, 300], [105.85, 21.06, 360], 2)} night={0.75} date="12.1972"
    map={<><City {...CITIES.hanoi} lights={1} size={34} /><City {...CITIES.haiphong} lights={0.9} /></>}
    over={() => <Cap t={t} x={960} y={950} text="THÀNH PHỐ ĐÃ SẴN SÀNG" size={72} color={GOLD} at={4} />} />
);

const Horn: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-30} width={60} height={60} rx={8} fill="#5C6670" stroke={INK} strokeWidth={6} />
    <polygon points="20,-26 150,-80 150,80 20,26" fill="#8B949C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <ellipse cx={150} cy={0} rx={20} ry={80} fill="#2B2F34" stroke={INK} strokeWidth={6} />
  </g>
);
const Rings: React.FC<{ x: number; y: number; t: number; from: number; max?: number }> = ({ x, y, t, from, max = 420 }) => (
  <g>{[0, 1, 2, 3].map((i) => { const a = t - from - i * 9; if (a < 0) return null; const r = 40 + (a % 36) * 8 + (a >= 36 ? 0 : 0); return <circle key={i} cx={x} cy={y} r={Math.min(r, max)} fill="none" stroke="#FFD98A" strokeWidth={8} opacity={clamp(1 - r / max) * 0.8} />; })}</g>
);

/** C33 "Những ai ở lại Hà Nội sống cùng một âm thanh quen thuộc. Tiếng loa phát thanh." A pole loudspeaker; the sound begins. */
export const C33: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(${-ramp(t, 0, len) * 30},0)`}>
    <StreetBg id="c33" t={t} />
    <rect x={1328} y={260} width={24} height={600} fill="#4A3F36" stroke={INK} strokeWidth={5} />
    <Horn x={1350} y={270} s={1.2} rot={-12} />
    <Rings x={1530} y={225} t={t} from={96} />
    <Ball id="c33-v" x={560} y={770} r={90} flag="VNM" eyes="normal" look={0.6} hat={<NonLa />} motion={breathe(t, 60, 0.03)} />
    <Ball id="c33-w" x={760} y={790} r={72} flag="VNM" eyes="normal" look={0.6} motion={breathe(t, 52, 0.03, 9)} />
    <Cap t={t} x={900} y={140} text="MỘT ÂM THANH QUEN THUỘC" size={66} at={4} />
    <Tag t={t} at={96} x={960} y={990} text="TIẾNG LOA PHÁT THANH" fill="#1D3A5C" size={52} />
  </g>
);

/** C34 "Đồng bào chú ý, đồng bào chú ý." Loudspeaker close-up, the call repeated twice. */
export const C34: React.FC<ShotProps> = ({ t }) => {
  const shake = (a: number) => (t >= a && t < a + 10 ? Math.sin(t * 3) * 5 : 0);
  return (
    <g>
      <Dark id="c34" tone="warm" />
      <Rings x={870} y={520} t={t} from={0} max={600} />
      <Horn x={300 + shake(0) + shake(38)} y={520} s={3} />
      <Cap t={t} x={1340} y={420} text="ĐỒNG BÀO CHÚ Ý!" size={84} color={GOLD} at={2} anchor="middle" />
      <Cap t={t} x={1340} y={560} text="ĐỒNG BÀO CHÚ Ý!" size={84} color="#FFFFFF" at={38} anchor="middle" />
    </g>
  );
};

/** C35 "Máy bay địch cách Hà Nội năm mươi cây số." 50 km ring round Hà Nội; a B-52 cell closing. */
export const C35: React.FC<ShotProps> = ({ t, len }) => {
  const u = ramp(t, 0, len);
  return (
    <MapScene id="c35" t={t} keys={drift([105.85, 21.03, 620], [105.85, 21.03, 660], 2.6)} night={0.6} date="12.1972" parallel={false}
      map={<City {...CITIES.hanoi} size={34} />}
      over={(cam) => {
        const [cx, cy] = project(cam, HN[0], HN[1]), r = 0.45 * cam.zoom, p = polar(cx, cy, -150, r * (1.55 - 0.5 * u));
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={RED} strokeWidth={7} strokeDasharray="26 16" />
            <circle cx={cx} cy={cy} r={12} fill={GOLD} stroke={INK} strokeWidth={4} />
            <line x1={cx} y1={cy} x2={cx + r * 0.866} y2={cy + r * 0.5} stroke={GOLD} strokeWidth={5} />
            <Tag t={t} x={cx + r * 0.5} y={cy + r * 0.36 + 50} text="50 KM" fill="#7A5B00" color="#FFE08A" size={44} />
            {[0, 1, 2].map((i) => <AircraftTop key={i} id={`c35-${i}`} kind="b52" x={p[0] + (i ? -50 : 0)} y={p[1] + (i === 1 ? -44 : i === 2 ? 44 : 0)} size={74} heading={30} />)}
            <Cap t={t} x={960} y={990} text="MÁY BAY ĐỊCH CÁCH HÀ NỘI 50 KM" size={58} at={4} />
          </g>
        );
      }} />
  );
};

/** C36 "Tiếng loa vừa dứt, cả phố lập tức xuống hầm." Everyone runs to the shelters, the lids slide shut. */
export const C36: React.FC<ShotProps> = ({ t }) => {
  const sx = [300, 760, 1220, 1680], lid = ramp(t, 50, 68);
  return (
    <g>
      <StreetBg id="c36" t={t} night={0.8} />
      <rect width={1920} height={1080} fill="#B3281F" opacity={0.08 + 0.08 * Math.sin(t / 3)} />
      {sx.map((x, i) => <Shelter key={x} x={x} y={930} s={1.5} lid={lid} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const to = sx[i % 4], from = i < 3 ? -100 + i * 60 : 2020 - (i - 3) * 60, u = easeOut(clamp((t - i * 3) / 36)), x = from + (to - from) * u;
        const sink = clamp((t - 36 - i * 2) / 10), r = 74 * (1 - sink);
        return r > 2 ? <Ball key={i} id={`c36-${i}`} x={x} y={820 + sink * 110} r={r} flag="VNM" eyes="worried" hat={i % 2 ? <NonLa /> : undefined} shadow={false} motion={hop(t, 12, 12, i * 3)} /> : null;
      })}
      <Cap t={t} x={960} y={150} text="CẢ PHỐ XUỐNG HẦM" size={80} at={2} />
    </g>
  );
};

const Roof: React.FC = () => (
  <g>
    <polygon points="0,880 0,700 640,700 700,640 1280,640 1340,700 1920,700 1920,880" fill="#3A3F49" stroke={INK} strokeWidth={6} />
    <rect y={860} width={1920} height={220} fill="#252932" stroke={INK} strokeWidth={6} />
    <rect x={1500} y={520} width={150} height={190} fill="#4B5059" stroke={INK} strokeWidth={6} /><rect x={1490} y={500} width={170} height={30} fill="#2E3238" stroke={INK} strokeWidth={5} />
  </g>
);
const BEAMS = [{ x: 200, y: 1000, base: -75, swing: 18, period: 150 }, { x: 1100, y: 1000, base: -100, swing: 22, period: 170, phase: 0.4 }, { x: 1800, y: 1000, base: -115, swing: 16, period: 140 }];

/** C37 "Còn trên các nóc nhà, dân quân tự vệ" Night rooftops, militia balls with helmets, searchlights sweeping. */
export const C37: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Dark id="c37" tone="night" />
    <Searchlights t={t} sources={BEAMS} length={1100} />
    <Roof />
    {[330, 900, 1360].map((x, i) => <Ball key={x} id={`c37-${i}`} x={x} y={620} r={78} flag="VNM" eyes="determined" look={-0.4} hat={<MuCoi />} motion={breathe(t, 50, 0.03, i * 14)} />)}
    <Tag t={t} at={6} x={960} y={200} text="DÂN QUÂN TỰ VỆ" fill="#2F4A2A" size={72} />
  </g>
);

/** C38 "đã ở sẵn bên những khẩu súng máy." Close on a roof gun and its gunner, waiting. */
export const C38: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960,540) scale(${1 + ramp(t, 0, len) * 0.06}) translate(-960,-540)`}>
    <Dark id="c38" tone="night" />
    <Searchlights t={t} sources={BEAMS} length={1100} />
    <Roof />
    <Glow x={1100} y={560} r={260} color="#FFB347" o={0.1 + 0.05 * Math.sin(t / 8)} />
    <Ball id="c38-v" x={700} y={540} r={150} flag="VNM" eyes="determined" look={0.7} hat={<MuCoi />} motion={breathe(t, 56, 0.03)} />
    <AaGun x={1120} y={650} aim={-52} s={8} />
    <Cap t={t} x={960} y={180} text="Ở SẴN BÊN KHẨU SÚNG MÁY" size={76} at={4} />
  </g>
);
