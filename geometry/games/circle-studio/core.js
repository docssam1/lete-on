// Original circle problems, independent of textbook figures and answer keys.
const SIZE = 7;
const LANGS = ["ko", "en", "zh", "ja"];
const LETTERS = ["A", "B", "C", "D"];
const locale = lang => LANGS.includes(lang) ? lang : "ko";
function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
export const learner_stage = "초등 도형 · 원의 중심, 반지름, 지름과 원 그리기";
export const domains = freeze([
  { id: "center", level: 1, names: { ko: "원의 중심 찾기", en: "Find the center", zh: "找圆心", ja: "円の中心を見つける" } },
  { id: "parts", level: 2, names: { ko: "반지름과 지름", en: "Radius and diameter", zh: "半径与直径", ja: "半径と直径" } },
  { id: "measure", level: 3, names: { ko: "반지름과 지름의 길이", en: "Radius and diameter lengths", zh: "半径和直径的长度", ja: "半径と直径の長さ" } },
  { id: "draw", level: 4, names: { ko: "컴퍼스로 원 그리기", en: "Draw with a compass", zh: "用圆规画圆", ja: "コンパスで円をかく" } }
]);
const point = p => Array.isArray(p) && p.length === 2 &&
  Number.isSafeInteger(p[0]) && Number.isSafeInteger(p[1]);
const onGrid = p => point(p) && p.every(n => n >= 0 && n < SIZE);
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
const distance2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const radiusValid = r => Number.isSafeInteger(r) && r > 0 && r <= 10;
const segmentValid = (s, center, radius) => s && point(s.start) && point(s.end) &&
  point(center) && radiusValid(radius) && !same(s.start, s.end) &&
  distance2(s.start, center) <= radius ** 2 && distance2(s.end, center) <= radius ** 2;

// Endpoint and midpoint tests are exact for this bounded integer geometry.
export function segmentKind(segment, center, radius) {
  if (!segmentValid(segment, center, radius)) return "other";
  const { start, end } = segment;
  const startOn = distance2(start, center) === radius ** 2;
  const endOn = distance2(end, center) === radius ** 2;
  if ((same(start, center) && endOn) || (same(end, center) && startOn)) return "radius";
  if (startOn && endOn && start[0] - center[0] === center[0] - end[0] &&
    start[1] - center[1] === center[1] - end[1]) return "diameter";
  return "other";
}

