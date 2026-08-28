const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const optionLabels = ["①", "②", "③", "④", "⑤"];
const palette = ["#d9eef8", "#ffe9b6", "#dcefd9", "#f6dce8", "#e8e0f5", "#dff1ec"];

function gridCandidate(groups, rows, cols, values = [], markers = [], markerIcon = "★", label = "") {
  const cell = 28;
  const width = cols * cell;
  const height = rows * cell;
  const cells = groups.map((group, index) => {
    const row = Math.floor(index / cols);
    const column = index % cols;
    const marker = markers.includes(index) ? markerIcon : "";
    const value = values[index] ?? "";
    return `<rect x="${column * cell}" y="${row * cell}" width="${cell}" height="${cell}" fill="${palette[group % palette.length]}" stroke="#9bb0bc"/><text x="${column * cell + cell / 2}" y="${row * cell + cell / 2 + 1}">${esc(marker || value)}</text>`;
  }).join("");
  return `<figure><svg class="b9-grid" viewBox="0 0 ${width} ${height}" role="img" aria-label="도형 분할 보기">${cells}</svg><figcaption>${label}</figcaption></figure>`;
}

function partitionChoice(visual) {
  return `<div class="b9-options b9-partitions">${visual.options.map((option, index) => gridCandidate(option.groups, visual.rows, visual.cols, visual.values, visual.markers, visual.markerIcon, optionLabels[index])).join("")}</div>`;
}

function polygonSubdivision(visual) {
  const polygons = [];
  if (visual.shape === "triangle") {
    const divisions = Math.sqrt(visual.count);
    const top = [150, 18];
    const left = [28, 226];
    const right = [272, 226];
    const point = (row, column) => [
      top[0] + (left[0] - top[0]) * (row - column) / divisions + (right[0] - top[0]) * column / divisions,
      top[1] + (left[1] - top[1]) * row / divisions
    ];
    for (let row = 0; row < divisions; row += 1) {
      for (let column = 0; column <= row; column += 1) {
        polygons.push([point(row, column), point(row + 1, column), point(row + 1, column + 1)]);
      }
      for (let column = 0; column < row; column += 1) {
        polygons.push([point(row, column), point(row, column + 1), point(row + 1, column + 1)]);
      }
    }
  } else {
    const center = [150, 122];
    const vertices = Array.from({ length: 6 }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI / 3;
      return [center[0] + Math.cos(angle) * 98, center[1] + Math.sin(angle) * 98];
    });
    vertices.forEach((vertex, index) => {
      const next = vertices[(index + 1) % vertices.length];
      if (visual.count === 6) polygons.push([center, vertex, next]);
      else {
        const midpoint = [(vertex[0] + next[0]) / 2, (vertex[1] + next[1]) / 2];
        polygons.push([center, vertex, midpoint], [center, midpoint, next]);
      }
    });
  }
  const pieces = polygons.map((points, index) => `<polygon class="${index < visual.shaded ? "marked" : ""}" points="${points.map((point) => point.join(",")).join(" ")}"/>`).join("");
  return `<svg class="b9-svg b9-subdivision" viewBox="0 0 300 245" role="img" aria-label="똑같이 나눈 ${visual.shape === "triangle" ? "정삼각형" : "정육각형"}">${pieces}</svg>`;
}

function cellBoard(visual) {
  const cells = Array.from({ length: visual.rows * visual.cols }, (_, index) => visual.blocked.includes(index)
    ? `<span class="blocked" aria-label="${esc(visual.blockedIcon)}"><i class="b9-tree" aria-hidden="true"></i></span>`
    : "<span></span>").join("");
  const board = `<div class="b9-cell-board" style="--cols:${visual.cols}" role="img" aria-label="나무 칸을 제외한 모눈 땅">${cells}</div>`;
  if (visual.piece !== "t") return board;
  const piece = Array.from({ length: 6 }, (_, index) => `<i class="${[1, 3, 4, 5].includes(index) ? "on" : ""}"></i>`).join("");
  return `<div class="b9-tetromino-task"><figure><div class="b9-t-piece" role="img" aria-label="T 모양 네 칸 블록">${piece}</div><figcaption>주어진 블록</figcaption></figure>${board}</div>`;
}

