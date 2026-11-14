import {unit as pairedUnit,items as pairedItems} from './c22-s62-u02.paired.js';
import {taxonomy} from './c22-s62-u02.taxonomy.js?v=86';
import {combustionAuthoredItems} from '../book/c22-s62-u02.combustion-items.js';
export const unit={...pairedUnit,sources:{...pairedUnit.sources,scope:'독립 연습70·현행 독립 창작128=198문항. 원문과 공식 답은 비공개이며 현행 전체 원문은 준비 중이다.'}};
const paired=pairedItems.map(q=>{if(!['c22-s62-u02-v012','c22-s62-u02-v044'].includes(q.id))return q;const choices=[...q.choices];choices[q.id.endsWith('012')?4:1]='일산화 탄소';return{...q,choices,contentVersion:'20261104-combustion-book',previousVersions:[{...JSON.parse(JSON.stringify(q)),version:1}]};});
export const items=[...paired,...combustionAuthoredItems(taxonomy)];
export const source=[];
export const similar=[];
