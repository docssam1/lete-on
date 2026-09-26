import { BOOK06_WORKBOOK_FAMILIES } from "./golden-bell-book06-workbook.js?v=20260920d";

const PHASES = Object.freeze(["given", "organize", "calculate", "verify"]);
const COLOR = Object.freeze({
  given: "#187fa9",
  action: "#d39b20",
  verify: "#16734b",
  ink: "#233746",
  muted: "#b9c5cc"
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fail(family, message) {
  throw new Error(`Book 6 ${family}: ${message}`);
}

function integer(value, family, label, minimum = 0) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < minimum) fail(family, `${label} is invalid.`);
  return number;
}

function phaseFor(beat, step) {
  const named = String(beat?.phase || "").toLowerCase();
  if (PHASES.includes(named)) return named;
  if (beat?.action === "verify") return "verify";
  if (beat?.action === "calculate") return "calculate";
  if (beat?.action === "transform") return "organize";
  return PHASES[Math.max(0, Math.min(Number(step) || 0, PHASES.length - 1))];
}

function digitOccurrences(start, end, digit) {
  let total = 0;
  for (let value = start; value <= end; value += 1) {
    total += [...String(value)].filter((character) => Number(character) === digit).length;
  }
  return total;
}

export function book06GuidedResult(experience) {
  const family = experience?.family || "unknown";
  const model = experience?.model || {};
  switch (family) {
    case "book06-number-line": {
      const start = integer(model.start, family, "start");
      const end = integer(model.end, family, "end", start + 1);
      const intervals = integer(model.intervals, family, "intervals", 1);
      if ((end - start) % intervals) fail(family, "distance does not split into equal whole-number intervals.");
      const answer = (end - start) / intervals;
      return { family, start, end, intervals, answer, label: `한 칸 ${answer}`, check: `${start}+${answer}×${intervals}=${end}` };
    }
    case "book06-missing-side":
    case "book06-perimeter-half": {
      const perimeter = integer(model.perimeter, family, "perimeter", 2);
      const knownSide = integer(model.knownSide, family, "known side", 1);
      if (perimeter % 2) fail(family, "perimeter must split into two equal pairs.");
      const answer = perimeter / 2 - knownSide;
      if (answer <= 0) fail(family, "missing side is not positive.");
      return { family, perimeter, knownSide, answer, label: `다른 한 변 ${answer}cm`, check: `(${knownSide}+${answer})×2=${perimeter}` };
    }
    case "book06-range-count":
    case "book06-inclusive-sequence": {
      const start = integer(model.start, family, "start");
      const end = integer(model.end, family, "end", start);
      const answer = end - start + 1;
      return { family, start, end, answer, label: `모두 ${answer}개`, check: `${end}-${start}+1=${answer}` };
    }
    case "book06-number-digit-count": {
      const values = Array.isArray(model.values) ? model.values.map((value) => integer(value, family, "number")) : [];
      if (!values.length) fail(family, "number cards are missing.");
      const digitCount = values.reduce((sum, value) => sum + String(value).length, 0);
      return { family, values, digitCount, answer: values.length, label: `수 ${values.length}개`, check: `수 ${values.length}개 · 쓴 숫자 ${digitCount}개` };
    }
    case "book06-equal-share": {
      const total = integer(model.total, family, "total", 1);
      const groups = integer(model.groups, family, "groups", 1);
      if (total % groups) fail(family, "total does not divide evenly into groups.");
      const answer = total / groups;
      return { family, total, groups, answer, label: `한 묶음 ${answer}개`, check: `${answer}×${groups}=${total}` };
    }
    case "book06-distance-ratio": {
      const distance = integer(model.distance, family, "distance", 1);
      const intervals = integer(model.intervals, family, "intervals", 1);
      if (distance % intervals) fail(family, "distance does not divide evenly into intervals.");
      const answer = distance / intervals;
      return { family, distance, intervals, answer, label: `한 칸 ${answer}`, check: `${answer}×${intervals}=${distance}` };
    }
    case "book06-equivalent-ratio": {
      if (!Array.isArray(model.left) || model.left.length !== 2) fail(family, "base ratio is missing.");
      const first = integer(model.left[0], family, "first ratio term", 1);
      const second = integer(model.left[1], family, "second ratio term", 1);
      const known = integer(model.known, family, "known equivalent term", 1);
      if (known % first) fail(family, "ratio multiplier is not a whole number.");
      const factor = known / first;
      const answer = second * factor;
      return { family, first, second, known, factor, answer, label: `뒷항 ${answer}`, check: `${known}:${answer}=${first}:${second}` };
    }
    case "book06-partial-product": {
      const multiplicand = integer(model.multiplicand, family, "multiplicand", 10);
      const multiplier = integer(model.multiplier, family, "multiplier", 1);
      const tens = Math.floor(multiplicand / 10) * 10;
      const ones = multiplicand - tens;
      const answer = multiplicand * multiplier;
      return { family, multiplicand, multiplier, tens, ones, answer, label: `곱 ${answer}`, check: `${Array.from({ length: multiplier }, () => multiplicand).join("+")}=${answer}` };
    }
    case "book06-digit-occurrence": {
      const start = integer(model.start, family, "start");
      const end = integer(model.end, family, "end", start);
      const digit = integer(model.digit, family, "digit");
      if (digit > 9) fail(family, "target digit must be one digit.");
      const answer = digitOccurrences(start, end, digit);
      return { family, start, end, digit, answer, label: `숫자 ${digit}는 ${answer}번`, check: `${digit}${digit}에서는 두 자리 모두 셉니다.` };
    }
    default:
      fail(family, "unsupported workbook family.");
  }
}

