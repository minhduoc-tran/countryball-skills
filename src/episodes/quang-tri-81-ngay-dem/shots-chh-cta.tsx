import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Boat, Bubble } from './chh-icons';
import { Lamp, LanternField, RiverScene } from './chh-river-night';
import { SoftT, easeOut, prog } from './chh-text-and-plan';

// Chapter H part 7 (11:37-end): call to action, then a calm last frame: the river, lanterns, a small boat far away, and the title
// "81 NGÀY ĐÊM" small, fading out with the episode (this last shot runs to the end of the episode).

const Calm: React.FC<{ id: string; t: number; seed: number; veil?: number; boatX?: number }> = ({ id, t, seed, veil = 0, boatX }) => (
  <g>
    <RiverScene id={id} t={t} tone={1} H={520} pan={t * 0.2} bridges lit={1} moonX={1400}>
      <LanternField id={id} t={t} n={120} H={520} t0={-60} span={1} speed={0.2} seed={seed} />
      {boatX !== undefined && <Boat x={boatX + t * 1.2} y={700} s={0.5} t={t} />}
    </RiverScene>
    {veil > 0 && <rect width={1920} height={1080} fill="#050B15" opacity={veil} />}
  </g>
);

/** H32 "Bạn đã từng đến Thành cổ Quảng Trị, hay thả một ngọn hoa đăng trên sông Thạch Hãn chưa?" */
export const H32: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 2, 16));
  return (
    <g>
      <Calm id="h32" t={t} seed={51} veil={0.3} />
      <g transform={`translate(960,${520 + (1 - k) * 40})`} opacity={k}>
        <rect x={-800} y={-190} width={1600} height={400} rx={36} fill="#050B15" opacity={0.62} />
        <rect x={-800} y={-190} width={1600} height={400} rx={36} fill="none" stroke="#E2B95A" strokeWidth={5} />
      </g>
      <SoftT t={t} x={960} y={470} text="Bạn đã từng đến Thành cổ Quảng Trị," size={78} at={4} color="#FFFFFF" />
      <SoftT t={t} x={960} y={575} text="hay thả một ngọn hoa đăng chưa?" size={78} at={50} color="#FFD27A" />
      <Lamp x={960} y={730} s={46} t={t} ph={3} c={0} o={easeOut(prog(t, 50, 64))} glow={1.4} />
    </g>
  );
};

/** H33 "Kể cho mình nghe ở phần bình luận nhé." then the calm last frame with the small fading title. */
export const H33: React.FC<ShotProps> = ({ t, len }) => {
  const talk = easeOut(prog(t, 2, 16)) * (1 - prog(t, 64, 82)), title = easeOut(prog(t, 86, 116)) * (1 - prog(t, len - 50, len - 4));
  const dim = 0.5 * prog(t, len - 40, len);
  return (
    <g>
      <Calm id="h33" t={t} seed={53} boatX={250} veil={0.1} />
      <g opacity={talk}><Bubble x={960} y={330} s={1.5} t={t} /></g>
      <SoftT t={t} x={960} y={600} text="Kể cho mình nghe ở phần bình luận nhé" size={66} at={6} out={[64, 82]} font="hand" weight={700} color="#FFE9B8" />
      <g opacity={title}>
        <text x={960} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#FFE9B8" stroke="#050B15" strokeWidth={12} paintOrder="stroke" strokeLinejoin="round" letterSpacing={14}
          style={{ filter: 'drop-shadow(0 0 18px rgba(255,180,80,0.5))' }}>81 NGÀY ĐÊM</text>
        <text x={960} y={385} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill="#B9C6D6" letterSpacing={8}>THÀNH CỔ QUẢNG TRỊ</text>
      </g>
      <rect width={1920} height={1080} fill="#02050A" opacity={dim} />
    </g>
  );
};
