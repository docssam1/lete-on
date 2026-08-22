(function () {
  "use strict";
  const adminSession=HIGHSELECT_AUTH.requireAdmin("../login.html");
  if(!adminSession)return;
  const api=String(HIGHSELECT_RUNTIME.apiBase||"").replace(/\/$/,"");
  const connected=!!api;
  const form=document.getElementById("grant-form"),status=document.getElementById("form-status"),rows=document.getElementById("grant-rows"),empty=document.getElementById("empty");
  document.getElementById("mode-badge").textContent=connected?"운영 API 연결":"운영 서버 필요";
  document.getElementById("mode-badge").className=`badge ${connected?'open':'locked'}`;
  if(!connected){
    document.getElementById("admin-notice").textContent="승인은 운영 서버에서만 저장합니다. 서버가 연결되지 않은 정적 화면에서는 승인 생성·조회·취소가 모두 차단됩니다.";
    Array.from(form.elements).forEach(element=>{element.disabled=true});
    document.getElementById("reload").disabled=true;
    status.className="status error";
    status.textContent="운영 승인 서버가 연결되지 않았습니다.";
  }
  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[character])}
  function exams(){return HIGHSELECT_CATALOG.exams.filter(exam=>exam.visible)}
  document.getElementById("exam-choices").innerHTML=exams().map(exam=>`<label class="check"><input type="checkbox" name="exam" value="${exam.id}"><span><b>${esc(exam.title)}</b><br><small>${esc(exam.scopeLabel)}</small></span></label>`).join("");
  async function request(path,options){if(!connected)throw new Error('운영 승인 서버가 연결되지 않았습니다.');const response=await fetch(api+path,Object.assign({credentials:'include',headers:{'Content-Type':'application/json'}},options||{}));const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.message||'요청을 처리하지 못했습니다.');return data}
  async function list(){return request('/admin/access-grants')}
  async function save(payload){return request('/admin/access-grants',{method:'POST',body:JSON.stringify(payload)})}
  async function revoke(id){return request(`/admin/access-grants/${encodeURIComponent(id)}`,{method:'DELETE'})}
  function examNames(ids){return ids.map(id=>{const exam=exams().find(item=>item.id===id);return exam?exam.title:id})}
  async function render(){if(!connected){rows.innerHTML='';empty.hidden=false;empty.textContent='운영 서버 연결 후 승인 목록을 표시합니다.';return}try{const list=await list();rows.innerHTML=list.map(item=>`<tr><td><b>${esc(item.studentName)}</b></td><td>서버 보관</td><td>${examNames(item.examIds||[]).map(name=>`<span class="badge">${esc(name)}</span>`).join(' ')}</td><td>${esc(item.expiresAt||'없음')}</td><td><button class="ghost" data-revoke="${esc(item.id)}">취소</button></td></tr>`).join('');empty.hidden=list.length>0}catch(error){status.className='status error';status.textContent=error.message}}
  form.addEventListener('submit',async event=>{event.preventDefault();if(!connected)return;const studentName=form.querySelector('#student-name').value.trim(),approvalCode=form.querySelector('#approval-code').value.trim().toUpperCase(),examIds=Array.from(form.querySelectorAll('[name="exam"]:checked')).map(input=>input.value);if(!studentName||!approvalCode||!examIds.length){status.className='status error';status.textContent='이름, 승인번호, 허용 시험을 모두 입력해 주세요.';return}status.className='status';status.textContent='저장 중입니다.';try{await save({studentName,approvalCode,examIds,expiresAt:form.querySelector('#expires-at').value||null});form.reset();status.className='status ok';status.textContent='학생별 시험 권한을 저장했습니다.';render()}catch(error){status.className='status error';status.textContent=error.message}});
  rows.addEventListener('click',async event=>{const button=event.target.closest('[data-revoke]');if(!button)return;if(!confirm('이 승인을 취소할까요?'))return;await revoke(button.dataset.revoke);render()});
  document.getElementById('make-code').onclick=()=>{const bytes=new Uint8Array(3);crypto.getRandomValues(bytes);form.querySelector('#approval-code').value='GF-'+Array.from(bytes).map(value=>(value%36).toString(36).toUpperCase()).join('')+String(Date.now()).slice(-3)};
  document.getElementById('reload').onclick=render;render();
})();
