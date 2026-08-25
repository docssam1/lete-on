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
    subunitId: subunit.id,
    subunitName: subunit.name,
  })))))
  .filter(type => type.id.startsWith("6-1-u5-"));

const attribute = (prompt, name) => prompt.match(new RegExp(`${name}="([^"]+)"`))?.[1] || "";
const decimal = (value, places = 2) => Number(Number(value).toFixed(places)).toString();

function expected(generated) {
  const kind = attribute(generated.prompt, "data-advanced-graph-kind");
  const values = attribute(generated.prompt, "data-values").split(",").map(Number);
  if (!kind || values.some(Number.isNaN)) throw new Error("검산 근거가 없음");
  const v = values;

  if (kind === "picture-missing-grades") return `${v[0]}명, ${v[4]}명`;
  if (kind === "picture-average-difference") return `${v[0]}명, ${v[3]}명`;
  if (kind === "picture-machine-average") {
    const perMachine = v.slice(0, 5).map((count, index) => v[index + 5] / count);
    return Math.max(...perMachine) - Math.min(...perMachine);
  }
  if (kind === "picture-range-average") return `차 ${Math.max(...v) - Math.min(...v)}명, 평균 ${v.reduce((sum, value) => sum + value, 0) / v.length}명`;
  if (kind === "picture-rounded-max-gap") return v[0] - v[1] + 999;
  if (kind === "picture-move-average") {
    const initial = v.slice(0, 4), changes = v.slice(4), moved = initial[1] / 10;
    const redistributed = [initial[0] + moved, initial[1] - moved * 3, initial[2] + moved, initial[3] + moved];
    return redistributed.reduce((sum, value, index) => sum + value * changes[index] / 100, 0) / 4;
  }
  if (kind === "strip-nested-percent") return v[0] * v[1] * v[2] / 10000;
  if (kind === "strip-two-groups" || kind === "strip-period-count-gap") return Math.abs(v[0] * v[2] / 100 - v[1] * v[3] / 100);
  if (kind === "strip-missing-season") return v[3];
  if (kind === "strip-domain-wrong") return v[0] * v[1] * v[2] / 10000 - v[3];
  if (kind === "strip-area-gap") {
    const percent = v[3] / v.slice(0, 4).reduce((sum, value) => sum + value, 0) * 100;
    return percent * (v[4] * v[5] - v[6] * v[7]) / 100;
  }
  if (kind === "pie-sum-difference") return v[2] - v[3];
  if (kind === "pie-two-villages") return `가 ${v[0] * v[2] / 100}마리, 나 ${v[1] * v[3] / 100}마리`;
  if (kind === "pie-combined-rate") return (v[0] * v[2] / 100 + v[1] * v[3] / 100) / (v[0] + v[1]) * 100;
  if (kind === "pie-nutrition-ceil") return Math.ceil(v[3] / (v[0] * v[1] / 100 * v[2] / 100));
  if (kind === "pie-sales-gap") return Math.abs(v[0] * v[2] / 100 - v[1] * v[3] / 100);
  if (kind === "pie-union") return v[0] * (v[1] + v[2] - v[3]) / 100;
  if (kind === "combined-approval-reasons") {
    const approveCount = v[0] * v[1] / 100, opposeCount = v[0] - approveCount;
    return approveCount * Math.max(...v.slice(2, 6)) / 100 - opposeCount * Math.max(...v.slice(6, 10)) / 100;
  }
  if (kind === "combined-gender-choice") {
    const male = v[0] * v[1] / 100, female = v[0] - male;
    const counts = [0, 1, 2].map(index => male * v[index + 2] / 100 + female * v[index + 5] / 100);
    const maximum = Math.max(...counts);
    return `${["피아노", "미술", "태권도"][counts.indexOf(maximum)]}, ${maximum}명`;
  }
  if (kind === "combined-election") {
    const totals = v.slice(0, 3), maximum = Math.max(...totals);
    return `${["가", "나", "다"][totals.indexOf(maximum)]}, ${maximum}표`;
  }
  if (kind === "combined-subcategory-total") return v[3] / (v[1] / 100) / (v[2] / 100);
  if (kind === "combined-score-average") {
    const total = v[0], scores = v.slice(1, 5), counts = v.slice(5, 9);
    return decimal(scores.reduce((sum, score, index) => sum + score * counts[index], 0) / total);
  }
  if (kind === "combined-missing-male-rate") {
    const male = v[0] * v[1] / 100, female = v[0] - male;
    return `${(v[4] - female * v[3] / 100) / male * 100}%`;
  }
  throw new Error(`알 수 없는 유형 ${kind}`);
}

function checkChartStructure(prompt) {
  const chartValues = [...prompt.matchAll(/data-(?:strip|pie)-values="([^"]+)"/g)];
  for (const match of chartValues) {
    const values = match[1].split(",").map(Number);
    const sum = values.reduce((total, value) => total + value, 0);
    if (values.some(value => !Number.isFinite(value) || value < 0)) throw new Error("그래프에 유효하지 않은 비율이 있음");
    if (Math.abs(sum - 100) > 1e-8) throw new Error(`그래프 비율 합이 100이 아님: ${sum}`);
  }
  if (prompt.includes("strip-chart") && !prompt.includes("grid-line")) throw new Error("띠그래프 눈금선이 없음");
  if (prompt.includes("strip-chart") && !prompt.includes(">100<")) throw new Error("띠그래프 100 눈금이 없음");
}

const failures = [];
const answerSets = new Map(types.map(type => [type.id, new Set()]));
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 750; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const answer = expected(generated);
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    checkChartStructure(generated.prompt);
    if (difficulty === 0 && seed <= 150) answerSets.get(type.id).add(String(generated.answer));
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

for (const type of types) {
  const diversity = answerSets.get(type.id).size;
  if (diversity < 4) failures.push(`${type.id}: 150개 표본의 정답 종류가 ${diversity}개뿐임`);
}

if (types.length !== 24) failures.push(`여러 가지 그래프 유형 수가 24가 아님: ${types.length}`);
if (failures.length) {
  console.error(`여러 가지 그래프 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 160).join("\n"));
  process.exit(1);
}
console.log(`여러 가지 그래프 감사 통과: ${types.length}유형, ${count}개 생성`);
