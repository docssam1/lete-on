import {curriculumDetail} from './review-ui.mjs';
import {validateReviewState as validateState} from './review-validation.mjs';
import {saveObservation,routeAdvice,courseScope} from './advisor.mjs';
import {mappingSnapshot} from './curriculum.mjs';
import {createState,setAnswer} from './engine.mjs';
import {ensureWizard,setReportedAge,addBook,saveBookDetails,advance,back,nextStep,beginPersonality,skipPersonality,scorePersonality,saveFamilyPlan,koreaDate,trackOf} from './flow.mjs';
import {esc} from './intake.mjs';
import {screenV10 as screen} from './intake-v10.mjs';
import {ensureV10,nextV10,levelFromScope,addPlanned,saveRelation,acceptV10,pendingReviews,markReview,relatedBranches,branchQuestions,branchTarget} from './paths-v10.mjs';
import {characterMarkup,mountCharacter} from './character.mjs';
import {openStore,loadState,saveState,exportState,isPersistent} from './store.mjs';
let state,catalog,contract,personality,books,design,revision=0,timer,saveTask=null,generation=0,savedGeneration=0,saveError='',conflict=false,character=null;
const $=s=>document.querySelector(s);
const array=v=>Array.isArray(v)?v:[];
const clone=v=>structuredClone(v);
function saveStatus(){const e=$('#save-status');if(e){e.textContent=saveError?'저장 확인 필요':saveTask?'저장 중…':generation>savedGeneration?'변경 내용 저장 중…':isPersistent()?'이 기기에 저장됨':'이 기기에 저장되지 않음 · 사본을 내려받아 주세요';e.dataset.error=!!saveError;}const err=$('#save-error');if(err){err.hidden=!saveError;err.textContent=saveError;}}
function changed(){generation++;clearTimeout(timer);timer=setTimeout(()=>persist().catch(()=>{}),300);saveStatus();}
async function persist(){
 clearTimeout(timer);if(conflict)throw Error(saveError);
 if(saveTask){await saveTask;if(generation>savedGeneration)return persist();return;}
 if(generation<=savedGeneration)return;
 const ownGeneration=generation,snapshot=clone(state),check=validateState(snapshot);
 if(!check.valid)throw Error(check.errors.join('\n'));
 saveTask=(async()=>{let r;try{r=await saveState(snapshot,revision);}catch(err){conflict=err.status===409;throw Error(err.message+(conflict?' 입력한 내용은 화면에 남아 있어요. 사본을 보관한 뒤 최신 기록을 불러와 주세요.':''));}revision=r.revision;state.revision=revision;savedGeneration=ownGeneration;saveError='';})();saveStatus();
 try{await saveTask;}catch(e){saveError=e.message;throw e;}finally{saveTask=null;saveStatus();}
 if(generation>savedGeneration)return persist();
}
function collect(){
 const f=$('#step-form');if(!f)return;const d=new FormData(f),s=clone(state),w=s.wizard,step=w.step;
 const num=(name,max)=>{const v=d.get(name);if(v===null||v==='')return null;const n=Number(v);if(!Number.isFinite(n)||n<0||n>max)throw Error('시간·횟수의 입력 범위를 확인해 주세요.');return n;};
 switch(step){
 case 'age':setReportedAge(s,d.get('reportedAge')===''?null:Number(d.get('reportedAge')));if(d.has('reportedBirthMonth'))s.profile.reportedBirthMonth=d.get('reportedBirthMonth')===''?null:Number(d.get('reportedBirthMonth'));break;
 case 'birth':s.profile.reportedBirthMonth=d.get('reportedBirthMonth')===''?null:Number(d.get('reportedBirthMonth'));break;
 case 'grade':s.profile.grade=d.get('grade')||'';s.profile.academicYear=String(Number(koreaDate().slice(0,4)));break;
 case 'thinking':if(d.has('thinkingExperience')){w.thinkingExperience=d.get('thinkingExperience');if(['unknown','not_started'].includes(w.thinkingExperience))w.axisStatus.thinking=w.thinkingExperience;}break;
 case 'academy':w.academyDraft=Object.fromEntries(d);break;
 case 'course-review':{const cid=w.reviewCourseId||s.courses[0]?.id;if(cid){w.observationDrafts??={};const c=s.courses.find(c=>c.id===cid);w.observationDrafts[cid]={...Object.fromEntries(d),scope:courseScope(c)};}break;}
 case 'depth-status':if(d.has('depthStatus'))w.axisStatus.depth=d.get('depthStatus');break;
 case 'personality-test':if(d.has('personalityAnswer'))s.personality.answers[s.personality.cursor]=Number(d.get('personalityAnswer'));break;
 case 'goals':if(d.has('direction'))w.v10.direction=d.get('direction');if(d.has('bookNeed'))w.bookNeed=d.get('bookNeed');break;
 case 'routes':if(d.has('variant'))w.v10.variant=d.get('variant');w.selectedCourseIds=d.getAll('selectedCourseIds');for(const c of s.courses)if(d.has('intent:'+c.id))w.v10.intents[c.id]=d.get('intent:'+c.id);for(const k of ['planTitle','planReason'])w[k]=String(d.get(k)||'');w.v10.reviewCondition=String(d.get('reviewCondition')||'');w.v10.plannedDraft={...w.v10.plannedDraft,track:d.get('plannedTrack'),name:String(d.get('plannedName')||''),scope:String(d.get('plannedScope')||'')};w.v10.branchId=d.get('branchId')||'';break;
 case 'relation-editor':w.v10.relationDraft={...w.v10.relationDraft,kind:d.get('relationKind'),sourceCourseIds:d.getAll('relationSources'),targetPlannedCourseIds:d.getAll('relationTargets'),reviewTrigger:d.get('relationTrigger'),condition:String(d.get('relationCondition')||'')};break;
 case 'branch-review':w.v10.branchDraft={values:d.getAll('branchAnswers'),note:String(d.get('branchNote')||'')};break;
 case 'time':s.support.weekdayMinutes=num('weekdayMinutes',1440);s.support.weekendMinutes=num('weekendMinutes',1440);s.academy.desiredFrequency=num('desiredFrequency',14);s.academy.desiredSessionMinutes=num('desiredSessionMinutes',1440);break;
 case 'academy-time':s.academy.desiredFrequency=num('desiredFrequency',14);s.academy.desiredSessionMinutes=num('desiredSessionMinutes',1440);break;
 case 'interests':w.interests=d.getAll('interests');s.goals.hwangsoInquiry=w.interests.includes('hwangso')?'answered':'not_asked';for(const k of ['science','gifted','competition','highSchool'])s.goals[k]=w.interests.includes(k);break;
 case 'premier':s.goals.premier=d.get('premier');break;
 case 'hwangso':if(d.has('hwangso'))s.goals.hwangso=d.get('hwangso');break;
 case 'hwangso-reason':s.goals.hwangsoReasons=d.getAll('hwangsoReasons');if(d.has('hwangso'))s.goals.hwangso=d.get('hwangso');s.goals.hwangsoReasonNote=String(d.get('hwangsoReasonNote')||'');break;
 case 'science-detail':w.scienceCourse=String(d.get('scienceCourse')||'');w.scienceRange=String(d.get('scienceRange')||'');s.goals.sciencePurpose=String(d.get('sciencePurpose')||'');break;
 case 'gifted':if(d.has('scienceCourse')){w.scienceCourse=String(d.get('scienceCourse')||'');w.scienceRange=String(d.get('scienceRange')||'');s.goals.sciencePurpose=String(d.get('sciencePurpose')||'');}s.goals.giftedInstitution=String(d.get('giftedInstitution')||'');s.goals.giftedField=String(d.get('giftedField')||'');s.goals.admissionYear=String(d.get('admissionYear')||'');s.profile.region=String(d.get('region')||'');break;
 case 'competition':s.goals.competitionIntent=d.get('competitionIntent');w.competitionName=String(d.get('competitionName')||'');break;
 case 'school':s.goals.schoolTypes=d.getAll('schoolTypes');s.goals.medical=d.get('medical')==='yes';s.goals.institution=String(d.get('institution')||'');break;
 }
 if(step.startsWith('books:')){const key=step.split(':')[1];w.bookDrafts??={};w.bookDrafts[key]=String(d.get('bookName')||'');w.v10.bookDrafts??={};w.v10.bookDrafts[key]=Object.fromEntries(d);if(d.has('axisStatus'))w.axisStatus[key]=d.get('axisStatus');}
 if(step.startsWith('detail:')){const details=Object.fromEntries(d);if(details.unitChoice)details.unit=details.unitChoice;if(details.isbnChoice)details.isbn=details.isbnChoice;saveBookDetails(s,details);if(d.has('editBookName')){const c=s.courses.find(c=>c.id===w.pendingCourseId),name=String(d.get('editBookName')).trim();if(!name)throw Error('교재 이름을 남겨 주세요.');c.course=name;}}
 const check=validateState(s);if(!check.valid)throw Error(check.errors.join('\n'));state=s;
}
function showError(e){$('#error-message').textContent=e.message;$('#error-message').hidden=false;}
function render(focus=true){
 const openSummaries=$('#main')?.dataset.step===state.wizard.step?[...document.querySelectorAll('#step-form details[open]')].map(d=>d.querySelector(':scope>summary')?.textContent):[];
 character?.destroy();character=null;const step=state.wizard.step,view=screen(state,catalog,personality,books,design,contract);
 const phase=step==='intro'?'우리 아이 기준 로드맵':['age','birth','grade'].includes(step)?'아이 정보':['position','personality','personality-test','personality-result'].includes(step)?'현재 위치와 성향':['routes','plan'].includes(step)?'기준 경로':step.startsWith('books:')||step.startsWith('detail:')||['thinking','academy','depth-status'].includes(step)?'학습 이력':'목표와 시간';
 $('#app').innerHTML=`<div class="roadmap-app"><header><a href="./" class="brand">GFIELD <span>우리 아이 기준 로드맵</span></a><span id="save-status" role="status"></span></header><main id="main" tabindex="-1" data-step="${esc(step)}" class="${step==='intro'?'intro':''}"><p class="eyebrow">${phase}</p><div class="guide-row">${characterMarkup()}<div class="bubble"><span class="doc-label">DOCSSAM</span><p>${esc(view.say)}</p></div></div><div class="question-surface"><h1 id="question-title">${esc(view.title)}</h1><p id="error-message" role="alert" hidden></p><form id="step-form" aria-labelledby="question-title">${view.html}<div class="navigation">${state.wizard.history.length?'<button type="button" data-back>이전</button>':''}${!view.hideNext?`<button type="submit" class="primary">${esc(view.next||'다음')}</button>`:''}${!['intro','plan','position','personality-test','routes','personality-result'].includes(step)?'<button type="button" class="quiet" data-skip>나중에 입력</button>':''}</div></form></div><p id="save-error" role="alert" hidden></p><div class="recovery"><button type="button" data-retry-save>저장 다시 확인</button><button type="button" data-export>현재 입력 사본 보관</button></div></main><footer><a href="workspace.html?tab=evidence" data-workspace>표준 커리큘럼·근거 보기</a><span>현재 기록 · 가족의 희망 · 추천을 따로 살펴봅니다.</span></footer></div>`;
 for(const d of document.querySelectorAll('#step-form details'))if(openSummaries.includes(d.querySelector(':scope>summary')?.textContent))d.open=true;
 saveStatus();const mood=step==='plan'?'happy':['goals','routes'].includes(step)?'think':'listen';character=mountCharacter($('#docssam'),mood);
 if(focus){$('#main').focus({preventScroll:true});window.scrollTo({top:0});}
}
async function finishStep(skip=false){
 collect();const step=state.wizard.step,w=state.wizard;
 if(skip){w.skipped.push({step,at:new Date().toISOString()});}
 if(step==='course-review'){if(skip)markReview(state,w.reviewCourseId);if(!skip&&state.courses.length){const cid=w.reviewCourseId||state.courses[0].id;saveObservation(state,cid,w.observationDrafts?.[cid]||{help:'unknown',burden:'unknown',explanation:'unknown'});const o=w.courseObservations[cid];state=setAnswer(state,'Q15',{values:[o.depth==='unknown'?'모름':o.depth]},cid);state=setAnswer(state,'Q16',{values:[o.help==='unknown'?'기록 없음':o.help]},cid);state=setAnswer(state,'Q17',{values:[({unknown:'확인 안 함',example:'관찰한 예 입력',needs_help:'설명 도움 필요',answer_only:'답만 확인'})[o.explanation]],note:o.example},cid);for(const q of ['Q15','Q16','Q17'])state.courseAnswers[cid][q].scopeSnapshot=structuredClone(o.scope);delete state.wizard.observationDrafts[cid];markReview(state,cid);}if(w.v10.pendingAcceptance){const remaining=pendingReviews(state);if(remaining.length){state.wizard.reviewCourseId=remaining[0];}else commitPlan();}else advance(state,'routes');}
 else if(step==='personality-test'){
  const f=new FormData($('#step-form')),answer=f.get('personalityAnswer');
  if(answer===null)throw Error('답변 하나를 선택하거나 검사를 그만하고 계속할 수 있어요.');
  state.personality.answers[state.personality.cursor]=Number(answer);
  if(state.personality.cursor<9)state.personality.cursor++;else{state.personality.status='completed';state.personality.completedAt=new Date().toISOString();advance(state,'personality-result');}
 }else if(step.startsWith('books:')&&!skip&&w.v10.bookDrafts?.[step.split(':')[1]]?.bookName?.trim()){
  const key=step.split(':')[1];addInlineBook(key);advance(state,nextV10(state,step));
 }else if(step.startsWith('detail:')){const key=step.split(':')[1];advance(state,`books:${key}`);w.pendingCourseId='';}
 else if(step==='academy'&&!skip&&w.academyDraft?.institution){addAcademy();return;}
 else if(step==='relation-editor'){saveRelation(state,w.v10.relationDraft);w.v10.relationDraft={};advance(state,'routes');}
 else if(step==='branch-review'){const session=w.v10.branchSession,qid=session?.qids[session.cursor];if(qid){const draft=w.v10.branchDraft||{values:[],note:''};const old=session.courseId?state.courseAnswers?.[session.courseId]?.[qid]:state.answers[qid];if(old){state.wizard.v10.branchAnswerHistory??=[];state.wizard.v10.branchAnswerHistory.push({questionId:qid,courseId:session.courseId,answer:structuredClone(old)});}state=setAnswer(state,qid,{values:draft.values.length?draft.values:['모름·확인 필요'],note:draft.note,sourceRole:'parent_report'},session.courseId||'');if(session.courseId)state.courseAnswers[session.courseId][qid].scopeSnapshot=structuredClone(courseScope(state.courses.find(c=>c.id===session.courseId)));state.wizard.v10.branchSession.cursor++;state.wizard.v10.branchDraft={};}else advance(state,'routes');}
 else if(step==='routes'){if(w.v10.plannedDraft?.name?.trim()){addPlanned(state,w.v10.plannedDraft);w.v10.plannedDraft={};}const queue=pendingReviews(state);if(queue.length){w.v10.pendingAcceptance=true;w.reviewCourseId=queue[0];advance(state,'course-review');}else commitPlan();}
 else{if(step==='personality')state.personality.status='skipped';if(['science-detail','gifted'].includes(step)&&w.scienceCourse){let c=state.courses.find(c=>c.intakeOrigin==='science-detail');if(!c){c=addBook(state,'science',w.scienceCourse);c.intakeOrigin='science-detail';}c.course=w.scienceCourse;c.range=w.scienceRange||'';w.pendingCourseId='';}advance(state,nextV10(state));}
 changed();render();await persist();
}
function addInlineBook(key){const draft=state.wizard.v10.bookDrafts?.[key]||{};addBook(state,key,draft.bookName);saveBookDetails(state,{...draft,level:draft.level==='unknown'?levelFromScope(draft.volume):draft.level});state.wizard.bookDrafts[key]='';state.wizard.v10.bookDrafts[key]={};state.wizard.pendingCourseId='';}
 function commitPlan(){state=acceptV10(state);const p=state.plans.at(-1);p.adviceSnapshot=routeAdvice(state,books,personality,{courseIds:p.courseIds});p.bookMappingSnapshots=p.courseSnapshots.map(c=>({courseId:c.id,...mappingSnapshot(c,books)}));}
 function addAcademy(){const d=state.wizard.academyDraft||{};const institution=d.institution==='other'?String(d.institutionOther||'').trim():d.institution;if(!institution)throw Error('학원 이름을 선택하거나 입력해 주세요.');const a={id:state.wizard.editAcademyId||`academy-${crypto.randomUUID()}`,institution,level:String(d.academyLevel||''),status:d.academyStatus||'unknown'};const index=state.wizard.academies.findIndex(x=>x.id===a.id);if(index>=0)state.wizard.academies[index]=a;else state.wizard.academies.push(a);state.wizard.academyDraft={};state.wizard.editAcademyId='';changed();render();}
