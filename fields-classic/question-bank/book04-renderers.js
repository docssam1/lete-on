const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function cellShapeSvg(cells, className = "") {
  const size = 25;
  const minRow = Math.min(...cells.map(([row]) => row));
  const minColumn = Math.min(...cells.map(([, column]) => column));
  const maxRow = Math.max(...cells.map(([row]) => row));
  const maxColumn = Math.max(...cells.map(([, column]) => column));
  const width = (maxColumn - minColumn + 1) * size + 4;
  const height = (maxRow - minRow + 1) * size + 4;
  const squares = cells.map(([row, column]) => `<rect x="${2 + (column - minColumn) * size}" y="${2 + (row - minRow) * size}" width="${size}" height="${size}" rx="2" />`).join("");
  return `<svg class="b4-cell-shape ${className}" viewBox="0 0 ${width} ${height}" role="img" aria-label="네 칸 도형">${squares}</svg>`;
}

function tetrominoChoice(visual) {
  return `<div class="b4-option-grid b4-tetromino-options">${visual.options.map((option) => `<div><b>${option.option}</b>${cellShapeSvg(option.cells)}</div>`).join("")}</div>`;
}

function tetrominoFit(visual) {
  return `<div class="b4-fit-layout"><div class="b4-fit-target"><span>빈자리</span>${cellShapeSvg(visual.targetCells, "is-target")}</div><div class="b4-option-grid">${visual.options.map((option) => `<div><b>${option.option}</b>${cellShapeSvg(option.cells)}</div>`).join("")}</div></div>`;
}

function numberGrid(grid, target = null, hideOthers = false) {
  const columns = grid[0].length;
  return `<div class="b4-number-grid" style="--columns:${columns}">${grid.flatMap((row, rowIndex) => row.map((value, columnIndex) => {
    const isTarget = target && target.row === rowIndex && target.column === columnIndex;
    return `<span${isTarget ? ' class="is-target"' : ""}>${isTarget ? "?" : hideOthers ? "" : escapeHtml(value)}</span>`;
  })).join("")}</div>`;
}

function digitalGrid(visual) {
  const blank = Array.from({ length: visual.grid.length }, () => Array.from({ length: visual.grid.length }, () => ""));
  return `<div class="b4-transform-grid"><div><small>처음</small>${numberGrid(visual.grid)}</div><div class="b4-step-arrow">${visual.operationLabels.map((label) => `<span>→</span><em>${escapeHtml(label)}</em>`).join("")}</div><div><small>움직인 뒤</small>${numberGrid(blank, visual.target, true)}</div></div>`;
}

const OPERATION_LABELS = Object.freeze({
  "mirror-left-right": "좌우 뒤집기",
  "mirror-top-bottom": "위아래 뒤집기",
  "rotate-half": "반 바퀴"
});

function digitalArithmetic(visual) {
  return `<div class="b4-digital-arithmetic">${visual.rows.map((row, index) => `<div class="b4-digital-row"><strong>${row.source}</strong><span>→</span><em>${OPERATION_LABELS[row.operation] || row.operation}</em><b>${index === visual.rows.length - 1 ? visual.operator : ""}</b></div>`).join("")}<div class="b4-arithmetic-line"></div><strong class="b4-answer-blank">?</strong></div>`;
}

function foldedGrid(visual) {
  const folded = Array.from({ length: visual.foldedRows }, () => Array.from({ length: visual.foldedColumns }, () => ""));
  return `<div class="b4-transform-grid b4-fold-grid"><div><small>번호판</small>${numberGrid(visual.grid)}</div><div class="b4-step-arrow">${visual.folds.map((fold) => `<span>→</span><em>${escapeHtml(fold.direction)}</em>`).join("")}</div><div><small>접은 뒤</small>${numberGrid(folded, visual.target, true)}</div></div>`;
}

const COLOR_CLASS = Object.freeze({ "빨강": "red", "노랑": "yellow", "초록": "green", "파랑": "blue" });

function surfaceGrid(labels) {
  return `<div class="b4-surface-grid">${labels.map((label) => `<span class="${COLOR_CLASS[label] || ""}">${escapeHtml(label)}</span>`).join("")}</div>`;
}

