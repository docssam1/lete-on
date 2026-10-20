"use strict";

function percentage(correct, total) {
  return total ? Math.round((correct / total) * 1000) / 10 : 0;
}

function group(items, property) {
  const rows = new Map();
  items.forEach(function (item) {
    const label = item[property];
    if (!rows.has(label)) rows.set(label, { label, correctCount: 0, questionCount: 0, wrongNumbers: [], blankNumbers: [] });
    const row = rows.get(label);
    row.questionCount += 1;
    if (item.state === "correct") row.correctCount += 1;
    else if (item.state === "wrong") row.wrongNumbers.push(item.number);
    else if (item.state === "blank") row.blankNumbers.push(item.number);
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
  const blank = items.filter(function (item) { return item.state === "blank"; }).map(function (item) { return item.number; });
  const overall = { label: "전체", correctCount, questionCount: items.length, rate: percentage(correctCount, items.length) };
  const domains = aggregates.domain;
  function weightedEvidence(row) {
    const matches = items.filter(function (item) { return item.domain === row.label; });
    const total = matches.reduce(function (sum, item) { return sum + item.points; }, 0);
    const earned = matches.reduce(function (sum, item) { return sum + (item.state === "correct" ? item.points : 0); }, 0);
    return Object.assign(aggregateEvidence("domain", row), {
      selectionBasis: "earned-points", earnedPoints: earned, totalPoints: total, earnedRate: percentage(earned, total)
    });
  }
  const strongest = domains.slice().sort(function (a, b) { return weightedEvidence(b).earnedRate - weightedEvidence(a).earnedRate || a.label.localeCompare(b.label, "ko"); })[0];
  const weakest = domains.filter(function (row) { return row.wrongNumbers.length; })
    .sort(function (a, b) { return weightedEvidence(a).earnedRate - weightedEvidence(b).earnedRate || a.label.localeCompare(b.label, "ko"); })[0];
  const comments = [{
    type: "summary",
    title: "전체 수행 요약",
    text: `이번 시험은 ${score}/${totalPoints}점입니다. ${items.length}문항 중 정답 ${correctCount}문항, 오답 ${wrong.length}문항, 미응시 ${blank.length}문항입니다. 미응시는 실력 부족으로 단정하지 않습니다.`,
    evidence: { aggregate: aggregateEvidence("overall", overall, score, totalPoints) }
  }];
  if (correctCount) comments.push({
    type: "strength",
    title: `${strongest.label} 영역에서 해결한 문제`,
    text: `이번 시험의 ${strongest.label} 영역에서 ${strongest.correctCount}/${strongest.questionCount}문항을 맞혔습니다. 맞힌 문제도 왜 그 방법을 썼는지 설명해 보세요. 문항 수가 적으면 영역 전체의 실력을 판단하기는 어렵습니다.`,
    evidence: { aggregate: weightedEvidence(strongest) }
  });
  if (wrong.length) comments.push({
    type: "weakness",
    title: `${weakest.label} 영역 우선 보완`,
    text: `${weakest.label} 영역의 오답 문항부터 조건 해석과 계산 과정을 다시 점검하세요.`,
    evidence: { aggregate: weightedEvidence(weakest) }
  });
  const domainFocus = wrong.length ? weakest : (correctCount ? strongest : null);
  if (domainFocus) comments.push({
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
  if (blank.length) comments.push({
    type: "unattempted",
    title: "아직 풀지 않은 문항",
    text: "미응시 문항은 오답 유형으로 판단하지 않았습니다. 먼저 시간을 정해 풀어 본 뒤 풀이 과정을 확인하세요.",
    evidence: { itemNumbers: blank }
  });
  comments.push({
    type: "next-action",
    title: wrong.length ? "다시 풀고 설명하기" : blank.length ? "미응시 문항 먼저 풀기" : "다음 학습 준비하기",
    text: wrong.length ? "오답을 다시 풀고 조건과 풀이 순서를 설명해 보세요. 미응시 문항이 있다면 별도로 먼저 풀어 보세요." : blank.length ? "아직 풀지 않은 문제를 먼저 풀어 보세요. 빈 답안만으로 약점을 단정하지 않습니다." : "이번 시험의 풀이 방법을 설명해 본 뒤, 다음에 도전할 문제는 선생님과 정하세요.",
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
    wrongCount: items.filter(function (item) { return item.state === "wrong"; }).length,
    blankCount: items.filter(function (item) { return item.state === "blank"; }).length,
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
