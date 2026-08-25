import { GENERATORS } from "./generators.js";
import { book03Markup } from "./book03-renderers.js";
import { CURRICULUM, typeById } from "./source-data.js";

const RUNS = Number.parseInt(process.argv[2] || "120", 10);
const DIFFICULTIES = [1, 2, 3];

const checks = [];

function addCheck(name, status, detail) {
  checks.push({ name, status, detail });
}

function sampleProblems(generatorName, runs = RUNS) {
  const generator = GENERATORS[generatorName];
  if (!generator) throw new Error(`missing generator: ${generatorName}`);
  const problems = [];
  for (const difficulty of DIFFICULTIES) {
    for (let run = 0; run < runs; run += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 40 && !problem; attempt += 1) {
        problem = generator({ difficulty });
      }
      if (!problem) throw new Error(`${generatorName} returned null at difficulty ${difficulty}`);
      problems.push({ difficulty, problem });
    }
  }
  return problems;
}

function visualDimensions(visual) {
  if (!visual || typeof visual !== "object") return [];
  const pairs = [
    [visual.rows, visual.columns],
    [visual.rowCount, visual.columnCount],
    [visual.height, visual.width],
    [visual.gridRows, visual.gridColumns]
  ];
  if (Array.isArray(visual.grid) && Array.isArray(visual.grid[0])) {
    pairs.push([visual.grid.length, visual.grid[0].length]);
  }
  if (Array.isArray(visual.cells)) {
    const rows = visual.cells.map((cell) => cell.row ?? cell.r).filter(Number.isFinite);
    const cols = visual.cells.map((cell) => cell.column ?? cell.col ?? cell.c).filter(Number.isFinite);
    if (rows.length && cols.length) pairs.push([Math.max(...rows) + 1, Math.max(...cols) + 1]);
  }
  return pairs.filter(([rows, columns]) => Number.isFinite(rows) && Number.isFinite(columns));
}

function auditColoredCellSupport() {
  const samples = sampleProblems("coloredCellNumberCode");
  const fiveCell = samples.some(({ problem }) => {
    const visual = problem.visual || {};
    const weights = visual.weights || problem.meta?.weights || [];
    return Array.isArray(weights) && weights.length >= 5 && Math.max(...weights) >= 16;
  });
  const twoByThree = samples.some(({ problem }) => (
    visualDimensions(problem.visual).some(([rows, columns]) => (
      (rows === 3 && columns === 2) || (rows === 2 && columns === 3)
    ))
  ));
  const highValue = samples.some(({ problem }) => Number(problem.meta?.answer ?? problem.answer) > 15);
  if (fiveCell && twoByThree && highValue) {
    addCheck("colored-cell 5칸/2x3 지원", "SAFE", "5칸 자리값, 2x3 도형수, 15 초과 답을 모두 생성함");
  } else {
    addCheck(
      "colored-cell 5칸/2x3 지원",
      "UNSAFE",
      `미구현: fiveCell=${fiveCell}, twoByThree=${twoByThree}, answerAbove15=${highValue}`
    );
  }
}

function auditSymbolValueFamily() {
  const samples = sampleProblems("symbolValueCode");
  const sourceFamily = samples.some(({ problem }) => problem.meta?.family === "symbol-value-code");
  const sourceSubtype = samples.some(({ problem }) => problem.visual?.subtype === "symbol-value-code");
  const equationOnly = samples.every(({ problem }) => (
    Array.isArray(problem.visual?.rows)
    && problem.visual.rows.every((row) => Array.isArray(row.symbols) && Number.isFinite(row.total))
  ));
  if (sourceFamily && sourceSubtype && !equationOnly) {
    addCheck("symbol-value code family", "SAFE", "원본 비밀수 코드 계열 family/subtype으로 생성함");
  } else {
    addCheck(
      "symbol-value code family",
      "UNSAFE",
      `미구현: meta.family=symbol-value-code ${sourceFamily}, visual.subtype=symbol-value-code ${sourceSubtype}, equationOnly=${equationOnly}`
    );
  }
}

function countUnfilledCells(visual) {
  const shown = visual?.shown || [];
  return shown.filter((value) => value == null || typeof value === "string").length;
}

