"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

const context = vm.createContext({ window: {} });
const snapshots = new Map();
function readFile(name) {
  const text = fs.readFileSync(path.join(__dirname, name), "utf8");
  snapshots.set(name, crypto.createHash("sha256").update(text).digest("hex"));
  return text;
}
for (const name of ["source-inventory-grade6.js", "curriculum.js", "generators.js", "source-6-2-decimal-e3.js"]) {
  vm.runInContext(readFile(name), context, { filename: name });
}
const api = context.window.HSE_GENERATORS;
const catalog = context.window.HSE_SOURCE_INVENTORY_GRADE6;
const curriculum = context.window.HSE_CURRICULUM;
const types = curriculum.semesters.flatMap(semester => semester.units)
  .flatMap(unit => unit.subunits).flatMap(subunit => subunit.types);
const raw = JSON.parse(readFile("source-inventory/6-2-source-items.json")).items;
const index = readFile("index.html");
const catalogBefore = JSON.stringify(catalog), curriculumBefore = JSON.stringify(curriculum);
function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
}
freeze(catalog);
freeze(curriculum);

// Visually read printed conditions on PDF 20/21, printed 22/23. These are not producer pools or answer keys.
const sources = [
  { suffix: "exploration-1", key: "sourceGrade6DecimalE3Exploration1", answer: "6.81", facts: { dividend: "21.8", divisor: "3.2" }, handwriting: "6.81", agrees: true,
    designs: ["quotient-first-three-digits-given", "source-division-then-round", "reconstruct-dividend-then-round"] },
  { suffix: "exploration-2", key: "sourceGrade6DecimalE3Exploration2", answer: "6.39", facts: { dividend: "20.5", divisor: "3.21" }, handwriting: "6.39", agrees: true,
    designs: ["quotient-first-three-digits-given", "source-division-then-round", "reconstruct-dividend-then-round"] },
  { suffix: "exploration-3", key: "sourceGrade6DecimalE3Exploration3", answer: "0.90", facts: { dividend: "27.72", divisor: "30.7" }, handwriting: "0.81", agrees: false, candidateOnly: true,
    designs: ["quotient-first-three-digits-given", "source-division-then-round", "reconstruct-dividend-then-round"] },
  { suffix: "example-1", key: "sourceGrade6DecimalE3Example1", answer: "301", facts: { dividend: "4.7", divisor: "3.7", decimalPlaces: 100 }, handwriting: "301", agrees: true,
    designs: ["repeating-three-digit-block-given", "source-derive-repeating-block", "reconstruct-dividend-and-derive-block"] },
  { suffix: "example-2", key: "sourceGrade6SecondDecimalDivisionE3Example2", answer: "3", facts: { dividendPattern: "1.□68", divisor: "2.34", targetRoundedTenth: "0.8" }, central: true,
    designs: ["restricted-candidate-digits", "source-structure", "divisor-subtraction-extra-step"] },
  { suffix: "example-4", key: "sourceGrade6DecimalE3Example4", answer: "4.175kg", facts: { totalKg: "100.2", capacityKg: "4.22" }, handwriting: "4.175kg", agrees: true,
    designs: ["bag-count-given", "source-minimum-bags-and-equal-share", "combine-two-rice-amounts-before-bag-count"] },
  { suffix: "mission-1", key: "sourceGrade6DecimalE3Mission1", answer: "0.03", facts: { dividend: "6.348", divisor: "2.14" }, handwriting: "0.03", agrees: true,
    designs: ["quotient-first-three-digits-given", "source-two-rounded-quotients-and-difference", "reconstruct-dividend-before-two-roundings"] },
  { suffix: "mission-2", key: "sourceGrade6SecondDecimalDivisionE3Mission2", answer: "6.13", facts: { cards: [2, 1, 5, 3, 7, 4] }, central: true,
    designs: ["fixed-leading-card", "source-structure", "excluded-smallest-divisor"] },
  { suffix: "mission-3", key: "sourceGrade6DecimalE3Mission3", answer: "0", facts: { dividendTemplate: "2.94□5", divisor: "3.4", roundedHundredths: "0.86", blankCount: 1 }, handwriting: "0", agrees: true,
    designs: ["rounding-interval-given", "source-one-missing-dividend-digit", "reconstruct-dividend-with-one-missing-digit"] },
  { suffix: "mission-4", key: "sourceGrade6DecimalE3Mission4", answer: "112개", facts: { bridgeLimitT: "16", truckT: "2.5", boxT: "0.12" }, handwriting: "112개", agrees: true,
    designs: ["available-box-weight-given", "source-subtract-truck-then-whole-box-count", "combine-truck-and-equipment-before-box-count"] },
  { suffix: "mission-6", key: "sourceGrade6DecimalE3Mission6", answer: "756개", facts: { widthCm: "15.05", depthCm: "19.35", heightCm: "25.8", cubeEdgeCm: "2.15" }, handwriting: "756개", agrees: true,
    designs: ["axis-counts-given", "source-three-dimension-quotients-and-product", "reserved-width-before-three-axis-counts"] }
];
const idFor = source => `6-2-u2-e3-${source.suffix}`;
const N = "(\\d+(?:\\.\\d+)?)";
const plain = markup => String(markup).replace(/<[^>]*>/g, "")
  .replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }[entity]))
  .replace(/−/g, "-").replace(/\s+/g, " ").trim();
