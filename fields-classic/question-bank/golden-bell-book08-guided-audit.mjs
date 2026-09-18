import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js?v=20260905e";
import { renderBook08Guided } from "./golden-bell-book08-guided.js";

const TARGETS = Object.freeze([
  "book08-picture-division",
  "book08-pyramid-cryptarithm",
  "book08-shape-equation-targets"
]);

const COLORS = Object.freeze({ given: "#187fa9", action: "#d39b20", verify: "#16734b" });
const failures = [];

function normalize(html) {
  return String(html).replace(/\s+/g, " ").trim();
}

function visibleText(html) {
  return String(html)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\s+/g, " ")
    .trim();
}

function integer(value, label) {
  const number = Number(value);
  if (!Number.isSafeInteger(number)) throw new Error(`${label} is not an integer.`);
  return number;
}

function divisionAnswer(experience) {
  const row = experience.beats.flatMap((beat) => beat.visual?.rows || []).find((candidate) => Array.isArray(candidate) && candidate.includes("÷"));
  const at = row?.indexOf("÷") ?? -1;
  if (at < 1 || at >= row.length - 1) throw new Error("division expression missing");
  const dividend = integer(row[at - 1], "dividend");
  const divisor = integer(row[at + 1], "divisor");
  if (divisor <= 0 || dividend % divisor !== 0) throw new Error("division is not an equal whole grouping");
  return dividend / divisor;
}

function pyramidAnswer(experience) {
  const visual = experience.beats.map((beat) => beat.visual).find((item) => item?.subtype === "vertical-stack");
  if (!visual?.addends?.length) throw new Error("pyramid addends missing");
  return visual.addends.reduce((sum, value, index) => sum + integer(value, `addend ${index + 1}`), 0);
}

function parseEquation(source) {
  const parts = String(source).split("=").map((part) => part.trim());
  if (parts.length !== 2) throw new Error(`bad equation ${source}`);
  return { left: parts[0], right: parts[1], source: String(source) };
}

function numberToken(token) {
  return /^-?\d+(?:\.\d+)?$/.test(token);
}

function symbolToken(token) {
  return !numberToken(token) && !/[+\-×÷]/.test(token);
}

function valueOf(expression, known) {
  const token = String(expression).trim();
  if (numberToken(token)) return Number(token);
  if (symbolToken(token)) return known.has(token) ? known.get(token) : null;
  const match = token.match(/^(.+?)\s*([+\-×÷])\s*(.+)$/);
  if (!match) return null;
  const left = valueOf(match[1], known);
  const right = valueOf(match[3], known);
  if (left === null || right === null) return null;
  if (match[2] === "+") return left + right;
  if (match[2] === "-") return left - right;
  if (match[2] === "×") return left * right;
  if (right === 0) throw new Error("shape equation divides by zero");
  return left / right;
}

function shapeAnswer(experience) {
  const sets = experience.beats.map((beat) => beat.visual?.subtype === "symbol-equations" ? beat.visual.equations || [] : []);
  const first = new Set(sets[0].map(String));
  const equations = sets.flat().map(parseEquation).filter((equation, index, all) => all.findIndex((item) => item.source === equation.source) === index);
  const known = new Map();
  for (const equation of equations) {
    if (!first.has(equation.source)) continue;
    if (symbolToken(equation.left) && numberToken(equation.right)) known.set(equation.left, Number(equation.right));
    if (symbolToken(equation.right) && numberToken(equation.left)) known.set(equation.right, Number(equation.left));
  }
  const relations = equations.filter((equation) => first.has(equation.source) || !(symbolToken(equation.left) && numberToken(equation.right)));
  for (let pass = 0; pass < relations.length + 2; pass += 1) {
    let changed = false;
    for (const equation of relations) {
      const left = valueOf(equation.left, known);
      const right = valueOf(equation.right, known);
      if (symbolToken(equation.left) && left === null && right !== null) {
        known.set(equation.left, right);
        changed = true;
      } else if (symbolToken(equation.right) && right === null && left !== null) {
        known.set(equation.right, left);
        changed = true;
      } else if (left !== null && right !== null && left !== right) {
        throw new Error(`conflicting equation ${equation.source}`);
      }
    }
    if (!changed) break;
  }
  const target = experience.beats.at(-1)?.visual?.target;
  const answer = known.get(target);
  if (!target || !Number.isFinite(answer)) throw new Error("shape target is unresolved");
  return answer;
}

