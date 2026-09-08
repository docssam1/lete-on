(function () {
  "use strict";
  const bank = window.HFChallengeBank;
  const questionSheets = document.getElementById("questionSheets");
  const conceptSheets = document.getElementById("conceptSheets");
  let seed = Number(new URLSearchParams(location.search).get("seed")) || 60801;

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    })[character]);
  }

  function chunks(values, size) {
    const out = [];
    for (let index = 0; index < values.length; index += size) out.push(values.slice(index, index + size));
    return out;
  }

  function questionCard(question, number) {
    return `<article class="question-card" data-type="${escapeHtml(question.typeId)}">` +
      `<span class="question-no">${number}</span>` +
      `<div class="question-meta"><b>${escapeHtml(question.typeLabel)}</b><span class="difficulty">${escapeHtml(question.difficultyLabel)}</span></div>` +
      `<p class="question-prompt">${escapeHtml(question.prompt)}</p>` +
      `<div class="visual-wrap">${question.problemHtml}</div>` +
      `<div class="answer-box">정답 ${escapeHtml(question.answerHtml)} · 단일정답 후보 1개</div>` +
      `</article>`;
  }

  function renderQuestionSheets() {
    const questions = [];
    bank.listTypes().forEach((type, typeIndex) => {
      bank.difficulties.forEach((difficulty, difficultyIndex) => {
        questions.push(bank.createQuestion(type.id, difficulty, seed + typeIndex * 1009 + difficultyIndex * 101));
      });
    });
    questionSheets.innerHTML = chunks(questions, 3).map((pageQuestions, pageIndex) => (
      `<section class="sheet problem-sheet">` +
      `<header class="sheet-head"><div><span>LETE-ON · HYPER FOCUS</span><h2>6세 챌린지 유사문제 검수</h2></div><p>seed ${seed} · ${pageIndex + 1}/${Math.ceil(questions.length / 3)}</p></header>` +
      `<div class="question-list">${pageQuestions.map((question, index) => questionCard(question, pageIndex * 3 + index + 1)).join("")}</div>` +
      `</section>`
    )).join("");
  }

  function conceptBlock(kind, title, copy, question, showAnswer) {
    return `<section class="concept-block ${kind}"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p>` +
      `<p class="question-prompt">${escapeHtml(question.prompt)}</p><div>${question.problemHtml}</div>` +
      `<div class="mini-answer">${showAnswer ? `정답 ${escapeHtml(question.answerHtml)}` : "직접 풀어 보세요."}</div></section>`;
  }

  function renderConceptSheets() {
    conceptSheets.innerHTML = bank.conceptSessions.map((session, index) => {
      const lesson = bank.createConceptSession(session.number, seed + index * 2003);
      const copy = (question, phase) => {
        const concept = bank.types[question.typeId].concept;
        if (phase === "warmup") return concept.warmup;
        if (phase === "example") return concept.rule;
        if (phase === "review") return concept.review;
        return "예제와 같은 방법으로 해결해 보세요.";
      };
      return `<section class="sheet concept-sheet">` +
        `<header class="concept-head"><em>SESSION ${lesson.number}</em><h2>${escapeHtml(lesson.title)}</h2></header>` +
        `<div class="concept-grid">` +
        conceptBlock("warmup", "워밍업", copy(lesson.questions.warmup, "warmup"), lesson.questions.warmup, true) +
        conceptBlock("example", "예제", copy(lesson.questions.example, "example"), lesson.questions.example, true) +
        conceptBlock("practice", "유제", copy(lesson.questions.practice, "practice"), lesson.questions.practice, false) +
        conceptBlock("review", "리뷰", copy(lesson.questions.review, "review"), lesson.questions.review, false) +
        `</div><footer class="concept-foot"><b>GFIELD · LETE-ON</b><span>${index + 1}</span></footer></section>`;
    }).join("");
  }

  function render() {
    renderQuestionSheets();
    renderConceptSheets();
  }

  document.getElementById("regenerate").addEventListener("click", () => {
    seed += 7919;
    history.replaceState(null, "", `${location.pathname}?seed=${seed}`);
    render();
  });
  document.getElementById("toggleAnswers").addEventListener("click", (event) => {
    document.body.classList.toggle("show-answers");
    event.currentTarget.textContent = document.body.classList.contains("show-answers") ? "정답 숨기기" : "정답 보기";
  });
  document.getElementById("printQuestions").addEventListener("click", () => {
    document.body.dataset.print = "questions";
    window.print();
    delete document.body.dataset.print;
  });
  document.getElementById("printConcepts").addEventListener("click", () => {
    document.body.dataset.print = "concepts";
    window.print();
    delete document.body.dataset.print;
  });

  render();
})();
