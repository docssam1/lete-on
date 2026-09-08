const RAD = Math.PI / 180;
const DEGREE = "\u00b0";
const TIMES = "\u00d7";
const DIVIDE = "\u00f7";
const LETTERS = "ABCDEFGHI";
const LOCALES = ["ko", "en", "zh", "ja"];
const locale = (lang) => LOCALES.includes(lang) ? lang : "ko";
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

// Uniform fitting preserves every angle, including the labelled exact angles.
function fit(points) {
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const left = Math.min(...xs), top = Math.min(...ys);
  const width = Math.max(...xs) - left, height = Math.max(...ys) - top;
  const scale = Math.min(220 / width, 166 / height);
  return points.map(([x, y]) => [180 + (x - left - width / 2) * scale, 137 + (y - top - height / 2) * scale]);
}

function ellipse(degrees, ratio = 0.82) {
  return fit(degrees.map((a) => [Math.cos(a * RAD), ratio * Math.sin(a * RAD)]));
}

function triangle(a, b) {
  const side = Math.sin(b * RAD) / Math.sin((180 - a - b) * RAD);
  return fit([[0, 0], [1, 0], [side * Math.cos(a * RAD), -side * Math.sin(a * RAD)]]);
}

function regular(sides, rotation) {
  return ellipse(Array.from({ length: sides }, (_, i) => rotation + 360 * i / sides), 1);
}

function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

// Original, bounded seeds. No scans, copied questions, or external assets.
export const polygonProblems = freeze([
  { id: "polygon-01", domain: "polygon", kind: "triangles", unit: "count", sides: 4, anchor: 0, vertices: ellipse([-115, -20, 75, 165]) },
  { id: "polygon-02", domain: "polygon", kind: "triangles", unit: "count", sides: 5, anchor: 0, vertices: ellipse([-110, -35, 30, 105, 180]) },
  { id: "polygon-03", domain: "polygon", kind: "triangles", unit: "count", sides: 6, anchor: 0, vertices: ellipse([-120, -62, -3, 55, 116, 182]) },
  { id: "polygon-04", domain: "polygon", kind: "triangles", unit: "count", sides: 7, anchor: 0, vertices: ellipse([-113, -65, -12, 37, 91, 147, 199]) },
  { id: "polygon-05", domain: "polygon", kind: "triangles", unit: "count", sides: 8, anchor: 0, vertices: ellipse([-110, -64, -20, 26, 69, 112, 160, 202]) },
  { id: "polygon-06", domain: "polygon", kind: "sum", unit: "degree", sides: 4, anchor: 0, vertices: ellipse([-130, -30, 55, 150], 0.72) },
  { id: "polygon-07", domain: "polygon", kind: "sum", unit: "degree", sides: 5, anchor: 0, vertices: ellipse([-123, -48, 23, 95, 175], 0.9) },
  { id: "polygon-08", domain: "polygon", kind: "sum", unit: "degree", sides: 6, anchor: 0, vertices: ellipse([-130, -75, -14, 50, 115, 176], 0.76) },
  { id: "polygon-09", domain: "polygon", kind: "sum", unit: "degree", sides: 7, anchor: 0, vertices: ellipse([-126, -76, -20, 30, 79, 131, 184], 0.93) },
  { id: "polygon-10", domain: "polygon", kind: "sum", unit: "degree", sides: 9, anchor: 0, vertices: ellipse([-116, -76, -35, 5, 43, 81, 123, 164, 205]) },
  { id: "polygon-11", domain: "polygon", kind: "missing", unit: "degree", sides: 3, anchor: 0, target: 2, knownAngles: [55, 65, null], vertices: triangle(55, 65) },
  { id: "polygon-12", domain: "polygon", kind: "missing", unit: "degree", sides: 3, anchor: 0, target: 2, knownAngles: [90, 38, null], vertices: triangle(90, 38) },
  { id: "polygon-13", domain: "polygon", kind: "missing", unit: "degree", sides: 3, anchor: 0, target: 2, knownAngles: [42, 42, null], vertices: triangle(42, 42) },
  { id: "polygon-14", domain: "polygon", kind: "missing", unit: "degree", sides: 3, anchor: 0, target: 1, knownAngles: [35, null, 35], vertices: triangle(35, 110) },
  { id: "polygon-15", domain: "polygon", kind: "missing", unit: "degree", sides: 4, anchor: 0, target: 0, knownAngles: [null, 90, 75, 90], vertices: ellipse([-130, -50, 50, 160], 1) },
  { id: "polygon-16", domain: "polygon", kind: "missing", unit: "degree", sides: 4, anchor: 0, target: 3, knownAngles: [75, 110, 105, null], vertices: ellipse([-150, -60, -10, 90], 1) },
  { id: "polygon-17", domain: "polygon", kind: "missing", unit: "degree", sides: 4, anchor: 0, target: 3, knownAngles: [65, 80, 100, null], vertices: fit([[0, 0], [1, 0], [1 - 0.55 / Math.tan(80 * RAD), -0.55], [0.55 / Math.tan(65 * RAD), -0.55]]) },
  { id: "polygon-18", domain: "polygon", kind: "regular", unit: "degree", sides: 5, anchor: 0, target: 1, regular: true, vertices: regular(5, -90) },
  { id: "polygon-19", domain: "polygon", kind: "regular", unit: "degree", sides: 6, anchor: 0, target: 1, regular: true, vertices: regular(6, -120) },
  { id: "polygon-20", domain: "polygon", kind: "regular", unit: "degree", sides: 8, anchor: 0, target: 1, regular: true, vertices: regular(8, -112.5) },
]);

