(function () {
  "use strict";

  const engine = window.GFIELDLearnerPlanEngine;
  const localRecord = window.GFIELDLocalLearningRecord;
  const catalog = window.GFIELDSASMOMockCatalog;
  const readiness = window.GFIELDSASMOMockReadiness;
  if (!engine || !localRecord) throw new Error("GFIELD learner plan dependencies did not load");

  const priorityProfiles = Object.freeze({
    geometry: Object.freeze({ label: "기하·공간 추론", clusterId: "6.G.A", errorType: "reasoning-gap", difficulty: "advanced" }),
    ratio: Object.freeze({ label: "비와 비례", clusterId: "6.RP.A", errorType: "concept-gap", difficulty: "core" }),
    algebra: Object.freeze({ label: "식과 방정식", clusterId: "6.EE.B", errorType: "procedure-gap", difficulty: "core" })
  });
  const goalId = document.getElementById("goal-id");
  const targetDate = document.getElementById("target-date");
  const studyDays = document.getElementById("study-days");
  const minutesPerDay = document.getElementById("minutes-per-day");

  function isoDate(offsetDays) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
  }
  function selectedPriorityKey() { return document.querySelector('input[name="priority"]:checked').value; }
  function selectedPriority() {
    const value = selectedPriorityKey();
    return priorityProfiles[value];
  }
  function linkedPracticeSummary() {
    if (goalId.value !== "sasmo-primary6") return null;
    const saved = localRecord.storage.loadPractice("sasmo-g6").summary;
    return saved && saved.attempted > 0 ? saved : null;
  }
  function linkedCompetitionEvidence() {
    if (goalId.value !== "sasmo-primary6" || typeof localRecord.storage.loadCompetitionEvidence !== "function") return null;
    const series = linkedCompetitionSeries();
    if (series.length) return series[series.length - 1];
    const saved = localRecord.storage.loadCompetitionEvidence();
    return saved && saved.programId === "sasmo" && saved.levelId === "G6" && saved.verifiedRealPaper === true ? saved : null;
  }
  function linkedCompetitionSeries() {
    if (goalId.value !== "sasmo-primary6" || !catalog || typeof localRecord.storage.getComparableCompetitionSeries !== "function") return [];
    return localRecord.storage.getComparableCompetitionSeries(catalog, "G6");
  }
  function competitionPrediction(series) {
    if (!readiness || series.length < 3) return null;
    const latest = series[series.length - 1];
    const form = catalog.getForm(latest.formId);
    const history = series.slice(0, -1).map(function (entry) {
      return { formId: entry.formId, formVersion: entry.formVersion, levelId: entry.levelId, comparisonKey: entry.comparisonKey, scoringFingerprintSha256: entry.scoringFingerprintSha256, sourceFingerprintSha256: entry.sourceFingerprintSha256, rawScore: entry.score.rawScore, maxScore: entry.score.maxScore, verifiedRealPaper: true };
    });
    return readiness.buildTrendPrediction(form, latest.score.rawScore, history, null);
  }
  function linkedAssessmentEvidence() {
    if (goalId.value !== "school-g6" && goalId.value !== "promotion-g6") return null;
    const saved = localRecord.storage.loadAssessmentEvidence();
    return saved && saved.grade === 6 && saved.materialState === "verified-grade6-public-materials" ? saved : null;
  }
  function assessmentPriority(evidence) {
    if (!evidence || !evidence.primaryPriority || !evidence.primaryPriority.clusterId) return null;
    const percent = evidence.primaryPriority.percent;
    return {
      label: evidence.primaryPriority.label,
      clusterId: evidence.primaryPriority.clusterId,
      errorType: percent != null && percent < 50 ? "concept-gap" : evidence.primaryPriority.axis === "geometry-spatial" || evidence.primaryPriority.axis === "problem-solving-strategies" ? "reasoning-gap" : "procedure-gap",
      difficulty: percent != null && percent < 50 ? "foundation" : percent != null && percent >= 75 ? "advanced" : "core"
    };
  }
  function priorityForPlan() {
    const assessment = assessmentPriority(linkedAssessmentEvidence());
    const competition = linkedCompetitionEvidence();
    const practice = linkedPracticeSummary();
    const mappedCompetition = competition && competition.priorityAxis ? localRecord.priorityForAxis(competition.priorityAxis) : null;
    const mappedPractice = practice && practice.priorityAxis ? localRecord.priorityForAxis(practice.priorityAxis) : null;
    return assessment || mappedCompetition || mappedPractice || selectedPriority();
  }
  function createPlan() {
    return engine.buildPlan({
      goalId: goalId.value,
      startDate: isoDate(0),
      targetDate: targetDate.value,
      availability: { studyDaysPerWeek: Number(studyDays.value), minutesPerDay: Number(minutesPerDay.value) },
      priorities: [priorityForPlan()]
    });
  }
  function text(nodeId, value) { document.getElementById(nodeId).textContent = value; }
  function plural(value, singular, pluralLabel) { return `${value}${value === 1 ? singular : pluralLabel}`; }
  function renderToday(plan) {
    text("today-minutes", `${plan.today.totalMinutes}분`);
    text("today-problems", `${plan.today.totalProblemCount}문항 내외`);
    const competition = linkedCompetitionEvidence();
    const scoreOnlyPaper = competition && ["legacy-unreviewed", "taxonomy-review-pending"].includes(competition.diagnosticState);
    text("today-description", scoreOnlyPaper ? `이 기출 기록은 점수만 연결합니다. ${plan.priorities[0].label} 학습은 현재 선택 또는 별도 유형 점검에 따르며, 검수 중인 영역 판정으로 확정한 약점이 아닙니다.` : competition && !competition.priorityAxis ? `${plan.priorities[0].label} 유지 학습을 위한 오늘의 계획입니다. 이 기출에서는 자동 확정할 약점이 없었습니다.` : `${plan.priorities[0].label} 약점에 맞춘 오늘의 계획입니다. 실제 진단 뒤에는 최대 두 약점만 함께 배정합니다.`);
    const host = document.getElementById("today-blocks");
    host.replaceChildren();
    plan.today.blocks.forEach(function (block, index) {
      const item = document.createElement("li");
      const marker = document.createElement("span");
      marker.className = "block-index";
      marker.textContent = String(index + 1).padStart(2, "0");
      const copy = document.createElement("div");
      const title = document.createElement(block.href ? "a" : "strong");
      title.textContent = block.title;
      if (block.href) title.href = block.href;
      const detail = document.createElement("small");
      detail.textContent = block.detail;
      copy.append(title, detail);
      const time = document.createElement("b");
      time.textContent = `${block.minutes}분${block.problemCount ? ` · ${block.problemCount}문항` : ""}`;
      item.append(marker, copy, time);
      host.append(item);
    });
  }
  function renderTeacherPack(plan) {
    text("teacher-pack-state", `${plan.priorities[0].label} · ${plan.materials.clusterId} 수업 세트`);
    const resources = [
      ["학생용 개념", "학생이 먼저 읽는 모델·대표 예제", plan.materials.studentConceptHref, "학생용 개념 열기"],
      ["교사용 지도서", "정답·풀이·관찰 포인트를 포함한 2문항 수업 단위", plan.materials.teacherWorkbookHref, "교사용 지도서 열기"],
      ["학생용 워크북", "수업 뒤 같은 약점의 독립 연습", plan.materials.studentWorkbookHref, "학생용 워크북 열기"],
      ["유지 확인", plan.retention.map(function (entry) { return entry.label; }).join(" · "), plan.materials.teacherWorkbookHref.replace("mode=workbook", "mode=recheck"), "재확인 지도서 열기"]
    ];
    const host = document.getElementById("teacher-grid");
    host.replaceChildren();
    resources.forEach(function (resource, index) {
      const card = document.createElement("article");
      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      const title = document.createElement("h3");
      title.textContent = resource[0];
      const copy = document.createElement("p");
      copy.textContent = resource[1];
      const link = document.createElement("a");
      link.href = resource[2];
      link.textContent = resource[3];
      card.append(number, title, copy, link);
      host.append(card);
    });
  }
  function render(plan) {
    const practiceEvidence = linkedPracticeSummary();
    const competitionEvidence = linkedCompetitionEvidence();
    const competitionSeries = linkedCompetitionSeries();
    const trend = competitionPrediction(competitionSeries);
    const scoreOutlook = trend && trend.state === "preliminary-real-paper-trend" ? `서로 다른 검증 기출 ${competitionSeries.length}회 기준 다음 70점 시험 예상 범위 ${trend.expectedNextScoreRange[0]}–${trend.expectedNextScoreRange[1]}점 · 신뢰도 낮음. 공식 수상 등급이나 배정 기준이 아닙니다.` : `서로 다른 비교 가능 기출 최초 응시 ${competitionSeries.length}/3회. 3회가 모일 때까지 다음 점수 범위를 표시하지 않습니다. 공식 수상 등급 예측이 아닙니다.`;
    const assessmentEvidence = linkedAssessmentEvidence();
    const competitionPriorityConfirmed = Boolean(competitionEvidence && competitionEvidence.priorityAxis);
    const competitionLegacy = Boolean(competitionEvidence && competitionEvidence.diagnosticState === "legacy-unreviewed");
    const competitionTaxonomyPending = Boolean(competitionEvidence && competitionEvidence.diagnosticState === "taxonomy-review-pending");
    const competitionScoreOnly = competitionLegacy || competitionTaxonomyPending;
    const evidence = assessmentEvidence || competitionEvidence || practiceEvidence;
    text("goal-program", plan.goal.label);
    text("plan-title", `${plan.calendar.calendarWeeks}주 학습 계획`);
    const scheduleCopy = `${plan.calendar.calendarWeeks}주 동안 주 ${plan.availability.studyDaysPerWeek}일, 하루 ${plan.availability.minutesPerDay}분을 기준으로 설계했습니다. 수업 결석과 복습 여유를 고려해 전체 시간의 80%만 배정합니다.`;
    text("plan-description", assessmentEvidence ? `${scheduleCopy} ${assessmentEvidence.source.label} 결과와 영역별 약점을 반영해 ${assessmentEvidence.recommendedStart.label}에서 시작하는 G·MAP 진도를 구성했습니다.` : competitionEvidence ? competitionScoreOnly ? `${scheduleCopy} ${competitionEvidence.year} SASMO Grade 6 기출 최초 응시 ${competitionEvidence.score.rawScore} / 70은 점수 이력으로만 연결했습니다. 영역 분류는 재검수 대상이어서 자동 약점 처방에 사용하지 않습니다.` : competitionPriorityConfirmed ? `${scheduleCopy} ${competitionEvidence.year} SASMO Grade 6 기출 최초 응시 ${competitionEvidence.score.rawScore} / 70과 영역별 약점을 반영해 오늘의 우선 학습을 골랐습니다.` : `${scheduleCopy} ${competitionEvidence.year} SASMO Grade 6 기출 최초 응시 ${competitionEvidence.score.rawScore} / 70을 연결했습니다. 충분한 약점 신호가 없어 현재 선택한 영역을 유지 학습으로 구성합니다.` : practiceEvidence ? `${scheduleCopy} SASMO 유형 점검의 첫 응답 ${practiceEvidence.firstCorrect} / ${practiceEvidence.attempted}을 반영해 오늘의 우선 학습을 골랐습니다.` : scheduleCopy);
    text("days-remaining", plural(plan.calendar.daysRemaining, "일", "일"));
    text("study-day-count", plural(plan.calendar.studyDays, "일", "일"));
    text("capacity-minutes", `${plan.calendar.usableMinutes.toLocaleString("ko-KR")}분`);
    const state = document.getElementById("plan-state");
    state.textContent = assessmentEvidence ? "학교 평가 연결" : competitionScoreOnly ? "기출 점수 연결" : competitionEvidence ? "기출 진단 연결" : practiceEvidence ? "예비 진단 연결" : "진단 연결 전";
    state.className = `state-chip ${evidence ? "connected" : "waiting"}`;
    text("prediction-title", assessmentEvidence ? "학교 평가 결과가 오늘의 학습에 반영되었습니다." : competitionScoreOnly ? "기출 점수만 학습계획에 연결했습니다." : competitionEvidence ? "검증된 기출 결과가 오늘의 학습에 반영되었습니다." : practiceEvidence ? "유형 점검은 오늘의 학습에 반영되었습니다." : "예상 성적은 진단 후 계산합니다.");
    text("prediction-copy", assessmentEvidence ? `${assessmentEvidence.source.label} · G·MAP 권장 시작 ${assessmentEvidence.recommendedStart.label} · 우선 보완 ${plan.priorities[0].label}. 이는 학교의 공식 배정이 아니며, 실전 예상 점수는 별도의 최초 모의 기록이 쌓인 뒤 계산합니다.` : competitionEvidence ? `실제 점수 ${competitionEvidence.score.rawScore} / 70 · ${competitionScoreOnly ? `영역 판정 재검수 중 · ${plan.priorities[0].label} 학습` : competitionPriorityConfirmed ? `우선 보완 ${plan.priorities[0].label}` : `자동 확정 약점 없음 · ${plan.priorities[0].label} 유지 학습`}. ${scoreOutlook}` : practiceEvidence ? `첫 응답 ${practiceEvidence.firstCorrect} / ${practiceEvidence.attempted} · 우선 보완 ${plan.priorities[0].label}. 이 10유형 점검은 공식 점수 예측이 아닙니다. 예상 범위는 전체 실전 모의의 난이도·시간·최초 응시 기록이 쌓인 뒤 계산합니다.` : `${plan.diagnostic.actionLabel}의 최초 응시 결과와 이후 실전 모의 기록이 있어야 점수 범위와 신뢰도를 계산합니다.`);
    const diagnosticAction = document.getElementById("diagnostic-action");
    diagnosticAction.href = assessmentEvidence ? "./assessment-entry.html" : competitionEvidence ? "./sasmo-real-paper.html" : plan.diagnostic.actionHref;
    diagnosticAction.textContent = assessmentEvidence ? "학교 평가 결과 다시 보기" : competitionEvidence ? "SASMO 기출 진단 다시 열기" : practiceEvidence ? "SASMO 유형 점검 이어서 하기" : `${plan.diagnostic.actionLabel} 시작`;
    renderToday(plan);
    renderTeacherPack(plan);
  }
  function applyAudienceMode() {
    const query = new URLSearchParams(window.location.search);
    const audience = query.get("audience") === "teacher" ? "teacher" : "student";
    const studentLink = document.getElementById("student-workspace-link");
    const teacherLink = document.getElementById("teacher-workspace-link");
    const requestedGoal = query.get("goal");
    const goalQuery = requestedGoal && engine.GOALS[requestedGoal] ? `&goal=${encodeURIComponent(requestedGoal)}` : "";
    document.body.dataset.audience = audience;
    studentLink.href = `./learning-plan.html?audience=student${goalQuery}`;
    teacherLink.href = `./learning-plan.html?audience=teacher${goalQuery}#teacher-pack`;
    if (audience === "teacher") {
      studentLink.removeAttribute("aria-current");
      teacherLink.setAttribute("aria-current", "page");
    } else {
      studentLink.setAttribute("aria-current", "page");
      teacherLink.removeAttribute("aria-current");
    }
    if (audience === "teacher") {
      text("plan-audience-eyebrow", "TEACHER · G·MAP LESSON PATH");
      document.getElementById("plan-audience-title").innerHTML = "진단 근거가<br><span>오늘의 수업이 됩니다.</span>";
      text("plan-audience-description", "학생의 현재 과정과 약점 유형을 확인하고 수업 시간에 맞춰 강사용 교안, 학생용 워크북, 숙제와 재확인을 한 수업 세트로 구성합니다.");
      text("plan-setup-title", "학생의 수업 조건을 입력하세요.");
      document.querySelector("#plan-form .primary-action").textContent = "학생 수업 계획 계산";
      const teacherSection = document.getElementById("teacher-pack");
      const todaySection = document.querySelector(".today-section");
      todaySection.parentNode.insertBefore(teacherSection, todaySection);
      teacherSection.classList.add("audience-primary");
    }
  }
  function setInitialGoalFromQuery() {
    const requested = new URLSearchParams(window.location.search).get("goal");
    if (requested && engine.GOALS[requested]) goalId.value = requested;
  }
  function restoreSettings() {
    const settings = localRecord.storage.loadPlanSettings();
    if (settings.goalId && engine.GOALS[settings.goalId]) goalId.value = settings.goalId;
    if (settings.targetDate && settings.targetDate >= targetDate.min) targetDate.value = settings.targetDate;
    if (settings.studyDays && settings.studyDays >= 1 && settings.studyDays <= 7) studyDays.value = String(settings.studyDays);
    if (settings.minutesPerDay && settings.minutesPerDay >= 20 && settings.minutesPerDay <= 180) minutesPerDay.value = String(settings.minutesPerDay);
    if (settings.priority && priorityProfiles[settings.priority]) document.querySelector(`input[name="priority"][value="${settings.priority}"]`).checked = true;
  }
  function applyAssessmentSchedule() {
    if (new URLSearchParams(window.location.search).get("fromAssessment") !== "external") return;
    const evidence = localRecord.storage.loadAssessmentEvidence();
    if (!evidence || evidence.grade !== 6 || evidence.materialState !== "verified-grade6-public-materials") return;
    goalId.value = "school-g6";
    if ([3, 4, 5, 6].includes(evidence.plan.studyDaysPerWeek)) studyDays.value = String(evidence.plan.studyDaysPerWeek);
    if ([30, 45, 60, 75, 90].includes(evidence.plan.minutesPerDay)) minutesPerDay.value = String(evidence.plan.minutesPerDay);
    targetDate.value = isoDate(Math.max(7, evidence.plan.weeks * 7));
  }
  document.getElementById("plan-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const plan = createPlan();
    const url = new URL(window.location.href);
    url.searchParams.set("goal", plan.goal.id);
    window.history.replaceState({}, "", url);
    localRecord.storage.savePlanSettings({ goalId: plan.goal.id, targetDate: targetDate.value, studyDays: Number(studyDays.value), minutesPerDay: Number(minutesPerDay.value), priority: selectedPriorityKey() });
    render(plan);
  });
  targetDate.min = isoDate(1);
  targetDate.value = isoDate(56);
  applyAudienceMode();
  restoreSettings();
  setInitialGoalFromQuery();
  applyAssessmentSchedule();
  render(createPlan());
})();
