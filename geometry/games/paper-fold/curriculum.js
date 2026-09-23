import { createPolygonMark, createPunchMark, unfoldMarkStages } from "./mark-geometry.js";

const translations = (ko, zh, ja, en) => ({ ko, zh, ja, en });

export const levelMeta = [
  {
    id: 1,
    stage: "접어 자르기",
    difficulty: "기초",
    color: "coral",
    strand: "fold-and-cut",
    title: translations("색종이 접어 자르기", "彩纸折叠剪纸", "色紙を折って切る", "Fold and Cut"),
    description: translations(
      "한 번 또는 두 번 접어 자른 뒤 펼친 절단선과 조각 수를 알아봐요.",
      "折叠一次或两次后剪开，判断展开的剪线和纸片数量。",
      "一回または二回折って切り、開いた切り線と紙片の数を考えます。",
      "Fold once or twice, cut, then reason about the open cut lines and number of pieces."
    )
  },
  {
    id: 2,
    stage: "구멍 뚫기",
    difficulty: "응용",
    color: "sky",
    strand: "fold-and-punch",
    title: translations("색종이 접어 구멍 뚫기", "彩纸折叠打孔", "色紙を折って穴をあける", "Fold and Punch"),
    description: translations(
      "한 번 또는 두 번 접은 종이를 거꾸로 펼쳐 구멍의 위치와 개수를 알아봐요.",
      "把折叠一次或两次的纸逆向展开，判断孔的位置和数量。",
      "一回または二回折った紙を逆順に開き、穴の位置と数を考えます。",
      "Unfold paper folded once or twice in reverse to locate and count holes."
    )
  }
];

const fold = (axis, side) => ({ axis, side, target: ({
  left: "right", right: "left", top: "bottom", bottom: "top", upper: "lower", lower: "upper"
})[side] });

const SINGLE_FOLDS = [
  fold("vertical", "left"), fold("horizontal", "top"),
  fold("vertical", "right"), fold("horizontal", "bottom"),
  fold("diag-main", "upper"), fold("diag-anti", "upper"),
  fold("diag-main", "lower"), fold("diag-anti", "lower")
];

const DOUBLE_FOLDS = [
  [fold("vertical", "left"), fold("horizontal", "bottom")],
  [fold("vertical", "left"), fold("horizontal", "top")],
  [fold("vertical", "right"), fold("horizontal", "bottom")],
  [fold("vertical", "right"), fold("horizontal", "top")],
  [fold("horizontal", "top"), fold("vertical", "right")],
  [fold("horizontal", "top"), fold("vertical", "left")],
  [fold("horizontal", "bottom"), fold("vertical", "right")],
  [fold("horizontal", "bottom"), fold("vertical", "left")]
];