function measuredAngle(points, index) {
  const v = points[index], a = points[(index + points.length - 1) % points.length], b = points[(index + 1) % points.length];
  const dot = (a[0] - v[0]) * (b[0] - v[0]) + (a[1] - v[1]) * (b[1] - v[1]);
  return Math.acos(Math.max(-1, Math.min(1, dot / (distance(a, v) * distance(b, v))))) / RAD;
}

function validate(p) {
  const fail = (message) => { throw new TypeError(`Invalid polygon problem: ${message}`); };
  if (!p || p.domain !== "polygon" || !/^polygon-\d{2}$/.test(p.id)) fail("identity");
  if (!["triangles", "sum", "missing", "regular"].includes(p.kind)) fail("kind");
  if (!Number.isInteger(p.sides) || p.sides < 3 || p.sides > 9 || p.vertices?.length !== p.sides) fail("sides");
  if (p.unit !== (p.kind === "triangles" ? "count" : "degree")) fail("unit");
  if (!Number.isInteger(p.anchor) || p.anchor < 0 || p.anchor >= p.sides) fail("anchor");
  if (!p.vertices.every((v) => Array.isArray(v) && v.length === 2 && v.every(Number.isFinite) && v[0] >= 60 && v[0] <= 300 && v[1] >= 44 && v[1] <= 230)) fail("coordinates");
  const vertices = p.vertices;
  const sign = Math.sign(cross(vertices[0], vertices[1], vertices[2]));
  for (let i = 0; i < p.sides; i++) {
    const next = (i + 1) % p.sides;
    if (distance(vertices[i], vertices[next]) < 24) fail("short edge");
    // Every other vertex must lie strictly inside every oriented supporting edge.
    for (let j = 0; j < p.sides; j++) {
      if (j !== i && j !== next && sign * cross(vertices[i], vertices[next], vertices[j]) <= 0.001) fail("strict convexity");
    }
  }
  if (p.kind === "missing" || p.kind === "regular") {
    if (!Number.isInteger(p.target) || p.target < 0 || p.target >= p.sides) fail("target");
  }
  if (p.kind === "missing") {
    if (![3, 4].includes(p.sides) || p.knownAngles?.length !== p.sides || p.knownAngles[p.target] !== null) fail("missing angle");
    p.knownAngles.forEach((value, i) => {
      if (i !== p.target && (!Number.isInteger(value) || value <= 0 || value >= 180 || Math.abs(value - measuredAngle(vertices, i)) > 1e-7)) fail("angle label");
    });
    const answer = (p.sides - 2) * 180 - p.knownAngles.reduce((sum, value) => sum + value, 0);
    if (answer <= 0 || answer >= 180 || Math.abs(answer - measuredAngle(vertices, p.target)) > 1e-7) fail("angle answer");
  } else if (p.knownAngles !== undefined) fail("unexpected angle labels");
  if (p.kind === "regular") {
    if (p.regular !== true) fail("explicit regular condition");
    const edge = distance(vertices[0], vertices[1]);
    vertices.forEach((v, i) => {
      if (Math.abs(distance(v, vertices[(i + 1) % p.sides]) - edge) > 1e-7 || Math.abs(measuredAngle(vertices, i) - (p.sides - 2) * 180 / p.sides) > 1e-7) fail("regular geometry");
    });
    if (!Number.isInteger((p.sides - 2) * 180 / p.sides)) fail("noninteger answer");
  } else if (p.regular) fail("unexpected regular condition");
  return p;
}

