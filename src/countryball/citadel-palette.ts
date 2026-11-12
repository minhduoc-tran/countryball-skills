import { mix, nightTone } from './map-context';

// Colours of CitadelPlan (day values; `tone(c, night)` cools and darkens them like the map does) and the view box type.
export const PAL = {
  ground: '#8E9A5E', paddyA: '#A3A965', paddyB: '#86955A', paddyC: '#B2AE72', town: '#B8A682', burnt: '#4A3B2C', dust: '#C8B68D',
  roadCase: '#7A6A52', roadFill: '#E6DBBB', roadMajor: '#F1E5C2',
  water: '#4B83AD', waterEdge: '#2D5C82', bank: '#D8CC9E', flood: '#8C9C86', floodDeep: '#6F8F8F',
  moat: '#3E7098', moatEdge: '#275073',
  brick: '#A9543B', brickDark: '#7F3B2A', rampart: '#9A7B4E', rampartTop: '#BC9965', rubble: '#6B5A48', rubbleLight: '#8E7B63',
  roofs: ['#B5573D', '#C9783F', '#8E9095', '#D5C6A4'],
  tree: ['#5B7A3C', '#4C6B34', '#6C8745'], treeDark: '#2F4624',
  crater: '#4A3A2A', craterRim: '#B6A07A',
};
/** Day colour -> night colour (deeper than the map's: the plan has no separate night overlay, so lights and glows stay bright). */
export const tone = (c: string, night: number) => (night <= 0 ? c : mix(nightTone(c, night), '#03060E', 0.3 * night));
export { mix };

/** Visible rectangle in local metres [x0, y0, x1, y1]. */
export type View = [number, number, number, number];
export const inView = (v: View, x: number, y: number, pad = 0) => x > v[0] - pad && x < v[2] + pad && y > v[1] - pad && y < v[3] + pad;
