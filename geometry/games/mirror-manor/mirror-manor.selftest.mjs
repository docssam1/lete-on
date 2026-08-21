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
assert(readyLevels.length === 2, "only levels 1 and 2 may be playable in this release");

const ids = readyLevels.flatMap((level) => level.problems.map((problem) => problem.id));
assert(ids.length === 20 && new Set(ids).size === 20, "the 20 ready problems need unique ids");

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

const koreanKeys = Object.keys(messages.ko).sort();
for (const lang of LANGUAGES) {
  assert(JSON.stringify(Object.keys(messages[lang]).sort()) === JSON.stringify(koreanKeys), `${lang} locale keys differ from Korean`);
  assert(text(lang, "levelLabel", { level: 2 }).includes("2"), `${lang} level label does not interpolate`);
  assert(text(lang, "hintPaintVertical") !== text(lang, "hintPaintHorizontal"), `${lang} mirror-axis hints must differ`);
  assert(messages[lang].successGood === "GOOD JOB!", `${lang} success text drifted`);
}

console.log(`Mirror Manor self-test passed: ${ids.length} problems, ${LANGUAGES.length} locales.`);