function areaGrid(visual) {
  const cell = 28;
  const width = visual.gridWidth * cell;
  const height = visual.gridHeight * cell;
  const grid = `${Array.from({ length: visual.gridWidth + 1 }, (_, index) => `<line x1="${index * cell}" y1="0" x2="${index * cell}" y2="${height}"/>`).join("")}${Array.from({ length: visual.gridHeight + 1 }, (_, index) => `<line x1="0" y1="${index * cell}" x2="${width}" y2="${index * cell}"/>`).join("")}`;
  const points = visual.points.map(([x,y]) => `${x * cell},${y * cell}`).join(" ");
  return `<svg class="b9-svg b9-area-grid" viewBox="-2 -2 ${width + 4} ${height + 4}" role="img" aria-label="모눈 위 색칠한 도형"><g class="grid">${grid}</g><polygon points="${points}"/></svg>`;
}

function isoMap(map, compact = false) {
  const cubes = [];
  const unitX = compact ? 13 : 18;
  const unitY = compact ? 7 : 10;
  const cubeH = compact ? 14 : 20;
  const originX = compact ? 75 : 125;
  const originY = compact ? 18 : 30;
  for (let z = 0; z < map.length; z += 1) for (let x = 0; x < map[z].length; x += 1) for (let y = 0; y < map[z][x]; y += 1) cubes.push({ x, y, z });
  cubes.sort((a,b) => (a.x + a.z + a.y) - (b.x + b.z + b.y));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const polygons = cubes.map(({x,y,z}) => {
    const sx = originX + (x - z) * unitX;
    const sy = originY + (x + z) * unitY - y * cubeH;
    minX = Math.min(minX, sx - unitX);
    maxX = Math.max(maxX, sx + unitX);
    minY = Math.min(minY, sy);
    maxY = Math.max(maxY, sy + unitY * 2 + cubeH);
    return `<g><polygon class="top" points="${sx},${sy} ${sx + unitX},${sy + unitY} ${sx},${sy + unitY * 2} ${sx - unitX},${sy + unitY}"/><polygon class="right" points="${sx + unitX},${sy + unitY} ${sx},${sy + unitY * 2} ${sx},${sy + unitY * 2 + cubeH} ${sx + unitX},${sy + unitY + cubeH}"/><polygon class="left" points="${sx - unitX},${sy + unitY} ${sx},${sy + unitY * 2} ${sx},${sy + unitY * 2 + cubeH} ${sx - unitX},${sy + unitY + cubeH}"/></g>`;
  }).join("");
  const padding = compact ? 4 : 7;
  const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
  return `<svg class="b9-iso" viewBox="${viewBox}" role="img" aria-label="쌓기나무 입체 모양">${polygons}</svg>`;
}

function profileBars(values, label) {
  const max = Math.max(...values, 1);
  return `<figure><div class="b9-profile" style="--cols:${values.length};--rows:${max}">${Array.from({ length: max }, (_, row) => values.map((value) => `<i class="${max - row <= value ? "on" : ""}"></i>`).join("")).join("")}</div><figcaption>${label}</figcaption></figure>`;
}

function blankProfile(columns, rows, label) {
  return `<figure><div class="b9-profile blank" style="--cols:${columns};--rows:${rows}">${Array.from({ length: columns * rows }, () => "<i></i>").join("")}</div><figcaption>${label}</figcaption></figure>`;
}

