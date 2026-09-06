const round = (value) => Math.round(value * 1000) / 1000;
const PIVOT = [50, 50];
const KINDS = ["same-bends", "translate", "rotate", "enlarge", "reduce"];

export const levelMeta = [
  { id: 1, band: "facto1", title: { ko: "모양 관찰", en: "Observe Shapes", zh: "图形观察", ja: "図形の観察" }, description: { ko: "크기와 방향이 같을 때 꺾인 구간의 위치와 길이 비교", en: "Compare bend positions and lengths at the same size and orientation", zh: "在大小和方向相同时比较折线的位置和长度", ja: "同じ大きさと向きで、曲がる位置と長さを比べる" } },
  { id: 2, band: "1031-intro-entry", title: { ko: "평행이동", en: "Slide", zh: "平移", ja: "平行移動" }, description: { ko: "한 칸은 10, 표시된 방향과 칸 수만큼 모든 점 옮기기", en: "Move every point by the given direction and distance; one grid step is 10", zh: "每格为10，按指定方向和格数移动每个点", ja: "1マスは10。すべての点を指定された向きとマス数だけ動かす" } },
  { id: 3, band: "1031-intro-entry", title: { ko: "회전", en: "Turn", zh: "旋转", ja: "回転" }, description: { ko: "고정된 기준점 (50, 50)을 중심으로 90도 또는 180도 회전", en: "Turn 90 or 180 degrees about the fixed point (50, 50)", zh: "绕固定点 (50, 50) 旋转90度或180度", ja: "固定した点 (50, 50) を中心に90度または180度回す" } },
  { id: 4, band: "1031-basic", title: { ko: "확대", en: "Enlarge", zh: "放大", ja: "拡大" }, description: { ko: "기준점 (50, 50)에서 가로와 세로 거리를 모두 2배로", en: "Double both horizontal and vertical distances from (50, 50)", zh: "把相对点 (50, 50) 的水平和垂直距离都变为2倍", ja: "点 (50, 50) からの横と縦の距離を両方2倍にする" } },
  { id: 5, band: "1031-basic", title: { ko: "줄이기", en: "Reduce", zh: "缩小", ja: "縮小" }, description: { ko: "기준점 (50, 50)에서 가로와 세로 거리를 모두 절반으로", en: "Halve both horizontal and vertical distances from (50, 50)", zh: "把相对点 (50, 50) 的水平和垂直距离都变为一半", ja: "点 (50, 50) からの横と縦の距離を両方半分にする" } }
];

