import React from 'react';
import { ShotProps } from '../../engine';
import { cameraAt, Camera } from '../../countryball/geo-camera';
import { DirectionKey } from '../../countryball/sai-gon-campaign-arrows';
import { sec } from './chc-common';
import { CampaignMap, DirBanner, focusOn, pushCam, targetOf } from './chc-campaign-map';

// Chapter C, beat "5b directions" (C17-C22, 207.98-226.65 s): the five arrows grow in the narrated order, each starting at the word "hướng"; the camera
// starts wide on the arrow, then pushes in on the target when its name is said, the target lights (gold ring + name pill) and the banner shows the line.
// State is a function of ABSOLUTE voice seconds (chc-campaign-map.tsx), so earlier arrows / targets stay on screen in every later shot.

interface DirShotDef { dir: DirectionKey; start: number; push: [number, number]; end: number; focus: string; zoom: number; lines: { text: string; at: number }[] }
const line = (key: string) => ({ text: `Mục tiêu: ${targetOf(key).name}`, at: targetOf(key).lit });
const DEFS: Record<string, DirShotDef> = {
  C17: { dir: 'bac', start: 207.98, push: [209.1, 210.0], end: 211.21, focus: 'bttm', zoom: 4200, lines: [line('bttm')] },
  C18: { dir: 'tayBac', start: 211.21, push: [212.3, 213.2], end: 214.57, focus: 'tsn', zoom: 4200, lines: [line('tsn')] },
  C19: { dir: 'dong', start: 214.57, push: [215.6, 216.5], end: 217.6, focus: 'bqp', zoom: 6500, lines: [line('bqp')] },
  C20: { dir: 'dongNam', start: 217.6, push: [219.0, 220.2], end: 221.26, focus: 'dinh', zoom: 6500, lines: [line('dinh')] },
};

const DirShot: React.FC<{ id: string; t: number }> = ({ id, t }) => {
  const d = DEFS[id], a = d.start + sec(t), [lon, lat] = focusOn(d.focus);
  return (
    <g>
      <CampaignMap id={`${id.toLowerCase()}m`} cam={pushCam(a, d.start, d.push[0], d.push[1], d.end, lon, lat, d.zoom)} s={a} pins={{ at: -1, step: 0 }} />
      <DirBanner dir={d.dir} s={a} lines={d.lines} />
    </g>
  );
};
export const C17: React.FC<ShotProps> = ({ t }) => <DirShot id="C17" t={t} />;
export const C18: React.FC<ShotProps> = ({ t }) => <DirShot id="C18" t={t} />;
export const C19: React.FC<ShotProps> = ({ t }) => <DirShot id="C19" t={t} />;
export const C20: React.FC<ShotProps> = ({ t }) => <DirShot id="C20" t={t} />;

// ---------- C21 / C22: Đoàn 232 from the south-west; the camera ends between its two targets ----------
const MID = { lon: (focusOn('biet')[0] + focusOn('tongnha')[0]) / 2, lat: (focusOn('biet')[1] + focusOn('tongnha')[1]) / 2, zoom: 8000 };
const camC22 = (a: number): Camera => cameraAt([{ t: 224.1, ...MID }, { t: 226.65, lon: MID.lon + 0.0006, lat: MID.lat - 0.0004, zoom: MID.zoom * 1.06, ease: 'linear' }], a);

export const C21: React.FC<ShotProps> = ({ t }) => {
  const a = 221.26 + sec(t);
  return (
    <g>
      <CampaignMap id="c21m" cam={pushCam(a, 221.26, 222.7, 224.1, 224.2, MID.lon, MID.lat, MID.zoom)} s={a} pins={{ at: -1, step: 0 }} />
      <DirBanner dir="tayNam" s={a} />
    </g>
  );
};
export const C22: React.FC<ShotProps> = ({ t }) => {
  const a = 224.1 + sec(t);
  return (
    <g>
      <CampaignMap id="c22m" cam={camC22(a)} s={a} pins={{ at: -1, step: 0 }} />
      <DirBanner dir="tayNam" s={a} lines={[{ text: `Mục tiêu: ${targetOf('biet').name}`, at: targetOf('biet').lit }, { text: `và ${targetOf('tongnha').name}`, at: targetOf('tongnha').lit }]} />
    </g>
  );
};
