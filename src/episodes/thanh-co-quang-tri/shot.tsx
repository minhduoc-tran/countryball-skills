import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { PhotoCard } from '../../countryball/photo-card';
import { Battlefield, Riverbank } from './battle-art';
import { CampaignMap } from './campaign-map';
import archiveData from './archive.json';
import captions from './captions.json';
import timeline from './timeline.json';

const archives = archiveData as Record<string, {src: string; caption: string; credit: string; w: number; h: number}>;
type Spec = {mode: string; stage: string; label: string; chapter: string; angle: number; photo?: string};

const wrap = (text: string, limit: number) => {
  const lines = [''];
  for (const word of text.split(' ')) {
    const last = lines.length - 1;
    if (lines[last] && lines[last].length + word.length + 1 > limit) lines.push(word);
    else lines[last] = lines[last] ? `${lines[last]} ${word}` : word;
  }
  return lines;
};

const ArchiveFrame: React.FC<{ id: string; p: number }> = ({ id, p }) => {
  const image = archives[id];
  const scale = Math.min(908 / image.w, 720 / image.h);
  return (
    <>
      <rect y={346} width={1080} height={1002} fill="#232722" />
      <path d="M0 448H1080M0 1216H1080" stroke="#635c4a" strokeWidth={2} opacity={.58} />
      <PhotoCard id={`qtArchive${id}`} src={image.src} caption={image.caption} credit={image.credit}
        x={540} y={830} w={image.w * scale} h={image.h * scale} from={-1} t={p * 4} rot={0}
        kb={{ z0: 1, z1: 1.034, px0: 0, py0: 0, px1: 0, py1: 0 }} />
    </>
  );
};

export const makeShot = (spec: Spec): React.FC<ShotProps> => ({ t, len, f }) => {
  const {mode, stage, label, chapter, angle, photo} = spec;
  const p = Math.min(1, t / Math.max(len - 1, 1));
  const title = mode === 'title';
  const archive = mode === 'photo' && photo && archives[photo] ? photo : undefined;
  const river = ['river', 'rain', 'memorial'].includes(mode);
  const stageProps = {t, p, stage, angle};
  const caption = captions.find((c) => f >= c.a && f < c.b);
  const lines = wrap(label, 23);
  const map = mode === 'map';
  const view = map ? '307 58 1420 960' : river ? '440 149 1040 931' : '324 200 1272 880';
  const faction = stage === 'hold' ? 'QUÂN ĐỘI NHÂN DÂN VIỆT NAM'
    : stage === 'airborne' ? 'NHẢY DÙ VIỆT NAM CỘNG HÒA'
    : stage === 'advance' || stage === 'breach' ? 'THỦY QUÂN LỤC CHIẾN VIỆT NAM CỘNG HÒA' : '';
  return (
    <g>
      <defs>
        <linearGradient id="qtMobileBg" x1="0" x2=".35" y1="0" y2="1">
          <stop stopColor="#1f2229" />
          <stop offset=".72" stopColor="#111720" />
          <stop offset="1" stopColor="#0d111a" />
        </linearGradient>
        <linearGradient id="qtPictureFade" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#141920" stopOpacity={0} />
          <stop offset="1" stopColor="#141920" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#qtMobileBg)" />
      {archive ? <ArchiveFrame id={archive} p={p} /> : (
        <>
          <svg x={0} y={347} width={1080} height={1001} viewBox={view}
            preserveAspectRatio={map ? 'xMidYMid meet' : 'xMidYMid slice'} overflow="hidden">
            {map ? <CampaignMap stage={stage} p={p} angle={angle} />
              : river ? <Riverbank {...stageProps} />
              : <Battlefield {...stageProps} />}
          </svg>
          <rect y={1210} width={1080} height={140} fill="url(#qtPictureFade)" />
          {mode === 'battle' && faction && (
            <text x={64} y={1303} fill="#e2c19b" fontFamily={FONT.ui} fontSize={20} letterSpacing={1.2}>{faction}</text>
          )}
        </>
      )}
      <rect x={64} y={100} width={46} height={4} fill="#e1aa73" />
      <text x={126} y={110} fill="#e1ba91" fontFamily={FONT.ui} fontSize={24} letterSpacing={3.2}>{archive ? 'ẢNH / TƯ LIỆU LƯU TRỮ' : chapter}</text>
      {lines.map((line, i) => (
        <text key={i} x={63} y={214 + i * 73} fill="#fff4e4" fontFamily={FONT.title} fontSize={title ? 79 : 66} fontWeight={800}>{line}</text>
      ))}
      <path d="M64 337H1016" stroke="#ad8567" opacity={.62} strokeWidth={2} />
      <path d="M64 1390H1016" stroke="#ad8567" opacity={.54} strokeWidth={2} />
      <text x={66} y={1443} fontFamily={FONT.ui} fill="#c7a684" letterSpacing={3} fontSize={22}>THÀNH CỔ QUẢNG TRỊ</text>
      {caption?.lines.map((line, i) => (
        <text key={i} x={65} y={1525 + i * 62} fontFamily={FONT.title} fill="#f7ecdf" fontSize={49} fontWeight={650}>{line}</text>
      ))}
      <rect x={64} y={1688} width={950} height={3} fill="#3b3b42" />
      <rect x={64} y={1688} width={950 * Math.min(f / (timeline.total - 1), 1)} height={3} fill="#dfaa76" />
    </g>
  );
};