function foldSurface(visual) {
  const count = visual.finalRows * visual.finalColumns;
  return `<div class="b4-transform-grid b4-surface-fold"><div><small>앞뒤가 같은 색</small>${surfaceGrid(visual.labels)}</div><div class="b4-step-arrow">${visual.foldLabels.map((label) => `<span>→</span><em>${escapeHtml(label)}</em>`).join("")}</div><div><small>접은 뒤 맨 위</small><div class="b4-folded-surface" style="--count:${count}">${Array.from({ length: count }, () => "<span>?</span>").join("")}</div></div></div>`;
}

function pairSumCards(visual) {
  return `<div class="b4-pair-sums"><strong>한 쌍의 합 = ${visual.target}</strong>${visual.pairs.map((pair, pairIndex) => `<div>${pair.map((value, side) => `<span>${pairIndex === visual.blankPair && side === visual.blankSide ? "?" : value}</span>`).join("<b>+</b>")}<b>=</b><em>${visual.target}</em></div>`).join("")}</div>`;
}

function shapeDifference(visual) {
  return `<div class="b4-equation-stack">${visual.equations.map((equation) => `<div><strong>${equation.larger}</strong><b>−</b><strong>${equation.smaller}</strong><b>=</b><em>${equation.difference}</em></div>`).join("")}<div class="is-target"><strong>${visual.target.larger}</strong><b>−</b><strong>${visual.target.smaller}</strong><b>=</b><em>?</em></div></div>`;
}

function cluePanel(visual, extra = "") {
  return `<div class="b4-clue-panel">${visual.clues.map((clue, index) => `<p><b>${index + 1}</b>${escapeHtml(clue)}</p>`).join("")}${extra}</div>`;
}

function measurementOrder(visual) {
  return cluePanel(visual, `<div class="b4-target-strip">${escapeHtml(visual.target)}의 키 = <b>?</b> cm</div>`);
}

function balanceRatio(visual) {
  return `<div class="b4-balance-list">${visual.equations.map((equation) => `<div><span class="b4-object">${equation.left.symbol}</span><small>1개</small><b>=</b><span class="b4-object repeated">${Array.from({ length: equation.ratio }, () => equation.right.symbol).join(" ")}</span><small>${equation.ratio}개</small></div>`).join("")}<div class="b4-target-strip">${visual.target.left.symbol} 1개 = ${visual.target.right.symbol} <b>?</b>개</div></div>`;
}

function directionalSeat(visual) {
  const seats = Array.from({ length: visual.rows * visual.columns }, () => "<span></span>").join("");
  return `<div class="b4-seat-layout">${cluePanel(visual)}<div><div class="b4-seat-grid" style="--columns:${visual.columns}">${seats}</div><div class="b4-target-strip">${escapeHtml(visual.target)}의 자리 = ?</div></div></div>`;
}

function circularSeat(visual) {
  const seats = Array.from({ length: visual.count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / visual.count;
    const left = 50 + Math.cos(angle) * 39;
    const top = 50 + Math.sin(angle) * 39;
    return `<span style="left:${left}%;top:${top}%">${index === 0 ? escapeHtml(visual.anchor) : "?"}</span>`;
  }).join("");
  return `<div class="b4-seat-layout">${cluePanel(visual)}<div class="b4-circle-seats">${seats}<i>원탁</i></div></div>`;
}

export function book04Markup(visual) {
  if (!visual || visual.kind !== "book4") return "";
  switch (visual.subtype) {
    case "tetromino-choice": return tetrominoChoice(visual);
    case "tetromino-fit": return tetrominoFit(visual);
    case "digital-grid-transform": return digitalGrid(visual);
    case "digital-arithmetic": return digitalArithmetic(visual);
    case "fold-number-grid": return foldedGrid(visual);
    case "fold-surface-top": return foldSurface(visual);
    case "pair-sum-cards": return pairSumCards(visual);
    case "shape-difference-chain": return shapeDifference(visual);
    case "measurement-order": return measurementOrder(visual);
    case "balance-unit-ratio": return balanceRatio(visual);
    case "directional-seat": return directionalSeat(visual);
    case "circular-seat": return circularSeat(visual);
    default: return "";
  }
}
