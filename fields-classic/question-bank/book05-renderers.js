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
  const cells = visual.cells.flatMap((row, r) => row.map((value, c) => `<span class="${shaded.has(`${r}:${c}`) ? "shaded" : visual.head && r === 0 ? "head" : ""}">${escapeHtml(value ?? "")}</span>`)).join("");
  const columns = visual.cells[0].length;
  // 7칸 넘는 표는 휴대폰 화면 안에 들어오게 칸을 줄인다.
  const wide = columns >= 7 ? " is-wide" : "";
  // head: 첫 줄을 머리줄(연보라)로. arrows: [{row:"top"|"bottom", at, label}] — at번째 칸에서 다음 칸으로 넘어가는 굽은 화살표(7권 17쪽 「+4」).
  const table = `<div class="b5-src-table${wide}" style="--columns:${columns}" role="img" aria-label="${escapeHtml(visual.label || "수 배열표")}">${cells}</div>`;
  if (!visual.arrows?.length) return table;
  const notes = (row) => {
    const marks = visual.arrows.filter((a) => a.row === row).map((a) => `<span style="grid-column:${a.at + 1} / span 2"><svg viewBox="0 0 40 12" preserveAspectRatio="none"><path d="${row === "top" ? "M10 11 Q20 -3 30 11" : "M10 1 Q20 15 30 1"}"/><path class="tip" d="${row === "top" ? "M27 7 L30 11 L31 6" : "M27 5 L30 1 L31 6"}"/></svg><b>${escapeHtml(a.label)}</b></span>`).join("");
    return marks ? `<div class="b5-src-table-notes ${row}" style="--columns:${columns}">${marks}</div>` : "";
  };
  return `<div class="b5-src-table-wrap${wide}" style="--columns:${columns}">${notes("top")}${table}${notes("bottom")}</div>`;
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

// 최단거리 그림: rows×cols 칸. cells(그리는 칸, 없으면 전부)·bold(굵은 칸 = 길)·diagonals(칸의 왼쪽 위→오른쪽 아래)·points(점과 글자)·numbers(꼭짓점의 수, 개념 설명용)
function sourceRoute(visual) {
  const u = visual.unit || 58, pad = 30;
  const cells = visual.cells || Array.from({ length: visual.rows }, (_, r) => Array.from({ length: visual.cols }, (_, c) => [r, c])).flat();
  const X = (c) => pad + c * u, Y = (r) => pad + r * u;
  const edges = (list) => {
    const set = new Set();
    for (const [r, c] of list) for (const e of [[r, c, r, c + 1], [r + 1, c, r + 1, c + 1], [r, c, r + 1, c], [r, c + 1, r + 1, c + 1]]) set.add(e.join(","));
    return [...set].map((k) => k.split(",").map(Number));
  };
  const line = ([r1, c1, r2, c2], cls) => `<line class="${cls}" x1="${X(c1)}" y1="${Y(r1)}" x2="${X(c2)}" y2="${Y(r2)}"/>`;
  const thin = edges(cells).map((e) => line(e, "thin")).join("");
  const bold = edges(visual.bold || []).map((e) => line(e, "bold")).join("");
  const diag = (visual.diagonals || []).map(([r, c]) => line([r, c, r + 1, c + 1], "bold")).join("");
  const nums = (visual.numbers || []).map(({ r, c, v }) => `<text class="num" x="${X(c) + 5}" y="${Y(r) - 6}">${escapeHtml(v)}</text>`).join("");
  const offsets = { nw: [-10, -10, "end"], se: [10, 16, "start"], ne: [8, -10, "start"], sw: [-10, 16, "end"], e: [10, 5, "start"] };
  const pts = (visual.points || []).map(({ r, c, label, pos = "nw" }) => {
    const [dx, dy, anchor] = offsets[pos];
    return `<circle cx="${X(c)}" cy="${Y(r)}" r="4.5"/>${label ? `<text class="pt" x="${X(c) + dx}" y="${Y(r) + dy}" text-anchor="${anchor}">${escapeHtml(label)}</text>` : ""}`;
  }).join("");
  const maxR = Math.max(...cells.map(([r]) => r)) + 1, maxC = Math.max(...cells.map(([, c]) => c)) + 1;
  const w = pad * 2 + maxC * u + 24, h = pad * 2 + maxR * u;
  return `<div class="b5-src-route" role="img" aria-label="${escapeHtml(visual.label || "최단거리 길 그림")}"><svg viewBox="-12 0 ${w} ${h}" style="width:min(100%,${Math.max(230, Math.round(w * 1.25))}px);--route-w:${w}">${thin}${bold}${diag}${pts}${nums}</svg></div>`;
}

// 두 타원 길(23쪽): 왼쪽 타원(위·아래 두 길), 오른쪽 타원(위·가운데·아래 세 길)
function sourceLoopRoutes() {
  return `<div class="b5-src-loops" role="img" aria-label="출발에서 왼쪽 타원(두 길)을 지나 오른쪽 타원(세 길)으로 도착까지 가는 길"><svg viewBox="0 0 330 120"><ellipse cx="102" cy="60" rx="58" ry="32" class="left"/><ellipse cx="218" cy="60" rx="58" ry="38" class="right"/><line x1="160" y1="60" x2="276" y2="60" class="right"/><circle cx="44" cy="60" r="4.5"/><circle cx="160" cy="60" r="4.5"/><circle cx="276" cy="60" r="4.5"/><text x="38" y="64" text-anchor="end">출발</text><text x="283" y="64">도착</text></svg></div>`;
}

// 자리 숫자 빈칸: 「___ + ___ = 8」 꼴. 빈칸 아래에 십의자리·일의자리.
function sourcePlaceSlots(visual) {
  const slot = (label) => `<span class="slot"><i></i><small>${label}</small></span>`;
  return `<div class="b5-src-slots" role="img" aria-label="${escapeHtml(`십의 자리 ${visual.op} 일의 자리 ${visual.tail}`)}">${slot("십의자리")}<b>${escapeHtml(visual.op)}</b>${slot("일의자리")}<b>${escapeHtml(visual.tail)}</b></div>`;
}

// 곱셈 원·네모 그림 공용: ○는 2~9의 수(비면 글자), □는 양쪽 ○의 곱.
const productCircle = (x, y, v, label) => `<circle cx="${x}" cy="${y}" r="21" class="c${v == null ? " blank" : ""}"/><text x="${x}" y="${y}" class="${v == null ? "lbl" : "v"}">${escapeHtml(v ?? label ?? "")}</text>`;
const productSquare = (x, y, v) => `<rect x="${x - 21}" y="${y - 21}" width="42" height="42" class="s"/><text x="${x}" y="${y}" class="v">${escapeHtml(v)}</text>`;

// A ─(곱)─ B
function sourcePairProduct(visual) {
  return `<div class="b5-src-prod" role="img" aria-label="${escapeHtml(`A와 B의 곱 ${visual.product}`)}"><svg viewBox="0 0 180 70" style="width:min(100%,240px)"><line x1="40" y1="44" x2="140" y2="44"/>${productCircle(40, 44, null, "A")}${productCircle(140, 44, null, "B")}<text x="90" y="24" class="v">${escapeHtml(visual.product)}</text></svg></div>`;
}

