"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./math-notation.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const notation = window.HSE_MATH_NOTATION;
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-u4-e2-readiness-review.json"), "utf8"));
const unit = window.HSE_CURRICULUM.semesters
  .find(semester => semester.id === "5-1")?.units.find(item => item.id === "5-1-u4");
const types = unit?.subunits.flatMap(subunit => subunit.types) || [];
const branches = types.filter(type => type.sourceItemId?.startsWith("5-1-u4-e2-"));
const failures = [];
let checked = 0;

const sourceIds = [
  "5-1-u4-e2-exploration",
  "5-1-u4-e2-example-2-1",
  "5-1-u4-e2-example-2-2",
  "5-1-u4-e2-example-2-3",
  "5-1-u4-e2-example-2-4",
  "5-1-u4-e2-mission-1",
  "5-1-u4-e2-mission-2",
  "5-1-u4-e2-mission-3",
  "5-1-u4-e2-mission-4",
  "5-1-u4-e2-mission-5",
  "5-1-u4-e2-mission-6"
];

const kinds = [
  "reduction-count-plus-gcd",
  "unit-numerator-count",
  "reducible-proper-count",
  "irreducible-sequence-two-positions",
  "fixed-denominator-irreducible-position",
  "closest-fraction-from-gcd-lcm",
  "reverse-changed-reduction",
  "irreducible-proper-count",
  "shared-denominator-multiplier-set",
  "three-digit-numerator-reduced-denominator-count",
  "improper-from-sum-and-reduced-sum"
];

const contracts = kinds.map(kind => kind === "shared-denominator-multiplier-set" ? "set" : "single-value");
const answerKinds = [
  "number", "number", "number", "number", "fraction", "fraction", "fraction", "number", "set", "number", "fraction"
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
const sortedNumbers = values => [...values].sort((left, right) => left - right);

function parseTag(prompt) {
  const matches = [...String(prompt).matchAll(/<span hidden\b[^>]*data-irreducible-e2-kind="([^"]+)"[^>]*data-values="([^"]*)"[^>]*data-result-contract="([^"]+)"[^>]*><\/span>/g)];
  if (matches.length !== 1) throw new Error(`hidden audit tag count is ${matches.length}, expected 1`);
  const [, kind, rawValues, contract] = matches[0];
  const values = rawValues.split(",").filter(Boolean).map(Number);
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) throw new Error("hidden audit tag contains non-integer values");
  return { kind, values, contract };
}

