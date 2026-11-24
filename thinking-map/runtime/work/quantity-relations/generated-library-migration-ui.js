(function(){
 'use strict';const lib=window.GeneratedLibrary;if(!lib)return;
 const dialog=document.createElement('dialog');dialog.id='library-migration';dialog.className='no-print';dialog.setAttribute('aria-labelledby','migration-title');
 dialog.innerHTML='<header><h2 id="migration-title">저장 문항의 변경 확인</h2><button id="migration-close" aria-label="변경 확인 닫기">닫기</button></header><p>새 결과는 같은 조건으로 다시 검산했습니다. 교체하기 전의 기록도 보관합니다.</p><p id="migration-message" role="status" aria-live="polite"></p><div id="migration-comparisons"></div><button id="migration-more" hidden>비교 문항 더 보기</button><label id="migration-replace-row"><input type="checkbox" id="migration-replace" checked>문제지에서도 새 문항으로 교체</label><footer><button id="migration-cancel">나중에 확인</button><button id="migration-apply">확인한 새 문항 저장</button></footer>';
 document.body.append(dialog);let plan=null,limit=10,busy=false;
 const text=v=>typeof v==='string'?v:JSON.stringify(v??'');
 function draw(){
  const comparisons=plan?.result.comparisons||[plan?.result.comparison].filter(Boolean);
  el('migration-comparisons').innerHTML=comparisons.slice(0,limit).map((c,n)=>`<section class="migration-comparison"><h3>${n+1}. ${escape(byType[c.current.proposedTypeId]?.name||c.current.name)}</h3><p>${c.changes.filter(x=>x.changed).map(x=>escape(x.label)).join(' · ')||'문제·답·그림·최소 능력 설명은 같고 검산 버전이 바뀌었습니다.'}</p><div class="migration-columns"><div><h4>이전 기록</h4><p>${escape(text(c.previous.prompt))}</p><details><summary>이전 정답·풀이</summary><pre>${escape(text(c.previous.answer))}\n${escape(text(c.previous.solution))}</pre></details><p class="meta">이전 그림은 실행하지 않고 보관합니다.</p></div><div><h4>새 검산 결과</h4>${problemCard(c.current)}<details><summary>새 정답·풀이</summary><pre>${escape(text(c.current.problem.answer))}\n${escape(text(c.current.problem.solution))}</pre></details></div></div></section>`).join('');
  dialog.querySelectorAll('.card-actions').forEach(e=>e.remove());
  el('migration-more').hidden=comparisons.length<=limit;el('migration-replace-row').hidden=!!plan?.bundle;
  el('migration-apply').textContent=plan?.bundle?`새 검산 문항 ${comparisons.length}개 불러오기`:'확인한 새 문항 저장';
 }
 function open(){limit=10;busy=false;draw();el('migration-message').textContent=plan.result.message||'';el('migration-replace').checked=true;el('migration-apply').disabled=false;if(!dialog.open)dialog.showModal();}
 async function preview(id){
  try{const result=await lib.request('/api/library/migration/preview',{id,revision:lib.revision()});plan={id,result};open();}
  catch(e){el('library-status').textContent=e.message;}
 }
 async function previewFile(bundle){const result=await lib.request('/api/library/migration/file-preview',{bundle,revision:lib.revision()});plan={bundle,result};open();}
 el('migration-apply').onclick=async()=>{
  if(busy||!plan)return;busy=true;el('migration-apply').disabled=true;el('migration-message').textContent='조건과 답을 다시 확인하고 이전 기록을 보관하고 있습니다.';
  try{const p=plan;if(p.bundle)await lib.request('/api/library/migration/file-apply',{bundle:p.bundle,revision:p.result.revision,token:p.result.token});else await lib.request('/api/library/migration/apply',{id:p.id,revision:p.result.revision,token:p.result.token,replaceInWorksheet:el('migration-replace').checked});await lib.refresh();dialog.close();el('library-status').textContent='새 문항을 저장했습니다. 이전 기록도 보관했습니다.';}
  catch(e){el('migration-message').textContent=e.message;}
  finally{busy=false;el('migration-apply').disabled=false;}
 };
 for(const id of['migration-close','migration-cancel'])el(id).onclick=()=>{if(!busy)dialog.close();};dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
 el('migration-more').onclick=()=>{limit+=10;draw();};
 const download=document.createElement('button');download.id='library-recovery-export';download.textContent='이전 기록 포함 보관파일';download.onclick=async()=>{
  try{const bundle=await lib.request('/api/library/recovery'),url=URL.createObjectURL(new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='사고력-이전기록포함-보관파일.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  catch(e){el('library-status').textContent=e.message;}
 };document.querySelector('.library-tools').append(download);
 const css=document.createElement('style');css.textContent='#library-migration{width:min(1050px,calc(100vw - 32px));max-width:calc(100vw - 32px);max-height:85vh;box-sizing:border-box;overflow:auto;border:1px solid #afc2b7;border-radius:12px;padding:22px;color:var(--ink)}#library-migration::backdrop{background:#102b2466}#library-migration header,#library-migration footer{display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap}#library-migration h2{margin:0}#library-migration p{line-height:1.8;overflow-wrap:anywhere}#library-migration button{min-height:44px}#library-migration pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.8}.migration-columns{display:grid;grid-template-columns:1fr 1fr;gap:20px}.migration-columns>div{min-width:0}.migration-comparison{padding:18px 0;border-top:1px solid #d5dfd3}#migration-replace-row{display:block;margin:20px 0;line-height:1.8}#migration-replace-row[hidden]{display:none}#migration-message{color:#9f3028}@media(max-width:650px){.migration-columns{grid-template-columns:1fr}#library-migration{padding:14px}}';document.head.append(css);
 window.GeneratedLibraryMigration={preview,previewFile};
}());
