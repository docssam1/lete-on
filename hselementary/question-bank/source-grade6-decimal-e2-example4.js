(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 소수의 나눗셈 개념탐구 2 예제 2-4 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u3-e2-example-4";
  const generatorKey = "sourceGrade6DecimalDivisionE2Example4";
  const pools = Object.freeze([
    Object.freeze({ rectangleWidth: 5, triangleBase: 9, gap: 8.7, periodSeconds: 3, distancePerPeriod: 1.95, elapsedSeconds: 20 }),
    Object.freeze({ rectangleWidth: 4.8, triangleBase: 8, gap: 8.3, periodSeconds: 4, distancePerPeriod: 3.12, elapsedSeconds: 15 }),
    Object.freeze({ rectangleWidth: 6, triangleBase: 10, gap: 9.3, periodSeconds: 5, distancePerPeriod: 3.75, elapsedSeconds: 18 })
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
    const movedDistance = round(data.distancePerPeriod * data.elapsedSeconds / data.periodSeconds);
    const overlapWidth = round(movedDistance - data.gap);
    const areaByTriangle = round(overlapWidth * overlapWidth / 2);
    return { triangleHeight, movedDistance, overlapWidth, areaByTriangle };
  };
  const model = data => {
    const f = facts(data);
    const x0 = 50;
    const baseline = 185;
    const scale = Math.min(18, 460 / (data.rectangleWidth + data.gap + data.triangleBase));
    const rectangleHeight = f.triangleHeight * scale;
    const initialLeft = x0;
    const initialRight = initialLeft + data.rectangleWidth * scale;
    const triangleLeft = initialRight + data.gap * scale;
    const triangleRight = triangleLeft + data.triangleBase * scale;
    const apex = { x: triangleLeft + data.triangleBase * scale / 2, y: baseline - rectangleHeight };
    const finalLeft = initialLeft + f.movedDistance * scale;
    const finalRight = finalLeft + data.rectangleWidth * scale;
    const overlapTop = { x: finalRight, y: baseline - f.overlapWidth * scale };
    return {
      scale, baseline, rectangleHeight, initialLeft, initialRight, triangleLeft, triangleRight, apex, finalLeft, finalRight,
      overlap: [{ x: triangleLeft, y: baseline }, { x: finalRight, y: baseline }, overlapTop]
    };
  };
  const point = value => `${round(value.x, 4).toFixed(4)},${round(value.y, 4).toFixed(4)}`;
  const svg = (data, solved, poolIndex) => {
    const f = facts(data);
    const m = model(data);
    const top = m.baseline - m.rectangleHeight;
    const points = [
      `IL:${point({ x: m.initialLeft, y: m.baseline })}`,
      `IR:${point({ x: m.initialRight, y: m.baseline })}`,
      `TL:${point({ x: m.triangleLeft, y: m.baseline })}`,
      `TA:${point(m.apex)}`,
      `TR:${point({ x: m.triangleRight, y: m.baseline })}`,
      `FL:${point({ x: m.finalLeft, y: m.baseline })}`,
      `FR:${point({ x: m.finalRight, y: m.baseline })}`,
      `OT:${point(m.overlap[2])}`
    ].join(";");
    const initialRect = `<rect class="source61-e2ex4-rectangle ${solved ? "is-initial" : ""}" x="${m.initialLeft}" y="${top}" width="${data.rectangleWidth * m.scale}" height="${m.rectangleHeight}"/>`;
    const triangle = `<polygon class="source61-e2ex4-triangle" points="${point({ x: m.triangleLeft, y: m.baseline })} ${point(m.apex)} ${point({ x: m.triangleRight, y: m.baseline })}"/><path class="source61-e2ex4-right-angle" d="M${m.apex.x - 9},${m.apex.y + 9} L${m.apex.x},${m.apex.y + 18} L${m.apex.x + 9},${m.apex.y + 9}"/>`;
    const answerLayer = solved ? `<rect class="source61-e2ex4-rectangle is-final" x="${m.finalLeft}" y="${top}" width="${data.rectangleWidth * m.scale}" height="${m.rectangleHeight}"/><polygon class="source61-e2ex4-overlap is-solved" points="${m.overlap.map(point).join(" ")}"/><path class="source61-e2ex4-move-bracket" d="M${m.initialLeft},48 H${m.finalLeft} M${m.initialLeft},43 V53 M${m.finalLeft},43 V53"/><text class="source61-e2ex4-move-label" x="${(m.initialLeft + m.finalLeft) / 2}" y="31">${fmt(f.movedDistance)}cm 이동</text><text class="source61-e2ex4-result" x="280" y="280">겹친 넓이 ${fmt(f.areaByTriangle)}cm²</text>` : `<path class="source61-e2ex4-arrow" d="M${m.initialRight + 14},${top - 22} H${m.triangleLeft - 18} l-10,-7 m10,7 l-10,7"/><text class="source61-e2ex4-move-label" x="${(m.initialRight + m.triangleLeft) / 2}" y="${top - 43}">오른쪽으로 이동</text>`;
    const dimensionY = m.baseline + 31;
    return `<svg class="geometry-diagram source61-e2ex4-diagram ${solved ? "is-solved" : ""}" viewBox="0 0 560 300" role="img" aria-label="오른쪽으로 이동하는 직사각형과 직각이등변삼각형" data-source61-e2ex4-model="moving-rectangle-right-isosceles-overlap" data-source61-e2ex4-phase="${solved ? "answer" : "problem"}" data-source61-e2ex4-points="${points}" data-source61-e2ex4-values="${[data.rectangleWidth, data.triangleBase, data.gap, data.periodSeconds, data.distancePerPeriod, data.elapsedSeconds, f.movedDistance, f.overlapWidth, f.areaByTriangle].join(",")}" data-pool="${poolIndex}">
      <path class="source61-e2ex4-guide" d="M${m.initialLeft},${top} H${m.triangleRight + 12} M${m.initialLeft},${m.baseline} H${m.triangleRight + 12}"/>
      ${initialRect}${triangle}${answerLayer}
      <path class="source61-e2ex4-dimension" d="M${m.initialLeft},${dimensionY} H${m.initialRight} M${m.initialLeft},${dimensionY - 5} V${dimensionY + 5} M${m.initialRight},${dimensionY - 5} V${dimensionY + 5}"/>
      <text class="source61-e2ex4-measure" x="${(m.initialLeft + m.initialRight) / 2}" y="${dimensionY + 18}">${fmt(data.rectangleWidth)}cm</text>
      <path class="source61-e2ex4-dimension" d="M${m.initialRight},${dimensionY} H${m.triangleLeft} M${m.initialRight},${dimensionY - 5} V${dimensionY + 5} M${m.triangleLeft},${dimensionY - 5} V${dimensionY + 5}"/>
      <text class="source61-e2ex4-measure" x="${(m.initialRight + m.triangleLeft) / 2}" y="${dimensionY + 18}">${fmt(data.gap)}cm</text>
      <path class="source61-e2ex4-dimension" d="M${m.triangleLeft},${dimensionY} H${m.triangleRight} M${m.triangleLeft},${dimensionY - 5} V${dimensionY + 5} M${m.triangleRight},${dimensionY - 5} V${dimensionY + 5}"/>
      <text class="source61-e2ex4-measure" x="${(m.triangleLeft + m.triangleRight) / 2}" y="${dimensionY + 18}">${fmt(data.triangleBase)}cm</text>
    </svg>`;
  };
  const row = (label, value) => `<div class="source61-math-row"><span>${label}</span><b>${value}</b></div>`;
  const mathBoard = (data, f) => `<div class="source61-math-board source61-e2ex4-board"><strong>이동한 거리와 겹친 넓이</strong>${row("이동한 거리", `${fmt(data.distancePerPeriod)}÷${data.periodSeconds}×${data.elapsedSeconds}=${fmt(f.movedDistance)}cm`)}${row("겹친 가로", `${fmt(f.movedDistance)}-${fmt(data.gap)}=${fmt(f.overlapWidth)}cm`)}${row("겹친 넓이", `${fmt(f.overlapWidth)}×${fmt(f.overlapWidth)}÷2=${fmt(f.areaByTriangle)}cm²`)}</div>`;

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
    const m = model(data);
    const polygonArea = Math.abs(m.overlap.reduce((sum, current, index) => { const next = m.overlap[(index + 1) % m.overlap.length]; return sum + current.x * next.y - next.x * current.y; }, 0)) / 2 / (m.scale * m.scale);
    if (!(f.overlapWidth > 0 && f.overlapWidth < f.triangleHeight) || round(polygonArea) !== f.areaByTriangle) throw new Error(`${sourceItemId}: 이동 뒤 겹친 도형과 넓이가 하나로 정해지지 않습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const extra = level === 0
      ? `<p class="question-step" data-step-evidence="guided">먼저 ${data.elapsedSeconds}초 동안 움직인 거리에서 처음 두 도형 사이의 거리를 빼 보세요.</p>`
      : level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">겹친 부분이 왜 밑변과 높이가 같은 직각이등변삼각형이 되는지 그림을 이용해 설명해 보세요.</p>` : "";
    const difficultyDesign = ["guided", "source", "independent-reasoning"][level];
    const values = [data.rectangleWidth, data.triangleBase, data.gap, data.periodSeconds, data.distancePerPeriod, data.elapsedSeconds, f.movedDistance, f.overlapWidth, f.areaByTriangle];
    const evidence = `<span hidden data-source61-e2ex4-kind="moving-rectangle-right-isosceles-overlap" data-source-item="${sourceItemId}" data-values="${values.join(",")}" data-result-contract="single-value" data-difficulty-design="${difficultyDesign}"></span>`;
    return {
      prompt: `그림과 같은 직사각형과 직각이등변삼각형이 있습니다. 직사각형이 ${data.periodSeconds}초에 ${fmt(data.distancePerPeriod)}cm씩 화살표 방향으로 평행하게 움직인다면 ${data.elapsedSeconds}초 후 두 도형이 겹치는 부분의 넓이는 몇 cm²인가요?${svg(data, false, poolIndex)}${extra}${evidence}`,
      answer: `${fmt(f.areaByTriangle)}cm²`,
      solution: `직사각형은 ${fmt(data.distancePerPeriod)}÷${data.periodSeconds}×${data.elapsedSeconds}=${fmt(f.movedDistance)}cm 움직입니다. 처음 간격을 빼면 겹친 부분의 밑변과 높이는 각각 ${fmt(f.movedDistance)}-${fmt(data.gap)}=${fmt(f.overlapWidth)}cm입니다. 따라서 넓이는 ${fmt(f.overlapWidth)}×${fmt(f.overlapWidth)}÷2=${fmt(f.areaByTriangle)}cm²입니다.`,
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-e2ex4-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${svg(data, true, poolIndex)}${mathBoard(data, f)}<div class="solution-answer-caption">문제와 같은 도형을 옮겨 겹친 부분을 확인한 답</div></div>`,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3,
      sourceItemId, generator: generatorKey, variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant", difficultyDesign
    };
  };
  if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
  markInventory();
})();
