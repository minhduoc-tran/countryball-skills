import React from 'react';
import { ShotProps } from '../../engine';
import { project } from '../../countryball/geo-camera';
import { SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { RadioMicrophone, TransistorRadio } from '../../countryball/radio-props';
import { Glow } from '../../countryball/fx-glow';
import { Cap, GPhoto, MapScene, NameCard, Stage, Tag, drift, easeOut, prog } from './chg-common';
import { Person, Note } from './chd-icons';
import { Veh } from './chb-icons';

// Chapter G, part 2 (8:09-8:23, beat "10b radio"): early afternoon (no exact clock is narrated: "đầu giờ chiều"), Dương Văn Minh is taken to Đài phát thanh Sài Gòn,
// reads the unconditional surrender on air; then Chính ủy Lữ đoàn 203 Bùi Văn Tùng (name card). Sound: radio static, nothing loud.

const DINH: [number, number] = [106.6953, 10.7769], DAI: [number, number] = [106.7012, 10.7897];

/** G5 "Đầu giờ chiều, ông Minh được đưa đến Đài phát thanh Sài Gòn." route Dinh -> Đài on the city map, the jeep print (2013 replica) beside it. */
export const G5: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="g5" keys={drift({ lon: 106.69, lat: 10.783, zoom: 36000 }, { lon: 106.69, lat: 10.7835, zoom: 41000 }, 3.4)} date="30.04.1975"
    map={<><SaigonLabels /><SaigonSites only={['dinhDocLap', 'daiPhatThanh']} size={30} /></>}
    over={(cam) => {
      const [x0, y0] = project(cam, DINH[0], DINH[1]), [x1, y1] = project(cam, DAI[0], DAI[1]), k = easeOut(prog(t, 14, 74));
      const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k, hd = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
      return (
        <g>
          <line x1={x0} y1={y0} x2={x} y2={y} stroke="#FFE08A" strokeWidth={9} strokeLinecap="round" strokeDasharray="4 18" />
          <Veh x={x} y={y} heading={hd} s={26} kind="jeep" />
          <Tag t={t} at={6} x={1480} y={150} text="ĐẦU GIỜ CHIỀU" fill="#B5573B" size={50} />
          <GPhoto k="jeep" t={t} x={400} y={610} w={500} rot={-3} from={1.0} fromSide="left" kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0, px1: -0.01, py1: 0 }} />
        </g>
      );
    }} />
);

/** Studio: desk with the ON AIR lamp, a faceless silhouette behind the desk, sound arcs from the microphone. */
const Studio: React.FC<{ t: number; id: string; s?: number; x?: number; y?: number; person?: boolean }> = ({ t, id, s = 1.35, x = 1100, y = 830, person = true }) => {
  const mx = x + 150 * s, my = y - 165 * s;
  return (
    <g>
      <RadioMicrophone x={x} y={y} s={s} t={t} onAir />
      {person && <Person x={x - 400 * s} y={y} s={3.2 * s} color="#10151E" lean={Math.sin(t / 36) * 1.2} />}
      {[0, 1, 2].map((i) => {
        const u = ((t + i * 20) % 60) / 60;
        return <circle key={`${id}${i}`} cx={mx} cy={my} r={60 + 280 * u * s / 1.35} fill="none" stroke="#FFE9B0" strokeWidth={5} opacity={0.6 * (1 - u)} />;
      })}
    </g>
  );
};

/** G6 "Tại đây, ông đọc lời tuyên bố đầu hàng vô điều kiện." */
export const G6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g6" tone="navy" dim={0.15} />
    <Studio t={t} id="g6s" />
    <Cap t={t} at={4} x={960} y={150} text="TUYÊN BỐ ĐẦU HÀNG" size={78} />
    <Cap t={t} at={16} x={960} y={240} text="VÔ ĐIỀU KIỆN" size={78} color="#FFE08A" />
    <Tag t={t} at={30} x={380} y={960} text="Đài phát thanh Sài Gòn" fill="#2F3E58" size={40} sub="Dương Văn Minh" />
  </g>
);

/** G7 "Tiếp theo là lời của Chính ủy Lữ đoàn hai trăm linh ba," a portable radio, music-free sound arcs, notes of speech. */
export const G7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g7" tone="dusk" dim={0.3} />
    <Glow x={960} y={600} r={460} color="#FFD27A" o={0.28 + 0.06 * Math.sin(t / 9)} />
    <TransistorRadio x={960} y={830} s={2.5} t={t} waves={0.5 + 0.5 * Math.sin(t / 8)} />
    {[0, 1, 2].map((i) => <Note key={i} x={1280 + i * 90} y={420 - ((t * 2 + i * 40) % 160)} s={36} rot={10 * (i - 1)} o={0.7 - ((t * 2 + i * 40) % 160) / 260} />)}
    <Cap t={t} at={4} x={960} y={170} text="TIẾP THEO LÀ LỜI CỦA" size={64} />
    <Cap t={t} at={20} x={960} y={270} text="CHÍNH ỦY LỮ ĐOÀN 203" size={76} color="#FFE08A" />
  </g>
);

/** G8 "Bùi Văn Tùng, tuyên bố thành phố Sài Gòn đã hoàn toàn giải phóng." name card + the studio mic. */
export const G8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g8" tone="navy" dim={0.1} />
    <Studio t={t} id="g8s" s={0.8} x={1440} y={700} person={false} />
    <NameCard t={t} at={0} x={700} y={330} name="BÙI VĂN TÙNG" sub="Chính ủy Lữ đoàn 203" w={900} accent="#C9343A" />
    <Cap t={t} at={26} x={960} y={880} text="SÀI GÒN ĐÃ HOÀN TOÀN" size={84} />
    <Cap t={t} at={36} x={960} y={985} text="GIẢI PHÓNG" size={84} color="#FFE08A" />
  </g>
);
