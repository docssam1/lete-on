(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE29_M5_SYNTHETIC = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e3-mission-5";
  const generatorKey = "source52EqualOffsetEquilateralSyntheticPage29Mission5";
  const definition = Object.freeze({ sourceItemId, generatorKey, publicReady: true });
  const sidePools = Object.freeze([10, 12, 14]);
  const offsetPools = Object.freeze([0.25, 0.35, 0.45]);
  const difficulties = Object.freeze([-1, 0, 1]);
  const round = value => Number(value.toFixed(7));
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function model(poolIndex = 0, difficultyOffset = 0) {
    const index = ((poolIndex % sidePools.length) + sidePools.length) % sidePools.length;
    const difficulty = difficulties.includes(difficultyOffset) ? difficultyOffset : 0;
    const side = sidePools[index];
    const ratio = offsetPools[index] + difficulty * 0.025;
    const offset = side * ratio;
    if (!(ratio > 0 && ratio < 1)) throw new Error("같은 거리 점은 각 변의 내부에 있어야 합니다.");
    const height = Math.sqrt(3) * side / 2;
    const G = { x: 0, y: height };
    const N = { x: -side / 2, y: 0 };
    const D = { x: side / 2, y: 0 };
    const fraction = offset / side;
    const M = { x: G.x + fraction * (N.x - G.x), y: G.y + fraction * (N.y - G.y) };
    const P = { x: N.x + fraction * (D.x - N.x), y: N.y + fraction * (D.y - N.y) };
    const R = { x: D.x + fraction * (G.x - D.x), y: D.y + fraction * (G.y - D.y) };
    const innerSides = { MP: distance(M, P), PR: distance(P, R), RM: distance(R, M) };
    const angles = Object.fromEntries([
      ["atM", [P, M, R]], ["atP", [M, P, R]], ["atR", [M, R, P]]
    ].map(([name, [a, v, b]]) => {
      const ux = a.x - v.x, uy = a.y - v.y, vx = b.x - v.x, vy = b.y - v.y;
      const cosine = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
      return [name, Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI];
    }));
    return Object.freeze({
      side, offset: round(offset), offsetRatio: ratio, answer: 60,
      points: Object.freeze(Object.fromEntries(Object.entries({ G, N, D, M, P, R }).map(([key, point]) => [key, Object.freeze({ x: round(point.x), y: round(point.y) })]))),
      innerSides: Object.freeze(Object.fromEntries(Object.entries(innerSides).map(([key, value]) => [key, round(value)]))),
      angles: Object.freeze(Object.fromEntries(Object.entries(angles).map(([key, value]) => [key, round(value)])))
    });
  }

  function diagram(shape, { solution = false, target = "R" } = {}) {
    const width = 500, height = 390, pad = 52;
    const minX = -shape.side / 2, maxX = shape.side / 2, minY = 0, maxY = Math.sqrt(3) * shape.side / 2;
    const scale = Math.min((width - 2 * pad) / (maxX - minX), (height - 2 * pad) / (maxY - minY));
    const project = ({ x, y }) => ({ x: round(pad + (x - minX) * scale + (width - 2 * pad - (maxX - minX) * scale) / 2), y: round(height - pad - y * scale - (height - 2 * pad - (maxY - minY) * scale) / 2) });
    const p = Object.fromEntries(Object.entries(shape.points).map(([key, point]) => [key, project(point)]));
    const line = (a, b, cls = "") => `<line${cls ? ` class="${cls}"` : ""} x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}"/>`;
    const label = (key, value, dx, dy) => `<text x="${round(p[key].x + dx)}" y="${round(p[key].y + dy)}">${esc(value)}</text>`;
    const tick = (a, b) => {
      const first = p[a], second = p[b], dx = second.x - first.x, dy = second.y - first.y;
      const length = Math.hypot(dx, dy), nx = -dy / length, ny = dx / length;
      const cx = first.x + dx * 0.48, cy = first.y + dy * 0.48;
      return [0, 6].map(offset => `<line class="source52-p29m5-equal-mark" x1="${round(cx + dx / length * offset - nx * 6)}" y1="${round(cy + dy / length * offset - ny * 6)}" x2="${round(cx + dx / length * offset + nx * 6)}" y2="${round(cy + dy / length * offset + ny * 6)}"/>`).join("");
    };
    const angleArc = (vertex, first, second, radius, className) => {
      const v = p[vertex], a = p[first], b = p[second];
      const one = Math.atan2(a.y - v.y, a.x - v.x), two = Math.atan2(b.y - v.y, b.x - v.x);
      const delta = ((two - one + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const start = { x: v.x + radius * Math.cos(one), y: v.y + radius * Math.sin(one) };
      const end = { x: v.x + radius * Math.cos(one + delta), y: v.y + radius * Math.sin(one + delta) };
      return `<path class="${className}" d="M${round(start.x)} ${round(start.y)} A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${round(end.x)} ${round(end.y)}"/>`;
    };
    const rays = {M:["P","R"], P:["R","M"], R:["M","P"]}[target];
    const center = {x:(p.M.x+p.P.x+p.R.x)/3,y:(p.M.y+p.P.y+p.R.y)/3};
    const dx=center.x-p[target].x, dy=center.y-p[target].y, len=Math.hypot(dx,dy);
    const tx=round(p[target].x+dx/len*45-8), ty=round(p[target].y+dy/len*45+6);
    const answerMark = `${angleArc(target, rays[0], rays[1], 24, solution ? "source52-p29m5-answer-angle" : "source52-p29m5-target-angle")}<text class="${solution ? "source52-p29m5-answer-label" : "source52-p29m5-target-label"}" x="${tx}" y="${ty}">${solution ? "60°" : "?"}</text>`;
    const targetName = {M:"ㅁ",P:"ㅂ",R:"ㄹ"}[target];
    const aria = `정삼각형 ㄱㄴㄷ의 세 변에 ㄱㅁ, ㄴㅂ, ㄷㄹ의 길이가 같도록 점을 표시하고 ㅁ, ㅂ, ㄹ을 이은 그림. 물음표는 점 ${targetName}의 안쪽 각${solution ? ", 60도" : ""}.`;
    return `<svg class="source52-p29m5-diagram" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p29m5-outline">${line("G", "N")}${line("N", "D")}${line("D", "G")}</g><g class="source52-p29m5-inner">${line("M", "P")}${line("P", "R")}${line("R", "M")}</g><g class="source52-p29m5-marks">${tick("G", "M")}${tick("N", "P")}${tick("D", "R")}</g>${answerMark}${label("G", "ㄱ", -9, -12)}${label("N", "ㄴ", -22, 20)}${label("D", "ㄷ", 8, 20)}${label("M", "ㅁ", -20, -10)}${label("P", "ㅂ", -8, 22)}${label("R", "ㄹ", 9, 8)}</svg>`;
  }

  function makeQuestion(variant = 0, difficultyOffset = 0, reviewLocked = false) {
    const index = ((variant % sidePools.length) + sidePools.length) % sidePools.length;
    const shape = model(index, difficultyOffset);
    const targets=[{key:"P",angle:"ㅁㅂㄹ"},{key:"M",angle:"ㅂㅁㄹ"},{key:"R",angle:"ㅁㄹㅂ"}], selected=targets[index];
    const prompt = `<div class="source52-p29m5-question"><p>정삼각형 ㄱㄴㄷ의 세 변 위에 ㄱㅁ, ㄴㅂ, ㄷㄹ의 길이가 같도록 점 ㅁ, ㅂ, ㄹ을 찍고 세 점을 이었습니다. 그림에서 ∠${selected.angle}의 크기를 구하세요.</p>${diagram(shape,{target:selected.key})}<div class="source52-p29m5-workspace" role="group" aria-label="각도 풀이 공간"><span>풀이</span><div></div></div></div>`;
    const solution = `<div class="source52-p29m5-solution" data-source-answer="${sourceItemId}"><ol><li>정삼각형 ㄱㄴㄷ의 세 변은 길이가 같고 ㄱㅁ=ㄴㅂ=ㄷㄹ이므로, 나머지 부분인 ㅁㄴ=ㅂㄷ=ㄹㄱ도 같습니다.</li><li>△ㄱㅁㄹ, △ㄴㅂㅁ, △ㄷㄹㅂ에서 꼭짓각은 각각 60°이고 양쪽 두 변의 길이도 각각 같으므로 세 삼각형은 서로 합동입니다.</li><li>대응하는 변 ㅁㄹ, ㅂㅁ, ㄹㅂ의 길이가 같습니다. 따라서 △ㅁㅂㄹ은 정삼각형이므로 ∠${selected.angle}=<b>60°</b>입니다.</li></ol></div>`;
    const offset=difficulties.includes(difficultyOffset)?difficultyOffset:0;
    return Object.freeze({prompt:`<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${index}" data-difficulty-offset="${offset}">${prompt}</div>`,answer:"60°",solution,sourceItemId,generator:generatorKey,generationMode:"fixed-verified-pool",verifiedPoolIndex:index,verifiedVariantCount:sidePools.length,verifiedVariantTarget:sidePools.length,verifiedVariantId:`${sourceItemId}:v${index}`,difficultyOffset:offset,difficultyLevel:offset+2,difficultyRank:offset+2,variantProvenance:"synthetic-source-structure",sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:reviewLocked?"locked":"verified-reconstruction",answerVisual:diagram(shape,{solution:true,target:selected.key}),publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-congruence-and-coordinate-check",answerModel:shape,reviewLocked});
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P29M5SyntheticInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0, type.reviewLocked !== false) : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P29M5SyntheticInstalled", { value: true });
    return true;
  }

  return Object.freeze({ definition, sidePools, offsetPools, difficulties, model, diagram, makeQuestion, install });
});
