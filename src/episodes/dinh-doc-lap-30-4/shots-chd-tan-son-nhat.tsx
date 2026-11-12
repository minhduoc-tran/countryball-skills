import React from 'react';
import { ShotProps } from '../../engine';
import { Camera } from '../../countryball/geo-camera';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { SaigonSites } from '../../countryball/sai-gon-map-labels';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { Glow } from '../../countryball/fx-glow';
import { lerp } from '../../countryball/fx-math';
import { Cap, INK, MapScene, Photo, Stage, Tag, drift, easeOut, prog } from './chd-common';
import { A37Side, A37Top } from './chd-icons';
import { Runways, onRunway, runwayHeading } from './chd-runway';

// Chapter D, part 2 (4:06-4:22, beat "6b a37" + "6c rockets" start): D5 A-37s over the city, D6 bombs on the Tân Sơn Nhất runway, D7 "Phi đội
// Quyết Thắng" (captured aircraft get the red star), D8 dawn 29.04: shelling, D9 the big transport planes can not take off (photos).
// Casualties are never shown: runway, smoke and aircraft only.

const TSN: Camera = { lon: 106.665, lat: 10.813, zoom: 17000 }, TSN2: Camera = { ...TSN, zoom: 21000 };

/** D5 "Ngay sau lễ nhậm chức, một tốp máy bay A ba mươi bảy xuất hiện trên bầu trời" three A-37 over the skyline at dusk. */
export const D5: React.FC<ShotProps> = ({ t }) => {
  const build = [[0, 150, 70], [150, 100, 120], [250, 190, 90], [340, 120, 150], [470, 170, 80], [560, 110, 130], [680, 200, 100], [800, 140, 160], [910, 180, 90], [1040, 120, 120], [1150, 210, 80], [1260, 130, 150], [1380, 170, 100], [1500, 110, 130], [1600, 190, 90], [1720, 130, 120], [1820, 160, 100]];
  const planes = [{ dx: 0, dy: 0, s: 560, d: 0 }, { dx: -330, dy: 120, s: 440, d: 8 }, { dx: -560, dy: -60, s: 380, d: 14 }];
  return (
    <g>
      <Stage id="d5" tone="dusk" />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={(300 + i * 700 - t * (0.6 + i * 0.3)) % 2200} cy={180 + i * 90} rx={230} ry={36} fill="#FFFFFF" opacity={0.12} />)}
      <g>
        {build.map(([x, w, h], i) => <rect key={i} x={x - 10} y={1010 - h * 1.5} width={w} height={h * 1.5 + 80} fill="#1A1626" opacity={0.92} />)}
        <rect y={1010} width={1920} height={80} fill="#120E1C" />
      </g>
      {planes.map((p, i) => {
        const u = easeOut(prog(t - p.d, 0, 112)), x = lerp(-380 + p.dx, 1280 + p.dx, u) + t * 1.2, y = 360 + p.dy - u * 30 + Math.sin(t / 14 + i) * 5;
        return <A37Side key={i} x={x} y={y} size={p.s} mark="rvn" />;
      })}
      <Tag t={t} at={52} x={960} y={900} text="TỐP MÁY BAY A-37" fill="#B5573B" size={52} sub="28.04.1975" />
    </g>
  );
};

/** D6 "ném bom sân bay Tân Sơn Nhất." top view: three jets run along the strip, small bursts walk along the runway. */
export const D6: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="d6" keys={drift(TSN, TSN2, 1.7)} date="28.04.1975" night={0.1} map={<SaigonSites only={[]} />}
    over={(cam) => {
      const h = runwayHeading(cam);
      return (
        <g>
          <Runways cam={cam} />
          {[0, 1, 2].map((j) => {
            const u = prog(t, 2 + j * 5, 40 + j * 5), [x, y] = onRunway(cam, 0, lerp(-0.4, 1.4, u));
            return u > 0 && u < 1 ? <A37Top key={j} x={x} y={y - 22 * j + 14} size={120} heading={h} /> : null;
          })}
          {[0.25, 0.4, 0.55, 0.68, 0.82].map((u, i) => { const [x, y] = onRunway(cam, 0, u); return <GroundBlast key={i} t={t} t0={8 + i * 6} x={x} y={y} r={22} linger={50} />; })}
          <Tag t={t} at={4} x={960} y={930} text="SÂN BAY TÂN SƠN NHẤT" fill="#B5573B" size={46} />
        </g>
      );
    }} />
);

