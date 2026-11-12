import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion, shake } from '../../countryball/ball-motion';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { cameraAt } from '../../countryball/geo-camera';
import { SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { easeOut } from '../../countryball/fx-math';
import { Backdrop, Dim, MapHud, Pop, proj, QtMap, ramp, sec, Txt, YELLOW } from './chb-common';
import { ParisTable, PlayCard } from './chb-table-and-icons';

// Chapter B, beat "5 why" (B6-B11, 131.2-148.0 s): why Quảng Trị: the Paris table, land = cards, losing a whole province,
// holding it = leverage.

const TOWN: [number, number] = [107.1859, 16.7539];
const Pulse: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = '#FF5A5F' }) => {
  const p = (s * 1.3) % 1;
  return <circle cx={x} cy={y} r={14 + p * 64} fill="none" stroke={color} strokeWidth={6} opacity={1 - p} />;
};

// ---------- B6: "Vì sao lại là Quảng Trị?" the map drops from the three provinces onto Quảng Trị ----------
export const B6: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAMERAS.binhTriThien }, { t: 1.9, ...CAMERAS.quangTriProvince, ease: 'inout' }], s);
  const [x, y] = proj(cam)(TOWN[0], TOWN[1]);
  return (
    <g>
      <QtMap cam={cam} id="b6m" sites={['quangTri', 'dongHa', 'hue']} />
      {s > 0.6 && <Pulse x={x} y={y} s={s - 0.6} />}
      <Txt x={960} y={170} text="VÌ SAO LẠI LÀ QUẢNG TRỊ?" size={86} o={ramp(s, 0.1, 0.4)} />
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B7: the Paris table: three delegations sit down ----------
export const B7: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return <g><ParisTable s={s} t={t} id="b7" /></g>;
};

// ---------- B8: every piece of land is a card: three cards flip, Quảng Trị glows ----------
const CARDS = [{ l: 'KON TUM', sub: 'Tây Nguyên' }, { l: 'QUẢNG TRỊ', sub: 'Trị Thiên' }, { l: 'AN LỘC', sub: 'Bình Long' }];
export const B8: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b8" top="#1B3A2C" bottom="#0B1B14" />
      <Txt x={960} y={150} text="MỖI VÙNG ĐẤT = MỘT CON BÀI" size={78} o={ramp(s, 0.05, 0.3)} />
      {CARDS.map((c, i) => {
        const k = easeOut(ramp(s, 0.3 + i * 0.25, 0.8 + i * 0.25)), hot = i === 1, flip = Math.abs(Math.cos(Math.PI * easeOut(ramp(s, 0.5 + i * 0.25, 1.0 + i * 0.25))));
        const up = ramp(s, 0.5 + i * 0.25, 1.0 + i * 0.25) > 0.5;
        const lift = hot ? 40 * easeOut(ramp(s, 1.7, 2.2)) : 0;
        return <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 360 - lift}) translate(${520 + i * 440},620) scale(${flip + 0.02},${1 + (hot ? 0.1 * lift / 40 : 0)}) translate(${-(520 + i * 440)},-620)`}>
          <PlayCard x={520 + i * 440} y={620} w={290} rot={(i - 1) * 6} label={c.l} sub={c.sub} up={up} hot={hot} glow={hot ? easeOut(ramp(s, 1.7, 2.2)) * (0.7 + 0.3 * Math.sin(s * 7)) : 0} />
        </g>;
      })}
      <Txt x={960} y={1010} text="TRÊN BÀN ĐÀM PHÁN, ĐẤT ĐANG NẮM = QUÂN BÀI" size={38} color="#C9D6C0" o={ramp(s, 1.4, 1.8)} />
    </g>
  );
};

// ---------- B9: losing a whole province: Sài Gòn and Washington cannot accept ----------
export const B9: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAMERAS.quangTriProvince }, { t: 4.2, ...CAMERAS.quangTriProvince, lon: CAMERAS.quangTriProvince.lon - 0.04, zoom: CAMERAS.quangTriProvince.zoom * 1.12, ease: 'linear' }], s);
  const k = easeOut(ramp(s, 1.5, 2.0)), nope = easeOut(ramp(s, 2.9, 3.3));
  return (
    <g>
      <QtMap cam={cam} id="b9m" provinceColors={{ 'Quảng Trị': '#D2654B' }} highlight={['Quảng Trị']} sites={['quangTri', 'dongHa']} />
      <Dim o={0.5 * k} />
      <Txt x={960} y={165} text="MẤT TRỌN MỘT TỈNH" size={92} color="#FFB59A" o={ramp(s, 0.1, 0.4)} />
      <g opacity={k} transform={`translate(0,${(1 - k) * 200})`}>
        <Ball id="b9r" x={330} y={790} r={125} flag="RVN" eyes="worried" sweat t={t} motion={mixMotion(breathe(t, 60, 0.03), shake(t, 88, 6, 20))} />
        <Ball id="b9u" x={1440} y={790} r={125} flag="USA" eyes="worried" t={t} motion={breathe(t, 64, 0.03, 8)} />
        <Txt x={330} y={985} text="SÀI GÒN" size={46} color={YELLOW} />
        <Txt x={1440} y={985} text="WASHINGTON" size={46} color="#8EB4E8" />
      </g>
      <g opacity={nope} transform={`translate(900,560) scale(${0.8 + 0.2 * nope}) rotate(-4)`}>
        <rect x={-430} y={-70} width={860} height={140} rx={24} fill="#15181F" fillOpacity={0.92} stroke="#FF5A5F" strokeWidth={6} />
        <Txt x={0} y={26} text="KHÓ CHẤP NHẬN" size={86} color="#FF8C84" stroke="none" />
      </g>
      <MapHud s={s} cam={cam} date="1972" mini={false} />
    </g>
  );
};

// ---------- B10: for the Vietnamese side, holding Quảng Trị = strength ----------
export const B10: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAMERAS.triThienFront }, { t: 2.4, ...CAMERAS.triThienFront, zoom: CAMERAS.triThienFront.zoom * 1.15, ease: 'linear' }], s);
  const [x, y] = proj(cam)(TOWN[0], TOWN[1]), k = easeOut(ramp(s, 0.2, 0.7));
  return (
    <g>
      <QtMap cam={cam} id="b10m" sites={['quangTri', 'dongHa', 'cuaViet']} />
      <circle cx={x} cy={y} r={150 * k} fill={SIDE_COLORS.vnm} fillOpacity={0.22} stroke={SIDE_COLORS.vnm} strokeWidth={7} strokeDasharray="22 12" strokeDashoffset={-t} />
      <Pop s={s} at={0.3} x={x + 70} y={y - 120}>
        <Ball id="b10v" x={x + 70} y={y - 120} r={70} flag="VNM" eyes="determined" hat={<MuCoi camo />} t={t} motion={mixMotion(breathe(t, 60, 0.04), hop(t, 50, 14))} />
      </Pop>
      <Txt x={960} y={170} text="GIỮ ĐƯỢC QUẢNG TRỊ" size={88} o={ramp(s, 0.1, 0.4)} />
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B11: ... = holding strong cards at the table ----------
export const B11: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <ParisTable s={s} t={t} id="b11" big />
      <Txt x={960} y={980} text="THẾ MẠNH KHI NGỒI VÀO BÀN ĐÀM PHÁN" size={58} color="#FFD166" o={ramp(s, 1.2, 1.6)} />
    </g>
  );
};

