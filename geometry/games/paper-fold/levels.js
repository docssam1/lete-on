const translations = (ko, zh, ja, en) => ({ ko, zh, ja, en });

export const levelMeta = [
  {
    id: 1, stage: "Pre", difficulty: "입문", color: "mint", strand: "cut-open-one",
    title: translations("한 번 접어 자르기", "折一次再剪", "一回折って切る", "One Fold and Cut"),
    description: translations("가로·세로로 한 번 접어 자른 뒤 펼친 자리를 찾아요.", "横向或竖向折一次，找出展开后的剪切位置。", "たて・よこに一回折り、開いた切りあとを探します。", "Fold once across or down, then find every cut when it opens.")
  },
  {
    id: 2, stage: "입문", difficulty: "입문", color: "sky", strand: "cut-open-two",
    title: translations("두 번 접어 자르기", "折两次再剪", "二回折って切る", "Two Folds and Cut"),
    description: translations("접기 순서 두 단계를 따라 펼친 네 자리를 찾아요.", "按顺序折两次，找出展开后的四个位置。", "二つの折り順をたどり、開いた四つの場所を探します。", "Follow two folds in order and find the four opened positions.")
  },
  {
    id: 3, stage: "입문", difficulty: "초급", color: "violet", strand: "punch-holes",
    title: translations("접고 구멍 뚫기", "折叠打孔", "折って穴をあける", "Fold and Punch"),
    description: translations("한 번·두 번·대각선 접기를 구분해 구멍 수와 자리를 찾아요.", "区分一次、两次和对角折叠，找出孔的位置。", "一回・二回・ななめ折りを分けて、穴の場所を探します。", "Distinguish one, two, and diagonal folds to place every hole.")
  },
  {
    id: 4, stage: "초급", difficulty: "초급", color: "coral", strand: "number-paper",
    title: translations("숫자 색종이", "数字折纸", "数字おりがみ", "Number Paper"),
    description: translations("접힌 횟수와 방향을 보고 잘린 수를 모두 찾아 더해요.", "根据折叠次数和方向，找出并相加所有被剪掉的数字。", "折った回数と向きを見て、切られた数を全部たします。", "Use every fold direction to find and add all cut-away numbers.")
  },
  {
    id: 5, stage: "중급", difficulty: "중급", color: "gold", strand: "top-layer",
    title: translations("맨 위에 오는 수", "最上面的数字", "いちばん上の数", "Number on Top"),
    description: translations("여러 번 접을 때 종이 층의 순서를 따라 맨 위 수를 찾아요.", "多次折叠时追踪纸层顺序，找出最上面的数字。", "何回も折った紙の重なりをたどり、一番上の数を探します。", "Track the paper layers through several folds and find the top number.")
  }
];

const id = (level, index) => `paper-l${level}-${String(index).padStart(2, "0")}`;
const fold = (axis, side) => ({ axis, side, target: ({ left: "right", right: "left", top: "bottom", bottom: "top", upper: "lower", lower: "upper" })[side] });
const regionPattern = /^r[1-4]c[1-4](?:-(?:ne|nw|se|sw))?$/;
const baseCellId = (region) => region.replace(/-(?:ne|nw|se|sw)$/, "");
const numberGrid = (values) => ({ size: 4, values });
const gridCells = (values) => values.flatMap((row, r) => row.map((value, c) => ({ id: `r${r + 1}c${c + 1}`, value })));

const triangleReflection = {
  vertical: { nw: "ne", ne: "nw", sw: "se", se: "sw" },
  horizontal: { nw: "sw", sw: "nw", ne: "se", se: "ne" },
  "diag-main": { nw: "nw", ne: "sw", sw: "ne", se: "se" },
  "diag-anti": { nw: "se", ne: "ne", sw: "sw", se: "nw" }
};

const reflectRegion = (region, axis) => {
  const [, rowText, colText, part] = /^r([1-4])c([1-4])(?:-(ne|nw|se|sw))?$/.exec(region) || [];
  if (!rowText) return region;
  const row = Number(rowText);
  const col = Number(colText);
  const [nextRow, nextCol] = ({
    vertical: [row, 5 - col], horizontal: [5 - row, col],
    "diag-main": [col, row], "diag-anti": [5 - col, 5 - row]
  })[axis];
  return `r${nextRow}c${nextCol}${part ? `-${triangleReflection[axis][part]}` : ""}`;
};

const expandRegions = (sourceRegions, folds) => folds.reduce(
  (regions, step) => [...new Set(regions.flatMap((region) => [region, reflectRegion(region, step.axis)]))],
  [...sourceRegions]
);

