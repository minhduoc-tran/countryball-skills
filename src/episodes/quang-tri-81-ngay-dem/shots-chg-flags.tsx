import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Camera, cameraAt } from '../../countryball/geo-camera';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { easeOut } from '../../countryball/fx-math';
import { Dim, MapHud, Pop, QtMap, ramp, sec, Txt } from './chg-common';
import { FlagRace } from './chg-flag-race';

// Chapter G, beat "30b flags" (G28-G30, 599.2-609.8 s): "cuộc chiến cắm cờ" before the ceasefire. One continuous map drift over
// three shots; flags pop where the words are ("hai bên vẫn tranh nhau cắm cờ"), patches of held land grow, then the three names.

const CAM_KEYS = [{ t: 0, lon: 107.12, lat: 16.8, zoom: 2300 }, { t: 10.6, lon: 107.1, lat: 16.82, zoom: 3100 }];
/** camera at global flag-race time g (seconds since G28 started) */
const camAt = (g: number): Camera => cameraAt(CAM_KEYS.map((k) => ({ ...k, ease: 'linear' as const })), g);

const Clock: React.FC<{ x: number; y: number; s: number; r?: number }> = ({ x, y, s, r = 70 }) => {
  const a = s * 260, k = easeOut(ramp(s, 0, 0.4));
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={k}>
      <circle r={r} fill="#F6F0E0" stroke="#15151A" strokeWidth={7} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-r + 8} x2={0} y2={-r + (i % 3 ? 16 : 24)} stroke="#15151A" strokeWidth={4} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke="#B3262B" strokeWidth={7} strokeLinecap="round" transform={`rotate(${a})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke="#15151A" strokeWidth={9} strokeLinecap="round" transform={`rotate(${a / 12})`} />
      <circle r={9} fill="#15151A" />
    </g>
  );
};

// ---------- G28: "Ngay trước giờ ngừng bắn, hai bên vẫn tranh nhau cắm cờ trên từng mảnh đất," ----------
export const G28: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = camAt(s);
  return (
    <g>
      <QtMap cam={cam} id="g28m" sites={['quangTri', 'dongHa']} />
      <FlagRace cam={cam} s={s} t={t} first={1.4} />
      <Clock x={210} y={900} s={s} />
      <Pop s={s} at={0.2} x={330} y={900}><text x={330} y={914} fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#FFF" stroke="#0A121C" strokeWidth={8} paintOrder="stroke">TRƯỚC GIỜ NGỪNG BẮN</text></Pop>
      <MapHud s={s} cam={cam} date="1.1973" />
    </g>
  );
};

// ---------- G29: "để khẳng định ai đang giữ vùng nào." ----------
export const G29: React.FC<ShotProps> = ({ t }) => {
  const g = sec(t) + 3.93, s = sec(t), cam = camAt(g);
  return (
    <g>
      <QtMap cam={cam} id="g29m" sites={['quangTri', 'dongHa']} />
      <FlagRace cam={cam} s={s} t={t} off={3.93} first={1.4} />
      <defs><linearGradient id="g29-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050B15" stopOpacity={0.65} /><stop offset="1" stopColor="#050B15" stopOpacity={0} /></linearGradient></defs>
      <rect width={1920} height={300} fill="url(#g29-band)" opacity={ramp(s, 0.1, 0.4)} />
      <Txt x={1000} y={185} text="AI ĐANG GIỮ VÙNG NÀO?" size={96} o={ramp(s, 0.15, 0.5)} />
      <MapHud s={s + 3.93} cam={cam} date="1.1973" />
    </g>
  );
};

// ---------- G30: "Người ta gọi đó là cuộc chiến giành dân, giữ đất, cắm cờ." ----------
export const G30: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), g = s + 6.04, cam = camAt(g), words = [{ w: 'GIÀNH DÂN', at: 1.4 }, { w: 'GIỮ ĐẤT', at: 2.1 }, { w: 'CẮM CỜ', at: 2.75 }];
  return (
    <g>
      <QtMap cam={cam} id="g30m" sites={['quangTri', 'dongHa']} />
      <FlagRace cam={cam} s={s} t={t} off={6.04} first={1.4} />
      <Dim o={0.55 * ramp(s, 0.3, 1.2)} />
      <Txt x={960} y={330} text="NGƯỜI TA GỌI ĐÓ LÀ" size={56} color="#E4D8C0" o={ramp(s, 0.2, 0.6)} />
      {words.map((c, i) => (
        <Pop key={c.w} s={s} at={c.at} x={960} y={470 + i * 150}><Txt x={960} y={500 + i * 150} text={c.w} size={118} color={i === 2 ? '#FFD166' : '#FFFFFF'} /></Pop>
      ))}
      <MapHud s={s + 6.04} cam={cam} date="1.1973" mini={false} />
    </g>
  );
};
