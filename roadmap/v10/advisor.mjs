import {trackOf,scopeLabel,TYPE_HELP,scorePersonality} from './flow.mjs';
import {mappingSnapshot} from './curriculum.mjs';
export const HELP_OPTIONS=[['unknown','아직 확인하지 않았어요'],['읽기만 도움','읽기만 도와줘요'],['힌트 도움','힌트 후 시도해요'],['풀이 함께','풀이를 함께 해요'],['해설 보고 재풀이','해설을 보고 다시 풀어요'],['혼자 풀이','혼자 풀어요'],['문제마다 다름','문제마다 달라요']];
export const DEPTH_OPTIONS=['unknown','개념·기본','응용','심화','서술·증명','경시 유형','섞여 있음'];
export function courseScope(c){return Object.fromEntries(['course','volume','unit','range','edition','sourceCurriculum','isbn'].map(k=>[k,c[k]||'']));}
export function observationFor(s,c){
 const o=s.wizard.courseObservations?.[c.id];
 if(!o)return {status:'unknown',help:'unknown',depth:'unknown',burden:'unknown',explanation:'unknown',weeklyMinutes:null,adultMinutes:null};
 if(JSON.stringify(o.scope)!==JSON.stringify(courseScope(c)))return {...o,status:'scope_changed',help:'unknown',depth:'unknown',burden:'unknown',explanation:'unknown',weeklyMinutes:null,adultMinutes:null};
 return {...o,status:'parent_report'};
}
export function saveObservation(s,cid,input){
 const c=s.courses.find(c=>c.id===cid);if(!c)throw Error('관찰한 과정을 선택해 주세요.');
 const optional=v=>v===null||v===undefined||v===''?null:Number(v);
 const minutes=optional(input.weeklyMinutes),adult=optional(input.adultMinutes);
 for(const n of [minutes,adult])if(n!==null&&(!Number.isFinite(n)||n<0||n>10080))throw Error('주당 시간은 0~10080분으로 입력해 주세요.');
 if(!HELP_OPTIONS.some(([v])=>v===input.help)||!['unknown','manageable','high','varies'].includes(input.burden)||!['unknown','example','needs_help','answer_only'].includes(input.explanation))throw Error('학습 상태 선택을 확인해 주세요.');
 if(!DEPTH_OPTIONS.includes(input.depth||'unknown'))throw Error('실제로 학습한 깊이를 확인해 주세요.');
 s.wizard.courseObservations??={};s.wizard.observationHistory??=[];
 if(s.wizard.courseObservations[cid])s.wizard.observationHistory.push({courseId:cid,...structuredClone(s.wizard.courseObservations[cid])});
 s.wizard.courseObservations[cid]={help:input.help,depth:input.depth||'unknown',burden:input.burden,explanation:input.explanation,example:input.example||'',weeklyMinutes:minutes,adultMinutes:adult,scope:courseScope(c),at:new Date().toISOString(),sourceRole:'parent_report',questionIds:['Q15','Q16','Q17']};
 return s;
}
export function selectedTime(s,courseIds){
 let minutes=0,adultMinutes=0;const unknown=[],adultUnknown=[];
 for(const c of s.courses.filter(c=>courseIds.includes(c.id))){const o=observationFor(s,c);if(o.weeklyMinutes===null)unknown.push(c.id);else minutes+=o.weeklyMinutes;if(o.adultMinutes===null)adultUnknown.push(c.id);else adultMinutes+=o.adultMinutes;}
 const available=Number.isFinite(s.support.weekdayMinutes)&&Number.isFinite(s.support.weekendMinutes)?5*s.support.weekdayMinutes+2*s.support.weekendMinutes:null;
 return {reportedChildMinutes:minutes,reportedAdultMinutes:adultMinutes,childUnknownCourseIds:unknown,adultUnknownCourseIds:adultUnknown,availableAdultMinutes:available,adultFit:available===null?'unknown':adultMinutes>available?'reported_over':adultUnknown.length?'incomplete':'within_reported',childFeasibility:'not_assessed',sourceRole:'parent_report'};
}
export function routeAdvice(s,bookData,personalityData,{courseIds=s.wizard.selectedCourseIds??s.courses.filter(c=>c.status!=='ended').map(c=>c.id)}={}){
 const items=[];
 for(const c of s.courses.filter(c=>courseIds.includes(c.id))){
  const o=observationFor(s,c),track=trackOf(c),base={courseId:c.id,title:c.course,scope:scopeLabel(c),evidence:o.status,sourceIds:['UF03','U2','T2','T3'],questionIds:['Q16','Q17'],automatic:false};
  let direction='현재 입력을 유지하며 진행 방향을 비교',reason='진도만으로 이해도·보완 필요를 판단하지 않아요.',nextQuestions=['Q16','Q17'];
  if(o.status==='scope_changed'){direction='바뀐 범위의 학습 상태 다시 확인';reason='이전 범위에서의 관찰은 기록에 남기고 새 범위의 이해·도움·부담을 다시 살펴봐요.';}
  else if(o.burden==='high'){direction=track==='depth'?'심화의 분량 조정·잠시 쉬기·나중 합류 비교':'현재 과정의 분량·도움 조정 후 병행 여부 비교';reason='가족이 이 과정의 부담이 크다고 보고했어요. 다른 과정을 한꺼번에 중단하지 않고 해당 과정부터 비교해요.';nextQuestions=['Q06','Q16','Q17'];}
  else if(o.help==='읽기만 도움'){direction='읽기 도움을 유지하며 응용·심화 병행 비교';reason='지문 읽기 도움과 수학 이해는 따로 살펴봐요. 초등 교재의 비교 후보로 최상위 S 수학을 함께 볼 수 있어요.';base.sourceIds.push('UF06');if(s.wizard.bookNeed==='fast'){reason+=' 빠른 선행 희망도 함께 있어 최상위 수학과 두 후보를 비교해요. 어느 기준을 먼저 적용할지는 아직 정하지 않았어요.';base.unresolvedNeedPriority=['reading','fast'];}}
  else if(['힌트 도움','풀이 함께','해설 보고 재풀이'].includes(o.help)||o.explanation==='needs_help'){direction='현재 범위 재풀이·설명 확인 후 이어가기와 보완 경로 비교';reason='보고한 도움 방식에 맞춰 현재 범위를 더 살펴볼 수 있어요. 실제 약점이나 필수 보완을 확정하지는 않아요.';nextQuestions=['Q16','Q17','Q18'];}
  else if(o.help==='혼자 풀이'&&o.explanation==='example'&&o.example.trim()){direction='현재 흐름 유지와 이전 범위 심화 추가 비교';reason='가족이 최근 혼자 풀고 설명한 예를 남겼어요. 학습 여유와 다른 과정의 부담을 함께 확인해 선택해요.';nextQuestions=['Q06','Q22'];}
  items.push({...base,direction,reason,nextQuestionIds:nextQuestions,observation:structuredClone(o),mapping:mappingSnapshot(c,bookData)});
 }
 const time=selectedTime(s,courseIds),personality=scorePersonality(s.personality,personalityData);
 return {items,time,personalityHelp:personality?{type:personality.primary,text:TYPE_HELP[personality.primary],role:'coaching_only'}:null,automaticRouteSelection:false,sourceIds:['UF03','F01','F21','F25','UF06'],unknowns:items.filter(i=>['unknown','scope_changed'].includes(i.evidence)).map(i=>i.courseId)};
}
