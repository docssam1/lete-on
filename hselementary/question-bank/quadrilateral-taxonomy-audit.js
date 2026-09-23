"use strict";

global.window = {};
const inventory = require("./source-inventory-4-2-quadrilateral.js");
require("./curriculum.js");
require("./generators.js");
const perpendicularParallel = require("./source-4-2-perpendicular-parallel.js");
const parallelAngle = require("./source-4-2-parallel-angle.js");
const parallelChainOne = require("./source-4-2-parallel-angle-chain-one.js");
const parallelChainTwoMission3 = require("./source-4-2-parallel-angle-chain-two-mission3.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester?.units.find(item => item.id === "4-2-u4");
const types = unit?.subunits.flatMap(subunit => subunit.types) || [];
const failures = [];
let generatedCount = 0;

const check = (condition, message) => {
  if (!condition) failures.push(message);
};

check(inventory.totals.groups === 8, `원본 개념탐구는 8개여야 하나 ${inventory.totals.groups}개입니다.`);
check(inventory.items.length === 88, `원본 세부 유형은 88개여야 하나 ${inventory.items.length}개입니다.`);
check(inventory.totals.exploration === 8 && inventory.totals.example === 32 && inventory.totals.mission === 48, "개념탐구 8 + 예제 32 + Mission 48 수가 다릅니다.");
check(inventory.totals.ready === 31 && inventory.totals.locked === 57, "원장 공개·잠금 기준 수가 다릅니다.");
check(unit?.subunits.length === 8, `런타임 개념탐구 묶음은 8개여야 하나 ${unit?.subunits.length || 0}개입니다.`);
check(types.length === 88, `런타임 사각형 유형은 88개여야 하나 ${types.length}개입니다.`);

const inventoryById = new Map(inventory.items.map(item => [item.sourceItemId, item]));
const runtimeIds = new Set();
const sourceIds = new Set();
const labels = new Set();
const sectionCounts = { exploration: 0, example: 0, mission: 0 };

for (const [groupIndex, subunit] of (unit?.subunits || []).entries()) {
  check(subunit.types.length === 11, `${subunit.name}: 개념탐구 1 + 예제 4 + Mission 6 = 11유형이어야 하나 ${subunit.types.length}개입니다.`);
  const expectedGroup = inventory.groups[groupIndex];
  check(subunit.name === expectedGroup?.name, `${groupIndex + 1}번째 묶음명이 원본과 다릅니다.`);
  const groupSections = { exploration: 0, example: 0, mission: 0 };

  for (const type of subunit.types) {
    const source = inventoryById.get(type.sourceItemId);
    check(Boolean(source), `${type.id}: 88개 원장에 없는 원문 ID입니다.`);
    check(!runtimeIds.has(type.id), `${type.id}: 런타임 유형 주소가 중복됩니다.`);
    runtimeIds.add(type.id);
    check(!sourceIds.has(type.sourceItemId), `${type.sourceItemId}: 원문 ID가 중복됩니다.`);
    sourceIds.add(type.sourceItemId);
    check(!labels.has(type.label), `${type.sourceItemId}: 유형명 '${type.label}'이 다른 문제와 겹칩니다.`);
    labels.add(type.label);
    if (!source) continue;

    check(type.label === source.typeLabel, `${type.sourceItemId}: 유형명이 원장과 다릅니다.`);
    check(type.sourceVerified === true, `${type.sourceItemId}: 원문 눈검사 표시가 없습니다.`);
    check(type.sourceEvidence.includes(type.sourceItemId), `${type.sourceItemId}: 출처 문구에 원문 ID가 없습니다.`);
    check(type.sourcePdfPage === source.sourcePdfPage && type.sourcePrintedPage === source.sourcePrintedPage, `${type.sourceItemId}: PDF·교재 쪽수가 원장과 다릅니다.`);
    check(type.sourceSection === source.sourceSection, `${type.sourceItemId}: 개념탐구·예제·Mission 구분이 다릅니다.`);
    check(type.sourceItemLabel === source.sourceItemLabel, `${type.sourceItemId}: 원문 문항 표기가 다릅니다.`);
    check(type.reviewLocked === source.reviewLocked, `${type.sourceItemId}: 공개·잠금 상태가 원장과 다릅니다.`);
    check(type.answerVisualRequired === true, `${type.sourceItemId}: 정답 그림 필수 계약이 없습니다.`);
    sectionCounts[type.sourceSection] += 1;
    groupSections[type.sourceSection] += 1;

    if (type.reviewLocked) {
      check(Boolean(type.reviewReason), `${type.sourceItemId}: 잠금 사유가 없습니다.`);
      check(type.generationMode === "review-locked" && type.verifiedVariantCount === 0 && type.answerVisualStatus === "locked", `${type.sourceItemId}: 잠금 계약이 완전하지 않습니다.`);
      check(api.generate(type, 0, 0, 4200, type.variant) === null, `${type.sourceItemId}: 잠금 문항이 생성됩니다.`);
      continue;
    }

    const sourceModule = perpendicularParallel.SOURCE_IDS.includes(type.sourceItemId) ? perpendicularParallel
      : parallelAngle.SOURCE_IDS.includes(type.sourceItemId) ? parallelAngle
        : parallelChainOne.SOURCE_IDS.includes(type.sourceItemId) ? parallelChainOne
          : parallelChainTwoMission3.SOURCE_IDS.includes(type.sourceItemId) ? parallelChainTwoMission3
            : null;
    check(Boolean(sourceModule), `${type.sourceItemId}: 검증 생성기 허용 목록에 없습니다.`);
    check(type.generatorKey === sourceModule?.GENERATOR_KEY, `${type.sourceItemId}: 검증 생성기가 연결되지 않았습니다.`);
    check(type.generationMode === "fixed-verified-pool" && type.verifiedVariantCount === 3 && type.answerVisualStatus === "verified", `${type.sourceItemId}: 공개 유형의 고정 검증 계약이 다릅니다.`);

    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 200; seed += 1) {
        const generated = api.generate(type, 0, difficulty, seed, type.variant + seed - 1);
        generatedCount += 1;
        const visible = `${generated?.prompt || ""} ${generated?.answer ?? ""} ${generated?.solution || ""}`;
        if (!generated?.prompt || generated.answer === undefined || !generated?.solution || /undefined|null|NaN|Infinity/.test(visible)) {
          failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: 문제·정답·풀이가 깨졌습니다.`);
          break;
        }
        if (generated.answerCandidateCount !== 1 || !generated.answerVisual || generated.answerVisualStatus !== "verified") {
          failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: 단일 정답·정답 그림 계약이 깨졌습니다.`);
          break;
        }
      }
    }
  }

  check(groupSections.exploration === 1 && groupSections.example === 4 && groupSections.mission === 6, `${subunit.name}: 원문 구간 수가 1·4·6이 아닙니다.`);
}

