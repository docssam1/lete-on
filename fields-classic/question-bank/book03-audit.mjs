import { GENERATORS } from "./generators.js";
import { book03Markup } from "./book03-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const book = CURRICULUM.find((item) => item.id === "book-03");
const units = book?.units || [];
const verifiedUnitTestTypeIds = (book?.source?.unitTestQuestions || [])
  .filter((question) => question.verified)
  .map((question) => question.typeId);
const typeIds = [...new Set([...units.flatMap((unit) => unit.typeIds), ...verifiedUnitTestTypeIds])];
const stages = TEXTBOOK_STAGES.map((stage) => stage.id);

const fail = (id, difficulty, message) => { throw new Error(`${id} / L${difficulty}: ${message}`); };
const assert = (condition, id, difficulty, message) => { if (!condition) fail(id, difficulty, message); };
const firstNumber = (value) => Number(String(value).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0]);
const lineSum = (values, indexes) => indexes.reduce((sum, index) => sum + values[index], 0);

function validateSurface(problem, id, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  assert(problem.prompt?.trim(), id, difficulty, "prompt missing");
  assert(String(problem.answer ?? "").trim(), id, difficulty, "answer missing");
  assert(problem.solution?.trim(), id, difficulty, "solution missing");
  assert(!/undefined|NaN|\[object Object\]/.test(text), id, difficulty, "invalid text token");
  assert(!/퍼뮤테이션|컴비네이션|제곱/.test(text), id, difficulty, "child-facing forbidden term");
  if (problem.visual?.kind === "book3") {
    const markup = book03Markup(problem.visual);
    assert(markup, id, difficulty, "blank visual markup");
    if (problem.visual.subtype === "meeting-distance") {
      const expected = problem.visual.faster / problem.visual.total * 100;
      assert(markup.includes(`--meet:${expected}%`), id, difficulty, "meeting marker does not match distance ratio");
    }
  }
  if (problem.answerVisual?.kind === "book3") assert(book03Markup(problem.answerVisual), id, difficulty, "blank answer visual markup");
}

function validateMagic(grid, expected, id, difficulty) {
  const size = grid.length;
  const lines = [
    ...grid,
    ...Array.from({ length: size }, (_, column) => grid.map((row) => row[column])),
    grid.map((row, index) => row[index]),
    grid.map((row, index) => row[size - index - 1])
  ];
  lines.forEach((line) => assert(line.reduce((sum, value) => sum + value, 0) === expected, id, difficulty, "magic line mismatch"));
}

