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
    "rotate-left": "시계 반대 방향으로 반의 반 바퀴", "rotate-right": "시계 방향으로 반의 반 바퀴", "rotate-half": "반 바퀴"
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
  }
});

function lineCardBoardMarkup(visual) {
  const layout = LINE_BOARD_LAYOUTS[visual.layout] || LINE_BOARD_LAYOUTS.cross;
  const shown = layout.points.map((_, index) => visual.shown?.[index] ?? null);
  const lines = layout.lines.map(([from, to]) => `<line x1="${layout.points[from][0]}" y1="${layout.points[from][1]}" x2="${layout.points[to][0]}" y2="${layout.points[to][1]}"/>`).join("");
  const nodes = layout.points.map(([x,y], index) => `<g class="${shown[index] == null ? "blank" : "known"}"><circle cx="${x}" cy="${y}" r="23"/><text x="${x}" y="${y + 1}">${shown[index] == null ? index + 1 : shown[index]}</text></g>`).join("");
  const cards = `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>`;
  const footer = visual.lineSum == null ? "모든 줄의 합을 같게" : `한 줄의 합 ${visual.lineSum}`;
  return `<div class="b1-line-card-board">${cards}<svg viewBox="0 -8 320 256" role="img" aria-label="숫자 카드를 놓아 모든 줄의 합을 같게 하는 ${visual.layout} 모양">${lines}${nodes}<text class="sum" x="160" y="236">${footer}</text></svg></div>`;
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
  const selected = new Set(visual.selected);
  const rows = visual.numbers.length;
  const columns = visual.numbers[0].length;
  return `<div class="b1-fold-number-sum"><div class="b1-fold-steps">${visual.folds.map((fold, index) => `<span><b>${index + 1}</b>${esc(fold)}</span>`).join("")}</div><div class="b1-fold-number-grid" style="--rows:${rows};--columns:${columns}">${visual.numbers.flat().map((value, index) => `<i class="${selected.has(index) ? "cut-area" : ""}">${value}</i>`).join("")}</div><strong>잘려 나간 칸의 수를 모두 더하세요.</strong></div>`;
}

function foldLandingMarkup(visual) {
  const labels = visual.labels.flat();
  return `<div class="b1-fold-landing"><div class="b1-fold-landing-grid">${labels.map((label) => `<span>${label}</span>`).join("")}</div><div class="b1-fold-steps">${visual.folds.map((fold, index) => `<span><b>${index + 1}</b>${esc(fold)}</span>`).join("")}</div><div class="b1-fold-stack"><i></i><i></i><i></i><strong>?</strong></div><p>두 번 접은 뒤 가장 위에 놓이는 번호</p></div>`;
}

function cardEquationMarkup(visual) {
  const cards = `<div class="b1-number-cards">${visual.cards.map((card) => `<i>${card}</i>`).join("")}</div>`;
  const expression = visual.expression.map((token) => token == null ? '<span class="b1-equation-blank"></span>' : `<b>${esc(token)}</b>`).join("");
  return `<div class="b1-card-equation">${cards}<div>${expression}</div>${visual.all ? "<strong>가능한 카드 묶음을 모두 찾으세요.</strong>" : "<strong>카드는 한 번씩만 사용할 수 있어요.</strong>"}</div>`;
}

