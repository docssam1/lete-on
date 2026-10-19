import {academyContext} from './academy-reference.mjs';
import {trackOf,TRACKS} from './flow.mjs';
import {esc} from './intake.mjs';
import {RELATIONS,INTENTS,TRIGGERS} from './paths-v10.mjs';
import {parseCourseScope} from './recommendation-policy.mjs';
import {bookType} from './book-types.mjs';
import {personalSpeedComparison,personalSpeedMarkup} from './personal-speed.mjs';
import {completionText} from './progress-display.mjs';
import {academyExperienceMarkup} from './academy-experience.mjs';

// A source-relative comparison. This module never changes records or creates child calendar dates.
const clone=x=>structuredClone(x);
const normalized=x=>String(x||'').normalize('NFKC').toLowerCase().replace(/[\s|·<>()[\]{}]/g,'');
const knownProgress=new Set(['in_progress','reported_done','reviewed_done']);
const completed=new Set(['reported_done','reviewed_done']);
const progressLabels={unknown:'진행 상태 모름',in_progress:'진행 중',reported_done:'완료로 입력',reviewed_done:'범위 확인 완료',not_started:'미시작'};
const directionLabels={current:'지금 흐름 유지',faster:'진행 속도 비교',consolidate:'현재 범위 다지기',deepen:'심화 더하기'};
const targetLabels={soma:'소마 고려',fields:'필즈 고려',none:'학원 목표 없이',undecided:'학원 목표 미정'};
const timingLabels={source_reference:'원표 기간',approximate_reference:'원자료의 근사 구간',unconfirmed_timing:'시점 미확정·구조 참고',academic_year_structure:'학년 단위 구조 참고'};
const tracks=['thinking','application','depth','arithmetic','science','other'];

