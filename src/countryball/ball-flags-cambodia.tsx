import React from 'react';
import { ANGKOR_DK_PATH, ANGKOR_PRK_PATH, angkorPath } from './angkor-silhouette';

// Cambodian flags of 1975-today (+ Thailand's tricolour is FLAGS.THA in ball-flags.tsx), for balls (unit box -1..1, merged into FLAGS) and
// for pole flags (FlagCloth / MapFlag kinds, box [0,w] x [0,h]). Checked against Wikimedia Commons 2026-11-12:
//   DK   Kampuchea Dân chủ (Democratic Kampuchea, Khmer Rouge regime) 1975-79: red, yellow 3-tower Angkor (no outline)
//   PRK  Cộng hòa Nhân dân Campuchia (People's Republic of Kampuchea) 1979-89: red, yellow 5-tower blocky Angkor
//   SOC  Nhà nước Campuchia (State of Cambodia) 1989-93: red over blue, yellow 5-tower Angkor
//   KHM  Vương quốc Campuchia today: blue-red-blue, white Angkor (the existing FLAGS.KHM ball; pole flag here)
// Emblems sit a little below the centre on balls so the eyes don't hide the towers. Safety rule: DK only small (ball / map flag), never hero.

export const KHM_FLAG_COLORS = { red: '#DA121A', yellow: '#FCDD09', socRed: '#E00025', socBlue: '#032EA1', khmBlue: '#032EA1', khmRed: '#E00025' } as const;
const C = KHM_FLAG_COLORS;
const band = (y0: number, y1: number, fill: string) => <rect x={-1.2} y={y0} width={2.4} height={y1 - y0} fill={fill} />;
/** Commons emblem (900x600 flag box) placed on the ball: scale 2.4/900, centred, pushed down `dy`. */
const commons = (d: string, dy: number, fill: string, k = 1) => <path d={d} fill={fill} transform={`translate(0,${dy}) scale(${(2.4 / 900) * k}) translate(-450,-300)`} />;

export type CambodiaFlagKey = 'DK' | 'PRK' | 'SOC';
export const CAMBODIA_BALL_FLAGS: Record<CambodiaFlagKey, () => React.ReactNode> = {
  DK: () => (<>{band(-1.2, 1.2, C.red)}{commons(ANGKOR_DK_PATH, 0.36, C.yellow)}</>),
  PRK: () => (<>{band(-1.2, 1.2, C.red)}{commons(ANGKOR_PRK_PATH, 0.34, C.yellow, 0.8)}</>),
  SOC: () => (<>{band(-1.2, 0.05, C.socRed)}{band(0.05, 1.2, C.socBlue)}<path d={angkorPath(1.0)} transform="translate(0,0.5)" fill={C.yellow} /></>),
};

export type CambodiaPoleFlag = 'DK' | 'PRK' | 'SOC' | 'KHM' | 'THA';
/** Pole-flag art in [0,w] x [0,h] (2:3 flags: h = 2/3 w). */
export const cambodiaFlagFace = (kind: CambodiaPoleFlag, w: number, h: number): React.ReactNode => {
  const em = (d: string, fill: string) => <path d={d} fill={fill} transform={`scale(${w / 900},${h / 600})`} />;
  switch (kind) {
    case 'DK': return <><rect width={w} height={h} fill={C.red} />{em(ANGKOR_DK_PATH, C.yellow)}</>;
    case 'PRK': return <><rect width={w} height={h} fill={C.red} />{em(ANGKOR_PRK_PATH, C.yellow)}</>;
    case 'SOC': return <><rect width={w} height={h / 2 + 0.5} fill={C.socRed} /><rect y={h / 2} width={w} height={h / 2} fill={C.socBlue} /><path d={angkorPath(w * 0.4)} transform={`translate(${w / 2},${h * 0.7})`} fill={C.yellow} /></>;
    case 'KHM': return <><rect width={w} height={h} fill={C.khmBlue} /><rect y={h / 4} width={w} height={h / 2} fill={C.khmRed} /><path d={angkorPath(w * 0.4)} transform={`translate(${w / 2},${h * 0.7})`} fill="#FFFFFF" stroke="#1B1B1B" strokeWidth={Math.max(0.6, w * 0.004)} /></>;
    default: return <><rect width={w} height={h} fill="#A51931" /><rect y={h / 6} width={w} height={(h * 2) / 3} fill="#F4F5F8" /><rect y={h / 3} width={w} height={h / 3} fill="#2D2A4A" /></>;
  }
};
