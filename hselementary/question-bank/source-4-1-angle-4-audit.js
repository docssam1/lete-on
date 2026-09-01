"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41AngleFour";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;

const expectedSourceIds = [
  "4-1-u2-e4-exploration",
  "4-1-u2-e4-example-4-1",
  "4-1-u2-e4-example-4-2",
  "4-1-u2-e4-example-4-3",
  "4-1-u2-e4-example-4-4",
  "4-1-u2-e4-mission-1",
  "4-1-u2-e4-mission-2",
  "4-1-u2-e4-mission-3",
  "4-1-u2-e4-mission-4",
  "4-1-u2-e4-mission-5",
  "4-1-u2-e4-mission-6"
];

const expectedLabels = [
  "개념탐구 4 본문",
  "예제 4-1",
  "예제 4-2",
  "예제 4-3",
  "예제 4-4",
  "Mission 1",
  "Mission 2",
  "Mission 3",
  "Mission 4",
  "Mission 5",
  "Mission 6"
];

// These names are the 11 independent evidence structures emitted by generators.js.
const expectedKinds = [
  "three-apex-double-bisector-center-angle",
  "overlapping-two-triangles-gap-angle",
  "same-direction-exterior-angle-sum",
  "rotated-isosceles-triangle-turn",
  "five-point-star-tip-angle-sum",
  "concave-quadrilateral-missing-tip-angle",
  "crossed-two-triangles-center-angle",
  "polygon-missing-exterior-angle",
  "bisected-apex-two-angle-difference",
  "five-point-star-crossing-target-sum",
  "seven-point-star-tip-angle-sum"
];

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function firstTag(html, tagName) {
  return String(html).match(new RegExp(`<${tagName}\\b[^>]*>`))?.[0] || "";
}

function matches(text, expression) {
  return String(text).match(expression) || [];
}

