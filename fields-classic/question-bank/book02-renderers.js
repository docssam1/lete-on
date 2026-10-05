// 더클래식 1과정 2권 전용 시각 자료. 교사용 원본의 문제 구조를 데이터로 다시 그린다.

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const SHAPES = Object.freeze({
  circle: "○", square: "□", triangle: "△", diamond: "◇", star: "☆", heart: "♡",
  "filled-circle": "●", "filled-square": "■", "filled-triangle": "▲",
  "filled-diamond": "◆", "filled-star": "★", "filled-heart": "♥"
});

// 도형마다 다른 색(원본 교재의 한 가지 하늘색 대신). 검은 도형·흰 도형은 색 규칙 문제용.
const SHAPE_COLORS = Object.freeze({ circle: "#f4877c", square: "#f9c74f", triangle: "#7cc57f", diamond: "#b39ddb", star: "#ffa94d", heart: "#f48fb1" });
const SHAPE_FILL = "#cfd8dc";
const SHAPE_DARK = "#222";
const SHAPE_STROKE = "#333";

// 원본 교재처럼 색칠한 도형을 SVG로 그린다. x, y는 중심, r은 반지름 크기.
export function shapeSvg(kind, x, y, r, options = {}) {
  const filled = String(kind).startsWith("filled-");
  const base = filled ? String(kind).slice(7) : String(kind);
  const fill = options.fill || (filled ? SHAPE_DARK : options.hollow ? "#fff" : SHAPE_COLORS[base] || SHAPE_FILL);
  const stroke = options.stroke || SHAPE_STROKE;
  const attrs = `fill="${fill}" stroke="${stroke}" stroke-width="${options.strokeWidth || 1.6}" stroke-linejoin="round"`;
  const n = (value) => Number(value.toFixed(2));
  if (base === "circle") return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.9)}" ${attrs}/>`;
  if (base === "square") return `<rect x="${n(x - r * 0.82)}" y="${n(y - r * 0.82)}" width="${n(r * 1.64)}" height="${n(r * 1.64)}" ${attrs}/>`;
  if (base === "triangle") return `<path d="M${n(x)} ${n(y - r)}L${n(x + r * 1.02)} ${n(y + r * 0.78)}H${n(x - r * 1.02)}Z" ${attrs}/>`;
  if (base === "diamond") return `<path d="M${n(x)} ${n(y - r)}L${n(x + r * 0.9)} ${n(y)}L${n(x)} ${n(y + r)}L${n(x - r * 0.9)} ${n(y)}Z" ${attrs}/>`;
  if (base === "star") {
    const points = Array.from({ length: 10 }, (_, index) => {
      const radius = index % 2 ? r * 0.45 : r;
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      return `${n(x + radius * Math.cos(angle))} ${n(y + radius * Math.sin(angle))}`;
    });
    return `<path d="M${points.join("L")}Z" ${attrs}/>`;
  }
  if (base === "heart") return `<path d="M${n(x)} ${n(y + r * 0.9)}C${n(x - r * 1.3)} ${n(y)} ${n(x - r * 0.9)} ${n(y - r * 1.05)} ${n(x)} ${n(y - r * 0.35)}C${n(x + r * 0.9)} ${n(y - r * 1.05)} ${n(x + r * 1.3)} ${n(y)} ${n(x)} ${n(y + r * 0.9)}Z" ${attrs}/>`;
  if (/^[A-Z]$/.test(base)) return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.92)}" fill="#e0e0e0" stroke="#333" stroke-width="1.6"/><text x="${n(x)}" y="${n(y + r * 0.36)}" text-anchor="middle" font-size="${n(r * 1.05)}" font-weight="700" fill="#111">${base}</text>`;
  return `<text x="${n(x)}" y="${n(y + r * 0.4)}" text-anchor="middle" font-size="${n(r * 1.2)}" font-weight="800" fill="#111">${esc(base)}</text>`;
}

const GLYPH_SHAPE = Object.freeze({ "○": "circle", "□": "square", "△": "triangle", "◇": "diamond", "☆": "star", "♡": "heart", "●": "filled-circle", "■": "filled-square", "▲": "filled-triangle", "◆": "filled-diamond", "★": "filled-star", "♥": "filled-heart" });
const SHAPE_NAMES = Object.freeze({ circle: "동그라미", square: "네모", triangle: "세모", diamond: "마름모", star: "별", heart: "하트" });

