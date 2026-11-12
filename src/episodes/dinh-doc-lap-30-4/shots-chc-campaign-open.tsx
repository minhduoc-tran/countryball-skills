import React from 'react';
import { ShotProps } from '../../engine';
import { ClockChip } from '../../countryball/hud-clock-chip';
import { FlagCloth } from '../../countryball/flag-cloth';
import { cameraAt } from '../../countryball/geo-camera';
import { useGeo } from '../../countryball/map-context';
import { backOut, easeOut } from '../../countryball/fx-math';
import { Backdrop, GOLD, Pop, ramp, sec, Txt } from './chc-common';
import { CAM, CampaignMap, wideCam } from './chc-campaign-map';
import { ClockFace } from './chc-icons';

// Chapter C, beat "5 five columns" (C13-C16, 198.4-208.0 s): 17:00 on 26.04.1975 the campaign opens; "look at the map": Sài Gòn in the middle, five
// columns closing in from five directions (numbered start pins pop in; the arrows follow in the next shots).

// ---------- C13: "năm giờ chiều ngày 26 tháng Tư": a dusk sky, the clock hands arrive at five ----------
export const C13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), arrive = easeOut(ramp(s, 0.1, 1.1)), pulse = ramp(s, 1.1, 1.6);
  return (
    <g>
      <defs><linearGradient id="c13sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B2F57" /><stop offset="0.55" stopColor="#B7603F" /><stop offset="1" stopColor="#E9A04B" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#c13sky)" />
      <circle cx={1500} cy={800 + 20 * s} r={150} fill="#FFD28A" opacity={0.85} /><circle cx={1500} cy={800 + 20 * s} r={230} fill="#FFD28A" opacity={0.18} />
      <rect y={930} width={1920} height={150} fill="#1B1520" />
      <circle cx={620} cy={500} r={250 + 24 + 30 * pulse} fill="none" stroke={GOLD} strokeWidth={6} opacity={(1 - pulse) * 0.8 * (pulse > 0 ? 1 : 0)} />
      <ClockFace x={620} y={500} r={250} h={4 + arrive} m={(1 - arrive) * 50} />
      <Pop s={s} at={0.6} x={1290} y={440}><Txt x={1290} y={440} text="17:00" size={190} color="#FFF3D6" /></Pop>
      <Pop s={s} at={0.9} x={1290} y={560}><Txt x={1290} y={560} text="26.04.1975" size={80} color={GOLD} /></Pop>
      <ClockChip date="26.04.1975" clock="17:00" t={s} id="c13ck" />
    </g>
  );
};

// ---------- C14: title stamp "CHIẾN DỊCH HỒ CHÍ MINH" ----------
export const C14: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = backOut(ramp(s, 0.15, 0.6));
  return (
    <g>
      <Backdrop s={s} id="c14" top="#4A1418" bottom="#14070A" />
      {Array.from({ length: 16 }, (_, i) => <polygon key={i} points="0,0 -60,-1200 60,-1200" fill="#FFCD00" opacity={0.045} transform={`translate(960,560) rotate(${i * 22.5 + s * 3})`} />)}
      <g opacity={ramp(s, 0, 0.3)}>
        <line x1={190} y1={250} x2={190} y2={900} stroke="#2A2A2E" strokeWidth={12} strokeLinecap="round" />
        <FlagCloth id="c14f" x={196} y={262} w={380} h={253} kind="VNM" wave={0.7} t={t} />
      </g>
      <g transform={`translate(1130,520) scale(${0.5 + 0.5 * k})`} opacity={k > 0.02 ? 1 : 0}>
        <Txt x={0} y={-150} text="CHIẾN DỊCH" size={120} color="#F4E6C8" />
        <Txt x={0} y={-10} text="HỒ CHÍ MINH" size={170} color="#FFCD00" />
        <rect x={-440} y={50} width={880} height={96} rx={14} fill="#B3262B" stroke="#F4E6C8" strokeWidth={6} />
        <Txt x={0} y={124} text="CHÍNH THỨC BẮT ĐẦU" size={64} stroke="none" />
      </g>
      <ClockChip date="26.04.1975" clock="17:00" t={s} id="c14ck" />
    </g>
  );
};

const S15 = 202.82;
const introCam = (a: number) => (a < 204.7 ? cameraAt([{ t: S15, ...CAM.southEast }, { t: 204.7, ...wideCam(204.7), ease: 'out' }], a) : wideCam(a));

/** ring + big label "SÀI GÒN" on the city (map child) */
const SaigonCentre: React.FC<{ s: number; at: number; label: boolean }> = ({ s, at, label }) => {
  const { project } = useGeo(), [x, y] = project(106.7, 10.79), pulse = ((s - at) * 1.1) % 1, k = backOut(ramp(s, at, at + 0.4));
  if (s < at) return null;
  return (
    <g>
      <circle cx={x} cy={y} r={30 + pulse * 90} fill="none" stroke="#FF5A5F" strokeWidth={6} opacity={1 - pulse} />
      <circle cx={x} cy={y} r={18 * k} fill="#FF5A5F" stroke="#15151A" strokeWidth={5} />
      {label && <g opacity={k}>
        <line x1={x} y1={y - 22} x2={x} y2={y - 100} stroke="#15151A" strokeWidth={5} />
        <Txt x={x} y={y - 120} text="SÀI GÒN" size={64} color="#FFF3D6" />
      </g>}
    </g>
  );
};

// ---------- C15: "hãy nhìn bản đồ. Sài Gòn nằm ở giữa": fly into the battle area, Sài Gòn marked in the middle ----------
export const C15: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), a = S15 + s, cam = introCam(a);
  return (
    <g>
      <CampaignMap id="c15m" cam={cam} s={a} arrows={false}>
        <SaigonCentre s={a} at={203.7} label />
      </CampaignMap>
      <g opacity={1 - ramp(s, 0.95, 1.15)}><Txt x={1380} y={116} text="HÃY NHÌN BẢN ĐỒ" size={70} o={ramp(s, 0.05, 0.3)} /></g>
      <Txt x={1380} y={116} text="SÀI GÒN Ở GIỮA" size={70} o={ramp(s, 1.1, 1.4)} />
    </g>
  );
};

// ---------- C16: "năm cánh quân đang khép lại từ năm hướng": five numbered start points pop in around the city ----------
export const C16: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), a = 205.13 + s;
  return (
    <g>
      <CampaignMap id="c16m" cam={wideCam(a)} s={a} arrows={false} pins={{ at: 205.4, step: 0.3 }}>
        <SaigonCentre s={a} at={0} label={false} />
      </CampaignMap>
      <Txt x={1380} y={116} text="NĂM CÁNH QUÂN" size={72} o={ramp(s, 0.05, 0.3)} />
      <Txt x={1380} y={196} text="NĂM HƯỚNG" size={60} color={GOLD} o={ramp(s, 1.4, 1.7)} />
    </g>
  );
};
