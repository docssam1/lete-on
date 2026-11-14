import {unit as pairedUnit,items as pairedItems} from './c22-s62-u01.paired.js';
import {taxonomy} from './c22-s62-u01.taxonomy.js?v=20261114-source-integration';
import {seasonAuthoredItems} from '../book/c22-s62-u01.season-items.js';
export const unit={...pairedUnit,sources:{...pairedUnit.sources,scope:'옛단원 연계 원문68·독립 연습198=266문항. 현행 판본 전체 원문은 준비 중이다.',originalExamAvailable:true,sourceExcerptOnly:true}};
export const items=[...pairedItems,...seasonAuthoredItems(taxonomy)];
export {source,sourceRegistration} from './c22-s62-u01.source.js';
export const similar=[];
