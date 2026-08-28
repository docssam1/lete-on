import assert from "node:assert/strict";
import { TYPES, typeById } from "./source-data.js";
import { RESULT_EXAMS, analyzeExamResults, remediationUrl, textbookReferencesForType } from "./result-diagnosis-data.js";

assert.equal(RESULT_EXAMS.length, 19, "진단 대상 시험은 19종이어야 한다.");
assert.equal(RESULT_EXAMS.reduce((sum, exam) => sum + exam.questions.length, 0), 385, "20·25문항 시험 합계가 달라졌다.");
assert.deepEqual([...new Set(RESULT_EXAMS.map((exam) => exam.questions.length))].sort((a, b) => a - b), [20, 25]);

for (const exam of RESULT_EXAMS) {
  assert.ok(exam.questions.length === 20 || exam.questions.length === 25, `${exam.id}: 지원하지 않는 문항 수`);
  assert.ok(exam.questions.every((question) => question.verified), `${exam.id}: 미검증 문항이 진단 목록에 포함됨`);
  for (const question of exam.questions) {
    assert.ok(typeById(question.typeId), `${exam.id} ${question.number}번: 유형 없음`);
    assert.ok(question.classification?.majorDomainId, `${exam.id} ${question.number}번: 대분류 없음`);
    assert.ok(question.classification?.minorDomain, `${exam.id} ${question.number}번: 중분류 없음`);
    assert.equal(question.classification?.detailedTypeId, question.typeId, `${exam.id} ${question.number}번: 세부 유형 불일치`);
  }
}

const exam20 = RESULT_EXAMS.find((exam) => exam.questions.length === 20);
const responses20 = Object.fromEntries(exam20.questions.map((question, index) => [question.number, index < 15 ? "correct" : "incorrect"]));
const analysis20 = analyzeExamResults(exam20, responses20);
assert.deepEqual({ total: analysis20.total, correct: analysis20.correct, wrong: analysis20.wrong, score: analysis20.score, complete: analysis20.complete }, { total: 20, correct: 15, wrong: 5, score: 75, complete: true });
assert.equal(analysis20.weakTypes.reduce((sum, row) => sum + row.wrong, 0), 5, "20문항 오답이 중복 또는 누락됨");

const exam25 = RESULT_EXAMS.find((exam) => exam.questions.length === 25);
const responses25 = Object.fromEntries(exam25.questions.map((question, index) => [question.number, index < 20 ? "correct" : "incorrect"]));
const analysis25 = analyzeExamResults(exam25, responses25);
assert.deepEqual({ total: analysis25.total, correct: analysis25.correct, wrong: analysis25.wrong, score: analysis25.score, complete: analysis25.complete }, { total: 25, correct: 20, wrong: 5, score: 80, complete: true });
assert.equal(analysis25.questionResults.length, 25);

const duplicateTypeExam = {
  id: "audit-duplicate",
  label: "중복 유형 집계 검사",
  questions: [1, 2, 3].map((number) => ({ number, typeId: TYPES[0].id, classification: TYPES[0].classification, verified: true }))
};
const duplicateAnalysis = analyzeExamResults(duplicateTypeExam, { 1: "incorrect", 2: "correct", 3: "incorrect" });
assert.equal(duplicateAnalysis.weakTypes.length, 1);
assert.deepEqual(duplicateAnalysis.weakTypes[0].wrongNumbers, [1, 3]);
assert.equal(duplicateAnalysis.weakTypes[0].wrongRate, 67);

const weakIds = analysis25.weakTypes.map((row) => row.id);
const url = new URL(remediationUrl(weakIds, "DEMO", 25), "https://example.test/fields-classic/question-bank/");
assert.equal(url.searchParams.get("mode"), "type");
assert.equal(url.searchParams.get("count"), "25");
assert.deepEqual(url.searchParams.get("types").split(","), [...new Set(weakIds)]);
assert.ok(weakIds.every((id) => typeById(id)), "보충 학습지 URL에 없는 유형이 포함됨");

const mappedTextbookTypes = new Set(TYPES.filter((type) => textbookReferencesForType(type.id).length).map((type) => type.id));
assert.ok(mappedTextbookTypes.size > 0, "교재 단계 연결이 비어 있음");

console.log(JSON.stringify({
  examCount: RESULT_EXAMS.length,
  questionCount: RESULT_EXAMS.reduce((sum, exam) => sum + exam.questions.length, 0),
  supportedLengths: [20, 25],
  mappedTextbookTypeCount: mappedTextbookTypes.size,
  sample20: { correct: analysis20.correct, wrong: analysis20.wrong, score: analysis20.score },
  sample25: { correct: analysis25.correct, wrong: analysis25.wrong, score: analysis25.score }
}, null, 2));
