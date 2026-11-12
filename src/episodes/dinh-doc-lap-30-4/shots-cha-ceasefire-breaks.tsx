import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { MapFlag, FlagKind } from '../../countryball/flag-cloth';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { TankSide } from '../../countryball/ground-tanks';
import { HeliSide } from '../../countryball/ground-helicopters';
import { UnitBox } from '../../countryball/ground-front-arrows';
import { City, CITIES } from '../../countryball/map-labels';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { SIDE, SgMap, Slam, Veil } from './cha-common';
import { At, CardBg, LL } from './cha-bits';

// Chapter A, the ceasefire breaks (52.6-69.2 s): A21 gunfire + both sides keep what they hold (flags pop), A22 fighting flares across the South,
// A23 "quân đội Sài Gòn vẫn còn rất đông, có máy bay, có xe tăng", A24 US aid shrinks (gauge), A25 ammo + fuel run short (gauges).

const SOUTH = { lon: 107.0, lat: 12.9, zoom: 150 };
const HELD: { p: LL; k: FlagKind; at: number }[] = [
  { p: [106.98, 11.82], k: 'PRG', at: 50 }, { p: [106.7, 10.78], k: 'RVN', at: 58 }, { p: [106.1, 11.3], k: 'PRG', at: 66 }, { p: [108.22, 16.05], k: 'RVN', at: 74 },
  { p: [107.9, 14.5], k: 'PRG', at: 82 }, { p: [109.19, 12.24], k: 'RVN', at: 90 }, { p: [104.95, 9.35], k: 'PRG', at: 98 }, { p: [105.78, 10.04], k: 'RVN', at: 106 },
  { p: [108.05, 13.98], k: 'RVN', at: 114 },
];
const BLASTS: LL[] = [[106.9, 11.6], [107.6, 12.4], [106.3, 10.5], [108.0, 14.8], [105.6, 9.6], [107.2, 11.1], [108.6, 13.2], [106.2, 11.8], [107.9, 15.6], [105.3, 10.4], [108.4, 11.9], [106.8, 10.2]];

const Pop: React.FC<{ t: number; a: number; lon: number; lat: number; kind: FlagKind; i: number }> = ({ t, a, lon, lat, kind, i }) => {
  if (t < a) return null;
  const ring = prog(t, a, a + 14);
  return (
    <g>
      <At lon={lon} lat={lat}>
        {ring < 1 && <circle r={20 + 70 * easeOut(ring)} fill="none" stroke={kind === 'PRG' ? SIDE.vnm : SIDE.rvn} strokeWidth={7 * (1 - ring) + 1} opacity={1 - ring} />}
      </At>
      <MapFlag lon={lon} lat={lat} kind={kind} size={74} t={t} id={`pop${i}`} />
    </g>
  );
};

export const A21: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a21" credit={false} keys={[{ t: 0, ...SOUTH }, { t: 5.0, ...SOUTH, lon: 107.1, zoom: 156 }]}
    over={() => (
      <g>
        <Out x={960} y={150} size={92} opacity={prog(t, 4, 14) * (1 - prog(t, 38, 48))}>TIẾNG SÚNG KHÔNG IM LẶNG</Out>
        <Out x={800} y={970} size={58} opacity={prog(t, 56, 68)}>HAI BÊN Ở LẠI VÙNG MÌNH ĐANG GIỮ</Out>
      </g>
    )}>
    <City {...CITIES.saigon} />
    {BLASTS.slice(0, 6).map(([lo, la], i) => <At key={i} lon={lo} lat={la}><GroundBlast t={t} t0={2 + i * 6} x={0} y={0} r={26} linger={50} /></At>)}
    {HELD.map((h, i) => <Pop key={i} t={t} a={h.at} lon={h.p[0]} lat={h.p[1]} kind={h.k} i={i} />)}
  </SgMap>
);

