const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const valueBox = (value, className = "") => `<span class="${className}">${escapeHtml(value)}</span>`;

function calendarPath(visual) {
  const cards = visual.dates.map((item) => `<div><b>${item.month}월 ${item.date}일</b><span>${escapeHtml(item.weekday)}요일</span></div>`);
  return `<div class="b7-calendar-path">${cards.join("<i>→</i>")}<small>${visual.leap ? "윤년 · 2월 29일" : `날짜 차 ${visual.shifts?.join(" · ") || ""}일`}</small></div>`;
}

function weekdayRing(visual) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `<div class="b7-weekday-ring"><div>${days.map((day) => `<span class="${day === visual.start ? "start" : ""}">${day}</span>`).join("")}</div><strong>${escapeHtml(visual.start)}요일에서 ${visual.days}일 뒤</strong><em>?</em></div>`;
}

function timeEquation(visual) {
  return `<div class="b7-time-equation"><strong>${escapeHtml(visual.expression)}</strong></div>`;
}

function clockHandPoint(total, length, hourHand = false) {
  const normalized = ((Number(total) % 720) + 720) % 720;
  const minute = normalized % 60;
  const hour = Math.floor(normalized / 60);
  const angle = (hourHand ? (hour + minute / 60) * 30 : minute * 6) * Math.PI / 180;
  return { x: 90 + Math.sin(angle) * length, y: 82 - Math.cos(angle) * length };
}

function clockFace(item, index) {
  const hidden = String(item.label || "").includes("?");
  const hour = clockHandPoint(item.total, 34, true);
  const minute = clockHandPoint(item.total, 52, false);
  const ticks = Array.from({ length: 12 }, (_, tick) => {
    const angle = tick * Math.PI / 6;
    const x1 = 90 + Math.sin(angle) * 61;
    const y1 = 82 - Math.cos(angle) * 61;
    const x2 = 90 + Math.sin(angle) * 67;
    const y2 = 82 - Math.cos(angle) * 67;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join("");
  const transform = item.mirrored ? "translate(180 0) scale(-1 1)" : "";
  const hands = hidden ? `<text class="blank" x="90" y="91">?</text>` : `<line class="hour" x1="90" y1="82" x2="${hour.x}" y2="${hour.y}"/><line class="minute" x1="90" y1="82" x2="${minute.x}" y2="${minute.y}"/><circle class="pin" cx="90" cy="82" r="5"/>`;
  return `<svg class="b7-clock" viewBox="0 0 180 178" role="img" aria-label="${escapeHtml(item.label || `시계 ${index + 1}`)}"><g transform="${transform}"><circle cx="90" cy="82" r="70"/>${ticks}${hands}</g><text x="90" y="170">${escapeHtml(item.label || "시계")}</text></svg>`;
}

function clocks(visual) {
  return `<div class="b7-clocks">${visual.clocks.map(clockFace).join("")}</div>`;
}

function sequence(visual) {
  return `<div class="b7-sequence"><p>${visual.values.map((value) => valueBox(value)).join("<i>→</i>")}</p><strong>${visual.position === "?" ? "몇 번째?" : `${visual.position}번째`} · ${visual.step}씩</strong></div>`;
}

function sequenceTable(visual) {
  const rows = Array.isArray(visual.values?.[0]) ? visual.values : [visual.values];
  return `<div class="b7-sequence-table"><div class="indices"><b>순서</b>${visual.indices.map(valueBox).join("")}</div>${rows.map((row, index) => `<div><b>${rows.length > 1 ? `${index + 1}수열` : "수"}</b>${row.map(valueBox).join("")}</div>`).join("")}</div>`;
}

function reflectPoint(point, first, second) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const lengthSquared = dx * dx + dy * dy;
  const ratio = ((point.x - first.x) * dx + (point.y - first.y) * dy) / lengthSquared;
  const projected = { x: first.x + ratio * dx, y: first.y + ratio * dy };
  return { x: projected.x * 2 - point.x, y: projected.y * 2 - point.y };
}

function sharedPolygonChain(sides, count) {
  let current = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + Math.PI / sides + index * Math.PI * 2 / sides;
    return { x: Math.cos(angle) * 42, y: Math.sin(angle) * 42 };
  });
  const polygons = [current];
  for (let shape = 1; shape < count; shape += 1) {
    const edge = current.map((first, index) => ({ first, second: current[(index + 1) % sides], score: first.x + current[(index + 1) % sides].x })).sort((a, b) => b.score - a.score)[0];
    current = current.map((point) => reflectPoint(point, edge.first, edge.second));
    polygons.push(current);
  }
  const all = polygons.flat();
  return {
    polygons,
    minX: Math.min(...all.map((point) => point.x)), maxX: Math.max(...all.map((point) => point.x)),
    minY: Math.min(...all.map((point) => point.y)), maxY: Math.max(...all.map((point) => point.y))
  };
}

