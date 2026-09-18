const PHASES = Object.freeze(["given", "organize", "calculate", "verify"]);
const FAMILY_SET = new Set([
  "arithmetic-sequence",
  "assumption-score",
  "calendar-weekday",
  "clock-reading",
  "closed-loop",
  "multiplication-equation",
  "reverse-digits",
  "reverse-growth",
  "shape-sequence",
  "venn-diagram"
]);

const COLOR = Object.freeze({
  given: "#187fa9",
  action: "#d39b20",
  verify: "#16734b",
  ink: "#233746",
  muted: "#b9c5cc",
  wash: "#f5f6f8",
  paper: "#ffffff"
});

const WEEKDAYS = Object.freeze(["일", "월", "화", "수", "목", "금", "토"]);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fail(family, message) {
  throw new Error(`Book 7 ${family}: ${message}`);
}

function finiteNumber(value, family, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) fail(family, `${label} is missing or invalid.`);
  return number;
}

function positiveInteger(value, family, label) {
  const number = finiteNumber(value, family, label);
  if (!Number.isInteger(number) || number < 1) fail(family, `${label} must be a positive integer.`);
  return number;
}

function promptFor(experience, family) {
  const prompt = String(experience?.check?.prompt || "").trim();
  if (!prompt) fail(family, "check prompt is missing.");
  return prompt;
}

function strictMatch(prompt, pattern, family) {
  const match = prompt.match(pattern);
  if (!match) fail(family, "the current check prompt does not match the supported source structure.");
  return match;
}

function answerText(value) {
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000);
  return String(value);
}

function answersMatch(left, right) {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) return Math.abs(leftNumber - rightNumber) < 1e-9;
  return String(left).trim() === String(right).trim();
}

function assertDeclaredAnswer(model, calculated, family, keys = []) {
  for (const key of ["answer", ...keys]) {
    if (model?.[key] === undefined || model?.[key] === null || model?.[key] === "") continue;
    if (!answersMatch(model[key], calculated)) fail(family, `declared ${key} disagrees with the model calculation.`);
  }
}

function normalizePhase(beat, step) {
  const named = String(beat?.phase || "").toLowerCase();
  const aliases = {
    problem: "given",
    source: "given",
    draw: "given",
    structure: "organize",
    transform: "organize",
    reason: "calculate",
    reasoning: "calculate",
    compute: "calculate",
    check: "verify"
  };
  const phase = aliases[named] || named;
  if (PHASES.includes(phase)) return phase;
  const action = String(beat?.action || "").toLowerCase();
  if (action === "draw") return "given";
  if (action === "transform" || action === "organize") return "organize";
  if (action === "calculate" || action === "reason") return "calculate";
  if (action === "verify" || action === "check") return "verify";
  return PHASES[Math.max(0, Math.min(Number(step) || 0, PHASES.length - 1))];
}

function shapeSequenceModel(experience) {
  const family = "shape-sequence";
  const model = experience.model || {};
  const visual = model.visual || {};
  let sides = model.sides ?? visual.sides;
  let count = model.count ?? visual.count;
  if (sides === undefined || count === undefined) {
    const prompt = promptFor(experience, family);
    const [, shape, rawCount] = strictMatch(prompt, /정(삼각형|사각형|오각형|육각형)\s*(\d+)개/u, family);
    sides = { 삼각형: 3, 사각형: 4, 오각형: 5, 육각형: 6 }[shape];
    count = rawCount;
  }
  sides = positiveInteger(sides, family, "side count");
  count = positiveInteger(count, family, "shape count");
  if (sides < 3 || sides > 8) fail(family, "side count is outside the renderer range.");
  const answer = sides + (count - 1) * (sides - 1);
  assertDeclaredAnswer(model, answer, family, ["result", "matchsticks"]);
  return { family, sides, count, answer };
}

function closedLoopModel(experience) {
  const family = "closed-loop";
  const model = experience.model || {};
  const visual = model.visual || {};
  let count = model.count ?? visual.count;
  let spacing = model.spacing ?? visual.spacing;
  if (count === undefined || spacing === undefined) {
    const [, rawCount, rawSpacing] = strictMatch(promptFor(experience, family), /나무\s*(\d+)그루를\s*(\d+)m\s*간격/u, family);
    count = rawCount;
    spacing = rawSpacing;
  }
  count = positiveInteger(count, family, "tree count");
  spacing = finiteNumber(spacing, family, "spacing");
  if (spacing <= 0) fail(family, "spacing must be positive.");
  const perimeter = count * spacing;
  assertDeclaredAnswer(model, perimeter, family, ["perimeter", "result"]);
  return { family, count, spacing, perimeter };
}