export function polygonAnswer(p) {
  validate(p);
  if (p.kind === "triangles") return p.sides - 2;
  const total = (p.sides - 2) * 180;
  if (p.kind === "missing") return total - p.knownAngles.reduce((sum, value) => sum + value, 0);
  return p.kind === "regular" ? total / p.sides : total;
}

const NAMES = {
  ko: ["", "", "", "삼각형", "사각형", "오각형", "육각형", "칠각형", "팔각형", "구각형"],
  en: ["", "", "", "triangle", "quadrilateral", "pentagon", "hexagon", "heptagon", "octagon", "nonagon"],
  zh: ["", "", "", "三角形", "四边形", "五边形", "六边形", "七边形", "八边形", "九边形"],
  ja: ["", "", "", "三角形", "四角形", "五角形", "六角形", "七角形", "八角形", "九角形"],
};
const regularName = (p, lang) => ({ ko: "정", en: "Regular ", zh: "正", ja: "正" }[lang]) + NAMES[lang][p.sides];

export function polygonPrompt(p, lang = "ko") {
  validate(p);
  lang = locale(lang);
  const name = NAMES[lang][p.sides], a = LETTERS[p.anchor], t = LETTERS[p.target];
  const prompts = {
    triangles: {
      ko: `이 ${name}의 꼭짓점 ${a}에서 이웃하지 않은 모든 꼭짓점으로 대각선을 그어 보세요. 겹치지 않는 삼각형 몇 개로 나뉘나요?`,
      en: `Draw diagonals from vertex ${a} to every non-neighboring vertex of this ${name}. How many non-overlapping triangles are formed?`,
      zh: `请从这个${name}的顶点${a}向所有不相邻的顶点画对角线。能分成几个互不重叠的三角形？`,
      ja: `この${name}の頂点${a}から、隣り合わないすべての頂点へ対角線を引きましょう。重ならない三角形はいくつできますか。`,
    },
    sum: {
      ko: `이 ${name}의 모든 내각의 합은 몇 도인가요? 꼭짓점 ${a}에서 삼각형으로 나누어 생각해 보세요.`,
      en: `What is the sum of all interior angles of this ${name}, in degrees? Think of splitting it into triangles from vertex ${a}.`,
      zh: `这个${name}的内角和是多少度？试着从顶点${a}把它分成三角形。`,
      ja: `この${name}の内角の和は何度ですか。頂点${a}から三角形に分けて考えましょう。`,
    },
    missing: {
      ko: `이 ${name}에서 꼭짓점 ${t}의 물음표 각은 몇 도인가요? 내각의 합과 주어진 각을 이용하세요.`,
      en: `How many degrees is the unknown interior angle at ${t} in this ${name}? Use the interior-angle sum and the given angles.`,
      zh: `这个${name}中，顶点${t}处的未知内角是多少度？利用内角和与已知的角来求。`,
      ja: `この${name}の頂点${t}にある、?の内角は何度ですか。内角の和と、わかっている角を使いましょう。`,
    },
    regular: {
      ko: `모든 변의 길이와 모든 내각의 크기가 같은 ${regularName(p, lang)}입니다. 꼭짓점 ${t}의 한 내각은 몇 도인가요?`,
      en: `This is a ${regularName(p, lang).toLowerCase()}: all sides and all interior angles are equal. How many degrees is the interior angle at ${t}?`,
      zh: `这是${regularName(p, lang)}，所有边都相等，所有内角也相等。顶点${t}处的一个内角是多少度？`,
      ja: `すべての辺の長さと内角の大きさが等しい${regularName(p, lang)}です。頂点${t}の一つの内角は何度ですか。`,
    },
  };
  return prompts[p.kind][lang];
}

