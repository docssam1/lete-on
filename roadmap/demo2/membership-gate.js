(async function(){
 'use strict';
 const A=RoadmapMembership,box=document.getElementById('memberGateStatus');
 const destination='account.html?next='+encodeURIComponent('planner.html'+location.search);
 // Looking around without an account is the one door that needs no session. It is asked for by name
 // (planner.html?guest=1), opens with nothing read or stored, and keeps the member-only rooms closed.
 // Its script is fetched only then, so the page still starts with the three membership scripts alone.
 const guestAsked=/(?:^\?|&)guest=1(?:&|$)/.test(location.search),TOUR_SRC='planner-guest.js?v=20261111-guest1';
 const loadOne=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve();s.onerror=()=>reject(new Error(`자료 파일을 불러오지 못했습니다: ${src}`));document.body.appendChild(s);});
 const SCRIPT_TIMEOUT_MS=30000;
 let phase='계정 확인',loaded=0,failed=false;
 const pending=new Set();
 const message=text=>{if(box&&!failed)box.textContent=text;};
 function loadScripts(){
  const placeholders=[...document.querySelectorAll('script[data-member-src]')],total=placeholders.length;
  message(`학습 자료를 준비하고 있습니다. 0/${total}`);
  // Dynamic classic scripts with async=false download together but execute in
  // insertion order. Do not await each append: that serializes 100+ requests.
  // Keep this after both server authentication and cloud-storage preparation.
  return Promise.all(placeholders.map(placeholder=>new Promise((resolve,reject)=>{
   const s=document.createElement('script'),src=placeholder.dataset.memberSrc;
   let timer,done=false;
   const cleanup=()=>{clearTimeout(timer);s.onload=null;s.onerror=null;pending.delete(cancel);};
   const finish=error=>{if(done)return;done=true;cleanup();if(error){s.remove();reject(error);}else{loaded++;message(`학습 자료를 준비하고 있습니다. ${loaded}/${total}`);resolve();}};
   const cancel=()=>{if(done)return;done=true;cleanup();s.remove();reject(new Error('자료 불러오기를 중단했습니다.'));};
   pending.add(cancel);
   s.async=false;s.src=src;
   s.onload=()=>finish();
   s.onerror=()=>finish(new Error(`자료 파일을 불러오지 못했습니다: ${src}`));
   timer=setTimeout(()=>finish(new Error(`자료 파일의 응답 시간이 초과되었습니다: ${src}`)),SCRIPT_TIMEOUT_MS);
   document.body.appendChild(s);
  })));
 }
 try{
  message('계정을 확인하고 있습니다.');
  let member=null;
  try{member=await A.status();}catch(error){if(!guestAsked)throw error;}
  if(!member&&guestAsked){
   phase='둘러보기 준비';
   await loadOne(TOUR_SRC);const tour=window.RoadmapGuestTour;
   window.RoadmapGuest=true;
   window.RoadmapMember=Object.freeze({user_id:'guest',student_name:'',school:null,grade:null,age:null,review:false,guest:true});
   const search=tour.tourSearch(location.search);
   if(window.history&&location.search!==search)window.history.replaceState(null,'','planner.html'+search);
   phase='학습 자료 불러오기';
   await loadScripts();
   document.documentElement.classList.remove('member-checking');box.remove();
   tour.start(window);
   return;
  }
  if(!member){location.replace(destination);return;}
  window.RoadmapMember=Object.freeze({user_id:member.user_id,student_name:member.student_name,school:member.school,grade:member.grade,age:member.age,review:member.review===true});
  phase='저장된 학습 정보 준비';message('저장된 학습 정보를 준비하고 있습니다.');
  await window.RoadmapCloud?.prepare(member);
  phase='학습 자료 불러오기';
  await loadScripts();
  phase='학습 화면 준비';message('학습 화면을 열고 있습니다.');
  await window.RoadmapCloud?.mount();
  const name=document.getElementById('name');if(name&&!name.value)name.value=member.student_name;
  document.documentElement.classList.remove('member-checking');box.remove();
  const link=document.createElement('a');link.className='member-account-link';link.href=destination;link.textContent='내 계정';link.setAttribute('aria-label',member.review?'계정 확인과 로그아웃':'학생 정보와 로그인 번호·수신 동의 관리');
  const menu=document.querySelector('.prn-global-body')||document.querySelector('.top');menu?.appendChild(link);
  // Returning from bfcache must not resurrect a signed-out student's screen.
  window.addEventListener('pageshow',async e=>{if(!e.persisted)return;document.documentElement.classList.add('member-checking');try{const m=await A.status();if(!m||m.user_id!==member.user_id){location.replace(destination);return;}document.documentElement.classList.remove('member-checking');}catch{location.replace(destination);}});
  document.addEventListener('visibilitychange',async()=>{if(document.hidden)return;try{const m=await A.status();if(!m||m.user_id!==member.user_id){document.documentElement.classList.add('member-checking');location.replace(destination);}}catch(e){if(e.status===401){document.documentElement.classList.add('member-checking');location.replace(destination);}}});
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
