import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { breathe, mixMotion, talk } from '../../countryball/ball-motion';
import { NavyCap, M1Helmet } from '../../countryball/ball-accessories-military';
import { FlagCloth } from '../../countryball/flag-cloth';
import { HeliSide } from '../../countryball/ground-helicopters';
import { RooftopEvacuation } from '../../countryball/rooftop-evacuation';
import { WarshipSide } from '../../countryball/ground-naval-gunfire';
import { ClockChip } from '../../countryball/hud-clock-chip';
import { lerp } from '../../countryball/fx-math';
import { Cap, PhotoE, Plate, SeaBackdrop, Stage, Tag, USA_BLUE, easeOut, prog } from './che-common';

// Chapter E, part 2 (5:32-5:48, beat "7d martin"): E7 04:58 (ClockChip), E8 Graham Martin (print of 25.03.1975, Martin is one of the four), E9 07:53 the last helicopter
// lifts off the embassy roof (label NÓC TÒA ĐẠI SỨ MỸ), E10 the last Marines fly out, E11 "Mỹ rời Việt Nam" (US ball on a ship, sea horizon).
// Times on screen are exactly the narrated ones: 04:58 and 07:53 (ClockChip, date 30.04.1975).

const SKYLINE = [[0, 120, 90], [100, 190, 70], [190, 140, 110], [310, 230, 80], [400, 160, 100], [520, 260, 90], [630, 170, 120], [760, 210, 80], [850, 150, 110], [970, 250, 90], [1080, 180, 100], [1190, 130, 120], [1330, 220, 90], [1430, 170, 110], [1560, 240, 80], [1650, 150, 100], [1770, 200, 150]];
/** City skyline silhouette along y = ground (px), colour c. */
const Skyline: React.FC<{ y: number; c: string; o?: number }> = ({ y, c, o = 1 }) => (
  <g opacity={o}>{SKYLINE.map(([x, h, w], i) => <g key={i}><rect x={x} y={y - h} width={w} height={h + 400} fill={c} />{[0, 1, 2, 3].map((r) => <rect key={r} x={x + 10} y={y - h * 0.5 + 14 + r * 26} width={w - 20} height={6} fill="#F6D27A" opacity={0.10 + 0.06 * ((i + r) % 3)} />)}{i % 3 === 0 && <rect x={x + w / 2 - 3} y={y - h * 0.5 - 26} width={6} height={26} fill={c} />}</g>)}</g>
);

/** E7 332.56 "Bốn giờ năm mươi tám phút sáng ngày ba mươi tháng Tư," pre-dawn city, the clock chip reads 04:58. */
export const E7: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 0, 14)), glow = prog(t, 0, 76);
  return (
    <g>
      <Stage id="e7" tone="dawn" />
      <rect width={1920} height={1080} fill="#050B18" opacity={0.7 - 0.25 * glow} />
      <Skyline y={760} c="#0A1220" />
      <Skyline y={820} c="#05080F" o={0.95} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={110 + i * 220} y={560 + (i % 3) * 60} width={10} height={14} fill="#F6D27A" opacity={0.5 + 0.3 * Math.sin(t / 9 + i)} />)}
      <g transform={`translate(960,${430 + (1 - k) * 30}) scale(${0.9 + 0.1 * k})`} opacity={k}>
        <text textAnchor="middle" fontFamily="'Bricolage Grotesque', sans-serif" fontWeight={900} fontSize={250} fill="#FFFFFF" stroke="#0A121C" strokeWidth={30} paintOrder="stroke" strokeLinejoin="round">04:58</text>
      </g>
      <Cap t={t} at={14} x={960} y={600} text="SÁNG 30.04.1975" size={68} color="#FFE08A" />
      <ClockChip date="30.04.1975" clock="04:58" t={t / 30} id="e7-clock" />
    </g>
  );
};

/** E8 335.10 "Đại sứ Mỹ Graham Martin rời Sài Gòn." print: the meeting of 25.03.1975 (caption lists all four), name tag for Martin. */
export const E8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e8" tone="navy" />
    <PhotoE k="martin" id="e8p" t={t} x={960} y={450} w={960} rot={-1.5} from={0.05} fromSide="right" kb={{ z0: 1.0, z1: 1.12, px0: 0.02, py0: 0, px1: -0.02, py1: 0 }} sepia={0.1} />
    <Tag t={t} at={14} x={960} y={968} text="ĐẠI SỨ MỸ GRAHAM MARTIN" fill="#2F5E9A" size={46} sub="rời Sài Gòn" subColor="#FFE08A" />
  </g>
);

