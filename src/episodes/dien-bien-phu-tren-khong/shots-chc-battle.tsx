import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Headset } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { SpeechBubble } from '../../countryball/ball-speech-and-props';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { project } from '../../countryball/geo-camera';
import { RadarScope } from '../../countryball/radar-scope';
import { SamLaunch, SamSite } from '../../countryball/fx-sam-and-flak';
import { Glow } from '../../countryball/fx-glow';
import { CITIES, City } from '../../countryball/map-labels';
import { Cap, Dark, GOLD, INK, MapScene, RED, StepBadge, Tag, clamp, drift, easeOut, ramp } from './chc-helpers';

// Chapter C, part 4 (4:13-4:33): how a SAM battle works, step by step. 1 early-warning radar sees the cell, 2 the missile site
// switches on, 3 the officer reads the jam, 4 launch order, then the launch and 5 manual tracking to the last second.

const STEPS = ['Phát hiện', 'Bật máy', 'Đọc nhiễu', 'Phóng', 'Bám tay'];
const SITE: [number, number] = [105.72, 21.02];

/** C22 "Một trận đánh diễn ra như thế này." Title with the five steps appearing. */
export const C22: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Dark id="c22" tone="navy" />
    <Cap t={t} x={960} y={400} text="MỘT TRẬN ĐÁNH" size={120} at={2} />
    {STEPS.map((s, i) => {
      const k = easeOut((t - 14 - i * 6) / 8), x = 230 + i * 365;
      return (
        <g key={s} opacity={k} transform={`translate(${x},${640 + (1 - k) * 40})`}>
          <circle r={52} fill="#FFD43B" stroke={INK} strokeWidth={6} />
          <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={INK}>{i + 1}</text>
          <text y={120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFF">{s}</text>
        </g>
      );
    })}
  </g>
);

/** C23 "Radar cảnh giới phát hiện tốp máy bay từ xa." Early-warning radar on the map spots a B-52 cell far to the west. */
export const C23: React.FC<ShotProps> = ({ t }) => {
  const u = ramp(t, 0, 90), sweep = (t * 7) % 360;
  return (
    <MapScene id="c23" t={t} keys={drift([105.0, 21.1, 190], [105.15, 21.1, 215], 3)} night={0.55} date="12.1972"
      map={<City {...CITIES.hanoi} />}
      over={(cam) => {
        const [rx, ry] = project(cam, 104.9, 21.0), [bx, by] = project(cam, 103.9 + 0.5 * u, 21.5 - 0.15 * u);
        const ang = (sweep * Math.PI) / 180, seen = ramp(t, 40, 52);
        return (
          <g>
            <path d={`M${rx},${ry} L${rx + 700 * Math.cos(ang - 0.12)},${ry + 700 * Math.sin(ang - 0.12)} L${rx + 700 * Math.cos(ang + 0.12)},${ry + 700 * Math.sin(ang + 0.12)} Z`} fill="#46FF7A" opacity={0.2} />
            <circle cx={rx} cy={ry} r={40} fill="#1B2A20" stroke={INK} strokeWidth={6} /><circle cx={rx} cy={ry} r={14} fill="#46FF7A" />
            <AircraftTop id="c23a" kind="b52" x={bx} y={by} size={78} heading={15} />
            <AircraftTop id="c23b" kind="b52" x={bx - 55} y={by - 46} size={78} heading={15} />
            <AircraftTop id="c23c" kind="b52" x={bx - 55} y={by + 46} size={78} heading={15} />
            <circle cx={bx - 30} cy={by} r={110 + (1 - seen) * 80} fill="none" stroke={GOLD} strokeWidth={6} strokeDasharray="18 12" opacity={seen} />
            <Tag t={t} at={50} x={bx - 30} y={by - 170} text="TỐP MÁY BAY" fill="#7A5B00" color="#FFE08A" size={40} />
            <StepBadge t={t} n={1} text="RADAR CẢNH GIỚI PHÁT HIỆN" />
          </g>
        );
      }} />
  );
};

