(async function(){
 'use strict';
 const A=RoadmapMembership,box=document.getElementById('memberGateStatus');
 const destination='account.html?next='+encodeURIComponent('planner.html'+location.search);
 // Looking around without an account is the one door that needs no session. It is asked for by name
 // (planner.html?guest=1), opens with nothing read or stored, and keeps the member-only rooms closed.
 // Its script is fetched only then, so the page still starts with the three membership scripts alone.
 const guestAsked=/(?:^\?|&)guest=1(?:&|$)/.test(location.search),TOUR_SRC='planner-guest.js?v=20261111-guest2',CONSULT_SRC='planner-consult.js?v=20261123-students1';
 const loadOne=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve();s.onerror=()=>reject(new Error(`자료 파일을 불러오지 못했습니다: ${src}`));document.body.appendChild(s);});
 const SCRIPT_TIMEOUT_MS=30000;
 let phase='계정 확인',loaded=0,failed=false;
 const delivery=document.documentElement.dataset||{};
 const pending=new Set();
 const message=text=>{if(box&&!failed)box.textContent=text;};
 function loadScripts(list=null){
  if(!list&&delivery.runtimeBundle){const all=[...document.querySelectorAll('script[data-member-src]')];return loadScripts(all.filter(p=>p.dataset.parentBoot!==undefined)).then(()=>loadScripts(all.filter(p=>p.dataset.parentBoot===undefined)));}
  const placeholders=(list||[...document.querySelectorAll('script[data-member-src]')]).filter(p=>p.dataset.memberLoaded!=='1'),total=placeholders.length;
  const bundle=total&&(placeholders.every(p=>p.dataset.parentBoot!==undefined)?delivery.entryBundle:placeholders.every(p=>p.dataset.parentBoot===undefined)?delivery.runtimeBundle:null);
  if(bundle)return new Promise((resolve,reject)=>{
   message('학습 화면을 준비하고 있습니다.');
   const s=document.createElement('script');let done=false,timer;
   const finish=error=>{if(done)return;done=true;clearTimeout(timer);pending.delete(cancel);s.onload=s.onerror=null;if(error){s.remove();reject(error);}else{placeholders.forEach(p=>p.dataset.memberLoaded='1');resolve();}};
   const cancel=()=>finish(new Error('자료 불러오기를 중단했습니다.'));pending.add(cancel);
   s.async=false;s.src=bundle;s.onload=()=>finish();s.onerror=()=>finish(new Error('학습 자료를 불러오지 못했습니다.'));
   timer=setTimeout(()=>finish(new Error('학습 자료의 응답 시간이 초과되었습니다.')),SCRIPT_TIMEOUT_MS);document.body.appendChild(s);
  });
  let completed=0;
  message(`학습 자료를 준비하고 있습니다. 0/${total}`);
  // Dynamic classic scripts with async=false download together but execute in
  // insertion order. Do not await each append: that serializes 100+ requests.
  // Keep this after both server authentication and cloud-storage preparation.
  return Promise.all(placeholders.map(placeholder=>new Promise((resolve,reject)=>{
   const s=document.createElement('script'),src=placeholder.dataset.memberSrc;
   let timer,done=false;
   const cleanup=()=>{clearTimeout(timer);s.onload=null;s.onerror=null;pending.delete(cancel);};
   const finish=error=>{if(done)return;done=true;cleanup();if(error){s.remove();reject(error);}else{loaded++;completed++;placeholder.dataset.memberLoaded='1';message(`학습 자료를 준비하고 있습니다. ${completed}/${total}`);resolve();}};
   const cancel=()=>{if(done)return;done=true;cleanup();s.remove();reject(new Error('자료 불러오기를 중단했습니다.'));};
   pending.add(cancel);
   s.async=false;s.src=src;
   s.onload=()=>finish();
   s.onerror=()=>finish(new Error(`자료 파일을 불러오지 못했습니다: ${src}`));
   timer=setTimeout(()=>finish(new Error(`자료 파일의 응답 시간이 초과되었습니다: ${src}`)),SCRIPT_TIMEOUT_MS);
   document.body.appendChild(s);
  })));
 }
 function loadStyles(){
  if(delivery.runtimeStyle)return new Promise((resolve,reject)=>{const link=document.createElement('link'),timer=setTimeout(()=>reject(new Error('화면 스타일의 응답 시간이 초과되었습니다.')),SCRIPT_TIMEOUT_MS);link.rel='stylesheet';link.onload=()=>{clearTimeout(timer);resolve();};link.onerror=()=>{clearTimeout(timer);reject(new Error('화면 스타일을 불러오지 못했습니다.'));};link.href=delivery.runtimeStyle;document.head.insertBefore(link,document.querySelector('link[data-member-href]'));});
  return Promise.all([...document.querySelectorAll('link[data-member-href]')].filter(n=>n.dataset.memberHref&&!n.href).map(n=>new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('화면 스타일의 응답 시간이 초과되었습니다.')),SCRIPT_TIMEOUT_MS);
   n.onload=()=>{clearTimeout(timer);resolve();};n.onerror=()=>{clearTimeout(timer);reject(new Error('화면 스타일을 불러오지 못했습니다.'));};n.href=n.dataset.memberHref;
  })));
 }
 try{
  message('계정을 확인하고 있습니다.');
  let member=null,startup=null;
  try{startup=A.startup?await A.startup():{member:await A.status()};member=startup.member;}catch(error){if(!guestAsked)throw error;}
  if(!member&&guestAsked){
   phase='둘러보기 준비';
   await loadOne(TOUR_SRC);const tour=window.RoadmapGuestTour;
   window.RoadmapGuest=true;
   window.RoadmapMember=Object.freeze({user_id:'guest',student_name:'',school:null,grade:null,age:null,review:false,guest:true});
   const search=tour.tourSearch(location.search);
   if(window.history&&location.search!==search)window.history.replaceState(null,'','planner.html'+search);
   phase='학습 자료 불러오기';
   await Promise.all([loadScripts(),loadStyles()]);
   document.documentElement.classList.remove('member-checking');box.remove();
   tour.start(window);
   return;
  }
  if(!member){location.replace(destination);return;}
  window.RoadmapSpeed?.mark('member_verified');
  // Consulting access is server verified. Hydrate this student before the planner reads any saved state.
  let consult=null;
  if(member.review===true){phase='컨설팅 모드 준비';await loadOne(CONSULT_SRC);consult=await window.RoadmapConsult.prepare(member,startup?.plan);}
  window.RoadmapMember=Object.freeze({user_id:consult?consult.owner:member.user_id,student_name:consult?consult.name:member.student_name,school:member.school,grade:member.grade,age:member.age,review:member.review===true,consult:!!consult,...(consult?{consultAccount:consult.accountId,consultStudent:consult.student}:{})});
  phase='저장된 학습 정보 준비';message('저장된 학습 정보를 준비하고 있습니다.');
  // Public code can download while this verified owner's cloud state is prepared.
  // No saved-plan read, form mount or protected-screen reveal precedes hydration.
  const cloudReady=Promise.resolve(window.RoadmapCloud?.prepare(window.RoadmapMember,consult?undefined:startup?.plan)).then(()=>{if(consult&&window.RoadmapConsult.afterCloud)window.RoadmapMember=Object.freeze({...window.RoadmapMember,student_name:window.RoadmapConsult.afterCloud()});window.RoadmapSpeed?.mark('plan_ready');});
  let fullPromise;
  const loadFull=()=>fullPromise||(fullPromise=(async()=>{
   phase='학습 자료 불러오기';await Promise.all([loadScripts(),loadStyles()]);
   phase='학습 화면 준비';message('학습 화면을 열고 있습니다.');
   if(consult)window.RoadmapConsult.mount(document);await window.RoadmapCloud?.mount();
   const name=document.getElementById('name');if(name&&(consult||!name.value))name.value=consult?window.RoadmapMember.student_name:member.student_name;
   document.documentElement.classList.remove('member-checking');box.remove();
   const link=document.createElement('a');link.className='member-account-link';link.href=destination;link.textContent='내 계정';link.setAttribute('aria-label',member.review?'계정 확인과 로그아웃':'학생 정보와 로그인 번호·수신 동의 관리');
   const menu=(consult&&document.querySelector('.consult-bar'))||document.querySelector('.prn-global-body')||document.querySelector('.top');menu?.appendChild(link);
  })());
  // Returning from bfcache must not resurrect a signed-out student's screen.
  window.addEventListener('pageshow',async e=>{if(!e.persisted)return;document.documentElement.classList.add('member-checking');try{const m=await A.status();if(!m||m.user_id!==member.user_id){location.replace(destination);return;}document.documentElement.classList.remove('member-checking');}catch{location.replace(destination);}});
  document.addEventListener('visibilitychange',async()=>{if(document.hidden)return;try{const m=await A.status();if(!m||m.user_id!==member.user_id){document.documentElement.classList.add('member-checking');location.replace(destination);}}catch(e){if(e.status===401){document.documentElement.classList.add('member-checking');location.replace(destination);}}});
  const early=[...document.querySelectorAll('script[data-member-src]')].filter(p=>p.dataset.parentBoot!==undefined);
  const direct=/(?:[?&])(?:tools|guest|academy|admissions|view|weekly|checklist|assessment|goal|ox|case|senior)=/.test(location.search);
  if(!consult&&!direct&&early.length){
   phase='현재 공부 입력 준비';await Promise.all([cloudReady,loadScripts(early)]);
   let saved;try{saved=JSON.parse(window.PlannerStorage.getItem('gfield.demo2.v1')||'null');}catch{}
   await window.RoadmapParentBoot.mount({loadFull,member,saved});
   document.documentElement.classList.remove('member-checking');box.remove();
   window.RoadmapSpeed?.ready('input_ready','#parentBoot');
  }else {await cloudReady;await loadFull();window.RoadmapSpeed?.ready('input_ready','#journeyMap');}
 }catch(error){
  failed=true;for(const cancel of [...pending])cancel();
  document.documentElement.classList.add('member-checking');
  // No offline fallback to an unverified local flag. A member's screen never opens from a query string;
  // the guest tour above is a separate, storage-less screen.
  box.replaceChildren();const p=document.createElement('p');p.textContent=`${phase} 중 문제가 생겼습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
  const detail=document.createElement('p');detail.textContent=phase==='학습 자료 불러오기'?error.message:'';
  const retry=document.createElement('button');retry.textContent='다시 시도';retry.onclick=()=>location.reload();
  const link=document.createElement('a');link.href=destination;link.textContent='로그인 화면으로';box.append(p,detail,retry,link);
 }
})();
