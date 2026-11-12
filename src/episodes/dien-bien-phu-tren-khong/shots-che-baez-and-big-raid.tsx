import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { PilotHelmet, UsafCap, NonLa } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { BCell } from '../../countryball/fx-flight-path';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { FlakBurst } from '../../countryball/fx-sam-and-flak';
import { Glow } from '../../countryball/fx-glow';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { PhotoCard } from '../../countryball/photo-card';
import { CITIES, City } from '../../countryball/map-labels';
import { HanoiMap, Txt, Plaque, QuietBackdrop, prog, easeOut, hash, backOut, PHOTO_CREDIT } from './che-map-and-text-helpers';
import { Silhouette, Recorder, AlbumSleeve, Waveform, ClockFace } from './che-quiet-icons';

// Chapter E part 2 (E10-E21, 7:16-7:48): Joan Baez (name card + silhouette, no likeness), the 26/12 raid (US archive
// diagram, 120 B-52, many directions, 15 minutes, biggest SAC sortie). t = frames in shot, s = seconds.

const fi = (s: number, a: number, d = 0.4) => prog(s, a, a + d);

// ---------- E10: a special guest is in Hà Nội ----------
export const E10: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e10" s={s} date="12.1972" night={0.3} keys={[{ t: 0, lon: 105.85, lat: 21.03, zoom: 520 }, { t: 3.2, lon: 105.85, lat: 21.03, zoom: 640 }]}>
      {({ P }) => {
        const c = P(105.85, 21.03), drop = backOut(prog(s, 0.3, 0.95)), py = c[1] - 40 - (1 - drop) * 400;
        return (
          <g>
            {[0, 1].map((i) => <circle key={i} cx={c[0]} cy={c[1] - 10} r={20 + ((s * 0.7 + i * 0.5) % 1) * 90} fill="none" stroke="#FFD166" strokeWidth={4} opacity={fi(s, 1) * (1 - ((s * 0.7 + i * 0.5) % 1))} />)}
            <g opacity={fi(s, 0.25, 0.2)}>
              <path d={`M${c[0]},${py + 6} C${c[0] - 80},${py - 70} ${c[0] - 70},${py - 190} ${c[0]},${py - 190} C${c[0] + 70},${py - 190} ${c[0] + 80},${py - 70} ${c[0]},${py + 6} Z`} fill="#FFD166" stroke="#111" strokeWidth={6} />
              <Silhouette x={c[0]} y={py - 112} s={0.5} plate="#3A4660" />
            </g>
            <Txt x={960} y={900} size={72} o={fi(s, 1.0)}>MỘT VỊ KHÁCH ĐẶC BIỆT</Txt>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E11: name card: Joan Baez ----------
export const E11: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, k = easeOut(prog(s, 0, 0.5));
  return (
    <g>
      <QuietBackdrop id="e11" tint="#1D2A44" />
      <Silhouette x={620 - (1 - k) * 200} y={540} s={2.3} />
      <Plaque x={1310 + (1 - k) * 300} y={520} w={820} h={300} accent="#6F8299">
        <Txt x={0} y={10} size={116}>JOAN BAEZ</Txt>
        <Txt x={0} y={90} size={54} fill="#B7CBE3">nữ ca sĩ người Mỹ</Txt>
      </Plaque>
      <Ball id="e11u" x={1655} y={375} r={64} flag="USA" eyes="normal" motion={breathe(t, 70)} t={t} />
    </g>
  );
};

// ---------- E12: a peace delegation arrives in Việt Nam ----------
const PeaceSign: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round">
    <circle r={44} /><line x1={0} y1={-44} x2={0} y2={44} /><line x1={0} y1={0} x2={-31} y2={31} /><line x1={0} y1={0} x2={31} y2={31} />
  </g>
);
export const E12: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e12" s={s} date="12.1972" night={0.2} keys={[{ t: 0, lon: 104.5, lat: 20.2, zoom: 110 }, { t: 2.3, lon: 105.3, lat: 20.8, zoom: 190 }]}
      cities={<><City {...CITIES.hanoi} /><City {...CITIES.haiphong} minZoom={90} /></>}>
      {({ P }) => {
        const h = P(105.85, 21.03), a: [number, number] = [h[0] - 1100, h[1] - 330], k = easeOut(prog(s, 0.1, 2.0));
        const x = a[0] + (h[0] - a[0] - 190) * k, y = a[1] + (h[1] - a[1] - 55) * k;
        return (
          <g>
            <line x1={a[0]} y1={a[1]} x2={h[0]} y2={h[1]} stroke="#FFFFFF" strokeWidth={4} strokeDasharray="12 12" opacity={0.5} />
            <AircraftTop id="e12" kind="kc135" size={120} x={x} y={y} heading={Math.atan2(h[1] - a[1], h[0] - a[0]) * 180 / Math.PI} />
            <Plaque x={1390} y={230} w={600} h={150} accent="#FFFFFF" o={fi(s, 0.4)}>
              <PeaceSign x={-225} y={4} s={1} />
              <Txt x={55} y={20} size={52}>ĐOÀN HÒA BÌNH</Txt>
            </Plaque>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E13: nights of bombing, then the shelter (cutaway, balls + silhouette, recorder) ----------
const Shelter: React.FC<{ t: number }> = ({ t }) => {
  const th = (i: number) => Math.max(0, 1 - ((t + i * 17) % 52) / 10), shake = th(0) * 3 * Math.sin(t * 2.3);
  const sky = 0.15 + 0.5 * (hash(Math.floor(t / 4), 3) > 0.7 ? 1 : 0);
  return (
    <g transform={`translate(${shake},${shake * 0.6})`}>
      <rect width={1920} height={400} fill="#0B1020" />
      <rect width={1920} height={400} fill="#FF9A2E" opacity={sky * 0.18} />
      {[0, 1, 2].map((i) => <Glow key={i} x={300 + i * 650 + hash(Math.floor(t / 6), i) * 80} y={380} r={150} color="#FF9A2E" o={sky * 0.5 * hash(Math.floor(t / 6), i + 4)} />)}
      <rect y={380} width={1920} height={700} fill="#3A2F26" />
      <rect y={380} width={1920} height={14} fill="#241C16" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i, 1) * 1920} cy={420 + hash(i, 2) * 650} r={3 + hash(i, 3) * 6} fill="#2C231B" />)}
      <rect x={330} y={500} width={1260} height={400} rx={190} fill="#8E949C" stroke="#111" strokeWidth={8} />
      <rect x={378} y={548} width={1164} height={304} rx={150} fill="#1B1F27" />
      <rect x={1580} y={394} width={110} height={420} fill="#1B1F27" stroke="#111" strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={1580} y1={440 + i * 90} x2={1690} y2={440 + i * 90} stroke="#6B7358" strokeWidth={6} />)}
      <g transform={`translate(960,548) rotate(${Math.sin(t * 0.08) * 4 + th(1) * 3})`}>
        <line x1={0} y1={0} x2={0} y2={64} stroke="#111" strokeWidth={4} />
        <Glow x={0} y={86} r={190} color="#FFB347" o={0.55} />
        <ellipse cx={0} cy={88} rx={18} ry={22} fill="#FFD983" stroke="#111" strokeWidth={4} />
      </g>
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={420 + hash(i, 9) * 1080} cy={560 + ((t * 1.2 + i * 40) % 90)} r={3} fill="#CFC8B8" opacity={th(i) * 0.9} />)}
    </g>
  );
};
export const E13: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, sw = easeOut(prog(s, 1.5, 2.0));
  return (
    <g>
      <HanoiMap id="e13" s={s} date="12.1972" night={0.9} pulse={0.3} keys={[{ t: 0, lon: 105.85, lat: 21.03, zoom: 700 }, { t: 1.8, lon: 105.85, lat: 21.03, zoom: 800 }]}>
        {({ P }) => {
          const c = P(105.85, 21.03);
          return <g>{[0, 1, 2, 3].map((i) => <FlakBurst key={i} id={`e13f${i}`} t={t} t0={4 + i * 11} x={c[0] + (i - 1.5) * 150} y={c[1] - 80 + (i % 2) * 70} r={55} life={50} />)}</g>;
        }}
      </HanoiMap>
      {sw > 0.001 && (
        <g clipPath={`url(#e13-reveal)`}>
          <defs><clipPath id="e13-reveal"><circle cx={960} cy={700} r={sw * 1500} /></clipPath></defs>
          <Shelter t={t} />
          <Ball id="e13a" x={520} y={800} r={68} flag="VNM" eyes="worried" hat={<NonLa />} motion={breathe(t, 60, 0.04)} t={t} />
          <Ball id="e13b" x={680} y={805} r={58} flag="VNM" eyes="sad" motion={breathe(t, 64, 0.04, 1)} t={t} />
          <g transform="translate(960,742)"><Silhouette x={0} y={0} s={0.72} /></g>
          <Recorder x={1100} y={808} s={0.32} t={t} />
          <Txt x={960} y={842} size={30} fill="#FFE2B0" o={fi(s, 2.0)}>Joan Baez</Txt>
          <Ball id="e13c" x={1270} y={800} r={66} flag="VNM" eyes="worried" motion={breathe(t, 58, 0.04, 2)} t={t} />
          <Ball id="e13d" x={1420} y={808} r={52} flag="VNM" eyes="normal" motion={breathe(t, 62, 0.04, 3)} t={t} />
          <Txt x={960} y={960} size={58} o={fi(s, 2.1)}>HẦM TRÚ ẨN, CÙNG NGƯỜI DÂN HÀ NỘI</Txt>
        </g>
      )}
    </g>
  );
};

