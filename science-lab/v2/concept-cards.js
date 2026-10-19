const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// 개념 자료를 제공한 단원에만 설명 본문과 보조 정리를 표시한다.
export function conceptCardsHtml(concepts=[]){
 return concepts.length?`<div class="lesson-concepts">${concepts.map(c=>`<section class="lesson-concept" aria-labelledby="${esc(c.id)}"><div><h2 id="${esc(c.id)}">${esc(c.title)}</h2><p>${esc(c.text)}</p>${c.figureHtml?`<div class="solution-art">${c.figureHtml}</div>`:c.figure?`<figure><img src="${esc(c.figure)}" alt="${esc(c.title)} 설명용 모식도"><figcaption>빛의 경로와 형태를 읽는 설명용 모식도 · 실제 관찰 결과와 구별해요.</figcaption></figure>`:''}</div>${c.notes?.length?`<aside aria-label="${esc(c.title)} 보조 정리">${c.notes.map(n=>`<section><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></section>`).join('')}</aside>`:''}</section>`).join('')}</div>`:'';
}
