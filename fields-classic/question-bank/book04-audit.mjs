import { GENERATORS } from "./generators.js";
import { book04Markup } from "./book04-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const book = CURRICULUM.find((item) => item.id === "book-04");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const stages = TEXTBOOK_STAGES.map((stage) => stage.id);
const expectedUnitCounts = [42, 35, 34, 42];

const fail = (id, difficulty, message) => { throw new Error(`${id} / L${difficulty}: ${message}`); };
const assert = (condition, id, difficulty, message) => { if (!condition) fail(id, difficulty, message); };
const firstNumber = (value) => Number(String(value).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0]);

function connected(cells) {
  const keys = new Set(cells.map(([row, column]) => `${row}:${column}`));
  const seen = new Set();
  const queue = [cells[0]];
  while (queue.length) {
    const [row, column] = queue.shift();
    const key = `${row}:${column}`;
    if (seen.has(key)) continue;
    seen.add(key);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => {
      const next = `${row + dr}:${column + dc}`;
      if (keys.has(next) && !seen.has(next)) queue.push([row + dr, column + dc]);
    });
  }
  return seen.size === cells.length;
}

function transformGrid(grid, operation) {
  const rows = grid.length;
  const columns = grid[0].length;
  if (operation === "rotate-right") return Array.from({ length: columns }, (_, row) => Array.from({ length: rows }, (_, column) => grid[rows - 1 - column][row]));
  if (operation === "rotate-half") return grid.map((row) => [...row].reverse()).reverse();
  if (operation === "mirror-left-right") return grid.map((row) => [...row].reverse());
  return [...grid].reverse().map((row) => [...row]);
}

function foldedCoordinate(row, column, size, folds) {
  let rows = size;
  let columns = size;
  folds.forEach((fold) => {
    if (fold.axis === "vertical") {
      column = Math.min(column, columns - 1 - column);
      columns /= 2;
    } else {
      row = Math.min(row, rows - 1 - row);
      rows /= 2;
    }
  });
  return { row, column };
}

function seatLabel(position, rows, columns) {
  const [row, column] = position;
  const vertical = rows === 1 ? "" : row === 0 ? "윗줄 " : "아랫줄 ";
  const horizontal = columns === 2 ? (column === 0 ? "왼쪽" : "오른쪽") : ["왼쪽", "가운데", "오른쪽"][column];
  return `${vertical}${horizontal}`.trim();
}

function validateSurface(problem, id, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  assert(problem.prompt?.trim(), id, difficulty, "prompt missing");
  assert(String(problem.answer ?? "").trim(), id, difficulty, "answer missing");
  assert(problem.solution?.trim(), id, difficulty, "solution missing");
  assert(!/undefined|NaN|\[object Object\]/.test(text), id, difficulty, "invalid text token");
  assert(!/퍼뮤테이션|컴비네이션|제곱/.test(text), id, difficulty, "child-facing forbidden term");
  if (problem.visual?.kind === "book4") assert(book04Markup(problem.visual), id, difficulty, "blank book4 visual markup");
  if (problem.answerVisual?.kind === "book4") assert(book04Markup(problem.answerVisual), id, difficulty, "blank book4 answer visual markup");
}

