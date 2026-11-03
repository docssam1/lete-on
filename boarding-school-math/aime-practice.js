(function () {
  "use strict";
  const requestedGrade = Number(new URLSearchParams(window.location.search).get("grade"));
  const grade = requestedGrade === 10 ? 10 : 8;
  const roadmapHref = `./boarding-roadmap.html?grade=${grade}`;
  ["aime-brand-route", "aime-nav-route", "aime-footer-route", "aime-back-route"].forEach(function (id) {
    const link = document.getElementById(id);
    if (link) link.href = id === "aime-back-route" ? `${roadmapHref}#annual-plan` : roadmapHref;
  });
  const navRoute = document.getElementById("aime-nav-route");
  if (navRoute) navRoute.textContent = `${grade}학년 성장 지도`;
  const footerRoute = document.getElementById("aime-footer-route");
  if (footerRoute) footerRoute.textContent = `${grade}학년 로드맵으로 돌아가기`;
  const amcRoute = document.getElementById("aime-amc-route");
  if (amcRoute) {
    amcRoute.href = grade === 8 ? "./amc10-practice.html?grade=8" : "./competition-paper-review.html?grade=10&program=amc12";
    amcRoute.textContent = grade === 8 ? "AMC 10 개념 연습" : "AMC 12 문항별 복습";
  }
  const bank = window.GFIELDAimeConceptPractice;
  if (!bank) return;
  const list = document.getElementById("aime-items");
  const domainFilters = document.getElementById("domain-filters");
  const stageFilters = document.getElementById("stage-filters");
  const progress = document.getElementById("practice-progress");
  const attempts = new Map();
  const query = new URLSearchParams(window.location.search);
  const domainIds = new Set((query.get("domains") || "").split(",").filter(Boolean));
  const domainNamesById = { algebra: "대수", number: "정수론", geometry: "기하", counting: "경우의 수" };
  let activeDomain = domainIds.size === 1 ? domainNamesById[Array.from(domainIds)[0]] || "전체" : domainIds.size > 1 ? "원본 영역" : "전체";
  let activeStage = "전체";

  const sourceYear = query.get("sourceYear");
  const sourceForm = query.get("sourceForm") || "";
  const sourceQuestions = (query.get("sourceQuestions") || "").split(",").filter(function (value) { return /^[1-9]\d?$/.test(value) && Number(value) <= 15; });
  if (/^\d{4}$/u.test(sourceYear || "")) {
    const sourceContext = document.getElementById("source-paper-context");
    const formSuffix = Number(sourceYear) <= 1999 ? "" : sourceForm;
    sourceContext.hidden = false;
    document.getElementById("source-paper-summary").textContent = `${sourceYear}${formSuffix ? ` ${formSuffix}` : ""} AIME 원본${sourceQuestions.length ? ` Q${sourceQuestions.join("·")}에서 표시한 항목` : ""}${domainIds.size ? ` (${Array.from(domainIds).map(function (id) { return domainNamesById[id] || id; }).join("·")})` : ""}과 연결한 지필드 자체 연습입니다. 원본과 별도로 만든 문항이며 원본 진단 점수에는 더해지지 않습니다.`;
    document.getElementById("source-paper-link").href = `https://live.poshenloh.com/past-contests/aime/${sourceYear}${formSuffix}`;
    document.getElementById("source-review-link").href = `./competition-paper-review.html?grade=${grade}&program=aime&year=${sourceYear}${sourceForm ? `&form=${encodeURIComponent(sourceForm)}` : ""}`;
  }

  function appendText(target, value) {
    if (window.GFIELDMathText && typeof window.GFIELDMathText.append === "function") window.GFIELDMathText.append(target, value);
    else target.textContent = String(value == null ? "" : value);
  }
  function renderFilterGroup(target, values, getValue, setValue, label) {
    target.replaceChildren();
    ["전체"].concat(domainIds.size > 1 && label === "수학 영역" ? ["원본 영역"] : []).concat(values).forEach(function (value) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "domain-filter";
      button.textContent = value;
      button.setAttribute("aria-pressed", String(value === getValue()));
      button.setAttribute("aria-label", `${label}: ${value}`);
      button.addEventListener("click", function () {
        setValue(value);
        renderFilters();
        renderItems();
      });
      target.append(button);
    });
  }
  function renderFilters() {
    renderFilterGroup(domainFilters, bank.domains, function () { return activeDomain; }, function (value) { activeDomain = value; }, "수학 영역");
    renderFilterGroup(stageFilters, bank.stages, function () { return activeStage; }, function (value) { activeStage = value; }, "풀이 단계");
  }
  function updateProgress() {
    const visible = bank.items.filter(function (item) {
      return (activeDomain === "전체" || (activeDomain === "원본 영역" ? domainIds.has(Object.keys(domainNamesById).find(function (id) { return domainNamesById[id] === item.domain; })) : item.domain === activeDomain)) && (activeStage === "전체" || item.stage === activeStage);
    });
    progress.textContent = `${visible.filter(function (item) { return attempts.has(item.id); }).length} / ${visible.length}`;
    document.getElementById("practice-count").textContent = `${visible.length}문항`;
  }
  function renderItems() {
    const visible = bank.items.filter(function (item) {
      return (activeDomain === "전체" || (activeDomain === "원본 영역" ? domainIds.has(Object.keys(domainNamesById).find(function (id) { return domainNamesById[id] === item.domain; })) : item.domain === activeDomain)) && (activeStage === "전체" || item.stage === activeStage);
    });
    list.replaceChildren();
    visible.forEach(function (item) {
      const card = document.createElement("article");
      const record = attempts.get(item.id) || { value: "", solved: false, wrong: false };
      card.className = `problem-card${record.solved ? " solved" : ""}`;
      card.id = `problem-${item.id}`;
      card.dataset.itemId = item.id;
      card.dataset.domain = item.domain;
      card.dataset.stage = item.stage;
      card.dataset.solved = String(record.solved);

      const meta = document.createElement("div");
      meta.className = "problem-meta";
      const tag = document.createElement("b");
      tag.textContent = `${item.domain} · ${item.stage}`;
      const label = document.createElement("span");
      label.textContent = "지필드 자체 연습";
      meta.append(tag, label);

      const heading = document.createElement("h3");
      heading.textContent = `${String(bank.items.indexOf(item) + 1).padStart(2, "0")} · ${item.title}`;
      const prompt = document.createElement("p");
      prompt.className = "problem-prompt";
      appendText(prompt, item.prompt);

      const form = document.createElement("form");
      form.className = "answer-entry";
      form.noValidate = true;
      const answerLabel = document.createElement("label");
      answerLabel.htmlFor = `answer-${item.id}`;
      answerLabel.textContent = "정수 답 입력 (0–999)";
      const input = document.createElement("input");
      input.id = `answer-${item.id}`;
      input.name = "answer";
      input.type = "text";
      input.inputMode = "numeric";
      input.autocomplete = "off";
      input.maxLength = 4;
      input.pattern = "[0-9]{1,3}";
      input.placeholder = "예: 84";
      input.value = record.value;
      input.setAttribute("aria-describedby", `feedback-${item.id}`);
      input.disabled = record.solved;
      const submit = document.createElement("button");
      submit.type = "submit";
      submit.textContent = record.solved ? "확인 완료" : "답 확인";
      submit.disabled = record.solved;
      answerLabel.append(input);
      form.append(answerLabel, submit);

      const feedback = document.createElement("p");
      feedback.id = `feedback-${item.id}`;
      feedback.className = "feedback";
      feedback.setAttribute("aria-live", "polite");
      if (record.solved) {
        feedback.classList.add("correct");
        feedback.textContent = "정답이에요. 풀이에서 사용한 개념과 연결을 확인해 보세요.";
      } else if (record.wrong) {
        feedback.classList.add("wrong");
        feedback.textContent = "아직 정답이 아니에요. 힌트를 보고 다시 풀어 보세요.";
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const raw = input.value.trim();
        if (!/^[0-9]{1,3}$/.test(raw) || Number(raw) > 999) {
          feedback.className = "feedback wrong";
          feedback.textContent = "0부터 999까지의 정수로 입력해 주세요.";
          input.focus();
          return;
        }
        const correct = Number(raw) === item.answer;
        const next = { value: raw, solved: correct, wrong: !correct };
        attempts.set(item.id, next);
        if (correct) {
          card.classList.add("solved");
          card.dataset.solved = "true";
          input.disabled = true;
          submit.disabled = true;
          submit.textContent = "확인 완료";
          feedback.className = "feedback correct";
          feedback.textContent = "정답이에요. 풀이에서 사용한 개념과 연결을 확인해 보세요.";
        } else {
          feedback.className = "feedback wrong";
          feedback.textContent = "아직 정답이 아니에요. 힌트를 보고 다시 풀어 보세요.";
        }
        updateProgress();
      });

      const hint = document.createElement("details");
      hint.className = "worked-solution hint-panel";
      const hintTitle = document.createElement("summary");
      hintTitle.textContent = "한 단계 힌트 보기";
      const hintText = document.createElement("p");
      appendText(hintText, item.hint);
      hint.append(hintTitle, hintText);

      const solution = document.createElement("details");
      solution.className = "worked-solution";
      const solutionTitle = document.createElement("summary");
      solutionTitle.textContent = "풀이와 개념 연결 질문 보기";
      const steps = document.createElement("ol");
      item.solution.forEach(function (text) {
        const step = document.createElement("li");
        appendText(step, text);
        steps.append(step);
      });
      const connection = document.createElement("p");
      connection.className = "connection-question";
      const connectionTitle = document.createElement("strong");
      connectionTitle.textContent = "개념 연결 질문";
      connection.append(connectionTitle, document.createElement("br"));
      appendText(connection, item.connection);
      solution.append(solutionTitle, steps, connection);

      card.append(meta, heading, prompt, form, feedback, hint, solution);
      list.append(card);
    });
    updateProgress();
  }
  document.getElementById("reset-practice").addEventListener("click", function () {
    attempts.clear();
    updateProgress();
    renderItems();
  });
  renderFilters();
  if (domainIds.size > 1) {
    const note = document.createElement("p");
    note.className = "scope-note";
    note.textContent = `원본에서 표시한 ${Array.from(domainIds).map(function (id) { return domainNamesById[id] || id; }).join("·")} 영역을 먼저 모았어요. 영역 버튼으로 바꿀 수 있습니다.`;
    domainFilters.before(note);
  }
  renderItems();
})();
