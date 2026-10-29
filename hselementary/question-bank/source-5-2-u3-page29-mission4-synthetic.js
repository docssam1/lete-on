(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE29_M4_SYNTHETIC = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e3-mission-4";
  const generatorKey = "source52FoldedRectangleSyntheticPage29Mission4";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 25, sourcePrintedPage: 29 });
  const pools = Object.freeze([[20, 26], [18, 30], [24, 34]]);
  const round = value => Number(value.toFixed(8));
  const radians = value => value * Math.PI / 180;
  const degrees = value => value * 180 / Math.PI;
  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
  const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  const scale = (point, amount) => ({ x: point.x * amount, y: point.y * amount });
  const dot = (a, b) => a.x * b.x + a.y * b.y;
  const cross = (a, b) => a.x * b.y - a.y * b.x;
  const length = point => Math.hypot(point.x, point.y);
  const distance = (a, b) => length(subtract(a, b));
  const angle = (a, vertex, b) => {
    const u = subtract(a, vertex), v = subtract(b, vertex);
    return degrees(Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (length(u) * length(v))))));
  };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[character]));

  function intersectLines(a, directionA, b, directionB) {
    const denominator = cross(directionA, directionB);
    if (Math.abs(denominator) < 1e-10) throw new Error("접힘선과 변이 평행하여 교점을 만들지 않습니다.");
    const t = cross(subtract(b, a), directionB) / denominator;
    return add(a, scale(directionA, t));
  }

  function model(creaseTilt = 22, beta = 32) {
    // The first reflection sends the rectangle corner ㄹ to ㅁ over crease ㅂㄷ.
    // The tilt is a parameter chosen for this synthetic exercise.
    const width = 1;

    const leftHeight = Math.tan(radians(creaseTilt));
    const height = 2 * leftHeight / (1 + leftHeight ** 2);
    const G = { x: 0, y: height }, N = { x: width, y: height };
    const D = { x: width, y: 0 }, R = { x: 0, y: 0 }, B = { x: 0, y: leftHeight };
    const M = { x: 2 * leftHeight ** 2 / (1 + leftHeight ** 2), y: height };
    const BM = distance(B, M);

    // Construct the second fold with two equal reflected sides,
    // then use the sine rule to place the points on their segments.
    const BS = BM / (1 + Math.sin(radians(90 - creaseTilt)) / Math.sin(radians(beta)));
    const S = add(B, scale(subtract(M, B), BS / BM));
    const BJ = BS * Math.sin(radians(90 + creaseTilt - beta)) / Math.sin(radians(beta));
    const J = add(B, scale(subtract(D, B), BJ / distance(B, D)));

    // SO is the perpendicular bisector of MJ, intersected with the first-fold edge MD.
    const midpoint = scale(add(M, J), 0.5);
    const mj = subtract(J, M), normal = { x: -mj.y, y: mj.x };
    const O = intersectLines(M, subtract(D, M), midpoint, normal);
    const points = Object.freeze({ G, N, D, R, B, M, S, O, J });
    const angles = Object.freeze({
      atM: angle(B, M, D), atD: angle(B, D, M), atB: angle(D, B, M),
      bjs: angle(B, J, S), sjo: angle(S, J, O), smo: angle(S, M, O),
      som: angle(S, O, M), target: angle(S, O, J), odn: angle(O, D, N)
    });
    const lengths = Object.freeze({ bm: distance(B, M), sm: distance(S, M), sj: distance(S, J), om: distance(O, M), oj: distance(O, J) });
    const parameters = Object.freeze({ sOnBM: BS / BM, jOnBD: BJ / distance(B, D), oOnMD: distance(M, O) / distance(M, D) });
    return Object.freeze({ width, height, creaseTilt, points, angles, lengths, parameters, answer: round(angles.target) });
  }

  function diagram(shape, { solution = false } = {}) {
    const canvas = { width: 600, height: 390, left: 52, top: 46, scale: 360 };
    const project = point => ({ x: round(canvas.left + point.x * canvas.scale), y: round(canvas.height - canvas.top - point.y * canvas.scale) });
    const p = Object.fromEntries(Object.entries(shape.points).map(([key, point]) => [key, project(point)]));
    const line = (a, b, className = "") => `<line${className ? ` class="${className}"` : ""} data-segment="${a}${b}" x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}"/>`;
    const text = (key, value, dx, dy, className = "") => `<text${className ? ` class="${className}"` : ""} x="${round(p[key].x + dx)}" y="${round(p[key].y + dy)}">${escapeHtml(value)}</text>`;
    const arcPath = (vertex, a, b, radius) => {
      const v = p[vertex], first = Math.atan2(p[a].y - v.y, p[a].x - v.x), second = Math.atan2(p[b].y - v.y, p[b].x - v.x);
      let delta = second - first;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      const start = { x: v.x + radius * Math.cos(first), y: v.y + radius * Math.sin(first) };
      const end = { x: v.x + radius * Math.cos(first + delta), y: v.y + radius * Math.sin(first + delta) };
      return `M${round(start.x)} ${round(start.y)} A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${round(end.x)} ${round(end.y)}`;
    };
    const rectangle = [line("G", "N", "outline"), line("N", "D", "outline"), line("D", "R", "hidden"), line("R", "B", "hidden"), line("B", "G", "outline")].join("");
    const foldedEdges = [line("B", "S", "folded"), line("S", "M", "hidden-fold"), line("M", "O", "hidden-fold"), line("O", "D", "folded"), line("B", "J", "crease"), line("J", "D", "crease"), line("S", "O", "crease"), line("S", "J", "folded"), line("J", "O", "folded")].join("");
    const offsets = { G:[-19,-8], N:[12,-8], D:[12,14], R:[-19,17], B:[-18,8], M:[-3,-15], S:[-23,-6], O:[7,-8], J:[-5,24] };
    const labels = Object.entries(offsets).map(([key,[dx,dy]]) => text(key, key === "G" ? "ㄱ" : key === "N" ? "ㄹ" : key === "D" ? "ㄷ" : key === "R" ? "ㄴ" : key === "B" ? "ㅂ" : key === "M" ? "ㅁ" : key === "S" ? "ㅈ" : key === "O" ? "ㅇ" : "ㅅ", dx, dy)).join("");
    const beta = round(shape.angles.bjs), given = round(shape.angles.odn), result = round(shape.answer);
    const unit = (from, to) => { const d = { x: p[to].x-p[from].x, y:p[to].y-p[from].y }; const n=Math.hypot(d.x,d.y); return {x:d.x/n,y:d.y/n}; };
    const u=unit("J","S"), v=unit("J","O"), j=p.J, size=11;
    const right=`M${round(j.x+u.x*size)} ${round(j.y+u.y*size)} L${round(j.x+(u.x+v.x)*size)} ${round(j.y+(u.y+v.y)*size)} L${round(j.x+v.x*size)} ${round(j.y+v.y*size)}`;
    const marks = `<path class="source52-p29m4-angle" d="${arcPath("J", "B", "S", 24)}"/><text class="source52-p29m4-angle-label" x="${round(p.J.x - 42)}" y="${round(p.J.y + 32)}">${beta}°</text><path class="source52-p29m4-angle" d="${arcPath("D", "O", "N", 32)}"/><text class="source52-p29m4-angle-label" x="${round(p.D.x - 48)}" y="${round(p.D.y - 42)}">${given}°</text><path class="source52-p29m4-right" d="${right}"/>`;
    const answer = solution ? `<path class="source52-p29m4-answer-angle" data-answer-angle="${result}" d="${arcPath("O", "S", "J", 35)}"/><text class="source52-p29m4-answer-label" x="${round(p.O.x - 20)}" y="${round(p.O.y + 35)}">${result}°</text>` : "";
    const accessible = `직사각형에서 ㄴ을 ㅁ으로 접고 다시 ㅁ을 ㅅ으로 접은 그림. ∠ㅂㅅㅈ은 ${beta}도, ∠ㅇㄷㄹ은 ${given}도${solution ? `, 목표각은 ${result}도` : ""}.`;
    return `<svg class="source52-p29m4-diagram" viewBox="0 0 ${canvas.width} ${canvas.height}" role="img" aria-label="${escapeHtml(accessible)}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p29m4-outline">${rectangle}</g><g class="source52-p29m4-fold-lines">${foldedEdges}</g>${marks}${answer}<g class="source52-p29m4-points">${labels}</g></svg>`;
  }

  function makeQuestion(variant = 0, difficultyOffset = 0, reviewLocked = false) {
    const poolIndex=((variant % pools.length)+pools.length)%pools.length;
    const [alpha,beta]=pools[poolIndex];
    const shape=model(alpha,beta), given=90-2*alpha, atB=90-alpha, atJ=90+alpha-beta, atMJS=90-alpha+beta, half=atMJS/2, answer=round(shape.answer);
    const prompt=`<div class="source52-p29m4-question"><p>직사각형 ㄱㄹㄷㄴ을 ㅂㄷ을 따라 접어 점 ㄴ을 점 ㅁ으로 옮겼습니다. 다시 ㅈㅇ을 따라 접어 점 ㅁ을 점 ㅅ으로 옮겼습니다. 그림에서 ∠ㅅㅇㅈ의 크기를 구하세요.</p>${diagram(shape)}<div class="source52-p29m4-workspace" role="group" aria-label="풀이 공간"><span>풀이</span><div></div></div></div>`;
    const solution=`<div class="source52-p29m4-solution" data-source-answer="${sourceItemId}"><ol><li>첫 접기에서 ㄷㄴ은 ㄷㅁ으로 옮겨지고 ㄷㅂ은 두 선 사이의 각을 이등분합니다. ∠ㅁㄷㄴ=90°−${given}°=${2*alpha}°이므로 ∠ㅂㄷㅁ=${alpha}°입니다. 접힌 직각삼각형 ㅂㅁㄷ에서 ∠ㄷㅂㅁ=${atB}°입니다.</li><li>△ㅂㅅㅈ에서 ∠ㅅㅂㅈ=${atB}°, ∠ㅂㅅㅈ=${beta}°이므로 ∠ㅂㅈㅅ=${atJ}°입니다. ㅂ, ㅈ, ㅁ은 일직선이므로 ∠ㅁㅈㅅ=${atMJS}°입니다.</li><li>두 번째 접기에서 ㅈㅇ은 ∠ㅁㅈㅅ을 이등분하므로 ∠ㅁㅈㅇ=${half}°입니다. ㅁ에서 직각인 △ㅈㅁㅇ에서 ∠ㅈㅇㅁ=90°−${half}°=${answer}°입니다.</li><li>접기 전 ㅇㅁ은 접은 뒤 ㅇㅅ과 겹치므로 ∠ㅅㅇㅈ=∠ㅈㅇㅁ=<strong>${answer}°</strong>입니다.</li></ol></div>`;
    const offset=[-1,0,1].includes(difficultyOffset)?difficultyOffset:0;
    return Object.freeze({prompt:`<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}">${prompt}</div>`,answer:`${answer}°`,solution,sourceItemId,generator:generatorKey,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:pools.length,verifiedVariantTarget:pools.length,verifiedVariantId:`${sourceItemId}:v${poolIndex}`,difficultyOffset:offset,difficultyLevel:offset+2,difficultyRank:offset+2,variantProvenance:"synthetic-source-structure",sourceValuesExcluded:true,sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:reviewLocked?"locked":"verified-reconstruction",answerVisual:diagram(shape,{solution:true}),publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-two-fold-reflection-and-angle-chase",answerModel:shape,reviewLocked});
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P29M4SyntheticInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? !api.generatorKey(type) ? null : makeQuestion(variant, difficulty ?? 0, type.reviewLocked)
      : previousGenerate(type, rank, difficulty, seed, variant);
    api.names = Array.isArray(api.names) ? api.names : [];
    if (!api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P29M4SyntheticInstalled", { value: true });
    return true;
  }

  return Object.freeze({ definition, pools, model, diagram, makeQuestion, install });
});
