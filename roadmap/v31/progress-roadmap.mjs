import {personalBaseline} from './personal-baseline.mjs';
import {completionText} from './progress-display.mjs';
import {esc} from './intake.mjs';
import {academyRecordMarkup} from './academy-experience.mjs';

const tracks=['application','depth','thinking','arithmetic'];
const names={application:'교과',depth:'심화',thinking:'사고력',arithmetic:'연산'};
const sections={S1:'유아 표준 과정',S2:'초등 초기 과정',S3:'초등 과정',S4:'중등 이후 과정'};
const sourceUrl=id=>/^S[1-4]$/.test(id||'')?`reference/display/${id}.html`:'';

function publicLabel(data,blockId){
 const item=data.sourcePublicLabels?.blockLabels?.[blockId];
 const value=typeof item==='string'?item:item?.label;
 return typeof value==='string'&&value.trim()?value.trim():'원표에서 범위 확인';
}
function sourceRole(label){
 if(/(?:선발|시험)\s*없음/.test(label))return 'source_annotation';
 if(/선발\s*준비|(?:프리미어|PREMIER|소마|필즈|황소).*(?:준비|대비)|프리미어\s*학습\s*집중|필즈\s*STEP|PREMIER\s*(?:BASE|CORE|DRILL|실전|특강|FINAL)/i.test(label))return 'goal_preparation';
 if(/선발|입반\s*시험|입학|(?:교육청|대학부설|영재원|가천).*(?:지원|접수)|(?:^|[\s·])(?:지원|접수|모집)(?:$|[\s·(])|(?:^|[\s·])시험(?:$|[\s·(])/.test(label)&&!/시험\s*대비/.test(label))return 'selection_event';
 return 'learning_reference';
}
function goalReferenceAllowed(stage,s){
 const q=s.wizard?.quick||{},premier=s.goals?.premier;
 if(q.target==='none')return false;
 if(/프리미어|PREMIER|소마/i.test(stage.label))return premier!=='none'&&(['consider','current','later'].includes(premier)||q.target==='soma');
 if(/필즈\s*STEP|필즈.*(?:선발|준비|대비)|S-TOPCLASS/i.test(stage.label))return q.target==='fields';
 return stage.role!=='goal_preparation';
}
function sourceFor(section,row,block,data,kind){
 const label=publicLabel(data,block.id);
 return {sourceId:section.id,section:section.id,rowId:row.id,blockId:block.id,sourcePath:section.sourcePath||'',sourceSha256:section.sha256||'',sourceDate:data.sourceMonthly?.source?.sourceDate||'',sourceTableIndex:row.sourceTableIndex,sourceRowIndex:row.sourceRowIndex,sourceCellIndex:block.sourceCellIndex,rowTracks:[...(row.tracks||[])],span:block.span,timingQuality:block.timingQuality||'unconfirmed_timing',matchKind:kind,referenceUrl:sourceUrl(section.id),label,role:sourceRole(label+'\n'+String(block.label||'')),countsAsLearningProgress:false};
}
function sourceSequence(record,data,s){
 const anchor=record.anchor,source=data.sourceMonthly;
 if(!anchor||!source?.sections)return {anchor:null,next:[],events:[],preparations:[],annotations:[]};
 const section=source.sections.find(x=>x.id===anchor.section),row=section?.rows?.find(x=>x.id===anchor.rowId),block=row?.blocks?.find(x=>x.id===anchor.blockId);
 if(!section||!row||!block)return {anchor:null,next:[],events:[],preparations:[],annotations:[]};
 const current=sourceFor(section,row,block,data,anchor.matchKind);
 // Source order is a comparison even when recorded completion is unknown.
 // Read only this existing row, preserving original spans and no child dates.
 const following=row.blocks.filter(x=>Number.isFinite(x.start)&&x.start>block.end&&x.id!==block.id&&String(x.label||'').trim()).map(x=>sourceFor(section,row,x,data,'following_source_stage'));
 const next=following.filter(x=>x.role==='learning_reference').slice(0,2);
 const events=following.filter(x=>x.role==='selection_event'&&goalReferenceAllowed(x,s)).slice(0,3);
 const preparations=following.filter(x=>x.role==='goal_preparation'&&goalReferenceAllowed(x,s)).slice(0,2);
 const annotations=following.filter(x=>x.role==='source_annotation').slice(0,2);
 return {anchor:current,next,events,preparations,annotations};
}
function emptyState(s,track){
 const w=s.wizard||{},choice=w.quick?.scene?.choices?.[track];
 if(['unknown','not_started'].includes(choice))return choice;
 if(w.axisStatus?.[track]==='not_started')return 'not_started';
 if(w.axisStatus?.[track]==='unknown')return 'unknown';
 return 'unentered';
}
function sourceChoice(record,match,data,index){
 return {rowId:match.rowId,sourceId:match.section,label:`${sections[match.section]||'원표 비교'} · ${publicLabel(data,match.blockId)}${index?` · 비교 ${index+1}`:''}`};
}

// A display-only model. It never accepts a plan, changes progress or generates dates.
export function buildProgressRoadmap(s,data={}){
 const baseline=personalBaseline(s,data);
 const lanes=tracks.map(track=>{
  const records=baseline.records.filter(r=>r.track===track).map(record=>{
   const sequence=sourceSequence(record,data,s),c=record.current;
   const current={id:record.courseId,kind:'recorded_current',name:String(c.course||c.name||'교재 이름 미입력'),scope:String(c.volume||''),label:[c.course||c.name,c.volume].filter(Boolean).join(' '),progress:completionText(c),completion:c.completion||'unknown',completionInput:c.completionInput||'unentered',sourceRole:c.sourceRole||'parent_report',calendarDate:null,mastery:null};
   const next=sequence.next.map((stage,i)=>({id:stage.blockId,kind:'source_comparison',label:stage.label,order:i+1,source:stage,automaticStart:false,calendarDate:null,mastery:null}));
   if(!next.length)next.push({id:`${record.courseId}:unconfirmed`,kind:'unconfirmed',label:'다음 범위는 자료 확인이 필요해요',order:1,source:null,automaticStart:false,calendarDate:null,mastery:null});
   return {courseId:record.courseId,track,current,next,events:sequence.events,preparations:sequence.preparations,annotations:sequence.annotations,source:sequence.anchor,mixedSourceAxes:sequence.anchor?.rowTracks.includes('application')&&sequence.anchor?.rowTracks.includes('depth')||false,selectedLane:record.selectedLane||null,referenceOnly:true,intent:record.intent,sourceMatchKind:sequence.anchor?.matchKind||null,bookPeriodStatus:sequence.anchor?.matchKind==='scope_reference'?'unconfirmed_for_recorded_book':'source_reference_only',alternativeChoices:record.matches.map((m,i)=>sourceChoice(record,m,data,i)),calendarDates:null,mastery:null};
  });
  const options=new Map();for(const record of records)for(const option of record.alternativeChoices)if(!options.has(option.rowId))options.set(option.rowId,option);
  return {track,label:names[track],records,emptyState:records.length?'':emptyState(s,track),selectedLane:s.wizard?.quick?.monthlyLanes?.[track]||'',sourceChoices:[...options.values()]};
 });
 const academies=(s.wizard?.academies||[]).map(a=>({id:a.id||'',institution:String(a.institution||''),level:String(a.level||''),status:a.status,timingReported:a.timingReported,sourceRole:'parent_report',isCourse:false,calendarDate:null}));
 return {version:1,kind:'recorded_progress_and_source_sequence_view',title:'앞으로 이어갈 진도',lanes,academies,comparisonLevel:s.wizard?.quick?.level||'L1',referenceOnly:true,automaticApply:false,automaticPromotion:false,calendarDates:null,mastery:null};
}

function recordMarkup(record,{evidence=false}={}){
 const scopeToken=['application','depth'].includes(record.track)&&/^(?:(?:초등|중등|고등)\s*)?[1-6]-[12]$/.test(record.current.scope);
 const nodes=[{kind:'recorded_current',label:record.current.label,name:record.current.name,scope:record.current.scope,scopeToken,caption:'입력한 진도',progress:record.current.progress},...record.next.map(x=>({...x,caption:x.kind==='unconfirmed'?'확인할 다음 범위':x.order===1?'다음 비교 과정':'그다음 비교 과정'}))];
 const source=record.source,scopeNote=record.sourceMatchKind==='scope_reference'?'<p class="progress-roadmap-note">같은 학습 범위의 비교예요. 이 교재의 기간은 확인하지 않았어요.</p>':'';
 const mixedNote=record.mixedSourceAxes?'<p class="progress-roadmap-note">교과·심화가 함께 담긴 원표의 순서예요. 입력한 두 진도는 따로 유지해요.</p>':'';
 const referenceEvents=record.events.length||record.preparations.length||record.annotations.length?`<div class="progress-roadmap-events">${record.preparations.map(x=>`<p data-progress-reference-kind="preparation">준비 참고 · ${esc(x.label)}</p>`).join('')}${record.events.map(x=>`<p data-progress-reference-kind="selection_event">선발·지원 참고 · ${esc(x.label)}</p>`).join('')}${record.annotations.map(x=>`<p data-progress-reference-kind="annotation">원표 안내 · ${esc(x.label)}</p>`).join('')}<p>사용자 제공 원표 정보예요. 최신 공식 일정 확인 결과는 아니며, 학습 진도·성취율에 합산하지 않아요.</p></div>`:'';
 const sourcePeriod=x=>x.span===undefined?'':x.timingQuality==='source_reference'?`원표 ${x.span}개월 구간`:x.timingQuality==='approximate_reference'?`원자료 약 ${x.span}개월 구간`:x.timingQuality==='academic_year_structure'?`원표 ${x.span}칸 · 학년 단위 구조`:`원표 ${x.span}칸 · 시점 미확정`;
 const sourceYear=/^(\d{4})-/.exec(source?.sourceDate||'')?.[1];
 const details=source?`<div class="progress-roadmap-source"><p>${esc(sections[source.section]||'원표')}의 비교입니다. ${sourceYear?`자료 정리 기준: ${esc(sourceYear)}년. `:''}아이의 개인 일정이 아니에요.</p><ul>${[source,...record.next.map(x=>x.source).filter(Boolean)].map(x=>`<li><span>${esc(x.label)}</span>${x.span!==undefined?`<small>${esc(sourcePeriod(x))}</small>`:''}</li>`).join('')}</ul>${source.referenceUrl?`<a href="${source.referenceUrl}" target="_blank" rel="noopener noreferrer">원표에서 크게 보기 ↗</a>`:''}</div>`:'';
 if(evidence)return `<div class="progress-roadmap-record-evidence">${scopeNote}${mixedNote}${['pause','start_later','ended'].includes(record.intent)?'<p class="progress-roadmap-note">보류·중단 선택이 있는 기록이에요. 다음 과정은 비교로만 표시해요.</p>':''}${referenceEvents}${details}</div>`;
 const tag=record.sourceMatchKind==='scope_reference'?'<p class="progress-roadmap-reference-tag">같은 범위 원표 비교 · 교재별 기간 미확인</p>':'';
 return `<div class="progress-roadmap-record" data-progress-course="${esc(record.courseId)}" data-progress-match-kind="${esc(record.sourceMatchKind||'unmapped')}"><ol class="progress-roadmap-nodes" style="--progress-node-count:${nodes.length}">${nodes.map((node,i)=>`<li class="progress-roadmap-node ${i===0?'is-current':node.kind==='unconfirmed'?'is-unconfirmed':'is-comparison'}" data-progress-node="${esc(node.kind)}"${node.source?.blockId?` data-source-block="${esc(node.source.blockId)}"`:''}><span class="progress-roadmap-point" aria-hidden="true"></span><span class="progress-roadmap-caption">${node.caption}</span><strong>${i===0?`<span class="progress-roadmap-book-name">${esc(node.name)}</span>${node.scope?`<span class="progress-roadmap-current-scope${node.scopeToken?' is-curriculum-range':''}">${esc(node.scope)}</span>`:''}`:esc(node.label)}</strong>${node.progress?`<small>${esc(node.progress)}</small>`:''}</li>`).join('')}</ol>${tag}</div>`;
}
function laneMarkup(lane){
 const empty={unentered:'아직 입력하지 않았어요.',not_started:'아직 따로 하지 않았어요.',unknown:'잘 모르겠다고 답했어요.'}[lane.emptyState]||'아직 입력하지 않았어요.';
 const choice=lane.sourceChoices.length>1?`<div class="progress-roadmap-alternatives"><label><span class="sr-only">${lane.label}의 원표 비교 기준</span><select name="progressLane:${lane.track}"><option value="" ${lane.selectedLane?'':'selected'}>기존 비교 기준 유지</option>${lane.sourceChoices.map(x=>`<option value="${esc(x.rowId)}" ${lane.selectedLane===x.rowId?'selected':''}>${esc(x.label)}</option>`).join('')}</select></label><p>선택한 자료의 경로만 비교합니다. 아이의 일정에 적용하지 않아요.</p></div>`:'';
 const evidence=lane.records.some(r=>r.source)||choice?`<details class="progress-roadmap-evidence"><summary>표준 경로·근거 보기</summary>${lane.records.map(r=>recordMarkup(r,{evidence:true})).join('')}${choice}</details>`:'';
 return `<section class="progress-roadmap-lane${lane.records.length?'':' is-empty'}" data-progress-lane="${lane.track}"><h3>${lane.label}</h3>${lane.records.length?lane.records.map(r=>recordMarkup(r)).join(''):`<p class="progress-roadmap-empty" data-progress-input-state="${lane.emptyState}">${empty}</p>`}${evidence}</section>`;
}
export function progressRoadmapMarkup(s,data={}){
 const model=buildProgressRoadmap(s,data),academy=model.academies.length?`<p class="progress-roadmap-academy"><span>학원 경험</span> ${model.academies.map(academyRecordMarkup).join(' / ')}</p>`:'';
 return `<section class="progress-roadmap" data-progress-roadmap aria-labelledby="progress-roadmap-title"><h2 id="progress-roadmap-title">${model.title}</h2><p class="progress-roadmap-intro">입력한 진도에서 표준 과정의 다음 순서를 비교해요.</p>${academy}<div class="progress-roadmap-lanes">${model.lanes.map(laneMarkup).join('')}</div><p class="progress-roadmap-limit">다음 과정은 자료 비교예요. 시작일·완료일이나 합격을 정한 계획이 아니에요.</p></section>`;
}