function expected(kind, values) {
  if (kind === "reduction-count-plus-gcd") {
    const [numerator, denominator] = values;
    const greatest = gcd(numerator, denominator);
    const reducibleDivisors = range(2, greatest).filter(divisor => numerator % divisor === 0 && denominator % divisor === 0);
    if (gcd(numerator / greatest, denominator / greatest) !== 1) throw new Error("greatest common divisor did not produce a reduced fraction");
    return { contract: "single-value", answerKind: "number", value: reducibleDivisors.length + greatest, candidates: reducibleDivisors };
  }
  if (kind === "unit-numerator-count") {
    const [denominator] = values;
    const candidates = range(1, denominator - 1).filter(numerator => gcd(numerator, denominator) === numerator);
    return { contract: "single-value", answerKind: "number", value: candidates.length, candidates };
  }
  if (kind === "reducible-proper-count" || kind === "irreducible-proper-count") {
    const [denominator] = values;
    const candidates = range(1, denominator - 1).filter(numerator => gcd(numerator, denominator) > 1);
    const selected = kind === "reducible-proper-count" ? candidates : range(1, denominator - 1).filter(numerator => gcd(numerator, denominator) === 1);
    return { contract: "single-value", answerKind: "number", value: selected.length, candidates: selected };
  }
  if (kind === "irreducible-sequence-two-positions") {
    const [firstPosition, secondPosition] = values;
    const term = position => [2 * position - 1, 2 * position + 2];
    const locate = position => {
      const [targetNumerator, targetDenominator] = term(position);
      const candidates = range(1, position + 1).filter(candidate => {
        const [candidateNumerator, candidateDenominator] = term(candidate);
        return candidateNumerator * targetDenominator === targetNumerator * candidateDenominator;
      });
      if (candidates.length !== 1) throw new Error(`sequence target has ${candidates.length} candidate positions`);
      return candidates;
    };
    const firstCandidates = locate(firstPosition);
    const secondCandidates = locate(secondPosition);
    return { contract: "single-value", answerKind: "number", value: firstCandidates[0] + secondCandidates[0], candidates: [...firstCandidates, ...secondCandidates] };
  }
  if (kind === "fixed-denominator-irreducible-position") {
    const [denominator, position] = values;
    const candidates = [];
    let count = 0;
    for (let numerator = 1; numerator <= denominator * position * 2; numerator += 1) {
      if (gcd(numerator, denominator) !== 1) continue;
      count += 1;
      if (count === position) candidates.push(numerator);
      if (count > position) break;
    }
    if (candidates.length !== 1) throw new Error(`fixed-denominator position has ${candidates.length} candidate numerators`);
    return { contract: "single-value", answerKind: "fraction", value: fractionText(candidates[0], denominator), candidates };
  }
  if (kind === "closest-fraction-from-gcd-lcm") {
    const [greatest, least] = values;
    if (least % greatest !== 0) throw new Error("least common multiple is not divisible by greatest common divisor");
    const product = least / greatest;
    const pairs = range(1, product - 1)
      .filter(left => product % left === 0)
      .map(left => [left, product / left])
      .filter(([left, right]) => left < right && gcd(left, right) === 1);
    if (!pairs.length) throw new Error("no coprime factor pair satisfies the fraction conditions");
    const minimumDifference = Math.min(...pairs.map(([left, right]) => right - left));
    const best = pairs.filter(([left, right]) => right - left === minimumDifference);
    if (best.length !== 1) throw new Error(`closest fraction has ${best.length} tied pairs`);
    return { contract: "single-value", answerKind: "fraction", value: fractionText(best[0][0], best[0][1]), candidates: best };
  }
  if (kind === "reverse-changed-reduction") {
    const [targetNumerator, targetDenominator, commonDivisor, multiplyNumerator, subtractDenominator] = values;
    const candidates = [];
    const numeratorLimit = targetNumerator * commonDivisor * Math.max(1, multiplyNumerator) + commonDivisor;
    const denominatorLimit = targetDenominator * commonDivisor + subtractDenominator + commonDivisor * 2;
    for (let numerator = 1; numerator <= numeratorLimit; numerator += 1) {
      if (numerator * multiplyNumerator % commonDivisor !== 0) continue;
      if (numerator * multiplyNumerator / commonDivisor !== targetNumerator) continue;
      for (let denominator = subtractDenominator + 1; denominator <= denominatorLimit; denominator += 1) {
        if ((denominator - subtractDenominator) % commonDivisor !== 0) continue;
        if ((denominator - subtractDenominator) / commonDivisor !== targetDenominator) continue;
        candidates.push([numerator, denominator]);
      }
    }
    if (candidates.length !== 1) throw new Error(`reverse-change conditions have ${candidates.length} candidate fractions`);
    return { contract: "single-value", answerKind: "fraction", value: fractionText(candidates[0][0], candidates[0][1]), candidates };
  }
  if (kind === "shared-denominator-multiplier-set") {
    const fractions = [[values[0], values[1]], [values[2], values[3]], [values[4], values[5]]];
    const candidates = range(10, 99).filter(multiplier => fractions.every(([numerator, denominator]) => gcd(numerator, denominator * multiplier) === numerator));
    if (!candidates.length) throw new Error("no two-digit multiplier satisfies all three fraction conditions");
    return { contract: "set", answerKind: "set", value: sortedNumbers(candidates), candidates };
  }
  if (kind === "three-digit-numerator-reduced-denominator-count") {
    const [denominator, firstReducedDenominator, secondReducedDenominator] = values;
    const candidates = range(100, Math.min(999, denominator - 1)).filter(numerator => {
      const reducedDenominator = denominator / gcd(numerator, denominator);
      return reducedDenominator === firstReducedDenominator || reducedDenominator === secondReducedDenominator;
    });
    return { contract: "single-value", answerKind: "number", value: candidates.length, candidates };
  }
  if (kind === "improper-from-sum-and-reduced-sum") {
    const [sum, subtractNumerator, addDenominator, reducedSum] = values;
    const candidates = [];
    for (let numerator = 1; numerator < sum; numerator += 1) {
      const denominator = sum - numerator;
      if (numerator < denominator || numerator - subtractNumerator <= 0) continue;
      const [reducedNumerator, reducedDenominator] = reduce(numerator - subtractNumerator, denominator + addDenominator);
      if (reducedNumerator < reducedDenominator && reducedNumerator + reducedDenominator === reducedSum) candidates.push([numerator, denominator]);
    }
    if (candidates.length !== 1) throw new Error(`improper-fraction conditions have ${candidates.length} candidate fractions`);
    return { contract: "single-value", answerKind: "fraction", value: fractionText(candidates[0][0], candidates[0][1]), candidates };
  }
  throw new Error(`unknown hidden audit kind ${kind}`);
}