function shapeIcon(kind, size = 34, options = {}) {
  const draw = { hollow: options.hollow };
  const base = String(kind).replace(/^filled-/, "");
  const label = `${String(kind).startsWith("filled-") ? "색칠한 " : ""}${SHAPE_NAMES[base] || base}`;
  return `<svg class="b2-shape-icon${options.small ? " small" : ""}" viewBox="0 0 40 40" width="${size}" height="${size}" role="img" aria-label="${esc(label)}">${shapeSvg(kind, 20, 21, options.small ? 9 : 15, draw)}</svg>`;
}

function token(value, options = {}) {
  if (value == null || value === "?") return '<span class="b2-token blank" aria-label="빈칸">?</span>';
  if (value === "cross") return '<span class="b2-token shape cross-shape" role="img" aria-label="십자"></span>';
  const kind = Object.hasOwn(SHAPES, value) ? value : GLYPH_SHAPE[value];
  if (kind) return `<span class="b2-token shape drawn${options.known ? " known" : ""}">${shapeIcon(kind, 30)}</span>`;
  return `<span class="b2-token${options.known ? " known" : ""}">${esc(value)}</span>`;
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
  const cells = visual.cells.flat().map((value) => value === "none" ? '<span class="void"></span>' : `<span>${token(value)}</span>`).join("");
  const rowSums = (visual.rowSums || Array(rows).fill("")).map((value) => `<b>${value == null ? "?" : esc(value)}</b>`).join("");
  const columnSums = (visual.columnSums || Array(columns).fill("")).map((value) => `<b>${value == null ? "?" : esc(value)}</b>`).join("");
  return `<div class="b2-matrix-wrap" style="--rows:${rows};--columns:${columns}" role="img" aria-label="가로와 세로의 합을 이용하는 도형 표"><div class="b2-matrix${visual.cells.flat().includes("none") ? " has-void" : ""}">${cells}</div><div class="b2-row-sums">${rowSums}</div><div class="b2-column-sums">${columnSums}</div></div>`;
}

function transferMarkup(visual) {
  const maxDots = Math.min(18, Math.max(visual.left, visual.right));
  const dots = (count) => Array.from({ length: Math.min(count, maxDots) }, () => "<i></i>").join("");
  const moved = Number(visual.moved || 0);
  const left = visual.left - moved;
  const right = visual.right + moved;
  return `<div class="b2-transfer" role="img" aria-label="두 수의 차를 반으로 나누어 같은 수로 만드는 과정"><section><strong>${esc(visual.leftLabel || "A")}</strong><div>${dots(left)}</div><b>${left}</b></section><span class="b2-transfer-arrow">${moved ? `${moved}개 →` : "차이의 절반"}</span><section><strong>${esc(visual.rightLabel || "B")}</strong><div>${dots(right)}</div><b>${right}</b></section>${Math.max(visual.left, visual.right) > maxDots ? '<small>점은 양의 크기를 비교하는 모형입니다.</small>' : ""}</div>`;
}

// 합·차 문제: 큰 쪽 위에 차이 칸, 아래에 같은 크기 칸 두 개(원본 교사용 막대 그림 모양).
function sumDifferenceMarkup(visual) {
  const [bigLabel, smallLabel] = visual.labels || ["A", "B"];
  return `<div class="b2-sum-difference" role="img" aria-label="${esc(bigLabel)}가 ${esc(visual.difference)}만큼 더 많은 막대 그림"><div class="labels"><span>${esc(bigLabel)}</span><span>${esc(smallLabel)}</span></div><div class="bars"><span class="diff">${esc(visual.difference)}</span><span class="empty"></span><span></span><span></span></div>${visual.total != null ? `<strong>합 ${esc(visual.total)}${esc(visual.unit || "")}</strong>` : ""}</div>`;
}

function equationBoardMarkup(visual) {
  const cards = visual.cards?.length ? `<div class="b2-number-cards">${visual.cardsLabel ? `<span>${esc(visual.cardsLabel)}</span>` : ""}${visual.cards.map((value) => `<i>${esc(value)}</i>`).join("")}</div>` : "";
  return `<div class="b2-equation-stack" role="img" aria-label="같은 수를 도형으로 나타낸 식">${(visual.lines || []).map((line) => `<div>${expressionMarkup(line)}</div>`).join("")}${cards}</div>`;
}


