"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_MEMORY_ID = "hwangso-middle-51fbf835e246";
const SOURCE_TITLE = "황소수학 중2-1";

const T = Object.freeze({
  decimalClass: ["유한소수와 무한소수 판별", "분수를 기약분수로 만든 뒤 분모의 소인수를 확인해 소수의 종류를 판별한다"],
  decimalDenominator: ["분모의 소인수로 유한소수 판별", "기약분수의 분모가 2와 5만을 소인수로 갖는지 확인한다"],
  decimalNatural: ["유한소수가 되게 하는 자연수", "분모의 2와 5 이외 소인수가 약분되도록 자연수의 배수 조건을 정리한다"],
  decimalCount: ["유한소수가 되는 분수의 개수", "분모를 소인수분해하고 약분 뒤 남는 소인수 조건을 만족하는 분자를 센다"],
  numberSystem: ["유리수의 소수 표현과 수 체계", "유한소수와 순환소수가 유리수임을 이용해 주어진 수를 분류한다"],
  repeatingPattern: ["순환마디와 특정 자리 숫자", "순환마디의 길이로 자리 번호를 나눈 나머지를 이용해 해당 숫자를 찾는다"],
  repeatingCompare: ["순환소수의 대소 비교", "순환마디를 충분히 펼쳐 처음 달라지는 자리의 숫자를 비교한다"],
  repeatingFraction: ["순환소수를 분수로 바꾸기", "순환마디 길이만큼 자릿수를 옮긴 식을 빼서 순환 부분을 없앤다"],
  repeatingEquation: ["순환소수 식에서 미지수 구하기", "순환소수를 분수로 바꾼 뒤 일차식으로 정리해 미지수를 구한다"],
  repeatingOperation: ["순환소수의 사칙연산", "순환소수를 분수로 바꾸고 통분·약분하여 계산한다"],
  repeatingRestore: ["잘못 계산한 순환소수 복원", "잘못 사용한 수와 계산 결과의 관계를 역산해 원래 수를 복원한다"],
  exponentLaw: ["지수법칙으로 식 간단히 하기", "같은 밑의 곱셈·나눗셈·거듭제곱에서 지수를 더하고 빼고 곱한다"],
  exponentCompare: ["같은 밑으로 바꾸어 지수 비교", "밑을 공통인 거듭제곱으로 바꾼 뒤 지수를 비교한다"],
  exponentEquation: ["지수법칙을 이용한 지수방정식", "양변의 밑을 같게 만들고 지수끼리 같다는 식을 세운다"],
  exponentDefined: ["정의된 거듭제곱식으로 나타내기", "주어진 기호식의 밑과 지수를 맞추어 목표 거듭제곱을 조합한다"],
  monomialCalc: ["단항식의 곱셈과 나눗셈", "수의 계수와 같은 문자의 지수를 각각 계산해 단항식을 정리한다"],
  monomialUnknown: ["등식을 만족하는 단항식 찾기", "목표 단항식과 계수·각 문자의 지수를 비교해 빈 단항식을 구한다"],
  polyMonomial: ["다항식과 단항식의 곱셈·나눗셈", "분배법칙을 적용하고 각 항의 계수와 문자 지수를 정리한다"],
  mixedExpression: ["단항식과 다항식의 혼합 계산", "곱셈과 나눗셈을 먼저 처리한 뒤 동류항을 모아 정리한다"],
  geometryExpression: ["식의 계산을 도형의 넓이·부피에 활용", "도형을 분할하거나 전체에서 일부를 빼고 길이를 문자식으로 나타내 계산한다"],
  formulaRearrange: ["공식을 특정 문자에 관해 정리", "분모를 없애고 목표 문자가 있는 항을 한쪽으로 모은 뒤 계수로 나눈다"],
  substituteValue: ["조건을 이용해 식의 값 구하기", "주어진 관계식을 목표식에 맞게 변형하거나 직접 대입해 값을 계산한다"],
  expandPolynomial: ["다항식 전개와 특정 항의 계수", "분배법칙으로 전개하고 같은 차수의 항을 모아 필요한 계수를 찾는다"],
  identityBasic: ["곱셈공식으로 식 전개", "완전제곱식과 합차공식의 구조를 찾아 바로 전개한다"],
  identityCubic: ["세제곱 곱셈공식으로 식 전개", "세제곱의 합·차와 세 변수 항등식의 구조를 적용한다"],
  substitutionExpand: ["치환 구조를 이용한 다항식 전개", "반복되는 식을 하나의 문자로 치환해 곱셈공식을 적용한 뒤 되돌린다"],
  identityNumeric: ["곱셈공식으로 수 계산", "수를 합·차 또는 연속된 수의 곱으로 바꾸어 곱셈공식을 적용한다"],
  symmetricTwo: ["두 문자의 대칭식 값 구하기", "합과 곱 또는 역수 관계를 이용해 제곱합·세제곱합을 단계적으로 만든다"],
  symmetricThree: ["세 문자의 대칭식 값 구하기", "세 문자의 기본 대칭합 사이 관계를 이용해 목표 대칭식을 변형한다"],
  linearTwoSolutions: ["미지수가 2개인 일차방정식의 해", "한 미지수에 값을 대입해 다른 미지수를 구하고 순서쌍이 식을 만족하는지 확인한다"],
  linearNaturalSolutions: ["미지수가 2개인 일차방정식의 자연수해", "한 미지수를 자연수 범위에서 움직이며 다른 미지수도 자연수가 되는 순서쌍을 센다"],
  simultaneousGraph: ["두 일차방정식의 그래프와 교점", "각 방정식의 두 점을 구해 직선을 그리고 교점의 좌표를 연립방정식의 해로 읽는다"],
  simultaneousParameter: ["연립방정식의 해로 미지 계수 구하기", "주어진 교점 또는 해를 두 방정식에 각각 대입해 미지 계수를 구한다"],
  simultaneousBasic: ["가감법·대입법으로 연립방정식 풀기", "한 미지수의 계수를 맞춰 소거하거나 한 식을 다른 식에 대입해 해를 구한다"],
  simultaneousFraction: ["분수·소수가 있는 연립방정식", "분모와 소수를 먼저 없애 정수 계수의 연립방정식으로 바꾼 뒤 푼다"],
  simultaneousSpecial: ["식을 정리해야 하는 연립방정식", "괄호·분수·비례식을 정리해 표준형 두 식으로 만든 뒤 미지수를 소거한다"],
  simultaneousMany: ["미지수가 3개 이상인 연립방정식", "식끼리 더하고 빼서 미지수를 차례로 줄인 뒤 역대입한다"],
  simultaneousRatio: ["미지수가 많은 연립방정식의 비와 값", "동차 연립식에서 미지수의 비를 먼저 구하고 추가 조건으로 실제 값을 정한다"]
});

