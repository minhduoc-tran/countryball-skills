import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { PilotHelmet } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { CITIES, City } from '../../countryball/map-labels';
import { HanoiMap, Txt, Plaque, QuietBackdrop, prog, easeOut, hash, backOut } from './che-map-and-text-helpers';
import { Silhouette, Newspaper, PublicBuilding } from './che-quiet-icons';

// Chapter E part 4 (E34-E41, 8:21-8:41): world reaction (ripples, Western press, Olof Palme as a name card, the US
// Congress and public pushing the White House). Real people only as plain name cards. t = frames, s = seconds.

const fi = (s: number, a: number, d = 0.4) => prog(s, a, a + d);

// ---------- E34: pictures from Hà Nội shock the world (ripples on the world map) ----------
export const E34: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <HanoiMap id="e34" s={s} date="12.1972" night={0} keys={[{ t: 0, lon: 15, lat: 35, zoom: 7.0 }, { t: 3.1, lon: 20, lat: 35, zoom: 7.6 }]}
      cities={<><City {...CITIES.hanoi} /><City {...CITIES.paris} /><City {...CITIES.washington} /><City lon={18.07} lat={59.33} name="Stockholm" anchor="r" /></>}>
      {({ P }) => {
        const h = P(105.85, 21.03);
        return (
          <g>
            {[0, 1, 2].map((i) => { const k = (s * 0.4 + i * 0.33) % 1; return <circle key={i} cx={h[0]} cy={h[1]} r={20 + k * 1500} fill="none" stroke="#FFD166" strokeWidth={6} opacity={0.9 * (1 - k)} />; })}
            <Txt x={1100} y={160} size={64} o={fi(s, 0.3)}>CHẤN ĐỘNG KHẮP THẾ GIỚI</Txt>
          </g>
        );
      }}
    </HanoiMap>
  );
};

// ---------- E35: Western papers: "Christmas bombing" ----------
export const E35: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, k = easeOut(prog(s, 0, 0.7)), z = easeOut(prog(s, 1.8, 2.5));
  const back = [{ x: 380, y: 520, r: -9 }, { x: 700, y: 470, r: 6 }, { x: 1230, y: 480, r: -5 }, { x: 1540, y: 530, r: 8 }];
  return (
    <g>
      <QuietBackdrop id="e35" tint="#1D2638" />
      {back.map((b, i) => <Newspaper key={i} x={b.x + (i < 2 ? -1 : 1) * (1 - k) * 900} y={b.y} s={1.15} rot={b.r * (1 + (1 - k))} shade={0.25 + 0.3 * z} head={['TIN QUỐC TẾ', 'THẾ GIỚI', 'BÁO CHÍ', 'TIN NÓNG'][i]} />)}
      <Newspaper x={960} y={500 + (1 - z) * 30} s={1.1 + 1.0 * z} rot={-2 * (1 - z)} head="CHRISTMAS BOMBING" o={fi(s, 1.6, 0.3)} />
      <Txt x={960} y={140} size={60} o={fi(s, 0.4)}>BÁO CHÍ PHƯƠNG TÂY</Txt>
      <Txt x={960} y={1020} size={64} fill="#FFE2B0" o={fi(s, 2.2)}>“ném bom Giáng sinh”</Txt>
    </g>
  );
};

// ---------- E36 / E37 / E38: Olof Palme (name card only), condemns, compares ----------
export const E36: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, k = easeOut(prog(s, 0, 0.5));
  return (
    <g>
      <QuietBackdrop id="e36" tint="#1D2A44" />
      <Silhouette x={640 - (1 - k) * 200} y={540} s={2.3} />
      <Plaque x={1310 + (1 - k) * 300} y={520} w={840} h={300} accent="#4A8FD6">
        <Txt x={0} y={-6} size={110}>OLOF PALME</Txt>
        <Txt x={0} y={72} size={50} fill="#B7CBE3">Thủ tướng Thụy Điển</Txt>
        <g transform="translate(330,-130)"><rect width={72} height={46} fill="#2A6EBB" stroke="#111" strokeWidth={3} /><rect x={20} width={13} height={46} fill="#FFD25E" /><rect y={17} width={72} height={13} fill="#FFD25E" /></g>
      </Plaque>
    </g>
  );
};
export const E37: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, k = backOut(prog(s, 0.15, 0.7));
  return (
    <g>
      <QuietBackdrop id="e37" tint="#1D2A44" />
      <Silhouette x={440} y={540} s={1.6} />
      <Plaque x={1180} y={500} w={1000} h={250} accent="#4A8FD6" o={fi(s, 0.1, 0.2)} rot={(1 - k) * -4}>
        <Txt x={0} y={22} size={96} fill="#FFE2B0">CÔNG KHAI LÊN ÁN</Txt>
        <Txt x={0} y={-62} size={40} fill="#B7CBE3">Olof Palme</Txt>
      </Plaque>
      {[0, 1, 2].map((i) => { const q = (s * 0.7 + i * 0.33) % 1; return <path key={i} d={`M${600 + q * 60},${420 - q * 30} Q${650 + q * 60},540 ${600 + q * 60},${660 + q * 30}`} fill="none" stroke="#C9D3E3" strokeWidth={6} strokeLinecap="round" opacity={(1 - q) * 0.7} />; })}
    </g>
  );
};
export const E38: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <QuietBackdrop id="e38" tint="#1D2638" />
      <Plaque x={500} y={500} w={620} h={260} accent="#C9343A" o={fi(s, 0.05)}>
        <Txt x={0} y={-8} size={64}>Vụ ném bom</Txt><Txt x={0} y={64} size={64}>Hà Nội</Txt>
      </Plaque>
      <Txt x={960} y={520} size={120} fill="#FFD166" o={fi(s, 0.6)}>≈</Txt>
      <Txt x={960} y={620} size={40} fill="#B7CBE3" o={fi(s, 0.6)}>so sánh với</Txt>
      <Plaque x={1430} y={500} w={680} h={300} accent="#6F8299" o={fi(s, 0.9)}>
        <Txt x={0} y={-30} size={52}>những tội ác tồi tệ nhất</Txt><Txt x={0} y={40} size={52}>trong lịch sử</Txt>
      </Plaque>
      <Txt x={960} y={900} size={42} fill="#C9D3E3" o={fi(s, 1.2)}>Olof Palme công khai so sánh</Txt>
    </g>
  );
};

