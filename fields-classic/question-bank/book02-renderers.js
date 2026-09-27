// 더클래식 1과정 2권 전용 시각 자료. 교사용 원본의 문제 구조를 데이터로 다시 그린다.

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const SHAPES = Object.freeze({
  circle: "○", square: "□", triangle: "△", diamond: "◇", star: "☆", heart: "♡",
  "filled-circle": "●", "filled-square": "■", "filled-triangle": "▲",
  "filled-diamond": "◆", "filled-star": "★", "filled-heart": "♥"
});

function token(value, options = {}) {
  if (value == null || value === "?") return '<span class="b2-token blank" aria-label="빈칸">?</span>';
  if (value === "cross") return '<span class="b2-token shape cross-shape" role="img" aria-label="십자"></span>';
  const raw = SHAPES[value] || value;
  const shape = Object.hasOwn(SHAPES, value) || /^[○●□■△▲◇◆☆★♡♥]$/u.test(String(raw));
  return `<span class="b2-token${shape ? " shape" : ""}${options.known ? " known" : ""}">${esc(raw)}</span>`;
}

function expressionMarkup(expression) {
  if (Array.isArray(expression)) {
    return expression.map((piece) => {
      if (piece == null || piece === "?") return token(null);
      if (piece === "cross" || Object.hasOwn(SHAPES, piece)) return token(piece);
      return `<span class="b2-expression-text">${esc(piece)}</span>`;
    }).join("");
  }
  const pieces = String(expression).split(/(○|●|□|■|△|▲|◇|◆|☆|★|♡|♥|\?)/u);
  return pieces.map((piece) => {
    if (piece === "?") return token(null);
    if (/^[○●□■△▲◇◆☆★♡♥]$/u.test(piece)) return token(piece);
    return `<span class="b2-expression-text">${esc(piece)}</span>`;
  }).join("");
}

function splitTreeMarkup(visual) {
  const levels = visual.levels || [[visual.value]];
  return `<div class="b2-split-tree" role="img" aria-label="${esc(visual.value)}을 같은 수로 가르는 과정">${levels.map((level, index) => `<div class="level level-${index}">${level.map((value) => token(value, { known: index === 0 })).join("")}</div>`).join("")}<strong>${esc(visual.caption || "같은 수로 똑같이 나누어요")}</strong></div>`;
}

function matrixMarkup(visual) {
  if (visual.equations) {
    return `<div class="b2-equation-stack matrix-equations">${visual.equations.map((line) => `<div>${expressionMarkup(line)}</div>`).join("")}</div>`;
  }
  const rows = visual.cells.length;
  const columns = visual.cells[0]?.length || 1;
  const cells = visual.cells.flat().map((value) => `<span>${token(value)}</span>`).join("");
  const rowSums = (visual.rowSums || Array(rows).fill("")).map((value) => `<b>${value == null ? "?" : esc(value)}</b>`).join("");
  const columnSums = (visual.columnSums || Array(columns).fill("")).map((value) => `<b>${value == null ? "?" : esc(value)}</b>`).join("");
  return `<div class="b2-matrix-wrap" style="--rows:${rows};--columns:${columns}" role="img" aria-label="가로와 세로의 합을 이용하는 도형 표"><div class="b2-matrix">${cells}</div><div class="b2-row-sums">${rowSums}</div><div class="b2-column-sums">${columnSums}</div></div>`;
}

function transferMarkup(visual) {
  const maxDots = Math.min(18, Math.max(visual.left, visual.right));
  const dots = (count) => Array.from({ length: Math.min(count, maxDots) }, () => "<i></i>").join("");
  const moved = Number(visual.moved || 0);
  const left = visual.left - moved;
  const right = visual.right + moved;
  return `<div class="b2-transfer" role="img" aria-label="두 수의 차를 반으로 나누어 같은 수로 만드는 과정"><section><strong>${esc(visual.leftLabel || "A")}</strong><div>${dots(left)}</div><b>${left}</b></section><span class="b2-transfer-arrow">${moved ? `${moved}개 →` : "차이의 절반"}</span><section><strong>${esc(visual.rightLabel || "B")}</strong><div>${dots(right)}</div><b>${right}</b></section>${Math.max(visual.left, visual.right) > maxDots ? '<small>점은 양의 크기를 비교하는 모형입니다.</small>' : ""}</div>`;
}

function equationBoardMarkup(visual) {
  return `<div class="b2-equation-stack" role="img" aria-label="같은 수를 도형으로 나타낸 식">${(visual.lines || []).map((line) => `<div>${expressionMarkup(line)}</div>`).join("")}${visual.cards?.length ? `<div class="b2-number-cards">${visual.cards.map((value) => `<i>${esc(value)}</i>`).join("")}</div>` : ""}</div>`;
}

