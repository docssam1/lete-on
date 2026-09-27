(function () {
  "use strict";
  const engine = window.GFIELDExternalMathEvidenceEngine;
  const records = window.GFIELDLocalLearningRecord;
  if (!engine || !records) throw new Error("assessment entry dependencies did not load");

  const form = document.getElementById("evidence-form");
  const sourceSelect = document.getElementById("source-id");
  const currentCourse = document.getElementById("current-course");
  const targetCourse = document.getElementById("target-course");
  const sourceHelp = {
    "school-placement": "학교가 직접 실시한 과정 배정 시험입니다. 정답률과 학교가 안내한 컷을 입력할 수 있습니다.",
    "map-growth": "RIT는 성장 척도이고 percentile은 같은 학년 비교 위치입니다. 서로 바꾸어 입력하지 않습니다.",
    ctp: "Scale score, percentile, stanine과 비교 집단을 구분합니다. percentile은 정답률이 아닙니다.",
    ssat: "입학용 Quantitative 결과입니다. 수학 과정 배정에는 보조 근거로만 사용합니다.",
    isee: "Quantitative Reasoning과 Mathematics Achievement stanine을 각각 입력합니다."
  };
  const errorCopy = {
    SOURCE_INVALID: "평가 종류를 다시 선택하세요.", TEST_DATE_INVALID: "시험일을 확인하세요.", GRADE_INVALID: "응시 학년을 확인하세요.",
    CURRENT_COURSE_INVALID: "현재 과정을 확인하세요.", TARGET_COURSE_INVALID: "목표 과정을 확인하세요.", TARGET_COURSE_BEFORE_CURRENT: "목표 과정은 현재 과정과 같거나 이후 과정이어야 합니다.",
    OVERALL_PERCENT_REQUIRED: "전체 정답률을 입력하세요.", OVERALL_PERCENT_INVALID: "전체 정답률은 0~100 사이로 입력하세요.", SCHOOL_CUT_INVALID: "학교 컷은 0~100 사이로 입력하세요.",
    RIT_REQUIRED: "Math RIT를 입력하세요.", RIT_INVALID: "Math RIT 값을 확인하세요.", PERCENTILE_REQUIRED: "성취 백분위를 입력하세요.", PERCENTILE_INVALID: "백분위는 1~99 사이로 입력하세요.",
    QUANT_STANINE_REQUIRED: "Quantitative Reasoning stanine을 입력하세요.", QUANT_STANINE_INVALID: "Stanine은 1~9 사이입니다.", MATH_STANINE_REQUIRED: "Mathematics Achievement stanine을 입력하세요.", MATH_STANINE_INVALID: "Stanine은 1~9 사이입니다."
  };
  const bandCopy = { "foundation-evidence": "선수개념 보완", "developing-evidence": "현재 과정 보완", "on-track-evidence": "현재 과정 적정", "advanced-evidence": "심화 준비 근거" };
  const confidenceCopy = { "high-for-gmap-plan": "높음 · 입력 근거 충분", "medium-for-gmap-plan": "중간 · 영역 근거 포함", "low-for-gmap-plan": "낮음 · 추가 진단 필요" };
  const placementCopy = {
    "entered-cut-met-school-review-required": "입력한 컷 충족 · 학교 확인 필요", "entered-cut-not-met": "입력한 컷 미충족", "school-policy-required": "학교 정책 확인 필요", "admission-evidence-only": "입학 준비 보조 근거"
  };

  function today() { const value = new Date(); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); }
  function value(id) { return document.getElementById(id).value; }
  function numberOrNull(id) { const raw = value(id); return raw === "" ? null : Number(raw); }
  function populateCourses() {
    engine.COURSES.forEach(function (course, index) {
      [currentCourse, targetCourse].forEach(function (select) { const option = document.createElement("option"); option.value = course.id; option.textContent = `${course.label} · ${course.stage}`; select.append(option); });
      if (course.id === "pre-algebra") currentCourse.selectedIndex = index;
      if (course.id === "algebra-1") targetCourse.selectedIndex = index;
    });
  }
  function updateTargetOptions() {
    const currentIndex = engine.COURSES.findIndex(function (course) { return course.id === currentCourse.value; });
    Array.from(targetCourse.options).forEach(function (option, index) { option.disabled = index < currentIndex; });
    if (targetCourse.selectedIndex < currentIndex) targetCourse.selectedIndex = currentIndex;
  }
  function updateSourceFields() {
    const sourceId = sourceSelect.value;
    document.getElementById("source-help").textContent = sourceHelp[sourceId];
    document.querySelectorAll(".source-field").forEach(function (field) {
      const visible = field.dataset.sources.split(" ").includes(sourceId);
      field.hidden = !visible;
      field.querySelectorAll("input,select").forEach(function (control) { control.disabled = !visible; control.required = false; });
    });
    const requiredIds = sourceId === "school-placement" ? ["overall-percent"] : sourceId === "map-growth" ? ["rit", "percentile"] : sourceId === "ctp" || sourceId === "ssat" ? ["percentile"] : ["quant-stanine", "math-stanine"];
    requiredIds.forEach(function (id) { document.getElementById(id).required = true; });
    document.getElementById("percentile-label").textContent = sourceId === "ssat" ? "Quantitative 백분위" : "성취 백분위";
    document.getElementById("scale-score-label").textContent = sourceId === "ssat" ? "Quantitative scale score" : "Scale score";
  }
  function domains() {
    return Array.from(document.querySelectorAll("[data-domain]")).filter(function (input) { return input.value !== ""; }).map(function (input) { return { id: input.dataset.domain, percent: Number(input.value) }; });
  }
  function inputRecord() {
    return {
      sourceId: sourceSelect.value, testDate: value("test-date"), grade: Number(value("grade")), currentCourseId: currentCourse.value, targetCourseId: targetCourse.value,
      overallPercent: numberOrNull("overall-percent"), schoolCut: numberOrNull("school-cut"), rit: numberOrNull("rit"), percentile: numberOrNull("percentile"), scaleScore: numberOrNull("scale-score"), stanine: numberOrNull("stanine"), quantStanine: numberOrNull("quant-stanine"), mathStanine: numberOrNull("math-stanine"), normGroup: value("norm-group"), season: value("season"), domains: domains()
    };
  }
  function metricText(result) {
    if (result.source.id === "school-placement") return `${result.scores.metric}%`;
    if (result.source.id === "map-growth") return `RIT ${result.scores.rit} · ${result.scores.percentile}th percentile`;
    if (result.source.id === "isee") return `평균 ${result.scores.stanine} stanine`;
    return `${result.scores.percentile}th percentile${result.scores.scaleScore == null ? "" : ` · ${result.scores.scaleScore}`}`;
  }
  function recommendationReason(result) {
    if (result.targetCandidate) return `입력한 학교 컷과 영역별 선수개념 기준을 모두 충족해 ${result.targetCourse.label} 준비 후보로 제안합니다. 학교의 최종 확인이 필요합니다.`;
    if (result.source.role === "admission-support") return `${result.source.label}는 입학 준비 근거로 반영했습니다. 과정 배정은 현재 과정과 영역별 학습 근거를 유지해 제안합니다.`;
    if (result.priorityDomains.length) return `${result.priorityDomains.map(function (row) { return row.label; }).join(" · ")} 보완을 먼저 배정한 뒤 목표 과정으로 연결합니다.`;
    return "영역별 점수가 없어 전체 결과를 중심으로 시작 과정을 제안했습니다. G·MAP 진단을 더하면 단원 배정이 정밀해집니다.";
  }
  function render(result) {
    document.getElementById("result-empty").hidden = true;
    document.getElementById("result-content").hidden = false;
    document.getElementById("result-state").textContent = bandCopy[result.band];
    document.getElementById("result-source").textContent = `${result.source.label} · Grade ${result.grade}`;
    document.getElementById("recommended-course").textContent = result.recommendedStart.label;
    document.getElementById("recommendation-reason").textContent = recommendationReason(result);
    document.getElementById("metric-label").textContent = result.scores.metricLabel;
    document.getElementById("metric-value").textContent = metricText(result);
    document.getElementById("confidence-value").textContent = confidenceCopy[result.confidence];
    document.getElementById("placement-value").textContent = placementCopy[result.placementState];
    const route = document.getElementById("course-route"); route.replaceChildren();
    result.route.forEach(function (course, index) { const chip = document.createElement("span"); chip.innerHTML = `<b>${index + 1}. ${course.label}</b><small>${course.publicLearning ? "검증 자료 연결" : "경로 공개 · 자료 검수 대기"}</small>`; route.append(chip); });
    const priorities = document.getElementById("priority-list"); priorities.replaceChildren();
    if (!result.priorityDomains.length) { const empty = document.createElement("p"); empty.className = "priority-empty"; empty.textContent = "영역별 점수를 입력하면 우선 약점 1~2개와 연결 워크북을 자동으로 고릅니다."; priorities.append(empty); }
    result.priorityDomains.forEach(function (domain, index) { const row = document.createElement("div"); row.className = "priority-row"; row.innerHTML = `<div><strong>${index + 1}. ${domain.label}</strong><small>${domain.clusterId} 개념·워크북 연결</small></div><span>${domain.percent}%</span>`; priorities.append(row); });
    document.getElementById("plan-weeks").textContent = `${result.plan.weeks}주`;
    document.getElementById("plan-days").textContent = `주 ${result.plan.studyDaysPerWeek}일`;
    document.getElementById("plan-daily").textContent = `${result.plan.minutesPerDay}분`;
    document.getElementById("plan-problems").textContent = `${result.plan.problemCountPerDay}문항 내외`;
    document.getElementById("decision-notice").textContent = result.decisionNotice;
    const material = document.getElementById("open-material");
    if (result.materialState === "verified-grade6-public-materials") { material.href = `./unit-workbook.html?cluster=${encodeURIComponent(result.primaryPriority.clusterId)}&mode=workbook&audience=student&locale=ko&paper=A4`; material.textContent = `${result.primaryPriority.label} 워크북 보기`; material.removeAttribute("aria-disabled"); }
    else { material.href = "#"; material.textContent = "이 과정 자료는 검수 대기"; material.setAttribute("aria-disabled", "true"); }
    const publishedResource = document.getElementById("published-resource");
    if (result.grade === 7) {
      publishedResource.hidden = false;
      publishedResource.href = "./catalog.html?role=student&grade=7";
      publishedResource.textContent = "Grade 7 공개 자료 살펴보기";
    } else publishedResource.hidden = true;
    const sendToPlan = document.getElementById("send-to-plan");
    if (result.materialState === "verified-grade6-public-materials") {
      sendToPlan.href = "./learning-plan.html?goal=school-g6&fromAssessment=external";
      sendToPlan.textContent = "이 진도로 학습 계획 만들기";
      sendToPlan.removeAttribute("aria-disabled");
    } else {
      sendToPlan.href = "#";
      sendToPlan.textContent = "이 학년 자동 계획은 검수 대기";
      sendToPlan.setAttribute("aria-disabled", "true");
    }
    document.getElementById("result-content").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault(); document.getElementById("form-error").textContent = "";
    try { const result = engine.analyze(inputRecord()); records.storage.saveAssessmentEvidence(result); render(result); }
    catch (error) { document.getElementById("form-error").textContent = errorCopy[error.message] || "입력값을 다시 확인하세요."; }
  });
  sourceSelect.addEventListener("change", updateSourceFields);
  currentCourse.addEventListener("change", updateTargetOptions);
  populateCourses(); updateTargetOptions(); updateSourceFields(); document.getElementById("test-date").value = today();
  const requestedGrade = Number(new URLSearchParams(window.location.search).get("grade"));
  if (Number.isInteger(requestedGrade) && requestedGrade >= 3 && requestedGrade <= 12) document.getElementById("grade").value = String(requestedGrade);
  const saved = records.storage.loadAssessmentEvidence(); if (saved) render(saved);
})();
