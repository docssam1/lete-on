// 원문이 없는 창작 은행의 문제지. 수업 교재·공식 시험지와 구별한다.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const circ = ['①','②','③','④','⑤'];
export function practiceAnswer(q) {
  const a = q.answerContract;
  if (a.type === 'single-choice') return circ[a.answer];
  if (a.type === 'multi-choice') return a.answers.map(i => circ[i]).join(', ');
  return a.sample || a.answer;
}
export function practicePaperHtml({unit, title, course, items, references = [], mode = 'student'}) {
  const teacher = mode === 'teacher', answers = mode === 'answers';
  return `<div class="book bank-practice-paper"><div class="bank-print-watermark" aria-hidden="true">GFIELD · 지필드</div>
  <nav class="wrap no-print print-bar" aria-label="창작 문제지 도구"><a class="btn" href="#/${unit}/sub/E1">소단원으로</a>${[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만']].map(([m,l])=>`<a class="btn" href="#/${unit}/print/${m}"${mode===m?' aria-current="page"':''}>${l}</a>`).join('')}<button class="btn primary" onclick="print()">A4 인쇄</button></nav>
  <main class="wrap"><section class="page"><p>GFIELD · 초등 과학 ${esc(String(course).replace(/^초등\s*/,''))}</p><h2>${esc(title)} · 창작 학습</h2><p>${teacher?'교사용 · 정답과 해설':answers?'정답·해설':'학생용 · 이름 ____________________'}</p><p>${items.length}문항 · 직접 만든 학습 자료이며 원문 시험지나 공식 배점표가 아니에요. 가상 자료·모형과 실제 관찰을 구별해요. 문제 응답만으로 실제 실천·공유를 완료한 것으로 세지 않아요.</p>${references.length?`<p class="practice-references">내용 근거: ${references.map(r=>`<a href="${esc(r.url)}">${esc(r.title)}</a>`).join(' · ')}. 보건 수칙은 어른과 현재 안내를 확인해요.</p>`:''}
  ${items.map((q,i)=>{const a=q.answerContract,show=teacher||answers;return `<article class="q" data-paper-item="${esc(q.id)}"><p><b class="no">${i+1}.</b> ${esc(q.prompt)}</p>${!answers&&q.givens?Object.values(q.givens).map(v=>`<p class="practice-given">${esc(v)}</p>`).join(''):''}${!answers&&q.choices?`<div>${q.choices.map((c,j)=>`<div>${circ[j]} ${esc(c)}</div>`).join('')}</div>`:''}${show?`<div class="practice-key"><p class="ans">${a.sample?'예시 답':'정답'}: ${esc(practiceAnswer(q))}</p><p>${esc(q.explanation)}</p>${a.rubric?`<p>학습 확인 기준: ${a.rubric.required.map(esc).join(' / ')}. 다른 타당한 설명은 선생님과 확인해요.</p>`:''}</div>`:a.type==='short-text'?'<div class="ans-line"></div>':a.type==='written-explanation'?'<div class="ans-line"></div><div class="ans-line"></div><div class="ans-line"></div>':''}</article>`;}).join('')}
  </section></main></div>`;
}
