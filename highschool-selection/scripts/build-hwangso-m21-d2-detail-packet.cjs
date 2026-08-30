"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_MEMORY_ID = "hwangso-middle-51fbf835e246";
const SOURCE_TITLE = "황소수학 중2-1";
const PAGE_START = 61;
const PAGE_END = 87;

const T = Object.freeze({
  systemSpecial: ["연립방정식의 해의 개수와 미지 계수", "두 식의 계수비와 상수항의 비를 비교해 한 해·무수히 많은 해·해 없음 조건을 구분한다"],
  systemNonzero: ["동차 연립방정식의 자명하지 않은 해", "두 동차식의 계수행렬이 특수해를 갖도록 계수비 조건을 세운다"],
  workRate: ["공동 작업량을 이용한 연립방정식", "각 사람의 하루 작업량을 미지수로 두고 함께 한 일과 따로 한 일의 조건을 연립한다"],
  countMoney: ["개수와 금액을 이용한 연립방정식", "두 물건의 개수 합과 금액 합을 각각 식으로 세워 연립한다"],
  age: ["나이 관계를 이용한 연립방정식", "현재 나이를 미지수로 두고 합과 몇 년 뒤의 배수 관계를 식으로 세운다"],
  digits: ["자리 숫자와 뒤집은 수의 연립방정식", "각 자리 숫자로 원래 수와 뒤집은 수를 나타내어 합·차 조건을 연립한다"],
  peopleRatio: ["인원수와 비율을 이용한 연립방정식", "두 집단의 인원수를 미지수로 두고 전체와 참여 비율 조건을 연립한다"],
  mixture: ["농도 혼합을 이용한 연립방정식", "두 용액의 양과 순물질의 양을 각각 식으로 세워 연립한다"],
  percentChange: ["증감률과 전체량을 이용한 연립방정식", "처음 두 양을 미지수로 두고 합과 증감 뒤 전체량을 식으로 세운다"],
  applicationBlock: ["속력·농도·상대운동의 연립방정식 묶음", "거리·시간·농도·상대속도 관계에서 두 미지수를 정하고 각 조건을 두 식으로 만든다"],
  slopeSpeed: ["오르막·내리막 속력의 연립방정식", "오르막과 내리막 거리를 미지수로 두고 거리 합과 시간 합을 연립한다"],
  circularSpeed: ["원형 트랙의 상대운동 연립방정식", "같은 방향과 반대 방향에서 상대속도와 만나는 시간을 이용해 두 사람의 속도를 구한다"],
  scheduleSpeed: ["예정 시간과 속력의 연립방정식", "거리와 예정 시간을 미지수로 두고 빠르거나 늦게 도착하는 조건을 두 식으로 만든다"],
  naturalSystem: ["일차방정식의 자연수 순서쌍", "한 미지수를 자연수 범위에서 움직이며 다른 미지수도 자연수가 되는 순서쌍을 센다"],
  systemParameter: ["연립방정식의 해 조건으로 미지 계수 구하기", "주어진 해의 관계를 식에 대입하거나 먼저 해를 구한 뒤 미지 계수를 결정한다"],
  systemExpression: ["연립방정식의 해로 식의 값 구하기", "소수 계수를 정수 계수로 바꿔 연립방정식을 푼 뒤 목표식에 대입한다"],
  systemFraction: ["분수·소수가 있는 연립방정식", "분모와 소수를 없애 정수 계수의 연립방정식으로 바꾼 뒤 푼다"],
  systemComplex: ["식을 정리해야 하는 연립방정식", "비례식·괄호·분수를 표준형 두 식으로 정리한 뒤 미지수를 소거한다"],
  systemMixedBlock: ["연립방정식의 식 변형과 미지 계수 종합 묶음", "공통해·비례식·잘못 읽은 계수·해의 교환 조건을 각각 식으로 바꾸어 해와 계수를 구한다"],
  priceDiscount: ["원가·할인·이익의 연립방정식", "두 원가의 합과 할인 뒤 실제 이익 합을 두 번째 식으로 세워 연립한다"],
  tieredFee: ["기본요금과 초과 단가의 연립방정식", "기본요금과 초과 단가를 미지수로 두고 두 달의 사용량과 요금 조건을 연립한다"],
  tapRate: ["수도꼭지의 작업률 연립방정식", "각 수도꼭지의 1분당 작업량을 두고 함께 채우는 양과 부분 작업량을 연립한다"],
  moneyRemainder: ["지폐·동전의 개수와 남은 금액", "처음 개수와 사용 뒤 개수·금액 비율을 식으로 만들고 정수 범위의 해를 고른다"],
  roundingRange: ["반올림된 수와 일차식의 값의 범위", "반올림 오차의 반열린 구간을 만든 뒤 일차식에 대입해 경계 포함 여부를 옮긴다"],
  inequalityProperty: ["부등식의 성질과 참·거짓", "더하기·빼기·양수와 음수의 곱셈·역수·거듭제곱에서 대소관계가 유지되는 조건을 확인한다"],
  integerBounds: ["열린 범위의 정수 경계", "일차식의 열린 범위를 구한 뒤 이를 엄격히 감싸는 가장 가까운 정수 경계를 찾는다"],
  decreasingRange: ["감소하는 일차식의 값의 범위", "음의 계수 때문에 양 끝값의 대소가 바뀌는 점과 끝점 포함 여부를 반영한다"],
  twoVariableRange: ["두 변수 식의 값의 범위", "각 변수에 대한 증가·감소 방향을 판단해 합·차·곱·몫의 끝점 조합을 고른다"],
  fractionRange: ["양수 분수식의 값의 범위", "분자와 양의 분모가 변할 때 값이 커지거나 작아지는 끝점 조합을 선택한다"],
  linearInequalityBlock: ["일차부등식의 풀이 종합 묶음", "괄호·소수·분수를 정리하고 음수로 나눌 때 부등호를 바꾸어 해를 수직선에 나타낸다"],
  linearInequality: ["괄호가 있는 일차부등식", "분배법칙으로 괄호를 풀고 문자항과 상수항을 모아 해를 구한다"],
  decimalInequality: ["소수 계수 일차부등식", "10의 거듭제곱을 곱해 소수를 없앤 뒤 정수 계수 부등식으로 푼다"],
  fractionInequality: ["분수·소수 혼합 일차부등식", "최소공배수와 10의 거듭제곱으로 분모와 소수를 없앤 뒤 푼다"],
  equalSolutionInequality: ["해가 같은 두 일차부등식의 미지 계수", "두 부등식을 같은 방향의 경계값으로 풀고 경계가 같다는 식을 세운다"],
  compoundInequality: ["연립일차부등식의 공통해", "각 부등식을 따로 풀고 수직선에서 해 구간의 교집합을 취한다"],
  substituteCompound: ["등식이 함께 주어진 연립부등식", "일차등식으로 한 문자를 없앤 뒤 남은 부등식들의 공통범위를 구한다"],
  chainedInequality: ["연쇄부등식의 공통해", "연쇄식을 두 부등식으로 나누어 각각 풀고 해의 교집합을 취한다"],
  parameterInequality: ["계수가 문자인 일차부등식", "x의 계수가 양수·0·음수인 경우로 나누어 부등호 방향과 모든 수·해 없음을 판정한다"],
  parameterNoSolution: ["해가 없는 문자 계수 일차부등식", "x의 계수가 0이 되게 한 뒤 남은 상수부등식이 거짓이 되는 조건을 정한다"],
  solutionCount: ["부등식의 자연수·정수해 개수", "해 구간이 지정된 개수의 연속한 자연수 또는 정수만 포함하도록 경계 조건을 세운다"],
  intervalEmpty: ["연립부등식의 해가 없는 조건", "두 해 구간의 하한과 상한을 비교해 교집합이 비는 조건을 세운다"],
  intervalExists: ["연립부등식의 해가 존재하는 조건", "두 해 구간이 적어도 한 점 이상 겹치도록 경계와 등호 포함 여부를 비교한다"],
  givenSolution: ["주어진 해집합으로 미지 계수 구하기", "해의 경계값과 방향으로 x계수의 부호와 계수비를 결정한다"],
  givenSolutionNext: ["주어진 해집합으로 다른 부등식 풀기", "첫 부등식의 경계와 방향에서 매개변수 관계를 구해 둘째 부등식에 대입한다"],
  speedInequality: ["속력과 시간의 일차부등식 활용", "구간별 시간을 거리 나누기 속력으로 나타내고 전체 시간이 제한 이내가 되게 식을 세운다"],
  feeInequality: ["요금 비교의 일차부등식 활용", "일반요금과 할인·단체요금을 비교해 어느 쪽이 유리해지는 최소 인원을 구한다"],
  fractionInequalityApplication: ["소수의 범위로 분수 찾기", "버림 또는 반올림 값이 뜻하는 구간과 분자·분모 조건을 함께 만족하는 자연수를 찾는다"],
  salesInequality: ["판매 이익의 일차부등식 활용", "실제 판매수입이 매입원가와 목표 이익을 합한 금액 이상이 되도록 식을 세운다"],
  peopleInequality: ["인원 변화의 일차부등식 활용", "비율을 만족하는 인원을 변수로 두고 증원 전후 전체 인원의 범위를 식으로 만든다"],
  mixtureInequality: ["농도 범위의 연립부등식 활용", "혼합 뒤 순물질의 비율이 목표 농도의 하한과 상한 사이가 되도록 두 부등식을 세운다"],
  averageFee: ["평균 요금의 일차부등식 활용", "총요금을 전체 인원으로 나눈 평균이 기준 이하가 되도록 식을 세운다"],
  roomEquation: ["방 배정 조건으로 학생 수 구하기", "방 수와 학생 수를 두 배정 조건으로 나타내어 같은 학생 수가 되도록 식을 세운다"],
  unitReviewInequality: ["부등식 단원 종합 문제", "부등식의 성질·값의 범위·연립부등식·문자 계수 조건을 문제에 맞게 골라 적용한다"]
});

