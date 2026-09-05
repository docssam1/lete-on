const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const box = (value, className = "") => `<span class="${className}">${escapeHtml(value)}</span>`;

function balance(visual) {
  return `<div class="b8-balance">${visual.equations.map((equation, index) => `<div><b>저울 ${index + 1}</b><p>${equation.map((value) => box(value, value === "=" ? "equal" : "")).join("")}</p></div>`).join("")}</div>`;
}

function overlapCircles(visual) {
  const leftItems = visual.left.map((value, index) => `<text x="${102 + (index % 2) * 34}" y="${112 + Math.floor(index / 2) * 34}">${escapeHtml(value)}</text>`).join("");
  const rightItems = visual.right.map((value, index) => `<text class="${value === "?" ? "unknown" : ""}" x="${280 + (index % 2) * 34}" y="${112 + Math.floor(index / 2) * 34}">${escapeHtml(value)}</text>`).join("");
  return `<svg class="b8-svg b8-overlap" viewBox="0 0 440 245" role="img" aria-label="겹친 두 원의 합"><circle class="left" cx="165" cy="120" r="92"/><circle class="right" cx="275" cy="120" r="92"/><path class="shade" d="M220 44a92 92 0 0 1 0 152a92 92 0 0 1 0-152Z"/>${leftItems}${rightItems}<text class="overlap-value" x="220" y="127">${escapeHtml(visual.overlap)}</text><text class="caption" x="220" y="232">왼쪽 원의 합 = 오른쪽 원의 합</text></svg>`;
}

function symbolEquations(visual) {
  return `<div class="b8-symbol-equations">${visual.equations.map((equation) => `<p>${escapeHtml(equation)}</p>`).join("")}<strong>${escapeHtml(visual.target)} = ?</strong></div>`;
}