function balanceScaleMarkup(scale) {
  const tilt = scale.heavier === "left" ? -7 : scale.heavier === "right" ? 7 : 0;
  const load = (items, side) => `<div class="load ${side}">${items.map((item) => token(item)).join("")}</div>`;
  return `<div class="b2-scale" style="--tilt:${tilt}deg">${load(scale.left || [], "left")}${load(scale.right || [], "right")}<div class="beam"><i></i><i></i></div><div class="stand"></div></div>`;
}

function balanceMarkup(visual) {
  return `<div class="b2-balance-set" role="img" aria-label="양팔저울의 내려간 쪽을 비교하는 문제">${(visual.scales || []).map(balanceScaleMarkup).join("")}${visual.note ? `<strong>${esc(visual.note)}</strong>` : ""}</div>`;
}

function sequenceMarkup(visual) {
  const rows = visual.rows || [{ label: visual.label || "", values: visual.values || [] }];
  return `<div class="b2-sequence${visual.showOrdinals === false ? " no-ordinals" : ""}" role="img" aria-label="규칙에 따라 이어지는 수와 모양">${rows.map((row) => `<section>${row.label ? `<strong>${esc(row.label)}</strong>` : ""}<div>${(row.values || []).map((value, index) => `<span><b>${value == null ? "?" : esc(SHAPES[value] || value)}</b>${visual.showOrdinals === false ? "" : `<i>${index + 1}</i>`}</span>`).join("")}</div></section>`).join("")}${visual.target ? `<strong>${esc(visual.target)}</strong>` : ""}</div>`;
}

function houseGrowthMarkup(visual) {
  const house = (stage) => {
    const width = 20 + stage * 32;
    const walls = Array.from({ length: stage + 1 }, (_, index) => {
      const x = 10 + index * 32;
      return `<path d="M${x} 34V66"/>`;
    }).join("");
    const roofs = Array.from({ length: stage }, (_, index) => {
      const left = 10 + index * 32;
      return `<path d="M${left} 34L${left + 16} 10L${left + 32} 34"/>`;
    }).join("");
    return `<figure><svg viewBox="0 0 ${width} 72" aria-hidden="true">${walls}${roofs}<path d="M10 66H${10 + stage * 32}"/></svg><figcaption>${stage}번째</figcaption></figure>`;
  };
  return `<div class="b2-house-growth" role="img" aria-label="한 변을 함께 쓰며 늘어나는 성냥개비 집">${(visual.stages || []).map(house).join("")}<strong>${esc(visual.target)}번째는?</strong></div>`;
}

function triangleGrowthMarkup(visual) {
  const stage = (size) => `<figure><div class="b2-triangle-stage">${Array.from({ length: size }, (_, row) => `<span>${Array.from({ length: row * 2 + 1 }, (_, index) => `<i class="${index % 2 ? "dark" : "light"}"></i>`).join("")}</span>`).join("")}</div><figcaption>${size}번째</figcaption></figure>`;
  return `<div class="b2-triangle-growth" role="img" aria-label="흰 삼각형과 검은 삼각형이 한 줄씩 늘어나는 규칙">${(visual.stages || []).map(stage).join("")}<strong>${esc(visual.target)}번째의 차는?</strong></div>`;
}

function foldGrowthMarkup(visual) {
  const stage = (folds) => {
    const pieces = 2 ** Number(folds);
    const diagram = folds === 1
      ? '<rect x="15" y="8" width="70" height="58"/><path class="crease" d="M15 8L85 66"/><path class="fold-arrow" d="M30 54Q52 28 73 20"/>'
      : folds === 2
        ? '<path d="M18 66L50 8L82 66Z"/><path class="crease" d="M50 8V66"/><path class="fold-arrow" d="M27 55Q39 38 48 30"/>'
        : '<path d="M24 66L50 8L76 66Z"/><path class="crease" d="M37 37L63 37"/><path class="fold-arrow" d="M66 55Q54 45 49 38"/>';
    return `<figure><svg viewBox="0 0 100 74" aria-hidden="true">${diagram}</svg><figcaption>${folds}번 접기 · ${pieces}조각</figcaption></figure>`;
  };
  return `<div class="b2-fold-growth" role="img" aria-label="반으로 접을 때마다 조각 수가 두 배가 되는 과정">${(visual.stages || []).map(stage).join("")}<strong>${esc(visual.pieces)}조각은 몇 번?</strong></div>`;
}

