// Exact persisted comparison context, not a score or an educational inference.
export const confirmationKeys=['identityConfirmed','scopeConfirmed','editionConfirmed','notStarted'];
const stable=x=>Array.isArray(x)?`[${x.map(stable).join(',')}]`:x&&typeof x==='object'?`{${Object.keys(x).sort().filter(k=>x[k]!==undefined).map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')}}`:JSON.stringify(x)??'null';
export function comparisonBasis(s){
 const q=s.wizard?.quick||{},c=q.speedComparison||{};
 return stable({version:1,stage:q.stage,level:q.level,sourceSection:q.sourceSection,monthlyLanes:q.monthlyLanes||{},direction:q.learningDirection,courses:s.courses||[],startMonth:c.startMonth||'',selectedSteps:[...(c.selectedSteps||[])].sort()});
}
export function comparisonConfirmed(s){const c=s.wizard?.quick?.speedComparison;return !!c&&confirmationKeys.every(k=>c[k]===true)&&c.confirmedBasis===comparisonBasis(s);}
export function sourceComparisonBasis(s){const f=s.workspace?.view?.editor?.fields||{};return stable({version:1,sourceRow:f.sourceRow||'',startMonth:f.candidateStart||'',selectedSteps:[...(f.selectedSteps||[])].sort(),courses:s.courses||[]});}
export function sourceComparisonConfirmed(s){const f=s.workspace?.view?.editor?.fields;return !!f&&confirmationKeys.every(k=>f[k]===true)&&f.confirmedBasis===sourceComparisonBasis(s);}
function referenceMatches(s,g){const f=s.workspace?.view?.editor?.fields||{};return g.basisFingerprint===sourceComparisonBasis(s)&&confirmationKeys.every(k=>!!g.confirmations?.[k]===!!f[k])&&(!f.reconfirmationRequired||sourceComparisonConfirmed(s));}
export function resetComparison(c,reason='비교 기준이 바뀌었습니다. 선택한 범위를 다시 확인해 주세요.'){
 for(const k of confirmationKeys)c[k]=false;
 delete c.confirmedBasis;c.invalidatedReason=reason;
}
export function synchronizeComparison(s){
 const c=s.wizard?.quick?.speedComparison;
 if(c){const current=comparisonBasis(s);if(!c.observedBasis&&!c.confirmedBasis&&confirmationKeys.some(k=>c[k]===true))resetComparison(c,'이전 확인에는 비교 기준 기록이 없어 다시 확인이 필요합니다.');if(c.observedBasis&&c.observedBasis!==current||c.confirmedBasis&&c.confirmedBasis!==current)resetComparison(c);c.observedBasis=current;}
 const f=s.workspace?.view?.editor?.kind==='source'?s.workspace.view.editor.fields:null;
 if(f&&!f.observedBasis&&!f.confirmedBasis&&confirmationKeys.some(k=>f[k]===true)){resetComparison(f,'이전 확인에는 원표 비교 기준 기록이 없어 다시 확인이 필요합니다.');f.reconfirmationRequired=true;f.observedBasis=sourceComparisonBasis(s);}
 for(const p of s.workspace?.previews||[]){
  if(p.status==='applied')continue;
  const models=(p.operations||[]).map(o=>o.item?.source?.comparisonModel).filter(Boolean);
  const refs=(p.operations||[]).map(o=>o.item?.source?.referenceComparison).filter(Boolean);
  const unboundReference=(p.operations||[]).some(o=>o.item?.candidateId&&!o.item?.source?.comparisonModel&&!o.item?.source?.referenceComparison&&/^reference-S[1-4]:/.test(s.workspace.candidates?.find(c=>c.id===o.item.candidateId)?.templateId||''));
  if(unboundReference||models.some(m=>!m.basisFingerprint||m.basisFingerprint!==comparisonBasis(s)||!comparisonConfirmed(s))||refs.some(g=>!referenceMatches(s,g))){p.comparisonInvalidated=true;p.comparisonInvalidatedReason='비교 기준 변경 또는 이전 확인 기준 미기록으로 이 미리보기는 사용할 수 없습니다. 다시 확인한 뒤 새 후보를 만들어 주세요.';}
 }
 return s;
}
export function assertPreviewComparison(s,p){
 const models=(p.operations||[]).map(o=>o.item?.source?.comparisonModel).filter(Boolean);
 const refs=(p.operations||[]).map(o=>o.item?.source?.referenceComparison).filter(Boolean);
 if(p.comparisonInvalidated||models.some(m=>!m.basisFingerprint||m.basisFingerprint!==comparisonBasis(s)||!comparisonConfirmed(s))||refs.some(g=>!referenceMatches(s,g)))throw Object.assign(Error(p.comparisonInvalidatedReason||'현재 비교 기준과 미리보기가 다릅니다. 선택한 범위를 다시 확인하고 새 후보를 만들어 주세요.'),{code:'COMPARISON_STALE'});
}
