(function(){
  'use strict';

  function isLevelD(){
    const text=(document.body&&document.body.innerText)||'';
    return document.documentElement.dataset.carsBook==='cars-level-d' || /CARS Online Learning[\s\S]{0,80}Level D/i.test(text);
  }

  function sourceLabel(n){
    if(n>=1&&n<=5) return `Pretest ${n}`;
    if(n>=6&&n<=10) return `Benchmark ${n-5}`;
    if(n>=11&&n<=15) return `Post Test ${n-10}`;
    return `Lesson ${n}`;
  }

  function lessonNumber(){
    const lid=document.documentElement.dataset.carsLesson||'';
    const m1=lid.match(/cd(\d+)/i);
    if(m1) return Number(m1[1]);
    const text=(document.body&&document.body.innerText)||'';
    const m2=text.match(/\bLesson\s*(\d+)\b/i);
    return m2?Number(m2[1]):null;
  }

  function patchBreadcrumb(){
    if(!isLevelD()) return;
    const n=lessonNumber();
    if(!n) return;
    const target=sourceLabel(n);
    document.querySelectorAll('body *').forEach(el=>{
      if(el.children.length) return;
      const t=(el.textContent||'').trim();
      if(new RegExp(`^Lesson\\s*${n}$`,'i').test(t)) el.textContent=target;
    });
  }

  function patchMissingOriginal(){
    if(!isLevelD()) return;
    document.querySelectorAll('h1,h2,h3').forEach(h=>{
      const t=(h.textContent||'').trim();
      if(t==='교재 자료가 아직 연결되지 않았어요.' || t==='The book content is not connected yet.' || t==='教材内容尚未连接。' || t==='CARS D 교재 원문을 아직 불러오지 못했어요.'){
        h.textContent='CARS D 교재 원문을 아직 불러오지 못했어요.';
        const p=h.nextElementSibling;
        if(p&&p.matches('p,.sub')) p.textContent='교재 원문은 Supabase 비공개 자료에서 불러옵니다. 원문이 연결되면 STEP 2 교재 풀기와 STEP 3 교재 학습이 자동으로 열립니다.';
        const panel=h.closest('.card,.panel,section')||h.parentElement;
        if(panel&&!panel.querySelector('[data-cars-check-link]')){
          const tools=panel.querySelector('.tools')||panel;
          const a=document.createElement('a');
          a.href='cars-d-check.html';
          a.target='_blank';
          a.rel='noopener';
          a.dataset.carsCheckLink='1';
          a.className='btn';
          a.textContent='연결 상태 확인';
          tools.appendChild(a);
        }
      }
    });
  }

  function patch(){ patchBreadcrumb(); patchMissingOriginal(); }
  let queued=false;
  function schedule(){ if(queued)return; queued=true; requestAnimationFrame(()=>{queued=false;patch();}); }

  new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  window.addEventListener('cars-source-meta',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
  schedule();
})();
