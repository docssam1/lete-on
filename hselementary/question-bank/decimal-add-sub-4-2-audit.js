"use strict";

// Independent source-structure, answer, and uniqueness audit for 4-2 unit 3.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "4-2").units.find(item => item.id === "4-2-u3");
const types = unit.subunits.flatMap(subunit => subunit.types).filter(type => !type.reviewLocked);
const failures = [];
const seenKinds = new Set();
const check = (condition, message) => { if (!condition) failures.push(message); };
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const decimal = (scaled, places) => (scaled / 10 ** places).toFixed(places);
const plainDecimal = (scaled, places) => String(Number(decimal(scaled, places)));
const labels = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"];
const permutations = values => {
  const output = [];
  const visit = (remaining, chosen) => {
    if (!remaining.length) output.push(Number(chosen.join("")));
    remaining.forEach((value, index) => visit([...remaining.slice(0, index), ...remaining.slice(index + 1)], [...chosen, value]));
  };
  visit(values, []);
  return [...new Set(output)];
};

check(plainDecimal(7143 - 50, 1) === "709.3", "개념탐구 1 원문 답은 709.3kg이어야 합니다.");
let tenfoldWeightCaseCount = 0;
for (let fatherWeightGrams = 45000; fatherWeightGrams <= 85000; fatherWeightGrams += 10) {
  for (const bonusGrams of [20, 30, 50, 70, 80]) {
    const objectWeightGrams = fatherWeightGrams / 10 + bonusGrams;
    check(Number.isInteger(objectWeightGrams), `물건 무게가 정수 g가 아닙니다: ${fatherWeightGrams}, ${bonusGrams}`);
    check(Number(plainDecimal(objectWeightGrams - bonusGrams, 1)) === fatherWeightGrams / 100, `10배 몸무게 역산이 다릅니다: ${fatherWeightGrams}, ${bonusGrams}`);
    tenfoldWeightCaseCount += 1;
  }
}

const answerFor = (kind, values) => {
  if (kind === "nearest-order") {
    const [target, ...items] = values;
    return items.map((value, index) => ({ label: labels[index], distance: Math.abs(value - target) })).sort((a, b) => a.distance - b.distance).map(item => item.label).join(", ");
  }
  if (kind === "marked-line-sum") return decimal(values[0] * 2 + values[1] * (values[2] + values[3]), 3);
  if (kind === "ordered-missing-digits") return "36";
  if (kind === "equal-picture-gaps") return decimal((values[0] - values[1] * values[2]) / (values[1] + 1), 2);
  if (kind === "candle-remaining-time") {
    const [initial, remaining, elapsed] = values;
    const minutes = remaining / ((initial - remaining) / elapsed);
    return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
  }
  if (kind === "opposite-walk-distance") return plainDecimal(values[0] * 1000 * Math.abs(values[1] - values[2]), 6);
  if (kind === "tenfold-weight-reverse") return plainDecimal(values[0] - values[1], 1);
  if (kind === "overlap-segment") return decimal(values[0] + values[1] - values[2], 3);
  if (kind === "calculation-order") return values.map((row, index) => ({ label: labels[index], value: row.reduce((sum, value) => sum + value, 0) })).sort((a, b) => b.value - a.value).map(item => item.label).join(", ");
  if (kind === "decimal-symbol-operation") return decimal(2 * (2 * values[0] - values[1]) - values[2], 2);
  if (kind === "four-person-distance") return decimal(Math.abs(Math.abs(values[0] - values[1]) - Math.abs(values[2] - values[0])), 2);
  if (kind === "common-hundredths") {
    let count = 0;
    for (let value = 0; value < 1000; value += 1) if (values[0] < value && value < values[1] && values[2] < value && value < values[3]) count += 1;
    return String(count);
  }
  if (kind === "venn-circle-sum") return decimal(values[0] - values[1] - values[2] - values[3], 2);
  if (kind === "decimal-sequence") return plainDecimal(values[0] + values[1] * values[2], 2);
  if (kind === "missing-decimal-point") return decimal(values[values[0] + 1], 2);
  if (kind === "repeated-decimal") return plainDecimal(values[2] / values[0] * values[1] - values[3], 2);
  if (kind === "sum-difference-hundredfold") return plainDecimal((values[0] + values[1]) / 2 * 100, 2);
  if (kind === "pairwise-decimal-sums") return decimal((values[0] + values[1] + values[2]) / 2 - Math.min(...values), 2);
  if (kind === "different-walking-rates") return plainDecimal(Math.abs(values[0] * values[2] * 2 - values[1] * values[2]), 3);
  if (kind === "reversed-place-value") {
    const matches = [];
    for (let value = 102; value <= 987; value += 1) {
      const digits = String(value).padStart(3, "0").split("").map(Number);
      if (digits[0] === 0 || new Set(digits).size !== 3) continue;
      const reversed = digits[2] * 100 + digits[1] * 10 + digits[0];
      if (value * 100 - reversed * 10 === values[0]) matches.push(reversed);
    }
    check(matches.length === 1, `자리값 역산 정답이 ${matches.length}개입니다: ${values}`);
    return String(matches[0]);
  }
  if (kind === "tail-digit-sum-count") {
    let count = 0;
    for (let value = values[0] + 1; value < values[1]; value += 1) if (Math.floor(value / 10) % 10 + value % 10 === values[2]) count += 1;
    return String(count);
  }
  if (kind === "tenths-greater-count") {
    let count = 0;
    for (let value = values[0] + 1; value < values[1]; value += 1) if (Math.floor(value / 100) % 10 > Math.floor(value / 10) % 10) count += 1;
    return String(count);
  }
  if (kind === "digit-ratio-count") {
    let count = 0;
    for (let value = values[0] + 1; value < values[1]; value += 1) {
      const digits = [Math.floor(value / 1000), Math.floor(value / 100) % 10, Math.floor(value / 10) % 10, value % 10];
      if (digits[1] === digits[2] * 2 && new Set(digits).size === 4) count += 1;
    }
    return String(count);
  }
  if (kind === "decimal-card-order") {
    const ordered = permutations(values).filter(value => value >= 1000).sort((a, b) => a - b);
    return decimal(ordered[ordered.length - 1] - ordered[3], 3);
  }
  if (kind === "swapped-tail-range") {
    const candidates = [];
    for (let value = values[0] + 1; value < 1000; value += 1) {
      const tenths = Math.floor(value / 100) % 10;
      const hundredths = Math.floor(value / 10) % 10;
      const thousandths = value % 10;
      const swapped = tenths * 100 + thousandths * 10 + hundredths;
      if (swapped < values[1] && swapped - value === values[2]) candidates.push(value);
    }
    check(candidates.length > 0, `교환 자리 후보가 없습니다: ${values}`);
    return decimal(Math.max(...candidates) - Math.min(...candidates), 3);
  }
  return null;
};

