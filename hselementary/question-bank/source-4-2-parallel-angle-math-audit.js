"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const dir = __dirname;
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sourceIds = [
  "4-2-u4-e2-exploration",
  "4-2-u4-e2-example-2-3",
  "4-2-u4-e2-example-2-4",
  "4-2-u4-e2-mission-1",
  "4-2-u4-e2-mission-2",
  "4-2-u4-e2-mission-3",
  "4-2-u4-e2-mission-4",
  "4-2-u4-e2-mission-5",
  "4-2-u4-e2-mission-6"
];
const context = { window: {}, console, encodeURIComponent, decodeURIComponent };
vm.createContext(context);
const load = filename => vm.runInContext(fs.readFileSync(path.join(dir, filename), "utf8"), context, { filename });

load("source-inventory-4-2-quadrilateral.js");
load("curriculum.js");
load("generators.js");
const allTypes = () => context.window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units || [])
  .flatMap(unit => unit.subunits || [])
  .flatMap(subunit => subunit.types || []);
load("source-4-2-parallel-angle.js");

const api = context.window.HSE_GENERATORS;
const moduleApi = context.window.HSE_SOURCE_42_PARALLEL_ANGLE;
const types = allTypes();
const typeFor = sourceItemId => types.find(type => type.sourceItemId === sourceItemId);
const stripHidden = markup => String(markup).replace(/<span hidden[\s\S]*?<\/span>/g, "");
const stripSvg = markup => String(markup).replace(/<svg[\s\S]*?<\/svg>/g, "");
const learnerText = markup => stripSvg(stripHidden(markup)).replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const normalizeAnswer = value => String(value).replace(/\s+/g, "");
const decodeAttr = (markup, name) => {
  const value = String(markup).match(new RegExp(`${name}="([^"]+)"`))?.[1];
  return value ? JSON.parse(decodeURIComponent(value)) : null;
};
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const angleDifference = (first, second) => {
  const raw = ((Number(second) - Number(first)) % 360 + 360) % 360;
  return Math.min(raw, 360 - raw);
};
const lineTags = markup => [...String(markup).matchAll(/<line\b[^>]*class="pa-line[^"]*"[^>]*>/g)].map(match => match[0]);
const lineFromTag = tag => ({
  name: attr(tag, "data-line-name"),
  a: [Number(attr(tag, "x1")), Number(attr(tag, "y1"))],
  b: [Number(attr(tag, "x2")), Number(attr(tag, "y2"))]
});
const lineIntersection = (first, second) => {
  const [x1, y1] = first.a;
  const [x2, y2] = first.b;
  const [x3, y3] = second.a;
  const [x4, y4] = second.b;
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < 1e-9) return null;
  return [
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator,
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator
  ];
};
const pointDistance = (first, second) => Math.hypot(first[0] - second[0], first[1] - second[1]);
const pointOnSegment = (point, segment, tolerance = 0.08) => {
  const [x1, y1] = segment.a;
  const [x2, y2] = segment.b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-9) return pointDistance(point, segment.a) <= tolerance;
  const t = ((point[0] - x1) * dx + (point[1] - y1) * dy) / lengthSquared;
  if (t < -tolerance || t > 1 + tolerance) return false;
  return pointLineDistance(point, segment.a, segment.b) <= tolerance;
};
const segmentIntersection = (first, second, tolerance = 0.08) => {
  const point = lineIntersection(first, second);
  return point && pointOnSegment(point, first, tolerance) && pointOnSegment(point, second, tolerance) ? point : null;
};
const parsedAngle = tag => {
  const point = value => String(attr(tag, value) || "").split(",").map(Number);
  return {
    role: attr(tag, "data-angle-role"),
    value: Number(attr(tag, "data-angle-value")),
    vertex: point("data-angle-vertex"),
    rayA: point("data-angle-ray-a"),
    rayB: point("data-angle-ray-b"),
    midpoint: point("data-angle-midpoint"),
    start: Number(attr(tag, "data-angle-start")),
    sweep: Number(attr(tag, "data-angle-sweep")),
    labelMode: attr(tag, "data-angle-label-mode")
  };
};
const angleFromRays = (first, second, vertex) => {
  const ax = first[0] - vertex[0];
  const ay = first[1] - vertex[1];
  const bx = second[0] - vertex[0];
  const by = second[1] - vertex[1];
  const denominator = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (denominator < 1e-9) return NaN;
  return Math.acos(Math.max(-1, Math.min(1, (ax * bx + ay * by) / denominator))) * 180 / Math.PI;
};
const lineDirection = line => Math.atan2(line.b[1] - line.a[1], line.b[0] - line.a[0]) * 180 / Math.PI;
const normalizedLineDifference = (first, second) => angleDifference(lineDirection(first), lineDirection(second));
const pointLineDistance = (position, first, second) => {
  const numerator = Math.abs((second[1] - first[1]) * position[0] - (second[0] - first[0]) * position[1] + second[0] * first[1] - second[1] * first[0]);
  return numerator / Math.hypot(second[1] - first[1], second[0] - first[0]);
};
const parallelPairs = (names, directions) => {
  const result = [];
  for (let first = 0; first < directions.length; first += 1) {
    for (let second = first + 1; second < directions.length; second += 1) {
      const delta = Math.abs((((directions[first] - directions[second]) % 180) + 180) % 180);
      if (delta < 1e-9 || Math.abs(delta - 180) < 1e-9) result.push(`${names[first]}와 ${names[second]}`);
    }
  }
  return result;
};
const integerAngles = Array.from({ length: 179 }, (_, index) => index + 1);
const uniqueNumbers = values => [...new Set(values.filter(value => Number.isInteger(value)))].sort((first, second) => first - second);
const uniqueIntegers = values => [...new Set(values.filter(value => Number.isInteger(value) && value >= 1 && value <= 179))].sort((first, second) => first - second);
const pairSumCandidates = total => {
  const pairs = [];
  integerAngles.forEach(first => integerAngles.forEach(second => {
    if (first + second === total) pairs.push([first, second]);
  }));
  return {
    assignments: pairs,
    answerCandidates: uniqueNumbers(pairs.map(([first, second]) => first + second)),
    firstCandidates: uniqueIntegers(pairs.map(([first]) => first)),
    secondCandidates: uniqueIntegers(pairs.map(([, second]) => second))
  };
};

check(moduleApi && typeof moduleApi.deriveCase === "function", "평행선 각 모듈의 순수 기하 API가 없습니다.");
check(new Set(moduleApi.SOURCE_IDS).size === 9, "새 심화 원문 ID가 정확히 9개가 아닙니다.");
check(!moduleApi.SOURCE_IDS.some(id => /^4-2-quad-/.test(id)), "실력 교재 원문 ID가 새 가로채기 목록에 들어갔습니다.");
check(sourceIds.every(id => moduleApi.SOURCE_IDS.includes(id)), "검수 목록과 모듈 원문 ID 목록이 다릅니다.");