function validate(type, problem, difficulty) {
  const id = type.id;
  const meta = problem.meta || {};
  const visual = problem.visual || {};
  const numeric = firstNumber(problem.answer);
  validateSurface(problem, id, difficulty);

  switch (meta.family) {
    case "tangram-composition":
      assert(meta.template === "five-piece-square", id, difficulty, "wrong tangram composition template");
      assert(JSON.stringify([...meta.pieceIds].sort()) === JSON.stringify([3,4,5,6,7]), id, difficulty, "wrong five-piece tangram inventory");
      assert(problem.answerVisual?.complete === true && problem.visual?.complete === false, id, difficulty, "tangram drawing answer is not gated");
      return;
    case "tangram-area": {
      const total = meta.selected.reduce((sum, pieceId) => sum + meta.pieceAreas[pieceId] * meta.unitArea, 0);
      assert(numeric === total, id, difficulty, "tangram area mismatch");
      assert(!problem.visual.pieceAreas, id, difficulty, "tangram visual leaks piece areas");
      return;
    }
    case "unit-grid-area": {
      if (meta.points?.length) {
        const shoelace = Math.abs(meta.points.reduce((sum, [x, y], index) => {
          const [nextX, nextY] = meta.points[(index + 1) % meta.points.length];
          return sum + x * nextY - nextX * y;
        }, 0));
        assert(meta.connected === true, id, difficulty, "unit area figure must be connected");
        assert(meta.areaTwice === shoelace, id, difficulty, "unit polygon area mismatch");
        assert(problem.answer === (shoelace % 2 === 0 ? String(shoelace / 2) : `${Math.floor(shoelace / 2)}와 1/2`), id, difficulty, "unit polygon answer mismatch");
      } else {
        assert(meta.areaTwice === meta.fullCount * 2 + meta.halfCount, id, difficulty, "unit area mismatch");
        assert(meta.halfCount % 2 === 0, id, difficulty, "fractional half cells unexpected");
      }
      return;
    }
    case "shape-area-growth":
      meta.areas.forEach((area, index) => assert(area === (meta.start + index) ** 2, id, difficulty, "growth area mismatch"));
      assert(numeric === meta.answer, id, difficulty, "growth answer mismatch");
      return;
    case "nested-square-area":
      meta.areas.forEach((area, index) => assert(area === meta.sides[index] ** 2 * meta.unitArea, id, difficulty, "nested square mismatch"));
      assert(numeric === meta.answer, id, difficulty, "nested answer mismatch");
      return;
    case "equal-fraction":
      assert(meta.shaded > 0 && meta.shaded < meta.parts, id, difficulty, "invalid fraction parts");
      assert(problem.answer === `${meta.shaded}/${meta.parts}`, id, difficulty, "fraction answer mismatch");
      return;
    case "incomplete-fraction":
      assert(meta.shaded > 0 && meta.shaded < meta.parts, id, difficulty, "invalid fraction parts");
      assert(problem.answer === `${meta.shaded}/${meta.parts}`, id, difficulty, "fraction answer mismatch");
      assert(meta.visibleLines > 0 && meta.visibleLines < meta.internalLines, id, difficulty, "incomplete guide-line count mismatch");
      assert(problem.visual?.complete === false && problem.answerVisual?.complete === true, id, difficulty, "incomplete/answer visual state mismatch");
      return;
    case "equal-partition-drawing":
      assert(meta.shaded > 0 && meta.shaded <= meta.parts, id, difficulty, "invalid partition drawing");
      assert(problem.visual?.complete === false && problem.answerVisual?.complete === true, id, difficulty, "answer partition incomplete");
      assert(problem.answerVisual?.parts === meta.parts, id, difficulty, "answer partition count mismatch");
      return;
    case "oblique-square-area":
      assert(meta.areas.every((area, index) => area === meta.squares[index].dx ** 2 + meta.squares[index].dy ** 2), id, difficulty, "oblique area mismatch");
      assert(problem.answer === (meta.areas.length === 1 ? String(meta.areas[0]) : `㉠=${meta.areas[0]}, ㉡=${meta.areas[1]}`), id, difficulty, "oblique answer mismatch");
      return;
    case "folded-strip":
      assert(meta.segments.reduce((sum, value) => sum + value, 0) === meta.answer, id, difficulty, "strip total mismatch");
      assert(numeric === meta.answer, id, difficulty, "strip answer mismatch");
      return;
    case "midpoint":
      assert(meta.left + meta.right === meta.middle * 2, id, difficulty, "midpoint mismatch");
      assert(numeric === meta.middle, id, difficulty, "midpoint answer mismatch");
      return;
    case "segment-chain": {
      const [ab, bc, cd] = meta.gaps;
      assert(meta.givens.AC === ab + bc && meta.givens.BD === bc + cd && meta.givens.AD === ab + bc + cd, id, difficulty, "segment givens mismatch");
      assert(problem.answer === `AB=${ab}cm, BC=${bc}cm, CD=${cd}cm`, id, difficulty, "segment answer mismatch");
      return;
    }
    case "object-count-equivalence":
      assert(meta.answer === meta.pencils * meta.pencilInMatches + meta.matches, id, difficulty, "object count relation mismatch");
      assert(numeric === meta.answer, id, difficulty, "object count answer mismatch");
      return;
    case "equal-interval":
      assert(meta.right - meta.left === meta.divisions * meta.unit, id, difficulty, "interval mismatch");
      assert(numeric === meta.unit, id, difficulty, "interval answer mismatch");
      return;
    case "step-ratio":
      assert(meta.dogSteps === meta.personSteps * meta.ratio, id, difficulty, "step ratio mismatch");
      assert(numeric === meta.dogSteps, id, difficulty, "step answer mismatch");
      return;
    case "route-multiple":
      assert(meta.second === meta.whole - meta.first && meta.second === meta.first * meta.answer, id, difficulty, "route multiple mismatch");
      assert(numeric === meta.answer, id, difficulty, "route answer mismatch");
      return;
    case "rod-total":
      assert(meta.first + meta.second === meta.total, id, difficulty, "rod total mismatch");
      return;
    case "unit-object":
      assert(meta.counts.every((count, index) => count * meta.lengths[index] === meta.total), id, difficulty, "object length mismatch");
      return;
    case "equivalent-object":
      assert(meta.log + 5 * meta.match === 3 * meta.match + 2 * meta.pencil, id, difficulty, "object equation mismatch");
      assert(problem.prompt.includes(`성냥개비 1개의 길이는 ${meta.match}cm`), id, difficulty, "match length not visible");
      assert(numeric === meta.answer, id, difficulty, "object answer mismatch");
      return;
    case "proportional-rods":
      assert(meta.firstCount * meta.firstLength === meta.total && meta.secondCount * meta.secondLength === meta.total, id, difficulty, "proportional rod mismatch");
      assert(numeric === meta.answer, id, difficulty, "proportional answer mismatch");
      return;
    case "meeting-distance":
      assert(meta.faster + meta.slower === meta.total && meta.faster === meta.slower * meta.ratio, id, difficulty, "meeting ratio mismatch");
      return;
    case "mixed-interval":
      assert(meta.join - meta.leftStart === meta.leftDivisions * meta.leftUnit, id, difficulty, "left interval mismatch");
      assert(meta.rightEnd - meta.join === meta.rightDivisions * meta.rightUnit, id, difficulty, "right interval mismatch");
      assert(numeric === meta.targetRight - meta.targetLeft, id, difficulty, "mixed interval answer mismatch");
      return;
    case "difference-unit":
      assert(meta.firstCount * meta.firstLength === meta.total && meta.secondCount * meta.secondLength === meta.total, id, difficulty, "difference units do not measure same total");
      assert(meta.difference === meta.firstLength - meta.secondLength, id, difficulty, "unit difference mismatch");
      assert(numeric === meta.answer, id, difficulty, "difference answer mismatch");
      return;
    case "cryptarithm-single-double":
      assert(meta.digit * 2 === meta.sum && numeric === meta.answer, id, difficulty, "single cryptarithm mismatch");
      return;
    case "cryptarithm-repeated-double":
      assert(meta.number === meta.digit * 11 && meta.number * 2 === meta.sum && numeric === meta.answer, id, difficulty, "repeated cryptarithm mismatch");
      return;
    case "cryptarithm-fixed-digit":
      assert(meta.first + meta.second === meta.sum && numeric === meta.answer, id, difficulty, "column addition mismatch");
      return;
    case "cryptarithm-two-symbol-column": {
      assert(meta.symbols.length === 2 && new Set(meta.symbols).size === 2, id, difficulty, "two distinct symbols required");
      assert(meta.values.length === 2 && new Set(meta.values).size === 2, id, difficulty, "two distinct values required");
      assert(meta.addendNumbers.reduce((total, value) => total + value, 0) === meta.sum, id, difficulty, "two-symbol column sum mismatch");
      const tokenValue = (token, values) => {
        const symbolIndex = meta.symbols.indexOf(token);
        return symbolIndex >= 0 ? values[symbolIndex] : Number(token);
      };
      const rowValue = (row, values) => row.reduce((total, token) => total * 10 + tokenValue(token, values), 0);
      assert(rowValue(meta.sumRow, meta.values) === meta.sum, id, difficulty, "visible result row mismatch");
      const solutions = [];
      for (let first = 0; first <= 9; first += 1) for (let second = 0; second <= 9; second += 1) {
        if (first === second) continue;
        const values = [first, second];
        if (meta.addends.some((row) => tokenValue(row[0], values) === 0)) continue;
        if (meta.addends.reduce((total, row) => total + rowValue(row, values), 0) === rowValue(meta.sumRow, values)) solutions.push(values);
      }
      assert(solutions.length === 1, id, difficulty, `two-symbol solution count ${solutions.length}`);
      const askIndex = meta.symbols.indexOf(meta.askSymbol);
      assert(askIndex >= 0 && solutions[0][askIndex] === numeric && numeric === meta.answer, id, difficulty, "asked symbol answer mismatch");
      assert(problem.visual?.addends?.length === (difficulty === 3 ? 3 : 2), id, difficulty, "source addend structure mismatch");
      return;
    }
    case "cryptarithm-linked":
      assert(meta.values[1] === meta.values[0] * 2, id, difficulty, "linked first relation mismatch");
      if (meta.values.length >= 3) assert(meta.values[2] === meta.values[0] * 3, id, difficulty, "linked second relation mismatch");
      if (meta.values.length >= 4) assert(meta.values[3] === meta.values[0] * 5, id, difficulty, "linked third relation mismatch");
      return;
    case "binary-weight":
      assert(meta.selected.reduce((sum, value) => sum + value, 0) === meta.target, id, difficulty, "binary target mismatch");
      assert(new Set(meta.selected).size === meta.selected.length, id, difficulty, "weight reused");
      return;
    case "cell-code":
      assert(meta.colored.reduce((sum, index) => sum + meta.weights[index], 0) === meta.answer, id, difficulty, "cell code mismatch");
      assert(numeric === meta.answer, id, difficulty, "cell answer mismatch");
      return;
    case "colored-cell-number-code":
      assert(meta.colored.reduce((sum, index) => sum + meta.weights[index], 0) === meta.answer, id, difficulty, "source cell code mismatch");
      assert(meta.rows === 1 ? meta.columns === 5 : meta.rows === 2 && meta.columns === 4, id, difficulty, "source cell layout mismatch");
      if (meta.mode === "read") assert(numeric === meta.answer, id, difficulty, "source cell answer mismatch");
      if (meta.mode === "color") assert(problem.responseKind === "drawing" && problem.answerVisual, id, difficulty, "source reverse cell answer missing");
      return;
    case "four-cell-binary-code":
      assert(meta.rows === 1 && meta.columns === 4, id, difficulty, "four-cell source layout mismatch");
      assert(JSON.stringify(meta.weights) === JSON.stringify([8, 4, 2, 1]), id, difficulty, "four-cell source weights mismatch");
      assert(meta.colored.reduce((sum, index) => sum + meta.weights[index], 0) === meta.answer, id, difficulty, "four-cell source answer mismatch");
      assert(problem.answer === String(meta.answer), id, difficulty, "four-cell visible answer mismatch");
      assert(problem.visual?.examples?.every((example) => example.colored.reduce((sum, index) => sum + meta.weights[index], 0) === example.value), id, difficulty, "four-cell example mismatch");
      return;
    case "symbol-code": {
      const lookup = Object.fromEntries(meta.symbols.map((symbol, index) => [symbol, meta.values[index]]));
      meta.rows.forEach((row) => assert(row.symbols.reduce((sum, symbol) => sum + lookup[symbol], 0) === row.total, id, difficulty, "symbol row mismatch"));
      assert(meta.targetSymbols.reduce((sum, symbol) => sum + lookup[symbol], 0) === meta.answer, id, difficulty, "symbol target mismatch");
      return;
    }
    case "symbol-value-code": {
      assert(meta.symbols.length === 3 && new Set(meta.symbols).size === 3, id, difficulty, "three source symbols required");
      assert(meta.values.length === 3 && new Set(meta.values).size === 3, id, difficulty, "three distinct symbol values required");
      const totalForCounts = (counts, values = meta.values) => counts.reduce((sum, count, index) => sum + count * values[index], 0);
      meta.rows.forEach((row, index) => {
        assert(row.total === totalForCounts(meta.countRows[index]), id, difficulty, "source symbol clue mismatch");
        assert(row.symbols.length === meta.countRows[index].reduce((sum, count) => sum + count, 0), id, difficulty, "source symbol count mismatch");
      });
      assert(meta.answer === totalForCounts(meta.targetCounts), id, difficulty, "source symbol target mismatch");
      assert(numeric === meta.answer, id, difficulty, "source symbol answer mismatch");
      return;
    }
    case "magic-three-complete":
    case "magic-three-target":
      validateMagic(meta.solution, meta.lineSum, id, difficulty);
      if (meta.answer !== undefined) assert(numeric === meta.answer, id, difficulty, "magic target mismatch");
      return;
    case "magic-four-target":
    case "magic-four-complete":
      validateMagic(meta.solution, 34, id, difficulty);
      if (meta.answer !== undefined) assert(numeric === meta.answer, id, difficulty, "four target mismatch");
      return;
    case "polygon-ring": {
      const lines = [[0,1,2],[2,3,4],[4,5,6],[6,7,8],[8,9,0]];
      lines.forEach((line) => assert(lineSum(meta.solution, line) === meta.lineSum, id, difficulty, "polygon line mismatch"));
      assert(meta.uniqueCount === 1, id, difficulty, "polygon answer not unique");
      return;
    }
    case "triangle-edge-6":
    case "triangle-edge-9": {
      const lines = meta.size === 6 ? [[0,1,2],[2,3,4],[4,5,0]] : [[0,1,2,3],[3,4,5,6],[6,7,8,0]];
      lines.forEach((line) => assert(lineSum(meta.solution, line) === meta.lineSum, id, difficulty, "triangle line mismatch"));
      assert(meta.uniqueCount === 1, id, difficulty, "triangle answer not unique");
      return;
    }
    case "equal-line-eight-complete-book3": {
      [[0,1,2], [2,3,4], [4,5,6], [6,7,0]].forEach((line) => assert(lineSum(meta.layout, line) === meta.lineSum, id, difficulty, "book3 eight-card line mismatch"));
      assert(new Set(meta.layout).size === 8 && meta.layout.every((value) => value >= 1 && value <= 8), id, difficulty, "book3 eight-card reuse");
      assert(meta.candidateCount === 1, id, difficulty, "book3 eight-card completion not unique");
      assert(problem.responseKind === "visual-fill" && problem.answerVisual?.shown?.length === 8, id, difficulty, "book3 eight-card full answer missing");
      return;
    }
    default:
      break;
  }

  if (id === "number-line-six-points") {
    const [ab, bc, cd, de, ef] = meta.gaps;
    assert(meta.distances.ac === ab + bc && meta.distances.bf === bc + cd + de + ef, id, difficulty, "six-point distance mismatch");
    assert(numeric === meta.answer, id, difficulty, "six-point answer mismatch");
    return;
  }
  if (id === "equal-line-sum-eight-cards") {
    [[0,1,2],[2,3,4],[4,5,6],[6,7,0]].forEach((line) => assert(lineSum(meta.layout, line) === meta.targetSum, id, difficulty, "eight-card line mismatch"));
    assert(meta.targetValues.length === 1 && numeric === meta.answer, id, difficulty, "eight-card target not unique");
    return;
  }
  if (id === "triangle-max-edge-sum") {
    [[0,3,1],[1,4,2],[2,5,0]].forEach((line) => assert(lineSum(meta.answer, line) === meta.target, id, difficulty, "max triangle line mismatch"));
    assert(meta.arrangements === 6, id, difficulty, "max triangle symmetry count mismatch");
    return;
  }
  if (id === "cryptarithm-multi-symbol-carry") {
    assert(problem.visual?.kind === "cryptarithm-vertical", id, difficulty, "multi-symbol visual missing");
    return;
  }
  fail(id, difficulty, `validator missing for family ${meta.family || "none"}`);
}

