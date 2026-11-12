import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret } from '../../countryball/ball-accessories-military';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { cameraAt, Camera } from '../../countryball/geo-camera';
import { FrontArrow, SIDE_COLORS, TrenchLine, UnitBox } from '../../countryball/ground-front-arrows';
import { TankColumn } from '../../countryball/ground-tanks';
import { LowerThird } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { countAt, fmtVi } from '../../countryball/hud-counter';
import { easeOut, hash, Pt } from '../../countryball/fx-math';
import { Backdrop, CREDIT, IMG, MapHud, Pop, proj, QtMap, ramp, sec, Txt, YELLOW } from './chb-common';
import { COAST_ROAD, MY_CHANH_LINE, QL1 } from './chb-routes';

// Chapter B, beat "6 lam son" (B12-B17, 148.0-163.5 s): 28.6.1972 the counter-offensive starts from the Mỹ Chánh line: arrows,
// the name stamp, the two divisions (Dù red beret / TQLC green beret), the tank regiments, "hơn 35.000 quân".

const MC = CAMERAS.myChanh;
const cam12 = (s: number, dur: number): Camera => cameraAt([{ t: 0, ...MC, lat: MC.lat + 0.012 }, { t: dur, ...MC, lat: MC.lat + 0.03, zoom: MC.zoom * 1.06, ease: 'linear' }], s);
const pts = (cam: Camera, ll: [number, number][]): Pt[] => ll.map(([lo, la]) => proj(cam)(lo, la));

// ---------- B12: 28.6: the start line on the Mỹ Chánh river, then the first arrows ----------
export const B12: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cam12(s, 3.6), P = proj(cam);
  const [ux, uy] = P(107.12, 16.669);
  return (
    <g>
      <QtMap cam={cam} id="b12m" sites={['myChanh', 'haiLang', 'quangTri', 'laVang']} />
      <TrenchLine id="b12l" t={t} t0={6} points={pts(cam, MY_CHANH_LINE)} style="triangles" color={YELLOW} side={-1} dur={40} />
      <UnitBox x={ux} y={uy} kind="inf" color={YELLOW} label="VNCH" size={74} />
      <FrontArrow id="b12a" t={t} t0={50} points={pts(cam, QL1.slice(0, 3))} width={46} color={SIDE_COLORS.rvn} dur={48} />
      <FrontArrow id="b12b" t={t} t0={58} points={pts(cam, COAST_ROAD.slice(0, 2))} width={40} color={SIDE_COLORS.rvn} dur={44} />
      <Txt x={1150} y={180} text="PHẢN CÔNG BẮT ĐẦU" size={70} o={ramp(s, 0.1, 0.4)} />
      <MapHud s={s} cam={cam} date="28.06.1972" day="NGÀY 1/81" />
    </g>
  );
};

// ---------- B13: the name: "LAM SƠN 72" stamp + the first landing photo ----------
export const B13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cam12(s + 3.6, 5.5), P = proj(cam);
  const k = easeOut(ramp(s, 0.05, 0.3));
  return (
    <g>
      <QtMap cam={cam} id="b13m" sites={['myChanh', 'haiLang', 'quangTri']} />
      <TrenchLine id="b13l" t={t + 108} t0={6} points={pts(cam, MY_CHANH_LINE)} style="triangles" color={YELLOW} side={-1} dur={40} />
      <FrontArrow id="b13a" t={t + 108} t0={50} points={pts(cam, QL1)} width={46} color={SIDE_COLORS.rvn} dur={80} />
      <FrontArrow id="b13b" t={t + 108} t0={58} points={pts(cam, COAST_ROAD)} width={40} color={SIDE_COLORS.rvn} dur={80} />
      <g transform={`translate(1150,230) scale(${2.2 - 1.2 * k}) rotate(-3)`} opacity={k}>
        <rect x={-380} y={-84} width={760} height={168} rx={20} fill="#15181F" fillOpacity={0.93} stroke={YELLOW} strokeWidth={8} />
        <rect x={-362} y={-66} width={724} height={132} rx={12} fill="none" stroke="#C9343A" strokeWidth={4} />
        <Txt x={0} y={30} text="LAM SƠN 72" size={104} color={YELLOW} stroke="none" />
      </g>
      <PhotoCard t={s} src={`${IMG}marine1.jpg`} caption="Trực thăng CH-46 gần Huế, 28.6.1972" credit={CREDIT.usmc} x={1450} y={640} w={500} h={370} rot={3} from={0.3} to={s + 1} id="b13p" />
      <MapHud s={s} cam={cam} date="28.06.1972" day="NGÀY 1/81" mini={false} />
    </g>
  );
};

// ---------- B14: two of the best divisions: two big unit boxes march up to the line ----------
export const B14: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...MC, lat: 16.668 }, { t: 5, ...MC, lat: 16.676, zoom: MC.zoom * 1.05, ease: 'linear' }], s), P = proj(cam), [x1, y1] = P(107.13, 16.652), [x2, y2] = P(107.26, 16.655);
  const k = easeOut(ramp(s, 0.2, 0.8));
  return (
    <g>
      <QtMap cam={cam} id="b14m" sites={['myChanh', 'haiLang', 'quangTri']} />
      <TrenchLine id="b14l" t={999} t0={0} points={pts(cam, MY_CHANH_LINE)} style="triangles" color={YELLOW} side={-1} dur={1} />
      <g transform={`translate(0,${(1 - k) * 160})`} opacity={k}>
        <UnitBox x={x1} y={y1 + 90} kind="air" color={YELLOW} label="SƯ ĐOÀN DÙ" size={120} />
        <UnitBox x={x2} y={y2 + 90} kind="mar" color={YELLOW} label="SƯ ĐOÀN TQLC" size={120} />
      </g>
      <Txt x={1150} y={180} text="HAI SƯ ĐOÀN THIỆN CHIẾN NHẤT" size={64} o={ramp(s, 0.05, 0.35)} />
      <MapHud s={s} cam={cam} date="28.06.1972" day="NGÀY 1/81" mini={false} />
    </g>
  );
};

