(async function(){
 'use strict';
 const A=RoadmapMembership,box=document.getElementById('memberGateStatus');
 const destination='account.html?next='+encodeURIComponent('planner.html'+location.search);
 try{
  const member=await A.status();
  if(!member){location.replace(destination);return;}
  window.RoadmapMember=Object.freeze({user_id:member.user_id,student_name:member.student_name,school:member.school,grade:member.grade,age:member.age});
  // Existing curriculum scripts run only after a server-verified, roadmap-specific session.
  for(const placeholder of document.querySelectorAll('script[data-member-src]')){
   await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=placeholder.dataset.memberSrc;s.async=false;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});
  }
  const name=document.getElementById('name');if(name&&!name.value)name.value=member.student_name;
  document.documentElement.classList.remove('member-checking');box.remove();
  const link=document.createElement('a');link.className='member-account-link';link.href=destination;link.textContent='내 계정';link.setAttribute('aria-label','학생 정보와 로그인 번호·수신 동의 관리');
  const menu=document.querySelector('.prn-global-body')||document.querySelector('.top');menu?.appendChild(link);
  // Returning from bfcache must not resurrect a signed-out student's screen.
  window.addEventListener('pageshow',async e=>{if(!e.persisted)return;document.documentElement.classList.add('member-checking');try{const m=await A.status();if(!m||m.user_id!==member.user_id){location.replace(destination);return;}document.documentElement.classList.remove('member-checking');}catch{location.replace(destination);}});
  document.addEventListener('visibilitychange',async()=>{if(document.hidden)return;try{const m=await A.status();if(!m||m.user_id!==member.user_id){document.documentElement.classList.add('member-checking');location.replace(destination);}}catch(e){if(e.status===401){document.documentElement.classList.add('member-checking');location.replace(destination);}}});
 }catch{
  // No offline fallback to an unverified local flag or query-string bypass.
  box.replaceChildren();const p=document.createElement('p');p.textContent='계정을 확인하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
  const retry=document.createElement('button');retry.textContent='다시 확인';retry.onclick=()=>location.reload();
  const link=document.createElement('a');link.href=destination;link.textContent='로그인 화면으로';box.append(p,retry,link);
 }
})();
