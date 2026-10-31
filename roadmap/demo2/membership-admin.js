(function(){
 'use strict';
 const A=GFIELD_FIELDS_ADMIN_AUTH,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let page=0,query='',busy=false;
 const date=s=>s?new Date(s).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'—';
 const level=m=>m.school==='preschool'?`${m.age}세`:({elementary:'초',middle:'중',high:'고'}[m.school]||'')+m.grade;
 function status(text,error=false){$('adminStatus').textContent=text;$('adminStatus').style.color=error?'#a13d50':'#557051';}
 async function run(fn){if(busy)return;busy=true;try{await fn();}catch(e){status(e.status===403?'회원 조회 권한이 없습니다. 관리자 계정을 확인해 주세요.':e.status===401?'관리자 로그인이 필요합니다.':'요청을 처리하지 못했습니다. 연결을 확인해 주세요.',true);if(e.status===401){$('adminLogin').hidden=false;$('adminMembers').hidden=true;}}finally{busy=false;}}
 async function list(){
  status('회원 목록을 확인하고 있습니다.');
  const data=await A.functionCall('roadmap-members',{action:'admin-list',page,query});
  $('adminLogin').hidden=true;$('adminMembers').hidden=false;$('adminLogout').hidden=false;
  $('adminCount').textContent=`전체 ${data.count}명 · ${page+1}페이지`;
  $('adminRows').innerHTML=data.members.length?data.members.map(m=>`<tr><td>${esc(m.student_name)}</td><td>${esc(level(m))}</td><td>${esc(m.email)}</td><td>${esc(m.guardian_phone)}</td><td>${esc(date(m.email_verified_at))}</td><td>${m.marketing_email?'동의':'미동의'}</td><td>${m.marketing_sms?'동의':'미동의'}</td><td>${esc(date(m.created_at))}</td><td><button data-id="${esc(m.user_id)}">상세 보기</button></td></tr>`).join(''):'<tr><td colspan="9">해당하는 회원이 없습니다.</td></tr>';
  $('adminPrev').disabled=page===0;$('adminNext').disabled=(page+1)*30>=data.count;status('');
 }
 $('adminLoginForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);run(async()=>{await A.signIn(f.get('name'),f.get('code'));e.target.elements.code.value='';await list();});};
 $('adminSearch').onsubmit=e=>{e.preventDefault();query=new FormData(e.target).get('query').trim();page=0;run(list);};
 $('adminPrev').onclick=()=>{if(page){page--;run(list);}};$('adminNext').onclick=()=>{page++;run(list);};
 $('adminLogout').onclick=()=>run(async()=>{await A.signOut();$('adminMembers').hidden=true;$('adminLogin').hidden=false;$('adminLogout').hidden=true;$('adminRows').replaceChildren();$('adminDetailBody').replaceChildren();status('로그아웃했습니다.');});
 const labels={privacy:'개인정보 수집·이용',guardian:'법정대리인 동의',marketing_email:'이메일 광고 수신·이용',marketing_sms:'문자 광고 수신·이용'};
 $('adminRows').onclick=e=>{const b=e.target.closest('[data-id]');if(!b)return;run(async()=>{
  const d=await A.functionCall('roadmap-members',{action:'admin-detail',userId:b.dataset.id}),m=d.member;
  $('adminDetailBody').innerHTML=`<dl><dt>학생</dt><dd>${esc(m.student_name)} · ${esc(level(m))}</dd><dt>보호자 이메일</dt><dd>${esc(m.email)}</dd><dt>보호자 휴대폰</dt><dd>${esc(m.guardian_phone)}</dd><dt>이메일 인증</dt><dd>${esc(date(m.email_verified_at))}</dd><dt>최근 회원 정보 수정</dt><dd>${esc(date(m.updated_at))}</dd></dl><h3>동의 변경 이력</h3><ul>${(d.events||[]).map(x=>`<li><b>${labels[x.kind]||esc(x.kind)} · ${x.agreed?'동의':'미동의·철회'}</b><br>${esc(date(x.recorded_at))}<small>${esc(x.version)}</small></li>`).join('')}</ul>`;
  $('adminDetail').showModal();
 });};
 $('detailClose').onclick=()=>{$('adminDetail').close();$('adminDetailBody').replaceChildren();};
 run(async()=>{if(await A.getSession())await list();});
})();
