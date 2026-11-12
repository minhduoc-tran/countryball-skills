import React from 'react';
import { GeoMap } from './map-geo-map';
import { TAY_NAM_CAMERAS as C, TAY_NAM_COLORS } from './tay-nam-camera-keys';
import { TayNamLabels, TayNamSites } from './tay-nam-map-labels';
import { TAY_NAM_ATTRIBUTION } from './geo-tay-nam-sites';
import { ClockChip } from './hud-clock-chip';
import { NightChip, LowerThird, SourceLine } from './hud-chips';
import { Counter } from './hud-counter';
import { MiniMap } from './hud-minimap';
import { PhotoCard } from './photo-card';
import { PORTRAIT_SAFE as S, PORTRAIT_SLOTS } from './hud-portrait-safe';

// TayNamKitDemo section 8 (t = local frame, 1080x1920): every HUD piece at its PORTRAIT default position over the Cambodia map, with the TikTok
// overlay zones tinted red (top bar, caption + music bar, button column) so you can see nothing readable falls inside them.
export const HUD_SECTION_FRAMES = 150;

export const HudSection: React.FC<{ t: number }> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <GeoMap camera={C.cambodia} tayNam colors={TAY_NAM_COLORS} provinces id="tnhud"><TayNamLabels /><TayNamSites /></GeoMap>
      <ClockChip date="07.01.1979" clock={[{ t: 0, time: '09:30' }, { t: 4, time: '12:00' }]} t={s} id="tnck" />
      <NightChip label="NGÀY 1/14" t={s} from={0.2} />
      <Counter label="TÙ BINH" value={0} steps={[{ t: 0.5, value: 0 }, { t: 3.5, value: 1200 }]} t={s} />
      <MiniMap camera={C.cambodia} id="tnhm" />
      <PhotoCard id="tnph" src="bien-gioi-tay-nam/img/angkor-wat-phan-chieu-mat-ho.jpg" caption="Ăng-co Vát" credit="Ảnh: Wikimedia Commons (ví dụ)" {...PORTRAIT_SLOTS.photo} y={980} h={420}
        captionSize={PORTRAIT_SLOTS.captionSize} creditSize={PORTRAIT_SLOTS.creditSize} from={0.3} t={s} rot={-2} />
      <LowerThird title="Mặt trận Đoàn kết Dân tộc Cứu nước" sub="Thành lập 2.12.1978 (theo phía Việt Nam)" from={0.6} t={s} />
      <SourceLine text={TAY_NAM_ATTRIBUTION} t={s} />
      <g opacity={0.3}>
        <rect width={1080} height={S.top} fill="#FF2A2A" />
        <rect y={S.bottom} width={1080} height={1920 - S.bottom} fill="#FF2A2A" />
        <rect x={S.right.x0} y={S.right.y0} width={1080 - S.right.x0} height={S.right.y1 - S.right.y0} fill="#FF2A2A" />
      </g>
    </g>
  );
};
