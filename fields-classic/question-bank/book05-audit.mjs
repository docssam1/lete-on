import { GENERATORS } from "./generators.js";
import { book05Markup } from "./book05-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "300", 10);
const book = CURRICULUM.find((item) => item.id === "book-05");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const stages = TEXTBOOK_STAGES.map((stage) => stage.id);
const expectedUnitCounts = [34, 47, 36, 37];

const fail = (id, difficulty, message) => { throw new Error(`${id} / L${difficulty}: ${message}`); };
const assert = (condition, id, difficulty, message) => { if (!condition) fail(id, difficulty, message); };
const firstNumber = (value) => Number(String(value).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0]);
const sum = (items) => items.reduce((total, value) => total + value, 0);
const product = (items) => items.reduce((total, value) => total * value, 1);
const triangular = (number) => (number * (number + 1)) / 2;

function countPaths(rows, columns, blocked = new Set()) {
  const ways = Array.from({ length: rows }, () => Array(columns).fill(0));
  ways[0][0] = blocked.has("0:0") ? 0 : 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (row === 0 && column === 0) continue;
      if (blocked.has(`${row}:${column}`)) continue;
      ways[row][column] = (row ? ways[row - 1][column] : 0) + (column ? ways[row][column - 1] : 0);
    }
  }
  return ways[rows - 1][columns - 1];
}

function enumerateNumbers(digits, length) {
  const results = [];
  function visit(prefix, remaining) {
    if (prefix.length === length) {
      results.push(Number(prefix.join("")));
      return;
    }
    remaining.forEach((digit, index) => {
      if (!prefix.length && digit === 0) return;
      visit([...prefix, digit], [...remaining.slice(0, index), ...remaining.slice(index + 1)]);
    });
  }
  visit([], digits);
  return [...new Set(results)].sort((a, b) => a - b);
}

function permutations(items) {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) => permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest]));
}

function matrixMatches(flat, rows, columns, rowProducts, columnProducts, reveals) {
  const cells = Array.from({ length: rows }, (_, row) => flat.slice(row * columns, (row + 1) * columns));
  return cells.every((row, index) => product(row) === rowProducts[index])
    && Array.from({ length: columns }, (_, column) => product(cells.map((row) => row[column]))).every((value, index) => value === columnProducts[index])
    && reveals.every(({ row, column, value }) => cells[row][column] === value);
}

function pascalRow(rowNumber) {
  let row = [1];
  for (let index = 1; index < rowNumber; index += 1) {
    const next = [1];
    for (let column = 0; column < row.length - 1; column += 1) next.push(row[column] + row[column + 1]);
    next.push(1);
    row = next;
  }
  return row;
}

function validateSurface(problem, id, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  assert(problem.prompt?.trim(), id, difficulty, "prompt missing");
  assert(String(problem.answer ?? "").trim(), id, difficulty, "answer missing");
  assert(problem.solution?.trim(), id, difficulty, "solution missing");
  assert(!/undefined|NaN|\[object Object\]/.test(text), id, difficulty, "invalid text token");
  assert(!/퍼뮤테이션|컴비네이션|팩토리얼|\^/.test(text), id, difficulty, "child-facing forbidden term");
  assert(!/몇 가지인가요\?\s*몇 가지인가요/.test(text), id, difficulty, "duplicated sentence");
  if (problem.visual?.kind === "book5") assert(book05Markup(problem.visual), id, difficulty, "blank book5 visual markup");
}