function match(text, pattern) {
  const results = [...text.matchAll(new RegExp(pattern, "gu"))];
  assert.equal(results.length, 1, `Expected one printed condition: ${pattern}\n${text}`);
  return results[0];
}
function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}
function q(n, d = 1n) {
  assert(d > 0n, "Positive denominator");
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
function decimal(text) {
  assert.match(String(text), /^\d+(?:\.\d+)?$/);
  const [integer, fraction = ""] = String(text).split(".");
  return q(BigInt(integer + fraction), 10n ** BigInt(fraction.length));
}
const add = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a, b) => q(a.n * b.n, a.d * b.d);
const div = (a, b) => { assert(b.n > 0n); return q(a.n * b.d, a.d * b.n); };
const compare = (a, b) => a.n * b.d - b.n * a.d;
const equal = (a, b) => assert.equal(compare(a, b), 0n);
const positive = (...values) => values.forEach(value => assert(value.n > 0n, "Positive printed quantity"));
function fixed(integer, places) {
  assert(integer >= 0n);
  const digits = String(integer).padStart(places + 1, "0");
  return places ? `${digits.slice(0, -places)}.${digits.slice(-places)}` : digits;
}
function finite(value) {
  assert(value.n >= 0n);
  for (let places = 0; places <= 12; places += 1) {
    const scaled = value.n * 10n ** BigInt(places);
    if (scaled % value.d === 0n) return fixed(scaled / value.d, places);
  }
  assert.fail("Expected an exact terminating decimal");
}

// Unlike the module's digit-by-digit long division, round one scaled integer quotient using its remainder.
function round(value, places) {
  assert(value.n >= 0n);
  const scaled = value.n * 10n ** BigInt(places);
  const quotient = scaled / value.d, remainder = scaled % value.d;
  const result = quotient + (remainder * 2n >= value.d ? 1n : 0n);
  assert((2n * result - 1n) * value.d <= 2n * scaled);
  assert(2n * scaled < (2n * result + 1n) * value.d);
  return result;
}
const prefix = value => fixed(value.n * 1000n / value.d, 3);
const roundedText = (value, places) => fixed(round(value, places), places);
const ceil = value => value.n / value.d + (value.n % value.d ? 1n : 0n);

function verifySolutionEquations(markup) {
  for (const expression of markup.matchAll(/<span class="math-inline-expression">([^<]+)<\/span>/g)) {
    const text = plain(expression[1]).replace(/\s/g, "");
    if (!text.includes("=") || text.includes("...")) continue;
    const parts = text.split("=");
    assert.equal(parts.length, 2);
    const left = parts[0].replace(/\(([\d.+]+)\)/g, (_, group) => {
      assert.match(group, /^\d+(?:\.\d+)?(?:\+\d+(?:\.\d+)?)+$/);
      return finite(group.split("+").map(decimal).reduce(add));
    });
    const tokens = left.match(/\d+(?:\.\d+)?|[+×÷-]/g) || [];
    assert.equal(tokens.join(""), left, `Unsupported exact solution equation: ${text}`);
    assert(tokens.length % 2 === 1);
    let term = decimal(tokens[0]), result = q(0n), sign = "+";
    for (let i = 1; i < tokens.length; i += 2) {
      const operand = decimal(tokens[i + 1]);
      if (tokens[i] === "×") term = mul(term, operand);
      else if (tokens[i] === "÷") term = div(term, operand);
      else {
        result = sign === "+" ? add(result, term) : sub(result, term);
        sign = tokens[i]; term = operand;
      }
    }
    result = sign === "+" ? add(result, term) : sub(result, term);
    equal(result, decimal(parts[1]));
  }
}

function divisionFacts(text, level) {
  if (level === 2) {
    const [, start, removed, divisor] = match(text, `${N}에서 ${N}를 뺀 수를 ${N}로 (?:나눕니다|나누려고 합니다)`);
    const dividend = sub(decimal(start), decimal(removed));
    positive(dividend, decimal(divisor));
    return { dividend: finite(dividend), divisor };
  }
  const [, dividend, divisor] = match(text, `${N}\\s*÷\\s*${N}`);
  if (level === 0 && text.includes("차례로 적으면")) {
    const [, shown] = match(text, `차례로 적으면 ${N}입니다`);
    assert.equal(shown, prefix(div(decimal(dividend), decimal(divisor))));
  }
  return { dividend, divisor };
}
function nextPermutation(values) {
  let i = values.length - 2;
  while (i >= 0 && values[i] >= values[i + 1]) i -= 1;
  if (i < 0) return false;
  let j = values.length - 1;
  while (values[j] <= values[i]) j -= 1;
  [values[i], values[j]] = [values[j], values[i]];
  for (let left = i + 1, right = values.length - 1; left < right; left += 1, right -= 1) {
    [values[left], values[right]] = [values[right], values[left]];
  }
  return true;
}

