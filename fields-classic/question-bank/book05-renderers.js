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

function isoCube(x, y, level, size = 13) {
  const px = 82 + (x - y) * size;
  const py = 22 + (x + y) * size * 0.55 - level * size;
  const half = size;
  const rise = size * 0.5;
  return `<g transform="translate(${px} ${py})"><path class="top" d="M0 0L${half} ${-rise}L${half * 2} 0L${half} ${rise}Z"/><path class="left" d="M0 0L${half} ${rise}V${rise + size}L0 ${size}Z"/><path class="right" d="M${half * 2} 0L${half} ${rise}V${rise + size}L${half * 2} ${size}Z"/></g>`;
}

function triangularStairScene(stage, hideTotal = false) {
  const cubes = [];
  for (let y = stage - 1; y >= 0; y -= 1) {
    for (let x = stage - y - 1; x >= 0; x -= 1) {
      const height = stage - x - y;
      for (let level = 0; level < height; level += 1) cubes.push(isoCube(x, y, level));
    }
  }
  const total = Array.from({ length: stage }, (_, index) => (index + 1) * (index + 2) / 2).reduce((sum, value) => sum + value, 0);
  return `<figure><svg viewBox="0 -18 164 128" role="img" aria-label="${stage}단계 삼각 계단 쌓기나무">${cubes.join("")}</svg><figcaption>${stage}단계 <span>${hideTotal ? "몇 개?" : `${total}개`}</span></figcaption></figure>`;
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
    case "digit-condition": return digitCondition(visual);
    case "multiplication-table": return multiplicationTable(visual);
    case "product-cycle": return productCycle(visual);
    case "product-matrix": return productMatrix(visual);
    case "symbol-equations": return symbolEquations(visual);
    case "people-circle": return peopleCircle(visual);
    case "selection-items": return selectionItems(visual);
    case "pair-ladder": return pairLadder(visual);
    case "odd-square": return oddSquare(visual);
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