const base = (domain, index) => ({ id: `circle-${domain}-${String(index + 1).padStart(2, "0")}`, domain, index, size: SIZE });
// Twenty distinct placements per grid domain, including edge-tangent circles.
const gridSpecs = [
  [2, 2, 1], [4, 3, 2], [1, 4, 1], [3, 3, 3], [4, 2, 2],
  [5, 1, 1], [2, 4, 2], [3, 1, 1], [2, 3, 2], [4, 5, 1],
  [3, 2, 2], [1, 1, 1], [4, 4, 2], [5, 4, 1], [2, 2, 2],
  [1, 5, 1], [3, 4, 2], [5, 5, 1], [3, 3, 2], [3, 5, 1]
];
const gridBank = (domain, order) => order.map((seed, index) => {
  const [x, y, radius] = gridSpecs[seed];
  return { ...base(domain, index), center: [x, y], radius };
});
const answerSets = [[0], [1], [2], [3], [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
const diameterSetOrder = [6, 3, 8, 0, 9, 2, 1, 5, 7, 4];
const radiusSegments = [[[0, 0], [5, 0]], [[0, 0], [0, 5]], [[0, 0], [3, 4]], [[0, 0], [-4, 3]]];
const diameterSegments = [[[-5, 0], [5, 0]], [[0, -5], [0, 5]], [[-3, -4], [3, 4]], [[4, -3], [-4, 3]]];
const otherSegments = [
  [[-3, 4], [3, 4]], [[0, 0], [3, 0]], [[-4, -3], [4, -3]], [[0, 0], [0, -2]]
];
function rotate([x, y], turns) {
  for (let i = 0; i < turns; i++) [x, y] = [-y, x];
  return [x, y];
}
const partsBank = Array.from({ length: 20 }, (_, index) => {
  const target = index % 2 ? "diameter" : "radius";
  const pairIndex = Math.floor(index / 2);
  const set = answerSets[target === "diameter" ? diameterSetOrder[pairIndex] : pairIndex];
  let wrong = 0;
  const segments = LETTERS.map((id, position) => {
    const orientation = (position + Math.floor(index / 4)) % 4;
    let seed;
    if (set.includes(position)) seed = (target === "radius" ? radiusSegments : diameterSegments)[orientation];
    else {
      seed = wrong === 0 ? (target === "radius" ? diameterSegments : radiusSegments)[orientation] :
        otherSegments[(wrong - 1 + 2 * (Math.floor(index / 2) % 2)) % 4];
      wrong++;
    }
    const [start, end] = seed.map(p => rotate(p, Math.floor(index / 5) % 4));
    return { id, start, end };
  });
  return { ...base("parts", index), center: [0, 0], radius: 5, target, segments };
});
const pools = freeze({
  center: gridBank("center", gridSpecs.map((_, i) => i)),
  parts: partsBank,
  measure: Array.from({ length: 20 }, (_, index) => ({ ...base("measure", index), center: [0, 0],
    radius: Math.floor(index / 2) + 1, given: index % 2 ? "diameter" : "radius" })),
  draw: gridBank("draw", [11, 14, 5, 10, 3, 2, 12, 7, 6, 17, 8, 0, 1, 15, 16, 13, 4, 19, 18, 9])
});
const EMPTY = Object.freeze([]);
export function problemsFor(domain) {
  return typeof domain === "string" && Object.hasOwn(pools, domain) ? pools[domain] : EMPTY;
}
const geometryKey = s => [s.start.join(","), s.end.join(",")].sort().join(";");
function validProblem(p) {
  if (!p || p.size !== SIZE || !point(p.center) || !radiusValid(p.radius)) return false;
  if (p.domain === "center" || p.domain === "draw") return p.radius <= 3 && onGrid(p.center) &&
    p.center.every(n => n - p.radius >= 0 && n + p.radius < SIZE);
  if (!same(p.center, [0, 0])) return false;
  if (p.domain === "measure") return ["radius", "diameter"].includes(p.given);
  if (p.domain !== "parts" || p.radius !== 5 || !["radius", "diameter"].includes(p.target) ||
    !Array.isArray(p.segments) || p.segments.length !== 4 ||
    !Array.from(p.segments).every((s, i) => segmentValid(s, p.center, p.radius) && s.id === LETTERS[i])) return false;
  if (new Set(p.segments.map(geometryKey)).size !== 4) return false;
  const count = p.segments.filter(s => segmentKind(s, p.center, p.radius) === p.target).length;
  return count === 1 || count === 2;
}
function requireProblem(p) {
  if (!validProblem(p)) throw new RangeError("Invalid circle problem");
}
export function answerFor(p) {
  requireProblem(p);
  if (p.domain === "center") return [...p.center];
  if (p.domain === "draw") return { center: [...p.center], radius: p.radius };
  if (p.domain === "measure") return p.given === "radius" ? p.radius * 2 : p.radius;
  return p.segments.filter(s => segmentKind(s, p.center, p.radius) === p.target).map(s => s.id);
}
const result = (valid, correct, kind) => ({ valid, correct, kind });
export function grade(p, response) {
  if (!validProblem(p)) return result(false, false, "invalid");
  if (response == null || (Array.isArray(response) && response.length === 0)) return result(false, false, "empty");
  let correct = false;
  if (p.domain === "center" || p.domain === "draw") {
    const chosen = p.domain === "center" ? response : response.center;
    if (!point(chosen) || (p.domain === "draw" && (Array.isArray(response) ||
      !Number.isSafeInteger(response.radius) || response.radius < 1 || response.radius > 3))) return result(false, false, "invalid");
    if (!onGrid(chosen)) return result(true, false, "outside");
    correct = same(chosen, p.center) && (p.domain === "center" || response.radius === p.radius);
  } else if (p.domain === "measure") {
    if (!Number.isSafeInteger(response) || response <= 0) return result(false, false, "invalid");
    correct = response === answerFor(p);
  } else {
    if (!Array.isArray(response) || !Array.from(response).every(id => LETTERS.includes(id)) ||
      new Set(response).size !== response.length) return result(false, false, "invalid");
    const expected = answerFor(p);
    correct = response.length === expected.length && response.every(id => expected.includes(id));
  }
  return result(true, correct, correct ? "correct" : "retry");
}

const copy = {
  ko: {
    radius: "반지름", diameter: "지름",
    center: "이 원의 중심인 격자점을 고르세요.",
    parts: name => `선분이 ${name}인 그림을 모두 고르세요.`,
    measure: (given, value, target) => `${given}이 ${value} cm인 원이에요. ${target}은 몇 cm인가요?`,
    draw: r => `점 O를 중심으로 반지름이 ${r} cm인 원을 그리세요.`,
    grid: "격자의 한 칸은 1 cm예요.",
    separate: "A, B, C, D는 각각 다른 원의 그림이에요. 각 원의 중심은 O예요.",
    fixed: "컴퍼스의 침을 O에 놓고 벌린 길이를 유지하며 한 바퀴 돌리세요.",
    hints: {
      center: "원의 왼쪽 끝과 오른쪽 끝 사이, 위쪽 끝과 아래쪽 끝 사이의 한가운데를 찾아보세요.",
      parts: "반지름은 중심과 원 위의 한 점을 잇는 선분이에요. 지름은 원 위의 두 점을 잇고 중심을 지나는 선분이에요.",
      measure: "지름은 반지름의 2배예요. 반지름은 지름의 반이에요.",
      draw: "먼저 중심을 정하고 컴퍼스를 반지름만큼 벌리세요. 벌린 길이를 바꾸지 않고 돌리세요."
    },
    located: (x, y) => `중심은 격자의 왼쪽 위에서 오른쪽으로 ${x}칸, 아래로 ${y}칸 간 점이에요.`,
    selected: ids => `정답: ${ids.join(", ")}.`,
    measured: (name, value, equation) => `${name}은 ${value} cm예요. ${equation} cm.`,
    drawn: r => `중심은 O, 반지름은 ${r} cm예요. 원 위의 모든 점은 O에서 ${r} cm 떨어져 있어요.`
  },
  en: {
    radius: "radius", diameter: "diameter",
    center: "Choose the grid point at the center of this circle.",
    parts: name => `Choose every diagram whose segment is a ${name}.`,
    measure: (given, value, target) => `The ${given} of a circle is ${value} cm. How many cm is its ${target}?`,
    draw: r => `Draw a circle with center O and radius ${r} cm.`,
    grid: "Each grid step is 1 cm.",
    separate: "A, B, C, and D show separate circles. O is the center of each circle.",
    fixed: "Place the compass point at O and keep its opening fixed for one full turn.",
    hints: {
      center: "Find halfway between the left and right edges and halfway between the top and bottom edges of the circle.",
      parts: "A radius joins the center to a point on the circle. A diameter joins two points on the circle and passes through the center.",
      measure: "The diameter is twice the radius. The radius is half the diameter.",
      draw: "Choose the center first, then open the compass to the radius. Turn it without changing its opening."
    },
    located: (x, y) => `From the top-left grid point, the center is ${x} steps right and ${y} steps down.`,
    selected: ids => `Answer: ${ids.join(", ")}.`,
    measured: (name, value, equation) => `The ${name} is ${value} cm. ${equation} cm.`,
    drawn: r => `The center is O and the radius is ${r} cm. Every point on the circle is ${r} cm from O.`
  },
  zh: {
    radius: "半径", diameter: "直径",
    center: "选出这个圆的圆心所在的格点。",
    parts: name => `选出所有线段是${name}的图。`,
    measure: (given, value, target) => `一个圆的${given}是${value} cm。它的${target}是多少厘米？`,
    draw: r => `以O点为圆心，画一个半径为${r} cm的圆。`,
    grid: "每个小方格的边长是1 cm。",
    separate: "A、B、C、D分别表示不同的圆。每个圆的圆心都是O。",
    fixed: "把圆规的针尖放在O点，保持开口不变，转一整圈。",
    hints: {
      center: "找出圆的最左端和最右端之间的中间位置，再找最上端和最下端之间的中间位置。",
      parts: "半径是连接圆心和圆上一点的线段。直径是连接圆上两点并经过圆心的线段。",
      measure: "直径是半径的2倍。半径是直径的一半。",
      draw: "先确定圆心，再把圆规张开到半径的长度。转动时保持开口不变。"
    },
    located: (x, y) => `从方格左上角的格点向右${x}格、向下${y}格，就是圆心。`,
    selected: ids => `答案：${ids.join("、")}。`,
    measured: (name, value, equation) => `${name}是${value} cm。${equation} cm。`,
    drawn: r => `圆心是O，半径是${r} cm。圆上每一点到O的距离都是${r} cm。`
  },
  ja: {
    radius: "半径", diameter: "直径",
    center: "この円の中心にある格子点を選びましょう。",
    parts: name => `線分が${name}になっている図をすべて選びましょう。`,
    measure: (given, value, target) => `${given}が${value} cmの円です。${target}は何cmですか。`,
    draw: r => `点Oを中心に、半径${r} cmの円をかきましょう。`,
    grid: "方眼の1目盛りは1 cmです。",
    separate: "A、B、C、Dは別々の円の図です。それぞれの円の中心はOです。",
    fixed: "コンパスの針をOに置き、開きを変えずに1回転させましょう。",
    hints: {
      center: "円の左はしと右はしの真ん中、上はしと下はしの真ん中を見つけましょう。",
      parts: "半径は中心と円の上の1点を結ぶ線分です。直径は円の上の2点を結び、中心を通る線分です。",
      measure: "直径は半径の2倍です。半径は直径の半分です。",
      draw: "先に中心を決め、コンパスを半径の長さに開きましょう。開きを変えずに回します。"
    },
    located: (x, y) => `方眼の左上の点から右に${x}目盛り、下に${y}目盛り進んだ点が中心です。`,
    selected: ids => `答え：${ids.join("、")}。`,
    measured: (name, value, equation) => `${name}は${value} cmです。${equation} cm。`,
    drawn: r => `中心はO、半径は${r} cmです。円の上のどの点もOから${r} cm離れています。`
  }
};
export function optionLabels(domain, lang = "ko") {
  return domain === "parts" ? LETTERS.map(id => ({ id, label: id })) : [];
}
export function promptPartsFor(p, lang = "ko") {
  requireProblem(p);
  const text = copy[locale(lang)];
  if (p.domain === "center") return { question: text.center, conditions: [] };
  if (p.domain === "parts") return { question: text.parts(text[p.target]), conditions: [text.separate] };
  if (p.domain === "draw") return { question: text.draw(p.radius), conditions: [text.grid, text.fixed] };
  const target = p.given === "radius" ? "diameter" : "radius";
  return { question: text.measure(text[p.given], p.given === "radius" ? p.radius : 2 * p.radius, text[target]), conditions: [] };
}
export function promptFor(p, lang = "ko") {
  const { question, conditions } = promptPartsFor(p, lang);
  return [question, ...conditions].join(" ");
}
export function hintFor(p, lang = "ko") {
  requireProblem(p);
  return copy[locale(lang)].hints[p.domain];
}
export function solutionFor(p, lang = "ko") {
  const answer = answerFor(p);
  const text = copy[locale(lang)];
  if (p.domain === "center") return text.located(...answer);
  if (p.domain === "draw") return text.drawn(answer.radius);
  if (p.domain === "parts") return `${text.selected(answer)} ${text.hints.parts}`;
  const target = p.given === "radius" ? "diameter" : "radius";
  const equation = p.given === "radius" ? `${p.radius} × 2 = ${answer}` : `${2 * p.radius} ÷ 2 = ${answer}`;
  return text.measured(text[target], answer, equation);
}