const round = (value) => Math.round(value * 10000) / 10000;
const point = (x, y) => ({ x: round(x), y: round(y) });
const lerp = (a, b, t) => point(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

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

function clipPolygon(polygon, foldSpec) {
  const lineValue = (p) => {
    if (foldSpec.axis === "vertical") return p.x - .5;
    if (foldSpec.axis === "horizontal") return p.y - .5;
    if (foldSpec.axis === "diag-main") return p.y - p.x;
    return p.x + p.y - 1;
  };
  const keepPositive = ["right", "bottom", "lower"].includes(foldSpec.target);
  const keep = (p) => keepPositive ? lineValue(p) >= -1e-8 : lineValue(p) <= 1e-8;
  const intersect = (a, b) => {
    const da = lineValue(a);
    const db = lineValue(b);
    const t = da / (da - db);
    return lerp(a, b, t);
  };
  const output = [];
  polygon.forEach((current, index) => {
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const currentInside = keep(current);
    const previousInside = keep(previous);
    if (currentInside && !previousInside) output.push(intersect(previous, current));
    if (currentInside) output.push(current);
    if (!currentInside && previousInside) output.push(intersect(previous, current));
  });
  const cleaned = output.filter((item, index) => index === 0
    || item.x !== output[index - 1].x
    || item.y !== output[index - 1].y);
  if (cleaned.length > 1 && cleaned[0].x === cleaned.at(-1).x && cleaned[0].y === cleaned.at(-1).y) cleaned.pop();
  return cleaned;
}

export function polygonAfterFolds(folds) {
  return folds.reduce((polygon, step) => clipPolygon(polygon, step), [point(0, 0), point(1, 0), point(1, 1), point(0, 1)]);
}

const segmentKey = ([a, b]) => [`${a.x},${a.y}`, `${b.x},${b.y}`].sort().join("|");

function unfoldSegmentStages(segments, folds) {
  let current = segments.map(([a, b]) => [a, b]);
  const stages = [current];
  for (let index = folds.length - 1; index >= 0; index -= 1) {
    const reflected = current.map(([a, b]) => [reflectPoint(a, folds[index].axis), reflectPoint(b, folds[index].axis)]);
    current = [...new Map([...current, ...reflected].map((segment) => [segmentKey(segment), segment])).values()];
    stages.push(current);
  }
  return stages;
}

function unfoldPointStages(points, folds) {
  let current = points.map(({ x, y }) => point(x, y));
  const stages = [current];
  for (let index = folds.length - 1; index >= 0; index -= 1) {
    const reflected = current.map((item) => reflectPoint(item, folds[index].axis));
    current = [...new Map([...current, ...reflected].map((item) => [`${item.x},${item.y}`, item])).values()];
    stages.push(current);
  }
  return stages;
}

const unfoldSegments = (segments, folds) => unfoldSegmentStages(segments, folds).at(-1);
const unfoldPoints = (points, folds) => unfoldPointStages(points, folds).at(-1);

function reverseUnfoldSteps(folds) {
  return folds.slice().reverse().map((step) => ({
    axis: step.axis,
    source: step.target,
    answer: step.side,
    choices: [step.side, step.target],
    displayFold: { axis: step.axis, side: step.target, target: step.side }
  }));
}

function countPieces(segments, size = 221) {
  const blocked = new Uint8Array(size * size);
  segments.forEach(([a, b]) => {
    const steps = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) * size * 8));
    for (let index = 0; index <= steps; index += 1) {
      const t = index / steps;
      const x = Math.min(size - 1, Math.max(0, Math.floor((a.x + (b.x - a.x) * t) * size)));
      const y = Math.min(size - 1, Math.max(0, Math.floor((a.y + (b.y - a.y) * t) * size)));
      blocked[y * size + x] = 1;
    }
  });
  const seen = new Uint8Array(size * size);
  const stack = [];
  let regions = 0;
  for (let start = 0; start < blocked.length; start += 1) {
    if (blocked[start] || seen[start]) continue;
    regions += 1;
    seen[start] = 1;
    stack.push(start);
    while (stack.length) {
      const value = stack.pop();
      const column = value % size;
      const neighbors = [];
      if (column > 0) neighbors.push(value - 1);
      if (column < size - 1) neighbors.push(value + 1);
      if (value >= size) neighbors.push(value - size);
      if (value + size < blocked.length) neighbors.push(value + size);
      neighbors.forEach((next) => {
        if (!blocked[next] && !seen[next]) {
          seen[next] = 1;
          stack.push(next);
        }
      });
    }
  }
  return regions;
}

function rectPoint(foldSpec, along, depth) {
  if (foldSpec.axis === "vertical") return point(foldSpec.target === "right" ? .5 + depth * .5 : .5 - depth * .5, along);
  return point(along, foldSpec.target === "bottom" ? .5 + depth * .5 : .5 - depth * .5);
}

const RECT_PATTERNS = [
  [[.18, 1, .50, 0]],
  [[.28, 1, .28, 0], [.72, 1, .72, 0]],
  [[.12, 1, .86, 0], [.88, 1, .14, 0]],
  [[.18, 1, .50, 0], [.82, 1, .50, 0]],
  [[.14, 1, .40, 0], [.60, 0, .86, 1]]
];

function diagonalFrame(foldSpec) {
  const frames = {
    "diag-main-upper": [point(0, 0), point(1, 1), point(0, 1)],
    "diag-main-lower": [point(0, 0), point(1, 1), point(1, 0)],
    "diag-anti-upper": [point(1, 0), point(0, 1), point(1, 1)],
    "diag-anti-lower": [point(1, 0), point(0, 1), point(0, 0)]
  };
  const [creaseA, creaseB, corner] = frames[`${foldSpec.axis}-${foldSpec.side}`];
  return { creaseA, creaseB, corner };
}