export const A22: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a22" credit={false} dim={0.18} keys={[{ t: 0, ...SOUTH, lon: 107.1, zoom: 156 }, { t: 3.2, ...SOUTH, lon: 107.0, zoom: 166 }]}
    over={() => <Out x={800} y={970} size={58} opacity={prog(t, 6, 18)}>GIAO TRANH LẠI NỔ RA KHẮP MIỀN NAM</Out>}>
    {HELD.map((h, i) => <MapFlag key={i} lon={h.p[0]} lat={h.p[1]} kind={h.k} size={74} t={t} id={`ms${i}`} />)}
    {BLASTS.map(([lo, la], i) => (
      <At key={i} lon={lo} lat={la}>
        <GroundBlast t={t} t0={Math.round(3 + i * 6.5)} x={0} y={0} r={30} linger={70} />
        <SmokeColumn t={t} t0={Math.round(6 + i * 6.5)} x={0} y={0} h={150} w={26} lean={0.4} life={90} />
      </At>
    ))}
  </SgMap>
);

export const A23: React.FC<ShotProps> = ({ t }) => {
  const rows = 3, per = 8;
  return (
    <g>
      <CardBg id="a23" a="#2A3A32" b="#0B120F" />
      <Veil id="a23" o={0.4} />
      <Ball id="a23b" x={430} y={590} r={170} flag="RVN" eyes="determined" tilt={-3} hat={<M1Helmet />} motion={breathe(t, 66, 0.03)} t={t} />
      <Out x={430} y={900} size={58} opacity={prog(t, 4, 14)}>QUÂN ĐỘI SÀI GÒN</Out>
      {Array.from({ length: rows * per }, (_, i) => {
        const r = Math.floor(i / per), c = i % per, a = 16 + i * 1.2, u = prog(t, a, a + 8);
        return <g key={i} opacity={u} transform={`translate(${860 + c * 78},${230 + r * 82 - (1 - u) * 20})`}><UnitBox x={0} y={0} kind="inf" color={SIDE.rvn} size={44} /></g>;
      })}
      <Out x={1170} y={190} size={50} opacity={prog(t, 14, 26)}>RẤT ĐÔNG</Out>
      {t >= 48 && <g transform={`translate(${1760 - 260 * easeOut(prog(t, 48, 64))},490)`}><HeliSide x={0} y={0} size={330} kind="uh1" t={t} /></g>}
      {t >= 48 && <Tag x={1230} y={630} text="CÓ MÁY BAY" size={40} opacity={prog(t, 56, 66)} />}
      {t >= 74 && <TankSide x={1740 - 500 * easeOut(prog(t, 74, 92))} y={900} size={400} kind="m48" t={t} id="a23t" />}
      {t >= 74 && <Tag x={1250} y={990} text="CÓ XE TĂNG" size={40} opacity={prog(t, 84, 94)} />}
    </g>
  );
};

/** A crate of aid: rows of boxes vanish as `k` goes 1 -> 0. */
const Crates: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const n = 12, left = Math.round(n * k);
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: n }, (_, i) => {
        const r = Math.floor(i / 4), c = i % 4;
        if (i >= left) return null;
        return <g key={i} transform={`translate(${c * 92},${-r * 82})`}><rect width={84} height={74} rx={6} fill="#B98A4E" stroke="#1B1208" strokeWidth={5} /><line x1={0} y1={26} x2={84} y2={26} stroke="#1B1208" strokeWidth={4} /><rect x={32} y={34} width={20} height={14} fill="#F6F0DC" stroke="#1B1208" strokeWidth={3} /></g>;
      })}
    </g>
  );
};

