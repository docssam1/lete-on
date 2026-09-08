// Original integer-grid bank. No textbook figures or source answers are used.
const SIZE = 7;
const LANGS = ["ko", "en", "zh", "ja"];
const CLASS_IDS = ["trapezoid", "parallelogram", "rectangle", "rhombus", "square"];
const PAIRS = ["ab-cd", "bc-da"];
const LETTERS = ["A", "B", "C", "D"];
const SIDES = ["AB", "BC", "CD", "DA"];
const locale = lang => LANGS.includes(lang) ? lang : "ko";
function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

export const learner_stage = "초등 도형 · 사각형의 성질과 분류";
export const domains = freeze([
  { id: "parallel", level: 1, names: { ko: "평행한 변 찾기", en: "Find parallel sides", zh: "找平行的边", ja: "平行な辺を見つける" } },
  { id: "right", level: 2, names: { ko: "직각 찾기", en: "Find right angles", zh: "找直角", ja: "直角を見つける" } },
  { id: "classify", level: 3, names: { ko: "사각형 분류 확장", en: "Explore quadrilateral families", zh: "四边形分类拓展", ja: "四角形の仲間分け・発展" } },
  { id: "build", level: 4, names: { ko: "사각형 완성하기", en: "Complete a quadrilateral", zh: "补全四边形", ja: "条件に合う四角形を作る" } }
]);

const coordinate = p => Array.isArray(p) && p.length === 2 &&
  Number.isSafeInteger(p[0]) && Number.isSafeInteger(p[1]);
const onGrid = p => coordinate(p) && p[0] >= 0 && p[0] < SIZE && p[1] >= 0 && p[1] < SIZE;
const vector = (a, b) => [b[0] - a[0], b[1] - a[1]];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const invalidProperties = () => ({ valid: false, parallelPairs: [], rightVertices: [], equalSideGroups: [], classes: [] });

// A-D are perimeter order, in either winding. All arithmetic is exact on 0..6.
export function properties(vertices) {
  if (!Array.isArray(vertices) || vertices.length !== 4 || !Array.from(vertices).every(onGrid)) return invalidProperties();
  if (new Set(vertices.map(p => p.join(","))).size !== 4) return invalidProperties();
  const edges = vertices.map((p, i) => vector(p, vertices[(i + 1) % 4]));
  const turns = edges.map((edge, i) => cross(edge, edges[(i + 1) % 4]));
  // Four strictly same-sign turns rule out straight corners, concavity and crossings.
  if (!turns.every(n => n > 0) && !turns.every(n => n < 0)) return invalidProperties();
  const parallelPairs = PAIRS.filter((_, i) => cross(edges[i], edges[i + 2]) === 0);
  const rightVertices = LETTERS.filter((_, i) => dot(edges[(i + 3) % 4], edges[i]) === 0);
  const lengths = edges.map(edge => dot(edge, edge));
  const groups = new Map();
  lengths.forEach((length, i) => {
    if (!groups.has(length)) groups.set(length, []);
    groups.get(length).push(i);
  });
  const equalSideGroups = [...groups.values()].filter(group => group.length > 1);
  const rectangle = rightVertices.length === 4;
  const rhombus = lengths.every(length => length === lengths[0]);
  const matches = [parallelPairs.length >= 1, parallelPairs.length === 2, rectangle, rhombus, rectangle && rhombus];
  return { valid: true, parallelPairs, rightVertices, equalSideGroups, classes: CLASS_IDS.filter((_, i) => matches[i]) };
}

