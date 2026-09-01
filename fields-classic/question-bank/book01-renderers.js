// 더클래식 1과정 1권 전용 시각 자료. 화면과 인쇄에서 같은 구조를 사용한다.

const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

function patternGrid(cells, size, label = "") {
  const selected = new Set(cells.map(([row, column]) => `${row}:${column}`));
  const squares = Array.from({ length: size * size }, (_, index) => {
    const row = Math.floor(index / size);
    const column = index % size;
    const marked = selected.has(`${row}:${column}`);
    return `<i class="${marked ? "filled" : ""}"></i>`;
  }).join("");
  return `<div class="b1-pattern"><div class="b1-cell-grid" style="--size:${size}">${squares}</div>${label ? `<b>${esc(label)}</b>` : ""}</div>`;
}

function shapeTransformMarkup(visual) {
  const operationLabels = {
    "mirror-left-right": "좌우 뒤집기", "mirror-top-bottom": "위아래 뒤집기",
    "rotate-left": "왼쪽 1/4바퀴", "rotate-right": "오른쪽 1/4바퀴", "rotate-half": "반 바퀴"
  };
  const options = visual.options.map((option) => patternGrid(option.cells, visual.size, `${option.option}번`)).join("");
  return `<div class="b1-transform"><div class="b1-transform-source">${patternGrid(visual.source, visual.size, "처음 모양")}<span>→</span><strong>${visual.operations.map((operation) => operationLabels[operation]).join(" → ")}</strong></div><div class="b1-option-row">${options}</div></div>`;
}

function partitionDrawMarkup(visual) {
  if (visual.mode === "rotational") return rotationalPartitionMarkup(visual);
  const symbols = visual.symbols || Array(visual.rows * visual.columns).fill("");
  const guideCuts = new Set(visual.guideCuts || []);
  const cells = symbols.map((symbol, index) => {
    const row = Math.floor(index / visual.columns);
    const column = index % visual.columns;
    const label = visual.labels?.[index];
    const classes = [];
    if (label) {
      if (visual.showPieceFills !== false) classes.push(`piece-${label.toLowerCase()}`);
      if (column < visual.columns - 1 && visual.labels[index + 1] !== label) {
        classes.push(guideCuts.has(`${index}:right`) ? "guide-right" : visual.sourceGuide ? "completion-right" : "cut-right");
      }
      if (row < visual.rows - 1 && visual.labels[index + visual.columns] !== label) {
        classes.push(guideCuts.has(`${index}:bottom`) ? "guide-bottom" : visual.sourceGuide ? "completion-bottom" : "cut-bottom");
      }
    }
    if (!visual.labels && guideCuts.has(`${index}:right`)) classes.push("guide-right");
    if (!visual.labels && guideCuts.has(`${index}:bottom`)) classes.push("guide-bottom");
    return `<i class="${classes.join(" ")}">${symbol ? `<b>${esc(symbol)}</b>` : ""}</i>`;
  }).join("");
  return `<div class="b1-partition-draw"><div class="b1-partition-grid${visual.pivot ? " has-pivot" : ""}" style="--rows:${visual.rows};--columns:${visual.columns}">${cells}</div><strong>${visual.labels ? "완성된 분할선" : "주어진 선을 이어 나누세요"}</strong></div>`;
}

function rotationalPartitionMarkup(visual) {
  const cell = visual.board === "cross" ? 30 : 40;
  const padding = 12;
  const width = visual.columns * cell + padding * 2;
  const height = visual.rows * cell + padding * 2;
  const active = (row, column) => visual.board !== "cross" || row === 2 || row === 3 || column === 2 || column === 3;
  const cells = Array.from({ length: visual.rows * visual.columns }, (_, index) => {
    const row = Math.floor(index / visual.columns);
    const column = index % visual.columns;
    if (!active(row, column)) return "";
    return `<rect x="${padding + column * cell}" y="${padding + row * cell}" width="${cell}" height="${cell}" class="b1-rotation-cell"/>`;
  }).join("");
  const border = visual.board === "cross"
    ? `M${padding + 2 * cell} ${padding}H${padding + 4 * cell}V${padding + 2 * cell}H${padding + 6 * cell}V${padding + 4 * cell}H${padding + 4 * cell}V${padding + 6 * cell}H${padding + 2 * cell}V${padding + 4 * cell}H${padding}V${padding + 2 * cell}H${padding + 2 * cell}Z`
    : `M${padding} ${padding}H${padding + 4 * cell}V${padding + 4 * cell}H${padding}Z`;
  const paths = visual.completedPaths || [visual.guidePath];
  const colors = ["given", "answer-blue", "answer-green", "answer-orange"];
  const lineMarkup = paths.map((path, index) => {
    const points = path.map(([x, y]) => `${padding + x * cell},${padding + y * cell}`).join(" ");
    return `<polyline points="${points}" class="b1-rotation-line ${colors[index] || "answer-blue"}"/>`;
  }).join("");
  const centerX = padding + visual.columns * cell / 2;
  const centerY = padding + visual.rows * cell / 2;
  return `<div class="b1-partition-draw b1-rotational-partition"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${visual.pieceCount}조각 회전 분할선">${cells}<path d="${border}" class="b1-rotation-border"/>${lineMarkup}<circle cx="${centerX}" cy="${centerY}" r="7" class="b1-rotation-pivot"/></svg><strong>${visual.completedPaths ? "완성된 분할선" : "빨간 선을 돌려 이어 그리세요"}</strong></div>`;
}

