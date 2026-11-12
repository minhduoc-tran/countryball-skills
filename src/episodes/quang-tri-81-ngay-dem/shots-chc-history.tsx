import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { cameraOnCitadel } from '../../countryball/citadel-geometry';
import { RuinedWallSide } from '../../countryball/ground-ruined-wall-side';
import { Cap, INK, NameCard, PlanScene, Tag, driftKeys, easeOut, prog } from './chc-common';
import { DimLine, GateMarkers, WallOutline, squareAt, squareCorners } from './chc-plan-bits';

// Chapter C, part 1 (3:25-3:43, beat "9 citadel"): the Citadel built up on the plan. C1 fly-in + Gia Long, C2 1809 earth
// rampart (blueprint tint), C3 1837 Minh Mạng rebuilds in brick, C4 square + perimeter ~2.000 m, C5 wall side view ~4 m + moat,
// C6 four gates, C7 "hơn một trăm năm" administrative centre. All numbers are the script's ("khoảng").

const K = (ppm: number, u = 0, v = 0) => cameraOnCitadel(u, v, ppm);

/** C1 "Tòa thành ấy được xây từ thời vua Gia Long," fly from the front map down onto the citadel. */
export const C1: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c1" keys={[{ t: 0, ...CAMERAS.triThienFront }, { t: 1.9, ...K(0.8) }, { t: 2.4, ...K(0.86), ease: 'out' }]} labels={['citadel']}
    over={() => <NameCard t={t} at={26} x={1530} y={250} name="VUA GIA LONG" sub="triều Nguyễn" w={560} />} />
);

/** Blueprint tint over the plan (navy veil, fades with k). */
const Veil: React.FC<{ k: number }> = ({ k }) => <rect width={1920} height={1080} fill="#0B2A4A" opacity={0.66 * k} />;

/** C2 "năm một nghìn tám trăm linh chín," the earth rampart is drawn round the square. */
export const C2: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c2" keys={driftKeys(K(0.84), K(0.92), 1.8)} dates={[{ t: 0, label: '1809' }]}
    under={() => <Veil k={1} />}
    over={(cam) => (
      <g>
        <WallOutline cam={cam} u={easeOut(prog(t, 2, 40))} style="earth" width={18} />
        {squareCorners(cam).slice(0, 4).map(([x, y], i) => {
          const k = easeOut((t - 4 - i * 9) / 6);
          return k > 0.01 ? <circle key={i} cx={x} cy={y} r={20 * k} fill="#C79A55" stroke={INK} strokeWidth={5} /> : null;
        })}
        <Tag t={t} at={6} x={960} y={170} text="1809" size={92} fill="#8A6A3C" sub="THÀNH ĐẤT · VUA GIA LONG" />
      </g>
    )} />
);

/** C3 "rồi được vua Minh Mạng cho xây lại bằng gạch vào năm một nghìn tám trăm ba mươi bảy." */
export const C3: React.FC<ShotProps> = ({ t }) => {
  const brick = easeOut(prog(t, 58, 100));
  return (
    <PlanScene t={t} id="c3" keys={driftKeys(K(0.92), K(1.0), 4.5)} dates={[{ t: 0, label: '1809' }, { t: 2.75, label: '1837' }]}
      under={() => <Veil k={1 - prog(t, 62, 104)} />}
      over={(cam) => (
        <g>
          <WallOutline cam={cam} u={1} style="earth" width={18} />
          <WallOutline cam={cam} u={brick} style="brick" width={22} />
          <NameCard t={t} at={14} x={1530} y={250} name="VUA MINH MẠNG" sub="xây lại thành" w={580} />
          <Tag t={t} at={84} x={960} y={930} text="1837 · XÂY LẠI BẰNG GẠCH" size={52} fill="#B5573B" />
        </g>
      )} />
  );
};

/** C4 "Thành hình vuông, chu vi khoảng hai nghìn mét," a dot runs round the walls while the length counts up. */
export const C4: React.FC<ShotProps> = ({ t }) => {
  const u = easeOut(prog(t, 24, 66)), metres = Math.round((u * 2000) / 50) * 50;
  return (
    <PlanScene t={t} id="c4" keys={driftKeys(K(1.0), K(1.08), 2.4)} date="1972"
      over={(cam) => {
        const [x, y] = squareAt(cam, u);
        return (
          <g>
            <WallOutline cam={cam} u={1} style="brick" width={22} />
            <WallOutline cam={cam} u={u} style="glow" width={16} />
            {u > 0.01 && <circle cx={x} cy={y} r={15} fill="#FFFFFF" stroke="#2DB8E6" strokeWidth={6} />}
            <Tag t={t} at={2} x={960} y={150} text="HÌNH VUÔNG" size={64} fill="#2B5C8A" />
            <Tag t={t} at={24} x={960} y={930} text={`CHU VI ≈ ${metres.toLocaleString('vi-VN')} m`} size={60} fill="#1B1B1B" color="#7FE3FF" />
          </g>
        );
      }} />
  );
};

