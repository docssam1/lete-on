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

const FOLD_ARROW_MODEL = Object.freeze({
  "오른쪽을 왼쪽으로": { crease: "M50 4V96", arrow: "M82 50Q58 22 28 50" },
  "왼쪽을 오른쪽으로": { crease: "M50 4V96", arrow: "M18 50Q42 22 72 50" },
  "아래쪽을 위쪽으로": { crease: "M4 50H96", arrow: "M50 82Q78 58 50 28" },
  "위쪽을 아래쪽으로": { crease: "M4 50H96", arrow: "M50 18Q78 42 50 72" }
});

function foldBoard(rows, columns, values, { fold = null, target = null, cutCells = [] } = {}) {
  const cutKeys = new Set(cutCells.map(({ row, column }) => `${row}:${column}`));
  const cells = Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const isTarget = target?.row === row && target?.column === column;
    const isCut = cutKeys.has(`${row}:${column}`);
    const value = values?.[row]?.[column] ?? "";
    return `<span class="${isTarget ? "is-target" : ""}${isCut ? " is-cut" : ""}">${isTarget ? "✂" : escapeHtml(value)}</span>`;
  }).join("");
  const motion = fold ? FOLD_ARROW_MODEL[fold.direction] : null;
  const overlay = motion
    ? `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><marker id="b4-fold-arrow-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><path class="crease" d="${motion.crease}"/><path class="motion" marker-end="url(#b4-fold-arrow-head)" d="${motion.arrow}"/></svg>`
    : "";
  return `<span class="b4-fold-board" style="--rows:${rows};--columns:${columns}">${cells}${overlay}</span>`;
}

function foldedGrid(visual) {
  if (visual.reveal) {
    return `<div class="b4-fold-answer"><small>펼쳐서 함께 잘린 칸</small>${foldBoard(visual.grid.length, visual.grid[0].length, visual.grid, { cutCells: visual.cutCells })}</div>`;
  }
  let rows = visual.grid.length;
  let columns = visual.grid[0].length;
  const stages = visual.folds.map((fold, index) => {
    const values = index === 0 ? visual.grid : null;
    const stage = `<figure><figcaption>${index ? `${index}번 접은 뒤` : "처음"}</figcaption>${foldBoard(rows, columns, values, { fold })}<small>${escapeHtml(fold.direction)}</small></figure>`;
    if (fold.axis === "vertical") columns /= 2;
    else rows /= 2;
    return stage;
  });
  stages.push(`<figure><figcaption>접은 뒤</figcaption>${foldBoard(rows, columns, null, { target: visual.target })}<small>표시한 칸 자르기</small></figure>`);
  return `<div class="b4-fold-sequence">${stages.join('<b class="b4-sequence-arrow">→</b>')}</div>`;
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
  const snapshot = (removed, stackClass = "b4-paper-stack") => {
    const sheets = [...visual.layers.slice(removed)].reverse().map((paper, layer) => `<i class="b4-paper-sheet" style="--paper-row:${paper.row};--paper-column:${paper.column};--paper-color:${paper.color};--paper-layer:${layer}"><b>${escapeHtml(paper.label)}</b></i>`).join("");
    return `<span class="${stackClass}">${sheets}</span>`;
  };
  if (!visual.reveal) {
    const steps = visual.layers.slice(1).map((_, index) => `<div><small>${index + 1}장 뺀 뒤</small>${snapshot(index + 1, "b4-paper-step-stack")}</div>`).join("");
    return `<div class="b4-paper-problem"><div class="b4-paper-snapshots is-problem"><div><small>겹친 모습</small>${snapshot(0)}</div></div><button type="button" class="b4-paper-toggle" aria-expanded="false">한 장씩 보기</button><div class="b4-paper-snapshots is-steps" hidden>${steps}</div></div>`;
  }
  return `<div class="b4-paper-snapshots is-answer">${visual.layers.map((_, index) => `<div class="${index === visual.layers.length - 1 ? "is-last" : ""}"><small>${index ? `${index}장 뺀 뒤` : "처음"}</small>${snapshot(index)}</div>`).join("")}</div>`;
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
  const places = Array.from({ length: 5 }, (_, index) => {
    const name = visual.reveal ? visual.order[index] : "?";
    return `<li class="${index === 2 ? "is-third" : ""}"><small>${index + 1}위</small><strong>${escapeHtml(name)}</strong></li>`;
  }).join("");
  return `<div class="b4-race-layout">${cluePanel(visual)}<ol class="b4-race-order">${places}</ol></div>`;
}

function circularSeatBlank(visual) {
  const seats = Array.from({ length: visual.count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / visual.count;
    const left = 50 + Math.cos(angle) * 39;
    const top = 50 + Math.sin(angle) * 39;
    const label = visual.reveal
      ? escapeHtml(visual.order[index])
      : index === 0
        ? escapeHtml(visual.anchor)
        : index === visual.targetSeat ? "㉠" : "?";
    return `<span class="${index === visual.targetSeat ? "is-target" : ""}" style="left:${left}%;top:${top}%">${label}</span>`;
  }).join("");
  return `<div class="b4-seat-layout">${cluePanel(visual)}<div class="b4-circle-seats b4-circle-blank">${seats}<i>원탁</i></div></div>`;
}