function regionProblem(level, index, interaction, folds, sourceRegions, sourceRef) {
  return {
    id: id(level, index), level, interaction, fold: folds[0], folds,
    action: { type: interaction === "punch-select" ? "punch" : "cut" },
    sourceRegions, targetRegions: expandRegions(sourceRegions, folds), sourceRef
  };
}

const oneFoldSpecs = [
  [fold("vertical", "left"), ["r1c4"]], [fold("horizontal", "bottom"), ["r2c2"]],
  [fold("vertical", "right"), ["r3c1"]], [fold("horizontal", "top"), ["r4c3"]],
  [fold("vertical", "left"), ["r2c3", "r4c4"]], [fold("horizontal", "bottom"), ["r1c1", "r2c4"]],
  [fold("vertical", "right"), ["r1c2", "r3c1"]], [fold("horizontal", "top"), ["r3c2", "r4c4"]],
  [fold("vertical", "left"), ["r1c3", "r3c4"]], [fold("horizontal", "bottom"), ["r1c2", "r2c3"]]
];

const twoFoldSpecs = [
  [[fold("vertical", "left"), fold("horizontal", "top")], ["r4c4"]],
  [[fold("horizontal", "bottom"), fold("vertical", "right")], ["r1c1"]],
  [[fold("vertical", "right"), fold("horizontal", "bottom")], ["r2c2"]],
  [[fold("horizontal", "top"), fold("vertical", "left")], ["r3c3"]],
  [[fold("vertical", "left"), fold("horizontal", "bottom")], ["r1c3"]],
  [[fold("horizontal", "bottom"), fold("vertical", "left")], ["r2c4"]],
  [[fold("vertical", "right"), fold("horizontal", "top")], ["r3c1"]],
  [[fold("horizontal", "top"), fold("vertical", "right")], ["r4c2"]],
  [[fold("diag-main", "upper"), fold("vertical", "right")], ["r4c1-sw"]],
  [[fold("diag-anti", "upper"), fold("horizontal", "bottom")], ["r1c1-sw"]]
];

const punchSpecs = [
  [[fold("vertical", "left")], ["r2c4"]], [[fold("horizontal", "top")], ["r4c2"]],
  [[fold("diag-main", "upper")], ["r1c3-se"]], [[fold("diag-anti", "lower")], ["r4c2-ne"]],
  [[fold("vertical", "right"), fold("horizontal", "bottom")], ["r1c1"]],
  [[fold("horizontal", "top"), fold("vertical", "left")], ["r4c4"]],
  [[fold("vertical", "left"), fold("horizontal", "top")], ["r3c4"]],
  [[fold("diag-main", "lower"), fold("horizontal", "bottom")], ["r1c4-sw"]],
  [[fold("diag-anti", "upper"), fold("vertical", "right")], ["r1c1-se"]],
  [[fold("vertical", "right"), fold("horizontal", "top")], ["r4c1", "r3c2"]]
];

const numberValues = [
  [[1,3,4,2],[8,6,7,5],[4,1,2,3],[6,5,7,8]], [[2,5,1,4],[7,3,8,6],[1,4,2,9],[5,6,3,7]],
  [[3,7,2,6],[4,1,5,8],[9,2,4,3],[6,8,1,7]], [[1,8,3,4],[2,6,7,5],[9,3,2,1],[4,5,6,8]],
  [[8,2,4,1],[3,7,5,6],[2,4,9,3],[5,1,6,8]], [[4,1,7,2],[6,3,5,8],[2,9,4,1],[7,5,6,3]],
  [[7,2,6,3],[1,8,4,5],[9,3,2,7],[4,6,5,1]], [[5,9,1,4],[2,7,6,3],[8,4,5,1],[3,6,2,7]],
  [[2,6,8,1],[5,3,7,4],[9,1,6,2],[4,8,3,5]], [[6,4,2,9],[1,8,5,3],[7,2,6,4],[3,5,1,8]]
];

const numberFoldSpecs = [
  [[fold("vertical", "left")], ["r1c4", "r3c4"]], [[fold("horizontal", "bottom")], ["r1c2", "r2c4"]],
  [[fold("diag-main", "upper")], ["r1c3", "r2c4"]], [[fold("diag-anti", "lower")], ["r3c1", "r4c2"]],
  [[fold("vertical", "right"), fold("horizontal", "bottom")], ["r1c1"]],
  [[fold("horizontal", "top"), fold("vertical", "left")], ["r4c4"]],
  [[fold("vertical", "left"), fold("horizontal", "top")], ["r3c4"]],
  [[fold("horizontal", "bottom"), fold("vertical", "right")], ["r1c1"]],
  [[fold("diag-main", "upper"), fold("vertical", "right")], ["r4c1"]],
  [[fold("diag-anti", "upper"), fold("horizontal", "bottom")], ["r1c1"]]
];

