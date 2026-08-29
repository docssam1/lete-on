"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_MEMORY_ID = "hwangso-middle-51fbf835e246";
const SOURCE_TITLE = "황소수학 중2-1";
const TARGET_KEYS = new Set(["86:1", "87:1", "101:2", "102:10", "110:10", "134:1", "135:1"]);
const r = (detailType, solutionArchetype) => ({ detailType, solutionArchetype });

const PAGE_RULES = {
  102: {
    10: r(
      "두 직선이 만나지 않도록 문자 값 구하기",
      "두 식을 일반형으로 맞춘 뒤 x와 y의 계수비는 같고 상수항의 비는 다르게 되는 조건을 적용한다"
    )
  },
  110: {
    10: r(
      "고정된 y절편의 직선이 선분과 만나게 하는 기울기 범위",
      "고정점에서 선분의 두 끝점으로 향하는 경계 기울기를 구하고 선분과 만나는 두 기울기 구간을 합친다"
    )
  }
};

const DEFERRED = new Map([
  ["86:1", "9번과 10번의 일부가 한 영역에 섞였고 문제 번호와 조건 시작 부분이 잘려 있어 6~10번을 각각 새 위치로 잡아야 함."],
  ["87:1", "15번 아래의 손풀이와 페이지 하단만 잡혀 문제 번호와 인쇄된 조건이 없으므로 11~15번을 각각 새 위치로 잡아야 함."],
  ["101:2", "예제 8-2의 첫 문장 일부만 매우 얇게 잘린 조각이라 문제의 식과 요구값 전체를 포함하는 새 위치가 필요함."],
  ["134:1", "57~59번과 60번의 여러 소문항이 양쪽 열에 섞였고 60번 제목과 첫 소문항이 잘려 각 문항을 따로 잡아야 함."],
  ["135:1", "60번의 17~20번 네 소문항이 한 영역에 묶여 있어 네 개의 독립 문항 위치로 나누어야 함."]
]);

const REPLACEMENT_LOCATORS = new Map([
  ["86:1", "86쪽의 6~10번을 각각 독립 문항으로 새로 잡되, 필기가 식을 가린 8번과 10번은 깨끗한 원본 확인 전까지 잠금."],
  ["87:1", "87쪽의 11~15번을 각각 독립 문항으로 새로 잡기."],
  ["101:2", "101쪽 예제 8-2의 문제 식과 마지막 요구 문장까지 포함해 다시 잡기."],
  ["134:1", "134쪽 57~59번과 60(1)~60(8)을 각각 독립 문항으로 새로 잡기."],
  ["135:1", "135쪽 60(9)~60(20)을 각각 독립 문항으로 새로 잡기."]
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function jobsFromInput(input) {
  const source = Array.isArray(input.sources) && input.sources.find(entry => entry.sourceMemoryId === SOURCE_MEMORY_ID);
  if (source && Array.isArray(source.jobs)) return source.jobs;
  if (!Array.isArray(input.reviews)) throw new Error("황소수학 중2-1 작업 대기열 또는 통합 검수표를 찾지 못했습니다.");
  return input.reviews.filter(review => review.sourceMemoryId === SOURCE_MEMORY_ID).flatMap(review => {
    const locator = (review.evidence || []).map(value => String(value).match(/:PDF p\.(\d+), slot (\d+)$/)).find(Boolean);
    return locator ? [{ sourceItemId: review.sourceItemId, locator: { page: Number(locator[1]), slot: Number(locator[2]) } }] : [];
  });
}

function buildPacket(input) {
  const selected = jobsFromInput(input)
    .filter(job => TARGET_KEYS.has(`${Number(job.locator && job.locator.page)}:${Number(job.locator && job.locator.slot)}`))
    .sort((left, right) => Number(left.locator.page) - Number(right.locator.page) || Number(left.locator.slot) - Number(right.locator.slot));
  const deferred = [];
  const itemReviews = [];
  selected.forEach(job => {
    const page = Number(job.locator.page);
    const slot = Number(job.locator.slot);
    const locatorKey = `${page}:${slot}`;
    if (DEFERRED.has(locatorKey)) {
      deferred.push({
        sourceItemId: job.sourceItemId,
        evidenceLocator: `PDF p.${page}, slot ${slot}`,
        reason: `${DEFERRED.get(locatorKey)} ${REPLACEMENT_LOCATORS.get(locatorKey)}`
      });
      return;
    }
    const matched = PAGE_RULES[page] && PAGE_RULES[page][slot];
    if (!matched) throw new Error(`시각 검수 규칙이 없는 문항입니다: PDF p.${page}, slot ${slot}, ${job.sourceItemId}`);
    itemReviews.push({
      sourceItemId: job.sourceItemId,
      detailType: matched.detailType,
      solutionArchetype: matched.solutionArchetype,
      classificationStatus: "reviewed_detail",
      detailPrecision: "verified",
      evidenceLocator: `PDF p.${page}, slot ${slot}`,
      note: "원본 PDF의 해당 문항 영역을 직접 보고 문제 조건과 요구값을 확인함. 넓은 빈 공간은 포함하지만 다른 인쇄 문항은 섞이지 않음."
    });
  });
  return {
    schemaVersion: 1,
    sources: [{ sourceMemoryId: SOURCE_MEMORY_ID, title: SOURCE_TITLE, itemReviews }],
    deferred
  };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-hwangso-m21-d8-detail-packet.cjs <작업대기열.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({
    sourceMemoryId: SOURCE_MEMORY_ID,
    reviewedItemCount: packet.sources[0].itemReviews.length,
    deferredItemCount: packet.deferred.length,
    targetCount: TARGET_KEYS.size
  })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({
  SOURCE_MEMORY_ID,
  SOURCE_TITLE,
  TARGET_KEYS,
  PAGE_RULES,
  DEFERRED,
  REPLACEMENT_LOCATORS,
  jobsFromInput,
  buildPacket
});