// 세 원(위 A, 왼쪽 아래 B, 오른쪽 아래 C)과 그 사이 곱 네모 셋
function sourceProductTriangle(visual) {
  const [ab, ac, bc] = visual.products;
  const P = { A: [130, 30], B: [40, 180], C: [220, 180] };
  const mid = (a, b) => [(P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2];
  const lines = [["A", "B"], ["A", "C"], ["B", "C"]].map(([a, b]) => `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}"/>`).join("");
  const sq = [[mid("A", "B"), ab], [mid("A", "C"), ac], [mid("B", "C"), bc]].map(([[x, y], v]) => productSquare(x, y, v)).join("");
  const circ = ["A", "B", "C"].map((k) => productCircle(P[k][0], P[k][1], visual.values?.[k], k)).join("");
  return `<div class="b5-src-prod" role="img" aria-label="${escapeHtml(`세 원 A, B, C와 곱 ${visual.products.join(", ")}`)}"><svg viewBox="10 4 240 204" style="width:min(100%,300px)">${lines}${sq}${circ}</svg></div>`;
}

// 사각형·오각형 고리: 꼭짓점 ○(circles, 비면 null → 가·나 글자), 변 가운데 □(squares[i] = circles[i]×circles[i+1])
function sourceProductRing(visual) {
  const n = visual.circles.length;
  const pts = n === 4 ? [[40, 40], [220, 40], [220, 200], [40, 200]]
    : Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [150 + 110 * Math.cos(a), 135 + 110 * Math.sin(a)]; });
  const lines = pts.map((p, i) => { const q = pts[(i + 1) % n]; return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`; }).join("");
  const sq = pts.map((p, i) => { const q = pts[(i + 1) % n]; return productSquare((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, visual.squares[i]); }).join("");
  let blank = 0;
  const circ = pts.map((p, i) => productCircle(p[0], p[1], visual.circles[i], visual.circles[i] == null ? ["가", "나", "다"][blank++] : "")).join("");
  const view = n === 4 ? "10 10 240 220" : "15 0 270 270";
  return `<div class="b5-src-prod" role="img" aria-label="${escapeHtml(`곱셈 고리: 원 ${visual.circles.map((v) => v ?? "빈칸").join(", ")} / 네모 ${visual.squares.join(", ")}`)}"><svg viewBox="${view}" style="width:min(100%,300px)">${lines}${sq}${circ}</svg></div>`;
}

// 선분 나누기: pieces(같은 간격 조각 수)+total(아래 묶음), 또는 start·end(양 끝 수)+half(위 묶음, 앞 절반 길이). 가운데 점 아래는 빈 상자.
function sourceSegment(visual) {
  if (visual.pieces) {
    const w = 64 * visual.pieces, x0 = 14, y = 22;
    const ticks = Array.from({ length: visual.pieces + 1 }, (_, i) => `<line class="tick" x1="${x0 + (w * i) / visual.pieces}" y1="${y - 9}" x2="${x0 + (w * i) / visual.pieces}" y2="${y + 9}"/>`).join("");
    const brace = `<path class="arc" d="M${x0} ${y + 3}Q${x0} ${y + 34} ${x0 + w / 2 - 24} ${y + 34}M${x0 + w / 2 + 24} ${y + 34}Q${x0 + w} ${y + 34} ${x0 + w} ${y + 3}"/>`;
    return `<div class="b5-src-seg" role="img" aria-label="${escapeHtml(`길이 ${visual.total}인 선분을 같은 간격으로 ${visual.pieces}조각으로 자름`)}"><svg viewBox="0 0 ${w + 28} 72" style="width:min(100%,${Math.round((w + 28) * 1.5)}px);--seg-w:${w + 28}"><line class="seg" x1="${x0}" y1="${y}" x2="${x0 + w}" y2="${y}"/>${ticks}${brace}<text x="${x0 + w / 2}" y="${y + 36}">${escapeHtml(visual.total)}</text></svg></div>`;
  }
  const w = 240, x0 = 24, y = 50, m = x0 + w / 2;
  const tick = (x) => `<line class="tick" x1="${x}" y1="${y - 9}" x2="${x}" y2="${y + 9}"/>`;
  return `<div class="b5-src-seg" role="img" aria-label="${escapeHtml(`수직선 위 ${visual.start}과 ${visual.end} 사이를 똑같이 나눈 가운데 점${visual.half == null ? "" : `, 앞쪽 절반 길이 ${visual.half}`}`)}"><svg viewBox="0 0 ${w + 48} 112" style="width:min(100%,${Math.round((w + 48) * 1.5)}px);--seg-w:${w + 48}"><line class="seg" x1="${x0}" y1="${y}" x2="${x0 + w}" y2="${y}"/>${tick(x0)}${tick(m)}${tick(x0 + w)}${visual.half == null ? "" : `<path class="arc" d="M${x0} ${y - 2}Q${(x0 + m) / 2} ${y - 46} ${m} ${y - 2}"/><text x="${(x0 + m) / 2}" y="${y - 32}">${escapeHtml(visual.half)}</text>`}<text x="${x0}" y="${y + 28}">${escapeHtml(visual.start)}</text><text x="${x0 + w}" y="${y + 28}">${escapeHtml(visual.end)}</text><rect class="box" x="${m - 17}" y="${y + 13}" width="34" height="30" rx="5"/><text class="q" x="${m}" y="${y + 28}">${escapeHtml(visual.value ?? "?")}</text></svg></div>`;
}

// 도형식: 같은 모양은 같은 수. 모양 색은 색표(그림 규칙 스킬) 그대로, 오각형은 주황.
const SHAPE_GLYPH = {
  circle: ["동그라미", "#e8503a", "#ffe1dc", '<circle cx="17" cy="17" r="14"/>'],
  triangle: ["세모", "#2f9e5f", "#dcf5e5", '<polygon points="17,3 31,30 3,30"/>'],
  square: ["네모", "#2f6fe0", "#dde9ff", '<rect x="4" y="4" width="26" height="26"/>'],
  diamond: ["마름모", "#8e5bd8", "#ece0fb", '<polygon points="17,2 32,17 17,32 2,17"/>'],
  star: ["별", "#f0b23a", "#fff3c4", '<polygon points="17,2 21,13 32,13 23,20 26,31 17,24 8,31 11,20 2,13 13,13"/>'],
  heart: ["하트", "#e0559a", "#fde0ee", '<path d="M17 31C3 21 2 12 7 7c4-4 9-2 10 3 1-5 6-7 10-3 5 5 4 14-10 24z"/>'],
  pentagon: ["오각형", "#f39a1e", "#ffe9cc", '<polygon points="17,2 32,13 26,31 8,31 2,13"/>']
};
const shapeGlyph = (kind, value) => {
  const [name, line, fill, body] = SHAPE_GLYPH[kind];
  return `<span class="g" aria-label="${name}"><svg viewBox="0 0 34 34" style="--line:${line};--fill:${fill}">${body}</svg>${value == null ? "" : `<b>${escapeHtml(value)}</b>`}</span>`;
};
const shapeToken = (token, values) => SHAPE_GLYPH[token] ? shapeGlyph(token, values?.[token]) : `<span class="t${/^[+×=\-]$/.test(token) ? " op" : ""}">${escapeHtml(token)}</span>`;
const shapeWords = (row) => row.map((token) => SHAPE_GLYPH[token]?.[0] ?? token).join(" ");

// cards(숫자 카드)·range(수의 범위)·rows(식)·ask(「모양 = ?」 줄)
function sourceShapeEquations(visual) {
  const cards = visual.cards ? `<div class="cards">${visual.cards.map((d) => `<span>${escapeHtml(d)}</span>`).join("")}</div>` : "";
  const range = visual.range ? `<p class="range">(${escapeHtml(visual.range)})</p>` : "";
  const rows = visual.rows.map((row) => `<p>${row.map((token) => shapeToken(token, visual.values)).join("")}</p>`).join("");
  // ask 원소: 모양 이름 하나(「○ = ?」) 또는 식 토큰 배열(「□ + ⬠ = ?」)
  const askTokens = (a) => (Array.isArray(a) ? a : [a]);
  const ask = (visual.ask || []).length ? `<p class="ask">${visual.ask.map((a) => `<span class="pair">${askTokens(a).map((t) => shapeToken(t)).join("")}<span class="t op">=</span><span class="t">?</span></span>`).join("")}</p>` : "";
  const label = [visual.cards ? `숫자 카드 ${visual.cards.join(", ")}` : "", visual.range ? `범위 ${visual.range}` : "", ...visual.rows.map(shapeWords), ...(visual.ask || []).map((a) => `${shapeWords(askTokens(a))} = ?`)].filter(Boolean).join(" / ");
  return `<div class="b5-src-shapes" role="img" aria-label="${escapeHtml(label)}">${cards}${range}<div class="board">${rows}${ask}</div></div>`;
}

// 위아래로 쌓은 분수. null 칸은 빈 상자(글자 가·나… 를 순서대로 붙임).
const BLANK_LABELS = ["가", "나", "다", "라", "마", "바", "사", "아"];
const fractionMarkup = (fractions, start = 0) => {
  let blank = start;
  const cell = (v) => (v == null ? `<i class="blank"><small>${BLANK_LABELS[blank++]}</small></i>` : `<i>${escapeHtml(v)}</i>`);
  return fractions.map(([num, den]) => `<span class="frac">${cell(num)}<span class="bar"></span>${cell(den)}</span>`).join('<b class="eq">=</b>');
};

// 원판: pieces 조각 중 shaded 조각을 12시부터 시계 방향으로 색칠. 원판마다 아래에 분수 빈칸(가·나…)을 붙인다.
function sourceFractionDiscs(visual) {
  const disc = ({ pieces, shaded }) => {
    const pt = (k) => { const a = -Math.PI / 2 + (2 * Math.PI * k) / pieces; return `${(40 + 36 * Math.cos(a)).toFixed(2)} ${(40 + 36 * Math.sin(a)).toFixed(2)}`; };
    return `<svg viewBox="0 0 80 80">${Array.from({ length: pieces }, (_, k) => `<path class="${k < shaded ? "on" : ""}" d="M40 40L${pt(k)}A36 36 0 0 1 ${pt(k + 1)}Z"/>`).join("")}</svg>`;
  };
  const cols = visual.discs.map((d, k) => `<figure><figcaption>${d.pieces} 조각</figcaption>${disc(d)}${visual.fractions === false ? "" : `<span class="b5-src-fracs">${fractionMarkup([[null, null]], k * 2)}</span>`}</figure>`);
  return `<div class="b5-src-discs" role="img" aria-label="${escapeHtml(visual.discs.map((d) => `${d.pieces}조각 원판 중 ${d.shaded}조각 색칠`).join(", "))}"><div class="row" style="--n:${visual.discs.length}">${cols.join(visual.fractions === false ? "" : '<b class="eq">=</b>')}</div></div>`;
}

function sourceFractionChain(visual) {
  return `<div class="b5-src-fracs" role="img" aria-label="${escapeHtml(`크기가 같은 분수: ${visual.fractions.map(([n, d]) => `${d ?? "빈칸"}분의 ${n ?? "빈칸"}`).join(" = ")}`)}">${fractionMarkup(visual.fractions)}</div>`;
}

// 점 삼각형·점 사각형: counts마다 한 그림. 늘어나는 층마다 다른 색(무지개 색표).
const LAYER_COLORS = ["#e8503a", "#2f6fe0", "#d9a400", "#2f9e5f", "#e0559a", "#8e5bd8", "#f39a1e"];
function sourceDotFigures(visual) {
  const gap = 26, r = 8;
  const figure = (k) => {
    const dots = [], lines = [];
    if (visual.shape === "square") {
      const at = (row, col) => [r + 4 + col * gap, r + 4 + (k - 1 - row) * gap];
      for (let row = 0; row < k; row += 1) for (let col = 0; col < k; col += 1) {
        const [x, y] = at(row, col);
        if (col + 1 < k) lines.push([x, y, ...at(row, col + 1)]);
        if (row + 1 < k) lines.push([x, y, ...at(row + 1, col)]);
        dots.push([x, y, Math.max(row, col)]);
      }
      const size = (k - 1) * gap + 2 * (r + 4);
      return { w: size, h: size, dots, lines };
    }
    const at = (row, col) => [r + 4 + (col + (k - 1 - row) / 2) * gap, r + 4 + row * gap * 0.87];
    for (let row = 0; row < k; row += 1) for (let col = 0; col <= row; col += 1) {
      const [x, y] = at(row, col);
      if (col < row) lines.push([x, y, ...at(row, col + 1)]);
      if (row + 1 < k) { lines.push([x, y, ...at(row + 1, col)]); lines.push([x, y, ...at(row + 1, col + 1)]); }
      dots.push([x, y, k - 1 - row + col]);
    }
    return { w: (k - 1) * gap + 2 * (r + 4), h: (k - 1) * gap * 0.87 + 2 * (r + 4), dots, lines };
  };
  const figs = visual.counts.map((k) => {
    const f = figure(k);
    return `<figure><svg viewBox="0 0 ${f.w.toFixed(1)} ${f.h.toFixed(1)}" style="width:${(f.w * 1.6).toFixed(0)}px;--k:${k}">${f.lines.map(([a, b, c, d]) => `<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${d.toFixed(1)}"/>`).join("")}${f.dots.map(([x, y, layer]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${LAYER_COLORS[layer % LAYER_COLORS.length]}"/>`).join("")}</svg>${visual.labels ? `<figcaption>${escapeHtml(visual.labels[visual.counts.indexOf(k)] ?? "")}</figcaption>` : ""}</figure>`;
  });
  return `<div class="b5-src-dots" role="img" aria-label="${escapeHtml(`${visual.shape === "square" ? "점 사각형" : "점 삼각형"} ${visual.counts.length}개`)}">${figs.join("")}</div>`;
}

// 글이 든 표: 첫 줄은 머리줄. 칸 너비는 내용에 맞춘다.
function sourceTextTable(visual) {
  const [head, ...rows] = visual.cells;
  const tr = (row, tag) => `<tr>${row.map((cell) => `<${tag}${tag === "td" && BLANK_LABELS.includes(String(cell)) ? ' class="blank"' : ""}>${escapeHtml(cell ?? "")}</${tag}>`).join("")}</tr>`;
  const headed = visual.cells.length > 1 && head.some((c) => /[가-힣]/.test(String(c)));
  return `<div class="b5-src-ttable" role="img" aria-label="${escapeHtml(visual.cells.map((r) => r.join(" ")).join(" / "))}"><table>${headed ? `<thead>${tr(head, "th")}</thead>` : ""}<tbody>${(headed ? rows : visual.cells).map((r) => tr(r, "td")).join("")}</tbody></table></div>`;
}

// 「△n = 1 + 2 + … + n = □ × △ = 합」. example이 있으면 두 수를 쓰고, 없으면 색표의 빈 □·△.
function sourceSumLine(visual) {
  const terms = Array.from({ length: visual.n }, (_, i) => i + 1).join(" + ");
  const blank = (kind) => `<span class="g">${SHAPE_GLYPH[kind] ? `<svg viewBox="0 0 34 34" style="--line:${SHAPE_GLYPH[kind][1]};--fill:${SHAPE_GLYPH[kind][2]}">${SHAPE_GLYPH[kind][3]}</svg>` : ""}</span>`;
  const factors = visual.example ? `${visual.example[0]} × ${visual.example[1]}` : `${blank("square")}<b>×</b>${blank("triangle")}`;
  const total = visual.total == null ? "?" : visual.total;
  return `<div class="b5-src-sumline" role="img" aria-label="${escapeHtml(`삼각수 ${visual.n}번째 = ${terms} = ${visual.example ? visual.example.join(" 곱하기 ") : "네모 곱하기 세모"} = ${total}`)}"><span class="tri">△<sub>${visual.n}</sub></span><span>= ${terms} =</span><span class="fac">${factors}</span><span>= ${escapeHtml(total)}</span></div>`;
}

// 악수: nodes는 서로 모두 악수한 사람(선으로 이음), newNode는 새로 온 사람(점선 동그라미, 선 없음).
const HAND_COLORS = ["#2f6fe0", "#f39a1e", "#2f9e5f", "#8e5bd8", "#e0559a", "#e8503a"];
function sourceHandshake(visual) {
  const all = [...visual.nodes, ...(visual.newNode ? [visual.newNode] : [])];
  const n = all.length, R = n <= 2 ? 0 : 70;
  const pts = n === 2 ? [[50, 60], [190, 60]] : all.map((_, i) => { const a = Math.PI + (2 * Math.PI * i) / n; return [120 + R * Math.cos(a), 95 + R * Math.sin(a)]; });
  const lines = [];
  visual.nodes.forEach((_, i) => visual.nodes.forEach((__, j) => { if (j > i) lines.push(`<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="${HAND_COLORS[i % HAND_COLORS.length]}"/>`); }));
  const circles = all.map((label, i) => `<circle cx="${pts[i][0].toFixed(1)}" cy="${pts[i][1].toFixed(1)}" r="20" class="${label === visual.newNode ? "new" : ""}"/><text x="${pts[i][0].toFixed(1)}" y="${pts[i][1].toFixed(1)}">${escapeHtml(label)}</text>`).join("");
  const h = n === 2 ? 120 : 190;
  return `<div class="b5-src-hand" role="img" aria-label="${escapeHtml(`${visual.nodes.join(", ")}가 서로 악수${visual.newNode ? `, ${visual.newNode}가 새로 옴` : ""}`)}">${visual.caption ? `<p>${escapeHtml(visual.caption)}</p>` : ""}<svg viewBox="0 0 240 ${h}" style="width:min(100%,300px)">${lines.join("")}${circles}</svg></div>`;
}

// 꼭짓점에서 밑변으로 선을 그어 cells칸으로 나눈 삼각형. cross면 가운데 가로선 하나.
function sourceFanTriangle(visual) {
  const apex = [70, 8], y = 170, x0 = 10, x1 = 230;
  const lines = Array.from({ length: visual.cells - 1 }, (_, i) => { const bx = x0 + ((x1 - x0) * (i + 1)) / visual.cells; return `<line x1="${apex[0]}" y1="${apex[1]}" x2="${bx.toFixed(1)}" y2="${y}"/>`; }).join("");
  const cy = 95, t = (cy - apex[1]) / (y - apex[1]);
  const cross = visual.cross ? `<line x1="${(apex[0] + (x0 - apex[0]) * t).toFixed(1)}" y1="${cy}" x2="${(apex[0] + (x1 - apex[0]) * t).toFixed(1)}" y2="${cy}"/>` : "";
  return `<div class="b5-src-fan" role="img" aria-label="${escapeHtml(`꼭짓점에서 그은 선으로 ${visual.cells}칸으로 나눈 삼각형${visual.cross ? ", 가로선 하나" : ""}`)}"><svg viewBox="0 0 240 178" style="width:min(100%,260px)"><polygon points="${apex.join(",")} ${x1},${y} ${x0},${y}"/>${lines}${cross}</svg></div>`;
}

// 둘레: 마름모(네 변 같음 표시) 또는 직사각형(가로·세로 묶음 숫자).
function sourcePerimeter(visual) {
  if (visual.shape === "rhombus") {
    const P = [[100, 10], [190, 70], [100, 130], [10, 70]];
    const ticks = P.map((p, i) => { const q = P[(i + 1) % 4], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), nx = -dy / L * 7, ny = dx / L * 7, ox = dx / L * 3, oy = dy / L * 3;
      return [-1, 1].map((s) => `<line class="tk" x1="${(mx + s * ox - nx).toFixed(1)}" y1="${(my + s * oy - ny).toFixed(1)}" x2="${(mx + s * ox + nx).toFixed(1)}" y2="${(my + s * oy + ny).toFixed(1)}"/>`).join(""); }).join("");
    return `<div class="b5-src-perim" role="img" aria-label="네 변의 길이가 같은 마름모"><svg viewBox="0 0 200 140" style="width:min(100%,220px)"><polygon points="${P.map((p) => p.join(",")).join(" ")}"/>${ticks}</svg></div>`;
  }
  const W = 50 + visual.w * 16, H = 34 + visual.h * 16, x = 14, y = 40;
  return `<div class="b5-src-perim" role="img" aria-label="${escapeHtml(`가로 ${visual.w}, 세로 ${visual.h}인 직사각형`)}"><svg viewBox="0 0 ${W + 60} ${H + 56}" style="width:min(100%,${W + 90}px)"><rect x="${x}" y="${y}" width="${W}" height="${H}"/><path class="arc" d="M${x} ${y - 2}Q${x + W / 2} ${y - 30} ${x + W} ${y - 2}"/><path class="arc" d="M${x + W + 2} ${y}Q${x + W + 30} ${y + H / 2} ${x + W + 2} ${y + H}"/><text x="${x + W / 2}" y="${y - 24}">${escapeHtml(visual.w)}</text><text x="${x + W + 34}" y="${y + H / 2}">${escapeHtml(visual.h)}</text></svg></div>`;
}

// 검은 돌·흰 돌을 줄마다 번갈아 놓은 삼각 배열(검정·흰색이 문제 내용이라 색표 예외)
function sourceStoneRows(visual) {
  const r = 13, gap = 29, wide = Math.max(...visual.rows);
  const W = wide * gap + 8, H = visual.rows.length * gap + 8;
  const stones = visual.rows.flatMap((count, i) => Array.from({ length: count }, (_, j) => `<circle cx="${(4 + (W - 8) / 2 + (j - (count - 1) / 2) * gap).toFixed(1)}" cy="${4 + gap / 2 + i * gap}" r="${r}" class="${i % 2 ? "w" : "b"}"/>`)).join("");
  return `<div class="b5-src-stones" role="img" aria-label="${escapeHtml(`검은 돌과 흰 돌을 번갈아 ${visual.rows.join(", ")}개씩 놓은 줄`)}"><svg viewBox="0 0 ${W} ${H}" style="width:min(100%,${Math.round(W * 1.3)}px)">${stones}</svg></div>`;
}

// 7권: 단계 그림 여러 개를 한 줄로(휴대폰에서는 줄바꿈). figs = [{w, h, body}], marks면 위에 ①②③… 번호.
const STAGE_MARKS = ["①", "②", "③", "④", "⑤", "⑥"];
function stageRow(cls, label, figs, marks) {
  const items = figs.map((f, k) => `<figure>${marks ? `<b>${STAGE_MARKS[k]}</b>` : ""}<svg viewBox="${-6} ${-6} ${f.w + 12} ${f.h + 12}" style="width:${Math.round((f.w + 12) * (cls === "sticks" ? 1.5 : 1.15))}px">${f.body}</svg></figure>`).join("");
  return `<div class="b5-src-stages ${cls}" role="img" aria-label="${escapeHtml(label)}">${items}</div>`;
}

// 7권 18쪽: 성냥개비로 만든 모양을 하나씩 늘린 단계. shape: "triangle"(위·아래로 번갈아 붙인 삼각형) | "house"(벽을 함께 쓰는 집 모양 오각형).
// 막대는 끝을 조금 띄워 한 개씩 보이게 하고, 한쪽 끝에 빨간 머리를 단다.
function sourceStickStages(visual) {
  const s = 40;
  const figure = (n) => {
    const edges = new Map();
    const add = (a, b) => { const key = [a, b].map((p) => p.join(",")).sort().join("|"); if (!edges.has(key)) edges.set(key, [a, b]); };
    let w, h;
    if (visual.shape === "triangle") {
      h = s * 0.866;
      const T = (j) => [s / 2 + j * s, 0], B = (j) => [j * s, h];
      for (let i = 0; i < n; i += 1) {
        const k = Math.floor(i / 2);
        if (i % 2 === 0) { add(B(k), B(k + 1)); add(B(k), T(k)); add(B(k + 1), T(k)); }
        else { add(T(k), T(k + 1)); add(T(k), B(k + 1)); add(T(k + 1), B(k + 1)); }
      }
      w = Math.max(...[...edges.values()].flat().map((p) => p[0]));
    } else {
      const r = s * 0.62; h = r + s; w = n * s;
      for (let j = 0; j <= n; j += 1) add([j * s, r], [j * s, r + s]);
      for (let j = 0; j < n; j += 1) { add([j * s, r + s], [(j + 1) * s, r + s]); add([j * s, r], [j * s + s / 2, 0]); add([j * s + s / 2, 0], [(j + 1) * s, r]); }
    }
    const body = [...edges.values()].map(([[x1, y1], [x2, y2]]) => {
      const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len, cut = 3.5;
      const a = [x1 + ux * cut, y1 + uy * cut], b = [x2 - ux * cut, y2 - uy * cut];
      return `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/><circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="3.4"/>`;
    }).join("");
    return { w, h, body };
  };
  const name = visual.shape === "triangle" ? "삼각형" : "집 모양 오각형";
  return stageRow("sticks", `성냥개비로 만든 ${name}을 ${visual.stages.join("개, ")}개로 늘린 그림`, visual.stages.map(figure), false);
}

// 7권 19쪽: 가운데 돌 하나에서 네 방향으로 한 개씩 늘어나는 십자 모양 바둑돌. 문제가 「흰색 바둑돌」이라 흰 돌로 그린다(색표 예외).
function sourceStoneCross(visual) {
  const g = 22, r = 9;
  const figure = (k) => {
    const c = (k - 1) * g + r, pts = [[c, c]];
    for (let d = 1; d < k; d += 1) pts.push([c + d * g, c], [c - d * g, c], [c, c + d * g], [c, c - d * g]);
    return { w: 2 * c, h: 2 * c, body: pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("") };
  };
  return stageRow("cross", `흰색 바둑돌을 십자 모양으로 놓은 ${visual.stages.length}개의 그림`, visual.stages.map(figure), true);
}

// 7권 19쪽: 세모·네모로 만든 모양을 하나씩 늘린 단계. layout: "roof-grid"(세모 지붕 아래 네모 2줄) | "square-row"(네모 한 줄의 위·아래·양 끝에 세모).
function sourceShapeStages(visual) {
  const tri = (pts) => `<polygon class="tri" points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}"/>`;
  const sq = (x, y, u) => `<rect class="sq" x="${x}" y="${y}" width="${u}" height="${u}"/>`;
  const figure = (k) => {
    const parts = [];
    if (visual.layout === "roof-grid") {
      const u = 18, th = 30;
      for (let j = 0; j < k; j += 1) parts.push(tri([[j * 2 * u, th], [j * 2 * u + u, 0], [(j + 1) * 2 * u, th]]));
      for (let row = 0; row < 2; row += 1) for (let col = 0; col < 2 * k; col += 1) parts.push(sq(col * u, th + row * u, u));
      return { w: 2 * k * u, h: th + 2 * u, body: parts.join("") };
    }
    const u = 30, t = 22, x0 = t;
    for (let j = 0; j < k; j += 1) {
      const x = x0 + j * u;
      parts.push(tri([[x, t], [x + u / 2, 0], [x + u, t]]), tri([[x, t + u], [x + u / 2, t + u + t], [x + u, t + u]]), sq(x, t, u));
    }
    parts.push(tri([[x0, t], [0, t + u / 2], [x0, t + u]]), tri([[x0 + k * u, t], [x0 + k * u + t, t + u / 2], [x0 + k * u, t + u]]));
    return { w: k * u + 2 * t, h: u + 2 * t, body: parts.join("") };
  };
  const what = visual.layout === "roof-grid" ? "세모 지붕 아래에 네모를 두 줄 붙인" : "네모 한 줄의 위·아래·양 끝에 세모를 붙인";
  return stageRow("shapes", `${what} 모양을 ${visual.stages.length}단계로 늘린 그림`, visual.stages.map(figure), false);
}

// 똑같이 가르기 나무: levels 1이면 칸 2개(가·나), 2면 칸 2개 아래 칸 4개(다~바). values는 개념 장면용.
function sourceHalvingTree(visual) {
  const W = visual.levels === 2 ? 300 : 160, cx = W / 2;
  const box = (x, y, k) => { const v = visual.values?.[k]; return `<rect x="${x - 20}" y="${y}" width="40" height="32" rx="4" class="${v == null ? "blank" : ""}"/><text x="${x}" y="${y + 16}" class="${v == null ? "lbl" : ""}">${escapeHtml(v ?? BLANK_LABELS[k])}</text>`; };
  const branch = (x, y, x1, x2, y2) => `<polyline points="${x1},${y2} ${x},${y} ${x2},${y2}"/>`;
  let body = `<text x="${cx}" y="16" class="top">${escapeHtml(visual.top)}</text>`;
  if (visual.levels === 2) {
    const l = cx - 75, r = cx + 75;
    body += branch(cx, 30, l, r, 52) + box(l, 54, 0) + box(r, 54, 1);
    body += branch(l, 94, l - 37, l + 37, 114) + branch(r, 94, r - 37, r + 37, 114) + box(l - 37, 116, 2) + box(l + 37, 116, 3) + box(r - 37, 116, 4) + box(r + 37, 116, 5);
  } else body += branch(cx, 30, cx - 40, cx + 40, 52) + box(cx - 40, 54, 0) + box(cx + 40, 54, 1);
  const H = visual.levels === 2 ? 152 : 90;
  return `<div class="b5-src-halve" role="img" aria-label="${escapeHtml(`${visual.top}을 똑같이 ${visual.levels === 2 ? "두 번" : "한 번"} 가르기`)}"><svg viewBox="0 0 ${W} ${H}" style="width:min(100%,${Math.round(W * 1.7)}px)">${body}</svg></div>`;
}

// 6권: 윗수를 ways개로 똑같이 가르기(한 단계). 빈 칸은 가·나… 순서.
function sourceSplitTree(visual) {
  const n = visual.ways, W = Math.max(160, n * 50 + 30), cx = W / 2, xs = Array.from({ length: n }, (_, k) => cx + (k - (n - 1) / 2) * 50);
  const box = (x, k) => { const v = visual.values?.[k]; return `<rect x="${x - 20}" y="54" width="40" height="32" rx="4" class="${v == null ? "blank" : ""}"/><text x="${x}" y="70" class="${v == null ? "lbl" : ""}">${escapeHtml(v ?? BLANK_LABELS[k])}</text>`; };
  return `<div class="b5-src-halve" role="img" aria-label="${escapeHtml(`${visual.top}을 똑같이 ${n}개로 가르기`)}"><svg viewBox="0 0 ${W} 90" style="width:min(100%,${Math.round(W * 1.7)}px)"><text x="${cx}" y="16" class="top">${escapeHtml(visual.top)}</text>${xs.map((x) => `<line x1="${cx}" y1="30" x2="${x}" y2="52"/>`).join("")}${xs.map(box).join("")}</svg></div>`;
}

// 6권: 「12 = 2 × □ = 4 × □」처럼 null 자리가 빈칸(가·나…)인 식.
function sourceBlankEquation(visual) {
  let k = 0;
  const tokens = visual.tokens.map((t) => t == null ? `<i class="blank">${BLANK_LABELS[k++]}</i>` : t.startsWith("*") ? `<span class="t hl">${escapeHtml(t.slice(1))}</span>` : `<span class="${/^[+×÷=\-:()]$/.test(t) ? "op" : "t"}">${escapeHtml(t)}</span>`).join("");
  let j = 0;
  return `<div class="b5-src-blankeq" role="img" aria-label="${escapeHtml(visual.tokens.map((t) => t == null ? `빈칸 ${BLANK_LABELS[j++]}` : t.replace(/^\*/, "")).join(" "))}">${tokens}</div>`;
}

// 7권: 날짜와 요일 사다리. rows = [{date, day}] — day가 null이면 빈칸(빈칸이 둘 이상일 때만 가·나 글자), day가 없으면 날짜만 쓴 중간 단계.
function sourceDateLadder(visual) {
  const blanks = visual.rows.filter((r) => r.day === null).length;
  let k = 0, j = 0;
  const cell = (r) => (r.day === null ? `<i class="blank">${blanks > 1 ? BLANK_LABELS[k++] : ""}</i>` : r.day ? `<span class="day">${escapeHtml(r.day)}</span>` : `<span class="none"></span>`);
  const say = (r) => `${r.date} ${r.day === null ? (blanks > 1 ? `빈칸 ${BLANK_LABELS[j++]}` : "빈칸") : r.day ? `${r.day}요일` : ""}`.trim();
  return `<div class="b5-src-dates" role="img" aria-label="${escapeHtml(visual.rows.map(say).join(", "))}">${visual.rows.map((r) => `<div><b>${escapeHtml(r.date)}</b>${cell(r)}</div>`).join("")}</div>`;
}

// 7권: 시·분 세로셈. rows = [{pre, h, hu, m, mu}] (pre는 「+」「-」「오전」 같은 앞글자), result = {pre, hu, mu} — 답 줄은 빈칸 두 개.
// 빈칸 글자는 답 칸 이름(가·나)과 맞춘다. 분만 있는 줄은 h를 비운다.
function sourceTimeColumn(visual) {
  const td = (v, c = "") => `<td class="${c}">${escapeHtml(v ?? "")}</td>`;
  const tr = (r) => `<tr>${td(r.pre, "pre")}${td(r.h, "n")}${td(r.h == null || r.h === "" ? "" : r.hu, "u")}${td(r.m, "n")}${td(r.mu, "u")}</tr>`;
  const res = visual.result;
  const blank = (k) => `<td class="n"><i class="blank">${BLANK_LABELS[k]}</i></td>`;
  // 분만 묻는 답 줄(res.hu 없음)은 빈칸 하나
  const resRow = res.hu == null ? `${td(res.pre, "pre")}${td("")}${td("")}${blank(0)}${td(res.mu, "u")}` : `${td(res.pre, "pre")}${blank(0)}${td(res.hu, "u")}${blank(1)}${td(res.mu, "u")}`;
  const sayRes = res.hu == null ? `${res.pre || ""} 빈칸 가 ${res.mu}` : `${res.pre || ""} 빈칸 가 ${res.hu} 빈칸 나 ${res.mu}`;
  const say = [...visual.rows.map((r) => [r.pre, r.h && `${r.h}${r.hu}`, r.m && `${r.m}${r.mu}`].filter(Boolean).join(" ")), sayRes.trim()].join(", ");
  return `<div class="b5-src-timecol" role="img" aria-label="${escapeHtml(say)}"><table><tbody>${visual.rows.map(tr).join("")}<tr class="res">${resRow}</tr></tbody></table></div>`;
}

// 6권: 호가 그려진 수직선. points = 묶음 경계의 수(이 수로 칸 위치를 정한다), groups = 묶음마다 칸 수·호 모양,
// tickLabels = 눈금 아래 글자(A·B·중간), spans = 여러 칸을 묶은 큰 호(①·②·☆). 칸 위치는 공개된 경계 수로만 계산한다.
const ARC_MARK = { circle: (x, y) => `<circle class="mk" cx="${x}" cy="${y}" r="6" style="--c:${SHAPE_GLYPH.circle[1]};--f:${SHAPE_GLYPH.circle[2]}"/>`,
  triangle: (x, y) => `<polygon class="mk" points="${x},${y - 7} ${x + 7},${y + 5} ${x - 7},${y + 5}" style="--c:${SHAPE_GLYPH.triangle[1]};--f:${SHAPE_GLYPH.triangle[2]}"/>` };
function sourceArcLine(visual) {
  const x0 = 34, y = 92, pts = visual.points.map(Number), Wd = Math.min(520, Math.max(260, visual.groups.reduce((n, g) => n + g.n, 0) * 40));
  const span = pts[pts.length - 1] - pts[0];
  const bx = pts.map((p) => x0 + (p - pts[0]) / span * Wd);
  const ticks = [bx[0]];
  visual.groups.forEach((g, gi) => { for (let k = 1; k <= g.n; k++) ticks.push(bx[gi] + (bx[gi + 1] - bx[gi]) * k / g.n); });
  const arc = (xa, xb, side, h, cls, color) => { const s = side === "under" ? 1 : -1; return `<path class="${cls}" style="--c:${color}" d="M${xa.toFixed(1)} ${y}Q${((xa + xb) / 2).toFixed(1)} ${y + s * 2 * h} ${xb.toFixed(1)} ${y}"/>`; };
  let body = `<line class="ln" x1="${x0}" y1="${y}" x2="${x0 + Wd}" y2="${y}"/>${ticks.map((x) => `<line class="tick" x1="${x.toFixed(1)}" y1="${y - 7}" x2="${x.toFixed(1)}" y2="${y + 7}"/>`).join("")}`;
  let start = 0;
  visual.groups.forEach((g) => {
    const color = g.color ?? "#f39a1e", s = g.side === "under" ? 1 : -1, show = g.arcs ?? "all";
    for (let k = 0; k < g.n; k++) {
      if (show === "none" || (show === "first" && k > 0)) continue;
      const xa = ticks[start + k], xb = ticks[start + k + 1], h = Math.min(13, (xb - xa) * 0.3);
      body += arc(xa, xb, g.side, h, "arc", color);
      if (g.mark) body += ARC_MARK[g.mark]((xa + xb) / 2, y + s * (h + 6));
      if (k === 0 && g.label) body += `<text class="al" x="${((xa + xb) / 2).toFixed(1)}" y="${s > 0 ? y + Math.max(h + 12, 44) : y - (h + (g.mark ? 22 : 12))}">${escapeHtml(g.label)}</text>`;
    }
    start += g.n;
  });
  (visual.spans ?? []).forEach((sp) => {
    const xa = ticks[sp.from], xb = ticks[sp.to], s = sp.side === "under" ? 1 : -1, h = Math.min(30, (xb - xa) * 0.12 + 12);
    body += arc(xa, xb, sp.side, h, "span", sp.color ?? "#8e5bd8") + `<text class="al" x="${((xa + xb) / 2).toFixed(1)}" y="${y + s * (h + 12)}">${escapeHtml(sp.label ?? "")}</text>`;
  });
  const below = (x, t) => `<text x="${x.toFixed(1)}" y="${y + 24}">${escapeHtml(t)}</text>`;
  body += visual.points.map((p, k) => below(bx[k], p)).join("");
  body += Object.entries(visual.tickLabels ?? {}).map(([k, t]) => below(ticks[Number(k)], t)).join("");
  if (visual.caption) body += `<text class="cap" x="${x0 + Wd / 2}" y="20">${escapeHtml(visual.caption)}</text>`;
  const label = `${visual.points.join("부터 ")}까지 수직선, ${visual.groups.map((g) => `${g.n}칸`).join("과 ")}${visual.caption ? `, ${visual.caption}` : ""}`;
  return `<div class="b5-src-arcline" role="img" aria-label="${escapeHtml(label)}"><svg viewBox="0 0 ${x0 * 2 + Wd} 150" style="width:min(100%,${Math.round((x0 * 2 + Wd) * 1.2)}px)">${body}</svg></div>`;
}

// 6권: 같은 길이를 위 줄은 a칸, 아래 줄은 b칸으로 나눈 두 수직선(첫 칸에 A·B).
function sourceRatioLines(visual) {
  const x0 = 30, W = 400, ys = [56, 132];
  const line = (y, n, label, color) => {
    let s = `<line class="ln" x1="${x0}" y1="${y}" x2="${x0 + W}" y2="${y}"/>`;
    for (let k = 0; k <= n; k++) s += `<line class="tick" x1="${x0 + W * k / n}" y1="${y - 7}" x2="${x0 + W * k / n}" y2="${y + 7}"/>`;
    for (let k = 0; k < n; k++) { const xa = x0 + W * k / n, xb = x0 + W * (k + 1) / n; s += `<path class="arc" style="--c:${color}" d="M${xa} ${y}Q${(xa + xb) / 2} ${y - 30} ${xb} ${y}"/>`; }
    return s + `<text class="al" x="${x0 + W / n / 2}" y="${y - 24}">${label}</text>`;
  };
  const body = `<line class="end" x1="${x0}" y1="${ys[0]}" x2="${x0}" y2="${ys[1]}"/><line class="end" x1="${x0 + W}" y1="${ys[0]}" x2="${x0 + W}" y2="${ys[1]}"/>${line(ys[0], visual.a, "A", "#2f9e5f")}${line(ys[1], visual.b, "B", "#f39a1e")}<text x="${x0}" y="${ys[1] + 24}">${escapeHtml(visual.start)}</text><text x="${x0 + W}" y="${ys[1] + 24}">${escapeHtml(visual.end)}</text>`;
  return `<div class="b5-src-arcline" role="img" aria-label="${escapeHtml(`${visual.start}부터 ${visual.end}까지를 위는 A ${visual.a}칸, 아래는 B ${visual.b}칸으로 똑같이 나눈 수직선`)}"><svg viewBox="0 0 ${x0 * 2 + W} 168" style="width:min(100%,520px)">${body}</svg></div>`;
}

// 6권: 연필(또는 리코더) 길이를 같은 막대 n개로 잰 그림. diff면 A·B와 그 차이 C를 아래에 그린다.
function sourcePencilBars(visual) {
  const x0 = 12, L = 330;
  const head = visual.head === "recorder"
    ? `<rect class="rec" x="${x0}" y="10" width="${L}" height="22" rx="10"/>${[0.3, 0.4, 0.5, 0.6, 0.7].map((f) => `<circle class="hole" cx="${x0 + L * f}" cy="21" r="3.5"/>`).join("")}<rect class="mouth" x="${x0 + L - 34}" y="8" width="34" height="26" rx="12"/>`
    : `<rect class="pen" x="${x0}" y="12" width="${L - 26}" height="18" rx="3"/><rect class="eraser" x="${x0}" y="12" width="16" height="18" rx="3"/><polygon class="tip" points="${x0 + L - 26},12 ${x0 + L},21 ${x0 + L - 26},30"/><polygon class="lead" points="${x0 + L - 8},18 ${x0 + L},21 ${x0 + L - 8},24"/>`;
  let y = 44, body = head;
  visual.rows.forEach((row) => {
    const w = L / row.n;
    for (let k = 0; k < row.n; k++) body += `<rect class="bar" style="--c:${row.color}" x="${x0 + w * k}" y="${y}" width="${w}" height="26"/><text x="${x0 + w * k + w / 2}" y="${y + 13}">${escapeHtml(row.label ?? "")}</text>`;
    y += 34;
  });
  if (visual.diff) {
    const [a, b] = visual.rows, wa = L / a.n, wb = L / b.n, dx = x0 + 70;
    body += `<rect class="bar" style="--c:${a.color}" x="${dx}" y="${y + 6}" width="${wa}" height="24"/><text x="${dx + wa / 2}" y="${y + 18}">A</text>`;
    body += `<rect class="bar" style="--c:${b.color}" x="${dx}" y="${y + 36}" width="${wb}" height="24"/><text x="${dx + wb / 2}" y="${y + 48}">B</text>`;
    body += `<rect class="bar c" x="${dx + wb}" y="${y + 66}" width="${wa - wb}" height="24"/><text x="${dx + wb + (wa - wb) / 2}" y="${y + 78}">C</text><line class="guide" x1="${dx + wb}" y1="${y + 60}" x2="${dx + wb}" y2="${y + 66}"/><line class="guide" x1="${dx + wa}" y1="${y + 30}" x2="${dx + wa}" y2="${y + 66}"/>`;
    y += 96;
  }
  const what = visual.head === "recorder" ? "리코더" : "연필";
  return `<div class="b5-src-pencil" role="img" aria-label="${escapeHtml(`${what}의 길이를 ${visual.rows.map((r) => `${r.label ?? "막대"} ${r.n}개`).join(", ")}로 잰 그림${visual.diff ? ", C는 A와 B의 길이 차이" : ""}`)}"><svg viewBox="0 0 ${L + x0 * 2} ${y + 4}" style="width:min(100%,420px)">${body}</svg></div>`;
}

// 6권: 위는 ㉠ a칸, 아래는 ㉡ b칸으로 같은 길이를 나눈 막대(왼쪽)와, ㉠ 하나·㉡ 하나를 이은 막대(오른쪽, 전체 길이 total).
function sourceBarRatio(visual) {
  const W = 150, x0 = 8, bx = 210, wa = W / visual.a, wb = W / visual.b, k = 210 / (wa + wb), ra = wa * k, rb = wb * k;
  let left = "";
  for (let i = 0; i < visual.a; i++) left += `<rect class="ga" x="${x0 + wa * i}" y="40" width="${wa}" height="26"/><text x="${x0 + wa * i + wa / 2}" y="53">㉠</text>`;
  for (let i = 0; i < visual.b; i++) left += `<rect class="gb" x="${x0 + wb * i}" y="66" width="${wb}" height="26"/><text x="${x0 + wb * i + wb / 2}" y="79">㉡</text>`;
  const arc = (xa, xb, up) => `<path class="arc" d="M${xa} ${up ? 52 : 80}Q${(xa + xb) / 2} ${up ? 22 : 110} ${xb} ${up ? 52 : 80}"/>`;
  const right = `<rect class="ga" x="${bx}" y="52" width="${ra}" height="28"/><text x="${bx + ra / 2}" y="66">㉠</text><rect class="gb" x="${bx + ra}" y="52" width="${rb}" height="28"/><text x="${bx + ra + rb / 2}" y="66">㉡</text>`
    + arc(bx, bx + ra, true) + arc(bx + ra, bx + ra + rb, true) + arc(bx, bx + ra + rb, false)
    + `<text class="lbl" x="${bx + ra / 2}" y="22">가 cm</text><text class="lbl" x="${bx + ra + rb / 2}" y="22">나 cm</text><text x="${bx + (ra + rb) / 2}" y="118">${escapeHtml(visual.total)}cm</text>`;
  return `<div class="b5-src-pencil" role="img" aria-label="${escapeHtml(`같은 길이를 ㉠ ${visual.a}칸, ㉡ ${visual.b}칸으로 나눈 막대와, ㉠ 하나와 ㉡ 하나를 이은 ${visual.total}cm 막대`)}"><svg viewBox="0 0 430 128" style="width:min(100%,520px)"><path class="arrow" d="M168 66H196M188 59l8 7-8 7"/>${left}${right}</svg></div>`;
}

// 6권: 수평인 저울 — 왼쪽은 공 left개, 오른쪽은 상자 right개. weight가 있으면 오른쪽에 공 하나·상자 하나와 추(weight g)를 단 두 번째 저울.
function sourceBalanceRatio(visual) {
  const ball = (x, y) => `<circle class="ball" cx="${x}" cy="${y}" r="9"/>`, box = (x, y) => `<rect class="box" x="${x - 9}" y="${y - 9}" width="18" height="18" rx="2"/>`;
  const pile = (n, cx, base, draw) => Array.from({ length: n }, (_, i) => { const row = Math.floor(i / 3), col = i % 3, inRow = Math.min(3, n - row * 3); return draw(cx + (col - (inRow - 1) / 2) * 20, base - 10 - row * 20); }).join("");
  const scale = (x, leftItems, rightItems) => `<line class="beam" x1="${x}" y1="70" x2="${x + 150}" y2="70"/><polygon class="stand" points="${x + 75},70 ${x + 64},90 ${x + 86},90"/><path class="pan" d="M${x - 8} 70h56M${x + 102} 70h56"/>${leftItems}${rightItems}`;
  let body = scale(10, pile(visual.left, 30, 70, ball), pile(visual.right, 140, 70, box));
  if (visual.weight != null) body += `<path class="arrow" d="M182 60H206M198 53l8 7-8 7"/>` + scale(226, ball(236, 60) + box(258, 60), `<rect class="weight" x="${346}" y="${30}" width="36" height="38" rx="3"/><text x="364" y="49">${escapeHtml(visual.weight)}g</text>`);
  return `<div class="b5-src-balance" role="img" aria-label="${escapeHtml(`수평인 저울: 공 ${visual.left}개와 상자 ${visual.right}개${visual.weight != null ? `, 공 하나와 상자 하나는 ${visual.weight}g` : ""}`)}"><svg viewBox="0 0 ${visual.weight != null ? 400 : 180} 96" style="width:min(100%,${visual.weight != null ? 480 : 230}px)">${body}</svg></div>`;
}

// 6권 둘레: 길이 글자. 가·나… 한 글자면 빈칸 상자로 그리고 뒤에 단위를 붙인다.
const QUAD_COLOR = { triangle: ["#2f9e5f", "#dcf5e5"], rect: ["#2f6fe0", "#dde9ff"], square: ["#2f6fe0", "#dde9ff"], para: ["#d9a400", "#fff3c4"], rhombus: ["#8e5bd8", "#ece0fb"], trapezoid: ["#1aa3c9", "#dff3ff"] };
const lenLabel = (x, y, text, unit = "cm") => {
  if (text == null) return "";
  const s = String(text);
  if (BLANK_LABELS.includes(s)) return `<rect class="qb" x="${x - 26}" y="${y - 12}" width="24" height="24" rx="4"/><text class="ql" x="${x - 14}" y="${y}">${s}</text><text x="${x + 12}" y="${y}">${unit}</text>`;
  const m = s.match(/^(.+) ([가-아])$/);
  if (m && BLANK_LABELS.includes(m[2])) return `<text x="${x}" y="${y - 13}">${escapeHtml(m[1])}</text><rect class="qb" x="${x - 26}" y="${y}" width="24" height="24" rx="4"/><text class="ql" x="${x - 14}" y="${y + 12}">${m[2]}</text><text x="${x + 12}" y="${y + 12}">${unit}</text>`;
  return `<text x="${x}" y="${y}">${escapeHtml(/^\d+$/.test(s) ? `${s}${unit}` : s)}</text>`;
};
const quadPoints = (shape, x, y, W, H) => {
  if (shape === "para") { const d = Math.min(40, W * 0.3); return [[x + d, y], [x + W, y], [x + W - d, y + H], [x, y + H]]; }
  if (shape === "rhombus") return [[x + W / 2, y], [x + W, y + H / 2], [x + W / 2, y + H], [x, y + H / 2]];
  if (shape === "trapezoid") { const d = W * 0.22; return [[x + d, y], [x + W - d, y], [x + W, y + H], [x, y + H]]; }
  return [[x, y], [x + W, y], [x + W, y + H], [x, y + H]];
};
const poly = (pts, shape, cls = "") => `<polygon class="${cls}" style="--c:${QUAD_COLOR[shape][0]};--f:${QUAD_COLOR[shape][1]}" points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}"/>`;
const edgeArc = (a, b, out) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = dy / L * out, ny = -dx / L * out; return { d: `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${(mx + nx * 2).toFixed(1)} ${(my + ny * 2).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`, lx: mx + nx * 2.1, ly: my + ny * 2.1 }; };

