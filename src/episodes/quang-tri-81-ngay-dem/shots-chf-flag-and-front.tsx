import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { NightChip } from '../../countryball/hud-chips';
import { Camera } from '../../countryball/geo-camera';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { backOut, easeOut } from '../../countryball/fx-math';
import { Backdrop, Chip, drift, FrontSides, MapHud, Plan, PoleFlag, Pop, proj, QtMap, ramp, RED, sec, Tag, Txt, Vignette, YELLOW } from './chf-common';

// Chapter F, beat "26 flag" (F19-F26, 504.5-524.5 s): 16.9 (ngày 81/81) the TQLC raise the VNCH flag over the west gate (tired ball, no
// triumph), "81 ngày đêm", "2 tuần -> 81 ngày", and the real result: only the south bank of the Thạch Hãn retaken, the north half of
// Quảng Trị province still held by Quân Giải phóng. Citadel damage 0.95-0.96. TQLC = green beret.

const D16 = [{ t: 0, label: '16.09.1972' }];
const Hud: React.FC<{ s: number }> = ({ s }) => (<><DateChip dates={D16} t={s} id="hud-date" /><NightChip label="NGÀY 81/81" t={s} from={0.15} /></>);
const FOG = <rect width={1920} height={1080} fill="#CDBFAE" opacity={0.22} />;

// ---------- F19: dawn of 16.9 over the ruins ----------
export const F19: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(60, 40, 0.7), cameraOnCitadel(-60, 0, 0.85), len / 30), a = citadelScreen(cam, 80, -60);
  return (
    <g>
      <Plan id="f19" cam={cam} t={t} damage={0.96} night={0.18} fires={0.12} />
      {FOG}
      <SmokeColumn t={t} x={a[0]} y={a[1]} h={300} w={90} />
      <Vignette id="f19" o={0.5} />
      <Txt x={1000} y={170} text="NGÀY 16 THÁNG 9" size={112} o={ramp(s, 0.05, 0.35)} />
      <Hud s={s} /><MiniMap camera={cam} />
    </g>
  );
};

// ---------- F20: the TQLC ball raises the flag at the west gate: tired, quiet ----------
export const F20: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-200, 10, 2.1), cameraOnCitadel(-236, 0, 2.5), len / 30), g = citadelScreen(cam, -240, 0);
  return (
    <g>
      <Plan id="f20" cam={cam} t={t} damage={0.96} night={0.1} fires={0.08} labels={['gates']} />
      {FOG}
      <PoleFlag x={g[0] + 40} y={g[1] + 150} h={330} kind="rvn" raise={easeOut(ramp(s, 0.3, 1.9))} t={t} />
      <Ball id="f20b" x={g[0] - 190} y={g[1] + 56} r={112} flag="RVN" eyes="sad" tilt={-4} hat={<Beret color="#2F6B3A" badge="anchor" />} t={t} motion={breathe(t, 90, 0.025)} />
      <Vignette id="f20" o={0.55} />
      <Txt x={1060} y={184} text="THỦY QUÂN LỤC CHIẾN" size={84} o={ramp(s, 0.05, 0.35)} />
      <Hud s={s} />
    </g>
  );
};

// ---------- F21: the flag over the west gate, seen from higher up ----------
export const F21: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-200, 0, 0.8), cameraOnCitadel(-120, 0, 0.62), len / 30), g = citadelScreen(cam, -240, 0);
  const k = backOut(ramp(s, 0.1, 0.5));
  return (
    <g>
      <Plan id="f21" cam={cam} t={t} damage={0.96} night={0.1} fires={0.1} labels={['gates']} />
      {FOG}
      <g transform={`translate(${g[0]},${g[1]}) scale(${k}) translate(${-g[0]},${-g[1]})`}><PoleFlag x={g[0]} y={g[1]} h={170} kind="rvn" t={t} /></g>
      <Vignette id="f21" o={0.5} />
      <Pop s={s} at={0.5} x={g[0] - 40} y={g[1] + 130}><Chip x={g[0] - 40} y={g[1] + 130} text="CỔNG PHÍA TÂY" size={46} stroke={YELLOW} /></Pop>
      <Txt x={1060} y={184} text="CỜ VNCH TRÊN THÀNH CỔ" size={84} o={ramp(s, 0.1, 0.4)} />
      <Hud s={s} /><MiniMap camera={cam} />
    </g>
  );
};

// ---------- F22: 81 days and nights are over ----------
export const F22: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), n = Math.max(1, Math.round(81 * easeOut(ramp(s, 0.05, 1.1))));
  return (
    <g>
      <Backdrop s={s} id="f22" />
      <Txt x={960} y={500} text={String(n)} size={420} color="#FFE9B0" />
      <Txt x={960} y={680} text="NGÀY ĐÊM" size={130} o={ramp(s, 0.2, 0.5)} />
      <Pop s={s} at={1.15} x={960} y={815}><Chip x={960} y={815} text="28.06 - 16.09.1972" size={54} /></Pop>
      <Pop s={s} at={1.45} x={960} y={985}><Txt x={960} y={985} text="ĐÃ KẾT THÚC" size={72} color="#E2B95A" /></Pop>
      <Vignette id="f22" o={0.55} />
    </g>
  );
};

