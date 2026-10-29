(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE29_M6_SYNTHETIC = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e3-mission-6";
  const generatorKey = "source52EquilateralCrossingAnglesSyntheticPage29Mission6";
  const definition = Object.freeze({ sourceItemId, generatorKey, publicReady: true });
  const sidePools = Object.freeze([8, 11, 14]);
  const difficulties = Object.freeze([-1, 0, 1]);
  const round = value => Number(value.toFixed(7));
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function model(poolIndex = 0, difficultyOffset = 0) {
    const index = ((poolIndex % sidePools.length) + sidePools.length) % sidePools.length;
    const difficulty = difficulties.includes(difficultyOffset) ? difficultyOffset : 0;
    const side = sidePools[index] + difficulty, offset = [4, 6, 7][index], height = Math.sqrt(3) * side / 2;
    if (!(side > offset)) throw new Error("점은 변의 내부에 있어야 합니다.");
    const points = {
      N: { x: 0, y: 0 }, D: { x: side, y: 0 }, G: { x: side / 2, y: height },
      R: { x: offset, y: 0 }, M: { x: side - offset / 2, y: offset * Math.sqrt(3) / 2 }
    };
    const cross = (a, b) => a.x * b.y - a.y * b.x;
    const gr = { x: points.R.x - points.G.x, y: points.R.y - points.G.y };
    const nm = { x: points.M.x - points.N.x, y: points.M.y - points.N.y };
    const gn = { x: points.N.x - points.G.x, y: points.N.y - points.G.y };
    const denominator = cross(gr, nm);
    const t = cross(gn, nm) / denominator;
    const u = cross(gn, gr) / denominator;
    points.B = { x: points.G.x + t * gr.x, y: points.G.y + t * gr.y };
    const angle = (v, a, b) => {
      const x = { x: a.x - v.x, y: a.y - v.y }, y = { x: b.x - v.x, y: b.y - v.y };
      return Math.acos(Math.max(-1, Math.min(1, (x.x * y.x + x.y * y.y) / (distance(v, a) * distance(v, b))))) * 180 / Math.PI;
    };
    return Object.freeze({ side, offset, difficulty, intersectionParameters: Object.freeze({ onGR: round(t), onNM: round(u) }), answer: round(angle(points.B, points.G, points.M)), points: Object.freeze(Object.fromEntries(Object.entries(points).map(([key, point]) => [key, Object.freeze({ x: round(point.x), y: round(point.y) })]))) });
  }

  function diagram(shape, { solution = false, target = 0 } = {}) {
    const width = 500, height = 390, pad = 52;
    const scale = Math.min((width - 2 * pad) / shape.side, (height - 2 * pad) / (Math.sqrt(3) * shape.side / 2));
    const p = Object.fromEntries(Object.entries(shape.points).map(([key, point]) => [key, { x: round(pad + point.x * scale), y: round(height - pad - point.y * scale) }]));
    const line = (a, b, cls = "") => `<line${cls ? ` class="${cls}"` : ""} x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}"/>`;
    const label = (key, text, dx, dy) => `<text x="${round(p[key].x + dx)}" y="${round(p[key].y + dy)}">${esc(text)}</text>`;
    const angleArc = (vertex, a, b, radius, cls) => {
      const one = Math.atan2(p[a].y - p[vertex].y, p[a].x - p[vertex].x), two = Math.atan2(p[b].y - p[vertex].y, p[b].x - p[vertex].x);
      const delta = ((two - one + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      return `<path class="${cls}" d="M${round(p[vertex].x + radius * Math.cos(one))} ${round(p[vertex].y + radius * Math.sin(one))} A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${round(p[vertex].x + radius * Math.cos(one + delta))} ${round(p[vertex].y + radius * Math.sin(one + delta))}"/>`;
    };
    const rayPairs = [["G","M"],["G","N"],["R","M"]], [first,second] = rayPairs[target];
    const deltaA = Math.atan2(p[first].y-p.B.y,p[first].x-p.B.x), deltaB = Math.atan2(p[second].y-p.B.y,p[second].x-p.B.x);
    const delta = ((deltaB-deltaA+Math.PI*3)%(Math.PI*2))-Math.PI, bisector=deltaA+delta/2;
    const textX=round(p.B.x+Math.cos(bisector)*40-5), textY=round(p.B.y+Math.sin(bisector)*40+5);
    const result=target===0?60:120;
    const angle = `${angleArc("B", first, second, 22, solution ? "source52-p29m6-answer-angle" : "source52-p29m6-target-angle")}<text class="${solution ? "source52-p29m6-answer-label" : "source52-p29m6-target-label"}" x="${textX}" y="${textY}">${solution ? `${result}°` : "?"}</text>`;
    const aria = `정삼각형 ㄱㄴㄷ에서 ㄴㄹ과 ㄷㅁ의 길이는 각각 ${shape.offset}센티미터이고 선분 ㄱㄹ과 ㄴㅁ은 ㅂ에서 만납니다.${solution ? ` 표시한 각은 ${result}도입니다.` : ""}`;
    return `<svg class="source52-p29m6-diagram" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p29m6-outline">${line("G", "N")}${line("N", "D")}${line("D", "G")}</g><g class="source52-p29m6-inner">${line("G", "R")}${line("N", "M")}</g>${angle}<g class="source52-p29m6-dimensions"><path d="M${p.N.x} ${p.N.y + 23} L${p.R.x} ${p.R.y + 23}"/><text x="${round((p.N.x + p.R.x) / 2 - 14)}" y="${p.N.y + 42}">${shape.offset}cm</text><path d="M${round(p.D.x + 18)} ${round(p.D.y - 2)} L${round(p.M.x + 18)} ${round(p.M.y + 2)}"/><text x="${round((p.D.x + p.M.x) / 2 + 20)}" y="${round((p.D.y + p.M.y) / 2 + 5)}">${shape.offset}cm</text></g>${label("G", "ㄱ", -8, -12)}${label("N", "ㄴ", -21, 19)}${label("D", "ㄷ", 8, 19)}${label("R", "ㄹ", 8, 18)}${label("M", "ㅁ", 8, -4)}${label("B", "ㅂ", -21, 4)}</svg>`;
  }

  function makeQuestion(variant = 0, difficultyOffset = 0, reviewLocked = false) {
    const index=((variant%sidePools.length)+sidePools.length)%sidePools.length,shape=model(index,difficultyOffset);
    const targetAngles=["ㄱㅂㅁ","ㄱㅂㄴ","ㄹㅂㅁ"], answer=index===0?60:120;
    const prompt=`<div class="source52-p29m6-question"><p>정삼각형 ㄱㄴㄷ의 변 ㄴㄷ과 ㄷㄱ에 점 ㄹ, ㅁ이 있습니다. ㄴㄹ=ㄷㅁ이고 선분 ㄱㄹ과 ㄴㅁ이 점 ㅂ에서 만날 때, 그림의 ∠${targetAngles[index]}의 크기를 구하세요.</p>${diagram(shape,{target:index})}<div class="source52-p29m6-workspace" role="group" aria-label="각도 풀이 공간"><span>풀이</span><div></div></div></div>`;
    const solution=`<div class="source52-p29m6-solution" data-source-answer="${sourceItemId}"><ol><li>ㄱㄴ=ㄴㄷ, ㄴㄹ=ㄷㅁ이고 끼인 각 ∠ㄱㄴㄹ과 ∠ㄴㄷㅁ이 모두 60°이므로 △ㄱㄴㄹ과 △ㄴㄷㅁ은 합동입니다. 따라서 ∠ㄴㄱㄹ=∠ㄷㄴㅁ입니다.</li><li>두 각의 크기를 각각 x라 하면 ∠ㄱㄴㅂ=60°−x입니다. △ㄱㄴㅂ에서 ∠ㄱㅂㄴ=180°−x−(60°−x)=120°입니다.</li><li>ㄴ, ㅂ, ㅁ과 ㄱ, ㅂ, ㄹ은 각각 한 직선 위에 있으므로 ∠ㄱㅂㅁ=60°, ∠ㄹㅂㅁ=120°입니다. 따라서 ∠${targetAngles[index]}=<b>${answer}°</b>입니다.</li></ol></div>`;
    const d=difficulties.includes(difficultyOffset)?difficultyOffset:0;
    return Object.freeze({prompt:`<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${index}" data-difficulty-offset="${d}">${prompt}</div>`,answer:`${answer}°`,solution,sourceItemId,generator:generatorKey,generationMode:"fixed-verified-pool",verifiedPoolIndex:index,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${sourceItemId}:v${index}`,difficultyOffset:d,difficultyLevel:d+2,difficultyRank:d+2,variantProvenance:"synthetic-source-structure",sourceValuesExcluded:true,sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:reviewLocked?"locked":"verified-reconstruction",answerVisual:diagram(shape,{solution:true,target:index}),publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-sas-and-coordinate-intersection",answerModel:shape,reviewLocked});
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P29M6SyntheticInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0, type.reviewLocked !== false) : null : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P29M6SyntheticInstalled", { value: true });
    return true;
  }
  return Object.freeze({ definition, sidePools, difficulties, model, diagram, makeQuestion, install });
});
