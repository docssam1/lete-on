"use strict";

global.window = {};
require("./math-notation.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const notation = window.HSE_MATH_NOTATION;
const inventory = require("./source-inventory/5-1-u4-e4-readiness-review.json");
const unit = window.HSE_CURRICULUM.semesters
  .find(semester => semester.id === "5-1")?.units.find(item => item.id === "5-1-u4");
const types = unit?.subunits.flatMap(subunit => subunit.types) || [];
const branches = types.filter(type => type.sourceItemId?.startsWith("5-1-u4-e4-"));
const failures = [];
let checked = 0;

const sourceIds = [
  "5-1-u4-e4-exploration",
  "5-1-u4-e4-example-4-1",
  "5-1-u4-e4-example-4-2",
  "5-1-u4-e4-example-4-3",
  "5-1-u4-e4-example-4-4",
  "5-1-u4-e4-mission-1",
  "5-1-u4-e4-mission-2",
  "5-1-u4-e4-mission-3",
  "5-1-u4-e4-mission-4",
  "5-1-u4-e4-mission-5",
  "5-1-u4-e4-mission-6"
];

const kinds = [
  "fixed-numerator-set",
  "even-denominator-irreducible-set",
  "fixed-numerator-irreducible-count",
  "nearest-fixed-numerator",
  "decimal-bounds-fixed-denominator-count",
  "fixed-numerator-denominator-sum",
  "fixed-denominator-numerator-count",
  "ordered-blank-denominators-maximum",
  "chained-adjacent-fraction-set",
  "same-base-fixed-numerator-count",
  "nearest-fixed-numerator"
];

const contracts = [
  "set", "set", "single-value", "single-value", "single-value", "single-value",
  "single-value", "ordered", "set", "single-value", "single-value"
];

const fail = message => failures.push(message);
const range = (from, to) => Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index);
const gcd = (left, right) => {
  left = Math.abs(left);
  right = Math.abs(right);
  while (right) [left, right] = [right, left % right];
  return left || 1;
};
const reduce = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
};
const fractionText = (numerator, denominator) => {
  const [reducedNumerator, reducedDenominator] = reduce(numerator, denominator);
  return `${reducedNumerator}/${reducedDenominator}`;
};
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const compareFraction = (left, right) => left[0] * right[1] - right[0] * left[1];
const compareDistance = (left, right) => left.numerator * right.denominator - right.numerator * left.denominator;
const distance = (fraction, target) => ({
  numerator: Math.abs(fraction[0] * target[1] - target[0] * fraction[1]),
  denominator: fraction[1] * target[1]
});

function parseTag(prompt) {
  const matches = [...String(prompt).matchAll(/<span hidden\b[^>]*data-conditional-fraction-e4-kind="([^"]+)"[^>]*data-values="([^"]*)"[^>]*data-result-contract="([^"]+)"[^>]*><\/span>/g)];
  if (matches.length !== 1) throw new Error(`hidden audit tag count is ${matches.length}, expected 1`);
  const [, kind, rawValues, contract] = matches[0];
  const values = rawValues.split(",").filter(Boolean).map(Number);
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) throw new Error("hidden audit tag contains non-integer values");
  return { kind, values, contract };
}

function strictDenominators(numerator, leftNumerator, leftDenominator, rightNumerator, rightDenominator) {
  if (leftNumerator * rightDenominator >= rightNumerator * leftDenominator) throw new Error("interval endpoints are not increasing");
  const maximum = Math.ceil(numerator * leftDenominator / leftNumerator) - 1;
  return range(1, maximum).filter(denominator => (
    leftNumerator * denominator < numerator * leftDenominator
      && numerator * rightDenominator < rightNumerator * denominator
  ));
}

function strictNumerators(denominator, leftNumerator, leftDenominator, rightNumerator, rightDenominator) {
  if (leftNumerator * rightDenominator >= rightNumerator * leftDenominator) throw new Error("interval endpoints are not increasing");
  const maximum = Math.ceil(rightNumerator * denominator / rightDenominator);
  return range(1, maximum).filter(numerator => (
    leftNumerator * denominator < numerator * leftDenominator
      && numerator * rightDenominator < rightNumerator * denominator
  ));
}

