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
  const extension = window.GFIELDAimeConceptPracticeExtension;
  const practiceItems = bank.items.concat(extension && Array.isArray(extension.items) ? extension.items : []);
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
  const requestedConcepts = Array.from(new Set((query.get("sourceConcepts") || "").split(",").filter(function (id) { return /^[a-z0-9-]{1,64}$/.test(id); })));
  const conceptLabels = { "vietas-formulas": "근과 계수의 관계", "algebraic-manipulation": "대수식 정리", modular: "나머지", "modular-arithmetic": "나머지", "chinese-remainder-theorem": "중국인의 나머지 정리", polynomial: "다항식", factoring: "인수분해", "triangle-area": "삼각형의 넓이", "heron-formula": "헤론의 공식", divisibility: "배수와 약수", "prime-factorization": "소인수분해", "divisor-count": "약수의 개수", digits: "숫자와 자릿수", casework: "경우 나누기", "stars-and-bars": "별과 막대", combinations: "조합", factorial: "계승", exponent: "거듭제곱", "modular-exponentiation": "거듭제곱의 나머지", "inclusion-exclusion": "포함·배제", "absolute-value": "절댓값", "square-geometry": "정사각형", "area-decomposition": "넓이 분할" };
  Object.assign(conceptLabels, { "coordinate-geometry": "좌표기하", "system-of-equations": "연립방정식", substitution: "대입과 치환", "trigonometric-identity": "삼각함수 항등식", trigonometry: "삼각함수", optimization: "최댓값·최솟값", inequality: "부등식", "complex-number": "복소수", logarithm: "로그", quadratic: "이차방정식", similarity: "닮음", "area-ratio": "넓이의 비", "diophantine-equation": "정수해", recursion: "점화식", symmetry: "대칭", "law-of-cosines": "코사인 법칙", "3d-geometry": "입체도형", "pythagorean-theorem": "피타고라스 정리", "arithmetic-sequence": "등차수열", sequence: "수열", "geometric-sequence": "등비수열", "basic-probability": "기본 확률" });

  function matchesActiveDomain(item) {
    return activeDomain === "전체" || (activeDomain === "원본 영역"
      ? domainIds.has(Object.keys(domainNamesById).find(function (id) { return domainNamesById[id] === item.domain; }))
      : item.domain === activeDomain);
  }
  const sourceConceptItems = practiceItems.filter(function (item) { return matchesActiveDomain(item) && requestedConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); }); });
  const hasSourceConceptMatches = sourceConceptItems.length > 0;
  function visibleItems() {
    return practiceItems.filter(function (item) {
      return matchesActiveDomain(item) && (activeStage === "전체" || item.stage === activeStage)
        && (!hasSourceConceptMatches || requestedConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); }));
    });
  }

  const sourceYear = query.get("sourceYear");
  const sourceForm = query.get("sourceForm") || "";
  const sourceQuestions = (query.get("sourceQuestions") || "").split(",").filter(function (value) { return /^[1-9]\d?$/.test(value) && Number(value) <= 15; });
  if (/^\d{4}$/u.test(sourceYear || "")) {
    const sourceContext = document.getElementById("source-paper-context");
    const formSuffix = Number(sourceYear) <= 1999 ? "" : sourceForm;
    sourceContext.hidden = false;
    const conceptSummary = hasSourceConceptMatches
      ? `원본 풀이 개념 ${requestedConcepts.map(function (id) { return conceptLabels[id] || id; }).join("·")}과 연결된 지필드 창작 문항 ${sourceConceptItems.length}개를 먼저 모았어요.`
      : requestedConcepts.length
        ? "원본 풀이 개념과 직접 연결된 문항은 아직 없어, 선택 영역의 지필드 창작 문항을 보여 줍니다."
        : "원본에서 선택한 영역과 연결한 지필드 창작 연습입니다.";
    document.getElementById("source-paper-summary").textContent = `${sourceYear}${formSuffix ? ` ${formSuffix}` : ""} AIME 원본${sourceQuestions.length ? ` Q${sourceQuestions.join("·")}에서 표시한 항목` : ""}. ${conceptSummary} 원본과 별도로 만든 문항이며 원본 진단 점수에는 더해지지 않습니다.`;
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
    const visible = visibleItems();
    progress.textContent = `${visible.filter(function (item) { return attempts.has(item.id); }).length} / ${visible.length}`;
    document.getElementById("practice-count").textContent = `${visible.length}문항`;
  }
  function renderItems() {
    const visible = visibleItems();
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
      heading.textContent = `${String(practiceItems.indexOf(item) + 1).padStart(2, "0")} · ${item.title}`;
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
