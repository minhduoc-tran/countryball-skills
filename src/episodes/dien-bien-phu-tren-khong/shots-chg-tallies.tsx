import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { cameraAt, project } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { Counter, countAt, fmtVi } from '../../countryball/hud-counter';
import { DateChip } from '../../countryball/hud-date-chip';
import { LowerThird } from '../../countryball/hud-chips';
import { BCell } from '../../countryball/fx-flight-path';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { Ball } from '../../countryball/countryball';
import { MuCoi, UsafCap } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion, talk } from '../../countryball/ball-motion';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { DimMap, Txt, Panel, drift, sec, ramp, pop, fade, GOLD, VNM_RED, USA_BLUE, INK } from './chg-common';
import { TwoColumns } from './chg-two-column-tally';
import { CivilCard } from './chg-civil-card';

// Chapter G, part 1 (G1-G15, 600.66-645.31 s): the numbers. 729 sorties, 20.000+ tons, the two sides' claims in two
// columns, "never lost so many B-52", then the quiet card with 1.624 civilians.

const NORTH = { lon: 106.1, lat: 20.7 };

export const G1: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g1" keys={drift(106, 17, 13, -3, 2, 1.25, 3)} dim={0.45} />
      <Txt x={960} y={470} size={118} o={fade(s, 0.1)} dy={(1 - fade(s, 0.1)) * 40}>NHÌN LẠI</Txt>
      <Txt x={960} y={610} size={118} fill={GOLD} o={fade(s, 0.3)} dy={(1 - fade(s, 0.3)) * 40}>NHỮNG CON SỐ</Txt>
      <rect x={560} y={660} width={800 * ramp(s, 0.4, 1.3)} height={10} rx={5} fill="#C9343A" />
    </g>
  );
};