function phaseShell(family, phase, content) {
  const labels = { given: "조건", organize: "그림 정리", calculate: "계산", verify: "검산" };
  const activeIndex = PHASES.indexOf(phase);
  const colorRole = phase === "given" ? "given" : phase === "verify" ? "verify" : "action";
  const rail = PHASES.map((name, index) => {
    const reached = index <= activeIndex;
    const color = !reached ? COLOR.muted : name === "given" ? COLOR.given : name === "verify" ? COLOR.verify : COLOR.action;
    return `<span style="border-color:${color};color:${index === activeIndex ? color : COLOR.ink}">${labels[name]}</span>`;
  }).join("");
  return `<div class="book06-workbook" data-book06-family="${escapeHtml(family)}" data-book06-phase="${phase}" data-color-role="${colorRole}" role="img" aria-label="${labels[phase]} 단계의 수학 그림"><div class="b6w-phase-rail" aria-hidden="true">${rail}</div><div class="b6w-content">${content}</div></div>`;
}

function expressionPanel(expression) {
  return `<div class="b6w-expression" data-book06-expression>${escapeHtml(expression)}</div>`;
}

function verifyPanel(result) {
  return `<div class="b6w-verify" data-book06-answer="${escapeHtml(result.answer)}" data-book06-check="${escapeHtml(result.check)}"><strong>${escapeHtml(result.label)}</strong><span>${escapeHtml(result.check)}</span></div>`;
}

function numberLineSvg(start, end, intervals, phase) {
  const width = 520;
  const left = 42;
  const right = 478;
  const y = 88;
  const gap = (right - left) / intervals;
  const unit = (end - start) / intervals;
  const ticks = Array.from({ length: intervals + 1 }, (_, index) => {
    const x = left + gap * index;
    const showValue = index === 0 || index === intervals || phase === "verify";
    const value = showValue ? start + unit * index : "";
    return `<g><line x1="${x}" y1="${y - 12}" x2="${x}" y2="${y + 12}"/><circle cx="${x}" cy="${y}" r="4"/><text x="${x}" y="${y + 35}">${value}</text></g>`;
  }).join("");
  const segments = phase === "organize" || phase === "calculate" || phase === "verify"
    ? Array.from({ length: intervals }, (_, index) => `<path class="b6w-segment ${phase === "verify" ? "is-verified" : ""}" d="M${left + gap * index + 4} ${y - 24}H${left + gap * (index + 1) - 4}"/>`).join("")
    : "";
  return `<svg class="b6w-number-line" viewBox="0 0 ${width} 145" aria-label="${start}부터 ${end}까지 ${intervals}칸인 수직선"><line class="axis" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>${ticks}${segments}</svg>`;
}

