import React from 'react';
import { ShotProps } from '../../engine';
import { TrenchLine, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { project } from '../../countryball/geo-camera';
import { Backdrop, CMap, COAST, drift, GOLD, MapHud, P, Pop, RED, ramp, sec, Txt, Vignette } from './chb-common';
import { FlagPop, LLArrow, LLColumn, LLRoad, Pin } from './chb-map-bits';
import { JeepSide, ShipSide, TruckSide } from './chb-icons';

// Chapter B, beat "4b2 phan rang" (B26-B30, 152.54-167.69 s): at the same time on the central coast the Phan Rang line is broken
// (16.04.1975), the main divisions march south day and night "bằng mọi phương tiện" (trucks, captured vehicles, ships) and converge
// on Sài Gòn. Red = Quân Giải phóng, yellow = VNCH. Truck / jeep / ship are generic icons (no unit numbers, no counts).

// ---------- B26: meanwhile on the central coast ----------
export const B26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 108.9, lat: 13.2, zoom: 300 }, { lon: 108.9, lat: 12.2, zoom: 520 }, 2.2);
  return (
    <g>
      <CMap cam={cam} id="b26m">
        <Pin at={P.nhaTrang} label="Nha Trang" size={28} from={0.4} s={s} />
        <Pin at={P.phanRang} label="Phan Rang" size={34} ring={RED} t={t} from={0.8} s={s} />
      </CMap>
      <Txt x={1360} y={190} text="CÙNG THỜI GIAN ĐÓ" size={80} o={ramp(s, 0.1, 0.45)} />
      <Txt x={1360} y={280} text="VEN BIỂN MIỀN TRUNG" size={62} color={GOLD} o={ramp(s, 0.7, 1.1)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '04.1975' }]} />
    </g>
  );
};

// ---------- B27: the Phan Rang defence line is broken, 16.04 ----------
export const B27: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 108.95, lat: 11.8, zoom: 900 }, { lon: 108.95, lat: 11.75, zoom: 1200 }, 2.0);
  const broken = s >= 1.9, L = (lon: number, lat: number) => project(cam, lon, lat);
  return (
    <g>
      <CMap cam={cam} id="b27m">
        {broken
          ? <><TrenchLine id="b27l" t={t} t0={0} points={[L(108.55, 11.79), L(108.8, 11.8), L(108.95, 11.8)]} style="triangles" color={SIDE_COLORS.rvn} dur={1} side={-1} step={30} />
            <TrenchLine id="b27r" t={t} t0={0} points={[L(109.06, 11.8), L(109.25, 11.79)]} style="triangles" color={SIDE_COLORS.rvn} dur={1} side={-1} step={30} /></>
          : <TrenchLine id="b27f" t={t} t0={4} points={[L(108.55, 11.79), L(108.8, 11.8), L(109.0, 11.8), L(109.25, 11.79)]} style="triangles" color={SIDE_COLORS.rvn} dur={34} side={-1} step={30} />}
        <LLArrow id="b27a" t={t} t0={40} pts={[[108.98, 12.2], [108.97, 11.95], [108.99, 11.62]]} color={RED} width={42} dur={40} />
        <FlagPop at={P.phanRang} kind="PRG" s={s} from={2.7} t={t} size={110} id="b27f" />
        <Pin at={P.phanRang} label="Phan Rang" size={34} anchor="r" s={s} />
      </CMap>
      <Txt x={1380} y={190} text="TUYẾN PHÒNG THỦ" size={72} o={ramp(s, 0.2, 0.5)} />
      <Txt x={1380} y={272} text="PHAN RANG" size={84} color={GOLD} o={ramp(s, 0.5, 0.8)} />
      <Txt x={1380} y={366} text="BỊ CHỌC THỦNG" size={72} color={RED} o={ramp(s, 1.9, 2.2)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '04.1975' }, { t: 2.3, label: '16.04.1975' }]} />
    </g>
  );
};

