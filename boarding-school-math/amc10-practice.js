(function () {
  "use strict";
  const requestedGrade = Number(new URLSearchParams(window.location.search).get("grade"));
  const grade = [7, 8, 9].includes(requestedGrade) ? requestedGrade : 7;
  const params = new URLSearchParams(window.location.search);
  const roadmapHref = `./boarding-roadmap.html?grade=${grade}`;
  const reviewHref = `./competition-paper-review.html?grade=${grade}&program=amc10`;
  const gradeLabel = `${grade}학년`;
  ["amc10-brand-route", "amc10-nav-route", "amc10-back-route", "amc10-footer-route"].forEach(function (id) {
    const link = document.getElementById(id);
    if (link) link.href = id === "amc10-back-route" ? `${roadmapHref}#annual-plan` : roadmapHref;
  });
  const navRoute = document.getElementById("amc10-nav-route");
  if (navRoute) navRoute.textContent = `${gradeLabel} 성장 지도`;
  const footerRoute = document.getElementById("amc10-footer-route");
  if (footerRoute) footerRoute.textContent = `${gradeLabel} 로드맵으로 돌아가기`;
  ["amc10-review-route", "amc10-method-review-route"].forEach(function (id) {
    const link = document.getElementById(id);
    if (link) link.href = reviewHref;
  });
  const bank = window.GFIELDAMC10ConceptPractice;
  if (!bank) return;
  const list = document.getElementById("amc10-items");
  const filters = document.getElementById("domain-filters");
  const progress = document.getElementById("practice-progress");
  const answered = new Set();
  const domainIds = { algebra: "대수", number: "정수론", geometry: "기하", counting: "경우의 수", probability: "확률" };
  const requestedDomains = (params.get("domains") || "").split(",").filter(function (id, index, values) { return Object.prototype.hasOwnProperty.call(domainIds, id) && values.indexOf(id) === index; });
  const requestedConcepts = Array.from(new Set((params.get("sourceConcepts") || "").split(",").filter(function (id) { return /^[a-z0-9-]{1,64}$/.test(id); })));
  const conceptLabels = { "algebraic-manipulation": "대수식 정리", "distributive-property": "분배법칙", "system-of-equations": "연립방정식", "linear-equation": "일차방정식", factoring: "인수분해", "vietas-formulas": "근과 계수의 관계", "modular-arithmetic": "나머지", divisibility: "배수와 약수", "prime-factorization": "소인수분해", exponent: "거듭제곱", "modular-exponentiation": "거듭제곱의 나머지", optimization: "최댓값·최솟값", "rectangle-area": "직사각형의 넓이", area: "넓이", "square-geometry": "정사각형", "area-decomposition": "넓이 분할", symmetry: "대칭", similarity: "닮음", "area-ratio": "넓이의 비", "triangle-area": "삼각형의 넓이", casework: "경우 나누기", "arrangements-with-restrictions": "조건이 있는 배열", permutations: "순열", digits: "숫자와 자릿수", "multiplication-principle": "곱셈 원리", "basic-probability": "기본 확률", "sampling-without-replacement": "비복원 추출", combinations: "조합", "ratio-and-proportion": "비와 비례", fraction: "분수", "coordinate-geometry": "좌표기하", "pythagorean-theorem": "피타고라스 정리", "distance-formula": "두 점 사이 거리", mean: "평균", percentage: "백분율", parity: "홀짝성", "arithmetic-sequence": "등차수열", quadratic: "이차방정식", "circle-area": "원의 넓이", volume: "부피", inequality: "부등식", "diophantine-equation": "정수해", "equilateral-triangle": "정삼각형", "special-right-triangle": "특수 직각삼각형" };
  let activeDomains = new Set(requestedDomains.map(function (id) { return domainIds[id]; }));
  const sourceConceptItems = bank.items.filter(function (item) {
    return (activeDomains.size === 0 || activeDomains.has(item.domain)) && requestedConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); });
  });
  const hasSourceConceptMatches = sourceConceptItems.length > 0;

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function mathHtml(value) {
    const rendered = document.createElement("span");
    if (window.GFIELDMathText) window.GFIELDMathText.append(rendered, value);
    else rendered.textContent = String(value == null ? "" : value);
    return rendered.innerHTML || escapeHtml(value);
  }
  function renderFilters() {
    filters.replaceChildren();
    ["전체"].concat(bank.domains).forEach(function (domain) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "domain-filter";
      button.textContent = domain;
      button.setAttribute("aria-pressed", String(domain === "전체" ? activeDomains.size === 0 : activeDomains.has(domain)));
      button.addEventListener("click", function () {
        if (domain === "전체") activeDomains.clear();
        else if (activeDomains.has(domain)) activeDomains.delete(domain);
        else activeDomains.add(domain);
        renderFilters(); renderItems();
      });
      filters.append(button);
    });
  }
  function renderItems() {
    const visible = bank.items.filter(function (item) {
      const inSelectedDomain = activeDomains.size === 0 || activeDomains.has(item.domain);
      const matchesSourceConcept = !hasSourceConceptMatches || requestedConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); });
      return inSelectedDomain && matchesSourceConcept;
    });
    list.replaceChildren();
    document.getElementById("practice-count").textContent = `${visible.length}문항`;
    progress.textContent = `${visible.filter(function (item) { return answered.has(item.id); }).length} / ${visible.length}`;
    visible.forEach(function (item) {
      const card = document.createElement("article");
      card.className = "problem-card";
      card.id = `problem-${item.id}`;
      card.dataset.itemId = item.id;
      card.dataset.domain = item.domain;
      card.dataset.answered = String(answered.has(item.id));
      const meta = document.createElement("div");
      meta.className = "problem-meta";
      meta.innerHTML = `<b>${escapeHtml(item.domain)} · ${escapeHtml(item.stage)}</b><span>GFIELD 자체 연습</span>`;
      const heading = document.createElement("h3");
      heading.textContent = `${String(bank.items.indexOf(item) + 1).padStart(2, "0")} · ${item.title}`;
      const prompt = document.createElement("p");
      prompt.className = "problem-prompt";
      prompt.innerHTML = mathHtml(item.prompt);
      const choices = document.createElement("div");
      choices.className = "choices";
      choices.setAttribute("role", "group");
      choices.setAttribute("aria-label", `${item.title} 선택지`);
      const feedback = document.createElement("p");
      feedback.className = "feedback";
      feedback.setAttribute("aria-live", "polite");
      item.choices.forEach(function (choice, index) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice";
        button.dataset.choice = String(index);
        button.innerHTML = `<span class="choice-mark">${"ABCDE"[index]}</span><span class="choice-value">${mathHtml(choice)}</span>`;
        button.addEventListener("click", function () {
          if (card.dataset.answered === "true") return;
          const isCorrect = index === item.answer;
          button.classList.add(isCorrect ? "correct" : "wrong");
          feedback.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
          feedback.textContent = isCorrect ? "맞았어요. 풀이에서 사용한 개념과 선택 이유를 확인해 보세요." : "아직 정답이 아니에요. 힌트를 보고 다시 생각해 보세요.";
          if (isCorrect) {
            card.dataset.answered = "true";
            card.querySelectorAll(".choice").forEach(function (option) { option.disabled = true; });
            answered.add(item.id);
            progress.textContent = `${visible.filter(function (entry) { return answered.has(entry.id); }).length} / ${visible.length}`;
          } else {
            button.disabled = true;
          }
        });
        choices.append(button);
      });
      if (answered.has(item.id)) {
        choices.querySelectorAll(".choice").forEach(function (option, index) {
          option.disabled = true;
          if (index === item.answer) option.classList.add("correct");
        });
        feedback.className = "feedback correct";
        feedback.textContent = "맞았어요. 풀이에서 사용한 개념과 선택 이유를 확인해 보세요.";
      }
      const hint = document.createElement("details");
      hint.className = "worked-solution hint-panel";
      hint.innerHTML = `<summary>한 단계 힌트 보기</summary><p>${mathHtml(item.hint)}</p>`;
      const solution = document.createElement("details");
      solution.className = "worked-solution";
      solution.innerHTML = `<summary>풀이와 다른 접근 질문 보기</summary><ol>${item.solution.map(function (step) { return `<li>${mathHtml(step)}</li>`; }).join("")}</ol><p class="connection-question"><strong>개념 연결 질문</strong><br>${escapeHtml(item.connection)}</p>`;
      card.append(meta, heading, prompt, choices, feedback, hint, solution);
      list.append(card);
    });
  }
  const targetedNote = document.getElementById("targeted-practice-note");
  const selected = requestedDomains.map(function (id) { return bank.domains.includes(domainIds[id]) ? domainIds[id] : ""; }).filter(Boolean);
  const sourceYear = /^\d{4}$/.test(params.get("sourceYear") || "") ? params.get("sourceYear") : "";
  const sourceForm = /^[ABCD]$/.test(params.get("sourceForm") || "") ? params.get("sourceForm") : "";
  const sourceQuestions = (params.get("sourceQuestions") || "").split(",").map(Number).filter(function (value) { return Number.isInteger(value) && value > 0 && value <= 25; });
  const mockWrongQuestions = (params.get("mockWrongQuestions") || "").split(",").map(Number).filter(function (value) { return Number.isInteger(value) && value > 0 && value <= 25; });
  if (mockWrongQuestions.length) {
    const mockDomains = requestedDomains.map(function (id) { return domainIds[id]; }).filter(function (name) { return bank.domains.includes(name); });
    if (mockDomains.length) activeDomains = new Set(mockDomains);
  }
  if (selected.length || sourceYear || sourceQuestions.length || mockWrongQuestions.length || requestedConcepts.length) {
    if (selected.length) activeDomains = new Set(selected);
    targetedNote.hidden = false;
    const description = document.getElementById("targeted-practice-description");
    const sourceDescription = sourceYear ? `${sourceYear} AMC 10${sourceForm ? ` ${sourceForm}` : ""} 원본에서 표시한 ${sourceQuestions.length ? `${sourceQuestions.join(", ")}번 문항 이후 ` : ""}` : "";
    const mockDescription = mockWrongQuestions.length ? `지필드 모의고사 ${mockWrongQuestions.join(", ")}번에서 다시 볼 개념을 찾았어요. ` : "";
    const conceptDescription = hasSourceConceptMatches
      ? `원본 풀이 개념 ${requestedConcepts.map(function (id) { return conceptLabels[id] || id; }).join("·")}과 연결된 GFIELD 창작 문항 ${sourceConceptItems.length}개를 먼저 모았어요.`
      : requestedConcepts.length
        ? "원본 풀이 개념과 직접 연결된 연습 문항은 아직 없어, 표시한 영역의 GFIELD 창작 문항을 보여 줍니다."
        : "";
    const domainDescription = selected.length ? `${selected.join("·")} 영역의 GFIELD 창작 문항을 모았어요.` : "영역이 분류되지 않은 문항이 있어요. 아래에서 필요한 연습 영역을 골라 보세요.";
    description.textContent = `${mockDescription}${sourceDescription}${conceptDescription || domainDescription}`;
    const returnLink = document.getElementById("targeted-practice-return");
    returnLink.href = `./competition-paper-review.html?grade=${grade}&program=amc10${sourceYear ? `&year=${sourceYear}` : ""}${sourceForm ? `&form=${sourceForm}` : ""}`;
    const sourceLink = document.getElementById("targeted-source-paper");
    if (sourceLink && sourceYear) {
      const formPath = Number(sourceYear) < 2002 ? sourceYear : `${sourceYear}${sourceForm || "A"}`;
      sourceLink.href = `https://live.poshenloh.com/past-contests/amc10/${formPath}`;
      sourceLink.textContent = `${sourceYear} AMC 10${sourceForm ? ` ${sourceForm}` : ""} 원본 문제·답·풀이 ↗`;
      sourceLink.hidden = false;
    }
  }
  document.getElementById("reset-practice").addEventListener("click", function () {
    answered.clear();
    const visibleCount = bank.items.filter(function (item) { return (activeDomains.size === 0 || activeDomains.has(item.domain)) && (!hasSourceConceptMatches || requestedConcepts.some(function (concept) { return (item.sourceConcepts || []).includes(concept); })); }).length;
    progress.textContent = `0 / ${visibleCount}`;
    renderItems();
  });
  renderFilters();
  renderItems();
})();
