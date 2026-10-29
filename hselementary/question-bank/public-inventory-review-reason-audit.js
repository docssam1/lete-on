"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");

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

// These source-linked types may show public review metadata; keep licensed values and answers out.
const protected52 = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2").units.find(u => u.id === "5-2-u1").subunits.flatMap(s => s.types).filter(t => /^5-2-u1-e3-mission-[1-6]-/.test(t.id) || /^5-2-u1-e4-(exploration-rounded-range|example-[1-4]|mission-1-rounded-count)$/.test(t.id));
if (protected52.length !== 12) failures.push(`5-2 보호 메타데이터 유형 수가 다릅니다: ${protected52.length}`);
for (const item of protected52) if (/\d/.test(item.reviewReason || "")) failures.push(`${item.id}: 공개 설명에 원문 수치 또는 답이 포함될 수 있습니다.`);

if (failures.length) {
  console.error(`공개 잠금 문구 답 노출 검사 실패: ${failures.length}건`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`공개 잠금 문구 답 노출 검사 통과: ${catalogs.reduce((total, [, items]) => total + items.length, 0)}유형`);
