import {unit as pairedUnit,items as pairedItems} from './c22-s62-u03.paired.js';
import {taxonomy} from './c22-s62-u03.taxonomy.js?v=93';
import {electricityAuthoredItems} from '../book/c22-s62-u03.electricity-items.js';
export const unit={...pairedUnit,sources:{...pairedUnit.sources,scope:'독립 연습58·현행 독립 창작128=186문항. 원문과 공식 답안은 비공개이며 현행 전체 원문은 준비 중이다.'}};
const overrides={"4-6":"E4","4-7":"E4","2-6":"E4","4-8":"E4","1-5":"E4"};
const element=q=>overrides[q.key]||({E4:'E5',E5:'E6',E6:'E6',E7:'E6',E8:q.type==='T13'?'E7':'E8'}[q.taxonomy.element]||q.taxonomy.element);
export const items=[...pairedItems.map(q=>({...q,taxonomy:{...q.taxonomy,element:element(q)}})),...electricityAuthoredItems(taxonomy)];
export const source=[];
export const similar=[];