function pieceSegments(foldSpec, patternIndex) {
  if (!foldSpec.axis.startsWith("diag")) {
    return RECT_PATTERNS[patternIndex % RECT_PATTERNS.length].map(([a1, d1, a2, d2]) => [
      rectPoint(foldSpec, a1, d1), rectPoint(foldSpec, a2, d2)
    ]);
  }
  const { creaseA, creaseB, corner } = diagonalFrame(foldSpec);
  const left = (t) => lerp(creaseA, corner, t);
  const right = (t) => lerp(corner, creaseB, t);
  const crease = (t) => lerp(creaseA, creaseB, t);
  const patterns = [
    [[left(.48), right(.52)]],
    [[left(.22), right(.78)], [left(.78), right(.22)]],
    [[left(.62), crease(.55)]],
    [[left(.32), crease(.36)], [right(.32), crease(.64)]],
    [[left(.18), right(.65)], [left(.72), right(.28)]]
  ];
  return patterns[patternIndex % patterns.length];
}

function orderedChoices(values, answerIndex) {
  const choices = values.map((value, index) => ({ key: String.fromCharCode(97 + index), value, correct: index === 0 }));
  if (answerIndex !== 0) [choices[0], choices[answerIndex]] = [choices[answerIndex], choices[0]];
  choices.forEach((choice, index) => { choice.key = String.fromCharCode(97 + index); });
  return choices;
}

function numberChoices(answer, answerIndex) {
  const alternatives = [answer - 1, answer + 1, answer + 2, Math.max(1, answer - 2)].filter((value) => value > 0 && value !== answer);
  const values = [answer, ...new Set(alternatives)].slice(0, 3);
  while (values.length < 3) values.push(Math.max(...values) + 1);
  return orderedChoices(values, answerIndex);
}

function packetSegments(folds, index) {
  if (folds.length === 1) return pieceSegments(folds[0], index);
  const packet = polygonAfterFolds(folds);
  const { minX, maxX, minY, maxY } = bounds(packet);
  const x1 = minX, x2 = maxX, y1 = minY, y2 = maxY;
  const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
  const patterns = [
    [[point(x1, midY), point(x2, midY)]],
    [[point(midX, y1), point(midX, y2)]],
    [[point(x1, y1), point(x2, y2)]],
    [[point(x1, y2), point(midX, midY)], [point(midX, midY), point(x2, y2)]],
    [[point(x1, y1), point(x2, y2)], [point(x1, y2), point(x2, y1)]]
  ];
  return patterns[index % patterns.length];
}

function pieceSpec(folds, index) {
  let cutSegments, unfoldedSegments, countA;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidateCuts = packetSegments(folds, index + attempt);
    const candidateUnfolded = unfoldSegments(candidateCuts, folds);
    const candidateA = countPieces(candidateUnfolded, 181);
    const candidateB = countPieces(candidateUnfolded, 257);
    if (candidateA === candidateB && candidateA >= 2 && candidateA <= 20) {
      cutSegments = candidateCuts;
      unfoldedSegments = candidateUnfolded;
      countA = candidateA;
      break;
    }
  }
  if (!cutSegments) throw new Error(`Unstable piece count: ${folds.map((item) => `${item.axis}-${item.side}`).join("_")}-${index}`);
  const stagePolygons = [polygonAfterFolds([]), ...folds.map((_, step) => polygonAfterFolds(folds.slice(0, step + 1)))];
  const segmentStages = unfoldSegmentStages(cutSegments, folds);
  const unfoldSteps = reverseUnfoldSteps(folds);
  const choices = numberChoices(countA, index % 3);
  return {
    kind: "pieces", fold: folds[0], folds, stagePolygons,
    cutSegments, unfoldedSegments, pieceCount: countA,
    segmentStages, unfoldSteps,
    choices, answer: choices.find((choice) => choice.correct).key
  };
}

function regionCutSpec(folds, index) {
  const stagePolygons = [polygonAfterFolds([]), ...folds.map((_, step) => polygonAfterFolds(folds.slice(0, step + 1)))];
  const packet = stagePolygons.at(-1);
  const center = point(
    packet.reduce((sum, item) => sum + item.x, 0) / packet.length,
    packet.reduce((sum, item) => sum + item.y, 0) / packet.length
  );
  const start = index % packet.length;
  const vertices = Array.from({ length: 3 }, (_, offset) => packet[(start + offset) % packet.length]);
  const scale = .28 + (index % 3) * .04;
  const cutMarks = [createPolygonMark(vertices.map((item) => point(
    center.x + (item.x - center.x) * scale,
    center.y + (item.y - center.y) * scale
  )))];
  const markStages = unfoldMarkStages(cutMarks, folds).map((stage) => stage.marks);
  return {
    kind: "cut-regions", fold: folds[0], folds, stagePolygons,
    cutMarks, markStages, unfoldSteps: reverseUnfoldSteps(folds), completeOnUnfold: true
  };
}

