import {lifeQuestion} from './book-life.js';
import {sourceTableHtml} from './source-presentation.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// 보기·관찰 기록은 코드 배열 대신 한 줄씩 읽는다. 표 자료와 채점 표시는 기존 renderer를 쓴다.
export function thinkingCheckQuestion(q,n,teach,{recordKey}={}){
 recordKey ||= q.id?`test:item:${q.id}`:undefined;
 const entries=Object.entries(q.givens||{});
 const isList=value=>Array.isArray(value)&&value.every(v=>typeof v==='string');
 if(q.answerContract?.type==='cloze'){
  const given=entries.map(([title,value])=>`<div class="dk-given"><b>${esc(title)}</b> ${sourceTableHtml(value)||esc(value??'')}</div>`).join(''),key=recordKey||`test${n}`;
  const answer=q.answerContract.blanks.map((b,i)=>`${'①②③④⑤⑥⑦⑧⑨⑩'[i]||i+1} ${b.answer}`).join(' · ');
  return `<p class="dk-q">${esc(q.prompt)}</p>${given}`+(teach?`<div class="dk-ans rv">${esc(answer+' — '+q.explanation)}</div>`:q.answerContract.blanks.map((b,i)=>`<div class="dk-self" data-k="${esc(key)}:blank:${i}"><div class="dk-inrow"><label>${'①②③④⑤⑥⑦⑧⑨⑩'[i]||i+1} <textarea class="dk-in" rows="1" aria-label="문제 ${n}의 ${i+1}번 빈칸"></textarea></label></div><div class="dk-ans" hidden>${esc(b.answer)}</div></div>`).join(''));
 }
 const render=item=>{const html=lifeQuestion(item,n,teach,'dk');return recordKey?html.replace(`data-k="test${n}"`,`data-k="${esc(recordKey)}"`):html;};
 if(!entries.some(([,value])=>isList(value)))return render(q);
 const given=entries.map(([title,value])=>`<div class="dk-given"><b>${esc(title)}</b>${isList(value)?`<ul class="dk-given-list">${value.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`:` ${sourceTableHtml(value)||esc(typeof value==='object'?JSON.stringify(value):value)}`}</div>`).join('');
 return render({...q,givens:undefined}).replace('</p>','</p>'+given);
}