if (!book) throw new Error("book-03 missing");
if (units.length !== 4) throw new Error(`book-03 unit count ${units.length}`);
if (typeIds.length !== 44) throw new Error(`book-03 type count ${typeIds.length}`);

const unitTestQuestions = book.source?.unitTestQuestions || [];
const expectedReadyQuestions = [1, 2, 6, 7, 8, 11, 12, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
const readyQuestions = unitTestQuestions.filter((question) => question.verified).map((question) => question.number);
if (unitTestQuestions.length !== 25) throw new Error(`book-03 unit test question count ${unitTestQuestions.length}`);
if (new Set(unitTestQuestions.map((question) => question.number)).size !== 25) throw new Error("book-03 unit test question numbers are not unique");
if (unitTestQuestions.some((question, index) => question.number !== index + 1)) throw new Error("book-03 unit test questions must be ordered 1-25");
if (JSON.stringify(readyQuestions) !== JSON.stringify(expectedReadyQuestions)) throw new Error(`book-03 ready questions ${readyQuestions.join(",")}`);
for (const question of unitTestQuestions) {
  const type = typeById(question.typeId);
  if (!type) throw new Error(`book-03 unit test unknown type ${question.number}:${question.typeId}`);
  if (question.verified && type.sourceAuditBlocked) throw new Error(`book-03 unit test exposes blocked type ${question.number}:${question.typeId}`);
  if (question.verified && ![1, 2, 3].includes(question.difficulty)) throw new Error(`book-03 unit test difficulty missing ${question.number}`);
}
if (unitTestQuestions.find((question) => question.number === 16)?.difficulty !== 2) throw new Error("book-03 question 16 difficulty changed");
if (unitTestQuestions.find((question) => question.number === 17)?.difficulty !== 3) throw new Error("book-03 question 17 difficulty changed");

const question19Type = typeById(unitTestQuestions.find((question) => question.number === 19)?.typeId);
const question23Type = typeById(unitTestQuestions.find((question) => question.number === 23)?.typeId);
for (let run = 0; run < 100; run += 1) {
  const question19 = GENERATORS[question19Type.generator]({ difficulty: 2 });
  assert(question19.meta.template === "practice", question19Type.id, 2, "unit-test clue template changed");
  assert(JSON.stringify(question19.meta.countRows) === JSON.stringify([[1,1,0],[2,1,0],[1,1,1],[1,2,2]]), question19Type.id, 2, "unit-test clue rows changed");
  assert([[3,1,0],[1,1,2],[2,2,1]].some((counts) => JSON.stringify(counts) === JSON.stringify(question19.meta.targetCounts)), question19Type.id, 2, "unit-test target row changed");

  const question23 = GENERATORS[question23Type.generator]({ difficulty: 2 });
  assert(question23.meta.answer >= 8 && question23.meta.answer <= 15, question23Type.id, 2, "unit-test target range changed");
  assert(JSON.stringify(question23.visual.examples.map((example) => example.value)) === JSON.stringify([1,2,3,4,5,6,7]), question23Type.id, 2, "unit-test examples changed");
}

for (const unit of units) {
  for (const typeId of unit.typeIds) {
    const type = typeById(typeId);
    if (!type) throw new Error(`unknown type ${typeId}`);
    if (!GENERATORS[type.generator]) throw new Error(`missing generator ${typeId}:${type.generator}`);
    if (textbookGuideForType(typeId).startsWith("문제에 보이는 관계")) throw new Error(`generic guide ${typeId}`);
    const references = unit.typeStudyRefs?.[typeId];
    if (!references) throw new Error(`typeStudyRefs missing ${typeId}`);
    for (const stage of stages) {
      for (const reference of references[stage] || []) {
        if (!Array.isArray(reference.numbers) || !reference.numbers.length) throw new Error(`problem numbers missing ${typeId}/${stage}`);
        if (reference.numbers.some((number) => !Number.isInteger(number) || number < 1)) throw new Error(`invalid problem number ${typeId}/${stage}`);
      }
    }
  }
}

const variants = new Map();
let generated = 0;
for (const typeId of typeIds) {
  const type = typeById(typeId);
  for (const difficulty of [1, 2, 3]) {
    const key = `${typeId}/L${difficulty}`;
    const fingerprints = new Set();
    for (let run = 0; run < iterations; run += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 100 && !problem; attempt += 1) problem = GENERATORS[type.generator]({ difficulty });
      assert(problem, typeId, difficulty, "generator returned null");
      validate(type, problem, difficulty);
      fingerprints.add(JSON.stringify(problem.meta || { prompt: problem.prompt, answer: problem.answer, visual: problem.visual }));
      generated += 1;
    }
    const minimumVariants = typeId === "cryptarithm-multi-symbol-carry" ? 2 : 3;
    assert(fingerprints.size >= minimumVariants, typeId, difficulty, `only ${fingerprints.size} visible variants`);
    variants.set(key, fingerprints.size);
  }
}

console.log(`BOOK03_AUDIT_OK types=${typeIds.length} difficulties=3 iterations=${iterations} generated=${generated} minVariants=${Math.min(...variants.values())}`);
