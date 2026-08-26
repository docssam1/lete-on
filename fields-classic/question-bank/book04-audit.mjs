import { GENERATORS } from "./generators.js";
import { book04Markup } from "./book04-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const book = CURRICULUM.find((item) => item.id === "book-04");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const unitTestQuestions = book?.source?.unitTestQuestions || [];
const unitTestTypeIds = [...new Set(unitTestQuestions.map((question) => question.typeId))];
const auditedTypeIds = [...new Set([...typeIds, ...unitTestTypeIds])];
const stages = TEXTBOOK_STAGES.map((stage) => stage.id);
const expectedUnitCounts = [42, 35, 34, 42];
const expectedUnitTestTypes = [
  "star-congruent-partition-draw-book4", "forest-congruent-partition-draw-book4", "digital-grid-upright-after-moves",
  "digital-self-half-turn-calculation", "rotational-partition-two", "fold-number-grid-multi", "overlapping-paper-bottom",
  "cube-count-solid", "cube-fill-rectangular-box", "shape-difference-chain", "measurement-age-difference-book4",
  "measurement-distance-difference-book4", "balance-unit-ratio", "balance-unit-ratio", "race-third-place-book4",
  "directional-landmark-placement-book4", "circular-seat-blank-book4", "g1-front-back-between",
  "digital-grid-upright-after-moves", "cube-shell-interior-b9", "three-fold-cut-line-book4", "balance-unit-ratio",
  "measurement-time-difference-book4", "circular-seat-blank-book4", "front-back-two-order-totals-book4"
];

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

function polyominoSignature(cells) {
  const variants = [];
  for (const reflected of [false, true]) {
    for (let turns = 0; turns < 4; turns += 1) {
      let transformed = cells.map(([row, column]) => [row, reflected ? -column : column]);
      for (let turn = 0; turn < turns; turn += 1) transformed = transformed.map(([row, column]) => [column, -row]);
      const minRow = Math.min(...transformed.map(([row]) => row));
      const minColumn = Math.min(...transformed.map(([, column]) => column));
      variants.push(transformed.map(([row, column]) => [row - minRow, column - minColumn])
        .sort(([rowA, columnA], [rowB, columnB]) => rowA - rowB || columnA - columnB)
        .map(([row, column]) => `${row}:${column}`).join("|"));
    }
  }
  return variants.sort()[0];
}

const MAP_POSITIONS = [[0,0],[0,1],[1,0],[1,1]];
function mapDirection(from, to) {
  const vertical = to[0] < from[0] ? "북" : to[0] > from[0] ? "남" : "";
  const horizontal = to[1] < from[1] ? "서" : to[1] > from[1] ? "동" : "";
  return `${vertical}${horizontal}쪽`;
}

function transformGrid(grid, operation) {
  const rows = grid.length;
  const columns = grid[0].length;
  if (operation === "rotate-right") return Array.from({ length: columns }, (_, row) => Array.from({ length: rows }, (_, column) => grid[rows - 1 - column][row]));
  if (operation === "rotate-half") return grid.map((row) => [...row].reverse()).reverse();
  if (operation === "mirror-left-right") return grid.map((row) => [...row].reverse());
  return [...grid].reverse().map((row) => [...row]);
}

const BOARD_TRANSFORMS = Object.freeze({
  "rotate-right": [0, -1, 1, 0],
  "rotate-half": [-1, 0, 0, -1],
  "mirror-left-right": [-1, 0, 0, 1],
  "mirror-top-bottom": [1, 0, 0, -1]
});
const MATRIX_IDENTITY = [1, 0, 0, 1];

function multiplyMatrix(left, right) {
  return [
    left[0] * right[0] + left[1] * right[2],
    left[0] * right[1] + left[1] * right[3],
    left[2] * right[0] + left[3] * right[2],
    left[2] * right[1] + left[3] * right[3]
  ];
}

function applyBoardOperation(grid, operation) {
  const moved = transformGrid(grid, operation);
  return moved.map((row) => row.map((card) => ({ ...card, matrix: multiplyMatrix(BOARD_TRANSFORMS[operation], card.matrix) })));
}

const HALF_TURN_DIGITS = Object.freeze({ 0: 0, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 });
function halfTurnNumber(value) {
  const digits = String(value).split("").map(Number).reverse().map((digit) => HALF_TURN_DIGITS[digit]);
  return digits.some((digit) => digit == null) || digits[0] === 0 ? null : Number(digits.join(""));
}

