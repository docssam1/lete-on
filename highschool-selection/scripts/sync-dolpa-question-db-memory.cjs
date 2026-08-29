"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function fingerprint(filePath) {
  const bytes = fs.readFileSync(path.resolve(filePath));
  const stat = fs.statSync(path.resolve(filePath), { bigint: true });
  return {
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    size: Number(stat.size),
    mtime_ns: Number(stat.mtimeNs)
  };
}

function upsert(list, id, value) {
  const index = list.findIndex(item => item.id === id);
  if (index >= 0) list[index] = value;
  else list.push(value);
}

function source(id, title, relativePath, filePath) {
  return { id, title, path: relativePath, kind: "json", sensitivity: "private", ...fingerprint(filePath) };
}

function methodReviewInfo(pageAssetsPath, methodReviewPath, classificationReviewPath, paperReviewPath) {
  const manifest = pageAssetsPath ? readJson(pageAssetsPath) : null;
  const packet = methodReviewPath ? readJson(methodReviewPath) : null;
  const classificationPacket = classificationReviewPath ? readJson(classificationReviewPath) : null;
  const paperPacket = paperReviewPath ? readJson(paperReviewPath) : null;
  const sourceIds = [manifest && manifest.sourceId, packet && packet.sourceId, classificationPacket && classificationPacket.sourceId,
    paperPacket && paperPacket.sourceId].filter(Boolean);
  const sourceId = sourceIds[0] || "";
  if (new Set(sourceIds).size > 1) throw new Error("원본 페이지와 검수표의 sourceId가 다릅니다.");
  const known = {
    "DP-SRC-DE99B9857905": { key: "m22", label: "중2-2", tags: ["middle2-2"] },
    "DP-SRC-D59E26A73CC1": { key: "cm1", label: "공통수학1", tags: ["common-math-1"] },
    "DP-SRC-A64644977758": { key: "m21a", label: "2-1A", tags: ["middle2-1", "advanced"] },
    "DP-SRC-DB47B7D84331": { key: "m21a-r2", label: "2-1A 2회", tags: ["middle2-1", "mid-unit-cutoff"] },
    "DP-SRC-31111C2CA38E": { key: "m22-r3", label: "중2-2 3회", tags: ["middle2-2", "mixed-range"] },
    "DP-SRC-5CD3016EB886": { key: "m22s-r2", label: "중2-2S 2회", tags: ["middle2-2", "full-range"] },
    "DP-SRC-2B760BCB6E29": { key: "m22s-r3", label: "중2-2S 3회", tags: ["middle2-2", "full-range"] },
    "DP-SRC-40CB36024FBC": { key: "m21s-r3", label: "2-1S 3회", tags: ["middle2-1", "advanced", "mid-unit-cutoff"] }
  }[sourceId];
  if (!known) throw new Error(`지원하지 않는 풀이법 검수 원본입니다: ${sourceId}`);
  return {
    ...known,
    sourceId,
    pageSourceId: `dp-${known.key}-page-assets-v1`,
    methodSourceId: `dp-${known.key}-method-review-v1`,
    classificationSourceId: `dp-${known.key}-classification-review-v1`,
    paperSourceId: `dp-${known.key}-paper-review-v1`,
    recordId: `dp.${known.key}.method-review.20260829`,
    pageTitle: `돌파 ${known.label} 문항 원본 페이지 목록`,
    methodTitle: `돌파 ${known.label} 대표 시험 풀이법 검수표`,
    recordTitle: `돌파 ${known.label} 대표 시험 30문항 풀이 방법 검수`,
    pageRelativePath: `지필드메모리/highschool-selection/artifacts/question-pages/dolpa/${sourceId}/manifest.json`,
    methodRelativePath: `지필드메모리/highschool-selection/question-bank/${path.basename(methodReviewPath || "")}`,
    classificationRelativePath: `지필드메모리/highschool-selection/question-bank/${path.basename(classificationReviewPath || "")}`,
    paperRelativePath: `지필드메모리/highschool-selection/question-bank/${path.basename(paperReviewPath || "")}`
  };
}

