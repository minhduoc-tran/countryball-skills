import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { breathe } from '../../countryball/ball-motion';
import { MuCoi } from '../../countryball/ball-accessories';
import { Beret } from '../../countryball/ball-accessories-military';
import { Glow } from '../../countryball/fx-glow';
import { Cap, GPhoto, INK, NameCard, ParaCard, Stage, Tag, easeOut, prog } from './chg-common';
import { Person } from './chd-icons';

// Chapter G, part 1 (7:56-8:09, beat "10 inside"): inside the Dinh. The exchange has several versions: PARAPHRASE cards only (no quotes, "tóm ý").
// G1 the cabinet room (print 2008) + names, G2 waiting to hand over, G3 the answer (old government has collapsed), G4 unconditional surrender.
// Both sides calm and dignified: the RVN ball resigned, the VNM ball steady, nobody gloating. Sound: quiet room tone only.

/** G1 "Bên trong Dinh, Tổng thống Dương Văn Minh cùng nội các vẫn đang chờ." */
export const G1: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g1" tone="navy" />
    <GPhoto k="cabinet" t={t} x={640} y={470} w={880} rot={-2} from={0.05} fromSide="left" kb={{ z0: 1.0, z1: 1.12, px0: 0.02, py0: 0.01, px1: -0.02, py1: 0 }} />
    <Cap t={t} at={6} x={1440} y={250} text="BÊN TRONG DINH" size={64} />
    <NameCard t={t} at={22} x={1440} y={470} name="DƯƠNG VĂN MINH" sub="Tổng thống, cùng nội các" w={780} />
    <Cap t={t} at={52} x={1440} y={700} text="VẪN ĐANG CHỜ" size={70} color="#FFE08A" />
  </g>
);

/** G2 "Ông Minh nói rằng họ chờ để bàn giao chính quyền." silhouettes around a table, a document waits to be handed over. */
export const G2: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 30, 70)), glow = 0.3 + 0.1 * Math.sin(t / 10);
  return (
    <g>
      <Stage id="g2" tone="dusk" dim={0.3} />
      <Glow x={960} y={560} r={420} color="#FFD27A" o={glow} />
      {[-4, -2, 0, 2, 4].map((q, i) => <Person key={q} x={960 + q * 150} y={690} s={3.5 + (q === 0 ? 0.3 : 0)} color={q === 0 ? '#2A3650' : '#141A24'} lean={Math.sin(t / 40 + i) * 1.2} />)}
      <rect x={400} y={684} width={1120} height={40} rx={8} fill="#3A2A1C" stroke={INK} strokeWidth={5} />
      <rect x={450} y={724} width={1020} height={170} fill="#2A1E14" stroke={INK} strokeWidth={5} />
      <g transform={`translate(${960 + 300 * k},${676 - 14 * Math.sin(k * Math.PI)}) rotate(${-4 + 6 * k})`}>
        <rect x={-70} y={-24} width={140} height={24} rx={3} fill="#F6F0DC" stroke={INK} strokeWidth={3} />
        {[-46, -28, -10].map((x) => <line key={x} x1={x} y1={-15} x2={x + 40} y2={-15} stroke="#8A7F66" strokeWidth={2.4} />)}
      </g>
      <rect x={1160} y={668} width={160} height={14} rx={4} fill="none" stroke="#FFE9B0" strokeWidth={3} strokeDasharray="10 8" opacity={0.8 * (1 - k)} />
      <Cap t={t} at={6} x={960} y={190} text="CHỜ BÀN GIAO" size={92} />
      <Cap t={t} at={22} x={960} y={290} text="CHÍNH QUYỀN" size={60} color="#FFE08A" />
      <Tag t={t} at={40} x={960} y={970} text="Tóm ý lời đối đáp, không phải nguyên văn" fill="#2F3E58" size={32} />
    </g>
  );
};

/** G3 "Phía Quân Giải phóng trả lời rằng chính quyền cũ đã sụp đổ hoàn toàn," the answer: a gist card, the VNM ball steady (not triumphant). */
export const G3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g3" tone="navy" dim={0.1} />
    {[0, 1, 2, 3].map((i) => <Person key={i} x={170 + i * 110} y={800} s={3.4} color="#3B4A63" lean={Math.sin(t / 44 + i) * 1.2} />)}
    <rect x={90} y={790} width={500} height={34} rx={8} fill="#3A2A1C" stroke={INK} strokeWidth={5} />
    <Ball id="g3b" x={1520} y={700} r={150} flag="VNM" eyes="normal" hat={<MuCoi />} tilt={3} motion={breathe(t, 90, 0.02)} t={t} />
    <ParaCard t={t} at={8} x={1090} y={400} w={980} lines={['CHÍNH QUYỀN CŨ ĐÃ', 'SỤP ĐỔ HOÀN TOÀN']} size={66} />
    <Tag t={t} at={34} x={1400} y={960} text="Phía Quân Giải phóng trả lời" fill="#9B4C3A" size={34} />
  </g>
);

/** G4 "và điều duy nhất còn lại là đầu hàng vô điều kiện." the gist: unconditional surrender; the RVN ball resigned, eyes down. */
export const G4: React.FC<ShotProps> = ({ t }) => {
  const d = easeOut(prog(t, 40, 80));
  return (
    <g>
      <Stage id="g4" tone="night" dim={0.12} />
      <Ball id="g4a" x={380} y={760} r={140} flag="RVN" eyes="sad" hat={<Beret badge="none" />} tilt={-6 - 4 * d} motion={breathe(t, 110, 0.015)} t={t} />
      <Ball id="g4b" x={1540} y={760} r={140} flag="VNM" eyes="normal" hat={<MuCoi />} tilt={4} motion={breathe(t, 96, 0.015, 20)} t={t} />
      <ParaCard t={t} at={4} x={960} y={400} w={900} lines={['ĐẦU HÀNG', 'VÔ ĐIỀU KIỆN']} size={86} accent="#2F3E58" />
      <Cap t={t} at={30} x={960} y={860} text="ĐIỀU DUY NHẤT CÒN LẠI" size={50} color="#FFE08A" />
    </g>
  );
};
