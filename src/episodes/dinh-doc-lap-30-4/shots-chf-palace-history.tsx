import React from 'react';
import { ShotProps } from '../../engine';
import { PalaceFacade } from '../../countryball/palace-facade';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { Glow } from '../../countryball/fx-glow';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift, Plate, Slam, Veil } from './cha-common';
import { Back, PhotoF, Pill, Sil, SkyraiderSide, Who } from './chf-common';

// Chapter F, the palace's story (403.4-422.3 s): F1 "chưa đầy mười năm tuổi" (same façade as A4), F2 Dinh Norodom 1961, F3 two Sài Gòn air-force
// pilots, F4 27.02.1962 bombing (smoke only), F5 architect Ngô Viết Thụ, F6 31.10.1966 opening, F7 photo 1969, F8 bamboo-screen detail.

export const F1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.08} cx={960} cy={900}>
      <PalaceFacade id="f1" x={960} y={930} w={1700} flag="RVN" t={t} />
    </Drift>
    <Veil id="f1" o={0.3} />
    <Out x={960} y={1030} size={104} opacity={prog(t, 4, 16)}>CHƯA ĐẦY 10 NĂM TUỔI</Out>
  </g>
);

export const F2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Back id="f2" />
    <PhotoF id="f2p" k="norodom" t={t} x={960} y={560} w={1100} rot={-1.5} kb={{ z0: 1, z1: 1.12, px0: 0.02, px1: -0.03 }} sepia={0.15} />
    <Out x={960} y={118} size={92} opacity={prog(t, 8, 20)}>DINH CŨ: DINH NORODOM</Out>
  </g>
);

const BOMB_AT = 24; // frame of F4 where the bombs hit

export const F3: React.FC<ShotProps> = ({ t, len }) => {
  const run = prog(t, 0, len);
  return (
    <g>
      <Back id="f3" />
      <PhotoF id="f3p" k="norodom" t={t} x={960} y={480} w={1000} rot={-1.5} from={-1} />
      <rect width={1920} height={1080} fill="#050A14" opacity={0.5} />
      <SkyraiderSide x={-160 + 2300 * run} y={190} size={280} t={t} />
      <SkyraiderSide x={-440 + 2300 * run} y={290} size={280} t={t} />
      <Plate t={t} a={10} x={960} y={600} w={1240} lines={[{ text: 'HAI PHI CÔNG KHÔNG QUÂN SÀI GÒN', size: 56 }, { text: 'Nguyễn Văn Cử · Phạm Phú Quốc', size: 40, fill: '#E2B95A' }]} />
    </g>
  );
};

const Bomb: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse rx={13} ry={30} fill="#2B3138" stroke="#0A0A0A" strokeWidth={3} /><path d="M-13,-26 L-24,-44 L24,-44 L13,-26 Z" fill="#46505B" stroke="#0A0A0A" strokeWidth={3} />
  </g>
);

export const F4: React.FC<ShotProps> = ({ t }) => {
  const hit = t >= BOMB_AT, f = prog(t, BOMB_AT, BOMB_AT + 16);
  return (
    <g>
      <Back id="f4" />
      <PhotoF id="f4p" k="norodom" t={t} x={960} y={480} w={1000} rot={-1.5} from={-1} />
      <rect width={1920} height={1080} fill="#050A14" opacity={0.42 + 0.2 * prog(t, BOMB_AT, 60)} />
      {!hit && [0, 1].map((i) => <Bomb key={i} x={820 + i * 170} y={-60 + (t - i * 4) * 22} />)}
      {hit && <Glow x={900} y={620} r={120 + 220 * easeOut(f)} color="#FFB347" o={0.9 * (1 - f)} />}
      <SmokeColumn t={t} t0={BOMB_AT} x={860} y={640} h={380} w={50} lean={0.25} life={110} color="#4A4A52" />
      <SmokeColumn t={t} t0={BOMB_AT + 6} x={1040} y={630} h={320} w={44} lean={0.2} life={110} color="#4A4A52" />
      <Slam t={t} a={14} x={960} y={790} size={170}>27.02.1962</Slam>
      <Out x={960} y={1030} size={56} opacity={prog(t, 28, 40)}>DINH NORODOM BỊ NÉM BOM</Out>
    </g>
  );
};

