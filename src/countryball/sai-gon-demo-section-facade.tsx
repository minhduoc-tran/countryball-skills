import React from 'react';
import { clamp, prog } from './fx-math';
import { PalaceFacade } from './palace-facade';
import { Label } from './fx-demo-sections-balls';
import { ClockChip } from './hud-clock-chip';

// SaigonKitDemo section 5 (t = local frame): PalaceFacade. A tiny figure climbs to the roof (climb), then the NLF flag is raised with a wind
// ripple (flagRaise). Last third: the same facade in the three tones, side by side (clipped panels).
export const FACADE_FRAMES = 270;
const PANELS: { tone: 'day' | 'dusk' | 'night'; flag: 'RVN' | 'PRG' | 'none'; x: number }[] = [{ tone: 'day', flag: 'RVN', x: 0 }, { tone: 'dusk', flag: 'PRG', x: 640 }, { tone: 'night', flag: 'none', x: 1280 }];

export const FacadeSection: React.FC<{ t: number }> = ({ t }) => {
  if (t >= 180) {
    return (
      <g>
        {PANELS.map((p, i) => (
          <g key={p.tone}>
            <clipPath id={`fp${i}`}><rect x={p.x} y={0} width={640} height={1080} /></clipPath>
            <g clipPath={`url(#fp${i})`}><PalaceFacade id={`fpf${i}`} x={p.x + 320} y={930} w={620} tone={p.tone} flag={p.flag} t={t} windows={0.7} /></g>
            <rect x={p.x} y={0} width={640} height={1080} fill="none" stroke="#0E1D2E" strokeWidth={6} />
          </g>
        ))}
        <Label x={320} y={1040} text="ngày · cờ VNCH" size={24} color="#14202C" /><Label x={960} y={1040} text="hoàng hôn · cờ MTDTGP" size={24} color="#14202C" /><Label x={1600} y={1040} text="đêm · đèn" size={24} color="#E9E4D3" />
      </g>
    );
  }
  const climb = prog(t, 0, 110), raise = prog(t, 100, 175);
  return (
    <g>
      <PalaceFacade id="pf" x={960} y={960} w={1760} tone="day" flag={climb >= 1 ? 'PRG' : 'none'} flagRaise={raise} climb={climb} t={t} />
      <Label x={60} y={170} text={`PalaceFacade · climb ${climb.toFixed(2)} · flagRaise ${clamp(raise).toFixed(2)}`} size={26} color="#14202C" anchor="start" />
      <ClockChip date="30.04.1975" clock={[{ t: 0, time: '11:30' }, { t: 6, time: '11:36' }]} t={t / 30} id="ck5" />
    </g>
  );
};
