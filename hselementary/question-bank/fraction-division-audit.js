"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-1").units.find(item => item.id === "6-1-u1");
const types = unit.subunits.flatMap(subunit => subunit.types);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => {
  const divisor = gcd(n, d);
  n /= divisor;
  d /= divisor;
  return d === 1 ? String(n) : `${n}/${d}`;
};
const mixed = (n, d) => {
  const divisor = gcd(n, d);
  n /= divisor;
  d /= divisor;
  const whole = Math.floor(n / d);
  const remainder = n % d;
  if (!remainder) return String(whole);
  return whole ? `${whole} ${remainder}/${d}` : `${remainder}/${d}`;
};
const timeText = seconds => `${Math.floor(seconds / 60)}분${seconds % 60 ? ` ${seconds % 60}초` : ""}`;
const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`data-${name} 없음`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").map(Number);

function expected(generated) {
  const kind = attr(generated.prompt, "fraction-division-kind");
  const v = values(generated.prompt);
  if (kind === "max-natural-numerator") {
    const candidates = Array.from({ length: v[1] - 1 }, (_, index) => index + 1).filter(numerator => ((v[0] * v[1] + numerator) * v[2]) % (v[1] * v[3]) === 0);
    if (!candidates.length) throw new Error("자연수 조건 후보 없음");
    return Math.max(...candidates);
  }
  if (kind === "box-item-mass") return mixed((v[5] - v[1] * v[4]) / (v[1] * v[2]), v[0]);
  if (kind === "sequence-over-threshold") {
    let count = 0;
    for (let n = 1; n < v[0] * 3; n += 1) if (n * v[0] > (n + 1) * (n + 2)) count += 1;
    return count;
  }
  if (kind === "equal-expression-order") {
    const labels = ["ㄱ", "ㄴ", "ㄷ", "ㄹ"];
    return v.slice(1).map((value, index) => ({ value, label: labels[index] })).sort((a, b) => b.value - a.value).map(item => item.label).join(", ");
  }
  if (kind === "fruit-basket") {
    const [denominator, appleCount, peachCount, removed, apple, _peach, basket, total, remaining] = v;
    const derivedApple = (total - remaining) / removed;
    const derivedPeach = (remaining - basket - (appleCount - removed) * derivedApple) / peachCount;
    if (derivedApple !== apple) throw new Error("사과 무게 역산 불일치");
    return mixed(derivedPeach, denominator);
  }
  if (kind === "work-rate") {
    const [togetherDays, doneNumerator, doneDenominator, aloneDays, _firstDays, secondDays] = v;
    const numerator = doneNumerator * aloneDays - (doneDenominator - doneNumerator) * togetherDays;
    const denominator = doneDenominator * togetherDays * aloneDays;
    const derivedSecondDays = denominator / numerator;
    if (derivedSecondDays !== secondDays) throw new Error("일률 역산 불일치");
    return secondDays;
  }
  if (kind === "split-total-difference") return mixed((v[4] - v[3]) / 2, v[0]);
  if (kind === "unit-material") return frac(v[1], v[0]);
  if (kind === "equal-triangle-area") return frac(v[0] * v[1], v[2]);
  if (kind === "three-fraction-ratio") return `${frac(v[1], v[0])}, ${frac(v[2], v[0])}, ${frac(v[3], v[0])}`;
  if (kind === "tape-relation") return mixed(v[1], v[0]);
  if (kind === "changed-fill-rate") return timeText((v[1] * v[3] - v[0] * v[2]) / (v[1] - v[0]));
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    const answer = expected(generated);
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    if (!generated.solution.includes(String(generated.answer).split(",")[0].trim())) throw new Error("풀이에 정답 근거가 없습니다.");
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`분수의 나눗셈 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`분수의 나눗셈 감사 통과: ${types.length}유형, ${count}개 생성`);
