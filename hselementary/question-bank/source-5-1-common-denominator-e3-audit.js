"use strict";

global.window = {};
require("./math-notation.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const notation = window.HSE_MATH_NOTATION;
const unit = window.HSE_CURRICULUM.semesters
  .find(semester => semester.id === "5-1")?.units.find(item => item.id === "5-1-u4");
const types = unit?.subunits.flatMap(subunit => subunit.types) || [];
const branches = types.filter(type => type.sourceItemId?.startsWith("5-1-u4-e3-"));
const failures = [];
let checked = 0;

const sourceIds = [
  "5-1-u4-e3-exploration",
  "5-1-u4-e3-example-3-1",
  "5-1-u4-e3-example-3-2",
  "5-1-u4-e3-example-3-3",
  "5-1-u4-e3-example-3-4",
  "5-1-u4-e3-mission-1",
  "5-1-u4-e3-mission-2",
  "5-1-u4-e3-mission-3",
  "5-1-u4-e3-mission-4",
  "5-1-u4-e3-mission-5",
  "5-1-u4-e3-mission-6"
];

const kinds = [
  "two-comparison-rules",
  "five-part-fraction-interval",
  "fractions-by-distance",
  "minimum-numerator-multiplier-sum",
  "cycled-numerator-power-two-count",
  "three-fractions-descending",
  "restore-three-denominators",
  "closest-fraction-to-natural",
  "denominator-from-between-count",
  "five-consecutive-numerators",
  "smallest-value-in-fraction-inequality"
];

const contracts = [
  "ordered", "ordered", "ordered", "single-value", "single-value", "ordered",
  "ordered", "single-value", "single-value", "ordered", "single-value"
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
const cmpFraction = (left, right) => left[0] * right[1] - right[0] * left[1];
const fractionDistance = (fraction, target) => ({
  numerator: Math.abs(fraction[0] * target[1] - target[0] * fraction[1]),
  denominator: fraction[1] * target[1]
});
const compareDistance = (left, right) => left.numerator * right.denominator - right.numerator * left.denominator;

function parseTag(prompt) {
  const matches = [...String(prompt).matchAll(/<span hidden\b[^>]*data-common-denominator-e3-kind="([^"]+)"[^>]*data-values="([^"]*)"[^>]*data-result-contract="([^"]+)"[^>]*><\/span>/g)];
  if (matches.length !== 1) throw new Error(`hidden audit tag count is ${matches.length}, expected 1`);
  const [, kind, rawValues, contract] = matches[0];
  const values = rawValues.split(",").filter(Boolean).map(Number);
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) throw new Error("hidden audit tag contains non-integer values");
  return { kind, values, contract };
}

function expected(kind, values) {
  if (kind === "two-comparison-rules") {
    const [startNumerator, multiplier, nearOneNumerator, gap, delta] = values;
    const first = [startNumerator, startNumerator + 1, startNumerator + 2]
      .map(numerator => [numerator, multiplier * numerator + 1]);
    const firstOrder = first.slice().sort((left, right) => cmpFraction(right, left));
    const nearOne = [[nearOneNumerator, nearOneNumerator + gap], [nearOneNumerator + delta, nearOneNumerator + delta + gap]];
    const relation = Math.sign(cmpFraction(nearOne[0], nearOne[1]));
    if (!relation || new Set(first.map(item => fractionText(...item))).size !== 3) throw new Error("comparison source has a tie");
    return {
      kind,
      contract: "ordered",
      answerKind: "comparison",
      fractions: firstOrder.map(item => fractionText(...item)),
      relation: relation > 0 ? ">" : "<",
      candidates: [...first, ...nearOne]
    };
  }
  if (kind === "five-part-fraction-interval") {
    const [leftNumerator, leftDenominator, rightNumerator, rightDenominator] = values;
    const left = [leftNumerator, leftDenominator];
    const right = [rightNumerator, rightDenominator];
    if (cmpFraction(left, right) >= 0) throw new Error("interval endpoints are not increasing");
    const inserted = range(1, 4).map(index => [
      leftNumerator * rightDenominator * 5 + index * (rightNumerator * leftDenominator - leftNumerator * rightDenominator),
      leftDenominator * rightDenominator * 5
    ]).map(([numerator, denominator]) => reduce(numerator, denominator));
    if (new Set(inserted.map(item => item.join("/"))).size !== 4 || inserted.some((item, index) => index && cmpFraction(inserted[index - 1], item) >= 0)) throw new Error("five-part interval is not strictly increasing");
    return { kind, contract: "ordered", answerKind: "fractions", value: inserted.map(item => fractionText(...item)), candidates: inserted };
  }
  if (kind === "fractions-by-distance") {
    const [targetNumerator, targetDenominator, ...rawCandidates] = values;
    if (rawCandidates.length !== 8) throw new Error("distance comparison does not contain four fractions");
    const target = [targetNumerator, targetDenominator];
    const candidates = range(0, 3).map(index => [rawCandidates[index * 2], rawCandidates[index * 2 + 1]]);
    const ordered = candidates.slice().sort((left, right) => compareDistance(fractionDistance(left, target), fractionDistance(right, target)));
    if (ordered.some((item, index) => index && compareDistance(fractionDistance(ordered[index - 1], target), fractionDistance(item, target)) === 0)) throw new Error("distance comparison has a tie");
    return { kind, contract: "ordered", answerKind: "fractions", value: ordered.map(item => fractionText(...item)), candidates };
  }
  if (kind === "minimum-numerator-multiplier-sum") {
    const [firstNumerator, firstDenominator, secondNumerator, secondDenominator] = values;
    const left = firstNumerator * secondDenominator;
    const right = secondNumerator * firstDenominator;
    const divisor = gcd(left, right);
    const firstMultiplier = right / divisor;
    const secondMultiplier = left / divisor;
    return { kind, contract: "single-value", answerKind: "number", value: firstMultiplier + secondMultiplier, candidates: [[firstMultiplier, secondMultiplier]] };
  }
  if (kind === "cycled-numerator-power-two-count") {
    const [threshold] = values;
    const candidates = range(0, 39).filter(index => [1, 3, 5][index % 3] * threshold > 2 ** index);
    return { kind, contract: "single-value", answerKind: "number", value: candidates.length, candidates };
  }
  if (kind === "three-fractions-descending") {
    if (values.length !== 6) throw new Error("descending comparison does not contain three fractions");
    const candidates = range(0, 2).map(index => [values[index * 2], values[index * 2 + 1]]);
    const ordered = candidates.slice().sort((left, right) => cmpFraction(right, left));
    if (ordered.some((item, index) => index && cmpFraction(ordered[index - 1], item) === 0)) throw new Error("descending comparison has a tie");
    return { kind, contract: "ordered", answerKind: "fractions", value: ordered.map(item => fractionText(...item)), candidates };
  }
  if (kind === "restore-three-denominators") {
    const [commonDenominator, ...rawTriples] = values;
    if (rawTriples.length !== 6) throw new Error("restored-denominator problem does not contain three pairs");
    const triples = range(0, 2).map(index => [rawTriples[index * 2], rawTriples[index * 2 + 1]]);
    const denominators = triples.map(([originalNumerator, changedNumerator]) => {
      const product = originalNumerator * commonDenominator;
      if (product % changedNumerator) throw new Error("restored denominator is not a natural number");
      return product / changedNumerator;
    });
    return { kind, contract: "ordered", answerKind: "number", value: denominators.reduce((sum, value) => sum + value, 0), candidates: denominators };
  }
  if (kind === "closest-fraction-to-natural") {
    const [whole, ...rawCandidates] = values;
    if (rawCandidates.length !== 10) throw new Error("natural-number closeness problem does not contain five fractions");
    const candidates = range(0, 4).map(index => [rawCandidates[index * 2], rawCandidates[index * 2 + 1]]);
    const ordered = candidates.slice().sort((left, right) => compareDistance(fractionDistance(left, [whole, 1]), fractionDistance(right, [whole, 1])));
    if (ordered.length < 1 || (ordered.length > 1 && compareDistance(fractionDistance(ordered[0], [whole, 1]), fractionDistance(ordered[1], [whole, 1])) === 0)) throw new Error("natural-number closeness has a tie");
    return { kind, contract: "single-value", answerKind: "fraction", value: fractionText(...ordered[0]), candidates };
  }
  if (kind === "denominator-from-between-count") {
    const [denominatorUnit, lowerNumerator, width, answerCount] = values;
    const candidates = range(1, 10000).filter(scale => {
      const denominator = denominatorUnit * scale;
      const count = range(lowerNumerator * scale + 1, (lowerNumerator + width) * scale - 1).length;
      return count === answerCount && denominator % denominatorUnit === 0;
    });
    if (candidates.length !== 1) throw new Error(`denominator condition has ${candidates.length} candidates`);
    return { kind, contract: "single-value", answerKind: "number", value: denominatorUnit * candidates[0], candidates };
  }
  if (kind === "five-consecutive-numerators") {
    const [leftNumerator, leftDenominator, rightNumerator, rightDenominator, commonDenominator] = values;
    const leftProduct = leftNumerator * commonDenominator;
    const rightProduct = rightNumerator * commonDenominator;
    if (leftProduct % leftDenominator || rightProduct % rightDenominator) throw new Error("common-denominator endpoints are not integral");
    const leftScaled = leftProduct / leftDenominator;
    const rightScaled = rightProduct / rightDenominator;
    if (rightScaled - leftScaled !== 6) throw new Error("common-denominator endpoints do not produce five inserted numerators");
    const inserted = range(leftScaled + 1, rightScaled - 1).map(numerator => reduce(numerator, commonDenominator));
    if (new Set(inserted.map(item => item.join("/"))).size !== 5) throw new Error("inserted fractions are not unique");
    return { kind, contract: "ordered", answerKind: "fractions", value: inserted.map(item => fractionText(...item)), candidates: inserted };
  }
  if (kind === "smallest-value-in-fraction-inequality") {
    const [offset, targetNumerator, targetDenominator] = values;
    const candidates = range(1, 100000).filter(value => (value - offset) * targetDenominator > targetNumerator * (value + offset));
    if (!candidates.length) throw new Error("fraction inequality has no natural solution");
    return { kind, contract: "single-value", answerKind: "number", value: candidates[0], candidates };
  }
  throw new Error(`unknown hidden audit kind ${kind}`);
}

const expectedCache = new Map();
const calculate = (kind, values) => {
  const key = `${kind}:${values.join(",")}`;
  if (!expectedCache.has(key)) expectedCache.set(key, expected(kind, values));
  return expectedCache.get(key);
};

function stripHidden(markup) {
  return String(markup).replace(/<span hidden\b[\s\S]*?<\/span>/g, "");
}

function plainText(markup) {
  return stripHidden(markup)
    .replace(/<svg\b[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
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

function parseFractionList(answer) {
  const matches = [...String(answer).matchAll(/(\d+)\s*\/\s*(\d+)/g)];
  return matches.map(match => fractionText(Number(match[1]), Number(match[2])));
}

function checkAnswer(generated, calculated) {
  if (calculated.answerKind === "number" && parseNumberAnswer(generated.answer) !== calculated.value) throw new Error(`independent number ${calculated.value} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "fraction" && parseFractionAnswer(generated.answer) !== calculated.value) throw new Error(`independent fraction ${calculated.value} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "fractions" && !sameArray(parseFractionList(generated.answer), calculated.value)) throw new Error(`independent fraction list ${calculated.value.join(", ")} differs from shown ${generated.answer}`);
  if (calculated.answerKind === "comparison") {
    const answer = String(generated.answer);
    const fractions = parseFractionList(answer);
    const relation = answer.includes(";") ? answer.slice(answer.lastIndexOf(";") + 1).trim() : "";
    if (!sameArray(fractions, calculated.fractions) || relation !== calculated.relation) throw new Error(`independent comparison differs from shown ${generated.answer}`);
  }
}

function checkMathNotation(generated, calculated) {
  const visibleMarkup = `${stripHidden(generated.prompt)}\n${generated.solution}`;
  const visibleWithoutSvg = visibleMarkup.replace(/<svg\b[\s\S]*?<\/svg>/g, " ");
  if (/\b\d+\s*\/\s*\d+\b/.test(visibleWithoutSvg)) throw new Error("visible prompt or solution contains a raw numeric fraction");
  if (calculated.answerKind !== "number" && (visibleWithoutSvg.match(/class="math-fraction"/g) || []).length === 0) throw new Error("fraction content is not stacked with math-fraction markup");
  if (/class="math-fraction"/.test(visibleWithoutSvg) && !/class="math-fraction"[^>]*role="img"[^>]*aria-label="[^"]+"/.test(visibleWithoutSvg)) throw new Error("stacked fraction is missing accessibility metadata");
  if (String(generated.answer).includes("/")) {
    const tokens = notation.tokenize(generated.answer);
    if (tokens.filter(token => token.type === "fraction").length !== parseFractionList(generated.answer).length) throw new Error("answer fraction is not recognized by the shared math notation parser");
  }
  if (/NaN|undefined|null|Infinity|\^|\$\{/.test(visibleMarkup)) throw new Error("broken value or caret math notation is visible");
}

function checkElementaryLanguage(generated) {
  const visible = plainText(`${generated.prompt}\n${generated.solution}\n${generated.answer}`);
  const prohibited = [
    /제곱근|순열|조합|방정식|미지수|팩토리얼|소인수분해/,
    /\b(?:sqrt|Euler|phi|gcd|lcm|permutation|combination)\b/i,
    /NaN|undefined|null|Infinity/
  ];
  for (const pattern of prohibited) if (pattern.test(visible)) throw new Error(`non-elementary or broken language matched ${pattern}`);
}

function checkSourceMetadata() {
  if (!unit) fail("5-1 약분과 통분 단원을 찾을 수 없습니다.");
  if (types.length !== 44) fail(`5-1 U4 has ${types.length} types, expected 44`);
  if (branches.length !== 11) fail(`5-1 U4 E3 has ${branches.length} branches, expected 11`);
  if (!sameArray(branches.map(type => type.sourceItemId), sourceIds)) fail("5-1 U4 E3 source IDs are not in source order");
  if (new Set(branches.map(type => type.sourceItemId)).size !== 11) fail("5-1 U4 E3 source IDs are not unique");
  branches.forEach((type, index) => {
    const expectedPdfPage = index < 5 ? 45 : 46;
    const expectedPrintedPage = expectedPdfPage + 1;
    if (type.variant !== index || type.generatorKey !== "equalFractionE3" || api.generatorKey(type) !== "commonDenominatorE3") fail(`${type.id}: generator linkage or variant is wrong`);
    if (!type.sourceVerified || type.reviewLocked || type.sourcePdfPage !== expectedPdfPage || type.sourcePrintedPage !== expectedPrintedPage) fail(`${type.id}: source verification, lock, or page metadata is wrong`);
    if (type.sourceSection !== (index < 5 ? (index === 0 ? "exploration" : "example") : "mission")) fail(`${type.id}: source section is wrong`);
    if (!String(type.sourceEvidence).includes(`5-1 심화 기준본 PDF p.${expectedPdfPage}`) || !String(type.sourceEvidence).includes(`교재 p.${expectedPrintedPage}`) || !String(type.sourceEvidence).includes(type.sourceItemId)) fail(`${type.id}: source evidence does not carry ID and pages`);
  });
}

function checkSourceAnchors() {
  const exploration = calculate("two-comparison-rules", [3, 42, 1995, 19, 3]);
  if (!sameArray(exploration.fractions, ["5/211", "4/169", "3/127"]) || exploration.relation !== "<") fail("원문 탐구 기준 5/211 > 4/169 > 3/127; <를 재현하지 못했습니다.");

  const line = calculate("five-part-fraction-interval", [1, 7, 1, 6]);
  if (!sameArray(line.value, ["31/210", "16/105", "11/70", "17/105"])) fail("원문 다섯 부분 수직선 기준을 재현하지 못했습니다.");

  const closeness = calculate("fractions-by-distance", [5, 7, 2, 3, 3, 4, 5, 6, 13, 21]);
  if (!sameArray(closeness.value, ["3/4", "2/3", "13/21", "5/6"])) fail("원문 가까운 순서 기준을 재현하지 못했습니다.");

  if (calculate("minimum-numerator-multiplier-sum", [9, 14, 12, 13]).value !== 95) fail("원문 최소 곱의 합 95를 재현하지 못했습니다.");
  if (calculate("cycled-numerator-power-two-count", [100]).value !== 9) fail("원문 수열 개수 9를 재현하지 못했습니다.");

  const missionOne = calculate("three-fractions-descending", [4, 9, 10, 21, 13, 28]);
  if (!sameArray(missionOne.value, ["10/21", "13/28", "4/9"])) fail("원문 Mission 1 순서를 재현하지 못했습니다.");

  if (calculate("restore-three-denominators", [210, 8, 60, 36, 135, 95, 114]).value !== 259) fail("원문 복원 분모의 합 259를 재현하지 못했습니다.");
  if (calculate("closest-fraction-to-natural", [3, 17, 5, 34, 13, 24, 7, 7, 2, 29, 11]).value !== "29/11") fail("원문 가장 가까운 분수 29/11을 재현하지 못했습니다.");
  if (calculate("denominator-from-between-count", [9, 5, 2, 215]).value !== 972) fail("원문 분모 972를 재현하지 못했습니다.");

  const inserted = calculate("five-consecutive-numerators", [3, 4, 4, 5, 120]);
  if (!sameArray(inserted.value, ["91/120", "23/30", "31/40", "47/60", "19/24"])) fail("원문 삽입 분수 다섯 개를 재현하지 못했습니다.");
  if (calculate("smallest-value-in-fraction-inequality", [14, 11, 13]).value !== 169) fail("원문 최소 자연수 169를 재현하지 못했습니다.");
}

function run() {
  checkSourceMetadata();
  checkSourceAnchors();
  const attempts = branches.length * 3 * 1000;
  branches.forEach((type, index) => {
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 1000; seed += 1) {
        try {
          const generated = api.generate(type, 0, difficulty, seed, type.variant);
          if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("problem, answer, or solution is empty");
          const tag = parseTag(generated.prompt);
          if (tag.kind !== kinds[index] || tag.contract !== contracts[index]) throw new Error(`tag ${tag.kind}/${tag.contract} does not match source branch`);
          const calculated = calculate(tag.kind, tag.values);
          checkAnswer(generated, calculated);
          checkMathNotation(generated, calculated);
          checkElementaryLanguage(generated);
          if (difficulty === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("easy difficulty instruction is missing");
          if (difficulty === 0 && generated.prompt.includes("풀이 도움:")) throw new Error("medium difficulty contains easy help");
          if (difficulty === 1 && !generated.prompt.includes("이웃한 두 분수의 크기")) throw new Error("hard difficulty instruction is missing");
          checked += 1;
        } catch (error) {
          fail(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
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
    console.error(`5-1 통분과 분수의 크기 비교 개념탐구 3 독립 감사 실패: ${failures.length}건 · 시도 ${attempts.toLocaleString()}회 · 통과 ${checked.toLocaleString()}회\n실패 요약: ${summary}\n${failures.slice(0, 100).join("\n")}`);
    process.exit(1);
  }
  console.log(`5-1 통분과 분수의 크기 비교 개념탐구 3 독립 감사 통과: 원문 11항목 · 공개 11/잠금 0 · ${checked.toLocaleString()}회 태그 독립 계산·전수 열거·수식·초등 언어 검사`);
}

run();