function auditMagicCompletionDifficulty() {
  const samples = sampleProblems("magicSquareThreeComplete");
  const byDifficulty = new Map(DIFFICULTIES.map((difficulty) => [difficulty, []]));
  for (const { difficulty, problem } of samples) {
    byDifficulty.get(difficulty).push(countUnfilledCells(problem.visual));
  }
  const minimums = Object.fromEntries([...byDifficulty].map(([difficulty, counts]) => [difficulty, Math.min(...counts)]));
  const fullDrawing = samples.every(({ problem }) => (
    problem.responseKind === "drawing"
    && problem.visual?.subtype === "magic-grid"
    && problem.visual?.size === 3
    && problem.answerVisual?.shown?.length === 9
  ));
  const enoughCompletionLoad = Object.values(minimums).every((minimum) => minimum >= 5);
  if (fullDrawing && enoughCompletionLoad) {
    addCheck("마방진 완성형 난이도", "SAFE", `3x3 완성형 유지, difficulty별 최소 빈칸=${JSON.stringify(minimums)}`);
  } else {
    addCheck(
      "마방진 완성형 난이도",
      "UNSAFE",
      `fullDrawing=${fullDrawing}, 최소 빈칸=${JSON.stringify(minimums)}`
    );
  }
}

function parseSvgNodes(markup) {
  const circles = [...markup.matchAll(/<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"/g)];
  return circles.map((match) => ({ x: Number(match[1]), y: Number(match[2]), r: Number(match[3]) }));
}

function distanceFromLine(point, left, right) {
  const dx = right.x - left.x;
  const dy = right.y - left.y;
  const length = Math.hypot(dx, dy);
  if (!length) return Infinity;
  return Math.abs(dy * point.x - dx * point.y + right.x * left.y - right.y * left.x) / length;
}

function auditPolygonLineGeometry() {
  const samples = sampleProblems("polygonRingEqualSum", Math.min(RUNS, 30));
  const lines = [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 8], [8, 9, 0]];
  let checked = 0;
  let failures = 0;
  for (const { problem } of samples) {
    const markup = book03Markup(problem.visual);
    const nodes = parseSvgNodes(markup);
    if (nodes.length !== 10) {
      failures += 1;
      continue;
    }
    checked += 1;
    const collinear = lines.every(([a, b, c]) => distanceFromLine(nodes[b], nodes[a], nodes[c]) <= 2);
    if (!collinear) failures += 1;
  }
  if (checked && failures === 0) {
    addCheck("polygon line geometry", "SAFE", `${checked}개 렌더에서 각 합산선의 세 원이 같은 직선 위에 있음`);
  } else {
    addCheck(
      "polygon line geometry",
      "UNSAFE",
      `미구현: checked=${checked}, nonCollinearOrMissing=${failures}`
    );
  }
}

function auditFourByFourFullCompletion() {
  const samples = sampleProblems("magicSquareFourComplete");
  const blankCounts = samples.map(({ problem }) => countUnfilledCells(problem.visual));
  const minBlank = Math.min(...blankCounts);
  const maxBlank = Math.max(...blankCounts);
  const fullDrawing = samples.every(({ problem }) => (
    problem.responseKind === "drawing"
    && problem.visual?.subtype === "magic-grid"
    && problem.visual?.size === 4
    && problem.answerVisual?.shown?.length === 16
  ));
  const fullCompletion = fullDrawing && minBlank >= 8;
  if (fullCompletion) {
    addCheck("4x4 전체 완성형 여부", "SAFE", `4x4 완성형 유지, 빈칸 범위=${minBlank}~${maxBlank}`);
  } else {
    addCheck(
      "4x4 전체 완성형 여부",
      "UNSAFE",
      `미구현: fullDrawing=${fullDrawing}, 빈칸 범위=${minBlank}~${maxBlank}, 원본은 1~16 전체 완성형`
    );
  }
}

auditColoredCellSupport();
auditSymbolValueFamily();
auditMagicCompletionDifficulty();
auditPolygonLineGeometry();
auditFourByFourFullCompletion();

const unit04 = CURRICULUM.find((book) => book.id === "book-03")?.units?.[3];
const blockedChecks = {
  "colored-cell 5칸/2x3 지원": typeById("colored-cell-number-code")?.sourceAuditBlocked === true,
  "symbol-value code family": typeById("symbol-value-code")?.sourceAuditBlocked === true,
  "polygon line geometry": ["type", "practice"].every((stage) => unit04?.sourceAuditBlockedStages?.["polygon-ring-equal-sum"]?.includes(stage)),
  "4x4 전체 완성형 여부": typeById("magic-square-four-complete")?.sourceAuditBlocked === true
};
for (const check of checks) {
  if (check.status === "UNSAFE" && blockedChecks[check.name]) {
    check.status = "BLOCKED";
    check.detail = `선택 차단 확인 · ${check.detail}`;
  }
}

const unsafe = checks.filter((check) => check.status === "UNSAFE");

console.log("| check | status | detail |");
console.log("| --- | --- | --- |");
for (const check of checks) {
  console.log(`| ${check.name} | ${check.status} | ${check.detail} |`);
}
console.log(`BOOK03_UNIT04_SOURCE_AUDIT ${unsafe.length ? "UNSAFE" : "SAFE"} checks=${checks.length} unsafe=${unsafe.length} runs=${RUNS}`);

if (unsafe.length) process.exitCode = 1;
