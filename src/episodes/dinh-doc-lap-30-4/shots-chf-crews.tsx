import React from 'react';
import { ShotProps } from '../../engine';
import { TankSide } from '../../countryball/ground-tanks';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift, Slam } from './cha-common';
import { Back, Ground, Sil, Who } from './chf-common';

// Chapter F, the crews (433.9-447.3 s, after the plan shot F13): F14 Bùi Quang Thận (843), F15 "4 người" on tank 390 (four names from science),
// F16 Vũ Đăng Toàn (commander), F17 Nguyễn Văn Tập (driver), F18 "phần lớn mới ngoài hai mươi tuổi". Real people = silhouettes + name plates only.

/** A tank rolling in slowly from the left (px per frame `v`), ground at y. */
const Roll: React.FC<{ id: string; t: number; x: number; y: number; size: number; kind: 't54' | 'type59'; num: string; v?: number; lamp?: boolean; flag?: boolean }> = ({ id, t, x, y, size, kind, num, v = 1.4, lamp = false, flag = false }) => (
  <TankSide x={x + v * t} y={y} size={size} kind={kind} num={num} searchlight={lamp} flag={flag ? 'PRG' : undefined} t={t} id={id} />
);

export const F14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Back id="f14" />
    <Ground id="f14" y={930} />
    <Drift t={t} len={len} z0={1} z1={1.05} cx={960} cy={700}>
      <Roll id="f14t" t={t} x={420} y={960} size={760} kind="t54" num="843" lamp flag />
    </Drift>
    <Who t={t} at={4} x={1190} y={250} name="BÙI QUANG THẬN" sub="ĐẠI ĐỘI TRƯỞNG · CHỈ HUY XE 843" w={1100} accent="#2F5FB4" />
  </g>
);

const CREW = ['Vũ Đăng Toàn', 'Nguyễn Văn Tập', 'Lê Văn Phượng', 'Ngô Sỹ Nguyên'];
export const F15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Back id="f15" a="#1E3326" b="#0A120D" />
    <Ground id="f15" y={930} />
    <Drift t={t} len={len} z0={1} z1={1.05} cx={960} cy={700}>
      <Roll id="f15t" t={t} x={380} y={960} size={760} kind="type59" num="390" flag />
    </Drift>
    <Slam t={t} a={4} x={1230} y={250} size={190} rot={-3}>4 NGƯỜI</Slam>
    {CREW.map((n, i) => (
      <g key={n}>
        <g opacity={prog(t, 12 + i * 5, 22 + i * 5)}><Sil x={1250 + i * 140} y={930} s={1.3} color="#9FB0C2" helmet /></g>
        <Out x={1000} y={420 + i * 66} size={46} anchor="start" opacity={prog(t, 12 + i * 5, 22 + i * 5)}>{n}</Out>
      </g>
    ))}
  </g>
);

export const F16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Back id="f16" a="#1E3326" b="#0A120D" />
    <Ground id="f16" y={930} />
    <Drift t={t} len={len} z0={1} z1={1.05} cx={960} cy={700}>
      <Roll id="f16t" t={t} x={560} y={960} size={760} kind="type59" num="390" flag />
    </Drift>
    <Who t={t} at={4} x={1190} y={250} name="VŨ ĐĂNG TOÀN" sub="CHÍNH TRỊ VIÊN · CHỈ HUY XE 390" w={1100} accent="#2F7F4F" />
  </g>
);

export const F17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Back id="f17" a="#1E3326" b="#0A120D" />
    <Ground id="f17" y={930} />
    <Drift t={t} len={len} z0={1} z1={1.06} cx={1100} cy={760}>
      <Roll id="f17t" t={t} x={600} y={960} size={760} kind="type59" num="390" flag />
    </Drift>
    <Who t={t} at={4} x={1190} y={250} name="NGUYỄN VĂN TẬP" sub="NGƯỜI LÁI XE 390" w={1100} accent="#2F7F4F" />
  </g>
);

export const F18: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(prog(t, 0, 20));
  return (
    <g>
      <Back id="f18" a="#2A3A55" b="#0A101C" />
      <Ground id="f18" y={900} />
      <Drift t={t} len={len} z0={1} z1={1.06} cx={960} cy={760}>
        <TankSide x={300 + 40 * k} y={930} size={640} kind="type59" num="390" flag="PRG" t={t} id="f18t" />
        {[0, 1, 2, 3].map((i) => <Sil key={i} x={1150 + i * 150} y={940} s={1.45} color="#9FB0C2" helmet t={t} />)}
      </Drift>
      <Out x={960} y={150} size={80} opacity={prog(t, 4, 16)}>PHẦN LỚN MỚI</Out>
      <Out x={960} y={330} size={150} fill="#FFE600" opacity={prog(t, 14, 26)}>NGOÀI 20 TUỔI</Out>
    </g>
  );
};
