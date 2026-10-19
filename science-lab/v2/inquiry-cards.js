import {escapeLife as esc} from './life-records.js';
export function inquiryPhotosHtml(a){
 // figureHtml은 교재와 공유하는 정적 창작 자료에만 쓴다. 사용자 입력은 받지 않는다.
 if(a.showPhotosInNotebook&&a.figureHtml)return `<div class="solution-art">${a.figureHtml}</div>`;
 if(!a.showPhotosInNotebook||!a.photos?.length)return '';
 return `<div class="inquiry-source-photos${a.photoLabel?' plan-diagram':''}">${a.photos.map(p=>`<figure><img src="${esc(p.image)}" alt="${esc(p.name)}"><figcaption>${esc(p.name)}</figcaption></figure>`).join('')}</div><p class="life-hint">${esc(a.photoCredit||'')}</p>`;
}
export function inquiryCardsHtml(cards=[],sources=[]) {
  return `${cards.length?`<div class="inquiry-source-cards">${cards.map(c=>`<section><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></section>`).join('')}</div>`:''}${sources.length?`<ul class="inquiry-source-links">${sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} · 자료 열기</a></li>`).join('')}</ul>`:''}`;
}