function validate(type, problem, difficulty) {
  const id = type.id;
  const meta = problem.meta || {};
  const numeric = firstNumber(problem.answer);
  validateSurface(problem, id, difficulty);

  switch (meta.family) {
    case "tetromino-family":
      assert(meta.optionValidity.filter((valid) => !valid).length === 1, id, difficulty, "non-tetromino answer not unique");
      meta.optionCells.forEach((cells, index) => assert(connected(cells) === meta.optionValidity[index], id, difficulty, "connectivity label mismatch"));
      assert(numeric === meta.correctOption, id, difficulty, "tetromino option mismatch");
      return;
    case "tetromino-fit":
      assert(meta.optionIds.filter((optionId) => optionId === meta.targetId).length === 1, id, difficulty, "fit answer not unique");
      assert(meta.optionIds[meta.correctOption - 1] === meta.targetId, id, difficulty, "fit option mismatch");
      return;
    case "digital-grid-transform": {
      const result = meta.operations.reduce((grid, operation) => transformGrid(grid, operation), meta.source);
      assert(JSON.stringify(result) === JSON.stringify(meta.result), id, difficulty, "grid transform mismatch");
      assert(result[meta.target.row][meta.target.column] === meta.answer && numeric === meta.answer, id, difficulty, "grid target mismatch");
      return;
    }
    case "digital-arithmetic": {
      const expected = meta.operator === "+" ? meta.rows[0].result + meta.rows[1].result : meta.rows[0].result - meta.rows[1].result;
      assert(expected === meta.answer && numeric === expected, id, difficulty, "digital arithmetic mismatch");
      assert(meta.operator !== "-" || expected >= 0, id, difficulty, "negative child answer");
      return;
    }
    case "fold-number-grid": {
      const expectedCells = [];
      meta.grid.forEach((rowValues, row) => rowValues.forEach((value, column) => {
        const position = foldedCoordinate(row, column, meta.size, meta.folds);
        if (position.row === meta.target.row && position.column === meta.target.column) expectedCells.push(value);
      }));
      const actualCells = meta.cutCells.map((cell) => cell.value);
      assert(JSON.stringify(expectedCells) === JSON.stringify(actualCells), id, difficulty, "fold orbit mismatch");
      assert(expectedCells.reduce((sum, value) => sum + value, 0) === meta.answer && numeric === meta.answer, id, difficulty, "fold sum mismatch");
      assert(meta.cutCells.length === 2 ** meta.folds.length, id, difficulty, "fold layer count mismatch");
      return;
    }
    case "fold-surface-top": {
      const allLabels = meta.finalStacks.flat(2);
      assert(allLabels.length === 4 && new Set(allLabels).size === 4, id, difficulty, "surface stack lost or duplicated a cell");
      assert(meta.finalStacks[meta.target.row][meta.target.column][0] === meta.answer, id, difficulty, "top surface mismatch");
      return;
    }
    case "pair-sum-cards":
      meta.pairs.forEach((pair) => assert(pair[0] + pair[1] === meta.target, id, difficulty, "pair sum mismatch"));
      assert(meta.pairs[meta.blankPair][meta.blankSide] === meta.answer && numeric === meta.answer, id, difficulty, "blank card mismatch");
      return;
    case "shape-difference-chain":
      meta.increments.forEach((difference, index) => assert(meta.values[index + 1] - meta.values[index] === difference, id, difficulty, "shape difference mismatch"));
      assert(meta.values.at(-1) - meta.values[0] === meta.answer && numeric === meta.answer, id, difficulty, "shape target mismatch");
      return;
    case "measurement-order": {
      const values = [meta.base];
      meta.differences.forEach((difference) => values.push(values.at(-1) + difference));
      assert(JSON.stringify(values) === JSON.stringify(meta.values), id, difficulty, "measurement chain mismatch");
      assert(meta.values[meta.targetIndex] === meta.answer && numeric === meta.answer, id, difficulty, "measurement answer mismatch");
      return;
    }
    case "balance-unit-ratio":
      assert(meta.ratios.reduce((product, ratio) => product * ratio, 1) === meta.answer && numeric === meta.answer, id, difficulty, "balance ratio mismatch");
      return;
    case "directional-seat": {
      const positions = meta.path.map(([row, column]) => `${row}:${column}`);
      assert(new Set(positions).size === meta.rows * meta.columns, id, difficulty, "seat path repeats or misses a position");
      meta.path.slice(1).forEach(([row, column], index) => {
        const [previousRow, previousColumn] = meta.path[index];
        assert(Math.abs(row - previousRow) + Math.abs(column - previousColumn) === 1, id, difficulty, "seat clue is not adjacent");
      });
      const target = meta.placements.find((placement) => placement.name === meta.target);
      assert(target && seatLabel([target.row, target.column], meta.rows, meta.columns) === meta.answer, id, difficulty, "seat answer mismatch");
      return;
    }
    case "circular-seat": {
      const expected = meta.relation === "마주 보는"
        ? (meta.targetIndex + meta.count / 2) % meta.count
        : (meta.targetIndex + 1) % meta.count;
      assert(expected === meta.answerIndex && meta.clockwise[expected] === meta.answer, id, difficulty, "circular answer mismatch");
      assert(new Set(meta.clockwise).size === meta.count, id, difficulty, "circular names repeat");
      return;
    }
    case "ordinal-line":
      assert(meta.uniqueCount === 1 && numeric === meta.answer, id, difficulty, "ordinal line answer not unique");
      return;
    default:
      // 1~3권과 Geometry Worksheet에서 이미 독립 검산한 재사용 생성기다.
      assert(meta.family || type.generator, id, difficulty, "reused generator has no audit identity");
  }
}