function numberRuleMarkup(visual) {
  const operators = visual.operators || [];
  const target = visual.target || {};
  const rows = (visual.rows || []).map((row, rowIndex) => `<div>${row.map((value, columnIndex) => {
    const marked = target.row === rowIndex && target.column === columnIndex;
    const valueMarkup = token(value == null ? null : value);
    const operator = columnIndex < operators.length ? `<i>${esc(operators[columnIndex])}</i>` : "";
    return `<span class="${marked ? "target" : ""}">${valueMarkup}</span>${operator}`;
  }).join("")}</div>`).join("");
  return `<div class="b2-number-rule-rows ${visual.mode === "table" ? "table" : "equation"}" role="img" aria-label="각 줄에 같은 계산 규칙이 있는 수 표">${rows}</div>`;
}

function promiseSetMarkup(visual) {
  const layout = visual.layout === "diamond" ? "diamond" : "triangle";
  const figures = (visual.items || []).map((item) => `<figure><span class="top">${esc(item.top)}</span><span class="left">${esc(item.left)}</span><strong>${item.center == null ? "?" : esc(item.center)}</strong><span class="right">${esc(item.right)}</span>${layout === "diamond" ? `<span class="bottom">${esc(item.bottom)}</span>` : ""}</figure>`).join("");
  return `<div class="b2-promise-set ${layout}" role="img" aria-label="바깥 수의 같은 규칙으로 가운데 수를 찾는 문제">${figures}</div>`;
}

function stoneGrowthMarkup(visual) {
  const stageSvg = (stage) => {
    const points = [];
    const spacing = 16;
    for (let row = 0; row <= stage; row += 1) {
      for (let column = 0; column <= row; column += 1) {
        const boundary = row === stage || column === 0 || column === row;
        const x = 64 + (column - row / 2) * spacing;
        const y = 10 + row * 14;
        points.push(`<circle cx="${x}" cy="${y}" r="5" class="${boundary ? "black" : "white"}"/>`);
      }
    }
    return `<svg viewBox="0 0 128 ${stage * 14 + 22}" aria-hidden="true">${points.join("")}</svg>`;
  };
  const stages = (visual.stages || []).map((stage) => `<figure>${stageSvg(stage)}<figcaption>${stage}번째</figcaption></figure>`).join("");
  return `<div class="b2-stone-growth" role="img" aria-label="삼각형 둘레의 검은 돌과 안쪽 흰 돌이 늘어나는 과정">${stages}<strong>처음 흰 돌이 더 많은 단계는?</strong></div>`;
}

function growthMarkup(visual) {
  const stages = visual.stages || [];
  return `<div class="b2-growth ${esc(visual.form || "dots")}" role="img" aria-label="단계에 따라 개수가 변하는 규칙"><div>${stages.map((count, index) => `<figure><div>${Array.from({ length: Math.min(Number(count) || 0, 36) }, () => "<i></i>").join("")}</div><figcaption>${index + 1}단계 ${esc(count)}개</figcaption></figure>`).join("")}</div><strong>${esc(visual.rule || "개수의 변화를 살펴보세요")}</strong></div>`;
}

function promiseMarkup(visual) {
  const positions = visual.values || {};
  if (visual.layout === "square") {
    return `<div class="b2-promise square">${token(positions.topLeft)}${token(positions.topRight)}<strong>${positions.center == null ? "?" : esc(positions.center)}</strong>${token(positions.bottomLeft)}${token(positions.bottomRight)}</div>`;
  }
  if (visual.layout === "triangle") {
    return `<div class="b2-promise triangle"><span class="top">${token(positions.top)}</span><span class="left">${token(positions.left)}</span><strong>${positions.center == null ? "?" : esc(positions.center)}</strong><span class="right">${token(positions.right)}</span></div>`;
  }
  if (visual.layout === "row") {
    return `<div class="b2-promise row">${(visual.rows || []).map((row) => `<span>${row.map((value, index) => index === row.length - 1 ? `<strong>${value == null ? "?" : esc(value)}</strong>` : token(value)).join("<i>→</i>")}</span>`).join("")}</div>`;
  }
  return `<div class="b2-promise diamond"><span class="top">${token(positions.top)}</span><span class="left">${token(positions.left)}</span><span class="right">${token(positions.right)}</span><span class="bottom">${token(positions.bottom)}</span></div>`;
}