/** C5 "tường cao khoảng bốn mét, bao quanh là hào nước," side view: the wall with its height, then the moat in front. */
export const C5: React.FC<ShotProps> = ({ t }) => {
  const wx = 1000, wy = 700, h = 330, w = 980, moat = easeOut(prog(t, 40, 56)), sway = Math.sin(t / 10);
  return (
    <g>
      <defs>
        <linearGradient id="c5-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EC5E8" /><stop offset="1" stopColor="#E9F3F6" /></linearGradient>
        <linearGradient id="c5-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4E9CC4" /><stop offset="1" stopColor="#2B6C92" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#c5-sky)" />
      <path d="M0,640 Q300,560 620,630 T1240,610 T1920,640 L1920,720 L0,720 Z" fill="#7FA76A" stroke={INK} strokeWidth={5} />
      <rect y={wy - 6} width={1920} height={110} fill="#8FB46F" stroke={INK} strokeWidth={5} />
      <RuinedWallSide id="c5-wall" x={wx} y={wy} w={w} h={h} damage={0} t={t} />
      <rect y={wy + 104} width={1920} height={moat * 220} fill="url(#c5-water)" stroke={INK} strokeWidth={5} />
      {moat > 0.9 && [0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${220 + i * 300 + sway * 10},${wy + 160 + (i % 2) * 46} q40,-14 80,0 t80,0`} fill="none" stroke="#CFEAF7" strokeWidth={5} strokeLinecap="round" opacity={0.8} />)}
      <DimLine a={[wx - w / 2 - 70, wy]} b={[wx - w / 2 - 70, wy - h]} label="≈ 4 m" k={easeOut(prog(t, 8, 26))} size={54} offset={-120} />
      <Cap t={t} x={960} y={140} text="TƯỜNG THÀNH GẠCH" size={70} at={2} />
      <Tag t={t} at={44} x={960} y={wy + 214} text="HÀO NƯỚC BAO QUANH" size={50} fill="#1F6F9C" />
      <text x={56} y={1046} fontSize={21} fontFamily={FONT.ui} fill="#0A121C" opacity={0.7}>Mặt cắt minh họa, không theo tỉ lệ</text>
    </g>
  );
};

/** C6 "với bốn cửa ra vào." four numbered gates pop on the plan. */
export const C6: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c6" keys={driftKeys(K(0.9), K(0.96), 1.4)} date="1972" 
    over={(cam) => (
      <g>
        <WallOutline cam={cam} u={1} style="brick" width={22} />
        <GateMarkers cam={cam} t={t} at={4} gap={8} r={30} />
        <Tag t={t} at={2} x={960} y={985} text="4 CỬA RA VÀO" size={60} fill="#B5573B" />
      </g>
    )} />
);

/** C7 "Suốt hơn một trăm năm, nó là trung tâm hành chính của Quảng Trị." the view pulls back to the town; a decade ruler fills. */
export const C7: React.FC<ShotProps> = ({ t }) => {
  const ticks = 14, shown = Math.floor(easeOut(prog(t, 4, 44)) * ticks + 0.001);
  return (
    <PlanScene t={t} id="c7" keys={driftKeys(K(0.78), K(0.3), 3.4)} date="1972" labels={['citadel', 'river']}
      over={() => (
        <g>
          <rect x={420} y={888} width={1080} height={10} rx={5} fill="#FFFFFF" stroke={INK} strokeWidth={3} opacity={0.9} />
          {Array.from({ length: ticks + 1 }, (_, i) => i <= shown && <rect key={i} x={420 + (i * 1080) / ticks - 4} y={870} width={8} height={46} fill="#F2C230" stroke={INK} strokeWidth={3} />)}
          <Tag t={t} at={4} x={960} y={150} text="HƠN 100 NĂM" size={76} fill="#1B1B1B" color="#F2C230" />
          <Tag t={t} at={40} x={960} y={970} text="TRUNG TÂM HÀNH CHÍNH QUẢNG TRỊ" size={44} fill="#B5573B" />
        </g>
      )} />
  );
};