/** Blueprint grid backdrop. */
const Blueprint: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <defs>
      <pattern id={`${id}-g`} width={60} height={60} patternUnits="userSpaceOnUse"><path d="M60,0 L0,0 L0,60" fill="none" stroke="#7FB0E0" strokeWidth={1.6} opacity={0.35} /></pattern>
      <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#154B86" /><stop offset="1" stopColor="#0B2D55" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}-b)`} />
    <rect width={1920} height={1080} fill={`url(#${id}-g)`} transform={`translate(${-(t * 0.4) % 60},0)`} />
  </g>
);

export const F5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Blueprint id="f5" t={t} />
    <Drift t={t} len={len} z0={1} z1={1.07} cx={960} cy={800}>
      <PalaceFacade id="f5" x={960} y={960} w={1400} flag="none" backdrop={false} t={t} />
    </Drift>
    <rect width={1920} height={1080} fill="#0B2D55" opacity={0.35} />
    <Who t={t} at={6} x={960} y={230} name="NGÔ VIẾT THỤ" sub="KIẾN TRÚC SƯ THIẾT KẾ DINH MỚI" w={1120} accent="#4F7FC4" />
    <Sil x={1700} y={1050} s={1.3} color="#0B1A30" pose="stand" />
  </g>
);

export const F6: React.FC<ShotProps> = ({ t, len }) => {
  const cut = prog(t, 30, 44), drop = easeOut(cut);
  return (
    <g>
      <Drift t={t} len={len} z0={1} z1={1.07} cx={960} cy={900}>
        <PalaceFacade id="f6" x={960} y={930} w={1700} flag="RVN" t={t} />
        {/* red ribbon across the steps; at frame 30 it is cut and the two halves swing down */}
        {[-1, 1].map((sd) => {
          const ang = sd * 72 * drop;
          return (
            <g key={sd} transform={`translate(${960 + sd * 380},900) rotate(${ang})`}>
              <path d={`M0,0 Q${-sd * 190},${22 * (1 - drop)} ${-sd * 372},0`} fill="none" stroke="#C9343A" strokeWidth={18} strokeLinecap="round" />
              <circle r={15} fill="#E8B422" stroke="#7A1620" strokeWidth={3} />
            </g>
          );
        })}
      </Drift>
      <Veil id="f6" o={0.3} />
      <Out x={960} y={150} size={74} opacity={prog(t, 4, 14)}>KHÁNH THÀNH</Out>
      <Slam t={t} a={10} x={960} y={300} size={150}>31.10.1966</Slam>
    </g>
  );
};

export const F7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Back id="f7" />
    <PhotoF id="f7p" k="y1969" t={t} x={960} y={540} w={1000} rot={1.5} kb={{ z0: 1, z1: 1.1, px0: -0.02, px1: 0.03 }} sepia={0.1} />
    <Pill t={t} at={10} x={1520} y={170} text="DINH MỚI" size={52} fill="#2F5FB4" />
  </g>
);

export const F8: React.FC<ShotProps> = ({ t, len }) => {
  const u = prog(t, 0, len), w = 3900 + 500 * u;
  // zoom on the two "bamboo" screen floors: centre of the floors is ~ -270 design units above the ground line (w / 1500 px per unit)
  const k = w / 1500, x = 1160 - 520 * u;
  return (
    <g>
      <PalaceFacade id="f8" x={x} y={540 + 270 * k} w={w} flag="none" backdrop={false} t={t} />
      <rect width={1920} height={1080} fill="#0A1220" opacity={0.18} />
      <Out x={960} y={150} size={84} opacity={prog(t, 4, 16)}>MẶT TIỀN BÊ TÔNG</Out>
      <Out x={960} y={1000} size={104} fill="#FFE600" opacity={prog(t, 20, 34)}>NHƯ NHỮNG ĐỐT TRÚC</Out>
    </g>
  );
};
