import {buildFoldResultProblem,signatureKey} from '../games/paper-fold/reverse-fold.js?v=20261018-3';
const poly=coords=>coords.map(([x,y])=>({x,y}));
// A single fold of a convex sheet is the union of two convex pieces sharing
// the crease. It stays connected and cannot acquire a hole. These distractors
// remain impossible even if the child rotates or moves the paper.
export function resultActivity(shape,variant){
  const base=buildFoldResultProblem(shape,variant),correct=base.resultOptions.filter(o=>o.correct);
  const disconnected={pieces:[poly([[.12,.65],[.34,.65],[.12,.87]]),poly([[.68,.13],[.90,.13],[.90,.35]])],correct:false,impossibility:'disconnected'};
  const ring={pieces:[poly([[.22,.22],[.78,.22],[.78,.36],[.22,.36]]),poly([[.22,.64],[.78,.64],[.78,.78],[.22,.78]]),poly([[.22,.36],[.36,.36],[.36,.64],[.22,.64]]),poly([[.64,.36],[.78,.36],[.78,.64],[.64,.64]])],correct:false,impossibility:'hole'};
  const options=[correct[0],disconnected,correct[1],ring],ordered=options.slice(variant%4).concat(options.slice(0,variant%4));
  const resultOptions=ordered.map((o,i)=>({...o,key:String.fromCharCode(97+i),signature:signatureKey(o.pieces)}));
  return {...base,resultOptions,answerKeys:resultOptions.filter(o=>o.correct).map(o=>o.key),impossibilityContract:'connected and hole-free under any rigid motion'};
}
