import {SOLUTION_LANGUAGE_VERSION,SOLUTION_QUESTION_LANGUAGE,solutionChoiceLanguage,solutionQuantityLanguage} from '../data/book/solution-student-language.js';
export {SOLUTION_LANGUAGE_VERSION};
const clone=value=>JSON.parse(JSON.stringify(value));
// The bank has five choices for some four-choice workbook items. Retain its
// original order/contracts and edit only matching words in each presentation.
export function solutionCurrentItems(rows){return rows.map(q=>{
 if(!q.id?.startsWith('c22-s51-u03-b')||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||(q.contentVersion||1)!==1)return q;
 const no=q.workbookRef?.no,patch=SOLUTION_QUESTION_LANGUAGE[no]||{};
 if(!no||q.workbookRef.id!==`solution-book-${String(no).padStart(2,'0')}`)return q;
 let givens=q.givens;
 if(patch.given)givens={...givens,보기:clone(patch.given)};
 if(patch.parts)givens={...givens,문항:clone(patch.parts)};
 const next={...q,prompt:solutionQuantityLanguage(patch.prompt||q.prompt),...(patch.topic?{taxonomy:{...q.taxonomy,topic:patch.topic}}:{}),
  ...(q.choices?{choices:solutionChoiceLanguage(q.choices,patch)}:{}),...(givens!==q.givens?{givens}:{})};
 if(JSON.stringify(next)===JSON.stringify(q))return q;
 return {...next,
  contentVersion:SOLUTION_LANGUAGE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
});}
