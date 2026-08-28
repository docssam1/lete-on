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

function countQ13Solutions(fixed) {
  let count = 0;
  for (let diamond = 1; diamond <= 9; diamond += 1) for (let square = 1; square <= 9; square += 1) for (let circle = 0; circle <= 9; circle += 1) {
    if (new Set([diamond, square, circle]).size !== 3) continue;
    if (diamond * 10 + circle + square * 10 + circle === square * 110 + fixed) count += 1;
  }
  return count;
}

function countQ14Solutions(leadingFixed, unitFixed) {
  let count = 0;
  for (let diamond = 1; diamond <= 9; diamond += 1) for (let square = 0; square <= 9; square += 1) for (let circle = 0; circle <= 9; circle += 1) {
    if (new Set([diamond, square, circle]).size !== 3) continue;
    if (leadingFixed * 100 + square * 10 + circle + circle * 10 + unitFixed === diamond * 111) count += 1;
  }
  return count;
}

function countQ15Solutions() {
  let count = 0;
  for (let diamond = 1; diamond <= 9; diamond += 1) for (let square = 0; square <= 9; square += 1) for (let circle = 1; circle <= 9; circle += 1) for (let triangle = 1; triangle <= 9; triangle += 1) for (let cross = 0; cross <= 9; cross += 1) {
    if (new Set([diamond, square, circle, triangle, cross]).size !== 5) continue;
    if (circle * 100 + cross * 10 + diamond + diamond * 10 + triangle === triangle * 1000 + square * 110 + circle) count += 1;
  }
  return count;
}

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
    case "paired-hexagon-fractions":
      assert(JSON.stringify(meta.parts) === JSON.stringify([12, 18]), id, difficulty, "paired hexagon denominators changed");
      assert(meta.shaded.length === 2 && meta.shaded.every((value, index) => value > 0 && value < meta.parts[index]), id, difficulty, "paired hexagon numerators invalid");
      assert(problem.answer === `왼쪽=${meta.shaded[0]}/${meta.parts[0]}, 오른쪽=${meta.shaded[1]}/${meta.parts[1]}`, id, difficulty, "paired hexagon answer mismatch");
      assert(problem.responseKind === "list" && visual.subtype === "paired-source-fractions", id, difficulty, "paired hexagon response structure changed");
      assert(JSON.stringify(visual.items.map((item) => [item.template, item.parts])) === JSON.stringify([["hexagon-12", 12], ["hexagon-18", 18]]), id, difficulty, "paired hexagon topology changed");
      if (difficulty === 2) assert(JSON.stringify(meta.shaded) === JSON.stringify([2, 6]), id, difficulty, "unit-test q3 source shading changed");
      return;
    case "triangle-twelve-part-fraction":
      assert(meta.template === "triangle-12" && meta.parts === 12, id, difficulty, "triangle-12 topology changed");
      assert(meta.shaded > 0 && meta.shaded < meta.parts, id, difficulty, "triangle-12 numerator invalid");
      assert(problem.answer === `${meta.shaded}/12`, id, difficulty, "triangle-12 answer mismatch");
      assert(visual.subtype === "equal-partition-source" && visual.complete === true && visual.parts === 12, id, difficulty, "triangle-12 visual changed");
      if (difficulty === 2) assert(meta.shaded === 5, id, difficulty, "unit-test q4 source shading changed");
      return;
    case "concentric-square-sixteen-fraction":
      assert(meta.template === "concentric-square-diagonals" && meta.parts === 16, id, difficulty, "concentric-square topology changed");
      assert(meta.shaded === ({ 1: 1, 2: 2, 3: 3 })[difficulty], id, difficulty, "concentric-square shading changed");
      assert(problem.answer === `${meta.shaded}/16`, id, difficulty, "concentric-square answer mismatch");
      assert(visual.subtype === "concentric-square-sixteen-fraction" && visual.parts === 16, id, difficulty, "concentric-square visual changed");
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
    case "rod-comparison-total-unit-test":
      assert(meta.second === meta.first * meta.ratio, id, difficulty, "rod ratio mismatch");
      assert(meta.first + meta.second === meta.total, id, difficulty, "rod combined total mismatch");
      assert(meta.first === meta.unit, id, difficulty, "rod unit mismatch");
      assert(problem.answer === `㉠=${meta.first}cm, ㉡=${meta.second}cm`, id, difficulty, "rod visible answer mismatch");
      assert(!/\d+(?:을|를) /.test(problem.solution), id, difficulty, "rod solution has a bare-number particle");
      assert(problem.visual?.subtype === "rod-comparison-total" && problem.visual.ratio === meta.ratio && problem.visual.total === meta.total, id, difficulty, "rod source visual mismatch");
      return;
    case "overlapping-rods-common-unit-test":
      assert(meta.first === meta.firstUnits * meta.unit, id, difficulty, "overlapping first rod mismatch");
      assert(meta.third === meta.segmentUnits * meta.unit, id, difficulty, "overlapping target rod mismatch");
      assert(meta.offsetUnits === meta.firstUnits - 1, id, difficulty, "overlapping offset changed");
      assert(problem.answer === `${meta.third}cm`, id, difficulty, "overlapping visible answer mismatch");
      assert(problem.visual?.subtype === "overlapping-rods-common-unit" && problem.visual.firstUnits === meta.firstUnits && problem.visual.segmentUnits === meta.segmentUnits, id, difficulty, "overlapping source visual mismatch");
      assert(JSON.stringify(meta.sourceCase) === JSON.stringify({ firstUnits: 5, segmentUnits: 4, first: 25, third: 20 }), id, difficulty, "overlapping source case changed");
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
    case "unit-test-cryptarithm-q13":
      assert(meta.first + meta.second === meta.sum, id, difficulty, "q13 equation mismatch");
      assert(meta.solutionCount === 1, id, difficulty, "q13 solution count changed");
      assert(problem.visual?.addends?.[0]?.length === 2 && problem.visual?.sum?.length === 3, id, difficulty, "q13 visual structure changed");
      return;
    case "unit-test-cryptarithm-q14":
      assert(meta.first + meta.second === meta.sum, id, difficulty, "q14 equation mismatch");
      assert(meta.solutionCount === 1, id, difficulty, "q14 solution count changed");
      assert(problem.visual?.addends?.[0]?.length === 3 && problem.visual?.addends?.[1]?.length === 2 && problem.visual?.sum?.length === 3, id, difficulty, "q14 visual structure changed");
      return;
    case "unit-test-cryptarithm-q15":
      assert(meta.first + meta.second === meta.sum, id, difficulty, "q15 equation mismatch");
      assert(meta.solutionCount === 1 && new Set(meta.values).size === 5, id, difficulty, "q15 values changed");
      assert(problem.visual?.addends?.[0]?.length === 3 && problem.visual?.addends?.[1]?.length === 2 && problem.visual?.sum?.length === 4, id, difficulty, "q15 visual structure changed");
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
if (typeIds.length !== 52) throw new Error(`book-03 type count ${typeIds.length}`);

