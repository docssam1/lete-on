"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_MEMORY_ID = "hwangso-middle-51fbf835e246";
const SOURCE_TITLE = "황소수학 중2-1";
const PAGE_START = 90;
const PAGE_END = 115;

const T = Object.freeze({
  linearCheckBlock: ["일차함수 판별과 그래프 종합 묶음", "식과 생활 속 관계가 일차함수인지 판별하고, 절댓값이 들어간 함수의 그래프를 구간별로 그린다"],
  graphCoefficientSigns: ["일차함수 그래프와 계수의 부호", "기울기와 절편의 부호를 그래프의 증가·감소와 축과 만나는 위치에서 읽는다"],
  graphQuadrant: ["일차함수 그래프가 지나는 사분면", "기울기와 절편의 부호를 이용해 직선이 지나거나 지나지 않는 사분면을 판단한다"],
  graphLineMatch: ["일차함수 식과 여러 직선의 대응", "각 식을 기울기와 절편 꼴로 바꾸고 방향과 축과 만나는 위치를 비교해 직선과 짝짓는다"],
  pointInterceptBlock: ["한 점과 절편 조건으로 일차함수 결정 묶음", "주어진 점을 식에 대입하고 x절편·y절편 조건을 함께 사용해 미지 계수를 정한다"],
  lineAxisArea: ["두 직선과 좌표축으로 만든 도형의 넓이", "두 직선의 교점과 각 축의 절편을 구한 뒤 밑변과 높이로 넓이를 계산한다"],
  lineThroughPoints: ["두 점을 지나는 일차함수와 미지 계수", "두 점의 좌표를 식에 대입하거나 기울기를 같게 두어 미지 계수를 구한다"],
  slopePointIntercept: ["기울기와 한 점으로 절편 구하기", "주어진 기울기와 한 점을 일차함수 식에 대입해 절편 또는 다른 축과 만나는 점을 구한다"],
  changeSlope: ["x와 y의 변화량으로 일차함수 구하기", "x의 변화량과 y의 변화량의 비로 기울기를 구하고 한 점 또는 절편 조건으로 식을 완성한다"],
  intersectionCondition: ["두 일차함수의 교점 조건", "교점 좌표를 두 식에 각각 대입해 미지 계수와 절편을 구한다"],
  translatedParallelLine: ["평행이동한 일차함수와 한 점", "평행이동해도 기울기가 같음을 이용하고 주어진 점을 대입해 이동한 직선의 식을 구한다"],
  slopeFormula: ["두 점 사이의 기울기 공식", "두 점의 y좌표 차를 x좌표 차로 나누고 문자식을 정리해 기울기를 구한다"],
  collinearParameter: ["세 점이 한 직선 위에 있을 조건", "두 구간의 기울기가 같다는 식을 세워 좌표의 미지수를 구한다"],
  slopeMeaning: ["일차함수의 변화율과 기울기", "x의 증가량에 대한 y의 증가량의 비 또는 차분식을 기울기로 해석한다"],
  slopeRangeQuadrant: ["사분면 조건으로 기울기의 범위 구하기", "한 점을 지나는 직선이 특정 사분면을 피하도록 기울기의 경계와 포함 여부를 정한다"],
  slopeRangeSegment: ["선분을 지나는 직선의 기울기 범위", "고정점을 지나는 직선이 선분의 양 끝점을 지날 때의 기울기를 경계로 삼아 범위를 구한다"],
  interceptTriangleArea: ["좌표축의 두 절편으로 삼각형 넓이 구하기", "x절편과 y절편을 구하고 두 절편을 밑변과 높이로 사용해 삼각형 넓이 조건을 푼다"],
  areaSlopeRange: ["도형 넓이 조건과 직선의 기울기 범위", "직선이 도형의 경계점을 지나는 경우를 기준으로 넓이 조건을 만족하는 기울기 범위를 정한다"],
  interceptIntersectionBlock: ["절편과 두 직선의 교점 계산 묶음", "점·절편 조건으로 직선의 식을 구하고 두 식을 연립해 축과 만나는 점 또는 교점을 구한다"],
  divisionPointLine: ["선분의 내분점과 직선의 방정식", "내분점 공식을 이용해 점의 좌표를 구하고 다른 점과의 기울기와 절편으로 직선의 식을 만든다"],
  perpendicularThroughPoint: ["한 점을 지나고 주어진 직선에 수직인 직선", "두 직선의 기울기 곱이 -1임을 이용해 기울기를 정하고 주어진 점을 대입한다"],
  parallelThroughPoint: ["한 점을 지나고 주어진 직선에 평행한 직선", "기울기를 같게 두고 주어진 점을 대입해 절편을 결정한다"],
  interceptChain: ["절편 조건이 이어진 두 직선", "첫 직선의 점과 절편 조건에서 미지수를 구한 뒤 그 값을 둘째 직선의 절편 계산에 사용한다"],
  perpendicularGeneral: ["일반형 직선의 수직 조건", "일반형을 기울기 꼴로 바꾸고 수직인 두 기울기의 곱이 -1이 되게 미지 계수를 정한다"],
  intersectionDistance: ["두 직선과 평행선의 교점 사이 거리", "각 직선과 평행선의 교점을 구하고 같은 축 또는 같은 직선 위 두 점 사이의 거리를 계산한다"],
  coincidentParallel: ["두 직선의 일치·평행 조건", "일반형 두 식의 x계수·y계수·상수항 비를 비교해 일치 또는 평행 조건을 구분한다"],
  coincidentLineProperties: ["일치하는 두 직선의 기울기와 절편", "두 일반형 식의 계수비가 모두 같다는 조건으로 미지 계수를 구하고 기울기와 절편을 계산한다"],
  threeLinesNoTriangle: ["세 직선이 삼각형을 만들지 않을 조건", "세 직선 중 두 직선이 평행하거나 세 직선이 한 점에서 만나는 경우로 나누어 미지 계수를 구한다"],
  horizontalTranslation: ["일차함수 그래프의 좌우 평행이동", "x 대신 x-p를 넣었을 때 그래프가 오른쪽으로 p만큼 이동함을 이용해 그래프의 위치를 비교한다"],
  xAxisReflection: ["x축에 대칭인 일차함수 그래프", "함숫값 전체에 -를 붙이면 각 점의 y좌표 부호가 바뀐다는 성질로 대칭 그래프를 판단한다"],
  transformBlock: ["일차함수의 평행이동과 대칭이동 묶음", "x·y방향 평행이동과 x축·y축 대칭이동을 식에 차례로 반영해 계수를 구한다"],
  horizontalShift: ["일차함수 그래프의 가로 평행이동", "x를 x-p로 바꾸어 가로 이동량을 반영하고 이동한 그래프의 식을 정리한다"],
  yAxisReflection: ["y축에 대칭인 일차함수 그래프", "x를 -x로 바꾸어 y축 대칭인 직선의 식을 구한다"],
  reflectionTranslation: ["대칭이동과 평행이동을 함께 한 직선", "먼저 축 대칭으로 기울기와 절편을 바꾼 뒤 평행이동 또는 지나는 점 조건을 적용한다"],
  areaBisectorLine: ["도형의 넓이를 이등분하는 직선", "도형의 전체 넓이와 절반 넓이를 구하고, 같은 높이의 삼각형이나 사다리꼴 넓이 조건으로 직선 위의 점을 정한다"],
  graphParameterRange: ["직선의 위치 조건과 미지 계수의 범위", "교점이 놓일 사분면이나 직선이 피해야 할 반직선의 경계를 구해 미지 계수의 범위를 정한다"],
  interceptRange: ["절편의 범위로 다른 절편 범위 구하기", "한 점을 지나는 조건으로 두 절편의 관계식을 만들고 주어진 절편 범위를 다른 절편의 범위로 옮긴다"],
  segmentIntersectionRange: ["직선이 선분과 만나는 계수의 범위", "직선이 선분의 양 끝점을 지날 때의 계수값을 경계로 삼아 만나는 범위를 정한다"],
  areaOptimization: ["일차함수와 좌표도형의 길이·넓이 최적화", "직선과 좌표축이 만드는 도형의 길이 또는 넓이를 식으로 나타내고 대칭이나 넓이 관계로 최솟값을 찾는다"],
  distanceMinimumReflection: ["대칭이동을 이용한 두 거리 합의 최솟값", "한 점을 직선에 대칭이동한 뒤 꺾인 경로를 한 직선으로 펴서 최단 경로와 만나는 점을 구한다"],
  unitGraphStatement: ["일차함수 그래프 설명의 참·거짓", "기울기와 절편, 평행이동, 변화량에 대한 설명을 그래프와 식에 하나씩 대입해 확인한다"],
  yAxisIntersectionParameter: ["두 직선의 교점이 y축 위에 있을 조건", "교점의 x좌표를 0으로 두고 두 직선의 y값이 같아지도록 미지 계수를 구한다"],
  segmentFunctionRange: ["선분과 만나는 일차함수의 계수 범위", "선분의 양 끝점을 지날 때의 계수값을 경계로 하여 그래프가 선분을 만나는 범위를 구한다"],
  boundedArea: ["두 직선과 좌표축으로 둘러싸인 넓이", "직선들의 교점과 축과 만나는 점을 구해 둘러싸인 도형을 삼각형으로 나누어 넓이를 계산한다"],
  midpointParallelLine: ["중점을 지나고 주어진 직선에 평행한 직선", "선분의 중점을 구하고 평행한 직선의 기울기를 사용해 직선의 방정식을 완성한다"],
  twoLineIntercepts: ["두 일차함수의 기울기·절편 관계", "공통 교점과 각 직선의 기울기·절편 조건을 연립해 모르는 절편을 구한다"],
  shiftedGeneralLine: ["평행이동한 직선의 일반형", "두 점으로 원래 직선의 식을 구한 뒤 지정된 방향만큼 평행이동하고 일반형으로 정리한다"],
  sharedIntersectionAxisPoint: ["세 직선의 공통 교점과 축 위의 점", "먼저 두 직선의 공통 교점을 구해 셋째 직선에 대입하고, 그 직선의 x절편과 y절편을 계산한다"],
  intersectionOnLine: ["두 직선의 교점이 다른 직선 위에 있을 조건", "두 직선의 교점을 매개변수로 나타내거나 연립해 구한 뒤 주어진 직선의 식에 대입한다"],
  triangleBisectorIntercept: ["삼각형 넓이를 이등분하는 직선의 절편", "교점과 축 위 두 점으로 삼각형을 만들고 넓이를 절반으로 나누는 직선의 y절편을 구한다"],
  quadrantIntersectionRange: ["두 직선의 교점이 특정 사분면에 있을 조건", "교점 좌표를 미지 계수의 식으로 구하고 x좌표와 y좌표의 부호 조건을 함께 푼다"]
});

