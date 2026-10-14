const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const point = ([row, column], cell = 44, inset = 24) => ({ x: inset + column * cell, y: inset + row * cell });

function pathGrid(visual) {
  const cell = visual.columns > 4 ? 39 : 45;
  const inset = 25;
  const width = inset * 2 + (visual.columns - 1) * cell;
  const height = inset * 2 + (visual.rows - 1) * cell;
  const pathPoints = visual.path.map((cellPosition) => point(cellPosition, cell, inset));
  const lines = pathPoints.slice(1).map((to, index) => {
    const from = pathPoints[index];
    return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" marker-end="url(#b5-path-arrow)" />`;
  }).join("");
  const clueSet = new Set(visual.clues);
  const cells = visual.path.map(([row, column], index) => {
    const location = point([row, column], cell, inset);
    const isTarget = visual.target.index === index;
    const label = isTarget ? "?" : clueSet.has(index) ? visual.values[row][column] : "";
    return `<g class="${isTarget ? "target" : clueSet.has(index) ? "clue" : ""}"><rect x="${location.x - 16}" y="${location.y - 16}" width="32" height="32" rx="4"/><text x="${location.x}" y="${location.y + 4}">${label}</text></g>`;
  }).join("");
  return `<svg class="b5-path-grid" viewBox="0 0 ${width} ${height}" role="img" aria-label="선을 따라 이어지는 수 배열"><defs><marker id="b5-path-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker></defs>${lines}${cells}</svg>`;
}

function lineCycle(visual) {
  return `<div class="b5-line-cycle">${visual.rows.map((row, index) => `<div class="${index === visual.targetLine ? "target" : ""}"><b>${index + 1}번 줄</b>${row.map((value) => `<span>${value}</span>`).join("")}<i>…</i>${index === visual.targetLine ? `<em>${visual.targetPosition}번째 = ?</em>` : ""}</div>`).join("")}</div>`;
}

function fingerBounce(visual) {
  const unique = ["엄지", "검지", "중지", "약지", "새끼"];
  return `<div class="b5-finger"><div>${unique.map((finger, index) => `<span style="--height:${42 + index * 8}px"><i>${index + 1}</i><b>${finger}</b></span>`).join("")}</div><p>${visual.cycle.map((finger) => `<em>${finger}</em>`).join("<b>→</b>")}<strong>… ${visual.position}은?</strong></p></div>`;
}

function calendarTable(calendar, targetDate = null, targetWeekday = null) {
  const hiddenDates = new Set(calendar.hiddenDates || []);
  const visibleDates = calendar.visibleDates ? new Set(calendar.visibleDates) : null;
  return `<div class="b5-calendar"><strong>${calendar.month}월</strong><div class="weekdays">${["일", "월", "화", "수", "목", "금", "토"].map((day) => `<b>${day}</b>`).join("")}</div><div class="dates">${calendar.cells.map((date, index) => {
    const target = (targetDate != null && date === targetDate) || (Number.isInteger(targetWeekday) && index % 7 === targetWeekday && date);
    const hidden = hiddenDates.has(date);
    const label = hidden ? "?" : visibleDates && date && !visibleDates.has(date) ? "" : date || "";
    return `<span class="${target || hidden ? "target" : ""}">${label}</span>`;
  }).join("")}</div></div>`;
}

function calendarMarkup(visual) {
  return calendarTable(visual, visual.targetDate, visual.targetWeekday);
}

function calendarPair(visual) {
  return `<div class="b5-calendar-pair">${visual.calendars.map((calendar, index) => calendarTable(calendar, index === 0 ? visual.sourceDate : null, null)).join("<b class=\"arrow\">→</b>")}</div>`;
}

function routeGrid(visual) {
  const cell = visual.columns > 5 ? 40 : 47;
  const inset = 24;
  const width = inset * 2 + (visual.columns - 1) * cell;
  const height = inset * 2 + (visual.rows - 1) * cell;
  const blocked = new Set(visual.blocked || []);
  const startPoint = visual.start || [0, 0];
  const endPoint = visual.end || [visual.rows - 1, visual.columns - 1];
  const lines = [];
  for (let row = 0; row < visual.rows; row += 1) {
    for (let column = 0; column < visual.columns; column += 1) {
      const here = point([row, column], cell, inset);
      if (column + 1 < visual.columns) {
        const next = point([row, column + 1], cell, inset);
        lines.push(`<line x1="${here.x}" y1="${here.y}" x2="${next.x}" y2="${next.y}"/>`);
      }
      if (row + 1 < visual.rows) {
        const next = point([row + 1, column], cell, inset);
        lines.push(`<line x1="${here.x}" y1="${here.y}" x2="${next.x}" y2="${next.y}"/>`);
      }
    }
  }
  for (const edge of visual.diagonalEdges || []) {
    const from = point(edge.from, cell, inset);
    const to = point(edge.to, cell, inset);
    lines.push(`<line class="shortcut" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`);
  }
  const dots = [];
  for (let row = 0; row < visual.rows; row += 1) {
    for (let column = 0; column < visual.columns; column += 1) {
      const location = point([row, column], cell, inset);
      const key = `${row}:${column}`;
      const start = row === startPoint[0] && column === startPoint[1];
      const end = row === endPoint[0] && column === endPoint[1];
      const waypoint = visual.waypoint?.row === row && visual.waypoint?.column === column;
      const label = start ? visual.startLabel || "출" : end ? visual.endLabel || "도" : waypoint ? "★" : blocked.has(key) ? "×" : "";
      dots.push(`<g class="${blocked.has(key) ? "blocked" : waypoint ? "waypoint" : start || end ? "endpoint" : ""}"><circle cx="${location.x}" cy="${location.y}" r="9"/><text x="${location.x}" y="${location.y + 3}">${label}</text></g>`);
    }
  }
  return `<svg class="b5-route-grid" viewBox="0 0 ${width} ${height}" role="img" aria-label="최단거리 길 찾기">${lines.join("")}${dots.join("")}</svg>`;
}

function digitCards(visual) {
  const order = visual.descending ? "큰 수부터" : "작은 수부터";
  return `<div class="b5-card-task"><div>${visual.digits.map((digit) => `<span>${digit}</span>`).join("")}</div><p>${visual.length}자리 수${visual.targetRank ? ` · ${order} <b>${visual.targetRank}번째</b>` : " · 모두 몇 개?"}</p></div>`;
}

function digitCondition(visual) {
  return `<div class="b5-digit-condition"><strong>${escapeHtml(visual.conditionLabel)}</strong><div><span>십의 자리</span><b>?</b><i></i><span>일의 자리</span><b>?</b></div><p>${visual.descending ? "큰" : "작은"} 수부터 ${visual.rank}번째</p></div>`;
}

function multiplicationTable(visual) {
  const columns = visual.columnHeaders.length + 1;
  const items = [`<span class="corner">×</span>`, ...visual.columnHeaders.map((value) => `<b>${value}</b>`)];
  visual.rowHeaders.forEach((header, row) => {
    items.push(`<b>${header}</b>`);
    visual.values[row].forEach((value, column) => items.push(`<span class="${visual.target.row === row && visual.target.column === column ? "target" : ""}">${visual.target.row === row && visual.target.column === column ? "?" : value}</span>`));
  });
  return `<div class="b5-times-table" style="--columns:${columns}">${items.join("")}</div>`;
}

function productCycle(visual) {
  const count = visual.vertices.length;
  const center = 110;
  const radius = 78;
  const locations = Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
    return { x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
  });
  const edges = locations.map((from, index) => {
    const to = locations[(index + 1) % count];
    const x = (from.x + to.x) / 2;
    const y = (from.y + to.y) / 2;
    return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/><text class="edge" x="${x}" y="${y + 4}">${visual.edges[index]}</text>`;
  }).join("");
  const visible = new Set(visual.visibleVertices || []);
  const vertices = locations.map((location, index) => `<g class="${index === visual.targetIndex ? "target" : ""}"><circle cx="${location.x}" cy="${location.y}" r="18"/><text x="${location.x}" y="${location.y + 5}">${index === visual.targetIndex ? "?" : visible.has(index) ? visual.vertices[index] : ""}</text></g>`).join("");
  return `<svg class="b5-product-cycle" viewBox="0 0 220 220" role="img" aria-label="이웃한 두 수의 곱">${edges}${vertices}</svg>`;
}

function rowMajorTargets(visual) {
  return `<div class="b5-row-major" style="--columns:${visual.columns}">${visual.values.flat().map((value, index) => {
    const target = visual.targetIndexes.includes(index);
    const shown = visual.clueIndexes.includes(index);
    return `<span class="${target ? "target" : shown ? "clue" : ""}">${target ? "?" : shown ? value : ""}</span>`;
  }).join("")}</div>`;
}

function radialCycle(visual) {
  const center = 125;
  const rays = visual.lineCount;
  const maxPosition = Math.min(visual.previewPositions, 6);
  const lines = [];
  const labels = [];
  for (let line = 0; line < rays; line += 1) {
    const angle = -Math.PI / 2 + line * Math.PI * 2 / rays;
    const endX = center + Math.cos(angle) * 105;
    const endY = center + Math.sin(angle) * 105;
    lines.push(`<line x1="${center}" y1="${center}" x2="${endX}" y2="${endY}"/>`);
    for (let position = 1; position <= maxPosition; position += 1) {
      const radius = 20 + position * 13;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      const target = line === visual.firstTarget.line && position === visual.firstTarget.position;
      const value = visual.start + line + (position - 1) * rays;
      labels.push(`<g class="${target ? "target" : ""}"><circle cx="${x}" cy="${y}" r="9"/><text x="${x}" y="${y + 3}">${target ? "?" : value}</text></g>`);
    }
    labels.push(`<text class="ray-label" x="${center + Math.cos(angle) * 117}" y="${center + Math.sin(angle) * 117 + 3}">${line + 1}</text>`);
  }
  return `<svg class="b5-radial-cycle" viewBox="0 0 250 250" role="img" aria-label="다섯 줄에 번갈아 놓은 수">${lines.join("")}${labels.join("")}</svg>`;
}

function checkerboardProducts(visual) {
  const active = new Set(visual.active.map(([row, column]) => `${row}:${column}`));
  const revealed = new Set((visual.revealed || []).map(([row, column]) => `${row}:${column}`));
  const cells = [];
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const key = `${row}:${column}`;
      cells.push(`<span class="${active.has(key) ? "active" : "empty"}">${active.has(key) && revealed.has(key) ? visual.cells[row][column] : ""}</span>`);
    }
  }
  return `<div class="b5-checker-wrap"><div class="b5-mini-cards">${visual.cardPool.map((value) => `<i>${value}</i>`).join("")}</div><div class="b5-checker-products"><div class="cells">${cells.join("")}</div><div class="rows">${visual.rowProducts.map((value) => `<b>${value}</b>`).join("")}</div><div class="columns">${visual.columnProducts.map((value) => `<b>${value}</b>`).join("")}</div><em>곱</em></div></div>`;
}

function triangularStairScene(stage, hideTotal = false) {
  const geometry = globalThis.GW_GEN;
  const renderer = globalThis.GW_RENDER;
  if (!geometry?.buildTriangularStairShape || !geometry?.triangularStairTotal || !renderer?.renderIso) {
    throw new Error("Geometry worksheet cube data is required for the triangular stair visual.");
  }
  const map = geometry.buildTriangularStairShape(stage);
  const total = geometry.triangularStairTotal(stage);
  if (geometry.mapTotal(map) !== total) throw new Error(`Triangular stair total mismatch at stage ${stage}.`);
  const svg = renderer.renderIso(map, stage, stage, { u: 14 })
    .replace('class="ws-iso"', `class="ws-iso b5-geometry-cubes" role="img" aria-label="${stage}단계 삼각 계단 쌓기나무" data-geometry-kind="triangular-stair" data-stage="${stage}" data-total="${total}"`);
  return `<figure>${svg}<figcaption>${stage}단계 <span>${hideTotal ? "몇 개?" : `${total}개`}</span></figcaption></figure>`;
}

function tetrahedralStair(visual) {
  const targetSet = new Set(visual.targetStages);
  const targets = visual.targetStages.map((stage) => `<b>${stage}단계 = ?</b>`).join("");
  return `<div class="b5-tetrahedral"><div>${visual.previewStages.map((stage) => triangularStairScene(stage, targetSet.has(stage))).join("")}</div><p>${targets}</p></div>`;
}

function squarePaperGrowth(visual) {
  return `<div class="b5-square-paper-growth">${visual.previewStages.map((stage) => `<div><span style="--order:${stage}">${Array.from({ length: stage * stage }, () => "<i></i>").join("")}</span><b>&lt;${stage}&gt;</b></div>`).join("")}<strong>… &lt;${visual.target}&gt;</strong></div>`;
}

function squareRowPair(visual) {
  let next = 1;
  const rows = [];
  for (let row = 1; row <= 4; row += 1) {
    rows.push(`<div>${Array.from({ length: row * 2 - 1 }, () => `<span>${next++}</span>`).join("")}</div>`);
  }
  return `<div class="b5-number-rows square">${rows.join("")}<strong>… ${visual.firstRow}번째 줄의 마지막 수 · ${visual.secondRow}번째 줄의 첫 수</strong></div>`;
}

function borderStoneGrowth(visual) {
  return `<div class="b5-border-growth">${visual.previewStages.map((stage) => {
    const side = stage + 2;
    return `<div><span style="--side:${side}">${Array.from({ length: side * side }, (_, index) => {
      const row = Math.floor(index / side);
      const column = index % side;
      const border = row === 0 || column === 0 || row === side - 1 || column === side - 1;
      return `<i class="${border ? "black" : "white"}"></i>`;
    }).join("")}</span><b>&lt;${stage}&gt;</b></div>`;
  }).join("")}<strong>… &lt;${visual.target}&gt;</strong></div>`;
}

function productMatrix(visual) {
  const columns = visual.cells[0].length;
  const reveals = visual.reveals ? new Set(visual.reveals.map(({ row, column }) => `${row}:${column}`)) : null;
  const items = [];
  visual.cells.forEach((rowValues, row) => rowValues.forEach((value, column) => {
    const target = visual.target.row === row && visual.target.column === column;
    const show = !visual.cardPool || reveals.has(`${row}:${column}`);
    items.push(`<span class="${target ? "target" : ""}">${target ? "?" : show ? value : ""}</span>`);
  }));
  const rows = visual.rowProducts.map((value) => `<b>${value}</b>`).join("");
  const columnsMarkup = visual.columnProducts.map((value) => `<b>${value}</b>`).join("");
  return `<div class="b5-matrix-wrap">${visual.cardPool ? `<div class="b5-mini-cards">${visual.cardPool.map((value) => `<i>${value}</i>`).join("")}</div>` : ""}<div class="b5-product-matrix"><div class="cells" style="--columns:${columns}">${items.join("")}</div><div class="row-products">${rows}</div><div class="column-products" style="--columns:${columns}">${columnsMarkup}</div><em>곱</em></div></div>`;
}

function symbolEquations(visual) {
  return `<div class="b5-symbol-equations">${visual.cardPool ? `<div class="b5-mini-cards">${visual.cardPool.map((value) => `<i>${value}</i>`).join("")}</div>` : ""}${visual.equations.map((equation) => `<p>${escapeHtml(equation)}</p>`).join("")}<strong>${escapeHtml(visual.target)} = ?</strong></div>`;
}

function peopleCircle(visual) {
  const center = 105;
  const radius = 75;
  const locations = Array.from({ length: visual.count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / visual.count;
    return { x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
  });
  const lines = visual.connect ? locations.flatMap((from, index) => locations.slice(index + 1).map((to) => `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`)).join("") : "";
  const people = locations.map((location, index) => `<g><circle cx="${location.x}" cy="${location.y}" r="14"/><text x="${location.x}" y="${location.y + 4}">${index + 1}</text></g>`).join("");
  return `<svg class="b5-people-circle" viewBox="0 0 210 210" role="img" aria-label="${escapeHtml(visual.label)} 관계">${lines}${people}<text class="center" x="105" y="109">${escapeHtml(visual.label)}</text></svg>`;
}

function selectionItems(visual) {
  return `<div class="b5-selection-items">${Array.from({ length: visual.count }, (_, index) => `<span>${index + 1}</span>`).join("")}<p>서로 다른 2개 고르기</p></div>`;
}

function pairLadder(visual) {
  return `<div class="b5-pair-ladder"><span>1</span><b>+</b><span>2</span><b>+</b><span>3</span><b>+</b><i>…</i><b>=</b><strong>${visual.pairCount}</strong></div>`;
}

function oddSquare(visual) {
  const shown = Math.min(visual.target, 6);
  return `<div class="b5-odd-square"><div>${Array.from({ length: shown }, (_, layer) => {
    const side = layer + 1;
    return `<span style="--side:${side}">${Array.from({ length: side * side }, () => "<i></i>").join("")}</span>`;
  }).join("")}</div><p>${visual.odds.slice(0, shown).join(" + ")}${visual.target > shown ? " + …" : ""}</p></div>`;
}

function oddTriangleLayers(visual) {
  return `<div class="b5-number-rows triangle">${visual.odds.map((count) => `<div>${Array.from({ length: count }, () => "<span></span>").join("")}</div>`).join("")}<strong>${visual.target}번째 모양</strong></div>`;
}

function pascal(visual) {
  return `<div class="b5-pascal">${visual.rows.map((row) => `<div>${row.map((value) => `<span>${value}</span>`).join("")}</div>`).join("")}${visual.targetRow > visual.rows.length ? `<strong>… ${visual.targetRow}번째 줄</strong>` : ""}</div>`;
}

function triangleCount(visual) {
  const order = visual.order;
  if (visual.mode === "fan") {
    const width = 250;
    const baseY = 175;
    const apexX = width / 2;
    const lines = Array.from({ length: order + 1 }, (_, index) => {
      const x = 20 + index * (width - 40) / order;
      return `<line x1="${apexX}" y1="20" x2="${x}" y2="${baseY}"/>`;
    }).join("");
    return `<svg class="b5-triangle-count" viewBox="0 0 ${width} 195">${lines}<line x1="20" y1="${baseY}" x2="${width - 20}" y2="${baseY}"/></svg>`;
  }
  const side = 220;
  const height = Math.sqrt(3) * side / 2;
  const step = side / order;
  const rowHeight = height / order;
  const lines = [];
  const latticePoint = (row, column) => ({ x: 120 - row * step / 2 + column * step, y: 15 + row * rowHeight });
  for (let row = 0; row <= order; row += 1) {
    for (let column = 0; column < row; column += 1) {
      const from = latticePoint(row, column);
      const to = latticePoint(row, column + 1);
      lines.push(`<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`);
    }
  }
  for (let row = 0; row < order; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      const from = latticePoint(row, column);
      const downLeft = latticePoint(row + 1, column);
      const downRight = latticePoint(row + 1, column + 1);
      lines.push(`<line x1="${from.x}" y1="${from.y}" x2="${downLeft.x}" y2="${downLeft.y}"/>`);
      lines.push(`<line x1="${from.x}" y1="${from.y}" x2="${downRight.x}" y2="${downRight.y}"/>`);
    }
  }
  return `<svg class="b5-triangle-count" viewBox="0 0 240 ${height + 30}">${lines.join("")}</svg>`;
}

function squareCount(visual) {
  return `<div class="b5-square-grid" style="--order:${visual.order}">${Array.from({ length: visual.order * visual.order }, () => "<span></span>").join("")}</div>`;
}

function numberRows(visual) {
  let next = 1;
  const rows = [];
  for (let row = 1; row <= visual.previewRows; row += 1) {
    const length = visual.mode === "triangle" ? row : row * 2 - 1;
    rows.push(`<div>${Array.from({ length }, () => `<span>${next++}</span>`).join("")}</div>`);
  }
  return `<div class="b5-number-rows ${visual.mode}">${rows.join("")}<strong>… ${visual.targetRow}번째 줄의 ${visual.askFirst ? "첫" : "마지막"} 수</strong></div>`;
}

// ── 골든벨 5권 원본 그림(교사용 슬라이드의 검정 문제 그대로, 빨강·파랑 답·풀이는 넣지 않는다) ──
// 수 배열표: 주어진 수만 적고, 물을 칸은 색칠한다(원본에는 길·화살표가 없다).
function sourceNumberTable(visual) {
  const shaded = new Set((visual.shaded || []).map(([r, c]) => `${r}:${c}`));
  const cells = visual.cells.flatMap((row, r) => row.map((value, c) => `<span class="${shaded.has(`${r}:${c}`) ? "shaded" : ""}">${escapeHtml(value ?? "")}</span>`)).join("");
  const columns = visual.cells[0].length;
  // 7칸 넘는 표는 휴대폰 화면 안에 들어오게 칸을 줄인다.
  return `<div class="b5-src-table${columns >= 7 ? " is-wide" : ""}" style="--columns:${columns}" role="img" aria-label="수 배열표">${cells}</div>`;
}

// 숫자 카드 한 줄
function sourceDigitCards(visual) {
  const cards = visual.digits.map((digit) => `<span>${escapeHtml(digit)}</span>`).join("");
  return `<div class="b5-src-cards" role="img" aria-label="숫자 카드 ${visual.digits.join(", ")}"><div>${cards}</div>${visual.ask ? `<p>${escapeHtml(visual.ask)} →</p>` : ""}</div>`;
}

// 곱셈 매트릭스: 색칠된 칸에 카드를 넣는다. 글자(A, B, C)는 색칠된 칸에 있다.
function sourceProductGrid(visual) {
  const shaded = new Set(visual.shaded.map(([r, c]) => `${r}:${c}`));
  const size = visual.rowProducts.length;
  const cells = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) cells.push(`<span class="${shaded.has(`${r}:${c}`) ? "shaded" : ""}">${escapeHtml(visual.letters?.[r]?.[c] || "")}</span>`);
    cells.push(`<b>${visual.rowProducts[r]}</b>`);
  }
  visual.columnProducts.forEach((value) => cells.push(`<b>${value}</b>`));
  return `<div class="b5-src-product" style="--size:${size}" role="img" aria-label="곱셈 매트릭스">${cells.join("")}</div>`;
}

// 사각형 피라미드: 한 줄에 1, 3, 5…개
function sourceSquarePyramid(visual) {
  const rows = Array.from({ length: visual.rows }, (_, i) => `<div>${Array.from({ length: i * 2 + 1 }, () => "<i></i>").join("")}</div>`).join("");
  return `<div class="b5-src-pyramid" role="img" aria-label="사각형을 쌓은 모양">${rows}<em>⋮</em></div>`;
}

// 삼각형 나누기: 큰 삼각형을 한 줄에 1, 3, 5…개 작은 삼각형으로
function sourceTriangleRows(visual) {
  const n = visual.rows, side = 30, h = side * Math.sqrt(3) / 2, w = n * side;
  const lines = [];
  for (let k = 1; k <= n; k += 1) {
    const y = k * h, half = k * side / 2;
    lines.push(`<line x1="${w / 2 - half}" y1="${y}" x2="${w / 2 + half}" y2="${y}"/>`);
  }
  // 두 빗변과 나란한 선
  const slants = Array.from({ length: n + 1 }, (_, k) => `<line x1="${w / 2 + k * side / 2}" y1="${k * h}" x2="${k * side}" y2="${n * h}"/><line x1="${w / 2 - k * side / 2}" y1="${k * h}" x2="${w - k * side}" y2="${n * h}"/>`).join("");
  return `<div class="b5-src-trirows" role="img" aria-label="작은 삼각형으로 나눈 큰 삼각형"><svg viewBox="-2 -2 ${w + 4} ${n * h + 4}">${lines.join("")}${slants}</svg><em>⋮</em></div>`;
}

// 쌓기나무 한 무더기(층마다 삼각수만큼) — 개수 글자를 붙이지 않는다.
function sourceCubeStair(visual) {
  const geometry = globalThis.GW_GEN;
  const renderer = globalThis.GW_RENDER;
  if (!geometry?.buildTriangularStairShape || !renderer?.renderIso) throw new Error("Geometry worksheet cube data is required for the cube stair visual.");
  const map = geometry.buildTriangularStairShape(visual.stage);
  const svg = renderer.renderIso(map, visual.stage, visual.stage, { u: 22 })
    .replace('class="ws-iso"', `class="ws-iso b5-geometry-cubes b5-src-stair" role="img" aria-label="층층이 쌓은 쌓기나무"`);
  return `<div class="b5-src-cube-stair">${svg}</div>`;
}

// 수열 한 줄: 앞의 수, 빈 상자(주어진 수가 든 상자 포함), 물을 상자는 색칠. more면 「…」로 이어진다.
function sourceSequence(visual) {
  const shaded = new Set(visual.shaded || []);
  const parts = (visual.values || []).map((value) => `<span class="num">${escapeHtml(value)}</span>`);
  (visual.boxes || []).forEach((value, index) => parts.push(`<span class="box${shaded.has(index) ? " shaded" : ""}">${escapeHtml(value ?? "")}</span>`));
  if (visual.more) parts.push('<span class="num">…</span>');
  const label = `수열 ${(visual.values || []).join(", ")}${visual.boxes?.length ? ` 뒤에 상자 ${visual.boxes.length}칸` : ""}`;
  // 쉼표는 앞 수에 붙여 줄이 바뀌어도 줄 머리에 쉼표가 오지 않게 한다.
  const items = parts.map((part, index) => `<span class="it">${part}${index < parts.length - 1 ? "<i>,</i>" : ""}</span>`);
  return `<div class="b5-src-seq" role="img" aria-label="${escapeHtml(label)}">${items.join("")}</div>`;
}

// 가운데 도형에서 뻗은 갈래 줄. 갈래마다 1부터 차례로 하나씩 돌아가며 놓인 수와 끝의 「…」.
// shape: "triangle"(3갈래 Y) | "square"(4갈래 X). 갈래 i의 수는 visual.arms[i].numbers.
const RADIAL_GEOMETRY = {
  triangle: {
    polygon: [[160, 84], [104, 181], [216, 181]], length: 128, gap: 26,
    arms: [
      { from: [160, 84], dir: [0, -1], side: [1, 0], label: [160, 124] },
      { from: [216, 181], dir: [0.866, 0.5], side: [0.5, -0.866], label: [194, 166] },
      { from: [104, 181], dir: [-0.866, 0.5], side: [-0.5, -0.866], label: [126, 166] }
    ]
  },
  square: {
    polygon: [[126, 110], [194, 110], [194, 178], [126, 178]], length: 132, gap: 25,
    arms: [
      { from: [126, 110], dir: [-0.707, -0.707], side: [0.707, -0.707], label: [144, 128] },
      { from: [194, 110], dir: [0.707, -0.707], side: [-0.707, -0.707], label: [176, 128] },
      { from: [194, 178], dir: [0.707, 0.707], side: [0.707, -0.707], label: [176, 160] },
      { from: [126, 178], dir: [-0.707, 0.707], side: [-0.707, -0.707], label: [144, 160] }
    ]
  }
};
function sourceRadialRows(visual) {
  const geo = RADIAL_GEOMETRY[visual.shape];
  if (!geo || geo.arms.length !== visual.arms.length) throw new Error("radial rows: shape and arm count disagree");
  const first = 17;
  const at = (p, d, t) => [p[0] + d[0] * t, p[1] + d[1] * t];
  const points = [...geo.polygon];
  const out = [`<polygon points="${geo.polygon.map((p) => p.join(",")).join(" ")}" class="plate"/>`];
  visual.arms.forEach((arm, i) => {
    const g = geo.arms[i];
    const end = at(g.from, g.dir, geo.length);
    points.push(end);
    out.push(`<line x1="${g.from[0]}" y1="${g.from[1]}" x2="${end[0].toFixed(1)}" y2="${end[1].toFixed(1)}"/>`);
    arm.numbers.forEach((n, k) => {
      const [x, y] = at(at(g.from, g.dir, first + geo.gap * k), g.side, 14);
      points.push([x, y]);
      out.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="num">${escapeHtml(n)}</text>`);
    });
    const [dx, dy] = at(at(g.from, g.dir, first + geo.gap * arm.numbers.length), g.side, 14);
    points.push([dx, dy]);
    out.push(`<text x="${dx.toFixed(1)}" y="${dy.toFixed(1)}" class="more">${g.dir[0] === 0 ? "⋮" : "⋯"}</text>`);
    out.push(`<text x="${g.label[0]}" y="${g.label[1]}" class="label">${escapeHtml(arm.label)}</text>`);
  });
  // 그림이 차지한 범위에 여백을 더해 viewBox를 잡는다(글자 반 폭 여유 포함).
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]), pad = 16;
  const box = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2].map((v) => Math.round(v));
  const desc = visual.arms.map((arm) => `${arm.label}번 줄 ${arm.numbers.join(", ")}`).join(" / ");
  return `<div class="b5-src-radial" role="img" aria-label="${escapeHtml(`가운데에서 뻗은 ${visual.arms.length}갈래 줄: ${desc} …`)}"><svg viewBox="${box.join(" ")}" style="aspect-ratio:${box[2]}/${box[3]}">${out.join("")}</svg></div>`;
}