if (!book) throw new Error("book-04 missing");
if (units.length !== 4) throw new Error(`book-04 unit count ${units.length}`);
if (typeIds.length !== 28) throw new Error(`book-04 type count ${typeIds.length}`);

let sourceQuestionCount = 0;
units.forEach((unit, unitIndex) => {
  const seen = new Set();
  let unitCount = 0;
  for (const typeId of unit.typeIds) {
    const type = typeById(typeId);
    if (!type) throw new Error(`unknown type ${typeId}`);
    if (!type.generator && !type.worksheetCode) throw new Error(`no generation route ${typeId}`);
    if (textbookGuideForType(typeId).startsWith("문제에 보이는 관계")) throw new Error(`generic guide ${typeId}`);
    const references = unit.typeStudyRefs?.[typeId];
    if (!references) throw new Error(`typeStudyRefs missing ${typeId}`);
    for (const stage of stages) {
      for (const reference of references[stage] || []) {
        if (!Array.isArray(reference.numbers) || !reference.numbers.length) throw new Error(`problem numbers missing ${typeId}/${stage}`);
        for (const number of reference.numbers) {
          if (!Number.isInteger(number) || number < 1) throw new Error(`invalid problem number ${typeId}/${stage}`);
          const key = `${stage}:${reference.section}:${reference.group}:${number}`;
          if (seen.has(key)) throw new Error(`duplicate source question ${unit.label}/${key}`);
          seen.add(key);
          unitCount += 1;
        }
      }
    }
  }
  if (unitCount !== expectedUnitCounts[unitIndex]) throw new Error(`${unit.label} source count ${unitCount}, expected ${expectedUnitCounts[unitIndex]}`);
  sourceQuestionCount += unitCount;
});

const variants = new Map();
let generated = 0;
let worksheetOnly = 0;
for (const typeId of typeIds) {
  const type = typeById(typeId);
  // Geometry Worksheet 생성기는 브라우저에서 전역 GW_GEN을 로드한 뒤 동작한다.
  // Node 감사에서는 승인된 연결만 확인하고 실제 수학·그림은 브라우저 QA에서 검사한다.
  if (type.worksheetCode) {
    assert(type.worksheetCode && type.bankApproved, typeId, 0, "worksheet-only type is not approved");
    worksheetOnly += 1;
    continue;
  }
  const generator = GENERATORS[type.generator];
  assert(generator, typeId, 0, `missing generator ${type.generator}`);
  for (const difficulty of [1, 2, 3]) {
    const fingerprints = new Set();
    for (let run = 0; run < iterations; run += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 100 && !problem; attempt += 1) problem = generator({ difficulty });
      assert(problem, typeId, difficulty, "generator returned null");
      validate(type, problem, difficulty);
      fingerprints.add(JSON.stringify(problem.meta || { prompt: problem.prompt, answer: problem.answer, visual: problem.visual }));
      generated += 1;
    }
    assert(fingerprints.size >= 3, typeId, difficulty, `only ${fingerprints.size} variants`);
    variants.set(`${typeId}/L${difficulty}`, fingerprints.size);
  }
}

assert(sourceQuestionCount === 153, "book-04", 0, `source count ${sourceQuestionCount}`);
const minVariants = Math.min(...variants.values());
console.log(`BOOK04_AUDIT_OK types=${typeIds.length} sourceQuestions=${sourceQuestionCount} generated=${generated} worksheetOnly=${worksheetOnly} minVariants=${minVariants}`);
