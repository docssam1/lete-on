(function () {
  "use strict";
  const session = HIGHSELECT_AUTH.requireSession();
  if (!session) return;
  const attemptId = new URLSearchParams(location.search).get("attempt") || "";
  const root = document.getElementById("report-root");
  const printButton = document.getElementById("report-print");
  let loadVersion = 0;
  const DIFFICULTY_LABELS = Object.freeze({ lowered: "낮춤", standard: "기준", raised: "올림", advanced: "심화" });
  document.getElementById("student-mark").textContent = "나의 학습 결과";

  function esc(value) {
    const span = document.createElement("span");
    span.textContent = String(value == null ? "" : value);
    return span.innerHTML;
  }
  function empty(title, message, retry) {
    printButton.disabled = true;
    root.innerHTML = `<div class="empty"><h2>${esc(title)}</h2><p>${esc(message)}</p>${retry ? '<button id="report-retry" class="button accent">다시 불러오기</button>' : ''}<a class="button" href="./library.html">시험지 서재</a></div>`;
    if (retry) document.getElementById("report-retry").addEventListener("click", load);
  }
  function bars(title, values) {
    const rows = values.map(function (item) {
      return `<div class="bar-row"><span>${esc(item.label)}</span><div class="bar-track"><i class="bar-fill" style="width:${item.rate}%"></i></div><b>${item.rate}%</b></div>`;
    }).join("");
    return `<article class="chart"><h3>${esc(title)}</h3>${rows || '<p class="status">분석할 문항이 없습니다.</p>'}</article>`;
  }
  function difficultyLabel(value) {
    return DIFFICULTY_LABELS[value] || value;
  }
  function localizedDifficultyRows(values) {
    return values.map(function (item) {
      return Object.assign({}, item, { label: difficultyLabel(item.label) });
    });
  }
  function pointsChart(title, values) {
    return `<article class="chart"><h3>${esc(title)}</h3>${values.map(function (row) {
      return `<div class="bar-row"><span>${esc(row.label)}</span><div class="bar-track"><i class="bar-fill" style="width:${row.rate}%"></i></div><b>${row.rate}%</b></div><p class="chart-detail">득점 ${row.earnedPoints} / ${row.totalPoints}점 · 정답 ${row.correctCount} / ${row.questionCount}문항</p>`;
    }).join("")}</article>`;
  }
  function learningPlanSection(plan) {
    const stages = plan.stages.map(function (stage, index) {
      const numberLabel = index === 0 && !plan.priorityNumbers.length && plan.unattemptedNumbers.length ? "먼저 풀 문제" : "복습할 문제";
      return `<article class="learning-stage"><h3>${esc(stage.title)}</h3><p>${esc(stage.message)}</p>${stage.itemNumbers.length ? `<p class="review-numbers">${numberLabel}: ${stage.itemNumbers.join(", ")}번</p>` : ''}</article>`;
    }).join("");
    const goal = plan.stages[0].targetScore;
    const values = [{ label: "현재 점수", value: plan.score }];
    if (plan.priorityNumbers.length && goal != null) values.push({ label: "선택한 오답을 모두 해결하면", value: goal });
    const notice = plan.priorityNumbers.length ? "배점이 낮은 오답부터 최대 3문제를 골라 시작합니다. 낮은 배점이 쉬운 문제라는 뜻은 아닙니다."
      : plan.unattemptedNumbers.length ? "미응시 문항은 오답 처방에 넣지 않았습니다. 먼저 풀어 본 뒤 다시 진단하세요."
        : "이번 결과에는 다시 풀 오답이 없습니다. 풀이 과정을 설명하며 확인하세요.";
    const chartNote = plan.priorityNumbers.length
      ? `같은 눈금: 0~${plan.totalPoints}점. 선택한 오답만 바로잡았을 때의 계산이며 다음 시험 점수의 예측이 아닙니다. 현재 성적은 바뀌지 않습니다.`
      : plan.unattemptedNumbers.length ? "미응시 문항은 아직 채점하지 않아 회복 점수를 예상하지 않습니다. 먼저 풀어 본 뒤 확인하세요."
        : "이번 시험에서 다시 풀 오답은 없습니다. 현재 성적은 바뀌지 않습니다.";
    return `<section class="panel learning-plan"><h2>나의 3단계 학습 계획</h2><p class="notice">${notice}</p><div class="learning-stages">${stages}</div><div class="goal-chart"><h3>이번 시험에서 되찾아 볼 점수</h3>${values.map(function (row) { return `<div class="goal-row"><span>${esc(row.label)}</span><div class="bar-track"><i class="bar-fill" style="width:${Math.round(row.value / plan.totalPoints * 1000) / 10}%"></i></div><b>${row.value} / ${plan.totalPoints}점</b></div>`; }).join("")}<p class="chart-detail">${chartNote}</p></div></section>`;
  }
  function evidenceText(comment) {
    const parts = [];
    const evidence = comment.evidence;
    if (evidence.itemNumbers) parts.push(`문항 ${evidence.itemNumbers.join(", ")}번`);
    if (evidence.aggregate) {
      const row = evidence.aggregate;
      parts.push(`${row.label} · ${row.correctCount}/${row.questionCount}문항 · 맞힌 문항 비율 ${row.rate}%`);
      if (row.selectionBasis === "earned-points") parts.push(`배점으로 비교 · 득점 ${row.earnedPoints}/${row.totalPoints}점 (${row.earnedRate}%)`);
    }
    if (evidence.comparison) {
      if (evidence.comparison.category === "score-delta") parts.push(`직전 ${evidence.comparison.previousScore}점 → 최근 ${evidence.comparison.currentScore}점`);
      else parts.push(`${evidence.comparison.category} · ${evidence.comparison.itemNumbers.join(", ")}번`);
    }
    return parts.join(" / ");
  }
  function commentList(comments) {
    return `<ul class="report-comments-list">${comments.map(function (comment) {
      return `<li><b>${esc(comment.title)}</b><p>${esc(comment.text)}</p><small>근거: ${esc(evidenceText(comment))}</small></li>`;
    }).join("")}</ul>`;
  }
  function roundGroup(title, numbers) {
    if (!numbers.length) return "";
    return `<div><b>${esc(title)} ${numbers.length}문항</b><p style="margin:4px 0 0">${numbers.join(", ")}번</p></div>`;
  }
  function cutlineSection(cutline) {
    if (!cutline.available) return `<section class="panel cutline-panel"><p class="eyebrow">판정 기준</p><h2>커트라인 판정</h2><p class="notice">${esc(cutline.message)}</p></section>`;
    let detail = "";
    if (cutline.kind === "level-score") {
      detail = `<p>점수 ${cutline.score}/${cutline.totalPoints}${cutline.threshold == null ? "" : ` · 적용 기준 ${cutline.threshold}점 이상`}</p>`;
    } else {
      detail = `<p>전체 정답 ${cutline.correctCount}/${cutline.denominator} · 승인 기준 ${cutline.minimum}문항 이상${cutline.reviewFrom == null ? "" : ` · 검토 구간 ${cutline.reviewFrom}문항부터`}</p>`;
    }
    const sections = cutline.sections ? `<table class="data-table"><thead><tr><th>영역</th><th>정답</th><th>영역 기준</th><th>판정</th></tr></thead><tbody>${cutline.sections.map(function (section) {
      return `<tr><td>${esc(section.sectionId)}</td><td>${section.correctCount}/${section.questionCount}</td><td>${section.minimum}문항 이상</td><td>${section.passed ? "충족" : "미충족"}</td></tr>`;
    }).join("")}</tbody></table>` : "";
    return `<section class="panel cutline-panel"><p class="eyebrow">승인된 판정 기준</p><h2>커트라인 판정 · ${esc(cutline.message)}</h2>${detail}${sections}</section>`;
  }
  function aggregateItems(items, labelFor) {
    const groups = new Map();
    items.forEach(function (item) {
      const label = labelFor(item);
      if (!label) return;
      const row = groups.get(label) || { label, correctCount: 0, questionCount: 0, rate: 0 };
      row.questionCount += 1;
      if (item.state === "correct") row.correctCount += 1;
      row.rate = Math.round(row.correctCount / row.questionCount * 100);
      groups.set(label, row);
    });
    return Array.from(groups.values());
  }
  function curriculumAxes(items) {
    function parts(item) { return String(item.gradeSemesterUnit || "").split(" · ").map(function (value) { return value.trim(); }).filter(Boolean); }
    return {
      gradeTerm: aggregateItems(items, function (item) { const value = parts(item); return value.slice(0, 2).join(" · "); }),
      unit: aggregateItems(items, function (item) { const value = parts(item); return value.slice(2).join(" · "); })
    };
  }
  function evaluationSection(report) {
    const exam = HIGHSELECT_CATALOG.exams.find(function (item) { return item.id === report.examId; });
    const resolved = exam && HIGHSELECT_ACADEMY_EVALUATION_PROFILES.resolve(report.examId, exam.programId);
    if (!resolved) return "";
    const profile = resolved.profile;
    const variant = resolved.exam;
    document.body.dataset.program = profile.programId;
    const badges = [
      variant ? variant.paperVariant : profile.displayName,
      variant ? variant.scope : profile.paperStyle,
      variant ? variant.duration : profile.defaultDuration
    ].map(function (value) { return `<span>${esc(value)}</span>`; }).join("");
    const criteria = profile.evaluationCriteria.map(function (value) { return `<li>${esc(value)}</li>`; }).join("");
    const axes = profile.primaryAxes.map(function (value) { return `<span>${esc(value)}</span>`; }).join("");
    return `<section class="panel academy-evaluation"><header><div><p class="eyebrow">학원별 평가 프로필</p><h2>${esc(profile.reportTitle)}</h2></div><b>${esc(profile.displayName)}</b></header><div class="evaluation-badges">${badges}</div><p>${esc(profile.paperStyle)} · ${esc(profile.difficultyFlow)}</p><div class="evaluation-axes">${axes}</div><ol>${criteria}</ol><p class="notice">${esc(profile.decisionPolicy)}</p></section>`;
  }
  function render(report) {
    const plan = HIGHSELECT_REPORT_LEARNING_PLAN.buildPlan(report);
    const priority = new Set(plan.priorityNumbers);
    document.getElementById("title").textContent = report.examTitle;
    const learnerLabel = report.displayName ? `${report.displayName} 학생` : "나의 성적표";
    document.getElementById("student-mark").textContent = learnerLabel;
    document.getElementById("meta").textContent = `${learnerLabel} · ${new Date(report.submittedAt).toLocaleString("ko-KR")} · 검증 채점`;
    function resultMark(item) {
      return item.state === "correct" ? { symbol: "○", label: "정답" }
        : item.state === "wrong" ? { symbol: "×", label: "오답" } : { symbol: "—", label: "미응시" };
    }
    const dots = report.items.map(function (item) {
      const mark = resultMark(item);
      return `<span class="item-dot ${item.state}" title="${item.number}번 ${mark.label}" aria-label="${item.number}번 ${mark.label}"><small>${item.number}</small><b aria-hidden="true">${mark.symbol}</b></span>`;
    }).join("");
    const rows = report.items.map(function (item) {
      const mark = resultMark(item);
      return `<tr class="${priority.has(item.number) ? "review-first" : ""}"><td data-label="문항">${item.number}번${priority.has(item.number) ? '<span class="priority-mark">★ 먼저 다시 풀기</span>' : ''}</td><td data-label="결과"><b title="${mark.label}">${mark.symbol}</b></td><td data-label="득점 / 배점">${item.state === "correct" ? item.points : 0} / ${item.points}</td><td data-label="문항 정답률">미등록</td><td data-label="영역">${esc(item.domain)}</td><td data-label="학년·학기·단원">${esc(item.gradeSemesterUnit)}</td><td data-label="세부 유형">${esc(item.detailType)}</td><td data-label="난이도">${esc(difficultyLabel(item.difficulty))}</td></tr>`;
    }).join("");
    const weak = report.weakPriorities.map(function (item, index) {
      return `<li><b>${index + 1}. ${esc(item.label)}</b><span>${esc(item.reason)}</span><small>근거: ${item.evidence.join(", ")}번 오답 · 정답률 ${item.rate}% (${item.correctCount}/${item.questionCount})</small></li>`;
    }).join("");
    const learningComments = report.comments.filter(function (comment) { return comment.type !== "item-prescription" && comment.type !== "round-comparison"; });
    const commentsSection = `<section class="panel report-comments"><p class="eyebrow">근거 있는 코멘트</p><h2>지금 먼저 보완할 내용</h2>${commentList(learningComments)}</section>`;
    const prescriptions = report.comments.filter(function (comment) { return comment.type === "item-prescription"; });
    const prescriptionRows = prescriptions.map(function (comment) {
      const setState = comment.similarProblemSet ? "연습 세트가 연결되어 있습니다. 문항별 3문제의 준비 상태는 선생님에게 확인해 주세요." : "연습할 3문제를 준비 중입니다.";
      return `<tr><td>${comment.evidence.itemNumbers.join(", ")}번</td><td><b>${esc(comment.title)}</b><br>${esc(comment.text)}</td><td>${setState}</td></tr>`;
    }).join("");
    const comparisonComments = report.comments.filter(function (comment) { return comment.type === "round-comparison"; });
    const comparison = report.previousAttempt;
    const comparisonSection = comparison ? `<section class="panel round-comparison"><h2>응시 기록 · 회차 비교</h2><p><b>점수 변화</b> · ${comparison.score}점 → ${report.score}점 (${comparison.scoreDelta > 0 ? "+" : ""}${comparison.scoreDelta}점)</p><div class="analysis-grid">${roundGroup("흔들린 문항", comparison.groups.shaky)}${roundGroup("미해결 문항", comparison.groups.unresolved)}${roundGroup("해결된 문항", comparison.groups.resolved)}${roundGroup("유지 문항", comparison.groups.stable)}${roundGroup("이번 회차 미응시", comparison.groups.not_attempted)}${roundGroup("새로 응시한 문항", comparison.groups.newly_attempted)}</div>${commentList(comparisonComments)}</section>` : "";
    const axes = curriculumAxes(report.items);
    root.innerHTML = `<section class="diagnostic-cover"><article class="panel diagnostic-overview"><header><div><p class="eyebrow">진단 요약</p><h2>총점과 문항별 결과</h2></div><span class="report-stamp">${report.questionCount}문항</span></header><div class="overview-score"><div class="score-card"><span>총점</span><strong>${report.score}<small> / ${report.totalPoints}</small></strong><div class="score-facts"><b>맞힌 문항 비율 ${report.accuracy}%</b><b>정답 ${report.correctCount}</b><b>오답 ${report.wrongCount}</b><b>미응시 ${report.blankCount}</b></div></div><div class="overview-items"><h3>문항별 ○/×/—</h3><div class="item-results">${dots}</div></div></div></article></section>
      ${evaluationSection(report)}
      <section class="weighted-results"><h2>영역별 수행률 · 배점 기준</h2><p>개인 득점률은 얻은 점수를 해당 영역의 배점으로 나눈 값입니다.</p>${pointsChart("영역별 득점률", plan.byDomain)}</section>
      <section class="point-band-results"><h2>배점대별 학습 결과</h2>${pointsChart("배점대별 득점률", plan.byPoints)}</section>
      <section class="panel item-detail"><h2>문항별 진단</h2><p class="chart-detail">○ 정답 · × 오답 · — 미응시입니다. 미응시는 오답 유형에 포함하지 않습니다. 문항 정답률은 확인된 자료가 없어 미등록으로 표시합니다.</p><div class="table-scroll" tabindex="0" role="region" aria-label="문항별 진단 표"><table class="data-table diagnostic-items"><colgroup><col style="width:11%"><col style="width:5%"><col style="width:8%"><col style="width:10%"><col style="width:8%"><col style="width:22%"><col style="width:28%"><col style="width:8%"></colgroup><thead><tr><th scope="col">문항</th><th scope="col">결과</th><th scope="col">득점 / 배점</th><th scope="col">문항 정답률</th><th scope="col">영역</th><th scope="col">학년·학기·단원</th><th scope="col">세부 유형</th><th scope="col">난이도</th></tr></thead><tbody>${rows}</tbody></table></div></section>
      ${learningPlanSection(plan)}
      <section class="panel additional-axes"><h2>다른 기준으로 살펴보기</h2><p class="chart-detail">아래 수행률은 배점이 아닌 맞힌 문항 수의 비율이며 미응시 문항도 분모에 포함합니다. 미응시만으로 약점을 단정하지 않습니다.</p><div class="analysis-grid axis-grid">${bars("학년·학기별 수행률", axes.gradeTerm)}${bars("단원별 수행률", axes.unit)}${bars("세부 유형별 수행률", report.byType)}${bars("난이도별 수행률", localizedDifficultyRows(report.byDifficulty))}</div></section>
      ${cutlineSection(report.cutline)}${commentsSection}<section class="panel priority-panel"><h2>취약 유형 우선순위</h2>${weak ? `<ol class="priority-list">${weak}</ol>` : '<p class="status ok">확인된 취약 우선순위가 없습니다.</p>'}</section><section class="panel prescription-panel"><h2>오답 문항 처방</h2><p class="status">연습 문제의 준비가 끝나면 배정된 학습으로 이어집니다.</p><div class="table-scroll" tabindex="0" role="region" aria-label="오답 문항 처방 표"><table class="data-table"><thead><tr><th>문항</th><th>다시 공부할 내용</th><th>연습 문제 준비</th></tr></thead><tbody>${prescriptionRows || `<tr><td colspan="3">${report.blankCount ? `미응시 ${report.blankCount}문항은 먼저 풀어 본 뒤 판단합니다.` : '이번 시험에는 오답이 없습니다.'}</td></tr>`}</tbody></table></div></section>${comparisonSection}`;
  }
  async function load() {
    const version = ++loadVersion;
    printButton.disabled = true;
    document.getElementById("student-mark").textContent = "나의 학습 결과";
    document.getElementById("title").textContent = "분석 결과";
    document.getElementById("meta").textContent = "성적을 확인하고 있습니다.";
    root.innerHTML = '<p class="status" role="status">성적표를 불러오고 있습니다.</p>';
    root.setAttribute("aria-busy", "true");
    const api = String(HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
    if (!attemptId) { root.setAttribute("aria-busy", "false"); empty("분석 결과를 지정해 주세요", "성적표 주소를 확인해 주세요."); return; }
    if (!api) { root.setAttribute("aria-busy", "false"); empty("분석지를 열 수 없습니다", "성적을 확인하는 서버가 연결되지 않았습니다."); return; }
    try {
      const response = await fetch(`${api}/attempts/${encodeURIComponent(attemptId)}/report`, HIGHSELECT_REPORT_SECURITY.requestOptions());
      const data = await response.json().catch(function () { return {}; });
      if (version !== loadVersion) return;
      if (response.status === 404) { empty("성적표가 아직 등록되지 않았습니다", "선생님에게 성적 등록 여부를 확인해 주세요.", true); return; }
      if (!response.ok) throw new Error(data.message || "분석지를 불러오지 못했습니다.");
      const current = HIGHSELECT_AUTH.read();
      if (!current || current.studentId !== session.studentId) throw new Error("로그인 정보를 다시 확인해 주세요.");
      HIGHSELECT_REPORT_SECURITY.validateNoStoreResponse(response);
      render(HIGHSELECT_REPORT_SECURITY.validateReport(data, {
        attemptId,
        session,
        catalog: HIGHSELECT_CATALOG,
        cutlinePolicies: HIGHSELECT_CUTLINE_POLICIES
      }));
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      if (version === loadVersion) printButton.disabled = false;
    } catch (error) {
      if (version === loadVersion) empty("분석지를 불러오지 못했습니다", error.message, true);
    } finally {
      if (version === loadVersion) root.setAttribute("aria-busy", "false");
    }
  }
  load();
})();