function independent(kind, values) {
  if (kind === "fixed-numerator-set" || kind === "even-denominator-irreducible-set" || kind === "fixed-numerator-irreducible-count" || kind === "fixed-numerator-denominator-sum") {
    const [numerator, leftNumerator, leftDenominator, rightNumerator, rightDenominator] = values;
    let denominators = strictDenominators(numerator, leftNumerator, leftDenominator, rightNumerator, rightDenominator);
    if (kind === "even-denominator-irreducible-set") denominators = denominators.filter(denominator => denominator % 2 === 0 && gcd(numerator, denominator) === 1);
    if (kind === "fixed-numerator-irreducible-count") denominators = denominators.filter(denominator => gcd(numerator, denominator) === 1);
    if (kind === "fixed-numerator-denominator-sum") return { kind, answerKind: "number", value: denominators.reduce((sum, denominator) => sum + denominator, 0), candidates: denominators };
    if (!denominators.length) throw new Error("fixed-numerator interval has no candidates");
    if (kind === "fixed-numerator-irreducible-count") return { kind, answerKind: "number", value: denominators.length, candidates: denominators };
    return { kind, answerKind: "set", value: denominators.map(denominator => fractionText(numerator, denominator)), candidates: denominators.map(denominator => [numerator, denominator]) };
  }
  if (kind === "nearest-fixed-numerator") {
    const [numerator, targetNumerator, targetDenominator] = values;
    const exactNumerator = numerator * targetDenominator;
    const exactDenominator = targetNumerator;
    const floorDenominator = Math.floor(exactNumerator / exactDenominator);
    const candidateDenominators = [...new Set([floorDenominator, floorDenominator + 1].filter(denominator => denominator >= 1))];
    const candidates = candidateDenominators.map(denominator => ({ denominator, difference: distance([numerator, denominator], [targetNumerator, targetDenominator]) }));
    candidates.sort((left, right) => compareDistance(left.difference, right.difference));
    if (!candidates.length || (candidates.length > 1 && compareDistance(candidates[0].difference, candidates[1].difference) === 0)) throw new Error("nearest fixed-numerator fraction is not unique");
    return { kind, answerKind: "fraction", value: fractionText(numerator, candidates[0].denominator), candidates: candidateDenominators.map(denominator => [numerator, denominator]) };
  }
  if (kind === "decimal-bounds-fixed-denominator-count") {
    const [denominator, lowerScaled, upperScaled, scale] = values;
    const maximum = Math.ceil(upperScaled * denominator / scale);
    const candidates = range(1, maximum).filter(numerator => (
      lowerScaled * denominator < numerator * scale
        && numerator * scale < upperScaled * denominator
        && gcd(numerator, denominator) === 1
    ));
    return { kind, answerKind: "number", value: candidates.length, candidates };
  }
  if (kind === "fixed-denominator-numerator-count") {
    const [denominator, leftNumerator, leftDenominator, rightNumerator, rightDenominator] = values;
    const candidates = strictNumerators(denominator, leftNumerator, leftDenominator, rightNumerator, rightDenominator);
    return { kind, answerKind: "number", value: candidates.length, candidates };
  }
  if (kind === "ordered-blank-denominators-maximum") {
    const [firstNumerator, firstDenominator, sharedNumerator, middleNumerator, middleDenominator, lastNumerator, lastDenominator] = values;
    const first = strictDenominators(sharedNumerator, firstNumerator, firstDenominator, middleNumerator, middleDenominator);
    const second = strictDenominators(sharedNumerator, middleNumerator, middleDenominator, lastNumerator, lastDenominator);
    const candidates = first.flatMap(left => second.map(right => ({ left, right, difference: left - right })));
    if (!candidates.length) throw new Error("ordered denominator pair has no candidates");
    const maximum = Math.max(...candidates.map(candidate => candidate.difference));
    const winners = candidates.filter(candidate => candidate.difference === maximum);
    if (winners.length !== 1) throw new Error(`ordered denominator pair has ${winners.length} maximum candidates`);
    return { kind, answerKind: "ordered", value: [winners[0].left, winners[0].right], candidates };
  }
  if (kind === "chained-adjacent-fraction-set") {
    const [denominator, lowerScaled, upperScaled, scale, upperDenominator] = values;
    const firstCandidates = range(1, denominator - 1).filter(numerator => (
      lowerScaled * denominator < numerator * scale
        && numerator * scale < upperScaled * denominator
        && gcd(numerator, denominator) === 1
    ));
    if (firstCandidates.length !== 1) throw new Error(`first condition fraction has ${firstCandidates.length} candidates`);
    const firstNumerator = firstCandidates[0];
    const upperNumerator = upperDenominator - 1;
    const adjacent = range(1, upperDenominator - 2).filter(numerator => (
      firstNumerator * (numerator + 1) < numerator * denominator
        && numerator * upperDenominator < upperNumerator * (numerator + 1)
    ));
    if (!adjacent.length) throw new Error("chained adjacent-fraction set is empty");
    return { kind, answerKind: "set", value: adjacent.map(numerator => fractionText(numerator, numerator + 1)), candidates: adjacent.map(numerator => [numerator, numerator + 1]), first: [firstNumerator, denominator], upper: [upperNumerator, upperDenominator] };
  }
  if (kind === "same-base-fixed-numerator-count") {
    const [baseDenominator, lowerNumerator, upperNumerator, numerator] = values;
    const candidates = strictDenominators(numerator, lowerNumerator, baseDenominator, upperNumerator, baseDenominator);
    return { kind, answerKind: "number", value: candidates.length, candidates };
  }
  throw new Error(`unknown hidden audit kind ${kind}`);
}

