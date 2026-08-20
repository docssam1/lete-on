import { authoredPools, levels, validateLevels } from "./levels.js";
import { messages, text } from "./i18n.js";

function assert(condition, message) {
  if (!condition) throw new Error(`Crystal Cubes self-test: ${message}`);
}

function sameMatrix(a, b) {
  return a.length === b.length
    && a.every((row, rowIndex) =>
      row.length === b[rowIndex].length
      && row.every((value, columnIndex) => value === b[rowIndex][columnIndex]));
}

// This projection deliberately does not call the production view helpers.
// A shared mistake in rendering code therefore cannot make this audit pass.
function project(heightGrid, [width, depth], maxH) {
  const frontHeights = Array(width).fill(0);
  const rightHeights = Array(depth).fill(0);
  const top = Array.from({ length: depth }, () => Array(width).fill(0));

  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const height = heightGrid[z][x];
      top[z][x] = height > 0 ? 1 : 0;
      frontHeights[x] = Math.max(frontHeights[x], height);
      rightHeights[z] = Math.max(rightHeights[z], height);
    }
  }

  const silhouette = (heights) => Array.from({ length: maxH }, (_, row) => {
    const level = maxH - row;
    return heights.map((height) => (height >= level ? 1 : 0));
  });

  return {
    front: silhouette(frontHeights),
    // On the right-view card, the front edge is the leftmost column.
    side: silhouette(rightHeights.toReversed()),
    top
  };
}

function cardsMatch(actual, target, names) {
  return names.every((name) => sameMatrix(actual[name], target[name]));
}

function enumerateSolutions(problem) {
  const [width, depth] = problem.grid;
  const occupied = [];
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      if (problem.target.top[z][x] === 1) occupied.push([x, z]);
    }
  }

  const build = Array.from({ length: depth }, () => Array(width).fill(0));
  const totals = [];

  function visit(index, total) {
    if (index === occupied.length) {
      const views = project(build, problem.grid, problem.maxH);
      if (cardsMatch(views, problem.target, problem.activeViews)) totals.push(total);
      return;
    }

    const [x, z] = occupied[index];
    for (let height = 1; height <= problem.maxH; height += 1) {
      build[z][x] = height;
      visit(index + 1, total + height);
    }
    build[z][x] = 0;
  }

  visit(0, 0);
  return totals;
}

validateLevels();
assert(authoredPools.length === 4, "four authored levels are required");
assert(levels.length === 4, "four playable levels are required");

const authoredProblems = authoredPools.flatMap((level) => level.problems);
const ids = authoredProblems.map((problem) => problem.id);
assert(authoredProblems.length === 80, "the authored bank must contain 80 problems");
assert(new Set(ids).size === ids.length, "all authored problem ids must be unique");

const audit = new Map();
for (const problem of authoredProblems) {
  const totals = enumerateSolutions(problem);
  assert(totals.length > 0, `${problem.id} has no card-matching build`);
  assert(totals.length === problem.solutions, `${problem.id} declares ${problem.solutions} solutions but has ${totals.length}`);
  audit.set(problem.id, totals);
}

for (const level of levels) {
  assert(level.problems.length === 5, `level ${level.level} must serve five questions`);
  assert(level.pool.length === (level.level === 5 ? 20 : 10), `level ${level.level} has the wrong pool size`);

  for (const problem of level.pool) {
    const totals = audit.get(problem.id);
    if (level.level < 5) {
      const matchingTotals = totals.filter((total) => total === problem.requiredTotal);
      assert(matchingTotals.length === 1, `${problem.id} is not single-answer after the required-total clue`);
      assert(problem.requiredTotal === problem.referenceTotal, `${problem.id} total clue drifted from its reference`);
      continue;
    }

    const minTotal = Math.min(...totals);
    const maxTotal = Math.max(...totals);
    assert(minTotal === problem.minTotal, `${problem.id} min should be ${minTotal}, not ${problem.minTotal}`);
    assert(maxTotal === problem.maxTotal, `${problem.id} max should be ${maxTotal}, not ${problem.maxTotal}`);
    assert(maxTotal > minTotal, `${problem.id} has no meaningful min/max spread`);
    const target = problem.goal === "max" ? maxTotal : minTotal;
    assert(problem.targetTotal === target, `${problem.id} target total does not match its goal`);
  }
}

const localeKeys = Object.keys(messages.ko).sort();
for (const lang of ["ko", "zh", "ja", "en"]) {
  assert(JSON.stringify(Object.keys(messages[lang]).sort()) === JSON.stringify(localeKeys), `${lang} locale keys differ from Korean`);
  const progress = text(lang, "progress")
    .replace("{level}", "3")
    .replace("{current}", "2")
    .replace("{total}", "5");
  assert(progress.includes("3") && progress.includes("2") && progress.includes("5"), `${lang} progress placeholders failed`);
}

assert(messages.ko.viewSide === "오른쪽에서 본 모양", "Korean right-view label is vague");
assert(messages.zh.viewSide === "右边看到的", "Chinese right-view label is vague");
assert(messages.ja.viewSide === "右から見た形", "Japanese right-view label is vague");
assert(messages.en.viewSide === "Right View", "English right-view label is vague");
assert(messages.ko.side === "오른쪽", "Korean board card must say right");
assert(messages.zh.side === "右边", "Chinese board card must say right");
assert(messages.ja.side === "右", "Japanese board card must say right");
assert(messages.en.side === "Right", "English board card must say right");

console.log(`Crystal Cubes self-test passed: ${authoredProblems.length} authored problems, 4 locales.`);
