// 2권 문제 그림(문제은행 화면 app.js와 연습 공방 drill.js가 함께 쓴다) — app.js에 있던 그리기를 그대로 옮겨 왔다(2026-10-27).
// 갈라 나누기 · 도형 합 표 · 주고받기 주머니 · 합차 막대 · 저울 식 · 도형 식 · 수열 · 단계별 수 표 · 늘어나는 그림 · 약속 · 스도쿠.

export function equalizeBagsMarkup(visual) {
  const item = visual.item || "사탕";
  const bag = (name, count) => `<div class="candy-bag"><strong>${name}</strong><div class="bag-shape" aria-label="${item} ${count}개">${Array.from({ length: count }, () => "<i></i>").join("")}</div></div>`;
  return `<div class="equalize-bags">${bag(visual.names[0], visual.higher)}<span class="transfer-arrow">몇 개를<br>줄까요?</span>${bag(visual.names[1], visual.lower)}</div>`;
}

export function totalDifferenceBarsMarkup(visual) {
  const gapPercent = Math.max(14, Math.min(34, (visual.difference / visual.total) * 100));
  const hint = visual.showHint ? `<small>전체에서 차이 ${visual.difference}을 먼저 떼어 보세요.</small>` : "";
  return `<div class="total-difference-bars" style="--difference-width:${gapPercent}%" role="img" aria-label="전체 ${visual.total}, 두 수의 차이 ${visual.difference}를 나타낸 막대 그림"><div class="total-difference-given"><span>전체</span><strong>${visual.total}</strong></div><div class="total-difference-row larger"><b>큰 수</b><span class="same-part">같은 부분</span><span class="difference-part">차이 ${visual.difference}</span></div><div class="total-difference-row smaller"><b>작은 수</b><span class="same-part">같은 부분</span></div>${hint}</div>`;
}

export function shapeSumTableMarkup(visual) {
  return `<div class="shape-sum-work"><div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div><div class="shape-sum-target"><div class="shape-sum-grid"><span>◇</span><span>◇</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>㉠</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div></div>`;
}

export function equalPartitionTreeMarkup(visual) {
  const box = (x, y, value = "") => `<rect x="${x - 29}" y="${y - 22}" width="58" height="44" rx="5"/><text x="${x}" y="${y + 7}">${value}</text>`;
  if (visual.parts === 4) {
    const leaves = [65, 155, 245, 335];
    return `<svg class="equal-partition-svg" viewBox="0 0 400 235" role="img" aria-label="${visual.top}을 반으로 가른 뒤 다시 반으로 가르는 수 가르기">
      <path d="M200 51V72M200 72L110 104M200 72L290 104M110 128V150M110 150L65 181M110 150L155 181M290 128V150M290 150L245 181M290 150L335 181"/>
      ${box(200, 30, visual.top)}${box(110, 106, visual.middle)}${box(290, 106, visual.middle)}${leaves.map((x) => box(x, 204)).join("")}
    </svg>`;
  }
  const xs = visual.parts === 2 ? [120, 280] : [70, 200, 330];
  return `<svg class="equal-partition-svg" viewBox="0 0 400 180" role="img" aria-label="${visual.top}을 ${visual.parts}부분으로 똑같이 가르는 수 가르기">
    ${xs.map((x) => `<path d="M200 51V70L${x} 126"/>`).join("")}
    ${box(200, 30, visual.top)}${xs.map((x) => box(x, 148)).join("")}
  </svg>`;
}

export function balanceUnitEquationsMarkup(visual) {
  const side = (items) => `<div class="balance-equation-side">${items.map((item) => `<i>${item}</i>`).join("")}</div>`;
  return `<div class="balance-unit-work"><p>${visual.unit} = ${visual.unitGrams}g</p>${visual.equations.map((row) => `<div>${side(row.left)}<b>=</b>${side(row.right)}</div>`).join("")}</div>`;
}

export function distinctShapeEquationsMarkup(visual) {
  const side = (items) => items.map((item) => `<i>${item}</i>`).join(`<b>+</b>`);
  return `<div class="distinct-shape-work"><div class="shape-number-range">${Array.from({ length: visual.limit }, (_, index) => `<span>${index + 1}</span>`).join("")}</div><div class="shape-equation-rows">${visual.rows.map((row) => `<p>${side(row.left)}<b>=</b>${side(row.right)}</p>`).join("")}</div><strong>${visual.target} = ?</strong></div>`;
}

export function progressiveNumberTableMarkup(visual) {
  return `<div class="progressive-table-work">${visual.stages.map((grid, stageIndex) => `<figure><div style="--table-cols:${grid[0].length}">${grid.flat().map((value) => `<span class="${value === null ? "blank" : ""}">${value ?? ""}</span>`).join("")}</div><figcaption>${stageIndex + 1}단계</figcaption></figure>`).join("<b>→</b>")}</div>`;
}

