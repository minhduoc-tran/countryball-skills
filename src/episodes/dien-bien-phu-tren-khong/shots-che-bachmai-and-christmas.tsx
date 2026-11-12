import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { PilotHelmet, MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { BCell } from '../../countryball/fx-flight-path';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { Glow, Puff } from '../../countryball/fx-glow';
import { LowerThird } from '../../countryball/hud-chips';
import { HanoiMap, Txt, Plaque, QuietBackdrop, prog, easeOut, hash, backOut } from './che-map-and-text-helpers';
import { Candle, Hospital, House } from './che-quiet-icons';

// Chapter E part 1 (E1-E9, 6:51-7:16): Bạch Mai 22/12 (map + quiet cards, no casualties drawn), the US claim, Christmas
// pause (36 h), people returning home, the lull. t = frames since the shot started; s = seconds.

const fi = (s: number, a: number, d = 0.4) => prog(s, a, a + d);

// ---------- E1: bombs do not only fall on military targets ----------
export const E1: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e1" s={s} date="12.1972" night={0.85} pulse={0.15}
      keys={[{ t: 0, lon: 105.91, lat: 21.075, zoom: 2000 }, { t: 3, lon: 105.91, lat: 21.07, zoom: 2300 }]}>
      {({ P }) => {
        const yv = P(105.93, 21.1), gl = P(105.89, 21.04);
        return (
          <g>
            {[yv, gl].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={56 + 4 * Math.sin(t * 0.3 + i)} fill="none" stroke="#FFD166" strokeWidth={4} strokeDasharray="10 8" />)}
            <BombCarpet id="e1b" t={t} t0={20} from={yv} to={gl} dur={30} n={12} width={30} r={20} seed={3} />
            <BCell id="e1c" t={t} size={100} points={[[yv[0] - 900, yv[1] - 160], [gl[0] + 800, gl[1] + 170]]} t0={0} t1={85} />
            <LowerThird title="Mục tiêu quân sự: Gia Lâm, Yên Viên" from={0.3} t={s} />
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E2: morning of 22/12 ----------
export const E2: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e2" s={s} date="22.12.1972" night={0.04} lights={0.3}
      keys={[{ t: 0, lon: 105.86, lat: 21.012, zoom: 900 }, { t: 2, lon: 105.855, lat: 21.005, zoom: 1150 }]}>
      {({ P }) => {
        const b = P(105.85, 21.0);
        return (
          <g>
            {[0, 1].map((i) => <circle key={i} cx={b[0]} cy={b[1]} r={30 + ((s * 0.8 + i * 0.5) % 1) * 70} fill="none" stroke="#FFD166" strokeWidth={4} opacity={1 - ((s * 0.8 + i * 0.5) % 1)} />)}
            <g opacity={fi(s, 0.15)}>
              <circle cx={1060} cy={138} r={26} fill="#FFD25E" stroke="#111" strokeWidth={4} />
              {Array.from({ length: 8 }, (_, i) => <line key={i} x1={1060 + Math.cos(i * 0.785 + s) * 38} y1={138 + Math.sin(i * 0.785 + s) * 38} x2={1060 + Math.cos(i * 0.785 + s) * 50} y2={138 + Math.sin(i * 0.785 + s) * 50} stroke="#FFD25E" strokeWidth={5} strokeLinecap="round" />)}
              <Txt x={1360} y={156} size={74} anchor="middle">SÁNG 22/12</Txt>
            </g>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E3: a salvo of bombs falls on the hospital (far view, map + icon) ----------
export const E3: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e3" s={s} date="22.12.1972" night={0.35} pulse={0.1}
      keys={[{ t: 0, lon: 105.8495, lat: 21.002, zoom: 2200 }, { t: 2.4, lon: 105.8495, lat: 21.0015, zoom: 2450 }]}>
      {({ P }) => {
        const h = P(105.85, 21.0), shake = t > 14 && t < 56 ? Math.sin(t * 2.7) * 2.5 : 0;
        const sm = prog(t, 30, 69);
        return (
          <g transform={`translate(${shake},0)`}>
            <Hospital x={h[0]} y={h[1] + 60} s={0.55} />
            <BombCarpet id="e3b" t={t} t0={14} from={[h[0] - 250, h[1] - 250]} to={[h[0] + 250, h[1] + 250]} dur={36} n={16} width={70} r={30} seed={5} />
            {[0, 1, 2].map((i) => <Puff key={i} x={h[0] - 40 + i * 40} y={h[1] - 30 - sm * (90 + i * 30)} r={26 + sm * 22} o={0.5 * sm * (1 - sm * 0.4)} seed={i} />)}
            <BCell id="e3c" t={t} size={64} points={[[h[0] - 900, h[1] - 900], [h[0] + 900, h[1] + 900]]} t0={-33} t1={97} />
            <Txt x={h[0]} y={h[1] + 100} size={42} o={fi(s, 0.4)}>Bạch Mai</Txt>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E4: the hospital, dimmed ----------
export const E4: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e4" s={s} date="22.12.1972" night={0.5} veil={0.62} keys={[{ t: 0, lon: 105.85, lat: 21.0, zoom: 1400 }, { t: 2, lon: 105.852, lat: 21.002, zoom: 1500 }]}>
      {() => (
        <g>
          <Hospital x={960} y={760 - 6 * Math.sin(s * 2)} s={1.25 + 0.04 * s} />
          <Txt x={960} y={250} size={86} o={fi(s, 0.05)}>BỆNH VIỆN BẠCH MAI</Txt>
          <Txt x={960} y={330} size={50} fill="#FFD9A0" o={fi(s, 0.5)}>bệnh viện lớn nhất miền Bắc</Txt>
        </g>
      )}
    </HanoiMap>
  );
};

// ---------- E5: 28 medical staff (quiet: number + 28 candles) ----------
export const E5: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, n = Math.round(28 * easeOut(prog(s, 0.2, 1.5)));
  return (
    <g>
      <QuietBackdrop id="e5" />
      <Txt x={960} y={330} size={230} fill="#FFE2B0" o={fi(s, 0.1)}>{String(n)}</Txt>
      <Txt x={960} y={430} size={56} o={fi(s, 0.9)}>bác sĩ, y tá và nhân viên bệnh viện</Txt>
      {Array.from({ length: 28 }, (_, i) => {
        const r = Math.floor(i / 14), c = i % 14;
        return <Candle key={i} x={300 + c * 95} y={680 + r * 150} s={0.62} t={t} seed={i} o={fi(s, 1.2 + i * 0.05, 0.3)} />;
      })}
      <Txt x={960} y={1010} size={42} fill="#C9D3E3" o={fi(s, 2.4)}>đã thiệt mạng</Txt>
    </g>
  );
};

// ---------- E6: "Theo phía Mỹ": the bombs strayed from a nearby target ----------
export const E6: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e6" s={s} date="22.12.1972" night={0.4} veil={0.25} keys={[{ t: 0, lon: 105.852, lat: 21.004, zoom: 1500 }, { t: 3.7, lon: 105.852, lat: 21.003, zoom: 1700 }]}>
      {({ P }) => {
        const h = P(105.85, 21.0), tg = P(105.868, 21.016), k = easeOut(prog(s, 1.4, 2.6));
        const mid: [number, number] = [(h[0] + tg[0]) / 2 - 10, (h[1] + tg[1]) / 2 - 70];
        const ax = tg[0] + (h[0] - tg[0]) * k, ay = tg[1] + (h[1] - tg[1]) * k;
        return (
          <g>
            <circle cx={tg[0]} cy={tg[1]} r={50} fill="none" stroke="#FFD166" strokeWidth={5} strokeDasharray="10 8" opacity={fi(s, 1.0)} />
            <Txt x={tg[0] + 70} y={tg[1] - 66} size={36} anchor="start" o={fi(s, 1.1)}>mục tiêu gần đó</Txt>
            <path d={`M${tg[0]},${tg[1]} Q${mid[0]},${mid[1]} ${ax},${ay}`} fill="none" stroke="#FF9A5A" strokeWidth={6} strokeDasharray="12 10" strokeLinecap="round" opacity={fi(s, 1.4)} />
            <Hospital x={h[0]} y={h[1] + 40} s={0.42} />
            <circle cx={ax} cy={ay} r={11} fill="#FF7A33" opacity={fi(s, 1.4)} />
            <Plaque x={1330} y={250} w={700} h={150} accent="#6F8299" o={fi(s, 0.1)}>
              <Txt x={0} y={-14} size={44} fill="#B7CBE3">THEO PHÍA MỸ</Txt>
              <Txt x={0} y={40} size={40}>bom rơi lệch khỏi mục tiêu gần đó</Txt>
            </Plaque>
            <Ball id="e6u" x={300} y={800} r={110} flag="USA" eyes="worried" hat={<PilotHelmet />} motion={breathe(t)} t={t} />
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E7: Christmas night, then the 36 hour pause ----------
const Tree: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-14} y={-20} width={28} height={40} fill="#6B4A32" stroke="#111" strokeWidth={4} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${-90 + i * 18},${-20 - i * 80} L0,${-130 - i * 80} L${90 - i * 18},${-20 - i * 80} Z`} fill="#2F7A4A" stroke="#111" strokeWidth={5} strokeLinejoin="round" />)}
    <polygon points="0,-400 8,-378 32,-378 12,-364 20,-340 0,-355 -20,-340 -12,-364 -32,-378 -8,-378" fill="#FFD25E" stroke="#111" strokeWidth={3} />
    {Array.from({ length: 9 }, (_, i) => {
      const yy = -60 - (i % 3) * 90 - hash(i, 2) * 40, xx = (hash(i, 4) - 0.5) * (150 - (i % 3) * 40), on = Math.sin(t * 0.3 + i * 1.7) > -0.2;
      return <g key={i}><circle cx={xx} cy={yy} r={9} fill={['#FF5A5A', '#FFD25E', '#7FC8F0'][i % 3]} opacity={on ? 1 : 0.45} />{on && <Glow x={xx} y={yy} r={26} color="#FFD25E" o={0.4} />}</g>;
    })}
  </g>
);
export const E7: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, p2 = easeOut(prog(s, 1.25, 1.9)), p1 = 1 - prog(s, 1.05, 1.5);
  const k = Math.min(1.5, Math.max(0, (s - 1.3) / 2.2 * 1.5));
  return (
    <HanoiMap id="e7" s={s} date="24.12.1972" night={0.9} veil={0.35} keys={[{ t: 0, lon: 105.85, lat: 21.03, zoom: 500 }, { t: 3.6, lon: 105.85, lat: 21.03, zoom: 560 }]}>
      {() => (
        <g>
          <g opacity={p1}>
            <Tree x={960} y={880} s={1.5 + 0.04 * s} t={t} />
            <Txt x={960} y={985} size={72}>ĐÊM GIÁNG SINH</Txt>
          </g>
          <g opacity={p2} transform={`translate(${(1 - p2) * 80},0)`}>
            <circle cx={620} cy={560} r={170} fill="#0D1118" opacity={0.6} />
            <g>
              <circle cx={620} cy={560} r={150} fill="#F4EFE3" stroke="#111" strokeWidth={9} />
              <path d={`M620,560 L620,420 A140,140 0 ${k / 6 > 0.5 ? 1 : 0} 1 ${620 + Math.sin(k / 6 * 6.283) * 140},${560 - Math.cos(k / 6 * 6.283) * 140} Z`} fill="#C9343A" opacity={0.55} />
              {Array.from({ length: 12 }, (_, i) => <line key={i} x1={620 + Math.sin(i * 0.5236) * 130} y1={560 - Math.cos(i * 0.5236) * 130} x2={620 + Math.sin(i * 0.5236) * 112} y2={560 - Math.cos(i * 0.5236) * 112} stroke="#111" strokeWidth={5} />)}
              <line x1={620} y1={560} x2={620 + Math.sin(k / 6 * 6.283) * 118} y2={560 - Math.cos(k / 6 * 6.283) * 118} stroke="#111" strokeWidth={9} strokeLinecap="round" />
              <circle cx={620} cy={560} r={11} fill="#111" />
            </g>
            <Txt x={1270} y={560} size={190} fill="#FFE2B0">36 GIỜ</Txt>
            <Txt x={1270} y={650} size={56}>Mỹ tạm ngừng ném bom</Txt>
            <Ball id="e7u" x={1250} y={890} r={80} flag="USA" eyes="normal" hat={<PilotHelmet />} motion={breathe(t, 80)} t={t} />
          </g>
        </g>
      )}
    </HanoiMap>
  );
};

// ---------- E8: people who evacuated head back home ----------
export const E8: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e8" s={s} date="25.12.1972" night={0.45} lights={0.8} keys={[{ t: 0, lon: 105.85, lat: 21.03, zoom: 700 }, { t: 3.4, lon: 105.85, lat: 21.03, zoom: 760 }]}>
      {({ P }) => {
        const c = P(105.85, 21.03), home = prog(s, 1.8, 3.1);
        return (
          <g>
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * 6.283 + 0.3, d0 = 560 + 60 * hash(i, 1), d1 = 170 + 70 * hash(i, 2), k = easeOut(prog(s, 0.15 + i * 0.07, 2.4 + i * 0.05));
              const d = d0 + (d1 - d0) * k, x = c[0] + Math.cos(a) * d * 1.25, y = c[1] + Math.sin(a) * d * 0.72;
              const lit = prog(s, 1.8 + i * 0.08, 2.1 + i * 0.08);
              return (
                <g key={i}>
                  <House x={c[0] + Math.cos(a) * (d1 + 10) * 1.25} y={c[1] + Math.sin(a) * (d1 + 10) * 0.72 + 20} s={0.7} lit={lit} hue={i} />
                  <Ball id={`e8b${i}`} x={x} y={y} r={34} flag="VNM" eyes="normal" motion={k < 1 ? hop(t + i * 5, 22, 14) : breathe(t, 60, 0.04, i)} t={t} shadow={false} />
                </g>
              );
            })}
            <Txt x={960} y={140} size={60} o={fi(s, 0.2)}>SƠ TÁN → QUAY VỀ NHÀ</Txt>
            <Txt x={960} y={210} size={40} fill="#FFD9A0" o={fi(s, 1.6)} weight={700}>{home > 0.1 ? 'tưởng rằng đợt bắn phá đã qua' : ' '}</Txt>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E9: "chỉ là khoảng lặng": still city, flat sound line, a hint of the next raid ----------
export const E9: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e9" s={s} date="26.12.1972" night={0.92} lights={1} pulse={0.2 * prog(s, 1.8, 2.7)} keys={[{ t: 0, lon: 105.85, lat: 21.03, zoom: 520 }, { t: 2.8, lon: 105.85, lat: 21.03, zoom: 600 }]}>
      {() => (
        <g>
          <rect width={1920} height={1080} fill="#04060B" opacity={0.3} />
          <Txt x={960} y={380} size={120} o={fi(s, 0.3, 0.7)} fill="#E4EBFF">KHOẢNG LẶNG</Txt>
          <path d={`M300,600 L${300 + 1320 * fi(s, 0.4, 1.2)},600`} stroke="#9DB4CC" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
          {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={420 + i * 160} cy={600 + 2 * Math.sin(t * 0.2 + i)} r={4} fill="#9DB4CC" opacity={fi(s, 0.6)} />)}
        </g>
      )}
    </HanoiMap>
  );
};