function numberProblem(index) {
  const [folds, cutRegions] = numberFoldSpecs[index];
  const values = numberValues[index];
  const answerCells = expandRegions(cutRegions, folds);
  const available = gridCells(values);
  const answerValues = answerCells.map((region) => available.find((cell) => cell.id === baseCellId(region)).value);
  return {
    id: id(4, index + 1), level: 4, interaction: "cut-number-sum", fold: folds[0], folds,
    action: { type: "cut" }, grid: numberGrid(values), cutRegions,
    answer: { cells: answerCells, values: answerValues, expression: answerValues.join(" + "), sum: answerValues.reduce((sum, value) => sum + value, 0) },
    sourceRef: folds.length === 1 ? "fields.classic.fold-number-grid-one" : folds.some((step) => step.axis.startsWith("diag")) ? "fields.classic.fold-number-grid-two-diagonal" : "fields.classic.fold-number-grid-two-orthogonal"
  };
}

function foldStacks(values, folds) {
  let board = values.map((row) => row.map((value) => [value]));
  const states = [board.map((row) => row.map((stack) => stack.at(-1)))];
  folds.forEach((step) => {
    const rows = board.length;
    const cols = board[0].length;
    if (step.axis === "vertical") {
      const half = cols / 2;
      board = board.map((row) => Array.from({ length: half }, (_, col) => {
        const target = step.side === "left" ? row[half + col] : row[col];
        const moving = step.side === "left" ? row[half - 1 - col] : row[cols - 1 - col];
        return [...target, ...moving.slice().reverse()];
      }));
      return;
    }
    const half = rows / 2;
    board = Array.from({ length: half }, (_, row) => Array.from({ length: cols }, (_, col) => {
      const target = step.side === "top" ? board[half + row][col] : board[row][col];
      const moving = step.side === "top" ? board[half - 1 - row][col] : board[rows - 1 - row][col];
      return [...target, ...moving.slice().reverse()];
    }));
    states.push(board.map((row) => row.map((stack) => stack.at(-1))));
  });
  if (board.length !== 1 || board[0].length !== 1) throw new Error("Top-layer folds must finish as one stack.");
  return { stack: board[0][0], states };
}

const topSpecs = [
  { values:[[1,2],[3,4]], folds:[fold("vertical","left"),fold("horizontal","top")] },
  { values:[[2,4],[1,3]], folds:[fold("horizontal","bottom"),fold("vertical","right")] },
  { values:[[3,1],[4,2]], folds:[fold("vertical","right"),fold("horizontal","bottom")] },
  { values:[[4,3],[2,1]], folds:[fold("horizontal","top"),fold("vertical","left")] },
  { values:[[1,2,3,4],[5,6,7,8]], folds:[fold("vertical","right"),fold("vertical","left"),fold("horizontal","top")] },
  { values:[[8,7,6,5],[4,3,2,1]], folds:[fold("horizontal","bottom"),fold("vertical","left"),fold("vertical","right")] },
  { values:[[2,5,8,1],[7,4,3,6]], folds:[fold("vertical","left"),fold("horizontal","top"),fold("vertical","right")] },
  { values:[[6,3,4,7],[1,8,5,2]], folds:[fold("vertical","right"),fold("horizontal","bottom"),fold("vertical","left")] },
  { values:[[1,4],[2,5],[3,6],[7,8]], folds:[fold("horizontal","top"),fold("horizontal","bottom"),fold("vertical","left")] },
  { values:[[8,3],[6,1],[4,7],[2,5]], folds:[fold("horizontal","bottom"),fold("horizontal","top"),fold("vertical","right")] }
];

function topProblem(index) {
  const spec = topSpecs[index];
  const folded = foldStacks(spec.values, spec.folds);
  const stack = folded.stack;
  const answer = stack[stack.length - 1];
  const allValues = [...new Set(spec.values.flat())];
  const distractors = allValues.filter((value) => value !== answer);
  const choices = [answer, distractors[index % distractors.length], distractors[(index + 2) % distractors.length]];
  if (new Set(choices).size < 3) choices[2] = distractors.find((value) => !choices.includes(value));
  return {
    id: id(5, index + 1), level: 5, interaction: "top-choice", fold: spec.folds[0], folds: spec.folds,
    topGrid: spec.values, topStates: folded.states, choices: choices.map(String), answer: String(answer), stack,
    condition: "same-number-on-both-sides", sourceRef: "fields.classic.fold-surface-top-trace",
    sourceAdaptation: "top-color adapted to same-number-on-both-sides paper"
  };
}

