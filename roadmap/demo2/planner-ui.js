(function(){
const $=id=>document.getElementById(id), P=Planner, I=PlannerIntake, D=DemoContent;
const opt=(el,list,sel)=>{ el.innerHTML=list.map(([v,t])=>`<option value="${v}"${String(v)===String(sel)?' selected':''}>${t}</option>`).join(''); };
const state={hwOn:'1',gifted:'1',planMode:'table',kmo:'switch'};
const d=new Date(); $('year').value=d.getFullYear();
opt($('mon'),[3,4,5,6,7,8,9,10,11,12,1,2].map(m=>[m,m+'월']),d.getMonth()+1);
opt($('school'),[...Array.from({length:12},(_,i)=>[i+1,P.SEM(i+1)+' 디딤돌']),[13,'초등 계통 대수심화'],...P.MID.map((x,i)=>[14+i,x+' 원리해설'])],9);
opt($('comp'),P.COMP.map((c,i)=>[i,c[0]]),4);
opt($('calc'),P.CALC.map((c,i)=>[i,c[0]]),9);
const months=n=>Array.from({length:n},(_,i)=>[i+1,(i+1)+'개월']);
opt($('schoolLeft'),months(4),1); opt($('compLeft'),months(7),7);
opt($('calcLeft'),months(6),1);

// 레벨: 고르면 그 레벨의 '지금 진도'를 레벨표에서 읽어 채운다(앞으로는 예시 로드맵 규칙)
const LV=window.PLANNER_LEVELS||[];
opt($('level'),[['ex','예시 · 강남권 소마 A 중위권 (L9 기준 사례)'],...LV.map(l=>[l.id,`학습 레벨 ${l.id} · ${l.summary}`]),['manual','직접 입력']],'ex');
const EX={school:9,schoolLeft:1,comp:4,compLeft:7,calc:9,calcLeft:1,speed:2};
const at=(bs,m)=>bs.find(b=>b[1]<=m&&b[2]>=m);
const nextOf=(bs,m,re)=>bs.filter(b=>b[2]>=m&&(!re||re.test(b[0]))).sort((a,b)=>a[1]-b[1])[0];
function schoolIdx(t){ let r=t.match(/^(\d)-(\d)/); if(r) return 2*(+r[1]-1)+(+r[2]); if(/계통|여유/.test(t)) return 13; r=t.match(/^중(\d)-(\d)/); if(r) return 14+2*(+r[1]-1)+(+r[2]-1); return null; }
function compIdx(t){ const K=[/초등팩토 1|킨더|키즈/,/필즈 베이직/,/1031 입문/,/TOT/,/1031 초급/,/1031 중급/,/3% 1과정/,/왕수학 응용 4/]; const i=K.findIndex(re=>re.test(t)); return i<0?null:i; }
function calcIdx(t){ let r=t.match(/기적의 계산법 (\d+)/); if(r) return +r[1]-1; if(/소마셈/.test(t)) return 1; const i=P.CALC.findIndex(c=>t.includes(c[0].replace('기적의 ',''))); return i<0?null:i; }
function hwOptions(){
  const g=+$('grade').value, now=P.mOf(g,+$('mon').value), A0=P.mOf(g,3), list=[];
  for(let m=now+2;m<=Math.min(A0+45,P.mOf(4,11));m++) if(m%12===10||m%12===1) list.push([m,`${P.label(m)}${m%12===1?' (편입)':''}`]);
  const cur=$('hw').value; opt($('hw'),list,list.some(x=>String(x[0])===cur)?cur:((list.find(x=>x[0]%12===1)||list[0]||[''])[0]));
}
function setSeg(k,v){ state[k]=String(v); document.querySelectorAll(`.seg[data-k="${k}"] button`).forEach(b=>{const on=b.dataset.v===String(v);b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));}); }
function applyLevel(){
  const id=$('level').value; if(id==='manual') return;
  const set=(k,v)=>{ $(k).value=String(v); };
  if($('band').value!=='D') $('band').value=P.bandOf(id); $('speed').disabled=['C','D'].includes($('band').value);
  if(id==='ex'){ Object.entries(EX).forEach(([k,v])=>set(k,v)); hwOptions(); setSeg('hwOn',1); return; }
  const L=LV.find(l=>l.id===id), now=P.mOf(+$('grade').value,+$('mon').value);
  const sb=(at(L.school,now)&&schoolIdx(at(L.school,now)[0])!=null)?at(L.school,now):nextOf(L.school,now,/^\d-\d|^중|계통|여유/);
  if(sb){ set('school',schoolIdx(sb[0])); set('schoolLeft',Math.min(4,Math.max(1,sb[1]>now?sb[2]-sb[1]+1:sb[2]-now+1))); }
  const cb=at(L.comp,now)||nextOf(L.comp,now), ck=cb&&compIdx(cb[0]);
  if(ck!=null){ set('comp',ck); set('compLeft',Math.min(7,Math.max(1,cb[1]>now?P.COMP[ck][1]:cb[2]-now+1))); }
  const kb=at(L.calc,now)||nextOf(L.calc,now), kk=kb&&calcIdx(kb[0]);
  if(kk!=null){ set('calc',kk); set('calcLeft',Math.min(6,Math.max(1,kb[1]>now?kb[2]-kb[1]+1:kb[2]-now+1))); }
  set('speed',+id.slice(1)>=10?3:2);
  hwOptions(); const E=L.hwExam;
  if(E!=null&&[...$('hw').options].some(o=>o.value===String(E))){ set('hw',E); setSeg('hwOn',1); } else setSeg('hwOn',0);
}
function read(){ const on=state.hwOn==='1'; return {band:$('band').value,grade:+$('grade').value,mon:+$('mon').value,year:+$('year').value,school:+$('school').value,schoolLeft:+$('schoolLeft').value,comp:+$('comp').value,compLeft:+$('compLeft').value,calc:+$('calc').value,calcLeft:+$('calcLeft').value,speed:+$('speed').value,
  hw:on&&$('hw').value?$('hw').value:'none',hwDeep:on&&$('hwDeep').checked,hwMid:on&&$('hwMid').checked,gifted:state.gifted==='1',kmo:state.kmo}; }
