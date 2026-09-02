"use strict";

const fs = require("node:fs");
const path = require("node:path");

const CORE_TASKS = Object.freeze([
  "bodyReview",
  "answerReview",
  "questionSegmentation",
  "typeClassification",
  "difficultyReview",
  "analysisReport"
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function statusOf(source, task) {
  return source.tasks && source.tasks[task] && source.tasks[task].status || "pending";
}

function taskComplete(source, task) {
  const status = statusOf(source, task);
  return status === "verified" || status === "not_applicable" || (task === "answerReview" && status === "sampled");
}

function targetMap(plan) {
  const bySource = new Map();
  for (const target of plan.targets || []) {
    for (const item of target.sourcePapersToReview || []) {
      if (!item.sourceId) continue;
      if (!bySource.has(item.sourceId)) bySource.set(item.sourceId, []);
      bySource.get(item.sourceId).push({
        targetId: target.targetId,
        role: item.role || null,
        scopeHint: item.scopeHint || null
      });
    }
  }
  return bySource;
}

function priorityOf(source, targets, pendingTasks) {
  let score = 0;
  if (source.familyHint === "입반시험") score += 100;
  if (targets.length) score += 60;
  if (source.conversion && source.conversion.status === "변환 완료") score += 30;
  if (statusOf(source, "coverReview") === "verified") score += 20;
  score += pendingTasks.length;
  return score;
}

function buildQueue(ledger, database, plan, generatedAt) {
  const targetsBySource = targetMap(plan);
  const questionCounts = new Map();
  for (const question of database.questions || []) {
    const sourceId = question.sourceId || question.sourceRef && question.sourceRef.sourceId;
    if (sourceId) questionCounts.set(sourceId, (questionCounts.get(sourceId) || 0) + 1);
  }

  const sourceAuditQueue = [];
  const answerExceptionQueue = [];
  const learnerFitQueue = [];
  for (const source of ledger.sources || []) {
    const conversionReady = source.conversion && source.conversion.status === "변환 완료";
    const coverReady = statusOf(source, "coverReview") === "verified";
    const pendingTasks = CORE_TASKS.filter(task => !taskComplete(source, task));
    const targets = targetsBySource.get(source.sourceId) || [];
    const common = {
      sourceId: source.sourceId,
      paperIds: [...(source.paperIds || [])],
      familyHint: source.familyHint || null,
      courseHint: source.courseHint || null,
      questionCount: questionCounts.get(source.sourceId) || 0,
      conversionStatus: source.conversion && source.conversion.status || "대기",
      coverReviewStatus: statusOf(source, "coverReview"),
      targets
    };
    if (conversionReady && coverReady && pendingTasks.length) {
      sourceAuditQueue.push({
        ...common,
        priority: priorityOf(source, targets, pendingTasks),
        pendingTasks
      });
    }
    if (!pendingTasks.length && statusOf(source, "answerReview") === "sampled") {
      answerExceptionQueue.push({
        ...common,
        priority: targets.length ? 2 : 1,
        answerReviewStatus: "sampled",
        action: "정답 이견 또는 확인 대기 문항만 별도 검수"
      });
    }
    if (!pendingTasks.length && !["verified", "not_applicable"].includes(statusOf(source, "learnerFitReview"))) {
      learnerFitQueue.push({
        ...common,
        priority: targets.length ? 2 : 1,
        learnerFitStatus: statusOf(source, "learnerFitReview")
      });
    }
  }

  const sortQueue = items => items.sort((a, b) =>
    b.priority - a.priority ||
    String(a.courseHint).localeCompare(String(b.courseHint), "ko") ||
    a.sourceId.localeCompare(b.sourceId)
  );
  sortQueue(sourceAuditQueue);
  sortQueue(answerExceptionQueue);
  sortQueue(learnerFitQueue);

  return {
    schemaVersion: "dolpa-detail-work-queue/v1",
    generatedAt,
    rules: [
      "원본 문항과 정답 값은 이 대기표에 저장하지 않는다.",
      "변환 및 표지 확인이 끝난 원본만 세부 검수 대상으로 올린다.",
      "원본 검수와 학습 적합성 검수를 별도 대기표로 유지한다.",
      "전체 대조가 끝난 정답 이견은 원본 재검수 대신 정답 예외 대기표에서만 다룬다.",
      "정답 이견과 유형 병합 보류는 자동 승인하지 않는다."
    ],
    summary: {
      sourceCount: (ledger.sources || []).length,
      convertedSourceCount: (ledger.sources || []).filter(source => source.conversion && source.conversion.status === "변환 완료").length,
      detailedSourceCount: (ledger.sources || []).filter(source => CORE_TASKS.every(task => taskComplete(source, task))).length,
      sourceAuditPendingCount: sourceAuditQueue.length,
      answerExceptionPendingCount: answerExceptionQueue.length,
      learnerFitPendingCount: learnerFitQueue.length
    },
    sourceAuditQueue,
    answerExceptionQueue,
    learnerFitQueue
  };
}

function main(args) {
  if (args.length !== 5) {
    throw new Error("사용법: node build-dolpa-detail-work-queue.cjs <ledger> <question-db> <target-plan> <generated-at> <output>");
  }
  const [ledgerPath, databasePath, planPath, generatedAt, outputPath] = args;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(generatedAt)) throw new Error("generated-at은 YYYY-MM-DD 형식이어야 합니다.");
  const queue = buildQueue(readJson(ledgerPath), readJson(databasePath), readJson(planPath), generatedAt);
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(queue, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(queue.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ CORE_TASKS, buildQueue, taskComplete });
