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
    const catalog=window.HFConceptCatalog;
    if(catalog){
      const lessons=catalog.build(seed);
      conceptSheets.innerHTML=`<section class="sheet"><header class="sheet-head"><h2>개념 교재 1·2회 · ${lessons.length}개 세부 유형</h2></header><p>회당 8단원에서 대표유형 1문제와 유제 4문제를 풀고, REVIEW 15문제로 확인합니다. 예제의 답과 풀이도 뒤쪽 답안에서만 확인합니다.</p><p><a href="concepts.html?round=1">개념 교재 1회 열기</a> · <a href="concepts.html?round=2">개념 교재 2회 열기</a></p><ol>${lessons.map(l=>`<li style="margin:8px 0">${escapeHtml(l.title)}</li>`).join('')}</ol></section>`;
      return;
    }
    throw new Error('전 유형 개념 교재를 불러오지 못했습니다.');
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
    location.href='concepts.html';
  });

  render();
})();
