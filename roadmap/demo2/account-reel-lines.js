/* The film's captions as page text. The video file carries the same lines burned into a top band
   (with the logo) that the page crops away, so they are set here, larger, beside the picture. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else api.mount(root);
})(typeof window==='object'?window:null,()=>{
 'use strict';
 /* [start, end, text] in seconds: the timings the film was rendered with (tools/promo-reel/finish-journey.cjs).
    The last entry is the closing card. */
 const LINES=[
  [0,2.2,'책을 펼치던 아이가'],[2.2,4.8,'어려운 문제 앞에서\n잠시 멈춥니다.'],[4.8,8.1,'지금, 어떤 공부가\n더 필요할까요?'],
  [8.1,10.8,'함께 공부할 순서를 정하고'],[10.8,12.9,'스스로 다시 풀어봅니다.'],[12.9,16.2,'초등에서 중등,\n고등까지 이어지는 계획'],
  [16.2,20.2,'조건을 읽고,\n풀이를 정리합니다.'],[20.2,23,'학년이 올라가도,\n공부의 기본은 단단하게'],[23,26,'우리 아이에게 맞는\n학습 로드맵'],
  [26,34.2,'교재와 월별 계획,\n그래프까지 함께'],[34.2,Infinity,'성공하는 공부습관\n만들기']
 ];
 function lineAt(seconds){
  const t=Number.isFinite(seconds)&&seconds>0?seconds:0;
  for(let i=0;i<LINES.length;i++)if(t<LINES[i][1])return i;
  return LINES.length-1;
 }
 function mount(win){
  const doc=win&&win.document;if(!doc)return null;
  const video=doc.getElementById('growthReel'),line=doc.getElementById('reelLine');
  if(!video||!line)return null;
  let shown=-1,frame=null;
  /* Until the film has played, the page keeps the line that belongs to the poster frame. */
  function show(){
   if(shown<0&&!video.currentTime)return;
   const i=lineAt(video.currentTime);if(i===shown)return;
   shown=i;line.textContent=LINES[i][2];
   line.classList.remove('is-in','is-out');void line.offsetWidth;line.classList.add(i%2?'is-out':'is-in');
  }
  function loop(){frame=null;show();if(!video.paused&&!video.ended)frame=win.requestAnimationFrame(loop);}
  video.addEventListener('play',()=>{if(frame===null)loop();});
  ['seeked','timeupdate','pause','ended'].forEach(type=>video.addEventListener(type,show));
  if(!video.paused)loop();
  return {show};
 }
 return {LINES,lineAt,mount};
});
