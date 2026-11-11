/* Introduction motion: large text grows or settles into place as it enters, and the row being read is set larger.
   Every line is fully visible without this script, with reduced motion and in print. Reads no member data. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else api.mount(root);
})(typeof window==='object'?window:null,()=>{
 'use strict';
 const clamp=v=>v<0?0:v>1?1:v;
 const ease=t=>1-Math.pow(1-t,3);
 /* centre: the element's vertical centre in the viewport, height: the viewport height.
    A later step in the same row finishes a little after the one before it. */
 function entered(centre,height,step=0){return ease(clamp((height*.98-centre)/(height*.4)-step*.15));}
 /* 1 while the row is around the middle of the screen, falling to 0 toward the edges. */
 function focused(centre,height){return ease(clamp(1.25-Math.abs(centre-height*.5)/(height*.5)*1.5));}
 function mount(win){
  if(!win||!win.document||typeof win.IntersectionObserver!=='function')return null;
  const doc=win.document,html=doc.documentElement;
  const items=Array.from(doc.querySelectorAll('[data-zoom],[data-focus]'));
  if(!items.length)return null;
  const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
  const near=new Set();let queued=false,on=false,io=null;
  function paint(){
   queued=false;if(!on)return;
   const height=win.innerHeight;
   /* At the very end of the page nothing more can scroll into place, so everything in view is finished. */
   const end=win.scrollY+height>=html.scrollHeight-2;
   for(const el of near){
    const r=el.getBoundingClientRect();if(!r.height&&!r.width)continue;
    const centre=r.top+r.height/2;
    if(el.hasAttribute('data-zoom'))el.style.setProperty('--zp',(end&&centre<height?1:entered(centre,height,Number(el.dataset.zoomStep)||0)).toFixed(3));
    else el.style.setProperty('--f',focused(centre,height).toFixed(3));
   }
  }
  function request(){if(on&&!queued){queued=true;win.requestAnimationFrame(paint);}}
  function start(){
   if(on||reduced.matches)return;
   on=true;html.classList.add('intro-motion');
   io=new win.IntersectionObserver(entries=>{
    for(const e of entries){e.target.classList.toggle('is-near',e.isIntersecting);if(e.isIntersecting)near.add(e.target);else near.delete(e.target);}
    request();
   },{rootMargin:'30% 0px 30% 0px'});
   items.forEach(el=>io.observe(el));
   win.addEventListener('scroll',request,{passive:true});win.addEventListener('resize',request);doc.addEventListener('toggle',request,true);doc.addEventListener('click',request);
  }
  function stop(){
   if(!on)return;
   on=false;html.classList.remove('intro-motion');io.disconnect();io=null;near.clear();
   win.removeEventListener('scroll',request);win.removeEventListener('resize',request);doc.removeEventListener('toggle',request,true);doc.removeEventListener('click',request);
   items.forEach(el=>{el.classList.remove('is-near');el.style.removeProperty('--zp');el.style.removeProperty('--f');});
  }
  const sync=()=>reduced.matches?stop():start();
  if(reduced.addEventListener)reduced.addEventListener('change',sync);
  sync();
  return {start,stop};
 }
 return {entered,focused,mount};
});
