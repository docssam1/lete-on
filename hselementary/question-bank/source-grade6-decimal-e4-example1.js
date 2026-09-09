(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 소수의 나눗셈 개념탐구 4 예제 4-1 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u3-e4-example-1";
  const generatorKey = "sourceGrade6DecimalDivisionE4Example1";
  const pools = Object.freeze([
    Object.freeze({ columns: 4, topStart: 1, apexColumn: 3, totalWidth: 15.2, cellHeight: 2.5 }),
    Object.freeze({ columns: 5, topStart: 1, apexColumn: 4, totalWidth: 17.5, cellHeight: 2.4 }),
    Object.freeze({ columns: 5, topStart: 2, apexColumn: 4, totalWidth: 18, cellHeight: 2.2 })
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
    const cellWidth = round(data.totalWidth / data.columns);
    const topCellCount = data.columns - data.topStart;
    const cellCount = data.columns + topCellCount;
    const cellArea = round(cellWidth * data.cellHeight);
    const wholeArea = round(cellCount * cellArea);
    const triangleHeight = round(data.cellHeight);
    const triangleArea = round(data.totalWidth * triangleHeight / 2);
    const ratio = round(wholeArea / triangleArea);
    return { cellWidth, topCellCount, cellCount, cellArea, wholeArea, triangleHeight, triangleArea, ratio };
  };
  const model = data => {
    const width = 430;
    const cellWidth = width / data.columns;
    const cellHeight = Math.min(64, cellWidth * data.cellHeight / (data.totalWidth / data.columns));
    const left = 54;
    const baseline = 212;
    const pointAt = (column, row) => ({ x: left + column * cellWidth, y: baseline - row * cellHeight });
    const cells = [];
    for (let column = 0; column < data.columns; column += 1) cells.push({ column, row: 0 });
    for (let column = data.topStart; column < data.columns; column += 1) cells.push({ column, row: 1 });
    return {
      width, cellWidth, cellHeight, left, baseline, cells, pointAt,
      triangle: [pointAt(0, 1), pointAt(data.apexColumn, 2), pointAt(data.columns, 1)]
    };
  };
  const point = value => `${round(value.x, 4).toFixed(4)},${round(value.y, 4).toFixed(4)}`;
  const svg = (data, solved, poolIndex) => {
    const f = facts(data);
    const m = model(data);
    const [leftVertex, apex, rightVertex] = m.triangle;
    const points = `N:${point(leftVertex)};G:${point(apex)};D:${point(rightVertex)}`;
    const cells = m.cells.map(cell => `${cell.column},${cell.row}`).join(";");
    const cellRects = m.cells.map(cell => {
      const topLeft = m.pointAt(cell.column, cell.row + 1);
      return `<rect class="source61-e4ex1-cell" x="${topLeft.x}" y="${topLeft.y}" width="${m.cellWidth}" height="${m.cellHeight}"/>`;
    }).join("");
    const triangleFill = solved ? `<polygon class="source61-e4ex1-target is-solved" points="${m.triangle.map(point).join(" ")}"/>` : "";
    const dimensionY = m.baseline + 27;
    const rightX = m.left + m.width + 27;
    return `<svg class="geometry-diagram source61-e4ex1-diagram ${solved ? "is-solved" : ""}" viewBox="0 0 560 305" role="img" aria-label="같은 크기의 직사각형을 이어 붙인 도형과 삼각형" data-source61-e4ex1-model="equal-rectangle-grid-triangle-area-ratio" data-source61-e4ex1-phase="${solved ? "answer" : "problem"}" data-source61-e4ex1-points="${points}" data-source61-e4ex1-cells="${cells}" data-source61-e4ex1-values="${[data.columns, data.topStart, data.apexColumn, data.totalWidth, data.cellHeight, f.cellCount, f.wholeArea, f.triangleArea, f.ratio].join(",")}" data-pool="${poolIndex}">
      <g class="source61-e4ex1-grid">${cellRects}</g>${triangleFill}
      <polyline class="source61-e4ex1-triangle" points="${m.triangle.map(point).join(" ")} ${point(leftVertex)}"/>
      <text class="source61-e4ex1-point-label" x="${leftVertex.x - 17}" y="${leftVertex.y}">ㄴ</text>
      <text class="source61-e4ex1-point-label" x="${apex.x}" y="${apex.y - 17}">ㄱ</text>
      <text class="source61-e4ex1-point-label" x="${rightVertex.x + 17}" y="${rightVertex.y}">ㄷ</text>
      <path class="source61-e4ex1-dimension" d="M${m.left},${dimensionY} H${m.left + m.width} M${m.left},${dimensionY - 5} V${dimensionY + 5} M${m.left + m.width},${dimensionY - 5} V${dimensionY + 5}"/>
      <text class="source61-e4ex1-measure" x="${m.left + m.width / 2}" y="${dimensionY + 18}">${fmt(data.totalWidth)}cm</text>
      <path class="source61-e4ex1-dimension" d="M${rightX},${m.baseline - m.cellHeight} V${m.baseline} M${rightX - 5},${m.baseline - m.cellHeight} H${rightX + 5} M${rightX - 5},${m.baseline} H${rightX + 5}"/>
      <text class="source61-e4ex1-measure is-vertical" transform="translate(${rightX + 20} ${m.baseline - m.cellHeight / 2}) rotate(-90)">${fmt(data.cellHeight)}cm</text>
      ${solved ? `<text class="source61-e4ex1-result" x="280" y="291">도형 전체는 삼각형의 ${fmt(f.ratio)}배</text>` : ""}
    </svg>`;
  };
  const row = (label, value) => `<div class="source61-math-row"><span>${label}</span><b>${value}</b></div>`;
  const mathBoard = (data, f) => `<div class="source61-math-board source61-e4ex1-board"><strong>전체 도형과 삼각형의 넓이</strong>${row("같은 직사각형", `${f.cellCount}개`)}${row("직사각형 한 칸", `${fmt(f.cellWidth)}×${fmt(data.cellHeight)}=${fmt(f.cellArea)}cm²`)}${row("도형 전체", `${fmt(f.cellArea)}×${f.cellCount}=${fmt(f.wholeArea)}cm²`)}${row("삼각형", `${fmt(data.totalWidth)}×${fmt(f.triangleHeight)}÷2=${fmt(f.triangleArea)}cm²`)}${row("몇 배", `${fmt(f.wholeArea)}÷${fmt(f.triangleArea)}=${fmt(f.ratio)}배`)}</div>`;

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
    if (!(f.cellCount > 0 && f.triangleArea > 0 && Number.isFinite(f.ratio))) throw new Error(`${sourceItemId}: 두 넓이의 비가 하나로 정해지지 않습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const extra = level === 0
      ? `<p class="question-step" data-step-evidence="guided">먼저 같은 크기의 직사각형이 모두 몇 개인지 세고, 삼각형의 밑변과 높이를 찾아보세요.</p>`
      : level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">직사각형 한 칸의 넓이를 직접 구하지 않고도 몇 배인지 구할 수 있는 까닭을 설명해 보세요.</p>` : "";
    const difficultyDesign = ["guided", "source", "independent-reasoning"][level];
    const evidence = `<span hidden data-source61-e4ex1-kind="equal-rectangle-grid-triangle-area-ratio" data-source-item="${sourceItemId}" data-result-contract="single-value" data-difficulty-design="${difficultyDesign}"></span>`;
    return {
      prompt: `같은 크기의 직사각형을 겹치지 않게 이어 붙여 만든 도형 위에 삼각형 ㄱㄴㄷ을 그렸습니다. 도형 전체의 넓이는 삼각형 ㄱㄴㄷ의 넓이의 몇 배인지 소수로 나타내세요.${svg(data, false, poolIndex)}${extra}${evidence}`,
      answer: `${fmt(f.ratio)}배`,
      solution: `같은 크기의 직사각형은 모두 ${f.cellCount}개이고, 한 칸의 넓이는 ${fmt(f.cellWidth)}×${fmt(data.cellHeight)}=${fmt(f.cellArea)}cm²이므로 도형 전체의 넓이는 ${fmt(f.wholeArea)}cm²입니다. 삼각형 ㄱㄴㄷ의 밑변은 ${fmt(data.totalWidth)}cm, 높이는 ${fmt(f.triangleHeight)}cm이므로 넓이는 ${fmt(data.totalWidth)}×${fmt(f.triangleHeight)}÷2=${fmt(f.triangleArea)}cm²입니다. 따라서 ${fmt(f.wholeArea)}÷${fmt(f.triangleArea)}=${fmt(f.ratio)}배입니다.`,
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-e4ex1-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${svg(data, true, poolIndex)}${mathBoard(data, f)}<div class="solution-answer-caption">문제와 같은 격자와 삼각형에서 두 넓이를 확인한 답</div></div>`,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3,
      sourceItemId, generator: generatorKey, variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant", difficultyDesign
    };
  };
  if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
  markInventory();
})();
