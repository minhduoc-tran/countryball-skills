import React from 'react';
import { ShotProps } from '../../engine';
import { PhotoCard } from '../../countryball/photo-card';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { cameraOnCitadel, citadelScreen, localToScreen } from '../../countryball/citadel-geometry';
import { Boat } from '../../countryball/ground-river-crossing';
import { Glow } from '../../countryball/fx-glow';
import { Cap, INK, PlanScene, Tag, VNM_RED, cameraOnLocal, driftKeys, easeOut, prog } from './chc-common';
import { WallOutline } from './chc-plan-bits';

// Chapter C, part 2 (3:43-4:01, beats "9b photo" + "10 river"): C8-C10 the 1967 aerial photo and the plan that matches it,
// C11-C13 the Thạch Hãn: south bank (citadel) vs north bank (Quân Giải phóng rear), "the door of the river".

const PHOTO = '1967.jpg', CR1967 = 'Ảnh: Sciacchitano / CC BY-SA 3.0', CAP1967 = 'Thị xã Quảng Trị và sông Thạch Hãn, 1967';
const Veil: React.FC<{ o: number }> = ({ o }) => <rect width={1920} height={1080} fill="#0A121C" opacity={o} />;

/** C8 "Trong một bức ảnh chụp từ trên cao năm một nghìn chín trăm sáu mươi bảy," the print lands over the dimmed plan. */
export const C8: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c8" keys={driftKeys(cameraOnCitadel(0, 0, 0.4), cameraOnCitadel(60, 30, 0.46), 3.5)} dates={[{ t: 0, label: '1967' }]} mini={false}
    under={() => <Veil o={0.55} />}
    over={() => <PhotoCard id="c8p" src={`quang-tri-81-ngay-dem/img/${PHOTO}`} caption={CAP1967} credit={CR1967} x={960} y={540} w={900} h={624} rot={-2} from={0.05} t={t / 30}
      kb={{ z0: 1.0, z1: 1.14, px0: 0.01, py0: 0.01, px1: -0.01, py1: -0.01 }} sepia={0.25} fromSide="bottom" />} />
);

// Photo geometry for C9: w 1100 h 763, rot 0, centred at (960, 520): the picture's top-left on screen is (410, 100.5), scale 1100/960.
const PW = 1100, PH = 763, PX = 960, PY = 520, S = PW / 960, OX = PX - PW / 2, OY = PY - 38 - PH / 2;
const QUAD: [number, number][] = [[167, 160], [280, 122], [447, 145], [320, 188]].map(([x, y]) => [OX + x * S, OY + y * S]);

/** C9 "thành cổ hiện ra như một hình vuông giữa thị xã," same print (still), the square is outlined. */
export const C9: React.FC<ShotProps> = ({ t }) => {
  const u = easeOut(prog(t, 18, 50)), pts = [...QUAD, QUAD[0]], len = pts.length - 1, f = u * len;
  const line: [number, number][] = [pts[0]];
  for (let i = 0; i < len && f > i; i++) line.push(f >= i + 1 ? pts[i + 1] : [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * (f - i), pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (f - i)]);
  const d = line.map((p) => p.join(',')).join(' ');
  return (
    <PlanScene t={t} id="c9" keys={driftKeys(cameraOnCitadel(60, 30, 0.46), cameraOnCitadel(60, 30, 0.5), 2.7)} dates={[{ t: 0, label: '1967' }]} mini={false}
      under={() => <Veil o={0.55} />}
      over={() => (
        <g>
          <PhotoCard id="c9p" src={`quang-tri-81-ngay-dem/img/${PHOTO}`} caption={CAP1967} credit={CR1967} x={PX} y={PY} w={PW} h={PH} rot={0} from={-5} t={t / 30} kb={{ z0: 1, z1: 1, px0: 0, py0: 0, px1: 0, py1: 0 }} sepia={0.25} />
          <polyline points={d} fill="none" stroke={INK} strokeWidth={13} strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={d} fill="none" stroke="#FFD43B" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="16 9" />
          <Tag t={t} at={34} x={OX + 250 * S} y={OY + 92 * S} text="THÀNH CỔ" size={44} fill="#C9343A" />
        </g>
      )} />
  );
};

/** C10 "bao quanh là hào nước và những dãy phố nhỏ." Back on the plan: the moat lights up, then the street rows. */
export const C10: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c10" keys={driftKeys(cameraOnCitadel(40, 10, 0.55), cameraOnCitadel(40, 10, 0.64), 2.9)} date="1972"
    over={(cam) => {
      const p = citadelScreen(cam, 330, 170);
      return (
        <g>
          <WallOutline cam={cam} u={easeOut(prog(t, 2, 30))} style="glow" width={14} grow={22} />
          <Tag t={t} at={4} x={960} y={140} text="HÀO NƯỚC" size={60} fill="#1F6F9C" />
          <line x1={p[0]} y1={p[1]} x2={p[0] + 150} y2={p[1] + 150} stroke={INK} strokeWidth={8} opacity={prog(t, 46, 56)} />
          <Tag t={t} at={46} x={p[0] + 150} y={p[1] + 190} text="NHỮNG DÃY PHỐ NHỎ" size={46} fill="#B5573B" />
        </g>
      );
    }} />
);

