import {esc} from './intake.mjs';
import {comparisonBasis,comparisonConfirmed,confirmationKeys,resetComparison,synchronizeComparison} from './comparison-guard.mjs';
import {rampT} from './engine.mjs';
const clone=x=>structuredClone(x);
const blockedLabel=/권장|추천|대비\s*시작|병행\s*안내|선발|응시|경시\s*대비|올림피아드|입학|등록|합격/;
const confirmations=['identityConfirmed','scopeConfirmed','editionConfirmed','notStarted'];
export function sourceRampTime(work,ramp){
 if(!ramp||ramp.firstMonths!==2||ramp.firstRate!==1.1||ramp.subsequentRate!==1.2)throw Error('확정된 증속 근거를 확인해 주세요.');
 return rampT(work);
}
export function comparisonMonth(start,offset){
 if(!start)return null;
 if(!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(start)||Number(start.slice(0,4))<1)throw Error('비교 시작 연월을 확인해 주세요.');
 const [y,m]=start.split('-').map(Number),n=y*12+m-1+offset,year=Math.floor(n/12);
 if(year>9999||year<1)throw Error('비교 연월 범위를 확인해 주세요.');
 return `${String(year).padStart(4,'0')}-${String(n%12+1).padStart(2,'0')}`;
}
export function collectPersonalSpeed(s,d,editedField=''){
 if(!d.has('speed:startMonth'))return;
 const old=s.wizard.quick.speedComparison||{};
 const c=s.wizard.quick.speedComparison={...old,startMonth:String(d.get('speed:startMonth')||''),selectedSteps:d.getAll('speed:step'),...Object.fromEntries(confirmations.map(k=>[k,editedField==='speed:'+k?d.has('speed:'+k):old[k]===true]))};
 const basis=comparisonBasis(s),changed=!!old.observedBasis&&old.observedBasis!==basis;
 if(changed)resetComparison(c);
 c.observedBasis=basis;
 if(!changed&&confirmationKeys.some(k=>editedField==='speed:'+k)&&confirmations.every(k=>c[k]===true)){c.confirmedBasis=basis;delete c.invalidatedReason;}
 synchronizeComparison(s);
}
export function speedOptions(b,source){
 return b.records.flatMap(r=>{
  if(!['thinking','application','depth','arithmetic'].includes(r.track)||!r.anchor||r.scope.ambiguous||['pause','ended','reduce','undecided'].includes(r.intent)||!['in_progress','reported_done','reviewed_done','not_started'].includes(r.current.completion))return [];
  const section=source.sections.find(x=>x.id===r.anchor.section),row=section?.rows.find(x=>x.id===r.anchor.rowId);
  if(!row)return [];
  const stages=r.current.completion==='not_started'?row.blocks.filter(x=>x.start>=r.anchor.start&&x.label).map(x=>({...x,blockId:x.id})):r.nextStages;
  const identity=encodeURIComponent(JSON.stringify([r.current.course||'',r.current.volume||'',r.current.edition||'']));
  return stages.filter(x=>x.timingQuality==='source_reference'&&x.label&&!blockedLabel.test(x.label)&&Number.isInteger(x.start)&&Number.isInteger(x.end)&&x.end>=x.start).map(x=>({id:r.courseId+'|'+x.blockId+'|'+identity,courseId:r.courseId,track:r.track,section:r.anchor.section,rowId:row.id,blockId:x.blockId,label:x.label,note:x.note||'',start:x.start,end:x.end,span:x.end-x.start+1,sourcePath:section.sourcePath,sourceSha256:section.sha256,sourcePosition:`${row.id}:cell${x.sourceCellIndex}`,sourceCellIndex:x.sourceCellIndex,rawCell:x.text||x.label,sourceStart:section.columns[x.start]?.label,sourceEnd:section.columns[x.end]?.label}));
 });
}
export function personalSpeedComparison(s,b,source){
 const config=clone(s.wizard.quick.speedComparison||{}),options=speedOptions(b,source),selected=options.filter(x=>(config.selectedSteps||[]).includes(x.id));
 const confirmed=comparisonConfirmed(s),rows=[];
 if(config.startMonth)comparisonMonth(config.startMonth,0);
 for(const courseId of [...new Set(selected.map(x=>x.courseId))]){
  const blocks=selected.filter(x=>x.courseId===courseId),origin=Math.min(...blocks.map(x=>x.start));
  for(const block of blocks){
   const original={start:block.start-origin,end:block.end-origin};
   const start=Math.round(sourceRampTime(original.start,source.ramp)),end=Math.max(start,Math.round(sourceRampTime(original.end+1,source.ramp))-1);
   rows.push({...block,origin,original,accelerated:{start,end},calendar:confirmed&&config.startMonth?{baseline:{start:comparisonMonth(config.startMonth,original.start),end:comparisonMonth(config.startMonth,original.end)},faster:{start:comparisonMonth(config.startMonth,start),end:comparisonMonth(config.startMonth,end)}}:null});
  }
 }
 return {version:1,kind:'source_ramp_comparison',config,model:clone(source.ramp),modelSource:{path:'roadmap_build.zip!/roadmap/index.html',functions:'rampT, acceleratedBlocks',rounding:'Math.round(start), max(start, Math.round(endExclusive)-1)',role:'comparison_only'},options,rows,confirmed,calendarReady:confirmed&&!!config.startMonth,staleSelection:(config.selectedSteps||[]).filter(id=>!options.some(x=>x.id===id)),currentRemainder:'not_inferred',automaticApply:false};
}
export function speedReference(s,b,source,mode='faster'){
 if(!['baseline','faster'].includes(mode))throw Error('비교 방향을 확인해 주세요.');
 const c=personalSpeedComparison(s,b,source);if(!c.rows.length)throw Error('앞으로 비교할 독립 구간을 선택해 주세요.');
 if(c.staleSelection.length)throw Error('교재나 기준이 바뀌었습니다. 비교할 구간을 다시 확인해 주세요.');
 if(!c.confirmed)throw Error('선택한 범위·판본 대응과 아직 시작하지 않았는지 확인해 주세요.');
 const template={id:`personal-speed-${crypto.randomUUID()}`,title:mode==='faster'?'개인 월 비교 · 기존 증속 모델':'개인 월 비교 · 원표 기준',copyId:source.source?.file||'source-monthly',hash:c.rows.map(x=>x.sourceSha256).join('|'),version:'source-ramp-v1',role:'reference',sourcePosition:c.rows.map(x=>x.sourcePosition).join('|'),comparisonModel:{mode,...clone(c.modelSource),ramp:clone(c.model),basisFingerprint:comparisonBasis(s)},steps:c.rows.map(x=>({id:x.id,axis:({application:'curriculum',depth:'curriculum',thinking:'thinking',arithmetic:'arithmetic',science:'science',other:'other'})[x.track],subtrack:x.track,title:x.label,scope:x.label,rawCell:x.rawCell,sourcePosition:x.sourcePosition,sourceHash:x.sourceSha256,sourcePath:x.sourcePath,originalRelative:{...x.original,unit:'month',quality:'verified'},relative:{...(mode==='faster'?x.accelerated:x.original),unit:'month',quality:'verified'},role:'learning',scheduleEligible:true}))};
 const mappings=template.steps.map(x=>{
  const existing=(s.workspace?.learningItems||[]).filter(item=>item.source?.comparisonModel&&item.source.stepId===x.id);
  if(existing.length>1)throw Error('같은 향후 구간의 계획이 여러 개입니다. 기존 계획을 먼저 확인해 주세요.');
  const item=existing[0];
  if(item&&(item.status!=='planned'||item.cancelled||item.operationalStatus==='cancelled'||(s.workspace.actualRecords||[]).some(r=>r.learningId===item.id||r.itemId===item.id)))throw Error('이미 실행하거나 변경한 학습은 속도 비교로 덮어쓰지 않아요. 기존 월별 항목에서 기록을 확인해 주세요.');
  return {stepId:x.id,...(item?{learningId:item.id}:{}),identityConfirmed:true,scopeConfirmed:true,editionState:'not_applicable',status:'not_started'};
 });
 return {comparison:c,template,input:{templateId:template.id,startMonth:c.config.startMonth||'',mappings}};
}
export function personalSpeedMarkup(s,b,source){
 if(s.wizard.quick.learningDirection!=='faster')return '';
 const c=personalSpeedComparison(s,b,source),f=c.config; if(!c.confirmed)for(const k of confirmations)f[k]=false;
 const range=(r,key)=>r.calendar?`${r.calendar[key].start}~${r.calendar[key].end}`:`상대 ${r[key==='baseline'?'original':'accelerated'].start+1}~${r[key==='baseline'?'original':'accelerated'].end+1}개월째`;
 return `<details class="personal-speed-comparison"><summary>우리 아이 월 계획 · 기준과 빠르게 비교</summary>${f.invalidatedReason?`<p role="status">${esc(f.invalidatedReason)}</p>`:''}<p>앞으로 할 구간만 골라 주세요. 진행 중 교재의 남은 기간은 계산하지 않습니다.</p>${c.options.length?`<fieldset><legend>비교할 앞으로의 구간</legend>${c.options.map(x=>`<label class="monthly-check"><input type="checkbox" name="speed:step" value="${esc(x.id)}" ${f.selectedSteps?.includes(x.id)?'checked':''}><span>${esc(({application:'교과 기본·응용',depth:'교과 심화',thinking:'사고력',arithmetic:'연산',science:'과학',other:'타 과목'})[x.track])} · ${esc(x.label)}<small>원표 ${esc(x.sourceStart)}~${esc(x.sourceEnd)}</small></span></label>`).join('')}</fieldset><label class="field"><span>선택한 축들의 비교 시작월 (모르면 비워두세요)</span><input type="month" name="speed:startMonth" value="${esc(f.startMonth||'')}"></label><p class="note">각 과정의 첫 선택 구간을 이 월에 맞춰 비교합니다. 아이의 실제 시작·지원 일정이 아닙니다.</p>${confirmations.map((k,i)=>`<label class="monthly-check"><input type="checkbox" name="speed:${k}" ${f[k]?'checked':''}><span>${['선택한 구간이 비교하려는 학습과 같아요','선택한 학습 범위를 확인했어요','판본을 대조했거나 판본 구분이 필요 없어요','선택한 구간은 아직 시작하지 않았어요'][i]}</span></label>`).join('')}${c.staleSelection.length?'<p class="note">현재 교재·기준에 없는 이전 선택은 제외했습니다. 구간을 다시 확인해 주세요.</p>':''}${c.rows.length?`<div class="monthly-table-scroll"><table class="monthly-table"><caption>${c.calendarReady?'입력한 시작월로 비교한 후보':'원표 상대 기간 비교 · 개인 달력은 미정'}</caption><thead><tr><th>과정</th><th>원표 기준</th><th>빠르게 비교</th></tr></thead><tbody>${c.rows.map(x=>`<tr><th>${esc(x.label)}</th><td>${esc(range(x,'baseline'))}</td><td>${esc(range(x,'faster'))}</td></tr>`).join('')}</tbody></table></div>`:''}<div class="actions"><button type="button" data-personal-speed-refresh>비교 보기</button><button type="button" data-monthly-action="speed" data-value="baseline">기준 후보의 변경 전후 보기</button><button type="button" data-monthly-action="speed" data-value="faster">빠르게 후보의 변경 전후 보기</button></div>`:'<p>현재 기록에서 기간 근거가 있는 다음 독립 구간을 찾지 못했어요. 교재·범위를 더 기록하거나 원표 행을 확인해 주세요.</p>'}<p class="note">처음 실제 2개월 1.10배·이후 1.20배와 원표의 월 반올림 모델로 비교합니다. 가능성이나 합격 예측이 아니며, 변경 전후를 검토하고 적용할 항목을 직접 골라야 계획에 반영됩니다.</p></details>`;
}
