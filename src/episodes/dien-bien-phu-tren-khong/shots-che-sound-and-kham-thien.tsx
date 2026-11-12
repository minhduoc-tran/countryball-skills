import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { PilotHelmet } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { BurningBlocks } from '../../countryball/fx-burning-city';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { PhotoCard } from '../../countryball/photo-card';
import { LowerThird } from '../../countryball/hud-chips';
import { HanoiMap, Txt, QuietBackdrop, prog, easeOut, hash, PHOTO_CREDIT } from './che-map-and-text-helpers';
import { Candle, Incense, House, Waveform } from './che-quiet-icons';

// Chapter E part 3 (E22-E33, 7:48-8:21): the sound of those nights, Khâm Thiên (map + glow from far away, then quiet
// cards: 287, 56 candles, the memorial photo, incense). Nothing graphic. t = frames in shot, s = seconds.

const fi = (s: number, a: number, d = 0.4) => prog(s, a, a + d);
const dots = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------- E22: remembered through sound ----------
export const E22: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <QuietBackdrop id="e22" tint="#1D2638" />
      <Txt x={960} y={220} size={92} o={fi(s, 0.1)}>NHỚ BẰNG ÂM THANH</Txt>
      {[0, 1, 2, 3].map((i) => { const k = ((s * 0.55 + i * 0.25) % 1); return <circle key={i} cx={1500} cy={560} r={60 + k * 760} fill="none" stroke="#FFD166" strokeWidth={6} opacity={(1 - k) * 0.5} />; })}
      <Ball id="e22v" x={760} y={620} r={150} flag="VNM" eyes="worried" look={0.8} motion={breathe(t, 70, 0.035)} t={t} />
      {[0, 1].map((i) => <path key={i} d={`M${980 + i * 50},${520 - i * 20} Q${1020 + i * 50},620 ${980 + i * 50},${720 + i * 20}`} fill="none" stroke="#C9D3E3" strokeWidth={6} strokeLinecap="round" opacity={0.6} />)}
    </g>
  );
};

// ---------- E23: the low roar of bomber streams overhead ----------
export const E23: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <defs><linearGradient id="e23-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070D" /><stop offset="1" stopColor="#1B2336" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#e23-sky)" />
      {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={hash(i, 1) * 1920} cy={hash(i, 2) * 560} r={1.5 + hash(i, 3) * 2} fill="#DDE6FF" opacity={0.4 + 0.4 * Math.sin(t * 0.1 + i)} />)}
      {[0, 1, 2].map((i) => <AircraftSide key={i} kind="b52" size={170 + i * 20} x={((s * (110 + i * 25) + i * 560) % 2300) - 200} y={190 + i * 85 + 6 * Math.sin(s * 2 + i)} opacity={0.9} />)}
      <path d={`M0,${860} ${Array.from({ length: 64 }, (_, i) => `L${i * 30},${860 + Math.sin(i * 0.38 - t * 0.12) * (46 + 14 * Math.sin(t * 0.07))}`).join(' ')}`} fill="none" stroke="#FFD166" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
      <Txt x={960} y={1000} size={76} o={fi(s, 0.2)}>TIẾNG GẦM TRẦM TRÊN CAO</Txt>
    </g>
  );
};

