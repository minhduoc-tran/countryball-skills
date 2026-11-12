import React from 'react';
import { ShotProps } from '../../engine';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { Camera, cameraAt } from '../../countryball/geo-camera';
import { FlightPath } from '../../countryball/fx-flight-path';
import { BCell } from '../../countryball/fx-flight-path';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { Puff } from '../../countryball/fx-glow';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { NavalBombardment, Warship, WarshipSide } from '../../countryball/ground-naval-gunfire';
import { SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { LowerThird, SourceLine } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { countAt, fmtVi } from '../../countryball/hud-counter';
import { easeOut, Pt } from '../../countryball/fx-math';
import { Backdrop, BLUE, CREDIT, IMG, MapHud, proj, QtMap, ramp, sec, Txt } from './chb-common';
import { ShellGlyph } from './chb-table-and-icons';

// Chapter B, beats "7 firepower" + "7b cruiser" (B18-B26, 163.5-188.9 s): behind the divisions is US firepower: B-52s, hundreds
// of tactical jets, the 7th Fleet; the cruiser USS Newport News and its 50.000+ shells.

const FRONT: Camera = { lon: 107.25, lat: 16.72, zoom: 3600 };
const drift = (a: Camera, dur: number, k = 1.08): ((s: number) => Camera) => (s) => cameraAt([{ t: 0, ...a }, { t: dur, ...a, zoom: a.zoom * k, lon: a.lon + 0.02, ease: 'linear' }], s);

// ---------- B18: behind the yellow front stands the blue firepower ----------
export const B18: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(FRONT, 3)(s), P = proj(cam);
  const [fx, fy] = P(107.19, 16.69), [sx, sy] = P(107.3, 16.645), [ax, ay] = P(107.1, 16.635), [tx, ty] = P(107.2, 16.76);
  return (
    <g>
      <QtMap cam={cam} id="b18m" sites={['quangTri', 'haiLang']} />
      <UnitBox x={fx} y={fy} kind="inf" color={SIDE_COLORS.rvn} label="VNCH" size={80} />
      <g opacity={ramp(s, 0.3, 0.6)}>
        <UnitBox x={sx + 140} y={sy} kind="art" color={SIDE_COLORS.usa} label="HẠM ĐỘI 7" size={70} />
        <UnitBox x={ax} y={ay} kind="air" color={SIDE_COLORS.usa} label="KHÔNG QUÂN MỸ" size={70} />
      </g>
      <ShellBarrage id="b18s" t={t} t0={14} from={[2100, 200]} to={[tx, ty]} n={9} span={30} spread={[170, 70]} dur={36} lift={190} r={30} />
      <Txt x={1150} y={180} text="PHÍA SAU: HỎA LỰC MỸ" size={70} color="#9DBCE8" o={ramp(s, 0.05, 0.3)} />
      <MapHud s={s} cam={cam} date="28.06.1972" />
    </g>
  );
};

// ---------- B19: B-52s: the strategic bomber (photo + a cell crossing the night map, bombs walking along the front) ----------
export const B19: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(FRONT, 3)(s), P = proj(cam);
  const a = P(106.95, 16.62), b = P(107.4, 16.9), c1 = P(107.12, 16.78), c2 = P(107.27, 16.84);
  return (
    <g>
      <QtMap cam={cam} id="b19m" night={0.55} sites={['quangTri']} names={false} />
      <BCell id="b19c" t={t} points={[[a[0] - 200, a[1] + 120], [b[0] + 300, b[1] - 120]]} t0={0} t1={84} size={120} trailLen={420} />
      <BombCarpet id="b19b" t={t} t0={44} from={c1} to={c2} dur={30} n={16} width={70} r={30} />
      <Txt x={560} y={850} text="B-52" size={150} o={ramp(s, 0.1, 0.35)} />
      <Txt x={560} y={930} text="NÉM BOM CHIẾN LƯỢC" size={52} color="#9DBCE8" o={ramp(s, 0.3, 0.6)} />
      <PhotoCard t={s} src={`${IMG}b52d-dropping-bombs-vietnam.jpg`} caption="B-52D thả bom trên Việt Nam" credit={CREDIT.usaf} x={1500} y={600} w={520} h={464} rot={3} from={0.5} to={s + 1} id="b19p" />
      <MapHud s={s} cam={cam} date="28.06.1972" mini={false} />
    </g>
  );
};

