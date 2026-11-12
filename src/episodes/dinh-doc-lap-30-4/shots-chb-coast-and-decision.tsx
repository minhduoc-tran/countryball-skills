import React from 'react';
import { ShotProps } from '../../engine';
import { PhotoCard } from '../../countryball/photo-card';
import { MiniMap } from '../../countryball/hud-minimap';
import { star } from '../../countryball/ball-flags';
import { easeOut } from '../../countryball/fx-math';
import { Backdrop, CAM, CMap, drift, GOLD, MapHud, P, RED, sec, Txt, Vignette, ramp } from './chb-common';
import { FlagPop, LLArrow, LLShips, MapChip, Pin } from './chb-map-bits';
import { CalendarPage, Chip, RainCloud } from './chb-cards';

// Chapter B, beats "3b hue danang" + "3c decision" (B8-B15, 103.10-127.90 s): everything speeds up (calendar rolls 11 -> 26.03), Huế
// 26.03 and Đà Nẵng 29.03 flags pop on the coast, ships head south (photo, 04.1975), Hà Nội: Bộ Chính trị decides to free Sài Gòn before
// the rainy season ("chỉ còn vài tuần"), 14.04 the campaign gets its name: CHIẾN DỊCH HỒ CHÍ MINH. No new facts: only narrated dates.

// ---------- B8: faster than anyone predicted (calendar rolls 11 -> 26) ----------
export const B8: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), u = Math.pow(ramp(s, 0.2, 3.0), 1.5), v = 11 + 15 * u, day = Math.floor(v + 1e-6), flip = v - day;
  return (
    <g>
      <Backdrop s={s} id="b8" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 250 + i * 150, o = 0.25 + 0.5 * ((Math.sin(t * 0.5 + i * 1.7) + 1) / 2), x0 = ((t * (60 + i * 25)) % 1700) - 300;
        return <rect key={i} x={x0} y={y} width={360} height={7} rx={3} fill="#9FC4E8" opacity={o * 0.5} />;
      })}
      <CalendarPage x={600} y={560} w={470} month="THÁNG 3" day={String(Math.min(day, 26))} flip={flip} />
      <Txt x={1360} y={420} text="NHANH HƠN" size={118} o={ramp(s, 0.3, 0.7)} />
      <Txt x={1360} y={560} text="MỌI DỰ ĐOÁN" size={118} color={GOLD} o={ramp(s, 0.9, 1.3)} />
      <Vignette id="b8" o={0.45} />
    </g>
  );
};

// ---------- B9: 26.03 Huế ----------
export const B9: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 108.0, lat: 15.7, zoom: 300 }, { lon: 107.95, lat: 16.2, zoom: 700 }, 2.4);
  return (
    <g>
      <CMap cam={cam} id="b9m">
        <Pin at={P.danang} label="Đà Nẵng" size={28} from={0.6} s={s} />
        <FlagPop at={P.hue} kind="PRG" s={s} from={0.9} t={t} size={120} id="b9f" />
        <Pin at={P.hue} label="Huế" size={40} anchor="b" ring={RED} t={t} s={s} />
      </CMap>
      <Txt x={1450} y={200} text="26 THÁNG 3" size={120} o={ramp(s, 0.2, 0.6)} />
      <Txt x={1450} y={292} text="HUẾ ĐƯỢC GIẢI PHÓNG" size={56} color={GOLD} o={ramp(s, 1.0, 1.4)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '26.03.1975' }]} />
    </g>
  );
};

