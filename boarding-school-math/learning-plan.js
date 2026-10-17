(function () {
  "use strict";

  const engine = window.GFIELDLearnerPlanEngine;
  const localRecord = window.GFIELDLocalLearningRecord;
  const catalog = window.GFIELDSASMOMockCatalog;
  const readiness = window.GFIELDSASMOMockReadiness;
  const placementPlan = window.GFIELDGrade6PlacementPlan;
  const roadmapEngine = window.GFIELDRoadmapPaceEngine;
  if (!engine || !localRecord || !placementPlan || !roadmapEngine) throw new Error("GFIELD learner plan dependencies did not load");

  const pageQuery = new URLSearchParams(window.location.search);
  const runtimeToken = pageQuery.get("runtime") === "local-private" ? pageQuery.get("token") : null;
  const loopback = new Set(["127.0.0.1", "localhost", "[::1]"]).has(window.location.hostname);
  const privateRuntime = loopback && /^[A-Za-z0-9_-]{32}$/u.test(runtimeToken || "")
    ? Object.freeze({ token: runtimeToken })
    : null;

  const priorityProfiles = Object.freeze({
    geometry: Object.freeze({ label: "기하·공간 추론", clusterId: "6.G.A", errorType: "strategy-gap", difficulty: "advanced" }),
    ratio: Object.freeze({ label: "비와 비례", clusterId: "6.RP.A", errorType: "concept-gap", difficulty: "core" }),
    algebra: Object.freeze({ label: "식과 방정식", clusterId: "6.EE.B", errorType: "representation-error", difficulty: "core" })
  });
  const goalId = document.getElementById("goal-id");
  const targetDate = document.getElementById("target-date");
  const studyDays = document.getElementById("study-days");
  const minutesPerDay = document.getElementById("minutes-per-day");
  const roadmapLocale = document.getElementById("roadmap-locale");
  const roadmapObservations = document.getElementById("roadmap-observations");
  const roadmapRetention = document.getElementById("roadmap-retention");
  const paperMarks = new Map();
  let currentPlan = null;

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
  function linkedGrade6DiagnosticEvidence() {
    if (goalId.value !== "school-g6" && goalId.value !== "promotion-g6") return null;
    if (typeof localRecord.storage.loadGrade6DiagnosticEvidence !== "function") return null;
    const saved = localRecord.storage.loadGrade6DiagnosticEvidence();
    if (!saved || saved.grade !== 6 || saved.sourceState !== "local-qa-finalized-teacher-reviewed") return null;
    const explicitDiagnosticHandoff = new URLSearchParams(window.location.search).get("fromDiagnostic") === "grade6";
    const assessment = linkedAssessmentEvidence();
    const diagnosticTime = Date.parse(saved.recordedAt || "");
    const assessmentTime = assessment ? Date.parse(assessment.savedAt || assessment.testDate || "") : NaN;
    if (!explicitDiagnosticHandoff && Number.isFinite(assessmentTime) && (!Number.isFinite(diagnosticTime) || assessmentTime > diagnosticTime)) return null;
    return saved;
  }
  function grade6DiagnosticPriority(evidence) {
    if (!evidence || !Array.isArray(evidence.priorities) || !evidence.priorities.length) return null;
    const priority = evidence.priorities[0];
    return {
      label: priority.label,
      clusterId: priority.clusterId,
      errorType: priority.errorType,
      difficulty: priority.difficulty
    };
  }
  function assessmentPriority(evidence) {
    if (!evidence || !evidence.primaryPriority || !evidence.primaryPriority.clusterId) return null;
    const percent = evidence.primaryPriority.percent;
    return {
      label: evidence.primaryPriority.label,
      clusterId: evidence.primaryPriority.clusterId,
      errorType: percent != null && percent < 50 ? "concept-gap" : evidence.primaryPriority.axis === "geometry-spatial" || evidence.primaryPriority.axis === "problem-solving-strategies" ? "strategy-gap" : "representation-error",
      difficulty: percent != null && percent < 50 ? "foundation" : percent != null && percent >= 75 ? "advanced" : "core"
    };
  }
  function priorityForPlan() {
    const grade6Diagnostic = grade6DiagnosticPriority(linkedGrade6DiagnosticEvidence());
    const assessment = assessmentPriority(linkedAssessmentEvidence());
    const competition = linkedCompetitionEvidence();
    const mappedCompetition = competition && competition.priorityAxis ? localRecord.priorityForAxis(competition.priorityAxis) : null;
    return grade6Diagnostic || assessment || mappedCompetition || selectedPriority();
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
  function roadmapText(ko, en, zh) {
    return roadmapLocale.value === "en" ? en : roadmapLocale.value === "zh-Hans" ? zh : ko;
  }
  function domainLabel(domainId) {
    const labels = {
      "G6-RP": ["비와 비례", "Ratios & proportional reasoning", "比与比例"],
      "G6-NS": ["수 체계", "The Number System", "数与运算"],
      "G6-EE": ["식과 방정식", "Expressions & equations", "代数"],
      "G6-G": ["기하", "Geometry", "几何与测量"],
      "G6-SP": ["통계", "Statistics", "统计"],
      "number-operations": ["수와 연산", "Number & operations", "数与运算"],
      "patterns-algebra": ["규칙과 대수", "Patterns & algebra", "规律与代数"],
      "geometry-spatial": ["기하와 공간", "Geometry & spatial", "几何与空间"],
      "data-probability": ["자료와 가능성", "Data & probability", "数据与概率"],
      "combinatorics-logic": ["조합과 논리", "Combinatorics & logic", "组合与逻辑"],
      "problem-solving-strategies": ["문제 해결 전략", "Problem-solving strategies", "问题解决策略"]
    };
    const row = labels[domainId] || [domainId, domainId, domainId];
    return roadmapLocale.value === "en" ? row[1] : roadmapLocale.value === "zh-Hans" ? row[2] : row[0];
  }
  function paperProfile() {
    if (goalId.value === "sasmo-primary6") {
      const form = catalog.getForm("sasmo-2019-g6-baseline-a");
      return {
        id: "sasmo-primary6-25",
        label: roadmapText("SASMO Primary 6 · 25문항", "SASMO Primary 6 · 25 items", "SASMO Primary 6 · 25题"),
        entries: form.items.map(function (item) { return { id: `sasmo-${item.questionNumber}`, number: item.questionNumber, domainId: item.axisId }; })
      };
    }
    return {
      id: goalId.value === "promotion-g6" ? "promotion-g6-42" : "school-g6-42",
      label: roadmapText("Grade 6 · 42문항 설계 슬롯", "U.S. Grade 6 · 42 planned slots", "六年级 · 42个规划题位"),
      entries: placementPlan.plan.slots.map(function (slot, index) { return { id: `${goalId.value}-${slot.slotId}`, number: index + 1, domainId: slot.domainId }; })
    };
  }
  function markFor(profile, entry, index) {
    const key = `${profile.id}:${entry.id}`;
    if (!paperMarks.has(key)) paperMarks.set(key, ![2, 5, 8, 11].includes(index % 13));
    return paperMarks.get(key);
  }
  function paperResults(profile) {
    return profile.entries.map(function (entry, index) {
      return { id: entry.id, domainId: domainLabel(entry.domainId), correct: markFor(profile, entry, index) };
    });
  }
  function renderPaperMarks(profile, roadmap) {
    const host = document.getElementById("paper-ox-grid");
    host.replaceChildren();
    profile.entries.forEach(function (entry, index) {
      const correct = markFor(profile, entry, index);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "paper-mark";
      button.dataset.mark = correct ? "O" : "X";
      button.innerHTML = `<b>${String(entry.number).padStart(2, "0")} · ${correct ? "O" : "X"}</b><small>${domainLabel(entry.domainId)}</small>`;
      button.setAttribute("aria-label", roadmapText(`${entry.number}번 ${domainLabel(entry.domainId)} ${correct ? "O" : "X"}. 눌러서 바꾸기`, `Item ${entry.number}, ${domainLabel(entry.domainId)}, ${correct ? "O" : "X"}. Press to change.`, `第${entry.number}题，${domainLabel(entry.domainId)}，${correct ? "O" : "X"}。按下可更改。`));
      button.addEventListener("click", function () {
        paperMarks.set(`${profile.id}:${entry.id}`, !correct);
        renderRoadmap(currentPlan);
      });
      host.append(button);
    });
    text("paper-ox-summary", `${roadmap.summary.correct} O · ${roadmap.summary.total - roadmap.summary.correct} X`);
  }
  function renderRoadmap(plan) {
    if (!plan) return;
    currentPlan = plan;
    text("roadmap-title", roadmapText("한 번의 점수가 아니라, 안정된 속도로 목표까지 갑니다.", "One score does not set the speed. Build a stable route to the goal.", "一次成绩不决定提速，先稳定，再走向目标。"));
    text("roadmap-intro-copy", roadmapText("종이 진단은 O/X로 빠르게 입력합니다. 첫 결과만으로 진도를 올리지 않고 재확인 뒤에 시간·횟수·목표일 중 필요한 갈림길을 고릅니다.", "Mark a paper test with O/X. Hold the current pace after the first result, then choose time, frequency, or a new target date after a stable recheck.", "纸笔诊断只需标记O/X。第一次结果后先保持当前进度，复测稳定后再选择增加时间、频次或调整目标日期。"));
    text("roadmap-curriculum-label", roadmapText("교육과정 기준", "Curriculum path", "课程体系"));
    text("roadmap-observations-label", roadmapText("누적 관찰", "Observed attempts", "累计观察"));
    text("roadmap-retention-label", roadmapText("재확인에서도 유지됨", "Stable on recheck", "复测结果稳定"));
    text("roadmap-retention-help", roadmapText("두 번째 관찰부터 선택", "Available from the second observation", "从第二次观察开始选择"));
    const observationCopy = roadmapLocale.value === "en"
      ? ["1 · First diagnostic", "2 · Recheck", "3 · Trend check"]
      : roadmapLocale.value === "zh-Hans"
        ? ["1次 · 首次诊断", "2次 · 复测", "3次 · 趋势确认"]
        : ["1회 · 첫 진단", "2회 · 재확인", "3회 · 추세 확인"];
    Array.from(roadmapObservations.options).forEach(function (option, index) { option.textContent = observationCopy[index]; });
    text("roadmap-stage-title", roadmapText("현재 → 안정화 → 목표 경로", "Current → stabilize → target route", "当前 → 稳定 → 目标路径"));
    document.getElementById("roadmap-canvas").setAttribute("aria-label", roadmapText("현재 수준에서 안정화 구간을 거쳐 시간 또는 학습 횟수를 조정하는 3D 학습 경로", "A 3D learning route from the current level through stabilization to time or frequency adjustments", "从当前阶段经过稳定期，再调整学习时间或频次的3D学习路径"));
    text("roadmap-axis-current", roadmapText("현재", "Current", "当前"));
    text("roadmap-axis-stable", roadmapText("안정화", "Stabilize", "稳定"));
    text("roadmap-axis-branch", roadmapText("선택", "Choose", "选择"));
    text("roadmap-axis-target", roadmapText("목표", "Target", "目标"));
    text("roadmap-interaction", roadmapText("마우스나 손가락으로 돌려 보세요. 파란 길은 현재 선택 경로, 세 기둥은 현재·안정화·목표 단계 비교입니다.", "Drag to rotate. The blue road is the selected route; the three columns compare current, stable, and target levels.", "拖动可旋转。蓝色道路是当前选择的路径，三根柱子比较当前、稳定和目标阶段。"));
    text("roadmap-current-label", roadmapText("현재 학습량", "Current load", "当前学习量"));
    text("roadmap-required-label", roadmapText("필요 학습량", "Required load", "所需学习量"));
    text("roadmap-stabilization-label", roadmapText("안정화 기간", "Stabilization", "稳定期"));
    text("roadmap-decision-label", roadmapText("권장 경로", "Recommended route", "建议路径"));
    text("roadmap-decision-help", roadmapText("실제 배정은 재확인 결과와 교사 확인 뒤 확정합니다.", "Confirm an actual assignment only after the recheck and teacher review.", "实际安排须在复测和教师确认后确定。"));
    text("paper-ox-label", roadmapText("종이 진단 O/X 입력 보기", "Open paper-test O/X marks", "查看纸笔诊断O/X录入"));
    text("paper-ox-notice-label", roadmapText("설명용 가상 입력", "Demonstration marks", "演示用模拟录入"));
    text("paper-ox-notice-copy", roadmapText("선택한 시험의 공개 메타데이터에 맞춰 칸 수와 영역을 구성합니다. 문항·정답은 이 화면에 넣지 않으며 실제 학생 기록으로 저장하지 않습니다.", "The number of cells and domains follows the selected assessment's public metadata. No question, answer, or student record is stored here.", "题位数量和领域依据所选测评的公开元数据。此页面不放入题目或答案，也不保存真实学生记录。"));
    const profile = paperProfile();
    const model = roadmapEngine.buildRoadmap({
      locale: roadmapLocale.value,
      goalId: plan.goal.id,
      weeksAvailable: plan.calendar.calendarWeeks,
      studyDaysPerWeek: plan.availability.studyDaysPerWeek,
      minutesPerDay: plan.availability.minutesPerDay,
      observationCount: Number(roadmapObservations.value),
      retentionPassed: roadmapRetention.checked,
      results: paperResults(profile)
    });
    text("roadmap-curriculum", model.curriculum.label);
    text("roadmap-paper-name", profile.label);
    text("roadmap-score", `${model.summary.correct} / ${model.summary.total}`);
    text("roadmap-lock-state", model.stability.accelerationLocked ? roadmapText("속도 조정 잠금", "Pace change locked", "暂不提速") : roadmapText("속도 조정 가능", "Pace change available", "可以调整进度"));
    document.getElementById("roadmap-lock-state").style.color = model.stability.accelerationLocked ? "#b42332" : "#16734b";
    text("roadmap-comment", model.comment);
    text("roadmap-current-pace", roadmapText(`주 ${model.pace.currentCapacity}블록`, `${model.pace.currentCapacity} blocks/wk`, `每周${model.pace.currentCapacity}课时`));
    text("roadmap-required-pace", roadmapText(`주 ${model.pace.requiredPace}블록`, `${model.pace.requiredPace} blocks/wk`, `每周${model.pace.requiredPace}课时`));
    text("roadmap-stabilization", model.stability.stabilizationWeeks ? roadmapText(`${model.stability.stabilizationWeeks}주`, `${model.stability.stabilizationWeeks} weeks`, `${model.stability.stabilizationWeeks}周`) : roadmapText("확인 완료", "Confirmed", "已确认"));
    text("roadmap-decision", model.stability.accelerationLocked ? roadmapText(`먼저 ${model.stability.stabilizationWeeks}주 유지 · 이후 ${model.decision}`, `Hold for ${model.stability.stabilizationWeeks} weeks first. Then: ${model.decision}`, `先保持${model.stability.stabilizationWeeks}周，再执行：${model.decision}`) : model.decision);
    const branches = document.getElementById("roadmap-branches");
    branches.replaceChildren();
    model.pace.options.forEach(function (option, index) {
      const row = document.createElement("div");
      row.className = `roadmap-branch${option.id === model.pace.selectedOptionId ? " selected" : ""}`;
      row.innerHTML = `<span class="branch-mark">${index + 1}</span><div><b>${option.label}</b><small>${roadmapText(`주 ${option.studyDaysPerWeek}일 · 하루 ${option.minutesPerDay}분`, `${option.studyDaysPerWeek} days/wk · ${option.minutesPerDay} min/day`, `每周${option.studyDaysPerWeek}次 · 每次${option.minutesPerDay}分钟`)}</small></div><strong>${option.feasible ? roadmapText("가능", "Enough", "可行") : roadmapText("부족", "Short", "不足")}</strong>`;
      branches.append(row);
    });
    const comparison = document.getElementById("level-comparison");
    comparison.replaceChildren();
    model.comparison.forEach(function (entry) {
      const cell = document.createElement("div");
      cell.innerHTML = `<span>${entry.label}</span><strong>${entry.levelLabel}</strong><small>${entry.value}</small>`;
      comparison.append(cell);
    });
    renderPaperMarks(profile, model);
    roadmapRetention.disabled = Number(roadmapObservations.value) < 2;
    if (roadmapRetention.disabled) roadmapRetention.checked = false;
    window.GFIELDLatestRoadmapModel = model;
    window.dispatchEvent(new CustomEvent("gfield-roadmap-update", { detail: model }));
  }
  function renderToday(plan) {
    text("today-minutes", `${plan.today.totalMinutes}분`);
    text("today-problems", `${plan.today.totalProblemCount}문항 내외`);
    const competition = linkedCompetitionEvidence();
    const grade6Diagnostic = linkedGrade6DiagnosticEvidence();
    const scoreOnlyPaper = competition && ["legacy-unreviewed", "legacy-diagnostic-superseded", "taxonomy-review-pending"].includes(competition.diagnosticState);
    text("today-description", grade6Diagnostic && grade6Diagnostic.priorities.length ? `${plan.priorities[0].label}의 ${plan.priorities[0].errorLabel}에 맞춘 오늘의 계획입니다. 학생 응답이나 정답은 학습계획에 저장하지 않습니다.` : scoreOnlyPaper ? `이 기출 기록은 점수만 연결합니다. ${plan.priorities[0].label} 학습은 현재 선택 또는 별도 유형 점검에 따르며, 검수 중인 영역 판정으로 확정한 약점이 아닙니다.` : competition && !competition.priorityAxis ? `${plan.priorities[0].label} 유지 학습을 위한 오늘의 계획입니다. 이 기출에서는 자동 확정할 약점이 없었습니다.` : `${plan.priorities[0].label} 약점에 맞춘 오늘의 계획입니다. 실제 진단 뒤에는 최대 두 약점만 함께 배정합니다.`);
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
    const host = document.getElementById("teacher-grid");
    host.replaceChildren();
    if (document.body.dataset.audience !== "teacher") return;
    text("teacher-pack-state", `${plan.priorities[0].label} · ${plan.materials.clusterId} 수업 세트`);
    const resources = [
      ["학생용 개념", "학생이 먼저 읽는 모델·대표 예제", plan.materials.studentConceptHref, "학생용 개념 열기"],
      ["교사용 지도서", "36문항 전체의 정답·풀이·관찰 포인트", plan.materials.teacherWorkbookHref, "교사용 지도서 열기"],
      ["학생용 워크북", "정답을 분리한 36문항 수업·독립 연습", plan.materials.studentWorkbookHref, "학생용 워크북 열기"],
      ["8문항 재확인", plan.retention.map(function (entry) { return entry.label; }).join(" · "), plan.materials.teacherWorkbookHref.replace("mode=workbook", "mode=recheck"), "재확인 지도서 열기"]
    ];
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
  function renderCompetitionReviewQueue(evidence) {
    const section = document.getElementById("review-queue");
    const list = document.getElementById("review-queue-list");
    list.replaceChildren();
    const queue = evidence && evidence.schemaVersion === "gfield-competition-evidence-v6" && Array.isArray(evidence.reviewQueue) ? evidence.reviewQueue : [];
    section.hidden = queue.length === 0;
    if (!queue.length) return;
    text("review-queue-title", `최초 응시 다시 보기 ${queue.length}문항`);
    text("review-queue-copy", document.body.dataset.audience === "teacher"
      ? "학생 답과 정답은 저장하지 않았습니다. 최초 응시의 풀이 흔적을 확인할 순서이며, 오류 유형이나 약점 영역을 자동 판정한 목록이 아닙니다."
      : "제출한 답과 정답은 저장하지 않았습니다. 최초 응시에서 다시 풀 문항을 찾기 위한 순서이며, 약점 영역을 판정한 목록이 아닙니다.");
    queue.forEach(function (entry) {
      const item = document.createElement("li");
      item.className = `review-item ${entry.outcome}`;
      const number = document.createElement("strong");
      number.textContent = String(entry.questionNumber).padStart(2, "0");
      const detail = document.createElement("span");
      const outcome = entry.outcome === "incorrect" ? "오답" : "미응답";
      const points = entry.pointsEarned < 0 ? `−${Math.abs(entry.pointsEarned)}점` : `${entry.pointsEarned}점`;
      detail.textContent = `${entry.sectionId}영역 · ${outcome} · 득점 ${points}`;
      const boundary = document.createElement("small");
      boundary.textContent = entry.diagnosticEligibility === "review-required"
        ? "문항 검수 필요 · 영역 판정 제외"
        : entry.diagnosticEligibility === "score-only"
          ? "점수만 반영 · 영역 판정 제외"
          : document.body.dataset.audience === "teacher" ? "풀이의 첫 이탈 지점 확인" : "답을 보지 않고 다시 풀기";
      item.append(number, detail, boundary);
      list.append(item);
    });
  }
  function render(plan) {
    const competitionEvidence = linkedCompetitionEvidence();
    const competitionSeries = linkedCompetitionSeries();
    const trend = competitionPrediction(competitionSeries);
    const scoreOutlook = trend && trend.state === "preliminary-real-paper-trend" ? `서로 다른 검증 기출 ${competitionSeries.length}회 기준 다음 70점 시험 예상 범위 ${trend.expectedNextScoreRange[0]}–${trend.expectedNextScoreRange[1]}점 · 신뢰도 낮음. 공식 수상 등급이나 배정 기준이 아닙니다.` : `서로 다른 비교 가능 기출 최초 응시 ${competitionSeries.length}/3회. 3회가 모일 때까지 다음 점수 범위를 표시하지 않습니다. 공식 수상 등급 예측이 아닙니다.`;
    const assessmentEvidence = linkedAssessmentEvidence();
    const grade6Diagnostic = linkedGrade6DiagnosticEvidence();
    const competitionPriorityConfirmed = Boolean(competitionEvidence && competitionEvidence.priorityAxis);
    const competitionLegacy = Boolean(competitionEvidence && ["legacy-unreviewed", "legacy-diagnostic-superseded"].includes(competitionEvidence.diagnosticState));
    const competitionTaxonomyPending = Boolean(competitionEvidence && competitionEvidence.diagnosticState === "taxonomy-review-pending");
    const competitionScoreOnly = competitionLegacy || competitionTaxonomyPending;
    const evidence = grade6Diagnostic || assessmentEvidence || competitionEvidence;
    text("priority-legend", competitionScoreOnly ? "영역 판정 전 직접 선택할 학습 영역" : "현재 가장 먼저 보완할 영역");
    text("teacher-title", competitionScoreOnly ? "선택한 영역을 한 수업 세트로 엽니다." : "한 약점 군을 한 수업 세트로 엽니다.");
    text("goal-program", plan.goal.label);
    text("plan-title", `${plan.calendar.calendarWeeks}주 학습 계획`);
    const scheduleCopy = `${plan.calendar.calendarWeeks}주 동안 주 ${plan.availability.studyDaysPerWeek}일, 하루 ${plan.availability.minutesPerDay}분을 기준으로 설계했습니다. 수업 결석과 복습 여유를 고려해 전체 시간의 80%만 배정합니다.`;
    text("plan-description", grade6Diagnostic ? `${scheduleCopy} 교사 검토가 끝난 Grade 6 42문항 진단의 점수 요약과 우선 약점을 반영했습니다. 학생 응답, 정답, 풀이 원문은 이 계획에 저장하지 않습니다.` : assessmentEvidence ? `${scheduleCopy} ${assessmentEvidence.source.label} 결과와 영역별 약점을 반영해 ${assessmentEvidence.recommendedStart.label}에서 시작하는 G·MAP 진도를 구성했습니다.` : competitionEvidence ? competitionScoreOnly ? `${scheduleCopy} ${competitionEvidence.year} SASMO Grade 6 기출 최초 응시 ${competitionEvidence.score.rawScore} / 70은 점수 이력으로만 연결했습니다. 영역 분류는 재검수 대상이어서 자동 약점 처방에 사용하지 않습니다.` : competitionPriorityConfirmed ? `${scheduleCopy} ${competitionEvidence.year} SASMO Grade 6 기출 최초 응시 ${competitionEvidence.score.rawScore} / 70과 영역별 약점을 반영해 오늘의 우선 학습을 골랐습니다.` : `${scheduleCopy} ${competitionEvidence.year} SASMO Grade 6 기출 최초 응시 ${competitionEvidence.score.rawScore} / 70을 연결했습니다. 충분한 약점 신호가 없어 현재 선택한 영역을 유지 학습으로 구성합니다.` : scheduleCopy);
    text("days-remaining", plural(plan.calendar.daysRemaining, "일", "일"));
    text("study-day-count", plural(plan.calendar.studyDays, "일", "일"));
    text("capacity-minutes", `${plan.calendar.usableMinutes.toLocaleString("ko-KR")}분`);
    const state = document.getElementById("plan-state");
    state.textContent = grade6Diagnostic ? "42문항 진단 연결" : assessmentEvidence ? "학교 평가 연결" : competitionScoreOnly ? "기출 점수 연결" : competitionEvidence ? "기출 진단 연결" : "진단 연결 전";
    state.className = `state-chip ${evidence ? "connected" : "waiting"}`;
    text("prediction-title", grade6Diagnostic ? "42문항 진단이 오늘의 개념과 문제 수로 이어졌습니다." : assessmentEvidence ? "학교 평가 결과가 오늘의 학습에 반영되었습니다." : competitionScoreOnly ? "기출 점수만 학습계획에 연결했습니다." : competitionEvidence ? "검증된 기출 결과가 오늘의 학습에 반영되었습니다." : "예상 성적은 진단 후 계산합니다.");
    text("prediction-copy", grade6Diagnostic ? `${grade6Diagnostic.score.earnedPoints} / ${grade6Diagnostic.score.maxPoints}점 · ${grade6Diagnostic.score.percentage}% · ${grade6Diagnostic.priorities.length ? `우선 보완 ${plan.priorities[0].label}` : "자동 확인된 약점 없음"}. 이 결과는 학교의 공식 배정·승급 판정이나 실전 예상 점수가 아닙니다.` : assessmentEvidence ? `${assessmentEvidence.source.label} · G·MAP 권장 시작 ${assessmentEvidence.recommendedStart.label} · 우선 보완 ${plan.priorities[0].label}. 이는 학교의 공식 배정이 아니며, 실전 예상 점수는 별도의 최초 모의 기록이 쌓인 뒤 계산합니다.` : competitionEvidence ? `실제 점수 ${competitionEvidence.score.rawScore} / 70 · ${competitionScoreOnly ? `영역 판정 재검수 중 · ${plan.priorities[0].label} 학습` : competitionPriorityConfirmed ? `우선 보완 ${plan.priorities[0].label}` : `자동 확정 약점 없음 · ${plan.priorities[0].label} 유지 학습`}. ${scoreOutlook}` : `${plan.diagnostic.actionLabel}의 최초 응시 결과와 이후 실전 모의 기록이 있어야 점수 범위와 신뢰도를 계산합니다.`);
    const diagnosticAction = document.getElementById("diagnostic-action");
    if (grade6Diagnostic) diagnosticAction.href = "./diagnostic.html?runtime=local-qa";
    else if (assessmentEvidence) diagnosticAction.href = "./assessment-entry.html";
    else if (competitionEvidence && privateRuntime) {
      const returnUrl = new URL("./sasmo-real-paper.html", window.location.href);
      returnUrl.search = "";
      returnUrl.searchParams.set("runtime", "local-private");
      returnUrl.searchParams.set("token", privateRuntime.token);
      returnUrl.searchParams.set("audience", document.body.dataset.audience === "teacher" ? "teacher" : "student");
      diagnosticAction.href = returnUrl.href;
    } else diagnosticAction.href = competitionEvidence ? "./sasmo-real-paper.html" : plan.diagnostic.actionHref;
    diagnosticAction.textContent = grade6Diagnostic ? "42문항 진단 결과 다시 보기" : assessmentEvidence ? "학교 평가 결과 다시 보기" : competitionEvidence ? "SASMO 기출 진단 다시 열기" : `${plan.diagnostic.actionLabel} 시작`;
    renderCompetitionReviewQueue(competitionEvidence);
    renderToday(plan);
    renderTeacherPack(plan);
    renderRoadmap(plan);
  }
  function applyAudienceMode() {
    const query = new URLSearchParams(window.location.search);
    const audience = query.get("audience") === "teacher" ? "teacher" : "student";
    const studentLink = document.getElementById("student-workspace-link");
    const teacherLink = document.getElementById("teacher-workspace-link");
    const teacherSection = document.getElementById("teacher-pack");
    const requestedGoal = query.get("goal");
    const goalQuery = requestedGoal && engine.GOALS[requestedGoal] ? `&goal=${encodeURIComponent(requestedGoal)}` : "";
    const runtimeQuery = privateRuntime ? `&runtime=local-private&token=${encodeURIComponent(privateRuntime.token)}` : "";
    document.body.dataset.audience = audience;
    teacherSection.hidden = audience !== "teacher";
    document.getElementById("paper-ox-panel").hidden = audience !== "teacher";
    studentLink.href = `./learning-plan.html?audience=student${goalQuery}${runtimeQuery}`;
    teacherLink.href = `./learning-plan.html?audience=teacher${goalQuery}${runtimeQuery}#teacher-pack`;
    if (audience === "teacher") {
      studentLink.removeAttribute("aria-current");
      teacherLink.setAttribute("aria-current", "page");
    } else {
      studentLink.setAttribute("aria-current", "page");
      teacherLink.removeAttribute("aria-current");
    }
    if (audience === "teacher") {
      text("plan-audience-eyebrow", "TEACHER · G·MAP LESSON PATH");
      document.getElementById("plan-audience-title").innerHTML = '<span class="headline-line">진단 근거로</span><span class="headline-line accent">오늘의 수업을</span><span class="headline-line accent">설계합니다.</span>';
      text("plan-audience-description", "학생의 현재 과정과 약점 유형을 확인하고 수업 시간에 맞춰 강사용 교안, 학생용 워크북, 숙제와 재확인을 한 수업 세트로 구성합니다.");
      text("plan-setup-title", "학생의 수업 조건을 입력하세요.");
      document.querySelector("#plan-form .primary-action").textContent = "학생 수업 계획 계산";
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
  roadmapLocale.addEventListener("change", function () { renderRoadmap(currentPlan); });
  roadmapObservations.addEventListener("change", function () {
    if (Number(roadmapObservations.value) < 2) roadmapRetention.checked = false;
    renderRoadmap(currentPlan);
  });
  roadmapRetention.addEventListener("change", function () { renderRoadmap(currentPlan); });
  targetDate.min = isoDate(1);
  targetDate.value = isoDate(56);
  const requestedLocale = new URLSearchParams(window.location.search).get("locale");
  if (["ko", "en", "zh-Hans"].includes(requestedLocale)) roadmapLocale.value = requestedLocale;
  applyAudienceMode();
  restoreSettings();
  setInitialGoalFromQuery();
  applyAssessmentSchedule();
  render(createPlan());
})();
