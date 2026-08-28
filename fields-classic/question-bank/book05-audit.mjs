import "../../geometry/worksheet/generators.js";
import "../../geometry/worksheet/render.js";
import { GENERATORS } from "./generators.js";
import { book05Markup } from "./book05-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "300", 10);
const book = CURRICULUM.find((item) => item.id === "book-05");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const unitTestQuestions = book?.source?.unitTestQuestions || [];
const unitTestTypeIds = [...new Set(unitTestQuestions.map((question) => question.typeId))];
const auditedTypeIds = [...new Set([...typeIds, ...unitTestTypeIds])];
const stages = TEXTBOOK_STAGES.map((stage) => stage.id);
const expectedUnitCounts = [34, 47, 36, 37];
const expectedUnitTestTypes = [
  "row-major-grid-two-target-sum-book5", "radial-line-cycle-two-part-book5", "calendar-weekday-list-ordinal-book5",
  "calendar-special-date-offset-book5", "calendar-weekday-sum-year-boundary-book5", "shortest-path-rectangle",
  "shortest-path-via-waypoint", "shortest-path-diagonal-shortcut-book5", "digit-card-ranked-number",
  "two-digit-digit-sum-rank", "square-product-cycle-fill-book5", "checkerboard-product-matrix-book5",
  "symbol-zero-one-network-book5", "symbol-cross-network-book5", "symbol-square-product-network-book5",
  "pair-selection-count", "inverse-pair-count", "pair-selection-count", "square-paper-growth-book5",
  "square-row-two-boundaries-book5", "calendar-ordinal-sum-infer-weekday-book5", "checkerboard-product-matrix-book5",
  "regular-triangle-grid-count-book5", "two-digit-digit-difference-rank", "square-border-stone-growth-book5"
];

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

function countUpRightWithShortcut(rows, columns, shortcut) {
  const ways = Array.from({ length: rows }, () => Array(columns).fill(0));
  ways[0][0] = 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (row || column) ways[row][column] += (row ? ways[row - 1][column] : 0) + (column ? ways[row][column - 1] : 0);
      if (row === shortcut.row && column === shortcut.column) ways[row + 1][column + 1] += ways[row][column];
    }
  }
  return ways[rows - 1][columns - 1];
}

function squareCycleSolutionCount(edges) {
  let count = 0;
  for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) for (let c = 1; c <= 9; c += 1) for (let d = 1; d <= 9; d += 1) {
    if (new Set([a, b, c, d]).size !== 4) continue;
    if (a * b === edges[0] && b * c === edges[1] && c * d === edges[2] && d * a === edges[3]) count += 1;
  }
  return count;
}

