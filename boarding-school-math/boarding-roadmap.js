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
    setText("level-secure", `${entry.steps[1][0]}와 ${entry.steps[3][0]}을 새 문제에서도 설명`);
    setText("level-extend", entry.steps[2][1]);
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
    setText("competition-guidance", `이 학년의 대회 선택은 탐색용입니다. 채점이 확인된 문제지만 입력하고, 각 문항을 아래 네 영역 중 하나에 한 번만 분류하세요. 합계는 ${options.find(function (entry) { return entry.id === competition; }).itemCount}문항 이하로 입력할 수 있습니다.`);
    resetCompetitionReport();
  }
  function resetCompetitionReport() {
    setText("competition-report-title", "결과 입력 전");
    setText("competition-report-summary", "영역별로 푼 문항과 정답 수를 입력하면 근거의 양과 비율을 나란히 비교합니다.");
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
    setText("competition-report-summary", `${paperLabel ? `${paperLabel} · ` : ""}${result.complete ? "선택한 시험의 전체 문항" : "입력한 일부 문항"}에 대한 영역별 수행입니다. ${result.reviewFirst ? `${result.reviewFirst}의 풀이 과정을 먼저 다시 살펴보세요.` : "비교 가능한 영역 간 우선순위는 아직 정하지 않습니다."} 푼 문항이 3개 미만인 영역은 비율만으로 비교하지 않습니다.`);
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
    setText("source-chip", entry.source === "inferred" ? "Grade 9 · 연결 추정안" : "제공된 자료 기반 · 예시");
    setText("grade-note", grade === 7
      ? "Grade 7 7.NS.A 진단은 아직 검수·공개 전입니다. 이 지도는 결과를 읽지 않으며 실제 배정도 하지 않습니다."
      : entry.source === "inferred"
        ? "Grade 9 경로는 제공된 7·8·10학년 자료를 연결해 추정한 안입니다. 실제 과목 순서는 학교·교사와 확인합니다."
        : "이 지도에는 학생 진단 결과가 연결되지 않았습니다. 실제 진도와 경로는 교사 확인 후 결정합니다.");
    $("previous-grade").disabled = grade === data.grades[0].grade;
    $("next-grade").disabled = grade === data.grades[data.grades.length - 1].grade;
    renderGradeButtons();
    renderStages(entry);
    renderLevels(entry);
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
    setText("competition-guidance", `채점이 확인된 문제지만 입력하세요. 각 문항은 한 영역에만 분류하고 합계는 ${option.itemCount}문항 이하로 입력할 수 있습니다.`);
    resetCompetitionReport();
    renderCompetitionRows();
  });
  $("competition-form").addEventListener("submit", analyzeCompetition);
  render();
  renderRoutes();
})();
