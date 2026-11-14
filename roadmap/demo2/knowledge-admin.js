// 상담 지식 관리(원장님 2026-11-13). 회원 관리와 같은 관리자 로그인을 쓴다. AI 초안은 '승인' 항목만 읽는다.
(function(){
 'use strict';
 const A=GFIELD_FIELDS_ADMIN_AUTH,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KIND={knowhow:'원장님 노하우',site:'로드맵 안내',news:'입시·교육 소식',drive:'Drive 자료'};
 const STAGE={all:'전체',preschool:'유아',elementary:'초등',middle:'중등',high:'고등'};
 const ORIGIN={admin:'원장님 작성',seed:'사이트에서 가져옴',drive:'Drive에서 올림',hermes:'소식 수집'};
 const TAB={candidate:'승인 대기',approved:'승인됨',archived:'보관함'};
 let tab='candidate',items=[],busy=false;
 const say=(t,err=false)=>{$('kStatus').textContent=t;$('kStatus').style.color=err?'#a13d50':'#557051';};
 const call=body=>A.functionCall('roadmap-knowledge',body);
 async function run(fn){if(busy)return;busy=true;try{await fn();}catch(e){say(e.status===403?'지식 관리 권한이 없습니다.':e.status===401?'관리자 로그인이 필요합니다.':e.status===409?'기준 자료가 바뀌었습니다. 목록을 새로 불러와 다시 고쳐 주세요.':e.status===400?'입력을 확인해 주세요. 제목 120자, 내용 4000자까지입니다.':'요청을 처리하지 못했습니다. 연결을 확인해 주세요.',true);}finally{busy=false;}}
 function card(r){
  const acts=r.status==='candidate'?[['approved','승인'],['archived','보관']]:r.status==='approved'?[['archived','보관']]:[['approved','다시 승인']];
  return `<li class="k-item"><div class="k-meta"><span class="k-kind">${esc(KIND[r.kind]||r.kind)}</span><span>${esc(STAGE[r.stage]||r.stage)}</span><span>${esc(ORIGIN[r.origin]||r.origin)}</span>${r.checked_on?`<span>확인 ${esc(r.checked_on)}</span>`:''}</div><h3>${esc(r.title)}</h3><p class="k-body">${esc(r.body)}</p>${r.source?`<p class="k-source">출처 · ${esc(r.source)}</p>`:''}<div class="k-actions"><button type="button" data-edit="${esc(r.id)}">고치기</button>${acts.map(([s,l])=>`<button type="button" data-id="${esc(r.id)}" data-status="${s}">${l}</button>`).join('')}</div></li>`;
 }
 async function list(){
  say('지식 목록을 불러오고 있습니다.');
  const d=await call({action:'list',status:tab});items=d.items||[];
  document.querySelectorAll('[data-tab]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.tab===tab));b.textContent=TAB[b.dataset.tab]+' '+(d.counts?.[b.dataset.tab]??0);});
  $('kList').innerHTML=items.length?items.map(card).join(''):`<li class="k-empty">${tab==='candidate'?'승인을 기다리는 항목이 없습니다.':'항목이 없습니다.'}</li>`;
  say('');
 }
 function edit(r){
  const f=$('kForm');f.reset();f.elements.id.value=r?.id||'';
  for(const k of ['kind','stage','title','body','source'])if(r)f.elements[k].value=r[k]||'';
  f.elements.checkedOn.value=r?.checked_on||new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date());
  $('kFormTitle').textContent=r?'지식 고치기':'새 노하우 쓰기';$('kDialog').showModal();f.elements.title.focus();
 }
 document.addEventListener('roadmap-admin-ready',()=>{$('adminKnowledge').hidden=false;run(list);});
 document.addEventListener('roadmap-knowledge-imported',()=>{tab='candidate';run(list);});
 document.addEventListener('roadmap-admin-signed-out',()=>{$('adminKnowledge').hidden=true;$('kList').replaceChildren();});
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;run(list);});
 $('kNew').onclick=()=>edit(null);
 $('kCancel').onclick=()=>$('kDialog').close();
 $('kList').onclick=e=>{
  const ed=e.target.closest('[data-edit]');if(ed){edit(items.find(r=>r.id===ed.dataset.edit));return;}
  const b=e.target.closest('[data-status]');if(!b)return;
  run(async()=>{await call({action:'status',id:b.dataset.id,status:b.dataset.status});await list();say(b.dataset.status==='approved'?'승인했습니다. 다음 상담부터 반영됩니다.':'옮겼습니다.');});
 };
 $('kForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),id=f.get('id')||null;
  run(async()=>{await call({action:'save',id,entry:{kind:f.get('kind'),stage:f.get('stage'),title:f.get('title'),body:f.get('body'),source:f.get('source'),checkedOn:f.get('checkedOn')||null}});
   $('kDialog').close();tab='candidate';await list();say('후보로 저장했습니다. 내용을 확인하고 승인하면 다음 상담부터 반영됩니다.');});
 };
})();
