import React from 'react';
import { ShotProps, kf, camT, clamp, easeOut, backOut, LOOKS, FONT } from '../../engine';
import { Pier, OctoOpts, octoSpine, SprayColumn } from './chc-harbour-props';
import { HarborScene, SHIP0, OCTO0 } from './chc-harbour-scene';
import { CalmPunchPip } from './chc-calm-punch-pip';
import { shakeAt } from './punch-fx-kit';

// CHAPTER C, octopus part 1 (C1-C5): the giant octopus rises at the port, wraps a cargo ship, 8 tentacles counted,
// Pip on the pier winding up. Words: "Rồi một con bạch tuộc khổng lồ trồi lên ... Bạn chỉ cần một nắm tay."
export const PIP_PIER = { x: 330, ground: 866, scale: 0.52, side: 1 as const, aim: 98, lunge: 60 };
const bobShip = (t: number, k = 1) => ({ ...SHIP0, dy: Math.sin(t * 0.1) * 6 * k, rot: Math.sin(t * 0.07) * 0.8 * k });

const PipStand: React.FC<{ t: number; hitT: number }> = ({ t, hitT }) => <CalmPunchPip t={t} hitT={hitT} {...PIP_PIER} rimId="rimR" />;

// ---------- C1: wide, the octopus climbs out of the sea behind the docked ship ----------
export const C1: React.FC<ShotProps> = ({ t }) => {
  const rise = easeOut(clamp((t - 3) / 46));
  const sk = rise < 1 ? { x: Math.sin(t * 2.3) * 4, y: Math.cos(t * 3.1) * 3 } : { x: 0, y: 0 };
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 960], [55, 1010]]), 540, kf(t, [[0, 1.0], [55, 1.07]]))}>
        <HarborScene t={t + 20} id="c1" rise={rise} look={-0.9} lookY={0.4} ship={bobShip(t)} />
        <Pier id="c1p" />
        <PipStand t={t} hitT={400} />
      </g>
    </g>
  );
};

// ---------- C2: medium, eight tentacles pour down over the containers and squeeze ----------
export const C2: React.FC<ShotProps> = ({ t }) => {
  const wrap = clamp((t - 4) / 40);
  const sq = clamp((t - 40) / 14);
  const sk = { x: Math.sin(t * 2.6) * 3 * sq, y: Math.cos(t * 3.3) * 2.5 * sq };
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 1330], [62, 1290]]), kf(t, [[0, 450], [62, 520]]), kf(t, [[0, 1.2], [62, 1.5]]))}>
        <HarborScene t={t + 80} id="c2" wrap={wrap} squeeze={sq} flail={1.6} look={-0.3} lookY={0.6} lid={0.55} mouth={sq} ship={bobShip(t, 1 - sq * 0.7)} />
      </g>
    </g>
  );
};

// ---------- C3: close-up, the ship groans in the grip ----------
export const C3: React.FC<ShotProps> = ({ t }) => {
  const sk = { x: Math.sin(t * 3.7) * 6, y: Math.cos(t * 4.3) * 5 };
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 1180], [31, 1230]]), 610, kf(t, [[0, 2.3], [31, 2.6]]))}>
        <HarborScene t={t + 150} id="c3" wrap={1} squeeze={1} ship={{ ...SHIP0, dy: 4, rot: Math.sin(t * 0.9) * 1.6 }} hideOcto />
        <SprayColumn t={t} at={2} x={1040} y={740} h={110} w={80} seed={3} />
        <SprayColumn t={t} at={14} x={1420} y={742} h={90} w={70} seed={8} />
      </g>
    </g>
  );
};

const Badge: React.FC<{ x: number; y: number; t: number; n: number }> = ({ x, y, t, n }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 5));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={30} fill="#FFFFFF" stroke="#16101A" strokeWidth={6} />
      <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#16101A">{n}</text>
    </g>
  );
};

// ---------- C4: "Nó có tám cái vòi": the tentacles light up one by one and get numbered 1..8 ----------
export const C4: React.FC<ShotProps> = ({ t }) => {
  const cur = Math.floor((t - 3) / 4);
  const o: OctoOpts = OCTO0;
  return (
    <g transform={camT(1290, 440, kf(t, [[0, 1.3], [38, 1.4]]))}>
      <HarborScene t={t + 200} id="c4" wrap={1} squeeze={0.4} hi={(k) => (k === cur && (t - 3) % 4 < 3 ? 1 : 0)} look={-0.2} lookY={0.2} ship={bobShip(t, 0.6)} />
      {Array.from({ length: 8 }).map((_, k) => {
        const p = octoSpine(o, k, t + 200, 1, SHIP0, 0.4)[10];
        return <Badge key={k} x={p.x} y={p.y} t={t - 3 - k * 4} n={k + 1} />;
      })}
    </g>
  );
};

// ---------- C5: Pip on the pier, small against the monster; his fist starts to close ----------
export const C5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(kf(t, [[0, 820], [43, 700]]), kf(t, [[0, 560], [43, 640]]), kf(t, [[0, 1.3], [43, 1.65]]))}>
    <HarborScene t={t + 260} id="c5" wrap={1} squeeze={0.5} look={-0.9} lookY={0.5} lid={0.5} ship={bobShip(t, 0.5)} />
    <Pier id="c5p" />
    <PipStand t={t} hitT={72} />
    <g transform={`translate(${shakeAt(t, 0, 0, 1).x} 0)`} />
  </g>
);