function renderNumberLine(result, phase) {
  const visual = numberLineSvg(result.start, result.end, result.intervals, phase);
  if (phase === "given" || phase === "organize") return visual;
  if (phase === "calculate") return `${visual}${expressionPanel(`(${result.end}-${result.start})÷${result.intervals}=?`)}`;
  return `${visual}${verifyPanel(result)}`;
}

function rectangleSvg(result, phase) {
  const answerLabel = phase === "verify" ? `${result.answer}cm` : "?";
  const pairLines = phase === "organize" || phase === "calculate" || phase === "verify"
    ? '<path class="pair-line" d="M70 52H330M70 188H330"/><path class="pair-line action" d="M70 52V188M330 52V188"/>'
    : "";
  return `<svg class="b6w-rectangle" viewBox="0 0 400 240" aria-label="둘레 ${result.perimeter}cm, 한 변 ${result.knownSide}cm인 직사각형"><rect x="70" y="52" width="260" height="136"/>${pairLines}<text class="known" x="200" y="35">${result.knownSide}cm</text><text class="unknown ${phase === "verify" ? "is-verified" : ""}" x="360" y="125">${answerLabel}</text><text class="perimeter" x="200" y="225">둘레 ${result.perimeter}cm</text></svg>`;
}

function renderMissingSide(result, phase) {
  const visual = rectangleSvg(result, phase);
  if (phase === "given" || phase === "organize") return visual;
  if (phase === "calculate") return `${visual}${expressionPanel(`${result.perimeter}÷2-${result.knownSide}=?`)}`;
  return `${visual}${verifyPanel(result)}`;
}

function rangeCards(result, phase) {
  const values = Array.from({ length: result.end - result.start + 1 }, (_, index) => result.start + index);
  const cards = values.map((value, index) => {
    const endpoint = index === 0 || index === values.length - 1;
    const hidden = phase === "given" && !endpoint;
    return `<span class="${endpoint ? "endpoint" : ""} ${hidden ? "is-hidden" : ""}">${hidden ? "…" : value}</span>`;
  }).join("");
  return `<div class="b6w-range-cards" aria-label="${result.start}부터 ${result.end}까지의 수 카드">${cards}</div>`;
}

function renderRange(result, phase) {
  const visual = rangeCards(result, phase);
  if (phase === "given" || phase === "organize") return visual;
  if (phase === "calculate") return `${visual}${expressionPanel(`${result.end}-${result.start}+1=?`)}`;
  return `${visual}${verifyPanel(result)}`;
}

function renderNumberDigit(result, phase) {
  const cards = result.values.map((value) => `<span class="b6w-number-card"><strong>${value}</strong>${phase === "given" ? "" : `<i>${[...String(value)].map((digit) => `<b>${digit}</b>`).join("")}</i>`}</span>`).join("");
  const visual = `<div class="b6w-number-digits"><div>${cards}</div>${phase === "given" ? "" : '<p><span>수 카드</span><b>한 장씩 세기</b><span>쓴 숫자</span><b>자리마다 세기</b></p>'}</div>`;
  if (phase === "given" || phase === "organize") return visual;
  if (phase === "calculate") return `${visual}${expressionPanel(`수의 개수 = □　쓴 숫자의 개수 = ${result.values.map((value) => String(value).length).join("+")}`)}`;
  return `${visual}${verifyPanel(result)}`;
}

function dots(count) {
  return Array.from({ length: count }, () => "<i></i>").join("");
}

function renderEqualShare(result, phase) {
  const groups = phase === "given"
    ? `<div class="b6w-dot-pile">${dots(result.total)}</div>`
    : `<div class="b6w-equal-groups">${Array.from({ length: result.groups }, (_, index) => `<span><b>${index + 1}묶음</b>${dots(result.answer)}</span>`).join("")}</div>`;
  if (phase === "given" || phase === "organize") return groups;
  if (phase === "calculate") return `${groups}${expressionPanel(`${result.total}÷${result.groups}=?`)}`;
  return `${groups}${verifyPanel(result)}`;
}

function renderDistance(result, phase) {
  const visual = numberLineSvg(0, result.distance, result.intervals, phase);
  if (phase === "given" || phase === "organize") return visual;
  if (phase === "calculate") return `${visual}${expressionPanel(`${result.distance}÷${result.intervals}=?`)}`;
  return `${visual}${verifyPanel(result)}`;
}