function parseIntegerAnswer(answer) {
  const values = String(answer).replaceAll(",", "").match(/-?\d+/g) || [];
  if (values.length !== 1) throw new Error(`number answer is not singular: ${answer}`);
  return Number(values[0]);
}

function parseFractionAnswer(answer) {
  const matches = [...String(answer).matchAll(/(\d+)\s*\/\s*(\d+)/g)];
  if (matches.length !== 1) throw new Error(`fraction answer is not singular: ${answer}`);
  return fractionText(Number(matches[0][1]), Number(matches[0][2]));
}

function parseFractionSet(answer) {
  const matches = [...String(answer).matchAll(/(\d+)\s*\/\s*(\d+)/g)];
  if (!matches.length) throw new Error(`fraction set is empty: ${answer}`);
  const values = matches.map(match => fractionText(Number(match[1]), Number(match[2])));
  if (new Set(values).size !== values.length) throw new Error(`fraction set contains a duplicate: ${answer}`);
  return [...new Set(values)].sort((left, right) => {
    const [leftNumerator, leftDenominator] = left.split("/").map(Number);
    const [rightNumerator, rightDenominator] = right.split("/").map(Number);
    return compareFraction([leftNumerator, leftDenominator], [rightNumerator, rightDenominator]);
  });
}

function parseOrderedAnswer(answer) {
  const values = String(answer).match(/\d+/g)?.map(Number) || [];
  if (values.length !== 2) throw new Error(`ordered answer is not a pair: ${answer}`);
  return values;
}

