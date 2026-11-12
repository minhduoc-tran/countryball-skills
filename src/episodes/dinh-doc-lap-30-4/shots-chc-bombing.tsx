import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, mixMotion } from '../../countryball/ball-motion';
import { PhotoCard } from '../../countryball/photo-card';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { SourceLine } from '../../countryball/hud-chips';
import { GeoMap } from '../../countryball/map-geo-map';
import { cameraAt, project } from '../../countryball/geo-camera';
import { SAIGON_CAMERAS as CAM } from '../../countryball/sai-gon-camera-keys';
import { SAIGON_ATTRIBUTION, SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { PalacePlan } from '../../countryball/palace-plan';
import { palaceScreen } from '../../countryball/palace-geometry';
import { FlagCloth } from '../../countryball/flag-cloth';
import { clamp, easeInOut, easeOut } from '../../countryball/fx-math';
import { Backdrop, credit, Dim, GOLD, IMG, LAND, NameCard, ramp, sec, Silhouette, Txt } from './chc-common';
import { JetTop } from './chc-icons';

// Chapter C, beat "4d trung" (C6-C12, 179.8-198.4 s): 08.04.1975 an F-5E bombs the Dinh Độc Lập, flown by Nguyễn Thành Trung, a Sài Gòn air force pilot
// who was really working secretly for the revolution for years. Damage small, but "the war has come very near". Photos taken later say so.

const SRC = `${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`;
const DINH: [number, number] = [106.6953, 10.7769];

// ---------- C6: "trước đó ít lâu, ngày 8 tháng Tư": the date chip rolls BACK to 08.04.1975 over the city ----------
export const C6: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAM.cityWide }, { t: 2.6, lon: 106.69, lat: 10.785, zoom: 8200 }], s);
  const [x, y] = project(cam, DINH[0], DINH[1]), pulse = (s * 1.2) % 1;
  return (
    <g>
      <GeoMap camera={cam} id="c6m" colors={LAND}><SaigonLabels /><SaigonSites only={['tanSonNhat', 'daiPhatThanh']} /></GeoMap>
      <Txt x={x} y={y + 170} text="DINH ĐỘC LẬP" size={46} o={ramp(s, 0.5, 0.9)} />
      <circle cx={x} cy={y} r={26 + pulse * 90} fill="none" stroke="#FF5A5F" strokeWidth={6} opacity={(1 - pulse) * ramp(s, 0.5, 0.9)} />
      <circle cx={x} cy={y} r={14} fill="#FF5A5F" stroke="#15151A" strokeWidth={5} opacity={ramp(s, 0.5, 0.8)} />
      <Txt x={1200} y={150} text="TRƯỚC ĐÓ ÍT LÂU" size={76} o={ramp(s, 0.1, 0.4)} />
      <g transform={`translate(610,136) rotate(${-360 * easeOut(ramp(s, 0.1, 1.0))})`} opacity={ramp(s, 0.1, 0.3)}>
        <path d="M-34,-8 A36,36 0 1 1 -10,34" fill="none" stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
        <polygon points="-52,-14 -32,-34 -18,-6" fill={GOLD} />
      </g>
      <DateChip dates={[{ t: 0, label: '21.04.1975' }, { t: 0.35, label: '08.04.1975' }]} t={s} id="c6d" />
      <MiniMap camera={cam} id="c6mini" /><SourceLine text={SRC} t={s} />
    </g>
  );
};

// ---------- C7: "một chiếc máy bay chiến đấu": the F-5E on display at the Dinh today (same type, caption says so) ----------
export const C7: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="c7" />
      <Txt x={1140} y={116} text="MỘT CHIẾC MÁY BAY CHIẾN ĐẤU" size={60} o={ramp(s, 0.05, 0.3)} />
      <PhotoCard t={s} src={`${IMG}may-bay-f5e-dinh-doc-lap.jpg`} caption="F-5E cùng loại, trưng bày tại Dinh ngày nay" credit={credit('Gary Todd from Xinzheng, China', 'CC0')}
        x={960} y={570} w={1000} h={667} rot={-1.5} from={0.1} to={s + 2} id="c7p" kb={{ z0: 1.0, z1: 1.14, px0: 0.03, py0: 0, px1: -0.03, py1: 0 }} />
      <DateChip label="08.04.1975" t={s} id="c7d" />
    </g>
  );
};