function vennModel(experience) {
  const family = "venn-diagram";
  const model = experience.model || {};
  const visual = model.visual || {};
  let total = model.total ?? visual.total;
  let left = model.left ?? model.leftTotal ?? visual.leftTotal;
  let right = model.right ?? model.rightTotal ?? visual.rightTotal;
  if (total === undefined || left === undefined || right === undefined) {
    const match = strictMatch(promptFor(experience, family), /전체\s*(\d+)명,\s*A\s*(\d+)명,\s*B\s*(\d+)명/u, family);
    [, total, left, right] = match;
  }
  total = positiveInteger(total, family, "total");
  left = positiveInteger(left, family, "left total");
  right = positiveInteger(right, family, "right total");
  const overlap = left + right - total;
  if (overlap < 0 || overlap > Math.min(left, right)) fail(family, "the overlap is not uniquely valid.");
  assertDeclaredAnswer(model, overlap, family, ["overlap", "result"]);
  return { family, total, left, right, overlap, leftOnly: left - overlap, rightOnly: right - overlap };
}

function calendarModel(experience) {
  const family = "calendar-weekday";
  const model = experience.model || {};
  const visual = model.visual || {};
  let start = model.start ?? visual.start;
  let days = model.days ?? model.offset ?? visual.days;
  if (start === undefined || days === undefined) {
    const match = strictMatch(promptFor(experience, family), /([일월화수목금토])요일에서\s*(\d+)일\s*뒤/u, family);
    [, start, days] = match;
  }
  start = String(start).replace(/요일$/u, "");
  days = positiveInteger(days, family, "day offset");
  const startIndex = WEEKDAYS.indexOf(start);
  if (startIndex < 0) fail(family, "start weekday is invalid.");
  const remainder = days % 7;
  const target = WEEKDAYS[(startIndex + remainder) % 7];
  assertDeclaredAnswer(model, `${target}요일`, family, ["targetWeekday", "result"]);
  return { family, start, days, weeks: Math.floor(days / 7), remainder, target, answer: `${target}요일` };
}

function clockModel(experience) {
  const family = "clock-reading";
  const model = experience.model || {};
  let minuteMark = model.minuteMark;
  let hour = model.hour;
  let nextHour = model.nextHour;
  if (minuteMark === undefined || hour === undefined || nextHour === undefined) {
    const match = strictMatch(promptFor(experience, family), /긴바늘이\s*(\d+),\s*짧은바늘이\s*(\d+)와\s*(\d+)\s*사이/u, family);
    [, minuteMark, hour, nextHour] = match;
  }
  minuteMark = positiveInteger(minuteMark, family, "minute-hand number");
  hour = positiveInteger(hour, family, "hour");
  nextHour = positiveInteger(nextHour, family, "next hour");
  if (minuteMark > 12 || ((hour % 12) + 1) % 12 !== nextHour % 12) fail(family, "clock-hand relationship is invalid.");
  const minutes = (minuteMark % 12) * 5;
  assertDeclaredAnswer(model, minutes, family, ["minutes", "result"]);
  return { family, minuteMark, hour, nextHour, minutes };
}

function multiplicationModel(experience) {
  const family = "multiplication-equation";
  const model = experience.model || {};
  let factor = model.factor;
  let product = model.product;
  if (factor === undefined || product === undefined) {
    const match = strictMatch(promptFor(experience, family), /(\d+)\s*×\s*□\s*=\s*(\d+)/u, family);
    [, factor, product] = match;
  }
  factor = positiveInteger(factor, family, "known factor");
  product = positiveInteger(product, family, "product");
  if (product % factor !== 0) fail(family, "the missing whole-number factor is not unique.");
  const missing = product / factor;
  assertDeclaredAnswer(model, missing, family, ["missing", "result"]);
  return { family, factor, product, missing };
}

function arithmeticSequenceModel(experience) {
  const family = "arithmetic-sequence";
  const model = experience.model || {};
  let values = model.values;
  let position = model.position;
  if (!Array.isArray(values) || position === undefined) {
    const match = strictMatch(promptFor(experience, family), /^([\d,\s]+)에서\s*(\d+)번째\s*수/u, family);
    values = match[1].split(",").map((value) => Number(value.trim())).filter(Number.isFinite);
    position = match[2];
  }
  if (!Array.isArray(values) || values.length < 2 || values.some((value) => !Number.isFinite(Number(value)))) fail(family, "sequence values are invalid.");
  values = values.map(Number);
  position = positiveInteger(position, family, "target position");
  const step = finiteNumber(model.step ?? values[1] - values[0], family, "common difference");
  if (values.some((value, index) => index > 0 && value - values[index - 1] !== step)) fail(family, "shown values do not have one common difference.");
  const result = values[0] + (position - 1) * step;
  assertDeclaredAnswer(model, result, family, ["result", "target"]);
  return { family, values, position, step, result };
}