const from = key => ({ detailType: T[key][0], solutionArchetype: T[key][1] });

const PAGE_RULES = {
  61: { default: from("systemSpecial") },
  62: { 1: from("systemSpecial"), 2: from("systemSpecial"), 3: from("systemSpecial"), 4: from("systemSpecial"), 5: from("systemNonzero") },
  63: { 1: from("workRate") },
  64: { 5: from("countMoney"), 6: from("age"), 7: from("digits"), 8: from("peopleRatio"), 9: from("mixture"), 10: from("percentChange") },
  65: { 1: from("applicationBlock") },
  66: { 7: from("mixture"), 8: from("slopeSpeed"), 9: from("mixture"), 10: from("circularSpeed"), 11: from("mixture"), 12: from("scheduleSpeed") },
  67: { 6: from("naturalSystem"), 7: from("systemParameter"), 8: from("systemExpression"), 9: from("systemFraction"), 10: from("systemComplex") },
  68: { 1: from("systemMixedBlock") },
  69: { 5: from("systemSpecial"), 6: from("priceDiscount"), 7: from("tieredFee"), 8: from("tapRate"), 9: from("moneyRemainder") },
  71: { 1: from("roundingRange") },
  72: { 7: from("inequalityProperty"), 8: from("integerBounds"), 9: from("decreasingRange"), 10: from("twoVariableRange"), 11: from("fractionRange"), 12: from("roundingRange") },
  73: { 1: from("linearInequalityBlock") },
  74: { 5: from("linearInequality"), 6: from("decimalInequality"), 7: from("fractionInequality"), 8: from("equalSolutionInequality") },
  75: { 1: from("compoundInequality"), 2: from("substituteCompound") },
  76: { 5: from("compoundInequality"), 6: from("compoundInequality"), 7: from("chainedInequality"), 8: from("compoundInequality"), 9: from("substituteCompound") },
  77: { 1: from("parameterInequality"), 2: from("parameterInequality") },
  78: { 1: from("parameterInequality"), 2: from("parameterInequality"), 3: from("parameterInequality"), 4: from("parameterInequality"), 5: from("parameterNoSolution") },
  79: { 1: from("solutionCount"), 2: from("solutionCount"), 3: from("intervalEmpty"), 4: from("intervalExists") },
  80: { 7: from("solutionCount"), 8: from("solutionCount"), 9: from("intervalExists"), 10: from("intervalEmpty"), 11: from("solutionCount"), 12: from("intervalExists") },
  81: { 1: from("givenSolution"), 2: from("givenSolutionNext") },
  82: { 1: from("givenSolutionNext"), 2: from("givenSolution"), 3: from("givenSolutionNext"), 4: from("givenSolutionNext") },
  83: { 1: from("speedInequality"), 2: from("feeInequality"), 3: from("fractionInequalityApplication") },
  84: { 7: from("speedInequality"), 8: from("salesInequality"), 9: from("peopleInequality"), 10: from("mixtureInequality"), 11: from("averageFee"), 12: from("roomEquation") },
  85: { 6: from("inequalityProperty"), 7: from("twoVariableRange"), 8: from("twoVariableRange"), 9: from("linearInequality"), 10: from("compoundInequality") }
};