// ---------- C8: top view of the palace: a jet crosses, a bomb falls on the roof, a red ring marks the spot ----------
export const C8: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAM.palaceGrounds }, { t: 1.2, ...CAM.palace, zoom: CAM.palace.zoom * 1.5, ease: 'out' }, { t: 2.6, ...CAM.palace, zoom: CAM.palace.zoom * 1.62, ease: 'linear' }], s);
  const [dx, dy] = palaceScreen(cam, -6, 10), ang = 24, ux = Math.cos((ang * Math.PI) / 180), uy = Math.sin((ang * Math.PI) / 180);
  const jx = dx + ux * 1500 * (s - 0.75), jy = dy + uy * 1500 * (s - 0.75);
  const fall = ramp(s, 0.5, 1.1), hit = ramp(s, 1.1, 1.6);
  const rx = dx + ux * 1500 * (0.5 - 0.75), ry = dy + uy * 1500 * (0.5 - 0.75);
  const bombX = rx + (dx - rx) * easeInOut(fall), bombY = ry + (dy - ry) * easeInOut(fall), sz = 1 + 1.6 * (1 - fall);
  return (
    <g>
      <PalacePlan id="c8p" camera={cam} t={t} labels={false} />
      <Txt x={dx - 80} y={dy - 80} text="DINH ĐỘC LẬP" size={44} anchor="end" o={ramp(s, 0.2, 0.5)} />
      <Dim o={0.12} />
      {s > 0.5 && s < 1.1 && <g transform={`translate(${bombX},${bombY}) rotate(${ang}) scale(${sz})`}><ellipse rx={14} ry={6} fill="#1B1B1F" stroke="#000" strokeWidth={2} /><polygon points="-14,0 -24,-6 -24,6" fill="#1B1B1F" /></g>}
      <JetTop x={jx} y={jy} len={300} rot={ang} />
      {s >= 1.1 && <g transform={`translate(${dx},${dy})`}>
        <circle r={20 + 150 * easeOut(hit)} fill="#FFD9A0" opacity={0.6 * (1 - hit)} />
        <circle r={26 + 20 * easeOut(hit)} fill="#6D6A66" opacity={0.55 * (1 - ramp(s, 1.6, 2.6))} />
        <circle r={44} fill="none" stroke="#E0302B" strokeWidth={8} opacity={ramp(s, 1.3, 1.6)} />
        <Txt x={90} y={60} text="ĐIỂM BOM RƠI" size={42} anchor="start" color="#FFD9A0" o={ramp(s, 1.5, 1.8)} />
      </g>}
      <Txt x={1190} y={116} text="NÉM BOM XUỐNG DINH ĐỘC LẬP" size={58} o={ramp(s, 0.05, 0.3)} />
      <DateChip label="08.04.1975" t={s} id="c8d" />
      <SourceLine text={SRC} t={s} />
    </g>
  );
};

// ---------- C9: the pilot: name card (silhouette, no face) ----------
export const C9: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="c9" />
      <JetTop x={-260 + ((t * 7) % 2500)} y={210} len={260} rot={0} color="#4C5B6B" />
      <NameCard id="c9n" x={960} y={590} rank="PHI CÔNG" name="NGUYỄN THÀNH TRUNG" sub="không quân Sài Gòn" s={s} at={0.1} nameSize={70} />
      <DateChip label="08.04.1975" t={s} id="c9d" />
    </g>
  );
};

