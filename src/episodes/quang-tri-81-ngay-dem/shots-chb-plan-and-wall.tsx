import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret } from '../../countryball/ball-accessories-military';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { Camera, cameraAt } from '../../countryball/geo-camera';
import { CitadelPlanInMap } from '../../countryball/citadel-plan';
import { FrontArrow, SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { PhotoCard } from '../../countryball/photo-card';
import { easeOut, Pt } from '../../countryball/fx-math';
import { CREDIT, Dim, IMG, MapHud, Pop, proj, QtMap, ramp, sec, Txt, YELLOW } from './chb-common';
import { COAST_ROAD, QL1, TOWN_LL } from './chb-routes';
import { SourceTag } from './chb-table-and-icons';

// Chapter B, beat "8 plan" (B27-B30, 188.9-205.2 s): the plan is "about 2 weeks"; advance along QL1 and the coast road;
// 7.7.1972 the paratroopers reach the south edge of the town and see the brick walls of the old citadel.

const PLAN: Camera = { lon: 107.2, lat: 16.71, zoom: 6800 };
const pts = (cam: Camera, ll: [number, number][]): Pt[] => ll.map(([lo, la]) => proj(cam)(lo, la));

// ---------- B27: "dự tính lấy lại thị xã chỉ trong khoảng hai tuần": 14 calendar days tick off, the stamp "≈ 2 TUẦN" ----------
export const B27: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...PLAN }, { t: 4.4, ...PLAN, lat: PLAN.lat + 0.015, zoom: PLAN.zoom * 1.08, ease: 'linear' }], s), P = proj(cam);
  const [tx, ty] = P(TOWN_LL[0], TOWN_LL[1]), [sx, sy] = P(107.195, 16.69);
  const days = Math.floor(14 * ramp(s, 1.3, 2.9)), stamp = easeOut(ramp(s, 3.0, 3.35));
  return (
    <g>
      <QtMap cam={cam} id="b27m" sites={['quangTri', 'haiLang', 'laVang']} />
      <FrontArrow id="b27a" t={t} t0={10} points={[[sx, sy + 160], [sx, sy], [tx - 20, ty + 60]]} width={44} color={SIDE_COLORS.rvn} dur={70} />
      <circle cx={tx} cy={ty} r={60 + 8 * Math.sin(t * 0.3)} fill="none" stroke={YELLOW} strokeWidth={6} strokeDasharray="14 10" opacity={ramp(s, 0.5, 0.9)} />
      <Txt x={1150} y={180} text="DỰ TÍNH LẤY LẠI THỊ XÃ" size={68} o={ramp(s, 0.05, 0.3)} />
      <SourceTag x={1150} y={262} text="Theo nhiều tài liệu" o={ramp(s, 0.2, 0.5)} />
      <g transform="translate(1480,540)" opacity={ramp(s, 1.1, 1.4)}>
        <rect x={-300} y={-60} width={600} height={320} rx={22} fill="#F4EFE0" stroke="#15151A" strokeWidth={6} />
        <rect x={-300} y={-60} width={600} height={74} rx={22} fill="#C9343A" stroke="#15151A" strokeWidth={6} />
        {Array.from({ length: 14 }, (_, i) => {
          const cx = -240 + (i % 7) * 80, cy = 50 + Math.floor(i / 7) * 100, on = i < days;
          return <g key={i}><rect x={cx - 32} y={cy - 38} width={64} height={80} rx={8} fill={on ? '#FFD166' : '#E5DFCB'} stroke="#15151A" strokeWidth={3.5} />
            {on && <path d={`M${cx - 18},${cy} l12,14 l24,-30`} stroke="#15151A" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}</g>;
        })}
      </g>
      <g transform={`translate(1480,340) scale(${0.5 + 0.5 * stamp}) rotate(-8)`} opacity={stamp}>
        <rect x={-250} y={-72} width={500} height={144} rx={22} fill="#15181F" fillOpacity={0.94} stroke="#FF5A5F" strokeWidth={9} />
        <Txt x={0} y={34} text="≈ 2 TUẦN" size={104} color="#FF8C84" stroke="none" />
      </g>
      <MapHud s={s} cam={cam} date="28.06.1972" day="NGÀY 1/81" />
    </g>
  );
};