const SEGMENT_PATHS = Object.freeze({
  a: "M12 5H38L33 10H17Z", b: "M40 7V35L35 30V12Z", c: "M40 39V67L35 62V44Z",
  d: "M12 69H38L33 64H17Z", e: "M5 39V67L10 62V44Z", f: "M5 7V35L10 30V12Z", g: "M12 37H38L33 32H17Z"
});
const DIGIT_SEGMENTS = Object.freeze({ 0:"abcdef",1:"bc",2:"abdeg",3:"abcdg",4:"bcfg",5:"acdfg",6:"acdefg",7:"abc",8:"abcdefg",9:"abcdfg" });

function digitalDigit(value) {
  const segments = DIGIT_SEGMENTS[value] || "";
  return `<svg class="b1-digit" viewBox="0 0 45 74" role="img" aria-label="디지털 숫자 ${value}">${Object.entries(SEGMENT_PATHS).map(([name, path]) => `<path class="${segments.includes(name) ? "on" : ""}" d="${path}"/>`).join("")}</svg>`;
}

const operationShort = (operation) => ({
  "mirror-left-right": "좌우 뒤집기", "mirror-top-bottom": "위아래 뒤집기", "rotate-half": "반 바퀴"
}[operation] || operation);

function digitalTransformMarkup(visual) {
  const options = visual.options.map((option) => `<span><b>${option.option}</b>${option.value}</span>`).join("");
  return `<div class="b1-digital-transform"><div>${visual.digits.map(digitalDigit).join("")}<i>→</i><strong>${operationShort(visual.operation)}</strong></div><div class="b1-number-options">${options}</div></div>`;
}

function digitalOrientationBoardMarkup(visual) {
  const operationLabels = {
    "rotate-right-quarter": "오른쪽으로 반의 반 바퀴",
    "rotate-left-quarter": "왼쪽으로 반의 반 바퀴",
    "rotate-half": "반 바퀴"
  };
  const cells = visual.cells.map((cell) => `<span style="--turn:${cell.orientation * 90}deg">${digitalDigit(cell.digit)}</span>`).join("");
  return `<div class="b1-digital-orientation-board"><div class="b1-digital-board-grid">${cells}</div><strong>숫자판 전체를 ${operationLabels[visual.operation]}</strong><b>똑바로 놓이는 수의 합 = ?</b></div>`;
}

const blankNumber = (digits, className = "") => `<span class="b1-number-blank ${className}" style="--digits:${digits}">${Array.from({ length: digits }, () => "<i></i>").join("")}</span>`;

function digitalRelatedAdditionMarkup(visual) {
  const source = `<span class="b1-digital-source">${visual.source.map(digitalDigit).join("")}</span>`;
  if (visual.layout === "horizontal") {
    return `<div class="b1-digital-related-addition horizontal"><div>${source}<b>+</b>${blankNumber(2, "transformed")}<b>=</b>${blankNumber(3, "sum")}</div><small>원래 수 + ${operationShort(visual.operation)} 수</small></div>`;
  }
  return `<div class="b1-digital-related-addition vertical"><div class="b1-vertical-calculation"><span>${source}<small>원래 수</small></span><span class="second"><b>+</b>${blankNumber(2, "transformed")}<small>돌린 수</small></span><span class="line"></span><span>${blankNumber(3, "sum")}</span></div><small>원래 수와 반 바퀴 돌린 수의 세로셈</small></div>`;
}

const circlePoints = (count, cx, cy, radius) => Array.from({ length: count }, (_, index) => {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
});

