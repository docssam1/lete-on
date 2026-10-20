(function () {
  "use strict";
  const adminSession=HIGHSELECT_AUTH.requireAdmin("../login.html");
  if(!adminSession)return;
  const api=String(HIGHSELECT_RUNTIME.apiBase||"").replace(/\/$/,"");
  const connected=!!api;
  const form=document.getElementById("grant-form"),status=document.getElementById("form-status"),rows=document.getElementById("grant-rows"),empty=document.getElementById("empty"),saveButton=document.getElementById("save-grant"),cancelEdit=document.getElementById("cancel-edit");
  const bankPanel=document.getElementById("bank-access-panel"),bankForm=document.getElementById("bank-access-form"),bankPlan=document.getElementById("bank-plan"),bankTargets=document.getElementById("bank-target-choices"),bankStatus=document.getElementById("bank-access-status");
  const academyNames={SH:'황소',DP:'돌파',WM:'원수학',ED:'이든',DG:'깊은생각',SM:'생수'},semesterNames={'M1-1':'중1-1','M1-2':'중1-2','M2-1':'중2-1','M2-2':'중2-2','M3-1':'중3-1','M3-2':'중3-2',CM1:'공통수학1',CM2:'공통수학2'},planNames={basic:'기본',plus:'확장'};
  let editingId=null,currentGrants=[],bankOptions=null,bankOwner=null;
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
  async function request(path,options){if(!connected)throw new Error('운영 승인 서버가 연결되지 않았습니다.');const response=await fetch(api+path,Object.assign({credentials:'include',headers:{'Content-Type':'application/json'}},options||{}));const data=await response.json().catch(()=>({}));if(!response.ok){const error=new Error(data.message||'요청을 처리하지 못했습니다.');error.status=response.status;throw error}return data}
  async function list(){return request('/admin/access-grants')}
  async function save(payload,id){return request(id?`/admin/access-grants/${encodeURIComponent(id)}`:'/admin/access-grants',{method:id?'PUT':'POST',headers:{'Content-Type':'application/json','X-Highselect-Admin':'1'},body:JSON.stringify(payload)})}
  async function revoke(id){return request(`/admin/access-grants/${encodeURIComponent(id)}`,{method:'DELETE',headers:{'Content-Type':'application/json','X-Highselect-Admin':'1'}})}
  function examNames(ids){return ids.map(id=>{const exam=exams().find(item=>item.id===id);return exam?exam.title:id})}
  function resetForm(){editingId=null;form.reset();saveButton.textContent='신규 승인 저장';cancelEdit.hidden=true}
  async function render(){if(!connected){rows.innerHTML='';empty.hidden=false;empty.textContent='운영 서버 연결 후 승인 목록을 표시합니다.';return}try{currentGrants=await list();rows.innerHTML=currentGrants.map(item=>`<tr><td><b>${esc(item.studentName)}</b></td><td>서버 보관</td><td>${examNames(item.examIds||[]).map(name=>`<span class="badge">${esc(name)}</span>`).join(' ')}</td><td>${esc(item.expiresAt||'없음')}</td><td><button class="ghost" data-library="${esc(item.id)}">문제은행</button> <button class="ghost" data-edit="${esc(item.id)}">수정</button> <button class="ghost" data-revoke="${esc(item.id)}">취소</button></td></tr>`).join('');empty.hidden=currentGrants.length>0}catch(error){status.className='status error';status.textContent=error.message}}
  function planHelp(){const plan=(bankOptions&&bankOptions.plans||[]).find(item=>item.planId===bankPlan.value);document.getElementById('bank-plan-help').textContent=plan?`저장 ${plan.maxSavedExamCount}개 · 최근 ${plan.maxRecentExamCount}개 · 임시 ${plan.temporaryRetentionDays}일`:'이용권을 선택해 주세요.'}
  function renderBankOptions(access){
    bankPlan.innerHTML=bankOptions.plans.map(plan=>`<option value="${esc(plan.planId)}">${esc(planNames[plan.planId]||plan.planId)}</option>`).join('');
    bankPlan.value=access&&access.plan?access.plan.planId:bankOptions.plans[0].planId;planHelp();
    const academyTargets=bankOptions.targets.filter(target=>target.generationMode==='academy_prep');
    const academies=Array.from(new Set(academyTargets.map(target=>target.academyId)));
    bankTargets.innerHTML=academies.map(academyId=>`<fieldset class="bank-target-group" data-academy="${esc(academyId)}"><legend>${esc(academyNames[academyId]||academyId)}</legend><label class="check academy-all"><input type="checkbox" data-academy-all="${esc(academyId)}"><span><b>이 학원 전체</b><br><small>추가되는 학기도 포함</small></span></label>${academyTargets.filter(target=>target.academyId===academyId).map(target=>`<label class="check"><input type="checkbox" data-academy-semester="${esc(academyId)}" value="${esc(target.semesterId)}"><span>${esc(semesterNames[target.semesterId]||target.semesterId)}</span></label>`).join('')}</fieldset>`).join('');
    const entitlements=access?access.entitlements||[]:[];
    document.getElementById('bank-all-learning').checked=entitlements.some(item=>item.kind==='all_learning');
    academies.forEach(academyId=>{
      const all=entitlements.some(item=>item.kind==='academy_all'&&item.academyId===academyId),group=bankTargets.querySelector(`[data-academy="${academyId}"]`);
      group.querySelector('[data-academy-all]').checked=all;
      group.querySelectorAll('[data-academy-semester]').forEach(input=>{input.checked=!all&&entitlements.some(item=>item.kind==='academy_semester'&&item.academyId===academyId&&item.semesterId===input.value);input.disabled=all;});
    });
  }
  async function openBankAccess(item){
    bankOwner=item;bankPanel.hidden=false;document.getElementById('bank-student-name').textContent=`${item.studentName} 학생`;bankStatus.className='status';bankStatus.textContent='문제은행 이용 범위를 불러오는 중입니다.';
    try{
      if(!bankOptions)bankOptions=await request('/admin/user-exam-library/options');
      let access=null;try{access=await request(`/admin/user-exam-library/users/${encodeURIComponent(item.id)}`)}catch(error){if(error.status!==404)throw error}
      renderBankOptions(access);bankStatus.textContent=access?'현재 설정을 불러왔습니다.':'아직 문제은행 권한이 없습니다. 이용권과 범위를 골라 저장하세요.';bankPanel.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(error){bankStatus.className='status error';bankStatus.textContent=error.message}
  }
  function closeBankAccess(){bankOwner=null;bankPanel.hidden=true;bankForm.reset();bankTargets.innerHTML='';bankStatus.textContent=''}
  form.addEventListener('submit',async event=>{event.preventDefault();if(!connected)return;const studentName=form.querySelector('#student-name').value.trim(),approvalCode=form.querySelector('#approval-code').value.trim().toUpperCase(),examIds=Array.from(form.querySelectorAll('[name="exam"]:checked')).map(input=>input.value);if(!studentName||!approvalCode||!examIds.length){status.className='status error';status.textContent='이름, 승인번호, 허용 시험을 모두 입력해 주세요.';return}status.className='status';status.textContent='저장 중입니다.';try{await save({studentName,approvalCode,examIds,expiresAt:form.querySelector('#expires-at').value||null},editingId);const wasEditing=!!editingId;resetForm();status.className='status ok';status.textContent=wasEditing?'학생별 시험 권한을 수정했습니다.':'학생별 시험 권한을 저장했습니다.';render()}catch(error){status.className='status error';status.textContent=error.message}});
  rows.addEventListener('click',async event=>{const libraryButton=event.target.closest('[data-library]');if(libraryButton){const item=currentGrants.find(grant=>grant.id===libraryButton.dataset.library);if(item)openBankAccess(item);return}const editButton=event.target.closest('[data-edit]');if(editButton){const item=currentGrants.find(grant=>grant.id===editButton.dataset.edit);if(!item)return;editingId=item.id;form.querySelector('#student-name').value=item.studentName;form.querySelector('#approval-code').value='';form.querySelector('#expires-at').value=item.expiresAt||'';form.querySelectorAll('[name="exam"]').forEach(input=>{input.checked=(item.examIds||[]).includes(input.value)});saveButton.textContent='승인 수정 저장';cancelEdit.hidden=false;status.className='status';status.textContent='새 승인번호를 입력하면 기존 로그인 세션이 즉시 종료됩니다.';form.querySelector('#approval-code').focus();return}const button=event.target.closest('[data-revoke]');if(!button)return;if(!confirm('이 승인을 취소할까요?'))return;try{await revoke(button.dataset.revoke);if(editingId===button.dataset.revoke)resetForm();if(bankOwner&&bankOwner.id===button.dataset.revoke)closeBankAccess();status.className='status ok';status.textContent='승인을 취소했습니다.';render()}catch(error){status.className='status error';status.textContent=error.message}});
  bankPlan.addEventListener('change',planHelp);
  bankTargets.addEventListener('change',event=>{const all=event.target.closest('[data-academy-all]');if(!all)return;bankTargets.querySelectorAll(`[data-academy-semester="${all.dataset.academyAll}"]`).forEach(input=>{input.disabled=all.checked;if(all.checked)input.checked=false})});
  bankForm.addEventListener('submit',async event=>{event.preventDefault();if(!bankOwner)return;const entitlements=[];if(document.getElementById('bank-all-learning').checked)entitlements.push({kind:'all_learning'});bankTargets.querySelectorAll('.bank-target-group').forEach(group=>{const academyId=group.dataset.academy,all=group.querySelector('[data-academy-all]');if(all.checked){entitlements.push({kind:'academy_all',academyId});return}group.querySelectorAll('[data-academy-semester]:checked').forEach(input=>entitlements.push({kind:'academy_semester',academyId,semesterId:input.value}))});bankStatus.className='status';bankStatus.textContent='문제은행 권한을 저장하는 중입니다.';try{await request(`/admin/user-exam-library/users/${encodeURIComponent(bankOwner.id)}`,{method:'PUT',headers:{'Content-Type':'application/json','X-Highselect-Admin':'1'},body:JSON.stringify({planId:bankPlan.value,entitlements})});bankStatus.className='status ok';bankStatus.textContent='문제은행 이용권과 학원·학기 범위를 저장했습니다.'}catch(error){bankStatus.className='status error';bankStatus.textContent=error.message}});
  document.getElementById('close-bank-access').onclick=closeBankAccess;document.getElementById('cancel-bank-access').onclick=closeBankAccess;
  cancelEdit.onclick=()=>{resetForm();status.className='status';status.textContent='수정을 취소했습니다.'};
  document.getElementById('make-code').onclick=()=>{const bytes=new Uint8Array(3);crypto.getRandomValues(bytes);form.querySelector('#approval-code').value='GF-'+Array.from(bytes).map(value=>(value%36).toString(36).toUpperCase()).join('')+String(Date.now()).slice(-3)};
  document.getElementById('reload').onclick=render;render();
})();