let generatedCount = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 400; seed += 1) {
  const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`;
  let generated;
  try {
    generated = api.generate(type, 0, difficulty, seed, type.variant);
  } catch (error) {
    failures.push(`${context}: ${error.message}`);
    continue;
  }
  check(Boolean(generated?.prompt && generated.answer !== undefined && generated.solution), `${context}: 문제·정답·풀이가 비어 있습니다.`);
  check(!/NaN|undefined|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 깨진 계산값이 있습니다.`);
  const tag = generated.prompt.match(/<span hidden data-decimal42-kind="[^"]+"[^>]*>/)?.[0];
  check(Boolean(tag), `${context}: 독립 검산 데이터가 없습니다.`);
  if (!tag) continue;
  const kind = attribute(tag, "data-decimal42-kind");
  const values = JSON.parse(decodeURIComponent(attribute(tag, "data-decimal42-values")));
  const declared = decodeURIComponent(attribute(tag, "data-decimal42-expected"));
  const independent = answerFor(kind, values);
  seenKinds.add(kind);
  check(independent !== null, `${context}: 알 수 없는 검산 유형 ${kind}입니다.`);
  check(String(independent) === declared, `${context}: 선언 정답 ${declared}과 독립 계산 ${independent}이 다릅니다.`);
  check(String(generated.answer) === declared, `${context}: 표시 정답 ${generated.answer}과 선언 정답 ${declared}이 다릅니다.`);
  if (/line|segment|venn/.test(kind)) check(/<svg\b/.test(generated.prompt), `${context}: 그림 정보가 필요한데 SVG가 없습니다.`);
  generatedCount += 1;
}

check(types.length === 25, `공개 세부 유형 수가 25개가 아닙니다: ${types.length}`);
check(seenKinds.size === 25, `검산 구조 수가 25개가 아닙니다: ${seenKinds.size}`);
if (failures.length) {
  console.error(`4-2 소수 단원 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`4-2 소수 원문 감사 통과: ${types.length}유형, ${generatedCount}개 생성, 검산 구조 ${seenKinds.size}종, 몸무게 역산 ${tenfoldWeightCaseCount.toLocaleString()}조합`);