/** D7 "Đó là phi đội Quyết Thắng, bay trên chính những chiếc máy bay vừa thu được của đối phương." the jets change their markings. */
export const D7: React.FC<ShotProps> = ({ t }) => {
  const flip = t >= 66, fl = prog(t, 66, 82);
  const bx = 380 + t * 7.2;
  return (
    <g>
      <Stage id="d7" tone="navy" />
      <g transform="rotate(-6 960 540)"><rect x={-200} y={380} width={2400} height={170} fill="#B03029" opacity={0.28} /></g>
      {[[0, 0], [-240, -140], [-240, 140]].map(([dx, dy], i) => <A37Top key={i} x={bx + dx} y={600 + dy + Math.sin(t / 15 + i) * 4} size={300} mark={flip ? 'star' : 'rvn'} />)}
      {flip && <circle cx={bx} cy={600} r={60 + 380 * fl} fill="none" stroke="#FFE08A" strokeWidth={10} opacity={1 - fl} />}
      <Cap t={t} at={16} x={960} y={230} text="PHI ĐỘI QUYẾT THẮNG" size={112} color="#FFE08A" />
      <Tag t={t} at={66} x={960} y={930} text="MÁY BAY VỪA THU ĐƯỢC CỦA ĐỐI PHƯƠNG" fill="#C9343A" size={40} />
    </g>
  );
};

/** D8 "Rạng sáng hôm sau, sân bay tiếp tục bị pháo kích." the date rolls to 29.04, dawn light, shells land on the airfield (no people shown). */
export const D8: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="d8" keys={drift(TSN2, { ...TSN2, lon: 106.662, zoom: 25000 }, 3.3)} night={0.55 - 0.45 * prog(t, 0, 90)} map={<SaigonSites only={[]} />}
    dates={[{ t: 0, label: '28.04.1975' }, { t: 0.3, label: '29.04.1975' }]}
    over={(cam) => {
      const [x, y] = onRunway(cam, 0, 0.5);
      return (
        <g>
          <Runways cam={cam} />
          <Glow x={1560} y={120} r={420} color="#FFB36B" o={0.55 * prog(t, 0, 80)} />
          <ShellBarrage id="d8s" t={t} t0={8} from={[-160, -120]} to={[x, y]} n={9} span={62} spread={[260, 90]} dur={36} lift={190} r={26} linger={70} />
          <Tag t={t} at={4} x={960} y={930} text="RẠNG SÁNG 29.04 · TÂN SƠN NHẤT" fill="#B5573B" size={48} />
        </g>
      );
    }} />
);

/** D9 "Máy bay vận tải lớn không thể cất cánh được nữa." two prints of the airfield on 29.04. */
export const D9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d9" tone="navy" />
    <Photo k="airfield" t={t} id="d9a" x={520} y={500} w={560} rot={-3} from={0.05} kb={{ z0: 1.02, z1: 1.12, px0: 0.01, py0: 0, px1: -0.015, py1: 0 }} />
    <Photo k="c130" t={t} id="d9b" x={1330} y={500} w={680} rot={2} from={0.7} fromSide="right" kb={{ z0: 1.0, z1: 1.1, px0: -0.01, py0: 0.01, px1: 0.015, py1: 0 }} />
    <Cap t={t} at={30} x={960} y={960} text="MÁY BAY VẬN TẢI LỚN KHÔNG CẤT CÁNH ĐƯỢC" size={50} color="#FFE08A" />
  </g>
);
