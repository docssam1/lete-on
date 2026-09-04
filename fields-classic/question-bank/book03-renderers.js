// 더클래식 1과정 3권 전용 시각 자료. 생성기는 수학 데이터만 만들고,
// 이 모듈은 문제 카드와 인쇄물에 같은 SVG/HTML을 그린다.

const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const cardStrip = (values) => values?.length
  ? `<div class="b3-card-strip">${values.map((value) => `<span>${esc(value)}</span>`).join("")}</div>`
  : "";

function regularPoints(sides, cx, cy, radius, rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + index * Math.PI * 2 / sides;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
}

const pointsText = (points) => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

const TANGRAM_BOARD_CELLS = Object.freeze([
  { id: 1, kind: "큰 삼각형", points: [[0,0],[4,0],[2,2]] },
  { id: 2, kind: "큰 삼각형", points: [[0,0],[2,2],[0,4]] },
  { id: 3, kind: "평행사변형", points: [[4,0],[4,2],[3,3],[3,1]] },
  { id: 4, kind: "작은 삼각형", points: [[3,1],[3,3],[2,2]] },
  { id: 5, kind: "정사각형", points: [[2,2],[3,3],[2,4],[1,3]] },
  { id: 6, kind: "작은 삼각형", points: [[1,3],[2,4],[0,4]] },
  { id: 7, kind: "중간 삼각형", points: [[4,2],[4,4],[2,4]] }
]);

const TANGRAM_COMPOSITES = Object.freeze({
  3: Object.freeze({
    outline: [[0,0],[2,0],[2,2],[0,2]],
    cells: Object.freeze([
      { id: 7, points: [[0,0],[2,0],[0,2]] },
      { id: 4, points: [[2,0],[2,2],[1,1]] },
      { id: 6, points: [[2,2],[0,2],[1,1]] }
    ])
  }),
  5: Object.freeze({
    outline: [[0,0],[2,0],[2,2],[0,2]],
    cells: Object.freeze([
      { id: 5, points: [[0,0],[1,0],[1,1],[0,1]] },
      { id: 4, points: [[1,0],[2,0],[1,1]] },
      { id: 7, points: [[2,0],[2,2],[1,1]] },
      { id: 6, points: [[0,1],[0,2],[1,2]] },
      { id: 3, points: [[0,1],[1,1],[2,2],[1,2]] }
    ])
  })
});

const clonePoints = (points) => points.map(([x, y]) => [x, y]);

export function tangramBoardGeometryForAudit() {
  return {
    outline: [[0,0],[4,0],[4,4],[0,4]],
    cells: TANGRAM_BOARD_CELLS.map((cell) => ({ ...cell, points: clonePoints(cell.points) }))
  };
}

export function tangramCompositeGeometryForAudit(pieceCount) {
  const geometry = TANGRAM_COMPOSITES[pieceCount];
  return geometry ? {
    outline: clonePoints(geometry.outline),
    cells: geometry.cells.map((cell) => ({ ...cell, points: clonePoints(cell.points) }))
  } : null;
}

function transformTangramPoints(points, size, rotation = 0, mirrored = false) {
  const center = size / 2;
  const quarterTurns = ((rotation / 90) % 4 + 4) % 4;
  return points.map(([sourceX, sourceY]) => {
    let x = sourceX - center;
    let y = sourceY - center;
    if (mirrored) x *= -1;
    for (let turn = 0; turn < quarterTurns; turn += 1) [x, y] = [-y, x];
    return [x + center, y + center];
  });
}

const mapTangramPoints = (points, x, y, scale) => points.map(([px, py]) => [x + px * scale, y + py * scale]);
const tangramCentroid = (points) => [
  points.reduce((sum, [x]) => sum + x, 0) / points.length,
  points.reduce((sum, [, y]) => sum + y, 0) / points.length
];

function tangramPieceIcon(cell, index) {
  const minX = Math.min(...cell.points.map(([x]) => x));
  const maxX = Math.max(...cell.points.map(([x]) => x));
  const minY = Math.min(...cell.points.map(([, y]) => y));
  const maxY = Math.max(...cell.points.map(([, y]) => y));
  const scale = 35 / Math.max(maxX - minX, maxY - minY);
  const centerX = 68 + index * 88;
  const centerY = 41;
  const points = cell.points.map(([x, y]) => [
    centerX + (x - (minX + maxX) / 2) * scale,
    centerY + (y - (minY + maxY) / 2) * scale
  ]);
  return `<g class="tangram-inventory-piece piece-${cell.id}"><polygon points="${pointsText(points)}"/><text x="${centerX}" y="69">${cell.id}번</text></g>`;
}

function tangramCompositionMarkup(visual) {
  const geometry = tangramCompositeGeometryForAudit(5);
  const transformed = geometry.cells.map((cell) => ({
    ...cell,
    points: transformTangramPoints(cell.points, 2, visual.rotation, visual.mirrored)
  }));
  const targetX = 178;
  const targetY = 88;
  const targetScale = 70;
  const cells = transformed.map((cell) => {
    const shown = visual.complete || visual.fixedPieceIds.includes(cell.id);
    return `<polygon class="tangram-cell piece-${cell.id}${shown ? " placed" : " hidden"}" points="${pointsText(mapTangramPoints(cell.points, targetX, targetY, targetScale))}"/>`;
  }).join("");
  const outline = mapTangramPoints(transformTangramPoints(geometry.outline, 2, visual.rotation, visual.mirrored), targetX, targetY, targetScale);
  const cornerKeys = new Set(geometry.outline.map(([x, y]) => `${x},${y}`));
  const guideSource = new Map();
  geometry.cells.forEach((cell) => cell.points.forEach(([x, y]) => {
    if (!cornerKeys.has(`${x},${y}`)) guideSource.set(`${x},${y}`, [x, y]);
  }));
  const guides = visual.complete ? "" : [...guideSource.values()].map((point) => {
    const [x, y] = mapTangramPoints(transformTangramPoints([point], 2, visual.rotation, visual.mirrored), targetX, targetY, targetScale)[0];
    return `<circle class="tangram-guide-dot" cx="${x}" cy="${y}" r="3.2"/>`;
  }).join("");
  const inventory = TANGRAM_BOARD_CELLS.filter((cell) => visual.pieceIds.includes(cell.id)).map(tangramPieceIcon).join("");
  return `<svg class="b3-svg b3-tangram-composition" viewBox="0 0 500 245" role="img" aria-label="칠교 다섯 조각으로 정사각형 완성하기"><text x="250" y="12">사용할 5조각</text><g class="tangram-inventory">${inventory}</g><text x="250" y="81">${visual.complete ? "완성 그림" : "조각 사이의 선을 그으세요"}</text><g class="tangram-target">${cells}<polygon class="tangram-target-outline" points="${pointsText(outline)}"/>${guides}</g></svg>`;
}

function tangramAreaMarkup(visual) {
  const board = tangramBoardGeometryForAudit();
  const boardX = 25;
  const boardY = 24;
  const boardScale = 36;
  const grid = Array.from({ length: 5 }, (_, index) => `<path d="M${boardX + index * boardScale} ${boardY}V${boardY + 4 * boardScale}M${boardX} ${boardY + index * boardScale}H${boardX + 4 * boardScale}"/>`).join("");
  const boardCells = board.cells.map((cell) => {
    const selected = visual.askMode === "piece" && visual.selectedPieceIds.includes(cell.id);
    const points = mapTangramPoints(cell.points, boardX, boardY, boardScale);
    const [cx, cy] = tangramCentroid(points);
    return `<g class="tangram-board-piece piece-${cell.id}${selected ? " selected" : ""}"><polygon points="${pointsText(points)}"/><text x="${cx}" y="${cy}">${cell.id}</text></g>`;
  }).join("");
  const boardMarkup = `<g class="tangram-board"><g class="tangram-grid">${grid}</g>${boardCells}<rect x="${boardX}" y="${boardY}" width="${4 * boardScale}" height="${4 * boardScale}"/></g><text x="${boardX + 2 * boardScale}" y="184">한 칸의 넓이 ${visual.unitArea}</text>`;

  let questionMarkup = `<g class="tangram-area-callout"><rect x="236" y="55" width="228" height="94" rx="6"/><text x="350" y="87">${visual.selectedPieceIds[0]}번 조각</text><text x="350" y="120">넓이 = ?</text></g>`;
  if (visual.askMode !== "piece") {
    const pieceCount = visual.selectedPieceIds.length;
    const composite = tangramCompositeGeometryForAudit(pieceCount);
    const targetX = 278;
    const targetY = 30;
    const targetScale = 72;
    const cells = composite.cells.map((cell) => {
      const transformed = transformTangramPoints(cell.points, 2, visual.rotation, visual.mirrored);
      const points = mapTangramPoints(transformed, targetX, targetY, targetScale);
      const [cx, cy] = tangramCentroid(points);
      return `<g class="tangram-composite-piece piece-${cell.id}"><polygon points="${pointsText(points)}"/><text x="${cx}" y="${cy}">${cell.id}</text></g>`;
    }).join("");
    const outline = mapTangramPoints(transformTangramPoints(composite.outline, 2, visual.rotation, visual.mirrored), targetX, targetY, targetScale);
    questionMarkup = `<g class="tangram-composite">${cells}<polygon class="tangram-composite-outline" points="${pointsText(outline)}"/></g><text x="350" y="190">${pieceCount}조각으로 만든 정사각형</text>`;
  }
  return `<svg class="b3-svg b3-tangram-area" viewBox="0 0 500 205" role="img" aria-label="4 곱하기 4 칠교판과 조각으로 만든 정사각형">${boardMarkup}<path class="tangram-arrow" d="M208 98H248"/>${questionMarkup}</svg>`;
}

