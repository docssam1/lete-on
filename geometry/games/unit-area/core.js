// Independently authored lattice figures, not transcriptions of source questions.
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
  { id: "whole", level: 1, names: { ko: "온칸으로 넓이 재기", en: "Count whole squares", zh: "数整格求面积", ja: "ますを数えて面積を求める" } },
  { id: "halves", level: 2, names: { ko: "반칸 묶어 넓이 재기", en: "Join half squares", zh: "拼半格求面积", ja: "半ますを合わせる" } },
  { id: "compare", level: 3, names: { ko: "두 도형의 넓이 비교", en: "Compare two areas", zh: "比较两个图形的面积", ja: "二つの面積を比べる" } },
  { id: "build", level: 4, names: { ko: "같은 넓이의 도형 만들기", en: "Build a given area", zh: "画出指定面积的图形", ja: "決められた面積を作る" } }
]);

// a/b/c/d occupy the NW/NE/SE/SW corner, respectively, of one square.
const parts = { "#": "full", a: "nw", b: "ne", c: "se", d: "sw" };
function figure(rows) {
  const width = Math.max(...rows.map(row => row.length));
  const dx = Math.floor((SIZE - width) / 2), dy = Math.floor((SIZE - rows.length) / 2);
  return rows.flatMap((row, y) => [...row].flatMap((symbol, x) =>
    parts[symbol] ? [{ x: x + dx, y: y + dy, part: parts[symbol] }] : []));
}

const wholeFigures = [
  ["##", "##"],
  ["#.", "#.", "##"],
  ["###", ".#.", ".#."],
  ["##", "##", "#."],
  ["#..", "##.", "###"],
  ["###", "###"],
  ["#.#", "#.#", "###"],
  ["##..", ".##.", "..##", "...#"],
  ["###", "#.#", "###"],
  ["#####", "..#..", "..#..", "..#.."],
  ["..#..", "..#..", "#####", "..#..", "..#.."],
  ["#...", "##..", "###.", "####"],
  ["####", "#...", "###.", "..#.", "..##"],
  ["####", "####", "####"],
  ["#####", "#.#.#", "#####"],
  ["#####", "###..", "#####", "..#.."],
  ["#####", "####.", "###..", "##...", "#...."],
  ["####", "####", "####", "####"],
  ["######", "##..##", "######", "..#..."],
  ["######", "#....#", "######", "#....#", "##...."]
].map(figure);

const halfFigures = [
  ["dc", "##", "ab"],
  ["dc", "##", "##"],
  ["d#c", "###"],
  ["###", "a#b"],
  ["d##c", "####"],
  ["d#c", "###", "a#b"],
  ["d#c", "###", "##.", "ab."],
  [".dc.", ".##.", "d##c", "a##b"],
  ["dcdc", "####", "abab"],
  ["d##c", "####", "a##b"],
  ["dc..", "##dc", "####", "ab##"],
  ["d###c", "#####", ".a#b."],
  [".d#c.", "d###c", "#####", ".a#b."],
  ["d#c..", "###dc", "#####", "ab#ab"],
  ["d####c", "######", "a####b"],
  ["dc.dc", "##.##", "#####", "ab.ab"],
  ["d###c", "#####", "#...#", "a###b"],
  ["d####c", "######", "dc##ab"],
  ["dcdc..", "####dc", "######", "a####b"],
  ["d####c", "######", "a####b", ".a#b.."]
].map(figure);

const compareFigures = [
  [wholeFigures[0], wholeFigures[5]],
  [wholeFigures[0], wholeFigures[1]],
  [wholeFigures[5], wholeFigures[1]],
  [wholeFigures[6], wholeFigures[10]],
  [wholeFigures[2], wholeFigures[3]],
  [wholeFigures[10], wholeFigures[8]],
  [wholeFigures[11], wholeFigures[12]],
  [wholeFigures[4], wholeFigures[5]],
  [wholeFigures[12], wholeFigures[7]],
  [wholeFigures[13], wholeFigures[14]],
  [wholeFigures[6], wholeFigures[7]],
  [wholeFigures[14], wholeFigures[13]],
  [wholeFigures[15], wholeFigures[17]],
  [wholeFigures[8], wholeFigures[9]],
  [wholeFigures[16], wholeFigures[11]],
  [wholeFigures[8], wholeFigures[16]],
  [wholeFigures[11], figure(["#####", "#####"])],
  [wholeFigures[17], wholeFigures[15]],
  [wholeFigures[3], wholeFigures[4]],
  [wholeFigures[9], wholeFigures[2]]
];

