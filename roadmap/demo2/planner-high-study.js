/* Shared high-school study calendar. Book completion is not mastery.
 * Pure: existing learner records and source curriculum rows are never mutated.
 * Times are relative months with exclusive ends, like the other planner models.
 */
(function(g){'use strict';
const SUBJECTS=['공통수학1','공통수학2','대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하'];
const BOOKS=['쎈 고등','RPM 고등'];
const round=n=>Math.round(n*1000)/1000;
const clean=v=>typeof v==='string'?v.trim().slice(0,100):'';
const number=v=>v!==''&&v!==null&&v!==undefined&&Number.isFinite(Number(v))?Number(v):null;
const duration=(v,fallback=6)=>{const n=number(v);return n!==null&&n>=.5&&n<=24?n:fallback;};
const isApplicationBook=v=>/쎈|RPM/i.test(String(v||''));
const isBasicBook=v=>/기본\s*정석|수학의\s*정석\s*기본|개념원리/.test(String(v||''));
const isLegacyJeongseok=v=>clean(v)==='수학의 정석';
const clone=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
function record(v){
 if(!v||!['none','unknown','progress','done'].includes(v.status))return null;
 const r={book:clean(v.book)||BOOKS[0],status:v.status};
 if(!isApplicationBook(r.book))return null;
 if(r.status==='progress'){
  const done=number(v.done),total=number(v.total);
  if(done!==null&&total!==null&&Number.isInteger(done)&&Number.isInteger(total)&&done>=0&&total>0&&total<=9999&&done<total){r.done=done;r.total=total;}
 }
 return r;
}
function restore(value){
 const state={version:1,subjects:{}};
 for(const stage of SUBJECTS){const r=record(value?.subjects?.[stage]);if(r)state.subjects[stage]=r;}
 const n=number(value?.deepMonths);if(n!==null&&n>=.5&&n<=24)state.deepMonths=n;
 return state;
}
function updateRecord(value,stage,input={}){
 const state=restore(value),errors=[];
 if(!SUBJECTS.includes(stage))errors.push('고등 과목을 다시 선택해 주세요.');
 if(!['none','unknown','progress','done'].includes(input.status))errors.push('유형 교재의 실제 진행 상태를 선택해 주세요.');
 const book=clean(input.book)||BOOKS[0];if(!isApplicationBook(book))errors.push('쎈 또는 RPM 유형 교재를 선택해 주세요.');
 if(input.status==='progress'&&(number(input.done)!==null||number(input.total)!==null||clean(input.done)||clean(input.total))){
  const done=number(input.done),total=number(input.total);
  if(done===null||total===null||!Number.isInteger(done)||!Number.isInteger(total)||done<0||total<=0||total>9999||done>=total)errors.push('완료 분량은 전체보다 작게 입력하세요. 전체 분량은 9999 이내이며, 모두 마쳤다면 완료를 선택해 주세요.');
 }
 if(errors.length)return{state,errors};
 state.subjects[stage]=record({...input,book});return{state,errors};
}
function fraction(actual){return actual?.done?1:Number.isFinite(actual?.fraction)?Math.max(0,Math.min(1,actual.fraction)):0;}
function application(stage,current,actualSchool,actualDeep,state){
 const saved=state.subjects[stage];
 if(saved)return{...saved,fraction:saved.status==='done'?1:saved.status==='progress'&&saved.total?saved.done/saved.total:0,source:'explicit'};
 const actual=[actualSchool,actualDeep].find(a=>a?.stage===stage&&isApplicationBook(a.book));
 if(actual)return{book:actual.book,status:actual.done?'done':'progress',fraction:fraction(actual),source:'reported-book'};
 return{book:BOOKS[0],status:current?'unknown':'planned',fraction:0,source:'planned'};
}
function clipped(block,limit){
 if(!Number.isFinite(block.start)||!Number.isFinite(block.end)||block.end<=block.start||block.start>=limit)return null;
 const result=clone(block);if(block.end>limit){result.unclippedEnd=block.end;result.end=limit;result.continues=true;result.endClipped=true;result.clipped=true;}return result;
}
function apply({schoolLane={},deepLane={},actualSchool=null,actualDeep=null,subjects=SUBJECTS,highStart=null,months=6,deepMonths=6,state:value,limit=Infinity}={}){
 const state=restore(value),warnings=[],readyAt={},school=clone(schoolLane),deep=clone(deepLane),list=subjects.filter(s=>SUBJECTS.includes(s));
 school.blocks=(school.blocks||[]).filter(b=>!SUBJECTS.includes(b.stage));
 const oldDeep=clone(deep.blocks||[]);deep.blocks=oldDeep.filter(b=>!SUBJECTS.includes(b.stage));
 const full=duration(months),depthFull=duration(state.deepMonths, duration(deepMonths)),horizon=Number.isFinite(limit)?Math.max(0,limit):Infinity;
 const schoolIndex=list.indexOf(actualSchool?.stage),deepIndex=list.indexOf(actualDeep?.stage);
 const applicationDepth=deepIndex>=0&&isApplicationBook(actualDeep.book),externalApplication=applicationDepth&&actualDeep.stage!==actualSchool?.stage;
 const externalApp=externalApplication?application(actualDeep.stage,true,actualSchool,actualDeep,state):null;
 const externalApplicationEnd=externalApplication?round(full*(1-externalApp.fraction)):null;
 const startsHigh=schoolIndex>=0,hasStart=Number.isFinite(highStart)&&highStart>=0;
 const startIndex=startsHigh?schoolIndex:hasStart?0:-1;
 let cursor=startsHigh?0:hasStart?highStart:0;
 if(startsHigh)for(let i=0;i<schoolIndex;i++)readyAt[list[i]]=0;
 if(startIndex>=0)for(let i=startIndex;i<list.length;i++){
  const stage=list[i],current=startsHigh&&i===schoolIndex,app=application(stage,current,actualSchool,actualDeep,state);
  // When the current reported book is itself a type workbook, its fraction
  // belongs to application; it must not be reused as a concept-book fraction.
  const conceptFraction=current?(isApplicationBook(actualSchool.book)?1:fraction(actualSchool)):0;
  const conceptRemaining=full*(1-conceptFraction),applicationRemaining=externalApplication&&actualDeep.stage===stage?Math.max(0,externalApplicationEnd-cursor):full*(1-app.fraction),remaining=Math.max(conceptRemaining,applicationRemaining);
  const end=round(cursor+remaining),applicationOnly=conceptFraction===1&&app.fraction<1;
  const conceptBook=current&&!isApplicationBook(actualSchool.book)?actualSchool.book:'기본정석';
  if(current&&app.status==='unknown')warnings.push(stage+'의 유형 교재 수행은 아직 확인하지 않았습니다. 개념 교재 완료만으로 쎈 완료를 판단하지 않고 전체 유형 학습 기간을 잡았습니다.');
  if(current&&isApplicationBook(actualSchool.book))warnings.push(stage+'는 현재 보고한 유형 교재에서 이어갑니다. 개념 교재의 이수 여부도 확인해 주세요. 유형 진도만으로 개념 숙달을 판정하지 않습니다.');
  if(current&&isLegacyJeongseok(actualSchool.book))warnings.push(stage+'의 기존 ‘수학의 정석’ 기록을 유지했습니다. 기본정석·실력정석 중 실제 판본을 확인해 주세요.');
  const b={id:'school-'+(19+SUBJECTS.indexOf(stage)),stage,type:'high',kind:'school',highPhase:'basic-types',title:stage+' '+(applicationOnly?app.book+' · 유형 보완':conceptBook+' + '+app.book),books:applicationOnly?[app.book]:[conceptBook,app.book],start:round(cursor),end,full,fraction:Math.min(conceptFraction,app.fraction),conceptFraction,applicationFraction:app.fraction,applicationStatus:app.status,applicationSource:app.source,applicationOnly,current,reported:current,guide:'high',source:'high-study',tasks:'기본정석의 개념·예제를 배우며 쎈 유형을 함께 풉니다. 유형 적용과 오답을 확인하고 다음 과목 선행과 이 과목 심화를 병행합니다.'};
  const visible=clipped(b,horizon);if(visible)school.blocks.push(visible);readyAt[stage]=end;cursor=end;
 }
 // A genuine reported depth course has its own remaining workload. A basic
 // book or an unresolved legacy title is retained as review, never relabelled
 // as evidence that depth has already been completed.
 const reviewDepth=deepIndex>=0&&!applicationDepth&&(isBasicBook(actualDeep.book)||isLegacyJeongseok(actualDeep.book));
 const reportedDepth=deepIndex>=0&&!applicationDepth&&!reviewDepth;
 let depthCursor=Math.max(0,...deep.blocks.map(b=>Number.isFinite(b.unclippedEnd)?b.unclippedEnd:Number.isFinite(b.end)?b.end:0));
 if(externalApplication){
  if(Number.isFinite(readyAt[actualDeep.stage]))readyAt[actualDeep.stage]=Math.max(readyAt[actualDeep.stage],externalApplicationEnd);
  if(externalApp.fraction<1){
   const b={id:'high-application-'+SUBJECTS.indexOf(actualDeep.stage),stage:actualDeep.stage,title:actualDeep.stage+' '+externalApp.book+' · 현재 유형 보완',books:[externalApp.book],kind:'deep',type:'high',highPhase:'application-review',start:0,end:externalApplicationEnd,full,fraction:externalApp.fraction,applicationFraction:externalApp.fraction,applicationStatus:externalApp.status,applicationSource:externalApp.source,current:true,reported:true,guide:'high',source:'reported-high-application',tasks:'다른 과목의 선행과 별개로 현재 보고한 유형 교재를 이어갑니다. 이 유형 학습을 마친 뒤 해당 과목의 심화를 시작합니다.'};
   const visible=clipped(b,horizon);if(visible)deep.blocks.push(visible);depthCursor=Math.max(depthCursor,externalApplicationEnd);
  }
 }
 if(reviewDepth){
  warnings.push(actualDeep.stage+'의 '+actualDeep.book+' 기록은 '+(isLegacyJeongseok(actualDeep.book)?'기본·실력 판본 확인이 필요해':'개념 교재이므로')+' 심화 완료로 판단하지 않습니다. 현재 기록을 보존했습니다.');
  if(!actualDeep.done){
   const existing=oldDeep.find(b=>b.stage===actualDeep.stage&&b.current),end=round(depthFull*(1-fraction(actualDeep))),legacy=isLegacyJeongseok(actualDeep.book);
   const b={...existing,id:'high-review-'+SUBJECTS.indexOf(actualDeep.stage),stage:actualDeep.stage,title:actualDeep.stage+' '+actualDeep.book+' · '+(legacy?'기본/실력 확인':'개념 보완'),books:[actualDeep.book],kind:'deep',type:'high',highPhase:'concept-review',needsDepthReview:true,start:0,end,full:depthFull,fraction:fraction(actualDeep),current:true,reported:true,guide:'high',source:'reported-high-review',tasks:'현재 교재·완료 분량을 보존합니다. 개념 보완과 실제 심화는 구분해 확인합니다.'};
   const visible=clipped(b,horizon);if(visible)deep.blocks.push(visible);depthCursor=Math.max(depthCursor,end);
  }
 }
 let firstDeep=reportedDepth?deepIndex:externalApplication&&Number.isFinite(readyAt[actualDeep.stage])&&(startIndex<0||deepIndex<startIndex)?deepIndex:startIndex;
 if(reportedDepth&&!actualDeep.done){
  const stage=actualDeep.stage,existing=oldDeep.find(b=>b.stage===stage&&b.current),end=round(depthFull*(1-fraction(actualDeep)));
  const b={...existing,id:'deep-'+(19+SUBJECTS.indexOf(stage)),stage,title:stage+' '+actualDeep.book,books:[actualDeep.book],kind:'deep',type:'high',highPhase:'deep',start:0,end,full:depthFull,fraction:fraction(actualDeep),current:true,reported:true,guide:'high',source:'reported-high-depth',tasks:existing?.tasks||'현재 심화 교재의 남은 분량을 이어갑니다. 풀이 설명과 오답 재해결을 확인합니다.'};
  const visible=clipped(b,horizon);if(visible)deep.blocks.push(visible);depthCursor=Math.max(depthCursor,end);firstDeep=deepIndex+1;
 }else if(reportedDepth&&actualDeep.done)firstDeep=deepIndex+1;
 if(firstDeep>=0)for(let i=firstDeep;i<list.length;i++){
  const stage=list[i],ready=readyAt[stage];
  if(!Number.isFinite(ready))break;
  const start=round(Math.max(depthCursor,ready)),end=round(start+depthFull);
  const b={id:'deep-'+(19+SUBJECTS.indexOf(stage)),stage,title:stage+' 심화 · 다음 과목 선행과 병행',books:['실력정석 · 수준에 맞는 심화 교재 선택'],kind:'deep',type:'high',highPhase:'deep',start,end,full:depthFull,fraction:0,current:false,proposed:true,guide:'high',source:'high-study',prerequisiteSchoolBlockId:'school-'+(19+SUBJECTS.indexOf(stage)),tasks:'이 과목의 기본·유형을 마친 뒤 실력정석 등 맞는 심화 교재를 선택합니다. 다음 과목의 기본정석·쎈과 병행하며 혼자 설명하는 풀이와 오답을 점검합니다.'};
  const visible=clipped(b,horizon);if(visible)deep.blocks.push(visible);depthCursor=end;
 }
 if(applicationDepth)warnings.push(actualDeep.stage+'의 '+actualDeep.book+' 진행은 유형 수행에 반영했습니다. 같은 공부를 심화 일정에 중복 배정하지 않습니다.');
 school.blocks.sort((a,b)=>a.start-b.start||a.end-b.end);deep.blocks.sort((a,b)=>a.start-b.start||a.end-b.end);
 return{schoolLane:school,deepLane:deep,readyAt,warnings,state};
}
g.PlannerHighStudy=Object.freeze({SUBJECTS,BOOKS,isApplicationBook,restore,updateRecord,apply});
})(window);
