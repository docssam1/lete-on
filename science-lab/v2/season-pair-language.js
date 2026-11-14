import{SEASON_PAIR_WORDING}from'./season-pair-language-data.js?v=20261108-season-pair-language';
export const SEASON_PAIR_LANGUAGE_VERSION='20261108-season-pair-language';
const clone=value=>structuredClone(value),cache=new WeakMap();
const matches=(q,fields)=>Object.entries(fields).every(([key,value])=>Object.hasOwn(q,key)&&JSON.stringify(q[key])===JSON.stringify(value));
const entryFor=q=>q?.status==='authored'&&q.sourceRef?.type==='authored-pair'&&Object.hasOwn(SEASON_PAIR_WORDING,q.id)?SEASON_PAIR_WORDING[q.id]:null;
export function seasonPairCurrentItems(rows,unit='c22-s62-u01'){
 if(unit!=='c22-s62-u01'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const entry=entryFor(q);if(!entry||(q.contentVersion||1)!==entry.priorVersion||!matches(q,entry.prior))return q;changed=true;if(cache.has(q))return cache.get(q);
  const current={...clone(q),...clone(entry.patch),contentVersion:SEASON_PAIR_LANGUAGE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),contentVersion:q.contentVersion||1,previousVersions:clone(q.previousVersions||[]),version:q.contentVersion||1}]};
  if(q.diagnosticOverride?.version===entry.priorVersion)current.diagnosticOverride={...clone(q.diagnosticOverride),version:SEASON_PAIR_LANGUAGE_VERSION};cache.set(q,current);return current;
 });return changed?next:rows;
}
export function isReadableSeasonPair(q){const entry=entryFor(q);return !!entry&&q.contentVersion===SEASON_PAIR_LANGUAGE_VERSION&&matches(q,{...entry.prior,...entry.patch});}
export function seasonPairPrintQuestion(old,current){
 if(!isReadableSeasonPair(current)||old.id!==current.id||old.sourceItemId!==current.id||JSON.stringify(old.sourceRef)!==JSON.stringify(current.sourceRef))return old;
 const entry=entryFor(current);for(const key of ['prompt','choices','explanation','responseContract','answerContract'])if(JSON.stringify(old[key]??null)!==JSON.stringify(entry.prior[key]??null))throw Error('짝문항의 이전 인쇄 원고가 다릅니다.');
 const given=Object.entries(current.givens||{}).filter(([,value])=>typeof value==='string').map(([key,value])=>key+': '+value),next={...old,prompt:current.prompt,choices:current.choices?clone(current.choices):null,explanation:current.explanation,given,responseContract:clone(current.responseContract),answerContract:clone(current.answerContract),contentVersion:SEASON_PAIR_LANGUAGE_VERSION};
 const c=current.responseContract;if(c.kind==='single-choice')next.answer='①②③④⑤'[c.answer]+' '+current.choices[c.answer];else if(c.teacherRequired&&c.sample)next.answer=c.sample;
 return next;
}
