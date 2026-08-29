"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_MEMORY_ID = "hwangso-middle-51fbf835e246";
const SOURCE_TITLE = "황소수학 중2-1";
const PAGE_START = 117;
const PAGE_END = 122;

const T = Object.freeze({
  terminatingDenominatorCount: ["유한소수가 되는 분모의 개수", "기약분수의 분모가 2와 5만을 소인수로 갖도록 두 자리 자연수 분모를 분류하고 센다"],
  terminatingConditionBlock: ["유한소수 조건을 이용한 분수 종합 묶음", "분수를 기약분수로 만든 뒤 분모의 소인수가 2와 5뿐인지 확인하고 미지수의 조건을 구한다"],
  repeatingNotation: ["순환소수와 순환마디 읽기", "반복되는 숫자 배열을 찾아 순환마디와 점을 찍어야 할 시작·끝 자리를 정확히 표시한다"],
  decimalCompare: ["순환소수와 분수의 크기 비교", "분수를 소수로 바꾸거나 순환마디를 같은 자리까지 늘어놓아 여러 수의 크기를 비교한다"],
  repeatingDigit: ["분수의 순환소수에서 특정 자리 숫자", "순환마디의 길이를 구하고 원하는 자리 번호를 순환마디 길이로 나눈 나머지로 해당 숫자를 찾는다"],
  repeatingCycleSum: ["순환마디와 각 자리 숫자의 합", "분수를 소수로 바꾸어 순환마디를 찾고 순환마디에 들어 있는 숫자들의 합을 계산한다"],
  dotPlacementRange: ["순환소수의 순환점 위치와 값의 범위", "주어진 숫자열에서 순환점의 가능한 위치를 바꾸어 가장 큰 값과 가장 작은 값을 만든다"],
  rationalDecimalStatement: ["유리수와 순환소수 설명의 참·거짓", "유리수·유한소수·무한소수·순환소수의 포함 관계와 분모의 소인수 조건을 설명마다 확인한다"],
  repeatingToFraction: ["순환소수를 분수로 나타내기", "순환마디 길이만큼 10의 거듭제곱을 곱한 식에서 원래 식을 빼 순환 부분을 없애고 분수로 정리한다"],
  repeatingExpression: ["순환소수의 분수 표현을 이용한 식 계산", "순환소수를 분수로 고친 뒤 곱셈·뺄셈식 또는 정수 조건을 정확히 계산한다"],
  longDivisionRepeat: ["나눗셈으로 순환소수 나타내기", "분자를 분모로 나누면서 나머지가 반복되는 지점을 찾아 순환마디를 표시한다"],
  squareMultiplier: ["순환소수에 곱해 제곱수가 되는 자연수", "순환소수를 기약분수로 바꾸고 소인수의 지수를 짝수로 맞추는 가장 작은 자연수를 찾는다"],
  repeatingValueCompare: ["순환소수 계산값 비교", "각 순환소수를 분수 또는 같은 자리의 소수로 바꾸어 네 식의 값을 비교한다"],
  swappedFractionError: ["분자·분모를 바꿔 얻은 순환소수 복원", "잘못 읽어 만든 두 소수에서 가능한 분자와 분모를 역으로 정하고 올바른 분수를 순환소수로 나타낸다"],
  repeatingDigitsIdentity: ["순환소수의 자리 숫자 조건", "순환소수를 분수로 바꾼 식과 주어진 분수 항등식을 비교해 각 자리 숫자를 결정한다"],
  repeatingClosure: ["순환소수의 사칙연산 성질", "순환소수를 유리수로 보고 덧셈·뺄셈·곱셈·나눗셈 결과가 다시 순환소수가 되는 조건을 판단한다"],
  repeatingDifference: ["주어진 수보다 작은 순환소수", "주어진 수를 분수로 바꾸고 정해진 차를 빼서 결과를 순환소수로 나타낸다"],
  repeatingArithmeticBlock: ["순환소수의 사칙연산 종합 묶음", "순환소수를 분수로 바꿔 여러 단계의 덧셈·뺄셈·곱셈·나눗셈을 한 뒤 다시 순환소수로 나타낸다"],
  inverseRepeatingProduct: ["순환소수 곱셈의 역산", "곱한 뒤의 순환소수를 분수로 바꾸고 곱해진 순환소수로 나누어 처음 수를 구한다"],
  repeatingEquation: ["순환소수가 있는 일차방정식", "각 순환소수를 분수로 고친 뒤 분모를 없애 일차방정식을 푼다"],
  mistakenMultiplier: ["잘못 곱한 수를 이용한 원래 수 구하기", "잘못 곱한 결과와 올바른 결과의 차를 두 곱수의 차로 나누어 원래 자연수를 구한다"],
  repeatingDigitEquation: ["순환소수의 자리 문자 방정식", "자리 문자가 들어간 순환소수를 분수로 바꾸고 주어진 등식과 비교해 문자의 값을 구한다"],
  twoRepeatingNumbers: ["두 순환소수의 합과 차", "자리 문자로 두 순환소수를 분수로 나타내고 합·차 조건을 연립해 필요한 값을 구한다"],
  repeatingRatioNatural: ["순환소수 비와 자연수 조건", "순환소수를 분수로 고쳐 자연수의 비를 기약비로 만들고 차 또는 합 조건을 계산한다"],
  repeatingSystemDigits: ["두 순환소수 관계의 자리 숫자", "한 자리 자연수 조건과 순환소수의 합 또는 차를 분수식으로 바꾸어 연립한다"],
  repeatingSystem: ["순환소수가 있는 연립방정식", "순환소수를 분수로 바꾸고 두 식의 분모를 없앤 뒤 연립방정식을 푼다"],
  threeRepeatingDigits: ["세 순환소수의 자리 숫자 조건", "각 순환소수를 자리 문자의 분수식으로 나타내고 곱셈 관계와 크기 조건을 함께 만족하는 자연수를 찾는다"]
});

