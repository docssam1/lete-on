const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const symbols = ["●", "▲", "■", "★"];

function multiplicationMethods(visual) {
  const tens = Math.floor(visual.first / 10) * 10;
  const ones = visual.first % 10;
  return `<div class="b10-methods"><strong>${visual.first} × ${visual.second}</strong><div><span>넓이</span><span>${tens}×${visual.second}<br>+ ${ones}×${visual.second}</span><span>격자</span><span>세로셈</span></div></div>`;
}

const operation = (visual) => `<div class="b10-operation">${esc(visual.expression)}</div>`;

function factorPairs(visual) {
  return `<div class="b10-factor"><strong>${visual.target}</strong><div>${visual.pairs.map(([left]) => `<span>${left}</span><i>×</i><span class="blank"></span>`).join("")}</div></div>`;
}

function consecutiveTarget(visual) {
  return `<div class="b10-target"><strong>${visual.target}</strong><div>${Array.from({ length: Math.min(visual.slots || 4, 6) }, () => "<span></span>").join("")}</div></div>`;
}

function calendar(visual) {
  const headers = ["일", "월", "화", "수", "목", "금", "토"];
  const cells = [...Array(visual.dayOne).fill(null), ...Array.from({ length: visual.days }, (_, index) => index + 1)];
  while (cells.length % 7) cells.push(null);
  return `<div class="b10-calendar"><div class="head">${headers.map((day) => `<b>${day}</b>`).join("")}</div><div class="days">${cells.map((day) => `<span${visual.highlighted?.includes(day) ? ' class="on"' : ""}>${day || ""}</span>`).join("")}</div></div>`;
}

function pageStrip(visual) {
  return `<div class="b10-pages"><div>${Array.from({ length: Math.min(visual.count, 9) }, (_, index) => `<span>${index === 0 || index === visual.count - 1 ? "?" : "…"}</span>`).join("")}</div><strong>쪽수의 합 ${visual.total}</strong></div>`;
}

function numberStrip(visual) {
  return `<div class="b10-number-strip">${visual.values.map((value, index) => `<span>${value}</span>${index < visual.values.length - 1 ? `<i>+${visual.step}</i>` : ""}`).join("")}</div>`;
}

function numberGrid(visual) {
  const cols = visual.values[0].length;
  return `<div class="b10-number-grid" style="--cols:${cols}">${visual.values.flat().map((value, index) => `<span${visual.highlighted.includes(index) ? ' class="on"' : ""}>${value}</span>`).join("")}</div>`;
}

function calendarBlock(visual) {
  return `<div class="b10-calendar-block">${visual.values.map((value) => `<span>${value ?? "?"}</span>`).join("")}</div>`;
}

function placeValueCondition(visual) {
  return `<div class="b10-place-condition"><div><b>십의 자리 합</b><strong>${visual.tensSum}</strong></div><div><b>일의 자리 합</b><strong>${visual.onesSum}</strong></div><p>${Array.from({ length: visual.count }, () => "□ □").join("　")}</p></div>`;
}

function verticalAddition(visual) {
  return `<div class="b10-vertical">${visual.addends.map((value, index) => `<span>${index === visual.addends.length - 1 ? "+ " : ""}${esc(value)}</span>`).join("")}<strong>${visual.total}</strong></div>`;
}

function equationText(coefficients, labels) {
  const parts = coefficients.slice(0, labels.length).flatMap((count, index) => Array.from({ length: count }, () => symbols[index]));
  return parts.join(" + ");
}

function symbolEquations(visual) {
  return `<div class="b10-equations">${visual.equations.map(([first, second, total]) => `<p>${Array.from({ length: first }, () => symbols[0]).join(" ")} ${Array.from({ length: second }, () => symbols[1]).join(" ")} <b>= ${total}</b></p>`).join("")}</div>`;
}