// ---------- C10: "thực chất là người của phía cách mạng, hoạt động bí mật nhiều năm": the badge flips from VNCH to the NLF flag ----------
export const C10: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), flip = easeInOut(ramp(s, 0.8, 1.3)), ang = flip * Math.PI, face = flip < 0.5 ? 'RVN' : 'PRG';
  const spot = 0.35 + 0.65 * ramp(s, 0, 1.4);
  return (
    <g>
      <Backdrop s={s} id="c10" top="#0B1624" bottom="#04080F" />
      <ellipse cx={960} cy={640} rx={420 * spot} ry={470 * spot} fill="#2F4660" opacity={0.28} />
      <Silhouette x={960} y={900} s={2.5} color="#0F1824" rim="#6E8AA8" />
      <g transform={`translate(960,760) scale(${Math.max(0.02, Math.abs(Math.cos(ang)))},1)`}>
        <FlagCloth id="c10f" x={-90} y={-60} w={180} h={120} kind={face} wave={0} />
      </g>
      <Txt x={960} y={150} text="NGƯỜI CỦA PHÍA CÁCH MẠNG" size={72} color="#FF8A7A" o={ramp(s, 1.0, 1.4)} />
      <Txt x={960} y={1000} text="HOẠT ĐỘNG BÍ MẬT NHIỀU NĂM" size={62} color={GOLD} o={ramp(s, 2.1, 2.5)} />
      <g opacity={ramp(s, 2.1, 2.5)}>
        <line x1={300} y1={930} x2={300 + 1320 * ramp(s, 2.2, 3.4)} y2={930} stroke={GOLD} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={300 + i * 165} y1={912} x2={300 + i * 165} y2={948} stroke={GOLD} strokeWidth={6} opacity={ramp(s, 2.2 + i * 0.13, 2.4 + i * 0.13)} />)}
      </g>
    </g>
  );
};

// ---------- C11: "thiệt hại không lớn": the roof, red circle where the bomb fell (photo of 2007) ----------
export const C11: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="c11" />
      <Txt x={1160} y={116} text="THIỆT HẠI KHÔNG LỚN" size={64} o={ramp(s, 0.05, 0.3)} />
      <PhotoCard t={s} src={`${IMG}san-thuong-dau-bom-8-4-1975.jpg`} caption="Sân thượng Dinh: vòng đỏ chỉ chỗ bom rơi 08.04.1975 (ảnh chụp 2007)" credit={credit('Kenohori', 'CC0')}
        x={960} y={570} w={1000} h={665} rot={1.2} from={0.1} to={s + 2} id="c11p" kb={{ z0: 1.0, z1: 1.15, px0: -0.03, py0: 0.02, px1: 0.03, py1: -0.02 }} fromSide="bottom" />
      <DateChip label="08.04.1975" t={s} id="c11d" />
    </g>
  );
};

// ---------- C12: "chiến tranh đã đến rất gần": a red ring closes in on the city, the RVN ball looks on, worried ----------
export const C12: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAM.cityWide }, { t: 2.6, ...CAM.cityWide, zoom: 5800, ease: 'linear' }], s);
  const [x, y] = project(cam, 106.69, 10.79), k = easeInOut(ramp(s, 0.2, 2.3)), R = 1150 - 800 * k;
  return (
    <g>
      <GeoMap camera={cam} id="c12m" colors={LAND}><SaigonLabels /><SaigonSites only={['dinhDocLap', 'tanSonNhat', 'cauSaiGon']} /></GeoMap>
      <rect width={1920} height={1080} fill="#2A0A0A" opacity={0.1 + 0.3 * k} />
      <circle cx={x} cy={y} r={R} fill="none" stroke="#E0483C" strokeWidth={14} strokeDasharray="46 22" strokeDashoffset={-t * 2} opacity={0.9} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.2, r0 = R + 70, r1 = R + 10;
        return <polygon key={i} points="0,-22 36,0 0,22" fill="#E0483C" stroke="#15151A" strokeWidth={4} opacity={clamp(k * 3)}
          transform={`translate(${x + Math.cos(a) * ((r0 + r1) / 2)},${y + Math.sin(a) * ((r0 + r1) / 2)}) rotate(${(a * 180) / Math.PI + 180})`} />;
      })}
      <Txt x={820} y={1000} text="CHIẾN TRANH ĐÃ ĐẾN RẤT GẦN" size={74} o={ramp(s, 0.7, 1.1)} />
      <Ball id="c12b" x={250} y={780} r={110} flag="RVN" eyes="worried" hat={<M1Helmet />} t={t} motion={mixMotion(breathe(t, 60, 0.035))} />
      <MiniMap camera={cam} id="c12mini" /><SourceLine text={SRC} t={s} />
    </g>
  );
};
