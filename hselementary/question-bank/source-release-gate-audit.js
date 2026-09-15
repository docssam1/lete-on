"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-4-2-parallel-angle.js");
require("./source-grade6-decimal-e1-mission4.js");
require("./source-grade6-decimal-e1-mission3.js");
require("./source-grade6-decimal-e2-example2.js");
require("./source-grade6-decimal-e2-example4.js");
require("./source-grade6-decimal-e2-mission6.js");
require("./source-grade6-decimal-e4-example1.js");
require("./source-grade6-decimal-e4-mission4.js");
require("./source-grade6-volume-e2.js");
require("./source-grade6-volume-e3-mission3.js");
require("./source-grade6-volume-e4.js");
require("./source-grade6-surface-e1.js");

const api = window.HSE_GENERATORS;
const failures = [];
let total = 0;
let ready = 0;
let lockedWithoutSource = 0;

for (const semester of window.HSE_CURRICULUM.semesters) {
  for (const unit of semester.units) {
    for (const subunit of unit.subunits) {
      for (const type of subunit.types) {
        total += 1;
        const available = Boolean(api.generatorKey(type)) && !type.reviewLocked;
        if (available) ready += 1;
        if (available && !type.sourceItemId) failures.push(`${type.id}: 원문 문항 ID 없이 공개 상태입니다.`);
        if (!type.sourceItemId) {
          if (!type.reviewLocked || type.generationMode !== "review-locked" || type.verifiedVariantCount !== 0) {
            failures.push(`${type.id}: 원문 미연결 유형의 잠금 계약이 올바르지 않습니다.`);
          }
          if (!/원본의 개별 문항/.test(type.reviewReason || "")) failures.push(`${type.id}: 원문 미연결 잠금 이유가 없습니다.`);
          lockedWithoutSource += 1;
        }
      }
    }
  }
}

if (total !== 1962) failures.push(`전체 유형 수가 1962가 아니라 ${total}입니다.`);
if (ready !== 1064) failures.push(`원문 연결 공개 유형 수가 1064가 아니라 ${ready}입니다.`);
if (lockedWithoutSource !== 404) failures.push(`원문 미연결 잠금 유형 수가 404가 아니라 ${lockedWithoutSource}입니다.`);

if (failures.length) {
  console.error(`원문 연결 공개 문턱 실패: ${failures.length}건`);
  failures.slice(0, 30).forEach(message => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`원문 연결 공개 문턱 통과: 전체 ${total} · 공개 ${ready} · 원문 미연결 잠금 ${lockedWithoutSource}`);
}
