"use strict";

// Independent source-structure and answer audit for 4-2 unit 1.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "4-2").units.find(item => item.id === "4-2-u1");
const types = unit.subunits.flatMap(subunit => subunit.types);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const mixed = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (!remainder) return String(whole);
  if (!whole) return `${remainder}/${denominator}`;
  return `${whole} ${remainder}/${denominator}`;
};
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const evidenceAnswer = (kind, values) => {
  if (kind === "age-ratio") {
    const unitValue = values[2] / (values[0] + values[1]);
    return `${values[1] * unitValue}살, ${values[0] * unitValue}살`;
  }
  if (kind === "bead-ratio") return String(values[3] / (values[0] + values[1] + values[2]) * values[1]);
  if (kind === "reverse-spending") return String(values[6] * 4 / 3 * 3 / 2 * 2);
  if (kind === "two-part-length") return String(values[2] / (values[0] + values[1]) * values[1]);
  if (kind === "bottle-weight") return String(values[4] / (1 + values[0] / values[1] * values[2] / values[3]));
  if (kind === "age-difference") return String(values[2] / (values[1] - values[0]) * (values[0] + values[1]));
  if (kind === "card-fractions") {
    let count = 0;
    values.forEach(numerator => values.forEach(denominator => {
      if (numerator < denominator && numerator * 2 > denominator) count += 1;
    }));
    return String(count);
  }
  if (kind === "largest-mixed-card") {
    let best = null;
    values.forEach(whole => values.forEach(numerator => values.forEach(denominator => {
      if (new Set([whole, numerator, denominator]).size !== 3 || numerator >= denominator) return;
      const value = whole + numerator / denominator;
      if (!best || value > best.value) best = { whole, numerator, denominator, value };
    })));
    return mixed(best.whole * best.denominator + best.numerator, best.denominator);
  }
  if (kind === "quotient-remainder-count") return String(values[2] - values[1]);
  if (kind === "mixed-between") return String(values[3] - values[2]);
  if (kind === "three-related-fractions") {
    const [denominator, up, down, sum] = values;
    const middle = (sum - up + down) / 3;
    return `${middle + up}/${denominator}, ${middle}/${denominator}, ${middle - down}/${denominator}`;
  }
  if (kind === "conditioned-improper-count") {
    const [denominator, remainder, maxQuotient] = values;
    let count = 0;
    for (let numerator = 10; numerator < denominator * (maxQuotient + 1); numerator += 1) {
      if (numerator > denominator && Math.floor(numerator / denominator) <= maxQuotient && numerator % denominator === remainder && gcd(numerator, denominator) === 1) count += 1;
    }
    return String(count);
  }
  if (kind === "expression-order") {
    const labels = ["㉠", "㉡", "㉢", "㉣"];
    return values.slice(2).map((value, index) => ({ value, label: labels[index] })).sort((a, b) => a.value - b.value).map(item => item.label).join(", ");
  }
  if (kind === "time-sum-difference") {
    const [denominator, total, difference] = values;
    return `${mixed((total + difference) / 2, denominator)}시간, ${mixed((total - difference) / 2, denominator)}시간`;
  }
  if (kind === "route-total") return mixed(values[1] + values[2] + values[3], values[0]);
  if (kind === "day-night") {
    const day = (1440 - values[0]) / 2;
    const night = day + values[0];
    return `${Math.floor(day / 60)}시간 ${day % 60}분, ${Math.floor(night / 60)}시간 ${night % 60}분`;
  }
  if (kind === "clock-end") {
    const end = values[0] + values[1] * 60 / values[2];
    return `${Math.floor(end / 60)}시 ${end % 60}분`;
  }
  if (kind === "symbol-operation") return mixed(values[1] + values[2] + values[3] - 2 * values[4], values[0]);
  if (kind === "overlap-tape") return mixed(values[1] * values[2] - (values[1] - 1) * values[3], values[0]);
  if (kind === "salt-water") return mixed(values[1] * (values[0] - values[2]), values[0] * values[0]);
  if (kind === "wheel-distance") return mixed(Math.abs(values[1] * values[2] - values[3] * values[4]), values[0]);
  if (kind === "two-fraction-numerators") return `${(values[1] + values[2]) / 2}/${values[0]}, ${(values[1] - values[2]) / 2}/${values[0]}`;
  if (kind === "clock-difference") return String(values[1] * (values[2] + values[3]) / values[0]);
  if (kind === "fraction-sequence-sum") return mixed(values[1] * (values[1] + 1) / 2 * values[0] + values[1] * values[2], values[0]);
  if (kind === "fraction-inequality") return String(Array.from({ length: values[3] * values[0] }, (_, index) => index + 1).filter(value => values[2] * values[0] < value + values[1] && value + values[1] < values[3] * values[0]).length);
  if (kind === "arithmetic-fraction-sequence") return mixed(values[1] + values[2] * values[3], values[0]);
  if (kind === "card-fraction-sums") {
    const cards = values.slice(0, values.indexOf(-1));
    const sums = new Set();
    cards.forEach(a => cards.forEach(b => cards.forEach(c => cards.forEach(d => {
      if (new Set([a, b, c, d]).size !== 4 || a >= b || c >= d) return;
      const numerator = a * d + c * b;
      const denominator = b * d;
      if (numerator <= denominator) return;
      const divisor = gcd(numerator, denominator);
      sums.add(`${numerator / divisor}/${denominator / divisor}`);
    }))));
    return String(sums.size);
  }
  if (kind === "grouped-fraction-term") {
    const [target, group, position] = values;
    check((group - 1) * group / 2 < target && target <= group * (group + 1) / 2, `묶음 위치가 잘못되었습니다: ${values}`);
    return mixed((group - position + 1) * group + position, group);
  }
  if (kind === "same-denominator-symbol") return String(values.slice(1).reduce((sum, value) => sum + value, 0) / values[0]);
  if (kind === "two-grouped-terms") return mixed(values[2] * values[5] + values[4] * values[3], values[3] * values[5]);
  if (kind === "sum-difference") return `${mixed((values[1] + values[2]) / 2, values[0])}, ${mixed((values[1] - values[2]) / 2, values[0])}`;
  if (kind === "wrong-operation") return mixed(values[2] - values[1] * 2, values[0]);
  if (kind === "pairwise-sums" || kind === "three-object-weights") {
    const [denominator, ab, bc, ac] = values;
    const a = (ab + ac - bc) / 2;
    const b = (ab + bc - ac) / 2;
    const c = (ac + bc - ab) / 2;
    const suffix = kind === "three-object-weights" ? "kg" : "";
    return `${mixed(a, denominator)}${suffix}, ${mixed(b, denominator)}${suffix}, ${mixed(c, denominator)}${suffix}`;
  }
  if (kind === "same-symbol-equation") return String((values[3] - values[2] * values[1]) / (values[2] * (values[0] - 1)));
  if (kind === "equal-number-line") return mixed(values[0] * values[3], values[1] * values[2]);
  return null;
};

