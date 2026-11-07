import {sourceTableHtml,sourceChoiceHtml} from './source-presentation.js';

export const SOURCE_CONTENT_VERSION='20261108-original-source';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const marks=['①','②','③','④','⑤'];
export const isStructuredSource=q=>q?.sourceRef?.type==='original'&&q.sourceContentVersion===SOURCE_CONTENT_VERSION;

function table(t,{allowHeadless=false}={}){
 const width=t?.heads?.length||(allowHeadless&&Array.isArray(t?.rows?.[0])?t.rows[0].length:0);
 if(!t||!Array.isArray(t.heads)||!width||t.heads.some(h=>typeof h!=='string')||!Array.isArray(t.rows)||!t.rows.length||t.rows.some(r=>!Array.isArray(r)||r.length!==width||r.some(c=>typeof c!=='string'&&!Number.isFinite(c))))throw Error('원문 표의 행·열이 맞지 않습니다.');
 return t;
}
// 원문 공통 자료와 문항 자료의 순서를 보존한다. 기존 원고는 새 형식에 참여하지 않는다.
export function sourceBlocksHtml(q,place){
 if(!isStructuredSource(q))return null;
 if(!['context','material'].includes(place))throw Error('원문 자료 위치가 없습니다.');
 const blocks=q[place==='context'?'sourceContextBlocks':'sourceMaterialBlocks'];
 if(!Array.isArray(blocks))throw Error('원문 자료 목록이 없습니다.');
 return blocks.map(b=>{
  if(b?.type==='text'&&typeof b.text==='string')return `<p class="lead">${esc(b.text)}</p>`;
  if(b?.type==='list'&&Array.isArray(b.items)&&b.items.every(t=>typeof t==='string'))return `<div class="source-list">${b.items.map(t=>`<p class="lead">${esc(t)}</p>`).join('')}</div>`;
  if(b?.type==='table'){
   table(b,{allowHeadless:true});
   if(!b.heads.length)return `<table class="tbl source-table"><tbody>${b.rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
   return sourceTableHtml({머리:b.heads,행:b.rows});
  }
  if(b?.type==='figure'&&typeof b.src==='string'&&/^assets\/bank\/[a-zA-Z0-9_./-]+\.(?:png|webp|jpe?g)$/.test(b.src)&&!b.src.split('/').includes('..')&&typeof b.alt==='string'&&b.alt.trim())return `<figure class="src-fig dt-fig"><img src="../${esc(b.src)}" alt="${esc(b.alt)}" loading="lazy"></figure>`;
  throw Error('지원하지 않거나 빠진 원문 자료가 있습니다.');
 }).join('');
}

export function sourceChoiceTableHtml(q,{print=false,show=false,mode='lesson',value=null}={}){
 if(!isStructuredSource(q)||q.sourceChoiceTable==null)return null;
 const t=table(q.sourceChoiceTable),ac=q.answerContract;
 if(ac?.type!=='single-choice'||!Array.isArray(q.choices)||t.rows.length!==q.choices.length||t.rows.length>5)throw Error('원문 보기표와 선택지가 맞지 않습니다.');
 if(!['lesson','daily'].includes(mode))throw Error('원문 보기표 화면이 없습니다.');
 return `<table class="${mode==='daily'?'dt-tbl':'tbl'} source-choice-table"><thead><tr><th scope="col" aria-label="보기"></th>${t.heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((row,i)=>`<tr${print&&show&&!needsSourceTeacherReview(q)&&i===ac.answer?' class="ans"':''}><th scope="row">${print?marks[i]:`<button type="button" class="${mode==='daily'?'dt-choice':'choice'}${mode==='daily'&&String(value)===String(i)?' sel':''}" data-i="${i}"${mode==='daily'?` aria-pressed="${String(value)===String(i)}"`:''} aria-label="보기 ${i+1}: ${esc(row.join(', '))}">${marks[i]}</button>`}</th>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

export function sourceAnswerHint(q){
 if(!isStructuredSource(q))return '';
 const earth=q.answerContract?.earthMotionContract,terms=q.answerContract?.sourceResponseContract??q.answerContract?.seasonContract;
 if(earth?.kind==='ordered-word-parts'&&Array.isArray(earth.parts)&&earth.parts.length>=2)return `${earth.parts.map(p=>`${p.label} 답`).join(' / ')}처럼 순서대로 써요.`;
 if(terms?.kind==='ordered-term-parts'&&Array.isArray(terms.parts)&&terms.parts.length>=2)return `${terms.parts.map(p=>p.label).join(' → ')} 순서로 답만 쓰고, 쉼표로 나누어요.${terms.parts.some(p=>p.unitRequired)?' 수에는 단위도 함께 써요.':''}`;
 return '';
}
export const needsSourceTeacherReview=q=>isStructuredSource(q)&&(q.answerContract?.earthMotionContract?.teacherRequired===true||q.answerContract?.seasonContract?.teacherRequired===true||q.answerContract?.sourceResponseContract?.teacherRequired===true);
export function sourceAnswerText(q,{printed=false}={}){
 if(!isStructuredSource(q))return null;
 if(!printed&&q.sourceRef.reviewOnly&&typeof q.reviewSummary==='string')return q.reviewSummary;
 const a=printed?q.printedAnswerContract:q.answerContract;
 if(!a)return '';
 if(a.type==='single-choice')return `${marks[a.answer]} ${q.choices[a.answer]}`;
 if(a.type==='multi-choice')return a.answers.map(i=>`${marks[i]} ${q.choices[i]}`).join(' · ');
 return String(a.sample??a.answer??'');
}
export function sourceReviewPromptHtml(q){
 if(!isStructuredSource(q))return null;
 const choices=sourceChoiceTableHtml(q,{print:true})??(q.choices?`<div>${q.choices.map((c,i)=>`<p>${marks[i]} ${sourceChoiceHtml(q,c,i)}</p>`).join('')}</div>`:'');
 return `${sourceBlocksHtml(q,'context')}<p>${esc(q.prompt)}</p>${sourceBlocksHtml(q,'material')}${choices}`;
}

// 수업의 즉시 판정에서는 교사 확인 답을 오답/정답 기록으로 바꾸지 않는다.
// 단원평가의 답 보관과 교사 확인 목록은 Daily Test가 담당한다.
export function wireSourceTeacherReview(card,q){
 if(!needsSourceTeacherReview(q)||!['single-choice','multi-choice','short-text'].includes(q.answerContract.type))return false;
 const a=q.answerContract,why=card.querySelector('.why');
 const finish=value=>{
  if(card.dataset.done)return;
  card.dataset.done='review';card.dataset.sourceResponse=JSON.stringify(value);
  card.querySelectorAll('button').forEach(b=>{b.disabled=true;});
  const input=card.querySelector('input');if(input)input.readOnly=true;
  why.hidden=false;why.textContent='이 답은 선생님과 함께 확인해요. 지금은 맞고 틀림을 표시하지 않아요.';
 };
 if(a.type==='short-text'){
  const input=card.querySelector('input'),check=()=>{if(input.value.trim())finish(input.value);};
  card.querySelector('[data-act=check-short]').addEventListener('click',check);
  input.addEventListener('keydown',e=>{if(e.key==='Enter')check();});
 }else{
  const picked=new Set();card.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>{
   if(card.dataset.done)return;const i=Number(b.dataset.i);
   if(a.type==='single-choice'){b.classList.add('sel');finish(i);return;}
   picked.has(i)?picked.delete(i):picked.add(i);b.classList.toggle('sel',picked.has(i));b.setAttribute('aria-pressed',String(picked.has(i)));
   if(picked.size===a.answers.length)finish([...picked]);
  }));
 }
 return true;
}

export function sourcePrintReviewHtml(q){
 if(!needsSourceTeacherReview(q))return null;
 const summary=q.sourceRef.reviewOnly&&q.reviewSummary?q.reviewSummary:'쓴 답과 까닭을 선생님과 함께 확인해요.';
 return `<section class="source-review"><p class="lead"><b>선생님과 확인해요.</b> ${esc(summary)}</p>${q.sourceRef.reviewOnly?`<p class="lead">인쇄된 답 참고: ${esc(sourceAnswerText(q,{printed:true}))} · 자동 정오 판정 보류</p>`:''}</section>`;
}
