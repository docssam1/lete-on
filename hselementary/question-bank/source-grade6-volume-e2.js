(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 부피 개념탐구 2 생성기를 불러오지 못했습니다.");

  const generatorKey = "sourceGrade6VolumeE2";
  const ids = Object.freeze([
    "6-1-u6-e2-exploration", "6-1-u6-e2-example-1", "6-1-u6-e2-example-2", "6-1-u6-e2-mission-1",
    "6-1-u6-e2-mission-2", "6-1-u6-e2-mission-3", "6-1-u6-e2-mission-5"
  ]);
  const idSet = new Set(ids);
  const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  const num = value => Number(value).toLocaleString("ko-KR");
  const key = point => Array.isArray(point) ? point.join(",") : String(point);

  const pools = Object.freeze({
    exploration: Object.freeze([
      { width: 30, height: 24, cut: 6 },
      { width: 28, height: 20, cut: 4 },
      { width: 36, height: 26, cut: 5 }
    ]),
    "example-1": Object.freeze([{ cubes: 12 }, { cubes: 24 }, { cubes: 36 }]),
    "example-2": Object.freeze([
      { totalLength: 8, totalDepth: 3, totalHeight: 3, columnHeights: [3, 2, 1], depthRows: 4 },
      { totalLength: 9, totalDepth: 4, totalHeight: 6, columnHeights: [3, 2, 1], depthRows: 4 },
      { totalLength: 12, totalDepth: 6, totalHeight: 3, columnHeights: [3, 2, 1], depthRows: 4 }
    ]),
    "mission-1": Object.freeze([{ cubes: 48 }, { cubes: 60 }, { cubes: 72 }]),
    "mission-2": Object.freeze([
      { rope: 110, cubeLeft: 22, cuboidLeft: 14 },
      { rope: 120, cubeLeft: 24, cuboidLeft: 12 },
      { rope: 96, cubeLeft: 16, cuboidLeft: 8 }
    ]),
    "mission-3": Object.freeze([{ unit: 10 }, { unit: 8 }, { unit: 12 }]),
    "mission-5": Object.freeze([
      { width: 8, height: 6, depth: 12 },
      { width: 10, height: 7, depth: 9 },
      { width: 12, height: 8, depth: 10 }
    ])
  });

  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const factorTriples = cubes => {
    const result = [];
    for (let a = 1; a * a * a <= cubes; a += 1) {
      if (cubes % a) continue;
      for (let b = a; b * b <= cubes / a; b += 1) {
        if (cubes % (a * b)) continue;
        result.push([a, b, cubes / (a * b)]);
      }
    }
    return result;
  };
  const explorationFacts = data => {
    const baseWidth = data.width - 2 * data.cut;
    const baseHeight = data.height - 2 * data.cut;
    return {
      baseWidth,
      baseHeight,
      paperPerimeter: 2 * (data.width + data.height),
      sideDifference: data.width - data.height,
      blockCount: baseWidth * baseHeight * data.cut
    };
  };
  const factorFacts = data => {
    const triples = factorTriples(data.cubes);
    return {
      triples,
      shortestCandidates: [...new Set(triples.map(triple => triple[0]))],
      allDifferent: triples.filter(triple => triple[0] < triple[1] && triple[1] < triple[2])
    };
  };
  const ropeFacts = data => {
    const cubeUsed = data.rope - data.cubeLeft;
    const cuboidUsed = data.rope - data.cuboidLeft;
    const usedDifference = cuboidUsed - cubeUsed;
    const side = cubeUsed / 8;
    const height = (cuboidUsed - 6 * side) / 2;
    return { cubeUsed, cuboidUsed, usedDifference, side, height, volume: side * side * height };
  };
  const stairFacts = data => {
    const depth = 5 * data.unit;
    const layerVolumes = [1, 2, 3, 4, 5].map(layer => layer * data.unit * data.unit * depth);
    return {
      depth,
      layerVolumes,
      volume: layerVolumes.reduce((sum, value) => sum + value, 0),
      surface: 2 * 15 * data.unit * data.unit + 20 * data.unit * depth
    };
  };
  const congruentStairFacts = data => {
    const columnCount = data.columnHeights.length;
    const maxLayers = Math.max(...data.columnHeights);
    const profileCells = data.columnHeights.reduce((sum, value) => sum + value, 0);
    const blockCount = profileCells * data.depthRows;
    const boundingCellCount = columnCount * data.depthRows * maxLayers;
    const blockLength = data.totalLength / columnCount;
    const blockDepth = data.totalDepth / data.depthRows;
    const blockHeight = data.totalHeight / maxLayers;
    const blockVolume = blockLength * blockDepth * blockHeight;
    const volume = blockCount * blockVolume;
    const profileArea = profileCells * blockLength * blockHeight;
    const frontBackArea = 2 * profileArea;
    const topBottomArea = 2 * data.totalLength * data.totalDepth;
    const stepEndArea = 2 * data.totalHeight * data.totalDepth;
    const surface = frontBackArea + topBottomArea + stepEndArea;
    const occupied = new Set();
    data.columnHeights.forEach((height, x) => {
      for (let y = 0; y < data.depthRows; y += 1) for (let z = 0; z < height; z += 1) occupied.add(`${x},${y},${z}`);
    });
    const faces = [
      [1, 0, 0, blockDepth * blockHeight], [-1, 0, 0, blockDepth * blockHeight],
      [0, 1, 0, blockLength * blockHeight], [0, -1, 0, blockLength * blockHeight],
      [0, 0, 1, blockLength * blockDepth], [0, 0, -1, blockLength * blockDepth]
    ];
    let exposedSurface = 0;
    occupied.forEach(cell => {
      const [x, y, z] = cell.split(",").map(Number);
      faces.forEach(([dx, dy, dz, area]) => { if (!occupied.has(`${x + dx},${y + dy},${z + dz}`)) exposedSurface += area; });
    });
    return {
      columnCount, maxLayers, profileCells, blockCount, boundingCellCount,
      blockLength, blockDepth, blockHeight, blockVolume, volume, profileArea,
      frontBackArea, topBottomArea, stepEndArea, surface, exposedSurface
    };
  };
  const threeRopeFacts = data => {
    const ropeA = 2 * (data.depth + data.height);
    const ropeB = 2 * (data.width + data.height);
    const ropeC = 4 * (data.width + data.height + data.depth);
    const sideSum = ropeC / 4;
    const candidates = [];
    for (let width = 1; width < sideSum; width += 1) {
      for (let height = 1; height < sideSum - width; height += 1) {
        const depth = sideSum - width - height;
        if (2 * (depth + height) === ropeA && 2 * (width + height) === ropeB) candidates.push([width, height, depth]);
      }
    }
    return {
      ropeA,
      ropeB,
      ropeC,
      sideSum,
      hardDifference: ropeC - ropeA - ropeB,
      candidates,
      volume: data.width * data.height * data.depth
    };
  };
  const fractionMarkup = (numerator, denominator) => {
    const divisor = gcd(numerator, denominator);
    const n = numerator / divisor;
    const d = denominator / divisor;
    if (d === 1) return String(n);
    return `<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`;
  };
  const row = (label, value) => `<div class="source61-math-row"><span>${esc(label)}</span><b>${value}</b></div>`;
  const board = (title, rows) => `<div class="source61-math-board"><strong>${esc(title)}</strong>${rows.join("")}</div>`;
  const support = (level, message) => level === 0 ? `<p class="question-step" data-step-evidence="guided">먼저 ${message}</p>` : "";
  const challenge = (level, message) => level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">${message}</p>` : "";

  const text = (x, y, value, className = "source61-volume-e2-label", anchor = "middle") => `<text class="${className}" x="${x}" y="${y}" text-anchor="${anchor}" style="text-anchor:${anchor}">${esc(value)}</text>`;
  const line = (x1, y1, x2, y2, className = "source61-volume-e2-line", role = "") => `<line class="${className}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${role ? ` data-visual-element="${role}"` : ""}/>`;
  const rect = (x, y, width, height, className = "source61-volume-e2-face", role = "") => `<rect class="${className}" x="${x}" y="${y}" width="${width}" height="${height}"${role ? ` data-visual-element="${role}"` : ""}/>`;
  const circle = (cx, cy, radius, className, role = "") => `<circle class="${className}" cx="${cx}" cy="${cy}" r="${radius}"${role ? ` data-visual-element="${role}"` : ""}/>`;
  const polygon = (points, className = "source61-volume-e2-face", role = "") => `<polygon class="${className}" points="${points.map(point => point.join(",")).join(" ")}"${role ? ` data-visual-element="${role}"` : ""}/>`;

  const svgStyle = `<style>.source61-volume-e2-diagram .source61-volume-e2-sheet{fill:#f8fbfd;stroke:#294963;stroke-width:2}.source61-volume-e2-diagram .source61-volume-e2-face,.source61-volume-e2-diagram .source61-volume-e2-box{fill:#edf6fb;stroke:#294963;stroke-width:2}.source61-volume-e2-diagram .source61-volume-e2-box-top{fill:#fff0bd;stroke:#294963;stroke-width:2}.source61-volume-e2-diagram .source61-volume-e2-box-side{fill:#dceffd;stroke:#294963;stroke-width:2}.source61-volume-e2-diagram .source61-volume-e2-fold{fill:none;stroke:#7891a5;stroke-width:1.5;stroke-dasharray:5 4}.source61-volume-e2-diagram .source61-volume-e2-grid{fill:none;stroke:#8ca7b8;stroke-width:.65}.source61-volume-e2-diagram .source61-volume-e2-unit-cube,.source61-volume-e2-diagram .source61-volume-e2-card{fill:#edf6fb;stroke:#294963;stroke-width:1.4}.source61-volume-e2-diagram .source61-volume-e2-card-solved{fill:#fff0bd;stroke:#b77909;stroke-width:2}.source61-volume-e2-diagram .source61-volume-e2-rope{fill:none;stroke:#c47b18;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.source61-volume-e2-diagram .source61-volume-e2-rope.is-solved{stroke:#b33d35}.source61-volume-e2-diagram .source61-volume-e2-rope-hidden{fill:none;stroke:#c47b18;stroke-width:2.4;stroke-dasharray:5 4;stroke-linecap:round;opacity:.72}.source61-volume-e2-diagram .source61-volume-e2-rope-hidden.is-solved{stroke:#b33d35}.source61-volume-e2-diagram .source61-volume-e2-rope-knot{fill:#fff;stroke:#c47b18;stroke-width:3}.source61-volume-e2-diagram .source61-volume-e2-rope-knot.is-solved{stroke:#b33d35}.source61-volume-e2-diagram .source61-volume-e2-stair-cell{fill:#edf6fb;stroke:#294963;stroke-width:1.4}.source61-volume-e2-diagram .source61-volume-e2-stair-cell.is-solved{fill:#fff0bd}.source61-volume-e2-diagram .source61-volume-e2-line,.source61-volume-e2-diagram .source61-volume-e2-outline,.source61-volume-e2-diagram .source61-volume-e2-depth,.source61-volume-e2-diagram .source61-volume-e2-dimension,.source61-volume-e2-diagram .source61-volume-e2-extension{fill:none;stroke:#294963;stroke-width:2}.source61-volume-e2-diagram .source61-volume-e2-dimension{stroke:#6d8394;stroke-width:1.4}.source61-volume-e2-diagram .source61-volume-e2-extension{stroke:#9aacb9;stroke-width:1}.source61-volume-e2-diagram .source61-volume-e2-perimeter{fill:none;stroke:#c53b32;stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 1px #fff)}.source61-volume-e2-diagram .source61-volume-e2-label,.source61-volume-e2-diagram .source61-volume-e2-measure,.source61-volume-e2-diagram .source61-volume-e2-note,.source61-volume-e2-diagram .source61-volume-e2-title,.source61-volume-e2-diagram .source61-volume-e2-answer-label{font-family:Pretendard,"Malgun Gothic",Arial,sans-serif;font-size:11px;font-weight:850;fill:#183b56!important;paint-order:stroke;stroke:#fff;stroke-width:2px;stroke-linejoin:round}.source61-volume-e2-diagram .source61-volume-e2-title{font-size:13px;font-weight:950}.source61-volume-e2-diagram .source61-volume-e2-note{font-size:10px;fill:#526b7d!important}.source61-volume-e2-diagram .source61-volume-e2-answer-label{font-size:11px;font-weight:950;fill:#9a6500!important}.source61-volume-e2-diagram[data-model-key="three-rope-box"] .source61-volume-e2-title{font-size:22px}.source61-volume-e2-diagram[data-model-key="three-rope-box"] .source61-volume-e2-note{font-size:20px}.source61-volume-e2-diagram[data-model-key="three-rope-box"] .source61-volume-e2-answer-label{font-size:20px}.source61-volume-e2-diagram[data-model-key="congruent-block-stair"] .source61-volume-e2-title{font-size:20px}.source61-volume-e2-diagram[data-model-key="congruent-block-stair"] .source61-volume-e2-note{font-size:17px}.source61-volume-e2-diagram[data-model-key="congruent-block-stair"] .source61-volume-e2-measure,.source61-volume-e2-diagram[data-model-key="congruent-block-stair"] .source61-volume-e2-answer-label{font-size:18px}</style>`;
  const svg = (kind, data, poolIndex, solved, content, required, width = 640, height = 360) => `<svg class="geometry-diagram source61-volume-e2-diagram" style="display:block;width:min(${Math.min(width, 640)}px,100%);height:auto;margin:12px auto;overflow:visible" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(`${kind} ${solved ? "정답 그림" : "문제 그림"}`)}" data-phase="${solved ? "answer" : "problem"}" data-model-key="${kind}" data-source61-volume-e2-values="${esc(data.values.join(","))}" data-difficulty-level="${data.level}" data-required-elements="${required.join(",")}" data-pool-index="${poolIndex}">${svgStyle}${content}</svg>`;

  const explorationSvg = (data, poolIndex, solved) => {
    const scale = Math.min(9.2, 300 / data.width, 190 / data.height);
    const sheetWidth = data.width * scale;
    const sheetHeight = data.height * scale;
    const left = 40;
    const top = 60;
    const cut = data.cut * scale;
    const right = left + sheetWidth;
    const bottom = top + sheetHeight;
    const outline = [[left + cut, top], [right - cut, top], [right - cut, top + cut], [right, top + cut], [right, bottom - cut], [right - cut, bottom - cut], [right - cut, bottom], [left + cut, bottom], [left + cut, bottom - cut], [left, bottom - cut], [left, top + cut], [left + cut, top + cut]];
    const baseLeft = left + cut;
    const baseTop = top + cut;
    const baseWidth = sheetWidth - 2 * cut;
    const baseHeight = sheetHeight - 2 * cut;
    const grid = [];
    if (solved) {
      const gridStep = Math.max(3, Math.min(baseWidth / (data.width - 2 * data.cut), baseHeight / (data.height - 2 * data.cut)));
      for (let x = 1; x < data.width - 2 * data.cut; x += 1) grid.push(line(baseLeft + x * gridStep, baseTop, baseLeft + x * gridStep, baseTop + baseHeight, "source61-volume-e2-grid", "base-grid"));
      for (let y = 1; y < data.height - 2 * data.cut; y += 1) grid.push(line(baseLeft, baseTop + y * gridStep, baseLeft + baseWidth, baseTop + y * gridStep, "source61-volume-e2-grid", "base-grid"));
    }
    const widthDimensionY = top - 24;
    const heightDimensionX = left - 26;
    const cutDimensionY = top + cut / 2;
    const cutDimensionX = left + cut / 2;
    const showPaperNumbers = solved || data.level !== 2;
    const problemSummary = data.level === 0
      ? `접은 뒤 밑면 ${data.baseWidth}cm × ${data.baseHeight}cm`
      : data.level === 2
        ? `종이 둘레 ${data.paperPerimeter}cm · 가로가 세로보다 ${data.sideDifference}cm 더 김`
        : "네 모서리에서 같은 정사각형을 자름";
    const dimensions = [
      line(left, widthDimensionY, right, widthDimensionY, "source61-volume-e2-dimension", "paper-width-dimension"),
      line(left, top, left, widthDimensionY, "source61-volume-e2-extension", "paper-width-start"),
      line(right, top, right, widthDimensionY, "source61-volume-e2-extension", "paper-width-end"),
      text(left + sheetWidth / 2, widthDimensionY - 6, showPaperNumbers ? `전체 가로 ${data.width}cm` : "전체 가로: 먼저 구하기", "source61-volume-e2-measure"),
      line(heightDimensionX, top, heightDimensionX, bottom, "source61-volume-e2-dimension", "paper-height-dimension"),
      line(heightDimensionX, top, left, top, "source61-volume-e2-extension", "paper-height-start"),
      line(heightDimensionX, bottom, left, bottom, "source61-volume-e2-extension", "paper-height-end"),
      text(18, top + sheetHeight / 2, showPaperNumbers ? `전체 세로 ${data.height}cm` : "전체 세로: 먼저 구하기", "source61-volume-e2-measure", "start"),
      line(left, cutDimensionY, left + cut, cutDimensionY, "source61-volume-e2-cut-dimension", "cut-width-dimension"),
      line(left, top, left, cutDimensionY, "source61-volume-e2-extension", "cut-width-start"),
      line(left + cut, top, left + cut, cutDimensionY, "source61-volume-e2-extension", "cut-width-end"),
      text(cutDimensionX, cutDimensionY - 5, `${data.cut}cm`, "source61-volume-e2-note"),
      line(cutDimensionX, top, cutDimensionX, top + cut, "source61-volume-e2-cut-dimension", "cut-height-dimension"),
      line(left, top, cutDimensionX, top, "source61-volume-e2-extension", "cut-height-start"),
      line(left, top + cut, cutDimensionX, top + cut, "source61-volume-e2-extension", "cut-height-end"),
      text(left + cut + 8, top + cut / 2 + 4, `${data.cut}cm`, "source61-volume-e2-note", "start"),
      text(left + sheetWidth / 2, bottom + 22, solved ? `밑면 ${data.baseWidth}cm × ${data.baseHeight}cm` : problemSummary, "source61-volume-e2-note")
    ];
    const solvedLabels = solved ? [
      text(430, 74, `높이 ${data.cut}cm`, "source61-volume-e2-answer-label", "start"),
      text(430, 105, `블록 수 = ${data.baseWidth} × ${data.baseHeight} × ${data.cut}`, "source61-volume-e2-answer-label", "start"),
      text(430, 135, `= ${data.blockCount}개`, "source61-volume-e2-answer-label", "start"),
      text(430, 176, `1cm³ 정육면체 ${data.blockCount}개`, "source61-volume-e2-answer-label", "start"),
      text(430, 220, "밑면 격자 = 1cm 간격", "source61-volume-e2-note", "start")
    ] : [];
    const content = `${polygon(outline, `source61-volume-e2-sheet${solved ? " is-solved" : ""}`, "paper-net")}${line(baseLeft, top, baseLeft, bottom, "source61-volume-e2-fold", "fold-line")}${line(right - cut, top, right - cut, bottom, "source61-volume-e2-fold", "fold-line")}${line(left, baseTop, right, baseTop, "source61-volume-e2-fold", "fold-line")}${line(left, bottom - cut, right, bottom - cut, "source61-volume-e2-fold", "fold-line")}${grid.join("")}${dimensions.join("")}${solvedLabels.join("")}`;
    return svg("cut-corners-box", { values: [data.width, data.height, data.cut, data.blockCount], level: data.level }, poolIndex, solved, content, ["paper-net", "fold-line", "paper-width-dimension", "paper-width-start", "paper-width-end", "paper-height-dimension", "paper-height-start", "paper-height-end", "cut-width-dimension", "cut-width-start", "cut-width-end", "cut-height-dimension", "cut-height-start", "cut-height-end", ...(solved ? ["base-grid"] : [])], 640, 320);
  };

  const factorSvg = (data, poolIndex, solved) => {
    const triples = data.triples;
    const cells = [];
    const columns = data.cubes <= 12 ? 6 : data.cubes <= 24 ? 8 : 9;
    const cell = data.cubes <= 12 ? 24 : 20;
    const startX = 38;
    const startY = 68;
    const rows = Math.ceil(data.cubes / columns);
    for (let index = 0; index < data.cubes; index += 1) {
      const x = startX + (index % columns) * (cell + 4);
      const y = startY + Math.floor(index / columns) * (cell + 4);
      cells.push(rect(x, y, cell, cell, "source61-volume-e2-unit-cube", "unit-cube"));
    }
    const factorRows = triples.map((triple, index) => {
      const column = index % 3;
      const rowIndex = Math.floor(index / 3);
      const x = 364 + column * 88;
      const y = 62 + rowIndex * 42;
      const fill = solved ? " source61-volume-e2-factor-card-solved is-solved" : "";
      return `<g class="source61-volume-e2-factor-card${fill}" data-visual-element="factor-triple">${rect(x, y, 78, 30, `source61-volume-e2-card${fill}`, "factor-card")}${text(x + 39, y + 16, `${triple[0]} × ${triple[1]} × ${triple[2]}`, "source61-volume-e2-factor-label")}</g>`;
    }).join("");
    const problemNote = data.level === 0
      ? `가장 짧은 변으로 가능한 길이: ${data.shortestCandidates.map(value => `${value}cm`).join(", ")}`
      : data.level === 2
        ? "전체 모양 수와 세 변의 길이가 모두 다른 모양 수"
        : "모양을 바꾸어 붙여 보세요";
    const resultLabels = data.level === 2
      ? `${text(190, 238, `전체 ${triples.length}가지`, "source61-volume-e2-answer-label")}${text(190, 260, `세 변의 길이가 모두 다른 경우 ${data.allDifferent.length}가지`, "source61-volume-e2-answer-label")}`
      : text(190, 252, `${triples.length}가지`, "source61-volume-e2-answer-label");
    const content = `${text(190, 28, solved ? `정육면체 ${data.cubes}개의 세 변 모든 경우 찾기` : `1cm³ 정육면체 ${data.cubes}개`, "source61-volume-e2-title")}${cells.join("")}${solved ? `${text(190, 48, `세 변의 길이를 작은 수부터 차례로 놓고 곱이 ${data.cubes}`, "source61-volume-e2-note")}${factorRows}${resultLabels}` : text(190, 252, problemNote, "source61-volume-e2-note")}`;
    return svg("distinct-cuboids", { values: [data.cubes, triples.length, data.allDifferent.length], level: data.level }, poolIndex, solved, content, solved ? ["unit-cube", "factor-triple", "factor-card"] : ["unit-cube"], 640, 280);
  };

  const cuboidBody = (x, y, width, height, depth, solved, role, dimensionText = "") => {
    const dx = depth;
    const dy = -depth * 0.58;
    const front = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
    const top = [[x, y], [x + dx, y + dy], [x + width + dx, y + dy], [x + width, y]];
    const side = [[x + width, y], [x + width + dx, y + dy], [x + width + dx, y + height + dy], [x + width, y + height]];
    const joinX = x + width / 2;
    const joinY = y + height / 2;
    const topFront = [joinX, y];
    const topBack = [joinX + dx, y + dy];
    const bottomBack = [joinX + dx, y + height + dy];
    const bottomFront = [joinX, y + height];
    const rightFront = [x + width, joinY];
    const rightBack = [x + width + dx, joinY + dy];
    const leftBack = [x + dx, joinY + dy];
    const leftFront = [x, joinY];
    const ropePoints = [[joinX, joinY], topFront, topBack, bottomBack, bottomFront, [joinX, joinY], rightFront, rightBack, leftBack, leftFront, [joinX, joinY]];
    const ropePath = ropePoints.map((point, index) => `${index ? "L" : "M"}${point[0]} ${point[1]}`).join(" ");
    const continuousRope = `<path class="source61-volume-e2-rope${solved ? " is-solved" : ""}" d="${ropePath}" data-visual-element="${role}-continuous-rope" data-rope-join="${joinX},${joinY}" data-rope-style="surface-cross" data-rope-loop-count="2"/>`;
    const knot = circle(joinX, joinY, 5, `source61-volume-e2-rope-knot${solved ? " is-solved" : ""}`, `${role}-rope-knot`);
    const knotLabel = text(joinX + 9, joinY - 8, "매듭", "source61-volume-e2-note", "start");
    const dimensions = solved && dimensionText ? text(x + width / 2, y + height + 25, dimensionText, "source61-volume-e2-answer-label") : "";
    return `${polygon(front, `source61-volume-e2-box${solved ? " is-solved" : ""}`, `${role}-front`)}${polygon(top, "source61-volume-e2-box-top", `${role}-top`)}${polygon(side, "source61-volume-e2-box-side", `${role}-side`)}${continuousRope}${knot}${knotLabel}${dimensions}`;
  };

  const ropeSvg = (data, poolIndex, solved) => {
    const cube = { side: data.side * 4.1, x: 66, y: 92 };
    const cuboid = { s: data.side * 3.1, h: data.height * 3.1, x: 355, y: 60 };
    const cubeMeasure = solved ? `밑면 한 변 ${data.side}cm · 높이 ${data.side}cm` : "";
    const cuboidMeasure = solved ? `밑면 한 변 ${data.side}cm · 높이 ${data.height}cm` : "";
    const cubeBase = solved ? `가로 둘레 4×${data.side}cm=${4 * data.side}cm` : "";
    const cubeVertical = solved ? `위아래 둘레 2×${data.side}cm+2×${data.side}cm=${4 * data.side}cm` : "";
    const cuboidBase = solved ? `가로 둘레 4×${data.side}cm=${4 * data.side}cm` : "";
    const cuboidVertical = solved ? `위아래 둘레 2×${data.side}cm+2×${data.height}cm=${2 * data.side + 2 * data.height}cm` : "";
    const problemLengths = data.level === 0
      ? `${text(170, 226, `가에서 사용한 끈 ${data.cubeUsed}cm`, "source61-volume-e2-note")}${text(470, 226, `나에서 사용한 끈 ${data.cuboidUsed}cm`, "source61-volume-e2-note")}`
      : data.level === 2
        ? `${text(170, 226, `전체 끈 ${data.rope}cm · 가에서 남은 끈 ${data.cubeLeft}cm`, "source61-volume-e2-note")}${text(470, 226, `나는 가보다 사용한 끈이 ${data.usedDifference}cm 더 김`, "source61-volume-e2-note")}`
        : `${text(170, 226, `전체 끈 ${data.rope}cm · 남은 끈 ${data.cubeLeft}cm`, "source61-volume-e2-note")}${text(470, 226, `전체 끈 ${data.rope}cm · 남은 끈 ${data.cuboidLeft}cm`, "source61-volume-e2-note")}`;
    const answerDetails = `${text(170, 226, cubeMeasure, "source61-volume-e2-answer-label")}${text(170, 248, cubeBase, "source61-volume-e2-answer-label")}${text(170, 270, cubeVertical, "source61-volume-e2-answer-label")}${text(470, 226, cuboidMeasure, "source61-volume-e2-answer-label")}${text(470, 248, cuboidBase, "source61-volume-e2-answer-label")}${text(470, 270, cuboidVertical, "source61-volume-e2-answer-label")}${text(170, 304, `가 전체 끈 길이 8×${data.side}cm=${8 * data.side}cm`, "source61-volume-e2-answer-label")}${text(470, 304, `나 전체 끈 길이 6×${data.side}cm+2×${data.height}cm=${6 * data.side + 2 * data.height}cm`, "source61-volume-e2-answer-label")}`;
    const content = `${text(170, 24, "가: 정육면체 상자", "source61-volume-e2-title")}${text(470, 24, "나: 밑면이 정사각형인 직육면체", "source61-volume-e2-title")}${cuboidBody(cube.x, cube.y, cube.side, cube.side, 34, solved, "cube", cubeMeasure)}${cuboidBody(cuboid.x, cuboid.y, cuboid.s, cuboid.h, 34, solved, "cuboid", cuboidMeasure)}${solved ? answerDetails : problemLengths}`;
    return svg("rope-wrapped-box", { values: [data.rope, data.cubeLeft, data.cuboidLeft, data.side, data.height, data.volume], level: data.level }, poolIndex, solved, content, ["cube-continuous-rope", "cuboid-continuous-rope", "cube-rope-knot", "cuboid-rope-knot", "cube-front", "cuboid-front"], 640, 345);
  };

  const threeRopeSvg = (data, poolIndex, solved) => {
    const path = (points, className, role) => `<path class="${className}${solved ? " is-solved" : ""}" d="${points.map((point, index) => `${index ? "L" : "M"}${point[0]} ${point[1]}`).join(" ")}" data-visual-element="${role}"/>`;
    const segmentedPath = (segments, className, role) => `<path class="${className}${solved ? " is-solved" : ""}" d="${segments.map(segment => segment.map((point, index) => `${index ? "L" : "M"}${point[0]} ${point[1]}`).join(" ")).join(" ")}" data-visual-element="${role}"/>`;
    const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const box = (x, y, role, loops) => {
      const width = 96;
      const height = 72;
      const dx = 34;
      const dy = -22;
      const frontTopLeft = [x, y];
      const frontTopRight = [x + width, y];
      const frontBottomRight = [x + width, y + height];
      const frontBottomLeft = [x, y + height];
      const backTopLeft = [x + dx, y + dy];
      const backTopRight = [x + width + dx, y + dy];
      const backBottomRight = [x + width + dx, y + height + dy];
      const backBottomLeft = [x + dx, y + height + dy];
      const faces = `${polygon([frontTopLeft, frontTopRight, frontBottomRight, frontBottomLeft], "source61-volume-e2-box", `${role}-front`)}${polygon([frontTopLeft, backTopLeft, backTopRight, frontTopRight], "source61-volume-e2-box-top", `${role}-top`)}${polygon([frontTopRight, backTopRight, backBottomRight, frontBottomRight], "source61-volume-e2-box-side", `${role}-side`)}`;
      const depthHeight = () => {
        const frontTop = midpoint(frontTopLeft, frontTopRight);
        const backTop = midpoint(backTopLeft, backTopRight);
        const backBottom = midpoint(backBottomLeft, backBottomRight);
        const frontBottom = midpoint(frontBottomLeft, frontBottomRight);
        return `${segmentedPath([[frontTop, backTop], [frontTop, frontBottom]], "source61-volume-e2-rope", `${role}-depth-height-visible`)}${segmentedPath([[backTop, backBottom], [backBottom, frontBottom]], "source61-volume-e2-rope-hidden", `${role}-depth-height-hidden`)}`;
      };
      const widthHeight = () => {
        const topLeft = midpoint(frontTopLeft, backTopLeft);
        const topRight = midpoint(frontTopRight, backTopRight);
        const bottomRight = midpoint(frontBottomRight, backBottomRight);
        const bottomLeft = midpoint(frontBottomLeft, backBottomLeft);
        return `${segmentedPath([[topLeft, topRight], [topRight, bottomRight]], "source61-volume-e2-rope", `${role}-width-height-visible`)}${segmentedPath([[bottomRight, bottomLeft], [bottomLeft, topLeft]], "source61-volume-e2-rope-hidden", `${role}-width-height-hidden`)}`;
      };
      const widthDepth = () => {
        const frontLeft = midpoint(frontTopLeft, frontBottomLeft);
        const frontRight = midpoint(frontTopRight, frontBottomRight);
        const backRight = midpoint(backTopRight, backBottomRight);
        const backLeft = midpoint(backTopLeft, backBottomLeft);
        return `${segmentedPath([[frontLeft, frontRight], [frontRight, backRight]], "source61-volume-e2-rope", `${role}-width-depth-visible`)}${segmentedPath([[backRight, backLeft], [backLeft, frontLeft]], "source61-volume-e2-rope-hidden", `${role}-width-depth-hidden`)}`;
      };
      const ropeMarkup = `${loops.includes("depth-height") ? depthHeight() : ""}${loops.includes("width-height") ? widthHeight() : ""}${loops.includes("width-depth") ? widthDepth() : ""}`;
      const dimensions = solved && role === "box-c" ? `${line(frontBottomLeft[0], frontBottomLeft[1] + 12, frontBottomRight[0], frontBottomRight[1] + 12, "source61-volume-e2-dimension", "box-width-dimension")}${text(x + width / 2, y + height + 28, `${data.width}cm`, "source61-volume-e2-answer-label")}${line(x - 12, y, x - 12, y + height, "source61-volume-e2-dimension", "box-height-dimension")}${text(x - 18, y + height / 2 + 4, `${data.height}cm`, "source61-volume-e2-answer-label", "end")}${path([frontTopRight, backTopRight], "source61-volume-e2-dimension", "box-depth-dimension")}${text(x + width + dx / 2, y + dy - 8, `${data.depth}cm`, "source61-volume-e2-answer-label")}` : "";
      return `${faces}${ropeMarkup}${dimensions}`;
    };
    const easy = data.level === 0;
    const hard = data.level === 2;
    const caption = (x, title, first, second = "") => `${text(x, 30, title, "source61-volume-e2-title")}${text(x, 214, first, solved ? "source61-volume-e2-answer-label" : "source61-volume-e2-note")}${second ? text(x, 244, second, solved ? "source61-volume-e2-answer-label" : "source61-volume-e2-note") : ""}`;
    const aCaption = solved ? [`세로+높이=${data.ropeA / 2}cm`, `2배=${data.ropeA}cm`] : easy ? [`끈 ${data.ropeA}cm`, "세로+높이의 2배"] : [`사용한 끈 ${data.ropeA}cm`, ""];
    const bCaption = solved ? [`가로+높이=${data.ropeB / 2}cm`, `2배=${data.ropeB}cm`] : easy ? [`끈 ${data.ropeB}cm`, "가로+높이의 2배"] : [`사용한 끈 ${data.ropeB}cm`, ""];
    const cCaption = solved ? [`세 변의 합=${data.sideSum}cm`, `4배=${data.ropeC}cm`] : hard ? ["가·나의 합보다", `${data.hardDifference}cm 더 김`] : easy ? [`끈 ${data.ropeC}cm`, "세 변의 합의 4배"] : [`사용한 끈 ${data.ropeC}cm`, ""];
    const answerSummary = solved ? `${text(320, 284, `가로 ${data.width}cm · 세로 ${data.depth}cm · 높이 ${data.height}cm`, "source61-volume-e2-answer-label")}${text(320, 314, `부피 ${data.width}×${data.depth}×${data.height}=${num(data.volume)}cm³`, "source61-volume-e2-answer-label")}` : "";
    const content = `${box(35, 88, "box-a", ["depth-height"])}${box(250, 88, "box-b", ["width-height"])}${box(465, 88, "box-c", ["depth-height", "width-height", "width-depth"])}${caption(100, "가", ...aCaption)}${caption(315, "나", ...bCaption)}${caption(530, "다", ...cCaption)}${answerSummary}`;
    const required = [
      "box-a-front", "box-a-top", "box-a-side", "box-a-depth-height-visible", "box-a-depth-height-hidden",
      "box-b-front", "box-b-top", "box-b-side", "box-b-width-height-visible", "box-b-width-height-hidden",
      "box-c-front", "box-c-top", "box-c-side", "box-c-depth-height-visible", "box-c-depth-height-hidden",
      "box-c-width-height-visible", "box-c-width-height-hidden", "box-c-width-depth-visible", "box-c-width-depth-hidden"
    ];
    if (solved) required.push("box-width-dimension", "box-height-dimension", "box-depth-dimension");
    return svg("three-rope-box", { values: [data.width, data.height, data.depth, data.ropeA, data.ropeB, data.ropeC, data.volume], level: data.level }, poolIndex, solved, content, required, 640, 338);
  };

  const congruentStairSvg = (data, poolIndex, solved) => {
    const heights = data.columnHeights;
    const columns = heights.length;
    const maxLayers = Math.max(...heights);
    const cellWidth = 54;
    const cellHeight = 44;
    const depthX = 96;
    const depthY = -58;
    const canvasWidth = solved ? 420 : 460;
    const canvasHeight = solved ? 610 : 350;
    const baseX = solved ? 82 : 92;
    const baseY = solved ? 250 : 230;
    const solvedClass = solved ? " is-solved" : "";
    const profile = [[baseX, baseY], [baseX + columns * cellWidth, baseY], [baseX + columns * cellWidth, baseY - heights[columns - 1] * cellHeight]];
    for (let column = columns - 1; column >= 0; column -= 1) {
      const x = baseX + column * cellWidth;
      profile.push([x, baseY - heights[column] * cellHeight]);
      if (column > 0 && heights[column - 1] !== heights[column]) profile.push([x, baseY - heights[column - 1] * cellHeight]);
    }
    const backProfile = profile.map(([x, y]) => [x + depthX, y + depthY]);
    const backFace = polygon(backProfile, `source61-volume-e2-box-side${solvedClass}`, "congruent-stair-back-profile");
    const topFaces = heights.map((height, column) => {
      const x1 = baseX + column * cellWidth;
      const x2 = x1 + cellWidth;
      const y = baseY - height * cellHeight;
      return polygon([[x1, y], [x1 + depthX, y + depthY], [x2 + depthX, y + depthY], [x2, y]], `source61-volume-e2-box-top${solvedClass}`, "congruent-stair-top-face");
    }).join("");
    const riserFaces = heights.map((height, column) => {
      const nextHeight = column === columns - 1 ? 0 : heights[column + 1];
      if (height === nextHeight) return "";
      const x = baseX + (column + 1) * cellWidth;
      const top = baseY - height * cellHeight;
      const bottom = baseY - nextHeight * cellHeight;
      return polygon([[x, top], [x + depthX, top + depthY], [x + depthX, bottom + depthY], [x, bottom]], `source61-volume-e2-face${solvedClass}`, "congruent-stair-riser-face");
    }).join("");
    const depthGrid = heights.map((height, column) => {
      const x1 = baseX + column * cellWidth;
      const x2 = x1 + cellWidth;
      const y = baseY - height * cellHeight;
      return Array.from({ length: data.depthRows - 1 }, (_, index) => {
        const ratio = (index + 1) / data.depthRows;
        return line(x1 + depthX * ratio, y + depthY * ratio, x2 + depthX * ratio, y + depthY * ratio, "source61-volume-e2-grid", "congruent-stair-depth-grid");
      }).join("");
    }).join("");
    const riserGrid = heights.map((height, column) => {
      const nextHeight = column === columns - 1 ? 0 : heights[column + 1];
      if (height === nextHeight) return "";
      const x = baseX + (column + 1) * cellWidth;
      const top = baseY - height * cellHeight;
      const bottom = baseY - nextHeight * cellHeight;
      return Array.from({ length: data.depthRows - 1 }, (_, index) => {
        const ratio = (index + 1) / data.depthRows;
        return line(x + depthX * ratio, top + depthY * ratio, x + depthX * ratio, bottom + depthY * ratio, "source61-volume-e2-grid", "congruent-stair-riser-grid");
      }).join("");
    }).join("");
    const frontCells = heights.map((height, column) => Array.from({ length: height }, (_, layer) => rect(
      baseX + column * cellWidth,
      baseY - (layer + 1) * cellHeight,
      cellWidth,
      cellHeight,
      `source61-volume-e2-stair-cell${solvedClass}`,
      "congruent-stair-front-cell"
    )).join("")).join("");
    const profileOutline = `<path class="source61-volume-e2-${solved ? "perimeter is-solved" : "outline"}" d="${profile.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ")} Z" data-visual-element="congruent-stair-profile-outline" data-cell-count="${data.profileCells}"/>`;
    const lengthDimension = `${line(baseX, baseY + 16, baseX + columns * cellWidth, baseY + 16, "source61-volume-e2-dimension", "congruent-stair-length-dimension")}${line(baseX, baseY, baseX, baseY + 16, "source61-volume-e2-extension", "congruent-stair-length-start")}${line(baseX + columns * cellWidth, baseY, baseX + columns * cellWidth, baseY + 16, "source61-volume-e2-extension", "congruent-stair-length-end")}${text(baseX + columns * cellWidth / 2, baseY + 40, `${data.totalLength}cm`, "source61-volume-e2-measure")}`;
    const heightDimension = `${line(baseX - 18, baseY, baseX - 18, baseY - maxLayers * cellHeight, "source61-volume-e2-dimension", "congruent-stair-height-dimension")}${line(baseX - 18, baseY, baseX, baseY, "source61-volume-e2-extension", "congruent-stair-height-start")}${line(baseX - 18, baseY - maxLayers * cellHeight, baseX, baseY - maxLayers * cellHeight, "source61-volume-e2-extension", "congruent-stair-height-end")}${text(baseX - 8, baseY - maxLayers * cellHeight / 2 + 5, `${data.totalHeight}cm`, "source61-volume-e2-measure", "end")}`;
    const depthDimension = `${line(baseX, baseY - maxLayers * cellHeight, baseX + depthX, baseY - maxLayers * cellHeight + depthY, "source61-volume-e2-dimension", "congruent-stair-depth-dimension")}${text(baseX + depthX / 2, baseY - maxLayers * cellHeight + depthY / 2 - 10, `${data.totalDepth}cm`, "source61-volume-e2-measure")}`;
    const levelLabels = solved ? heights.map((height, column) => text(baseX + (column + 0.5) * cellWidth, baseY - height * cellHeight - 12, `${height}층`, "source61-volume-e2-answer-label")).join("") : "";
    const answerCard = solved ? `${rect(20, 320, 380, 270, "source61-volume-e2-card-solved", "congruent-stair-answer-card")}${text(40, 350, "그림의 칸과 실제 길이로 확인", "source61-volume-e2-title", "start")}${text(40, 380, `앞면 ${heights.join("+")}=${data.profileCells}칸`, "source61-volume-e2-answer-label", "start")}${text(40, 406, `깊이 ${data.depthRows}줄 → 조각 ${data.blockCount}개`, "source61-volume-e2-answer-label", "start")}${text(40, 432, `가득 채우면 ${data.columnCount}×${data.depthRows}×${data.maxLayers}=${data.boundingCellCount}칸`, "source61-volume-e2-note", "start")}${text(40, 458, `한 조각 부피 ${num(data.totalLength * data.totalDepth * data.totalHeight)}÷${data.boundingCellCount}=${num(data.blockVolume)}cm³`, "source61-volume-e2-note", "start")}${text(40, 484, `부피 ${data.blockCount}×${num(data.blockVolume)}=${num(data.volume)}cm³`, "source61-volume-e2-answer-label", "start")}${line(38, 502, 382, 502, "source61-volume-e2-fold", "congruent-stair-answer-rule")}${text(40, 528, `앞·뒤 ${num(data.frontBackArea)}cm² · 위·아래 ${num(data.topBottomArea)}cm²`, "source61-volume-e2-note", "start")}${text(40, 554, `양 끝과 계단 면 ${num(data.stepEndArea)}cm²`, "source61-volume-e2-note", "start")}${text(40, 580, `겉넓이 ${num(data.surface)}cm²`, "source61-volume-e2-answer-label", "start")}` : "";
    const guide = !solved && data.level === 0 ? text(canvasWidth / 2, 324, `앞면 ${heights.join("+")}칸 · 깊이 ${data.depthRows}줄`, "source61-volume-e2-note") : "";
    const content = `${text(canvasWidth / 2, 24, "같은 직육면체로 쌓은 계단", "source61-volume-e2-title")}${backFace}${topFaces}${riserFaces}${depthGrid}${riserGrid}${frontCells}${profileOutline}${lengthDimension}${heightDimension}${depthDimension}${levelLabels}${answerCard}${guide}`;
    const required = [
      "congruent-stair-back-profile", "congruent-stair-top-face", "congruent-stair-riser-face",
      "congruent-stair-depth-grid", "congruent-stair-riser-grid", "congruent-stair-front-cell",
      "congruent-stair-profile-outline", "congruent-stair-length-dimension", "congruent-stair-height-dimension",
      "congruent-stair-depth-dimension"
    ];
    if (solved) required.push("congruent-stair-answer-card", "congruent-stair-answer-rule");
    return svg("congruent-block-stair", { values: [data.totalLength, data.totalDepth, data.totalHeight, data.depthRows, ...heights, data.blockCount, data.volume, data.surface], level: data.level }, poolIndex, solved, content, required, canvasWidth, canvasHeight);
  };

  const stairSvg = (data, poolIndex, solved) => {
    const cell = 22;
    const baseX = 48;
    const baseY = 220;
    const depthX = 66;
    const depthY = -38;
    const depth = data.depth;
    const front = [[baseX, baseY], [baseX + 5 * cell, baseY], [baseX + 5 * cell, baseY - 5 * cell]];
    for (let column = 4; column >= 0; column -= 1) {
      const x = baseX + column * cell;
      const top = baseY - (column + 1) * cell;
      front.push([x, top]);
      if (column > 0) front.push([x, baseY - column * cell]);
    }
    const back = front.map(([x, y]) => [x + depthX, y + depthY]);
    const solvedClass = solved ? " is-solved" : "";
    const backFace = polygon(back, `source61-volume-e2-box-side${solvedClass}`, "stair-back-face");
    const topFaces = [0, 1, 2, 3, 4].map(column => {
      const y = baseY - (column + 1) * cell;
      return polygon([[baseX + column * cell, y], [baseX + (column + 1) * cell, y], [baseX + (column + 1) * cell + depthX, y + depthY], [baseX + column * cell + depthX, y + depthY]], `source61-volume-e2-box-top${solvedClass}`, "stair-top-face");
    }).join("");
    const sideFaces = [0, 1, 2, 3].map(column => {
      const x = baseX + (column + 1) * cell;
      const top = baseY - (column + 2) * cell;
      const bottom = baseY - (column + 1) * cell;
      return polygon([[x, top], [x, bottom], [x + depthX, bottom + depthY], [x + depthX, top + depthY]], `source61-volume-e2-face${solvedClass}`, "stair-side-face");
    }).join("") + polygon([[baseX + 5 * cell, baseY - 5 * cell], [baseX + 5 * cell, baseY], [baseX + 5 * cell + depthX, baseY + depthY], [baseX + 5 * cell + depthX, baseY - 5 * cell + depthY]], `source61-volume-e2-face${solvedClass}`, "stair-side-face");
    const depthEdges = front.map(([x, y], index) => line(x, y, back[index][0], back[index][1], `source61-volume-e2-depth${solvedClass}`, "stair-depth-edge")).join("");
    const frontFace = polygon(front, `source61-volume-e2-face${solvedClass}`, "stair-front-face");
    const perimeterPath = solved ? `<path class="source61-volume-e2-perimeter is-solved" d="${front.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ")} Z" data-visual-element="cross-section-perimeter-20-cells" data-cell-count="20"/>` : "";
    const unitLabel = !solved && data.level === 2 ? "한 칸: 전체 가로를 5등분" : `한 칸 ${data.unit}cm`;
    const heightLabel = !solved && data.level === 2 ? "전체 높이: 한 칸 5개" : `전체 높이 ${5 * data.unit}cm`;
    const depthLabel = !solved && data.level === 2 ? "깊이는 전체 가로와 같음" : `깊이 ${depth}cm`;
    const hardProblem = !solved && data.level === 2;
    const unitDimension = `${line(baseX, baseY + 14, baseX + cell, baseY + 14, "source61-volume-e2-dimension", "unit-dimension")}${line(baseX, baseY, baseX, baseY + 14, "source61-volume-e2-extension", "unit-dimension-start")}${line(baseX + cell, baseY, baseX + cell, baseY + 14, "source61-volume-e2-extension", "unit-dimension-end")}${text(hardProblem ? baseX : baseX + cell / 2, baseY + 28, unitLabel, "source61-volume-e2-measure", hardProblem ? "start" : "middle")}`;
    const widthDimension = `${line(baseX, baseY + 48, baseX + 5 * cell, baseY + 48, "source61-volume-e2-dimension", "width-dimension")}${line(baseX, baseY, baseX, baseY + 48, "source61-volume-e2-extension", "width-dimension-start")}${line(baseX + 5 * cell, baseY, baseX + 5 * cell, baseY + 48, "source61-volume-e2-extension", "width-dimension-end")}${text(baseX + 2.5 * cell, baseY + 62, `전체 가로 ${5 * data.unit}cm`, "source61-volume-e2-measure")}`;
    const heightDimension = `${line(baseX + 5 * cell + 18, baseY, baseX + 5 * cell + 18, baseY - 5 * cell, "source61-volume-e2-dimension", "height-dimension")}${line(baseX + 5 * cell, baseY, baseX + 5 * cell + 18, baseY, "source61-volume-e2-extension", "height-dimension-start")}${line(baseX + 5 * cell, baseY - 5 * cell, baseX + 5 * cell + 18, baseY - 5 * cell, "source61-volume-e2-extension", "height-dimension-end")}${text(baseX + 5 * cell + 28, baseY - 2.5 * cell, heightLabel, "source61-volume-e2-measure", "end")}`;
    const depthDimension = `${line(baseX + 5 * cell, baseY - 5 * cell, baseX + 5 * cell + depthX, baseY - 5 * cell + depthY, "source61-volume-e2-dimension", "depth-dimension")}${text(225, 312, depthLabel, "source61-volume-e2-measure", "start")}`;
    const header = `${text(150, 24, "계단 모양 입체도형", "source61-volume-e2-title")}${text(145, 46, solved ? "앞면과 뒤쪽 계단을 이어서 계산 확인" : "앞면 계단과 뒤쪽 깊이를 함께 살펴보세요", "source61-volume-e2-note")}`;
    const easyCounts = !solved && data.level === 0 ? text(318, 82, "높이가 1~5층인 부분의 앞면 칸 수: 1, 2, 3, 4, 5칸", "source61-volume-e2-note", "start") : "";
    const table = solved ? `${rect(300, 50, 320, 252, `source61-volume-e2-card${solvedClass}`, "answer-table")}${text(318, 70, "층별 부피와 겉넓이 근거", "source61-volume-e2-title", "start")}${[1, 2, 3, 4, 5].map((layer, index) => text(318, 94 + index * 22, `${layer}층 부피 ${layer}×${data.unit}×${data.unit}×${depth}=${data.layerVolumes[index]}cm³`, "source61-volume-e2-answer-label", "start")).join("")}${line(314, 202, 606, 202, "source61-volume-e2-fold", "answer-table-rule")}${text(318, 220, `층별 합계 (1+2+3+4+5)×${data.unit}×${data.unit}×${depth}=${data.volume}cm³`, "source61-volume-e2-answer-label", "start")}${text(318, 242, `단면 넓이 15×${data.unit}×${data.unit}`, "source61-volume-e2-note", "start")}${text(318, 262, `단면 바깥 둘레 20칸: 20×${data.unit}=${20 * data.unit}cm`, "source61-volume-e2-note", "start")}${text(318, 284, `겉넓이 2×15×${data.unit}×${data.unit}+20×${data.unit}×${depth}=${data.surface}cm²`, "source61-volume-e2-answer-label", "start")}` : "";
    const content = `${header}${backFace}${topFaces}${sideFaces}${depthEdges}${frontFace}${perimeterPath}${unitDimension}${widthDimension}${heightDimension}${depthDimension}${easyCounts}${table}`;
    const required = ["stair-front-face", "stair-back-face", "stair-top-face", "stair-side-face", "stair-depth-edge", "unit-dimension", "unit-dimension-start", "unit-dimension-end", "width-dimension", "width-dimension-start", "width-dimension-end", "height-dimension", "height-dimension-start", "height-dimension-end", "depth-dimension"];
    if (solved) required.push("answer-table", "answer-table-rule", "cross-section-perimeter-20-cells");
    return svg("stair-prism", { values: [data.unit, depth, data.volume, data.surface], level: data.level }, poolIndex, solved, content, required, 640, 330);
  };

  const build = (kind, data, poolIndex, solved, level) => {
    if (kind === "exploration") {
      const facts = explorationFacts(data);
      const model = { ...data, ...facts, level };
      const firstStep = level === 0
        ? `접은 뒤 밑면 가로 ${facts.baseWidth}cm와 세로 ${facts.baseHeight}cm가 주어졌고, 높이는 잘라 낸 정사각형의 한 변인 ${data.cut}cm입니다.`
        : level === 2
          ? `종이의 가로와 세로의 합은 ${facts.paperPerimeter}÷2=${data.width + data.height}cm입니다. 가로가 세로보다 ${facts.sideDifference}cm 더 기므로 가로는 (${data.width + data.height}+${facts.sideDifference})÷2=${data.width}cm, 세로는 ${data.width + data.height}-${data.width}=${data.height}cm입니다. 접은 뒤 밑면은 가로 ${data.width}-2×${data.cut}=${facts.baseWidth}cm, 세로 ${data.height}-2×${data.cut}=${facts.baseHeight}cm입니다.`
          : `접은 뒤 밑면은 가로 ${data.width}-2×${data.cut}=${facts.baseWidth}cm, 세로 ${data.height}-2×${data.cut}=${facts.baseHeight}cm이고, 높이는 ${data.cut}cm입니다.`;
      return { answer: `${num(facts.blockCount)}개`, visual: explorationSvg(model, poolIndex, solved), solution: `${firstStep} 따라서 1cm³ 정육면체의 개수는 ${facts.baseWidth}×${facts.baseHeight}×${data.cut}=${num(facts.blockCount)}개입니다.` };
    }
    if (kind === "example-1" || kind === "mission-1") {
      const facts = factorFacts(data);
      const model = { ...data, ...facts, level };
      const allCases = facts.triples.map(triple => triple.join("×")).join(", ");
      const differentCases = facts.allDifferent.map(triple => triple.join("×")).join(", ");
      const firstStep = level === 0
        ? `가장 짧은 변으로 가능한 길이가 ${facts.shortestCandidates.map(value => `${value}cm`).join(", ")}로 주어졌으므로, 각 길이부터 시작해 세 변의 길이를 작은 수부터 차례로 놓습니다.`
        : level === 2
          ? "먼저 서로 다른 직육면체의 모든 경우를 빠짐없이 찾고, 그중 세 변의 길이가 모두 다른 경우를 다시 가릅니다."
          : "세 변의 길이를 작은 수부터 차례로 놓고, 가능한 경우를 빠짐없이 찾습니다.";
      const ending = level === 2
        ? `모두 ${facts.triples.length}가지이고, 세 변의 길이가 모두 다른 경우는 ${differentCases}이므로 ${facts.allDifferent.length}가지입니다.`
        : `서로 다른 직육면체는 ${facts.triples.length}가지입니다.`;
      const answer = level === 2 ? `전체 ${facts.triples.length}가지, 세 변의 길이가 모두 다른 경우 ${facts.allDifferent.length}가지` : `${facts.triples.length}가지`;
      return { answer, visual: factorSvg(model, poolIndex, solved), solution: `${firstStep} 세 변의 곱이 ${data.cubes}가 되는 경우는 ${allCases}입니다. ${ending}` };
    }
    if (kind === "example-2") {
      const facts = congruentStairFacts(data);
      const monotone = data.columnHeights.every((height, index) => height > 0 && (!index || data.columnHeights[index - 1] >= height));
      if (!monotone || Math.abs(facts.exposedSurface - facts.surface) > 1e-8 || ![facts.blockCount, facts.blockVolume, facts.volume, facts.surface].every(Number.isInteger)) throw new Error("계단 직육면체의 칸·노출 면 계산이 한 답으로 정해지지 않습니다.");
      const model = { ...data, ...facts, level };
      const countStep = `앞에서 본 계단은 ${data.columnHeights.join("+")}=${facts.profileCells}칸이고 깊이 방향으로 ${data.depthRows}줄이므로 직육면체는 ${facts.profileCells}×${data.depthRows}=${facts.blockCount}개입니다.`;
      const firstStep = level === 0
        ? `앞면 ${data.columnHeights.join("+")}칸과 깊이 ${data.depthRows}줄이 주어졌습니다. ${countStep}`
        : level === 2
          ? `먼저 그림의 칸을 빠짐없이 셉니다. ${countStep}`
          : `그림을 앞면의 계단 칸과 뒤쪽 깊이 줄로 나누어 봅니다. ${countStep}`;
      const fullVolume = data.totalLength * data.totalDepth * data.totalHeight;
      const volumeStep = `전체 ${facts.boundingCellCount}칸을 가득 채운 직육면체의 부피는 ${data.totalLength}×${data.totalDepth}×${data.totalHeight}=${num(fullVolume)}cm³이므로 한 조각의 부피는 ${num(fullVolume)}÷${facts.boundingCellCount}=${num(facts.blockVolume)}cm³입니다. 따라서 부피는 ${facts.blockCount}×${num(facts.blockVolume)}=${num(facts.volume)}cm³입니다.`;
      const surfaceStep = `앞면과 뒷면의 넓이 합은 ${num(facts.frontBackArea)}cm², 위쪽과 아래쪽의 넓이 합은 ${num(facts.topBottomArea)}cm², 양 끝과 계단의 세로 면 넓이 합은 ${num(facts.stepEndArea)}cm²입니다. 따라서 겉넓이는 ${num(facts.frontBackArea)}+${num(facts.topBottomArea)}+${num(facts.stepEndArea)}=${num(facts.surface)}cm²입니다.`;
      const answer = level === 2 ? `직육면체 ${facts.blockCount}개, 겉넓이 ${num(facts.surface)}cm², 부피 ${num(facts.volume)}cm³` : `겉넓이 ${num(facts.surface)}cm², 부피 ${num(facts.volume)}cm³`;
      return { answer, visual: congruentStairSvg(model, poolIndex, solved), solution: `${firstStep} ${volumeStep} ${surfaceStep}` };
    }
    if (kind === "mission-2") {
      const facts = ropeFacts(data);
      if (![facts.side, facts.height, facts.volume].every(Number.isInteger)) throw new Error("끈 고정 풀 계산 결과가 자연수가 아닙니다.");
      const model = { ...data, ...facts, level };
      const firstStep = level === 0
        ? `가에서 사용한 끈은 ${facts.cubeUsed}cm, 나에서 사용한 끈은 ${facts.cuboidUsed}cm로 주어졌습니다.`
        : level === 2
          ? `가에서 사용한 끈은 ${data.rope}-${data.cubeLeft}=${facts.cubeUsed}cm입니다. 나는 가보다 사용한 끈이 ${facts.usedDifference}cm 더 길므로 나에서 사용한 끈은 ${facts.cubeUsed}+${facts.usedDifference}=${facts.cuboidUsed}cm입니다.`
          : `가의 전체 끈에서 남은 끈을 빼면 ${data.rope}-${data.cubeLeft}=${facts.cubeUsed}cm이고, 나도 같은 방법으로 ${data.rope}-${data.cuboidLeft}=${facts.cuboidUsed}cm를 사용했습니다.`;
      const loopSteps = `가의 밑면 한 변은 ${facts.cubeUsed}÷8=${facts.side}cm입니다. 가로 둘레는 4×${facts.side}=${4 * facts.side}cm이고, 위아래 둘레는 2×${facts.side}+2×${facts.side}=${4 * facts.side}cm입니다. 나의 가로 둘레는 4×${facts.side}=${4 * facts.side}cm이고, 위아래 둘레에는 밑면 한 변 두 개와 높이 두 개가 있습니다. 따라서 나의 높이는 (${facts.cuboidUsed}-6×${facts.side})÷2=${facts.height}cm입니다.`;
      return { answer: `${num(facts.volume)}cm³`, visual: ropeSvg(model, poolIndex, solved), solution: `${firstStep} ${loopSteps} 나의 부피는 ${facts.side}×${facts.side}×${facts.height}=${num(facts.volume)}cm³입니다.` };
    }
    if (kind === "mission-5") {
      const facts = threeRopeFacts(data);
      const expected = [data.width, data.height, data.depth];
      if (facts.candidates.length !== 1 || facts.candidates[0].some((value, index) => value !== expected[index])) throw new Error("세 끈 길이에서 상자의 세 변이 하나로 정해지지 않습니다.");
      const model = { ...data, ...facts, level };
      const firstStep = level === 0
        ? `가의 끈 길이의 절반은 ${facts.ropeA}÷2=${facts.ropeA / 2}cm, 나의 끈 길이의 절반은 ${facts.ropeB}÷2=${facts.ropeB / 2}cm이고, 다의 끈 길이의 4분의 1은 ${facts.ropeC}÷4=${facts.sideSum}cm입니다.`
        : level === 2
          ? `다에서 사용한 끈은 ${facts.ropeA}+${facts.ropeB}+${facts.hardDifference}=${facts.ropeC}cm입니다. 세 방향의 끈을 모두 더한 길이는 가로, 세로, 높이의 합의 4배이므로 세 변의 합은 ${facts.ropeC}÷4=${facts.sideSum}cm입니다.`
          : `가의 끈은 세로와 높이를 각각 두 번 지나므로 세로와 높이의 합은 ${facts.ropeA}÷2=${facts.ropeA / 2}cm입니다. 나에서도 같은 방법으로 가로와 높이의 합은 ${facts.ropeB}÷2=${facts.ropeB / 2}cm입니다. 다의 세 방향 끈을 모두 더하면 가로, 세로, 높이가 각각 네 번씩 들어가므로 세 변의 합은 ${facts.ropeC}÷4=${facts.sideSum}cm입니다.`;
      const dimensions = `가로는 ${facts.sideSum}-${facts.ropeA / 2}=${data.width}cm, 세로는 ${facts.sideSum}-${facts.ropeB / 2}=${data.depth}cm이고, 높이는 ${facts.sideSum}-${data.width}-${data.depth}=${data.height}cm입니다.`;
      return { answer: `${num(facts.volume)}cm³`, visual: threeRopeSvg(model, poolIndex, solved), solution: `${firstStep} ${dimensions} 따라서 상자의 부피는 ${data.width}×${data.depth}×${data.height}=${num(facts.volume)}cm³입니다.` };
    }
    const facts = stairFacts(data);
    const model = { ...data, ...facts, level };
    const firstStep = level === 0
      ? "높이가 1층부터 5층인 다섯 부분의 앞면 칸 수가 1칸, 2칸, 3칸, 4칸, 5칸으로 주어졌습니다."
      : level === 2
        ? `전체 가로 ${5 * data.unit}cm를 5등분했으므로 한 칸은 ${5 * data.unit}÷5=${data.unit}cm입니다. 깊이는 전체 가로와 같으므로 ${facts.depth}cm입니다.`
        : "앞면을 살펴보면 높이가 1층부터 5층인 다섯 부분의 칸 수는 차례로 1칸, 2칸, 3칸, 4칸, 5칸입니다.";
    const layers = facts.layerVolumes.map((value, index) => `${index + 1}×${data.unit}×${data.unit}×${facts.depth}=${value}cm³`).join(", ");
    return { answer: `부피 ${num(facts.volume)}cm³, 겉넓이 ${num(facts.surface)}cm²`, visual: stairSvg(model, poolIndex, solved), solution: `${firstStep} 다섯 부분의 부피는 ${layers}입니다. 합하면 (1+2+3+4+5)×${data.unit}×${data.unit}×${facts.depth}=${num(facts.volume)}cm³입니다. 단면 넓이는 15×${data.unit}×${data.unit}이고, 단면의 바깥 둘레는 20칸이므로 20×${data.unit}=${20 * data.unit}cm입니다. 따라서 겉넓이는 2×15×${data.unit}×${data.unit}+20×${data.unit}×${facts.depth}=${num(facts.surface)}cm²입니다.` };
  };

  const promptFor = (kind, data, level) => {
    if (kind === "exploration") {
      const facts = explorationFacts(data);
      const condition = level === 0
        ? `가로 ${data.width}cm, 세로 ${data.height}cm인 종이의 네 모서리에서 한 변 ${data.cut}cm인 정사각형을 잘라 내고 접었습니다. 접은 뒤 상자의 밑면은 가로 ${facts.baseWidth}cm, 세로 ${facts.baseHeight}cm입니다.`
        : level === 2
          ? `둘레가 ${facts.paperPerimeter}cm이고 가로가 세로보다 ${facts.sideDifference}cm 더 긴 종이의 네 모서리에서 한 변 ${data.cut}cm인 정사각형을 잘라 내고 접었습니다. 종이의 가로와 세로를 먼저 구하세요.`
          : `가로 ${data.width}cm, 세로 ${data.height}cm인 종이의 네 모서리에서 한 변 ${data.cut}cm인 정사각형을 잘라 내고 접었습니다.`;
      return `${condition} 열린 상자에 1cm³ 정육면체는 몇 개 들어가는지 구하세요. (상자의 두께는 생각하지 않습니다.)`;
    }
    if (kind === "example-1" || kind === "mission-1") {
      const facts = factorFacts(data);
      const extra = level === 0
        ? ` 가장 짧은 변으로 가능한 길이는 ${facts.shortestCandidates.map(value => `${value}cm`).join(", ")}입니다.`
        : level === 2
          ? " 서로 다른 직육면체의 전체 가지 수와 그중 세 변의 길이가 모두 다른 경우의 수도 차례로 구하세요."
          : " 서로 다른 직육면체는 몇 가지인가요?";
      return `한 모서리의 길이가 1cm인 정육면체 ${data.cubes}개를 모두 사용하여 직육면체를 만들려고 합니다. 회전하거나 뒤집어 같은 모양이 되는 것은 한 가지로 셉니다.${extra}`;
    }
    if (kind === "example-2") {
      const facts = congruentStairFacts(data);
      const dimensions = `전체 가로 ${data.totalLength}cm, 깊이 ${data.totalDepth}cm, 높이 ${data.totalHeight}cm`;
      if (level === 0) return `모양과 크기가 같은 직육면체 ${facts.blockCount}개를 그림처럼 계단 모양으로 쌓았습니다. ${dimensions}입니다. 앞에서 본 계단의 칸 수는 높은 쪽부터 ${data.columnHeights.join("칸, ")}칸이고 깊이 방향은 ${data.depthRows}줄입니다. 이 입체도형의 겉넓이와 부피를 구하세요.`;
      if (level === 2) return `모양과 크기가 같은 직육면체를 그림처럼 계단 모양으로 쌓았습니다. ${dimensions}입니다. 사용한 직육면체의 수, 입체도형의 겉넓이와 부피를 모두 구하세요.`;
      return `오른쪽 그림은 모양과 크기가 같은 직육면체 ${facts.blockCount}개를 쌓아 만든 입체도형입니다. ${dimensions}입니다. 이 입체도형의 겉넓이와 부피를 구하세요.`;
    }
    if (kind === "mission-2") {
      const facts = ropeFacts(data);
      const condition = level === 0
        ? `가에서 실제 사용한 끈은 ${facts.cubeUsed}cm이고, 나에서 실제 사용한 끈은 ${facts.cuboidUsed}cm입니다.`
        : level === 2
          ? `각 끈의 길이는 ${data.rope}cm이고, 가에서 남은 끈은 ${data.cubeLeft}cm입니다. 나는 가보다 사용한 끈이 ${facts.usedDifference}cm 더 깁니다.`
          : `끈의 길이는 ${data.rope}cm이고, 가에서 남은 끈은 ${data.cubeLeft}cm, 나에서 남은 끈은 ${data.cuboidLeft}cm입니다.`;
      return `정육면체 상자 가와 밑면이 가와 같은 정사각형인 직육면체 상자 나를 같은 길이의 끈으로 각각 그림처럼 묶었습니다. ${condition} 나의 부피를 구하세요. (단, 매듭의 길이는 생각하지 않습니다.)`;
    }
    if (kind === "mission-5") {
      const facts = threeRopeFacts(data);
      const condition = level === 0
        ? `가의 끈은 세로와 높이의 합의 2배, 나의 끈은 가로와 높이의 합의 2배, 다의 세 방향 끈은 가로·세로·높이의 합의 4배입니다.`
        : level === 2
          ? `가와 나에서 사용한 끈은 각각 ${facts.ropeA}cm, ${facts.ropeB}cm이고, 다에서 사용한 끈은 가와 나에서 사용한 끈의 합보다 ${facts.hardDifference}cm 더 깁니다.`
          : `가, 나, 다에서 사용한 끈의 길이는 각각 ${facts.ropeA}cm, ${facts.ropeB}cm, ${facts.ropeC}cm입니다.`;
      return `같은 크기의 직육면체 모양 상자 세 개를 그림처럼 서로 다른 방향의 끈으로 둘러 묶었습니다. ${condition} 상자 한 개의 부피를 구하세요. (단, 매듭의 길이는 생각하지 않습니다.)`;
    }
    const facts = stairFacts(data);
    if (level === 0) return `한 칸이 ${data.unit}cm이고 깊이가 ${facts.depth}cm인 계단 모양 입체도형입니다. 높이가 1층부터 5층인 다섯 부분의 앞면 칸 수는 차례로 1칸, 2칸, 3칸, 4칸, 5칸입니다. 부피와 겉넓이를 구하세요.`;
    if (level === 2) return `계단 모양 입체도형의 전체 가로 ${5 * data.unit}cm를 똑같이 5등분했습니다. 한 층 높이는 한 칸의 너비와 같고, 깊이는 전체 가로와 같습니다. 부피와 겉넓이를 구하세요.`;
    return `밑면 방향 깊이가 ${facts.depth}cm인 계단 모양 입체도형입니다. 가로는 ${5 * data.unit}cm를 ${data.unit}cm씩 다섯 칸으로 나누었고, 각 부분의 높이는 ${data.unit}cm씩 1층부터 5층입니다. 부피와 겉넓이를 구하세요.`;
  };

  const helpFor = (kind, data) => kind === "exploration" ? "주어진 밑면의 두 길이와 상자 높이를 차례로 곱해 보세요."
    : kind === "example-1" || kind === "mission-1" ? "주어진 가장 짧은 변 후보마다 나머지 두 변을 빠짐없이 찾아보세요."
      : kind === "example-2" ? "앞에서 보이는 계단의 칸 수에 깊이 방향의 줄 수를 곱해 조각 수부터 확인해 보세요."
        : kind === "mission-2" ? "주어진 사용 길이에서 가의 밑면 한 변을 먼저 찾아보세요."
          : kind === "mission-5" ? "가와 나의 끈 길이는 2로, 다의 끈 길이는 4로 나누어 세 변의 합을 비교해 보세요."
          : "주어진 앞면 칸 수마다 한 칸의 너비와 깊이를 곱해 보세요.";
  const challengeFor = kind => kind === "exploration" ? "종이의 둘레와 두 길이의 차로 가로와 세로를 먼저 구해 보세요."
    : kind === "example-1" || kind === "mission-1" ? "모든 경우를 찾은 뒤 세 변의 길이가 모두 다른 경우만 다시 가려 보세요."
      : kind === "example-2" ? "문제에 조각 수가 없으므로 계단의 각 층과 깊이 줄을 그림에서 직접 세어 보세요."
        : kind === "mission-2" ? "가에서 사용한 끈을 구한 뒤, 두 상자가 사용한 끈의 차로 나의 사용 길이를 찾아보세요."
          : kind === "mission-5" ? "먼저 다에서 사용한 끈의 길이를 관계로 구하고, 세 변의 합에서 두 변의 합을 각각 빼 보세요."
          : "전체 가로를 5등분해 한 칸을 구하고, 깊이가 전체 가로와 같다는 조건을 이용하세요.";

  const kindOf = sourceItemId => {
    if (sourceItemId === ids[0]) return "exploration";
    const match = sourceItemId.match(/e2-(example|mission)-(\d+)$/);
    return match ? `${match[1]}-${match[2]}` : "";
  };
  const valuesFor = (kind, data) => {
    if (kind === "exploration") return [data.width, data.height, data.cut];
    if (kind === "example-1" || kind === "mission-1") return [data.cubes];
    if (kind === "example-2") return [data.totalLength, data.totalDepth, data.totalHeight, data.depthRows, ...data.columnHeights];
    if (kind === "mission-2") return [data.rope, data.cubeLeft, data.cuboidLeft];
    if (kind === "mission-5") return [data.width, data.height, data.depth];
    return [data.unit, 5 * data.unit];
  };
  const markInventory = () => {
    const items = window.HSE_SOURCE_INVENTORY_GRADE6?.items;
    if (Array.isArray(items)) items.filter(item => idSet.has(item.sourceItemId)).forEach(item => Object.assign(item, {
      generatorKey, reviewLocked: false, reviewReason: "", answerVisualStatus: "verified", verifiedVariantCount: 3,
      verifiedVariantProvenance: ["source-values", "source-structure-variant", "source-structure-variant"]
    }));
    const semesters = window.HSE_CURRICULUM?.semesters || [];
    semesters.flatMap(semester => semester.units || []).flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []).filter(type => idSet.has(type.sourceItemId)).forEach(type => Object.assign(type, { generatorKey, reviewLocked: false, verifiedVariantCount: 3 }));
  };

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => idSet.has(type?.sourceItemId) || type?.generatorKey === generatorKey ? generatorKey : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (!idSet.has(type?.sourceItemId) && type?.generatorKey !== generatorKey) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    const kind = kindOf(type.sourceItemId);
    if (!kind || !pools[kind]) throw new Error(`지원하지 않는 6-1 부피 E2 유형입니다: ${type.sourceItemId}`);
    const resolvedVariant = Number.isInteger(variant) ? variant : (Number.isInteger(type?.variant) ? type.variant : 0);
    const poolIndex = ((Number(resolvedVariant) || 0) % 3 + 3) % 3;
    const data = { ...pools[kind][poolIndex] };
    data.values = valuesFor(kind, data);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const problem = build(kind, data, poolIndex, false, level);
    const answer = build(kind, data, poolIndex, true, level);
    const problemPrompt = promptFor(kind, data, level);
    const help = helpFor(kind, data);
    const challengeText = challengeFor(kind);
    const evidence = `<span hidden data-source-item="${type.sourceItemId}" data-pool-index="${poolIndex}" data-values="${esc(data.values.join(","))}" data-difficulty="${level}"></span>`;
    return {
      prompt: `${problemPrompt}${support(level, help)}${challenge(level, challengeText)}${problem.visual}${evidence}`,
      answer: answer.answer,
      solution: answer.solution,
      answerVisual: `<div class="verified-answer-diagram source61-volume-e2-answer" data-answer-source="${type.sourceItemId}" data-verified-pool-index="${poolIndex}">${answer.visual}</div>`,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex,
      verifiedVariantCount: 3,
      sourceItemId: type.sourceItemId,
      generator: generatorKey,
      variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant",
      difficultyDesign: ["guided", "source", "independent-reasoning"][level]
    };
  };
  markInventory();
})();
