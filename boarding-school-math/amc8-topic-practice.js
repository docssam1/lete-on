(function () {
  "use strict";
  const bank = window.GFIELDGrade7UnitMock;
  if (!bank) return;
  const authoredPractice = window.GFIELDAMC8ConceptPractice;
  const extensionPractice = window.GFIELDAMC8ConceptPracticeExtension;
  const practiceItems = bank.items
    .concat(authoredPractice && Array.isArray(authoredPractice.items) ? authoredPractice.items : [])
    .concat(extensionPractice && Array.isArray(extensionPractice.items) ? extensionPractice.items : []);
  const params = new URLSearchParams(location.search);
  const requestedGrade = Number(params.get("grade"));
  const grade = Number.isInteger(requestedGrade) && requestedGrade >= 6 && requestedGrade <= 8 ? requestedGrade : 7;
  const domainNames = Object.freeze({
    algebra: "식·대수",
    number: "수·비례·추정",
    geometry: "기하·공간",
    counting: "경우의 수·확률",
    data: "그래프·표 해석"
  });
  const domains = new Set(Object.keys(domainNames));
  const requestedDomains = (params.get("domains") || "").split(",").filter(function (id, index, values) { return domains.has(id) && values.indexOf(id) === index; });
  const sourceYear = /^\d{4}$/.test(params.get("sourceYear") || "") ? params.get("sourceYear") : "";
  const sourceForm = /^[ABCD]$/.test(params.get("sourceForm") || "") ? params.get("sourceForm") : "";
  const sourceQuestions = (params.get("sourceQuestions") || "").split(",").map(Number).filter(function (value) { return Number.isInteger(value) && value > 0 && value <= 25; });
  const mockWrongQuestions = (params.get("mockWrongQuestions") || "").split(",").map(Number).filter(function (value) { return Number.isInteger(value) && value > 0 && value <= 25; });
  const requestedConcepts = Array.from(new Set((params.get("sourceConcepts") || "").split(",").filter(function (id) { return /^[a-z0-9-]{1,64}$/.test(id); })));
  const requestedMockConcepts = Array.from(new Set((params.get("mockConcepts") || "").split(",").filter(function (id) { return /^[a-z0-9-]{1,64}$/.test(id); })));
  const practiceConcepts = Array.from(new Set(requestedConcepts.concat(requestedMockConcepts)));
  const conceptLabels = window.GFIELDAMC8ConceptLabels || {};
  const progressStorage = window.GFIELDLocalLearningRecord.storage;
  const progressId = "amc8-topic-grade" + grade;
  const validItemIds = new Set(practiceItems.map(function (item) { return item.id; }));
  let savedAttempts = {};
  let storageError = false;
  try { savedAttempts = progressStorage.loadPractice(progressId).attempts; }
  catch (_error) { storageError = true; }
  const state = {
    activeDomains: new Set(requestedDomains),
    solved: new Set(Object.keys(savedAttempts).filter(function (id) { return validItemIds.has(id) && savedAttempts[id].solved; }))
  };
  function saveResponse(item, choiceIndex, correct) {
    try {
      const attempts = progressStorage.loadPractice(progressId).attempts;
      const previous = attempts[item.id] || { responses: [] };
      attempts[item.id] = { responses: previous.responses.concat([{ answerId: "ABCDE"[choiceIndex], correct: correct }]), solved: correct || previous.solved === true };
      progressStorage.savePractice(progressId, attempts, null);
      savedAttempts = attempts;
    } catch (_error) {
      document.getElementById("topic-save-status").textContent = "이번 연습 기록을 저장하지 못했어요. 브라우저 저장 설정을 확인해 주세요.";
    }
  }
  const $ = function (id) { return document.getElementById(id); };

  function itemDomain(item) {
    if (domains.has(item.domain)) return item.domain;
    if (item.standard === "대수·규칙") return "algebra";
    if (item.standard === "기하·공간") return "geometry";
    if (item.standard === "경우의 수·확률") return "counting";
    if (item.standard === "수 감각·비율") return "number";
    if (item.standard === "정수·자료 해석") return /나머지|배수|최소공배수/.test(item.focus) ? "number" : "data";
    return "number";
  }
  const sourceConceptItems = practiceItems.filter(function (item) {
    return (state.activeDomains.size === 0 || state.activeDomains.has(itemDomain(item)))
      && requestedConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); });
  });
  const mockConceptItems = practiceItems.filter(function (item) {
    return (state.activeDomains.size === 0 || state.activeDomains.has(itemDomain(item)))
      && requestedMockConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); });
  });
  const matchedPracticeItems = Array.from(new Set(sourceConceptItems.concat(mockConceptItems)));
  const hasPracticeConceptMatches = matchedPracticeItems.length > 0;
  function conceptNames(ids) {
    return ids.map(function (id) { return conceptLabels[id] || "관련 개념"; });
  }
  function compactConceptNames(ids) {
    const names = Array.from(new Set(conceptNames(ids)));
    const shown = names.slice(0, 4);
    return shown.join("·") + (names.length > shown.length ? ` 외 ${names.length - shown.length}개` : "");
  }
  function questionLabel(numbers) {
    if (numbers.length > 4) return `문항 ${numbers.length}개`;
    return `문항 ${numbers.join(", ")}번`;
  }
  function mathNode(value, className) {
    const node = document.createElement("span");
    if (className) node.className = className;
    if (window.GFIELDMathText) window.GFIELDMathText.append(node, String(value));
    else node.textContent = String(value);
    return node;
  }
  function appendTable(host, tableData) {
    if (!tableData) return;
    const table = document.createElement("table");
    table.className = "topic-data-table";
    if (tableData.caption) { const caption = document.createElement("caption"); caption.textContent = tableData.caption; table.append(caption); }
    const head = document.createElement("thead");
    const headerRow = document.createElement("tr");
    tableData.headers.forEach(function (value) { const th = document.createElement("th"); th.scope = "col"; th.textContent = value; headerRow.append(th); });
    head.append(headerRow); table.append(head);
    const body = document.createElement("tbody");
    tableData.rows.forEach(function (row) { const tr = document.createElement("tr"); row.forEach(function (value) { const td = document.createElement("td"); td.textContent = value; tr.append(td); }); body.append(tr); });
    table.append(body); host.append(table);
  }
  function visibleItems() {
    return practiceItems.filter(function (item) {
      return (state.activeDomains.size === 0 || state.activeDomains.has(itemDomain(item)))
        && (practiceConcepts.length === 0 || practiceConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); }));
    });
  }
  function renderFilters() {
    const host = $("topic-filters");
    host.replaceChildren();
    const all = document.createElement("button");
    all.type = "button"; all.className = "domain-filter"; all.textContent = "전체 영역";
    all.setAttribute("aria-pressed", String(state.activeDomains.size === 0));
    all.addEventListener("click", function () { state.activeDomains.clear(); renderFilters(); renderItems(); });
    host.append(all);
    Object.keys(domainNames).forEach(function (id) {
      const button = document.createElement("button");
      button.type = "button"; button.className = "domain-filter"; button.textContent = domainNames[id];
      button.setAttribute("aria-pressed", String(state.activeDomains.has(id)));
      button.addEventListener("click", function () {
        if (state.activeDomains.has(id)) state.activeDomains.delete(id); else state.activeDomains.add(id);
        renderFilters(); renderItems();
      });
      host.append(button);
    });
  }
  function renderItems() {
    const host = $("topic-items");
    const items = visibleItems();
    host.replaceChildren();
    $("topic-empty").hidden = items.length > 0;
    $("topic-item-count").textContent = `${items.length}문항`;
    $("topic-progress").textContent = `${items.filter(function (item) { return state.solved.has(item.id); }).length} / ${items.length}`;
    items.forEach(function (item, index) {
      const card = document.createElement("article");
      card.className = "problem-card";
      card.dataset.itemId = item.id;
      card.dataset.domain = itemDomain(item);
      card.dataset.solved = String(state.solved.has(item.id));
      const meta = document.createElement("div"); meta.className = "problem-meta";
      const metaDomain = document.createElement("b"); metaDomain.textContent = `${domainNames[itemDomain(item)]} · ${item.focus}`;
      const label = document.createElement("span"); label.textContent = "GFIELD 창작";
      meta.append(metaDomain, label);
      const title = document.createElement("h3"); title.textContent = `연습 ${String(index + 1).padStart(2, "0")}`;
      const prompt = document.createElement("p"); prompt.className = "problem-prompt"; prompt.append(mathNode(item.prompt));
      const choices = document.createElement("div"); choices.className = "choices"; choices.setAttribute("role", "group"); choices.setAttribute("aria-label", `${item.focus} 선택지`);
      const feedback = document.createElement("p"); feedback.className = "feedback"; feedback.setAttribute("aria-live", "polite");
      item.choices.forEach(function (choice, choiceIndex) {
        const button = document.createElement("button"); button.type = "button"; button.className = "choice"; button.dataset.choice = String(choiceIndex);
        const mark = document.createElement("span"); mark.className = "choice-mark"; mark.textContent = "ABCDE"[choiceIndex];
        const value = document.createElement("span"); value.className = "choice-value"; value.append(mathNode(choice));
        button.append(mark, value);
        button.addEventListener("click", function () {
          if (state.solved.has(item.id)) return;
          const correct = choiceIndex === item.answer;
          saveResponse(item, choiceIndex, correct);
          button.classList.add(correct ? "correct" : "wrong");
          if (correct) {
            state.solved.add(item.id); card.dataset.solved = "true";
            choices.querySelectorAll("button").forEach(function (entry) { entry.disabled = true; });
            feedback.className = "feedback correct"; feedback.textContent = "맞았어요. 풀이를 읽고 사용한 개념을 말로 설명해 보세요.";
          } else {
            button.disabled = true; feedback.className = "feedback wrong"; feedback.textContent = "아직 답을 찾지 못했어요. 조건을 다시 읽고 다른 방법도 시도해 보세요.";
          }
          $("topic-progress").textContent = `${visibleItems().filter(function (entry) { return state.solved.has(entry.id); }).length} / ${visibleItems().length}`;
        });
        const previous = savedAttempts[item.id];
        if (previous && !previous.solved && previous.responses.some(function (response) { return response.answerId === "ABCDE"[choiceIndex]; })) {
          button.disabled = true;
          button.classList.add("wrong");
        }
        choices.append(button);
      });
      if (state.solved.has(item.id)) {
        choices.querySelectorAll("button").forEach(function (button, choiceIndex) { button.disabled = true; if (choiceIndex === item.answer) button.classList.add("correct"); });
        feedback.className = "feedback correct"; feedback.textContent = "맞혔어요. 풀이에서 개념이 연결되는 지점을 확인해 보세요.";
      }
      const solution = document.createElement("details"); solution.className = "worked-solution";
      const summary = document.createElement("summary"); summary.textContent = "정답과 풀이 보기";
      const explanation = document.createElement("ol"); explanation.className = "solution-steps";
      (Array.isArray(item.solution) ? item.solution : [item.solution]).forEach(function (step) {
        const line = document.createElement("li"); line.append(mathNode(step)); explanation.append(line);
      });
      solution.append(summary, explanation);
      card.append(meta, title, prompt); appendTable(card, item.dataTable); card.append(choices, feedback, solution); host.append(card);
    });
  }

  const query = new URLSearchParams();
  query.set("grade", String(grade)); query.set("program", "amc8");
  if (sourceYear) query.set("year", sourceYear);
  if (sourceForm) query.set("form", sourceForm);
  const reviewHref = `./competition-paper-review.html?${query.toString()}`;
  const roadmapHref = `./boarding-roadmap.html?grade=${grade}#competition-diagnostic`;
  $("topic-brand-route").href = roadmapHref;
  $("topic-nav-route").href = roadmapHref;
  $("topic-nav-route").textContent = `${grade}학년 성장 지도`;
  $("topic-footer-route").href = roadmapHref;
  $("topic-footer-route").textContent = `${grade}학년 학습 경로로 돌아가기`;
  $("topic-review-link").href = reviewHref;
  $("topic-return-link").href = reviewHref;
  if (sourceYear) {
    const originalRoute = `https://live.poshenloh.com/past-contests/amc8/${sourceYear}`;
    $("topic-source-paper-link").href = originalRoute;
    const originalConceptNames = compactConceptNames(requestedConcepts);
    const mockConceptNames = compactConceptNames(requestedMockConcepts);
    const conceptText = [
      requestedConcepts.length ? `원본 풀이 개념: ${originalConceptNames}` : "",
      requestedMockConcepts.length ? `지필드 모의고사 복습 개념: ${mockConceptNames}` : ""
    ].filter(Boolean).join(". ");
    const conceptSummary = hasPracticeConceptMatches
      ? `${conceptText}. 연결된 지필드 창작 연습 ${matchedPracticeItems.length}문항을 먼저 모았어요.`
      : practiceConcepts.length
        ? "이 개념과 직접 연결된 연습 문항은 아직 없습니다. 원본 해설을 먼저 확인하세요."
        : "표시한 영역을 지필드 창작 문항으로 연습합니다.";
    $("topic-source-summary").textContent = `${sourceYear} AMC 8 · ${mockWrongQuestions.length ? `지필드 모의고사 다시 보기: ${questionLabel(mockWrongQuestions)}` : sourceQuestions.length ? `원본 다시 보기: ${questionLabel(sourceQuestions)}` : "원본 시험 복습에서 이어진 연습"}. ${conceptSummary} 원문·정답·해설은 원본 제공처에서 확인해 주세요.`;
  }
  const chosenNames = requestedDomains.map(function (id) { return domainNames[id]; });
  if (chosenNames.length || requestedConcepts.length) {
    const originalConceptNames = compactConceptNames(requestedConcepts);
    const mockConceptNames = compactConceptNames(requestedMockConcepts);
    const conceptIntro = [
      requestedConcepts.length ? `원본 풀이 개념: ${originalConceptNames}` : "",
      requestedMockConcepts.length ? `모의고사 복습 개념: ${mockConceptNames}` : ""
    ].filter(Boolean).join(". ");
    const conceptCopy = hasPracticeConceptMatches ? `${conceptIntro}. 연결된 창작 연습 ${matchedPracticeItems.length}문항을 먼저 보여 줍니다. ` : practiceConcepts.length ? "이 개념과 직접 연결된 연습 문항은 아직 없습니다. 원본 해설을 먼저 확인하세요. " : "";
    const domainIntro = chosenNames.length ? `${chosenNames.join("·")} 영역의 창작 문제도 함께 살펴볼 수 있어요.` : "문제를 풀고 풀이에서 개념이 연결되는 지점을 확인해요.";
    $("topic-intro-copy").textContent = `${mockWrongQuestions.length ? `지필드 모의고사 오답·미응답: ${questionLabel(mockWrongQuestions)}. ` : ""}${sourceYear ? `${sourceYear} AMC 8 원본 복습에서 이어서. ` : ""}${conceptCopy}${domainIntro}`;
  }
  const saveStatus = document.createElement("p");
  saveStatus.id = "topic-save-status";
  saveStatus.setAttribute("role", "status");
  saveStatus.textContent = storageError ? "연습 기록을 읽지 못했어요. 브라우저 저장 설정을 확인해 주세요." : "연습 기록은 이 브라우저에 저장돼요.";
  $("topic-progress").closest(".topic-toolbar").after(saveStatus);
  renderFilters(); renderItems();
})();
