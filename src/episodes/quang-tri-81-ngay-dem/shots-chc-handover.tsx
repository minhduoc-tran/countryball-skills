import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret } from '../../countryball/ball-accessories-military';
import { breathe, hop, hopOnce } from '../../countryball/ball-motion';
import { cameraOnCitadel, citadelScreen, localToScreen } from '../../countryball/citadel-geometry';
import { FrontArrow, TrenchLine } from '../../countryball/ground-front-arrows';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { Camera } from '../../countryball/geo-camera';
import { Cap, INK, NameCard, PlanScene, RVN_YELLOW, Tag, cameraOnLocal, driftKeys, easeOut, prog } from './chc-common';

// Chapter C, part 5 (4:32-4:48, beat "13 handover"): C24 Dù attacks stopped, C25 Dù exhausted, C26 Gen. Ngô Quang Trưởng decides
// (plain name card), C27 baton to the Marines, C28 "2 tuần -> 1 tháng" calendar, C29 the battle for the citadel truly begins.
// Dù = red beret, TQLC = green beret (RVN ball). Sad, tired, never mocked.

const RED_BERET = <Beret color="#B3262B" badge="wings" />, GREEN_BERET = <Beret color="#2F6B3A" badge="anchor" />;
const Veil: React.FC<{ o: number }> = ({ o }) => <rect width={1920} height={1080} fill="#0A121C" opacity={o} />;
const P = (cam: Camera) => (x: number, y: number) => localToScreen(cam, x, y) as [number, number];

/** C24 "Lính Dù tấn công vào thị xã nhiều lần, nhưng đều bị chặn lại." yellow arrows from the south stop at a red line. */
export const C24: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c24" keys={driftKeys(cameraOnLocal(-40, 520, 0.36), cameraOnLocal(-40, 480, 0.4), 3.6)} date="7.1972"
    over={(cam) => {
      const p = P(cam), stop = easeOut(prog(t, 66, 76)), b = p(-150, 1350);
      return (
        <g>
          {[[-330, -150], [0, -10], [330, 140]].map(([x, dx], i) => (
            <FrontArrow key={i} id={`c24-${i}`} t={t} t0={i * 12} dur={54} points={[p(x + dx, 1500), p(x + dx * 0.5, 1050), p(x, 560)]} width={46} color={RVN_YELLOW} label={i === 1 ? 'DÙ' : undefined} />
          ))}
          <TrenchLine id="c24-r" t={t} t0={62} dur={20} points={[p(-520, 440), p(-200, 420), p(150, 430), p(520, 450)]} style="zigzag" color="#9C1F18" amp={14} />
          <Ball id="c24-b" x={b[0] - 90} y={b[1] + 20} r={46} flag="RVN" eyes="determined" hat={RED_BERET} motion={breathe(t, 50, 0.04)} />
          {stop > 0.01 && <Tag t={t} at={66} x={960} y={170} text="BỊ CHẶN LẠI" size={72} fill="#9C1F18" />}
          <Tag t={t} at={4} x={960} y={970} text="LÍNH DÙ TẤN CÔNG NHIỀU LẦN" size={44} fill="#8F6D0A" />
        </g>
      );
    }} />
);

/** C25 "Đến cuối tháng bảy, sư đoàn Dù đã kiệt sức." a red-beret ball, a draining bar. */
export const C25: React.FC<ShotProps> = ({ t }) => {
  const level = 1 - 0.9 * easeOut(prog(t, 8, 66));
  return (
    <PlanScene t={t} id="c25" keys={driftKeys(cameraOnCitadel(0, 200, 0.5), cameraOnCitadel(0, 220, 0.54), 2.9)} date="CUỐI 7.1972" mini={false}
      under={() => <Veil o={0.62} />}
      over={() => (
        <g>
          <Ball id="c25-b" x={640} y={600} r={190} flag="RVN" eyes="sad" tear hat={RED_BERET} sweat tilt={-4} motion={breathe(t, 90, 0.025)} />
          <g transform="translate(1000,420)">
            <text fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFF" stroke={INK} strokeWidth={8} paintOrder="stroke">SỨC LỰC SƯ ĐOÀN DÙ</text>
            <rect y={30} width={700} height={70} rx={35} fill="#15181F" stroke="#FFF" strokeWidth={5} />
            <rect x={8} y={38} width={Math.max(30, 684 * level)} height={54} rx={27} fill={level > 0.4 ? RVN_YELLOW : '#C9343A'} />
          </g>
          <Tag t={t} at={30} x={1350} y={680} text="KIỆT SỨC" size={84} fill="#9C1F18" />
        </g>
      )} />
  );
};

/** C26 "Tướng Ngô Quang Trưởng quyết định giao nhiệm vụ lại" plain name card + an order sheet. */
export const C26: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 30, 44));
  return (
    <PlanScene t={t} id="c26" keys={driftKeys(cameraOnCitadel(0, 200, 0.54), cameraOnCitadel(0, 200, 0.6), 2.4)} date="CUỐI 7.1972" mini={false}
      under={() => <Veil o={0.62} />}
      over={() => (
        <g>
          <NameCard t={t} at={4} x={820} y={460} name="NGÔ QUANG TRƯỞNG" sub="trung tướng, quân đội Sài Gòn" w={860} />
          <g transform={`translate(1500,${620 + (1 - k) * 80}) rotate(5)`} opacity={k}>
            <rect x={-150} y={-120} width={300} height={380} rx={8} fill="#F6F2E7" stroke={INK} strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-110} y={-80 + i * 40} width={i === 4 ? 120 : 220} height={12} rx={6} fill="#8C877A" />)}
            <text y={235} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#9C1F18">QUYẾT ĐỊNH</text>
          </g>
        </g>
      )} />
  );
};