export const levels = [
  { ...levelMeta[0], problems: oneFoldSpecs.map(([step, regions], index) => regionProblem(1, index + 1, "grid-select", [step], regions, "fields.classic.fold-cut-unfold-one-draw")) },
  { ...levelMeta[1], problems: twoFoldSpecs.map(([folds, regions], index) => regionProblem(2, index + 1, "grid-select", folds, regions, "fields.classic.fold-cut-unfold-two-draw")) },
  { ...levelMeta[2], problems: punchSpecs.map(([folds, regions], index) => regionProblem(3, index + 1, "punch-select", folds, regions, folds.some((step) => step.axis.startsWith("diag")) ? "fields.classic.fold-diagonal-hole-count" : folds.length > 1 ? "fields.classic.practice-three-fold-hole-count" : "fields.classic.fold-hole-count")) },
  { ...levelMeta[3], problems: numberValues.map((_, index) => numberProblem(index)) },
  { ...levelMeta[4], problems: topSpecs.map((_, index) => topProblem(index)) }
];

const isUniqueRegionList = (regions) => Array.isArray(regions) && regions.length > 0 && new Set(regions).size === regions.length && regions.every((region) => regionPattern.test(region));
const equalRegionSets = (actual, expected) => actual.length === expected.length && expected.every((region) => actual.includes(region));
const sourceFitsFoldedArea = (region, folds) => {
  const match = /^r([1-4])c([1-4])/.exec(region);
  if (!match) return false;
  const row = Number(match[1]);
  const col = Number(match[2]);
  return folds.every((step) => {
    if (step.axis === "vertical") return step.side === "left" ? col >= 3 : col <= 2;
    if (step.axis === "horizontal") return step.side === "top" ? row >= 3 : row <= 2;
    return true;
  });
};

export function validateLevels() {
  const ids = new Set();
  if (levels.length !== 5) throw new Error("Paper-fold must contain five distinct strands.");
  levels.forEach((level, index) => {
    if (level.id !== index + 1 || level.problems.length !== 10) throw new Error(`Invalid paper-fold level ${level.id}`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate paper-fold problem ${problem.id}`);
      ids.add(problem.id);
      if (!Array.isArray(problem.folds) || !problem.folds.length || problem.fold !== problem.folds[0]) throw new Error(`Missing fold sequence: ${problem.id}`);
      if (["grid-select", "punch-select"].includes(problem.interaction)) {
        const expected = expandRegions(problem.sourceRegions, problem.folds);
        if (!isUniqueRegionList(problem.sourceRegions) || !problem.sourceRegions.every((region) => sourceFitsFoldedArea(region, problem.folds)) || !isUniqueRegionList(problem.targetRegions) || !equalRegionSets(problem.targetRegions, expected)) throw new Error(`Invalid unfolded regions: ${problem.id}`);
      }
      if (problem.interaction === "cut-number-sum") {
        const available = gridCells(problem.grid.values);
        const expectedCells = expandRegions(problem.cutRegions, problem.folds);
        const expectedValues = expectedCells.map((region) => available.find((cell) => cell.id === baseCellId(region))?.value);
        if (!problem.cutRegions.every((region) => sourceFitsFoldedArea(region, problem.folds)) || !equalRegionSets(problem.answer.cells, expectedCells) || problem.answer.values.join(",") !== expectedValues.join(",") || problem.answer.expression !== expectedValues.join(" + ") || problem.answer.sum !== expectedValues.reduce((sum, value) => sum + value, 0)) throw new Error(`Invalid number-paper answer: ${problem.id}`);
      }
      if (problem.interaction === "top-choice") {
        const folded = foldStacks(problem.topGrid, problem.folds);
        const answer = String(folded.stack[folded.stack.length - 1]);
        if (problem.answer !== answer || JSON.stringify(problem.topStates) !== JSON.stringify(folded.states) || problem.choices.length !== 3 || new Set(problem.choices).size !== 3 || !problem.choices.includes(answer)) throw new Error(`Invalid top-layer answer: ${problem.id}`);
      }
    });
  });
  return true;
}
