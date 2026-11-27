(function(){
 'use strict';if(!DATA.somaConstrainedGeneration)return;
 const pool=DATA.somaGeneratedVariants, families=DATA.somaConstrainedGeneration.families;
 const familyById=new Map(families.map(f=>[f.typeId,f])), byId=new Map(pool.map(s=>[s.instanceId,s]));
 const current=new Map(),seen=new Map();
 const section=document.createElement('section');section.id='soma-variant-panel';section.className='soma-variant-panel no-print';
 el('stats').insertAdjacentHTML('beforeend','<br>소마 44유형 · 확인한 변형 문항 132개');
 el('problems').after(section);
 function permitted(){const band=el('band').value;return pool.filter(s=>s.proposedTypeId===type&&(!band||(band==='pending'?s.commonBandCandidate==null:s.commonBandCandidate===Number(band))));}
 function refresh(){
  const f=familyById.get(type),group=el('book').value;section.hidden=!f||!!group&&group!=='소마';if(section.hidden){section.replaceChildren();return;}
  const choices=permitted();let id=current.get(type);if(!choices.some(s=>s.instanceId===id))id=choices[0]?.instanceId;current.set(type,id);
  if(id){if(!seen.has(type))seen.set(type,new Set());seen.get(type).add(id);}
  const s=byId.get(id),allSeen=choices.every(s=>seen.get(type)?.has(s.instanceId));
  section.innerHTML=`<header><h3>이 유형의 다른 문제</h3><p>확인한 기존 변형 ${f.configurations}개와 입력 조건으로 만든 문항을 고를 수 있습니다. 현재 난도 조건에 맞는 문항은 ${choices.length}개입니다.</p></header><div class="variant-controls"><label for="soma-variant-type">유형</label><select id="soma-variant-type">${families.map(x=>`<option value="${escape(x.typeId)}" ${x.typeId===type?'selected':''}>${escape(x.name)}</option>`).join('')}</select>${s?`<label for="soma-variant-choice">문제</label><select id="soma-variant-choice">${choices.map((x,i)=>`<option value="${escape(x.instanceId)}" ${x.instanceId===id?'selected':''}>${x.somaParameterGenerated?"입력 조건 문항":"변형 "+x.configuration}</option>`).join('')}</select><button id="soma-variant-next" ${allSeen?'disabled':''}>${allSeen?'모두 확인했어요':'다른 문제 보기'}</button>`:''}</div><p class="variant-message" role="status">${s?`${s.somaParameterGenerated?"입력 조건 문항":"현재 변형 "+s.configuration} · 이 유형에서 확인한 문제 ${seen.get(type).size}개`:'이 난도 조건에 맞는 변형이 없습니다. 전체 난도에서 살펴보세요.'}</p>${s?`<p class="meta">${escape(s.normalization.difficultyReason)} 필요한 능력: ${escape(s.normalization.minimumCapabilities.join(' · '))}</p><div id="soma-variant-question">${problemCard(s)}</div><details><summary>연결된 교재·단원과 원본 위치</summary><p>아래 교재의 기존 분석을 바탕으로 만든 유사문제입니다. 원본 문제와 조건·난도가 같은지는 별도 확인합니다.</p>${f.sourceItemIds.map(id=>{const r=DATA.sourceRecords.find(r=>r.id===id);return `<p><button data-preview-source="${escape(id)}" data-reviewed-instance="${escape(f.fixedExampleId)}">${escape(QuantitySearch.position(r))}</button></p>`;}).join('')}</details>`:''}`;
  el('soma-variant-type').onchange=e=>open(e.target.value);
  if(s){el('soma-variant-choice').onchange=e=>{current.set(type,e.target.value);refresh();};el('soma-variant-next').onclick=()=>{const next=choices.find(s=>!seen.get(type)?.has(s.instanceId));if(next)current.set(type,next.instanceId);refresh();};bindItems(el('soma-variant-question'));}
 }
 function open(tid){
  if(!familyById.has(tid))return;
  document.getElementById('preview-close')?.click();document.getElementById('item-open-map')?.click();
  document.getElementById('open-research')?.click();type=tid;el('type').value=tid;el('book').value='';el('band').value='';render();section.scrollIntoView({block:'start'});
 }
 const prior=render;render=function(){prior();refresh();};
 for(const id of ['answers','band','book'])el(id).onchange=()=>render();
 function addEntry(){const nav=document.querySelector('.item-workbench-head nav');if(!nav||nav.querySelector('#open-soma-variants'))return;const b=document.createElement('button');b.id='open-soma-variants';b.textContent='유형별 새 문제';b.onclick=()=>open(familyById.has(type)?type:'UA37');nav.append(b);}
 addEntry();const workbench=document.getElementById('textbook-workbench');if(workbench)new MutationObserver(addEntry).observe(workbench,{childList:true,subtree:true});
 // A fixed example in an original/similar preview can lead to its checked variants.
 const preview=document.getElementById('question-preview');
 if(preview)new MutationObserver(()=>{const problem=preview.querySelector('.preview-problem');if(!problem||preview.querySelector('[data-open-soma-variants]'))return;const f=families.find(f=>f.fixedExampleId===problem.dataset.instanceId);if(!f)return;const b=document.createElement('button');b.dataset.openSomaVariants=f.typeId;b.textContent='이 유형의 다른 문제 보기';b.onclick=()=>open(f.typeId);problem.after(b);}).observe(preview,{childList:true,subtree:true});
 const css=document.createElement('style');css.textContent='.soma-variant-panel{border-top:3px solid var(--green);padding-top:20px;margin-top:30px;scroll-margin-top:24px}.soma-variant-panel header h3{margin:0 0 8px}.soma-variant-panel header p{line-height:1.7}.variant-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.variant-controls select{max-width:100%;min-height:44px}.variant-controls button{min-height:44px}.variant-message{font-weight:600;color:var(--green)}.soma-variant-panel .meta{line-height:1.8}.soma-variant-panel button:disabled{opacity:.65;cursor:default}.soma-variant-panel details{overflow-wrap:anywhere}@media(max-width:600px){.variant-controls{display:grid;grid-template-columns:1fr}.variant-controls select,.variant-controls button{width:100%}}';document.head.append(css);
 css.textContent+='@media print{.problem-card[data-normalization-stage="soma-constrained-generation"]{display:inline-block;width:100%;box-sizing:border-box;break-inside:avoid;margin:0 0 7mm;padding:0 0 5mm}.problem-card[data-normalization-stage="soma-constrained-generation"] .write{height:32mm}.problem-card[data-normalization-stage="soma-constrained-generation"][data-response-kind="written-division-quotient-and-remainder"] .write{height:48mm}.problem-card[data-normalization-stage="soma-constrained-generation"] .soma-authoring-figure{max-width:155mm;max-height:48mm;margin:2mm auto}.problem-card[data-normalization-stage="soma-constrained-generation"] .soma-authoring-figure[data-large-grid]{max-height:70mm}}';
 const previousRefresh=refresh;
 refresh=function(){previousRefresh();window.dispatchEvent(new CustomEvent('soma-variant-refreshed',{detail:{type}}));};
 function register(sample){
  const s=structuredClone(sample),old=byId.get(s.instanceId);
  if(old){s.priorFiniteAssessment=old.priorFiniteAssessment||{candidateBand:old.commonBandCandidate,normalization:old.normalization};pool[pool.findIndex(x=>x.instanceId===s.instanceId)]=s;}
  else pool.push(s);
  byId.set(s.instanceId,s);return s;
 }
 function addGenerated(sample){
  const s=register(sample);current.set(s.proposedTypeId,s.instanceId);if(type===s.proposedTypeId)el('band').value='';render();
 }
 window.SomaVariants={open,refresh,addGenerated,registerStored(samples){for(const s of samples)register(s);render();},currentExample(){return byId.get(current.get(type));},types:families.map(f=>f.typeId)};render();
}());
