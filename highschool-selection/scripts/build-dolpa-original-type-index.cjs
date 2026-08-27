"use strict";

const fs = require("node:fs");
const path = require("node:path");
const types = require("../data/dp-original-question-types.js");

const outputPath = process.argv[2];
if (!outputPath) {
  throw new Error("저장할 JSON 파일 경로가 필요합니다.");
}

const issues = types.validate();
if (issues.length) {
  throw new Error(`돌파 원본 유형 목록을 확인해 주세요: ${issues.join(", ")}`);
}

const papers = Object.values(types.sets).map(function (set) {
  return {
    paperId: set.id,
    title: set.title,
    sourceKind: set.sourceKind,
    questionCount: set.items.length,
    originalCount: set.originalCount,
    replacementCount: set.replacementCount,
    questions: set.items.map(function (item) {
      return {
        number: item.number,
        semester: item.semester,
        unit: item.unit,
        type: item.label,
        sourceKind: item.sourceKind,
        sourceRelation: item.sourceRelation,
        similarQuestionStatus: "만들기 전"
      };
    })
  };
});

const output = {
  schemaVersion: 1,
  title: "돌파 원본·검산 완료 대체 문항 유형",
  rules: [
    "돌파 원본 시험지를 먼저 사용한다.",
    "원본 문제 한 개를 문제 유형 한 개로 나눈다.",
    "원문 조건 때문에 교체한 문항은 검산 완료 대체 문항으로 따로 표시한다.",
    "고쟁이와 다른 참고 문제는 추가 연습 문제로만 사용한다.",
    "돌파 원본과 맞춰 보지 않은 추가 문제는 학생에게 보여 주지 않는다."
  ],
  totalQuestionCount: papers.reduce((sum, paper) => sum + paper.questionCount, 0),
  papers
};

fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(output, null, 2)}\n`, "utf8");
process.stdout.write(`${path.resolve(outputPath)}\n${output.totalQuestionCount}\n`);