const buildFigures = [
  ...[0, 2, 4, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(index => wholeFigures[index]),
  ...[
    ["#####", "#####", "#####", "####."],
    ["#####", "#####", "#####", "#####"],
    ["######", "#####.", "####..", "###...", "###..."],
    ["######", "######", "#####.", "#####."],
    ["######", "######", "######", "#####."]
  ].map(figure)
];

function base(domain, kind, unit, index) {
  return { id: `${domain}-${String(index + 1).padStart(2, "0")}`, domain, kind, unit, size: SIZE };
}
const pools = freeze({
  whole: wholeFigures.map((cells, i) => ({ ...base("whole", "count-whole", "area", i), cells })),
  halves: halfFigures.map((cells, i) => ({ ...base("halves", "pair-halves", "area", i), cells })),
  compare: compareFigures.map(([left, right], i) => ({ ...base("compare", "compare-area", "comparison", i), left, right })),
  build: buildFigures.map((cells, i) => ({
    ...base("build", "build-area", "drawing", i), target: cells.length,
    example: cells.map(({ x, y }) => [x, y])
  }))
});

export function problemsFor(domain) {
  return Object.hasOwn(pools, domain) ? pools[domain] : [];
}

export function areaOf(cells) {
  if (!Array.isArray(cells)) return NaN;
  return cells.reduce((sum, cell) => sum + (cell?.part === "full" ? 1 : ["nw", "ne", "se", "sw"].includes(cell?.part) ? 0.5 : NaN), 0);
}

const coordinate = value => Array.isArray(value) && value.length === 2 && value.every(Number.isSafeInteger);
const key = point => point.join(",");
export function connectedCells(coords) {
  if (!Array.isArray(coords) || !coords.length || !coords.every(coordinate)) return false;
  const remaining = new Set(coords.map(key));
  if (remaining.size !== coords.length) return false;
  const queue = [coords[0]];
  remaining.delete(key(coords[0]));
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    for (const point of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (remaining.delete(key(point))) queue.push(point);
    }
  }
  return remaining.size === 0;
}

export function answerFor(p) {
  if (p.domain === "whole" || p.domain === "halves") return areaOf(p.cells);
  if (p.domain === "compare") {
    const difference = areaOf(p.left) - areaOf(p.right);
    return difference < 0 ? "less" : difference > 0 ? "greater" : "equal";
  }
  if (p.domain === "build") return p.example.map(point => [...point]);
  throw new RangeError("Unknown unit-area domain");
}

const result = (valid, correct, kind) => ({ valid, correct, kind });
export function grade(p, response) {
  if (!p || !Object.hasOwn(pools, p.domain)) return result(false, false, "invalid");
  if (response == null || (typeof response === "string" && !response.trim())) return result(false, false, "empty");
  if (p.domain === "build") {
    if (!Array.isArray(response)) return result(false, false, "invalid");
    if (!response.length) return result(false, false, "empty");
    if (!response.every(point => coordinate(point) && point.every(n => n >= 0 && n < p.size)) ||
        new Set(response.map(key)).size !== response.length) return result(false, false, "invalid");
    if (!connectedCells(response)) return result(true, false, "disconnected");
    const correct = response.length === p.target;
    return result(true, correct, correct ? "correct" : "retry");
  }
  if (p.domain === "compare") {
    if (!["less", "equal", "greater"].includes(response)) return result(false, false, "invalid");
    const correct = response === answerFor(p);
    return result(true, correct, correct ? "correct" : "retry");
  }
  // Do not coerce booleans, arrays, exponents, hexadecimal, or partial numbers.
  let value = response;
  if (typeof value === "string") {
    if (!/^\d+(?:\.0+)?$/.test(value.trim())) return result(false, false, "invalid");
    value = Number(value.trim());
  }
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) return result(false, false, "invalid");
  const correct = value === answerFor(p);
  return result(true, correct, correct ? "correct" : "retry");
}

