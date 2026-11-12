import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { M1Helmet, NavyCap } from '../../countryball/ball-accessories-military';
import { breathe, hopOnce, lookTilt, mixMotion } from '../../countryball/ball-motion';
import { MapFlag } from '../../countryball/flag-cloth';
import { CarrierDeck } from '../../countryball/carrier-deck';
import { City, CityDef } from '../../countryball/map-labels';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { SIDE, SgMap, Slam, Veil } from './cha-common';
import { At, GeoDash, LL } from './cha-bits';

// Chapter A, Phước Long (69.2-83.1 s): A26 "06.01.1975", A27 the PRG flag over Phước Long, A28 pull back: north of Sài Gòn, "một phép thử",
// A29 both sides wait to see whether the US comes back, A30 the US stays away (carrier deck, nothing takes off).

const PL: LL = [106.98, 11.82];
const SG: LL = [106.7, 10.78];
const PLACE: Record<string, CityDef> = {
  phuocLong: { lon: PL[0], lat: PL[1], name: 'Phước Long', anchor: 'r', glow: 1 },
  saigon: { lon: SG[0], lat: SG[1], name: 'Sài Gòn', anchor: 'r', glow: 1.2 },
};
const Pulse: React.FC<{ t: number; a: number; color?: string }> = ({ t, a, color = SIDE.vnm }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const u = (((t - a) / 36) + i / 3) % 1;
      return t >= a ? <circle key={i} r={22 + 70 * u} fill="none" stroke={color} strokeWidth={6 * (1 - u) + 1} opacity={0.9 * (1 - u)} /> : null;
    })}
    {t >= a && <circle r={34} fill={color} opacity={0.28} />}
  </g>
);

export const A26: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a26" credit={false} date="06.01.1975" keys={[{ t: 0, lon: 107.2, lat: 12.6, zoom: 190 }, { t: 2.4, lon: 107.1, lat: 11.9, zoom: 330, ease: 'out' }]}
    over={() => <Slam t={t} a={8} x={1230} y={260} size={150}>06.01.1975</Slam>}>
    <City {...PLACE.saigon} />
    <City {...PLACE.phuocLong} />
  </SgMap>
);

export const A27: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a27" credit={false} date="06.01.1975" keys={[{ t: 0, lon: 107.1, lat: 11.9, zoom: 330 }, { t: 2.5, lon: 107.0, lat: 11.75, zoom: 520, ease: 'out' }]}
    over={() => (
      <g>
        <Out x={800} y={970} size={58} opacity={prog(t, 28, 40)}>QUÂN GIẢI PHÓNG LÀM CHỦ PHƯỚC LONG</Out>
      </g>
    )}>
    <City {...PLACE.saigon} />
    <At lon={PL[0]} lat={PL[1]}><Pulse t={t} a={8} /></At>
    <City {...PLACE.phuocLong} />
    {t >= 10 && <MapFlag lon={PL[0]} lat={PL[1]} kind="PRG" size={100} t={t} id="a27f" />}
  </SgMap>
);

export const A28: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a28" credit={false} date="06.01.1975" keys={[{ t: 0, lon: 107.0, lat: 11.75, zoom: 520 }, { t: 2.8, lon: 106.9, lat: 11.3, zoom: 330, ease: 'inout' }]}
    over={() => (
      <g>
        <Tag x={960} y={150} text="Ở PHÍA BẮC SÀI GÒN" size={50} opacity={prog(t, 10, 22)} />
        <Slam t={t} a={46} x={820} y={960} size={150}>MỘT PHÉP THỬ</Slam>
      </g>
    )}>
    <City {...PLACE.saigon} />
    <City {...PLACE.phuocLong} />
    <MapFlag lon={PL[0]} lat={PL[1]} kind="PRG" size={92} t={t} id="a28f" />
    <GeoDash t={t} t0={14} route={[PL, SG]} />
  </SgMap>
);

const Horizon: React.FC<{ id: string; dusk?: boolean }> = ({ id, dusk = true }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16223D" /><stop offset="0.6" stopColor={dusk ? '#9A5A4A' : '#6FA0C8'} /><stop offset="1" stopColor={dusk ? '#E7A25A' : '#BFDDF0'} /></linearGradient>
      <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24405F" /><stop offset="1" stopColor="#0C1626" /></linearGradient>
    </defs>
    <rect width={1920} height={700} fill={`url(#${id}-sky)`} />
    <rect y={700} width={1920} height={380} fill={`url(#${id}-sea)`} />
  </g>
);

export const A29: React.FC<ShotProps> = ({ t }) => {
  const lt = lookTilt(t, 90, 4);
  return (
    <g>
      <Horizon id="a29" />
      <Veil id="a29" o={0.4} />
      <Ball id="a29v" x={620} y={800} r={150} flag="VNM" eyes="worried" look={0.7} tilt={lt.tilt} hat={<MuCoi camo />} motion={breathe(t, 70, 0.03)} t={t} />
      <Ball id="a29r" x={1020} y={810} r={150} flag="RVN" eyes="worried" look={0.7} tilt={-lt.tilt} hat={<M1Helmet />} motion={breathe(t, 74, 0.03, 20)} t={t} />
      <Out x={1560} y={400} size={330} fill="#FFE600" opacity={prog(t, 12, 24)} rot={6}>?</Out>
      <Out x={780} y={170} size={96} opacity={prog(t, 4, 16)}>CẢ HAI PHÍA CÙNG CHỜ</Out>
      <Tag x={1480} y={560} text="MỸ CÓ QUAY LẠI KHÔNG?" size={44} opacity={prog(t, 40, 52)} />
    </g>
  );
};

export const A30: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Horizon id="a30" />
    <CarrierDeck id="a30" x={1020 - 40 * prog(t, 0, len)} y={640} s={1.15} land={0} push={0} t={t} tone="dusk" backdrop={false} />
    <Ball id="a30u" x={330} y={612} r={100} flag="USA" eyes="sad" tilt={-4} hat={<NavyCap />} motion={mixMotion(breathe(t, 76, 0.03), hopOnce(t, 6, 14, 14))} t={t} />
    <Veil id="a30" o={0.45} />
    <Slam t={t} a={20} x={960} y={190} size={120} fill="#FFFFFF">MÁY BAY MỸ</Slam>
    <Slam t={t} a={44} x={960} y={330} size={140} fill="#FFE600">ĐÃ KHÔNG QUAY LẠI</Slam>
    <rect width={1920} height={1080} fill="#04070D" opacity={0.5 * prog(t, len - 34, len - 2)} />
  </g>
);
