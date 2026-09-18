const translations = (ko, zh, ja, en) => ({ ko, zh, ja, en });

export const levelMeta = [
  {
    id: 1,
    stage: "기초",
    difficulty: "기초",
    color: "coral",
    strand: "single-fold-cut",
    title: translations("색종이 접어 자르기", "对折剪纸", "半分に折って切る", "Fold Once and Cut"),
    description: translations(
      "색종이를 가로 또는 세로로 한 번 접어 자른 뒤 펼친 모양을 알아봐요.",
      "把彩纸横向或纵向对折一次，剪开后判断展开的图形。",
      "色紙をたて・よこに一回だけ折って切り、開いた形を考えます。",
      "Fold the paper once across or down, cut it, and predict the open shape."
    )
  },
  {
    id: 2,
    stage: "응용",
    difficulty: "응용",
    color: "sky",
    strand: "diagonal-fold-cut",
    title: translations("대각선으로 접어 자르기", "沿对角线折叠剪纸", "対角線で折って切る", "Diagonal Fold and Cut"),
    description: translations(
      "색종이를 대각선으로 한 번 접어 자른 뒤 펼친 모양을 알아봐요.",
      "把彩纸沿对角线对折一次，剪开后判断展开的图形。",
      "色紙を対角線で一回だけ折って切り、開いた形を考えます。",
      "Fold the paper once along a diagonal, cut it, and predict the open shape."
    )
  }
];

const fold = (axis, side) => ({ axis, side, target: ({
  left: "right", right: "left", top: "bottom", bottom: "top", upper: "lower", lower: "upper"
})[side] });

const ORTHOGONAL_FOLDS = [
  fold("vertical", "left"),
  fold("horizontal", "top"),
  fold("vertical", "right"),
  fold("horizontal", "bottom")
];

const DIAGONAL_FOLDS = [
  fold("diag-main", "upper"),
  fold("diag-anti", "upper"),
  fold("diag-main", "lower"),
  fold("diag-anti", "lower")
];

const PROFILES = [
  { id: "triangle", points: [[.20, 0], [.50, .29], [.80, 0]] },
  { id: "rectangle", points: [[.22, 0], [.22, .23], [.76, .23], [.76, 0]] },
  { id: "step", points: [[.18, 0], [.18, .18], [.44, .18], [.44, .29], [.78, .29], [.78, 0]] },
  { id: "notch", points: [[.18, 0], [.34, .21], [.50, .12], [.68, .25], [.82, 0]] },
  { id: "trapezoid", points: [[.18, 0], [.30, .25], [.68, .25], [.82, 0]] },
  { id: "kite", points: [[.16, 0], [.38, .16], [.50, .30], [.64, .16], [.84, 0]] },
  { id: "round", points: Array.from({ length: 9 }, (_, index) => {
    const t = index / 8;
    return [.18 + t * .64, Math.sin(Math.PI * t) * .25];
  }) },
  { id: "double-round", points: Array.from({ length: 13 }, (_, index) => {
    const t = index / 12;
    return [.16 + t * .68, Math.abs(Math.sin(Math.PI * t * 2)) * .18 + Math.sin(Math.PI * t) * .07];
  }) }
];

const round = (value) => Math.round(value * 10000) / 10000;
const point = (x, y) => ({ x: round(x), y: round(y) });

export function cutPoints(foldSpec, profileId, depthScale = 1) {
  const profile = PROFILES.find((item) => item.id === profileId);
  if (!profile) throw new Error(`Unknown cut profile: ${profileId}`);
  const normal = foldSpec.side === "left" || foldSpec.side === "top" || foldSpec.side === "upper" ? 1 : -1;
  return profile.points.map(([along, rawDepth]) => {
    const depth = rawDepth * depthScale;
    if (foldSpec.axis === "vertical") return point(.5 + normal * depth, along);
    if (foldSpec.axis === "horizontal") return point(along, .5 + normal * depth);
    const offset = normal * depth / Math.SQRT2;
    if (foldSpec.axis === "diag-main") return point(along - offset, along + offset);
    return point(along + offset, 1 - along + offset);
  });
}

