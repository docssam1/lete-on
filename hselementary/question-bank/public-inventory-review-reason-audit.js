"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");

const answerDetailPattern = /(?:제공\s*답|답안|독립\s*계산|답이\s*하나|답을\s*확정|뒤에만\s*\d)/;
const catalogs = [
  ["4-1", window.HSE_SOURCE_INVENTORY_41?.items || []],
  ["6학년", window.HSE_SOURCE_INVENTORY_GRADE6?.items || []]
];
const failures = [];

for (const [catalogName, items] of catalogs) {
  for (const item of items) {
    const locked = item.reviewLocked === true || item.releaseStatus === "locked" || item.publicDecision === "locked";
    const reason = item.reviewReason || item.lockReason || "";
    if (locked && /\d/.test(reason) && answerDetailPattern.test(reason)) {
      failures.push(`${catalogName}/${item.sourceItemId || item.normalizedTypeId || item.typeId}: ${reason}`);
    }
  }
}

if (failures.length) {
  console.error(`공개 잠금 문구 답 노출 검사 실패: ${failures.length}건`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`공개 잠금 문구 답 노출 검사 통과: ${catalogs.reduce((total, [, items]) => total + items.length, 0)}유형`);
