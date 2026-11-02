(function () {
  "use strict";
  const data = window.GFIELDBoardingGradeRoadmap;
  if (!data) return;
  const localRecords = window.GFIELDLocalLearningRecord;
  const $ = function (id) { return document.getElementById(id); };
  const initial = Number(new URLSearchParams(location.search).get("grade"));
  let grade = data.getGrade(initial) ? initial : 7;
  if (data.getGrade(initial)) {
    document.body.classList.add("boarding-deep-link");
    document.querySelector(".grade-track").open = false;
  }
  let stage = grade === 7 ? null : 0;
  let route = null;
  let competition = new URLSearchParams(location.search).get("program") || "";
  let comparisonGrade = null;
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
  function savedGrade7PracticeCounts() {
    try {
      const saved = JSON.parse(localStorage.getItem("gfield-unit-workbook-progress:7.NS.A:v1") || "null");
      if (!saved || saved.schemaVersion !== 1 || saved.packId !== "gfield-grade7-ns-a-unit-workbook-v1" || !saved.correctByStandard || !saved.totalByStandard) return null;
      return { correctByStandard: saved.correctByStandard, totalByStandard: saved.totalByStandard };
    } catch (_error) { return null; }
  }
  function setupRoadmapShortcuts() {
    const links = Array.from(document.querySelectorAll("[data-roadmap-target]"));
    const targets = links.map(function (link) { return document.getElementById(link.dataset.roadmapTarget); }).filter(Boolean);
    function activate(targetId) {
      links.forEach(function (link) {
        if (link.dataset.roadmapTarget === targetId) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    links.forEach(function (link) {
      link.addEventListener("click", function () { activate(link.dataset.roadmapTarget); });
    });
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(function (entries) {
      const visible = entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible[0]) activate(visible[0].target.id);
    }, { rootMargin: "-72px 0px -62% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75] });
    targets.forEach(function (target) { observer.observe(target); });
  }
  function updateUrl(mode) {
    const url = new URL(location.href);
    url.searchParams.set("grade", String(grade));
    if (competition) url.searchParams.set("program", competition);
    else url.searchParams.delete("program");
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
  function revealGrade7Detail() {
    if (grade !== 7 || window.innerWidth > 600) return;
    const detail = document.querySelector(".stage-detail");
    const bounds = detail.getBoundingClientRect();
    if (bounds.top >= 0 && bounds.bottom <= window.innerHeight - 12) return;
    window.scrollTo({ top: Math.max(0, window.scrollY + bounds.top - window.innerHeight * .55), behavior: "instant" });
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
  function renderAnnualPlan() {
    const plan = data.getAnnualPlan(grade);
    const list = $("annual-plan-periods");
    list.replaceChildren();
    $("annual-plan-empty").hidden = Boolean(plan);
    list.hidden = !plan;
    if (!plan) {
      setText("annual-plan-title", `${grade}학년 · 개념 단계`);
      setText("annual-plan-note", `${grade}학년 월별 계획 자료는 없어 개념 단계만 보여 드려요.`);
      return;
    }
    setText("annual-plan-title", `${grade}학년 · ${plan.title}${plan.source === "inferred" ? " · 추정" : ""}`);
    setText("annual-plan-note", plan.note);
    plan.periods.forEach(function (period) {
      const item = document.createElement("li");
      const time = document.createElement("span");
      time.className = "annual-plan-period-time";
      time.textContent = period[0];
      const content = document.createElement("div");
      content.className = "annual-plan-period-content";
      const title = document.createElement("h3");
      title.textContent = period[1];
      const description = document.createElement("p");
      description.textContent = period[2];
      const resources = document.createElement("small");
      resources.textContent = `자료 예시 · ${period[3]}`;
      content.append(title, description, resources);
      item.append(time, content);
      list.append(item);
    });
    list.classList.toggle("is-inferred", plan.source === "inferred");
  }
  function renderConceptFlows() {
    const host = $("concept-flow-list");
    host.replaceChildren();
    data.conceptFlows.forEach(function (flow) {
      const article = document.createElement("article");
      article.className = "concept-flow";
      if (flow.optional) article.classList.add("concept-flow--optional");
      const heading = document.createElement("h3");
      heading.id = `${flow.id}-heading`;
      heading.textContent = flow.title;
      article.setAttribute("aria-labelledby", heading.id);
      if (flow.note) {
        const note = document.createElement("p");
        note.className = "concept-flow-note";
        note.id = `${flow.id}-note`;
        note.textContent = flow.note;
        article.setAttribute("aria-describedby", note.id);
        article.append(heading, note);
      } else {
        article.append(heading);
      }
      const list = document.createElement("ol");
      list.setAttribute("aria-label", `${flow.title} 개념 순서 예시`);
      flow.steps.forEach(function (step) {
        const item = document.createElement("li");
        item.textContent = step;
        list.append(item);
      });
      article.append(list);
      host.append(article);
    });
  }
  function renderStages(entry) {
    const list = $("stage-list");
    const grade7 = grade === 7;
    const selectionDisclosure = $("stage-external-resources");
    const renderedSelection = `${grade}:${stage === null ? "none" : stage}`;
    if (selectionDisclosure.dataset.selectionKey !== renderedSelection) {
      selectionDisclosure.open = false;
      selectionDisclosure.dataset.selectionKey = renderedSelection;
    }
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
      if (index === stage) {
        const selectedNote = document.createElement("span");
        selectedNote.className = "stage-selected-note";
        selectedNote.textContent = "살펴보는 중";
        button.append(selectedNote);
      }
      button.addEventListener("click", function () {
        stage = index;
        renderStages(entry);
        list.querySelectorAll("button")[index].focus();
        revealGrade7Detail();
      });
      li.append(button);
      list.append(li);
    });
    $("grade7-road-intro").hidden = !grade7;
    $("grade7-branches").hidden = !grade7;
    document.querySelector(".journey-main").classList.toggle("grade7-active", grade7);
    const detail = document.querySelector(".stage-detail");
    detail.hidden = grade7 && stage === null;
    $("grade7-stage-check").hidden = !grade7 || stage === null;
    $("stage-external-resource-list").replaceChildren();
    $("stage-external-resource-note").hidden = true;
    $("stage-external-resource-note").textContent = "";
    $("stage-external-resources").hidden = true;
    $("grade7-stage-resource").hidden = true;
    $("grade7-no-resource").hidden = true;
    renderJourneyPreview(entry);
    if (detail.hidden) return;
    setText("stage-number", grade7 ? `살펴보는 구간 ${stage + 1} / ${entry.steps.length}` : `단계 ${stage + 1} / ${entry.steps.length}`);
    setText("stage-title", entry.steps[stage][0]);
    setText("stage-copy", entry.steps[stage][1]);
    const stop = grade7 ? data.grade7Stops[stage] : null;
    const gradeResources = data.courseStageResources[grade];
    const externalResources = grade7
      ? (stop.resources || [])
      : (gradeResources && gradeResources[stage]) || [];
    const externalDisclosure = $("stage-external-resources");
    externalDisclosure.hidden = externalResources.length === 0;
    if (gradeResources && gradeResources.note) {
      $("stage-external-resource-note").textContent = gradeResources.note;
      $("stage-external-resource-note").hidden = false;
    }
    externalResources.forEach(function (resource) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = resource.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${resource.title} (새 창에서 열림)`);
      link.textContent = `${resource.title} ↗`;
      item.append(link);
      $("stage-external-resource-list").append(item);
    });
    if (grade7) {
      const checks = $("grade7-stage-questions");
      const savedPractice = stop.clusterId === "7.NS.A" ? savedGrade7PracticeCounts() : null;
      checks.replaceChildren();
      (stop.checks || [stop.check]).filter(Boolean).forEach(function (question) {
        const item = document.createElement("li");
        if (typeof question === "string") item.textContent = question;
        else {
          const standard = document.createElement("a"); standard.className = "grade7-standard-code"; standard.textContent = question.standard;
          standard.href = `./unit-workbook.html?cluster=${encodeURIComponent(stop.clusterId)}&mode=workbook&audience=student&locale=ko&standard=${encodeURIComponent(question.standard)}`;
          standard.setAttribute("aria-label", `${question.standard} 워크북에서 연습`);
          const prompt = document.createElement("span"); prompt.className = "grade7-check-prompt"; prompt.textContent = question.prompt;
          item.append(standard, prompt);
          const correct = savedPractice && savedPractice.correctByStandard[question.standard];
          const total = savedPractice && savedPractice.totalByStandard[question.standard];
          if (Number.isInteger(correct) && Number.isInteger(total) && total > 0 && correct >= 0 && correct <= total) {
            const progress = document.createElement("small"); progress.className = "grade7-practice-progress"; progress.textContent = `이 기기 연습 · 맞힌 기록 ${correct}/${total} · 진단 아님`; item.append(progress);
          }
        }
        checks.append(item);
      });
      $("grade7-stage-references").hidden = stop.id !== "nsa";
      if (stop.clusterId) {
        const link = $("grade7-stage-resource");
        link.href = `./unit-workbook.html?cluster=${encodeURIComponent(stop.clusterId)}&mode=workbook&audience=student&locale=ko`;
        link.textContent = `${stop.title} 워크북 보기 · ${stop.resourceState === "public" ? "36문항" : "검수 시안"} →`;
        link.hidden = false;
      } else $("grade7-no-resource").hidden = externalResources.length > 0;
    }
  }
  function renderJourneyPreview(entry) {
    const selectedLabel = $("journey-selected-label");
    const selectedTitle = $("journey-selected-title");
    const nextStop = $("journey-next-stop");
    const endNote = $("journey-route-end");
    $("journey-assessment-link").href = `./assessment-entry.html?grade=${grade}`;
    if (stage === null || !entry.steps[stage]) {
      selectedLabel.textContent = "아직 선택 전";
      selectedTitle.textContent = "경로 지점을 눌러 내용을 살펴보세요";
      nextStop.hidden = true;
      endNote.hidden = true;
      return;
    }
    selectedLabel.textContent = "지금 살펴보는 개념";
    selectedTitle.textContent = entry.steps[stage][0];
    const next = entry.steps[stage + 1];
    nextStop.hidden = !next;
    endNote.hidden = Boolean(next);
    if (next) $("journey-next-title").textContent = next[0];
  }
  function matchingAssessmentEvidence(selectedGrade, sourceId) {
    const gradeToMatch = Number.isInteger(selectedGrade) ? selectedGrade : grade;
    try {
      const records = window.GFIELDLocalLearningRecord;
      if (!records) return null;
      const evidence = sourceId
        ? records.storage.loadAssessmentEvidenceHistory().find(function (entry) { return entry.grade === gradeToMatch && entry.source && entry.source.id === sourceId; })
        : records.storage.loadLatestAssessmentEvidence(gradeToMatch);
      return evidence && !evidence.legacyEvidence && evidence.grade === gradeToMatch && evidence.source && evidence.currentCourse ? evidence : null;
    } catch (error) { return null; }
  }
  function assessmentDate(evidence) {
    return typeof evidence.testDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(evidence.testDate)
      ? new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${evidence.testDate}T00:00:00Z`))
      : "날짜 미입력";
  }
  function seasonLabel(season) {
    return ({ fall: "Fall", winter: "Winter", spring: "Spring", summer: "Summer" })[season] || "시기 미기재";
  }
  function assessmentLevelLabel(level) {
    return ({ "ssat-elementary-3": "SSAT Elementary · Grade 3", "ssat-elementary-4": "SSAT Elementary · Grade 4", "ssat-middle": "SSAT Middle", "ssat-upper": "SSAT Upper", "isee-primary-2": "ISEE Primary 2", "isee-primary-3": "ISEE Primary 3", "isee-primary-4": "ISEE Primary 4", "isee-lower": "ISEE Lower", "isee-middle": "ISEE Middle", "isee-upper": "ISEE Upper" })[level] || "레벨 미기재";
  }
  function renderAssessmentEvidence() {
    const label = $("journey-evidence-label");
    const title = $("journey-evidence-title");
    const copy = $("journey-evidence-copy");
    $("journey-assessment-link").href = `./assessment-entry.html?grade=${grade}`;
    const evidence = matchingAssessmentEvidence();
    if (!evidence) {
      label.textContent = "평가 기록 · " + grade + "학년";
      title.textContent = "아직 입력한 평가 기록이 없어요";
      copy.textContent = "시험 점수와 과정 선택은 평가 결과 비교에서 확인할 수 있어요. 이 경로는 공식 학교 배정이나 학생 등급을 뜻하지 않아요.";
      return;
    }
    label.textContent = `${evidence.source.label || "사용자 입력 평가"} · ${grade}학년`;
    title.textContent = `${evidence.currentCourse.label} → ${evidence.targetCourse ? evidence.targetCourse.label : evidence.currentCourse.label}`;
    copy.textContent = `${assessmentDate(evidence)} 성적표와 직접 고른 현재·목표 과정이에요. 점수로 학생 등급이나 공식 과목 배정을 판정하지 않아요.`;
    label.setAttribute("title", "이 기기에 저장된 사용자의 평가 입력");
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
  function renderComparisonOptions() {
    const select = $("comparison-grade");
    select.replaceChildren(new Option("학년 선택", ""));
    data.grades.filter(function (entry) { return entry.grade !== grade; }).forEach(function (entry) {
      select.add(new Option(`${entry.grade}학년${entry.source === "inferred" ? " · 추정안" : ""}`, String(entry.grade)));
    });
    if (comparisonGrade === grade || !data.getGrade(comparisonGrade)) comparisonGrade = null;
    select.value = comparisonGrade === null ? "" : String(comparisonGrade);
  }
  function renderComparisonColumn(prefix, entry) {
    const planLabel = entry.source === "inferred" ? "추정안" : entry.pathNote || "계획 예시";
    setText(`comparison-${prefix}-label`, `${entry.grade}학년 · ${planLabel}`);
    setText(`comparison-${prefix}-title`, entry.title);
    setText(`comparison-${prefix}-core`, entry.core);
    const list = $(`comparison-${prefix}-tracks`);
    list.replaceChildren();
    data.getTracks(entry.grade).forEach(function (track) {
      const term = document.createElement("dt"); term.textContent = track[0];
      const description = document.createElement("dd"); description.textContent = track[1];
      list.append(term, description);
    });
    const annualPlan = data.getAnnualPlan(entry.grade);
    const planTerm = document.createElement("dt"); planTerm.textContent = "연간 흐름";
    const planDescription = document.createElement("dd");
    planDescription.textContent = annualPlan ? annualPlan.title : "월별 계획 자료 없음";
    list.append(planTerm, planDescription);
    if (annualPlan) annualPlan.periods.forEach(function (period) {
      const term = document.createElement("dt"); term.textContent = period[0];
      const description = document.createElement("dd"); description.textContent = `${period[1]} · ${period[2]}`;
      list.append(term, description);
    });
  }
  function renderMobileComparison(current, target) {
    const host = $("comparison-mobile-view");
    host.replaceChildren();
    const header = document.createElement("div");
    header.className = "comparison-mobile-row comparison-mobile-header";
    header.setAttribute("aria-label", "비교하는 학년");
    [current, target].forEach(function (entry) {
      const cell = document.createElement("div");
      cell.className = "comparison-mobile-cell";
      const label = document.createElement("strong");
      const planLabel = entry.source === "inferred" ? "추정안" : entry.pathNote || "계획 예시";
      label.textContent = `${entry.grade}학년${entry.grade === grade ? " · 현재" : ""} · ${planLabel}`;
      const title = document.createElement("span"); title.textContent = entry.title;
      cell.append(label, title); header.append(cell);
    });
    host.append(header);
    if (current.source === "inferred" || target.source === "inferred") {
      const note = document.createElement("p");
      note.className = "comparison-mobile-note";
      note.textContent = `${target.source === "inferred" ? target.grade : current.grade}학년 계획은 제공된 인접 학년 자료를 연결한 추정안이에요. 학교 과목 순서를 확인해 주세요.`;
      host.append(note);
    }
    function addPair(label, left, right) {
      const row = document.createElement("article"); row.className = "comparison-mobile-row";
      const heading = document.createElement("h3"); heading.textContent = label;
      const values = document.createElement("div"); values.className = "comparison-mobile-values";
      [[current, left], [target, right]].forEach(function (pair) {
        const cell = document.createElement("div"); cell.className = "comparison-mobile-cell";
        const gradeLabel = document.createElement("span"); gradeLabel.className = "comparison-mobile-grade";
        gradeLabel.textContent = `${pair[0].grade}학년${pair[0].source === "inferred" ? " · 추정" : ""}`;
        const copy = document.createElement("p"); copy.textContent = pair[1] == null ? "이 학년 자료에 별도 항목 없음" : pair[1];
        cell.append(gradeLabel, copy); values.append(cell);
      });
      row.append(heading, values); host.append(row);
    }
    addPair("과정", `${current.title} · ${current.core}`, `${target.title} · ${target.core}`);
    const currentTracks = data.getTracks(current.grade), targetTracks = data.getTracks(target.grade);
    const trackKinds = [
      ["school", "학교 수학"], ["contest", "경시 · 선택"], ["sat", "SAT · 선택"], ["problem-solving", "문제 해결"]
    ];
    function trackKind(track) {
      if (/학교 수학/.test(track[0])) return "school";
      if (/경시/.test(track[0])) return "contest";
      if (/SAT/.test(track[0])) return "sat";
      if (/문제 해결/.test(track[0])) return "problem-solving";
      return null;
    }
    trackKinds.forEach(function (kind) {
      const left = currentTracks.find(function (track) { return trackKind(track) === kind[0]; });
      const right = targetTracks.find(function (track) { return trackKind(track) === kind[0]; });
      if (left || right) addPair(kind[1], left && left[1], right && right[1]);
    });
    const currentPlan = data.getAnnualPlan(current.grade), targetPlan = data.getAnnualPlan(target.grade);
    addPair("연간 흐름", currentPlan ? currentPlan.title : "월별 계획 자료 없음", targetPlan ? targetPlan.title : "월별 계획 자료 없음");
    const leftPeriods = currentPlan ? currentPlan.periods : [], rightPeriods = targetPlan ? targetPlan.periods : [];
    for (let index = 0; index < Math.max(leftPeriods.length, rightPeriods.length); index += 1) {
      const left = leftPeriods[index], right = rightPeriods[index];
      const leftLabel = left ? left[0].replace(/\s*·\s*추정$/, "") : "";
      const rightLabel = right ? right[0].replace(/\s*·\s*추정$/, "") : "";
      const label = leftLabel || rightLabel || `기간 ${index + 1}`;
      addPair(label, left ? `${left[1]} · ${left[2]}` : "월별 계획 없음", right ? `${right[1]} · ${right[2]}` : "월별 계획 없음");
    }
    addPair("개념 연결", current.bridge, target.bridge);
  }
  function renderComparison() {
    const current = data.getGrade(grade);
    const target = data.getGrade(comparisonGrade);
    $("assessment-entry-link").href = `./assessment-entry.html?grade=${grade}`;
    const table = $("comparison-table");
    document.querySelector(".grade-comparison").classList.toggle("has-comparison", Boolean(target));
    table.hidden = !target;
    if (!target) {
      setText("comparison-note", "현재 학년과 비교할 학년을 고르면 배움의 연결을 보여 드려요.");
      return;
    }
    renderComparisonColumn("current", current);
    renderComparisonColumn("target", target);
    renderMobileComparison(current, target);
    renderComparisonAssessment(current, target);
    setText("comparison-bridge-copy", `${current.grade}학년: ${current.bridge}  /  ${target.grade}학년: ${target.bridge}`);
    const hasInferred = current.source === "inferred" || target.source === "inferred";
    setText("comparison-note", hasInferred
      ? `${current.grade}학년과 ${target.grade}학년 자료를 비교해요. 추정안은 학교 과목 순서를 확인해 주세요.`
      : `${current.grade}학년과 ${target.grade}학년의 학습 주제와 개념 연결을 비교해요.`);
  }
  function renderComparisonAssessment(current, target) {
    const evidence = matchingAssessmentEvidence(current.grade);
    const targetEvidence = matchingAssessmentEvidence(target.grade);
    $("comparison-assessment-link").href = `./assessment-entry.html?grade=${current.grade}`;
    setText("comparison-assessment-link", evidence ? "평가 결과 확인·수정 →" : "평가 기록 입력 →");
    const targetLink = $("comparison-assessment-target-link");
    targetLink.href = `./assessment-entry.html?grade=${target.grade}`;
    targetLink.hidden = Boolean(targetEvidence);
    $("comparison-assessment-heading").textContent = evidence && targetEvidence ? "학년별 평가 기록 경로를 나란히 비교해요" : "선택한 학년의 학습 경로를 비교해요";
    setText("comparison-assessment-current-label", `${current.grade}학년 · ${evidence ? (evidence.source.label || "성적표 입력") : "평가 기록"}`);
    setText("comparison-assessment-current-title", evidence
      ? `${evidence.currentCourse.label} → ${evidence.targetCourse ? evidence.targetCourse.label : evidence.currentCourse.label}`
      : "선택한 과정 경로가 없어요");
    setText("comparison-assessment-current-copy", evidence
      ? `${assessmentDate(evidence)} · 성적표에서 직접 입력한 현재·목표 과정`
      : "현재 학년의 성적표와 과정을 입력하면 선택한 경로를 여기에 보여 드려요.");
    setText("comparison-assessment-target-label", `${target.grade}학년 · ${targetEvidence ? (targetEvidence.source.label || "성적표 입력") : target.source === "inferred" ? "추정 계획 예시" : "계획 예시"}`);
    setText("comparison-assessment-target-title", targetEvidence
      ? `${targetEvidence.currentCourse.label} → ${targetEvidence.targetCourse ? targetEvidence.targetCourse.label : targetEvidence.currentCourse.label}`
      : target.title);
    setText("comparison-assessment-target-copy", targetEvidence
      ? `${assessmentDate(targetEvidence)} · 성적표에서 직접 입력한 현재·목표 과정`
      : target.core);
    const ritComparison = $("rit-comparison-copy");
    const mapEvidence = matchingAssessmentEvidence(current.grade, "map-growth");
    const targetMapEvidence = matchingAssessmentEvidence(target.grade, "map-growth");
    const comparableRit = mapEvidence && targetMapEvidence
      && Number.isFinite(mapEvidence.scores && mapEvidence.scores.rit) && Number.isFinite(targetMapEvidence.scores && targetMapEvidence.scores.rit);
    if (comparableRit) {
      const difference = targetMapEvidence.scores.rit - mapEvidence.scores.rit;
      const roundedDifference = Math.round((difference + Math.sign(difference || 1) * Number.EPSILON) * 10) / 10;
      const differenceText = roundedDifference > 0 ? `+${roundedDifference}` : String(roundedDifference);
      ritComparison.textContent = `Grade ${current.grade} · ${assessmentDate(mapEvidence)} (${seasonLabel(mapEvidence.scores.season)}) RIT ${mapEvidence.scores.rit} → Grade ${target.grade} · ${assessmentDate(targetMapEvidence)} (${seasonLabel(targetMapEvidence.scores.season)}) RIT ${targetMapEvidence.scores.rit} · 입력값 차이 ${differenceText} RIT. 같은 학생의 기록인지 성적표에서 확인한 뒤 참고하세요. 같은 수학 RIT 수직 척도의 산술 비교일 뿐, 이 차이만으로 예상 성장, 동학년 백분위, 해당 학년의 모든 내용 숙달을 판정하지 않아요.`;
      ritComparison.dataset.state = "comparable-scale";
    } else {
      ritComparison.textContent = "두 학년에 모두 MAP Growth 수학 RIT 기록이 있을 때만 같은 RIT 척도의 입력값을 나란히 보여줘요. MAP·학교 Placement·SSAT 등 서로 다른 시험 점수는 섞지 않아요.";
      ritComparison.dataset.state = "needs-matching-map-records";
    }
    const percentileSection = $("map-percentile-comparison");
    const percentileCopy = $("map-percentile-comparison-copy");
    const sameNormReference = comparableRit
      && mapEvidence.scores.percentile != null && targetMapEvidence.scores.percentile != null
      && ["2020", "2025"].includes(mapEvidence.scores.normYear)
      && mapEvidence.scores.normYear === targetMapEvidence.scores.normYear
      && ["fall", "winter", "spring"].includes(mapEvidence.scores.season)
      && mapEvidence.scores.season === targetMapEvidence.scores.season;
    const matchingInstructionWindow = sameNormReference
      && Number.isInteger(mapEvidence.scores.instructionalWeeks)
      && mapEvidence.scores.instructionalWeeks === targetMapEvidence.scores.instructionalWeeks;
    if (matchingInstructionWindow) {
      const pointDifference = targetMapEvidence.scores.percentile - mapEvidence.scores.percentile;
      const pointText = pointDifference > 0 ? `+${pointDifference}` : String(pointDifference);
      percentileCopy.textContent = `Grade ${current.grade} 백분위 ${mapEvidence.scores.percentile} → Grade ${target.grade} 백분위 ${targetMapEvidence.scores.percentile} · 차이 ${pointText} percentile points (${mapEvidence.scores.normYear} norms · ${seasonLabel(mapEvidence.scores.season)}). 같은 학생의 기록인지 확인하세요. 각 학년 규준에서의 상대 위치를 보여 주며, 성장량·수학 내용 숙달·과목 배정을 판정하지 않습니다.`;
      percentileSection.dataset.state = "comparable-grade-norms";
    } else {
      percentileCopy.textContent = "MAP Growth percentile은 규준 연도·Fall/Winter/Spring 시기·시험 전 수업 주차가 두 기록에서 모두 확인되고 같을 때만 비교해요. 확인되지 않으면 숫자를 계산하지 않습니다.";
      percentileSection.dataset.state = "needs-matching-norms";
    }
    renderCompetitionGradeComparison(current, target);
    renderSameSourceScoreComparison(current, target);
  }
  function renderSameSourceScoreComparison(current, target) {
    const section = $("same-source-score-comparison");
    const cards = $("same-source-score-comparison-cards");
    cards.replaceChildren();
    const sources = ["ctp", "ssat", "isee"];
    const pairs = sources.map(function (sourceId) {
      return { current: matchingAssessmentEvidence(current.grade, sourceId), target: matchingAssessmentEvidence(target.grade, sourceId) };
    }).filter(function (pair) { return pair.current && pair.target; });
    pairs.forEach(function (pair) {
      const first = pair.current;
      const second = pair.target;
      const sourceLabel = first.source.label || "평가 출처";
      const group = document.createElement("div");
      group.className = "same-source-score-pair";
      const heading = document.createElement("h5");
      heading.textContent = sourceLabel;
      group.append(heading);
      const columns = document.createElement("div");
      columns.className = "same-source-score-pair-columns";
      [first, second].forEach(function (entry) {
        const article = document.createElement("article");
        const gradeLabel = document.createElement("strong");
        gradeLabel.textContent = `${entry.grade}학년 · ${assessmentDate(entry)}`;
        article.append(gradeLabel);
        const list = document.createElement("dl");
        const levelRow = entry.source.id === "ssat" || entry.source.id === "isee" ? [["시험 레벨", assessmentLevelLabel(entry.scores.testLevel)]] : [];
        const values = entry.source.id === "isee"
          ? levelRow.concat([["Quantitative Reasoning", entry.scores.quantStanine == null ? null : `Stanine ${entry.scores.quantStanine}`], ["Mathematics Achievement", entry.scores.mathStanine == null ? null : `Stanine ${entry.scores.mathStanine}`]])
          : levelRow.concat([[entry.source.id === "ssat" ? "Quantitative 백분위" : "성취 백분위", entry.scores.percentile == null ? null : `백분위 ${entry.scores.percentile}`], ["Scale score", entry.scores.scaleScore == null ? null : String(entry.scores.scaleScore)], ["Stanine", entry.scores.stanine == null ? null : String(entry.scores.stanine)], ["비교 집단", entry.scores.normGroup || null]]);
        values.filter(function (value) { return value[1] != null; }).forEach(function (value) {
          const term = document.createElement("dt"); term.textContent = value[0];
          const description = document.createElement("dd"); description.textContent = value[1];
          list.append(term, description);
        });
        article.append(list);
        columns.append(article);
      });
      group.append(columns);
      cards.append(group);
    });
    section.hidden = pairs.length === 0;
    section.dataset.state = pairs.length ? "same-source-values-only" : "no-matching-records";
  }
  function buildCompetitionRecordCard(record, heading, id) {
    const card = document.createElement("article"); card.className = "competition-record-pair-card";
    const title = document.createElement("h5"); title.id = id;
    const label = document.createElement("span"); label.textContent = heading;
    const date = document.createElement("time"); date.dateTime = record.examDate || ""; date.textContent = record.examDate || "";
    title.append(label, document.createTextNode(" · "), date);
    card.setAttribute("aria-labelledby", title.id);
    const summary = document.createElement("p"); summary.textContent = `정답 ${record.summary.correct} · 오답 ${record.summary.wrong} · 미응답 ${record.summary.blank} · 표시 안 함 ${record.summary.unmarked} · 영역 분류 ${record.summary.domainClassified}/${record.summary.itemCount}`;
    const reasonNames = { concept: "개념", approach: "접근", calculation: "계산", reading: "조건 읽기", time: "시간" };
    const reasonSummary = document.createElement("p"); reasonSummary.className = "competition-record-pair-reasons";
    reasonSummary.textContent = `오답 이유 ${record.summary.reasonClassified}/${record.summary.wrong} 분류${record.reasons.length ? ` · ${record.reasons.map(function (reason) { return `${reasonNames[reason.id] || "기타"} ${reason.count}`; }).join(" · ")}` : " · 미분류"}`;
    const domains = document.createElement("ul");
    record.domains.forEach(function (domain) {
      const item = document.createElement("li");
      const rate = domain.rate === null ? "비율 비교 보류" : `${domain.rate}%`;
      const evidence = domain.attempted ? `${domain.correct}/${domain.attempted} · ${rate} (${domain.evidence})` : "미측정";
      item.textContent = `${domain.name}: ${evidence}${domain.blank ? ` · 미응답 ${domain.blank}` : ""}`;
      domains.append(item);
    });
    card.append(title, summary, reasonSummary, domains);
    return card;
  }
  function renderCompetitionGradeComparison(current, target) {
    const section = $("competition-grade-comparison");
    const copy = $("competition-grade-comparison-copy");
    const cards = $("competition-grade-comparison-cards");
    cards.replaceChildren();
    if (!competition) {
      section.dataset.state = "needs-matching-program-records";
      copy.textContent = "아래 경시 입력에서 같은 대회를 선택하고, 두 학년에서 복습 요약을 저장하면 나란히 볼 수 있어요.";
      return;
    }
    const currentOption = data.competitionOptions(current.grade).find(function (entry) { return entry.id === competition; });
    const targetOption = data.competitionOptions(target.grade).find(function (entry) { return entry.id === competition; });
    if (!currentOption || !targetOption || currentOption.itemCount !== targetOption.itemCount) {
      section.dataset.state = "needs-matching-program-records";
      copy.textContent = `${current.grade}학년과 ${target.grade}학년에서 같은 대회·문항 수의 복습 기록이 있을 때 비교할 수 있어요.`;
      return;
    }
    if (competition === "kangaroo" && currentOption.paperBandId !== targetOption.paperBandId) {
      section.dataset.state = "needs-matching-program-records";
      copy.textContent = `Math Kangaroo ${current.grade}학년과 ${target.grade}학년은 공식 시험지 학년 묶음이 달라 같은 날짜·메모라도 같은 시험지 비교로 보지 않아요. 공식 순위와 백분위도 학년별로 산정돼요.`;
      return;
    }
    function recordsForGrade(grade, itemCount) {
      return (localRecords ? localRecords.storage.loadCompetitionDiagnosticHistory(grade, competition) : [])
        .filter(function (record) {
          return typeof record.examDate === "string"
            && /^\d{4}-\d{2}-\d{2}$/.test(record.examDate)
            && !Number.isNaN(Date.parse(record.examDate + "T00:00:00Z"))
            && record.summary.itemCount === itemCount
            && typeof record.paperLabel === "string"
            && record.paperLabel.trim().length > 0;
        })
        .sort(function (a, b) { return b.examDate.localeCompare(a.examDate) || String(b.savedAt).localeCompare(String(a.savedAt)); });
    }
    const currentRecords = recordsForGrade(current.grade, currentOption.itemCount);
    const targetRecords = recordsForGrade(target.grade, targetOption.itemCount);
    const targetByPaper = new Map(targetRecords.map(function (record) { return [`${record.examDate}\u0000${record.paperLabel.trim()}`, record]; }));
    const matchedPair = currentRecords.map(function (record) {
      return { current: record, target: targetByPaper.get(`${record.examDate}\u0000${record.paperLabel.trim()}`) || null };
    }).find(function (pair) { return pair.target; }) || null;
    if (!matchedPair) {
      const missing = [!currentRecords.length ? `${current.grade}학년` : "", !targetRecords.length ? `${target.grade}학년` : ""].filter(Boolean).join(" · ");
      section.dataset.state = "needs-matching-program-records";
      copy.textContent = missing
        ? `${missing}의 날짜와 문제지 메모가 있는 ${currentOption.title} 복습 요약이 필요해요.`
        : `두 학년에 같은 날짜·문제지 메모로 저장한 ${currentOption.title} 기록이 있어야 나란히 비교해요. 다른 회차는 문제 난도가 다를 수 있어 학년 비교에 쓰지 않아요.`;
      return;
    }
    section.dataset.state = "comparable-format";
    const contestBoundary = competition === "kangaroo" ? " Math Kangaroo 공식 순위와 백분위는 학년별로 산정돼요." : "";
    copy.textContent = `${currentOption.title} · ${matchedPair.current.examDate} · “${matchedPair.current.paperLabel.trim()}” 기록을 비교해요. 날짜와 메모가 같아도 난도를 보정한 등급이나 성장 판정은 아니에요.${contestBoundary}`;
    cards.append(
      buildCompetitionRecordCard(matchedPair.current, `${current.grade}학년 · ${matchedPair.current.paperLabel}`, "competition-grade-current-record-title"),
      buildCompetitionRecordCard(matchedPair.target, `${target.grade}학년 · ${matchedPair.target.paperLabel}`, "competition-grade-target-record-title")
    );
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
    section.querySelector("p").textContent = grade === 7 ? "7.NS.A와 7.RP.A 공개 워크북은 연습용이에요. 개인 진단은 별도 검수 중이에요." : "배운 개념을 문제로 확인해 보세요.";
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
    $("competition-practice-link").hidden = !(grade >= 6 && grade <= 7 && competition === "amc8");
    const source = competitionSources[competition];
    const sourceLink = $("competition-source-link");
    sourceLink.hidden = !source;
    const paperSourceLink = $("competition-paper-source-link");
    paperSourceLink.hidden = competition !== "kangaroo";
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
    const isAmc = ["amc8", "amc10", "amc12"].includes(competition);
    setText("competition-guidance", selected
      ? `선택한 학년의 연습 경로예요. 영역별로 푼 문제 수와 정답 수를 적어 주세요. ${isAmc ? "AMC는 학년 외에도 연령 등 해당 연도 응시 조건이 있으니 MAA 공식 안내를 확인해 주세요." : "응시 자격과 회차별 규정은 대회 주관 기관 안내를 확인해 주세요."} 영역을 모르겠다면 문항별 복습에서 확인할 수 있어요.`
      : "대회를 고르면 영역별 입력칸이 나와요. 목록은 학년별 연습 경로이며 공식 응시 자격 판정이 아닙니다.");
    renderSavedCompetitionDiagnostic();
    if (comparisonGrade !== null) renderComparison();
  }
  function renderSavedCompetitionDiagnostic() {
    const section = $("competition-saved-diagnostic");
    const host = $("competition-saved-domains");
    const records = localRecords && competition ? localRecords.storage.loadCompetitionDiagnosticHistory(grade, competition) : [];
    const evidence = records && records[0];
    section.hidden = !evidence;
    host.replaceChildren();
    const pairSection = $("competition-record-pair");
    const pairCards = $("competition-record-pair-cards");
    pairCards.replaceChildren();
    const datedRecords = (records || []).filter(function (record) { return typeof record.examDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.examDate); });
    pairSection.hidden = datedRecords.length < 2;
    if (datedRecords.length >= 2) datedRecords.slice(0, 2).forEach(function (record, index) {
      pairCards.append(buildCompetitionRecordCard(record, `${index === 0 ? "최근 기록" : "이전 기록"} · ${record.paperLabel || record.programTitle}`, `competition-record-pair-card-title-${index}`));
    });
    if (!evidence) return;
    setText("competition-saved-title", `${evidence.programTitle} · Grade ${evidence.grade}`);
    const date = evidence.examDate ? new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${evidence.examDate}T00:00:00Z`)) : "날짜 미입력";
    setText("competition-saved-meta", `${date}${evidence.paperLabel ? ` · ${evidence.paperLabel}` : ""} · 영역 분류 ${evidence.summary.domainClassified}/${evidence.summary.itemCount}문항`);
    evidence.domains.forEach(function (domain) {
      const item = document.createElement("div"); item.className = "competition-saved-domain";
      const title = document.createElement("strong"); title.textContent = domain.name;
      const value = document.createElement("span"); value.textContent = domain.attempted ? `${domain.correct}/${domain.attempted}${domain.rate === null ? "" : ` · ${domain.rate}%`}` : "—";
      const detail = document.createElement("small"); detail.textContent = `${domain.evidence}${domain.blank ? ` · 미응답 ${domain.blank}` : ""}`;
      item.append(title, value, detail); host.append(item);
    });
    const reasons = evidence.reasons.map(function (reason) {
      const names = { concept: "개념", approach: "접근 아이디어", calculation: "계산", reading: "조건 읽기", time: "시간" };
      return `${names[reason.id]} ${reason.count}문항`;
    });
    setText("competition-saved-reasons", `오류 이유 분류 ${evidence.summary.reasonClassified}/${evidence.summary.wrong}개 오답${reasons.length ? ` · ${reasons.join(" · ")}` : ""}`);
    renderCompetitionReviewGuidance(evidence);
    $("competition-saved-remove").dataset.recordId = evidence.id;
  }
  function renderCompetitionReviewGuidance(evidence) {
    const section = $("competition-review-guidance");
    const list = $("competition-review-guidance-list");
    list.replaceChildren();
    const suggestions = [];
    const supportedDomains = evidence.domains.filter(function (domain) { return domain.attempted >= 3 && Number.isFinite(domain.rate); });
    if (supportedDomains.length >= 2) {
      const rates = supportedDomains.map(function (domain) { return domain.rate; });
      const lowest = Math.min.apply(null, rates);
      const highest = Math.max.apply(null, rates);
      if (lowest < highest) {
        const lowestDomains = supportedDomains.filter(function (domain) { return domain.rate === lowest; });
        const details = lowestDomains.map(function (domain) { return `${domain.name} ${domain.correct}/${domain.attempted}`; }).join(" · ");
        const names = lowestDomains.map(function (domain) { return domain.name; }).join("·");
        suggestions.push(`직접 분류한 영역 중 ${names}의 정답 비율이 비교 가능한 영역에서 낮았어요 (${details}). 그 영역에서 틀린 문제를 다시 풀고 풀이 이유를 말해 보세요.`);
      }
    }
    const reasonActions = {
      concept: "개념으로 표시한 오답은 정의와 성질을 말로 확인한 뒤, 수를 바꾼 새 문제에 적용해 보세요.",
      approach: "접근 아이디어로 표시한 오답은 조건을 그림·표·식으로 바꾸고, 다른 풀이 한 가지와 비교해 보세요.",
      calculation: "계산으로 표시한 오답은 중간식을 남기고 어림이나 역산으로 답을 확인해 보세요.",
      reading: "조건 읽기로 표시한 오답은 주어진 값·단위·질문을 표시한 다음 식을 세워 보세요.",
      time: "시간으로 표시한 오답은 막힌 문항을 표시하고, 먼저 풀 문제와 다시 돌아올 문제를 나누어 연습해 보세요."
    };
    (evidence.reasons || []).slice().sort(function (a, b) { return b.count - a.count; }).slice(0, 2).forEach(function (reason) {
      if (reasonActions[reason.id]) suggestions.push(`${reason.count}개 · ${reasonActions[reason.id]}`);
    });
    const unclassifiedWrong = Math.max(0, evidence.summary.wrong - evidence.summary.reasonClassified);
    if (unclassifiedWrong) suggestions.push(`오답 ${unclassifiedWrong}개는 이유가 아직 분류되지 않았어요. 다시 풀고 개념·접근·계산·조건 읽기 중 막힌 지점을 기록해 보세요.`);
    if (evidence.summary.blank) suggestions.push(`미응답 ${evidence.summary.blank}개는 해설을 보기 전에 문제에서 아는 조건과 첫 풀이 단계를 적어 보세요.`);
    if (evidence.summary.unmarked) suggestions.push(`표시하지 않은 ${evidence.summary.unmarked}문항은 이 요약과 비교에 포함되지 않아요.`);
    if (!suggestions.length) suggestions.push("이 기록에는 오답이나 미응답이 표시되지 않았어요. 맞힌 문제에서 풀이를 고른 이유를 설명하고 다른 방법도 찾아보세요.");
    suggestions.slice(0, 4).forEach(function (suggestion) {
      const item = document.createElement("li"); item.textContent = suggestion; list.append(item);
    });
    section.hidden = false;
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
    data.competitionDomains(competition).forEach(function (entry) {
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
    const domains = data.competitionDomains(competition);
    const rows = domains.map(function (strand) {
      return { attempted: $(`domain-rows`).querySelector(`[data-strand="${strand.id}"][data-field="attempted"]`).value,
        correct: $(`domain-rows`).querySelector(`[data-strand="${strand.id}"][data-field="correct"]`).value };
    });
    const result = data.analyzeCompetition(rows, option.itemCount, competition);
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
    const planHref = grade === 7 ? "./learning-plan.html?goal=school-g7-nsa" : "./learning-plan.html";
    $("boarding-learning-plan-link").href = planHref;
    $("boarding-learning-plan-link").textContent = grade === 7 ? "7학년 학습 계획" : "학습 계획";
    $("boarding-learning-plan-link-bottom").href = planHref;
    $("boarding-learning-plan-link-bottom").textContent = grade === 7 ? "7학년 학습 계획 보기 →" : "학습 계획 보기 →";
    setText("grade-map-title", `${grade}학년 수학 한눈에`);
    setText("grade-label", `${grade}학년`);
    setText("grade-title", entry.title);
    setText("grade-core", entry.core);
    setText("grade-bridge", entry.bridge);
    setText("source-chip", entry.source === "inferred" ? `${grade}학년 · 추정안` : "학습 예시");
    setText("grade-note", grade === 7
      ? "7.NS.A·7.RP.A 워크북은 연습용으로 열 수 있어요. 개인 진단은 별도 검수 중이에요."
      : grade === 9 && entry.source === "inferred"
        ? "Grade 9는 제공된 7·8·10학년 자료로 추정했어요. 학교 과목 순서는 선생님과 확인해 주세요."
        : entry.source === "inferred"
          ? `${grade}학년은 제공된 학년별 자료가 없어 공통 수학 범주를 바탕으로 만든 추정안이에요. 학교 과목 순서는 실제 안내와 함께 확인해 주세요.`
        : "아직 진단 결과가 없어요. 실제 풀이를 보고 다음 단계를 정해요.");
    $("previous-grade").disabled = grade === data.grades[0].grade;
    $("next-grade").disabled = grade === data.grades[data.grades.length - 1].grade;
    renderGradeButtons();
    renderComparisonOptions();
    renderComparison();
    renderAnnualPlan(entry);
    renderStages(entry);
    renderAssessmentEvidence();
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
  $("journey-next-button").addEventListener("click", function () {
    const entry = data.getGrade(grade);
    if (!entry || stage === null || stage >= entry.steps.length - 1) return;
    stage += 1;
    renderStages(entry);
    const selected = $("stage-list").children[stage];
    if (selected) selected.querySelector("button").focus();
    revealGrade7Detail();
  });
  window.addEventListener("popstate", function () {
    const params = new URLSearchParams(location.search);
    const next = Number(params.get("grade"));
    const nextCompetition = params.get("program") || "";
    if (next === grade && nextCompetition === competition) return;
    grade = data.getGrade(next) ? next : 7;
    stage = grade === 7 ? null : 0;
    route = null;
    competition = nextCompetition;
    $("grade7-branches").querySelector("details").open = false;
    render(null);
  });
  $("competition-select").addEventListener("change", function (event) {
    competition = event.target.value;
    $("paper-label").value = "";
    updateUrl("replace");
    updateCompetitionFields();
    resetCompetitionReport();
    renderCompetitionRows();
  });
  $("competition-form").addEventListener("submit", analyzeCompetition);
  $("competition-saved-remove").addEventListener("click", function (event) {
    const id = event.currentTarget.dataset.recordId;
    if (!id || !localRecords || !window.confirm("이 기기에 저장된 이 경시 진단 요약을 지울까요?")) return;
    localRecords.storage.removeCompetitionDiagnostic(id);
    renderSavedCompetitionDiagnostic();
  });
  $("comparison-grade").addEventListener("change", function (event) {
    comparisonGrade = event.target.value ? Number(event.target.value) : null;
    renderComparison();
  });
  render("replace");
  renderConceptFlows();
  setupRoadmapShortcuts();
})();
