"use strict";

const fs = require("node:fs");
const path = require("node:path");

const catalogPath = process.argv[2];
const sharedTypeIndexPath = process.argv[3];
if (!catalogPath || !sharedTypeIndexPath) {
  throw new Error("자료 목록과 공통수학 문제 유형 파일 경로가 필요합니다.");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(path.resolve(filePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isOldDolpaBundle(sourceId) {
  return String(sourceId || "").startsWith("mathflat-cm1-dolpa-");
}

const catalog = readJson(catalogPath);
const typeIndex = readJson(sharedTypeIndexPath);
if (!Array.isArray(catalog.sources) || !Array.isArray(catalog.records)) {
  throw new Error("자료 목록 파일의 모양이 맞지 않습니다.");
}
if (!typeIndex.academy_profiles || !Array.isArray(typeIndex.types)) {
  throw new Error("공통수학 문제 유형 파일의 모양이 맞지 않습니다.");
}
let sourceCount = 0;
let recordCount = 0;
const bundleTitles = {
  "questionbank.mathflat-cm1-dolpa-quad-001": "고쟁이 참고 · 이차함수 추가 연습 문제",
  "questionbank.mathflat-cm1-dolpa-matrix-002": "고쟁이 참고 · 행렬 추가 연습 문제",
  "questionbank.mathflat-cm1-dolpa-factor-003": "고쟁이 참고 · 인수분해 추가 연습 문제",
  "questionbank.mathflat-cm1-dolpa-combination-004": "고쟁이 참고 · 경우의 수 추가 연습 문제"
};

catalog.sources.forEach(function (source) {
  if (!isOldDolpaBundle(source.id)) return;
  source.title = String(source.title || "")
    .replace(/^돌파 공통수학1/, "고쟁이 참고 공통수학1")
    .replace(/^돌파 공수1/, "고쟁이 참고 공통수학1");
  sourceCount += 1;
});

catalog.records.forEach(function (record) {
  const usesOldBundle = Array.isArray(record.pointers)
    && record.pointers.some(pointer => isOldDolpaBundle(pointer.source_id));
  if (!usesOldBundle) return;
  record.title = bundleTitles[record.id] || record.title;
  record.tags = Array.from(new Set(
    (Array.isArray(record.tags) ? record.tags : [])
      .filter(tag => tag !== "돌파" && tag !== "dp")
      .concat(["고쟁이", "추가-연습-문제"])
  ));
  const oldSummary = String(record.summary || "")
    .replace(/^고쟁이 참고 문제에서 확인한 공통수학1 유형이다\. 돌파 원본 문제가 아니며, 돌파 원본과 풀이 방법이 같은지 확인한 뒤 추가 연습 문제로만 사용할 수 있다\.\s*/, "")
    .replace(/돌파[^.]*후보 유형\.?/g, "")
    .replace(/유형 메타데이터/g, "문제 유형 정보")
    .replace(/독립 검산/g, "다른 방법으로 답 확인")
    .replace(/공개 잠금 상태/g, "학생에게 보여 주지 않는 상태")
    .trim();
  record.summary = `고쟁이 참고 문제에서 확인한 공통수학1 유형이다. 돌파 원본 문제가 아니며, 돌파 원본과 풀이 방법이 같은지 확인한 뒤 추가 연습 문제로만 사용할 수 있다. ${oldSummary}`.trim();
  record.updated = "2026-08-27";
  recordCount += 1;
});

typeIndex.academy_profiles.돌파 = {
  profile_id: "PROFILE.DOLPA.ORIGINAL.FIRST.V1",
  status: "돌파 원본 시험지 먼저",
  use: "원본 시험지 유형 확인 후 추가 연습",
  calibration: "돌파 원본 회차의 문제 순서와 어려운 정도를 먼저 따른다."
};
typeIndex.dolpa_source_rule = {
  primary: "dolpa-original-question-index-v1",
  primary_question_count: 60,
  supplement: "고쟁이와 다른 참고 문제",
  supplement_rule: "돌파 원본과 풀이 방법이 같은지 확인하기 전에는 사용하지 않는다."
};

let supplementCount = 0;
let pendingCount = 0;
typeIndex.types.forEach(function (type) {
  if (!type.academy_fit || !type.academy_fit.돌파) return;
  const isGojaengi = Array.isArray(type.evidence)
    && type.evidence.some(evidence => isOldDolpaBundle(evidence.bundle_id));
  if (isGojaengi) {
    type.academy_fit.돌파 = "추가 연습 문제";
    supplementCount += 1;
  } else {
    type.academy_fit.돌파 = "원본과 맞춰 보기 전";
    pendingCount += 1;
  }
});

if (sourceCount !== 16 || recordCount !== 16 || supplementCount !== 12 || pendingCount !== 17) {
  throw new Error(`바꿀 자료 수가 예상과 다릅니다: ${JSON.stringify({ sourceCount, recordCount, supplementCount, pendingCount })}`);
}

catalog.updated = "2026-08-27";
typeIndex.updated_at = "2026-08-27";
writeJson(catalogPath, catalog);
writeJson(sharedTypeIndexPath, typeIndex);
process.stdout.write(JSON.stringify({ sourceCount, recordCount, supplementCount, pendingCount }));
