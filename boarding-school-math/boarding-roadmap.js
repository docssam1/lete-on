(function () {
  "use strict";
  const data = window.GFIELDBoardingGradeRoadmap;
  if (!data) return;
  const $ = function (id) { return document.getElementById(id); };
  const initial = Number(new URLSearchParams(location.search).get("grade"));
  let grade = data.getGrade(initial) ? initial : 7;
  let stage = grade === 7 ? null : 0;
  let route = null;
  let competition = null;
  const competitionSources = {
    sasmo: { href: "./sasmo.html", label: "SASMO 자료 보기 →" },
    kangaroo: { href: "https://mathkangaroo.org/mks/faqs/about-the-test/", label: "Math Kangaroo 공식 규칙 ↗", external: true },
    amc8: { href: "https://maa.org/student-programs/amc/", label: "MAA AMC 공식 안내 ↗", external: true },
    amc10: { href: "https://maa.org/student-programs/amc/", label: "MAA AMC 공식 안내 ↗", external: true },
    amc12: { href: "https://maa.org/student-programs/amc/", label: "MAA AMC 공식 안내 ↗", external: true }
  };
  const publicPractice = {
    6: [
      ["6.NS.A", "분수 나눗셈"], ["6.RP.A", "비와 비율"], ["6.EE.A", "식 쓰기"],
      ["6.NS.B", "소수와 계산"], ["6.NS.C", "음수와 좌표"], ["6.EE.B", "방정식·부등식"],
      ["6.EE.C", "두 양의 관계"], ["6.G.A", "도형과 넓이"], ["6.SP.A", "자료 읽기"], ["6.SP.B", "자료 요약"]
    ],
    7: [["7.NS.A", "유리수 연산"], ["7.RP.A", "비례 관계"]]
  };

  function setText(id, value) { $(id).textContent = value; }
  function updateUrl(mode) {
    const url = new URL(location.href);
    url.searchParams.set("grade", String(grade));
    if (mode === "push") history.pushState(null, "", url);
    else if (mode === "replace") history.replaceState(null, "", url);
  }
  function changeGrade(next) {
    if (next === grade || !data.getGrade(next)) return;
    grade = next;
    stage = grade === 7 ? null : 0;
    route = null;
    competition = null;
    $("grade7-branches").querySelector("details").open = false;
    render("push");
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
        button.addEventListener("click", function () { changeGrade(entry.grade); });
        container.append(button);
      });
    }
    Array.from(container.children).forEach(function (button, index) {
      button.setAttribute("aria-pressed", String(data.grades[index].grade === grade));
    });
  }
  function renderStages(entry) {
    const list = $("stage-list");
    const grade7 = grade === 7;
    list.classList.toggle("grade7-path", grade7);
    list.setAttribute("aria-label", grade7 ? "7학년 개념 연결 예시. 선택은 현재 위치나 학습 완료를 뜻하지 않습니다." : "선택한 학년의 학습 단계");
    list.replaceChildren();
    entry.steps.forEach(function (step, index) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-button";
      button.setAttribute("aria-pressed", String(index === stage));
      button.setAttribute("aria-label", grade7 ? `살펴볼 지점 ${index + 1}, ${step[0]}` : `단계 ${index + 1}, ${step[0]} 보기`);
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
    $("grade7-road-intro").hidden = !grade7;
    $("grade7-branches").hidden = !grade7;
    document.querySelector(".journey-main").classList.toggle("grade7-active", grade7);
    const detail = document.querySelector(".stage-detail");
    detail.hidden = grade7 && stage === null;
    $("grade7-stage-check").hidden = !grade7 || stage === null;
    $("grade7-stage-resource").hidden = true;
    $("grade7-no-resource").hidden = true;
    if (detail.hidden) return;
    setText("stage-number", grade7 ? `살펴보는 구간 ${stage + 1} / ${entry.steps.length}` : `단계 ${stage + 1} / ${entry.steps.length}`);
    setText("stage-title", entry.steps[stage][0]);
    setText("stage-copy", entry.steps[stage][1]);
    if (grade7) {
      const stop = data.grade7Stops[stage];
      setText("grade7-stage-question", stop.check);
      if (stop.clusterId) {
        const link = $("grade7-stage-resource");
        link.href = `./unit-workbook.html?cluster=${encodeURIComponent(stop.clusterId)}&mode=workbook&audience=student&locale=ko`;
        link.textContent = `${stop.title} 워크북 보기 · ${stop.resourceState === "review-preview" ? "검수 시안" : "36문항"} →`;
        link.hidden = false;
      } else $("grade7-no-resource").hidden = false;
    }
  }
  function renderRoutes() {
    const buttons = $("route-buttons");
    buttons.replaceChildren();
    data.routes.forEach(function (entry, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "route-button";
      button.setAttribute("aria-pressed", String(entry.id === route));
      const title = document.createElement("strong");
      title.textContent = entry.title;
      button.append(title);
      button.addEventListener("click", function () { route = entry.id; renderRoutes(); buttons.querySelectorAll("button")[index].focus(); });
      buttons.append(button);
    });
    const entry = data.getRoute(route);
    document.querySelector(".route-layout").classList.toggle("is-empty", !entry);
    document.querySelector(".route-explanation").hidden = !entry;
    setText("route-status", entry ? "선택한 방향" : "선택 전");
    setText("route-name", entry ? entry.title : "학습 방향");
    setText("route-description", entry ? entry.description : "");
    setText("route-check", entry ? entry.check : "");
    $("route-check-block").hidden = !entry;
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
    section.querySelector("h4").textContent = grade === 7 ? "단원 워크북" : "지금 풀어 볼 수 있어요";
    section.querySelector("p").textContent = grade === 7 ? "유리수 연산은 검수 시안입니다." : "배운 개념을 문제로 확인해 보세요.";
    primary.replaceChildren();
    moreLinks.replaceChildren();
    more.hidden = items.length <= 3;
    more.open = false;
    items.forEach(function (item, index) {
      const link = document.createElement("a");
      link.href = `./unit-workbook.html?cluster=${encodeURIComponent(item[0])}&mode=workbook&audience=student&locale=ko`;
      link.textContent = `${item[1]} · 36문항${item[0] === "7.NS.A" ? " · 검수 시안" : ""} →`;
      (index < 3 ? primary : moreLinks).append(link);
    });
  }
  function renderCompetitionOptions() {
    const select = $("competition-select");
    const previous = competition;
    select.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "대회를 선택해 주세요";
    select.append(placeholder);
    const options = data.competitionOptions(grade);
    options.forEach(function (entry) {
      const option = document.createElement("option");
      option.value = entry.id;
      option.textContent = `${entry.title} · ${entry.itemCount}문항`;
      select.append(option);
    });
    competition = options.some(function (entry) { return entry.id === previous; }) ? previous : "";
    select.value = competition;
    if (!competition) $("paper-label").value = "";
    updateCompetitionFields();
    resetCompetitionReport();
  }
  function updateCompetitionFields() {
    const option = data.competitionOptions(grade).find(function (entry) { return entry.id === competition; });
    const selected = Boolean(option);
    $("paper-review-link").hidden = !selected;
    if (selected) $("paper-review-link").href = `./competition-paper-review.html?grade=${grade}&program=${competition}`;
    $("paper-label-field").hidden = !selected;
    document.querySelector(".domain-header").hidden = !selected;
    $("domain-rows").hidden = !selected;
    document.querySelector(".competition-submit").hidden = !selected;
    $("competition-practice-link").hidden = !(grade === 6 && competition === "amc8");
    const source = competitionSources[competition];
    const sourceLink = $("competition-source-link");
    sourceLink.hidden = !source;
    if (source) {
      sourceLink.href = source.href;
      sourceLink.textContent = source.label;
      if (source.external) {
        sourceLink.target = "_blank";
        sourceLink.rel = "noopener noreferrer";
      } else {
        sourceLink.removeAttribute("target");
        sourceLink.removeAttribute("rel");
      }
    }
    setText("competition-guidance", selected
      ? "영역별로 푼 문제 수와 정답 수를 적어 주세요. 영역을 모르겠다면 문제별 복습에서 확인해요."
      : "대회를 고르면 영역별 입력칸이 나와요.");
  }
  function resetCompetitionReport() {
    document.querySelector(".competition-layout").classList.add("is-empty");
    document.querySelector(".competition-report").hidden = true;
    setText("competition-report-title", "아직 결과가 없어요");
    setText("competition-report-summary", competition ? "영역마다 푼 개수와 맞힌 개수를 적어 주세요." : "대회를 고르면 영역별 입력칸이 나와요.");
    $("competition-report-rows").replaceChildren();
    $("competition-error").hidden = true;
  }
  function renderCompetitionRows() {
    const host = $("domain-rows");
    host.replaceChildren();
    if (!competition) return;
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
    if (!option) {
      setText("competition-error", "대회를 선택해 주세요.");
      $("competition-error").hidden = false;
      return;
    }
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
    document.querySelector(".competition-layout").classList.remove("is-empty");
    document.querySelector(".competition-report").hidden = false;
    const paperLabel = $("paper-label").value.trim();
    setText("competition-report-title", `${option.title} · ${result.attempted}문제 중 ${result.correct}문제 정답`);
    const hasSmallSample = result.rows.some(function (entry) { return entry.attempted > 0 && entry.attempted < 3; });
    const comparableCount = result.rows.filter(function (entry) { return entry.attempted >= 3; }).length;
    const next = result.reviewFirst ? `${result.reviewFirst}부터 다시 보세요.` : comparableCount < 2
      ? "영역을 비교하려면 두 영역에서 각각 3문제 이상 풀어야 해요."
      : "영역별 정답률이 같아요. 틀린 문제부터 다시 보세요.";
    setText("competition-report-summary", `${paperLabel ? `${paperLabel} · ` : ""}${result.attempted}/${option.itemCount}문항 입력. ${next}${hasSmallSample ? " 3문제 미만인 영역은 정답률을 표시하지 않아요." : ""}`);
    const host = $("competition-report-rows");
    host.replaceChildren();
    result.rows.filter(function (entry) { return entry.attempted > 0; }).forEach(function (entry) {
      const row = document.createElement("div");
      row.className = "report-row";
      const title = document.createElement("strong"); title.textContent = entry.title;
      const value = document.createElement("span");
      value.textContent = entry.attempted < 3 ? `${entry.correct}/${entry.attempted}` : `${entry.correct}/${entry.attempted} · ${entry.rate}%`;
      row.append(title, value);
      if (entry.attempted > 0 && entry.attempted < 3) {
        const note = document.createElement("small"); note.textContent = "3문제 미만 · 비교 보류";
        row.append(note);
      }
      host.append(row);
    });
    document.querySelector(".competition-report").focus();
  }
  function render(historyMode) {
    const entry = data.getGrade(grade);
    setText("grade-map-title", `${grade}학년 수학 한눈에`);
    setText("grade-label", `${grade}학년`);
    setText("grade-title", entry.title);
    setText("grade-core", entry.core);
    setText("grade-bridge", entry.bridge);
    setText("source-chip", entry.source === "inferred" ? "9학년 · 추정안" : "학습 예시");
    setText("grade-note", grade === 7
      ? "7.RP.A 워크북은 공개됐어요. 7.NS.A 워크북과 진단은 검수 중이에요."
      : entry.source === "inferred"
        ? "Grade 9는 제공된 7·8·10학년 자료로 추정했어요. 학교 과목 순서는 선생님과 확인해 주세요."
        : "아직 진단 결과가 없어요. 실제 풀이를 보고 다음 단계를 정해요.");
    $("previous-grade").disabled = grade === data.grades[0].grade;
    $("next-grade").disabled = grade === data.grades[data.grades.length - 1].grade;
    renderGradeButtons();
    renderStages(entry);
    renderLevels(entry);
    renderGradeFocus();
    renderPracticeLinks();
    renderRoutes();
    renderCompetitionOptions();
    renderCompetitionRows();
    updateUrl(historyMode);
  }
  $("previous-grade").addEventListener("click", function () { changeGrade(grade - 1); });
  $("next-grade").addEventListener("click", function () { changeGrade(grade + 1); });
  window.addEventListener("popstate", function () {
    const next = Number(new URLSearchParams(location.search).get("grade"));
    if (next === grade) return;
    grade = data.getGrade(next) ? next : 7;
    stage = grade === 7 ? null : 0;
    route = null;
    competition = null;
    $("grade7-branches").querySelector("details").open = false;
    render(null);
  });
  $("competition-select").addEventListener("change", function (event) {
    competition = event.target.value;
    $("paper-label").value = "";
    updateCompetitionFields();
    resetCompetitionReport();
    renderCompetitionRows();
  });
  $("competition-form").addEventListener("submit", analyzeCompetition);
  render("replace");
})();