function bounds(polygon) {
  return {
    minX: Math.min(...polygon.map((item) => item.x)), maxX: Math.max(...polygon.map((item) => item.x)),
    minY: Math.min(...polygon.map((item) => item.y)), maxY: Math.max(...polygon.map((item) => item.y))
  };
}

function punchPoints(finalPolygon, index, count = 1) {
  const { minX, maxX, minY, maxY } = bounds(finalPolygon);
  const ratios = [[.24, .27], [.70, .25], [.28, .72], [.72, .68], [.42, .38], [.62, .58]];
  return Array.from({ length: count }, (_, offset) => {
    const [rx, ry] = ratios[(index + offset * 2) % ratios.length];
    return point(minX + (maxX - minX) * rx, minY + (maxY - minY) * ry);
  });
}

function singleHoleSpec(foldSpec, index) {
  const folded = foldedPolygon(foldSpec);
  const punches = punchPoints(folded, index, 1 + (index % 3));
  const pointStages = unfoldPointStages(punches, [foldSpec]);
  const unfoldedPoints = pointStages.at(-1);
  const unfoldSteps = reverseUnfoldSteps([foldSpec]);
  const choices = numberChoices(unfoldedPoints.length, index % 3);
  return {
    kind: "single-holes", fold: foldSpec, folds: [foldSpec], stagePolygons: [polygonAfterFolds([]), folded],
    punches, unfoldedPoints, pointStages, unfoldSteps,
    choices, answer: choices.find((choice) => choice.correct).key
  };
}

function holeResultChoices(folds, finalPolygon, punches, index) {
  const correct = unfoldPoints(punches, folds);
  const { minX, maxX, minY, maxY } = bounds(finalPolygon);
  const mirrorX = punches.map((p) => point(minX + maxX - p.x, p.y));
  const mirrorY = punches.map((p) => point(p.x, minY + maxY - p.y));
  const choices = [
    { key: "a", points: correct, correct: true, variant: "correct" },
    { key: "b", points: unfoldPoints(mirrorX, folds), correct: false, variant: "wrong-first-fold" },
    { key: "c", points: unfoldPoints(mirrorY, folds), correct: false, variant: "wrong-second-fold" }
  ];
  const answerIndex = index % 3;
  if (answerIndex !== 0) [choices[0], choices[answerIndex]] = [choices[answerIndex], choices[0]];
  choices.forEach((choice, choiceIndex) => { choice.key = String.fromCharCode(97 + choiceIndex); });
  return choices;
}

function doubleHoleSpec(folds, index) {
  const stagePolygons = [polygonAfterFolds([]), polygonAfterFolds([folds[0]]), polygonAfterFolds(folds)];
  const punches = punchPoints(stagePolygons[2], index, 1);
  const pointStages = unfoldPointStages(punches, folds);
  const unfoldedPoints = pointStages.at(-1);
  const unfoldSteps = reverseUnfoldSteps(folds);
  const choices = holeResultChoices(folds, stagePolygons[2], punches, index);
  return {
    kind: "double-holes", folds, stagePolygons, punches, unfoldedPoints, pointStages, unfoldSteps,
    choices, answer: choices.find((choice) => choice.correct).key
  };
}

function mixedHoleSpec(folds, index) {
  const stagePolygons = [polygonAfterFolds([]), polygonAfterFolds([folds[0]]), polygonAfterFolds(folds)];
  const packet = stagePolygons.at(-1);
  const { minX, maxX, minY, maxY } = bounds(packet);
  const width = maxX - minX;
  const height = maxY - minY;
  const radius = Math.min(width, height) * .17;
  const punches = [
    createPunchMark("square", point(minX + width * .32, minY + height * .34), { radius, angle: (index % 2) * Math.PI / 4 }),
    createPunchMark("triangle", point(minX + width * .68, minY + height * .68), { radius, angle: (index % 3) * Math.PI / 3 })
  ];
  const markStages = unfoldMarkStages(punches, folds).map((stage) => stage.marks);
  return {
    kind: "mixed-holes", folds, stagePolygons, punches,
    markStages, unfoldSteps: reverseUnfoldSteps(folds), completeOnUnfold: true
  };
}