function unitGridAreaMarkup(visual) {
  const unit = 30;
  const pad = 15;
  if (visual.points?.length) {
    const width = visual.width * unit;
    const height = visual.height * unit;
    const polygon = visual.points.map(([x, y]) => [pad + x * unit, pad + y * unit]);
    const vertical = Array.from({ length: visual.width + 1 }, (_, index) => `<path d="M${pad + index * unit} ${pad}V${pad + height}"/>`).join("");
    const horizontal = Array.from({ length: visual.height + 1 }, (_, index) => `<path d="M${pad} ${pad + index * unit}H${pad + width}"/>`).join("");
    return `<svg class="b3-svg b3-unit-grid" viewBox="0 0 ${width + pad * 2} ${height + pad * 2}" role="img" aria-label="온칸과 반칸으로 이어진 모눈 도형"><polygon class="source-shape" points="${pointsText(polygon)}"/><g class="grid">${vertical}${horizontal}</g><polygon class="source-outline" points="${pointsText(polygon)}"/></svg>`;
  }
  const size = visual.size * unit;
  const full = visual.fullCells.map((cell) => `<rect class="shade" x="${pad + cell.column * unit}" y="${pad + cell.row * unit}" width="${unit}" height="${unit}"/>`).join("");
  const half = visual.halfCells.map((cell) => {
    const x = pad + cell.column * unit;
    const y = pad + cell.row * unit;
    const points = cell.diagonal === "back"
      ? [[x,y],[x+unit,y],[x+unit,y+unit]]
      : [[x,y],[x+unit,y],[x,y+unit]];
    return `<polygon class="shade" points="${pointsText(points)}"/>`;
  }).join("");
  const grid = Array.from({ length: visual.size + 1 }, (_, index) => `<path d="M${pad + index * unit} ${pad}V${pad + size}M${pad} ${pad + index * unit}H${pad + size}"/>`).join("");
  return `<svg class="b3-svg b3-unit-grid" viewBox="0 0 ${size + pad * 2} ${size + pad * 2}" role="img" aria-label="온칸과 반칸으로 된 색칠한 모눈 도형">${full}${half}<g class="grid">${grid}</g></svg>`;
}

function equalFractionSourceMarkup(visual) {
  const explicit = Array.isArray(visual.shadedIndices) ? new Set(visual.shadedIndices) : null;
  const selected = (index) => explicit
    ? explicit.has(index)
    : (index - visual.rotation + visual.parts) % visual.parts < visual.shaded;
  if (visual.template === "circle-radial") {
    const cx = 110;
    const cy = 100;
    const radius = 72;
    const wedges = Array.from({ length: visual.parts }, (_, index) => {
      const start = -Math.PI / 2 + index * Math.PI * 2 / visual.parts;
      const end = -Math.PI / 2 + (index + 1) * Math.PI * 2 / visual.parts;
      const large = end - start > Math.PI ? 1 : 0;
      const x1 = cx + Math.cos(start) * radius;
      const y1 = cy + Math.sin(start) * radius;
      const x2 = cx + Math.cos(end) * radius;
      const y2 = cy + Math.sin(end) * radius;
      return `<path class="fraction-cell${selected(index) ? " shade" : ""}" d="M${cx} ${cy}L${x1} ${y1}A${radius} ${radius} 0 ${large} 1 ${x2} ${y2}Z"/>`;
    }).join("");
    return `<svg class="b3-svg b3-source-fraction" viewBox="0 0 220 200" role="img" aria-label="원을 같은 크기로 나눈 분수 그림">${wedges}<circle class="fraction-outline" cx="${cx}" cy="${cy}" r="${radius}"/></svg>`;
  }

  if (visual.template === "triangle-grid") {
    const order = Math.round(Math.sqrt(visual.parts));
    const top = [110, 20];
    const left = [28, 172];
    const right = [192, 172];
    const rowPoint = (row, column) => {
      if (row === 0) return top;
      const ratio = row / order;
      const rowLeft = [top[0] + (left[0] - top[0]) * ratio, top[1] + (left[1] - top[1]) * ratio];
      const rowRight = [top[0] + (right[0] - top[0]) * ratio, top[1] + (right[1] - top[1]) * ratio];
      return [rowLeft[0] + (rowRight[0] - rowLeft[0]) * column / row, rowLeft[1]];
    };
    const cells = [];
    for (let row = 0; row < order; row += 1) {
      for (let column = 0; column <= row; column += 1) {
        cells.push([rowPoint(row, column), rowPoint(row + 1, column), rowPoint(row + 1, column + 1)]);
      }
      for (let column = 0; column < row; column += 1) {
        cells.push([rowPoint(row, column), rowPoint(row + 1, column + 1), rowPoint(row, column + 1)]);
      }
    }
    const polygons = cells.map((cell, index) => `<polygon class="fraction-cell${selected(index) ? " shade" : ""}" points="${pointsText(cell)}"/>`).join("");
    return `<svg class="b3-svg b3-source-fraction" viewBox="0 0 220 195" role="img" aria-label="큰 삼각형을 같은 크기의 작은 삼각형으로 나눈 분수 그림">${polygons}<polygon class="fraction-outline" points="${pointsText([top,left,right])}"/></svg>`;
  }

  const outline = regularPoints(6, 110, 100, 72, -Math.PI / 2);
  const boundary = visual.parts === 6
    ? outline
    : outline.flatMap((point, index) => {
        const next = outline[(index + 1) % outline.length];
        return [point, [(point[0] + next[0]) / 2, (point[1] + next[1]) / 2]];
      });
  const wedges = boundary.map((point, index) => {
    const next = boundary[(index + 1) % boundary.length];
    return `<polygon class="fraction-cell${selected(index) ? " shade" : ""}" points="110,100 ${point[0]},${point[1]} ${next[0]},${next[1]}"/>`;
  }).join("");
  return `<svg class="b3-svg b3-source-fraction" viewBox="0 0 220 200" role="img" aria-label="정육각형을 같은 크기로 나눈 분수 그림">${wedges}<polygon class="fraction-outline" points="${pointsText(outline)}"/></svg>`;
}

function shapeAreaGrowthMarkup(visual) {
  const shownCount = Math.min(visual.count, 5);
  const figures = Array.from({ length: shownCount }, (_, index) => {
    const side = visual.start + index;
    const x = 52 + index * 88;
    const dimension = 12 + side * 7;
    const y = 105 - dimension;
    const shapeSides = { triangle: 3, pentagon: 5, hexagon: 6 }[visual.shape];
    const body = visual.shape === "square"
      ? `<rect x="${x - dimension / 2}" y="${y}" width="${dimension}" height="${dimension}"/>`
      : `<polygon points="${pointsText(regularPoints(shapeSides, x, 105 - dimension / 2, dimension / 2, -Math.PI / 2))}"/>`;
    return `<g>${body}<text x="${x}" y="126">${index + 1}번째</text><text x="${x}" y="141">넓이 ${side * side}</text></g>`;
  }).join("");
  return `<svg class="b3-svg b3-growth" viewBox="0 0 470 155" role="img" aria-label="차례로 커지는 도형의 넓이">${figures}</svg>`;
}

