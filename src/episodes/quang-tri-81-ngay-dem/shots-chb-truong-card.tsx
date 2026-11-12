import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret, M1Helmet } from '../../countryball/ball-accessories-military';
import { UsafCap } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion, talk } from '../../countryball/ball-motion';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { Warship } from '../../countryball/ground-naval-gunfire';
import { SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { cameraAt } from '../../countryball/geo-camera';
import { easeOut } from '../../countryball/fx-math';
import { Backdrop, Dim, MapHud, NameCard, Pop, proj, QtMap, ramp, sec, Silhouette, Txt, YELLOW } from './chb-common';
import { SourceTag, star } from './chb-table-and-icons';

// Chapter B, beat "4b truong" (B1-B5, 118.2-131.2 s): the general who got the job (name card, no face), what US advisers
// said about him, the strongest units, the huge US fire support.

const PROV = CAMERAS.quangTriProvince;

// ---------- B1: map pulse "who gets the job" then the name card slides in ----------
export const B1: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...PROV }, { t: 3.2, ...PROV, lon: PROV.lon + 0.03, zoom: PROV.zoom * 1.1, ease: 'linear' }], s);
  const [qx, qy] = proj(cam)(107.1859, 16.7539), pulse = (s * 1.3) % 1;
  return (
    <g>
      <QtMap cam={cam} id="b1m" sites={['quangTri', 'dongHa']} />
      <Dim o={0.15 + 0.4 * ramp(s, 1.5, 2.0)} />
      <circle cx={qx} cy={qy} r={16 + pulse * 70} fill="none" stroke="#FF5A5F" strokeWidth={6} opacity={(1 - pulse) * (1 - ramp(s, 1.6, 2.0))} />
      <Txt x={960} y={160} text="AI ĐƯỢC GIAO NHIỆM VỤ?" size={72} o={ramp(s, 0.1, 0.4) * (1 - ramp(s, 1.7, 2.0))} />
      <NameCard x={960} y={600} rank="TRUNG TƯỚNG" name="NGÔ QUANG TRƯỞNG" sub="Tư lệnh Quân đoàn I, VNCH" s={s} at={1.8} />
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B2: US advisers rate him: stars pop over the silhouette ----------
export const B2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b2" />
      <Txt x={960} y={150} text="CỐ VẤN MỸ ĐÁNH GIÁ" size={74} o={ramp(s, 0.05, 0.3)} />
      <Silhouette x={1180} y={940} s={1.9} />
      {[0, 1, 2, 3, 4].map((i) => <Pop key={i} s={s} at={0.5 + i * 0.16} x={800 + i * 120} y={300}>
        <polygon points={star(800 + i * 120, 300, 52)} fill="#FFD166" stroke="#15151A" strokeWidth={6} strokeLinejoin="round" /></Pop>)}
      {[0, 1].map((i) => <g key={i}>
        <Ball id={`b2u${i}`} x={330 + i * 250} y={800 - i * 30} r={112 - i * 14} flag="USA" eyes={i ? 'normal' : 'happy'} hat={<M1Helmet color="#58663C" />}
          motion={mixMotion(breathe(t, 66, 0.03, i * 10), hop(t - i * 10, 52, 16, i * 6))} t={t} />
      </g>)}
      <Txt x={420} y={955} text="CỐ VẤN MỸ" size={42} color="#8EB4E8" o={ramp(s, 0.2, 0.5)} />
    </g>
  );
};

// ---------- B3: one of the best: five silhouettes, one lights up gold ----------
export const B3: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), up = easeOut(ramp(s, 0.7, 1.4));
  return (
    <g>
      <Backdrop s={s} id="b3" />
      {[0, 1, 2, 3, 4].map((i) => {
        const hero = i === 4, k = hero ? up : 0, dim = hero ? '#1B2735' : '#243241';
        return <g key={i} opacity={ramp(s, i * 0.08, i * 0.08 + 0.25)}>
          {hero && <circle cx={1540} cy={640 - k * 20} r={220 * (0.7 + 0.3 * k)} fill="#FFD166" opacity={0.35 * k} />}
          <Silhouette x={300 + i * 330} y={820 - (hero ? k * 40 : 0)} s={hero ? 1.1 + 0.55 * k : 1.0} color={dim} rim={hero ? '#FFD166' : '#4A5D73'} />
        </g>;
      })}
      <Txt x={960} y={150} text="MỘT TRONG NHỮNG TƯỚNG" size={70} o={ramp(s, 0.3, 0.6)} />
      <Txt x={960} y={232} text="GIỎI NHẤT CỦA QUÂN ĐỘI SÀI GÒN" size={58} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <SourceTag x={960} y={980} text="Theo đánh giá của các cố vấn Mỹ" o={ramp(s, 1.2, 1.5)} />
    </g>
  );
};

