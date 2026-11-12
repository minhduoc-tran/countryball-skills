import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { RiverCrossing } from '../../countryball/ground-river-crossing';
import { MonsoonRain } from '../../countryball/ground-weather-and-smoke';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { cameraOnCitadel, localToScreen } from '../../countryball/citadel-geometry';
import { Chip, drift, Plan, Pop, ramp, sec, Txt, Vignette } from './chf-common';

// Chapter F, beat "24 september" end + "24b still going" (F6-F11, 480.0-491.2 s): new units still cross the Thạch Hãn at night
// into the citadel (heavy losses: icons fade, no figures drawn), "they knew the road was dangerous. But they went."
// River geometry as in chapter D/E: north bank far (west), the citadel bank near; boats are dots only.

const FROM: [number, number] = [-780, -150], TO: [number, number] = [-440, -20];
const HUD = [{ t: 0, label: '09.1972' }];
const ends = (cam: ReturnType<typeof cameraOnCitadel>) => [localToScreen(cam, FROM[0], FROM[1]), localToScreen(cam, TO[0], TO[1])] as const;

// ---------- F6: new units cross the river ----------
export const F6: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-300, 0, 0.8), cameraOnCitadel(-260, 0, 0.95), len / 30), [a, b] = ends(cam);
  return (
    <g>
      <Plan id="f6" cam={cam} t={t} damage={0.93} night={0.75} fires={0.35} />
      <RiverCrossing id="f6r" t={t} t0={0} t1={46} from={a} to={b} n={3} size={50} spacing={70} drift={46} splashes={4} flares={[{ t0: 4, x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 - 330 }]} />
      <Vignette id="f6" o={0.5} />
      <Txt x={1040} y={180} text="ĐƠN VỊ MỚI VƯỢT SÔNG" size={96} o={ramp(s, 0.05, 0.3)} />
      <DateChip dates={HUD} t={s} id="hud-date" />
    </g>
  );
};

// ---------- F7: very heavy losses: the unit icons fade one by one (numbers unknown, so no number) ----------
export const F7: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-200, 0, 0.7), cameraOnCitadel(-160, 0, 0.8), len / 30);
  return (
    <g>
      <Plan id="f7" cam={cam} t={t} damage={0.94} night={0.7} fires={0.2} />
      <rect width={1920} height={1080} fill="#050B15" opacity={0.55} />
      {Array.from({ length: 6 }, (_, i) => {
        const gone = i === 0 ? 0 : ramp(s, 0.15 + i * 0.16, 0.4 + i * 0.16);
        return <g key={i} opacity={1 - 0.88 * gone}><UnitBox x={500 + i * 184} y={560} kind="inf" color={SIDE_COLORS.vnm} size={92} /></g>;
      })}
      <Txt x={960} y={200} text="TỔN THẤT RẤT NẶNG" size={110} o={ramp(s, 0.05, 0.3)} />
      <Vignette id="f7" o={0.6} />
    </g>
  );
};

// ---------- F8: the last days, every night ----------
export const F8: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-120, 20, 0.5), cameraOnCitadel(-200, 0, 0.6), len / 30), [a, b] = ends(cam);
  return (
    <g>
      <Plan id="f8" cam={cam} t={t} damage={0.94} night={0.8} fires={0.4} />
      <RiverCrossing id="f8r" t={t} t0={14} t1={60} from={a} to={b} n={2} size={34} spacing={60} drift={30} splashes={2} />
      <Vignette id="f8" o={0.45} />
      <Txt x={1040} y={180} text="NHỮNG NGÀY CUỐI CÙNG" size={96} o={ramp(s, 0.05, 0.3)} />
      <Pop s={s} at={0.7} x={960} y={930}><Chip x={960} y={930} text="MỖI ĐÊM" size={64} /></Pop>
      <DateChip dates={HUD} t={s} id="hud-date" /><MiniMap camera={cam} />
    </g>
  );
};

// ---------- F9: every night, more units cross into the citadel ----------
export const F9: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-340, 0, 0.62), cameraOnCitadel(-240, 0, 0.78), len / 30), [a, b] = ends(cam);
  const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return (
    <g>
      <Plan id="f9" cam={cam} t={t} damage={0.94} night={0.8} fires={0.35} />
      <RiverCrossing id="f9r" t={t} t0={0} t1={74} from={a} to={b} n={5} size={44} spacing={68} drift={50} splashes={7}
        flares={[{ t0: 8, x: mid[0] - 80, y: mid[1] - 340 }, { t0: 46, x: mid[0] + 120, y: mid[1] - 360 }]} />
      <MonsoonRain t={t} intensity={0.35} angle={12} dim={0.1} />
      <Vignette id="f9" o={0.5} />
      <Txt x={1040} y={180} text="VƯỢT SÔNG VÀO THÀNH" size={96} o={ramp(s, 0.05, 0.3)} />
      <DateChip dates={HUD} t={s} id="hud-date" />
    </g>
  );
};

// ---------- F10: they knew how dangerous the road was ----------
export const F10: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-330, 30, 1.3), cameraOnCitadel(-300, 0, 1.45), len / 30), [a, b] = ends(cam);
  const eyes = (i: number) => (s > 1.6 + i * 0.3 ? 'determined' : 'worried');
  return (
    <g>
      <Plan id="f10" cam={cam} t={t} damage={0.94} night={0.85} fires={0.3} />
      <RiverCrossing id="f10r" t={t} t0={50} t1={90} from={a} to={b} n={2} size={34} spacing={60} drift={30} splashes={0} />
      <MonsoonRain t={t} intensity={0.3} angle={12} dim={0.1} />
      <Vignette id="f10" o={0.65} />
      {[0, 1].map((i) => <Ball key={i} id={`f10b${i}`} x={1330 + i * 230} y={760 - i * 14} r={118 - i * 8} flag="VNM" eyes={eyes(i)} look={-0.8} hat={<MuCoi camo />} t={t} motion={breathe(t, 76, 0.02, i * 11)} />)}
      <Txt x={780} y={190} text="HỌ BIẾT RẤT RÕ" size={96} o={ramp(s, 0.1, 0.4)} />
      <Txt x={780} y={300} text="CON ĐƯỜNG ẤY NGUY HIỂM" size={80} color="#E2B95A" o={ramp(s, 0.9, 1.2)} />
    </g>
  );
};

// ---------- F11: but they went ----------
export const F11: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraOnCitadel(-300 + 30 * s, 0, 0.9), [a, b] = ends(cam);
  return (
    <g>
      <Plan id="f11" cam={cam} t={t} damage={0.94} night={0.8} fires={0.3} />
      <RiverCrossing id="f11r" t={t} t0={0} t1={34} from={a} to={b} n={4} size={46} spacing={66} drift={40} splashes={2} flares={[{ t0: 2, x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 - 320 }]} />
      <Vignette id="f11" o={0.5} />
      <Txt x={960} y={170} text="NHƯNG HỌ VẪN ĐI" size={132} color="#FFE9B0" o={ramp(s, 0.02, 0.2)} />
    </g>
  );
};
