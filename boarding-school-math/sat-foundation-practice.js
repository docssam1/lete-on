(function () {
  "use strict";
  const requestedGrade = Number(new URLSearchParams(window.location.search).get("grade"));
  const grade = [6, 7, 8, 9, 10].includes(requestedGrade) ? requestedGrade : 7;
  const route = `./boarding-roadmap.html?grade=${grade}`;
  ["sat-brand-route", "sat-nav-route", "sat-back-route", "sat-footer-route"].forEach(function (id) {
    const link = document.getElementById(id);
    if (link) link.href = id === "sat-back-route" ? `${route}#annual-plan` : route;
  });
  const nav = document.getElementById("sat-nav-route");
  if (nav) nav.textContent = `${grade}학년 성장 지도`;
  const footer = document.getElementById("sat-footer-route");
  if (footer) footer.textContent = `${grade}학년 로드맵으로 돌아가기`;

  const bank = window.GFIELDSATFoundationPractice;
  if (!bank) return;
  const list = document.getElementById("sat-items");
  const filters = document.getElementById("sat-domain-filters");
  const progress = document.getElementById("sat-progress");
  const solved = new Set();
  let activeDomain = "전체";

  function addMath(target, value) {
    if (window.GFIELDMathText) window.GFIELDMathText.append(target, value);
    else target.textContent = String(value);
  }
  function renderFilters() {
    filters.replaceChildren();
    ["전체"].concat(bank.domains).forEach(function (domain) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sat-domain-filter";
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
      const index = bank.items.indexOf(item);
      const card = document.createElement("article");
      card.className = "problem-card";
      card.dataset.itemId = item.id;
      card.dataset.answered = String(solved.has(item.id));
      const meta = document.createElement("div");
      meta.className = "problem-meta";
      const domain = document.createElement("b"); domain.textContent = `${item.domain} · ${item.stage}`;
      const label = document.createElement("span"); label.textContent = item.stage === "선택 확장" ? "준비되면 선택" : "GFIELD 자체 연습";
      meta.append(domain, label);
      const heading = document.createElement("h3"); heading.textContent = `${String(index + 1).padStart(2, "0")} · ${item.title}`;
      const prompt = document.createElement("p"); prompt.className = "problem-prompt"; addMath(prompt, item.prompt);
      const choices = document.createElement("div"); choices.className = "choices"; choices.setAttribute("role", "group"); choices.setAttribute("aria-label", `${item.title} 선택지`);
      const feedback = document.createElement("p"); feedback.className = "feedback"; feedback.setAttribute("aria-live", "polite");
      item.choices.forEach(function (choice, choiceIndex) {
        const button = document.createElement("button"); button.type = "button"; button.className = "choice"; button.dataset.choice = String(choiceIndex);
        const mark = document.createElement("span"); mark.className = "choice-mark"; mark.textContent = "ABCDE"[choiceIndex];
        const value = document.createElement("span"); value.className = "choice-value"; addMath(value, choice);
        button.append(mark, value);
        button.addEventListener("click", function () {
          if (card.dataset.answered === "true") return;
          const correct = choiceIndex === item.answer;
          button.classList.add(correct ? "correct" : "wrong");
          button.setAttribute("aria-pressed", "true");
          feedback.className = `feedback ${correct ? "correct" : "wrong"}`;
          feedback.textContent = correct ? "맞았어요. 풀이에서 기준량과 관계를 확인해 보세요." : "다시 생각해 봐요. 틀린 선택은 표시해 두고 다른 답을 고를 수 있어요.";
          if (correct) {
            card.dataset.answered = "true";
            card.classList.add("solved");
            choices.querySelectorAll("button").forEach(function (option) { option.disabled = true; });
            solved.add(item.id);
            progress.textContent = `${solved.size} / ${bank.items.length}`;
          } else button.disabled = true;
        });
        choices.append(button);
      });
      if (solved.has(item.id)) {
        choices.querySelectorAll("button").forEach(function (button, choiceIndex) {
          button.disabled = true;
          if (choiceIndex === item.answer) { button.classList.add("correct"); button.setAttribute("aria-pressed", "true"); }
        });
        feedback.className = "feedback correct";
        feedback.textContent = "맞았어요. 풀이에서 기준량과 관계를 확인해 보세요.";
        card.classList.add("solved");
      }
      const hint = document.createElement("details"); hint.className = "worked-solution hint-panel";
      const hintTitle = document.createElement("summary"); hintTitle.textContent = "한 단계 힌트 보기";
      const hintText = document.createElement("p"); addMath(hintText, item.hint); hint.append(hintTitle, hintText);
      const solution = document.createElement("details"); solution.className = "worked-solution";
      const solutionTitle = document.createElement("summary"); solutionTitle.textContent = "풀이와 연결 질문 보기";
      const steps = document.createElement("ol"); item.solution.forEach(function (step) { const li = document.createElement("li"); addMath(li, step); steps.append(li); });
      const connection = document.createElement("p"); connection.className = "connection-question";
      const connectionLabel = document.createElement("strong"); connectionLabel.textContent = "한 걸음 더";
      connection.append(connectionLabel, document.createElement("br")); addMath(connection, item.connection);
      solution.append(solutionTitle, steps, connection);
      card.append(meta, heading, prompt, choices, feedback, hint, solution);
      list.append(card);
    });
  }
  document.getElementById("sat-reset-practice").addEventListener("click", function () {
    solved.clear(); progress.textContent = `0 / ${bank.items.length}`; renderItems();
  });
  renderFilters();
  renderItems();
})();
