import React from 'react';
import { ShotProps } from '../../engine';
import { TankSide } from '../../countryball/ground-tanks';
import { Glow } from '../../countryball/fx-glow';
import { Cap, GoldPlaque, MuseumIcon, Photo, Stage, Tag, easeOut, prog } from './chh-common';

// Chapter H, part 2 (9:46-10:05, beat "12b tanks today"): H7 hai chiếc xe tăng 390 + 843, H8 bảo vật quốc gia (QĐ 1426/QĐ-TTg, 01.10.2012),
// H9 843 original in the Hà Nội museum, H10 390 original in the Tăng-Thiết giáp museum, H11 the same-type tanks in the palace yard (captioned so),
// H12 close-up of the 390-type tank "như đang dừng lại ở buổi trưa năm ấy". Facts: only the ones in science / the words file.

const GROUND = (id: string, y: number, color = '#2C3A33') => (
  <g><rect y={y} width={1920} height={1080 - y} fill={color} /><rect y={y} width={1920} height={8} fill="#000" opacity={0.25} /></g>
);

/** Two tank sprites on a ground line, sliding in from the left; 390 (Type 59) and 843 (T-54B). */
const TankPair: React.FC<{ t: number; y: number; size: number; x0?: number; x1?: number; gapX?: number; at?: number; id: string }> = ({ t, y, size, x0 = 520, x1 = 1400, at = 0, id }) => {
  const k1 = easeOut((t - at) / 22), k2 = easeOut((t - at - 8) / 22), wob = (n: number) => Math.sin(t / 5 + n) * 1.2 * (1 - Math.min(k1, k2));
  return (
    <g>
      <TankSide id={`${id}a`} x={x0 - (1 - k1) * 900} y={y + wob(0)} size={size} kind="type59" num="390" />
      <TankSide id={`${id}b`} x={x1 - (1 - k2) * 1000} y={y + wob(2)} size={size} kind="t54" num="843" />
    </g>
  );
};

/** H7 "Hai chiếc xe tăng 390 và 843" */
export const H7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h7" tone="dusk" />
    {GROUND('h7', 780)}
    <TankPair t={t} y={790} size={600} x0={470} x1={1330} id="h7" />
    <Cap t={t} at={6} x={960} y={190} text="HAI CHIẾC XE TĂNG" size={100} />
    <Cap t={t} at={30} x={470} y={950} text="390" size={150} color="#FFE08A" />
    <Cap t={t} at={42} x={1330} y={950} text="843" size={150} color="#FFE08A" />
  </g>
);

/** H8 "đã được công nhận là bảo vật quốc gia vào năm 2012." plaque with the decision + both tanks under it. */
export const H8: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 40, 62));
  return (
    <g>
      <Stage id="h8" tone="navy" />
      {GROUND('h8', 840, '#1E2A36')}
      <GoldPlaque t={t} a={6} x={960} y={400} w={1500} lines={[{ text: 'BẢO VẬT QUỐC GIA', size: 112, fill: '#FFD27A' }, { text: 'Quyết định 1426/QĐ-TTg, 01.10.2012', size: 58 }]} />
      <g opacity={k}><TankPair t={t} y={960} size={470} x0={520} x1={1400} at={36} id="h8" /></g>
      <Glow x={960} y={400} r={520} color="#FFD27A" o={0.14 + 0.06 * Math.sin(t / 9)} />
    </g>
  );
};

/** H9 "Xe 843 hiện ở Bảo tàng Lịch sử Quân sự Việt Nam," two prints: the tank, then the museum building. */
export const H9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h9" tone="navy" />
    <Photo k="t843hn" t={t} x={540} y={500} w={900} rot={-2} from={0.05} fromSide="left" kb={{ z0: 1.0, z1: 1.12, px0: 0.02, py0: 0, px1: -0.02, py1: 0 }} />
    <Photo k="museum" t={t} x={1480} y={720} w={780} rot={2} from={1.5} fromSide="right" kb={{ z0: 1.0, z1: 1.08, px0: 0.02, py0: 0, px1: -0.02, py1: 0 }} />
    <Cap t={t} at={4} x={960} y={118} text="XE 843 NGUYÊN BẢN" size={76} color="#FFE08A" />
  </g>
);

/** H10 "xe 390 ở Bảo tàng Tăng thiết giáp." tank 390 drives to a museum building. */
export const H10: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(t / 26);
  return (
    <g>
      <Stage id="h10" tone="dusk" />
      {GROUND('h10', 800)}
      <MuseumIcon x={1450} y={808} w={520} />
      <TankSide id="h10a" x={560 - (1 - k) * 800} y={806} size={560} kind="type59" num="390" />
      <Cap t={t} at={4} x={960} y={150} text="XE 390 NGUYÊN BẢN" size={76} color="#FFE08A" />
      <Cap t={t} at={22} x={960} y={950} text="Bảo tàng Lực lượng Tăng-Thiết giáp" size={64} />
    </g>
  );
};

/** H11 "Còn trong sân Dinh, hai chiếc xe cùng loại vẫn đứng đó," the two same-type tanks on display at the palace. */
export const H11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h11" tone="dusk" />
    <Photo k="t390" t={t} x={520} y={560} w={800} rot={-2} from={0.05} fromSide="left" kb={{ z0: 1.0, z1: 1.1, px0: 0.02, py0: 0, px1: -0.02, py1: 0 }} />
    <Photo k="t843" t={t} x={1390} y={580} w={680} rot={2} from={1.1} fromSide="right" kb={{ z0: 1.0, z1: 1.1, px0: -0.02, py0: 0, px1: 0.02, py1: 0 }} />
    <Cap t={t} at={4} x={960} y={118} text="TRONG SÂN DINH" size={76} />
  </g>
);

/** H12 "như đang dừng lại ở buổi trưa năm ấy." slow close-up of the displayed 390-type tank, warm light, nothing else moves. */
export const H12: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h12" tone="dusk" />
    <Glow x={960} y={540} r={760} color="#FFC46B" o={0.22} />
    <Photo k="t390close" t={t} x={960} y={540} w={1020} rot={0.8} from={0.03} fromSide="bottom" kb={{ z0: 1.0, z1: 1.16, px0: 0.01, py0: 0, px1: -0.02, py1: -0.01 }} />
    <Tag t={t} at={10} x={330} y={190} text="XE CÙNG LOẠI" fill="#7A5A2A" size={46} />
  </g>
);