function assumptionModel(experience) {
  const family = "assumption-score";
  const model = experience.model || {};
  let low = model.low;
  let high = model.high;
  let totalCount = model.totalCount;
  let total = model.total ?? model.totalUnits;
  let targetUnit = model.targetUnit;
  if ([low, high, totalCount, total].some((value) => value === undefined)) {
    const match = strictMatch(promptFor(experience, family), /(\d+)점과\s*(\d+)점\s*문제를\s*(\d+)개\s*풀어\s*(\d+)점이면\s*(\d+)점\s*문제/u, family);
    [, low, high, totalCount, total, targetUnit] = match;
  }
  low = finiteNumber(low, family, "low score");
  high = finiteNumber(high, family, "high score");
  totalCount = positiveInteger(totalCount, family, "problem count");
  total = finiteNumber(total, family, "total score");
  targetUnit = finiteNumber(targetUnit ?? high, family, "target score");
  if (high === low || targetUnit !== high) fail(family, "the requested score type is unsupported or ambiguous.");
  const highCount = (total - low * totalCount) / (high - low);
  if (!Number.isInteger(highCount) || highCount < 0 || highCount > totalCount) fail(family, "the score assumptions do not produce one valid count.");
  assertDeclaredAnswer(model, highCount, family, ["highCount", "result"]);
  return { family, low, high, totalCount, total, highCount, lowCount: totalCount - highCount };
}

function reverseGrowthModel(experience) {
  const family = "reverse-growth";
  const model = experience.model || {};
  let multiplier = model.multiplier;
  let fullDay = model.fullDay;
  let targetDay = model.targetDay;
  if ([multiplier, fullDay, targetDay].some((value) => value === undefined)) {
    const match = strictMatch(promptFor(experience, family), /매일\s*(두|세|\d+)\s*배가 되어\s*(\d+)일째\s*가득 차면\s*(\d+)일째/u, family);
    multiplier = { 두: 2, 세: 3 }[match[1]] ?? Number(match[1]);
    fullDay = match[2];
    targetDay = match[3];
  }
  multiplier = finiteNumber(multiplier, family, "growth multiplier");
  fullDay = positiveInteger(fullDay, family, "full day");
  targetDay = positiveInteger(targetDay, family, "target day");
  if (multiplier <= 1 || targetDay >= fullDay) fail(family, "reverse-growth days or multiplier are invalid.");
  const amount = 1 / (multiplier ** (fullDay - targetDay));
  assertDeclaredAnswer(model, amount, family, ["amount", "result"]);
  return { family, multiplier, fullDay, targetDay, amount };
}

function reverseDigitsModel(experience) {
  const family = "reverse-digits";
  const model = experience.model || {};
  let difference = model.difference ?? model.visual?.difference;
  if (difference === undefined) {
    [, difference] = strictMatch(promptFor(experience, family), /차가\s*(\d+)이면\s*자리 차/u, family);
  }
  difference = positiveInteger(difference, family, "number difference");
  if (difference % 9 !== 0 || difference / 9 > 9) fail(family, "the digit difference is not a valid whole digit.");
  const digitGap = difference / 9;
  assertDeclaredAnswer(model, digitGap, family, ["digitGap", "result"]);
  return { family, difference, digitGap };
}

function resolveModel(experience) {
  switch (experience.family) {
    case "shape-sequence": return shapeSequenceModel(experience);
    case "closed-loop": return closedLoopModel(experience);
    case "venn-diagram": return vennModel(experience);
    case "calendar-weekday": return calendarModel(experience);
    case "clock-reading": return clockModel(experience);
    case "multiplication-equation": return multiplicationModel(experience);
    case "arithmetic-sequence": return arithmeticSequenceModel(experience);
    case "assumption-score": return assumptionModel(experience);
    case "reverse-growth": return reverseGrowthModel(experience);
    case "reverse-digits": return reverseDigitsModel(experience);
    default: fail(experience.family || "unknown", "unsupported guided family.");
  }
}

