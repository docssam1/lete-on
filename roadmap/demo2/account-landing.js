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

/* A soft moving surround fills wide screens from the same decoded video.
   The foreground retains the complete portrait, including people and captions. */
(() => {
 'use strict';
 const video=document.getElementById('growthReel');
 const canvas=document.getElementById('reelAmbience');
 if(!video||!canvas)return;
 const context=canvas.getContext('2d',{alpha:false});
 if(!context)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=null;
 const nativeFrames=typeof video.requestVideoFrameCallback==='function';
 function stop(){
  if(frame===null)return;
  if(nativeFrames)video.cancelVideoFrameCallback(frame);else cancelAnimationFrame(frame);
  frame=null;
 }
 function draw(){
  if(video.readyState<2||!video.videoWidth)return;
  const scale=Math.max(canvas.width/video.videoWidth,canvas.height/video.videoHeight);
  const width=video.videoWidth*scale,height=video.videoHeight*scale;
  context.drawImage(video,(canvas.width-width)/2,(canvas.height-height)/2,width,height);
  canvas.dataset.ready='true';
 }
 function animate(){
  frame=null;
  if(video.paused||video.ended||document.hidden||innerWidth<=700||reduced.matches)return;
  draw();
  frame=nativeFrames?video.requestVideoFrameCallback(animate):requestAnimationFrame(animate);
 }
 function start(){stop();draw();animate();}
 video.addEventListener('play',start);
 video.addEventListener('loadeddata',draw);
 video.addEventListener('seeked',draw);
 video.addEventListener('pause',stop);
 video.addEventListener('ended',stop);
 video.addEventListener('error',()=>{stop();canvas.hidden=true;});
 window.addEventListener('resize',start);
 reduced.addEventListener('change',start);
 if(!video.paused)start();
})();
