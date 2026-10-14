// Read-only result presentation. Matching and progress stay in personalBaseline.
import {personalBaseline} from './personal-baseline.mjs';
import {completionText} from './progress-display.mjs';
import {esc} from './intake.mjs';

const axisNames={thinking:'사고력',application:'교과 기본·응용',depth:'교과 심화',arithmetic:'연산'};

function emptyState(s,track){
 // Keep the evidence order of the existing baseline view: a direct answer
 // takes precedence over a legacy axis status that may be only a default.
 const w=s.wizard||{},choice=w.quick?.scene?.choices?.[track];
 const experience=track==='thinking'?w.thinkingExperience:'';
 if(['unknown','not_started'].includes(choice))return choice;
 if(choice)return 'unentered';
 if(['unknown','not_started'].includes(experience))return experience;
 if(['books','academy','both'].includes(experience))return 'unentered';
 if(w.axisStatus?.[track]==='not_started')return 'not_started';
 if(w.axisStatus?.[track]==='unknown')return 'unconfirmed';
 return 'unentered';
}

function emptyText(state,hasAcademy){
 const subject=hasAcademy?'별도 사고력 교재':'';
 const text={not_started:'아직 따로 하지 않았어요.',unknown:'잘 모르겠다고 답했어요.',unconfirmed:'이전 기록의 입력 여부를 확인하지 못했어요.',unentered:'아직 입력하지 않았어요.'}[state];
 return subject?`${subject}는 ${text}`:text;
}

function rangeLabel(record){
 const c=record.current,scope=record.scope;
 if(['application','depth'].includes(record.track)&&scope?.grade&&['elementary','middle','high'].includes(scope.kind)){
  const level={elementary:'초등',middle:'중등',high:'고등'}[scope.kind];
  return `${level} ${scope.grade}${scope.term?'-'+scope.term:''}`;
 }
 return String(c.volume||'').trim()||'범위 미입력';
}

function sourceNote(record,section){
 // The chosen viewing section is a reference filter, not a learning level.
 // The engine's anchor can belong to another section; never relabel it here.
 const matches=record.matches.filter(m=>!section||m.section===section);
 const candidates=record.selectedLane?matches.filter(m=>m.rowId===record.selectedLane):matches;
 if(!candidates.length)return {state:'unmapped',text:'이 구간의 원표 연결은 직접 확인이 필요해요.'};
 if(candidates.length>1)return {state:'multiple',text:'같은 교재·범위가 여러 곳에 있어요. 원표에서 직접 확인해 주세요.'};
 if(candidates[0].matchKind==='scope_reference')return {state:'scope-reference',text:'같은 범위를 참고할 수 있어요. 교재별 기간은 확인이 필요해요.'};
 return {state:'exact',text:'같은 교재·범위를 참고할 수 있어요. 개인 일정은 따로 정해요.'};
}

export function schoolSummary(s,data={},{section=''}={}){
 const baseline=personalBaseline(s,data);
 const academies=Array.isArray(s.wizard?.academies)?s.wizard.academies:[];
 return {grade:s.profile?.grade||'',axes:Object.entries(axisNames).map(([track,label])=>{
  const records=baseline.records.filter(r=>r.track===track);
  return {track,label,records:records.map(record=>({id:record.courseId,name:record.current.course||record.current.name||'교재 이름 미입력',range:rangeLabel(record),detail:[record.current.unit,record.current.range].filter(Boolean).join(' · '),progress:completionText(record.current,{completed:'완료로 입력'}),source:sourceNote(record,section)})),academies:track==='thinking'?academies:[],emptyState:records.length?'':emptyState(s,track)};
 })};
}

function rangeMarkup(value,track=''){
 // Only a parsed curriculum range is one token. Academy levels and free-form
 // thinking/arithmetic ranges wrap regardless of their character count.
 const curriculumRange=['application','depth'].includes(track)&&/^(초등|중등|고등) [1-6](?:-[12])?$/.test(String(value));
 const className=curriculumRange?'school-range-token':'school-range-text';
 return `<span class="${className}">${esc(value)}</span>`;
}

export function schoolResultMarkup(s,data={},options={}){
 const summary=schoolSummary(s,data,options);
 const hasUnmapped=summary.axes.some(axis=>axis.records.some(record=>record.source.state==='unmapped'));
 return `<section class="school-summary" data-school-summary aria-labelledby="school-summary-title"><h2 id="school-summary-title">입력한 학습 요약</h2><p class="school-summary-context">학교 ${esc(summary.grade||'학년 미입력')} · 학습 범위는 아래에 따로 기록했어요.</p><div class="school-summary-axes">${summary.axes.map(axis=>`<section class="school-summary-axis" data-school-track="${axis.track}"><h3>${axis.label}</h3>${axis.academies.length?`<ul class="school-summary-academies">${axis.academies.map(a=>`<li data-school-academy><strong>${esc(a.institution||'학원 이름 미입력')}</strong>${a.level?` ${rangeMarkup(a.level)}`:''}<span class="school-summary-status">학원 경험 · 교재 진도와 별도</span></li>`).join('')}</ul>`:''}${axis.records.length?`<ul class="school-summary-records">${axis.records.map(record=>`<li data-school-record="${esc(record.id)}"><div class="school-summary-book"><strong>${esc(record.name)}</strong>${rangeMarkup(record.range,axis.track)}</div><p class="school-summary-status">${esc(record.progress)}${record.detail?' · '+esc(record.detail):''}</p><p class="school-summary-source" data-school-source-state="${record.source.state}">${esc(record.source.state==='unmapped'?'표에서 확인':record.source.text)}</p></li>`).join('')}</ul>`:`<p class="school-summary-empty" data-school-input-state="${axis.emptyState}">${esc(emptyText(axis.emptyState,axis.academies.length>0))}</p>`}</section>`).join('')}</div><p class="school-summary-limit">${hasUnmapped?'<span data-school-unmapped-summary>이 구간의 원표 연결은 직접 확인이 필요해요.</span> ':''}원표 시기는 개인 일정·이해도 진단이 아니에요.</p></section>`;
}