// Fifty owner-designed seeds, not textbook reproductions. Every level alternates
// simple polygons and open bent lines, starting with a polygon.
const seedsByLevel = [
  [
    [[18,18],[70,18],[70,35],[84,35],[84,78],[46,78],[46,62],[18,62]],
    [[14,20],[34,20],[34,38],[57,38],[57,66],[82,66]],
    [[20,20],[78,20],[78,76],[55,76],[55,58],[37,58],[37,76],[20,76]],
    [[15,30],[36,30],[36,61],[54,61],[54,43],[78,43],[78,76]],
    [[16,18],[52,18],[52,32],[82,32],[82,75],[64,75],[64,58],[35,58],[35,75],[16,75]],
    [[13,67],[32,67],[32,39],[53,39],[53,18],[77,18],[77,52]],
    [[18,20],[82,20],[82,50],[67,50],[67,78],[38,78],[38,62],[18,62]],
    [[17,78],[17,55],[38,55],[38,31],[63,31],[63,61],[84,61]],
    [[18,18],[75,18],[75,38],[84,38],[84,74],[48,74],[48,58],[18,58]],
    [[16,70],[40,70],[40,46],[58,46],[58,21],[82,21]]
  ],
  [
    [[32,32],[58,32],[58,44],[68,44],[68,66],[32,66]],
    [[32,36],[46,36],[46,50],[66,50],[66,68]],
    [[34,32],[66,32],[66,64],[54,64],[54,48],[34,48]],
    [[34,66],[34,50],[50,50],[50,34],[68,34],[68,44]],
    [[32,34],[44,34],[44,44],[68,44],[68,66],[32,66]],
    [[32,34],[50,34],[50,46],[64,46],[64,66],[54,66]],
    [[34,32],[66,32],[66,44],[54,44],[54,66],[34,66]],
    [[34,64],[46,64],[46,44],[66,44],[66,32]],
    [[32,32],[68,32],[68,66],[56,66],[56,54],[44,54],[44,66],[32,66]],
    [[32,66],[32,52],[48,52],[48,34],[68,34]]
  ],
  [
    [[50,50],[20,50],[20,22],[34,22],[34,36],[50,36]],
    [[50,50],[50,26],[70,26],[70,38],[82,38]],
    [[50,50],[50,20],[76,20],[76,34],[64,34],[64,50]],
    [[50,50],[24,50],[24,68],[38,68],[38,82]],
    [[50,50],[78,50],[78,76],[66,76],[66,64],[50,64]],
    [[50,50],[50,78],[28,78],[28,64],[16,64]],
    [[50,50],[50,80],[22,80],[22,68],[36,68],[36,50]],
    [[50,50],[76,50],[76,30],[62,30],[62,16]],
    [[50,50],[18,50],[18,18],[38,18],[38,30],[50,30]],
    [[50,50],[50,22],[28,22],[28,36],[16,36],[16,66]]
  ],
  [
    [[30,30],[62,30],[62,42],[70,42],[70,66],[30,66]],
    [[30,34],[46,34],[46,50],[66,50],[66,70]],
    [[32,30],[70,30],[70,68],[56,68],[56,48],[32,48]],
    [[30,68],[30,50],[50,50],[50,30],[68,30],[68,42]],
    [[30,32],[46,32],[46,44],[68,44],[68,70],[30,70]],
    [[32,30],[50,30],[50,44],[70,44],[70,68],[56,68]],
    [[30,30],[68,30],[68,46],[52,46],[52,70],[30,70]],
    [[30,68],[46,68],[46,42],[70,42],[70,30]],
    [[30,32],[70,32],[70,70],[56,70],[56,54],[44,54],[44,70],[30,70]],
    [[32,70],[32,52],[50,52],[50,30],[70,30]]
  ],
  [
    [[14,16],[62,16],[62,36],[84,36],[84,82],[14,82]],
    [[16,20],[42,20],[42,50],[82,50],[82,86]],
    [[18,14],[84,14],[84,80],[58,80],[58,46],[18,46]],
    [[14,82],[14,50],[48,50],[48,16],[82,16],[82,38]],
    [[16,18],[42,18],[42,38],[86,38],[86,84],[16,84]],
    [[18,16],[50,16],[50,42],[84,42],[84,82],[60,82]],
    [[14,18],[82,18],[82,44],[52,44],[52,86],[14,86]],
    [[16,84],[44,84],[44,38],[84,38],[84,14]],
    [[14,16],[86,16],[86,84],[60,84],[60,54],[38,54],[38,84],[14,84]],
    [[18,86],[18,52],[52,52],[52,14],[86,14]]
  ]
];

// Screen coordinates: +x right, +y down, so positive angles are clockwise.
// Omitted pivots keep the original helper's vertex-mean behavior for external
// callers. Every rotation/scaling problem explicitly supplies [50, 50].
export function transformPoints(points, { scale = 1, angle = 0, dx = 0, dy = 0, pivot } = {}) {
  const center = pivot ?? points.reduce((sum, [x, y]) => [sum[0] + x, sum[1] + y], [0, 0]).map((value) => value / points.length);
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return points.map(([x, y]) => {
    const px = (x - center[0]) * scale;
    const py = (y - center[1]) * scale;
    return [round(center[0] + px * cos - py * sin + dx), round(center[1] + px * sin + py * cos + dy)];
  });
}

