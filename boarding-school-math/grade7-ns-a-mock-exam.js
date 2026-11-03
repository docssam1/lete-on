(function () {
  "use strict";
  const exam = window.GFIELDGrade7NSAExam;
  if (!exam || !Array.isArray(exam.items) || exam.items.length !== 12) return;
  const answers = new Map();
  const startPanel = document.getElementById("mock-start-panel");
  const examPanel = document.getElementById("mock-exam-panel");
  const resultPanel = document.getElementById("mock-results");
  const questionList = document.getElementById("mock-question-list");
  const progress = document.getElementById("mock-progress");
  const timer = document.getElementById("mock-timer");
  const labels = "ABCD";
  let secondsLeft = exam.durationMinutes * 60;
  let timerId = null;
  let submitted = false;

  function addMath(target, value) {
    if (window.GFIELDMathText) window.GFIELDMathText.append(target, value);
    else target.textContent = String(value);
  }
  function createQuestion(item, index) {
    const card = document.createElement("article");
    card.className = "mock-question";
    card.id = `mock-question-${item.id}`;
    card.dataset.itemId = item.id;
    const header = document.createElement("header");
    const number = document.createElement("strong");
    number.textContent = `문항 ${index + 1}`;
    const scope = document.createElement("span");
    scope.textContent = `${item.standard} · ${item.focus}`;
    header.append(number, scope);
    const prompt = document.createElement("h2");
    prompt.id = `mock-prompt-${item.id}`;
    addMath(prompt, item.prompt);
    const choices = document.createElement("div");
    choices.className = "mock-choices";
    choices.setAttribute("role", "group");
    choices.setAttribute("aria-labelledby", prompt.id);
    item.choices.forEach(function (choice, choiceIndex) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mock-choice";
      button.dataset.choiceIndex = String(choiceIndex);
      button.setAttribute("aria-pressed", "false");
      const mark = document.createElement("span");
      mark.className = "mock-choice-mark";
      mark.textContent = labels[choiceIndex];
      const value = document.createElement("span");
      addMath(value, choice);
      button.append(mark, value);
      button.addEventListener("click", function () {
        if (submitted) return;
        answers.set(item.id, choiceIndex);
        choices.querySelectorAll("button").forEach(function (option) {
          const selected = option === button;
          option.setAttribute("aria-pressed", String(selected));
        });
        updateProgress();
      });
      choices.append(button);
    });
    card.append(header, prompt, choices);
    return card;
  }
  function updateProgress() {
    progress.textContent = `${answers.size} / ${exam.items.length} 응답`;
  }
  function showTime() {
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    timer.textContent = `${minutes}:${seconds}`;
  }
  function renderResults(timeExpired) {
    submitted = true;
    if (timerId) window.clearInterval(timerId);
    examPanel.hidden = true;
    resultPanel.hidden = false;
    const correctCount = exam.items.reduce(function (total, item) {
      return total + (answers.get(item.id) === item.answer ? 1 : 0);
    }, 0);
    const heading = document.createElement("p");
    heading.className = "mock-kicker";
    heading.textContent = timeExpired ? "제한 시간 종료 · 결과" : "제출 완료 · 결과";
    const title = document.createElement("h2");
    title.id = "mock-results-title";
    title.textContent = exam.title;
    const score = document.createElement("div");
    score.className = "mock-score";
    const scoreNumber = document.createElement("strong");
    scoreNumber.textContent = `${correctCount} / ${exam.items.length}`;
    const scoreCaption = document.createElement("span");
    scoreCaption.textContent = `이번 회차 정답 · ${answers.size}문항 응답`;
    score.append(scoreNumber, scoreCaption);
    const boundary = document.createElement("p");
    boundary.className = "mock-result-boundary";
    boundary.textContent = "이 점수는 이번 지필드 모의고사 문항에 대한 정답 수입니다. 다른 회차나 학년의 점수와 같은 기준으로 비교한 결과가 아닙니다.";
    const standards = document.createElement("div");
    standards.className = "mock-standard-results";
    exam.standards.forEach(function (standard) {
      const scoped = exam.items.filter(function (item) { return item.standard === standard; });
      const correct = scoped.filter(function (item) { return answers.get(item.id) === item.answer; }).length;
      const article = document.createElement("article");
      const label = document.createElement("strong");
      label.textContent = standard;
      const count = document.createElement("span");
      count.textContent = `${correct} / ${scoped.length} 정답`;
      article.append(label, count);
      standards.append(article);
    });
    const review = document.createElement("div");
    review.className = "mock-review";
    exam.items.forEach(function (item, index) {
      const response = answers.get(item.id);
      const correct = response === item.answer;
      const article = document.createElement("article");
      article.dataset.correct = String(correct);
      const itemTitle = document.createElement("h3");
      itemTitle.textContent = `문항 ${index + 1} · ${item.standard} · ${item.focus}`;
      const chosen = document.createElement("p");
      chosen.className = "mock-review-answer";
      const responseLabel = response === undefined ? "미응답" : `내 답 ${labels[response]}`;
      chosen.append(document.createTextNode(`${responseLabel} · 정답 ${labels[item.answer]} `));
      const answerValue = document.createElement("span");
      addMath(answerValue, item.choices[item.answer]);
      chosen.append(answerValue);
      const explanation = document.createElement("p");
      addMath(explanation, item.solution);
      article.append(itemTitle, chosen, explanation);
      review.append(article);
    });
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "primary-action";
    retry.textContent = "한 번 더 풀기";
    retry.addEventListener("click", function () { window.location.reload(); });
    resultPanel.replaceChildren(heading, title, score, boundary, standards, review, retry);
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.getElementById("mock-start").addEventListener("click", function () {
    startPanel.hidden = true;
    examPanel.hidden = false;
    exam.items.forEach(function (item, index) { questionList.append(createQuestion(item, index)); });
    showTime();
    timerId = window.setInterval(function () {
      secondsLeft -= 1;
      showTime();
      if (secondsLeft <= 0) renderResults(true);
    }, 1000);
    document.getElementById("mock-question-" + exam.items[0].id).scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("mock-submit").addEventListener("click", function () { renderResults(false); });
  updateProgress();
})();
