"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { validatePacket } = require("./register-dolpa-reviewed-paper.cjs");

function only(values, label) {
  const unique = Array.from(new Set(values.filter(Boolean)));
  if (unique.length !== 1) throw new Error(`${label} 근거가 하나로 정리되지 않았습니다.`);
  return unique[0];
}

function exportReviewPacket(database, paperId, reviewedAt, reviewDecisions = null, paperLinks = null) {
  const paper = database.papers.find(item => item.paperId === paperId);
  if (!paper || !paper.coverage) throw new Error(`검수 완료 시험지를 찾을 수 없습니다: ${paperId}`);
  const questions = database.questions.filter(item => item.paperId === paperId).sort((a, b) => a.number - b.number);
  const expectedOwnedCount = paper.variant ? (paper.variant.overrideQuestionIds || []).length : 30;
  if (questions.length !== expectedOwnedCount) throw new Error(`${paperId} 직접 소유 문항 수가 연결 정보와 다릅니다.`);
  const evidenceRecordId = only(paper.coverage.evidence || [], "시험지");
  const sourceDecision = reviewDecisions && (reviewDecisions.sourceReviews || []).find(item => item.sourceId === paper.sourceId);
  const paperLink = paperLinks && (paperLinks.links || []).find(item =>
    item.paperId === paper.paperId && item.sourceId === paper.sourceId);
  const registryEvidenceRecordId = paperLink
    ? only([paperLink.evidenceRecordId], "원본 등록")
    : sourceDecision
      ? only(["bodyReview", "answerReview", "questionSegmentation", "typeClassification"].flatMap(stage =>
        (sourceDecision.tasks && sourceDecision.tasks[stage] && sourceDecision.tasks[stage].evidence) || []), "원본 등록")
      : only(paper.evidence || [], "원본 등록");
  const paperEvidenceId = only(paper.evidence || [], "시험지 분류");
  const answerEvidenceId = paper.answerEvidenceId
    ? String(paper.answerEvidenceId)
    : only(questions.flatMap(question => question.answerCheck.evidence || []), "답안");
  const locatorEvidenceId = only(questions.flatMap(question => question.locator.evidence || []), "문항 위치");
  const responseEvidenceId = only(questions.flatMap(question => question.responseFormat.evidence || []), "답안 형식");
  const packet = {
    schemaVersion: "highselect-dolpa-paper-review/v1",
    sourceId: paper.sourceId,
    sourceFingerprint: paper.sourceFingerprint,
    paperId: paper.paperId,
    title: paper.title,
    registryEvidenceRecordId,
    evidenceRecordId,
    paperEvidenceId,
    locatorEvidenceId,
    responseEvidenceId,
    answerEvidenceId,
    reviewedAt,
    coverage: {
      coverageKind: paper.coverage.coverageKind,
      declaredScopeLabel: paper.coverage.declaredScopeLabel,
      observedTerminal: paper.coverage.observedTerminal,
      note: paper.coverage.note
    },
    ...(paper.variant ? { variant: {
      kind: paper.variant.kind,
      primaryPaperId: paper.variant.primaryPaperId,
      sharedQuestionLinks: paper.variant.sharedQuestionLinks
    } } : {}),
    questions: questions.map(question => {
      const status = String(question.answerCheck && question.answerCheck.status || "pending");
      const note = String(question.answerCheck && question.answerCheck.note || "").trim();
      return {
        number: question.number,
        page: question.locator.page,
        slot: question.locator.slot,
        responseFormat: question.responseFormat.kind,
        slotCount: question.responseFormat.slotCount,
        semester: question.classification.semester,
        unit: question.classification.unit,
        typeLabel: question.classification.typeLabel,
        ...(status !== "verified" || note ? { answerStatus: status } : {}),
        ...(note ? { answerNote: note } : {})
      };
    })
  };
  validatePacket(packet);
  return packet;
}

function main(args) {
  if (args.length < 4 || args.length > 6) throw new Error("사용법: export-dolpa-paper-review.cjs <question-db> <paper-id> <reviewed-at> <output> [review-decisions] [paper-links]");
  const database = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const decisions = args[4] ? JSON.parse(fs.readFileSync(path.resolve(args[4]), "utf8")) : null;
  const links = args[5] ? JSON.parse(fs.readFileSync(path.resolve(args[5]), "utf8")) : null;
  const packet = exportReviewPacket(database, args[1], args[2], decisions, links);
  fs.writeFileSync(path.resolve(args[3]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ paperId: packet.paperId, questionCount: packet.questions.length })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ exportReviewPacket });
