import {unit as pairedUnit,items as pairedItems} from './c22-s61-u04.paired.js';
import {taxonomy} from './c22-s61-u04.taxonomy.js';
import {earthMotionAuthoredItems} from '../book/c22-s61-u04.earth-motion-items.js';
export const unit={...pairedUnit,elements:taxonomy.elements.map(e=>e.name),sources:{...pairedUnit.sources,scope:'독립짝39·독립창작128=167문항. 원문·공식 답은 비공개이며 현행 판본 전체 원문은 준비 중이다.'}};
const pairs=pairedItems.map(q=>q.answerContract.type==='written-explanation'?{...q,answerContract:{...q.answerContract,rubric:{required:q.responseContract.required,pass:'방향과 근거를 선생님이 확인해요.'}}}:q);
export const items=[...pairs,...earthMotionAuthoredItems(taxonomy)];
export const source=[];
export const similar=[];
