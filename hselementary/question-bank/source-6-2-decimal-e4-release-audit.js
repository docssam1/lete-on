"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

// Independently read PDF 22/23, printed 24/25. No publisher key or producer pool is an arithmetic input.
const originals = [
  { suffix: "exploration-1", facts: { total: "24.64", each: "3.75" }, answer: "6개, 2.14g", handwriting: "6개, 2.14g", agreement: true },
  { suffix: "exploration-2", facts: { divisor: "7.13", quotient: "2.47" }, answer: "0.4991", handwriting: "absent", agreement: null },
  { suffix: "example-1", facts: { dividends: ["3685", "368.5", "36.85"], divisor: "6.5" }, answer: "566, 6; 56, 4.5; 5, 4.35", handwriting: "56, 4.5; 5, 4.35; first row faint", agreement: null },
  { suffix: "example-2", facts: { dividend: "4.88", divisor: "2.75", places: 1 }, answer: "0.07", handwriting: "0.07 / overwritten 0.007: uncertain", agreement: null },
  { suffix: "example-3", facts: { divisor: "2.6", remainder: "0.02", rounded: "3.5", newDivisor: "1.4" }, answer: "0.002", handwriting: "0.002", agreement: true },
  { suffix: "example-4", facts: { divisor: "2.93", quotient: "3.7", remainder: "0.16", places: 2 }, answer: "0.0135", handwriting: "0.16", agreement: false, locked: true },
  { suffix: "mission-1", facts: { pairs: [["3.5", "2.9"], ["12.28", "0.15"], ["15.01", "5.31"], ["8.8", "6.23"]] }, answer: "ㄷ, ㄹ, ㄱ, ㄴ", handwriting: "ㄷ, ㄹ, ㄱ, ㄴ", agreement: true },
  { suffix: "mission-2", facts: { divisor: "13.7", quotient: "1.26" }, answer: "0.822", handwriting: "0.822 matches; earlier 1.192 not clearly erased", agreement: null },
  { suffix: "mission-3", facts: { divisor: "2.9", quotient: "5", remainder: "2.8", newDivisor: "4.2" }, answer: "0.08", handwriting: "0.08", agreement: true },
  { suffix: "mission-4", facts: { dividend: "1.36", divisor: "0.75", places: 2 }, answer: "0.005", handwriting: "0.005; earlier value crossed out", agreement: true },
  { suffix: "mission-5", facts: { divisor: "3", remainder: "0.1", rounded: "7", newDivisor: "5" }, answer: "0.3", handwriting: "0.3", agreement: true },
  { suffix: "mission-6", facts: { divisor: "2.11", remainder: "0.0186", rounded: "2.55" }, answer: "5.378", handwriting: "5.378; earlier 6.5326 crossed out", agreement: true }
];
const sources = originals.filter(source => !source.locked);
const idFor = source => `6-2-u2-e4-${source.suffix}`;
const keyFor = source => `sourceGrade6DecimalE4${source.suffix.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join("")}`;
const N = "(\\d+(?:\\.\\d+)?)";
const plain = markup => String(markup).replace(/<[^>]*>/g, "")
  .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, entity => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " }[entity]))
  .replace(/−/g, "-").replace(/\s+/g, " ").trim();
function match(text, pattern) {
  const found = [...text.matchAll(new RegExp(pattern, "gu"))];
  assert.equal(found.length, 1, `Expected one complete printed condition: ${pattern}\n${text}`);
  return found[0];
}
const pow = places => 10n ** BigInt(places);
function gcd(a, b) {
  a = a < 0n ? -a : a;
  while (b) [a, b] = [b, a % b];
  return a;
}
function q(n, d = 1n) {
  assert(d > 0n);
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
function decimal(text) {
  assert.match(String(text), /^\d+(?:\.\d+)?$/);
  const [whole, fraction = ""] = String(text).split(".");
  return q(BigInt(whole + fraction), pow(fraction.length));
}
const add = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a, b) => q(a.n * b.n, a.d * b.d);
const div = (a, b) => { assert(b.n > 0n); return q(a.n * b.d, a.d * b.n); };
const compare = (a, b) => a.n * b.d - b.n * a.d;
const equal = (a, b) => assert.equal(compare(a, b), 0n);
const positive = (...values) => values.forEach(value => assert(value.n > 0n));
function fixed(integer, places) {
  assert(integer >= 0n);
  const digits = String(integer).padStart(places + 1, "0");
  return places ? `${digits.slice(0, -places)}.${digits.slice(-places)}` : digits;
}
function finite(value) {
  assert(value.n >= 0n);
  for (let places = 0; places <= 12; places += 1) {
    const scaled = value.n * pow(places);
    if (scaled % value.d === 0n) return fixed(scaled / value.d, places);
  }
  assert.fail("Expected an exact terminating decimal");
}
function trunc(value, places) {
  assert(value.n >= 0n);
  return q(value.n * pow(places) / value.d, pow(places));
}
// Round by the scaled quotient's remainder, then verify the half-open interval independently.
function round(value, places) {
  assert(value.n >= 0n);
  const scaled = value.n * pow(places);
  const integer = scaled / value.d + (2n * (scaled % value.d) >= value.d ? 1n : 0n);
  const result = q(integer, pow(places));
  const half = q(1n, 2n * pow(places));
  assert(compare(value, sub(result, half)) >= 0n);
  assert(compare(value, add(result, half)) < 0n);
  return result;
}
function division(dividend, divisor, places) {
  positive(divisor);
  const quotient = trunc(div(dividend, divisor), places);
  const remainder = sub(dividend, mul(divisor, quotient));
  assert(remainder.n >= 0n);
  assert(compare(remainder, div(divisor, q(pow(places)))) < 0n);
  equal(add(mul(divisor, quotient), remainder), dividend);
  return { quotient, remainder };
}
function minimumAddition(dividend, divisor, places) {
  const scaled = mul(div(dividend, divisor), q(pow(places)));
  assert(scaled.n % scaled.d !== 0n, "Original division must not already terminate at the requested place");
  const next = q(scaled.n / scaled.d + 1n, pow(places));
  const result = sub(mul(divisor, next), dividend);
  positive(result);
  assert(compare(mul(divisor, sub(next, q(1n, pow(places)))), dividend) < 0n);
  equal(division(add(dividend, result), divisor, places).remainder, q(0n));
  return { addition: result, nextQuotient: next };
}
function minimumShorterRemainder(divisor, quotient) {
  const shorter = trunc(quotient, 1);
  equal(trunc(quotient, 2), quotient);
  assert(compare(quotient, shorter) >= 0n);
  assert(compare(add(quotient, q(1n, 100n)), add(shorter, q(1n, 10n))) <= 0n);
  const dividendLower = mul(divisor, quotient);
  const dividendUpper = mul(divisor, add(quotient, q(1n, 100n)));
  const minimum = sub(dividendLower, mul(divisor, shorter));
  const upper = sub(dividendUpper, mul(divisor, shorter));
  equal(division(dividendLower, divisor, 2).remainder, q(0n));
  equal(division(dividendLower, divisor, 1).remainder, minimum);
  return { shorter, minimum, upper, dividendLower, dividendUpper };
}
function constrainedRoundedDividends(divisor, remainder, target, quotientPlaces, roundedPlaces) {
  assert(compare(remainder, div(divisor, q(pow(quotientPlaces)))) < 0n);
  const half = q(1n, 2n * pow(roundedPlaces));
  const lower = sub(target, half), upper = add(target, half);
  const offset = div(remainder, divisor), candidates = [];
  const first = trunc(sub(lower, offset), quotientPlaces);
  const last = add(trunc(sub(upper, offset), quotientPlaces), q(1n, pow(quotientPlaces)));
  for (let current = sub(first, q(1n, pow(quotientPlaces))); compare(current, last) <= 0n; current = add(current, q(1n, pow(quotientPlaces)))) {
    if (current.n < 0n) continue;
    const dividend = add(mul(divisor, current), remainder);
    const fullQuotient = div(dividend, divisor);
    const inside = compare(fullQuotient, lower) >= 0n && compare(fullQuotient, upper) < 0n;
    assert.equal(compare(round(fullQuotient, roundedPlaces), target) === 0n, inside);
    if (inside) {
      equal(division(dividend, divisor, quotientPlaces).quotient, current);
      candidates.push({ quotient: current, dividend });
    }
  }
  assert(candidates.length > 0);
  return candidates;
}
function roundedThirdWithRemainder(divisor, remainder, target) {
  assert(compare(remainder, div(divisor, q(100n))) < 0n, "The printed remainder belongs to the hundredth quotient");
  const result = [], quotientFraction = trunc(div(remainder, divisor), 3);
  // This exact bound also proves completeness when a variant's target is larger than the source target.
  const lower = sub(sub(target, q(1n, 200n)), quotientFraction);
  const upper = sub(add(target, q(1n, 200n)), quotientFraction);
  const first = lower.n < 0n ? 0n : lower.n * 100n / lower.d;
  const last = upper.n * 100n / upper.d + 1n;
  for (let cents = first; cents <= last; cents += 1n) {
    const second = q(cents, 100n), dividend = add(mul(divisor, second), remainder);
    const third = trunc(div(dividend, divisor), 3);
    equal(third, add(second, quotientFraction));
    if (compare(round(third, 2), target) === 0n) result.push({ second, third, dividend });
  }
  assert.equal(result.length, 1, "Exactly one hundredth quotient after truncating third, then rounding second");
  return result[0];
}

