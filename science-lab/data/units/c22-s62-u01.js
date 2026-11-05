import {unit as pairedUnit,items as pairedItems} from './c22-s62-u01.paired.js';
import {taxonomy} from './c22-s62-u01.taxonomy.js?v=79';
import {seasonAuthoredItems} from '../book/c22-s62-u01.season-items.js';
export const unit={...pairedUnit,sources:{...pairedUnit.sources,scope:'독립 연습70·독립 창작128=198문항. 원문과 공식 답은 비공개이며 현행 판본 전체 원문은 준비 중이다.'}};
export const items=[...pairedItems,...seasonAuthoredItems(taxonomy)];
export const source=[];
export const similar=[];