export function polygonHint(p, lang = "ko") {
  validate(p);
  lang = locale(lang);
  const hints = {
    triangles: {
      ko: "한 꼭짓점에서만 선을 그으세요. 양옆의 변은 이미 있으므로, 이웃하지 않은 꼭짓점에만 연결한 뒤 삼각형을 세어 보세요.",
      en: "Start at just one vertex. Its two neighboring sides already exist. Connect only to non-neighbors, then count the triangular regions.",
      zh: "只从一个顶点出发。相邻的两条边已经存在，只需连接不相邻的顶点，再数三角形区域。",
      ja: "一つの頂点からだけ線を引きます。両隣の辺はすでにあるので、隣り合わない頂点につないで三角形を数えましょう。",
    },
    sum: {
      ko: "삼각형 하나의 내각의 합은 180°입니다. 한 꼭짓점에서 나눈 삼각형의 개수를 먼저 찾고, 그만큼 180°를 모아 보세요.",
      en: "Each triangle has an interior-angle sum of 180°. First count the triangles made from one vertex, then combine their 180° sums.",
      zh: "每个三角形的内角和是180°。先数从一个顶点分成的三角形，再把它们的180°加起来。",
      ja: "三角形一つの内角の和は180°です。一つの頂点からできる三角形を数え、その分の180°を集めましょう。",
    },
    missing: {
      ko: "삼각형의 내각의 합은 180°입니다. 사각형은 삼각형 두 개로 나눌 수 있어요. 전체에서 이미 아는 각들의 합을 빼 보세요.",
      en: "A triangle's angles sum to 180°. A quadrilateral can be split into two triangles. Subtract the sum of the known angles from the whole.",
      zh: "三角形的内角和是180°，四边形可以分成两个三角形。用内角总和减去已知角的和。",
      ja: "三角形の内角の和は180°です。四角形は二つの三角形に分けられます。全体の和から、わかっている角の和を引きましょう。",
    },
    regular: {
      ko: "먼저 삼각형으로 나누어 내각의 합을 구하세요. 정다각형의 내각은 모두 같으므로, 그 합을 꼭짓점 수만큼 똑같이 나누세요.",
      en: "First split the polygon into triangles to find the interior-angle sum. Because it is regular, share that sum equally among all vertices.",
      zh: "先分成三角形，求出内角和。正多边形的内角都相等，所以按顶点的个数把内角和平分。",
      ja: "まず三角形に分けて内角の和を求めます。正多角形の内角はすべて等しいので、頂点の数で等しく分けましょう。",
    },
  };
  return hints[p.kind][lang];
}

