(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE29_M3_SYNTHETIC = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e3-mission-3";
  const generatorKey = "source52RotatedIsoscelesSyntheticPage29Mission3";
  const definition = Object.freeze({ sourceItemId, generatorKey, publicReady: true });
  const pools = Object.freeze([62, 69, 72]);
  const difficulties = Object.freeze([-1, 0, 1]);
  const rotation = 45;
  const round = value => Number(value.toFixed(7));
  const radians = degrees => degrees * Math.PI / 180;
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));

  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const angle = (a, vertex, b) => {
    const ux = a.x - vertex.x, uy = a.y - vertex.y;
    const vx = b.x - vertex.x, vy = b.y - vertex.y;
    const cosine = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
  };
  function intersection(a, b, c, d) {
    const ux = b.x - a.x, uy = b.y - a.y, vx = d.x - c.x, vy = d.y - c.y;
    const denominator = ux * vy - uy * vx;
    if (Math.abs(denominator) < 1e-10) throw new Error("두 선분이 평행하여 교점을 만들지 않습니다.");
    const t = ((c.x - a.x) * vy - (c.y - a.y) * vx) / denominator;
    const u = ((c.x - a.x) * uy - (c.y - a.y) * ux) / denominator;
    return { x: a.x + t * ux, y: a.y + t * uy, t, u };
  }
  function rotate(point, degrees) {
    const theta = radians(degrees), c = Math.cos(theta), s = Math.sin(theta);
    return { x: point.x * c - point.y * s, y: point.x * s + point.y * c };
  }

  function model(poolIndex = 0, difficultyOffset = 0) {
    const base = pools[((poolIndex % pools.length) + pools.length) % pools.length] + (difficulties.includes(difficultyOffset) ? difficultyOffset : 0);
    const apex = 180 - 2 * base;
    if (!(base > 45 && apex > 0)) throw new Error("이등변삼각형의 각 조건이 올바르지 않습니다.");
    const D = { x: 0, y: 0 };
    const G = { x: Math.cos(radians(180 - base)), y: Math.sin(radians(180 - base)) };
    const N = { x: -2 * Math.cos(radians(base)), y: 0 };
    const R = rotate(G, -rotation);
    const B = rotate(N, -rotation);
    const M = intersection(D, G, R, B);
    const answer = angle(D, M, B);
    return Object.freeze({
      base, apex, rotation, answer: round(answer), expectedAnswer: apex + rotation,
      points: Object.freeze(Object.fromEntries(Object.entries({ G, N, D, R, B, M }).map(([key, point]) => [key, Object.freeze({ x: round(point.x), y: round(point.y) })]))),
      intersections: Object.freeze({ mOnGD: round(M.t), mOnRB: round(M.u) }),
      sides: Object.freeze({ GN: distance(G, N), GD: distance(G, D), RB: distance(R, B), RD: distance(R, D) }),
      angles: Object.freeze({ atN: angle(G, N, D), atD: angle(N, D, G), apexAtG: angle(N, G, D), targetAtM: answer })
    });
  }

  function diagram(shape, { solution = false } = {}) {
    const width = 500, height = 355, pad = 46;
    const projectedPoints = Object.values(shape.points).map(point => ({ x: point.x, y: point.y }));
    const minX = Math.min(...projectedPoints.map(point => point.x)), maxX = Math.max(...projectedPoints.map(point => point.x));
    const minY = Math.min(...projectedPoints.map(point => point.y)), maxY = Math.max(...projectedPoints.map(point => point.y));
    const scale = Math.min((width - 2 * pad) / (maxX - minX), (height - 2 * pad) / (maxY - minY));
    const project = ({ x, y }) => ({
      x: round(pad + (x - minX) * scale + (width - 2 * pad - (maxX - minX) * scale) / 2),
      y: round(height - pad - (y - minY) * scale - (height - 2 * pad - (maxY - minY) * scale) / 2)
    });
    const p = Object.fromEntries(Object.entries(shape.points).map(([key, point]) => [key, project(point)]));
    const line = (a, b, cls = "") => `<line${cls ? ` class="${cls}"` : ""} x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}"/>`;
    const label = (key, value, dx, dy, cls = "") => `<text${cls ? ` class="${cls}"` : ""} x="${round(p[key].x + dx)}" y="${round(p[key].y + dy)}">${esc(value)}</text>`;
    const arc = (vertexKey, aKey, bKey, radius, cls) => {
      const v = p[vertexKey], a = p[aKey], b = p[bKey];
      const first = Math.atan2(a.y - v.y, a.x - v.x), second = Math.atan2(b.y - v.y, b.x - v.x);
      const delta = ((second - first + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const start = { x: v.x + radius * Math.cos(first), y: v.y + radius * Math.sin(first) };
      const end = { x: v.x + radius * Math.cos(first + delta), y: v.y + radius * Math.sin(first + delta) };
      return `<path class="${cls}" d="M${round(start.x)} ${round(start.y)} A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${round(end.x)} ${round(end.y)}"/>`;
    };
    const givenMark = `${arc("N", "G", "D", 23, "source52-p29m3-given-angle")}<text class="source52-p29m3-angle-label" x="${round(p.N.x + 27)}" y="${round(p.N.y - 11)}">${fmt(shape.base)}°</text>`;
    const answerMark = solution ? `${arc("M", "D", "B", 27, "source52-p29m3-answer-angle")}<text class="source52-p29m3-answer-label" x="${round(p.M.x + 13)}" y="${round(p.M.y + 39)}">${fmt(shape.answer)}°</text>` : "";
    const labels = `${label("G", "ㄱ", -8, -12)}${label("N", "ㄴ", -19, 17)}${label("D", "ㄷ", 9, 18)}${label("R", "ㄹ", 9, -10)}${label("B", "ㅂ", -20, 19)}${label("M", "ㅁ", 8, -7)}`;
    const aria = `이등변삼각형 ㄱㄴㄷ과 점 ㄷ을 중심으로 시계 방향 ${rotation}도 회전한 삼각형 ㄹㅂㄷ, 밑각 ${fmt(shape.base)}도${solution ? `, 목표각 ${fmt(shape.answer)}도` : ""}`;
    return `<svg class="source52-p29m3-diagram" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p29m3-original">${line("G", "N")}${line("N", "D")}${line("D", "G")}</g><g class="source52-p29m3-rotated">${line("R", "B", "source52-p29m3-rotated-side")}${line("B", "D", "source52-p29m3-rotated-side")}${line("D", "R", "source52-p29m3-rotated-side")}</g>${givenMark}${answerMark}${labels}</svg>`;
  }

  function makeQuestion(variant = 0, difficultyOffset = 0, reviewLocked = false) {
    const poolIndex = ((variant % pools.length) + pools.length) % pools.length;
    const shape = model(poolIndex, difficultyOffset);
    const prompt = `<div class="source52-p29m3-question"><p>다음 그림에서 이등변삼각형 ㄹㅂㄷ은 이등변삼각형 ㄱㄴㄷ을 점 ㄷ을 중심으로 45°만큼 회전시킨 것입니다. 변 ㄱㄷ과 변 ㄹㅂ이 만나는 점을 점 ㅁ이라고 할 때, ∠ㄷㅁㅂ의 크기는 몇 도인가요? (단, 변 ㄱㄴ과 변 ㄱㄷ의 길이가 같습니다.)</p>${diagram(shape)}<div class="source52-p29m3-workspace" role="group" aria-label="각도 풀이 공간"><span>풀이</span><div></div></div></div>`;
    const solution = `<div class="source52-p29m3-solution" data-source-answer="${sourceItemId}"><p>회전 전의 이등변삼각형에서 꼭짓각을 구한 뒤, 문제에서 주어진 45° 회전을 이용합니다.</p><ol><li>ㄱㄴ=ㄱㄷ이므로 △ㄱㄴㄷ의 밑각 ∠ㄴ=∠ㄷ=${fmt(shape.base)}°입니다. 따라서 꼭짓각 ∠ㄴㄱㄷ=180°−2×${fmt(shape.base)}°=${fmt(shape.apex)}°입니다.</li><li>△ㄱㄴㄷ을 ㄷ을 중심으로 시계 방향 45° 돌리면 변 ㄱㄴ은 변 ㄹㅂ이 됩니다. 점 ㄱ을 지나 ㅁㅂ과 평행한 반직선을 ㅁ에서 ㅂ으로 향하는 쪽과 같은 방향으로 그어 보세요. 이 반직선은 회전 전 변 ㄱㄴ과 45°를 이루고, ㄱㄷ과는 꼭짓각에 45°를 더한 각을 이룹니다. ㄱㄷ과 같은 방향인 ㅁㄷ, 그 반직선과 평행한 ㅁㅂ이 이루는 각도 같습니다.</li><li>∠ㄷㅁㅂ=${fmt(shape.apex)}°+45°=<b>${fmt(shape.answer)}°</b>입니다.</li></ol></div>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}">${prompt}</div>`,
      answer: `${fmt(shape.answer)}°`, solution, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      variantProvenance: "synthetic-source-structure", sourceValuesExcluded: true, sourceStructurePreserved: true, answerVisualRequired: true,
      answerVisualStatus: reviewLocked ? "locked" : "verified-reconstruction",
      answerVisual: diagram(shape, { solution: true }), publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-rotation-coordinate-angle-check",
      answerModel: shape, reviewLocked
    });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P29M3SyntheticInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0, type.reviewLocked !== false) : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P29M3SyntheticInstalled", { value: true });
    return true;
  }

  return Object.freeze({ definition, pools, difficulties, rotation, model, diagram, makeQuestion, install });
});