const calculators = Object.freeze({
  "book08-picture-division": divisionAnswer,
  "book08-pyramid-cryptarithm": pyramidAnswer,
  "book08-shape-equation-targets": shapeAnswer
});

const guided = [];
for (const book of GOLDEN_BELL_BOOKS) {
  for (const lesson of book.lessons || []) {
    if (TARGETS.includes(lesson.experience?.family)) guided.push({ book, lesson, experience: lesson.experience });
  }
}

for (const family of TARGETS) {
  const matches = guided.filter((record) => record.experience.family === family);
  if (matches.length !== 1) {
    failures.push(`${family}: expected one actual lesson, found ${matches.length}`);
    continue;
  }
  const { book, lesson, experience } = matches[0];
  if (book.id !== "book-08") failures.push(`${family}: found outside Book 8 (${book.id})`);
  if (!Array.isArray(experience.beats) || experience.beats.length < 3) {
    failures.push(`${family}: needs at least three beats`);
    continue;
  }

  let independentAnswer;
  try {
    independentAnswer = calculators[family](experience);
  } catch (error) {
    failures.push(`${family}: independent calculation failed: ${error.message}`);
    continue;
  }

  const frames = experience.beats.map((beat, step) => {
    try {
      return normalize(renderBook08Guided(experience, beat, step));
    } catch (error) {
      failures.push(`${family}: beat ${step + 1} threw: ${error.message}`);
      return "";
    }
  });

  if (frames.some((frame) => !frame)) failures.push(`${family}: empty HTML frame`);
  if (new Set(frames).size !== frames.length) failures.push(`${family}: identical semantic frames`);

  frames.forEach((frame, step) => {
    if (!frame) return;
    const final = step === frames.length - 1;
    const expectedPhase = step === 0 ? "problem" : final ? "verify" : "calculate";
    const expectedRole = step === 0 ? "given" : final ? "verify" : "action";
    const expectedColor = step === 0 ? COLORS.given : final ? COLORS.verify : COLORS.action;
    if (!frame.includes(`data-book08-family="${family}"`)) failures.push(`${family}: beat ${step + 1} family marker missing`);
    if (!frame.includes(`data-book08-phase="${expectedPhase}"`)) failures.push(`${family}: beat ${step + 1} phase marker mismatch`);
    if (!frame.includes(`data-color-role="${expectedRole}"`) || !frame.includes(expectedColor)) failures.push(`${family}: beat ${step + 1} color semantics mismatch`);
    if (/\b(?:NaN|undefined)\b/.test(frame)) failures.push(`${family}: beat ${step + 1} contains NaN/undefined`);
    if (!final && /data-book08-(?:answer|check)=/.test(frame)) failures.push(`${family}: beat ${step + 1} leaks answer/check metadata`);
    if (!final && frame.includes(COLORS.verify)) failures.push(`${family}: beat ${step + 1} leaks verified green`);
    if (!final) {
      const text = visibleText(frame);
      const answerToken = String(independentAnswer).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`(^|[^0-9.])${answerToken}([^0-9.]|$)`).test(text)) {
        failures.push(`${family}: beat ${step + 1} exposes final answer ${independentAnswer} in visible text`);
      }
    }
  });

  const verify = frames.at(-1) || "";
  const renderedAnswer = verify.match(/data-book08-answer="([^"]+)"/)?.[1];
  const renderedCheck = verify.match(/data-book08-check="([^"]+)"/)?.[1];
  if (Number(renderedAnswer) !== independentAnswer) failures.push(`${family}: rendered answer ${renderedAnswer} != independent ${independentAnswer}`);
  if (!renderedCheck) failures.push(`${family}: verify check is missing`);
  const optionValues = experience.check?.options?.map(String) || [];
  if (!optionValues.includes(String(independentAnswer))) failures.push(`${family}: independently calculated answer is absent from check options`);
  console.log(`BOOK08_GUIDED_OK id=${book.id}/${lesson.id} family=${family} beats=${frames.length} answer=${independentAnswer} hiddenBeforeVerify=pass`);
}

if (failures.length) {
  console.error("BOOK08_GUIDED_AUDIT_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`BOOK08_GUIDED_AUDIT_OK families=${TARGETS.length} empty=0 identical=0 invalid=0 leaks=0 calculationMismatch=0`);
}
