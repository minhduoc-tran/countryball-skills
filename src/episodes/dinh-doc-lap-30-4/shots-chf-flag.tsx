import React from 'react';
import { ShotProps } from '../../engine';
import { GateCrash } from '../../countryball/palace-gate-crash';
import { PalaceFacade } from '../../countryball/palace-facade';
import { FlagCloth } from '../../countryball/flag-cloth';
import { ClockChip } from '../../countryball/hud-clock-chip';
import { easeInOut, easeOut, prog } from '../../countryball/fx-math';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift, Plate, Slam, Veil } from './cha-common';
import { Pill, Sil, sec } from './chf-common';

// Chapter F, the flag (460.2-476.4 s): F23 Thận jumps off 843 and runs in with the flag, F24 he climbs to the roof (PalaceFacade climb), F25 the RVN
// flag is lowered, F26 the NLF (MTDTGP) flag rises, F27 the flag close-up, F28 11:30.

export const F23: React.FC<ShotProps> = ({ t, len }) => {
  const u = prog(t, 14, len), jump = Math.sin(Math.PI * Math.min(1, prog(t, 0, 22))) * 40;
  return (
    <g>
      <Drift t={t} len={len} z0={1} z1={1.07} cx={1100} cy={720}>
        <GateCrash id="f23" variant="side" crash={0.82} t={t + 150} />
        <Sil x={810 + 700 * u} y={880 - 130 * (1 - prog(t, 0, 16)) - jump * (1 - prog(t, 0, 16))} s={1.3} pose="run" t={t} carry color="#1A2430" />
      </Drift>
      <Veil id="f23" o={0.35} />
      <Pill t={t} at={6} x={960} y={170} text="BÙI QUANG THẬN" size={58} fill="#2F5FB4" />
    </g>
  );
};

export const F24: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.06} cx={960} cy={620}>
      <PalaceFacade id="f24" x={960} y={1000} w={1500} flag="RVN" climb={prog(t, 2, len - 4)} t={t} />
    </Drift>
    <Veil id="f24" o={0.3} />
    <Out x={960} y={130} size={84} opacity={prog(t, 4, 16)}>LEO LÊN TẬN NÓC DINH</Out>
  </g>
);

export const F25: React.FC<ShotProps> = ({ t }) => (
  <g>
    <PalaceFacade id="f25" x={960} y={1620} w={2600} flag="RVN" climb={1} flagRaise={1 - easeInOut(prog(t, 8, 52))} t={t} />
    <rect width={1920} height={1080} fill="#0A1220" opacity={0.2 + 0.1 * prog(t, 0, 50)} />
    <Out x={960} y={1000} size={60} opacity={prog(t, 10, 22)}>CỜ VIỆT NAM CỘNG HÒA HẠ XUỐNG</Out>
  </g>
);

export const F26: React.FC<ShotProps> = ({ t }) => (
  <g>
    <PalaceFacade id="f26" x={960} y={1620} w={2600} flag="PRG" climb={1} flagRaise={easeInOut(prog(t, 8, 66))} t={t} />
    <Out x={960} y={1000} size={60} opacity={prog(t, 10, 22)}>NỬA ĐỎ · NỬA XANH</Out>
  </g>
);

export const F27: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 0, 14));
  return (
    <g>
      <defs><linearGradient id="f27-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5C9BD0" /><stop offset="1" stopColor="#CFE6F4" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#f27-sky)" />
      <g transform={`translate(${960 - 60 * (1 - k)},470) scale(${0.9 + 0.1 * k + 0.05 * prog(t, 0, 110)})`}>
        <rect x={-452} y={-330} width={14} height={720} rx={6} fill="#6A4B2A" stroke="#201408" strokeWidth={4} />
        <FlagCloth id="f27-flag" x={-440} y={-320} w={900} h={600} kind="PRG" wave={1} t={t} />
      </g>
      <Plate t={t} a={40} x={960} y={930} w={1400} lines={[{ text: 'MẶT TRẬN DÂN TỘC GIẢI PHÓNG MIỀN NAM', size: 52 }]} />
      <Pill t={t} at={4} x={1560} y={190} text="SAO VÀNG" size={52} fill="#B78F10" />
      {t > 6 && <line x1={1470} y1={230} x2={1150} y2={330} stroke="#201408" strokeWidth={6} strokeLinecap="round" opacity={prog(t, 6, 16)} />}
    </g>
  );
};

export const F28: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.06} cx={960} cy={500}>
      <PalaceFacade id="f28" x={960} y={1620} w={2600} flag="PRG" climb={1} flagRaise={1} t={t + 90} />
    </Drift>
    <Veil id="f28" o={0.25} />
    <Slam t={t} a={14} x={960} y={900} size={230}>11:30</Slam>
    <ClockChip date="30.04.1975" clock="11:30" t={sec(t)} id="f28-ck" />
  </g>
);