check(sourceIds.size === 88, `고유 원문 ID는 88개여야 하나 ${sourceIds.size}개입니다.`);
check(sectionCounts.exploration === 8 && sectionCounts.example === 32 && sectionCounts.mission === 48, "런타임 개념탐구·예제·Mission 수가 8·32·48이 아닙니다.");
check(types.filter(type => !type.reviewLocked).length === 31, "검증 공개 유형은 31개여야 합니다.");
check(types.filter(type => type.reviewLocked).length === 57, "검수 대기 유형은 57개여야 합니다.");
check(types.every(type => type.sourceTier === "advanced"), "실력 교재 유형이 심화 사각형 원장에 섞였습니다.");
check(types.find(type => type.sourceItemId === "4-2-u4-e2-mission-1")?.id === "4-2-u4-t2-7", "기존 평행선 Mission 1 직접 링크가 바뀌었습니다.");
check(!types.some(type => /^4-2-quad-/.test(type.sourceItemId)), "기존 실력 교재 원문 ID가 심화 원장에 남았습니다.");

if (failures.length) {
  console.error(`4-2 사각형 88유형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`4-2 사각형 원본 88유형 확정 · 공개 31 · 검수 대기 57 · ${generatedCount.toLocaleString()}회 단일 정답·정답 그림 계약 통과`);
