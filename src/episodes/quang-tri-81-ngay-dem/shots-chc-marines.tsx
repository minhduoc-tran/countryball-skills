import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret } from '../../countryball/ball-accessories-military';
import { hop } from '../../countryball/ball-motion';
import { PhotoCard } from '../../countryball/photo-card';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { FrontArrow, SIDE_COLORS, TrenchLine, UnitBox } from '../../countryball/ground-front-arrows';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { Cap, PlanScene, RVN_YELLOW, Tag, driftKeys, easeOut, prog } from './chc-common';
import { DimLine } from './chc-plan-bits';

// Chapter C, part 6 (4:48-5:01, beat "13b marines"): C30 the green-beret Marines, C31 they advance from the east, C32 house by house,
// street by street, C33 the front moves only a few tens of metres a day (+ archive photo 024).

const GREEN = <Beret color="#2F6B3A" badge="anchor" />;
const Veil: React.FC<{ o: number }> = ({ o }) => <rect width={1920} height={1080} fill="#0A121C" opacity={o} />;

/** C30 "Thủy quân lục chiến, những người lính mũ xanh của Sài Gòn," a rank of green-beret balls steps forward. */
export const C30: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c30" keys={driftKeys(cameraOnCitadel(120, 0, 0.6), cameraOnCitadel(120, 0, 0.66), 3.1)} date="CUỐI 7.1972" mini={false}
    under={() => <Veil o={0.6} />}
    over={() => (
      <g>
        {[0, 1, 2, 3, 4].map((i) => {
          const k = easeOut((t - 4 - i * 6) / 10), mid = i === 2, r = mid ? 150 : 100;
          return k > 0.01 ? <Ball key={i} id={`c30-${i}`} x={260 + i * 350} y={mid ? 560 : 620 + (i % 2) * 20} r={r} flag="RVN" eyes="determined" hat={GREEN} shadow
            motion={hop(t, 36, mid ? 14 : 10, i * 7)} /> : null;
        })}
        <Tag t={t} at={14} x={960} y={240} text="THỦY QUÂN LỤC CHIẾN" size={70} fill="#2F6B3A" sub="những người lính mũ xanh của Sài Gòn" />
      </g>
    )} />
);

/** C31 "bắt đầu tiến vào từ phía đông." a yellow arrow into the east gate. */
export const C31: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c31" keys={driftKeys(cameraOnCitadel(120, 0, 0.7), cameraOnCitadel(80, 0, 0.78), 1.8)} date="CUỐI 7.1972"
    over={(cam) => {
      const e = citadelScreen(cam, 240, 0), a = citadelScreen(cam, 760, -140), b = citadelScreen(cam, 480, -50);
      return (
        <g>
          <FrontArrow id="c31-a" t={t} t0={2} dur={34} points={[[a[0] + 400, a[1] - 60], a, b, [e[0] + 24, e[1]]]} width={56} color={RVN_YELLOW} label="TQLC" labelSize={30} />
          <UnitBox x={a[0] + 120} y={a[1] + 150} kind="mar" color={SIDE_COLORS.rvn} label="TQLC" size={56} />
          <Tag t={t} at={10} x={960} y={150} text="TIẾN VÀO TỪ PHÍA ĐÔNG" size={58} fill="#8F6D0A" />
        </g>
      );
    }} />
);

/** C32 "Từng dãy nhà, từng con phố trong thị xã trở thành chiến tuyến." close on the streets east of the walls. */
export const C32: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c32" keys={driftKeys(cameraOnCitadel(420, 60, 1.5), cameraOnCitadel(450, 40, 1.7), 3.4)} date="CUỐI 7.1972" night={0.2} damage={0.2} craters={0.6}
    over={() => (
      <g>
        <TrenchLine id="c32-r" t={t} t0={2} dur={40} points={[[520, 120], [640, 330], [600, 520], [700, 760], [650, 980]]} style="zigzag" color="#7A1F18" amp={14} />
        <TrenchLine id="c32-y" t={t} t0={14} dur={40} points={[[1180, 110], [1260, 330], [1210, 560], [1290, 780], [1230, 980]]} style="triangles" color={RVN_YELLOW} side={-1} step={34} />
        <FrontArrow id="c32-a" t={t} t0={30} dur={40} points={[[1500, 640], [1330, 600], [1120, 560], [940, 560]]} width={42} color={RVN_YELLOW} />
        <ShellBarrage id="c32-s" t={t} t0={6} from={[-300, 200]} to={[900, 500]} n={14} span={90} spread={[200, 220]} dur={40} lift={180} r={30} />
        <SmokeColumn t={t} t0={10} x={760} y={620} h={260} w={38} fire />
        <SmokeColumn t={t} t0={30} x={1080} y={300} h={220} w={32} />
        <Cap t={t} x={960} y={140} text="TỪNG DÃY NHÀ" size={72} at={4} />
        <Cap t={t} x={960} y={1000} text="TỪNG CON PHỐ = CHIẾN TUYẾN" size={64} at={27} color="#FFE08A" />
      </g>
    )} />
);

/** C33 "Có những ngày, chiến tuyến chỉ xê dịch được vài chục mét." the line steps forward a short distance; archive photo. */
export const C33: React.FC<ShotProps> = ({ t }) => {
  const mv = easeOut(prog(t, 30, 90)), x1 = 520, x2 = 520 + 150;
  const line = (x: number): [number, number][] => [[x, 150], [x + 30, 340], [x - 20, 540], [x + 24, 740], [x, 930]];
  return (
    <PlanScene t={t} id="c33" keys={driftKeys(cameraOnCitadel(330, 30, 3.0), cameraOnCitadel(330, 30, 3.3), 4.2)} date="CUỐI 7.1972" night={0.15} damage={0.3} mini={false}
      under={() => <Veil o={0.25} />}
      over={() => (
        <g>
          <g opacity={0.6}><TrenchLine id="c33-g" t={t} t0={0} dur={2} points={line(x1)} style="dashes" color="#FFFFFF" /></g>
          <TrenchLine id="c33-y" t={t} t0={4} dur={20} points={line(x1 + 150 * mv)} style="triangles" color={RVN_YELLOW} side={-1} step={34} />
          <DimLine a={[x1, 900]} b={[x2, 900]} label="VÀI CHỤC MÉT" k={easeOut(prog(t, 40, 70))} size={58} offset={-30} />
          <Cap t={t} x={1000} y={110} text="MỘT NGÀY" size={64} at={6} />
          <PhotoCard id="c33p" src="quang-tri-81-ngay-dem/img/024.jpg" caption="Giao tranh tại tường Thành cổ, 1972" credit="Ảnh: U.S. Marine Corps History Division / Public domain" x={1450} y={500} w={680} h={400} rot={2.5} from={0.25} t={t / 30}
            kb={{ z0: 1.05, z1: 1.18, px0: 0.02, py0: 0.0, px1: -0.02, py1: 0.0 }} />
        </g>
      )} />
  );
};
