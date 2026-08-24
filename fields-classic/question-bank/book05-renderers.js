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
  return `<div class="b5-calendar"><strong>${calendar.month}월</strong><div class="weekdays">${["일", "월", "화", "수", "목", "금", "토"].map((day) => `<b>${day}</b>`).join("")}</div><div class="dates">${calendar.cells.map((date, index) => {
    const target = date === targetDate || (targetWeekday !== null && index % 7 === targetWeekday && date);
    const hidden = hiddenDates.has(date);
    return `<span class="${target || hidden ? "target" : ""}">${hidden ? "?" : date || ""}</span>`;
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
  const dots = [];
  for (let row = 0; row < visual.rows; row += 1) {
    for (let column = 0; column < visual.columns; column += 1) {
      const location = point([row, column], cell, inset);
      const key = `${row}:${column}`;
      const start = row === 0 && column === 0;
      const end = row === visual.rows - 1 && column === visual.columns - 1;
      const waypoint = visual.waypoint?.row === row && visual.waypoint?.column === column;
      const label = start ? "출" : end ? "도" : waypoint ? "★" : blocked.has(key) ? "×" : "";
      dots.push(`<g class="${blocked.has(key) ? "blocked" : waypoint ? "waypoint" : start || end ? "endpoint" : ""}"><circle cx="${location.x}" cy="${location.y}" r="9"/><text x="${location.x}" y="${location.y + 3}">${label}</text></g>`);
    }
  }
  return `<svg class="b5-route-grid" viewBox="0 0 ${width} ${height}" role="img" aria-label="최단거리 길 찾기">${lines.join("")}${dots.join("")}</svg>`;
}

function digitCards(visual) {
  return `<div class="b5-card-task"><div>${visual.digits.map((digit) => `<span>${digit}</span>`).join("")}</div><p>${visual.length}자리 수${visual.targetRank ? ` · 작은 수부터 <b>${visual.targetRank}번째</b>` : " · 모두 몇 개?"}</p></div>`;
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
  const visible = new Set(visual.visibleVertices);
  const vertices = locations.map((location, index) => `<g class="${index === visual.targetIndex ? "target" : ""}"><circle cx="${location.x}" cy="${location.y}" r="18"/><text x="${location.x}" y="${location.y + 5}">${index === visual.targetIndex ? "?" : visible.has(index) ? visual.vertices[index] : ""}</text></g>`).join("");
  return `<svg class="b5-product-cycle" viewBox="0 0 220 220" role="img" aria-label="이웃한 두 수의 곱">${edges}${vertices}</svg>`;
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
  return `<div class="b5-symbol-equations">${visual.equations.map((equation) => `<p>${escapeHtml(equation)}</p>`).join("")}<strong>${escapeHtml(visual.target)} = ?</strong></div>`;
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
  const lines = [];
  for (let row = 0; row <= order; row += 1) {
    const y = 15 + row * height / order;
    const left = 120 - (row * side / order) / 2;
    const right = 120 + (row * side / order) / 2;
    lines.push(`<line x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>`);
  }
  for (let index = 0; index <= order; index += 1) {
    const baseX = 10 + index * side / order;
    lines.push(`<line x1="120" y1="15" x2="${baseX}" y2="${15 + height}"/>`);
  }
  for (let index = 0; index <= order; index += 1) {
    const baseX = 230 - index * side / order;
    lines.push(`<line x1="120" y1="15" x2="${baseX}" y2="${15 + height}"/>`);
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
    default: return "";
  }
}