function sync(catalog, ledger, database, paths) {
  if (ledger.schemaVersion !== 1 || database.schemaVersion !== 1) throw new Error("작업 장부 또는 문항 DB 버전을 확인해 주세요.");
  const sources = [
    source("dp-work-ledger-v1", "돌파 원본 작업 장부", "지필드메모리/highschool-selection/question-bank/dolpa-work-ledger-v1.json", paths.ledger),
    source("dp-question-db-v1", "돌파 문항 DB", "지필드메모리/highschool-selection/question-bank/dolpa-question-db-v1.json", paths.database),
    source("dp-paper-links-v1", "돌파 대표 시험지 원본 연결", "지필드메모리/highschool-selection/question-bank/dolpa-paper-links-v1.json", paths.paperLinks),
    source("dp-review-decisions-v1", "돌파 검수 결정 기록", "지필드메모리/highschool-selection/question-bank/dolpa-review-decisions-v1.json", paths.reviewDecisions)
  ];
  if (paths.typeIndex) {
    sources.push(source("dp-original-question-index-v1", "돌파 원본 문항 유형표", "지필드메모리/highschool-selection/question-bank/dolpa-original-question-index-v1.json", paths.typeIndex));
  }
  const methodInfo = paths.pageAssets || paths.methodReview || paths.classificationReview || paths.paperReview
    ? methodReviewInfo(paths.pageAssets, paths.methodReview, paths.classificationReview, paths.paperReview)
    : null;
  if (paths.pageAssets) sources.push(source(methodInfo.pageSourceId, methodInfo.pageTitle, methodInfo.pageRelativePath, paths.pageAssets));
  if (paths.targetSourcePlan) {
    sources.push(source("dp-target-source-plan-v1", "돌파 시험별 원본 사용 계획", "지필드메모리/highschool-selection/question-bank/dolpa-target-source-plan-v1.json", paths.targetSourcePlan));
  }
  if (paths.targetAssembly) {
    sources.push(source("dp-target-assembly-v1", "돌파 현재 범위 원본 문항 구성표", "지필드메모리/highschool-selection/question-bank/dolpa-target-assembly-v1.json", paths.targetAssembly));
  }
  if (paths.methodReview) sources.push(source(methodInfo.methodSourceId, methodInfo.methodTitle, methodInfo.methodRelativePath, paths.methodReview));
  if (paths.classificationReview) {
    sources.push(source(methodInfo.classificationSourceId, `돌파 ${methodInfo.label} 분류 교정표`, methodInfo.classificationRelativePath, paths.classificationReview));
  }
  if (paths.paperReview) sources.push(source(methodInfo.paperSourceId, `돌파 ${methodInfo.label} 시험지 복원 검수표`, methodInfo.paperRelativePath, paths.paperReview));
  sources.forEach(item => upsert(catalog.sources, item.id, item));
  const summary = database.summary;
  const equivalentSourceCount = (database.papers || []).reduce((sum, paper) => sum + (paper.equivalentSources || []).length, 0);
  upsert(catalog.records, "dp.question-db.20260827", {
    id: "dp.question-db.20260827",
    title: "돌파 문항 DB와 반복 방지 작업 장부",
    aliases: ["돌파 문제 DB", "돌파 유형 DB"],
    tags: ["dp", "question-bank", "classification", "work-ledger"],
    summary: `돌파 고유 원본 ${ledger.summary.sourceCount}개를 sourceId로 관리하고, PDF 완료 ${ledger.summary.convertedSourceCount}개와 표지 확인 ${ledger.summary.coverVerifiedSourceCount}개를 이어받는다. 현재 문항 DB는 대표 시험지 ${summary.paperCount}회, ${summary.questionCount}문항, 세부 유형 ${summary.typeCount}개이며 같은 시험의 다른 원본 파일 ${equivalentSourceCount}개는 문항을 복제하지 않고 대표 시험지에 연결했다. 학년·영역·단원·세부 유형 ${summary.classificationVerifiedCount}문항, 원본 쪽 ${summary.locatorVerifiedCount}문항, 풀이 방법 ${summary.methodVerifiedCount}문항, 난이도 ${summary.difficultyVerifiedCount}문항, 답안 형식 ${summary.responseVerifiedCount}문항, 답 확인 ${summary.answerVerifiedCount}문항이 확정됐다. 시험형은 돌파·생수·원수학 기본·원수학 듀얼·이든·황소·깊은생각을 분리하며, 돌파 원본 외 사용은 호환성 검수 전 후보 상태다. 풀이법과 유사문항은 별도 근거가 있어야 확정한다.`,
    status: "verified",
    sensitivity: "private",
    updated: "2026-08-29",
    pointers: [
      { source_id: "dp-question-db-v1", role: "audit", locator: "summary, papers, typeCatalog, questions", note: "문항 ID·유형 ID·중복·금지 필드 자동검사 통과" },
      { source_id: "dp-work-ledger-v1", role: "test", locator: "summary, sources[1:334]", note: "변환·표지·본문·답안·문항분리·유형·난이도·분석지 상태 분리" },
      { source_id: "dp-paper-links-v1", role: "decision", locator: "links", note: "대표 시험지와 원본 sourceId 연결" },
      { source_id: "dp-review-decisions-v1", role: "decision", locator: "rangeReviews, sourceReviews", note: "이미 끝낸 검수를 다시 하지 않기 위한 결정 기록" }
    ]
  });
  if (paths.pageAssets) {
    catalog.records.find(record => record.id === "dp.question-db.20260827").pointers.push({
      source_id: methodInfo.pageSourceId,
      role: "test",
      locator: "assets[1:8]",
      note: `${methodInfo.label} 원본 3~10쪽 PNG의 파일명·크기·해시 확인`
    });
  }
  if (paths.targetSourcePlan && paths.targetAssembly) {
    const assembly = readJson(paths.targetAssembly);
    const middle = (assembly.targets || []).find(target => target.targetId === "dp-middle2-2-transfer");
    catalog.records.find(record => record.id === "dp.question-db.20260827").pointers.push(
      { source_id: "dp-target-source-plan-v1", role: "decision", locator: "targets.dp-middle2-2-transfer", note: "검수한 원본 시험지와 선택 30문항의 고정 순서" },
      { source_id: "dp-target-assembly-v1", role: "audit", locator: "targets.dp-middle2-2-transfer", note: `범위 안 원본 후보 ${middle ? middle.includedCount : 0}문항, 실제 구성 ${middle ? middle.selectedCount : 0}문항, 예비 ${middle ? middle.reserveCount : 0}문항 분리` }
    );
  }
  if (paths.methodReview) {
    catalog.records.find(record => record.id === "dp.question-db.20260827").pointers.push({
      source_id: methodInfo.methodSourceId,
      role: "decision",
      locator: "reviews[1:30]",
      note: `${methodInfo.label} 대표 시험 30문항의 풀이 구조와 방법 태그를 원본 페이지와 대조`
    });
    upsert(catalog.records, methodInfo.recordId, {
      id: methodInfo.recordId,
      title: methodInfo.recordTitle,
      aliases: [`돌파 ${methodInfo.label} 풀이법`],
      tags: ["dp", ...methodInfo.tags, "method-review", "visual-review"],
      summary: `${methodInfo.label} 대표 시험 30문항을 원본 3~10쪽에서 직접 확인해 실제 풀이 순서와 방법 태그를 연결했다. 문제 원문과 정답 값은 저장하지 않았고, 다른 학원 문제와 비교할 수 있는 교육과정 용어만 남겼다.`,
      status: "verified",
      sensitivity: "private",
      updated: "2026-08-29",
      pointers: [
        { source_id: methodInfo.pageSourceId, role: "render", locator: "assets[1:8], pp.3-10", note: "원본 30문항 시각 대조" },
        { source_id: methodInfo.methodSourceId, role: "decision", locator: "reviews[1:30]", note: "풀이 구조와 방법 태그 검수 결과" }
      ]
    });
  }
  if (paths.classificationReview) {
    catalog.records.find(record => record.id === "dp.question-db.20260827").pointers.push({
      source_id: methodInfo.classificationSourceId,
      role: "decision",
      locator: "reviews",
      note: `${methodInfo.label} 원본 대조 중 확인한 단원·영역 분류 교정`
    });
    const methodRecord = catalog.records.find(record => record.id === methodInfo.recordId);
    if (methodRecord) methodRecord.pointers.push({
      source_id: methodInfo.classificationSourceId,
      role: "decision",
      locator: "reviews",
      note: "풀이 구조를 확인하면서 발견한 분류 오류를 함께 교정"
    });
  }
  if (paths.paperReview) {
    catalog.records.find(record => record.id === "dp.question-db.20260827").pointers.push({
      source_id: methodInfo.paperSourceId,
      role: "decision",
      locator: "coverage, questions[1:30]",
      note: `${methodInfo.label} 시험 범위·문항 위치·답안 형식의 재생성용 검수 결과`
    });
    const methodRecord = catalog.records.find(record => record.id === methodInfo.recordId);
    if (methodRecord) methodRecord.pointers.push({
      source_id: methodInfo.paperSourceId,
      role: "decision",
      locator: "coverage, questions[1:30]",
      note: "문항 DB를 다시 만들 때 원본 위치와 답안 형식을 복원"
    });
  }
  if (paths.typeIndex) {
    catalog.records.find(record => record.id === "dp.question-db.20260827").pointers.push({
      source_id: "dp-original-question-index-v1",
      role: "decision",
      locator: "papers, questions",
      note: "검수 완료 대표 시험지의 문항별 학기·단원·세부 유형"
    });
  }
  catalog.updated = "2026-08-29";
  return catalog;
}