function sudokuMarkup(visual) {
  const size = visual.size || 3;
  const regionRows = visual.regionRows || (size === 4 ? 2 : 1);
  const regionColumns = visual.regionColumns || (size === 4 ? 2 : size);
  const regionMap = visual.regionMap;
  const letters = visual.letters || {};
  const cells = visual.cells.map((value, index) => {
    const row = Math.floor(index / size);
    const column = index % size;
    const classes = [];
    const hasRegionRight = regionMap
      ? column < size - 1 && regionMap[index] !== regionMap[index + 1]
      : (column + 1) % regionColumns === 0 && column < size - 1;
    const hasRegionBottom = regionMap
      ? row < size - 1 && regionMap[index] !== regionMap[index + size]
      : (row + 1) % regionRows === 0 && row < size - 1;
    if (hasRegionRight) classes.push("region-right");
    if (hasRegionBottom) classes.push("region-bottom");
    if (value == null) classes.push("blank");
    return `<span class="${classes.join(" ")}">${letters[index] ? `<small>${esc(letters[index])}</small>` : ""}${value == null ? "" : esc(value)}</span>`;
  }).join("");
  return `<div class="b2-sudoku" style="--size:${size}" role="img" aria-label="${size} 곱하기 ${size} 스도쿠 표">${cells}</div>`;
}

function fractionMarkup(visual) {
  const total = Number(visual.total || 1);
  const shaded = Number(visual.shaded || 0);
  if (visual.shape === "circle") {
    const angle = total ? shaded / total * 360 : 0;
    return `<div class="b2-fraction circle" style="--angle:${angle}deg"><i></i><strong>${shaded}/${total}</strong></div>`;
  }
  const cells = Array.from({ length: total }, (_, index) => `<i class="${index < shaded ? "shaded" : ""}"></i>`).join("");
  return `<div class="b2-fraction ${esc(visual.shape || "rectangle")}" style="--fraction-total:${total}">${cells}<strong>${shaded}/${total}</strong></div>`;
}

function foldFractionMarkup(visual) {
  const folds = Number(visual.folds || 0);
  const pieces = 2 ** folds;
  return `<div class="b2-fold-fraction" role="img" aria-label="색종이를 ${folds}번 접어 ${pieces}조각으로 나누는 과정"><div>${Array.from({ length: pieces }, (_, index) => `<i class="${index === 0 ? "shaded" : ""}"></i>`).join("")}</div><strong>${folds}번 접기 → 전체의 1/${pieces}</strong></div>`;
}

function multipleMarkup(visual) {
  const base = Number(visual.base || 2);
  const groups = Number(visual.groups || 1);
  const visibleGroups = Math.min(groups, 12);
  return `<div class="b2-multiple" role="img" aria-label="${base}의 배수와 같은 수 묶음"><div>${Array.from({ length: visibleGroups }, () => `<span>${Array.from({ length: Math.min(base, 5) }, () => "<i></i>").join("")}${base > 5 ? `<b>${base}개</b>` : ""}</span>`).join("")}</div><strong>${esc(visual.expression || `${base} × ${groups} = ${base * groups}`)}</strong>${groups > visibleGroups ? `<small>${groups}묶음 중 앞의 ${visibleGroups}묶음을 그렸습니다.</small>` : ""}</div>`;
}

export function book02Markup(visual) {
  if (!visual || visual.kind !== "book2") return "";
  if (visual.subtype === "split-tree") return splitTreeMarkup(visual);
  if (visual.subtype === "matrix") return matrixMarkup(visual);
  if (visual.subtype === "transfer") return transferMarkup(visual);
  if (visual.subtype === "equation") return equationBoardMarkup(visual);
  if (visual.subtype === "balance") return balanceMarkup(visual);
  if (visual.subtype === "sequence") return sequenceMarkup(visual);
  if (visual.subtype === "house-growth") return houseGrowthMarkup(visual);
  if (visual.subtype === "triangle-growth") return triangleGrowthMarkup(visual);
  if (visual.subtype === "fold-growth") return foldGrowthMarkup(visual);
  if (visual.subtype === "number-rule") return numberRuleMarkup(visual);
  if (visual.subtype === "promise-set") return promiseSetMarkup(visual);
  if (visual.subtype === "stone-growth") return stoneGrowthMarkup(visual);
  if (visual.subtype === "growth") return growthMarkup(visual);
  if (visual.subtype === "promise") return promiseMarkup(visual);
  if (visual.subtype === "sudoku") return sudokuMarkup(visual);
  if (visual.subtype === "fraction") return fractionMarkup(visual);
  if (visual.subtype === "fold-fraction") return foldFractionMarkup(visual);
  if (visual.subtype === "multiple") return multipleMarkup(visual);
  return "";
}