export function reflectPoint(source, axis) {
  if (axis === "vertical") return point(1 - source.x, source.y);
  if (axis === "horizontal") return point(source.x, 1 - source.y);
  if (axis === "diag-main") return point(source.y, source.x);
  return point(1 - source.y, 1 - source.x);
}

export function unfoldedPolygon(cut, foldSpec) {
  const reflectedInterior = cut.slice(1, -1).map((item) => reflectPoint(item, foldSpec.axis)).reverse();
  return [...cut, ...reflectedInterior];
}

export function foldedPolygon(foldSpec) {
  const polygons = {
    "vertical-left": [[.5, 0], [1, 0], [1, 1], [.5, 1]],
    "vertical-right": [[0, 0], [.5, 0], [.5, 1], [0, 1]],
    "horizontal-top": [[0, .5], [1, .5], [1, 1], [0, 1]],
    "horizontal-bottom": [[0, 0], [1, 0], [1, .5], [0, .5]],
    "diag-main-upper": [[0, 0], [1, 1], [0, 1]],
    "diag-main-lower": [[0, 0], [1, 0], [1, 1]],
    "diag-anti-upper": [[1, 0], [1, 1], [0, 1]],
    "diag-anti-lower": [[0, 0], [1, 0], [0, 1]]
  };
  return polygons[`${foldSpec.axis}-${foldSpec.side}`].map(([x, y]) => point(x, y));
}

const cutSignature = (cut) => cut.map(({ x, y }) => `${x},${y}`).join("|");
const resultChoice = (key, foldSpec, profileId, cut, variant) => ({
  key,
  fold: foldSpec,
  profileId,
  cut,
  variant
});

function shiftCutAlongCrease(cut, foldSpec, amount) {
  return cut.map(({ x, y }) => {
    if (foldSpec.axis === "vertical") return point(x, y + amount);
    if (foldSpec.axis === "horizontal") return point(x + amount, y);
    if (foldSpec.axis === "diag-main") return point(x + amount, y + amount);
    return point(x + amount, y - amount);
  });
}

function plausibleShift(cut, foldSpec, preferredAmount) {
  const candidates = [preferredAmount, -preferredAmount, preferredAmount * .72, preferredAmount * -.72];
  return candidates.map((amount) => shiftCutAlongCrease(cut, foldSpec, amount)).find((shifted) => (
    shifted.every(({ x, y }) => x >= 0 && x <= 1 && y >= 0 && y <= 1)
  ));
}

function selectionProblem(level, index, foldSpec, profileIndex) {
  const profile = PROFILES[profileIndex % PROFILES.length];
  const depthScale = .86 + (index % 4) * .07;
  const answerIndex = index % 3;
  const correctCut = cutPoints(foldSpec, profile.id, depthScale);
  const shiftedCut = plausibleShift(correctCut, foldSpec, index % 2 === 0 ? .055 : -.055);
  if (!shiftedCut) throw new Error(`Unable to place shifted distractor for ${level}-${index}`);
  const choices = [
    resultChoice("a", foldSpec, profile.id, correctCut, "correct"),
    resultChoice("b", foldSpec, profile.id, cutPoints(foldSpec, profile.id, depthScale * .72), "shallow"),
    resultChoice("c", foldSpec, profile.id, shiftedCut, "shifted")
  ];
  if (answerIndex !== 0) [choices[0], choices[answerIndex]] = [choices[answerIndex], choices[0]];
  choices.forEach((choice, choiceIndex) => { choice.key = String.fromCharCode(97 + choiceIndex); });
  return {
    id: `paper-${level === 1 ? "straight" : "diagonal"}-${String(index + 1).padStart(2, "0")}`,
    level,
    interaction: "result-choice",
    fold: foldSpec,
    folds: [foldSpec],
    profileId: profile.id,
    cut: correctCut,
    choices,
    answer: choices.find((choice) => choice.variant === "correct").key,
    sourceRef: "user-reference.kinderfacto.single-fold-cut"
  };
}

