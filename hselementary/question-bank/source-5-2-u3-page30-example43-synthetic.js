(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE30_E43_SYNTHETIC = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e4-example-3";
  const generatorKey = "source52TrapezoidMidpointSyntheticPage30Example43";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 26, sourcePrintedPage: 30 });
  const pools = Object.freeze([
    Object.freeze([{ base: 10, leg: 3 }, { base: 12, leg: 4 }, { base: 14, leg: 5 }]),
    Object.freeze([{ base: 12, leg: 3 }, { base: 15, leg: 5 }, { base: 18, leg: 7 }]),
    Object.freeze([{ base: 14, leg: 4 }, { base: 17, leg: 6 }, { base: 20, leg: 8 }])
  ]);
  const difficulties = Object.freeze([-1, 0, 1]);
  const round = value => Number(value.toFixed(7));
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));

  function model(poolIndex = 0, difficultyOffset = 0) {
    const index = ((poolIndex % pools.length) + pools.length) % pools.length;
    const level = difficulties.includes(difficultyOffset) ? difficultyOffset : 0;
    const dimensions = pools[level + 1][index];
    const base = dimensions.base;
    const leg = dimensions.leg;
    if (!(base > leg && leg > 0)) throw new Error("사다리꼴의 위 밑변이 양수여야 합니다.");

    const halfLeg = leg / 2;
    const height = Math.sqrt(3) * halfLeg;
    const L = { x: 0, y: 0 };
    const D = { x: base, y: 0 };
    const G = { x: halfLeg, y: height };
    const N = { x: base - halfLeg, y: height };
    const B = { x: (N.x + D.x) / 2, y: (N.y + D.y) / 2 };
    const Mx = G.x + (B.x - G.x) * (G.y / (G.y - B.y));
    const M = { x: Mx, y: 0 };
    const V = { x: base / 2, y: Math.sqrt(3) * base / 2 };
    return Object.freeze({
      poolIndex: index, difficultyOffset: level, base: round(base), leg: round(leg), topBase: round(base - leg),
      height: round(height), answer: round(base - leg),
      points: Object.freeze(Object.fromEntries(Object.entries({ L, G, N, D, B, M, V }).map(([key, p]) => [key, Object.freeze({ x: round(p.x), y: round(p.y) })])))
    });
  }

  function diagram(shape, { solution = false, target = 0 } = {}) {
    const width = 600, height = 360, pad = 58;
    const { L, G, N, D, B, M, V } = shape.points;
    const minX = -0.5, maxX = Math.max(M.x, D.x) + 0.7;
    const minY = -0.5, maxY = solution ? V.y + 1.2 : shape.height + 0.8;
    const unit = Math.min((width - 2 * pad) / (maxX - minX), (height - 2 * pad) / (maxY - minY));
    const project = p => ({ x: round(pad + (p.x - minX) * unit), y: round(height - pad - (p.y - minY) * unit) });
    const p = Object.fromEntries(Object.entries({ L, G, N, D, B, M, V }).map(([key, point]) => [key, project(point)]));
    const line = (a, b, cls = "") => `<line${cls ? ` class="${cls}"` : ""} x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}"/>`;
    const label = (key, text, dx, dy) => `<text x="${round(p[key].x + dx)}" y="${round(p[key].y + dy)}">${esc(text)}</text>`;
    const angleArc = (vertex, first, second, radius, cls) => {
      const v = p[vertex], a = p[first], b = p[second];
      const one = Math.atan2(a.y - v.y, a.x - v.x), two = Math.atan2(b.y - v.y, b.x - v.x);
      const delta = ((two - one + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const start = { x: v.x + radius * Math.cos(one), y: v.y + radius * Math.sin(one) };
      const end = { x: v.x + radius * Math.cos(one + delta), y: v.y + radius * Math.sin(one + delta) };
      return `<path class="${cls}" d="M${round(start.x)} ${round(start.y)} A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${round(end.x)} ${round(end.y)}"/>`;
    };
    const tick = (a, b, className) => {
      const first = p[a], second = p[b], dx = second.x - first.x, dy = second.y - first.y, len = Math.hypot(dx, dy);
      const cx = (first.x + second.x) / 2, cy = (first.y + second.y) / 2, nx = -dy / len, ny = dx / len;
      return `<line class="${className}" x1="${round(cx - nx * 7)}" y1="${round(cy - ny * 7)}" x2="${round(cx + nx * 7)}" y2="${round(cy + ny * 7)}"/>`;
    };
    const equalTicks = tick("N", "B", "source52-p30e43-equal-mark") + tick("B", "D", "source52-p30e43-equal-mark");
    const angleLabels = `<text class="source52-p30e43-given-angle" data-given-angle="left" x="${round(p.L.x + 32)}" y="${round(p.L.y - 12)}">60°</text><text class="source52-p30e43-given-angle" data-given-angle="right" x="${round(p.D.x - 58)}" y="${round(p.D.y - 12)}">60°</text>`;
    const construction = solution ? `<g class="source52-p30e43-construction">${line("G", "V")}${line("N", "V")}${angleArc("G", "V", "N", 13, "source52-p30e43-small-equilateral-arc")}${angleArc("N", "G", "V", 13, "source52-p30e43-small-equilateral-arc")}</g>${label("V", "ㅅ", 0, -9)}` : "";
    const mid=(a,b)=>({x:(p[a].x+p[b].x)/2,y:(p[a].y+p[b].y)/2});
    const answerValue=target===0?2*shape.topBase:target===1?shape.topBase:shape.base;
    const top=mid("G","N"),bot=mid("L","D"),ext=mid("D","M");
    const marker=(x,y,value)=>`<text class="${solution?"source52-p30e43-answer-label":"source52-p30e43-target-label"}" x="${round(x)}" y="${round(y)}">${value}</text>`;
    const result=target===0?marker(top.x,top.y-13,solution?`${fmt(shape.topBase)} cm`:"?")+marker(ext.x,ext.y+27,solution?`${fmt(shape.topBase)} cm`:"?"):target===1?marker(top.x,top.y-13,solution?`${fmt(shape.topBase)} cm`:"?"):marker(bot.x,bot.y+57,solution?`${fmt(shape.base)} cm`:"?");
    const baseLabel=target===2?marker(top.x,top.y-13,`${fmt(shape.topBase)} cm`):marker(bot.x,bot.y+57,`${fmt(shape.base)} cm`);
    const aria = `사다리꼴 ㄱㄴㄷㄹ의 두 밑각은 60도, ㄱㄴ은 ${fmt(shape.leg)}센티미터, ${target===2?`ㄱㄹ은 ${fmt(shape.topBase)}`:`ㄴㄷ은 ${fmt(shape.base)}`}센티미터이고 ㄹㅂ=ㅂㄷ입니다.${solution?` 구한 값은 ${fmt(answerValue)}센티미터입니다.`:""}`;
    return `<svg class="source52-p30e43-diagram" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p30e43-figure">${line("L", "G")}${line("G", "N")}${line("N", "D")}${line("D", "L")}${line("D", "M")}${line("G", "B")}${line("B", "M")}</g>${construction}<g class="source52-p30e43-marks">${equalTicks}${angleArc("L", "G", "D", 25, "source52-p30e43-sixty-arc")}${angleArc("D", "N", "L", 25, "source52-p30e43-sixty-arc")}</g>${angleLabels}${result}${target===2?baseLabel:""}${label("L", "ㄴ", -24, 14)}${label("G", "ㄱ", -18, -12)}${label("N", "ㄹ", 10, -10)}${label("D", "ㄷ", 10, 18)}${label("B", "ㅂ", 9, 1)}${label("M", "ㅁ", 10, 12)}<text class="source52-p30e43-dimension" x="${round((p.L.x + p.D.x) / 2 - 20)}" y="${round(p.D.y + 57)}">${target===2?"":fmt(shape.base)+" cm"}</text><text class="source52-p30e43-dimension" x="${round((p.L.x + p.G.x) / 2 - 40)}" y="${round((p.L.y + p.G.y) / 2)}">${fmt(shape.leg)} cm</text></svg>`;
  }

  function makeQuestion(variant=0,difficultyOffset=0,reviewLocked=false){
    const i=((variant%3)+3)%3,shape=model(i,difficultyOffset),top=shape.topBase,answer=i===0?2*top:i===1?top:shape.base;
    const given=i===2?`ㄱㄹ=${fmt(top)} cm, ㄱㄴ=${fmt(shape.leg)} cm`:`ㄴㄷ=${fmt(shape.base)} cm, ㄱㄴ=${fmt(shape.leg)} cm`;
    const target=["ㄱㄹ과 ㄷㅁ의 길이의 합","ㄱㄹ의 길이","ㄴㄷ의 길이"][i];
    const prompt=`<div class="source52-p30e43-question"><p>사다리꼴 ㄱㄴㄷㄹ에서 ㄱㄹ∥ㄴㄷ이고 두 밑각은 각각 60°입니다. ㄱㅂ을 늘인 선과 ㄴㄷ을 ㄷ 너머로 늘인 선이 ㅁ에서 만납니다. ${given}, ㄹㅂ=ㅂㄷ일 때 ${target}를 구하세요.</p>${diagram(shape,{target:i})}<div class="source52-p30e43-workspace" role="group" aria-label="풀이 공간"><span>풀이</span><div></div></div></div>`;
    const final=i===0?`따라서 ㄱㄹ+ㄷㅁ=${fmt(top)}+${fmt(top)}=<b>${fmt(answer)} cm</b>입니다.`:i===1?`따라서 ㄱㄹ=<b>${fmt(answer)} cm</b>입니다.`:`따라서 ㄴㄷ=ㄱㄴ+ㄱㅅ=${fmt(shape.leg)}+${fmt(top)}=<b>${fmt(answer)} cm</b>입니다.`;
    const solution=`<div class="source52-p30e43-solution"><ol><li>ㄴㄱ과 ㄷㄹ을 위로 늘여 만나는 점을 ㅅ이라 하면 △ㄴㄷㅅ은 세 각이 60°인 정삼각형입니다. ㄱㄹ∥ㄴㄷ이므로 △ㄱㄹㅅ도 정삼각형입니다.</li><li>따라서 ㄴㄷ=ㄴㅅ이고 ㄱㅅ=ㄱㄹ입니다. ${i===2?`ㄱㅅ=ㄱㄹ=${fmt(top)} cm`:`ㄱㄹ=ㄱㅅ=ㄴㄷ−ㄱㄴ=${fmt(shape.base)}−${fmt(shape.leg)}=${fmt(top)} cm`}입니다.</li><li>ㄹㅂ=ㅂㄷ, ㄱㄹ∥ㄷㅁ이므로 △ㄱㄹㅂ과 △ㅁㄷㅂ은 두 각과 끼인 변이 같아 합동입니다. 그래서 ㄷㅁ=ㄱㄹ=${fmt(top)} cm입니다. ${final}</li></ol></div>`;
    return {prompt:`<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${i}">${prompt}</div>`,answer:`${fmt(answer)} cm`,solution,sourceItemId,generator:generatorKey,generationMode:"fixed-verified-pool",verifiedPoolIndex:i,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${sourceItemId}:v${i}`,difficultyOffset:shape.difficultyOffset,difficultyLevel:shape.difficultyOffset+2,difficultyRank:shape.difficultyOffset+2,variantProvenance:"synthetic-source-structure",sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:reviewLocked?"locked":"verified-reconstruction",answerVisual:diagram(shape,{solution:true,target:i}),publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-triangle-congruence-and-coordinate-check",answerModel:shape,reviewLocked};
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P30E43SyntheticInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0, type.reviewLocked !== false) : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P30E43SyntheticInstalled", { value: true });
    return true;
  }

  return Object.freeze({ definition, pools, difficulties, model, diagram, makeQuestion, install });
});
