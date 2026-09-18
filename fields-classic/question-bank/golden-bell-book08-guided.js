const BOOK08_COLOR = Object.freeze({
  given: "#187fa9",
  action: "#d39b20",
  verify: "#16734b",
  ink: "#233746",
  muted: "#b9c5cc",
  paper: "#ffffff",
  wash: "#f5f6f8",
  actionWash: "#fff8e4",
  verifyWash: "#e8f5ee"
});

const SUPPORTED_FAMILIES = new Set([
  "book08-picture-division",
  "book08-pyramid-cryptarithm",
  "book08-shape-equation-targets"
]);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function finiteInteger(value, label, { minimum = Number.MIN_SAFE_INTEGER } = {}) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < minimum) {
    throw new Error(`${label} must be a safe integer.`);
  }
  return number;
}

function phaseFor(experience, beat, step) {
  const last = Math.max(0, (experience?.beats?.length || 1) - 1);
  if (beat?.action === "verify" || step >= last) return "verify";
  if (step <= 0 || beat?.action === "draw") return "problem";
  return "calculate";
}

function phaseShell(family, phase, content) {
  const phases = ["problem", "calculate", "verify"];
  const labels = { problem: "문제", calculate: "정리", verify: "검산" };
  const activeIndex = phases.indexOf(phase);
  const colorRole = phase === "problem" ? "given" : phase === "verify" ? "verify" : "action";
  const rail = phases.map((name, index) => {
    const active = index === activeIndex;
    const complete = index < activeIndex;
    const availableColor = name === "problem"
      ? BOOK08_COLOR.given
      : name === "calculate"
        ? BOOK08_COLOR.action
        : phase === "verify"
          ? BOOK08_COLOR.verify
          : BOOK08_COLOR.muted;
    return `<span style="display:grid;place-items:center;min-height:28px;border-bottom:3px solid ${active || complete ? availableColor : BOOK08_COLOR.muted};color:${active ? availableColor : BOOK08_COLOR.ink};font-size:12px;font-weight:900">${labels[name]}</span>`;
  }).join("");
  return `<div class="book08-visual guided-book08-source" data-book08-family="${escapeHtml(family)}" data-book08-phase="${phase}" data-color-role="${colorRole}" role="img" aria-label="${labels[phase]} 단계의 수학 그림" style="display:grid;gap:12px;width:100%;min-height:220px;padding:10px;background:${BOOK08_COLOR.paper};color:${BOOK08_COLOR.ink};overflow:hidden"><div aria-hidden="true" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;width:min(100%,430px)">${rail}</div><div style="display:grid;gap:12px;place-items:center;width:100%">${content}</div></div>`;
}

function firstVisual(experience, subtype) {
  const visual = experience?.beats?.map((item) => item?.visual).find((item) => item?.kind === "book8" && item?.subtype === subtype);
  if (!visual) throw new Error(`Book 8 ${subtype} visual is missing.`);
  return visual;
}

function divisionModel(experience) {
  const visual = firstVisual(experience, "operation-grid");
  const row = visual.rows?.find((candidate) => Array.isArray(candidate) && candidate.includes("÷"));
  const divideAt = row?.indexOf("÷") ?? -1;
  if (divideAt < 1 || divideAt >= row.length - 1) throw new Error("Book 8 division expression is incomplete.");
  const dividend = finiteInteger(row[divideAt - 1], "division dividend", { minimum: 1 });
  const divisor = finiteInteger(row[divideAt + 1], "division divisor", { minimum: 1 });
  if (dividend % divisor !== 0) throw new Error("Book 8 division must make equal whole groups.");
  return { dividend, divisor, quotient: dividend / divisor };
}

function dot(color) {
  return `<i aria-hidden="true" style="display:block;width:16px;height:16px;border:2px solid ${color};border-radius:50%;background:${color};opacity:.86"></i>`;
}

