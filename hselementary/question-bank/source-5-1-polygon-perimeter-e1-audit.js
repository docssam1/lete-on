"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;

const expected = [
  ["5-1-u6-e1-exploration", "two-layout-perimeter-difference", "exploration"],
  ["5-1-u6-e1-example-1-1", "right-angle-outline-to-centimeters", "example"],
  ["5-1-u6-e1-example-1-2", "overlap-rectangles-perimeter-sum", "example"],
  ["5-1-u6-e1-example-1-3", "grid-piece-perimeters", "example"],
  ["5-1-u6-e1-example-1-4", "cut-triangle-hexagon-perimeter", "example"],
  ["5-1-u6-e1-mission-1", "notched-rectangle-depth", "mission"],
  ["5-1-u6-e1-mission-2", "square-inside-rectangle-perimeter", "mission"],
  ["5-1-u6-e1-mission-3", "equiangular-hexagon-perimeter", "mission"],
  ["5-1-u6-e1-mission-4", "grid-colored-perimeter-to-square", "mission"],
  ["5-1-u6-e1-mission-5", "four-rectangle-side-tuple", "mission"],
  ["5-1-u6-e1-mission-6", "locked-nonunique", "mission"]
];

const failures = [];
let checked = 0;
let context = "";
const fail = message => failures.push(context ? `${context}: ${message}` : message);
const check = (condition, message) => { if (!condition) fail(message); };
const near = (left, right, tolerance = 1e-6) => Math.abs(left - right) <= tolerance;
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const visible = html => String(html).replace(/<span hidden[^>]*><\/span>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const answerNumbers = value => [...String(value).matchAll(/-?\d[\d,]*(?:\.\d+)?/g)].map(match => Number(match[0].replace(/,/g, "")));
const parseEvidence = prompt => {
  const markup = String(prompt).match(/<span hidden data-polygon-perimeter-e1-kind="[^"]+"[^>]*><\/span>/)?.[0];
  if (!markup) throw new Error("독립 검산 태그가 없습니다.");
  const values = (attr(markup, "data-values") || "").split(",").map(Number);
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("검산 값이 올바르지 않습니다.");
  return {
    kind: attr(markup, "data-polygon-perimeter-e1-kind"),
    sourceItemId: attr(markup, "data-source-item"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    extraStep: attr(markup, "data-extra-step"),
    values
  };
};
const independent = ({ kind, values }) => {
  if (kind === "two-layout-perimeter-difference") return 2 * values[0];
  if (kind === "right-angle-outline-to-centimeters") return values.slice(0, 12).reduce((sum, value) => sum + value, 0) * 100;
  if (kind === "overlap-rectangles-perimeter-sum") {
    const [side, xOne, xTwo, yOne, yTwo] = values;
    return 2 * ((side - xOne) + (side - yOne) + (side - xTwo) + (side - yTwo));
  }
  if (kind === "grid-piece-perimeters") {
    const [width, height, cols, rows] = values;
    return cols * rows * 2 * (width / cols + height / rows);
  }
  if (kind === "cut-triangle-hexagon-perimeter") return values.slice(1, 7).reduce((sum, value) => sum + value, 0);
  if (kind === "notched-rectangle-depth") return (values[2] - 2 * (values[0] + values[1])) / 2;
  if (kind === "square-inside-rectangle-perimeter") return 2 * (values[0] + values[1]);
  if (kind === "equiangular-hexagon-perimeter") return values.slice(0, 6).reduce((sum, value) => sum + value, 0);
  if (kind === "grid-colored-perimeter-to-square") return values[2] * 12 / 5;
  if (kind === "four-rectangle-side-tuple") {
    const [, , , , totalHeight, perimeterA, perimeterN, perimeterD, perimeterR] = values;
    const topBottomDifference = perimeterN / 2 - perimeterA / 2;
    const bottomHeight = (totalHeight + topBottomDifference) / 2;
    const rightWidth = perimeterR / 2 - bottomHeight;
    check(near(rightWidth + totalHeight - bottomHeight, perimeterD / 2), "Mission 5의 다 둘레 관계가 맞지 않습니다.");
    return [rightWidth, bottomHeight];
  }
  throw new Error(`알 수 없는 검산 종류: ${kind}`);
};
const parseSvgs = prompt => [...String(prompt).matchAll(/<svg class="geometry-diagram polygon-perimeter-e1"([^>]*)>([\s\S]*?)<\/svg>/g)].map(match => ({ open: match[1], body: match[2] }));
const verifySvg = svg => {
  const pointData = attr(svg.open, "data-geometry-points");
  const segmentData = attr(svg.open, "data-geometry-segments");
  check(Boolean(pointData && segmentData), "SVG의 점·선분 근거가 없습니다.");
  if (!pointData || !segmentData) return null;
  const points = pointData.split(";").map(item => item.split(",").map(Number));
  check(points.every(point => point.length === 2 && point.every(Number.isFinite)), "SVG 점 좌표가 깨졌습니다.");
  const segments = segmentData.split(";").map(item => {
    const [index, a, b, role, length] = item.split(":");
    return { index: Number(index), a: Number(a), b: Number(b), role, length: Number(length) };
  });
  segments.forEach((segment, index) => {
    check(segment.index === index && points[segment.a] && points[segment.b], `SVG ${index}번 선분의 점 연결이 깨졌습니다.`);
    if (!points[segment.a] || !points[segment.b]) return;
    const actualLength = Math.hypot(points[segment.b][0] - points[segment.a][0], points[segment.b][1] - points[segment.a][1]);
    check(near(actualLength, segment.length, 2e-3), `SVG ${index}번 선분 길이가 좌표 길이와 다릅니다.`);
  });
  const labels = [...svg.body.matchAll(/<text([^>]*)>([^<]*)<\/text>/g)].map(match => ({ markup: match[1], text: match[2] }));
  labels.forEach(label => {
    const segmentIndex = attr(label.markup, "data-label-segment");
    const cell = attr(label.markup, "data-label-cell");
    check(segmentIndex !== undefined || cell !== undefined, `SVG 라벨 '${label.text}'에 선분 또는 칸 대상이 없습니다.`);
    if (segmentIndex !== undefined) {
      const segment = segments[Number(segmentIndex)];
      check(Boolean(segment), `SVG 라벨 '${label.text}'의 대상 선분이 없습니다.`);
      const statedValue = Number(attr(label.markup, "data-label-value"));
      if (segment && Number.isFinite(statedValue)) check(near(statedValue, segment.length, 2e-3), `SVG 라벨 '${label.text}'의 값이 대상 선분 길이와 다릅니다.`);
    }
    if (cell !== undefined) check(/^\d+:\d+$/.test(cell), `SVG 라벨 '${label.text}'의 칸 좌표가 잘못되었습니다.`);
  });
  return { points, segments, labels, kind: attr(svg.open, "data-geometry-kind"), open: svg.open, body: svg.body };
};
const verifyHardExpression = prompt => {
  const expressions = [...String(prompt).matchAll(/data-math-expression="([0-9×÷+.-]+)" data-math-value="([0-9.]+)"/g)];
  check(expressions.length >= 1, "어려움 단계에 실제 간접 조건 수식이 없습니다.");
  expressions.forEach(([, expression, expectedValue]) => {
    const calculated = Function(`"use strict"; return (${expression.replace(/×/g, "*").replace(/÷/g, "/")});`)();
    check(near(calculated, Number(expectedValue)), `간접 조건 ${expression}이 실제 값 ${expectedValue}과 다릅니다.`);
  });
};
const rectangleUnionPerimeter = rectangles => {
  const occupied = new Set();
  rectangles.forEach(([x, y, width, height]) => {
    for (let row = y; row < y + height; row += 1) for (let col = x; col < x + width; col += 1) occupied.add(`${col}:${row}`);
  });
  let perimeter = 0;
  occupied.forEach(key => {
    const [x, y] = key.split(":").map(Number);
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!occupied.has(`${x + dx}:${y + dy}`)) perimeter += 1; });
  });
  return perimeter;
};
const verifySpecialGeometry = (variant, models, evidence) => {
  if (variant === 0) {
    check(models.length === 2, "개념탐구 1에는 ①·② 두 그림이 필요합니다.");
    models.forEach(model => {
      check((attr(model.open, "data-small-rects") || "").split(";").length === 4, "각 배치에 같은 작은 직사각형 4개가 보이지 않습니다.");
      check((attr(model.open, "data-colored-rects") || "").split(";").filter(Boolean).length >= 1, "각 배치의 남은 색칠 영역이 없습니다.");
    });
    const smallRectangles = models.map(model => (attr(model.open, "data-small-rects") || "").split(";").map(rectangle => rectangle.split(",").map(Number)));
    const normalizedSides = rectangle => rectangle.slice(2).sort((left, right) => left - right).join("x");
    const normalized = rectangles => rectangles.map(normalizedSides).sort().join(";");
    const firstPieceKinds = new Set(smallRectangles[0].map(normalizedSides));
    check(firstPieceKinds.size === 1 && normalized(smallRectangles[0]) === normalized(smallRectangles[1]), "①·②의 작은 직사각형 네 개가 서로 합동이 아닙니다.");
    check(Number([...firstPieceKinds][0].split("x")[0]) === 6, "작은 직사각형의 짧은 변이 큰 직사각형의 가로와 세로의 차 6cm가 아닙니다.");
    const colored = models.map(model => (attr(model.open, "data-colored-rects") || "").split(";").map(rectangle => rectangle.split(",").map(Number)));
    check(Math.abs(rectangleUnionPerimeter(colored[0]) - rectangleUnionPerimeter(colored[1])) === 12, "①·②의 실제 색칠 경계 둘레 차가 12cm가 아닙니다.");
  }
  if (variant === 1) {
    const model = models[0];
    check(model.segments.length === 12, "예제 1-1의 폐곡선은 12개 선분이어야 합니다.");
    check(near(model.segments[11].length, 14), "예제 1-1의 12번째 닫는 선분이 14m가 아닙니다.");
    check(model.labels.filter(label => attr(label.markup, "data-label-segment") !== undefined).length === 10, "예제 1-1에는 알려진 길이 10개만 표시해야 합니다.");
    check(!model.labels.some(label => ["9", "10"].includes(attr(label.markup, "data-label-segment"))), "예제 1-1의 숨은 11m·12m 선분이 표시되었습니다.");
    check(near(Number(attr(model.open, "data-closed-perimeter")), model.segments.reduce((sum, segment) => sum + segment.length, 0), 2e-3), "예제 1-1의 SVG 폐곡선 둘레가 선분 합과 다릅니다.");
  }
  if (variant === 2) {
    const model = models[0];
    check(attr(model.open, "data-square-count") === "3" && attr(model.open, "data-overlap-count") === "2", "예제 1-2의 세 정사각형 또는 두 겹침 영역이 빠졌습니다.");
    check((model.body.match(/data-region="overlap-/g) || []).length === 2, "예제 1-2의 겹침 두 곳이 실제로 색칠되지 않았습니다.");
    check(attr(model.open, "data-total-range") === `${evidence.values[5]},${evidence.values[6]}`, "예제 1-2의 전체 가로·세로 범위가 생성 데이터와 다릅니다.");
  }
  if (variant === 3) {
    const model = models[0];
    check(attr(model.open, "data-grid") === "3x4" && attr(model.open, "data-cell-size") === `${evidence.values[0] / 3},${evidence.values[1] / 4}`, "예제 1-3의 3열×4행 직사각형 비가 생성 데이터와 다릅니다.");
    check(model.segments.filter(segment => segment.role === "division").length === 5, "예제 1-3의 안쪽 점선 수가 다릅니다.");
  }
  if (variant === 4) {
    const model = models[0];
    check(model.segments.filter(segment => segment.role === "original").length === 3, "예제 1-4의 원래 정삼각형 점선이 없습니다.");
    const labels = new Map(model.labels.map(label => [Number(attr(label.markup, "data-label-segment")), Number(attr(label.markup, "data-label-value"))]));
    check(labels.get(5) === evidence.values[4] && labels.get(1) === evidence.values[5] && labels.get(3) === evidence.values[6], "예제 1-4의 세 길이 라벨이 생성 데이터의 선분과 다릅니다.");
  }
  if (variant === 5) {
    const model = models[0], target = model.segments[Number(attr(model.open, "data-target-segment"))];
    check(model.points.length >= 16, "Mission 1의 왼쪽 계단 또는 위쪽 홈이 빠졌습니다.");
    check(Boolean(target) && near(model.points[target.a][0], model.points[target.b][0]) && near(target.length, evidence.values[3]), "Mission 1의 □가 생성 데이터의 홈 안쪽 세로 선분을 가리키지 않습니다.");
  }
  if (variant === 7) {
    const model = models[0];
    new Map([[0, evidence.values[0]], [1, evidence.values[1]], [2, evidence.values[2]], [5, evidence.values[5]]]).forEach((value, segment) => check(model.labels.some(label => Number(attr(label.markup, "data-label-segment")) === segment && Number(attr(label.markup, "data-label-value")) === value), `Mission 3의 ${value}cm 라벨이 실제 선분과 연결되지 않았습니다.`));
    check(model.labels.some(label => label.text === "㉠" && attr(label.markup, "data-label-segment") === "4"), "Mission 3의 ㉠ 위치가 다릅니다.");
    check(model.labels.some(label => label.text === "㉡" && attr(label.markup, "data-label-segment") === "3"), "Mission 3의 ㉡ 위치가 다릅니다.");
  }
  if (variant === 8) {
    const model = models[0];
    check(attr(model.open, "data-grid") === "3x4" && attr(model.open, "data-cell-size") === `${evidence.values[0]},${evidence.values[1]}`, "Mission 4의 외곽 정사각형 또는 작은 직사각형 비가 생성 데이터와 다릅니다.");
    check(attr(model.open, "data-marked-cells") === "1:1;1:2", "Mission 4의 가운데 열 가운데 두 칸이 색칠되지 않았습니다.");
    const xs = model.points.map(point => point[0]), ys = model.points.map(point => point[1]);
    check(near(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)), "Mission 4의 큰 외곽이 정사각형이 아닙니다.");
  }
  if (variant === 9) {
    const model = models[0];
    check(attr(model.open, "data-cell-layout") === "가,다;나,라", "Mission 5의 가·다/나·라 칸 배치가 원본과 다릅니다.");
    check(attr(model.open, "data-cell-perimeters") === `가:${evidence.values[5]};나:${evidence.values[6]};다:${evidence.values[7]};라:${evidence.values[8]}`, "Mission 5의 그림과 표 둘레 데이터가 다릅니다.");
    check(model.labels.some(label => label.text === "라" && attr(label.markup, "data-label-cell") === "1:1"), "Mission 5의 라 위치가 다릅니다.");
  }
};

const semester = curriculum.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u6");
const subunit = unit?.subunits.find(item => item.id === "5-1-u6-s1");
const types = subunit?.types || [];
check(Boolean(subunit), "5-1 6단원 개념탐구 1을 찾을 수 없습니다.");
check(types.length === 11, `세부 유형 수가 11개가 아닙니다: ${types.length}`);
check(new Set(types.map(type => type.sourceItemId)).size === 11, "출처 항목이 중복되었습니다.");
check(types.filter(type => !type.reviewLocked).length === 10 && types.filter(type => type.reviewLocked).length === 1, "공개 10개·잠금 1개 구성이 아닙니다.");

expected.forEach(([sourceItemId, kind, section], index) => {
  const type = types[index];
  check(Boolean(type), `${sourceItemId}: 유형이 없습니다.`);
  if (!type) return;
  check(type.variant === index && type.generatorKey === "polygonPerimeterE1", `${sourceItemId}: 원문 분기 또는 전용 생성기 연결이 다릅니다.`);
  check(type.sourceVerified && type.sourceTier === "advanced", `${sourceItemId}: 심화 원문 확인 상태가 아닙니다.`);
  check(type.sourceSection === section && type.sourceEvidence.includes(sourceItemId), `${sourceItemId}: 원문 유형 연결이 다릅니다.`);
  check(type.generationMode === "fixed-verified-pool" && type.answerVisualRequired, `${sourceItemId}: 고정 묶음 또는 정답 그림 계약이 없습니다.`);
  if (index < 10) {
    check(!type.reviewLocked && api.generatorKey(type) === "polygonPerimeterE1", `${sourceItemId}: 공개 생성 상태가 아닙니다.`);
    check(type.verifiedVariantCount === 3 && type.answerVisualStatus === "verified", `${sourceItemId}: 검증된 정답 그림 3문항 상태가 아닙니다.`);
  } else {
    check(type.reviewLocked && api.generatorKey(type) === "" && api.generate(type, 0, 0, 1, type.variant) === null, "Mission 6이 잠금 상태에서 생성됩니다.");
    check(type.verifiedVariantCount === 0 && type.answerVisualStatus === "locked" && kind === "locked-nonunique", "Mission 6의 잠금 계약이 다릅니다.");
  }
});

const forbidden = /undefined|null|NaN|Infinity|제곱근|순열|조합|방정식|미지수|259200|207700|13\.95|⑥의 넓이/;
const designExpected = { "-1": ["scaffold", "guided-order"], "0": ["source", "none"], "1": ["indirect", "derive-given-value"] };
for (const type of types.slice(0, 10)) {
  const designs = new Set();
  for (const difficulty of [-1, 0, 1]) {
    const promptVariants = new Set();
    const poolIndexes = new Set();
    for (let seed = 1; seed <= 1000; seed += 1) {
      context = `${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        check(Boolean(generated?.prompt && generated?.answer !== undefined && generated?.solution), "문제·정답·풀이가 비어 있습니다.");
        check(generated?.generator === "polygonPerimeterE1", "실제 생성기가 전용 생성기가 아닙니다.");
        check(generated?.generationMode === "fixed-verified-pool" && generated?.verifiedVariantCount === 3, "검증된 3문항 고정 묶음 표시가 없습니다.");
        check(Number.isInteger(generated?.verifiedPoolIndex) && generated.verifiedPoolIndex >= 0 && generated.verifiedPoolIndex < 3, "고정 묶음 문항 번호가 0~2가 아닙니다.");
        check(generated?.sourceItemId === type.sourceItemId, "생성 결과의 원문 유형 ID가 다릅니다.");
        check(typeof generated?.answerVisual === "string" && /class="verified-answer-diagram"/.test(generated.answerVisual), "정답 화면에 전용 그림이 없습니다.");
        check((generated.answerVisual.match(/<svg\b/g) || []).length === (generated.prompt.match(/<svg\b/g) || []).length, "문제 그림과 정답 그림의 개수가 다릅니다.");
        check(generated.answerVisual.includes(`data-answer-source="${type.sourceItemId}"`) && generated.answerVisual.includes(`data-verified-pool-index="${generated.verifiedPoolIndex}"`), "정답 그림의 원문·고정 묶음 연결이 다릅니다.");
        check(!forbidden.test(visible(`${generated.prompt}\n${generated.answer}\n${generated.solution}`)), "깨진 값·학년 밖 표현·폐기한 옛 문제가 남았습니다.");
        check(/class="math-measure"/.test(generated.prompt), "공통 길이 수식 표기가 없습니다.");
        const evidence = parseEvidence(generated.prompt);
        const [expectedDesign, expectedStep] = designExpected[String(difficulty)];
        check(evidence.sourceItemId === type.sourceItemId && evidence.kind === expected[type.variant][1], "출처 또는 계산 종류가 다릅니다.");
        check(evidence.contract === (type.variant === 9 ? "ordered-pair" : "single-value"), "답 계약이 다릅니다.");
        check(evidence.difficulty === expectedDesign && evidence.extraStep === expectedStep, "난이도 설계 근거가 다릅니다.");
        designs.add(evidence.difficulty);
        if (difficulty === -1) check(/data-step-evidence="guided-order"/.test(generated.prompt), "쉬움 단계에 확인 순서가 없습니다.");
        if (difficulty === 0) check(!/data-step-evidence="(?:guided-order|derive-given-value)"/.test(generated.prompt), "원본 단계에 도움말 또는 간접 조건이 섞였습니다.");
        if (difficulty === 1) verifyHardExpression(generated.prompt);
        const recalculated = independent(evidence);
        const shown = answerNumbers(generated.answer);
        if (Array.isArray(recalculated)) check(shown.length >= 2 && near(shown[0], recalculated[0]) && near(shown[1], recalculated[1]), `순서가 있는 답 ${generated.answer}가 독립 계산과 다릅니다.`);
        else check(shown.length >= 1 && near(shown[0], recalculated), `표시 답 ${generated.answer}가 독립 계산 ${recalculated}와 다릅니다.`);
        const models = parseSvgs(generated.prompt).map(verifySvg).filter(Boolean);
        check(models.length >= 1, "시각 문항의 SVG 모델이 없습니다.");
        verifySpecialGeometry(type.variant, models, evidence);
        promptVariants.add(visible(generated.prompt));
        poolIndexes.add(generated.verifiedPoolIndex);
        checked += 1;
      } catch (error) {
        fail(error.message);
      }
    }
    check(promptVariants.size === 3, `${type.sourceItemId}: 난이도 ${difficulty}에서 검증된 세 문항만 나와야 합니다: ${promptVariants.size}`);
    check(poolIndexes.size === 3 && [0, 1, 2].every(index => poolIndexes.has(index)), `${type.sourceItemId}: 난이도 ${difficulty}의 고정 묶음 3개가 모두 나오지 않습니다.`);
  }
  check(designs.size === 3, `${type.sourceItemId}: 세 난이도 설계가 서로 다르지 않습니다.`);
}

if (failures.length) {
  console.error(`5-1 6단원 E1 다각형의 둘레 독립 감사 실패: ${failures.length}건`);
  console.error(`확인 생성 수: ${checked.toLocaleString()}회 / 목표 30,000회`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`5-1 6단원 E1 다각형의 둘레 독립 감사 통과: 원문 11유형 · 공개 10/잠금 1 · ${checked.toLocaleString()}회 독립 계산·단일 답·점·선분·라벨·난이도 검사`);
