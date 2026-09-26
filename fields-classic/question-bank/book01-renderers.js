// 더클래식 1과정 1권 전용 시각 자료. 화면과 인쇄에서 같은 구조를 사용한다.
import { foldingQuestionMarkup } from "./golden-bell-book01-folding.js?v=20260922d";

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

export function digitalDigit(value) {
  const segments = DIGIT_SEGMENTS[value] || "";
  return `<svg class="b1-digit" viewBox="0 0 45 74" role="img" aria-label="디지털 숫자 ${value}">${Object.entries(SEGMENT_PATHS).map(([name, path]) => `<path class="${segments.includes(name) ? "on" : ""}" d="${path}"/>`).join("")}</svg>`;
}

function digitalNumber(value) {
  return String(value).split("").map((digit) => digitalDigit(Number(digit))).join("");
}

const operationShort = (operation) => ({
  "mirror-left-right": "좌우 뒤집기", "mirror-top-bottom": "위아래 뒤집기", "rotate-half": "반 바퀴"
}[operation] || operation);

function digitalTransformMarkup(visual) {
  const options = (visual.options || []).map((option) => `<span><b>${option.option}</b>${option.value}</span>`).join("");
  return `<div class="b1-digital-transform"><div>${visual.digits.map(digitalDigit).join("")}<i>→</i><strong>${operationShort(visual.operation)}</strong></div>${options ? `<div class="b1-number-options">${options}</div>` : ""}</div>`;
}

function digitalRuleBoardMarkup(visual) {
  const numbers = visual.digits.map((value) => `<span>${digitalNumber(value)}<b>${value}</b></span>`).join("");
  return `<div class="b1-digital-rule-board" role="img" aria-label="디지털 숫자를 ${operationShort(visual.operation)} 전의 모습"><div class="b1-digital-rule-numbers ${visual.grouped ? "grouped" : ""}">${numbers}</div><strong>판 전체를 ${operationShort(visual.operation)}</strong><small>켜진 선과 자리 순서를 함께 움직이세요.</small></div>`;
}

function mirrorCompassMarkup(visual) {
  const target = visual.target || "right";
  const source = visual.source || "top-left";
  const sourceArm = source === "bottom-right" ? "M0 0L-18 18" : "M0 0L-18 -18";
  const choices = [
    ["1", "M0 20V-20M0-12L-18 6"],
    ["2", "M0 20V-20M0-12L18 6"],
    ["3", "M0-20V20M0 12L-18 -6"],
    ["4", "M0-20V20M0 12L18 -6"]
  ];
  const mirrorClass = (side) => side === target ? "target" : "";
  return `<div class="b1-mirror-work" role="img" aria-label="가운데 모양과 위, 아래, 왼쪽, 오른쪽 거울"><svg viewBox="0 0 360 220"><g class="mirrors"><rect class="${mirrorClass("top")}" x="150" y="9" width="60" height="18"/><rect class="${mirrorClass("bottom")}" x="150" y="137" width="60" height="18"/><rect class="${mirrorClass("left")}" x="85" y="55" width="18" height="60"/><rect class="${mirrorClass("right")}" x="257" y="55" width="18" height="60"/></g><g class="source" transform="translate(180 82)"><path d="M0 35V-35${sourceArm}"/></g><text x="180" y="180">${target === "right" ? "오른쪽" : target === "left" ? "왼쪽" : target === "top" ? "위쪽" : "아래쪽"} 거울</text>${choices.map(([label, path], index) => `<g class="choice" transform="translate(${55 + index * 84} 205)"><path d="${path}"/><text x="27" y="0">${label}</text></g>`).join("")}</svg></div>`;
}

