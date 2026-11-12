import {defineEpisode, Timeline} from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
export const noPhone=defineEpisode('NoPhone',{timeline:timeline as Timeline,shots});