function balanceScaleSvg(scale) {
  const tilt = scale.heavier === "left" ? -8 : scale.heavier === "right" ? 8 : 0;
  const rad = tilt * Math.PI / 180;
  const cx = 130;
  const cy = 98;
  const arm = 92;
  const end = (side) => ({ x: cx + side * arm * Math.cos(rad), y: cy + side * arm * Math.sin(rad) });
  const pan = (items, side) => {
    const { x, y } = end(side);
    const list = items || [];
    const perRow = list.length > 6 ? 4 : 3;
    const size = list.length > 6 ? 10 : 12;
    const shapes = list.map((item, index) => {
      const row = Math.floor(index / perRow);
      const inRow = Math.min(perRow, list.length - row * perRow);
      const column = index % perRow;
      const ix = x + (column - (inRow - 1) / 2) * size * 2.15;
      const iy = y - 14 - size - row * size * 2.05;
      return shapeSvg(item, ix, iy, size);
    }).join("");
    return `<path d="M${(x - 40).toFixed(1)} ${(y - 12).toFixed(1)}H${(x + 40).toFixed(1)}L${(x + 32).toFixed(1)} ${(y - 4).toFixed(1)}H${(x - 32).toFixed(1)}Z" class="pan"/><path d="M${x.toFixed(1)} ${(y - 4).toFixed(1)}V${y.toFixed(1)}" class="post"/>${shapes}`;
  };
  return `<svg class="b2-scale-svg" viewBox="0 0 260 150" aria-hidden="true"><path d="M118 146H142L136 108H124Z" class="stand"/><g><path d="M${(cx - arm).toFixed(1)} ${(cy - arm * Math.sin(rad)).toFixed(1)}L${(cx + arm).toFixed(1)} ${(cy + arm * Math.sin(rad)).toFixed(1)}" class="beam"/></g><circle cx="${cx}" cy="${cy}" r="6" class="pivot"/>${pan(scale.left, -1)}${pan(scale.right, 1)}</svg>`;
}

function balanceMarkup(visual) {
  return `<div class="b2-balance-set" role="img" aria-label="양팔저울 그림">${(visual.scales || []).map((scale) => `<figure class="b2-scale">${balanceScaleSvg(scale)}</figure>`).join("")}${visual.note ? `<strong>${esc(visual.note)}</strong>` : ""}</div>`;
}

function sequenceCell(value, hollow) {
  if (value == null) return '<b class="blank">?</b>';
  if (value && typeof value === "object") {
    if (Array.isArray(value.stack)) return `<b class="stack">${value.stack.map((kind) => shapeIcon(kind, 26, { hollow })).join("")}</b>`;
    if (value.shape) return `<b class="shape">${shapeIcon(value.shape, 34, { small: value.size === "small", hollow })}</b>`;
    if (Array.isArray(value.grid)) return `<b class="grid" style="--grid-columns:${value.grid[0]?.length || 1}">${value.grid.flat().map((cell) => `<em>${cell == null ? "" : esc(cell)}</em>`).join("")}</b>`;
  }
  const kind = Object.hasOwn(SHAPES, value) ? value : GLYPH_SHAPE[value];
  if (kind) return `<b class="shape">${shapeIcon(kind, 30, { hollow })}</b>`;
  return `<b>${esc(value)}</b>`;
}

function sequenceMarkup(visual) {
  const rows = visual.rows || [{ label: visual.label || "", values: visual.values || [] }];
  const ordinals = visual.showOrdinals !== false;
  const labels = visual.stageLabels;
  return `<div class="b2-sequence${ordinals || labels ? "" : " no-ordinals"}${visual.align === "bottom" ? " align-bottom" : ""}" role="img" aria-label="규칙에 따라 이어지는 수와 모양">${rows.map((row) => `<section>${row.label ? `<strong>${esc(row.label)}</strong>` : ""}<div>${(row.values || []).map((value, index) => `<span>${sequenceCell(value, visual.hollow)}${labels ? `<i>${esc(labels[index] ?? "")}</i>` : ordinals ? `<i>${index + 1}</i>` : ""}</span>`).join("")}${visual.more ? '<span class="more"><b>…</b></span>' : ""}</div></section>`).join("")}${visual.target ? `<strong>${esc(visual.target)}</strong>` : ""}</div>`;
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

// 성냥개비 한 개: 머리(빨간 점)가 있는 막대.
function match(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1}L${x2} ${y2}" class="stick"/><circle cx="${x2}" cy="${y2}" r="2.6" class="head"/>`;
}