// ---------- B15: the red beret and the green beret (+ the landing photo) ----------
export const B15: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b15" />
      <Pop s={s} at={0.1} x={330} y={560}><Ball id="b15d" x={330} y={540} r={150} flag="RVN" eyes="determined" hat={<Beret color="#B3262B" badge="wings" />} t={t} motion={mixMotion(breathe(t, 66, 0.03), hop(t, 56, 14))} /></Pop>
      <Pop s={s} at={0.45} x={1590} y={560}><Ball id="b15m" x={1590} y={540} r={150} flag="RVN" eyes="determined" hat={<Beret color="#2F6B3A" badge="anchor" />} t={t} motion={mixMotion(breathe(t, 66, 0.03, 9), hop(t - 8, 56, 14))} /></Pop>
      <Txt x={330} y={790} text="SƯ ĐOÀN DÙ" size={56} color="#FF8C84" o={ramp(s, 0.2, 0.5)} />
      <Txt x={330} y={856} text="mũ nồi đỏ" size={38} color="#DCE4EC" weight={600} o={ramp(s, 0.2, 0.5)} />
      <Txt x={1590} y={790} text="SƯ ĐOÀN TQLC" size={56} color="#9BD6A8" o={ramp(s, 0.5, 0.8)} />
      <Txt x={1590} y={856} text="mũ nồi xanh" size={38} color="#DCE4EC" weight={600} o={ramp(s, 0.5, 0.8)} />
      <PhotoCard t={s} src={`${IMG}marine2.jpg`} caption="Thủy quân lục chiến lên trực thăng, 28.6.1972" credit={CREDIT.usmc} x={960} y={490} w={460} h={326} rot={-2.5} from={0.3} to={s + 1} id="b15p" fromSide="bottom" />
      <Txt x={960} y={130} text="MŨ ĐỎ  ·  MŨ XANH" size={66} o={ramp(s, 0.05, 0.3)} />
    </g>
  );
};

// ---------- B16: and tank regiments (M48 column rolls up the road) ----------
export const B16: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cam12(s + 2, 5), road = pts(cam, QL1);
  return (
    <g>
      <QtMap cam={cam} id="b16m" sites={['myChanh', 'haiLang', 'quangTri']} />
      <path d={road.map((p, i) => `${i ? 'L' : 'M'}${p.join(',')}`).join('')} stroke="#E8D9A8" strokeWidth={9} fill="none" strokeDasharray="22 10" opacity={0.75} />
      <TankColumn id="b16t" t={t} t0={0} t1={64} points={[[road[0][0], road[0][1] + 140], ...road]} n={4} gap={120} size={78} kind="m48" fireEvery={36} />
      <Txt x={1150} y={180} text="THIẾT ĐOÀN XE TĂNG" size={70} o={ramp(s, 0.05, 0.3)} />
      <MapHud s={s} cam={cam} date="28.06.1972" day="NGÀY 1/81" />
    </g>
  );
};

// ---------- B17: "hơn 35.000 quân, theo phía Việt Nam": dots of soldiers fill the ground south of the line ----------
const COUNT = [{ t: 0.25, value: 0 }, { t: 1.9, value: 35000 }];
export const B17: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...MC, lat: MC.lat - 0.012 }, { t: 3.2, ...MC, lat: MC.lat - 0.004, ease: 'linear' }], s), P = proj(cam), n = countAt(COUNT, s), [cx, cy] = P(107.2, 16.632);
  const dots = Math.round((n / 35000) * 420);
  return (
    <g>
      <QtMap cam={cam} id="b17m" sites={['myChanh', 'haiLang']} />
      <rect width={1920} height={1080} fill="#050B15" opacity={0.35} />
      {Array.from({ length: dots }, (_, i) => {
        const a = hash(i, 3) * Math.PI * 2, r = Math.sqrt(hash(i, 5));
        return <circle key={i} cx={cx + Math.cos(a) * r * 620} cy={cy + Math.sin(a) * r * 200} r={7} fill={YELLOW} stroke="#151515" strokeWidth={2} />;
      })}
      <g transform="translate(1030,420)">
        <rect x={-440} y={-150} width={880} height={300} rx={34} fill="#15181F" fillOpacity={0.92} stroke={YELLOW} strokeWidth={6} />
        <Txt x={0} y={-82} text="QUÂN" size={44} color="#E2B95A" stroke="none" />
        <Txt x={0} y={72} text={`${fmtVi(Math.min(n, 35000))}${n >= 35000 ? '+' : ''}`} size={170} stroke="none" />
      </g>
      <LowerThird title="Hơn 35.000 quân" sub="Theo phía Việt Nam" t={s} from={1.7} accent={YELLOW} />
      <MapHud s={s} cam={cam} date="28.06.1972" day="NGÀY 1/81" />
    </g>
  );
};