function visibleText(html) {
  return String(html)
    .replace(/<span hidden[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readEvidence(prompt) {
  const tag = prompt.match(/<span hidden data-source41-kind="[^"]+" data-source41-payload="[^"]+" data-source41-expected="[^"]*"><\/span>/)?.[0];
  assert(tag, "독립 검산 자료가 없습니다.");
  const payloadText = attribute(tag, "data-source41-payload");
  const expectedText = attribute(tag, "data-source41-expected");
  assert(payloadText !== undefined && expectedText !== undefined, "검산 자료의 답 또는 조건이 비어 있습니다.");
  return {
    kind: attribute(tag, "data-source41-kind"),
    payload: JSON.parse(decodeURIComponent(payloadText)),
    declared: decodeURIComponent(expectedText)
  };
}

function numberAnswer(value) {
  assert(Number.isFinite(value), `독립 계산 결과가 유한한 수가 아닙니다: ${value}`);
  assert(Number.isInteger(value), `독립 계산 결과가 정수가 아닙니다: ${value}`);
  return String(value);
}

function finiteNumbers(values, label) {
  assert(Array.isArray(values) && values.length > 0 && values.every(Number.isFinite), `${label}에 깨진 값이 있습니다.`);
}

function parsePoints(text) {
  return String(text).trim().split(/\s+/).map(pair => pair.split(",").map(Number));
}

function polygonPoints(text) {
  const polygon = String(text).match(/<polygon\b[^>]*>/)?.[0] || "";
  const value = attribute(polygon, "points");
  assert(value, "SVG polygon의 points가 없습니다.");
  const points = parsePoints(value);
  assert(points.every(point => point.length === 2 && point.every(Number.isFinite)), "SVG 꼭짓점 좌표가 깨졌습니다.");
  return points;
}

function cross(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function between(value, left, right) {
  return value >= Math.min(left, right) - 1e-7 && value <= Math.max(left, right) + 1e-7;
}

function segmentsIntersect(a, b, c, d) {
  const abC = cross(a, b, c);
  const abD = cross(a, b, d);
  const cdA = cross(c, d, a);
  const cdB = cross(c, d, b);
  const proper = abC * abD < -1e-7 && cdA * cdB < -1e-7;
  if (proper) return true;
  return Math.abs(abC) < 1e-7 && between(c[0], a[0], b[0]) && between(c[1], a[1], b[1])
    || Math.abs(abD) < 1e-7 && between(d[0], a[0], b[0]) && between(d[1], a[1], b[1])
    || Math.abs(cdA) < 1e-7 && between(a[0], c[0], d[0]) && between(a[1], c[1], d[1])
    || Math.abs(cdB) < 1e-7 && between(b[0], c[0], d[0]) && between(b[1], c[1], d[1]);
}

function nonAdjacentCrossings(points) {
  const crossings = [];
  for (let first = 0; first < points.length; first += 1) {
    const firstEnd = (first + 1) % points.length;
    for (let second = first + 1; second < points.length; second += 1) {
      const secondEnd = (second + 1) % points.length;
      if (first === second || firstEnd === second || secondEnd === first) continue;
      if (segmentsIntersect(points[first], points[firstEnd], points[second], points[secondEnd])) crossings.push([first, second]);
    }
  }
  return crossings;
}

function independentClosedStar(tipAngles) {
  finiteNumbers(tipAngles, "오각별 꼭짓각");
  assert(tipAngles.length === 5, "오각별 꼭짓각이 다섯 개가 아닙니다.");
  const directions = [0];
  for (let index = 1; index < tipAngles.length; index += 1) directions.push(directions[index - 1] + 180 - tipAngles[index]);
  const vectors = directions.map(angle => {
    const radians = angle * Math.PI / 180;
    return [Math.cos(radians), -Math.sin(radians)];
  });
  const candidates = [70, 90, 110, 130, 150];
  for (const first of candidates) {
    for (const second of candidates) {
      for (const third of candidates) {
        const lengths = [first, second, third];
        const partial = [
          vectors[0][0] * first + vectors[1][0] * second + vectors[2][0] * third,
          vectors[0][1] * first + vectors[1][1] * second + vectors[2][1] * third
        ];
        const fourthVector = vectors[3];
        const fifthVector = vectors[4];
        const determinant = fourthVector[0] * fifthVector[1] - fourthVector[1] * fifthVector[0];
        if (Math.abs(determinant) < 1e-8) continue;
        const fourth = (-partial[0] * fifthVector[1] + partial[1] * fifthVector[0]) / determinant;
        const fifth = (-fourthVector[0] * partial[1] + fourthVector[1] * partial[0]) / determinant;
        if (fourth < 35 || fifth < 35 || fourth > 420 || fifth > 420) continue;
        lengths.push(fourth, fifth);
        const points = [[0, 0]];
        for (let index = 0; index < 4; index += 1) points.push([points[index][0] + vectors[index][0] * lengths[index], points[index][1] + vectors[index][1] * lengths[index]]);
        const closure = [points[4][0] + vectors[4][0] * lengths[4], points[4][1] + vectors[4][1] * lengths[4]];
        assert(Math.hypot(closure[0], closure[1]) < 1e-6, "오각별 선이 닫히지 않습니다.");
        const crossing = segmentsIntersect(points[0], points[1], points[2], points[3]);
        if (crossing) return { points, lengths, directions };
      }
    }
  }
  throw new Error("독립적으로 닫히고 교차하는 오각별을 만들지 못했습니다.");
}

function independentAnswer(kind, payload) {
  if (kind === "three-apex-double-bisector-center-angle") {
    assert(payload.firstLeft + payload.firstRight + payload.firstApex === 180, "첫 삼각형의 세 각 합이 180°가 아닙니다.");
    assert(payload.thirdLeft + payload.thirdRight + payload.thirdApex === 180, "셋째 삼각형의 세 각 합이 180°가 아닙니다.");
    const middleBaseSum = ((180 - payload.firstApex) + (180 - payload.thirdApex)) / 2;
    const answer = 180 - middleBaseSum;
    assert(payload.middleLeft === (payload.firstLeft + payload.thirdLeft) / 2, "가운데 왼쪽 밑각 자료가 다릅니다.");
    assert(payload.middleRight === (payload.firstRight + payload.thirdRight) / 2, "가운데 오른쪽 밑각 자료가 다릅니다.");
    assert(payload.answerNumber === answer, "가운데 꼭짓각 자료가 독립 계산과 다릅니다.");
    return numberAnswer(answer);
  }
  if (kind === "overlapping-two-triangles-gap-angle" || kind === "crossed-two-triangles-center-angle") {
    const answer = 180 - payload.leftBase - payload.topRight - payload.topLeft - payload.rightBase;
    assert(payload.leftBase + payload.topRight < 180 && payload.topLeft + payload.rightBase < 180, "두 삼각형의 가운데 각이 유효하지 않습니다.");
    assert(payload.givenSum === 180 - answer, "네 주어진 각의 합 자료가 다릅니다.");
    assert(payload.answerNumber === answer, "두 삼각형의 목표각 자료가 독립 계산과 다릅니다.");
    return numberAnswer(answer);
  }
  if (kind === "same-direction-exterior-angle-sum") {
    assert(Number.isInteger(payload.sideCount) && payload.sideCount >= 3, "다각형 변 수가 잘못되었습니다.");
    assert(payload.exteriorAngle === 360 / payload.sideCount, "정다각형 한 바깥각 자료가 다릅니다.");
    return numberAnswer(payload.sideCount * payload.exteriorAngle);
  }
  if (kind === "rotated-isosceles-triangle-turn") {
    const baseAngle = (180 - payload.pivotAngle) / 2;
    assert(baseAngle === payload.baseAngle, "이등변삼각형 밑각 자료가 다릅니다.");
    assert(payload.shownAngle === baseAngle + payload.turnAngle, "돌린 뒤 표시각의 관계가 다릅니다.");
    return numberAnswer(payload.shownAngle - baseAngle);
  }
  if (kind === "five-point-star-tip-angle-sum") {
    assert(payload.sideCount === 5 && payload.step === 2 && payload.winding === 2, "오각별 구조 자료가 다릅니다.");
    return numberAnswer(payload.sideCount * 180 - payload.winding * 360);
  }
  if (kind === "concave-quadrilateral-missing-tip-angle") {
    const reflex = 360 - payload.smallOutside;
    assert(payload.reflexAngle === reflex, "오목 꼭짓점의 안쪽 각 자료가 다릅니다.");
    return numberAnswer(360 - reflex - payload.bottomAngle - payload.rightAngle);
  }
  if (kind === "polygon-missing-exterior-angle") {
    finiteNumbers(payload.exteriorAngles, "다각형 바깥각");
    assert(payload.exteriorAngles.length === payload.sideCount, "바깥각 개수와 변 수가 다릅니다.");
    assert(payload.exteriorAngles.reduce((sum, value) => sum + value, 0) === 360, "한 방향 바깥각의 합이 360°가 아닙니다.");
    assert(payload.givens.join(",") === payload.exteriorAngles.slice(1).join(","), "주어진 바깥각 자료가 다릅니다.");
    return numberAnswer(360 - payload.givens.reduce((sum, value) => sum + value, 0));
  }
  if (kind === "bisected-apex-two-angle-difference") {
    assert(payload.baseAngle + payload.rightBase + payload.halfApex * 2 === 180, "꼭짓각 이등분 삼각형의 각 합이 다릅니다.");
    assert(payload.firstTarget === payload.leftSmall + payload.rightBase + payload.halfApex, "첫 목표각 자료가 다릅니다.");
    assert(payload.secondTarget === payload.halfApex, "둘째 목표각 자료가 다릅니다.");
    return numberAnswer(payload.firstTarget - payload.secondTarget);
  }
  if (kind === "five-point-star-crossing-target-sum") {
    assert(payload.tipAngles.length === 5, "교차 오각별 꼭짓각이 다섯 개가 아닙니다.");
    assert(payload.tipAngles.reduce((sum, value) => sum + value, 0) === 180, "variant 9 tipAngles의 합이 180°가 아닙니다.");
    assert(payload.targetSum === payload.firstTarget + payload.secondTarget, "두 목표 꼭짓각의 합 자료가 다릅니다.");
    assert(payload.outsideAngle === payload.givenTip + payload.targetSum, "바깥각·주어진 꼭짓각·목표각의 관계가 다릅니다.");
    assert(payload.hiddenSum === 180 - payload.outsideAngle, "숨은 두 꼭짓각의 합 자료가 다릅니다.");
    assert(payload.firstHidden + payload.secondHidden === payload.hiddenSum, "숨은 두 꼭짓각의 합이 다릅니다.");
    independentClosedStar(payload.tipAngles);
    return numberAnswer(payload.outsideAngle - payload.givenTip);
  }
  if (kind === "seven-point-star-tip-angle-sum") {
    assert(payload.sideCount === 7 && payload.step === 2 && payload.winding === 2, "칠각별 구조 자료가 다릅니다.");
    return numberAnswer(payload.sideCount * 180 - payload.winding * 360);
  }
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditSvg(prompt, variant, payload) {
  const svg = firstTag(prompt, "svg");
  assert(svg.includes("geometry-diagram"), "도형 SVG가 없습니다.");
  const fullSvg = prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0] || "";
  const polygons = matches(fullSvg, /<polygon\b/g).length;
  const lines = matches(fullSvg, /<line\b/g).length;
  const targetLabels = matches(fullSvg, /class="[^"]*\bsource41-target-label\b[^"]*"/g).length;
  const givenLabels = matches(fullSvg, /class="[^"]*\bsource41-given-label\b[^"]*"/g).length;
  const marks = matches(fullSvg, /source41-(?:polygon-angle-mark|equal-angle-mark)/g).length;

  if (variant === 0) {
    assert(svg.includes("source41-three-apex"), "세 삼각형의 두 밑 꼭짓각 이등분 그림이 없습니다.");
    assert(polygons === 0 && lines === 7, `variant 0의 선/삼각형 수가 ${lines}/${polygons}개입니다.`);
    assert(matches(fullSvg, /data-triangle-index=/g).length === 3, "variant 0 삼각형 묶음이 3개가 아닙니다.");
    assert(targetLabels === 1 && givenLabels === 2 && marks === 4, "variant 0 꼭짓점·목표·이등분 표시 수가 다릅니다.");
    assert((attribute(svg, "data-apex-angles") || "").split(",").length === 2, "variant 0 꼭짓각 자료가 두 개가 아닙니다.");
    assert((attribute(svg, "data-left-base-angles") || "").split(",").length === 3 && (attribute(svg, "data-right-base-angles") || "").split(",").length === 3, "variant 0 밑각 자료가 세 개씩이 아닙니다.");
    return;
  }
  if (variant === 1 || variant === 6) {
    assert(svg.includes("source41-overlap-triangles"), "겹친 두 삼각형 그림이 없습니다.");
    assert(polygons === 2 && lines === 0, `variant ${variant}의 선/삼각형 수가 ${lines}/${polygons}개입니다.`);
    assert(matches(fullSvg, /data-triangle=/g).length === 2, "겹친 두 삼각형의 구조 표시가 두 개가 아닙니다.");
    assert(targetLabels === 1 && givenLabels === 4, `variant ${variant}의 주어진 각/목표 표시 수가 다릅니다.`);
    assert((attribute(svg, "data-given-angles") || "").split(",").length === 4, "두 삼각형의 주어진 각 자료가 네 개가 아닙니다.");
    assert(attribute(svg, "data-target-angle") === String(payload.answerNumber), "두 삼각형 SVG의 목표각 속성이 답과 다릅니다.");
    assert(variant === 1 ? svg.includes("is-example") : svg.includes("is-mission"), "두 삼각형 원문 구분 구조가 다릅니다.");
    return;
  }
  if (variant === 2) {
    assert(svg.includes("source41-exterior-sum"), "정다각형 바깥각 합 그림이 없습니다.");
    assert(polygons === 1 && lines === payload.sideCount, "정다각형의 선/다각형 수가 다릅니다.");
    assert(polygonPoints(fullSvg).length === payload.sideCount, "정다각형 꼭짓점 수가 변 수와 다릅니다.");
    assert(matches(fullSvg, /data-exterior-index=/g).length === payload.sideCount && marks === payload.sideCount, "정다각형 바깥각 표시 수가 변 수와 다릅니다.");
    assert(attribute(svg, "data-side-count") === String(payload.sideCount) && attribute(svg, "data-target-count") === String(payload.sideCount), "정다각형 data 속성이 다릅니다.");
    return;
  }
  if (variant === 3) {
    assert(svg.includes("source41-rotated-triangle"), "돌린 이등변삼각형 그림이 없습니다.");
    assert(polygons === 2 && lines === 0, "돌린 이등변삼각형의 삼각형 수가 두 개가 아닙니다.");
    assert(polygonPoints(fullSvg).length === 3, "원래 삼각형의 꼭짓점 수가 세 개가 아닙니다.");
    assert(matches(fullSvg, /source41-equal-angle-mark/g).length === 2 && targetLabels === 1 && givenLabels === 2, "돌린 삼각형 표시 수가 다릅니다.");
    for (const name of ["data-pivot-angle", "data-base-angle", "data-shown-angle", "data-turn-angle"]) assert(attribute(svg, name) !== undefined, `돌린 삼각형 ${name} 속성이 없습니다.`);
    return;
  }
  if (variant === 4 || variant === 10) {
    assert(svg.includes("source41-star-polygon"), "별 모양 SVG가 없습니다.");
    assert(polygons === 1 && lines === 0, "별 모양의 선/다각형 수가 다릅니다.");
    assert(polygonPoints(fullSvg).length === payload.sideCount, "별 꼭짓점 수가 변 수와 다릅니다.");
    assert(new Set(polygonPoints(fullSvg).map(point => point.join(","))).size === payload.sideCount, "별 꼭짓점이 겹쳤습니다.");
    assert(nonAdjacentCrossings(polygonPoints(fullSvg)).length >= 1, "별의 실제 교차 구조가 없습니다.");
    assert(marks === payload.sideCount && targetLabels === 0 && givenLabels === 0, "별 끝 목표 표시 수가 변 수와 다릅니다.");
    assert(attribute(svg, "data-star-points") === String(payload.sideCount) && attribute(svg, "data-star-step") === "2" && attribute(svg, "data-winding") === "2" && attribute(svg, "data-target-count") === String(payload.sideCount), "별 data 속성이 다릅니다.");
    return;
  }
  if (variant === 5) {
    assert(svg.includes("source41-concave-quadrilateral"), "오목 사각형 그림이 없습니다.");
    assert(polygons === 1 && lines === 0 && polygonPoints(fullSvg).length === 4, "오목 사각형 구조가 아닙니다.");
    assert(targetLabels === 1 && givenLabels === 3, "오목 사각형의 꼭짓점·각 표시 수가 다릅니다.");
    for (const name of ["data-small-outside", "data-other-angles", "data-target-angle"]) assert(attribute(svg, name) !== undefined, `오목 사각형 ${name} 속성이 없습니다.`);
    return;
  }
  if (variant === 7) {
    assert(svg.includes("source41-exterior-polygon"), "다각형 바깥각 그림이 없습니다.");
    assert(polygons === 1 && lines === payload.sideCount && polygonPoints(fullSvg).length === payload.sideCount, "다각형의 선/꼭짓점 수가 변 수와 다릅니다.");
    assert(matches(fullSvg, /data-exterior-index=/g).length === payload.sideCount && matches(fullSvg, /data-exterior-label=/g).length === payload.sideCount, "다각형 바깥각 표시 수가 변 수와 다릅니다.");
    assert(targetLabels === 1 && givenLabels === payload.sideCount - 1, "다각형 목표·주어진 바깥각 표시 수가 다릅니다.");
    assert((attribute(svg, "data-exterior-angles") || "").split(",").length === payload.sideCount, "다각형 바깥각 data 자료 수가 다릅니다.");
    return;
  }
  if (variant === 8) {
    assert(svg.includes("source41-bisected-apex"), "꼭짓각 이등분 그림이 없습니다.");
    assert(polygons === 1 && lines === 4 && polygonPoints(fullSvg).length === 3, "꼭짓각 이등분 그림의 선/삼각형 수가 다릅니다.");
    assert(matches(fullSvg, /source41-equal-angle-mark/g).length === 4 && targetLabels === 2 && givenLabels === 3, "꼭짓각 이등분 표시 수가 다릅니다.");
    for (const name of ["data-right-base", "data-left-small", "data-half-apex", "data-first-target", "data-second-target", "data-difference"]) assert(attribute(svg, name) !== undefined, `꼭짓각 이등분 ${name} 속성이 없습니다.`);
    const positions = (attribute(svg, "data-bisector-positions") || "").split(",").map(Number);
    assert(positions.length === 2 && positions.every(position => position >= 0.1 && position <= 0.9), "두 보조선의 교점이 삼각형 안의 이등분선 구간에 있지 않습니다.");
    assert(Math.abs(positions[0] - positions[1]) >= 0.089, "두 보조선의 교점이 너무 가까워 구분되지 않습니다.");
    return;
  }
  assert(variant === 9, `알 수 없는 SVG 분기 ${variant}입니다.`);
  assert(svg.includes("source41-star-relation"), "교차 오각별 그림이 없습니다.");
  const starPoints = polygonPoints(fullSvg);
  assert(polygons === 1 && lines === 0 && starPoints.length === 5, "교차 오각별의 선/꼭짓점 수가 다릅니다.");
  assert(nonAdjacentCrossings(starPoints).length >= 1, "교차 오각별의 실제 선 교차가 없습니다.");
  const starWidth = Math.max(...starPoints.map(point => point[0])) - Math.min(...starPoints.map(point => point[0]));
  const starHeight = Math.max(...starPoints.map(point => point[1])) - Math.min(...starPoints.map(point => point[1]));
  const starAspect = starWidth / Math.max(1, starHeight);
  assert(starAspect >= 0.7 && starAspect <= 1.7, `교차 오각별의 가로·세로 비율이 ${starAspect.toFixed(2)}로 읽기 어렵습니다.`);
  assert(targetLabels === 2 && givenLabels === 2, "교차 오각별의 목표·주어진 각 표시 수가 다릅니다.");
  assert((attribute(svg, "data-tip-angles") || "").split(",").length === 5, "교차 오각별 꼭짓각 data 자료가 다섯 개가 아닙니다.");
  assert(attribute(svg, "data-outside-angle") === String(payload.outsideAngle) && attribute(svg, "data-target-sum") === String(payload.answerNumber), "교차 오각별 data 속성이 다릅니다.");
  assert(Number(attribute(svg, "data-label-gap")) >= 48, "교차각 숫자와 꼭짓각 숫자의 간격이 너무 좁습니다.");
}

function auditSourceAnchors() {
  const fixed = [
    (61 + 43) / 2,
    180 - (15 + 25 + 45 + 30),
    360,
    (180 - 136) / 2,
    40 - 22,
    180,
    112 - 38 - 47,
    180 - (28 + 25 + 40 + 34),
    360 - (80 + 42 + 64 + 38 + 73),
    80 + 15,
    124 - 42,
    7 * 180 - 2 * 360
  ];
  const expected = [52, 65, 360, 22, 18, 180, 27, 53, 63, 95, 82, 540];
  fixed.forEach((value, index) => check(value === expected[index], `원문 고정 기준 ${index + 1}번이 ${value}로 계산되었습니다.`));
  check((180 - 136) / 2 === 22 && 40 - 22 === 18, "예제 4-3의 두 단계 계산이 다릅니다.");
}

auditSourceAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 2 && Number(item.exploration) === 4);
check(sourceItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${sourceItems.length}`);
check(sourceItems.map(item => item.sourceItemId).join("|") === expectedSourceIds.join("|"), "variant 0..10과 원문 목록 순서·매핑이 다릅니다.");
check(sourceItems.map(item => item.sourceItemLabel).join("|") === expectedLabels.join("|"), "원문 항목 라벨 순서가 다릅니다.");
check(new Set(sourceItems.map(item => item.typeLabel)).size === 11, "11개 원문 항목의 유형명이 서로 다르지 않습니다.");
check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);

const promptSets = Array.from({ length: 11 }, () => difficulties.map(() => new Set()));
const complexitySums = Array.from({ length: 11 }, () => difficulties.map(() => 0));
const kindOwners = new Map();
let generatedCount = 0;

for (let variant = 0; variant < 11; variant += 1) {
  const type = { id: expectedSourceIds[variant], name: sourceItems[variant]?.typeLabel || expectedSourceIds[variant], generatorKey, variant };
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    const difficulty = difficulties[difficultyIndex];
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      const context = `variant ${variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, variant);
        assert(generated?.generator === generatorKey, "다른 생성기가 호출되었습니다.");
        assert(Boolean(generated.prompt && generated.answer !== "" && generated.solution), "문제·정답·풀이가 비었습니다.");
        const visible = visibleText(`${generated.prompt} ${generated.answer} ${generated.solution}`);
        assert(/[가-힣]/.test(visible), "학생용 한글 문장이 없습니다.");
        assert(!/undefined|null|NaN|Infinity/.test(visible), "깨진 계산값이 보입니다.");
        assert(!/[\u3400-\u4DBF\u4E00-\u9FFF]/.test(visible), "학생용 문장에 어려운 한자가 보입니다.");
        assert(!/[A-Za-z]/.test(visible), "학생용 문장에 불필요한 영문이 보입니다.");
        for (const term of [/순열/, /조합/, /방정식/, /미지수/, /삼각함수/, /라디안/, /보각/, /맞꼭지각/]) assert(!term.test(visible), `초등학생에게 어려운 표현 ${term}이 보입니다.`);
        assert(/^-?\d+$/.test(String(generated.answer)), `답이 단일 계산값이 아닙니다: ${generated.answer}`);

        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds[variant], `분기 구조가 ${evidence.kind}로 바뀌었습니다.`);
        assert(evidence.payload.variant === variant && evidence.payload.level === difficulty + 1, "variant 또는 난이도 자료가 다릅니다.");
        assert(Number.isFinite(evidence.payload.complexity), "난이도 복잡도 자료가 없습니다.");
        const owner = kindOwners.get(evidence.kind);
        assert(owner === undefined || owner === variant, `검산 구조 ${evidence.kind}가 둘 이상의 원문 항목에 쓰였습니다.`);
        kindOwners.set(evidence.kind, variant);

        auditSvg(generated.prompt, variant, evidence.payload);
        const independent = independentAnswer(evidence.kind, evidence.payload);
        assert(independent === evidence.declared, `생성기 선언 답 ${evidence.declared}과 독립 답 ${independent}이 다릅니다.`);
        assert(independent === String(generated.answer), `표시 답 ${generated.answer}과 독립 답 ${independent}이 다릅니다.`);
        assert(generated.solution.includes(independent), "풀이에 독립 계산 결과가 없습니다.");
        assert(visibleText(generated.solution).length >= 45, "풀이 단계가 너무 짧습니다.");

        promptSets[variant][difficultyIndex].add(generated.prompt);
        complexitySums[variant][difficultyIndex] += evidence.payload.complexity;
        generatedCount += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
}

for (let variant = 0; variant < 11; variant += 1) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets[variant][difficultyIndex].size >= 10, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 ${promptSets[variant][difficultyIndex].size}개뿐입니다.`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 복잡도 평균이 증가하지 않습니다 (${averages.map(value => value.toFixed(1)).join(", ")}).`);
}

check(kindOwners.size === 11, `서로 식별되는 원문 검산 구조가 11개가 아닙니다: ${kindOwners.size}`);
check(generatedCount === 11 * difficulties.length * seedsPerDifficulty, `생성 검산 횟수가 ${generatedCount}회입니다.`);

if (failures.length) {
  console.error(`4-1 각도 개념탐구 4 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  process.exit(1);
}

console.log(`4-1 각도 개념탐구 4 전용 감사 통과: 원문 11항목 · 11개 kind/variant · ${generatedCount.toLocaleString()}회 독립 검산 · SVG/답/풀이/한글/다양성 확인`);
console.log("원문 고정 기준 답: 52° · 65° · 360° · 22°·18° · 180° · 27° · 53° · 63° · 95° · 82° · 540°");
