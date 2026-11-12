import React from 'react';
import { ShotProps } from '../../engine';
import { cameraAt } from '../../countryball/geo-camera';
import { useGeo } from '../../countryball/map-context';
import { FlagCloth } from '../../countryball/flag-cloth';
import { easeInOut } from '../../countryball/fx-math';
import { Dim, GOLD, NameCard, ramp, sec, Txt } from './chc-common';
import { CampaignMap, wideCam } from './chc-campaign-map';

// Chapter C, beat "5c plan" (C23-C26, 226.7-237.9 s): "đánh thật nhanh vào thẳng các cơ quan đầu não" (arrows rush in, the five targets light up with name pills),
// the Sài Gòn side collapses before the city becomes a battlefield (RVN flag sinks, "CHIẾN TRƯỜNG" struck out), Đại tướng Văn Tiến Dũng commands.

const S23 = 226.65, S24 = 229.06, S25 = 230.95, S26 = 233.74;
const CITY = { lon: 106.682, lat: 10.795, zoom: 8800 };

// ---------- C23: all five arrows, chevrons rushing toward the city: "ĐÁNH THẬT NHANH" ----------
export const C23: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), a = S23 + s, cam = cameraAt([{ t: S23, ...wideCam(S23) }, { t: 229.2, lon: 106.78, lat: 10.84, zoom: 2300, ease: 'inout' }], a);
  return (
    <g>
      <CampaignMap id="c23m" cam={cam} s={a} pins={{ at: -1, step: 0 }} flow={ramp(s, 0.2, 0.6)} />
      <Txt x={1400} y={116} text="KẾ HOẠCH" size={64} color={GOLD} o={ramp(s, 0.05, 0.3)} />
      <Txt x={1400} y={204} text="ĐÁNH THẬT NHANH" size={84} o={ramp(s, 0.95, 1.25)} />
    </g>
  );
};

// ---------- C24: the head-quarters light up one by one: "vào thẳng các cơ quan đầu não" ----------
const LIT24 = { bttm: 229.06, tsn: 229.26, bqp: 229.46, dinh: 229.66, biet: 229.86, tongnha: 230.06 };
export const C24: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), a = S24 + s, cam = cameraAt([{ t: S24, ...CITY }, { t: S25 + 0.5, ...CITY, zoom: CITY.zoom * 1.06, ease: 'linear' }], a);
  return (
    <g>
      <CampaignMap id="c24m" cam={cam} s={a} arrows={false} litAt={LIT24} allPills />
      <Txt x={1400} y={116} text="CƠ QUAN ĐẦU NÃO" size={78} o={ramp(s, 0.05, 0.3)} />
    </g>
  );
};

/** RVN flag planted on the Dinh that slides down its pole and dims (respectful, quiet): map child */
const SinkingFlag: React.FC<{ s: number; at: number }> = ({ s, at }) => {
  const { project } = useGeo(), [x, y] = project(106.6953, 10.7769), k = easeInOut(ramp(s, at, at + 1.3));
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={0} x2={0} y2={-150} stroke="#2A2A2E" strokeWidth={8} strokeLinecap="round" />
      <g opacity={1 - 0.5 * k}><FlagCloth id="c25f" x={4} y={-150 + k * 50} w={140} h={93} kind="RVN" wave={0.5 * (1 - k)} t={s * 30} /></g>
    </g>
  );
};

// ---------- C25: "để chính quyền Sài Gòn sụp đổ trước khi thành phố biến thành chiến trường" ----------
export const C25: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), a = S25 + s, cam = cameraAt([{ t: S25, lon: 106.69, lat: 10.785, zoom: 12500 }, { t: S26, lon: 106.692, lat: 10.784, zoom: 13200, ease: 'linear' }], a);
  const strike = ramp(s, 1.9, 2.5);
  return (
    <g>
      <CampaignMap id="c25m" cam={cam} s={a} arrows={false} targets={false} sites={['dinhDocLap']}><SinkingFlag s={s} at={0.1} /></CampaignMap>
      <Dim o={0.28 + 0.12 * ramp(s, 1.0, 1.4)} />
      <Txt x={960} y={250} text="THÀNH PHỐ BIẾN THÀNH" size={64} o={ramp(s, 1.15, 1.45)} />
      <g transform="translate(960,370) rotate(-3)" opacity={ramp(s, 1.4, 1.7) * (1 - 0.3 * strike)}>
        <rect x={-440} y={-80} width={880} height={160} rx={16} fill="#B3262B" fillOpacity={0.9} stroke="#F4E6C8" strokeWidth={7} />
        <Txt x={0} y={36} text="CHIẾN TRƯỜNG" size={116} stroke="none" />
        <line x1={-470} y1={-4} x2={-470 + 940 * strike} y2={-4} stroke={GOLD} strokeWidth={18} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- C26: "chỉ huy toàn bộ chiến dịch là Đại tướng Văn Tiến Dũng": name card over the dimmed five-arrow map ----------
export const C26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), a = S26 + s, cam = cameraAt([{ t: S26, lon: 106.82, lat: 10.875, zoom: 1760 }, { t: 238.2, lon: 106.81, lat: 10.87, zoom: 1820, ease: 'linear' }], a);
  return (
    <g>
      <CampaignMap id="c26m" cam={cam} s={a} pins={{ at: -1, step: 0 }} />
      <Dim o={0.55} />
      <NameCard id="c26n" x={960} y={540} rank="ĐẠI TƯỚNG" name="VĂN TIẾN DŨNG" sub="Chỉ huy Chiến dịch Hồ Chí Minh" s={s} at={1.0} cap />
    </g>
  );
};
