import {
  levels, readyLevels, validateLevels, reflectCell, mirrorDistance,
  parallelCoord, isGivenSide, classifyCell, classifyPlacement
} from "./levels.js";
import { LANGUAGES, messages, text } from "./i18n.js";

function assert(condition, message) {
  if (!condition) throw new Error(`Mirror Manor self-test: ${message}`);
}

const sameCell = (a, b) => a[0] === b[0] && a[1] === b[1];
const cellKey = (cell) => cell.join(",");

validateLevels();
assert(levels.length === 5, "five levels must be declared");
assert(readyLevels.length === 4, "levels 1 through 4 should be playable in this release");

const ids = readyLevels.flatMap((level) => level.problems.map((problem) => problem.id));
assert(ids.length === 40 && new Set(ids).size === 40, "the 40 ready problems need unique ids");

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

for (const problem of levels[1].problems) {
  for (const target of problem.targets) {
    assert(classifyPlacement(target.cells, problem, problem.targets) === "correct", `${problem.id} rejects a target object`);
  }
}

for (const problem of levels[2].problems) {
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
  assert(["letter", "word", "arrow"].includes(problem.sourceKind), `${problem.id} has no supported symbol kind`);
  assert(problem.sourceText.length > 0, `${problem.id} has no source text`);
  assert(problem.choices.length === 3, `${problem.id} needs three choices`);
  assert(problem.choices.filter((choice) => choice.kind === "mirror").length === 1, `${problem.id} needs one mirrored choice`);
  assert(problem.choices.filter((choice) => choice.kind === "normal").length === 1, `${problem.id} needs one normal choice`);
  assert(problem.choices.filter((choice) => choice.kind === "decoy").length === 1, `${problem.id} needs one decoy choice`);
  const answer = problem.choices.find((choice) => choice.kind === "mirror");
  assert(answer.text === problem.sourceText, `${problem.id} mirrors the wrong source text`);
  assert(new Set(problem.choices.map((choice) => `${choice.kind}:${choice.text}`)).size === 3, `${problem.id} repeats a visual choice role`);
}

const koreanKeys = Object.keys(messages.ko).sort();
for (const lang of LANGUAGES) {
  assert(JSON.stringify(Object.keys(messages[lang]).sort()) === JSON.stringify(koreanKeys), `${lang} locale keys differ from Korean`);
  assert(text(lang, "levelLabel", { level: 2 }).includes("2"), `${lang} level label does not interpolate`);
  assert(text(lang, "hintPaintVertical") !== text(lang, "hintPaintHorizontal"), `${lang} mirror-axis hints must differ`);
  assert(text(lang, "promptSymbol").length > 0 && text(lang, "hintSymbol").length > 0, `${lang} symbol copy is missing`);
  assert(messages[lang].successGood === "GOOD JOB!", `${lang} success text drifted`);
}

console.log(`Mirror Manor self-test passed: ${ids.length} problems, ${LANGUAGES.length} locales.`);
