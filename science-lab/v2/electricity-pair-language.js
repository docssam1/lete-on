import{ELECTRICITY_PAIR_WORDING,ELECTRICITY_PAIR_FIGURE}from'./electricity-pair-language-data.js?v=20261108-electricity-pair-language';
export const ELECTRICITY_PAIR_LANGUAGE_VERSION='20261108-electricity-pair-language';
const priorVersion='20261104-electricity-book',clone=value=>structuredClone(value),cache=new WeakMap();
const matches=(q,fields)=>Object.entries(fields).every(([key,value])=>Object.hasOwn(q,key)&&JSON.stringify(q[key])===JSON.stringify(value));
const entryFor=q=>q?.status==='authored'&&q.sourceRef?.type==='authored-pair'&&Object.hasOwn(ELECTRICITY_PAIR_WORDING,q.id)?ELECTRICITY_PAIR_WORDING[q.id]:null;
export function electricityPairCurrentItems(rows,unit='c22-s62-u03'){
 if(unit!=='c22-s62-u03'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const entry=entryFor(q);if(!entry||(q.contentVersion||1)!==priorVersion||!matches(q,entry.prior))return q;changed=true;if(cache.has(q))return cache.get(q);
  const current={...clone(q),...clone(entry.patch),contentVersion:ELECTRICITY_PAIR_LANGUAGE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
  if(q.diagnosticOverride?.version===priorVersion)current.diagnosticOverride={...clone(q.diagnosticOverride),version:ELECTRICITY_PAIR_LANGUAGE_VERSION};cache.set(q,current);return current;
 });return changed?next:rows;
}
export function isReadableElectricityPair(q){const entry=entryFor(q);return !!entry&&q.contentVersion===ELECTRICITY_PAIR_LANGUAGE_VERSION&&matches(q,{...entry.prior,...entry.patch});}
export function electricityPairPrintQuestion(old,current){
 if(!isReadableElectricityPair(current)||old.id!==current.id||old.sourceItemId!==current.id||JSON.stringify(old.sourceRef)!==JSON.stringify(current.sourceRef))return old;
 const entry=entryFor(current);for(const key of ['prompt','choices','explanation','responseContract','answerContract'])if(JSON.stringify(old[key]??null)!==JSON.stringify(entry.prior[key]??null))throw Error('짝문항의 이전 인쇄 원고가 다릅니다.');
 const given=Object.entries(current.givens||{}).filter(([,value])=>typeof value==='string').map(([key,value])=>key+': '+value),next={...old,prompt:current.prompt,choices:current.choices?clone(current.choices):null,explanation:current.explanation,given,responseContract:clone(current.responseContract),answerContract:clone(current.answerContract),contentVersion:ELECTRICITY_PAIR_LANGUAGE_VERSION};
 const c=current.responseContract;if(c.kind==='single-choice')next.answer='①②③④⑤'[c.answer]+' '+current.choices[c.answer];else if(c.teacherRequired&&c.sample)next.answer=c.sample;
 if(typeof next.misconception==='string')next.misconception=next.misconception.replaceAll('전기 회로을','전기 회로를');return next;
}
export function electricityPairPrintFigures(figures,questions){
 const q=questions.find(q=>q.id==='c22-s62-u03-v049');if(q?.contentVersion!==ELECTRICITY_PAIR_LANGUAGE_VERSION)return figures;const f=ELECTRICITY_PAIR_FIGURE;if(figures[f.key]!==f.prior)throw Error('짝문항 비교표의 이전 원고가 다릅니다.');return {...figures,[f.key]:f.current};
}