function nestedSquareMarkup(visual) {
  if (visual.sourceVariant === "diamond-outer") {
    const outer = [[100,18],[166,84],[100,150],[34,84]];
    const inner = [[100,51],[133,84],[100,117],[67,84]];
    return `<svg class="b3-svg b3-nested-square b3-source-nested" viewBox="0 0 300 175" role="img" aria-label="안쪽 파란 마름모의 넓이로 바깥 주황 마름모의 넓이 구하기"><polygon class="source-target" points="${pointsText(outer)}"/><polygon class="source-given" points="${pointsText(inner)}"/><text x="215" y="67">파랑 ${visual.givenArea}</text><text x="215" y="94">주황 ?</text></svg>`;
  }
  if (visual.sourceVariant === "square-diamond") {
    const diamond = [[100,48],[136,84],[100,120],[64,84]];
    return `<svg class="b3-svg b3-nested-square b3-source-nested" viewBox="0 0 300 175" role="img" aria-label="바깥 파란 정사각형의 넓이로 안쪽 주황 마름모의 넓이 구하기"><rect class="source-given" x="28" y="12" width="144" height="144"/><polygon class="source-target" points="${pointsText(diamond)}"/><text x="215" y="67">파랑 ${visual.givenArea}</text><text x="215" y="94">주황 ?</text></svg>`;
  }
  const max = Math.max(...visual.sides);
  const rects = visual.sides.map((side) => {
    const dimension = 145 * side / max;
    return `<rect x="${100 - dimension / 2}" y="${90 - dimension / 2}" width="${dimension}" height="${dimension}"/>`;
  }).join("");
  return `<svg class="b3-svg b3-nested-square" viewBox="0 0 310 185" role="img" aria-label="겹쳐 커지는 정사각형">${rects}<text x="225" y="52">한 칸=${visual.unitArea}</text><text x="225" y="75">…</text><text x="225" y="99">${visual.target}번째</text><text x="225" y="123">${visual.askSum ? "넓이의 합" : "바깥 넓이"} ?</text></svg>`;
}

const midpoint = (first, second) => [(first[0] + second[0]) / 2, (first[1] + second[1]) / 2];
const centroid = (points) => [
  points.reduce((sum, point) => sum + point[0], 0) / points.length,
  points.reduce((sum, point) => sum + point[1], 0) / points.length
];

function splitTriangleByMedian(triangle) {
  const middle = midpoint(triangle[1], triangle[2]);
  return [
    [triangle[0], triangle[1], middle],
    [triangle[0], middle, triangle[2]]
  ];
}

function splitTriangleByCentroid(triangle) {
  const center = centroid(triangle);
  return [
    [center, triangle[0], triangle[1]],
    [center, triangle[1], triangle[2]],
    [center, triangle[2], triangle[0]]
  ];
}

function sourcePartitionGeometry(template) {
  const top = [110, 172 - 164 * Math.sqrt(3) / 2];
  const left = [28, 172];
  const right = [192, 172];
  const center = centroid([top, left, right]);
  const leftMiddle = midpoint(top, left);
  const rightMiddle = midpoint(top, right);
  const baseMiddle = midpoint(left, right);
  const triangleOutline = [top, left, right];
  const triangleFour = [
    [top, leftMiddle, rightMiddle],
    [leftMiddle, left, baseMiddle],
    [rightMiddle, baseMiddle, right],
    [leftMiddle, rightMiddle, baseMiddle]
  ];

  if (template === "triangle-3") {
    return {
      outline: triangleOutline,
      cells: [[top, left, center], [left, right, center], [right, top, center]],
      segments: [[top, center], [left, center], [right, center]],
      guideDots: [center]
    };
  }
  if (template === "triangle-4") {
    return {
      outline: triangleOutline,
      cells: triangleFour,
      segments: [[leftMiddle, rightMiddle], [leftMiddle, baseMiddle], [rightMiddle, baseMiddle]],
      guideDots: [leftMiddle, rightMiddle, baseMiddle]
    };
  }
  if (template === "triangle-6") {
    const boundary = [top, rightMiddle, right, baseMiddle, left, leftMiddle];
    return {
      outline: triangleOutline,
      cells: boundary.map((point, index) => [center, point, boundary[(index + 1) % boundary.length]]),
      segments: boundary.map((point) => [center, point]),
      guideDots: [center, leftMiddle, rightMiddle, baseMiddle]
    };
  }
  if (template === "triangle-8") {
    return {
      outline: triangleOutline,
      cells: triangleFour.flatMap(splitTriangleByMedian),
      segments: [
        [leftMiddle, rightMiddle], [leftMiddle, baseMiddle], [rightMiddle, baseMiddle],
        ...triangleFour.map((triangle) => [triangle[0], midpoint(triangle[1], triangle[2])])
      ],
      guideDots: [center, leftMiddle, rightMiddle, baseMiddle]
    };
  }
  if (template === "triangle-12") {
    return {
      outline: triangleOutline,
      cells: triangleFour.flatMap(splitTriangleByCentroid),
      segments: [
        [leftMiddle, rightMiddle], [leftMiddle, baseMiddle], [rightMiddle, baseMiddle],
        ...triangleFour.flatMap((triangle) => {
          const cellCenter = centroid(triangle);
          return triangle.map((point) => [cellCenter, point]);
        })
      ],
      guideDots: []
    };
  }

  const hexCenter = [110, 98];
  const outline = regularPoints(6, hexCenter[0], hexCenter[1], 76, -Math.PI / 2);
  if (template === "hexagon-12") {
    const boundary = outline.flatMap((point, index) => [point, midpoint(point, outline[(index + 1) % outline.length])]);
    return {
      outline,
      cells: boundary.map((point, index) => [hexCenter, point, boundary[(index + 1) % boundary.length]]),
      segments: boundary.map((point) => [hexCenter, point]),
      guideDots: []
    };
  }

  const sectors = outline.map((point, index) => [hexCenter, point, outline[(index + 1) % outline.length]]);
  return {
    outline,
    cells: sectors.flatMap(splitTriangleByCentroid),
    segments: [
      ...outline.map((point) => [hexCenter, point]),
      ...sectors.flatMap((triangle) => {
        const cellCenter = centroid(triangle);
        return triangle.map((point) => [cellCenter, point]);
      })
    ],
    guideDots: []
  };
}

export function partitionGeometryForAudit(template) {
  return sourcePartitionGeometry(template);
}