function foldedCutLine(visual) {
  const grid = [1,2,3].map((index) => `<path class="crease" d="M${index * 25} 0V50"/>`).join("") + '<path class="crease" d="M0 25H100"/>';
  const answerLines = visual.cutSegments.map(([x1, y1, x2, y2]) => `<line x1="${x1 * 25}" y1="${y1 * 25}" x2="${x2 * 25}" y2="${y2 * 25}"/>`).join("");
  if (visual.reveal) {
    return `<div class="b4-fold-line-answer"><svg viewBox="-2 -2 104 54" role="img" aria-label="세 번 접은 색종이를 펼친 뒤의 잘린 선"><rect class="paper" x="0" y="0" width="100" height="50"/>${grid}<g class="cut-lines">${answerLines}</g></svg></div>`;
  }
  const cutApex = (visual.cutApexY - 1) * 78;
  const mobileCutApex = (visual.cutApexY - 1) * 64;
  const marker = (id) => `<defs><marker id="${id}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs>`;
  const desktopArrow = "b4-fold-arrow-desktop";
  const mobileArrow = "b4-fold-arrow-mobile";
  const desktop = `<svg class="b4-fold-process b4-fold-process-desktop" viewBox="0 0 520 118" role="img" aria-label="색종이를 세 번 접고 두 사선을 자르는 과정">${marker(desktopArrow)}<g transform="translate(8 9)"><rect class="paper" width="78" height="78"/><path class="crease" d="M39 0V78"/><path class="fold-motion" marker-end="url(#${desktopArrow})" d="M58 31Q39 15 18 31"/><text x="39" y="96">처음</text></g><path class="connector" marker-end="url(#${desktopArrow})" d="M100 48H126"/><g transform="translate(143 9)"><rect class="paper" width="39" height="78"/><path class="crease" d="M0 39H39"/><path class="fold-motion" marker-end="url(#${desktopArrow})" d="M29 18Q12 39 28 58"/><text x="19.5" y="96">1번 접기</text></g><path class="connector" marker-end="url(#${desktopArrow})" d="M198 48H224"/><g transform="translate(241 29)"><rect class="paper" width="42" height="42"/><path class="crease" d="M21 0V42"/><path class="fold-motion" marker-end="url(#${desktopArrow})" d="M31 30Q21 15 10 29"/><text x="21" y="76">2번 접기</text></g><path class="connector" marker-end="url(#${desktopArrow})" d="M299 48H325"/><g transform="translate(342 9)"><rect class="paper" width="34" height="78"/><path class="cut" d="M0 ${cutApex}L34 0M0 ${cutApex}L34 78"/><text x="17" y="96">3번 접은 뒤</text></g><path class="connector" marker-end="url(#${desktopArrow})" d="M394 48H420"/><g transform="translate(438 23)"><rect class="paper" width="72" height="36"/><path class="crease" d="M18 0V36M36 0V36M54 0V36M0 18H72"/><text x="36" y="70">펼친 뒤 그리기</text></g></svg>`;
  const mobile = `<svg class="b4-fold-process b4-fold-process-mobile" viewBox="0 0 300 218" role="img" aria-label="색종이를 세 번 접고 두 사선을 자르는 과정">${marker(mobileArrow)}<g transform="translate(12 10)"><rect class="paper" width="64" height="64"/><path class="crease" d="M32 0V64"/><path class="fold-motion" marker-end="url(#${mobileArrow})" d="M49 27Q32 12 14 27"/><text x="32" y="82">처음</text></g><path class="connector" marker-end="url(#${mobileArrow})" d="M86 42H107"/><g transform="translate(119 10)"><rect class="paper" width="32" height="64"/><path class="crease" d="M0 32H32"/><path class="fold-motion" marker-end="url(#${mobileArrow})" d="M24 14Q9 32 23 49"/><text x="16" y="82">1번 접기</text></g><path class="connector" marker-end="url(#${mobileArrow})" d="M164 42H185"/><g transform="translate(197 22)"><rect class="paper" width="40" height="40"/><path class="crease" d="M20 0V40"/><path class="fold-motion" marker-end="url(#${mobileArrow})" d="M30 29Q20 13 9 28"/><text x="20" y="70">2번 접기</text></g><path class="connector" marker-end="url(#${mobileArrow})" d="M248 42Q276 42 276 92Q276 112 102 112V130"/><g transform="translate(85 132)"><rect class="paper" width="28" height="64"/><path class="cut" d="M0 ${mobileCutApex}L28 0M0 ${mobileCutApex}L28 64"/><text x="14" y="82">3번 접은 뒤</text></g><path class="connector" marker-end="url(#${mobileArrow})" d="M129 164H153"/><g transform="translate(166 140)"><rect class="paper" width="96" height="48"/><path class="crease" d="M24 0V48M48 0V48M72 0V48M0 24H96"/><text x="48" y="66">펼친 뒤 그리기</text></g></svg>`;
  return `<div class="b4-fold-line-problem">${desktop}${mobile}</div>`;
}

function frontBackTwoOrders(visual) {
  return `<div class="b4-two-order-cases">${visual.clues.map((clue) => `<p>${escapeHtml(clue)} <b>전체 ?명</b></p>`).join("")}</div>`;
}

// 원본(학생용 무답본) 그림을 따라 그린다. 답이 되는 수는 그림에 적지 않는다.
const bulletBox = (clues) => clues?.length
  ? `<ul class="b4-src-clues">${clues.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ul>`
  : "";

function sourceNumberModel(visual) {
  // 원본 3쪽: 모노미노·도미노 예시(도형 종류 1개) 다음에 묻는 칸 수.
  const name = { 1: "모노미노", 2: "도미노", 3: "트리미노", 4: "테트로미노" };
  const shape = (cells) => {
    const s = 18;
    const w = Math.max(...cells.map(([, c]) => c)) + 1;
    const h = Math.max(...cells.map(([r]) => r)) + 1;
    return `<svg class="b4-src-mino" viewBox="0 0 ${w * s + 2} ${h * s + 2}" width="${w * s + 2}" height="${h * s + 2}" aria-hidden="true">${cells.map(([r, c]) => `<rect x="${1 + c * s}" y="${1 + r * s}" width="${s}" height="${s}"/>`).join("")}</svg>`;
  };
  const row = (count, cells, result) => `<div class="b4-src-mino-row"><span>정사각형 ${count}개 → ${name[count]}</span>${cells ? shape(cells) : "<i></i>"}<b>${result}</b></div>`;
  const count = Number(visual.count);
  return `<div class="b4-src-minos">${row(1, [[0, 0]], "도형 종류 1개")}${row(2, [[0, 0], [1, 0]], "도형 종류 1개")}${row(count, null, "도형 종류 ?개")}</div>`;
}

function sourceFoldHoles(visual) {
  const size = 84;
  const point = ([x, y], offsetX) => [offsetX + x * size, 14 + y * size];
  const points = (vertices, offsetX) => vertices.map((vertex) => point(vertex, offsetX).join(",")).join(" ");
  const foldPanel = (paper, fold, offsetX, label) => {
    const [lineStart, lineEnd] = fold.line.map((vertex) => point(vertex, offsetX));
    const midX = (lineStart[0] + lineEnd[0]) / 2;
    const midY = (lineStart[1] + lineEnd[1]) / 2;
    const length = Math.hypot(fold.direction[0], fold.direction[1]) || 1;
    const dx = fold.direction[0] / length * 18;
    const dy = fold.direction[1] / length * 18;
    return `<g><text x="${offsetX + size / 2}" y="10" text-anchor="middle" font-size="8">${label}</text><polygon class="paper" points="${points(paper, offsetX)}"/><line class="fold-line" x1="${lineStart[0]}" y1="${lineStart[1]}" x2="${lineEnd[0]}" y2="${lineEnd[1]}"/><path class="fold-arrow" d="M${midX - dx} ${midY - dy}L${midX + dx} ${midY + dy}"/><path class="fold-arrow-head" d="M${midX + dx} ${midY + dy}l${-6 - dy / 4} ${-dx / 4}l${dy / 2} ${dx / 2}Z"/></g>`;
  };
  const first = foldPanel(visual.paper.vertices, visual.folds[0], 8, "첫째 접기");
  const second = visual.folds[1]
    ? foldPanel(visual.folds[0].after, visual.folds[1], 126, "둘째 접기")
    : `<g><text x="168" y="10" text-anchor="middle" font-size="8">접은 모양</text><polygon class="paper" points="${points(visual.folds[0].after, 126)}"/></g>`;
  const finalOffset = 244;
  const clipId = `b4-${escapeHtml(visual.diagramId)}-paper`;
  const holes = visual.holes.map((currentHole) => {
    const [cx, cy] = point(currentHole.center, finalOffset);
    return `<circle class="hole ${escapeHtml(currentHole.boundary)}" cx="${cx}" cy="${cy}" r="${currentHole.radius * size}" clip-path="url(#${clipId})"/>`;
  }).join("");
  const final = `<g><text x="${finalOffset + size / 2}" y="10" text-anchor="middle" font-size="8">구멍 낸 모양</text><defs><clipPath id="${clipId}"><polygon points="${points(visual.finalPaper, finalOffset)}"/></clipPath></defs><polygon class="paper" points="${points(visual.finalPaper, finalOffset)}"/>${holes}</g>`;
  return `<svg class="b4-source-fold-holes" viewBox="0 0 340 108" role="img" aria-label="색종이를 접고 구멍을 낸 그림">${first}<path class="step-arrow" d="M100 56H118m-7-6 7 6-7 6"/>${second}<path class="step-arrow" d="M218 56H236m-7-6 7 6-7 6"/>${final}</svg>`;
}

