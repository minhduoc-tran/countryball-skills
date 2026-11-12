import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { breathe, mixMotion, shake, talk } from '../../countryball/ball-motion';
import { DocumentProp, PenProp } from '../../countryball/ball-speech-and-props';
import { CITIES, City } from '../../countryball/map-labels';
import { GeoMap } from '../../countryball/map-geo-map';
import { LowerThird } from '../../countryball/hud-chips';
import { cameraAt, CameraKey } from '../../countryball/geo-camera';
import { backOut, easeOut } from '../../countryball/fx-math';
import { Backdrop, Dim, MapHud, Pop, ramp, sec, Txt, proj } from './chb-common';
import { Silhouette, Stamp } from './chb-icons';

// Chapter B, beats "breakdown" part 1 (B1-B5): Kissinger's "peace is at hand" card cracks, Sài Gòn objects to the draft,
// the US wants changes, Việt Nam refuses, mid-December deadlock in Paris. Documentary tone: cards, documents, calm balls.

const PAPER = '#F6F2E7';

// ---------- B1: Kissinger quote card, then the red CHƯA stamp ----------
export const B1: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), slide = easeOut(ramp(s, 0, 0.25)), z = 1 + 0.05 * ramp(s, 0, 1.4);
  const slam = s < 0.62 ? 0 : 1, k = 1 + 1.4 * (1 - easeOut(ramp(s, 0.62, 0.78)));
  return (
    <g>
      <Backdrop s={s} id="b1" />
      <g transform={`translate(960,${540 + (1 - slide) * 120}) scale(${z})`} opacity={slide}>
        <rect x={-640} y={-250} width={1280} height={520} rx={26} fill="#000" opacity={0.35} transform="translate(14,20)" />
        <rect x={-640} y={-270} width={1280} height={520} rx={26} fill={PAPER} stroke="#111" strokeWidth={6} />
        <g transform="translate(-500,-130)"><Silhouette r={78} /></g>
        <text x={-380} y={-170} fontFamily={FONT.ui} fontSize={28} fill="#5A5446">HENRY KISSINGER · 26.10.1972</text>
        <text x={-380} y={-66} fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#1E1E24">“Hòa bình đã</text>
        <text x={-380} y={30} fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#1E1E24">trong tầm tay”</text>
        <text x={-380} y={110} fontFamily={FONT.title} fontWeight={600} fontSize={34} fill="#6B6454">Cố vấn An ninh Quốc gia Mỹ</text>
        {slam > 0 && <g transform={`translate(330,60) scale(${k})`} opacity={Math.min(1, (s - 0.62) * 10)}><Stamp text="CHƯA" size={96} rot={-9} /></g>}
      </g>
    </g>
  );
};

// ---------- B2: Sài Gòn objects: city marker + the draft document stamped PHẢN ĐỐI (no ball, no flag) ----------
const B2_KEYS: CameraKey[] = [{ t: 0, lon: 107.2, lat: 12.9, zoom: 36 }, { t: 2.2, lon: 107.0, lat: 12.4, zoom: 44 }];
export const B2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(B2_KEYS, s), P = proj(cam), [sx, sy] = P(106.7, 10.78);
  const pulse = (s * 1.6) % 1;
  return (
    <g>
      <GeoMap camera={cam} highlight={['VNM']} id="b2m" labels={false}>
        <City {...CITIES.saigon} size={34} />
      </GeoMap>
      <Dim o={0.45} />
      <circle cx={sx} cy={sy} r={20 + pulse * 70} fill="none" stroke="#FF8A5F" strokeWidth={5} opacity={1 - pulse} />
      <Pop s={s} at={0.15} x={sx} y={sy - 200}>
        <g transform={`translate(${sx},${sy - 200 + Math.sin(s * 3) * 4})`}><DocumentProp x={0} y={0} s={2.5} title="DỰ THẢO" /></g>
        <path d={`M${sx},${sy - 40} L${sx},${sy - 20}`} stroke="#E2B95A" strokeWidth={5} />
      </Pop>
      <Pop s={s} at={0.5} x={sx} y={sy + 90}>
        <rect x={sx - 330} y={sy + 50} width={660} height={84} rx={42} fill="#15181F" fillOpacity={0.9} stroke="#E2B95A" strokeWidth={4} />
        <Txt x={sx} y={sy + 108} text="CHÍNH QUYỀN SÀI GÒN" size={44} stroke="none" />
      </Pop>
      {s > 0.82 && (
        <g transform={`translate(${sx + 40},${sy - 190}) scale(${1 + 1.3 * (1 - easeOut(ramp(s, 0.82, 1.0)))})`} opacity={Math.min(1, (s - 0.82) * 10)}>
          <Stamp text="PHẢN ĐỐI" size={64} rot={-14} />
        </g>
      )}
      <MapHud s={s} cam={cam} />
    </g>
  );
};

