"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { AUDIT_SCHEMA } = require("./import-dolpa-full-source-audit.cjs");

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function operationStageLabel(value) {
  return ({
    course_start: "과정 시작",
    first_month: "첫째 달",
    second_month: "둘째 달",
    third_month: "셋째 달",
    fourth_month: "넷째 달",
    third_month_turbo_advanced: "셋째 달 터보·심화",
    fourth_month_turbo_advanced: "넷째 달 터보·심화"
  })[clean(value)] || clean(value).replaceAll("_", " ");
}

function normalize(audit, paperId, auditDate = "2026-08-31") {
  if (!audit || audit.schemaVersion !== "dolpa-source-visual-audit-v1") throw new Error("시각 감사 JSON 버전을 확인해 주세요.");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(clean(audit.sourceId))) throw new Error("sourceId를 확인해 주세요.");
  if (!/^DP-[A-Z0-9-]+$/.test(clean(paperId))) throw new Error("paperId를 확인해 주세요.");
  const facts = audit.sourceFacts || {};
  const placement = audit.coursePlacement || {};
  const central = placement.centralRange || {};
  const answers = audit.answerAuditSummary || {};
  const difficulty = audit.difficultySummary || {};
  const scope = audit.scopeSummary || {};
  const questions = Array.isArray(audit.questions) ? audit.questions : [];
  if (questions.length !== 30) throw new Error("30문항 시각 감사 결과가 필요합니다.");
  return {
    schemaVersion: AUDIT_SCHEMA,
    auditDate,
    source: {
      sourceId: audit.sourceId,
      sourceFingerprint: audit.sourceFingerprint,
      title: `돌파수학 초등관 ${clean(facts.displayLabel)}`,
      paperIdProposal: paperId,
      questionCount: facts.questionCount,
      timeMinutes: facts.testMinutes,
      sourceCutFactOnly: facts.sourceCutFactOnly,
      evidenceLocator: `private-ledger#${audit.sourceId}`,
      visibility: "private"
    },
    coursePlacement: {
      status: placement.confidence,
      processRole: placement.operationStage,
      target: [central.semester, operationStageLabel(placement.operationStage), placement.decision === "mid_course_join" ? "중간 합류" : "과정 시작"]
        .map(clean).filter(Boolean).join(" "),
      centralScope: central.coverage,
      terminalCoreUnit: `${central.semester} ${central.terminalUnit}`,
      midCourseJoin: placement.decision === "mid_course_join",
      rationale: [placement.reason]
    },
    reviewPolicy: {
      sourceValuesRedacted: true,
      learnerFitReviewed: false,
      publicationDefault: "locked",
      approvalCount: audit.releasePolicy && audit.releasePolicy.approvalCount || 0
    },
    summary: {
      verified: answers.verified,
      needsReview: answers.needsReview,
      disputed: answers.disputed,
      answerLocked: (answers.needsReview || 0) + (answers.disputed || 0),
      standard: difficulty.standard,
      raised: difficulty.raised,
      centerRange: scope.central ?? scope.centralTerminal ?? scope.centerRange ?? 0,
      upwardDiagnostic: scope.borderlineFutureDiagnostic ?? scope.outOfRange ?? scope.upwardDiagnostic ?? 0,
      visual: questions.filter(question => question.visual).length,
      approvals: audit.releasePolicy && audit.releasePolicy.approvalCount || 0
    },
    questions
  };
}

function main(args) {
  if (args.length < 3 || args.length > 4) {
    throw new Error("사용법: node normalize-dolpa-visual-audit.cjs <visual-audit> <paper-id> <output> [audit-date]");
  }
  const input = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const output = path.resolve(args[2]);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(normalize(input, args[1], args[3]), null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceId: input.sourceId, paperId: args[1], output })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ normalize, operationStageLabel });
