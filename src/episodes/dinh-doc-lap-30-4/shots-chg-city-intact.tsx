import React from 'react';
import { ShotProps } from '../../engine';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { easeOut } from '../../countryball/fx-math';
import { Cap, INK, MapScene, Stage, Tag, drift, prog } from './chg-common';
import { Shophouse, Skyline, Tile } from './chg-icons';
import { Person } from './chd-icons';

// Chapter G, part 4 (8:35-8:48, beat "10c2 intact"): Sài Gòn survived almost untouched. G13 a calm morning skyline, G14 the city map at dusk with its lights
// ("hàng triệu dân", no number beyond the narration), G15 a quiet street (no street-by-street battles), G16 school / market / church / port still standing.
// Sound: pops for the four tiles only.

/** G13 "Điều mà nhiều người nhớ nhất về ngày hôm ấy là Sài Gòn," calm sunrise skyline with the twin-tower church. */
export const G13: React.FC<ShotProps> = ({ t }) => {
  const rise = easeOut(prog(t, 0, 100)), z = 1 + t * 0.0006;
  return (
    <g>
      <Stage id="g13" tone="dawn" />
      <circle cx={600} cy={760 - 220 * rise} r={150} fill="#FFE9B0" opacity={0.35} /><circle cx={600} cy={760 - 220 * rise} r={78} fill="#FFF3C8" />
      <g transform={`translate(960,840) scale(${z}) translate(-960,-840)`}>
        <Skyline id="g13s" y={840} lit={0.35} color="#2A3A52" />
      </g>
      <rect y={840} width={1920} height={240} fill="#2C3A4C" /><rect y={836} width={1920} height={8} fill="#1A2430" />
      <Cap t={t} at={4} x={960} y={150} text="ĐIỀU NHIỀU NGƯỜI NHỚ NHẤT" size={66} />
      <Cap t={t} at={76} x={960} y={960} text="SÀI GÒN" size={120} color="#FFE08A" />
    </g>
  );
};

/** G14 "một thành phố hàng triệu dân, gần như không bị tàn phá." the city at dusk: lights on, grid intact. */
export const G14: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="g14" keys={drift({ ...C.cityWide, zoom: 5600 }, { ...C.city, zoom: 11500 }, 3.3)} night={0.45} date="30.04.1975"
    map={<><SaigonLabels /><SaigonSites only={['dinhDocLap', 'daiPhatThanh', 'tanSonNhat', 'cauSaiGon', 'hangXanh', 'boQuocPhong']} /></>}
    over={() => <>
      <Cap t={t} at={23} x={960} y={870} text="HÀNG TRIỆU DÂN" size={80} />
      <Cap t={t} at={44} x={960} y={975} text="GẦN NHƯ KHÔNG BỊ TÀN PHÁ" size={64} color="#FFE08A" />
    </>} />
);

/** G15 "Không có những trận đánh kéo dài trên từng con phố." a quiet street, shutters half down, a few people walking, nothing burning. */
export const G15: React.FC<ShotProps> = ({ t }) => {
  const gy = 820, walkers = [0, 1, 2, 3].map((i) => ({ x: ((i * 520 + t * (3 + i)) % 2200) - 150, s: 2.6 + 0.2 * i, c: ['#1D2733', '#2B2F3C', '#26303A', '#1A2630'][i] }));
  return (
    <g>
      <Stage id="g15" tone="dawn" />
      {[0, 1, 2, 3].map((i) => <Shophouse key={i} id={`g15b${i}`} x={-40 + i * 500} y={gy} w={480} h={420 + (i % 2) * 90} color={['#D9C79A', '#C9D3B0', '#E3C6A8', '#CFC3A6'][i]} shutter={i % 2 === 0} lit={i % 2 === 1} />)}
      <rect y={gy} width={1920} height={260} fill="#4B4A4E" /><rect y={gy} width={1920} height={10} fill="#8A8A8A" stroke={INK} strokeWidth={3} />
      {walkers.map((w, i) => <Person key={i} x={w.x} y={gy + 70 + i * 30} s={w.s} color={w.c} lean={Math.sin(t / 7 + i) * 2} />)}
      <Cap t={t} at={4} x={960} y={130} text="KHÔNG CÓ TRẬN ĐÁNH KÉO DÀI" size={66} />
      <Cap t={t} at={20} x={960} y={225} text="TRÊN TỪNG CON PHỐ" size={66} color="#FFE08A" />
    </g>
  );
};

/** G16 "Trường học, chợ, nhà thờ, bến cảng vẫn còn nguyên." four tiles pop on the words (frames 0, 20, 37, 61). */
export const G16: React.FC<ShotProps> = ({ t }) => {
  const tiles = [{ k: 'school', l: 'TRƯỜNG HỌC', at: 0 }, { k: 'market', l: 'CHỢ', at: 20 }, { k: 'church', l: 'NHÀ THỜ', at: 37 }, { k: 'port', l: 'BẾN CẢNG', at: 61 }] as const;
  return (
    <g>
      <Stage id="g16" tone="noon" dim={0.05} />
      {tiles.map((q, i) => <Tile key={q.k} x={265 + i * 463} y={500} kind={q.k} label={q.l} k={easeOut(prog(t, q.at, q.at + 12))} t={t} />)}
      <Tag t={t} at={84} x={960} y={900} text="VẪN CÒN NGUYÊN" fill="#2F5E3A" size={70} />
    </g>
  );
};