function matchstickGrowthStage(variant, count) {
  const unit = 28;
  const lines = [];
  if (variant === "square") {
    for (let index = 0; index < count; index += 1) {
      const x = index * unit + 3;
      lines.push(`<line x1="${x}" y1="5" x2="${x + unit}" y2="5"/><line x1="${x}" y1="33" x2="${x + unit}" y2="33"/>`);
    }
    for (let index = 0; index <= count; index += 1) {
      const x = index * unit + 3;
      lines.push(`<line x1="${x}" y1="5" x2="${x}" y2="33"/>`);
    }
  } else {
    for (let index = 0; index < count; index += 1) {
      const x = index * unit + 3;
      lines.push(`<line x1="${x}" y1="18" x2="${x}" y2="42"/><line x1="${x}" y1="42" x2="${x + unit}" y2="42"/><line x1="${x}" y1="18" x2="${x + unit / 2}" y2="3"/><line x1="${x + unit / 2}" y1="3" x2="${x + unit}" y2="18"/>`);
    }
    const end = count * unit + 3;
    lines.push(`<line x1="${end}" y1="18" x2="${end}" y2="42"/>`);
  }
  return `<svg class="growth-matchstick" viewBox="0 0 ${count * unit + 8} 47">${lines.join("")}</svg>`;
}

function triangleStoneStage(stage) {
  const side = stage + 2;
  const dots = [];
  for (let row = 0; row < side; row += 1) {
    dots.push(`<span>` + Array.from({ length: row + 1 }, (_, column) => `<i class="${row === side - 1 || column === 0 || column === row ? "black" : "white"}"></i>`).join("") + `</span>`);
  }
  return `<div class="growth-triangle-stones">${dots.join("")}</div>`;
}

function squareStoneStage(stage) {
  const side = stage + 1;
  return `<div class="growth-square-stones" style="--stone-side:${side}">${Array.from({ length: side * side }, (_, index) => {
    const row = Math.floor(index / side);
    const column = index % side;
    return `<i class="${row === 0 || row === side - 1 || column === 0 || column === side - 1 ? "black" : "white"}"></i>`;
  }).join("")}</div>`;
}

function staircaseStage(stage) {
  return `<div class="growth-staircase">${Array.from({ length: stage }, (_, row) => `<span>${Array.from({ length: stage - row }, () => "<i></i>").join("")}</span>`).join("")}</div>`;
}

function foldCutStage(stage, punch = false) {
  const pieces = 2 ** stage;
  return `<div class="growth-fold-paper" style="--fold-pieces:${pieces};--fold-width:${Math.max(30, 82 - stage * 14)}px">${Array.from({ length: Math.min(pieces, 8) }, () => `<i>${punch ? "•" : ""}</i>`).join("")}</div>`;
}

function coloredTriangleStage(stage) {
  return `<div class="growth-colored-triangle">${Array.from({ length: stage }, (_, row) => `<span>${Array.from({ length: row + 1 }, (_, column) => `${column ? "<i class=\"white\">▽</i>" : ""}<i>▲</i>`).join("")}</span>`).join("")}</div>`;
}

function nestedCircleStage(stage) {
  return `<div class="growth-nested-circles">${Array.from({ length: stage }, (_, row) => `<span>${Array.from({ length: row + 1 }, () => "<i></i>").join("")}</span>`).join("")}</div>`;
}

function segmentGrowthStage(stage) {
  const lines = [];
  for (let row = 0; row < stage; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      const x = 50 + (column - row / 2) * 20;
      const y = 8 + row * 17;
      const direction = (row + column) % 3;
      const dx = direction === 0 ? 0 : direction === 1 ? -8 : 8;
      lines.push(`<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + 14}"/>`);
    }
  }
  return `<svg class="growth-segments" viewBox="0 0 100 ${stage * 17 + 12}">${lines.join("")}</svg>`;
}

export function book2GrowthMarkup(visual) {
  const stageMarkup = (stage) => {
    if (visual.subtype === "matchstick") return matchstickGrowthStage(visual.variant, stage);
    if (visual.subtype === "triangle-stones") return triangleStoneStage(stage);
    if (visual.subtype === "square-stones") return squareStoneStage(stage);
    if (visual.subtype === "staircase") return staircaseStage(stage);
    if (visual.subtype === "fold-cut") return foldCutStage(stage, false);
    if (visual.subtype === "colored-triangle") return coloredTriangleStage(stage);
    if (visual.subtype === "nested-circles") return nestedCircleStage(stage);
    if (visual.subtype === "segments") return segmentGrowthStage(stage);
    if (visual.subtype === "fold-punch") return foldCutStage(stage, stage === Math.max(...visual.stages));
    return "";
  };
  return `<div class="book2-growth-work">${visual.stages.map((stage) => `<figure>${stageMarkup(stage)}<figcaption>${stage + (visual.subtype.startsWith("fold-") ? "번 접음" : "번째")}</figcaption></figure>`).join("<b>→</b>")}<strong>…<br>${visual.target}${visual.subtype.startsWith("fold-") ? "번" : "번째"}</strong></div>`;
}

