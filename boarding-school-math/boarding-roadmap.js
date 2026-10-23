(function () {
  "use strict";
  const data = window.GFIELDBoardingGradeRoadmap;
  if (!data) return;
  const $ = function (id) { return document.getElementById(id); };
  const initial = Number(new URLSearchParams(location.search).get("grade"));
  let grade = data.getGrade(initial) ? initial : 7;
  let stage = 0;
  let route = "secure";
  let competition = null;
  const publicPractice = {
    6: [
      ["6.NS.A", "분수 나눗셈"], ["6.RP.A", "비와 비율"], ["6.EE.A", "식 쓰기"],
      ["6.NS.B", "소수와 계산"], ["6.NS.C", "음수와 좌표"], ["6.EE.B", "방정식·부등식"],
      ["6.EE.C", "두 양의 관계"], ["6.G.A", "도형과 넓이"], ["6.SP.A", "자료 읽기"], ["6.SP.B", "자료 요약"]
    ],
    7: [["7.NS.A", "유리수 연산"], ["7.RP.A", "비례 관계"]]
  };

  function setText(id, value) { $(id).textContent = value; }
  function updateUrl() {
    const url = new URL(location.href);
    url.searchParams.set("grade", String(grade));
    history.replaceState(null, "", url);
  }
  function renderGradeButtons() {
    const container = $("grade-buttons");
    if (!container.childElementCount) {
      data.grades.forEach(function (entry) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "grade-button";
        button.textContent = `G${entry.grade}`;
        button.setAttribute("aria-label", `Grade ${entry.grade} 지도 보기`);
        button.addEventListener("click", function () { grade = entry.grade; stage = 0; render(); });
        container.append(button);
      });
    }
    Array.from(container.children).forEach(function (button, index) {
      button.setAttribute("aria-pressed", String(data.grades[index].grade === grade));
    });
  }
  function renderStages(entry) {
    const list = $("stage-list");
    list.replaceChildren();
    entry.steps.forEach(function (step, index) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-button";
      button.setAttribute("aria-pressed", String(index === stage));
      button.setAttribute("aria-label", `단계 ${index + 1}, ${step[0]} 보기`);
      const number = document.createElement("span");
      number.className = "stage-node";
      number.textContent = String(index + 1).padStart(2, "0");
      const label = document.createElement("strong");
      label.textContent = step[0];
      button.append(number, label);
      button.addEventListener("click", function () { stage = index; renderStages(entry); list.querySelectorAll("button")[index].focus(); });
      li.append(button);
      list.append(li);
    });
    setText("stage-number", `단계 ${stage + 1} / ${entry.steps.length}`);
    setText("stage-title", entry.steps[stage][0]);
    setText("stage-copy", entry.steps[stage][1]);
  }
  function renderRoutes() {
    const buttons = $("route-buttons");
    buttons.replaceChildren();
    data.routes.forEach(function (entry) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "route-button";
      button.setAttribute("aria-pressed", String(entry.id === route));
      const title = document.createElement("strong");
      title.textContent = entry.title;
      const description = document.createElement("small");
      description.textContent = entry.description;
      button.append(title, description);
      button.addEventListener("click", function () { route = entry.id; renderRoutes(); });
      buttons.append(button);
    });
    const entry = data.getRoute(route);
    setText("route-name", entry.title);
    setText("route-description", entry.description);
    setText("route-check", entry.check);
  }
  function renderLevels(entry) {
    setText("level-repair", `${entry.steps[0][0]}: ${entry.steps[0][1]}`);
    setText("level-secure", "배운 개념을 혼자 풀고 며칠 뒤 새 문제에서도 설명해요.");
    setText("level-extend", entry.steps[2][1]);
  }
  function renderGradeFocus() {
    const host = $("grade-focus-list"); host.replaceChildren();
    data.getTracks(grade).forEach(function (track) {
      const item = document.createElement("div");
      const label = document.createElement("strong"); label.textContent = track[0];
      const description = document.createElement("span"); description.textContent = track[1];
      item.append(label, description); host.append(item);
    });
  }
  function renderPracticeLinks() {
    const items = publicPractice[grade] || [];
    const section = $("grade-practice");
    const primary = $("grade-practice-links");
    const more = $("grade-practice-more");
    const moreLinks = $("grade-practice-more-links");
    section.hidden = items.length === 0;
    primary.replaceChildren();
    moreLinks.replaceChildren();
    more.hidden = items.length <= 3;
    more.open = false;
    items.forEach(function (item, index) {
      const link = document.createElement("a");
      link.href = `./unit-workbook.html?cluster=${encodeURIComponent(item[0])}&mode=workbook&audience=student&locale=ko`;
      link.textContent = `${item[1]} · 36문항 →`;
      (index < 3 ? primary : moreLinks).append(link);
    });
  }
  function renderCompetitionOptions() {
    const select = $("competition-select");
    const previous = competition;
    select.replaceChildren();
    const options = data.competitionOptions(grade);
    options.forEach(function (entry) {
      const option = document.createElement("option");
      option.value = entry.id;
      option.textContent = `${entry.title} · ${entry.itemCount}문항`;
      select.append(option);
    });
    competition = options.some(function (entry) { return entry.id === previous; }) ? previous : (grade >= 6 && grade <= 8 ? "amc8" : "sasmo");
    select.value = competition;
    $("paper-review-link").href = `./competition-paper-review.html?grade=${grade}&program=${competition}`;
    $("competition-practice-link").hidden = grade < 6 || grade > 8;
    setText("competition-guidance", `채점된 문제지만 입력해 주세요. 문제 하나를 한 영역에만 넣고, 전체 합계는 ${options.find(function (entry) { return entry.id === competition; }).itemCount}문항을 넘기지 마세요.`);
    resetCompetitionReport();
  }
  function resetCompetitionReport() {
    setText("competition-report-title", "아직 결과가 없어요");
    setText("competition-report-summary", "영역마다 푼 개수와 맞힌 개수를 적어 주세요.");
    $("competition-report-rows").replaceChildren();
    $("competition-error").hidden = true;
  }
  function renderCompetitionRows() {
    const host = $("domain-rows");
    host.replaceChildren();
    data.strands.forEach(function (entry) {
      const row = document.createElement("div");
      row.className = "domain-row";
      const title = document.createElement("strong");
      title.textContent = entry.title;
      row.append(title);
      ["attempted", "correct"].forEach(function (field) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.max = "30";
        input.step = "1";
        input.value = "0";
        input.dataset.field = field;
        input.dataset.strand = entry.id;
        input.setAttribute("aria-label", `${entry.title} ${field === "attempted" ? "푼 문항 수" : "정답 수"}`);
        row.append(input);
      });
      host.append(row);
    });
  }
  function analyzeCompetition(event) {
    event.preventDefault();
    const option = data.competitionOptions(grade).find(function (entry) { return entry.id === competition; });
    const rows = data.strands.map(function (strand) {
      return { attempted: $(`domain-rows`).querySelector(`[data-strand="${strand.id}"][data-field="attempted"]`).value,
        correct: $(`domain-rows`).querySelector(`[data-strand="${strand.id}"][data-field="correct"]`).value };
    });
    const result = data.analyzeCompetition(rows, option.itemCount);
    if (!result.valid) {
      resetCompetitionReport();
      setText("competition-error", result.reason);
      $("competition-error").hidden = false;
      return;
    }
    $("competition-error").hidden = true;
    const paperLabel = $("paper-label").value.trim();
    setText("competition-report-title", `${option.title} · ${result.correct}/${result.attempted}`);
    setText("competition-report-summary", `${paperLabel ? `${paperLabel} · ` : ""}${result.complete ? "전체 문제" : "입력한 문제"}를 영역별로 봤어요. ${result.reviewFirst ? `${result.reviewFirst}의 풀이를 먼저 다시 보세요.` : "어느 영역을 먼저 볼지는 더 풀어 본 뒤 정해요."} 3문제 미만인 영역은 정답률로 비교하기 어려워요.`);
    const host = $("competition-report-rows");
    host.replaceChildren();
    result.rows.forEach(function (entry) {
      const row = document.createElement("div");
      row.className = "report-row";
      const title = document.createElement("strong"); title.textContent = entry.title;
      const value = document.createElement("span"); value.textContent = entry.attempted ? `${entry.correct}/${entry.attempted} · ${entry.rate}%` : "입력 없음";
      const note = document.createElement("small"); note.textContent = entry.evidence;
      row.append(title, value, note); host.append(row);
    });
  }
  function render() {
    const entry = data.getGrade(grade);
    setText("grade-label", `GRADE ${grade}`);
    setText("grade-title", entry.title);
    setText("grade-core", entry.core);
    setText("grade-bridge", entry.bridge);
    setText("source-chip", entry.source === "inferred" ? "Grade 9 · 추정안" : "참고 로드맵");
    setText("grade-note", grade === 7
      ? "7.NS.A 단원 연습은 공개됐어요. 진단은 아직 검수 중이에요."
      : entry.source === "inferred"
        ? "Grade 9는 제공된 7·8·10학년 자료로 추정했어요. 학교 과목 순서는 선생님과 확인해 주세요."
        : "아직 이 학생의 진단 결과가 없어요. 다음 진도는 풀이를 보고 선생님과 정해요.");
    $("previous-grade").disabled = grade === data.grades[0].grade;
    $("next-grade").disabled = grade === data.grades[data.grades.length - 1].grade;
    renderGradeButtons();
    renderStages(entry);
    renderLevels(entry);
    renderGradeFocus();
    renderPracticeLinks();
    renderCompetitionOptions();
    renderCompetitionRows();
    updateUrl();
  }
  $("previous-grade").addEventListener("click", function () { if (grade > 3) { grade -= 1; stage = 0; render(); } });
  $("next-grade").addEventListener("click", function () { if (grade < 10) { grade += 1; stage = 0; render(); } });
  $("competition-select").addEventListener("change", function (event) {
    competition = event.target.value;
    $("paper-review-link").href = `./competition-paper-review.html?grade=${grade}&program=${competition}`;
    const option = data.competitionOptions(grade).find(function (entry) { return entry.id === competition; });
    setText("competition-guidance", `채점된 문제지만 입력해 주세요. 문제 하나를 한 영역에만 넣고, 전체 합계는 ${option.itemCount}문항을 넘기지 마세요.`);
    resetCompetitionReport();
    renderCompetitionRows();
  });
  $("competition-form").addEventListener("submit", analyzeCompetition);
  render();
  renderRoutes();
})();
