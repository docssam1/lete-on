const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..", "..");
function load(relativePath) {
  const filename = path.join(root, relativePath);
  vm.runInThisContext(fs.readFileSync(filename, "utf8"), { filename });
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

load("hyper-focus/generator/q01.js");
load("hyper-focus/generator/stacking.js");
load("hyper-focus/mock/mock-core.js");

const answerSets = Object.fromEntries([1, 2, 3, 4, 5].map((id) => [id, new Set()]));
let questionCount = 0;
for (let seed = 1; seed <= 250; seed += 1) {
  const examA = globalThis.HFMock.createExam(seed);
  const examB = globalThis.HFMock.createExam(seed);
  assert(examA.questions.length === 10, `seed ${seed}: 문항 수 불일치`);
  assert(
    JSON.stringify(examA.questions.map((q) => q.payload)) === JSON.stringify(examB.questions.map((q) => q.payload)),
    `seed ${seed}: 재현성 실패`
  );
  examA.questions.forEach((question) => {
    questionCount += 1;
    assert(question.problemHtml.includes("<svg"), `${question.typeCode}: SVG 없음`);
    assert(question.answer !== undefined && question.answer !== null, `${question.typeCode}: 정답 없음`);
    answerSets[question.typeId].add(JSON.stringify(question.answer));
  });
}

Object.entries(answerSets).forEach(([typeId, answers]) => {
  assert(answers.size >= 3, `q${String(typeId).padStart(2, "0")}: 정답 다양성 ${answers.size}종`);
});

const practice = globalThis.HFMock.createPractice([1, 3, 5], {
  seed: 777,
  countPerType: 4,
  difficulty: "mixed"
});
assert(practice.questions.length === 12, "약점 문제지 문항 수 불일치");
assert(new Set(practice.questions.map((q) => q.typeId)).size === 3, "약점 유형 누락");

const exam = globalThis.HFMock.createExam(12345);
const marks = Object.fromEntries(exam.questions.map((q) => [String(q.number), q.typeId % 2 ? "x" : "o"]));
const result = globalThis.HFMock.resultFromMarks(exam, marks);
assert(result.total === 10 && result.correctCount === 4 && result.wrongCount === 6, "채점 집계 불일치");
assert(result.wrongTypeIds.join(",") === "1,3,5", "오답 유형 집계 불일치");

[
  ["hyper-focus/mock/index.html", ["mock-core.js", "questionList", "resultFromMarks", "viewer.html"]],
  ["hyper-focus/mock/viewer.html", ["mock-core.js", "createPractice", "window.print", "solutions"]]
].forEach(([relativePath, needles]) => {
  const html = fs.readFileSync(path.join(root, relativePath), "utf8");
  needles.forEach((needle) => assert(html.includes(needle), `${relativePath}: ${needle} 계약 누락`));
  const documentDir = path.dirname(path.join(root, relativePath));
  const localRefs = [...html.matchAll(/(?:src|href)="([^"#?]+)[^"]*"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^(?:https?:|#)/.test(ref) && !ref.includes("${"));
  localRefs.forEach((ref) => {
    const resolved = path.resolve(documentDir, ref);
    assert(fs.existsSync(resolved), `${relativePath}: 로컬 참조 없음 ${ref}`);
  });
});

console.log("PASS");
console.log(`- generated and validated mock questions: ${questionCount}`);
console.log(`- answer varieties: ${Object.entries(answerSets).map(([id, set]) => `q${String(id).padStart(2, "0")}=${set.size}`).join(", ")}`);
console.log(`- practice worksheet: ${practice.questions.length} questions across 3 weak types`);
console.log("- scoring contract: 10 questions -> wrong types q01, q03, q05");
