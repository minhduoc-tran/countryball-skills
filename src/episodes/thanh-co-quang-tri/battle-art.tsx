import React from 'react';
import { DuskSky, NightSky, Sun, rnd } from '../../engine';
import { Ball, NonLa } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';

const wall = 'M205 789V529H281V491H364V524H432V478H518V514H578V478H636V408H706V374H751V292H1162V357H1218V414H1292V495H1365V452H1460V496H1538V468H1599V527H1713V789Z';

export const Citadel: React.FC<{ ruined: boolean }> = ({ ruined }) => (
  <g>
    <defs>
      <pattern id="qtBricks" width="99" height="51" patternUnits="userSpaceOnUse">
        <rect width="99" height="51" fill="#754b42" />
        <path d="M0 0H99M0 26H99M49 0V26M0 26V51" stroke="#3e2d32" strokeWidth="4" opacity=".54" />
      </pattern>
      <linearGradient id="qtWallShade" x1="0" x2="0" y1="0" y2="1">
        <stop stopColor="#f2b07c" stopOpacity=".25" />
        <stop offset="1" stopColor="#221a27" stopOpacity=".8" />
      </linearGradient>
    </defs>
    <path d={wall} fill="url(#qtBricks)" stroke="#241d26" strokeWidth={11} strokeLinejoin="round" />
    <path d={wall} fill="url(#qtWallShade)" />
    <path d="M834 796V652a124 124 0 0 1 248 0v144Z" fill="#251e29" stroke="#906258" strokeWidth={13} />
    <path d="M715 406H1190M757 293H1159" stroke="#e3a179" opacity={0.36} strokeWidth={7} />
    {ruined && (
      <g fill="#2d2630">
        <path d="M751 287h194l-40 51-55 12-41 55-31-16-50 26Z" />
        <path d="m1322 496 40-45 106 1-27 57-51 15-20 47-30-11-29 27Z" />
        <path d="m375 792 64-68 55-18 28-62 32 18 48-40 62 170Z" />
      </g>
    )}
  </g>
);

export const Battlefield: React.FC<{ t: number; p: number; stage: string; angle: number }> = ({ t, p, stage, angle }) => {
  const calm = stage === 'memorial' || stage === 'intact';
  const offense = stage === 'advance' || stage === 'breach' || stage === 'airborne';
  const x = angle === 2 ? 1275 : angle === 1 ? 640 : 775;
  const zoom = (angle === 0 ? 1 : angle === 1 ? 1.28 : 1.57) + p * 0.09;
  return (
    <g>
      <DuskSky id="qtField" horizonY={730} red={calm ? 0 : 0.27} />
      <Sun x={1460} y={360} r={105} rays={false} t={t} />
      <g transform={`translate(960 560) scale(${zoom}) translate(${-(angle === 0 ? 960 : x)} -560)`}>
        <path d="M-700 741 50 572 502 632 930 552 1330 596 1800 473 2600 675V1600H-700Z" fill="#624551" opacity={.69} />
        {!calm && Array.from({length: 12}, (_, i) => (
          <ellipse key={i} cx={280 + i * 127 + 55 * Math.sin(t * .014 + i)}
            cy={325 + (i % 4) * 46 - (t + i * 13) % 88}
            rx={145 + (i % 4) * 33} ry={28 + (i % 5) * 13} fill={i % 3 ? '#48404a' : '#845c55'} opacity={.29} />
        ))}
        <Citadel ruined={!calm} />
        <path d="M-700 762Q400 733 950 788T2600 760V1600H-700Z" fill={calm ? '#40483d' : '#322a31'} />
        <path d="M818 777H1080L1367 1200H552Z" fill={calm ? '#666555' : '#554141'} opacity=".7" />
        {!calm && Array.from({length: 42}, (_, i) => {
          const xx = 12 + rnd(282, i) * 1888;
          const y = 764 + rnd(941, i) * 320;
          const s = 7 + rnd(84, i) * 32;
          return <path key={i} d={`M${xx} ${y}l${s} ${-s / 2} ${s * .9} ${s * .38} -${s * .27} ${s * .36}Z`} fill={i % 2 ? '#62484a' : '#211e2b'} />;
        })}
        {calm && stage === 'memorial' ? (
          <g filter="url(#rimR)">
            <Ball id="qtVisitor" x={x + 57} y={725} r={113} flag="VNM" look={.6} hat={<NonLa />} motion={breathe(t)} shadow={false} />
          </g>
        ) : !calm && (
          <>
            <ellipse cx={x + (offense ? -125 * p : 0)} cy={833} rx={112} ry={20} fill="#15151d" opacity={.75} />
            <g filter="url(#rimR)">
              <Ball id="qtFront" x={x + (offense ? -125 * p : 0)} y={699} r={angle === 0 ? 130 : 135} flag={offense ? 'RVN' : 'VNM'} eyes={offense ? 'determined' : 'worried'} look={angle === 2 ? -.65 : .65}
                hat={offense ? undefined : <MuCoi />} motion={breathe(t, 75, .013)} shadow={false} />
            </g>
            {angle === 0 && <Ball id="qtSecond" x={1180 - 65 * p} y={690} r={93} flag={offense ? 'RVN' : 'VNM'} eyes="determined" look={-.4} motion={breathe(t, 65, .02)} />}
            <path d="M-50 873 95 832 165 849 246 814 329 818 377 868 476 850 528 904 640 914 707 1000 208 1174H-50Z" fill="#201c29" />
          </>
        )}
      </g>
    </g>
  );
};