function solve(source, item, level) {
  const text = plain(item.prompt), solution = plain(item.solution);
  assert.doesNotMatch(text, /NaN|Infinity|undefined/);
  assert.doesNotMatch(item.prompt, /<(?:svg|img|canvas|table)\b|data-matches=|data-phase="answer"/);
  const rows = {}, values = {};
  let facts, answer, branch, enumerated = 0;
  if (source.suffix.startsWith("exploration-") || ["example-1", "mission-1"].includes(source.suffix)) {
    facts = divisionFacts(text, level);
    const quotient = div(decimal(facts.dividend), decimal(facts.divisor));
    assert.match(text, /반올림/u);
    if (source.suffix === "example-1") {
      assert.match(text, /소수 100째 자리까지/);
      assert.match(text, /몫의 각 자리 수의 합/);
      const rounded = String(round(quotient, 100)).padStart(101, "0");
      const fraction = rounded.slice(-100), integer = rounded.slice(0, -100);
      const scaled101 = quotient.n * 10n ** 101n / quotient.d;
      const original100 = Number(scaled101 / 10n % 10n), roundingDigit = Number(scaled101 % 10n);
      answer = String([...rounded].reduce((sum, digit) => sum + Number(digit), 0));
      const remainder = quotient.n % quotient.d;
      const block = String(remainder * 1000n / quotient.d).padStart(3, "0");
      equal(q(remainder, quotient.d), q(BigInt(block), 999n));
      assert.equal(fraction.slice(0, 99), block.repeat(33));
      if (level === 0) {
        const [, shownInteger, shownBlock] = match(text, `정수 부분이 (\\d+)이고, 소수 부분에서는 (\\d{3})이 처음부터 계속 반복`);
        assert.equal(shownInteger, String(quotient.n / quotient.d));
        assert.equal(shownBlock, block);
      }
      assert(solution.includes(`100째 자리 숫자는 ${original100}, 101째 자리 숫자는 ${roundingDigit}`));
      const integerSum = [...integer].reduce((sum, digit) => sum + Number(digit), 0);
      Object.assign(values, { decimalPlaces: 100, repeatingBlock: block, blockCount: 33, roundingDigit,
        lastRoundedDigit: Number(fraction[99]), integerPart: integer, roundedFractionDigits: fraction, digitSum: Number(answer) });
      Object.assign(rows, { "반복 묶음": `${block}, 33번`, "소수 100째 자리 (반올림 후)": fraction[99], "정수 부분의 숫자의 합": String(integerSum) });
      facts.decimalPlaces = 100;
    } else if (source.suffix === "mission-1") {
      assert.match(text, /소수 첫째 자리까지 구한 수와 소수 둘째 자리까지 구한 수의 차/);
      const first = round(quotient, 1), second = round(quotient, 2);
      const difference = first * 10n - second;
      answer = fixed(difference < 0n ? -difference : difference, 2);
      Object.assign(values, { quotientPrefix: prefix(quotient), roundedTenths: fixed(first, 1), roundedHundredths: fixed(second, 2), difference: answer });
      Object.assign(rows, { "소수 첫째 자리까지": values.roundedTenths, "소수 둘째 자리까지": values.roundedHundredths });
    } else {
      assert.match(text, /소수 둘째 자리까지 구하세요/);
      answer = roundedText(quotient, 2);
      Object.assign(values, { quotientPrefix: prefix(quotient), roundedHundredths: answer });
      rows["소수 셋째 자리까지"] = values.quotientPrefix;
    }
    Object.assign(values, { dividend: facts.dividend, divisor: facts.divisor });
    branch = level === 0 ? "given-intermediate" : level === 1 ? "direct-division" : "reconstructed-dividend";
  } else if (source.suffix === "example-2") {
    const [, whole, suffix, divisorTerm] = match(text, `(\\d+)\\.□(\\d{2})\\s*÷\\s*(\\([^)]*\\)|\\d+\\.\\d+)의 몫`);
    const [, target] = match(text, `소수 첫째 자리까지 나타내면 ${N}이 됩니다`);
    let divisor;
    if (level === 2) {
      const [, start, removed] = match(divisorTerm, `^\\(${N}\\s*-\\s*${N}\\)$`);
      divisor = sub(decimal(start), decimal(removed));
      assert(solution.includes(`${start} - ${removed} = ${finite(divisor)}`));
    } else {
      assert.doesNotMatch(divisorTerm, /[()]/);
      divisor = decimal(divisorTerm);
    }
    positive(divisor);
    let low = 0, high = 9;
    if (level === 0) {
      const [, minimum, maximum] = match(text, "□에는 (\\d)부터 (\\d)까지의 숫자 중 하나");
      low = Number(minimum); high = Number(maximum);
      assert(low <= high && high - low < 9);
    } else assert.doesNotMatch(text, /□에는 \d부터 \d까지/);
    const candidates = [];
    for (let digit = 0; digit <= 9; digit += 1) {
      const quotient = div(decimal(`${whole}.${digit}${suffix}`), divisor);
      if (digit >= low && digit <= high && round(quotient, 1) === round(decimal(target), 1)) candidates.push(digit);
      enumerated += 1;
    }
    assert(candidates.length > 0 && candidates.length < high - low + 1);
    answer = String(candidates.length);
    const [, lower, upper] = match(solution, `범위는 ${N} 이상 ${N} 미만`);
    equal(decimal(lower), sub(decimal(target), decimal("0.05")));
    equal(decimal(upper), add(decimal(target), decimal("0.05")));
    const grid = [...item.answerVisual.matchAll(/data-digit="(\d)" data-matches="(yes|no)"[^>]*>(\d)<\/span>/g)];
    assert.deepEqual(grid.map(cell => Number(cell[1])), Array.from({ length: high - low + 1 }, (_, i) => low + i));
    for (const cell of grid) {
      assert.equal(cell[1], cell[3]);
      assert.equal(cell[2] === "yes", candidates.includes(Number(cell[1])));
    }
    facts = { dividendPattern: `${whole}.□${suffix}`, divisor: finite(divisor), targetRoundedTenth: target };
    branch = level === 0 ? "restricted-digits" : level === 1 ? "all-ten-digits" : "divisor-difference-before-ten-digits";
  } else if (source.suffix === "mission-2") {
    assert.match(text, /한 번씩 모두 사용/);
    assert.match(text, /소수 두 자리 수/);
    assert.match(text, /몫이 가장 큰/);
    assert.match(text, /반올림하여 소수 둘째 자리/);
    const cards = [...item.prompt.matchAll(/data-card-digit="(\d)"[^>]*>(\d)<\/span>/g)];
    assert.equal(cards.length, 6);
    cards.forEach(card => assert.equal(card[1], card[2]));
    const digits = cards.map(card => Number(card[2]));
    assert.equal(new Set(digits).size, 6);
    assert(digits.every(digit => digit > 0));
    const order = [...digits].sort((a, b) => a - b), smallest = order[0], largest = order.at(-1);
    let requiredLeading = null, forbiddenLeading = null;
    if (level === 0) {
      requiredLeading = Number(match(text, "나누어지는 수의 일의 자리에는 (\\d)를 놓습니다")[1]);
      assert.equal(requiredLeading, largest);
    } else if (level === 2) {
      assert.match(text, /나누는 수의 일의 자리에는 가장 작은 카드 숫자를 놓을 수 없습니다/);
      forbiddenLeading = smallest;
    } else assert.doesNotMatch(text, /일의 자리에는/);
    let best = null, ties = 0, allowed = 0;
    do {
      enumerated += 1;
      if (requiredLeading !== null && order[0] !== requiredLeading) continue;
      if (forbiddenLeading !== null && order[3] === forbiddenLeading) continue;
      allowed += 1;
      const n = BigInt(order[0] * 100 + order[1] * 10 + order[2]);
      const d = BigInt(order[3] * 100 + order[4] * 10 + order[5]);
      if (!best || n * best.d > best.n * d) { best = { n, d }; ties = 1; }
      else if (n * best.d === best.n * d) ties += 1;
    } while (nextPermutation(order));
    assert.equal(enumerated, 720);
    assert.equal(allowed, [120, 720, 600][level]);
    assert.equal(ties, 1, "Unique exact maximum, not merely the same rounded result");
    answer = roundedText(q(best.n, best.d), 2);
    const expression = `${fixed(best.n, 2)} ÷ ${fixed(best.d, 2)}`;
    assert(plain(item.answerVisual).includes(expression));
    assert(solution.includes(expression));
    facts = { cards: digits };
    branch = level === 0 ? "fixed-dividend-leading-card" : level === 1 ? "all-card-arrangements" : "forbidden-smallest-divisor-leading-card";
  } else if (source.suffix === "example-4") {
    let total, capacity, givenBags;
    if (level === 2) {
      const [, first, second, cap] = match(text, `${N}kg과 ${N}kg의 쌀을 합하여 ${N}kg까지`);
      total = add(decimal(first), decimal(second)); capacity = decimal(cap);
    } else {
      const [, amount, cap] = match(text, `${N}kg의 쌀을 ${N}kg까지`);
      total = decimal(amount); capacity = decimal(cap);
      if (level === 0) givenBags = BigInt(match(text, "봉지 (\\d+)개에 똑같이")[1]);
    }
    assert.match(text, /똑같이 나누어 담/);
    if (level !== 0) assert.match(text, /봉지를 가장 적게/);
    positive(total, capacity);
    const bags = ceil(div(total, capacity));
    assert(compare(mul(q(bags - 1n), capacity), total) < 0n);
    assert(compare(mul(q(bags), capacity), total) >= 0n);
    if (givenBags !== undefined) assert.equal(givenBags, bags);
    const share = div(total, q(bags));
    equal(mul(share, q(bags)), total);
    assert(compare(share, capacity) <= 0n);
    answer = `${finite(share)}kg`;
    facts = { totalKg: finite(total), capacityKg: finite(capacity) };
    Object.assign(values, { ...facts, minimumBags: String(bags), shareKg: finite(share) });
    rows["봉지 수"] = `${bags}개`;
    branch = level === 0 ? "bag-count-given" : level === 1 ? "derive-minimum-bags" : "combine-amounts-and-derive-minimum";
  } else if (source.suffix === "mission-3") {
    assert.equal((text.match(/□/g) || []).length, 2, "One expression blank plus the question's blank symbol");
    assert.match(text, /반올림하여 소수 둘째 자리/);
    const expression = plain(match(item.prompt, '<span class="math-inline-expression">([^<]+)</span>')[1]);
    const [, divisorText] = match(expression, `÷${N}$`);
    const left = expression.slice(0, expression.indexOf("÷"));
    let base, added = "0";
    if (level === 2) {
      const parts = match(left, `^\\(${N}□5\\+${N}\\)$`);
      base = parts[1]; added = parts[2];
    } else base = match(left, `^${N}□5$`)[1];
    assert.match(base, /^\d+\.\d{2}$/);
    const [, target] = match(text, ` 나타내면 ${N}입니다`);
    const lower = sub(decimal(target), decimal("0.005")), upper = add(decimal(target), decimal("0.005"));
    if (level === 0) {
      const [, shownLower, shownUpper] = match(text, `몫은 ${N} 이상 ${N} 미만`);
      equal(decimal(shownLower), lower); equal(decimal(shownUpper), upper);
    } else assert.doesNotMatch(text, /반올림하기 전의 몫은/);
    const candidates = [];
    for (let digit = 0; digit <= 9; digit += 1) {
      const dividend = add(decimal(`${base}${digit}5`), decimal(added));
      const quotient = div(dividend, decimal(divisorText));
      const inInterval = compare(quotient, lower) >= 0n && compare(quotient, upper) < 0n;
      assert.equal(inInterval, round(quotient, 2) === round(decimal(target), 2));
      if (inInterval) candidates.push(digit);
      enumerated += 1;
    }
    assert.equal(candidates.length, 1);
    answer = String(candidates[0]);
    const baseAfter = finite(add(decimal(base), decimal(added)));
    assert.match(baseAfter, /^\d+\.\d{2}$/);
    const dividend = `${baseAfter}${answer}5`;
    facts = { dividendTemplate: `${baseAfter}□5`, divisor: divisorText, roundedHundredths: target, blankCount: 1 };
    Object.assign(values, { dividendTemplate: facts.dividendTemplate, inputTemplate: `${base}□5`, added, divisor: divisorText,
      roundedHundredths: target, candidates, lowerQuotientInclusive: fixed(round(lower, 3), 3),
      upperQuotientExclusive: fixed(round(upper, 3), 3), lowerDividendInclusive: finite(mul(lower, decimal(divisorText))),
      upperDividendExclusive: finite(mul(upper, decimal(divisorText))), dividend });
    rows["가능한 수"] = dividend;
    branch = level === 0 ? "interval-given" : level === 1 ? "derive-one-blank-interval" : "add-before-one-blank-interval";
  } else if (source.suffix === "mission-4") {
    let limit, truck, available, box;
    if (level === 0) {
      const [, amount, weight] = match(text, `실을 수 있는 무게가 ${N}t인 트럭.*한 개의 무게가 ${N}t인 상자`);
      available = decimal(amount); box = decimal(weight);
    } else if (level === 1) {
      const [, cap, empty, weight] = match(text, `최대 무게가 ${N}t인 다리.*무게가 ${N}t인 트럭.*한 개의 무게가 ${N}t인 상자`);
      limit = decimal(cap); truck = decimal(empty); box = decimal(weight); available = sub(limit, truck);
    } else {
      const [, cap, empty, equipment, weight] = match(text, `최대 무게가 ${N}t인 다리.*트럭의 무게는 ${N}t이고.*장비의 무게는 ${N}t.*한 개의 무게가 ${N}t인 상자`);
      assert.match(text, /트럭과 장비와 상자의 무게를 모두 합하여/);
      limit = decimal(cap); truck = add(decimal(empty), decimal(equipment)); box = decimal(weight); available = sub(limit, truck);
    }
    assert.match(text, /몇 개까지/);
    positive(available, box);
    const ratio = div(available, box), count = ratio.n / ratio.d;
    const last = mul(q(count), box), next = mul(q(count + 1n), box);
    assert(compare(last, available) <= 0n && compare(next, available) > 0n);
    if (limit) assert(compare(add(truck, last), limit) <= 0n && compare(add(truck, next), limit) > 0n);
    answer = `${count}개`;
    facts = limit ? { bridgeLimitT: finite(limit), truckT: finite(truck), boxT: finite(box) } : { boxT: finite(box) };
    Object.assign(values, { ...facts, availableT: finite(available), maximumBoxes: String(count), lastAllowedBoxesT: finite(last), nextBoxesT: finite(next) });
    rows["상자에 쓸 수 있는 무게"] = `${finite(available)}t`;
    branch = level === 0 ? "payload-given" : level === 1 ? "subtract-truck" : "combine-truck-equipment-then-subtract";
  } else if (source.suffix === "mission-6") {
    const [, edgeText] = match(text, `한 모서리의 길이가 ${N}cm인 정육면체`);
    const edge = decimal(edgeText);
    let dimensions, counts, outerWidth, reserved = q(0n);
    if (level === 0) {
      const [, width, depth, height] = match(text, "가로 방향 한 줄에 (\\d+)개, 세로 방향 한 줄에 (\\d+)개가 놓이고, 높이 방향으로 (\\d+)층");
      counts = [width, depth, height].map(BigInt);
      dimensions = counts.map(count => mul(q(count), edge));
      outerWidth = dimensions[0];
    } else {
      const [, width, depth, height] = match(text, `가로가 ${N}cm, 세로가 ${N}cm, 높이가 ${N}cm`);
      dimensions = [width, depth, height].map(decimal); outerWidth = dimensions[0];
      assert.match(text, /상자의 두께는 생각하지 않습니다/);
      if (level === 2) {
        const [, widthReserved] = match(text, `가로 방향으로 폭 ${N}cm인 부분은 상자의 세로와 높이 전체에 걸쳐 비워 두고`);
        reserved = decimal(widthReserved); equal(reserved, edge);
        dimensions[0] = sub(dimensions[0], reserved);
      } else assert.doesNotMatch(text, /비워 두고/);
      counts = dimensions.map(dimension => {
        const ratio = div(dimension, edge);
        assert.equal(ratio.d, 1n, "Axis-aligned tiling achieves the volume upper bound");
        return ratio.n;
      });
    }
    positive(edge, ...dimensions, ...counts.map(count => q(count)));
    const total = counts.reduce((a, b) => a * b, 1n);
    const volume = dimensions.reduce(mul, q(1n)), cubeVolume = mul(mul(edge, edge), edge);
    equal(volume, mul(q(total), cubeVolume));
    assert(compare(mul(q(total + 1n), cubeVolume), volume) > 0n, "One more cube is impossible even allowing rotations");
    answer = `${total}개`;
    facts = { widthCm: finite(dimensions[0]), depthCm: finite(dimensions[1]), heightCm: finite(dimensions[2]), cubeEdgeCm: edgeText };
    Object.assign(values, { ...facts, outerWidthCm: finite(outerWidth), reservedWidthCm: finite(reserved), cubeCount: String(total) });
    for (const [i, label] of ["가로 방향", "세로 방향", "높이 방향"].entries()) rows[label] = `${counts[i]}${i === 2 ? "층" : "개"}`;
    for (const [i, axis] of ["width", "depth", "height"].entries()) {
      assert.equal(item.dimensionQuotients?.[axis], String(counts[i]));
      assert.equal(item.axisCounts?.[axis], Number(counts[i]));
    }
    branch = level === 0 ? "axis-counts-given" : level === 1 ? "three-dimension-quotients" : "reserved-width-and-three-quotients";
  } else assert.fail(`Unexpected source ${source.suffix}`);
  rows["답"] = answer;
  return { answer, facts, values, rows, branch, enumerated };
}