/** C11 "Thành nằm gần bờ nam sông Thạch Hãn." */
export const C11: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c11" keys={driftKeys(cameraOnLocal(-260, 0, 0.34), cameraOnLocal(-300, 20, 0.38), 2.1)} date="1972" labels={['river']}
    over={(cam) => {
      const [x, y] = localToScreen(cam, -420, 170), [cx, cy] = citadelScreen(cam, 0, 0);
      return (
        <g>
          <Tag t={t} at={30} x={x - 40} y={y} text="BỜ NAM" size={56} fill="#C9343A" />
          <Tag t={t} at={6} x={cx + 170} y={cy - 150} text="THÀNH CỔ" size={50} fill="#B5573B" />
        </g>
      );
    }} />
);

/** C12 "Phía bên kia sông là hậu phương của Quân Giải phóng." the far bank goes red; boats carry supplies across. */
export const C12: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c12" keys={driftKeys(cameraOnLocal(-420, -60, 0.34), cameraOnLocal(-520, -60, 0.36), 3.0)} date="1972" labels={['river']}
    over={(cam) => {
      const P = (x: number, y: number) => localToScreen(cam, x, y).join(',');
      const k = easeOut(prog(t, 14, 40));
      const [bx, by] = localToScreen(cam, -1000, -150), [t0x, t0y] = localToScreen(cam, -880, 30), [t1x, t1y] = localToScreen(cam, -400, 30);
      const u = prog(t, 30, 86), q = easeOut(u);
      return (
        <g>
          <defs><filter id="c12-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={10} /></filter><pattern id="c12-hatch" width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={18} height={18} fill={VNM_RED} opacity={0.3} /><rect width={6} height={18} fill={VNM_RED} opacity={0.5} /></pattern></defs>
          <polygon points={`${P(-1900, -1500)} ${P(-780, -1500)} ${P(-860, 0)} ${P(-940, 1500)} ${P(-1900, 1500)}`} fill="url(#c12-hatch)" opacity={k} filter="url(#c12-soft)" />
          <Glow x={bx} y={by} r={260} color={VNM_RED} o={0.25 * k} />
          <Ball id="c12-b" x={bx} y={by} r={74} flag="VNM" eyes="determined" hat={<MuCoi camo />} motion={breathe(t, 56, 0.035)} />
          <Boat x={t0x + (t1x - t0x) * q} y={t0y + (t1y - t0y) * q - 40} heading={0} size={120} t={t} crew={2} />
          <Tag t={t} at={12} x={620} y={900} text="HẬU PHƯƠNG QUÂN GIẢI PHÓNG" size={44} fill="#B03029" />
          <Tag t={t} at={4} x={1560} y={160} text="BỜ BẮC ◄ SÔNG ► BỜ NAM" size={34} fill="#1B1B1B" color="#F4F4F4" />
        </g>
      );
    }} />
);

/** C13 "Ai giữ được thành cổ, người đó giữ được cánh cửa của cả dòng sông." a golden door sits on the citadel. */
export const C13: React.FC<ShotProps> = ({ t }) => {
  const pulse = 1 + 0.06 * Math.sin(t / 5), k = easeOut(prog(t, 30, 52));
  return (
    <PlanScene t={t} id="c13" keys={driftKeys(cameraOnCitadel(-60, 0, 0.36), cameraOnCitadel(-120, 0, 0.26), 3.5)} date="1972" labels={['river']}
      over={(cam) => {
        const [x, y] = citadelScreen(cam, 0, 0);
        return (
          <g>
            <circle cx={x} cy={y} r={170 * pulse} fill="#FFD43B" opacity={0.16 * k} /><circle cx={x} cy={y} r={170 * pulse} fill="none" stroke="#FFD43B" strokeWidth={8} opacity={k} />
            <g transform={`translate(${x},${y - 210}) scale(${k * 1.0})`} opacity={k}>
              <path d="M-52,70 V-20 Q-52,-80 0,-80 Q52,-80 52,-20 V70 Z" fill="#8C5A2B" stroke={INK} strokeWidth={7} />
              <path d="M-34,70 V-16 Q-34,-60 0,-60 Q34,-60 34,-16 V70" fill="#B5793E" stroke={INK} strokeWidth={4} />
              <circle cx={20} cy={14} r={7} fill="#FFD43B" stroke={INK} strokeWidth={3} />
            </g>
            <Cap t={t} x={960} y={150} text="CÁNH CỬA CỦA CẢ DÒNG SÔNG" size={68} at={22} color="#FFE08A" />
          </g>
        );
      }} />
  );
};