export const pointsKey = (points) => points.map(([x, y]) => `${round(x)},${round(y)}`).join("|");
const samePoints = (a, b) => pointsKey(a) === pointsKey(b);

function visualKey(points, closed) {
  const orders = [points, [...points].reverse()];
  return orders.flatMap((order) => closed ? order.map((_, i) => pointsKey([...order.slice(i), ...order.slice(0, i)])) : [pointsKey(order)]).sort()[0];
}

function bentSectionVariant(points, segmentIndex, amount) {
  const vertical = points[segmentIndex][0] === points[segmentIndex + 1][0];
  return points.map(([x, y], i) => i === segmentIndex || i === segmentIndex + 1 ? [x + (vertical ? amount : 0), y + (vertical ? 0 : amount)] : [x, y]);
}

function stretch(points, sx, sy) {
  return points.map(([x, y]) => [50 + (x - 50) * sx, 50 + (y - 50) * sy]);
}

const vectors = [[10,0],[0,10],[-10,0],[0,-10],[10,10],[-10,10],[10,-10],[-10,-10],[20,0],[0,-20]];

function operationFor(level, index) {
  if (level === 1) return { kind: "same-bends" };
  if (level === 2) return { kind: "translate", dx: vectors[index][0], dy: vectors[index][1] };
  if (level === 3) return { kind: "rotate", angle: [90, -90, 180][index % 3], pivot: [...PIVOT] };
  return { kind: KINDS[level - 1], scale: level === 4 ? 2 : .5, pivot: [...PIVOT] };
}

function explanationFor(operation) {
  if (operation.kind === "same-bends") return { ko: "크기와 방향은 그대로입니다. 꺾인 구간의 위치와 길이가 모두 같은 보기를 고릅니다.", en: "Size and orientation are unchanged. Match the position and length of every bent section." };
  if (operation.kind === "translate") return { ko: `모든 점에 같은 이동 (${operation.dx}, ${operation.dy})을 적용합니다. 양수는 오른쪽 또는 아래쪽입니다.`, en: `Add (${operation.dx}, ${operation.dy}) to every point. Positive x is right and positive y is down.` };
  if (operation.kind === "rotate") return { ko: `(50, 50)을 고정하고 ${operation.angle === -90 ? "반시계 방향 90" : `시계 방향 ${operation.angle}`}도 돌립니다. 길이와 기준점까지의 거리는 변하지 않습니다.`, en: `Keep (50, 50) fixed and turn ${Math.abs(operation.angle)} degrees ${operation.angle < 0 ? "counterclockwise" : "clockwise"}. Lengths and distances from the pivot stay the same.` };
  return { ko: `(50, 50)에서 각 점까지의 가로와 세로 거리를 모두 ${operation.scale === 2 ? "2배" : "절반"}로 만듭니다. 한 방향만 바꾸면 모양이 달라집니다.`, en: `Multiply both coordinate offsets from (50, 50) by ${operation.scale}. Changing only one axis distorts the shape.` };
}

function buildProblem(level, seed, index) {
  const target = seed.map((point) => [...point]);
  const operation = operationFor(level, index);
  const correct = transformPoints(target, operation);
  let distractors;
  if (level === 1) {
    const sectionCount = target.length - 3;
    distractors = [bentSectionVariant(target, 1 + index % sectionCount, 4), bentSectionVariant(target, 1 + (index + 2) % sectionCount, -4)];
  } else if (level === 2) {
    const distanceFactor = index < 8 ? 2 : .5;
    distractors = [transformPoints(target, { dx: -operation.dx, dy: -operation.dy }), transformPoints(target, { dx: operation.dx * distanceFactor, dy: operation.dy * distanceFactor })];
  } else if (level === 3) {
    const wrongAngle = operation.angle === 180 ? (index % 2 ? -90 : 90) : -operation.angle;
    distractors = [transformPoints(target), transformPoints(target, { angle: wrongAngle, pivot: PIVOT })];
  } else {
    distractors = [transformPoints(target), stretch(target, index % 2 ? 1 : operation.scale, index % 2 ? operation.scale : 1)];
  }
  const choices = [correct, ...distractors];
  const answerIndex = (index + level) % 3;
  [choices[0], choices[answerIndex]] = [choices[answerIndex], choices[0]];
  return {
    id: `shape-transform-l${level}-${String(index + 1).padStart(2, "0")}`,
    level, closed: index % 2 === 0, target, operation, choices, answerIndex,
    sourceRef: `owner-designed-shape-transform-v2-${operation.kind}-seed-${String(index + 1).padStart(2, "0")}`,
    explanation: explanationFor(operation)
  };
}

