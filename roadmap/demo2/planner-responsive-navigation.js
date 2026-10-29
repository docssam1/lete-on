/* One responsive navigation shell for every roadmap workspace.
 * Move live controls within their existing delegated event root; never clone
 * buttons, learner state, maps or report data. Restore desktop/print positions. */
(function(g){
'use strict';
const doc=g.document,root=doc.getElementById('journeyMap'),top=doc.querySelector('.top');
if(!root||!top)return;
const compact=g.matchMedia('(max-width:800px), (orientation:landscape) and (max-width:1200px) and (max-height:600px)');
const landscape=g.matchMedia('(orientation:landscape) and (min-width:600px) and (max-width:1200px) and (max-height:600px)');
let frame=0,globalMenu=null,printing=false,currentWasOpen=false;
const moved=new Map();
function move(node,parent){
 if(!node||moved.has(node))return;
 const marker=doc.createComment('responsive control origin');node.before(marker);moved.set(node,marker);parent.append(node);
}
function restoreGlobal(){
 for(const [node,marker] of moved)if(marker.isConnected)marker.replaceWith(node);
 moved.clear();globalMenu?.remove();globalMenu=null;
}
function restoreTools(){
 for(const tools of root.querySelectorAll('.prn-tools')){const body=tools.querySelector('.prn-tools-body');tools.replaceWith(...body.childNodes);}
}
function globalControls(){
 if(globalMenu)return;
 globalMenu=doc.createElement('details');globalMenu.className='prn-global';
 const summary=doc.createElement('summary');summary.textContent='메뉴';summary.setAttribute('aria-label','학원가 이야기·선배 로드맵·인쇄 메뉴');
 const body=doc.createElement('div');body.className='prn-global-body';globalMenu.append(summary,body);top.append(globalMenu);
 for(const id of ['openAcademyStories','openCase','openSet','atlasExpand','openReport'])move(doc.getElementById(id),body);
 const current=doc.createElement('button');current.type='button';current.dataset.prnCurrent='true';current.textContent='현재 공부 확인';body.append(current);
 const panes=doc.querySelector('.mobile-workspace-nav');move(panes,top);
 for(const button of panes?.querySelectorAll('button')||[]){
  if(!button.dataset.prnOriginal){button.dataset.prnOriginal=button.textContent;button.setAttribute('aria-label',button.textContent);}
  button.textContent=button.dataset.mobileWorkspace==='choice'?'선택하기':'결과 보기';
 }
}
function toolsFor(results){
 let tools=results.querySelector(':scope > .prn-tools');
 if(!tools){
  const candidates=[...results.children].filter(el=>!el.matches('.workspace-tabs,[data-workspace-panel]'));
  if(!candidates.length)return;
  tools=doc.createElement('details');tools.className='prn-tools';
  const summary=doc.createElement('summary'),title=doc.createElement('span'),label=doc.createElement('span');
  title.className='prn-title';label.className='prn-tools-label';label.textContent='단계·비교';summary.append(title,label);
  const body=doc.createElement('div');body.className='prn-tools-body';body.append(...candidates);tools.append(summary,body);results.prepend(tools);
 }
 const title=doc.getElementById('journeyTitle')?.textContent||'우리 아이의 로드맵';
 tools.querySelector('.prn-title').textContent=title;tools.querySelector('summary').title=title+' · 단계와 비교 메뉴';
}
function syncOrientation(){
 const vertical=doc.body.dataset.responsiveWorkspace==='landscape'&&!doc.body.classList.contains('atlas-is-fullscreen');
 root.querySelector('.workspace-tabs')?.setAttribute('aria-orientation',vertical?'vertical':'horizontal');
}
function sync(){
 frame=0;
 const results=root.querySelector('.workspace-results'),view=doc.getElementById('vmap');
 const active=!printing&&compact.matches&&!doc.body.classList.contains('questioning')&&view?.classList.contains('on')&&!!results?.querySelector('.workspace-tabs');
 if(!active){delete doc.body.dataset.responsiveWorkspace;closeCurrent();restoreTools();restoreGlobal();syncOrientation();return;}
 doc.body.dataset.responsiveWorkspace=landscape.matches?'landscape':'portrait';
 const canChoose=doc.body.dataset.planMode!=='standard'||doc.body.dataset.referenceFlow==='true';
 doc.body.dataset.responsiveChoice=String(canChoose);globalControls();toolsFor(results);
 const overview=doc.getElementById('planningOverview'),current=globalMenu.querySelector('[data-prn-current]');if(current)current.hidden=!overview||overview.hidden||!overview.textContent.trim();
 syncOrientation();
}
function schedule(){if(!frame)frame=g.requestAnimationFrame(sync);}
function closeCurrent(){const el=doc.getElementById('planningOverview');if(!el?.classList.contains('prn-current-open'))return;el.classList.remove('prn-current-open');const detail=el.querySelector('details');if(detail)detail.open=currentWasOpen;}
function closeMenus(except){for(const menu of doc.querySelectorAll('.prn-global[open],.prn-tools[open]'))if(menu!==except)menu.open=false;}
doc.addEventListener('click',e=>{
 if(e.target.closest('[data-prn-current]')){const el=doc.getElementById('planningOverview'),detail=el?.querySelector('details');if(el&&detail){currentWasOpen=detail.open;detail.open=true;el.classList.add('prn-current-open');let close=el.querySelector('[data-prn-current-close]');if(!close){close=doc.createElement('button');close.type='button';close.dataset.prnCurrentClose='true';close.textContent='현재 공부 닫기';el.prepend(close);}close.focus();}closeMenus();return;}
 if(e.target.closest('[data-prn-current-close]')){closeCurrent();globalMenu?.querySelector('summary').focus();return;}
 if(!e.target.closest('#planningOverview'))closeCurrent();
 const menu=e.target.closest('.prn-global,.prn-tools');
 if(e.target.closest('.prn-global-body button')){closeMenus();return;}
 if(!menu)closeMenus();else closeMenus(menu);
});
doc.addEventListener('keydown',e=>{
 if(e.key!=='Escape')return;
 if(e.target.closest('.prn-current-open')){e.preventDefault();closeCurrent();globalMenu?.querySelector('summary').focus();return;}
 const menu=e.target.closest('.prn-global[open],.prn-tools[open]');if(!menu)return;
 e.preventDefault();menu.open=false;menu.querySelector('summary').focus();
});
new MutationObserver(schedule).observe(root,{childList:true});
new MutationObserver(schedule).observe(doc.body,{attributes:true,attributeFilter:['class','data-plan-mode','data-reference-flow','data-workspace-pane']});
compact.addEventListener('change',schedule);landscape.addEventListener('change',schedule);g.addEventListener('resize',schedule);
g.addEventListener('beforeprint',()=>{printing=true;sync();});g.addEventListener('afterprint',()=>{printing=false;schedule();});
g.PlannerResponsiveNavigation=Object.freeze({sync:schedule,syncOrientation});schedule();
})(window);
