import React from 'react';
import { ShotProps } from '../../engine';
import { FrontArrow } from '../../countryball/ground-front-arrows';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { Backdrop, CAM, CMap, drift, GOLD, MapHud, P, RED, ROUTE7, sec, Txt, Vignette, YEL, ramp } from './chb-common';
import { FlagPop, LLArrow, LLColumn, LLRoad, Pin } from './chb-map-bits';
import { DocCard, NameCard } from './chb-cards';
import { VehKind } from './chb-icons';

// Chapter B, beats "3 tay nguyen" (B1-B7, 83.07-103.10 s): early March 1975, Buôn Ma Thuột attacked 10.03 and taken 11.03 (map arrows,
// flag RVN -> PRG), Thiệu's order to leave the Tây Nguyên (name card + yellow arrows to the coast), the retreat on route 7 (Pleiku ->
// Phú Bổn -> Củng Sơn -> Tuy Hòa): a long column of tiny vehicles, then soldiers and civilians together on one narrow road.
// Red = Quân Giải phóng, yellow = VNCH. No rain is drawn (the weather is not in the sources): the dark mood is a dim "overcast" grade.

const CMH = 'Ảnh: Cao Văn Viên, The Final Collapse, U.S. Army CMH / Public domain';

// ---------- B1: Tây Nguyên, early March ----------
export const B1: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 107.6, lat: 14.9, zoom: 150 }, CAM.tayNguyen, 3);
  return (
    <g>
      <CMap cam={cam} id="b1m">
        <Pin at={P.pleiku} label="Pleiku" size={30} from={1.4} s={s} />
        <Pin at={P.bmt} label="Buôn Ma Thuột" size={34} ring={RED} t={t} from={1.0} s={s} />
      </CMap>
      <Txt x={1380} y={200} text="TÂY NGUYÊN" size={124} o={ramp(s, 0.2, 0.6)} />
      <Txt x={1380} y={290} text="ĐÒN ĐÁNH LỚN BẮT ĐẦU" size={54} color={GOLD} o={ramp(s, 1.2, 1.6)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '03.1975' }]} />
    </g>
  );
};

// ---------- B2: 10.03.1975, the attack on Buôn Ma Thuột ----------
export const B2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, CAM.tayNguyen, { ...CAM.bmt, zoom: 900 }, 2.2);
  const from: [number, number][][] = [[[107.45, 13.0], [107.75, 12.85], P.bmt], [[107.7, 13.35], [107.9, 13.0], P.bmt], [[107.6, 12.2], [107.85, 12.45], P.bmt]];
  return (
    <g>
      <CMap cam={cam} id="b2m">
        {from.map((pts, i) => <LLArrow key={i} id={`b2a${i}`} t={t} t0={30 + i * 14} pts={pts} color={RED} width={42} dur={44} />)}
        <Pin at={P.bmt} label="Buôn Ma Thuột" size={36} anchor="r" ring={RED} t={t} from={0.2} s={s} />
      </CMap>
      <Txt x={1360} y={210} text="10 THÁNG 3" size={128} o={ramp(s, 0.3, 0.7)} />
      <Txt x={1360} y={300} text="TẤN CÔNG THỊ XÃ" size={60} color={GOLD} o={ramp(s, 1.2, 1.6)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '10.03.1975' }]} />
    </g>
  );
};

// ---------- B3: 11.03, the town changes hands (flag RVN -> PRG) + archive map ----------
export const B3: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { ...CAM.bmt, lon: 108.42 }, { ...CAM.bmt, lon: 108.47, zoom: 1180 }, 2.8);
  return (
    <g>
      <CMap cam={cam} id="b3m">
        <FlagPop at={P.bmt} kind="PRG" before="RVN" s={s} from={0.9} t={t} size={150} id="b3f" />
        <Pin at={P.bmt} label="Buôn Ma Thuột" size={34} anchor="b" from={0} s={s} />
      </CMap>
      <DocCard id="b3d" src="dinh-doc-lap-30-4/img/ban-do-buon-ma-thuot-3-1975.jpg" imgW={1920} imgH={1013} crop={[0, 0, 1280, 1013]} x={1420} y={450} w={600} h={475}
        caption="bản đồ tư liệu: Buôn Ma Thuột" credit={CMH} s={s} at={0.2} rot={2} />
      <Txt x={760} y={215} text="CHỈ HƠN MỘT NGÀY SAU" size={50} color={GOLD} o={ramp(s, 0.1, 0.4)} />
      <Txt x={760} y={360} text="ĐỔI CHỦ" size={118} o={ramp(s, 1.0, 1.3)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '10.03.1975' }, { t: 0.5, label: '11.03.1975' }]} />
    </g>
  );
};