function divisionFrame(experience, phase) {
  const { dividend, divisor, quotient } = divisionModel(experience);
  if (quotient > 12 || dividend > 60) throw new Error("Book 8 division visual exceeds the supported display range.");
  if (phase === "problem") {
    const dots = Array.from({ length: dividend }, () => dot(BOOK08_COLOR.given)).join("");
    return `<div aria-label="${dividend}개를 ${divisor}개씩 나누는 구조" style="display:grid;gap:10px;justify-items:center"><div style="display:grid;grid-template-columns:repeat(${Math.min(dividend, 6)},18px);gap:7px;padding:14px;border:2px solid ${BOOK08_COLOR.given};background:${BOOK08_COLOR.wash}">${dots}</div><strong style="color:${BOOK08_COLOR.given};font-size:19px">${dividend} ÷ ${divisor} = ?</strong></div>`;
  }
  const groups = Array.from({ length: quotient }, (_, groupIndex) => {
    const groupDots = Array.from({ length: divisor }, () => dot(phase === "verify" ? BOOK08_COLOR.verify : BOOK08_COLOR.given)).join("");
    const label = phase === "verify" ? `<small style="color:${BOOK08_COLOR.verify};font-size:11px;font-weight:900">${groupIndex + 1}묶음</small>` : "";
    const border = phase === "verify" ? BOOK08_COLOR.verify : BOOK08_COLOR.action;
    const background = phase === "verify" ? BOOK08_COLOR.verifyWash : BOOK08_COLOR.actionWash;
    return `<span style="display:grid;grid-template-columns:repeat(${Math.min(divisor, 5)},16px);gap:5px;place-items:center;justify-content:center;min-width:62px;min-height:62px;padding:8px;border:2px solid ${border};background:${background}">${groupDots}${label}</span>`;
  }).join("");
  const grouped = `<div aria-label="같은 수씩 나눈 묶음" style="display:grid;grid-template-columns:repeat(${Math.min(quotient, 4)},minmax(62px,1fr));gap:9px;width:min(100%,420px)">${groups}</div>`;
  if (phase === "calculate") {
    return `${grouped}<strong data-book08-expression style="padding:8px 14px;border-left:4px solid ${BOOK08_COLOR.action};background:${BOOK08_COLOR.actionWash};font-size:19px">${dividend} ÷ ${divisor} = ?</strong>`;
  }
  const check = `${quotient} × ${divisor} = ${dividend}`;
  return `${grouped}<div data-book08-answer="${quotient}" data-book08-check="${escapeHtml(check)}" style="display:grid;gap:4px;justify-items:center;color:${BOOK08_COLOR.verify};font-weight:900"><strong style="font-size:25px">${dividend} ÷ ${divisor} = ${quotient}</strong><span style="font-size:16px">${check}</span></div>`;
}

function pyramidModel(experience) {
  const visual = firstVisual(experience, "vertical-stack");
  const addends = (visual.addends || []).map((value, index) => finiteInteger(value, `pyramid addend ${index + 1}`, { minimum: 0 }));
  if (addends.length < 2 || addends.length > 6) throw new Error("Book 8 pyramid needs two to six addends.");
  const total = addends.reduce((sum, value) => sum + value, 0);
  const width = Math.max(String(total).length, ...addends.map((value) => String(value).length));
  const columns = [];
  let carry = 0;
  for (let offset = 0; offset < width; offset += 1) {
    const digits = addends.map((value) => Number(String(value).padStart(width, "0")[width - offset - 1]));
    const columnTotal = digits.reduce((sum, value) => sum + value, carry);
    columns.push({ digits, carryIn: carry, digit: columnTotal % 10, carryOut: Math.floor(columnTotal / 10) });
    carry = Math.floor(columnTotal / 10);
  }
  if (carry) columns.push({ digits: [], carryIn: carry, digit: carry, carryOut: 0 });
  return { addends, total, width: Math.max(width, columns.length), columns };
}

function verticalStackMarkup(model, phase) {
  const color = phase === "verify" ? BOOK08_COLOR.verify : phase === "calculate" ? BOOK08_COLOR.action : BOOK08_COLOR.given;
  const result = phase === "verify" ? String(model.total) : "?";
  const rows = model.addends.map((value, index) => `<div style="display:grid;grid-template-columns:28px repeat(${model.width},38px);align-items:center"><b style="color:${color};text-align:center">${index === model.addends.length - 1 ? "+" : ""}</b>${String(value).padStart(model.width, " ").split("").map((digit) => `<span style="display:grid;place-items:center;height:36px;border-bottom:1px solid ${BOOK08_COLOR.muted};font-size:20px;font-weight:900">${digit.trim() ? digit : "&nbsp;"}</span>`).join("")}</div>`).join("");
  return `<div aria-label="자릿수를 맞춘 덧셈" style="display:grid;gap:3px;padding:12px 14px;border:2px solid ${color};background:${phase === "verify" ? BOOK08_COLOR.verifyWash : BOOK08_COLOR.paper}">${rows}<div style="display:grid;grid-template-columns:28px 1fr;border-top:3px solid ${color}"><i></i><strong style="padding-top:7px;color:${color};font-size:23px;text-align:right;letter-spacing:10px">${result}</strong></div></div>`;
}

