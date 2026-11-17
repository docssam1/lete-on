(function () {
  "use strict";
  const engine = window.GFIELDExternalMathEvidenceEngine;
  const records = window.GFIELDLocalLearningRecord;
  if (!engine || !records) throw new Error("assessment entry dependencies did not load");

  const form = document.getElementById("evidence-form");
  const sourceSelect = document.getElementById("source-id");
  const currentCourse = document.getElementById("current-course");
  const targetCourse = document.getElementById("target-course");
  const testLevelOptions = {
    ssat: [["ssat-elementary-3", "SSAT Elementary · Grade 3"], ["ssat-elementary-4", "SSAT Elementary · Grade 4"], ["ssat-middle", "SSAT Middle"], ["ssat-upper", "SSAT Upper"]],
    isee: [["isee-primary-2", "ISEE Primary 2"], ["isee-primary-3", "ISEE Primary 3"], ["isee-primary-4", "ISEE Primary 4"], ["isee-lower", "ISEE Lower"], ["isee-middle", "ISEE Middle"], ["isee-upper", "ISEE Upper"]]
  };
  const sourceHelp = {
    "school-placement": "학교가 직접 실시한 과정 배정 시험입니다. 정답률과 학교가 안내한 컷을 입력할 수 있습니다.",
    "map-growth": "RIT는 성장 척도이고 percentile은 같은 학년 비교 위치입니다. 서로 바꾸어 입력하지 않습니다.",
    ctp: "Scale score, percentile, stanine과 비교 집단을 구분합니다. percentile은 정답률이 아닙니다.",
    ssat: "입학용 Quantitative 결과입니다. 성적표의 시험 레벨을 함께 기록하며, 수학 과정 배정에는 보조 근거로만 사용합니다.",
    isee: "Quantitative Reasoning과 Mathematics Achievement stanine을 각각 입력하고, 성적표의 시험 레벨을 함께 기록합니다."
  };
  const errorCopy = {
    SOURCE_INVALID: "평가 종류를 다시 선택하세요.", TEST_DATE_INVALID: "시험일을 확인하세요.", GRADE_INVALID: "응시 학년을 확인하세요.",
    CURRENT_COURSE_INVALID: "현재 과정을 확인하세요.", TARGET_COURSE_INVALID: "목표 과정을 확인하세요.",
    OVERALL_PERCENT_REQUIRED: "전체 정답률을 입력하세요.", OVERALL_PERCENT_INVALID: "전체 정답률은 0~100 사이로 입력하세요.", SCHOOL_CUT_INVALID: "학교 컷은 0~100 사이로 입력하세요.",
    RIT_REQUIRED: "Math RIT를 입력하세요.", RIT_INVALID: "Math RIT 값을 확인하세요.", PERCENTILE_REQUIRED: "성취 백분위를 입력하세요.", PERCENTILE_INVALID: "백분위는 1~99 사이로 입력하세요.",
    QUANT_STANINE_REQUIRED: "Quantitative Reasoning stanine을 입력하세요.", QUANT_STANINE_INVALID: "Stanine은 1~9 사이입니다.", MATH_STANINE_REQUIRED: "Mathematics Achievement stanine을 입력하세요.", MATH_STANINE_INVALID: "Stanine은 1~9 사이입니다."
  };
  const placementCopy = {
    "entered-cut-met-school-review-required": "입력한 컷 충족 · 학교 확인 필요", "entered-cut-not-met": "입력한 컷 미충족", "school-policy-required": "학교 정책 확인 필요", "admission-evidence-only": "입학 준비 보조 근거"
  };
  let resultAnnouncementVersion = 0;
  let formAlertVersion = 0;
  function announceFormError(message) {
    const region = document.getElementById("form-error");
    const version = ++formAlertVersion;
    region.textContent = "";
    window.requestAnimationFrame(function () { if (version === formAlertVersion) region.textContent = message; });
  }
  function announceResult(result, restored, historyMessage) {
    const region = document.getElementById("result-announcement");
    const message = (restored ? "저장한 평가 결과를 불러왔어요." : "비교 결과를 계산했어요.") + " " + result.source.label + " · Grade " + result.grade + "." + (historyMessage ? " " + historyMessage : "");
    const version = ++resultAnnouncementVersion;
    region.textContent = "";
    window.requestAnimationFrame(function () {
      if (version === resultAnnouncementVersion) region.textContent = message;
    });
  }

  function today() { const value = new Date(); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); }
  function value(id) { return document.getElementById(id).value; }
  function numberOrNull(id) { const raw = value(id); return raw === "" ? null : Number(raw); }
  function populateCourses() {
    engine.COURSES.forEach(function (course) {
      [currentCourse, targetCourse].forEach(function (select) { const option = document.createElement("option"); option.value = course.id; option.textContent = `${course.label} · ${course.stage}`; select.append(option); });
      if (course.id === "pre-algebra") currentCourse.value = course.id;
      if (course.id === "algebra-1") targetCourse.value = course.id;
    });
  }
  function updateSourceFields() {
    const sourceId = sourceSelect.value;
    const levelSelect = document.getElementById("test-level");
    levelSelect.replaceChildren(new Option("성적표에서 선택", ""));
    (testLevelOptions[sourceId] || []).forEach(function (option) { levelSelect.add(new Option(option[1], option[0])); });
    document.getElementById("source-help").textContent = sourceHelp[sourceId];
    document.querySelectorAll(".source-field").forEach(function (field) {
      const visible = field.dataset.sources.split(" ").includes(sourceId);
      field.hidden = !visible;
      field.querySelectorAll("input,select").forEach(function (control) { control.disabled = !visible; control.required = false; });
    });
    const requiredIds = sourceId === "school-placement" ? ["overall-percent"] : sourceId === "map-growth" ? ["rit", "percentile"] : sourceId === "ctp" || sourceId === "ssat" ? ["percentile"] : ["quant-stanine", "math-stanine"];
    requiredIds.forEach(function (id) { document.getElementById(id).required = true; });
    document.getElementById("test-level").required = sourceId === "ssat" || sourceId === "isee";
    document.getElementById("percentile-label").textContent = sourceId === "ssat" ? "Quantitative 백분위" : "성취 백분위";
    document.getElementById("scale-score-label").textContent = sourceId === "ssat" ? "Quantitative scale score" : "Scale score";
  }
  function domains() {
    return Array.from(document.querySelectorAll("[data-domain]")).filter(function (input) { return input.value !== ""; }).map(function (input) { return { id: input.dataset.domain, percent: Number(input.value) }; });
  }
  function inputRecord() {
    return {
      sourceId: sourceSelect.value, testDate: value("test-date"), grade: Number(value("grade")), currentCourseId: currentCourse.value, targetCourseId: targetCourse.value,
      overallPercent: numberOrNull("overall-percent"), schoolCut: numberOrNull("school-cut"), rit: numberOrNull("rit"), percentile: numberOrNull("percentile"), scaleScore: numberOrNull("scale-score"), stanine: numberOrNull("stanine"), quantStanine: numberOrNull("quant-stanine"), mathStanine: numberOrNull("math-stanine"), normGroup: value("norm-group"), testLevel: value("test-level"), season: value("season"), normYear: value("norm-year"), instructionalWeeks: numberOrNull("instructional-weeks"), domains: domains()
    };
  }
  function metricText(result) {
    if (result.source.id === "school-placement") return `${result.scores.metric}%`;
    if (result.source.id === "map-growth") return `RIT ${result.scores.rit} · ${result.scores.percentile}th percentile`;
    if (result.source.id === "isee") return `Quantitative Reasoning ${result.scores.quantStanine ?? "—"} · Mathematics Achievement ${result.scores.mathStanine ?? "—"} stanine`;
    return `${result.scores.percentile}th percentile${result.scores.scaleScore == null ? "" : ` · ${result.scores.scaleScore}`}`;
  }
  function testLevelText(level) {
    return ({ "ssat-elementary-3": "SSAT Elementary · Grade 3", "ssat-elementary-4": "SSAT Elementary · Grade 4", "ssat-middle": "SSAT Middle", "ssat-upper": "SSAT Upper", "isee-primary-2": "ISEE Primary 2", "isee-primary-3": "ISEE Primary 3", "isee-primary-4": "ISEE Primary 4", "isee-lower": "ISEE Lower", "isee-middle": "ISEE Middle", "isee-upper": "ISEE Upper" })[level] || "시험 레벨 미기재";
  }
  function seasonLabel(season) { return ({ fall: "Fall", winter: "Winter", spring: "Spring", summer: "Summer" })[season] || season; }
  function referenceText(result) {
    const scores = result.scores || {};
    if (result.source.id === "map-growth") return [scores.normYear ? `${scores.normYear} norms` : null, scores.season ? seasonLabel(scores.season) : null, Number.isInteger(scores.instructionalWeeks) ? `${scores.instructionalWeeks} instructional weeks` : null].filter(Boolean).join(" · ") || "성적표 규준 정보 미기재";
    if (result.source.id === "ssat" || result.source.id === "isee") return `${testLevelText(scores.testLevel)} · 입학 평가 보조 근거`;
    return scores.normGroup || (scores.season ? `${seasonLabel(scores.season)} · 성적표 표기 기준` : "성적표 표기 기준");
  }
  function recommendationReason(result) {
    const courseCopy = `${result.currentCourse.label}에서 ${result.targetCourse.label}까지의 경로는 입력한 과정을 기준으로 표시합니다.`;
    if (result.targetCandidate) return `${courseCopy} 성적표 점수가 사용자가 입력한 학교 컷을 충족했습니다. 이 화면은 컷 충족만 표시하며 G·MAP 준비도나 배정을 판정하지 않습니다. 공식 배정은 학교가 확인해야 합니다.`;
    if (result.source.role === "admission-support") return `${courseCopy} ${result.source.label} 점수는 입학 준비 자료로만 기록합니다. 과정 배정을 자동으로 정하지 않습니다.`;
    return `${courseCopy} 점수 구간·준비도·학습 처방은 이 결과만으로 계산하지 않습니다.`;
  }
  function unlockAction(link, href, text) {
    link.href = href;
    link.textContent = text;
    link.removeAttribute("aria-disabled");
    link.removeAttribute("tabindex");
  }
  function lockAction(link, text) {
    link.removeAttribute("href");
    link.textContent = text;
    link.setAttribute("aria-disabled", "true");
    link.tabIndex = -1;
  }
  function render(result, revealResult, historyMessage) {
    document.getElementById("result-empty").hidden = true;
    document.getElementById("result-content").hidden = false;
    document.getElementById("result-state").textContent = "입력 근거 요약";
    announceResult(result, !revealResult, historyMessage);
    document.getElementById("result-source").textContent = `${result.source.label} · Grade ${result.grade}`;
    document.getElementById("recommended-course").textContent = result.currentCourse.label;
    document.getElementById("recommendation-reason").textContent = recommendationReason(result);
    document.getElementById("metric-label").textContent = result.scores.metricLabel;
    document.getElementById("metric-value").textContent = metricText(result);
    document.getElementById("confidence-value").textContent = referenceText(result);
    document.getElementById("placement-value").textContent = placementCopy[result.placementState];
    const route = document.getElementById("course-route"); route.replaceChildren();
    const targetSelection = result.targetCourse || result.currentCourse;
    const selectedCourses = result.currentCourse.id === targetSelection.id ? [result.currentCourse] : [result.currentCourse, targetSelection];
    selectedCourses.forEach(function (course, index) { const chip = document.createElement("span"); const role = selectedCourses.length === 1 ? "현재·목표 선택" : index === 0 ? "현재 선택" : "비교 목표"; chip.innerHTML = `<b>${role} · ${course.label}</b><small>${course.publicLearning ? "검증 자료 연결" : "경로 공개 · 자료 검수 대기"}</small>`; route.append(chip); });
    const priorities = document.getElementById("priority-list"); priorities.replaceChildren();
    if (!result.domainComparisons.length) { const empty = document.createElement("p"); empty.className = "priority-empty"; empty.textContent = "입력한 영역별 점수가 없습니다. 단일 점수만으로 세부 강점·보완 영역을 추정하지 않습니다."; priorities.append(empty); }
    result.domainComparisons.forEach(function (domain, index) { const row = document.createElement("div"); row.className = "priority-row"; const mapping = result.grade === 6 && domain.clusterId ? `${domain.clusterId} · ` : ""; row.innerHTML = `<div><strong>${index + 1}. ${domain.label}</strong><small>${mapping}성적표 입력값</small></div><span>${domain.percent}%</span>`; priorities.append(row); });
    document.getElementById("decision-notice").textContent = result.decisionNotice;
    const material = document.getElementById("open-material");
    if (result.materialState === "verified-grade6-public-materials" && result.domainComparisons.length) { const first = result.domainComparisons[0]; unlockAction(material, `./unit-workbook.html?cluster=${encodeURIComponent(first.clusterId)}&mode=workbook&audience=student&locale=ko&paper=A4`, `입력값이 가장 낮은 ${first.label} 연습 자료`); }
    else { lockAction(material, result.materialState === "verified-grade6-public-materials" ? "영역 값을 입력하면 관련 연습 자료를 보여 줍니다" : "이 과정 자료는 검수 대기"); }
    const publishedResource = document.getElementById("published-resource");
    if (result.grade === 7) {
      publishedResource.hidden = false;
      publishedResource.href = "./catalog.html?role=student&grade=7";
      publishedResource.textContent = "Grade 7 공개 자료 살펴보기";
    } else publishedResource.hidden = true;
    const sendToPlan = document.getElementById("send-to-plan");
    if (result.materialState === "verified-grade6-public-materials") {
      unlockAction(sendToPlan, "./learning-plan.html?goal=school-g6&fromAssessment=external", "학습 계획에서 시간·영역 정하기");
    } else {
      lockAction(sendToPlan, "이 과정의 학습자료·계획 연결은 검수 대기");
    }
    if (revealResult) document.getElementById("result-content").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function historyMetric(result) {
    const scores = result.scores || {};
    if (result.source.id === "school-placement") return scores.metric == null ? "점수 미입력" : `${scores.metric}%`;
    if (result.source.id === "map-growth") return [`RIT ${scores.rit}`, scores.percentile == null ? null : `${scores.percentile}th percentile`, scores.normYear ? `${scores.normYear} norms` : null, scores.season ? seasonLabel(scores.season) : null, Number.isInteger(scores.instructionalWeeks) ? `${scores.instructionalWeeks} instructional weeks` : null].filter(Boolean).join(" · ");
    if (result.source.id === "isee") return [`${testLevelText(scores.testLevel)}`, `Quantitative Reasoning ${scores.quantStanine ?? "—"}`, `Mathematics Achievement ${scores.mathStanine ?? "—"} stanine`].join(" · ");
    return [scores.testLevel ? testLevelText(scores.testLevel) : null, scores.percentile == null ? null : `${scores.percentile}th percentile`, scores.scaleScore == null ? null : `Scale ${scores.scaleScore}`, scores.stanine == null ? null : `Stanine ${scores.stanine}`].filter(Boolean).join(" · ") || "성적표 값";
  }
  function renderHistory() {
    const list = document.getElementById("assessment-history-list");
    const empty = document.getElementById("assessment-history-empty");
    list.replaceChildren();
    const history = records.storage.loadAssessmentEvidenceHistory();
    empty.hidden = history.length > 0;
    history.forEach(function (entry) {
      const article = document.createElement("article"); article.className = "assessment-history-item";
      const heading = document.createElement("div"); heading.className = "assessment-history-item-heading";
      const title = document.createElement("h3"); title.textContent = `${entry.source.label} · Grade ${entry.grade}`;
      const date = document.createElement("time"); date.textContent = entry.testDate || "날짜 미입력"; if (entry.testDate) date.dateTime = entry.testDate;
      heading.append(title, date);
      const detail = document.createElement("p"); detail.textContent = historyMetric(entry);
      const route = document.createElement("p"); route.className = "assessment-history-route";
      route.textContent = `${entry.currentCourse.label} → ${entry.targetCourse ? entry.targetCourse.label : entry.currentCourse.label}${entry.scores.normGroup ? ` · ${entry.scores.normGroup}` : ""}`;
      article.append(heading, detail, route); list.append(article);
    });
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
  function restoreSavedInputs(saved) {
    sourceSelect.value = saved.source.id;
    updateSourceFields();
    document.getElementById("grade").value = String(saved.grade);
    document.getElementById("test-date").value = saved.testDate || today();
    currentCourse.value = saved.currentCourse.id;
    document.getElementById("target-course").value = (saved.targetCourse || saved.currentCourse).id;
    const scores = saved.scores || {};
    const values = {
      "overall-percent": saved.source.id === "school-placement" ? scores.metric : null,
      "school-cut": scores.schoolCut,
      rit: scores.rit,
      percentile: scores.percentile,
      "scale-score": scores.scaleScore,
      stanine: scores.stanine,
      "quant-stanine": scores.quantStanine,
      "math-stanine": scores.mathStanine,
      "norm-group": scores.normGroup,
      "test-level": scores.testLevel,
      season: scores.season,
      "norm-year": scores.normYear,
      "instructional-weeks": scores.instructionalWeeks
    };
    Object.keys(values).forEach(function (id) {
      const field = document.getElementById(id);
      if (field && values[id] != null) field.value = String(values[id]);
    });
    (saved.domains || []).forEach(function (domain) {
      const field = document.querySelector(`[data-domain="${domain.id}"]`);
      if (field) field.value = String(domain.percent);
    });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault(); formAlertVersion += 1; document.getElementById("form-error").textContent = "";
    try { const result = engine.analyze(inputRecord()); if (!records.storage.saveAssessmentEvidence(result)) throw new Error("SAVE_FAILED"); const historyCount = records.storage.loadAssessmentEvidenceHistory().length; render(result, true, "평가 기록 " + historyCount + "개가 이 기기에 저장되어 있어요."); renderHistory(); }
    catch (error) { announceFormError(errorCopy[error.message] || "입력값을 다시 확인하세요."); }
  });
  sourceSelect.addEventListener("change", updateSourceFields);
  populateCourses(); updateSourceFields(); document.getElementById("test-date").value = today();
  const requestedGradeValue = new URLSearchParams(window.location.search).get("grade");
  const requestedGradeNumber = Number(requestedGradeValue);
  const requestedGrade = requestedGradeValue !== null && Number.isInteger(requestedGradeNumber) && requestedGradeNumber >= 3 && requestedGradeNumber <= 12 ? requestedGradeNumber : null;
  if (requestedGrade !== null) document.getElementById("grade").value = String(requestedGrade);
  const history = records.storage.loadAssessmentEvidenceHistory();
  const saved = requestedGrade !== null ? records.storage.loadLatestAssessmentEvidence(requestedGrade) : records.storage.loadAssessmentEvidence();
  if (saved && [engine.SCHEMA_VERSION, "gfield-external-math-evidence-v2"].includes(saved.schemaVersion)) {
    restoreSavedInputs(saved); render(saved, false);
    if (saved.schemaVersion === "gfield-external-math-evidence-v2" && saved.source.id === "map-growth") {
      const note = document.getElementById("legacy-evidence-note");
      note.textContent = "이전 MAP 기록을 복원했어요. 저장 당시 규준 연도와 시험 전 수업 주차가 없어 학년별 백분위 비교에는 사용하지 않습니다. 성적표를 확인해 두 항목을 입력하고 다시 저장해 주세요.";
      note.hidden = false;
    }
  }
  else {
    const legacy = records.storage.loadAssessmentEvidence();
    if (legacy && legacy.legacyEvidence && (requestedGrade === null || legacy.grade === requestedGrade) && history.length === 0) restoreLegacyInputs(legacy);
  }
  renderHistory();
  document.getElementById("clear-assessment-history").addEventListener("click", function () {
    if (!window.confirm("이 기기에 저장된 모든 학년의 평가 기록을 지울까요? 삭제한 기록은 복구할 수 없습니다.")) return;
    if (!records.storage.clearAssessmentEvidence()) {
      const region = document.getElementById("result-announcement");
      const version = ++resultAnnouncementVersion;
      region.textContent = "";
      window.requestAnimationFrame(function () {
        if (version === resultAnnouncementVersion) region.textContent = "평가 기록을 지우지 못했어요. 브라우저 저장 상태를 확인해 주세요.";
      });
      return;
    }
    document.getElementById("result-content").hidden = true;
    document.getElementById("result-empty").hidden = false;
    renderHistory();
    const region = document.getElementById("result-announcement");
    const version = ++resultAnnouncementVersion;
    region.textContent = "";
    document.getElementById("legacy-evidence-note").hidden = true;
    window.requestAnimationFrame(function () {
      if (version === resultAnnouncementVersion) region.textContent = "이 기기에 저장된 평가 기록을 모두 지웠어요.";
    });
  });
})();