function quantityEquations(visual) {
  const sourceSymbols = visual.symbols || [];
  const tokens = sourceSymbols.map((symbol, index) => {
    const label = esc(symbol.label ?? `모양 ${index + 1}`);
    const token = esc(symbol.token ?? "?");
    const className = symbol.className ? ` ${esc(symbol.className)}` : "";
    return `<span class="b10-quantity-symbol${className}" aria-label="${label}"><b>${token}</b><small>${label}</small></span>`;
  });
  const rows = (visual.equations || []).map((equation) => {
    const terms = (equation.terms || []).map((count, index) => {
      const symbol = sourceSymbols[index] || {};
      const label = esc(symbol.label ?? `모양 ${index + 1}`);
      const token = esc(symbol.token ?? "?");
      const className = symbol.className ? ` ${esc(symbol.className)}` : "";
      return `<span class="b10-quantity-term" aria-label="${label} ${esc(count)}개">${Array.from({ length: Number(count) || 0 }, () => `<b class="b10-quantity-piece${className}">${token}</b>`).join("")}</span>`;
    }).join('<i aria-hidden="true">+</i>');
    return `<div class="b10-quantity-equation" role="group" aria-label="저울 무게"><span class="b10-quantity-terms">${terms}</span><span class="b10-scale-reading"><i aria-hidden="true"></i><b>${esc(equation.total)}${visual.unit ? ` ${esc(visual.unit)}` : ""}</b></span></div>`;
  }).join("");
  return `<div class="b10-quantity-equations" role="img" aria-label="도형을 올린 저울과 무게"><div class="b10-quantity-legend">${tokens.join("")}</div>${rows}</div>`;
}

function targetScore(visual) {
  const zones = (visual.zones || []).map((zone, index) => `<span class="b10-target-zone zone-${index + 1}" aria-label="${esc(zone.label)}"></span>`).join("");
  const attempts = (visual.attempts || []).map((attempt) => {
    const hits = (attempt.hits || []).map((count, index) => `<span><strong>${esc(count)}</strong> × ${esc((visual.zones || [])[index]?.label ?? `구역 ${index + 1}`)}</span>`).join(" + ");
    const total = attempt.total;
    return `<div class="b10-target-attempt"><b>${esc(attempt.label)}</b><span>${hits}</span>${total !== undefined ? `<strong>= ${esc(total)}</strong>` : ""}</div>`;
  }).join("");
  return `<div class="b10-target-score"><div class="b10-target-board" role="img" aria-label="동심원 과녁"><div>${zones}</div><p>${(visual.zones || []).map((zone) => `<span>${esc(zone.label)}</span>`).join("")}</p></div><div class="b10-target-attempts">${attempts}</div></div>`;
}

function pairSumList(visual) {
  const labels = visual.labels || [];
  const tokens = visual.tokens || labels;
  const pairs = [[0, 1], [1, 2], [2, 0]];
  const term = (index) => `<span class="b10-pair-token"><b>${esc(tokens[index] ?? labels[index] ?? `문자 ${index + 1}`)}</b><small>${esc(labels[index] ?? `문자 ${index + 1}`)}</small></span>`;
  const rows = pairs.map(([left, right], index) => `<p>${term(left)} <i>+</i> ${term(right)} <i>=</i> <strong>${esc(visual.pairSums?.[index])}${esc(visual.unit || "")}</strong></p>`).join("");
  return `<div class="b10-pair-sum-list" role="img" aria-label="세 쌍의 합">${rows}</div>`;
}

function commerceEquation(visual) {
  if (visual.first && visual.second) {
    return `<div class="b10-commerce-equation" role="img" aria-label="두 물건의 가격과 개수 비교"><div><strong>${esc(visual.first.label)}</strong><span>${esc(visual.first.price)}원 × □개</span></div><b>=</b><div><strong>${esc(visual.second.label)}</strong><span>${esc(visual.second.price)}원 × (□+${esc(visual.extra)})개</span></div></div>`;
  }
  const item = esc(visual.item ?? "물건");
  const price = esc(visual.price);
  const extra = esc(visual.extraQuantity ?? visual.extra ?? 1);
  const comparison = esc(visual.comparison ?? "더 살 수 있습니다");
  return `<div class="b10-commerce-equation" role="img" aria-label="${item} 가격 비교"><div><strong>${item}</strong><span>${price}${esc(visual.unit ?? "원")}</span></div><i aria-hidden="true">+</i><div><strong>${extra}개</strong><span>${comparison}</span></div>${visual.total !== undefined ? `<b>= ${esc(visual.total)}${esc(visual.unit ?? "원")}</b>` : ""}</div>`;
}