function connectProblem(level, index, folds, profileIndex) {
  const pairs = Array.from({ length: 3 }, (_, pairIndex) => {
    const foldSpec = folds[(index + pairIndex) % folds.length];
    const profile = PROFILES[(profileIndex + pairIndex * 2) % PROFILES.length];
    const depthScale = .88 + ((index + pairIndex) % 3) * .06;
    const key = String.fromCharCode(97 + pairIndex);
    return { key, fold: foldSpec, profileId: profile.id, cut: cutPoints(foldSpec, profile.id, depthScale) };
  });
  const shift = index % 3;
  const copied = pairs.map((item) => ({ ...item }));
  const results = copied.slice(shift).concat(copied.slice(0, shift));
  return {
    id: `paper-${level === 1 ? "straight" : "diagonal"}-connect-${String(index + 1).padStart(2, "0")}`,
    level,
    interaction: "connect-match",
    fold: pairs[0].fold,
    folds: [pairs[0].fold],
    pairs,
    results,
    answer: Object.fromEntries(pairs.map((item) => [item.key, item.key])),
    sourceRef: "user-reference.kinderfacto.single-fold-match"
  };
}

function problemPool(level, folds) {
  return Array.from({ length: 36 }, (_, index) => {
    const foldSpec = folds[index % folds.length];
    const profileIndex = (index * 3 + level) % PROFILES.length;
    return index % 3 === 1
      ? connectProblem(level, index, folds, profileIndex)
      : selectionProblem(level, index, foldSpec, profileIndex);
  });
}

export const levels = levelMeta.map((meta, index) => ({
  ...meta,
  problems: problemPool(meta.id, index === 0 ? ORTHOGONAL_FOLDS : DIAGONAL_FOLDS)
}));

export function validateLevels() {
  if (levels.length !== 2) throw new Error("Paper fold must have exactly two content types.");
  const ids = new Set();
  levels.forEach((level) => {
    if (level.problems.length < 30) throw new Error(`Not enough generated problems for ${level.id}`);
    let consecutive = 0;
    let previousInteraction = "";
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate paper-fold id: ${problem.id}`);
      ids.add(problem.id);
      if (problem.folds.length !== 1 || problem.fold !== problem.folds[0]) throw new Error(`Paper must fold exactly once: ${problem.id}`);
      const diagonal = problem.fold.axis.startsWith("diag");
      if ((level.id === 1 && diagonal) || (level.id === 2 && !diagonal)) throw new Error(`Fold type mismatch: ${problem.id}`);
      consecutive = problem.interaction === previousInteraction ? consecutive + 1 : 1;
      previousInteraction = problem.interaction;
      if (consecutive > 2) throw new Error(`Interaction repeats too often: ${problem.id}`);
      if (problem.interaction === "result-choice") {
        if (problem.choices.length !== 3 || !problem.choices.some((choice) => choice.key === problem.answer)) throw new Error(`Invalid choices: ${problem.id}`);
        if (new Set(problem.choices.map((choice) => choice.profileId)).size !== 1) throw new Error(`Distractors must preserve the cut shape: ${problem.id}`);
        if (new Set(problem.choices.map((choice) => choice.variant)).size !== 3) throw new Error(`Distractors must represent distinct misconceptions: ${problem.id}`);
        const signatures = new Set(problem.choices.map((choice) => cutSignature(choice.cut)));
        if (signatures.size !== 3) throw new Error(`Duplicate choices: ${problem.id}`);
      } else if (problem.interaction === "connect-match") {
        if (problem.pairs.length !== 3 || problem.results.length !== 3 || Object.keys(problem.answer).length !== 3) throw new Error(`Invalid matching problem: ${problem.id}`);
      } else throw new Error(`Unknown interaction: ${problem.id}`);
    });
  });
  return true;
}

validateLevels();