function pyramidFrame(experience, phase) {
  const model = pyramidModel(experience);
  const stack = verticalStackMarkup(model, phase);
  if (phase === "problem") return stack;
  const placeNames = ["일", "십", "백", "천", "만", "십만"];
  const columns = model.columns.slice(0, model.width).map((column, index) => {
    const terms = [...(column.carryIn ? [column.carryIn] : []), ...column.digits].filter((value) => value !== 0);
    const expression = terms.length ? terms.join(" + ") : "0";
    const value = phase === "verify" ? column.digit : "?";
    return `<span style="display:grid;gap:3px;place-items:center;min-width:72px;padding:7px;border-bottom:3px solid ${phase === "verify" ? BOOK08_COLOR.verify : BOOK08_COLOR.action};background:${phase === "verify" ? BOOK08_COLOR.verifyWash : BOOK08_COLOR.actionWash}"><small style="font-weight:900">${placeNames[index] || `${index + 1}번째`} 자리</small><b style="font-size:15px">${expression}</b><strong style="color:${phase === "verify" ? BOOK08_COLOR.verify : BOOK08_COLOR.action};font-size:20px">${value}</strong></span>`;
  }).reverse().join("");
  const placeWork = `<div aria-label="자리별 덧셈" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px">${columns}</div>`;
  if (phase === "calculate") return `${stack}${placeWork}`;
  const remaining = model.addends.slice(1).reduce((value, addend) => value - addend, model.total);
  const check = `${model.total} - ${model.addends.slice(1).join(" - ")} = ${remaining}`;
  return `${stack}${placeWork}<div data-book08-answer="${model.total}" data-book08-check="${escapeHtml(check)}" style="display:grid;gap:4px;justify-items:center;color:${BOOK08_COLOR.verify};font-weight:900"><strong style="font-size:25px">${model.addends.join(" + ")} = ${model.total}</strong><span style="font-size:16px">${check}</span></div>`;
}

function parseEquation(equation) {
  const parts = String(equation).split("=").map((part) => part.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) throw new Error(`Invalid Book 8 equation: ${equation}`);
  return { left: parts[0], right: parts[1], source: String(equation) };
}

function isNumberToken(token) {
  return /^-?\d+(?:\.\d+)?$/.test(token);
}

function isSymbolToken(token) {
  return !isNumberToken(token) && !/[+\-×÷]/.test(token);
}

function evaluateExpression(expression, known) {
  const token = String(expression).trim();
  if (isNumberToken(token)) return Number(token);
  if (isSymbolToken(token)) return known.has(token) ? known.get(token) : null;
  const match = token.match(/^(.+?)\s*([+\-×÷])\s*(.+)$/);
  if (!match) return null;
  const left = evaluateExpression(match[1], known);
  const right = evaluateExpression(match[3], known);
  if (left === null || right === null) return null;
  if (match[2] === "+") return left + right;
  if (match[2] === "-") return left - right;
  if (match[2] === "×") return left * right;
  if (right === 0) throw new Error("Book 8 shape equation divides by zero.");
  return left / right;
}

function shapeEquationModel(experience) {
  const beats = experience?.beats || [];
  const equationSets = beats.map((item) => item?.visual?.subtype === "symbol-equations" ? item.visual.equations || [] : []);
  if (!equationSets[0]?.length) throw new Error("Book 8 shape equations are missing.");
  const firstSources = new Set(equationSets[0].map(String));
  const parsed = equationSets.flat().map(parseEquation).filter((equation, index, all) => all.findIndex((item) => item.source === equation.source) === index);
  const known = new Map();
  for (const equation of parsed) {
    if (!firstSources.has(equation.source)) continue;
    if (isSymbolToken(equation.left) && isNumberToken(equation.right)) known.set(equation.left, Number(equation.right));
    if (isSymbolToken(equation.right) && isNumberToken(equation.left)) known.set(equation.right, Number(equation.left));
  }
  const relations = parsed.filter((equation) => firstSources.has(equation.source) || !(isSymbolToken(equation.left) && isNumberToken(equation.right)));
  for (let pass = 0; pass < relations.length + 2; pass += 1) {
    let changed = false;
    for (const equation of relations) {
      const leftValue = evaluateExpression(equation.left, known);
      const rightValue = evaluateExpression(equation.right, known);
      if (isSymbolToken(equation.left) && leftValue === null && rightValue !== null) {
        known.set(equation.left, rightValue);
        changed = true;
      } else if (isSymbolToken(equation.right) && rightValue === null && leftValue !== null) {
        known.set(equation.right, leftValue);
        changed = true;
      } else if (leftValue !== null && rightValue !== null && leftValue !== rightValue) {
        throw new Error(`Conflicting Book 8 equation: ${equation.source}`);
      }
    }
    if (!changed) break;
  }
  const target = beats.at(-1)?.visual?.target;
  const answer = known.get(target);
  if (!target || !Number.isFinite(answer)) throw new Error("Book 8 target shape is not uniquely calculable.");
  return { equationSets, relations, known, target, answer };
}

