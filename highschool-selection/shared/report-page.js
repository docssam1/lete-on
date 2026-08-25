(function () {
  "use strict";
  const session = HIGHSELECT_AUTH.requireSession();
  if (!session) return;
  const attemptId = new URLSearchParams(location.search).get("attempt") || "";
  const root = document.getElementById("report-root");
  const DIFFICULTY_LABELS = Object.freeze({ lowered: "낮춤", standard: "기준", raised: "올림" });
  document.getElementById("student-mark").textContent = `${session.name} 학생`;

  function esc(value) {
    const span = document.createElement("span");
    span.textContent = String(value == null ? "" : value);
    return span.innerHTML;
  }
  function empty(title, message) {
    root.innerHTML = `<div class="empty"><h2>${esc(title)}</h2><p>${esc(message)}</p><a class="button accent" href="./library.html">시험지 서재</a></div>`;
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
  function evidenceText(comment) {
    const parts = [];
    const evidence = comment.evidence;
    if (evidence.itemNumbers) parts.push(`문항 ${evidence.itemNumbers.join(", ")}번`);
    if (evidence.aggregate) parts.push(`${evidence.aggregate.label} · ${evidence.aggregate.correctCount}/${evidence.aggregate.questionCount} · ${evidence.aggregate.rate}%`);
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
    document.getElementById("title").textContent = report.examTitle;
    document.getElementById("meta").textContent = `${session.name} 학생 · ${new Date(report.submittedAt).toLocaleString("ko-KR")} · 검증 채점`;
    const dots = report.items.map(function (item) {
      const mark = item.state === "correct" ? "○" : "×";
      return `<span class="item-dot ${item.state}" title="${item.number}번 ${mark}" aria-label="${item.number}번 ${mark}"><small>${item.number}</small><b aria-hidden="true">${mark}</b></span>`;
    }).join("");
    const rows = report.items.map(function (item) {
      const mark = item.state === "correct" ? "○" : "×";
      return `<tr><td>${item.number}</td><td><b>${mark}</b></td><td>${item.points}</td><td>${esc(item.domain)}</td><td>${esc(item.gradeSemesterUnit)}</td><td>${esc(item.detailType)}</td><td>${esc(difficultyLabel(item.difficulty))}</td></tr>`;
    }).join("");
    const weak = report.weakPriorities.map(function (item, index) {
      return `<li><b>${index + 1}. ${esc(item.label)}</b><span>${esc(item.reason)}</span><small>근거: ${item.evidence.join(", ")}번 오답 · 정답률 ${item.rate}% (${item.correctCount}/${item.questionCount})</small></li>`;
    }).join("");
    const learningComments = report.comments.filter(function (comment) { return comment.type !== "item-prescription" && comment.type !== "round-comparison"; });
    const commentsSection = `<section class="panel report-comments"><p class="eyebrow">근거 있는 코멘트</p><h2>지금 먼저 보완할 내용</h2>${commentList(learningComments)}</section>`;
    const prescriptions = report.comments.filter(function (comment) { return comment.type === "item-prescription"; });
    const prescriptionRows = prescriptions.map(function (comment) {
      const setState = comment.similarProblemSet ? `승인 세트 연결됨 · ${esc(comment.similarProblemSet.setId)}` : "승인 세트 연결 없음";
      return `<tr><td>${comment.evidence.itemNumbers.join(", ")}번</td><td><b>${esc(comment.title)}</b><br>${esc(comment.text)}</td><td>${setState}</td></tr>`;
    }).join("");
    const comparisonComments = report.comments.filter(function (comment) { return comment.type === "round-comparison"; });
    const comparison = report.previousAttempt;
    const comparisonSection = comparison ? `<section class="panel round-comparison"><h2>응시 기록 · 회차 비교</h2><p><b>점수 변화</b> · ${comparison.score}점 → ${report.score}점 (${comparison.scoreDelta > 0 ? "+" : ""}${comparison.scoreDelta}점)</p><div class="analysis-grid">${roundGroup("흔들린 문항", comparison.groups.shaky)}${roundGroup("미해결 문항", comparison.groups.unresolved)}${roundGroup("해결된 문항", comparison.groups.resolved)}${roundGroup("유지 문항", comparison.groups.stable)}</div>${commentList(comparisonComments)}</section>` : "";
    const axes = curriculumAxes(report.items);
    root.innerHTML = `<section class="diagnostic-cover"><article class="panel diagnostic-overview"><header><div><p class="eyebrow">진단 요약</p><h2>총점과 문항별 결과</h2></div><span class="report-stamp">${report.questionCount} ITEMS</span></header><div class="overview-score"><div class="score-card"><span>총점</span><strong>${report.score}<small> / ${report.totalPoints}</small></strong><div class="score-facts"><b>정답률 ${report.accuracy}%</b><b>정답 ${report.correctCount}/${report.questionCount}</b></div></div><div class="overview-items"><h3>문항별 ○/×</h3><div class="item-results">${dots}</div></div></div></article></section>${evaluationSection(report)}<section class="analysis-grid axis-grid">${bars("영역별 수행률", report.byDomain)}${bars("학년·학기별 수행률", axes.gradeTerm)}${bars("단원별 수행률", axes.unit)}${bars("세부 유형별 수행률", report.byType)}${bars("난이도별 수행률", localizedDifficultyRows(report.byDifficulty))}</section>${cutlineSection(report.cutline)}${commentsSection}<section class="panel priority-panel"><h2>취약 유형 우선순위</h2>${weak ? `<ol class="priority-list">${weak}</ol>` : '<p class="status ok">확인된 취약 우선순위가 없습니다.</p>'}</section><section class="panel prescription-panel"><h2>오답 문항 처방</h2><p class="status">승인된 유사문제 세트의 연결 상태만 표시합니다.</p><div class="table-scroll"><table class="data-table"><thead><tr><th>문항</th><th>처방</th><th>유사문제 세트</th></tr></thead><tbody>${prescriptionRows}</tbody></table></div></section>${comparisonSection}<section class="panel item-detail auxiliary-results"><h2>문항별 진단 근거</h2><div class="table-scroll"><table class="data-table"><thead><tr><th>문항</th><th>○/×</th><th>배점</th><th>영역</th><th>학년·학기·단원</th><th>세부 유형</th><th>난이도</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  async function load() {
    const api = String(HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
    if (!attemptId) { empty("분석 결과를 지정해 주세요", "제출 결과 식별자가 없는 주소에서는 분석지를 열 수 없습니다."); return; }
    if (!api) { empty("분석지를 열 수 없습니다", "권한을 다시 확인하는 운영 서버가 연결되지 않았습니다."); return; }
    try {
      const response = await fetch(`${api}/attempts/${encodeURIComponent(attemptId)}/report`, HIGHSELECT_REPORT_SECURITY.requestOptions());
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(data.message || "분석지를 불러오지 못했습니다.");
      HIGHSELECT_REPORT_SECURITY.validateNoStoreResponse(response);
      render(HIGHSELECT_REPORT_SECURITY.validateReport(data, {
        attemptId,
        session,
        catalog: HIGHSELECT_CATALOG,
        cutlinePolicies: HIGHSELECT_CUTLINE_POLICIES
      }));
    } catch (error) {
      empty("분석지를 불러오지 못했습니다", error.message);
    }
  }
  load();
})();