const seenKinds = new Set();
let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`;
      let generated;
      try {
        generated = api.generate(type, 0, difficulty, seed, type.variant);
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
        continue;
      }
      check(Boolean(generated?.prompt && generated.answer && generated.solution), `${context}: 결과가 비어 있습니다.`);
      check(!/NaN|undefined|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 계산값이 깨졌습니다.`);
      const tag = generated.prompt.match(/<span hidden data-fraction42-kind="[^"]+"[^>]*>/)?.[0];
      check(Boolean(tag), `${context}: 독립 검산 데이터가 없습니다.`);
      if (!tag) continue;
      const kind = attribute(tag, "data-fraction42-kind");
      const values = attribute(tag, "data-fraction42-values").split(",").map(Number);
      const declared = decodeURIComponent(attribute(tag, "data-fraction42-expected"));
      const independentlyCalculated = evidenceAnswer(kind, values);
      seenKinds.add(kind);
      check(independentlyCalculated !== null, `${context}: 알 수 없는 검산 유형 ${kind}입니다.`);
      check(String(independentlyCalculated) === declared, `${context}: 내부 정답 ${declared}과 독립 계산 ${independentlyCalculated}이 다릅니다.`);
      check(String(generated.answer) === declared, `${context}: 표시 정답 ${generated.answer}과 검산 정답 ${declared}이 다릅니다.`);
      generatedCount += 1;
    }
  }
}

check(types.length === 36, `세부 유형 수가 36개가 아닙니다: ${types.length}`);
check(seenKinds.size === 36, `검산 유형 수가 36개가 아닙니다: ${seenKinds.size}`);
if (failures.length) {
  console.error(`4-2 분수 단원 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`4-2 분수 단원 감사 통과: ${types.length}유형, ${generatedCount}개 생성, 검산 구조 ${seenKinds.size}종`);
