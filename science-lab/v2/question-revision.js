const clone=x=>JSON.parse(JSON.stringify(x));
const own=(o,k)=>Object.hasOwn(o||{},k);
export const questionVersion=it=>it?.contentVersion||1;
// 내용이 바뀐 문항에만 해당 버전의 진단 규칙을 적용한다. null은 예전 규칙의 제외다.
export function questionMisconceptions(it,misc){
 const override=it?.diagnosticOverride;if(!misc||!override||override.version!==questionVersion(it))return misc;
 const next={...misc};for(const key of['typed','distractors','cloze','cells'])if(own(override,key)){next[key]={...misc[key]};if(override[key]==null)delete next[key][it.id];else next[key][it.id]=override[key];}return next;
}
export function questionAtVersion(it,version){
 if(!it||questionVersion(it)===version)return it;
 const history=it.previousVersions||[],index=history.findIndex(p=>p.version===version);if(index<0)return null;
 let presentation=it;
 // Older choice-only deltas inherit unchanged fields from the nearest later
 // snapshot, rather than from a subsequently rewritten current question.
 for(let i=history.length-1;i>=index;i--){const{version:_,...fields}=history[i];presentation={...presentation,...clone(fields)};}
 return{...presentation,contentVersion:version};
}
export function pickedChoiceTexts(it,event){
 if(Array.isArray(event?.pickedTexts))return[...event.pickedTexts];
 const original=questionAtVersion(it,event?.presentationVersion||1);
 return[].concat(event?.picked??[]).map(i=>original?.choices?.[i]??'기록한 보기 확인 필요');
}
export function presentationRecord(it,detail){
 if(!it.previousVersions?.length)return{};
 return{presentationVersion:questionVersion(it),...(detail?.picked!=null&&it.choices?{pickedTexts:[].concat(detail.picked).map(i=>it.choices[i]??'기록한 보기 확인 필요')}:{})};
}
export function restoreDailyQuestions(current,state){return current.map(it=>{
 if(!it.previousVersions?.length)return it;
 const saved=['answers','first','graded'].some(key=>own(state[key],it.id));
 if(!saved)return it;
 const version=state.questionVersions?.[it.id]||1,old=questionAtVersion(it,version);
 return old||{...it,contentVersion:version,unavailableRevision:true,choices:it.choices?.map(()=> '기록한 보기 확인 필요')};
});}
export const isPreviousQuestion=(it,current)=>it.unavailableRevision||questionVersion(it)!==questionVersion(current);
export function restartCurrentQuestion(state,current){
 const next=clone(state),id=current.id,version=state.questionVersions?.[id]||1,old=questionAtVersion(current,version),attempt={version,at:state.questionTimes?.[id]??state.at??null};
 for(const key of ['answers','self','first','graded'])if(own(state[key],id))attempt[key]=clone(state[key][id]);
 if(old)attempt.presentation={prompt:old.prompt,choices:old.choices?clone(old.choices):null};
 next.revisionHistory={...(next.revisionHistory||{}),[id]:[...(next.revisionHistory?.[id]||[]),attempt]};
 for(const key of ['answers','self','first','graded','questionTimes'])if(next[key])delete next[key][id];
 next.questionVersions={...(next.questionVersions||{}),[id]:questionVersion(current)};return next;
}