function validate(type, problem, difficulty) {
  const id = type.id;
  const meta = problem.meta || {};
  const numeric = firstNumber(problem.answer);
  validateSurface(problem, id, difficulty);

  switch (meta.family) {
    case "path-number-grid":
    case "diagonal-number-grid": {
      assert(meta.path.length === meta.rows * meta.columns, id, difficulty, "path misses a cell");
      assert(new Set(meta.path.map(([row, column]) => `${row}:${column}`)).size === meta.path.length, id, difficulty, "path repeats a cell");
      meta.path.forEach(([row, column], index) => assert(meta.values[row][column] === meta.start + index, id, difficulty, "path value mismatch"));
      assert(meta.answer === meta.start + meta.targetIndex && numeric === meta.answer, id, difficulty, "path target mismatch");
      return;
    }
    case "line-cycle":
      meta.rows.forEach((row, line) => row.forEach((value, index) => assert(value === meta.start + line + index * meta.lineCount, id, difficulty, "line cycle mismatch")));
      assert(meta.answer === meta.start + meta.targetLine + (meta.targetPosition - 1) * meta.lineCount && numeric === meta.answer, id, difficulty, "line target mismatch");
      return;
    case "finger-bounce":
      assert(meta.answer === meta.cycle[(meta.position - 1) % meta.cycle.length] && problem.answer === meta.answer, id, difficulty, "finger cycle mismatch");
      return;
    case "calendar-position": {
      const expected = (meta.firstWeekday + meta.date - 1) % 7;
      assert(expected === meta.weekdayIndex, id, difficulty, "calendar weekday mismatch");
      assert(meta.date >= 1 && meta.date <= meta.days, id, difficulty, "invalid date");
      if (meta.askDate) assert(problem.visual.hiddenDates?.includes(meta.date), id, difficulty, "asked date is visible");
      return;
    }
    case "calendar-cross-month": {
      const serial = meta.sourceDate + meta.offset;
      const targetMonth = serial <= meta.days ? meta.month : meta.month + 1;
      const targetDate = serial <= meta.days ? serial : serial - meta.days;
      assert(targetMonth === meta.targetMonth && targetDate === meta.targetDate, id, difficulty, "cross-month date mismatch");
      assert(meta.weekdayIndex === (meta.firstWeekday + meta.sourceDate - 1 + meta.offset) % 7, id, difficulty, "cross-month weekday mismatch");
      return;
    }
    case "calendar-same-weekday":
      assert(meta.pair[0] + meta.pair[1] === meta.pairSum, id, difficulty, "calendar pair sum mismatch");
      assert(Math.abs(meta.pair[0] - meta.pair[1]) % 7 === 0, id, difficulty, "calendar dates are not same weekday");
      assert(meta.target + meta.shown === meta.pairSum, id, difficulty, "calendar hidden date mismatch");
      assert(problem.visual.hiddenDates?.includes(meta.target), id, difficulty, "calendar target date is visible");
      return;
    case "shortest-rectangle":
      assert(countPaths(meta.rows, meta.columns) === meta.answer && numeric === meta.answer, id, difficulty, "rectangle path mismatch");
      return;
    case "shortest-irregular":
      assert(countPaths(meta.rows, meta.columns, new Set(meta.blocked)) === meta.answer && numeric === meta.answer, id, difficulty, "irregular path mismatch");
      assert(meta.answer > 0, id, difficulty, "no valid path");
      return;
    case "shortest-waypoint": {
      const first = countPaths(meta.waypoint.row + 1, meta.waypoint.column + 1);
      const second = countPaths(meta.rows - meta.waypoint.row, meta.columns - meta.waypoint.column);
      assert(first === meta.first && second === meta.second && first * second === meta.answer && numeric === meta.answer, id, difficulty, "waypoint path mismatch");
      return;
    }
    case "digit-enumeration": {
      const numbers = enumerateNumbers(meta.digits, meta.length);
      assert(JSON.stringify(numbers) === JSON.stringify(meta.numbers), id, difficulty, "digit list mismatch");
      assert(numbers.length === meta.answer && numeric === meta.answer, id, difficulty, "digit count mismatch");
      return;
    }
    case "digit-ranked": {
      const numbers = enumerateNumbers(meta.digits, meta.length);
      assert(JSON.stringify(numbers) === JSON.stringify(meta.numbers), id, difficulty, "ranked digit list mismatch");
      assert(numbers[meta.rank - 1] === meta.answer && numeric === meta.answer, id, difficulty, "ranked digit answer mismatch");
      return;
    }
    case "digit-sum-rank":
    case "digit-difference-rank": {
      const ascending = [];
      for (let number = 10; number <= 99; number += 1) {
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        const valid = meta.family === "digit-sum-rank" ? tens + ones === meta.condition : Math.abs(tens - ones) === meta.condition;
        if (valid) ascending.push(number);
      }
      const ordered = meta.descending ? ascending.reverse() : ascending;
      assert(JSON.stringify(ordered) === JSON.stringify(meta.numbers), id, difficulty, "digit condition list mismatch");
      assert(ordered[meta.rank - 1] === meta.answer && numeric === meta.answer, id, difficulty, "digit condition rank mismatch");
      return;
    }
    case "multiplication-table":
      meta.values.forEach((row, rowIndex) => row.forEach((value, columnIndex) => assert(value === meta.rowHeaders[rowIndex] * meta.columnHeaders[columnIndex], id, difficulty, "times table mismatch")));
      assert(meta.values[meta.target.row][meta.target.column] === meta.answer && numeric === meta.answer, id, difficulty, "times table target mismatch");
      return;
    case "product-cycle":
      meta.edges.forEach((edge, index) => assert(edge === meta.vertices[index] * meta.vertices[(index + 1) % meta.sides], id, difficulty, "cycle product mismatch"));
      assert(meta.vertices[meta.targetIndex] === meta.answer && numeric === meta.answer, id, difficulty, "cycle target mismatch");
      return;
    case "matrix-products":
      assert(meta.cells.every((row, index) => product(row) === meta.rowProducts[index]), id, difficulty, "matrix row product mismatch");
      assert(Array.from({ length: meta.columns }, (_, column) => product(meta.cells.map((row) => row[column]))).every((value, index) => value === meta.columnProducts[index]), id, difficulty, "matrix column product mismatch");
      assert(meta.cells[meta.target.row][meta.target.column] === meta.answer && numeric === meta.answer, id, difficulty, "matrix target mismatch");
      return;
    case "matrix-placement": {
      const matches = permutations(meta.cardPool).filter((candidate) => matrixMatches(candidate, meta.rows, meta.columns, meta.rowProducts, meta.columnProducts, meta.reveals));
      assert(matches.length === 1, id, difficulty, `matrix placement has ${matches.length} solutions`);
      assert(matches[0][meta.target.row * meta.columns + meta.target.column] === meta.answer && numeric === meta.answer, id, difficulty, "matrix placement target mismatch");
      return;
    }
    case "symbol-product-pair": {
      const candidates = [];
      for (let larger = 1; larger <= 9; larger += 1) for (let smaller = 1; smaller < larger; smaller += 1) {
        if (larger * smaller === meta.targetProduct && larger + smaller === meta.targetSum) candidates.push([larger, smaller]);
      }
      assert(candidates.length === 1 && candidates[0][0] === meta.answer && numeric === meta.answer, id, difficulty, "symbol pair is not unique");
      return;
    }
    case "symbol-product-chain":
      meta.values.slice(0, -1).forEach((value, index) => assert(value * meta.values[index + 1] === Number(meta.equations[index + 1].match(/= (\d+)/)?.[1]), id, difficulty, "symbol chain mismatch"));
      assert(meta.values.at(-1) === meta.answer && numeric === meta.answer, id, difficulty, "symbol chain answer mismatch");
      return;
    case "symbol-mixed-grid":
      assert(meta.solutions.length === 1, id, difficulty, "symbol mixed answer not unique");
      assert(meta.equations.every(({ left, operator, right, result }) => (operator === "×" ? meta.values[left] * meta.values[right] : operator === "+" ? meta.values[left] + meta.values[right] : meta.values[left] - meta.values[right]) === result), id, difficulty, "symbol equation mismatch");
      assert(sum(meta.values) === meta.answer && numeric === meta.answer, id, difficulty, "symbol sum mismatch");
      return;
    case "pair-count": {
      let pairs = 0;
      for (let first = 0; first < meta.count; first += 1) for (let second = first + 1; second < meta.count; second += 1) pairs += 1;
      assert(pairs === meta.answer && numeric === meta.answer, id, difficulty, "pair count mismatch");
      return;
    }
    case "inverse-pair-count":
      assert(triangular(meta.count - 1) === meta.pairCount && numeric === meta.answer && meta.answer === meta.count, id, difficulty, "inverse pair mismatch");
      return;
    case "odd-square":
      assert(meta.odds.every((value, index) => value === index * 2 + 1), id, difficulty, "odd sequence mismatch");
      assert(sum(meta.odds) === meta.answer && numeric === meta.answer, id, difficulty, "odd sum mismatch");
      return;
    case "pascal-row": {
      const row = pascalRow(meta.rowNumber);
      assert(JSON.stringify(row) === JSON.stringify(meta.row), id, difficulty, "Pascal row mismatch");
      assert(sum(row) === meta.answer && numeric === meta.answer, id, difficulty, "Pascal sum mismatch");
      return;
    }
    case "triangle-count": {
      if (meta.mode === "fan") {
        assert(triangular(meta.order) === meta.answer && numeric === meta.answer, id, difficulty, "fan triangle mismatch");
        return;
      }
      let upward = 0;
      for (let side = 1; side <= meta.order; side += 1) upward += triangular(meta.order - side + 1);
      let downward = 0;
      for (let side = 1; side <= Math.floor(meta.order / 2); side += 1) downward += triangular(meta.order - side * 2 + 1);
      assert(upward === meta.upward && downward === meta.downward && upward + downward === meta.answer && numeric === meta.answer, id, difficulty, "grid triangle mismatch");
      return;
    }
    case "square-grid-count": {
      const bySize = Array.from({ length: meta.order }, (_, index) => ({ side: index + 1, count: (meta.order - index) ** 2 }));
      assert(JSON.stringify(bySize) === JSON.stringify(meta.bySize), id, difficulty, "square size count mismatch");
      assert(sum(bySize.map((item) => item.count)) === meta.answer && numeric === meta.answer, id, difficulty, "square total mismatch");
      return;
    }
    case "triangle-row-boundary":
      assert(meta.first === triangular(meta.row - 1) + 1 && meta.last === triangular(meta.row), id, difficulty, "triangle row boundary mismatch");
      assert(meta.answer === (meta.askFirst ? meta.first : meta.last) && numeric === meta.answer, id, difficulty, "triangle row answer mismatch");
      return;
    case "square-row-boundary":
      assert(meta.first === (meta.row - 1) ** 2 + 1 && meta.last === meta.row ** 2, id, difficulty, "square row boundary mismatch");
      assert(meta.answer === (meta.askFirst ? meta.first : meta.last) && numeric === meta.answer, id, difficulty, "square row answer mismatch");
      return;
    default:
      // 2권에서 수학과 그림을 이미 독립 검산한 재사용 생성기다.
      assert(meta || type.generator, id, difficulty, "reused generator has no audit identity");
  }
}