const unitTestQuestions = book.source?.unitTestQuestions || [];
const expectedReadyQuestions = Array.from({ length: 25 }, (_, index) => index + 1);
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
const question3Type = typeById(unitTestQuestions.find((question) => question.number === 3)?.typeId);
const question4Type = typeById(unitTestQuestions.find((question) => question.number === 4)?.typeId);
const question5Type = typeById(unitTestQuestions.find((question) => question.number === 5)?.typeId);
const question9Type = typeById(unitTestQuestions.find((question) => question.number === 9)?.typeId);
const question10Type = typeById(unitTestQuestions.find((question) => question.number === 10)?.typeId);
const question13Type = typeById(unitTestQuestions.find((question) => question.number === 13)?.typeId);
const question14Type = typeById(unitTestQuestions.find((question) => question.number === 14)?.typeId);
const question15Type = typeById(unitTestQuestions.find((question) => question.number === 15)?.typeId);
assert(countQ15Solutions() === 1, question15Type.id, 3, "source q15 is not unique");
const sourceCase = (number) => ({
  mode: "source",
  sourceKey: `unit-test:book-03:q${number}`,
  sourceKind: "unit-test",
  sourceId: "book-03",
  number,
  sourceFidelity: "exact-generator"
});
for (let run = 0; run < 100; run += 1) {
  const question3 = GENERATORS[question3Type.generator]({ difficulty: 2, sourceCase: sourceCase(3) });
  assert(JSON.stringify(question3.meta.sourceCase) === JSON.stringify({ parts: [12, 18], shaded: [2, 6] }), question3Type.id, 2, "unit-test q3 source case changed");
  assert(JSON.stringify(question3.meta.shaded) === JSON.stringify([2, 6]), question3Type.id, 2, "unit-test q3 visible fractions changed");
  assert(question3.meta.sourceExact === true && question3.visual.subtype === "paired-source-fractions-exact", question3Type.id, 2, "unit-test q3 exact renderer not selected");
  assert(question3.meta.sourceVisualSignature === "wide-hexagon-12-crossed|wide-hexagon-18-outer-star", question3Type.id, 2, "unit-test q3 visual signature changed");
  assert(JSON.stringify(question3.visual.items[0].shadedRegionIds) === JSON.stringify(["top-right-center", "left-center"]), question3Type.id, 2, "unit-test q3 left source shading changed");
  assert(JSON.stringify(question3.visual.items[1].shadedIndices) === JSON.stringify([0, 3, 6, 9, 12, 15]), question3Type.id, 2, "unit-test q3 right source shading changed");

  const question4 = GENERATORS[question4Type.generator]({ difficulty: 2, sourceCase: sourceCase(4) });
  assert(JSON.stringify(question4.meta.sourceCase) === JSON.stringify({ template: "source-triangle-twelve", parts: 12, shaded: 5 }), question4Type.id, 2, "unit-test q4 source case changed");
  assert(question4.answer === "5/12", question4Type.id, 2, "unit-test q4 visible fraction changed");
  assert(question4.meta.sourceExact === true && question4.visual.subtype === "triangle-twelve-fraction-exact", question4Type.id, 2, "unit-test q4 exact renderer not selected");
  assert(JSON.stringify(question4.visual.shadedRegionIds) === JSON.stringify(["top-center", "left-base", "right-side"]), question4Type.id, 2, "unit-test q4 source shading changed");

  const question5 = GENERATORS[question5Type.generator]({ difficulty: 2, sourceCase: sourceCase(5) });
  assert(JSON.stringify(question5.meta.sourceCase) === JSON.stringify({ template: "concentric-square-diagonals", parts: 16, shaded: 2 }), question5Type.id, 2, "unit-test q5 source case changed");
  assert(question5.answer === "2/16", question5Type.id, 2, "unit-test q5 visible fraction changed");
  assert(question5.meta.sourceExact === true && JSON.stringify(question5.visual.shadedIndices) === JSON.stringify([1, 2]), question5Type.id, 2, "unit-test q5 source shading changed");

  const question9 = GENERATORS[question9Type.generator]({ difficulty: 2 });
  assert([2, 5].includes(question9.meta.ratio), question9Type.id, 2, "unit-test ratio changed");
  assert(question9.meta.first + question9.meta.second === question9.meta.total, question9Type.id, 2, "unit-test total changed");
  assert(question9.visual.subtype === "rod-comparison-total", question9Type.id, 2, "unit-test rod visual changed");

  const question10 = GENERATORS[question10Type.generator]({ difficulty: 2 });
  assert(question10.meta.firstUnits === 5 && question10.meta.segmentUnits === 4, question10Type.id, 2, "unit-test overlapping rod proportions changed");
  assert(question10.meta.first / 5 === question10.meta.third / 4, question10Type.id, 2, "unit-test overlapping rod scale changed");
  assert(question10.visual.subtype === "overlapping-rods-common-unit", question10Type.id, 2, "unit-test overlapping rod visual changed");

  const question13 = GENERATORS[question13Type.generator]({ difficulty: 2 });
  assert(countQ13Solutions(question13.meta.fixed) === 1, question13Type.id, 2, "unit-test q13 is not unique");
  assert(JSON.stringify(question13.meta.sourceCase) === JSON.stringify({ fixed: 6, diamond: 9, square: 1, circle: 8 }), question13Type.id, 2, "unit-test q13 source case changed");

  const question14 = GENERATORS[question14Type.generator]({ difficulty: 2 });
  assert(countQ14Solutions(question14.meta.leadingFixed, question14.meta.unitFixed) === 1, question14Type.id, 2, "unit-test q14 is not unique");
  assert(JSON.stringify(question14.meta.sourceCase) === JSON.stringify({ leadingFixed: 1, unitFixed: 4, diamond: 2, square: 3, circle: 8 }), question14Type.id, 2, "unit-test q14 source case changed");

  const question15 = GENERATORS[question15Type.generator]({ difficulty: 3 });
  assert(JSON.stringify(question15.meta.sourceCase) === JSON.stringify({ diamond: 8, square: 0, circle: 9, triangle: 1, cross: 2 }), question15Type.id, 3, "unit-test q15 source case changed");

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
    const minimumVariants = iterations < 30 ? 1 : typeId === "cryptarithm-multi-symbol-carry" ? 2 : 3;
    assert(fingerprints.size >= minimumVariants, typeId, difficulty, `only ${fingerprints.size} visible variants`);
    variants.set(key, fingerprints.size);
  }
}

console.log(`BOOK03_AUDIT_OK types=${typeIds.length} difficulties=3 iterations=${iterations} generated=${generated} minVariants=${Math.min(...variants.values())}`);