// ---------- E24: a long chain of explosions (far away) ----------
export const E24: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, k = prog(t, 6, 56);
  return (
    <HanoiMap id="e24" s={s} date="12.1972" night={0.9} pulse={0.15} keys={[{ t: 0, lon: 105.8, lat: 21.0, zoom: 650 }, { t: 2.5, lon: 105.9, lat: 21.05, zoom: 700 }]}>
      {({ P }) => {
        const a = P(105.7, 20.96), b = P(106.0, 21.1);
        return (
          <g>
            <BombCarpet id="e24b" t={t} t0={6} from={a} to={b} dur={50} n={30} width={80} r={22} seed={4} linger={90} />
            <rect x={0} y={780} width={1920} height={300} fill="#05070B" opacity={0.55} />
            <Waveform x={780} y={900} w={1200} h={170} t={t} bars={60} color="#FF9A5A" energy={(u) => (u < k ? 0.35 + 0.65 * (hash(Math.round(u * 60), 5) > 0.35 ? 1 : 0.25) : 0.05)} />
            <Txt x={780} y={1030} size={50} o={fi(s, 0.2)}>bom nổ nối nhau thành một tràng dài</Txt>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E25: the ground shakes, window glass breaks on streets far away ----------
export const E25: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, th = (i: number) => Math.max(0, 1 - ((t + i * 13) % 34) / 8);
  const shake = s < 1.7 ? th(0) * 5 * Math.sin(t * 2.9) : 0, crack = prog(s, 2.3, 2.7), fall = Math.max(0, s - 2.7);
  const P0: [number, number] = [960, 470];
  const lines = [[-150, -120], [160, -150], [200, 140], [-170, 170], [10, -200], [40, 210], [-230, 10]];
  return (
    <g>
      <QuietBackdrop id="e25" tint="#1D2638" />
      <g transform={`translate(${shake},${shake * 0.7})`} opacity={1 - fi(s, 1.5, 0.3)}>
        <line x1={0} y1={800} x2={1920} y2={800} stroke="#3A4660" strokeWidth={6} />
        {Array.from({ length: 9 }, (_, i) => <House key={i} x={150 + i * 205} y={800} s={1.5} lit={0.8} hue={i} />)}
        <path d={`M0,880 ${Array.from({ length: 64 }, (_, i) => `L${i * 30},${880 + Math.sin(i * 1.3) * th(i % 3) * 40}`).join(' ')}`} fill="none" stroke="#FFD166" strokeWidth={5} />
        <Txt x={960} y={300} size={90} o={fi(s, 0.1)}>MẶT ĐẤT RUNG LÊN</Txt>
      </g>
      <g opacity={fi(s, 1.6, 0.3)}>
        <rect x={730} y={240} width={460} height={500} rx={10} fill="#25324A" stroke="#C4C8D2" strokeWidth={14} />
        <rect x={738} y={248} width={444} height={484} fill="#7FA6D0" opacity={0.25} />
        <line x1={960} y1={240} x2={960} y2={740} stroke="#C4C8D2" strokeWidth={10} /><line x1={730} y1={490} x2={1190} y2={490} stroke="#C4C8D2" strokeWidth={10} />
        {lines.map((l, i) => <line key={i} x1={P0[0]} y1={P0[1]} x2={P0[0] + l[0] * crack} y2={P0[1] + l[1] * crack} stroke="#EAF2FF" strokeWidth={4} />)}
        {fall > 0 && Array.from({ length: 9 }, (_, i) => <polygon key={i} points="0,0 26,6 8,30" fill="#BBD4F0" opacity={Math.max(0, 0.8 - fall * 0.6)} transform={`translate(${800 + hash(i, 1) * 320},${300 + hash(i, 2) * 330 + fall * fall * 600 * (0.6 + hash(i, 3))}) rotate(${fall * 300 * hash(i, 4)})`} />)}
        <Txt x={960} y={850} size={70} o={fi(s, 1.9)}>CỬA KÍNH VỠ, Ở NHỮNG CON PHỐ XA</Txt>
      </g>
    </g>
  );
};

// ---------- Khâm Thiên shared map keys ----------
const KT = { lon: 105.84, lat: 21.018 };
const KT_BLOCKS = { x: 560, y: 300, w: 800, h: 420 };

// ---------- E26: Khâm Thiên on the map, glow far away ----------
export const E26: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e26" s={s} date="26.12.1972" nightLabel="ĐÊM 9/12" night={0.92} pulse={0.12} keys={[{ t: 0, lon: 105.85, lat: 21.03, zoom: 800 }, { t: 3.5, lon: KT.lon, lat: KT.lat, zoom: 1700 }]}>
      {({ P }) => {
        const k = P(KT.lon, KT.lat);
        return (
          <g>
            {[0, 1].map((i) => <circle key={i} cx={k[0]} cy={k[1]} r={30 + ((s * 0.6 + i * 0.5) % 1) * 90} fill="none" stroke="#FF9A5A" strokeWidth={4} opacity={0.8 * (1 - ((s * 0.6 + i * 0.5) % 1))} />)}
            <LowerThird title="Phố Khâm Thiên, Hà Nội" sub="Một trong những nơi chịu thảm họa nặng nề nhất" from={0.4} t={s} />
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E27: a crowded neighbourhood in the city centre ----------
export const E27: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, sc = 1 + 0.04 * s;
  return (
    <HanoiMap id="e27" s={s} date="26.12.1972" nightLabel="ĐÊM 9/12" night={0.92} veil={0.35} keys={[{ t: 0, lon: KT.lon, lat: KT.lat, zoom: 1700 }, { t: 2.3, lon: KT.lon, lat: KT.lat, zoom: 1800 }]}>
      {() => (
        <g transform={`translate(960,520) scale(${sc}) translate(-960,-520)`}>
          <BurningBlocks id="e27" t={t} {...KT_BLOCKS} cols={12} rows={6} fireAt={9999} />
          <Txt x={960} y={230} size={72} o={fi(s, 0.1)}>KHU PHỐ ĐÔNG DÂN</Txt>
          <Txt x={960} y={800} size={48} fill="#FFD9A0" o={fi(s, 0.5)}>ở trung tâm Hà Nội</Txt>
        </g>
      )}
    </HanoiMap>
  );
};

// ---------- E28: about 2.000 houses destroyed in one night ----------
export const E28: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, n = Math.round(2000 * easeOut(prog(s, 0.6, 1.6)));
  return (
    <HanoiMap id="e28" s={s} date="26.12.1972" nightLabel="ĐÊM 9/12" night={0.92} veil={0.35} keys={[{ t: 0, lon: KT.lon, lat: KT.lat, zoom: 1800 }, { t: 3.1, lon: KT.lon, lat: KT.lat, zoom: 1900 }]}>
      {() => (
        <g>
          <BurningBlocks id="e28" t={t} {...KT_BLOCKS} cols={12} rows={6} fireAt={14} spread={70} fraction={0.8} />
          <BombCarpet id="e28b" t={t} t0={4} from={[KT_BLOCKS.x - 40, KT_BLOCKS.y]} to={[KT_BLOCKS.x + KT_BLOCKS.w + 40, KT_BLOCKS.y + KT_BLOCKS.h]} dur={30} n={14} width={160} r={22} seed={8} linger={60} />
          <Txt x={960} y={820} size={110} fill="#FFE2B0" o={fi(s, 1.0)}>{`≈ ${dots(n)}`}</Txt>
          <Txt x={960} y={910} size={52} o={fi(s, 1.2)}>ngôi nhà bị phá hủy trong một đêm</Txt>
        </g>
      )}
    </HanoiMap>
  );
};

// ---------- E29: 287 (quiet card) ----------
export const E29: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, n = Math.round(287 * easeOut(prog(s, 0.1, 1.1)));
  return (
    <g>
      <QuietBackdrop id="e29" />
      <Txt x={960} y={500} size={300} fill="#FFE2B0">{`${n}`}</Txt>
      <Txt x={960} y={620} size={72} o={fi(s, 0.6)}>người thiệt mạng</Txt>
      <Candle x={420} y={800} s={1.2} t={t} seed={1} /><Candle x={1500} y={800} s={1.2} t={t} seed={4} />
    </g>
  );
};

// ---------- E30: 56 children (56 candles) ----------
export const E30: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <QuietBackdrop id="e30" />
      <Txt x={500} y={540} size={280} fill="#FFE2B0" o={fi(s, 0.05)}>56</Txt>
      <Txt x={500} y={640} size={76} o={fi(s, 0.3)}>em nhỏ</Txt>
      {Array.from({ length: 56 }, (_, i) => {
        const c = i % 8, r = Math.floor(i / 8);
        return <Candle key={i} x={880 + c * 120} y={330 + r * 105} s={0.58} t={t} seed={i} o={fi(s, 0.25 + i * 0.022, 0.25)} />;
      })}
    </g>
  );
};

// ---------- E31/E32: the Khâm Thiên memorial photo ----------
const MemorialPhoto: React.FC<{ id: string; len: number; s: number; kb: { z0: number; z1: number; px0: number; py0: number; px1: number; py1: number }; x: number; y?: number; w: number; h: number }> = ({ id, len, s, kb, x, y = 500, w, h }) => (
  <PhotoCard src="dien-bien-phu-tren-khong/img/kham-thien-memorial.jpg" w={w} h={h} x={x} y={y} rot={-1} id={id} from={-3} to={len / 30 + 0.45} t={s}
    caption="Tượng đài tưởng niệm trên phố Khâm Thiên" credit={PHOTO_CREDIT.arjun} fromSide="bottom" kb={kb} />
);
export const E31: React.FC<ShotProps> = ({ t, len }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e31" s={s} date="Ngày nay" night={0} veil={0.7} keys={[{ t: 0, lon: KT.lon, lat: KT.lat, zoom: 1400 }, { t: 2.9, lon: KT.lon, lat: KT.lat, zoom: 1500 }]}>
      {() => (
        <g>
          <MemorialPhoto id="e31" len={len} s={s} x={640} w={560} h={747} kb={{ z0: 1.0, z1: 1.12, px0: 0, py0: 0, px1: 0, py1: 0.02 }} />
          <Txt x={1360} y={430} size={78} o={fi(s, 0.3)}>TƯỢNG ĐÀI</Txt>
          <Txt x={1360} y={520} size={78} o={fi(s, 0.4)}>KHÂM THIÊN</Txt>
          <Txt x={1360} y={600} size={44} fill="#FFD9A0" o={fi(s, 0.7)}>giữa phố, hôm nay</Txt>
        </g>
      )}
    </HanoiMap>
  );
};
export const E32: React.FC<ShotProps> = ({ t, len }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e32" s={s} date="Ngày nay" night={0} veil={0.78} keys={[{ t: 0, lon: KT.lon, lat: KT.lat, zoom: 1500 }, { t: 2.1, lon: KT.lon, lat: KT.lat, zoom: 1560 }]}>
      {() => (
        <g>
          <MemorialPhoto id="e32" len={len} s={s} x={960} y={500} w={600} h={800} kb={{ z0: 1.55, z1: 1.95, px0: -0.01, py0: 0.15, px1: 0, py1: 0.2 }} />
          <Txt x={960} y={1056} size={44} o={fi(s, 0.2)}>một người mẹ ôm đứa con nhỏ đã mất</Txt>
        </g>
      )}
    </HanoiMap>
  );
};

// ---------- E33: incense every year ----------
export const E33: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <QuietBackdrop id="e33" tint="#2E2016" />
      <Txt x={960} y={170} size={84} o={fi(s, 0.1)}>THẮP HƯƠNG MỖI NĂM</Txt>
      <Incense x={960} y={960} s={2.1} t={t} />
      <Candle x={430} y={950} s={1.3} t={t} seed={2} /><Candle x={1490} y={950} s={1.3} t={t} seed={5} />
    </g>
  );
};
