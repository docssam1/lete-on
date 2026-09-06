import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { book08Markup } from "./book08-renderers.js";

const [normalizedPath, p3ImagePath, p4ImagePath] = process.argv.slice(2);
assert.ok(normalizedPath && p3ImagePath && p4ImagePath, "Usage: <book08-normalized.json> <page3-image> <page4-image>");

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const outsideRepo = (name) => {
  const part = relative(repoRoot, resolve(name));
  return part.startsWith("..") || isAbsolute(part);
};
assert.ok(outsideRepo(normalizedPath), "The normalized recovery file must stay private");
assert.ok(outsideRepo(p3ImagePath) && outsideRepo(p4ImagePath), "Source renders must stay private");

const normalized = JSON.parse((await readFile(normalizedPath, "utf8")).replace(/^\uFEFF/, ""));
const learnerStage = "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정";
const sourceFingerprint = "0CD7AB1817A4DFCCAF9A3F1756C484CDC9BA37A3B5173A2F033C7A783B1A692D";
const expectedImageHashes = {
  [resolve(p3ImagePath)]: "E339B42118AF899E9C747B41C63187B27453C6E15F161579BB54855D3BCA8581",
  [resolve(p4ImagePath)]: "A56B47EEA8322F4585FBBE72064CAADC678B59A8550F17B0523FBA182D9A5CE6"
};

async function hashFile(filename) {
  const buffer = await readFile(filename);
  return createHash("sha256").update(buffer).digest("hex").toUpperCase();
}

for (const [filename, expected] of Object.entries(expectedImageHashes)) {
  assert.equal(await hashFile(filename), expected, `Source render changed: ${filename}`);
}

assert.equal(normalized.bookId, "book-08");
assert.deepEqual(normalized.updates.map((update) => update.lessonId), ["addition-sum-matrix", "shape-equation-targets"]);
assert.deepEqual(normalized.updates.map((update) => update.appendItems.length), [4, 4]);

function assertLearnerFit(item) {
  assert.equal(item.learnerFit.learner_stage, learnerStage);
  for (const field of ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]) {
    assert.equal(typeof item.learnerFit[field], "string");
    assert.ok(item.learnerFit[field].trim(), `Missing learner-fit ${field}`);
  }
}

function assertItemShape(item) {
  for (const field of ["id", "sourceNo", "sourceLocator", "typeLabel", "prompt", "solution", "answer"]) {
    assert.equal(typeof item[field], "string", `Missing ${field}`);
    assert.ok(item[field].trim(), `Empty ${field}`);
  }
  assert.equal(item.answerMode, "input");
  assert.equal(item.inputMode, "numeric");
  assert.equal(item.parts, undefined, "Intermediate shape values must not become extra inputs");
  assert.ok(item.solution.length >= 40, `Worked solution is too short for ${item.id}`);
  assertLearnerFit(item);
  assert.ok(outsideRepo(item.evidence.sourcePath), "Evidence source path must stay private");
  assert.ok(outsideRepo(item.evidence.renderedSourceImage), "Evidence render path must stay private");
  assert.equal(item.evidence.fingerprint, sourceFingerprint);
  assert.ok(item.evidence.officialAnswer);
  assert.ok(!JSON.stringify(item.visual).includes("48g"), "Teacher worked example must not become a learner target");
}

function solveLinearSystem(item) {
  const symbols = [...new Set(item.visual.cells.flat().filter((value) => /[△□○☆]/u.test(value)))];
  const equations = [];
  const addEquation = (values, total) => {
    const counts = Object.fromEntries(symbols.map((symbol) => [symbol, values.filter((value) => value === symbol).length]));
    equations.push({ counts, total: Number(total) });
  };
  item.visual.cells.forEach((row, index) => addEquation(row, item.visual.rowTotals[index]));
  item.visual.columnTotals.forEach((total, columnIndex) => {
    if (total !== null) addEquation(item.visual.cells.map((row) => row[columnIndex]), total);
  });
  const solutions = [];
  for (let triangle = 0; triangle <= 20; triangle += 1) {
    for (let square = 0; square <= 20; square += 1) {
      for (let circle = 0; circle <= 20; circle += 1) {
        for (let star = 0; star <= 20; star += 1) {
          const values = { "△": triangle, "□": square, "○": circle, "☆": star };
          if (equations.every(({ counts, total }) => Object.entries(counts).reduce((sum, [symbol, count]) => sum + values[symbol] * count, 0) === total)) {
            solutions.push(values);
          }
        }
      }
    }
  }
  assert.equal(solutions.length, 1, `Matrix must have one solution: ${item.id}`);
  return solutions[0];
}