const checkerSolutionCache = new Map();
function checkerSolutionCount(meta) {
  const key = JSON.stringify([meta.active, meta.rowProducts, meta.columnProducts]);
  if (checkerSolutionCache.has(key)) return checkerSolutionCache.get(key);
  const cells = Array.from({ length: 4 }, () => Array(4).fill(null));
  let count = 0;
  function visit(index, remaining) {
    if (count > 1) return;
    if (index === meta.active.length) {
      count += 1;
      return;
    }
    const [row, column] = meta.active[index];
    for (const value of remaining) {
      cells[row][column] = value;
      const rowPositions = meta.active.filter(([activeRow]) => activeRow === row);
      const columnPositions = meta.active.filter(([, activeColumn]) => activeColumn === column);
      const rowReady = rowPositions.every(([activeRow, activeColumn]) => cells[activeRow][activeColumn] != null);
      const columnReady = columnPositions.every(([activeRow, activeColumn]) => cells[activeRow][activeColumn] != null);
      if ((!rowReady || product(rowPositions.map(([activeRow, activeColumn]) => cells[activeRow][activeColumn])) === meta.rowProducts[row])
        && (!columnReady || product(columnPositions.map(([activeRow, activeColumn]) => cells[activeRow][activeColumn])) === meta.columnProducts[column])) {
        visit(index + 1, remaining.filter((candidate) => candidate !== value));
      }
      cells[row][column] = null;
    }
  }
  visit(0, meta.cardPool);
  checkerSolutionCache.set(key, count);
  return count;
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
  if (problem.answerVisual?.kind === "book5") assert(book05Markup(problem.answerVisual), id, difficulty, "blank book5 answer visual markup");
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
    case "row-major-two-target-sum-book5": {
      const flat = meta.values.flat();
      flat.forEach((value, index) => assert(value === meta.start + index, id, difficulty, "row-major sequence mismatch"));
      assert(meta.values.length === meta.rows && meta.values.every((row) => row.length === meta.columns), id, difficulty, "row-major dimensions mismatch");
      assert(meta.targetIndexes.length === 2 && new Set(meta.targetIndexes).size === 2, id, difficulty, "row-major targets repeat");
      assert(sum(meta.targetIndexes.map((index) => flat[index])) === meta.answer && numeric === meta.answer, id, difficulty, "row-major target sum mismatch");
      return;
    }
    case "radial-line-cycle-two-part-book5": {
      const first = meta.start + meta.firstTarget.line + (meta.firstTarget.position - 1) * meta.lineCount;
      const second = meta.start + meta.secondTarget.line + (meta.secondTarget.position - 1) * meta.lineCount;
      assert(first === meta.firstAnswer, id, difficulty, "radial first answer mismatch");
      assert(second === meta.secondNumber, id, difficulty, "radial reverse address mismatch");
      assert(meta.firstTarget.position >= 1 && meta.secondTarget.position >= 1, id, difficulty, "radial position invalid");
      return;
    }
    case "calendar-weekday-list-ordinal-book5": {
      const dates = [];
      for (let date = 1; date <= meta.days; date += 1) if ((meta.firstWeekday + date - 1) % 7 === meta.listWeekday) dates.push(date);
      assert(JSON.stringify(dates) === JSON.stringify(meta.listDates), id, difficulty, "calendar weekday list mismatch");
      assert((meta.firstWeekday + meta.ordinalDate - 1) % 7 === meta.ordinalWeekday, id, difficulty, "calendar ordinal weekday mismatch");
      const prior = Array.from({ length: meta.ordinalDate }, (_, index) => index + 1).filter((date) => (meta.firstWeekday + date - 1) % 7 === meta.ordinalWeekday);
      assert(prior.length === meta.ordinal, id, difficulty, "calendar ordinal count mismatch");
      return;
    }
    case "calendar-special-date-offset-book5": {
      assert(meta.targetMonth === meta.month + 1, id, difficulty, "special date must cross one month");
      assert(meta.offset === meta.days - meta.sourceDate + meta.targetDate, id, difficulty, "special date offset mismatch");
      assert(meta.targetWeekday === (meta.sourceWeekday + meta.offset) % 7, id, difficulty, "special date weekday mismatch");
      return;
    }
    case "calendar-weekday-sum-year-boundary-book5":
      assert(meta.pair[1] - meta.pair[0] === 7 && sum(meta.pair) === meta.pairSum, id, difficulty, "year-boundary pair mismatch");
      assert(meta.januaryFirstWeekday === (meta.firstWeekday + 31) % 7, id, difficulty, "January first weekday mismatch");
      assert(problem.visual.hiddenDates?.length === 2, id, difficulty, "source weekday dates are visible");
      return;
    case "shortest-diagonal-shortcut-book5":
      assert(countUpRightWithShortcut(meta.rows, meta.columns, meta.shortcut) === meta.answer && numeric === meta.answer, id, difficulty, "diagonal shortest-path mismatch");
      assert(meta.shortcut.row < meta.rows - 1 && meta.shortcut.column < meta.columns - 1, id, difficulty, "shortcut outside grid");
      return;
    case "square-product-cycle-fill-book5":
      assert(meta.vertices.length === 4 && new Set(meta.vertices).size === 4, id, difficulty, "square cycle values repeat");
      meta.edges.forEach((edge, index) => assert(edge === meta.vertices[index] * meta.vertices[(index + 1) % 4], id, difficulty, "square cycle edge mismatch"));
      assert(squareCycleSolutionCount(meta.edges) === 1, id, difficulty, "square cycle is not unique");
      assert(problem.responseKind === "visual-fill" && problem.answerVisual, id, difficulty, "square cycle completed answer missing");
      return;
    case "checkerboard-product-matrix-book5": {
      assert(meta.active.length === 8 && new Set(meta.active.map(([row, column]) => `${row}:${column}`)).size === 8, id, difficulty, "checker active cells invalid");
      assert(JSON.stringify([...meta.cells.flat().filter((value) => value != null)].sort((a, b) => a - b)) === JSON.stringify(meta.cardPool), id, difficulty, "checker cards mismatch");
      assert(meta.cells.every((row, index) => product(row.filter((value) => value != null)) === meta.rowProducts[index]), id, difficulty, "checker row products mismatch");
      assert(Array.from({ length: 4 }, (_, column) => product(meta.cells.map((row) => row[column]).filter((value) => value != null))).every((value, index) => value === meta.columnProducts[index]), id, difficulty, "checker column products mismatch");
      assert(checkerSolutionCount(meta) === 1, id, difficulty, "checkerboard placement is not unique");
      assert(problem.responseKind === "visual-fill" && problem.answerVisual, id, difficulty, "checker completed answer missing");
      return;
    }
    case "symbol-zero-one-network-book5":
      assert(JSON.stringify([...Object.values(meta.values)].sort((a, b) => a - b)) === JSON.stringify([0, 1, 2, 3, 4]), id, difficulty, "zero-one card pool mismatch");
      assert(meta.values.diamond * meta.values.diamond === meta.values.plus, id, difficulty, "zero-one square relation mismatch");
      assert(meta.values.diamond * meta.values.square === meta.values.diamond && meta.values.plus + meta.values.circle === meta.values.plus, id, difficulty, "zero-one identity relation mismatch");
      assert(meta.values.square + meta.values.diamond === meta.values.pentagon && numeric === meta.values.pentagon, id, difficulty, "zero-one target mismatch");
      return;
    case "symbol-cross-network-book5":
      assert(JSON.stringify([...Object.values(meta.values)].sort((a, b) => a - b)) === JSON.stringify([1, 2, 3, 4, 5, 9]), id, difficulty, "cross card pool mismatch");
      assert(meta.values.circle ** 2 === meta.values.square && meta.values.circle + meta.values.diamond === meta.values.triangle, id, difficulty, "cross first relations mismatch");
      assert(meta.values.square + meta.values.pentagon === meta.values.plus && meta.values.triangle ** 2 === meta.values.plus && numeric === meta.values.pentagon, id, difficulty, "cross target mismatch");
      return;
    case "symbol-square-product-network-book5":
      assert(JSON.stringify([...Object.values(meta.values)].sort((a, b) => a - b)) === JSON.stringify([2, 3, 4, 6, 8, 9]), id, difficulty, "square-product card pool mismatch");
      assert(meta.values.diamond ** 2 === meta.values.square, id, difficulty, "diamond-square mismatch");
      assert(meta.values.square ** 2 === meta.values.diamond * meta.values.circle, id, difficulty, "linked product mismatch");
      assert(meta.values.pentagon ** 2 === meta.values.triangle && meta.values.plus ** 2 === meta.values.square * meta.values.triangle && numeric === meta.values.plus, id, difficulty, "square-product target mismatch");
      return;
    case "square-paper-growth-book5":
      assert(meta.answer === meta.target * meta.target && numeric === meta.answer, id, difficulty, "square paper growth mismatch");
      return;
    case "square-row-two-boundaries-book5":
      assert(meta.firstAnswer === meta.firstRow ** 2, id, difficulty, "first row last mismatch");
      assert(meta.secondAnswer === (meta.secondRow - 1) ** 2 + 1, id, difficulty, "second row first mismatch");
      return;
    case "calendar-ordinal-sum-infer-weekday-book5":
      assert(meta.secondDate === meta.firstOccurrence + 7 && meta.fourthDate === meta.firstOccurrence + 21, id, difficulty, "ordinal dates mismatch");
      assert(meta.secondDate + meta.fourthDate === meta.dateSum, id, difficulty, "ordinal date sum mismatch");
      assert(meta.firstWeekday === (meta.weekdayIndex - (meta.firstOccurrence - 1) + 7) % 7, id, difficulty, "inferred first weekday mismatch");
      return;
    case "regular-triangle-grid-count-book5": {
      let upward = 0;
      for (let side = 1; side <= meta.order; side += 1) upward += triangular(meta.order - side + 1);
      let downward = 0;
      for (let side = 1; side <= Math.floor(meta.order / 2); side += 1) downward += triangular(meta.order - side * 2 + 1);
      assert(upward === meta.upward && downward === meta.downward && upward + downward === meta.answer && numeric === meta.answer, id, difficulty, "regular triangle count mismatch");
      return;
    }
    case "square-border-stone-growth-book5":
      assert(meta.side === meta.target + 2, id, difficulty, "stone side growth mismatch");
      assert(meta.black === 4 * (meta.side - 1) && meta.white === (meta.side - 2) ** 2, id, difficulty, "stone color count mismatch");
      assert(meta.difference === Math.abs(meta.black - meta.white), id, difficulty, "stone difference mismatch");
      assert(meta.moreColor === (meta.black > meta.white ? "검은색" : meta.black < meta.white ? "흰색" : "같음"), id, difficulty, "stone color winner mismatch");
      return;
    default:
      // 2권에서 수학과 그림을 이미 독립 검산한 재사용 생성기다.
      assert(meta || type.generator, id, difficulty, "reused generator has no audit identity");
  }
}