// Hand-authored lattice seeds include tilted, unequal, right, and non-right examples.
const seeds = [
  [[0, 0], [4, 0], [4, 2], [0, 2]],
  [[0, 0], [3, 0], [4, 2], [1, 3]],
  [[0, 0], [4, 0], [2, 3], [0, 3]],
  [[0, 0], [3, 0], [4, 2], [1, 2]],
  [[0, 0], [2, 0], [2, 2], [0, 2]],
  [[0, 2], [3, 0], [6, 2], [3, 4]],
  [[0, 0], [3, 0], [4, 2], [0, 3]],
  [[0, 0], [5, 0], [4, 2], [1, 2]],
  [[1, 0], [5, 2], [4, 4], [0, 2]],
  [[0, 0], [2, 1], [3, 3], [1, 2]],
  [[0, 2], [2, 0], [4, 2], [2, 4]],
  [[0, 0], [4, 1], [3, 4], [1, 3]],
  [[0, 0], [2, 1], [5, 5], [1, 3]],
  [[0, 0], [4, 1], [5, 4], [1, 3]],
  [[0, 0], [5, 0], [5, 1], [0, 1]],
  [[0, 0], [2, 0], [3, 3], [0, 2]],
  [[0, 1], [1, 0], [2, 1], [1, 2]],
  [[0, 0], [3, 0], [3, 2], [1, 2]],
  [[0, 2], [2, 0], [5, 2], [2, 4]],
  [[0, 0], [2, 0], [4, 3], [2, 3]]
];
const transforms = [
  [1, 0, 0, 1], [0, -1, 1, 0], [-1, 0, 0, -1], [0, 1, -1, 0],
  [-1, 0, 0, 1], [0, 1, 1, 0], [1, 0, 0, -1], [0, -1, -1, 0]
];
function place(seed, serial) {
  const [a, b, c, d] = transforms[serial % transforms.length];
  const points = seed.map(([x, y]) => [a * x + b * y, c * x + d * y]);
  const minX = Math.min(...points.map(p => p[0])), minY = Math.min(...points.map(p => p[1]));
  const width = Math.max(...points.map(p => p[0])) - minX;
  const height = Math.max(...points.map(p => p[1])) - minY;
  const dx = Math.floor(serial / 3) % (SIZE - width), dy = Math.floor(serial / 5) % (SIZE - height);
  const placed = points.map(([x, y]) => [x - minX + dx, y - minY + dy]);
  const start = Math.floor(serial / 2) % 4;
  return placed.map((_, i) => placed[(i + start) % 4]);
}
const base = (domain, index) => ({ id: `quadrilateral-${domain}-${String(index + 1).padStart(2, "0")}`, domain, index, size: SIZE });
const orders = {
  parallel: [2, 4, 1, 7, 13, 0, 6, 5, 11, 19, 12, 8, 17, 3, 15, 10, 9, 18, 16, 14],
  right: [6, 3, 8, 2, 18, 5, 4, 17, 12, 15, 11, 0, 1, 9, 10, 7, 14, 13, 16, 19],
  classify: [7, 8, 1, 5, 4, 13, 11, 2, 9, 14, 19, 16, 6, 12, 0, 3, 10, 18, 17, 15]
};
const buildSpecs = [
  ["trapezoid", 2], ["rectangle", 8], ["rhombus", 5], ["square", 4], ["parallelogram", 3],
  ["rectangle", 4], ["trapezoid", 7], ["square", 10], ["parallelogram", 13], ["rhombus", 9],
  ["square", 16], ["trapezoid", 12], ["rectangle", 14], ["parallelogram", 19], ["rhombus", 10],
  ["trapezoid", 17], ["rhombus", 16], ["parallelogram", 0], ["square", 4], ["rectangle", 0]
];
const pools = freeze({
  ...Object.fromEntries(Object.entries(orders).map(([domain, order], d) => [domain,
    order.map((seed, index) => ({ ...base(domain, index), vertices: place(seeds[seed], index + 23 * d) }))])),
  build: buildSpecs.map(([target, seed], index) => {
    const vertices = place(seeds[seed], index + 71);
    return { ...base("build", index), vertices: vertices.slice(0, 3), target, example: vertices[3] };
  })
});
const EMPTY = Object.freeze([]);
export function problemsFor(domain) {
  return typeof domain === "string" && Object.hasOwn(pools, domain) ? pools[domain] : EMPTY;
}
function validProblem(p) {
  if (!p || !domains.some(domain => domain.id === p.domain) || p.size !== SIZE) return false;
  if (p.domain !== "build") return properties(p.vertices).valid;
  return Array.isArray(p.vertices) && p.vertices.length === 3 && Array.from(p.vertices).every(onGrid) &&
    cross(vector(p.vertices[0], p.vertices[1]), vector(p.vertices[1], p.vertices[2])) !== 0 &&
    CLASS_IDS.includes(p.target) && (p.extra === undefined || p.extra === "exactly-one-parallel");
}
const matchesTarget = (p, info) => info.valid && info.classes.includes(p.target) &&
  (p.extra !== "exactly-one-parallel" || info.parallelPairs.length === 1);

export function answerFor(p) {
  if (!validProblem(p)) throw new RangeError("Invalid quadrilateral problem");
  if (p.domain === "build") {
    const answers = [];
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      if (matchesTarget(p, properties([...p.vertices, [x, y]]))) answers.push([x, y]);
    }
    return answers;
  }
  const info = properties(p.vertices);
  const answer = p.domain === "parallel" ? info.parallelPairs : p.domain === "right" ? info.rightVertices : info.classes;
  return answer.length ? answer : ["none"];
}

