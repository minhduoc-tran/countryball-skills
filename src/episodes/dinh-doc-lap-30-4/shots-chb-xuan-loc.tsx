import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, mixMotion, talk } from '../../countryball/ball-motion';
import { Candle } from '../../countryball/ground-memorial-props';
import { ArtilleryBattery } from '../../countryball/ground-artillery';
import { ShellArc } from '../../countryball/ground-artillery';
import { SIDE_COLORS, TrenchLine, UnitBox } from '../../countryball/ground-front-arrows';
import { DocCard, NameCard } from './chb-cards';
import { Backdrop, CMap, drift, GOLD, MapHud, P, QL1, RED, sec, Txt, Vignette, XL, YEL, ramp } from './chb-common';
import { At, LLArrow, LLRoad, MapChip, Pin, SteelDoor } from './chb-map-bits';
import { SaigonLabels } from '../../countryball/sai-gon-map-labels';

// Chapter B, beats "4 xuan loc" + "4b xuan loc falls" (B16-B25, 127.90-152.54 s): Xuân Lộc = "cánh cửa thép" on the way to Sài Gòn
// (QL1, khoảng 80 km), Sư đoàn 18 + chuẩn tướng Lê Minh Đảo (RVN ball, determined), artillery both ways, the last big battle (CMH map card),
// both sides pay a heavy price (quiet candles), the night 20 -> 21.04 the RVN forces leave, the door opens. Dates only as narrated / in `science`.

const CMH = 'Ảnh: Cao Văn Viên, The Final Collapse, U.S. Army CMH / Public domain';
const XL_DATE = (a: string, b?: string, at = 1.5) => [{ t: 0, label: a }, ...(b ? [{ t: at, label: b }] : [])];

/** Small place name above a unit box. */
const Tag: React.FC<{ x: number; y: number; text: string; o?: number }> = ({ x, y, text, o = 1 }) => <Txt x={x} y={y - 78} text={text} size={30} o={o} />;

// ---------- B16: a steel door on the way to Sài Gòn ----------
export const B16: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, XL.eastWide, XL.east, 2.6);
  return (
    <g>
      <CMap cam={cam} id="b16m">
        <SaigonLabels regions={false} rivers={false} />
        <LLArrow id="b16a" t={t} t0={8} pts={[[107.55, 11.2], [107.4, 11.08], [107.28, 10.98]]} color={RED} width={34} dur={40} />
        <Pin at={P.saigon} label="Sài Gòn" size={30} anchor="r" s={s} />
        <SteelDoor at={P.xuanLoc} w={260} open={0} />
        <Pin at={P.xuanLoc} label="Xuân Lộc" size={32} anchor="b" s={s} />
      </CMap>
      <Txt x={820} y={200} text="CÁNH CỬA THÉP" size={104} o={ramp(s, 0.4, 0.8)} />
      <MapHud s={s} cam={cam} />
    </g>
  );
};

// ---------- B17: about 80 km from the city ----------
export const B17: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, XL.east, { lon: 106.9, lat: 10.88, zoom: 1740 }, 3.0);
  return (
    <g>
      <CMap cam={cam} id="b17m">
        <SaigonLabels regions={false} rivers={false} />
        <LLRoad pts={QL1} color="#FFFFFF" k={1} w={7} dash="16 14" />
        <MapChip at={[106.95, 10.95]} text="KHOẢNG 80 KM" dy={-50} size={40} s={s} from={0.9} />
        <Pin at={P.saigon} label="Sài Gòn" size={32} anchor="r" ring={RED} t={t} s={s} />
        <SteelDoor at={P.xuanLoc} w={150} open={0} />
        <Pin at={P.xuanLoc} label="Xuân Lộc" size={32} anchor="b" ring={YEL} t={t} s={s} />
      </CMap>
      <Txt x={1000} y={190} text="XUÂN LỘC" size={116} o={ramp(s, 0.2, 0.55)} />
      <Txt x={1000} y={268} text="CÁCH SÀI GÒN KHOẢNG 80 KM" size={44} color={GOLD} o={ramp(s, 0.9, 1.3)} />
      <MapHud s={s} cam={cam} />
    </g>
  );
};

// ---------- B18: the 18th Division (RVN) holds the town ----------
export const B18: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { ...XL.town, zoom: 5200 }, XL.town, 2.8);
  return (
    <g>
      <CMap cam={cam} id="b18m">
        <SaigonLabels regions={false} rivers={false} />
        <At at={P.xuanLoc}>{(x, y) => {
          const ring = Array.from({ length: 9 }, (_, i) => { const a = (-70 + i * 17) * Math.PI / 180; return [x + Math.cos(a) * 230 * 1.1, y + Math.sin(a) * 230] as [number, number]; });
          return (<>
            <TrenchLine id="b18tr" t={t} t0={14} points={ring} style="triangles" color={SIDE_COLORS.rvn} dur={40} side={-1} step={34} />
            <UnitBox x={x} y={y} kind="inf" color={SIDE_COLORS.rvn} size={96} label="SƯ ĐOÀN 18" /><Tag x={x} y={y} text="Xuân Lộc" />
          </>);
        }}</At>
      </CMap>
      <Ball id="b18b" x={1400} y={720} r={96} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={mixMotion(breathe(t, 60, 0.035))} />
      <Txt x={1400} y={190} text="SƯ ĐOÀN 18" size={104} color={YEL} o={ramp(s, 0.2, 0.55)} />
      <Txt x={1400} y={270} text="QUÂN ĐỘI SÀI GÒN" size={50} o={ramp(s, 0.7, 1.05)} />
      <MapHud s={s} cam={cam} />
    </g>
  );
};

