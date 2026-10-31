(function(g){
 'use strict';
 const SB_URL='https://fgahqumaldheqettmvqg.supabase.co',KEY='sb_publishable_OsjJG92BLMaZrc2jTClt0g_ecdTtf_I';
 const STORE='gfield.roadmap.member.session.v1';
 let session=null;
 try{const s=JSON.parse(g.sessionStorage.getItem(STORE)||'null');if(s?.token&&Date.parse(s.expiresAt)>Date.now())session=s;}catch{}
 async function request(path,body,headers={}){
  const r=await fetch(SB_URL+path,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',...headers},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(25000)});
  const data=await r.json().catch(()=>({}));
  if(!r.ok){const e=new Error(data.error||data.error_code||'request_failed');e.status=r.status;throw e;}return data;
 }
 async function call(action,body={},proof){return request('/functions/v1/roadmap-members',{action,...body},proof?{Authorization:'Bearer '+proof}:session?{'x-roadmap-session':session.token}:{});}
 function clear(){session=null;try{g.sessionStorage.removeItem(STORE);}catch{}}
 function accept(data){
  if(!/^[a-f0-9]{64}$/.test(data.token||'')||!data.member?.user_id)throw new Error('session_invalid');
  session={token:data.token,expiresAt:data.expiresAt};
  try{g.sessionStorage.setItem(STORE,JSON.stringify(session));}catch{clear();throw new Error('storage_unavailable');}
  return data.member;
 }
 async function status(){if(!session)return null;try{return(await call('status')).member;}catch(e){if(e.status===401)clear();throw e;}}
 async function verify(email,code){
  const data=await request('/auth/v1/verify',{email:email.trim().toLowerCase(),token:code.trim(),type:'email'});
  if(!data.access_token)throw new Error('email_required');return data.access_token;
 }
 async function closeProof(proof){if(proof)try{await request('/auth/v1/logout?scope=local',{}, {Authorization:'Bearer '+proof});}catch{} }
 async function logout(){try{if(session)await call('logout');}finally{clear();}}
 function destination(value){try{const u=new URL(value||'planner.html',g.location.href);if(u.origin===g.location.origin&&u.pathname===new URL('planner.html',g.location.href).pathname)return 'planner.html'+u.search;}catch{}return 'planner.html';}
 const messages={email_invalid:'이메일 주소를 확인해 주세요.',email_consent_required:'이메일 인증을 위한 개인정보 이용에 동의해 주세요.',
  too_many_attempts:'요청이 여러 번 이어졌습니다. 잠시 후 다시 시도해 주세요.',mail_unavailable:'인증 메일을 보내지 못했습니다. 잠시 후 다시 요청해 주세요.',
  email_required:'이메일 인증이 필요합니다.',fresh_email_required:'인증 시간이 지났습니다. 이메일 인증번호를 다시 받아 주세요.',
  name_invalid:'학생 이름을 30자 이내로 입력해 주세요.',phone_invalid:'보호자 휴대폰 번호를 확인해 주세요.',grade_invalid:'학년 또는 나이를 선택해 주세요.',
  pin_invalid:'로그인 번호는 숫자 8~12자리로 정해 주세요. 같은 숫자 반복이나 단순한 연속 번호는 피해주세요.',
  credentials_invalid:'이메일 또는 로그인 번호가 맞지 않습니다.',consent_required:'필수 동의 내용을 확인해 주세요.',
  login_required:'다시 로그인해 주세요.',member_missing:'가입된 로드맵 회원이 없습니다. 먼저 회원 정보를 등록해 주세요.',
  storage_unavailable:'로그인 저장을 사용할 수 없습니다. 브라우저의 저장 공간 설정을 확인해 주세요.',admin_required:'관리자 계정으로 로그인해 주세요.'};
 const message=e=>messages[e?.message]||(e?.status===429?messages.too_many_attempts:e?.status===401?'인증번호가 맞지 않거나 만료되었습니다. 다시 확인해 주세요.':'연결을 확인한 뒤 다시 시도해 주세요.');
 g.RoadmapMembership={call,accept,status,verify,closeProof,logout,clear,destination,message};
})(window);
