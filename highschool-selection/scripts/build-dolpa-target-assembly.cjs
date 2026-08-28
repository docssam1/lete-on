"use strict";

const fs = require("node:fs");
const path = require("node:path");
const scopes = require("../data/dolpa-target-scopes.js");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function build(database, sourcePlan) {
  const questionsByPaper = new Map();
  (database.questions || []).forEach(question => {
    if (!questionsByPaper.has(question.paperId)) questionsByPaper.set(question.paperId, []);
    questionsByPaper.get(question.paperId).push(question);
  });

  const targets = scopes.targets.map(target => {
    const plan = (sourcePlan.targets || []).find(entry => entry.targetId === target.id);
    if (!plan) throw new Error(`원본 시험지 계획이 없습니다: ${target.id}`);
    const indexed = (plan.indexedPaperIds || []).flatMap(paperId => questionsByPaper.get(paperId) || []);
    const included = [];
    const excluded = [];
    indexed.sort((left, right) => left.paperId.localeCompare(right.paperId) || left.number - right.number).forEach(question => {
      const decision = scopes.evaluateQuestion(target.id, question);
      const record = {
        questionId: question.questionId,
        paperId: question.paperId,
        number: question.number,
        semester: question.classification.semester,
        unit: question.classification.minorUnit,
        sourceRelation: question.sourceRelation
      };
      if (decision.eligible) included.push(record);
      else excluded.push({ ...record, reason: decision.reason });
    });
    const shortage = Math.max(0, target.expectedQuestionCount - included.length);
    const includedById = new Map(included.map(item => [item.questionId, item]));
    const selectedIds = Array.isArray(plan.selectedQuestionIds) ? plan.selectedQuestionIds : [];
    const selected = selectedIds.map(questionId => {
      const item = includedById.get(questionId);
      if (!item) throw new Error(`선택한 문항이 범위 안 원본 후보가 아닙니다: ${questionId}`);
      return item;
    });
    const selectedSet = new Set(selectedIds);
    const reserve = included.filter(item => !selectedSet.has(item.questionId));
    const selectedShortage = Math.max(0, target.expectedQuestionCount - selected.length);
    return {
      targetId: target.id,
      title: target.title,
      scopeLabel: target.scopeLabel,
      expectedQuestionCount: target.expectedQuestionCount,
      assemblyPolicy: "범위 안의 실제 돌파 원본 문항만 사용",
      includedQuestionIds: included.map(item => item.questionId),
      included,
      excluded,
      includedCount: included.length,
      excludedCount: excluded.length,
      shortage,
      selectedQuestionIds: selectedIds,
      selected,
      selectedCount: selected.length,
      reserve,
      reserveCount: reserve.length,
      selectedShortage,
      sourcePapersToReview: plan.sourcePapersToReview || [],
      assemblyStatus: selected.length === target.expectedQuestionCount
        ? "ready_for_final_review"
        : shortage === 0 ? "ready_for_item_selection" : "waiting_for_original_items"
    };
  });

  return {
    schemaVersion: 1,
    title: "돌파 원본 문항 시험별 구성표",
    generatedAt: new Date().toISOString(),
    rules: [
      "원본 시험지는 삭제하거나 이름을 바꾸지 않는다.",
      "범위 밖 문항은 원본 DB에 남기고 해당 시험 구성에서만 제외한다.",
      "대체 문항·교재 문항·생성 문항은 원본 문항 자리에 넣지 않는다.",
      "부족한 자리는 다른 돌파 원본 시험지를 문항별로 검수한 뒤 채운다."
    ],
    targets
  };
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node build-dolpa-target-assembly.cjs <문항DB> <원본계획> <출력JSON>");
  const result = build(readJson(args[0]), readJson(args[1]));
  fs.writeFileSync(path.resolve(args[2]), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(result.targets.map(target => ({
    targetId: target.targetId,
    included: target.includedCount,
    excluded: target.excludedCount,
    shortage: target.shortage,
    selected: target.selectedCount,
    reserve: target.reserveCount,
    status: target.assemblyStatus
  })), null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ build });
