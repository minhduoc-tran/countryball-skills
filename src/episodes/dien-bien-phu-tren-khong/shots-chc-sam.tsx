import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { PhotoCard } from '../../countryball/photo-card';
import { SamMissile, SamSite } from '../../countryball/fx-sam-and-flak';
import { Glow } from '../../countryball/fx-glow';
import { Cap, Dark, GOLD, INK, RED, Tag, clamp, easeOut, ramp } from './chc-helpers';

// Chapter C, part 3 (3:55-4:12): the SAM-2. C15 photo + Soviet aid crate, C16 length, C17 speed (race with sound), C18 ceiling
// (ruler), C19-C20 the seconds between detection and launch, C21 one beat late = a miss.

/** C15 "Vũ khí chính của họ là tên lửa phòng không SAM-2, do Liên Xô viện trợ." Museum photo, then the aid crate drops in. */
export const C15: React.FC<ShotProps> = ({ t }) => {
  const drop = clamp((t - 94) / 10), y = 560 - (1 - drop * drop) * 520 + (drop >= 1 ? -Math.abs(Math.sin((t - 104) / 4)) * 16 * Math.max(0, 1 - (t - 104) / 14) : 0);
  return (
    <g>
      <Dark id="c15" tone="green" />
      <PhotoCard id="c15p" src="dien-bien-phu-tren-khong/img/dvina-sa2-missile-hanoi.jpg" caption="Tên lửa SA-2 tại bảo tàng ở Hà Nội" credit="Ảnh: kitmasterbloke / CC BY 2.0"
        x={600} y={540} w={720} h={576} rot={-2.5} from={0.05} t={t / 30} kb={{ z0: 1.0, z1: 1.12 }} />
      <Tag t={t} at={22} x={600} y={90} text="TÊN LỬA PHÒNG KHÔNG SAM-2" fill="#14532D" size={46} />
      {drop > 0 && (
        <g transform={`translate(1440,${y}) rotate(${(1 - drop) * 8})`}>
          <rect x={-190} y={-130} width={380} height={260} rx={8} fill="#B88A4E" stroke={INK} strokeWidth={7} />
          {[-65, 65].map((v) => <rect key={v} x={-190} y={v - 14} width={380} height={28} fill="#8F6735" stroke={INK} strokeWidth={4} />)}
          {[-150, 150].map((v) => <rect key={v} x={v - 14} y={-130} width={28} height={260} fill="#8F6735" stroke={INK} strokeWidth={4} />)}
          <rect x={-150} y={-52} width={300} height={104} fill="#F1E7CB" stroke={INK} strokeWidth={5} />
          <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={INK}>LIÊN XÔ</text>
          <text y={38} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={RED}>VIỆN TRỢ</text>
        </g>
      )}
    </g>
  );
};

/** C16 "Một quả tên lửa dài hơn mười mét," Missile drawn big with a dimension line. */
export const C16: React.FC<ShotProps> = ({ t }) => {
  const dim = easeOut((t - 12) / 14);
  return (
    <g>
      <Dark id="c16" tone="green" />
      <g transform={`translate(${-60 + (1 - easeOut(t / 14)) * -300},0)`}><SamMissile x={1000} y={470} heading={0} size={1000} flame={false} /></g>
      <g opacity={dim}>
        <line x1={420} y1={700} x2={420 + 1120 * dim} y2={700} stroke={GOLD} strokeWidth={8} />
        {[420, 1540].map((x) => <line key={x} x1={x} y1={670} x2={x} y2={730} stroke={GOLD} strokeWidth={8} opacity={dim > 0.95 ? 1 : 0} />)}
      </g>
      <Tag t={t} at={24} x={980} y={800} text="DÀI HƠN 10 MÉT" fill="#7A5B00" color="#FFE08A" size={72} />
    </g>
  );
};

