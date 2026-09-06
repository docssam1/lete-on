"use strict";

const fs = require("node:fs");
const path = require("node:path");

const questionBankDir = __dirname;
const readinessPath = path.join(questionBankDir, "source-inventory", "6-1-u6-source-readiness-review.json");
const readiness = JSON.parse(fs.readFileSync(readinessPath, "utf8"));
const publicIds = [
  "6-1-u6-e3-exploration", "6-1-u6-e3-example-1", "6-1-u6-e3-example-2", "6-1-u6-e3-example-3",
  "6-1-u6-e3-example-4", "6-1-u6-e3-mission-2", "6-1-u6-e3-mission-4", "6-1-u6-e3-mission-5", "6-1-u6-e3-mission-6"
];
const kinds = [
  "notched-cuboid-volume", "cuboid-net-volume", "alternating-chain-surface", "three-face-volume",
  "staircase-unpainted-surface", "seven-cube-cross-surface", "parallel-cut-volume", "top-front-volume", "incremental-stair-layers"
];
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const svg = html => html.match(/<svg\b[\s\S]*?<\/svg>/g) || [];
const attr = (html, name) => html.match(new RegExp(`\\bdata-${name}="([^"]*)"`))?.[1] || "";
const visibleSvgText = html => html.replace(/<[^>]+>/g, "");
const loadGenerators = () => {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  require("./generators.js");
  return global.window.HSE_GENERATORS;
};
const resultByPool = (api, type, pool, difficulty) => {
  for (let seed = 1000 + pool; seed < 100000; seed += 3) {
    const result = api.generate(type, 1, difficulty - 1, seed, type.variant);
    if (result?.verifiedPoolIndex === pool) return result;
  }
  throw new Error(`${type.sourceItemId}: pool ${pool} seed를 찾지 못했습니다.`);
};

// These are source inputs, not answer constants. Every expected answer below is recalculated from them.
const inputsById = {
  "6-1-u6-e3-exploration": [
    { a: 25, b: 10, c: 13, cutVolume: 512, surface: 1410 },
    { a: 27, b: 12, c: 15, cutVolume: 729, surface: 1818 },
    { a: 30, b: 15, c: 18, cutVolume: 1000, surface: 2520 }
  ],
  "6-1-u6-e3-example-1": [
    { a: 5, b: 7, c: 8, givenA: 5, givenSum: 12 },
    { a: 6, b: 8, c: 9, givenA: 6, givenSum: 14 },
    { a: 7, b: 9, c: 10, givenA: 7, givenSum: 16 }
  ],
  "6-1-u6-e3-example-2": [
    { a: 8, b: 6, c: 12, s: 4 },
    { a: 12, b: 9, c: 18, s: 6 },
    { a: 16, b: 12, c: 24, s: 8 }
  ],
  "6-1-u6-e3-example-3": [
    { areas: [48, 84, 112] },
    { areas: [54, 72, 108] },
    { areas: [70, 98, 140] }
  ],
  "6-1-u6-e3-example-4": [
    { faceArea: 4, painted: 288 },
    { faceArea: 5, painted: 360 },
    { faceArea: 6, painted: 432 }
  ],
  "6-1-u6-e3-mission-2": [
    { side: 5, totalVolume: 875 },
    { side: 6, totalVolume: 1512 },
    { side: 7, totalVolume: 2401 }
  ],
  "6-1-u6-e3-mission-4": [
    { side: 7, height: 12, surface: 2 * 7 * 7 + 4 * 7 * 12, splitSurface: 2 * 7 * 7 + 4 * 7 * 12 + 2 * 7 * 7 },
    { side: 6, height: 10, surface: 2 * 6 * 6 + 4 * 6 * 10, splitSurface: 2 * 6 * 6 + 4 * 6 * 10 + 2 * 6 * 6 },
    { side: 8, height: 14, surface: 2 * 8 * 8 + 4 * 8 * 14, splitSurface: 2 * 8 * 8 + 4 * 8 * 14 + 2 * 8 * 8 }
  ],
  "6-1-u6-e3-mission-5": [
    { a: 6, b: 7, h: 4, topPerimeter: 2 * (6 + 7), frontPerimeter: 2 * (6 + 4) },
    { a: 7, b: 8, h: 4, topPerimeter: 2 * (7 + 8), frontPerimeter: 2 * (7 + 4) },
    { a: 8, b: 9, h: 5, topPerimeter: 2 * (8 + 9), frontPerimeter: 2 * (8 + 5) }
  ],
  "6-1-u6-e3-mission-6": [
    { side: 2, n: 12 },
    { side: 2, n: 10 },
    { side: 2, n: 8 }
  ]
};