// ---------- B20: hundreds of tactical jets: F-4s streak across ----------
export const B20: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(FRONT, 2, 1.05)(s);
  return (
    <g>
      <QtMap cam={cam} id="b20m" sites={['quangTri']} />
      {Array.from({ length: 7 }, (_, i) => {
        const y = 250 + i * 105, x0 = -250 - (i % 3) * 120, d = i % 2 ? -1 : 1;
        const pts: Pt[] = d > 0 ? [[x0, y + 60], [2200, y - 40]] : [[2200 + (i % 3) * 120, y], [-250, y + 90]];
        return <FlightPath key={i} id={`b20j${i}`} kind="f4" points={pts} t={t} t0={i * 3} t1={i * 3 + 40} size={92} trailLen={260} />;
      })}
      <Txt x={1150} y={190} text="HÀNG TRĂM MÁY BAY CHIẾN THUẬT" size={62} o={ramp(s, 0.05, 0.3)} />
      <MapHud s={s} cam={cam} date="28.06.1972" mini={false} />
    </g>
  );
};

// ---------- B21: the 7th Fleet: warships off the coast ----------
const SEA: Camera = { lon: 107.38, lat: 16.78, zoom: 3600 };
export const B21: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(SEA, 3)(s), P = proj(cam);
  const ships = [{ ll: [107.5, 16.89], k: 'cruiser', z: 230 }, { ll: [107.47, 16.78], k: 'destroyer', z: 170 }, { ll: [107.5, 16.67], k: 'cruiser', z: 230 }] as const;
  return (
    <g>
      <QtMap cam={cam} id="b21m" sites={['quangTri', 'cuaViet', 'haiLang']} />
      {ships.map((sh, i) => {
        const [x, y] = P(sh.ll[0], sh.ll[1]);
        return <g key={i} opacity={ramp(s, 0.1 + i * 0.25, 0.4 + i * 0.25)}><Warship x={x + t * 0.4} y={y - t * 0.5} heading={-80} size={sh.z} kind={sh.k} t={t} /></g>;
      })}
      <Txt x={1640} y={560} text="HẠM ĐỘI 7" size={84} color="#9DBCE8" o={ramp(s, 0.1, 0.4)} />
      <LowerThird title="Hạm đội 7, Hải quân Mỹ" sub="Ngoài khơi Quảng Trị" t={s} from={0.6} accent={BLUE} />
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B22: the guns reach tens of km inland: cruiser fires at the land, a ruler shows the range ----------
export const B22: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(SEA, 4.2, 1.06)(s), P = proj(cam);
  const ship = P(107.46, 16.79), tgt = P(107.17, 16.79);
  const k = easeOut(ramp(s, 0.7, 1.5)), midx = (ship[0] + tgt[0]) / 2;
  return (
    <g>
      <QtMap cam={cam} id="b22m" sites={['quangTri', 'cuaViet']} />
      <NavalBombardment id="b22n" t={t} t0={6} ship={{ x: ship[0], y: ship[1], heading: 180, size: 260, kind: 'cruiser' }} target={tgt} every={52} flight={46} lift={200} spread={60} r={32} />
      <g opacity={k}>
        <line x1={ship[0] - 130} y1={ship[1] + 150} x2={ship[0] - 130 - (ship[0] - 130 - tgt[0]) * k} y2={ship[1] + 150} stroke="#FFD166" strokeWidth={6} strokeDasharray="18 10" />
        <path d={`M${tgt[0]},${ship[1] + 126} v48`} stroke="#FFD166" strokeWidth={6} />
        <path d={`M${ship[0] - 130},${ship[1] + 126} v48`} stroke="#FFD166" strokeWidth={6} />
        <Txt x={midx} y={ship[1] + 232} text="HÀNG CHỤC CÂY SỐ" size={72} color="#FFD166" />
      </g>
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B23: USS Newport News: photo on the sea map ----------
export const B23: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = drift(SEA, 3.4, 1.05)(s);
  return (
    <g>
      <QtMap cam={cam} id="b23m" night={0.2} names={false} />
      <rect width={1920} height={1080} fill="#050B15" opacity={0.35} />
      <PhotoCard t={s} src={`${IMG}013.jpg`} caption="Tuần dương hạm USS Newport News, 1972" credit={CREDIT.usmcHist} x={640} y={500} w={800} h={558} rot={-2} from={0.1} to={s + 1} id="b23p" fromSide="left" />
      <Txt x={1490} y={380} text="USS" size={70} color="#9DBCE8" anchor="middle" o={ramp(s, 0.5, 0.8)} />
      <Txt x={1490} y={490} text="NEWPORT" size={96} anchor="middle" o={ramp(s, 0.6, 0.9)} />
      <Txt x={1490} y={595} text="NEWS" size={96} anchor="middle" o={ramp(s, 0.7, 1.0)} />
      <Txt x={1490} y={672} text="CA-148" size={50} color="#E2B95A" anchor="middle" o={ramp(s, 0.9, 1.2)} />
    </g>
  );
};

// ---------- B24: the last active heavy cruiser of the US Navy ----------
export const B24: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), bob = (i: number) => Math.sin(t * 0.1 + i) * 6, glow = easeOut(ramp(s, 1.6, 2.4));
  return (
    <g>
      <Backdrop s={s} id="b24" top="#0F2B44" bottom="#07131F" />
      <Txt x={960} y={150} text="TUẦN DƯƠNG HẠM HẠNG NẶNG" size={78} o={ramp(s, 0.05, 0.3)} />
      {[0, 1, 2, 3].map((i) => {
        const last = i === 3, o = last ? 0.35 + 0.65 * glow : 0.55 * (1 - easeOut(ramp(s, 0.6 + i * 0.35, 1.2 + i * 0.35))) + 0.08;
        return <g key={i} opacity={ramp(s, i * 0.1, i * 0.1 + 0.3) * o}>
          {last && <ellipse cx={1490} cy={600} rx={270} ry={140} fill="#FFD166" opacity={0.28 * glow} />}
          <WarshipSide x={230 + i * 420} y={640 + bob(i)} size={330} kind="cruiser" t={t + i * 9} />
        </g>;
      })}
      <g transform={`translate(1400,360) scale(${0.6 + 0.4 * glow}) rotate(-5)`} opacity={glow}>
        <rect x={-340} y={-66} width={680} height={116} rx={18} fill="#15181F" fillOpacity={0.93} stroke="#FFD166" strokeWidth={7} />
        <Txt x={0} y={24} text="CHIẾC CUỐI CÙNG" size={62} color="#FFD166" stroke="none" />
      </g>
      <Txt x={960} y={940} text="CÒN HOẠT ĐỘNG CỦA HẢI QUÂN MỸ" size={58} color="#DCE4EC" o={ramp(s, 1.9, 2.3)} />
    </g>
  );
};