// 6권: 사각형 하나(rect·square·para·rhombus). top·side(왼쪽 변)·inner(가운데 글). w·h는 그리는 비율만.
function sourceQuad(visual) {
  const shape = visual.shape, maxW = 200, maxH = 120, r = (visual.w ?? 3) / (visual.h ?? 2);
  const W = shape === "square" ? 110 : r >= maxW / maxH ? maxW : maxH * r, H = shape === "square" ? 110 : r >= maxW / maxH ? maxW / r : maxH;
  const x = 84, y = 56, P = quadPoints(shape, x, y, W, H);
  let body = poly(P, shape, "q");
  const unit = visual.unit ?? "cm";
  if (visual.top != null) { const e = edgeArc(P[0], P[1], 13); body += `<path class="arc" d="${e.d}"/>` + lenLabel(e.lx, e.ly - 6, visual.top, unit); }
  if (visual.side != null) { const e = edgeArc(P[3], P[0], 13); body += `<path class="arc" d="${e.d}"/>` + lenLabel(e.lx - 20, e.ly, visual.side, unit); }
  if (visual.right != null) { const e = edgeArc(P[1], P[2], 13); body += `<path class="arc" d="${e.d}"/>` + lenLabel(e.lx + 20, e.ly, visual.right, unit); }
  if (visual.inner != null) body += lenLabel(x + W / 2, y + H / 2, visual.inner, unit);
  if (shape === "rhombus" || shape === "square") body += P.map((p, i) => { const q = P[(i + 1) % 4]; return `<circle class="tk" cx="${((p[0] + q[0]) / 2).toFixed(1)}" cy="${((p[1] + q[1]) / 2).toFixed(1)}" r="3"/>`; }).join("");
  const name = { rect: "직사각형", square: "정사각형", para: "평행사변형", rhombus: "마름모" }[shape];
  return `<div class="b5-src-quad" role="img" aria-label="${escapeHtml([name, visual.top != null && `위 ${visual.top}`, visual.side != null && `옆 ${visual.side}`, visual.right != null && `오른쪽 ${visual.right}`, visual.inner].filter(Boolean).join(", "))}"><svg viewBox="0 0 ${x * 2 + W} ${y + H + 30}" style="width:min(100%,${Math.round((x * 2 + W) * 1.25)}px)">${body}</svg></div>`;
}