function main(args) {
  if (args.length < 5 || args.length > 12) throw new Error("사용법: node sync-dolpa-question-db-memory.cjs <source-memory> <ledger> <question-db> <paper-links> <review-decisions> [page-assets-manifest] [target-source-plan] [target-assembly] [method-review] [classification-review] [paper-review] [type-index]");
  const required = args.slice(0, 5).map(value => path.resolve(value));
  const optional = args.slice(5).map(value => value === "-" ? null : path.resolve(value));
  const [catalogPath, ledgerPath, databasePath, paperLinksPath, reviewDecisionsPath] = required;
  const [pageAssetsPath, targetSourcePlanPath, targetAssemblyPath, methodReviewPath, classificationReviewPath, paperReviewPath, typeIndexPath] = optional;
  const catalog = sync(readJson(catalogPath), readJson(ledgerPath), readJson(databasePath), {
    ledger: ledgerPath,
    database: databasePath,
    paperLinks: paperLinksPath,
    reviewDecisions: reviewDecisionsPath,
    pageAssets: pageAssetsPath,
    targetSourcePlan: targetSourcePlanPath,
    targetAssembly: targetAssemblyPath,
    methodReview: methodReviewPath,
    classificationReview: classificationReviewPath,
    paperReview: paperReviewPath,
    typeIndex: typeIndexPath
  });
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sources: catalog.sources.length, records: catalog.records.length })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ methodReviewInfo, sync });
