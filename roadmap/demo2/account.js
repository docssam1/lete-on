(function(){
 'use strict';
 const A=RoadmapMembership,P=RoadmapPolicy,$=id=>document.getElementById(id),root=$('memberContent');
 const next=A.destination(new URLSearchParams(location.search).get('next'));
 let member=null,proof=null,email='',mode='signup',cooldown=0,timer=null,busy=false;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const field=(name,label,type='text',attr='')=>`<label class="member-field">${label}<input name="${name}" type="${type}" ${attr} required></label>`;
 const pinFields=()=>field('pin','로그인 번호','password','inputmode="numeric" pattern="[0-9]{8,12}" minlength="8" maxlength="12" autocomplete="new-password" aria-describedby="pinHelp"')+field('pinAgain','로그인 번호 확인','password','inputmode="numeric" pattern="[0-9]{8,12}" minlength="8" maxlength="12" autocomplete="new-password"')+'<p class="member-note" id="pinHelp">숫자 8~12자리입니다. 다른 서비스에서 쓰는 번호나 생년월일은 피해주세요.</p>';
 function announce(text='',error=false){$('memberStatus').textContent=text;$('memberStatus').classList.toggle('is-error',error);}
 function screen(title,body){root.innerHTML=`<h2 id="memberTitle" tabindex="-1">${title}</h2>${body}`;announce();$('memberTitle').focus({preventScroll:true});}
 async function run(fn){if(busy)return;busy=true;root.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();}catch(e){announce(A.message(e),true);}finally{busy=false;root.querySelectorAll('button').forEach(b=>b.disabled=false);updateCooldown();}}
 function login(){
  screen('다시 만나 반갑습니다.',`<p class="member-lead">가입한 이메일과 로그인 번호로 들어오세요.</p><form id="loginForm">${field('email','보호자 이메일','email','autocomplete="username" maxlength="254"')}${field('pin','로그인 번호','password','inputmode="numeric" pattern="[0-9]{8,12}" maxlength="12" autocomplete="current-password"')}<button class="member-primary">로그인</button></form><div class="member-actions"><button data-action="signup">이메일로 가입·로그인</button><button data-action="reset">로그인 번호를 잊으셨나요?</button></div><p class="member-note">이메일 인증을 마치면 별도 승인 없이 무료로 이용합니다.</p>`);
  root.querySelector('[name=email]').value=email;
  $('loginForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);run(async()=>{email=String(f.get('email')).trim().toLowerCase();member=A.accept(await A.call('login',{email,pin:f.get('pin')}));e.target.reset();profile();});};
 }
 function emailScreen(intent='signup'){
  mode=intent;
  screen(intent==='reset'?'로그인 번호를 다시 정합니다.':intent==='withdraw'?'탈퇴 전 이메일을 확인합니다.':'이메일로 시작합니다.',`<p class="member-lead">${intent==='signup'?'보호자 이메일로 인증번호를 받아 주세요.':'가입한 이메일로 인증한 뒤 진행합니다.'}</p><form id="emailForm">${field('email','보호자 이메일','email','autocomplete="email" maxlength="254"')}<label class="check"><input type="checkbox" name="emailConsent" required><span><b>[필수]</b> 이메일 인증과 계정 관리를 위한 이메일 수집·이용에 동의합니다. <a href="privacy.html" target="_blank" rel="noopener">내용 보기</a></span></label><button class="member-primary" id="sendCode">인증번호 받기</button></form><form id="codeForm" hidden>${field('code','이메일 인증번호','text','inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" maxlength="10"')}<button class="member-primary">인증번호 확인</button></form><button class="member-link" data-action="login">로그인으로 돌아가기</button>`);
  root.querySelector('[name=email]').value=member?.email||email;
  $('emailForm').onsubmit=e=>{e.preventDefault();run(async()=>{
   const f=new FormData(e.target);email=String(f.get('email')).trim().toLowerCase();
   await A.call('send-code',{email,emailConsent:f.get('emailConsent')==='on'});
   cooldown=Date.now()+60000;clearInterval(timer);timer=setInterval(updateCooldown,1000);
   $('codeForm').hidden=false;$('emailForm').querySelector('[name=email]').readOnly=true;
   announce('인증번호를 보냈습니다. 메일이 보이지 않으면 스팸함도 확인해 주세요.');$('codeForm').querySelector('input').focus();
  });};
  $('codeForm').onsubmit=e=>{e.preventDefault();run(async()=>{
   const candidate=await A.verify(email,String(new FormData(e.target).get('code')));await A.closeProof(proof);proof=candidate;
   const result=await A.call('email-status',{},proof);member=result.member;
   if(mode==='withdraw'){if(!member)throw new Error('member_missing');withdrawConfirm();}
   else if(mode==='reset'){if(!member){registration();announce('아직 로드맵 회원 등록이 없습니다. 학생 정보를 먼저 등록해 주세요.');}else resetPin();}
   else if(member)emailWelcome();else registration();
  });};
  updateCooldown();
 }
 function updateCooldown(){const b=$('sendCode'),left=Math.max(0,Math.ceil((cooldown-Date.now())/1000));if(!left){clearInterval(timer);timer=null;}if(!b)return;b.disabled=busy||left>0;b.textContent=left?`다시 받기 · ${left}초 후`:$('codeForm')?.hidden?'인증번호 받기':'인증번호 다시 받기';}
 function schoolFields(m){
  return field('studentName','학생 이름','text','autocomplete="off" maxlength="30"')+field('guardianPhone','보호자 휴대폰 번호','tel','autocomplete="tel-national" maxlength="15"')+`<div class="member-row"><label class="member-field">학교 단계<select name="school" required><option value="preschool">유치</option><option value="elementary">초등</option><option value="middle">중등</option><option value="high">고등</option></select></label><label class="member-field"><span id="levelLabel">나이</span><select name="level" required></select></label></div>`;
 }
 function fillSchool(m){const form=$('profileForm'),school=form.elements.school,level=form.elements.level;
  form.elements.studentName.value=m?.student_name||'';form.elements.guardianPhone.value=m?.guardian_phone||'';school.value=m?.school||'elementary';
  function options(){const pre=school.value==='preschool';$('levelLabel').textContent=pre?'유치 나이':'현재 학년';level.innerHTML='<option value="">선택해 주세요</option>'+Array.from({length:pre?5:school.value==='elementary'?6:3},(_,i)=>{const n=pre?i+3:i+1;return `<option value="${n}">${n}${pre?'세':'학년'}</option>`;}).join('');}
  school.onchange=options;options();if(m)level.value=m.school==='preschool'?m.age:m.grade;
 }
 const readProfile=f=>({studentName:f.get('studentName'),guardianPhone:f.get('guardianPhone'),school:f.get('school'),age:f.get('school')==='preschool'?Number(f.get('level')):null,grade:f.get('school')!=='preschool'?Number(f.get('level')):null});
 function checkPin(f){if(f.get('pin')!==f.get('pinAgain')){const e=new Error('로그인 번호가 서로 다릅니다.');e.local=true;throw e;}return f.get('pin');}
 function registration(){
  screen('학생의 현재 정보를 알려주세요.',`<p class="member-lead">${esc(email)} · 이메일 인증 완료</p><form id="profileForm">${schoolFields()}${pinFields()}${P.checks()}<button class="member-primary">무료로 로드맵 시작하기</button></form>`);fillSchool();
  $('profileForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);if(f.get('pin')!==f.get('pinAgain')){announce('로그인 번호가 서로 다릅니다.',true);return;}run(async()=>{
   const result=await A.call('register',{profile:readProfile(f),pin:checkPin(f),consent:{version:P.VERSION,privacy:f.get('privacy')==='on',guardian:f.get('guardian')==='on',marketing_email:f.get('marketing_email')==='on',marketing_sms:f.get('marketing_sms')==='on'}},proof);
   member=A.accept(result);e.target.reset();await A.closeProof(proof);proof=null;complete('회원 등록이 완료되었습니다.');
  });};
 }
 function emailWelcome(){screen('가입한 계정을 찾았습니다.',`<p class="member-lead">${esc(member.student_name)} 학생의 로드맵을 이어서 살펴보세요.</p><button class="member-primary" data-action="email-login">로드맵 이어보기</button><button class="member-link" data-action="set-pin">로그인 번호 다시 정하기</button>`);}
 function resetPin(){screen('새 로그인 번호를 정해 주세요.',`<p class="member-lead">${esc(email)} · 이메일 인증 완료</p><form id="pinForm">${pinFields()}<p class="member-note">변경하면 이전 번호와 기존 로그인은 종료됩니다.</p><button class="member-primary">로그인 번호 변경</button></form>`);
  $('pinForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);if(f.get('pin')!==f.get('pinAgain')){announce('로그인 번호가 서로 다릅니다.',true);return;}run(async()=>{member=A.accept(await A.call('reset-pin',{pin:f.get('pin')},proof));e.target.reset();await A.closeProof(proof);proof=null;complete('로그인 번호를 변경했습니다.');});};
 }
 function complete(title){screen(title,`<p class="member-lead">${esc(member.student_name)} 학생의 학습 로드맵을 만들어 보세요.</p><a class="member-primary" href="${esc(next)}">로드맵으로 가기 <span aria-hidden="true">→</span></a><button class="member-link" data-action="profile">내 계정 확인</button>`);}
 function profile(){email=member.email;
  screen('내 계정',`<p class="member-lead member-email">${esc(member.email)} <span class="member-badge">이메일 인증 완료</span></p><a class="member-primary" href="${esc(next)}">학습 로드맵 이어보기 →</a><form id="profileForm">${schoolFields(member)}<details><summary>광고성 정보 수신·이용 안내</summary>${P.marketing}</details><label class="check"><input type="checkbox" name="marketing_email"><span>[선택] 이메일로 교육·행사 안내 받기</span></label><label class="check"><input type="checkbox" name="marketing_sms"><span>[선택] 문자로 교육·행사 안내 받기</span></label><button class="member-secondary">회원 정보·수신 동의 저장</button></form><div class="member-actions"><button data-action="change-pin">로그인 번호 변경</button><button data-action="logout">로그아웃</button><button data-action="import">이 기기의 이전 설계 연결</button></div><p class="member-note">학습 설계는 계정별로 이 기기에 보관됩니다. 다른 기기와 자동 연결되지는 않습니다.</p><details class="member-withdraw"><summary>개인정보 동의 철회·회원 탈퇴</summary><p>이메일을 다시 인증한 뒤 로드맵 회원 정보를 삭제합니다. 다른 GFIELD 서비스의 가입 정보는 유지됩니다.</p><button data-action="withdraw">로드맵 회원 탈퇴</button></details>`);fillSchool(member);
  const f=$('profileForm');f.elements.marketing_email.checked=member.marketing_email;f.elements.marketing_sms.checked=member.marketing_sms;
  f.onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);run(async()=>{member=(await A.call('update',{version:P.VERSION,profile:readProfile(d),marketing_email:d.get('marketing_email')==='on',marketing_sms:d.get('marketing_sms')==='on'})).member;announce('회원 정보와 수신 동의를 저장했습니다.');});};
 }
 function clearOwnPlan(){for(const s of [sessionStorage,localStorage])for(const key of Object.keys(s))if(key.startsWith('gfield.demo2.member.'+member.user_id+'.')||key.startsWith('gfield.demo2.saved.member.'+member.user_id+'.')||key.startsWith('gfield.demo2.saved.guard.member.'+member.user_id+'.'))s.removeItem(key);}
 function withdrawConfirm(){screen('로드맵 회원에서 탈퇴할까요?',`<p class="member-lead">${esc(member.email)}의 로드맵 회원 정보·연락처·동의 내역과 이 기기의 계정별 설계를 삭제합니다.</p><p>다른 GFIELD 서비스의 계정과 기록은 삭제하지 않습니다.</p><button class="member-primary member-danger" data-action="delete">확인했습니다. 로드맵 회원 탈퇴</button><button class="member-link" data-action="profile">계정으로 돌아가기</button>`);}
 root.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(!action||busy)return;
  if(action==='login')login();if(action==='signup'||action==='reset')emailScreen(action);
  if(action==='profile')profile();if(action==='set-pin')resetPin();if(action==='change-pin')emailScreen('reset');if(action==='withdraw')emailScreen('withdraw');
  if(action==='logout')run(async()=>{await A.logout();await A.closeProof(proof);proof=null;member=null;login();});
  if(action==='email-login')run(async()=>{member=A.accept(await A.call('email-login',{},proof));await A.closeProof(proof);proof=null;complete('이메일 인증을 마쳤습니다.');});
  if(action==='delete')run(async()=>{await A.call('withdraw',{confirm:true},proof);try{clearOwnPlan();}catch{}A.clear();await A.closeProof(proof);proof=null;member=null;login();announce('로드맵 회원 정보가 삭제되었습니다.');});
  if(action==='import'){
   if(!confirm('이 브라우저에서 회원 가입 전에 만들었던 설계만 연결합니다. 본인의 설계가 맞는지 확인하셨나요?'))return;
   try{let count=0;for(const s of [sessionStorage,localStorage])for(const key of Object.keys(s)){
    const prefix=s===sessionStorage?'gfield.demo2.':'gfield.demo2.saved.';
    if(!key.startsWith(prefix))continue;const tail=key.slice(prefix.length);if(/^(?:saved\.|member\.|guard\.)/.test(tail))continue;
    const target=prefix+'member.'+member.user_id+'.'+tail;if(s.getItem(target)===null){s.setItem(target,s.getItem(key));count++;}
   }announce(count?'이전 설계를 계정에 연결했습니다.':'연결할 이전 설계가 없거나 이미 연결되어 있습니다.');}catch{announce('기기 저장 공간을 확인해 주세요.',true);}
  }
 });
 A.status().then(m=>{member=m;if(m)profile();else login();}).catch(e=>{login();announce(A.message(e),true);});
})();