// 6권: 여러 가지 사각형 모음. items = [[이름표, 모양], …]
function sourceQuadGallery(visual) {
  const cell = 120, body = visual.items.map(([label, shape], k) => { const x = k * cell + 14, P = quadPoints(shape === "square" ? "rect" : shape, x, 14, shape === "square" ? 66 : 92, 66); return poly(P, shape, "q") + `<text x="${x + (shape === "square" ? 33 : 46)}" y="100">${escapeHtml(label)}</text>`; }).join("");
  return `<div class="b5-src-quad" role="img" aria-label="${escapeHtml(visual.items.map(([l, s]) => `${l} ${({ rect: "직사각형", square: "정사각형", para: "평행사변형", rhombus: "마름모", trapezoid: "사다리꼴" })[s]}`).join(", "))}"><svg viewBox="0 0 ${visual.items.length * cell} 112" style="width:min(100%,${visual.items.length * 130}px)">${body}</svg></div>`;
}

// 6권: 세로 변을 맞대어 이은 도형들. parts = [{shape:"rect"|"square"|"para"|"rhombus", w, top, inner, innerNote}], left·right = 맨 끝 세로 변 글자.
// 마름모·평행사변형은 세로 변이 같고 위아래가 비스듬하다(마름모는 비스듬한 변도 세로 변과 같은 길이).
function sourceJoined(visual) {
  const H = 76, unit = visual.unit ?? "cm";
  let x = 60, body = "", labels = "", minY = 40, maxY = 40 + H, dropY = 0, last;
  visual.parts.forEach((part) => {
    const y = 40 + dropY;
    let P, W;
    if (part.shape === "rhombus" || part.shape === "para") {
      const L = part.shape === "rhombus" ? H : (part.w ?? 1.4) * H, dy = part.drop ?? 0.4 * H, dx = Math.sqrt(Math.max(L * L - dy * dy, 400));
      W = dx; P = [[x, y], [x + dx, y + dy], [x + dx, y + dy + H], [x, y + H]]; dropY += dy;
    } else { W = part.shape === "square" ? H : (part.w ?? 1.6) * H; P = [[x, y], [x + W, y], [x + W, y + H], [x, y + H]]; }
    body += poly(P, part.shape, "q");
    minY = Math.min(minY, ...P.map((p) => p[1])); maxY = Math.max(maxY, ...P.map((p) => p[1]));
    const cx = P.reduce((s, p) => s + p[0], 0) / 4, cy = P.reduce((s, p) => s + p[1], 0) / 4;
    if (part.inner) labels += `<text class="in" x="${cx}" y="${cy - (part.innerNote ? 9 : 0)}">${escapeHtml(part.inner)}</text>`;
    if (part.innerNote != null) labels += `<g class="note">${lenLabel(cx, cy + 11, part.innerNote, unit)}</g>`;
    if (part.top != null) { const e = edgeArc(P[0], P[1], 12); labels += `<path class="arc" d="${e.d}"/>` + lenLabel(e.lx, e.ly - 6, part.top, unit); }
    if (part.slant != null) { const e = edgeArc(P[0], P[1], 12); labels += `<path class="arc" d="${e.d}"/>` + lenLabel(e.lx + 12, e.ly - 8, part.slant, unit); }
    x = P[1][0];
    last = P;
  });
  const first = 40;
  if (visual.left != null) { labels += `<path class="arc" d="M60 ${first}Q36 ${first + H / 2} 60 ${first + H}"/>` + lenLabel(28, first + H / 2, visual.left, unit); }
  if (visual.right != null) { const rx = last[1][0], ty = last[1][1]; labels += `<path class="arc" d="M${rx} ${ty}Q${rx + 24} ${ty + H / 2} ${rx} ${ty + H}"/>` + lenLabel(rx + 40, ty + H / 2, visual.right, unit); }
  const vbW = x + 90, vbH = maxY + 30;
  return `<div class="b5-src-quad" role="img" aria-label="${escapeHtml(`이어 붙인 도형: ${visual.parts.map((p) => [p.inner ?? ({ rect: "직사각형", square: "정사각형", para: "평행사변형", rhombus: "마름모" })[p.shape], p.innerNote, p.top != null && `위 ${p.top}`].filter(Boolean).join(" ")).join(", ")}`)}"><svg viewBox="0 ${minY - 46} ${vbW} ${vbH - minY + 46}" style="width:min(100%,${Math.round(vbW * 1.15)}px)">${body}${labels}</svg></div>`;
}

