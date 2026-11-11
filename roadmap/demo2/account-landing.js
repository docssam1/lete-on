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
 document.querySelectorAll('a[href="#accountEntry"]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  document.getElementById('accountEntry')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  document.getElementById('memberTitle')?.focus({preventScroll:true});
 }));
})();
