import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, walkPose, kf, clamp, easeOut, backOut, camT, Street, streetStand, LEG_LEN, LOOKS, FONT, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { Note } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { ShopFront, Fridge, OWNER } from './chd-shop-props';

// Chapter D, "6 month one: milk" (190.81-200.51 s, look m1): D15 Pip remembers (flashback iris), D16 walks back to the
// shop, D17 the notes land on the sill, D18 the owner's eyes in the gap, D19 the shutter rolls half up.

const PIP = LOOKS.pipHood;
const GY = 700; // the shop's ground line

// ---------- D15: Pip stops, "!" , an iris opens on the day-one fridge: a hand takes a carton ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const iris = easeOut(clamp((t - 20) / 14));
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 960, y: 560, scale: 1.0, yaw: 0.5, facing: 1, look: -0.4, headTilt: 4 } },
    { f: 12, p: { headTilt: -3, look: 0.3 }, ease: easeOut },
  ]);
  const take = clamp((t - 30) / 22);
  const cx = 945 + 520 * easeOut(take);
  const cy = 380 - 120 * easeOut(take);
  const bang = backOut(clamp((t - 11) / 6));
  return (
    <g>
      <g transform={camT(960, 420, kf(t, [[0, 2.0], [len, 2.3]]))}>
        <g filter="url(#blur6)"><Street t={t + 90} id="d15st" market={0.2} grass={0.3} /></g>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [11, 'shock']]) }} rimId="rimR" shadow={0} />
        <g transform={`translate(1090 330) scale(${bang})`} opacity={clamp((t - 11) / 3)}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill="#FFE27A" stroke="#1A1230" strokeWidth={14} paintOrder="stroke">!</text>
        </g>
      </g>
      {iris > 0 ? (
        <g>
          <defs><clipPath id="d15iris"><circle cx={960} cy={540} r={iris * 1250} /></clipPath></defs>
          <g clipPath="url(#d15iris)">
            <g transform={camT(960, 480, kf(t, [[20, 1.0], [len, 1.1]]))}>
              <Fridge take={take} />
              <InsertArm x={cx + 74} y={cy + 40} fx={2250} fy={1000} rot={80} s={3.6} width={84} />
            </g>
            <rect x={0} y={0} width={1920} height={1080} fill="#7A5A32" opacity={0.28} style={{ mixBlendMode: 'multiply' }} />
          </g>
          <circle cx={960} cy={540} r={iris * 1250} fill="none" stroke="#FFF3CF" strokeWidth={10} opacity={0.8 * (1 - iris)} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- D16: Pip walks back along the street, past the shut shops ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const p0 = streetStand(0.6, 3.6);
  const ground = p0.y + LEG_LEN * p0.scale;
  const x = kf(t, [[0, 360], [len, 1500]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 1160]]), 640, 1.45)}>
      <Street t={t + 60} id="d16st" market={0.15} grass={0.35} />
      <Hero look={PIP} pose={{ ...walkPose(x, t * 0.6, ground, p0.scale * 1.05, { ...faceAt(t, [[0, 'worried']]) }, 1) }} rimId="rimR" shadow={1} />
    </g>
  );
};

// ---------- D17: insert: two notes come down on the stone sill; the hand leaves them there ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => {
  const down = easeOut(clamp((t - 6) / 16));
  const away = easeOut(clamp((t - 26) / 16));
  const hx = 1180 - 120 * away;
  const hy = GY - 130 + 170 * down - 40 * away;
  return (
    <g transform={camT(960, GY + 10, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <ShopFront x={960} gy={GY} id="d17" t={t} />
      <g transform={`translate(${hx - 70} ${hy + 20 + 0}) scale(1 0.62)`}>
        <Note x={0} y={0} v="10.000" s={0.6} rot={-8} />
        <Note x={70} y={14} v="5.000" s={0.6} rot={7} />
      </g>
      <InsertArm x={hx + 20} y={hy - 40} fx={2150 - 200 * away} fy={GY - 330 + 200 * away} rot={70} s={2.6} width={62} />
    </g>
  );
};

// ---------- D18: Pip waits; two eyes look out at him through the gap, a long time; slow push-in on the slit ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const blink = t % 44 < 4 ? 0.12 : 1;
  const look = Math.sin(t / 20) * 6;
  const eyes = (
    <g>
      {[-40, 40].map((dx) => (
        <g key={dx} transform={`translate(${960 + dx} ${GY - 30})`}>
          <ellipse rx={26} ry={13 * blink} fill="#F4EEDD" stroke="#1A100C" strokeWidth={3} />
          <circle cx={look} cy={0} r={8 * Math.min(1, blink * 1.5)} fill="#1A100C" />
        </g>
      ))}
      <path d={`M ${960 - 72} ${GY - 52} Q ${960 - 40} ${GY - 64} ${960 - 8} ${GY - 52} M ${960 + 8} ${GY - 52} Q ${960 + 40} ${GY - 64} ${960 + 72} ${GY - 52}`} stroke="#8E8E96" strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
  const pip: Pose = { ...basePose, x: 380, y: GY + 150 - LEG_LEN * 1.1, scale: 1.1, yaw: 0.6, facing: 1, look: 0.8, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: Math.sin(t / 25) * 2, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 960]]), kf(t, [[0, GY - 120], [len, GY - 40]]), kf(t, [[0, 1.2], [len, 2.5]]))}>
      <ShopFront x={960} gy={GY} id="d18" t={t} gap={60} lit={0.04} inside={eyes} />
      <g transform={`translate(840 ${GY + 30}) scale(1 0.62)`}>
        <Note x={0} y={0} v="10.000" s={0.6} rot={-8} />
        <Note x={70} y={14} v="5.000" s={0.6} rot={7} />
      </g>
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0.8} />
    </g>
  );
};

// ---------- D19: the shutter rolls halfway up; warm light spills out over the sill and over Pip ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp((t - 8) / 40)) * 0.5;
  const S = 1.0;
  const owner: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 960, y: GY - LEG_LEN * S, scale: S, yaw: 0.2, facing: 1, armR: { a: 168, b: 4 }, armL: { a: 168, b: 4 } } },
    { f: 50, p: { armR: { a: 12, b: -8 }, armL: { a: 12, b: -8 } }, ease: easeOut },
  ]);
  const pip: Pose = { ...basePose, x: 330, y: GY + 150 - LEG_LEN * 1.1, scale: 1.1, yaw: 0.6, facing: 1, look: 0.8, headTilt: -2, ...faceAt(t, [[0, 'worried'], [44, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), GY - 150, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <ShopFront x={960} gy={GY} id="d19" t={t} open={open} inside={<Hero look={OWNER} pose={{ ...owner, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0} />} />
      <g transform={`translate(840 ${GY + 30}) scale(1 0.62)`}>
        <Note x={0} y={0} v="10.000" s={0.6} rot={-8} />
        <Note x={70} y={14} v="5.000" s={0.6} rot={7} />
      </g>
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0.8} />
    </g>
  );
};