const from = key => ({ detailType: T[key][0], solutionArchetype: T[key][1] });

const PAGE_RULES = {
  90: { 1: from("linearCheckBlock") },
  93: { 1: from("graphLineMatch"), 2: from("graphCoefficientSigns"), 3: from("graphQuadrant") },
  94: { 7: from("graphCoefficientSigns"), 8: from("graphCoefficientSigns"), 9: from("graphCoefficientSigns"), 10: from("graphQuadrant"), 11: from("graphQuadrant"), 12: from("graphLineMatch") },
  95: { 1: from("pointInterceptBlock"), 2: from("lineAxisArea") },
  96: { 2: from("lineThroughPoints"), 3: from("lineThroughPoints"), 4: from("slopePointIntercept"), 5: from("changeSlope"), 6: from("intersectionCondition"), 7: from("translatedParallelLine") },
  97: { 1: from("slopeFormula"), 2: from("slopeFormula"), 3: from("collinearParameter") },
  98: { 7: from("slopeMeaning"), 8: from("slopeMeaning"), 9: from("slopeRangeQuadrant"), 10: from("slopeRangeSegment"), 11: from("interceptTriangleArea"), 12: from("areaSlopeRange") },
  99: { 1: from("interceptIntersectionBlock"), 2: from("divisionPointLine") },
  100: { 7: from("perpendicularThroughPoint"), 8: from("interceptChain"), 9: from("parallelThroughPoint"), 10: from("interceptChain"), 11: from("perpendicularGeneral"), 12: from("intersectionDistance") },
  101: { 1: from("perpendicularGeneral"), 3: from("coincidentParallel"), 4: from("threeLinesNoTriangle") },
  102: { 7: from("coincidentParallel"), 8: from("coincidentLineProperties"), 9: from("coincidentParallel") },
  103: { 1: from("horizontalTranslation") },
  104: { 1: from("xAxisReflection") },
  105: { 1: from("transformBlock") },
  106: { 1: from("horizontalShift"), 2: from("yAxisReflection"), 3: from("reflectionTranslation"), 4: from("horizontalShift"), 5: from("reflectionTranslation") },
  107: { 1: from("areaBisectorLine"), 2: from("areaBisectorLine") },
  108: { 7: from("areaBisectorLine"), 8: from("areaBisectorLine"), 9: from("areaBisectorLine"), 10: from("areaBisectorLine"), 11: from("areaBisectorLine") },
  109: { 1: from("graphParameterRange"), 2: from("graphParameterRange") },
  110: { 7: from("segmentIntersectionRange"), 8: from("interceptRange"), 9: from("areaOptimization") },
  111: { 1: from("areaOptimization"), 2: from("distanceMinimumReflection") },
  112: { 1: from("areaBisectorLine"), 2: from("areaBisectorLine"), 3: from("distanceMinimumReflection") },
  113: { 6: from("unitGraphStatement"), 7: from("yAxisIntersectionParameter"), 8: from("segmentFunctionRange"), 9: from("boundedArea"), 10: from("midpointParallelLine") },
  114: { 5: from("twoLineIntercepts"), 6: from("areaBisectorLine"), 7: from("shiftedGeneralLine"), 8: from("coincidentParallel"), 9: from("transformBlock") },
  115: { 1: from("graphParameterRange"), 2: from("sharedIntersectionAxisPoint"), 3: from("intersectionOnLine"), 4: from("triangleBisectorIntercept"), 5: from("quadrantIntersectionRange") }
};

