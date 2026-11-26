/* Static program previews; never read credentials, member data or stored plans. */
(() => {
 'use strict';
 const followOldGuide=()=>{
  if(location.hash!=='#levelGuide')return false;
  location.replace(new URL('level-guide.html#levelGuide',document.baseURI).href);
  return true;
 };
 if(followOldGuide())return;
 window.addEventListener('hashchange',followOldGuide);
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
 const account=document.getElementById('accountEntry');
 const behavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const destination=new URL(link.href);
  if(destination.origin!==location.origin||destination.pathname!==location.pathname||destination.search!==location.search)return;
  if(destination.hash!=='#accountEntry')return;
  event.preventDefault();
  account.scrollIntoView({block:'start',behavior:behavior()});
  document.getElementById('memberTitle')?.focus({preventScroll:true});
 });
 if(!location.hash&&new URLSearchParams(location.search).has('next'))account?.scrollIntoView({block:'start'});
})();