// ---------- B28: the main divisions march south day and night ----------
export const B28: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 108.3, lat: 13.4, zoom: 220 }, { lon: 108.3, lat: 13.1, zoom: 240 }, 3.4);
  const night = 0.7 * (0.5 - 0.5 * Math.cos((s / 2.4) * Math.PI * 2 + 0.2));
  return (
    <g>
      <CMap cam={cam} id="b28m" night={night}>
        <LLArrow id="b28a" t={t} t0={0} pts={COAST.slice(0, 8)} color={RED} width={30} dur={70} opacity={0.5} />
        <LLRoad pts={COAST.slice(0, 8)} color="#E8DCC0" w={5} />
        <LLColumn id="b28c" t={t} pts={COAST.slice(0, 8)} kinds={['truck', 'jeep', 'truck', 'truck']} n={26} gap={44} speed={1.3} size={17} start={1050} />
        <Pin at={P.quyNhon} label="Quy Nhơn" size={26} from={0.2} s={s} />
        <Pin at={P.nhaTrang} label="Nha Trang" size={26} from={0.4} s={s} />
        <Pin at={P.phanRang} label="Phan Rang" size={26} from={0.6} s={s} />
      </CMap>
      <g transform="translate(1560,500)">
        <g opacity={1 - ramp(night, 0.25, 0.5)}>
          <circle r={48} fill="#FFD84A" stroke="#151515" strokeWidth={7} />
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={-68} x2={0} y2={-88} stroke="#FFD84A" strokeWidth={9} strokeLinecap="round" transform={`rotate(${i * 45 + t})`} />)}
        </g>
        <g opacity={ramp(night, 0.25, 0.5)}><path d="M-6,-62 A62,62 0 1 0 54,32 A50,50 0 1 1 -6,-62 Z" fill="#F3EBC8" stroke="#151515" strokeWidth={7} strokeLinejoin="round" /></g>
      </g>
      <Txt x={640} y={190} text="CÁC BINH ĐOÀN" size={70} o={ramp(s, 0.1, 0.45)} />
      <Txt x={640} y={268} text="HÀNH QUÂN VỀ PHÍA NAM" size={56} color={GOLD} o={ramp(s, 0.5, 0.9)} />
      <Txt x={1560} y={680} text="NGÀY ĐÊM" size={84} o={ramp(s, 1.5, 1.9)} />
      <Vignette id="b28" o={0.4} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '04.1975' }]} />
    </g>
  );
};

// ---------- B29: by every means: trucks, captured vehicles, ships ----------
const TILES = [{ at: 0.94, x: 480, label: 'XE TẢI' }, { at: 1.67, x: 960, label: 'XE THU ĐƯỢC' }, { at: 2.51, x: 1440, label: 'TÀU THỦY' }];
export const B29: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), roadX = (t * 9) % 120;
  return (
    <g>
      <Backdrop s={s} id="b29" />
      <Txt x={960} y={170} text="BẰNG MỌI PHƯƠNG TIỆN" size={96} o={ramp(s, 0.05, 0.4)} />
      <rect x={0} y={900} width={1920} height={120} fill="#0B1622" />
      {Array.from({ length: 18 }, (_, i) => <rect key={i} x={i * 120 - roadX} y={955} width={64} height={10} rx={4} fill="#E8DCC0" opacity={0.7} />)}
      {TILES.map((tl, i) => (
        <Pop key={i} s={s} at={tl.at} x={tl.x} y={560}>
          <rect x={tl.x - 205} y={330} width={410} height={440} rx={30} fill="#15202D" stroke={GOLD} strokeWidth={6} />
          <g transform={`translate(0,${Math.sin(t * 0.2 + i) * 2})`}>
            {i === 0 && <TruckSide x={tl.x - 20} y={620} s={1.0} />}
            {i === 1 && <JeepSide x={tl.x} y={620} s={1.55} t={t} id="b29j" />}
            {i === 2 && <ShipSide x={tl.x} y={640} s={0.95} t={t} />}
          </g>
          <Txt x={tl.x} y={730} text={tl.label} size={46} stroke="none" />
        </Pop>
      ))}
      <Vignette id="b29" o={0.4} />
    </g>
  );
};

// ---------- B30: in time to be around Sài Gòn ----------
export const B30: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 107.6, lat: 11.9, zoom: 260 }, { lon: 107.25, lat: 11.25, zoom: 330 }, 1.8);
  const arrows: [number, number][][] = [[[107.0, 12.5], [106.85, 11.7], P.saigon], [[108.7, 12.0], [107.8, 11.3], P.saigon], [[107.8, 11.0], [107.25, 10.95], P.saigon]];
  return (
    <g>
      <CMap cam={cam} id="b30m">
        {arrows.map((pts, i) => <LLArrow key={i} id={`b30a${i}`} t={t} t0={i * 8} pts={pts} color={RED} width={30} dur={36} />)}
        <Pin at={P.saigon} label="Sài Gòn" size={38} anchor="r" ring={RED} t={t} s={s} />
      </CMap>
      <Txt x={1400} y={190} text="KỊP CÓ MẶT" size={92} o={ramp(s, 0.2, 0.5)} />
      <Txt x={1400} y={290} text="QUANH SÀI GÒN" size={92} color={GOLD} o={ramp(s, 0.5, 0.85)} />
      <MapHud s={s} cam={cam} />
    </g>
  );
};