function matchsticks(visual) {
  const shown = Math.min(visual.shown || 4, 4);
  const chain = sharedPolygonChain(visual.sides, shown);
  const padding = 16;
  const width = chain.maxX - chain.minX + padding * 2;
  const height = chain.maxY - chain.minY + 52;
  const polygons = chain.polygons.map((points) => `<polygon points="${points.map(({ x, y }) => `${x - chain.minX + padding},${y - chain.minY + padding}`).join(" ")}"/>`).join("");
  return `<svg class="b7-svg b7-matchsticks" viewBox="0 0 ${width} ${height}" role="img" aria-label="한 변씩 맞닿은 정다각형">${polygons}<text x="${width / 2}" y="${height - 8}">이 모양을 ${visual.count}개까지 이어 붙이기</text></svg>`;
}

function division(visual) {
  return `<div class="b7-division"><span>${escapeHtml(visual.quotient)}</span><div><b>${visual.divisor}</b><i>${visual.dividend}</i></div><em>나머지 ${escapeHtml(visual.remainder)}</em></div>`;
}

function equation(visual) {
  return `<div class="b7-equation"><strong>${escapeHtml(visual.expression)}</strong></div>`;
}

function assumptionTable(visual) {
  const unit = (value) => typeof value === "number" && value < 0 ? `−${Math.abs(value)}` : value;
  return `<div class="b7-assumption"><div><b>종류</b>${visual.labels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}</div><div><b>하나당</b>${visual.units.map((value) => `<span>${escapeHtml(unit(value))}${typeof value === "number" ? escapeHtml(visual.unitName || "") : ""}</span>`).join("")}</div><p>${visual.base ? `처음 ${visual.base}점 · ` : ""}전체 ${escapeHtml(visual.totalCount)} · 합 ${escapeHtml(visual.totalUnits)}${escapeHtml(visual.unitName || "")}</p></div>`;
}

function conditionList(visual) {
  return `<div class="b7-condition-list">${visual.conditions.map((condition, index) => `<p><b>${index + 1}</b><span>${escapeHtml(condition)}</span></p>`).join("")}</div>`;
}

function growthDots(visual) {
  return `<div class="b7-growth">${visual.counts.map((count, index) => `<div><span>${Array.from({ length: Math.min(count, 20) }, () => "<i></i>").join("")}</span><b>${index + 1}번째 · ${count}개</b></div>`).join("")}<strong>… ${visual.position}번째</strong></div>`;
}

function climb(visual) {
  const marks = Array.from({ length: Math.min(visual.days, 8) }, (_, index) => `<i style="--level:${index + 1}">${index + 1}</i>`).join("");
  return `<div class="b7-climb"><div>${marks}<span>꼭대기 ${visual.height}m</span></div><p>낮 +${visual.climb}m · 밤 −${visual.slip}m</p></div>`;
}

function exchange(visual) {
  return `<div class="b7-exchange"><strong>처음 ${visual.initial}병</strong><i>→</i><span>빈 병 ${visual.rate}개</span><i>→</i><b>새 음료 1병</b><small>더 바꿀 수 없을 때까지</small></div>`;
}

function doubling(visual) {
  const labels = [];
  if (visual.start !== undefined) labels.push(`<span>첫날<br><b>${escapeHtml(visual.start)}개</b></span>`);
  if (visual.compareStart !== undefined) labels.push(`<span>다른 시작<br><b>${visual.compareStart}개</b></span>`);
  if (visual.targetDay !== undefined) labels.push(`<span>${visual.targetDay}일째<br><b>${visual.target ?? "?"}</b></span>`);
  labels.push(`<span>${visual.fullDay ?? visual.normalDay}일째<br><b>${visual.full ?? "가득"}</b></span>`);
  return `<div class="b7-doubling">${labels.join("<i>두 배 →</i>")}</div>`;
}

function polygonPointVisual(visual) {
  const sides = visual.sides;
  const pointsPerSide = Number(visual.pointsPerSide) || 5;
  const vertices = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / sides;
    return { x: 170 + Math.cos(angle) * 90, y: 105 + Math.sin(angle) * 78 };
  });
  const dots = [];
  vertices.forEach((from, index) => {
    const to = vertices[(index + 1) % sides];
    for (let step = 0; step < Math.min(pointsPerSide - 1, 9); step += 1) {
      const ratio = step / Math.min(pointsPerSide - 1, 9);
      dots.push(`<circle cx="${from.x + (to.x - from.x) * ratio}" cy="${from.y + (to.y - from.y) * ratio}" r="4"/>`);
    }
  });
  const target = visual.targetSides ? `<text x="290" y="202">→ 정${visual.targetSides}각형</text>` : "";
  return `<svg class="b7-svg b7-polygon-points" viewBox="0 0 340 220" role="img" aria-label="정다각형 둘레의 점"><polygon points="${vertices.map(({ x, y }) => `${x},${y}`).join(" ")}"/>${dots.join("")}<text x="170" y="208">한 변 ${escapeHtml(visual.pointsPerSide)}개</text>${target}</svg>`;
}

