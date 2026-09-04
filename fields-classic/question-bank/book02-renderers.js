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
  const raw = SHAPES[value] || value;
  const shape = Object.hasOwn(SHAPES, value) || /^[○●□■△▲◇◆☆★♡♥]$/u.test(String(raw));
  return `<span class="b2-token${shape ? " shape" : ""}${options.known ? " known" : ""}">${esc(raw)}</span>`;
}

function expressionMarkup(expression) {
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
  return `<div class="b2-sequence" role="img" aria-label="규칙에 따라 이어지는 수와 모양"><div>${(visual.values || []).map((value, index) => `<span><b>${value == null ? "?" : esc(SHAPES[value] || value)}</b><i>${index + 1}</i></span>`).join("")}</div>${visual.target ? `<strong>${esc(visual.target)}</strong>` : ""}</div>`;
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
  if (visual.subtype === "growth") return growthMarkup(visual);
  if (visual.subtype === "promise") return promiseMarkup(visual);
  if (visual.subtype === "sudoku") return sudokuMarkup(visual);
  if (visual.subtype === "fraction") return fractionMarkup(visual);
  if (visual.subtype === "fold-fraction") return foldFractionMarkup(visual);
  if (visual.subtype === "multiple") return multipleMarkup(visual);
  return "";
}
