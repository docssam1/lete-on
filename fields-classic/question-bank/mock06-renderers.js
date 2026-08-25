const SHAPE_GLYPHS = Object.freeze({
  circle: "●",
  triangle: "▲",
  star: "★",
  square: "■",
  diamond: "◆"
});
const SHAPE_LABELS = Object.freeze({ circle: "동그라미", triangle: "세모", star: "별", square: "네모", diamond: "마름모" });

function shapeToken(symbol, extra = "") {
  return `<span class="m6-shape ${symbol} ${extra}" aria-label="${SHAPE_LABELS[symbol] || symbol}">${SHAPE_GLYPHS[symbol] || symbol}</span>`;
}

function partitionMarkup(visual) {
  const groupByCell = new Map();
  (visual.groups || []).forEach((group, groupIndex) => group.forEach((cell) => groupByCell.set(cell, groupIndex)));
  const borderStyle = (index) => {
    if (!visual.groups) return "";
    const row = Math.floor(index / 4);
    const column = index % 4;
    const group = groupByCell.get(index);
    const side = (dr, dc) => {
      const nextRow = row + dr;
      const nextColumn = column + dc;
      return nextRow < 0 || nextRow >= 4 || nextColumn < 0 || nextColumn >= 4 || groupByCell.get(nextRow * 4 + nextColumn) !== group ? 3 : 1;
    };
    return `border-width:${side(-1, 0)}px ${side(0, 1)}px ${side(1, 0)}px ${side(0, -1)}px`;
  };
  return `<div class="m6-partition-grid ${visual.groups ? "answer" : ""}">${visual.values.map((value, index) => `<span style="${borderStyle(index)}">${value}</span>`).join("")}</div>`;
}

function magicSquareMarkup(square) {
  return `<div class="m6-magic-grid">${square.shown.map((value, index) => `<span class="${index === square.target ? "target" : value == null ? "blank" : "given"}">${index === square.target ? "?" : value ?? ""}</span>`).join("")}</div>`;
}

function twoMagicSumsMarkup(visual) {
  return `<div class="m6-two-magic"><figure>${magicSquareMarkup(visual.squares[0])}<figcaption>왼쪽</figcaption></figure><b>+</b><figure>${magicSquareMarkup(visual.squares[1])}<figcaption>오른쪽</figcaption></figure></div>`;
}

function zeroOneShapesMarkup(visual) {
  const token = (value) => SHAPE_GLYPHS[value] ? shapeToken(value) : `<b>${value}</b>`;
  return `<div class="m6-zero-one"><div class="m6-domain-cards">${Array.from({ length: visual.domainMax + 1 }, (_, value) => `<span>${value}</span>`).join("")}</div><div class="m6-shape-equations">${visual.equations.map((row) => `<p>${row.map(token).join("")}</p>`).join("")}</div>${visual.hint ? `<small>${visual.hint}</small>` : ""}</div>`;
}

function shapeValueMatrixMarkup(visual) {
  const cells = [];
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) cells.push(`<span>${shapeToken(visual.layout[row][column])}</span>`);
    cells.push(`<strong>${visual.rowSums[row]}</strong>`);
  }
  visual.columnSums.forEach((sum) => cells.push(`<strong>${sum}</strong>`));
  cells.push("<i></i>");
  return `<div class="m6-shape-matrix"><div class="m6-matrix-grid">${cells.join("")}</div><div class="m6-matrix-legend">${visual.symbols.map((symbol) => `<p>${shapeToken(symbol)}<b>=</b><i></i></p>`).join("")}</div></div>`;
}

function repeatedTwoDigitMarkup(visual) {
  const relation = `${Array.from({ length: visual.relationCount }, () => shapeToken(visual.tens)).join("<b>+</b>")}<b>=</b>${shapeToken(visual.ones)}`;
  const addend = `${shapeToken(visual.tens)}${shapeToken(visual.ones)}`;
  return `<div class="m6-repeated-add"><p class="m6-symbol-relation">${relation}</p><div class="m6-vertical-sum">${Array.from({ length: visual.addendCount }, (_, index) => `<p class="${index === visual.addendCount - 1 ? "last" : ""}">${index === visual.addendCount - 1 ? "<b>+</b>" : ""}${addend}</p>`).join("")}<strong>${shapeToken(visual.hundreds)}${shapeToken(visual.tens)}</strong></div></div>`;
}