// kind describes input/geometry status; every result has all three contract fields.
const result = (valid, correct, kind) => ({ valid, correct, kind });
export function grade(p, response) {
  if (!validProblem(p)) return result(false, false, "invalid");
  if (response == null || (Array.isArray(response) && response.length === 0)) return result(false, false, "empty");
  if (p.domain === "build") {
    if (!coordinate(response)) return result(false, false, "invalid");
    if (!onGrid(response)) return result(true, false, "outside");
    const info = properties([...p.vertices, response]);
    if (!info.valid) return result(true, false, "shape");
    const correct = matchesTarget(p, info);
    return result(true, correct, correct ? "correct" : "retry");
  }
  const ids = [...(p.domain === "parallel" ? PAIRS : p.domain === "right" ? LETTERS : CLASS_IDS), "none"];
  if (!Array.isArray(response) || !Array.from(response).every(id => typeof id === "string" && ids.includes(id)) ||
    new Set(response).size !== response.length || (response.includes("none") && response.length > 1)) return result(false, false, "invalid");
  const expected = answerFor(p);
  const correct = response.length === expected.length && response.every(id => expected.includes(id));
  return result(true, correct, correct ? "correct" : "retry");
}

const copy = {
  ko: {
    classes: ["사다리꼴", "평행사변형", "직사각형", "마름모", "정사각형"], none: "해당 없음",
    parallel: "AB와 CD, BC와 DA 중 평행한 변의 쌍을 모두 고르세요. 없으면 '해당 없음'을 고르세요.",
    right: "A, B, C, D 중 직각인 꼭짓점을 모두 고르세요. 없으면 '해당 없음'을 고르세요.",
    classify: "성질을 확인하여 이 사각형에 해당하는 이름을 모두 고르세요. 하나도 해당하지 않으면 '해당 없음'을 고르세요.",
    convention: "이 활동에서 사다리꼴은 마주 보는 변이 적어도 한 쌍 평행한 사각형이에요. 두 쌍이 평행한 도형도 포함해요. 직사각형과 마름모에는 정사각형도 포함해요.",
    rules: "평행사변형: 마주 보는 두 쌍의 변이 평행. 직사각형: 네 각이 모두 직각. 마름모: 네 변의 길이가 모두 같음. 정사각형: 네 각이 직각이고 네 변의 길이가 모두 같음.",
    build: name => `A, B, C는 고정되어 있어요. 격자점 D를 골라 A-B-C-D-A 순서로 이으면 ${name}이 되게 하세요.`,
    buildCondition: "변이 교차하거나 안쪽으로 꺾이지 않고, 세 꼭짓점이 한 직선에 놓이지 않아야 해요.",
    extra: "추가 조건: 마주 보는 변은 정확히 한 쌍만 평행해야 해요.",
    hints: {
      parallel: "마주 보는 두 변을 양쪽으로 곧게 늘려도 만나지 않으면 평행해요. 격자에서 같은 방향으로 기울어져 있는지 두 쌍을 각각 확인하세요.",
      right: "종이의 네모난 모서리를 떠올리세요. 각 꼭짓점에서 만나는 두 변이 그 모서리와 맞는지 확인하세요. 기울어진 직각도 있어요.",
      classify: "평행한 변, 직각, 같은 길이의 변을 차례로 확인하세요. 각 이름의 조건을 따로 검사하면 이름이 여러 개일 수 있어요.",
      build: "목표 도형의 조건을 먼저 확인하세요. D를 생각한 점에 놓고 CD와 DA를 이어 모든 조건과 네 모서리를 다시 살펴보세요."
    },
    facts: (parallel, right, equal) => `평행한 변의 쌍: ${parallel}. 직각인 꼭짓점: ${right}. 길이가 같은 변: ${equal}.`,
    selection: labels => `정답: ${labels}.`,
    built: (point, accepted, name) => `${accepted ? "고른 점" : "가능한 한 예"} D = (${point.join(", ")}). A-B-C-D는 ${name}의 조건을 만족해요. 같은 조건을 만족하는 다른 격자점도 정답이에요.`
  },
  en: {
    classes: ["Trapezoid", "Parallelogram", "Rectangle", "Rhombus", "Square"], none: "None",
    parallel: "Choose every parallel pair: AB with CD, and BC with DA. Choose 'None' if neither pair is parallel.",
    right: "Choose every vertex with a right angle: A, B, C, D. Choose 'None' if there are no right angles.",
    classify: "Check the properties and choose ALL names that fit this quadrilateral. Choose 'None' if none fit.",
    convention: "Here we use the inclusive definition: a trapezoid has at least one pair of parallel opposite sides, including shapes with two pairs. Rectangles and rhombuses include squares.",
    rules: "Parallelogram: both pairs of opposite sides parallel. Rectangle: all four angles right. Rhombus: all four sides equal in length. Square: all four angles right and all four sides equal in length.",
    build: name => `A, B, C stay fixed. Choose a grid point D so A-B-C-D-A forms a ${name.toLowerCase()}.`,
    buildCondition: "Sides must not cross, no corner may bend inward, and no three vertices may lie on one straight line.",
    extra: "Extra condition: exactly one pair of opposite sides must be parallel.",
    hints: {
      parallel: "Parallel opposite sides never meet even when extended both ways. Use the grid to compare their directions. Check each of the two pairs separately.",
      right: "Imagine the square corner of a sheet of paper. Check whether the two sides at each vertex fit that corner. A right angle can be tilted.",
      classify: "Check parallel sides, right angles, and equal side lengths in turn. Test each name's rule separately: more than one name can fit.",
      build: "Review the target shape's rules. Try D, join CD and DA, then check every rule and all four corners."
    },
    facts: (parallel, right, equal) => `Parallel side pairs: ${parallel}. Right-angle vertices: ${right}. Equal-length sides: ${equal}.`,
    selection: labels => `Answer: ${labels}.`,
    built: (point, accepted, name) => `${accepted ? "Your point" : "One possible example"}: D = (${point.join(", ")}). A-B-C-D meets the rules for a ${name.toLowerCase()}. Any other grid point meeting the same rules is also correct.`
  },
  zh: {
    classes: ["梯形", "平行四边形", "长方形", "菱形", "正方形"], none: "都不符合",
    parallel: "在AB与CD、BC与DA中，选出所有互相平行的边对。如果都不平行，选“都不符合”。",
    right: "在A、B、C、D中，选出所有形成直角的顶点。如果没有直角，选“都不符合”。",
    classify: "检查图形的性质，选出这个四边形所有符合的名称。如果都不符合，选“都不符合”。",
    convention: "本活动采用包含关系的定义：梯形是至少有一组对边平行的四边形，也包括两组对边都平行的图形。长方形和菱形都包括正方形。",
    rules: "平行四边形：两组对边分别平行。长方形：四个角都是直角。菱形：四条边一样长。正方形：四个角都是直角，且四条边一样长。",
    build: name => `A、B、C固定不动。选一个格点D，按A-B-C-D-A连接，构成${name}。`,
    buildCondition: "边不能交叉，角不能向内凹，任意三个顶点不能在同一条直线上。",
    extra: "附加条件：必须恰好有一组对边平行。",
    hints: {
      parallel: "平行的对边向两端延长也不会相交。借助方格比较两条边的方向，分别检查两组对边。",
      right: "想象一张纸的方角。检查每个顶点处的两条边能否与这个方角重合。倾斜的角也可以是直角。",
      classify: "依次检查平行的边、直角和相等的边长。分别检查每个名称的条件，一个图形可能符合多个名称。",
      build: "先检查目标图形的条件。试着放置D，连接CD和DA，再检查全部条件和四个角。"
    },
    facts: (parallel, right, equal) => `平行的边对：${parallel}。直角顶点：${right}。长度相等的边：${equal}。`,
    selection: labels => `答案：${labels}。`,
    built: (point, accepted, name) => `${accepted ? "你选择的点" : "一种可行的例子"}：D = (${point.join(", ")})。A-B-C-D符合${name}的条件。满足相同条件的其他格点也都是正确答案。`
  },
  ja: {
    classes: ["台形", "平行四辺形", "長方形", "ひし形", "正方形"], none: "当てはまるものなし",
    parallel: "ABとCD、BCとDAのうち、平行な辺の組をすべて選びましょう。なければ「当てはまるものなし」を選びます。",
    right: "A、B、C、Dから、直角になっている頂点をすべて選びましょう。なければ「当てはまるものなし」を選びます。",
    classify: "性質を確かめ、この四角形に当てはまる名前をすべて選びましょう。なければ「当てはまるものなし」を選びます。",
    convention: "この活動では、台形を「向かい合う辺が少なくとも1組平行な四角形」とし、2組とも平行な図形も含めます。長方形とひし形には正方形も含めます。",
    rules: "平行四辺形：向かい合う2組の辺がそれぞれ平行。長方形：4つの角がすべて直角。ひし形：4つの辺の長さがすべて等しい。正方形：4つの角が直角で、4つの辺の長さが等しい。",
    build: name => `A、B、Cは動かしません。格子点Dを選び、A-B-C-D-Aの順につなぐと${name}になるようにしましょう。`,
    buildCondition: "辺は交差せず、角は内側にへこまず、3つの頂点が一直線に並ばないようにします。",
    extra: "追加の条件：平行な向かい合う辺は、ちょうど1組だけです。",
    hints: {
      parallel: "平行な辺は両方にまっすぐ延ばしても交わりません。方眼で辺の向きを比べ、向かい合う2組をそれぞれ確かめましょう。",
      right: "紙の四角いすみを思い浮かべましょう。各頂点で交わる2辺がそのすみに合うか確かめます。傾いた直角もあります。",
      classify: "平行な辺、直角、等しい辺の長さを順に確かめましょう。名前ごとに条件を調べると、複数の名前が当てはまることがあります。",
      build: "目標の図形の条件を確かめましょう。Dを置いてCDとDAを結び、すべての条件と4つの角をもう一度調べます。"
    },
    facts: (parallel, right, equal) => `平行な辺の組：${parallel}。直角の頂点：${right}。長さが等しい辺：${equal}。`,
    selection: labels => `答え：${labels}。`,
    built: (point, accepted, name) => `${accepted ? "選んだ点" : "答えの一例"}：D = (${point.join(", ")})。A-B-C-Dは${name}の条件を満たします。同じ条件を満たすほかの格子点も正解です。`
  }
};

