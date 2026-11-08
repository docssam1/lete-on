import{acidCurrentItems}from'./acid-question-language.js?v=20261104-acid-class';
// 산과 염기 원문·짝·교재266문항의 동일 객체로 화면과 문항집을 연결한다.
import {wireEnergyBankPaper as wireAcidBankPaper} from './energy-bank-paper.js?v=20261108-bank-print-ready';
export {wireAcidBankPaper};
import {photoFigureHtml} from './photo-figure.js?v=20261104-weather-class';
import {sourceCaption,sourceChoiceHtml} from './source-presentation.js';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const circ='①②③④⑤';
export const solutionAnswer=a=>a.type==='single-choice'?circ[a.answer]:a.type==='multi-choice'?a.answers.map(i=>circ[i]).join(', '):a.sample??a.answer;
export function acidBankPaperHtml({unit,source,similar,items,mode='student'}){
 items=acidCurrentItems(items);
 const show=mode!=='student',only=mode==='answers',quick=mode==='quick',all=[...source,...similar,...items];let no=0;
 const blankText=s=>esc(s).replace(/\[\s*\]|□/g,'<span class="energy-paper-blank"></span>');
 const line=()=>'<div class="solution-answer-line"></div>';
 const partText=(value,lines)=>{const parts=String(value).split(/(?=\([1-9]\))/);return parts.map(t=>`<p>${blankText(t)}</p>${lines&&/^\([1-9]\)/.test(t)?line():''}`).join('');};
 const given=(k,v,lines)=>sourceReviewChoicesHtml(k,v,'solution-given')||sourceTableHtml(v,{recordArrays:true})||(v&&typeof v==='object'&&!Array.isArray(v)?`<table class="solution-table"><thead><tr>${Object.keys(v).map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody><tr>${Object.values(v).map(c=>`<td>${esc([].concat(c).join(', '))}</td>`).join('')}</tr></tbody></table>`:`<div class="solution-given">${['지문','자료'].includes(k)?'':`<b>${esc(k)}</b>`}${partText(Array.isArray(v)?v.join(k==='문항'?'\n':' / '):v,lines)}</div>`);
 const ref=q=>q.sourceRef.type==='original'?sourceCaption(q.sourceRef):q.sourceRef.type==='similar'?`독립 짝 · 옛${q.sourceRef.of.course?.replace(/^초등\s*/,'')} 세트${q.sourceRef.of.originalSet} ${q.sourceRef.of.no}번 대응`:'현행 범위 독립 보충';
 const card=q=>{
  const a=q.answerContract,n=++no,review=q.sourceRef.reviewOnly,parts=q.prompt.split(/\n(?=\([1-9]\))/),hasParts=parts.length>1,givenParts=Object.values(q.givens||{}).some(v=>/\([1-9]\)/.test(Array.isArray(v)?v.join('\n'):typeof v==='string'?v:''));
  return `<article class="solution-question" data-paper-item="${esc(q.id)}"><div class="energy-card-main"><p class="solution-prompt"><b>${n}.</b> ${blankText(only?q.prompt:parts[0])}</p><p class="solution-ref">${esc(ref(q))}${review?' · 교사와 자료 검토':''}</p>${!only&&q.givens?Object.entries(q.givens).map(([k,v])=>given(k,v,!show)).join(''):''}${!only&&q.photoLabels?photoFigureHtml(q):!only&&q.figure?`<img class="solution-figure${q.figureLayout==='tall'?' solution-tall':''}" src="../${esc(q.figure)}" alt="${esc(q.figureNote)}">`:''}${!only&&hasParts?parts.slice(1).map(t=>`<p class="solution-part">${blankText(t)}</p>${show?'':line()}`).join(''):''}${!only&&q.choices?`<div class="solution-choices">${q.choices.map((c,i)=>`<p>${circ[i]} ${sourceChoiceHtml(q,c,i)}</p>`).join('')}</div>`:''}${show?`<div class="solution-key"><p><b>${review?'판정':a.type==='written-explanation'?'예시 답':'정답'}:</b> ${esc(review?'자동 채점 보류 · 교사와 자료 검토':solutionAnswer(a))}</p>${review?`<p><b>인쇄된 공식 답 참고:</b> ${esc(solutionAnswer(q.printedAnswerContract))} · 자동 정오 판정 보류</p>`:''}<p>${esc(q.explanation)}</p>${q.printedExplanation?`<p class="acid-printed-explanation"><b>인쇄 해설 원문:</b> ${esc(q.printedExplanation)}</p>`:''}${q.sourcePrintedRubric?`<p><b>원문 교사용 기준 참고:</b> ${esc(q.sourcePrintedRubric.full)} / ${esc(q.sourcePrintedRubric.partial)}</p>`:''}${a.rubric?`<p><b>확인 기준:</b> ${a.rubric.required.map(s=>esc(s.replace(/[.。]+$/,''))).join(' / ')}. 표현이 달라도 타당한 근거는 교사와 확인합니다.</p>`:''}</div>`:!hasParts&&!givenParts&&a.type==='short-text'?line():q.bookResponseForm==='draw'?'<div class="solution-drawing"></div>'+line():a.type==='written-explanation'?line()+line()+line():''}<div class="energy-card-work"><span>${show?'지도 · 검토 메모':'풀이 · 생각한 까닭'}</span><div class="energy-work-lines"></div></div></div><aside class="energy-card-rail"><h3>검토 메모</h3><p>조건·단위·요구한 응답을 확인해요.</p><div class="energy-rail-lines"></div></aside></article>`;
 };
 const tools=`<nav class="solution-tools no-print" aria-label="문항집 인쇄 도구"><a class="btn" href="#/${unit.id}/sub/E1">소단원으로</a>${[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만'],['quick','빠른 정답표']].map(([m,l])=>`<a class="btn" href="#/${unit.id}/print/${m}"${m===mode?' aria-current="page"':''}>${l}</a>`).join('')}<button class="btn primary" data-solution-print disabled>A4 인쇄</button><p role="status" data-print-status>글꼴과 그림을 준비하고 있어요.</p></nav>`;
 const body=quick?`<h2>빠른 정답표</h2><p>서술형은 예시 답으로 자동 확정하지 않습니다. 자료 검토 문항은 교사 해설에서 공식 답과 조건을 비교하세요.</p><div class="solution-quick">${all.map((q,i)=>`<div data-paper-item="${esc(q.id)}"><b>${i+1}.</b> ${q.sourceRef.reviewOnly?'교사와 자료 검토':q.answerContract.type==='written-explanation'?'서술 · 교사 확인':esc(solutionAnswer(q.answerContract))}</div>`).join('')}</div>`:[['원문 · 실제 출처와 번호 보존',source],['짝문항 · 독립 창작',similar],['현행 범위 보충 · 독립 창작',items]].filter(([,rows])=>rows.length).map(([title,rows])=>`<section class="solution-section"><h2>${title}</h2>${rows.map(card).join('')}</section>`).join('');
 return `<div class="solution-bank-paper energy-bank-paper acid-bank-paper gfield-ui">${tools}<div class="solution-watermark" aria-hidden="true">GFIELD · 지필드</div><main class="solution-paper"><header><p>GFIELD · 지필드 | 초등 과학6-1 · 2022 개정 학습</p><h1>${esc(unit.title)} · ${quick?'빠른 정답표':only?'정답과 해설':'문제은행 문항집'}</h1><p>${show?'교사용':'학생용 · 이름 ____________________ · 날짜 ______________'}</p><p>옛5-2 산과 염기 네 세트70문항 중 관련 원문69·독립 짝69·창작 교재128을 합한 총266문항입니다. 원래 세트·쪽·번호를 보존했습니다. 범위 밖 원문4-16은 제외했으며 현행6-1 판본 전체 원문 확보를 뜻하지 않습니다.</p><p>원문3개는 복수 정답 또는 첨가량 비교의 조건을 교사와 검토하며 자동 채점을 보류합니다. 인쇄된 공식 답과 해설 원문은 교사판에 구분해 보존합니다. 색만으로 실제 첨가량·세기를 판단하지 않아요.</p><p>설명 사진과 가상 기록은 실제 관찰 결과가 아닙니다. 용액의 준비·혼합·반응 시범은 교사와 정해진 절차로 진행하고 맛보기·직접 냄새 맡기·피부 접촉을 하지 않아요. 남은 시료는 학교의 폐수·폐기물 처리 기준을 따릅니다.</p></header>${body}</main></div>`;
}

