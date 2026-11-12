import React from 'react';
import { prog } from './fx-math';
import { Label } from './fx-demo-sections-balls';
import { AngkorWat, FriendshipMonument, PhnomPenhSkyline } from './tay-nam-props-monuments';
import { CandleRow, FlowerBouquet, MemorialGate, MemorialStupa } from './tay-nam-props-memorials';
import { PhnomPenhStreet } from './tay-nam-props-street';
import { BorderMarker, MekongFerry, PaddyLandscape } from './tay-nam-props-countryside';
import { FarewellConvoy, RiceSacks, SchoolHouse } from './tay-nam-props-aid-and-farewell';

// TayNamKitDemo sections 3-7 (t = local frame, 1080x1920). Each section has two "pages" (first / second half) so every prop is seen big.
//   monuments: Angkor Wat at dusk + Phnôm Pênh skyline | Friendship Monument
//   memorials: memorial stupa with offerings at dusk | memorial gate + candle row lighting up + flowers
//   street:    the empty city (life 0) -> the city comes back (life 1)
//   country:   paddies + sugar palms + border marker | Mekong ferry crossing
//   farewell:  1989 convoy with flowers, waving crowd | rice sacks + village school
export const PROPS_PAGE_FRAMES = 150;
export const STREET_FRAMES = 180;
const page = (t: number) => (t < PROPS_PAGE_FRAMES / 2 ? 0 : 1);
const Sky: React.FC<{ id: string; a: string; b: string }> = ({ id, a, b }) => (
  <><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs><rect width={1080} height={1920} fill={`url(#${id})`} /></>
);

export const MonumentsSection: React.FC<{ t: number }> = ({ t }) => page(t) === 0 ? (
  <g>
    <Sky id="tnsk1" a="#2E3A6E" b="#F2A65A" />
    <AngkorWat x={540} y={820} w={980} tone="dusk" t={t} />
    <rect y={1600} width={1080} height={320} fill="#8A8270" />
    <PhnomPenhSkyline x={540} y={1560} w={1080} tone="day" t={t} />
    <Label x={60} y={230} text="AngkorWat · PhnomPenhSkyline" size={30} color="#FFE9B0" anchor="start" />
  </g>
) : (
  <g>
    <Sky id="tnsk2" a="#7FB4DA" b="#EDE6D2" />
    <rect y={1480} width={1080} height={440} fill="#9A9278" />
    <FriendshipMonument x={540} y={1480} h={1100} tone="day" />
    <Label x={60} y={230} text="FriendshipMonument (Phnôm Pênh, 1979)" size={30} color="#1D3247" anchor="start" />
  </g>
);

export const MemorialsSection: React.FC<{ t: number }> = ({ t }) => page(t) === 0 ? (
  <g>
    <Sky id="tnsk3" a="#1E2546" b="#B8735A" />
    <rect y={1440} width={1080} height={480} fill="#3E3A3A" />
    <MemorialStupa x={540} y={1440} h={1050} tone="dusk" t={t} />
    <Label x={60} y={230} text="MemorialStupa (ngoại thất, kính đóng) + lễ vật" size={28} color="#FFE9B0" anchor="start" />
  </g>
) : (
  <g>
    <Sky id="tnsk4" a="#0E1A33" b="#3A4A7A" />
    <rect y={1180} width={1080} height={740} fill="#2A2A30" />
    <MemorialGate x={540} y={1180} w={980} tone="night" />
    <CandleRow x={480} y={1400} w={800} n={9} s={90} t={t} lit={prog(t, 80, 130)} />
    <FlowerBouquet x={170} y={1470} s={110} color="white" />
    <FlowerBouquet x={820} y={1470} s={110} color="yellow" />
    <Label x={60} y={230} text="MemorialGate · CandleRow (lit 0..1)" size={30} color="#FFE9B0" anchor="start" />
  </g>
);

export const StreetSection: React.FC<{ t: number }> = ({ t }) => {
  const life = prog(t, 60, 140);
  return (
    <g>
      <PhnomPenhStreet id="tnst" y={1180} life={life} t={t} />
      <Label x={60} y={230} text={`PhnomPenhStreet life=${life.toFixed(2)}`} size={30} color="#1D3247" anchor="start" />
    </g>
  );
};

export const CountrySection: React.FC<{ t: number }> = ({ t }) => page(t) === 0 ? (
  <g>
    <PaddyLandscape id="tnpd" y={720} h={1200} t={t} />
    <BorderMarker x={330} y={1420} s={0.95} num="CM 2xx" />
    <Label x={60} y={230} text="PaddyLandscape · BorderMarker" size={30} color="#1D3247" anchor="start" />
  </g>
) : (
  <g>
    <Sky id="tnsk5" a="#8CC4E8" b="#F2E6C8" />
    <MekongFerry id="tnfr" y={820} progress={prog(t, 80, 145)} t={t} />
    <Label x={60} y={230} text="MekongFerry (Neak Lương) progress 0..1" size={30} color="#1D3247" anchor="start" />
  </g>
);

export const FarewellSection: React.FC<{ t: number }> = ({ t }) => page(t) === 0 ? (
  <g>
    <Sky id="tnsk6" a="#8CC4E8" b="#F4E4C0" />
    <rect y={1000} width={1080} height={920} fill="#8A8270" />
    <rect y={1010} width={1080} height={150} fill="#5E5C5A" />
    <FarewellConvoy id="tncv" y={1120} progress={prog(t, 0, 75) * 0.75 + 0.1} t={t} />
    <Label x={60} y={230} text="FarewellConvoy · TroopTruck (26.9.1989)" size={30} color="#1D3247" anchor="start" />
  </g>
) : (
  <g>
    <Sky id="tnsk7" a="#8CC4E8" b="#F4E4C0" />
    <rect y={1100} width={1080} height={820} fill="#A89A70" />
    <SchoolHouse id="tnsc" x={500} y={1100} w={820} t={t} />
    <RiceSacks x={540} y={1480} n={6} s={1} />
    <Label x={60} y={230} text="SchoolHouse · RiceSacks" size={30} color="#1D3247" anchor="start" />
  </g>
);