export const Riverbank: React.FC<{ t: number; p: number; stage: string; angle: number }> = ({ t, p, stage, angle }) => {
  const memorial = stage === 'memorial';
  const rain = stage === 'rain';
  const returning = stage === 'withdraw' || stage === 'evacuate';
  const journey = angle === 2 ? 385 : 630;
  const x = 960 + (returning ? 0.5 - p : p - 0.5) * journey;
  const top = angle === 1;
  const y = top ? 510 + Math.sin(p * 2.8) * 120 : 756 + Math.sin(t * .12) * 7;
  return (
    <g>
      {memorial ? <DuskSky id="qtRiver" horizonY={700} /> : <NightSky id="qtRiver" horizonY={660} />}
      <defs>
        <linearGradient id="qtCurrent" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor={memorial ? '#706078' : '#294254'} />
          <stop offset="1" stopColor={memorial ? '#27374b' : '#0c2235'} />
        </linearGradient>
        <clipPath id="qtWaterClip">
          <path d={top ? 'M0 326Q750 200 1920 500V1080Q800 821 0 926Z' : 'M0 628Q910 601 1920 701V1080H0Z'} />
        </clipPath>
      </defs>
      {!top && (
        <>
          {memorial && <Sun x={1400} y={405} r={104} t={t} rays={false} />}
          <path d="M0 601 192 521 385 551 595 474 846 534 1069 474 1285 573 1532 526 1920 573V838H0Z" fill={memorial ? '#483b52' : '#25293f'} />
          <path d="M0 615Q530 540 1050 600T1920 666V1080H0Z" fill="#192333" />
        </>
      )}
      {top && <rect width={1920} height={1080} fill={memorial ? '#594750' : '#273038'} />}
      <g clipPath="url(#qtWaterClip)">
        <rect width={1920} height={1080} fill="url(#qtCurrent)" />
        {Array.from({length: 34}, (_, i) => {
          const wx = ((rnd(57, i) * 2180 + t * (rain ? 3.2 : 1.4)) % 2180) - 140;
          const wy = (top ? 350 : 626) + rnd(58, i) * (top ? 652 : 445);
          return <path key={i} d={`M${wx} ${wy}q70 -10 140 0t120 0`} fill="none" stroke={memorial ? '#e9a88b' : '#92abc2'} opacity={.12 + .22 * rnd(59, i)} strokeWidth={3 + 3 * rnd(60, i)} />;
        })}
        {memorial && Array.from({length: 15}, (_, i) => {
          const fx = 580 + ((rnd(30, i) * 780 + t * .85) % 920);
          const fy = (top ? 540 : 714) + rnd(31, i) * 228;
          return <g key={i} transform={`translate(${fx} ${fy})`}><ellipse rx={21} ry={7} fill="#e6b18c" /><ellipse cy={-3} rx={9} ry={6} fill="#f9dc9a" /></g>;
        })}
      </g>
      {!memorial && (
        <g transform={`translate(${x} ${y}) scale(${angle === 2 ? 1.32 : top ? .86 : 1.1})`}>
          <path d="M-198 31Q-139 62 0 52T225 31" fill="none" stroke="#bad4d9" strokeWidth={5} opacity={.39} />
          <path d="M-182 -18Q0 1 177 -18L136 40Q0 64 -127 40Z" fill="#694737" stroke="#1c1c27" strokeWidth={8} />
          <Ball id="qtBoatBall" x={-58} y={-53} r={71} flag="VNM" eyes="worried" look={returning ? -.65 : .65} hat={<MuCoi />} shadow={false} motion={breathe(t, 60, .016)} />
          <g transform="translate(62,-46)">
            <rect x={-44} y={-5} width={87} height={37} rx={4} fill={returning ? '#c8b7a1' : '#9c784f'} stroke="#28232a" strokeWidth={5} />
            {!returning && <path d="M-9 -5V30M18 -5V30" stroke="#523d31" strokeWidth={5} />}
          </g>
          <path d="M-179 -11Q0 19 177 -11L137 43Q0 60 -128 43Z" fill="#473338" stroke="#201d28" strokeWidth={8} />
        </g>
      )}
      {rain && <g stroke="#b6cddd" opacity={.38}>{Array.from({length: 110}, (_, i) => {
        const x0 = (rnd(11, i) * 2070 - t * 6 + 20700) % 2070;
        const y0 = (rnd(15, i) * 1120 + t * 24) % 1120;
        return <path key={i} d={`M${x0} ${y0}l-16 44`} strokeWidth={2} />;
      })}</g>}
      {!top && <path d="M0 1011Q206 925 425 1004L612 1080H0Z" fill="#171f2c" />}
    </g>
  );
};