const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const positiveDirections = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const stairCells = () => {
  const cells = [];
  for (let z = 0; z < 4; z += 1) for (let x = 0; x < 4 - z; x += 1) for (let y = 0; y < 4 - z; y += 1) cells.push([x, y, z]);
  return cells;
};
const voxelRelations = cells => {
  const occupied = new Set(cells.map(cell => cell.join(",")));
  let exposed = 0, adjacentPairs = 0;
  cells.forEach(([x, y, z]) => {
    directions.forEach(([dx, dy, dz]) => {
      if (!occupied.has(`${x + dx},${y + dy},${z + dz}`)) exposed += 1;
    });
    positiveDirections.forEach(([dx, dy, dz]) => {
      if (occupied.has(`${x + dx},${y + dy},${z + dz}`)) adjacentPairs += 1;
    });
  });
  return { exposed, adjacentPairs, sharedFaceSides: adjacentPairs * 2, occupied };
};
const chainPieces = ({ a, b, c, s }) => {
  let x = 0;
  return Array.from({ length: 8 }, (_, index) => {
    const big = index % 2 === 0;
    const piece = { index: index + 1, x, width: big ? a : s, depth: big ? b : s, height: big ? c : s, kind: big ? "cuboid" : "cube" };
    x += piece.width;
    return piece;
  });
};
const contactArea = (left, right) => {
  const xTouch = left.x + left.width === right.x || right.x + right.width === left.x;
  if (!xTouch) return 0;
  return Math.min(left.depth, right.depth) * Math.min(left.height, right.height);
};
const integerTripleFromFaceAreas = ([ab, bc, ca]) => {
  for (let a = 1; a <= 100; a += 1) for (let b = 1; b <= 100; b += 1) for (let c = 1; c <= 100; c += 1) {
    if (a * b === ab && b * c === bc && c * a === ca) return [a, b, c];
  }
  return null;
};
const integerRoot = value => {
  for (let side = 1; side <= 100; side += 1) if (side ** 3 === value) return side;
  return null;
};
const independentAnswer = (sourceItemId, pool) => {
  const input = inputsById[sourceItemId][pool];
  const variant = publicIds.indexOf(sourceItemId);
  if (variant === 0) {
    const height = (input.surface - 2 * input.a * input.b) / (2 * input.a + 2 * input.b);
    assert(height === input.c, `${sourceItemId}/pool${pool}: 겉넓이로 복원한 높이가 입력과 다릅니다.`);
    return `${input.a * input.b * height - input.cutVolume}cm³`;
  }
  if (variant === 1) {
    const b = input.givenSum - input.givenA;
    const surface = 2 * (input.a * b + b * input.c + input.c * input.a);
    assert(b === input.b && surface > 0, `${sourceItemId}/pool${pool}: 전개도 입력으로 복원한 변이 맞지 않습니다.`);
    return `${input.a * b * input.c}cm³`;
  }
  if (variant === 2) {
    const pieces = chainPieces(input);
    const contacts = pieces.slice(0, -1).map((piece, index) => contactArea(piece, pieces[index + 1]));
    assert(pieces.length === 8, `${sourceItemId}/pool${pool}: 조각 수가 8개가 아닙니다.`);
    assert(contacts.length === 7 && contacts.every(area => area === input.s * input.s), `${sourceItemId}/pool${pool}: 7개 접촉면이 모두 작은 정육면체 한 면이 아닙니다.`);
    const separateSurface = pieces.reduce((sum, piece) => sum + 2 * (piece.width * piece.depth + piece.depth * piece.height + piece.height * piece.width), 0);
    return `${separateSurface - 2 * contacts.reduce((sum, area) => sum + area, 0)}cm²`;
  }
  if (variant === 3) {
    const sides = integerTripleFromFaceAreas(input.areas);
    assert(Boolean(sides), `${sourceItemId}/pool${pool}: 세 면 넓이에서 자연수 모서리를 찾지 못했습니다.`);
    return `${sides[0] * sides[1] * sides[2]}cm³`;
  }
  if (variant === 4) {
    const cells = stairCells();
    const relations = voxelRelations(cells);
    assert(relations.occupied.size === 30, `${sourceItemId}/pool${pool}: 계단 좌표가 유일하지 않습니다.`);
    assert(relations.exposed === 72 && relations.adjacentPairs === 54 && relations.sharedFaceSides === 108, `${sourceItemId}/pool${pool}: 계단 인접쌍·노출면 전수 계산이 맞지 않습니다.`);
    const faceArea = input.painted / relations.exposed;
    assert(faceArea === input.faceArea, `${sourceItemId}/pool${pool}: 칠한 면에서 한 면 넓이를 복원하지 못했습니다.`);
    return `${relations.sharedFaceSides * faceArea}cm²`;
  }
  if (variant === 5) {
    const side = integerRoot(input.totalVolume / 7);
    assert(side === input.side, `${sourceItemId}/pool${pool}: 7개 정육면체의 모서리를 부피에서 복원하지 못했습니다.`);
    return `${7 * 6 * side * side - 2 * 6 * side * side}cm²`;
  }
  if (variant === 6) {
    const sideSquared = (input.splitSurface - input.surface) / 2;
    const side = Math.sqrt(sideSquared);
    const height = (input.surface - 2 * sideSquared) / (4 * side);
    assert(Number.isInteger(side) && height === input.height, `${sourceItemId}/pool${pool}: 절단면에서 밑면과 높이를 복원하지 못했습니다.`);
    return `${sideSquared * height}cm³`;
  }
  if (variant === 7) {
    const width = input.topPerimeter / 2 - input.a;
    const height = input.frontPerimeter / 2 - input.a;
    return `${input.a * width * height}cm³`;
  }
  const target = input.side * input.side * input.n * (input.n + 5);
  const candidates = Array.from({ length: 100 }, (_, index) => index + 1).filter(n => input.side * input.side * n * (n + 5) === target);
  assert(candidates.length === 1, `${sourceItemId}/pool${pool}: 층수 조건의 자연수 후보가 하나가 아닙니다.`);
  return `${candidates[0]}층`;
};