// ---------- E14: the tape recorder ----------
export const E14: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, k = backOut(prog(s, 0, 0.5));
  return (
    <g>
      <QuietBackdrop id="e14" tint="#1D2A44" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${1180 + i * 70},${470 - 60 - i * 20} Q${1230 + i * 70},470 ${1180 + i * 70},${470 + 60 + i * 20}`} fill="none" stroke="#FFD166" strokeWidth={8} strokeLinecap="round" opacity={0.85 - i * 0.2 - 0.3 * Math.sin(t * 0.3 + i)} />)}
      <Recorder x={820} y={520 + (1 - k) * 300} s={2.2} t={t} />
      <Txt x={960} y={900} size={64} o={fi(s, 0.4)}>MÁY GHI ÂM</Txt>
    </g>
  );
};

// ---------- E15: the sounds go onto an album against the war ----------
export const E15: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, flow = prog(s, 0.2, 1.8);
  return (
    <g>
      <QuietBackdrop id="e15" tint="#1D2A44" />
      <Recorder x={330} y={520} s={1.0} t={t} />
      <Waveform x={750} y={520} w={380} h={150} t={t} bars={26} energy={(u) => (u < flow ? 0.4 + 0.6 * Math.sin(u * 9 + t * 0.2) ** 2 : 0.04)} />
      <AlbumSleeve x={1360} y={520} s={1.5} t={t} slide={easeOut(prog(s, 1.0, 2.2))} o={fi(s, 0.9)} />
      <Txt x={960} y={940} size={56} o={fi(s, 1.6)}>Âm thanh ghi ở Hà Nội → album phản đối chiến tranh</Txt>
    </g>
  );
};

// ---------- E16: the evening of 26/12 ----------
export const E16: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e16" s={s} date="26.12.1972" nightLabel="ĐÊM 9/12" night={0.9} pulse={0.3 * fi(s, 0.3, 1)} keys={[{ t: 0, lon: 104.9, lat: 21.0, zoom: 190 }, { t: 1.8, lon: 105.3, lat: 21.0, zoom: 230 }]}
      cities={<><City {...CITIES.hanoi} /><City {...CITIES.haiphong} /></>}>
      {({ P }) => {
        const h = P(105.85, 21.03);
        return (
          <g>
            {[0, 1, 2].map((i) => <BCell key={i} id={`e16c${i}`} t={t} size={44} points={[[h[0] - 1200 - i * 160, h[1] - 150 + i * 120], [h[0] + 100, h[1] + (i - 1) * 25]]} t0={i * 5} t1={70 + i * 5} />)}
            <Txt x={1150} y={160} size={92} o={fi(s, 0.1)}>TỐI 26/12</Txt>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E17: the US archive diagram of the 26/12 raid ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e17" s={s} date="26.12.1972" nightLabel="ĐÊM 9/12" night={0.9} veil={0.55} keys={[{ t: 0, lon: 105.5, lat: 21.0, zoom: 260 }, { t: 2.6, lon: 105.7, lat: 21.0, zoom: 300 }]}>
      {() => (
        <g>
          <PhotoCard src="dien-bien-phu-tren-khong/img/map-raid-26-dec.jpg" w={1060} h={583} x={960} y={530} rot={-1.2} id="e17" from={0} to={len / 30 + 0.45} t={s}
            caption="Sơ đồ đợt đánh đêm 26/12/1972 (tài liệu phía Mỹ)" credit={PHOTO_CREDIT.grau} fromSide="bottom" kb={{ z0: 1.0, z1: 1.14, px0: 0.02, py0: 0, px1: -0.02, py1: 0 }} />
          <Txt x={820} y={985} size={52} o={fi(s, 0.5)}>TRẬN ĐÁNH LỚN NHẤT CỦA CẢ CHIẾN DỊCH</Txt>
        </g>
      )}
    </HanoiMap>
  );
};

// ---------- E18: 120 B-52 ----------
export const E18: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, n = Math.round(120 * easeOut(prog(s, 0.1, 1.2)));
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      <rect width={1920} height={1080} fill="#06101B" opacity={0.5} />
      {Array.from({ length: 120 }, (_, i) => {
        const c = i % 15, r = Math.floor(i / 15), at = 0.1 + (i / 120) * 1.1;
        return s >= at ? <AircraftTop key={i} id={`e18-${i}`} kind="b52" size={74} x={190 + c * 113} y={380 + r * 88 + (s - at < 0.2 ? -(0.2 - (s - at)) * 120 : 0)} heading={-90} shadow={false} opacity={0.95} /> : null;
      })}
      <Txt x={960} y={220} size={170} fill="#FFE2B0">{`${n}`}</Txt>
      <Txt x={1210} y={220} size={80} anchor="start">B-52</Txt>
    </g>
  );
};

// ---------- E19: from many directions at once ----------
export const E19: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  const src: [number, number][] = [[100.2, 22.2], [100.8, 19.2], [103.6, 17.0], [110.8, 19.4], [110.4, 22.6], [102.0, 24.4]];
  return (
    <HanoiMap id="e19" s={s} date="26.12.1972" nightLabel="ĐÊM 9/12" night={0.9} pulse={0.2} keys={[{ t: 0, lon: 105.6, lat: 21.0, zoom: 150 }, { t: 1.7, lon: 105.7, lat: 21.0, zoom: 175 }]}
      cities={<><City {...CITIES.hanoi} /><City {...CITIES.haiphong} /></>}>
      {({ P }) => {
        const h = P(105.85, 21.03);
        return (
          <g>
            {src.map((q, i) => { const a = P(q[0], q[1]); return <BCell key={i} id={`e19c${i}`} t={t} size={40} points={[a, h]} t0={i * 2} t1={52 + i * 2} trailLen={260} route />; })}
            <Txt x={960} y={990} size={60} o={fi(s, 0.3)}>NHIỀU HƯỚNG CÙNG MỘT LÚC</Txt>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E20: bombs on Hà Nội and Hải Phòng, in about 15 minutes ----------
export const E20: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, k = 0.25 * prog(s, 1.5, 3.6);
  return (
    <HanoiMap id="e20" s={s} date="26.12.1972" nightLabel="ĐÊM 9/12" night={0.92} pulse={0.2} keys={[{ t: 0, lon: 106.2, lat: 20.95, zoom: 400 }, { t: 3.7, lon: 106.2, lat: 20.95, zoom: 440 }]}>
      {({ P }) => {
        const hn = P(105.85, 21.03), hp = P(106.68, 20.86);
        return (
          <g>
            <BombCarpet id="e20a" t={t} t0={4} from={[hn[0] - 70, hn[1] - 60]} to={[hn[0] + 70, hn[1] + 50]} dur={60} n={20} width={60} r={26} seed={2} linger={140} />
            <BombCarpet id="e20b" t={t} t0={14} from={[hp[0] - 60, hp[1] - 40]} to={[hp[0] + 60, hp[1] + 50]} dur={60} n={18} width={50} r={24} seed={7} linger={140} />
            <g opacity={fi(s, 1.4)}>
              <Plaque x={1560} y={250} w={460} h={330} accent="#FFD166">
                <g transform="translate(-110,-20)"><circle r={86} fill="#F4EFE3" stroke="#111" strokeWidth={6} />
                  <path d={`M0,0 L0,-78 A78,78 0 0 1 ${Math.sin(k * 6.283) * 78},${-Math.cos(k * 6.283) * 78} Z`} fill="#C9343A" opacity={0.6} />
                  <line x1={0} y1={0} x2={Math.sin(k * 6.283) * 70} y2={-Math.cos(k * 6.283) * 70} stroke="#111" strokeWidth={7} strokeLinecap="round" /><circle r={7} fill="#111" /></g>
                <Txt x={100} y={-10} size={80}>15</Txt>
                <Txt x={100} y={50} size={42}>phút</Txt>
                <Txt x={0} y={125} size={34} fill="#FFE2B0">khoảng chừng</Txt>
              </Plaque>
            </g>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E21: the largest sortie in the history of Strategic Air Command ----------
export const E21: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, ul = easeOut(prog(s, 1.3, 2.2));
  return (
    <g>
      <QuietBackdrop id="e21" tint="#1D2638" />
      <Txt x={960} y={230} size={92} o={fi(s, 0.05)}>LẦN XUẤT KÍCH LỚN NHẤT</Txt>
      <rect x={560} y={262} width={800 * ul} height={9} rx={4} fill="#FFD166" />
      <Plaque x={960} y={470} w={1240} h={170} accent="#6F8299" o={fi(s, 0.8)}>
        <Txt x={0} y={-8} size={54} fill="#B7CBE3">trong lịch sử của</Txt>
        <Txt x={0} y={58} size={62}>Bộ Chỉ huy Không quân Chiến lược Mỹ</Txt>
      </Plaque>
      {[0, 1, 2].map((i) => <AircraftSide key={i} kind="b52" size={300} x={((s * 150 + i * 700) % 2400) - 240} y={790 + (i % 2) * 70} />)}
      <Ball id="e21u" x={185} y={560} r={92} flag="USA" eyes="determined" hat={<UsafCap />} motion={breathe(t, 80)} t={t} />
    </g>
  );
};