function matrix(visual) {
  const rowLabels = visual.rowLabels || visual.rows;
  const columnLabels = visual.columnLabels || visual.columns;
  return `<div class="b8-matrix-wrap"><table class="b8-matrix"><thead><tr><th>${escapeHtml(visual.operation || "+")}</th>${columnLabels.map((value) => `<th>${escapeHtml(value)}</th>`).join("")}</tr></thead><tbody>${visual.cells.map((row, rowIndex) => `<tr><th>${escapeHtml(rowLabels[rowIndex])}</th>${row.map((value, columnIndex) => `<td class="${rowIndex === visual.targetRow && columnIndex === visual.targetColumn ? "target" : ""}">${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>${visual.rowLabels ? `<small>가로값: ${visual.rowLabels.map((label, index) => `${label}=${visual.rows[index]}`).join(" · ")}<br>세로값: ${visual.columnLabels.map((label, index) => `${label}=${visual.columns[index]}`).join(" · ")}</small>` : ""}</div>`;
}

function sumMatrix(visual) {
  return `<div class="b8-sum-matrix" role="img" aria-label="가로와 세로의 합을 맞추는 3 곱하기 3 덧셈 매트릭스"><div class="cells">${visual.cells.flat().map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div><div class="rows">${visual.rowTotals.map((value) => `<b class="${value === "?" ? "target" : ""}">${escapeHtml(value)}</b>`).join("")}</div><div class="columns">${visual.columnTotals.map((value) => `<b class="${value === "?" ? "target" : ""}">${escapeHtml(value)}</b>`).join("")}</div></div>`;
}

function operationGrid(visual) {
  return `<div class="b8-operation-grid">${visual.rows.map((row) => `<p>${row.map((value) => box(value)).join("")}</p>`).join("")}<strong>${escapeHtml(visual.target)} = ?</strong></div>`;
}

function conditions(visual) {
  return `<div class="b8-conditions">${visual.conditions.map((condition, index) => `<p><b>${index + 1}</b><span>${escapeHtml(condition)}</span></p>`).join("")}<strong>${escapeHtml(visual.target)} = ?</strong></div>`;
}

function verticalBlock({ top, bottom, operator, result, note = "" }) {
  return `<div class="b8-vertical"><div><i></i><b>${escapeHtml(top)}</b></div><div><i>${escapeHtml(operator)}</i><b>${escapeHtml(bottom)}</b></div><hr><strong>${escapeHtml(result)}</strong>${note ? `<small>${escapeHtml(note)}</small>` : ""}</div>`;
}

function vertical(visual) {
  return verticalBlock(visual);
}

function verticalStack(visual) {
  return `<div class="b8-vertical">${visual.addends.map((addend, index) => `<div><i>${index === visual.addends.length - 1 ? "+" : ""}</i><b>${escapeHtml(addend)}</b></div>`).join("")}<hr><strong>${escapeHtml(visual.result)}</strong></div>`;
}

function linkedVertical(visual) {
  return `<div class="b8-linked-vertical">${visual.equations.map(verticalBlock).join("<i>→</i>")}</div>`;
}

function cards(visual) {
  return `<div class="b8-cards"><div>${visual.cards.map((value) => box(value)).join("")}</div><strong>${escapeHtml(visual.layout)} = ${escapeHtml(visual.target)}</strong>${visual.note ? `<small>${escapeHtml(visual.note)}</small>` : ""}</div>`;
}

function bars(visual) {
  const maxUnits = Math.max(...visual.bars.map((item) => Number(item.units || 1)));
  return `<div class="b8-bars">${visual.bars.map((item) => `<div><b>${escapeHtml(item.label)}</b><span style="--units:${item.units || 1};--max-units:${maxUnits}">${Array.from({ length: Number(item.units || 1) }, () => "<i></i>").join("")}${item.offset ? `<em>${item.offset > 0 ? "+" : "−"}${Math.abs(item.offset)}</em>` : ""}</span></div>`).join("")}${visual.facts ? `<p>${visual.facts.map(box).join("")}</p>` : ""}${visual.action ? `<strong>${escapeHtml(visual.action)}</strong>` : ""}</div>`;
}

function transfer(visual) {
  const finalValues = visual.finalValues || [];
  return `<div class="b8-transfer"><div class="people">${visual.people.map((person, index) => `<span><b>${escapeHtml(person.label)}</b><strong>${escapeHtml(person.value)}</strong>${finalValues[index] !== undefined ? `<small>마지막 ${escapeHtml(finalValues[index])}</small>` : ""}</span>`).join("")}</div><div class="steps">${visual.steps.map((step) => box(step)).join("<i>→</i>")}</div>${visual.final !== undefined ? `<p>마지막: 모두 ${escapeHtml(visual.final)}</p>` : ""}${visual.total !== undefined ? `<p>전체 ${escapeHtml(visual.total)}</p>` : ""}</div>`;
}

function process(visual) {
  return `<div class="b8-process"><strong>${escapeHtml(visual.start)}</strong>${visual.steps.map((step) => `<i>→</i>${box(step)}`).join("")}<i>→</i><strong>${escapeHtml(visual.result)}</strong>${visual.relation ? `<small>${escapeHtml(visual.relation)}</small>` : ""}</div>`;
}

function fractionParts(denominator, numerator, className = "") {
  return `<span class="fraction-parts ${className}" style="--parts:${denominator}">${Array.from({ length: denominator }, (_, index) => `<i class="${index < numerator ? "on" : ""}"></i>`).join("")}</span>`;
}

function fraction(visual) {
  return `<div class="b8-fraction">${fractionParts(visual.denominator, visual.numerator)}<p>${visual.label ? `${escapeHtml(visual.label)} · ` : ""}${visual.numerator}/${visual.denominator}${visual.shownValue !== undefined ? ` = ${escapeHtml(visual.shownValue)}` : ""}</p><strong>전체 ${escapeHtml(visual.whole)}${visual.unknown ? "개" : ""}</strong></div>`;
}

function fractionProcess(visual) {
  return `<div class="b8-fraction-process"><strong>${escapeHtml(visual.start)}</strong>${visual.steps.map((step) => `<i>→</i>${box(step)}`).join("")}<i>→</i><strong>${escapeHtml(visual.result)}개</strong></div>`;
}

function fractionPair(visual) {
  const denominators = visual.denominators || [visual.denominator, visual.denominator];
  return `<div class="b8-fraction-pair">${visual.numerators.map((numerator, index) => `<div><b>${index === 0 ? "가" : "나"} 모둠${visual.totals ? ` ${visual.totals[index]}명` : ""}</b>${fractionParts(denominators[index], numerator)}<span>${numerator}/${denominators[index]}</span></div>`).join("")}${visual.difference !== undefined ? `<strong>차 ${escapeHtml(visual.difference)}명</strong>` : ""}</div>`;
}

function table(visual) {
  return `<div class="b8-table"><table><thead><tr>${visual.headers.map((value) => `<th>${escapeHtml(value)}</th>`).join("")}</tr></thead><tbody>${visual.rows.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>${visual.notes?.map((note) => `<p>${escapeHtml(note)}</p>`).join("") || ""}</div>`;
}

export function book08Markup(visual) {
  if (!visual || visual.kind !== "book8") return "";
  switch (visual.subtype) {
    case "balance": return balance(visual);
    case "overlap-circles": return overlapCircles(visual);
    case "symbol-equations": return symbolEquations(visual);
    case "matrix": return matrix(visual);
    case "sum-matrix": return sumMatrix(visual);
    case "operation-grid": return operationGrid(visual);
    case "conditions": return conditions(visual);
    case "vertical": return vertical(visual);
    case "vertical-stack": return verticalStack(visual);
    case "linked-vertical": return linkedVertical(visual);
    case "cards": return cards(visual);
    case "bars": return bars(visual);
    case "transfer": return transfer(visual);
    case "process": return process(visual);
    case "fraction": return fraction(visual);
    case "fraction-process": return fractionProcess(visual);
    case "fraction-pair": return fractionPair(visual);
    case "table": return table(visual);
    default: return "";
  }
}