function photoLineMarkup(visual) {
  return `<div class="m6-photo-line"><div class="m6-people-slots">${Array.from({ length: 5 }, (_, index) => `<figure><span class="m6-person"><i></i></span><figcaption>${index + 1}</figcaption></figure>`).join("")}</div><div class="m6-name-bank">${visual.names.map((name) => `<span>${name}</span>`).join("")}</div><ul>${visual.clues.map((clue) => `<li>${clue}</li>`).join("")}</ul></div>`;
}

function foodLogicMarkup(visual) {
  return `<div class="m6-food-logic"><div class="m6-food-banks"><p>${visual.people.map((person) => `<span>${person}</span>`).join("")}</p><p>${visual.foods.map((food) => `<span>${food}</span>`).join("")}</p></div><ul>${visual.clues.map((clue) => `<li>${clue}</li>`).join("")}</ul><div class="m6-food-answer-grid">${visual.people.map((person) => `<span>${person}</span><i></i>`).join("")}</div></div>`;
}

function relativeNumberGridMarkup(visual) {
  return `<div class="m6-relative-grid"><ol>${visual.clues.map((clue) => `<li>${clue}</li>`).join("")}</ol><div>${Array.from({ length: 9 }, () => "<span></span>").join("")}</div></div>`;
}

function foldLineUnfoldMarkup(visual) {
  const p = Math.round(visual.position * 100);
  return `<div class="m6-fold-line-sequence"><svg viewBox="0 0 126 126" aria-label="위로 접기"><rect x="12" y="12" width="102" height="102"/><path class="dash" d="M12 63H114"/><path class="arrow" d="M63 99V38m0 0-11 13m11-13 11 13"/></svg><b>→</b><svg viewBox="0 0 146 92" aria-label="왼쪽으로 접기"><rect x="8" y="8" width="130" height="76"/><path class="dash" d="M73 8V84"/><path class="arrow" d="M115 46H34m0 0 13-11M34 46l13 11"/></svg><b>→</b><svg viewBox="0 0 100 100" aria-label="대각선으로 접기"><rect x="8" y="8" width="84" height="84"/><path class="dash" d="M8 8L92 92"/><path class="arrow" d="M32 30l39 39m0 0-17-3m17 3-3-17"/></svg><b>→</b><svg viewBox="0 0 100 100" aria-label="접힌 삼각형의 선"><path d="M10 10V90H90Z"/><path class="cut" d="M10 ${p}H${p}V90"/></svg></div>`;
}

function foldLineAnswerMarkup(visual) {
  const lines = [
    ...visual.vertical.map((value) => `<line x1="${value * 100}" y1="0" x2="${value * 100}" y2="100"/>`),
    ...visual.horizontal.map((value) => `<line x1="0" y1="${value * 100}" x2="100" y2="${value * 100}"/>`)
  ].join("");
  return `<svg class="m6-fold-line-answer" viewBox="-4 -4 108 108" aria-label="색종이를 펼친 선"><rect x="0" y="0" width="100" height="100"/>${lines}</svg>`;
}

function directionalSumsMarkup(visual) {
  const active = new Map(visual.activeCells.map((cell, index) => [cell.join(","), index]));
  const cells = ["<i></i>"];
  visual.columnSums.forEach((sum) => cells.push(`<strong class="down">${sum}</strong>`));
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const index = active.get(`${row},${column}`);
      if (index == null) cells.push("<span class=\"off\"></span>");
      else cells.push(`<span>${visual.given?.index === index ? visual.given.value : ""}</span>`);
    }
    cells.push(`<strong class="left">${visual.rowSums[row]}</strong>`);
  }
  return `<div class="m6-directional-sums">${cells.join("")}</div>`;
}