export function polygonSolution(p, lang = "ko") {
  const answer = polygonAnswer(p);
  lang = locale(lang);
  const n = p.sides, k = n - 2, total = k * 180, a = LETTERS[p.anchor];
  const partition = {
    ko: `${a}에서 이웃하지 않은 꼭짓점으로 대각선을 그으면 ${n} - 2 = ${k}개의 삼각형이 빈틈이나 겹침 없이 생깁니다.`,
    en: `Diagonals from ${a} to the non-neighboring vertices make ${n} - 2 = ${k} triangles, without gaps or overlaps.`,
    zh: `从${a}向不相邻的顶点画对角线，得到${n} - 2 = ${k}个三角形，没有空隙或重叠。`,
    ja: `${a}から隣り合わない頂点へ対角線を引くと、${n} - 2 = ${k}個の三角形が、すきまや重なりなくできます。`,
  }[lang];
  if (p.kind === "triangles") return partition;
  const sum = {
    ko: `삼각형들의 각을 모으면 다각형의 모든 내각이 됩니다. ${k} ${TIMES} 180${DEGREE} = ${total}${DEGREE}입니다.`,
    en: `Together, the triangles' angles fill all the polygon's interior angles: ${k} ${TIMES} 180${DEGREE} = ${total}${DEGREE}.`,
    zh: `这些三角形的角合起来正好组成多边形的所有内角：${k} ${TIMES} 180${DEGREE} = ${total}${DEGREE}。`,
    ja: `三角形の角を集めると、多角形のすべての内角になります。${k} ${TIMES} 180${DEGREE} = ${total}${DEGREE}です。`,
  }[lang];
  if (p.kind === "sum") return `${partition} ${sum}`;
  if (p.kind === "regular") {
    const share = {
      ko: `정다각형이므로 ${n}개의 내각이 모두 같습니다. ${total}${DEGREE} ${DIVIDE} ${n} = ${answer}${DEGREE}입니다.`,
      en: `This polygon is explicitly regular, so its ${n} interior angles are equal: ${total}${DEGREE} ${DIVIDE} ${n} = ${answer}${DEGREE}.`,
      zh: `因为是正多边形，${n}个内角都相等：${total}${DEGREE} ${DIVIDE} ${n} = ${answer}${DEGREE}。`,
      ja: `正多角形なので${n}個の内角はすべて等しく、${total}${DEGREE} ${DIVIDE} ${n} = ${answer}${DEGREE}です。`,
    }[lang];
    return `${partition} ${sum} ${share}`;
  }
  const known = p.knownAngles.filter((v) => v !== null);
  const subtotal = known.reduce((s, v) => s + v, 0);
  const expression = `${known.map((v) => `${v}${DEGREE}`).join(" + ")} = ${subtotal}${DEGREE}; ${total}${DEGREE} - ${subtotal}${DEGREE} = ${answer}${DEGREE}`;
  return {
    ko: `${p.sides === 3 ? "삼각형" : "삼각형 두 개로 나눈 사각형"}의 내각의 합은 ${total}${DEGREE}입니다. 주어진 각의 합을 빼면 물음표 각만 남습니다. ${expression}.`,
    en: `The ${p.sides === 3 ? "triangle" : "quadrilateral, split into two triangles,"} has an interior-angle sum of ${total}${DEGREE}. Subtracting all known angles leaves exactly the unknown angle: ${expression}.`,
    zh: `${p.sides === 3 ? "三角形" : "分成两个三角形的四边形"}的内角和是${total}${DEGREE}。减去所有已知角，剩下的就是未知角：${expression}。`,
    ja: `${p.sides === 3 ? "三角形" : "二つの三角形に分けた四角形"}の内角の和は${total}${DEGREE}です。わかっている角の和を引くと、?の角だけが残ります。${expression}。`,
  }[lang];
}

function bisector(points, index) {
  const v = points[index], prev = points[(index + points.length - 1) % points.length], next = points[(index + 1) % points.length];
  const u = [(prev[0] - v[0]) / distance(prev, v), (prev[1] - v[1]) / distance(prev, v)];
  const w = [(next[0] - v[0]) / distance(next, v), (next[1] - v[1]) / distance(next, v)];
  const length = Math.hypot(u[0] + w[0], u[1] + w[1]);
  return [(u[0] + w[0]) / length, (u[1] + w[1]) / length];
}

const coordinate = (value) => Number(value.toFixed(8));
const pointString = (point) => point.map(coordinate).join(",");
function text(x, y, value, size = 18, color = "#182230", extra = "") {
  return `<text x="${coordinate(x)}" y="${coordinate(y)}" text-anchor="middle" dominant-baseline="middle" font-size="${size}" fill="${color}" stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round" ${extra}>${escape(value)}</text>`;
}