export const levels = levelMeta.map((meta, index) => ({ ...meta, problems: seedsByLevel[index].map((seed, i) => buildProblem(meta.id, seed, i)) }));

export function expectedFor(problem) {
  return transformPoints(problem.target, problem.operation);
}

function fail(condition, message, id) {
  if (!condition) throw new Error(`${message}: ${id}`);
}

function checkShape(points, closed, id) {
  fail(Array.isArray(points) && points.length >= (closed ? 4 : 3), "Invalid point list", id);
  fail(points.every((point) => Array.isArray(point) && point.length === 2 && point.every((v) => Number.isFinite(v) && v >= 6 && v <= 94)), "Coordinates must stay within 6..94", id);
  fail(new Set(points.map((p) => pointsKey([p]))).size === points.length, "Repeated vertex", id);
  const edges = points.slice(0, closed ? points.length : -1).map((a, i) => [a, points[(i + 1) % points.length]]);
  fail(edges.every(([a, b]) => (a[0] === b[0]) !== (a[1] === b[1])), "All lines must keep right-angle bends with nonzero length", id);
  const directions = edges.map(([a, b]) => a[0] === b[0] ? "v" : "h");
  fail(directions.every((axis, i) => i === directions.length - 1 && !closed || axis !== directions[(i + 1) % directions.length]), "Degenerate straight or reversing bend", id);
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 2; j < edges.length; j++) {
      if (closed && i === 0 && j === edges.length - 1) continue;
      const [a, b] = edges[i], [c, d] = edges[j];
      const overlaps = [0, 1].every((axis) => Math.max(Math.min(a[axis], b[axis]), Math.min(c[axis], d[axis])) <= Math.min(Math.max(a[axis], b[axis]), Math.max(c[axis], d[axis])));
      fail(!overlaps, "Self-intersection or touching nonadjacent edges", id);
    }
  }
}

function checkOperation(problem) {
  const { operation: op, level, id } = problem;
  fail(op && op.kind === KINDS[level - 1], "Operation does not match domain", id);
  const allowed = level === 1 ? ["kind"] : level === 2 ? ["kind", "dx", "dy"] : level === 3 ? ["kind", "angle", "pivot"] : ["kind", "scale", "pivot"];
  fail(Object.keys(op).every((key) => allowed.includes(key)), "Unexpected operation component", id);
  if (level === 2) fail([op.dx, op.dy].every((v) => Number.isFinite(v) && v % 10 === 0) && (op.dx !== 0 || op.dy !== 0), "Translation needs a nonzero 10-unit vector", id);
  if (level >= 3) fail(Array.isArray(op.pivot) && op.pivot.length === 2 && op.pivot[0] === 50 && op.pivot[1] === 50, "Explicit pivot must be [50,50]", id);
  if (level === 3) fail([90, -90, 180].includes(op.angle), "Unsupported rotation angle", id);
  if (level >= 4) fail(op.scale === (level === 4 ? 2 : .5), "Incorrect domain scale factor", id);
}