/** C17 "bay nhanh hơn ba lần tốc độ âm thanh," Two lanes: the sound ring crawls, the missile is three times quicker. */
export const C17: React.FC<ShotProps> = ({ t }) => {
  const sx = 240 + t * 6, mx = 240 + t * 18;
  return (
    <g>
      <Dark id="c17" tone="night" />
      {[360, 650].map((y) => <line key={y} x1={160} y1={y} x2={1800} y2={y} stroke="#FFFFFF" strokeOpacity={0.18} strokeWidth={4} strokeDasharray="24 18" />)}
      <g transform={`translate(${sx},360)`}>
        {[1, 2, 3].map((i) => <path key={i} d={`M${i * 26},-${i * 22} A${i * 34},${i * 34} 0 0 1 ${i * 26},${i * 22}`} fill="none" stroke="#9FD3FF" strokeWidth={9} strokeLinecap="round" opacity={1 - i * 0.2} />)}
        <circle r={14} fill="#9FD3FF" />
      </g>
      <text x={200} y={300} fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#9FD3FF">ÂM THANH</text>
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={mx - 150 - i * 60} y1={610 + i * 20 - 40} x2={mx - 260 - i * 60} y2={610 + i * 20 - 40} stroke="#FFFFFF" strokeOpacity={0.5 - i * 0.08} strokeWidth={6} strokeLinecap="round" />)}
      <SamMissile x={mx} y={650} heading={0} size={330} t={Math.floor(t)} />
      <text x={200} y={600} fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#FFD166">SAM-2</text>
      <Tag t={t} at={20} x={960} y={900} text="NHANH HƠN 3 LẦN ÂM THANH" fill={RED} size={58} />
    </g>
  );
};

/** C18 "và với tới độ cao hơn hai mươi cây số." Ruler to 20 km with the missile climbing. */
export const C18: React.FC<ShotProps> = ({ t }) => {
  const u = easeOut(clamp(t / 62)) , yy = 940 - u * 760;
  return (
    <g>
      <defs><linearGradient id="c18-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#030712" /><stop offset="1" stopColor="#2D5A86" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#c18-sky)" />
      <path d="M0,960 Q500,930 960,962 T1920,950 L1920,1080 L0,1080 Z" fill="#3E4A2C" stroke={INK} strokeWidth={6} />
      <SamSite x={560} y={985} r={44} />
      <line x1={1100} y1={940} x2={1100} y2={180} stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={6} />
      {[0, 5, 10, 15, 20].map((k) => (
        <g key={k}><line x1={1080} y1={940 - k * 38} x2={1130} y2={940 - k * 38} stroke="#FFF" strokeWidth={6} />
          <text x={1150} y={952 - k * 38} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#FFF">{k} km</text></g>
      ))}
      <path d={`M560,950 Q640,${yy + 260} 760,${yy}`} fill="none" stroke="#F2E8D8" strokeWidth={14} strokeLinecap="round" opacity={0.45} />
      <g><Glow x={760} y={yy} r={70} color="#FFA62B" o={0.4} /><SamMissile x={760} y={yy} heading={-80} size={150} t={Math.floor(t)} /></g>
      <Tag t={t} at={40} x={1600} y={200} text="HƠN 20 KM" fill="#7A5B00" color="#FFE08A" size={78} />
    </g>
  );
};