export function baselineScope(c){
 const scope=parseCourseScope(c);
 return {kind:scope.level,grade:scope.grade,term:scope.semester,key:scope.level==='unknown'?String(c.volume||''):`${scope.level==='middle'?'중':scope.level==='high'?'고':''}${scope.grade||''}${scope.semester?'-'+scope.semester:''}`,ambiguous:scope.ambiguous};
}
function sourceScope(b){
 const n=normalized(b.label);
 const scopes=[];
 for(const m of n.matchAll(/(?:중등|중학교|중)([1-3])[-－]([12])/g))scopes.push({kind:'middle',grade:Number(m[1]),term:Number(m[2])});
 if(!/중등|중학교|중[1-3]|중학/.test(n))for(const m of n.matchAll(/([1-6])[-－]([12])/g))scopes.push({kind:'elementary',grade:Number(m[1]),term:Number(m[2])});
 return scopes;
}
function bookFamily(c){
 return ({didimdol_s:'top_s',didimdol_top:'top',didimdol_application:'basic_application',didimdol_eungyong:'application',ssen:'ssen',ssen_middle:'ssen'})[bookType(c)?.id]||'';
}
function arithmeticRecord(c){
 const name=normalized(c.course),volume=normalized(c.volume);
 const series=/^(?:기적의)?계산법(?:(\d+)권?)?$/.exec(name)||/^더클셈(?:(\d+)권?)?$/.exec(name);
 if(series){
  const declared=series[1]||'',separate=/^(\d+)권?$/.exec(volume)?.[1]||'';
  if(volume&&!separate)return {ambiguous:true};
  if(declared&&separate&&Number(declared)!==Number(separate))return {ambiguous:true};
  return {family:name.startsWith('더클셈')?'deoclsem':'miracle',number:declared||separate,ambiguous:false};
 }
 const soma=/^소마셈([kp])?$/.exec(name);
 if(soma){
  if(volume&&!/^[kp]$/.test(volume))return {ambiguous:true};
  if(soma[1]&&volume&&soma[1]!==volume)return {ambiguous:true};
  return {family:'soma',letter:soma[1]||volume,ambiguous:false};
 }
 return {ambiguous:false};
}
function matchBlock(c,track,row,b){
 if(!b.label||!row.tracks.includes(track))return null;
 const name=normalized(c.course),scope=baselineScope(c),label=normalized(b.text||b.label),family=bookFamily(c);
 if(['application','depth'].includes(track)){
  if(scope.kind==='unknown'||scope.kind==='high')return null;
  const scopes=sourceScope(b);
  if(!scopes.some(x=>x.kind===scope.kind&&x.grade===scope.grade&&x.term===scope.term))return null;
  const isTop=/최상위/.test(label),isApplication=/응용|디기응/.test(label),isBasic=/기본/.test(label);
  // 최상위 S is a distinct recorded series. It is never converted into the source's 최상위.
  if(family==='top_s')return /최상위(?:수학)?s/.test(label)&&scopes.length===1?'exact_book_scope':null;
  if(family==='top')return isTop&&!/최상위(?:수학)?s/.test(label)&&scopes.length===1?'exact_book_scope':null;
  if(family==='basic_application'&&isBasic&&isApplication&&scopes.length===1)return 'exact_book_scope';
  if(track==='depth')return null;
  // Generic source stages can compare the same curriculum range, but do not replace a book record.
  if(scope.kind==='middle'&&!isTop)return scopes.length===1?'scope_reference':null;
  if(scope.kind==='elementary'&&isApplication&&!isTop)return scopes.length===1?'scope_reference':null;
  return null;
 }
 if(track==='arithmetic'){
  const record=arithmeticRecord(c);
  if(record.ambiguous)return null;
  if(record.family==='soma'&&record.letter)return label.includes('소마셈'+record.letter)?'exact_book_scope':null;
  if(record.family==='miracle'&&record.number){const m=/기적의계산법(\d+)권?/.exec(label);return m&&Number(m[1])===Number(record.number)?'exact_book_scope':null;}
  if(record.family==='deoclsem'&&record.number){const m=/더클셈(\d+)권?/.exec(label);return m&&Number(m[1])===Number(record.number)?'exact_book_scope':null;}
  return null;
 }
 if(track==='thinking'){
  let token=({'초등팩토':'초등팩토1','pre1031기본':'초등팩토1','pre1031심화':'필즈베이직'})[name]||name;
  if(['pre1031','1031','필즈','소마','cms',''].includes(token))return null;
  // A volume is required if the source divides the same series by book or upper/lower course.
  if(name==='초등팩토'&&c.volume&&normalized(c.volume)!=='1'&&normalized(c.volume)!=='1권')return null;
  if(name==='초등팩토1'&&c.volume&&!['1','1권'].includes(normalized(c.volume)))return null;
  if(/1031초급/.test(token))return label.includes('1031초급')?'exact_book_scope':null;
  if(/필즈초급|필즈중급/.test(token)){
   const side=/하|상/.exec(token+normalized(c.volume));if(!side)return null;
   token=token.replace(/[하상]$/,'')+side[0];
  }
  if(token.length>=4&&label.includes(token))return 'exact_book_scope';
  return null;
 }
 return null;
}
function sourceRef(section,row,b,kind){return {section:section.id,sectionUrl:section.url,sourcePath:section.sourcePath,sourceSha256:section.sha256,rowId:row.id,sourceTableIndex:row.sourceTableIndex,sourceRowIndex:row.sourceRowIndex,blockId:b.id,sourceCellIndex:b.sourceCellIndex,lane:row.group,category:row.category,laneNote:row.groupNote,categoryNote:row.categoryNote,label:b.label,note:b.note,start:b.start,end:b.end,span:b.span,startLabel:section.columns[b.start]?.label||'',endLabel:section.columns[b.end]?.label||'',timingQuality:b.timingQuality,matchKind:kind};}
function intentFor(s,c){
 const v=s.wizard?.v10||{};
 if(v.intents?.[c.id])return v.intents[c.id];
 if(c.status==='paused')return 'pause';
 if(c.status==='reduced')return 'reduce';
 if(c.status==='ended')return 'ended';
 if(c.completion==='not_started')return 'start_later';
 if(v.direction==='undecided')return 'undecided';
 return 'continue';
}
function recordBaseline(s,c,source){
 const q=s.wizard?.quick||{},track=trackOf(c),matches=[];
 const ambiguous=baselineScope(c).ambiguous||(track==='arithmetic'&&arithmeticRecord(c).ambiguous);
 for(const section of source.sections||[])for(const row of section.rows)for(const b of row.blocks){const kind=matchBlock(c,track,row,b);if(kind)matches.push(sourceRef(section,row,b,kind));}
 const lane=q.monthlyLanes?.[track]||'';
 const chosen=lane?matches.filter(m=>m.rowId===lane):matches;
 const model=q.level||'L1';
 chosen.sort((a,b)=>{
  const score=m=>(m.section==='S1'&&m.lane===model?60:0)+(m.matchKind==='exact_book_scope'?20:0)+(m.section===q.sourceSection?5:0);
  return score(b)-score(a)||a.section.localeCompare(b.section)||a.start-b.start;
 });
 const anchor=chosen[0]||null,intent=intentFor(s,c);
 const status=!anchor?'unknown':!knownProgress.has(c.completion)?'record_state_unconfirmed':anchor.matchKind==='exact_book_scope'?'matched':'reference_only';
 const nextStages=[];
 if(anchor&&knownProgress.has(c.completion)){
  const section=source.sections.find(x=>x.id===anchor.section),row=section.rows.find(x=>x.id===anchor.rowId);
  for(const b of row.blocks.filter(x=>x.start>anchor.end&&x.label)){
   if(q.target==='none'&&/프리미어|선발|입학/.test(b.label)&&track==='thinking')continue;
   nextStages.push({...sourceRef(section,row,b,'following_source_stage'),state:['pause','start_later','ended'].includes(intent)?'held_reference':'comparison_candidate',automaticStart:false});
  }
 }
 return {courseId:c.id,track,current:clone(c),scope:baselineScope(c),intent,status,anchor:anchor?clone(anchor):null,matches,selectedLane:lane||null,nextStages,position:anchor&&knownProgress.has(c.completion)?{kind:completed.has(c.completion)?'reported_end':'reported_within_block',sourceBlockStart:anchor.start,sourceBlockEnd:anchor.end,point:completed.has(c.completion)?anchor.end:null,mastery:null}:null,calendarDates:null,mastery:null,unresolved:ambiguous?['교재명과 권·학기 표기가 서로 달라요. 현재 기록을 유지하고 각 범위를 나누어 확인해요.']:!anchor?[lane?'선택한 원표 행에서 이 교재·범위를 확인하지 못했어요. 다른 기준을 비교하거나 현재 기록을 유지해요.':'이 교재·범위에 맞는 원표 월별 근거를 확인해야 해요.']:!knownProgress.has(c.completion)?['교재는 찾았지만 실제 진행 상태를 먼저 확인해야 해요.']:anchor.matchKind==='scope_reference'?['같은 학습 범위의 비교이며 교재별 학습량·기간은 확인하지 않았어요.']:[]};
}
function fallbackSource(data){
 if(!data?.models||!data?.columns)return {sections:[]};
 return {version:1,source:data.source,ramp:{firstMonths:2,firstRate:1.1,subsequentRate:1.2},sections:[{id:'S1',url:'reference/roadmap/index.html',sourcePath:data.source?.file||'roadmap/index.html',sha256:data.source?.sha256,monthCount:27,columns:data.columns.map((x,index)=>({index,label:`${x.age}세 ${x.month}월`})),rows:data.models.flatMap(m=>Object.entries(m.rows).map(([key,blocks],i)=>({id:`S1:${m.id}:${key}`,sourceTableIndex:0,sourceRowIndex:null,group:m.id,groupNote:m.summary||'',category:key,categoryNote:'',tracks:({school:['application','depth'],thinking1:['thinking'],calc:['arithmetic']})[key]||[],blocks:blocks.filter(b=>b.start>=0&&b.end<27).map((b,j)=>({...b,id:`S1:${m.id}:${key}:${j}`,sourceCellIndex:j,span:b.end-b.start+1,timingQuality:'source_reference'}))}))) }]};
}

