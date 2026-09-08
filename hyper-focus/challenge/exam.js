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
    const text = escapeHtml(`GFIELD · LETE-ON · ${studentName || "학생이름"}`);
    return `<div class="watermark" aria-hidden="true"><span>${text}</span><span>${text}</span><span>${text}</span></div>`;
  }

  function cover(exam, studentName) {
    return `<section class="exam-page cover-page"><div class="cover-brand">LETE-ON</div><div class="cover-stamp"><div class="stamp-mark">지필드<br>러닝랩</div><div class="time-box">시험시간<br>60분</div></div><div class="cover-title"><p>PREMIER CHALLENGE</p><h1>${escapeHtml(exam.title)}</h1><h2>모의고사 ${exam.round}회</h2></div><div class="student-fields">${["날짜", "학교", "반", "이름"].map((label) => `<div class="student-field"><span>${label} :</span><span>${label === "이름" && studentName !== "학생이름" ? escapeHtml(studentName) : ""}</span></div>`).join("")}</div></section>`;
  }

  function problemPage(exam, group, pageIndex, studentName) {
    return `<section class="exam-page problem-page">${watermark(studentName)}<header class="problem-page-head"><b>LETE-ON · 6세 챌린지 시험 · ${exam.round}회</b><span>${pageIndex + 3}</span></header><div class="problem-list">${group.map((question) => `<article class="exam-question"><b class="exam-question-no">${question.number}</b><p>${escapeHtml(question.prompt)}</p>${question.problemHtml}</article>`).join("")}</div></section>`;
  }

  function answerPage(exam) {
    return `<section class="exam-page answer-page"><span class="review-badge">검수용</span><h1>정답 · ${exam.round}회</h1><p>문제 데이터와 같은 값에서 생성한 정답입니다.</p><div class="answer-grid">${exam.questions.map((question) => `<div class="answer-row"><b>${question.number}</b><span>${escapeHtml(question.answerHtml)}</span></div>`).join("")}</div></section>`;
  }

  function render() {
    const round = Number(roundInput.value);
    const studentName = studentInput.value.trim() || "학생이름";
    const exam = bank.createMockExam(round, seed);
    pages.innerHTML = cover(exam, studentName) + `<section class="exam-page blank-page" aria-label="빈 페이지"></section>` + chunks(exam.questions, 3).map((group, index) => problemPage(exam, group, index, studentName)).join("") + answerPage(exam);
  }

  roundInput.addEventListener("change", render);
  studentInput.addEventListener("input", render);
  document.getElementById("regenerateExam").addEventListener("click", () => { seed += 7919; render(); });
  document.getElementById("printExam").addEventListener("click", () => { document.body.dataset.print = "exam"; window.print(); delete document.body.dataset.print; });
  document.getElementById("printAnswers").addEventListener("click", () => { document.body.dataset.print = "answers"; window.print(); delete document.body.dataset.print; });
  render();
})();