const DEFERRED = new Map([
  ["86:1", "한 영역에 서로 다른 여러 문항이 합쳐져 있어 문항을 나눈 뒤 검수해야 함."],
  ["87:1", "문제 본문이 빠지고 하단 풀이 흔적만 잡혀 있어 원문 영역을 다시 나눠야 함."]
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
  const jobs = jobsFromInput(input);
  const selected = jobs
    .filter(job => Number(job.locator && job.locator.page) >= PAGE_START && Number(job.locator && job.locator.page) <= PAGE_END)
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
    const pageRule = PAGE_RULES[page];
    const matched = pageRule && (pageRule[slot] || pageRule.default);
    if (!matched) throw new Error(`시각 검수 규칙이 없는 문항입니다: PDF p.${page}, slot ${slot}, ${job.sourceItemId}`);
    itemReviews.push({
      sourceItemId: job.sourceItemId,
      detailType: matched.detailType,
      solutionArchetype: matched.solutionArchetype,
      classificationStatus: "reviewed_detail",
      detailPrecision: "verified",
      evidenceLocator: `PDF p.${page}, slot ${slot}`,
      note: [68, 73].includes(page)
        ? "원본 PDF의 해당 영역을 직접 확인함. 한 영역에 여러 소문항이 있어 이후 문항별 분할을 권장함."
        : "원본 PDF의 해당 문항 영역을 직접 보고 문제 조건과 요구값을 확인함."
    });
  });

  return {
    schemaVersion: 1,
    sources: [{ sourceMemoryId: SOURCE_MEMORY_ID, title: SOURCE_TITLE, itemReviews }],
    deferred
  };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-hwangso-m21-d2-detail-packet.cjs <작업대기열.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: SOURCE_MEMORY_ID, reviewedItemCount: packet.sources[0].itemReviews.length, deferredItemCount: packet.deferred.length, pageStart: PAGE_START, pageEnd: PAGE_END })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SOURCE_MEMORY_ID, SOURCE_TITLE, PAGE_START, PAGE_END, PAGE_RULES, DEFERRED, jobsFromInput, buildPacket });
