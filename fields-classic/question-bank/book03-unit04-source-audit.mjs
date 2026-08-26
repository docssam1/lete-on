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
  const twoByFour = samples.some(({ problem }) => (
    visualDimensions(problem.visual).some(([rows, columns]) => (
      (rows === 4 && columns === 2) || (rows === 2 && columns === 4)
    ))
  ));
  const highValue = samples.some(({ problem }) => Number(problem.meta?.answer ?? problem.answer) > 15);
  const reverse = samples.some(({ problem }) => problem.meta?.mode === "color" && problem.answerVisual);
  if (fiveCell && twoByFour && highValue && reverse) {
    addCheck("colored-cell 5칸/2x4 지원", "SAFE", "5칸 자리값, 2x4 도형수, 15 초과 답, 주어진 수 색칠하기를 모두 생성함");
  } else {
    addCheck(
      "colored-cell 5칸/2x4 지원",
      "UNSAFE",
      `미구현: fiveCell=${fiveCell}, twoByFour=${twoByFour}, answerAbove15=${highValue}, reverse=${reverse}`
    );
  }
}

function auditSymbolValueFamily() {
  const samples = sampleProblems("symbolValueCode");
  const sourceRows = [
    JSON.stringify([[1, 1, 0], [2, 1, 0], [1, 1, 1], [1, 2, 2]]),
    JSON.stringify([[1, 1, 0], [3, 2, 0], [0, 1, 1], [0, 1, 3]])
  ];
  const countSolutions = (problem) => {
    let count = 0;
    for (let first = 1; first <= problem.meta.valueLimit; first += 1) {
      for (let second = 1; second <= problem.meta.valueLimit; second += 1) {
        for (let third = 1; third <= problem.meta.valueLimit; third += 1) {
          if (new Set([first, second, third]).size !== 3) continue;
          const values = [first, second, third];
          if (problem.meta.countRows.every((counts, index) => (
            counts.reduce((sum, item, valueIndex) => sum + item * values[valueIndex], 0) === problem.meta.rows[index].total
          ))) count += 1;
        }
      }
    }
    return count;
  };
  const sourceFamily = samples.every(({ problem }) => problem.meta?.family === "symbol-value-code");
  const sourceSubtype = samples.every(({ problem }) => problem.visual?.subtype === "symbol-value-code");
  const exactRows = samples.every(({ problem }) => sourceRows.includes(JSON.stringify(problem.meta?.countRows)));
  const connectedBoxes = samples.every(({ problem }) => book03Markup(problem.visual).includes("b3-symbol-value-box"));
  const allUnique = samples.every(({ problem }) => countSolutions(problem) === 1);
  if (sourceFamily && sourceSubtype && exactRows && connectedBoxes && allUnique) {
    addCheck("symbol-value code family", "SAFE", `${samples.length}문항 모두 원본 상자 4개 구조 · 도형값 답 1개`);
  } else {
    addCheck(
      "symbol-value code family",
      "UNSAFE",
      `불일치: family=${sourceFamily}, subtype=${sourceSubtype}, exactRows=${exactRows}, connectedBoxes=${connectedBoxes}, allUnique=${allUnique}`
    );
  }
}

function countUnfilledCells(visual) {
  const shown = visual?.shown || [];
  return shown.filter((value) => value == null || typeof value === "string").length;
}

