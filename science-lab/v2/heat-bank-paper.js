// 열 단원 원문·짝·독립보충의 동일 객체로 화면/인쇄 번호와 정답을 연결한다.
import {photoFigureHtml} from './photo-figure.js';
import {sourceCaption,sourceTableHtml,sourceChoiceHtml} from './source-presentation.js';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const circ='①②③④⑤';
export const solutionAnswer=a=>a.type==='single-choice'?circ[a.answer]:a.type==='multi-choice'?a.answers.map(i=>circ[i]).join(', '):a.sample??a.answer;
export function heatBankPaperHtml({unit,source,similar,items,mode='student'}){
 const show=mode!=='student',only=mode==='answers',quick=mode==='quick',all=[...source,...similar,...items];let no=0;
 const blankText=s=>esc(s).replace(/\[\s*\]|□/g,'<span class="heat-paper-blank"></span>');
 const line=()=>'<div class="solution-answer-line"></div>';
 const partText=(value,lines)=>{const parts=String(value).split(/(?=\([1-9]\))/);return parts.map(t=>`<p>${blankText(t)}</p>${lines&&/^\([1-9]\)/.test(t)?line():''}`).join('');};
 const given=(k,v,lines)=>sourceTableHtml(v)||(v&&typeof v==='object'&&!Array.isArray(v)?`<table class="solution-table"><thead><tr>${Object.keys(v).map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody><tr>${Object.values(v).map(c=>`<td>${esc([].concat(c).join(', '))}</td>`).join('')}</tr></tbody></table>`:`<div class="solution-given">${['지문','자료'].includes(k)?'':`<b>${esc(k)}</b>`}${partText(Array.isArray(v)?v.join(k==='문항'?'\n':' / '):v,lines)}</div>`);
 const ref=q=>q.sourceRef.type==='original'?sourceCaption(q.sourceRef):q.sourceRef.type==='similar'?`독립 짝 · 옛${q.sourceRef.of.course?.replace('초등 ','')} 세트${q.sourceRef.of.originalSet} ${q.sourceRef.of.no}번 대응`:'현행 범위 독립 보충';
 const card=q=>{
  const a=q.answerContract,n=++no,review=q.sourceRef.reviewOnly,parts=q.prompt.split(/\n(?=\([1-9]\))/),hasParts=parts.length>1,givenParts=Object.values(q.givens||{}).some(v=>/\([1-9]\)/.test(Array.isArray(v)?v.join('\n'):typeof v==='string'?v:''));
  return `<article class="solution-question" data-paper-item="${esc(q.id)}"><div class="heat-card-main"><p class="solution-prompt"><b>${n}.</b> ${blankText(only?q.prompt:parts[0])}</p><p class="solution-ref">${esc(ref(q))}${review?' · 교사와 자료 검토':''}</p>${!only&&q.givens?Object.entries(q.givens).map(([k,v])=>given(k,v,!show)).join(''):''}${!only&&q.photoLabels?photoFigureHtml(q):!only&&q.figure?`<img class="solution-figure${q.figureLayout==='tall'?' solution-tall':''}" src="../${esc(q.figure)}" alt="${esc(q.figureNote)}">`:''}${!only&&hasParts?parts.slice(1).map(t=>`<p class="solution-part">${blankText(t)}</p>${show?'':line()}`).join(''):''}${!only&&q.choices?`<div class="solution-choices">${q.choices.map((c,i)=>`<p>${circ[i]} ${sourceChoiceHtml(q,c,i)}</p>`).join('')}</div>`:''}${show?`<div class="solution-key"><p><b>${review?'판정':a.type==='written-explanation'?'예시 답':'정답'}:</b> ${esc(review?'자동 채점 보류 · 교사와 자료 검토':solutionAnswer(a))}</p>${review?`<p><b>인쇄된 공식 답 참고:</b> ${esc(solutionAnswer(q.printedAnswerContract))} · 자동 정오 판정 보류</p>`:''}<p>${esc(q.explanation)}</p>${q.sourcePrintedRubric?.length?`<p><b>원문 교사용 기준 참고:</b> ${q.sourcePrintedRubric.map(c=>esc(c.criterion)+' ('+esc(c.ratio)+')').join(' / ')}</p>`:''}${a.rubric?`<p><b>확인 기준:</b> ${a.rubric.required.map(esc).join(' / ')}. 표현이 달라도 타당한 근거는 교사와 확인합니다.</p>`:''}</div>`:!hasParts&&!givenParts&&a.type==='short-text'?line():q.bookResponseForm==='draw'?'<div class="solution-drawing"></div>'+line():a.type==='written-explanation'?line()+line()+line():''}<div class="heat-card-work"><span>${show?'지도 · 검토 메모':'풀이 · 생각한 까닭'}</span><div class="heat-work-lines"></div></div></div><aside class="heat-card-rail"><h3>검토 메모</h3><p>조건·단위·요구한 응답을 확인해요.</p><div class="heat-rail-lines"></div></aside></article>`;
 };
 const tools=`<nav class="solution-tools no-print" aria-label="문항집 인쇄 도구"><a class="btn" href="#/${unit.id}/sub/E1">소단원으로</a>${[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만'],['quick','빠른 정답표']].map(([m,l])=>`<a class="btn" href="#/${unit.id}/print/${m}"${m===mode?' aria-current="page"':''}>${l}</a>`).join('')}<button class="btn primary" data-solution-print disabled>A4 인쇄</button><p role="status" data-print-status>글꼴과 그림을 준비하고 있어요.</p></nav>`;
 const body=quick?`<h2>빠른 정답표</h2><p>서술형은 예시 답으로 자동 확정하지 않습니다. 자료 검토 문항은 교사 해설에서 공식 답과 조건을 비교하세요.</p><div class="solution-quick">${all.map((q,i)=>`<div data-paper-item="${esc(q.id)}"><b>${i+1}.</b> ${q.sourceRef.reviewOnly?'교사와 자료 검토':q.answerContract.type==='written-explanation'?'서술 · 교사 확인':esc(solutionAnswer(q.answerContract))}</div>`).join('')}</div>`:[['원문 · 실제 출처와 번호 보존',source],['짝문항 · 독립 창작',similar],['현행 범위 보충 · 독립 창작',items]].map(([title,rows])=>`<section class="solution-section"><h2>${title}</h2>${rows.map(card).join('')}</section>`).join('');
 return `<div class="solution-bank-paper heat-bank-paper gfield-ui">${tools}<div class="solution-watermark" aria-hidden="true">GFIELD · 지필드</div><main class="solution-paper"><header><p>GFIELD · 지필드 | 초등 과학5-2 · 2022 개정 학습</p><h1>${esc(unit.title)} · ${quick?'빠른 정답표':only?'정답과 해설':'문제은행 문항집'}</h1><p>${show?'교사용':'학생용 · 이름 ____________________ · 날짜 ______________'}</p><p>옛5-1 온도와 열 원문75 · 독립 짝75 · 교재 연계104 =254문항. 원문은 네 세트10·20·20·25문항이며 출처·쪽·원래 번호를 보존했습니다. 현행5-2 새 판본 전체 원문 확보를 뜻하지 않습니다.</p><p>원문4개는 조건과 자료 범위를 교사와 검토하며 자동 채점을 보류합니다. 인쇄된 공식 답은 교사 해설에 보존했습니다. 짝 문항은 각자의 조건으로 풀 수 있고, 교재 연계104문항은 학생용 교재의1~104번과 같습니다.</p><p>창작 사진에는AI 실사형 설명 이미지 표시를 붙였습니다. 연습 수치/AI사진을 실제 관찰·제작·전달 근거로 쓰지 않습니다. 원문 불꽃/뜨거운 물 장면은 자료 해석용이며 학생 혼자 실행하지 않습니다.</p><p><a href="#/${unit.id}/lab-book/student">실사형 개념·탐구 교재53쪽</a> · <a href="#/${unit.id}/lab-book/teacher">교사용 교재79쪽</a></p></header>${body}</main></div>`;
}
// 글꼴과 사진의 실제 높이로 A4를 나눈 뒤 남은 높이를 작성 공간에 배분한다.
// 원문/정답 노드는 복제하지 않아 화면·인쇄의 문항 수와 번호가 같다.
export function paginateHeatBank(root){
 const main=root.querySelector('.solution-paper'),host=root.querySelector('.heat-bank-paper');
 if(!main||main.querySelector('.heat-bank-sheet'))return;
 const original=main.innerHTML;
 try{
 host.classList.add('heat-layout-measure');
 const nodes=[...main.children].flatMap(el=>{
  if(el.matches('.solution-section'))return [...el.children];
  if(el.matches('.solution-quick')){
   const cells=[...el.children],rows=[];
   for(let i=0;i<cells.length;i+=3){const row=document.createElement('div');row.className='heat-quick-row';row.append(...cells.slice(i,i+3));rows.push(row);}return rows;
  }return[el];
 });
 main.replaceChildren();let sheet;
 const next=()=>{sheet=document.createElement('section');sheet.className='heat-bank-sheet heat-sheet-measure';sheet.dataset.paperPage=String(main.children.length+1);main.append(sheet);};
 const height=el=>{const s=getComputedStyle(el);return el.getBoundingClientRect().height+parseFloat(s.marginTop)+parseFloat(s.marginBottom);};
 const used=()=>{const s=getComputedStyle(sheet);return [...sheet.children].reduce((n,e)=>n+height(e),0)+Math.max(0,sheet.children.length-1)*parseFloat(s.rowGap);};
 const available=()=>{const s=getComputedStyle(sheet);return sheet.clientHeight-parseFloat(s.paddingTop)-parseFloat(s.paddingBottom)-2;};
 next();
 for(const node of nodes){
  sheet.append(node);
  if(used()>available()&&sheet.children.length>1){
   node.remove();const heading=sheet.lastElementChild?.tagName==='H2'?sheet.lastElementChild:null;
   heading?.remove();next();if(heading)sheet.append(heading);sheet.append(node);
  }
  if(used()>available())node.classList.add('heat-card-compact');
  if(used()>available())throw new Error('A4 지면보다 큰 문항이 있습니다.');
  if(node.matches('.solution-question'))node.style.setProperty('--heat-card-min',`${Math.ceil(height(node))}px`);
 }
 // 빠른표의 마지막 몇 행만 한 쪽을 차지하지 않게 뒤쪽 지면에 고르게 나눈다.
 const trailing=[...main.children].slice(1);
 if(main.querySelector('.heat-quick-row')&&trailing.length>1){
  const rows=trailing.flatMap(p=>[...p.children]);let offset=0;
  trailing.forEach((p,i)=>{const count=Math.ceil((rows.length-offset)/(trailing.length-i));p.replaceChildren(...rows.slice(offset,offset+count));offset+=count;});
 }
 for(const page of main.children)page.classList.remove('heat-sheet-measure');
 host.dataset.typeset='ready';
 }catch(error){main.innerHTML=original;throw error;}
 finally{host.classList.remove('heat-layout-measure');}
}
export function wireHeatBankPaper(root){
 let active=true;const button=root.querySelector('[data-solution-print]'),status=root.querySelector('[data-print-status]'),imgs=[...root.querySelectorAll('img')];
 const ready=im=>im.complete?(im.naturalWidth?Promise.resolve():Promise.reject(new Error('image'))):new Promise((resolve,reject)=>{im.addEventListener('load',resolve,{once:true});im.addEventListener('error',reject,{once:true});});
 Promise.all([document.fonts.load('700 18px Gaegu'),document.fonts.ready,...imgs.map(ready)]).then(()=>{if(active&&root.isConnected){paginateHeatBank(root);button.disabled=false;status.textContent='그림·글꼴과 A4 지면이 준비되었습니다.';}}).catch(()=>{if(active&&root.isConnected)status.textContent='그림 또는 지면을 불러오지 못했어요. 다시 열어 주세요.';});
 const print=()=>{if(!button.disabled)window.print();};button.addEventListener('click',print);return()=>{active=false;button.removeEventListener('click',print);};
}