// ---------- B10: 29.03 Đà Nẵng, the second largest city ----------
export const B10: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 107.95, lat: 16.2, zoom: 700 }, { lon: 108.0, lat: 16.05, zoom: 760 }, 1.8);
  return (
    <g>
      <CMap cam={cam} id="b10m">
        <FlagPop at={P.hue} kind="PRG" s={s} from={-9} t={t} size={100} id="b10h" />
        <Pin at={P.hue} label="Huế" size={30} anchor="b" s={s} />
        <FlagPop at={P.danang} kind="PRG" s={s} from={0.9} t={t} size={120} id="b10f" />
        <Pin at={P.danang} label="Đà Nẵng" size={40} anchor="r" ring={RED} t={t} s={s} />
      </CMap>
      <Txt x={1450} y={200} text="29 THÁNG 3" size={120} o={ramp(s, 0.2, 0.6)} />
      <Txt x={1450} y={296} text="ĐÀ NẴNG" size={72} color={GOLD} o={ramp(s, 0.8, 1.2)} />
      <Txt x={1450} y={740} text="THÀNH PHỐ LỚN THỨ HAI" size={50} o={ramp(s, 1.9, 2.3)} />
      <Txt x={1450} y={806} text="MIỀN NAM" size={50} o={ramp(s, 2.1, 2.5)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '26.03.1975' }, { t: 0.3, label: '29.03.1975' }]} />
    </g>
  );
};

// ---------- B11: ships full of evacuees head south (photo 07.04.1975, captioned "tháng 4.1975") ----------
export const B11: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 109.2, lat: 14.1, zoom: 400 }, { lon: 109.2, lat: 13.7, zoom: 400 }, 2.6);
  const sea: [number, number][] = [[109.55, 14.95], [109.85, 14.3], [109.9, 13.5], [109.8, 12.7]];
  return (
    <g>
      <CMap cam={cam} id="b11m">
        <LLShips t={t} pts={sea} n={3} gap={340} speed={1.2} scale={0.95} start={640} />
      </CMap>
      <PhotoCard id="b11p" src="dinh-doc-lap-30-4/img/tau-pioneer-contender-cho-nguoi-di-tan.jpg" caption="tàu chở đầy người di tản, tháng 4.1975"
        credit="Ảnh: PH3 J.L. Aswegan, U.S. Navy / Public domain (US Navy)" x={600} y={560} w={720} h={480} rot={-2.5} from={0.1} t={s} />
      <Txt x={1620} y={210} text="XUÔI VỀ" size={104} o={ramp(s, 0.3, 0.7)} />
      <Txt x={1620} y={310} text="PHÍA NAM" size={104} color={GOLD} o={ramp(s, 0.7, 1.1)} />
      <MapHud s={s} cam={cam} />
    </g>
  );
};

// ---------- B12: Hà Nội, the Politburo decides ----------
export const B12: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(s, { lon: 107.6, lat: 15.8, zoom: 62 }, { lon: 107.0, lat: 15.8, zoom: 70 }, 2.5);
  return (
    <g>
      <CMap cam={cam} id="b12m">
        <LLArrow id="b12a" t={t} t0={26} pts={[P.hanoi, [105.7, 18.6], P.hue, [108.6, 13.4], P.saigon]} color={RED} width={20} dur={46} />
        <Pin at={P.hanoi} label="Hà Nội" size={30} anchor="l" ring={GOLD} t={t} s={s} />
        <Pin at={P.saigon} label="Sài Gòn" size={30} anchor="r" ring={RED} t={t} from={0.8} s={s} />
        <MapChip at={P.hanoi} text="BỘ CHÍNH TRỊ" dx={-210} dy={-60} size={34} s={s} from={0.3} />
      </CMap>
      <Txt x={1560} y={300} text="GIẢI PHÓNG" size={84} o={ramp(s, 0.7, 1.0)} />
      <Txt x={1560} y={410} text="SÀI GÒN" size={104} color={GOLD} o={ramp(s, 1.0, 1.3)} />
      <MiniMap camera={cam} />
    </g>
  );
};