function sourceCubeBox(visual) {
  // 원본 19쪽: 정육면체 상자(굵은 선) 속 쌓기나무. 앞면이 정사각형인 빗각 그림.
  const [W, H, D] = visual.dimensions.map(Number);
  const map = visual.map || [];
  const s = 34;
  const k = s / 3;
  const ox = 8;
  const oy = 8 + D * k + H * s;
  const pt = (x, y, z) => [ox + x * s + z * k, oy - y * s - z * k];
  const poly = (cls, ...p) => `<polygon class="${cls}" points="${p.map((q) => q.map((n) => n.toFixed(1)).join(",")).join(" ")}"/>`;
  const height = (x, z) => Number(map[z]?.[x] || 0);
  let cubes = "";
  for (let z = D - 1; z >= 0; z -= 1) {
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        if (y >= height(x, z)) continue;
        cubes += poly("cube-front", pt(x, y, z), pt(x + 1, y, z), pt(x + 1, y + 1, z), pt(x, y + 1, z));
        if (y + 1 >= height(x, z)) cubes += poly("cube-top", pt(x, y + 1, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1));
        if (x + 1 >= W || y >= height(x + 1, z)) cubes += poly("cube-side", pt(x + 1, y, z), pt(x + 1, y, z + 1), pt(x + 1, y + 1, z + 1), pt(x + 1, y + 1, z));
      }
    }
  }
  const line = (a, b) => `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`;
  const box = [
    line(pt(0, 0, 0), pt(W, 0, 0)), line(pt(W, 0, 0), pt(W, H, 0)), line(pt(W, H, 0), pt(0, H, 0)), line(pt(0, H, 0), pt(0, 0, 0)),
    line(pt(0, H, 0), pt(0, H, D)), line(pt(W, H, 0), pt(W, H, D)), line(pt(W, 0, 0), pt(W, 0, D)),
    line(pt(0, H, D), pt(W, H, D)), line(pt(W, H, D), pt(W, 0, D))
  ].join("");
  const w = ox * 2 + W * s + D * k;
  const h = oy + 8;
  return `<svg class="b4-src-cube-box" viewBox="0 0 ${w.toFixed(0)} ${h.toFixed(0)}" role="img" aria-label="정육면체 상자 속 쌓기나무">${cubes}<g class="box">${box}</g></svg>`;
}

// 원본 16~18쪽 쌓기나무: 앞면이 정사각형이고 깊이가 오른쪽 위로 s/3씩 물러나는 빗각 그림.
// map[줄][칸], 0번 줄이 뒤(위에서 본 그림의 윗줄). walls는 18쪽 「보이는 것」의 벽 모서리 세 줄.
export function obliqueCubes(map, { s = 36, walls = false, labels = false, label = "쌓기나무 그림" } = {}) {
  const D = map.length;
  const W = Math.max(...map.map((row) => row.length));
  const height = (x, z) => Number(map[D - 1 - z]?.[x] || 0);
  const H = Math.max(1, ...map.flat().map(Number));
  const k = s / 3;
  const pt = (x, y, z) => [x * s + z * k, -y * s - z * k];
  const f = (n) => n.toFixed(1);
  const poly = (cls, ...p) => `<polygon class="${cls}" points="${p.map((q) => q.map(f).join(",")).join(" ")}"/>`;
  const extent = [pt(0, 0, 0), pt(W, 0, 0), pt(0, H, D), pt(W, H, D), pt(W, 0, D)];
  let back = "";
  if (walls) {
    const ends = [pt(0, H + 0.6, D), pt(W + 0.8, 0, D), pt(0, 0, -1.4)];
    const o = pt(0, 0, D);
    back = ends.map((e) => `<line class="wall-edge" x1="${f(o[0])}" y1="${f(o[1])}" x2="${f(e[0])}" y2="${f(e[1])}"/>`).join("");
    extent.push(...ends);
  }
  let cubes = "";
  let tops = "";
  for (let z = D - 1; z >= 0; z -= 1) {
    for (let x = 0; x < W; x += 1) {
      const h = height(x, z);
      for (let y = 0; y < h; y += 1) {
        cubes += poly("cube-front", pt(x, y, z), pt(x + 1, y, z), pt(x + 1, y + 1, z), pt(x, y + 1, z));
        if (y + 1 === h) cubes += poly("cube-top", pt(x, y + 1, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1));
        if (y >= height(x + 1, z)) cubes += poly("cube-side", pt(x + 1, y, z), pt(x + 1, y, z + 1), pt(x + 1, y + 1, z + 1), pt(x + 1, y + 1, z));
      }
      if (labels && h) {
        const c = pt(x + 0.5, h, z + 0.5);
        tops += `<text class="top-label" x="${f(c[0])}" y="${f(c[1] + 5)}">${h}</text>`;
      }
    }
  }
  const pad = 4;
  const xs = extent.map((p) => p[0]);
  const ys = extent.map((p) => p[1]);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad - (labels ? 8 : 0);
  const w = Math.max(...xs) + pad - minX;
  const hgt = Math.max(...ys) + pad - minY;
  return `<svg class="b4-src-cubes" viewBox="${f(minX)} ${f(minY)} ${f(w)} ${f(hgt)}" width="${f(w)}" height="${f(hgt)}" role="img" aria-label="${label}">${back}${cubes}${tops}</svg>`;
}