/** C24 "Trận địa tên lửa bật máy, và màn hình lập tức ngập trong nhiễu." Site switches on, then the scope fills with noise. */
export const C24: React.FC<ShotProps> = ({ t }) => {
  const sw = easeOut((t - 40) / 8);
  return (
    <g>
      <g opacity={1 - sw}>
        <MapScene id="c24" t={t} keys={drift([105.72, 21.02, 330], [105.72, 21.02, 380], 3)} night={0.55} date="12.1972"
          over={(cam) => {
            const [x, y] = project(cam, SITE[0], SITE[1]);
            return (
              <g>
                {[0, 1, 2].map((i) => { const r = ((t * 4 + i * 60) % 180) + 30; return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#46FF7A" strokeWidth={6} opacity={1 - r / 220} />; })}
                <SamSite x={x} y={y} r={90} />
              </g>
            );
          }} />
        <StepBadge t={t} n={2} text="TRẬN ĐỊA BẬT MÁY" />
      </g>
      {sw > 0 && (
        <g opacity={sw}>
          <Dark id="c24d" tone="green" />
          <RadarScope id="c24" t={t} cx={760} cy={520} r={420} period={70} jam={{ center: 58, width: 40 + 110 * ramp(t, 44, 70), strength: Math.min(1, ramp(t, 44, 70) + 0.15) }} noiseDots={780}
            blips={[{ bearing: 215, range: 0.5 }, { bearing: 300, range: 0.8 }]} />
          <Tag t={t} at={60} x={1480} y={520} text="NGẬP TRONG NHIỄU" fill="#B3281F" size={56} />
          <StepBadge t={t} n={2} text="TRẬN ĐỊA BẬT MÁY" />
        </g>
      )}
    </g>
  );
};

const scopePos = (cx: number, cy: number, r: number, bearing: number, range: number): [number, number] => {
  const a = ((bearing - 90) * Math.PI) / 180;
  return [cx + Math.cos(a) * range * r, cy + Math.sin(a) * range * r];
};

/** C25 "Sĩ quan điều khiển phải đọc từng vệt sáng mờ, đoán đâu là nhiễu, đâu là máy bay thật." Three candidate marks; two are noise. */
export const C25: React.FC<ShotProps> = ({ t }) => {
  const C = [640, 520, 400] as const, decoys: [number, number][] = [[18, 0.5], [80, 0.84]], judge = ramp(t, 86, 100);
  return (
    <g>
      <Dark id="c25" tone="green" />
      <RadarScope id="c25" t={t} cx={C[0]} cy={C[1]} r={C[2]} period={70} foundAt={112} foundLabel="THẬT" noiseDots={780}
        jam={{ center: 58, width: 120, strength: 1 }}
        blips={[{ bearing: 215, range: 0.5 }, { bearing: 60, range: 0.68, target: true }]} />
      {decoys.map(([b, rg], i) => {
        const [x, y] = scopePos(C[0], C[1], C[2], b, rg);
        return (
          <g key={i} opacity={ramp(t, 24 + i * 10, 34 + i * 10)}>
            <circle cx={x} cy={y} r={34} fill="none" stroke={judge > 0.5 ? RED : GOLD} strokeWidth={5} strokeDasharray="10 8" />
            {judge > 0.5 ? <text x={x} y={y + 12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={RED} stroke="#04120A" strokeWidth={6} paintOrder="stroke">X</text>
              : <text x={x} y={y + 14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={GOLD}>?</text>}
          </g>
        );
      })}
      <Ball id="c25-o" x={1450} y={700} r={125} flag="VNM" eyes={judge > 0.5 ? 'determined' : 'worried'} look={-0.7} hat={<Headset />} motion={breathe(t, 40, 0.04)} />
      <SpeechBubble x={1470} y={330} text={judge > 0.5 ? 'Đây là\nmáy bay thật' : 'Nhiễu hay\nmáy bay?'} tipX={1450} tipY={580} size={46} t={t} at={judge > 0.5 ? 100 : 6} />
      <StepBadge t={t} n={3} text="ĐỌC TỪNG VỆT SÁNG MỜ" />
    </g>
  );
};

/** C26 "Khi đã chắc chắn, lệnh phóng được đưa ra." The officer gives the order; launch lamp flashes. */
export const C26: React.FC<ShotProps> = ({ t }) => {
  const lamp = 0.5 + 0.5 * Math.sin(t / 2.5);
  return (
    <g>
      <Dark id="c26" tone="green" />
      <SamSite x={1400} y={600} r={190} />
      <Glow x={1400} y={600} r={300 * ramp(t, 30, 50)} color="#FF5A2B" o={0.35 * lamp} />
      <Ball id="c26-o" x={520} y={640} r={160} flag="VNM" eyes="determined" hat={<Headset />} motion={hop(t, 40, 18, 6)} />
      <SpeechBubble x={620} y={250} text="PHÓNG!" tipX={540} tipY={470} size={86} t={t} at={14} />
      <Tag t={t} at={30} x={1400} y={300} text="LỆNH PHÓNG" fill="#B3281F" size={64} />
      <StepBadge t={t} n={4} text="KHI ĐÃ CHẮC CHẮN" />
    </g>
  );
};

/** C27 "Quả tên lửa lao lên," The missile leaves the site towards the cell. */
export const C27: React.FC<ShotProps> = ({ t }) => (
  <MapScene id="c27" t={t} keys={drift([105.55, 21.15, 300], [105.5, 21.2, 330], 2)} night={0.6} date="12.1972"
    over={(cam) => {
      const [sx, sy] = project(cam, SITE[0], SITE[1]), [tx, ty] = project(cam, 105.0, 21.5);
      return (
        <g>
          <AircraftTop id="c27a" kind="b52" x={tx} y={ty} size={90} heading={20} />
          <SamSite x={sx} y={sy} r={46} />
          <SamLaunch id="c27" t={t} t0={2} from={[sx, sy]} to={[tx, ty]} dur={40} bend={0.12} size={90} />
        </g>
      );
    }} />
);

/** C28 "và trắc thủ phải bám mục tiêu bằng tay cho đến giây cuối cùng." Tracking circle follows the blip, hands turn the wheel. */
export const C28: React.FC<ShotProps> = ({ t }) => {
  const C = [600, 520, 400] as const, b = 52 + t * 0.2, [x, y] = scopePos(C[0], C[1], C[2], b, 0.7 - t * 0.0012), wob = Math.sin(t / 3) * 6;
  return (
    <g>
      <Dark id="c28" tone="green" />
      <RadarScope id="c28" t={t} cx={C[0]} cy={C[1]} r={C[2]} period={70} noiseDots={780} jam={{ center: 58, width: 110, strength: 0.7 }}
        blips={[{ bearing: 52, range: 0.7, vB: 0.2, vR: -0.0012, target: true }]} foundAt={0} foundLabel="B-52" />
      <circle cx={x + wob} cy={y} r={46} fill="none" stroke={GOLD} strokeWidth={5} />
      <line x1={x - 62 + wob} y1={y} x2={x + 62 + wob} y2={y} stroke={GOLD} strokeWidth={3} /><line x1={x + wob} y1={y - 62} x2={x + wob} y2={y + 62} stroke={GOLD} strokeWidth={3} />
      <g transform="translate(1450,760)">
        <g transform={`rotate(${t * 3.2})`}>
          <circle r={130} fill="none" stroke="#9AA0A3" strokeWidth={26} />
          {[0, 60, 120].map((a) => <line key={a} x1={-130} y1={0} x2={130} y2={0} stroke="#9AA0A3" strokeWidth={16} transform={`rotate(${a})`} />)}
          <circle r={26} fill="#53585C" stroke={INK} strokeWidth={5} />
        </g>
        <circle cx={-122} cy={-40} r={30} fill="#E8B77C" stroke={INK} strokeWidth={5} /><circle cx={122} cy={40} r={30} fill="#E8B77C" stroke={INK} strokeWidth={5} />
      </g>
      <Ball id="c28-o" x={1450} y={400} r={120} flag="VNM" eyes="determined" look={-0.8} hat={<Headset />} motion={breathe(t, 36, 0.03)} />
      <Cap t={t} x={1450} y={990} text="BÁM TAY ĐẾN GIÂY CUỐI" size={50} at={20} />
      <StepBadge t={t} n={5} text="TRẮC THỦ BÁM MỤC TIÊU" />
    </g>
  );
};
