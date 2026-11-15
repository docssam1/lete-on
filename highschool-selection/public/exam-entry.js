(()=>{'use strict';
 const BASE='https://fgahqumaldheqettmvqg.supabase.co',ENDPOINT=BASE+'/functions/v1/highselect-exams',KEY='sb_publishable_OsjJG92BLMaZrc2jTClt0g_ecdTtf_I';
 const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let requestedExam=new URLSearchParams(location.search).get('exam');
 let assetKind='paper',readingPositions={},readingRestoring=false,mountedVersion='',reportAttemptId='';
 const savedMarks=new Map();let saving=false;
 let pageIndex=0,pagePositions={},pageGeneration=0,documentRequest=0,examRequest=0,reportExamId='',activePages=[],versionValid=true;
 let token=sessionStorage.getItem('highselectExamToken')||'',staff=sessionStorage.getItem('highselectExamStaff')||'',current=null,expires=0,refreshTimer=null;
 const errors={login_failed:'이름과 승인번호를 확인해 주세요.',try_later:'로그인 시도가 많습니다. 15분 후 다시 입장해 주세요.',login_required:'입장 시간이 지났습니다. 다시 로그인해 주세요.',exam_not_approved:'이 시험의 응시 승인이 필요합니다.',admin_required:'선생님 계정을 확인해 주세요.',storage_unavailable:'저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',exam_version_changed:'시험지가 변경되었습니다. 시험 목록에서 다시 열어 주세요.',response_invalid:'O/X 표시를 확인해 주세요.',self_check_required:'화면을 새로고침한 뒤 O/X로 표시해 주세요.'};
 const message=text=>{$('message').textContent=text||'';};
 function show(id,{record=true,replace=false}={}){if(document.body.dataset.view==='exam-view'&&id!=='exam-view')rememberReading();for(const v of ['login-view','library-view','exam-view','report-view','admin-view'])$(v).hidden=v!==id;document.body.dataset.view=id;$('logout').hidden=id==='login-view';message('');if(id!=='exam-view')clearTimeout(refreshTimer);window.scrollTo({top:0,behavior:'instant'});const heading=$(id).querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}if(record)recordRoute(id,replace);}
 async function api(action,{method='GET',body,query={},teacher=false}={}){
  const q=new URLSearchParams({action,...query}),headers={apikey:KEY};if(teacher?staff:token)headers.Authorization='Bearer '+(teacher?staff:token);if(body)headers['Content-Type']='application/json';
  const response=await fetch(ENDPOINT+'?'+q,{method,headers,body:body?JSON.stringify(body):undefined,cache:'no-store'});const data=await response.json();if(!response.ok)throw Object.assign(new Error(errors[data.error]||'연결하지 못했습니다. 잠시 후 다시 시도해 주세요.'),{code:data.error});return data;
 }
 function run(fn){return async event=>{event?.preventDefault();const button=event?.submitter||(event?.type==='click'?event.target.closest?.('button'):null);try{if(button){button.disabled=true;button.setAttribute('aria-busy','true');}message('');await fn(event);}catch(error){if(error.code==='login_required')logout(false);if(error.code==='exam_version_changed')versionChanged();message(error.message||'연결을 확인해 주세요.');if($('save-confirm').open)$('save-error').textContent=error.message;}finally{if(button){button.disabled=!versionValid&&['submit-responses','confirm-save'].includes(button.id);button.removeAttribute('aria-busy');}}};}
 function logout(server=true){if(server&&token)api('logout',{method:'POST'}).catch(()=>{});token='';staff='';sessionStorage.removeItem('highselectExamToken');sessionStorage.removeItem('highselectExamStaff');for(const key of Object.keys(sessionStorage))if(key.startsWith('highselectDraft:')||key.startsWith('highselectReading:'))sessionStorage.removeItem(key);requestedExam=current?.exam?.id||requestedExam;current=null;savedMarks.clear();mountedVersion='';documentRequest++;examRequest++;pageGeneration++;pagePositions={};$('paper-pages').replaceChildren();$('response-fields').replaceChildren();$('save-confirm').close();if(requestedExam){const url=new URL(location.href);url.searchParams.set('exam',requestedExam);history.replaceState(null,'',url.pathname+url.search);}show('login-view',{replace:true});renderEntrySelection();}
 $('logout').onclick=()=>logout();
 function tab(teacher){$('student-login').hidden=teacher;$('teacher-login').hidden=!teacher;$('student-tab').setAttribute('aria-pressed',String(!teacher));$('teacher-tab').setAttribute('aria-pressed',String(teacher));message('');}
 $('student-tab').onclick=()=>tab(false);$('teacher-tab').onclick=()=>tab(true);
 $('student-login').onsubmit=run(async()=>{const result=await api('login',{method:'POST',body:{name:$('student-name').value,code:$('student-code').value}});token=result.token;staff='';sessionStorage.setItem('highselectExamToken',token);sessionStorage.removeItem('highselectExamStaff');$('student-code').value='';await library();});
 function teacherIdentity(value){const id=value.trim();return id.includes('@')?id:id.toLowerCase()+'@auth.gfield.invalid';}
 $('teacher-login').onsubmit=run(async()=>{const response=await fetch(BASE+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email:teacherIdentity($('teacher-email').value),password:$('teacher-password').value})});const result=await response.json();if(!response.ok||!result.access_token)throw Error('아이디 또는 이메일과 비밀번호를 확인해 주세요.');staff=result.access_token;await api('admin-list',{teacher:true});token='';sessionStorage.setItem('highselectExamStaff',staff);sessionStorage.removeItem('highselectExamToken');$('teacher-password').value='';await admin();});
 async function library({record=true,preferRequested=true}={}){
  examRequest++;documentRequest++;const data=await api('exams');const wanted=preferRequested?requestedExam:null;requestedExam=null;
  show('library-view',{record,replace:document.body.dataset.view==='login-view'});document.title='내 모의고사 | LETE-ON';$('welcome').textContent=data.name+' · 내 모의고사';
  $('exam-list').innerHTML=data.exams.length?data.exams.map(e=>`<button class="exam-link" data-exam="${esc(e.id)}"><span><span class="mode">${e.mode==='pilot'?'시범 응시':'모의고사'}</span><strong>${esc(e.title)}</strong><small>${e.questionCount}문항${e.durationMinutes?' · '+timeLabel(e):''}</small></span><span aria-hidden="true">→</span></button>`).join(''):'<p>아직 배정된 시험이 없습니다. 담당 선생님께 응시 승인을 요청해 주세요.</p>';
  await pastResults();if(wanted){if(data.exams.some(e=>e.id===wanted))await openExam(wanted,{record});else message('선택한 시험의 응시 승인이 필요합니다. 배정된 시험을 선택해 주세요.');}
 }
 $('exam-list').onclick=run(async e=>{const b=e.target.closest('[data-exam]');if(b)await openExam(b.dataset.exam);});
 async function pastResults(){const data=await api('attempts');$('past-results').innerHTML=data.attempts.map(a=>`<button class="exam-link" data-result="${esc(a.id)}"><span><strong>${esc(a.report.exam.title)}</strong><small>${a.report.gradingMethod==='self-reported'?'자가채점 O':'정답'} ${a.report.correctCount}/${a.report.total}${a.report.reviewCount?' · 풀이 확인 필요 '+a.report.reviewCount:''}</small></span><span>결과 보기</span></button>`).join('')||'<p>아직 응시 결과가 없습니다.</p>';}
 $('past-results').onclick=run(async event=>{const b=event.target.closest('[data-result]');if(b){const data=await api('attempt',{query:{id:b.dataset.result}});displayReport(data.report,data.id||b.dataset.result);}});
 const assetLabels={paper:'시험지',answers:'정답·풀이',analysis:'학습분석지'};
 const assetAction=kind=>kind==='paper'?'manifest':kind;
 function timeLabel(e){return e.sectionMinutes?`대수 ${e.sectionMinutes.ALG}분 · 기하 ${e.sectionMinutes.GEO}분${e.breakMinutes?' · 휴식 '+e.breakMinutes+'분 별도':''}`:(e.durationMinutes?e.durationMinutes+'분':'');}
 const draftKey=()=>`highselectDraft:${token.slice(0,16)}:${current.exam.id}:${current.exam.version}`;
 const readingKey=()=>`highselectReading:${token.slice(0,16)}:${current.exam.id}:${current.exam.version}`;
 function rememberReading(){
  if(!current||readingRestoring||mountedVersion!==current.exam.id+':'+current.exam.version||document.body.dataset.view!=='exam-view')return;
  const viewport=$('paper-viewport');if(viewport.getClientRects().length)readingPositions[assetKind]={page:pageIndex,zoom:$('page-zoom').value,top:viewport.scrollTop,left:viewport.scrollLeft};
  try{sessionStorage.setItem(readingKey(),JSON.stringify({kind:assetKind,positions:readingPositions}));}catch{}
 }
 function loadReading(){
  try{const v=JSON.parse(sessionStorage.getItem(readingKey())||'null');if(!v||!v.positions)return null;const positions={};for(const kind of ['paper','answers','analysis']){const p=v.positions[kind];if(p&&Number.isInteger(p.page)&&p.page>=0&&['100','150','200','300'].includes(p.zoom)&&Number.isFinite(p.top)&&p.top>=0&&Number.isFinite(p.left)&&p.left>=0)positions[kind]={page:p.page,zoom:p.zoom,top:p.top,left:p.left};}return {kind:['paper','answers','analysis'].includes(v.kind)?v.kind:'paper',positions};}catch{return null;}
 }
 function restoreReadingPosition(){const p=readingPositions[assetKind],v=$('paper-viewport');if(!p||!v.getClientRects().length)return;v.scrollTop=p.top;v.scrollLeft=p.left;updatePan();}
 function recordRoute(id,replace=false){
  const state={highselectView:id,...(id==='exam-view'?{examId:current.exam.id}:{}),...(id==='report-view'?{attemptId:reportAttemptId}:{})};
  const hash=id==='exam-view'?'#exam='+encodeURIComponent(current.exam.id):id==='library-view'?'#library':id==='report-view'?'#result':id==='admin-view'?'#teacher':'';
  const previous=history.state;
  if(replace||!previous||previous.highselectView===id&&previous.examId===state.examId&&previous.attemptId===state.attemptId)history.replaceState(state,'',location.pathname+location.search+hash);else history.pushState(state,'',location.pathname+location.search+hash);
 }
 function renderEntrySelection(){
  const e=(globalThis.HIGHSELECT_AVAILABLE_MOCKS||[]).find(x=>x.id===requestedExam);$('entry-selection').hidden=!e;if(!e)return;
  $('entry-exam-title').textContent=e.title;$('entry-exam-spec').textContent=e.scope+' · '+e.questionCount+'문항 · '+timeLabel(e);
  const selection=globalThis.HIGHSELECT_PROMO_NAV?.selectionForExam(e.id);$('entry-course-back').href='./promo/'+(selection?'#academy='+encodeURIComponent(selection.program)+'&course='+encodeURIComponent(selection.course):'');
 }
 function displayReport(report,id,{saved=false,record=true}={}){reportAttemptId=id||'';renderReport(report);$('saved-result-status').hidden=!saved;$('saved-result-status').textContent=saved?'O/X 결과를 저장했습니다. 내 시험 목록의 응시 결과에서 다시 볼 수 있습니다.':'';show('report-view',{record});document.title='학습 결과 | LETE-ON';}
 async function restoreRoute(state){
  $('save-confirm').close();examRequest++;documentRequest++;
  if(!token&&!staff){show('login-view',{record:false});renderEntrySelection();return;}
  if(state?.highselectView==='exam-view'&&state.examId&&token){await openExam(state.examId,{record:false});return;}
  if(state?.highselectView==='report-view'&&state.attemptId&&token){const data=await api('attempt',{query:{id:state.attemptId}});displayReport(data.report,data.id||state.attemptId,{record:false});return;}
  if(staff){await admin();return;}await library({record:false,preferRequested:false});
 }
 window.addEventListener('popstate',event=>run(()=>restoreRoute(event.state))());

 function responses(){return current.questions.map(q=>document.querySelector(`input[name="ox-${q.number}"]:checked`)?.value||'');}
 function specLabel(e){const count={paper:e.pageCount,answers:e.answerPageCount,analysis:e.analysisPageCount}[assetKind];return `${e.questionCount}문항${e.durationMinutes?' · '+timeLabel(e):''} · ${assetLabels[assetKind]} ${count}쪽`;}
 function showPage(index,{scroll=true,focusReader=false}={}){
  if(!activePages.length)return;
  pageIndex=Math.max(0,Math.min(activePages.length-1,index));pagePositions[assetKind]=pageIndex;
  [...$('paper-pages').children].forEach((p,i)=>p.classList.toggle('is-current',i===pageIndex));
  $('page-select').value=String(pageIndex);$('page-position').textContent=`${pageIndex+1} / ${activePages.length}쪽`;
  $('previous-page').disabled=pageIndex===0;$('next-page').disabled=pageIndex===activePages.length-1;
  if(scroll)$('paper-viewport').scrollTo({top:0,left:0,behavior:'instant'});
  updatePan();rememberReading();
  if(focusReader&&matchMedia('(max-width:800px)').matches)focusReadingArea();
 }
 function updatePan(){
  const viewport=$('paper-viewport'),zoom=Number($('page-zoom').value),max=viewport.scrollWidth-viewport.clientWidth;
  $('reader-pan').hidden=zoom<=100;$('pan-center').hidden=zoom<300;
  const ratio=max>0?viewport.scrollLeft/max:0;
  for(const [id,position] of [['pan-left',0],['pan-center',.5],['pan-right',1]])$(id).setAttribute('aria-pressed',String(Math.abs(ratio-position)<.025));
 }
 function setZoom(value){
  const viewport=$('paper-viewport'),max=viewport.scrollWidth-viewport.clientWidth,ratio=max>0?viewport.scrollLeft/max:0;
  $('page-zoom').value=value;viewport.dataset.zoom=value;
  viewport.scrollLeft=ratio*Math.max(0,viewport.scrollWidth-viewport.clientWidth);updatePan();fitViewport();rememberReading();
 }
 function panTo(ratio){const viewport=$('paper-viewport');viewport.scrollTo({left:ratio*Math.max(0,viewport.scrollWidth-viewport.clientWidth),top:viewport.scrollTop,behavior:'instant'});updatePan();rememberReading();}
 function focusReadingArea(){
  const workspace=document.querySelector('.exam-workspace'),viewport=$('paper-viewport');
  const offset=viewport.getBoundingClientRect().top-workspace.getBoundingClientRect().top;
  viewport.style.height=Math.max(160,innerHeight-68-offset-144)+'px';
  workspace.scrollIntoView({block:'start',behavior:'instant'});fitViewport();
 }
 function mountPages(data,{preserveScroll=false}={}){
  readingRestoring=true;mountedVersion=current.exam.id+':'+current.exam.version;const reading=readingPositions[assetKind];if(reading&&!preserveScroll)$('page-zoom').value=reading.zoom;
  const generation=++pageGeneration,viewport=$('paper-viewport'),top=viewport.scrollTop,left=viewport.scrollLeft;
  viewport.dataset.zoom=$('page-zoom').value;const pages=$('paper-pages');activePages=data.pages;$('print-paper').disabled=true;$('retry-pages').hidden=true;
  let loaded=0,failed=0;pages.replaceChildren();
  const status=()=>{if(generation!==pageGeneration)return;$('paper-status').textContent=failed?'불러오지 못한 쪽이 있습니다.':loaded===activePages.length?'':`페이지 불러오는 중 ${loaded} / ${activePages.length}`;$('retry-pages').hidden=!failed;$('print-paper').disabled=failed>0||loaded!==activePages.length;};
  for(const [i,p] of data.pages.entries()){
   const section=document.createElement('section');section.className='exam-page';
   const img=document.createElement('img');img.alt=`${assetLabels[assetKind]} ${p.number}쪽`;
   img.onload=()=>{loaded++;status();};img.onerror=()=>{failed++;status();};img.src=p.url;
   section.append(img);pages.append(section);
  }
  status();expires=Date.parse(data.expiresAt);$('print-paper').textContent=assetLabels[assetKind]+' 전체 인쇄';
  $('view-answers').hidden=!current.exam.answerPageCount;$('view-analysis').hidden=!current.exam.analysisPageCount;
  for(const kind of ['paper','answers','analysis'])$('view-'+kind).setAttribute('aria-pressed',String(assetKind===kind));
  pages.setAttribute('aria-label',assetLabels[assetKind]);viewport.setAttribute('aria-label',assetLabels[assetKind]+' 페이지, 확대 시 가로로 이동할 수 있습니다');
  $('page-select').innerHTML=data.pages.map((p,i)=>`<option value="${i}">${p.number}쪽</option>`).join('');
  $('exam-spec').textContent=specLabel(current.exam);showPage(reading?.page??pagePositions[assetKind]??0,{scroll:!preserveScroll});
  if(preserveScroll){viewport.scrollTop=top;viewport.scrollLeft=left;}else restoreReadingPosition();updatePan();readingRestoring=false;
 }
 function scheduleRenew(){clearTimeout(refreshTimer);refreshTimer=setTimeout(renewPages,8*60000);}
 function versionChanged(){versionValid=false;message('시험지가 변경되었습니다. 내 시험 목록에서 다시 열어 주세요.');$('submit-responses').disabled=true;$('confirm-save').disabled=true;}
 async function renewPages(){
  if(!current||$('exam-view').hidden)return;
  const kind=assetKind,id=current.exam.id,request=documentRequest;
  try{const renewed=await api(assetAction(kind),{query:{exam:id}});if(!current||current.exam.id!==id||assetKind!==kind||request!==documentRequest||$('exam-view').hidden)return;if(renewed.exam.version!==current.exam.version){versionChanged();return;}mountPages(renewed,{preserveScroll:true});scheduleRenew();}catch(error){if(error.code==='login_required'){logout(false);message(error.message);return;}message(error.message);$('retry-pages').hidden=false;}
 }
 function setPane(pane,{focus=false}={}){
  rememberReading();
  document.querySelector('.exam-workspace').dataset.mobilePane=pane;
  $('mobile-paper').setAttribute('aria-pressed',String(pane==='paper'));$('mobile-answers').setAttribute('aria-pressed',String(pane==='answers'));
  if(focus){const target=pane==='answers'?$('response-title'):$('paper-viewport');target.focus({preventScroll:true});if(pane==='paper'&&matchMedia('(max-width:800px)').matches)focusReadingArea();else document.querySelector('.exam-workspace').scrollIntoView({block:'start',behavior:'instant'});}
  fitViewport();
  if(pane==='paper')restoreReadingPosition();updatePan();
 }
 function fitViewport(){
  const viewport=$('paper-viewport'),panel=document.querySelector('.response-panel'),mobile=matchMedia('(max-width:800px)').matches;
  if(viewport.getClientRects().length)viewport.style.height=Math.max(mobile?160:320,innerHeight-Math.max(mobile?72:16,viewport.getBoundingClientRect().top)-(mobile?144:80))+'px';
  if(panel.getClientRects().length)panel.style.height=Math.max(360,innerHeight-Math.max(mobile?68:16,panel.getBoundingClientRect().top)-(mobile?96:24))+'px';
 }
 window.addEventListener('resize',()=>{fitViewport();updatePan();});
 document.fonts?.ready.then(fitViewport);
 function updateCheck(){
  const marks=responses(),marked=marks.filter(Boolean).length,missing=marks.length-marked;
  $('check-count').textContent=`표시 ${marked} / ${marks.length} · 미확인 ${missing}`;$('mobile-count').textContent=`${marked}/${marks.length}`;
  $('first-unmarked').disabled=missing===0;
  for(const q of current.questions){const row=$('response-fields').querySelector(`[data-number="${q.number}"]`);row.querySelector('[data-clear]').disabled=!row.querySelector('input:checked');}
 }
 async function loadSavedMarks(data,request){
  const e=data.exam,key=`highselectDraft:${token.slice(0,16)}:${e.id}:${e.version}`;
  try{if(sessionStorage.getItem(key)!==null||savedMarks.has(key))return false;}catch{}
  try{
   const history=await api('attempts');if(request!==examRequest)return false;
   const latest=history.attempts.find(a=>a.report?.exam?.id===e.id&&a.report.exam.version===e.version&&a.report.gradingMethod==='self-reported');
   const rows=latest?.report?.items;
   if(Array.isArray(rows)&&rows.length===e.questionCount&&rows.every((row,i)=>row.number===i+1&&['correct','wrong','blank'].includes(row.state)))savedMarks.set(key,rows.map(row=>row.state==='correct'?'O':row.state==='wrong'?'X':''));
   return false;
  }catch(error){if(error.code==='login_required')throw error;return true;}
 }
 async function openExam(id,{record=true}={}){
  rememberReading();const request=++examRequest;const data=await api('manifest',{query:{exam:id}});if(request!==examRequest)return;
  const savedLoadFailed=await loadSavedMarks(data,request);if(request!==examRequest)return;
  current=data;assetKind='paper';pagePositions={};readingPositions={};const reading=loadReading();readingPositions=reading?.positions||{};mountedVersion='';versionValid=true;documentRequest++;show('exam-view',{record});const e=current.exam;
  $('exam-title').textContent=e.title;document.title=e.title+' | LETE-ON';setPane('paper');
  $('exam-mode').textContent=e.mode==='pilot'?'시범 모의고사 · O/X 자가채점':'모의고사 · O/X 자가채점';$('pilot-note').hidden=e.mode!=='pilot';
  setZoom(matchMedia('(max-width:800px)').matches?'200':'100');mountPages(current);
  $('response-fields').innerHTML=current.questions.map(q=>`<fieldset class="ox-row" data-number="${q.number}"><legend>${q.number}번</legend><label><input type="radio" name="ox-${q.number}" value="O" aria-label="${q.number}번 O"><span>O</span></label><label><input type="radio" name="ox-${q.number}" value="X" aria-label="${q.number}번 X"><span>X</span></label><button type="button" class="ox-clear" data-clear="${q.number}" aria-label="${q.number}번 표시 지우기">지우기</button></fieldset>`).join('');
  let restored=false,restoredSaved=false;try{restoredSaved=!sessionStorage.getItem(draftKey())&&savedMarks.has(draftKey());const draft=JSON.parse(sessionStorage.getItem(draftKey())||'null')||savedMarks.get(draftKey());if(Array.isArray(draft)&&draft.length===e.questionCount)current.questions.forEach((q,i)=>{if(['O','X'].includes(draft[i])){document.querySelector(`input[name="ox-${q.number}"][value="${draft[i]}"]`).checked=true;restored=true;}});}catch{}
  $('draft-status').textContent=savedLoadFailed?'저장한 O/X를 불러오지 못했습니다. 결과 목록에서 다시 확인해 주세요.':restoredSaved?'저장한 O/X 결과입니다. 표시를 바꾸면 다시 저장해 주세요.':restored?'이 탭의 임시 표시를 불러왔습니다.':'표시한 내용은 이 탭에 임시 저장됩니다.';
  $('submit-responses').disabled=false;$('confirm-save').disabled=false;updateCheck();fitViewport();
  if(matchMedia('(max-width:800px)').matches&&innerHeight-$('paper-viewport').getBoundingClientRect().top-144<200)focusReadingArea();
  scheduleRenew();if(reading&&reading.kind!=='paper'&&current.exam[{answers:'answerPageCount',analysis:'analysisPageCount'}[reading.kind]])await showDocument(reading.kind,{capture:false});
 }
 function saveDraft(){updateCheck();try{sessionStorage.setItem(draftKey(),JSON.stringify(responses()));$('draft-status').textContent='이 탭에 임시 저장됨 · 결과 저장 전';}catch{$('draft-status').textContent='임시 저장을 사용할 수 없습니다. 결과 저장을 눌러 주세요.';}}
 $('response-fields').onchange=saveDraft;
 $('response-fields').onclick=event=>{const b=event.target.closest('[data-clear]');if(b){document.querySelectorAll(`input[name="ox-${b.dataset.clear}"]`).forEach(i=>i.checked=false);saveDraft();}};
 $('first-unmarked').onclick=()=>{const row=[...$('response-fields').children].find(row=>!row.querySelector('input:checked'));if(row){row.scrollIntoView({block:'center',behavior:'instant'});row.querySelector('input').focus({preventScroll:true});}};
 async function showDocument(kind,{capture=true}={}){
  if(!current)return;if(capture)rememberReading();const request=++documentRequest,id=current.exam.id;
  const data=await api(assetAction(kind),{query:{exam:id}});
  if(request!==documentRequest||!current||current.exam.id!==id||$('exam-view').hidden)return;
  if(data.exam.version!==current.exam.version){versionChanged();return;}
  assetKind=kind;mountPages(data);setPane('paper',{focus:matchMedia('(max-width:800px)').matches});scheduleRenew();
 }
 for(const kind of ['paper','answers','analysis'])$('view-'+kind).onclick=run(()=>showDocument(kind));
 $('retry-pages').onclick=run(()=>showDocument(assetKind));
 $('previous-page').onclick=()=>showPage(pageIndex-1,{focusReader:true});$('next-page').onclick=()=>showPage(pageIndex+1,{focusReader:true});
 $('page-select').onchange=()=>showPage(Number($('page-select').value),{focusReader:true});
 $('page-zoom').onchange=()=>setZoom($('page-zoom').value);
 $('pan-left').onclick=()=>panTo(0);$('pan-center').onclick=()=>panTo(.5);$('pan-right').onclick=()=>panTo(1);
 $('paper-viewport').addEventListener('scroll',()=>{updatePan();rememberReading();},{passive:true});
 window.addEventListener('pagehide',rememberReading);
 async function submitResponses(){
  if(saving)return;saving=true;const marks=responses(),savedKey=draftKey(),session=token,id=current.exam.id,version=current.exam.version,request=examRequest;
  const fields=[...$('response-fields').children];fields.forEach(f=>f.disabled=true);$('draft-status').textContent='O/X 결과 저장 중…';
  try{
   const result=await api('submit',{method:'POST',query:{exam:id},body:{version,method:'self-check',responses:marks}});
   if(token!==session)return;savedMarks.set(savedKey,marks);sessionStorage.removeItem(savedKey);
   if(request===examRequest&&current?.exam.id===id&&!$('exam-view').hidden){$('save-confirm').close();displayReport(result.report,result.id,{saved:true});}
   else if(!$('library-view').hidden)await pastResults();
  }catch(error){if(token===session&&current?.exam.id===id)$('draft-status').textContent='결과를 저장하지 못했습니다. O/X 표시는 유지됩니다.';throw error;}
  finally{saving=false;fields.forEach(f=>f.disabled=false);}
 }
 $('response-form').onsubmit=run(async()=>{
  const marks=responses(),missing=marks.filter(v=>!v).length;
  if(missing){$('save-confirm-detail').textContent=`전체 ${marks.length}문항 중 ${missing}문항은 미확인으로 남습니다. 나중에 결과에서 구분해 볼 수 있습니다.`;$('save-error').textContent='';$('save-confirm').showModal();return;}
  await submitResponses();
 });
 $('confirm-save').onclick=run(submitResponses);$('cancel-save').onclick=()=>{$('save-confirm').close();$('submit-responses').focus();};
 $('save-confirm').addEventListener('close',()=>{if(!$('exam-view').hidden&&!$('submit-responses').disabled)$('submit-responses').focus();});
 function commentSection(report,context='student'){
  if(report.gradingMethod!=='self-reported')return '';
  const c=globalThis.HIGHSELECT_SELF_CHECK_COMMENTS?.build(report);
  if(!c)return '<section class="learning-comments"><h2>학습 코멘트</h2><p>결과 기록을 확인한 뒤 코멘트를 다시 불러와 주세요.</p></section>';
  const actions=context==='student'?`<div class="comment-actions">${c.evidence.wrong?'<button type="button" data-comment-filter="wrong">X 문항 보기</button>':c.evidence.blank?'<button type="button" data-comment-filter="blank">미확인 문항 보기</button>':''}${report.exam.answerPageCount?'<button type="button" data-comment-answers>정답·풀이 보기</button>':''}</div>`:'';
  return `<section class="learning-comments" aria-labelledby="${context}-comments-title"><div class="comment-heading"><h2 id="${context}-comments-title">학습 코멘트</h2><span>${esc(c.source)}</span></div><p class="comment-summary">${esc(c.summary)}</p>${c.coverage?`<p class="help">${esc(c.coverage)}</p>`:''}${c.priorities.length?`<h3>먼저 다시 풀 유형</h3><ol class="comment-priorities">${c.priorities.map(p=>`<li><b>${esc(p.label)}</b><p>${esc(p.text)}</p><p>${esc(p.action)}</p></li>`).join('')}</ol>`:''}<p>${esc(c.next)}</p>${c.confirmed?`<p class="help">${esc(c.confirmed)}</p>`:''}${actions}<div class="parent-comment"><h3>학부모 확인용</h3><p data-parent-comment>${esc(c.parent)}</p><button type="button" data-copy-comment>코멘트 복사</button><p class="comment-copy-status" role="status" aria-live="polite"></p></div></section>`;
 }
 async function commentAction(event){
  const button=event.target.closest('[data-copy-comment],[data-comment-filter],[data-comment-answers]');if(!button)return false;
  if(button.hasAttribute('data-copy-comment')){
   const box=button.closest('.parent-comment'),text=box.querySelector('[data-parent-comment]'),status=box.querySelector('.comment-copy-status');
   try{await navigator.clipboard.writeText(text.textContent);status.textContent='코멘트를 복사했습니다.';}catch{const range=document.createRange();range.selectNodeContents(text);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='문장을 선택했습니다. 복사해서 사용해 주세요.';}
  }else if(button.hasAttribute('data-comment-answers')){$('report-reopen').click();}
  else{const filter=$('report-content').querySelector(`.result-filters [data-result-filter="${button.dataset.commentFilter}"]`);filter?.click();const title=$('item-results-title');title.tabIndex=-1;title.focus();title.scrollIntoView({block:'start',behavior:'instant'});}
  return true;
 }
 function renderReport(r){
  r=globalThis.HIGHSELECT_SELF_CHECK_COMMENTS?.prepare(r)||r;
  reportExamId=r.exam.id;const self=r.gradingMethod==='self-reported',status={correct:self?'O':'정답',wrong:self?'X':'오답',blank:self?'미확인':'미응시',review:'풀이 확인 필요'};
  $('report-reopen').hidden=!r.exam.answerPageCount;
  $('report-content').innerHTML=`<section class="score-summary"><p>${esc(r.exam.title)}${r.exam.mode==='pilot'?' · 시범 응시':''}</p><div class="score-counts"><div><span>${self?'O':'정답'}</span><strong>${r.correctCount}<small> / ${r.total}</small></strong></div><div><span>${self?'X':'오답'}</span><strong>${r.wrongCount}</strong></div><div><span>${self?'미확인':'미응시'}</span><strong>${r.blankCount}</strong></div></div>${r.reviewCount?`<p>풀이 확인 필요 ${r.reviewCount}문항</p>`:''}<p class="help">${self?'직접 표시한 O/X 결과입니다.':'기존 자동채점 결과입니다.'}</p></section>${commentSection(r)}<section class="domain-summary"><h2>${self?'영역별 O 개수':'영역별 정답 수'}</h2><ul>${r.domains.map(d=>`<li><span>${esc(d.label)}</span><b>${d.correct} / ${d.total}</b></li>`).join('')}</ul></section><section aria-labelledby="item-results-title"><h2 id="item-results-title">문항별 결과</h2><div class="result-filters" role="group" aria-label="볼 문항"><button data-result-filter="all" aria-pressed="true">전체</button><button data-result-filter="wrong" aria-pressed="false">${self?'X 문항':'오답'}</button><button data-result-filter="blank" aria-pressed="false">${self?'미확인':'미응시'}</button></div><ol class="result-items">${r.items.map(i=>`<li data-state="${esc(i.state)}"><b>${i.number}번</b><span class="result-state state-${esc(i.state)}">${esc(status[i.state]||'확인 필요')}</span><div><span>${esc(i.majorUnit)}</span><p>${esc(i.detailType)}</p></div></li>`).join('')}</ol><p id="result-empty" hidden>해당하는 문항이 없습니다.</p></section>`;
 }
 $('report-content').onclick=async event=>{if(await commentAction(event))return;const button=event.target.closest('[data-result-filter]');if(!button)return;const filter=button.dataset.resultFilter;for(const b of $('report-content').querySelectorAll('[data-result-filter]'))b.setAttribute('aria-pressed',String(b===button));let count=0;for(const row of $('report-content').querySelectorAll('.result-items li')){row.hidden=filter!=='all'&&row.dataset.state!==filter;if(!row.hidden)count++;}$('result-empty').hidden=count>0;};
 $('report-reopen').onclick=run(async()=>{await openExam(reportExamId);await showDocument('answers');});
 $('mobile-answers').onclick=()=>setPane('answers',{focus:true});$('mobile-paper').onclick=()=>setPane('paper',{focus:true});
 $('print-paper').onclick=()=>{if(!$('print-paper').disabled)window.print();};$('back-library').onclick=run(()=>library({preferRequested:false}));$('report-library').onclick=run(()=>library({preferRequested:false}));
 async function admin(){const result=await api('admin-list',{teacher:true});show('admin-view');const names=Object.fromEntries(result.exams.map(e=>[e.id,e.title]));$('grant-exams').innerHTML=result.exams.map(e=>`<label class="check-label"><input type="checkbox" name="grant-exam" value="${esc(e.id)}" checked><span>${esc(e.title)}${e.mode==='pilot'?' · 시범':''}</span></label>`).join('');if(!$('grant-until').value)$('grant-until').value=new Date(Date.now()+30*86400000).toISOString().slice(0,10);$('student-grants').innerHTML=result.students.map(s=>`<div class="grant-row"><div><b>${esc(s.name)}${s.active?'':' · 중지'}</b><p>${s.exam_grants.map(id=>esc(names[id]||'모의고사')).join(' / ')}</p><p>${new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul'}).format(new Date(s.expires_at))}까지</p></div>${s.active?`<button data-disable="${esc(s.id)}">이용 중지</button>`:''}</div>`).join('')||'<p>아직 승인한 학생이 없습니다.</p>';await teacherAttempts();}
 $('grant-form').onsubmit=run(async()=>{const exams=[...document.querySelectorAll('[name="grant-exam"]:checked')].map(i=>i.value);if(!exams.length)throw Error('응시할 시험을 선택해 주세요.');const result=await api('admin-grant',{teacher:true,method:'POST',body:{name:$('grant-name').value,exams,expiresAt:$('grant-until').value+'T23:59:59+09:00'}});$('issued-code').textContent=`${result.student.name} 승인번호: ${result.approvalCode} — 학생에게 전달해 주세요. 번호는 이 화면에서 한 번만 표시합니다.`;await admin();});
 $('student-grants').onclick=run(async event=>{const b=event.target.closest('[data-disable]');if(b){await api('admin-disable',{teacher:true,method:'POST',body:{id:b.dataset.disable}});await admin();}});
 async function teacherAttempts(){const data=await api('admin-attempts',{teacher:true});$('teacher-attempts').innerHTML=data.attempts.map(a=>`<button class="exam-link" data-attempt="${esc(a.id)}"><span><strong>${esc(a.student?.name||'학생')} · ${esc(a.report.exam.title)}</strong><small>${a.report.gradingMethod==='self-reported'?'자가채점 O':'정답'} ${a.report.correctCount}/${a.report.total} · 확인 필요 ${a.report.reviewCount}</small></span><span>결과 보기</span></button>`).join('')||'<p>아직 제출된 답안이 없습니다.</p>';}
 async function teacherReview(id){const a=await api('admin-attempt',{teacher:true,query:{id}});a.report=globalThis.HIGHSELECT_SELF_CHECK_COMMENTS?.prepare(a.report)||a.report;const self=a.report.gradingMethod==='self-reported';$('teacher-review').innerHTML=`<h2>${esc(a.student?.name||'학생')} · 답안 확인</h2><p>${a.report.gradingMethod==='self-reported'?'자가채점 O':'정답'} ${a.report.correctCount}/${a.report.total} · 확인 필요 ${a.report.reviewCount}</p>${commentSection(a.report,'teacher')}<div class="report-table-wrap"><table><thead><tr><th>번호</th><th>표시한 결과</th><th>상태</th></tr></thead><tbody>${a.report.items.map((item,i)=>`<tr><td>${item.number}</td><td>${esc(Array.isArray(a.responses[i])?a.responses[i].join(', '):a.responses[i])}</td><td>${item.state==='review'?`<button data-review-id="${esc(a.id)}" data-revision="${a.revision}" data-number="${item.number}" data-decision="correct">정답 처리</button> <button data-review-id="${esc(a.id)}" data-revision="${a.revision}" data-number="${item.number}" data-decision="wrong">오답 처리</button>`:({correct:self?'O':'정답',wrong:self?'X':'오답',blank:self?'미확인':'미응시'}[item.state]||'확인 필요')}</td></tr>`).join('')}</tbody></table></div>`;}
 $('teacher-attempts').onclick=run(async event=>{const b=event.target.closest('[data-attempt]');if(b)await teacherReview(b.dataset.attempt);});
 $('teacher-review').onclick=run(async event=>{if(await commentAction(event))return;const b=event.target.closest('[data-review-id]');if(b){await api('admin-review',{teacher:true,method:'POST',body:{id:b.dataset.reviewId,revision:Number(b.dataset.revision),number:Number(b.dataset.number),decision:b.dataset.decision}});await teacherReview(b.dataset.reviewId);await teacherAttempts();}});
 const initial=history.state,hashExam=new URLSearchParams(location.hash.slice(1)).get('exam');if(hashExam)requestedExam=hashExam;else if(location.hash==='#library'||location.hash==='#result')requestedExam=null;renderEntrySelection();
 if(staff)run(admin)();else if(token){if(hashExam)run(()=>openExam(hashExam,{record:false}))();else if(initial?.highselectView==='report-view'&&initial.attemptId)run(()=>restoreRoute(initial))();else run(library)();}else{document.body.dataset.view='login-view';history.replaceState({highselectView:'login-view'},'',location.href);}
})();