function cubeSolidViews(visual) {
  const profiles = visual.front
    ? `<div>${profileBars(visual.front, "앞")}${profileBars(visual.side, "오른쪽 옆")}</div>`
    : visual.blankProfiles
      ? `<div>${blankProfile(visual.blankProfiles.frontColumns, visual.blankProfiles.rows, "앞")}${blankProfile(visual.blankProfiles.sideColumns, visual.blankProfiles.rows, "오른쪽 옆")}</div>`
      : "";
  return `<div class="b9-cube-views">${isoMap(visual.map)}${profiles}</div>`;
}

function smallGrid(grid, label) {
  const cols = grid[0]?.length || 1;
  return `<figure><div class="b9-mini-grid" style="--cols:${cols}">${grid.flatMap((row) => row.map((value) => `<i class="${value ? "on" : ""}"></i>`)).join("")}</div><figcaption>${esc(label)}</figcaption></figure>`;
}

function cubeLayers(visual) {
  const profiles = visual.front
    ? `<div class="profiles">${profileBars(visual.front, "앞")}${profileBars(visual.side, "오른쪽 옆")}</div>`
    : visual.blankProfiles
      ? `<div class="profiles">${blankProfile(visual.blankProfiles.frontColumns, visual.blankProfiles.rows, "앞")}${blankProfile(visual.blankProfiles.sideColumns, visual.blankProfiles.rows, "오른쪽 옆")}</div>`
      : "";
  return `<div class="b9-layer-wrap"><div class="layers">${visual.layers.map((layer, index) => smallGrid(layer, `${index + 1}층`)).join("")}</div>${profiles}</div>`;
}

function cubeBox(visual) {
  return `<div class="b9-cube-box"><div style="--w:${visual.width};--d:${visual.depth};--h:${visual.height}"><span></span></div><p>가로 ${visual.width} · 세로 ${visual.depth} · 높이 ${visual.height}</p></div>`;
}

function cubeModelChoice(visual) {
  return `<div class="b9-model-choice"><div class="views">${smallGrid(visual.top, "위")}${profileBars(visual.front, "앞")}${profileBars(visual.side, "오른쪽 옆")}</div><div class="models">${visual.options.map((option, index) => `<figure>${isoMap(option.map, true)}<figcaption>${optionLabels[index]}</figcaption></figure>`).join("")}</div></div>`;
}

function magicGrid(visual) {
  return `<div class="b9-magic-grid" style="--size:${visual.size}">${visual.shown.map((value) => `<span class="${typeof value === "string" ? "target" : ""}">${esc(value)}</span>`).join("")}</div>${visual.lineSum ? `<strong class="b9-line-sum">한 줄의 합 ${visual.lineSum}</strong>` : ""}`;
}

function consecutiveSum(visual) {
  const values = visual.to - visual.from <= 7
    ? Array.from({ length: visual.to - visual.from + 1 }, (_, index) => visual.from + index)
    : [visual.from, visual.from + 1, visual.from + 2, "…", visual.to - 1, visual.to];
  return `<div class="b9-consecutive-sum" role="img" aria-label="${visual.from}부터 ${visual.to}까지 연속수의 합"><div>${values.map((value, index) => `<span>${esc(value)}</span>${index < values.length - 1 ? "<i>+</i>" : ""}`).join("")}</div><strong>${esc(visual.from)}부터 ${esc(visual.to)}까지</strong></div>`;
}

function triangleSum(visual) {
  const points = visual.size === 6
    ? [[170,25],[85,135],[35,230],[170,230],[305,230],[255,135]]
    : [[170,22],[115,90],[65,158],[30,230],[125,230],[215,230],[310,230],[275,158],[225,90]];
  const outline = visual.size === 6 ? [points[0],points[2],points[4],points[0]] : [points[0],points[3],points[6],points[0]];
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y+1}">${esc(visual.shown[index])}</text>`).join("");
  return `<div class="b9-card-strip">${(visual.cards || []).map((value) => `<span>${value}</span>`).join("")}</div><svg class="b9-svg b9-triangle-sum" viewBox="0 0 340 260"><polyline points="${outline.map((point) => point.join(",")).join(" ")}"/>${nodes}${visual.lineSum ? `<text x="170" y="165">합 ${visual.lineSum}</text>` : ""}</svg>`;
}

