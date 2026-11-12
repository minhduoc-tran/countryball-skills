import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { PilotHelmet } from '../../countryball/ball-accessories';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { GeoMap } from '../../countryball/map-geo-map';
import { PhotoCard } from '../../countryball/photo-card';
import { cameraAt } from '../../countryball/geo-camera';
import { clamp, easeOut, hash, Pt } from '../../countryball/fx-math';
import { samplePath } from '../../countryball/fx-flight-path';
import { Backdrop, Badge, Cell, cellSlots, cellLead, MapHud, PHOTO_CREDIT, Pop, ramp, sec, Txt } from './chb-common';

// Chapter B, beat "5 the b52" (B9-B14): the B-52 revealed (pháo đài bay), 8 engines, crew of 6, tonnes of bombs, a cell of
// three, the carpet footprint ~1 km x 3 km, and the name "ném bom rải thảm" over the archive photo.

// ---------- B9: big side view sliding in under a night sky ----------
export const B9: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), x = 700 + 330 * easeOut(ramp(s, 0, 3.4)), bob = Math.sin(s * 2.1) * 8;
  return (
    <g>
      <Backdrop s={s * 3} id="b9" top="#070E1B" bottom="#22344F" grid={false} />
      {Array.from({ length: 46 }, (_, i) => <circle key={i} cx={(hash(i, 1) * 2100 - s * (10 + hash(i, 2) * 40) + 2100) % 2000 - 40} cy={hash(i, 3) * 700} r={1.5 + hash(i, 4) * 2.2} fill="#FFF" opacity={0.3 + 0.5 * hash(i, 5)} />)}
      {[0, 1, 2].map((i) => <rect key={i} x={((i * 700 - s * (500 + i * 220)) % 2400 + 2400) % 2400 - 400} y={430 + i * 150} width={420 + i * 120} height={4} rx={2} fill="#9DB6D6" opacity={0.18} />)}
      <AircraftSide kind="b52" x={x} y={620 + bob} size={1400} pitch={1.5 + Math.sin(s * 1.3)} variant="D" />
      <Txt x={960} y={250} text="B-52" size={210} o={ramp(s, 0.25, 0.55)} />
      <Pop s={s} at={2.65} x={960} y={950}><Txt x={960} y={960} text="PHÁO ĐÀI BAY" size={104} color="#E2B95A" /></Pop>
      <text x={960} y={318} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#9DB6D6" opacity={ramp(s, 0.5, 0.9)} letterSpacing={6}>STRATOFORTRESS</text>
    </g>
  );
};

// ---------- B10: top view, eight engines numbered; then six crew balls ----------
const leX = (y: number) => 10 - (30 / 54) * (y - 4);          // wing leading-edge x at span y (sprite units)
export const B10: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), m = easeOut(ramp(s, 1.2, 1.65)), size = 780 - 360 * m, cy = 520 - 220 * m, k = size / 100, cx = 960;
  const engines: Pt[] = [];
  for (const y of [-32, -16, 16, 32]) for (const dx of [-5, 5]) engines.push([cx + k * (leX(Math.abs(y)) + 1 + dx), cy + k * y]);
  const crewAt = (i: number) => 1.3 + i * 0.12;
  return (
    <g>
      <Backdrop s={s} id="b10" />
      <AircraftTop id="b10p" kind="b52" x={cx} y={cy} size={size} heading={0} />
      {engines.map(([ex, ey], i) => {
        const at = 0.05 + i * 0.13, o = ramp(s, at, at + 0.1) * (1 - ramp(s, 1.15, 1.4));
        return o > 0 ? <g key={i} opacity={o}><circle cx={ex} cy={ey} r={k * 5.2} fill="none" stroke="#FFD166" strokeWidth={5} /><Badge x={ex} y={ey} n={i + 1} r={k * 3.6} /></g> : null;
      })}
      <Txt x={300} y={560} text="8 ĐỘNG CƠ" size={78} o={ramp(s, 0.05, 0.3) * (1 - ramp(s, 1.15, 1.4))} />
      <Txt x={960} y={650} text="TỔ LÁI 6 NGƯỜI" size={84} color="#E2B95A" o={ramp(s, 1.35, 1.6)} />
      {Array.from({ length: 6 }, (_, i) => s >= crewAt(i) && (
        <Ball key={i} id={`b10c${i}`} x={500 + i * 184} y={850} r={68} flag="USA" eyes="determined" hat={<PilotHelmet />}
          motion={mixMotion(breathe(t, 60, 0.03, i * 9), hopOnce(t, Math.round(crewAt(i) * 30), 18, 26))} t={t} />
      ))}
    </g>
  );
};

// ---------- B11: Mk 117 bombs photo, "hàng chục tấn bom" ----------
const Bomb: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-60,-16 Q-60,-22 -30,-22 L36,-22 Q70,-20 78,0 Q70,20 36,22 L-30,22 Q-60,22 -60,16 Z" fill="#6B7A3A" stroke="#151515" strokeWidth={5} strokeLinejoin="round" />
    <path d="M-60,-16 L-92,-34 L-92,34 L-60,16 Z" fill="#4E5A28" stroke="#151515" strokeWidth={5} strokeLinejoin="round" />
    <rect x={14} y={-22} width={12} height={44} fill="#FFCD00" opacity={0.85} />
  </g>
);
export const B11: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b11" />
      <PhotoCard t={s} src="dien-bien-phu-tren-khong/img/b52d-mk117-bombs-andersen.jpg" caption="Bom Mk 117 trước B-52D, Andersen" credit={PHOTO_CREDIT.usaf}
        x={560} y={540} w={520} h={680} rot={-2.5} from={-0.45} to={len / 30 + 0.6} id="b11p" kb={{ z0: 1.03, z1: 1.14, px0: 0.01, px1: -0.01 }} />
      <Txt x={1340} y={330} text="HÀNG CHỤC" size={128} o={ramp(s, 0.1, 0.35)} />
      <Txt x={1340} y={470} text="TẤN BOM" size={128} color="#E2B95A" o={ramp(s, 0.35, 0.6)} />
      {Array.from({ length: 5 }, (_, i) => <Pop key={i} s={s} at={0.65 + i * 0.1} x={1130 + i * 100} y={650}><Bomb x={1130 + i * 100} y={650 + (i % 2) * 70} s={0.72} rot={90} /></Pop>)}
    </g>
  );
};