function checkAnswer(generated, calculated) {
  if (calculated.answerKind === "number" && parseIntegerAnswer(generated.answer) !== calculated.value) throw new Error(`independent number ${calculated.value} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "fraction" && parseFractionAnswer(generated.answer) !== calculated.value) throw new Error(`independent fraction ${calculated.value} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "set" && !sameArray(parseFractionSet(generated.answer), [...calculated.value].sort((left, right) => {
    const [leftNumerator, leftDenominator] = left.split("/").map(Number);
    const [rightNumerator, rightDenominator] = right.split("/").map(Number);
    return compareFraction([leftNumerator, leftDenominator], [rightNumerator, rightDenominator]);
  }))) throw new Error(`independent set ${calculated.value.join(", ")} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "ordered" && !sameArray(parseOrderedAnswer(generated.answer), calculated.value)) throw new Error(`independent ordered pair ${calculated.value.join(", ")} differs from shown ${generated.answer}`);
}

function checkSolutionConsistency(generated, calculated) {
  const solution = String(generated.solution);
  if (calculated.answerKind === "number") {
    const value = String(calculated.value);
    if (!new RegExp("(?<!\\d)" + value + "(?!\\d)").test(plainText(solution))) throw new Error("solution does not contain the independent number " + value);
  }
  if (calculated.answerKind === "fraction") {
    const [numerator, denominator] = calculated.value.split("/").map(Number);
    const label = "aria-label=\"" + denominator + "분의 " + numerator + "\"";
    if (!solution.includes(label)) throw new Error("solution does not contain the independent fraction " + calculated.value);
  }
  if (calculated.answerKind === "set") {
    for (const value of calculated.value) {
      const [numerator, denominator] = value.split("/").map(Number);
      const label = "aria-label=\"" + denominator + "분의 " + numerator + "\"";
      if (!solution.includes(label)) throw new Error("solution does not contain set member " + value);
    }
  }
  if (calculated.answerKind === "ordered") {
    const [first, second] = calculated.value;
    if (!solution.includes("ㄱ=" + first) || !solution.includes("ㄴ=" + second)) throw new Error("solution does not contain ordered pair " + first + "," + second);
  }
}

function stripHidden(markup) {
  return String(markup).replace(/<span hidden\b[\s\S]*?<\/span>/g, "");
}

function plainText(markup) {
  return stripHidden(markup)
    .replace(/<svg\b[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function checkMathNotation(generated, calculated) {
  const visibleMarkup = `${stripHidden(generated.prompt)}\\n${generated.solution}`;
  const visibleWithoutSvg = visibleMarkup.replace(/<svg\b[\s\S]*?<\/svg>/g, " ");
  if (/\b\d+\s*\/\s*\d+\b/.test(visibleWithoutSvg)) throw new Error("visible prompt or solution contains a raw numeric fraction");
  if ((visibleWithoutSvg.match(/class="math-fraction"/g) || []).length === 0 && calculated.answerKind !== "number") throw new Error("fraction content is not stacked with math-fraction markup");
  if (/class="math-fraction"/.test(visibleWithoutSvg) && !/class="math-fraction"[^>]*role="img"[^>]*aria-label="[^"]+"/.test(visibleWithoutSvg)) throw new Error("stacked fraction is missing accessibility metadata");
  if (String(generated.answer).includes("/")) {
    const tokens = notation.tokenize(generated.answer);
    const fractions = String(generated.answer).match(/\d+\s*\/\s*\d+/g) || [];
    if (tokens.filter(token => token.type === "fraction").length !== fractions.length) throw new Error("answer fraction is not recognized by the shared math notation parser");
  }
  if (/NaN|undefined|null|Infinity|\^|\$\{/.test(visibleMarkup)) throw new Error("broken value or caret math notation is visible");
}

function checkElementaryLanguage(generated) {
  const visible = plainText(`${generated.prompt}\\n${generated.solution}\\n${generated.answer}`);
  const prohibited = [
    /제곱근|순열|조합|방정식|미지수|팩토리얼|소인수분해/,
    /\b(?:sqrt|Euler|phi|gcd|lcm|permutation|combination)\b/i,
    /NaN|undefined|null|Infinity/
  ];
  for (const pattern of prohibited) if (pattern.test(visible)) throw new Error(`non-elementary or broken language matched ${pattern}`);
}

function checkInventoryAndSource() {
  if (!unit) fail("5-1 약분과 통분 단원을 찾을 수 없습니다.");
  if (types.length !== 44) fail(`5-1 U4 has ${types.length} types, expected 44`);
  if (branches.length !== 11) fail(`5-1 U4 E4 has ${branches.length} branches, expected 11`);
  if (!sameArray(branches.map(type => type.sourceItemId), sourceIds)) fail("E4 source IDs are not in source order");
  if (new Set(branches.map(type => type.sourceItemId)).size !== 11) fail("E4 source IDs are not unique");
  if (inventory.schemaVersion !== 1 || inventory.semester !== "5-1" || inventory.unit !== 4 || inventory.subunit !== "조건에 맞는 분수 찾기") fail("readiness inventory identifies the wrong scope");
  if (!sameArray(inventory.sourcePagesDirectlyReviewed || [], [47, 48]) || inventory.items?.length !== 11) fail("readiness inventory pages or item count is wrong");
  inventory.items?.forEach((item, index) => {
    const type = branches[index];
    const expectedPage = index < 5 ? 47 : 48;
    const expectedSection = index === 0 ? "exploration" : index < 5 ? "example" : "mission";
    if (!type || item.sourceItemId !== sourceIds[index] || type.sourceItemId !== sourceIds[index]) fail(`source item ${index}: inventory and runtime IDs differ`);
    if (item.sourceSection !== expectedSection || item.sourcePdfPage !== expectedPage || item.sourcePrintedPage !== expectedPage + 1) fail(`${sourceIds[index]}: inventory section or page is wrong`);
    if (!item.sourceVerified || !item.singleAnswer) fail(`${sourceIds[index]}: source verification or single-answer declaration is missing`);
  });
  branches.forEach((type, index) => {
    const expectedPage = index < 5 ? 47 : 48;
    if (type.variant !== index || type.generatorKey !== "equalFractionE4" || api.generatorKey(type) !== "conditionalFractionE4") fail(`${type.id}: generator linkage or variant is wrong`);
    if (!type.sourceVerified || type.reviewLocked || type.sourcePdfPage !== expectedPage || type.sourcePrintedPage !== expectedPage + 1) fail(`${type.id}: runtime source verification, lock, or page metadata is wrong`);
    if (type.sourceSection !== (index === 0 ? "exploration" : index < 5 ? "example" : "mission")) fail(`${type.id}: runtime source section is wrong`);
    if (!String(type.sourceEvidence).includes(`5-1 심화 기준본 PDF p.${expectedPage}`) || !String(type.sourceEvidence).includes(`교재 p.${expectedPage + 1}`) || !String(type.sourceEvidence).includes(type.sourceItemId)) fail(`${type.id}: source evidence does not carry ID and pages`);
  });
}

function checkSourceAnchors() {
  const anchors = [
    ["29/47, 29/48, 29/49", "unique-set"],
    ["17/22, 17/24, 17/26", "unique-set"],
    ["26개", "unique-scalar"],
    ["13/30", "unique-scalar"],
    ["18개", "unique-scalar"],
    ["22", "unique-scalar"],
    ["67개", "unique-scalar"],
    ["15,8", "unique-tuple"],
    ["2/3, 3/4, 4/5, 5/6, 6/7", "unique-set"],
    ["32개", "unique-scalar"],
    ["13/16", "unique-scalar"]
  ];
  inventory.items?.forEach((item, index) => {
    const [expectedAnswer, expectedState] = anchors[index] || [];
    if (!String(item.independentAnswer || "").replaceAll("㉠ ", "").replaceAll("㉡ ", "").replaceAll(" ", "").includes(expectedAnswer.replaceAll(" ", "")) || item.uniqueAnswerState !== expectedState) fail(`${sourceIds[index]}: source anchor answer/state does not match the reviewed original`);
  });
}

function run() {
  checkInventoryAndSource();
  checkSourceAnchors();
  branches.forEach((type, index) => {
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 1000; seed += 1) {
        try {
          const generated = api.generate(type, 0, difficulty, seed, type.variant);
          if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("problem, answer, or solution is empty");
          const tag = parseTag(generated.prompt);
          if (tag.kind !== kinds[index] || tag.contract !== contracts[index]) throw new Error(`tag ${tag.kind}/${tag.contract} does not match source branch ${index}`);
          const calculated = independent(tag.kind, tag.values);
          checkAnswer(generated, calculated);
          checkSolutionConsistency(generated, calculated);
          checkMathNotation(generated, calculated);
          checkElementaryLanguage(generated);
          if (difficulty === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("easy difficulty instruction is missing");
          if (difficulty === 0 && generated.prompt.includes("풀이 도움:")) throw new Error("standard difficulty contains easy guidance");
          if (difficulty === 1 && !generated.prompt.includes("양 끝값이 포함되지 않는지")) throw new Error("hard difficulty instruction is missing");
          checked += 1;
        } catch (error) {
          fail(`${type.sourceItemId} / difficulty ${difficulty} / seed ${seed}: ${error.message}`);
        }
      }
    }
  });
  if (failures.length) {
    const counts = failures.reduce((summary, message) => {
      const sourceId = message.split(" / ")[0];
      summary.set(sourceId, (summary.get(sourceId) || 0) + 1);
      return summary;
    }, new Map());
    const summary = [...counts].map(([sourceId, count]) => `${sourceId}: ${count}건`).join(" · ");
    console.error(`5-1 조건에 맞는 분수 찾기 개념탐구 4 독립 감사 실패: ${failures.length}건, 검산 완료 ${checked.toLocaleString()}건\\n실패 요약: ${summary}\\n${failures.slice(0, 100).join("\\n")}`);
    process.exit(1);
  }
  console.log(`5-1 조건에 맞는 분수 찾기 개념탐구 4 독립 감사 통과: 원문 11항목 · ${checked.toLocaleString()}회 독립 전수 열거·정확한 유리수 비교·답 계약·분수 표기·초등 언어 검사`);
}

run();