function sourceTableHtml(value, {recordArrays=false}={}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  if (!Array.isArray(value.머리) || !Array.isArray(value.행)) {
    const rows=Object.entries(value), scalar=x=>x==null||['string','number','boolean'].includes(typeof x);
    // 시료 이름→관찰 결과 형태의 원자료도 표로 표시한다. 원문 데이터는 그대로 둔다.
    if(!rows.length||!rows.every(([,x])=>scalar(x)||recordArrays&&Array.isArray(x)&&x.every(scalar)))return '';
    return `<table class="tbl source-table"><thead><tr><th scope="col">항목</th><th scope="col">내용</th></tr></thead><tbody>${rows.map(([key,x])=>`<tr><th scope="row">${esc(key)}</th><td>${esc(Array.isArray(x)?x.join(' / '):x)}</td></tr>`).join('')}</tbody></table>`;
  }
  const headers = value.머리;
  return `<table class="tbl source-table">${value.caption ? `<caption>${esc(value.caption)}</caption>` : ''}<thead><tr>${headers.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${value.행.map((row) => `<tr>${headers.map((_, i) => `<td>${esc(row[i] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function sourceReviewChoicesHtml(key,value,className='') {
  if(key!=='원문 선택지'||!Array.isArray(value))return '';
  return `<div class="${esc(className)} source-review-choices"><b>원문 선택지</b>${value.map(text=>`<p>${esc(text)}</p>`).join('')}</div>`;
}