function countMagicFourCompletions(problem, limit = 2) {
  const shown = problem.visual.shown;
  const grid = shown.map((value) => Number.isFinite(value) ? value : 0);
  const used = new Set(grid.filter(Boolean));
  let count = 0;

  const lineCanStillReach34 = (values) => {
    const sum = values.reduce((total, value) => total + value, 0);
    return values.every(Boolean) ? sum === 34 : sum < 34;
  };

  const validAt = (index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    if (!lineCanStillReach34(grid.slice(row * 4, row * 4 + 4))) return false;
    if (!lineCanStillReach34([grid[column], grid[column + 4], grid[column + 8], grid[column + 12]])) return false;
    if (!grid.includes(0)) {
      if (grid[0] + grid[5] + grid[10] + grid[15] !== 34) return false;
      if (grid[3] + grid[6] + grid[9] + grid[12] !== 34) return false;
    }
    return true;
  };

  const search = (start) => {
    if (count >= limit) return;
    let index = start;
    while (index < 16 && grid[index]) index += 1;
    if (index === 16) {
      count += 1;
      return;
    }
    for (let value = 1; value <= 16; value += 1) {
      if (used.has(value)) continue;
      grid[index] = value;
      used.add(value);
      if (validAt(index)) search(index + 1);
      used.delete(value);
      grid[index] = 0;
    }
  };

  search(0);
  return count;
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
  const byDifficulty = new Map(DIFFICULTIES.map((difficulty) => [difficulty, []]));
  samples.forEach(({ difficulty, problem }) => byDifficulty.get(difficulty).push(countUnfilledCells(problem.visual)));
  const ranges = Object.fromEntries([...byDifficulty].map(([difficulty, counts]) => [difficulty, [Math.min(...counts), Math.max(...counts)]]));
  const fullDrawing = samples.every(({ problem }) => (
    problem.responseKind === "visual-fill"
    && problem.visual?.subtype === "magic-grid"
    && problem.visual?.size === 4
    && problem.answerVisual?.shown?.length === 16
    && problem.visual.shown.every((value) => value == null || typeof value === "number")
  ));
  const sourceLoad = ranges[2][0] === 8 && ranges[2][1] === 8 && ranges[3][0] === 8 && ranges[3][1] === 8;
  const easierLoad = ranges[1][0] === 4 && ranges[1][1] === 4;
  const uniquePuzzles = new Map();
  for (const { problem } of samples) {
    const key = JSON.stringify({ shown: problem.visual.shown, solution: problem.meta.solution });
    if (!uniquePuzzles.has(key)) uniquePuzzles.set(key, countMagicFourCompletions(problem));
  }
  const allUnique = [...uniquePuzzles.values()].every((count) => count === 1);
  const fullCompletion = fullDrawing && sourceLoad && easierLoad && allUnique;
  if (fullCompletion) {
    addCheck("4x4 전체 완성형 여부", "SAFE", `원본 난이도 빈칸 8개, 쉬움 빈칸 4개, ${uniquePuzzles.size}개 배치 모두 답 1개 · ${JSON.stringify(ranges)}`);
  } else {
    addCheck(
      "4x4 전체 완성형 여부",
      "UNSAFE",
      `미구현: fullDrawing=${fullDrawing}, allUnique=${allUnique}, 빈칸 범위=${JSON.stringify(ranges)}, 원본 연습·심화는 빈칸 8개`
    );
  }
}

function auditEightCardFullCompletion() {
  const samples = sampleProblems("equalLineSumEightCardsCompleteBook3");
  const sums = new Set(samples.map(({ problem }) => problem.meta?.lineSum));
  const fullCompletion = samples.every(({ difficulty, problem }) => {
    const blanks = problem.visual?.shown?.filter((value) => value == null).length;
    const expectedBlanks = difficulty === 1 ? 4 : 5;
    return problem.meta?.family === "equal-line-eight-complete-book3"
      && problem.visual?.subtype === "equal-line-eight-complete"
      && problem.responseKind === "visual-fill"
      && problem.answerVisual?.shown?.length === 8
      && problem.meta?.candidateCount === 1
      && blanks === expectedBlanks;
  });
  if (fullCompletion && sums.has(12) && sums.has(15)) {
    addCheck("1~8 사각 둘레 전체 완성형", "SAFE", `${samples.length}문항 모두 합 12·15, 빈칸 전체 완성, 배열 답 1개`);
  } else {
    addCheck("1~8 사각 둘레 전체 완성형", "UNSAFE", `fullCompletion=${fullCompletion}, sums=${[...sums].join(",")}`);
  }
}

auditColoredCellSupport();
auditSymbolValueFamily();
auditMagicCompletionDifficulty();
auditPolygonLineGeometry();
auditFourByFourFullCompletion();
auditEightCardFullCompletion();

const unit04 = CURRICULUM.find((book) => book.id === "book-03")?.units?.[3];
const blockedChecks = {
  "colored-cell 5칸/2x4 지원": typeById("colored-cell-number-code")?.sourceAuditBlocked === true,
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
