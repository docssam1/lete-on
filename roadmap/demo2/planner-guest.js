/* Looking around without an account. The planner opens with nothing read from or written to this device
   or the server, a watermark says so across the screen, and the member-only rooms stay closed. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.RoadmapGuestTour=api;
})(typeof window==='object'?window:null,()=>{
 'use strict';
 const MARK='둘러보기 · 저장되지 않습니다';
 const START='account.html';
 /* Member-only: academy stories and notices, the textbook map, the full senior library,
    the unit tests and the mock-exam records. */
 const LOCKED='#openAcademyStories,[data-academy-story-open],[data-math-books-open],#openCase,[data-ox-open],#plannerOxCheck>summary,[data-learning-evidence-open="mock"],[data-learning-evidence-open="papers"]';
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
    dialog.innerHTML=`<h2 id="guestLockTitle">가입하면 볼 수 있어요</h2><p>학원가 이야기, 교재 난이도 지도, 선배들의 로드맵, 단원테스트와 모평 기록은 이메일 인증 후 무료로 볼 수 있습니다.</p><p>둘러보는 중에 입력한 내용은 저장되지 않습니다.</p><div class="guest-lock-actions"><a href="${START}">이메일로 무료 시작하기</a><button type="button">계속 둘러보기</button></div>`;
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    doc.body.append(dialog);
   }
   if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}else dialog.setAttribute('open','');
  }
  doc.addEventListener('click',e=>{
   const target=e.target&&e.target.closest&&e.target.closest(LOCKED);if(!target)return;
   e.preventDefault();e.stopImmediatePropagation();closed();
  },true);
  return {mark,note,link};
 }
 return {MARK,LOCKED,requested,tourSearch,start};
});
