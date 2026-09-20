import { GENERATORS } from "./generators.js";
import { book01Markup } from "./book01-renderers.js";
import { book02Markup } from "./book02-renderers.js";
import { CURRICULUM, typeById } from "./source-data.js";
import {
  BOOK01_02_UNIT_TEST_LINKS,
  BOOK01_UNIT_TEST_LINKS,
  BOOK02_UNIT_TEST_LINKS,
  LEARNER_STAGE
} from "./book01-02-unit-test-links.js";

const failures = [];
const variants = Number.parseInt(process.argv[2] || "3", 10);

const fail = (message) => failures.push(message);
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const curriculumTypeIds = (bookId) => {
  const book = CURRICULUM.find((entry) => entry.id === bookId);
  return new Set(book?.units.flatMap((unit) => unit.typeIds) || []);
};

const auditLinks = (bookId, links) => {
  assert(links.length === 25, `${bookId}: expected exactly 25 links, got ${links.length}`);
  assert(links.every((entry, index) => entry.number === index + 1), `${bookId}: question numbers must be 1..25`);
  assert(new Set(links.map((entry) => entry.number)).size === 25, `${bookId}: duplicate question number`);

  const typeIds = curriculumTypeIds(bookId);
  const sourcePrefix = `book${bookId.slice(-2)}`;
  for (const entry of links) {
    const prefix = `${bookId} q${String(entry.number).padStart(2, "0")}`;
    assert(typeof entry.label === "string" && entry.label.trim(), `${prefix}: label missing`);
    assert(entry.sourceLocator === `${sourcePrefix}-unit-test:q${String(entry.number).padStart(2, "0")}`, `${prefix}: unstable source locator`);
    assert(typeof entry.sourceVisualSignature === "string" && entry.sourceVisualSignature.trim(), `${prefix}: visual signature missing`);
    assert(entry.sourceContract && typeof entry.sourceContract === "object", `${prefix}: source contract missing`);
    assert(entry.sourceContract.responseKind && entry.sourceContract.answerShape && entry.sourceContract.visualShape, `${prefix}: incomplete source contract`);
    assert(entry.difficulty >= 1 && entry.difficulty <= 3, `${prefix}: difficulty outside 1..3`);
    assert(["classified", "exact-generator"].includes(entry.sourceFidelity), `${prefix}: unsupported source fidelity ${entry.sourceFidelity}`);
    assert(entry.generationCaseMode === (entry.sourceFidelity === "exact-generator" ? "source" : "variant-from-source"), `${prefix}: generationCase mode mismatch`);
    if (entry.verified) {
      const type = typeById(entry.typeId);
      assert(typeof entry.typeId === "string" && type && type.generator && GENERATORS[type.generator], `${prefix}: verified link has no active generator`);
      if (!typeIds.has(entry.typeId)) assert(entry.sourceFidelity === "exact-generator", `${prefix}: a type outside the main book must use a source-exact unit-test generator`);
      assert(entry.generatorContract && typeof entry.generatorContract === "object", `${prefix}: verified generator contract missing`);
      assert(entry.sourceContract.responseKind === entry.generatorContract.responseKind, `${prefix}: response kind mismatch`);
      assert(entry.sourceContract.answerShape === entry.generatorContract.answerShape, `${prefix}: answer shape mismatch`);
      assert(entry.sourceContract.visualShape === entry.generatorContract.visualShape, `${prefix}: visual shape mismatch`);
      assert(entry.sourceContract.conditionSignature === entry.generatorContract.conditionSignature, `${prefix}: condition contract mismatch`);
      assert(!entry.reason, `${prefix}: verified link must not have a hold reason`);
    } else {
      assert(entry.typeId === null || Boolean(typeById(entry.typeId)), `${prefix}: held candidate typeId is unknown`);
      if (entry.typeId) assert(entry.generatorContract && typeof entry.generatorContract === "object", `${prefix}: held candidate generator contract missing`);
      assert(typeof entry.reason === "string" && entry.reason.trim(), `${prefix}: blocked link needs an explicit reason`);
    }
  }
};

const render = (bookId, problem) => {
  if (!problem.visual) return "";
  if (bookId === "book-01" && problem.visual.kind === "book1") return book01Markup(problem.visual);
  if (bookId === "book-02") return book02Markup(problem.visual);
  return "";
};

const permutationsOf = (values) => {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => permutationsOf(values.filter((_, itemIndex) => itemIndex !== index)).map((tail) => [value, ...tail]));
};