function twoClassTotalMarkup(visual) {
  const left = (visual.total - visual.difference) / 2 + visual.difference;
  const right = visual.total - left;
  const unit = 100 / visual.total;
  return `<div class="m6-two-class-total"><div class="m6-class-bars"><p style="--bar:${left * unit}%"><b>1반</b><span>${visual.showGuide ? `${left}명` : "?명"}</span></p><p style="--bar:${right * unit}%"><b>2반</b><span>?명</span></p></div><footer><span>두 반 모두 ${visual.total}명</span><span>차이 ${visual.difference}명</span></footer></div>`;
}

function numberBallTargetsMarkup(visual) {
  const equation = (row, blank) => `<p>${blank ? "<i></i>" : `<span>${row.left}</span>`}<b>${blank ? "?" : row.operator}</b>${blank ? "<i></i>" : `<span>${row.right}</span>`}<em>=</em><strong>${row.target}</strong></p>`;
  return `<div class="m6-number-ball-targets"><div class="m6-number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="m6-target-example"><small>보기</small>${equation(visual.example, false)}</div><div class="m6-target-rows">${visual.rows.map((row) => equation(row, true)).join("")}</div></div>`;
}

function diagonalDifferenceMarkup(visual) {
  const item = (entry, answer = false) => `<figure><div><span>${entry.corners[0]}</span><span>${entry.corners[1]}</span><span>${entry.corners[2]}</span><span>${entry.corners[3]}</span><strong>${answer ? "?" : entry.result}</strong></div></figure>`;
  return `<div class="m6-diagonal-difference">${visual.examples.map((entry) => item(entry)).join("")}${item(visual.target, true)}</div>`;
}

function bookChainMarkup(visual) {
  return `<div class="m6-book-chain"><div class="m6-book-people">${["A", "B", "C"].map((name) => `<span><i></i><b>${name}</b></span>`).join("")}</div><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
}

function colorGrid(cells, color, label = "") {
  const colored = new Set(cells);
  return `<figure><div class="m6-color-grid ${color}">${Array.from({ length: 9 }, (_, index) => `<span class="${colored.has(index) ? "filled" : ""}"></span>`).join("")}</div>${label ? `<figcaption>${label}</figcaption>` : ""}</figure>`;
}

function gridColorSequenceMarkup(visual) {
  return `<div class="m6-grid-color-sequence">${visual.panels.map((cells, index) => colorGrid(index === visual.missing ? [] : cells, visual.color, index + 1)).join("")}</div>`;
}

export function mock06Markup(visual) {
  if (visual.kind === "mock6-congruent-equal-sum") return partitionMarkup(visual);
  if (visual.kind === "mock6-two-magic-sums") return twoMagicSumsMarkup(visual);
  if (visual.kind === "mock6-zero-one-shapes") return zeroOneShapesMarkup(visual);
  if (visual.kind === "mock6-shape-value-matrix") return shapeValueMatrixMarkup(visual);
  if (visual.kind === "mock6-repeated-two-digit-addition") return repeatedTwoDigitMarkup(visual);
  if (visual.kind === "mock6-photo-line") return photoLineMarkup(visual);
  if (visual.kind === "mock6-food-logic") return foodLogicMarkup(visual);
  if (visual.kind === "mock6-relative-number-grid") return relativeNumberGridMarkup(visual);
  if (visual.kind === "mock6-fold-line-unfold") return foldLineUnfoldMarkup(visual);
  if (visual.kind === "mock6-fold-line-unfold-answer") return foldLineAnswerMarkup(visual);
  if (visual.kind === "mock6-directional-sums") return directionalSumsMarkup(visual);
  if (visual.kind === "mock6-two-class-total") return twoClassTotalMarkup(visual);
  if (visual.kind === "mock6-number-ball-targets") return numberBallTargetsMarkup(visual);
  if (visual.kind === "mock6-diagonal-difference") return diagonalDifferenceMarkup(visual);
  if (visual.kind === "mock6-book-chain") return bookChainMarkup(visual);
  if (visual.kind === "mock6-grid-color-sequence") return gridColorSequenceMarkup(visual);
  if (visual.kind === "mock6-grid-color-answer") return `<div class="m6-grid-color-answer">${colorGrid(visual.cells, visual.color)}</div>`;
  return "";
}