// 6권: 정사각형으로 나눈 직사각형. squares = [[x, y, 한 변, 글자], …] (단위 칸)
function sourceSquareSplit(visual) {
  const box = (q) => q.length === 5 ? q : [q[0], q[1], q[2], q[2], q[3]];
  const sq = visual.squares.map(box), u = visual.unit ?? 26, ox = visual.left ? 44 : 6, oy = visual.top ? 34 : 6;
  const maxX = Math.max(...sq.map(([x, , w]) => x + w)), maxY = Math.max(...sq.map(([, y, , h]) => y + h));
  const fills = ["#fde7f1", "#e3f6ea", "#eef4ff", "#fff1de", "#f1e8fd", "#fff8dc"];
  let body = sq.map(([x, y, w, h, label], k) => `<rect x="${ox + x * u}" y="${oy + y * u}" width="${w * u}" height="${h * u}" style="fill:${fills[k % fills.length]}"/>${label ? `<text x="${ox + (x + w / 2) * u}" y="${oy + (y + h / 2) * u}">${escapeHtml(label)}</text>` : ""}`).join("");
  if (visual.top) body += `<path class="arc" d="M${ox} ${oy}Q${ox + maxX * u / 2} ${oy - 28} ${ox + maxX * u} ${oy}"/><text x="${ox + maxX * u / 2}" y="${oy - 20}">${escapeHtml(visual.top)}</text>`;
  if (visual.left) body += `<path class="arc" d="M${ox} ${oy + maxY * u}Q${ox - 28} ${oy + maxY * u / 2} ${ox} ${oy}"/><text x="${ox - 26}" y="${oy + maxY * u / 2}">${escapeHtml(visual.left)}</text>`;
  return `<div class="b5-src-quad" role="img" aria-label="${escapeHtml(`정사각형으로 나눈 직사각형${visual.top ? `, 가로 ${visual.top}` : ""}${visual.left ? `, 세로 ${visual.left}` : ""}`)}"><svg viewBox="0 0 ${maxX * u + ox + 8} ${maxY * u + oy + 8}" style="width:min(100%,${Math.round((maxX * u + ox + 8) * 1.3)}px)">${body}</svg></div>`;
}

