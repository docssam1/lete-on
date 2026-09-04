import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { BOOK03_GOLDEN_BELL_SOURCE_PAGES } from "./golden-bell-book03-source.js";
import { book03Markup } from "./book03-renderers.js";

const EXPECTED_LESSONS = [
  ["unit-area-shapes", 13],
  ["six-multiple-equations", 12],
  ["fraction-shading", 15],
  ["equal-partition-fractions", 10],
  ["tape-length-midpoints", 13],
  ["overlapping-distance", 9],
  ["multiple-comparison", 18],
  ["basic-vertical-cryptarithm", 4],
  ["cryptarithm-repeated", 11],
  ["cryptarithm-mixed", 8],
  ["cryptarithm-linked", 7],
  ["magic-card-binary", 14],
  ["magic-square-targets", 10]
];
const EXPECTED_PAGES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30];
const CRYPTARITHM_LESSONS = new Set([
  "basic-vertical-cryptarithm",
  "cryptarithm-repeated",
  "cryptarithm-mixed",
  "cryptarithm-linked"
]);
const SYMBOLS = new Set(["○", "□", "△", "◇", "☆"]);
const EPSILON = 1e-9;
const failures = [];

const THREE_BY_THREE_MAGIC_LINES = Object.freeze([
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]);
const MAGIC_SOURCE_LINES = new Map([
  ["magic-28-1", THREE_BY_THREE_MAGIC_LINES],
  ["magic-28-2", THREE_BY_THREE_MAGIC_LINES],
  ["magic-28-3", THREE_BY_THREE_MAGIC_LINES],
  ["magic-28-4", THREE_BY_THREE_MAGIC_LINES],
  ["magic-29-1", [[0, 1, 2], [0, 3, 6], [0, 4, 8]]],
  ["magic-29-2", [[0, 1, 2], [0, 3, 6], [0, 4, 8]]],
  ["magic-29-3", [[0, 1, 2], [2, 5, 8], [2, 4, 6]]],
  ["magic-29-4", [[0, 3, 6], [6, 7, 8], [2, 4, 6]]],
  ["magic-30-1", [[0, 1, 2, 3], [0, 4, 8, 12], [0, 5, 10, 15]]],
  ["magic-30-2", [[4, 5, 6, 7], [1, 5, 9, 13]]],
  ["magic-30-3", [[4, 5, 6, 7], [1, 5, 9, 13], [0, 5, 10, 15]]]
]);

// Opaque digests lock the learner-visible source structure without publishing
// private source locations, completed teacher cells, or answer-key values.
const MAGIC_SOURCE_SIGNATURES = new Map([
  ["magic-28-1", "c4a98433146b9cd95706c34e28451ea15ef74cddd5b54857561013c2b2614cd6"],
  ["magic-28-2", "fe08024bc42e7cfd87b1b808d8abb071d293c5c63cc95e34af94b94c309785b0"],
  ["magic-28-3", "7023b8bef6f60f62c454ff4605df9fb9635f732d8863cb4a3c1d8f4b9e571a37"],
  ["magic-28-4", "e590b81a20cdd0abc29549048152570a84af9602addca13bb1b165f2b86d1f54"],
  ["magic-29-1", "223cda55c613014d246e0af5358da9527c3b3deaa101af99aabee735ac366049"],
  ["magic-29-2", "186261d0108b1b06e8f49a26a447d6667a501f1c28898685cd49f57629faf108"],
  ["magic-29-3", "00fc54448d6aa0fa8de5c4002edbe43e8bf0caec3c0c2df01a22ef8b6559214f"],
  ["magic-29-4", "bfef0a30ed8f0e3aa9f02d36c2c29daff51a167391b7154b423dc4ec1e91a0f8"],
  ["magic-30-1", "654cbd3df6ba6ea5798f69f5861ac85ab3336f970cdea688ba963d643c46793d"],
  ["magic-30-2", "ef05e60c04e82bbd0f3c3ff43591ed8b3b66c277b87fef21d945d80997d86253"],
  ["magic-30-3", "de31ccb82f97e4b22daef11ade521855b3c5aaab975331ce5e119e79cbeae4b1"]
]);
const MAGIC_SOURCE_TARGETS = new Map([
  ["magic-28-1", ["sum", "first", "triangle"]],
  ["magic-28-2", ["sum", "triangle"]],
  ["magic-28-3", ["sum", "triangle"]],
  ["magic-28-4", ["sum", "triangle"]],
  ["magic-29-1", ["sum", "triangle", "square"]],
  ["magic-29-2", ["triangle", "pair"]],
  ["magic-29-3", ["triangle", "pair"]],
  ["magic-29-4", ["triangle", "pair"]],
  ["magic-30-1", ["triangle", "pair"]],
  ["magic-30-2", ["triangle"]],
  ["magic-30-3", ["triangle", "symbols"]]
]);

function audit(label, callback) {
  try {
    callback();
  } catch (error) {
    failures.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function canonical(answer) {
  const value = Array.isArray(answer) ? answer[0] : answer;
  return String(value ?? "").replace(/\s+/gu, "").trim();
}

function numericAnswer(answer, label) {
  const value = canonical(answer);
  assert.match(value, /^-?\d+(?:\.\d+)?$/u, `${label}: expected a numeric answer, got ${JSON.stringify(answer)}`);
  const number = Number(value);
  assert.ok(Number.isFinite(number), `${label}: numeric answer is not finite`);
  return number;
}

function validateAnswerValue(answer, label, inputMode = "numeric") {
  const values = Array.isArray(answer) ? answer : [answer];
  assert.ok(values.length > 0, `${label}: answer aliases are empty`);
  const normalized = values.map((value) => String(value ?? "").trim());
  assert.ok(normalized.every((value) => value && !/^(?:undefined|null|nan)$/iu.test(value)), `${label}: answer is missing`);
  assert.equal(new Set(normalized.map((value) => value.replace(/\s+/gu, ""))).size, normalized.length, `${label}: answer aliases repeat`);
  if (inputMode === "numeric") {
    assert.ok(normalized.every((value) => /^-?\d+(?:\.\d+)?$/u.test(value)), `${label}: numeric input contains a non-numeric answer`);
  }
}

function polygonArea(points) {
  assert.ok(Array.isArray(points) && points.length >= 3, "polygon needs at least three points");
  let twiceArea = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    assert.ok(Array.isArray(current) && current.length === 2 && current.every(Number.isFinite), `invalid point at index ${index}`);
    twiceArea += current[0] * next[1] - next[0] * current[1];
  }
  return Math.abs(twiceArea) / 2;
}

function visiblePartitionRatio(visual) {
  const markup = book03Markup(visual);
  const parsePoints = (value) => value.trim().split(/\s+/u).map((point) => point.split(",").map(Number));
  const shaded = [...markup.matchAll(/<polygon class="partition-cell shade" points="([^"]+)"\/>/gu)]
    .map((match) => polygonArea(parsePoints(match[1])))
    .reduce((sum, area) => sum + area, 0);
  const outline = markup.match(/<polygon class="partition-outline" points="([^"]+)"\/>/u);
  assert.ok(outline, "partition outline is missing from learner visual");
  return shaded / polygonArea(parsePoints(outline[1]));
}

