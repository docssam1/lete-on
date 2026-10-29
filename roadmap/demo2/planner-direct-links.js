/* Direct links identify an anonymous reference case only. No learner answers,
 * student names, saved workspace state or private source locations enter URLs. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const definitions=[
 ['early','seoul-science-mit'],['growth','korea-science-gifted'],['current','gifted-school-preparation'],['fields','fields-s-elementary-selection'],
 ['s1recent','fields-s1-math-contest'],['premierrecent','premier-one-math-contest'],['runnerup','elementary-selection-runner-up'],['steady','steady-contest-growth'],
 ['premierfoundation','premier-foundation'],['latepremier','premier-late-start'],['premierthree','premier-three'],['dualseven','dual-selection-foundation'],
 ['dualpractice','dual-selection-practice'],['winterretry','winter-retry'],['premierkmo','premier-kmo'],
 ['publicMiddle','public-science-engineering'],['publicKsa','public-ksa-self-study'],['publicDaegu','public-daegu-science'],['publicGyeonggi','public-gyeonggi-science'],
 ['premier2020','premier-cohort'],['legacy','elementary-balanced-example']
];
const byId=new Map(definitions),byAlias=new Map(definitions.map(([id,alias])=>[alias,id]));
// Keep existing shared links working while new links omit the cohort year.
byAlias.set('premier-2020-cohort','premier2020');
function base(currentUrl){try{const u=new URL(String(currentUrl));if(!['http:','https:'].includes(u.protocol))return null;u.username='';u.password='';u.search='';u.hash='';return new URL('planner.html',u);}catch{return null;}}
function available(id){return id==='legacy'||!g.PlannerCounsellingHistory?.CASES||Object.hasOwn(g.PlannerCounsellingHistory.CASES,id);}
function libraryHref(currentUrl){const u=base(currentUrl);if(!u)return '';u.searchParams.set('view','seniors');return u.href;}
function studyHref(currentUrl){const u=base(currentUrl);if(!u)return '';u.searchParams.set('study','grade5-balanced');return u.href;}
function historyHref(currentUrl,id){if(typeof id!=='string'||!byId.has(id)||!available(id))return '';const u=base(currentUrl);if(!u)return '';u.searchParams.set('senior',byId.get(id));return u.href;}
function resolve(currentUrl){
 const clean=base(currentUrl);if(!clean)return null;
 let u;try{u=new URL(String(currentUrl));}catch{return null;}
 const senior=u.searchParams.getAll('senior'),view=u.searchParams.getAll('view'),study=u.searchParams.getAll('study');
 if(study.length)return study.length===1&&study[0]==='grade5-balanced'&&!senior.length&&!view.length?{kind:'study',id:'grade5'}:null;
 if(senior.length){if(senior.length!==1||view.length)return null;const id=byAlias.get(senior[0]);return id&&available(id)?{kind:id==='legacy'?'case':'history',id}:null;}
 return view.length===1&&view[0]==='seniors'?{kind:'library'}:null;
}
function actions(href,label,library=false){if(!href)return '';return '<div class="senior-direct-actions"><a href="'+esc(href)+'" target="_blank" rel="noopener" aria-label="'+esc(label+' 직접 링크로 열기')+'">'+(library?'목록 직접 열기 ↗':'직접 링크로 열기 ↗')+'</a><button type="button" data-direct-link-copy="'+esc(href)+'" aria-label="'+esc(label+' 링크 복사')+'">링크 복사</button><span class="senior-direct-status" role="status" aria-live="polite"></span></div>';}
function renderLibraryLink(currentUrl){return '<section class="senior-direct-library"><strong>선배들의 로드맵 직접 링크</strong>'+actions(libraryHref(currentUrl),'선배들의 로드맵 목록',true)+'</section>';}
function renderCaseLink(currentUrl,id,title='선배 로드맵'){return actions(historyHref(currentUrl,id),title);}
function decorateLibrary(container,currentUrl){
 if(!container?.querySelectorAll||!container.ownerDocument)return 0;
 const doc=container.ownerDocument;
 if(!container.querySelector('.senior-direct-library')){const host=doc.createElement('div');host.innerHTML=renderLibraryLink(currentUrl);container.prepend(...host.childNodes);}
 let count=0;
 for(const button of [...container.querySelectorAll('button[data-history-case]')]){
  const id=button.dataset.historyCase,href=historyHref(currentUrl,id);if(!href||button.parentElement?.classList.contains('senior-direct-card'))continue;
  const title=button.querySelector('strong')?.textContent?.trim()||button.textContent.trim()||'선배 로드맵',wrapper=doc.createElement('article');wrapper.className='senior-direct-card';wrapper.dataset.directCase=id;
  button.replaceWith(wrapper);wrapper.append(button);const host=doc.createElement('div');host.innerHTML=renderCaseLink(currentUrl,id,title);wrapper.append(...host.childNodes);count++;
 }
 return count;
}
function handleCopy(event){
 const button=event?.target?.closest?.('[data-direct-link-copy]');if(!button)return false;
 const raw=button.dataset.directLinkCopy,intent=resolve(raw),href=intent?.kind==='library'?libraryHref(raw):intent?historyHref(raw,intent.id):'';
 if(!href)return false;
 event.preventDefault?.();const status=button.closest('.senior-direct-actions')?.querySelector('.senior-direct-status'),say=t=>{if(status)status.textContent=t;};
 const clipboard=g.navigator?.clipboard;
 if(!clipboard?.writeText){say('직접 링크를 길게 누르거나 마우스 오른쪽 버튼으로 복사해 주세요.');return true;}
 Promise.resolve().then(()=>clipboard.writeText(href)).then(()=>say('링크를 복사했습니다.'),()=>say('직접 링크를 길게 누르거나 마우스 오른쪽 버튼으로 복사해 주세요.'));
 return true;
}
function routes(){return definitions.filter(([id])=>available(id)).map(([id,alias])=>({id,alias,kind:id==='legacy'?'case':'history'}));}
g.PlannerDirectLinks=Object.freeze({libraryHref,studyHref,historyHref,resolve,renderLibraryLink,renderCaseLink,decorateLibrary,handleCopy,routes});
})(window);