const copy = {
  ko: {
    whole: "색칠한 도형의 넓이는 얼마인가요?",
    halves: "반칸을 두 개씩 모두 묶고, 도형의 넓이를 구하세요.",
    compare: "A의 넓이를 B의 넓이와 비교해 보세요.",
    build: n => `넓이가 ${n}인 도형을 만드세요. 색칠한 칸은 변끼리 이어져야 합니다.`,
    hints: { whole: "한 줄씩 살펴보며 색칠한 온칸을 빠짐없이 세어 보세요.", halves: "반칸 두 개를 합치면 온칸 하나와 넓이가 같아요. 온칸과 반칸을 따로 살펴보세요.", compare: "두 도형에 쓰인 한 칸의 크기는 같아요. 모양이 달라도 온칸 수가 같으면 넓이가 같아요.", build: "온칸을 변끼리 이어 보세요. 구멍이 있어도 괜찮지만, 꼭짓점만 닿은 칸은 이어진 것이 아니에요." },
    wholeSolution: n => `온칸 ${n}개의 넓이를 더하면 ${n}입니다.`,
    halfSolution: (f, h, n) => `온칸은 ${f}개, 반칸은 ${h}개입니다. 반칸 둘씩 묶으면 온칸 ${h / 2}개와 같으므로, 넓이는 ${f} + ${h / 2} = ${n}입니다.`,
    compareSolution: (a, b, sign) => `A의 넓이는 ${a}, B의 넓이는 ${b}입니다. 따라서 A ${sign} B입니다.`,
    buildSolution: (n, accepted) => accepted ? `만든 도형은 온칸 ${n}개가 변끼리 이어져 있어 정답입니다. 다른 모양도 가능합니다.` : `예시는 온칸 ${n}개가 변끼리 이어진 도형입니다. 같은 조건을 만족하는 다른 모양도 정답이며, 구멍이 있어도 됩니다.`
  },
  en: {
    whole: "What is the area of the shaded shape?",
    halves: "Pair all the half squares, then find the area of the shape.",
    compare: "Compare the area of A with the area of B.",
    build: n => `Make a shape with an area of ${n}. All shaded squares must be joined along sides.`,
    hints: { whole: "Count the shaded whole squares one row at a time, without skipping or counting twice.", halves: "Two half squares have the same area as one whole square. Look at the whole and half squares separately.", compare: "The unit squares in both shapes are the same size. Different shapes have equal areas when they contain the same number of whole squares.", build: "Join whole squares along sides. Holes are allowed, but squares touching only at a corner are not joined." },
    wholeSolution: n => `There are ${n} whole squares, so the area is ${n}.`,
    halfSolution: (f, h, n) => `There are ${f} whole squares and ${h} half squares. The halves form ${h / 2} whole squares, so the area is ${f} + ${h / 2} = ${n}.`,
    compareSolution: (a, b, sign) => `A has area ${a} and B has area ${b}. Therefore, A ${sign} B.`,
    buildSolution: (n, accepted) => accepted ? `Your ${n} whole squares are joined along sides, so your shape is correct. Other shapes also work.` : `The example has ${n} whole squares joined along sides. Every other shape meeting these conditions is also correct, including shapes with holes.`
  },
  zh: {
    whole: "涂色图形的面积是多少？",
    halves: "先把所有半格两两配对，再求图形的面积。",
    compare: "把A的面积与B的面积进行比较。",
    build: n => `画出面积为${n}的图形。所有涂色方格必须通过边连成一个整体。`,
    hints: { whole: "一行一行地数涂色整格，不要漏数或重复数。", halves: "两个半格的面积等于一个整格。把整格与半格分开看。", compare: "两个图形中的单位方格一样大。即使形状不同，整格数相同，面积就相等。", build: "让整格通过边连在一起。可以有孔洞，但只在顶点接触不算相连。" },
    wholeSolution: n => `共有${n}个整格，所以面积是${n}。`,
    halfSolution: (f, h, n) => `有${f}个整格和${h}个半格。半格两两组合，相当于${h / 2}个整格，所以面积是${f} + ${h / 2} = ${n}。`,
    compareSolution: (a, b, sign) => `A的面积是${a}，B的面积是${b}。所以，A ${sign} B。`,
    buildSolution: (n, accepted) => accepted ? `你画的${n}个整格通过边连成了一个整体，答案正确。其他形状也可以。` : `示例由${n}个整格通过边连成一个整体。满足条件的其他形状也正确，可以有孔洞。`
  },
  ja: {
    whole: "色のついた図形の面積はいくつですか。",
    halves: "半ますをすべて二つずつ組にしてから、図形の面積を求めましょう。",
    compare: "Aの面積をBの面積と比べましょう。",
    build: n => `面積が${n}の図形を作りましょう。色をつけたますは、辺で一つにつながるようにします。`,
    hints: { whole: "色のついたますを一行ずつ数えましょう。数え落としや二度数えに気をつけます。", halves: "半ます二つ分の面積は、ひとます分と同じです。ますと半ますを分けて考えましょう。", compare: "どちらの図形も、ひとますの大きさは同じです。形が違っても、ますの数が同じなら面積は等しくなります。", build: "ますを辺でつなげましょう。穴があってもかまいませんが、頂点だけで触れているますは、つながっているとはみなしません。" },
    wholeSolution: n => `ますが${n}個あるので、面積は${n}です。`,
    halfSolution: (f, h, n) => `ますが${f}個、半ますが${h}個あります。半ますを二つずつ合わせると${h / 2}ます分になるので、面積は${f} + ${h / 2} = ${n}です。`,
    compareSolution: (a, b, sign) => `Aの面積は${a}、Bの面積は${b}です。したがって、A ${sign} Bです。`,
    buildSolution: (n, accepted) => accepted ? `作った図形は${n}個のますが辺でつながっているので正解です。ほかの形でもかまいません。` : `例は${n}個のますが辺でつながった図形です。同じ条件を満たすほかの形も正解で、穴があってもかまいません。`
  }
};

export function promptFor(p, lang = "ko") {
  const text = copy[locale(lang)];
  return p.domain === "build" ? text.build(p.target) : text[p.domain];
}
export function hintFor(p, lang = "ko") { return copy[locale(lang)].hints[p.domain]; }
export function solutionFor(p, lang = "ko", response) {
  const text = copy[locale(lang)];
  if (p.domain === "whole") return text.wholeSolution(answerFor(p));
  if (p.domain === "halves") {
    const full = p.cells.filter(cell => cell.part === "full").length;
    return text.halfSolution(full, p.cells.length - full, answerFor(p));
  }
  if (p.domain === "compare") return text.compareSolution(areaOf(p.left), areaOf(p.right), { less: "<", equal: "=", greater: ">" }[answerFor(p)]);
  return text.buildSolution(p.target, grade(p, response).correct);
}
