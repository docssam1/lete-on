(function () {
  "use strict";
  const requestedGrade = Number(new URLSearchParams(window.location.search).get("grade"));
  const grade = [7, 8, 9].includes(requestedGrade) ? requestedGrade : 7;
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
  let activeDomain = "전체";

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
      button.setAttribute("aria-pressed", String(domain === activeDomain));
      button.addEventListener("click", function () { activeDomain = domain; renderFilters(); renderItems(); });
      filters.append(button);
    });
  }
  function renderItems() {
    const visible = bank.items.filter(function (item) { return activeDomain === "전체" || item.domain === activeDomain; });
    list.replaceChildren();
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
            progress.textContent = `${answered.size} / ${bank.items.length}`;
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
  document.getElementById("reset-practice").addEventListener("click", function () {
    answered.clear();
    progress.textContent = `0 / ${bank.items.length}`;
    renderItems();
  });
  renderFilters();
  renderItems();
})();
