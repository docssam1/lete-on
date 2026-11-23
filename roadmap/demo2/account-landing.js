/* Static program previews; never read credentials, member data or stored plans. */
(() => {
 'use strict';
 const tabs=Array.from(document.querySelectorAll('.account-preview-tabs [role="tab"]'));
 function select(tab,focus=false){
  for(const item of tabs){
   const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;
   document.getElementById(item.getAttribute('aria-controls')).hidden=!active;
  }
  if(focus)tab.focus();
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>select(tab));
  tab.addEventListener('keydown',event=>{
   let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;
   if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
   if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();select(tabs[next],true);}
  });
 });
 const levelGuide=document.querySelector('[data-level-guide-load]');
 if(levelGuide){
  const status=levelGuide.querySelector('[role=status]');
  const retry=levelGuide.querySelector('[data-level-guide-retry]');
  const loadScript=(name,ready)=>{
   if(ready())return Promise.resolve();
   return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=name;
    script.onload=()=>ready()?resolve():reject(new Error('기준표 파일 확인 실패'));
    script.onerror=reject;
    document.head.append(script);
   });
  };
  let loading=false;
  async function showGuide(){
   if(!levelGuide.open||loading||!levelGuide.isConnected)return;
   loading=true;retry.hidden=true;status.textContent='기준표를 준비하고 있어요.';
   try{
    await Promise.all([
     loadScript('planner-levels.js?v=20261112-mid3',()=>window.PLANNER_LEVELS),
     loadScript('planner-standard-data.js?v=20261112-mid3',()=>window.PLANNER_STANDARD_DETAILS),
     loadScript('planner-level-guide.js?v=20261123-guide1',()=>window.PlannerLevelGuide)
    ]);
    const template=document.createElement('template');
    const hadFocus=levelGuide.contains(document.activeElement);
    template.innerHTML=window.PlannerLevelGuide.render({open:levelGuide.open});
    const guide=template.content.firstElementChild;guide.id=levelGuide.id;
    levelGuide.replaceWith(guide);
    if(hadFocus)guide.querySelector('summary').focus({preventScroll:true});
    if(guide.open&&location.hash==='#levelGuide')requestAnimationFrame(()=>guide.scrollIntoView({block:'start',behavior:'instant'}));
   }catch{
    status.textContent='기준표를 불러오지 못했어요.';retry.hidden=false;
   }finally{loading=false;}
  }
  const openGuide=()=>{if(location.hash==='#levelGuide'){const guide=document.getElementById('levelGuide');if(guide)guide.open=true;}};
  levelGuide.addEventListener('toggle',showGuide);
  retry.addEventListener('click',showGuide);
  window.addEventListener('hashchange',openGuide);
  openGuide();
 }
 const account=document.getElementById('accountEntry');
 const behavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const destination=new URL(link.href);
  if(destination.origin!==location.origin||destination.pathname!==location.pathname||destination.search!==location.search)return;
  if(destination.hash==='#levelGuide')document.getElementById('levelGuide').open=true;
  if(destination.hash!=='#accountEntry')return;
  event.preventDefault();
  account.scrollIntoView({block:'start',behavior:behavior()});
  document.getElementById('memberTitle')?.focus({preventScroll:true});
 });
 if(!location.hash&&new URLSearchParams(location.search).has('next'))account?.scrollIntoView({block:'start'});
})();