function conditionCardMarkup(visual) {
  return `<div class="b1-condition-card"><strong>${esc(visual.title)}</strong><ol>${visual.clues.map((clue) => `<li>${esc(clue)}</li>`).join("")}</ol></div>`;
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

// ── 권별테스트(단원 테스트) 원본 구조 그림 ────────────────────────────────
// 문제은행 화면(styles.css)에는 골든벨 CSS가 없으므로 채움·선·글자 모양을 그림 안에 직접 적는다.
// 글자는 `.book01-visual svg text` 규칙이 덮지 않도록 style 속성으로 준다.
const UT = Object.freeze({
  ink: "#222", line: "#7a6f5c", soft: "#c9bda2",
  paper: "#fde9b8", paperLine: "#c08a2e", grid: "#d9b46a", cut: "#f39a1e", crease: "#a8741a", arrow: "#e8503a",
  box: "#8e5bd8", boxFill: "#ffffff", tint: "#ece0fb", card: "#fff3c4", cardLine: "#f0a500",
  guide: "#e8503a", digit: "#e8503a", dot: "#2f6fe0", flip: "#f39a1e",
  pieces: ["#ffe1dc", "#dcf5e5", "#dde9ff", "#fff3c4"], pieceA: "#dcf5e5", pieceB: "#ece0fb", pastel: ["#ffe1dc", "#dcf5e5", "#dde9ff", "#fff3c4"]
});

const utText = (x, y, value, { size = 15, anchor = "middle", weight = 700, fill = UT.ink } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central" style="font-size:${size}px;font-weight:${weight};fill:${fill};text-anchor:${anchor};dominant-baseline:central;letter-spacing:0">${esc(value)}</text>`;
const utSvg = (width, height, label, body, maxWidth = width) => `<svg class="b1-ut-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}" style="display:block;width:100%;max-width:${maxWidth}px;height:auto;margin:0 auto">${body}</svg>`;
const utBox = (x, y, w, h, { fill = UT.boxFill, stroke = UT.box, width = 1.8, radius = 3 } = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;

function utCardsRow(cards, width, y = 4, size = 30) {
  if (!cards?.length) return "";
  const gap = 6;
  const start = (width - (cards.length * size + (cards.length - 1) * gap)) / 2;
  return cards.map((card, index) => {
    const x = start + index * (size + gap);
    return `${utBox(x, y, size, size, { fill: UT.card, stroke: UT.cardLine, width: 1.8 })}${utText(x + size / 2, y + size / 2 + 1, card, { size: 15, weight: 800 })}`;
  }).join("");
}

function utSetMarkup(visual) {
  const columns = Math.max(1, visual.columns || visual.items.length);
  const items = visual.items.map((item) => `<figure style="margin:0;min-width:0"><figcaption style="margin:0 0 4px;color:${UT.ink};font-size:12px;font-weight:800;line-height:1.35">${esc(item.label || "")}</figcaption>${book01Markup(item.visual)}</figure>`).join("");
  return `<div class="b1-ut-set" style="display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:10px 14px;width:100%">${items}</div>`;
}

function utSquirrel(cx, cy) {
  return `<g transform="translate(${cx} ${cy})"><circle cx="-8" cy="-9" r="4.2" fill="#c98b3c" stroke="#8a5a1e" stroke-width="1"/><circle cx="8" cy="-9" r="4.2" fill="#c98b3c" stroke="#8a5a1e" stroke-width="1"/><circle r="11.5" fill="#e0a85a" stroke="#8a5a1e" stroke-width="1.2"/><ellipse cy="4" rx="6.5" ry="5" fill="#fbe3bd"/><circle cx="-4.2" cy="-2.5" r="1.7" fill="#222"/><circle cx="4.2" cy="-2.5" r="1.7" fill="#222"/><circle cy="2.4" r="1.4" fill="#7a3b10"/></g>`;
}

function utPartitionMarkup(visual) {
  const { rows, columns } = visual;
  const cell = 40;
  const pad = 8;
  const width = columns * cell + pad * 2;
  const height = rows * cell + pad * 2;
  const x = (column) => pad + column * cell;
  const y = (row) => pad + row * cell;
  let body = `<rect x="${pad}" y="${pad}" width="${columns * cell}" height="${rows * cell}" fill="#fff"/>`;
  if (visual.labels) {
    visual.labels.forEach((label, index) => { body += `<rect x="${x(index % columns)}" y="${y(Math.floor(index / columns))}" width="${cell}" height="${cell}" fill="${UT.pieces[label % 4]}"/>`; });
  }
  const edge = (a, b) => {
    const row = Math.floor(a / columns);
    const column = a % columns;
    return b === a + 1 ? [x(column + 1), y(row), x(column + 1), y(row + 1)] : [x(column), y(row + 1), x(column + 1), y(row + 1)];
  };
  const line = ([x1, y1, x2, y2], stroke, strokeWidth, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const inner = [];
  for (let index = 0; index < rows * columns; index += 1) {
    if (index % columns < columns - 1) inner.push([index, index + 1]);
    if (Math.floor(index / columns) < rows - 1) inner.push([index, index + columns]);
  }
  body += inner.map(([a, b]) => line(edge(a, b), UT.soft, 1.2, "4 3")).join("");
  (visual.symbols || []).forEach((symbol, index) => {
    if (!symbol) return;
    const cx = x(index % columns) + cell / 2;
    const cy = y(Math.floor(index / columns)) + cell / 2;
    body += symbol === "squirrel" ? utSquirrel(cx, cy + 2) : utText(cx, cy + 1, symbol, { size: 18, weight: 700 });
  });
  if (visual.labels) body += inner.filter(([a, b]) => visual.labels[a] !== visual.labels[b]).map(([a, b]) => line(edge(a, b), UT.ink, 3.6)).join("");
  body += (visual.guides || []).map(([a, b]) => line(edge(a, b), UT.guide, 4.2)).join("");
  body += `<rect x="${pad}" y="${pad}" width="${columns * cell}" height="${rows * cell}" fill="none" stroke="${visual.fence ? "#8a5a1e" : UT.ink}" stroke-width="${visual.fence ? 3.4 : 2.4}"/>`;
  if (visual.pivot) body += `<circle cx="${pad + columns * cell / 2}" cy="${pad + rows * cell / 2}" r="4.6" fill="${UT.ink}"/>`;
  return utSvg(width, height, visual.labels ? "네 조각으로 나눈 답" : "네 조각으로 나눌 판", body, 220);
}

// 7세그먼트 숫자. 1은 원본처럼 칸 가운데에 세운다.
const UT_SEGMENTS = Object.freeze({
  a: "M10 6L13.5 2.5H32.5L36 6L32.5 9.5H13.5Z", g: "M10 38L13.5 34.5H32.5L36 38L32.5 41.5H13.5Z", d: "M10 70L13.5 66.5H32.5L36 70L32.5 73.5H13.5Z",
  f: "M7 9L10.5 12.5V31.5L7 35L3.5 31.5V12.5Z", e: "M7 41L10.5 44.5V63.5L7 67L3.5 63.5V44.5Z",
  b: "M39 9L42.5 12.5V31.5L39 35L35.5 31.5V12.5Z", c: "M39 41L42.5 44.5V63.5L39 67L35.5 63.5V44.5Z"
});
function utDigitalDigit(value, cx, cy, scale = 1) {
  const segments = DIGIT_SEGMENTS[value] || "";
  const shift = value === 1 ? -16 : 0;
  const paths = [...segments].map((name) => `<path d="${UT_SEGMENTS[name]}" fill="${UT.digit}" transform="translate(${shift} 0)"/>`).join("");
  return `<g transform="translate(${(cx - 23 * scale).toFixed(1)} ${(cy - 38 * scale).toFixed(1)}) scale(${scale})">${paths}</g>`;
}

function utDigitCells(digits, x, y, cellWidth = 50, cellHeight = 64) {
  const boxes = digits.map((_, index) => utBox(x + index * cellWidth, y, cellWidth, cellHeight, { radius: 2 })).join("");
  const scale = Math.min((cellWidth - 12) / 40, (cellHeight - 10) / 72);
  const glyphs = digits.map((digit, index) => (digit == null ? "" : utDigitalDigit(digit, x + index * cellWidth + cellWidth / 2, y + cellHeight / 2, scale))).join("");
  return boxes + glyphs;
}

function utFlipIcon(cx, cy) {
  return `<line x1="${cx}" y1="${cy - 24}" x2="${cx}" y2="${cy + 24}" stroke="#8a8a94" stroke-width="1.6" stroke-dasharray="4 3"/><path d="M${cx - 15} ${cy + 3}A15 7 0 1 0 ${cx + 15} ${cy + 3}" fill="none" stroke="${UT.flip}" stroke-width="2.2"/><path d="M${cx + 15} ${cy + 3}l-1 -8l7 4z" fill="${UT.flip}"/><path d="M${cx - 15} ${cy + 3}A15 7 0 0 1 ${cx + 15} ${cy + 3}" fill="none" stroke="${UT.flip}" stroke-width="1.4" stroke-dasharray="2 3"/>`;
}

function utDigitalFlipMarkup(visual) {
  const body = `${utDigitCells(visual.digits, 6, 8)}${utFlipIcon(150, 40)}${utDigitCells([null, null], 194, 8)}`;
  return utSvg(300, 82, `두 자리 수 ${visual.digits.join("")}를 오른쪽으로 뒤집기`, body, 330);
}

function utDigitalAdditionMarkup(visual) {
  const x = 36;
  const body = `${utDigitCells(visual.digits, x, 6, 44, 56)}${utText(x + 96, 34, "← 원래 수", { size: 13, anchor: "start", weight: 700 })}${utText(14, 108, "+", { size: 24, weight: 800 })}${utDigitCells([null, null], x, 80, 44, 56)}${utText(x + 96, 108, "← 돌린 수", { size: 13, anchor: "start", weight: 700 })}<line x1="6" y1="148" x2="${x + 100}" y2="148" stroke="${UT.ink}" stroke-width="1.8"/>${utDigitCells([null, null], x, 158, 44, 56)}`;
  return utSvg(206, 220, `원래 수 ${visual.digits.join("")}와 반 바퀴 돌린 수의 덧셈`, body, 220);
}

const UT_STATE_TRANSFORM = Object.freeze({ normal: "", rot90: "rotate(90)", rot180: "rotate(180)", rot270: "rotate(-90)", flipX: "scale(-1 1)", flipY: "scale(1 -1)" });
function utOrientedBoardMarkup(visual) {
  const cell = 62;
  const pad = 6;
  let body = "";
  visual.cells.forEach((item, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    const cx = pad + column * cell + cell / 2;
    const cy = pad + row * cell + cell / 2;
    body += `<rect x="${pad + column * cell}" y="${pad + row * cell}" width="${cell}" height="${cell}" fill="${UT.pastel[(row + column) % 4]}" stroke="${UT.box}" stroke-width="1.6"/>`;
    body += `<g transform="translate(${cx} ${cy}) ${UT_STATE_TRANSFORM[item.state]}">${utText(0, 0, item.digit, { size: 34, weight: 600 })}</g>`;
  });
  body += `<rect x="${pad}" y="${pad}" width="${cell * 3}" height="${cell * 3}" fill="none" stroke="${UT.box}" stroke-width="2.6"/>`;
  return utSvg(cell * 3 + pad * 2, cell * 3 + pad * 2, "여러 방향으로 놓인 숫자판", body, 200);
}

// 색종이 접기 그림: 단위 정사각형 좌표(y는 아래)로 받은 도형을 칸마다 그리고, 칸 사이에 화살표를 둔다.
const UT_POLY_STYLE = Object.freeze({
  paper: `fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.8" stroke-linejoin="round"`,
  flap: `fill="#fff" stroke="${UT.paperLine}" stroke-width="1.3" stroke-dasharray="5 4"`,
  cut: `fill="${UT.cut}" stroke="${UT.cut}" stroke-width="0.6" stroke-linejoin="round"`,
  removed: `fill="#fff" stroke="${UT.paperLine}" stroke-width="1.4" stroke-linejoin="round"`,
  blank: `fill="#fff" stroke="${UT.paperLine}" stroke-width="1.8"`,
  "piece-a": `fill="${UT.pieceA}" stroke="${UT.ink}" stroke-width="1.3" stroke-linejoin="round"`,
  "piece-b": `fill="${UT.pieceB}" stroke="${UT.ink}" stroke-width="1.3" stroke-linejoin="round"`
});
const UT_SEG_STYLE = Object.freeze({
  grid: `stroke="${UT.grid}" stroke-width="1" stroke-dasharray="3 3"`,
  "grid-flap": `stroke="${UT.soft}" stroke-width="0.9" stroke-dasharray="3 3"`,
  "grid-blank": `stroke="${UT.grid}" stroke-width="1.1" stroke-dasharray="4 3"`,
  crease: `stroke="${UT.crease}" stroke-width="1.6" stroke-dasharray="6 4"`,
  "crease-next": `stroke="${UT.arrow}" stroke-width="1.6" stroke-dasharray="6 4"`,
  "crease-line": `stroke="${UT.crease}" stroke-width="1.8"`,
  cutline: `stroke="${UT.ink}" stroke-width="2.2" stroke-linecap="round"`
});

function utFoldPanelBounds(panel) {
  const points = [];
  for (const item of panel.items) {
    if (item.t === "poly") points.push(...item.pts);
    if (item.t === "seg") points.push(item.a, item.b);
  }
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

function utFoldPanel(panel, ox, oy, scale) {
  const bounds = utFoldPanelBounds(panel);
  const X = (value) => (ox + (value - bounds.x0) * scale).toFixed(1);
  const Y = (value) => (oy + (value - bounds.y0) * scale).toFixed(1);
  let body = "";
  for (const item of panel.items) {
    if (item.t === "poly") body += `<polygon points="${item.pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")}" ${UT_POLY_STYLE[item.role] || UT_POLY_STYLE.paper}/>`;
    else if (item.t === "seg") body += `<line x1="${X(item.a[0])}" y1="${Y(item.a[1])}" x2="${X(item.b[0])}" y2="${Y(item.b[1])}" ${UT_SEG_STYLE[item.role] || UT_SEG_STYLE.grid}/>`;
    else if (item.t === "num") body += utText(X(item.x), Y(item.y), item.v, { size: Math.max(11, Math.round(scale * 0.13)), weight: 600 });
    else if (item.t === "circle") body += `<circle cx="${X(item.x)}" cy="${Y(item.y)}" r="${(item.r * scale).toFixed(1)}" fill="#fff" stroke="#8a8a94" stroke-width="1.5"/>`;
    else if (item.t === "semi") {
      const angle = Math.atan2(-item.ny, -item.nx);
      const points = Array.from({ length: 17 }, (_, index) => {
        const theta = angle - Math.PI / 2 + Math.PI * index / 16;
        return `${(ox + (item.x + Math.cos(theta) * item.r - bounds.x0) * scale).toFixed(1)},${(oy + (item.y + Math.sin(theta) * item.r - bounds.y0) * scale).toFixed(1)}`;
      });
      body += `<polygon points="${points.join(" ")}" fill="#fff" stroke="#8a8a94" stroke-width="1.5" stroke-linejoin="round"/>`;
    } else if (item.t === "arrow") {
      const [ax, ay] = item.a;
      const [bx, by] = item.b;
      const [cx, cy] = item.c;
      const tangentX = bx - cx;
      const tangentY = by - cy;
      const length = Math.hypot(tangentX, tangentY) || 1;
      const ux = tangentX / length;
      const uy = tangentY / length;
      const head = 8 / scale;
      const tip = [bx, by];
      const left = [bx - ux * head - uy * head * 0.55, by - uy * head + ux * head * 0.55];
      const right = [bx - ux * head + uy * head * 0.55, by - uy * head - ux * head * 0.55];
      body += `<path d="M${X(ax)} ${Y(ay)}Q${X(cx)} ${Y(cy)} ${X(bx)} ${Y(by)}" fill="none" stroke="${UT.arrow}" stroke-width="2" stroke-linecap="round"/><polygon points="${[tip, left, right].map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")}" fill="${UT.arrow}"/>`;
    }
  }
  return { body, width: (bounds.x1 - bounds.x0) * scale, height: (bounds.y1 - bounds.y0) * scale };
}

function utBlockArrow(x, y) {
  return `<path d="M${x} ${y - 5}H${x + 12}V${y - 10}L${x + 22} ${y}L${x + 12} ${y + 10}V${y + 5}H${x}Z" fill="${UT.cut}"/>`;
}

function utLegendMarkup(legend, width, y) {
  const slot = 150;
  const start = (width - legend.length * slot) / 2;
  return legend.map((entry, index) => {
    const x = start + index * slot;
    const icon = entry.shape === "triangle"
      ? `<polygon points="${x + 6},${y + 4} ${x + 6},${y + 36} ${x + 38},${y + 36}" fill="${UT.pieceA}" stroke="${UT.ink}" stroke-width="1.4"/>`
      : `<polygon points="${x + 22},${y + 2} ${x + 42},${y + 20} ${x + 22},${y + 38} ${x + 2},${y + 20}" fill="${UT.pieceB}" stroke="${UT.ink}" stroke-width="1.4"/>`;
    return `${icon}${utText(x + 56, y + 20, ":", { size: 16 })}${utBox(x + 66, y + 4, 40, 32)}${entry.value == null ? "" : utText(x + 86, y + 21, entry.value, { size: 16, weight: 800 })}${utText(x + 116, y + 20, "개", { size: 15, weight: 700 })}`;
  }).join("");
}

function utFoldPanelsMarkup(visual) {
  const scale = visual.scale || 108;
  const gap = 36;
  const pad = 6;
  let x = pad;
  let height = 0;
  const rendered = visual.panels.map((panel, index) => {
    const bounds = utFoldPanelBounds(panel);
    const zoom = panel.zoom || 1;
    const panelScale = scale * zoom;
    const h = (bounds.y1 - bounds.y0) * panelScale;
    height = Math.max(height, h);
    const out = { panel, x, panelScale, h, w: (bounds.x1 - bounds.x0) * panelScale };
    x += out.w + (index < visual.panels.length - 1 ? gap : 0);
    return out;
  });
  const width = x + pad;
  let body = "";
  rendered.forEach((item, index) => {
    const oy = pad + (height - item.h) / 2;
    body += utFoldPanel(item.panel, item.x, oy, item.panelScale).body;
    if (index < rendered.length - 1) body += utBlockArrow(item.x + item.w + 7, pad + height / 2);
  });
  let total = height + pad * 2;
  if (visual.legend?.length) {
    body += utLegendMarkup(visual.legend, width, total + 4);
    total += 50;
  }
  return utSvg(Math.ceil(width), Math.ceil(total), "색종이를 접고 자르는 과정", body, Math.min(Math.ceil(width) * 1.15, 640));
}

function utCrossBoard(cx, cy, board, size = 30) {
  const spots = [["top", 0, -1], ["left", -1, 0], ["center", 0, 0], ["right", 1, 0], ["bottom", 0, 1]];
  return spots.map(([key, dx, dy]) => {
    const x = cx + dx * size - size / 2;
    const y = cy + dy * size - size / 2;
    const value = board?.[key];
    return `${utBox(x, y, size, size, { fill: key === "center" ? UT.card : "#fff", stroke: UT.box, radius: 1 })}${value == null ? "" : utText(x + size / 2, y + size / 2 + 1, value, { size: 15 })}`;
  }).join("");
}

function utSumSlot(cx, y, value) {
  return `${utText(cx - 34, y + 16, "합 :", { size: 14 })}${utBox(cx - 14, y, 44, 32)}${value == null ? "" : utText(cx + 8, y + 17, value, { size: 15, weight: 800 })}`;
}

function utCrossSetMarkup(visual) {
  const slot = 128;
  const width = slot * visual.boards.length + 8;
  const top = visual.cards?.length ? 44 : 6;
  const body = utCardsRow(visual.cards, width) + visual.boards.map((board, index) => {
    const cx = 4 + slot * index + slot / 2;
    return utCrossBoard(cx, top + 48, board) + utSumSlot(cx, top + 104, visual.sums?.[index]);
  }).join("");
  return utSvg(width, top + 142, "가운데 수가 다른 세 십자 마방진", body, 470);
}

function utFlowerBoard(cx, cy, board) {
  const radius = 40;
  const petals = Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 3;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
  const lines = petals.map(([x, y]) => `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${UT.box}" stroke-width="1.4"/>`).join("");
  const nodes = petals.map(([x, y], index) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="#fff" stroke="${UT.box}" stroke-width="1.6"/>${board?.petals?.[index] == null ? "" : utText(x.toFixed(1), (y + 0.5).toFixed(1), board.petals[index], { size: 13 })}`).join("");
  return `${lines}${nodes}<circle cx="${cx}" cy="${cy}" r="14" fill="${UT.card}" stroke="${UT.box}" stroke-width="1.8"/>${board?.center == null ? "" : utText(cx, cy + 0.5, board.center, { size: 14, weight: 800 })}`;
}

function utFlowerSetMarkup(visual) {
  const slot = 136;
  const width = slot * visual.boards.length + 8;
  const top = visual.cards?.length ? 44 : 6;
  const body = utCardsRow(visual.cards, width) + visual.boards.map((board, index) => {
    const cx = 4 + slot * index + slot / 2;
    return utFlowerBoard(cx, top + 58, board) + utSumSlot(cx, top + 116, visual.sums?.[index]);
  }).join("");
  return utSvg(width, top + 154, "가운데 수가 다른 세 원형진", body, 470);
}

const UT_RING8_SPOTS = Object.freeze([[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]);
function utRing8Markup(visual) {
  const size = 40;
  const step = 66;
  const width = Math.max(2 * step + size + 60, (visual.cards?.length || 0) * 34 + 8);
  const top = visual.cards?.length ? 46 : 8;
  const left = (width - (2 * step + size)) / 2;
  const center = (column, row) => [left + column * step + size / 2, top + row * step + size / 2];
  let body = utCardsRow(visual.cards, width, 4, 28);
  for (const [a, b] of [[0, 2], [2, 4], [4, 6], [6, 0]]) {
    const [x1, y1] = center(...UT_RING8_SPOTS[a]);
    const [x2, y2] = center(...UT_RING8_SPOTS[b]);
    body += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${UT.box}" stroke-width="1.4"/>`;
  }
  UT_RING8_SPOTS.forEach(([column, row], index) => {
    const x = left + column * step;
    const y = top + row * step;
    const value = visual.shown[index];
    body += `${utBox(x, y, size, size, { radius: 2 })}${value == null ? "" : utText(x + size / 2, y + size / 2 + 1, value, { size: 20, weight: 600 })}`;
  });
  return utSvg(Math.ceil(width), top + 2 * step + size + 6, "네 줄의 합이 같은 네모 둘레", body, 320);
}

const UT_TRIANGLE6_POINTS = Object.freeze([[110, 24], [70, 82], [150, 82], [30, 140], [110, 140], [190, 140]]);
function utTriangle6Markup(visual) {
  const p = UT_TRIANGLE6_POINTS;
  const lines = [[0, 3], [0, 5], [3, 5]].map(([a, b]) => `<line x1="${p[a][0]}" y1="${p[a][1]}" x2="${p[b][0]}" y2="${p[b][1]}" stroke="${UT.box}" stroke-width="1.5"/>`).join("");
  const nodes = p.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="19" fill="${[0, 3, 5].includes(index) ? UT.tint : "#fff"}" stroke="${UT.box}" stroke-width="1.7"/>${visual.shown[index] == null ? "" : utText(x, y + 1, visual.shown[index], { size: 17, weight: 700 })}`).join("");
  return utSvg(220, 164, "꼭짓점과 변에 수를 놓는 삼각진", lines + nodes, 210);
}

function utGakuroMarkup(visual) {
  const size = 46;
  const clue = 30;
  const top = visual.cards?.length ? 46 : 6;
  const left = 46;
  const width = left + 3 * size + 14;
  const cellX = (column) => left + column * size;
  const cellY = (row) => top + clue + row * size;
  let body = utCardsRow(visual.cards, Math.max(width, visual.cards?.length * 36 || 0), 4, 28);
  const firstRow = [0, 0, 1];
  const firstColumn = [0, 0, 1];
  visual.columnSums.forEach((value, column) => {
    const x = cellX(column);
    const y = cellY(firstRow[column]);
    body += `<polygon points="${x + 3},${y} ${x + size - 3},${y} ${x + size / 2},${y - clue + 2}" fill="#ffe9cc" stroke="${UT.cut}" stroke-width="1.5"/>${utText(x + size / 2, y - 9, value, { size: 14, weight: 800 })}`;
  });
  visual.rowSums.forEach((value, row) => {
    const x = cellX(firstColumn[row]);
    const y = cellY(row);
    body += `<polygon points="${x},${y + 3} ${x},${y + size - 3} ${x - clue + 2},${y + size / 2}" fill="#ffe9cc" stroke="${UT.cut}" stroke-width="1.5"/>${utText(x - 10, y + size / 2, value, { size: 14, weight: 800 })}`;
  });
  visual.mask.forEach((active, index) => {
    if (!active) return;
    const x = cellX(index % 3);
    const y = cellY(Math.floor(index / 3));
    body += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="${UT.box}" stroke-width="1.7"/>${visual.shown[index] == null ? "" : utText(x + size / 2, y + size / 2 + 1, visual.shown[index], { size: 20, weight: 600 })}`;
  });
  const svgWidth = Math.max(width, (visual.cards?.length || 0) * 34 + 8);
  return utSvg(Math.ceil(svgWidth), top + clue + 3 * size + 6, "가로줄과 세로줄의 합을 맞추는 수 퍼즐", body, 290);
}

function utEllipseMarkup(visual) {
  const top = visual.cards?.length ? 46 : 8;
  const cx = 120;
  const cy = top + 92;
  const r = 82;
  const spots = [[cx, cy - r], [cx - r, cy], [cx, cy], [cx + r, cy], [cx, cy + r]];
  let body = utCardsRow(visual.cards, 240, 4, 30);
  body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${UT.box}" stroke-width="1.5"/><line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="${UT.box}" stroke-width="1.5"/><line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${UT.box}" stroke-width="1.5"/>`;
  body += spots.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="18" fill="${index === 2 ? UT.card : "#fff"}" stroke="${UT.box}" stroke-width="1.7"/>${visual.shown[index] == null ? "" : utText(x, y + 1, visual.shown[index], { size: 17 })}`).join("");
  return utSvg(240, cy + r + 22, "원 둘레와 두 직선 위의 수", body, 230);
}

function utConditionsMarkup(visual) {
  const list = `<ul style="margin:0;padding:0 0 0 18px;display:grid;gap:5px">${visual.clues.map((clue) => `<li style="font-size:13px;font-weight:700;line-height:1.5;color:${UT.ink};word-break:keep-all">${esc(clue)}</li>`).join("")}</ul>`;
  const box = `<div style="width:min(100%,440px);padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:6px;background:#fdfbf5">${list}</div>`;
  if (!visual.places?.length) return `<div class="b1-ut-conditions" style="display:grid;place-items:center;width:100%">${box}</div>`;
  const size = 48;
  const body = visual.places.map((place, index) => `${utBox(4 + index * size, 4, size, 36, { fill: UT.card, stroke: UT.box, radius: 0 })}${utText(4 + index * size + size / 2, 23, place, { size: 14 })}${utBox(4 + index * size, 40, size, size, { radius: 0 })}`).join("");
  return `<div class="b1-ut-conditions" style="display:grid;place-items:center;gap:10px;width:100%">${box}${utSvg(visual.places.length * size + 8, 96, "자리 표", body, 170)}</div>`;
}

function utLogicMarkup(visual) {
  const clues = visual.clues?.length ? utConditionsMarkup({ clues: visual.clues }) : "";
  let svg;
  if (visual.layout === "columns") {
    const rowGap = 48;
    const height = visual.left.length * rowGap + 4;
    const body = visual.left.map((name, index) => {
      const y = 6 + index * rowGap;
      return `${utBox(10, y, 76, 34, { stroke: UT.line, radius: 7 })}${utText(48, y + 18, name, { size: 15 })}<circle cx="102" cy="${y + 17}" r="5" fill="${UT.dot}"/>`;
    }).join("") + visual.right.map((item, index) => {
      const y = 6 + index * rowGap;
      return `<circle cx="168" cy="${y + 17}" r="5" fill="${UT.dot}"/>${utBox(184, y, 76, 34, { stroke: UT.line, radius: 7 })}${utText(222, y + 18, item, { size: 15 })}`;
    }).join("");
    svg = utSvg(270, height, "사람과 짝을 잇는 그림", body, 270);
  } else {
    const count = visual.left.length;
    const slot = 72;
    const side = visual.ends ? 46 : 8;
    const width = side * 2 + count * slot;
    const body = visual.left.map((name, index) => {
      const x = side + index * slot;
      return `${utBox(x + 4, 6, slot - 8, 32, { stroke: UT.line, radius: 7 })}${utText(x + slot / 2, 23, name, { size: 14 })}<circle cx="${x + slot / 2}" cy="52" r="4.6" fill="${UT.dot}"/>`;
    }).join("") + visual.right.map((item, index) => {
      const x = side + index * slot;
      return `<circle cx="${x + slot / 2}" cy="94" r="4.6" fill="${UT.dot}"/>${utBox(x + 4, 106, slot - 8, 32, { stroke: UT.line, radius: 7 })}${utText(x + slot / 2, 123, item, { size: 14 })}`;
    }).join("") + (visual.ends ? `${utText(side / 2, 123, `(${visual.ends[0]})`, { size: 12, weight: 600 })}${utText(width - side / 2, 123, `(${visual.ends[1]})`, { size: 12, weight: 600 })}` : "");
    svg = utSvg(width, 144, "사람과 짝을 잇는 그림", body, Math.min(width, 380));
  }
  return `<div class="b1-ut-logic" style="display:grid;place-items:center;gap:10px;width:100%">${clues}${svg}</div>`;
}

export function book01Markup(visual) {
  if (!visual || visual.kind !== "book1") return "";
  if (visual.subtype === "ut-set") return utSetMarkup(visual);
  if (visual.subtype === "ut-partition") return utPartitionMarkup(visual);
  if (visual.subtype === "ut-digital-flip") return utDigitalFlipMarkup(visual);
  if (visual.subtype === "ut-digital-addition") return utDigitalAdditionMarkup(visual);
  if (visual.subtype === "ut-oriented-board") return utOrientedBoardMarkup(visual);
  if (visual.subtype === "ut-fold-panels") return utFoldPanelsMarkup(visual);
  if (visual.subtype === "ut-cross-set") return utCrossSetMarkup(visual);
  if (visual.subtype === "ut-flower-set") return utFlowerSetMarkup(visual);
  if (visual.subtype === "ut-ring8") return utRing8Markup(visual);
  if (visual.subtype === "ut-triangle6") return utTriangle6Markup(visual);
  if (visual.subtype === "ut-gakuro") return utGakuroMarkup(visual);
  if (visual.subtype === "ut-ellipse") return utEllipseMarkup(visual);
  if (visual.subtype === "ut-conditions") return utConditionsMarkup(visual);
  if (visual.subtype === "ut-logic") return utLogicMarkup(visual);
  if (visual.subtype === "shape-transform") return shapeTransformMarkup(visual);
  if (visual.subtype === "partition-draw") return partitionDrawMarkup(visual);
  if (visual.subtype === "digital-transform") return digitalTransformMarkup(visual);
  if (visual.subtype === "digital-rule-board") return digitalRuleBoardMarkup(visual);
  if (visual.subtype === "digital-orientation-board") return digitalOrientationBoardMarkup(visual);
  if (visual.subtype === "digital-related-addition") return digitalRelatedAdditionMarkup(visual);
  if (visual.subtype === "mirror-compass") return mirrorCompassMarkup(visual);
  if (visual.subtype === "arithmetic-list") return arithmeticListMarkup(visual);
  if (visual.subtype === "circle-magic") return circleMagicMarkup(visual);
  if (visual.subtype === "five-card-magic") return fiveCardMagicMarkup(visual);
  if (visual.subtype === "sum-grid") return sumGridMarkup(visual);
  if (visual.subtype === "ring-lines") return ringLinesMarkup(visual);
  if (visual.subtype === "line-card-board") return lineCardBoardMarkup(visual);
  if (visual.subtype === "digit-sum-table") return digitSumTableMarkup(visual);
  if (visual.subtype === "fold-choice-board") return foldChoiceBoardMarkup(visual);
  if (visual.subtype === "fold-number-sum") return foldNumberSumMarkup(visual);
  if (visual.subtype === "fold-landing") return foldLandingMarkup(visual);
  if (visual.subtype === "card-equation") return cardEquationMarkup(visual);
  if (visual.subtype === "condition-card") return conditionCardMarkup(visual);
  if (visual.subtype === "place-value-blocks") return placeValueBlocksMarkup(visual);
  if (visual.subtype === "equal-split-set") return equalSplitSetMarkup(visual);
  if (visual.subtype === "number-sequence") return numberSequenceMarkup(visual);
  if (visual.subtype === "logic-clues") return logicCluesMarkup(visual);
  if (visual.subtype === "order-line") return orderLineMarkup(visual);
  if (visual.subtype === "equalize-transfer") return equalizeTransferMarkup(visual);
  return "";
}