function draw(){
  drawJourney();
  const profile=I.profile(answers,intakeFields(),read());drawIntake(profile);if(I.sourceMode(answers,intakeFields())){drawSourceProfile(profile);return;}
  const o=read(), plan=I.buildPlan(answers,intakeFields(),o); lastPlan=plan; const nm=$('name').value.trim()||'우리 아이';
  $('who').textContent=nm; $('who2').textContent=nm;
  $('hwOpts').style.display=state.hwOn==='1'&&['A','B'].includes(plan.band)?'block':'none';
  $('kmoChoice').style.display=plan.band==='D'?'block':'none';
  $('warn').innerHTML=plan.warn.map(w=>`<div class="warn">⚠ ${w}</div>`).join('');
  const R=k=>(plan.rows.find(r=>r.key===k)||{blocks:[]}).blocks, cur=k=>{ const b=R(k).find(x=>x[1]<=plan.now&&x[2]>=plan.now); return b?b[0]:'—'; };
  const strip=t=>t.replace(/<br>.*$/,'');
  $('nowItems').innerHTML=[['📘','교과',strip(cur('school'))],['📗','심화',strip(cur('school2'))],['💡',plan.band==='D'?'경시':'사고력',strip(cur('comp'))],['➕','연산',strip(cur('calc'))]].map(([i,a,b])=>`<div class="item"><span class="ic">${i}</span><div><small>${a}</small><b>${b}</b></div></div>`).join('');
  const ms=P.milestones(plan), steps=ms.main.filter(x=>x.kind!=='now'&&x.m>plan.now), next=steps[0], later=steps[1];
  $('dNow').innerHTML=`● 현재 <small>${P.label(plan.now)} · ${cur('school').replace(/ 디딤돌.*/,'')}</small>`;
  $('dNext').innerHTML=next?`⚑ 다음 과정 <small>${next.title} · ${P.label(next.m)}</small>`:'⚑ 다음 과정';
  $('dLater').innerHTML=later?`⌖ 그다음 <small>${later.title} · ${P.label(later.m)}</small>`:'⌖ 시기 미정';
  drawMap(mapMilestones(plan));
  drawRoutes(plan);
  saveDraft();
  $('tbl').innerHTML=P.renderTable(plan); if(plan.A1-plan.A0>50) $('tbl').querySelector('table').classList.add('wide'); $('simple').innerHTML=P.renderSimple(plan);
  $('tbl').style.display=state.planMode==='table'?'block':'none'; $('simple').style.display=state.planMode==='simple'?'block':'none';
  $('stages').innerHTML=I.narrative(plan).map(y=>`<div class="stg"><h4>${y.title}</h4>
    <div class="mrow">${y.months.map(c=>`<div class="mc${c.now?' now':''}${c.past?' past':''}"><b>${c.mon}</b>${c.starts.map(t=>`<span class="st">${t}</span>`).join('')}${c.issues.map(t=>`<span class="is">${t}</span>`).join('')}</div>`).join('')}</div>
    <dl class="cm">${y.items.map(it=>`<dt>${it.label}</dt><dd>${it.text}</dd>`).join('')}</dl></div>`).join('');
  const lvName=$('level').selectedOptions[0].textContent;
  $('repItems').innerHTML=[['📖','현재 학습',`${strip(cur('school'))} · ${strip(cur('comp'))}`],['👤','기준 레벨',`${lvName} · ${plan.bandName}`],['💡','다음 과정',next?`${next.title} (${P.label(next.m)})`:'—'],['📅','다음 확인','학습 경험 후 조정 · 경로는 언제든 바꿀 수 있어요']]
    .map(([i,a,b])=>`<div class="ritem"><span class="ic">${i}</span><div><small>${a}</small><b>${b}</b></div></div>`).join('');
  const bg=P.bookGuide(plan);
  $('books').innerHTML=bg.stages.map(st=>`<div class="bk${st.now?' now':''}"><h4>${st.stage}${st.now?' <span>지금</span>':''}</h4>${st.rows.map(([l,b])=>`<p><small>${l}</small>${b}</p>`).join('')}</div>`).join('')+`<p class="bk-note">${bg.note}</p>`;
}
// 3D 맵: three.js(map3d.js, 수의 나라와 같은 three · 아이 캐릭터). WebGL 이 없으면 CSS 맵.
let map3d=null, mapBusy=null, mapNext=null, map3dFailed=false;
function drawMap(ms){
  if(!completed)return;
  if(map3dFailed){ $('map').innerHTML='<p class="map-unavailable">3D를 불러오지 못했어요. 위 갈림길과 아래 이정표에서 같은 경로를 확인할 수 있어요.</p>'; return; }
  mapNext=ms; if(mapBusy) return;
  mapBusy=(async()=>{ while(mapNext){ const d=mapNext; mapNext=null;
    try{ if(!map3d){ const mod=await import('./map3d.js'); map3d=await mod.mountMap3D($('map'),d,{onSelect:openCourse}); if(!map3d) throw new Error('no webgl'); } else await map3d.update(d); }
    catch(e){ console.warn('[map3d]',e); map3dFailed=true; $('map').innerHTML='<p class="map-unavailable">3D를 불러오지 못했어요. 위 갈림길과 아래 이정표에서 같은 경로를 확인할 수 있어요.</p>'; break; } }
    mapBusy=null; })();
}
let lastPlan=null;
function showView(v){ document.querySelectorAll('.nav button,.dock .vsw button').forEach(b=>b.classList.toggle('on',b.dataset.v===v)); document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===v));const exploring=v==='vmap'&&!!(flowMode||caseActive||studyActive);document.body.classList.toggle('exploring',exploring);$('pathwayCoach').hidden=!exploring;if(v==='vmap'&&map3dFailed) P.bindMap($('map')); }
document.querySelectorAll('.nav button,.dock .vsw button').forEach(b=>b.addEventListener('click',()=>{showView('vmap');setWorkspaceView(({vmap:'map',vplan:'table',vrep:'records'})[b.dataset.v]);mobileWorkspace('result');}));
document.querySelectorAll('.seg').forEach(s=>s.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; setSeg(s.dataset.k,b.dataset.v); draw(); }));
['hw','hwDeep','hwMid'].forEach(id=>$(id).addEventListener('change',()=>{ $('level').value='manual'; draw(); }));
$('openSet').onclick=()=>{if(studyActive)closeStudy(false);askStudent();}; $('detailSet').onclick=()=>ask('grade'); $('closeSet').onclick=()=>{ $('drawer').classList.remove('on'); $('drawer').inert=true; $('detailSet').focus(); };
document.addEventListener('keydown',e=>{if(!$('drawer').classList.contains('on'))return;if(e.key==='Escape')$('closeSet').click();if(e.key==='Tab'){const list=[...$('drawer').querySelectorAll('button,select,input,summary')].filter(x=>!x.disabled&&x.offsetParent);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const PROG=['school','schoolLeft','comp','compLeft','calc','calcLeft','speed','band'];
$('ctl').addEventListener('change',e=>{
 const id=e.target.id,savedHw=state.hwOn;
 if(id==='grade'){answers.grade=$('grade').value;answers.gradeInput='current';if(collegeState.enabled&&collegeState.school.format==='kr'){collegeState.school.level=answers.grade;saveCollege();}}
 if(id==='grade'||id==='mon'){
  if(I.gradeChoice(answers,intakeFields())){applyAnswerChanges('grade');hwOptions();}
  else{hwOptions();applyLevel();}
 }else if(id==='level'){applyLevel();syncDetailedAnswers(id);Object.keys(manualPeriods).forEach(k=>delete manualPeriods[k]);}
 else if(id==='band'||id==='speed'){applyAnswerChanges(id);}
 else if(PROG.includes(id)){
  if(I.gradeChoice(answers,intakeFields()))syncDetailedAnswers(id);
  for(const axis of ['school','comp','calc'])if(id===axis||id===axis+'Left')manualPeriods[axis+'Left']=true;
 }
 if(PROG.includes(id))$('level').value='manual';
 if(Object.hasOwn(answers,'hw'))setSeg('hwOn',savedHw);
 $('speed').disabled=['C','D'].includes($('band').value);draw();
});
$('name').addEventListener('input',draw);

const answers={}, history=[],manualPeriods={},pendingStatus={};let completed=false,legacyDraft=null,editReturn=null;
const storageKey='gfield.demo2.v1',studentKey='gfield.demo2.student.v1';let studentProfile=PlannerStudentVisual.profile(null),studentNext=null;try{studentProfile=PlannerStudentVisual.profile(JSON.parse(PlannerStorage.getItem(studentKey)));}catch{}
function openStudentChoice(next=null){studentNext=next;$('studentChoiceContent').innerHTML=PlannerStudentVisual.selection({...careerContext(),gender:studentProfile.gender});$('studentChoiceDialog').showModal();}
const draftIds=['level','band','year','grade','mon','school','schoolLeft','comp','compLeft','calc','calcLeft','speed','hw','hwDeep','hwMid'];
function saveDraft(){try{PlannerStorage.setItem(storageKey,JSON.stringify({version:2,answers,history,completed,question,state,manualPeriods,pendingStatus,legacyDraft,editReturn,fields:Object.fromEntries(draftIds.map(id=>[id,$(id).type==='checkbox'?$(id).checked:$(id).value]))}));}catch{}}
function restoreDraft(){try{const d=JSON.parse(PlannerStorage.getItem(storageKey));if(![1,2].includes(d?.version))return false;legacyDraft=d.version===1?d:d.legacyDraft||null;editReturn=d.editReturn?.mode==='custom'?d.editReturn:null;Object.assign(manualPeriods,d.manualPeriods||{});Object.assign(pendingStatus,d.pendingStatus||{});for(const id of draftIds){const v=d.fields?.[id];if(v===undefined)continue;if($(id).type==='checkbox')$(id).checked=!!v;else if(id!=='hw')$(id).value=String(v);}hwOptions();if([...$('hw').options].some(o=>o.value===d.fields.hw))$('hw').value=d.fields.hw;Object.assign(answers,d.answers);if(restoredRoadmapMode?.signature===JSON.stringify(answers)){standardPattern=restoredRoadmapMode.pattern||null;standardAccepted=!!restoredRoadmapMode.accepted;}Object.assign(state,d.state);Object.keys(state).forEach(k=>setSeg(k,state[k]));history.push(...(d.history||[]));completed=!!d.completed;$('speed').disabled=['C','D'].includes($('band').value);const missing=I.firstMissing(answers,intakeFields());if(d.question==='student'&&!completed){draw();askStudent();}else if(d.question==='welcome'&&!completed){draw();showWelcome();}else if(completed&&!missing)finish(true);else{draw();const order=questionOrder();ask(missing&&(completed||order.indexOf(missing)<order.indexOf(d.question))?missing:order.includes(d.question)?d.question:missing||'grade');}return true;}catch{return false;}}
let question='grade';
function syncDetailedAnswers(id){
 const all=id==='level';for(const [axis,status]of [['school','schoolStatus'],['comp','thinkingStatus'],['calc','calcStatus']])if(all||id===axis||id===axis+'Left')delete pendingStatus[status];
 if(all||['school','schoolLeft'].includes(id)){const n=+$('school').value;answers.schoolCourse=n<=12?'elem':'mid';answers.school=n<=12?P.SEM(n):'advanced';if(n>=13)answers.schoolExact=String(n);answers.schoolBook=n<=12?(I.schoolBooks.includes(answers.schoolBook)&&!I.middleBook(answers.schoolBook)?answers.schoolBook:'디딤돌 응용'):I.middleBook(answers.schoolBook)?answers.schoolBook:'개념원리';answers.schoolStatus='progress';}
 if(all||['comp','compLeft'].includes(id)){const n=+$('comp').value;answers.thinking=({0:'초등팩토',1:'PRE 1031',2:'1031 입문',4:'1031 초급'})[n]||'advanced';if(n===1)answers.preDone='1';if(answers.thinking==='advanced')answers.compExact=String(n);answers.thinkingStatus='progress';}
 if(all||['calc','calcLeft'].includes(id)){const n=+$('calc').value;answers.calc=n>=1&&n<=5?'기적의 계산법 '+(n+1)+'권':'advanced';if(answers.calc==='advanced')answers.calcExact=String(n);answers.calcStatus='progress';}
}
function intakeFields(){const schoolContext=collegeState?.enabled?collegeState.school:null;return {schoolContext,internationalCalendar:!!(schoolContext?.format&&schoolContext.format!=='kr'),year:$('year')?.value,grade:$('grade').value,mon:$('mon').value,band:$('band').value,speed:$('speed').value,pendingStatus};}
function questionOrder(){return I.order(answers,intakeFields());}
function askStudent(){if(completed&&roadmapMode==='custom'&&!caseActive&&!editReturn)editReturn={mode:'custom',flow:flowMode,page:flowMode==='science'?sciencePage:flowMode==='language'?languagePage:flowMode==='career'?careerPage:flowMode==='college'?collegePage:flowMode==='transition'?transitionPage:flowMode==='progression'?progressPage:flowMode==='pathway-plan'?planPage:overviewPage,view:workspaceView,active:pathwayActiveId};leavePathway();completed=false;question='student';$('questionOptions').dataset.question='student';$('intakeLater').hidden=true;document.body.classList.add('questioning');$('conversation').hidden=false;$('questionStep').textContent='처음 질문';$('questionTitle').textContent='학생의 성별을 선택해 주세요.';$('questionHelp').textContent='선택한 캐릭터가 아이의 로드맵을 함께 따라갑니다.';$('questionOptions').innerHTML=PlannerStudentVisual.selection({...careerContext(),gender:studentProfile.gender});$('questionBack').disabled=true;drawJourney();showView('vmap');mobileWorkspace('choice');saveDraft();}
function deferQuestion(){const key=question,a=I.questions(answers,intakeFields())[key]?.[2]||[];if(a.some(([v])=>v==='pending'))answers[key]='pending';else if(a.some(([v])=>v==='unknown'))answers[key]='unknown';else{const parent=key.startsWith('school')?'schoolCourse':key.startsWith('deep')?'deepCourse':key.startsWith('calc')?'calc':['thinking','thinkingStatus','compExact','preDone'].includes(key)?'thinkingExperience':null;if(!parent)return;answers[parent]='unknown';}history.push(key);const next=I.firstMissing(answers,intakeFields());if(next)ask(next);else finish();}

function applyAnswerChanges(key){
 const result=I.fieldChanges(answers,intakeFields(),key);
 if(!['band','speed','age','grade'].includes(key)){
  const axis=key.startsWith('school')?'school':key.startsWith('calc')?'calc':['thinking','thinkingStatus','compExact','preDone'].includes(key)?'comp':null;
  if(axis)delete manualPeriods[axis+'Left'];
 }
 Object.entries(result).forEach(([k,v])=>{if($(k)&&!(['band','speed'].includes(key)&&manualPeriods[k]))$(k).value=v;});
}

function ask(key){
 if(typeof historyState!=='undefined'&&historyState.active)closeHistory(false);
 if(completed&&roadmapMode==='custom'&&!caseActive&&!editReturn)editReturn={mode:'custom',flow:flowMode,page:flowMode==='science'?sciencePage:flowMode==='language'?languagePage:flowMode==='career'?careerPage:flowMode==='college'?collegePage:flowMode==='transition'?transitionPage:flowMode==='progression'?progressPage:flowMode==='pathway-plan'?planPage:overviewPage,view:workspaceView,active:pathwayActiveId};
 if(caseActive)closeCase(false);
 leavePathway();
 const order=questionOrder();if(!order.includes(key)){const next=I.firstMissing(answers,intakeFields());if(next)ask(next);else finish();return;}
 question=key;completed=false;document.body.classList.add('questioning');$('conversation').hidden=false;
 const selected=key==='grade'?I.gradeChoice(answers,intakeFields()):answers[key];
 const [title,help,options]=I.questions(answers,intakeFields())[key];$('questionTitle').textContent=title;$('questionHelp').textContent=help;
 $('questionStep').textContent='질문 '+(order.indexOf(key)+1)+' / '+order.length+' · 언제든 바꿀 수 있어요';$('questionOptions').dataset.question=key;
 $('questionOptions').innerHTML=options.map(([v,t])=>`<button data-answer="${v}" aria-pressed="${String(selected)===v}">${t}${String(selected)===v?'<span>선택됨</span>':''}</button>`).join('');
 $('intakeLater').hidden=['grade','age'].includes(key);$('questionBack').disabled=!history.length&&key!=='grade';drawJourney();showView('vmap');mobileWorkspace('choice');saveDraft();requestAnimationFrame(()=>$('questionTitle').focus({preventScroll:true}));
}
function finish(restoring=false){
 const back=editReturn;editReturn=null;completed=true;document.body.classList.remove('questioning');$('conversation').hidden=true;$('milestoneDetails').open=false;
 if(back){pathwayActiveId=pathwayTrail.includes(back.active)?back.active:null;roadmapMode='custom';standardAccepted=false;workspaceView=['map','graph','table','records'].includes(back.view)?back.view:'map';draw();
  if(back.flow==='language')openLanguage(languageState.active,back.page);else if(back.flow==='reference')openReferencePlan();else if(back.flow==='career')openCareer(back.page);else if(back.flow==='transition')openTransition(back.page);else if(back.flow==='progression')openProgress(back.page);else if(back.flow==='pathway-plan'&&pathwayTrail.length)openPathwayPlan(back.page);else if(back.flow==='pathway'&&pathwayTrail.length)openPathway(pathwayActiveId||pathwayTrail.at(-1));else if(back.flow==='college')openCollege(back.page);else if(back.flow==='school-goal')openSchoolGoal();else if(back.flow==='science')openScience(true,scienceState.enabled,back.page);else openOverview(['home','school','study','goals'].includes(back.page)?back.page:'home');
  saveRoadmapMode();saveDraft();mobileWorkspace('result');return;
 }
 if(!restoring){roadmapMode='standard';standardAccepted=false;}draw();showStandard(false);
}
function saveRoadmapMode(){PlannerStorage.setItem('gfield.demo2.roadmap-mode.v1',JSON.stringify({version:1,mode:roadmapMode,pattern:standardPattern,accepted:standardAccepted,signature:JSON.stringify(answers)}));}
function showStandard(remember=true){if(historyState.active)closeHistory(false);leavePathway();document.body.classList.remove('questioning');$('conversation').hidden=true;roadmapMode='standard';workspaceView='map';showView('vmap');drawJourney();mobileWorkspace('result');if(remember)saveRoadmapMode();}
function enterCustom(){roadmapMode='custom';standardAccepted=false;const baseline=PlannerStandard.model(answers,intakeFields(),{pattern:standardPattern,calcDaysPerWeek,supplement:supplementDecision});if(T.inheritCadence)transition=T.inheritCadence(transition,progression,answers,intakeFields(),baseline.level,baseline.sequential?'deep':'thinking');saveRoadmapMode();saveTransition();openOverview();}

$('questionOptions').onclick=e=>{const student=e.target.closest('[data-student-gender]');if(student?.dataset.studentGender){studentProfile=PlannerStudentVisual.profile({version:1,gender:student.dataset.studentGender});PlannerStorage.setItem(studentKey,JSON.stringify(studentProfile));ask(I.firstMissing(answers,intakeFields())||'grade');return;}if(handleCollegeClick(e))return;const flow=e.target.closest('[data-flow-overview]');if(flow?.dataset.flowOverview){openOverview();return;}if(e.target.closest('[data-start]')?.dataset.start){askStudent();return;}const b=e.target.closest('[data-answer]');if(!b)return;const key=question,v=b.dataset.answer,previous=answers[key];answers[key]=v;if(key==='grade'){answers.gradeInput='current';if(collegeState.enabled&&collegeState.school.format==='kr'){collegeState.school.level=v==='pre'?null:v;saveCollege();}}const dependent=({schoolCourse:'schoolStatus',deepCourse:'deepStatus',schoolBook:'schoolStatus',school:'schoolStatus',schoolHigh:'schoolStatus',schoolExact:'schoolStatus',schoolHigh:'schoolStatus',deepBook:'deepStatus',deepStage:'deepStatus',thinking:'thinkingStatus',compExact:'thinkingStatus',calc:'calcStatus',calcExact:'calcStatus',calcHigh:'calcStatus'})[key];if(dependent&&previous!==v)pendingStatus[dependent]=true;if(key.endsWith('Status'))delete pendingStatus[key];history.push(key);
 if(key==='hw'||key==='gifted')setSeg(key==='hw'?'hwOn':'gifted',v);
 else {if(key==='schoolExact')answers.school='advanced';applyAnswerChanges(key);if(!['age','grade'].includes(key))$('level').value='manual';if(key==='age'||key==='grade')hwOptions();}
 const revisit=key==='schoolCourse'&&!I.special(v)?'schoolBook':key==='deepCourse'&&!I.special(v)?'deepBook':key==='thinkingExperience'&&v==='yes'?'thinking':key==='schoolBook'&&!I.special(v)?(I.highBook(v)?'schoolHigh':I.middleBook(v)?'schoolExact':'school'):key==='deepBook'&&!I.special(v)?'deepStage':key==='grade'&&v==='pre'?'age':key==='thinking'&&v==='advanced'?'compExact':key==='thinking'&&v==='PRE 1031'&&answers.thinkingStatus?'preDone':key==='school'&&v==='advanced'?'schoolExact':key==='calc'&&v==='advanced'?'calcExact':null;const next=revisit||I.firstMissing(answers,intakeFields());if(next)ask(next);else finish();
};
$('questionBack').onclick=()=>{let key;do{key=history.pop();}while(key&&!questionOrder().includes(key));if(key)ask(key);else if(question==='grade')askStudent();};
$('useExample').onclick=()=>showCase();
function mapMilestones(plan){const ms=plan.sourceProfile?I.milestones(answers,intakeFields(),plan.sourceProfile):P.milestones(plan);ms.forks.forEach(f=>{if(answers[f.id==='hw'?'hw':'gifted']==='pending'){f.pending=true;f.reason='아직 고민 중이에요. 준비 일정은 추가하지 않았어요.';}});return PlannerCourseGuide.decorate(ms,{...plan,audience:I.audience(answers,intakeFields())});}
function drawRoutes(plan){
 const ms=mapMilestones(plan);
 $('routeChoices').innerHTML=ms.forks.map(f=>{
   const key=f.id==='hw'?'hw':'gifted',pending=answers[key]==='pending',unknown=!Object.hasOwn(answers,key);
   const choices=[[true,f.yes],[false,f.no]].map(([yes,t])=>{const selected=!pending&&yes===f.selected;return `<button data-fork-choice="${f.id}" data-value="${yes?'1':'0'}" aria-pressed="${selected}"><small>${yes?'선택':'미선택'} 경로</small>${t}${selected?`<b>${unknown?'예시 경로':'✓ 현재 경로'}</b>`:''}</button>`;}).join('');
   const undecided=`<button data-fork-choice="${f.id}" data-value="pending" aria-pressed="${pending}">아직 고민 중</button>`;
   return `<section class="route-choice" aria-label="${f.title} 경로"><strong>${f.title} 경로</strong>${pending||unknown?`<small class="pending-choice">${pending?'아직 고민 중 · 준비 일정 미추가':'아직 미정 · 예시 경로 표시'}</small>`:''}<div class="fork-options" data-fork="${f.id}"><span class="fork-origin">기존 학습</span>${choices}${undecided}<span class="fork-rejoin">다음 학습에 합류</span></div><p>${f.reason}</p></section>`;
 }).join('');
 if(['A','B'].includes(plan.band)&&!ms.forks.some(f=>f.id==='hw'))$('routeChoices').insertAdjacentHTML('afterbegin','<section class="route-choice" aria-label="생각하는 황소 시험 안내"><strong>생각하는 황소 시험 안내</strong><p>이 예시의 시험 선택은 초4 11월까지예요. 현재 학년에서는 교과·사고력 학습을 이어가요.</p></section>');
 if(['C','D'].includes(plan.band)&&Object.hasOwn(answers,'hw')){const choice={1:'네',0:'아니요',pending:'아직 고민 중'}[answers.hw];$('routeChoices').insertAdjacentHTML('afterbegin',`<section class="route-choice" aria-label="생각하는 황소 고려 답변"><strong>생각하는 황소 고려 · ${choice}</strong><p>답은 보존했어요. 이 묶음에는 생각하는 황소 준비 일정을 추가하지 않아요.</p></section>`);}
 $('answerSummary').textContent=plan.sourceProfile?plan.sourceProfile.nowLabel+' · 답을 바꾸면 다음 학습도 함께 바뀌어요.':P.label(plan.now)+' · '+plan.band+' '+plan.bandName+' · 선택한 답을 바꾸거나 상세 조정할 수 있어요.';
 $('mapList').innerHTML=ms.main.map((m,i)=>`<button data-focus="${i}" aria-haspopup="dialog" aria-controls="courseDetail"><b>${i+1}. ${esc(m.title)}</b><small>${esc(m.sub)}</small></button>`).join('');
}
$('routeChoices').onclick=e=>{const b=e.target.closest('[data-fork-choice]');if(!b)return;const k=b.dataset.forkChoice==='hw'?'hwOn':'gifted';setSeg(k,b.dataset.value);answers[k==='hwOn'?'hw':'gifted']=b.dataset.value;draw();};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function drawIntake(profile){
 const fields=intakeFields(),active=I.effective(answers),items=I.summary(answers,fields),source=I.sourceMode(answers,fields),labels=I.learningLabels(answers,fields);document.body.classList.toggle('source-mode',source);
 $('intakeSummary').hidden=!I.gradeChoice(answers,fields);$('intakeSummary').innerHTML=items.map(it=>{
 const edit=it.key==='school'?'schoolCourse':it.key==='deepBook'?'deepCourse':it.key==='thinking'?'thinkingExperience':it.key;
 const statusKey=({thinking:'thinkingStatus',school:'schoolStatus',deepBook:'deepStatus',calc:'calcStatus'})[it.key];
 const canStatus=it.key==='thinking'?!I.noThinking(answers)&&answers.thinking:it.key==='school'?(I.schoolBooks.includes(active.schoolBook)||I.highBook(active.schoolBook)):it.key==='deepBook'?I.deepBooks.includes(active.deepBook):it.key==='calc'?!I.special(answers.calc)&&answers.calc:false;
 const label=labels[it.key]||it.label;
 return `<div class="answer-chip"><button data-edit="${edit}"><small>${label}</small><b>${esc(it.text)}</b></button>${canStatus?`<button class="answer-status" data-edit="${statusKey}" aria-label="${label} 진행 상태 바꾸기">상태 바꾸기</button>`:''}</div>`;
 }).join('');
 $('sourceProfile').hidden=!I.gradeChoice(answers,fields);const best=profile.comparison.best;
 $('sourceProfile').innerHTML=best?`<details class="source-comparison"><summary>진도 비교 · 가까운 예시: 학습 레벨 ${best.id}</summary><p>학습 레벨은 진도표를 구분하는 이름이에요. 현재 진도와 다섯 가지 예시를 비교했어요.</p><div class="level-comparison">${profile.comparison.levels.map(l=>`<span class="${l.id===best.id?'closest':''}"><b>학습 레벨 ${l.id}</b><small>${esc(l.shortSummary.replace(/황소/g,'생각하는 황소'))}</small>${D.fmtSigned(l.avg)}</span>`).join('')}</div><p>${best.bothOK?'교과와 연산이 현재 사고력 학습을 함께 받쳐주고 있어요.':'사고력과 교과·연산의 속도를 함께 살펴보면 좋아요.'}</p></details>`:'';
}
$('intakeSummary').onclick=e=>{const b=e.target.closest('[data-edit]');if(b)ask(b.dataset.edit);};
function drawSourceProfile(profile){
 const fields=intakeFields(),labels=I.learningLabels(answers,fields),items=I.summary(answers,fields).slice(1).map(it=>({...it,label:labels[it.key]||it.label})),ms=I.milestones(answers,fields,profile),plan={sourceProfile:profile,now:profile.now,band:'source',choices:{hw:answers.hw==='1',gifted:answers.gifted==='1'}};lastPlan=plan;
 $('who').textContent='우리 아이';$('who2').textContent='우리 아이';$('hwOpts').style.display='none';$('kmoChoice').style.display='none';$('warn').innerHTML='';
 $('nowItems').innerHTML=items.map(it=>`<div class="item"><div><small>${it.label}</small><b>${esc(it.text)}</b></div></div>`).join('');
 const plans=profile.rows.map(row=>{const actual=items.find(i=>i.key===(row.key==='thinking1'?'thinking':row.key==='deep'?'deepBook':row.key));return `<section class="intake-plan-card"><h3>${labels[row.key]}</h3><p class="intake-current">지금 · ${esc(actual?.text||row.current.shortText)}</p><ol>${row.remaining.slice(0,4).map((b,i)=>`<li><b>${esc(b.sourceCurrent?actual?.text.replace(/ 진행 중$/,'')||b.shortText:b.shortText)}</b><small>${I.labelMonth(b.remainingStart)}~${I.labelMonth(b.e)}</small></li>`).join('')||'<li>다음 단계는 학습을 확인하며 정해요.</li>'}</ol></section>`;}).join('');
 const missing=items.filter(it=>!profile.rows.some(r=>(r.key==='thinking1'?'thinking':r.key==='deep'?'deepBook':r.key)===it.key)).map(it=>`<section class="intake-plan-card"><h3>${it.label}</h3><p class="intake-current">지금 · ${esc(it.text)}</p><p>다음 단계는 실제 진도를 확인하며 정해요.</p></section>`).join('');
 $('tbl').innerHTML=(plans+missing)?`<div class="intake-plan">${plans}${missing}</div>`:'<p>답을 더하면 현재 과정과 다음 학습을 함께 볼 수 있어요.</p>';$('simple').innerHTML=$('tbl').innerHTML;
 $('tbl').style.display=state.planMode==='table'?'block':'none';$('simple').style.display=state.planMode==='simple'?'block':'none';
 $('stages').innerHTML=items.map(it=>`<div class="stg"><h4>${it.label}</h4><p>${esc(it.text)} · 이 답을 기준으로 학습을 살펴봐요.</p></div>`).join('');
 $('repItems').innerHTML=items.map(it=>`<div class="ritem"><div><small>${it.label}</small><b>${esc(it.text)}</b></div></div>`).join('');
 $('books').innerHTML=profile.rows.map(row=>`<div class="bk"><h4>${labels[row.key]}</h4><p>${esc(row.current.shortText)}</p>${row.next?`<p><small>다음 예시</small>${esc(row.next.shortText)}</p>`:'<p>이후 단계는 학습을 확인하며 정해요.</p>'}</div>`).join('')+`<p class="bk-note">진행 중인 과정은 진도 예시의 중간 지점으로 보고 있어요. 실제 학습 속도에 맞춰 조정해 주세요.</p><details><summary>함께 보는 학습</summary>${D.originalRows().filter(r=>['thinking2','home'].includes(r.key)).map(r=>`<h4>${esc(r.shortTitle)}</h4><p>${r.blocks.map(b=>esc(D.shortText(b.text))).join(' · ')}</p>`).join('')}</details>`;
 $('dNow').innerHTML='● 현재 <small>'+profile.nowLabel+'</small>';$('dNext').innerHTML=ms.main[1]?'다음 · '+esc(ms.main[1].title):'다음 학습 확인';$('dLater').innerHTML=ms.main[2]?'함께 · '+esc(ms.main[2].title):'학습 속도에 맞춰 조정';
 drawMap(mapMilestones(plan));drawRoutes(plan);saveDraft();
}
let courseOrigin=null;
function showCourseDialog(){
 if(!$('courseDetail').open){courseOrigin=document.activeElement===document.body?$('journeyMap').querySelector('[data-pathway-open="'+(pathwayTrail.at(-1)||'')+'"]')||$('journeyTitle'):document.activeElement;$('courseDetail').showModal();}
 $('courseContent').scrollTop=0;$('closeCourse').focus({preventScroll:true});
}
function coursePractice(s){
 if(!s.sequence)return '';
 return `<details class="course-practice"><summary>공부 순서·병행 방법·다음 확인</summary><ol>${s.sequence.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><h4>함께 이어갈 공부</h4><p>${esc(s.parallel)}</p><h4>다음 단계로 넘어가기 전에</h4><p>${esc(s.check)}</p></details>`;
}
function openCourse(node){
 if(!node)return;
 const course=node.course||PlannerCourseGuide.detail(node,{...lastPlan,audience:I.audience(answers,intakeFields())});
 const status=course.title.match(/\s(진행 중|완료)$/);
 $('courseTitle').innerHTML=esc(status?course.title.slice(0,status.index):course.title)+(status?` <span class="course-title-status">${esc(status[1])}</span>`:'');
 $('courseContent').innerHTML=`<p class="course-context">${esc(course.context)}</p>${course.sections.map(s=>{const level=s.books.match(/^(학습 레벨 L\d+~L\d+) 표준 교재: (.+)$/);return `<section>${course.sections.length>1?`<h3>${esc(s.title)}</h3>`:''}<p class="course-summary">${esc(s.summary)}</p><div class="course-book"><div class="course-book-heading"><h4>교재</h4>${level?`<span class="course-level">${esc(level[1])}</span>`:''}</div><p class="course-book-title">${esc(level?level[2]:s.books)}</p><p class="course-book-other">${esc(s.other)}</p></div><aside class="course-advice"><h4>독쌤의 한마디</h4><p>${esc(s.advice)}</p></aside>${coursePractice(s)}</section>`;}).join('')}`;
 const entry=course.sections.length>1?'elem':course.sections[0]?.guideKey||'unknown';
 $('courseContent').insertAdjacentHTML('beforeend',`<section class="pathway-next"><h3>이 과정에서 이어갈 로드맵</h3><div class="pathway-options"><button type="button" data-pathway-entry="${esc(entry)}"><strong>다음 갈림길 살펴보기</strong><span>병행·보완과 다음 과정의 공부 방법을 골라봐요.</span></button></div></section>`);
 $('courseContent').insertAdjacentHTML('beforeend',bookStudyButtons());
 showCourseDialog();
}
$('closeCourse').onclick=()=>$('courseDetail').close();
$('courseDetail').addEventListener('close',()=>{const target=courseOrigin?.isConnected?courseOrigin:$('journeyMap').querySelector('[data-pathway-open="'+(pathwayTrail.at(-1)||'')+'"]')||$('journeyTitle');target?.focus({preventScroll:true});courseOrigin=null;});
$('courseDetail').addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const list=[...$('courseDetail').querySelectorAll('button,summary,a[href]')].filter(x=>!x.disabled&&x.getClientRects().length),first=list[0],last=list.at(-1);
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
$('mapList').onclick=e=>{const b=e.target.closest('[data-focus]');if(!b||!lastPlan)return;const index=+b.dataset.focus;map3d?.focus(index);openCourse(mapMilestones(lastPlan).main[index]);};

function showWelcome(){
 leavePathway();
 question='welcome';completed=false;document.body.classList.add('questioning');$('conversation').hidden=false;
 $('questionTitle').textContent='지금의 공부에서, 다음 가능성으로.';$('questionHelp').textContent='현재 학습을 바탕으로 교재와 공부 방법을 함께 살펴봅니다. 갈림길을 고르면 오른쪽에 아이의 학습 로드맵이 이어집니다.';
 $('questionStep').textContent='우리 아이를 위한 학습 계획 설계';
 $('questionOptions').dataset.question='welcome';$('questionOptions').innerHTML='<button type="button" data-start="1">로드맵 만들기 →</button><button type="button" data-flow-overview="home">공부 방향 먼저 살펴보기</button><button type="button" data-college-open="school">중·고등·국제교육과정에서 대학까지 설계</button>';$('questionBack').disabled=true;
 showView('vmap');drawJourney();saveDraft();
}
let journeyModel=null;
const pathwayKey='gfield.demo2.explore.v1',X=PlannerPathways;
const personalityKey='gfield.demo2.personality.v1',Y=PlannerPersonality;
const flowKey='gfield.demo2.flow.v1',planKey='gfield.demo2.pathway-plan.v1',R=PlannerPathwayPlan;
const G=PlannerProgression,progressKey='gfield.demo2.progression.v1';
const T=PlannerTransition,transitionKey='gfield.demo2.transition.v1';
const academyLinesKey='gfield.demo2.academy-lines.v1';let academyLines=T.restoreAcademyLines(null);
try{academyLines=T.restoreAcademyLines(JSON.parse(PlannerStorage.getItem(academyLinesKey)));}catch{}
const preschoolDetailKey='gfield.demo2.preschool-detail.v1';let preschoolDetailId=window.PlannerPreschoolDetail?.restoreId(null)||'fast-premier',preschoolDetailOpen=false;
try{const saved=JSON.parse(PlannerStorage.getItem(preschoolDetailKey));if(saved?.version===1)preschoolDetailId=window.PlannerPreschoolDetail?.restoreId(saved.id)||preschoolDetailId;}catch{}
function preschoolDetailHtml(){return completed&&I.gradeChoice(answers,intakeFields())==='pre'&&!intakeFields().internationalCalendar?window.PlannerPreschoolDetail?.render(preschoolDetailId,{open:preschoolDetailOpen})||'':'';}
function handlePreschoolDetail(button){
 if(!button?.dataset.preschoolDetail||!window.PlannerPreschoolDetail)return false;
 preschoolDetailId=window.PlannerPreschoolDetail.restoreId(button.dataset.preschoolDetail);preschoolDetailOpen=true;
 PlannerStorage.setItem(preschoolDetailKey,JSON.stringify({version:1,id:preschoolDetailId}));drawJourney();
 $('journeyMap').querySelector('[data-preschool-detail="'+preschoolDetailId+'"]')?.focus({preventScroll:true});return true;
}
let roadmapMode='standard',standardPattern=null,standardAccepted=false,restoredRoadmapMode=null,restoredMobilePane=null;
try{const stored=JSON.parse(PlannerStorage.getItem('gfield.demo2.roadmap-mode.v1'));if(stored?.version===1){restoredRoadmapMode=stored;standardPattern=null;standardAccepted=false;}}catch{}
let workspaceView='map',workspaceCourse=null,restoredWorkspaceView=null,standardAxis=null,calcDaysPerWeek=5,supplementDecision=null;
const caseKey='gfield.demo2.case.v1';
let caseActive=false,caseState=PlannerCase.restore(null),caseRoutes=PlannerCaseRoutes.restore(null),caseSaved=null,caseReturnView='map',caseReturnPane='choice';
const L=PlannerLanguage,languageKey='gfield.demo2.language.v1';let languageState=L.empty(),languagePage='current';try{languageState=L.restore(JSON.parse(PlannerStorage.getItem(languageKey)));}catch{}
const CR=PlannerCareer,careerKey='gfield.demo2.career.v1';let careerState=CR.empty(),careerPage='interests';try{careerState=CR.restore(JSON.parse(PlannerStorage.getItem(careerKey)));}catch{}
const HC=PlannerCounsellingHistory,historyKey='gfield.demo2.counselling-history.v1';
const cohortKey='gfield.demo2.premier2020.v1';let cohortState=window.PlannerPremierCohort?.empty()||{version:1,choices:{}};
try{cohortState=window.PlannerPremierCohort?.restore(JSON.parse(PlannerStorage.getItem(cohortKey)))||cohortState;}catch{}
function handleCohortChoice(button){
 const pc=window.PlannerPremierCohort;if(!historyState.active||!pc?.isCase(historyState.caseId)||!button?.dataset.cohortChoice)return false;
 const m=pc.model(HC.model(historyState).index,cohortState);
 if(!m.selected.choices.some(c=>c.id===button.dataset.cohortChoice))return true;
 cohortState=pc.choose(cohortState,m.selected.id,button.dataset.cohortChoice);PlannerStorage.setItem(cohortKey,JSON.stringify(cohortState));drawHistoryJourney();
 $('pathwayCoachContent').querySelector('[data-cohort-choice="'+button.dataset.cohortChoice+'"]')?.focus({preventScroll:true});return true;
}
const SP=PlannerStudyPlan,SPV=PlannerStudyPlanView,studyKey='gfield.demo2.study-plan-grade5.v1';
let studyActive=false,studyState=SP.restore(null),studySaved=null,studyReturnView='map',studyReturnPane='result';
try{studySaved=JSON.parse(PlannerStorage.getItem(studyKey));studyState=SP.restore(studySaved?.state);}catch{}
function rememberStudy(){PlannerStorage.setItem(studyKey,JSON.stringify({version:1,active:studyActive,state:studyState,view:workspaceView,pane:document.body.dataset.workspacePane||'result',returnView:studyReturnView,returnPane:studyReturnPane}));}
let historyState=HC.empty(),historySaved=null;
try{historySaved=HC.restore(JSON.parse(PlannerStorage.getItem(historyKey)));historyState={...historySaved,active:false};}catch{}
function rememberHistory(){historyState.view=workspaceView;historyState.pane=document.body.dataset.workspacePane||'result';PlannerStorage.setItem(historyKey,JSON.stringify(historyState));}
const RP=PlannerReferencePlan,referencePlanKey='gfield.demo2.reference-plan.v1';let referencePlan=RP.empty();
try{referencePlan=RP.restore(JSON.parse(PlannerStorage.getItem(referencePlanKey)),HC.CASES);}catch{}
function saveReferencePlan(){PlannerStorage.setItem(referencePlanKey,JSON.stringify(referencePlan));}
function referenceContext(){
 const context=pathwayContext(),current=context.currentStudy,base={ready:completed,current,giftedAllowed:Q.institutePolicy(scienceState.schoolGoal,context.grade).allowed};if(!completed)return base;
 if(intakeFields().internationalCalendar||I.highBook(I.effective(answers).schoolBook))return {...base,coursePlanning:true,notes:{book:current.school,deep:current.deep,science:K.scienceLabel(collegeState),tempo:'현재 과목의 학습량과 복습 계획 확인',table:[current.thinking,current.calc].filter(Boolean).join(' / '),center:'영재원 대비는 기존 공부에 별도 추가',goal:Q.GOALS[scienceState.schoolGoal]?.title||'진학 목표 선택 전'}};
 const d=T.detail(transition,progression,answers,intakeFields()),custom=roadmapMode!=='standard',standard=PlannerStandard.model(answers,intakeFields(),{pattern:standardPattern,calcDaysPerWeek,supplement:supplementDecision});
 const sc=S.normalContext(standard,custom&&d.book&&d.range?T.timeline({...d.s,axis:'school'},progression,answers,intakeFields()):null,intakeFields()),science=scienceState.enabled?S.model(scienceState,sc):null;
 const school=custom&&d.book&&d.range?d.book.book+' · '+d.range.title:current.school;
 const deep=custom&&d.deep?(d.deep.id==='none'?'별도 심화 추가 보류':d.rows[0]?.deep||current.deep):current.deep;
 const load=custom&&d.s.tempo==='gradual'?(d.s.allocation==='advance'?(T.LOADS.find(x=>x.id===d.s.load)?.title||'추가 회차 선택 전')+' · 기존 복습·심화·연산 유지':T.ALLOCATIONS.find(x=>x.id===d.s.allocation)?.title||'늘릴 학습량의 용도 선택 전'):'현재 학습량 유지';
 return {...base,notes:{book:school,deep:[deep,custom&&d.s.cadence?d.cadenceTitle:''].filter(Boolean).join(' · '),science:science?[science.orderLabel,science.terms[0]?.title||''].filter(Boolean).join(' · '):'과학 과정 선택 전',tempo:load,table:[current.thinking,current.calc].filter(Boolean).join(' / '),center:science?.state.institute!=='none'&&science?.institute?science.institute:'영재원 대비는 기존 공부에 별도 추가',goal:Q.GOALS[scienceState.schoolGoal]?.title||'진학 목표 선택 전'}};
}
function openReferencePlan(source=null){
 if(source){referencePlan=RP.start(source.s.caseId,source.selected.id,HC.CASES,referencePlan);saveReferencePlan();}
 if(!RP.origin(referencePlan,HC.CASES))return;
 const previousMode=roadmapMode;flowMode='reference';coach('우리 아이 계획에는 무엇을 참고할까요?','현재 공부는 이어가며, 사례에서 참고할 부분을 선택해 주세요.');roadmapMode=previousMode;saveRoadmapMode();
 $('pathwayCoachContent').innerHTML=RP.render(referencePlan,HC.CASES,referenceContext());workspaceView='map';drawJourney();rememberFlow();mobileWorkspace('choice');focusFlow();
}
function referenceClick(b){
 if(b.hasAttribute('data-reference-return')||b.dataset.referenceSource){if(b.dataset.referenceSource){referencePlan=RP.revisit(referencePlan,b.dataset.referenceSource,HC.CASES);saveReferencePlan();}const m=RP.origin(referencePlan,HC.CASES);if(!m)return true;historyState=HC.choose(historyState,'case',m.caseId);historyState=HC.choose(historyState,'stage',String(HC.CASES[m.caseId].stages.findIndex(s=>s.id===m.stageId)));showHistory(m.caseId);return true;}
 if(b.hasAttribute('data-reference-choices')){referencePlan={...referencePlan,enabled:true};saveReferencePlan();openReferencePlan();return true;}
 if(b.hasAttribute('data-reference-dismiss')){referencePlan={...referencePlan,enabled:false};saveReferencePlan();if(flowMode==='reference'){flowMode=null;if(roadmapMode==='standard')showStandard(false);else openOverview();rememberFlow();}else drawJourney();return true;}
 if(b.hasAttribute('data-reference-intake')){editReturn={mode:'custom',flow:'reference',view:workspaceView,active:null};if(!studentProfile.gender)askStudent();else ask(I.firstMissing(answers,intakeFields())||'grade');return true;}
 if(!b.dataset.referenceTopic&&!b.dataset.referenceStep)return false;
 const context=referenceContext();referencePlan=b.dataset.referenceStep?RP.revisit(referencePlan,b.dataset.referenceStep,HC.CASES):RP.choose(referencePlan,b.dataset.referenceTopic,HC.CASES,context);const target=RP.destination(referencePlan,HC.CASES,context);if(!target)return true;saveReferencePlan();
 if(target.kind==='transition')openTransition(target.page);
 else if(target.kind==='science')openScience(true,false);
 else if(target.kind==='college')openCollege(target.page);
 else if(target.kind==='goal')openSchoolGoal();
 else if(target.kind==='gifted'){choosePathway(null,'center');openPathway('center');}
 else if(target.kind==='table'){openReferencePlan();setWorkspaceView('table');}
 mobileWorkspace(target.kind==='table'?'result':'choice');return true;
}
const Q=PlannerSchoolGoals,S=PlannerScience,scienceKey='gfield.demo2.science.v1';
const K=PlannerCollege,BK=PlannerBookChecks,collegeKey='gfield.demo2.college.v1',bookCheckKey='gfield.demo2.book-checks.v1';
let collegeState=K.empty(),collegePage='school',bookChecks=BK.restore(null),bookDescriptor=null;
try{collegeState=K.restore(JSON.parse(PlannerStorage.getItem(collegeKey)));}catch{}
try{bookChecks=BK.restore(JSON.parse(PlannerStorage.getItem(bookCheckKey)));}catch{}

let scienceState=S.restore(null),caseScience=S.restore(null,true),caseScienceOpen=false,caseGoalOpen=false;
try{scienceState=S.restore(JSON.parse(PlannerStorage.getItem(scienceKey)));}catch{}
try{caseSaved=JSON.parse(PlannerStorage.getItem(caseKey));caseState=PlannerCase.restore(caseSaved?.state);caseRoutes=PlannerCaseRoutes.restore(caseSaved?.routes);caseScience=S.restore(caseSaved?.science,true);caseScienceOpen=!!caseSaved?.scienceOpen;caseGoalOpen=!!caseSaved?.goalOpen;}catch{}
try{const view=JSON.parse(PlannerStorage.getItem('gfield.demo2.workspace.v1'));if(['map','graph','table','records'].includes(view?.view))restoredWorkspaceView=workspaceView=view.view;workspaceCourse=view?.course||null;if(view?.supplementDecision?.version===1)supplementDecision=view.supplementDecision;if([3,5].includes(view?.calcDaysPerWeek))calcDaysPerWeek=view.calcDaysPerWeek;restoredMobilePane=view?.pane||null;if(['school','comp','calc'].includes(view?.standardAxis))standardAxis=view.standardAxis;}catch{}
function rememberCase(){PlannerStorage.setItem(caseKey,JSON.stringify({version:1,active:caseActive,state:caseState,routes:caseRoutes,science:caseScience,scienceOpen:caseScienceOpen,goalOpen:caseGoalOpen,view:workspaceView,returnView:caseReturnView,returnPane:caseReturnPane,pane:document.body.dataset.workspacePane||'result'}));}
function rememberWorkspace(){if(studyActive){rememberStudy();return;}if(historyState.active){rememberHistory();return;}if(caseActive){rememberCase();return;}try{PlannerStorage.setItem('gfield.demo2.workspace.v1',JSON.stringify({version:1,view:workspaceView,course:workspaceCourse,standardAxis,calcDaysPerWeek,supplementDecision,pane:document.body.dataset.workspacePane||'choice'}));}catch{}}
function applyAcademyLines(){
 for(const b of $('journeyMap').querySelectorAll('[data-academy-beam]')){
  const on=academyLines[b.dataset.academyBeam];b.setAttribute('aria-pressed',String(on));
  const label=b.querySelector('[data-academy-state]');if(label)label.textContent=on?'켬':'끔';
 }
 for(const layer of $('journeyMap').querySelectorAll('[data-academy-beam-layer]'))layer.setAttribute('aria-hidden',String(!academyLines[layer.dataset.academyBeamLayer]));
}
function academyBeamClick(b){
 if(!T.ACADEMY_LINES.some(x=>x.id===b.dataset.academyBeam))return false;
 academyLines=T.toggleAcademyLine(academyLines,b.dataset.academyBeam);
 PlannerStorage.setItem(academyLinesKey,JSON.stringify(academyLines));applyAcademyLines();return true;
}
function setWorkspaceView(view,focus=false){
 if(!['map','graph','table','records'].includes(view))return;
 workspaceView=view;rememberWorkspace();
 $('atlasExpand').dataset.atlasFull=view==='graph'?'graph':'map';
 if(PlannerFullscreen.isOpen())$('atlasFullscreenTitle').textContent=view==='graph'?'진도와 속도 비교':view==='table'?'월별 교재와 병행 계획':'우리 아이의 공부 지도';
 for(const pane of $('journeyMap').querySelectorAll('[data-workspace-panel]'))pane.hidden=pane.dataset.workspacePanel!==view;
 for(const tab of $('journeyMap').querySelectorAll('[data-workspace-view]')){if(tab.getAttribute('role')!=='tab')continue;const on=tab.dataset.workspaceView===view;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;}
 if(focus)$('workspace-tab-'+view)?.focus({preventScroll:true});PlannerPresentation.refresh($('journeyMap'));document.querySelectorAll('.top .nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===({map:'vmap',graph:'vrep',table:'vplan',records:'vrep'})[view]));
}
function mobileWorkspace(panel){document.body.dataset.workspacePane=panel;document.querySelectorAll('[data-mobile-workspace]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mobileWorkspace===panel)));rememberWorkspace();}
mobileWorkspace('choice');
let transition=null,transitionPage='book';try{transition=JSON.parse(PlannerStorage.getItem(transitionKey));}catch{}
let progression=null,progressPage='goal';try{progression=JSON.parse(PlannerStorage.getItem(progressKey));}catch{}
let pathwayPlan=null,planPage='books';try{const v=JSON.parse(PlannerStorage.getItem(planKey));if(v?.version===1&&typeof v.path==='string')pathwayPlan=v;}catch{}
let restoredFlow=null;try{const v=JSON.parse(PlannerStorage.getItem(flowKey));if(v?.version===1)restoredFlow=v;}catch{}
function rememberFlow(){try{PlannerStorage.setItem(flowKey,JSON.stringify({version:1,mode:flowMode,page:flowMode==='science'?sciencePage:flowMode==='language'?languagePage:flowMode==='career'?careerPage:flowMode==='college'?collegePage:flowMode==='transition'?transitionPage:flowMode==='progression'?progressPage:flowMode==='pathway-plan'?planPage:overviewPage,active:pathwayActiveId}));}catch{}}
let flowMode=null,overviewPage='home';
let personalityState=Y.empty(),personalityNotice='';
try{personalityState=Y.restore(JSON.parse(PlannerStorage.getItem(personalityKey)));}catch{}
function updatePersonality(value){
 personalityState=Y.restore(value);personalityNotice='';
 try{PlannerStorage.setItem(personalityKey,JSON.stringify(personalityState));}
 catch{personalityNotice='지금 결과는 이 화면에서 볼 수 있어요. 새로고침하면 선택이 남지 않을 수 있어요.';}
 openPersonality();
}
function personalityClick(b){
 const action=b.dataset.personalityAction;
 if(action){updatePersonality(action==='previous'?Y.previous(personalityState):Y.empty(action==='skip'?'skipped':'group'));return true;}
 if(b.dataset.personalityGroup){updatePersonality(Y.selectGroup(personalityState,b.dataset.personalityGroup));return true;}
 if(b.hasAttribute('data-personality-choice')){updatePersonality(Y.choose(personalityState,Number(b.dataset.personalityChoice)));return true;}
 if(b.dataset.personalityRoute){const path=Y.route(b.dataset.personalityRoute);if(path&&Y.result(personalityState)){setPathwayTrail(path);openPathway(path.at(-1));}return true;}
 return false;
}
let pathwayTrail=[],pathwayActiveId=null;
try{pathwayTrail=X.normalize(JSON.parse(PlannerStorage.getItem(pathwayKey))?.trail);}catch{}
function pathwayContext(){
 const a=I.effective(answers),known=v=>v&&!I.special(v),summary=I.summary(answers,intakeFields()),currentStudy=Object.fromEntries([['school','school'],['thinking','thinking'],['deep','deepBook'],['calc','calc']].map(([id,key])=>[id,summary.find(x=>x.key===key)?.text||'현재 범위 확인 전']));
 if(known(a.calc)&&/기적|소마/.test(a.calc)&&!currentStudy.calc.includes(a.calc))currentStudy.calc=a.calc+' · '+currentStudy.calc;
 return {schoolGoal:scienceState.schoolGoal,currentStudy,grade:intakeFields().internationalCalendar?null:I.gradeChoice(answers,intakeFields()),currentBooks:I.summary(answers,intakeFields()).filter(it=>['school','deepBook'].includes(it.key)&&! /미선택|시작 전|잘 모르|하지 않/.test(it.text)).map(it=>it.label+' · '+it.text).join(' · '),audience:I.audience(answers,intakeFields()),schoolGuide:known(a.schoolCourse)?a.schoolCourse==='mid'?'middle':'elem':null,deepGuide:known(a.deepCourse)?a.deepCourse==='mid'?'middle':'elemDeep':null};
}
function goalContext(){if(!caseActive){const f=intakeFields();return {...pathwayContext(),year:f.year,mon:f.mon};}const m=PlannerCase.model(caseState);return {grade:'2',schoolGoal:caseScience.schoolGoal,currentStudy:Object.fromEntries([['school','school'],['thinking','thinking'],['deep','deep'],['calc','calc']].map(([key,lane])=>[key,m.lanes.find(l=>l.id===lane)?.current||'현재 범위 확인 전']))};}
function openSchoolGoal(){if(caseActive){caseGoalOpen=true;caseScienceOpen=false;rememberCase();drawCaseJourney();focusFlow();return;}flowMode='school-goal';coach('어떤 진학 방향을 생각하고 있나요?','현재 공부는 그대로 두고, 목표에 따라 이어갈 공부와 추가 준비를 비교합니다.');$('pathwayCoachContent').innerHTML=Q.choices(scienceState.schoolGoal,goalContext());drawJourney();rememberFlow();focusFlow();}
function visiblePathwayTrail(){return pathwayTrail[0]==='center'&&!Q.institutePolicy(scienceState.schoolGoal,pathwayContext().grade).allowed?[]:pathwayTrail;}
function setPathwayTrail(value){
 const next=X.normalize(value);if(JSON.stringify(next)===JSON.stringify(pathwayTrail))return;
 pathwayTrail=next;
 if(pathwayPlan?.path&&!pathwayPlan.path.split('/').every((id,i)=>next[i]===id)){pathwayPlan=null;try{PlannerStorage.removeItem(planKey);}catch{}}
 try{PlannerStorage.setItem(pathwayKey,JSON.stringify({version:1,trail:pathwayTrail}));$('pathwayStatus').textContent='선택한 로드맵을 지도에 이어두었어요.';}
 catch{$('pathwayStatus').textContent='지금은 지도를 이어볼 수 있어요. 새로고침하면 이 선택이 남지 않을 수 있어요.';}
 drawJourney();
}
function choosePathway(from,to){setPathwayTrail(X.select(pathwayTrail,from,to));}
function leavePathway(){try{PlannerStorage.removeItem(flowKey);}catch{}flowMode=null;pathwayActiveId=null;document.body.classList.remove('exploring');$('pathwayCoach').hidden=true;}
function openPathway(id){
 if(id==='science'){openScience();return;}
 if((pathwayTrail[0]==='center'||['center','centerEdu','centerUni'].includes(id))&&!Q.institutePolicy(scienceState.schoolGoal,pathwayContext().grade).allowed){openSchoolGoal();return;}
 const c=X.detail(id,pathwayContext());if(!c)return;roadmapMode='custom';saveRoadmapMode();
 flowMode='pathway';
 pathwayActiveId=id;document.body.classList.remove('questioning');document.body.classList.add('exploring');$('conversation').hidden=true;$('pathwayCoach').hidden=false;
 if($('courseDetail').open){courseOrigin=$('pathwayTitle');$('courseDetail').close();}
 $('pathwayTitle').textContent=c.title;$('pathwaySummary').textContent=c.summary;
 const bullets=list=>'<ul>'+list.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>';
 const bookSections=c.sections.map(s=>{const level=s.books.match(/^(학습 레벨 L\d+~L\d+) 표준 교재: (.+)$/);return `<div class="pathway-books"><p class="course-book-title">${esc(level?level[2]:s.books)}</p>${level?`<span class="course-level">${esc(level[1])}</span>`:''}<p>${esc(s.other)}</p><p class="pathway-book-advice">${esc(s.advice)}</p>${coursePractice(s)}</div>`;}).join('');
 $('pathwayCoachContent').innerHTML=`<p class="pathway-coach-advice">${esc(c.advice)}</p>${pathwayTrail[0]==='center'?'<p class="school-goal-rule">'+esc(Q.institutePolicy(scienceState.schoolGoal,pathwayContext().grade).note)+'</p>':''}<h2>다음에는 어떤 과정을 살펴볼까요?</h2><div class="pathway-options">${c.next.filter(n=>n.id!=='center'||Q.institutePolicy(scienceState.schoolGoal,pathwayContext().grade).allowed).map(n=>`<button type="button" data-pathway-from="${c.id}" data-pathway-to="${n.id}"><span class="pathway-option-dot" aria-hidden="true"></span><strong>${esc(n.title)}</strong></button>`).join('')}</div><details class="pathway-detail"><summary>공부 내용과 병행 방법</summary><h3>공부할 내용</h3>${bullets(c.what)}<h3>이 로드맵을 살펴볼 때</h3><p>${esc(c.why)}</p><h3>함께 이어갈 공부</h3>${bullets(c.parallel)}</details><details class="pathway-detail"><summary>교재와 고르는 방법</summary>${bookSections||`<p>${esc(c.books||'현재 공부하는 교과·심화 과정에서 관련 교재를 살펴봐요. 아직 고르지 않았다면 질문의 선택지에서 과정과 교재를 고를 수 있어요.')}</p>`}</details><div class="pathway-options"><button type="button" data-plan-open="books"><strong>이 경로의 교재와 공부 계획 고르기</strong></button></div>`;
 showView('vmap');drawJourney();rememberFlow();focusFlow();revealMap('[data-pathway-open="'+id+'"]');
}
$('courseContent').onclick=e=>{if(handleBookCheckClick(e)||handleCollegeClick(e))return;const entry=e.target.closest('[data-pathway-entry]');if(entry){setPathwayTrail(X.entry(entry.dataset.pathwayEntry));openPathway(pathwayTrail.at(-1));return;}const b=e.target.closest('[data-pathway-to]');if(!b)return;choosePathway(b.dataset.pathwayFrom,b.dataset.pathwayTo);openPathway(pathwayTrail.at(-1));};
function focusFlow(target='pathwayTitle'){if(CR.young(careerContext()))for(const b of $('pathwayCoachContent').querySelectorAll('[data-career-open]')){b.dataset.flowOverview='study';delete b.dataset.careerOpen;b.textContent='공부 방법과 학습 습관 살펴보기';}PlannerWorkspace.compactCoach($('pathwayCoachContent'));const refs=$('coachReferences');refs.replaceChildren();for(const n of [...$('pathwayCoachContent').children])if(n.tagName==='DETAILS'||n.classList.contains('personality-actions'))refs.append(n);mobileWorkspace('choice');$(target)?.focus({preventScroll:true});if(innerWidth<=800)window.scrollTo({top:0,behavior:'auto'});}
function revealMap(selector){
 // Selecting a branch updates the visible result in place, without jumping the page.
 const target=$('journeyMap').querySelector(selector);if(!target)return;
 if(selector.includes('progress-panel')||selector.includes('progress-trail'))setWorkspaceView('records');
 if(selector.includes('transition-graph'))setWorkspaceView('graph');
}
function coach(title,summary){
 if(historyState.active)closeHistory(false);
 roadmapMode='custom';document.body.dataset.planMode='custom';saveRoadmapMode();
 document.body.classList.remove('questioning');$('conversation').hidden=true;$('pathwayCoach').hidden=false;
 if($('courseDetail').open){courseOrigin=$('pathwayTitle');$('courseDetail').close();}
 $('pathwayTitle').textContent=title;$('pathwaySummary').textContent=summary;$('pathwaySummary').classList.remove('guide-speech');showView('vmap');
}
function collegeContext(){
 const fields=intakeFields(),currentStudy=pathwayContext().currentStudy;
 return {fields,currentStudy,schoolGoal:scienceState.schoolGoal,scienceBook:K.scienceLabel(collegeState)};
}
function saveCollege(){PlannerStorage.setItem(collegeKey,JSON.stringify(collegeState));}
function careerContext(){const f=intakeFields();return{gender:studentProfile.gender,activeExploration:flowMode==='career',grade:f.internationalCalendar?null:I.gradeChoice(answers,f),foreignCalendar:!!f.internationalCalendar,fields:f,currentStudy:{...pathwayContext().currentStudy,science:K.scienceLabel(collegeState)},personalityMethods:Y.methods(personalityState).map(x=>({title:x.title,method:x.method}))};}
function openCareer(page='interests'){
 if(CR.young(careerContext())){openPersonality();return;}
 if(caseActive)closeCase(false);PlannerFullscreen.close();
 if(flowMode!=='career')workspaceView='map';flowMode='career';careerPage=CR.navigation(careerState,page).page;
 coach('관심에서 공부와 진로를 연결합니다.','성향은 참고로 두고, 아이가 관심을 보이는 방향에서 현재 공부와 다음 선택을 비교합니다.');
 $('pathwayCoachContent').innerHTML=CR.choices(careerState,careerPage,careerContext());drawJourney();rememberFlow();focusFlow();
}
function careerClick(b){
 if(b.dataset.careerOpen||b.dataset.careerPage){if(b.dataset.careerTarget){careerState=CR.choose(careerState,'active',b.dataset.careerTarget);PlannerStorage.setItem(careerKey,JSON.stringify(careerState));}openCareer(b.dataset.careerOpen||b.dataset.careerPage);return true;}
 if(b.dataset.careerField){const id=b.dataset.careerField;if(!CR.model(careerState,careerContext()).rows.some(r=>r.fields.some(f=>f.id===id)))return true;if(!collegeState.enabled)openCollege('fields');if(!collegeState.fields.includes(id))collegeState=K.choose(collegeState,'field',id,collegeContext());saveCollege();openCollege('fields');return true;}
 if(!b.dataset.careerKind)return false;
 const kind=b.dataset.careerKind,from=careerPage;careerState=CR.choose(careerState,kind,b.dataset.careerValue,careerContext());PlannerStorage.setItem(careerKey,JSON.stringify(careerState));
 openCareer(kind==='study'?'method':kind==='method'?'review':kind==='review'?'summary':from);return true;
}
function openCollege(page='school'){
 if(caseActive)closeCase(false);
 if(!collegeState.enabled){collegeState={...collegeState,enabled:true};const grade=I.gradeChoice(answers,intakeFields());if(grade&&grade!=='pre')collegeState.school={...collegeState.school,format:'kr',level:grade};if(I.highBook(answers.schoolBook)&&I.highSubjects.includes(answers.schoolHigh)){collegeState.school.curriculum='kr';collegeState.plans['kr|math']={subjects:[answers.schoolHigh],book:'current',placement:'current',durations:{}};}saveCollege();}
 collegePage=['school','country','fields','study','prepare','result'].includes(page)?page:'school';flowMode='college';
 coach('지금의 공부에서 대학 진학까지','관심과 준비 단계를 연결하며 현재 교재·진도는 그대로 이어갑니다.');
 $('pathwayCoachContent').innerHTML=K.choices(collegeState,collegePage,collegeContext());
 drawJourney();rememberFlow();focusFlow();
}
function handleCollegeClick(e){const b=e.target.closest('button');return b?handleCollegeButton(b):false;}
function handleCollegeButton(b){
 if(b.hasAttribute('data-college-finish')){collegeState=K.choose(collegeState,'node','enroll');saveCollege();drawJourney();setWorkspaceView('map');mobileWorkspace('result');$('journeyTitle').focus({preventScroll:true});return true;}
 if(b.hasAttribute('data-college-current')){ask(I.firstMissing(answers,intakeFields())||'thinkingExperience');return true;}
 if(b.dataset.bookCheckOpen){openBookCheck(b.dataset.bookCheckOpen);return true;}
 if(b.dataset.collegeOpen||b.dataset.collegePage){PlannerFullscreen.leaveForAction(b);openCollege(b.dataset.collegeOpen||b.dataset.collegePage);return true;}
 if(!b.dataset.collegeKind)return false;
 const kind=b.dataset.collegeKind,id=b.dataset.collegeValue,y=scrollY,opened=new Map([...$('pathwayCoach').querySelectorAll('details')].map(d=>[d.querySelector('summary')?.textContent,d.open]));
 collegeState=K.choose(collegeState,kind,id,{...collegeContext(),year:+$('year').value});
 if(kind==='level'&&collegeState.school.format==='kr'){answers.grade=collegeState.school.level;answers.gradeInput='current';$('grade').value=answers.grade;applyAnswerChanges('grade');saveDraft();}
 saveCollege();if(kind==='node'){drawJourney();return true;}
 openCollege(collegePage);for(const d of $('pathwayCoach').querySelectorAll('details'))if(opened.has(d.querySelector('summary')?.textContent))d.open=opened.get(d.querySelector('summary')?.textContent);requestAnimationFrame(()=>{window.scrollTo({top:y,behavior:'auto'});$('pathwayCoachContent').querySelector('[data-college-kind="'+kind+'"][data-college-value="'+CSS.escape(id)+'"]')?.focus({preventScroll:true});});return true;
}
function bookDescriptors(){return ['school','thinking','deep','calc','science'].map(axis=>BK.descriptor(axis,answers,intakeFields(),collegeContext().scienceBook));}
function bookStudyButtons(){return '<section class="book-next"><button type="button" data-book-check-open="school">현재 교재의 단원·공부 모습 확인</button><button type="button" data-college-open="fields">관심 계열·대학 진학까지 이어보기</button></section>';}
function openBookCheck(axis){
 bookDescriptor=bookDescriptors().find(x=>x.axis===axis);if(!bookDescriptor)return;
 $('courseTitle').textContent=BK.AXES[axis]+' · 교재와 공부 확인';$('courseContent').innerHTML=BK.render(bookChecks,bookDescriptor);showCourseDialog();
}
function handleBookCheckClick(e){
 const b=e.target.closest('button');if(!b)return false;
 if(b.dataset.bookCheckKind&&bookDescriptor){const y=$('courseContent').scrollTop,wasOpen=$('courseContent').querySelector('details')?.open;bookChecks=BK.choose(bookChecks,bookDescriptor,b.dataset.bookCheckKind,b.dataset.bookCheckValue);PlannerStorage.setItem(bookCheckKey,JSON.stringify(bookChecks));$('courseContent').innerHTML=BK.render(bookChecks,bookDescriptor);if(wasOpen&&$('courseContent').querySelector('details'))$('courseContent').querySelector('details').open=true;$('courseContent').scrollTop=y;drawJourney();$('courseContent').querySelector('[data-book-check-kind="'+b.dataset.bookCheckKind+'"][data-book-check-value="'+CSS.escape(b.dataset.bookCheckValue)+'"]')?.focus({preventScroll:true});return true;}
 if(b.dataset.bookStudy){const axis=b.dataset.bookStudy;$('courseDetail').close();if(['school','deep','calc'].includes(axis)&&!I.highBook(I.effective(answers).schoolBook)){openTransition(axis==='school'?'book':axis);}else if(axis==='science')openScience();else if(axis==='thinking'){openProgress('goal');}else openCollege('study');return true;}
 return false;
}
function reportAssessment(c,a,fields){
 const axis=c.grade==='pre'?'comp':'school',primary=G.referenceForAxis(c,axis),source=window.PLANNER_LEVELS||[];
 const reference=(id,own=false)=>{
  const meaning=G.levelMeaning(c,id);if(!meaning)return null;
  const blocks=(source.find(l=>l.id===id)?.[axis]||[]).filter(b=>G.stage(b[0],axis)),actual=c.axes.find(x=>x.id===axis);
  const b=own?blocks.find(b=>G.stage(b[0],axis)===actual?.stage):blocks.find(b=>b[1]<=c.now&&c.now<=b[2])||blocks.find(b=>b[1]>c.now);
  return {...meaning,pace:b?{course:D.shortText(b[0]),months:b[2]-b[1]+1}:null};
 };
 const n=Number(primary?.slice(1)),levelAssessment={axis,scope:G.levelScope(c),current:primary?reference(primary,true):null,next:Number.isFinite(n)?[n-1,n-2].filter(n=>n>=0).map(n=>reference('L'+n)).filter(Boolean):[],axes:c.axes.map(x=>{const id=G.referenceForAxis(c,x.id);return {id:x.id==='comp'?'thinking':x.id,label:x.label,current:x.current,stage:x.stage,ready:x.ready,done:x.done,referenceId:id,reference:id?G.levelMeaning(c,id):null,gap:id?c.levels.find(l=>l.id===id)?.axes.find(y=>y.id===x.id)?.gap:null};})};
 levelAssessment.lower=primary==='L0'?['L1','L2'].map(id=>reference(id)).filter(Boolean):[];
 if(c.grade!=='pre'||!Number.isFinite(c.now))return {levelAssessment,demoAssessment:null};
 const resolved=D.resolveSelections(I.sourceInput(a,fields)),rowIds={school:'school',thinking1:'thinking',calc:'calc'},labels={school:'교과',thinking1:'사고력',calc:'연산'};
 const metas=Object.entries(resolved.positions).filter(([rowKey,meta])=>{const actual=c.axes.find(x=>x.id===(rowKey==='thinking1'?'comp':rowKey));return meta&&actual?.ready&&(rowKey!=='school'||!I.highBook(a.schoolBook)&&!I.middleBook(a.schoolBook)&&actual.stage===meta.key);}).map(([rowKey,value])=>({rowKey,meta:{...value,pos:rowKey==='school'&&a.schoolStatus==='done'?'end':value.pos}})).filter(({rowKey,meta})=>D.ROAD_L0[rowKey].some(b=>D.shortText(b.text).includes(meta.key)));
 const axes=metas.map(({rowKey,meta})=>({id:rowIds[rowKey],label:labels[rowKey],current:c.axes.find(x=>x.id===(rowKey==='thinking1'?'comp':rowKey))?.current,key:meta.key,position:meta.pos,shift:D.personalShift(rowKey,Number(a.age),meta,+fields.mon)}));
 const references=D.LEVELS.map(l=>({name:D.shortText(l.summary),shift:l.shift,axes:metas.map(({rowKey,meta})=>{const bs=D.originalRows(l.shift).find(r=>r.key===rowKey).blocks,current=bs.findIndex(b=>D.shortText(b.text).includes(meta.key)),target=bs.findIndex(b=>b.s<=c.now&&c.now<=b.e),anchor=D.levelStdMonth(l.shift,rowKey,meta);return {id:rowIds[rowKey],label:labels[rowKey],gap:anchor==null?null:c.now-anchor,expected:target<0?'':D.shortText(bs[target].text),missing:current>=0&&target>current?bs.slice(current+(meta.pos==='end'?1:0),target+1).map(b=>D.shortText(b.text)):[]};})}));
 const candidates=references.filter(r=>Number.isFinite(r.axes.find(x=>x.id==='thinking')?.gap)),closest=candidates.reduce((best,r)=>!best||Math.abs(r.axes.find(x=>x.id==='thinking').gap)<Math.abs(best.axes.find(x=>x.id==='thinking').gap)?r:best,null);
 return {levelAssessment,demoAssessment:{source:'original-demo-L0-L4',axes,references,primary:closest?.name||null,premier:references[1]}};
}
function reportContext(){
 if(studyActive)return SPV.reportContext(SPV.model(studyState));
 const fields=intakeFields(),a=I.effective(answers),comparison=G.comparison(a,fields),standard=PlannerStandard.model(a,fields,{pattern:standardPattern,calcDaysPerWeek,supplement:supplementDecision}),custom=roadmapMode==='custom'?PlannerWorkspace.model(transition,progression,a,{...fields,calcDaysPerWeek,supplementDecision},visiblePathwayTrail()):null;
 let lanes=standard.lanes;
 if(custom){
  lanes=[{id:'school',label:'교과',current:comparison.axes.find(x=>x.id==='school')?.current||'현재 범위 확인 전',status:custom.rows.length?'known':'pending',note:custom.range?'선택한 교재·범위의 맞춤 일정입니다.':'이어갈 교재와 범위를 선택하면 세부 일정이 연결됩니다.',blocks:custom.rows.map(r=>{const seg=custom.m.segments.find(b=>b.gain>0&&T.schoolNumber(G.stage(b.course,'school'))===r.id);return {title:r.school,start:seg?seg.scenarioEnd-seg.duration-custom.m.now:null,end:seg?seg.scenarioEnd-custom.m.now:null,startLabel:r.start||'일정 확인 후 연결',endLabel:r.end||'범위 확인 후 연결',method:r.checkpoint||'',timing:r.timing,completed:r.timing==='done',...(r.timing==='done'?{startLabel:'',endLabel:''}:{})};})},...custom.independentLanes];
  if(custom.depthSlots.length&&!lanes.some(x=>x.id==='deep'))lanes.push({id:'deep',label:'심화',current:custom.parallel.deep,status:'known',note:custom.d.s.cadence==='parallel'?'선택한 심화를 교과와 병행합니다.':'선택한 교과 뒤 심화를 이어갑니다.',blocks:custom.depthSlots.map(b=>({title:b.depthTitle,startLabel:b.start,endLabel:b.end,method:b.parallel?'교과와 병행':'교과를 다룬 뒤 이어가기'}))});
  lanes.push(...custom.supplements);
  for(const id of ['thinking','deep','calc'])if(!lanes.some(l=>l.id===id)){const row=standard.lanes.find(l=>l.id===id);if(row)lanes.push({...row,blocks:[],note:id==='calc'?custom.parallel.calc:row.note});}
 }
 const axis=roadmapMode==='standard'?(standardAxis||T.defaultAxis(a,fields)):T.restore(transition,progression,a,fields).axis;
 const plan=roadmapMode==='standard'?T.choose(T.inheritCadence(null,null,a,fields,standard.level,standard.sequential?'deep':'thinking'),null,a,fields,'axis',axis):transition;
 const graph=fields.internationalCalendar?'':axis==='calc'?PlannerStandard.renderCalculationGraph(standard.calcPlan):T.renderGraph(plan,roadmapMode==='standard'?null:progression,a,fields,{academyLines:false});
 const graphHost=document.createElement('div');graphHost.innerHTML=graph;
 for(const control of graphHost.querySelectorAll('.atlas-graph-actions,.transition-axis-buttons,.transition-graph-actions,button'))control.remove();
 for(const detail of graphHost.querySelectorAll('details'))detail.open=true;
 for(const table of graphHost.querySelectorAll('table'))table.classList.add('pr-table');
 const sc=S.normalContext(standard,custom?.m,fields),science=scienceState.enabled&&!fields.internationalCalendar?S.model(scienceState,sc):null;
 const languageIds=Object.keys(L.SUBJECTS).filter(id=>languageState.subjects[id].enabled&&languageState.subjects[id].current),languages=languageIds.map(id=>L.model(languageState,id,languageContext()));
 const grade=fields.internationalCalendar?null:I.gradeChoice(a,fields),goal=Q.model(scienceState.schoolGoal,{...fields,grade,currentStudy:pathwayContext().currentStudy}),observed=G.restore(progression,a,fields),policy=Q.institutePolicy(scienceState.schoolGoal,grade),paths=visiblePathwayTrail();
 const academyHost=document.createElement('div');academyHost.innerHTML=T.renderAcademyRoadmaps(T.academyReferences(comparison,axis,academyLines),comparison,fields);
 for(const archive of academyHost.querySelectorAll('.academy-archive'))archive.remove();
 for(const hidden of academyHost.querySelectorAll('[data-academy-beam-layer][aria-hidden="true"]'))hidden.remove();
 for(const detail of academyHost.querySelectorAll('details'))detail.open=true;
 const questionHost=document.createElement('div');questionHost.innerHTML=roadmapMode==='standard'?PlannerStandard.renderQuestions(standard)+PlannerStandard.renderSupplementQuestions(standard):PlannerWorkspace.renderQuestions(transition,progression,a,fields,paths);
 const questions=[...questionHost.querySelectorAll('details')].map(node=>({question:node.querySelector('summary')?.textContent||'',answer:[...node.querySelectorAll('p')].map(p=>p.textContent).join(' ')})).filter(q=>q.question&&q.answer);
 const calcBook=a.calc==='advanced'?P.CALC[+a.calcExact]?.[0]:!I.special(a.calc)&&a.calc!=='high'?a.calc:null;
 const current=comparison.axes.map(x=>({id:x.id==='comp'?'thinking':x.id,label:x.label,text:x.id==='calc'&&calcBook&&!x.current.includes(calcBook)?calcBook+' · '+x.current:x.current}));
 return {...reportAssessment(comparison,a,fields),name:$('name')?.value.trim()||'우리 아이',grade,age:Number(a.age)||null,fields,now:standard.now,mode:roadmapMode,current,lanes,sequential:custom?custom.d.s.cadence==='sequential'&&custom.depthSlots.length>0:standard.sequential,independentDepth:custom?custom.independentLanes.some(l=>l.id==='deep')||custom.depthSlots.some(b=>b.parallel):standard.independentDepth,graphTitle:(T.AXES.find(x=>x.id===axis)?.title||'학습')+' 진도 비교',graphHtml:graphHost.innerHTML,graphSvg:graph.match(/<svg\b[\s\S]*?<\/svg>/)?.[0]||'',academyHtml:fields.internationalCalendar?'':academyHost.innerHTML+(grade==='pre'&&window.PlannerPreschoolDetail?window.PlannerPreschoolDetail.render(preschoolDetailId,{print:true}):''),observation:G.OBSERVATIONS.find(x=>x.id===observed.observation)||null,goal,science,scienceStage:science?PlannerScienceLevels.model(science):null,questions,assumptions:roadmapMode==='standard'?standard.assumptions:[T.scenarioNote(custom.d,custom.m),T.cadenceNote(custom.d.s)],scienceQuestions:science?S.questions(scienceState,sc):[],languages,languageQuestions:languageIds.flatMap(id=>L.questions(languageState,id,languageContext()).map(q=>({question:L.SUBJECTS[id]+' · '+q.q,answer:q.a}))),selectedPaths:paths.map(id=>X.paths[id]?.title||X.paths[id]?.short||id),personalityMethods:Y.methods(personalityState).map(x=>({title:x.title,method:x.method})),gender:studentProfile.gender,institute:{selected:scienceState.institute!=='none'||paths.some(id=>/^center/.test(id)),allowed:policy.allowed,label:science?.institute||'영재원 대비'},extra:custom&&custom.d.s.tempo==='gradual'?{tempo:'gradual',enabled:custom.m.enabled,adjusting:custom.m.adjusting,within:custom.within,scope:custom.range,loadTitle:custom.load,allocation:custom.d.s.allocation,meetingText:custom.meeting,followup:custom.after,catch:custom.c&&custom.m.catch?{months:custom.c.months,extraMonths:custom.c.extraMonths,target:custom.m.catch.target,course:custom.m.catch.course,dateLabel:custom.catchDate,maintenanceExtra:custom.m.catch.maintenanceExtra,baselineSessions:custom.m.catch.baselineSessions,sessionHours:custom.m.catch.sessionHours}:null}:null};
}
function prepareReport(){
 if(!studyActive&&(!completed||caseActive||historyState.active))return false;
 const context=reportContext(),report=PlannerReport.model(context);
 if(studyActive){const m=SPV.model(studyState);report.front.prose=['현재 초5에서 5-2 응용을 공부하고 있고, 연산은 6-1 안팎입니다. 새 교과는 2026년 11월 6-1부터, 쎈은 이미 배운 5-2부터 이어가겠습니다.',m.overview.firstYear,m.overview.winter,m.overview.summer,m.overview.after,m.overview.high,'국어는 어휘·독해·문학·서술을 함께, 과학은 초5·6 기본과 탐구를 확인한 뒤 오투 중1-1부터 이어갑니다. 이후 중등 기본을 마치면 하이탑 통합과학 1·2의 기본 개념과 탐구로 연결합니다. 두 과목의 출발점은 현재 진도를 확인한 뒤 조정합니다.'];
  report.front.prose.push('초등 교과는 주 '+m.classPlan.elementary.sessions+'회, 회당 '+m.classPlan.elementary.hours+'시간으로 공부합니다. 쎈 5-2를 12월에 정리한 뒤 2027년 1~6월에는 3% 올림피아드 1과정을 여섯 달 동안 병행합니다. 과학은 '+m.classPlan.science.label+'으로 배정합니다.');
  if(m.assessment?.current?.id)report.front.prose.splice(1,0,m.assessment.current.label+'입니다. 바로 위 참고 일정은 '+m.assessment.next.map(r=>r.label+' · '+r.pace.course+' 한 학기 '+r.pace.months+'개월').join(', ')+'입니다. '+m.assessment.planPace.text);
  report.front.priorities[1]={title:'쎈 활용·연산을 함께',text:'중등 쎈은 한 학기 뒤에서 유형과 활용을 다집니다. 공통수학의 쎈 활용은 정규 수업에 포함된 같은 공부이며 별도 과제로 중복하지 않습니다. 연산은 디딤돌 6B 뒤 기적의 중학연산으로 연결하고, 이후에는 현재 교과의 식 계산과 오답을 짧게 유지합니다.',section:'math',sectionLabel:'교재·월별 과정'};
  report.front.priorities.push({title:'내신 준비월에는 새 선행을 멈춥니다',text:'공통수학 구간의 4·6·9·11월은 학교 시험 준비 약 3주와 배운 범위 복습으로 두었습니다. 중1에도 정기시험이 있다면 앞선 중등 계획과 공통수학의 시작·완료월도 함께 늦춥니다. 실제 학교 시험 일정은 아직 확인하지 않은 예시입니다.',section:'comparison',sectionLabel:'진도·활용 그래프'});
 }
 $('plannerReportContent').innerHTML=PlannerReport.render(report,{prefix:'report'});
 return true;
}
function openReport(){
 if(!prepareReport())return;
 PlannerFullscreen.close();$('plannerReportDialog').showModal();$('plannerReportContent').scrollTop=0;
 $('plannerReportDialog').scrollTop=0;
}
$('openReport').onclick=openReport;
$('legacyPrintReport').onclick=openReport;
$('closeReport').onclick=()=>$('plannerReportDialog').close();
$('reportToFront').onclick=()=>$('plannerReportContent').querySelector('.pr-front')?.scrollIntoView({block:'start'});
$('printReport').onclick=()=>window.print();
window.addEventListener('beforeprint',()=>{if(prepareReport())document.body.classList.add('report-printing');});
window.addEventListener('afterprint',()=>document.body.classList.remove('report-printing'));

function languageContext(){const f=intakeFields();return {grade:f.internationalCalendar?null:I.gradeChoice(answers,f),age:f.internationalCalendar?null:Number(answers.age)||null,foreignCalendar:!!f.internationalCalendar,year:f.year,mon:f.mon};}
function openLanguage(id=languageState.active,page=null){
 if(!Object.hasOwn(L.SUBJECTS,id))return;
 languageState={...languageState,active:id};
 const row=languageState.subjects[id],pages=L.navigation(languageState,id).steps||L.STEPS;
 languagePage=pages.includes(page)?page:id==='english'?(row.current?'standard':'current'):L.navigation(languageState,id).missing;
 if(!row.current)languagePage='current';
 if(id==='english'&&row.planMode!=='custom'&&['focus','book','rhythm'].includes(languagePage))languagePage='standard';
 PlannerStorage.setItem(languageKey,JSON.stringify(languageState));const mode=roadmapMode;flowMode='language';coach(L.heading(id,languagePage),L.help(languageState,id,languagePage,languageContext()));roadmapMode=mode;saveRoadmapMode();
 $('pathwayCoachContent').innerHTML=L.choices(languageState,id,languagePage,languageContext());
 drawJourney();rememberFlow();focusFlow();$('pathwayCoach').scrollTop=0;$('journeyPanel').scrollTop=0;
}
function languageClick(b){
 if(b.hasAttribute('data-language-result')){setWorkspaceView('map');mobileWorkspace('result');$('journeyTitle').focus({preventScroll:true});return true;}
 if(b.dataset.languageOpen){openLanguage(b.dataset.languageOpen,b.dataset.languageStart);return true;}
 if(b.dataset.languagePage){openLanguage(languageState.active,b.dataset.languagePage);return true;}
 if(b.dataset.languageLater){openOverview();return true;}
 if(b.hasAttribute('data-language-use-standard')||b.hasAttribute('data-language-customize')){
  const custom=b.hasAttribute('data-language-customize');
  languageState=L.choose(languageState,'english','mode',custom?'custom':'standard',languageContext());
  openLanguage('english',custom?'focus':'summary');
  if(!custom){setWorkspaceView('map');mobileWorkspace('result');}
  return true;
 }
 if(!b.dataset.languageKind)return false;
 const id=b.dataset.languageSubject,kind=b.dataset.languageKind,value=b.dataset.languageValue;
 languageState=L.choose(languageState,id,kind,value,languageContext());PlannerStorage.setItem(languageKey,JSON.stringify(languageState));
 if(['referenceProfile','readingMetric','readingRange','academy'].includes(kind)){openLanguage(id,languagePage);return true;}
 const next=L.navigation(languageState,id,kind).next;openLanguage(id,next||'summary');return true;
}
function openOverview(page='home'){
 flowMode='overview';overviewPage=page;
 const pages={home:['현재 공부에서 어떻게 이어갈까요?','지금 공부하는 교재를 기준으로 다음 범위와 병행 공부, 감당할 학습량을 함께 살펴봅니다.'],school:['어떤 학교 공부를 생각하고 있나요?','지금 학교에서 이어가거나 다른 학교를 준비하는 길을 골라보세요.'],study:['어떤 공부를 더 살펴볼까요?','아이의 관심과 현재 공부에 맞춰 골라보세요.'],goals:['어떤 방향으로 로드맵을 설계할까요?','지금의 공부를 바탕으로 이어갈 방향을 골라요. 성향 검사 없이도 선택할 수 있어요.']};
 coach(...pages[page]);
 const root=id=>id==='center'&&!Q.institutePolicy(scienceState.schoolGoal,pathwayContext().grade).allowed?'':`<button type="button" data-pathway-root="${id}"><strong>${esc(X.paths[id].short)}</strong><span>${esc(X.paths[id].summary)}</span></button>`;
 const current=pathwayContext().currentStudy;
 const learningChoices=`<button type="button" data-transition-open="book"><strong>교과의 다음 범위 이어가기</strong><span>현재 · ${esc(current.school)}</span></button><button type="button" data-transition-open="deep"><strong>심화 교재와 병행 범위 고르기</strong><span>현재 · ${esc(current.deep)}</span></button><button type="button" data-core-view="table"><strong>사고력·연산의 월별 계획 확인</strong><span>사고력 · ${esc(current.thinking)}</span><span>연산 · ${esc(current.calc)}</span></button><button type="button" data-transition-open="tempo"><strong>학습량을 늘리면 어떻게 달라질까요?</strong><span>복습·심화·연산을 유지하며 추가 회차와 진도를 비교합니다.</span></button><button type="button" data-progress-open="levels"><strong>현재 진도와 가까운 단계 비교</strong><span>교과·사고력·연산의 위치를 각각 살펴봅니다.</span></button>`;
 const otherChoices=CR.root(careerContext())+K.root()+Q.rootButton()+root('center')+'<button type="button" data-pathway-entry="middle"><strong>중등 기본·심화</strong><span>초등 계통 대수심화 이후의 교재와 병행 공부를 살펴봅니다.</span></button>'+root('academic')+'<button type="button" data-flow-overview="school"><strong>보딩·국제학교와 진학 준비</strong></button><button type="button" data-flow-personality><strong>우리 아이의 성향 파악</strong><span>선택 검사와 공부 방법을 별도로 살펴봅니다.</span></button><button type="button" data-flow-overview="study"><strong>과학·경시·학원·공부 방법</strong></button>';
 $('pathwayCoachContent').innerHTML='<div class="pathway-options flow-menu">'+(page==='home'?learningChoices+scienceEntry()+'<button type="button" data-flow-intake><strong>현재 공부한 답 바꾸기</strong></button>':CR.root(careerContext())+K.root()+Q.rootButton()+(page==='school'?['boarding','international','gifted','center']:page==='goals'?['academic','science','contest','boarding','international','study']:['science','contest','academy','study']).map(root).join(''))+'</div>'+(['home','study'].includes(page)?L.root():'')+(page==='home'?'<details class="pathway-detail"><summary>다른 교육 정보 살펴보기</summary><div class="pathway-options">'+otherChoices+'</div></details>':'');
 drawJourney();rememberFlow();focusFlow();
}
function openPersonality(){
 flowMode='personality';coach('우리 아이의 성향 파악','검사는 선택이에요. 결과는 공부 방법을 살펴보는 참고로만 사용해요.');
 $('pathwayCoachContent').innerHTML=Y.render(personalityState,personalityNotice)+'<div class="pathway-options">'+K.root()+'</div>';drawJourney();rememberFlow();focusFlow($('personalityFocus')?'personalityFocus':'pathwayTitle');revealMap('.personality-map');
}
function savePathwayPlan(){try{PlannerStorage.setItem(planKey,JSON.stringify(pathwayPlan));}catch{$('pathwayStatus').textContent='지금은 이어볼 수 있어요. 새로고침하면 계획 선택이 남지 않을 수 있어요.';}}
function openPathwayPlan(page='books'){
 if(!pathwayTrail.length){openOverview('goals');return;}
 if(pathwayTrail[0]==='center'&&!Q.institutePolicy(scienceState.schoolGoal,pathwayContext().grade).allowed){openSchoolGoal();return;}
 const d=R.detail(pathwayPlan,pathwayTrail,pathwayActiveId,pathwayContext());
 pathwayPlan=R.restore(pathwayPlan,pathwayTrail,pathwayActiveId,pathwayContext());
 planPage=!d.bookInfo?'books':page==='books'?'books':page==='methods'?'methods':d.methodInfo?'summary':'methods';flowMode='pathway-plan';
 const choice=(kind,x,on)=>`<button type="button" data-plan-kind="${kind}" data-plan-value="${esc(x.id)}"${on?' aria-pressed="true"':''}><strong>${esc(x.title)}</strong><span>${esc(x.summary)}</span>${on?'<small>선택한 항목</small>':''}</button>`;
 const context=`<p class="study-focus">${esc(I.studentLabel(answers,intakeFields())==='미선택'?'학년·현재 진도는 아직 선택 전이에요. 교재의 학기와 과정은 현재 공부를 고른 뒤 확인할 수 있어요.':I.studentLabel(answers,intakeFields())+' · 학교 학년과 교재 진도를 구분합니다.')}</p><p class="study-current-range">현재 교과 · ${esc(pathwayContext().currentStudy.school)}</p>`;
 const back='<div class="personality-actions"><button type="button" data-plan-back>공부 경로의 갈림길로 돌아가기</button></div>';
 if(planPage==='books'){
  coach('이 경로에서는 어떤 교재로 공부할까요?',d.title+'의 공부를 현재 진도와 연결합니다.');
  $('pathwayCoachContent').innerHTML=context+`<div class="pathway-options study-options">${d.books.map(b=>choice('book',b,d.book===b.id)).join('')}</div><details class="pathway-detail"><summary>교재를 고를 때 살펴볼 점</summary><p>현재 배우는 범위와 혼자 풀 수 있는 정도를 먼저 봅니다. 쓰던 교재를 유지해도 좋고, 부족한 부분에 맞춰 다른 교재를 비교해도 좋습니다.</p></details>`+back;
 }else if(planPage==='methods'){
  coach('어떻게 병행하며 이어갈까요?',d.title+'에서 교재와 공부 방법을 함께 계획합니다.');
  $('pathwayCoachContent').innerHTML=context+`<p class="study-chosen-book"><small>살펴볼 교재</small><strong>${esc(d.bookInfo.title)}</strong></p><p class="pathway-coach-advice">${esc(d.bookInfo.advice)}</p>${d.bookInfo.other?`<details class="pathway-detail"><summary>비교할 다른 교재</summary><p>${esc(d.bookInfo.other)}</p></details>`:''}<div class="pathway-options study-options">${d.methods.map(m=>choice('method',m,d.method===m.id)).join('')}</div><div class="personality-actions"><button type="button" data-plan-open="books">교재 다시 고르기</button></div>`+back;
 }else{
  coach(d.methodInfo.title,d.title+'에 교재와 공부 계획을 연결했습니다.');
  $('pathwayCoachContent').innerHTML=context+`<p class="study-chosen-book"><small>살펴볼 교재</small><strong>${esc(d.bookInfo.title)}</strong></p><div class="pathway-options study-options"><button type="button" data-transition-open="book"><strong>교과 교재·회차를 지도에 연결</strong></button></div><details class="choice-help"><summary>선택한 공부 방법 자세히</summary><ol class="study-steps">${d.methodInfo.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details><div class="personality-actions"><button type="button" data-plan-open="methods">공부 방법 다시 고르기</button><button type="button" data-plan-open="books">교재 다시 고르기</button></div>`+back;
 }
 drawJourney();savePathwayPlan();rememberFlow();focusFlow();revealMap('.study-trail li:last-child');
}
function saveProgress(){try{PlannerStorage.setItem(progressKey,JSON.stringify(progression));}catch{$('pathwayStatus').textContent='현재 계획은 볼 수 있지만 새로고침 후에는 다시 선택해야 할 수 있습니다.';}}
function openProgress(page='goal'){
 progression=G.restore(progression,answers,intakeFields());
 const b=G.bridge(progression,answers,intakeFields()),{c,s}=b;
 progressPage=['goal','levels','focus','observation','pace','summary'].includes(page)?page:'goal';
 if(progressPage==='focus'&&!s.goal)progressPage='goal';
 if(['observation','pace','summary'].includes(progressPage)&&!s.focus)progressPage='focus';
 if(['pace','summary'].includes(progressPage)&&!s.observation)progressPage='observation';
 if(progressPage==='summary'&&!s.pace)progressPage='pace';
 flowMode='progression';
 const titles={goal:'현재 위치에서 어떻게 이어갈까요?',levels:'다른 레벨과 무엇이 다른가요?',focus:'어느 영역부터 다룰까요?',observation:'현재 범위에서 어떻게 풀고 있나요?',pace:'학기와 방학에 어떻게 배분할까요?',summary:'다음 학습까지의 과정을 정리했습니다.'};
 coach(titles[progressPage],'현재 진도와 비교 예시의 차이를 확인하고, 보완·심화·다음 과정의 비중을 선택합니다.');
 const options=(kind,items,value)=>'<div class="pathway-options study-options">'+items.map(x=>`<button type="button" data-progress-kind="${kind}" data-progress-value="${esc(x.id)}" aria-pressed="${value===x.id}"><strong>${esc(kind==='book'&&x.book?x.book+(x.id==='current'?' · 유지':''):x.title)}</strong><span>${esc(x.summary)}</span>${(x.lines||[]).map(line=>`<span class="level-option-detail">${esc(line)}</span>`).join('')}${value===x.id?'<small>선택한 항목</small>':''}</button>`).join('')+'</div>';
 const back='<div class="personality-actions"><button type="button" data-progress-open="goal">진행 방향 다시 비교하기</button><button type="button" data-flow-overview="home">공부 방향으로 돌아가기</button></div>';
 let content='';
 if(progressPage==='goal'){
  content=`<p class="pathway-coach-advice">${c.best?`교과 진도에 가까운 예시는 ${esc(G.levelLabel(c,c.best))}입니다. `:'현재 교과 범위는 아직 비교하지 않았습니다. '}교과·사고력·연산의 진도 차이는 각각 살펴봅니다. 심화는 현재 교재와 풀이 모습을 별도로 확인합니다.</p>`+options('goal',G.GOALS,s.goal);
 }else if(progressPage==='levels'){
  const levelItems=c.levels.map(l=>{const m=G.levelMeaning(c,l.id);return {id:l.id,title:G.levelLabel(c,l.id),summary:m.at+' 기준의 진도 예시',lines:m.axes.map(x=>x.label+': '+x.text)};});
  const nearby=[c.best,c.next,s.target].filter((id,i,arr)=>id&&arr.indexOf(id)===i),others=levelItems.filter(l=>!nearby.includes(l.id));
  content=`<p class="pathway-coach-advice">${c.best?`가까운 교과 예시 ${esc(G.levelLabel(c,c.best,true))}${c.next?' → 한 단계 앞선 예시 '+esc(G.levelLabel(c,c.next,true)):' · L0보다 앞선 예시는 현재 자료에 없습니다'}`:'현재 교과 학습을 선택하면 가까운 예시를 찾을 수 있습니다'}.</p><p>레벨을 선택하면 오른쪽 그래프와 영역별 비교가 바뀝니다. 더 빠른 예시가 모든 아이에게 필요한 목표는 아닙니다.</p>`+options('target',nearby.map(id=>levelItems.find(l=>l.id===id)),s.target)+`<div class="pathway-options"><button type="button" data-progress-open="focus"><strong>이 비교에서 먼저 다룰 영역 선택</strong></button></div><details class="pathway-detail"><summary>다른 레벨도 비교하기 · L0~L13</summary>${options('target',others,s.target)}</details>`;
 }else if(progressPage==='focus'){
  content=options('focus',c.axes.filter(x=>x.ready).map(x=>({id:x.id,title:x.label+'부터 살펴보기',summary:x.current})),s.focus);
  if(!c.axes.some(x=>x.ready))content='<p>현재 학습을 선택한 뒤 보완할 영역을 고를 수 있습니다.</p><button type="button" data-flow-intake>현재 학습 선택하기</button>';
 }else if(progressPage==='observation'){
  content=`<p class="study-chosen-book"><small>먼저 다룰 영역 · ${esc(b.axis.label)}</small><strong>${esc(b.axis.current)}</strong></p><ul class="progress-checks">${b.axis.checks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p>직접 관찰하신 모습에 가까운 항목을 선택해 주세요. 검사 점수나 숙달 판정으로 기록하지 않습니다.</p>`+options('observation',G.OBSERVATIONS,s.observation);
 }else if(progressPage==='pace'){
  content=`<p class="pathway-coach-advice">${esc(b.observation?.method||b.axis.method)}</p>`+options('pace',G.PACES,s.pace);
 }else{
  content=`<p class="study-chosen-book"><small>${esc(b.goal.title)} · ${esc(b.axis.label)}</small><strong>${esc(b.pace.title)}</strong></p><ol class="study-steps">${b.steps.map(x=>`<li><strong>${esc(x.title)}</strong><p>${esc(x.text)}</p></li>`).join('')}</ol><p>다시 확인한 풀이와 담당 선생님의 판단을 바탕으로 다음 범위를 조정합니다.</p><div class="pathway-options"><button type="button" data-transition-open="book"><strong>교재·범위와 심화·연산 병행 설계</strong></button><button type="button" data-progress-books><strong>현재 교재 안내도 보기</strong></button><button type="button" data-progress-open="observation"><strong>학습 모습 다시 살펴보기</strong></button></div>`;
 }
 $('pathwayCoachContent').innerHTML=content+back;drawJourney();rememberFlow();saveProgress();focusFlow();revealMap(['goal','levels'].includes(progressPage)?'.progress-panel>header':'.progress-trail>h4');
}
function saveTransition(){try{PlannerStorage.setItem(transitionKey,JSON.stringify(transition));}catch{$('pathwayStatus').textContent='지금 선택은 볼 수 있지만 새로고침 후 교재·병행 계획을 다시 선택해야 할 수 있습니다.';}}
function openTransition(page='book'){
 transition=T.restore(transition,progression,answers,intakeFields());const d=T.detail(transition,progression,answers,intakeFields());
 const order=['book','range','deep',...(d.s.deep==='none'?[]:['deepScope','cadence']),'calc','checkpoint','tempo',...(d.s.tempo==='gradual'?['allocation',...(d.s.allocation==='advance'?['load']:[])]:[])];
 transitionPage=[...order,'summary'].includes(page)?page:'book';
 if(transitionPage!=='tempo'){const stop=transitionPage==='summary'?order.length:order.indexOf(transitionPage),missing=order.slice(0,stop).find(k=>!d.s[k]);if(missing)transitionPage=missing;}
 if(flowMode!=='transition')workspaceView='map';flowMode='transition';
 const titles={book:'교과는 어떤 교재로 이어갈까요?',range:'어느 범위까지 연결해 볼까요?',deep:'어떤 심화 교재를 병행할까요?',deepScope:'심화는 어느 범위에서 병행할까요?',cadence:'교과와 심화를 어떻게 이어갈까요?',calc:'연산은 어떻게 병행할까요?',checkpoint:'다음 범위 전에 무엇을 확인했나요?',load:'주 몇 회를 더해 볼까요?',allocation:'늘린 분량은 어디에 먼저 쓸까요?',tempo:'속도를 조정하면 어떻게 달라질까요?',summary:'교재·범위와 병행 계획을 정리했습니다.'};
 const shortHelp={book:'지금 쓰는 교재를 유지해도 좋습니다.',range:'확인하며 이어갈 범위를 선택합니다.',deep:'새 진도와 심화의 범위는 달라도 됩니다.',deepScope:'이미 배운 범위에서 깊이를 더할 수도 있습니다.',cadence:'응용 다음에 심화로 이어가거나, 별도 시간에 병행합니다.',calc:'연산은 교과와 나란히 이어갑니다.',checkpoint:'다른 날, 다른 조건에서도 풀 수 있는지 살펴봅니다.',tempo:'현재 학습량을 유지할 때와 서서히 늘릴 때를 비교합니다.',allocation:'기존 복습·심화·연산은 유지합니다.',load:'6개월에 걸쳐 목표 회차에 적응한 뒤, 더 늘리지 않고 합류까지 유지합니다.',summary:'선택한 교재와 회차를 지도에 연결했습니다.'};coach(titles[transitionPage],shortHelp[transitionPage]);
 const options=(kind,items,value)=>'<div class="pathway-options study-options">'+items.map(x=>`<button type="button" data-transition-kind="${kind}" data-transition-value="${esc(x.id)}" aria-pressed="${value===x.id}"><strong>${esc(x.title)}</strong><span>${esc(x.summary)}</span>${(x.lines||[]).map(line=>`<span class="level-option-detail">${esc(line)}</span>`).join('')}${value===x.id?'<small>선택한 항목</small>':''}</button>`).join('')+'</div>';
 const lists={book:d.books,range:d.ranges,deep:d.deepBooks,deepScope:d.deepScopes,cadence:T.cadenceOptions(transition,progression,answers,intakeFields()),calc:d.calcs,checkpoint:T.CHECKS,tempo:T.TEMPOS,allocation:T.ALLOCATIONS,load:T.LOADS};
 let content='';
 if(transitionPage==='summary'){
  content=`<p class="study-chosen-book"><small>교과 · ${esc(T.rangeLabel(d.n,d.range.end))}</small><strong>${esc(d.book.book)}</strong></p><details class="choice-help"><summary>과정별 공부 방법과 병행 내용</summary><ol class="study-steps">${d.rows.map(r=>`<li><strong>${esc(r.school)}</strong><p>심화 · ${esc(r.deep)}</p><p>연산 · ${esc(r.calc)}</p><p>${esc(r.checkpoint)}</p></li>`).join('')}</ol><p>연산은 독립적으로 이어가는 한 흐름입니다. 교과 학기마다 같은 권을 반복하는 일정은 아닙니다. 책을 끝낸 사실과 개념을 적용하는 모습은 구분해 확인합니다.</p></details><div class="pathway-options study-options"><button type="button" data-flow-map><strong>선택한 계획 확인</strong></button></div><details class="choice-help"><summary>설계 변경하기</summary><div class="pathway-options study-options"><button type="button" data-transition-open="tempo"><strong>공부 속도 다시 비교하기</strong></button><button type="button" data-transition-open="book"><strong>교재·범위 다시 고르기</strong></button><button type="button" data-pathway-root="academic"><strong>다음 학교 과정도 살펴보기</strong></button></div></details>`;
 }else{
  const introductions={book:'현재 교재를 유지하거나 같은 과정의 기존 교재 후보를 비교합니다. 다음 학기마다 새 교재를 추가하는 구매 목록은 아닙니다.',range:'선택한 끝 범위까지 중간 과정을 순서대로 표시합니다. 확인이 필요한 부분에서는 보완하고, 정해진 달 안에 끝내도록 배정하지 않습니다.',deep:'심화 교재를 추가하지 않는 선택도 가능합니다. 심화와 교과 진도는 서로 달라도 됩니다.',deepScope:'같은 범위에 깊이를 더하거나, 이미 배운 범위를 병행할 수 있습니다. 현재 심화를 유지하면 그 범위는 별도로 남겨둡니다.',cadence:'표준의 응용 다음 심화 기간과, 교과를 이어가며 심화를 병행하는 경우를 구분합니다. 병행은 별도 공부 시간이 확보되는 경우의 계획입니다.',calc:'현재 연산을 유지하거나 비교 예시의 범위까지 이어가는 선택입니다. 연산의 원리와 정확성을 확인하며 진행합니다.',checkpoint:'학부모가 관찰한 학습 모습입니다. 다른 조건·다른 날에도 혼자 적용하는지 확인하고, 담당 선생님과 다음 범위를 상의합니다.',load:'기존 복습·심화·연산과 휴식은 유지합니다. 목표 추가 회차를 정하고 2개월째 50%, 4개월째 80%, 6개월째 100%로 서서히 늘립니다. 초등·중등은 회당 2시간, 고등은 3시간입니다.',allocation:'같은 학습량을 더해도 복습·심화에 쓰는 경우와 새 진도에 나누어 쓰는 경우는 다릅니다. 수면·휴식과 기존 과제를 줄이지 않는 범위에서 선택합니다.',tempo:'오른쪽 비교 레벨도 같은 시간 동안 공부를 이어갑니다. 학습량을 늘려도 진도 차이가 남을 수 있습니다.'};
  content=`<p class="pathway-coach-advice">${esc(introductions[transitionPage])}</p>`+options(transitionPage,lists[transitionPage],d.s[transitionPage]);
  if(!lists[transitionPage]?.length)content+='<p>현재 교과 교재·범위가 확인되지 않았습니다. 현재 학습을 먼저 선택해 주세요.</p><button type="button" data-flow-intake>현재 학습 선택하기</button>';
  if(['tempo','allocation','load'].includes(transitionPage))content+='<details class="choice-help"><summary>수업 회차와 계산 기준</summary>'+T.renderScenario(d,T.timeline(transition,progression,answers,intakeFields()),intakeFields())+'</details>'+`<div class="pathway-options study-options"><button type="button" data-transition-open="${d.checkpoint?'summary':'checkpoint'}"><strong>${d.checkpoint?'선택한 교재 계획 정리 보기':'교재·병행과 다음 과정 전 확인 선택'}</strong></button></div>`;

 }
 const navigation=PlannerPlanNavigation.transition(d.s,transitionPage),activeStage=navigation.index+1;
 const progressMarkup='<div class="design-progress"><span>'+activeStage+' / '+navigation.order.length+' · '+esc(navigation.label)+'</span><i style="--completion:'+(activeStage/navigation.order.length*100)+'%" aria-hidden="true"></i></div>';
 $('pathwayCoachContent').innerHTML=progressMarkup+(order.indexOf(transitionPage)>0?'<button type="button" class="workspace-prev" data-transition-open="'+order[order.indexOf(transitionPage)-1]+'">← 이전 갈림길</button>':'')+content+'<div class="personality-actions"><button type="button" data-progress-open="levels">레벨 비교로 돌아가기</button><button type="button" data-flow-overview="home">다른 공부 방향 보기</button></div>';
 drawJourney();saveTransition();rememberFlow();focusFlow();revealMap('.learning-landscape');
}
function transitionClick(b){
 if(b.dataset.transitionOpen){const fromTable=!!b.closest('#workspace-panel-table');openTransition(b.dataset.transitionOpen);if(fromTable)setWorkspaceView('table');return true;}
 if(!b.dataset.transitionKind)return false;
 const kind=b.dataset.transitionKind;if(kind==='axis'&&completed&&roadmapMode==='standard'){standardAxis=b.dataset.transitionValue;workspaceView='graph';rememberWorkspace();drawJourney();$('journeyMap').querySelector('[data-transition-kind=axis][data-transition-value="'+standardAxis+'"]')?.focus({preventScroll:true});return true;}transition=T.choose(transition,progression,answers,intakeFields(),kind,b.dataset.transitionValue);saveTransition();
 if(kind==='axis'){drawJourney();revealMap('.transition-graph>header');$('journeyMap').querySelector('[data-transition-kind=axis][data-transition-value="'+transition.axis+'"]')?.focus({preventScroll:true});return true;}
 const next={book:'range',range:'deep',deep:transition.deep==='none'?'calc':'deepScope',deepScope:'cadence',cadence:'calc',calc:'checkpoint',checkpoint:'tempo',tempo:transition.tempo==='gradual'?'allocation':'tempo',allocation:transition.allocation==='advance'?'load':'allocation',load:'load'}[kind];openTransition(next);return true;
}
function progressClick(b){
 if(b.dataset.progressEdit){ask(b.dataset.progressEdit);return true;}
 if(b.hasAttribute('data-progress-books')){const node=G.course(progression,answers,intakeFields());if(node){node.course=PlannerCourseGuide.detail(node,{audience:'general'});openCourse(node);}return true;}
 if(b.dataset.progressOpen){openProgress(b.dataset.progressOpen);return true;}
 const kind=b.dataset.progressKind|| (b.dataset.progressTarget?'target':null),value=b.dataset.progressValue||b.dataset.progressTarget;
 if(kind){progression=G.choose(progression,answers,intakeFields(),kind,value);saveProgress();openProgress(kind==='goal'?(value==='step'?'levels':'focus'):kind==='target'?'levels':kind==='focus'?'observation':kind==='observation'?'pace':'summary');return true;}
 return false;
}
function scienceContext(){
 if(caseActive)return S.caseContext(PlannerCase.model(caseState));
 const fields=intakeFields(),standard=PlannerStandard.model(answers,fields,{pattern:standardPattern,calcDaysPerWeek,supplement:supplementDecision});
 const timeline=completed&&roadmapMode==='custom'&&transition?.book&&transition?.range?T.timeline({...T.restore(transition,progression,answers,fields),axis:'school'},progression,answers,fields):null;
 return S.normalContext(standard,timeline,fields);
}
function scienceEntry(){return I.audience(answers,intakeFields())==='high'?'<button type="button" data-college-open="school"><strong>현재 과학 교재·범위 확인</strong><span>실제 중등·고등 과학의 개념·탐구를 함께 확인합니다.</span></button>':S.root(scienceState);}
const scienceSteps=['current','route','depth','gifted','summary'];
let sciencePage='current';
function scienceFlow(){
 const m=S.model(scienceState,scienceContext()),middle=m.curriculum?.middle;
 return {
 current:['과학은 어디까지 공부했나요?','이미 배운 범위만 골라주세요. 초등 기본을 먼저 정리하고 중등 과학으로 이어가겠습니다.'],
 route:['과학을 어떤 순서로 공부할까요?',middle?'학교 과학과 내신을 중심에 두겠습니다. 선행은 수학에서 배운 내용에 맞춰 별도로 이어갑니다.':m.route!=='otu'?'분야별로 이어 배우는 계통별 과정부터 보겠습니다. 물리에 필요한 식과 그래프도 함께 확인할게요.':'오투로 학년·학기별 개념을 차근차근 익히겠습니다. 이미 마친 권이 있다면 시작 범위를 바꿀 수 있어요.'],
 depth:['기본 이후에는 어디까지 이어갈까요?','중등 기본 이후에는 심화 브릿지 6개월과 하이탑 심화 반복으로 연결합니다. 지금은 기본에 집중하고 나중에 선택해도 괜찮습니다.'],
 gifted:['영재원 대비도 함께 할까요?','기존 공부에 별도로 더하는 준비입니다. 지원 분야와 평가 방식에 맞춰 필요한 교재와 준비를 골라보겠습니다.'],
 summary:['선택한 과학 계획을 확인해 주세요.','지도에서 시작 시기를, 표에서 학교 공부와 선행·심화의 병행을 보세요. 과정을 누르면 교재와 공부 방법도 확인할 수 있습니다.']
 };
}
function scienceChoicePage(){
 const root=$('pathwayCoachContent'),m=S.model(scienceState,scienceContext()),index=scienceSteps.indexOf(sciencePage);
 root.innerHTML=S.choices(scienceState,scienceContext());
 for(const part of root.querySelectorAll('[data-science-step]'))part.hidden=part.dataset.scienceStep!==sciencePage;
 const details=root.querySelectorAll('[data-science-step="'+sciencePage+'"] details');
 const first=sciencePage==='current'?details[details.length-1]:details[0];
 if(first&&['current','gifted'].includes(sciencePage))first.open=true;
 if(sciencePage==='summary')root.insertAdjacentHTML('beforeend',`<dl class="science-selection-summary"><dt>기본 과정</dt><dd>${esc(m.orderLabel)}</dd><dt>심화 연결</dt><dd>${m.continuation.some(b=>b.bridge)?'브릿지 전체 6개월 → 하이탑 심화 반복':'학기별 기본 · 심화는 이후에 선택'}</dd><dt>영재원 대비</dt><dd>${m.prepPlan?esc(m.institute)+' · '+esc(m.prepBook):'지금 공부에 집중'}</dd></dl><button type="button" data-science-result>지도·월별 계획 보기 →</button>`);
 root.insertAdjacentHTML('afterbegin',`<p class="science-step">${index+1} / 5 · ${['현재 범위','기본 과정','심화 연결','영재원 대비','계획 확인'][index]}</p>`);
 root.insertAdjacentHTML('beforeend',`<nav class="science-flow-actions" aria-label="과학 설계 이동"><button type="button" ${index?`data-science-page="${scienceSteps[index-1]}"`:'data-flow-overview="home"'}>← ${index?'이전':'전체 갈림길'}</button>${index<4?`<button type="button" data-science-page="${scienceSteps[index+1]}">다음 →</button>`:''}<button type="button" data-science-later>다음에 생각하기</button></nav>`);
}
function openScience(focus=true,activate=true,page=sciencePage){
 sciencePage=scienceSteps.includes(page)?page:'current';
 if(activate){scienceState=S.choose(scienceState,'enabled','yes');PlannerStorage.setItem(scienceKey,JSON.stringify(scienceState));}
 const previousMode=roadmapMode;flowMode='science';coach(...scienceFlow()[sciencePage]);roadmapMode=previousMode;saveRoadmapMode();
 scienceChoicePage();
 drawJourney();rememberFlow();if(focus)focusFlow();
}
function handleScienceClick(e){
 const b=e.target.closest('button');if(!b)return false;
 if(b.dataset.sciencePage){openScience(true,false,b.dataset.sciencePage);$('pathwayCoach').scrollTop=0;return true;}
 if(b.hasAttribute('data-science-later')){openOverview();return true;}
 if(b.hasAttribute('data-science-result')){setWorkspaceView('map');mobileWorkspace('result');$('journeyTitle').focus({preventScroll:true});return true;}
 if(b.hasAttribute('data-school-goal-open')){openSchoolGoal();return true;}
 if(b.dataset.schoolGoal){if(caseActive){caseScience=S.choose(caseScience,'schoolGoal',b.dataset.schoolGoal);caseGoalOpen=true;rememberCase();drawCaseJourney();focusFlow();}else{scienceState=S.choose(scienceState,'schoolGoal',b.dataset.schoolGoal);PlannerStorage.setItem(scienceKey,JSON.stringify(scienceState));openSchoolGoal();}return true;}
 if(caseActive&&caseGoalOpen&&(b.dataset.pathwayEntry||b.dataset.pathwayRoot==='center'||b.dataset.transitionOpen)){
  caseGoalOpen=false;caseScienceOpen=false;
  if(b.dataset.pathwayEntry)caseRoutes=PlannerCaseRoutes.goalEntry(caseRoutes,b.dataset.pathwayEntry);
  else if(b.dataset.pathwayRoot==='center'){caseRoutes=PlannerCaseRoutes.select(caseRoutes,'gifted',null,'center');caseState=PlannerCase.choose(caseState,'gifted','review');}
  rememberCase();drawCaseJourney();
  if(b.dataset.transitionOpen){const adjustments=$('pathwayCoachContent').querySelector('.case-plan-adjustments');if(adjustments)adjustments.open=true;}
  $('pathwayTitle').focus({preventScroll:true});mobileWorkspace('choice');return true;
 }
 if(b.hasAttribute('data-science-open')){
  if(caseActive){caseGoalOpen=false;caseScience=S.choose(caseScience,'enabled','yes');caseScienceOpen=true;rememberCase();drawCaseJourney();$('pathwayTitle').focus({preventScroll:true});mobileWorkspace('choice');}
  else openScience();
  return true;
 }
 if(b.dataset.scienceKind){
  const y=scrollY,opened=new Map([...$('pathwayCoachContent').querySelectorAll('.science-settings')].map(d=>[d.querySelector('summary')?.textContent,d.open])),scrolls=[...$('journeyMap').querySelectorAll('.science-timeline-scroll,.science-chain,.science-chart')].map(d=>d.scrollLeft);
  if(caseActive){caseScience=S.choose(caseScience,b.dataset.scienceKind,b.dataset.scienceValue);caseScienceOpen=true;rememberCase();drawCaseJourney();}
  else{scienceState=S.choose(scienceState,b.dataset.scienceKind,b.dataset.scienceValue);openScience(false);}
  for(const d of $('pathwayCoachContent').querySelectorAll('.science-settings'))if(opened.has(d.querySelector('summary')?.textContent))d.open=opened.get(d.querySelector('summary')?.textContent);
  [...$('journeyMap').querySelectorAll('.science-timeline-scroll,.science-chain,.science-chart')].forEach((d,i)=>d.scrollLeft=scrolls[i]||0);
  requestAnimationFrame(()=>window.scrollTo({top:y,behavior:'auto'}));
  $('pathwayCoachContent').querySelector('[data-science-kind="'+b.dataset.scienceKind+'"][data-science-value="'+b.dataset.scienceValue+'"]')?.focus({preventScroll:true});
  return true;
 }
 if(b.dataset.scienceBlock){
  const detail=S.guidance(S.model(caseActive?caseScience:scienceState,scienceContext()),b.dataset.scienceBlock);
  if(detail){PlannerFullscreen.leaveForAction(b);$('courseTitle').textContent=detail.title;$('courseContent').innerHTML=detail.html;showCourseDialog();}
  return true;
 }
 return false;
}
function flowClick(b){
 if(handleStudyButton(b))return true;
 if(languageClick(b))return true;
 if(referenceClick(b))return true;
 if(b.hasAttribute('data-student-choice')){openStudentChoice();return true;}
 if(b.hasAttribute('data-student-growth')){if(!studentProfile.gender){openStudentChoice('growth');return true;}PlannerFullscreen.close();$('studentGrowthContent').innerHTML=PlannerStudentVisual.growth(careerContext());$('studentGrowthDialog').showModal();return true;}
 if(careerClick(b))return true;
 if(b.hasAttribute('data-flow-choices')){PlannerFullscreen.close();if(!flowMode)openOverview();else{mobileWorkspace('choice');$('pathwayTitle').focus({preventScroll:true});}return true;}
 if(b.hasAttribute('data-plan-questions')){PlannerFullscreen.close();setWorkspaceView('records');mobileWorkspace('result');$('workspace-tab-records').focus({preventScroll:true});return true;}
 if(handleCollegeButton(b)||transitionClick(b)||progressClick(b))return true;
 if(b.hasAttribute('data-core-view')){setWorkspaceView(b.dataset.coreView);mobileWorkspace('result');return true;}
 if(b.hasAttribute('data-flow-overview')){openOverview(b.dataset.flowOverview);return true;}
 if(b.hasAttribute('data-flow-personality')){openPersonality();return true;}
 if(b.hasAttribute('data-flow-intake')){ask('grade');return true;}
 if(b.hasAttribute('data-flow-map')){mobileWorkspace('result');$('journeyTitle').focus({preventScroll:true});if(innerWidth<=800)window.scrollTo({top:0,behavior:'auto'});return true;}
 if(b.hasAttribute('data-plan-back')){openPathway(pathwayActiveId||pathwayTrail.at(-1));return true;}
 if(b.dataset.planOpen){if(pathwayPlan?.path&&['books','methods'].includes(b.dataset.planOpen)&&b.closest('.study-trail'))pathwayActiveId=R.scope(pathwayTrail,pathwayPlan.path.split('/').at(-1)).at(-1);openPathwayPlan(b.dataset.planOpen);return true;}
 if(b.dataset.planKind){pathwayPlan=R.choose(pathwayPlan,pathwayTrail,pathwayActiveId,pathwayContext(),b.dataset.planKind,b.dataset.planValue);if(b.dataset.planKind==='book'&&b.dataset.planValue==='current'&&T.bookOptions(progression,answers,intakeFields()).some(x=>x.id==='current')){transition=T.choose(transition,progression,answers,intakeFields(),'book','current');saveTransition();}openPathwayPlan(b.dataset.planKind==='book'?'methods':'summary');return true;}
 if(personalityClick(b))return true;
 if(b.dataset.pathwayEntry){setPathwayTrail(X.entry(b.dataset.pathwayEntry));openPathway(pathwayTrail.at(-1));return true;}
 if(b.dataset.pathwayRoot){choosePathway(null,b.dataset.pathwayRoot);openPathway(b.dataset.pathwayRoot);return true;}
 return false;
}
$('pathwayCoachContent').onclick=e=>{if(handleStudyButton(e.target.closest('button'))||handleHistoryClick(e)||handleCollegeClick(e)||handleScienceClick(e)||handleCaseClick(e))return;const b=e.target.closest('button');if(!b||flowClick(b))return;if(b.dataset.pathwayTo){choosePathway(b.dataset.pathwayFrom,b.dataset.pathwayTo);openPathway(pathwayTrail.at(-1));}};
$('flowMapPeek').onclick=e=>{const b=e.target.closest('button');if(b)flowClick(b);};
$('pathwayOverview').textContent='← 전체 갈림길 보기';
$('pathwayOverview').onclick=()=>openOverview();
$('pathwayShowMap').onclick=()=>{mobileWorkspace('result');$('journeyTitle').focus({preventScroll:true});};
function prepareWorkspaceGraph(){

 const graph=$('journeyMap').querySelector('.transition-graph');if(!graph)return;
 const details=document.createElement('details');details.className='workspace-note graph-context';const title=document.createElement('summary');title.textContent='레벨·선택 범위·비교 가정 자세히';details.append(title);
 const overview=graph.querySelector('.transition-overview');
 if(overview){const label=document.createElement('p');label.className='workspace-level-caption';const values=[...overview.querySelectorAll('dd')],direction=overview.querySelectorAll('dt')[1]?.textContent.includes('아래')?'아래 비교':'상위 비교';const levelContext=G.context(answers,intakeFields());label.textContent=G.levelScope(levelContext)+' · '+I.labelMonth(levelContext.now)+' 기준 · 현재 '+(values[0]?.textContent||'확인 전')+' · '+direction+' '+(values[1]?.textContent||'확인 전');graph.querySelector('header').after(label);details.append(overview);}
 const note=graph.querySelector('.transition-curve-note');
 if(note){const result=document.createElement('p');result.className='workspace-graph-result';result.textContent=note.querySelector('strong')?.textContent||note.textContent;graph.querySelector('.transition-chart-wrap')?.before(result);details.append(note);}
 for(const n of graph.querySelectorAll('.transition-chart-caption,.transition-condition'))details.append(n);
 const actions=graph.querySelector('.atlas-graph-actions');for(const n of [...(actions?.children||[])])if(!n.hasAttribute('data-atlas-full'))details.append(n);
 const reading=graph.querySelector('.graph-reading');if(reading)reading.before(details);else graph.append(details);
}
function currentChoiceQuestions(){
 if(flowMode!=='transition')return '';
 const d=T.detail(transition,progression,answers,intakeFields()),questions={
  deep:['심화 교재는 교과와 같은 학기를 해야 하나요?','같은 학기를 깊게 다룰 수도 있고, 이미 배운 범위에서 풀이의 근거를 충분히 살펴볼 수도 있습니다. 다음 갈림길에서 심화의 학기를 따로 고르면 선택한 교과와 나란히 표시됩니다.'],
  deepScope:['심화 범위를 낮추면 교과 진도도 다시 내려가나요?','교과와 심화 범위는 따로 기록합니다. 교과 진도를 유지하면서 이전 범위의 심화를 선택할 수 있으며, 지도에도 두 교재의 학기를 구분해 표시합니다.'],
  cadence:['교과 뒤에 심화를 하는 것과 나란히 병행하는 것은 어떻게 다른가요?',d.s.cadence==='parallel'?'선택한 심화를 교과와 같은 시기에 별도 시간으로 배치했습니다. 교과 사이의 대기는 줄지만 심화 자체에 필요한 기간은 유지합니다. 두 과정의 부담이 겹치는 시기를 함께 확인해 주세요.':'교과를 다룬 뒤 선택한 범위의 심화를 이어갑니다. 표준에 심화 두 달이 배정된 구간에는 선택한 심화를 공부하며, 연산은 계속 이어갑니다. 병행을 선택하면 교과와 심화가 겹치는 기간을 비교할 수 있습니다.']
 };
 const q=questions[transitionPage];return q?'<section class="pathway-parent-questions"><details><summary>'+esc(q[0])+'</summary><p>'+esc(q[1])+'</p></details></section>':'';
}
function showStudy(restoring=false){
 PlannerFullscreen.close();
 if(!studyActive){studyReturnView=restoring&&studySaved?.returnView||workspaceView;studyReturnPane=restoring&&studySaved?.returnPane||document.body.dataset.workspacePane||'result';}
 if(historyState.active)closeHistory(false);if(caseActive)closeCase(false);
 studyActive=true;workspaceView=restoring&&['map','graph','table','records'].includes(studySaved?.view)?studySaved.view:'map';
 showView('vmap');drawStudyJourney();mobileWorkspace(restoring&&studySaved?.pane==='choice'?'choice':'result');rememberStudy();
 const href=window.PlannerDirectLinks?.studyHref?.(window.location?.href);if(!restoring&&href&&window.history?.replaceState)window.history.replaceState(null,'',href);
}
function closeStudy(render=true){
 if(!studyActive)return;clearSeniorDirectUrl();PlannerFullscreen.close();studyActive=false;document.body.removeAttribute('data-study-workspace');rememberStudy();workspaceView=studyReturnView;
 $('pathwayCoach').querySelector('.coach-reference').hidden=false;$('pathwayCoach').querySelector('.pathway-coach-actions').hidden=false;$('flowMapPeek').hidden=false;
 if(render)resumeOwnPlan(studyReturnView,studyReturnPane);
}
function drawStudyJourney(){
 const m=SPV.model(studyState);PlannerFaq.unmount($('journeyMap'));PlannerPresentation.unmount($('journeyMap'));
 document.body.dataset.studyWorkspace='true';document.body.dataset.planMode='custom';document.body.dataset.scienceFlow='false';document.body.dataset.referenceFlow='false';document.body.removeAttribute('data-history-workspace');document.body.classList.remove('questioning');document.body.classList.add('exploring');
 document.body.removeAttribute('data-plan-workspace');PlannerPlanNavigation.references(document,false);
 $('conversation').hidden=true;$('pathwayCoach').hidden=false;$('planningOverview').hidden=true;
 $('pathwayTitle').textContent='초5부터 공통수학 2까지 함께 설계합니다.';$('pathwaySummary').textContent=m.overview.winter;
 $('pathwayCoachContent').innerHTML=SPV.choices(m);$('pathwayCoach').querySelector('.coach-reference').hidden=true;$('pathwayCoach').querySelector('.pathway-coach-actions').hidden=true;$('flowMapPeek').hidden=true;
 $('coachQuestions').replaceChildren();$('intakeQuestions').replaceChildren();
 const tabs=[['map','공부 지도'],['graph','진도·활용 그래프'],['table','교재·월별 과정'],['records','설계 기준·질문']],pane=(id,html)=>'<section id="workspace-panel-'+id+'" class="workspace-panel" data-workspace-panel="'+id+'" role="tabpanel" aria-labelledby="workspace-tab-'+id+'" tabindex="0"'+(workspaceView===id?'':' hidden')+'>'+html+'</section>';
 $('journeyMap').innerHTML='<div class="workspace-results">'+SPV.summary(m)+'<div class="workspace-tabs" role="tablist" aria-label="초5 설계 예시의 같은 계획 비교">'+tabs.map(([id,t])=>'<button type="button" role="tab" id="workspace-tab-'+id+'" data-workspace-view="'+id+'" aria-controls="workspace-panel-'+id+'" aria-selected="'+(workspaceView===id)+'" tabindex="'+(workspaceView===id?0:-1)+'">'+t+'</button>').join('')+'</div>'+pane('map',SPV.map(m))+pane('graph',SPV.graph(m))+pane('table',SPV.table(m)+SPV.weekly(m)+SPV.scienceRibbon(m))+pane('records',SPV.records(m)+(window.PlannerCounsellingUpdates?.render('elementary')||'')+(window.PlannerCounsellingUpdates?.render('middle')||''))+'</div>';
 $('journeyTitle').textContent='초5 남학생 · 공통수학 2까지의 학습 설계';$('journeyCount').textContent='교과·사고력·쎈·연산·국어·과학';$('openReport').hidden=false;$('backToQuestion').textContent='계획 선택으로 돌아가기 ↑';
 $('pathwayStatus').textContent='이 설계 예시는 기존 학생 답변과 별도로 저장됩니다.';setWorkspaceView(workspaceView);PlannerGuide.mount(document);
}
function handleStudyButton(b){
 if(!b)return false;
 if(b.hasAttribute('data-study-open')){showStudy();return true;}
 if(!studyActive)return false;
 if(b.hasAttribute('data-study-close')||b.hasAttribute('data-flow-overview')){closeStudy();return true;}
 if(b.dataset.studyKind){studyState=SP.choose(studyState,b.dataset.studyKind,b.dataset.studyValue);rememberStudy();drawStudyJourney();return true;}
 if(b.dataset.studyBlock){const m=SPV.model(studyState),block=m.lanes.flatMap(l=>l.blocks).find(x=>x.id===b.dataset.studyBlock),event=m.events.find(x=>x.id===b.dataset.studyBlock);if(block||event){PlannerFullscreen.leaveForAction(b);$('courseTitle').textContent=(block||event).title;$('courseContent').innerHTML=block?'<p class="course-context">'+esc(SPV.when(block))+'</p><p><strong>'+esc(block.book||'')+'</strong></p><p>'+esc(block.note)+'</p>'+(block.phases?'<ol>'+block.phases.map(p=>'<li>'+esc(p.title)+' · 약 '+(p.end-p.start)+'개월</li>').join('')+'</ol>':''):'<p>'+esc(SP.dateAt(/complete$/.test(event.id)?event.at-1:event.at).label)+'</p><p>'+esc(event.note)+'</p>';showCourseDialog();}return true;}
 if(b.dataset.workspaceView){setWorkspaceView(b.dataset.workspaceView);return true;}
 return false;
}
function syncSeniorDirectUrl(id=null){
 const links=window.PlannerDirectLinks,href=id===null?links?.libraryHref(window.location?.href):links?.historyHref(window.location?.href,id);
 if(href&&window.history?.replaceState)window.history.replaceState(null,'',href);
}
function clearSeniorDirectUrl(){
 if(!window.location?.href||!window.history?.replaceState)return;
 const url=new URL(window.location.href);
 if(!url.searchParams.has('senior')&&url.searchParams.get('view')!=='seniors'&&url.searchParams.get('study')!=='grade5-balanced')return;
 url.searchParams.delete('senior');if(url.searchParams.get('view')==='seniors')url.searchParams.delete('view');if(url.searchParams.get('study')==='grade5-balanced')url.searchParams.delete('study');
 window.history.replaceState(null,'',url.href);
}
function openSeniorLibrary(){
 PlannerFullscreen.close();
 $('seniorLibraryContent').innerHTML='<section class="sp-catalog"><h3>상담 설계 예시</h3><button type="button" data-study-open><strong>초5 남학생 · 교과·사고력·쎈·연산·국어·과학</strong><small>5-2 응용에서 공통수학 2까지 · 내신을 고려한 월별 계획</small></button></section>'+HC.catalog();
 window.PlannerDirectLinks?.decorateLibrary($('seniorLibraryContent'),window.location?.href);
 syncSeniorDirectUrl();$('seniorLibraryDialog').showModal();
}
function applySeniorDirectLink(url){
 const route=window.PlannerDirectLinks?.resolve(url);if(!route)return;
 if(route.kind==='library')openSeniorLibrary();else if(route.kind==='history')showHistory(route.id);else if(route.kind==='case')showCase();else if(route.kind==='study')showStudy();
}
function showHistory(id,restoring=false){
 if(studyActive)closeStudy(false);
 PlannerFullscreen.close();
 if(!historyState.active){historyState.returnView=restoring?historySaved.returnView:caseActive?caseReturnView:workspaceView;historyState.returnPane=restoring?historySaved.returnPane:caseActive?caseReturnPane:document.body.dataset.workspacePane||'choice';}
 if(caseActive)closeCase(false);
 historyState=HC.choose(historyState,'case',id);historyState.active=true;
 workspaceView=restoring?historySaved.view:'map';
 drawHistoryJourney();mobileWorkspace(restoring?historySaved.pane:'result');rememberHistory();
 if(!restoring)syncSeniorDirectUrl(historyState.caseId);
}
function closeHistory(render=true){
 if(!historyState.active)return;
 if(window.PlannerPremierCohort?.isCase(historyState.caseId)){const map=$('journeyMap').querySelector('#workspace-panel-map');if(map)PlannerFaq.unmount(map);}
 clearSeniorDirectUrl();PlannerFullscreen.close();const view=historyState.returnView,pane=historyState.returnPane;historyState.active=false;document.body.removeAttribute('data-history-workspace');rememberHistory();workspaceView=view;
 $('pathwayCoach').querySelector('.coach-reference').hidden=false;$('pathwayCoach').querySelector('.pathway-coach-actions').hidden=false;$('flowMapPeek').hidden=false;
 if(render)resumeOwnPlan(view,pane);
}
function historyComparison(){
 const fields=intakeFields(),standard=PlannerStandard.model(answers,fields,{pattern:standardPattern,calcDaysPerWeek,supplement:supplementDecision});
 const value=roadmapMode==='standard'?T.inheritCadence(null,null,answers,fields,standard.level,standard.sequential?'deep':'thinking'):transition;
 const selected=T.choose(value,progression,answers,fields,'axis','school'),timeline=T.timeline(selected,progression,answers,fields),allowSelected=roadmapMode==='custom'&&selected.tempo==='gradual'&&timeline.adjusting;
 const useSelected=allowSelected&&historyState.compareMode==='selected',points=(useSelected?timeline.gradual:timeline.keep).map(p=>({x:p.x-timeline.now,y:p.y}));
 const source=Object.values(PLANNER_LEVELS).find(l=>l.id===timeline.base),m=HC.model(historyState),axes={};
 for(const axis of ['school','thinking']){
  const engineAxis=axis==='thinking'?'comp':axis,chosen=T.choose(value,progression,answers,fields,'axis',engineAxis),line=T.timeline(chosen,progression,answers,fields),ref=Object.values(PLANNER_LEVELS).find(l=>l.id===line.base),curve=useSelected&&axis==='school'?line.gradual:line.keep;
  axes[axis]={points:curve.map(p=>({x:p.x-line.now,y:p.y})),source:T.sourcePoints(ref,engineAxis),ordinal:text=>T.ordinal(text,engineAxis),blocks:(ref?.[engineAxis]||[]).filter(b=>!b[0].includes('학습 집중')).map(b=>({title:b[0]}))};
 }

 return PlannerSeniorComparison.render(m,{ready:completed,foreign:!!fields.internationalCalendar,points,source:T.sourcePoints(source,'school'),ordinal:course=>T.ordinal(course,'school'),date:offset=>T.calendarAt(timeline.now,offset,fields).label,caseDate:offset=>HC.dateAt(m.start,Math.floor(offset)).label,current:pathwayContext().currentStudy,axes,allowSelected,mode:useSelected?'selected':'keep'});
}
function drawPremierCohortJourney(){
 const pc=window.PlannerPremierCohort,m=pc.model(HC.model(historyState).index,cohortState);if(!m)return;
 $('openReport').hidden=true;
 const oldMap=$('journeyMap').querySelector('#workspace-panel-map');if(oldMap)PlannerFaq.unmount(oldMap);
 PlannerFullscreen.close();PlannerFaq.unmount($('journeyMap'));PlannerPresentation.unmount($('journeyMap'));
 document.body.dataset.referenceFlow='false';document.body.removeAttribute('data-plan-workspace');PlannerPlanNavigation.references(document,false);
 document.body.dataset.historyWorkspace='true';document.body.dataset.planMode='case';document.body.dataset.scienceFlow='false';document.body.classList.remove('questioning');document.body.classList.add('exploring');
 $('conversation').hidden=true;$('pathwayCoach').hidden=false;for(const view of document.querySelectorAll('.view'))view.classList.toggle('on',view.id==='vmap');
 $('planningOverview').hidden=true;$('pathwayTitle').textContent='합격생들은 무엇을 보완하며 공부했을까요?';$('pathwaySummary').textContent='교과·심화·사고력·연산을 함께 놓고, 세 가정이 고민한 선택을 살펴봅니다.';
 $('pathwayCoachContent').innerHTML=pc.choices(m);$('pathwayCoach').querySelector('.coach-reference').hidden=true;$('pathwayCoach').querySelector('.pathway-coach-actions').hidden=true;$('flowMapPeek').hidden=true;
 $('coachQuestions').replaceChildren();$('intakeQuestions').replaceChildren();
 const tabs=[['map','합격생 로드맵'],['graph','공통 학습 흐름'],['table','교재·월별 과정'],['records','고민·선택']];
 const pane=(id,html)=>'<section id="workspace-panel-'+id+'" class="workspace-panel" data-workspace-panel="'+id+'" role="tabpanel" aria-labelledby="workspace-tab-'+id+'" tabindex="0"'+(workspaceView===id?'':' hidden')+'>'+html+'</section>';
 $('journeyMap').innerHTML='<div class="workspace-results">'+pc.summary(m)+'<div class="workspace-tabs" role="tablist" aria-label="합격생들의 공부와 고민">'+tabs.map(([id,title])=>'<button type="button" role="tab" id="workspace-tab-'+id+'" data-workspace-view="'+id+'" aria-controls="workspace-panel-'+id+'" aria-selected="'+(workspaceView===id)+'" tabindex="'+(workspaceView===id?0:-1)+'">'+title+'</button>').join('')+'</div>'+pane('map',(window.PlannerCounsellingUpdates?.render('preschool',{compact:true,historical:true})||'')+pc.map(m)+pc.questions(m))+pane('graph',pc.graph(m))+pane('table',pc.table(m))+pane('records',pc.records(m)+(window.PlannerCounsellingUpdates?.render('preschool',{historical:true})||''))+'</div>';
 PlannerFaq.mount($('workspace-panel-map'),{selector:'.pco-questions'});$('journeyTitle').textContent=m.title;$('journeyCount').textContent='합격생들의 공부 · 다섯 시기';$('backToQuestion').textContent='고민 선택으로 돌아가기 ↑';
 $('pathwayStatus').textContent='이 사례에서 고른 고민은 우리 아이의 답변과 별도로 저장됩니다.';setWorkspaceView(workspaceView);PlannerGuide.mount(document);
}
function drawHistoryJourney(){
 if(window.PlannerPremierCohort?.isCase(historyState.caseId)){drawPremierCohortJourney();return;}
 document.body.dataset.referenceFlow='false';
 document.body.removeAttribute('data-plan-workspace');PlannerPlanNavigation.references(document,false);
 const m=HC.model(historyState);document.body.dataset.historyWorkspace='true';PlannerFaq.unmount($('journeyMap'));PlannerPresentation.unmount($('journeyMap'));
 document.body.classList.remove('questioning');document.body.classList.add('exploring');document.body.dataset.planMode='case';document.body.dataset.scienceFlow='false';
 $('conversation').hidden=true;$('pathwayCoach').hidden=false;for(const view of document.querySelectorAll('.view'))view.classList.toggle('on',view.id==='vmap');
 $('planningOverview').hidden=false;$('planningOverview').innerHTML='<div class="standard-intro"><small>선배들의 로드맵</small><h1>'+esc(m.title)+'</h1><p>'+esc(m.intro)+'</p></div>';
 $('pathwayTitle').textContent='전환을 고르면 병행 공부가 이어집니다.';$('pathwaySummary').textContent='기존 공부를 바꾸지 않고, 두 경로의 교과·사고력·영재원과 보완 지점을 살펴봅니다.';
 $('pathwayCoachContent').innerHTML=HC.choices(historyState);$('pathwayCoach').querySelector('.coach-reference').hidden=true;$('pathwayCoach').querySelector('.pathway-coach-actions').hidden=true;$('flowMapPeek').hidden=true;
 $('coachQuestions').replaceChildren();$('intakeQuestions').replaceChildren();
 const tabs=[['map','공부 지도'],['graph','과정 시점'],['table','교재·월별 과정'],['records','질문·공부 과정']];
 const comparison=historyState.compare?historyComparison():'';
 const pane=(id,html)=>'<section id="workspace-panel-'+id+'" class="workspace-panel" data-workspace-panel="'+id+'" role="tabpanel" aria-labelledby="workspace-tab-'+id+'" tabindex="0"'+(workspaceView===id?'':' hidden')+'>'+html+'</section>';
 $('journeyMap').innerHTML='<div class="workspace-results">'+HC.summary(historyState)+'<div class="workspace-tabs" role="tablist" aria-label="같은 사례 비교">'+tabs.map(([id,t])=>'<button type="button" role="tab" id="workspace-tab-'+id+'" data-workspace-view="'+id+'" aria-controls="workspace-panel-'+id+'" aria-selected="'+(workspaceView===id)+'" tabindex="'+(workspaceView===id?0:-1)+'">'+t+'</button>').join('')+'</div>'+pane('map',comparison+HC.map(historyState))+pane('graph',comparison+HC.graph(historyState))+pane('table',comparison+HC.calendar(m))+pane('records',comparison+'<div class="workspace-question-source">'+HC.questions(historyState)+'</div>'+HC.records(historyState))+'</div>';
 PlannerFaq.mount($('journeyMap'));
 $('journeyTitle').textContent=m.title;$('journeyCount').textContent='선택한 과정 '+m.built.length+'개';$('backToQuestion').textContent='사례 선택으로 돌아가기 ↑';
 $('pathwayStatus').textContent=({durable:'사례 선택은 이 기기에 따로 저장됩니다.',session:'사례 선택은 현재 탭에 저장됩니다.',memory:'사례 선택은 현재 화면에 유지됩니다.'})[PlannerStorage.status()];
 setWorkspaceView(workspaceView);PlannerGuide.mount(document);
}
function handleHistoryClick(e){
 const b=e.target.closest('button');if(!b)return false;
 if(window.PlannerPremierCohort&&handleCohortChoice(b))return true;
 if(b.dataset.historyCase){if(b.dataset.historyCase==='legacy'){if(historyState.active)closeHistory(false);showCase();}else showHistory(b.dataset.historyCase);return true;}
 if(!historyState.active)return false;
 if(b.hasAttribute('data-history-design')){openReferencePlan(HC.model(historyState));return true;}
 if(b.hasAttribute('data-history-compare')||b.hasAttribute('data-history-compare-close')||b.dataset.historyCompareMode){historyState.compare=!b.hasAttribute('data-history-compare-close');if(['keep','selected'].includes(b.dataset.historyCompareMode))historyState.compareMode=b.dataset.historyCompareMode;workspaceView='map';drawHistoryJourney();mobileWorkspace('result');rememberHistory();return true;}
 if(b.hasAttribute('data-history-close')){closeHistory();return true;}
 if(b.hasAttribute('data-history-choices')){PlannerFullscreen.close();mobileWorkspace('choice');const picker=$('pathwayCoachContent').querySelector('.history-case-picker');picker.open=true;picker.querySelector('summary').focus({preventScroll:true});return true;}
 if(b.hasAttribute('data-history-question')){setWorkspaceView('records');mobileWorkspace('result');$('workspace-tab-records').focus({preventScroll:true});return true;}
 if(b.dataset.historyArea){historyState=HC.choose(historyState,'area',b.dataset.historyArea);rememberHistory();drawHistoryJourney();$('journeyMap').querySelector('[data-workspace-panel="'+workspaceView+'"] [data-history-area="'+historyState.area+'"]')?.focus({preventScroll:true});return true;}
 if(b.dataset.historyStage!==undefined){const fromChoices=!!b.closest('#pathwayCoachContent');historyState=HC.choose(historyState,'stage',b.dataset.historyStage);rememberHistory();drawHistoryJourney();if(fromChoices&&innerWidth<=800){mobileWorkspace('result');$('journeyTitle').focus({preventScroll:true});}else (PlannerFullscreen.isOpen()||!fromChoices?$('journeyMap'):$('pathwayCoachContent')).querySelector(b.dataset.historyStep?'[data-history-step="'+b.dataset.historyStep+'"]':'[data-history-stage="'+historyState.stages[historyState.caseId]+'"]')?.focus({preventScroll:true});return true;}
 if(b.dataset.workspaceView){setWorkspaceView(b.dataset.workspaceView);return true;}
 return false;
}
function showCase(restoring=false){
 if(studyActive)closeStudy(false);
 if(historyState.active)closeHistory(false);
 if(!caseActive){caseReturnView=restoring&&['map','graph','table','records'].includes(caseSaved?.returnView)?caseSaved.returnView:workspaceView;
 caseReturnPane=restoring&&['choice','result'].includes(caseSaved?.returnPane)?caseSaved.returnPane:document.body.dataset.workspacePane||'choice';}
 caseActive=true;
 workspaceView=restoring&&['map','graph','table','records'].includes(caseSaved?.view)?caseSaved.view:'map';
 drawCaseJourney();
 mobileWorkspace(restoring&&caseSaved?.pane==='choice'?'choice':'result');
 rememberCase();if(!restoring)syncSeniorDirectUrl('legacy');
}
function closeCase(render=true){
 if(!caseActive)return;
 clearSeniorDirectUrl();PlannerFullscreen.close();caseActive=false;rememberCase();
 $('pathwayCoach').querySelector('.coach-reference').hidden=false;
 $('pathwayCoach').querySelector('.pathway-coach-actions').hidden=false;
 $('flowMapPeek').hidden=false;workspaceView=caseReturnView;
 if(!render)return;
 resumeOwnPlan(caseReturnView,caseReturnPane);
}
function resumeOwnPlan(returnView,returnPane){
 if(flowMode==='reference')openReferencePlan();
 else if(flowMode==='science')openScience(true,scienceState.enabled);
 else if(flowMode==='language')openLanguage(languageState.active,languagePage);
 else if(completed&&roadmapMode==='standard')showStandard(false);
 else if(flowMode==='transition')openTransition(transitionPage);
 else if(flowMode==='progression')openProgress(progressPage);
 else if(flowMode==='personality')openPersonality();
 else if(flowMode==='career')openCareer(careerPage);
 else if(flowMode==='college')openCollege(collegePage);
 else if(flowMode==='school-goal')openSchoolGoal();
 else if(flowMode==='pathway-plan'&&pathwayTrail.length)openPathwayPlan(planPage);
 else if(flowMode==='pathway'&&pathwayTrail.length)openPathway(pathwayActiveId||pathwayTrail.at(-1));
 else if(flowMode)openOverview(overviewPage);
 else if(question==='welcome')showWelcome();
 else if(!completed)ask(question);
 else drawJourney();
 setWorkspaceView(returnView);mobileWorkspace(returnPane);
}
function drawCaseJourney(){
 document.body.dataset.referenceFlow='false';
 document.body.removeAttribute('data-plan-workspace');PlannerPlanNavigation.references(document,false);
 const m=PlannerCase.model(caseState),V=PlannerCaseView,R=PlannerCaseRoutes,sc=S.caseContext(m);
 PlannerFaq.unmount($('journeyMap'));PlannerPresentation.unmount($('journeyMap'));
 document.body.classList.remove('questioning');document.body.classList.add('exploring');document.body.dataset.planMode='case';document.body.dataset.scienceFlow=String(caseScienceOpen);
 $('conversation').hidden=true;$('pathwayCoach').hidden=false;
 for(const view of document.querySelectorAll('.view'))view.classList.toggle('on',view.id==='vmap');
 $('planningOverview').hidden=false;
 $('planningOverview').innerHTML='<div class="standard-intro"><small>상담 사례 · 초2 9월부터 초5까지</small><h1>강남권 소마 A 중위권</h1><p>L9 기준 사례 · 교과 진도와 심화·사고력의 보완 과정을 함께 봅니다.</p></div><section class="current-learning-summary"><header>사례의 출발점 <small>소마를 그만둔 뒤의 병행 계획</small></header><dl class="current-learning-axes"><div class="current-learning-axis"><dt>교과</dt><dd><strong>디딤돌 응용 5-1</strong><small>초2 9월 · 학기당 2.5개월</small></dd></div><div class="current-learning-axis"><dt>심화</dt><dd><strong>최상위 S 4-1</strong><small>9월 중순부터 병행</small></dd></div><div class="current-learning-axis"><dt>사고력</dt><dd><strong>1031 초급부터 다지기</strong><small>중급에 앞서 보완 · 과정별 6개월</small></dd></div><div class="current-learning-axis is-empty"><dt>연산</dt><dd><strong>현재 교재 확인 필요</strong><small>교과 진도로 대신 추정하지 않음</small></dd></div></dl></section>';
 $('pathwayTitle').textContent=caseScienceOpen?'과학 공부를 이어갑니다.':'같이 이어갈 공부를 조정해 봅니다.';
 $('pathwaySummary').textContent=caseState.algebra==='after'?'응용을 마친 7월부터 초등 계통 대수심화를 시작합니다. 중등 시작도 두 달 뒤로 이어지며, 사고력의 6개월 흐름은 유지합니다.':'초3 5~6월에는 응용 6-2와 초등 계통 대수심화를 나란히 공부합니다. 응용을 끝낸 뒤에도 초등 계통 대수심화는 10월까지 이어갑니다.';
 $('pathwayCoachContent').innerHTML=HC.library('legacy')+R.renderChoices(caseRoutes,m,Q.rootButton()+S.root(caseScience,true,caseScienceOpen),caseScienceOpen?S.choices(caseScience,sc):'')+'<details class="case-plan-adjustments"'+(caseRoutes.active?'':' open')+'><summary>교재·병행 시기 조정</summary>'+V.choices(m)+'</details><button type="button" class="gear" data-case-close>우리 아이 계획으로 돌아가기</button>';
 if(caseGoalOpen){$('pathwayTitle').textContent='사례의 현재 공부에서 진학 목표 비교';$('pathwaySummary').textContent='사례의 교재·월별 기간은 유지하며 다음 공부 방향을 비교합니다.';$('pathwayCoachContent').innerHTML=Q.choices(caseScience.schoolGoal,goalContext())+'<button type="button" data-case-goal-close>사례 갈림길로 돌아가기</button>'; }
 $('pathwayCoach').querySelector('.coach-reference').hidden=true;$('pathwayCoach').querySelector('.pathway-coach-actions').hidden=true;$('flowMapPeek').hidden=true;
 $('coachQuestions').replaceChildren();$('intakeQuestions').replaceChildren();
 const tabs=[['map','공부 지도'],['graph','진도 비교'],['table','교재·월별 계획'],['records','사례와 선택 기록']];
 const pane=(id,content)=>`<section id="workspace-panel-${id}" data-workspace-panel="${id}" class="workspace-panel" role="tabpanel" aria-labelledby="workspace-tab-${id}" tabindex="0"${workspaceView===id?'':' hidden'}>${content}</section>`;
 $('journeyMap').innerHTML='<div class="workspace-results">'+V.summary(m)+'<div class="workspace-tabs" role="tablist" aria-label="같은 사례 비교">'+tabs.map(([id,title])=>`<button type="button" role="tab" id="workspace-tab-${id}" data-workspace-view="${id}" aria-controls="workspace-panel-${id}" aria-selected="${workspaceView===id}" tabindex="${workspaceView===id?0:-1}">${title}</button>`).join('')+'</div>'+pane('map',caseScienceOpen?S.render(caseScience,sc,'map')+V.map(m,R.renderMap(caseRoutes,m)):V.map(m,R.renderMap(caseRoutes,m)+S.render(caseScience,sc,'map')))+pane('graph',R.renderContext(caseRoutes,m)+(caseScienceOpen?S.render(caseScience,sc,'graph')+V.graph(m):V.graph(m)+S.render(caseScience,sc,'graph')))+pane('table',caseScienceOpen?S.render(caseScience,sc,'table')+R.renderMap(caseRoutes,m)+V.table(m):R.renderMap(caseRoutes,m)+V.table(m)+S.render(caseScience,sc,'table'))+pane('records',R.renderMap(caseRoutes,m)+V.records(m,true)+S.render(caseScience,sc,'table'))+'</div><div class="workspace-question-source">'+V.questions(m,[...Q.questions(caseScience.schoolGoal,goalContext()),...(caseScienceOpen?[...S.questions(caseScience,sc),...R.questions(caseRoutes,m)]:[...R.questions(caseRoutes,m),...S.questions(caseScience,sc)])])+'</div>';
 PlannerFaq.mount($('journeyMap'));const faq=$('journeyMap').querySelector('.faq-orbit');if(faq)$('coachQuestions').append(faq);
 $('journeyTitle').textContent=caseScienceOpen?'과학 공부 · 영재원 대비':'교과·심화·사고력, 나란히 이어지는 과정';$('journeyCount').textContent='상담 사례 · 같은 월별 일정으로 지도·그래프·표 비교';$('backToQuestion').textContent='갈림길로 돌아가기 ↑';
 for(const view of ['map','graph','table','records'])$('workspace-panel-'+view)?.insertAdjacentHTML(caseGoalOpen&&view!=='graph'?'afterbegin':'beforeend',Q.render(caseScience.schoolGoal,goalContext(),view));
 $('pathwayStatus').textContent=({durable:'이 기기에 저장되었습니다.',session:'현재 탭에 저장되었습니다.',memory:'현재 화면에만 유지됩니다.'})[PlannerStorage.status()];
 setWorkspaceView(workspaceView);PlannerGuide.mount(document);
}
function handleCaseClick(e){
 const b=e.target.closest('button');if(!b||!caseActive)return false;
 if(b.hasAttribute('data-case-goal-close')){caseGoalOpen=false;rememberCase();drawCaseJourney();return true;}
 if(b.hasAttribute('data-case-close')){closeCase();return true;}
 if(b.dataset.caseRouteFamily){
  const family=b.dataset.caseRouteFamily;caseScienceOpen=b.dataset.caseRouteTo==='science';if(caseScienceOpen)caseScience=S.choose(caseScience,'enabled','yes');
  caseRoutes=PlannerCaseRoutes.select(caseRoutes,family,b.dataset.caseRouteFrom||null,b.dataset.caseRouteTo);
  if(family==='gifted'&&caseRoutes.trails.gifted.length)caseState=PlannerCase.choose(caseState,'gifted','review');
  rememberCase();drawCaseJourney();
  $('pathwayCoachContent').querySelector('[data-case-route-family="'+family+'"][data-case-route-to="'+b.dataset.caseRouteTo+'"]')?.focus({preventScroll:true});
  return true;
 }
 if(b.dataset.caseKind){const adjustmentsOpen=$('pathwayCoachContent').querySelector('.case-plan-adjustments')?.open,kind=b.dataset.caseKind,value=b.dataset.caseValue,scrolls=[...$('journeyMap').querySelectorAll('.case-timeline-scroll,.case-chart-scroll')].map(x=>x.scrollLeft),opened=[...$('pathwayCoachContent').querySelectorAll('.case-choice-group')].map(x=>x.open);caseState=PlannerCase.choose(caseState,kind,value);rememberCase();drawCaseJourney();if(adjustmentsOpen)$('pathwayCoachContent').querySelector('.case-plan-adjustments').open=true;[...$('pathwayCoachContent').querySelectorAll('.case-choice-group')].forEach((x,i)=>x.open=opened[i]);[...$('journeyMap').querySelectorAll('.case-timeline-scroll,.case-chart-scroll')].forEach((x,i)=>x.scrollLeft=scrolls[i]||0);$('pathwayCoachContent').querySelector('[data-case-kind="'+kind+'"][data-case-value="'+value+'"]')?.focus({preventScroll:true});return true;}
 if(b.dataset.caseBlock){const m=PlannerCase.model(caseState),block=m.lanes.flatMap(l=>l.blocks).find(x=>x.id===b.dataset.caseBlock)||m.events.find(x=>x.id===b.dataset.caseBlock);PlannerFullscreen.leaveForAction(b);$('courseTitle').textContent=block?.title||'과정과 병행 방법';$('courseContent').innerHTML=PlannerCaseView.detail(m,b.dataset.caseBlock);showCourseDialog();return true;}
 if(b.dataset.workspaceView){setWorkspaceView(b.dataset.workspaceView);return true;}
 return false;
}
function drawJourney(){
 if(studyActive){drawStudyJourney();return;}
 $('openReport').hidden=!completed||caseActive||historyState.active;
 if(historyState.active){drawHistoryJourney();return;}
 if(caseActive){drawCaseJourney();return;}
 document.body.toggleAttribute('data-plan-workspace',completed);PlannerPlanNavigation.references(document,completed);
 const pathwayTrail=visiblePathwayTrail();
 // Intermediate edits can temporarily lack a status; retain saved decisions until confirmed.
 if(completed){
  const nextProgress=G.restore(progression,answers,intakeFields());if(JSON.stringify(progression)!==JSON.stringify(nextProgress)){progression=nextProgress;saveProgress();}else progression=nextProgress;
  const nextTransition=T.restore(transition,progression,answers,intakeFields());if(JSON.stringify(transition)!==JSON.stringify(nextTransition)){transition=nextTransition;saveTransition();}else transition=nextTransition;
 }
 const previous=journeyModel;journeyModel=PlannerJourney.model(answers,intakeFields(),question,completed);
 journeyModel.axes.forEach(x=>{x.justAdded=x.ready&&!previous?.axes.find(p=>p.id===x.id)?.ready;});

 if(!completed&&document.body.classList.contains('questioning')){const context=careerContext();$('journeyTitle').textContent='선택하며 만드는 로드맵';$('journeyCount').textContent='';$('planningOverview').hidden=true;$('journeyMap').innerHTML=PlannerStudentVisual.intakeMap(context,journeyModel);return;}
 $('journeyTitle').textContent=completed?'우리 아이의 전체 로드맵':question==='welcome'?'앞으로 어떤 길이 있을까요?':'답을 모아 로드맵을 만들어요';
 $('journeyCount').textContent=completed?'지금 공부하는 내용과 다음 과정':journeyModel.ready?`교과·심화·사고력·연산 중 ${journeyModel.ready}가지 확인했어요`:'교과·심화·사고력·연산을 하나씩 살펴볼게요.';
 const scrollTop=$('journeyPanel').scrollTop;
 PlannerFaq.unmount($('journeyMap'));
 for(const host of [$('coachQuestions'),$('intakeQuestions')])host.replaceChildren();
 const standard=PlannerStandard.model(answers,intakeFields(),{pattern:standardPattern,calcDaysPerWeek,supplement:supplementDecision}),standardActive=completed&&roadmapMode==='standard';
 document.body.dataset.planMode=standardActive?'standard':completed?'custom':'intake';document.body.dataset.scienceFlow=String(flowMode==='science');document.body.dataset.referenceFlow=String(flowMode==='reference');
 $('planningOverview').hidden=!completed;
 $('planningOverview').innerHTML=completed?'<details class="plan-current-details"><summary>현재 공부·선택한 계획</summary><div class="plan-current-popover">'+PlannerWorkspace.currentSummary(answers,intakeFields())+'<button type="button" data-student-choice>남학생·여학생 선택 변경</button><button type="button" data-plan-references>전체 답변·기존 시기별 지도 보기</button></div></details>':'';
 const board=intakeFields().internationalCalendar?'':PlannerWorkspace.render(transition,progression,answers,{...intakeFields(),supplementDecision},pathwayTrail,{course:workspaceCourse}),schedule=intakeFields().internationalCalendar?'':PlannerWorkspace.renderSchedule(transition,progression,answers,{...intakeFields(),calcDaysPerWeek,supplementDecision},pathwayTrail);
 const tabs=flowMode==='language'&&languageState.active==='english'?[['map','공부 지도'],['graph',intakeFields().internationalCalendar?'학교 과정 흐름':'학년별 흐름'],['table','교재·병행 과정'],['records','질문·선택 기록']]:[['map','공부 지도'],['graph','진도 비교'],['table','교재·수업 계획'],['records','질문·선택 기록']];
 const pane=(id,content)=>`<section id="workspace-panel-${id}" data-workspace-panel="${id}" class="workspace-panel" role="tabpanel" aria-labelledby="workspace-tab-${id}" tabindex="0"${workspaceView===id?'':' hidden'}>${content}</section>`;
 const records='<details class="workspace-current"><summary>현재 공부 · '+journeyModel.ready+'가지</summary>'+PlannerJourney.render(journeyModel,{directions:false})+'</details><details class="workspace-comparison" open><summary>레벨 뜻과 영역별 비교</summary>'+G.render(progression,answers,intakeFields(),{timeline:' '})+'</details><details class="workspace-choices"><summary>선택한 교재·범위 수정</summary>'+T.renderTrail(transition,progression,answers,intakeFields())+'</details>'+X.renderTrail(pathwayTrail,pathwayActiveId)+R.renderTrail(pathwayPlan,pathwayTrail,pathwayContext())+(flowMode==='personality'?Y.renderMap(personalityState):'');
 const routeLedger='<section class="route-ledger" aria-label="함께 선택한 공부 경로">'+X.renderTrail(pathwayTrail,pathwayActiveId)+R.renderTrail(pathwayPlan,pathwayTrail,pathwayContext())+(flowMode==='personality'?Y.renderMap(personalityState):'')+'</section>';
 const effectiveStandardAxis=standardAxis||T.defaultAxis(answers,intakeFields());
 const standardTransition=T.choose(T.inheritCadence(null,null,answers,intakeFields(),standard.level,standard.sequential?'deep':'thinking'),null,answers,intakeFields(),'axis',effectiveStandardAxis),standardGraph=effectiveStandardAxis==='calc'?PlannerStandard.renderCalculationGraph(standard.calcPlan):T.renderGraph(standardTransition,null,answers,intakeFields(),{academyLines});
 const patternChoices=standardActive&&standard.independentDepth&&standard.lanes.find(row=>row.id==='thinking')?.status==='known'?'<div class="standard-patterns"><p>교과·사고력·심화·연산은 각각의 현재 진도에서 이어집니다.</p></div>':standardActive?'<div class="standard-patterns" aria-label="아직 정하지 않은 공부 구성 비교"><button type="button" data-standard-pattern="thinking" aria-pressed="'+(standard.pattern==='thinking')+'">교과·사고력 중심</button><button type="button" data-standard-pattern="deep" aria-pressed="'+(standard.pattern==='deep')+'">교과·심화 중심</button><p>공부 중인 사고력·심화·연산은 각각의 진도로 계속 이어집니다.</p></div>':'';
 $('journeyMap').innerHTML='<div class="workspace-results">'+(standardActive?PlannerStandard.renderSummary(standard):PlannerWorkspace.summary(transition,progression,answers,intakeFields(),pathwayTrail))+patternChoices+'<div class="workspace-tabs" role="tablist" aria-label="같은 계획 비교">'+tabs.map(([id,title])=>`<button type="button" role="tab" id="workspace-tab-${id}" data-workspace-view="${id}" aria-controls="workspace-panel-${id}" aria-selected="${workspaceView===id}" tabindex="${workspaceView===id?0:-1}">${title}</button>`).join('')+'</div>'+pane('map',standardActive&&!intakeFields().internationalCalendar?PlannerStandard.render(standard,{view:'map',summary:false}):(board+routeLedger+(completed?PlannerStandard.renderSupplementChoices(standard):'')))+pane('graph',(intakeFields().internationalCalendar?'<p class="course-empty">학년 체계가 다른 교육과정의 진도·상위 레벨은 국내 예시로 환산하지 않습니다. 선택 과목의 월별 계획과 공식 과목 안내를 함께 살펴봅니다.</p>':standardActive?standardGraph:transition?.axis==='calc'?PlannerStandard.renderCalculationGraph(standard.calcPlan):T.renderGraph(transition,progression,answers,intakeFields(),{academyLines}))||'<p class="course-empty">현재 학년과 공부 범위를 고르면 비교 그래프가 이어집니다.</p>')+pane('table',standardActive&&!intakeFields().internationalCalendar?PlannerStandard.render(standard,{view:'table',summary:false}):((schedule+(completed?PlannerStandard.renderSupplementChoices(standard):''))||'<p class="course-empty">교재와 이어갈 범위를 고르면 같은 계획의 기간·회차 표가 표시됩니다.</p>'))+pane('records',records)+'</div>'+'<div class="workspace-question-source">'+(flowMode==='reference'?RP.questions():standardActive?(PlannerStandard.renderQuestions?.(standard)||''):currentChoiceQuestions()+(completed?PlannerWorkspace.renderQuestions(transition,progression,answers,intakeFields(),pathwayTrail)+PlannerStandard.renderSupplementQuestions(standard):''))+X.renderQuestions(pathwayTrail,pathwayActiveId,pathwayContext())+(flowMode==='personality'?Y.renderQuestions(personalityState,pathwayTrail):'')+'</div>';

 if(completed&&!intakeFields().internationalCalendar){
  const currentGrade=I.gradeChoice(answers,intakeFields()),stage=currentGrade==='pre'?'preschool':Number(currentGrade)<=6?'elementary':'middle';
  if(window.PlannerCounsellingUpdates){$('workspace-panel-map').insertAdjacentHTML('afterbegin',window.PlannerCounsellingUpdates.render(stage,{compact:true}));$('workspace-panel-records').insertAdjacentHTML('beforeend',window.PlannerCounsellingUpdates.render(stage));}
  const academyComparison=G.comparison(answers,intakeFields());
  $('workspace-panel-table').insertAdjacentHTML('afterbegin',T.renderAcademyMonthly(T.academyReferences(academyComparison,'school',academyLines),academyComparison,intakeFields()));
  $('workspace-panel-table').insertAdjacentHTML('beforeend',preschoolDetailHtml());
  const standardLevels=G.renderStandardComparison(G.comparison(answers,intakeFields()),progression?.target);
  if(standardLevels){
   const tools=T.renderAcademyControls(G.comparison(answers,intakeFields()),academyLines,{jump:true});
   for(const view of ['map','table'])$('workspace-panel-'+view).insertAdjacentHTML('afterbegin','<section class="academy-reference-tools">'+tools+'<div class="academy-reference-details">'+standardLevels+'</div></section>');
   $('workspace-panel-graph').insertAdjacentHTML('beforeend','<div class="academy-reference-details">'+standardLevels+'</div>');
  }
 }
 if(!standard.ready&&!intakeFields().internationalCalendar)$('workspace-panel-map').insertAdjacentHTML('afterbegin',K.highStudy(answers,intakeFields()));
 if(completed){
  const results=$('journeyMap').querySelector('.workspace-results');
  results.insertAdjacentHTML('afterbegin',PlannerPlanNavigation.render({standard:standardActive&&flowMode!=='language',accepted:standardAccepted,flow:flowMode,page:transitionPage,state:T.restore(transition,progression,answers,intakeFields()),career:CR.navigation(careerState,careerPage)}));
  for(const node of $('workspace-panel-map').querySelectorAll('.standard-calendar,.month-plan')){const fold=document.createElement('details');fold.className='plan-map-months';const summary=document.createElement('summary');summary.textContent='월별 과정 펼쳐보기';node.before(fold);fold.append(summary,node);}
 }
 const selectedSummary=$('journeyMap').querySelector('.workspace-summary,.standard-summary');if(completed&&selectedSummary)$('planningOverview').querySelector('.plan-current-popover').append(selectedSummary);
 const careerContextValue=careerContext();
 PlannerStudentVisual.enhance($('journeyMap'),careerContextValue);
 if(flowMode==='career')for(const view of ['map','graph','table','records'])$('workspace-panel-'+view).insertAdjacentHTML(flowMode==='career'&&view!=='graph'?'afterbegin':'beforeend',CR.render(careerState,careerContextValue,view));
 if(flowMode==='career')$('journeyMap').querySelector('.workspace-question-source').insertAdjacentHTML(flowMode==='career'?'afterbegin':'beforeend',CR.questions(careerState,careerContextValue));
 const languageContextValue=languageContext(),languageIds=Object.keys(L.SUBJECTS).filter(id=>languageState.subjects[id].enabled);
 if(completed||flowMode==='language'){
  for(const view of ['map','graph','table','records']){
   const panel=$('workspace-panel-'+view);
   if(flowMode==='language'){
    const fold=document.createElement('details');fold.className='language-core-fold';
    const title=document.createElement('summary');title.textContent='수학 로드맵·'+(view==='graph'?'기존 진도 그래프':view==='table'?'교재·월별 과정':'현재 계획')+' 함께 보기';
    fold.append(title,...panel.childNodes);panel.append(fold);
   }
   const ids=flowMode==='language'?[languageState.active,...languageIds.filter(id=>id!==languageState.active)]:languageIds;
   const content=ids.map(id=>L.render(languageState,id,languageContextValue,view)).join('');
   panel.insertAdjacentHTML(flowMode==='language'?'afterbegin':'beforeend',content);
   if(view==='map'&&flowMode!=='language')panel.insertAdjacentHTML('beforeend',L.root());
  }
  const questions=$('journeyMap').querySelector('.workspace-question-source');
  if(flowMode==='language')questions.insertAdjacentHTML('afterbegin',L.renderQuestions(languageState,languageState.active,languageContextValue));
 }
 const kc=collegeContext();
 if(flowMode==='college')for(const view of ['map','graph','table','records'])$('workspace-panel-'+view).insertAdjacentHTML(flowMode==='college'&&view!=='graph'?'afterbegin':'beforeend',K.render(collegeState,kc,view));
 $('workspace-panel-records').insertAdjacentHTML('beforeend',BK.summary(bookChecks,bookDescriptors()));
 $('workspace-panel-map').insertAdjacentHTML('beforeend','<details class="book-check-access"><summary>현재 교재에서 공부한 부분 확인</summary>'+BK.summary(bookChecks,bookDescriptors())+'</details>');
 if(flowMode==='college')$('journeyMap').querySelector('.workspace-question-source').insertAdjacentHTML(flowMode==='college'?'afterbegin':'beforeend',K.questions(collegeState,kc));
 if(flowMode==='school-goal')for(const view of ['map','graph','table','records'])$('workspace-panel-'+view).insertAdjacentHTML(flowMode==='school-goal'&&view!=='graph'?'afterbegin':'beforeend',Q.render(scienceState.schoolGoal,goalContext(),view));
 if(flowMode==='school-goal')$('journeyMap').querySelector('.workspace-question-source').insertAdjacentHTML(flowMode==='school-goal'?'afterbegin':'beforeend',Q.renderQuestions(scienceState.schoolGoal,goalContext()));
 const sc=S.normalContext(standard,standardActive||!transition?.book||!transition?.range?null:T.timeline({...T.restore(transition,progression,answers,intakeFields()),axis:'school'},progression,answers,intakeFields()),intakeFields());
 for(const view of ['map','graph','table','records'])$('workspace-panel-'+view).insertAdjacentHTML(flowMode==='science'?'afterbegin':'beforeend',scienceState.enabled&&!intakeFields().internationalCalendar?S.render(scienceState,sc,view==='graph'?'graph':view==='map'?'map':'table'):view==='map'?scienceEntry():'');
 if(scienceState.enabled)$('journeyMap').querySelector('.workspace-question-source').insertAdjacentHTML(flowMode==='science'?'afterbegin':'beforeend',S.renderQuestions(scienceState,sc));
 if(flowMode==='language')for(const view of ['map','graph','table','records']){const panel=$('workspace-panel-'+view),fold=panel.querySelector('.language-core-fold');if(fold){for(const node of [...panel.children])if(node!==fold&&!node.matches('.language-plan'))fold.append(node);fold.querySelector('summary').textContent='수학·과학 기존 '+(view==='graph'?'그래프':view==='table'?'월별 계획':'로드맵')+' 함께 보기';}}

 for(const node of $('pathwayCoachContent').querySelectorAll('.reference-plan-context'))if(flowMode!=='reference')node.remove();
 const referenceMarkup=completed&&referencePlan.enabled?RP.breadcrumb(referencePlan,HC.CASES):'';
 if(referenceMarkup){if(flowMode!=='reference')$('pathwayCoachContent').insertAdjacentHTML('afterbegin',referenceMarkup);for(const view of ['map','graph','table','records'])$('workspace-panel-'+view).insertAdjacentHTML('afterbegin',referenceMarkup);}
 if(completed&&referencePlan.enabled){const context=referenceContext();for(const view of ['map','graph','table','records']){const panel=$('workspace-panel-'+view),trail=RP.renderTrail(referencePlan,HC.CASES,context,view),source=panel.querySelector('.reference-plan-context');if(source)source.insertAdjacentHTML('afterend',trail);}}

 if(flowMode==='language')for(const panel of $('journeyMap').querySelectorAll('[data-workspace-panel]')){const fold=panel.querySelector('.language-core-fold');if(fold)for(const node of [...panel.children])if(node.matches('.reference-plan-context,.reference-design-trail,.reference-design-fold'))fold.append(node);}
 if(standardActive){const graph=$('workspace-panel-graph');const title=graph.querySelector('h4');if(title)title.textContent=graph.querySelector('.level-comparison[aria-label*="아래"]')?'표준 진도와 아래 두 단계 비교':'표준 진도와 상위 두 단계 비교';for(const b of graph.querySelectorAll('[data-transition-open]')){delete b.dataset.transitionOpen;b.dataset.roadmapMode='custom';b.textContent='맞춤 계획에서 학습량 비교';}}
 // Preserve the original question/answer content and carousel, beside the current decision.
 const key=flowMode==='transition'?transitionPage:flowMode;
 const match={reference:/합격생|사례/,book:/교재/,range:/진도|범위/,deep:/심화/,deepScope:/심화/,cadence:/심화|기간|병행/,calc:/연산/,checkpoint:/확인|혼자/,tempo:/학습량|속도/,allocation:/추가 분량|학습량/,load:/주 몇 회|회차/}[key];
 const first=match&&[...$('journeyMap').querySelectorAll('.progress-faq,.pathway-parent-questions details')].find(n=>match.test(n.querySelector('summary')?.textContent||''));
 if(first){const priority=document.createElement('section');priority.className='pathway-parent-questions';first.before(priority);priority.append(first);$('journeyMap').prepend(priority);}
 if(flowMode==='career'){const careerQuestions=$('journeyMap').querySelector('.career-questions');if(careerQuestions)$('journeyMap').prepend(careerQuestions);}
 PlannerStudentVisual.enhance($('journeyMap'),careerContextValue);
 prepareWorkspaceGraph();
 PlannerFaq.mount($('journeyMap'),flowMode==='language'?{selector:'.language-questions'}:undefined);
 if(flowMode==='language'){const fold=$('workspace-panel-records').querySelector('.language-core-fold');if(fold)for(const node of [...$('journeyMap').querySelectorAll('.workspace-question-source > .pathway-parent-questions,.workspace-question-source > .progress-faq')])fold.append(node);}
 const faq=$('journeyMap').querySelector('.faq-orbit');if(faq&&completed){$('workspace-panel-records').prepend(faq);const question=faq.querySelector('.faq-question-text')?.textContent||'선택한 상황의 질문 살펴보기';$('coachQuestions').innerHTML='<button type="button" class="plan-question-shortcut" data-plan-questions><small>이 갈림길에서 궁금한 점</small><strong>'+esc(question)+'</strong><span aria-hidden="true">↗</span></button>';}else if(faq&&(!standardActive||['science','college'].includes(flowMode)))(flowMode?$('coachQuestions'):$('intakeQuestions')).append(faq);
 setWorkspaceView(workspaceView);
 $('journeyTitle').textContent=flowMode==='career'?'관심·공부·진로 탐색 로드맵':flowMode==='college'?'현재 공부에서 대학 진학까지':flowMode==='science'?'수학 계획과 연결한 과학 로드맵':flowMode==='language'?(languageState.active==='english'?(intakeFields().internationalCalendar?'영어 · 학교 과정과 병행 계획':'영어 · 학년별 로드맵'):'국어 · 현재 공부와 월별 로드맵'):standardActive?'현재 진도에서 이어지는 표준 계획':'우리 아이의 맞춤 로드맵';
 $('journeyCount').textContent=`현재 공부 ${journeyModel.ready}가지 확인${pathwayTrail.length?' · 공부 경로 '+pathwayTrail.length+'단계':''}${R.renderTrail(pathwayPlan,pathwayTrail,pathwayContext())?' · 교재·방법 선택':''}${progression?.goal?' · 레벨·보완 계획':''}`;
 $('backToQuestion').textContent=flowMode?'선택지로 돌아가기 ↑':'질문으로 돌아가기 ↑';
 $('journeyPanel').scrollTop=scrollTop;
 const planDetail=flowMode==='pathway-plan'?R.detail(pathwayPlan,pathwayTrail,pathwayActiveId,pathwayContext()):null;
 const last=flowMode==='language'?(L.model(languageState,languageState.active,languageContext()).title||L.model(languageState,languageState.active,languageContext()).route?.title||L.SUBJECTS[languageState.active]+' 공부 살펴보기'):flowMode==='career'?(CR.model(careerState,careerContext()).active?.title||'진로·관심 탐색'):flowMode==='college'?(K.model(collegeState,collegeContext()).country?.title||'대학 진학')+' · '+(K.model(collegeState).fields.map(x=>x.title).join('·')||'관심 계열 탐색'):flowMode==='school-goal'?(Q.model(scienceState.schoolGoal).detail?.title||'진학 목표 비교'):flowMode==='science'?'과학 공부 · 영재원 대비':flowMode==='transition'?(T.detail(transition,progression,answers,intakeFields()).range?.title||'교재·범위와 병행 계획'):flowMode==='progression'?(G.bridge(progression,answers,intakeFields()).pace?.title||'레벨 비교와 다음 단계'):planDetail?(planDetail.methodInfo?.title||planDetail.bookInfo?.title||planDetail.title):flowMode==='personality'?(Y.result(personalityState)?.label||'선택 성향검사'):pathwayTrail.length?X.paths[pathwayTrail.at(-1)].short:'고른 답이 지도에 이어져요';
 const live=PlannerWorkspace.model(standardActive?standardTransition:transition,standardActive?null:progression,answers,intakeFields(),pathwayTrail);if(standardActive)live.standard=standard;PlannerAnnotations.decorate($('journeyMap'),live);PlannerPresentation.decorate($('journeyMap'),live);PlannerGuide.mount(document);if(flowMode==='transition')PlannerAnnotations.decorateCoach($('pathwaySummary'),live,transitionPage);const peek=flowMode==='transition'&&live.book?[live.book,live.load,live.c?live.meeting:null].filter(Boolean).join(' · '):last;
 $('pathwayStatus').textContent=({durable:'이 기기에 저장되었습니다.',session:'현재 탭에 저장되었습니다.',memory:'현재 화면에만 유지됩니다. 저장 공간을 사용할 수 없습니다.'})[PlannerStorage.status()];
 $('flowMapPeek').innerHTML=`<small>지금까지의 계획</small><span>${esc(peek)}</span><button type="button" data-flow-map>계획 비교</button>`;
 applyAcademyLines();
}
$('journeyMap').addEventListener('toggle',e=>{if(e.target.matches?.('.ppd-reference'))preschoolDetailOpen=e.target.open;},true);
$('journeyMap').onclick=e=>{if(handlePreschoolDetail(e.target.closest('button'))||handleStudyButton(e.target.closest('button'))||handleHistoryClick(e)||handleCollegeClick(e)||handleScienceClick(e)||handleCaseClick(e))return;const b=e.target.closest('button');if(!b||!journeyModel)return;if(academyBeamClick(b))return;if(b.dataset.currentArea){ask(b.dataset.currentArea);return;}if(b.dataset.supplement){supplementDecision=PlannerStandard.chooseSupplement(answers,intakeFields(),b.dataset.supplement);rememberWorkspace();drawJourney();return;}if(b.dataset.calcDays){calcDaysPerWeek=+b.dataset.calcDays;rememberWorkspace();drawJourney();return;}if(b.dataset.standardBlock){const m=PlannerStandard.model(answers,intakeFields(),{pattern:standardPattern,calcDaysPerWeek,supplement:supplementDecision}),lane=m.lanes.find(l=>l.blocks.some(x=>x.id===b.dataset.standardBlock)),block=lane?.blocks.find(x=>x.id===b.dataset.standardBlock);if(block){PlannerFullscreen.leaveForAction(b);$('courseTitle').textContent=block.title;const from=T.calendarAt(m.now,block.start,intakeFields()),to=T.calendarAt(m.now,Math.max(block.start,block.end-.001),intakeFields());$('courseContent').innerHTML='<p class="course-context">표준 로드맵 · '+esc(lane.label)+'</p><p>'+esc(from.label)+' → '+esc(to.label)+'</p><p>'+(block.sustained?'꾸준히 병행할 시기 · 한 권의 이수 기간 아님':block.fullMonths?'전체 과정 기준 '+block.fullMonths+'개월'+(block.continues?' · 화면 마지막 달 이후에도 계속':block.remainingAssumption?' · 현재 과정은 절반이 남은 가정':''):block.studyDays?block.studyDays+'일분 · 주 '+m.calcPlan.daysPerWeek+'일 · 약 '+Number(block.weeks.toFixed(1))+'주':'참고 기간 '+(block.end-block.start).toFixed(1)+'개월')+'</p><p>'+esc(lane.id==='school'?'개념과 대표 유형을 익히고 응용 문제의 조건을 설명하는지 확인합니다.':lane.id==='deep'?'같은 학기의 교과 개념을 낯선 문제에 적용하고 풀이의 이유와 다른 방법을 비교합니다.':lane.method?lane.method:lane.id==='calc'?'현재 연산 진도에서 원리·정확성·오류 수정을 확인하며 순서대로 이어갑니다.':'스스로 조건을 정리하고 여러 풀이를 비교하는 시간을 유지합니다.')+'</p>'+(block.current?'<p>현재 진행 중이라는 답은 해당 과정의 절반을 남긴 것으로 가정한 참고 일정입니다. 실제 남은 범위는 맞춤 설계에서 다시 살펴봅니다.</p>':'');showCourseDialog();}return;}if(b.dataset.standardPattern){standardPattern=b.dataset.standardPattern;standardAccepted=false;saveRoadmapMode();drawJourney();return;}if(b.hasAttribute('data-standard-accept')){standardAccepted=true;saveRoadmapMode();drawJourney();return;}if(b.dataset.roadmapMode){PlannerFullscreen.leaveForAction(b);if(b.dataset.roadmapMode==='standard')showStandard();else enterCustom();return;}if(b.dataset.workspaceView){setWorkspaceView(b.dataset.workspaceView);return;}if(b.dataset.workspaceCourse){const y=scrollY,x=$('journeyMap').querySelector('.month-ribbon')?.scrollLeft||0;workspaceCourse=b.dataset.workspaceCourse;workspaceView='map';rememberWorkspace();drawJourney();requestAnimationFrame(()=>{$('journeyMap').querySelector('.month-ribbon')?.scrollTo({left:x,behavior:'auto'});window.scrollTo({top:y,behavior:'auto'});$('journeyMap').querySelector('.course-stop[data-workspace-course="'+workspaceCourse+'"]')?.focus({preventScroll:true});});return;}if(b.dataset.atlasFull){setWorkspaceView(b.dataset.atlasFull==='graph'?'graph':'map');return;}if(b.dataset.landscapePan){const scroller=b.closest('.learning-landscape').querySelector('.landscape-scroll');if(b.dataset.landscapePan==='start')scroller.scrollTo({left:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});else scroller.scrollBy({left:(b.dataset.landscapePan==='next'?1:-1)*scroller.clientWidth*.8,behavior:'smooth'});return;}PlannerFullscreen.leaveForAction(b);if(b.dataset.atlasJump){setWorkspaceView(({route:'map',compare:'graph',schedule:'table',current:'records',plan:'records',questions:'records'})[b.dataset.atlasJump]||'map');return;}if(flowClick(b))return;if(b.dataset.pathwayTo){choosePathway(b.dataset.pathwayFrom,b.dataset.pathwayTo);openPathway(pathwayTrail.at(-1));return;}const root=b.dataset.journeyDirection||b.dataset.pathwayRoot;if(root){choosePathway(null,root);openPathway(root);return;}if(b.dataset.pathwayOpen){openPathway(b.dataset.pathwayOpen);return;}const next=journeyModel.axes.find(a=>a.id===b.dataset.journeyNext);if(next?.next){openCourse({title:next.label+' · '+next.next,axis:next.id==='thinking'?'thinking1':next.id,sub:'현재 진도에서 이어서 공부할 수 있는 과정이에요.'});return;}const item=journeyModel.axes.find(a=>a.id===b.dataset.journeyCourse);if(item)openCourse(item.detail);};
$('journeyMap').addEventListener('keydown',e=>{
 const calendar=e.target.closest('.college-calendar');if(calendar&&e.target===calendar&&!e.ctrlKey&&!e.metaKey&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();if(e.key==='Home')calendar.scrollLeft=0;else if(e.key==='End')calendar.scrollLeft=calendar.scrollWidth;else calendar.scrollLeft+=(e.key==='ArrowRight'?1:-1)*100;return;}
 const tab=e.target.closest('[role="tab"][data-workspace-view]');if(!tab)return;
 const tabs=[...$('journeyMap').querySelectorAll('[role="tab"][data-workspace-view]')],index=tabs.indexOf(tab);let next;
 if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
 e.preventDefault();setWorkspaceView(tabs[next].dataset.workspaceView,true);
});
for(const host of [$('coachQuestions'),$('intakeQuestions'),$('coachReferences')])host.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.dataset.faq)flowClick(b);});
$('previewJump').onclick=()=>{mobileWorkspace('result');$('journeyTitle').focus({preventScroll:true});};
$('backToQuestion').onclick=()=>{mobileWorkspace('choice');(flowMode||caseActive?$('pathwayTitle'):$('questionTitle')).focus({preventScroll:true});if(innerWidth<=800)window.scrollTo({top:0,behavior:'auto'});};
document.querySelectorAll('[data-mobile-workspace]').forEach(b=>b.addEventListener('click',()=>{mobileWorkspace(b.dataset.mobileWorkspace);window.scrollTo({top:0,behavior:'auto'});}));

$('intakeLater').onclick=deferQuestion;
$('studentChoiceClose').onclick=()=>$('studentChoiceDialog').close();
$('studentChoiceContent').onclick=e=>{const b=e.target.closest('[data-student-gender]');if(!b)return;studentProfile=PlannerStudentVisual.profile({version:1,gender:b.dataset.studentGender});PlannerStorage.setItem(studentKey,JSON.stringify(studentProfile));$('studentChoiceDialog').close();if(studentNext==='intake'){studentNext=null;ask(I.firstMissing(answers,intakeFields())||'grade');}else{drawJourney();if(studentNext==='growth'){studentNext=null;$('studentGrowthContent').innerHTML=PlannerStudentVisual.growth(careerContext());$('studentGrowthDialog').showModal();}if($('studentGrowthDialog').open)$('studentGrowthContent').innerHTML=PlannerStudentVisual.growth(careerContext());}};
$('studentGrowthClose').onclick=()=>$('studentGrowthDialog').close();
$('studentGrowthContent').onclick=e=>{if(e.target.closest('[data-student-close]'))$('studentGrowthDialog').close();};
$('planReferencesClose').onclick=()=>$('planReferences').close();
$('planningOverview').onclick=e=>{if(e.target.closest('[data-student-choice]')){openStudentChoice();return;}if(e.target.closest('[data-plan-references]')){$('planReferences').showModal();return;}const area=e.target.closest('[data-current-area]');if(area){ask(area.dataset.currentArea);return;}if(e.target.closest('[data-roadmap-mode=standard]'))showStandard();};
$('seniorLibraryClose').onclick=()=>$('seniorLibraryDialog').close();
$('seniorLibraryDialog').addEventListener('close',()=>{if(window.PlannerDirectLinks?.resolve(window.location?.href)?.kind==='library')clearSeniorDirectUrl();});
$('seniorLibraryContent').onclick=e=>{if(window.PlannerDirectLinks?.handleCopy(e))return;const filter=e.target.closest('[data-history-filter]');if(filter){const id=filter.dataset.historyFilter;for(const group of $('seniorLibraryContent').querySelectorAll('[data-case-group]'))group.hidden=id!=='all'&&group.dataset.caseGroup!==id;for(const button of $('seniorLibraryContent').querySelectorAll('[data-history-filter]'))button.setAttribute('aria-pressed',String(button===filter));return;}if(e.target.closest('[data-study-open]')){$('seniorLibraryDialog').close();showStudy();return;}if(!e.target.closest('[data-history-case]'))return;$('seniorLibraryDialog').close();handleHistoryClick(e);};
$('openCase').onclick=openSeniorLibrary;
hwOptions(); applyLevel();if(!restoreDraft()){draw();if(Y.result(personalityState))openPersonality();else showWelcome();}
if(completed&&restoredRoadmapMode?.signature===JSON.stringify(answers)&&restoredRoadmapMode.mode==='custom')roadmapMode='custom';
if(!completed||roadmapMode==='custom'||['reference','science','college','language'].includes(restoredFlow?.mode)){
if(restoredFlow?.mode==='language')openLanguage(languageState.active,restoredFlow.page);else if(restoredFlow?.mode==='reference')openReferencePlan();else if(restoredFlow?.mode==='career')openCareer(restoredFlow.page);else if(restoredFlow?.mode==='college')openCollege(restoredFlow.page);else if(restoredFlow?.mode==='school-goal')openSchoolGoal();else if(restoredFlow?.mode==='science')openScience(true,scienceState.enabled,restoredFlow.page);else if(restoredFlow?.mode==='transition')openTransition(restoredFlow.page);else if(restoredFlow?.mode==='progression')openProgress(restoredFlow.page);else if(restoredFlow?.mode==='pathway-plan'&&pathwayTrail.length){pathwayActiveId=pathwayTrail.includes(restoredFlow.active)?restoredFlow.active:pathwayTrail.at(-1);openPathwayPlan(restoredFlow.page);}else if(['interests','interest-study'].includes(restoredFlow?.mode))openOverview('goals');else if(restoredFlow?.mode==='personality')openPersonality();else if(restoredFlow?.mode==='pathway'&&pathwayTrail.length)openPathway(pathwayTrail.includes(restoredFlow.active)?restoredFlow.active:pathwayTrail.at(-1));else if(restoredFlow?.mode==='overview')openOverview(['home','school','study','goals'].includes(restoredFlow.page)?restoredFlow.page:'home');
}
if(restoredWorkspaceView)setWorkspaceView(restoredWorkspaceView);
if(restoredMobilePane)mobileWorkspace(restoredMobilePane);PlannerGuide.mount(document);
const incomingSeniorDirectLink=window.location?.href;
if(studySaved?.version===1&&studySaved.active===true)showStudy(true);else if(historySaved?.active===true)showHistory(historySaved.caseId,true);else if(caseSaved?.version===1&&caseSaved.active===true)showCase(true);
applySeniorDirectLink(incomingSeniorDirectLink);
// Older sessions may have paths that were never edited after durable storage was added.
// Promote only absent durable keys; another saved plan and deletion guards stay intact.
for(const key of [preschoolDetailKey,cohortKey,languageKey,studentKey,storageKey,pathwayKey,personalityKey,careerKey,flowKey,planKey,progressKey,transitionKey,caseKey,historyKey,referencePlanKey,scienceKey,collegeKey,bookCheckKey,'gfield.demo2.roadmap-mode.v1','gfield.demo2.workspace.v1'])PlannerStorage.promoteExisting(key);
})();