function originalAnswer(source) {
  const f = source.facts;
  if (source.suffix === "exploration-1") {
    const d = division(decimal(f.total), decimal(f.each), 0);
    return `${finite(d.quotient)}개, ${finite(d.remainder)}g`;
  }
  if (source.suffix === "exploration-2") return finite(minimumShorterRemainder(decimal(f.divisor), decimal(f.quotient)).minimum);
  if (source.suffix === "example-1") return f.dividends.map(value => {
    const d = division(decimal(value), decimal(f.divisor), 0);
    return `${finite(d.quotient)}, ${finite(d.remainder)}`;
  }).join("; ");
  if (["example-2", "mission-4"].includes(source.suffix)) return finite(minimumAddition(decimal(f.dividend), decimal(f.divisor), f.places).addition);
  if (["example-3", "mission-5"].includes(source.suffix)) {
    const candidates = constrainedRoundedDividends(decimal(f.divisor), decimal(f.remainder), decimal(f.rounded), source.suffix === "example-3" ? 2 : 1, source.suffix === "example-3" ? 1 : 0);
    const chosen = source.suffix === "example-3" ? candidates[0] : candidates[candidates.length - 1];
    return finite(division(chosen.dividend, decimal(f.newDivisor), source.suffix === "example-3" ? 2 : 1).remainder);
  }
  if (source.suffix === "mission-1") {
    const values = f.pairs.map(([a, b], i) => ({ label: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"][i], remainder: division(decimal(a), decimal(b), 1).remainder }));
    values.sort((a, b) => compare(a.remainder, b.remainder) > 0n ? -1 : 1);
    return values.map(value => value.label).join(", ");
  }
  if (source.suffix === "mission-6") return finite(roundedThirdWithRemainder(decimal(f.divisor), decimal(f.remainder), decimal(f.rounded)).dividend);
  const dividend = add(mul(decimal(f.divisor), decimal(f.quotient)), decimal(f.remainder || "0"));
  return finite(division(dividend, decimal(f.newDivisor || f.divisor), f.places || 1).remainder);
}

const failures = [], summaries = [], snapshots = new Map();
const counts = { distinctCases: 0, originalChecks: 0, sourceFactChecks: 0, moduloChecks: 0, maxSafeModuloChecks: 0,
  negativeChecks: 0, invalidInputs: 0, forcedLockedChecks: 0, mission6Enumerations: 0 };
function check(label, action) {
  try { action(); } catch (error) { failures.push(`${label}: ${error.message}`); }
}
function readFile(name) {
  const buffer = fs.readFileSync(path.join(__dirname, name));
  snapshots.set(name, crypto.createHash("sha256").update(buffer).digest("hex"));
  return buffer.toString("utf8");
}
function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
}
function sourceSelfChecks() {
  assert.equal(originals.length, 12);
  assert.equal(sources.length, 11);
  for (const source of originals) {
    assert.equal(originalAnswer(source), source.answer, idFor(source));
    counts.sourceFactChecks += 1;
  }
  equal(round(decimal("2.545"), 2), decimal("2.55"));
  equal(round(decimal("2.544999"), 2), decimal("2.54"));
  equal(round(decimal("2.555"), 2), decimal("2.56"));
  equal(round(trunc(decimal("2.54499"), 3), 2), decimal("2.54"));
  equal(round(round(decimal("2.54499"), 3), 2), decimal("2.55"));
  const interval = minimumShorterRemainder(decimal("7.13"), decimal("2.47"));
  assert.equal(finite(interval.minimum), "0.4991");
  assert.equal(finite(interval.upper), "0.5704");
  assert.equal(finite(interval.dividendLower), "17.6111");
  const matches = [];
  for (let cents = 0n; cents < 1000n; cents += 1n) {
    const second = q(cents, 100n), dividend = add(mul(decimal("2.11"), second), decimal("0.0186"));
    if (compare(round(trunc(div(dividend, decimal("2.11")), 3), 2), decimal("2.55")) === 0n) matches.push(finite(dividend));
  }
  assert.deepEqual(matches, ["5.378"]);
  assert.equal(originalAnswer(originals.find(source => source.locked)), "0.0135");
}

const designs = {
  "exploration-1": ["ring-count-given-find-leftover", "source-whole-ring-count-and-leftover", "combine-two-gold-amounts-before-ring-count"],
  "exploration-2": ["minimum-dividend-given", "source-zero-hundredth-remainder-attains-minimum", "derive-divisor-before-minimum-remainder"],
  "example-1": ["three-whole-quotients-given", "source-three-whole-quotients-and-remainders", "derive-shared-divisor-before-three-divisions"],
  "example-2": ["next-exact-quotient-given", "source-next-exact-quotient-and-minimum-addition", "reconstruct-dividend-before-minimum-addition"],
  "example-3": ["minimum-original-dividend-given", "source-smallest-dividend-from-remainder-and-rounding", "derive-first-divisor-before-smallest-dividend"],
  "mission-1": ["four-truncated-tenths-quotients-given", "source-four-remainders-and-descending-order", "reconstruct-first-dividend-before-four-remainders"],
  "mission-2": ["original-dividend-given", "source-exact-quotient-to-tenths-remainder", "derive-divisor-before-exact-quotient-reconstruction"],
  "mission-3": ["original-dividend-given", "source-whole-quotient-and-remainder-reconstruction", "derive-first-divisor-before-reconstruction"],
  "mission-4": ["next-exact-quotient-given", "source-next-exact-quotient-and-minimum-addition", "reconstruct-dividend-before-minimum-addition"],
  "mission-5": ["maximum-original-dividend-given", "source-largest-dividend-from-remainder-and-whole-rounding", "derive-first-divisor-before-largest-dividend"],
  "mission-6": ["truncated-hundredths-quotient-given", "source-truncate-three-then-round-two-to-reconstruct", "derive-divisor-before-two-stage-quotient-inference"]
};

function evaluate(expression) {
  const text = plain(expression).replace(/\s/g, "");
  const tokens = text.match(/\d+(?:\.\d+)?|[()+×÷-]/g) || [];
  assert.equal(tokens.join(""), text, `Unsupported arithmetic expression: ${text}`);
  let position = 0;
  function atom() {
    if (tokens[position] === "(") {
      position += 1;
      const value = sum();
      assert.equal(tokens[position++], ")");
      return value;
    }
    return decimal(tokens[position++]);
  }
  function product() {
    let result = atom();
    while (["×", "÷"].includes(tokens[position])) {
      const operator = tokens[position++], next = atom();
      result = operator === "×" ? mul(result, next) : div(result, next);
    }
    return result;
  }
  function sum() {
    let result = product();
    while (["+", "-"].includes(tokens[position])) {
      const operator = tokens[position++], next = product();
      result = operator === "+" ? add(result, next) : sub(result, next);
    }
    return result;
  }
  const result = sum();
  assert.equal(position, tokens.length);
  return result;
}
function verifySolutionEquations(markup) {
  for (const [, expression] of markup.matchAll(/<span\b[^>]*class="math-inline-expression"[^>]*>([^<]*)<\/span>/g)) {
    const text = plain(expression);
    if (!text.includes("=")) continue;
    const parts = text.split("=");
    assert.equal(parts.length, 2);
    equal(evaluate(parts[0]), evaluate(parts[1]));
  }
}
function divisorWords(text, level, following) {
  if (level === 2) {
    const [, first, second] = match(text, `${N}와 ${N}를 더한 수`);
    positive(decimal(first), decimal(second));
    return finite(add(decimal(first), decimal(second)));
  }
  const [, divisor] = match(text, `어떤 수를 ${N}로 ${following}`);
  return divisor;
}
function directDivision(text, place) {
  const [, dividend, divisor] = match(text, `^${N}를 ${N}로 나누어 몫을 소수 ${place} 자리까지`);
  assert.match(text, /나머지를 구하세요\.$/);
  positive(decimal(dividend), decimal(divisor));
  return { dividend, divisor };
}
function tableRows(markup, phase) {
  const tables = [...markup.matchAll(/<table\b[^>]*data-phase="([^"]+)"[^>]*>([\s\S]*?)<\/table>/g)];
  assert.equal(tables.length, 1);
  assert.equal(tables[0][1], phase);
  return [...tables[0][2].matchAll(/<tr>(?:<th\b[^>]*>([\s\S]*?)<\/th>)?<td\b[^>]*>([\s\S]*?)<\/td><\/tr>/g)]
    .map(row => [plain(row[1] || ""), plain(row[2])]);
}
function noAnswerLeak(prompt) {
  assert.doesNotMatch(prompt, /NaN|Infinity|undefined|<(?:svg|img|canvas)\b/);
  assert.doesNotMatch(prompt, /data-phase="answer"|data-answer|data-correct|data-solution|data-matches|\bhidden\b|aria-hidden="true"|<!--|정답은|정답\s*[:：]/);
}
function solve(source, item, level) {
  const text = plain(item.prompt), solution = plain(item.solution);
  noAnswerLeak(item.prompt);
  assert(text.length > 0);
  const suffix = source.suffix, values = {}, rows = [];
  let facts, answer, required, enumerated = 0;
  if (suffix === "exploration-1") {
    const [, each] = match(text, `(?:반지 한 개에는 금 |금 )${N}g(?:이 들어갑니다|으로 반지 한 개를 만듭니다)`);
    let total, givenCount;
    if (level === 0) {
      const [, shownTotal, count] = match(text, `금 ${N}g으로 반지 (\\d+)개를 만들었습니다`);
      total = shownTotal; givenCount = count;
      required = "반지 한 개에는 금";
    } else {
      assert.match(text, /반지를 몇 개까지 만들 수 있나요\? 그리고 남는 금은 몇 g인가요\?$/);
      required = "몇 개까지";
      if (level === 1) [, total] = match(text, `금 ${N}g으로 반지를`);
      else {
        const [, first, second] = match(text, `금 ${N}g과 ${N}g을 합하여`);
        positive(decimal(first), decimal(second));
        total = finite(add(decimal(first), decimal(second)));
      }
    }
    assert.match(text, /남는 금은 몇 g인가요\?$/);
    const d = division(decimal(total), decimal(each), 0), count = finite(d.quotient), remainder = finite(d.remainder);
    if (givenCount !== undefined) assert.equal(givenCount, count);
    assert(compare(mul(decimal(each), add(d.quotient, q(1n))), decimal(total)) > 0n);
    facts = { total, each };
    Object.assign(values, { goldG: total, perRingG: each, ringCount: count, remainderG: remainder });
    answer = level === 0 ? `${remainder}g` : `${count}개, ${remainder}g`;
    if (level !== 0) rows.push(["반지", `${count}개`]);
    rows.push(["남는 금", `${remainder}g`]);
  } else if (suffix === "exploration-2") {
    let divisor, quotient;
    if (level === 0) {
      const parsed = directDivision(text, "첫째");
      divisor = parsed.divisor;
      const full = div(decimal(parsed.dividend), decimal(divisor));
      equal(full, trunc(full, 2));
      quotient = finite(full);
      required = "첫째 자리까지";
    } else {
      divisor = divisorWords(text, level, "나누어 몫을 소수 둘째 자리까지");
      [, quotient] = match(text, `몫을 소수 둘째 자리까지 구하면 ${N}입니다`);
      assert.match(text, /몫을 소수 첫째 자리까지 구할 때, 나머지가 될 수 있는 수 중 가장 작은 수/);
      required = "가장 작은 수";
    }
    assert.doesNotMatch(text, /반올림|나머지(?:가|는) 0(?:일|인) 수는 제외|나머지가 0보다/);
    const interval = minimumShorterRemainder(decimal(divisor), decimal(quotient));
    facts = { divisor, quotient };
    answer = finite(interval.minimum);
    Object.assign(values, { divisor, truncatedHundredths: quotient, minimumDividend: finite(interval.dividendLower), dividendUpperExclusive: finite(interval.dividendUpper),
      hundredthRemainderAtMinimum: "0", truncatedTenths: fixed(interval.shorter.n * 10n / interval.shorter.d, 1), minimumRemainder: answer, minimumAttained: true, monotonicRemainder: true });
    rows.push(["가장 작은 어떤 수", finite(interval.dividendLower)], ["답", answer]);
    if (level !== 0) assert.match(solution, /둘째 자리까지 구한 나머지가 0일 때/);
  } else if (suffix === "example-1") {
    assert.match(text, level === 0 ? /나머지를 각각 구하세요/ : /몫을 자연수 부분까지 구하고 나머지를 구하세요/);
    required = level === 0 ? "나머지를 각각" : "자연수 부분까지";
    const expressions = tableRows(item.prompt, "problem");
    assert.equal(expressions.length, 3);
    let divisor;
    if (level === 2) divisor = divisorWords(text, level, "");
    const dividends = [], results = [];
    for (const [label, expression] of expressions) {
      assert.equal(label, "");
      const [, dividend, term, shown] = match(expression, `^${N}÷(\\([^()]*\\)|\\d+(?:\\.\\d+)?)=(\\d+(?:\\.\\d+)?|□) … □$`);
      const parsedDivisor = finite(evaluate(term));
      if (level === 2) assert.match(term, /^\(\d+(?:\.\d+)?\+\d+(?:\.\d+)?\)$/);
      else assert.match(term, /^\d+(?:\.\d+)?$/);
      if (divisor === undefined) divisor = parsedDivisor;
      assert.equal(parsedDivisor, divisor);
      const d = division(decimal(dividend), decimal(divisor), 0);
      if (level === 0) assert.equal(shown, finite(d.quotient)); else assert.equal(shown, "□");
      const record = { dividend, quotient: finite(d.quotient), remainder: finite(d.remainder) };
      dividends.push(dividend); results.push(record);
      rows.push([dividend, level === 0 ? `나머지 ${record.remainder}` : `몫 ${record.quotient}, 나머지 ${record.remainder}`]);
    }
    facts = { dividends, divisor };
    answer = level === 0 ? results.map(d => d.remainder).join(", ") : results.map(d => `${d.quotient}, ${d.remainder}`).join("; ");
    Object.assign(values, { divisor, decimalPlaces: 0, divisions: results });
  } else if (["example-2", "mission-4"].includes(suffix)) {
    const places = suffix === "example-2" ? 1 : 2, place = places === 1 ? "첫째" : "둘째";
    let dividend, divisor, shown;
    if (level === 0) {
      [, dividend, divisor, shown] = match(text, `^${N}에 어떤 수를 더한 뒤 ${N}로 나누면 몫이 ${N}이고 나머지가 없습니다`);
      assert.match(text, /더한 수를 구하세요\.$/);
      required = "나머지가 없습니다";
    } else {
      const [, term, parsedDivisor] = match(text, `^(\\([^()]*\\)|\\d+(?:\\.\\d+)?)÷${N}의 몫이 소수 ${place} 자리에서 나누어떨어지도록`);
      divisor = parsedDivisor; dividend = finite(evaluate(term));
      assert.match(text, /나누어지는 수에 어떤 수를 더하려고 합니다\. 더할 수 있는 가장 작은 수/);
      if (level === 2) assert.match(term, /^\(\d+(?:\.\d+)?-\d+(?:\.\d+)?\)$/);
      else assert.match(term, /^\d+(?:\.\d+)?$/);
      required = "가장 작은 수";
    }
    const result = minimumAddition(decimal(dividend), decimal(divisor), places);
    if (shown !== undefined) equal(decimal(shown), result.nextQuotient);
    answer = finite(result.addition);
    facts = { dividend, divisor, places };
    Object.assign(values, { dividend, divisor, decimalPlaces: places,
      nextExactQuotient: fixed(result.nextQuotient.n * pow(places) / result.nextQuotient.d, places), exactDividend: finite(add(decimal(dividend), result.addition)), addition: answer, extremeCandidateCount: 1 });
    const previous = sub(result.nextQuotient, q(1n, pow(places)));
    assert(compare(mul(decimal(divisor), previous), decimal(dividend)) < 0n);
    values.candidateEnumeration = [{ quotient: values.nextExactQuotient, dividend: values.exactDividend }];
    rows.push(["나누어떨어지는 몫", values.nextExactQuotient], ["답", answer]);
  } else if (["example-3", "mission-3", "mission-5"].includes(suffix)) {
    const places = suffix === "example-3" ? 2 : 1, place = places === 2 ? "둘째" : "첫째";
    let dividend, newDivisor;
    if (level === 0) {
      const parsed = directDivision(text, place);
      dividend = decimal(parsed.dividend); newDivisor = parsed.divisor;
      facts = { dividend: parsed.dividend, newDivisor };
      required = `${place} 자리까지`;
    } else if (suffix === "mission-3") {
      const divisor = divisorWords(text, level, "나누어 몫을 자연수 부분까지");
      const [, quotient, remainder] = match(text, `몫을 자연수 부분까지 구했더니 몫은 (\\d+)이고 나머지는 ${N}였습니다`);
      [, newDivisor] = match(text, `어떤 수를 ${N}로 나누어 몫을 소수 첫째 자리까지 구했을 때의 나머지`);
      assert(compare(decimal(remainder), decimal(divisor)) < 0n);
      dividend = add(mul(decimal(divisor), decimal(quotient)), decimal(remainder));
      equal(division(dividend, decimal(divisor), 0).quotient, decimal(quotient));
      facts = { divisor, quotient, remainder, newDivisor };
      Object.assign(values, { firstDivisor: divisor, wholeQuotient: quotient, wholeRemainder: remainder });
      required = "자연수 부분까지";
    } else {
      const divisor = divisorWords(text, level, `나${suffix === "example-3" ? "눈" : "누어"} 몫`);
      const remainder = suffix === "example-3" ? match(text, `소수 둘째 자리까지 구했을 때의 나머지는 ${N}이고`)[1] : match(text, `소수 첫째 자리까지 구하면 ${N}이 남습니다`)[1];
      const rounded = suffix === "example-3" ? match(text, `몫을 반올림하여 소수 첫째 자리까지 나타내면 ${N}가 됩니다`)[1] : match(text, `몫을 반올림하여 자연수까지 나타내면 (\\d+)이 됩니다`)[1];
      [, newDivisor] = match(text, `가장 ${suffix === "example-3" ? "작은" : "큰"} 수를 ${N}로 나누어 몫을 소수 ${place} 자리까지`);
      const candidates = constrainedRoundedDividends(decimal(divisor), decimal(remainder), decimal(rounded), places, places - 1);
      const chosen = suffix === "example-3" ? candidates[0] : candidates[candidates.length - 1];
      dividend = chosen.dividend;
      facts = { divisor, remainder, rounded, newDivisor };
      Object.assign(values, { firstDivisor: divisor, secondDivisor: newDivisor,
        [suffix === "example-3" ? "hundredthRemainder" : "tenthRemainder"]: remainder,
        [suffix === "example-3" ? "roundedTenths" : "roundedWhole"]: rounded,
        [suffix === "example-3" ? "selectedHundredths" : "selectedTenths"]: fixed(chosen.quotient.n * pow(places) / chosen.quotient.d, places),
        candidateEnumeration: candidates.map(candidate => ({ quotient: fixed(candidate.quotient.n * pow(places) / candidate.quotient.d, places), dividend: finite(candidate.dividend) })), extremeCandidateCount: 1 });
      required = `가장 ${suffix === "example-3" ? "작은" : "큰"} 수`;
    }
    const result = division(dividend, decimal(newDivisor), places);
    answer = finite(result.remainder);
    const dividendName = suffix === "example-3" ? "minimumDividend" : suffix === "mission-5" ? "maximumDividend" : "dividend";
    Object.assign(values, { [dividendName]: finite(dividend), secondDivisor: newDivisor,
      newQuotient: fixed(result.quotient.n * pow(places) / result.quotient.d, places), newRemainder: answer });
    rows.push([suffix === "example-3" ? "가장 작은 어떤 수" : suffix === "mission-5" ? "가장 큰 어떤 수" : "어떤 수", finite(dividend)], ["새 나눗셈의 몫", values.newQuotient], ["답", answer]);
  } else if (suffix === "mission-1") {
    assert.match(text, /몫을 소수 첫째 자리까지 구했을 때, 나머지가 큰 순서대로 기호/);
    required = "첫째 자리까지";
    const expressions = tableRows(item.prompt, "problem");
    assert.equal(expressions.length, 4);
    const pairs = [], results = [];
    for (const [i, [label, expression]] of expressions.entries()) {
      assert.equal(label, ["ㄱ", "ㄴ", "ㄷ", "ㄹ"][i]);
      const [, term, divisor, shown] = match(expression, `^(\\([^()]*\\)|\\d+(?:\\.\\d+)?)÷${N}${level === 0 ? `=${N} … □` : ""}$`);
      if (level === 2 && i === 0) assert.match(term, /^\(\d+(?:\.\d+)?\+\d+(?:\.\d+)?\)$/);
      else assert.match(term, /^\d+(?:\.\d+)?$/);
      const dividend = finite(evaluate(term)), d = division(decimal(dividend), decimal(divisor), 1);
      if (level === 0) equal(decimal(shown), d.quotient);
      pairs.push([dividend, divisor]);
      results.push({ label, dividend, divisor, quotient: fixed(d.quotient.n * 10n / d.quotient.d, 1), remainder: finite(d.remainder) });
      rows.push([label, `나머지 ${finite(d.remainder)}`]);
    }
    assert.equal(new Set(results.map(result => result.remainder)).size, 4, "No tied remainder ordering");
    const sorted = [...results].sort((a, b) => compare(decimal(a.remainder), decimal(b.remainder)) > 0n ? -1 : 1);
    answer = sorted.map(result => result.label).join(", ");
    facts = { pairs };
    Object.assign(values, { decimalPlaces: 1, divisions: results, descendingLabels: sorted.map(result => result.label), distinctRemainderCount: 4 });
    rows.push(["답", answer]);
  } else if (suffix === "mission-2") {
    let divisor, dividend, quotient;
    if (level === 0) {
      const parsed = directDivision(text, "첫째");
      divisor = parsed.divisor; dividend = decimal(parsed.dividend);
      quotient = finite(div(dividend, decimal(divisor)));
      required = "첫째 자리까지";
    } else {
      divisor = divisorWords(text, level, "나눈 몫은");
      [, quotient] = match(text, `나눈 몫은 ${N}이고 나머지가 없습니다`);
      if (level === 1) {
        const [, repeated] = match(text, `어떤 수를 ${N}로 나누어 몫을 소수 첫째 자리까지 구할 때 나머지`);
        equal(decimal(repeated), decimal(divisor));
      } else {
        assert.match(text, /어떤 수를 처음과 같은 나누는 수로 나누어 몫을 소수 첫째 자리까지 구할 때 나머지/);
      }
      dividend = mul(decimal(divisor), decimal(quotient));
      required = "나머지가 없습니다";
    }
    equal(trunc(decimal(quotient), 2), decimal(quotient));
    equal(division(dividend, decimal(divisor), 2).remainder, q(0n));
    const result = division(dividend, decimal(divisor), 1);
    answer = finite(result.remainder);
    facts = { divisor, quotient };
    Object.assign(values, { divisor, exactQuotient: quotient, dividend: finite(dividend), truncatedTenths: fixed(result.quotient.n * 10n / result.quotient.d, 1), remainder: answer });
    rows.push(["어떤 수", finite(dividend)], ["답", answer]);
  } else if (suffix === "mission-6") {
    const divisor = divisorWords(text, level, "나누어 몫을 소수 둘째 자리까지");
    let remainder, target, result;
    if (level === 0) {
      const [, second, r] = match(text, `소수 둘째 자리까지 구하면 몫은 ${N}이고 나머지는 ${N}입니다`);
      remainder = r;
      assert(compare(decimal(remainder), div(decimal(divisor), q(100n))) < 0n);
      const dividend = add(mul(decimal(divisor), decimal(second)), decimal(remainder));
      const third = trunc(div(dividend, decimal(divisor)), 3);
      target = finite(round(third, 2));
      result = { second: decimal(second), third, dividend };
      required = "나머지는";
    } else {
      [, remainder] = match(text, `소수 둘째 자리까지 구했더니 나머지가 ${N}이었습니다`);
      [, target] = match(text, `소수 셋째 자리까지 구한 몫을 반올림하여 소수 둘째 자리까지 나타냈더니 ${N}가 되었습니다`);
      result = roundedThirdWithRemainder(decimal(divisor), decimal(remainder), decimal(target));
      required = "셋째 자리까지 구한 몫";
    }
    const enumeratedCandidates = [];
    assert(compare(decimal(target), q(10n)) < 0n, "The independent 1000-hundredth scan covers the displayed target");
    for (let cents = 0n; cents < 1000n; cents += 1n) {
      const second = q(cents, 100n), dividend = add(mul(decimal(divisor), second), decimal(remainder));
      const third = trunc(div(dividend, decimal(divisor)), 3);
      if (compare(round(third, 2), decimal(target)) === 0n) enumeratedCandidates.push({ second, third, dividend });
    }
    assert.equal(enumeratedCandidates.length, 1);
    equal(enumeratedCandidates[0].dividend, result.dividend);
    enumerated = 1000;
    answer = finite(result.dividend);
    facts = { divisor, remainder, rounded: target };
    Object.assign(values, { divisor, hundredthRemainder: remainder, roundedHundredths: target,
      truncatedHundredths: fixed(result.second.n * 100n / result.second.d, 2), truncatedThousandths: fixed(result.third.n * 1000n / result.third.d, 3),
      candidateEnumeration: [{ quotient: fixed(result.second.n * 100n / result.second.d, 2), dividend: answer }], candidateCount: 1, dividend: answer });
    rows.push(["소수 둘째 자리까지의 몫", values.truncatedHundredths]);
    if (level !== 0) {
      rows.push(["소수 셋째 자리까지의 몫", values.truncatedThousandths]);
      assert.match(solution, new RegExp(`셋째 자리까지의 몫은 ${values.truncatedThousandths.replace(".", "\\.")}`));
    }
    rows.push(["답", answer]);
  } else assert.fail(`Unexpected E4 source: ${suffix}`);
  return { facts, answer, values, rows, branch: designs[suffix][level], required, enumerated };
}

function originalNumbers(source) {
  const f = source.facts;
  if (source.suffix === "exploration-1") return { goldG: f.total, perRingG: f.each };
  if (source.suffix === "exploration-2") return { divisor: f.divisor, truncatedHundredths: f.quotient };
  if (source.suffix === "example-1") return f;
  if (["example-2", "mission-4"].includes(source.suffix)) return { dividend: f.dividend, divisor: f.divisor, exactQuotientPlaces: f.places };
  if (source.suffix === "example-3") return { firstDivisor: f.divisor, hundredthRemainder: f.remainder, roundedTenths: f.rounded, secondDivisor: f.newDivisor };
  if (source.suffix === "mission-1") return { expressions: f.pairs, decimalPlaces: 1 };
  if (source.suffix === "mission-2") return { divisor: f.divisor, exactQuotient: f.quotient };
  if (source.suffix === "mission-3") return { firstDivisor: f.divisor, wholeQuotient: f.quotient, wholeRemainder: f.remainder, secondDivisor: f.newDivisor };
  if (source.suffix === "mission-5") return { firstDivisor: f.divisor, tenthRemainder: f.remainder, roundedWhole: f.rounded, secondDivisor: f.newDivisor };
  return { divisor: f.divisor, hundredthRemainder: f.remainder, truncatedPlacesBeforeRounding: 3, roundedHundredths: f.rounded };
}
function verify(source, item, level, pool) {
  assert(item, "Current public generation is still gated; no unlocked clone is permitted");
  const computed = solve(source, item, level);
  assert.equal(item.answer, computed.answer, "Independent student-prompt answer");
  assert.equal(item.sourceItemId, idFor(source));
  assert.equal(item.generator, keyFor(source));
  assert.equal(item.verifiedPoolIndex, pool);
  assert.equal(item.verifiedVariantCount, 3);
  assert.equal(item.verifiedVariantTarget, 3);
  assert.equal(item.verifiedVariantId, `${idFor(source)}:v${pool}`);
  assert.equal(item.generationMode, "fixed-verified-pool");
  assert.equal(item.variantProvenance, pool === 0 && level === 1 ? "source-values" : "source-structure-variant");
  assert.equal(item.difficultyDesign, computed.branch);
  assert.equal(item.difficultyLevel, level);
  assert.equal(item.difficultyRank, level);
  assert.equal(item.difficultyOffset, level - 1);
  assert.equal(item.sourceDifficultyRank, 1);
  assert(Number.isInteger(item.reasoningSteps) && Number.isInteger(item.sourceStepCount));
  assert.equal(item.difficultyStepDelta, item.reasoningSteps - item.sourceStepCount);
  if (level === 1) assert.equal(item.reasoningSteps, item.sourceStepCount);
  assert.equal(item.publisherAnswerVerified, false);
  assert.equal(item.handwrittenAnswerVerified, false);
  const evidence = item.sourceEvidence;
  assert.equal(evidence.originalAnswerStatus, "independently-computed");
  assert.equal(evidence.originalAnswer, source.answer);
  assert.equal(item.sourceAnswer, source.answer);
  assert.equal(evidence.publisherAnswerVerified, false);
  assert.equal(evidence.handwrittenAnswerVerified, false);
  assert.equal(evidence.quotientMode, "truncate-at-stated-place");
  assert.equal(evidence.roundingMode, "half-up-only-when-explicitly-stated");
  assert.equal(evidence.printedPage, source.suffix.startsWith("mission-") ? 25 : 24);
  assert.deepEqual(JSON.parse(JSON.stringify(evidence.originalNumbers)), originalNumbers(source));
  assert.equal(evidence.handwritingAgreesWithCalculation, source.agreement);
  if (source.agreement === true) {
    assert.equal(evidence.handwritingReadingConfirmed, true);
    assert(evidence.handwritingReading.includes(source.answer));
  }
  if (source.suffix === "example-1") {
    assert.equal(evidence.handwritingReadingConfirmed, false);
    const readings = JSON.parse(JSON.stringify(evidence.handwritingReadings));
    assert(readings.some(reading => reading.row === 1 && !reading.confirmed && reading.status === "faint"));
    assert(readings.some(reading => reading.row === 2 && reading.confirmed && reading.reading === "56, 4.5"));
    assert(readings.some(reading => reading.row === 3 && reading.confirmed && reading.reading === "5, 4.35"));
  }
  if (source.suffix === "example-2") {
    assert.equal(evidence.handwritingReadingConfirmed, false);
    assert.match(evidence.handwritingReading, /0\.07/);
    assert.match(evidence.handwritingReading, /0\.007/);
  }
  if (source.suffix === "exploration-2") {
    assert.equal(evidence.handwritingReadingConfirmed, false);
    assert.equal(evidence.handwritingReading, null);
  }
  if (source.suffix === "mission-2") {
    assert.equal(evidence.handwritingReadingConfirmed, false);
    assert.match(evidence.handwritingReading, /0\.822/);
    assert.match(evidence.handwritingReading, /1\.192/);
    const readings = JSON.parse(JSON.stringify(evidence.handwritingReadings));
    assert(readings.some(reading => reading.reading === "0.822" && reading.confirmed));
    assert(readings.some(reading => reading.reading === "1.192" && reading.status === "visible-not-cancelled"));
  }
  for (const [key, value] of Object.entries(computed.values)) {
    assert.deepEqual(JSON.parse(JSON.stringify(item.exactValues[key])), value, `Producer output metadata, not a solver input: ${key}`);
  }
  assert(item.answerVisual.includes(`data-difficulty-design="${computed.branch}"`));
  assert(item.answerVisual.includes('data-print-weight="compact"'));
  assert.doesNotMatch(item.answerVisual, /NaN|Infinity|undefined/);
  assert.deepEqual(tableRows(item.answerVisual, "answer"), computed.rows);
  const cells = [...item.answerVisual.matchAll(/<(?:th|td)\b[^>]*>/g)];
  assert(cells.length > 0 && cells.every(cell => /style="color:#000;font-weight:400"/.test(cell[0])));
  verifySolutionEquations(item.solution);
  assert.doesNotMatch(plain(item.solution), /√|제곱근|순열|조합/);
  if (level === 1 && pool === 0) {
    assert.deepEqual(computed.facts, source.facts, "Exact independently read original conditions, not producer pools");
    assert.equal(computed.answer, source.answer);
  }
  return computed;
}

function changeVisibleNumber(markup) {
  const parts = markup.split(/(<[^>]*>)/g);
  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i].startsWith("<") || !/\d/.test(parts[i])) continue;
    parts[i] = parts[i].replace(/\d+(?:\.\d+)?/, text => finite(add(decimal(text), decimal("0.01"))));
    return parts.join("");
  }
  assert.fail("Expected a visible printed numeric condition to mutate");
}