function verify(source, item, level, pool) {
  assert(item, `${idFor(source)}: public generation is still gated`);
  const computed = solve(source, item, level);
  assert.equal(item.answer, computed.answer, `${idFor(source)} pool ${pool} level ${level}: independent printed-prompt answer`);
  assert.equal(item.sourceItemId, idFor(source));
  assert.equal(item.generator, source.key);
  assert.equal(item.verifiedPoolIndex, pool);
  assert.equal(item.verifiedVariantCount, 3);
  assert.equal(item.generationMode, "fixed-verified-pool");
  if (!source.central || item.difficultyDesign !== undefined) assert.equal(item.difficultyDesign, source.designs[level]);
  assert(item.answerVisual.includes(`data-difficulty-design="${source.designs[level]}"`));
  assert(item.answerVisual.includes('data-print-weight="compact"'));
  assert.doesNotMatch(item.answerVisual, /NaN|Infinity|undefined/);
  verifySolutionEquations(item.solution);
  if (!source.central) {
    assert.equal(item.publisherAnswerVerified, false);
    assert.equal(item.handwrittenAnswerVerified, false);
    const evidence = item.sourceEvidence;
    assert.equal(evidence?.originalAnswerStatus, "independently-computed");
    assert.equal(evidence.publisherAnswerVerified, false);
    assert.equal(evidence.handwrittenAnswerVerified, false);
    assert.equal(evidence.handwritingAgreesWithCalculation, source.agrees);
    assert(evidence.handwritingReading.includes(source.handwriting));
    assert.equal(evidence.originalAnswer, source.answer);
    for (const [key, value] of Object.entries(source.facts)) assert.deepEqual(evidence.originalNumbers[key], value);
    for (const [key, value] of Object.entries(computed.values)) {
      assert.deepEqual(JSON.parse(JSON.stringify(item.exactValues[key])), value, `Producer metadata checked only after solving: ${key}`);
    }
    const table = [...item.answerVisual.matchAll(/<tr><th[^>]*>([^<]*)<\/th><td[^>]*>([^<]*)<\/td><\/tr>/g)];
    assert.equal(table.length, Object.keys(computed.rows).length);
    assert.deepEqual(Object.fromEntries(table.map(row => [plain(row[1]), plain(row[2])])), computed.rows);
    const cells = [...item.answerVisual.matchAll(/<(?:th|td)\b[^>]*>/g)];
    assert(cells.length > 0 && cells.every(cell => /style="color:#000;font-weight:400"/.test(cell[0])));
  }
  if (level === 1 && pool === 0) {
    assert.equal(computed.answer, source.answer);
    assert.deepEqual(computed.facts, source.facts, "Exact original pool-0 conditions, including card order and the single blank");
  }
  return computed;
}