function angleMark(p, index, value, unknown) {
  const points = p.vertices, v = points[index];
  const prev = points[(index + p.sides - 1) % p.sides], next = points[(index + 1) % p.sides];
  const u = [(prev[0] - v[0]) / distance(prev, v), (prev[1] - v[1]) / distance(prev, v)];
  const w = [(next[0] - v[0]) / distance(next, v), (next[1] - v[1]) / distance(next, v)];
  const radius = 19, start = [v[0] + radius * u[0], v[1] + radius * u[1]], end = [v[0] + radius * w[0], v[1] + radius * w[1]];
  const sweep = u[0] * w[1] - u[1] * w[0] > 0 ? 1 : 0;
  const direction = bisector(points, index);
  const labelDistance = Math.max(39, 23 / Math.sin(measuredAngle(points, index) * RAD / 2));
  const color = unknown ? "#2456C4" : "#182230";
  return `<path data-angle-arc="${index}" d="M${pointString(start)} A${radius},${radius} 0 0 ${sweep} ${pointString(end)}" fill="none" stroke="${color}" stroke-width="1.5"/>${text(v[0] + direction[0] * labelDistance, v[1] + direction[1] * labelDistance, value, 18, color, `data-angle-label="${index}"`)}`;
}

function fan(p, numberTriangles) {
  const points = Array.from({ length: p.sides }, (_, i) => p.vertices[(p.anchor + i) % p.sides]);
  let markup = "";
  for (let i = 2; i <= p.sides - 2; i++) markup += `<path data-diagonal="${i}" d="M${pointString(points[0])} L${pointString(points[i])}" stroke="#16734B" stroke-width="1.7" stroke-dasharray="5 4" fill="none"/>`;
  if (numberTriangles) {
    for (let i = 1; i < p.sides - 1; i++) {
      const [a, b, c] = [points[0], points[i], points[i + 1]];
      const [wa, wb, wc] = [distance(b, c), distance(a, c), distance(a, b)], perimeter = wa + wb + wc;
      const x = (wa * a[0] + wb * b[0] + wc * c[0]) / perimeter;
      const y = (wa * a[1] + wb * b[1] + wc * c[1]) / perimeter;
      markup += text(x, y, i, 15, "#16734B", 'data-triangle-number="true"');
    }
  }
  return markup;
}

function equations(p, lang) {
  const n = p.sides, k = n - 2, total = k * 180, answer = polygonAnswer(p);
  if (p.kind === "triangles") return [
    { ko: `${LETTERS[p.anchor]}에서 나눈 삼각형`, en: `Triangles from ${LETTERS[p.anchor]}`, zh: `从${LETTERS[p.anchor]}分成的三角形`, ja: `${LETTERS[p.anchor]}から分けた三角形` }[lang],
    `${n} - 2 = ${answer}${{ ko: "개", en: " triangles", zh: "个", ja: "個" }[lang]}`,
  ];
  if (p.kind === "sum") return [`${n} - 2 = ${k}`, `${k} ${TIMES} 180${DEGREE} = ${total}${DEGREE}`];
  if (p.kind === "regular") return [`(${n} - 2) ${TIMES} 180${DEGREE} = ${total}${DEGREE}`, `${total}${DEGREE} ${DIVIDE} ${n} = ${answer}${DEGREE}`];
  const known = p.knownAngles.filter((v) => v !== null), subtotal = known.reduce((s, v) => s + v, 0);
  return [`${known.map((v) => `${v}${DEGREE}`).join(" + ")} = ${subtotal}${DEGREE}`, `${total}${DEGREE} - ${subtotal}${DEGREE} = ${answer}${DEGREE}`];
}