/** E9 337.69 "Bảy giờ năm mươi ba phút, chiếc trực thăng cuối cùng cất cánh từ nóc tòa đại sứ," the Huey on the embassy roof lifts off at 07:53. */
export const E9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RooftopEvacuation id="e9" y={780} land={1 - prog(t, 82, 124)} queue={prog(t, 8, 66)} n={6} t={t} tone="day" />
    <ClockChip date="30.04.1975" clock="07:53" t={t / 30} id="e9-clock" />
    <Plate t={t} at={40} x={1250} y={150} text="NÓC TÒA ĐẠI SỨ MỸ" size={60} />
  </g>
);

/** E10 341.84 "mang theo những người lính thủy quân lục chiến cuối cùng." a helicopter flies out over the dawn city, a worried US ball looks after it. */
export const E10: React.FC<ShotProps> = ({ t }) => {
  const k = prog(t, 0, 81);
  return (
    <g>
      <SeaBackdrop id="e10" tone="dawn" y={700} t={t} />
      <Skyline y={720} c="#2A2F4A" o={0.8} />
      <rect y={720} width={1920} height={360} fill="#16314F" />
      <HeliSide x={lerp(420, 1650, k)} y={lerp(470, 330, k)} size={300 - 100 * k} kind="uh1" t={t} />
      <rect y={850} width={1920} height={230} fill="#6D7782" /><rect y={844} width={1920} height={12} fill="#B8BEC4" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={i * 240 + 20} y={780} width={8} height={70} fill="#4C5560" />)}<rect y={780} width={1920} height={8} fill="#4C5560" />
      <Ball id="e10b" x={520} y={744} r={100} flag="USA" eyes="worried" look={0.6} hat={<M1Helmet />} tilt={6} motion={breathe(t, 80, 0.02)} t={t} />
      <Cap t={t} at={0} x={960} y={140} text="NHỮNG LÍNH THỦY QUÂN LỤC" size={64} />
      <Cap t={t} at={8} x={960} y={225} text="CHIẾN CUỐI CÙNG" size={64} color="#FFE08A" />
    </g>
  );
};

/** E11 344.53 "Sự hiện diện quân sự của Mỹ ở Việt Nam đã kết thúc." a US ball on a ship sails away from the coast, sea horizon. */
export const E11: React.FC<ShotProps> = ({ t }) => {
  const sx = lerp(980, 1180, prog(t, 0, 121)), bob = Math.sin(t / 16) * 5;
  return (
    <g>
      <SeaBackdrop id="e11" tone="dusk" y={560} t={t} />
      <path d="M0,560 L0,534 Q120,520 260,538 Q330,544 380,560 Z" fill="#3E5B48" opacity={0.85} />
      <g transform="translate(150,500)"><FlagCloth id="e11f" x={0} y={-60} w={72} h={48} kind="VNM" wave={0.8} t={t} /><line x1={0} y1={-62} x2={0} y2={34} stroke="#151515" strokeWidth={4} /></g>
      <defs><clipPath id="e11clip"><rect x={0} y={0} width={1920} height={650 + bob + 4} /></clipPath></defs>
      <g clipPath="url(#e11clip)"><WarshipSide x={sx} y={650 + bob} size={780} kind="cruiser" t={t} /></g>
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${sx - 420 + i * 110},${654 + bob + (i % 2) * 8} q28,-10 56,0 t56,0`} fill="none" stroke="#E8F4FF" strokeWidth={4} opacity={0.55} />)}
      <Ball id="e11b" x={sx - 30} y={470 + bob} r={92} flag="USA" eyes="sad" look={-0.7} hat={<NavyCap />} tilt={-4} motion={mixMotion(breathe(t, 90, 0.02), talk(t, false))} t={t} />
      <Cap t={t} at={4} x={960} y={160} text="MỸ RỜI VIỆT NAM" size={104} />
      <Tag t={t} at={50} x={960} y={950} text="SỰ HIỆN DIỆN QUÂN SỰ ĐÃ KẾT THÚC" fill={USA_BLUE} size={44} />
    </g>
  );
};