const failures = [], seen = new Set(), summaries = [];
const counts = { distinctCases: 0, publicCases: 0, lockedCandidateCases: 0, moduloChecks: 0,
  largeVariantModuloChecks: 0, negativeChecks: 0, invalidInputs: 0, forcedLockedChecks: 0, originalChecks: 0, digitEnumerations: 0, cardPermutations: 0 };
function check(label, action) {
  try { action(); } catch (error) { failures.push(`${label}: ${error.message}`); }
}
check("Rounding boundary self-tests", () => {
  assert.equal(roundedText(decimal("1.005"), 2), "1.01");
  assert.equal(roundedText(decimal("1.004999"), 2), "1.00");
  assert.equal(roundedText(decimal("9.995"), 2), "10.00");
  assert.equal(roundedText(decimal("0.865"), 2), "0.87");
  const exact100 = String(round(div(decimal("4.7"), decimal("3.7")), 100));
  assert.equal(exact100, `1${"270".repeat(33)}3`);
  assert.equal([...exact100].reduce((a, b) => a + Number(b), 0), 301);
  verifySolutionEquations('<span class="math-inline-expression">(2+7+0)×33=297</span>');
  assert.throws(() => verifySolutionEquations('<span class="math-inline-expression">1+1=3</span>'));
});
check("Nine module definitions, two central definitions, browser module inclusion", () => {
  assert.equal(sources.filter(source => !source.central).length, 9);
  const moduleNames = api.names.filter(name => /^sourceGrade6DecimalE3/.test(name));
  assert.equal(moduleNames.length, 9);
  assert.equal(new Set(moduleNames).size, 9);
  for (const source of sources) assert(api.names.includes(source.key));
  const centralAt = index.search(/src="(?:\.\/)?generators\.js(?:\?[^"\s]*)?"/);
  const moduleAt = index.search(/src="(?:\.\/)?source-6-2-decimal-e3\.js(?:\?[^"\s]*)?"/);
  assert(centralAt >= 0 && moduleAt > centralAt);
  const publicE3 = types.filter(type => /^6-2-u2-e3-/.test(type.sourceItemId));
  assert.equal(publicE3.length, 13);
  assert.equal(publicE3.filter(type => !type.reviewLocked).length, 10);
  const mission3 = publicE3.find(type => type.sourceItemId === "6-2-u2-e3-mission-3");
  assert.doesNotMatch(`${mission3.name} ${mission3.commonTypeId}`, /두 빈칸|모두 찾기/);
  assert.match(publicE3.find(type => type.sourceItemId === "6-2-u2-e3-mission-5").name, /올림/);
});
for (const suffix of ["exploration-3", "example-3", "mission-5"]) check(`${suffix}: mandatory public lock`, () => {
  const type = types.find(entry => entry.sourceItemId === `6-2-u2-e3-${suffix}`);
  assert(type?.reviewLocked);
  assert.equal(api.generatorKey(type), "");
  for (const offset of [-1, 0, 1]) for (const pool of [0, 1, 2]) assert.equal(api.generate(type, 0, offset, 1, pool), null);
});
check("Raw handwriting conflict, single-blank and ceiling contracts", () => {
  const third = raw.find(entry => entry.sourceItemId === "6-2-u2-e3-exploration-3");
  assert.equal(third.independentAnswer, "0.90");
  assert.equal(third.answerEvidence.handwritingReading, "0.81");
  assert.equal(third.answerEvidence.agreement, false);
  assert.equal(third.answerEvidence.handwrittenAnswerVerified, false);
  assert.match(third.implementationStatus, /locked/);
  const mission3 = raw.find(entry => entry.sourceItemId === "6-2-u2-e3-mission-3");
  assert.equal(mission3.answerContract, "single-valid-digit-from-rounded-hundredth");
  assert.doesNotMatch(`${mission3.sourceShape} ${mission3.visualRisk}`, /두 빈칸|빈칸 두 개/);
  const mission5 = raw.find(entry => entry.sourceItemId === "6-2-u2-e3-mission-5");
  assert.equal(mission5.answerContract, "count-two-decimal-divisors-in-ceiling-quotient-range");
  assert.match(mission5.implementationStatus, /ambiguity-locked/);
  const lower = div(decimal("48.21"), decimal("6.4"));
  const upper = div(decimal("48.21"), decimal("6.3"));
  const firstCents = ceil(mul(lower, q(100n))), lastCents = ceil(mul(upper, q(100n))) - 1n;
  assert.equal(firstCents, 754n); assert.equal(lastCents, 765n);
  const divisors = [];
  for (let cents = firstCents - 1n; cents <= lastCents + 1n; cents += 1n) {
    const divisor = q(cents, 100n);
    const intervalMatch = compare(divisor, lower) >= 0n && compare(divisor, upper) < 0n;
    const ceilingMatch = ceil(mul(div(decimal("48.21"), divisor), q(10n))) === 64n;
    assert.equal(ceilingMatch, intervalMatch);
    if (ceilingMatch) divisors.push(fixed(cents, 2));
  }
  assert.deepEqual(divisors, ["7.54", "7.55", "7.56", "7.57", "7.58", "7.59", "7.60", "7.61", "7.62", "7.63", "7.64", "7.65"]);
  assert.equal(divisors.filter(value => !value.endsWith("0")).length, 11);
});

