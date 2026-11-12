import React from 'react';
import { prog } from './fx-math';
import { SaigonBridgeSide } from './saigon-bridge-side';
import { RooftopEvacuation } from './rooftop-evacuation';
import { CarrierDeck } from './carrier-deck';
import { Label } from './fx-demo-sections-balls';
import { ClockChip } from './hud-clock-chip';

// SaigonKitDemo sections 6-8 (t = local frame): cầu Sài Gòn with a tank column; rooftop evacuation (Huey lands, the queue boards); carrier deck
// (a Huey lands, another is pushed over the side).
export const BRIDGE_FRAMES = 150, EVAC_FRAMES = 150, CARRIER_FRAMES = 150;
export const BridgeSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <SaigonBridgeSide id="br" progress={prog(t, 0, 140)} t={t} smoke={prog(t, 30, 100)} />
    <Label x={60} y={170} text="SaigonBridgeSide · progress 0..1, smoke 0..1: cầu Sài Gòn, cột xe tăng" size={26} color="#14202C" anchor="start" />
    <ClockChip date="30.04.1975" clock={[{ t: 0, time: '10:00' }, { t: 5, time: '10:25' }]} t={t / 30} id="ck6" />
  </g>
);
export const RooftopSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <RooftopEvacuation id="ro" land={prog(t, 0, 50)} queue={prog(t, 55, 145)} t={t} tone="dusk" />
    <Label x={60} y={170} text={`RooftopEvacuation · land ${prog(t, 0, 50).toFixed(2)} · queue ${prog(t, 55, 145).toFixed(2)}`} size={26} color="#14202C" anchor="start" />
  </g>
);
export const CarrierSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <CarrierDeck id="cd" land={prog(t, 0, 55)} push={prog(t, 50, 140)} t={t} />
    <Label x={60} y={170} text={`CarrierDeck · land ${prog(t, 0, 55).toFixed(2)} · push ${prog(t, 50, 140).toFixed(2)}`} size={26} color="#14202C" anchor="start" />
  </g>
);
