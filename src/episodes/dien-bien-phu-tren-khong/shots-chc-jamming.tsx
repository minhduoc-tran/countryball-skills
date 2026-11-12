import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Headset, MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { SpeechBubble } from '../../countryball/ball-speech-and-props';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { RadarScope } from '../../countryball/radar-scope';
import { AScope, ManualNotebook } from '../../countryball/radar-ascope-and-notebook';
import { SamSite } from '../../countryball/fx-sam-and-flak';
import { Cap, Dark, GOLD, INK, Tag, clamp, easeOut, ramp } from './chc-helpers';

// Chapter C, part 2 (3:30-3:55): why B-52 is hard to shoot (high, jamming), the radar full of noise, years of self-teaching
// (study the jam types, write the "cẩm nang", drill) and finding the real aircraft inside the jam.

/** C7 "Vấn đề là, B-52 rất khó bắn. Nó bay rất cao." Ball on the ground looks up at a B-52; altitude arrow. */
export const C7: React.FC<ShotProps> = ({ t }) => {
  const arrow = easeOut((t - 58) / 16);
  return (
    <g>
      <defs><linearGradient id="c7-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B1830" /><stop offset="1" stopColor="#3F6A94" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#c7-sky)" />
      {[[300, 380, 1], [1500, 560, 1.3], [820, 640, 0.8]].map(([x, y, s], i) => (
        <g key={i} opacity={0.35} transform={`translate(${x + ((t * 0.4 * s) % 60)},${y})`}><ellipse rx={130 * s} ry={30 * s} fill="#DCE6F2" /><ellipse cx={50 * s} cy={-18 * s} rx={80 * s} ry={26 * s} fill="#DCE6F2" /></g>
      ))}
      <AircraftSide kind="b52" x={1250 + t * 1.6} y={330} size={560} />
      <path d="M0,900 Q400,860 800,905 T1920,890 L1920,1080 L0,1080 Z" fill="#4C5A33" stroke={INK} strokeWidth={6} />
      <Ball id="c7-v" x={420} y={800} r={96} flag="VNM" eyes={t < 58 ? 'worried' : 'determined'} look={0.5} hat={<MuCoi />} motion={breathe(t, 55, 0.035)} />
      <line x1={900} y1={880} x2={900} y2={400 + (1 - arrow) * 480} stroke={GOLD} strokeWidth={8} strokeDasharray="22 14" opacity={arrow} />
      <polygon points={`880,${420 + (1 - arrow) * 480} 920,${420 + (1 - arrow) * 480} 900,${370 + (1 - arrow) * 480}`} fill={GOLD} opacity={arrow} />
      <Cap t={t} x={960} y={110} text="B-52 RẤT KHÓ BẮN" size={78} at={2} />
      <Cap t={t} x={1180} y={640} text="BAY RẤT CAO" size={64} color={GOLD} at={60} />
    </g>
  );
};

/** C8 "Và mỗi chiếc đều phát ra sóng gây nhiễu cực mạnh." Rings of noise radiate from a B-52. */
export const C8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Dark id="c8" tone="night" />
    {Array.from({ length: 6 }, (_, i) => {
      const r = ((t * 4.2 + i * 100) % 600) + 20, o = 1 - r / 640;
      return (
        <g key={i}>
          <circle cx={960} cy={470} r={r} fill="none" stroke="#FF6A55" strokeWidth={9} opacity={o * 0.55} strokeDasharray="30 18" />
          <circle cx={960} cy={470} r={r * 0.97} fill="none" stroke="#FFD0C8" strokeWidth={3} opacity={o * 0.5} strokeDasharray="6 40" />
        </g>
      );
    })}
    <AircraftTop id="c8" kind="b52" x={960} y={470} size={400} heading={-90 + Math.sin(t / 20) * 3} />
    <Tag t={t} at={14} x={960} y={150} text="SÓNG GÂY NHIỄU" fill="#B3281F" size={54} />
    <Cap t={t} x={960} y={960} text="MỖI CHIẾC ĐỀU PHÁT SÓNG GÂY NHIỄU" size={58} at={4} />
  </g>
);

/** C9 "Trên màn hình radar, cả một vùng trời biến thành một dải nhiễu trắng xóa." The jam wedge fills the scope. */
export const C9: React.FC<ShotProps> = ({ t }) => {
  const k = ramp(t, 8, 80);
  return (
    <g>
      <Dark id="c9" tone="green" />
      <RadarScope id="c9" t={t} cx={700} cy={520} r={410} period={70}
        jam={{ center: 58, width: 40 + 110 * k, strength: Math.min(1, 0.2 + k) }} noiseDots={1400}
        blips={[{ bearing: 215, range: 0.5 }, { bearing: 300, range: 0.8 }, { bearing: 160, range: 0.35 }]} />
      <AScope id="c9a" t={t} x={1250} y={300} w={560} h={280} noise={0.15 + 0.85 * k} label="TÍN HIỆU" />
      <Tag t={t} at={6} x={1530} y={190} text="MÀN HÌNH RADAR" fill="#14532D" size={42} />
      <Tag t={t} at={70} x={1530} y={720} text="DẢI NHIỄU TRẮNG XÓA" fill="#B3281F" size={42} />
    </g>
  );
};