function evaluateFlatArithmetic(expression) {
  const compact = String(expression).replace(/\s+/gu, "").replace(/×/gu, "*");
  assert.match(compact, /^\d+(?:\*\d+)*(?:[+-]\d+(?:\*\d+)*)*$/u, `unsupported arithmetic expression ${expression}`);
  const terms = compact.match(/[+-]?[^+-]+/gu) || [];
  return terms.reduce((total, term) => {
    const sign = term.startsWith("-") ? -1 : 1;
    const unsigned = term.replace(/^[+-]/u, "");
    return total + sign * unsigned.split("*").map(Number).reduce((product, value) => product * value, 1);
  }, 0);
}

function collectBook3Visuals(value, path = "book", seen = new WeakSet(), result = []) {
  if (!value || typeof value !== "object" || seen.has(value)) return result;
  seen.add(value);
  if (value.kind === "book3") result.push({ path, visual: value });
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectBook3Visuals(entry, `${path}[${index}]`, seen, result));
  } else {
    for (const [key, entry] of Object.entries(value)) collectBook3Visuals(entry, `${path}.${key}`, seen, result);
  }
  return result;
}

function valueForSegments(x, y, z) {
  return { AB: x, BC: y, CD: z, AC: x + y, BD: y + z, AD: x + y + z };
}

function segmentCandidates(givens, answers) {
  const finiteValues = [...Object.values(givens), ...answers].map(Number).filter(Number.isFinite);
  const bound = Math.max(1, ...finiteValues);
  const candidates = [];
  for (let x = 1; x <= bound; x += 1) {
    for (let y = 1; y <= bound; y += 1) {
      for (let z = 1; z <= bound; z += 1) {
        const values = valueForSegments(x, y, z);
        if (Object.entries(givens).every(([key, value]) => value === "?" || Number(value) === values[key])) candidates.push(values);
      }
    }
  }
  return candidates;
}

function symbolForPart(part) {
  const byId = { circle: "○", square: "□", triangle: "△", diamond: "◇", star: "☆" };
  if (byId[part.id]) return byId[part.id];
  const label = String(part.label || "");
  if (label.includes("동그라미")) return "○";
  if (label.includes("네모")) return "□";
  if (label.includes("세모")) return "△";
  if (label.includes("마름모")) return "◇";
  if (label.includes("별")) return "☆";
  return null;
}

function rowValue(row, assignment) {
  return Number(row.map((cell) => SYMBOLS.has(cell) ? assignment[cell] : cell).join(""));
}

function solveCryptarithm(visual) {
  const rows = [...visual.addends, visual.sum];
  for (const row of rows) {
    assert.ok(Array.isArray(row) && row.length > 0, "cryptarithm row is empty");
    assert.ok(row.every((cell) => SYMBOLS.has(cell) || /^\d$/u.test(String(cell))), `cryptarithm has an unsupported cell in ${JSON.stringify(row)}`);
    assert.notEqual(row.length > 1 ? String(row[0]) : "", "0", "multi-digit number has a literal leading zero");
  }
  const symbols = [...new Set(rows.flat().filter((cell) => SYMBOLS.has(cell)))];
  assert.ok(symbols.length > 0 && symbols.length <= 5, `unsupported symbol count ${symbols.length}`);
  const leading = new Set(rows.filter((row) => row.length > 1 && SYMBOLS.has(row[0])).map((row) => row[0]));
  const solutions = [];

  function search(index, assignment, used) {
    if (index === symbols.length) {
      const addendTotal = visual.addends.reduce((sum, row) => sum + rowValue(row, assignment), 0);
      if (addendTotal === rowValue(visual.sum, assignment)) solutions.push({ ...assignment });
      return;
    }
    const symbol = symbols[index];
    for (let digit = 0; digit <= 9; digit += 1) {
      if (used.has(digit) || (digit === 0 && leading.has(symbol))) continue;
      assignment[symbol] = digit;
      used.add(digit);
      search(index + 1, assignment, used);
      used.delete(digit);
      delete assignment[symbol];
    }
  }

  search(0, {}, new Set());
  return { leading, solutions, symbols };
}

function selectedSum(weights, selected, label) {
  assert.ok(Array.isArray(selected), `${label}: selected indexes are missing`);
  assert.equal(new Set(selected).size, selected.length, `${label}: selected index repeats`);
  assert.ok(selected.every((index) => Number.isInteger(index) && index >= 0 && index < weights.length), `${label}: selected index is out of range`);
  return selected.reduce((sum, index) => sum + weights[index], 0);
}

function rref(equations, variables) {
  const matrix = equations.map(({ coefficients, rhs }) => [
    ...variables.map((variable) => coefficients.get(variable) || 0),
    rhs
  ]);
  const pivotRows = new Map();
  let nextRow = 0;
  for (let column = 0; column < variables.length && nextRow < matrix.length; column += 1) {
    let pivot = nextRow;
    while (pivot < matrix.length && Math.abs(matrix[pivot][column]) < EPSILON) pivot += 1;
    if (pivot === matrix.length) continue;
    [matrix[nextRow], matrix[pivot]] = [matrix[pivot], matrix[nextRow]];
    const divisor = matrix[nextRow][column];
    matrix[nextRow] = matrix[nextRow].map((value) => value / divisor);
    for (let row = 0; row < matrix.length; row += 1) {
      if (row === nextRow || Math.abs(matrix[row][column]) < EPSILON) continue;
      const factor = matrix[row][column];
      matrix[row] = matrix[row].map((value, index) => value - factor * matrix[nextRow][index]);
    }
    pivotRows.set(column, nextRow);
    nextRow += 1;
  }
  for (const row of matrix) {
    const zeroLeft = row.slice(0, variables.length).every((value) => Math.abs(value) < EPSILON);
    assert.ok(!zeroLeft || Math.abs(row[variables.length]) < EPSILON, "magic-line equations are inconsistent");
  }
  return { matrix, pivotRows };
}