function polygonRing(visual) {
  const count = visual.sides * 2;
  const points = Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
    return [170 + Math.cos(angle) * 110, 135 + Math.sin(angle) * 110];
  });
  const vertices = Array.from({ length: visual.sides }, (_, index) => points[index * 2]).concat([points[0]]);
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y+1}">${esc(visual.shown[index])}</text>`).join("");
  return `<div class="b9-card-strip">${(visual.cards || []).map((value) => `<span>${value}</span>`).join("")}</div><svg class="b9-svg b9-polygon-ring" viewBox="0 0 340 270"><polyline points="${vertices.map((point) => point.join(",")).join(" ")}"/>${nodes}${visual.lineSum ? `<text x="170" y="140">합 ${visual.lineSum}</text>` : ""}</svg>`;
}

function overlapRegions(visual) {
  const values = (items, x) => items.map((value, index) => `<text x="${x}" y="${95 + index * 42}">${esc(value)}</text>`).join("");
  return `<svg class="b9-svg b9-overlap" viewBox="0 0 410 235"><circle cx="150" cy="112" r="88"/><circle cx="260" cy="112" r="88"/>${values(visual.left,112)}${values(visual.right,298)}<text x="205" y="118">${esc(visual.overlap)}</text></svg>`;
}

function crossSum(visual) {
  return `<div class="b9-cross-sum"><div><span></span><b>㉡</b><span></span><strong>${visual.rowSum}</strong></div><div><i></i><span></span><i></i></div><div><i></i><span></span><i></i></div><em>${visual.columnSum}</em></div><div class="b9-card-strip">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>`;
}

function circleChain(visual) {
  return `<div class="b9-circle-chain">${visual.shown.map((value, index) => `<span>${esc(value)}</span>${index < visual.shown.length - 1 ? "<i></i>" : ""}`).join("")}<strong>각 세 원의 합 ${visual.lineSum}</strong></div>`;
}

function triangleLine(visual) {
  const points = [[170,25],[75,120],[35,220],[170,220],[305,220],[265,120],[170,120]];
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y+1}">${esc(visual.shown[index])}</text>`).join("");
  return `<svg class="b9-svg b9-triangle-line" viewBox="0 0 340 250"><polyline points="170,25 35,220 305,220 170,25"/><line x1="75" y1="120" x2="265" y2="120"/>${nodes}<text x="170" y="200">합 ${visual.lineSum}</text></svg>`;
}

