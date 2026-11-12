import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { Camera, cameraAt } from '../../countryball/geo-camera';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { GeoMap } from '../../countryball/map-geo-map';
import { Parallel } from '../../countryball/map-labels';
import { DmzBand, QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { Glow } from '../../countryball/fx-glow';
import { localToScreen } from '../../countryball/citadel-geometry';
import { backOut, clamp, easeOut } from '../../countryball/fx-math';
import { Tag, VNM_RED, cameraOnLocal, driftKeys, PlanScene, Cap } from './chc-common';
import { Backdrop, Dim, FlagPin, FlagPole, GOLD, Head, MapHud, Pop, proj, QtMap, ramp, sec, Txt, Vignette } from './chg-common';
import { FlagRace } from './chg-flag-race';

// Chapter G, beat "30 border" + "30b flags" (G23-G30, 584.5-609.8 s): the Thạch Hãn becomes the border (two flags facing
// across the river), 19.03.1975 Quảng Trị liberated, 30.04.1975 unification (normal red VNM colour), then the flag race before the ceasefire.

// ---------- G23: "Sau hiệp định, dòng Thạch Hãn trở thành ranh giới." north bank red, south bank yellow ----------
export const G23: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = easeOut(ramp(s, 0.3, 1.2));
  return (
    <PlanScene t={t} id="g23" keys={driftKeys(cameraOnLocal(-620, 0, 0.3), cameraOnLocal(-560, 40, 0.34), 2.8)} date="1973" damage={0.9} labels={['river']} mini={false}
      over={(cam) => {
        const P = (x: number, y: number) => localToScreen(cam, x, y).join(',');
        const [rx, ry] = localToScreen(cam, -560, -420);
        return (
          <g>
            <defs>
              <filter id="g23-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={9} /></filter>
              <pattern id="g23-hr" width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={18} height={18} fill={VNM_RED} opacity={0.28} /><rect width={6} height={18} fill={VNM_RED} opacity={0.5} /></pattern>
              <pattern id="g23-hy" width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width={18} height={18} fill="#F2C230" opacity={0.2} /><rect width={6} height={18} fill="#F2C230" opacity={0.5} /></pattern>
            </defs>
            <polygon points={`${P(-1900, -1500)} ${P(-780, -1500)} ${P(-860, 0)} ${P(-940, 1500)} ${P(-1900, 1500)}`} fill="url(#g23-hr)" opacity={k} filter="url(#g23-soft)" />
            <polygon points={`${P(-420, -1500)} ${P(1900, -1500)} ${P(1900, 1500)} ${P(-420, 1500)}`} fill="url(#g23-hy)" opacity={k} filter="url(#g23-soft)" />
            <Tag t={t} at={20} x={rx - 340} y={ry + 520} text="RANH GIỚI" fill="#1B1B1B" size={64} />
            <Tag t={t} at={34} x={1450} y={210} text="PHÍA VNCH" fill="#8A6A10" size={42} />
            <Tag t={t} at={34} x={700} y={210} text="PHÍA QGP" fill="#B03029" size={42} />
          </g>
        );
      }} />
  );
};