const baseStairRelations = voxelRelations(stairCells());
assert(stairCells().length === 30, "예제 3-4 좌표 모델의 단위 큐브가 30개가 아닙니다.");
assert(baseStairRelations.occupied.size === 30, "예제 3-4 좌표 모델에 중복 좌표가 있습니다.");
assert(baseStairRelations.exposed === 72, "예제 3-4 좌표 모델의 노출면이 72개가 아닙니다.");
assert(baseStairRelations.adjacentPairs === 54, "예제 3-4 좌표 모델의 인접쌍이 54개가 아닙니다.");
assert(baseStairRelations.sharedFaceSides === 108, "예제 3-4 좌표 모델의 안쪽 공유면이 108개가 아닙니다.");
assert(readiness.items.filter(item => publicIds.includes(item.sourceItemId)).length === 9, "공개 E3 대상이 9개가 아닙니다.");
assert(readiness.items.filter(item => item.sourceItemId.endsWith("mission-1") || item.sourceItemId.endsWith("mission-3")).every(item => item.publicDecision === "locked" && item.implementationStatus === "review-locked"), "Mission 1·3 잠금 계약이 바뀌었습니다.");

const api = loadGenerators();
assert(api.names.includes("sourceGrade6VolumeSurfaceE3"), "직육면체 부피·겉넓이 E3 생성기가 등록되지 않았습니다.");
let generated = 0;
for (let variant = 0; variant < publicIds.length; variant += 1) {
  const sourceItemId = publicIds[variant];
  const type = { sourceItemId, generatorKey: "sourceGrade6VolumeSurfaceE3", variant, reviewLocked: false };
  for (const difficulty of [-1, 0, 1]) for (let pool = 0; pool < 3; pool += 1) {
    let result;
    try { result = resultByPool(api, type, pool, difficulty); } catch (error) { failures.push(error.message); continue; }
    generated += 1;
    const expectedAnswer = independentAnswer(sourceItemId, pool);
    assert(result.generationMode === "fixed-verified-pool" && result.verifiedVariantCount === 3, `${sourceItemId}/pool${pool}/difficulty${difficulty}: 고정 풀 계약이 아닙니다.`);
    assert(result.sourceItemId === sourceItemId && result.verifiedPoolIndex === pool, `${sourceItemId}/pool${pool}: source ID 또는 pool이 다릅니다.`);
    assert(result.answer === expectedAnswer, `${sourceItemId}/pool${pool}: 독립 공식·열거 답과 생성 답이 다릅니다.`);
    assert(!result.prompt.includes(result.answer), `${sourceItemId}/pool${pool}/difficulty${difficulty}: 문제 prompt에 정답 문자열이 있습니다.`);
    assert(!/제곱근|√|\^/.test(sourceItemId.endsWith("example-3") ? result.solution : ""), `${sourceItemId}: 풀이에 제곱근 또는 거듭제곱 표기가 있습니다.`);
    const problemSvgs = svg(result.prompt), answerSvgs = svg(result.answerVisual || "");
    assert(problemSvgs.length === 1 && answerSvgs.length === 1, `${sourceItemId}/pool${pool}: 문제·답 SVG가 정확히 하나씩 있어야 합니다.`);
    if (problemSvgs.length === 1 && answerSvgs.length === 1) {
      const problem = problemSvgs[0], answer = answerSvgs[0];
      assert(attr(problem, "source61-vs-e3-structure") === attr(answer, "source61-vs-e3-structure") && attr(problem, "source61-vs-e3-model") === attr(answer, "source61-vs-e3-model"), `${sourceItemId}/pool${pool}: 문제와 답의 기하 구조·model이 다릅니다.`);
      assert(attr(problem, "source61-vs-e3-structure") === kinds[variant], `${sourceItemId}: 원본 유형 구조 서명이 다릅니다.`);
      assert(attr(problem, "phase") === "problem" && attr(answer, "phase") === "answer", `${sourceItemId}/pool${pool}: 문제·답 phase가 다릅니다.`);
      assert(!/solution-answer|data-answer-source|is-solved|source61-vs-e3-result-label/.test(problem), `${sourceItemId}/pool${pool}: 문제 SVG에 답 강조가 있습니다.`);
      assert(/data-answer-source|is-solved|source61-vs-e3-result-label/.test(answer), `${sourceItemId}/pool${pool}: 답 SVG에 답 강조가 없습니다.`);
      if (variant === 2) {
        assert((problem.match(/data-chain-index=/g) || []).length === 8, `${sourceItemId}: 연결 조각 8개가 아닙니다.`);
        assert((problem.match(/data-contact-face=/g) || []).length === 7, `${sourceItemId}: 독립적으로 세어야 할 접촉면 7개가 아닙니다.`);
        assert(!/접촉면 7개|7곳/.test(visibleSvgText(problem)), `${sourceItemId}: 문제 그림의 보이는 글자에 접촉면 정답이 노출되었습니다.`);
        assert((problem.match(/source61-vs-e3-chain-side|source61-vs-e3-chain-cube-side/g) || []).length === 8, `${sourceItemId}: 8조각의 깊이 면이 모두 그려지지 않았습니다.`);
      }
      if (variant === 4) {
        const coordinateMatches = [...problem.matchAll(/data-stair-cube="\d+" data-coordinate="([^"]+)"/g)].map(match => match[1]);
        assert(coordinateMatches.length === 30 && new Set(coordinateMatches).size === 30, `${sourceItemId}: 30개 3D 큐브 좌표가 유일하게 그려지지 않았습니다.`);
        assert([16, 9, 4, 1].every((count, layer) => (problem.match(new RegExp(`data-stair-cube="\\d+" data-coordinate="[^\"]+,[^\"]+,${layer}"`, "g")) || []).length === count), `${sourceItemId}: 계단 층별 큐브 수가 16·9·4·1이 아닙니다.`);
        assert((problem.match(/source61-vs-e3-stair-face/g) || []).length >= 30, `${sourceItemId}: 실제 3D 계단 면이 충분히 그려지지 않았습니다.`);
      }
    }
  }
}
assert(api.generate({ sourceItemId: "6-1-u6-e3-mission-1", generatorKey: "sourceGrade6VolumeSurfaceE3", variant: 0, reviewLocked: true }, 1, 0, 1, 0) === null, "Mission 1이 생성기에 연결되었습니다.");
assert(api.generate({ sourceItemId: "6-1-u6-e3-mission-3", generatorKey: "sourceGrade6VolumeSurfaceE3", variant: 0, reviewLocked: true }, 1, 0, 1, 0) === null, "Mission 3이 생성기에 연결되었습니다.");

if (failures.length) {
  console.error(`6-1 6단원 E3 수학·구조·DOM 계약 감사 실패: ${failures.length}건`);
  failures.slice(0, 120).forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`6-1 6단원 E3 수학·구조·DOM 계약 감사 통과: ${publicIds.length}유형 × 3풀 × 3난이도 = ${generated}생성 · 입력별 독립 공식·좌표 열거 · 계단 30좌표/54인접쌍/72노출면/108공유면 · 잠금 2개`);