// ---------- B19: chuẩn tướng Lê Minh Đảo (name card) ----------
export const B19: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b19" />
      <NameCard id="b19n" x={960} y={330} rank="Chuẩn tướng" name="Lê Minh Đảo" sub="Chỉ huy Sư đoàn 18" s={s} at={0.1} />
      <Ball id="b19b" x={620} y={800} r={120} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={mixMotion(breathe(t, 62, 0.035), talk(t, true, 0.5))} />
      <g transform="translate(1160,790)"><UnitBox x={0} y={0} kind="inf" color={SIDE_COLORS.rvn} size={130} label="SƯ ĐOÀN 18" /></g>
      <Vignette id="b19" o={0.45} />
    </g>
  );
};

// ---------- B20: fierce resistance, guns both ways (09.04 -> 20.04) ----------
export const B20: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { ...XL.town, zoom: 5000 }, { ...XL.town, zoom: 5300 }, 2.6);
  const redFrom: [number, number] = [380, 250], yelFrom: [number, number] = [1500, 800];
  return (
    <g>
      <CMap cam={cam} id="b20m">
        <At at={P.xuanLoc}>{(x, y) => (<>
          <ArtilleryBattery id="b20r" t={t} t0={0} x={redFrom[0]} y={redFrom[1]} aim={25} n={3} gap={80} period={40} s={58} tone="vn" />
          <ArtilleryBattery id="b20y" t={t} t0={8} x={yelFrom[0]} y={yelFrom[1]} aim={205} n={3} gap={80} period={44} s={58} tone="us" seed={5} />
          {[0, 1, 2, 3, 4].map((i) => <ShellArc key={`r${i}`} t={t} t0={6 + i * 18} from={redFrom} to={[x - 40 + i * 14, y + 10 - i * 12]} dur={34} lift={120} r={30} color="#FF8A66" />)}
          {[0, 1, 2, 3, 4].map((i) => <ShellArc key={`y${i}`} t={t} t0={16 + i * 18} from={yelFrom} to={[x - 330 + i * 30, y - 190 + i * 14]} dur={34} lift={120} r={30} color="#F2C230" />)}
          <UnitBox x={x} y={y} kind="inf" color={SIDE_COLORS.rvn} size={70} />
        </>)}</At>
      </CMap>
      <Ball id="b20b" x={1250} y={640} r={78} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={breathe(t, 50, 0.04)} />
      <Txt x={1400} y={190} text="CHỐNG TRẢ QUYẾT LIỆT" size={76} o={ramp(s, 0.2, 0.55)} />
      <Txt x={1400} y={270} text="GẦN HAI TUẦN" size={64} color={GOLD} o={ramp(s, 1.0, 1.4)} />
      <MapHud s={s} cam={cam} dates={XL_DATE('09.04.1975', '20.04.1975', 0.4)} />
    </g>
  );
};

// ---------- B21: the last big battle (archive map card, legend cropped out) ----------
export const B21: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b21" />
      <DocCard id="b21d" src="dinh-doc-lap-30-4/img/ban-do-xuan-loc-4-1975.jpg" imgW={1320} imgH={1340} crop={[0, 0, 1320, 790]} x={620} y={520} w={860} h={515}
        caption="bản đồ tư liệu: Xuân Lộc" credit={CMH} s={s} at={0.1} rot={-2.5} />
      <Txt x={1440} y={380} text="TRẬN ĐÁNH LỚN" size={88} o={ramp(s, 0.5, 0.85)} />
      <Txt x={1440} y={490} text="CUỐI CÙNG" size={112} color={GOLD} o={ramp(s, 0.8, 1.1)} />
      <Txt x={1440} y={580} text="CỦA CUỘC CHIẾN" size={52} o={ramp(s, 1.3, 1.65)} />
      <Vignette id="b21" o={0.45} />
    </g>
  );
};