// ---------- B12: a cell of three over the north, numbered 1-2-3 ----------
const CELL_PTS: Pt[] = [[-260, 780], [900, 580], [2200, 340]];
export const B12: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 105.6, lat: 21.2, zoom: 150 }, { t: 2.4, lon: 105.9, lat: 21.4, zoom: 165 }], s);
  const sp = samplePath(CELL_PTS), d = cellLead(CELL_PTS, t, 0, 105), slots = cellSlots(sp, d, 130, 150, 120);
  return (
    <g>
      <GeoMap camera={cam} night={0.5} id="b12m" highlight={['VNM']} />
      <Cell id="b12c" t={t} points={CELL_PTS} t0={0} t1={105} size={130} spread={150} step={120} />
      {slots.map((p, i) => s > 0.35 + i * 0.3 && <Pop key={i} s={s} at={0.35 + i * 0.3} x={p.x} y={p.y - 90}><Badge x={p.x} y={p.y - 90} n={i + 1} r={32} /></Pop>)}
      <Pop s={s} at={0.5} x={960} y={160}><Txt x={960} y={170} text="3 CHIẾC = 1 TỐP" size={84} /></Pop>
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

// ---------- B13: the carpet: a cell crosses a plan-view ground, bombs walk across a 1 km x 3 km footprint ----------
const CARPET: Pt[] = [[-300, 560], [2200, 560]];
const Bracket: React.FC<{ x1: number; y1: number; x2: number; y2: number; o: number }> = ({ x1, y1, x2, y2, o }) => (
  <g opacity={o} stroke="#E2B95A" strokeWidth={6} strokeLinecap="round">
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <line x1={x1 - (y1 === y2 ? 0 : 18)} y1={y1 - (y1 === y2 ? 18 : 0)} x2={x1 + (y1 === y2 ? 0 : 18)} y2={y1 + (y1 === y2 ? 18 : 0)} />
    <line x1={x2 - (y1 === y2 ? 0 : 18)} y1={y2 - (y1 === y2 ? 18 : 0)} x2={x2 + (y1 === y2 ? 0 : 18)} y2={y2 + (y1 === y2 ? 18 : 0)} />
  </g>
);
export const B13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), wOp = ramp(s, 1.35, 1.65), lOp = ramp(s, 3.1, 3.4), foot = ramp(s, 1.0, 1.4);
  const streets = Array.from({ length: 12 }, (_, i) => i);
  return (
    <g>
      <Backdrop s={s} id="b13" top="#232A21" bottom="#10150F" grid={false} />
      {streets.map((i) => <rect key={`h${i}`} x={0} y={i * 92 - 20} width={1920} height={14} fill="#3A4136" opacity={0.7} />)}
      {streets.concat([12, 13, 14, 15, 16, 17, 18, 19]).map((i) => <rect key={`v${i}`} x={i * 100 + 20} y={0} width={12} height={1080} fill="#3A4136" opacity={0.7} />)}
      <rect x={510} y={410} width={900} height={300} fill="#FFD166" opacity={0.08 * foot} stroke="#FFD166" strokeWidth={4} strokeDasharray="22 14" strokeOpacity={foot} />
      <BombCarpet id="b13c" t={t} t0={32} from={[510, 560]} to={[1410, 560]} dur={43} n={34} width={250} r={30} linger={150} seed={4} />
      <Cell id="b13p" t={t} points={CARPET} t0={0} t1={115} size={150} spread={100} step={120} trailLen={500} />
      <Bracket x1={470} y1={410} x2={470} y2={710} o={wOp} />
      <Txt x={440} y={582} text="RỘNG ≈ 1 km" size={56} anchor="end" o={wOp} />
      <Bracket x1={510} y1={770} x2={1410} y2={770} o={lOp} />
      <Txt x={960} y={862} text="DÀI ≈ 3 km" size={56} o={lOp} />
      <Txt x={1860} y={1040} text="Sơ đồ minh họa, không theo tỉ lệ" size={24} anchor="end" weight={600} font="Space Mono" color="#9DB6D6" o={0.85} />
    </g>
  );
};

// ---------- B14: "ném bom rải thảm" over the archive photo ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b14" />
      <Txt x={520} y={420} text="NÉM BOM" size={150} o={ramp(s, 0.2, 0.5)} />
      <Txt x={520} y={580} text="RẢI THẢM" size={150} color="#E2B95A" o={ramp(s, 0.55, 0.85)} />
      {Array.from({ length: 6 }, (_, i) => {
        const u = (s * 0.8 + i / 6) % 1;
        return <Bomb key={i} x={190 + i * 130} y={720 + u * 300} s={0.6} rot={90} />;
      })}
      <PhotoCard t={s} src="dien-bien-phu-tren-khong/img/b52d-dropping-bombs-vietnam.jpg" caption="B-52D thả bom trên Việt Nam" credit={PHOTO_CREDIT.usaf}
        x={1380} y={520} w={700} h={625} rot={2.5} from={-0.45} to={len / 30 + 0.6} id="b14p" fromSide="right" kb={{ z0: 1.03, z1: 1.14 }} />
    </g>
  );
};
