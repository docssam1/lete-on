export const estimateProblems = [30,60,110,140,85,45,125,20,75,160,40,100,65,150,95,25,135,55,120,170].map((angle, index) => ({
  id: `estimate-${String(index + 1).padStart(2, "0")}`, domain: "estimate", unit: "degree", angle,
  orientation: [0,-35,20,-80,120,-15,145,60,-120,35][index % 10],
  lengths: [104 + index % 3 * 10, 108 + index % 4 * 6]
}));

const arms = [
  [[2,3],[5,3]], [[3,2],[3,5]], [[2,2],[4,4]], [[3,3],[5,2]], [[2,3],[3,1]],
  [[3,2],[0,2]], [[2,3],[2,0]], [[3,3],[1,1]], [[2,2],[4,3]], [[3,2],[2,4]],
  [[1,2],[4,2]], [[4,3],[4,0]], [[2,3],[4,1]], [[3,2],[1,3]], [[2,2],[3,4]],
  [[4,2],[1,2]], [[1,3],[1,5]], [[3,2],[1,4]], [[2,3],[4,4]], [[3,3],[2,1]]
];
export const rightAngleProblems = arms.map(([origin, arm], index) => ({
  id: `right-angle-${String(index + 1).padStart(2, "0")}`, domain: "right-angle", unit: "point", size: 6, origin, arm
}));

export function dotAt(p, point) {
  return (p.arm[0] - p.origin[0]) * (point[0] - p.origin[0]) + (p.arm[1] - p.origin[1]) * (point[1] - p.origin[1]);
}
export function validPoint(p, point) {
  return Array.isArray(point) && point.length === 2 && point.every(v => Number.isInteger(v) && v >= 0 && v < p.size) && point.some((v, i) => v !== p.origin[i]);
}
export function rightAngleSolutions(p) {
  const result = [];
  for (let y = 0; y < p.size; y++) for (let x = 0; x < p.size; x++) {
    if (validPoint(p, [x, y]) && dotAt(p, [x, y]) === 0) result.push([x, y]);
  }
  return result;
}
export function angleAt(p, point) {
  if (!validPoint(p, point)) return null;
  const u = p.arm.map((v, i) => v - p.origin[i]);
  const v = point.map((n, i) => n - p.origin[i]);
  return Math.acos(Math.max(-1, Math.min(1, dotAt(p, point) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;
}
export function readNumber(value) {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
export function gradeBasic(p, response) {
  if (p.domain === "estimate") {
    const value = readNumber(response);
    if (value === null || value < 0 || value > 180) return { valid: false, kind: "invalid" };
    const difference = Math.abs(value - p.angle);
    return { valid: true, correct: difference <= 10, kind: difference <= 10 ? "close" : "compare", difference, value };
  }
  if (!validPoint(p, response)) return { valid: false, kind: "invalid" };
  const dot = dotAt(p, response);
  return { valid: true, correct: dot === 0, kind: dot === 0 ? "right" : dot > 0 ? "acute" : "obtuse", value: angleAt(p, response) };
}

const copy = {
  ko: {
    estimatePrompt: "이 각의 크기를 어림해 보세요.", rightPrompt: "점 O에서 점 B를 이어 직각을 하나 만드세요.",
    estimateHint: "직각은 90°예요. 직각보다 얼마나 좁거나 넓은지 비교해 보세요. 변의 길이는 각의 크기를 바꾸지 않아요.",
    rightHint: "점 O가 각의 꼭짓점이에요. OA를 한 변으로 하여 두 변이 직각으로 만나도록 점 B를 골라 보세요. 기울어진 직각도 있어요.",
    rightSolution: "예시 답안입니다. OA와 OB가 점 O에서 직각으로 만나요. 다른 점으로 만든 직각도 답이 됩니다.",
    exact: "실제 각도", gap: "어림값과의 차이"
  },
  en: { estimatePrompt: "Estimate the size of this angle.", rightPrompt: "Join O to a point B to make one right angle.", estimateHint: "A right angle is 90°. Compare the opening with a right angle. Arm length does not change the angle.", rightHint: "O is the vertex. Keep OA as one arm and choose B so the arms meet at a right angle. Right angles can be tilted.", rightSolution: "One example: OA and OB meet at a right angle at O. Other points that make a right angle also work.", exact: "Actual angle", gap: "Difference from your estimate" },
  zh: { estimatePrompt: "估一估这个角有多少度。", rightPrompt: "从点 O 连接一个点 B，画出一个直角。", estimateHint: "直角是90°。比较这个角比直角小多少或大多少。边的长度不改变角的大小。", rightHint: "O 是角的顶点。以 OA 为一条边，选择点 B，使两条边构成直角。倾斜的角也可以是直角。", rightSolution: "这是一种答案。OA 与 OB 在 O 点构成直角。其他能构成直角的点也正确。", exact: "实际角度", gap: "与估计值相差" },
  ja: { estimatePrompt: "この角の大きさを見積もりましょう。", rightPrompt: "点 O と点 B を結んで、直角を一つ作りましょう。", estimateHint: "直角は90°です。直角よりどれくらい小さいか、大きいかを比べましょう。辺の長さで角の大きさは変わりません。", rightHint: "O は角の頂点です。OA を一辺として、直角になる点 B を選びましょう。傾いた直角もあります。", rightSolution: "答えの一例です。OA と OB は点 O で直角に交わります。他の点で作った直角も正解です。", exact: "実際の角度", gap: "見積もりとの差" }
};
export function basicPrompt(p, lang = "ko") { const t = copy[lang] || copy.ko; return p.domain === "estimate" ? t.estimatePrompt : t.rightPrompt; }
export function basicHint(p, lang = "ko") { const t = copy[lang] || copy.ko; return p.domain === "estimate" ? t.estimateHint : t.rightHint; }
export function basicSolution(p, lang = "ko", response) {
  const t = copy[lang] || copy.ko;
  if (p.domain !== "estimate") return t.rightSolution;
  const number = readNumber(response);
  return `${t.exact}: ${p.angle}°.${number === null ? "" : ` ${t.gap}: ${Number(Math.abs(number - p.angle).toFixed(2))}°.`}`;
}