function levelOneProblem(index) {
  const useDouble = index % 4 >= 2;
  const folds = useDouble ? DOUBLE_FOLDS[index % DOUBLE_FOLDS.length] : [SINGLE_FOLDS[index % SINGLE_FOLDS.length]];
  if (index % 6 === 2) return {
    id: `paper-region-cut-${String(index + 1).padStart(2, "0")}`, level: 1, interaction: "region-unfold",
    ...regionCutSpec(folds, index), sourceRef: "user-reference.paper-fold.colored-region-unfold",
    sourceAuditRefs: ["PF-A01", "PF-A02", "PF-A03", "PF-B01", "PF-B02", "PF-B03", "PF-B04"], sourceCoverage: "partial"
  };
  if (index % 3 !== 1) return {
    id: `paper-cut-count-${String(index + 1).padStart(2, "0")}`, level: 1, interaction: "piece-count",
    ...pieceSpec(folds, index), sourceRef: useDouble ? "user-reference.kinderfacto.double-fold-piece-count" : "user-reference.kinderfacto.single-fold-piece-count",
    sourceAuditRefs: ["PF-A07", "PF-B09"], sourceCoverage: "partial"
  };
  const pairs = Array.from({ length: 3 }, (_, pairIndex) => {
    const sourceIndex = index * 3 + pairIndex;
    const pairFolds = pairIndex === 1
      ? DOUBLE_FOLDS[sourceIndex % DOUBLE_FOLDS.length]
      : [SINGLE_FOLDS[sourceIndex % SINGLE_FOLDS.length]];
    return { ...pieceSpec(pairFolds, sourceIndex), key: String.fromCharCode(97 + pairIndex) };
  });
  const shift = index % 3;
  return {
    id: `paper-cut-match-${String(index + 1).padStart(2, "0")}`, level: 1, interaction: "connect-match", content: "cut-lines",
    folds: pairs[0].folds, pairs, results: pairs.slice(shift).concat(pairs.slice(0, shift)),
    answer: Object.fromEntries(pairs.map((item) => [item.key, item.key])), sourceRef: "user-reference.kinderfacto.fold-cut-match",
    sourceAuditRefs: ["PF-A01", "PF-B01", "PF-B03"], sourceCoverage: "partial"
  };
}

function levelTwoProblem(index) {
  const useDouble = index % 2 === 0;
  const folds = DOUBLE_FOLDS[index % DOUBLE_FOLDS.length];
  if (index % 6 === 0) return {
    id: `paper-mixed-hole-${String(index + 1).padStart(2, "0")}`, level: 2, interaction: "mixed-hole-result",
    ...mixedHoleSpec(folds, index), sourceRef: "user-reference.paper-fold.mixed-shape-hole-unfold",
    sourceAuditRefs: ["PF-C02", "PF-C04", "PF-C05"], sourceCoverage: "partial"
  };
  if (index % 3 === 0) return {
    id: `paper-double-hole-${String(index + 1).padStart(2, "0")}`, level: 2, interaction: "hole-result",
    ...doubleHoleSpec(folds, index), sourceRef: "user-reference.kinderfacto.double-fold-hole-punch",
    sourceAuditRefs: ["PF-A09", "PF-C03", "PF-C05"], sourceCoverage: "partial"
  };
  if (index % 3 === 2) {
    const foldSpec = SINGLE_FOLDS[index % SINGLE_FOLDS.length];
    return {
      id: `paper-hole-count-${String(index + 1).padStart(2, "0")}`, level: 2, interaction: "hole-count",
      ...singleHoleSpec(foldSpec, index), sourceRef: "user-reference.kinderfacto.single-fold-hole-count",
      sourceAuditRefs: ["PF-A09"], sourceCoverage: "partial"
    };
  }
  const pairs = Array.from({ length: 3 }, (_, pairIndex) => {
    const sourceIndex = index * 3 + pairIndex;
    const item = useDouble || pairIndex === 1
      ? doubleHoleSpec(DOUBLE_FOLDS[sourceIndex % DOUBLE_FOLDS.length], sourceIndex)
      : singleHoleSpec(SINGLE_FOLDS[sourceIndex % SINGLE_FOLDS.length], sourceIndex);
    return { ...item, key: String.fromCharCode(97 + pairIndex) };
  });
  const shift = index % 3;
  return {
    id: `paper-hole-match-${String(index + 1).padStart(2, "0")}`, level: 2, interaction: "connect-match", content: "holes",
    folds: pairs[0].folds, pairs, results: pairs.slice(shift).concat(pairs.slice(0, shift)),
    answer: Object.fromEntries(pairs.map((item) => [item.key, item.key])), sourceRef: "user-reference.kinderfacto.double-fold-hole-match",
    sourceAuditRefs: ["PF-C03", "PF-C04", "PF-C05"], sourceCoverage: "partial"
  };
}