function sourceHiddenCube(visual) {
  // 원본 18쪽: 위 세 문제는 「전체」「보이는 것」 두 그림, 아래 세 문제는 그림 하나. 층수·개수는 적지 않는다.
  // 9권 판서도 같은 빗각 그림을 쓴다: walls(벽 모서리 세 줄)는 그림 하나에도, figures는 이름 붙은 그림 여러 개(A·B).
  if (visual.figures) return `<div class="b4-src-hidden-pair">${visual.figures.map((f) => `<figure>${obliqueCubes(f.map, { s: 34, walls: !!f.walls })}<figcaption>${escapeHtml(f.label)}</figcaption></figure>`).join("")}</div>`;
  if (visual.single) return `<div class="b4-src-hidden-pair single"><figure>${obliqueCubes(visual.map, { s: Number(visual.size) || 44, walls: !!visual.walls })}</figure></div>`;
  return `<div class="b4-src-hidden-pair"><figure>${obliqueCubes(visual.map)}<figcaption>전체</figcaption></figure><figure>${obliqueCubes(visual.map, { walls: true })}<figcaption>보이는 것</figcaption></figure></div>`;
}

function topViewGrid(map) {
  // 원본 16·17쪽: 위에서 본 모양(빨간 빈칸). 쌓기나무가 있는 자리만 칸을 그린다.
  const s = 34;
  const cells = map.flatMap((row, r) => row.map((h, c) => Number(h) ? `<rect x="${c * s + 1}" y="${r * s + 17}" width="${s}" height="${s}"/>` : "")).join("");
  const W = Math.max(...map.map((row) => row.length));
  return `<svg class="b4-src-topview" viewBox="0 0 ${W * s + 2} ${map.length * s + 18}" width="${W * s + 2}" height="${map.length * s + 18}" role="img" aria-label="위에서 본 모양"><text x="${(W * s) / 2 + 1}" y="12">위</text>${cells}</svg>`;
}

function sourceCubeTopView(visual) {
  // 원본 16·17쪽: 쌓기나무 그림 → 위에서 본 모양. example이면 16쪽 오른쪽 예시 상자를 함께 싣는다.
  const example = visual.example
    ? `<figure class="b4-src-cube-example">${obliqueCubes([[3, 2, 1], [2, 1, 0], [1, 0, 0]], { labels: true, s: 28, label: "예시: 윗면에 그 줄의 개수를 쓴 쌓기나무" })}<figcaption>3+2+2+1+1+1=10개</figcaption></figure>`
    : "";
  return `<div class="b4-src-topview-set"><div class="b4-src-topview-row">${obliqueCubes(visual.map)}<span class="b4-src-arrow" aria-hidden="true">➡</span>${topViewGrid(visual.map)}</div>${example}</div>`;
}

function sourceMatrix(visual) {
  // 원본 20쪽: 2×2 빈칸, 가로 곱은 오른쪽, 세로 곱은 아래.
  const s = 48;
  const cells = [0, 1].flatMap((r) => [0, 1].map((c) => `<rect x="${c * s}" y="${r * s}" width="${s}" height="${s}"/>`)).join("");
  const rows = visual.rowProducts.map((value, r) => `<text x="${2 * s + 12}" y="${r * s + s / 2 + 6}" text-anchor="start">${escapeHtml(value)}</text>`).join("");
  const cols = visual.columnProducts.map((value, c) => `<text x="${c * s + s / 2}" y="${2 * s + 24}" text-anchor="middle">${escapeHtml(value)}</text>`).join("");
  return `<svg class="b4-src-matrix" viewBox="-2 -2 ${2 * s + 46} ${2 * s + 34}" role="img" aria-label="가로와 세로의 곱이 적힌 2×2 빈칸">${cells}${rows}${cols}</svg>`;
}

function cardinalMap(visual) {
  // 원본 42쪽: 2×2 칸 지도, 칸 사이 통로의 십자 화살표, 북·남·서·동, ㉮ 표시.
  const order = ["NW", "NE", "SW", "SE"];
  const cellSize = 62;
  const gap = 30;
  const icon = visual.icon === "house"
    ? '<path class="icon" d="M8 22 21 10l13 12v14H8Z M17 36v-8h8v8"/>'
    : '<path class="icon" d="M8 36V16h11v20 M21 36V8h12v28 M11 20h5M11 25h5M11 30h5M24 12h6M24 17h6M24 22h6M24 27h6"/>';
  const cell = (key, index) => {
    const x = (index % 2) * (cellSize + gap);
    const y = Math.floor(index / 2) * (cellSize + gap);
    const mark = key === visual.targetPosition ? `<text class="mark" x="${x + cellSize - 12}" y="${y + cellSize - 6}">㉮</text>` : "";
    return `<g><rect class="cell" x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"/><g transform="translate(${x + 10} ${y + 6})">${icon}</g>${mark}</g>`;
  };
  const full = cellSize * 2 + gap;
  const c = cellSize + gap / 2;
  const arrows = `<path class="axis" d="M${c} 8V${full - 8}M8 ${c}H${full - 8}"/><path class="axis-head" d="M${c} 3l-4 7h8ZM${c} ${full - 3}l-4-7h8ZM3 ${c}l7-4v8ZM${full - 3} ${c}l-7-4v8Z"/>`;
  const labels = `<text x="${c}" y="-6">북</text><text x="${c}" y="${full + 16}">남</text><text x="-12" y="${c + 5}">서</text><text x="${full + 12}" y="${c + 5}">동</text>`;
  return `<svg class="b4-src-cardinal" viewBox="-24 -22 ${full + 48} ${full + 44}" role="img" aria-label="동서남북 2×2 칸 지도">${order.map(cell).join("")}${arrows}${labels}</svg>`;
}

function sourceTableLogic(visual) {
  if (visual.places) return `<div class="b4-src-logic">${bulletBox(visual.clues)}${cardinalMap(visual)}</div>`;
  // 원본 38·39쪽: 조건 상자 + 빈 표(행 = 고를 것, 열 = 사람).
  const head = `<tr><th></th>${visual.people.map((name) => `<th>${escapeHtml(name)}</th>`).join("")}</tr>`;
  const body = visual.choices.map((choice) => `<tr><th>${escapeHtml(choice)}</th>${visual.people.map(() => "<td></td>").join("")}</tr>`).join("");
  return `<div class="b4-src-logic">${bulletBox(visual.clues)}<table class="b4-src-table">${head}${body}</table></div>`;
}

function sourceCircleLogic(visual) {
  // 원본 37·43·44쪽: 가운데 둥근 식탁, 둘레에 자리(번호·이름 또는 빈 자리).
  const n = visual.seats.length;
  const start = (visual.startAngle ?? -90) * Math.PI / 180;
  const seats = visual.seats.map((seat, index) => {
    const angle = start + index * Math.PI * 2 / n;
    const x = 80 + Math.cos(angle) * 56;
    const y = 80 + Math.sin(angle) * 56;
    return `<g class="seat"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16"/><text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}">${escapeHtml(seat.fixed || seat.label || "")}</text></g>`;
  }).join("");
  return `<div class="b4-src-logic">${bulletBox(visual.clues)}<svg class="b4-src-round" viewBox="0 0 160 160" role="img" aria-label="둥근 식탁 자리"><circle class="table" cx="80" cy="80" r="32"/>${seats}</svg></div>`;
}

