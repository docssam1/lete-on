"use strict";

function percentage(correct, total) {
  return total ? Math.round((correct / total) * 1000) / 10 : 0;
}

function group(items, property) {
  const rows = new Map();
  items.forEach(function (item) {
    const label = item[property];
    if (!rows.has(label)) rows.set(label, { label, correctCount: 0, questionCount: 0, wrongNumbers: [] });
    const row = rows.get(label);
    row.questionCount += 1;
    if (item.state === "correct") row.correctCount += 1;
    else row.wrongNumbers.push(item.number);
  });
  return Array.from(rows.values(), function (row) {
    return Object.assign(row, { rate: percentage(row.correctCount, row.questionCount) });
  });
}

function aggregateEvidence(dimension, row, score, totalPoints) {
  const result = { dimension, label: row.label, correctCount: row.correctCount, questionCount: row.questionCount, rate: row.rate };
  if (dimension === "overall") { result.score = score; result.totalPoints = totalPoints; }
  return result;
}

function createComments(items, aggregates, score, totalPoints) {
  const correctCount = items.filter(function (item) { return item.state === "correct"; }).length;
  const wrong = items.filter(function (item) { return item.state === "wrong"; }).map(function (item) { return item.number; });
  const overall = { label: "전체", correctCount, questionCount: items.length, rate: percentage(correctCount, items.length) };
  const domains = aggregates.domain;
  const strongest = domains.slice().sort(function (a, b) { return b.rate - a.rate || a.label.localeCompare(b.label, "ko"); })[0];
  const weakest = domains.slice().sort(function (a, b) { return a.rate - b.rate || a.label.localeCompare(b.label, "ko"); })[0];
  const comments = [{
    type: "summary",
    title: "전체 수행 요약",
    text: `운영 점수 ${score}/${totalPoints}점, 정답률 ${overall.rate}%입니다. 문항별 결과와 분류별 수행률을 함께 확인하세요.`,
    evidence: { aggregate: aggregateEvidence("overall", overall, score, totalPoints) }
  }];
  if (correctCount) comments.push({
    type: "strength",
    title: `${strongest.label} 영역의 안정성`,
    text: `${strongest.label} 영역에서 가장 높은 수행률을 보였습니다. 풀이 근거를 유지하면서 정확도를 이어가세요.`,
    evidence: { aggregate: aggregateEvidence("domain", strongest) }
  });
  if (wrong.length) comments.push({
    type: "weakness",
    title: `${weakest.label} 영역 우선 보완`,
    text: `${weakest.label} 영역의 오답 문항부터 조건 해석과 계산 과정을 다시 점검하세요.`,
    evidence: { aggregate: aggregateEvidence("domain", weakest) }
  });
  const domainFocus = wrong.length ? weakest : strongest;
  comments.push({
    type: "domain-specific",
    title: `${domainFocus.label} 영역 점검`,
    text: `${domainFocus.label} 영역은 ${domainFocus.correctCount}/${domainFocus.questionCount}문항을 해결했습니다. 같은 분류의 풀이 절차를 문장으로 설명해 보세요.`,
    evidence: { aggregate: aggregateEvidence("domain", domainFocus) }
  });
  if (wrong.length) comments.push({
    type: "item-prescription",
    title: "오답 문항 재풀이",
    text: "오답 문항은 정답을 외우지 말고 핵심 조건, 사용한 개념, 계산 순서를 각각 기록한 뒤 다시 푸세요.",
    evidence: { itemNumbers: wrong }
  });
  comments.push({
    type: "next-action",
    title: wrong.length ? "취약 분류부터 재도전" : "상향 난이도로 확장",
    text: wrong.length ? "가장 낮은 수행률의 분류를 먼저 복습하고 낮춤·기준·올림 순서로 재도전하세요." : "현재 정확도를 유지하면서 같은 풀이 구조의 올림 난이도 문항으로 확장하세요.",
    evidence: { aggregate: aggregateEvidence(wrong.length ? "domain" : "overall", wrong.length ? weakest : overall, score, totalPoints) }
  });
  return comments;
}

function buildReport(input) {
  const items = input.scored.items.map(function (item) {
    const classification = item.classification;
    return {
      number: item.number,
      state: item.state,
      points: classification.points,
      classificationStatus: "verified",
      domain: classification.domain,
      gradeBand: classification.gradeBand,
      semester: classification.semester,
      majorUnit: classification.majorUnit,
      minorUnit: classification.minorUnit,
      detailType: classification.detailType,
      difficulty: classification.difficulty,
      cutlineSectionId: classification.cutlineSectionId,
      classificationEvidence: classification.evidence
    };
  });
  const correctCount = items.filter(function (item) { return item.state === "correct"; }).length;
  const totalPoints = items.reduce(function (sum, item) { return sum + item.points; }, 0);
  const score = items.reduce(function (sum, item) { return sum + (item.state === "correct" ? item.points : 0); }, 0);
  const aggregates = {
    domain: group(items, "domain"),
    gradeSemesterUnit: group(items.map(function (item) {
      return Object.assign({}, item, { gradeSemesterUnit: [item.gradeBand, item.semester, item.majorUnit, item.minorUnit].join(" · ") });
    }), "gradeSemesterUnit"),
    detailType: group(items, "detailType"),
    difficulty: group(items, "difficulty")
  };
  const weakPriorities = aggregates.detailType
    .filter(function (row) { return row.wrongNumbers.length; })
    .sort(function (a, b) { return a.rate - b.rate || b.wrongNumbers.length - a.wrongNumbers.length || a.label.localeCompare(b.label, "ko"); })
    .slice(0, 3)
    .map(function (row) {
      return { dimension: "detailType", label: row.label, reason: `${row.label} 분류의 오답 근거를 우선 재점검합니다.`, evidence: row.wrongNumbers.slice() };
    });
  return {
    attemptId: input.attemptId,
    studentId: input.studentId,
    examId: input.exam.examId,
    examTitle: input.exam.title,
    submittedAt: input.submittedAt,
    gradingVersion: input.scored.gradingVersion,
    classificationStatus: "verified",
    questionCount: items.length,
    correctCount,
    wrongCount: items.length - correctCount,
    totalPoints,
    score,
    accuracy: percentage(correctCount, items.length),
    items,
    weakPriorities,
    comments: createComments(items, aggregates, score, totalPoints),
    previousAttempt: null,
    cutlineDecision: null
  };
}

module.exports = { buildReport, percentage, group };