export const levels = levelMeta.map((meta) => ({
  ...meta,
  problems: Array.from({ length: 36 }, (_, index) => meta.id === 1 ? levelOneProblem(index) : levelTwoProblem(index))
}));

const pointsInPaper = (points) => points.every(({ x, y }) => x >= 0 && x <= 1 && y >= 0 && y <= 1);

export function validateLevels() {
  if (levels.length !== 2) throw new Error("Paper fold must have exactly two content types.");
  const ids = new Set();
  levels.forEach((level) => {
    if (level.problems.length !== 36) throw new Error(`Expected 36 problems for ${level.id}`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate paper-fold id: ${problem.id}`);
      ids.add(problem.id);
      if (problem.interaction === "region-unfold") {
        const expectedCounts = Array.from({ length: problem.folds.length + 1 }, (_, index) => 2 ** index);
        if (![1, 2].includes(problem.folds.length) || problem.unfoldSteps.length !== problem.folds.length || problem.markStages.length !== problem.folds.length + 1 || problem.cutMarks.some((mark) => mark.kind !== "polygon")) throw new Error(`Invalid region problem: ${problem.id}`);
        if (problem.markStages.some((stage, index) => stage.length !== expectedCounts[index])) throw new Error(`Invalid region stages: ${problem.id}`);
      } else if (problem.interaction === "mixed-hole-result") {
        const shapes = new Set(problem.punches.map((mark) => mark.shape));
        if (problem.folds.length !== 2 || problem.unfoldSteps.length !== 2 || problem.markStages.length !== 3 || problem.markStages.map((stage) => stage.length).join(",") !== "2,4,8" || !shapes.has("square") || !shapes.has("triangle")) throw new Error(`Invalid mixed-hole problem: ${problem.id}`);
      } else if (problem.interaction === "piece-count") {
        if (![1, 2].includes(problem.folds.length) || problem.unfoldSteps.length !== problem.folds.length || problem.segmentStages.length !== problem.folds.length + 1 || !pointsInPaper(problem.unfoldedSegments.flat())) throw new Error(`Invalid piece problem: ${problem.id}`);
      } else if (problem.interaction === "hole-count") {
        if (problem.folds.length !== 1 || problem.unfoldSteps.length !== 1 || problem.pointStages.length !== 2 || !pointsInPaper(problem.unfoldedPoints)) throw new Error(`Invalid one-fold hole problem: ${problem.id}`);
      } else if (problem.interaction === "hole-result") {
        if (problem.folds.length !== 2 || problem.unfoldSteps.length !== 2 || problem.pointStages.length !== 3 || problem.unfoldedPoints.length !== 4) throw new Error(`Invalid two-fold hole problem: ${problem.id}`);
      } else if (problem.interaction === "connect-match") {
        if (problem.pairs.length !== 3 || problem.results.length !== 3 || Object.keys(problem.answer).length !== 3) throw new Error(`Invalid matching problem: ${problem.id}`);
        if (level.strand === "fold-and-cut" && problem.pairs.some((item) => item.kind !== "pieces")) throw new Error(`Cut matching contains a non-cut item: ${problem.id}`);
        if (level.strand === "fold-and-punch" && problem.pairs.some((item) => !item.kind.includes("holes"))) throw new Error(`Hole matching contains a non-hole item: ${problem.id}`);
      } else throw new Error(`Unknown interaction: ${problem.id}`);
      if (problem.choices && (problem.choices.length !== 3 || !problem.choices.some((choice) => choice.key === problem.answer))) throw new Error(`Invalid choices: ${problem.id}`);
    });
  });
  return true;
}

validateLevels();
