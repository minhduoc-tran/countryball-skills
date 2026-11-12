import { LOOKS, Look } from '../../engine';

// Episode-only characters, shared by every chapter so they look the same everywhere.
// GRANDMA: the old lottery-ticket seller at the mouth of the alley (grey bob, faded purple blouse, conical-hat colour accent).
// VILLAGE_GIRL: the girl from the mountain village who no longer has to skip school to carry water (red-brown top, bunches).
// DOCTOR: a hospital doctor (white coat). WORKER: a street sweeper / coffee picker (orange-green work clothes).
export const GRANDMA: Look = { ...LOOKS.mom, hair: '#BDBAC4', jacket: '#7E6A93', jacketShade: '#665478', accent: '#E8D49A', extra: 'bob' };
export const VILLAGE_GIRL: Look = { ...LOOKS.sis, jacket: '#B5523B', jacketShade: '#94412E', accent: '#F2C14E', hair: '#2A1C18', extra: 'bunches' };
export const DOCTOR: Look = { ...LOOKS.mo, jacket: '#EEF1F4', jacketShade: '#C9D0D8', accent: '#3E8C86', extra: undefined, hair: '#2A1C18' };
export const WORKER: Look = { ...LOOKS.mo, jacket: '#E07A2E', jacketShade: '#B8601F', accent: '#3E8C5A', extra: undefined, hair: '#2A1C18' };