document.addEventListener('input',e=>{if(!e.target.closest('#step-form'))return;try{collect();changed();}catch(err){showError(err);}});
document.addEventListener('change',async e=>{if(e.target.hasAttribute('data-import-state')){try{const file=e.target.files?.[0];if(!file)return;if(file.size>4*1024*1024)throw Error('사본 크기를 확인해 주세요.');const data=JSON.parse(await file.text()),incoming=data.state||data,valid=validateState(incoming);if(!valid.valid)throw Error(valid.errors.join(' / '));const next=ensureV10(incoming);state=next;changed();render();await persist();}catch(err){showError(err);}return;}if(!e.target.closest('#step-form'))return;try{collect();if(e.target.name==='reviewCourseId')state.wizard.reviewCourseId=e.target.value;changed();if(['reportedAge','giftedField'].includes(e.target.name)){render(false);return;}if(['sourceCurriculum','volume','unitChoice','isbn','isbnChoice'].includes(e.target.name)&&state.wizard.step.startsWith('detail:')){const c=state.courses.find(c=>c.id===state.wizard.pendingCourseId),panel=$('[data-curriculum-detail]'),focusName=e.target.name;if(panel){panel.innerHTML=curriculumDetail(c,books);if(focusName!=='volume')panel.querySelector(`[name=${focusName}]`)?.focus({preventScroll:true});}}else if(e.target.name==='branchCourseId'){const session=state.wizard.v10.branchSession,b=catalog.branches.find(b=>b.id===session.branchId);session.courseId=e.target.value;session.cursor=0;session.qids=branchQuestions(state,b,session.courseId);render(false);}else if(['reviewCourseId','selectedCourseIds'].includes(e.target.name))render(false);}catch(err){showError(err);}});
let submitting=false;document.addEventListener('submit',async e=>{if(e.target.id!=='step-form')return;e.preventDefault();if(submitting)return;submitting=true;e.target.querySelector('button[type=submit]')?.setAttribute('disabled','');try{await finishStep();}catch(err){showError(err);}finally{submitting=false;$('#step-form button[type=submit]')?.removeAttribute('disabled');}});
document.addEventListener('click',async e=>{
 const button=e.target.closest('button,a[data-workspace]');if(!button)return;
 try{
  if(button.matches('[data-workspace]')){e.preventDefault();collect();changed();await persist();location.href=button.getAttribute('href');return;}
  if(button.hasAttribute('data-export')){const r=await exportState(state);$('#error-message').hidden=false;$('#error-message').textContent=r.message;return;}
  if(button.hasAttribute('data-retry-save')){if(conflict)throw Error('다른 창의 최신 기록을 확인하려면 현재 입력 사본을 보관한 뒤 새로고침해 주세요.');await persist();return;}
  if(button.hasAttribute('data-course-review')){collect();state.wizard.v10.pendingAcceptance=false;state.wizard.reviewCourseId||=state.courses[0]?.id;advance(state,'course-review');changed();render();await persist();return;}
  if(button.hasAttribute('data-back')){collect();if(state.wizard.step==='branch-review'&&state.wizard.v10.branchSession.cursor>0)state.wizard.v10.branchSession.cursor--;else if(state.wizard.step==='personality-test'&&state.personality.cursor>0)state.personality.cursor--;else back(state);changed();render();await persist();return;}
  if(button.hasAttribute('data-skip')){await finishStep(true);return;}
  if(button.dataset.addBook){collect();addInlineBook(button.dataset.addBook);changed();render();await persist();return;}
  if(button.hasAttribute('data-add-planned')){collect();addPlanned(state,state.wizard.v10.plannedDraft);state.wizard.v10.plannedDraft={};changed();render();await persist();return;}
  if(button.dataset.editPlanned){collect();state.wizard.v10.plannedDraft=structuredClone(state.wizard.v10.plannedCourses.find(p=>p.id===button.dataset.editPlanned));render(false);return;}
  if(button.hasAttribute('data-add-relation')||button.dataset.editRelation){collect();state.wizard.v10.relationDraft=button.dataset.editRelation?structuredClone(state.wizard.v10.relations.find(r=>r.id===button.dataset.editRelation)):{};advance(state,'relation-editor');changed();render();await persist();return;}
  if(button.hasAttribute('data-branch-review')){collect();const b=catalog.branches.find(b=>b.id===state.wizard.v10.branchId);if(!b)throw Error('살펴볼 갈림길을 골라 주세요.');const courseId=/^B(?:0[3-9]|1[0-9]|2[0-2]|47|5[1-5]|6[0-4]|84|94|98)$/.test(b.id)?branchTarget(state,b):'';state.wizard.v10.branchSession={branchId:b.id,cursor:0,courseId,qids:branchQuestions(state,b,courseId)};advance(state,'branch-review');changed();render();await persist();return;}
  if(button.dataset.editBook){collect();const c=state.courses.find(c=>c.id===button.dataset.editBook);if(!c)throw Error('교재 기록을 확인해 주세요.');state.wizard.pendingCourseId=c.id;advance(state,`detail:${trackOf(c)}`);changed();render();await persist();return;}
  if(button.hasAttribute('data-add-academy')){collect();addAcademy();await persist();return;}
  if(button.dataset.editAcademy){collect();const a=state.wizard.academies.find(a=>a.id===button.dataset.editAcademy);state.wizard.editAcademyId=a.id;state.wizard.academyDraft={institution:['소마','필즈','CMS'].includes(a.institution)?a.institution:'other',institutionOther:a.institution,academyLevel:a.level,academyStatus:a.status};render();return;}
  if(button.hasAttribute('data-personality-start')){collect();if(beginPersonality(state))advance(state,'personality-test');changed();render();await persist();return;}
  if(button.hasAttribute('data-personality-skip')){state.personality.status='skipped';advance(state,'interests');changed();render();await persist();return;}
  if(button.hasAttribute('data-change-route')){state.wizard.history.push('plan');state.wizard.step='interests';state.wizard.selectedCourseIds=state.plans.find(p=>p.id===state.activePlanId)?.courseIds||null;changed();render();await persist();return;}
 }catch(err){showError(err);}
});
async function init(){try{await openStore();const urls=['data/catalog.json','data/contract.json','data/personality.json','data/book-catalog.json','data/design-v10.json'];const data=await Promise.all(urls.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('자료를 불러오지 못했습니다.');return r.json();}));[catalog,contract,personality,books,design]=data;const saved=await loadState();revision=saved.revision;state=ensureV10(saved.state||createState(`${koreaDate()}T00:00:00Z`));render(false);}catch(e){$('#app').innerHTML=`<main><h1>로드맵을 불러오지 못했습니다.</h1><p role="alert">${esc(e.message)}</p><button onclick="location.reload()">다시 불러오기</button></main>`;}}
await init();