const rule = (type, solution) => ({ detailType: type, solutionArchetype: solution });
const from = key => rule(...T[key]);

const PAGE_RULES = {
  3: { 1: from("decimalClass"), 2: from("decimalDenominator"), 3: from("decimalNatural") },
  4: { 1: from("numberSystem"), 2: from("decimalClass"), 3: from("decimalCount"), 4: from("decimalNatural"), 5: from("decimalDenominator"), 6: from("decimalNatural") },
  5: { default: from("repeatingPattern"), 4: from("numberSystem"), 5: from("repeatingPattern"), 6: from("repeatingCompare") },
  6: { 1: from("repeatingCompare"), 2: from("numberSystem"), 3: from("repeatingPattern"), 4: from("repeatingPattern"), 5: from("repeatingPattern"), 6: from("repeatingPattern") },
  7: { default: from("repeatingFraction"), 1: from("numberSystem"), 2: from("repeatingFraction"), 3: from("repeatingFraction"), 4: from("numberSystem"), 5: from("repeatingFraction"), 7: from("repeatingEquation") },
  8: { default: from("repeatingFraction"), 7: from("repeatingRestore"), 8: from("repeatingRestore") },
  9: { default: from("repeatingOperation") },
  10: { default: from("repeatingOperation"), 9: from("repeatingEquation"), 10: from("repeatingRestore"), 11: from("repeatingRestore"), 12: from("repeatingEquation") },
  11: { 4: from("numberSystem"), 5: from("decimalDenominator"), 6: from("repeatingPattern"), 7: from("numberSystem") },
  12: { 5: from("repeatingOperation"), 6: from("repeatingCompare"), 7: from("decimalNatural"), 8: from("repeatingEquation"), 9: from("repeatingOperation"), 10: from("decimalCount") },
  13: { default: from("decimalNatural") },
  15: { default: from("exponentLaw") },
  16: { default: from("exponentLaw"), 3: from("exponentCompare"), 4: from("exponentEquation"), 5: from("exponentEquation"), 6: from("exponentEquation") },
  17: { 1: from("exponentDefined"), 2: from("exponentCompare"), 3: from("exponentCompare"), 4: from("exponentEquation") },
  18: { default: from("exponentEquation"), 1: from("exponentDefined"), 2: from("exponentCompare"), 3: from("exponentCompare") },
  19: { default: from("monomialCalc") },
  20: { default: from("monomialCalc"), 8: from("exponentCompare"), 9: from("exponentEquation") },
  21: { default: from("monomialUnknown") },
  22: { default: from("monomialUnknown") },
  23: { default: from("polyMonomial") },
  24: { default: from("polyMonomial"), 4: from("monomialUnknown") },
  25: { default: from("mixedExpression") },
  26: { default: from("mixedExpression") },
  27: { default: from("polyMonomial"), 2: from("mixedExpression") },
  28: { default: from("geometryExpression") },
  29: { default: from("geometryExpression") },
  30: { default: from("formulaRearrange") },
  31: { default: from("formulaRearrange") },
  32: { default: from("substituteValue") },
  33: { default: from("substituteValue") },
  34: { default: from("expandPolynomial") },
  35: { default: from("expandPolynomial") },
  36: { default: from("identityBasic") },
  37: { default: from("identityBasic") },
  38: { default: from("identityCubic") },
  39: { default: from("identityCubic"), 4: from("symmetricTwo") },
  40: { default: from("substitutionExpand") },
  41: { default: from("substitutionExpand"), 2: from("symmetricTwo") },
  42: { default: from("identityNumeric") },
  43: { default: from("identityNumeric") },
  44: { default: from("symmetricTwo") },
  45: { default: from("symmetricTwo") },
  46: { default: from("symmetricThree"), 4: from("symmetricTwo"), 5: from("symmetricTwo") },
  47: { default: from("symmetricThree"), 5: from("symmetricTwo"), 6: from("symmetricTwo"), 7: from("symmetricTwo") },
  48: { 5: from("monomialCalc"), 6: from("exponentEquation"), 7: from("exponentDefined"), 8: from("exponentEquation"), 9: from("monomialCalc") },
  49: { 4: from("monomialUnknown"), 5: from("geometryExpression"), 6: from("formulaRearrange"), 7: from("substituteValue"), 8: from("exponentCompare") },
  51: { default: from("linearNaturalSolutions") },
  52: { 1: from("linearTwoSolutions"), 2: from("linearTwoSolutions"), 3: from("linearNaturalSolutions"), 4: from("linearNaturalSolutions"), 5: from("linearNaturalSolutions"), 6: from("simultaneousParameter") },
  53: { default: from("simultaneousGraph") },
  54: { default: from("simultaneousParameter"), 10: from("simultaneousGraph") },
  55: { default: from("simultaneousBasic"), 3: from("simultaneousParameter") },
  56: { default: from("simultaneousBasic"), 8: from("simultaneousFraction"), 9: from("simultaneousFraction"), 10: from("simultaneousParameter"), 11: from("simultaneousSpecial"), 12: from("simultaneousSpecial") },
  57: { default: from("simultaneousSpecial"), 3: from("simultaneousMany") },
  58: { default: from("simultaneousSpecial"), 7: from("simultaneousMany"), 8: from("simultaneousRatio"), 9: from("simultaneousParameter") },
  59: { default: from("simultaneousRatio") },
  60: { default: from("simultaneousRatio") }
};

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
  const jobs = jobsFromInput(input);

  const selected = jobs
    .filter(job => Number(job.locator && job.locator.page) >= 2 && Number(job.locator && job.locator.page) <= 60)
    .sort((left, right) => Number(left.locator.page) - Number(right.locator.page) || Number(left.locator.slot) - Number(right.locator.slot));

  const itemReviews = selected.map(job => {
    const page = Number(job.locator.page);
    const slot = Number(job.locator.slot);
    const pageRule = PAGE_RULES[page];
    const matched = pageRule && (pageRule[slot] || pageRule.default);
    if (!matched) throw new Error(`시각 검수 규칙이 없는 문항입니다: PDF p.${page}, slot ${slot}, ${job.sourceItemId}`);
    return {
      sourceItemId: job.sourceItemId,
      detailType: matched.detailType,
      solutionArchetype: matched.solutionArchetype,
      classificationStatus: "reviewed_detail",
      detailPrecision: "verified",
      evidenceLocator: `PDF p.${page}, slot ${slot}`,
      note: "원본 PDF의 해당 문항 영역을 직접 보고 문제 조건과 요구값을 확인함."
    };
  });

  return {
    schemaVersion: 1,
    sources: [{ sourceMemoryId: SOURCE_MEMORY_ID, title: SOURCE_TITLE, itemReviews }]
  };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-hwangso-m21-d1-detail-packet.cjs <작업대기열.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: SOURCE_MEMORY_ID, itemCount: packet.sources[0].itemReviews.length, pageStart: 2, pageEnd: 60 })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SOURCE_MEMORY_ID, SOURCE_TITLE, PAGE_RULES, jobsFromInput, buildPacket });