// ---------- E39 / E40 / E41: pressure inside the USA ----------
const Crowd: React.FC<{ t: number; x0: number; y: number; n?: number; sad?: boolean }> = ({ t, x0, y, n = 7, sad = true }) => (
  <g>
    {Array.from({ length: n }, (_, i) => <Ball key={i} id={`e39c${x0}${i}`} x={x0 + i * 125 + (i % 2) * 14} y={y + (i % 3) * 16} r={50} flag="USA" eyes={sad ? (i % 2 ? 'worried' : 'sad') : 'determined'} motion={hop(t + i * 7, 40, 8, i)} t={t} shadow={false} />)}
  </g>
);
export const E39: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <HanoiMap id="e39" s={s} date="12.1972" night={0} veil={0.35} hud={false} keys={[{ t: 0, lon: -77.04, lat: 38.9, zoom: 600 }, { t: 2.4, lon: -77.04, lat: 38.9, zoom: 700 }]}
        cities={<City {...CITIES.washington} />}>{() => null}</HanoiMap>
      <rect width={1920} height={1080} fill="#0A1220" opacity={0.75} />
      <Txt x={960} y={170} size={78} o={fi(s, 0.1)}>NGAY TẠI NƯỚC MỸ</Txt>
      <PublicBuilding x={960} y={720} s={1.5} dome o={fi(s, 0.2)} />
      <Txt x={960} y={785} size={44} o={fi(s, 0.5)}>QUỐC HỘI</Txt>
      <Crowd t={t} x0={272} y={905} n={12} />
      <Txt x={960} y={1030} size={44} fill="#FFD9A0" o={fi(s, 0.9)}>và dư luận</Txt>
    </g>
  );
};
export const E40: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, g = easeOut(prog(s, 0.1, 1.8));
  return (
    <g>
      <QuietBackdrop id="e40" tint="#1D2638" />
      <Crowd t={t} x0={150} y={760} n={5} />
      <PublicBuilding x={380} y={680} s={0.8} dome o={0.9} />
      <PublicBuilding x={1560} y={760} s={1.1} fill="#F2F2F2" />
      <Txt x={1560} y={815} size={40}>NHÀ TRẮNG</Txt>
      {[0, 1, 2].map((i) => { const q = (s * 1.4 + i * 0.33) % 1; return <path key={i} d={`M${620 + q * 500},${470 + i * 70} l50,0 l-18,-18 m18,18 l-18,18`} fill="none" stroke="#FFD166" strokeWidth={8 + 6 * g} strokeLinecap="round" opacity={Math.min(1, q * 4) * (1 - q * 0.6)} />; })}
      <rect x={900} y={190} width={420} height={36} rx={18} fill="#15181F" stroke="#C9D3E3" strokeWidth={4} />
      <rect x={906} y={196} width={408 * g} height={24} rx={12} fill="#C9343A" />
      <Txt x={1110} y={162} size={40}>SỨC ÉP NGÀY CÀNG TĂNG</Txt>
    </g>
  );
};
export const E41: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <QuietBackdrop id="e41" tint="#1D2638" />
      <PublicBuilding x={960} y={700} s={1.5} fill="#F2F2F2" o={fi(s, 0.05)} />
      <Ball id="e41u" x={500} y={760} r={100} flag="USA" eyes="worried" hat={<PilotHelmet />} motion={breathe(t, 80)} t={t} />
      <Plaque x={960} y={210} w={1500} h={150} accent="#C9343A" o={fi(s, 0.5)}>
        <Txt x={0} y={22} size={76}>BUỘC PHẢI CHẤM DỨT CHIẾN TRANH</Txt>
      </Plaque>
      <Txt x={960} y={800} size={44} o={fi(s, 0.3)}>NHÀ TRẮNG</Txt>
    </g>
  );
};