export const G2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g2" keys={drift(105.9, 21, 140, 0.1, 0, 1.2, 4)} dim={0.6} night={0.6} />
      <Txt x={960} y={200} size={96} o={fade(s, 0.05)}>12 NGÀY ĐÊM</Txt>
      {Array.from({ length: 12 }, (_, i) => {
        const k = pop(s, 0.15 + i * 0.075), col = i % 6, row = Math.floor(i / 6);
        const x = 270 + col * 276, y = 330 + row * 170;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${Math.max(0, k)})`} opacity={Math.min(1, k * 2)}>
            <rect x={-118} y={-62} width={236} height={124} rx={22} fill="#15181F" fillOpacity={0.92} stroke="#8EA8E8" strokeWidth={4} />
            <text y={-8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#C9D6FF">ĐÊM {i + 1}</text>
            <text y={38} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F4F4F4">{18 + i}.12</text>
          </g>
        );
      })}
      <BCell id="g2c" t={t} points={[[-200, 880], [2150, 850]]} t0={34} t1={82} size={110} />
      <Txt x={960} y={1010} size={52} fill={GOLD} o={fade(s, 1.25)}>18.12 - 29.12.1972</Txt>
    </g>
  );
};

export const G3: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const n = Math.round(729 * ramp(s, 0.05, 1.0));
  return (
    <g>
      <DimMap s={s} id="g3" keys={drift(105.9, 21, 90, 0.2, 0, 1.2, 3)} dim={0.72} night={0.5} cities={false} />
      {[0, 1, 2].map((r) => (
        <React.Fragment key={r}>
          <BCell id={`g3a${r}`} t={t} points={[[-250, 130 + r * 28], [2200, 110 + r * 28]]} t0={r * 6} t1={r * 6 + 56} size={90} />
          <BCell id={`g3b${r}`} t={t} points={[[2200, 950 - r * 28], [-250, 970 - r * 28]]} t0={r * 6 + 8} t1={r * 6 + 62} size={90} />
        </React.Fragment>
      ))}
      <Txt x={960} y={400} size={70} fill={GOLD} o={fade(s, 0.1)}>B-52 ĐÃ THỰC HIỆN</Txt>
      <g transform={`translate(960,640) scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(s - 1.0) / 0.3)}) translate(-960,-640)`}>
        <Txt x={960} y={640} size={290}>{n}</Txt>
      </g>
      <Txt x={960} y={760} size={78} o={fade(s, 0.9)}>LẦN XUẤT KÍCH</Txt>
    </g>
  );
};

export const G4: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const cam = cameraAt([{ t: 0, ...NORTH, zoom: 150, ease: 'linear' }, { t: 3.3, lon: 106.0, lat: 20.85, zoom: 230, ease: 'linear' }], s);
  const hn = project(cam, 105.85, 21.03), hp = project(cam, 106.68, 20.86), yv = project(cam, 105.93, 21.1);
  const steps = [{ t: 0.5, value: 0 }, { t: 2.3, value: 20000 }];
  return (
    <g>
      <GeoMap camera={cam} night={0.75} highlight={['Hà Nội', 'Hải Phòng']} provinces id="g4">
        <City {...CITIES.hanoi} lights={0.8} /><City {...CITIES.haiphong} lights={0.8} />
      </GeoMap>
      <BombCarpet id="g4a" t={t} t0={8} from={[yv[0] - 60, yv[1] - 90]} to={[hn[0] + 40, hn[1] + 70]} dur={36} n={14} width={46} r={22} />
      <BombCarpet id="g4b" t={t} t0={34} from={[hp[0] - 110, hp[1] - 40]} to={[hp[0] + 80, hp[1] + 50]} dur={30} n={12} width={40} r={22} seed={4} />
      <rect x={0} y={760} width={1920} height={320} fill="url(#g4-fade)" />
      <defs><linearGradient id="g4-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></linearGradient></defs>
      <DateChip label="12.1972" t={s} />
      <Counter label="BOM" unit="tấn" value={s >= 2.35 ? '20.000+' : fmtVi(countAt(steps, s))} steps={s >= 2.35 ? undefined : steps} t={s} />
      <Txt x={960} y={990} size={84} o={fade(s, 1.7)} dy={(1 - fade(s, 1.7)) * 30}>HƠN 20.000 TẤN BOM</Txt>
      <LowerThird title="Miền Bắc Việt Nam" sub="Hà Nội, Hải Phòng" from={0.2} to={1.6} t={s} y={760} />
    </g>
  );
};

export const G5: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  const k = pop(s, 0.15, 0.4), k2 = pop(s, 0.3, 0.4);
  const neq = pop(s, 2.5, 0.35);
  return (
    <g>
      <DimMap s={s} id="g5" keys={drift(106, 17, 14, -2, 2, 1.1, 5)} dim={0.65} cities={false} />
      <Txt x={960} y={170} size={74} o={fade(s, 0.4)}>MÁY BAY BỊ BẮN RƠI</Txt>
      <Txt x={960} y={250} size={46} fill={GOLD} o={fade(s, 1.0)}>hai bên đưa ra hai con số khác nhau</Txt>
      {[0, 1].map((i) => {
        const vn = i === 0, x = vn ? 480 : 1440, kk = vn ? k : k2;
        return (
          <g key={i} opacity={Math.min(1, kk * 2)}>
            <Panel x={x - 290} y={330} w={580} h={470} accent={vn ? VNM_RED : USA_BLUE} />
            <Ball id={`g5b${i}`} x={x} y={500} r={110} flag={vn ? 'VNM' : 'USA'} eyes={vn ? 'determined' : 'worried'} hat={vn ? <MuCoi /> : <UsafCap />} t={f}
              motion={mixMotion(breathe(f, 70, 0.03, i * 25), hop(f, 40, 14, i * 12))} look={vn ? 1 : -1} />
            <text x={x} y={750} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={118} fill="#F4F4F4" stroke={INK} strokeWidth={10} paintOrder="stroke">
              ?
            </text>
          </g>
        );
      })}
      <g transform={`translate(960,570) scale(${Math.max(0, neq)})`}>
        <circle r={78} fill="#C9343A" stroke="#111" strokeWidth={7} />
        <Txt x={0} y={36} size={110} sw={0}>≠</Txt>
      </g>
    </g>
  );
};

const COLUMN_MAP = drift(106, 15, 12, 0, 0, 1.02, 10);

export const G6: React.FC<ShotProps> = ({ t, f }) => (
  <g>
    <DimMap s={sec(t)} id="g6" keys={COLUMN_MAP} dim={0.78} cities={false} />
    <TwoColumns f={f} vnS={sec(t)} usS={0.6} dimUs={1} />
  </g>
);

export const G7: React.FC<ShotProps> = ({ t, f }) => (
  <g>
    <DimMap s={sec(t)} id="g7" keys={COLUMN_MAP} dim={0.78} cities={false} />
    <TwoColumns f={f} vnS={sec(t) + 3.28} usS={0.6} dimUs={1} />
  </g>
);

export const G8: React.FC<ShotProps> = ({ t, f }) => (
  <g>
    <DimMap s={sec(t)} id="g8" keys={COLUMN_MAP} dim={0.78} cities={false} />
    <TwoColumns f={f} vnS={99} dimVn={1} usS={sec(t)} />
  </g>
);

export const G9: React.FC<ShotProps> = ({ t, f }) => (
  <g>
    <DimMap s={sec(t)} id="g9" keys={COLUMN_MAP} dim={0.78} cities={false} />
    <TwoColumns f={f} vnS={99} dimVn={0.7} usS={sec(t) + 3.81} />
  </g>
);

export const G10: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g10" keys={COLUMN_MAP} dim={0.78} cities={false} />
      <TwoColumns f={f} vnS={99} usS={99} />
      <rect x={430} y={955} width={1060} height={96} rx={30} fill="#15181F" stroke={GOLD} strokeWidth={5} opacity={fade(s, 0.1)} />
      <Txt x={960} y={1020} size={48} fill={GOLD} o={fade(s, 0.15)} sw={0}>MỖI BÊN ĐẾM THEO CÁCH RIÊNG</Txt>
    </g>
  );
};

export const G11: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  const line = ramp(s, 0.6, 1.6);
  return (
    <g>
      <DimMap s={s} id="g11" keys={drift(106, 17, 14, 1, -1, 1.08, 3)} dim={0.68} cities={false} />
      <Txt x={960} y={190} size={64} o={fade(s, 0.1)}>ĐIỀU CẢ HAI BÊN</Txt>
      <Txt x={960} y={270} size={74} fill={GOLD} o={fade(s, 0.4)}>ĐỀU THỪA NHẬN</Txt>
      <Ball id="g11a" x={560 + 70 * line} y={620} r={130} flag="VNM" eyes="normal" hat={<MuCoi />} t={f} motion={mixMotion(breathe(f, 70, 0.03), talk(f, s > 0.4))} look={1} />
      <Ball id="g11b" x={1360 - 70 * line} y={620} r={130} flag="USA" eyes="normal" hat={<UsafCap />} t={f} motion={mixMotion(breathe(f, 70, 0.03, 30), hop(f, 50, 16, 8))} look={-1} />
      <line x1={760} y1={640} x2={760 + 400 * line} y2={640} stroke={GOLD} strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />
      <g transform={`translate(960,520) scale(${Math.max(0, pop(s, 1.6))})`}>
        <circle r={54} fill="#3E9B5B" stroke="#111" strokeWidth={6} />
        <path d="M-24,2 L-8,20 L26,-18" fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

export const G12: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const slide = (a: number) => (1 - fade(s, a)) * 60;
  return (
    <g>
      <DimMap s={s} id="g12" keys={drift(105.9, 21, 110, 0.15, 0, 1.15, 5)} dim={0.74} night={0.5} cities={false} />
      <Panel x={260} y={210} w={1400} h={640} accent="#C9343A" />
      <Txt x={960} y={380} size={110} o={fade(s, 0.05)} dy={slide(0.05)}>CHƯA BAO GIỜ</Txt>
      <Txt x={960} y={510} size={84} fill={GOLD} o={fade(s, 1.0)} dy={slide(1.0)}>MẤT NHIỀU B-52 ĐẾN THẾ</Txt>
      <Txt x={960} y={610} size={50} fill="#C9D6FF" o={fade(s, 2.6)} dy={slide(2.6)}>trong một chiến dịch</Txt>
      {[0, 1, 2, 3, 4].map((i) => (
        <AircraftTop key={i} id={`g12p${i}`} kind="b52" x={560 + i * 200} y={740 + (i % 2) * 18} size={110} heading={-90 + (i - 2) * 6} opacity={fade(s, 1.1 + i * 0.12)} />
      ))}
      <Txt x={960} y={930} size={44} fill="#9DB4CC" o={fade(s, 0.5)} sw={0}>Cả hai phía đều thừa nhận</Txt>
    </g>
  );
};

export const G13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const cam = cameraAt([{ t: 0, lon: 105.85, lat: 21.04, zoom: 260, ease: 'linear' }, { t: 2.1, lon: 105.85, lat: 21.03, zoom: 330, ease: 'linear' }], s);
  return (
    <g>
      <GeoMap camera={cam} night={0.9} id="g13"><City {...CITIES.hanoi} lights={1 - 0.6 * ramp(s, 0, 2)} /></GeoMap>
      <rect width={1920} height={1080} fill="#02050A" opacity={0.25 + 0.4 * ramp(s, 0.2, 2.1)} />
      <Txt x={960} y={560} size={76} fill="#E4EBFF" o={fade(s, 0.3, 0.6)}>CÁI GIÁ PHẢI TRẢ</Txt>
    </g>
  );
};

export const G14: React.FC<ShotProps> = ({ t }) => <CivilCard cs={sec(t)} />;
export const G15: React.FC<ShotProps> = ({ t }) => <CivilCard cs={sec(t) + 3.62} />;
