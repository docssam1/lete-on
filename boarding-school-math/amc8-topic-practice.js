(function () {
  "use strict";
  const bank = window.GFIELDGrade7UnitMock;
  if (!bank) return;
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
  const state = { activeDomains: new Set(requestedDomains), solved: new Set() };
  const $ = function (id) { return document.getElementById(id); };

  function itemDomain(item) {
    if (item.standard === "대수·규칙") return "algebra";
    if (item.standard === "기하·공간") return "geometry";
    if (item.standard === "경우의 수·확률") return "counting";
    if (item.standard === "수 감각·비율") return "number";
    if (item.standard === "정수·자료 해석") return /나머지|배수|최소공배수/.test(item.focus) ? "number" : "data";
    return "number";
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
    return bank.items.filter(function (item) { return state.activeDomains.size === 0 || state.activeDomains.has(itemDomain(item)); });
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
        choices.append(button);
      });
      if (state.solved.has(item.id)) {
        choices.querySelectorAll("button").forEach(function (button, choiceIndex) { button.disabled = true; if (choiceIndex === item.answer) button.classList.add("correct"); });
        feedback.className = "feedback correct"; feedback.textContent = "맞혔어요. 풀이에서 개념이 연결되는 지점을 확인해 보세요.";
      }
      const solution = document.createElement("details"); solution.className = "worked-solution";
      const summary = document.createElement("summary"); summary.textContent = "정답과 풀이 보기";
      const explanation = document.createElement("p"); explanation.append(mathNode(item.solution));
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
    $("topic-source-summary").textContent = `${sourceYear} AMC 8 · ${mockWrongQuestions.length ? `지필드 모의고사 ${mockWrongQuestions.join(", ")}번에서 다시 볼 개념` : sourceQuestions.length ? `다시 표시한 문항 ${sourceQuestions.join(", ")}번` : "원본 시험 복습에서 이어진 연습"}. 원문과 해설은 원본 제공처에서 확인해 주세요.`;
  }
  const chosenNames = requestedDomains.map(function (id) { return domainNames[id]; });
  if (chosenNames.length) $("topic-intro-copy").textContent = `${mockWrongQuestions.length ? `지필드 모의고사 ${mockWrongQuestions.join(", ")}번에서 틀리거나 비워 둔 영역을 골랐어요. ` : ""}${sourceYear ? `${sourceYear} AMC 8 원본 복습에서 이어서, ` : ""}${chosenNames.join("·")} 영역의 지필드 창작 문제만 모았어요. 문제를 풀고 풀이를 확인하며 개념을 다시 연결해요.`;
  renderFilters(); renderItems();
})();