function paperSnapshot(layers, removed, size) {
  return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => {
    const layer = layers.slice(removed).find((paper) => paper.cells.some(([cellRow, cellColumn]) => cellRow === row && cellColumn === column));
    return layer ? { label: layer.label, color: layer.color } : null;
  }));
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
  assert(!/나이을|나이를를|위치를를|시간를|시각를|별가|나무이|학교을|도서관를|은행를|백화점를|병원를|우체국를/.test(text), id, difficulty, "broken Korean particle");
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
    case "marked-congruent-partition-book4": {
      const expectedPieceSize = id === "forest-congruent-partition-draw-book4" ? 3 : 4;
      assert(meta.groups.length === 4 && meta.groups.every((group) => group.length === expectedPieceSize), id, difficulty, "partition piece size mismatch");
      const active = meta.groups.flat().map(([row, column]) => `${row}:${column}`);
      assert(active.length === expectedPieceSize * 4 && new Set(active).size === active.length, id, difficulty, "partition cells overlap or are missing");
      const signatures = meta.groups.map(polyominoSignature);
      assert(new Set(signatures).size === 1, id, difficulty, "partition pieces are not congruent");
      assert(meta.groups.every(connected), id, difficulty, "partition piece is disconnected");
      assert(meta.markerCells.length === 4, id, difficulty, "marker count mismatch");
      meta.groups.forEach((group, index) => assert(group.some(([row, column]) => `${row}:${column}` === `${meta.markerCells[index][0]}:${meta.markerCells[index][1]}`), id, difficulty, "marker is outside its piece"));
      assert(problem.responseKind === "drawing" && problem.answerVisual, id, difficulty, "partition drawing answer missing");
      return;
    }
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
    case "digital-upright-grid": {
      const result = meta.operations.reduce((grid, operation) => applyBoardOperation(grid, operation), meta.grid);
      const upright = result.flat().filter((card) => card.matrix.join() === MATRIX_IDENTITY.join()).map((card) => card.value);
      assert(JSON.stringify(result) === JSON.stringify(meta.result), id, difficulty, "upright grid transform mismatch");
      assert(JSON.stringify(upright) === JSON.stringify(meta.uprightValues), id, difficulty, "upright digit list mismatch");
      assert(upright.reduce((sum, value) => sum + value, 0) === meta.answer && numeric === meta.answer, id, difficulty, "upright digit sum mismatch");
      assert(upright.length >= 2, id, difficulty, "too few upright digits");
      return;
    }
    case "digital-self-half-turn":
      meta.rows.forEach((row, index) => {
        assert(halfTurnNumber(row.source) === row.turned, id, difficulty, `row ${index + 1} half turn mismatch`);
        const expected = row.operator === "+" ? row.source + row.turned : Math.abs(row.source - row.turned);
        assert(expected === row.result && meta.answers[index] === expected, id, difficulty, `row ${index + 1} arithmetic mismatch`);
      });
      return;
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
    case "overlapping-paper-order": {
      const snapshots = meta.layers.map((_, removed) => paperSnapshot(meta.layers, removed, meta.size));
      assert(JSON.stringify(snapshots) === JSON.stringify(meta.snapshots), id, difficulty, "paper snapshots mismatch");
      assert(meta.layers.at(-1).label === meta.answer && problem.answer === meta.answer, id, difficulty, "bottom paper mismatch");
      assert(meta.snapshots.every((snapshot) => snapshot.flat().some(Boolean)), id, difficulty, "empty paper snapshot");
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
    case "measurement-difference": {
      const offsets = [0];
      meta.increments.forEach((difference) => offsets.push(offsets.at(-1) + difference));
      assert(JSON.stringify(offsets) === JSON.stringify(meta.offsets), id, difficulty, "difference offsets mismatch");
      meta.rules.forEach((rule) => {
        const first = meta.names.indexOf(rule.first);
        const second = meta.names.indexOf(rule.second);
        const actual = meta.offsets[first] - meta.offsets[second];
        assert(rule.relation === "more" ? actual === rule.difference : actual === -rule.difference, id, difficulty, "difference clue mismatch");
      });
      assert(meta.offsets[meta.secondIndex] - meta.offsets[meta.firstIndex] === meta.answer && numeric === meta.answer, id, difficulty, "difference answer mismatch");
      const expectedScene = {
        "measurement-age-difference-book4": "age",
        "measurement-distance-difference-book4": "distance",
        "measurement-time-difference-book4": "time"
      }[id];
      if (expectedScene) assert(meta.sceneId === expectedScene, id, difficulty, `scene changed to ${meta.sceneId}`);
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
    case "directional-landmark-map-book4":
      assert(meta.places.length === 4 && new Set(meta.places).size === 4, id, difficulty, "landmark names repeat");
      assert(meta.targetIndex >= 0 && meta.targetIndex < 4 && !meta.shownIndexes.includes(meta.targetIndex), id, difficulty, "target landmark is already shown");
      assert(meta.places[meta.targetIndex] === meta.answer && problem.answer === meta.answer, id, difficulty, "landmark answer mismatch");
      assert(mapDirection(MAP_POSITIONS[meta.mainAnchor], MAP_POSITIONS[meta.targetIndex]) === meta.targetDirection, id, difficulty, "landmark direction mismatch");
      assert(problem.answerVisual, id, difficulty, "landmark answer map missing");
      return;
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
    case "race-third-place-book4":
      assert(meta.candidateOrders.length > 0, id, difficulty, "race candidates missing");
      assert(new Set(meta.candidateOrders.map((order) => order[2])).size === 1, id, difficulty, "third place is not unique");
      assert(meta.candidateOrders[0][2] === meta.answer && problem.answer === meta.answer, id, difficulty, "third place answer mismatch");
      return;
    case "circular-seat-blank-book4":
      assert(meta.candidateOrders.length > 0, id, difficulty, "circle candidates missing");
      assert(new Set(meta.candidateOrders.map((order) => order[meta.targetSeat])).size === 1, id, difficulty, "marked circular seat is not unique");
      assert(meta.candidateOrders[0][meta.targetSeat] === meta.answer && problem.answer === meta.answer, id, difficulty, "marked circular seat mismatch");
      return;
    case "three-fold-cut-line-book4":
      assert(meta.folds === 3 && meta.gridRows === 2 && meta.gridColumns === 4, id, difficulty, "source fold/grid structure mismatch");
      assert(JSON.stringify(meta.repeatStarts) === JSON.stringify([0, 2]), id, difficulty, "unfolded cut must repeat in the two source positions");
      assert(meta.cutInset >= 15 && meta.cutInset <= 17, id, difficulty, "source cut line geometry mismatch");
      assert(problem.responseKind === "drawing" && problem.answerVisual, id, difficulty, "drawing answer missing");
      return;
    case "front-back-two-orders-book4": {
      const first = meta.firstFront + meta.between + 1 + meta.secondBack - 1;
      const second = meta.firstFront - meta.between - 1 + meta.secondBack - 1;
      assert(first === meta.firstBeforeSecond && second === meta.secondBeforeFirst, id, difficulty, "two-order total mismatch");
      assert(first > 0 && second > 0, id, difficulty, "non-positive line total");
      return;
    }
    default:
      // 1~3권과 Geometry Worksheet에서 이미 독립 검산한 재사용 생성기다.
      assert(meta.family || type.generator, id, difficulty, "reused generator has no audit identity");
  }
}

if (!book) throw new Error("book-04 missing");
if (units.length !== 4) throw new Error(`book-04 unit count ${units.length}`);
if (typeIds.length !== 28) throw new Error(`book-04 type count ${typeIds.length}`);
if (unitTestQuestions.length !== 25) throw new Error(`book-04 unit test count ${unitTestQuestions.length}`);
unitTestQuestions.forEach((question, index) => {
  if (question.number !== index + 1) throw new Error(`book-04 unit test number ${question.number}, expected ${index + 1}`);
  if (question.typeId !== expectedUnitTestTypes[index]) throw new Error(`book-04 unit test ${question.number} type ${question.typeId}, expected ${expectedUnitTestTypes[index]}`);
  if (!question.verified) throw new Error(`book-04 unit test ${question.number} is not verified`);
  if (!typeById(question.typeId)) throw new Error(`book-04 unit test ${question.number} unknown type ${question.typeId}`);
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
console.log(`BOOK04_AUDIT_OK types=${typeIds.length} unitTestQuestions=${unitTestQuestions.length} unitTestTypes=${unitTestTypeIds.length} sourceQuestions=${sourceQuestionCount} generated=${generated} worksheetOnly=${worksheetOnly} minVariants=${minVariants}`);