function phaseShell(family, phase, content) {
  const labels = { given: "주어진 구조", organize: "정리", calculate: "계산·추론", verify: "검산" };
  const activeIndex = PHASES.indexOf(phase);
  const role = phase === "given" ? "given" : phase === "verify" ? "verify" : "action";
  const rail = PHASES.map((name, index) => {
    let color = COLOR.muted;
    if (index <= activeIndex) {
      if (name === "given") color = COLOR.given;
      else if (name === "verify") color = phase === "verify" ? COLOR.verify : COLOR.muted;
      else color = COLOR.action;
    }
    return `<span style="display:grid;place-items:center;min-width:0;min-height:30px;border-bottom:3px solid ${color};color:${index === activeIndex ? color : COLOR.ink};font-size:12px;font-weight:800;text-align:center">${labels[name]}</span>`;
  }).join("");
  return `<div class="book07-guided" data-book07-family="${escapeHtml(family)}" data-book07-phase="${phase}" data-color-role="${role}" role="img" aria-label="${labels[phase]} 단계의 수학 그림" style="display:grid;gap:12px;width:min(100%,560px);max-width:100%;min-width:0;margin:0 auto;padding:12px;box-sizing:border-box;overflow:hidden;background:${COLOR.paper};color:${COLOR.ink};font-family:Arial,'Noto Sans KR',sans-serif"><div aria-hidden="true" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:100%;min-width:0">${rail}</div><div data-book07-content style="display:grid;gap:12px;place-items:center;width:100%;min-width:0;overflow:hidden">${content}</div></div>`;
}

function verifyPanel(answer, check, label) {
  return `<div data-book07-answer="${escapeHtml(answerText(answer))}" data-book07-check="${escapeHtml(check)}" style="display:grid;gap:5px;justify-items:center;width:min(100%,440px);padding:10px 12px;box-sizing:border-box;border:2px solid ${COLOR.verify};background:#eef8f2;color:${COLOR.verify};font-weight:800;text-align:center"><strong style="font-size:24px">${escapeHtml(label)}</strong><span style="font-size:15px">${escapeHtml(check)}</span></div>`;
}

function polygonChain(sides, count) {
  let current = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + Math.PI / sides + index * Math.PI * 2 / sides;
    return { x: Math.cos(angle) * 36, y: Math.sin(angle) * 36 };
  });
  const polygons = [current];
  for (let shape = 1; shape < count; shape += 1) {
    const edges = current.map((first, index) => ({ first, second: current[(index + 1) % sides] }));
    const edge = edges.sort((left, right) => (right.first.x + right.second.x) - (left.first.x + left.second.x))[0];
    const dx = edge.second.x - edge.first.x;
    const dy = edge.second.y - edge.first.y;
    const lengthSquared = dx * dx + dy * dy;
    current = current.map((point) => {
      const ratio = ((point.x - edge.first.x) * dx + (point.y - edge.first.y) * dy) / lengthSquared;
      const projected = { x: edge.first.x + ratio * dx, y: edge.first.y + ratio * dy };
      return { x: projected.x * 2 - point.x, y: projected.y * 2 - point.y };
    });
    polygons.push(current);
  }
  const points = polygons.flat();
  return {
    polygons,
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y))
  };
}

function shapeSequenceFrame(model, phase) {
  const shown = Math.min(model.count, 4);
  const chain = polygonChain(model.sides, shown);
  const pad = 16;
  const width = chain.maxX - chain.minX + pad * 2;
  const height = chain.maxY - chain.minY + pad * 2;
  const polygons = chain.polygons.map((points, index) => {
    const color = phase === "given" || index === 0 ? COLOR.given : phase === "verify" ? COLOR.verify : COLOR.action;
    return `<polygon points="${points.map(({ x, y }) => `${x - chain.minX + pad},${y - chain.minY + pad}`).join(" ")}" fill="${color}" fill-opacity=".08" stroke="${color}" stroke-width="3"/>`;
  }).join("");
  const picture = `<svg viewBox="0 0 ${width} ${height}" aria-label="한 변씩 맞닿은 정다각형" style="display:block;width:min(100%,360px);height:auto;overflow:visible">${polygons}</svg>`;
  if (phase === "given") return picture;
  const first = model.sides;
  const added = model.sides - 1;
  if (phase === "organize") return `${picture}<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;font-weight:800"><span style="color:${COLOR.given}">처음 ${first}개</span><span style="color:${COLOR.action}">새 도형마다 +${added}개</span></div>`;
  const expression = `${first} + (${model.count} - 1) × ${added}`;
  if (phase === "calculate") return `${picture}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${picture}${verifyPanel(model.answer, `${expression} = ${model.answer}`, `성냥개비 ${model.answer}개`)}`;
}