function sudokuCompletionCount(meta) {
  const { size, cells } = meta;
  const board = [...cells];
  const digits = Array.from({ length: size }, (_, index) => index + 1);
  const regionOf = (index) => meta.regionMap
    ? meta.regionMap[index]
    : Math.floor(Math.floor(index / size) / meta.regionRows) * (size / meta.regionColumns) + Math.floor((index % size) / meta.regionColumns);
  const valid = (index, value) => {
    const row = Math.floor(index / size);
    const column = index % size;
    for (let cursor = 0; cursor < size; cursor += 1) {
      if (board[row * size + cursor] === value || board[cursor * size + column] === value) return false;
    }
    const region = regionOf(index);
    return !board.some((item, itemIndex) => item === value && regionOf(itemIndex) === region);
  };
  const visit = () => {
    const index = board.indexOf(null);
    if (index < 0) return 1;
    let count = 0;
    for (const value of digits) {
      if (!valid(index, value)) continue;
      board[index] = value;
      count += visit();
      board[index] = null;
      if (count > 1) return count;
    }
    return count;
  };
  return visit();
}

const BOOK01_BORDER_LINES = [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0]];
const BOOK01_TRIANGLE_LINES = [[0, 1, 3], [0, 2, 5], [3, 4, 5]];
const BOOK01_RING_LINES = [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 8], [8, 9, 0]];

const bitIndices = (mask) => Array.from({ length: 16 }, (_, index) => index).filter((index) => (mask & (1 << index)) !== 0);

const canonicalCells = (indices) => {
  const points = indices.map((index) => [Math.floor(index / 4), index % 4]);
  const variants = [];
  for (let mirror = 0; mirror < 2; mirror += 1) {
    for (let turn = 0; turn < 4; turn += 1) {
      const transformed = points.map(([row, column]) => {
        let x = mirror ? -column : column;
        let y = row;
        for (let step = 0; step < turn; step += 1) [x, y] = [-y, x];
        return [x, y];
      });
      const minX = Math.min(...transformed.map(([x]) => x));
      const minY = Math.min(...transformed.map(([, y]) => y));
      variants.push(transformed.map(([x, y]) => `${x - minX},${y - minY}`).sort().join(";"));
    }
  }
  return variants.sort()[0];
};