// 삼각 배열: 첫째 줄 1개, 둘째 줄 2개… 아래에 「⋮」
function sourceTriangleNumbers(visual) {
  const rows = visual.rows.map((row) => `<div>${row.map((n) => `<span>${escapeHtml(n)}</span>`).join("")}</div>`).join("");
  return `<div class="b5-src-tri-numbers" role="img" aria-label="${escapeHtml(`삼각 배열 ${visual.rows.map((row) => row.join(" ")).join(" / ")} …`)}">${rows}<em>⋮</em></div>`;
}

// 두 수와 합: 동그라미 둘(A·B 라벨, 「+7」 같은 덧붙은 수), 오른쪽 괄호와 「합 : N」. values가 있으면 동그라미에 수를 쓴다(개념 설명용).
function sourceSumPair(visual) {
  const rows = visual.rows.map((row, index) => {
    const y = 26 + index * 52;
    const label = row.label ? `<text x="14" y="${y}" class="label">${escapeHtml(row.label)} :</text>` : "";
    const value = visual.values?.[index] != null ? `<text x="${row.label ? 74 : 40}" y="${y}" class="value">${escapeHtml(visual.values[index])}</text>` : "";
    const offset = row.offset ? `<text x="${row.label ? 100 : 66}" y="${y + (index ? 6 : -2)}" class="offset">${escapeHtml(row.offset)}</text>` : "";
    return `<circle cx="${row.label ? 74 : 40}" cy="${y}" r="20"/>${label}${value}${offset}`;
  }).join("");
  // 괄호는 가장 긴 덧붙은 수(「+14」 등)가 끝난 뒤에 둔다.
  const x = (visual.rows.some((row) => row.label) ? 100 : 66) + Math.max(28, ...visual.rows.map((row) => (row.offset || "").length * 12)) + 16;
  const svg = `<svg viewBox="0 0 ${x + 92} 104">${rows}<path d="M${x - 6} 12 Q${x + 18} 18 ${x + 18} 52 Q${x + 18} 86 ${x - 6} 92" class="brace"/><text x="${x + 26}" y="52" class="sum">합 : ${escapeHtml(visual.sum)}</text></svg>`;
  return `<div class="b5-src-sum-pair" role="img" aria-label="${escapeHtml(`두 수, 합 ${visual.sum}`)}">${svg}</div>`;
}