function circleMagicMarkup(visual) {
  const count = visual.shown.length;
  const half = count / 2;
  const points = circlePoints(count, 160, 125, 92);
  const lines = Array.from({ length: half }, (_, index) => [index, index + half])
    .map(([a,b]) => `<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}"/>`).join("");
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="20"/><text x="${x}" y="${y+1}">${visual.shown[index] == null ? "" : visual.shown[index]}</text>`).join("");
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  const lineSum = visual.lineSum == null ? "□" : visual.lineSum;
  return `${cards}<svg class="b1-svg b1-circle-magic" viewBox="0 0 320 255" role="img" aria-label="가운데를 지나는 ${half}줄의 합이 같은 원형진">${lines}${nodes}<circle class="center" cx="160" cy="125" r="22"/><text x="160" y="126">${visual.center == null ? "" : visual.center}</text><text class="sum" x="160" y="247">한 줄의 합 ${lineSum}</text></svg>`;
}

function fiveCardMagicMarkup(visual) {
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  const cells = visual.shown.map((value, index) => `<span class="p${index}">${value == null ? "" : value}</span>`).join("");
  return `${cards}<div class="b1-five-card-magic ${visual.layout}">${cells}<strong>한 줄의 합 ${visual.lineSum == null ? "□" : visual.lineSum}</strong></div>`;
}

function sumGridMarkup(visual) {
  const mask = visual.mask || visual.shown.map(() => 1);
  const cells = visual.shown.map((value, index) => `<span class="${mask[index] ? value == null ? "blank" : "" : "blocked"}">${mask[index] && value != null ? value : ""}</span>`).join("");
  const rows = visual.rowSums.map((sum) => `<b>${sum}</b>`).join("");
  const columns = visual.columnSums.map((sum) => `<b>${sum}</b>`).join("");
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  const range = visual.rangeLabel ? `<div class="b1-number-range">${esc(visual.rangeLabel)}</div>` : "";
  return `${cards}${range}<div class="b1-sum-grid-wrap" style="--columns:${visual.columns};--rows:${visual.rows}"><div class="b1-sum-grid">${cells}</div><div class="b1-row-sums">${rows}</div><div class="b1-column-sums">${columns}</div><em>합</em></div>`;
}

function ringLinesMarkup(visual) {
  const points = circlePoints(8, 160, 125, 94);
  const lines = [[0,4],[1,5],[2,6],[3,7]].map(([a,b]) => `<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}"/>`).join("");
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="19"/><text x="${x}" y="${y+1}">${visual.shown[index] == null ? "㉠" : visual.shown[index]}</text>`).join("");
  return `<svg class="b1-svg b1-ring-lines" viewBox="0 0 320 255" role="img" aria-label="마주 보는 수의 합이 같은 원">${lines}<circle cx="160" cy="125" r="94"/>${nodes}<text class="sum" x="160" y="247">두 수의 합 ${visual.lineSum}</text></svg>`;
}

function conditionCardMarkup(visual) {
  return `<div class="b1-condition-card"><strong>${esc(visual.title)}</strong><ol>${visual.clues.map((clue) => `<li>${esc(clue)}</li>`).join("")}</ol></div>`;
}

function numberSequenceMarkup(visual) {
  return `<div class="b1-number-sequence">${visual.shown.map((value, index) => `<span class="${value == null ? "blank" : ""}">${value == null ? "" : value}</span>${index < visual.shown.length - 1 ? "<i>→</i>" : ""}`).join("")}</div>`;
}

function logicCluesMarkup(visual) {
  const header = visual.items.length ? `<div class="b1-logic-tags">${visual.names.map((name) => `<span>${esc(name)}</span>`).join("")}${visual.items.map((item) => `<i>${esc(item)}</i>`).join("")}</div>` : "";
  return `<div class="b1-logic-clues">${header}<ol>${visual.clues.map((clue) => `<li>${esc(clue)}</li>`).join("")}</ol><strong>${esc(visual.question)}</strong></div>`;
}

export function book01Markup(visual) {
  if (!visual || visual.kind !== "book1") return "";
  if (visual.subtype === "shape-transform") return shapeTransformMarkup(visual);
  if (visual.subtype === "partition-draw") return partitionDrawMarkup(visual);
  if (visual.subtype === "digital-transform") return digitalTransformMarkup(visual);
  if (visual.subtype === "digital-orientation-board") return digitalOrientationBoardMarkup(visual);
  if (visual.subtype === "digital-related-addition") return digitalRelatedAdditionMarkup(visual);
  if (visual.subtype === "circle-magic") return circleMagicMarkup(visual);
  if (visual.subtype === "five-card-magic") return fiveCardMagicMarkup(visual);
  if (visual.subtype === "sum-grid") return sumGridMarkup(visual);
  if (visual.subtype === "ring-lines") return ringLinesMarkup(visual);
  if (visual.subtype === "condition-card") return conditionCardMarkup(visual);
  if (visual.subtype === "number-sequence") return numberSequenceMarkup(visual);
  if (visual.subtype === "logic-clues") return logicCluesMarkup(visual);
  return "";
}