// ---------- F23: "2 TUẦN" -> "81 NGÀY" ----------
export const F23: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), w1 = 280 * easeOut(ramp(s, 0.1, 0.6)), w2 = 1620 * easeOut(ramp(s, 1.0, 2.3));
  return (
    <g>
      <Backdrop s={s} id="f23" />
      <Txt x={150} y={330} text="KẾ HOẠCH" size={54} color="#B9C6D6" anchor="start" o={ramp(s, 0.05, 0.3)} />
      <rect x={150} y={360} width={w1} height={110} rx={14} fill={YELLOW} stroke="#10151D" strokeWidth={6} />
      <Txt x={150 + w1 + 40} y={440} text="≈ 2 TUẦN" size={96} color={YELLOW} anchor="start" o={ramp(s, 0.4, 0.7)} />
      <Txt x={150} y={660} text="THỰC TẾ" size={54} color="#B9C6D6" anchor="start" o={ramp(s, 0.9, 1.2)} />
      <rect x={150} y={690} width={w2} height={110} rx={14} fill={RED} stroke="#10151D" strokeWidth={6} />
      <Txt x={150 + 810} y={782} text="81 NGÀY" size={104} anchor="middle" o={ramp(s, 1.7, 2.1)} />
      <Vignette id="f23" o={0.5} />
    </g>
  );
};

// ---------- F24: after so many bombs and shells: the ruins from afar ----------
export const F24: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(0, 0, 0.9), cameraOnCitadel(0, 0, 0.2), len / 30), a = citadelScreen(cam, 60, 0);
  return (
    <g>
      <Plan id="f24" cam={cam} t={t} damage={0.96} night={0.1} fires={0.2} />
      {FOG}
      <SmokeColumn t={t} x={a[0]} y={a[1]} h={230} w={70} color="#6B6258" />
      <Vignette id="f24" o={0.55} />
      <Txt x={1080} y={184} text="SAU NGẦN ẤY BOM ĐẠN" size={92} o={ramp(s, 0.05, 0.35)} />
      <Hud s={s} /><MiniMap camera={cam} />
    </g>
  );
};

// ---------- province map shared by F25 / F26: the Thạch Hãn front line ----------
const mapCam = (s: number, dur: number, to: Camera): Camera => drift(s, { lon: 107.06, lat: 16.8, zoom: 1900 }, to, dur);

// ---------- F25: only the south bank is retaken ----------
export const F25: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = mapCam(s, len / 30, { lon: 107.1, lat: 16.78, zoom: 2300 }), P = proj(cam), [fx, fy] = P(107.185, 16.754);
  return (
    <g>
      <QtMap cam={cam} id="f25m" sites={['quangTri', 'dongHa', 'laVang']} />
      <FrontSides cam={cam} id="f25f" south={ramp(s, 0.5, 1.4)} north={0} line={ramp(s, 0.1, 0.6)} />
      <g transform={`translate(${fx},${fy})`}><PoleFlag x={0} y={0} h={130} kind="rvn" t={t} /></g>
      <Tag x={1090} y={900} text="BỜ NAM THẠCH HÃN" sub="phía Sài Gòn lấy lại" color={YELLOW} o={ramp(s, 1.0, 1.4)} />
      <MapHud s={s} cam={cam} date="16.09.1972" day="NGÀY 81/81" />
    </g>
  );
};

// ---------- F26: the north half of the province is still held by Quân Giải phóng ----------
export const F26: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, { lon: 107.1, lat: 16.78, zoom: 2300 }, { lon: 107.05, lat: 16.9, zoom: 1800 }, len / 30), P = proj(cam);
  const flags = [P(107.03, 16.94), P(107.16, 17.03), P(106.9, 17.08)];
  const [sx, sy] = P(107.185, 16.754);
  return (
    <g>
      <QtMap cam={cam} id="f26m" sites={['quangTri', 'dongHa', 'laVang']} />
      <FrontSides cam={cam} id="f26f" south={1} north={ramp(s, 0.2, 1.2)} />
      <g transform={`translate(${sx},${sy})`}><PoleFlag x={0} y={0} h={110} kind="rvn" t={t} /></g>
      {flags.map(([x, y], i) => <Pop key={i} s={s} at={0.9 + i * 0.25} x={x} y={y}><PoleFlag x={x} y={y} h={150} kind="vnm" t={t + i * 9} /></Pop>)}
      <Tag x={1120} y={290} text="NỬA PHÍA BẮC TỈNH" sub="vẫn trong tay Quân Giải phóng" color="#F26B55" o={ramp(s, 1.2, 1.7)} />
      <Tag x={1090} y={900} text="BỜ NAM THẠCH HÃN" sub="phía Sài Gòn lấy lại" color={YELLOW} o={0.95} />
      <MapHud s={s} cam={cam} date="16.09.1972" day="NGÀY 81/81" />
    </g>
  );
};