const DEFERRED = new Map([
  ["101:2", "문항 번호 표지에 가까운 아주 얕은 조각이며, 바로 뒤 3번 영역에 같은 문제 본문이 잡혀 있어 중복으로 승격하지 않음."],
  ["102:10", "한 쪽 전체를 다시 잡은 넓은 영역으로 같은 쪽 7~9번 및 오른쪽 문제와 겹치므로 분할·중복 제거 뒤 검수해야 함."],
  ["110:10", "한 쪽 전체를 다시 잡은 넓은 영역으로 같은 쪽 7~9번 및 오른쪽 문제와 겹치므로 분할·중복 제거 뒤 검수해야 함."]
]);

const SPLIT_RECOMMENDED = new Set(["90:1", "95:1", "99:1", "105:1"]);

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
      note: SPLIT_RECOMMENDED.has(locatorKey)
        ? "원본 PDF의 해당 영역을 직접 확인함. 한 영역에 서로 다른 소문항이 함께 있어 이후 문항별 분할을 권장함."
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
  if (args.length !== 2) throw new Error("사용법: node build-hwangso-m21-d3-detail-packet.cjs <작업대기열.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: SOURCE_MEMORY_ID, reviewedItemCount: packet.sources[0].itemReviews.length, deferredItemCount: packet.deferred.length, pageStart: PAGE_START, pageEnd: PAGE_END })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SOURCE_MEMORY_ID, SOURCE_TITLE, PAGE_START, PAGE_END, PAGE_RULES, DEFERRED, SPLIT_RECOMMENDED, jobsFromInput, buildPacket });
