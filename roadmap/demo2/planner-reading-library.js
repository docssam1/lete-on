/* Optional book browsing. This never changes a child's roadmap or reading assessment. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const BANDS=Object.freeze({all:'전체',below1:'AR 1 미만',one:'AR 1점대',two:'AR 2점대',three:'AR 3점대',four:'AR 4점대',fivePlus:'AR 5 이상',ort:'ORT'});
const FORMATS={picture:'그림책',reader:'리더스',chapter:'챕터북',nonfiction:'논픽션'};
function bandFor(book){
 if(book.oxfordLevel)return 'ort';
 const n=book.atos;
 if(typeof n!=='number'||!Number.isFinite(n)||n<0)return null;
 return n<1?'below1':n<2?'one':n<3?'two':n<4?'three':n<5?'four':'fivePlus';
}
function initialFilter(metric,range){return metric==='ar'&&Object.hasOwn(BANDS,range)&&!['all','ort'].includes(range)?range:'all';}
function selectBooks(books,filter){const key=Object.hasOwn(BANDS,filter)?filter:'all';return books.filter(b=>key==='all'||bandFor(b)===key);}
const bookIcon='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 8c-4-3-8-3-12-2v19c4-1 8-1 12 2 4-3 8-3 12-2V6c-4-1-8-1-12 2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M16 8v19M8 11c2 0 3 .3 5 1M19 12c2-.7 3-1 5-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
function launcher(row){return `<button type="button" class="reading-library-open" data-reading-library-open data-reading-metric="${esc(row.readingMetric)}" data-reading-range="${esc(row.readingRange)}" aria-haspopup="dialog">${bookIcon}<span>추천 도서 목록 보기</span><span aria-hidden="true">↗</span></button>`;}
function introduction(metric,range){
 if(metric==='srGe')return 'SR 성적표에 권장 읽기 범위(ZPD)가 있다면 그 범위부터 살펴보세요. GE 수치를 책의 AR로 바꾸지는 않습니다.';
 const f=initialFilter(metric,range);
 return f!=='all'?`지금 읽는 책과 같은 ${BANDS[f]}부터 펼쳤습니다. 관심 있는 책을 골라 내용을 편안하게 이해하는지 함께 읽어 보세요.`:'그림책부터 챕터북까지, 아이가 즐겨 읽을 책을 찾아보세요. 익숙한 책과 비슷한 난도에서 한 권씩 살펴보면 좋습니다.';
}
function card(book){
 const level=book.oxfordLevel?'Oxford Level '+book.oxfordLevel:typeof book.atos==='number'?'AR '+book.atos.toFixed(1):'난도 확인 전';
 const publisher=book.oxfordLevel?'Oxford':'AR Bookfinder';
 return `<li class="reading-library-book" data-reader-book="${esc(book.id)}"><div class="reading-library-book-mark" aria-hidden="true">${bookIcon}</div><div class="reading-library-book-copy"><div class="reading-library-meta"><span>${esc(level)}</span><small>${esc(FORMATS[book.format]||'원서')}</small></div><h3 lang="en">${esc(book.title)}</h3><p class="reading-library-series">${esc(book.series)}${book.author?' · '+esc(book.author):''}</p><p>${esc(book.note)}</p><a href="${esc(book.source)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(book.title)} 도서 정보 · ${publisher} · 새 창">도서 정보 <span aria-hidden="true">↗</span></a></div></li>`;
}
function listContent(books,filter){return selectBooks(books,filter).map(card).join('')||'<li class="reading-library-empty">이 범위의 도서는 정리 중입니다. 다른 범위도 살펴보세요.</li>';}
function render(catalog,metric,range){
 const filter=initialFilter(metric,range);
 return `<header class="reading-library-header"><div><small>유아·초등 영어 원서</small><h2 id="readingLibraryTitle">추천 도서 목록</h2></div><button type="button" data-reading-library-close autofocus>닫기 <span aria-hidden="true">×</span></button></header><div class="reading-library-body"><p class="reading-library-intro">${esc(introduction(metric,range))}</p><nav class="reading-library-filters" aria-label="책의 난도와 시리즈">${Object.entries(BANDS).map(([key,title])=>`<button type="button" data-reading-filter="${key}" aria-pressed="${key===filter}">${title}</button>`).join('')}</nav><div class="reading-library-results-head"><p>AR은 각 책의 ATOS 난도입니다. ORT는 Oxford 단계를 따로 표시했습니다.</p><span data-reading-count role="status" aria-live="polite">${selectBooks(catalog.books,filter).length}개</span></div><ul class="reading-library-list">${listContent(catalog.books,filter)}</ul><details class="reading-library-method"><summary>책을 고를 때 함께 볼 점</summary><p>같은 시리즈라도 권마다 난도가 다릅니다. 숫자와 함께 글의 길이, 주제, 아이가 내용을 설명하는 모습을 보세요. 어려운 책은 함께 읽고, 편안한 책은 혼자 읽는 시간을 두어도 좋습니다.</p><p>책 한 권의 AR은 아이의 영어 실력 전체를 뜻하지 않습니다. ORT 단계나 SR GE를 AR과 일대일로 맞추지 않습니다.</p><a href="https://star-help.renaissance.com/hc/en-us/articles/11584518853915-Zone-of-Proximal-Development-ZPD" target="_blank" rel="noopener noreferrer">Renaissance · 권장 읽기 범위 안내 ↗</a><small>도서별 공식 정보 확인 · ${esc(catalog.checked)}</small></details></div>`;
}
let dialog,opener;
function open(button){
 const catalog=g.PlannerReadingBooks;
 if(!catalog||!g.document)return;
 if(!dialog){
  dialog=document.createElement('dialog');dialog.id='readingLibraryDialog';dialog.className='reading-library-dialog';dialog.setAttribute('aria-labelledby','readingLibraryTitle');document.body.append(dialog);
  dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{
   if(e.target.closest('[data-reading-library-close]')){dialog.close();return;}
   const b=e.target.closest('[data-reading-filter]');if(!b)return;
   const key=b.dataset.readingFilter;
   for(const x of dialog.querySelectorAll('[data-reading-filter]'))x.setAttribute('aria-pressed',String(x===b));
   dialog.querySelector('.reading-library-list').innerHTML=listContent(catalog.books,key);
   dialog.querySelector('[data-reading-count]').textContent=selectBooks(catalog.books,key).length+'개';
  });
 }
 opener=button;
 dialog.innerHTML=render(catalog,button.dataset.readingMetric,button.dataset.readingRange);
 if(!dialog.open)dialog.showModal();
 dialog.querySelector('[data-reading-library-close]').focus({preventScroll:true});
}
if(g.document)document.addEventListener('click',e=>{const b=e.target.closest('[data-reading-library-open]');if(b)open(b);});
g.PlannerReadingLibrary=Object.freeze({BANDS,bandFor,initialFilter,selectBooks,launcher,introduction,render});
})(window);
