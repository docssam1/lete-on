import {
  levels, readyLevels, validateLevels, reflectCell, mirrorDistance,
  parallelCoord, isGivenSide, classifyCell, classifyPlacement, doubleMirrorCopies
} from "./levels.js";
import { LANGUAGES, messages, text } from "./i18n.js";
import { auditMirrorLevels } from "./mirror-manor-content-audit.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(`Mirror Manor self-test: ${message}`);
}

const sameCell = (a, b) => a[0] === b[0] && a[1] === b[1];
const cellKey = (cell) => cell.join(",");

validateLevels();
auditMirrorLevels();
assert(levels.length === 5, "five levels must be declared");
assert(readyLevels.length === 5, "levels 1 through 5 should be playable in this release");

const ids = readyLevels.flatMap((level) => level.problems.map((problem) => problem.id));
assert(ids.length === 50 && new Set(ids).size === 50, "the 50 ready problems need unique ids");

for (const problem of levels[0].problems) {
  const targetIds = new Set(problem.targetCells.map(cellKey));
  for (const [index, source] of problem.sourceCells.entries()) {
    const reflected = reflectCell(source, problem.axis);
    assert(sameCell(reflected, problem.targetCells[index]), `${problem.id} source ${index} has the wrong reflected target`);
    assert(classifyCell(reflected, problem) === "correct", `${problem.id} rejects a correct target cell`);
    assert(mirrorDistance(source, problem.axis) === mirrorDistance(reflected, problem.axis), `${problem.id} changes mirror distance`);
    assert(parallelCoord(source, problem.axis) === parallelCoord(reflected, problem.axis), `${problem.id} slides along the mirror`);
  }

  for (let y = 0; y < problem.grid.rows; y += 1) {
    for (let x = 0; x < problem.grid.cols; x += 1) {
      const candidate = [x, y];
      if (isGivenSide(candidate, problem.axis) || targetIds.has(cellKey(candidate))) continue;
      const verdict = classifyCell(candidate, problem);
      if (verdict !== "distance") continue;
      const distance = mirrorDistance(candidate, problem.axis);
      const along = parallelCoord(candidate, problem.axis);
      const oneCellMiss = problem.sourceCells.some((source) =>
        parallelCoord(source, problem.axis) === along
        && Math.abs(mirrorDistance(source, problem.axis) - distance) === 1);
      assert(oneCellMiss, `${problem.id} labels a far miss as a one-cell distance error`);
    }
  }
}

for (const problem of levels[2].problems) {
  for (const target of problem.targets) {
    assert(classifyPlacement(target.cells, problem, problem.targets) === "correct", `${problem.id} rejects a target object`);
  }
}

for (const problem of levels[1].problems) {
  assert(problem.grid.lattice === "square" || problem.grid.lattice === "triangle", `${problem.id} has no dot-grid kind`);
  assert(sameCell(reflectCell(problem.sourceCell, problem.axis), problem.targetCell), `${problem.id} has the wrong reflected target`);
  assert(problem.choices.length === 3 && new Set(problem.choices.map(cellKey)).size === 3, `${problem.id} needs three distinct choices`);
  const matches = [];
  for (let y = 0; y < problem.grid.rows; y += 1) {
    for (let x = 0; x < problem.grid.cols; x += 1) {
      const candidate = [x, y];
      if (isGivenSide(candidate, problem.axis)) continue;
      if (mirrorDistance(candidate, problem.axis) !== mirrorDistance(problem.sourceCell, problem.axis)) continue;
      if (parallelCoord(candidate, problem.axis) !== parallelCoord(problem.sourceCell, problem.axis)) continue;
      matches.push(candidate);
    }
  }
  assert(matches.length === 1 && sameCell(matches[0], problem.targetCell), `${problem.id} has a non-unique answer`);
  assert(problem.choices.some((choice) => sameCell(choice, problem.targetCell)), `${problem.id} omits the answer choice`);
}

