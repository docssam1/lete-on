(function () {
  "use strict";
  const bank = window.HFChallengeBank;
  const pages = document.getElementById("examPages");
  const roundInput = document.getElementById("round");
  const studentInput = document.getElementById("studentName");
  let seed = Number(new URLSearchParams(location.search).get("seed")) || 62001;

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
  }

  function chunks(values, size) {
    const out = [];
    for (let index = 0; index < values.length; index += size) out.push(values.slice(index, index + size));
    return out;
  }

  function watermark(studentName) {
    return '';
  }

  const logo=()=>'<div class="exam-logo"><img src="assets/gfield-logo.png" alt="지필드"><b>LETE-ON</b></div>';
  function firstHeader(exam,studentName){
    return `<div class="exam-first-header"><div class="exam-masthead">${logo()}<h1><small>2026년 9월 챌린지 대비</small>모의고사 ${exam.round}회</h1><span>시험시간 60분</span></div><div class="candidate-fields"><label>이름 <span>${studentName==='학생이름'?'':escapeHtml(studentName)}</span></label><label>유치원 <span></span></label></div><div class="exam-notice"><b>주의사항</b><ol><li>문제를 끝까지 읽고, 답을 알맞은 자리에 쓰세요.</li><li>그림이나 표에 표시하는 문제는 지시한 방법대로 표시하세요.</li><li>어려운 문제는 넘어갔다가 남은 시간에 다시 풀어도 됩니다.</li></ol></div></div>`;
  }

  function problemPage(exam, group, pageIndex, studentName,extra=false) {
    return `<section class="exam-page problem-page${extra?' supplement-page':''}${pageIndex===0?' first-problem-page':''}" ${watermark(studentName)}>${pageIndex===0?firstHeader(exam,studentName):`<header class="problem-page-head">${logo()}<b>챌린지 모의고사 ${exam.round}회${extra?' · 추가 연습':''}</b></header>`}<div class="problem-list">${group.map((question) => `<article class="exam-question" data-type="${question.typeId}"><b class="exam-question-no">${question.number}</b><p>${escapeHtml(question.prompt)}</p><div class="exam-art">${question.problemHtml}</div><div class="response-line">답: <span aria-hidden="true"></span></div></article>`).join("")}</div><footer class="exam-foot">${pageIndex+1}</footer></section>`;
  }

  function answerPage(exam) {
    return chunks(exam.questions,5).map((group,index)=>`<section class="exam-page answer-page solution-page"><header class="answer-brand">${logo()}<span>교사용</span></header><h1>정답과 풀이 · ${exam.round}회</h1><p>${index+1} / 4 · ${group[0].number}번부터 ${group[group.length-1].number}번까지</p><div class="solution-list">${group.map(q=>`<article class="answer-row solution-row"><b>${q.number}</b><div><strong>${escapeHtml(q.answerHtml)}</strong>${q.solutionDiagram?`<div class="solution-diagram">${q.solutionDiagram}</div>`:''}<p>${escapeHtml(q.solution)}</p></div></article>`).join('')}</div></section>`).join('');
  }

  function answerFrontMatter(exam,precedingPages){
    const spacer=(precedingPages+1)%2===0?'<section class="exam-page blank-page answer-page answer-separator" aria-label="답안 표지 앞 빈 페이지"></section>':'';
    return spacer+`<section class="exam-page answer-page answer-cover-page" aria-label="정답과 풀이 표지">${logo()}<span class="review-badge">교사용</span><div class="cover-title"><h1>정답과 풀이</h1><h2>챌린지 모의고사 ${exam.round}회</h2></div><div class="answer-cover-summary"><p>본시험 20문항 · 추가 연습 6문항</p></div></section>`;
  }

  function supplementAnswers(extra){
    return chunks(extra.questions,3).map((group,index)=>`<section class="exam-page answer-page solution-page supplement-solutions"><header class="answer-brand">${logo()}<span>교사용</span></header><h1>추가 연습 정답과 풀이 · ${extra.round}회</h1><p>${index+1} / 2 · 추가 연습 ${group[0].number}번부터 ${group[group.length-1].number}번까지</p><div class="solution-list">${group.map(q=>`<article class="answer-row solution-row"><b>${q.number}</b><div><strong>${escapeHtml(q.answerHtml)}</strong>${q.solutionDiagram?`<div class="solution-diagram">${q.solutionDiagram}</div>`:''}<p>${escapeHtml(q.solution)}</p></div></article>`).join('')}</div></section>`).join('');
  }

  function render() {
    const round = Number(roundInput.value);
    if(!window.HFChallengeAccess?.allow('challenge-mock-'+round)){pages.replaceChildren();studentInput.value='승인 학생 없음';return;}
    const studentName = window.HFChallengeAccess?.approvedStudentName?.() || "학생이름";
    studentInput.value=studentName==='학생이름'?'승인 학생 없음':studentName;
    const exam = bank.createMockExam(round, seed);
    const extra=window.HFChallengeSupplement.get(round);
    document.body.dataset.round=String(round);
    const regenerate=document.getElementById('regenerateExam');
    regenerate.disabled=exam.generationPolicy==='fixed-authored';
    regenerate.textContent=regenerate.disabled?`${round}회 별도 구성본`:'1회 다시 생성';
    const mainGroups=chunks(exam.questions,2),extraGroups=chunks(extra.questions,2);
    pages.innerHTML = mainGroups.map((group, index) => problemPage(exam, group, index, studentName)).join("") + extraGroups.map((group,index)=>problemPage(exam,group,index+mainGroups.length,studentName,true)).join('') + answerFrontMatter(exam,mainGroups.length+extraGroups.length)+answerPage(exam)+supplementAnswers(extra);
    const mark='GFIELD · LETE-ON'+(studentName==='학생이름'?'':' · '+studentName);
    pages.querySelectorAll('.problem-list').forEach(list=>list.style.gridTemplateRows=`repeat(${list.children.length}, minmax(0, 1fr))`);
    pages.querySelectorAll('.exam-page:not(.blank-page)').forEach(p=>{const layer=document.createElement('div');layer.className='watermark';layer.setAttribute('aria-hidden','true');for(let i=0;i<3;i++){const s=document.createElement('span');s.textContent=mark;layer.appendChild(s);}p.appendChild(layer);});
  }

  roundInput.addEventListener("change", render);
  studentInput.addEventListener("input", render);
  window.addEventListener('hfchallengeaccesschange',render);
  document.getElementById("regenerateExam").addEventListener("click", () => { seed += 7919; render(); });
  function printMode(mode){if(!window.HFChallengeAccess?.allow('challenge-mock-'+roundInput.value)){render();return;}document.body.dataset.print=mode;window.print();delete document.body.dataset.print;}
  document.getElementById("printExam").addEventListener("click", () => printMode('exam'));
  document.getElementById("printAnswers").addEventListener("click", () => printMode('answers'));
  const requestedRound=new URLSearchParams(location.search).get('round');
  if(['1','2','3','4'].includes(requestedRound))roundInput.value=requestedRound;
  render();
})();