const connectedCells = (indices) => {
  const cells = new Set(indices);
  const seen = new Set([indices[0]]);
  const queue = [indices[0]];
  while (queue.length) {
    const index = queue.shift();
    const row = Math.floor(index / 4);
    const column = index % 4;
    for (const next of [index - 4, index + 4, index - 1, index + 1]) {
      if (!cells.has(next) || seen.has(next)) continue;
      const nextRow = Math.floor(next / 4);
      const nextColumn = next % 4;
      if (Math.abs(row - nextRow) + Math.abs(column - nextColumn) !== 1) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return seen.size === indices.length;
};

const completionCount = (cards, shown, lines, target, stopAt = 2) => {
  const blanks = shown.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  const remaining = cards.filter((value) => !shown.includes(value));
  let count = 0;
  for (const candidate of permutationsOf(remaining)) {
    const values = [...shown];
    blanks.forEach((index, order) => { values[index] = candidate[order]; });
    if (lines.every((line) => line.reduce((sum, index) => sum + values[index], 0) === target)) count += 1;
    if (count >= stopAt) break;
  }
  return count;
};

const hasEqualPairing = (values, pairCount) => {
  const visit = (remaining, target = null) => {
    if (!remaining.length) return true;
    const first = remaining[0];
    return remaining.slice(1).some((second, offset) => {
      const sum = first + second;
      if (target != null && sum !== target) return false;
      const index = offset + 1;
      return visit(remaining.filter((_, itemIndex) => itemIndex !== 0 && itemIndex !== index), target ?? sum);
    });
  };
  return values.length === pairCount * 2 && visit(values);
};

function independentBook01Check(problem, prefix) {
  const meta = problem.meta;
  const answerNumber = Number.parseInt(problem.answer, 10);
  if (meta.sourceNumber === 1) {
    assert(meta.boards.length === 2, `${prefix}: q1 needs two source boards`);
    meta.boards.forEach((board, boardIndex) => {
      const groups = board.masks.map(bitIndices);
      assert(groups.every((group) => group.length === 4 && connectedCells(group)), `${prefix}: q1 board ${boardIndex + 1} pieces must be connected tetrominoes`);
      assert(new Set(groups.flat()).size === 16, `${prefix}: q1 board ${boardIndex + 1} pieces must cover the board once`);
      assert(new Set(groups.map(canonicalCells)).size === 1, `${prefix}: q1 board ${boardIndex + 1} pieces must be congruent`);
      assert(groups.every((group) => group.map((index) => board.symbols[index]).sort().join("") === "1234"), `${prefix}: q1 board ${boardIndex + 1} symbol balance disagrees`);
      assert(board.uniqueCount === 1, `${prefix}: q1 board ${boardIndex + 1} must have one accepted partition`);
    });
  } else if (meta.sourceNumber === 2) {
    const mirror = { 0: 0, 2: 5, 5: 2, 8: 8 };
    assert(meta.items.length === 2, `${prefix}: q2 needs two direct-write items`);
    meta.items.forEach((item) => {
      const expected = Number(String(item.source).split("").reverse().map((digit) => mirror[digit]).join(""));
      assert(item.result === expected, `${prefix}: q2 mirrored number disagrees`);
    });
  } else if (meta.sourceNumber === 3) {
    const halfTurn = { 0: 0, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 };
    assert(meta.items.length === 2, `${prefix}: q3 needs two additions`);
    meta.items.forEach((item) => {
      const expected = Number(String(item.source).split("").reverse().map((digit) => halfTurn[digit]).join(""));
      assert(item.result === expected && item.sum === item.source + expected, `${prefix}: q3 half-turn addition disagrees`);
    });
  } else if (meta.sourceNumber === 4) {
    const upright = meta.cells.filter((cell) => (cell.orientation + meta.netRotation) % 360 === 0).map((cell) => cell.value);
    assert(upright.join(",") === meta.uprightValues.join(","), `${prefix}: q4 upright set disagrees`);
    assert(answerNumber === upright.reduce((sum, value) => sum + value, 0), `${prefix}: q4 upright sum disagrees`);
  } else if (meta.sourceNumber === 5) {
    const groups = meta.masks.map(bitIndices);
    assert(groups.every((group) => group.length === 4 && connectedCells(group)), `${prefix}: q5 pieces must be connected tetrominoes`);
    assert(new Set(groups.flat()).size === 16 && new Set(groups.map(canonicalCells)).size === 1, `${prefix}: q5 pieces must be congruent and cover the board`);
    assert(groups.every((group) => group.filter((index) => meta.symbols[index]).length === 2), `${prefix}: q5 each piece needs two frogs`);
    assert(meta.uniqueCount === 1, `${prefix}: q5 must have one accepted partition`);
  } else if ([6, 9].includes(meta.sourceNumber)) {
    assert(meta.items.length === (meta.sourceNumber === 6 ? 2 : 1), `${prefix}: diagonal fold item count changed`);
    meta.items.forEach((item) => {
      const mate = (index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        return item.diagonal === "main" ? column * 4 + row : (3 - column) * 4 + (3 - row);
      };
      const selected = [...new Set([item.cutIndex, mate(item.cutIndex)])].sort((a, b) => a - b);
      const expected = selected.reduce((sum, index) => sum + item.numbers[Math.floor(index / 4)][index % 4], 0);
      assert(selected.join(",") === item.selected.join(",") && item.answer === expected, `${prefix}: diagonal overlap sum disagrees`);
    });
  } else if (meta.sourceNumber === 8) {
    assert(meta.folds.join(",") === "horizontal,vertical" && meta.notchCount === 4, `${prefix}: q8 two-fold notch count disagrees`);
    assert(problem.answerVisual?.reveal === true, `${prefix}: q8 unfolded answer drawing missing`);
  } else if (meta.sourceNumber === 10) {
    assert(meta.folds === 2 && meta.triangleCount === 8 && meta.diamondCount === 4, `${prefix}: q10 piece counts disagree`);
  } else if (meta.sourceNumber === 11) {
    assert(meta.folds === 2 && meta.fullPunchCopies === 4 && meta.edgePunchCopies === 2, `${prefix}: q11 punch copies disagree`);
    assert(answerNumber === meta.fullPunchCopies + meta.edgePunchCopies && answerNumber === meta.total, `${prefix}: q11 total hole count disagrees`);
  } else if ([12, 13].includes(meta.sourceNumber)) {
    const expectedCenters = [meta.cards[0], meta.cards[Math.floor(meta.cards.length / 2)], meta.cards.at(-1)];
    assert(meta.centers.join(",") === expectedCenters.join(","), `${prefix}: possible center values disagree`);
    meta.centers.forEach((center, index) => {
      const remaining = meta.cards.filter((value) => value !== center);
      assert(hasEqualPairing(remaining, meta.sourceNumber === 12 ? 2 : 3), `${prefix}: center ${center} cannot make equal pairs`);
      const pairSum = (meta.lineSums[index] - center);
      assert(remaining.reduce((sum, value) => sum + value, 0) === pairSum * (meta.sourceNumber === 12 ? 2 : 3), `${prefix}: line sum for center ${center} disagrees`);
    });
  } else if (meta.sourceNumber === 14) {
    assert(BOOK01_BORDER_LINES.every((line) => line.reduce((sum, index) => sum + meta.solution[index], 0) === meta.lineSum), `${prefix}: q14 line sums disagree`);
    assert(meta.shown.every((value, index) => value == null || value === meta.solution[index]), `${prefix}: q14 clues disagree`);
    assert(completionCount(meta.cards, meta.shown, BOOK01_BORDER_LINES, meta.lineSum) === 1 && meta.uniqueCount === 1, `${prefix}: q14 must have one completion`);
  } else if (meta.sourceNumber === 15) {
    assert(meta.items.length === 2, `${prefix}: q15 needs two triangles`);
    meta.items.forEach((item) => {
      assert(BOOK01_TRIANGLE_LINES.every((line) => line.reduce((sum, index) => sum + item.solution[index], 0) === item.lineSum), `${prefix}: q15 triangle sums disagree`);
      assert(completionCount(item.cards, item.shown, BOOK01_TRIANGLE_LINES, item.lineSum) === 1 && item.uniqueCount === 1, `${prefix}: q15 triangle must have one completion`);
    });
  } else if (meta.sourceNumber === 16) {
    const rows = [[0, 1], [3, 4, 5], [7, 8]];
    const columns = [[0, 3], [1, 4, 7], [5, 8]];
    assert(rows.every((line, index) => line.reduce((sum, cell) => sum + meta.solution[cell], 0) === meta.rowSums[index]), `${prefix}: q16 row sums disagree`);
    assert(columns.every((line, index) => line.reduce((sum, cell) => sum + meta.solution[cell], 0) === meta.columnSums[index]), `${prefix}: q16 column sums disagree`);
    assert(meta.uniqueCount === 1, `${prefix}: q16 must have one completion`);
  } else if (meta.sourceNumber === 17) {
    assert(BOOK01_RING_LINES.every((line) => line.reduce((sum, index) => sum + meta.solution[index], 0) === meta.lineSum), `${prefix}: q17 line sums disagree`);
    assert(completionCount([1,2,3,4,5,6,7,8,9,10], meta.shown, BOOK01_RING_LINES, meta.lineSum) === 1 && meta.uniqueCount === 1, `${prefix}: q17 must have one completion`);
  } else if (meta.sourceNumber === 18) {
    assert(meta.cards.reduce((sum, value) => sum + value, 0) === meta.total, `${prefix}: q18 card total disagrees`);
    assert(meta.solution[2] === meta.center && meta.total - meta.center === meta.outerSum && meta.outerSum === meta.lineSum, `${prefix}: q18 center relation disagrees`);
    assert(answerNumber === meta.center, `${prefix}: q18 answer disagrees`);
  } else if (meta.sourceNumber === 19) {
    const candidates = Array.from({ length: meta.upper - meta.lower - 1 }, (_, index) => meta.lower + index + 1)
      .filter((value) => Math.floor(value / 10) + value % 10 === meta.digitSum && value % 2 === meta.parity);
    assert(candidates.length === 1 && candidates[0] === meta.answer && answerNumber === meta.answer, `${prefix}: q19 must have one matching number`);
  } else if (meta.sourceNumber === 20) {
    const candidates = Array.from({ length: 99 - meta.lower }, (_, index) => meta.lower + index + 1)
      .filter((value) => value % 2 === 0 && Math.floor(value / 10) - value % 10 === meta.gap);
    assert(candidates.length === 1 && candidates[0] === meta.answer && answerNumber === meta.answer, `${prefix}: q20 must have one matching number`);
  } else if (meta.sourceNumber === 21) {
    const candidates = Array.from({ length: 900 }, (_, index) => index + 100).filter((value) => {
      const [hundreds, tens, ones] = String(value).split("").map(Number);
      const sum = hundreds + tens + ones;
      return hundreds - tens === 1 && tens - ones === 1 && sum > 20 && sum % 2 === 1;
    });
    assert(candidates.length === 1 && candidates[0] === 876 && answerNumber === 876, `${prefix}: q21 must resolve to 876`);
  } else if (meta.sourceNumber === 22) {
    const solutions = permutationsOf(meta.items).filter((candidate) => candidate[0] !== meta.items[0] && candidate[1] === meta.items[1]);
    assert(solutions.length === 1 && solutions[0][meta.targetPerson] === meta.answer && problem.answer === meta.answer, `${prefix}: q22 logic must have one answer`);
  } else if (meta.sourceNumber === 24) {
    const solutions = permutationsOf(meta.places).filter((candidate) => candidate[1] === meta.places[2] && candidate[2] !== meta.places[1]);
    assert(solutions.length === 1 && meta.jobs[solutions[0].indexOf(meta.places[meta.targetPlace])] === meta.answer && problem.answer === meta.answer, `${prefix}: q24 logic must have one answer`);
  } else if (meta.sourceNumber === 25) {
    assert(meta.order.length === 4 && new Set(meta.order).size === 4, `${prefix}: q25 height order must contain four people once`);
    assert(meta.order[2] === meta.answer && problem.answer === meta.answer && meta.uniqueCount === 1, `${prefix}: q25 third-tallest answer disagrees`);
  } else {
    fail(`${prefix}: Book 1 independent validator is missing`);
  }
}

function independentCheck(entry, problem, prefix) {
  const meta = problem.meta;
  if (meta?.sourceBook === "book-01") {
    independentBook01Check(problem, prefix);
    return;
  }
  if (meta?.sourceNumber && ![1, 2, 22].includes(meta.sourceNumber)) {
    const answerNumber = Number.parseInt(problem.answer, 10);
    if ([3, 5].includes(meta.sourceNumber)) {
      assert(meta.larger + meta.smaller === meta.total, `${prefix}: two-target total disagrees`);
      assert(meta.larger - meta.smaller === meta.gap, `${prefix}: two-target difference disagrees`);
      assert(problem.answer.includes(String(meta.larger)) && problem.answer.includes(String(meta.smaller)), `${prefix}: both target values must be in the answer`);
    } else if (meta.sourceNumber === 6) {
      const solutions = permutationsOf(meta.cards).filter(([square, circle, diamond, cross]) => square * 2 === diamond && circle * 2 === square + diamond && square + circle === cross);
      assert(solutions.length === 1, `${prefix}: q6 must have one shape assignment`);
      assert(solutions[0][3] === answerNumber && answerNumber === meta.values.cross, `${prefix}: q6 target disagrees`);
    } else if (meta.sourceNumber === 7) {
      const { diamond, circle, square, star } = meta.weights;
      assert(circle === diamond * 2 && square * 2 === diamond + circle * 2 && star === diamond + square, `${prefix}: q7 balance chain disagrees`);
      assert(answerNumber === star, `${prefix}: q7 answer disagrees`);
    } else if (meta.sourceNumber === 8) {
      const solutions = permutationsOf(meta.cards).filter(([diamond, square, triangle, circle]) => diamond * 3 === square * 4 && diamond * 2 === triangle + square && triangle + circle === diamond + square);
      assert(solutions.length === 1, `${prefix}: q8 must have one shape assignment`);
      assert(solutions[0][3] === answerNumber && answerNumber === meta.values.circle, `${prefix}: q8 target disagrees`);
    } else if (meta.sourceNumber === 9) {
      const { diamond, circle, square, star } = meta.weights;
      assert(circle === diamond * 2 && square * 2 === diamond + circle && star * 2 === diamond + square, `${prefix}: q9 balance chain disagrees`);
      assert(answerNumber === star, `${prefix}: q9 answer disagrees`);
    } else if (meta.sourceNumber === 10) {
      assert(meta.patterns.length === 2 && meta.answers.length === 2, `${prefix}: q10 needs two subproblems`);
      meta.patterns.forEach((pattern, index) => {
        const shown = meta.shown[index];
        assert(shown.length >= pattern.length * 2 + 1, `${prefix}: q10 must show at least two full repeats and one extra item`);
        assert(shown.every((value, position) => value === pattern[position % pattern.length]), `${prefix}: q10 shown pattern ${index + 1} disagrees`);
        assert(meta.answers[index] === pattern[shown.length % pattern.length], `${prefix}: q10 next shape ${index + 1} disagrees`);
      });
      assert(problem.parts?.length === 2 && problem.answerVisuals?.length === 2, `${prefix}: q10 multipart drawing contract missing`);
    } else if (meta.sourceNumber === 11) {
      const targetShape = meta.shapeCycle[(meta.targetIndex - 1) % meta.shapeCycle.length];
      const filled = meta.filledPositions.includes(meta.targetIndex);
      assert(meta.answerToken === `${filled ? "filled-" : ""}${targetShape}`, `${prefix}: q11 shape/fill cycles disagree`);
      assert(problem.answerVisual, `${prefix}: q11 drawing answer visual missing`);
    } else if (meta.sourceNumber === 12) {
      assert(meta.rows.length === 2 && problem.parts?.length === 2, `${prefix}: q12 needs two independent sequences`);
      meta.rows.forEach((row, index) => {
        const values = [...row.values];
        values[row.blankIndex] = row.answer;
        if (index === 0) {
          assert(values.every((value, position) => position < 3 || value === values[position - 3] + 4), `${prefix}: q12 first grouped sequence disagrees`);
        } else {
          assert(values.every((value, position) => position < 3 || value === values[position - 3] + 1), `${prefix}: q12 second grouped sequence disagrees`);
        }
      });
    } else if (meta.sourceNumber === 13) {
      assert(meta.answer === meta.first + meta.increase * (meta.target - 1), `${prefix}: q13 shared-side growth disagrees`);
      assert(answerNumber === meta.answer && meta.target === 7, `${prefix}: q13 source target changed`);
    } else if (meta.sourceNumber === 14) {
      assert(meta.white - meta.dark === meta.answer && meta.answer === meta.target, `${prefix}: q14 triangle color difference disagrees`);
      assert(answerNumber === meta.answer && meta.target === 8, `${prefix}: q14 source target changed`);
    } else if (meta.sourceNumber === 15) {
      assert(2 ** meta.folds === meta.pieces, `${prefix}: q15 reverse fold count disagrees`);
      assert(answerNumber === meta.folds, `${prefix}: q15 answer must be the fold count`);
    } else if (meta.sourceNumber === 16) {
      assert(meta.rows.every(([left, center, right]) => left + right === center), `${prefix}: q16 row sums disagree`);
      assert(answerNumber === meta.answer && meta.answer === meta.rows[3][1] % 10, `${prefix}: q16 target digit disagrees`);
    } else if (meta.sourceNumber === 17) {
      assert(meta.rows.every(([first, second, third, fourth]) => first - second + third === fourth), `${prefix}: q17 row rule disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q17 answer disagrees`);
    } else if (meta.sourceNumber === 18) {
      assert(meta.items.every(({ top, left, center, right }) => top + left + center === right), `${prefix}: q18 triangle relation disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q18 answer disagrees`);
    } else if ([19, 20].includes(meta.sourceNumber)) {
      const digits = Array.from({ length: meta.size }, (_, index) => index + 1).join(",");
      const rows = Array.from({ length: meta.size }, (_, row) => meta.solution.slice(row * meta.size, row * meta.size + meta.size));
      const columns = Array.from({ length: meta.size }, (_, column) => rows.map((row) => row[column]));
      assert([...rows, ...columns].every((line) => [...line].sort((a, b) => a - b).join(",") === digits), `${prefix}: sudoku row or column invalid`);
      const regionOf = (index) => meta.regionMap
        ? meta.regionMap[index]
        : Math.floor(Math.floor(index / meta.size) / meta.regionRows) * (meta.size / meta.regionColumns) + Math.floor((index % meta.size) / meta.regionColumns);
      const regions = Array.from({ length: meta.size }, (_, region) => meta.solution.filter((_, index) => regionOf(index) === region));
      assert(regions.every((region) => [...region].sort((a, b) => a - b).join(",") === digits), `${prefix}: sudoku region invalid`);
      assert(meta.cells.every((value, index) => value == null || value === meta.solution[index]), `${prefix}: sudoku clue disagrees with answer`);
      assert(sudokuCompletionCount(meta) === 1, `${prefix}: sudoku must have one completion`);
      assert(problem.answerVisual?.cells?.every((value, index) => value === meta.solution[index]), `${prefix}: full sudoku answer visual missing`);
    } else if (meta.sourceNumber === 21) {
      assert(meta.items.every(({ top, left, right, bottom, center }) => top + center === left + right + bottom), `${prefix}: q21 diamond relation disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q21 answer disagrees`);
    } else if (meta.sourceNumber === 23) {
      let count = 0;
      let target = null;
      for (let square = 1; square <= 9; square += 1) for (let diamond = 1; diamond <= 9; diamond += 1) for (let triangle = 1; triangle <= 9; triangle += 1) for (let circle = 1; circle <= 9; circle += 1) {
        if (new Set([square, diamond, triangle, circle]).size !== 4) continue;
        if (diamond * 3 !== square * 4 || triangle * 3 !== square * 5 || diamond + triangle !== square + circle) continue;
        count += 1;
        target = circle;
      }
      assert(count === 1 && target === answerNumber && answerNumber === meta.values.circle, `${prefix}: q23 must have one assignment`);
    } else if (meta.sourceNumber === 25) {
      assert(meta.previous.white <= meta.previous.black, `${prefix}: q25 previous stage already qualifies`);
      assert(meta.current.white > meta.current.black && meta.current.stage === meta.previous.stage + 1, `${prefix}: q25 first qualifying stage disagrees`);
      assert(answerNumber === meta.target, `${prefix}: q25 answer disagrees`);
    }
    return;
  }
  if (entry.typeId === "fold-number-cut-sum-textbook") {
    const folded = (index, direction) => ["down", "right"].includes(direction)
      ? Math.max(index, 3 - index) - 2 : Math.min(index, 3 - index);
    const cut = meta.grid.reduce((sum, row, r) => sum + row.reduce((subtotal, value, c) =>
      subtotal + (meta.cells.some((cell) => cell.r === folded(r, meta.hDir) && cell.c === folded(c, meta.vDir)) ? value : 0), 0), 0);
    assert(meta.grid.length === 4 && meta.grid.every((row) => row.length === 4), `${prefix}: folding grid shape changed`);
    assert(Number(problem.answer) === cut, `${prefix}: independently folded sum disagrees`);
  } else if (entry.typeId === "polygon-ring-equal-sum") {
    const { shown, cards, lineSum } = problem.visual;
    const values = problem.answer.split(",").map(Number);
    assert(values.length === 10 && new Set(values).size === 10 && values.every((value) => cards.includes(value)), `${prefix}: ring cards mismatch`);
    const valid = (ring) => Array.from({ length: 5 }, (_, edge) => [edge * 2, edge * 2 + 1, (edge * 2 + 2) % 10])
      .every((indices) => indices.some((index) => ring[index] == null) || indices.reduce((sum, index) => sum + ring[index], 0) === lineSum);
    assert(shown.every((value, index) => value == null || value === values[index]) && valid(values), `${prefix}: ring solution violates given clues`);
    const countCompletions = (ring, unused) => {
      if (!valid(ring)) return 0;
      const empty = ring.indexOf(null);
      if (empty < 0) return 1;
      return unused.reduce((total, value) => {
        if (total > 1) return total;
        const next = [...ring];
        next[empty] = value;
        return total + countCompletions(next, unused.filter((item) => item !== value));
      }, 0);
    };
    assert(countCompletions([...shown], cards.filter((value) => !shown.includes(value))) === 1, `${prefix}: ring has multiple or no completions`);
  } else if (entry.typeId === "equalize-transfer") {
    const answer = Number.parseInt(problem.answer, 10);
    assert(meta.higher - answer === meta.lower + answer && answer >= 0, `${prefix}: transfer does not equalize both quantities`);
  } else if (entry.typeId === "reverse-transfer-total") {
    const answer = Number.parseInt(problem.answer, 10);
    assert(meta.receiverBefore * 2 === meta.afterEach && answer - meta.receiverBefore === meta.afterEach, `${prefix}: reverse transfer does not reproduce the final state`);
  } else if (entry.typeId === "shape-sum-table" && meta?.sourceLayout) {
    const { cells, rowSums, columnSums } = problem.visual;
    const valueOf = (shape) => meta.shapeValues[shape];
    const calculatedRows = cells.map((row) => row.reduce((sum, shape) => sum + valueOf(shape), 0));
    const calculatedColumns = cells[0].map((_, column) => cells.reduce((sum, row) => sum + valueOf(row[column]), 0));
    rowSums.forEach((sum, index) => assert(sum == null || sum === calculatedRows[index], `${prefix}: visible row sum ${index + 1} disagrees`));
    columnSums.forEach((sum, index) => assert(sum == null || sum === calculatedColumns[index], `${prefix}: visible column sum ${index + 1} disagrees`));
    const values = Object.values(meta.shapeValues);
    assert(values.every((value) => Number.isInteger(value) && value > 0) && new Set(values).size === values.length, `${prefix}: shape values must be distinct positive integers`);
    assert(rowSums.filter((sum) => sum == null).length + columnSums.filter((sum) => sum == null).length === 1, `${prefix}: matrix needs exactly one target sum`);
    const expected = meta.targetAxis === "row" ? calculatedRows[meta.targetIndex] : calculatedColumns[meta.targetIndex];
    assert(Number(problem.answer) === expected, `${prefix}: target sum disagrees with the matrix`);

    let solved;
    if (meta.sourceLayout === "shape-matrix-3x3-last-column") {
      const square = columnSums[1] / 3;
      const diamond = rowSums[1] - square * 2;
      const triangle = rowSums[0] - diamond - square;
      const circle = rowSums[2] - triangle - square;
      solved = { square, diamond, triangle, circle };
      assert(cells.length === 3 && cells.every((row) => row.length === 3), `${prefix}: source 3x3 structure changed`);
    } else if (meta.sourceLayout === "shape-matrix-4x4-first-row") {
      const circle = columnSums[1] / 4;
      const square = rowSums[2] - circle * 3;
      const diamond = rowSums[3] - circle * 2 - square;
      const triangle = columnSums[2] - square - circle * 2;
      solved = { circle, square, diamond, triangle };
      assert(cells.length === 4 && cells.every((row) => row.length === 4), `${prefix}: source 4x4 structure changed`);
    } else if (meta.sourceLayout === "shape-matrix-3x4-second-row") {
      const circle = (rowSums[2] * 2 - rowSums[0]) / 4;
      const square = rowSums[2] - circle * 3;
      const cross = columnSums[0] - square - circle;
      const diamond = columnSums[1] - circle * 2;
      const triangle = columnSums[2] - circle - square;
      solved = { circle, square, cross, diamond, triangle };
      assert(cells.length === 3 && cells.every((row) => row.length === 4), `${prefix}: source 3x4 structure changed`);
    }
    assert(solved && Object.entries(solved).every(([shape, value]) => value === meta.shapeValues[shape]), `${prefix}: visible sums do not recover one unique value per shape`);
  } else {
    fail(`${prefix}: independent validator is required before enabling a new link`);
  }
}

const auditGeneratedContracts = (bookId, links) => {
  for (const entry of links.filter((item) => item.verified)) {
    const type = typeById(entry.typeId);
    assert(entry.generatorContract, `${bookId} q${entry.number}: generator contract missing`);
    assert(type?.generator && typeof GENERATORS[type.generator] === "function", `${bookId} q${entry.number}: generator missing for ${entry.typeId}`);
    for (const difficulty of [1, 2, 3].slice(0, variants)) {
      const sourceCase = {
        mode: entry.generationCaseMode,
        sourceKey: `unit-test:${bookId}:q${entry.number}`,
        sourceKind: "unit-test",
        sourceId: bookId,
        number: entry.number,
        sourceFidelity: entry.sourceFidelity
      };
      const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
      const prefix = `${bookId} q${String(entry.number).padStart(2, "0")} ${entry.typeId} d${difficulty}`;
      assert(problem && typeof problem === "object", `${prefix}: generator returned no problem`);
      assert(typeof problem.prompt === "string" && problem.prompt.trim(), `${prefix}: prompt missing`);
      assert(problem.answer !== undefined && String(problem.answer).trim(), `${prefix}: answer missing`);
      assert(typeof problem.solution === "string" && problem.solution.trim(), `${prefix}: solution missing`);
      assert(!/undefined|NaN|\[object Object\]/.test(`${problem.prompt}${problem.answer}${problem.solution}`), `${prefix}: invalid generated text`);
      assert((problem.responseKind || "text") === entry.generatorContract.responseKind, `${prefix}: generated response kind differs from contract`);
      independentCheck(entry, problem, prefix);
      const markup = [render(bookId, problem), ...(problem.parts || []).map((part) => render(bookId, part))].join("");
      if (problem.visual?.kind === "book1" || problem.visual?.kind === "book2" || problem.parts?.some((part) => ["book1", "book2"].includes(part.visual?.kind))) {
        assert(markup.trim().length > 30, `${prefix}: renderer produced blank markup`);
      }
    }
  }
};

const auditBook02MatrixStress = () => {
  const matrixLinks = BOOK02_UNIT_TEST_LINKS.filter((entry) => [1, 2, 22].includes(entry.number));
  for (const entry of matrixLinks) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-02:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-02",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < 100; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        independentCheck(entry, problem, `book-02 q${String(entry.number).padStart(2, "0")} stress d${difficulty} sample${sample + 1}`);
      }
    }
  }
};