function ratioBar(units, label, className, value = "") {
  return `<div class="b6w-ratio-row ${className}"><b>${label}</b><span style="--units:${units}">${Array.from({ length: units }, () => "<i></i>").join("")}</span>${value === "" ? "" : `<strong>${value}</strong>`}</div>`;
}

function renderRatio(result, phase) {
  const knownValue = phase === "verify" ? result.answer : "?";
  const factor = phase === "given" ? "" : `<p class="b6w-scale-factor">앞항 ×${result.factor}　→　뒷항도 ×${result.factor}</p>`;
  const visual = `<div class="b6w-ratio-bars">${ratioBar(result.first, `${result.first}`, "given", result.known)}${ratioBar(result.second, `${result.second}`, "action", knownValue)}${factor}</div>`;
  if (phase === "given" || phase === "organize") return visual;
  if (phase === "calculate") return `${visual}${expressionPanel(`${result.second}×${result.factor}=?`)}`;
  return `${visual}${verifyPanel(result)}`;
}

function renderProduct(result, phase) {
  const first = result.tens * result.multiplier;
  const second = result.ones * result.multiplier;
  const labelsVisible = phase !== "given";
  const visual = `<div class="b6w-product-model"><div class="tens" style="--share:${result.tens}"><span>${labelsVisible ? `${result.tens}×${result.multiplier}` : result.tens}</span></div><div class="ones" style="--share:${Math.max(1, result.ones)}"><span>${labelsVisible ? `${result.ones}×${result.multiplier}` : result.ones}</span></div><b>× ${result.multiplier}</b></div>`;
  if (phase === "given" || phase === "organize") return visual;
  if (phase === "calculate") return `${visual}${expressionPanel(`${first}+${second}=?`)}`;
  return `${visual}${verifyPanel(result)}`;
}

function digitCell(value, digit, phase) {
  const characters = [...String(value)];
  return `<span>${characters.map((character, index) => {
    const match = Number(character) === digit;
    const place = characters.length === 2 && index === 0 ? "tens" : "ones";
    const active = phase !== "given" && match;
    return `<b class="${active ? `match ${place}` : ""}">${character}</b>`;
  }).join("")}</span>`;
}

function renderDigitOccurrence(result, phase) {
  const values = Array.from({ length: result.end - result.start + 1 }, (_, index) => result.start + index);
  const grid = `<div class="b6w-digit-grid" aria-label="${result.start}부터 ${result.end}까지 숫자 ${result.digit} 찾기">${values.map((value) => digitCell(value, result.digit, phase)).join("")}</div>`;
  if (phase === "given" || phase === "organize") return grid;
  const tensCount = values.reduce((sum, value) => sum + (String(value).length === 2 && Number(String(value)[0]) === result.digit ? 1 : 0), 0);
  const onesCount = result.answer - tensCount;
  if (phase === "calculate") return `${grid}${expressionPanel(`${tensCount}+${onesCount}=?`)}`;
  return `${grid}${verifyPanel(result)}`;
}

export function renderBook06Guided(experience, beat, step) {
  if (!BOOK06_WORKBOOK_FAMILIES.has(experience?.family)) fail(experience?.family || "unknown", "family is not registered.");
  const phase = phaseFor(beat, step);
  const result = book06GuidedResult(experience);
  let content = "";
  if (result.family === "book06-number-line") content = renderNumberLine(result, phase);
  else if (["book06-missing-side", "book06-perimeter-half"].includes(result.family)) content = renderMissingSide(result, phase);
  else if (["book06-range-count", "book06-inclusive-sequence"].includes(result.family)) content = renderRange(result, phase);
  else if (result.family === "book06-number-digit-count") content = renderNumberDigit(result, phase);
  else if (result.family === "book06-equal-share") content = renderEqualShare(result, phase);
  else if (result.family === "book06-distance-ratio") content = renderDistance(result, phase);
  else if (result.family === "book06-equivalent-ratio") content = renderRatio(result, phase);
  else if (result.family === "book06-partial-product") content = renderProduct(result, phase);
  else if (result.family === "book06-digit-occurrence") content = renderDigitOccurrence(result, phase);
  return phaseShell(result.family, phase, content);
}