// ---------- B4: the strongest units under his hand ----------
export const B4: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const row = [{ hat: <Beret color="#B3262B" badge="wings" />, label: 'DÙ' }, { hat: <Beret color="#2F6B3A" badge="anchor" />, label: 'TQLC' }, { hat: <M1Helmet />, label: 'THIẾT GIÁP' }];
  return (
    <g>
      <Backdrop s={s} id="b4" />
      <Txt x={960} y={160} text="NHỮNG ĐƠN VỊ MẠNH NHẤT" size={80} o={ramp(s, 0.05, 0.3)} />
      {row.map((r, i) => <Pop key={i} s={s} at={0.2 + i * 0.22} x={420 + i * 540} y={640}>
        <Ball id={`b4b${i}`} x={420 + i * 540} y={600} r={150} flag="RVN" eyes="determined" hat={r.hat} t={t} motion={mixMotion(breathe(t, 70, 0.03, i * 14), hop(t, 54, 16, i * 8))} />
        <UnitBox x={420 + i * 540} y={850} kind={i === 2 ? 'arm' : i === 1 ? 'mar' : 'inf'} color={YELLOW} label={r.label} size={92} />
      </Pop>)}
    </g>
  );
};

// ---------- B5: huge US fire support: the USA ball behind, B-52 / jets / ship lanes flowing toward the RVN ball ----------
export const B5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), move = (t * 9) % 360;
  const lane = (y: number, kind: 'b52' | 'f4' | 'ship', size: number) => (
    <g>
      <rect x={430} y={y - 62} width={1060} height={124} rx={62} fill={SIDE_COLORS.usa} opacity={0.18} stroke={SIDE_COLORS.usa} strokeWidth={3} strokeDasharray="22 14" strokeDashoffset={-t * 2} />
      {[0, 1, 2].map((k) => {
        const x = 470 + ((move + k * 360) % 1080);
        return kind === 'ship' ? <Warship key={k} x={x} y={y} heading={0} size={size} kind="cruiser" t={t} wake={false} />
          : <AircraftTop key={k} id={`b5${kind}${y}${k}`} kind={kind} x={x} y={y} size={size} heading={0} shadow={false} />;
      })}
    </g>
  );
  return (
    <g>
      <Backdrop s={s} id="b5" />
      <Txt x={960} y={130} text="HỎA LỰC MỸ YỂM TRỢ" size={78} color="#8EB4E8" o={ramp(s, 0.05, 0.3)} />
      <g opacity={ramp(s, 0.3, 0.6)}>{lane(340, 'b52', 120)}{lane(540, 'f4', 84)}{lane(740, 'ship', 190)}</g>
      <Ball id="b5u" x={250} y={560} r={150} flag="USA" eyes="determined" hat={<UsafCap />} t={t} motion={mixMotion(breathe(t), talk(t, s > 0.4))} />
      <Ball id="b5r" x={1670} y={560} r={150} flag="RVN" eyes="determined" hat={<Beret color="#B3262B" badge="wings" />} t={t} motion={breathe(t, 66, 0.03, 9)} />
      <Txt x={1670} y={790} text="SÀI GÒN" size={44} color={YELLOW} o={ramp(s, 0.4, 0.7)} />
      <Txt x={250} y={790} text="HOA KỲ" size={44} color="#8EB4E8" o={ramp(s, 0.4, 0.7)} />
      <Txt x={960} y={980} text="B-52  ·  MÁY BAY CHIẾN THUẬT  ·  PHÁO HẠM" size={40} color="#DCE4EC" o={ramp(s, 0.9, 1.2)} />
    </g>
  );
};
