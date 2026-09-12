(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 소수의 나눗셈 개념탐구 2 Mission 6 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u3-e2-mission-6";
  const generatorKey = "sourceGrade6DecimalDivisionE2Mission6";
  const pools = Object.freeze([
    Object.freeze({ triangleBase: 3, rectangleWidth: 6, gap: 10, trianglePeriod: 2, triangleDistance: 3.2, rectanglePeriod: 3, rectangleDistance: 2.1, elapsedSeconds: 5 }),
    Object.freeze({ triangleBase: 4, rectangleWidth: 6.5, gap: 9.2, trianglePeriod: 2, triangleDistance: 2.4, rectanglePeriod: 3, rectangleDistance: 1.8, elapsedSeconds: 6 }),
    Object.freeze({ triangleBase: 5, rectangleWidth: 7, gap: 12.4, trianglePeriod: 3, triangleDistance: 3.6, rectanglePeriod: 4, rectangleDistance: 2.4, elapsedSeconds: 8 })
  ]);
  const round = (value, places = 6) => Math.round((Number(value) + Number.EPSILON) * 10 ** places) / 10 ** places;
  const fmt = value => round(value).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  const poolIndexForSeed = seed => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % pools.length;
  };
  const facts = data => {
    const triangleHeight = round(data.triangleBase / 2);
    const triangleMove = round(data.triangleDistance * data.elapsedSeconds / data.trianglePeriod);
    const rectangleMove = round(data.rectangleDistance * data.elapsedSeconds / data.rectanglePeriod);
    const closedDistance = round(triangleMove + rectangleMove);
    const overlapWidth = round(closedDistance - data.gap);
    const overlapArea = round(overlapWidth * overlapWidth / 2);
    return { triangleHeight, triangleMove, rectangleMove, closedDistance, overlapWidth, overlapArea };
  };
  const model = data => {
    const f = facts(data);
    const x0 = 44;
    const baseline = 188;
    const totalWidth = data.triangleBase + data.gap + data.rectangleWidth;
    const scale = Math.min(23, 472 / totalWidth);
    const triangleLeft = x0;
    const triangleRight = triangleLeft + data.triangleBase * scale;
    const triangleApex = { x: triangleLeft + data.triangleBase * scale / 2, y: baseline - f.triangleHeight * scale };
    const rectangleLeft = triangleRight + data.gap * scale;
    const rectangleRight = rectangleLeft + data.rectangleWidth * scale;
    const rectangleTop = baseline - f.triangleHeight * scale;
    const finalTriangleLeft = triangleLeft + f.triangleMove * scale;
    const finalTriangleRight = triangleRight + f.triangleMove * scale;
    const finalTriangleApex = { x: triangleApex.x + f.triangleMove * scale, y: triangleApex.y };
    const finalRectangleLeft = rectangleLeft - f.rectangleMove * scale;
    const finalRectangleRight = rectangleRight - f.rectangleMove * scale;
    const overlapTop = { x: finalRectangleLeft, y: baseline - f.overlapWidth * scale };
    return {
      scale, baseline, triangleLeft, triangleRight, triangleApex, rectangleLeft, rectangleRight, rectangleTop,
      finalTriangleLeft, finalTriangleRight, finalTriangleApex, finalRectangleLeft, finalRectangleRight,
      overlap: [{ x: finalRectangleLeft, y: baseline }, { x: finalTriangleRight, y: baseline }, overlapTop]
    };
  };
  const point = value => `${round(value.x, 4).toFixed(4)},${round(value.y, 4).toFixed(4)}`;
  const rightAngle = apex => `<path class="source61-e2m6-right-angle" d="M${apex.x - 8},${apex.y + 8} L${apex.x},${apex.y + 16} L${apex.x + 8},${apex.y + 8}"/>`;
  const triangle = (left, apex, right, className) => `<polygon class="source61-e2m6-triangle ${className}" points="${point({ x: left, y: apex.y + (apex.x - left) })} ${point(apex)} ${point({ x: right, y: apex.y + (right - apex.x) })}"/>${rightAngle(apex)}`;
  const svg = (data, solved, poolIndex) => {
    const f = facts(data);
    const m = model(data);
    const points = [
      `ITL:${point({ x: m.triangleLeft, y: m.baseline })}`,
      `ITA:${point(m.triangleApex)}`,
      `ITR:${point({ x: m.triangleRight, y: m.baseline })}`,
      `IRL:${point({ x: m.rectangleLeft, y: m.baseline })}`,
      `IRR:${point({ x: m.rectangleRight, y: m.baseline })}`,
      `FTL:${point({ x: m.finalTriangleLeft, y: m.baseline })}`,
      `FTA:${point(m.finalTriangleApex)}`,
      `FTR:${point({ x: m.finalTriangleRight, y: m.baseline })}`,
      `FRL:${point({ x: m.finalRectangleLeft, y: m.baseline })}`,
      `FRR:${point({ x: m.finalRectangleRight, y: m.baseline })}`,
      `OT:${point(m.overlap[2])}`
    ].join(";");
    const values = [data.triangleBase, data.rectangleWidth, data.gap, data.trianglePeriod, data.triangleDistance, data.rectanglePeriod, data.rectangleDistance, data.elapsedSeconds, f.triangleMove, f.rectangleMove, f.overlapWidth, f.overlapArea];
    const initialTriangle = triangle(m.triangleLeft, m.triangleApex, m.triangleRight, solved ? "is-initial" : "");
    const initialRectangle = `<rect class="source61-e2m6-rectangle ${solved ? "is-initial" : ""}" x="${m.rectangleLeft}" y="${m.rectangleTop}" width="${data.rectangleWidth * m.scale}" height="${f.triangleHeight * m.scale}"/>`;
    const moveArrows = solved ? "" : `<path class="source61-e2m6-arrow" d="M${m.triangleRight + 13},${m.triangleApex.y - 18} H${m.triangleRight + 68} l-10,-7 m10,7 l-10,7 M${m.rectangleLeft - 13},${m.rectangleTop - 18} H${m.rectangleLeft - 68} l10,-7 m-10,7 l10,7"/><text class="source61-e2m6-move-label" x="${m.triangleRight + 43}" y="${m.triangleApex.y - 39}">오른쪽</text><text class="source61-e2m6-move-label" x="${m.rectangleLeft - 43}" y="${m.rectangleTop - 39}">왼쪽</text>`;
    const answerLayer = solved ? `${triangle(m.finalTriangleLeft, m.finalTriangleApex, m.finalTriangleRight, "is-final")}<rect class="source61-e2m6-rectangle is-final" x="${m.finalRectangleLeft}" y="${m.rectangleTop}" width="${data.rectangleWidth * m.scale}" height="${f.triangleHeight * m.scale}"/><polygon class="source61-e2m6-overlap is-solved" points="${m.overlap.map(point).join(" ")}"/><text class="source61-e2m6-result" x="280" y="279">겹친 넓이 ${fmt(f.overlapArea)}cm²</text>` : "";
    const dimensionY = m.baseline + 28;
    return `<svg class="geometry-diagram source61-e2m6-diagram ${solved ? "is-solved" : ""}" viewBox="0 0 560 300" role="img" aria-label="서로 마주 보며 움직이는 직각이등변삼각형과 직사각형" data-source61-e2m6-model="opposing-moving-shapes-overlap" data-source61-e2m6-phase="${solved ? "answer" : "problem"}" data-source61-e2m6-points="${points}" data-source61-e2m6-values="${values.join(",")}" data-pool="${poolIndex}">
      <path class="source61-e2m6-guide" d="M${m.triangleLeft - 8},${m.triangleApex.y} H${m.rectangleRight + 8} M${m.triangleLeft - 8},${m.baseline} H${m.rectangleRight + 8}"/>
      ${initialTriangle}${initialRectangle}${moveArrows}${answerLayer}
      <path class="source61-e2m6-dimension" d="M${m.triangleLeft},${dimensionY} H${m.triangleRight} M${m.triangleLeft},${dimensionY - 5} V${dimensionY + 5} M${m.triangleRight},${dimensionY - 5} V${dimensionY + 5}"/>
      <text class="source61-e2m6-measure" x="${(m.triangleLeft + m.triangleRight) / 2}" y="${dimensionY + 18}">${fmt(data.triangleBase)}cm</text>
      <path class="source61-e2m6-dimension" d="M${m.triangleRight},${dimensionY} H${m.rectangleLeft} M${m.triangleRight},${dimensionY - 5} V${dimensionY + 5} M${m.rectangleLeft},${dimensionY - 5} V${dimensionY + 5}"/>
      <text class="source61-e2m6-measure" x="${(m.triangleRight + m.rectangleLeft) / 2}" y="${dimensionY + 18}">${fmt(data.gap)}cm</text>
      <path class="source61-e2m6-dimension" d="M${m.rectangleLeft},${dimensionY} H${m.rectangleRight} M${m.rectangleLeft},${dimensionY - 5} V${dimensionY + 5} M${m.rectangleRight},${dimensionY - 5} V${dimensionY + 5}"/>
      <text class="source61-e2m6-measure" x="${(m.rectangleLeft + m.rectangleRight) / 2}" y="${dimensionY + 18}">${fmt(data.rectangleWidth)}cm</text>
    </svg>`;
  };
  const row = (label, value) => `<div class="source61-math-row"><span>${label}</span><b>${value}</b></div>`;
  const mathBoard = (data, f) => `<div class="source61-math-board source61-e2m6-board"><strong>두 도형이 움직인 거리와 겹친 넓이</strong>${row("삼각형 이동", `${fmt(data.triangleDistance)}÷${data.trianglePeriod}×${data.elapsedSeconds}=${fmt(f.triangleMove)}cm`)}${row("직사각형 이동", `${fmt(data.rectangleDistance)}÷${data.rectanglePeriod}×${data.elapsedSeconds}=${fmt(f.rectangleMove)}cm`)}${row("겹친 가로", `${fmt(f.triangleMove)}+${fmt(f.rectangleMove)}-${fmt(data.gap)}=${fmt(f.overlapWidth)}cm`)}${row("겹친 넓이", `${fmt(f.overlapWidth)}×${fmt(f.overlapWidth)}÷2=${fmt(f.overlapArea)}cm²`)}</div>`;

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
    if (!(f.overlapWidth > 0 && f.overlapWidth <= f.triangleHeight)) throw new Error(`${sourceItemId}: 겹친 부분이 하나의 직각삼각형으로 정해지지 않습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const extra = level === 0
      ? `<p class="question-step" data-step-evidence="guided">먼저 ${data.elapsedSeconds}초 동안 두 도형이 각각 움직인 거리를 구해 더해 보세요.</p>`
      : level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">겹친 부분의 밑변과 높이가 왜 같은지 그림을 이용해 설명해 보세요.</p>` : "";
    const difficultyDesign = ["guided", "source", "independent-reasoning"][level];
    const evidence = `<span hidden data-source61-e2m6-kind="opposing-moving-shapes-overlap" data-source-item="${sourceItemId}" data-result-contract="single-value" data-difficulty-design="${difficultyDesign}"></span>`;
    return {
      prompt: `그림과 같은 직각이등변삼각형과 직사각형이 있습니다. 직각이등변삼각형은 ${data.trianglePeriod}초에 ${fmt(data.triangleDistance)}cm, 직사각형은 ${data.rectanglePeriod}초에 ${fmt(data.rectangleDistance)}cm씩 화살표 방향으로 각각 평행하게 움직입니다. ${data.elapsedSeconds}초 후 두 도형이 겹치는 부분의 넓이는 몇 cm²인가요?${svg(data, false, poolIndex)}${extra}${evidence}`,
      answer: `${fmt(f.overlapArea)}cm²`,
      solution: `직각이등변삼각형은 ${fmt(data.triangleDistance)}÷${data.trianglePeriod}×${data.elapsedSeconds}=${fmt(f.triangleMove)}cm, 직사각형은 ${fmt(data.rectangleDistance)}÷${data.rectanglePeriod}×${data.elapsedSeconds}=${fmt(f.rectangleMove)}cm 움직입니다. 두 이동 거리를 더하고 처음 간격을 빼면 겹친 부분의 밑변과 높이는 각각 ${fmt(f.triangleMove)}+${fmt(f.rectangleMove)}-${fmt(data.gap)}=${fmt(f.overlapWidth)}cm입니다. 따라서 넓이는 ${fmt(f.overlapWidth)}×${fmt(f.overlapWidth)}÷2=${fmt(f.overlapArea)}cm²입니다.`,
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-e2m6-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${svg(data, true, poolIndex)}${mathBoard(data, f)}<div class="solution-answer-caption">문제와 같은 두 도형을 옮겨 겹친 부분을 확인한 답</div></div>`,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3,
      sourceItemId, generator: generatorKey, variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant", difficultyDesign
    };
  };
  if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
  markInventory();
})();
