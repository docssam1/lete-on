/* Looking around without an account. The tour goes as far as the learning roadmap being made: the questions
   and the roadmap itself. Nothing is read from or written to this device or the server, a watermark says so
   across the screen, and everything past the roadmap stays closed until sign-up. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.RoadmapGuestTour=api;
})(typeof window==='object'?window:null,()=>{
 'use strict';
 const MARK='둘러보기 · 저장되지 않습니다';
 const START='account.html';
 /* Past the roadmap, so closed on a tour: the other result tabs and views, the report and print, adjusting or
    accepting the plan, other subjects, every record tool, academy stories, the textbook map and the senior library. */
 const LOCKED=['.nav [data-v="vplan"]','.nav [data-v="vrep"]','#workspace-tab-graph','#workspace-tab-table','#workspace-tab-records','#openReport','#legacyPrintReport',
  '[data-standard-accept]','[data-roadmap-mode="custom"]','[data-student-growth]','.language-entry button','.science-entry',
  '[data-learning-evidence-open]','[data-learning-evidence-open="mock"]','[data-learning-evidence-open="papers"]','[data-ox-open]','#plannerOxCheck>summary',
  '#openAcademyStories','[data-academy-story-open]','[data-math-books-open]','#openCase'].join(',');
 /* The result tabs can also be moved with the arrow keys; on a tour they stay on the roadmap. */
 const TAB_KEYS=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
 function requested(search){return /(?:^\?|&)guest=1(?:&|$)/.test(String(search||''));}
 /* A tour keeps only its own flag and a chosen goal; every other deep link is a member's. */
 function tourSearch(search){
  const goal=/(?:^\?|&)goal=([A-Za-z]{1,24})(?:&|$)/.exec(String(search||''));
  return '?guest=1'+(goal?'&goal='+goal[1]:'');
 }
 function markImage(){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="380" height="230"><text x="190" y="115" text-anchor="middle" transform="rotate(-24 190 115)" font-family="sans-serif" font-size="18" font-weight="700" fill="#808080" fill-opacity=".22">${MARK}</text></svg>`;
  return 'url("data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)+'")';
 }
 function start(win){
  const doc=win&&win.document;if(!doc||!doc.body)return null;
  doc.documentElement.classList.add('guest-tour');
  const mark=doc.createElement('div');mark.className='guest-watermark';mark.setAttribute('aria-hidden','true');mark.style.backgroundImage=markImage();
  const note=doc.createElement('p');note.className='guest-note';note.setAttribute('role','status');note.textContent='둘러보는 중입니다. 입력한 내용은 저장되지 않습니다.';
  doc.body.append(mark,note);
  const chip=doc.querySelector('.top .chip');if(chip)chip.textContent='둘러보기';
  const link=doc.createElement('a');link.className='member-account-link guest-start';link.href=START;link.textContent='이메일로 무료 시작하기';
  (doc.querySelector('.prn-global-body')||doc.querySelector('.top'))?.appendChild(link);
  let dialog=null;
  function closed(){
   if(!dialog){
    dialog=doc.createElement('dialog');dialog.className='guest-lock';dialog.setAttribute('aria-labelledby','guestLockTitle');
    dialog.innerHTML=`<h2 id="guestLockTitle">가입하면 볼 수 있어요</h2><p>둘러보기는 학습 로드맵이 만들어지는 데까지입니다.</p><p>진도 비교, 월별 교재 계획, 총평·인쇄, 학습 기록, 학원가 이야기, 교재 난이도 지도, 선배들의 로드맵은 이메일 인증 후 무료로 볼 수 있습니다. 둘러보는 중에 입력한 내용은 저장되지 않습니다.</p><div class="guest-lock-actions"><a href="${START}">이메일로 무료 시작하기</a><button type="button">계속 둘러보기</button></div>`;
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    doc.body.append(dialog);
   }
   if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}else dialog.setAttribute('open','');
  }
  doc.addEventListener('click',e=>{
   const target=e.target&&e.target.closest&&e.target.closest(LOCKED);if(!target)return;
   e.preventDefault();e.stopImmediatePropagation();closed();
  },true);
  doc.addEventListener('keydown',e=>{
   if(!TAB_KEYS.includes(e.key)||!e.target||!e.target.closest||!e.target.closest('#workspace-tab-map,#workspace-tab-graph,#workspace-tab-table,#workspace-tab-records'))return;
   e.preventDefault();e.stopImmediatePropagation();
  },true);
  return {mark,note,link};
 }
 return {MARK,LOCKED,TAB_KEYS,requested,tourSearch,start};
});