const from = key => ({ detailType: T[key][0], solutionArchetype: T[key][1] });

const PAGE_RULES = {
  117: { 1: from("terminatingDenominatorCount") },
  118: { 1: from("terminatingConditionBlock"), 2: from("terminatingConditionBlock") },
  119: { 4: from("repeatingNotation"), 5: from("decimalCompare"), 6: from("repeatingDigit"), 7: from("repeatingDigit"), 8: from("repeatingCycleSum"), 9: from("dotPlacementRange"), 10: from("rationalDecimalStatement"), 11: from("rationalDecimalStatement") },
  120: { 6: from("rationalDecimalStatement"), 7: from("repeatingNotation"), 8: from("repeatingToFraction"), 9: from("repeatingExpression"), 10: from("repeatingExpression"), 11: from("repeatingToFraction"), 12: from("longDivisionRepeat") },
  121: { 4: from("squareMultiplier"), 5: from("repeatingValueCompare"), 6: from("swappedFractionError"), 7: from("repeatingDigitsIdentity"), 8: from("repeatingClosure"), 9: from("repeatingDifference"), 10: from("repeatingArithmeticBlock") },
  122: { 9: from("inverseRepeatingProduct"), 10: from("repeatingEquation"), 11: from("mistakenMultiplier"), 12: from("repeatingDigitEquation"), 13: from("twoRepeatingNumbers"), 14: from("repeatingRatioNatural"), 15: from("twoRepeatingNumbers"), 16: from("repeatingSystemDigits"), 17: from("repeatingSystem"), 18: from("threeRepeatingDigits") }
};

const SPLIT_RECOMMENDED = new Set(["118:1", "118:2", "120:11", "121:10"]);

function readJson(filePath) { return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8")); }

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
    .filter(job => Number(job.locator && job.locator.page) >= PAGE_START && Number(job.locator && job.locator.page) <= PAGE_END)
    .sort((left, right) => Number(left.locator.page) - Number(right.locator.page) || Number(left.locator.slot) - Number(right.locator.slot));
  const itemReviews = selected.map(job => {
    const page = Number(job.locator.page);
    const slot = Number(job.locator.slot);
    const locatorKey = `${page}:${slot}`;
    const matched = PAGE_RULES[page] && PAGE_RULES[page][slot];
    if (!matched) throw new Error(`시각 검수 규칙이 없는 문항입니다: PDF p.${page}, slot ${slot}, ${job.sourceItemId}`);
    return {
      sourceItemId: job.sourceItemId,
      detailType: matched.detailType,
      solutionArchetype: matched.solutionArchetype,
      classificationStatus: "reviewed_detail",
      detailPrecision: "verified",
      evidenceLocator: `PDF p.${page}, slot ${slot}`,
      note: SPLIT_RECOMMENDED.has(locatorKey)
        ? "원본 PDF의 해당 영역을 직접 확인함. 같은 풀이 원리를 쓰는 여러 소문항이 함께 있어 이후 문항별 분할을 권장함."
        : "원본 PDF의 해당 문항 영역을 직접 보고 문제 조건과 요구값을 확인함."
    };
  });
  return { schemaVersion: 1, sources: [{ sourceMemoryId: SOURCE_MEMORY_ID, title: SOURCE_TITLE, itemReviews }], deferred: [] };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-hwangso-m21-d4-detail-packet.cjs <작업대기열.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: SOURCE_MEMORY_ID, reviewedItemCount: packet.sources[0].itemReviews.length, deferredItemCount: 0, pageStart: PAGE_START, pageEnd: PAGE_END })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SOURCE_MEMORY_ID, SOURCE_TITLE, PAGE_START, PAGE_END, PAGE_RULES, SPLIT_RECOMMENDED, jobsFromInput, buildPacket });