function closedLoopFrame(model, phase) {
  const center = 150;
  const radius = 88;
  const points = Array.from({ length: model.count }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / model.count;
    return { x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
  });
  const ringColor = phase === "verify" ? COLOR.verify : phase === "given" ? COLOR.given : COLOR.action;
  const dots = points.map(({ x, y }, index) => `<g><circle cx="${x}" cy="${y}" r="8" fill="${phase === "verify" ? COLOR.verify : COLOR.given}"/><text x="${x}" y="${y - 14}" text-anchor="middle" fill="${COLOR.ink}" font-size="12">${index + 1}</text></g>`).join("");
  const picture = `<svg viewBox="0 0 300 300" aria-label="닫힌 둘레에 같은 간격으로 놓인 나무" style="display:block;width:min(100%,300px);height:auto"><circle cx="150" cy="150" r="${radius}" fill="none" stroke="${ringColor}" stroke-width="5" stroke-dasharray="8 5"/>${dots}<text x="150" y="154" text-anchor="middle" fill="${ringColor}" font-size="18" font-weight="800">간격 ${model.spacing}m</text></svg>`;
  if (phase === "given") return picture;
  if (phase === "organize") return `${picture}<strong style="color:${COLOR.action}">닫힌 길: 나무 ${model.count}그루 = 간격 ${model.count}곳</strong>`;
  const expression = `${model.count} × ${answerText(model.spacing)}`;
  if (phase === "calculate") return `${picture}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${picture}${verifyPanel(model.perimeter, `${expression} = ${answerText(model.perimeter)}`, `둘레 ${answerText(model.perimeter)}m`)}`;
}

function vennPicture(model, phase) {
  const reveal = phase === "verify";
  const active = phase === "given" ? COLOR.given : reveal ? COLOR.verify : COLOR.action;
  return `<svg viewBox="0 0 420 238" aria-label="전체와 두 조건의 겹친 부분" style="display:block;width:min(100%,420px);height:auto"><rect x="12" y="14" width="396" height="208" rx="6" fill="none" stroke="${COLOR.given}" stroke-width="3"/><circle cx="170" cy="122" r="76" fill="${active}" fill-opacity=".08" stroke="${active}" stroke-width="3"/><circle cx="250" cy="122" r="76" fill="${active}" fill-opacity=".08" stroke="${active}" stroke-width="3"/><text x="88" y="38" fill="${COLOR.given}" font-size="15" font-weight="800">전체 ${model.total}명</text><text x="135" y="70" text-anchor="middle" fill="${COLOR.ink}" font-size="15" font-weight="800">A ${model.left}명</text><text x="285" y="70" text-anchor="middle" fill="${COLOR.ink}" font-size="15" font-weight="800">B ${model.right}명</text><text x="210" y="130" text-anchor="middle" fill="${reveal ? COLOR.verify : phase === "given" ? COLOR.given : COLOR.action}" font-size="24" font-weight="900">${reveal ? model.overlap : "?"}</text>${reveal ? `<text x="128" y="132" text-anchor="middle" fill="${COLOR.verify}" font-size="16">${model.leftOnly}</text><text x="292" y="132" text-anchor="middle" fill="${COLOR.verify}" font-size="16">${model.rightOnly}</text>` : ""}</svg>`;
}

function vennFrame(model, phase) {
  const picture = vennPicture(model, phase);
  if (phase === "given") return picture;
  if (phase === "organize") return `${picture}<div style="display:flex;align-items:center;gap:8px;color:${COLOR.action};font-size:18px;font-weight:800"><span>A</span><b>+</b><span>B</span><b>−</b><span>전체</span></div>`;
  const expression = `${model.left} + ${model.right} - ${model.total}`;
  if (phase === "calculate") return `${picture}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${picture}${verifyPanel(model.overlap, `${model.leftOnly} + ${model.overlap} + ${model.rightOnly} = ${model.total}`, `둘 다 ${model.overlap}명`)}`;
}

function calendarFrame(model, phase) {
  const reveal = phase === "verify";
  const cells = WEEKDAYS.map((day) => {
    const isStart = day === model.start;
    const isTarget = reveal && day === model.target;
    const color = isTarget ? COLOR.verify : isStart ? COLOR.given : COLOR.muted;
    const background = isTarget ? "#eef8f2" : isStart ? "#eaf5fa" : COLOR.paper;
    return `<span style="display:grid;place-items:center;min-width:0;height:46px;border:2px solid ${color};background:${background};color:${isTarget ? COLOR.verify : COLOR.ink};font-size:17px;font-weight:900">${day}</span>`;
  }).join("");
  const row = `<div aria-label="일요일부터 토요일까지의 요일표" style="display:grid;grid-template-columns:repeat(7,minmax(34px,1fr));gap:4px;width:min(100%,440px);min-width:0">${cells}</div>`;
  if (phase === "given") return `${row}<strong style="color:${COLOR.given}">${model.start}요일에서 ${model.days}일 이동</strong>`;
  if (phase === "organize") return `${row}<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;color:${COLOR.action};font-weight:800"><span>${model.days}일</span><b>=</b><span>${model.weeks}주</span><b>+</b><span>${model.remainder}일</span></div>`;
  const expression = `${model.days} ÷ 7 = ${model.weeks} … ${model.remainder}`;
  if (phase === "calculate") return `${row}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression}</strong>`;
  return `${row}${verifyPanel(model.answer, `${model.start}요일에서 ${model.remainder}칸 이동`, model.answer)}`;
}

