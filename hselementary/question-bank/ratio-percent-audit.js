global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types.map(type => ({
    ...type,
    semesterId: semester.id,
    unitId: unit.id,
    unitName: unit.name,
  })))))
  .filter(type => type.id.startsWith("6-1-u4-"));

const decimal = (value, places = 3) => Number(Number(value).toFixed(places));
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const ratioText = (a, b) => {
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
};
const attribute = (prompt, name) => prompt.match(new RegExp(`${name}="([^"]+)"`))?.[1] || "";

function expected(generated) {
  const kind = attribute(generated.prompt, "data-ratio-kind");
  const v = attribute(generated.prompt, "data-values").split(",").map(Number);
  if (!kind || v.some(Number.isNaN)) throw new Error("검산 근거가 없음");

  if (kind === "rectangle-ratio-area") {
    const unit = v[2] / 2 / (v[0] + v[1]);
    return v[0] * v[1] * unit * unit;
  }
  if (kind === "difference-ratio-value") return v[0] * v[2] / (v[1] - v[0]);
  if (kind === "trapezoid-base-ratio") return ratioText(v[0], v[1]);
  if (kind === "transfer-to-ratio") return (v[3] * v[0] - v[2] * v[1]) / (v[2] + v[3]);
  if (kind === "chained-ratios") return decimal(v[0] * v[2] / (v[1] * v[3]), 3);
  if (kind === "overlapping-groups-ratio") {
    const unit = (v[0] - v[1]) / (v[2] + v[3]);
    return ratioText(v[2] * unit + v[1], v[3] * unit + v[1]);
  }
  if (kind === "coefficient-percent") return decimal(v[0] / v[1] * 100, 1);
  if (kind === "price-rise-comparison") {
    const first = (v[1] - v[0]) / v[0] * 100, second = (v[3] - v[2]) / v[2] * 100;
    return `${first > second ? "가" : "나"}, ${Math.abs(first - second)}%p`;
  }
  if (kind === "forecast-accuracy") return decimal((v[0] * v[1] / 100 + v[2] * v[3] / 100) / (v[0] + v[2]) * 100, 1);
  if (kind === "group-selection-percent") {
    const female = v[0] * v[1] / 100, male = v[0] - female;
    return male * v[2] / 100 + female * v[3] / 100;
  }
  if (kind === "bonus-discount-difference") return Math.abs((v[1] - v[2]) * v[0] - v[1] * v[0] * (100 - v[3]) / 100);
  if (kind === "nested-population-percent") return v[0] * v[1] / 100 * v[2] / 100 * v[3] / 100;
  if (kind === "reverse-pass-rate") return Math.round(v[2] / (v[1] / 100) * v[0]);
  if (kind === "vote-share") return decimal(((v[0] - v[1] + v[2]) / 2) / v[0] * 100, 1);
  if (kind === "city-density") {
    const densities = [v[3] / v[0], v[4] / v[1], v[5] / v[2]];
    const maximum = Math.max(...densities), minimum = Math.min(...densities);
    return `${["가", "나", "다"][densities.indexOf(maximum)]}, ${maximum - minimum}명/km²`;
  }
  if (kind === "defect-rate-limit") return Math.ceil(v[1] * v[2] / v[0]) - 1;
  if (kind === "monthly-interest-rates") return `${v[2] / v[0] / v[1] * 100}%, ${v[5] / v[3] / v[4] * 100}%`;
  if (kind === "engel-households") return v[2] * (v[1] / v[0]) * v[4] / v[5];
  if (kind === "discount-order") {
    const labels = ["ㄱ", "ㄴ", "ㄷ", "ㄹ"];
    return labels.map((label, index) => ({ label, discount: (v[index] - v[index + 4]) / v[index] })).sort((a, b) => b.discount - a.discount).map(item => item.label).join(", ");
  }
  if (kind === "bonus-vs-discount-rate") {
    const bonus = v[1] * 3 / 4 * v[0], discounted = v[1] * v[0] * (100 - v[2]) / 100;
    return decimal((discounted - bonus) / discounted * 100, 1);
  }
  if (kind === "tiered-sale-profit") {
    const regular = v[1] * (100 + v[2]) / 100;
    const last = v[0] - v[3] - v[4];
    return v[3] * regular + v[4] * regular * 0.8 + last * regular * 0.5 - v[0] * v[1];
  }
  if (kind === "mixed-concentration") return decimal((v[0] * v[1] + v[2] * v[3]) / (v[0] + v[2]), 1);
  if (kind === "remaining-solute") {
    const total = v[0] + v[2], solute = (v[0] * v[1] + v[2] * v[3]) / 100;
    return decimal(solute * (total - v[4]) / total, 2);
  }
  if (kind === "remove-refill-concentration") return decimal(v[1] * (v[0] - v[2]) / v[0], 2);
  if (kind === "sequential-consumption") {
    const coefficient = (100 - v[0]) / 100 * (v[2] - v[1]) / v[2] - v[4] / 100;
    return decimal((v[3] / 100) / coefficient, 4);
  }
  if (kind === "changed-rectangle-ratio") return ratioText(v[0] * (100 - v[2]) / 100, v[3]);
  if (kind === "trapezoid-midline-from-area-ratio") {
    const bottom = v[0] * (3 * v[2] - v[1]) / (3 * v[1] - v[2]);
    return (v[0] + bottom) / 2;
  }
  if (kind === "special-point-days") return v[2] / (v[0] * v[1] / 100) - v[3];
  if (kind === "chained-money-ratio") return ratioText(v[1] * 100, v[2] * v[0]);
  if (kind === "oil-can-weight") {
    const firstFraction = v[1] / v[2], secondFraction = v[4] / v[5];
    const fullOil = (v[0] - v[3]) / (firstFraction - secondFraction);
    const can = v[0] - fullOil * firstFraction;
    return Math.round((can + fullOil - v[6] * v[7]) / 10);
  }
  if (kind === "target-mixture-mass") return v[1] * (v[3] - v[0]) / (v[2] - v[3]);
  if (kind === "evaporated-water") return v[0] - v[0] * v[1] / v[2];
  if (kind === "salt-and-water-addition") return (v[0] * v[1] / 100 + v[2]) * 100 / v[3] - v[0] - v[2];
  if (kind === "markup-discount-profit-rate") return decimal((v[0] * (100 + v[1]) / 100 - v[2] - v[0]) / v[0] * 100, 1);
  if (kind === "two-item-regular-price") {
    const shoe = (v[3] * (100 - v[1]) - v[2] * 100) / (v[0] - v[1]);
    return v[3] - shoe;
  }
  if (kind === "mixed-sale-count") {
    const regular = v[0] * (100 + v[1]) / 100, discounted = regular * (100 - v[2]) / 100;
    return v[3] + (v[4] - v[3] * (regular - v[0])) / (discounted - v[0]);
  }
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const answer = expected(generated);
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    if (typeof generated.answer === "number" && (!Number.isFinite(generated.answer) || generated.answer < 0)) throw new Error("유효하지 않은 수치 정답");
    const solution = generated.solution.replace(/,(?=\d{3}(?:\D|$))/g, "");
    const token = String(generated.answer).split(/,\s+/)[0].replace(/,(?=\d{3}(?:\D|$))/g, "");
    if (!solution.includes(token)) throw new Error("풀이에 정답 근거가 없음");
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`비와 비율 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  process.exit(1);
}
console.log(`비와 비율 감사 통과: ${types.length}유형, ${count}개 생성`);
