import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { DocumentProp, PenProp } from '../../countryball/ball-speech-and-props';
import { CITIES, City } from '../../countryball/map-labels';
import { backOut, easeOut, hash, prog } from '../../countryball/fx-math';
import { star } from '../../countryball/ball-flags';
import { MapShot, NameCard, Out, Tag, sec } from './cha-map-scene';

// Chapter A, Paris talks: A24 flight to Paris 1968, A25 two sides at the table, A26 four years, A27 October 1972,
// A28 the draft agreement, A29 Kissinger name card (26.10), A30 press + "Hòa bình đã trong tầm tay".

const PARIS = [{ t: 0, lon: 2.4, lat: 48.5, zoom: 95 }, { t: 3, lon: 2.3, lat: 48.9, zoom: 110 }];
const ParisMap: React.FC<{ t: number; id: string; date: ShotDate; dim?: number; over: () => React.ReactNode }> = ({ t, id, date, dim = 0.55, over }) => (
  <MapShot t={t} id={id} date={date} dim={dim} keys={PARIS} highlight={['FRA']} provinces={false} labels={false} over={over}><City {...CITIES.paris} /></MapShot>
);
type ShotDate = string | { t: number; label: string }[];

export const A24: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a24" provinces={false} highlight={['VNM', 'FRA']} date={[{ t: 0, label: '1965' }, { t: 0.4, label: '1968' }]}
    keys={[{ t: 0, lon: 106.0, lat: 16.4, zoom: 70 }, { t: 0.95, lon: 60, lat: 32, zoom: 9, ease: 'in' }, { t: 1.9, lon: 2.4, lat: 48.7, zoom: 105, ease: 'out' }]}>
    <City {...CITIES.paris} />
    <City {...CITIES.hanoi} maxZoom={30} />
  </MapShot>
);

export const A25: React.FC<ShotProps> = ({ t }) => (
  <ParisMap t={t} id="a25" date="1968" over={() => (
    <g>
      <Ball id="a25f" x={960} y={400} r={92} flag="FRA" eyes="normal" motion={breathe(t, 60)} />
      <Tag x={960} y={262} text="CHỦ NHÀ: PARIS" size={28} opacity={prog(t, 14, 24)} />
      <Ball id="a25v" x={600} y={590} r={140} flag="VNM" eyes="determined" tilt={4} motion={mixMotion(breathe(t, 62), hopOnce(t, 8, 18, 22))} />
      <Ball id="a25u" x={1320} y={590} r={140} flag="USA" eyes="determined" tilt={-4} motion={mixMotion(breathe(t, 66, 0.03, 20), hopOnce(t, 16, 18, 22))} />
      <ellipse cx={960} cy={770} rx={560} ry={130} fill="#6B4A32" stroke="#111" strokeWidth={7} />
      <ellipse cx={960} cy={760} rx={520} ry={108} fill="#7E5A3E" />
      <rect x={560} y={730} width={110} height={60} rx={4} fill="#F6F0DC" stroke="#111" strokeWidth={4} transform="rotate(-6 615 760)" />
      <rect x={1250} y={730} width={110} height={60} rx={4} fill="#F6F0DC" stroke="#111" strokeWidth={4} transform="rotate(7 1305 760)" />
      <Tag x={600} y={930} text="VIỆT NAM" opacity={prog(t, 20, 30)} />
      <Tag x={1320} y={930} text="MỸ" opacity={prog(t, 26, 36)} />
    </g>
  )} />
);

export const A26: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 6, 70)), X0 = 260, X1 = 1660;
  return (
    <ParisMap t={t} id="a26" dim={0.65} date={[{ t: 0, label: '1968' }, { t: 0.9, label: '1970' }, { t: 1.8, label: '1972' }]} over={() => (
      <g>
        <Out x={960} y={400} size={250} fill="#FFD43B" scale={Math.max(0.01, backOut((t - 2) / 10))}>4 NĂM</Out>
        <rect x={X0} y={548} width={X1 - X0} height={26} rx={13} fill="#1B2433" stroke="#E2B95A" strokeWidth={4} />
        <rect x={X0} y={548} width={(X1 - X0) * k} height={26} rx={13} fill="#E2B95A" />
        {[1968, 1969, 1970, 1971, 1972].map((y, i) => (
          <g key={y}>
            <circle cx={X0 + i * 350} cy={561} r={16} fill={k >= i / 4 - 0.001 ? '#FFD43B' : '#1B2433'} stroke="#E2B95A" strokeWidth={4} />
            <text x={X0 + i * 350} y={640} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#F4F4F4">{y}</text>
          </g>
        ))}
        <Ball id="a26v" x={200} y={760} r={85} flag="VNM" eyes="normal" motion={breathe(t, 62)} />
        <Ball id="a26u" x={1720} y={760} r={85} flag="USA" eyes="normal" motion={breathe(t, 70, 0.03, 18)} />
      </g>
    )} />
  );
};

