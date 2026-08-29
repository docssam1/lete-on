"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_MEMORY_ID = "hwangso-middle-9801621718ea";
const SOURCE_TITLE = "황소 7가 자연수의 성질";
const TARGET_KEYS = new Set(["4:1", "6:1", "12:3", "28:7", "28:8", "28:9", "28:10"]);
const r = (detailType, solutionArchetype) => ({ detailType, solutionArchetype });

const PAGE_RULES = {
  28: {
    7: r(
      "세 수의 최소공배수 조건으로 가능한 자연수 여러 개 찾기",
      "세 수의 최소공배수를 소인수 지수로 나타내고, 앞의 두 수에 이미 있는 지수와 새 자연수가 채워야 하는 지수를 나누어 가능한 수를 작은 순서로 찾는다"
    ),
    8: r(
      "세 수의 최대공약수와 최소공배수로 가능한 자연수 찾기",
      "주어진 두 수와 목표 최대공약수·최소공배수를 소인수분해하고 각 소수의 지수가 최솟값과 최댓값 조건을 함께 만족하게 한다"
    ),
    9: r(
      "세 수의 최대공약수와 최소공배수 조건을 만족하는 세 자리 수의 합",
      "목표 최대공약수와 최소공배수의 소인수 지수 범위 안에서 세 번째 수의 지수를 정하고 세 자리 후보만 골라 더한다"
    ),
    10: r(
      "쌍별 최대공약수와 최소공배수로 순서가 정해진 세 자연수 찾기",
      "공통 최대공약수를 먼저 묶고 두 수의 곱과 최대공약수·최소공배수 관계를 이용해 후보를 줄인 뒤 크기 순서와 다른 두 수의 최소공배수 조건을 확인한다"
    )
  }
};

const DEFERRED = new Map([
  ["4:1", "예제 1-2와 예제 1-3이 함께 잡히고 예제 1-4의 시작 부분까지 걸쳐 각 예제를 새 위치로 나눠야 함."],
  ["6:1", "예제 3-1과 예제 3-2가 함께 잡히고 예제 3-3의 시작 부분까지 걸쳐 각 예제를 새 위치로 나눠야 함."],
  ["12:3", "예제 9-3의 번호와 문장 윗부분만 매우 얇게 잘린 조각이라 조건과 요구값 전체가 포함된 새 위치가 필요함."]
]);

function readJson(filePath) { return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8")); }

function jobsFromInput(input) {
  const source = Array.isArray(input.sources) && input.sources.find(entry => entry.sourceMemoryId === SOURCE_MEMORY_ID);
  if (source && Array.isArray(source.jobs)) return source.jobs;
  if (!Array.isArray(input.reviews)) throw new Error("황소 자연수의 성질 작업 대기열 또는 통합 검수표를 찾지 못했습니다.");
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
      deferred.push({ sourceItemId: job.sourceItemId, evidenceLocator: `PDF p.${page}, slot ${slot}`, reason: DEFERRED.get(locatorKey) });
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
      note: "원본 PDF의 해당 문항 영역을 직접 보고 문제 조건과 요구값을 확인함. 한 번호의 완전한 문제만 포함함."
    });
  });
  return { schemaVersion: 1, sources: [{ sourceMemoryId: SOURCE_MEMORY_ID, title: SOURCE_TITLE, itemReviews }], deferred };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-hwangso-natural-d9-detail-packet.cjs <작업대기열.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: SOURCE_MEMORY_ID, reviewedItemCount: packet.sources[0].itemReviews.length, deferredItemCount: packet.deferred.length, targetCount: TARGET_KEYS.size })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SOURCE_MEMORY_ID, SOURCE_TITLE, TARGET_KEYS, PAGE_RULES, DEFERRED, jobsFromInput, buildPacket });
