(function (root) {
  "use strict";

  const STATES = new Set(["correct", "wrong"]);
  const DIFFICULTIES = new Set(["lowered", "standard", "raised"]);
  const COMMENT_TYPES = new Set([
    "summary", "strength", "weakness", "domain-specific", "item-prescription", "next-action", "round-comparison"
  ]);
  const DIMENSIONS = {
    overall: "overall",
    domain: "domain",
    gradeSemesterUnit: "gradeSemesterUnit",
    termUnit: "gradeSemesterUnit",
    detailType: "detailType",
    type: "detailType",
    difficulty: "difficulty"
  };
  const PRIVATE_KEYS = new Set([
    "answer", "answers", "answerspec", "correctanswer", "answerkey", "solution", "explanation",
    "approvalcode", "approvalcodehash", "response", "responsevalue", "studentname", "email", "phone",
    "sourcepath", "sourcelocator", "storagepath", "bucket", "pdfurl", "pageurl", "video", "videourl"
  ]);
  const FORBIDDEN_MEDIA_TERMS = ["\uc601\uc0c1", "\uac15\uc758", "\uc720\ud29c\ube0c", "youtube", "youtu.be"];

  function fail(message) { throw new Error(message); }
  function own(object, key) { return Object.prototype.hasOwnProperty.call(object || {}, key); }
  function text(value, label, maxLength) {
    const result = String(value == null ? "" : value).trim();
    if (!result || result.length > (maxLength || 160)) fail(`${label} 정보가 올바르지 않습니다.`);
    return result;
  }
  function number(value, label) {
    const result = Number(value);
    if (!Number.isFinite(result)) fail(`${label} 값이 올바르지 않습니다.`);
    return result;
  }
  function sameNumber(left, right) { return Math.abs(Number(left) - Number(right)) < 0.000001; }
  function percentage(correct, total) { return total ? Math.round((correct / total) * 1000) / 10 : 0; }
  function normalizeKey(key) { return String(key).replace(/[-_]/g, "").toLowerCase(); }

  function assertPublicOnly(value, seen) {
    if (typeof value === "string") {
      FORBIDDEN_MEDIA_TERMS.forEach(function (term) {
        if (value.toLowerCase().includes(term)) fail("분석지에 연결할 수 없는 콘텐츠가 포함되어 있습니다.");
      });
      return;
    }
    if (!value || typeof value !== "object") return;
    const visited = seen || new Set();
    if (visited.has(value)) fail("분석지 응답 구조가 올바르지 않습니다.");
    visited.add(value);
    Object.keys(value).forEach(function (key) {
      const normalizedKey = normalizeKey(key);
      if (PRIVATE_KEYS.has(normalizedKey) || /^answer(?:image|data|value)/.test(normalizedKey) || /^video/.test(normalizedKey)) {
        fail("분석지 응답에 비공개 정보가 포함되어 있습니다.");
      }
      assertPublicOnly(value[key], visited);
    });
    visited.delete(value);
  }

  function requestOptions() {
    return {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    };
  }

  function validateNoStoreResponse(response) {
    if (!response || !response.headers || typeof response.headers.get !== "function") fail("분석지 서버 응답을 확인할 수 없습니다.");
    const policy = String(response.headers.get("Cache-Control") || "").toLowerCase();
    if (!/(?:^|,)\s*no-store(?:\s*(?:,|$))/.test(policy)) fail("분석지 서버의 비저장 정책을 확인할 수 없습니다.");
    return true;
  }

  function findExam(context, examId) {
    const exams = context && Array.isArray(context.exams)
      ? context.exams
      : context && context.catalog && Array.isArray(context.catalog.exams) ? context.catalog.exams : [];
    const exam = exams.find(function (item) { return item && item.id === examId; });
    if (!exam) fail("분석지의 시험 정보를 확인할 수 없습니다.");
    if (exam.releaseStatus !== "released" || exam.answerStatus !== "verified" || exam.classificationStatus !== "verified") {
      fail("답안과 문항 분류 검수가 완료되지 않은 시험입니다.");
    }
    return exam;
  }

  function evidence(value) {
    const list = Array.isArray(value) ? value : [value];
    if (!list.length) fail("문항 분류 근거가 없습니다.");
    return list.map(function (item) { return text(item, "문항 분류 근거", 240); });
  }

  function validateItem(item, index) {
    if (!item || typeof item !== "object" || item.number !== index + 1) fail("분석지 문항 번호가 정확하지 않습니다.");
    if (!STATES.has(item.state)) fail(`${index + 1}번 문항의 채점 상태가 올바르지 않습니다.`);
    const points = number(item.points, `${index + 1}번 배점`);
    if (points <= 0) fail(`${index + 1}번 배점이 올바르지 않습니다.`);
    if (item.reviewStatus !== "verified" && item.classificationStatus !== "verified" && item.classificationVerified !== true) {
      fail(`${index + 1}번 문항 분류가 검증되지 않았습니다.`);
    }
    const gradeBand = text(item.gradeBand, `${index + 1}번 학년`, 60);
    const semester = text(item.semester, `${index + 1}번 학기`, 60);
    const majorUnit = text(item.majorUnit, `${index + 1}번 대단원`, 100);
    const minorUnit = text(item.minorUnit, `${index + 1}번 소단원`, 100);
    const difficulty = text(item.difficulty, `${index + 1}번 난이도`, 20);
    if (!DIFFICULTIES.has(difficulty)) fail(`${index + 1}번 난이도가 올바르지 않습니다.`);
    return {
      number: item.number,
      state: item.state,
      points,
      domain: text(item.domain, `${index + 1}번 영역`, 100),
      gradeBand,
      semester,
      majorUnit,
      minorUnit,
      gradeSemesterUnit: [gradeBand, semester, majorUnit, minorUnit].join(" · "),
      detailType: text(item.detailType, `${index + 1}번 세부 유형`, 120),
      difficulty,
      cutlineSectionId: item.cutlineSectionId == null ? null : text(item.cutlineSectionId, `${index + 1}번 커트라인 영역`, 80),
      classificationEvidence: evidence(item.classificationEvidence)
    };
  }

  function aggregate(items, property) {
    const groups = new Map();
    items.forEach(function (item) {
      const label = item[property];
      if (!groups.has(label)) groups.set(label, { label, correctCount: 0, questionCount: 0, wrongNumbers: [] });
      const group = groups.get(label);
      group.questionCount += 1;
      if (item.state === "correct") group.correctCount += 1;
      else group.wrongNumbers.push(item.number);
    });
    return Array.from(groups.values(), function (group) {
      return Object.assign(group, { rate: percentage(group.correctCount, group.questionCount) });
    });
  }

  function overallAggregate(items, correctCount, score, totalPoints) {
    return [{
      label: "전체",
      correctCount,
      questionCount: items.length,
      wrongNumbers: items.filter(function (item) { return item.state === "wrong"; }).map(function (item) { return item.number; }),
      rate: percentage(correctCount, items.length),
      score,
      totalPoints
    }];
  }

  function validateProvidedAggregate(provided, computed, label) {
    if (!own(provided, label)) return;
    const rows = provided[label];
    if (!Array.isArray(rows) || rows.length !== computed.length) fail("서버 분석 합계가 문항 결과와 일치하지 않습니다.");
    const expected = new Map(computed.map(function (row) { return [row.label, row]; }));
    const seen = new Set();
    rows.forEach(function (row) {
      if (!row || typeof row !== "object" || seen.has(row.label) || !expected.has(row.label)) fail("서버 분석 분류가 문항 결과와 일치하지 않습니다.");
      seen.add(row.label);
      const match = expected.get(row.label);
      if (!sameNumber(row.rate, match.rate)) fail("서버 분석 정답률이 문항 결과와 일치하지 않습니다.");
      if (own(row, "correctCount") && row.correctCount !== match.correctCount) fail("서버 분석 정답 수가 문항 결과와 일치하지 않습니다.");
      if (own(row, "questionCount") && row.questionCount !== match.questionCount) fail("서버 분석 문항 수가 문항 결과와 일치하지 않습니다.");
    });
  }

  function priorityEvidenceNumbers(value) {
    if (!Array.isArray(value) || !value.length) fail("취약 우선순위의 문항 근거가 없습니다.");
    const numbers = value.map(function (item) {
      const result = typeof item === "number" ? item : item && item.number;
      if (!Number.isInteger(result) || result < 1) fail("취약 우선순위의 문항 근거가 올바르지 않습니다.");
      return result;
    });
    if (new Set(numbers).size !== numbers.length) fail("취약 우선순위의 문항 근거가 중복되었습니다.");
    return numbers.sort(function (a, b) { return a - b; });
  }

  function validatePriorities(priorities, aggregates, wrongCount) {
    if (!Array.isArray(priorities) || priorities.length > 3 || (wrongCount && !priorities.length) || (!wrongCount && priorities.length)) {
      fail("취약 우선순위 구성이 올바르지 않습니다.");
    }
    const seen = new Set();
    return priorities.map(function (priority) {
      if (!priority || typeof priority !== "object") fail("취약 우선순위가 올바르지 않습니다.");
      const dimension = DIMENSIONS[priority.dimension];
      const label = text(priority.label, "취약 유형", 120);
      const key = `${dimension}:${label}`;
      if (!dimension || seen.has(key)) fail("취약 우선순위 분류가 올바르지 않습니다.");
      seen.add(key);
      const group = (aggregates[dimension] || []).find(function (row) { return row.label === label; });
      if (!group || !group.wrongNumbers.length) fail("취약 우선순위가 오답 문항과 일치하지 않습니다.");
      const numbers = priorityEvidenceNumbers(priority.evidence);
      if (numbers.join(",") !== group.wrongNumbers.join(",")) fail("취약 우선순위의 근거가 오답 문항과 일치하지 않습니다.");
      return {
        dimension,
        label,
        reason: text(priority.reason, "취약 우선순위 설명", 300),
        evidence: numbers,
        rate: group.rate,
        correctCount: group.correctCount,
        questionCount: group.questionCount
      };
    });
  }

  function exactNumbers(value, label) {
    if (!Array.isArray(value) || !value.length) fail(`${label} 문항 근거가 없습니다.`);
    const numbers = value.map(function (item) {
      if (!Number.isInteger(item) || item < 1) fail(`${label} 문항 근거가 올바르지 않습니다.`);
      return item;
    }).sort(function (a, b) { return a - b; });
    if (new Set(numbers).size !== numbers.length) fail(`${label} 문항 근거가 중복되었습니다.`);
    return numbers;
  }

  function validatePreviousAttempt(previous, context, items, totalPoints) {
    if (previous == null) return null;
    if (!previous || typeof previous !== "object") fail("직전 회차 정보가 올바르지 않습니다.");
    const attemptId = text(previous.attemptId, "직전 회차", 200);
    if (attemptId === context.attemptId || /[/\\?#\s]/.test(attemptId)) fail("직전 회차 식별자가 올바르지 않습니다.");
    if (previous.studentId !== context.studentId || previous.examId !== context.examId) fail("직전 회차의 학생 또는 시험이 일치하지 않습니다.");
    const submittedAt = text(previous.submittedAt, "직전 회차 제출 시각", 80);
    if (!Number.isFinite(Date.parse(submittedAt)) || Date.parse(submittedAt) >= Date.parse(context.submittedAt)) fail("직전 회차 제출 시각이 올바르지 않습니다.");
    const previousItems = Array.isArray(previous.items) ? previous.items : [];
    if (previousItems.length !== items.length) fail("직전 회차 문항 수가 일치하지 않습니다.");
    const normalizedItems = previousItems.map(function (item, index) {
      if (!item || item.number !== index + 1 || !STATES.has(item.state)) fail("직전 회차 문항 결과가 올바르지 않습니다.");
      return { number: item.number, state: item.state };
    });
    const correctCount = normalizedItems.filter(function (item) { return item.state === "correct"; }).length;
    const score = normalizedItems.reduce(function (sum, item, index) {
      return sum + (item.state === "correct" ? items[index].points : 0);
    }, 0);
    const accuracy = percentage(correctCount, normalizedItems.length);
    if (previous.questionCount !== normalizedItems.length || previous.correctCount !== correctCount ||
        !sameNumber(previous.totalPoints, totalPoints) || !sameNumber(previous.score, score) || !sameNumber(previous.accuracy, accuracy)) {
      fail("직전 회차 합계가 문항 결과와 일치하지 않습니다.");
    }
    const groups = { shaky: [], unresolved: [], resolved: [], stable: [] };
    normalizedItems.forEach(function (previousItem, index) {
      const currentItem = items[index];
      if (previousItem.state === "correct" && currentItem.state === "wrong") groups.shaky.push(currentItem.number);
      else if (previousItem.state === "wrong" && currentItem.state === "wrong") groups.unresolved.push(currentItem.number);
      else if (previousItem.state === "wrong" && currentItem.state === "correct") groups.resolved.push(currentItem.number);
      else groups.stable.push(currentItem.number);
    });
    return {
      attemptId,
      submittedAt,
      questionCount: normalizedItems.length,
      correctCount,
      totalPoints,
      score,
      accuracy,
      scoreDelta: Math.round((context.score - score) * 1000) / 1000,
      items: normalizedItems,
      groups
    };
  }

  function validateAggregateEvidence(value, aggregates) {
    if (!value || typeof value !== "object") fail("코멘트 집계 근거가 올바르지 않습니다.");
    const dimension = DIMENSIONS[value.dimension];
    const label = text(value.label, "코멘트 집계 라벨", 160);
    const row = dimension && (aggregates[dimension] || []).find(function (item) { return item.label === label; });
    if (!row || value.correctCount !== row.correctCount || value.questionCount !== row.questionCount || !sameNumber(value.rate, row.rate)) {
      fail("코멘트 집계 근거가 검증된 분석값과 일치하지 않습니다.");
    }
    if (dimension === "overall" && (!sameNumber(value.score, row.score) || !sameNumber(value.totalPoints, row.totalPoints))) {
      fail("종합 코멘트의 점수 근거가 일치하지 않습니다.");
    }
    return {
      dimension,
      label,
      correctCount: row.correctCount,
      questionCount: row.questionCount,
      rate: row.rate,
      score: dimension === "overall" ? row.score : undefined,
      totalPoints: dimension === "overall" ? row.totalPoints : undefined
    };
  }

  function validateComparisonEvidence(value, comparison) {
    if (!comparison || !value || typeof value !== "object") fail("회차 비교 코멘트의 근거가 없습니다.");
    const category = text(value.category, "회차 비교 유형", 30);
    if (category === "score-delta") {
      if (!sameNumber(value.previousScore, comparison.score) || !sameNumber(value.currentScore, comparison.score + comparison.scoreDelta) || !sameNumber(value.delta, comparison.scoreDelta)) {
        fail("회차 점수 변화 근거가 일치하지 않습니다.");
      }
      return { category, previousScore: comparison.score, currentScore: comparison.score + comparison.scoreDelta, delta: comparison.scoreDelta };
    }
    if (!own(comparison.groups, category)) fail("회차 비교 유형이 올바르지 않습니다.");
    const numbers = exactNumbers(value.itemNumbers, "회차 비교");
    if (numbers.join(",") !== comparison.groups[category].join(",")) fail("회차 비교 문항 근거가 실제 변화와 일치하지 않습니다.");
    return { category, itemNumbers: numbers };
  }

  function validateSimilarProblemSet(value) {
    if (value == null) return null;
    if (!value || typeof value !== "object" || value.status !== "approved") fail("승인되지 않은 유사문제 세트는 연결할 수 없습니다.");
    if (Object.keys(value).some(function (key) { return key !== "status" && key !== "setId"; })) fail("유사문제 세트는 승인 연결 상태만 표시할 수 있습니다.");
    return { status: "approved", setId: text(value.setId, "유사문제 세트", 160) };
  }

  function validateComments(comments, items, aggregates, comparison, correctCount, wrongCount) {
    if (!Array.isArray(comments) || !comments.length) fail("근거가 있는 학습 코멘트가 없습니다.");
    const itemByNumber = new Map(items.map(function (item) { return [item.number, item]; }));
    const present = new Set();
    const result = comments.map(function (comment, index) {
      if (!comment || typeof comment !== "object" || !COMMENT_TYPES.has(comment.type)) fail(`${index + 1}번째 학습 코멘트 유형이 올바르지 않습니다.`);
      present.add(comment.type);
      const source = comment.evidence;
      if (!source || typeof source !== "object") fail(`${index + 1}번째 학습 코멘트에 근거가 없습니다.`);
      let itemNumbers = null, aggregateEvidence = null, comparisonEvidence = null;
      if (own(source, "itemNumbers")) {
        itemNumbers = exactNumbers(source.itemNumbers, "학습 코멘트");
        if (itemNumbers.some(function (number) { return !itemByNumber.has(number); })) fail("학습 코멘트 문항 근거가 시험 범위를 벗어났습니다.");
      }
      if (own(source, "aggregate")) aggregateEvidence = validateAggregateEvidence(source.aggregate, aggregates);
      if (own(source, "comparison")) comparisonEvidence = validateComparisonEvidence(source.comparison, comparison);
      if (!itemNumbers && !aggregateEvidence && !comparisonEvidence) fail("학습 코멘트가 검증된 근거에 연결되지 않았습니다.");
      if (itemNumbers && aggregateEvidence && aggregateEvidence.dimension !== "overall" && itemNumbers.some(function (number) {
        return itemByNumber.get(number)[aggregateEvidence.dimension] !== aggregateEvidence.label;
      })) fail("학습 코멘트의 문항과 집계 근거가 서로 일치하지 않습니다.");
      if (itemNumbers && comparisonEvidence && comparisonEvidence.itemNumbers && itemNumbers.join(",") !== comparisonEvidence.itemNumbers.join(",")) {
        fail("학습 코멘트의 문항과 회차 변화 근거가 서로 일치하지 않습니다.");
      }
      if (comment.type === "summary" && (!aggregateEvidence || aggregateEvidence.dimension !== "overall")) fail("종합 코멘트는 전체 합계에 연결되어야 합니다.");
      if (comment.type === "strength") {
        if (!aggregateEvidence || aggregateEvidence.dimension === "overall") fail("강점 코멘트는 분류 집계에 연결되어야 합니다.");
        const maxRate = Math.max.apply(null, aggregates[aggregateEvidence.dimension].map(function (row) { return row.rate; }));
        if (aggregateEvidence.rate !== maxRate) fail("강점 코멘트가 가장 안정적인 집계와 일치하지 않습니다.");
      }
      if (comment.type === "weakness") {
        if (!aggregateEvidence || aggregateEvidence.dimension === "overall" || aggregateEvidence.rate >= 100) fail("약점 코멘트는 오답이 있는 분류 집계에 연결되어야 합니다.");
        const minRate = Math.min.apply(null, aggregates[aggregateEvidence.dimension].map(function (row) { return row.rate; }));
        if (aggregateEvidence.rate !== minRate) fail("약점 코멘트가 가장 낮은 집계와 일치하지 않습니다.");
      }
      if (comment.type === "domain-specific" && (!aggregateEvidence || aggregateEvidence.dimension !== "domain")) fail("영역 코멘트는 영역별 집계에 연결되어야 합니다.");
      if (comment.type === "item-prescription") {
        if (!itemNumbers || itemNumbers.some(function (number) { return itemByNumber.get(number).state !== "wrong"; })) fail("오답 처방은 오답 문항에만 연결할 수 있습니다.");
      }
      if (comment.type === "next-action" && !aggregateEvidence && (!itemNumbers || itemNumbers.every(function (number) { return itemByNumber.get(number).state === "correct"; }))) {
        fail("다음 행동 코멘트는 보완 근거에 연결되어야 합니다.");
      }
      if (comment.type === "round-comparison" && !comparisonEvidence) fail("회차 비교 코멘트는 검증된 회차 변화에 연결되어야 합니다.");
      if (comment.type !== "item-prescription" && own(comment, "similarProblemSet")) fail("유사문제 세트는 문항 처방에만 연결할 수 있습니다.");
      const similarProblemSet = validateSimilarProblemSet(comment.similarProblemSet);
      return {
        type: comment.type,
        title: text(comment.title, "학습 코멘트 제목", 120),
        text: text(comment.text, "학습 코멘트", 1000),
        evidence: { itemNumbers, aggregate: aggregateEvidence, comparison: comparisonEvidence },
        similarProblemSet
      };
    });
    const required = ["summary", "domain-specific", "next-action"];
    if (correctCount) required.push("strength");
    if (wrongCount) required.push("weakness", "item-prescription");
    if (comparison) required.push("round-comparison");
    required.forEach(function (type) { if (!present.has(type)) fail(`필수 학습 코멘트(${type})가 없습니다.`); });
    return result;
  }

  function unavailableCutline() {
    return { available: false, message: "합격 기준 확인 필요 — 점수/진단만 제공" };
  }

  function approvedCutlinePolicy(policyData, exam) {
    if (!policyData || !Array.isArray(policyData.examAssignments) || !Array.isArray(policyData.referenceCutlines)) return null;
    const assignment = policyData.examAssignments.find(function (item) { return item && item.examId === exam.id; });
    if (!assignment || assignment.status !== "approved" || !assignment.policyId || !assignment.approvedBy || !assignment.approvedAt || !Number.isFinite(Date.parse(assignment.approvedAt))) return null;
    const policy = policyData.referenceCutlines.find(function (item) { return item && item.id === assignment.policyId; });
    if (!policy || policy.usage !== "exam-approved" || policy.evidenceStatus !== "verified") return null;
    if (policy.programId !== exam.programId || policy.curriculumVersion !== exam.curriculumVersion) return null;
    return { assignment, policy };
  }

  function validateCutlineApproval(decision, assignment) {
    const approval = decision && decision.approval;
    if (!approval || approval.status !== "approved" || approval.approvedBy !== assignment.approvedBy || approval.approvedAt !== assignment.approvedAt) {
      fail("커트라인 판정의 사용자 승인 정보가 일치하지 않습니다.");
    }
    return { status: "approved", approvalId: text(approval.approvalId, "커트라인 승인", 160) };
  }

  function sectionCounts(items, minimums) {
    const allowed = new Set(minimums.map(function (item) { return item.sectionId; }));
    const counts = new Map(minimums.map(function (item) { return [item.sectionId, { questionCount: 0, correctCount: 0 }]; }));
    items.forEach(function (item) {
      if (!item.cutlineSectionId || !allowed.has(item.cutlineSectionId)) fail("커트라인 영역 분류가 완료되지 않았습니다.");
      const count = counts.get(item.cutlineSectionId);
      count.questionCount += 1;
      if (item.state === "correct") count.correctCount += 1;
    });
    return counts;
  }

  function validateCutlineDecision(decision, policyData, exam, items, score, totalPoints, correctCount) {
    const approved = approvedCutlinePolicy(policyData, exam);
    if (!approved || decision == null) return unavailableCutline();
    if (!decision || typeof decision !== "object" || decision.policyId !== approved.policy.id || decision.kind !== approved.policy.rule.kind) {
      fail("서버 커트라인 판정이 승인된 시험 정책과 일치하지 않습니다.");
    }
    validateCutlineApproval(decision, approved.assignment);
    const rule = approved.policy.rule || {};
    if (rule.kind === "level-score") {
      if (!Array.isArray(rule.thresholds) || !rule.thresholds.length) fail("승인된 단계별 점수 기준이 올바르지 않습니다.");
      const thresholds = rule.thresholds.slice().sort(function (a, b) { return Number(b.minimum) - Number(a.minimum); });
      thresholds.forEach(function (threshold) {
        if (!threshold || !threshold.levelId || !Number.isFinite(Number(threshold.minimum))) fail("승인된 단계별 점수 기준이 올바르지 않습니다.");
      });
      const matched = thresholds.find(function (threshold) { return score >= Number(threshold.minimum); }) || null;
      const expectedLevelId = matched ? matched.levelId : null;
      if (!sameNumber(decision.score, score) || !sameNumber(decision.totalPoints, totalPoints) || decision.levelId !== expectedLevelId) fail("서버 단계 판정이 점수와 일치하지 않습니다.");
      return {
        available: true, kind: rule.kind, outcome: expectedLevelId ? "level" : "below", levelId: expectedLevelId,
        score, totalPoints, threshold: matched ? Number(matched.minimum) : null,
        message: expectedLevelId ? `승인 단계 ${expectedLevelId}` : "승인된 최저 단계 미만"
      };
    }
    if (rule.kind === "correct-count") {
      if (!Number.isInteger(rule.minimum) || !Number.isInteger(rule.denominator) || rule.denominator !== items.length || rule.minimum < 0 || rule.minimum > rule.denominator) fail("승인된 정답 수 기준이 시험과 일치하지 않습니다.");
      const outcome = correctCount >= rule.minimum ? "pass" : "fail";
      if (decision.correctCount !== correctCount || decision.denominator !== items.length || decision.outcome !== outcome) fail("서버 합격 판정이 문항 결과와 일치하지 않습니다.");
      return {
        available: true, kind: rule.kind, outcome, correctCount, minimum: rule.minimum, denominator: items.length,
        message: outcome === "pass" ? "승인 기준 충족" : "승인 기준 미충족"
      };
    }
    if (rule.kind === "composite-correct-count") {
      if (!Number.isInteger(rule.minimum) || !Number.isInteger(rule.denominator) || rule.denominator !== items.length ||
          rule.minimum < 0 || rule.minimum > rule.denominator || !Number.isInteger(rule.reviewFrom) || rule.reviewFrom < 0 ||
          rule.reviewFrom >= rule.minimum || !Array.isArray(rule.sectionMinimums) || !rule.sectionMinimums.length) {
        fail("승인된 복합 커트라인 기준이 시험과 일치하지 않습니다.");
      }
      const sectionIds = new Set();
      rule.sectionMinimums.forEach(function (section) {
        if (!section || !section.sectionId || sectionIds.has(section.sectionId) || !Number.isInteger(section.minimum) || section.minimum < 0) fail("승인된 영역별 기준이 올바르지 않습니다.");
        sectionIds.add(section.sectionId);
      });
      const counts = sectionCounts(items, rule.sectionMinimums);
      const sections = rule.sectionMinimums.map(function (section) {
        const count = counts.get(section.sectionId);
        if (section.minimum > count.questionCount) fail("영역별 기준 문항 수가 시험 구성과 일치하지 않습니다.");
        return {
          sectionId: section.sectionId, correctCount: count.correctCount, questionCount: count.questionCount,
          minimum: section.minimum, passed: count.correctCount >= section.minimum
        };
      });
      const allSectionsPassed = sections.every(function (section) { return section.passed; });
      const outcome = correctCount >= rule.minimum && allSectionsPassed ? "pass" : correctCount >= rule.reviewFrom ? "review" : "fail";
      if (decision.correctCount !== correctCount || decision.denominator !== items.length || decision.outcome !== outcome || !Array.isArray(decision.sections) || decision.sections.length !== sections.length) {
        fail("서버 복합 판정이 문항 결과와 일치하지 않습니다.");
      }
      const decisionSections = new Map(decision.sections.map(function (section) { return [section && section.sectionId, section]; }));
      sections.forEach(function (section) {
        const supplied = decisionSections.get(section.sectionId);
        if (!supplied || supplied.correctCount !== section.correctCount || supplied.questionCount !== section.questionCount || supplied.minimum !== section.minimum || supplied.passed !== section.passed) {
          fail("서버 영역별 과락 판정이 문항 결과와 일치하지 않습니다.");
        }
      });
      return {
        available: true, kind: rule.kind, outcome, correctCount, minimum: rule.minimum, denominator: items.length,
        reviewFrom: rule.reviewFrom, sections,
        message: outcome === "pass" ? "승인 기준 충족" : outcome === "review" ? "검토 구간" : "승인 기준 미충족"
      };
    }
    fail("지원하지 않는 커트라인 정책입니다.");
  }

  function validateReport(report, context) {
    if (!report || typeof report !== "object" || Array.isArray(report)) fail("분석지 서버 응답이 올바르지 않습니다.");
    assertPublicOnly(report);
    if (own(report, "comment")) fail("단일 코멘트가 아니라 근거별 학습 코멘트가 필요합니다.");
    const expectedAttemptId = text(context && context.attemptId, "요청한 제출 결과", 200);
    if (/[/\\?#\s]/.test(expectedAttemptId) || report.attemptId !== expectedAttemptId) fail("제출 결과 식별자가 일치하지 않습니다.");
    const studentId = text(context && context.session && context.session.studentId, "학생", 200);
    if (report.studentId !== studentId) fail("학생별 분석지 권한이 일치하지 않습니다.");
    const examId = text(report.examId, "시험", 200);
    const exam = findExam(context || {}, examId);
    if (own(report, "examTitle") && report.examTitle !== exam.title) fail("분석지 시험명이 일치하지 않습니다.");
    if (report.classificationStatus !== "verified") fail("검증되지 않은 문항 분류로는 분석지를 만들 수 없습니다.");
    const submittedAt = text(report.submittedAt, "제출 시각", 80);
    if (!Number.isFinite(Date.parse(submittedAt))) fail("제출 시각이 올바르지 않습니다.");
    const gradingVersion = text(report.gradingVersion, "채점 버전", 100);
    const sourceItems = Array.isArray(report.items) ? report.items : [];
    if (!Number.isInteger(exam.questionCount) || sourceItems.length !== exam.questionCount) fail("분석지 문항 수가 시험과 일치하지 않습니다.");
    sourceItems.forEach(function (item) {
      if (own(item, "attemptId") && item.attemptId !== expectedAttemptId) fail("문항의 제출 결과 식별자가 일치하지 않습니다.");
      if (own(item, "studentId") && item.studentId !== studentId) fail("문항의 학생 식별자가 일치하지 않습니다.");
      if (own(item, "examId") && item.examId !== examId) fail("문항의 시험 식별자가 일치하지 않습니다.");
    });
    const items = sourceItems.map(validateItem);
    const correctCount = items.filter(function (item) { return item.state === "correct"; }).length;
    const wrongCount = items.length - correctCount;
    const totalPoints = items.reduce(function (sum, item) { return sum + item.points; }, 0);
    const score = items.reduce(function (sum, item) { return sum + (item.state === "correct" ? item.points : 0); }, 0);
    const accuracy = percentage(correctCount, items.length);
    if (report.questionCount !== items.length || report.correctCount !== correctCount || !sameNumber(report.totalPoints, totalPoints) || !sameNumber(report.score, score) || !sameNumber(report.accuracy, accuracy)) {
      fail("서버 채점 합계가 문항별 결과와 일치하지 않습니다.");
    }
    if (own(report, "wrongCount") && report.wrongCount !== wrongCount) fail("서버 오답 합계가 문항별 결과와 일치하지 않습니다.");
    const aggregates = {
      overall: overallAggregate(items, correctCount, score, totalPoints),
      domain: aggregate(items, "domain"),
      gradeSemesterUnit: aggregate(items, "gradeSemesterUnit"),
      detailType: aggregate(items, "detailType"),
      difficulty: aggregate(items, "difficulty")
    };
    validateProvidedAggregate(report, aggregates.domain, "byDomain");
    validateProvidedAggregate(report, aggregates.gradeSemesterUnit, "byTermUnit");
    validateProvidedAggregate(report, aggregates.detailType, "byType");
    validateProvidedAggregate(report, aggregates.difficulty, "byDifficulty");
    const weakPriorities = validatePriorities(report.weakPriorities, aggregates, wrongCount);
    const previousAttempt = validatePreviousAttempt(report.previousAttempt, {
      attemptId: expectedAttemptId,
      studentId,
      examId,
      submittedAt,
      score
    }, items, totalPoints);
    const comments = validateComments(report.comments, items, aggregates, previousAttempt, correctCount, wrongCount);
    const cutline = validateCutlineDecision(report.cutlineDecision, context && context.cutlinePolicies, exam, items, score, totalPoints, correctCount);
    return {
      attemptId: expectedAttemptId,
      examId,
      examTitle: exam.title,
      submittedAt,
      gradingVersion,
      classificationStatus: "verified",
      questionCount: items.length,
      correctCount,
      wrongCount,
      totalPoints,
      score,
      accuracy,
      items,
      byDomain: aggregates.domain,
      byTermUnit: aggregates.gradeSemesterUnit,
      byType: aggregates.detailType,
      byDifficulty: aggregates.difficulty,
      weakPriorities,
      comments,
      previousAttempt,
      cutline
    };
  }

  root.HIGHSELECT_REPORT_SECURITY = {
    requestOptions,
    validateNoStoreResponse,
    validateReport,
    validateAttemptReport: validateReport
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.HIGHSELECT_REPORT_SECURITY;
})(typeof window !== "undefined" ? window : globalThis);
