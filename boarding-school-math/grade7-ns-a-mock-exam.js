(function () {
  "use strict";
  const exam = window.GFIELDGrade7UnitMock || window.GFIELDGrade7NSAExam || window.GFIELDAMC10Mock || window.GFIELDAMC12Mock;
  const localRecords = window.GFIELDLocalLearningRecord;
  if (!exam || !Array.isArray(exam.items) || !exam.items.length || !Array.isArray(exam.standards)) return;
  const answers = new Map();
  const startPanel = document.getElementById("mock-start-panel");
  const examPanel = document.getElementById("mock-exam-panel");
  const resultPanel = document.getElementById("mock-results");
  const questionList = document.getElementById("mock-question-list");
  const progress = document.getElementById("mock-progress");
  const timer = document.getElementById("mock-timer");
  const labels = "ABCDE";
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
    const dataTable = createDataTable(item.dataTable);
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
    card.append(header, prompt);
    if (dataTable) card.append(dataTable);
    card.append(choices);
    return card;
  }
  function createDataTable(data) {
    if (!data || !Array.isArray(data.headers) || !Array.isArray(data.rows)) return null;
    const wrapper = document.createElement("div");
    wrapper.className = "mock-data-table-wrap";
    const table = document.createElement("table");
    table.className = "mock-data-table";
    if (data.caption) {
      const caption = document.createElement("caption");
      caption.textContent = data.caption;
      table.append(caption);
    }
    const head = document.createElement("thead");
    const headerRow = document.createElement("tr");
    data.headers.forEach(function (value) {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = String(value);
      headerRow.append(cell);
    });
    head.append(headerRow);
    const body = document.createElement("tbody");
    data.rows.forEach(function (row) {
      const tr = document.createElement("tr");
      row.forEach(function (value, index) {
        const cell = document.createElement(index === 0 ? "th" : "td");
        if (index === 0) cell.scope = "row";
        cell.textContent = String(value);
        tr.append(cell);
      });
      body.append(tr);
    });
    table.append(head, body);
    wrapper.append(table);
    return wrapper;
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
    const standardResults = exam.standards.map(function (standard) {
      const scoped = exam.items.filter(function (item) { return item.standard === standard; });
      return { id: standard, correct: scoped.filter(function (item) { return answers.get(item.id) === item.answer; }).length, total: scoped.length };
    });
    const reviewFocuses = exam.items.filter(function (item) { return answers.get(item.id) !== item.answer; }).map(function (item) { return { itemId: item.id, standard: item.standard, label: item.focus }; });
    const savedResult = localRecords && localRecords.storage.saveGfieldMockResult({
      schemaVersion: "gfield-mock-result-v1", id: `mock-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`,
      examId: exam.id, formVersion: exam.formVersion, grade: exam.grade,
      score: { correct: correctCount, answered: answers.size }, standards: standardResults, reviewFocuses: reviewFocuses,
      completedAt: new Date().toISOString()
    });
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
    boundary.textContent = savedResult
      ? "이번 지필드 모의고사의 결과 요약을 이 기기에 저장했어요. 이름·학교 성적·문항별 답은 저장하지 않습니다. 이 점수는 다른 회차·학년과 같은 기준으로 비교한 값이 아니며, 학년 등급을 판정하지 않아요."
      : "이번 지필드 모의고사 문항에 대한 정답 수입니다. 저장 기능을 사용할 수 없어 새로고침하면 사라질 수 있어요. 다른 회차·학년과 같은 기준으로 비교한 점수나 학년 등급은 아닙니다.";
    const standards = document.createElement("div");
    standards.className = "mock-standard-results";
    standardResults.forEach(function (standard) {
      const article = document.createElement("article");
      const label = document.createElement("strong");
      label.textContent = standard.id;
      const count = document.createElement("span");
      count.textContent = `${standard.correct} / ${standard.total} 정답`;
      article.append(label, count);
      standards.append(article);
    });
    const needsReview = exam.items.some(function (item) { return answers.get(item.id) !== item.answer; });
    const nextStudy = document.createElement("section");
    nextStudy.className = "mock-next-study";
    const nextStudyHeading = document.createElement("h3");
    nextStudyHeading.textContent = needsReview ? "다시 확인할 개념 이어서 풀기" : "풀이를 설명하고 한 걸음 더 풀기";
    const nextStudyCopy = document.createElement("p");
    nextStudyCopy.textContent = needsReview
      ? "틀렸거나 비워 둔 문항은 복습할 문제를 찾는 표시예요. 점수로 실력이나 등급을 정하지 않고, 같은 범위의 단원 연습으로 이어갑니다."
      : exam.allCorrectCopy || "이번 회차의 모든 문항을 맞혔어요. 이 결과만으로 전체 영역의 숙달을 판단하지 않고, 풀이 설명과 새로운 문제로 이어갑니다.";
    const resultContent = [nextStudyHeading, nextStudyCopy];
    if (reviewFocuses.length) {
      const focusList = document.createElement("ul");
      focusList.className = "mock-review-focus-list";
      reviewFocuses.forEach(function (focus) {
        const entry = document.createElement("li");
        entry.textContent = `${focus.standard} · ${focus.label}`;
        focusList.append(entry);
      });
      resultContent.push(focusList);
    }
    const nextStudyLink = document.createElement("a");
    nextStudyLink.href = exam.nextStudyHref || `./unit-workbook.html?cluster=${encodeURIComponent(exam.clusterId)}&mode=workbook&audience=student&locale=ko&paper=A4`;
    if (["gfield-amc12-concept-mock-v1", "gfield-amc10-concept-mock-v1", "gfield-grade7-amc8-style-mock-v2"].includes(exam.id)) {
      const nextStudyUrl = new URL(nextStudyLink.href, window.location.href);
      const attemptParams = new URLSearchParams(window.location.search);
      ["sourceYear", "sourceForm", "sourceQuestions", "sourceConcepts"].forEach(function (key) {
        const value = attemptParams.get(key);
        if (value) nextStudyUrl.searchParams.set(key, value);
      });
      const practiceDomainIds = { "대수": "algebra", "대수·규칙": "algebra", "함수·삼각함수": "functions", "정수론": "number", "기하": "geometry", "기하·공간": "geometry", "경우의 수": "counting", "경우의 수·확률": "counting", "확률": "probability", "수 감각·비율": "number" };
      const wrongItems = exam.items.map(function (item, index) { return { item: item, number: index + 1 }; }).filter(function (entry) {
        return answers.get(entry.item.id) !== entry.item.answer;
      });
      if (exam.id === "gfield-grade7-amc8-style-mock-v2") {
        const mockConcepts = new Set();
        wrongItems.forEach(function (entry) { (entry.item.sourceConcepts || []).forEach(function (concept) { mockConcepts.add(concept); }); });
        if (mockConcepts.size) nextStudyUrl.searchParams.set("mockConcepts", Array.from(mockConcepts).join(","));
      }
      const mockDomains = Array.from(new Set(wrongItems.map(function (entry) {
        if (exam.id === "gfield-grade7-amc8-style-mock-v2" && entry.item.standard === "정수·자료 해석") return /나머지|배수|최소공배수/.test(entry.item.focus) ? "number" : "data";
        return practiceDomainIds[entry.item.standard];
      }).filter(Boolean)));
      if (mockDomains.length) nextStudyUrl.searchParams.set("domains", mockDomains.join(","));
      else if (attemptParams.get("domains")) nextStudyUrl.searchParams.set("domains", attemptParams.get("domains"));
      nextStudyUrl.searchParams.set("mockWrongQuestions", wrongItems.map(function (entry) { return entry.number; }).join(","));
      nextStudyLink.href = nextStudyUrl.href;
    }
    nextStudyLink.textContent = exam.nextStudyLabel || `${exam.clusterId} 단원 워크북으로 이어서 풀기 →`;
    resultContent.push(nextStudyLink);
    if (savedResult) {
      const roadmapLink = document.createElement("a");
      roadmapLink.className = "mock-roadmap-result-link";
      const roadmapSection = ["gfield-amc12-concept-mock-v1", "gfield-amc10-concept-mock-v1", "gfield-grade7-amc8-style-mock-v2"].includes(exam.id) || exam.clusterId === "AMC8" ? "competition-diagnostic" : "grade-practice";
      roadmapLink.href = `./boarding-roadmap.html?grade=${encodeURIComponent(exam.grade || 7)}#${roadmapSection}`;
      roadmapLink.textContent = "로드맵에서 내 모의고사 기록 보기 →";
      resultContent.push(roadmapLink);
    }
    nextStudy.append(...resultContent);
    const review = document.createElement("div");
    review.className = "mock-review";
    exam.items.forEach(function (item, index) {
      const response = answers.get(item.id);
      const correct = response === item.answer;
      const article = document.createElement("article");
      article.dataset.correct = String(correct);
      const itemTitle = document.createElement("h3");
      itemTitle.textContent = `문항 ${index + 1} · ${item.standard} · ${item.focus}`;
      const dataTable = createDataTable(item.dataTable);
      const chosen = document.createElement("p");
      chosen.className = "mock-review-answer";
      const responseLabel = response === undefined ? "미응답" : `내 답 ${labels[response]}`;
      chosen.append(document.createTextNode(`${responseLabel} · 정답 ${labels[item.answer]} `));
      const answerValue = document.createElement("span");
      addMath(answerValue, item.choices[item.answer]);
      chosen.append(answerValue);
      const explanation = document.createElement("p");
      addMath(explanation, item.solution);
      article.append(itemTitle);
      if (dataTable) article.append(dataTable);
      article.append(chosen, explanation);
      review.append(article);
    });
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "primary-action";
    retry.textContent = "한 번 더 풀기";
    retry.addEventListener("click", function () { window.location.reload(); });
    resultPanel.replaceChildren(heading, title, score, boundary, standards, nextStudy, review, retry);
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
