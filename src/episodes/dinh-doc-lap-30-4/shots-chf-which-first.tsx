import React from 'react';
import { ShotProps } from '../../engine';
import { TankSide } from '../../countryball/ground-tanks';
import { easeOut, prog } from '../../countryball/fx-math';
import { FONT } from '../../engine/fonts';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift } from './cha-common';
import { Back, CameraIcon, FilmStrip, GateIcon, Ground, INK, Pill } from './chf-common';

// Chapter F, "which tank first" (447.3-460.2 s): F19 the long dispute (two tanks, question marks), F20 foreign reporters' photos and film (icons only,
// no photographer photos: none licensed), F21 tank 390 = cổng chính, F22 tank 843 = cổng phụ (both tags on screen).

const Bubble: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s * (0.6 + 0.4 * o)})`} opacity={o}>
    <path d="M-70,-60 Q-70,-120 0,-120 Q70,-120 70,-60 Q70,-6 10,-6 L-8,34 L-12,-6 Q-70,-8 -70,-60 Z" fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <text y={-42} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#C9343A">?</text>
  </g>
);

export const F19: React.FC<ShotProps> = ({ t, len }) => {
  const bob = (a: number) => 5 * Math.sin((t + a) * 0.16);
  const q = (a: number) => prog(t, a, a + 8) * (1 - prog(t, a + 26, a + 34));
  return (
    <g>
      <Back id="f19" a="#2A3548" b="#0A101C" />
      <Ground id="f19" y={880} />
      <Drift t={t} len={len} z0={1} z1={1.06} cx={960} cy={700}>
        <TankSide x={330} y={900 + bob(0)} size={540} kind="t54" num="843" searchlight flag="PRG" t={t} id="f19a" />
        <TankSide x={1190} y={900 + bob(9)} size={540} kind="type59" num="390" flag="PRG" t={t} id="f19b" />
      </Drift>
      <Bubble x={470} y={400} o={q(10)} /><Bubble x={1350} y={400} o={q(34)} /><Bubble x={900} y={340} o={q(58)} s={0.9} />
      <Out x={960} y={150} size={84} opacity={prog(t, 4, 16)}>NHIỀU NĂM TRANH LUẬN</Out>
      <Pill t={t} at={84} x={960} y={1000} text="AI HÚC ĐỔ CỔNG CHÍNH?" size={58} fill="#C9343A" />
    </g>
  );
};

const FLASHES = [10, 44, 78];
const flash = (t: number) => Math.max(0, ...FLASHES.map((a) => (t >= a ? Math.max(0, 1 - (t - a) / 12) : 0)));

export const F20: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(prog(t, 0, 16));
  return (
    <g>
      <Back id="f20" />
      <Drift t={t} len={len} z0={1} z1={1.05} cx={960} cy={540}>
        <CameraIcon x={470} y={560 + 40 * (1 - k)} s={1.7} flash={flash(t)} />
        <FilmStrip x={1360} y={560} w={860} h={250} rot={-5} shift={t * 4} frames={4}
          draw={(i, cx, cy, cw, ch) => <g transform={`translate(${cx},${cy})`}><rect x={-cw / 2} y={ch * 0.18} width={cw} height={ch * 0.32} fill="#6E7A55" opacity={0.75} /><TankSide x={-cw * 0.28} y={ch * 0.3} size={cw * 0.62} kind={i % 2 ? 'type59' : 't54'} id={`f20s${i}`} /></g>} />
      </Drift>
      <Out x={960} y={150} size={84} opacity={prog(t, 4, 16)}>ẢNH · THƯỚC PHIM</Out>
      <Out x={960} y={940} size={66} fill="#FFE600" opacity={prog(t, 36, 50)}>CỦA PHÓNG VIÊN NƯỚC NGOÀI</Out>
      <Pill t={t} at={92} x={960} y={1030} text="XÁC ĐỊNH ĐƯỢC" size={48} fill="#2F7F4F" />
    </g>
  );
};

export const F21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Back id="f21" a="#1E3326" b="#0A120D" />
    <Ground id="f21" y={900} />
    <Drift t={t} len={len} z0={1} z1={1.06} cx={960} cy={700}>
      <GateIcon x={1380} y={900} w={420} h={300} lit />
      <TankSide x={420 + 1.2 * t} y={930} size={700} kind="type59" num="390" flag="PRG" t={t} id="f21t" />
    </Drift>
    <Out x={960} y={150} size={96} opacity={prog(t, 4, 14)}>XE 390</Out>
    <Pill t={t} at={10} x={1380} y={300} text="CỔNG CHÍNH" size={64} fill="#2F7F4F" />
  </g>
);

export const F22: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = 1 + 0.03 * Math.sin(t * 0.3);
  return (
    <g>
      <Back id="f22" a="#1D2E4C" b="#0A101C" />
      <Ground id="f22" y={900} />
      <Drift t={t} len={len} z0={1} z1={1.05} cx={960} cy={700}>
        <g opacity={0.55}>
          <GateIcon x={1780} y={900} w={220} h={190} />
          <TankSide x={1300} y={930} size={400} kind="type59" num="390" flag="PRG" t={t} id="f22b" />
        </g>
        <g transform={`translate(0,0) scale(${pulse})`} style={{ transformOrigin: '600px 700px' }}>
          <GateIcon x={1000} y={900} w={200} h={180} lit />
          <TankSide x={400} y={930} size={600} kind="t54" num="843" searchlight flag="PRG" t={t} id="f22a" />
        </g>
      </Drift>
      <Out x={960} y={150} size={84} opacity={prog(t, 4, 14)}>XE 843 · CỔNG PHỤ</Out>
      <Pill t={t} at={8} x={640} y={300} text="CỔNG PHỤ · 843" size={56} fill="#2F5FB4" />
      <Pill t={t} at={30} x={1500} y={460} text="CỔNG CHÍNH · 390" size={48} fill="#2F7F4F" o={0.85} />
    </g>
  );
};