const CAL_X = 960, CAL_Y = 560, CW = 520, CH = 600;
export const A27: React.FC<ShotProps> = ({ t }) => {
  const k = Math.max(0.001, backOut((t - 3) / 14));
  return (
    <ParisMap t={t} id="a27" dim={0.65} date={[{ t: 0, label: '1972' }, { t: 0.1, label: '10.1972' }]} over={() => (
      <g transform={`translate(${CAL_X},${CAL_Y - CH / 2}) scale(1,${k}) translate(0,${CH / 2})`}>
        <rect x={-CW / 2 + 12} y={-CH / 2 + 18} width={CW} height={CH} rx={20} fill="#000" opacity={0.4} />
        <rect x={-CW / 2} y={-CH / 2} width={CW} height={CH} rx={20} fill="#F6F2E7" stroke="#111" strokeWidth={6} />
        <path d={`M${-CW / 2},${-CH / 2 + 130} V${-CH / 2 + 20} Q${-CW / 2},${-CH / 2} ${-CW / 2 + 20},${-CH / 2} H${CW / 2 - 20} Q${CW / 2},${-CH / 2} ${CW / 2},${-CH / 2 + 20} V${-CH / 2 + 130} Z`} fill="#C9343A" stroke="#111" strokeWidth={6} />
        <text y={-CH / 2 + 88} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFFFFF">THÁNG 10 / 1972</text>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => <text key={d} x={-CW / 2 + 44 + i * 72} y={-CH / 2 + 175} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#8A8470">{d}</text>)}
        {Array.from({ length: 31 }, (_, i) => (
          <text key={i} x={-CW / 2 + 44 + (i % 7) * 72} y={-CH / 2 + 235 + Math.floor(i / 7) * 74} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={40} fill="#2A2622">{i + 1}</text>
        ))}
      </g>
    )} />
  );
};

export const A28: React.FC<ShotProps> = ({ t }) => {
  const bar = easeOut(prog(t, 10, 62)) * 0.9;
  return (
    <ParisMap t={t} id="a28" dim={0.65} date="10.1972" over={() => (
      <g>
        <DocumentProp x={600 + Math.sin(t / 14) * 4} y={520} s={4.2} rot={-4} title="DỰ THẢO" />
        <PenProp x={760} y={800 + Math.sin(t / 3) * 6} s={1.6} rot={-24} />
        <Out x={1290} y={420} size={70} opacity={prog(t, 8, 20)}>BẢN DỰ THẢO HIỆP ĐỊNH</Out>
        <rect x={960} y={500} width={660} height={60} rx={30} fill="#1B2433" stroke="#E2B95A" strokeWidth={5} />
        <rect x={960} y={500} width={Math.max(0, 660 * bar)} height={60} rx={30} fill="#5FC27A" />
        <text x={1290} y={636} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#F4F4F4" opacity={prog(t, 40, 56)}>GẦN NHƯ ĐÃ XONG</text>
        <Ball id="a28v" x={1000} y={800} r={85} flag="VNM" eyes="determined" motion={breathe(t, 62)} />
        <Ball id="a28u" x={1260} y={800} r={85} flag="USA" eyes="determined" motion={breathe(t, 70, 0.03, 18)} />
      </g>
    )} />
  );
};

const WASH = [{ t: 0, lon: -77.0, lat: 38.9, zoom: 70 }, { t: 2.5, lon: -77.0, lat: 38.9, zoom: 86 }];
export const A29: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a29" dim={0.55} keys={WASH} provinces={false} highlight={['USA']} labels={false}
    date={[{ t: 0, label: '10.1972' }, { t: 0.25, label: '26.10.1972' }]}
    over={() => (
      <g>
        <NameCard x={960} y={520} w={470} name="HENRY KISSINGER" sub="Cố vấn Mỹ" s={sec(t)} from={0.2} />
        <Ball id="a29" x={330} y={780} r={90} flag="USA" eyes="determined" motion={breathe(t, 64)} />
      </g>
    )}><City {...CITIES.washington} /></MapShot>
);

const Mic: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${r})`}>
    <line x1={0} y1={0} x2={0} y2={110} stroke="#111" strokeWidth={9} strokeLinecap="round" />
    <rect x={-34} y={110} width={68} height={12} rx={6} fill="#222" />
    <rect x={-17} y={-52} width={34} height={64} rx={17} fill="#3B4252" stroke="#111" strokeWidth={5} />
    <line x1={-17} y1={-26} x2={17} y2={-26} stroke="#9AA4B5" strokeWidth={3} /><line x1={-17} y1={-10} x2={17} y2={-10} stroke="#9AA4B5" strokeWidth={3} />
  </g>
);

export const A30: React.FC<ShotProps> = ({ t }) => {
  const q = Math.max(0.001, backOut((t - 50) / 10)), fl = Math.floor(t / 6);
  return (
    <MapShot t={t} id="a30" dim={0.6} keys={WASH.map((k) => ({ ...k, zoom: k.zoom + 12 }))} provinces={false} highlight={['USA']} labels={false} date="26.10.1972"
      over={() => (
        <g>
          <NameCard x={470} y={450} w={420} name="HENRY KISSINGER" sub="Cố vấn Mỹ" s={sec(t)} from={-1} />
          <Mic x={330} y={760} /><Mic x={470} y={780} r={4} /><Mic x={610} y={760} r={-3} />
          {[0, 1, 2].map((i) => {
            const a = ((t + i * 2) % 6) / 6, h = hash(fl + i, 3 + i), x = 760 + hash(fl + i, 1) * 960, y = 180 + h * 560;
            return t < 56 && a < 0.7 ? <polygon key={i} points={star(x, y, 46 * (1 - a))} fill="#FFFFFF" opacity={1 - a} /> : null;
          })}
          <g transform={`translate(1360,470) scale(${q})`}>
            <rect x={-420} y={-210} width={840} height={420} rx={26} fill="#1B2433" stroke="#E2B95A" strokeWidth={6} />
            <text y={-24} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#F4F4F4">“Hòa bình đã</text>
            <text y={76} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#FFD43B">trong tầm tay”</text>
            <text y={160} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#CBD5DF">Henry Kissinger, 26.10.1972</text>
          </g>
        </g>
      )}></MapShot>
  );
};
