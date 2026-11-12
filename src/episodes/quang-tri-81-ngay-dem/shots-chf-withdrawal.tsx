import React from 'react';
import { ShotProps } from '../../engine';
import { FrontArrow, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { RiverCrossing } from '../../countryball/ground-river-crossing';
import { TinyFigures } from '../../countryball/ground-helicopters';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { NightChip } from '../../countryball/hud-chips';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { cameraOnCitadel, localToScreen } from '../../countryball/citadel-geometry';
import { Backdrop, Chip, Clock, drift, MapHud, OrderPaper, Plan, Pop, QtMap, ramp, sec, SRC_VN, Txt, Vignette } from './chf-common';

// Chapter F, beat "25 withdrawal" (F12-F18, 491.2-504.5 s): night of 15.9 (ngày 80/81) the front command orders the units to leave
// the town and the citadel from 22:00 (source label "Theo phía Việt Nam"); the rest quietly take their wounded to the bank (tiny dots
// only) and cross the Thạch Hãn back to the north bank in the dark: silent, no flares, no hits. VNM red arrows.

const D15 = [{ t: 0, label: '15.09.1972' }];
const FROM: [number, number] = [-780, -150], TO: [number, number] = [-440, -20];
const L = (cam: ReturnType<typeof cameraOnCitadel>, x: number, y: number) => localToScreen(cam, x, y);
const Hud: React.FC<{ s: number }> = ({ s }) => (<><DateChip dates={D15} t={s} id="hud-date" /><NightChip label="NGÀY 80/81" t={s} from={0.15} /></>);

// ---------- F12: the night of 15.9 ----------
export const F12: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, { ...CAMERAS.triThienFront, zoom: 4500 }, { lon: 107.17, lat: 16.77, zoom: 8000 }, len / 30);
  return (
    <g>
      <QtMap cam={cam} id="f12m" night={0.7} sites={['quangTri', 'citadel', 'dongHa']} />
      <rect width={1920} height={1080} fill="#050B15" opacity={0.18} />
      <Txt x={1100} y={190} text="ĐÊM 15 THÁNG 9" size={112} o={ramp(s, 0.05, 0.3)} />
      <MapHud s={s} cam={cam} date="15.09.1972" day="NGÀY 80/81" />
    </g>
  );
};

// ---------- F13: the order (source label) ----------
export const F13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = ramp(s, 0.05, 0.5);
  return (
    <g>
      <Backdrop s={s} id="f13" />
      <OrderPaper x={560} y={560 + (1 - k) * 160} s={1.05 + 0.03 * s} rot={-4 + (1 - k) * 8} />
      <Txt x={1230} y={380} text="LỆNH" size={150} o={ramp(s, 0.35, 0.6)} />
      <Txt x={1230} y={520} text="RÚT QUÂN" size={150} color="#E2B95A" o={ramp(s, 0.55, 0.8)} />
      <Txt x={1230} y={640} text="Bộ chỉ huy mặt trận" size={54} color="#B9C6D6" weight={700} o={ramp(s, 0.8, 1.05)} />
      <Pop s={s} at={0.95} x={1230} y={780}><Chip x={1230} y={780} text={SRC_VN} size={48} /></Pop>
      <Vignette id="f13" o={0.5} />
    </g>
  );
};

// ---------- F14: pull out of the town and the citadel, towards the river ----------
export const F14: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-120, 20, 0.5), cameraOnCitadel(-240, 0, 0.62), len / 30);
  const A = [[40, -20], [-200, -40], [-430, -20]].map(([x, y]) => L(cam, x, y)), B = [[380, 360], [0, 260], [-430, 40]].map(([x, y]) => L(cam, x, y));
  return (
    <g>
      <Plan id="f14" cam={cam} t={t} damage={0.95} night={0.7} fires={0.2} />
      <FrontArrow id="f14a" t={t} t0={4} points={A} width={52} color={SIDE_COLORS.vnm} dur={50} />
      <FrontArrow id="f14b" t={t} t0={12} points={B} width={46} color={SIDE_COLORS.vnm} dur={50} />
      <Vignette id="f14" o={0.5} />
      <Txt x={1040} y={178} text="RÚT KHỎI THỊ XÃ" size={92} o={ramp(s, 0.05, 0.3)} />
      <Txt x={1040} y={276} text="VÀ THÀNH CỔ" size={92} color="#E2B95A" o={ramp(s, 0.4, 0.65)} />
      <Hud s={s} /><MiniMap camera={cam} />
    </g>
  );
};