function determinedObjective(model, coefficients) {
  const objective = model.variables.map((variable) => coefficients.get(variable) || 0);
  let value = 0;
  const freeCoefficients = [...objective];
  for (const [column, rowIndex] of model.pivotRows) {
    const weight = objective[column];
    if (Math.abs(weight) < EPSILON) continue;
    value += weight * model.matrix[rowIndex][model.variables.length];
    for (let free = 0; free < model.variables.length; free += 1) {
      if (model.pivotRows.has(free)) continue;
      freeCoefficients[free] -= weight * model.matrix[rowIndex][free];
    }
    freeCoefficients[column] = 0;
  }
  const undetermined = freeCoefficients.some((coefficient, index) => !model.pivotRows.has(index) && Math.abs(coefficient) >= EPSILON);
  return { determined: !undetermined, value };
}

function magicLines(visual, sourceLines) {
  if (Array.isArray(sourceLines) && sourceLines.length > 0) return sourceLines;
  const declared = visual.equalLines || visual.lines;
  if (Array.isArray(declared) && declared.length > 0) {
    return declared.map((line) => Array.isArray(line) ? line : line.indices);
  }
  assert.equal(visual.size, 3, "non-3x3 magic grid must declare equalLines");
  return [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
}

function buildMagicModel(visual, sourceLines, useVisibleLineSum = true) {
  assert.ok(Number.isInteger(visual.size) && visual.size >= 2, "magic grid size is invalid");
  assert.ok(Array.isArray(visual.shown), "magic grid cells are missing");
  assert.equal(visual.shown.length, visual.size * visual.size, "magic grid cell count does not match its size");
  const variables = new Set(["S"]);
  const termForCell = (index) => {
    const cell = visual.shown[index];
    if (cell == null) {
      const variable = `cell:${index}`;
      variables.add(variable);
      return { variable };
    }
    if (SYMBOLS.has(cell)) {
      const variable = `symbol:${cell}`;
      variables.add(variable);
      return { variable };
    }
    const value = Number(cell);
    assert.ok(Number.isFinite(value), `magic grid cell ${index} is invalid`);
    return { value };
  };
  const lines = magicLines(visual, sourceLines);
  const equations = lines.map((line, lineIndex) => {
    assert.ok(Array.isArray(line) && line.length >= 2, `magic line ${lineIndex + 1} is invalid`);
    assert.equal(new Set(line).size, line.length, `magic line ${lineIndex + 1} repeats a cell`);
    assert.ok(line.every((index) => Number.isInteger(index) && index >= 0 && index < visual.shown.length), `magic line ${lineIndex + 1} has an out-of-range cell`);
    const coefficients = new Map([["S", -1]]);
    let knownTotal = 0;
    for (const index of line) {
      const term = termForCell(index);
      if (term.variable) coefficients.set(term.variable, (coefficients.get(term.variable) || 0) + 1);
      else knownTotal += term.value;
    }
    return { coefficients, rhs: -knownTotal };
  });
  if (useVisibleLineSum && visual.lineSum != null) {
    const lineSum = Number(visual.lineSum);
    assert.ok(Number.isFinite(lineSum), "magic-grid lineSum is invalid");
    equations.push({ coefficients: new Map([["S", 1]]), rhs: lineSum });
  }
  const variableList = [...variables];
  const reduced = rref(equations, variableList);
  return { ...reduced, variables: variableList };
}

function magicStructureSignature(item) {
  const payload = {
    sourceNo: item.sourceNo,
    size: item.visual.size,
    shown: item.visual.shown,
    prompt: item.prompt
  };
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function magicTargetIds(item) {
  if (item.parts?.length) return item.parts.map((part) => part.id);
  if (item.prompt.includes("세모")) return ["triangle"];
  return ["answer"];
}

function assertSolutionSupportsAnswer(item, target) {
  const aliases = Array.isArray(target.answer) ? target.answer : [target.answer];
  const normalizedSolution = String(item.solution || "");
  const mentionsAlias = aliases.some((answer) => {
    const escaped = String(answer).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return new RegExp(`(?:^|\\D)${escaped}(?:\\D|$)`, "u").test(normalizedSolution);
  });
  assert.ok(mentionsAlias, `${target.label || target.id}: worked solution does not state the calculated result`);

  const singleShapeNames = {
    circle: "동그라미",
    square: "네모",
    triangle: "세모",
    diamond: "마름모",
    star: "별",
    answer: item.prompt.includes("세모") ? "세모" : ""
  };
  const shapeName = singleShapeNames[target.id] || "";
  if (!shapeName || String(target.label || "").includes("+")) return;
  const statedValues = [...normalizedSolution.matchAll(new RegExp(`${shapeName}\\s*(?:=|은|는)\\s*(\\d+)`, "gu"))].map((match) => Number(match[1]));
  assert.ok(statedValues.length > 0, `${shapeName}: worked solution does not bind the shape to a value`);
  const expected = numericAnswer(target.answer, `${item.id}/${target.id}`);
  assert.ok(statedValues.every((value) => value === expected), `${shapeName}: worked solution states a conflicting value ${statedValues.join(", ")}`);
}

function magicObjectiveForPart(part) {
  if (part.id === "first") return null;
  if (part.id === "sum" || String(part.label).includes("한 줄의 합")) return new Map([["S", 1]]);
  const coefficients = new Map();
  const idSymbol = symbolForPart(part);
  if (idSymbol && !String(part.label || "").includes("+")) coefficients.set(`symbol:${idSymbol}`, 1);
  const label = String(part.label || "");
  for (const [name, glyph] of [["동그라미", "○"], ["네모", "□"], ["세모", "△"], ["마름모", "◇"], ["별", "☆"]]) {
    if (label.includes(name)) coefficients.set(`symbol:${glyph}`, 1);
  }
  return coefficients.size ? coefficients : null;
}

const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-03");
assert.ok(book, "book-03 is missing");
const lessons = new Map(book.lessons.map((lesson) => [lesson.id, lesson]));

audit("Book 3 lesson order and counts", () => {
  assert.deepEqual(book.lessons.map((lesson) => lesson.id), EXPECTED_LESSONS.map(([id]) => id), "Book 3 lesson order changed");
  assert.deepEqual(book.lessons.map((lesson) => lesson.original.items.length), EXPECTED_LESSONS.map(([, count]) => count), "Book 3 per-lesson source counts changed");
  assert.equal(book.lessons.reduce((sum, lesson) => sum + lesson.original.items.length, 0), 144, "Book 3 released source total must be 144");
  assert.equal(book.source?.verified, true, "Book 3 source is not marked verified");
});

audit("Book 3 source-page coverage", () => {
  const coveredPages = BOOK03_GOLDEN_BELL_SOURCE_PAGES.flatMap((entry) => entry.pages);
  assert.deepEqual([...coveredPages].sort((a, b) => a - b), EXPECTED_PAGES, "Book 3 must cover the 26 learning slides exactly");
  assert.equal(new Set(coveredPages).size, coveredPages.length, "a Book 3 source slide is assigned more than once");
  assert.deepEqual(BOOK03_GOLDEN_BELL_SOURCE_PAGES.map((entry) => entry.lessonId), EXPECTED_LESSONS.map(([id]) => id), "source coverage lesson order changed");
  for (const entry of BOOK03_GOLDEN_BELL_SOURCE_PAGES) assert.match(entry.status, /^implemented/u, `${entry.lessonId}: source status is not releasable`);
});

audit("Book 3 source holds", () => {
  const holds = book.lessons.filter((lesson) => lesson.sourceHold);
  assert.deepEqual(holds.map((lesson) => lesson.id), ["fraction-shading", "basic-vertical-cryptarithm", "magic-square-targets"], "unexpected Book 3 source hold");
  assert.equal(holds.reduce((sum, lesson) => sum + Number(lesson.sourceHold.itemCount || 0), 0), 6, "Book 3 must retain exactly six held source items");
  for (const lesson of holds) assert.match(lesson.sourceHold.reason, /(?:단일 정답|충돌)/u, `${lesson.id}: source hold does not explain why release is blocked`);
  assert.equal(BOOK03_GOLDEN_BELL_SOURCE_PAGES.reduce((sum, entry) => sum + Number(entry.holdCount || 0), 0), 6, "source coverage hold count differs");
});

audit("slide 8 fraction source structure", () => {
  const lesson = lessons.get("fraction-shading");
  const items = new Map(lesson.original.items.map((item) => [item.id, item]));
  assert.equal(items.has("fraction-7"), false, "contradictory slide 8 item (1) must stay held");
  assert.equal(items.has("fraction-14"), false, "contradictory slide 8 item (8) must stay held");
  assert.equal(items.has("fraction-15"), false, "contradictory slide 8 item (9) must stay held");
  assert.deepEqual(items.get("fraction-8").visual.shadedIndices, [0, 4, 8], "3 by 3 diagonal shading changed");
  assert.deepEqual(items.get("fraction-9").visual.shadedIndices, [0, 3, 5, 10, 12, 15], "4 by 4 source shading changed");
  assert.deepEqual(items.get("fraction-10").visual.shadedIndices, [0, 2, 4, 7, 11, 13, 17, 20, 22, 24], "5 by 5 source shading changed");
  assert.deepEqual(items.get("fraction-11").visual.shadedIndices, [1], "three-part triangle shading changed");
  assert.deepEqual(items.get("fraction-12").visual.shadedIndices, [0, 1, 2], "four-part triangle shading changed");
  assert.deepEqual(items.get("fraction-13").visual.shadedIndices, [1, 4], "six-part triangle shading changed");
  assert.equal(items.get("fraction-17").visual.template, "square-eight", "eight-triangle square source renderer changed");
  assert.equal(items.get("fraction-18").visual.template, "square-sixteen", "sixteen-triangle square source renderer changed");
  for (const [id, expectedShaded] of [["fraction-17", 3], ["fraction-18", 6]]) {
    const markup = book03Markup(items.get(id).visual);
    assert.equal((markup.match(/partition-cell shade/gu) || []).length, expectedShaded, `${id}: visible shaded-region count changed`);
    assert.doesNotMatch(markup, /(?:3\/8|6\/16)/u, `${id}: source visual leaks its answer`);
  }
});

audit("slide 7 circle source shading direction", () => {
  const items = lessons.get("fraction-shading").original.items.slice(0, 6);
  for (const item of items) {
    const { parts, shaded, shadedIndices } = item.visual;
    assert.deepEqual(shadedIndices, Array.from({ length:shaded }, (_, offset) => parts - shaded + offset), `${item.id}: source circle shading direction changed`);
    const markup = book03Markup(item.visual);
    assert.doesNotMatch(markup.match(/<path[^>]+>/u)?.[0] || "", / shade/u, `${item.id}: source white sector at twelve o'clock was colored`);
  }
});

const partitionLesson = lessons.get("equal-partition-fractions");
for (const item of partitionLesson.original.items) {
  audit(`${item.id} visible equal-part ratio`, () => {
    const [numerator, denominator] = canonical(Array.isArray(item.answer) ? item.answer[0] : item.answer).split("/").map(Number);
    assert.ok(Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0, "fraction answer cannot be parsed");
    const visibleRatio = visiblePartitionRatio(item.visual);
    assert.ok(Math.abs(visibleRatio - numerator / denominator) < 1e-4, `visible shaded ratio ${visibleRatio} differs from ${numerator}/${denominator}`);
  });
}
audit("reviewed 1/12 and 1/18 subdivision structures", () => {
  const twelfth = partitionLesson.original.items.find((item) => item.id === "partition-3");
  const eighteenth = partitionLesson.original.items.find((item) => item.id === "partition-9");
  assert.equal(twelfth.visual.template, "source-triangle-twelfth", "slide 9 item (3) template changed");
  assert.equal(eighteenth.visual.template, "source-solid-eighteenth", "slide 10 item (5) template changed");
  assert.equal(canonical(twelfth.answer), "1/12", "slide 9 item (3) answer changed");
  assert.equal(canonical(eighteenth.answer), "1/18", "slide 10 item (5) answer changed");
  assert.match(book03Markup(partitionLesson.original.items.find((item) => item.id === "partition-2").visual), /partition-cell shade" points="110\.00,12\.00 110\.00,94\.00 156\.00,94\.00/u, "slide 9 item (2) source right-half shading changed");
  assert.match(book03Markup(twelfth.visual), /partition-cell shade" points="110\.00,12\.00 110\.00,66\.67 156\.00,94\.00/u, "slide 9 item (3) source right-third shading changed");
  assert.match(book03Markup(partitionLesson.original.items.find((item) => item.id === "partition-8").visual), /partition-cell shade" points="60\.00,178\.00 160\.00,178\.00 85\.00,138\.00/u, "slide 10 item (4) source small shaded region changed");
  assert.match(book03Markup(eighteenth.visual), /partition-cell shade" points="60\.00,178\.00 160\.00,178\.00 110\.00,151\.33/u, "slide 10 item (5) one-of-eighteen region changed");
});

const allIds = new Set();
const allSourceNumbers = new Set();
for (const [lessonId, expectedCount] of EXPECTED_LESSONS) {
  const lesson = lessons.get(lessonId);
  audit(`${lessonId} metadata`, () => {
    assert.ok(lesson, "lesson is missing");
    assert.equal(lesson.original.mode, "paged", "source questions must use per-question pages");
    assert.equal(lesson.original.items.length, expectedCount, "source item count changed");
    assert.equal(lesson.original.sourceQuestionCount, expectedCount, "declared source count differs");
    assert.ok(lesson.sourceLocator?.trim(), "lesson source locator is missing");
    assert.ok(Array.isArray(lesson.sourceTypeIds) && lesson.sourceTypeIds.length > 0, "source type IDs are missing");
    assert.ok(lesson.representativeConcept?.trim().length >= 20, "representative concept is too short");
  });
  if (!lesson) continue;

  for (const item of lesson.original.items) {
    audit(`${lessonId}/${item.id || "missing-id"} source contract`, () => {
      assert.ok(item.id?.trim(), "item ID is missing");
      assert.ok(!allIds.has(item.id), `duplicate item ID ${item.id}`);
      allIds.add(item.id);
      assert.ok(item.sourceNo?.trim(), "source number is missing");
      assert.ok(!allSourceNumbers.has(item.sourceNo), `duplicate source number ${item.sourceNo}`);
      allSourceNumbers.add(item.sourceNo);
      assert.ok(item.sourceLocator?.trim(), "source locator is missing");
      assert.ok(item.typeLabel?.trim(), "type label is missing");
      assert.ok(item.prompt?.trim().length >= 10, "problem prompt is missing");
      assert.ok(item.solution?.trim().length >= 24, "worked solution is missing or too short");
      assert.ok(Number.isInteger(item.printGroup) && item.printGroup > 0, "printGroup must be a positive integer");
      assert.equal(item.visual?.kind, "book3", "Book 3 visual data is missing");

      if (item.parts != null) {
        assert.ok(Array.isArray(item.parts) && item.parts.length > 0, "answer parts are empty");
        assert.equal(new Set(item.parts.map((part) => part.id)).size, item.parts.length, "answer-part IDs repeat");
        for (const part of item.parts) {
          assert.ok(part.id?.trim() && part.label?.trim(), "answer part ID or label is missing");
          validateAnswerValue(part.answer, `${item.id}/${part.id}`, part.inputMode || "numeric");
        }
      } else if (item.options != null) {
        assert.ok(Array.isArray(item.options) && item.options.length >= 2, "choice list is incomplete");
        const choices = item.options.map(canonical);
        assert.equal(new Set(choices).size, choices.length, "choices repeat");
        assert.equal(choices.filter((choice) => choice === canonical(item.answer)).length, 1, "approved choice is not unique");
      } else {
        assert.equal(item.answerMode, "input", "source question needs its own input");
        assert.ok(["numeric", "text"].includes(item.inputMode), `unsupported input mode ${item.inputMode}`);
        validateAnswerValue(item.answer, item.id, item.inputMode);
      }
    });
  }

  audit(`${lessonId} print grouping`, () => {
    const groups = [...new Set(lesson.original.items.map((item) => item.printGroup))].sort((a, b) => a - b);
    assert.deepEqual(groups, Array.from({ length: groups.length }, (_, index) => index + 1), "print groups are not contiguous");
    const maxPerGroup = CRYPTARITHM_LESSONS.has(lessonId) || lessonId === "magic-square-targets" ? 1 : 2;
    for (const group of groups) {
      assert.ok(lesson.original.items.filter((item) => item.printGroup === group).length <= maxPerGroup, `print group ${group} exceeds ${maxPerGroup} items`);
    }
  });
}

const book3Visuals = collectBook3Visuals(book);
for (const { path, visual } of book3Visuals) {
  audit(`${path} renderer`, () => {
    const markup = book03Markup(visual);
    assert.ok(markup.trim().length >= 40, `${visual.subtype}: renderer returned blank or trivial output`);
    assert.doesNotMatch(markup, /(?:undefined|NaN|Infinity)/u, `${visual.subtype}: renderer emitted an invalid value`);
    assert.match(markup, /(?:role="img"|<svg|class=)/u, `${visual.subtype}: renderer emitted no visible structure`);
  });
}

const areaLesson = lessons.get("unit-area-shapes");
const shoelaceItems = areaLesson.original.items.filter((item) => item.visual.subtype === "area-grid-composite");
audit("unit-area shoelace coverage", () => assert.equal(shoelaceItems.length, 10, "expected ten source polygons"));
for (const item of shoelaceItems) {
  audit(`${item.id} shoelace area`, () => {
    const calculated = item.visual.polygons.reduce((sum, polygon) => sum + polygonArea(polygon), 0);
    assert.ok(Math.abs(calculated - numericAnswer(item.answer, item.id)) < EPSILON, `shoelace area ${calculated} differs from answer ${canonical(item.answer)}`);
  });
}
audit("alternating-area progression", () => {
  const item = areaLesson.original.items.find((candidate) => candidate.id === "alternating-area-seventh");
  const expected = item.visual.stages[0] * (2 ** (item.visual.target - 1));
  assert.equal(numericAnswer(item.answer, item.id), expected, "doubling-area target is wrong");
});

const sixLesson = lessons.get("six-multiple-equations");
for (const item of sixLesson.original.items) {
  audit(`${item.id} equivalent expression`, () => {
    const expression = item.visual.expression;
    assert.equal((expression.match(/□/gu) || []).length, 1, "equation must contain exactly one answer blank");
    const [left, right, ...extra] = expression.replace("□", canonical(item.answer)).split("=");
    assert.ok(left && right && extra.length === 0, "equation must contain exactly one equals sign");
    assert.equal(evaluateFlatArithmetic(left), evaluateFlatArithmetic(right), `equation is false after substituting ${canonical(item.answer)}`);
  });
}

const tapeLesson = lessons.get("tape-length-midpoints");
for (const item of tapeLesson.original.items) {
  audit(`${item.id} tape or midpoint math`, () => {
    if (item.visual.subtype === "folded-tape-source") {
      const points = item.visual.points;
      assert.ok(Array.isArray(points) && points.length >= 2, "folded tape needs at least two points");
      let length = 0;
      for (let index = 1; index < points.length; index += 1) {
        const [beforeX,beforeY] = points[index - 1];
        const [afterX,afterY] = points[index];
        assert.ok([beforeX,beforeY,afterX,afterY].every(Number.isFinite), "folded-tape point is invalid");
        assert.ok(beforeX === afterX || beforeY === afterY, "folded-tape segment must follow the source grid");
        length += Math.abs(afterX - beforeX) + Math.abs(afterY - beforeY);
      }
      assert.equal(numericAnswer(item.answer, item.id), length, "folded-tape path length is wrong");
      return;
    }
    const { left, right, target } = item.visual;
    assert.ok(Number.isFinite(left) && Number.isFinite(right) && right > left, "number-line endpoints are invalid");
    const expected = target === "middle" ? (left + right) / 2 : right - left;
    assert.equal(numericAnswer(item.answer, item.id), expected, `${target} calculation is wrong`);
  });
}

const distanceLesson = lessons.get("overlapping-distance");
const routeEndpoints = new Map([
  ["route-fields-station", ["필즈", "역"]],
  ["route-home-super", ["집", "슈퍼"]],
  ["route-super-fields", ["슈퍼", "필즈"]]
]);
for (const item of distanceLesson.original.items.filter((candidate) => candidate.visual.subtype === "distance-chain-source")) {
  audit(`${item.id} route distance`, () => {
    const { labels, positions, spans } = item.visual;
    assert.equal(labels.length, positions.length, "route labels and positions differ");
    assert.ok(positions.every(Number.isFinite), "route position is not finite");
    assert.ok(positions.every((value, index) => index === 0 || value > positions[index - 1]), "route positions are not strictly increasing");
    for (const span of spans) {
      const shown = Number(String(span.label).match(/\d+(?:\.\d+)?/u)?.[0]);
      assert.ok(Number.isFinite(shown), `span ${span.label} has no numeric length`);
      assert.equal(Math.abs(positions[span.to] - positions[span.from]), shown, `span ${span.label} disagrees with its endpoints`);
    }
    const [fromLabel, toLabel] = routeEndpoints.get(item.id) || [];
    assert.ok(fromLabel && toLabel, "route endpoint contract is missing");
    const from = labels.indexOf(fromLabel);
    const to = labels.indexOf(toLabel);
    assert.ok(from >= 0 && to >= 0, `route is missing ${fromLabel} or ${toLabel}`);
    assert.equal(numericAnswer(item.answer, item.id), Math.abs(positions[to] - positions[from]), "route answer disagrees with visible positions");
  });
}

for (const item of distanceLesson.original.items.filter((candidate) => candidate.visual.subtype === "segment-chain")) {
  audit(`${item.id} segment uniqueness`, () => {
    const answerNumbers = item.parts.map((part) => numericAnswer(part.answer, `${item.id}/${part.id}`));
    const candidates = segmentCandidates(item.visual.givens, answerNumbers);
    assert.ok(candidates.length > 0, "no positive-integer segment arrangement satisfies the givens");
    const targetKeys = item.parts.map((part) => String(part.label).toUpperCase().replace(/\s+/gu, ""));
    assert.ok(targetKeys.every((key) => ["AB", "BC", "CD", "AD"].includes(key)), "unsupported requested segment");
    const possibleAnswers = new Set(candidates.map((candidate) => JSON.stringify(targetKeys.map((key) => candidate[key]))));
    assert.equal(possibleAnswers.size, 1, `visible givens allow ${possibleAnswers.size} different target tuples`);
    assert.ok(candidates.some((candidate) => targetKeys.every((key, index) => candidate[key] === answerNumbers[index])), "published answer does not satisfy the visible givens");
  });
}

const multipleLesson = lessons.get("multiple-comparison");
for (const item of multipleLesson.original.items) {
  audit(`${item.id} multiple math`, () => {
    const visual = item.visual;
    if (visual.subtype === "multiple-model") {
      assert.ok(Number.isInteger(visual.baseUnits) && visual.baseUnits > 0 && Number.isInteger(visual.compareUnits), "multiple model units are invalid");
      assert.equal(numericAnswer(item.answer, item.id), visual.compareUnits / visual.baseUnits, "multiple ratio is wrong");
      return;
    }
    if (visual.subtype === "number-line") {
      assert.ok(Number.isInteger(visual.divisions) && visual.divisions > 0, "number-line divisions are invalid");
      const promptEndpoints = item.prompt.match(/(\d+)\s*부터\s*(\d+)\s*까지/u);
      assert.ok(promptEndpoints, "number-line prompt does not expose both endpoints");
      assert.equal(visual.left, Number(promptEndpoints[1]), "prompt and visual left endpoint differ");
      assert.equal(visual.right, Number(promptEndpoints[2]), "prompt and visual right endpoint differ");
      assert.equal(numericAnswer(item.answer, item.id), (visual.right - visual.left) / visual.divisions, "one-interval answer is wrong");
      return;
    }
    assert.equal(visual.subtype, "ratio-bars", `unexpected multiple visual ${visual.subtype}`);
    assert.ok(Number.isInteger(visual.topUnits) && visual.topUnits > 0 && Number.isInteger(visual.bottomUnits) && visual.bottomUnits > 0, "ratio-bar units are invalid");
    if (!item.parts) {
      if (item.prompt.includes("몇 배")) {
        assert.equal(numericAnswer(item.answer, item.id), visual.topUnits / visual.bottomUnits, "bar multiple is wrong");
        return;
      }
      const topGiven = Number(String(visual.given || "").match(/ㄱ\s*=\s*(\d+(?:\.\d+)?)\s*cm/u)?.[1]);
      const bottomGiven = Number(String(visual.given || "").match(/ㄴ\s*=\s*(\d+(?:\.\d+)?)\s*cm/u)?.[1]);
      assert.ok(Number.isFinite(topGiven) || Number.isFinite(bottomGiven), "single-answer bar question has no visible given length");
      const expected = Number.isFinite(topGiven)
        ? topGiven / visual.topUnits * visual.bottomUnits
        : bottomGiven / visual.bottomUnits * visual.topUnits;
      assert.equal(numericAnswer(item.answer, item.id), expected, "other bar length is wrong");
      return;
    }
    const total = Number(item.prompt.match(/전체가\s*(\d+(?:\.\d+)?)\s*cm/u)?.[1]);
    assert.ok(Number.isFinite(total), "two-part bar question has no visible total length");
    const unit = total / (visual.topUnits + visual.bottomUnits);
    const answers = new Map(item.parts.map((part) => [part.id, numericAnswer(part.answer, `${item.id}/${part.id}`)]));
    assert.equal(answers.get("ga"), visual.topUnits * unit, "top bar length is wrong");
    assert.equal(answers.get("na"), visual.bottomUnits * unit, "bottom bar length is wrong");
  });
}

for (const lessonId of CRYPTARITHM_LESSONS) {
  for (const item of lessons.get(lessonId).original.items) {
    audit(`${item.id} cryptarithm`, () => {
      assert.equal(item.visual.subtype, "cryptarithm-board", "cryptarithm visual subtype changed");
      const solved = solveCryptarithm(item.visual);
      assert.ok(solved.solutions.length > 0, "cryptarithm has no solution under distinct-symbol and leading-zero rules");
      if (item.parts?.length) {
        const provided = new Map();
        for (const part of item.parts) {
          const symbol = symbolForPart(part);
          assert.ok(symbol, `${part.id}: answer part cannot be mapped to a shape`);
          const digit = numericAnswer(part.answer, `${item.id}/${part.id}`);
          assert.ok(Number.isInteger(digit) && digit >= 0 && digit <= 9, `${part.id}: shape value must be one digit`);
          provided.set(symbol, digit);
        }
        assert.deepEqual(new Set(provided.keys()), new Set(solved.symbols), "answer parts do not cover every visible symbol exactly once");
        assert.equal(new Set(provided.values()).size, provided.size, "different symbols use the same digit");
        for (const symbol of solved.leading) assert.notEqual(provided.get(symbol), 0, `${symbol}: leading symbol is zero`);
        const addendTotal = item.visual.addends.reduce((sum, row) => sum + rowValue(row, Object.fromEntries(provided)), 0);
        assert.equal(addendTotal, rowValue(item.visual.sum, Object.fromEntries(provided)), "published substitution does not satisfy the addition");
        assert.equal(solved.solutions.length, 1, `cryptarithm has ${solved.solutions.length} valid assignments`);
        assert.ok(solved.symbols.every((symbol) => solved.solutions[0][symbol] === provided.get(symbol)), "published assignment differs from the unique solution");
        return;
      }
      const answer = numericAnswer(item.answer, item.id);
      if (solved.symbols.length === 1) {
        assert.equal(solved.solutions.length, 1, `single-symbol cryptarithm has ${solved.solutions.length} assignments`);
        assert.equal(answer, solved.solutions[0][solved.symbols[0]], "single-symbol answer is wrong");
        return;
      }
      assert.match(item.prompt, /가장 큰/u, "multi-symbol scalar answer must explicitly ask for a maximum");
      const target = item.visual.sum[0];
      assert.ok(SYMBOLS.has(target), "maximum target is not the leading result symbol");
      assert.equal(answer, Math.max(...solved.solutions.map((solution) => solution[target])), "maximum leading digit is wrong");
    });
  }
}

const magicCardLesson = lessons.get("magic-card-binary");
const binaryOwners = [
  ...magicCardLesson.original.items.filter((item) => item.visual.subtype === "binary-strip"),
  magicCardLesson.extension,
  ...(magicCardLesson.similarPractice || []).filter((item) => item.visual?.subtype === "binary-strip")
];
for (const owner of binaryOwners) {
  audit(`${owner.id || "magic-card-extension"} binary-card sum`, () => {
    const visual = owner.visual;
    const blankPart = owner.parts?.find((part) => part.id === "blank");
    const weights = visual.weights.map((weight) => weight === "?" ? numericAnswer(blankPart?.answer, `${owner.id}/blank`) : Number(weight));
    assert.ok(weights.every((weight) => Number.isInteger(weight) && weight > 0), "binary-card weights must be positive integers");
    const ascending = [...weights].sort((a, b) => a - b);
    assert.equal(ascending[0], 1, "binary-card sequence must start at 1");
    for (let index = 1; index < ascending.length; index += 1) {
      assert.equal(ascending[index], ascending.slice(0, index).reduce((sum, value) => sum + value, 0) + 1, "binary-card weights do not cover every integer without gaps");
    }
    const selected = selectedSum(weights, visual.selected || [], owner.id || "extension");
    if (visual.target != null) assert.equal(selected, Number(visual.target), "selected card sum differs from target");
    const maximumPart = owner.parts?.find((part) => part.id === "maximum");
    if (maximumPart) assert.equal(numericAnswer(maximumPart.answer, `${owner.id}/maximum`), weights.reduce((sum, value) => sum + value, 0), "maximum card value is wrong");
    if (!owner.parts && visual.target == null && visual.selected?.length === weights.length) {
      assert.equal(numericAnswer(owner.answer, owner.id), weights.reduce((sum, value) => sum + value, 0), "all-card maximum is wrong");
    }
  });
}

for (const item of magicCardLesson.original.items.filter((candidate) => candidate.visual.subtype === "star-code")) {
  audit(`${item.id} star-card sum`, () => {
    const weights = [1, 2, 4, 8, 16];
    assert.equal(selectedSum(weights, item.visual.selected, item.id), Number(item.visual.center), "selected star wedges do not make the target");
    for (const alias of Array.isArray(item.answer) ? item.answer : [item.answer]) {
      assert.match(String(alias).replace(/\s+/gu, ""), /^\d+(?:\+\d+)+$/u, "star answer must be an addition expression");
      assert.equal(String(alias).split("+").map(Number).reduce((sum, value) => sum + value, 0), Number(item.visual.center), "star answer expression is wrong");
    }
  });
}

for (const item of magicCardLesson.original.items.filter((candidate) => candidate.visual.subtype === "cell-code")) {
  audit(`${item.id} cell-card sum`, () => {
    const visual = item.visual;
    assert.equal(visual.weights.length, visual.rows * visual.columns, "cell-card dimensions and weights differ");
    assert.ok(visual.weights.every((weight) => Number.isInteger(weight) && weight > 0), "cell-card weight is invalid");
    assert.equal(selectedSum(visual.weights, visual.colored, item.id), Number(visual.target), "colored cells do not make the target");
    assert.equal(numericAnswer(item.answer, item.id), Number(visual.target), "cell-card answer differs from target");
    for (const [index, example] of (visual.examples || []).entries()) {
      assert.equal(selectedSum(visual.weights, example.colored, `${item.id}/example-${index + 1}`), Number(example.value), `example ${index + 1} sum is wrong`);
    }
  });
}

const magicLesson = lessons.get("magic-square-targets");
for (const item of magicLesson.original.items) {
  audit(`${item.id} reviewed-source cells and prompt`, () => {
    assert.equal(item.visual.subtype, "magic-grid", "magic-grid visual subtype changed");
    const sourceLines = MAGIC_SOURCE_LINES.get(item.id);
    const expectedSignature = MAGIC_SOURCE_SIGNATURES.get(item.id);
    assert.ok(sourceLines && expectedSignature, "private-source structure contract is missing");
    assert.equal(magicStructureSignature(item), expectedSignature, "learner-visible cells, layout, or prompt differs from the reviewed source structure");
  });

  audit(`${item.id} reviewed-source targets`, () => {
    const expectedTargets = MAGIC_SOURCE_TARGETS.get(item.id);
    assert.ok(expectedTargets, "private-source target contract is missing");
    assert.deepEqual(magicTargetIds(item), expectedTargets, "question targets differ from the reviewed source");
  });

  audit(`${item.id} learner answer visibility`, () => {
    const expectedTargets = MAGIC_SOURCE_TARGETS.get(item.id);
    assert.ok(expectedTargets, "private-source target contract is missing");
    if (expectedTargets.includes("sum")) assert.equal(item.visual.lineSum, undefined, "learner visual exposes the line-sum answer");
  });

  audit(`${item.id} magic-line sums and solution`, () => {
    const sourceLines = MAGIC_SOURCE_LINES.get(item.id);
    const expectedTargets = MAGIC_SOURCE_TARGETS.get(item.id);
    assert.ok(sourceLines && expectedTargets, "private-source math contract is missing");
    const model = buildMagicModel(item.visual, sourceLines, !expectedTargets.includes("sum"));
    const targets = item.parts || [{ id: "answer", label: item.prompt.includes("세모") ? "세모" : "", answer: item.answer }];
    let modeledTargets = 0;
    for (const target of targets) {
      const objective = magicObjectiveForPart(target);
      if (!objective) {
        assert.equal(target.id, "first", `cannot model target ${target.id}`);
        assertSolutionSupportsAnswer(item, target);
        continue;
      }
      modeledTargets += 1;
      for (const variable of objective.keys()) assert.ok(model.variables.includes(variable), `${target.label}: target symbol is not visible in the grid`);
      const result = determinedObjective(model, objective);
      assert.equal(result.determined, true, `${target.label}: visible equal-line data does not determine one answer`);
      assert.ok(Math.abs(result.value - numericAnswer(target.answer, `${item.id}/${target.id}`)) < EPSILON, `${target.label}: calculated value ${result.value} differs from answer ${canonical(target.answer)}`);
      assertSolutionSupportsAnswer(item, target);
    }
    assert.ok(modeledTargets > 0, "magic-grid item has no auditable target");
  });
}

audit("public source privacy boundary", () => {
  const publicFiles = [
    new URL("./golden-bell-book03-source.js", import.meta.url),
    new URL("./book03-renderers.js", import.meta.url)
  ];
  const serialized = JSON.stringify({ source: book.source, coverage: book.sourceCoverage, lessons: book.lessons });
  const forbiddenPath = /(?:[A-Z]:[\\/]|\\\\[^\\\r\n]+\\)/iu;
  const forbiddenAsset = /\.(?:pptx?|pdf|png|jpe?g|webp|tiff?)\b/iu;
  const forbiddenAnswerAsset = /(?:공식\s*답안|원본\s*답안|정답\s*파일|(?:official|original)[-_ ]?answer|answer[-_ ]?key)/iu;
  for (const file of publicFiles) {
    const contents = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(contents, forbiddenPath, `${file.pathname}: private filesystem path leaked`);
    assert.doesNotMatch(contents, forbiddenAsset, `${file.pathname}: private source asset name leaked`);
    assert.doesNotMatch(contents, forbiddenAnswerAsset, `${file.pathname}: original answer asset reference leaked`);
  }
  assert.doesNotMatch(serialized, forbiddenPath, "Book 3 public data contains a private filesystem path");
  assert.doesNotMatch(serialized, forbiddenAsset, "Book 3 public data contains a private source asset name");
  assert.doesNotMatch(serialized, forbiddenAnswerAsset, "Book 3 public data contains an original answer asset reference");
});

const releasedSourceItems = book.lessons.reduce((sum, lesson) => sum + lesson.original.items.length, 0);
const heldSourceItems = book.lessons.reduce((sum, lesson) => sum + Number(lesson.sourceHold?.itemCount || 0), 0);
if (failures.length > 0) {
  console.error(`BOOK03_GOLDEN_BELL_SOURCE_FAILED failures=${failures.length} lessons=${book.lessons.length} sourceItems=${releasedSourceItems} held=${heldSourceItems} visuals=${book3Visuals.length}`);
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`BOOK03_GOLDEN_BELL_SOURCE_OK lessons=${book.lessons.length} sourceItems=${releasedSourceItems} pages=${EXPECTED_PAGES.length} held=${heldSourceItems} visuals=${book3Visuals.length}`);
}