const exactSourceAnswers = {
  "4-2-u4-e2-exploration": "㉠+㉡과 ㉢+㉣은 같습니다.",
  "4-2-u4-e2-example-2-3": "180°",
  "4-2-u4-e2-example-2-4": "111°",
  "4-2-u4-e2-mission-1": "102°",
  "4-2-u4-e2-mission-2": "79°",
  "4-2-u4-e2-mission-3": "라와 마",
  "4-2-u4-e2-mission-4": "370°",
  "4-2-u4-e2-mission-5": "50°",
  "4-2-u4-e2-mission-6": "130°"
};

const independentlyRecalculate = evidence => {
  const { kind, data } = evidence;
  if (kind === "exploration") {
    const firstConnector = Number(data.firstConnector ?? data.connector);
    const secondConnector = Number(data.secondConnector);
    const expectedSum = 180 + Number(data.bottom) - Number(data.top);
    check(Number.isFinite(firstConnector) && Number.isFinite(secondConnector), `${evidence.sourceItemId}/pool${evidence.poolIndex}: 두 연결선 방향이 독립적으로 기록되지 않았습니다.`);
    check(Number.isFinite(expectedSum), `${evidence.sourceItemId}/pool${evidence.poolIndex}: 위·아래 경계 방향이 없습니다.`);
    const upper = ((firstConnector - data.top) % 360 + 360) % 360;
    const lower = ((data.bottom - (firstConnector + 180)) % 360 + 360) % 360;
    const secondUpper = ((secondConnector - data.top) % 360 + 360) % 360;
    const secondLower = ((data.bottom - (secondConnector + 180)) % 360 + 360) % 360;
    const variedConnectorSums = new Set();
    integerAngles.forEach(connector => {
      const candidateUpper = ((connector - data.top) % 360 + 360) % 360;
      const candidateLower = ((data.bottom - (connector + 180)) % 360 + 360) % 360;
      if (candidateUpper > 0 && candidateUpper < 180 && candidateLower > 0 && candidateLower < 180) variedConnectorSums.add(candidateUpper + candidateLower);
    });
    check(variedConnectorSums.size === 1, `${evidence.sourceItemId}/pool${evidence.poolIndex}: 연결선 방향 변성에서 두 각 합 후보가 유일하지 않습니다.`);
    return {
      answer: "㉠+㉡과 ㉢+㉣은 같습니다.",
      candidates: [expectedSum],
      facts: [upper, lower, secondUpper, secondLower],
      expectedSum,
      variedConnectorSums: [...variedConnectorSums]
    };
  }
  if (kind === "example-2-3") {
    const values = [data.bridge - data.left, 90 + data.left, data.right - data.bridge, 90 - data.right];
    const left = pairSumCandidates(90 + data.bridge);
    const right = pairSumCandidates(90 - data.bridge);
    check(left.firstCandidates.length > 1 && left.secondCandidates.length > 1 && right.firstCandidates.length > 1 && right.secondCandidates.length > 1, `${evidence.sourceItemId}/pool${evidence.poolIndex}: 네 개별각 후보가 원문 조건만으로 부당하게 고정되었습니다.`);
    const sums = uniqueNumbers(left.assignments.flatMap(([first, second]) => right.assignments.map(([third, fourth]) => first + second + third + fourth)));
    return { answer: `${values.reduce((sum, value) => sum + value, 0)}°`, candidates: sums, individualCandidates: { left: [left.firstCandidates, left.secondCandidates], right: [right.firstCandidates, right.secondCandidates] }, facts: values };
  }
  if (kind === "example-2-4") {
    const sum = data.large - data.small;
    const second = sum - data.first;
    const directions = [180 - data.large, 180 - data.first, 180 - data.first - data.small];
    check(angleDifference(directions[1], directions[2]) === data.small, `${evidence.sourceItemId}/pool${evidence.poolIndex}: 두 빗선의 작은 각이 방향 모델과 다릅니다.`);
    check(angleDifference(directions[0], directions[2]) === second, `${evidence.sourceItemId}/pool${evidence.poolIndex}: 둘째 목표각이 방향 모델과 다릅니다.`);
    const pair = pairSumCandidates(sum);
    check(pair.firstCandidates.length > 1 && pair.secondCandidates.length > 1, `${evidence.sourceItemId}/pool${evidence.poolIndex}: 두 target 개별각이 원문 조건만으로 부당하게 고정되었습니다.`);
    return { answer: `${sum}°`, candidates: pair.answerCandidates, individualCandidates: { first: pair.firstCandidates, second: pair.secondCandidates }, facts: [data.first, second] };
  }
  if (kind === "mission-1") {
    const target = 180 - data.first - data.second;
    const targetCandidates = integerAngles.filter(candidate => candidate + data.first + data.second === 180);
    return { answer: `${target}°`, candidates: targetCandidates, facts: [data.first, data.second, target] };
  }
  if (kind === "mission-2") {
    const first = data.secondGiven - data.firstGiven;
    const second = 270 - data.secondGiven;
    const firstCandidates = integerAngles.filter(candidate => candidate + data.firstGiven === data.secondGiven);
    const secondCandidates = integerAngles.filter(candidate => candidate + data.secondGiven - 90 === 180);
    const differenceCandidates = uniqueIntegers(firstCandidates.flatMap(firstCandidate => secondCandidates.map(secondCandidate => secondCandidate - firstCandidate)));
    return { answer: `${second - first}°`, candidates: differenceCandidates, individualCandidates: { first: firstCandidates, second: secondCandidates }, facts: [first, second] };
  }
  if (kind === "mission-3") {
    const names = ["가", "나", "다", "라", "마"];
    const directions = [180 - data.first, 180 - data.second, data.equal, 0, 0];
    const candidates = parallelPairs(names, directions);
    return { answer: candidates[0], candidates, facts: [data.first, data.second, data.equal, data.equal] };
  }
  if (kind === "mission-4") {
    const a = 180 - data.row;
    const diagonal = a - data.left;
    const b = diagonal + data.middle;
    const c = diagonal + data.right;
    const corresponding = [a, b, diagonal, data.right];
    const sum = corresponding.reduce((total, value) => total + value, 0);
    const correspondingCandidates = new Set();
    integerAngles.forEach(first => {
      if (first + data.row !== 180) return;
      const diagonalCandidate = first - data.left;
      const secondCandidate = diagonalCandidate + data.middle;
      if (diagonalCandidate >= 1 && diagonalCandidate <= 179 && secondCandidate >= 1 && secondCandidate <= 179) correspondingCandidates.add(first + secondCandidate + diagonalCandidate + data.right);
    });
    return { answer: `${sum}°`, candidates: [...correspondingCandidates].sort((a, b) => a - b), facts: [data.left, data.middle, data.row, data.right, c], displayed: [data.left, data.middle, data.row, data.right], corresponding };
  }
  if (kind === "mission-5") {
    const target = data.outer - data.gap;
    const targetCandidates = integerAngles.filter(candidate => candidate + data.gap === data.outer);
    return { answer: `${target}°`, candidates: targetCandidates, facts: [data.outer, data.gap, data.unused, target] };
  }
  if (kind === "mission-6") {
    const target = 90 + data.given;
    const targetCandidates = integerAngles.filter(candidate => candidate - data.given === 90);
    return { answer: `${target}°`, candidates: targetCandidates, facts: [data.given, target] };
  }
  throw new Error(`독립 검산을 지원하지 않는 유형입니다: ${kind}`);
};