// ---------- F15: from 22:00 ----------
export const F15: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="f15" top="#0F1D2E" bottom="#050B14" />
      <Txt x={960} y={150} text="BẮT ĐẦU TỪ" size={96} o={ramp(s, 0.05, 0.3)} />
      <Clock x={960} y={470} r={190} k={ramp(s, 0.1, 1.2)} label="22:00" />
      <Pop s={s} at={1.1} x={960} y={1010}><Chip x={960} y={1010} text={SRC_VN} size={40} /></Pop>
      <Hud s={s} />
    </g>
  );
};

// ---------- F16: quietly, down to the river bank (tiny dots only) ----------
export const F16: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-200, 0, 0.9), cameraOnCitadel(-300, 0, 1.0), len / 30);
  const a = L(cam, -250, 10), b = L(cam, -470, -10);
  return (
    <g>
      <Plan id="f16" cam={cam} t={t} damage={0.95} night={0.9} fires={0.1} />
      <rect width={1920} height={1080} fill="#050B15" opacity={0.3} />
      <g transform={`translate(${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}) scale(2.3) translate(${-(a[0] + b[0]) / 2},${-(a[1] + b[1]) / 2})`}>
        {[0, 1, 2].map((i) => <TinyFigures key={i} t={t} t0={i * 26} from={[a[0], a[1] + (i - 1) * 40]} to={[b[0], b[1] + (i - 1) * 30]} n={5} spread={24} color="#C8D2DC" dur={110} />)}
      </g>
      <Vignette id="f16" o={0.7} />
      <Txt x={960} y={160} text="LẶNG LẼ" size={130} color="#DCE6F2" o={ramp(s, 0.1, 0.6)} />
      <Txt x={960} y={930} text="XUỐNG BỜ SÔNG" size={84} color="#E2B95A" o={ramp(s, 1.2, 1.7)} />
      <Hud s={s} />
    </g>
  );
};

// ---------- F17: crossing the Thạch Hãn in the dark, back to the north bank ----------
export const F17: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-300, 0, 0.85), cameraOnCitadel(-380, -20, 0.85), len / 30);
  const a = L(cam, TO[0], TO[1]), b = L(cam, FROM[0], FROM[1]);
  return (
    <g>
      <Plan id="f17" cam={cam} t={t} damage={0.95} night={0.92} />
      <RiverCrossing id="f17r" t={t} t0={2} t1={62} from={a} to={b} n={4} size={46} spacing={66} drift={36} splashes={0} />
      <Vignette id="f17" o={0.75} />
      <Txt x={1100} y={180} text="TRONG BÓNG TỐI" size={112} color="#DCE6F2" o={ramp(s, 0.05, 0.4)} />
      <Txt x={960} y={930} text="VƯỢT THẠCH HÃN" size={84} color="#E2B95A" o={ramp(s, 0.9, 1.3)} />
      <Hud s={s} />
    </g>
  );
};

// ---------- F18: back on the north bank ----------
export const F18: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraOnCitadel(-420 - 40 * s, -40, 0.85);
  const a = L(cam, -560, -150), b = L(cam, FROM[0] - 30, FROM[1] - 20), c = L(cam, TO[0], TO[1]);
  return (
    <g>
      <Plan id="f18" cam={cam} t={t} damage={0.95} night={0.92} />
      <RiverCrossing id="f18r" t={t} t0={-30} t1={26} from={c} to={b} n={3} size={46} spacing={66} drift={30} splashes={0} />
      <FrontArrow id="f18a" t={t} t0={4} points={[c, a, [b[0] - 90, b[1] - 120]]} width={40} color={SIDE_COLORS.vnm} dur={26} />
      <Vignette id="f18" o={0.75} />
      <Txt x={1060} y={180} text="VỀ BỜ BẮC" size={128} color="#DCE6F2" o={ramp(s, 0.05, 0.3)} />
      <Hud s={s} />
    </g>
  );
};
