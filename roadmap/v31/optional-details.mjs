import {createAutomaticSummary} from './summary-notes.mjs';
import {esc} from './intake.mjs';
import {addBook,trackCourses} from './flow.mjs';

export const PURPOSE_DETAILS=[
 {id:'science',label:'과학',step:'science-detail'},
 {id:'gifted',label:'영재원',step:'gifted'},
 {id:'competition',label:'대회',step:'competition'},
 {id:'highSchool',label:'학교·진로',step:'school'},
 {id:'other',label:'타 과목',step:'books:other'},
];
const statuses={entered:'입력됨',later:'나중에 입력',none:'관심 없음'};
export function detailSnapshot(s){
 return {statuses:structuredClone(s.wizard.quick.detailStatuses||{}),goals:structuredClone(s.goals),region:s.profile.region||'',scienceCourse:s.wizard.scienceCourse||'',scienceRange:s.wizard.scienceRange||'',competitionName:s.wizard.competitionName||'',otherCourses:structuredClone(trackCourses(s,'other'))};
}
export function detailRows(s,id){
 const g=s.goals,w=s.wizard;
 if(id==='science')return [w.scienceCourse,w.scienceRange,g.sciencePurpose].filter(Boolean);
 if(id==='gifted')return [g.giftedInstitution,g.giftedField,g.admissionYear,s.profile.region].filter(Boolean);
 if(id==='competition')return [w.competitionName,({enter:'응시 희망',do_not_enter:'자료 학습·미응시',undecided:'방향 미정'})[g.competitionIntent]].filter(Boolean);
 if(id==='highSchool')return [...(g.schoolTypes||[]).map(x=>({gifted_school:'영재고',science_school:'과학고',autonomous:'자사고',general:'일반고',undecided:'미정'})[x]||x),g.institution,g.schoolAdmissionYear?`학교 목표 ${g.schoolAdmissionYear}학년도`:'',g.medical?'의학계열 희망':''].filter(Boolean);
 return trackCourses(s,'other').map(c=>[c.course,c.volume,c.range].filter(Boolean).join(' · '));
}
export function detailChoices(s){
 return `<details class="optional-purpose-details"><summary>과학·영재원·대회·학교·타 과목 상세 입력 (선택)</summary><p class="note">필요한 항목만 열어 주세요. 관심 없음이나 나중 입력도 선택할 수 있어요.</p><div class="actions">${PURPOSE_DETAILS.map(d=>`<button type="button" data-purpose-detail="${d.id}">${d.label} · ${statuses[s.wizard.quick.detailStatuses?.[d.id]]||'입력하기'}</button>`).join('')}</div></details>`;
}
export function openDetail(s,id,returnStep){
 const d=PURPOSE_DETAILS.find(x=>x.id===id);if(!d)throw Error('상세 입력 항목을 확인해 주세요.');
 s.wizard.quick.optionalDetail={id,returnStep:returnStep==='plan'?'plan':'overview'};
 s.wizard.quick.refining=true;return d.step;
}
export function detailSession(s){return s.wizard.quick.optionalDetail;}
export function finishDetail(s,status='entered'){
 const q=s.wizard.quick,session=q.optionalDetail;if(!session)return null;
 const d=PURPOSE_DETAILS.find(x=>x.id===session.id),w=s.wizard;
 q.detailStatuses??={};q.detailStatuses[d.id]=status;
 if(status==='entered'){
  if(!w.interests.includes(d.id))w.interests.push(d.id);
  if(d.id!=='other')s.goals[d.id]=true;
  if(['science','gifted'].includes(d.id)&&w.scienceCourse?.trim()){
   let c=s.courses.find(x=>x.intakeOrigin==='science-detail');
   if(!c){c=addBook(s,'science',w.scienceCourse);c.intakeOrigin='science-detail';}
   c.course=w.scienceCourse.trim();c.range=w.scienceRange||'';w.pendingCourseId='';
  }
 }else if(status==='none'){
  w.interests=w.interests.filter(x=>x!==d.id);if(d.id!=='other')s.goals[d.id]=false;
 }
 const next=session.returnStep;delete q.optionalDetail;q.refining=false;return next;
}
export function monthlyDetailContext(s){
 return `<details class="monthly-detail-context"><summary>로드맵에서 입력한 선택 목표·상세 정보</summary><p class="note">학부모가 입력한 학습과 희망입니다. 공식 일정이나 실제 활동 완료로 계산하지 않습니다.</p>${PURPOSE_DETAILS.map(d=>{
  const rows=detailRows(s,d.id),status=s.wizard.quick.detailStatuses?.[d.id];
  return `<section data-purpose-context="${d.id}"><h3>${d.label} · ${statuses[status]||'아직 입력하지 않음'}</h3>${rows.length?`<p>${rows.map(esc).join(' / ')}</p>`:''}${status==='entered'?`<button type="button" data-monthly-purpose="${d.id}">관련 월별 항목 추가</button>`:''}</section>`;
 }).join('')}</details>`;
}
function originalMonthlyDetailEditor(s,id){
 const d=PURPOSE_DETAILS.find(x=>x.id===id);if(!d)throw Error('목적을 확인해 주세요.');
 const g=s.goals,w=s.wizard,note=detailRows(s,id).join(' / ');
 if(id==='science')return {kind:'learning',fields:{axis:'science',title:w.scienceCourse||'과학 학습 검토',bookName:w.scienceCourse||'',scope:w.scienceRange||'',status:'unknown',note}};
 if(id==='other'){const c=trackCourses(s,'other').at(-1)||{};return {kind:'learning',fields:{axis:'other',title:c.course||'타 과목 학습 검토',bookName:c.course||'',volume:c.volume||'',scope:c.range||'',status:'unknown',note}};}
 return {kind:'event',fields:{axis:id==='highSchool'?'other':id,title:(id==='gifted'?g.giftedInstitution:id==='competition'?w.competitionName:g.institution)||d.label+' 검토',institution:id==='gifted'?g.giftedInstitution||'':id==='highSchool'?g.institution||'':'',program:id==='gifted'?g.giftedField||'':'',recruitmentYear:id==='gifted'?g.admissionYear||'':'',...(id==='highSchool'?{schoolAdmissionYear:g.schoolAdmissionYear||''}:{}),action:'decision',actionStatus:'considering',intent:id==='competition'&&g.competitionIntent==='do_not_enter'?'none':'undecided',note}};
}

export function monthlyDetailEditor(s,id){const e=originalMonthlyDetailEditor(s,id),f=e.fields;f.note='';f.userNote='';if(id==='gifted')f.summaryRegion=s.profile.region||'';if(id==='science')f.summaryGoal=s.goals.sciencePurpose||'';f.autoSummary=createAutomaticSummary(s,id,f);return e;}