function shareChangeUnknown(visual) {
  const original = esc(visual.originalShare ?? visual.oldShare);
  const added = esc(visual.addedPeople ?? visual.added);
  const updated = esc(visual.newShare ?? visual.updatedShare);
  return `<div class="b10-share-change-unknown" role="img" aria-label="사람 수와 나눔 변화"><div><span>처음</span><b>${original}${esc(visual.unit ?? "개")}</b></div><i aria-hidden="true">+ ${added}명</i><div><span>변경 후</span><b>${updated}${esc(visual.unit ?? "개")}</b></div></div>`;
}

const sharedEquations = (visual) => `<div class="b10-equations"><p>${symbols[0]} + ${symbols[1]} = <b>${visual.pair}</b></p><p>${symbols[0]} + ${symbols[1]} + ${symbols[2]} = <b>${visual.all}</b></p></div>`;

function containers(visual) {
  return `<div class="b10-containers"><p><i>빈 통</i><i>빈 통</i><b>${visual.emptyTotal}</b></p><p><i class="full">가득</i><i class="full">가득</i><b>${visual.fullTotal}</b></p></div>`;
}

function pairSums(visual) {
  const pairs = [[0, 1], [1, 2], [0, 2]];
  return `<div class="b10-equations">${pairs.map((pair, index) => `<p>${symbols[pair[0]]} + ${symbols[pair[1]]} = <b>${visual.pairSums[index]}</b></p>`).join("")}</div>`;
}

function spacingRing(visual) {
  const unit = esc(visual.unit || "m");
  return `<svg class="b10-ring" viewBox="0 0 320 190" role="img" aria-label="닫힌 운동장 둘레"><ellipse cx="160" cy="92" rx="120" ry="62"/><text x="160" y="78">둘레 ${esc(visual.perimeter)}${unit}</text><text x="160" y="108">${esc(visual.firstGap)}${unit}마다 / ${esc(visual.secondGap)}${unit}마다</text></svg>`;
}

const budgetTable = (visual) => `<table class="b10-table"><thead><tr><th>가진 돈</th><th>첫 물건</th><th>둘째 물건</th></tr></thead><tbody><tr><td>${visual.budget}천 원</td><td>${visual.firstPrice}천 원</td><td>${visual.secondPrice}천 원</td></tr></tbody></table>`;
const shareChange = (visual) => `<div class="b10-share"><span>${visual.oldPeople}명</span><b>+ ${visual.added}명</b><span>${visual.newPeople}명</span><strong>한 명당 ${visual.newShare}개</strong></div>`;

function catchUpTable(visual) {
  return `<table class="b10-table"><thead><tr><th></th><th>처음</th><th>하루마다</th></tr></thead><tbody>${visual.labels.map((label, index) => `<tr><th>${esc(label)}</th><td>${visual.starts[index]}</td><td>${visual.changes[index] > 0 ? "+" : ""}${visual.changes[index]} ${esc(visual.unit)}</td></tr>`).join("")}</tbody></table>`;
}

function distanceLine(visual) {
  return `<div class="b10-distance"><span>뒷사람<br>${visual.fastSpeed}m/분</span><i style="--gap:${Math.min(160, visual.distance * 4)}px"></i><span>앞사람<br>${visual.slowSpeed}m/분</span><strong>${visual.distance}m</strong></div>`;
}

function fourWeightSystem(visual) {
  return `<div class="b10-equations">${visual.equations.map((row) => `<p>${equationText(row, visual.labels)} <b>= ${row.at(-1)}</b></p>`).join("")}</div>`;
}

const delayedCatchUp = (visual) => `<div class="b10-timeline"><span>민수 시작</span><i>${visual.delay}개월</i><span>지우 시작</span><b>매달 ${visual.earlyRate} / ${visual.lateRate}만 원</b></div>`;

function digitSlots(visual) {
  const arrow = visual.direction ? `<b>${visual.direction === "increasing" ? "작은 숫자 → 큰 숫자" : "큰 숫자 → 작은 숫자"}</b>` : "";
  return `<div class="b10-digit-slots"><div class="cards">${visual.digits.map((digit) => `<span>${digit}</span>`).join("")}</div><div class="slots">${Array.from({ length: visual.length }, () => "<i></i>").join("")}</div>${arrow}</div>`;
}

