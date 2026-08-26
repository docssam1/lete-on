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

function markedCongruentPartition(visual) {
  const size = 34;
  const active = new Set(visual.activeCells.map(([row, column]) => `${row}:${column}`));
  const marker = new Set(visual.markerCells.map(([row, column]) => `${row}:${column}`));
  const groupByCell = new Map();
  visual.groups.forEach((group, groupIndex) => group.forEach(([row, column]) => groupByCell.set(`${row}:${column}`, groupIndex)));
  const cells = visual.activeCells.map(([row, column]) => {
    const x = column * size;
    const y = row * size;
    const symbol = marker.has(`${row}:${column}`) ? `<text x="${x + size / 2}" y="${y + size * .68}">${escapeHtml(visual.marker)}</text>` : "";
    return `<rect x="${x}" y="${y}" width="${size}" height="${size}"/>${symbol}`;
  }).join("");
  const edges = visual.reveal ? visual.activeCells.flatMap(([row, column]) => {
    const x = column * size;
    const y = row * size;
    const group = groupByCell.get(`${row}:${column}`);
    const sides = [
      [-1, 0, `M${x} ${y}H${x + size}`],
      [0, 1, `M${x + size} ${y}V${y + size}`],
      [1, 0, `M${x} ${y + size}H${x + size}`],
      [0, -1, `M${x} ${y}V${y + size}`]
    ];
    return sides.filter(([dr, dc]) => !active.has(`${row + dr}:${column + dc}`) || groupByCell.get(`${row + dr}:${column + dc}`) !== group).map(([, , path]) => path);
  }).join("") : "";
  return `<svg class="b4-marked-partition ${visual.reveal ? "answer" : ""}" viewBox="-3 -3 ${visual.columns * size + 6} ${visual.rows * size + 6}" role="img" aria-label="${escapeHtml(visual.markerLabel)}가 표시된 합동 도형 분할 문제"><g class="cells">${cells}</g>${edges ? `<path class="partition-line" d="${edges}"/>` : ""}</svg>`;
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

function matrixCss(matrix) {
  return `matrix(${matrix[0]},${matrix[2]},${matrix[1]},${matrix[3]},0,0)`;
}

function digitalUprightGrid(visual) {
  const columns = visual.grid[0].length;
  return `<div class="b4-upright-layout"><div class="b4-upright-grid" style="--columns:${columns}">${visual.grid.flat().map((card) => `<span><i style="transform:${matrixCss(card.matrix)}">${card.value}</i></span>`).join("")}</div><div class="b4-operation-list">${visual.operationLabels.map((label, index) => `<span><b>${index + 1}</b>${escapeHtml(label)}</span>`).join("")}</div></div>`;
}

function digitalSelfHalfTurn(visual) {
  return `<div class="b4-self-turn">${visual.rows.map((row, index) => `<div><b>(${index + 1})</b><strong>${row.source}</strong><em>${row.operator}</em>${visual.showTurned ? `<span>${row.turned}</span>` : '<span class="b4-turn-pair"><i></i><i></i></span>'}<i>=</i><span class="answer-space">?</span></div>`).join("")}<small>두 빈칸에는 왼쪽 수를 반 바퀴 돌려 읽은 수가 들어갑니다.</small></div>`;
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

function overlappingPaper(visual) {
  return `<div class="b4-paper-snapshots">${visual.snapshots.map((snapshot, index) => `<div><small>${index ? `${index}장 뺀 뒤` : "처음"}</small><span class="b4-paper-grid" style="--columns:${visual.size}">${snapshot.flat().map((cell) => `<i style="background:${cell?.color || "#fff"}">${cell ? escapeHtml(cell.label) : ""}</i>`).join("")}</span></div>`).join("")}</div>`;
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

function measurementDifference(visual) {
  return cluePanel(visual, `<div class="b4-target-strip">${escapeHtml(visual.target)} = <b>?</b></div>`);
}

function balanceRatio(visual) {
  return `<div class="b4-balance-list">${visual.equations.map((equation) => `<div><span class="b4-object">${equation.left.symbol}</span><small>1개</small><b>=</b><span class="b4-object repeated">${Array.from({ length: equation.ratio }, () => equation.right.symbol).join(" ")}</span><small>${equation.ratio}개</small></div>`).join("")}<div class="b4-target-strip">${visual.target.left.symbol} 1개 = ${visual.target.right.symbol} <b>?</b>개</div></div>`;
}

function directionalSeat(visual) {
  const seats = Array.from({ length: visual.rows * visual.columns }, () => "<span></span>").join("");
  return `<div class="b4-seat-layout">${cluePanel(visual)}<div><div class="b4-seat-grid" style="--columns:${visual.columns}">${seats}</div><div class="b4-target-strip">${escapeHtml(visual.target)}의 자리 = ?</div></div></div>`;
}

function directionalLandmarkMap(visual) {
  const cells = visual.places.map((place, index) => {
    const label = visual.reveal ? place : index === visual.targetIndex ? "㉠" : visual.shown[index] || "?";
    return `<span class="${index === visual.targetIndex ? "is-target" : ""}"><b>${escapeHtml(label)}</b><small>${index === 0 ? "북서" : index === 1 ? "북동" : index === 2 ? "남서" : "남동"}</small></span>`;
  }).join("");
  return `<div class="b4-landmark-layout">${cluePanel(visual)}<div class="b4-landmark-map">${cells}<i><b>북</b><b>서</b><b>동</b><b>남</b></i></div></div>`;
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

function raceThirdPlace(visual) {
  return cluePanel(visual, `<div class="b4-target-strip">세 번째로 들어온 사람 = <b>?</b></div>`);
}

function circularSeatBlank(visual) {
  const seats = Array.from({ length: visual.count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / visual.count;
    const left = 50 + Math.cos(angle) * 39;
    const top = 50 + Math.sin(angle) * 39;
    const label = index === 0 ? escapeHtml(visual.anchor) : index === visual.targetSeat ? "㉠" : "?";
    return `<span class="${index === visual.targetSeat ? "is-target" : ""}" style="left:${left}%;top:${top}%">${label}</span>`;
  }).join("");
  return `<div class="b4-seat-layout">${cluePanel(visual)}<div class="b4-circle-seats b4-circle-blank">${seats}<i>원탁</i></div></div>`;
}

function foldedCutLine(visual) {
  if (!visual.reveal) {
    const grid = [1,2,3].map((index) => `<path class="fold" d="M${10 + index * 30} 25V85"/>`).join("") + '<path class="fold" d="M10 55H130"/>';
    return `<div class="b4-fold-line-problem"><svg viewBox="0 0 230 110" role="img" aria-label="세 번 접은 색종이에 그어진 두 사선"><rect x="10" y="25" width="120" height="60"/>${grid}<path class="step-arrow" d="M145 55H168m0 0-8-7m8 7-8 7"/><rect x="188" y="25" width="30" height="60"/><path d="M${188 + visual.cutInset} 25 L188 40 L218 55"/></svg><small>세 번 접은 뒤</small></div>`;
  }
  const grid = [1,2,3].map((index) => `<path class="fold" d="M${index * 25} 0V50"/>`).join("") + '<path class="fold" d="M0 25H100"/>';
  const paths = visual.repeatStarts.map((column) => {
    const left = column * 25;
    return `M${left + visual.cutInset} 0 L${left} 12.5 L${left + 25} 25`;
  }).join(" ");
  return `<div class="b4-fold-line-answer"><svg viewBox="0 0 100 50" role="img" aria-label="4열 2행 모눈에 펼친 잘린 선"><rect x="1" y="1" width="98" height="48"/><g>${grid}</g><path d="${paths}"/></svg></div>`;
}

function frontBackTwoOrders(visual) {
  return `<div class="b4-two-order-cases">${visual.clues.map((clue) => `<p>${escapeHtml(clue)} <b>전체 ?명</b></p>`).join("")}</div>`;
}

export function book04Markup(visual) {
  if (!visual || visual.kind !== "book4") return "";
  switch (visual.subtype) {
    case "tetromino-choice": return tetrominoChoice(visual);
    case "tetromino-fit": return tetrominoFit(visual);
    case "marked-congruent-partition": return markedCongruentPartition(visual);
    case "digital-grid-transform": return digitalGrid(visual);
    case "digital-arithmetic": return digitalArithmetic(visual);
    case "digital-upright-grid": return digitalUprightGrid(visual);
    case "digital-self-half-turn": return digitalSelfHalfTurn(visual);
    case "fold-number-grid": return foldedGrid(visual);
    case "fold-surface-top": return foldSurface(visual);
    case "overlapping-paper-order": return overlappingPaper(visual);
    case "pair-sum-cards": return pairSumCards(visual);
    case "shape-difference-chain": return shapeDifference(visual);
    case "measurement-order": return measurementOrder(visual);
    case "measurement-difference": return measurementDifference(visual);
    case "balance-unit-ratio": return balanceRatio(visual);
    case "directional-seat": return directionalSeat(visual);
    case "directional-landmark-map": return directionalLandmarkMap(visual);
    case "circular-seat": return circularSeat(visual);
    case "race-third-place": return raceThirdPlace(visual);
    case "circular-seat-blank": return circularSeatBlank(visual);
    case "three-fold-cut-line": return foldedCutLine(visual);
    case "front-back-two-orders": return frontBackTwoOrders(visual);
    default: return "";
  }
}