function clockPoint(minutes, length, hourHand = false) {
  const angle = (hourHand ? (minutes / 60) * 30 : minutes * 6) * Math.PI / 180;
  return { x: 150 + Math.sin(angle) * length, y: 150 - Math.cos(angle) * length };
}

function clockFrame(model, phase) {
  const totalMinutes = model.hour * 60 + model.minutes;
  const minute = clockPoint(model.minutes, 92, false);
  const hour = clockPoint(totalMinutes, 58, true);
  const handColor = phase === "verify" ? COLOR.verify : phase === "given" ? COLOR.given : COLOR.action;
  const ticks = Array.from({ length: 12 }, (_, index) => {
    const angle = index * Math.PI / 6;
    const x1 = 150 + Math.sin(angle) * 105;
    const y1 = 150 - Math.cos(angle) * 105;
    const x2 = 150 + Math.sin(angle) * 115;
    const y2 = 150 - Math.cos(angle) * 115;
    const labelX = 150 + Math.sin(angle) * 128;
    const labelY = 155 - Math.cos(angle) * 128;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text x="${labelX}" y="${labelY}" text-anchor="middle">${index || 12}</text>`;
  }).join("");
  const picture = `<svg viewBox="0 0 300 300" aria-label="긴바늘과 짧은바늘이 있는 시계" style="display:block;width:min(100%,300px);height:auto"><circle cx="150" cy="150" r="122" fill="${COLOR.paper}" stroke="${COLOR.given}" stroke-width="3"/><g stroke="${COLOR.muted}" fill="${COLOR.ink}" font-size="13">${ticks}</g><line x1="150" y1="150" x2="${hour.x}" y2="${hour.y}" stroke="${handColor}" stroke-width="8" stroke-linecap="round"/><line x1="150" y1="150" x2="${minute.x}" y2="${minute.y}" stroke="${handColor}" stroke-width="5" stroke-linecap="round"/><circle cx="150" cy="150" r="7" fill="${handColor}"/></svg>`;
  if (phase === "given") return picture;
  if (phase === "organize") return `${picture}<div style="display:flex;gap:10px;color:${COLOR.action};font-weight:800"><span>긴바늘 ${model.minuteMark}</span><b>×</b><span>5분</span></div>`;
  const expression = `${model.minuteMark} × 5`;
  if (phase === "calculate") return `${picture}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${picture}${verifyPanel(model.minutes, `${model.hour}시 ${model.minutes}분에서 두 바늘 위치 확인`, `${model.minutes}분`)}`;
}

function multiplicationFrame(model, phase) {
  const dotColor = phase === "verify" ? COLOR.verify : phase === "given" ? COLOR.given : COLOR.action;
  const looseDots = `<div aria-label="나누기 전 ${model.product}개" style="display:flex;flex-wrap:wrap;justify-content:center;gap:5px;width:min(100%,330px);padding:10px;box-sizing:border-box;border:2px solid ${phase === "given" ? COLOR.given : COLOR.action};background:${COLOR.paper}">${Array.from({ length: model.product }, () => `<i aria-hidden="true" style="display:block;width:11px;height:11px;border-radius:50%;background:${dotColor}"></i>`).join("")}</div>`;
  const emptyGroups = `<div aria-label="같은 크기의 빈 묶음 ${model.factor}개" style="display:grid;grid-template-columns:repeat(${Math.min(model.factor, 4)},minmax(0,1fr));gap:7px;width:min(100%,440px);min-width:0">${Array.from({ length: model.factor }, (_, group) => `<span style="display:grid;place-items:center;min-width:0;height:54px;border:2px dashed ${COLOR.action};color:${COLOR.action};font-size:13px;font-weight:800">${group + 1}묶음</span>`).join("")}</div>`;
  const solvedGroups = `<div aria-label="검산을 위해 완성한 같은 묶음 ${model.factor}개" style="display:grid;grid-template-columns:repeat(${Math.min(model.factor, 4)},minmax(0,1fr));gap:7px;width:min(100%,440px);min-width:0">${Array.from({ length: model.factor }, (_, group) => `<span aria-label="${group + 1}번째 묶음" style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;min-width:0;padding:7px;border:2px solid ${COLOR.verify};background:${COLOR.paper}">${Array.from({ length: model.missing }, () => `<i aria-hidden="true" style="display:block;width:11px;height:11px;border-radius:50%;background:${COLOR.verify}"></i>`).join("")}</span>`).join("")}</div>`;
  if (phase === "given") return `${looseDots}<strong style="color:${COLOR.given}">${model.factor} × □ = ${model.product}</strong>`;
  if (phase === "organize") return `${looseDots}${emptyGroups}`;
  const expression = `${model.product} ÷ ${model.factor}`;
  if (phase === "calculate") return `${emptyGroups}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${solvedGroups}${verifyPanel(model.missing, `${model.factor} × ${model.missing} = ${model.product}`, `□ = ${model.missing}`)}`;
}

function arithmeticSequenceFrame(model, phase) {
  const displayed = model.values.slice();
  while (displayed.length < model.position) displayed.push(null);
  const visible = displayed.slice(0, Math.min(model.position, 7));
  const revealIndex = model.position - 1;
  const cards = visible.map((value, index) => {
    const reveal = phase === "verify" && index === revealIndex;
    const text = value ?? (reveal ? model.result : "?");
    const color = reveal ? COLOR.verify : index < model.values.length ? COLOR.given : phase === "given" ? COLOR.muted : COLOR.action;
    return `<span style="display:grid;place-items:center;width:48px;height:48px;border:2px solid ${color};background:${reveal ? "#eef8f2" : COLOR.paper};color:${reveal ? COLOR.verify : COLOR.ink};font-size:18px;font-weight:900">${text}</span>`;
  }).join(`<i aria-hidden="true" style="color:${phase === "given" ? COLOR.muted : COLOR.action};font-style:normal;font-weight:900">→</i>`);
  const row = `<div aria-label="같은 차로 늘어나는 수열" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:5px;width:100%;min-width:0">${cards}</div>`;
  if (phase === "given") return row;
  if (phase === "organize") return `${row}<strong style="color:${COLOR.action}">한 칸마다 +${answerText(model.step)}</strong>`;
  const lastKnown = model.values[model.values.length - 1];
  const remaining = model.position - model.values.length;
  const expression = remaining === 1 ? `${lastKnown} + ${answerText(model.step)}` : `${model.values[0]} + (${model.position} - 1) × ${answerText(model.step)}`;
  if (phase === "calculate") return `${row}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${row}${verifyPanel(model.result, `${model.result} - ${answerText(model.step)} = ${model.result - model.step}`, `${model.position}번째 수 ${model.result}`)}`;
}