// ---------- B4: Thiệu's order (name card) ----------
export const B4: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b4" />
      <NameCard id="b4n" x={960} y={330} rank="Tổng thống" name="Nguyễn Văn Thiệu" sub="Việt Nam Cộng hòa" s={s} at={0.1} />
      <Txt x={960} y={640} text="QUYẾT ĐỊNH RÚT QUÂN" size={96} o={ramp(s, 0.7, 1.0)} />
      <Txt x={960} y={750} text="KHỎI TÂY NGUYÊN" size={96} color={YEL} o={ramp(s, 1.1, 1.4)} />
      <FrontArrow id="b4a" t={t} t0={40} points={[[360, 900], [960, 905], [1560, 900]]} color={YEL} width={56} dur={32} />
      <Vignette id="b4" o={0.45} />
    </g>
  );
};

// ---------- B5: to keep the coastal areas ----------
export const B5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, CAM.tayNguyen, { ...CAM.tayNguyen, lon: 108.75, zoom: 370 }, 2.0);
  return (
    <g>
      <CMap cam={cam} id="b5m">
        <LLArrow id="b5a" t={t} t0={8} pts={[P.pleiku, [108.45, 13.65], [108.95, 13.3], P.tuyHoa]} color={YEL} width={44} dur={46} label="RÚT QUÂN" />
        {[['quyNhon', 'Quy Nhơn'], ['tuyHoa', 'Tuy Hòa'], ['nhaTrang', 'Nha Trang']].map(([k, n], i) => (
          <Pin key={k} at={P[k]} label={n} size={28} anchor="r" ring={YEL} t={t + i * 15} from={0.7 + i * 0.15} s={s} />
        ))}
        <Pin at={P.pleiku} label="Pleiku" size={28} from={0} s={s} />
      </CMap>
      <Txt x={560} y={900} text="GIỮ NHỮNG VÙNG GẦN BIỂN" size={70} color={YEL} o={ramp(s, 0.5, 0.9)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '03.1975' }]} />
    </g>
  );
};

const COLUMN: VehKind[] = ['truck', 'civ', 'jeep', 'cart', 'truck', 'bike', 'civ', 'truck'];

// ---------- B6: the retreat on route 7 ----------
export const B6: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 108.6, lat: 13.45, zoom: 640 }, { lon: 108.62, lat: 13.38, zoom: 700 }, 2.6);
  return (
    <g>
      <CMap cam={cam} id="b6m" night={0.32}>
        <LLRoad pts={ROUTE7} color="#E8DCC0" k={ramp(s, 0, 0.7)} w={9} />
        <LLColumn id="b6c" t={t} pts={ROUTE7} kinds={COLUMN} n={34} gap={28} speed={1.4} size={22} wobble={4} start={960} />
        <Pin at={P.pleiku} label="Pleiku" size={28} s={s} />
        <Pin at={P.cheoReo} label="Phú Bổn" size={26} anchor="l" s={s} from={0.5} />
        <Pin at={P.cungSon} label="Củng Sơn" size={26} anchor="b" s={s} from={0.7} />
        <Pin at={P.tuyHoa} label="Tuy Hòa" size={28} s={s} from={0.9} />
      </CMap>
      <Txt x={1400} y={200} text="ĐƯỜNG SỐ 7" size={116} o={ramp(s, 0.2, 0.5)} />
      <Txt x={1400} y={286} text="CUỘC RÚT LUI" size={60} color={YEL} o={ramp(s, 0.9, 1.2)} />
      <Vignette id="b6" o={0.5} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '03.1975' }]} />
    </g>
  );
};

// ---------- B7: soldiers and civilians on one narrow road ----------
const WIDE: [number, number][] = [[108.3, 13.52], [108.45, 13.4], [108.62, 13.28], [108.8, 13.16], [108.98, 13.05]];
export const B7: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 108.66, lat: 13.3, zoom: 4500 }, { lon: 108.73, lat: 13.24, zoom: 4500 }, 3.7);
  return (
    <g>
      <CMap cam={cam} id="b7m" night={0.32}>
        <LLRoad pts={WIDE} color="#E8DCC0" w={26} />
        <LLColumn id="b7a" t={t} pts={WIDE} kinds={COLUMN} n={44} gap={44} speed={0.55} size={32} wobble={9} start={2850} />
      </CMap>
      <Vignette id="b7" o={0.55} />
      <g opacity={ramp(s, 0.3, 0.6)}>
        <rect x={60} y={800} width={360} height={130} rx={18} fill="#15202D" stroke={GOLD} strokeWidth={4} opacity={0.92} />
        <rect x={84} y={826} width={34} height={22} rx={5} fill="#6B7440" stroke="#151515" strokeWidth={3} />
        <Txt x={134} y={846} text="BINH LÍNH" size={34} anchor="start" stroke="none" />
        <rect x={84} y={876} width={34} height={22} rx={5} fill="#D9D2C2" stroke="#151515" strokeWidth={3} />
        <Txt x={134} y={896} text="DÂN THƯỜNG" size={34} anchor="start" stroke="none" />
      </g>
      <Txt x={1360} y={190} text="MỘT CON ĐƯỜNG HẸP" size={84} o={ramp(s, 2.3, 2.7)} />
      <DateChip dates={[{ t: 0, label: '03.1975' }]} t={s} id="hud-date" />
      <MiniMap camera={cam} />
    </g>
  );
};