for (const source of sources) {
  const id = idFor(source), type = types.find(entry => entry.sourceItemId === id);
  check(`${id}: catalog gate`, () => {
    assert(type);
    assert.equal(type.reviewLocked, Boolean(source.candidateOnly));
    if (!source.candidateOnly) {
      assert.equal(type.generatorKey, source.key);
      assert.equal(type.verifiedVariantCount, 3);
    }
    const record = raw.find(entry => entry.sourceItemId === id);
    assert(record?.sourceVerified);
    assert.equal(record.pdfPage, source.suffix.startsWith("mission-") ? 21 : 20);
    assert.equal(record.printedPage, source.suffix.startsWith("mission-") ? 23 : 22);
    assert.notEqual(record.answerEvidence?.officialAnswerVerified, true);
  });
  if (!type) continue;
  // The only unlocked candidate clone is the handwriting-conflicted exploration-3. Public data is frozen.
  const inspectedType = source.candidateOnly ? { ...type, reviewLocked: false, generatorKey: source.key } : type;
  const levelRows = [];
  for (const pool of [0, 1, 2]) {
    const branches = new Set(), prompts = new Set(), steps = [];
    for (const level of [0, 1, 2]) check(`${id} pool ${pool} level ${level}`, () => {
      const item = api.generate(inspectedType, 0, level - 1, 1, pool);
      const computed = verify(source, item, level, pool);
      const signature = `${id}:${plain(item.prompt)}`;
      assert(!seen.has(signature), "Not a repeated seed dressed up as a distinct condition");
      seen.add(signature); counts.distinctCases += 1;
      counts[source.candidateOnly ? "lockedCandidateCases" : "publicCases"] += 1;
      if (source.suffix === "mission-2") counts.cardPermutations += computed.enumerated;
      else counts.digitEnumerations += computed.enumerated;
      branches.add(computed.branch); prompts.add(plain(item.prompt));
      if (!source.central || item.reasoningSteps !== undefined) steps.push(item.reasoningSteps);
      const cyclic = api.generate(inspectedType, 0, level - 1, 1, pool + 3);
      verify(source, cyclic, level, pool);
      for (const key of ["prompt", "answer", "solution", "answerVisual"]) assert.equal(cyclic[key], item[key]);
      counts.moduloChecks += 1;
      assert.throws(() => verify(source, { ...item, answer: "999999" }, level, pool));
      assert.throws(() => verify(source, { ...item, prompt: "" }, level, pool));
      counts.negativeChecks += 2;
      if (pool === 0 && level === 1) counts.originalChecks += 1;
      levelRows.push({ pool, level, answer: computed.answer, branch: computed.branch });
    });
    check(`${id} pool ${pool}: three structural difficulties`, () => {
      assert.equal(branches.size, 3); assert.equal(prompts.size, 3);
      if (steps.length) {
        assert.equal(steps.length, 3);
        assert(steps.every(Number.isInteger));
        assert(steps[0] <= steps[1] && steps[1] < steps[2]);
      }
    });
  }
  check(`${id}: forced lock`, () => {
    const forced = { ...inspectedType, reviewLocked: true, generatorKey: source.key };
    assert.equal(api.generatorKey(forced), "");
    assert.equal(api.generate(forced, 0, 0, 1, 0), null);
    assert.equal(api.generate(forced, 0, Infinity, 1, NaN), null, "The public lock takes precedence over invalid inputs");
    counts.forcedLockedChecks += 1;
  });
  if (!inspectedType.reviewLocked) {
    check(`${id}: maximum safe variant modulo`, () => {
      const pool = Number(BigInt(Number.MAX_SAFE_INTEGER) % 3n);
      verify(source, api.generate(inspectedType, 0, 0, 1, Number.MAX_SAFE_INTEGER), 1, pool);
      counts.largeVariantModuloChecks += 1;
    });
    for (const offset of [-2, 2, 0.5, "0", NaN, Infinity]) check(`${id}: reject difficulty ${typeof offset}:${String(offset)}`, () => {
      assert.throws(() => api.generate(inspectedType, 0, offset, 1, 0)); counts.invalidInputs += 1;
    });
    for (const variant of [-1, 0.5, "1", NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) check(`${id}: reject variant ${String(variant)}`, () => {
      assert.throws(() => api.generate(inspectedType, 0, 0, 1, variant)); counts.invalidInputs += 1;
    });
  }
  summaries.push({ id, mode: source.candidateOnly ? "locked-candidate-only" : "public", conditions: levelRows });
}

check("Final exact counts", () => {
  assert.equal(counts.distinctCases, 99);
  assert.equal(counts.publicCases, 90);
  assert.equal(counts.lockedCandidateCases, 9);
  assert.equal(counts.originalChecks, 11);
  assert.equal(counts.moduloChecks, 99);
  assert.equal(counts.largeVariantModuloChecks, 11);
  assert.equal(counts.negativeChecks, 198);
  assert.equal(counts.invalidInputs, 132);
  assert.equal(counts.forcedLockedChecks, 11);
  assert.equal(counts.digitEnumerations, 180);
  assert.equal(counts.cardPermutations, 6480);
});
check("Immutable public data and input file hashes", () => {
  assert.equal(JSON.stringify(catalog), catalogBefore);
  assert.equal(JSON.stringify(curriculum), curriculumBefore);
  for (const [name, before] of snapshots) {
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, name), "utf8")).digest("hex"), before, `File changed during audit: ${name}`);
  }
});
console.log(JSON.stringify({ scope: "9 module definitions + 2 central; 99 distinct prompt conditions; not browser/PDF/publisher-key verification", counts,
  handwriting: { exploration3: { independent: "0.90", read: "0.81", disagrees: true,
    publicLocked: types.find(type => type.sourceItemId === "6-2-u2-e3-exploration-3")?.reviewLocked },
    mission5: { operation: "ceiling", hundredthGrid: "7.54..7.65", countIncluding7_60: 12, countExcluding7_60: 11,
      interpretationLocked: types.find(type => type.sourceItemId === "6-2-u2-e3-mission-5")?.reviewLocked } },
  summaries }, null, 2));
if (failures.length) {
  console.error(`E3 RELEASE AUDIT FAILED: ${failures.length} checks\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("E3 RELEASE AUDIT PASS: 90 public + 9 locked-candidate cases; all exact original targets, difficulties, integer boundaries and input rejection checks passed.");
  console.log("No publisher answer key claim, no handwritten-answer proof, no render/deployment claim, no file writes.");
}