// ---------- B13: before the rainy season, only weeks left ----------
export const B13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), crossed = Math.floor(ramp(s, 0.5, 2.1) * 15);
  return (
    <g>
      <Backdrop s={s} id="b13" top="#1B2C40" bottom="#0A1420" />
      <Txt x={960} y={170} text="TRƯỚC MÙA MƯA" size={112} o={ramp(s, 0.05, 0.4)} />
      <RainCloud x={1360} y={520} s={1.35} t={t} />
      <g transform="translate(250,330)" opacity={ramp(s, 0.2, 0.5)}>
        <rect x={-30} y={-30} width={7 * 82 + 20} height={3 * 82 + 20} rx={18} fill="#F6F2E7" stroke="#151515" strokeWidth={6} />
        {Array.from({ length: 21 }, (_, i) => {
          const x = (i % 7) * 82 + 16, y = Math.floor(i / 7) * 82 + 16, on = i < 15 && i < crossed;
          return (
            <g key={i}>
              <rect x={x - 22} y={y - 22} width={64} height={64} rx={10} fill={i < 15 ? '#fff' : '#E8E2D2'} stroke="#2A2622" strokeWidth={3} opacity={i < 15 ? 1 : 0.35} />
              {on && <path d={`M${x - 10},${y - 10} L${x + 30},${y + 30} M${x + 30},${y - 10} L${x - 10},${y + 30}`} stroke="#C9343A" strokeWidth={7} strokeLinecap="round" />}
            </g>
          );
        })}
      </g>
      <Txt x={960} y={900} text="CHỈ CÒN VÀI TUẦN" size={92} color={GOLD} o={ramp(s, 1.2, 1.6)} />
      <Vignette id="b13" o={0.5} />
    </g>
  );
};

// ---------- B14: 14.04, the last campaign gets a special name ----------
export const B14: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = easeOut(ramp(s, 0.15, 0.8)), tag = ramp(s, 3.15, 3.55), wob = Math.sin(t * 0.18) * 3;
  return (
    <g>
      <Backdrop s={s} id="b14" />
      <CalendarPage x={600} y={500} w={480} month="THÁNG 4" day="14" flip={1 - k} />
      <Txt x={1300} y={300} text="CHIẾN DỊCH" size={96} o={ramp(s, 0.7, 1.0)} />
      <Txt x={1300} y={410} text="CUỐI CÙNG" size={116} color={GOLD} o={ramp(s, 1.2, 1.5)} />
      <g transform={`translate(1300,${760 + (1 - tag) * 120}) rotate(${-4 + wob})`} opacity={tag}>
        <rect x={-300} y={-96} width={600} height={192} rx={26} fill="#F6F2E7" stroke="#151515" strokeWidth={7} />
        <circle cx={-250} cy={0} r={16} fill="#13263B" stroke="#151515" strokeWidth={5} />
        <Txt x={30} y={56} text="? ? ?" size={118} color="#C9343A" stroke="none" ls={10} />
        <Txt x={30} y={-46} text="MỘT CÁI TÊN ĐẶC BIỆT" size={34} color="#2A2622" stroke="none" />
      </g>
      <Vignette id="b14" o={0.45} />
    </g>
  );
};

// ---------- B15: CHIẾN DỊCH HỒ CHÍ MINH (title card) ----------
export const B15: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = easeOut(ramp(s, 0.05, 0.5)), sc = 0.9 + 0.1 * k + 0.02 * s;
  return (
    <g>
      <Backdrop s={s} id="b15" top="#4A1812" bottom="#160A0B" />
      <g transform={`translate(960,470) rotate(${t * 0.3})`} opacity={0.22}>
        {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0,0 L-70,-900 L70,-900 Z" fill="#F2C230" transform={`rotate(${i * 30})`} />)}
      </g>
      <g transform={`translate(960,470) scale(${sc * 300})`} opacity={0.4}><polygon points={star(0, 0, 1)} fill="#FFDA3A" stroke="#151515" strokeWidth={0.03} /></g>
      <g opacity={k} transform={`translate(0,${(1 - k) * 40})`}>
        <Txt x={960} y={380} text="CHIẾN DỊCH" size={120} color={GOLD} ls={8} />
        <Txt x={960} y={610} text="HỒ CHÍ MINH" size={210} />
      </g>
      <g opacity={ramp(s, 0.7, 1.0)}><Chip x={960} y={850} text="14.04.1975" size={64} /></g>
      <Vignette id="b15" o={0.5} />
    </g>
  );
};