// ---------- B28: from the south: along Highway 1 and the coastal road ----------
export const B28: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...PLAN, lon: 107.23 }, { t: 4.5, ...PLAN, lon: 107.235, lat: PLAN.lat + 0.012, ease: 'linear' }], s);
  const ql1 = pts(cam, QL1), coast = pts(cam, COAST_ROAD);
  const road = (p: Pt[]) => p.map((q, i) => `${i ? 'L' : 'M'}${q.join(',')}`).join('');
  const l1 = ql1[Math.floor(ql1.length / 2)], l2 = coast[1];
  return (
    <g>
      <QtMap cam={cam} id="b28m" sites={['quangTri', 'haiLang', 'laVang']} />
      <path d={road(ql1)} stroke="#E8D9A8" strokeWidth={8} fill="none" strokeDasharray="20 10" opacity={0.7} />
      <path d={road(coast)} stroke="#E8D9A8" strokeWidth={8} fill="none" strokeDasharray="20 10" opacity={0.7} />
      <FrontArrow id="b28a" t={t} t0={6} points={ql1} width={50} color={SIDE_COLORS.rvn} dur={62} />
      <FrontArrow id="b28b" t={t} t0={70} points={coast} width={46} color={SIDE_COLORS.rvn} dur={58} />
      <g opacity={ramp(s, 0.7, 1.0)}><SourceTag x={l1[0] - 260} y={l1[1]} text="QUỐC LỘ 1" /></g>
      <g opacity={ramp(s, 2.6, 2.9)}><SourceTag x={l2[0] + 250} y={l2[1]} text="ĐƯỜNG VEN BIỂN" /></g>
      <Txt x={1150} y={180} text="TIẾN LÊN TỪ PHÍA NAM" size={70} o={ramp(s, 0.05, 0.3)} />
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B29: 7.7.1972: the paratroopers reach the south edge of the town ----------
const SOUTH: Camera = { lon: 107.19, lat: 16.743, zoom: 14000 };
export const B29: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...SOUTH }, { t: 3.7, ...SOUTH, lat: 16.745, zoom: 16500, ease: 'linear' }], s), P = proj(cam);
  const [qx, qy] = P(TOWN_LL[0], TOWN_LL[1]), road = pts(cam, [[107.196, 16.69], [107.196, 16.712], [107.193, 16.7385]]);
  const end = road[road.length - 1];
  return (
    <g>
      <QtMap cam={cam} id="b29m" sites={['quangTri', 'thachHanBridge']} />
      <FrontArrow id="b29a" t={t} t0={4} points={road} width={46} color={SIDE_COLORS.rvn} dur={58} />
      <Pop s={s} at={1.8} x={end[0]} y={end[1] + 20}>
        <Ball id="b29d" x={end[0]} y={end[1] + 56} r={52} flag="RVN" eyes="determined" hat={<Beret color="#B3262B" badge="wings" />} t={t} motion={mixMotion(breathe(t, 60, 0.04), hop(t, 48, 10))} />
      </Pop>
      <circle cx={qx} cy={qy} r={52} fill="none" stroke={SIDE_COLORS.vnm} strokeWidth={5} strokeDasharray="12 9" strokeDashoffset={-t} />
      <Txt x={1210} y={150} text="LÍNH DÙ TỚI VÙNG VEN PHÍA NAM" size={62} o={ramp(s, 0.1, 0.4)} />
      <PhotoCard t={s} src={`${IMG}006.jpg`} caption="Sơ đồ phòng thủ thị xã, 4.1972" credit={CREDIT.usmcHist} x={470} y={640} w={520} h={391} rot={-3} from={0.9} to={s + 1} id="b29p" fromSide="left" />
      <MapHud s={s} cam={cam} date="07.07.1972" day="NGÀY 10/81" />
    </g>
  );
};

// ---------- B30: "họ nhìn thấy những bức tường gạch của một tòa thành cổ": push in onto the citadel ----------
export const B30: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const cam = cameraAt([{ t: 0, lon: 107.19, lat: 16.73, zoom: 16500 }, { t: 3.9, lon: 107.1896, lat: 16.7555, zoom: 80000, ease: 'inout' }], s);
  const k = easeOut(ramp(s, 0.3, 0.8));
  return (
    <g>
      <QtMap cam={cam} id="b30m" names={false} dmz={false} sites={cam.zoom < 30000 ? ['quangTri', 'thachHanBridge'] : false}>
        <CitadelPlanInMap damage={0.05} t={t} labels={['citadel']} />
      </QtMap>
      <Dim o={0.12} />
      <g transform={`translate(${220 - (1 - k) * 300},830)`} opacity={k}>
        <Ball id="b30d" x={0} y={0} r={96} flag="RVN" eyes="worried" look={0.9} hat={<Beret color="#B3262B" badge="wings" />} t={t} motion={mixMotion(breathe(t, 66, 0.03), hop(t, 90, 6))} />
        <Txt x={0} y={148} text="LÍNH DÙ" size={40} color="#FF8C84" />
      </g>
      <Txt x={1100} y={150} text="THÀNH CỔ" size={104} o={ramp(s, 1.2, 1.6)} color="#F4F4F4" />
      <Txt x={1100} y={226} text="NHỮNG BỨC TƯỜNG GẠCH" size={56} color="#E2B95A" o={ramp(s, 1.5, 1.9)} />
      <MapHud s={s} cam={cam} date="07.07.1972" day="NGÀY 10/81" />
    </g>
  );
};