function sourceOrderSlots(visual) {
  // 원본 36·37·40·41쪽: 조건 상자, 한 줄 자리 문항은 왼쪽·오른쪽 빈칸 줄.
  const slots = visual.slots
    ? `<div class="b4-src-slots"><span>${escapeHtml(visual.slots.left || "왼쪽")}</span>${Array.from({ length: visual.slots.count }, () => "<i></i>").join("")}<span>${escapeHtml(visual.slots.right || "오른쪽")}</span></div>`
    : "";
  return `<div class="b4-src-logic">${bulletBox(visual.clues)}${slots}</div>`;
}

function sourceCompassGrid(visual) {
  // 원본 36쪽: A~I 3×3 칸과 북·남·동·서 방위표.
  const s = 40;
  const cells = visual.labels.map((label, i) => `<g><rect x="${(i % 3) * s}" y="${Math.floor(i / 3) * s}" width="${s}" height="${s}"/><text x="${(i % 3) * s + s / 2}" y="${Math.floor(i / 3) * s + s / 2 + 5}">${escapeHtml(label)}</text></g>`).join("");
  const cx = 3 * s + 84;
  const cy = 1.5 * s;
  const compass = `<path class="axis" d="M${cx} ${cy - 44}V${cy + 44}M${cx - 44} ${cy}H${cx + 44}"/><path class="axis-head" d="M${cx} ${cy - 48}l-4 7h8Z"/><text x="${cx}" y="${cy - 52}">북</text><text x="${cx}" y="${cy + 62}">남</text><text x="${cx - 56}" y="${cy + 5}">서</text><text x="${cx + 56}" y="${cy + 5}">동</text>`;
  return `<svg class="b4-src-compass" viewBox="-4 -20 ${3 * s + 150} ${3 * s + 44}" role="img" aria-label="A부터 I까지 3×3 칸과 방위표">${cells}${compass}</svg>`;
}

function sourceRowLogic(visual) {
  return "";
}

function sourceBalanceEquations(visual) {
  const side = (objects) => Object.entries(objects).map(([symbol, count]) => `${symbol} ${count}개`).join(" + ");
  return `<div class="b4-clue-panel">${visual.equations.map((equation, index) => `<p><b>${index + 1}</b>${escapeHtml(side(equation.left))} = ${escapeHtml(side(equation.right))}</p>`).join("")}<p><b>물음</b>${escapeHtml(side(visual.target.left))} = ${escapeHtml(Object.keys(visual.target.right)[0])} ?개</p></div>`;
}

// 22~27쪽 비교하기: ○△□◇는 원본처럼 파란 윤곽 도형, 나머지 토큰은 글자.
const SHAPE_ICON = {
  circle: '<circle cx="14" cy="14" r="11.5"/>',
  triangle: '<polygon points="14,3 26,25 2,25"/>',
  square: '<rect x="3" y="3" width="22" height="22"/>',
  diamond: '<polygon points="14,1.5 26.5,14 14,26.5 1.5,14"/>'
};
const SHAPE_NAME = { circle: "동그라미", triangle: "세모", square: "네모", diamond: "마름모" };
function relationToken(token) {
  if (SHAPE_ICON[token]) return `<svg class="b4-src-shape" viewBox="0 0 28 28" role="img" aria-label="${SHAPE_NAME[token]}">${SHAPE_ICON[token]}</svg>`;
  return `<span>${escapeHtml(String(token).replace(/-/g, "−"))}</span>`;
}

function sourceRelations(visual) {
  // 23·24·25쪽: 둥근 상자 안의 관계식 줄. tint는 25쪽처럼 연한 파랑 바탕.
  const rows = (visual.rows || []).map((row) => `<div class="b4-src-rel-row">${row.map(relationToken).join("")}</div>`).join("");
  return `<div class="b4-src-relations${visual.tint ? " tint" : ""}">${rows}</div>`;
}

function sourceNumberCards(visual) {
  // 22쪽: 1~n 숫자 카드(이미 쓴 카드는 빨간 사선) + 「□ + □ = 합」 덧셈식 상자.
  const used = new Set((visual.used || []).map(Number));
  const cards = Array.from({ length: Number(visual.count) }, (_, i) => i + 1)
    .map((n) => `<span class="${used.has(n) ? "used" : ""}">${n}</span>`).join("");
  const sums = (visual.sums || []).map((sum) => `<div class="b4-src-sum-row"><i></i><b>+</b><i></i><b>=</b><span>${escapeHtml(sum)}</span></div>`).join("");
  return `<div class="b4-src-number-cards"><div class="b4-src-cards" aria-label="숫자 카드">${cards}</div><div class="b4-src-sums">${sums}</div></div>`;
}

function sourceClueBox(visual) {
  // 26·27쪽: 조건 글 상자.
  return `<div class="b4-src-logic">${bulletBox(visual.clues)}</div>`;
}

// 5~7쪽 숫자 돌리기와 뒤집기. 변환은 화면 좌표(아래가 +y) 2×2 행렬 [a,b,c,d] = (x,y)→(ax+by, cx+dy).
const SCREEN_TRANSFORM = Object.freeze({
  I: [1, 0, 0, 1], LR: [-1, 0, 0, 1], UD: [1, 0, 0, -1], R180: [-1, 0, 0, -1],
  CW: [0, -1, 1, 0], CCW: [0, 1, -1, 0], T: [0, 1, 1, 0], AT: [0, -1, -1, 0]
});
const cssMatrix = (m) => `matrix(${m[0]},${m[2]},${m[1]},${m[3]},0,0)`;
// 5쪽 보기 ①~⑧: 같은 「1」 선분에 원본 순서대로 변환을 입힌다.
const ONE_OPTION_TRANSFORMS = ["I", "LR", "UD", "R180", "CW", "AT", "CCW", "T"];
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];