for (const problem of levels[3].problems) {
  assert(["letter", "word", "latin", "arrow"].includes(problem.sourceKind), `${problem.id} has no supported symbol kind`);
  assert(problem.sourceText.length > 0, `${problem.id} has no source text`);
  assert(problem.choices.length === 3, `${problem.id} needs three choices`);
  assert(problem.choices.filter((choice) => choice.kind === "mirror").length === 1, `${problem.id} needs one mirrored choice`);
  assert(problem.choices.filter((choice) => choice.kind === "normal").length === 1, `${problem.id} needs one normal choice`);
  assert(problem.choices.filter((choice) => choice.kind === "decoy").length === 1, `${problem.id} needs one decoy choice`);
  const answer = problem.choices.find((choice) => choice.kind === "mirror");
  assert(answer.text === problem.sourceText, `${problem.id} mirrors the wrong source text`);
  assert(new Set(problem.choices.map((choice) => `${choice.kind}:${choice.text}`)).size === 3, `${problem.id} repeats a visual choice role`);
}

assert(levels[3].problems.some((problem) => problem.sourceKind === "latin"), "level 4 needs an English symbol problem");
assert(levels[3].problems.some((problem) => problem.axis.kind === "horizontal"), "level 4 needs an up-down reflection problem");
assert(levels[3].problems.some((problem) => problem.axis.kind === "diagonal"), "level 4 needs a diagonal reflection problem");

for (const problem of levels[4].problems) {
  assert(problem.axis.kind === "double", `${problem.id} needs two mirror axes`);
  const sourceIds = new Set(problem.sourceCells.map(cellKey));
  const targetIds = new Set(problem.targetCells.map(cellKey));
  assert(sourceIds.size === problem.sourceCells.length, `${problem.id} repeats a source cell`);
  assert(targetIds.size === problem.targetCells.length, `${problem.id} repeats a target cell`);
  assert(targetIds.size === sourceIds.size * 3, `${problem.id} needs three reflected copies per source cell`);

  const independentlyReflected = new Set();
  for (const source of problem.sourceCells) {
    assert(source[0] < problem.axis.verticalAt && source[1] < problem.axis.horizontalAt, `${problem.id} source leaves the upper-left quadrant`);
    for (const copy of doubleMirrorCopies(source, problem.axis)) independentlyReflected.add(cellKey(copy));
  }
  assert(independentlyReflected.size === targetIds.size, `${problem.id} reflection copies overlap`);
  assert([...independentlyReflected].every((id) => targetIds.has(id)), `${problem.id} target set differs from independent reflection`);
  assert([...targetIds].every((id) => !sourceIds.has(id)), `${problem.id} overlaps source and target cells`);
}

const koreanKeys = Object.keys(messages.ko).sort();
for (const lang of LANGUAGES) {
  assert(JSON.stringify(Object.keys(messages[lang]).sort()) === JSON.stringify(koreanKeys), `${lang} locale keys differ from Korean`);
  assert(text(lang, "levelLabel", { level: 2 }).includes("2"), `${lang} level label does not interpolate`);
  assert(text(lang, "hintPaintVertical") !== text(lang, "hintPaintHorizontal"), `${lang} mirror-axis hints must differ`);
  assert(text(lang, "promptSymbol").length > 0 && text(lang, "hintSymbol").length > 0, `${lang} symbol copy is missing`);
  assert(text(lang, "promptDouble").length > 0 && text(lang, "hintDouble").length > 0, `${lang} double-mirror copy is missing`);
  assert(messages[lang].successGood === "GOOD JOB!", `${lang} success text drifted`);
}

const brokenPaint = structuredClone(levels);
brokenPaint[0].problems[0].targetCells[0][0] += 1;
let paintRejected = false;
try { auditMirrorLevels(brokenPaint); } catch { paintRejected = true; }
assert(paintRejected, "the independent audit must reject a corrupted paint answer");

const brokenChoice = structuredClone(levels);
brokenChoice[1].problems[0].choices = brokenChoice[1].problems[0].choices.filter((_, index) => index !== 0);
let choiceRejected = false;
try { auditMirrorLevels(brokenChoice); } catch { choiceRejected = true; }
assert(choiceRejected, "the independent audit must reject a missing distance choice");

console.log(`Mirror Manor self-test passed: ${ids.length} problems, ${LANGUAGES.length} locales, independent negative controls.`);