// ---------- B25: the ship's last deployment to Vietnam (zoom from the whole coast down onto the Quảng Trị sea) ----------
export const B25: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAMERAS.vietnam }, { t: 2.0, ...CAMERAS.binhTriThien, ease: 'inout' }], s), P = proj(cam);
  const [x, y] = P(107.9 - 0.4 * ramp(s, 0, 2), 16.2 + 0.6 * ramp(s, 0, 2));
  return (
    <g>
      <QtMap cam={cam} id="b25m" names={false} dmz={false} />
      <Warship x={x + 60} y={y} heading={-70} size={cam.zoom < 150 ? 90 : 190} kind="cruiser" t={t} />
      <Txt x={960} y={150} text="ĐỢT TRIỂN KHAI CUỐI CÙNG" size={74} o={ramp(s, 0.05, 0.3)} />
      <Txt x={960} y={232} text="Ở VIỆT NAM" size={74} color="#E2B95A" o={ramp(s, 0.2, 0.5)} />
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B26: "hơn 50.000 quả đạn pháo cỡ lớn": the cruiser fires, a pile of shells builds up while the count runs ----------
const SHELLS = [{ t: 0.3, value: 0 }, { t: 3.3, value: 50000 }];
export const B26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), n = countAt(SHELLS, s), shown = Math.round((n / 50000) * 64), rock = Math.sin(t * 0.7) * 2;
  return (
    <g>
      <Backdrop s={s} id="b26" top="#0F2B44" bottom="#07131F" />
      <WarshipSide x={500} y={340 + rock} size={560} kind="cruiser" t={t} />
      {Array.from({ length: 6 }, (_, i) => {
        const age = (t * 0.6 + i * 12) % 72;
        return <Puff key={i} x={430 + i * 36 + age * 1.2} y={250 - age * 1.4} r={22 + age * 0.7} o={0.55 * (1 - age / 72)} seed={i} />;
      })}
      <g transform="translate(1440,320)">
        <rect x={-380} y={-150} width={760} height={300} rx={34} fill="#15181F" fillOpacity={0.92} stroke="#C9343A" strokeWidth={6} />
        <Txt x={0} y={64} text={`${fmtVi(n)}${n >= 50000 ? '+' : ''}`} size={156} stroke="none" />
        <Txt x={0} y={-76} text="QUẢ ĐẠN PHÁO CỠ LỚN" size={44} color="#E2B95A" stroke="none" />
      </g>
      {Array.from({ length: shown }, (_, i) => <ShellGlyph key={i} x={170 + (i % 16) * 108} y={650 + Math.floor(i / 16) * 84} len={58} rot={-90} o={0.95} />)}
      <SourceLine text="Nguồn: NHHC (DANFS), USNI Proceedings" t={s} />
    </g>
  );
};

