import { animals, photoCredit } from '../data/activities/s31-u02.animal.js';
import { findLifeItem, lifeQuestion } from './book-life.js';
import { escapeLife as esc } from './life-records.js';
import {inquiryCardsHtml} from './inquiry-cards.js';
export const observationQuestion = (q, config) => config?.plantwork && q?.givens ? { ...q, givens: Object.fromEntries(Object.entries(q.givens).map(([k,v]) => [k, Array.isArray(v) ? v.join('\n') : v])) } : q;
export function animalBlock(b, pool, teacher, prefix='bk', config={}) {
  if(b.type==='text')return `<p>${esc(b.value)}</p>`;
  if(b.type==='source-cards')return b.webOnly?`<div class="no-print">${inquiryCardsHtml(b.cards,b.sources)}</div>`:inquiryCardsHtml(b.cards,b.sources);
  if(b.type==='photos'){const cards=b.cards||config.photoCards||animals,credit=b.credit||config.photoCredit||photoCredit;return `<div class="${config.plantwork?'plant':'animal'}-photo-grid${b.diagram?' plan-diagram':''}">${cards.map((a)=>`<figure><img src="${a.image}" alt="${a.name} ${b.diagram?'계획 그림':'관찰 자료'}"><figcaption>${a.name}</figcaption></figure>`).join('')}</div><p class="bk-hint">출처: ${credit}</p>`;}
  if(b.type==='fields')return b.labels.map((s,i)=>`<h3>${esc(s)}</h3>${teacher?`<div class="${prefix}-ans">지도: ${esc(b.guides?.[i]||b.guide)}</div>`:`<div class="bk-lines">${'<i></i>'.repeat(b.lines||3)}</div>`}`).join('');
  if(b.type==='draw')return `<h3>그림과 이름표</h3><div class="${config.plantwork?'plant':'animal'}-drawing-box"></div>${teacher?`<div class="${prefix}-ans">지도: ${esc(b.guide)}</div>`:''}`;
  if(b.type==='table')return `<table class="${prefix}-tbl"><thead><tr>${b.heads.map((s)=>`<th>${esc(s)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((row)=>`<tr>${row.map((s)=>`<td>${esc(s)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  if(b.type==='questions')return `<ol class="${prefix}-items">${b.keys.map((k,i)=>lifeQuestion(observationQuestion(findLifeItem(pool,k),config),i+1,teacher,prefix)).join('')}</ol>`;
  throw Error(`알 수 없는 교재 블록: ${b.type}`);
}
export function renderAnimalChapter(ch,art,pool,{teacher=false,live=false}={}) {
  const pages=ch.pages.map((page,i)=>`<section class="bk-page ${(i+1)%2?'odd':'even'}"><div class="bk-life-watermark" aria-hidden="true">GFIELD · 지필드</div><div class="bk-band"><span class="bk-band-no">${String(ch.no).padStart(2,'0')}</span><span class="bk-band-t">${esc(ch.subjectTitle||'동물의 생활')}</span><span class="bk-band-u">${teacher?'교사용 · 지도와 예시':'학생용 · 관찰과 설계'}</span></div><div class="bk-grid"><div class="bk-main"><h2>${esc(page.title)}</h2>${page.blocks.map((b)=>animalBlock(b,pool,teacher,'bk',ch)).join('')}${live&&(ch.labPages||[1,4,8,14,17]).includes(i)?`<div class="bk-web"><button type="button" class="bk-pop-btn" data-pop="lab">${ch.plantwork?'내 잎 관찰·분류·설계 기록':'관찰·분류·설계 기록'} 열기</button></div>`:''}</div></div><footer class="bk-foot"><span class="bk-pn">${i+1}</span><span>${ch.book} · 3-1</span>${teacher?'<em>교사용</em>':''}</footer></section>`);
  return `<div data-unit="${ch.unit}" class="bk bk-life ${ch.plantwork?'bk-plant':'bk-animal'} ${teacher?'bk-t':''} ${live?'live':''}" style="--bk-theme:${ch.theme}">${pages.join('')}</div>`;
}