if (!book) throw new Error("book-05 missing");
if (units.length !== 4) throw new Error(`book-05 unit count ${units.length}`);
if (typeIds.length !== 38) throw new Error(`book-05 type count ${typeIds.length}`);
if (unitTestQuestions.length !== 25) throw new Error(`book-05 unit test count ${unitTestQuestions.length}`);
unitTestQuestions.forEach((question, index) => {
  if (question.number !== index + 1) throw new Error(`book-05 unit test number ${question.number}, expected ${index + 1}`);
  if (question.typeId !== expectedUnitTestTypes[index]) throw new Error(`book-05 unit test ${question.number} type ${question.typeId}, expected ${expectedUnitTestTypes[index]}`);
  if (!question.verified) throw new Error(`book-05 unit test ${question.number} is not verified`);
  if (!typeById(question.typeId)) throw new Error(`book-05 unit test ${question.number} unknown type ${question.typeId}`);
});

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
for (const typeId of auditedTypeIds) {
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
console.log(`BOOK05_AUDIT_OK bodyTypes=${typeIds.length} unitTestQuestions=${unitTestQuestions.length} auditedTypes=${auditedTypeIds.length} sourceQuestions=${sourceQuestionCount} generated=${generated} worksheetOnly=${worksheetOnly} minVariants=${minVariants}`);
