(async function(){'use strict';
 const access=window.HFChallengeAccess,kind=document.body.dataset.documentKind,content=document.querySelector('main'),round=document.getElementById('round');
 const style=document.createElement('style');style.textContent='body[data-document-kind] main[hidden]{display:none!important}@media print{#documentAccessStatus{display:none!important}}';document.head.appendChild(style);
 const notice=document.createElement('p');notice.id='documentAccessStatus';notice.setAttribute('role','status');notice.style.cssText='padding:18px 24px;background:white;margin:0;color:#264562';content.before(notice);
 const requested=new URLSearchParams(location.search).get('round');if([...round.options].some(o=>o.value===requested))round.value=requested;
 const key=()=>`challenge-${kind}-${round.value}`;
 function paint(){const allowed=access.allow(key());content.hidden=!allowed;document.querySelectorAll('button,input').forEach(el=>{if(!el.closest('main'))el.disabled=!allowed;});for(const option of round.options)option.disabled=!access.allow(`challenge-${kind}-${option.value}`);notice.textContent=allowed?(access.isTeacherPreview()?'교사용 로컬 미리보기 · 학생 이름은 승인된 계정에서만 표시됩니다.':access.approvedStudentName()+' 학생의 승인 자료'):'이 자료의 이용 권한을 확인하지 못했습니다. 하이퍼 포커스 홈에서 로그인 상태를 확인하세요.';}
 function clearProtected(){content.replaceChildren();window.HFConceptBook=null;const name=document.getElementById('studentName');if(name)name.value='승인 학생 없음';}
 window.addEventListener('hfchallengeaccesschange',()=>{paint();if(!access.allow(key()))clearProtected();else start().catch(()=>{clearProtected();notice.textContent='자료를 불러오지 못했습니다. 다시 열어 주세요.';});});
 window.addEventListener('beforeprint',()=>{paint();if(!access.allow(key()))clearProtected();});
 let initialized=false,loading=false;const loaded=new Set();
 const teacher=access.isTeacherPreview();
 const scripts=teacher?['balance-diagram.js','concept-replacement-specials.js','exam-replacements.js','exam-editions.js','exam-priority.js','exam-more.js','challenge-bank.js','exam-supplement.js']:['content-client.js?v=20260910a','secure-document.js'];
 if(teacher){if(kind==='concept')scripts.push('variant-numeric-extension.js','variant-geometry-extension.js','variant-replacement-measurement.js','variant-replacement-spatial.js','variant-replacement-paths.js','variant-core-levels.js','variant-provider.js','concept-specials.js','concept-replacement-specials.js','concept-catalog.js','concept-book-plan.js','concepts-two.js');else scripts.push('exam.js');}
 async function start(){paint();if(initialized||loading||!access.allow(key()))return;loading=true;try{for(const src of scripts){if(!access.allow(key()))return;if(loaded.has(src))continue;await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script);});loaded.add(src);}initialized=true;if(!teacher)await window.HFChallengeSecureDocument();}finally{loading=false;paint();}}
 round.addEventListener('change',()=>start().catch(()=>{clearProtected();notice.textContent='자료를 불러오지 못했습니다. 다시 열어 주세요.';}));
 await access.refresh();await start();
})().catch(()=>{const note=document.getElementById('documentAccessStatus');if(note)note.textContent='자료를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.';document.querySelector('main')?.replaceChildren();});