function equationTokens(equation, color, known = null, revealValues = false) {
  return String(equation).split(/\s*([=+\-×÷])\s*/).filter(Boolean).map((token) => {
    const value = revealValues && known?.has(token) ? `<small style="font-size:11px">${known.get(token)}</small>` : "";
    const boxed = isSymbolToken(token) && token !== "=";
    return `<span style="display:grid;place-items:center;min-width:${boxed ? "42px" : "22px"};height:${boxed ? "42px" : "auto"};padding:0 5px;border:${boxed ? `2px solid ${color}` : "0"};background:${boxed ? BOOK08_COLOR.paper : "transparent"};color:${color};font-size:${boxed ? "22px" : "18px"};font-weight:900">${escapeHtml(token)}${value}</span>`;
  }).join("");
}

function shapeEquationFrame(experience, beat, phase, step) {
  const model = shapeEquationModel(experience);
  const current = model.equationSets[Math.min(step, model.equationSets.length - 1)] || [];
  if (phase === "problem") {
    const rows = current.map((equation) => `<div style="display:flex;align-items:center;justify-content:center;gap:5px">${equationTokens(equation, BOOK08_COLOR.given)}</div>`).join("");
    return `<div aria-label="주어진 도형식" style="display:grid;gap:10px;padding:14px;border:2px solid ${BOOK08_COLOR.given};background:${BOOK08_COLOR.wash}">${rows}</div>`;
  }
  if (phase === "calculate") {
    const rows = current.map((equation) => {
      const parsed = parseEquation(equation);
      const left = evaluateExpression(parsed.left, model.known);
      const right = evaluateExpression(parsed.right, model.known);
      const unresolvedSide = left === null ? parsed.left : right === null ? parsed.right : isSymbolToken(parsed.right) ? parsed.right : parsed.left;
      const knownSide = left === null ? right : left;
      const expression = knownSide === null ? "?" : `${knownSide} = ${unresolvedSide}`;
      return `<div style="display:grid;gap:5px;place-items:center;padding:8px 12px;border-bottom:3px solid ${BOOK08_COLOR.action};background:${BOOK08_COLOR.actionWash}"><span style="display:flex;align-items:center;justify-content:center;gap:5px">${equationTokens(equation, BOOK08_COLOR.action)}</span><small style="color:${BOOK08_COLOR.action};font-size:13px;font-weight:900">${escapeHtml(expression.replace(/^\d+(?:\.\d+)? = /, "? = "))}</small></div>`;
    }).join("");
    return `<div data-book08-expression aria-label="도형값을 정리하는 계산" style="display:grid;gap:9px;width:min(100%,420px)">${rows}</div>`;
  }
  const finalEquation = model.relations.find((equation) => equation.right === model.target || equation.left === model.target);
  if (!finalEquation) throw new Error("Book 8 target equation is missing.");
  const rows = model.equationSets.at(-1).map((equation) => `<div style="display:flex;align-items:center;justify-content:center;gap:5px">${equationTokens(equation, BOOK08_COLOR.verify, model.known, true)}</div>`).join("");
  const checkValue = finalEquation.right === model.target
    ? evaluateExpression(finalEquation.left, model.known)
    : evaluateExpression(finalEquation.right, model.known);
  const check = `${finalEquation.source} → ${model.target} = ${checkValue}`;
  return `<div aria-label="도형값 검산" style="display:grid;gap:10px;padding:14px;border:2px solid ${BOOK08_COLOR.verify};background:${BOOK08_COLOR.verifyWash}">${rows}</div><div data-book08-answer="${model.answer}" data-book08-check="${escapeHtml(check)}" style="display:grid;gap:4px;justify-items:center;color:${BOOK08_COLOR.verify};font-weight:900"><strong style="font-size:25px">${escapeHtml(model.target)} = ${model.answer}</strong><span style="font-size:16px">${escapeHtml(check)}</span></div>`;
}

export function renderBook08Guided(experience, beat, step) {
  if (!experience || !SUPPORTED_FAMILIES.has(experience.family)) return "";
  if (!Array.isArray(experience.beats) || experience.beats.length < 3) {
    throw new Error(`${experience.family} needs at least three beats.`);
  }
  const boundedStep = Math.max(0, Math.min(finiteInteger(step, "guided step", { minimum: 0 }), experience.beats.length - 1));
  const activeBeat = beat || experience.beats[boundedStep];
  const phase = phaseFor(experience, activeBeat, boundedStep);
  let content = "";
  if (experience.family === "book08-picture-division") content = divisionFrame(experience, phase);
  else if (experience.family === "book08-pyramid-cryptarithm") content = pyramidFrame(experience, phase);
  else content = shapeEquationFrame(experience, activeBeat, phase, boundedStep);
  return phaseShell(experience.family, phase, content);
}