function perimeterLoop(visual) {
  return `<div class="b7-perimeter-loop"><span>${Array.from({ length: 12 }, (_, index) => `<i style="--n:${index}"></i>`).join("")}</span><p>간격 ${visual.spacing}m · ${visual.count === "?" ? "개수 ?" : `${visual.count}개`} · 둘레 ${escapeHtml(visual.perimeter)}m</p></div>`;
}

function betweenLoop(visual) {
  return `<div class="b7-between-loop"><span class="old">●</span>${Array.from({ length: Math.min(visual.newPerGap, 5) }, () => "<i>○</i>").join("")}<span class="old">●</span><strong>이런 사이가 ${visual.oldCount}곳</strong></div>`;
}

function innerOuter(visual) {
  return `<div class="b7-inner-outer" style="--ratio:${Math.max(38, visual.innerWidth / visual.outerWidth * 75)}%"><span><i></i></span><p>바깥 ${visual.outerWidth}m × ${visual.outerHeight}m<br>안쪽 ${visual.innerWidth}m × ${visual.innerHeight}m<br>${visual.spacing}m 간격</p></div>`;
}

function palindromeList(visual) {
  const digits = Math.min(visual.digits || 3, 6);
  const explicitPattern = Array.isArray(visual.examples) && visual.examples.length === digits && visual.examples.every((value) => ["□", "○", "△"].includes(value));
  const symbols = ["가", "나", "다"];
  const pattern = explicitPattern ? visual.examples : Array.from({ length: digits }, (_, index) => symbols[Math.min(index, digits - 1 - index)]);
  return `<div class="b7-palindrome"><div>${pattern.map((value) => valueBox(value)).join("")}</div><p>${(visual.examples || []).map((value) => `<b>${escapeHtml(value)}</b>`).join(" · ")}</p>${visual.targetSum ? `<strong>자리 합 ${visual.targetSum}</strong>` : ""}${visual.adjacentDifference ? `<strong>이웃한 차 ${visual.adjacentDifference}</strong>` : ""}</div>`;
}

function reverseDigits(visual) {
  if (visual.mode === "add") return `<div class="b7-reverse-digits"><p><span>${visual.value}</span><i>+</i><span>${visual.reversed}</span><i>=</i><b>?</b></p></div>`;
  if (visual.mode === "kaprekar") return `<div class="b7-reverse-digits"><p><span>${visual.value}</span><i>→</i><b>큰 수 − 작은 수</b><i>→</i><strong>495</strong></p></div>`;
  return `<div class="b7-reverse-digits"><p><span>십의 자리</span><i>↔</i><span>일의 자리</span></p><strong>두 수의 차 ${visual.difference}</strong>${visual.range ? `<em>${visual.range[0]} &lt; 두 수의 합 &lt; ${visual.range[1]}</em>` : ""}</div>`;
}

function distanceLine(visual) {
  const width = 500;
  const left = 38;
  const gap = (width - left * 2) / (visual.labels.length - 1);
  const nodes = visual.labels.map((label, index) => `<g><circle cx="${left + gap * index}" cy="82" r="6"/><text x="${left + gap * index}" y="118">${label}</text></g>`).join("");
  return `<svg class="b7-svg b7-distance" viewBox="0 0 ${width} 145" role="img" aria-label="일직선 위 점 사이 거리"><line x1="${left}" y1="82" x2="${width - left}" y2="82"/>${nodes}<text x="135" y="32">왼쪽 묶음 ${visual.leftSpan}m</text><text x="365" y="52">오른쪽 묶음 ${visual.rightSpan}m</text><text x="250" y="140">겹친 거리 ${visual.overlap}m</text></svg>`;
}

function venn(visual) {
  const label = (value) => value === "?" ? "?" : `${value}명`;
  const total = visual.total ? `<text class="caption" x="62" y="195">전체 ${visual.total}명</text>` : "";
  return `<svg class="b7-svg b7-venn" viewBox="0 0 420 230" role="img" aria-label="두 집합 벤다이어그램"><rect x="15" y="15" width="390" height="195" rx="8"/><circle cx="170" cy="112" r="78"/><circle cx="250" cy="112" r="78"/><text x="120" y="112">${label(visual.leftOnly)}</text><text class="overlap" x="210" y="112">${label(visual.overlap)}</text><text x="300" y="112">${label(visual.rightOnly)}</text><text x="362" y="190">밖 ${label(visual.neither)}</text><text class="caption" x="135" y="32">${escapeHtml(visual.labels?.[0] || "가")} ${visual.leftTotal}명</text><text class="caption" x="285" y="32">${escapeHtml(visual.labels?.[1] || "나")} ${visual.rightTotal}명</text>${total}</svg>`;
}