function scoreTokens(model, values, phase) {
  return `<div aria-label="점수 문제 ${model.totalCount}개" style="display:flex;flex-wrap:wrap;justify-content:center;gap:7px;width:100%">${values.map((value, index) => {
    const verified = phase === "verify" && value === model.high && index < model.highCount;
    const color = verified ? COLOR.verify : phase === "given" ? COLOR.given : COLOR.action;
    return `<span style="display:grid;place-items:center;width:62px;height:54px;border:2px solid ${color};background:${verified ? "#eef8f2" : COLOR.paper};color:${color};font-weight:900">${value}점</span>`;
  }).join("")}</div>`;
}

function assumptionFrame(model, phase) {
  const assumed = Array.from({ length: model.totalCount }, () => model.low);
  const verified = [...Array.from({ length: model.highCount }, () => model.high), ...Array.from({ length: model.lowCount }, () => model.low)];
  if (phase === "given") return `${scoreTokens(model, assumed.map(() => "?"), phase)}<div style="display:flex;gap:10px;color:${COLOR.given};font-weight:800"><span>${model.low}점</span><span>${model.high}점</span><span>합 ${model.total}점</span></div>`;
  if (phase === "organize") return `${scoreTokens(model, assumed, phase)}<strong style="color:${COLOR.action}">모두 ${model.low}점으로 보면 ${model.low * model.totalCount}점</strong>`;
  const expression = `(${model.total} - ${model.low} × ${model.totalCount}) ÷ (${model.high} - ${model.low})`;
  if (phase === "calculate") return `${scoreTokens(model, assumed, phase)}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:18px">${expression} = ?</strong>`;
  return `${scoreTokens(model, verified, phase)}${verifyPanel(model.highCount, `${model.high} × ${model.highCount} + ${model.low} × ${model.lowCount} = ${model.total}`, `${model.high}점 문제 ${model.highCount}개`)}`;
}