function oneFigure(transform = "I", size = 44) {
  const m = SCREEN_TRANSFORM[transform];
  const pt = ([x, y]) => [m[0] * x + m[1] * y, m[2] * x + m[3] * y].map((v) => (v * size * 0.42 + size / 2).toFixed(1));
  const line = (a, b) => { const [x1, y1] = pt(a); const [x2, y2] = pt(b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; };
  return `<svg class="b4-one" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">${line([0, -1], [0, 1])}${line([0, -1], [-0.62, -0.38])}</svg>`;
}

// 아이에게 쓰는 말: 각도 대신 바퀴 수로 말한다.
function turnWords(deg, dir) {
  const way = dir === "cw" ? "시계 방향으로" : "시계 반대 방향으로";
  const amount = deg >= 360 ? "한 바퀴" : deg === 180 ? "반 바퀴" : deg === 270 ? "반의 반 바퀴씩 세 번" : "반의 반 바퀴";
  return `${way} ${amount} 돌리기`;
}

// 돌리기 기호: 12시에서 시작해 돌린 만큼 색칠하고, 끝에 방향 화살표.
function rotateIconInner(deg, dir = "cw", size = 30) {
  const r = size / 2 - 3;
  const c = size / 2;
  const sign = dir === "cw" ? 1 : -1;
  const at = (a) => [c + r * Math.sin((sign * a * Math.PI) / 180), c - r * Math.cos((sign * a * Math.PI) / 180)];
  const full = deg >= 360;
  const [ex, ey] = at(deg % 360 === 0 ? 359.9 : deg);
  const sector = full ? `<circle class="fill" cx="${c}" cy="${c}" r="${r}"/>` : `<path class="fill" d="M${c} ${c}L${c} ${c - r}A${r} ${r} 0 ${deg > 180 ? 1 : 0} ${sign > 0 ? 1 : 0} ${ex.toFixed(1)} ${ey.toFixed(1)}Z"/>`;
  const tip = at(Math.min(deg, 350));
  const back = at(Math.min(deg, 350) - 28);
  // 화살촉: 원을 따라 도는 방향(접선)으로 작은 삼각형.
  const theta = (sign * Math.min(deg, 350) * Math.PI) / 180;
  const d = [sign * Math.cos(theta), sign * Math.sin(theta)];
  const n = [-d[1], d[0]];
  const k = size / 9;
  const head = [[tip[0] + d[0] * k, tip[1] + d[1] * k], [tip[0] - d[0] * k * 0.6 + n[0] * k * 0.8, tip[1] - d[1] * k * 0.6 + n[1] * k * 0.8], [tip[0] - d[0] * k * 0.6 - n[0] * k * 0.8, tip[1] - d[1] * k * 0.6 - n[1] * k * 0.8]];
  const arrow = `<path class="arrow" d="M${back[0].toFixed(1)} ${back[1].toFixed(1)}A${r} ${r} 0 0 ${sign > 0 ? 1 : 0} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}"/><polygon class="arrow-head" points="${head.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}"/>`;
  return `<g class="b4-rot-icon${full ? " full" : ""}"><circle class="ring" cx="${c}" cy="${c}" r="${r}"/>${sector}<path class="cross" d="M${c} ${c - r}V${c + r}M${c - r} ${c}H${c + r}"/>${arrow}</g>`;
}
function rotateIcon(deg, dir = "cw", size = 30) {
  return `<svg class="b4-rot-svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${turnWords(deg, dir)}">${rotateIconInner(deg, dir, size)}</svg>`;
}

// 뒤집기 기호: 점선 축과 축을 감는 화살표.
function flipIcon(axis, size = 40) {
  const c = size / 2;
  return axis === "vertical"
    ? `<svg class="b4-flip-icon" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="오른쪽으로 뒤집기"><path class="axis" d="M${c} 2V${size - 2}"/><ellipse class="turn" cx="${c}" cy="${c}" rx="${c - 5}" ry="4"/><path class="turn-head" d="M${size - 9} ${c - 7}l4 3-4 3"/></svg>`
    : `<svg class="b4-flip-icon" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="아래로 뒤집기"><path class="axis" d="M2 ${c}H${size - 2}"/><ellipse class="turn" cx="${c}" cy="${c}" rx="4" ry="${c - 5}"/><path class="turn-head" d="M${c - 7} ${size - 9}l3 4 3-4"/></svg>`;
}

export function opIcon(op) {
  if (op.type === "rotate") return rotateIcon(op.deg, op.dir);
  return flipIcon(op.axis);
}

function sourceOneFlip(visual) {
  // 5쪽 ①: 원본처럼 「1」 둘레에 물음 하나(뒤집는 점선 축 또는 돌리기 기호)를 한 그림으로 그린다. 오른쪽에 보기 ①~⑧.
  const op = visual.op;
  const W = 180;
  const c = W / 2;
  const segs = [[[0, -1], [0, 1]], [[0, -1], [-0.62, -0.38]]];
  const one = segs.map(([a, b]) => `<line x1="${c + a[0] * 46}" y1="${c + a[1] * 46}" x2="${c + b[0] * 46}" y2="${c + b[1] * 46}"/>`).join("");
  let mark = "";
  const side = op.side;
  if (op.type === "axis") {
    const horizontal = side === "top" || side === "bottom";
    const pos = side === "top" || side === "left" ? 16 : W - 16;
    mark = horizontal
      ? `<g class="b4-flip-axis"><path class="axis" d="M24 ${pos}H${W - 24}"/><ellipse class="turn" cx="${c}" cy="${pos}" rx="6" ry="14"/><path class="turn-head" d="M${c - 4} ${pos + 9}l4 6 4-6"/></g>`
      : `<g class="b4-flip-axis"><path class="axis" d="M${pos} 24V${W - 24}"/><ellipse class="turn" cx="${pos}" cy="${c}" rx="14" ry="6"/><path class="turn-head" d="M${pos + 9} ${c - 4}l6 4-6 4"/></g>`;
  } else {
    const size = 34;
    const at = { top: [c - size / 2, 2], bottom: [c - size / 2, W - size - 2], left: [2, c - size / 2], right: [W - size - 2, c - size / 2] }[side];
    mark = `<g transform="translate(${at[0]} ${at[1]})">${rotateIconInner(op.deg, op.dir, size)}</g>`;
  }
  const figure = `<svg class="b4-one-figure" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="${op.type === "axis" ? "점선을 따라 뒤집기" : turnWords(op.deg, op.dir)}"><g class="b4-one">${one}</g>${mark}</svg>`;
  const options = ONE_OPTION_TRANSFORMS.map((t, i) => `<span><b>${CIRCLED[i]}</b>${oneFigure(t, 52)}</span>`).join("");
  return `<div class="b4-one-flip">${figure}<div class="b4-one-options">${options}</div></div>`;
}

export function digitGlyph(digit, transform = "I") {
  return `<span class="b4-digit"><i style="transform:${cssMatrix(SCREEN_TRANSFORM[transform])}">${escapeHtml(digit)}</i></span>`;
}

function sourceDigitFlip(visual) {
  // 6쪽 ②③: 숫자 → 기호 → (뒤집힌 숫자 또는 빈 상자) … → 빈 상자, 아래에 후보 모양.
  const steps = visual.steps.map((step) => `<span class="b4-step-op">${opIcon(step.op)}</span>${step.show ? digitGlyph(visual.digit, step.show) : '<span class="b4-digit-box"></span>'}`).join("");
  const row = `<div class="b4-digit-row">${digitGlyph(visual.digit)}${steps}</div>`;
  const candidates = visual.candidates ? `<div class="b4-digit-candidates">${visual.candidates.map((t, i) => `<span><b>${CIRCLED[i]}</b>${digitGlyph(visual.digit, t)}</span>`).join("")}</div>` : "";
  const icons = visual.iconOptions ? `<div class="b4-digit-candidates icons">${visual.iconOptions.map((op, i) => `<span><b>${CIRCLED[i]}</b>${rotateIcon(op.deg, op.dir, 34)}</span>`).join("")}</div>` : "";
  return `<div class="b4-digit-flip">${row}${candidates}${icons}</div>`;
}

function sourceUprightBoard(visual) {
  // 7쪽 ④: 2×2 숫자판. 셀마다 숫자와 놓인 방향(변환)을 원본대로.
  const cells = visual.cells.map((cell) => `<span>${digitGlyph(cell.value, cell.t)}</span>`).join("");
  return `<div class="b4-upright-board">${cells}</div>`;
}

// 8쪽 디지털 숫자: 원본처럼 끝이 뾰족한 7개 막대(a 위, b 오른쪽 위, c 오른쪽 아래, d 아래, e 왼쪽 아래, f 왼쪽 위, g 가운데).
const SEVEN_SEGMENTS = Object.freeze({ "0": "abcdef", "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg", "5": "acdfg", "6": "acdefg", "7": "abcf", "8": "abcdefg", "9": "abcdfg" });
function sevenSegDigit(digit, x = 0, h = 60) {
  const w = h * 0.52;
  const t = h * 0.11;
  const g = t * 0.25;
  const hx = (y, x0, x1) => `${x0 + t / 2 + g},${y} ${x0 + t + g},${y - t / 2} ${x1 - t - g},${y - t / 2} ${x1 - t / 2 - g},${y} ${x1 - t - g},${y + t / 2} ${x0 + t + g},${y + t / 2}`;
  const vy = (xc, y0, y1) => `${xc},${y0 + t / 2 + g} ${xc + t / 2},${y0 + t + g} ${xc + t / 2},${y1 - t - g} ${xc},${y1 - t / 2 - g} ${xc - t / 2},${y1 - t - g} ${xc - t / 2},${y0 + t + g}`;
  const L = t / 2;
  const R = w - t / 2;
  const top = t / 2;
  const mid = h / 2;
  const bot = h - t / 2;
  const seg = { a: hx(top, 0, w), g: hx(mid, 0, w), d: hx(bot, 0, w), f: vy(L, top, mid), b: vy(R, top, mid), e: vy(L, mid, bot), c: vy(R, mid, bot) };
  const on = SEVEN_SEGMENTS[String(digit)] || "";
  return `<g transform="translate(${x} 0)">${[...on].map((k) => `<polygon points="${seg[k]}"/>`).join("")}</g>`;
}
export function sevenSegNumber(text, h = 60, label = "") {
  const w = h * 0.52;
  const gap = h * 0.22;
  const digits = [...String(text)];
  const width = digits.length * w + (digits.length - 1) * gap;
  return `<svg class="b4-seven" viewBox="-2 -2 ${(width + 4).toFixed(1)} ${h + 4}" width="${(width + 4).toFixed(1)}" height="${h + 4}" role="img" aria-label="디지털 숫자 ${escapeHtml(label || text)}">${digits.map((d, i) => sevenSegDigit(d, i * (w + gap), h)).join("")}</svg>`;
}

function sourceSevenSeg(visual) {
  // 위: 0~9 디지털 숫자 띠(원본 그대로). 아래: 원래 수 ± [빈칸] = , 또는 숫자 카드.
  const legend = visual.legend ? `<div class="b4-seven-legend">${sevenSegNumber("0123456789", 30, "0부터 9까지")}</div>` : "";
  if (visual.card) return `<div class="b4-seven-set">${legend}<div class="b4-seven-card">${sevenSegNumber(visual.card, 56)}</div></div>`;
  const boxes = Array.from({ length: Number(visual.boxes) || String(visual.number).length }, () => "<i></i>").join("");
  return `<div class="b4-seven-set">${legend}<div class="b4-seven-head"><span>원래 수</span><span>${escapeHtml(visual.label)}</span></div><div class="b4-seven-row">${sevenSegNumber(visual.number, 56)}<b>${visual.op === "-" ? "−" : "+"}</b><span class="b4-seven-boxes">${boxes}</span><b>=</b><span class="b4-seven-result">?</span></div></div>`;
}

// 10~14쪽 색종이 접기·자르기. 원본 그림의 한 장(패널)을 단위 좌표(색종이 한 장 = 1)로 받아 그린다.
// panel = { outline:[다각형], fills:[{poly, tone:"paper"|"white"|"cut"}], back:[dx,dy], lines:[[점,점]] 점선 접는 선,
//           edges:[[점,점]] 접힌 가장자리(실선), grid:n 칸 점선, arrow:{at,dir} 빨간 굽은 화살표(화살촉 = 접히는 쪽이 넘어가는 방향), texts:[[글자,x,y]], marker:[x,y] 동그라미 }
const FOLD_DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], ne: [0.7071, -0.7071], nw: [-0.7071, -0.7071], se: [0.7071, 0.7071], sw: [-0.7071, 0.7071] };