const BOOK02_STRESS_VARIANTS = 20;
const BOOK01_STRESS_VARIANTS = 8;
const auditBook01SourceStress = () => {
  for (const entry of BOOK01_UNIT_TEST_LINKS.filter((item) => item.verified)) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-01:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-01",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < BOOK01_STRESS_VARIANTS; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        independentCheck(entry, problem, `book-01 q${String(entry.number).padStart(2, "0")} source stress d${difficulty} sample${sample + 1}`);
      }
    }
  }
};

const auditBook02SourceStress = () => {
  for (const entry of BOOK02_UNIT_TEST_LINKS) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-02:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-02",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < BOOK02_STRESS_VARIANTS; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        independentCheck(entry, problem, `book-02 q${String(entry.number).padStart(2, "0")} source stress d${difficulty} sample${sample + 1}`);
      }
    }
  }
};

assert(LEARNER_STAGE === "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정", "learner stage contract changed");
assert(BOOK01_02_UNIT_TEST_LINKS["book-01"] === BOOK01_UNIT_TEST_LINKS, "book-01 export alias mismatch");
assert(BOOK01_02_UNIT_TEST_LINKS["book-02"] === BOOK02_UNIT_TEST_LINKS, "book-02 export alias mismatch");
for (const [bookId, links] of Object.entries(BOOK01_02_UNIT_TEST_LINKS)) {
  assert(CURRICULUM.find((book) => book.id === bookId).source.unitTestQuestions.length === links.length, `${bookId}: inventory is not connected`);
}
assert(BOOK02_UNIT_TEST_LINKS.every((entry) => entry.verified), "Every Book 2 source contract must have a verified source-shaped generator");
assert(BOOK02_UNIT_TEST_LINKS.filter((entry) => [1, 2, 22].includes(entry.number)).every((entry) => entry.verified), "Source-shaped matrix generators must stay enabled");
assert(BOOK01_UNIT_TEST_LINKS.filter((entry) => entry.number !== 23).every((entry) => entry.verified), "Every determinate Book 1 source contract must have a verified source-shaped generator");
assert(!BOOK01_UNIT_TEST_LINKS.find((entry) => entry.number === 23)?.verified, "Book 1 q23 must stay held until the missing source clue is confirmed");

auditLinks("book-01", BOOK01_UNIT_TEST_LINKS);
auditLinks("book-02", BOOK02_UNIT_TEST_LINKS);
auditGeneratedContracts("book-01", BOOK01_UNIT_TEST_LINKS);
auditGeneratedContracts("book-02", BOOK02_UNIT_TEST_LINKS);
auditBook01SourceStress();
auditBook02MatrixStress();
auditBook02SourceStress();

const counts = (links) => ({ total: links.length, verified: links.filter((entry) => entry.verified).length, held: links.filter((entry) => !entry.verified).length });
const result = {
  learnerStage: LEARNER_STAGE,
  books: {
    "book-01": counts(BOOK01_UNIT_TEST_LINKS),
    "book-02": counts(BOOK02_UNIT_TEST_LINKS)
  },
  generatedVariantsPerVerifiedLink: Math.min(variants, 3),
  book01SourceStressSamples: 24 * 3 * BOOK01_STRESS_VARIANTS,
  matrixStressSamples: 3 * 3 * 100,
  book02SourceStressSamples: 25 * 3 * BOOK02_STRESS_VARIANTS,
  status: failures.length ? "FAIL" : "BOOK01_BOOK02_UNIT_TEST_LINKS_OK",
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