function sourcePartitionMarkup(visual) {
  const geometry = sourcePartitionGeometry(visual.template);
  const explicit = Array.isArray(visual.shadedIndices) ? new Set(visual.shadedIndices) : null;
  const selected = (index) => explicit
    ? explicit.has(index)
    : (index - visual.rotation + visual.parts) % visual.parts < visual.shaded;
  const cells = geometry.cells.map((cell, index) => `<polygon class="partition-cell${selected(index) ? " shade" : ""}" points="${pointsText(cell)}"/>`).join("");
  const orderedSegments = geometry.segments.map((segment, index) => geometry.segments[(index + (visual.lineShift || 0)) % geometry.segments.length]);
  const visibleSegments = visual.complete ? geometry.segments : orderedSegments.slice(0, visual.visibleLines || 0);
  const lines = visibleSegments.map(([from, to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");
  const dots = visual.complete ? "" : geometry.guideDots.map(([x, y]) => `<circle class="guide-dot" cx="${x}" cy="${y}" r="2.8"/>`).join("");
  const target = visual.targetParts ? `<text class="partition-target" x="236" y="92">${visual.targetParts}조각</text><text class="partition-target" x="236" y="112">으로 나누기</text>` : "";
  const showCells = visual.complete || visual.subtype === "incomplete-partition-source";
  const shapeLabel = visual.shape === "hexagon" ? "정육각형" : "정삼각형";
  return `<svg class="b3-svg b3-source-partition" viewBox="0 0 ${visual.targetParts ? 310 : 220} 195" role="img" aria-label="같은 모양과 크기의 조각으로 나눈 ${shapeLabel}">${showCells ? cells : ""}<polygon class="partition-outline" points="${pointsText(geometry.outline)}"/><g class="partition-lines">${lines}</g>${dots}${target}</svg>`;
}

function pairedSourceFractionsMarkup(visual) {
  const labels = ["왼쪽", "오른쪽"];
  return `<div class="b3-paired-fractions">${visual.items.map((item, index) => `<figure>${sourcePartitionMarkup({ ...item, subtype: "equal-partition-source" })}<figcaption>${labels[index]}</figcaption><div class="b3-fraction-answer" aria-label="${labels[index]} 분수 답칸"><span></span><i></i><span></span></div></figure>`).join("")}</div>`;
}

function exactWideHexagonLeftMarkup() {
  const vertices = [[110, 14], [204, 50], [204, 130], [110, 166], [16, 130], [16, 50]];
  const [top, upperRight, lowerRight, bottom, lowerLeft, upperLeft] = vertices;
  const center = [110, 90];
  const leftCross = [64.2, 70.5];
  const rightCross = [155.8, 70.5];
  const polygons = [
    [top, rightCross, center],
    [lowerLeft, leftCross, center]
  ].map((cell) => `<polygon class="partition-cell shade" points="${pointsText(cell)}"/>`).join("");
  const lines = [
    [top, bottom],
    [top, lowerLeft],
    [top, lowerRight],
    [upperLeft, lowerRight],
    [lowerLeft, upperRight],
    [lowerLeft, lowerRight]
  ]
    .map(([from, to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");
  return `<svg class="b3-svg b3-source-partition b3-source-exact" viewBox="0 0 220 180" role="img" aria-label="원본과 같은 납작한 정육각형 12부분 분할, 두 부분 색칠">${polygons}<polygon class="partition-outline" points="${pointsText(vertices)}"/><g class="partition-lines">${lines}</g></svg>`;
}

function exactWideHexagonRightMarkup() {
  const vertices = [[110, 14], [204, 50], [204, 130], [110, 166], [16, 130], [16, 50]];
  const center = [110, 90];
  const cells = [];
  vertices.forEach((point, index) => {
    const next = vertices[(index + 1) % vertices.length];
    const edgeMiddle = midpoint(point, next);
    const inner = [center[0] + (edgeMiddle[0] - center[0]) * 0.54, center[1] + (edgeMiddle[1] - center[1]) * 0.54];
    cells.push([point, next, inner], [point, inner, center], [next, center, inner]);
  });
  const shaded = new Set([0, 3, 6, 9, 12, 15]);
  const polygons = cells.map((cell, index) => `<polygon class="partition-cell${shaded.has(index) ? " shade" : ""}" points="${pointsText(cell)}"/>`).join("");
  const segmentIndex = new Map();
  cells.flatMap((cell) => cell.map((point, index) => [point, cell[(index + 1) % cell.length]])).forEach((segment) => {
    const pointKeys = segment.map((point) => point.map((value) => Number(value).toFixed(2)).join(",")).sort();
    segmentIndex.set(pointKeys.join("|"), segment);
  });
  const lines = [...segmentIndex.values()]
    .map(([from, to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");
  return `<svg class="b3-svg b3-source-partition b3-source-exact" viewBox="0 0 220 180" role="img" aria-label="원본과 같은 납작한 정육각형 18부분 분할, 여섯 부분 색칠">${polygons}<polygon class="partition-outline" points="${pointsText(vertices)}"/><g class="partition-lines">${lines}</g></svg>`;
}

function pairedSourceFractionsExactMarkup() {
  const diagrams = [exactWideHexagonLeftMarkup(), exactWideHexagonRightMarkup()];
  const labels = ["왼쪽", "오른쪽"];
  return `<div class="b3-paired-fractions">${diagrams.map((diagram, index) => `<figure>${diagram}<figcaption>${labels[index]}</figcaption><div class="b3-fraction-answer" aria-label="${labels[index]} 분수 답칸"><span></span><i></i><span></span></div></figure>`).join("")}</div>`;
}

function triangleTwelveFractionExactMarkup() {
  const top = [110, 12];
  const left = [10, 180];
  const right = [210, 180];
  const leftShoulder = [62, 88];
  const rightShoulder = [158, 88];
  const topInner = [110, 55];
  const bottomCenter = [110, 180];
  const rightInner = [158, 132];
  const shaded = [
    [topInner, leftShoulder, rightShoulder],
    [left, leftShoulder, bottomCenter],
    [rightShoulder, rightInner, right]
  ];
  const fills = shaded.map((cell) => `<polygon class="partition-cell shade" points="${pointsText(cell)}"/>`).join("");
  const segments = [
    [top, topInner], [topInner, leftShoulder], [topInner, rightShoulder], [leftShoulder, rightShoulder],
    [leftShoulder, bottomCenter], [rightShoulder, bottomCenter], [rightShoulder, rightInner],
    [rightInner, bottomCenter], [rightInner, right]
  ];
  const lines = segments.map(([from, to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");
  return `<div class="b3-concentric-fraction"><svg class="b3-svg b3-source-partition b3-source-exact" viewBox="0 0 220 195" role="img" aria-label="원본과 같은 큰 정삼각형 12조각 분할, 넓이 다섯 조각만큼 색칠">${fills}<polygon class="partition-outline" points="${pointsText([top, left, right])}"/><g class="partition-lines">${lines}</g></svg><div class="b3-fraction-answer" aria-label="분수 답칸"><span></span><i></i><span></span></div></div>`;
}

function concentricSquareSixteenMarkup(visual) {
  const outer = { left: 24, top: 14, right: 196, bottom: 186 };
  const inner = { left: 67, top: 57, right: 153, bottom: 143 };
  const center = [110, 100];
  const cells = [
    [[inner.left, inner.top], [inner.right, inner.top], center],
    [[inner.right, inner.top], [inner.right, inner.bottom], center],
    [[inner.right, inner.bottom], [inner.left, inner.bottom], center],
    [[inner.left, inner.bottom], [inner.left, inner.top], center]
  ];
  const explicit = Array.isArray(visual.shadedIndices) ? new Set(visual.shadedIndices) : null;
  const selected = (index) => explicit ? explicit.has(index) : (index - visual.rotation + cells.length) % cells.length < visual.shaded;
  const shading = cells.map((cell, index) => `<polygon class="concentric-cell${selected(index) ? " shade" : ""}" points="${pointsText(cell)}"/>`).join("");
  return `<div class="b3-concentric-fraction"><svg class="b3-svg b3-concentric-square" viewBox="0 0 220 200" role="img" aria-label="정사각형 안의 작은 정사각형과 두 대각선으로 나눈 16조각">${shading}<rect class="outer-square" x="${outer.left}" y="${outer.top}" width="${outer.right - outer.left}" height="${outer.bottom - outer.top}"/><rect class="inner-square" x="${inner.left}" y="${inner.top}" width="${inner.right - inner.left}" height="${inner.bottom - inner.top}"/><line x1="${outer.left}" y1="${outer.top}" x2="${outer.right}" y2="${outer.bottom}"/><line x1="${outer.right}" y1="${outer.top}" x2="${outer.left}" y2="${outer.bottom}"/></svg><div class="b3-fraction-answer" aria-label="분수 답칸"><span></span><i></i><span></span></div></div>`;
}

function fractionShapeMarkup(visual) {
  const sideCount = visual.shape === "triangle" ? 3 : visual.shape === "hexagon" ? 6 : 4;
  const vertices = regularPoints(sideCount, 120, 95, 72, visual.shape === "square" ? -Math.PI / 4 : -Math.PI / 2);
  const boundary = [];
  const perSide = visual.parts / sideCount;
  vertices.forEach((point, sideIndex) => {
    const next = vertices[(sideIndex + 1) % sideCount];
    for (let part = 0; part < perSide; part += 1) {
      const ratio = part / perSide;
      boundary.push([point[0] + (next[0] - point[0]) * ratio, point[1] + (next[1] - point[1]) * ratio]);
    }
  });
  const wedges = boundary.map((point, index) => {
    const next = boundary[(index + 1) % boundary.length];
    const shifted = (index - visual.rotation + visual.parts) % visual.parts;
    return `<polygon class="${shifted < visual.shaded ? "shade" : ""}" points="120,95 ${point[0]},${point[1]} ${next[0]},${next[1]}"/>`;
  }).join("");
  const lines = boundary.slice(0, visual.visibleLines).map(([x, y]) => `<line x1="120" y1="95" x2="${x}" y2="${y}"/>`).join("");
  const target = visual.targetParts ? `<text x="235" y="92">${visual.targetParts}조각</text><text x="235" y="111">으로 나누기</text>` : "";
  return `<svg class="b3-svg b3-fraction-shape" viewBox="0 0 310 190" role="img" aria-label="같은 크기의 조각으로 나눈 도형">${wedges}<polygon class="outline" points="${pointsText(vertices)}"/>${lines}${target}</svg>`;
}

function obliqueSquareMarkup(visual) {
  const grid = Array.from({ length: 13 }, (_, index) => `<path d="M${20 + index * 20} 10V250M10 ${20 + index * 20}H270"/>`).join("");
  const polygons = visual.squares.map(({ dx, dy, offsetX, offsetY }) => {
    const x = 38 + offsetX * 20;
    const y = 200 - offsetY * 20;
    const points = [[x,y],[x+dx*20,y-dy*20],[x+(dx+dy)*20,y+(dx-dy)*20],[x+dy*20,y+dx*20]];
    return `<polygon points="${pointsText(points)}"/>`;
  }).join("");
  return `<svg class="b3-svg b3-oblique" viewBox="0 0 280 260" role="img" aria-label="모눈 위 기울어진 정사각형"><g class="grid">${grid}</g>${polygons}</svg>`;
}

function gridPathMarkup(visual) {
  const xs = visual.points.map((point) => point.x);
  const ys = visual.points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const shifted = visual.points.map((point) => [40 + (point.x - minX) * 24, 35 + (point.y - minY) * 24]);
  const maxX = Math.max(...shifted.map((point) => point[0])) + 40;
  const maxY = Math.max(...shifted.map((point) => point[1])) + 40;
  const vLines = Array.from({ length: Math.ceil(maxX / 24) + 1 }, (_, index) => `<path d="M${index * 24} 0V${maxY}"/>`).join("");
  const hLines = Array.from({ length: Math.ceil(maxY / 24) + 1 }, (_, index) => `<path d="M0 ${index * 24}H${maxX}"/>`).join("");
  return `<svg class="b3-svg b3-grid-path" viewBox="0 0 ${maxX} ${maxY}" role="img" aria-label="모눈 위에 접혀 있는 색테이프"><g class="grid">${vLines}${hLines}</g><polyline points="${pointsText(shifted)}"/></svg>`;
}

function numberLineMarkup(visual) {
  const ticks = Array.from({ length: visual.divisions + 1 }, (_, index) => {
    const x = 35 + index * 300 / visual.divisions;
    const label = index === 0 ? visual.left : index === visual.divisions ? visual.right : visual.target === "middle" && index * 2 === visual.divisions ? "㉠" : "";
    return `<line x1="${x}" y1="67" x2="${x}" y2="87"/><text x="${x}" y="112">${label}</text>`;
  }).join("");
  return `<svg class="b3-svg b3-number-line" viewBox="0 0 370 130" role="img" aria-label="똑같은 간격으로 나눈 수직선"><line x1="35" y1="77" x2="335" y2="77"/>${ticks}<text x="185" y="28">${visual.target === "interval" ? "한 칸 = ?" : "중간수 = ?"}</text></svg>`;
}

function segmentChainMarkup(visual) {
  const xs = [45, 145, 245, 345];
  const labels = visual.labels.map((label, index) => `<circle cx="${xs[index]}" cy="90" r="5"/><text x="${xs[index]}" y="119">${label}</text>`).join("");
  const arc = (from, to, y, text) => text == null || text === "" || text === "?" ? "" : `<path d="M${xs[from]} 82Q${(xs[from] + xs[to]) / 2} ${y} ${xs[to]} 82"/><text x="${(xs[from] + xs[to]) / 2}" y="${y + 5}">${text}cm</text>`;
  const givens = visual.givens || {};
  return `<svg class="b3-svg b3-segment-chain" viewBox="0 0 390 150" role="img" aria-label="A B C D 사이의 겹친 거리"><line x1="45" y1="90" x2="345" y2="90"/>${labels}${arc(0,3,6,givens.AD)}${arc(0,2,27,givens.AC)}${arc(1,3,47,givens.BD)}${arc(1,2,67,givens.BC)}<text x="195" y="142">${visual.target} = ?</text></svg>`;
}

function slideEightFractionMarkup(visual) {
  const cellMarkup = (cells, shadedIndices) => {
    const shaded = new Set(shadedIndices);
    return cells.map((cell, index) => `<polygon class="partition-cell${shaded.has(index) ? " shade" : ""}" points="${pointsText(cell)}"/>`).join("");
  };
  const segmentMarkup = (segments) => segments.map(([from, to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");

  const left = 20;
  const top = 10;
  const right = 200;
  const bottom = 190;
  const middleX = (left + right) / 2;
  const middleY = (top + bottom) / 2;
  const outline = [[left, top], [right, top], [right, bottom], [left, bottom]];

  if (visual.template === "square-eight") {
    const center = [middleX, middleY];
    const topMiddle = [middleX, top];
    const rightMiddle = [right, middleY];
    const bottomMiddle = [middleX, bottom];
    const leftMiddle = [left, middleY];
    const cells = [
      [[left, top], topMiddle, center], [[left, top], center, leftMiddle],
      [topMiddle, [right, top], center], [[right, top], rightMiddle, center],
      [rightMiddle, [right, bottom], center], [[right, bottom], bottomMiddle, center],
      [bottomMiddle, [left, bottom], center], [[left, bottom], leftMiddle, center]
    ];
    const segments = [
      [topMiddle, bottomMiddle], [leftMiddle, rightMiddle],
      [[left, top], center], [[right, top], center], [[right, bottom], center], [[left, bottom], center]
    ];
    return `<svg class="b3-svg b3-source-partition b3-slide8-fraction" viewBox="0 0 220 200" role="img" aria-label="정사각형을 같은 크기의 여덟 삼각형으로 나눈 원본 구조">${cellMarkup(cells, [1, 2, 5])}<polygon class="partition-outline" points="${pointsText(outline)}"/><g class="partition-lines">${segmentMarkup(segments)}</g></svg>`;
  }

  if (visual.template !== "square-sixteen") return "";
  const quadrants = [
    [left, top, middleX, middleY], [middleX, top, right, middleY],
    [left, middleY, middleX, bottom], [middleX, middleY, right, bottom]
  ];
  const cells = quadrants.flatMap(([x1, y1, x2, y2]) => {
    const center = [(x1 + x2) / 2, (y1 + y2) / 2];
    return [
      [[x1, y1], [x2, y1], center], [[x2, y1], [x2, y2], center],
      [[x2, y2], [x1, y2], center], [[x1, y2], [x1, y1], center]
    ];
  });
  const segments = [
    [[middleX, top], [middleX, bottom]], [[left, middleY], [right, middleY]],
    ...quadrants.flatMap(([x1, y1, x2, y2]) => {
      const center = [(x1 + x2) / 2, (y1 + y2) / 2];
      return [[[x1, y1], center], [[x2, y1], center], [[x2, y2], center], [[x1, y2], center]];
    })
  ];
  return `<svg class="b3-svg b3-source-partition b3-slide8-fraction" viewBox="0 0 220 200" role="img" aria-label="정사각형을 같은 크기의 열여섯 삼각형으로 나눈 원본 구조">${cellMarkup(cells, [1, 3, 5, 11, 13, 15])}<polygon class="partition-outline" points="${pointsText(outline)}"/><g class="partition-lines">${segmentMarkup(segments)}</g></svg>`;
}

function overlappingRodsMarkup(visual) {
  const cell = 34;
  const left = 22;
  const totalUnits = visual.offsetUnits + visual.segmentUnits * 2;
  const width = left * 2 + totalUnits * cell;
  const topEnd = left + visual.firstUnits * cell;
  const bottomStart = left + visual.offsetUnits * cell;
  const bottomMiddle = bottomStart + visual.segmentUnits * cell;
  const bottomEnd = bottomMiddle + visual.segmentUnits * cell;
  const ticks = Array.from({ length: totalUnits + 1 }, (_, index) => {
    const x = left + index * cell;
    return `<line class="ruler-tick" x1="${x}" y1="64" x2="${x}" y2="76"/>`;
  }).join("");
  return `<svg class="b3-svg b3-overlapping-rods" viewBox="0 0 ${width} 150" role="img" aria-label="공통 눈금 위에 어긋나게 놓인 막대 ㉠, ㉡, ㉢"><line class="ruler" x1="${left}" y1="70" x2="${bottomEnd}" y2="70"/>${ticks}<rect x="${left}" y="25" width="${visual.firstUnits * cell}" height="30"/><text x="${(left + topEnd) / 2}" y="45">㉠ = ${visual.first}cm</text><rect x="${bottomStart}" y="88" width="${visual.segmentUnits * cell}" height="30"/><rect x="${bottomMiddle}" y="88" width="${visual.segmentUnits * cell}" height="30"/><text x="${(bottomStart + bottomMiddle) / 2}" y="108">㉡</text><text x="${(bottomMiddle + bottomEnd) / 2}" y="108">㉢</text><g class="guide"><line x1="${left}" y1="18" x2="${left}" y2="128"/><line x1="${bottomMiddle}" y1="18" x2="${bottomMiddle}" y2="128"/><line x1="${bottomEnd}" y1="18" x2="${bottomEnd}" y2="128"/></g></svg>`;
}

function simpleBook3Markup(visual) {
  if (visual.subtype === "step-ratio") return `<div class="b3-simple"><div class="b3-step-row"><span>아이</span><b>👣</b><em>${visual.personSteps}걸음</em></div><div class="b3-step-row dog"><span>강아지</span><b>${"·".repeat(Math.min(visual.ratio, 7))}</b><em>아이 한 걸음마다 ${visual.ratio}걸음</em></div></div>`;
  if (visual.subtype === "route-multiple") return `<div class="b3-route"><span>집</span><i style="--weight:${visual.first}">${visual.first}분</i><span>도서관</span><i style="--weight:${visual.second}">?</i><span>학교</span><strong>전체 ${visual.whole}분</strong></div>`;
  if (visual.subtype === "rods") {
    const maxUnits = Math.max(...visual.rows.map((row) => row.units));
    return `<div class="b3-rods" style="--max-units:${maxUnits}">${visual.rows.map((row) => `<div><b>${row.label}</b><span style="--units:${row.units}">${Array.from({length:row.units},()=>"<i></i>").join("")}</span>${visual.given?.label === row.label ? `<em>1개 ${visual.given.value}cm</em>` : ""}</div>`).join("")}${visual.total ? `<strong>전체 ${visual.total}cm</strong>` : ""}</div>`;
  }
  if (visual.subtype === "rod-comparison-total") {
    const cells = (count) => Array.from({ length: count }, () => "<i></i>").join("");
    return `<div class="b3-rod-comparison" style="--ratio:${visual.ratio}"><div><b>㉠</b><span class="first">${cells(1)}</span></div><div><b>㉡</b><span class="second">${cells(visual.ratio)}</span><em>㉠의 ${visual.ratio}배</em></div><strong>㉠ + ㉡ = ${visual.total}cm</strong></div>`;
  }
  if (visual.subtype === "object-measure") return `<div class="b3-object-measure"><strong>${visual.total}cm</strong>${visual.rows.map((row) => `<div><b>${row.icon}</b><span>${Array.from({length:row.count},()=>`<i>${row.icon === "성냥" ? "┃" : "▭"}</i>`).join("")}</span><em>${row.count}개</em></div>`).join("")}</div>`;
  if (visual.subtype === "object-equation") return `<div class="b3-object-equation"><span>${visual.left.map((item) => `${item.icon} × ${item.count}`).join(" + ")}</span><b>=</b><span>${visual.right.map((item) => `${item.icon} × ${item.count}`).join(" + ")}</span><small>성냥 1개 ${visual.match}cm · ${visual.givenTarget === "log" ? "통나무" : "연필"} 1개 ${visual.givenValue}cm</small></div>`;
  if (visual.subtype === "object-count-equivalence") return `<div class="b3-object-count"><div><b>리코더 1개</b><span>= 연필 ${visual.pencils}자루 + 성냥개비 ${visual.matches}개</span></div><div><b>연필 1자루</b><span>= 성냥개비 ${visual.pencilInMatches}개</span></div><strong>리코더 1개 = 성냥개비 ?개</strong></div>`;
  if (visual.subtype === "meeting-distance") {
    const meetingPercent = visual.faster / visual.total * 100;
    return `<div class="b3-meeting"><span>집 A</span><i style="--meet:${meetingPercent}%"><b style="width:${meetingPercent}%"></b><em>만난 곳</em></i><span>집 B</span><strong>전체 ${visual.total}m · 거리비 ${visual.ratio}:1</strong></div>`;
  }
  if (visual.subtype === "difference-unit") return `<div class="b3-difference-unit"><div><b>연필</b><span>${Array.from({length:visual.firstCount},()=>`<i style="--part:${visual.firstLength}"></i>`).join("")}</span><em>㉠ ${visual.firstCount}번</em></div><div><b>연필</b><span>${Array.from({length:visual.secondCount},()=>`<i style="--part:${visual.secondLength}"></i>`).join("")}</span><em>㉡ ${visual.secondCount}번</em></div><div class="difference"><b>㉢</b><span><i style="--part:${visual.difference}"></i></span><em>㉠ - ㉡</em></div><strong>세 그림은 같은 길이 눈금으로 나타냈습니다.</strong></div>`;
  return "";
}

function mixedIntervalMarkup(visual) {
  const totalDivisions = visual.leftDivisions + visual.rightDivisions;
  const ticks = Array.from({ length: totalDivisions + 1 }, (_, index) => {
    const x = 35 + index * 320 / totalDivisions;
    let label = "";
    if (index === 0) label = visual.leftStart;
    if (index === visual.leftDivisions) label = visual.join;
    if (index === totalDivisions) label = visual.rightEnd;
    if (index === visual.leftIndex) label = "㉠";
    if (index === visual.leftDivisions + visual.rightIndex) label = "㉡";
    return `<line x1="${x}" y1="65" x2="${x}" y2="84"/><text x="${x}" y="108">${label}</text>`;
  }).join("");
  return `<svg class="b3-svg b3-number-line" viewBox="0 0 390 125" role="img" aria-label="간격이 다른 두 수직선 구간"><line x1="35" y1="75" x2="355" y2="75"/>${ticks}</svg>`;
}

function equationChainMarkup(visual) {
  return `<div class="b3-equation-chain">${visual.rows.map((row) => `<div>${row.left.map((value) => `<span>${esc(value)}</span>`).join("<b>+</b>")}<b>=</b><strong>${esc(row.result)}</strong></div>`).join("")}</div>`;
}

function binaryWeightMarkup(visual) {
  return `<div class="b3-binary"><div>${visual.weights.map((weight) => `<span><b>${weight}</b><small>g</small></span>`).join("")}</div><strong>목표 ${visual.target}g</strong></div>`;
}

function cellCodeMarkup(visual) {
  const grid = (colored, compact = false) => `<span class="b3-cell-code-grid${compact ? " compact" : ""}" style="--rows:${visual.rows};--columns:${visual.columns}">${visual.weights.map((weight, index) => `<i class="${colored.includes(index) ? "colored" : ""}">${visual.showWeights && !compact ? weight : ""}</i>`).join("")}</span>`;
  const examples = visual.examples?.length
    ? `<div class="b3-cell-code-examples">${visual.examples.map((example) => `<span>${grid(example.colored, true)}<b>${example.value}</b></span>`).join("")}</div>`
    : "";
  const question = visual.mode === "color"
    ? `<div class="b3-cell-code-question"><strong>${visual.target}</strong><b>가 되게 색칠</b>${grid(visual.colored)}</div>`
    : `<div class="b3-cell-code-question">${grid(visual.colored)}<strong>= ?</strong></div>`;
  return `<div class="b3-cell-code source-code">${examples}${question}${visual.showWeights ? `<small>각 칸의 값: ${visual.columnWeights.join(", ")}${visual.rows === 2 ? " (위아래 같은 값)" : ""}</small>` : ""}</div>`;
}

function symbolCodeMarkup(visual) {
  return `<div class="b3-symbol-code">${visual.rows.map((row) => `<div>${row.symbols.map((symbol) => `<span>${esc(symbol)}</span>`).join("<b>+</b>")}<b>=</b><strong>${row.total}</strong></div>`).join("")}<p>${visual.targetSymbols.map((symbol) => `<span>${esc(symbol)}</span>`).join(" + ")} = ?</p></div>`;
}

function symbolValueCodeMarkup(visual) {
  const box = (symbols) => `<span class="b3-symbol-value-box">${symbols.map((symbol) => `<i>${esc(symbol)}</i>`).join("")}</span>`;
  return `<div class="b3-symbol-value-code"><div class="b3-symbol-value-clues">${visual.rows.map((row) => `<span>${box(row.symbols)}<strong>${row.total}</strong></span>`).join("")}</div><div class="b3-symbol-value-target">${box(visual.targetSymbols)}<strong>= ?</strong></div></div>`;
}

function magicGridMarkup(visual) {
  return `${cardStrip(visual.cards)}<div class="b3-magic-wrap"><div class="b3-magic-grid" style="--size:${visual.size}">${visual.shown.map((value) => `<span class="${value == null ? "blank" : typeof value === "string" ? "target" : ""}">${value == null ? "" : esc(value)}</span>`).join("")}</div>${visual.lineSum ? `<strong>한 줄의 합 ${visual.lineSum}</strong>` : ""}</div>`;
}

function polygonRingMarkup(visual) {
  const vertices = Array.from({ length: 5 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / 5;
    return [170 + Math.cos(angle) * 112, 135 + Math.sin(angle) * 112];
  });
  const points = vertices.flatMap((vertex, index) => {
    const next = vertices[(index + 1) % vertices.length];
    return [vertex, [(vertex[0] + next[0]) / 2, (vertex[1] + next[1]) / 2]];
  });
  const outline = vertices.concat([vertices[0]]);
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y+1}">${visual.shown[index] ?? ""}</text>`).join("");
  return `${cardStrip(visual.cards)}<svg class="b3-svg b3-polygon-ring" viewBox="0 0 340 270" role="img" aria-label="오각형 다섯 변의 열 개 원에 수 놓기"><polyline points="${pointsText(outline)}"/>${nodes}<text x="170" y="139">합 ${visual.lineSum}</text></svg>`;
}

function triangleEqualSumMarkup(visual) {
  const points = visual.size === 6
    ? [[170,25],[85,135],[35,230],[170,230],[305,230],[255,135]]
    : [[170,22],[115,90],[65,158],[30,230],[125,230],[215,230],[310,230],[275,158],[225,90]];
  const outline = [points[0], points[visual.size === 6 ? 2 : 3], points[visual.size === 6 ? 4 : 6], points[0]];
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y+1}">${visual.shown[index] ?? ""}</text>`).join("");
  return `${cardStrip(visual.cards)}<svg class="b3-svg b3-triangle-sum" viewBox="0 0 340 260" role="img" aria-label="삼각형 세 변의 합 맞추기"><polyline points="${pointsText(outline)}"/>${nodes}<text x="170" y="153">한 변의 합</text><text x="170" y="177">${visual.lineSum}</text></svg>`;
}

function equalLineEightCompleteMarkup(visual) {
  const positions = [[45,45], [130,45], [215,45], [215,130], [215,215], [130,215], [45,215], [45,130]];
  const nodes = positions.map(([x, y], index) => `<g class="${visual.shown[index] == null ? "blank" : "given"}"><rect x="${x - 28}" y="${y - 28}" width="56" height="56"/><text x="${x}" y="${y + 7}">${visual.shown[index] ?? ""}</text></g>`).join("");
  return `${cardStrip(visual.cards)}<div class="equal-line-eight-work"><svg viewBox="0 0 260 260" role="img" aria-label="1부터 8까지를 한 번씩 놓아 네 줄의 합 맞추기"><g class="equal-eight-lines"><path d="M45 45H215V215H45Z"/></g><g class="equal-eight-nodes">${nodes}</g><text class="equal-eight-sum" x="130" y="136">합: ${visual.lineSum}</text></svg></div>`;
}

function sourceFractionStageMarkup(visual) {
  const lineMarkup = (segments) => segments.map(([from,to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");
  const fillMarkup = (polygons) => polygons.map((polygon) => `<polygon class="partition-cell shade" points="${pointsText(polygon)}"/>`).join("");
  const triangleTop = [110,12];
  const triangleLeft = [18,176];
  const triangleRight = [202,176];
  const leftMiddle = midpoint(triangleTop,triangleLeft);
  const rightMiddle = midpoint(triangleTop,triangleRight);
  const baseMiddle = midpoint(triangleLeft,triangleRight);
  const topBaseMiddle = midpoint(leftMiddle,rightMiddle);
  const quarterSegments = [[leftMiddle,rightMiddle],[leftMiddle,baseMiddle],[rightMiddle,baseMiddle]];

  let outline;
  let segments;
  let fills;
  if (visual.template.startsWith("source-triangle")) {
    outline = [triangleTop,triangleLeft,triangleRight];
    segments = [...quarterSegments];
    fills = [[triangleTop,leftMiddle,rightMiddle]];
    if (visual.template === "source-triangle-eighth") {
      segments.push([triangleTop,topBaseMiddle]);
      fills = [[triangleTop,topBaseMiddle,rightMiddle]];
    }
    if (visual.template === "source-triangle-twelfth") {
      const quarterCenter = centroid([triangleTop,leftMiddle,rightMiddle]);
      segments.push([triangleTop,quarterCenter],[leftMiddle,quarterCenter],[rightMiddle,quarterCenter]);
      fills = [[triangleTop,quarterCenter,rightMiddle]];
    }
    if (visual.template === "source-triangle-sixteenth") {
      const upperLeft = midpoint(triangleTop,leftMiddle);
      const upperRight = midpoint(triangleTop,rightMiddle);
      segments.push([upperLeft,upperRight],[upperLeft,topBaseMiddle],[upperRight,topBaseMiddle]);
      fills = [[triangleTop,upperLeft,upperRight]];
    }
  } else {
    const topLeft = [60,18];
    const topRight = [160,18];
    const right = [210,98];
    const bottomRight = [160,178];
    const bottomLeft = [60,178];
    const left = [10,98];
    const center = [110,98];
    const lowerCenter = midpoint(left,bottomRight);
    outline = [topLeft,topRight,right,bottomRight,bottomLeft,left];
    const solidFaces = [[left,center],[topRight,center],[bottomRight,center]];
    segments = [...solidFaces];
    fills = [[left,center,bottomRight,bottomLeft]];
    if (visual.template === "source-solid-sixth") {
      segments.push([left,bottomRight]);
      fills = [[left,bottomLeft,bottomRight]];
    }
    if (visual.template === "source-solid-twelfth" || visual.template === "source-solid-five-twelfths") {
      segments.push([left,bottomRight],[bottomLeft,center]);
      fills = [[left,bottomLeft,lowerCenter]];
      if (visual.template === "source-solid-five-twelfths") fills = [[topLeft,topRight,center,left],[bottomLeft,bottomRight,lowerCenter]];
    }
    if (visual.template === "source-solid-eighteenth" || visual.template === "source-solid-twenty-fourth") {
      segments = outline.map((point) => [point,center]);
      if (visual.template === "source-solid-eighteenth") {
        const sectorCenter = centroid([center,bottomLeft,bottomRight]);
        segments.push([center,sectorCenter],[bottomLeft,sectorCenter],[bottomRight,sectorCenter]);
        fills = [[bottomLeft,bottomRight,sectorCenter]];
      } else {
        const leftHalf = midpoint(center,bottomLeft);
        const rightHalf = midpoint(center,bottomRight);
        const baseHalf = midpoint(bottomLeft,bottomRight);
        segments.push([leftHalf,rightHalf],[leftHalf,baseHalf],[rightHalf,baseHalf]);
        fills = [[leftHalf,rightHalf,baseHalf]];
      }
    }
  }
  const shapeName = visual.template.startsWith("source-triangle") ? "삼각형" : "육각 입체 모양";
  return `<svg class="b3-svg b3-source-partition b3-source-fraction-stage" viewBox="0 0 220 188" role="img" aria-label="${shapeName}에서 색칠한 부분을 분수로 나타내는 그림">${fillMarkup(fills)}<polygon class="partition-outline" points="${pointsText(outline)}"/><g class="partition-lines">${lineMarkup(segments)}</g></svg>`;
}

function foldedTapeSourceMarkup(visual) {
  const points = visual.points || [];
  const xs = points.map(([x]) => x);
  const ys = points.map(([,y]) => y);
  const maxX = Math.max(1,...xs);
  const maxY = Math.max(1,...ys);
  const cell = Math.min(45, 170 / maxX, 130 / maxY);
  const offsetX = (220 - maxX * cell) / 2;
  const offsetY = 28;
  const mapped = points.map(([x,y]) => [offsetX + x * cell,offsetY + y * cell]);
  const grid = [
    ...Array.from({ length:maxX + 1 },(_,index) => `<line x1="${offsetX + index * cell}" y1="${offsetY}" x2="${offsetX + index * cell}" y2="${offsetY + maxY * cell}"/>`),
    ...Array.from({ length:maxY + 1 },(_,index) => `<line x1="${offsetX}" y1="${offsetY + index * cell}" x2="${offsetX + maxX * cell}" y2="${offsetY + index * cell}"/>`)
  ].join("");
  const folds = mapped.slice(1,-1).map(([x,y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join("");
  return `<svg class="b3-svg b3-folded-tape-source" viewBox="0 0 220 190" role="img" aria-label="1센티미터 모눈 위에 접혀 있는 색테이프"><g class="tape-grid">${grid}</g><polyline class="tape-path" points="${pointsText(mapped)}"/><g class="tape-folds">${folds}</g><text x="110" y="174">한 칸 ${esc(visual.unitLabel || "1cm")}</text></svg>`;
}

function areaGridCompositeMarkup(visual) {
  const polygons = visual.polygons || [];
  const points = polygons.flat();
  const maxX = Math.max(1, ...points.map(([x]) => x));
  const maxY = Math.max(1, ...points.map(([, y]) => y));
  const unit = 32;
  const pad = 18;
  const width = maxX * unit;
  const height = maxY * unit;
  const grid = [
    ...Array.from({ length: maxX + 1 }, (_, index) => `<path d="M${pad + index * unit} ${pad}V${pad + height}"/>`),
    ...Array.from({ length: maxY + 1 }, (_, index) => `<path d="M${pad} ${pad + index * unit}H${pad + width}"/>`)
  ].join("");
  const shapes = polygons.map((polygon) => `<polygon points="${pointsText(polygon.map(([x, y]) => [pad + x * unit, pad + y * unit]))}"/>`).join("");
  return `<svg class="b3-svg b3-area-composite" viewBox="0 0 ${width + pad * 2} ${height + pad * 2}" role="img" aria-label="단위넓이 모눈 위의 도형"><g class="grid">${grid}</g><g class="shape">${shapes}</g></svg>`;
}

function alternatingAreaMarkup(visual) {
  const shown = visual.stages || [1, 2, 4, 8, 16];
  const figures = shown.map((area, index) => {
    const side = Math.sqrt(area) * 17;
    const x = 48 + index * 82;
    const y = 68;
    const rotation = index % 2 ? 45 : 0;
    return `<g transform="translate(${x} ${y}) rotate(${rotation})"><rect x="${-side / 2}" y="${-side / 2}" width="${side}" height="${side}"/></g><text x="${x}" y="128">${index + 1}번째</text><text x="${x}" y="146">넓이 ${area}</text>`;
  }).join("");
  return `<svg class="b3-svg b3-alternating-area" viewBox="0 0 420 165" role="img" aria-label="정사각형과 마름모가 번갈아 커지는 넓이 규칙">${figures}<text x="210" y="158">${visual.target || 7}번째 넓이 = ?</text></svg>`;
}

function fractionGridMarkup(visual) {
  const rows = visual.rows;
  const columns = visual.columns;
  const selected = new Set(visual.shadedIndices || Array.from({ length: visual.shaded || 0 }, (_, index) => index));
  return `<div class="b3-fraction-grid" style="--rows:${rows};--columns:${columns}" role="img" aria-label="같은 크기 ${rows * columns}칸 중 ${selected.size}칸을 색칠한 그림">${Array.from({ length: rows * columns }, (_, index) => `<i class="${selected.has(index) ? "shade" : ""}"></i>`).join("")}</div>`;
}

function distanceChainSourceMarkup(visual) {
  const positions = visual.positions || [0, 1, 2, 3];
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  const range = Math.max(1, max - min);
  const xs = positions.map((value) => 38 + (value - min) / range * 344);
  const labels = (visual.labels || positions.map(String)).map((label, index) => `<line x1="${xs[index]}" y1="92" x2="${xs[index]}" y2="108"/><text x="${xs[index]}" y="125">${esc(label)}</text>`).join("");
  const spans = (visual.spans || []).map((span, index) => {
    const from = xs[span.from];
    const to = xs[span.to];
    const above = span.side !== "below";
    const apex = above ? 22 + index * 11 : 151 + index * 11;
    const baseline = above ? 92 : 108;
    const labelY = above ? apex - 5 : apex + 13;
    return `<path d="M${from} ${baseline}Q${(from + to) / 2} ${apex} ${to} ${baseline}"/><text x="${(from + to) / 2}" y="${labelY}">${esc(span.label)}</text>`;
  }).join("");
  return `<svg class="b3-svg b3-distance-source" viewBox="0 0 420 180" role="img" aria-label="겹친 거리 관계"><line class="base" x1="38" y1="100" x2="382" y2="100"/>${labels}${spans}</svg>`;
}

function multipleModelMarkup(visual) {
  const cells = (count, className) => Array.from({ length: count }, () => `<i class="${className}"></i>`).join("");
  return `<div class="b3-multiple-model" role="img" aria-label="기준량과 비교량의 배수 관계"><div><b>${esc(visual.baseLabel || "기준")}</b><span>${cells(visual.baseUnits || 1, "base")}</span></div><div><b>${esc(visual.compareLabel || "비교")}</b><span>${cells(visual.compareUnits, "compare")}</span></div>${visual.values ? `<strong>${esc(visual.values)}</strong>` : ""}</div>`;
}

function ratioBarsMarkup(visual) {
  const bars = (count, className) => Array.from({ length: count }, () => `<i class="${className}"></i>`).join("");
  return `<div class="b3-ratio-bars" role="img" aria-label="두 막대의 같은 길이 묶음 비교"><div><b>ㄱ</b><span>${bars(visual.topUnits, "top")}</span></div><div><b>ㄴ</b><span>${bars(visual.bottomUnits, "bottom")}</span></div>${visual.given ? `<strong>${esc(visual.given)}</strong>` : ""}</div>`;
}

function cryptarithmBoardMarkup(visual) {
  const addends = visual.addends || [];
  const sum = visual.sum || [];
  const width = Math.max(1, sum.length, ...addends.map((row) => row.length));
  const row = (cells, sign = "") => `<div style="--columns:${width}"><b>${sign}</b>${Array.from({ length: width - cells.length }, () => "<i></i>").join("")}${cells.map((cell) => `<i>${esc(cell)}</i>`).join("")}</div>`;
  return `<div class="b3-cryptarithm-board" role="img" aria-label="자리 맞춘 세로 덧셈 복면산">${addends.map((cells, index) => row(cells, index === addends.length - 1 ? "+" : "")).join("")}<hr>${row(sum)}</div>`;
}

function binaryStripMarkup(visual) {
  const selected = new Set(visual.selected || []);
  return `<div class="b3-binary-strip" role="img" aria-label="각 칸의 값을 더해 수를 나타내는 마법카드"><div>${visual.weights.map((weight, index) => `<span class="${selected.has(index) ? "selected" : ""}"><b>${weight ?? "?"}</b></span>`).join("")}</div>${visual.target != null ? `<strong>나타낼 수 ${visual.target}</strong>` : ""}</div>`;
}

function starCodeMarkup(visual) {
  const outer = regularPoints(5, 110, 100, 76);
  const inner = regularPoints(5, 110, 100, 31, -Math.PI / 2 + Math.PI / 5);
  const star = outer.flatMap((point, index) => [point, inner[index]]);
  const center = [110, 100];
  const selected = new Set(visual.selected || []);
  const wedges = Array.from({ length: 5 }, (_, index) => {
    const a = star[(index * 2 + 9) % 10];
    const b = star[(index * 2) % 10];
    const c = star[(index * 2 + 1) % 10];
    return `<polygon class="${selected.has(index) ? "selected" : ""}" points="${pointsText([center, a, b, c])}"/>`;
  }).join("");
  return `<svg class="b3-svg b3-star-code" viewBox="0 0 220 205" role="img" aria-label="색칠한 별 조각의 값을 더하는 마법카드">${wedges}<polygon class="outline" points="${pointsText(star)}"/><text x="110" y="101">${visual.center ?? "?"}</text></svg>`;
}

function mathExpressionMarkup(visual) {
  return `<div class="b3-math-expression" role="img" aria-label="${esc(visual.ariaLabel || "수식")}">${esc(visual.expression)}</div>`;
}

export function book03Markup(visual) {
  if (!visual || visual.kind !== "book3") return "";
  if (visual.subtype === "area-grid-composite") return areaGridCompositeMarkup(visual);
  if (visual.subtype === "alternating-area") return alternatingAreaMarkup(visual);
  if (visual.subtype === "fraction-grid") return fractionGridMarkup(visual);
  if (visual.subtype === "distance-chain-source") return distanceChainSourceMarkup(visual);
  if (visual.subtype === "multiple-model") return multipleModelMarkup(visual);
  if (visual.subtype === "ratio-bars") return ratioBarsMarkup(visual);
  if (visual.subtype === "cryptarithm-board") return cryptarithmBoardMarkup(visual);
  if (visual.subtype === "binary-strip") return binaryStripMarkup(visual);
  if (visual.subtype === "star-code") return starCodeMarkup(visual);
  if (visual.subtype === "math-expression") return mathExpressionMarkup(visual);
  if (visual.subtype === "source-fraction-stage") return sourceFractionStageMarkup(visual);
  if (visual.subtype === "slide8-fraction-source") return slideEightFractionMarkup(visual);
  if (visual.subtype === "folded-tape-source") return foldedTapeSourceMarkup(visual);
  if (visual.subtype === "tangram-composition-source") return tangramCompositionMarkup(visual);
  if (visual.subtype === "tangram-area-source") return tangramAreaMarkup(visual);
  if (visual.subtype === "unit-grid-area") return unitGridAreaMarkup(visual);
  if (visual.subtype === "shape-area-growth") return shapeAreaGrowthMarkup(visual);
  if (visual.subtype === "nested-square-area") return nestedSquareMarkup(visual);
  if (visual.subtype === "fraction-shape") return fractionShapeMarkup(visual);
  if (visual.subtype === "equal-partition-source" || visual.subtype === "incomplete-partition-source") return sourcePartitionMarkup(visual);
  if (visual.subtype === "equal-fraction-source") return equalFractionSourceMarkup(visual);
  if (visual.subtype === "paired-source-fractions") return pairedSourceFractionsMarkup(visual);
  if (visual.subtype === "paired-source-fractions-exact") return pairedSourceFractionsExactMarkup(visual);
  if (visual.subtype === "triangle-twelve-fraction-exact") return triangleTwelveFractionExactMarkup(visual);
  if (visual.subtype === "concentric-square-sixteen-fraction") return concentricSquareSixteenMarkup(visual);
  if (visual.subtype === "oblique-square-area") return obliqueSquareMarkup(visual);
  if (visual.subtype === "grid-path") return gridPathMarkup(visual);
  if (visual.subtype === "number-line") return numberLineMarkup(visual);
  if (visual.subtype === "segment-chain") return segmentChainMarkup(visual);
  if (visual.subtype === "overlapping-rods-common-unit") return overlappingRodsMarkup(visual);
  if (["step-ratio","route-multiple","rods","rod-comparison-total","object-measure","object-equation","object-count-equivalence","meeting-distance","difference-unit"].includes(visual.subtype)) return simpleBook3Markup(visual);
  if (visual.subtype === "mixed-interval") return mixedIntervalMarkup(visual);
  if (visual.subtype === "equation-chain") return equationChainMarkup(visual);
  if (visual.subtype === "binary-weight") return binaryWeightMarkup(visual);
  if (visual.subtype === "cell-code") return cellCodeMarkup(visual);
  if (visual.subtype === "symbol-code") return symbolCodeMarkup(visual);
  if (visual.subtype === "symbol-value-code") return symbolValueCodeMarkup(visual);
  if (visual.subtype === "magic-grid") return magicGridMarkup(visual);
  if (visual.subtype === "polygon-ring") return polygonRingMarkup(visual);
  if (visual.subtype === "triangle-equal-sum") return triangleEqualSumMarkup(visual);
  if (visual.subtype === "equal-line-eight-complete") return equalLineEightCompleteMarkup(visual);
  return "";
}
