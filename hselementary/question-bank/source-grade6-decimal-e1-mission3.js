(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 소수의 나눗셈 Mission 3 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u3-e1-mission-3";
  const generatorKey = "sourceGrade6DecimalDivisionE1Mission3";
  const pools = Object.freeze([
    Object.freeze({ base: 13, squareSide: 7.5, height: 4.8 }),
    Object.freeze({ base: 12.5, squareSide: 6.8, height: 5.2 }),
    Object.freeze({ base: 14, squareSide: 8.5, height: 6.3 })
  ]);
  const fmt = value => Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  const esc = value => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const poolIndexForSeed = seed => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % pools.length;
  };
  const facts = data => {
    const squareArea = Math.round(data.squareSide * data.squareSide * 100) / 100;
    const parallelogramArea = Math.round(data.base * data.height * 100) / 100;
    const totalArea = Math.round((squareArea + parallelogramArea) * 100) / 100;
    const candidates = [];
    for (let tenths = 1; tenths <= 999; tenths += 1) {
      const candidate = tenths / 10;
      if (Math.abs(data.base * candidate + squareArea - totalArea) < 1e-9) candidates.push(candidate);
    }
    return { squareArea, parallelogramArea, totalArea, candidates };
  };
  const pointText = point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  const rightMark = (corner, first, second, size = 10) => {
    const unit = vector => {
      const length = Math.hypot(vector.x, vector.y);
      return { x: vector.x / length, y: vector.y / length };
    };
    const u = unit({ x: first.x - corner.x, y: first.y - corner.y });
    const v = unit({ x: second.x - corner.x, y: second.y - corner.y });
    const p1 = { x: corner.x + u.x * size, y: corner.y + u.y * size };
    const middle = { x: p1.x + v.x * size, y: p1.y + v.y * size };
    const p2 = { x: corner.x + v.x * size, y: corner.y + v.y * size };
    return `<path class="source61-e1m3-right-angle" d="M${pointText(p1)} L${pointText(middle)} L${pointText(p2)}"/>`;
  };
  const model = data => {
    const scale = Math.min(14, 220 / data.base, 105 / data.squareSide);
    const sideDx = Math.sqrt(data.squareSide * data.squareSide - data.height * data.height) * scale;
    const sideDy = data.height * scale;
    const A = { x: 92, y: 132 };
    const B = { x: A.x + data.base * scale, y: A.y };
    const C = { x: B.x + sideDx, y: B.y + sideDy };
    const D = { x: A.x + sideDx, y: A.y + sideDy };
    const squareOffset = { x: sideDy, y: -sideDx };
    const E = { x: B.x + squareOffset.x, y: B.y + squareOffset.y };
    const F = { x: C.x + squareOffset.x, y: C.y + squareOffset.y };
    const H = { x: A.x, y: D.y };
    return { scale, A, B, C, D, E, F, H };
  };
  const svg = (data, solved, poolIndex) => {
    const f = facts(data);
    const m = model(data);
    const points = Object.entries(m).filter(([name]) => /^[A-H]$/.test(name)).map(([name, point]) => `${name}:${pointText(point)}`).join(";");
    const baseMid = { x: (m.A.x + m.B.x) / 2, y: m.A.y - 18 };
    const outerMid = { x: (m.E.x + m.F.x) / 2, y: (m.E.y + m.F.y) / 2 };
    const outwardLength = Math.hypot(m.E.x - m.B.x, m.E.y - m.B.y);
    const sideLabel = {
      x: outerMid.x + (m.E.x - m.B.x) / outwardLength * 22,
      y: outerMid.y + (m.E.y - m.B.y) / outwardLength * 22
    };
    const targetY = (m.A.y + m.H.y) / 2;
    const target = solved
      ? `<text class="source61-e1m3-target is-solved" x="43" y="${targetY}">${fmt(data.height)}</text>`
      : `<rect class="source61-e1m3-blank" x="19" y="${(targetY - 16).toFixed(2)}" width="48" height="32"/>`;
    const solutionLayer = solved
      ? `<path class="source61-e1m3-solution-highlight" d="M${pointText(m.A)} L${pointText(m.H)}"/><text class="source61-e1m3-result" x="260" y="270">높이 ${fmt(data.height)}cm</text>`
      : "";
    return `<svg class="geometry-diagram source61-e1m3-diagram ${solved ? "is-solved" : ""}" viewBox="0 0 520 290" role="img" aria-label="${solved ? "높이를 표시한" : "높이를 묻는"} 평행사변형과 정사각형을 이어 붙인 도형" data-source61-e1m3-model="joined-parallelogram-square" data-source61-e1m3-phase="${solved ? "answer" : "problem"}" data-source61-e1m3-points="${points}" data-source61-e1m3-segments="A-B;B-C;C-D;D-A;B-E;E-F;F-C;A-H" data-shared-segment="B-C" data-base="${data.base}" data-square-side="${data.squareSide}" data-height="${data.height}" data-scale="${m.scale}" data-total-area="${f.totalArea}" data-pool="${poolIndex}">
      <polygon class="source61-e1m3-parallelogram" points="${pointText(m.A)} ${pointText(m.B)} ${pointText(m.C)} ${pointText(m.D)}"/>
      <polygon class="source61-e1m3-square" points="${pointText(m.B)} ${pointText(m.E)} ${pointText(m.F)} ${pointText(m.C)}"/>
      <path class="source61-e1m3-shared" d="M${pointText(m.B)} L${pointText(m.C)}"/>
      <path class="source61-e1m3-height" d="M${pointText(m.A)} L${pointText(m.H)}"/>
      <path class="source61-e1m3-extension" d="M${pointText(m.H)} L${pointText(m.D)}"/>
      ${rightMark(m.H, m.A, m.D, 10)}
      ${rightMark(m.B, m.C, m.E, 9)}
      ${rightMark(m.E, m.B, m.F, 9)}
      ${rightMark(m.F, m.E, m.C, 9)}
      ${rightMark(m.C, m.F, m.B, 9)}
      <text class="source61-e1m3-measure" x="${baseMid.x}" y="${baseMid.y}">${fmt(data.base)}cm</text>
      <text class="source61-e1m3-measure" x="${sideLabel.x}" y="${sideLabel.y}">${fmt(data.squareSide)}cm</text>
      ${target}<text class="source61-e1m3-unit" x="76" y="${targetY}">cm</text>
      ${solutionLayer}
    </svg>`;
  };
  const mathBoard = (data, f) => `<div class="source61-math-board source61-e1m3-board"><strong>넓이를 나누어 확인</strong><div class="source61-math-row"><span>정사각형</span><b>${fmt(data.squareSide)}×${fmt(data.squareSide)}=${fmt(f.squareArea)}cm²</b></div><div class="source61-math-row"><span>평행사변형</span><b>${fmt(f.totalArea)}-${fmt(f.squareArea)}=${fmt(f.parallelogramArea)}cm²</b></div><div class="source61-math-row"><span>높이</span><b>${fmt(f.parallelogramArea)}÷${fmt(data.base)}=${fmt(data.height)}cm</b></div></div>`;

  const markInventory = () => {
    const patch = item => Object.assign(item, {
      generatorKey, reviewLocked: false, reviewReason: "", answerVisualStatus: "verified",
      generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      verifiedVariantProvenance: ["source-values", "source-structure-variant", "source-structure-variant"], variant: 0
    });
    if (Array.isArray(window.HSE_SOURCE_INVENTORY_GRADE6?.items)) window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(item => item.sourceItemId === sourceItemId).forEach(patch);
    const semesters = window.HSE_CURRICULUM?.semesters || [];
    semesters.flatMap(semester => semester.units || []).flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []).filter(type => type.sourceItemId === sourceItemId).forEach(patch);
  };

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => type?.sourceItemId === sourceItemId || type?.generatorKey === generatorKey ? generatorKey : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (type?.sourceItemId !== sourceItemId && type?.generatorKey !== generatorKey) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    const poolIndex = poolIndexForSeed(seed);
    const data = pools[poolIndex];
    const f = facts(data);
    if (!(data.squareSide > data.height) || f.candidates.length !== 1 || f.candidates[0] !== data.height) throw new Error(`${sourceItemId}: 단일 정답 또는 도형 조건 검산에 실패했습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const extra = level === 0
      ? `<p class="question-step" data-step-evidence="guided">전체 넓이에서 정사각형의 넓이를 먼저 빼어 평행사변형의 넓이를 구하세요.</p>`
      : level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">두 도형이 겹치지 않는다는 조건을 이용하여 높이가 하나로 정해지는 까닭도 설명해 보세요.</p>` : "";
    const evidence = `<span hidden data-source61-e1m3-kind="joined-area-height" data-source-item="${sourceItemId}" data-values="${esc([data.base, data.squareSide, data.height, f.squareArea, f.parallelogramArea, f.totalArea].join(","))}" data-difficulty-design="${["guided", "source", "independent-reasoning"][level]}"></span>`;
    return {
      prompt: `평행사변형과 정사각형을 겹치지 않게 이어 붙인 도형입니다. 전체 넓이가 ${fmt(f.totalArea)}cm²일 때 그림의 □ 안에 알맞은 수를 구하세요.${svg(data, false, poolIndex)}${extra}${evidence}`,
      answer: `${fmt(data.height)}cm`,
      solution: `정사각형의 넓이는 ${fmt(data.squareSide)}×${fmt(data.squareSide)}=${fmt(f.squareArea)}cm²입니다. 평행사변형의 넓이는 ${fmt(f.totalArea)}-${fmt(f.squareArea)}=${fmt(f.parallelogramArea)}cm²이고, 밑변이 ${fmt(data.base)}cm이므로 높이는 ${fmt(f.parallelogramArea)}÷${fmt(data.base)}=${fmt(data.height)}cm입니다.`,
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-e1m3-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${svg(data, true, poolIndex)}${mathBoard(data, f)}<div class="solution-answer-caption">문제와 같은 도형에서 넓이를 나누어 확인한 답</div></div>`,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3,
      sourceItemId, generator: generatorKey, variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant",
      difficultyDesign: ["guided", "source", "independent-reasoning"][level]
    };
  };
  if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
  markInventory();
})();