function twoWayTable(visual) {
  return `<div class="b7-two-way"><table><tbody><tr><th></th><th>가</th><th>나</th><th>합</th></tr>${visual.cells.map((row, index) => `<tr><th>${index ? "둘째" : "첫째"}</th>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}<td>${visual.rowTotals[index]}</td></tr>`).join("")}<tr><th>합</th>${visual.columnTotals.map((value) => `<td>${value}</td>`).join("")}<td>${visual.rowTotals[0] + visual.rowTotals[1]}</td></tr></tbody></table></div>`;
}

function stoneGrid(points) {
  const set = new Set(points.map(([x, y]) => `${x}:${y}`));
  return `<div class="grid">${Array.from({ length: 25 }, (_, index) => `<i class="${set.has(`${index % 5}:${Math.floor(index / 5)}`) ? "on" : ""}"></i>`).join("")}</div>`;
}

function stoneMove(visual) {
  return `<div class="b7-stone-move"><span>${stoneGrid(visual.initial)}<b>처음</b></span><i>→</i><span>${stoneGrid(visual.target)}<b>목표</b></span></div>`;
}

function threeCircles(visual) {
  const suffix = [visual.top, visual.leftOverlap, visual.rightOverlap, visual.hiddenSide].join("-");
  const leftMask = `b7-left-only-${suffix}`;
  const rightMask = `b7-right-only-${suffix}`;
  const shadedMask = visual.hiddenSide === "left" ? leftMask : rightMask;
  return `<svg class="b7-svg b7-three-circles" viewBox="0 0 420 285" role="img" aria-label="아래 두 원의 합이 같은 세 원"><defs><mask id="${leftMask}"><rect width="420" height="260" fill="black"/><circle cx="155" cy="175" r="78" fill="white"/><circle cx="210" cy="92" r="78" fill="black"/><circle cx="265" cy="175" r="78" fill="black"/></mask><mask id="${rightMask}"><rect width="420" height="260" fill="black"/><circle cx="265" cy="175" r="78" fill="white"/><circle cx="210" cy="92" r="78" fill="black"/><circle cx="155" cy="175" r="78" fill="black"/></mask></defs><rect class="shade" width="420" height="260" mask="url(#${shadedMask})"/><circle class="top" cx="210" cy="92" r="78"/><circle class="left" cx="155" cy="175" r="78"/><circle class="right" cx="265" cy="175" r="78"/><text x="210" y="62">${visual.top}</text><text x="164" y="125">${visual.leftOverlap}</text><text x="256" y="125">${visual.rightOverlap}</text><text class="left-value" x="115" y="205">${escapeHtml(visual.leftExclusive)}</text><text class="right-value" x="305" y="205">${escapeHtml(visual.rightExclusive)}</text><text class="caption" x="210" y="276">아래 왼쪽 원의 합 = 아래 오른쪽 원의 합</text></svg>`;
}

export function book07Markup(visual) {
  if (!visual || visual.kind !== "book7") return "";
  switch (visual.subtype) {
    case "calendar-path": return calendarPath(visual);
    case "weekday-ring": return weekdayRing(visual);
    case "time-equation": return timeEquation(visual);
    case "clock":
    case "clock-pair":
    case "mirror-clock": return clocks(visual);
    case "sequence": return sequence(visual);
    case "sequence-table": return sequenceTable(visual);
    case "matchsticks": return matchsticks(visual);
    case "division": return division(visual);
    case "equation": return equation(visual);
    case "assumption-table": return assumptionTable(visual);
    case "condition-list": return conditionList(visual);
    case "growth-dots": return growthDots(visual);
    case "climb": return climb(visual);
    case "exchange": return exchange(visual);
    case "doubling": return doubling(visual);
    case "polygon-points": return polygonPointVisual(visual);
    case "perimeter-loop": return perimeterLoop(visual);
    case "between-loop": return betweenLoop(visual);
    case "inner-outer": return innerOuter(visual);
    case "palindrome-list": return palindromeList(visual);
    case "reverse-digits": return reverseDigits(visual);
    case "distance-line": return distanceLine(visual);
    case "venn": return venn(visual);
    case "two-way-table": return twoWayTable(visual);
    case "stone-move": return stoneMove(visual);
    case "three-circles": return threeCircles(visual);
    default: return "";
  }
}