function switches(visual) {
  return `<div class="b10-switches">${Array.from({ length: visual.switchCount }, (_, index) => `<span><i></i>전등 ${index + 1}</span>`).join("")}${visual.excludeAllOff ? "<b>모두 끈 모습 제외</b>" : ""}</div>`;
}

function targetCards(visual) {
  return `<div class="b10-target-cards"><div>${visual.cards.map((card) => `<span>${card}</span>`).join("")}</div><strong>${visual.pickCount}장 합 = ${visual.target}</strong></div>`;
}

const placeValueSum = (visual) => `<div class="b10-place-sum"><span>백</span><span>십</span><span>일</span><b>숫자 합 ${visual.target}</b>${visual.rank ? `<strong>작은 수부터 ${visual.rank}번째</strong>` : ""}</div>`;
const stepDigits = (visual) => `<div class="b10-step-digits"><span>□</span><i>같은 차</i><span>□</span><i>같은 차</i><span>□</span><b>${visual.limit} ${visual.direction ? "보다 작은 수" : "이하"}</b></div>`;

function routeStages(visual) {
  return `<div class="b10-routes"><span>출발</span>${visual.choices.map((count, index) => `<div>${Array.from({ length: count }, () => "<i></i>").join("")}<b>${index + 1}구간</b></div><span>→</span>`).join("")}<strong>도착</strong></div>`;
}

function lineupSlots(visual) {
  return `<div class="b10-lineup">${Array.from({ length: visual.people }, (_, index) => `<span>${visual.fixedFirst && index === 0 ? "민수" : index + 1}</span>`).join("")}</div>`;
}

function numberBaseball(visual) {
  return `<table class="b10-baseball"><thead><tr><th>말한 수</th><th>S</th><th>B</th></tr></thead><tbody>${visual.clues.map((clue) => `<tr><td>${clue.guess.join("")}</td><td>${clue.strikes}</td><td>${clue.balls}</td></tr>`).join("")}</tbody></table>`;
}

const digitRange = (visual) => `<div class="b10-digit-range"><strong>${visual.from}</strong><i>부터</i><strong>${visual.to}</strong><i>까지</i>${visual.digit !== null ? `<b>${esc(visual.digit)} 세기</b>` : ""}</div>`;

export function book10Markup(visual) {
  if (!visual || visual.kind !== "book10") return "";
  switch (visual.subtype) {
    case "multiplication-methods": return multiplicationMethods(visual);
    case "operation": return operation(visual);
    case "factor-pairs": return factorPairs(visual);
    case "consecutive-target": return consecutiveTarget(visual);
    case "calendar": return calendar(visual);
    case "page-strip": return pageStrip(visual);
    case "number-strip": return numberStrip(visual);
    case "number-grid": return numberGrid(visual);
    case "calendar-block": return calendarBlock(visual);
    case "place-value-condition": return placeValueCondition(visual);
    case "vertical-addition": return verticalAddition(visual);
    case "symbol-equations": return symbolEquations(visual);
    case "quantity-equations": return quantityEquations(visual);
    case "target-score": return targetScore(visual);
    case "pair-sum-list": return pairSumList(visual);
    case "commerce-equation": return commerceEquation(visual);
    case "share-change-unknown": return shareChangeUnknown(visual);
    case "shared-equations": return sharedEquations(visual);
    case "containers": return containers(visual);
    case "pair-sums": return pairSums(visual);
    case "spacing-ring": return spacingRing(visual);
    case "budget-table": return budgetTable(visual);
    case "share-change": return shareChange(visual);
    case "catch-up-table": return catchUpTable(visual);
    case "distance-line": return distanceLine(visual);
    case "four-weight-system": return fourWeightSystem(visual);
    case "delayed-catch-up": return delayedCatchUp(visual);
    case "digit-slots": return digitSlots(visual);
    case "switches": return switches(visual);
    case "target-cards": return targetCards(visual);
    case "place-value-sum": return placeValueSum(visual);
    case "step-digits": return stepDigits(visual);
    case "route-stages": return routeStages(visual);
    case "lineup-slots": return lineupSlots(visual);
    case "number-baseball": return numberBaseball(visual);
    case "digit-range": return digitRange(visual);
    default: return "";
  }
}