// 달력 일부 칸: shape "vertical"(위아래, rows칸 · 처음과 끝이 색칠) 또는 "diagonal"(2×2, 왼쪽 위와 오른쪽 아래 색칠)
function sourceCalendarCells(visual) {
  const cells = visual.shape === "diagonal"
    ? [["shaded", ""], ["", "shaded"]].map((row) => `<div>${row.map((c) => `<span class="${c}"></span>`).join("")}</div>`).join("")
    : Array.from({ length: visual.rows }, (_, i) => `<div><span class="${i === 0 || i === visual.rows - 1 ? "shaded" : ""}"></span></div>`).join("");
  return `<div class="b5-src-cal-cells" role="img" aria-label="${escapeHtml(`달력 칸 ${visual.shape === "diagonal" ? "대각선 두 칸" : `세로 ${visual.rows}칸 중 양 끝`}, 합 ${visual.sum}`)}"><div class="cells">${cells}</div><b class="brace" aria-hidden="true"></b><strong>합 : ${escapeHtml(visual.sum)}</strong></div>`;
}

// 한 달 달력 틀: 제목, 일~토 머리글, rows줄. cells는 {r, c, value?, shaded?} 목록.
const WEEK_HEAD = ["일", "월", "화", "수", "목", "금", "토"];
function sourceMonthGrid(visual) {
  const map = new Map((visual.cells || []).map((cell) => [`${cell.r}:${cell.c}`, cell]));
  const body = Array.from({ length: visual.rows || 5 }, (_, r) => WEEK_HEAD.map((_, c) => {
    const cell = map.get(`${r}:${c}`);
    return `<span class="${cell?.shaded ? "shaded" : ""}">${cell?.value != null ? escapeHtml(cell.value) : ""}</span>`;
  }).join("")).join("");
  const head = WEEK_HEAD.map((day, c) => `<b class="${c === 0 ? "sun" : ""}">${day}</b>`).join("");
  const title = visual.title ? `<p>${escapeHtml(visual.title)}</p>` : "";
  return `<div class="b5-src-month" role="img" aria-label="${escapeHtml(`${visual.title || ""} 달력`)}">${title}<div class="grid">${head}${body}</div></div>`;
}

