(function(root){
 'use strict';
 const params=new URLSearchParams(root.location.search),practice=params.get('mode')==='practice';
 const teacherPreview=['localhost','127.0.0.1','[::1]'].includes(root.location.hostname)&&params.get('teacherPreview')==='1';
 const remotePractice=practice&&!teacherPreview;
 const pages=root.document.getElementById('pages'),answerButton=root.document.getElementById('answerBtn'),regenButton=root.document.getElementById('regenBtn'),printButton=root.document.querySelector('.actions .gold');
 const legacy=['../data.js','../secure-mock.js?v=hf-secure-mock-20260903a','../generator/q01.js','../generator/stacking.js','../generator/spatial.js','../generator/reasoning.js','../generator/advanced.js','../generator/logic.js','../generator/combinatorics.js','../generator/applications.js','./exam-blueprints.js','./premier-release-catalog.js','./variation-bank.js','./mock-core.js?v=hf-practice-safe-20260903a','./secure-flow.js?v=hf-secure-mock-20260903a'];
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function load(src){return new Promise((resolve,reject)=>{const script=root.document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(Error('화면 구성 요소를 불러오지 못했습니다.'));root.document.head.append(script);});}
 function state(message){pages.replaceChildren();const sheet=root.document.createElement('section'),box=root.document.createElement('div');sheet.className='sheet';box.className='empty';box.setAttribute('role','status');box.textContent=message;sheet.append(box);pages.append(sheet);answerButton.hidden=true;regenButton.hidden=true;printButton.disabled=true;}
 async function startRemote(){
  state('이용 승인과 비공개 문제를 확인하고 있습니다.');
  root.document.getElementById('backLink').href='../diagnosis.html?section=similar';
  if(root.GFIELD_HF_SUPABASE_CONFIG?.enabled!==true||root.GFIELD_HF_SUPABASE_CONFIG?.features?.securePracticeDelivery!==true){state('유사문제는 비공개 서버 전달 검수 중입니다.');return;}
  await load('./practice-public-catalog.js');
  await load('./practice-content-client.js');
  await root.HFTypeAccess?.ready();
  const captured=root.HFTypeAccess?.watermarkIdentity?.(),content=root.HFPracticeContent;
  let version=0,questions=null,answers=null,expiryTimer=null,renewTimer=null,expired=false,renewing=null,showAnswers=false;
  const level=['easy','same','hard'].includes(params.get('difficulty'))?params.get('difficulty'):'same',perType={};
  for(const pair of (params.get('levels')||'').split(',')){if(!pair)continue;const[id,difficulty]=pair.split(':');if(!/^\d+$/.test(id)||!['easy','same','hard'].includes(difficulty))throw Error('유형별 난이도를 확인하세요.');perType[Number(id)]=difficulty;}
  const typeTokens=(params.get('types')||'').split(','),typeIds=typeTokens.map(v=>/^\d+$/.test(v)?Number(v):NaN);
  const chosenTier=params.get('accessTier')||params.get('tier');
  if(chosenTier&&!['free','paid'].includes(chosenTier))throw Error('이용 범위를 확인하세요.');
  const tier=chosenTier||(root.HFTypeAccess?.status?.().hasPaidAccess?'paid':'free');
  const seedText=params.get('seed'),numericSeed=seedText!==null&&/^\d+$/.test(seedText)?Number(seedText):NaN,seed=seedText===null?root.crypto.getRandomValues(new Uint32Array(1))[0]:Number.isSafeInteger(numericSeed)?numericSeed>>>0:NaN;
  const countText=params.get('count');
  const request=content.validateRequest({action:'practice',types:typeIds.map(typeId=>({typeId,difficulty:perType[typeId]||level})),countPerType:countText&&/^\d+$/.test(countText)?Number(countText):NaN,seed,accessTier:tier,part:'questions'});
  for(const id of Object.keys(perType))if(!typeIds.includes(Number(id)))throw Error('선택하지 않은 유형의 난이도가 들어 있습니다.');
  function current(){return !expired&&content.sameIdentity(captured,root.HFTypeAccess?.watermarkIdentity?.())&&request.types.every(t=>root.HFTypeAccess?.allowType(t.typeId,{paid:tier==='paid'})===true);}
  function stopTimers(){if(expiryTimer)root.clearTimeout(expiryTimer);if(renewTimer)root.clearTimeout(renewTimer);expiryTimer=null;renewTimer=null;}
  function clear(message){expired=true;version++;questions=null;answers=null;showAnswers=false;stopTimers();state(message||'이용 승인이 만료되거나 변경되었습니다. 맞춤 학습에서 다시 열어 주세요.');}
  function guard(){if(!current()||questions&&Date.now()>=Math.min(questions.validUntil,answers?.validUntil||Infinity)){clear();return false;}return true;}
  function matching(a,b){return a.contentVersion===b.contentVersion&&a.questions.length===b.questions.length&&a.questions.every((q,i)=>content.rowIdentity(q)===content.rowIdentity(b.questions[i]));}
  function schedule(){
   stopTimers();const until=Math.min(questions.validUntil,answers?.validUntil||Infinity),left=until-Date.now();
   expiryTimer=root.setTimeout(()=>clear(),Math.max(0,left));
   if(left>1500)renewTimer=root.setTimeout(()=>renew(),Math.max(500,left-15000));
  }
  async function renew(){
   if(renewing||!guard())return renewing;
   const ticket=version;
   renewing=(async()=>{try{
    const next=await content.request(request);
    if(ticket!==version||!guard())return;
    if(!matching(questions,next))throw Error('문제가 갱신되었습니다. 맞춤 학습에서 다시 열어 주세요.');
    const nextAnswers=answers?await content.request({...request,part:'answers'},next):null;
    if(ticket!==version||!guard())return;
    questions=next;answers=nextAnswers;schedule();
   }catch(error){if(ticket===version)clear(String(error?.message||'이용 승인을 다시 확인하지 못했습니다.'));}finally{renewing=null;}})();
   return renewing;
  }
  root.addEventListener('hf-type-access-change',()=>{if(!current())clear();});
  root.addEventListener('beforeprint',guard);
  root.document.addEventListener('visibilitychange',()=>{if(!root.document.hidden)guard();});
  if(!current()){clear('승인된 학생과 유형을 확인한 뒤 맞춤 학습에서 다시 열어 주세요.');return;}
  const ticket=version;
  questions=await content.request(request);
  if(ticket!==version||!guard())return;
  const canonical=new URLSearchParams(params);canonical.set('seed',String(seed));canonical.delete('student');canonical.delete('teacherPreview');root.history.replaceState(null,'',root.location.pathname+'?'+canonical);
  const titleFor=id=>root.HFPracticeCatalog.types.find(t=>t.typeId===id)?.title||'선택 유형';
  const label={easy:'쉽게',same:'같게',hard:'어렵게'};
  function header(title,index,total){return '<div class="watermark">'+esc(questions.approvedStudentName)+' · GFIELD · LETE-ON</div><div class="head"><div><div class="brand">G-FIELD · LETE-ON</div><h1>'+esc(title)+'</h1></div><div class="meta">'+esc(questions.approvedStudentName)+' 학생<br>'+index+'/'+total+'</div></div>';}
function drawQuestions(){pages.innerHTML=questions.questions.map((q,i)=>'<section class="sheet remote-practice-sheet">'+header('유형별 맞춤 학습',i+1,questions.questions.length)+(i===0&&tier==='free'?'<div class="instructions">무료 유사문제는 유형·난이도별 고정 2문항입니다. 선택한 문제 수만큼 표시합니다.</div>':'')+'<article class="question"><div class="qhead"><span class="num">'+q.number+'</span><div><span class="tag">'+esc(titleFor(q.typeId))+' · '+label[q.difficulty]+'</span><div class="prompt">'+esc(q.prompt)+'</div></div></div><div class="figure">'+q.problemHtml+'</div><div class="answer-line">답: ____________________</div></article></section>').join('');}
  function drawAnswers(){pages.insertAdjacentHTML('beforeend',answers.answers.map((a,i)=>'<section class="sheet solutions remote-practice-sheet'+(showAnswers?' show':'')+'">'+header('정답 및 풀이',i+1,answers.answers.length)+'<article class="solution"><b>'+a.number+'. '+esc(titleFor(a.typeId))+'</b><div class="remote-answer">'+a.answerHtml+'</div>'+(a.solutionDiagram?'<div class="figure">'+a.solutionDiagram+'</div>':'')+'<p>'+esc(a.solution).replace(/\n/g,'<br>')+'</p></article></section>').join(''));}
  drawQuestions();schedule();answerButton.hidden=false;regenButton.hidden=!(tier==='paid'&&request.types.some(t=>(root.HFPracticeCatalog.types.find(x=>x.typeId===t.typeId)?.pools?.[t.difficulty]?.paid?.count||0)>request.countPerType));printButton.disabled=false;
  answerButton.onclick=async()=>{
   if(!guard())return;
   if(answers){showAnswers=!showAnswers;pages.querySelectorAll('.solutions').forEach(el=>el.classList.toggle('show',showAnswers));answerButton.textContent=showAnswers?'정답·풀이 닫기':'정답·풀이 보기';return;}
   const answerTicket=version;answerButton.disabled=true;answerButton.textContent='정답을 확인하고 있습니다.';
   try{
    const result=await content.request({...request,part:'answers'},questions);
    if(answerTicket!==version||!guard())return;
    answers=result;showAnswers=true;drawAnswers();answerButton.textContent='정답·풀이 닫기';schedule();
   }catch(error){if(answerTicket===version)clear(String(error?.message||'문제와 답안을 확인하지 못했습니다.'));}
   finally{answerButton.disabled=false;}
  };
  regenButton.onclick=()=>{if(!guard())return;const next=new URLSearchParams(canonical);next.set('seed',String(root.crypto.getRandomValues(new Uint32Array(1))[0]));root.location.search=next;};
  printButton.onclick=()=>{if(guard())root.print();};
 }
 const api={teacherPreview,remotePractice,ready:null};
 root.HFPracticeBootstrap=api;
 api.ready=(async()=>{try{if(remotePractice)await startRemote();else for(const src of legacy)await load(src);}catch(error){state(String(error?.message||'문제지를 안전하게 불러오지 못했습니다.'));api.failed=true;}})();
})(window);
