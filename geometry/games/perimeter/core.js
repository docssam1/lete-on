// Original lattice problems, authored for this bank rather than copied from sources.
const SIZE = 6;
const LANGS = ["ko", "en", "zh", "ja"];
const locale = lang => LANGS.includes(lang) ? lang : "ko";
const freeze = value => {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const domains = freeze([
  { id: "boundary", level: 1, names: { ko: "바깥 경계의 둘레", en: "Trace the perimeter", zh: "沿边数周长", ja: "まわりの長さを数える" } },
  { id: "joined", level: 2, names: { ko: "붙인 도형의 둘레", en: "Join two rectangles", zh: "拼接图形的周长", ja: "合わせた図形のまわり" } },
  { id: "compare", level: 3, names: { ko: "두 도형의 둘레 비교", en: "Compare perimeters", zh: "比较周长", ja: "まわりの長さを比べる" } },
  { id: "build", level: 4, names: { ko: "같은 둘레의 다른 모양", en: "Same perimeter, new shape", zh: "周长相同，形状不同", ja: "同じ長さで違う形を作る" } }
]);

const coordinate = point => Array.isArray(point) && point.length === 2 &&
  Number.isSafeInteger(point[0]) && Number.isSafeInteger(point[1]);
const key = ([x, y]) => `${x},${y}`;
const pointOrder = (a, b) => a[0] - b[0] || a[1] - b[1];
const neighbors = ([x, y]) => [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];

// Geometry helpers accept bank cells or coordinate pairs. Build responses remain pairs only.
function pointsOf(cells) {
  if (!Array.isArray(cells)) return null;
  const points = [];
  for (const cell of cells) {
    const point = Array.isArray(cell) ? cell : [cell?.x, cell?.y];
    if (!coordinate(point)) return null;
    points.push([...point]);
  }
  return new Set(points.map(key)).size === points.length ? points : null;
}

function edgeBetween(a, b) {
  const [from, to] = [a, b].sort(pointOrder);
  return { id: `${key(from)}:${key(to)}`, from, to };
}

export function boundaryEdges(cells) {
  const points = pointsOf(cells);
  if (!points) return [];
  const edges = new Map();
  for (const [x, y] of points) {
    const corners = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]];
    for (let i = 0; i < 4; i++) {
      const edge = edgeBetween(corners[i], corners[(i + 1) % 4]);
      if (edges.has(edge.id)) edges.delete(edge.id);
      else edges.set(edge.id, edge);
    }
  }
  return [...edges.values()].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

export function perimeterOf(cells) {
  return pointsOf(cells) ? boundaryEdges(cells).length : NaN;
}