function circularMagic(visual) {
  const points = Array.from({ length: visual.spokes * 2 }, (_, index) => {
    const angle = index * Math.PI / visual.spokes;
    return [170 + Math.cos(angle) * 102, 125 + Math.sin(angle) * 102];
  });
  const lines = Array.from({ length: visual.spokes }, (_, index) => `<line x1="${points[index][0]}" y1="${points[index][1]}" x2="${points[index + visual.spokes][0]}" y2="${points[index + visual.spokes][1]}"/>`).join("");
  const nodes = points.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="14"/>`).join("");
  return `<div class="b9-card-strip">${visual.values.map((value) => `<span>${value}</span>`).join("")}</div><svg class="b9-svg b9-circular" viewBox="0 0 340 250">${lines}${nodes}<circle cx="170" cy="125" r="18"/><text x="170" y="126">${esc(visual.center)}</text></svg>`;
}

function conditionList(visual) {
  return `<div class="b9-condition-list">${(visual.cards || []).length ? `<div class="b9-card-strip">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}${visual.conditions.map((condition, index) => `<p><b>${index + 1}</b>${esc(condition)}</p>`).join("")}${visual.slots ? `<div class="slots">${Array.from({ length: visual.slots }, (_, index) => `<span>${index + 1}등</span>`).join("")}</div>` : ""}</div>`;
}

function logicGrid(visual) {
  return `<table class="b9-logic-grid"><thead><tr><th></th>${visual.columnLabels.map((label) => `<th>${esc(label)}</th>`).join("")}</tr></thead><tbody>${visual.rowLabels.map((label, row) => `<tr><th>${esc(label)}</th>${visual.columnLabels.map((_, column) => `<td>${visual.allowed[row].includes(column) ? "○" : "×"}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function predictions(visual) {
  return `<div class="b9-predictions">${visual.statements.map((statement) => `<p><b>${esc(statement.speaker)}</b><span>${esc(statement.guesses[0])}</span><span>${esc(statement.guesses[1])}</span></p>`).join("")}<strong>각 줄에서 하나만 맞습니다.</strong></div>`;
}

function meetingTable(visual) {
  return `<table class="b9-meetings"><thead><tr><th>회의</th><th>참가한 사람</th></tr></thead><tbody>${visual.meetings.map((meeting, index) => `<tr><th>${index + 1}회</th><td>${meeting.map(esc).join(" · ")}</td></tr>`).join("")}</tbody></table><p class="b9-name-key">1번 학생: ${esc(visual.names[0])}</p>`;
}

function logicMatrix(visual) {
  return `<table class="b9-logic-grid"><thead><tr><th></th>${visual.columnLabels.map((label) => `<th>${esc(label)}</th>`).join("")}</tr></thead><tbody>${visual.rowLabels.map((label, row) => `<tr><th>${esc(label)}</th>${visual.columnLabels.map((_, column) => `<td>${visual.knownRows[row].includes(column) ? "○" : ""}</td>`).join("")}</tr>`).join("")}<tr class="totals"><th>인원</th>${visual.totals.map((value) => `<td>${value}</td>`).join("")}</tr></tbody></table>`;
}

function apartment(visual) {
  if (visual.occupants) return `<div class="b9-apartment">${visual.occupants.map((name, index) => `<span class="${index === visual.targetIndex ? "target" : ""}">${esc(name)}</span>`).join("")}</div>`;
  return `<div class="b9-apartment-wrap"><div class="b9-apartment">${Array.from({ length: 6 }, (_, index) => `<span class="${index === visual.targetIndex ? "target" : ""}">${index === visual.targetIndex ? "?" : ""}</span>`).join("")}</div><div class="b9-condition-list">${visual.conditions.map((condition, index) => `<p><b>${index + 1}</b>${esc(condition)}</p>`).join("")}</div></div>`;
}

export function book09Markup(visual) {
  if (!visual || visual.kind !== "book9") return "";
  switch (visual.subtype) {
    case "partition-choice": return partitionChoice(visual);
    case "polygon-subdivision": return polygonSubdivision(visual);
    case "cell-board": return cellBoard(visual);
    case "area-grid": return areaGrid(visual);
    case "cube-solid-views": return cubeSolidViews(visual);
    case "cube-layers": return cubeLayers(visual);
    case "cube-box": return cubeBox(visual);
    case "cube-model-choice": return cubeModelChoice(visual);
    case "magic-grid": return magicGrid(visual);
    case "consecutive-sum": return consecutiveSum(visual);
    case "triangle-sum": return triangleSum(visual);
    case "polygon-ring": return polygonRing(visual);
    case "overlap-regions": return overlapRegions(visual);
    case "cross-sum": return crossSum(visual);
    case "circle-chain": return circleChain(visual);
    case "triangle-line": return triangleLine(visual);
    case "circular-magic": return circularMagic(visual);
    case "condition-list": return conditionList(visual);
    case "logic-grid": return logicGrid(visual);
    case "predictions": return predictions(visual);
    case "meeting-table": return meetingTable(visual);
    case "logic-matrix": return logicMatrix(visual);
    case "apartment": return apartment(visual);
    default: return "";
  }
}