// 6권: 모눈 도형. rows의 "#"이 채운 칸(한 칸 = 1). 바깥선은 채운 칸과 빈 칸의 경계.
function sourceGridShape(visual) {
  const u = 30, R = visual.rows, H = R.length, W = Math.max(...R.map((r) => r.length)), on = (x, y) => R[y]?.[x] === "#";
  let cells = "", edges = "";
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    cells += `<rect class="${on(x, y) ? "on" : "off"}" x="${4 + x * u}" y="${4 + y * u}" width="${u}" height="${u}"/>`;
    if (!on(x, y)) continue;
    const X = 4 + x * u, Y = 4 + y * u;
    if (!on(x, y - 1)) edges += `M${X} ${Y}h${u}`;
    if (!on(x, y + 1)) edges += `M${X} ${Y + u}h${u}`;
    if (!on(x - 1, y)) edges += `M${X} ${Y}v${u}`;
    if (!on(x + 1, y)) edges += `M${X + u} ${Y}v${u}`;
  }
  return `<div class="b5-src-grid" role="img" aria-label="${escapeHtml(`모눈 도형: ${R.join(" / ").replaceAll("#", "■").replaceAll(".", "□")}`)}"><svg viewBox="0 0 ${W * u + 8} ${H * u + 8}" style="width:min(100%,${W * 62 + 10}px)">${cells}<path class="edge" d="${edges}"/></svg></div>`;
}

