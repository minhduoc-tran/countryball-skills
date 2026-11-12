import { TypeOneThumbnail } from './episodes/type-one/youtube-thumbnail';
import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import { EPISODES } from './episodes';
import { CastSheet } from './CastSheet';
import { ChannelAvatar, ChannelBanner, ChannelBannerEn } from './channel/channel-branding';
import { LastOneThumbnail } from './episodes/last-one/youtube-thumbnail';
import { ThousandPerSecondThumbnail } from './episodes/nghin-dong-moi-giay/youtube-thumbnail';
import { SunDisappearedThumbnail } from './episodes/sun-disappeared/youtube-thumbnail';
import { InfiniteMoneyThumbnail } from './episodes/tien-vo-han/youtube-thumbnail';
import { TimeLoopThumbnail } from './episodes/vong-lap-mot-ngay/youtube-thumbnail';
import { InfiniteMoneyEnThumbnail } from './episodes/infinite-money/youtube-thumbnail';
import { OnePunchThumbnail } from './episodes/mot-cu-dam/youtube-thumbnail';
import { NoPovertyThumbnail } from './episodes/khong-ai-ngheo/youtube-thumbnail';
import { IfWarThumbnail } from './episodes/neu-chien-tranh/youtube-thumbnail';
import { NoLawThumbnail } from './episodes/khong-phap-luat/youtube-thumbnail';
import { ProcrastinateThumbnail } from './episodes/tri-hoan/youtube-thumbnail';
import { CountryballRiceExport } from './countryball/countryball-rice-export-scene';
import { VietnamChinaPortrait, VietnamPortrait } from './countryball/vietnam-portrait';
import { MapKitDemo } from './countryball/demo-map-kit';
import { FxKitDemo } from './countryball/demo-fx-kit';
import { QT_DEMO_FRAMES, QuangTriKitDemo } from './countryball/demo-quang-tri-kit';
import { SG_DEMO_FRAMES, SaigonKitDemo } from './countryball/demo-sai-gon-kit';
import { TN_DEMO_FRAMES, TayNamKitDemo } from './countryball/demo-tay-nam-kit';
import { SkyDienBienPhuThumbnail } from './episodes/dien-bien-phu-tren-khong/youtube-thumbnail';
import { QuangTri81NgayDemThumbnail } from './episodes/quang-tri-81-ngay-dem/youtube-thumbnail';
import { DinhDocLap304Thumbnail } from './episodes/dinh-doc-lap-30-4/youtube-thumbnail';
import { QuangTriLuaCover } from './episodes/thanh-co-quang-tri-lua/tiktok-cover';
import { ThanhCoQuangTriCover } from './episodes/thanh-co-quang-tri/tiktok-cover';
import { NoOceanThumbnail } from './episodes/dai-duong-can/youtube-thumbnail';
import { SkyDienBienPhuFacebookCover } from './episodes/dien-bien-phu-tren-khong/facebook-cover';

// TikTok / Shorts episodes (9:16, 1080x1920): every episode whose id starts with one of these. All other episodes are 1920x1080.
export const VERTICAL_ID_PREFIXES = ['ThanhCoQuangTri', 'BienGioiTayNam'];
export const isVerticalId = (id: string) => VERTICAL_ID_PREFIXES.some((p) => id.startsWith(p));

// Every episode gets two compositions: <Id> (the film) and <Id>Board (one frame per shot, at its key frame, for the
// storyboard). Cast renders the cast sheet.
//   npx remotion studio src/index.ts --port 3430