/** C27 "cho sư đoàn Thủy quân lục chiến." the red beret hands a baton to the green beret. */
export const C27: React.FC<ShotProps> = ({ t }) => {
  const enter = easeOut(prog(t, 0, 16)), pass = easeOut(prog(t, 16, 36));
  const bx = 640 + (1190 - 640) * pass, by = 700 - Math.sin(pass * Math.PI) * 140 - 0 * pass;
  return (
    <PlanScene t={t} id="c27" keys={driftKeys(cameraOnCitadel(0, 200, 0.6), cameraOnCitadel(0, 200, 0.64), 1.8)} date="CUỐI 7.1972" mini={false}
      under={() => <Veil o={0.62} />}
      over={() => (
        <g>
          <Ball id="c27-r" x={560} y={700} r={120} flag="RVN" eyes="sad" hat={RED_BERET} sweat motion={breathe(t, 60, 0.03)} />
          <Ball id="c27-g" x={1350 + (1 - enter) * 700} y={700} r={130} flag="RVN" eyes="determined" hat={GREEN_BERET} motion={t < 16 ? hop(t, 14, 18) : hopOnce(t, 38, 14, 26)} />
          <g transform={`translate(${bx},${by - 110}) rotate(${-40 + pass * 40})`}><rect x={-7} y={-90} width={14} height={220} rx={7} fill="#6B4A2A" stroke={INK} strokeWidth={5} /><rect x={7} y={-90} width={110} height={70} fill={RVN_YELLOW} stroke={INK} strokeWidth={5} />{[0, 1, 2].map((i) => <rect key={i} x={7} y={-76 + i * 22} width={110} height={7} fill="#C9343A" />)}</g>
          <Tag t={t} at={10} x={1350} y={920} text="THỦY QUÂN LỤC CHIẾN" size={44} fill="#2F6B3A" />
          <Tag t={t} at={2} x={560} y={920} text="SƯ ĐOÀN DÙ" size={44} fill="#9C1F18" />
        </g>
      )} />
  );
};

/** C28 "Kế hoạch hai tuần đã trôi qua một tháng." "2 TUẦN" is struck through, the calendar fills up. */
export const C28: React.FC<ShotProps> = ({ t }) => {
  const strike = easeOut(prog(t, 12, 22)), cells = Math.floor(prog(t, 24, 70) * 30.99), swap = t > 22;
  return (
    <g>
      <rect width={1920} height={1080} fill="#16212F" />
      <rect width={1920} height={1080} fill="#0A121C" opacity={0.25} />
      <g transform="translate(110,170)">
        <text fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFF">KẾ HOẠCH</text>
        <text y={150} fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={swap ? '#8A93A0' : '#FFD43B'} stroke={INK} strokeWidth={10} paintOrder="stroke">2 TUẦN</text>
        <rect y={110} width={420 * strike} height={14} rx={7} fill="#E0483C" stroke={INK} strokeWidth={4} transform="rotate(-6 200 120)" />
        {swap && <text y={320} fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FF6B5A" stroke={INK} strokeWidth={12} paintOrder="stroke" opacity={easeOut(prog(t, 24, 34))}>1 THÁNG</text>}
      </g>
      <g transform="translate(900,150)">
        <rect width={900} height={780} rx={24} fill="#F6F2E7" stroke={INK} strokeWidth={6} />
        <rect width={900} height={110} rx={24} fill="#C9343A" stroke={INK} strokeWidth={6} />
        <text x={450} y={78} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFF">NGÀY TRÔI QUA</text>
        {Array.from({ length: 30 }, (_, i) => {
          const x = 70 + (i % 7) * 115, y = 160 + Math.floor(i / 7) * 120, on = i < cells;
          return <g key={i}><rect x={x} y={y} width={96} height={96} rx={12} fill={on ? '#F2D5CF' : '#FFFFFF'} stroke={INK} strokeWidth={4} />{on && <path d={`M${x + 22},${y + 22} L${x + 74},${y + 74} M${x + 74},${y + 22} L${x + 22},${y + 74}`} stroke="#C9343A" strokeWidth={9} strokeLinecap="round" />}</g>;
        })}
      </g>
    </g>
  );
};

/** C29 "Và trận đánh vào thành cổ mới thật sự bắt đầu." push-in on the citadel as dusk falls; arrows from the east close in. */
export const C29: React.FC<ShotProps> = ({ t }) => {
  const dusk = prog(t, 0, 80);
  return (
    <PlanScene t={t} id="c29" keys={driftKeys(cameraOnCitadel(0, 0, 0.7), cameraOnCitadel(0, 0, 1.05), 2.7)} date="CUỐI 7.1972" damage={0.05 + 0.15 * dusk} night={0.1 + 0.5 * dusk} fires={0.5 * dusk}
      over={(cam) => {
        const e = citadelScreen(cam, 240, 0), pts = [[1900, 150], [1500, 330], [1180, 470]].map(([x, y]) => [x, y] as [number, number]);
        return (
          <g>
            <FrontArrow id="c29-a" t={t} t0={14} dur={50} points={[...pts, [e[0] + 30, e[1]]]} width={50} color={RVN_YELLOW} label="TQLC" />
            <ShellBarrage id="c29-s" t={t} t0={30} from={[2100, 100]} to={[960, 540]} n={10} span={50} spread={[220, 160]} dur={40} lift={180} r={26} />
            <Cap t={t} x={900} y={990} text="TRẬN ĐÁNH VÀO THÀNH CỔ MỚI BẮT ĐẦU" size={48} at={22} color="#FFE08A" />
          </g>
        );
      }} />
  );
};