export function sharedEdges(groups) {
  if (!Array.isArray(groups) || groups.length < 2) return [];
  const points = groups.map(pointsOf);
  if (points.some(group => !group)) return [];
  const all = points.flat();
  if (new Set(all.map(key)).size !== all.length) return [];
  const edges = new Map(), counts = new Map();
  for (const group of groups) for (const edge of boundaryEdges(group)) {
    edges.set(edge.id, edge);
    counts.set(edge.id, (counts.get(edge.id) || 0) + 1);
  }
  return [...edges.values()].filter(edge => counts.get(edge.id) > 1)
    .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

export function connectedCells(coords) {
  if (!Array.isArray(coords) || !coords.length || !Array.from(coords).every(coordinate)) return false;
  const remaining = new Set(coords.map(key));
  if (remaining.size !== coords.length) return false;
  const queue = [coords[0]];
  remaining.delete(key(coords[0]));
  for (let i = 0; i < queue.length; i++) {
    for (const point of neighbors(queue[i])) {
      if (remaining.delete(key(point))) queue.push(point);
    }
  }
  return remaining.size === 0;
}

export function hasHoles(cells) {
  const points = pointsOf(cells);
  if (!points?.length) return false;
  const occupied = new Set(points.map(key));
  const minX = Math.min(...points.map(p => p[0])) - 1;
  const maxX = Math.max(...points.map(p => p[0])) + 1;
  const minY = Math.min(...points.map(p => p[1])) - 1;
  const maxY = Math.max(...points.map(p => p[1])) + 1;
  const queue = [[minX, minY]], reached = new Set([key(queue[0])]);
  // Flood the unshaded exterior, including a one-cell frame around the figure.
  for (let i = 0; i < queue.length; i++) {
    for (const point of neighbors(queue[i])) {
      const [x, y] = point, id = key(point);
      if (x < minX || x > maxX || y < minY || y > maxY || occupied.has(id) || reached.has(id)) continue;
      reached.add(id);
      queue.push(point);
    }
  }
  for (let y = minY + 1; y < maxY; y++) for (let x = minX + 1; x < maxX; x++) {
    const id = key([x, y]);
    if (!occupied.has(id) && !reached.has(id)) return true;
  }
  return false;
}

export function shapeKey(cells) {
  const points = pointsOf(cells);
  if (!points?.length) return "";
  const variants = [];
  for (const mirror of [1, -1]) for (let turn = 0; turn < 4; turn++) {
    const transformed = points.map(([x, y]) => {
      x *= mirror;
      for (let i = 0; i < turn; i++) [x, y] = [-y, x];
      return [x, y];
    });
    const minX = Math.min(...transformed.map(p => p[0]));
    const minY = Math.min(...transformed.map(p => p[1]));
    variants.push(transformed.map(([x, y]) => [x - minX, y - minY]).sort(pointOrder).map(key).join(";"));
  }
  return variants.sort()[0];
}

function figure(rows) {
  const width = Math.max(...rows.map(row => row.length));
  const dx = Math.floor((SIZE - width) / 2), dy = Math.floor((SIZE - rows.length) / 2);
  return rows.flatMap((row, y) => [...row].flatMap((symbol, x) =>
    symbol === "#" ? [{ x: x + dx, y: y + dy }] : []));
}

const boundaryFigures = [
  ["##", "#."],
  ["##", "##"],
  ["###"],
  ["###", ".#."],
  ["#.", "#.", "##"],
  ["##.", ".##"],
  ["###", "###"],
  [".#.", "###", ".#."],
  ["#.#", "###"],
  ["#..", "##.", "###"],
  ["####", ".#..", ".#.."],
  ["#.#", "###", "###"],
  ["####", "####", "####"],
  ["##..", ".##.", "..##", "...#"],
  ["..#..", "..#..", "#####", "..#..", "..#.."],
  ["#....", "##...", "###..", "####.", "#####"],
  ["#...#", "#...#", "#####"],
  ["#####", "#....", "####.", "...#.", "..##."],
  ["#.#.#.", "######", "#.#.#."],
  ["#####", "....#", "#####", "#....", "###.."]
].map(figure);

function rectangle([x, y, width, height]) {
  return Array.from({ length: height }, (_, dy) =>
    Array.from({ length: width }, (_, dx) => ({ x: x + dx, y: y + dy }))).flat();
}

// Each pair is [x, y, width, height]. Rectangles have no overlapping cells.
const joinedRectangles = [
  [[0, 0, 1, 2], [1, 0, 1, 2]],
  [[0, 0, 1, 2], [1, 1, 1, 1]],
  [[0, 0, 3, 1], [1, 1, 1, 1]],
  [[0, 0, 2, 1], [1, 1, 2, 1]],
  [[0, 0, 1, 3], [1, 2, 2, 1]],
  [[0, 0, 2, 2], [2, 0, 1, 2]],
  [[0, 0, 2, 3], [2, 0, 1, 1]],
  [[0, 0, 2, 2], [2, 0, 2, 1]],
  [[0, 0, 3, 2], [1, 2, 1, 2]],
  [[0, 0, 2, 3], [2, 1, 2, 2]],
  [[0, 0, 3, 3], [3, 2, 2, 1]],
  [[0, 0, 3, 2], [1, 2, 3, 2]],
  [[0, 0, 1, 5], [1, 0, 4, 2]],
  [[0, 0, 2, 4], [2, 2, 3, 2]],
  [[0, 0, 3, 3], [3, 1, 2, 3]],
  [[0, 0, 4, 3], [1, 3, 2, 2]],
  [[0, 0, 3, 5], [3, 3, 2, 1]],
  [[0, 0, 3, 4], [3, 1, 2, 3]],
  [[0, 0, 4, 4], [4, 1, 1, 3]],
  [[0, 0, 4, 4], [1, 4, 2, 2]]
];

const comparePairs = [
  [1, 6], [0, 2], [3, 1],
  [5, 7], [3, 6], [8, 4],
  [9, 11], [7, 9], [10, 8],
  [12, 14], [10, 12], [13, 9],
  [13, 14], [14, 15], [16, 11],
  [15, 18], [15, 16], [17, 12],
  [18, 19], [19, 17]
];

// References are all distinct up to translation, rotation, and reflection.
const buildReferences = [
  ...boundaryFigures.slice(0, 17), boundaryFigures[18],
  figure(["######", "######", "######", "######"]),
  figure(["######", ".....#", "..####"])
];
const buildExamples = [
  ["##", "##"], ["##", "#."], ["##", "#."],
  ["#.", "#.", "##"], ["###", ".#."], ["###", ".#."], ["###", ".#."],
  ["#####"], ["#####"], ["#####"],
  ["######"], ["######"], ["######"],
  ["######", "#....."],
  ["#####", "#####", "#####", "#####", "#####"],
  ["#####", "#####", "#####", "#####", "#####"],
  ["#####", "#####", "#####", "#####", "#####"],
  ["######", ".....#", ".#####"],
  ["#####", "#####", "#####", "#####", "#####"],
  ["######", "######", "######", "######", "######", "######"]
].map(figure);

function base(domain, index) {
  return { id: `perimeter-${domain}-${String(index + 1).padStart(2, "0")}`, domain, index, size: SIZE };
}
const pools = freeze({
  boundary: boundaryFigures.map((cells, index) => ({ ...base("boundary", index), cells })),
  joined: joinedRectangles.map((specs, index) => {
    const groups = specs.map(rectangle);
    return { ...base("joined", index), cells: groups.flat(), groups };
  }),
  compare: comparePairs.map(([a, b], index) => ({
    ...base("compare", index), cells: boundaryFigures[a], other: boundaryFigures[b]
  })),
  build: buildReferences.map((cells, index) => ({
    ...base("build", index), cells, target: perimeterOf(cells), example: buildExamples[index]
  }))
});
const EMPTY = Object.freeze([]);

export function problemsFor(domain) {
  return typeof domain === "string" && Object.hasOwn(pools, domain) ? pools[domain] : EMPTY;
}

export function answerFor(p) {
  if (p.domain === "boundary" || p.domain === "joined") return perimeterOf(p.cells);
  if (p.domain === "compare") {
    const difference = perimeterOf(p.cells) - perimeterOf(p.other);
    return difference < 0 ? "less" : difference > 0 ? "greater" : "equal";
  }
  if (p.domain === "build") return p.target;
  throw new RangeError("Unknown perimeter domain");
}

const result = (valid, correct, kind) => ({ valid, correct, kind });
export function grade(p, response) {
  if (!p || typeof p.domain !== "string" || !Object.hasOwn(pools, p.domain)) return result(false, false, "invalid");
  if (response == null || (typeof response === "string" && !response.trim())) return result(false, false, "empty");
  if (p.domain === "build") {
    if (!Array.isArray(response)) return result(false, false, "invalid");
    if (!response.length) return result(false, false, "empty");
    if (!Array.from(response).every(coordinate)) return result(false, false, "invalid");
    if (response.some(point => point.some(n => n < 0 || n >= p.size))) return result(true, false, "outside");
    if (new Set(response.map(key)).size !== response.length) return result(true, false, "duplicate");
    if (!connectedCells(response)) return result(true, false, "disconnected");
    if (hasHoles(response)) return result(true, false, "hole");
    if (shapeKey(response) === shapeKey(p.cells)) return result(true, false, "same-shape");
    const correct = perimeterOf(response) === p.target;
    return result(true, correct, correct ? "correct" : "retry");
  }
  if (p.domain === "compare") {
    if (!["less", "equal", "greater"].includes(response)) return result(false, false, "invalid");
    const correct = response === answerFor(p);
    return result(true, correct, correct ? "correct" : "retry");
  }
  // Text inputs may contain decimal digits only; never coerce objects or booleans.
  let value = response;
  if (typeof value === "string") {
    if (!/^\d+$/.test(value.trim())) return result(false, false, "invalid");
    value = Number(value.trim());
  }
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) return result(false, false, "invalid");
  const correct = value === answerFor(p);
  return result(true, correct, correct ? "correct" : "retry");
}

