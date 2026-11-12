import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { breathe, mixMotion } from '../../countryball/ball-motion';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { CITIES, City } from '../../countryball/map-labels';
import { GeoMap } from '../../countryball/map-geo-map';
import { PhotoCard } from '../../countryball/photo-card';
import { cameraAt } from '../../countryball/geo-camera';
import { clamp, easeOut } from '../../countryball/fx-math';
import { Backdrop, Dim, MapHud, PHOTO_CREDIT, Pop, ramp, sec, Txt } from './chb-common';
import { CalendarPage, CapitolIcon } from './chb-icons';

// Chapter B, beats "breakdown" part 2 (B6-B8): Nixon decides (real portrait + the "strongest card" flipping to a B-52),
// pressing Hà Nội back to the table on US terms, and the calendar running to Congress reconvening in January.

// ---------- B6: Nixon portrait over a dimmed Washington map; the playing card flips to show a B-52 ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: -78, lat: 38.5, zoom: 34 }, { t: 4.2, lon: -77.2, lat: 38.9, zoom: 44 }], s);
  const flip = ramp(s, 2.05, 2.55), face = flip > 0.5, sx = Math.abs(Math.cos(flip * Math.PI));
  return (
    <g>
      <GeoMap camera={cam} id="b6m" labels={false}><City {...CITIES.washington} size={32} /></GeoMap>
      <Dim o={0.62} />
      <PhotoCard t={s} src="dien-bien-phu-tren-khong/img/nixon-portrait.jpg" caption="Tổng thống Richard Nixon, 1972" credit={PHOTO_CREDIT.dod}
        x={560} y={520} w={480} h={640} rot={-2.5} from={0} to={len / 30 + 0.6} id="b6p" kb={{ z0: 1.02, z1: 1.12, py0: 0.03, py1: 0 }} />
      <Pop s={s} at={1.0} x={1360} y={190}><Txt x={1360} y={200} text="NIXON QUYẾT ĐỊNH" size={64} /></Pop>
      <g transform={`translate(1360,510) scale(${sx},1)`}>
        <rect x={-170} y={-235} width={340} height={470} rx={22} fill="#000" opacity={0.35} transform="translate(12,16)" />
        {face ? (
          <g>
            <rect x={-170} y={-235} width={340} height={470} rx={22} fill="#F6F2E7" stroke="#111" strokeWidth={6} />
            <AircraftTop id="b6c" kind="b52" x={0} y={-45} size={270} heading={-90} shadow={false} />
            <Txt x={0} y={190} text="B-52" size={72} color="#1E1E24" stroke="none" />
            <text x={-142} y={-186} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#C9343A">A</text>
          </g>
        ) : (
          <g>
            <rect x={-170} y={-235} width={340} height={470} rx={22} fill="#27408B" stroke="#111" strokeWidth={6} />
            <rect x={-142} y={-207} width={284} height={414} rx={12} fill="none" stroke="#E8EEF8" strokeWidth={4} />
            {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M-142,${-150 + i * 70} L142,${-150 + i * 70 + 60} M-142,${-90 + i * 70} L142,${-90 + i * 70 - 60}`} stroke="#E8EEF8" strokeWidth={2} opacity={0.35} />)}
          </g>
        )}
      </g>
      <Pop s={s} at={2.5} x={1360} y={820}><Txt x={1360} y={826} text="CON BÀI MẠNH NHẤT" size={44} color="#E2B95A" /></Pop>
      <MapHud s={s} cam={cam} />
    </g>
  );
};

// ---------- B7: the US table with its paper; Việt Nam is pulled in from the far side ----------
export const B7: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), pull = easeOut(ramp(s, 0.7, 2.6)), bx = 1760 - pull * 230;
  return (
    <g>
      <Backdrop s={s} id="b7" />
      <Txt x={960} y={160} text="ÉP HÀ NỘI QUAY LẠI BÀN ĐÀM PHÁN" size={62} o={ramp(s, 0, 0.4)} />
      <Pop s={s} at={1.7} x={960} y={250}><Txt x={960} y={252} text="THEO ĐIỀU KIỆN CỦA MỸ" size={50} color="#9DB6D6" /></Pop>
      <rect x={480} y={760} width={960} height={34} rx={8} fill="#8A5A3A" stroke="#111" strokeWidth={6} />
      <rect x={540} y={794} width={26} height={120} fill="#6E4529" stroke="#111" strokeWidth={5} /><rect x={1354} y={794} width={26} height={120} fill="#6E4529" stroke="#111" strokeWidth={5} />
      <g transform="translate(720,650)"><DocumentProp x={0} y={0} s={1.7} title="ĐIỀU KIỆN" /></g>
      <Ball id="b7u" x={430} y={650} r={140} flag="USA" eyes="determined" look={0.5} motion={breathe(t)} t={t} />
      <Ball id="b7v" x={bx} y={650} r={140} flag="VNM" eyes="determined" look={-0.7} motion={mixMotion(breathe(t, 80))} t={t} />
      {pull < 0.98 && s > 0.6 && (
        <g opacity={0.85}>
          {[0, 1, 2].map((i) => <path key={i} d={`M${bx - 190 - i * 40},${650} l-34,-22 l0,44 z`} fill="#E2B95A" opacity={0.9 - i * 0.25} />)}
        </g>
      )}
    </g>
  );
};

// ---------- B8: calendar pages run to January; Congress (domed building) reconvenes 3.1.1973 ----------
const PAGES: [number, string, string][] = [[0, '15', 'THÁNG 12'], [0.85, '20', 'THÁNG 12'], [1.15, '25', 'THÁNG 12'], [1.45, '30', 'THÁNG 12'], [1.75, '3', 'THÁNG 1']];
export const B8: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  let i = 0;
  while (i + 1 < PAGES.length && PAGES[i + 1][0] <= s) i++;
  const u = clamp((s - PAGES[i][0]) / 0.14), sx = i === 0 ? 1 : 0.15 + 0.85 * u, last = i === PAGES.length - 1;
  return (
    <g>
      <Backdrop s={s} id="b8" />
      <g transform="translate(620,520)"><CalendarPage day={PAGES[i][1]} month={PAGES[i][2]} sx={sx} w={520} />
        
      </g>
      <Pop s={s} at={0.4} x={1360} y={520}><g transform="translate(1360,560) scale(1.7)"><CapitolIcon /></g></Pop>
      <Pop s={s} at={0.45} x={1360} y={170}><Txt x={1360} y={180} text="QUỐC HỘI MỸ HỌP LẠI" size={54} /></Pop>
      <Pop s={s} at={1.9} x={1360} y={890}><Txt x={1360} y={900} text="3.1.1973" size={84} color="#E2B95A" /></Pop>
    </g>
  );
};