export const Root: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      {EPISODES.map((e) => {
        const format = isVerticalId(e.id) ? { ...common, width: 1080, height: 1920 } : common;
        return (
          <React.Fragment key={e.id}>
            <Composition id={e.id} component={e.Main} durationInFrames={Math.max(1, e.total)} {...format} />
            <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={Math.max(1, e.shotCount)} {...format} />
          </React.Fragment>
        );
      })}
      <Composition id="ThanhCoQuangTriLuaCover" component={QuangTriLuaCover} durationInFrames={1} fps={STUDIO.fps} width={1080} height={1920} />
      <Composition id="ThanhCoQuangTriCover" component={ThanhCoQuangTriCover} durationInFrames={1} fps={STUDIO.fps} width={1080} height={1920} />
      <Composition id="TypeOneThumbnail" component={TypeOneThumbnail} durationInFrames={1} {...common} />
      <Composition id="Cast" component={CastSheet} durationInFrames={1} {...common} />
      <Composition id="ChannelAvatar" component={ChannelAvatar} durationInFrames={1} fps={30} width={800} height={800} />
      <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
      <Composition id="ChannelBannerEn" component={ChannelBannerEn} durationInFrames={1} fps={30} width={2560} height={1440} />
      <Composition id="LastOneThumbnail" component={LastOneThumbnail} durationInFrames={1} {...common} />
      <Composition id="ThousandPerSecondThumbnail" component={ThousandPerSecondThumbnail} durationInFrames={1} {...common} />
      <Composition id="SunDisappearedThumbnail" component={SunDisappearedThumbnail} durationInFrames={1} {...common} />
      <Composition id="InfiniteMoneyThumbnail" component={InfiniteMoneyThumbnail} durationInFrames={1} {...common} />
      <Composition id="TimeLoopThumbnail" component={TimeLoopThumbnail} durationInFrames={1} {...common} />
      <Composition id="InfiniteMoneyEnThumbnail" component={InfiniteMoneyEnThumbnail} durationInFrames={1} {...common} />
      <Composition id="OnePunchThumbnail" component={OnePunchThumbnail} durationInFrames={1} {...common} />
      <Composition id="NoPovertyThumbnail" component={NoPovertyThumbnail} durationInFrames={1} {...common} />
      <Composition id="IfWarThumbnail" component={IfWarThumbnail} durationInFrames={1} {...common} />
      <Composition id="NoLawThumbnail" component={NoLawThumbnail} durationInFrames={1} {...common} />
      <Composition id="ProcrastinateThumbnail" component={ProcrastinateThumbnail} durationInFrames={1} {...common} />
      <Composition id="CountryballRiceExport" component={CountryballRiceExport} durationInFrames={1} {...common} />
      <Composition id="VietnamPortrait" component={VietnamPortrait} durationInFrames={1} {...common} />
      <Composition id="VietnamChinaPortrait" component={VietnamChinaPortrait} durationInFrames={1} {...common} />
      <Composition id="MapKitDemo" component={MapKitDemo} durationInFrames={600} {...common} />
      <Composition id="FxKitDemo" component={FxKitDemo} durationInFrames={600} {...common} />
      <Composition id="QuangTriKitDemo" component={QuangTriKitDemo} durationInFrames={QT_DEMO_FRAMES} {...common} />
      <Composition id="SaigonKitDemo" component={SaigonKitDemo} durationInFrames={SG_DEMO_FRAMES} {...common} />
      <Composition id="TayNamKitDemo" component={TayNamKitDemo} durationInFrames={TN_DEMO_FRAMES} fps={STUDIO.fps} width={1080} height={1920} />
      <Composition id="SkyDienBienPhuThumbnail" component={SkyDienBienPhuThumbnail} durationInFrames={1} {...common} />
      <Composition id="QuangTri81NgayDemThumbnail" component={QuangTri81NgayDemThumbnail} durationInFrames={1} {...common} />
      <Composition id="DinhDocLap304Thumbnail" component={DinhDocLap304Thumbnail} durationInFrames={1} {...common} />
      <Composition id="NoOceanThumbnail" component={NoOceanThumbnail} durationInFrames={1} {...common} />
      <Composition id="SkyDienBienPhuFacebookCover" component={SkyDienBienPhuFacebookCover} durationInFrames={1} fps={STUDIO.fps} width={1080} height={1350} />
    </>
  );
};