function growthFrame(model, phase) {
  const reveal = phase === "verify";
  const percent = reveal ? Math.max(8, model.amount * 100) : 0;
  const targetColor = reveal ? COLOR.verify : phase === "given" ? COLOR.given : COLOR.action;
  const targetTank = `<figure style="display:grid;gap:5px;justify-items:center;margin:0"><div style="display:flex;align-items:flex-end;width:92px;height:126px;border:3px solid ${targetColor};background:linear-gradient(to top,${reveal ? COLOR.verify : COLOR.paper} ${percent}%,${COLOR.paper} ${percent}%);box-sizing:border-box"></div><figcaption style="font-weight:800">${model.targetDay}일째 ${reveal ? answerText(model.amount) : "?"}</figcaption></figure>`;
  const fullTank = `<figure style="display:grid;gap:5px;justify-items:center;margin:0"><div style="width:92px;height:126px;border:3px solid ${COLOR.given};background:${COLOR.given};box-sizing:border-box"></div><figcaption style="font-weight:800">${model.fullDay}일째 가득</figcaption></figure>`;
  const picture = `<div aria-label="매일 같은 배수로 차오르는 두 날" style="display:flex;align-items:center;justify-content:center;gap:14px;width:100%">${targetTank}<strong style="color:${phase === "given" ? COLOR.muted : COLOR.action};font-size:20px">× ${answerText(model.multiplier)} →</strong>${fullTank}</div>`;
  if (phase === "given") return picture;
  if (phase === "organize") return `${picture}<strong style="color:${COLOR.action}">하루 전은 거꾸로 ÷ ${answerText(model.multiplier)}</strong>`;
  const steps = model.fullDay - model.targetDay;
  const expression = steps === 1 ? `1 ÷ ${answerText(model.multiplier)}` : `1 ÷ ${answerText(model.multiplier)}${` ÷ ${answerText(model.multiplier)}`.repeat(steps - 1)}`;
  if (phase === "calculate") return `${picture}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${picture}${verifyPanel(model.amount, `${answerText(model.amount)} × ${answerText(model.multiplier ** steps)} = 1`, `${model.targetDay}일째 ${answerText(model.amount)}만큼`)}`;
}

function reverseDigitsFrame(model, phase) {
  const color = phase === "verify" ? COLOR.verify : phase === "given" ? COLOR.given : COLOR.action;
  const numberBox = (left, right) => `<span style="display:grid;grid-template-columns:repeat(2,54px);border:2px solid ${color}"><b style="display:grid;place-items:center;height:52px;border-right:1px solid ${color}">${left}</b><b style="display:grid;place-items:center;height:52px">${right}</b></span>`;
  const picture = `<div aria-label="십의 자리와 일의 자리를 바꾼 두 수" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;width:100%">${numberBox("큰 자리", "작은 자리")}<strong style="color:${color};font-size:22px">↔</strong>${numberBox("작은 자리", "큰 자리")}</div>`;
  if (phase === "given") return `${picture}<strong style="color:${COLOR.given}">두 수의 차 ${model.difference}</strong>`;
  if (phase === "organize") return `${picture}<strong style="color:${COLOR.action}">두 수의 차 = 자리 차 × 9</strong>`;
  const expression = `${model.difference} ÷ 9`;
  if (phase === "calculate") return `${picture}<strong data-book07-expression style="padding:8px 12px;border-left:4px solid ${COLOR.action};background:#fff8e4;font-size:20px">${expression} = ?</strong>`;
  return `${picture}${verifyPanel(model.digitGap, `9 × ${model.digitGap} = ${model.difference}`, `자리 차 ${model.digitGap}`)}`;
}

function renderFrame(model, phase) {
  switch (model.family) {
    case "shape-sequence": return shapeSequenceFrame(model, phase);
    case "closed-loop": return closedLoopFrame(model, phase);
    case "venn-diagram": return vennFrame(model, phase);
    case "calendar-weekday": return calendarFrame(model, phase);
    case "clock-reading": return clockFrame(model, phase);
    case "multiplication-equation": return multiplicationFrame(model, phase);
    case "arithmetic-sequence": return arithmeticSequenceFrame(model, phase);
    case "assumption-score": return assumptionFrame(model, phase);
    case "reverse-growth": return growthFrame(model, phase);
    case "reverse-digits": return reverseDigitsFrame(model, phase);
    default: return "";
  }
}

export function renderBook07Guided(experience, beat, step) {
  if (!experience || !FAMILY_SET.has(experience.family)) return "";
  const phase = normalizePhase(beat, step);
  const model = resolveModel(experience);
  return phaseShell(experience.family, phase, renderFrame(model, phase));
}