if (!book) throw new Error("book-05 missing");
if (units.length !== 4) throw new Error(`book-05 unit count ${units.length}`);
if (typeIds.length !== 38) throw new Error(`book-05 type count ${typeIds.length}`);

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
  if (type.worksheetCode) {
    assert(type.bankApproved && type.worksheetOptions?.kind, typeId, 0, "worksheet route is not pinned to a verified family");
    worksheetOnly += 1;
    continue;
  }
  const generator = GENERATORS[type.generator];
  assert(generator, typeId, 0, `missing generator ${type.generator}`);
  for (const difficulty of [1, 2, 3]) {
    const fingerprints = new Set();
    for (let run = 0; run < iterations; run += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 150 && !problem; attempt += 1) problem = generator({ difficulty });
      assert(problem, typeId, difficulty, "generator returned null");
      validate(type, problem, difficulty);
      fingerprints.add(JSON.stringify(problem.meta || { prompt: problem.prompt, answer: problem.answer, visual: problem.visual }));
      generated += 1;
    }
    assert(fingerprints.size >= 3, typeId, difficulty, `only ${fingerprints.size} variants`);
    variants.set(`${typeId}/L${difficulty}`, fingerprints.size);
  }
}

assert(sourceQuestionCount === 154, "book-05", 0, `source count ${sourceQuestionCount}`);
const minVariants = Math.min(...variants.values());
console.log(`BOOK05_AUDIT_OK types=${typeIds.length} sourceQuestions=${sourceQuestionCount} generated=${generated} worksheetOnly=${worksheetOnly} minVariants=${minVariants}`);
