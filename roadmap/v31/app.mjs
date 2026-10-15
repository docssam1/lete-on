import {curriculumDetail} from './review-ui.mjs';
import {validateReviewState as validateLegacyState} from './review-validation.mjs';
import {saveObservation,routeAdvice,courseScope} from './advisor.mjs';
import {mappingSnapshot} from './curriculum.mjs';
import {createState,setAnswer} from './engine.mjs';
import {ensureWizard,setReportedAge,addBook,saveBookDetails,advance,back,nextStep,beginPersonality,skipPersonality,scorePersonality,saveFamilyPlan,koreaDate,trackOf} from './flow.mjs';
import {esc} from './intake.mjs';
import {screenV10 as screen} from './intake-v10.mjs';
import {ensureV10,nextV10,levelFromScope,addPlanned,saveRelation,acceptV10,pendingReviews,markReview,relatedBranches,branchQuestions,branchTarget} from './paths-v10.mjs';
import {characterMarkup,mountCharacter} from './character.mjs';
import {openStore,loadState,saveState,exportState,isPersistent} from './store.mjs';
import {setBeforeProfileSwitch} from './gate.mjs';
import {ensureQuick,collectQuick,commitLearning,quickScreen,preschool,syncQuickCourseDraft} from './quick-flow.mjs';
import {personalBaseline} from './personal-baseline.mjs';
import {briefDetailScreen,isBriefDetailStep} from './brief-details.mjs';
import {briefSession,beginBrief,briefWorkingState,storeBriefDraft,commitBrief,discardBrief} from './brief-session.mjs';
import {resultHubScreen} from './result-hub.mjs?v=34';
import {parseCourseScope} from './recommendation-policy.mjs';
import {progressRoadmapMarkup} from './progress-roadmap.mjs';
import {startScene,deferScene,nextScene,backScene,chooseScene,progressScene,academyBookScene,markSceneBook,anotherBookScene} from './scene-intake.mjs';
import {academyReferenceOperations,academyPreparationMarkup} from './academy-reference.mjs';
import {collectPersonalSpeed,speedReference} from './personal-speed.mjs';
import {ensureWorkspace,validateWorkspaceState,saveWorkspaceDraft,prepareWorkspaceChange,applyWorkspaceChange,saveWorkspaceReference,generateWorkspaceCandidate,issueWorkspaceReport} from './workspace-engine.mjs';
import {monthlyScreen,monthlyView,collectMonthlyDraft,monthlyOperations,monthlyReference,editorForItem,projectionForMonthly} from './monthly-ui.mjs';
import {mountRoadmapScene} from './roadmap-3d.mjs';
import {mountProgressScene} from './progress-scene.mjs';
import {mountFullRouteMap} from './full-route-map.mjs?v=35';
import {detailChoices,openDetail,detailSession,finishDetail,detailSnapshot,monthlyDetailContext,monthlyDetailEditor} from './optional-details.mjs';
import {academyChoices,openAcademyDetail,finishAcademyDetail,collectAcademyDetail,syncHwangsoInquiry,recordHwangsoTiming,recordHwangsoBranch} from './academy-details.mjs';
import {mountAIHelper} from './ai-ui.mjs';
import {mountResultView} from './result-view.mjs';
import {isCompactStep,startCompact,compactScreen,collectCompact,commitCompact,compactGoalSummary} from './compact-intake.mjs?v=34';
document.body.classList.add('roadmap-calm');
const monthlyStyle=document.createElement('link');monthlyStyle.rel='stylesheet';monthlyStyle.href='monthly.css';document.head.append(monthlyStyle);
const resultStyle=document.createElement('link');resultStyle.rel='stylesheet';resultStyle.href='result-view.css';document.head.append(resultStyle);
for(const href of ['brief-details.css','result-hub.css','progress-scene.css','full-route-map.css']){const link=document.createElement('link');link.rel='stylesheet';link.href=href+'?v='+(href==='full-route-map.css'?'35':'34');document.head.append(link);}
const compactStyle=document.createElement('link');compactStyle.rel='stylesheet';compactStyle.href='compact-intake.css';document.head.append(compactStyle);
const progressStyle=document.createElement('link');progressStyle.rel='stylesheet';progressStyle.href='progress-roadmap.css';document.head.append(progressStyle);
const validateState=s=>{const a=validateLegacyState(s),b=validateWorkspaceState(s);return {valid:a.valid&&b.valid,errors:[...a.errors,...b.errors]};};
let progressSceneView=null,fullRouteMapView=null;
let monthlyScene=null,monthlyBusy=false,aiHelper=null,resultView=null;
let state,catalog,contract,personality,books,design,standard,revision=0,timer,saveTask=null,generation=0,savedGeneration=0,saveError='',conflict=false,character=null;
const $=s=>document.querySelector(s);
const array=v=>Array.isArray(v)?v:[];
const clone=v=>structuredClone(v);
const detailKey=d=>[d.closest('[data-progress-lane]')?.dataset.progressLane||'',d.querySelector(':scope>summary')?.textContent||''].join(':');
function saveStatus(){const e=$('#save-status');if(e){e.textContent=saveError?'저장 확인 필요':saveTask?'저장 중…':generation>savedGeneration?'변경 내용 저장 중…':isPersistent()?(briefSession(state)?'작성 중 · 저장하면 반영돼요':'이 기기에 저장됨'):'이 기기에 저장되지 않음 · 사본을 내려받아 주세요';e.dataset.error=!!saveError;}const err=$('#save-error');if(err){err.hidden=!saveError;err.textContent=saveError;}}
function changed(){generation++;clearTimeout(timer);timer=setTimeout(()=>persist().catch(()=>{}),300);saveStatus();}
async function persist(){
 clearTimeout(timer);if(conflict)throw Object.assign(Error(saveError),{status:409});
 if(saveTask){await saveTask;if(generation>savedGeneration)return persist();return;}
 if(generation<=savedGeneration)return;
 const ownGeneration=generation,snapshot=clone(state),check=validateState(snapshot);
 if(!check.valid)throw Error(check.errors.join('\n'));
 saveTask=(async()=>{let r;try{r=await saveState(snapshot,revision);}catch(err){conflict=err.status===409;throw Object.assign(Error(err.message+(conflict?' 입력한 내용은 화면에 남아 있어요. 사본을 보관한 뒤 최신 기록을 불러와 주세요.':'')),{status:err.status});}revision=r.revision;state.revision=revision;savedGeneration=ownGeneration;saveError='';})();saveStatus();
 try{await saveTask;}catch(e){saveError=e.message;throw e;}finally{saveTask=null;saveStatus();}
 if(generation>savedGeneration)return persist();
}
function collect(editedField=''){
 if(!briefSession(state)){collectActual(editedField);return;}
 const original=state;state=briefWorkingState(original);
 try{collectActual(editedField);state=storeBriefDraft(original,state);}catch(error){state=original;throw error;}
}
function collectActual(editedField=''){
 aiHelper?.invalidate();
 const f=$('#step-form');if(!f)return;const d=new FormData(f),s=clone(state),w=s.wizard,step=w.step;
 if(step==='monthly'){collectMonthlyDraft(s,d,editedField);state=ensureWorkspace(s);return;}
 if(isCompactStep(s)){collectCompact(s,d,editedField);state=ensureWorkspace(s);return;}
 const num=(name,max)=>{const v=d.get(name);if(v===null||v==='')return null;const n=Number(v);if(!Number.isFinite(n)||n<0||n>max)throw Error('시간·횟수의 입력 범위를 확인해 주세요.');return n;};
 collectQuick(s,d,editedField);if(step==='overview'&&editedField.startsWith('progressLane:')){s.wizard.quick.monthlyLanes??={};s.wizard.quick.monthlyLanes[editedField.slice(13)]=String(d.get(editedField)||'');}collectPersonalSpeed(s,d,editedField);const academyCollected=collectAcademyDetail(s,d);
 switch(step){
 case 'age':setReportedAge(s,d.get('reportedAge')===''?null:Number(d.get('reportedAge')));if(d.has('reportedBirthMonth'))s.profile.reportedBirthMonth=d.get('reportedBirthMonth')===''?null:Number(d.get('reportedBirthMonth'));break;
 case 'birth':s.profile.reportedBirthMonth=d.get('reportedBirthMonth')===''?null:Number(d.get('reportedBirthMonth'));break;
 case 'grade':s.profile.grade=d.get('grade')||'';s.profile.academicYear=String(Number(koreaDate().slice(0,4)));break;
 case 'thinking':if(d.has('thinkingExperience')){w.thinkingExperience=d.get('thinkingExperience');if(['unknown','not_started'].includes(w.thinkingExperience))w.axisStatus.thinking=w.thinkingExperience;}break;
 case 'academy':w.academyDraft=Object.fromEntries(d);break;
 case 'course-review':{const cid=d.get('reviewCourseId')||w.reviewCourseId||s.courses[0]?.id;if(cid){w.observationDrafts??={};const c=s.courses.find(c=>c.id===cid);w.observationDrafts[cid]={...Object.fromEntries(d),scope:courseScope(c)};}break;}
 case 'depth-status':if(d.has('depthStatus'))w.axisStatus.depth=d.get('depthStatus');break;
 case 'personality-test':if(d.has('personalityAnswer'))s.personality.answers[s.personality.cursor]=Number(d.get('personalityAnswer'));break;
 case 'goals':if(d.has('direction')){w.v10.direction=d.get('direction');}if(d.has('bookNeed'))w.bookNeed=d.get('bookNeed');break;
 case 'routes':if(d.has('variant'))w.v10.variant=d.get('variant');w.selectedCourseIds=d.getAll('selectedCourseIds');for(const c of s.courses)if(d.has('intent:'+c.id))w.v10.intents[c.id]=d.get('intent:'+c.id);for(const k of ['planTitle','planReason'])w[k]=String(d.get(k)||'');w.v10.reviewCondition=String(d.get('reviewCondition')||'');w.v10.plannedDraft={...w.v10.plannedDraft,track:d.get('plannedTrack'),name:String(d.get('plannedName')||''),scope:String(d.get('plannedScope')||'')};w.v10.branchId=d.get('branchId')||'';break;
 case 'relation-editor':w.v10.relationDraft={...w.v10.relationDraft,kind:d.get('relationKind'),sourceCourseIds:d.getAll('relationSources'),targetPlannedCourseIds:d.getAll('relationTargets'),reviewTrigger:d.get('relationTrigger'),condition:String(d.get('relationCondition')||'')};break;
 case 'branch-review':w.v10.branchDraft={values:d.getAll('branchAnswers'),note:String(d.get('branchNote')||'')};if(w.v10.branchSession?.qids[w.v10.branchSession.cursor]==='Q43'){w.v10.branchDraft.hwangsoReasons=d.getAll('hwangsoReasons');w.v10.branchDraft.hwangsoReasonNote=String(d.get('hwangsoReasonNote')||'');}break;
 case 'time':s.support.weekdayMinutes=num('weekdayMinutes',1440);s.support.weekendMinutes=num('weekendMinutes',1440);s.academy.desiredFrequency=num('desiredFrequency',14);s.academy.desiredSessionMinutes=num('desiredSessionMinutes',1440);break;
 case 'academy-time':s.academy.desiredFrequency=num('desiredFrequency',14);s.academy.desiredSessionMinutes=num('desiredSessionMinutes',1440);break;
 case 'interests':w.interests=d.getAll('interests');syncHwangsoInquiry(s);for(const k of ['science','gifted','competition','highSchool'])s.goals[k]=w.interests.includes(k);break;
 case 'premier':if(!academyCollected)s.goals.premier=d.get('premier');break;
 case 'hwangso':if(!academyCollected&&d.has('hwangso'))s.goals.hwangso=d.get('hwangso');break;
 case 'hwangso-reason':if(!academyCollected){s.goals.hwangsoReasons=d.getAll('hwangsoReasons');if(d.has('hwangso'))s.goals.hwangso=d.get('hwangso');s.goals.hwangsoReasonNote=String(d.get('hwangsoReasonNote')||'');}break;
 case 'science-detail':w.scienceCourse=String(d.get('scienceCourse')||'');w.scienceRange=String(d.get('scienceRange')||'');s.goals.sciencePurpose=String(d.get('sciencePurpose')||'');break;
 case 'gifted':if(d.has('scienceCourse')){w.scienceCourse=String(d.get('scienceCourse')||'');w.scienceRange=String(d.get('scienceRange')||'');s.goals.sciencePurpose=String(d.get('sciencePurpose')||'');}s.goals.giftedInstitution=String(d.get('giftedInstitution')||'');s.goals.giftedField=String(d.get('giftedField')||'');s.goals.admissionYear=String(d.get('admissionYear')||'');s.profile.region=String(d.get('region')||'');break;
 case 'competition':s.goals.competitionIntent=d.get('competitionIntent');w.competitionName=String(d.get('competitionName')||'');break;
 case 'school':s.goals.schoolTypes=d.getAll('schoolTypes');s.goals.medical=d.get('medical')==='yes';s.goals.institution=String(d.get('institution')||'');if(d.has('schoolAdmissionYear')){const year=String(d.get('schoolAdmissionYear')||'').trim();if(year&&!/^[1-9][0-9]{3}$/.test(year))throw Error('학교 목표 학년도는 4자리 연도로 입력하거나 비워 주세요.');s.goals.schoolAdmissionYear=year;}break;
 }
 if(step.startsWith('books:')){const key=step.split(':')[1];w.bookDrafts??={};w.bookDrafts[key]=String(d.get('bookName')||'');w.v10.bookDrafts??={};w.v10.bookDrafts[key]={...(w.v10.bookDrafts[key]||{}),...Object.fromEntries(d)};if(d.has('axisStatus'))w.axisStatus[key]=d.get('axisStatus');}
 if(step.startsWith('detail:')){const details=Object.fromEntries(d);if(details.volume!==undefined){const current=s.courses.find(c=>c.id===w.pendingCourseId);const parsed=parseCourseScope({...current,course:details.editBookName??current?.course,volume:details.volume,level:details.level||current?.level});if(parsed.source==='recorded_scope'&&!parsed.ambiguous&&['elementary','middle','high'].includes(parsed.level))details.level=parsed.level;}if(details.unitChoice)details.unit=details.unitChoice;if(details.isbnChoice)details.isbn=details.isbnChoice;if(d.has('completion')){const current=s.courses.find(c=>c.id===w.pendingCourseId);details.completion=d.get('completion')||current?.completion||'unknown';if(editedField==='completion'){details.completionInput=d.get('completion')?'reported':'unentered';details.completion=d.get('completion')||'unknown';}}saveBookDetails(s,details);if(d.has('editBookName')){const c=s.courses.find(c=>c.id===w.pendingCourseId),name=String(d.get('editBookName')).trim();if(!name)throw Error('교재 이름을 남겨 주세요.');c.course=name;}syncQuickCourseDraft(s,w.pendingCourseId);}
 const check=validateState(s);if(!check.valid)throw Error(check.errors.join('\n'));state=ensureWorkspace(s);
}
function showError(e){$('#error-message').textContent=e.message;$('#error-message').hidden=false;}
function render(focus=true){
 fullRouteMapView?.dispose();fullRouteMapView=null;
 progressSceneView?.dispose();progressSceneView=null;
 resultView?.dispose();resultView=null;
 aiHelper?.dispose();aiHelper=null;
 state=ensureWorkspace(state);
 monthlyScene?.dispose();monthlyScene=null;
 const switcher=document.querySelector('#profile-switch');
 const openSummaries=$('#main')?.dataset.step===state.wizard.step?[...document.querySelectorAll('#step-form details[open]')].map(detailKey):[];
 if(isBriefDetailStep(state))beginBrief(state);
 character?.destroy();character=null;const step=state.wizard.step,compact=isCompactStep(state),brief=briefDetailScreen(briefWorkingState(state),books),briefForm=!!brief||!!state.wizard.quick.academyDetail;
 const legacy=step==='overview'?quickScreen(state,standard):null;
 const view=brief|| (compact?compactScreen(state):step==='overview'?resultHubScreen(state,standard,legacy):step==='monthly'?monthlyScreen(state,standard):quickScreen(state,standard)||screen(state,catalog,personality,books,design,contract));
 document.body.classList.toggle('compact-entry',compact);
 if(compact)view.html+='<details class="compact-import"><summary>보관한 기록 파일 가져오기</summary><label class="field"><span>기록 파일 (JSON)</span><input type="file" data-import-state accept="application/json,.json"></label></details>';
 if(['target','premier'].includes(step))view.html+=academyPreparationMarkup();
 if(step==='overview')view.html=view.html.replace('<div data-ux-goals-slot></div>','<section class="ux-next-options">'+detailChoices(state)+academyChoices(state)+'</section>');
 if(step==='plan')view.html+='<section class="ux-next-options">'+detailChoices(state)+academyChoices(state)+'</section><div class="result-actions"><button type="button" data-monthly-action="open">월별 계획 보기</button></div>';
 if(step==='monthly'&&!monthlyView(state).reportId)view.html+=monthlyDetailContext(state);
 if(detailSession(state)&&!briefForm){view.next=step.startsWith('detail:')?'수정 내용을 저장하고 목록으로':'저장하고 로드맵으로';view.html+='<button type="button" class="quiet" data-purpose-none>지금은 관심 없어요</button>';}
 const phase=step==='intro'?'우리 아이 기준 로드맵':['age','birth','grade'].includes(step)?'아이 정보':['position','personality','personality-test','personality-result'].includes(step)?'현재 위치와 성향':['routes','plan'].includes(step)?'기준 경로':step.startsWith('books:')||step.startsWith('detail:')||['thinking','academy','depth-status'].includes(step)?'학습 이력':'목표와 시간';
 const quick=compact||['stage','learning','position-quick','target','overview'].includes(step),steps=['현재 공부','로드맵'],phaseIndex=step==='overview'?1:0;
 $('#app').innerHTML=`<div class="roadmap-app gfield-ui ux-calm"><header><a href="./" class="brand">GFIELD <span>학습 로드맵</span></a><div class="header-tools"><span id="save-status" role="status"></span><button type="button" class="quiet" data-export>기록 파일 저장</button><span id="profile-switch-slot"></span></div></header><main id="main" tabindex="-1" data-step="${esc(step)}" class="${compact?'compact-main':briefForm?'brief-detail-main':step==='intro'?'intro':''} ${step==='overview'?'result':''}">${quick?`<nav class="step-rail" aria-label="설문 진행">${steps.map((x,i)=>`<span ${phaseIndex===i?'aria-current="step"':''}>${i+1}<b>${x}</b></span>`).join('')}</nav>`:''}<div class="question-surface"><div class="guide-row">${characterMarkup()}<div class="bubble"><span class="doc-label">DOCSSAM</span><p>${esc(view.say)}</p></div></div><h1 id="question-title">${esc(view.title)}</h1><p id="error-message" role="alert" hidden></p><form id="step-form" aria-labelledby="question-title">${view.html}${briefForm?`<div class="navigation brief-navigation"><button type="submit" class="primary">${state.wizard.quick.academyDetail&&step==='hwangso'?'다음':'저장'}</button><button type="button" class="quiet" data-brief-cancel>나중에</button></div>`:`<div class="navigation">${state.wizard.history.length?'<button type="button" data-back>이전</button>':''}${!view.hideNext?`<button type="submit" class="primary">${esc(view.next||'다음')}</button>`:''}${!quick&&!['intro','plan','position','personality-test','routes','personality-result'].includes(step)?'<button type="button" class="quiet" data-skip>나중에 입력</button>':''}${state.wizard.quick.refining?'<button type="button" class="quiet" data-quick-overview>로드맵으로 돌아가기</button>':''}</div>`}</form></div><p id="save-error" role="alert" hidden></p><div class="recovery"><button type="button" data-retry-save>저장 다시 확인</button><button type="button" data-export>현재 기록 파일 저장</button></div></main><footer><a href="workspace.html?tab=evidence" data-workspace>표준 커리큘럼·근거</a><span>우리 아이의 현재 위치에서, 다음 배움으로.</span></footer></div>`;
 if(step==='routes'&&state.wizard.interests?.includes('other')){const branch=catalog.branches.find(b=>b.id==='B99'),select=$('[name="branchId"]');if(branch&&select&&![...select.options].some(o=>o.value===branch.id)){const option=document.createElement('option');option.value=branch.id;option.textContent=`${branch.id} · ${branch.title}`;select.append(option);if(state.wizard.v10.branchId===branch.id)select.value=branch.id;}}
 if(switcher)$('#profile-switch-slot').append(switcher);
 if(step==='monthly'){$('#main').classList.add('monthly');$('#step-form [data-skip]')?.remove();}
 for(const d of document.querySelectorAll('#step-form details'))if(openSummaries.includes(detailKey(d)))d.open=true;
 saveStatus();const mood=step==='plan'?'happy':['goals','routes'].includes(step)?'think':'listen';character=mountCharacter($('#docssam'),mood);
 if(step==='overview')aiHelper=mountAIHelper($('[data-ai-slot]')||$('[data-result-roadmap]'),{getState:()=>state});
 if(step==='overview')resultView=mountResultView($('[data-result-roadmap]'),{state});
 if(step==='overview'&&$('[data-full-route-map]'))fullRouteMapView=mountFullRouteMap($('[data-full-route-map]'),{state,data:{...standard,catalog,contract},onAction:action=>handleFullRouteAction(action).catch(showError)});
 if(step==='overview'&&$('[data-progress-scene]')){const host=$('[data-progress-scene]');try{progressSceneView=mountProgressScene(host,{state,data:standard});}catch{host.textContent='교재별 진도와 원표 비교에서 같은 내용을 볼 수 있어요.';host.dataset.renderer='unavailable';}if(host.dataset.renderer!=='ready')$('[data-source-progress]')?.setAttribute('open','');}
 if(step==='monthly'&&monthlyView(state).mode==='3d'){try{monthlyScene=mountRoadmapScene($('[data-monthly-scene]'),view.projection,{selectedMonth:monthlyView(state).month,onSelect:itemId=>{monthlyView(state).selectedItemId=itemId;changed();render(false);$('#monthly-selected')?.focus();}});}catch(e){$('[data-monthly-scene]').innerHTML='<p>3D 표시를 준비하지 못했습니다. 월표와 그래프에서 같은 내용을 확인할 수 있어요.</p>';}}
 if(focus){$('#main').focus({preventScroll:true});window.scrollTo({top:0});}
}
function transitionLearning(transition){
 const candidate=clone(state),next=transition(candidate);
 if(next!=='learning'){commitLearning(candidate,{sceneOnly:true});advance(candidate,next);}
 // Keep the editable scene intact when validating or saving the course fails.
 state=candidate;
}
async function handleFullRouteAction(action){
 if(typeof action!=='string')return;
 const [kind,value]=action.split(':');
 if(kind==='purpose'&&['science','gifted','competition','highSchool','other'].includes(value)){collect();advance(state,openDetail(state,value,state.wizard.step));changed();render();await persist();return;}
 if(kind==='academy'&&['premier','hwangso'].includes(value)){collect();advance(state,openAcademyDetail(state,value,state.wizard.step));changed();render();await persist();return;}
 if(kind==='direction'&&['current','faster','consolidate','deepen'].includes(value)){state.wizard.quick.learningDirection=value;changed();render();await persist();return;}
 if(action==='speed'){
  state.wizard.quick.learningDirection='faster';changed();render();
  const panel=document.querySelector('.personal-speed-comparison');
  if(panel){for(let e=panel;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true;panel.scrollIntoView({block:'start'});}
  await persist();return;
 }
}

async function closeBrief(){
 const session=briefSession(state),academy=state.wizard.quick.academyDetail;
 if(academy){advance(state,finishAcademyDetail(state,true));}
 else if(session){
  state=discardBrief(state);const optional=detailSession(state),q=state.wizard.quick;
  if(optional){q.detailStatuses??={};if(!q.detailStatuses[optional.id])q.detailStatuses[optional.id]='later';const next=optional.returnStep;delete q.optionalDetail;q.refining=false;advance(state,next);}
  else{if(state.wizard.step==='course-review')state.wizard.v10.pendingAcceptance=false;state.wizard.pendingCourseId='';q.refining=false;advance(state,session.returnStep);}
 }else{advance(state,'overview');}
 changed();render();await persist();
}
async function finishStep(skip=false){
 if(state.wizard.step==='monthly')return;
 collect();
 const briefBefore=briefSession(state);
 if(briefBefore&&skip){await closeBrief();return;}
 if(briefBefore){state=commitBrief(state);if(state.wizard.step.startsWith('detail:')){syncQuickCourseDraft(state,state.wizard.pendingCourseId);state.wizard.pendingCourseId='';advance(state,briefBefore.returnStep);changed();render();await persist();return;}if(['time','goals'].includes(state.wizard.step)&&briefBefore.returnStep==='overview'){state.wizard.quick.refining=false;advance(state,'overview');changed();render();await persist();return;}}
 if(isCompactStep(state)){
  const candidate=clone(state),previous=candidate.wizard.step;commitCompact(candidate);
  const check=validateState(candidate);if(!check.valid)throw Error(check.errors.join('\n'));
  candidate.wizard.history.push(previous);state=ensureWorkspace(candidate);changed();render();await persist();return;
 }
 const step=state.wizard.step,w=state.wizard;
 if(skip){w.skipped.push({step,at:new Date().toISOString()});}
 if(w.quick.academyDetail){advance(state,!skip&&w.step==='hwangso'?'hwangso-reason':finishAcademyDetail(state,skip));}
 else if(detailSession(state)&&!step.startsWith('detail:')){
  if(!skip&&step==='books:other'&&w.v10.bookDrafts?.other?.bookName?.trim())addInlineBook('other');
  advance(state,finishDetail(state,skip?'later':'entered'));
 }
 else if(step==='intro')advance(state,'stage');
 else if(step==='stage'){if(!/^(p[4-7]|초[1-6]|중[1-3]|고[1-3])$/.test(w.quick.stage))throw Error('나이 또는 학년을 선택해 주세요.');startScene(state);advance(state,'learning');}
 else if(step==='learning')transitionLearning(nextScene);
 else if(step==='position-quick')advance(state,preschool(state)?'target':'overview');
 else if(step==='target'){if(!['soma','fields','none','undecided'].includes(w.quick.target))throw Error('생각하는 방향을 하나 골라 주세요.');advance(state,'overview');}
 else if(step==='personality-result'&&w.quick.refining)advance(state,'overview');
 else if(step==='time'&&w.quick.refining)advance(state,'overview');
 else if(step==='goals'&&w.quick.refining)advance(state,'routes');
 else if(step==='course-review'){if(skip)markReview(state,w.reviewCourseId);if(!skip&&state.courses.length){const cid=w.reviewCourseId||state.courses[0].id;saveObservation(state,cid,w.observationDrafts?.[cid]||{help:'unknown',burden:'unknown',explanation:'unknown'});const o=w.courseObservations[cid];state=setAnswer(state,'Q15',{values:[o.depth==='unknown'?'모름':o.depth]},cid);state=setAnswer(state,'Q16',{values:[o.help==='unknown'?'기록 없음':o.help]},cid);state=setAnswer(state,'Q17',{values:[({unknown:'확인 안 함',example:'관찰한 예 입력',needs_help:'설명 도움 필요',answer_only:'답만 확인'})[o.explanation]],note:o.example},cid);for(const q of ['Q15','Q16','Q17'])state.courseAnswers[cid][q].scopeSnapshot=structuredClone(o.scope);delete state.wizard.observationDrafts[cid];markReview(state,cid);}if(w.v10.pendingAcceptance){const remaining=pendingReviews(state);if(remaining.length){state.wizard.reviewCourseId=remaining[0];}else commitPlan();}else advance(state,'routes');}
 else if(step==='personality-test'){
  const f=new FormData($('#step-form')),answer=f.get('personalityAnswer');
  if(answer===null)throw Error('답변 하나를 선택하거나 검사를 그만하고 계속할 수 있어요.');
  state.personality.answers[state.personality.cursor]=Number(answer);
  if(state.personality.cursor<9)state.personality.cursor++;else{state.personality.status='completed';state.personality.completedAt=new Date().toISOString();advance(state,'personality-result');}
 }else if(step.startsWith('books:')&&w.quick.addingBook){if(!skip&&w.v10.bookDrafts?.[step.split(':')[1]]?.bookName?.trim())addInlineBook(step.split(':')[1]);advance(state,'learning');w.quick.addingBook=false;
 }else if(step.startsWith('books:')&&!skip&&w.v10.bookDrafts?.[step.split(':')[1]]?.bookName?.trim()){
  const key=step.split(':')[1];addInlineBook(key);advance(state,w.quick.addingBook?'learning':nextV10(state,step));w.quick.addingBook=false;
 }else if(step.startsWith('detail:')){const key=step.split(':')[1];advance(state,`books:${key}`);w.pendingCourseId='';}
 else if(step==='academy'&&!skip&&w.academyDraft?.institution){addAcademy();return;}
 else if(step==='relation-editor'){saveRelation(state,w.v10.relationDraft);w.v10.relationDraft={};advance(state,'routes');}
 else if(step==='branch-review'){const session=w.v10.branchSession,qid=session?.qids[session.cursor];if(qid){const draft=w.v10.branchDraft||{values:[],note:''};const old=session.courseId?state.courseAnswers?.[session.courseId]?.[qid]:state.answers[qid];if(old){state.wizard.v10.branchAnswerHistory??=[];state.wizard.v10.branchAnswerHistory.push({questionId:qid,courseId:session.courseId,answer:structuredClone(old)});}state=setAnswer(state,qid,{values:draft.values.length?draft.values:['모름·확인 필요'],note:draft.note,sourceRole:'parent_report'},session.courseId||'');if(session.courseId)state.courseAnswers[session.courseId][qid].scopeSnapshot=structuredClone(courseScope(state.courses.find(c=>c.id===session.courseId)));if(qid==='Q43')recordHwangsoBranch(state,draft);state.wizard.v10.branchSession.cursor++;state.wizard.v10.branchDraft={};}else advance(state,'routes');}
 else if(step==='routes'){if(w.v10.plannedDraft?.name?.trim()){addPlanned(state,w.v10.plannedDraft);w.v10.plannedDraft={};}const queue=pendingReviews(state);if(queue.length){w.v10.pendingAcceptance=true;w.reviewCourseId=queue[0];advance(state,'course-review');}else commitPlan();}
 else{if(step==='hwangso'&&!skip)recordHwangsoTiming(state);if(step==='personality')state.personality.status='skipped';if(['science-detail','gifted'].includes(step)&&w.scienceCourse){let c=state.courses.find(c=>c.intakeOrigin==='science-detail');if(!c){c=addBook(state,'science',w.scienceCourse);c.intakeOrigin='science-detail';}c.course=w.scienceCourse;c.range=w.scienceRange||'';w.pendingCourseId='';}advance(state,nextV10(state));}
 changed();render();await persist();
}
function addInlineBook(key){const draft=state.wizard.v10.bookDrafts?.[key]||{};addBook(state,key,draft.bookName);saveBookDetails(state,{...draft,completion:draft.completion||'unknown',completionInput:draft.completion?'reported':'unentered',level:draft.level==='unknown'?levelFromScope(draft.volume):draft.level});state.wizard.bookDrafts[key]='';state.wizard.v10.bookDrafts[key]={};state.wizard.pendingCourseId='';}
 function commitPlan(){state=acceptV10(state);const p=state.plans.at(-1);p.adviceSnapshot=routeAdvice(state,books,personality,{courseIds:p.courseIds});p.bookMappingSnapshots=p.courseSnapshots.map(c=>({courseId:c.id,...mappingSnapshot(c,books)}));p.quickComparisonSnapshot={stage:state.wizard.quick.stage,target:state.wizard.quick.target,referenceLevel:state.wizard.quick.level,learningDirection:state.wizard.quick.learningDirection||'current',sourceHash:standard.source.sha256,policyChoices:{depthStyle:state.wizard.quick.depthStyle||'unknown',drillNeed:state.wizard.quick.drillNeed||'unknown',supportTime:state.wizard.quick.supportTime||'unknown',independentWork:state.wizard.quick.independentWork||'unknown'}};p.personalBaselineSnapshot=personalBaseline(state,standard);p.optionalDetailsSnapshot=detailSnapshot(state);}
 function addAcademy(){const d=state.wizard.academyDraft||{};const institution=d.institution==='other'?String(d.institutionOther||'').trim():d.institution;if(!institution)throw Error('학원 이름을 선택하거나 입력해 주세요.');const a={id:state.wizard.editAcademyId||`academy-${crypto.randomUUID()}`,institution,level:String(d.academyLevel||''),status:d.academyStatus||'unknown'};const index=state.wizard.academies.findIndex(x=>x.id===a.id);if(index>=0)state.wizard.academies[index]=a;else state.wizard.academies.push(a);state.wizard.academyDraft={};state.wizard.editAcademyId='';changed();render();}
async function saveWorkspaceTransition(next,hasReceipt){
 monthlyBusy=true;$('#step-form')?.setAttribute('inert','');
 const status=$('#monthly-status');if(status)status.textContent='선택한 변경을 저장하는 중입니다.';
 const adopt=(incoming,newRevision)=>{state=ensureWorkspace(incoming);revision=newRevision;state.revision=newRevision;savedGeneration=generation;saveError='';conflict=false;if(!isPersistent())monthlyView(state).message='이 창에만 반영됐습니다. 사본을 보관해 주세요.';};
 try{await persist();const check=validateState(next);if(!check.valid)throw Error(check.errors.join('\n'));const saved=await saveState(next,revision);adopt(next,saved.revision);}
 catch(error){
  if(status)status.textContent='저장 결과를 확인하고 있습니다.';
  let found=null;try{found=await loadState();}catch{}
  if(found?.state&&hasReceipt?.(found.state))adopt(found.state,found.revision);
  else {const collision=error.status===409||conflict;saveError=collision?'다른 창의 내용이 바뀌었습니다. 현재 사본을 보관한 뒤 최신 기록을 확인해 주세요.':'적용 여부를 확인하지 못했습니다. 같은 변경을 다시 확인할 수 있어요.';conflict=collision;throw error;}
 }finally{monthlyBusy=false;$('#step-form')?.removeAttribute('inert');saveStatus();}
}
async function handleMonthlyAction(button){
 if(monthlyBusy)return;collect();const action=button.dataset.monthlyAction,value=button.dataset.value;state=ensureWorkspace(state);const v=monthlyView(state);
 if(action==='open'){v.returnStep=state.wizard.step;advance(state,'monthly');if(!v.month)v.month=koreaDate().slice(0,7);changed();render();await persist();return;}
 if(action==='return-overview'){v.reportId='';advance(state,v.returnStep==='plan'?'plan':'overview');changed();render();await persist();return;}
 if(action==='speed'){
  const source=speedReference(state,personalBaseline(state,standard),standard.sourceMonthly,value);const oldStep=state.wizard.step;state=saveWorkspaceReference(state,source.template).state;const candidate=generateWorkspaceCandidate(state,source.input);state=candidate.state;const prepared=prepareWorkspaceChange(state,{operations:candidate.candidate.operations});state=prepared.state;const mv=monthlyView(state);mv.returnStep=oldStep;mv.reportId='';mv.editor=null;mv.candidateId=candidate.candidate.id;mv.previewId=prepared.preview.id;mv.pendingRequestId='';advance(state,'monthly');changed();render();await persist();return;
 }
 if(action==='view'){v.mode=value;changed();render(false);await persist();return;}
 if(action==='select-item'){v.selectedItemId=value;changed();render(false);$('#monthly-selected')?.focus();return;}
 if(action==='open-report'){v.reportId=value;changed();render();await persist();return;}
 if(action==='close-report'){v.reportId='';changed();render();await persist();return;}
 if(v.reportId)throw Error('보관한 보고서는 당시 내용을 유지합니다. 현재 계획으로 돌아가서 수정해 주세요.');
 if(action==='add'){v.editor={kind:value,fields:{}};v.previewId='';v.pendingRequestId='';changed();render();return;}
 if(action==='edit'){const item=projectionForMonthly(state).items.find(x=>x.id===value);if(!item)throw Error('수정할 항목을 확인해 주세요.');v.editor=editorForItem(item,state);v.previewId='';v.pendingRequestId='';changed();render();return;}
 if(action==='record'){v.editor={kind:'actual',fields:{learningId:value,recordKind:'progress'}};v.previewId='';v.pendingRequestId='';changed();render();return;}
 if(action==='cancel-item'){const item=projectionForMonthly(state).items.find(x=>x.id===value);v.editor={kind:'cancel',fields:{itemId:value,title:item?.title||''}};v.previewId='';changed();render();return;}
 if(action==='edit-link'){const link=projectionForMonthly(state).links?.find(x=>x.id===value);if(!link)throw Error('수정할 학습 연결을 확인해 주세요.');v.editor={kind:'link',fields:{...clone(link),learningId:link.itemId}};v.previewId='';v.pendingRequestId='';changed();render();return;}
 if(action==='detach-link'){const link=projectionForMonthly(state).links?.find(x=>x.id===value);if(!link)throw Error('해제할 학습 연결을 확인해 주세요.');const result=prepareWorkspaceChange(state,{operations:[{id:`op-${crypto.randomUUID()}`,type:'link.detach',linkId:link.id}]});state=result.state;monthlyView(state).previewId=result.preview.id;monthlyView(state).editor=null;monthlyView(state).candidateId='';monthlyView(state).pendingRequestId='';changed();render();await persist();return;}
 if(action==='close-editor'){v.editor=null;v.previewId='';changed();render();await persist();return;}
 if(action==='save-draft'){if(!v.editor)throw Error('작성 중인 항목이 없습니다.');const saved=saveWorkspaceDraft(state,{...clone(v.editor),id:v.editor.draftId});state=saved.state;monthlyView(state).editor.draftId=saved.draft.id;monthlyView(state).message=isPersistent()?'작성 중 내용을 보관했습니다. 아직 계획에 적용하지 않았어요.':'작성 중 내용은 이 창에만 있습니다. 사본을 보관해 주세요.';changed();render(false);await persist();return;}
 if(action==='open-draft'){const draft=state.workspace.drafts.find(x=>x.id===value);if(!draft)throw Error('초안을 찾지 못했습니다.');v.editor={kind:draft.kind,fields:clone(draft.fields||{}),draftId:draft.id};v.previewId='';changed();render();return;}
 if(action==='preview'){
  let operations;if(v.editor?.kind==='source'){const source=monthlyReference(state,standard),saved=saveWorkspaceReference(state,source.template);state=saved.state;const candidate=generateWorkspaceCandidate(state,source.input);state=candidate.state;operations=candidate.candidate.operations;monthlyView(state).candidateId=candidate.candidate.id;}
  else operations=monthlyOperations(state);
  const result=prepareWorkspaceChange(state,{operations});state=result.state;monthlyView(state).previewId=result.preview.id;monthlyView(state).pendingRequestId='';changed();render();await persist();return;
 }
 if(action==='return-editor'||action==='cancel-preview'){v.previewId='';v.pendingRequestId='';if(action==='cancel-preview')v.editor=null;changed();render();await persist();return;}
 if(action==='apply'){
  const operationIds=new FormData($('#step-form')).getAll('monthly:operationIds');await persist();const requestId=v.pendingRequestId||`monthly-apply-${crypto.randomUUID()}`;monthlyView(state).pendingRequestId=requestId;
  const result=applyWorkspaceChange(state,value,{requestId,operationIds});const target=monthlyView(result.state);target.previewId='';target.editor=null;target.pendingRequestId='';target.message=isPersistent()?'선택한 변경을 적용하고 보관했습니다.':'선택한 변경은 이 창에만 적용됐습니다. 사본을 보관해 주세요.';
  await saveWorkspaceTransition(result.state,incoming=>incoming.workspace?.applications?.some(x=>x.requestId===requestId));render();return;
 }
 if(action==='issue-report'){
  await persist();const title=new FormData($('#step-form')).get('monthly:reportTitle')||'우리 아이 월별 학습 계획';const result=issueWorkspaceReport(state,{title:String(title),previousReportId:v.previousReportId||undefined});monthlyView(result.state).message=isPersistent()?'현재 내용을 보고서로 보관했습니다. 이후 변경과 별도로 유지됩니다.':'이 창의 보고서입니다. 사본을 보관해 주세요.';
  await saveWorkspaceTransition(result.state,incoming=>incoming.workspace?.reports?.some(x=>x.id===result.report.id));render();return;
 }
}
document.addEventListener('input',e=>{if(monthlyBusy||!e.target.closest('#step-form')||(e.target.hasAttribute('data-scene-refresh')||e.target.hasAttribute('data-compact-refresh')||e.target.hasAttribute('data-compact-book-name')))return;try{collect(e.target.name);if(e.target.name==='giftedField'){const panel=$('[data-gifted-science]');if(panel)panel.hidden=!/과학/.test(e.target.value);}changed();}catch(err){showError(err);}});
document.addEventListener('change',e=>{if(monthlyBusy||!state?.wizard||!e.target.closest('#step-form')||state.wizard.step!=='monthly'||!e.target.name.startsWith('monthly:'))return;try{collect();changed();if(['monthly:month','monthly:axis','monthly:status','monthly:recordKind','monthly:learningId','monthly:scienceStage','monthly:sourceRow','monthly:candidateStart','monthly:selectedSteps'].includes(e.target.name)){const name=e.target.name;render(false);document.querySelector(`[name="${name}"]`)?.focus({preventScroll:true});}}catch(err){showError(err);}});
document.addEventListener('change',async e=>{if(e.target.hasAttribute('data-import-state')){try{const file=e.target.files?.[0];if(!file)return;if(file.size>4*1024*1024)throw Error('사본 크기를 확인해 주세요.');const data=JSON.parse(await file.text()),incoming=data.state||data,valid=validateState(incoming);if(!valid.valid)throw Error(valid.errors.join(' / '));const next=ensureWorkspace(ensureQuick(ensureV10(incoming))),fingerprint=s=>JSON.stringify({...s,revision:0});await saveWorkspaceTransition(next,found=>fingerprint(found)===fingerprint(next));render();}catch(err){showError(err);}finally{e.target.value='';}return;}if(!e.target.closest('#step-form'))return;try{collect(e.target.name);if(e.target.name==='reviewCourseId')state.wizard.reviewCourseId=e.target.value;changed();if(e.target.hasAttribute('data-scene-refresh')||e.target.hasAttribute('data-compact-refresh')||e.target.hasAttribute('data-compact-book-name')){render(false);document.querySelector(`[name="${e.target.name}"]`)?.focus({preventScroll:true});await persist();return;}if(['speed:step','speed:startMonth'].includes(e.target.name)){if(e.target.name==='speed:step')for(const key of ['identityConfirmed','scopeConfirmed','editionConfirmed','notStarted'])state.wizard.quick.speedComparison[key]=false;render(false);const panel=document.querySelector('.personal-speed-comparison');if(panel)panel.open=true;await persist();return;}if(['stage','referenceLevel','sourceSection','learningDirection','depthStyle','drillNeed','supportTime','independentWork','reportedAge','target'].includes(e.target.name)||e.target.name.startsWith('baselineLane:')||e.target.name.startsWith('progressLane:')){const name=e.target.name,value=e.target.value;render(false);(document.querySelector(`[name="${name}"][value="${value}"]`)||document.querySelector(`[name="${name}"]`))?.focus({preventScroll:true});return;}if(['sourceCurriculum','volume','unitChoice','isbn','isbnChoice'].includes(e.target.name)&&state.wizard.step.startsWith('detail:')){if(briefSession(state)){const focusName=e.target.name;render(false);document.querySelector(`[name="${focusName}"]`)?.focus({preventScroll:true});await persist();return;}const c=state.courses.find(c=>c.id===state.wizard.pendingCourseId),panel=$('[data-curriculum-detail]'),focusName=e.target.name;if(panel){panel.innerHTML=curriculumDetail(c,books);if(focusName!=='volume')panel.querySelector(`[name=${focusName}]`)?.focus({preventScroll:true});}}else if(e.target.name==='branchCourseId'){const session=state.wizard.v10.branchSession,b=catalog.branches.find(b=>b.id===session.branchId);session.courseId=e.target.value;session.cursor=0;session.qids=branchQuestions(state,b,session.courseId);render(false);}else if(['reviewCourseId','selectedCourseIds'].includes(e.target.name))render(false);}catch(err){showError(err);}});
let submitting=false;document.addEventListener('submit',async e=>{if(e.target.id!=='step-form')return;e.preventDefault();if(submitting)return;submitting=true;e.target.querySelector('button[type=submit]')?.setAttribute('disabled','');try{await finishStep();}catch(err){showError(err);}finally{submitting=false;$('#step-form button[type=submit]')?.removeAttribute('disabled');}});
document.addEventListener('click',async e=>{
 const button=e.target.closest('button,a[data-workspace]');if(!button)return;
 try{
  if(button.hasAttribute('data-brief-cancel')){await closeBrief();return;}
  if(button.dataset.resultTab){collect();state.wizard.quick.resultTab=button.dataset.resultTab;changed();render();await persist();return;}
  if(button.hasAttribute('data-scene-answer')){collect();transitionLearning(candidate=>chooseScene(candidate,button.dataset.sceneAnswer));changed();render();await persist();return;}
  if(button.hasAttribute('data-scene-progress')){collect();progressScene(state);changed();render();await persist();return;}
  if(button.hasAttribute('data-scene-academy-book')){collect();const institution=state.wizard.quick.draft['academy:institution'];if(institution==='other'&&!state.wizard.quick.draft['academy:name']?.trim())throw Error('학원 이름을 남기거나 선택하지 않음으로 바꿔 주세요.');academyBookScene(state);changed();render();await persist();return;}
  if(button.hasAttribute('data-scene-open')){collect();startScene(state,{track:button.dataset.sceneOpen,returnTo:state.wizard.step,editing:true,entry:'book'});advance(state,'learning');changed();render();await persist();return;}
  if(button.hasAttribute('data-scene-defer')){collect();transitionLearning(candidate=>deferScene(candidate,button.dataset.sceneDefer));changed();render();await persist();return;}
  if(button.dataset.monthlyAction){e.preventDefault();await handleMonthlyAction(button);return;}
  if(button.hasAttribute('data-academy-reference')){collect();const previous=state.wizard.step;const prepared=prepareWorkspaceChange(state,{operations:academyReferenceOperations(state)});state=prepared.state;const v=monthlyView(state);v.returnStep=previous;v.reportId='';v.editor=null;v.candidateId='';v.previewId=prepared.preview.id;v.pendingRequestId='';advance(state,'monthly');changed();render();await persist();return;}
  if(button.hasAttribute('data-personal-speed-refresh')){collect();changed();render(false);const panel=document.querySelector('.personal-speed-comparison');if(panel)panel.open=true;await persist();return;}
  if(button.dataset.sourceBlock){const [key,index]=button.dataset.sourceBlock.split(':'),model=standard.models.find(m=>m.id===state.wizard.quick.level)||standard.models[1],b=model.rows[key]?.[Number(index)];if(b){const from=standard.columns[b.start],to=standard.columns[b.end];$('#source-inspector').textContent=`${b.label} · ${from.age}세 ${from.month}월~${to.age}세 ${to.month}월`;document.querySelectorAll('[data-source-block]').forEach(e=>e.removeAttribute('aria-pressed'));button.setAttribute('aria-pressed','true');}return;}
  if(button.dataset.academyDetail){collect();advance(state,openAcademyDetail(state,button.dataset.academyDetail,state.wizard.step));changed();render();await persist();return;}
  if(button.dataset.purposeDetail){collect();advance(state,openDetail(state,button.dataset.purposeDetail,state.wizard.step));changed();render();await persist();return;}
  if(button.hasAttribute('data-purpose-none')){if(briefSession(state))state=discardBrief(state);else collect();advance(state,finishDetail(state,'none'));changed();render();await persist();return;}
  if(button.dataset.monthlyPurpose){collect();monthlyView(state).editor=monthlyDetailEditor(state,button.dataset.monthlyPurpose);monthlyView(state).previewId='';changed();render();await persist();return;}
  if(button.hasAttribute('data-quick-overview')){if(briefSession(state)){await closeBrief();return;}collect();const next=state.wizard.quick.academyDetail?finishAcademyDetail(state,true):detailSession(state)?finishDetail(state,'later'):'overview';state.wizard.quick.refining=false;advance(state,next);changed();render();await persist();return;}
  if(button.hasAttribute('data-quick-stage')||button.hasAttribute('data-quick-learning')||button.hasAttribute('data-quick-target')){collect();if(button.hasAttribute('data-quick-target'))advance(state,'target');else{startCompact(state,{reset:true});advance(state,'learning');}changed();render();await persist();return;}
  if(button.dataset.quickDetail){collect();state.wizard.quick.refining=true;advance(state,button.dataset.quickDetail);changed();render();await persist();return;}
  if(button.dataset.quickAdd){collect();if(state.wizard.quick.scene?.active){const key=markSceneBook(state);commitLearning(state,{sceneOnly:true});anotherBookScene(state,key);}else{commitLearning(state);state.wizard.quick.addingBook=true;advance(state,'books:'+button.dataset.quickAdd);}changed();render();await persist();return;}
  if(button.hasAttribute('data-quick-personality')){collect();const group=state.wizard.quick.personalityVersion;if(!['young','middle','high'].includes(group))throw Error('기존 검사 질문 묶음을 선택해 주세요.');const p=state.personality;if(p.answers.length)p.history.push(structuredClone({...p,history:undefined}));Object.assign(p,{status:'in_progress',group,answers:[],cursor:0});state.wizard.quick.refining=true;advance(state,'personality-test');changed();render();await persist();return;}
  if(button.hasAttribute('data-quick-save')){collect();commitPlan();state.wizard.quick.acceptedPlanId=state.activePlanId;advance(state,'overview');changed();render();await persist();return;}
  if(button.matches('[data-workspace]')){e.preventDefault();collect();changed();await persist();location.href=button.getAttribute('href');return;}
  if(button.hasAttribute('data-export')){const r=await exportState(state);$('#error-message').hidden=false;$('#error-message').textContent=r.message;return;}
  if(button.hasAttribute('data-retry-save')){if(conflict)throw Error('다른 창의 최신 기록을 확인하려면 현재 입력 사본을 보관한 뒤 새로고침해 주세요.');await persist();return;}
  if(button.hasAttribute('data-course-review')){collect();state.wizard.v10.pendingAcceptance=false;state.wizard.reviewCourseId||=state.courses[0]?.id;advance(state,'course-review');changed();render();await persist();return;}
  if(button.hasAttribute('data-back')){if(briefSession(state)){await closeBrief();return;}collect();if(backScene(state)){}else if(state.wizard.quick.academyDetail)advance(state,finishAcademyDetail(state,true));else if(detailSession(state)&&!state.wizard.step.startsWith('detail:'))advance(state,finishDetail(state,'later'));else if(state.wizard.step==='branch-review'&&state.wizard.v10.branchSession.cursor>0)state.wizard.v10.branchSession.cursor--;else if(state.wizard.step==='personality-test'&&state.personality.cursor>0)state.personality.cursor--;else{back(state);if(state.wizard.step==='learning'&&state.wizard.quick.compact&&state.wizard.quick.scene?.context!=='editing')startCompact(state);else if(state.wizard.step==='learning'&&state.wizard.quick.scene)state.wizard.quick.scene.active=true;}changed();render();await persist();return;}
  if(button.hasAttribute('data-skip')){await finishStep(true);return;}
  if(button.dataset.addBook){collect();addInlineBook(button.dataset.addBook);changed();render();await persist();return;}
  if(button.hasAttribute('data-add-planned')){collect();addPlanned(state,state.wizard.v10.plannedDraft);state.wizard.v10.plannedDraft={};changed();render();await persist();return;}
  if(button.dataset.editPlanned){collect();state.wizard.v10.plannedDraft=structuredClone(state.wizard.v10.plannedCourses.find(p=>p.id===button.dataset.editPlanned));render(false);return;}
  if(button.hasAttribute('data-add-relation')||button.dataset.editRelation){collect();state.wizard.v10.relationDraft=button.dataset.editRelation?structuredClone(state.wizard.v10.relations.find(r=>r.id===button.dataset.editRelation)):{};advance(state,'relation-editor');changed();render();await persist();return;}
  if(button.hasAttribute('data-branch-review')){collect();const b=catalog.branches.find(b=>b.id===state.wizard.v10.branchId);if(!b)throw Error('살펴볼 갈림길을 골라 주세요.');const courseId=/^B(?:0[3-9]|1[0-9]|2[0-2]|47|5[1-5]|6[0-4]|84|94|98)$/.test(b.id)?branchTarget(state,b):'';state.wizard.v10.branchSession={branchId:b.id,cursor:0,courseId,qids:branchQuestions(state,b,courseId)};advance(state,'branch-review');changed();render();await persist();return;}
  if(button.dataset.editBook){collect();if(briefSession(state)&&state.wizard.step==='books:other'){const working=briefWorkingState(state);state.wizard.v10.bookDrafts.other=clone(working.wizard.v10.bookDrafts.other||{});}const c=state.courses.find(c=>c.id===button.dataset.editBook);if(!c)throw Error('교재 기록을 확인해 주세요.');state.wizard.pendingCourseId=c.id;advance(state,`detail:${trackOf(c)}`);changed();render();await persist();return;}
  if(button.hasAttribute('data-add-academy')){collect();addAcademy();await persist();return;}
  if(button.dataset.editAcademy){collect();const a=state.wizard.academies.find(a=>a.id===button.dataset.editAcademy);state.wizard.editAcademyId=a.id;state.wizard.academyDraft={institution:['소마','필즈','시매쓰','CMS'].includes(a.institution)?a.institution:'other',institutionOther:a.institution,academyLevel:a.level,academyStatus:a.status};render();return;}
  if(button.hasAttribute('data-personality-start')){collect();if(beginPersonality(state))advance(state,'personality-test');changed();render();await persist();return;}
  if(button.hasAttribute('data-personality-skip')){state.personality.status='skipped';advance(state,state.wizard.quick.refining?'overview':'interests');changed();render();await persist();return;}
  if(button.hasAttribute('data-change-route')){state.wizard.history.push('plan');state.wizard.step='interests';state.wizard.selectedCourseIds=state.plans.find(p=>p.id===state.activePlanId)?.courseIds||null;changed();render();await persist();return;}
 }catch(err){showError(err);}
});
async function init(){try{await openStore();const urls=['data/catalog.json','data/contract.json','data/personality.json','data/book-catalog.json','data/design-v10.json','data/standard-preschool.json','data/source-monthly.json','data/workspace-source-register.json','data/source-public-labels.json'];const data=await Promise.all(urls.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('자료를 불러오지 못했습니다.');return r.json();}));[catalog,contract,personality,books,design,standard]=data;standard.sourceMonthly=data[6];standard.originalRegister=data[7];standard.sourcePublicLabels=data[8];const saved=await loadState();revision=saved.revision;state=ensureQuick(ensureV10(saved.state||createState(`${koreaDate()}T00:00:00Z`)));setBeforeProfileSwitch(async()=>{if(monthlyBusy)throw Error('지금 저장 중이에요. 저장이 끝나면 아이를 바꿀 수 있어요.');collect();changed();await persist();if(!isPersistent())throw Error('이 창에만 저장돼 있어요. 아이를 바꾸기 전에 현재 입력 사본을 보관해 주세요.');});render(false);}catch(e){$('#app').innerHTML=`<main><h1>로드맵을 불러오지 못했습니다.</h1><p role="alert">${esc(e.message)}</p><button onclick="location.reload()">다시 불러오기</button></main>`;}}
await init();
