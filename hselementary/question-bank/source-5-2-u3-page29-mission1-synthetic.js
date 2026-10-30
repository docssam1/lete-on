(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE29_M1_SYNTHETIC = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e3-mission-1";
  const generatorKey = "source52CongruentIsoscelesOverlapSyntheticPage29Mission1";
  const definition = Object.freeze({ sourceItemId, generatorKey, publicReady: true });
  const pools = Object.freeze([
    Object.freeze({ base: 76, crossing: 90 }),
    Object.freeze({ base: 76, crossing: 94 }),
    Object.freeze({ base: 76, crossing: 98 })
  ]);
  const difficulties = Object.freeze([-1, 0, 1]);
  const round = value => Number(value.toFixed(5));
  const radians = degrees => degrees * Math.PI / 180;
  const vector = degrees => ({ x: Math.cos(radians(degrees)), y: Math.sin(radians(degrees)) });
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const angle = (a, vertex, b) => {
    const ax = a.x - vertex.x, ay = a.y - vertex.y;
    const bx = b.x - vertex.x, by = b.y - vertex.y;
    const cosine = (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by));
    return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
  };
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));

  function lineIntersection(a, b, c, d) {
    const abx = b.x - a.x, aby = b.y - a.y;
    const cdx = d.x - c.x, cdy = d.y - c.y;
    const denominator = abx * cdy - aby * cdx;
    if (Math.abs(denominator) < 1e-10) throw new Error("평행한 선분은 교점을 만들지 않습니다.");
    const t = ((c.x - a.x) * cdy - (c.y - a.y) * cdx) / denominator;
    const u = ((c.x - a.x) * aby - (c.y - a.y) * abx) / denominator;
    return { x: a.x + t * abx, y: a.y + t * aby, t, u };
  }

  function model(poolIndex = 0, difficultyOffset = 0) {
    const pool = pools[((poolIndex % pools.length) + pools.length) % pools.length];
    const offset = difficulties.includes(difficultyOffset) ? difficultyOffset : 0;
    const base = pool.base + 2 * offset;
    const crossing = pool.crossing + 2 * offset;
    const apex = 180 - 2 * base;
    if (!(apex > 0 && apex < crossing && crossing < 180)) throw new Error("각도 조건이 삼각형을 만들지 않습니다.");
    const G = { x: 0, y: 0 };
    const N = { x: 1, y: 0 };
    const D = vector(apex);
    const legToN = vector(apex - crossing);
    const R = { x: N.x - legToN.x, y: N.y - legToN.y };
    const rayRM = vector(-crossing);
    const M = { x: R.x + rayRM.x, y: R.y + rayRM.y };
    const S = lineIntersection(G, N, R, M);
    const B = lineIntersection(G, D, R, M);
    const answer = base - crossing / 2;
    const m = Object.freeze({
      base, crossing, apex, answer,
      points: Object.freeze(Object.fromEntries(Object.entries({ G, N, D, R, M, S, B }).map(([key, point]) => [key, Object.freeze({ x: round(point.x), y: round(point.y) })]))),
      intersections: Object.freeze({ sOnGN: S.t, sOnRM: S.u, bOnGD: B.t, bOnRM: B.u }),
      sideLengths: Object.freeze({ GN: distance(G, N), GD: distance(G, D), RN: distance(R, N), RM: distance(R, M), ND: distance(N, D), NM: distance(N, M) }),
      angles: Object.freeze({ baseAtD: angle(N, D, G), crossingAtS: angle(N, S, M), apexAtR: angle(N, R, M), targetAtR: angle(G, R, S) })
    });
    return m;
  }

  function diagram(shape, { solution = false } = {}) {
    const width = 520, height = 350, pad = 40;
    const raw = Object.values(shape.points).map(({ x, y }) => ({ x, y }));
    const minX = Math.min(...raw.map(p => p.x)), maxX = Math.max(...raw.map(p => p.x));
    const minY = Math.min(...raw.map(p => p.y)), maxY = Math.max(...raw.map(p => p.y));
    const scale = Math.min((width - 2 * pad) / (maxX - minX), (height - 2 * pad) / (maxY - minY));
    const project = ({ x, y }) => ({ x: round(pad + (x - minX) * scale + (width - 2 * pad - (maxX - minX) * scale) / 2), y: round(height - pad - (y - minY) * scale - (height - 2 * pad - (maxY - minY) * scale) / 2) });
    const p = Object.fromEntries(Object.entries(shape.points).map(([key, point]) => [key, project(point)]));
    const line = (a, b, cls = "") => `<line${cls ? ` class="${cls}"` : ""} x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}"/>`;
    const label = (key, text, dx, dy, cls = "") => `<text class="source52-p29m1-label${cls ? ` ${cls}` : ""}" x="${round(p[key].x + dx)}" y="${round(p[key].y + dy)}">${text}</text>`;
    const angleArc = (vertexKey, fromKey, toKey, radius, cls) => {
      const v = p[vertexKey], a = p[fromKey], b = p[toKey];
      let a1 = Math.atan2(a.y - v.y, a.x - v.x), a2 = Math.atan2(b.y - v.y, b.x - v.x);
      let delta = ((a2 - a1 + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const start = { x: v.x + radius * Math.cos(a1), y: v.y + radius * Math.sin(a1) };
      const end = { x: v.x + radius * Math.cos(a1 + delta), y: v.y + radius * Math.sin(a1 + delta) };
      return `<path class="${cls}" d="M${start.x} ${start.y} A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${end.x} ${end.y}"/>`;
    };
    const givenMarks = `${angleArc("D", "N", "G", 19, "source52-p29m1-angle")}${angleArc("S", "N", "M", 17, "source52-p29m1-angle")}`;
    const answerMark = solution ? `${angleArc("R", "G", "S", 25, "source52-p29m1-answer-angle")}${label("R", `${fmt(shape.answer)}°`, -49, 38, "source52-p29m1-answer-label")}` : "";
    const textMarks = `${label("G", "ㄱ", -10, -10)}${label("N", "ㄴ", -19, 22)}${label("D", "ㄷ", 12, 5)}${label("R", "ㄹ", -21, -11)}${label("M", "ㅁ", -28, 20)}${label("S", "ㅅ", -17, -9)}${label("B", "ㅂ", 8, 19)}<text class="source52-p29m1-angle-label" x="${round(p.D.x + 18)}" y="${round(p.D.y - 16)}">${fmt(shape.base)}°</text><text class="source52-p29m1-angle-label" x="${round(p.S.x + 32)}" y="${round(p.S.y + 48)}">${fmt(shape.crossing)}°</text>`;
    const aria = `합동인 이등변삼각형 두 개, ${fmt(shape.base)}도와 ${fmt(shape.crossing)}도 조건, 교점 ㅅ과 교점 ㅂ${solution ? `, 정답 ${fmt(shape.answer)}도 표시` : ""}`;
    return `<svg class="source52-p29m1-diagram" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p29m1-lines">${line("G", "N")}${line("G", "D")}${line("N", "D")}${line("R", "N")}${line("N", "M")}${line("R", "M")}${line("G", "R", "source52-p29m1-construction")}</g>${givenMarks}${answerMark}${textMarks}</svg>`;
  }

  function makeQuestion(variant = 0, difficultyOffset = 0, reviewLocked = false) {
    const poolIndex = ((variant % pools.length) + pools.length) % pools.length;
    const shape = model(poolIndex, difficultyOffset);
    const prompt = `<div class="source52-p29m1-question"><p>두 삼각형 ㄱㄴㄷ과 ㄹㄴㅁ은 합동인 이등변삼각형입니다. ㄱㄴ=ㄱㄷ이고 ㄹㄴ=ㄹㅁ입니다. 그림에서 주어진 각의 크기를 이용하여 ∠ㄱㄹㅅ의 크기를 구하세요.</p>${diagram(shape)}<div class="source52-p29m1-workspace" role="group" aria-label="각도 풀이 공간"><span>풀이</span><div></div></div></div>`;
    const solution = `<div class="source52-p29m1-solution" data-source-answer="${sourceItemId}"><p>먼저 두 합동 이등변삼각형의 꼭짓각을 구합니다.</p><ol><li>△ㄱㄴㄷ에서 밑각은 각각 ${fmt(shape.base)}°이므로 꼭짓각 ∠ㄴㄱㄷ은 180°−2×${fmt(shape.base)}°=${fmt(shape.apex)}°입니다.</li><li>합동인 △ㄹㄴㅁ의 꼭짓각 ∠ㄴㄹㅁ도 ${fmt(shape.apex)}°입니다. 또 ㄹ, ㅅ, ㅁ은 한 직선 위에 있으므로 ∠ㄹㅅㄴ은 ${fmt(shape.crossing)}°와 일직선 위의 이웃한 각이므로 180°−${fmt(shape.crossing)}°=${fmt(180 - shape.crossing)}°입니다.</li><li>△ㄹㄴㅅ에서 ∠ㄹㄴㅅ=180°−${fmt(shape.apex)}°−${fmt(180 - shape.crossing)}°=${fmt(shape.crossing - shape.apex)}°입니다. ㄴ, ㅅ, ㄱ이 한 직선 위이므로 ∠ㄱㄴㄹ도 ${fmt(shape.crossing - shape.apex)}°입니다.</li><li>합동인 이등변삼각형의 같은 변 ㄱㄴ=ㄹㄴ이므로 △ㄱㄴㄹ의 두 밑각은 각각 ${fmt((180 - (shape.crossing - shape.apex)) / 2)}°입니다. 따라서 ∠ㄱㄹㅅ=${fmt((180 - (shape.crossing - shape.apex)) / 2)}°−${fmt(shape.apex)}°=<b>${fmt(shape.answer)}°</b>입니다.</li></ol></div>`;
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
      answerVerification: "independent-isosceles-angle-chase",
      answerModel: shape, reviewLocked
    });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P29M1SyntheticInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0, type.reviewLocked !== false) : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P29M1SyntheticInstalled", { value: true });
    return true;
  }

  return Object.freeze({ definition, pools, difficulties, model, diagram, makeQuestion, install });
});