function foldPanelBox(panel) {
  const pts = [...(panel.outline || []), ...(panel.fills || []).flatMap((fill) => fill.poly)];
  const xs = pts.map(([x]) => x), ys = pts.map(([, y]) => y);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

function foldArrow([x, y], dir, r) {
  const [dx, dy] = FOLD_DIR[dir] || FOLD_DIR.right;
  const [nx, ny] = [-dy, dx];
  const start = [x - dx * r, y - dy * r], end = [x + dx * r, y + dy * r], ctrl = [x + nx * r * 1.3, y + ny * r * 1.3];
  const tx = end[0] - ctrl[0], ty = end[1] - ctrl[1], len = Math.hypot(tx, ty) || 1, ux = tx / len, uy = ty / len;
  const head = `${end[0] + ux * 4},${end[1] + uy * 4} ${end[0] - ux * 2 - uy * 3.4},${end[1] - uy * 2 + ux * 3.4} ${end[0] - ux * 2 + uy * 3.4},${end[1] - uy * 2 - ux * 3.4}`;
  return `<path class="fold-curl" d="M${start[0]} ${start[1]}Q${ctrl[0]} ${ctrl[1]} ${end[0]} ${end[1]}"/><polygon class="fold-curl-head" points="${head}"/>`;
}

function foldPanelSvg(panel, unit, ox, oy) {
  const box = foldPanelBox(panel);
  const tx = (x) => +(ox + (x - box.x0) * unit).toFixed(2), ty = (y) => +(oy + (y - box.y0) * unit).toFixed(2);
  const pts = (poly) => poly.map(([x, y]) => `${tx(x)},${ty(y)}`).join(" ");
  const [bx, by] = panel.back || [0, 0];
  const back = panel.back && panel.outline ? `<polygon class="fold-back" points="${panel.outline.map(([x, y]) => `${tx(x) + bx},${ty(y) + by}`).join(" ")}"/>` : "";
  const fills = (panel.fills || []).map((fill) => `<polygon class="fold-${fill.tone || "paper"}" points="${pts(fill.poly)}"/>`).join("");
  const grid = panel.grid ? Array.from({ length: panel.grid - 1 }, (_, i) => {
    const t = box.x0 + (box.x1 - box.x0) * (i + 1) / panel.grid, u = box.y0 + (box.y1 - box.y0) * (i + 1) / panel.grid;
    return `<line class="fold-grid" x1="${tx(t)}" y1="${ty(box.y0)}" x2="${tx(t)}" y2="${ty(box.y1)}"/><line class="fold-grid" x1="${tx(box.x0)}" y1="${ty(u)}" x2="${tx(box.x1)}" y2="${ty(u)}"/>`;
  }).join("") : "";
  const lines = (panel.lines || []).map(([[x1, y1], [x2, y2]]) => `<line class="fold-crease" x1="${tx(x1)}" y1="${ty(y1)}" x2="${tx(x2)}" y2="${ty(y2)}"/>`).join("")
    + (panel.edges || []).map(([[x1, y1], [x2, y2]]) => `<line class="fold-edge" x1="${tx(x1)}" y1="${ty(y1)}" x2="${tx(x2)}" y2="${ty(y2)}"/>`).join("");
  const outline = panel.outline ? `<polygon class="fold-outline" points="${pts(panel.outline)}"/>` : "";
  const size = panel.textSize || Math.max(11, Math.round(unit * 0.16));
  const texts = (panel.texts || []).map(([text, x, y]) => `<text x="${tx(x)}" y="${ty(y)}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${escapeHtml(text)}</text>`).join("");
  const arrow = panel.arrow ? foldArrow([tx(panel.arrow.at[0]), ty(panel.arrow.at[1])], panel.arrow.dir, Math.max(7, unit * 0.09)) : "";
  const marker = panel.marker ? `<circle class="fold-marker" cx="${tx(panel.marker[0])}" cy="${ty(panel.marker[1])}" r="${Math.max(8, unit * 0.13)}"/>` : "";
  return { svg: `<g>${back}${fills}${grid}${lines}${outline}${texts}${arrow}${marker}</g>`, w: (box.x1 - box.x0) * unit, h: (box.y1 - box.y0) * unit };
}

function foldRowSvg(row, unit, label) {
  const pad = 14, gap = row.noArrows ? 46 : 42;
  const sized = row.panels.map((panel) => { const box = foldPanelBox(panel); return { panel, w: (box.x1 - box.x0) * (panel.unit || unit), h: (box.y1 - box.y0) * (panel.unit || unit) }; });
  const height = Math.max(...sized.map((item) => item.h)) + pad * 2;
  let x = pad, body = "";
  sized.forEach((item, index) => {
    if (index) {
      const mid = height / 2;
      body += row.noArrows ? "" : `<path class="fold-step" d="M${x - gap + 10} ${mid}H${x - 12}m-7-6 7 6-7 6"/>`;
    }
    body += foldPanelSvg(item.panel, item.panel.unit || unit, x, (height - item.h) / 2).svg;
    x += item.w + gap;
  });
  const width = x - gap + pad;
  return `<svg class="b4-fold-row" viewBox="0 0 ${width.toFixed(1)} ${height.toFixed(1)}" style="--fold-w:${Math.round(width)}px" role="img" aria-label="${escapeHtml(label)}">${body}</svg>`;
}

// 펼친 색종이 후보 한 장: 종이에서 잘린 모양(holes)을 빼고, 접었던 자리는 점선으로.
// 대칭으로 펼친 조각들이 맞닿는 안쪽 선은 흰 칠로 한 번 더 덮어 지운다(바깥 테두리만 남는다).
function foldUnfoldOption(option, index, unit) {
  const s = unit, pad = 6, id = `b4u-${escapeHtml(option.id || index)}`;
  const shape = (hole) => hole.circle
    ? `<circle cx="${pad + hole.circle[0] * s}" cy="${pad + hole.circle[1] * s}" r="${hole.circle[2] * s}"/>`
    : `<polygon points="${hole.poly.map(([x, y]) => `${pad + x * s},${pad + y * s}`).join(" ")}"/>`;
  const holes = option.holes.map(shape).join("");
  return `<span><svg class="b4-fold-option" viewBox="0 0 ${s + pad * 2} ${s + pad * 2}" aria-hidden="true"><defs><mask id="${id}"><rect x="0" y="0" width="${s + pad * 2}" height="${s + pad * 2}" fill="#fff"/><g fill="#000">${holes}</g></mask><clipPath id="${id}-c"><rect x="${pad}" y="${pad}" width="${s}" height="${s}"/></clipPath></defs><g mask="url(#${id})"><rect class="fold-paper" x="${pad}" y="${pad}" width="${s}" height="${s}"/><line class="fold-crease" x1="${pad + s / 2}" y1="${pad}" x2="${pad + s / 2}" y2="${pad + s}"/><line class="fold-crease" x1="${pad}" y1="${pad + s / 2}" x2="${pad + s}" y2="${pad + s / 2}"/><rect class="fold-outline" x="${pad}" y="${pad}" width="${s}" height="${s}"/></g><g class="fold-hole-edge" clip-path="url(#${id}-c)">${holes}</g><g class="fold-hole-fill" clip-path="url(#${id}-c)">${holes}</g></svg><b>${"①②③④⑤⑥"[index]}</b></span>`;
}

function sourceFoldPanels(visual) {
  const unit = visual.unit || 84;
  const rows = (visual.rows || []).map((row) => foldRowSvg(row, unit, visual.label || "색종이를 접는 그림")).join("");
  const options = visual.options ? `<div class="b4-fold-options">${visual.options.map((option, index) => foldUnfoldOption(option, index, visual.optionUnit || 78)).join("")}</div>` : "";
  return `<div class="b4-fold-panels${visual.wide ? " wide" : ""}">${rows}${options}</div>`;
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
    case "source-number-model": return sourceNumberModel(visual);
    case "source-fold-holes": return sourceFoldHoles(visual);
    case "source-fold-panels": return sourceFoldPanels(visual);
    case "source-cube-box": return sourceCubeBox(visual);
    case "source-hidden-cube": return sourceHiddenCube(visual);
    case "source-cube-topview": return sourceCubeTopView(visual);
    case "source-one-flip": return sourceOneFlip(visual);
    case "source-digit-flip": return sourceDigitFlip(visual);
    case "source-upright-board": return sourceUprightBoard(visual);
    case "source-seven-seg": return sourceSevenSeg(visual);
    case "source-relations": return sourceRelations(visual);
    case "source-number-cards": return sourceNumberCards(visual);
    case "source-clue-box": return sourceClueBox(visual);
    case "source-matrix": return sourceMatrix(visual);
    case "source-table-logic": return sourceTableLogic(visual);
    case "source-circle-logic": return sourceCircleLogic(visual);
    case "source-order-slots": return sourceOrderSlots(visual);
    case "source-compass-grid": return sourceCompassGrid(visual);
    case "source-row-logic": return sourceRowLogic(visual);
    case "source-balance-equations": return sourceBalanceEquations(visual);
    default: return "";
  }
}
