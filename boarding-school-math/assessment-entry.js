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
    if (result.source.id === "isee") return `Quantitative Reasoning ${value("quant-stanine")} · Mathematics Achievement ${value("math-stanine")} stanine`;
    return `${result.scores.percentile}th percentile${result.scores.scaleScore == null ? "" : ` · ${result.scores.scaleScore}`}`;
  }
  function recommendationReason(result) {
    const courseCopy = `${result.currentCourse.label}에서 ${result.targetCourse.label}까지의 경로는 입력한 과정을 기준으로 표시합니다.`;
    if (result.targetCandidate) return `${courseCopy} 성적표 점수가 사용자가 입력한 학교 컷을 충족했습니다. 이 화면은 컷 충족만 표시하며 G·MAP 준비도나 배정을 판정하지 않습니다. 공식 배정은 학교가 확인해야 합니다.`;
    if (result.source.role === "admission-support") return `${courseCopy} ${result.source.label} 점수는 입학 준비 자료로만 기록합니다. 과정 배정을 자동으로 정하지 않습니다.`;
    return `${courseCopy} 점수 구간·준비도·학습 처방은 이 결과만으로 계산하지 않습니다.`;
  }
  function render(result) {
    document.getElementById("result-empty").hidden = true;
    document.getElementById("result-content").hidden = false;
    document.getElementById("result-state").textContent = "입력 근거 요약";
    document.getElementById("result-source").textContent = `${result.source.label} · Grade ${result.grade}`;
    document.getElementById("recommended-course").textContent = result.currentCourse.label;
    document.getElementById("recommendation-reason").textContent = recommendationReason(result);
    document.getElementById("metric-label").textContent = result.scores.metricLabel;
    document.getElementById("metric-value").textContent = metricText(result);
    document.getElementById("confidence-value").textContent = result.scores.normGroup || (result.scores.season ? `${result.scores.season} · 성적표 표기 기준` : "성적표 표기 기준");
    document.getElementById("placement-value").textContent = placementCopy[result.placementState];
    const route = document.getElementById("course-route"); route.replaceChildren();
    result.route.forEach(function (course, index) { const chip = document.createElement("span"); chip.innerHTML = `<b>${index + 1}. ${course.label}</b><small>${course.publicLearning ? "검증 자료 연결" : "경로 공개 · 자료 검수 대기"}</small>`; route.append(chip); });
    const priorities = document.getElementById("priority-list"); priorities.replaceChildren();
    if (!result.domainComparisons.length) { const empty = document.createElement("p"); empty.className = "priority-empty"; empty.textContent = "입력한 영역별 점수가 없습니다. 단일 점수만으로 세부 강점·보완 영역을 추정하지 않습니다."; priorities.append(empty); }
    result.domainComparisons.forEach(function (domain, index) { const row = document.createElement("div"); row.className = "priority-row"; row.innerHTML = `<div><strong>${index + 1}. ${domain.label}</strong><small>${domain.clusterId} · 성적표 입력값</small></div><span>${domain.percent}%</span>`; priorities.append(row); });
    document.getElementById("decision-notice").textContent = result.decisionNotice;
    const material = document.getElementById("open-material");
    if (result.materialState === "verified-grade6-public-materials" && result.domainComparisons.length) { const first = result.domainComparisons[0]; material.href = `./unit-workbook.html?cluster=${encodeURIComponent(first.clusterId)}&mode=workbook&audience=student&locale=ko&paper=A4`; material.textContent = `입력값이 가장 낮은 ${first.label} 연습 자료`; material.removeAttribute("aria-disabled"); }
    else { material.href = "#"; material.textContent = result.materialState === "verified-grade6-public-materials" ? "영역 값을 입력하면 관련 연습 자료를 보여 줍니다" : "이 과정 자료는 검수 대기"; material.setAttribute("aria-disabled", "true"); }
    const publishedResource = document.getElementById("published-resource");
    if (result.grade === 7) {
      publishedResource.hidden = false;
      publishedResource.href = "./catalog.html?role=student&grade=7";
      publishedResource.textContent = "Grade 7 공개 자료 살펴보기";
    } else publishedResource.hidden = true;
    const sendToPlan = document.getElementById("send-to-plan");
    if (result.materialState === "verified-grade6-public-materials") {
      sendToPlan.href = "./learning-plan.html?goal=school-g6&fromAssessment=external";
      sendToPlan.textContent = "학습 계획에서 시간·영역 정하기";
      sendToPlan.removeAttribute("aria-disabled");
    } else {
      sendToPlan.href = "#";
      sendToPlan.textContent = "이 과정의 학습자료·계획 연결은 검수 대기";
      sendToPlan.setAttribute("aria-disabled", "true");
    }
    document.getElementById("result-content").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function restoreLegacyInputs(saved) {
    sourceSelect.value = saved.source.id;
    updateSourceFields();
    if (saved.grade) document.getElementById("grade").value = String(saved.grade);
    if (saved.testDate) document.getElementById("test-date").value = saved.testDate;
    if (saved.source.id === "school-placement") {
      if (saved.scores.metric != null) document.getElementById("overall-percent").value = String(saved.scores.metric);
      if (saved.scores.schoolCut != null) document.getElementById("school-cut").value = String(saved.scores.schoolCut);
    } else if (saved.source.id === "map-growth") {
      if (saved.scores.rit != null) document.getElementById("rit").value = String(saved.scores.rit);
      if (saved.scores.percentile != null) document.getElementById("percentile").value = String(saved.scores.percentile);
    } else if (saved.source.id === "ctp" || saved.source.id === "ssat") {
      if (saved.scores.percentile != null) document.getElementById("percentile").value = String(saved.scores.percentile);
      if (saved.scores.scaleScore != null) document.getElementById("scale-score").value = String(saved.scores.scaleScore);
      if (saved.source.id === "ctp" && saved.scores.stanine != null) document.getElementById("stanine").value = String(saved.scores.stanine);
    }
    const note = document.getElementById("legacy-evidence-note");
    note.textContent = saved.needsIseeStanines
      ? "이전 기록을 불러왔어요. ISEE 두 영역 점수는 예전 저장 방식에서 평균 하나로 합쳐져 있어 복원하지 않았습니다. 성적표에서 Quantitative Reasoning과 Mathematics Achievement Stanine을 각각 다시 입력한 뒤, 현재·목표 과정과 비교 기준을 확인해 주세요."
      : "이전 성적표 점수를 입력칸에 복원했어요. 시험 시기·규준집단, 현재·목표 과정, 영역 점수는 저장되지 않았으니 성적표를 보고 확인·보완한 뒤 비교 결과를 다시 만들어 주세요. 예전 준비도·약점 판정은 복원하지 않았습니다.";
    note.hidden = false;
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
  const saved = records.storage.loadAssessmentEvidence();
  if (saved && saved.legacyEvidence) restoreLegacyInputs(saved);
  else if (saved && saved.schemaVersion === engine.SCHEMA_VERSION) render(saved);
})();
