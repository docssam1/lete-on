import {esc,bookPolicyOptions} from './intake.mjs';
import {trackOf,trackCourses,scopeLabel} from './flow.mjs';
import {curriculumDetail} from './review-ui.mjs';
import {HELP_OPTIONS,DEPTH_OPTIONS,courseScope,observationFor} from './advisor.mjs';
import {completionChoice,completionText} from './progress-display.mjs';

const supported=new Set(['science-detail','gifted','competition','school','books:other','course-review','time','goals']);
const levels=[['unknown','확인 필요'],['elementary','초등'],['middle','중등'],['high','고등'],['other','기타']];
const completions=[['','선택하지 않음'],['unknown','진행 상태 모름'],['not_started','아직 시작하지 않음'],['in_progress','진행 중'],['reported_done','완료했다고 보고'],['reviewed_done','범위 확인 완료']];
const input=(label,name,value='',extra='')=>`<label class="brief-field"><span>${esc(label)}</span><input name="${esc(name)}" value="${esc(value??'')}" ${extra}></label>`;
const select=(label,name,value,items)=>{
 const options=items.map(item=>Array.isArray(item)?item:[item,item]);
 const actual=String(value??'');
 if(actual&&!options.some(([v])=>String(v)===actual))options.push([actual,actual]);
 return `<label class="brief-field"><span>${esc(label)}</span><select name="${esc(name)}" title="${esc(actual)}">${options.map(([v,t])=>`<option value="${esc(v)}" ${actual===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
};
const choices=(label,name,current,items,multi=false)=>`<fieldset class="brief-choices"><legend>${esc(label)}</legend>${items.map(([v,t])=>`<label class="brief-choice"><input name="${esc(name)}" type="${multi?'checkbox':'radio'}" value="${esc(v)}" ${(multi?(current||[]).includes(v):current===v)?'checked':''}><span>${esc(t)}</span></label>`).join('')}</fieldset>`;
const more=html=>html?`<details class="brief-more"><summary>기록 더 남기기</summary><div class="brief-more-body">${html}</div></details>`:'';
const flattenDetails=html=>String(html||'').replace(/<details(?:\s[^>]*)?>/g,'<div class="brief-subrecord">').replace(/<\/details>/g,'</div>').replace(/<summary>/g,'<p class="brief-subtitle">').replace(/<\/summary>/g,'</p>');
const header=c=>`<p class="brief-record-title"><strong>${esc(c.course||'교재 이름 미입력')}</strong>${c.volume?`<span>${esc(c.volume)}</span>`:''}</p>`;
const number=(label,name,value,max,step='1')=>input(label,name,value,`type="number" inputmode="decimal" min="0" max="${max}" step="${step}"`);

function scopeField(c){
 const track=trackOf(c);
 const label=track==='thinking'?'단계·레벨·권':track==='arithmetic'?'단계·권':'교재 범위';
 const hint=track==='thinking'?'예: 초급, A단계, 2권':track==='arithmetic'?'예: P단계, 3권':'예: 초등 2-1, 중등 1-2';
 return input(label,'volume',c.volume||'',`placeholder="${hint}" autocomplete="off"`);
}
function metadata(c,books,{rename=false}={}){
 return `${rename?input('교재 이름 수정','editBookName',c.course||'','autocomplete="off"'):''}${input('마지막 단원·진행량','range',c.range||'','placeholder="예: 48쪽, 절반"')}${input('단원 이름','unit',c.unit||'')}${input('혼자 해결하는 정도·도움','independence',c.independence||'')}${select('실제 과정 구분','level',c.level||'unknown',levels)}${select('현재 과정 상태','status',c.status||'active',[['active','현재 진행'],['reduced','줄여서 진행'],['paused','쉬는 중'],['ended','종료']])}${input('판본·발행 연도','edition',c.edition||'')}<div data-curriculum-detail>${flattenDetails(curriculumDetail(c,books))}</div>${select('계획할 교육과정','curriculumTarget',c.curriculumTarget||'',[['','확인 필요'],['2022','2022 개정'],['2015','2015 개정'],['other','그 외']])}`;
}
export function isBriefDetailStep(input){
 const step=typeof input==='string'?input:input?.wizard?.step||'';
 return supported.has(step)||step.startsWith('detail:');
}
export const isBriefStep=isBriefDetailStep;

// Presentation only. Draft collection, cancellation, validation and commits stay in the app.
export function briefDetailScreen(s,books={books:[]}){
 const step=s.wizard.step,w=s.wizard,g=s.goals;
 if(!isBriefDetailStep(step))return null;
 let title='',say='아는 것만 남겨 주세요.',html='';
 if(step==='science-detail'){
  title='과학 공부를 남길까요?';
  html=input('교재·실험·탐구','scienceCourse',w.scienceCourse||'')+input('현재 범위','scienceRange',w.scienceRange||'')+more(input('과학에서 바라는 목표','sciencePurpose',g.sciencePurpose||''));
 }else if(step==='gifted'){
  title='영재원은 어떤 분야를 생각하나요?';
  const options=[['','아직 정하지 않았어요'],['수학','수학'],['과학','과학'],['수학·과학','수학·과학'],['미정','미정']];
  const custom=g.giftedField&&!options.some(([v])=>v===g.giftedField);
  html=select('관심 분야','giftedField',g.giftedField||'',options)+(custom?`<p class="brief-existing-value">기존 분야 · ${esc(g.giftedField)}</p>`:'')+more(input('기관 이름','giftedInstitution',g.giftedInstitution||'')+input('지역','region',s.profile.region||'')+input('지원 학년도','admissionYear',g.admissionYear||'','inputmode="numeric" placeholder="모르면 비워 두세요"')+`<div data-gifted-science ${/과학/.test(g.giftedField||'')?'':'hidden'}><p class="brief-subtitle">함께 남길 과학 공부</p>${input('과학 교재·실험·탐구','scienceCourse',w.scienceCourse||'')}${input('현재 과학 범위','scienceRange',w.scienceRange||'')}${input('과학에서 바라는 목표','sciencePurpose',g.sciencePurpose||'')}</div>`);
 }else if(step==='competition'){
  title='경시는 어떻게 생각하나요?';
  html=select('경시 방향','competitionIntent',g.competitionIntent||'undecided',[['undecided','아직 정하지 않았어요'],['enter','대회 응시를 고려해요'],['do_not_enter','자료로 공부하고 응시는 선택하지 않아요'],['unknown','잘 모르겠어요']])+input('대회·학습 자료 이름','competitionName',w.competitionName||'');
 }else if(step==='school'){
  title='관심 있는 진학 방향이 있나요?';say='여러 방향을 함께 남겨도 괜찮아요.';
  html=choices('관심 방향','schoolTypes',g.schoolTypes||[],[['gifted_school','영재고'],['science_school','과학고'],['autonomous','자사고'],['general','일반고'],['undecided','아직 미정']],true)+more(choices('의학계열도 생각하나요?','medical',g.medical?'yes':'no',[['no','아직 열어둘게요'],['yes','희망해요']])+input('학교 이름','institution',g.institution||'')+input('학교 목표 학년도','schoolAdmissionYear',g.schoolAdmissionYear||'','inputmode="numeric" placeholder="모르면 비워 두세요"')+'<p class="brief-note">학교에 입학하려는 학년도예요. 영재원 지원 학년도와 따로 남겨요.</p>');
 }else if(step==='books:other'){
  const d=w.v10?.bookDrafts?.other||{},c={...d,course:d.bookName||'',intakeTrack:'other',axis:'other'};
  title='다른 과목도 공부하고 있나요?';
  html=input('교재·과정 이름','bookName',d.bookName||'','autocomplete="off"')+scopeField(c)+more(select('진행 상태','completion',completionChoice(c),completions)+metadata(c,books)+select('이 과목의 상태','axisStatus',w.axisStatus.other||'unknown',[['unknown','잘 모르겠어요'],['not_started','아직 시작하지 않았어요'],['learning','공부한 경험이 있어요'],['paused','쉬는 중이에요'],['done','마무리한 교재가 있어요']])+trackCourses(s,'other').map(book=>`<div class="brief-saved-book"><strong>${esc(book.course)}</strong><span>${esc(scopeLabel(book))} · ${esc(completionText(book))}</span><button type="button" data-edit-book="${esc(book.id)}">이 기록 수정</button></div>`).join(''));
 }else if(step.startsWith('detail:')){
  const c=s.courses.find(x=>x.id===w.pendingCourseId);
  title=c?.course||'교재 기록';say='범위와 진행 상태만 바꿔도 괜찮아요.';
  html=c?scopeField(c)+select('진행 상태','completion',completionChoice(c),completions)+more(metadata(c,books,{rename:true})):'<p class="brief-note">수정할 교재를 다시 골라 주세요.</p>';
 }else if(step==='course-review'){
  const c=s.courses.find(x=>x.id===w.reviewCourseId)||s.courses[0];
  title='이 과정은 어떻게 공부하나요?';
  if(c){
   const draft=w.observationDrafts?.[c.id],same=draft&&JSON.stringify(draft.scope)===JSON.stringify(courseScope(c)),o=same?draft:observationFor(s,c);
   html=header(c)+select('최근 문제를 푸는 모습','help',o.help||'unknown',HELP_OPTIONS)+select('이 과정의 부담','burden',o.burden||'unknown',[['unknown','아직 확인하지 않았어요'],['manageable','지금은 감당할 만해요'],['high','부담이 큰 편이에요'],['varies','날마다 달라요']])+more(select('다른 과정 살펴보기','reviewCourseId',c.id,s.courses.map(x=>[x.id,`${x.course} · ${scopeLabel(x)}`]))+select('실제로 공부한 깊이','depth',o.depth||'unknown',DEPTH_OPTIONS.map(v=>[v,v==='unknown'?'아직 확인하지 않았어요':v]))+select('풀이 설명을 살펴봤나요?','explanation',o.explanation||'unknown',[['unknown','확인하지 않았어요'],['example','설명한 예를 남길게요'],['needs_help','설명에 도움이 필요했어요'],['answer_only','답만 확인했어요']])+input('최근 관찰한 예·날짜','example',o.example||'')+number('아이의 실제 학습 시간 (분/주)','weeklyMinutes',o.weeklyMinutes,10080)+number('부모 관리 시간 (분/주)','adultMinutes',o.adultMinutes,10080));
  }else html='<p class="brief-note">교재를 입력한 뒤 남길 수 있어요.</p>';
 }else if(step==='time'){
  title='집에서 함께할 시간은 어느 정도인가요?';
  html=number('평일 부모 관리 시간 (분/일)','weekdayMinutes',s.support.weekdayMinutes,1440)+number('주말 부모 관리 시간 (분/일)','weekendMinutes',s.support.weekendMinutes,1440)+more(number('희망 학원 횟수 (회/주)','desiredFrequency',s.academy.desiredFrequency,14,'.5')+number('학원 한 번의 시간 (분)','desiredSessionMinutes',s.academy.desiredSessionMinutes,1440));
 }else if(step==='goals'){
  title='응용과 심화는 어떻게 이어갈까요?';say='원하는 운영 방식만 골라 주세요.';
  html=choices('응용·심화 운영','direction',w.v10?.direction||'continue',[['continue','지금 과정 구성 그대로'],['add_depth','심화를 함께 하거나 나중 추가'],['depth_focus','심화를 중심으로, 응용은 보완'],['undecided','아직 정하지 않았어요']])+more(flattenDetails(bookPolicyOptions(s)));
 }
 if(w.quick?.optionalDetail&&['science-detail','gifted','competition','school','books:other'].includes(step)){
  const action='<button type="button" class="brief-purpose-none" data-purpose-none>관심 없음으로 남기기</button>';
  html=html.includes('class="brief-more"')?html.replace(/<\/div><\/details>$/,action+'</div></details>'):html+more(action);
 }
 return {title,say,html:`<section class="brief-details" data-brief-detail="${esc(step)}">${html}</section>`,next:'저장',hideNext:false,brief:true};
}
