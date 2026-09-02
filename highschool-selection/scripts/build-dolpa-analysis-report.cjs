"use strict";

const fs = require("node:fs");
const path = require("node:path");
const dbAudit = require("./audit-dolpa-question-db.cjs");

function countBy(items, getter) {
  const counts = new Map();
  items.forEach(item => {
    const key = String(getter(item) || "확인 전");
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts, ([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, "ko"));
}

function resolvePaperPlacements(database, paper) {
  const questionById = new Map(database.questions.map(question => [question.questionId, question]));
  if (!paper.variant) {
    const hasExplicitLinks = Array.isArray(paper.questionIds) && paper.questionIds.length;
    const questions = hasExplicitLinks
      ? paper.questionIds.map(questionId => questionById.get(questionId))
      : database.questions.filter(item => item.sourceId === paper.sourceId).sort((a, b) => a.number - b.number);
    if (questions.some(question => !question || question.sourceId !== paper.sourceId
      || (hasExplicitLinks && question.paperId !== paper.paperId))) {
      throw new Error(`대표 시험 문항 연결이 끊겼습니다: ${paper.paperId}`);
    }
    return questions.map(question => ({
      number: question.number,
      question,
      locator: question.locator,
      shared: false
    }));
  }
  if (paper.variant.kind !== "partial_question_variant") throw new Error(`부분 교체 시험지 종류를 확인해 주세요: ${paper.paperId}`);
  const sharedByNumber = new Map((paper.variant.sharedQuestionLinks || []).map(link => [link.number, link]));
  const overrideIds = new Set(paper.variant.overrideQuestionIds || []);
  if (!Number.isSafeInteger(paper.questionCount) || paper.questionCount < 1
    || !Array.isArray(paper.questionIds) || paper.questionIds.length !== paper.questionCount) {
    throw new Error(`부분 교체 시험지 배치 수를 확인해 주세요: ${paper.paperId}`);
  }
  return paper.questionIds.map((questionId, index) => {
    const number = index + 1;
    const question = questionById.get(questionId);
    const shared = sharedByNumber.get(number);
    if (!question) throw new Error(`부분 교체 시험지의 canonical 문항을 찾을 수 없습니다: ${paper.paperId}:${number}`);
    if (shared) {
      if (shared.questionId !== questionId || !Number.isSafeInteger(shared.page) || shared.page < 1
        || !Number.isSafeInteger(shared.slot) || shared.slot < 1 || !(shared.evidence || []).length) {
        throw new Error(`부분 교체 시험지의 공유 배치 근거를 확인해 주세요: ${paper.paperId}:${number}`);
      }
      return {
        number,
        question,
        locator: { page: shared.page, slot: shared.slot, status: "verified", evidence: shared.evidence },
        shared: true
      };
    }
    if (!overrideIds.has(questionId) || question.paperId !== paper.paperId || question.sourceId !== paper.sourceId
      || question.number !== number) {
      throw new Error(`부분 교체 시험지의 교체 문항 배치를 확인해 주세요: ${paper.paperId}:${number}`);
    }
    return { number, question, locator: question.locator, shared: false };
  });
}

function buildReport(database, sourceId, reviewedAt) {
  const paper = database.papers.find(item => item.sourceId === sourceId);
  if (!paper) throw new Error(`문항 DB에 없는 원본입니다: ${sourceId}`);
  const placements = resolvePaperPlacements(database, paper);
  const questions = placements.map(placement => placement.question);
  const answerLeakIssues = dbAudit.findAnswerLeakIssues({ paper, questions });
  if (answerLeakIssues.length) throw new Error(`분석 자료에 정답 값 또는 금지 필드가 있습니다: ${answerLeakIssues.join(", ")}`);
  if (placements.length !== 30) throw new Error(`대표 시험 문항 수가 30개가 아닙니다: ${sourceId}`);
  const required = ["classification", "difficulty", "responseFormat"];
  const pending = placements.flatMap(placement => [
    ...required.filter(key => placement.question[key].status !== "verified").map(key => `${placement.number}:${key}`),
    ...(placement.locator.status !== "verified" ? [`${placement.number}:locator`] : [])
  ]);
  if (pending.length) throw new Error(`분석 전 검수가 끝나지 않았습니다: ${pending.join(", ")}`);
  const answerDisputes = placements.filter(placement => placement.question.answerCheck.status === "disputed");
  const invalidAnswers = placements.filter(placement => !["verified", "disputed"].includes(placement.question.answerCheck.status));
  if (invalidAnswers.length) {
    throw new Error(`분석 전 답안 검수가 끝나지 않았습니다: ${invalidAnswers.map(placement => placement.number).join(", ")}`);
  }
  if (!paper.sourceFingerprint || placements.some(placement => !(placement.locator.evidence || []).length)) {
    throw new Error(`분석 근거 지문 또는 문항 위치 근거가 없습니다: ${sourceId}`);
  }
  const standardCount = questions.filter(question => question.difficulty.band === "standard").length;
  const raisedCount = questions.filter(question => question.difficulty.band === "raised").length;
  const semesters = countBy(questions, question => question.classification.semester);
  const domains = countBy(questions, question => question.classification.domain);
  const topDomains = domains.filter(item => item.count === domains[0].count).map(item => item.label);
  const scopeLabel = String((paper.coverage && paper.coverage.declaredScopeLabel) || "확인된 시험 범위");
  return {
    schemaVersion: "highselect-dolpa-analysis-report/v1",
    sourceId,
    paperId: paper.paperId,
    title: paper.title,
    reviewedAt,
    releaseStatus: "locked",
    scope: paper.coverage,
    summary: {
      questionCount: questions.length,
      standardCount,
      raisedCount,
      raisedRate: Number((raisedCount / questions.length * 100).toFixed(1)),
      answerDisputeCount: answerDisputes.length,
      dominantDomains: topDomains
    },
    charts: {
      bySemester: semesters,
      byDomain: domains,
      byUnit: countBy(questions, question => question.classification.unit),
      byDifficulty: [
        { label: "기본 적용형", count: standardCount },
        { label: "복합 추론형", count: raisedCount }
      ]
    },
    criticalWarnings: answerDisputes.map(placement => ({
      questionId: placement.question.questionId,
      number: placement.number,
      status: "disputed",
      message: placement.question.answerCheck.note || "공식 답과 독립 계산이 일치하지 않아 학생 사용이 잠겨 있다.",
      ...(paper.variant ? {
        canonicalQuestionId: placement.question.questionId,
        canonicalSourceId: placement.question.sourceId,
        canonicalQuestionNumber: placement.question.number
      } : {})
    })),
    comments: [
      ...(answerDisputes.length ? [`${answerDisputes.map(placement => `${placement.number}번`).join("·")}은 공식 답과 독립 계산이 일치하지 않아 학생 사용이 잠겨 있다.`] : []),
      `${scopeLabel}의 ${questions.length}문항이며, 학기별로 ${semesters.map(item => `${item.label} ${item.count}문항`).join(", ")}이 배치되어 있다.`,
      `영역은 ${topDomains.join("·")} 비중이 가장 크며, 한 핵심 개념의 직접 적용보다 개념 결합·조건 분기·역추론이 필요한 복합 추론형이 ${raisedCount}문항으로 많다.`,
      "실전에서는 기본 적용형을 먼저 정확히 확보하고, 복합도형·그래프 역추론·장문 모델링 문항은 조건을 식과 그림에 따로 표시한 뒤 풀어야 한다.",
      "이 분석은 원본 문항 구조를 설명하는 자료이며 합격선이나 개인별 합격 가능성을 추정하지 않는다."
    ],
    evidence: placements.map(placement => ({
      questionId: placement.question.questionId,
      page: placement.locator.page,
      difficultyBand: placement.question.difficulty.band,
      answerStatus: placement.question.answerCheck.status,
      answerEvidenceStatus: placement.question.answerCheck.status === "disputed" ? "conflict" : "verified",
      sourceFingerprint: paper.sourceFingerprint,
      locatorEvidenceId: placement.locator.evidence[0],
      ...(paper.variant ? {
        paperQuestionNumber: placement.number,
        slot: placement.locator.slot,
        canonicalQuestionId: placement.question.questionId,
        canonicalSourceId: placement.question.sourceId,
        canonicalQuestionNumber: placement.question.number,
        placementRelation: placement.shared ? "shared" : "replacement"
      } : {})
    }))
  };
}

function main(args) {
  if (args.length !== 4) throw new Error("사용법: node build-dolpa-analysis-report.cjs <question-db> <source-id> <reviewed-at> <output>");
  const database = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const report = buildReport(database, args[1], args[2]);
  const output = path.resolve(args[3]);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(report.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ countBy, resolvePaperPlacements, buildReport });