const copy = {
  ko: {
    unit: "한 칸의 변 길이 = 1",
    boundary: "색칠한 도형의 바깥 경계를 한 바퀴 돌면 길이는 얼마인가요?",
    joined: "두 직사각형을 붙인 도형의 바깥 둘레를 구하세요. 서로 붙은 공통 변은 세지 않아요.",
    compare: "A의 둘레를 B의 둘레와 비교하세요. 두 격자의 한 칸의 변 길이는 같아요.",
    build: n => `A의 둘레는 ${n}입니다. B에 둘레가 같고 모양은 다른 도형을 만드세요. 6 × 6 격자 안에서 모든 칸이 변끼리 이어지고 구멍이 없어야 해요. A를 옮기거나 돌리거나 뒤집기만 한 것은 같은 모양이에요.`,
    hints: {
      boundary: "바깥의 짧은 변을 하나씩 짚으며 한 바퀴 돌아보세요. 안쪽으로 들어간 오목한 부분도 따라가고, 칸 사이에 붙은 변은 세지 않아요.",
      joined: "두 직사각형이 맞닿은 변을 찾아보세요. 이 변은 합친 도형의 안쪽에 있어요. 바깥에 남은 변만 한 번씩 세어 보세요.",
      compare: "두 도형의 바깥 경계를 각각 한 바퀴 세어 보세요. 짧은 변들을 한 줄로 펴서 비교한다고 생각해 보세요.",
      build: "칸을 변끼리 붙이고 둘레를 다시 세어 보세요. 구멍은 남기지 않아요. 옮기기·돌리기·뒤집기로 A와 겹쳐지면 같은 모양이에요."
    },
    boundarySolution: n => `바깥 경계의 길이 1인 변이 ${n}개이므로 둘레는 ${n}입니다. 오목하게 들어간 경계도 포함합니다.`,
    joinedSolution: (a, b, common, n) => `두 직사각형의 둘레는 ${a}와 ${b}이고, 공통 변의 길이는 ${common}입니다. 공통 변이 두 번 들어 있으므로 ${a} + ${b} - ${common} - ${common} = ${n}입니다.`,
    compareSolution: (a, b, sign) => `A의 둘레는 ${a}, B의 둘레는 ${b}입니다. 따라서 둘레는 A ${sign} B입니다.`,
    buildSolution: (n, accepted) => accepted
      ? `만든 도형의 둘레는 ${n}이고, 칸이 변끼리 이어져 있으며 구멍이 없습니다. A를 옮기거나 돌리거나 뒤집어도 겹쳐지지 않는 다른 모양이므로 정답입니다.`
      : `예시 도형의 둘레는 ${n}이고, 칸이 변끼리 이어져 있으며 구멍이 없습니다. A를 옮기거나 돌리거나 뒤집어도 겹쳐지지 않습니다. 이 조건을 만족하는 다른 도형도 모두 정답입니다.`
  },
  en: {
    unit: "Side length of one grid square = 1",
    boundary: "What is the length of one trip around the outside of the shaded shape?",
    joined: "Find the outside perimeter of the two joined rectangles. Do not count their shared sides.",
    compare: "Compare the perimeter of A with the perimeter of B. A grid square has the same side length in both grids.",
    build: n => `A has perimeter ${n}. In B, make a different shape with the same perimeter. Stay inside the 6 × 6 grid, join all shaded squares along sides, and leave no holes. Moving, turning, or flipping A still counts as the same shape.`,
    hints: {
      boundary: "Trace each short outside side once, all the way around. Follow inward notches too. Do not count sides between joined squares.",
      joined: "Find the sides where the rectangles touch. These are inside the combined shape. Count each remaining outside side once.",
      compare: "Count one trip around each shape. Imagine straightening the short boundary sides into a line to compare their lengths.",
      build: "Join squares along sides and recount the outside boundary. Leave no holes. A shape that matches A after moving, turning, or flipping is still the same shape."
    },
    boundarySolution: n => `There are ${n} outside sides of length 1, so the perimeter is ${n}. The boundary includes inward notches.`,
    joinedSolution: (a, b, common, n) => `The rectangles have perimeters ${a} and ${b}. Their shared length is ${common}, counted twice in that sum. The outside perimeter is ${a} + ${b} - ${common} - ${common} = ${n}.`,
    compareSolution: (a, b, sign) => `A has perimeter ${a} and B has perimeter ${b}. Comparing perimeters: A ${sign} B.`,
    buildSolution: (n, accepted) => accepted
      ? `Your shape has perimeter ${n}, all squares are joined along sides, and there are no holes. It cannot match A by moving, turning, or flipping, so it is correct.`
      : `The example has perimeter ${n}, all squares are joined along sides, and there are no holes. It cannot match A by moving, turning, or flipping. Every other shape meeting these conditions is also correct.`
  },
  zh: {
    unit: "一个方格的边长 = 1",
    boundary: "沿涂色图形的外边界走一圈，长度是多少？",
    joined: "求两个长方形拼成的图形的外周长。不要数它们相接的公共边。",
    compare: "比较A的周长与B的周长。两个方格图中，一个方格的边长相同。",
    build: n => `A的周长是${n}。在B中画出周长相同、形状不同的图形。图形必须在6 × 6方格内，所有涂色方格通过边连成一个整体，且没有孔洞。只将A平移、旋转或翻转，仍算同一种形状。`,
    hints: {
      boundary: "沿外边界把每条短边数一次，走完整整一圈。凹进去的边界也要数，方格之间相接的边不数。",
      joined: "先找两个长方形相接的边。这些边在拼成的图形内部。只把剩下的外边界数一次。",
      compare: "分别沿两个图形的外边界数一圈。想象把这些短边排成一条直线，再比较长度。",
      build: "让方格通过边相连，再数外边界的长度。不要留下孔洞。如果平移、旋转或翻转后能与A重合，就仍是同一种形状。"
    },
    boundarySolution: n => `外边界上有${n}条长度为1的短边，所以周长是${n}。凹进去的边界也包括在内。`,
    joinedSolution: (a, b, common, n) => `两个长方形的周长是${a}和${b}，公共边的总长度是${common}。相加时公共边被数了两次，所以外周长是${a} + ${b} - ${common} - ${common} = ${n}。`,
    compareSolution: (a, b, sign) => `A的周长是${a}，B的周长是${b}。比较周长可得：A ${sign} B。`,
    buildSolution: (n, accepted) => accepted
      ? `你画的图形周长是${n}，所有方格通过边相连，没有孔洞。平移、旋转或翻转后也不能与A重合，所以答案正确。`
      : `示例的周长是${n}，所有方格通过边相连，没有孔洞。平移、旋转或翻转后也不能与A重合。满足这些条件的其他图形也都正确。`
  },
  ja: {
    unit: "ひとますの辺の長さ = 1",
    boundary: "色のついた図形の外側を一周すると、長さはいくつですか。",
    joined: "二つの長方形を合わせた図形のまわりの長さを求めましょう。くっついた共通の辺は数えません。",
    compare: "Aのまわりの長さをBのまわりの長さと比べましょう。どちらの方眼も、ひとますの辺の長さは同じです。",
    build: n => `Aのまわりの長さは${n}です。Bに、まわりの長さが同じで形が違う図形を作りましょう。6 × 6の方眼の中で、すべてのますを辺で一つにつなぎ、穴を作らないようにします。Aを動かす・回す・裏返すだけでは、同じ形とみなします。`,
    hints: {
      boundary: "外側の短い辺を一つずつたどって、一周しましょう。へこんだ部分の辺も数えます。ます同士がくっついた辺は数えません。",
      joined: "長方形同士がくっついた辺を見つけましょう。その辺は合わせた図形の内側にあります。外側に残った辺だけを一度ずつ数えます。",
      compare: "それぞれの図形の外側を一周して数えましょう。短い辺をまっすぐ一列に並べるつもりで、長さを比べます。",
      build: "ますを辺でつなぎ、外側の長さを数え直しましょう。穴は作りません。動かす・回す・裏返すとAに重なる図形は、同じ形です。"
    },
    boundarySolution: n => `外側には長さ1の辺が${n}本あるので、まわりの長さは${n}です。へこんだ部分の辺も含みます。`,
    joinedSolution: (a, b, common, n) => `二つの長方形のまわりの長さは${a}と${b}で、共通の辺の長さは${common}です。共通の辺を二度数えているので、外側の長さは${a} + ${b} - ${common} - ${common} = ${n}です。`,
    compareSolution: (a, b, sign) => `Aのまわりの長さは${a}、Bは${b}です。長さを比べると、A ${sign} Bです。`,
    buildSolution: (n, accepted) => accepted
      ? `作った図形のまわりの長さは${n}で、ますが辺で一つにつながり、穴もありません。動かす・回す・裏返すことではAに重ならない違う形なので、正解です。`
      : `例のまわりの長さは${n}で、ますが辺で一つにつながり、穴もありません。動かす・回す・裏返すことではAに重なりません。この条件を満たすほかの図形もすべて正解です。`
  }
};

export function promptFor(p, lang = "ko") {
  const text = copy[locale(lang)];
  return `${p.domain === "build" ? text.build(p.target) : text[p.domain]} ${text.unit}`;
}

export function hintFor(p, lang = "ko") {
  return copy[locale(lang)].hints[p.domain];
}

export function solutionFor(p, lang = "ko", response) {
  const text = copy[locale(lang)];
  if (p.domain === "boundary") return text.boundarySolution(answerFor(p));
  if (p.domain === "joined") return text.joinedSolution(
    perimeterOf(p.groups[0]), perimeterOf(p.groups[1]), sharedEdges(p.groups).length, answerFor(p));
  if (p.domain === "compare") return text.compareSolution(
    perimeterOf(p.cells), perimeterOf(p.other), { less: "<", equal: "=", greater: ">" }[answerFor(p)]);
  if (p.domain === "build") return text.buildSolution(p.target, grade(p, response).correct);
  throw new RangeError("Unknown perimeter domain");
}