/** C10 "Vì vậy, trong nhiều năm," Years tick over on a timeline. */
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const u = ramp(t, 2, len - 4), year = 1965 + Math.floor(u * 7.99);
  return (
    <g>
      <Dark id="c10" tone="green" />
      <text x={960} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill="#F2F2F2" stroke={INK} strokeWidth={14} paintOrder="stroke">{year}</text>
      <rect x={360} y={680} width={1200} height={20} rx={10} fill="#0A1A12" stroke="#2E9E56" strokeWidth={4} />
      <rect x={360} y={680} width={1200 * u} height={20} rx={10} fill="#46FF7A" />
      <Ball id="c10-v" x={360 + 1200 * u} y={620} r={52} flag="VNM" eyes="determined" hat={<MuCoi />} motion={hop(t, 14, 12)} />
      <Cap t={t} x={960} y={900} text="TRONG NHIỀU NĂM" size={72} at={3} />
    </g>
  );
};

/** C11 "bộ đội tên lửa phải tự học cách đánh B-52." A missile-unit ball wonders how, B-52 on the other side. */
export const C11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Dark id="c11" tone="green" />
    <SamSite x={330} y={860} r={96} />
    <Ball id="c11-v" x={560} y={660} r={150} flag="VNM" eyes={t < 50 ? 'worried' : 'determined'} look={0.7} hat={<MuCoi />} motion={breathe(t, 50, 0.04)} />
    <AircraftTop id="c11" kind="b52" x={1380} y={420 + Math.sin(t / 25) * 14} size={460} heading={0} />
    <SpeechBubble x={760} y={230} text={'Làm sao\nđánh B-52?'} tipX={600} tipY={520} size={46} t={t} at={4} />
    <Cap t={t} x={960} y={990} text="BỘ ĐỘI TÊN LỬA TỰ HỌC" size={64} at={52} />
  </g>
);

/** C12 "Họ nghiên cứu từng dạng nhiễu, ghi chép lại thành cẩm nang" Three jam patterns, then the notebook. */
export const C12: React.FC<ShotProps> = ({ t }) => {
  const nb = easeOut((t - 46) / 12);
  return (
    <g>
      <Dark id="c12" tone="green" />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={easeOut((t - i * 6) / 8)}>
          <text x={150} y={128 + i * 270} fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#9CF0B5">{`DẠNG NHIỄU ${i + 1}`}</text>
          <AScope id={`c12-${i}`} t={t + i * 23} x={150} y={150 + i * 270} w={640} h={190} noise={[0.55, 0.95, 0.75][i]} label="" />
          <path d={`M810,${240 + i * 270} Q980,${240 + i * 270} 1130,${470 + (i - 1) * 60}`} fill="none" stroke={GOLD} strokeWidth={6} strokeDasharray="14 12" opacity={nb} />
        </g>
      ))}
      <g opacity={nb} transform={`translate(0,${(1 - nb) * 40})`}><ManualNotebook x={1370} y={500} s={2.4} rot={-4} /></g>
      <Cap t={t} x={1370} y={880} text="CẨM NANG" size={64} color={GOLD} at={52} />
      <Cap t={t} x={960} y={1030} text="NGHIÊN CỨU TỪNG DẠNG NHIỄU" size={46} at={2} />
    </g>
  );
};

/** C13 "và tập đi tập lại một việc." Drill: the radar-crew ball repeats, tally marks pile up. */
export const C13: React.FC<ShotProps> = ({ t }) => {
  const n = Math.min(5, Math.floor(t / 8) + 1);
  return (
    <g>
      <Dark id="c13" tone="green" />
      <Ball id="c13-v" x={640} y={640} r={170} flag="VNM" eyes="determined" hat={<Headset />} motion={hop(t, 16, 26)} />
      <g transform="translate(1150,360)">
        {Array.from({ length: n }, (_, i) => (
          <line key={i} x1={i * 66} y1={0} x2={i * 66} y2={260} stroke="#F4ECD3" strokeWidth={14} strokeLinecap="round" opacity={easeOut((t - i * 8) / 5)} />
        ))}
        {n >= 5 && <line x1={-30} y1={230} x2={5 * 66 - 30} y2={40} stroke={GOLD} strokeWidth={14} strokeLinecap="round" opacity={easeOut((t - 36) / 5)} />}
      </g>
      <Cap t={t} x={960} y={980} text="TẬP ĐI TẬP LẠI MỘT VIỆC" size={64} at={3} />
    </g>
  );
};

/** C14 "Tìm ra chiếc máy bay thật, đang ẩn mình bên trong dải nhiễu." The real B-52 echo is circled inside the jam. */
export const C14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Dark id="c14" tone="green" />
    <RadarScope id="c14" t={t} cx={700} cy={520} r={410} period={70} foundAt={78} foundLabel="B-52 THẬT" noiseDots={780}
      jam={{ center: 58, width: 120, strength: 1 }}
      blips={[{ bearing: 215, range: 0.5 }, { bearing: 300, range: 0.8 }, { bearing: 60, range: 0.68, vR: -0.0004, target: true }]} />
    <AScope id="c14a" t={t} x={1250} y={300} w={560} h={280} noise={0.9} reveal={ramp(t, 50, 100)} peakAt={0.64} label="TÍN HIỆU" />
    <Tag t={t} at={6} x={1530} y={190} text="NHIỄU MỌI HƯỚNG" fill="#B3281F" size={42} />
    <Tag t={t} at={84} x={1530} y={720} text="MÁY BAY THẬT" fill="#7A5B00" color="#FFE08A" size={46} />
  </g>
);