export const A24: React.FC<ShotProps> = ({ t }) => {
  const k = 1 - 0.8 * easeOut(prog(t, 14, 66)), col = k > 0.5 ? '#6BC36B' : k > 0.3 ? '#F2C230' : '#E5143A';
  return (
    <g>
      <CardBg id="a24" />
      <Veil id="a24" o={0.4} />
      <Ball id="a24u" x={400} y={640} r={160} flag="USA" eyes="worried" tilt={4} motion={mixMotion(breathe(t, 62, 0.03), hop(t, 40, 6))} t={t} />
      <Crates x={780} y={800} k={k} />
      <text x={960} y={190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F4F4F4" stroke="#0A101C" strokeWidth={9} paintOrder="stroke">VIỆN TRỢ TỪ MỸ</text>
      <rect x={560} y={240} width={800} height={52} rx={26} fill="#1B2433" stroke="#E2B95A" strokeWidth={6} />
      <rect x={566} y={246} width={788 * k} height={40} rx={20} fill={col} />
      <Slam t={t} a={26} x={1300} y={560} size={92} fill="#FFE600">NGÀY CÀNG</Slam>
      <Slam t={t} a={34} x={1300} y={660} size={92} fill="#FFE600">BỊ CẮT GIẢM</Slam>
    </g>
  );
};

/** Semi-circular fuel dial; needle falls from full to empty as k 1 -> 0. */
const Dial: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const ang = -180 + 180 * k;
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-170,0 A170,170 0 0 1 170,0 Z" fill="#F6F0DC" stroke="#151515" strokeWidth={8} />
      <path d="M-170,0 A170,170 0 0 1 -120,-120" fill="none" stroke="#E5143A" strokeWidth={22} />
      {Array.from({ length: 7 }, (_, i) => { const a = (-180 + i * 30) * Math.PI / 180; return <line key={i} x1={Math.cos(a) * 136} y1={Math.sin(a) * 136} x2={Math.cos(a) * 160} y2={Math.sin(a) * 160} stroke="#151515" strokeWidth={6} />; })}
      <text x={-142} y={-20} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#151515">E</text>
      <text x={112} y={-20} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#151515">F</text>
      <g transform={`rotate(${ang})`}><line x1={0} y1={0} x2={140} y2={0} stroke="#C8322A" strokeWidth={10} strokeLinecap="round" /></g>
      <circle r={16} fill="#151515" />
    </g>
  );
};

export const A25: React.FC<ShotProps> = ({ t }) => {
  const k = 1 - 0.92 * easeOut(prog(t, 8, 52)), rounds = Math.round(16 * k);
  return (
    <g>
      <CardBg id="a25" />
      <Veil id="a25" o={0.4} />
      <g transform="translate(560,560)">
        <Dial x={0} y={110} k={k} />
        <text y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#F4F4F4" stroke="#0A101C" strokeWidth={9} paintOrder="stroke">NHIÊN LIỆU</text>
      </g>
      <g transform="translate(1260,470)">
        {/* bullets standing in the open crate: they disappear from the right as the stock runs out */}
        {Array.from({ length: 16 }, (_, i) => (i < rounds ? (
          <g key={i} transform={`translate(${-170 + (i % 8) * 48},${i < 8 ? 40 : 6})`}>
            <rect x={-12} y={0} width={24} height={64} fill="#D9A93C" stroke="#151515" strokeWidth={4} />
            <path d="M-12,0 Q0,-42 12,0 Z" fill="#B5651D" stroke="#151515" strokeWidth={4} strokeLinejoin="round" />
          </g>
        ) : null))}
        <path d="M-210,90 L210,90 L196,250 L-196,250 Z" fill="#5E6B3A" stroke="#151515" strokeWidth={8} strokeLinejoin="round" />
        <rect x={-210} y={80} width={420} height={22} rx={6} fill="#4B5730" stroke="#151515" strokeWidth={7} />
        <rect x={-120} y={150} width={240} height={60} rx={8} fill="none" stroke="#E8E2C8" strokeWidth={6} opacity={0.7} />
        <path d="M-210,90 L-250,20 L-190,10" fill="none" stroke="#151515" strokeWidth={8} strokeLinecap="round" />
        <text y={340} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#F4F4F4" stroke="#0A101C" strokeWidth={9} paintOrder="stroke">ĐẠN DƯỢC</text>
      </g>
      <Slam t={t} a={26} x={960} y={190} size={120} fill="#E5143A">THIẾU HỤT</Slam>
    </g>
  );
};