let checkedCases = 0;
for (const sourceItemId of sourceIds) {
  const matching = types.filter(type => type.sourceItemId === sourceItemId);
  check(matching.length === 1, `${sourceItemId}: 교육과정에서 정확히 한 번 나오지 않습니다.`);
  const type = matching[0];
  check(Boolean(type), `${sourceItemId}: 교육과정 유형이 없습니다.`);
  if (!type) continue;
  check(type.reviewLocked === false, `${sourceItemId}: 검증 유형이 잠겨 있습니다.`);
  check(type.generatorKey === moduleApi.GENERATOR_KEY, `${sourceItemId}: 전용 생성기 키가 없습니다.`);
  check(type.generationMode === "fixed-verified-pool", `${sourceItemId}: 고정 검증 풀이 아닙니다.`);
  check(type.verifiedVariantCount === 3 && type.verifiedVariantTarget === 3, `${sourceItemId}: 검증 풀이 수가 3이 아닙니다.`);
  check(type.answerVisualRequired === true && type.answerVisualStatus === "verified" && type.status === "verified", `${sourceItemId}: 답 그림 검증 상태가 아닙니다.`);
  check(moduleApi.POOLS[moduleApi.buildGenerated(sourceItemId, 0).prompt.match(/data-model-kind="([^"]+)"/)?.[1]]?.length === 3, `${sourceItemId}: 풀이 배열이 정확히 3개가 아닙니다.`);

  for (let pool = 0; pool < 3; pool += 1) {
    const label = `${sourceItemId}/pool${pool}`;
    const generated = api.generate(type, 1, 0, 20260913 + pool, pool);
    checkedCases += 1;
    check(Boolean(generated), `${label}: 생성 결과가 없습니다.`);
    if (!generated) continue;
    ["prompt", "answer", "solution", "answerVisual"].forEach(field => check(String(generated[field] || "").trim().length > 0, `${label}: ${field}가 비었습니다.`));
    const combined = [generated.prompt, generated.answer, generated.solution, generated.answerVisual].join("\n");
    check(!/undefined|NaN|Infinity/.test(combined), `${label}: 잘못된 수치 문자열이 있습니다.`);
    check(!/<br\s*\/?\s*>/i.test(combined), `${label}: 한 문제를 강제로 여러 줄로 나누는 br이 있습니다.`);
    check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3 && generated.verifiedPoolIndex === pool, `${label}: 고정 풀이 계약이 다릅니다.`);
    check(generated.answerCandidateCount === 1, `${label}: 정답 후보 수가 1이 아닙니다.`);
    check(generated.answerVisualRequired === true && generated.answerVisualStatus === "verified", `${label}: 답 그림 계약이 없습니다.`);
    check(generated.sourceItemId === sourceItemId && generated.generator === moduleApi.GENERATOR_KEY, `${label}: 생성 출처가 다릅니다.`);
    check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`), `${label}: 답 그림 출처가 없습니다.`);

    const visiblePrompt = learnerText(generated.prompt);
    check(!/(먼저|힌트|도움|생각해|계산해|정답|답은|따라서|풀이)/.test(visiblePrompt), `${label}: 문제에 도움말 또는 풀이 문장이 노출되었습니다.`);
    check(!/[=＝]/.test(visiblePrompt), `${label}: 문제에 계산식이 노출되었습니다.`);
    check(!/<p[^>]*question-step|data-step-evidence|class="[^"]*(?:hint|help|guide)/i.test(generated.prompt), `${label}: 문제에 안내용 마크업이 있습니다.`);

    const evidence = decodeAttr(generated.prompt, "data-geometry-model");
    check(Boolean(evidence), `${label}: 숨은 기하 근거가 없습니다.`);
    if (!evidence) continue;
    check(evidence.sourceItemId === sourceItemId && evidence.poolIndex === pool, `${label}: 숨은 출처 또는 풀이 번호가 다릅니다.`);
    check(evidence.uniqueAnswerCount === 1, `${label}: 숨은 단일 정답 계약이 없습니다.`);
    const independent = independentlyRecalculate(evidence);
    check(independent.candidates.length === 1, `${label}: 독립 계산의 정답 후보가 하나가 아닙니다.`);
    check(normalizeAnswer(generated.answer) === normalizeAnswer(independent.answer), `${label}: 정답이 독립 계산과 다릅니다. 생성=${generated.answer}, 독립=${independent.answer}`);

    const problemAngleValues = [...generated.prompt.matchAll(/<g\b[^>]*data-angle-role="[^"]+"[^>]*data-angle-value="([^"]+)"[^>]*>/g)].map(match => Number(match[1]));
    independent.facts.forEach(value => check(problemAngleValues.some(marked => Math.abs(marked - value) < 0.01), `${label}: 독립 계산값 ${value}°가 문제 그림의 각호에 연결되지 않았습니다.`));
    const problemAngleTags = generated.prompt.match(/<g\b[^>]*data-angle-role="[^"]+"[^>]*>/g) || [];
    const answerAngleTags = generated.answerVisual.match(/<g\b[^>]*data-angle-role="[^"]+"[^>]*>/g) || [];
    const angleGeometryAttributes = [
      "data-angle-vertex", "data-angle-ray-a", "data-angle-ray-b", "data-angle-midpoint",
      "data-angle-start", "data-angle-start-direction", "data-angle-span", "data-angle-sweep"
    ];
    problemAngleTags.forEach(problemTag => {
      const role = attr(problemTag, "data-angle-role");
      const answerTag = answerAngleTags.find(tag => attr(tag, "data-angle-role") === role);
      check(Boolean(answerTag), `${label}/${role}: 답 그림에 같은 각 표시가 없습니다.`);
      angleGeometryAttributes.forEach(name => check(attr(problemTag, name) === attr(answerTag || "", name), `${label}/${role}: 문제와 답 그림의 ${name} 위치가 다릅니다.`));
    });

    const directionModel = decodeAttr(generated.prompt, "data-direction-model");
    check(Boolean(directionModel) && directionModel.kind === evidence.kind, `${label}: 그림의 선 방향 모델이 없습니다.`);
    const renderedLines = lineTags(generated.prompt).map(lineFromTag);
    const renderedAngles = (generated.prompt.match(/<g\b[^>]*data-angle-role="[^"]+"[^>]*>/g) || []).map(parsedAngle);
    renderedAngles.forEach(angle => {
      check(angle.vertex.length === 2 && angle.vertex.every(Number.isFinite), `${label}/${angle.role}: 각 꼭짓점 좌표가 없습니다.`);
      check(angle.rayA.length === 2 && angle.rayA.every(Number.isFinite) && angle.rayB.length === 2 && angle.rayB.every(Number.isFinite), `${label}/${angle.role}: 각 경계 ray 좌표가 없습니다.`);
      if (angle.vertex.length === 2 && angle.rayA.length === 2 && angle.rayB.length === 2 && angle.vertex.every(Number.isFinite) && angle.rayA.every(Number.isFinite) && angle.rayB.every(Number.isFinite)) {
        const recomputed = angleFromRays(angle.rayA, angle.rayB, angle.vertex);
        check(Number.isFinite(recomputed) && Math.abs(recomputed - angle.value) < 0.05, `${label}/${angle.role}: 렌더 ray에서 독립 재계산한 각 ${recomputed}°와 표시값 ${angle.value}°가 다릅니다.`);
      }
    });
    const lineByName = (...names) => renderedLines.find(line => names.includes(line.name));
    const angleByRole = role => renderedAngles.find(angle => angle.role === role);
    const leaderRequired = evidence.kind === "example-2-4"
      ? ["small-given"]
      : evidence.kind === "mission-5" ? ["gap-given", "unused-given"] : [];
    if (evidence.kind === "exploration" || evidence.kind === "example-2-3") {
      const answerAngleLabels = [...generated.answerVisual.matchAll(/<text class="(?:pa-target|pa-value)"[^>]*>([^<]+)<\/text>/g)].map(match => match[1]);
      check(JSON.stringify(answerAngleLabels) === JSON.stringify(["㉠", "㉡", "㉢", "㉣"]), `${label}: 풀이 그림의 네 각 기호가 개별 숫자로 바뀌었습니다.`);
      if (evidence.kind === "example-2-3") check(!/\d+°\s*\+/.test(generated.solution), `${label}: 원문에 주어지지 않은 네 개별각 수치를 풀이식에 노출합니다.`);
    }
    leaderRequired.forEach(role => {
      const angle = angleByRole(role);
      check(angle?.labelMode === "leader", `${label}/${role}: 원문처럼 각도 바깥 callout을 leader 모드로 표시하지 않았습니다.`);
      const leaderCount = (generated.prompt.match(/class="pa-leader"/g) || []).length;
      check(leaderCount >= leaderRequired.length, `${label}: 원문 callout 수만큼 pa-leader가 없습니다.`);
    });
    if (evidence.kind === "exploration") {
      const upperLine = lineByName("윗선");
      const lowerLine = lineByName("아랫선");
      const firstLine = lineByName("첫째 평행선", "첫째 연결선", "첫째 선분");
      const secondLine = lineByName("둘째 평행선", "둘째 연결선", "둘째 선분");
      check(Boolean(upperLine && lowerLine && firstLine && secondLine), `${label}: 탐구 원문의 네 경계선을 찾지 못했습니다.`);
      if (upperLine && lowerLine && firstLine && secondLine) {
        const sharedOrigin = [upperLine.a, upperLine.b].some(first => [lowerLine.a, lowerLine.b].some(second => pointDistance(first, second) < 0.5));
        check(sharedOrigin, `${label}: 원문처럼 윗선과 아랫선이 하나의 경계 원점에서 만나지 않습니다.`);
        check(normalizedLineDifference(firstLine, secondLine) > 5, `${label}: 탐구의 두 연결선이 평행으로 중복되었습니다.`);
      }
      check(renderedAngles.length === 4, `${label}: 탐구 각 표시가 4개가 아닙니다.`);
      const values = renderedAngles.map(angle => angle.value);
      if (values.length === 4 && Number.isFinite(evidence.data.top) && Number.isFinite(evidence.data.bottom)) {
        const expectedSum = 180 + Number(evidence.data.bottom) - Number(evidence.data.top);
        check(Math.abs(values[0] + values[1] - expectedSum) < 0.05, `${label}: 첫 연결선의 두 각 합이 180+아랫선-윗선 불변식과 다릅니다.`);
        check(Math.abs(values[2] + values[3] - expectedSum) < 0.05, `${label}: 둘째 연결선의 두 각 합이 180+아랫선-윗선 불변식과 다릅니다.`);
        check(Math.abs(values[0] - values[2]) > 0.5 || Math.abs(values[1] - values[3]) > 0.5, `${label}: 네 각이 첫 연결선 쌍의 값을 그대로 복제합니다.`);
      }
      check(Array.isArray(directionModel?.values) && directionModel.values.length === 4, `${label}: 탐구 방향 모델이 네 개의 독립 각 값을 보존하지 않습니다.`);
      check(Number.isFinite(evidence.facts?.secondUpper) && Number.isFinite(evidence.facts?.secondLower), `${label}: 둘째 연결선의 upper/lower 근거가 없습니다.`);
      check(/같습니다/.test(generated.solution) && !/㉠\+㉡=\d+°/.test(generated.solution) && !/㉢\+㉣=\d+°/.test(generated.solution), `${label}: 원문이 요구하지 않은 두 합의 수치값을 풀이에 노출합니다.`);
    }
    if (evidence.kind === "mission-2") {
      const upper = lineByName("가");
      const lower = lineByName("나");
      const vertical = lineByName("다");
      const first = lineByName("첫째 빗선");
      const second = lineByName("둘째 빗선");
      check(Boolean(upper && lower && vertical && first && second), `${label}: Mission 2의 다섯 원본 선을 찾지 못했습니다.`);
      if (upper && lower && vertical && first && second) {
        check(normalizedLineDifference(upper, lower) < 0.05, `${label}: 가와 나가 평행하지 않습니다.`);
        check(Math.abs(normalizedLineDifference(upper, vertical) - 90) < 0.05, `${label}: 가와 다가 수직이 아닙니다.`);
        const upperTriple = segmentIntersection(upper, vertical);
        const lowerVertical = segmentIntersection(lower, vertical);
        const lowerTriple = segmentIntersection(lower, first);
        const upperSecond = segmentIntersection(upper, second);
        const lowerSecond = segmentIntersection(lower, second);
        const verticalSecond = segmentIntersection(vertical, second);
        const declaredIntersections = directionModel.intersections || {};
        const declaredPoint = name => {
          const value = declaredIntersections[name];
          return value && Number.isFinite(value.x) && Number.isFinite(value.y) ? [value.x, value.y] : null;
        };
        [["upperCommon", upperTriple], ["lowerCommon", lowerTriple], ["secondTarget", verticalSecond]].forEach(([name, actual]) => {
          const declared = declaredPoint(name);
          check(Boolean(declared && actual), `${label}: direction-model.${name} 교점 근거가 없습니다.`);
          if (declared && actual) check(pointDistance(declared, actual) < 0.5, `${label}: direction-model.${name}이 렌더 선분 교점과 다릅니다.`);
        });
        check(Boolean(upperTriple && pointOnSegment(upperTriple, first)), `${label}: 첫 빗선이 가와 다의 위쪽 공통 교점에서 시작하지 않습니다.`);
        check(Boolean(lowerVertical), `${label}: 다와 나의 별도 교점이 없습니다.`);
        check(Boolean(lowerTriple && pointOnSegment(lowerTriple, second)), `${label}: 두 빗선과 나의 아래쪽 공통 교점이 없습니다.`);
        check(Boolean(upperSecond), `${label}: 둘째 빗선과 가의 위쪽 교점이 없습니다.`);
        check(Boolean(verticalSecond), `${label}: 둘째 빗선과 다의 별도 교점이 없습니다.`);
        [upperTriple, lowerVertical, lowerTriple, upperSecond, verticalSecond].filter(Boolean).forEach((point, index, points) => {
          points.slice(index + 1).forEach(other => check(pointDistance(point, other) > 5, `${label}: Mission 2의 원본 교점들이 하나로 합쳐졌습니다.`));
        });
        if (lowerVertical && verticalSecond) {
          const verticalDirection = [vertical.b[0] - vertical.a[0], vertical.b[1] - vertical.a[1]];
          const separation = (verticalSecond[0] - lowerVertical[0]) * verticalDirection[0] + (verticalSecond[1] - lowerVertical[1]) * verticalDirection[1];
          check(separation > 5, `${label}: ㉡ 교점이 나와 다의 아래쪽에 있지 않습니다.`);
        }
        const firstTarget = angleByRole("circle-1");
        const secondTarget = angleByRole("circle-2");
        check(Boolean(firstTarget && lowerTriple && pointDistance(firstTarget.vertex, lowerTriple) < 0.5), `${label}: ㉠이 두 빗선과 나의 아래쪽 공통 교점에 있지 않습니다.`);
        check(Boolean(secondTarget && verticalSecond && pointDistance(secondTarget.vertex, verticalSecond) < 0.5), `${label}: ㉡이 다와 둘째 빗선의 별도 교점에 있지 않습니다.`);
      }
    }
    if (evidence.kind === "mission-3") {
      const firstGiven = angleByRole("first-given");
      const secondGiven = angleByRole("second-given");
      const equalBottom = angleByRole("equal-bottom");
      const directions = directionModel?.directions || [];
      check(firstGiven && Math.abs(angleDifference(firstGiven.start, directions[0])) < 0.05, `${label}: 120°/110° 주어진 각이 원문처럼 아랫선 아래쪽 sector에 놓이지 않았습니다.`);
      check(secondGiven && Math.abs(angleDifference(secondGiven.start, directions[1])) < 0.05, `${label}: 둘째 주어진 각의 아랫선 아래쪽 sector가 바뀌었습니다.`);
      const equalBottomUpperLeft = equalBottom && equalBottom.midpoint.length === 2 && equalBottom.vertex.length === 2
        && equalBottom.midpoint[0] < equalBottom.vertex[0] && equalBottom.midpoint[1] < equalBottom.vertex[1];
      check(equalBottom && Math.abs(angleDifference(equalBottom.start, 180)) < 0.05 && equalBottomUpperLeft, `${label}: 아래쪽 50°가 실제 ray midpoint 기준 원문 위쪽 왼쪽 엇각 sector가 아닙니다.`);
      check(/엇각/.test(generated.solution) && !/동위각/.test(generated.solution), `${label}: Mission 3 풀이가 원문의 엇각 관계를 설명하지 않습니다.`);
    }
    if (evidence.kind === "example-2-4") {
      const circleTwo = angleByRole("circle-2");
      const descending = lineByName("내려가는 빗선");
      check(Boolean(circleTwo && descending) && Math.abs(angleDifference(circleTwo.start, lineDirection(descending) + 180)) < 0.05, `${label}: 예제 2-4 ㉡이 원문처럼 위쪽 반대 sector에 놓이지 않았습니다.`);
    }
    if (evidence.kind === "mission-5") {
      const leftInner = lineByName("왼쪽 안쪽선");
      const rightInner = lineByName("오른쪽 안쪽선");
      const leftOuter = lineByName("다");
      const rightOuter = lineByName("라");
      const apex = leftInner && rightInner ? segmentIntersection(leftInner, rightInner) : null;
      check(Boolean(apex), `${label}: Mission 5 두 안쪽 선분의 유한 교점이 없습니다.`);
      if (leftInner && rightInner && apex) {
        const leftApexEndpoint = pointDistance(leftInner.a, apex) < 0.5 || pointDistance(leftInner.b, apex) < 0.5;
        const rightApexEndpoint = pointDistance(rightInner.a, apex) < 0.5 || pointDistance(rightInner.b, apex) < 0.5;
        check(leftApexEndpoint && rightApexEndpoint, `${label}: 안쪽 선이 원문처럼 leftJoint-apex-rightJoint 유한 선분으로 끝나지 않습니다.`);
        const leftOther = pointDistance(leftInner.a, apex) < 0.5 ? leftInner.b : leftInner.a;
        const rightOther = pointDistance(rightInner.a, apex) < 0.5 ? rightInner.b : rightInner.a;
        check(Boolean(leftOuter && pointOnSegment(leftOther, leftOuter)), `${label}: 왼쪽 안쪽 선분의 끝점이 왼쪽 바깥선의 joint에 놓이지 않습니다.`);
        check(Boolean(rightOuter && pointOnSegment(rightOther, rightOuter)), `${label}: 오른쪽 안쪽 선분의 끝점이 오른쪽 바깥선의 joint에 놓이지 않습니다.`);
      }
    }
    if (evidence.kind === "mission-1" && directionModel) {
      const difficulty = generated.difficultyEvidence || {};
      check(generated.difficultyDesign === "source-structure", `${label}: 난이도가 원본 구조 기준으로 표시되지 않았습니다.`);
      check(difficulty.sourceTier === "심화" && difficulty.sourceTask === "Mission 1" && difficulty.sourceStructurePreserved === true, `${label}: 원본 심화 Mission 1 난이도 근거가 없습니다.`);
      check(difficulty.givenAngleCount === 2 && difficulty.numericChangeOnly === false, `${label}: 주어진 두 각과 구조 변형 조건이 보존되지 않았습니다.`);
      check(Array.isArray(difficulty.requiredParallelPairs) && JSON.stringify(difficulty.requiredParallelPairs) === JSON.stringify([["가", "나"], ["ㄴㄷ", "ㅁㄹ"]]), `${label}: 두 평행 관계가 난이도 근거에 없습니다.`);
      check(Array.isArray(difficulty.reasoningSteps) && difficulty.reasoningSteps.length === 2, `${label}: 원본의 두 단계 풀이 부담이 보존되지 않았습니다.`);
      check(JSON.stringify(evidence.difficultyEvidence) === JSON.stringify(difficulty), `${label}: 숨은 근거와 생성 결과의 난이도 계약이 다릅니다.`);
      check(Array.isArray(directionModel.pointOrder) && directionModel.pointOrder.length === 4 && directionModel.pointOrder.every((value, index, values) => index === 0 || value > values[index - 1]), `${label}: ㄱ-ㄴ-ㄹ-ㅂ 교점 순서가 보존되지 않았습니다.`);
      check(directionModel.distinctMiddlePoints > 10, `${label}: ㄴ과 ㄹ이 서로 다른 점으로 분리되지 않았습니다.`);
      ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"].forEach(name => check(new RegExp(`<text class="pa-name"[^>]*>${name}<\\/text>`).test(generated.prompt), `${label}: 점 ${name} 표시가 없습니다.`));
      check(generated.prompt.includes('data-line-name="ㄴㄷ"') && generated.prompt.includes('data-line-name="ㅁㄹ"'), `${label}: 평행한 선분 ㄴㄷ과 ㅁㄹ이 분리되지 않았습니다.`);
      const points = directionModel.points || {};
      const [g, n, d, r, m, b] = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"].map(name => points[name]);
      check([g, n, d, r, m, b].every(position => Array.isArray(position) && position.length === 2 && position.every(Number.isFinite)), `${label}: Mission 1 점 좌표 근거가 완전하지 않습니다.`);
      if ([g, n, d, r, m, b].every(position => Array.isArray(position) && position.length === 2 && position.every(Number.isFinite))) {
        [n, r, b].forEach((position, index) => check(pointLineDistance(position, g, b) < 0.02, `${label}: ${["ㄴ", "ㄹ", "ㅂ"][index]}이 ㄱ-ㅂ 직선 위에 있지 않습니다.`));
        check(Math.hypot(n[0] - r[0], n[1] - r[1]) > 10, `${label}: ㄴ과 ㄹ 좌표가 분리되지 않았습니다.`);
        const renderedLines = lineTags(generated.prompt).map(lineFromTag);
        const byName = name => renderedLines.find(item => item.name === name);
        const expectedPointPairs = {
          "ㄱ": ["가", "ㄱㄴㄹㅂ"], "ㄴ": ["ㄱㄴㄹㅂ", "ㄴㄷ"], "ㄷ": ["가", "ㄴㄷ"],
          "ㄹ": ["ㄱㄴㄹㅂ", "ㅁㄹ"], "ㅁ": ["나", "ㅁㄹ"], "ㅂ": ["나", "ㄱㄴㄹㅂ"]
        };
        Object.entries(expectedPointPairs).forEach(([name, [firstName, secondName]]) => {
          const firstLine = byName(firstName);
          const secondLine = byName(secondName);
          const expected = firstLine && secondLine ? lineIntersection(firstLine, secondLine) : null;
          check(Boolean(expected), `${label}: 점 ${name}의 두 경계선 ${firstName}-${secondName}을 찾지 못했습니다.`);
          if (expected) check(Math.hypot(points[name][0] - expected[0], points[name][1] - expected[1]) < 0.05, `${label}: 점 ${name}이 ${firstName}-${secondName} 교점에 있지 않습니다.`);
        });
        const nd = byName("ㄴㄷ");
        const mr = byName("ㅁㄹ");
        const upper = byName("가");
        const lower = byName("나");
        const steepRendered = byName("ㄱㄴㄹㅂ");
        const endpointDistance = (first, second) => Math.hypot(first[0] - second[0], first[1] - second[1]);
        const steepEndpointsMatch = Boolean(steepRendered) && (
          (endpointDistance(steepRendered.a, g) < 0.05 && endpointDistance(steepRendered.b, b) < 0.05)
          || (endpointDistance(steepRendered.a, b) < 0.05 && endpointDistance(steepRendered.b, g) < 0.05)
        );
        check(steepEndpointsMatch, `${label}: ㄱ-ㄴ-ㄹ-ㅂ 선분이 원본처럼 ㄱ에서 시작해 ㅂ에서 끝나지 않습니다.`);
        const renderedAngle = item => Math.atan2(item.b[1] - item.a[1], item.b[0] - item.a[0]) * 180 / Math.PI;
        check(Boolean(nd && mr) && angleDifference(renderedAngle(nd), renderedAngle(mr)) < 0.02, `${label}: ㄴㄷ과 ㅁㄹ이 평행하지 않습니다.`);
        check(Boolean(upper && lower) && angleDifference(renderedAngle(upper), renderedAngle(lower)) < 0.02, `${label}: 직선 가와 나가 평행하지 않습니다.`);
      }
    }
    if (evidence.kind === "mission-4") {
      const valueLabels = [...generated.prompt.matchAll(/<text class="pa-value"[^>]*>(\d+°)<\/text>/g)].map(match => match[1]);
      check(JSON.stringify(valueLabels) === JSON.stringify(independent.displayed.map(value => `${value}°`)), `${label}: 문제 표시값이 원본 순서와 다릅니다. 표시=${valueLabels.join(",")}`);
      check(JSON.stringify(evidence.facts.corresponding) === JSON.stringify(independent.corresponding), `${label}: 동위각 계산값이 선 방향 모델과 다릅니다.`);
      check(pool !== 0 || JSON.stringify(valueLabels) === JSON.stringify(["55°", "65°", "60°", "55°"]), `${label}: 원문 Mission 4 표시값 55°, 65°, 60°, 55°가 아닙니다.`);
      check(pool !== 0 || JSON.stringify(independent.corresponding) === JSON.stringify([120, 130, 65, 55]), `${label}: 원문 Mission 4 동위각 120°, 130°, 65°, 55°가 아닙니다.`);
      const problemLines = lineTags(generated.prompt).map(lineFromTag);
      const byName = name => problemLines.find(item => item.name === name);
      const expectedIntersections = {
        "left-given": ["가", "마", evidence.data.left],
        "middle-given": ["나", "마", evidence.data.middle],
        "row-given": ["가", "라", evidence.data.row],
        "right-given": ["다", "마", evidence.data.right],
        "circle-1": ["다", "라", independent.facts[4]]
      };
      const problemAngleTags = generated.prompt.match(/<g\b[^>]*data-angle-role="[^"]+"[^>]*>/g) || [];
      Object.entries(expectedIntersections).forEach(([role, [firstName, secondName, expectedValue]]) => {
        const angleTag = problemAngleTags.find(tag => attr(tag, "data-angle-role") === role);
        const vertex = String(attr(angleTag || "", "data-angle-vertex") || "").split(",").map(Number);
        const firstLine = byName(firstName);
        const secondLine = byName(secondName);
        const expectedVertex = firstLine && secondLine ? lineIntersection(firstLine, secondLine) : null;
        check(Boolean(angleTag && expectedVertex), `${label}/${role}: 원본 교점 ${firstName}-${secondName}을 찾지 못했습니다.`);
        if (angleTag && expectedVertex) check(Math.hypot(vertex[0] - expectedVertex[0], vertex[1] - expectedVertex[1]) < 0.05, `${label}/${role}: 표시각이 원본 교점 ${firstName}-${secondName}에 있지 않습니다.`);
        check(Number(attr(angleTag || "", "data-angle-value")) === expectedValue, `${label}/${role}: 원본 위치의 각 값이 ${expectedValue}°가 아닙니다.`);
      });
    }

    const svgTags = combined.match(/<(?:g|path)\b[^>]*data-angle-role="[^"]+"[^>]*>/g) || [];
    check(svgTags.length > 0, `${label}: 각 표시 메타데이터가 없습니다.`);
    const roleCounts = new Map();
    svgTags.forEach(tag => {
      const role = attr(tag, "data-angle-role");
      roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
      ["data-angle-value", "data-angle-vertex", "data-angle-ray-a", "data-angle-ray-b", "data-angle-midpoint", "data-angle-start", "data-angle-start-direction", "data-angle-span", "data-angle-center", "data-angle-radius", "data-angle-sweep"].forEach(name => check(attr(tag, name) !== undefined, `${label}/${role}: ${name} 메타데이터가 없습니다.`));
      const value = Number(attr(tag, "data-angle-value"));
      const span = Number(attr(tag, "data-angle-span"));
      const radius = Number(attr(tag, "data-angle-radius"));
      const center = String(attr(tag, "data-angle-center") || "").split(",").map(Number);
      const vertex = String(attr(tag, "data-angle-vertex") || "").split(",").map(Number);
      const rayA = String(attr(tag, "data-angle-ray-a") || "").split(",").map(Number);
      const rayB = String(attr(tag, "data-angle-ray-b") || "").split(",").map(Number);
      const midpoint = String(attr(tag, "data-angle-midpoint") || "").split(",").map(Number);
      const start = Number(attr(tag, "data-angle-start-direction"));
      const sweep = Number(attr(tag, "data-angle-sweep"));
      check(Number.isFinite(value) && value > 0 && value < 180, `${label}/${role}: 각 값이 범위를 벗어났습니다.`);
      check(Number.isFinite(span) && Math.abs(value - span) < 0.01, `${label}/${role}: 호의 크기와 각 값이 다릅니다.`);
      check(Number.isFinite(radius) && radius >= 16, `${label}/${role}: 각 호 반지름이 너무 작습니다.`);
      check(center.length === 2 && center.every(Number.isFinite), `${label}/${role}: 각 중심 좌표가 잘못되었습니다.`);
      check(vertex.length === 2 && vertex.every(Number.isFinite) && Math.hypot(vertex[0] - center[0], vertex[1] - center[1]) < 0.01, `${label}/${role}: 꼭짓점과 호 중심이 다릅니다.`);
      check(rayA.length === 2 && rayA.every(Number.isFinite) && rayB.length === 2 && rayB.every(Number.isFinite), `${label}/${role}: 두 경계 ray 좌표가 잘못되었습니다.`);
      check(midpoint.length === 2 && midpoint.every(Number.isFinite), `${label}/${role}: 각호 중앙점 좌표가 잘못되었습니다.`);
      if (vertex.length === 2 && midpoint.length === 2 && vertex.every(Number.isFinite) && midpoint.every(Number.isFinite)) {
        const midpointDirection = ((Math.atan2(midpoint[1] - vertex[1], midpoint[0] - vertex[0]) * 180 / Math.PI) % 360 + 360) % 360;
        const expectedDirection = ((start + (sweep ? span / 2 : -span / 2)) % 360 + 360) % 360;
        const directionError = angleDifference(midpointDirection, expectedDirection);
        check(directionError < 0.05, `${label}/${role}: 각호 중앙점이 두 경계 ray의 가운데에 있지 않습니다.`);
        check(Math.abs(Math.hypot(midpoint[0] - vertex[0], midpoint[1] - vertex[1]) - radius) < 0.05, `${label}/${role}: 각호 중앙점이 호 위에 있지 않습니다.`);
        const rayADirection = ((Math.atan2(rayA[1] - vertex[1], rayA[0] - vertex[0]) * 180 / Math.PI) % 360 + 360) % 360;
        const rayBDirection = ((Math.atan2(rayB[1] - vertex[1], rayB[0] - vertex[0]) * 180 / Math.PI) % 360 + 360) % 360;
        const firstHalf = sweep ? ((midpointDirection - rayADirection) % 360 + 360) % 360 : ((rayADirection - midpointDirection) % 360 + 360) % 360;
        const secondHalf = sweep ? ((rayBDirection - midpointDirection) % 360 + 360) % 360 : ((midpointDirection - rayBDirection) % 360 + 360) % 360;
        check(firstHalf > 0 && secondHalf > 0 && Math.abs(firstHalf + secondHalf - span) < 0.05, `${label}/${role}: 각호 중앙점이 두 경계 ray 사이에 있지 않습니다.`);
      }
    });

    const originalQuadrants = {
      "example-2-4:circle-1": [1, -1],
      "mission-1:target": [-1, 1],
      "mission-4:circle-1": [-1, -1],
      "mission-5:target": [1, 1],
      "mission-6:target": [-1, 1]
    };
    const targetLinePairs = {
      "example-2-4:circle-1": ["나", "완만한 빗선"],
      "mission-1:target": ["ㄱㄴㄹㅂ", "ㅁㄹ"],
      "mission-4:circle-1": ["다", "라"],
      "mission-5:target": ["나", "왼쪽 안쪽선"],
      "mission-6:target": ["나", "다"]
    };
    const quadrantKey = Object.keys(originalQuadrants).find(key => key.startsWith(`${evidence.kind}:`));
    if (quadrantKey) {
      const role = quadrantKey.split(":")[1];
      const tag = svgTags.find(candidate => candidate.startsWith("<g") && attr(candidate, "data-angle-role") === role);
      const vertex = String(attr(tag || "", "data-angle-vertex") || "").split(",").map(Number);
      const midpoint = String(attr(tag || "", "data-angle-midpoint") || "").split(",").map(Number);
      const rayA = String(attr(tag || "", "data-angle-ray-a") || "").split(",").map(Number);
      const rayB = String(attr(tag || "", "data-angle-ray-b") || "").split(",").map(Number);
      const [xSign, ySign] = originalQuadrants[quadrantKey];
      check(Boolean(tag) && (midpoint[0] - vertex[0]) * xSign > 1 && (midpoint[1] - vertex[1]) * ySign > 1, `${label}/${role}: 목표 각호가 원본 사분면과 다릅니다.`);
      const renderedLines = lineTags(generated.prompt).map(lineFromTag);
      const [firstName, secondName] = targetLinePairs[quadrantKey];
      const firstLine = renderedLines.find(item => item.name === firstName);
      const secondLine = renderedLines.find(item => item.name === secondName);
      const expectedVertex = firstLine && secondLine ? lineIntersection(firstLine, secondLine) : null;
      check(Boolean(expectedVertex), `${label}/${role}: 목표각의 원본 두 선 ${firstName}-${secondName}을 찾지 못했습니다.`);
      if (expectedVertex) check(Math.hypot(vertex[0] - expectedVertex[0], vertex[1] - expectedVertex[1]) < 0.05, `${label}/${role}: 목표각 꼭짓점이 ${firstName}-${secondName} 교점이 아닙니다.`);
      const rayDirection = ray => Math.atan2(ray[1] - vertex[1], ray[0] - vertex[0]) * 180 / Math.PI;
      const lineDirection = item => Math.atan2(item.b[1] - item.a[1], item.b[0] - item.a[0]) * 180 / Math.PI;
      const sameBoundary = (ray, modelLine) => {
        const difference = angleDifference(rayDirection(ray), lineDirection(modelLine));
        return difference < 0.05 || Math.abs(difference - 180) < 0.05;
      };
      if (firstLine && secondLine && rayA.every(Number.isFinite) && rayB.every(Number.isFinite)) {
        const boundariesMatch = (sameBoundary(rayA, firstLine) && sameBoundary(rayB, secondLine)) || (sameBoundary(rayA, secondLine) && sameBoundary(rayB, firstLine));
        check(boundariesMatch, `${label}/${role}: 목표각의 두 경계 ray가 원본 선 ${firstName}-${secondName}과 다릅니다.`);
      }
    }
    roleCounts.forEach((count, role) => check(count % 2 === 0 && count >= 4, `${label}/${role}: 문제·답 그림의 g/path 메타데이터가 짝을 이루지 않습니다.`));
    check((generated.prompt.match(/data-phase="problem"/g) || []).length === 1, `${label}: 문제 그림이 정확히 하나가 아닙니다.`);
    check((generated.answerVisual.match(/data-phase="answer"/g) || []).length === 1, `${label}: 답 그림이 정확히 하나가 아닙니다.`);
    if (pool === 0) check(normalizeAnswer(generated.answer) === normalizeAnswer(exactSourceAnswers[sourceItemId]), `${label}: 원문 수치 정답이 다릅니다.`);
  }
}

let geometryEnumerations = 0;
for (let large = 120; large <= 150; large += 2) {
  for (let small = 12; small <= 30; small += 3) {
    for (let first = 30; first <= 50; first += 5) {
      if (large - small - first <= 10) continue;
      const facts = moduleApi.deriveCase("example-2-4", { large, small, first });
      check(facts.sum === large - small && facts.first + facts.second === facts.sum, "예제 2-4 순수 기하 열거가 실패했습니다.");
      geometryEnumerations += 1;
    }
  }
}
for (let first = 35; first <= 60; first += 5) {
  for (let second = 20; second <= 40; second += 4) {
    if (first + second >= 170) continue;
    const facts = moduleApi.deriveCase("mission-1", { first, second, base: 15 });
    check(first + second + facts.target === 180, "Mission 1 평각 열거가 실패했습니다.");
    geometryEnumerations += 1;
  }
}
for (let firstGiven = 50; firstGiven <= 80; firstGiven += 5) {
  for (let secondGiven = 115; secondGiven <= 140; secondGiven += 5) {
    const facts = moduleApi.deriveCase("mission-2", { firstGiven, secondGiven });
    if (facts.firstTarget <= 0 || facts.secondTarget <= 0) continue;
    check(facts.difference === (270 - secondGiven) - (secondGiven - firstGiven), "Mission 2 두 각 차 열거가 실패했습니다.");
    geometryEnumerations += 1;
  }
}
for (let outer = 60; outer <= 80; outer += 2) {
  for (let gap = 15; gap <= 30; gap += 3) {
    if (outer <= gap) continue;
    const facts = moduleApi.deriveCase("mission-5", { outer, gap, unused: 35 });
    check(facts.target === outer - gap, "Mission 5 아래 평행선 교점 열거가 실패했습니다.");
    geometryEnumerations += 1;
  }
}
for (let given = 25; given <= 55; given += 1) {
  const facts = moduleApi.deriveCase("mission-6", { given });
  check(facts.target === 90 + given, "Mission 6 수직선·평행선 열거가 실패했습니다.");
  geometryEnumerations += 1;
}

const directModule = require(path.join(dir, "source-4-2-parallel-angle.js"));
check(directModule.SOURCE_IDS.length === 9 && typeof directModule.intersection === "function", "Node require에서 모듈 API를 사용할 수 없습니다.");

if (failures.length) {
  console.error(`4-2 심화 평행선 각 수학 감사 실패: ${failures.length}건`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`4-2 심화 평행선 각 수학 감사 통과: ${sourceIds.length}유형 · 고정 풀이 ${checkedCases}건 · 순수 기하 열거 ${geometryEnumerations}건 · 표준 원문 ID 연결`);