// ---------- B3 / B4: US wants rewrites, VN refuses. Same table scene, two phases ----------
const NegoScene: React.FC<{ t: number; phase: 'us' | 'vn'; id: string }> = ({ t, phase, id }) => {
  const s = sec(t), us = phase === 'us';
  const red = us ? ramp(s, 0.15, 1.5) : 1;            // progress of the red pen marks across the four text lines
  const rows = [-2, 8, 18, 28];
  const penRow = Math.min(3, Math.floor(red * 4)), frac = red >= 1 ? 1 : (red * 4) % 1;
  const refuse = !us && s > 0.15;
  return (
    <g>
      <Backdrop s={s} id={id} />
      <Txt x={960} y={150} text={us ? 'PHÍA MỸ' : 'PHÍA VIỆT NAM'} size={74} color={us ? '#9DB6D6' : '#FF8A6F'} />
      <Txt x={960} y={230} text={us ? 'Đòi sửa lại nhiều điều khoản' : 'Không chấp nhận'} size={46} color="#F4F4F4" />
      <Ball id={`${id}u`} x={470} y={690} r={150} flag="USA" eyes={us ? 'determined' : 'worried'} look={0.6} motion={mixMotion(breathe(t), us ? talk(t, true) : undefined)} t={t} />
      <Ball id={`${id}v`} x={1450} y={690} r={150} flag="VNM" eyes={us ? 'normal' : 'determined'} look={-0.6}
        tilt={refuse ? Math.sin(s * 11) * 7 * (1 - ramp(s, 1.0, 1.6)) : 0} motion={mixMotion(breathe(t, 80), refuse ? shake(t, 5, 10, 14) : undefined)} t={t} />
      <g transform="translate(980,560)">
        <DocumentProp x={0} y={0} s={3.8} title="HIỆP ĐỊNH" />
        {rows.slice(0, us ? penRow + 1 : 4).map((y, i) => {
          const w = us ? (i < penRow ? 1 : frac) : 1;
          return <line key={i} x1={-114} y1={y * 3.8} x2={-114 + 228 * w} y2={y * 3.8} stroke="#D83A3A" strokeWidth={9} strokeLinecap="round" />;
        })}
        {us && <g transform={`translate(${-114 + 228 * frac + 40},${rows[penRow] * 3.8 - 24}) rotate(-35)`}><PenProp x={0} y={0} color="#C8322A" s={1.6} /></g>}
      </g>
      {refuse && (
        <g transform={`translate(980,560) scale(${backOut(ramp(s, 0.3, 0.6))})`}>
          <path d="M-110,-110 L110,110 M110,-110 L-110,110" stroke="#D83A3A" strokeWidth={26} strokeLinecap="round" opacity={0.92} />
        </g>
      )}
    </g>
  );
};
export const B3: React.FC<ShotProps> = ({ t }) => <NegoScene t={t} phase="us" id="b3" />;
export const B4: React.FC<ShotProps> = ({ t }) => <NegoScene t={t} phase="vn" id="b4" />;

// ---------- B5: Paris, mid-December: two balls face to face, a wall rises between them: BẾ TẮC ----------
export const B5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 7.4, lat: 45.9, zoom: 78 }, { t: 2.6, lon: 7.0, lat: 46.2, zoom: 86 }], s);
  const wall = easeOut(ramp(s, 1.3, 1.7)), hit = s > 1.65 && s < 2.0 ? shake(t, Math.round(1.65 * 30), 8, 10) : undefined;
  const bricks: React.ReactNode[] = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++) bricks.push(<rect key={`${r}${c}`} x={-86 + c * 58 + (r % 2 ? 29 : 0) - 29} y={-r * 50} width={56} height={46} fill={r % 2 ? '#9C5B45' : '#B26A52'} stroke="#3A2218" strokeWidth={3} />);
  return (
    <g>
      <GeoMap camera={cam} id="b5m"><City {...CITIES.paris} size={38} anchor="l" /></GeoMap>
      <Dim o={0.5} />
      <Ball id="b5u" x={520} y={650} r={140} flag="USA" eyes="determined" look={0.8} motion={mixMotion(breathe(t), hit)} t={t} />
      <Ball id="b5v" x={1400} y={650} r={140} flag="VNM" eyes="determined" look={-0.8} motion={mixMotion(breathe(t, 80), hit)} t={t} />
      <g transform={`translate(960,${820 + (1 - wall) * 460})`}>
        <clipPath id="b5-wallclip"><rect x={-100} y={-460} width={200} height={520} /></clipPath>
        <g clipPath="url(#b5-wallclip)">{bricks}</g>
      </g>
      <Pop s={s} at={1.55} x={960} y={330}><g transform="translate(960,330)"><Stamp text="BẾ TẮC" size={78} rot={-6} /></g></Pop>
      <LowerThird title="Paris, giữa tháng 12.1972" sub="Đàm phán bế tắc" t={s} from={0.3} />
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};