function main() {
  check("Twelve independently read originals and rounding boundaries", sourceSelfChecks);
  const modulePath = path.join(__dirname, "source-6-2-decimal-e4.js");
  if (!fs.existsSync(modulePath)) {
    failures.push("Current E4 module is not present; public approval is blocked, and no unlocked candidate clone is inspected.");
    return;
  }
  const context = vm.createContext({ window: {} });
  for (const name of ["source-inventory-grade6.js", "curriculum.js", "generators.js"]) vm.runInContext(readFile(name), context, { filename: name });
  const catalog = context.window.HSE_SOURCE_INVENTORY_GRADE6, curriculum = context.window.HSE_CURRICULUM;
  const catalogBefore = JSON.stringify(catalog), curriculumBefore = JSON.stringify(curriculum);
  freeze(catalog); freeze(curriculum);
  vm.runInContext(readFile("source-6-2-decimal-e4.js"), context, { filename: "source-6-2-decimal-e4.js" });
  const api = context.window.HSE_GENERATORS;
  const types = curriculum.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)));
  const raw = JSON.parse(readFile("source-inventory/6-2-source-items.json")).items;
  const index = readFile("index.html");
  const reviews = ["exploration", "examples", "missions"].map(group => JSON.parse(readFile(`source-inventory/6-2-u2-e4-${group}-source-review.json`)));
  const seen = new Set();
  check("Eleven module registrations, twelve catalog entries, browser loading order", () => {
    const exported = context.window.HSE_SOURCE_GRADE6_DECIMAL_E4;
    assert(exported?.registrationOnly);
    assert.equal(exported.publisherAnswerVerified, false);
    assert.equal(exported.definitions.length, 11);
    assert.deepEqual(JSON.parse(JSON.stringify(exported.sourceItemIds)), sources.map(idFor));
    assert(exported.excludedSourceItems.some(item => item.sourceItemId === "6-2-u2-e4-example-4"));
    assert.equal(api.names.filter(name => /^sourceGrade6DecimalE4/.test(name)).length, 11);
    for (const source of sources) assert.equal(api.names.filter(name => name === keyFor(source)).length, 1);
    const e4 = types.filter(type => /^6-2-u2-e4-/.test(type.sourceItemId));
    assert.equal(e4.length, 12);
    assert.equal(e4.filter(type => !type.reviewLocked).length, 11);
    const generatorsAt = index.search(/src="(?:\.\/)?generators\.js(?:\?[^"\s]*)?"/);
    const moduleAt = index.search(/src="(?:\.\/)?source-6-2-decimal-e4\.js(?:\?[^"\s]*)?"/);
    const appAt = index.search(/src="(?:\.\/)?app\.js(?:\?[^"\s]*)?"/);
    assert(generatorsAt >= 0 && moduleAt > generatorsAt && appAt > moduleAt);
  });
  check("Publisher uncertainty and original handwriting records stay separate", () => {
    for (const review of reviews) {
      assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
      assert.equal(review.sourceIdentity.handwrittenMarksExcluded, true);
      assert.equal(review.sourceIdentity.sha256.toUpperCase(), "69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE");
      assert.notEqual(review.verification?.publisherAnswerVerified, true);
      const entries = review.sourceItems || review.examples || review.missions;
      for (const entry of entries) {
        const original = originals.find(source => idFor(source) === entry.sourceItemId);
        assert(original);
        assert.equal(entry.independentAnswer, original.answer);
        assert.equal(entry.releaseStatus, original.locked ? "locked" : "verified-finite-pools");
      }
    }
    const ex2 = raw.find(entry => entry.sourceItemId === "6-2-u2-e4-example-2");
    assert.equal(ex2.answerEvidence.handwrittenAnswerVerified, false);
    assert.match(ex2.answerEvidence.handwritingReading, /0\.07/);
    assert.match(ex2.answerEvidence.handwritingReading, /0\.007/);
    assert.match(ex2.answerEvidence.handwritingReading, /미확정|확정 불가|불확실/);
    const ex1 = raw.find(entry => entry.sourceItemId === "6-2-u2-e4-example-1");
    assert.equal(ex1.answerEvidence.handwrittenAnswerVerified, false);
    const exploration2 = raw.find(entry => entry.sourceItemId === "6-2-u2-e4-exploration-2");
    assert.equal(exploration2.answerEvidence.handwritingReading, null);
    assert.equal(exploration2.answerEvidence.handwrittenAnswerVerified, false);
    const m2 = raw.find(entry => entry.sourceItemId === "6-2-u2-e4-mission-2");
    assert.equal(m2.answerEvidence.handwrittenAnswerVerified, false);
    assert.match(m2.answerEvidence.handwritingReading, /0\.822/);
    assert.match(m2.answerEvidence.handwritingReading, /1\.192/);
    assert.doesNotMatch(m2.answerEvidence.handwritingReading, /1\.192[^;]*취소|1\.192[^;]*지워/);
  });
  check("Independent verifier rejects wrong equations and hidden answer markup", () => {
    verifySolutionEquations('<span class="math-inline-expression">(1.2+0.3)×2=3</span>');
    assert.throws(() => verifySolutionEquations('<span class="math-inline-expression">1+1=3</span>'));
    assert.throws(() => noAnswerLeak('<span data-phase="answer">0.822</span>'));
  });
  check("Example-4 remains locked despite the independently unique 0.0135", () => {
    const type = types.find(entry => entry.sourceItemId === "6-2-u2-e4-example-4");
    const record = raw.find(entry => entry.sourceItemId === type?.sourceItemId);
    assert(type?.reviewLocked);
    assert.equal(type.generatorKey, "");
    assert.equal(api.generatorKey(type), "");
    for (const offset of [-1, 0, 1]) for (const pool of [0, 1, 2]) assert.equal(api.generate(type, 0, offset, 1, pool), null);
    assert.equal(record.independentAnswer, "0.0135");
    assert.equal(record.answerEvidence.handwritingReading, "0.16");
    assert.equal(record.answerEvidence.handwrittenAnswerVerified, false);
    assert.equal(record.answerEvidence.officialAnswerVerified, false);
    assert.match(record.implementationStatus, /conflict-locked/);
    assert(!api.names.includes("sourceGrade6DecimalE4Example4"));
  });
  for (const source of sources) {
    const id = idFor(source), type = types.find(entry => entry.sourceItemId === id), record = raw.find(entry => entry.sourceItemId === id);
    check(`${id}: actual public catalog and original record`, () => {
      assert(type && record);
      assert.equal(type.reviewLocked, false);
      assert.equal(type.generatorKey, keyFor(source));
      assert.equal(type.verifiedVariantCount, 3);
      assert.equal(type.problemVisualRequired, false, "No invented source diagram requirement");
      assert.equal(api.generatorKey(type), keyFor(source));
      assert.equal(record.sourceVerified, true);
      assert.equal(record.pdfPage, source.suffix.startsWith("mission-") ? 23 : 22);
      assert.equal(record.printedPage, source.suffix.startsWith("mission-") ? 25 : 24);
      assert.equal(record.independentAnswer, source.answer);
      assert.equal(record.answerEvidence.officialAnswerVerified, false);
      if (source.suffix === "exploration-2") {
        assert.match(type.name, /가장 작은 나머지/);
        assert.doesNotMatch(type.name, /반올림/);
      }
      if (["example-3", "mission-3", "mission-5"].includes(source.suffix)) assert.match(type.name, /나머지/);
      if (source.suffix === "mission-6") assert.match(type.name, /셋째 자리.*반올림.*원래 수/);
    });
    if (!type) continue;
    const levelRows = [];
    for (const pool of [0, 1, 2]) {
      const branches = new Set(), prompts = new Set(), steps = [];
      for (const level of [0, 1, 2]) check(`${id}: pool ${pool} level ${level}`, () => {
        const item = api.generate(type, 0, level - 1, 1, pool);
        const computed = verify(source, item, level, pool);
        const signature = `${id}:${plain(item.prompt)}`;
        assert(!seen.has(signature), "Repeated prompts do not count as distinct conditions");
        seen.add(signature); counts.distinctCases += 1;
        if (pool === 0 && level === 1) counts.originalChecks += 1;
        counts.mission6Enumerations += computed.enumerated;
        branches.add(computed.branch); prompts.add(plain(item.prompt)); steps.push(item.reasoningSteps);
        const cyclic = api.generate(type, 0, level - 1, 1, pool + 3);
        verify(source, cyclic, level, pool);
        for (const field of ["prompt", "answer", "solution", "answerVisual"]) assert.equal(cyclic[field], item[field]);
        counts.moduloChecks += 1;
        const highest = Number.MAX_SAFE_INTEGER - ((Number.MAX_SAFE_INTEGER % 3 - pool + 3) % 3);
        assert.equal(Number(BigInt(highest) % 3n), pool);
        const boundary = api.generate(type, 0, level - 1, 1, highest);
        verify(source, boundary, level, pool);
        for (const field of ["prompt", "answer", "solution", "answerVisual"]) assert.equal(boundary[field], item[field]);
        counts.maxSafeModuloChecks += 1;
        assert.throws(() => verify(source, { ...item, answer: "999999" }, level, pool));
        assert.throws(() => verify(source, { ...item, prompt: "" }, level, pool));
        assert(item.prompt.includes(computed.required), "A real essential visible condition, not a metadata field");
        assert.throws(() => verify(source, { ...item, prompt: item.prompt.replace(computed.required, "") }, level, pool));
        assert.throws(() => verify(source, { ...item, prompt: changeVisibleNumber(item.prompt) }, level, pool));
        assert.throws(() => verify(source, { ...item, prompt: `${item.prompt}<span hidden data-answer="${item.answer}">${item.answer}</span>` }, level, pool));
        counts.negativeChecks += 5;
        levelRows.push({ pool, level, answer: computed.answer, reasoning: computed.branch });
      });
      check(`${id}: pool ${pool} structurally different difficulties`, () => {
        assert.equal(branches.size, 3);
        assert.equal(prompts.size, 3);
        assert.equal(steps.length, 3);
        assert(steps.every(Number.isInteger));
        assert(steps[0] < steps[1] && steps[1] < steps[2]);
      });
    }
    check(`${id}: lock precedence`, () => {
      const forced = { ...type, reviewLocked: true };
      assert.equal(api.generatorKey(forced), "");
      assert.equal(api.generate(forced, 0, 0, 1, 0), null);
      assert.equal(api.generate(forced, 0, Infinity, 1, NaN), null);
      counts.forcedLockedChecks += 1;
    });
    for (const offset of [-2, 2, 0.5, "0", NaN, Infinity]) check(`${id}: reject difficulty ${typeof offset}:${String(offset)}`, () => {
      assert.throws(() => api.generate(type, 0, offset, 1, 0)); counts.invalidInputs += 1;
    });
    for (const variant of [-1, 0.5, "1", NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) check(`${id}: reject variant ${String(variant)}`, () => {
      assert.throws(() => api.generate(type, 0, 0, 1, variant)); counts.invalidInputs += 1;
    });
    summaries.push({ id, cases: levelRows });
  }
  check("Final exact counts", () => {
    assert.equal(counts.sourceFactChecks, 12);
    assert.equal(counts.distinctCases, 99);
    assert.equal(counts.originalChecks, 11);
    assert.equal(counts.moduloChecks, 99);
    assert.equal(counts.maxSafeModuloChecks, 99);
    assert.equal(counts.negativeChecks, 495);
    assert.equal(counts.invalidInputs, 132);
    assert.equal(counts.forcedLockedChecks, 11);
    assert.equal(counts.mission6Enumerations, 9000);
  });
  check("No catalog mutation or current input file change", () => {
    assert.equal(JSON.stringify(catalog), catalogBefore);
    assert.equal(JSON.stringify(curriculum), curriculumBefore);
    for (const [name, hash] of snapshots) {
      assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, name))).digest("hex"), hash, `Current input changed while auditing: ${name}`);
    }
  });
}

main();
console.log(JSON.stringify({ scope: "E4 only: current module and catalog; prompt-driven exact arithmetic; not publisher/browser/deployment verification", counts,
  sourceFacts: originals.map(source => ({ id: idFor(source), independentAnswer: source.answer, handwriting: source.handwriting, agreement: source.agreement, requiredLock: Boolean(source.locked) })), summaries }, null, 2));
if (failures.length) {
  console.error(`E4 RELEASE AUDIT FAILED: ${failures.length} checks\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("E4 RELEASE AUDIT PASS: 99 current public conditions, 11 original cases, and the locked example-4 independently checked.");
  console.log("No publisher key, handwriting certainty, browser/PDF or deployment claim. No runtime file writes.");
}
