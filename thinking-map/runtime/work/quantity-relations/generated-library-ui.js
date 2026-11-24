(function(){
 'use strict';if(!window.SomaVariants)return;
 const local=location.protocol==='http:'&&['127.0.0.1','localhost'].includes(location.hostname);
 const state={ready:false,revision:0,items:[],doc:{title:'',arrangement:'manual'},error:'',message:'저장한 문제를 읽고 있습니다.',restoring:false,stopped:false};
 const section=document.createElement('section');section.id='generated-library';section.className='generated-library no-print';
 section.innerHTML='<header><h2>저장한 문제 <span id="library-count">0</span></h2><p>입력 조건으로 만든 유사문제와 정답·풀이를 보관합니다. 교재 원본은 기존 위치에서 확인할 수 있습니다.</p></header><div class="library-tools"><button id="library-reload">저장본 다시 읽기</button><button id="library-export-all">은행 전체 저장파일</button><label class="library-file">저장파일 불러오기<input id="library-import" type="file" accept="application/json,.json"></label></div><p id="library-status" role="status" aria-live="polite"></p><div class="library-filters"><label>저장 문항 검색<input id="library-query" type="search" placeholder="유형·책·단원·문제번호·교과 단원"></label><label>난도<select id="library-band"><option value="">전체</option><option value="pending">확인 중</option><option value="1">후보 1</option><option value="2">후보 2</option><option value="3">후보 3</option><option value="4">후보 4</option><option value="5">후보 5</option></select></label></div><div id="library-results"></div>';
 document.querySelector('.basket').after(section);
 const toolbar=document.createElement('div');toolbar.className='worksheet-tools no-print';
 toolbar.innerHTML='<label>문제지 제목<input id="worksheet-title" maxlength="80" placeholder="예: 도형과 수의 관계"></label><label>배열 방법<select id="worksheet-arrangement"><option value="manual">담은 순서</option><option value="domain">영역·유형 순서 / 난도 높은 순</option><option value="difficulty">난도 높은 순 / 확인 중은 뒤</option><option value="spiral">유형을 번갈아 배치</option></select></label><button id="worksheet-arrange">배열 적용</button><button id="worksheet-export">선택 문항 저장파일</button><p id="worksheet-save-status" role="status" aria-live="polite"></p>';
 document.querySelector('.basket-head').after(toolbar);
 const printTitle=document.createElement('h2');printTitle.className='worksheet-print-title no-print';document.getElementById('basket').before(printTitle);
 let sequence=Promise.resolve(),timer=null,lastConfirmed='',limit=20;
 const serialized=()=>JSON.stringify({ids:[...selected],title:state.doc.title,arrangement:state.doc.arrangement});
 const enqueue=fn=>{const result=sequence.then(fn);sequence=result.catch(()=>{});return result;};
 const saved=id=>state.items.find(i=>i.id===id&&i.state==='ready');
 async function request(path,body){const r=await fetch(path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(!r.ok){const error=new Error(d.error||'저장하지 못했습니다. 실행 화면과 보관 파일을 확인해 주세요.');error.status=r.status;throw error;}return d;}
 function fail(error){state.error=error.message||'저장하지 못했습니다. 실행 화면을 확인해 주세요.';state.stopped=true;showStatus();}
 function showStatus(){
  el('library-status').textContent=state.error||state.message;el('library-status').classList.toggle('library-error',!!state.error);
  el('worksheet-save-status').textContent=!local?'문항 저장·불러오기는 Mac 실행 화면에서 사용할 수 있습니다.':state.error||(!state.ready?'저장본을 읽고 있습니다.':lastConfirmed===serialized()?'문항과 문제지 순서를 저장했습니다.':'문항과 문제지 순서를 저장하고 있습니다.');
  for(const id of['library-reload','library-export-all','library-import','worksheet-export'])el(id).disabled=!local||(!state.ready&&id!=='library-reload');
 }
 async function saveOne(sample){
  const result=await request('/api/library/items',{typeId:sample.proposedTypeId,parameters:sample.generationParameters});state.revision=result.revision;
  const at=state.items.findIndex(i=>i.id===result.item.id);if(at<0)state.items.push(result.item);else state.items[at]=result.item;
  state.message=result.duplicate?'이미 저장한 같은 문항을 열었습니다.':'문항과 정답·풀이를 저장했습니다.';if(!state.stopped)state.error='';drawLibrary();return result;
 }
 function flush(){return enqueue(async()=>{
  if(!state.ready||state.restoring||state.stopped||lastConfirmed===serialized())return;
  const doc={ids:[...selected],...state.doc},signature=JSON.stringify(doc);
  for(const s of selectedExamples())if((s.somaParameterGenerated||s.nativeParameterGenerated)&&!saved(s.instanceId))await saveOne(s);
  const result=await request('/api/library/worksheet',{revision:state.revision,worksheet:doc});state.revision=result.revision;lastConfirmed=signature;state.error='';showStatus();
  if(lastConfirmed!==serialized())schedule();
 });}
 function schedule(){if(!local||!state.ready||state.restoring||state.stopped)return;clearTimeout(timer);if(lastConfirmed===serialized()){showStatus();return;}showStatus();timer=setTimeout(()=>flush().catch(fail),250);}
 function replaceSelection(ids){selected.clear();for(const id of ids)selected.add(id);}
 async function readSaved(merge=false){
  const d=await request('/api/library');state.restoring=true;
  try{
   state.items=d.items;state.revision=d.revision;state.doc={title:d.worksheet.title,arrangement:d.worksheet.arrangement};
   SomaVariants.registerStored(d.items.filter(i=>i.state==='ready'&&i.example.somaParameterGenerated).map(i=>i.example));
   window.NativeRuntime?.registerStored(d.items.filter(i=>i.state==='ready'&&i.example.nativeParameterGenerated).map(i=>i.example));
   const known=new Set([...DATA.specimens,...(DATA.providerSpecimens||[]),...(DATA.normalizationExamples||[]),...DATA.somaGeneratedVariants,...(DATA.runtimeGeneratedExamples||[])].map(s=>s.instanceId));
   const restored=d.worksheet.ids.filter(id=>known.has(id)||d.items.some(i=>i.id===id));
   replaceSelection([...new Set([...restored,...(merge?[...selected]:[])])]);el('answers').checked=false;
   el('worksheet-title').value=state.doc.title;el('worksheet-arrangement').value=state.doc.arrangement;
   state.ready=true;state.stopped=false;state.error='';lastConfirmed=serialized();
   state.message=d.items.some(i=>i.state!=='ready')?'변경 확인이 필요한 문항은 문제지 순서를 보존하고 출력을 보류합니다. 이전 문항과 새 문항을 비교해 주세요.':`저장 문항 ${d.items.length}개와 문제지 ${restored.length}문항을 읽었습니다.`;
   render();drawLibrary();
  }finally{state.restoring=false;showStatus();}
 }
 function sourceInfo(sample){
  const f=DATA.somaConstrainedGeneration.families.find(f=>f.typeId===sample.proposedTypeId);
  const sources=(f?.sourceItemIds||sample.sourceItemIds||[]).map(id=>DATA.sourceRecords.find(r=>r.id===id)).filter(Boolean);
  const curriculum=QuantitySearch.curriculumLinks(sample.proposedTypeId);
  return{sources,curriculum};
 }
 function drawLibrary(){
  const query=el('library-query').value.trim().toLocaleLowerCase(),band=el('library-band').value;
  let rows=state.items.filter(i=>i.state==='ready');el('library-count').textContent=rows.length;
  rows=rows.filter(i=>{const s=i.example,info=sourceInfo(s),text=[s.name,s.problem.prompt,...s.normalization.minimumCapabilities,...info.sources.map(QuantitySearch.position),...info.curriculum.map(c=>c.semester+' '+c.unit)].join(' ').toLocaleLowerCase();return(!query||text.includes(query))&&(!band||(band==='pending'?studentDifficultyBand(s)==null:studentDifficultyBand(s)===Number(band)));});
  const warnings=state.items.filter(i=>i.state!=='ready').map(i=>`<div class="library-error"><p>${escape(i.typeId||'문항')} · ${escape(i.message)}</p>${i.state==='version-changed'?`<button data-library-compare="${escape(i.id)}">이전 문항과 비교</button>`:''}</div>`).join('');
  el('library-results').innerHTML=warnings+(rows.length?rows.slice(0,limit).map(i=>{const s=i.example,info=sourceInfo(s);return`<div class="saved-question" data-saved-id="${escape(i.id)}"><p class="meta">생성한 유사문제 · 저장됨</p>${problemCard(s)}<details><summary>연계 교재·단원·문제번호와 교과 연결</summary>${info.sources.map(r=>`<p>${escape(QuantitySearch.position(r))}</p>`).join('')}${info.curriculum.map(c=>`<p>${escape(c.semester)} · ${escape(c.unit)} · ${c.relationship==='later-use'?'후속 활용':'교과 연계'}</p>`).join('')}<p>원문과 조건·난도가 같은지는 별도 확인합니다.</p></details><button data-library-open="${escape(i.id)}">조건과 연결 지도 보기</button></div>`;}).join('')+(rows.length>limit?'<button id="library-more">더 보기</button>':''):'<p class="empty">저장한 문항이 없습니다. 조건으로 만든 문제의 ‘문항 저장’을 누르거나 문제지에 담아 주세요.</p>');
  bindItems(el('library-results'));
  for(const b of section.querySelectorAll('[data-library-compare]'))b.onclick=()=>window.GeneratedLibraryMigration?.preview(b.dataset.libraryCompare);
  for(const b of section.querySelectorAll('[data-library-open]'))b.onclick=()=>{const s=saved(b.dataset.libraryOpen)?.example;if(s){if(s.nativeParameterGenerated){NativeRuntime.show(s);}else{SomaVariants.open(s.proposedTypeId);SomaVariants.addGenerated(s);}}};
  const more=el('library-more');if(more)more.onclick=()=>{limit+=20;drawLibrary();};showStatus();
 }
 const familyOrder=new Map(),typeOrder=new Map();for(const t of DATA.types){if(!familyOrder.has(t.family))familyOrder.set(t.family,familyOrder.size);typeOrder.set(t.id,typeOrder.size);}
 function arrange(items,method){
  const rank=s=>studentDifficultyBand(s)==null?-1:studentDifficultyBand(s),domain=s=>familyOrder.get(byType[s.proposedTypeId]?.family)??999;
  const compare=(a,b)=>domain(a)-domain(b)||(typeOrder.get(a.proposedTypeId)??9999)-(typeOrder.get(b.proposedTypeId)??9999)||rank(b)-rank(a);
  if(method==='difficulty')return items.slice().sort((a,b)=>rank(b)-rank(a));
  if(method==='domain')return items.slice().sort(compare);
  if(method==='spiral'){
   const buckets=new Map();for(const s of items.slice().sort(compare)){if(!buckets.has(s.proposedTypeId))buckets.set(s.proposedTypeId,[]);buckets.get(s.proposedTypeId).push(s);}
   const result=[];while([...buckets.values()].some(a=>a.length))for(const values of buckets.values())if(values.length)result.push(values.shift());return result;
  }return items;
 }
 function enhanceBasket(){
  const items=selectedExamples();printTitle.textContent=state.doc.title||'사고력 문제지';printTitle.hidden=!items.length;
  [...el('basket').children].forEach((card,index)=>{
   const s=items[index];if(!s)return;card.dataset.instanceId=s.instanceId;
   if(index===0){const heading=document.createElement('h2');heading.className='worksheet-in-card-title';heading.textContent=state.doc.title||'사고력 문제지';card.prepend(heading);}
   const controls=document.createElement('div');controls.className='worksheet-order no-print';
   for(const[delta,label]of[[-1,'위로'],[1,'아래로']]){const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-label',`${index+1}번 문제 ${label}`);b.disabled=index+delta<0||index+delta>=items.length;b.onclick=()=>{const ids=[...selected],to=index+delta;[ids[index],ids[to]]=[ids[to],ids[index]];state.doc.arrangement='manual';el('worksheet-arrangement').value='manual';replaceSelection(ids);render();};controls.append(b);}
   card.querySelector('.card-actions').append(controls);
  });
 }
 const priorSelectedExamples=selectedExamples;selectedExamples=function(){const held=new Set(state.items.filter(i=>i.state!=='ready').map(i=>i.id));return priorSelectedExamples().filter(s=>!held.has(s.instanceId));};
 const prior=render;render=function(){prior();enhanceBasket();if(state.ready)drawLibrary();schedule();};
 function addSaveButton(){
  const form=el('soma-parameter-form'),sample=SomaVariants.currentExample();if(!form||!sample?.somaParameterGenerated)return;
  const b=document.createElement('button');b.type='button';b.id='library-save-current';b.textContent=saved(sample.instanceId)?'저장한 문항':'문항 저장';b.disabled=!local||!state.ready;
  b.onclick=()=>enqueue(async()=>{await saveOne(sample);SomaVariants.refresh();showStatus();}).catch(fail);form.querySelector('.variant-controls').append(b);
 }
 window.addEventListener('soma-variant-refreshed',addSaveButton);
 document.addEventListener('click',e=>{if(e.target.closest('[data-item],#clear')){state.doc.arrangement='manual';el('worksheet-arrangement').value='manual';}},true);
 el('worksheet-title').oninput=()=>{state.doc.title=el('worksheet-title').value;printTitle.textContent=state.doc.title||'사고력 문제지';const heading=el('basket').querySelector('.worksheet-in-card-title');if(heading)heading.textContent=printTitle.textContent;schedule();};
 el('worksheet-arrange').onclick=()=>{state.doc.arrangement=el('worksheet-arrangement').value;replaceSelection(arrange(selectedExamples(),state.doc.arrangement).map(s=>s.instanceId));render();};
 el('library-query').oninput=()=>{limit=20;drawLibrary();};el('library-band').onchange=drawLibrary;
 el('library-reload').onclick=()=>enqueue(()=>readSaved()).catch(fail);
 async function download(scope){
  await flush();if(state.stopped)throw new Error(state.error);const bundle=await request('/api/library/export?scope='+scope);
  const url=URL.createObjectURL(new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=scope==='all'?'사고력-저장문항.json':'사고력-선택문항.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 el('library-export-all').onclick=()=>download('all').catch(fail);el('worksheet-export').onclick=()=>download('worksheet').catch(fail);
 el('library-import').onchange=async()=>{
  const file=el('library-import').files[0];if(!file)return;
  try{if(file.size>64*1024*1024)throw new Error('64MB 이하의 JSON 저장파일을 선택해 주세요.');const bundle=JSON.parse(await file.text());await enqueue(async()=>{if(bundle.schema==='gfield-generated-library-recovery/v1'){await GeneratedLibraryMigration.previewFile(bundle);return;}try{await request('/api/library/import',{revision:state.revision,bundle});}catch(error){if(error.status===409){await GeneratedLibraryMigration.previewFile(bundle);return;}throw error;}await readSaved();state.message='문항·정답·풀이와 문제지 순서를 불러왔습니다.';showStatus();});}catch(error){fail(error);}finally{el('library-import').value='';}
 };
 function openLibrary(){const workbench=el('textbook-workbench');if(workbench)workbench.hidden=true;document.body.classList.remove('textbook-items-open');ThinkingCatalog.openSearch();section.scrollIntoView({block:'start'});}
 const top=document.createElement('button');top.id='open-generated-library';top.textContent='저장한 문제';top.onclick=openLibrary;document.querySelector('.controls').append(top);
 function addNav(){const nav=document.querySelector('.item-workbench-head nav');if(!nav||nav.querySelector('#item-open-library'))return;const b=document.createElement('button');b.id='item-open-library';b.textContent='저장한 문제';b.onclick=openLibrary;nav.append(b);}
 addNav();if(el('textbook-workbench'))new MutationObserver(addNav).observe(el('textbook-workbench'),{childList:true,subtree:true});
 const css=document.createElement('style');css.textContent='.generated-library{margin-top:40px;border-top:2px solid var(--green);padding-top:20px}.generated-library header p{line-height:1.7}.library-tools,.library-filters,.worksheet-tools{display:flex;flex-wrap:wrap;gap:12px;align-items:end}.library-filters,.worksheet-tools{margin:16px 0}.library-filters label,.worksheet-tools label{display:grid;gap:6px}.library-filters input,.worksheet-tools input{box-sizing:border-box;min-height:44px;max-width:100%;padding:10px;border:1px solid #afc2b7;border-radius:8px}.library-filters input{width:360px}.library-tools button,.library-file,.worksheet-tools button,.worksheet-order button{min-height:44px}.library-file{display:grid;gap:5px;max-width:100%}.library-file input{max-width:100%}.library-error{color:#9f3028;font-weight:600;line-height:1.7}#library-status,#worksheet-save-status{width:100%;line-height:1.7;color:var(--muted)}.saved-question{padding:18px 0;border-top:1px solid #d6ded4}.saved-question details{line-height:1.8;margin-bottom:14px}.worksheet-order{display:flex;gap:8px}.worksheet-order button:disabled{opacity:.4}.worksheet-print-title{font-size:22px;margin:20px 0}.library-filters select,.worksheet-tools select{max-width:100%}@media(max-width:600px){.library-tools,.library-filters,.worksheet-tools{display:grid;grid-template-columns:minmax(0,1fr)}.library-filters input,.worksheet-tools input{width:100%}.card-actions{flex-wrap:wrap}}@media print{.worksheet-print-title{font-size:18px;margin:0 0 8mm}.worksheet-order{display:none}}';document.head.append(css);
 css.textContent+='.library-file{min-width:0}.library-file input{min-width:0;width:100%;box-sizing:border-box}.worksheet-in-card-title{display:none}@media print{.worksheet-in-card-title{display:block;font-size:18px;margin:0 0 8mm;break-after:avoid-page}}';
 window.GeneratedLibrary={ready:()=>state.ready,flush,arrange,selectedExamples,save:s=>enqueue(()=>saveOne(s)),status:()=>({revision:state.revision,items:state.items.length,error:state.error}),open:openLibrary,request,refresh:()=>enqueue(()=>readSaved()),revision:()=>state.revision,heldIds:()=>state.items.filter(i=>i.state!=='ready').map(i=>i.id)};
 if(local)enqueue(()=>readSaved(true)).catch(fail);else{state.message='저장·불러오기는 Mac 실행 화면에서 사용할 수 있습니다.';showStatus();}
 enhanceBasket();addSaveButton();
 const priorPrint=el('print').onclick;el('print').onclick=()=>{if([...selected].some(id=>state.items.some(i=>i.id===id&&i.state!=='ready'))){state.error='문제지에 변경 확인이 필요한 문항이 있습니다. 먼저 비교해 주세요.';showStatus();return;}priorPrint();};
}());