// 6권: 직각으로 꺾인 도형. shapes = [{points, shape, text}] (단위 좌표, y는 아래로), lines = 안쪽 선, dims = [{a, b, text}].
// dims는 도형을 시계 방향으로 도는 쪽(위 →, 오른쪽 ↓, 아래 ←, 왼쪽 ↑)으로 a→b를 주면 호가 바깥으로 나간다.
function sourceOrtho(visual) {
  const all = visual.shapes.flatMap((s) => s.points), minX = Math.min(...all.map((p) => p[0])), maxX = Math.max(...all.map((p) => p[0])), minY = Math.min(...all.map((p) => p[1])), maxY = Math.max(...all.map((p) => p[1]));
  const u = Math.min(220 / (maxX - minX), 170 / (maxY - minY)), pad = 74, P = ([x, y]) => [pad + (x - minX) * u, pad + (y - minY) * u];
  let body = visual.shapes.map((s) => poly(s.points.map(P), s.shape ?? "rect", "q") + (s.text ? `<text class="in" x="${(s.points.reduce((t, p) => t + P(p)[0], 0) / s.points.length).toFixed(1)}" y="${(s.points.reduce((t, p) => t + P(p)[1], 0) / s.points.length + (s.shape === "triangle" ? 8 : 0)).toFixed(1)}">${escapeHtml(s.text)}</text>` : "")).join("");
  body += (visual.lines ?? []).map(([x1, y1, x2, y2]) => { const [a, b] = [P([x1, y1]), P([x2, y2])]; return `<line class="inner" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; }).join("");
  body += (visual.dims ?? []).map(({ a, b, text }) => { const e = edgeArc(P(a), P(b), 11), [pa, pb] = [P(a), P(b)], horizontal = Math.abs(pb[1] - pa[1]) < Math.abs(pb[0] - pa[0]); return `<path class="arc" d="${e.d}"/><text x="${(e.lx + (horizontal ? 0 : Math.sign(e.lx - (pa[0] + pb[0]) / 2) * 18)).toFixed(1)}" y="${(e.ly + (horizontal ? Math.sign(e.ly - (pa[1] + pb[1]) / 2) * 6 : 0)).toFixed(1)}">${escapeHtml(text)}</text>`; }).join("");
  const W = pad * 2 + (maxX - minX) * u, H = pad * 2 + (maxY - minY) * u;
  return `<div class="b5-src-quad" role="img" aria-label="${escapeHtml(`직각으로 꺾인 도형${(visual.dims ?? []).length ? `: ${visual.dims.map((d) => d.text).join(", ")}` : ""}`)}"><svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" style="width:min(100%,${Math.round(W * 1.15)}px)">${body}</svg></div>`;
}

// 6권: 직사각형(w × h, w > h)을 세로선에서 잘라 가장 큰 정사각형을 만드는 그림. labels = {top, left, strip}
function sourceCutRect(visual) {
  const k = 150 / Math.max(visual.w, visual.h), W = visual.w * k, H = visual.h * k, x = 52, y = 34, cut = x + H, sx = x + W + 70;
  const L = visual.labels ?? {};
  let body = `<rect class="ra" x="${x}" y="${y}" width="${W}" height="${H}"/><line class="cut" x1="${cut}" y1="${y - 6}" x2="${cut}" y2="${y + H + 6}"/><text class="sc" x="${cut}" y="${y + H + 22}">✂</text>`;
  body += `<path class="arrow" d="M${x + W + 16} ${y + H / 2}H${sx - 16}M${sx - 24} ${y + H / 2 - 7}l8 7-8 7"/><rect class="sq" x="${sx}" y="${y}" width="${H}" height="${H}"/>`;
  if (L.top) body += `<path class="arc" d="M${x} ${y}Q${x + W / 2} ${y - 26} ${x + W} ${y}"/><text x="${x + W / 2}" y="${y - 18}">${escapeHtml(L.top)}</text>`;
  if (L.left) body += `<path class="arc" d="M${x} ${y + H}Q${x - 26} ${y + H / 2} ${x} ${y}"/><text x="${x - 30}" y="${y + H / 2}">${escapeHtml(L.left)}</text>`;
  if (L.strip) body += `<text x="${cut + (W - H) / 2}" y="${y - 12}">${escapeHtml(L.strip)}</text><text x="${cut + (W - H) / 2}" y="${y + H + 14}">${escapeHtml(L.strip)}</text>`;
  return `<div class="b5-src-quad" role="img" aria-label="${escapeHtml(`직사각형을 잘라 가장 큰 정사각형을 만드는 그림${L.top ? `, 가로 ${L.top}` : ""}${L.left ? `, 세로 ${L.left}` : ""}${L.strip ? `, 잘라 낸 폭 ${L.strip}` : ""}`)}"><svg viewBox="0 0 ${sx + H + 12} ${y + H + 34}" style="width:min(100%,${Math.round((sx + H + 12) * 1.2)}px)">${body}</svg></div>`;
}

// 6권: 넓이 모형(타일) 곱셈. 위에 십의 자리 몫과 일의 자리 몫, 오른쪽에 곱하는 수. 두 칸은 빈칸 가·나.
function sourceAreaTiles(visual) {
  const W1 = 120, W2 = 50, H = 90, x = 20, y = 30;
  const box = (bx, w, k) => `<rect class="tile${k}" x="${bx}" y="${y}" width="${w}" height="${H}"/><rect class="qb" x="${bx + w / 2 - 13}" y="${y + H / 2 - 13}" width="26" height="26" rx="4"/><text class="ql" x="${bx + w / 2}" y="${y + H / 2}">${BLANK_LABELS[k]}</text>`;
  const body = box(x, W1, 0) + box(x + W1, W2, 1) + `<text x="${x + W1 / 2}" y="${y - 14}">${escapeHtml(visual.tens)}</text><text x="${x + W1 + W2 / 2}" y="${y - 14}">${escapeHtml(visual.ones)}</text><text x="${x + W1 + W2 + 22}" y="${y + H / 2}">${escapeHtml(visual.m)}</text>`;
  return `<div class="b5-src-quad" role="img" aria-label="${escapeHtml(`타일 그림: 가로 ${visual.tens}와 ${visual.ones}, 세로 ${visual.m}. 두 칸은 빈칸 가, 나`)}"><svg viewBox="0 0 ${x + W1 + W2 + 50} ${y + H + 12}" style="width:min(100%,300px)">${body}</svg></div>`;
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
    case "source-route": return sourceRoute(visual);
    case "source-loop-routes": return sourceLoopRoutes(visual);
    case "source-place-slots": return sourcePlaceSlots(visual);
    case "source-pair-product": return sourcePairProduct(visual);
    case "source-product-triangle": return sourceProductTriangle(visual);
    case "source-product-ring": return sourceProductRing(visual);
    case "source-segment": return sourceSegment(visual);
    case "source-shape-equations": return sourceShapeEquations(visual);
    case "source-fraction-discs": return sourceFractionDiscs(visual);
    case "source-fraction-chain": return sourceFractionChain(visual);
    case "source-dot-figures": return sourceDotFigures(visual);
    case "source-sum-line": return sourceSumLine(visual);
    case "source-text-table": return sourceTextTable(visual);
    case "source-handshake": return sourceHandshake(visual);
    case "source-fan-triangle": return sourceFanTriangle(visual);
    case "source-perimeter": return sourcePerimeter(visual);
    case "source-stone-rows": return sourceStoneRows(visual);
    case "source-halving-tree": return sourceHalvingTree(visual);
    case "source-split-tree": return sourceSplitTree(visual);
    case "source-blank-equation": return sourceBlankEquation(visual);
    case "source-date-ladder": return sourceDateLadder(visual);
    case "source-time-column": return sourceTimeColumn(visual);
    case "source-stick-stages": return sourceStickStages(visual);
    case "source-stone-cross": return sourceStoneCross(visual);
    case "source-shape-stages": return sourceShapeStages(visual);
    case "source-arc-line": return sourceArcLine(visual);
    case "source-ratio-lines": return sourceRatioLines(visual);
    case "source-pencil-bars": return sourcePencilBars(visual);
    case "source-bar-ratio": return sourceBarRatio(visual);
    case "source-balance-ratio": return sourceBalanceRatio(visual);
    case "source-quad": return sourceQuad(visual);
    case "source-quad-gallery": return sourceQuadGallery(visual);
    case "source-joined": return sourceJoined(visual);
    case "source-square-split": return sourceSquareSplit(visual);
    case "source-grid-shape": return sourceGridShape(visual);
    case "source-ortho": return sourceOrtho(visual);
    case "source-cut-rect": return sourceCutRect(visual);
    case "source-area-tiles": return sourceAreaTiles(visual);
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