function stripHidden(markup) {
  return String(markup).replace(/<span hidden\b[\s\S]*?<\/span>/g, "");
}

function plainText(markup) {
  return stripHidden(markup).replace(/<svg\b[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function parseNumberAnswer(answer) {
  const values = String(answer).replaceAll(",", "").match(/-?\d+/g) || [];
  if (values.length !== 1) throw new Error(`number answer is not singular: ${answer}`);
  return Number(values[0]);
}

function parseFractionAnswer(answer) {
  const matches = [...String(answer).replaceAll(",", "").matchAll(/(\d+)\s*\/\s*(\d+)/g)];
  if (matches.length !== 1) throw new Error(`fraction answer is not singular: ${answer}`);
  return fractionText(Number(matches[0][1]), Number(matches[0][2]));
}

function parseSetAnswer(answer) {
  const values = String(answer).replaceAll(",", " ").match(/\d+/g)?.map(Number) || [];
  if (!values.length) throw new Error(`set answer is empty: ${answer}`);
  return sortedNumbers(values);
}

function checkAnswer(generated, calculated) {
  if (calculated.answerKind === "number" && parseNumberAnswer(generated.answer) !== calculated.value) throw new Error(`independent number ${calculated.value} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "fraction" && parseFractionAnswer(generated.answer) !== calculated.value) throw new Error(`independent fraction ${calculated.value} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "set" && !sameArray(parseSetAnswer(generated.answer), sortedNumbers(calculated.value))) throw new Error(`independent set ${calculated.value.join(", ")} differs from shown ${generated.answer}`);
}

function checkStackedMath(generated, calculated) {
  const visibleMarkup = `${stripHidden(generated.prompt)}\n${generated.solution}`;
  if (/\b\d+\s*\/\s*\d+\b/.test(visibleMarkup)) throw new Error("visible prompt or solution contains a raw numeric fraction");
  const fractionMarkupCount = (visibleMarkup.match(/class="math-fraction"/g) || []).length;
  const fractionRequired = calculated.answerKind === "fraction" || ["reduction-count-plus-gcd", "irreducible-sequence-two-positions", "three-digit-numerator-reduced-denominator-count"].includes(calculated.kind);
  if (fractionRequired && fractionMarkupCount === 0) throw new Error("fraction content is not stacked with math-fraction markup");
  if (fractionMarkupCount && !/class="math-fraction"[^>]*role="img"[^>]*aria-label="[^"]+"/.test(visibleMarkup)) throw new Error("stacked fraction is missing accessibility metadata");
  if (String(generated.answer).includes("/")) {
    const tokens = notation.tokenize(generated.answer);
    if (tokens.filter(token => token.type === "fraction").length !== 1) throw new Error("answer fraction is not recognized by the shared math notation parser");
  }
  if (/NaN|undefined|null|Infinity|\^/.test(visibleMarkup)) throw new Error("broken value or caret math notation is visible");
}

function checkElementaryLanguage(generated) {
  const visible = plainText(`${generated.prompt}\n${generated.solution}\n${generated.answer}`);
  const prohibited = [
    /제곱근|순열|조합|방정식|미지수|팩토리얼/,
    /\b(?:sqrt|Euler|phi|gcd|lcm|permutation|combination)\b/i,
    /NaN|undefined|null|Infinity/
  ];
  for (const pattern of prohibited) if (pattern.test(visible)) throw new Error(`non-elementary or broken language matched ${pattern}`);
}

function checkSequenceTargets(generated, tag) {
  if (tag.kind !== "irreducible-sequence-two-positions") return;
  const labels = [...String(generated.prompt).matchAll(/aria-label="(\d+)분의 (\d+)"/g)].map(match => [Number(match[2]), Number(match[1])]);
  if (labels.length < 2) throw new Error("sequence fractions have no stacked aria labels");
  const term = position => reduce(2 * position - 1, 2 * position + 2);
  const expectedTargets = tag.values.map(term);
  const actualTargets = labels.slice(-2);
  if (!sameArray(actualTargets.flat(), expectedTargets.flat())) throw new Error("sequence target fractions do not match hidden source values");
}

function checkTagMetadata(tag, calculated) {
  if (tag.kind === "fixed-denominator-irreducible-position" && tag.values[2] !== Number(calculated.value.split("/")[0])) throw new Error("hidden numerator metadata disagrees with independent enumeration");
  if (tag.kind === "reverse-changed-reduction") {
    if (fractionText(tag.values[5], tag.values[6]) !== calculated.value) throw new Error("hidden reverse-change metadata disagrees with independent enumeration");
  }
}

function checkSourceInventory() {
  if (inventory.schemaVersion !== 1 || inventory.status !== "verified-source-inventory") fail("readiness inventory schema or status is unexpected");
  if (inventory.semester !== "5-1" || inventory.unit !== 4 || inventory.subunit !== "약분과 기약분수") fail("readiness inventory identifies the wrong curriculum scope");
  if (!sameArray(inventory.sourcePagesDirectlyReviewed || [], [43, 44])) fail("readiness inventory direct-review pages are not 43 and 44");
  if (inventory.items?.length !== 11) fail(`readiness inventory has ${inventory.items?.length} items, expected 11`);
  if (inventory.summary?.sourceItemCount !== 11 || inventory.summary?.publicCandidateCount !== 11 || inventory.summary?.lockedCount !== 0) fail("readiness summary does not describe 11 public candidates and zero locked items");
  inventory.items?.forEach((item, index) => {
    const type = branches[index];
    if (!type || item.sourceItemId !== sourceIds[index] || item.sourceItemId !== type.sourceItemId) fail(`${type?.id || `branch-${index + 1}`}: source ID mismatch (inventory ${item?.sourceItemId || "missing"}; runtime ${type?.sourceItemId || "missing"})`);
    const expectedSection = item.sourceItemId.includes("mission") ? "mission" : item.sourceItemId.includes("example") ? "example" : "exploration";
    const expectedPdfPage = expectedSection === "mission" ? 44 : 43;
    if (item.sourceSection !== expectedSection || item.sourcePdfPage !== expectedPdfPage || item.sourcePrintedPage !== expectedPdfPage + 1) fail(`${item.sourceItemId}: inventory section or page mismatch`);
    if (!item.sourceVerified || item.implementationStatus !== "ready" || item.publicDecision !== "public-candidate" || !item.singleAnswer) fail(`${item.sourceItemId}: inventory readiness contract mismatch`);
    if (item.visualRequirement !== "none") fail(`${item.sourceItemId}: unexpected visual requirement`);
  });
}

function checkAnchors() {
  const anchors = [
    ["reduction-count-plus-gcd", [216, 288], { answerKind: "number", value: 83 }],
    ["unit-numerator-count", [120], { answerKind: "number", value: 15 }],
    ["reducible-proper-count", [153], { answerKind: "number", value: 56 }],
    ["irreducible-sequence-two-positions", [35, 71], { answerKind: "number", value: 106 }],
    ["fixed-denominator-irreducible-position", [15, 1000, 1874], { answerKind: "fraction", value: "1874/15" }],
    ["closest-fraction-from-gcd-lcm", [19, 380, 4, 5], { answerKind: "fraction", value: "4/5" }],
    ["reverse-changed-reduction", [5, 7, 6, 5, 7, 6, 49], { answerKind: "fraction", value: "6/49" }],
    ["irreducible-proper-count", [225], { answerKind: "number", value: 120 }],
    ["shared-denominator-multiplier-set", [4, 15, 3, 8, 9, 20, 36], { answerKind: "set", value: [36, 72] }],
    ["three-digit-numerator-reduced-denominator-count", [360, 5, 6], { answerKind: "number", value: 4 }],
    ["improper-from-sum-and-reduced-sum", [29, 8, 4, 5, 18, 11], { answerKind: "fraction", value: "18/11" }]
  ];
  anchors.forEach(([kind, values, expectedAnchor], index) => {
    try {
      const calculated = expected(kind, values);
      if (calculated.answerKind !== expectedAnchor.answerKind || JSON.stringify(calculated.value) !== JSON.stringify(expectedAnchor.value)) throw new Error(`calculated ${JSON.stringify(calculated.value)}`);
      const item = inventory.items?.[index];
      const anchorText = expectedAnchor.answerKind === "set" ? "36, 72" : String(expectedAnchor.value);
      if (!String(item?.independentAnswer).includes(anchorText)) throw new Error(`inventory answer does not include ${anchorText}`);
    } catch (error) {
      fail(`source anchor ${index + 1} (${kind}): ${error.message}`);
    }
  });
}

checkSourceInventory();
checkAnchors();
if (branches.length !== 11) fail(`5-1 U4 E2 has ${branches.length} branches, expected 11`);
if (new Set(branches.map(type => type.sourceItemId)).size !== 11) fail("5-1 U4 E2 source IDs are not unique");

branches.forEach((type, index) => {
  const item = inventory.items?.[index];
  if (type.generatorKey !== "equalFractionE2" || api.generatorKey(type) !== "irreducibleFractionE2") fail(`${type.id}: generator linkage is not equalFractionE2 -> irreducibleFractionE2`);
  if (type.variant !== index || type.reviewLocked || !type.sourceVerified || type.sourceSection !== item?.sourceSection || type.sourcePdfPage !== item?.sourcePdfPage || type.sourcePrintedPage !== item?.sourcePrintedPage) fail(`${type.id}: public status, variant, source, or page metadata mismatch`);
  if (!String(type.sourceEvidence).includes(`PDF p.${type.sourcePdfPage}`) || !String(type.sourceEvidence).includes(`교재 p.${type.sourcePrintedPage}`) || !String(type.sourceEvidence).includes(type.sourceItemId)) fail(`${type.id}: source evidence does not carry ID and pages`);
});

for (const type of branches) {
  for (const difficulty of [-1, 0, 1]) {
    const promptSamples = new Set();
    for (let seed = 1; seed <= 1000; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("problem, answer, or solution is empty");
        const tag = parseTag(generated.prompt);
        if (tag.kind !== kinds[type.variant]) throw new Error(`tag kind ${tag.kind} does not match variant ${type.variant}`);
        if (tag.contract !== contracts[type.variant]) throw new Error(`tag contract ${tag.contract} does not match expected ${contracts[type.variant]}`);
        const calculated = expected(tag.kind, tag.values);
        calculated.kind = tag.kind;
        if (calculated.answerKind !== answerKinds[type.variant]) throw new Error(`independent answer kind ${calculated.answerKind} is unexpected`);
        checkAnswer(generated, calculated);
        checkTagMetadata(tag, calculated);
        checkSequenceTargets(generated, tag);
        checkStackedMath(generated, calculated);
        checkElementaryLanguage(generated);
        const allText = `${generated.prompt}\n${generated.solution}`;
        if (difficulty === -1 && !allText.includes("풀이 도움:")) throw new Error("easy difficulty guidance is missing");
        if (difficulty === 0 && allText.includes("풀이 도움:")) throw new Error("standard difficulty contains easy guidance");
        if (difficulty === 0 && allText.includes("답을 구한 뒤 가능한 수를 빠뜨리지 않았는지 다시 확인하세요.")) throw new Error("standard difficulty contains hard guidance");
        if (difficulty === 1 && !allText.includes("답을 구한 뒤 가능한 수를 빠뜨리지 않았는지 다시 확인하세요.")) throw new Error("hard difficulty guidance is missing");
        promptSamples.add(plainText(generated.prompt));
        checked += 1;
      } catch (error) {
        fail(`${type.sourceItemId} / difficulty ${difficulty} / seed ${seed}: ${error.message}`);
      }
    }
    if (promptSamples.size < 2) fail(`${type.sourceItemId} / difficulty ${difficulty}: generated prompts are not varied`);
  }
  try {
    const difficultyPrompts = [-1, 0, 1].map(difficulty => plainText(api.generate(type, 0, difficulty, 1, type.variant).prompt));
    if (new Set(difficultyPrompts).size !== 3) throw new Error("three difficulty prompts are not distinct");
  } catch (error) {
    fail(`${type.sourceItemId}: difficulty comparison failed: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`5-1 U4 E2 irreducible-fraction audit FAILED: ${failures.length} issue(s) after ${checked.toLocaleString()} generated cases`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`5-1 U4 E2 irreducible-fraction audit PASSED: 11 public branches, 33,000 generated cases, independent enumeration, unique answer contracts, source IDs/pages, stacked fraction notation, elementary language, and three difficulty bands`);