export function centerNumberRuleMarkup(visual) {
  return `<div class="center-rule-work">${visual.items.map((item, index) => `<figure><div class="center-rule-cluster"><span class="top">${item.outer[0]}</span><span class="right">${item.outer[1]}</span><span class="bottom">${item.outer[2]}</span><span class="left">${item.outer[3]}</span><strong>${item.hidden ? "㉠" : item.center}</strong></div><figcaption>${index + 1}</figcaption></figure>`).join("")}</div>`;
}

export function numberRuleGridMarkup(visual) {
  return `<div class="number-rule-grid">${visual.rows.flat().map((value) => `<span class="${value === null ? "blank" : ""}">${value ?? "㉠"}</span>`).join("")}</div>`;
}

export function twoDigitComposeRuleMarkup(visual) {
  const digit = (number, index, itemIndex, field) => {
    const hidden = visual.hidden.item === itemIndex && visual.hidden.field === field && visual.hidden.digit === index;
    return `<i class="${hidden ? "blank" : ""}">${hidden ? "㉠" : String(number).padStart(2, "0")[index]}</i>`;
  };
  return `<div class="compose-rule-work">${visual.items.map((item, itemIndex) => {
    const resultHidden = visual.hidden.item === itemIndex && visual.hidden.field === "result";
    return `<figure><div class="compose-pair"><p>${digit(item.first, 0, itemIndex, "first")}${digit(item.first, 1, itemIndex, "first")}</p><b>${visual.operation === "add" ? "+" : "−"}</b><p>${digit(item.second, 0, itemIndex, "second")}${digit(item.second, 1, itemIndex, "second")}</p><strong>${resultHidden ? "㉠" : item.result}</strong></div><figcaption>${itemIndex + 1}</figcaption></figure>`;
  }).join("")}</div>`;
}

export function sudokuGridMarkup(visual) {
  const { size, grid, regions, target } = visual;
  const cellStyle = (row, column) => {
    if (!regions) return "";
    const region = regions[row][column];
    const top = row === 0 || regions[row - 1][column] !== region ? 3 : 1;
    const right = column === size - 1 || regions[row][column + 1] !== region ? 3 : 1;
    const bottom = row === size - 1 || regions[row + 1][column] !== region ? 3 : 1;
    const left = column === 0 || regions[row][column - 1] !== region ? 3 : 1;
    return `border-width:${top}px ${right}px ${bottom}px ${left}px`;
  };
  return `<div class="sudoku-work"><div class="sudoku-grid" style="--sudoku-size:${size}">${grid.flatMap((row, rowIndex) => row.map((value, column) => {
    const marked = target[0] === rowIndex && target[1] === column;
    return `<span class="${marked ? "target" : value ? "given" : "empty"}" style="${cellStyle(rowIndex, column)}">${marked ? "㉠" : value || ""}</span>`;
  })).join("")}</div><p>1부터 ${size}까지 한 번씩</p></div>`;
}

export function numberSequencesMarkup(visual) {
  return `<div class="number-sequences">${visual.rows.map((row, index) => `<div><b>(${index + 1})</b>${row.items.map((value) => `<span${value === null ? ' class="blank"' : ""}>${value === null ? "" : value}</span>`).join("")}</div>`).join("")}</div>`;
}

// 모양·색·개수 반복마디(repeating-symbol-sequence) — 한 묶음 그리기는 연습 공방의 보기 단추도 쓴다
export const SYMBOL_GLYPHS = Object.freeze({ circle: ["○", "●"], triangle: ["△", "▲"], square: ["□", "■"], diamond: ["◇", "◆"], star: ["☆", "★"] });
export const symbolGroupMarkup = (item) => `<span class="symbol-pattern-group">${Array.from({ length: item.count }, () => `<i>${SYMBOL_GLYPHS[item.shape][item.filled ? 1 : 0]}</i>`).join("")}</span>`;
export function symbolPatternSequenceMarkup(visual) {
  return `<div class="symbol-pattern-work">${visual.items.map(symbolGroupMarkup).join("")}<b>→</b><span class="symbol-pattern-target">?</span></div>`;
}
