import React from 'react';
import { Camera, project } from './geo-camera';
import { GeoMap } from './map-geo-map';
import { IslandGroup } from './map-labels';
import { GeoProvider } from './map-context';
import { RICE_CAMERA } from './hud-minimap';

// Entry point kept for the first static scene (countryball-rice-export-scene.tsx): the SE-Asia framing of that scene
// on top of the animated, zoomable kit. New scenes should import from the kit files directly:
//   geo-camera (cameraAt, project), map-geo-map (GeoMap), map-labels (City, CITIES, ...), hud-* (DateChip, Counter,
//   MiniMap, NightChip, LowerThird, SourceLine), photo-card (PhotoCard), map-night-overlay (AirRaidPulse).

export { DateChip } from './hud-date-chip';
export { Counter } from './hud-counter';
export { MiniMap, RICE_CAMERA } from './hud-minimap';

/** lon/lat -> px in the original rice-scene framing. */
export const geo = (lon: number, lat: number): [number, number] => project(RICE_CAMERA, lon, lat);

/** The original static look: SE Asia, only the Mekong, no automatic labels (the scene draws its own). */
export const RegionMap: React.FC<{ colors: Record<string, string>; camera?: Camera }> = ({ colors, camera = RICE_CAMERA }) => (
  <GeoMap camera={camera} colors={colors} labels={false} rivers={['Mekong']} id="cbm" />
);

/** Island dots + label in the original framing (HOÀNG SA / TRƯỜNG SA). */
export const Islands: React.FC<{ lon: number; lat: number; label: string; color: string; seed: number }> = (p) => (
  <GeoProvider camera={RICE_CAMERA} night={0} id="cbm"><IslandGroup {...p} /></GeoProvider>
);
