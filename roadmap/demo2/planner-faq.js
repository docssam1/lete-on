/* Existing, context-selected answers remain the source. No question input or API. */
(function(global){
'use strict';
const mounted=new WeakMap();
function unmount(root){mounted.get(root)?.();mounted.delete(root);}
function mount(root,{selector=null}={}){
 unmount(root);
 const sections=[...root.querySelectorAll(selector||'.pathway-parent-questions')];
 const progression=selector?[]:[...root.querySelectorAll('.progress-faq')];
 const details=[...sections.flatMap(section=>[...section.querySelectorAll('details')]),...progression];
 const rows=details.map(detail=>({
  question:detail.querySelector('summary')?.childNodes[0]?.textContent?.trim(),
  answer:detail.querySelector('.parent-answer')||detail.querySelector('p')
 })).filter(x=>x.question&&x.answer);
 if(!rows.length)return;
 const wrap=document.createElement('section');wrap.className='faq-orbit';wrap.setAttribute('aria-labelledby','faqOrbitTitle');
 wrap.innerHTML=`<header><div><h3 id="faqOrbitTitle">이 로드맵에서 부모님이 궁금한 점</h3><p>선택한 공부 방향에 맞춰 질문을 모았습니다.</p></div></header>
 <div class="faq-deck" aria-roledescription="질문 모음">
  <button type="button" class="faq-ghost faq-previous" data-faq="previous"><span></span></button>
  <button type="button" class="faq-main" id="faqMain" data-faq="answer" aria-expanded="false" aria-controls="faqAnswer"><span class="faq-watermark" aria-hidden="true">Q</span><span class="faq-question-text"></span><span class="faq-read">답변 보기 <span aria-hidden="true">↗</span></span></button>
  <button type="button" class="faq-ghost faq-next" data-faq="next"><span></span></button>
 </div>
 <div class="faq-controls"><span class="faq-position"></span><button type="button" data-faq="auto" aria-pressed="false">자동 넘김 멈추기</button></div>
 <div id="faqAnswer" class="faq-answer" role="region" aria-labelledby="faqMain" hidden></div>
 <details class="faq-library"><summary>모든 질문 펼쳐보기</summary><div class="faq-originals"></div></details>`;
 (sections[0]||progression[0]).before(wrap);[...sections,...progression].forEach(section=>wrap.querySelector('.faq-originals').append(section));
 const main=wrap.querySelector('.faq-main'),answer=wrap.querySelector('.faq-answer'),library=wrap.querySelector('.faq-library'),auto=wrap.querySelector('[data-faq="auto"]');
 const motion=global.matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,manualPause=motion.matches,hover=false,focused=false,visible=false,timer=null;
 const stop=()=>{if(timer!==null)global.clearInterval(timer);timer=null;};
 function sync(){
  stop();auto.textContent=manualPause?'자동 넘김 시작하기':'자동 넘김 멈추기';auto.setAttribute('aria-pressed',String(!manualPause));
  if(rows.length>1&&!manualPause&&!hover&&!focused&&!visibleAnswer()&&!library.open&&!document.hidden&&visible)timer=global.setInterval(()=>show(index+1),5000);
 }
 const visibleAnswer=()=>!answer.hidden;
 function show(next){
  index=(next+rows.length)%rows.length;
  wrap.querySelector('.faq-question-text').textContent=rows[index].question;
  const previous=wrap.querySelector('.faq-previous'),nextButton=wrap.querySelector('.faq-next');
  previous.querySelector('span').textContent=rows[(index-1+rows.length)%rows.length].question;
  nextButton.querySelector('span').textContent=rows[(index+1)%rows.length].question;
  previous.setAttribute('aria-label','이전 질문: '+rows[(index-1+rows.length)%rows.length].question);
  nextButton.setAttribute('aria-label','다음 질문: '+rows[(index+1)%rows.length].question);
  previous.hidden=nextButton.hidden=rows.length===1;
  wrap.querySelector('.faq-position').textContent=`${index+1} / ${rows.length} 질문`;
  if(!motion.matches)wrap.querySelector('.faq-question-text').animate?.([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
 }
 function closeAnswer(){answer.hidden=true;answer.replaceChildren();main.setAttribute('aria-expanded','false');wrap.querySelector('.faq-read').firstChild.textContent='답변 보기 ';}
 wrap.addEventListener('click',e=>{
  const button=e.target.closest('[data-faq]');if(!button)return;
  switch(button.dataset.faq){
   case 'previous':case 'next':manualPause=true;closeAnswer();show(index+(button.dataset.faq==='next'?1:-1));break;
   case 'auto':manualPause=!manualPause;break;
   case 'answer':if(visibleAnswer())closeAnswer();else{answer.replaceChildren(rows[index].answer.cloneNode(true));answer.hidden=false;main.setAttribute('aria-expanded','true');wrap.querySelector('.faq-read').firstChild.textContent='답변 접기 ';}break;
  }
  sync();
 });
 wrap.addEventListener('pointerenter',()=>{hover=true;sync();});wrap.addEventListener('pointerleave',()=>{hover=false;sync();});
 wrap.addEventListener('focusin',()=>{focused=true;sync();});wrap.addEventListener('focusout',e=>{focused=wrap.contains(e.relatedTarget);sync();});
 library.addEventListener('toggle',sync);document.addEventListener('visibilitychange',sync);
 const motionChange=()=>{if(motion.matches)manualPause=true;sync();};motion.addEventListener('change',motionChange);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.25});observer.observe(wrap.querySelector('.faq-deck'));
 show(0);sync();
 mounted.set(root,()=>{stop();observer.disconnect();motion.removeEventListener('change',motionChange);document.removeEventListener('visibilitychange',sync);});
}
global.PlannerFaq=Object.freeze({mount,unmount});
})(window);