// ---------- G24: "Bờ bắc và bờ nam, hai lá cờ nhìn nhau qua một dòng sông." ----------
export const G24: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), rise = easeOut(ramp(s, 1.3, 2.3));
  return (
    <g>
      <defs>
        <linearGradient id="g24-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1F3550" /><stop offset="1" stopColor="#D9A66B" /></linearGradient>
        <linearGradient id="g24-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3E6F94" /><stop offset="1" stopColor="#1A3550" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#g24-sky)" />
      <circle cx={960} cy={700} r={170} fill="#FFE7B0" opacity={0.5} />
      <path d="M0,760 Q480,720 760,790 L760,1080 L0,1080 Z" fill="#5C4A32" stroke="#141414" strokeWidth={6} />
      <path d="M1920,760 Q1440,720 1160,790 L1160,1080 L1920,1080 Z" fill="#6B5A38" stroke="#141414" strokeWidth={6} />
      <rect x={760} y={790} width={400} height={290} fill="url(#g24-water)" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${790 + (i % 2) * 40},${830 + i * 38} q40,-14 80,0 t80,0 t80,0`} stroke="#BFD9EA" strokeWidth={4} fill="none" opacity={0.5} strokeDashoffset={-t * (1 + i * 0.1)} strokeDasharray="60 30" />)}
      <Ball id="g24v" x={380} y={640} r={105} flag="VNM" eyes="determined" t={t} hat={<MuCoi camo />} motion={mixMotion(breathe(t, 76, 0.03), hopOnce(t, 56, 20, 30))} />
      <Ball id="g24r" x={1540} y={640} r={105} flag="RVN" eyes="worried" t={t} hat={<M1Helmet />} motion={breathe(t, 80, 0.03, 12)} />
      <FlagPole x={640} y={790} h={470} flag="VNM" t={t} dir={1} cw={250} rise={rise} />
      <FlagPole x={1280} y={790} h={470} flag="RVN" t={t} dir={-1} cw={250} rise={rise} ph={2} />
      <Txt x={380} y={930} text="BỜ BẮC" size={72} color="#FFB3A8" o={ramp(s, 0.1, 0.5)} />
      <Txt x={1540} y={930} text="BỜ NAM" size={72} color="#FFE08A" o={ramp(s, 0.4, 0.8)} />
      <Txt x={960} y={1020} text="SÔNG THẠCH HÃN" size={44} color="#DDEAF5" o={ramp(s, 0.1, 0.5)} />
      <Head s={s} at={1.5} y={160} text="HAI LÁ CỜ NHÌN NHAU" size={96} />
      <Vignette id="g24" o={0.35} />
    </g>
  );
};

// ---------- G25: "Hai năm sau, ngày 19.3.1975," ----------
export const G25: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = backOut(ramp(s, 1.5, 2.0)), ring = ramp(s, 1.5, 2.4);
  return (
    <g>
      <Backdrop s={s} id="g25" />
      <Head s={s} at={0.05} y={250} text="HAI NĂM SAU" size={130} />
      <Txt x={620} y={420} text="1973" size={80} color="#8EA3BA" o={ramp(s, 0.3, 0.6)} />
      <line x1={760} y1={398} x2={760 + 400 * easeOut(ramp(s, 0.4, 1.4))} y2={398} stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
      <Txt x={1300} y={420} text="1975" size={80} color={GOLD} o={ramp(s, 1.2, 1.5)} />
      <g transform={`translate(960,720) scale(${0.6 + 0.4 * k})`} opacity={clamp(k * 2)}>
        <rect x={-430} y={-110} width={860} height={220} rx={30} fill="#15181F" stroke="#FF7A6B" strokeWidth={8} />
        <text y={52} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFF">19.03.1975</text>
      </g>
      {ring > 0 && <circle cx={960} cy={720} r={200 + ring * 300} fill="none" stroke="#FF7A6B" strokeWidth={6} opacity={(1 - ring) * 0.6} />}
    </g>
  );
};

// ---------- G26: "Quảng Trị được giải phóng hoàn toàn." normal red VNM colour from here ----------
export const G26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAMERAS.quangTriProvince, ease: 'linear' }, { t: 2.1, ...CAMERAS.quangTriProvince, zoom: CAMERAS.quangTriProvince.zoom * 1.1, ease: 'linear' }], s);
  const P = proj(cam), pts = [[107.185, 16.754], [107.09, 16.82], [106.95, 16.74], [107.21, 16.66], [107.02, 16.92]];
  const red = '#E0483C', k = easeOut(ramp(s, 0.2, 1.0));
  return (
    <g>
      <GeoMap camera={cam} id="g26m" provinces rivers provinceColors={{ 'Quảng Trị': red, 'Quảng Bình': '#C8573F' }} highlight={['Quảng Trị']}>
        <DmzBand opacity={0.5 * (1 - k)} /><QuangTriLabels /><QuangTriSites only={['quangTri', 'dongHa']} />
      </GeoMap>
      {pts.map(([lo, la], i) => { const [x, y] = P(lo, la); return <FlagPin key={i} x={x} y={y} flag="VNM" s={s} at={0.5 + i * 0.22} t={t} size={92} />; })}
      <Txt x={1010} y={225} text="QUẢNG TRỊ ĐƯỢC GIẢI PHÓNG" size={86} o={ramp(s, 0.1, 0.4)} />
      <MapHud s={s} cam={cam} date="19.03.1975" />
    </g>
  );
};

// ---------- G27: "Và chỉ hơn một tháng sau, đất nước thống nhất." the whole country red, the 17th parallel dissolves ----------
export const G27: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 107.4, lat: 16.2, zoom: 52, ease: 'linear' }, { t: 2.8, lon: 107.6, lat: 15.8, zoom: 60, ease: 'linear' }], s);
  const P = proj(cam), cities: [number, number][] = [[105.85, 21.03], [107.6, 16.46], [108.22, 16.05], [106.7, 10.78]];
  const fade = 1 - ramp(s, 1.0, 1.8);
  return (
    <g>
      <GeoMap camera={cam} id="g27m">
        <g opacity={fade}><Parallel lat={17} color="#FFFFFF" labelX={1500} /></g>
      </GeoMap>
      {cities.map(([lo, la], i) => { const [x, y] = P(lo, la); return <FlagPin key={i} x={x} y={y} flag="VNM" s={s} at={0.4 + i * 0.45} t={t} size={100} />; })}
      <DateChip dates={[{ t: 0, label: '19.03.1975' }, { t: 0.8, label: '30.04.1975' }]} t={s} id="g27-date" />
      <Head s={s} at={0.9} y={990} text="ĐẤT NƯỚC THỐNG NHẤT" size={92} />
      <MiniMap camera={cam} id="g27-mini" />
    </g>
  );
};