function growthStageSvg(form, n) {
  const dots = (points, width, height, classOf = () => "") => `<svg viewBox="0 0 ${width} ${height}" width="${(width * 1.5).toFixed(0)}" height="${(height * 1.5).toFixed(0)}" aria-hidden="true">${points.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="5.2" class="dot ${classOf(index)}"/>`).join("")}</svg>`;
  if (form === "square-match") {
    const w = 26;
    let parts = match(4, 6, 4, 32);
    for (let i = 0; i < n; i += 1) {
      const x = 4 + i * w;
      parts += match(x + 3, 4, x + w - 3, 4) + match(x + 3, 34, x + w - 3, 34) + match(x + w, 6, x + w, 32);
    }
    return `<svg viewBox="0 0 ${n * w + 10} 40" aria-hidden="true">${parts}</svg>`;
  }
  if (form === "house-match") {
    const w = 28;
    let parts = match(4, 26, 4, 54);
    for (let i = 0; i < n; i += 1) {
      const x = 4 + i * w;
      parts += match(x + 1, 22, x + w / 2 - 1, 4) + match(x + w / 2 + 1, 4, x + w - 1, 22) + match(x + 3, 56, x + w - 3, 56) + match(x + w, 26, x + w, 54);
    }
    return `<svg viewBox="0 0 ${n * w + 10} 62" aria-hidden="true">${parts}</svg>`;
  }
  if (form === "triangle-match") {
    const w = 28;
    let parts = "";
    for (let i = 0; i < n; i += 1) {
      const up = i % 2 === 0;
      const x = 4 + Math.floor(i / 2) * w + (up ? 0 : w / 2);
      if (up) {
        if (i === 0) parts += match(x + 1, 30, x + w / 2 - 1, 5);
        parts += match(x + w / 2 + 1, 5, x + w - 1, 30) + match(x + 3, 33, x + w - 3, 33);
      } else {
        parts += match(x + 3, 3, x + w - 3, 3) + match(x + w / 2 + 1, 30, x + w - 1, 5);
      }
    }
    return `<svg viewBox="0 0 ${Math.ceil(n / 2) * w + 22} 38" aria-hidden="true">${parts}</svg>`;
  }
  if (form === "square-dots") {
    const points = [];
    for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) points.push([8 + c * 13, 8 + r * 13]);
    return dots(points, n * 13 + 3, n * 13 + 3);
  }
  if (form === "triangle-dots" || form === "triangle-border" || form === "triangle-color-difference") {
    const side = form === "triangle-dots" ? n : n + 1;
    const points = [];
    const kinds = [];
    for (let r = 0; r < side; r += 1) {
      for (let c = 0; c <= r; c += 1) {
        points.push([8 + (side - 1 - r) * 6.5 + c * 13, 8 + r * 11.5]);
        kinds.push(r === side - 1 || c === 0 || c === r ? "" : "white");
      }
    }
    if (form === "triangle-border") {
      const border = points.filter((_, index) => !kinds[index]);
      return dots(border, side * 13 + 3, side * 11.5 + 5);
    }
    return dots(points, side * 13 + 3, side * 11.5 + 5, (index) => form === "triangle-dots" ? "" : kinds[index]);
  }
  if (form === "paper-fold") {
    const sizes = [[60, 60], [30, 60], [30, 30], [15, 30], [15, 15]];
    const [w, h] = sizes[Math.min(n, sizes.length - 1)];
    const layers = n === 0 ? "" : `<rect x="7" y="3" width="${w}" height="${h}" class="paper back"/>`;
    return `<svg viewBox="0 0 70 68" width="84" height="82" aria-hidden="true">${layers}<rect x="4" y="6" width="${w}" height="${h}" class="paper"/></svg>`;
  }
  return "";
}

function growthMarkup(visual) {
  const stages = visual.stages || [];
  const form = visual.form || "dots";
  const drawn = ["square-match", "house-match", "triangle-match", "square-dots", "triangle-dots", "triangle-border", "triangle-color-difference", "paper-fold"].includes(form);
  if (!drawn) {
    return `<div class="b2-growth ${esc(form)}" role="img" aria-label="단계에 따라 개수가 변하는 규칙"><div>${stages.map((count, index) => `<figure><div>${Array.from({ length: Math.min(Number(count) || 0, 36) }, () => "<i></i>").join("")}</div><figcaption>${index + 1}단계 ${esc(count)}개</figcaption></figure>`).join("")}</div><strong>${esc(visual.rule || "개수의 변화를 살펴보세요")}</strong></div>`;
  }
  const count = visual.show || Math.min(stages.length || 4, 4);
  const first = form === "paper-fold" ? 0 : 1;
  const circled = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫";
  const figures = Array.from({ length: count }, (_, index) => {
    const n = index + first;
    const label = form === "paper-fold" ? (n === 0 ? "처음" : `${n}번 접기`) : circled[index];
    return `<figure>${growthStageSvg(form, n)}<figcaption>${label}</figcaption></figure>`;
  }).join("");
  return `<div class="b2-growth drawn ${esc(form)}" role="img" aria-label="단계에 따라 늘어나는 모양"><div>${figures}<span class="more">…</span></div>${visual.target ? `<strong>${esc(visual.target)}</strong>` : ""}</div>`;
}

function promiseFigure(layout, positions) {
  const cell = (value) => value == null ? token(null) : `<span class="b2-token">${esc(value)}</span>`;
  const center = (value) => `<strong>${value == null ? token(null) : esc(value)}</strong>`;
  if (layout === "square") return `<div class="b2-promise square"><span class="tl">${cell(positions.topLeft)}</span><span class="tr">${cell(positions.topRight)}</span>${center(positions.center)}<span class="bl">${cell(positions.bottomLeft)}</span><span class="br">${cell(positions.bottomRight)}</span></div>`;
  if (layout === "triangle") return `<div class="b2-promise triangle"><span class="top">${cell(positions.top)}</span><span class="left">${cell(positions.left)}</span>${center(positions.center)}<span class="right">${cell(positions.right)}</span></div>`;
  return `<div class="b2-promise diamond"><span class="top">${cell(positions.top)}</span><span class="left">${cell(positions.left)}</span><span class="right">${cell(positions.right)}</span><span class="bottom">${cell(positions.bottom)}</span></div>`;
}

function promiseMarkup(visual) {
  if (visual.layout === "row") {
    let blank = 0;
    const blankCell = () => {
      const label = visual.blankLabels?.[blank++];
      return label ? `<span class="b2-token blank" aria-label="빈칸 ${esc(label)}">${esc(label)}</span>` : token(null);
    };
    return `<div class="b2-promise row">${(visual.rows || []).map((row) => `<span>${row.map((value) => value == null ? blankCell() : `<b>${esc(value)}</b>`).join("<i></i>")}</span>`).join("")}</div>`;
  }
  const examples = (visual.examples || []).map((example) => promiseFigure(visual.layout, example)).join("");
  const problem = promiseFigure(visual.layout, visual.values || {});
  if (!examples) return problem;
  return `<div class="b2-promise-board" role="img" aria-label="약속을 지킨 예시 그림과 빈칸 문제"><div class="examples">${examples}</div><div class="problem">${problem}</div></div>`;
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

const FRACTION_FIGURES = Object.freeze({
  "circle-4": () => '<circle cx="100" cy="90" r="78" class="piece"/><path d="M100 90V12A78 78 0 0 1 178 90Z" class="piece shaded"/><path d="M100 12V168M22 90H178" class="line"/>',
  "grid-2x4": () => {
    const shaded = new Set(["0-1", "2-0", "3-1"]);
    let out = "";
    for (let r = 0; r < 4; r += 1) for (let c = 0; c < 2; c += 1) out += `<rect x="${40 + c * 60}" y="${12 + r * 40}" width="60" height="40" class="piece${shaded.has(`${r}-${c}`) ? " shaded" : ""}"/>`;
    return out;
  },
  "triangle-6": () => {
    const T = [100, 10], L = [10, 166], R = [190, 166], G = [100, 114];
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const mTL = mid(T, L), mTR = mid(T, R), mLR = mid(L, R);
    const pieces = [[T, mTL, G], [mTL, L, G], [L, mLR, G], [mLR, R, G], [R, mTR, G], [mTR, T, G]];
    return pieces.map((points, index) => `<path d="M${points.map((p) => p.join(" ")).join("L")}Z" class="piece${index === 0 ? "" : " shaded"}"/>`).join("");
  },
  "hexagram-12": () => {
    const c = [100, 96], r = 40;
    const hex = Array.from({ length: 6 }, (_, i) => [c[0] + r * Math.cos(Math.PI / 3 * i - Math.PI / 6 * 0), c[1] + r * Math.sin(Math.PI / 3 * i)]);
    const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    let out = "";
    for (let i = 0; i < 6; i += 1) {
      const a = hex[i], b = hex[(i + 1) % 6];
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const dx = mx - c[0], dy = my - c[1], len = Math.hypot(dx, dy);
      const apex = [mx + dx / len * r * 0.866, my + dy / len * r * 0.866];
      out += `<path d="M${f(c)}L${f(a)}L${f(b)}Z" class="piece"/>`;
      out += `<path d="M${f(a)}L${f(apex)}L${f(b)}Z" class="piece${apex[1] < c[1] - r ? " shaded" : ""}"/>`;
    }
    return out;
  },
  "tri-4": () => '<path d="M100 10L190 166H10Z" class="piece"/><path d="M100 10L145 88H55Z" class="piece shaded"/><path d="M55 88H145L100 166Z" class="line"/>',
  "tri-8": () => '<path d="M100 10L190 166H10Z" class="piece"/><path d="M100 10L145 88H100Z" class="piece shaded"/><path d="M55 88H145L100 166ZM100 10V88" class="line"/>',
  "tri-12": () => '<path d="M100 10L190 166H10Z" class="piece"/><path d="M100 10L145 88L100 62Z" class="piece shaded"/><path d="M55 88H145L100 166ZM100 10L100 62L55 88M100 62L145 88" class="line"/>',
  "tri-16": () => '<path d="M100 10L190 166H10Z" class="piece"/><path d="M100 10L122.5 49H77.5Z" class="piece shaded"/><path d="M55 88H145L100 166ZM77.5 49H122.5L100 88Z" class="line"/>'
});

function fractionMarkup(visual) {
  const figure = FRACTION_FIGURES[visual.figure];
  const blank = visual.blank ? '<span class="b2-frac-blank" aria-label="분수 빈칸"><i></i><b></b><i></i></span>' : "";
  if (figure) return `<div class="b2-fraction-figure" role="img" aria-label="색칠한 부분을 분수로 나타내는 그림"><svg viewBox="0 0 200 180" aria-hidden="true">${figure()}</svg>${blank}</div>`;
  const total = Number(visual.total || 1);
  const shaded = Number(visual.shaded || 0);
  if (visual.shape === "circle") {
    const point = (index) => {
      const angle = -Math.PI / 2 + index / total * Math.PI * 2;
      return `${(100 + 78 * Math.cos(angle)).toFixed(1)} ${(90 + 78 * Math.sin(angle)).toFixed(1)}`;
    };
    const slices = Array.from({ length: total }, (_, index) => `<path d="M100 90L${point(index)}A78 78 0 0 1 ${point(index + 1)}Z" class="piece${index < shaded ? " shaded" : ""}"/>`).join("");
    return `<div class="b2-fraction-figure" role="img" aria-label="원을 ${total}조각으로 똑같이 나눈 그림"><svg viewBox="0 0 200 180" aria-hidden="true">${total === 1 ? '<circle cx="100" cy="90" r="78" class="piece"/>' : slices}</svg></div>`;
  }
  const cells = Array.from({ length: total }, (_, index) => `<i class="${index < shaded ? "shaded" : ""}"></i>`).join("");
  return `<div class="b2-fraction ${esc(visual.shape || "rectangle")}" style="--fraction-total:${total}">${cells}</div>`;
}

function foldFractionMarkup(visual) {
  const style = visual.style || "half";
  const folds = Number(visual.folds || 0);
  const arrow = '<svg class="arrow" viewBox="0 0 40 20" aria-hidden="true"><path d="M3 10H33M27 4L35 10L27 16"/></svg>';
  const paper = (inner, w = 90) => `<svg class="paper-step" viewBox="0 0 ${w} 90" aria-hidden="true">${inner}</svg>`;
  // 점선(접는 선)은 그 다음에 접는 단계가 있을 때만 그린다(원본 교재와 같음).
  const crease = (index, path) => index < folds ? `<path d="${path}" class="crease"/>` : "";
  const half = [
    (i) => paper(`<rect x="5" y="5" width="80" height="80" class="paper"/>${crease(i, "M45 5V85")}`),
    (i) => paper(`<rect x="8" y="2" width="40" height="80" class="paper back"/><rect x="5" y="6" width="40" height="80" class="paper"/>${crease(i, "M5 46H45")}`, 60),
    (i) => paper(`<rect x="8" y="2" width="40" height="40" class="paper back"/><rect x="5" y="6" width="40" height="40" class="paper"/>${crease(i, "M25 6V46")}`, 60),
    (i) => paper(`<rect x="8" y="2" width="20" height="40" class="paper back"/><rect x="5" y="6" width="20" height="40" class="paper"/>${crease(i, "M5 26H25")}`, 40),
    () => paper('<rect x="8" y="2" width="20" height="20" class="paper back"/><rect x="5" y="6" width="20" height="20" class="paper"/>', 40)
  ];
  const diagonal = [
    (i) => paper(`<rect x="5" y="5" width="80" height="80" class="paper"/>${crease(i, "M5 5L85 85")}`),
    (i) => paper(`<path d="M3 4V84H83Z" class="paper back"/><path d="M5 6V86H85Z" class="paper"/>${crease(i, "M5 86L45 46")}`),
    (i) => paper(`<path d="M8 47L48 7L88 47Z" class="paper back"/><path d="M5 46L45 6L85 46Z" class="paper"/>${crease(i, "M45 6V46")}`),
    () => paper('<path d="M3 47L43 7V47Z" class="paper back"/><path d="M5 46L45 6V46Z" class="paper"/>', 60)
  ];
  const steps = (style === "diagonal" ? diagonal : half).slice(0, folds + 1).map((draw, index) => draw(index));
  // 원본 교재: 반 접기는 단계 사이에 직선 화살표, 대각선 접기는 화살표 없이 그림만 나란히.
  return `<div class="b2-fold-fraction" role="img" aria-label="색종이를 ${folds}번 접는 그림">${steps.join(style === "diagonal" ? "" : arrow)}</div>`;
}

function multipleMarkup(visual) {
  const base = Number(visual.base || 2);
  const groups = Number(visual.groups || 0);
  const expression = `<strong>${esc(visual.expression || `${base} × ${groups} = ${base * groups}`)}</strong>`;
  if (!groups || visual.showGroups === false) return `<div class="b2-multiple expression-only" role="img" aria-label="${base}의 배수 식">${expression}</div>`;
  const visibleGroups = Math.min(groups, 12);
  return `<div class="b2-multiple" role="img" aria-label="${base}의 배수와 같은 수 묶음"><div>${Array.from({ length: visibleGroups }, () => `<span>${Array.from({ length: Math.min(base, 5) }, () => "<i></i>").join("")}${base > 5 ? `<b>${base}개</b>` : ""}</span>`).join("")}</div>${expression}${groups > visibleGroups ? `<small>${groups}묶음 중 앞의 ${visibleGroups}묶음을 그렸습니다.</small>` : ""}</div>`;
}

export function book02Markup(visual) {
  if (!visual || visual.kind !== "book2") return "";
  if (visual.subtype === "split-tree") return splitTreeMarkup(visual);
  if (visual.subtype === "matrix") return matrixMarkup(visual);
  if (visual.subtype === "transfer") return transferMarkup(visual);
  if (visual.subtype === "equation") return equationBoardMarkup(visual);
  if (visual.subtype === "sum-difference") return sumDifferenceMarkup(visual);
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