const matrixItems = normalized.updates[0].appendItems;
for (const item of matrixItems) {
  assertItemShape(item);
  assert.equal(item.visual.kind, "book8");
  assert.equal(item.visual.subtype, "source-sum-matrix");
  assert.equal(item.visual.target, "?");
  assert.equal(item.sourceLocator, "교사용 화면 3");
  assert.match(item.sourceNo, /^\(\d+\)$/u);
  assert.equal(item.visual.rowTotals.length, 4);
  assert.equal(item.visual.columnTotals.length, 4);
  assert.equal(item.visual.cells.length, 4);
  assert.ok(item.visual.cells.every((row) => row.length === 4));
  const missingColumns = item.visual.columnTotals.flatMap((value, index) => value === null ? [index] : []);
  assert.equal(missingColumns.length, 1);
  assert.equal(item.visual.targetColumn, missingColumns[0]);
  const solution = solveLinearSystem(item);
  const targetTotal = item.visual.cells.reduce((sum, row) => sum + solution[row[missingColumns[0]]], 0);
  assert.equal(String(targetTotal), item.answer);
  assert.equal(item.evidence.officialAnswer, item.answer);
  const markup = book08Markup(item.visual);
  assert.match(markup, /b8-source-sum-matrix/u);
  assert.match(markup, /style="--size:4"/u);
  assert.match(markup, /class="rows"/u);
  assert.match(markup, /class="columns"/u);
  assert.ok(markup.includes('class="target">?</b>'));
}

function parseEquation(equation) {
  const [left, right] = equation.split("=").map((value) => value.trim());
  return { left, right: Number(right.replace(/g$/u, "")) };
}

function equationValue(left, circle, square) {
  const terms = left.match(/[○□]/gu) || [];
  return terms.reduce((sum, symbol) => sum + (symbol === "○" ? circle : square), 0);
}

const equationItems = normalized.updates[1].appendItems.filter((item) => item.visual.subtype === "symbol-equations");
assert.equal(equationItems.length, 3);
for (const item of equationItems) {
  assertItemShape(item);
  assert.equal(item.visual.kind, "book8");
  assert.equal(item.visual.subtype, "symbol-equations");
  assert.equal(item.visual.target, "□");
  assert.equal(item.sourceLocator, "교사용 화면 4");
  assert.match(item.sourceNo, /^\(\d+\)$/u);
  const solutions = [];
  for (let circle = 0; circle <= 30; circle += 1) {
    for (let square = 0; square <= 30; square += 1) {
      if (item.visual.equations.every((equation) => {
        const parsed = parseEquation(equation);
        return equationValue(parsed.left, circle, square) === parsed.right;
      })) solutions.push({ circle, square });
    }
  }
  assert.equal(solutions.length, 1, `Symbol equations must have one solution: ${item.id}`);
  assert.equal(String(solutions[0].square), item.answer);
  assert.equal(item.evidence.officialAnswer, item.answer);
}

const scaleItem = normalized.updates[1].appendItems.find((item) => item.visual.subtype === "source-weight-scales");
assert.ok(scaleItem, "The fourth source target must keep the weighing-scale visual");
assertItemShape(scaleItem);
assert.equal(scaleItem.sourceLocator, "교사용 화면 4");
assert.equal(scaleItem.sourceNo, "(4)");
assert.equal(scaleItem.visual.target, "□");
assert.equal(scaleItem.visual.targetUnit, "g");
assert.equal(scaleItem.prompt.includes("몇 g"), true);
assert.equal(scaleItem.visual.scales.length, 2);
assert.deepEqual(scaleItem.visual.scales.map((scale) => scale.rows.map((row) => row.length)), [[1, 2], [2, 3]]);
assert.ok(scaleItem.visual.scales.every((scale) => scale.items.length === scale.rows.flat().length));
const scaleTotals = scaleItem.visual.scales.map((scale) => Number(String(scale.total).replace(/g$/u, "")));
const count = (scale, symbol) => scale.items.filter((item) => item === symbol).length;
const extraCircles = count(scaleItem.visual.scales[1], "○") - count(scaleItem.visual.scales[0], "○");
const circleWeight = (scaleTotals[1] - scaleTotals[0]) / extraCircles;
const squareWeight = (scaleTotals[0] - circleWeight * count(scaleItem.visual.scales[0], "○")) / count(scaleItem.visual.scales[0], "□");
assert.equal(String(squareWeight), scaleItem.answer);
assert.equal(scaleItem.evidence.officialAnswer, `${squareWeight}g`);
const scaleMarkup = book08Markup(scaleItem.visual);
assert.match(scaleMarkup, /b8-source-weight-scales/u);
assert.match(scaleMarkup, /aria-label="두 저울의 전체 무게 비교"/u);
assert.equal((scaleMarkup.match(/class="weight-row"/gu) || []).length, 4);
assert.equal((scaleMarkup.match(/class="weight-item"/gu) || []).length, 8);
assert.ok(scaleMarkup.includes("□ 한 개 = ?g"));

console.log("BOOK08_GOLDEN_BELL_RECOVERY_OK items=8 matrices=4 equations=4 unique-solutions=pass source-renders=pass privacy=private-only");