/** C19 "Nhưng từ lúc phát hiện mục tiêu đến lúc phóng," Timeline detection -> launch. */
export const C19: React.FC<ShotProps> = ({ t }) => {
  const run = ramp(t, 14, 74);
  return (
    <g>
      <Dark id="c19" tone="green" />
      <g transform="translate(360,470)">
        <circle r={150} fill="#04120A" stroke="#2E9E56" strokeWidth={8} />
        <circle r={100} fill="none" stroke="#145A2C" strokeWidth={4} /><circle r={50} fill="none" stroke="#145A2C" strokeWidth={4} />
        <rect x={50 - 14} y={-70 - 9} width={28} height={18} rx={4} fill="#46FF7A" opacity={0.5 + 0.5 * Math.sin(t / 3)} />
        <circle cx={64} cy={-70} r={34} fill="none" stroke={GOLD} strokeWidth={5} />
      </g>
      <text x={360} y={720} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#46FF7A">PHÁT HIỆN</text>
      <SamSite x={1560} y={470} r={150} />
      <text x={1560} y={720} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#FFD166">PHÓNG</text>
      <line x1={560} y1={470} x2={1360} y2={470} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={8} strokeDasharray="20 14" />
      <circle cx={560 + 800 * run} cy={470} r={22} fill={GOLD} stroke={INK} strokeWidth={5} />
      <Cap t={t} x={960} y={930} text="TỪ LÚC PHÁT HIỆN ĐẾN LÚC PHÓNG" size={58} at={4} />
    </g>
  );
};

/** C20 "kíp chiến đấu chỉ có vài chục giây." A stopwatch sweeps. */
export const C20: React.FC<ShotProps> = ({ t }) => {
  const a = ramp(t, 0, 60) * 200;
  return (
    <g>
      <Dark id="c20" tone="green" />
      <g transform="translate(640,500)">
        <rect x={-20} y={-300} width={40} height={50} rx={8} fill="#B8BCC0" stroke={INK} strokeWidth={6} />
        <circle r={240} fill="#F4F1E6" stroke={INK} strokeWidth={10} />
        {Array.from({ length: 60 }, (_, i) => <line key={i} x1={0} y1={-206} x2={0} y2={i % 5 ? -222 : -190} stroke={INK} strokeWidth={i % 5 ? 3 : 6} transform={`rotate(${i * 6})`} />)}
        <path d={`M0,0 L0,-210 A210,210 0 ${a > 180 ? 1 : 0} 1 ${210 * Math.sin((a * Math.PI) / 180)},${-210 * Math.cos((a * Math.PI) / 180)} Z`} fill={RED} opacity={0.35} />
        <line x1={0} y1={0} x2={0} y2={-200} stroke={RED} strokeWidth={10} strokeLinecap="round" transform={`rotate(${a})`} />
        <circle r={14} fill={INK} />
      </g>
      <Ball id="c20-v" x={1420} y={640} r={120} flag="VNM" eyes="worried" sweat hat={<MuCoi />} motion={breathe(t, 30, 0.05)} />
      <Tag t={t} at={10} x={1420} y={330} text="VÀI CHỤC GIÂY" fill="#B3281F" size={68} />
    </g>
  );
};

/** C21 "Sai một nhịp là bỏ lỡ." The missile arrives where the B-52 was. */
export const C21: React.FC<ShotProps> = ({ t }) => {
  const bx = 360 + t * 24, my = 960 - clamp(t / 40) * 560, mx = 760 + clamp(t / 40) * 140;
  const arrived = t >= 40;
  return (
    <g>
      <Dark id="c21" tone="night" />
      <line x1={300} y1={400} x2={1700} y2={400} stroke="#FFFFFF" strokeOpacity={0.2} strokeWidth={4} strokeDasharray="20 16" />
      <AircraftTop id="c21" kind="b52" x={bx} y={400} size={240} heading={0} />
      <SamMissile x={mx} y={my} heading={-80} size={190} t={Math.floor(t)} flame={!arrived} />
      {arrived && <g opacity={clamp(1 - (t - 40) / 14)}><Glow x={900} y={400} r={80} color="#FFA62B" o={0.5} /></g>}
      {arrived && <text x={900} y={470} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={RED} stroke="#0A121C" strokeWidth={10} paintOrder="stroke">X</text>}
      <Ball id="c21-v" x={260} y={850} r={100} flag="VNM" eyes={arrived ? 'sad' : 'worried'} hat={<MuCoi />} motion={breathe(t, 40, 0.04)} />
      <Tag t={t} at={40} x={1400} y={800} text="BỎ LỠ" fill="#B3281F" size={92} />
    </g>
  );
};