// ---------- B22: both sides paid dearly (quiet: two sad balls, candles) ----------
export const B22: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b22" top="#101A28" bottom="#05080E" />
      <Txt x={960} y={170} text="HAI BÊN ĐỀU CHỊU" size={82} o={ramp(s, 0.1, 0.5)} />
      <Txt x={960} y={262} text="TỔN THẤT NẶNG NỀ" size={82} color={GOLD} o={ramp(s, 0.5, 0.9)} />
      <Ball id="b22r" x={640} y={640} r={150} flag="RVN" eyes="sad" look={0.6} hat={<M1Helmet />} motion={breathe(t, 90, 0.025)} />
      <Ball id="b22v" x={1280} y={640} r={150} flag="VNM" eyes="sad" look={-0.6} hat={<MuCoi />} motion={breathe(t, 90, 0.025, 20)} />
      <Candle x={960} y={800} s={170} t={t} seed={1} />
      <Candle x={870} y={812} s={110} t={t} seed={3} />
      <Candle x={1050} y={812} s={110} t={t} seed={7} />
      <Vignette id="b22" o={0.7} />
    </g>
  );
};

// ---------- B23: night 20 -> 21.04 ----------
export const B23: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { ...XL.town, zoom: 3600 }, { ...XL.town, zoom: 4200, lon: 107.23 }, 2.5);
  return (
    <g>
      <CMap cam={cam} id="b23m" night={0.88}>
        <SaigonLabels regions={false} rivers={false} />
        <At at={P.xuanLoc}>{(x, y) => <><UnitBox x={x} y={y} kind="inf" color={SIDE_COLORS.rvn} size={70} /><Tag x={x} y={y} text="Xuân Lộc" /></>}</At>
      </CMap>
      <g transform={`translate(${1560 - 40 * ramp(s, 0, 2.5)},${240 + 14 * ramp(s, 0, 2.5)})`}>
        <path d="M-6,-72 A72,72 0 1 0 62,38 A58,58 0 1 1 -6,-72 Z" fill="#F3EBC8" stroke="#151515" strokeWidth={7} strokeLinejoin="round" />
      </g>
      <Txt x={1360} y={760} text="ĐÊM 20 THÁNG 4" size={88} o={ramp(s, 0.1, 0.5)} />
      <Txt x={1360} y={860} text="RẠNG SÁNG 21" size={88} color={GOLD} o={ramp(s, 1.3, 1.7)} />
      <Vignette id="b23" o={0.6} />
      <MapHud s={s} cam={cam} dates={XL_DATE('20.04.1975', '21.04.1975', 1.4)} />
    </g>
  );
};

// ---------- B24: the VNCH forces leave Xuân Lộc ----------
export const B24: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { ...XL.town, zoom: 3600, lon: 107.23 }, { ...XL.town, zoom: 3000, lon: 107.2, lat: 10.9 }, 2.2);
  return (
    <g>
      <CMap cam={cam} id="b24m" night={0.8}>
        <SaigonLabels regions={false} rivers={false} />
        <At at={P.xuanLoc}>{(x, y) => <><UnitBox x={x} y={y} kind="inf" color={SIDE_COLORS.rvn} size={60} /><Tag x={x} y={y + 6} text="Xuân Lộc" /></>}</At>
        <LLArrow id="b24a" t={t} t0={6} pts={[P.xuanLoc, [107.21, 10.89], [107.16, 10.83], [107.11, 10.78]]} color={SIDE_COLORS.rvn} width={42} dur={46} />
      </CMap>
      <Ball id="b24b" x={360} y={800} r={90} flag="RVN" eyes="worried" hat={<M1Helmet />} motion={breathe(t, 70, 0.03)} />
      <Txt x={1380} y={200} text="RÚT KHỎI" size={96} o={ramp(s, 0.2, 0.55)} />
      <Txt x={1380} y={300} text="XUÂN LỘC" size={112} color={YEL} o={ramp(s, 0.5, 0.85)} />
      <Vignette id="b24" o={0.55} />
      <MapHud s={s} cam={cam} dates={XL_DATE('21.04.1975')} />
    </g>
  );
};

// ---------- B25: the east door of Sài Gòn is open ----------
export const B25: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, XL.east, { lon: 106.9, lat: 10.88, zoom: 1760 }, 2.1);
  return (
    <g>
      <CMap cam={cam} id="b25m" night={0.4 * (1 - ramp(s, 0, 1.2))}>
        <SaigonLabels regions={false} rivers={false} />
        <LLArrow id="b25a" t={t} t0={26} pts={QL1} color={RED} width={34} dur={50} />
        <Pin at={P.saigon} label="Sài Gòn" size={30} anchor="r" s={s} />
        <SteelDoor at={P.xuanLoc} w={260} open={ramp(s, 0.3, 1.1)} />
        <Pin at={P.xuanLoc} label="Xuân Lộc" size={30} anchor="b" s={s} />
      </CMap>
      <Txt x={800} y={190} text="CÁNH CỬA" size={96} o={ramp(s, 0.2, 0.55)} />
      <Txt x={800} y={290} text="PHÍA ĐÔNG ĐÃ MỞ" size={84} color={GOLD} o={ramp(s, 0.7, 1.1)} />
      <MapHud s={s} cam={cam} dates={XL_DATE('21.04.1975')} />
    </g>
  );
};
