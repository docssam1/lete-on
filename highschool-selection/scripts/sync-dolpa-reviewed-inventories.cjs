"use strict";

const fs = require("node:fs");
const path = require("node:path");
const dbCore = require("./build-dolpa-question-db.cjs");
const dbAudit = require("./audit-dolpa-question-db.cjs");
const middle22 = require("../data/review-only/dp-middle22-entry-202404-inventory.js");
const cm1 = require("../data/review-only/dp-cm1-entry-202405-inventory.js");

const REVIEW_SOURCES = Object.freeze([
  Object.freeze({
    module: middle22,
    evidenceId: "dolpa.middle22.entry.202404.answer-audit-v1",
    answerEvidenceId: "dolpa.middle22.entry.202404.answer-audit-v1",
    responseKind(item) { return item.responseCandidate; },
    responseSlots(item) { return item.responseSlotCount; },
    answerVerified(item) { return ["verified_private", "key_completed_private"].includes(item.answerStatus); }
  }),
  Object.freeze({
    module: cm1,
    evidenceId: "dolpa.cm1.entry.202405.release-artifacts-v1",
    answerEvidenceId: "dolpa.cm1.entry.202405.release-artifacts-v1",
    responseKind(item) { return item.responseFormatCandidate === "single_choice" ? "single_choice" : "input"; },
    responseSlots() { return 1; },
    answerVerified(item) { return item.answerAuditStatus === "verified_private"; }
  })
]);

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function syncReviewedInventories(database) {
  const normalized = JSON.parse(JSON.stringify(database));
  normalized.summary = dbCore.summarize(normalized);
  const before = dbAudit.audit(normalized);
  if (!before.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${before.issues.join(", ")}`);
  const next = normalized;
  const questionsByPaper = new Map();
  next.questions.forEach(question => {
    if (!questionsByPaper.has(question.paperId)) questionsByPaper.set(question.paperId, new Map());
    questionsByPaper.get(question.paperId).set(question.number, question);
  });

  REVIEW_SOURCES.forEach(source => {
    const review = source.module.inventory;
    const reviewIssues = source.module.validateReviewInventory(review);
    if (reviewIssues.length) throw new Error(`${review.roundCode} 검수 기록을 확인해 주세요: ${reviewIssues.join(", ")}`);
    const paperQuestions = questionsByPaper.get(review.roundCode);
    if (!paperQuestions || paperQuestions.size !== review.items.length) {
      throw new Error(`${review.roundCode} 문항 수가 검수 기록과 다릅니다.`);
    }
    review.items.forEach(item => {
      const question = paperQuestions.get(item.number);
      if (!question) throw new Error(`${review.roundCode} ${item.number}번 문항을 찾을 수 없습니다.`);
      question.locator = {
        page: item.sourcePage,
        slot: null,
        status: "verified",
        evidence: unique([...(question.locator.evidence || []), source.evidenceId])
      };
      question.difficulty = {
        band: item.difficultyCandidate === "advanced" ? "raised" : "standard",
        status: "verified",
        evidence: unique([...(question.difficulty.evidence || []), source.evidenceId])
      };
      question.responseFormat = {
        kind: source.responseKind(item),
        slotCount: source.responseSlots(item),
        status: "verified",
        evidence: unique([...(question.responseFormat.evidence || []), source.evidenceId])
      };
      if (!source.answerVerified(item)) throw new Error(`${review.roundCode} ${item.number}번 답 확인이 끝나지 않았습니다.`);
      if (question.answerCheck.status !== "disputed") {
        question.answerCheck = {
          status: "verified",
          evidence: unique([...(question.answerCheck.evidence || []), source.answerEvidenceId])
        };
      }
    });
  });

  next.summary = dbCore.summarize(next);
  const after = dbAudit.audit(next);
  if (!after.ok) throw new Error(`검수 결과를 합친 뒤 DB 검사가 실패했습니다: ${after.issues.join(", ")}`);
  return next;
}

function writeAtomic(filePath, value) {
  const resolved = path.resolve(filePath);
  const temporary = `${resolved}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, resolved);
}

function main(args) {
  if (args.length < 1 || args.length > 2) {
    throw new Error("사용법: node sync-dolpa-reviewed-inventories.cjs <문항-db> [출력-db]");
  }
  const input = path.resolve(args[0]);
  const output = path.resolve(args[1] || args[0]);
  const database = syncReviewedInventories(JSON.parse(fs.readFileSync(input, "utf8")));
  writeAtomic(output, database);
  process.stdout.write(`${JSON.stringify(database.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ REVIEW_SOURCES, syncReviewedInventories });
