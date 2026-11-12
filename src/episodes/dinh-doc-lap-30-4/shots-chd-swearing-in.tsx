import React from 'react';
import { ShotProps } from '../../engine';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { MapFlag } from '../../countryball/flag-cloth';
import { SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { Glow } from '../../countryball/fx-glow';
import { Cap, INK, MapScene, NameCard, Photo, Stage, Tag, drift, easeOut, prog } from './chd-common';
import { Person } from './chd-icons';

// Chapter D, part 1 (3:58-4:06, beat "6 minh"): D1 chiều 28.04 on the city map, D2 Dương Văn Minh (1964 print + name card), D3 hope of talks,
// D4 time running out. Sound: none (quiet opening of the chapter).

/** D1 "Chiều ngày hai mươi tám tháng Tư," the city, RVN flag still on the Dinh. */
export const D1: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="d1" keys={drift({ ...C.city, zoom: 9500 }, { ...C.city, zoom: 12000 }, 1.8)} night={0.12} date="28.04.1975"
    map={<><SaigonLabels /><SaigonSites only={['dinhDocLap', 'boQuocPhong', 'tanSonNhat', 'boTongThamMuu', 'bietKhuThuDo', 'tongNhaCanhSat', 'daiPhatThanh', 'cauSaiGon', 'cauRachChiec', 'hangXanh']} /><MapFlag lon={106.6953} lat={10.7769} kind="RVN" minZoom={9000} t={t} id="d1f" size={64} /></>}
    over={() => <Tag t={t} at={4} x={960} y={930} text="CHIỀU NGÀY 28 THÁNG 4" fill="#B5573B" size={46} />} />
);

/** D2 "Đại tướng Dương Văn Minh nhậm chức Tổng thống." the 1964 print (he is one of the two generals) + a plain name card. */
export const D2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d2" tone="navy" />
    <Photo k="minh" t={t} id="d2p" x={600} y={500} w={760} rot={-2.5} from={0.05} fromSide="left" kb={{ z0: 1.0, z1: 1.12, px0: 0.02, py0: 0, px1: -0.02, py1: 0 }} />
    <NameCard t={t} at={14} x={1400} y={470} name="DƯƠNG VĂN MINH" sub="nhậm chức Tổng thống, 28.04.1975" w={760} />
    <Cap t={t} at={22} x={1400} y={690} text="Đại tướng" size={52} color="#FFE08A" />
  </g>
);

/** D3 "Ông hy vọng vẫn còn có thể thương lượng." Minh (silhouette) at a table, the other side still a faint outline: a hope that is not answered yet. */
export const D3: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 6, 40)), glow = 0.25 + 0.2 * Math.sin(t / 9);
  return (
    <g>
      <Stage id="d3" tone="dusk" dim={0.25} />
      <Glow x={960} y={620} r={380} color="#FFD27A" o={0.28 + glow * 0.4} />
      <Person x={620} y={760} s={3.4} color="#141A24" lean={Math.sin(t / 30) * 0.8} />
      <g opacity={0.12 + 0.4 * k}><Person x={1300} y={760} s={3.4} color="#141A24" lean={-Math.sin(t / 34) * 0.8} /></g>
      <ellipse cx={1300} cy={520} rx={46} ry={52} fill="none" stroke="#FFE9B0" strokeWidth={4} strokeDasharray="10 9" opacity={0.7 * (1 - k)} />
      <rect x={520} y={700} width={880} height={36} rx={8} fill="#3A2A1C" stroke={INK} strokeWidth={5} />
      <rect x={560} y={736} width={800} height={150} fill="#2A1E14" stroke={INK} strokeWidth={5} />
      <g transform={`translate(960,${684 - 2 * Math.sin(t / 12)}) rotate(-3)`}>
        <rect x={-62} y={-22} width={124} height={22} rx={3} fill="#F6F0DC" stroke={INK} strokeWidth={3} />
        {[-40, -24, -8].map((x) => <line key={x} x1={x} y1={-14} x2={x + 36} y2={-14} stroke="#8A7F66" strokeWidth={2.4} />)}
      </g>
      <Cap t={t} at={4} x={960} y={190} text="VẪN HY VỌNG THƯƠNG LƯỢNG" size={74} />
      <Tag t={t} at={16} x={620} y={950} text="Dương Văn Minh" fill="#2F3E58" size={34} />
    </g>
  );
};

/** D4 "Nhưng thời gian không còn nữa." a clock that runs faster and faster while the edges of the frame turn red. */
export const D4: React.FC<ShotProps> = ({ t }) => {
  const m = t * t * 0.42 + t * 6, h = m / 12, red = prog(t, 4, 44);
  return (
    <g>
      <Stage id="d4" tone="night" />
      <defs><radialGradient id="d4-red" cx="0.5" cy="0.45" r="0.75"><stop offset="0.45" stopColor="#8A1D1D" stopOpacity={0} /><stop offset="1" stopColor="#8A1D1D" stopOpacity={0.75} /></radialGradient></defs>
      <rect width={1920} height={1080} fill="url(#d4-red)" opacity={red} />
      <g transform="translate(960,470)">
        <circle r={262} fill="#F2EBD8" stroke={INK} strokeWidth={12} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-222} x2={0} y2={i % 3 === 0 ? -178 : -198} stroke={INK} strokeWidth={i % 3 === 0 ? 10 : 6} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={30} x2={0} y2={-150} stroke={INK} strokeWidth={14} strokeLinecap="round" transform={`rotate(${h})`} />
        <line x1={0} y1={40} x2={0} y2={-212} stroke="#C9343A" strokeWidth={9} strokeLinecap="round" transform={`rotate(${m})`} />
        <circle r={16} fill={INK} />
      </g>
      <Cap t={t} at={6} x={960} y={930} text="THỜI GIAN KHÔNG CÒN NỮA" size={72} />
    </g>
  );
};