function arithmeticListMarkup(visual) {
  return `<div class="b1-arithmetic-list" role="img" aria-label="기초 연산식"><strong>차례로 계산하세요</strong><div>${visual.expressions.map((expression, index) => `<span><b>${index + 1}</b>${esc(expression)}<i>=</i><em>?</em></span>`).join("")}</div></div>`;
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

const LINE_BOARD_LAYOUTS = Object.freeze({
  cross: { points: [[160,25],[55,105],[160,105],[265,105],[160,185]], lines: [[0,2],[2,4],[1,2],[2,3]] },
  "t-shape": { points: [[55,55],[160,55],[265,55],[265,120],[265,185]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  corner: { points: [[265,25],[265,105],[265,185],[160,185],[55,185]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  triangle: { points: [[160,25],[95,103],[225,103],[30,185],[160,185],[290,185]], lines: [[0,1],[1,3],[0,2],[2,5],[3,4],[4,5]] },
  flower: {
    points: [[160,108],[160,20],[222,46],[248,108],[222,170],[160,196],[98,170],[72,108],[98,46]],
    lines: [[1,0],[0,5],[2,0],[0,6],[3,0],[0,7],[4,0],[0,8]]
  },
  "source-flower": {
    points: [[160,108],[160,20],[235,64],[235,152],[160,196],[85,152],[85,64]],
    lines: [[1,0],[0,4],[2,0],[0,5],[3,0],[0,6]]
  }
});

function lineCardBoardMarkup(visual) {
  const layout = LINE_BOARD_LAYOUTS[visual.layout] || LINE_BOARD_LAYOUTS.cross;
  const shown = layout.points.map((_, index) => visual.shown?.[index] ?? null);
  const lines = layout.lines.map(([from, to]) => `<line x1="${layout.points[from][0]}" y1="${layout.points[from][1]}" x2="${layout.points[to][0]}" y2="${layout.points[to][1]}"/>`).join("");
  const nodes = layout.points.map(([x,y], index) => `<g class="${shown[index] == null ? "blank" : "known"}"><circle cx="${x}" cy="${y}" r="23"/><text x="${x}" y="${y + 1}">${shown[index] == null ? visual.blankLabels === false ? "" : index + 1 : shown[index]}</text></g>`).join("");
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  const footer = visual.lineSum == null ? "모든 줄의 합을 같게" : `한 줄의 합 ${visual.lineSum}`;
  return `<div class="b1-line-card-board">${cards}<svg viewBox="0 0 320 225" role="img" aria-label="숫자 카드를 놓아 모든 줄의 합을 같게 하는 ${visual.layout} 모양">${lines}${nodes}<text class="sum" x="160" y="220">${footer}</text></svg></div>`;
}

function digitSumTableMarkup(visual) {
  const numbers = (sum) => Array.from({ length: 9 }, (_, index) => index + 1).map((tens) => [tens, sum - tens]).filter(([, ones]) => ones >= 0 && ones <= 9).map(([tens, ones]) => tens * 10 + ones);
  const rows = Array.from({ length: visual.to - visual.from + 1 }, (_, index) => visual.from + index).map((sum) => {
    const values = numbers(sum);
    const revealed = sum <= visual.revealedThrough;
    return `<tr><th>${sum}</th><td>${revealed ? values.join(", ") : "직접 찾아 쓰기"}</td><td>${revealed ? `${values.length}개` : "?개"}</td></tr>`;
  }).join("");
  return `<table class="b1-digit-sum-table"><thead><tr><th>각 자리 숫자의 합</th><th>두 자리 수</th><th>개수</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function foldPatternGrid(pattern, label = "", diagonal = false) {
  const rows = pattern.length;
  const columns = pattern[0]?.length || 1;
  const cells = pattern.flatMap((row) => [...row]).map((state) => `<i class="${state === "W" ? "removed" : state === "X" ? "cut" : "paper"}"></i>`).join("");
  return `<figure class="b1-fold-pattern${diagonal ? " diagonal" : ""}"><div style="--rows:${rows};--columns:${columns}">${cells}</div>${label ? `<figcaption>${esc(label)}</figcaption>` : ""}</figure>`;
}

function foldMotifSvg(variant, option = 0) {
  if (variant === "notch") {
    const cuts = [
      '<path class="cut" d="M24 58H58L72 72L58 86H24Z"/>',
      '<path class="cut" d="M58 20V58L72 72L86 58V20Z"/>',
      '<path class="cut" d="M20 58H58L72 72L58 86H20M124 58H86L72 72L86 86H124Z"/>',
      '<path class="cut" d="M20 58H52L64 72L52 86H20M124 58H92L80 72L92 86H124Z"/>'
    ];
    if (!option) return `<svg viewBox="0 0 144 144"><rect class="paper" x="20" y="20" width="104" height="104"/><path class="crease" d="M72 20V124"/><path class="source-cut" d="M72 58L92 72L72 86Z"/><path class="fold-arrow" d="M48 103Q61 114 71 96"/></svg>`;
    return `<svg viewBox="0 0 144 144"><rect class="paper" x="20" y="20" width="104" height="104"/><path class="crease" d="M72 20V124"/>${cuts[option - 1]}</svg>`;
  }
  if (variant === "circle-square") {
    const optionMarks = [
      '<path class="cut" d="M20 66A14 14 0 0 1 34 80A14 14 0 0 1 20 94Z"/><path class="cut" d="M94 30H114V50H94ZM94 94H114V114H94Z"/>',
      '<circle class="cut" cx="32" cy="72" r="13"/><path class="cut" d="M94 30H114V50H94ZM94 94H114V114H94Z"/>',
      '<path class="cut" d="M20 58A14 14 0 0 1 34 72A14 14 0 0 1 20 86Z"/><circle class="cut" cx="100" cy="101" r="12"/><path class="cut" d="M94 30H114V50H94Z"/>',
      '<path class="cut" d="M72 62C57 47 43 68 72 91C101 68 87 47 72 62Z"/>'
    ];
    if (!option) return `<svg viewBox="0 0 144 144"><rect class="paper" x="20" y="20" width="104" height="104"/><path class="crease" d="M20 72H124"/><path class="source-cut" d="M20 58A14 14 0 0 1 34 72H20ZM94 31H114V51H94Z"/><path class="fold-arrow" d="M44 92Q59 80 42 68"/></svg>`;
    return `<svg viewBox="0 0 144 144"><rect class="paper" x="20" y="20" width="104" height="104"/><path class="crease" d="M20 72H124"/>${optionMarks[option - 1]}</svg>`;
  }
  const optionMarks = [
    '<circle class="cut" cx="48" cy="48" r="12"/><path class="cut" d="M84 84H108V108H84Z"/>',
    '<circle class="cut" cx="48" cy="48" r="12"/><circle class="cut" cx="96" cy="96" r="12"/>',
    '<path class="cut" d="M72 56C58 42 44 63 72 86C100 63 86 42 72 56Z"/>',
    '<circle class="cut" cx="45" cy="45" r="11"/><circle class="cut" cx="99" cy="99" r="11"/><path class="cut" d="M85 31H105V51H85ZM31 85H51V105H31Z"/>'
  ];
  if (!option) return `<svg viewBox="0 0 144 144"><rect class="paper" x="20" y="20" width="104" height="104"/><path class="crease" d="M20 124L124 20"/><circle class="source-cut" cx="93" cy="43" r="12"/><path class="source-cut" d="M35 89H58V112H35Z"/><path class="fold-arrow" d="M48 92Q70 93 72 70"/></svg>`;
  return `<svg viewBox="0 0 144 144"><rect class="paper" x="20" y="20" width="104" height="104"/><path class="crease" d="M20 124L124 20"/>${optionMarks[option - 1]}</svg>`;
}

function foldChoiceBoardMarkup(visual) {
  const folds = `<div class="b1-fold-steps">${visual.folds.map((fold, index) => `<span><b>${index + 1}</b>${esc(fold)}</span>`).join("")}</div>`;
  if (visual.variant) {
    const options = Array.from({ length: 4 }, (_, index) => `<figure>${foldMotifSvg(visual.variant, index + 1)}<figcaption>${index + 1}번</figcaption></figure>`).join("");
    return `<div class="b1-fold-choice-board motif"><section>${foldMotifSvg(visual.variant)}${folds}</section><div class="b1-fold-option-grid">${options}</div></div>`;
  }
  const source = foldPatternGrid(visual.sourcePattern, "접은 뒤 자른 곳", visual.diagonal);
  const options = visual.optionPatterns.map((pattern, index) => foldPatternGrid(pattern, `${index + 1}번`, visual.diagonal)).join("");
  return `<div class="b1-fold-choice-board"><section>${source}${folds}</section><div class="b1-fold-option-grid">${options}</div></div>`;
}

function foldNumberSumMarkup(visual) {
  if (visual.foldModel) return foldingQuestionMarkup(visual);
  const selected = new Set(visual.selected);
  const rows = visual.numbers.length;
  const columns = visual.numbers[0].length;
  return `<div class="b1-fold-number-sum"><div class="b1-fold-steps">${visual.folds.map((fold, index) => `<span><b>${index + 1}</b>${esc(fold)}</span>`).join("")}</div><div class="b1-fold-number-grid" style="--rows:${rows};--columns:${columns}">${visual.numbers.flat().map((value, index) => `<i class="${selected.has(index) ? "cut-area" : ""}">${value}</i>`).join("")}</div><strong>잘려 나간 칸의 수를 모두 더하세요.</strong></div>`;
}

function foldLandingMarkup(visual) {
  if (visual.foldModel) return foldingQuestionMarkup(visual);
  const labels = visual.labels.flat();
  return `<div class="b1-fold-landing"><div class="b1-fold-landing-grid">${labels.map((label) => `<span>${label}</span>`).join("")}</div><div class="b1-fold-steps">${visual.folds.map((fold, index) => `<span><b>${index + 1}</b>${esc(fold)}</span>`).join("")}</div><div class="b1-fold-stack"><i></i><i></i><i></i><strong>?</strong></div><p>두 번 접은 뒤 가장 위에 놓이는 번호</p></div>`;
}

function cardEquationMarkup(visual) {
  const cards = `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>`;
  const expression = visual.expression.map((token) => token == null ? '<span class="b1-equation-blank"></span>' : `<b>${esc(token)}</b>`).join("");
  return `<div class="b1-card-equation">${cards}<div>${expression}</div>${visual.all ? "<strong>가능한 카드 묶음을 모두 찾으세요.</strong>" : "<strong>카드는 한 번씩만 사용할 수 있어요.</strong>"}</div>`;
}

function conditionCardMarkup(visual) {
  const places = visual.places?.length ? `<div class="b1-place-condition">${visual.places.map((place) => `<span><b>${esc(place)}</b><i></i></span>`).join("")}</div>` : "";
  return `<div class="b1-condition-card"><strong>${esc(visual.title)}</strong><ol>${visual.clues.map((clue) => `<li>${esc(clue)}</li>`).join("")}</ol>${places}</div>`;
}

function placeValueBlocksMarkup(visual) {
  const places = [
    ["천", visual.thousands, "thousand"],
    ["백", visual.hundreds, "hundred"],
    ["십", visual.tens, "ten"],
    ["일", visual.ones, "one"]
  ];
  return `<div class="b1-place-value-blocks" role="img" aria-label="천, 백, 십, 일 수 모형"><div>${places.map(([label, count, kind]) => `<section><span class="blocks ${kind}">${Array.from({ length: count }, () => "<i></i>").join("")}</span><strong>${label}</strong><b>${count}개</b></section>`).join("")}</div><p>자릿값이 큰 모형부터 차례로 읽으세요.</p></div>`;
}

function equalSplitSetMarkup(visual) {
  return `<div class="b1-equal-split-set" role="img" aria-label="수를 같은 수로 나누는 연산"><strong>같은 ${visual.divisor}수로 나누기</strong><div>${visual.values.map((value) => `<span><b>${value}</b><i>÷ ${visual.divisor}</i><em>?</em></span>`).join("")}</div></div>`;
}

function orderLineMarkup(visual) {
  const hidden = new Set(visual.hidden || []);
  return `<div class="b1-order-line" role="img" aria-label="앞에서 뒤로 선 사람의 순서"><b>앞</b><div>${visual.order.map((person, index) => `<span>${hidden.has(index) ? "?" : esc(person)}</span>`).join("")}</div><b>뒤</b></div>`;
}

function equalizeTransferMarkup(visual) {
  const maxDots = 20;
  const dots = (count) => Array.from({ length: Math.min(count, maxDots) }, () => "<i></i>").join("");
  return `<div class="b1-equalize-transfer" role="img" aria-label="A와 B가 가진 수를 같게 만드는 이동"><section><strong>A</strong><div>${dots(visual.left)}</div><b>${visual.left}개</b></section><span>몇 개를<br>옮길까요?</span><section><strong>B</strong><div>${dots(visual.right)}</div><b>${visual.right}개</b></section>${visual.left > maxDots || visual.right > maxDots ? '<small>점은 양의 크기를 비교하는 모형이며 정확한 수는 숫자로 확인합니다.</small>' : ""}</div>`;
}

function numberSequenceMarkup(visual) {
  return `<div class="b1-number-sequence">${visual.shown.map((value, index) => `<span class="${value == null ? "blank" : ""}">${value == null ? "" : value}</span>${index < visual.shown.length - 1 ? "<i>→</i>" : ""}`).join("")}</div>`;
}

function logicCluesMarkup(visual) {
  const header = visual.items.length ? `<div class="b1-logic-tags">${visual.names.map((name) => `<span>${esc(name)}</span>`).join("")}${visual.items.map((item) => `<i>${esc(item)}</i>`).join("")}</div>` : "";
  return `<div class="b1-logic-clues">${header}<ol>${visual.clues.map((clue) => `<li>${esc(clue)}</li>`).join("")}</ol><strong>${esc(visual.question)}</strong></div>`;
}

function unitSetMarkup(visual) {
  const sharedCards = visual.sharedCards?.length ? `<div class="b1-number-cards b1-shared-cards">${visual.sharedCards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  const items = visual.items.map((item) => `<section><b>${esc(item.label || "")}</b>${book01Markup(item.visual)}</section>`).join("");
  return `${sharedCards}<div class="b1-unit-set" style="--columns:${Math.min(visual.items.length, 3)}">${items}</div>`;
}

function digitalDirectSetMarkup(visual) {
  const items = visual.items.map((item, index) => {
    if (visual.mode === "addition") {
      const transformed = visual.reveal ? digitalNumber(item.result) : blankNumber(2, "transformed");
      const sum = visual.reveal ? `<strong>${item.sum}</strong>` : blankNumber(3, "sum");
      return `<section><b>(${index + 1})</b><div class="b1-direct-calculation"><span>${digitalNumber(item.source)}</span><span><i>+</i>${transformed}</span><em></em><span>${sum}</span></div></section>`;
    }
    const result = visual.reveal ? digitalNumber(item.result) : blankNumber(2, "result");
    return `<section><b>(${index + 1})</b><span>${digitalNumber(item.source)}</span><i>⇄</i><span>${result}</span></section>`;
  }).join("");
  const caption = visual.mode === "addition" ? "반 바퀴 돌린 수를 쓰고 더하세요." : "숫자판 전체와 자리 순서를 함께 뒤집으세요.";
  return `<div class="b1-digital-direct-set">${items}<strong>${caption}</strong></div>`;
}

function twoStepNumberBoardMarkup(visual) {
  const cells = visual.cells.map((cell) => `<span><b style="--turn:${cell.orientation}deg">${cell.value}<i></i></b></span>`).join("");
  return `<div class="b1-two-step-board"><div>${cells}</div><section>${visual.steps.map((step, index) => `<span><b>${index + 1}</b>${esc(step)}</span>`).join("<i>→</i>")}</section><strong>마지막에 똑바로 놓이는 수의 합</strong></div>`;
}

function diagonalFoldPaper(item) {
  const row = Math.floor(item.cutIndex / 4);
  const column = item.cutIndex % 4;
  const x = 14 + column * 18;
  const y = 14 + row * 18;
  const crease = item.diagonal === "main" ? "M10 10L90 90" : "M10 90L90 10";
  return `<svg viewBox="0 0 100 100" role="img" aria-label="대각선으로 접고 색칠한 부분을 자르는 색종이"><rect class="paper" x="10" y="10" width="80" height="80"/><path class="crease" d="${crease}"/><rect class="cut" x="${x}" y="${y}" width="12" height="12"/><path class="fold-arrow" d="M28 76Q50 55 70 31"/></svg>`;
}

function diagonalFoldSetMarkup(visual) {
  const items = visual.items.map((item, itemIndex) => {
    const selected = new Set(visual.reveal ? item.selected : []);
    const cells = item.numbers.flat().map((value, index) => `<span class="${selected.has(index) ? "selected" : ""}">${value}</span>`).join("");
    const inline = visual.compact ? "" : `<label class="b1-inline-answer">합 <i>${visual.reveal ? item.answer : ""}</i></label>`;
    return `<section><b>${visual.items.length > 1 ? `(${itemIndex + 1})` : ""}</b><div class="b1-diagonal-fold-row">${diagonalFoldPaper(item)}<em>→</em><div class="b1-diagonal-grid ${item.diagonal}">${cells}<i></i></div></div>${inline}</section>`;
  }).join("");
  return `<div class="b1-diagonal-fold-set">${items}</div>`;
}

function foldUnfoldDrawMarkup(visual) {
  const cuts = visual.reveal ? `
    <polygon points="80,12 98,42 62,42"/><polygon points="148,80 118,98 118,62"/>
    <polygon points="80,148 62,118 98,118"/><polygon points="12,80 42,62 42,98"/>` : "";
  return `<div class="b1-fold-unfold-draw" style="--turn:${visual.rotation}deg">
    <div class="folds"><span>처음</span><i>→</i><span>반으로 접기</span><i>→</i><span class="packet">다시 반으로 접고 자르기</span></div>
    <div class="folded-packet"><span></span><span><svg viewBox="0 0 32 32"><polygon points="32,0 32,18 15,0"/></svg></span><span></span><span></span></div><strong>접은 모양</strong>
    <svg class="unfold-target" viewBox="0 0 160 160" role="img" aria-label="두 번 접은 색종이를 펼친 모양"><rect x="12" y="12" width="136" height="136"/><path d="M80 12V148M12 80H148"/>${cuts}</svg>
    <strong>${visual.reveal ? "완성된 펼친 모양" : "빈 그림에 펼친 모양을 그리세요"}</strong>
  </div>`;
}

function foldPieceTypesMarkup(visual) {
  const counts = visual.reveal
    ? `<div class="counts"><b>△ ${visual.triangleCount}개</b><b>◇ ${visual.diamondCount}개</b></div>`
    : '<div class="counts blanks"><b>△ <i></i>개</b><b>◇ <i></i>개</b></div>';
  return `<div class="b1-fold-piece-types"><svg viewBox="0 0 440 150" role="img" aria-label="색종이를 두 번 접어 대각선 두 줄로 자르는 과정"><rect class="paper" x="10" y="25" width="105" height="105"/><path class="crease" d="M10 77H115"/><path class="arrow" d="M125 77H165M154 66L165 77L154 88"/><rect class="paper" x="175" y="50" width="105" height="55"/><path class="crease" d="M227 50V105"/><path class="arrow" d="M290 77H330M319 66L330 77L319 88"/><rect class="paper" x="340" y="50" width="88" height="55"/><path class="cut" d="M340 50L428 105M428 50L340 105"/></svg>${counts}<strong>펼친 뒤 생긴 두 종류의 조각을 따로 셉니다.</strong></div>`;
}

function foldPunchTotalMarkup(visual) {
  return `<div class="b1-fold-punch-total"><svg viewBox="0 0 460 150" role="img" aria-label="대각선으로 두 번 접고 원과 반원 구멍을 뚫는 과정"><rect class="paper" x="10" y="22" width="105" height="105"/><path class="crease" d="M10 127L115 22"/><path class="arrow" d="M125 76H165M154 65L165 76L154 87"/><path class="paper" d="M175 127L280 127L280 22Z"/><path class="crease" d="M175 127L280 75"/><path class="arrow" d="M290 76H330M319 65L330 76L319 87"/><path class="paper" d="M340 127L445 127L392 75Z"/><circle class="cut" cx="386" cy="111" r="9"/><path class="cut" d="M414 103A10 10 0 0 1 424 113H414Z"/></svg><strong>전체 구멍 수 = ${visual.reveal ? visual.total : "?"}</strong></div>`;
}

function borderMagicMarkup(visual) {
  const positions = [0, 1, 2, 7, null, 3, 6, 5, 4];
  const cells = positions.map((position) => position == null ? '<span class="center"></span>' : `<span class="${visual.shown[position] == null ? "blank" : ""}">${visual.shown[position] ?? ""}</span>`).join("");
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  return `<div class="b1-border-magic">${cards}<div class="grid">${cells}</div><strong>각 줄의 합 ${visual.lineSum}</strong></div>`;
}

function triangleMagicMarkup(visual) {
  const points = [[140,20],[78,92],[202,92],[25,175],[140,175],[255,175]];
  const lines = [[0,1],[1,3],[0,2],[2,5],[3,4],[4,5]].map(([from,to]) => `<line x1="${points[from][0]}" y1="${points[from][1]}" x2="${points[to][0]}" y2="${points[to][1]}"/>`).join("");
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="21"/><text x="${x}" y="${y}">${visual.shown[index] ?? ""}</text>`).join("");
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  return `<div class="b1-triangle-magic">${cards}<svg viewBox="0 0 280 205" role="img" aria-label="세 변의 합이 같은 여섯 수 삼각형">${lines}${nodes}<text class="sum" x="140" y="200">한 줄의 합 ${visual.lineSum}</text></svg></div>`;
}

function irregularGakuroMarkup(visual) {
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  const cells = visual.mask.map((active, index) => {
    if (!active) return "";
    const row = Math.floor(index / 3) + 1;
    const column = index % 3 + 1;
    return `<span class="${visual.shown[index] == null ? "blank" : ""}" style="--row:${row};--column:${column}">${visual.shown[index] ?? ""}</span>`;
  }).join("");
  const rows = visual.rowSums.map((sum, index) => `<b style="--row:${index + 1}">${sum}</b>`).join("");
  const columns = visual.columnSums.map((sum, index) => `<i style="--column:${index + 1}">${sum}</i>`).join("");
  return `<div class="b1-irregular-gakuro">${cards}<div class="puzzle">${cells}${rows}${columns}</div></div>`;
}

function ellipseMagicMarkup(visual) {
  const points = [[160,24],[55,105],[160,105],[265,105],[160,186]];
  const lines = '<line x1="160" y1="24" x2="160" y2="186"/><line x1="55" y1="105" x2="265" y2="105"/>';
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="21"/><text x="${x}" y="${y}">${visual.shown[index] ?? ""}</text>`).join("");
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  return `<div class="b1-ellipse-magic">${cards}<svg viewBox="0 0 320 210" role="img" aria-label="타원 둘레와 두 직선의 합이 같은 수 배열"><ellipse cx="160" cy="105" rx="105" ry="81"/>${lines}${nodes}</svg></div>`;
}

function polygonRingMarkup(visual) {
  const vertices = circlePoints(5, 160, 125, 92);
  const points = vertices.flatMap((point, index) => {
    const next = vertices[(index + 1) % vertices.length];
    return [point, [(point[0] + next[0]) / 2, (point[1] + next[1]) / 2]];
  });
  const path = vertices.map(([x,y]) => `${x},${y}`).join(" ");
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y}">${visual.shown[index] ?? ""}</text>`).join("");
  const cards = visual.cards?.length ? `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>` : "";
  return `<div class="b1-polygon-ring">${cards}<svg viewBox="0 0 320 255" role="img" aria-label="오각형 다섯 줄의 합이 같은 수 배열"><polygon points="${path}"/>${nodes}<text class="sum" x="160" y="128">합 ${visual.lineSum}</text></svg></div>`;
}

function heightOrderMarkup(visual) {
  const order = visual.order || [];
  return `<div class="b1-height-order"><ol>${visual.clues.map((clue) => `<li>${esc(clue)}</li>`).join("")}</ol><div><b>크다</b>${Array.from({ length: 4 }, (_, index) => `<span>${order[index] ? `${order[index]}<i>${index + 1}</i>` : `<i>${index + 1}</i>`}</span>`).join("")}<b>작다</b></div></div>`;
}

export function book01Markup(visual) {
  if (!visual || visual.kind !== "book1") return "";
  if (visual.subtype === "unit-set") return unitSetMarkup(visual);
  if (visual.subtype === "shape-transform") return shapeTransformMarkup(visual);
  if (visual.subtype === "partition-draw") return partitionDrawMarkup(visual);
  if (visual.subtype === "digital-transform") return digitalTransformMarkup(visual);
  if (visual.subtype === "digital-rule-board") return digitalRuleBoardMarkup(visual);
  if (visual.subtype === "digital-orientation-board") return digitalOrientationBoardMarkup(visual);
  if (visual.subtype === "digital-related-addition") return digitalRelatedAdditionMarkup(visual);
  if (visual.subtype === "digital-direct-set") return digitalDirectSetMarkup(visual);
  if (visual.subtype === "two-step-number-board") return twoStepNumberBoardMarkup(visual);
  if (visual.subtype === "mirror-compass") return mirrorCompassMarkup(visual);
  if (visual.subtype === "arithmetic-list") return arithmeticListMarkup(visual);
  if (visual.subtype === "circle-magic") return circleMagicMarkup(visual);
  if (visual.subtype === "five-card-magic") return fiveCardMagicMarkup(visual);
  if (visual.subtype === "sum-grid") return sumGridMarkup(visual);
  if (visual.subtype === "ring-lines") return ringLinesMarkup(visual);
  if (visual.subtype === "line-card-board") return lineCardBoardMarkup(visual);
  if (visual.subtype === "border-magic") return borderMagicMarkup(visual);
  if (visual.subtype === "triangle-magic") return triangleMagicMarkup(visual);
  if (visual.subtype === "irregular-gakuro") return irregularGakuroMarkup(visual);
  if (visual.subtype === "ellipse-magic") return ellipseMagicMarkup(visual);
  if (visual.subtype === "polygon-ring") return polygonRingMarkup(visual);
  if (visual.subtype === "digit-sum-table") return digitSumTableMarkup(visual);
  if (visual.subtype === "fold-choice-board") return foldChoiceBoardMarkup(visual);
  if (visual.subtype === "fold-number-sum") return foldNumberSumMarkup(visual);
  if (visual.subtype === "diagonal-fold-set") return diagonalFoldSetMarkup(visual);
  if (visual.subtype === "fold-unfold-draw") return foldUnfoldDrawMarkup(visual);
  if (visual.subtype === "fold-piece-types") return foldPieceTypesMarkup(visual);
  if (visual.subtype === "fold-punch-total") return foldPunchTotalMarkup(visual);
  if (visual.subtype === "fold-landing") return foldLandingMarkup(visual);
  if (visual.subtype === "card-equation") return cardEquationMarkup(visual);
  if (visual.subtype === "condition-card") return conditionCardMarkup(visual);
  if (visual.subtype === "place-value-blocks") return placeValueBlocksMarkup(visual);
  if (visual.subtype === "equal-split-set") return equalSplitSetMarkup(visual);
  if (visual.subtype === "number-sequence") return numberSequenceMarkup(visual);
  if (visual.subtype === "logic-clues") return logicCluesMarkup(visual);
  if (visual.subtype === "order-line") return orderLineMarkup(visual);
  if (visual.subtype === "height-order") return heightOrderMarkup(visual);
  if (visual.subtype === "equalize-transfer") return equalizeTransferMarkup(visual);
  return "";
}