export function personalBaseline(s,data={}){
 const source=data.sourceMonthly||fallbackSource(data),q=s.wizard?.quick||{},v=s.wizard?.v10||{},lastPlan=s.plans?.at(-1);
 const records=(s.courses||[]).map(c=>recordBaseline(s,c,source));
 const axes=tracks.map(track=>({track,label:TRACKS[track]?.label||track,records:records.filter(r=>r.track===track),status:s.wizard?.axisStatus?.[track]||'unknown'})).filter(x=>['thinking','application','depth','arithmetic'].includes(x.track)||x.records.length);
 const monthlyRows=[];
 for(const record of records){
  if(!record.anchor||!knownProgress.has(record.current.completion))continue;
  const anchor=record.anchor,section=source.sections.find(x=>x.id===anchor.section),row=section.rows.find(x=>x.id===anchor.rowId);
  const blocks=[anchor,...record.nextStages];
  for(let index=anchor.start;index<section.monthCount;index++){
   const stage=blocks.find(b=>index>=b.start&&index<=b.end);
   monthlyRows.push({courseId:record.courseId,track:record.track,relativeMonth:index-anchor.start+1,origin:'source_block_start',sourceMonthIndex:index,sourceMonth:section.columns[index]?.label||'',section:section.id,rowId:row.id,sourceStage:stage?.label||'',sourceBlockId:stage?.blockId||null,state:index<=anchor.end?'current_source_interval':stage?'following_source_candidate':'source_gap',timingQuality:stage?.timingQuality||'source_gap',intent:record.intent,calendarDate:null,mastery:null});
  }
 }
 const relations=clone(v.relations?.length?v.relations:lastPlan?.courseRelations||[]).map(r=>({...r,automaticJoin:false,monthlyJoinDate:null,sourceRecords:(r.sourceCourseIds||[]).map(id=>records.find(x=>x.courseId===id)).filter(Boolean).map(x=>({courseId:x.courseId,scope:clone(x.scope),intent:x.intent,status:x.status}))}));
 const plannedCourses=clone(v.plannedCourses?.length?v.plannedCourses:lastPlan?.plannedCourseSnapshots||[]).map(p=>({...p,calendarDate:null,automaticStart:false,sourceRole:p.sourceRole||'family_wish'}));
 return {version:1,kind:'personal_source_relative_baseline_first_stage',source:{...clone(source.source||{}),sections:(source.sections||[]).map(x=>({section:x.id,monthCount:x.monthCount,sha256:x.sha256,sourcePath:x.sourcePath})),ramp:clone(source.ramp||{}),comparisonLevel:q.level||'L1'},speedComparison:q.learningDirection==='faster'?personalSpeedComparison(s,{records},source):null,axes,records,monthlyRows,route:{academy:academyContext(s),direction:q.learningDirection||'current',target:q.target||'',goals:clone(s.goals||{}),interests:clone(s.wizard?.interests||[]),relations,plannedCourses,automaticJoin:false},calendarDates:null,mastery:null,limitations:['월은 원표 구간의 상대 비교입니다. 개인 시작일·완료일은 계산하지 않았어요.','진행 중은 해당 교재 구간 안의 기록이며 단원 숙달률로 바꾸지 않았어요.','원표의 다음 교재는 비교 후보입니다. 응용·심화는 별도 범위로 선택하고 바꿀 수 있어요.','합류·재개는 저장한 조건을 확인한 뒤 다시 선택합니다. 자동 실행하지 않아요.']};
}
function rangeLabel(x){return x.startLabel===x.endLabel?x.startLabel:`${x.startLabel}~${x.endLabel}`;}
function courseLabel(c){return [c.course||c.name,c.volume||c.scope].filter(Boolean).join(' ');}
function sectionLabel(id){return {S1:'5~7세 과정',S2:'7세~초2 과정',S3:'초3~초6 과정',S4:'중등 과정'}[id]||'표준 과정';}
function readableSourceLabel(value){return String(value||'').replace(/\(20\d{2}\s+(?:S1반|2학년)\)/g,'').split(/[|/]/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean).join(' · ').replace(/섹션\s*([1-4])/g,(_,n)=>sectionLabel('S'+n));}
function referenceTitle(x,data={}){
 const model=x.section==='S1'?(data.models||[]).find(m=>m.id===x.lane):null;
 const lane=/^L\d+$/.test(x.lane||'')?readableSourceLabel(model?.summary||x.laneNote)||'표준 비교 기준':readableSourceLabel(x.lane);
 const rawCategory=String(x.category||'').trim();
 const category=/^L\d+(?:\s*\([^)]*\))?$/.test(rawCategory)?readableSourceLabel(x.categoryNote).split(' · ')[0]||'표준 비교 기준':readableSourceLabel(rawCategory).replace(/\s*\(L\d+\)/g,'');
 return [...new Set([sectionLabel(x.section),lane,category].filter(Boolean))].join(' · ');
}
function unboundDefaultRelation(r,s){
 // Only the accepted generated template is softened in this view. A directly
 // saved relation (even with this reserved id), target or condition stays visible.
 if(r.id!=='primary-direction'||r.kind!=='R01'||s.wizard?.v10?.relations?.some(x=>x.id===r.id))return false;
 const plan=s.plans?.at(-1),original=plan?.courseRelations?.find(x=>x.id===r.id);
 if(plan?.versionContract!==10||plan?.progression?.kind!=='per_course_relations'||!original)return false;
 if(original.status!=='family_selected'||original.reviewTrigger!=='family_review'||original.automaticJoin!==false)return false;
 if(JSON.stringify(original.sourceIds)!==JSON.stringify(['UF03','F01','F21','F25']))return false;
 if(!Array.isArray(original.sourceCourseIds)||!Array.isArray(original.targetPlannedCourseIds)||!Array.isArray(original.scopeSnapshots))return false;
 return !original.sourceCourseIds.length&&!original.targetPlannedCourseIds.length&&!original.scopeSnapshots.length&&!String(original.condition||'').trim()&&!original.conditionEvidenceIds?.length&&!original.conditionEvidenceSnapshots?.length;
}
function routeMarkup(b,s){
 const route=b.route,relations=route.relations.filter(r=>!unboundDefaultRelation(r,s)),planned=route.plannedCourses;
 const deferredDefault=relations.length<route.relations.length?'<p class="note" data-baseline-unbound-default>교과·심화의 연결 범위가 없어 기본·응용 연결은 아직 표시하지 않아요.</p>':'';
 return `<aside class="baseline-route"><h3>선택한 흐름</h3><p>${esc(directionLabels[route.direction]||route.direction)}${route.target?' · '+esc(targetLabels[route.target]||route.target):''}</p><p>기록한 교과·심화·사고력·연산을 각각 비교합니다. 서로 다른 범위를 함께 공부해도 한 축의 기록으로 합치지 않아요.</p>${deferredDefault}${relations.length?`<ul>${relations.map(r=>`<li data-baseline-relation="${esc(r.id)}"><strong>${esc(RELATIONS[r.kind]||r.kind)}</strong> · ${esc(r.sourceRecords.map(x=>courseLabel(b.records.find(y=>y.courseId===x.courseId)?.current||{})).join(' / ')||'연결 범위 확인 필요')}${r.condition?`<span>조건 · ${esc(r.condition)}</span>`:''}<span>다시 볼 때 · ${esc(TRIGGERS[r.reviewTrigger]||'가족이 다시 선택할 때')}</span></li>`).join('')}</ul>`:''}${planned.length?`<p><strong>나중 추가로 남긴 과정</strong> · ${planned.map(p=>esc(courseLabel(p))).join(' / ')}</p>`:''}${route.interests.length?'<p class="note">선택한 학원·영재원·과학 등의 목표는 따로 보관합니다. 합류 시점과 현재 지원 조건은 필요한 근거를 확인한 뒤 정해요.</p>':''}</aside>`;
}
function recordMarkup(r,data){
 const c=r.current,anchor=r.anchor;
 const intent=INTENTS[r.intent]||(r.intent==='ended'?'종료 기록':'계속하기');
 const current=`<strong>${esc(courseLabel(c))}</strong><span>${esc(completionText(c,{completed:'완료로 입력'}))}${c.range?' · '+esc(c.range):''} · ${esc(intent)}</span>`;
 if(!anchor)return `<li class="baseline-record is-unmatched">${current}<p>${esc(r.unresolved[0])}</p></li>`;
 const period=anchor.section==='S1'?'표준표에서 이 교재가 놓인 시기':'원표에서 이 교재가 놓인 시기';
 const sourceAgeNote=anchor.section==='S1'?'<p class="note">5~7세 유아 표준 시기입니다. 아이의 현재 나이나 개인 일정이 아닙니다.</p>':'';
 return `<li class="baseline-record">${current}<p>원표 비교 · ${esc(referenceTitle(anchor,data))}<br>${esc(anchor.label)}<br>${period} · ${esc(rangeLabel(anchor))}</p>${sourceAgeNote}<small>${esc(timingLabels[anchor.timingQuality]||'원자료 비교')}${anchor.matchKind==='scope_reference'?' · 같은 범위 비교, 교재별 기간 미확인':''}</small>${r.unresolved.map(x=>`<p class="note">${esc(x)}</p>`).join('')}${r.nextStages.length?`<p>원표에서 이어지는 후보 · ${r.nextStages.slice(0,2).map(x=>esc(x.label)).join(' → ')}</p>`:''}${['pause','start_later','ended'].includes(r.intent)?'<p class="note">현재 쉬거나 나중 시작할 선택을 남겼어요. 다음 구간은 시작일을 정하지 않은 참고입니다.</p>':''}</li>`;
}
function emptyAxisMarkup(axis,s,hasAcademy){
 const w=s.wizard||{},choice=w.quick?.scene?.choices?.[axis.track];
 const experience=axis.track==='thinking'?w.thinkingExperience:'';
 let state,source;
 if(['unknown','not_started'].includes(choice)){state=choice;source='scene_choice';}
 else if(choice){state='unentered';source='scene_choice';}
 else if(['unknown','not_started'].includes(experience)){state=experience;source='thinking_experience';}
 else if(['books','academy','both'].includes(experience)){state='unentered';source='thinking_experience';}
 else if(w.axisStatus?.[axis.track]==='not_started'){state='not_started';source='axis_status';}
 else if(w.axisStatus?.[axis.track]==='unknown'){state='unconfirmed';source='legacy_axis_status';}
 else {state='unentered';source='unrecorded';}
 const subject=hasAcademy?'별도 사고력 교재':axis.label;
 const topic=subject+(hasAcademy||axis.track==='depth'?'는':'은');
 const text=state==='not_started'?`${topic} 아직 따로 하지 않았어요.`:state==='unknown'?`${topic} 잘 모르겠다고 답했어요.`:state==='unconfirmed'?`${topic} 이전 기록의 입력 여부를 확인하지 못했어요.`:`${topic} 아직 입력하지 않았어요.`;
 const note=hasAcademy?'학원 경험으로 교재 진도나 학습 월 계획을 만들지 않습니다.':'다른 축의 진도나 완료로 채우지 않습니다.';
 return `<p class="note" data-baseline-input-state="${state}" data-baseline-input-source="${source}">${esc(text)} ${note}</p>`;
}
function axisMarkup(axis,b,s,data){
 const options=new Map();for(const r of axis.records)for(const m of r.matches)options.set(m.rowId,referenceTitle(m,data));
 const selected=axis.records.find(r=>r.selectedLane)?.selectedLane||'';
 const choice=options.size>1?`<label class="field baseline-lane"><span>${esc(axis.label)}의 원표 비교 기준</span><select name="baselineLane:${esc(axis.track)}"><option value="" ${selected?'':'selected'}>기존 기준으로 후보 비교</option>${[...options].map(([id,label])=>`<option value="${esc(id)}" ${selected===id?'selected':''}>${esc(label)}</option>`).join('')}</select></label>`:'';
 const academies=axis.track==='thinking'&&Array.isArray(s.wizard?.academies)?s.wizard.academies:[];
 const academyExperience=academyExperienceMarkup(academies,{intro:false,topics:false});
 const empty=emptyAxisMarkup(axis,s,academies.length>0);
 const rows=b.monthlyRows.filter(x=>x.track===axis.track);
 const sourceAgeNote=rows.some(x=>x.section==='S1')?'<p class="note">5~7세 유아 표준 시기를 표시한 원표입니다. 아이의 실제 나이에 맞춘 개인 일정이 아닙니다.</p>':'';
 const monthly=rows.length?`<details class="baseline-months"><summary>${esc(axis.label)} 월별 비교 펼치기</summary><p class="note">각 교재의 원표 구간 시작을 기준으로 센 월입니다. 축마다 기준이 다르며 개인 달력 날짜가 아닙니다.</p>${sourceAgeNote}<div class="baseline-table-scroll" tabindex="0" role="region" aria-label="${esc(axis.label)} 원표 상대 월별 비교"><table class="baseline-month-table"><caption>${esc(axis.label)} · 현재 기록과 원표 월별 후보</caption><thead><tr><th scope="col">현재 교재</th><th scope="col">상대 월</th><th scope="col">표준표 시기</th><th scope="col">원표 과정</th><th scope="col">구분</th></tr></thead><tbody>${rows.map(x=>`<tr><th scope="row">${esc(courseLabel(b.records.find(r=>r.courseId===x.courseId)?.current||{}))}</th><td>${x.relativeMonth}개월째</td><td>${esc(x.sourceMonth)}</td><td>${esc(x.sourceStage||'원표 빈 구간')}</td><td>${esc(x.state==='current_source_interval'?'현재 기록의 비교 구간':x.state==='following_source_candidate'?'다음 후보':'구간 미기재')}${x.timingQuality!=='source_reference'?' · '+esc(timingLabels[x.timingQuality]||''):''}</td></tr>`).join('')}</tbody></table></div></details>`:'';
 return `<section class="baseline-axis" data-baseline-track="${esc(axis.track)}"><h3>${esc(axis.label)}</h3>${academyExperience}${axis.records.length?`<ul class="baseline-records">${axis.records.map(r=>recordMarkup(r,data)).join('')}</ul>`:empty}${choice}${monthly}</section>`;
}
export function personalBaselineMarkup(s,data={}){
 const b=personalBaseline(s,data);
 return `<section class="personal-baseline" aria-labelledby="personal-baseline-title"><p class="eyebrow">우리 아이의 기록으로 비교하기</p><h2 id="personal-baseline-title">축별 월별 기준선 · 첫 단계</h2><p class="lead-note">현재 교재·범위는 그대로 두고, 찾을 수 있는 원표 구간과 다음 후보를 연결했어요. 개인 달력 일정은 아직 정하지 않았습니다.</p>${routeMarkup(b,s)}<div class="baseline-axes">${b.axes.map(x=>axisMarkup(x,b,s,data)).join('')}</div>${personalSpeedMarkup(s,b,data.sourceMonthly||fallbackSource(data))}<details class="baseline-evidence"><summary>비교 기준과 아직 확인할 내용</summary><ul>${b.limitations.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>원표 월축 · ${b.source.sections.map(x=>`${esc(sectionLabel(x.section))} ${x.monthCount}칸`).join(' · ')}. 원표의 기간과 처음 2개월 1.10배·이후 1.20배 증속 모델은 보존하며, 아이에게 자동 적용하지 않아요.</p><p>중등 과정 수학의 CMS 자료는 학년 단위 구조입니다. 시점 미확정·근사 구간과 현재 학습 기록을 구분해서 읽어요.</p><div class="section-links">${b.source.sections.map(x=>`<a href="reference/display/${esc(x.section)}.html" target="_blank" rel="noopener">${esc(sectionLabel(x.section))} 원표 보기 ↗</a>`).join('')}</div></details></section>`;
}
