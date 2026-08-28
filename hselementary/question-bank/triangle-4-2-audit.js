"use strict";

// Independent answer and source-publication audit for the reviewed 4-2 triangle types.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "4-2").units.find(item => item.id === "4-2-u2");
const sourceTypes = unit.subunits.flatMap(subunit => subunit.types).filter(type => type.sourceItemId?.startsWith("4-2-triangle-"));
const types = sourceTypes.filter(type => type.generatorKey && !type.reviewLocked);
const locked = sourceTypes.filter(type => type.reviewLocked);
const publicSourceIds = new Set([
  "4-2-triangle-1-mission-1",
  "4-2-triangle-4-mission-1"
]);
const failures = [];
const seenKinds = new Set();
const check = (condition, message) => { if (!condition) failures.push(message); };
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const pointKind = (first, second, third) => {
  const cross = (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  if (cross === 0) return "line";
  const squared = [[first, second], [second, third], [third, first]].map(([a, b]) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2).sort((a, b) => a - b);
  if (squared[0] + squared[1] === squared[2]) return "right";
  return squared[0] + squared[1] > squared[2] ? "acute" : "obtuse";
};
const pointCounts = (points, requiredIndex = -1) => {
  const totals = { acute: 0, right: 0, obtuse: 0 };
  for (let a = 0; a < points.length - 2; a += 1) for (let b = a + 1; b < points.length - 1; b += 1) for (let c = b + 1; c < points.length; c += 1) {
    if (requiredIndex >= 0 && ![a, b, c].includes(requiredIndex)) continue;
    const kind = pointKind(points[a], points[b], points[c]);
    if (kind !== "line") totals[kind] += 1;
  }
  return totals;
};
const answerFor = (kind, values) => {
  if (kind === "fan-count" || kind === "dot-fan-count") return String(values[0] * (values[0] + 1) / 2);
  if (kind === "lattice-count") return String(Math.floor(values[0] * (values[0] + 2) * (2 * values[0] + 1) / 8));
  if (kind === "marked-fan-count") return String(values[0]);
  if (kind === "double-fan-count") return String(values[0] * (values[0] + 1) / 2 + values[1] * (values[1] + 1) / 2);
  if (kind === "cross-rectangle-count") return String(values[0] * 8);
  if (kind === "angle-card-count") {
    const totals = { acute: 0, right: 0, obtuse: 0 };
    values.forEach(angles => {
      const largest = Math.max(...angles);
      totals[largest < 90 ? "acute" : largest === 90 ? "right" : "obtuse"] += 1;
    });
    return `${totals.acute}, ${totals.right}, ${totals.obtuse}`;
  }
  if (["star-angle-count", "grid-obtuse-count", "grid-angle-difference", "required-point-obtuse"].includes(kind)) {
    const [points, requiredIndex, mode] = values;
    const totals = pointCounts(points, requiredIndex);
    if (mode === "acute-obtuse") return `${totals.acute}, ${totals.obtuse}`;
    if (mode === "acute-obtuse-difference") return String(Math.abs(totals.acute - totals.obtuse));
    return String(totals[mode]);
  }
  if (kind === "obtuse-angle-pairs") {
    let count = 0;
    for (let first = 0; first < values.length - 1; first += 1) for (let second = first + 1; second < values.length; second += 1) if (values[first] + values[second] < 90) count += 1;
    return String(count);
  }
  if (kind === "isosceles-diamond-perimeter") return String(2 * values[0] + 2 * values[1]);
  if (kind === "isosceles-split-angle") return String(values[0] - (180 - values[0]) / 2);
  if (kind === "isosceles-chain-perimeter") return String(2 * values[1] + values[0] * values[2]);
  if (kind === "isosceles-rotation-angle") return String(values[0]);
  if (kind === "isosceles-fold-angle") return String((180 - values[0]) / 4);
  if (kind === "circle-isosceles-shapes") {
    const count = values[0];
    const signatures = new Set();
    for (let a = 0; a < count - 2; a += 1) for (let b = a + 1; b < count - 1; b += 1) for (let c = b + 1; c < count; c += 1) {
      const steps = [[a, b], [b, c], [c, a]].map(([first, second]) => Math.min(Math.abs(first - second), count - Math.abs(first - second))).sort((x, y) => x - y);
      if (steps[0] === steps[1] || steps[1] === steps[2]) signatures.add(steps.join("-"));
    }
    return String(signatures.size);
  }
  if (kind === "equilateral-chain-perimeter") return String((values[1] + 2) * values[0]);
  if (kind === "square-equilateral-angle") return String(values[0] + values[1]);
  if (kind === "overlap-equilateral-angle") return String(180 - 60 - values[0]);
  if (kind === "equilateral-right-length") return String(values[0] / 3 / 2);
  if (kind === "equilateral-chain-side") return String(values[1] / (values[0] + 2));
  if (kind === "thirty-sixty-segment") return String(values[0] * 2 - values[1]);
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
  const tag = generated.prompt.match(/<span hidden data-triangle42-kind="[^"]+"[^>]*>/)?.[0];
  check(Boolean(tag), `${context}: 독립 검산 데이터가 없습니다.`);
  if (!tag) continue;
  const kind = attribute(tag, "data-triangle42-kind");
  const values = JSON.parse(decodeURIComponent(attribute(tag, "data-triangle42-values")));
  const declared = decodeURIComponent(attribute(tag, "data-triangle42-expected"));
  const independent = answerFor(kind, values);
  seenKinds.add(kind);
  check(independent !== null, `${context}: 알 수 없는 검산 유형 ${kind}입니다.`);
  check(String(independent) === declared, `${context}: 선언 정답 ${declared}과 독립 계산 ${independent}이 다릅니다.`);
  check(String(generated.answer) === declared, `${context}: 표시 정답 ${generated.answer}과 선언 정답 ${declared}이 다릅니다.`);
  if (/count|point|circle|diamond|split|chain|angle|length|segment/.test(kind)) check(/<svg\b/.test(generated.prompt) || kind === "angle-card-count" || kind === "obtuse-angle-pairs", `${context}: 도형 정보가 필요한데 SVG가 없습니다.`);
  generatedCount += 1;
}

check(sourceTypes.length === 44, `원문 문항 연결 수가 44개가 아닙니다: ${sourceTypes.length}`);
check(types.length === 2, `원문 일치 공개 유형 수가 2개가 아닙니다: ${types.length}`);
check(locked.length === 42, `검수 대기 유형 수가 42개가 아닙니다: ${locked.length}`);
check(seenKinds.size === 2, `공개 검산 구조 수가 2개가 아닙니다: ${seenKinds.size}`);
check(types.every(type => publicSourceIds.has(type.sourceItemId)), "공개 허용 목록에 없는 삼각형 유형이 열려 있습니다.");
check([...publicSourceIds].every(sourceItemId => types.some(type => type.sourceItemId === sourceItemId)), "원문 일치 공개 유형이 빠졌습니다.");
if (failures.length) {
  console.error(`4-2 삼각형 단원 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`4-2 삼각형 원문 일치 공개 감사 통과: ${types.length}유형, 검수 대기 ${locked.length}유형, ${generatedCount}개 생성, 검산 구조 ${seenKinds.size}종`);