// 한 해 달력(작은 달 12개): Date로 계산. 각 달의 마지막 날에 노랑 동그라미.
function sourceYearCalendar(visual) {
  const months = Array.from({ length: 12 }, (_, m) => {
    const first = new Date(Date.UTC(visual.year, m, 1)).getUTCDay();
    const days = new Date(Date.UTC(visual.year, m + 1, 0)).getUTCDate();
    const cells = [...Array(first).fill(""), ...Array.from({ length: days }, (_, d) => d + 1)];
    const body = cells.map((d, i) => `<i class="${d === days ? "last" : ""}${i % 7 === 0 && d ? " sun" : ""}">${d}</i>`).join("");
    return `<section><h4>${m + 1}</h4><div>${WEEK_HEAD.map((day, c) => `<i class="head${c === 0 ? " sun" : ""}">${day}</i>`).join("")}${body}</div></section>`;
  }).join("");
  return `<div class="b5-src-year" role="img" aria-label="${escapeHtml(`${visual.year}년 달력`)}"><h3>${escapeHtml(visual.year)}</h3><div class="months">${months}</div></div>`;
}

export function book05Markup(visual) {
  if (!visual || visual.kind !== "book5") return "";
  switch (visual.subtype) {
    case "path-number-grid":
    case "diagonal-number-grid": return pathGrid(visual);
    case "line-cycle": return lineCycle(visual);
    case "finger-bounce": return fingerBounce(visual);
    case "calendar": return calendarMarkup(visual);
    case "calendar-pair": return calendarPair(visual);
    case "route-grid": return routeGrid(visual);
    case "digit-cards": return digitCards(visual);
    case "source-number-table": return sourceNumberTable(visual);
    case "source-digit-cards": return sourceDigitCards(visual);
    case "source-product-grid": return sourceProductGrid(visual);
    case "source-square-pyramid": return sourceSquarePyramid(visual);
    case "source-triangle-rows": return sourceTriangleRows(visual);
    case "source-cube-stair": return sourceCubeStair(visual);
    case "source-sequence": return sourceSequence(visual);
    case "source-radial-rows": return sourceRadialRows(visual);
    case "source-triangle-numbers": return sourceTriangleNumbers(visual);
    case "source-sum-pair": return sourceSumPair(visual);
    case "source-calendar-cells": return sourceCalendarCells(visual);
    case "source-month-grid": return sourceMonthGrid(visual);
    case "source-year-calendar": return sourceYearCalendar(visual);
    case "digit-condition": return digitCondition(visual);
    case "multiplication-table": return multiplicationTable(visual);
    case "product-cycle": return productCycle(visual);
    case "product-matrix": return productMatrix(visual);
    case "symbol-equations": return symbolEquations(visual);
    case "people-circle": return peopleCircle(visual);
    case "selection-items": return selectionItems(visual);
    case "pair-ladder": return pairLadder(visual);
    case "odd-square": return oddSquare(visual);
    case "odd-triangle-layers": return oddTriangleLayers(visual);
    case "pascal": return pascal(visual);
    case "triangle-count": return triangleCount(visual);
    case "square-count": return squareCount(visual);
    case "number-rows": return numberRows(visual);
    case "row-major-targets": return rowMajorTargets(visual);
    case "radial-cycle": return radialCycle(visual);
    case "checkerboard-products": return checkerboardProducts(visual);
    case "tetrahedral-stair": return tetrahedralStair(visual);
    case "square-paper-growth": return squarePaperGrowth(visual);
    case "square-row-pair": return squareRowPair(visual);
    case "border-stone-growth": return borderStoneGrowth(visual);
    default: return "";
  }
}