export function renderPolygon(p, { reveal = false, lang = "ko", selectedVertices = [], interactive = false } = {}) {
  validate(p);
  if (typeof reveal !== "boolean") throw new TypeError("reveal must be boolean");
  if (typeof interactive !== "boolean") throw new TypeError("interactive must be boolean");
  const construction = p.kind === "triangles" && !reveal;
  const controls = construction && interactive;
  const selected = new Set();
  if (construction) {
    if (!Array.isArray(selectedVertices)) throw new TypeError("selectedVertices must be an array");
    for (const index of selectedVertices) {
      if (!Number.isInteger(index) || index < 0 || index >= p.sides) throw new TypeError("selectedVertices must contain valid vertex indices");
      if (index !== p.anchor) selected.add(index);
    }
  }
  lang = locale(lang);
  const title = { ko: "다각형의 각도 문제 그림", en: "Polygon angle problem diagram", zh: "多边形角度题图", ja: "多角形の角の問題図" }[lang];
  let markup = `<polygon data-polygon-outline="true" points="${p.vertices.map(pointString).join(" ")}" fill="#F5F6F8" stroke="#182230" stroke-width="2.2" stroke-linejoin="round"/>`;
  if (reveal && p.kind !== "missing") markup += fan(p, p.kind !== "regular");
  for (const index of [...selected].sort((a, b) => a - b)) {
    const offset = (index - p.anchor + p.sides) % p.sides;
    if (offset > 1 && offset < p.sides - 1) markup += `<path data-diagonal="${index}" data-learner-diagonal="true" d="M${pointString(p.vertices[p.anchor])} L${pointString(p.vertices[index])}" fill="none" stroke="#2456C4" stroke-width="2"/>`;
  }
  if (controls) markup += '<style>[data-polygon-interactive] [data-vertex]:focus-visible [data-vertex-ring]{stroke:#2456C4;stroke-width:3}[data-polygon-interactive] [data-vertex]:hover [data-vertex-ring]{stroke:#2456C4}</style>';
  p.vertices.forEach((v, i) => {
    const direction = bisector(p.vertices, i);
    if (controls && i !== p.anchor) {
      const pressed = selected.has(i);
      markup += `<g data-vertex="${i}" role="button" tabindex="0" aria-pressed="${pressed}" aria-label="${LETTERS[i]}" style="cursor:pointer;outline:none"><title>${LETTERS[i]}</title><circle data-vertex-hit="true" cx="${coordinate(v[0])}" cy="${coordinate(v[1])}" r="20" fill="transparent" pointer-events="all"/><circle data-vertex-ring="true" cx="${coordinate(v[0])}" cy="${coordinate(v[1])}" r="13" fill="${pressed ? "#EAF0FF" : "#fff"}" stroke="${pressed ? "#2456C4" : "#566274"}" stroke-width="1.5"/>${text(v[0], v[1], LETTERS[i], 14, "#182230", 'pointer-events="none"')}</g>`;
    } else {
      markup += text(v[0] - direction[0] * 17, v[1] - direction[1] * 17, LETTERS[i], 16);
    }
    if (i === p.anchor && ["triangles", "sum"].includes(p.kind)) markup += `<circle cx="${coordinate(v[0])}" cy="${coordinate(v[1])}" r="3.5" fill="#2456C4"/>`;
    if (p.kind === "missing") markup += angleMark(p, i, i === p.target ? (reveal ? `${polygonAnswer(p)}${DEGREE}` : "?") : `${p.knownAngles[i]}${DEGREE}`, i === p.target);
    if (p.kind === "regular" && i === p.target) markup += angleMark(p, i, reveal ? `${polygonAnswer(p)}${DEGREE}` : "?", true);
  });
  if (p.kind === "regular") markup += text(180, 14, regularName(p, lang), 16);
  if (reveal) equations(p, lang).forEach((line, i) => { markup += text(180, 260 + i * 23, line, 16, "#16734B", 'data-solution-step="true"'); });
  markup += '<text x="338" y="296" text-anchor="end" font-size="8" fill="#566274">GFIELD</text>';
  const givens = p.kind === "missing" ? ` ${p.knownAngles.map((v, i) => `${LETTERS[i]}: ${v === null ? "?" : `${v}${DEGREE}`}`).join(", ")}.` : "";
  const description = `${polygonPrompt(p, lang)}${givens}${reveal ? ` ${polygonSolution(p, lang)}` : ""}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300" width="360" height="300" role="${controls ? "group" : "img"}"${controls ? ' data-polygon-interactive="true"' : ""} lang="${lang}" aria-label="${escape(title)}" style="display:block;width:100%;max-width:360px;height:auto;overflow:visible;font-family:Arial,'Malgun Gothic','Yu Gothic',sans-serif;letter-spacing:0"><title>${escape(title)}</title><desc>${escape(description)}</desc><rect width="360" height="300" fill="#fff"/>${markup}</svg>`;
}