function checkDistractors(problem) {
  const { target, choices, answerIndex, operation: op, level, id } = problem;
  const wrong = choices.filter((_, i) => i !== answerIndex);
  if (level === 1) {
    for (const choice of wrong) {
      const changed = choice.map((p, i) => samePoints([p], [target[i]]) ? -1 : i).filter((i) => i >= 0);
      fail(changed.length === 2 && changed[0] >= 1 && changed[1] === changed[0] + 1 && changed[1] < target.length - 1, "Observation distractor must move one internal bent section", id);
      const first = changed[0], vertical = target[first][0] === target[first + 1][0];
      const amount = choice[first][vertical ? 0 : 1] - target[first][vertical ? 0 : 1];
      fail(Math.abs(amount) >= 3 && Math.abs(amount) <= 6 && samePoints(choice, bentSectionVariant(target, first, amount)), "Observation bend difference must be subtle and perpendicular", id);
    }
    return;
  }
  if (level === 2) {
    const offsets = wrong.map((choice) => {
      const dx = choice[0][0] - target[0][0], dy = choice[0][1] - target[0][1];
      fail(dx % 10 === 0 && dy % 10 === 0 && samePoints(choice, transformPoints(target, { dx, dy })), "Translation distractors must preserve shape and orientation", id);
      return [dx, dy];
    });
    fail(offsets.some(([dx, dy]) => dx === -op.dx && dy === -op.dy), "Missing wrong-direction translation", id);
    fail(offsets.some(([dx, dy]) => dx * op.dy === dy * op.dx && dx * op.dx + dy * op.dy > 0 && (dx !== op.dx || dy !== op.dy)), "Missing wrong-distance translation", id);
    return;
  }
  fail(wrong.some((choice) => samePoints(choice, target)), "Missing unchanged distractor", id);
  const changed = wrong.find((choice) => !samePoints(choice, target));
  if (level === 3) {
    const wrongAngles = op.angle === 180 ? [90, -90] : [-op.angle];
    fail(wrongAngles.some((angle) => samePoints(changed, transformPoints(target, { angle, pivot: op.pivot }))), "Rotation distractor must be a wrong turn about the fixed pivot", id);
  } else {
    fail([stretch(target, op.scale, 1), stretch(target, 1, op.scale)].some((shape) => samePoints(shape, changed)), "Scaling distractor must change only one axis", id);
  }
}

export function validateLevels(candidateLevels = levels) {
  fail(Array.isArray(candidateLevels) && candidateLevels.length === 5, "Shape transform must contain five levels", "bank");
  const ids = new Set(), targets = new Set();
  candidateLevels.forEach((level, levelIndex) => {
    fail(level.id === levelIndex + 1 && level.problems.length === 10, "Invalid shape-transform level", level.id);
    level.problems.forEach((problem, index) => {
      const { id } = problem;
      fail(typeof id === "string" && id.length > 0 && !ids.has(id), "Missing or duplicate problem id", id);
      ids.add(id);
      fail(problem.level === level.id && problem.closed === (index % 2 === 0), "Invalid domain or closed/open alternation", id);
      fail(typeof problem.sourceRef === "string" && problem.sourceRef.startsWith("owner-designed-"), "Missing owner-designed source reference", id);
      checkOperation(problem);
      checkShape(problem.target, problem.closed, id);
      const targetKey = `${problem.closed}:${visualKey(problem.target, problem.closed)}`;
      fail(!targets.has(targetKey), "Duplicate seed geometry", id);
      targets.add(targetKey);
      fail(Array.isArray(problem.choices) && problem.choices.length === 3, "Exactly three choices required", id);
      fail(Number.isInteger(problem.answerIndex) && problem.answerIndex >= 0 && problem.answerIndex < 3, "Invalid answer index", id);
      problem.choices.forEach((choice) => {
        checkShape(choice, problem.closed, id);
        fail(choice.length === problem.target.length, "Choice must preserve vertex count", id);
      });
      const keys = problem.choices.map((choice) => visualKey(choice, problem.closed));
      fail(new Set(keys).size === 3, "Choices must be visually unique", id);
      const expected = visualKey(expectedFor(problem), problem.closed);
      fail(keys.filter((key) => key === expected).length === 1 && keys[problem.answerIndex] === expected, "Single-answer failure", id);
      checkDistractors(problem);
    });
  });
  return true;
}