export function className(id, lang = "ko") {
  const text = copy[locale(lang)];
  return id === "none" ? text.none : text.classes[CLASS_IDS.indexOf(id)] || "";
}
export function optionLabels(domain, lang = "ko") {
  const text = copy[locale(lang)];
  if (domain === "build" || !["parallel", "right", "classify"].includes(domain)) return [];
  const options = domain === "parallel" ? PAIRS.map((id, i) => ({ id, label: i ? "BC / DA" : "AB / CD" })) :
    domain === "right" ? LETTERS.map(id => ({ id, label: id })) : CLASS_IDS.map(id => ({ id, label: className(id, lang) }));
  return [...options, { id: "none", label: text.none }];
}
export function promptPartsFor(p, lang = "ko") {
  if (!validProblem(p)) throw new RangeError("Invalid quadrilateral problem");
  const text = copy[locale(lang)];
  const main = p.domain === "build" ? text.build(className(p.target, lang)) : text[p.domain];
  const classification = p.domain === "classify" || p.domain === "build";
  return { question: main, conditions: [p.domain === "build" ? text.buildCondition : "", classification ? text.convention : "",
    p.extra === "exactly-one-parallel" ? text.extra : ""].filter(Boolean) };
}
export function promptFor(p, lang = "ko") {
  const { question, conditions } = promptPartsFor(p, lang);
  // Preserve the existing adjacent Chinese/Japanese sentences when splitting UI parts.
  if (p.domain === "build" && ["zh", "ja"].includes(locale(lang))) return [question + conditions[0], ...conditions.slice(1)].join(" ");
  return [question, ...conditions].join(" ");
}
export function hintFor(p, lang = "ko") {
  if (!validProblem(p)) throw new RangeError("Invalid quadrilateral problem");
  const text = copy[locale(lang)];
  return [text.hints[p.domain], ["classify", "build"].includes(p.domain) ? `${text.convention} ${text.rules}` : "",
    p.extra === "exactly-one-parallel" ? text.extra : ""].filter(Boolean).join(" ");
}
export function solutionFor(p, lang = "ko", response) {
  const text = copy[locale(lang)];
  const answers = answerFor(p);
  const accepted = p.domain === "build" && grade(p, response).correct;
  const point = p.domain === "build" ? (accepted ? response : answers.find(d => p.example && d[0] === p.example[0] && d[1] === p.example[1]) || answers[0]) : null;
  if (p.domain === "build" && !point) throw new RangeError("Quadrilateral problem has no construction");
  const info = properties(p.domain === "build" ? [...p.vertices, point] : p.vertices);
  const pairLabels = optionLabels("parallel", lang);
  const parallel = info.parallelPairs.map(id => pairLabels.find(option => option.id === id).label).join(", ") || text.none;
  const right = info.rightVertices.join(", ") || text.none;
  const equal = info.equalSideGroups.map(group => group.map(i => SIDES[i]).join(" = ")).join("; ") || text.none;
  const facts = text.facts(parallel, right, equal);
  if (p.domain === "build") return `${text.built(point, accepted, className(p.target, lang))} ${facts}`;
  const options = optionLabels(p.domain, lang);
  const labels = answers.map(id => options.find(option => option.id === id).label).join(", ");
  return `${text.selection(labels)} ${facts}${p.domain === "classify" ? ` ${text.convention} ${text.rules}` : ""}`;
}
