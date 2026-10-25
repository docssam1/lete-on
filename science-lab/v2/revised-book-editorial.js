import {learningRailTitle} from './revised-learning-book.js?v=20261025';
// 개념·유형 연습·탐구·평가를 같은 지면 규약으로 조판한다. 기존 교재는 opt-in 전까지 그대로 둔다.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const marks = ['①','②','③','④','⑤'];
const labels = {choice:'객관식',multi:'모두 고르기',blank:'빈칸 넣기',short:'단답형',match:'연결하기',order:'순서 배열',draw:'그림 완성',written:'서술형'};
const lines = n => `<div class="ed-lines">${'<i></i>'.repeat(n)}</div>`;
const rich = (ch, t) => (ch?.richText ? esc(t).replace(/\*\*(.+?)\*\*/g, '<strong class="ed-term">$1</strong>') : esc(t));
function blankText(text) { return esc(text).replace(/\[\s*\]/g, '<span class="ed-blank" aria-label="빈칸"></span>'); }
function question(q, art, key = false) {
  if (!q || !labels[q.form]) throw Error('편집 교재 문항 또는 응답 형식이 없습니다.');
  return `<li class="ed-question" data-question="${esc(q.id)}" data-form="${esc(q.form)}"><div class="ed-qhead"><b>${String(q.no).padStart(2,'0')}</b><span>${esc(q.formLabel||labels[q.form])}</span></div><p>${blankText(q.prompt)}</p>${q.given ? `<div class="ed-given">${q.given.map(esc).join('<br>')}</div>` : ''}${q.figure ? `<div class="ed-diagram">${art[q.figure] || ''}</div>` : ''}${q.choices ? `<ol class="ed-choices">${q.choices.map((c,i)=>`<li><span>${marks[i]}</span>${esc(c)}</li>`).join('')}</ol>` : ''}${q.parts ? q.parts.map(t=>q.answerPerPart?`<p class="ed-part">${esc(t.replace(/\[\s*\]/g,''))}</p>${key?'':'<p class="ed-response ed-part-response">답 <span></span></p>'}`:`<p class="ed-part">${blankText(t)}</p>`).join('') : ''}${q.form==='draw' ? `<div class="ed-drawing${q.drawing==='large'?' large':''}" aria-label="그림과 이름표를 그리는 칸"></div>${q.drawingExplanationLines&&!key?lines(q.drawingExplanationLines):''}` : ''}${q.form==='written' ? (key ? '' : lines(q.lines || 3)) : (!q.answerPerPart&&['short','match','order','multi'].includes(q.form)) ? '<p class="ed-response">답 <span></span></p>' : ''}${key ? `<p class="ed-key"><b>${esc(q.inlineAnswerLabel||((q.responseContract?.teacherRequired||['written','draw'].includes(q.form))?'예시 답':'정답'))}</b> ${esc(q.answer)}</p>` : ''}</li>`;
}
function block(b,ch,art,teacher=false) {
  if(b.type==='text') return `<p>${rich(ch,b.text)}</p>`;
  if(b.type==='heading') return `<h3>${esc(b.text)}</h3>`;
  if(b.type==='list') return `<${b.ordered?'ol':'ul'} class="ed-list">${b.items.map(t=>`<li>${rich(ch,t)}</li>`).join('')}</${b.ordered?'ol':'ul'}>`;
  if(b.type==='diagram') {if(!art[b.key])throw Error(`교재 그림 누락: ${b.key}`);return `<figure class="ed-diagram">${art[b.key]}${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`;}
  if(b.type==='gallery') return `<figure class="ed-gallery${b.numbered?' numbered':''}" style="--gallery-cols:${b.cols||b.items.length}">${b.items.map((it,i)=>`<div class="ed-gallery-item">${it.key?art[it.key]||'':`<img src="${esc(it.src)}" alt="${esc(it.alt||'')}" loading="eager">`}<p>${b.numbered?`<b>${'①②③④⑤⑥'[i]}</b> `:''}${esc(it.cap)}</p></div>`).join('')}${b.credit?`<small class="ed-photo-credit">${esc(b.credit)}</small>`:''}</figure>`;
  if(b.type==='example') return `<section class="ed-example"><h3>함께 푸는 예제</h3><p class="ed-example-q">${esc(b.question)}</p><ol>${b.steps.map(([a,t])=>`<li><b>${esc(a)}</b><p>${esc(t)}</p></li>`).join('')}</ol><p class="ed-example-answer">${esc(b.answer)}</p></section>`;
  if(b.type==='questions') return `<ol class="ed-questions">${b.ids.map(id=>question(ch.questions.find(q=>q.id===id),art,teacher&&ch.inlineAnswers)).join('')}</ol>`;
  if(b.type==='table') return `<table class="ed-table"><thead><tr>${b.heads.map(t=>`<th scope="col">${esc(t)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr>${row.map((t,i)=>`<${i?'td':'th'}${i?'':' scope="row"'}>${blankText(t)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
  if(b.type==='field') return `<section class="ed-field"><h3>${esc(b.title)}</h3>${b.hint?`<p class="ed-hint">${esc(b.hint)}</p>`:''}${b.draw?`<div class="ed-drawing${b.draw===true?' large':''}"></div>`:lines(b.lines||3)}</section>`;
  if(b.type==='solutions') return b.ids.map(id=>{const q=ch.questions.find(q=>q.id===id);return `<section class="ed-solution" data-solution="${esc(id)}"><h3>${String(q.no).padStart(2,'0')} <span>${esc(q.formLabel||labels[q.form])}</span> · ${esc(q.topic)}</h3><p><b>정답${q.form==='written'||q.form==='draw'?' 예시':''}</b> ${esc(q.answer)}</p><p><b>풀이</b> ${esc(q.explanation)}</p><p><b>오개념 점검</b> ${esc(q.misconception)}</p><p><b>인정 답안·지도 기준</b> ${esc(q.criteria)}</p></section>`;}).join('');
  throw Error(`알 수 없는 편집 교재 블록: ${b.type}`);
}
export function renderEditorialChapter(ch,art,{teacher=false,live=false}={}) {
  const pages=teacher?[...(ch.teacherStudentPages||ch.pages),...ch.teacherPages]:ch.pages;
  const content=p=>{
    if(!ch.verticalFlow)return p.blocks.map(b=>block(b,ch,art,teacher)).join('');
    const groups=[];let group=[];
    const flush=()=>{if(group.length){groups.push(group);group=[];}};
    for(const b of p.blocks){
      if(b.type==='heading'){flush();group.push(b);}
      else if(['text','list'].includes(b.type))group.push(b);
      else if(b.type==='solutions'){flush();for(const id of b.ids)groups.push([{...b,ids:[id]}]);}
      else{flush();groups.push([b]);}
    }flush();
    return `<div class="ed-flow">${groups.map(g=>`<div class="ed-block ed-block-${esc(g[0].type)}">${g.map(b=>block(b,ch,art,teacher)).join('')}</div>`).join('')}</div>`;
  };
  return `<div class="bk bk-life bk-editorial revised-workbook${live?' live':''} ${teacher?'bk-t':''}${ch.verticalFlow?' ed-full-height':''}" data-unit="${esc(ch.unit)}" style="--bk-theme:${esc(ch.theme)}">${pages.map((p,i)=>p.kind==='duplex-blank'?`<section class="bk-page ed-duplex-blank" data-page="${i+1}" aria-label="양면 인쇄용 빈 면"></section>`:`<section class="bk-page ed-${esc(p.kind||'learn')}${p.layout?` ed-layout-${esc(p.layout)}`:''}" data-page="${i+1}"><div class="bk-life-watermark" aria-hidden="true">GFIELD · 지필드</div><header class="bk-band"><span class="bk-band-no">${esc(String(ch.no).padStart(2,'0'))}</span><span class="bk-band-t">${esc(ch.title)}</span><span class="bk-band-u">${teacher?'교사용':'학생용'} · ${esc(ch.semester)}</span></header><div class="ed-layout"><main class="ed-main"><p class="ed-kicker">${esc(p.section)}</p><h2>${esc(p.title)}</h2>${p.lead?`<p class="ed-lead">${esc(p.lead)}</p>`:''}${content(p)}</main><aside class="ed-rail" aria-label="${esc(p.title)} 보조 학습">${p.rail.map((r,index)=>`<section class="ed-note"><h3>${esc(learningRailTitle(ch,r.title,index))}</h3>${r.text?`<p>${esc(r.text)}</p>`:''}${r.items?`<ul>${r.items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}${r.write?lines(r.write):''}</section>`).join('')}${teacher&&p.teacherNote?`<section class="ed-note ed-teacher-note"><h3>지도 메모</h3><p>${esc(p.teacherNote)}</p></section>`:''}</aside></div><footer class="bk-foot"><span>${esc(ch.book)} · ${esc(ch.title)}</span><span class="bk-pn">${i+1}</span></footer></section>`).join('')}</div>`;
}
