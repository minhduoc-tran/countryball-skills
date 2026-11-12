import React from 'react';
import { ShotProps } from '../../engine';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { FlagCloth, FlagKind } from '../../countryball/flag-cloth';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift, Plate, Slam, Veil } from './cha-common';
import { CardBg, FourTable } from './cha-bits';

// Chapter A, the four parties (39.5-52.6 s): A16 "gần năm năm đàm phán" (empty chairs + gauge), A17-A19 the four sit down in the narrated order
// (VNDCCH, CPCMLT CHMNVN, Mỹ, VNCH), A20 "trên giấy tờ, hòa bình đã được ký" (document + the four flags).

const Paris: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <CardBg id={id} a="#26344F" b="#0B111D" />
    <Tag x={960} y={150} text="BÀN ĐÀM PHÁN · PARIS" size={36} />
  </g>
);

export const A16: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(prog(t, 14, 110));
  return (
    <g>
      <Paris id="a16" />
      <Drift t={t} len={len} z0={1} z1={1.04} cy={560}>
        <FourTable id="a16" t={t} at={[null, null, null, null]} y={640} r={104} />
      </Drift>
      <Slam t={t} a={4} x={960} y={330} size={190}>GẦN 5 NĂM</Slam>
      <rect x={520} y={400} width={880} height={26} rx={13} fill="#1B2433" stroke="#E2B95A" strokeWidth={5} />
      <rect x={520} y={400} width={880 * k} height={26} rx={13} fill="#E2B95A" />
      <Out x={960} y={960} size={72} opacity={prog(t, 36, 48)}>ĐÀM PHÁN CĂNG THẲNG</Out>
    </g>
  );
};

const Seated: React.FC<{ t: number; len: number; id: string; at: (number | null)[]; z0?: number; z1?: number; cx?: number }> = ({ t, len, id, at, z0 = 1, z1 = 1.05, cx = 960 }) => (
  <g>
    <Paris id={id} />
    <Drift t={t} len={len} z0={z0} z1={z1} cx={cx} cy={600}><FourTable id={id} t={t} at={at} y={600} /></Drift>
    <Veil id={id} o={0.3} />
  </g>
);

export const A17: React.FC<ShotProps> = ({ t, len }) => <Seated t={t} len={len} id="a17" at={[6, null, null, null]} z0={1.08} z1={1.2} cx={330} />;
export const A18: React.FC<ShotProps> = ({ t, len }) => <Seated t={t} len={len} id="a18" at={[-1, 6, null, null]} z0={1.08} z1={1.2} cx={745} />;
export const A19: React.FC<ShotProps> = ({ t, len }) => <Seated t={t} len={len} id="a19" at={[-1, -1, 6, 33]} z0={1.0} z1={1.1} cx={1400} />;

export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const kinds: FlagKind[] = ['VNM', 'PRG', 'USA', 'RVN'];
  return (
    <g>
      <CardBg id="a20" />
      <Drift t={t} len={len} z0={1} z1={1.05} cy={540}>
        {kinds.map((k, i) => {
          const u = prog(t, 4 + i * 5, 14 + i * 5);
          return <FlagCloth key={k} id={`a20f${i}`} x={420 + i * 290} y={150 - (1 - u) * 90} w={240} h={160} kind={k} wave={0.8} t={t} />;
        })}
        <g transform="translate(960,560) rotate(-3)">
          <DocumentProp x={0} y={0} s={3.2} title="HIỆP ĐỊNH" />
          <g opacity={prog(t, 20, 30)} transform="translate(-30,40)">
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-70 + i * 40},${20} q10,-24 18,0 t18,-6`} fill="none" stroke="#1F3E8A" strokeWidth={5} strokeLinecap="round" />)}
          </g>
        </g>
      </Drift>
      <Plate t={t} a={26} x={960} y={900} w={1260} lines={[{ text: 'TRÊN GIẤY TỜ: HÒA BÌNH ĐÃ ĐƯỢC KÝ', size: 62 }]} />
    </g>
  );
};
