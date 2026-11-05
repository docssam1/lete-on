// 시험지 원고와 응답을 함께 보존한다. 기기 저장소를 읽거나 쓰지 않는 순수 함수들이다.
const clone=x=>JSON.parse(JSON.stringify(x));
const presentationKeys=['id','prompt','givens','choices','responseContract','answerContract','explanation','sourceRef','figure','figureNote','photoLabels','photoFigure','contentVersion','previousVersions'];
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const signature=questions=>JSON.stringify(canonical(questions.map(q=>Object.fromEntries(presentationKeys.filter(k=>q[k]!==undefined).map(k=>[k,q[k]])))));
export const snapshotDailyPaper=list=>({version:1,questions:clone(list)});
const validPaper=paper=>paper?.version===1&&Array.isArray(paper.questions)&&paper.questions.length>0&&new Set(paper.questions.map(q=>q?.id)).size===paper.questions.length&&paper.questions.every(q=>typeof q?.id==='string'&&typeof q.prompt==='string'&&q.answerContract?.type);
const savedIds=state=>[...new Set(['graded','answers','first','self','revisionHistory'].flatMap(k=>Object.keys(state?.[k]||{})))];
const missing=id=>({id,prompt:'저장된 문항의 원고를 확인할 수 없어요.',answerContract:{type:'short-text',answer:''},unavailableOriginal:true});
export function resolveDailyPaper(current,state,{legacyList=[],pool=[]}={}){
 if(validPaper(state?.paper)){
  const questions=clone(state.paper.questions),changed=signature(questions)!==signature(current);
  const ownIds=new Set(questions.map(q=>q.id)),extra=savedIds(state).filter(id=>!ownIds.has(id));
  if(extra.length)return{questions:[...questions,...extra.map(missing)],readOnly:true,reason:'unbound',snapshot:false};
  return{questions,readOnly:changed,reason:changed?'changed':'current',snapshot:true};
 }
 const ids=savedIds(state),legacyChanged=legacyList.length&&signature(legacyList)!==signature(current);
 if(!ids.length&&!state?.paper)return{questions:current,readOnly:false,reason:'new',snapshot:false};
 const currentIds=new Set(current.map(q=>q.id)),unknown=ids.some(id=>!currentIds.has(id));
 if(!legacyChanged&&!unknown&&!state?.paper)return{questions:current,readOnly:false,reason:'current',snapshot:false};
 // 원고·순서가 없는 기록에서 전체 시험지를 추측하지 않는다.
 // 저장된 채점 키와 응답 항목만 표시하며 미기록 문항을 덧붙이지 않는다.
 const sources=new Map([...pool,...current,...legacyList].map(q=>[q.id,q]));
 return{questions:ids.length?ids.map(id=>!state?.paper&&sources.has(id)?clone(sources.get(id)):missing(id)):[missing('unavailable-paper')],readOnly:true,reason:state?.paper?'unavailable':'unbound',snapshot:false};
}
export function startDailyPaper(state,resolved,current,attemptKey){
 if(typeof attemptKey!=='string'||!/^[a-zA-Z0-9-]+$/.test(attemptKey))throw Error('새 답안 식별자가 필요합니다.');
 const previous=clone(state),paperHistory=Array.isArray(previous.paperHistory)?previous.paperHistory:[];if(Array.isArray(previous.paperHistory))delete previous.paperHistory;
 const archive={paper:snapshotDailyPaper(resolved.questions),state:previous,originalCompositionKnown:resolved.snapshot};
 return{...clone(state),answers:{},self:{},first:{},graded:null,cur:0,at:null,questionVersions:{},questionTimes:{},revisionHistory:{},paper:snapshotDailyPaper(current),attemptKey,paperHistory:[...paperHistory,archive]};
}
export const dailyReviewSlide=(id,state)=>`daily-${id}${state?.attemptKey?`:paper:${state.attemptKey}`:''}`;
export const dailyPhotoKey=(store,state)=>`${store}${state?.attemptKey?':paper:'+state.attemptKey:''}`;
