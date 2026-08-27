"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const [catalogArgument, typeIndexArgument, questionIndexArgument] = process.argv.slice(2);
if (!catalogArgument || !typeIndexArgument || !questionIndexArgument) {
  throw new Error("자료 목록, 공통 문제 유형 목록, 돌파 회차 문항 목록 경로가 필요합니다.");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function fingerprint(filePath) {
  const bytes = fs.readFileSync(filePath);
  const stat = fs.statSync(filePath, { bigint: true });
  return {
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    size: Number(stat.size),
    mtime_ns: Number(stat.mtimeNs)
  };
}

const catalogPath = path.resolve(catalogArgument);
const typeIndexPath = path.resolve(typeIndexArgument);
const questionIndexPath = path.resolve(questionIndexArgument);
const catalog = readJson(catalogPath);
const typeIndex = readJson(typeIndexPath);
const questionIndex = readJson(questionIndexPath);

const papers = Array.isArray(questionIndex.papers) ? questionIndex.papers : [];
const questions = papers.flatMap(paper => Array.isArray(paper.questions) ? paper.questions : []);
const originalCount = questions.filter(question => question.sourceRelation === "original").length;
const replacementCount = questions.filter(question => question.sourceRelation === "replacement").length;
if (papers.length !== 2 || questions.length !== 60 || originalCount !== 59 || replacementCount !== 1) {
  throw new Error(`돌파 회차 문항 구성이 맞지 않습니다: ${JSON.stringify({ papers: papers.length, questions: questions.length, originalCount, replacementCount })}`);
}

const replacement = questions.find(question => question.sourceRelation === "replacement");
if (!replacement || replacement.number !== 29 || papers[1].questions[28] !== replacement) {
  throw new Error("공통수학1 29번 대체 문항 위치가 맞지 않습니다.");
}

const source = catalog.sources.find(entry => entry.id === "dp-original-question-index-v1");
const typeIndexSource = catalog.sources.find(entry => entry.id === "question-type-index-v1-20260825");
const record = catalog.records.find(entry => entry.id === "dp.question-classification-generator-status.20260825");
if (!source || !typeIndexSource || !record || !typeIndex.academy_profiles || !Array.isArray(typeIndex.types)) {
  throw new Error("갱신할 돌파 자료 메모리 항목을 찾지 못했습니다.");
}

Object.assign(source, fingerprint(questionIndexPath));
source.title = "돌파 원본 59문항·검산 완료 대체 1문항 유형";

record.title = "돌파 원본·검산 완료 대체 문항 유형과 유사문제 상태";
record.aliases = ["돌파 두 회차 60문항 현황"];
record.summary = "돌파 중2-2 편입 원본 30문항과 공통수학1 입학 회차 30문항을 문제마다 한 유형으로 나누었다. 전체 60문항은 원본 59문항과 원문 조건 때문에 교체한 검산 완료 대체 1문항으로 구분한다. 고쟁이 문제는 원본이 아니며 풀이 방법을 맞춰 본 뒤 추가 연습으로만 쓸 수 있다. 실제 유사문제 생성 코드는 아직 만들기 전이다.";
record.updated = "2026-08-27";
const indexPointer = record.pointers.find(pointer => pointer.source_id === "dp-original-question-index-v1");
if (!indexPointer) throw new Error("돌파 회차 문항 목록 포인터가 없습니다.");
indexPointer.locator = "papers[1:2].questions[1:30]";
indexPointer.note = "원본 59문항과 검산 완료 대체 1문항의 학년·학기·단원·문제 유형";

typeIndex.academy_profiles.돌파 = {
  profile_id: "PROFILE.DOLPA.ORIGINAL.FIRST.V1",
  status: "돌파 원본·검산 완료 대체 문항 분리",
  use: "원본 시험지 유형 확인 후 추가 연습",
  calibration: "돌파 원본 회차의 문제 순서와 어려운 정도를 먼저 따르되, 검산 완료 대체 문항은 원본과 구분한다."
};
typeIndex.dolpa_source_rule = {
  primary: "dolpa-original-question-index-v1",
  primary_question_count: 60,
  original_question_count: 59,
  verified_replacement_count: 1,
  supplement: "고쟁이와 다른 참고 문제",
  supplement_rule: "돌파 원본과 풀이 방법이 같은지 확인하기 전에는 사용하지 않는다."
};

catalog.updated = "2026-08-27";
typeIndex.updated_at = "2026-08-27";
writeJson(typeIndexPath, typeIndex);
Object.assign(typeIndexSource, fingerprint(typeIndexPath));
writeJson(catalogPath, catalog);

process.stdout.write(`${JSON.stringify({ questionCount: questions.length, originalCount, replacementCount })}\n`);
