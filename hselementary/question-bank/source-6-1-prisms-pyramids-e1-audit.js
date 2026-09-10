"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceIds = [
  "6-1-u2-e1-example-1-1", "6-1-u2-e1-mission-1", "6-1-u2-e1-mission-2", "6-1-u2-e1-mission-5",
  "6-1-u2-e1-mission-6", "6-1-u2-e1-example-1-4"
];
const sourceAnswers = new Map([
  ["6-1-u2-e1-example-1-1", "19각기둥"],
  ["6-1-u2-e1-mission-1", "24"],
  ["6-1-u2-e1-mission-2", "115cm"],
  ["6-1-u2-e1-mission-5", "ㄴㅊ=16 2/3cm, 나=250cm²"],
  ["6-1-u2-e1-mission-6", "C, 128cm"],
  ["6-1-u2-e1-example-1-4", "28.5cm"]
]);
const failures = [];
let checked = 0;
let context = "";
const check = (condition, message) => { if (!condition) failures.push(`${context}: ${message}`); };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const rational = (numerator, denominator = 1) => {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) throw new Error("유리수 값이 아닙니다.");
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return [sign * numerator / divisor, sign * denominator / divisor];
};
const multiply = (left, right) => rational(left[0] * right[0], left[1] * right[1]);
const divide = (left, right) => rational(left[0] * right[1], left[1] * right[0]);
const fraction = value => value[1] === 1 ? String(value[0]) : `${value[0]}/${value[1]}`;
const mixed = value => {
  const normalized = rational(value[0], value[1]);
  if (normalized[1] === 1) return String(normalized[0]);
  const whole = Math.floor(normalized[0] / normalized[1]);
  const remainder = normalized[0] % normalized[1];
  return whole ? `${whole} ${remainder}/${normalized[1]}` : `${remainder}/${normalized[1]}`;
};
const attr = (markup, name) => markup.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const stripTags = value => String(value).replace(/<[^>]*>/g, " ");
const parseEvidence = prompt => {
  const markup = String(prompt).match(/<span hidden data-source61-prism-e1-kind="[^"]+"[^>]*><\/span>/)?.[0];
  if (!markup) throw new Error("독립 검산 자료가 없습니다.");
  const values = (attr(markup, "data-values") || "").split(",").map(Number);
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("독립 검산 값이 깨졌습니다.");
  return {
    kind: attr(markup, "data-source61-prism-e1-kind"),
    sourceItemId: attr(markup, "data-source-item"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
};

function independentAnswer(evidence) {
  const v = evidence.values;
  if (evidence.kind === "prism-name-from-counts") {
    const n = v[0], k = v[1], faces = n + 2, edges = 3 * n, vertices = 2 * n;
    check(faces === v[2] && edges === v[3] && vertices === v[4], "각기둥 구성 요소 수가 저장 자료와 다릅니다.");
    check(faces + edges - vertices === k, "면·모서리·꼭짓점 관계가 성립하지 않습니다.");
    return `${n}각기둥`;
  }
  if (evidence.kind === "prism-symbol-ratio-value") {
    const n = v[0];
    const answer = rational(3 * (n + 2), 2);
    check(answer[1] === 1 && answer[0] === v[1], "ㄱ·ㄴ·ㄷ 대응식의 계산 답이 저장 자료와 다릅니다.");
    return fraction(answer);
  }
  if (evidence.kind === "rolling-pentagonal-prism-edge-total") {
    const h = v[0], t = v[1], perimeter = v[2], paintedArea = v[3], edgeTotal = v[4];
    check(t * h * perimeter === paintedArea, "A=t×h×P를 독립 계산하지 못했습니다.");
    check(2 * perimeter + 5 * h === edgeTotal, "오각기둥의 모든 모서리 길이 합을 독립 계산하지 못했습니다.");
    return `${edgeTotal}cm`;
  }
  if (evidence.kind === "triangular-prism-net-ratio-area") {
    const ga = v[0], da = v[1], ratio = rational(v[2], v[3]), areaGa = v[4];
    const height = rational(areaGa, ga);
    const daArea = multiply(rational(da), height);
    const area = multiply(daArea, ratio);
    const na = divide(area, height);
    check(ga + da > na[0] / na[1] && ga + na[0] / na[1] > da && da + na[0] / na[1] > ga, "삼각형 부등식이 성립하지 않습니다.");
    check(height[0] === v[5] && height[1] === v[6], "가의 넓이와 가로에서 구한 높이가 저장 자료와 다릅니다.");
    check(na[0] === v[7] && na[1] === v[8] && area[0] === v[9] && area[1] === v[10], "ㄴㅊ 길이 또는 나 넓이가 독립 계산과 다릅니다.");
    return `ㄴㅊ=${mixed(na)}cm, 나=${mixed(area)}cm²`;
  }
  if (evidence.kind === "concave-prism-net-match-edge-total") {
    const unit = v[0], height = v[1], perimeter = v[2], sideCount = v[3], edgeTotal = v[4], distanceToA = v[5];
    const baseEdgeUnits = [3, 2, 1, 1, 1, 1, 1, 2];
    const stripEdgeUnits = [1, 1, 1, 1, 2, 3, 2];
    const detachedEdgeUnits = [1];
    check(baseEdgeUnits.reduce((sum, value) => sum + value, 0) * unit === perimeter, "오목한 밑면의 여덟 변 둘레가 저장 자료와 다릅니다.");
    check(stripEdgeUnits.length + detachedEdgeUnits.length === sideCount, "가로 띠와 따로 붙은 옆면을 합한 수가 8개가 아닙니다.");
    check([...stripEdgeUnits, ...detachedEdgeUnits].reduce((sum, value) => sum + value, 0) * unit === perimeter, "옆면 너비의 합이 밑면 둘레와 다릅니다.");
    const candidates = new Map([["B", 5], ["C", 4], ["D", 3], ["E", 2], ["F", 0]]);
    const matches = [...candidates].filter(([, distance]) => distance === distanceToA);
    check(matches.length === 1, `점 A와 만나는 후보가 ${matches.length}개입니다.`);
    check(2 * perimeter + sideCount * height === edgeTotal, "모든 모서리 길이의 합이 독립 계산과 다릅니다.");
    return `${matches[0][0]}, ${edgeTotal}cm`;
  }
  if (evidence.kind === "trapezoidal-prism-net-height") {
    const baseHeight = v[0], longBase = v[1], baseArea = v[2], shortBase = v[3], faceArea = v[4], prismHeight = v[5];
    const independentlyFoundShortBase = 2 * baseArea / baseHeight - longBase;
    const independentlyFoundPrismHeight = faceArea / independentlyFoundShortBase;
    check(independentlyFoundShortBase > 0 && independentlyFoundShortBase < longBase, "사다리꼴의 짧은 밑변이 하나로 정해지지 않습니다.");
    check(independentlyFoundShortBase === shortBase, "사다리꼴 넓이에서 구한 짧은 밑변이 저장 자료와 다릅니다.");
    check(independentlyFoundPrismHeight === prismHeight, "(가)의 넓이에서 구한 각기둥 높이가 저장 자료와 다릅니다.");
    const candidates = Array.from({ length: 2000 }, (_, index) => (index + 1) / 10)
      .filter(candidate => candidate < longBase && (longBase + candidate) * baseHeight / 2 === baseArea && faceArea / candidate === prismHeight);
    check(candidates.length === 1 && candidates[0] === shortBase, `조건을 만족하는 짧은 밑변 후보가 ${candidates.length}개입니다.`);
    return `${prismHeight}cm`;
  }
  throw new Error(`알 수 없는 검산 종류: ${evidence.kind}`);
}

const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
check(api.names.includes("sourceGrade6PrismsPyramidsE1"), "전용 생성기가 등록되지 않았습니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const pools = new Set();
  const answers = new Set();
  for (const difficulty of [-1, 0, 1]) {
    const prompts = new Map();
    for (let seed = 1; seed <= 1200; seed += 1) {
      context = `${sourceIds[variant]} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const type = { generatorKey: "sourceGrade6PrismsPyramidsE1", variant, sourceItemId: sourceIds[variant] };
        const generated = api.generate(type, 0, difficulty, seed, variant);
        check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), "문제·정답·풀이가 비었습니다.");
        check(generated.generator === "sourceGrade6PrismsPyramidsE1", "전용 생성기를 사용하지 않았습니다.");
        check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, "고정 3문항 계약이 다릅니다.");
        check(Number.isInteger(generated.verifiedPoolIndex) && generated.verifiedPoolIndex >= 0 && generated.verifiedPoolIndex <= 2, "고정 묶음 번호가 0~2가 아닙니다.");
        check(generated.sourceItemId === sourceIds[variant], "생성 결과의 원문 유형 ID가 다릅니다.");
        check(typeof generated.answerVisual === "string" && generated.answerVisual.includes("source61-answer-diagram"), "답 그림 wrapper가 없습니다.");
        check(generated.answerVisual.includes(`data-answer-source="${sourceIds[variant]}"`) && generated.answerVisual.includes(`data-verified-pool-index="${generated.verifiedPoolIndex}"`), "답 그림의 유형·고정 묶음 연결이 다릅니다.");
        const parsed = parseEvidence(generated.prompt);
        check(parsed.sourceItemId === sourceIds[variant], "독립 검산 자료의 유형 ID가 다릅니다.");
        check(parsed.contract === ([3, 4].includes(variant) ? "two-values" : "single-value"), "답 형식 계약이 다릅니다.");
        check(parsed.difficulty === difficultyExpected[String(difficulty)], "난이도별 풀이 부담 표시가 다릅니다.");
        if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), "쉬움 단계의 안내가 없습니다.");
        if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), "원본 단계에 난이도 안내가 섞였습니다.");
        if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), "어려움 단계의 스스로 찾기 안내가 없습니다.");
        const expected = independentAnswer(parsed);
        check(String(generated.answer) === expected, `표시 답 '${generated.answer}'이 독립 계산 '${expected}'과 다릅니다.`);
        const visible = stripTags(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`);
        check(!/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(visible), "깨진 값 또는 학년 밖 표현이 있습니다.");
        if (variant === 0) {
          const n = parsed.values[0];
          check(!generated.prompt.includes(`${n}각기둥`), "문제에 실제 답인 각기둥 이름이 노출되었습니다.");
          check(!generated.prompt.includes(`data-n="${n}"`), "문제 표에 실제 n 값이 노출되었습니다.");
          check(generated.prompt.includes("source61-prism-structure") && generated.answerVisual.includes("count-relation"), "각기둥 구성 그림과 구성 요소 표가 없습니다.");
          check(generated.answerVisual.includes(`data-side-count="${n}"`) && generated.answerVisual.includes(`data-prism="${n},structure"`), "답 그림이 구한 각기둥의 실제 밑면 변 수로 그려지지 않았습니다.");
          check((generated.answerVisual.match(/class="source61-prism-vertex"/g) || []).length === 2 * n, "답 그림의 두 밑면 꼭짓점 수가 실제 각기둥과 다릅니다.");
          check((generated.answerVisual.match(/class="source61-prism-side-cell"/g) || []).length === n, "답 그림의 옆면 칸 수가 실제 각기둥과 다릅니다.");
          check(generated.prompt.includes("(면)+(모서리)-(꼭짓점)"), "면·모서리·꼭짓점 관계식이 없습니다.");
          if (difficulty >= 0) check(!/[23]n|n\+2/.test(stripTags(generated.prompt)), "원본·어려움 단계 문제에 구성 요소 공식이 노출되었습니다.");
        }
        if (variant === 1) {
          const n = parsed.values[0];
          check(generated.prompt.includes(`${n}각기둥`), "문제에 주어진 각기둥 이름이 없습니다.");
          check((generated.prompt.match(/class="source61-prism-vertex"/g) || []).length === 2 * n && (generated.prompt.match(/class="source61-prism-side-cell"/g) || []).length === n, "문제의 각기둥 구성 그림이 실제 변 수와 다릅니다.");
          check(generated.prompt.includes("ratio-table") && generated.answerVisual.includes("math-fraction"), "ㄱ·ㄴ·ㄷ 대응표 또는 세로 분수가 없습니다.");
          check(generated.prompt.includes("ㄱ (꼭짓점)") && generated.prompt.includes("ㄴ (모서리)") && generated.prompt.includes("ㄷ (면)"), "ㄱ·ㄴ·ㄷ 대응이 분명하지 않습니다.");
          if (difficulty === 0) {
            check(!generated.prompt.includes(`=${2 * n}`) && !generated.prompt.includes(`=${3 * n}`) && !generated.prompt.includes(`=${n + 2}`), "원본 난이도 문제에 계산값이 노출되었습니다.");
            check(!generated.prompt.includes(`data-n="${n}"`), "원본 난이도 표에 계산용 n 데이터가 노출되었습니다.");
            check(!new RegExp(`2×${n}|3×${n}|${n}\\+2`).test(stripTags(generated.prompt)), "원본 난이도 문제에 ㄱ·ㄴ·ㄷ 계산식이 노출되었습니다.");
          }
        }
        if (variant === 2) {
          check(generated.prompt.includes("source61-prism-roll") && generated.answerVisual.includes("source61-prism-roll"), "오각기둥 굴림 그림이 문제와 답에 없습니다.");
          check(generated.prompt.includes("data-roll-count=") && generated.prompt.includes("marker-end"), "굴림 횟수 또는 방향 표시가 없습니다.");
          check(generated.prompt.includes(`data-strip-rectangles="${5 * parsed.values[1]}"`) && generated.answerVisual.includes(`data-strip-rectangles="${5 * parsed.values[1]}"`), "한 바퀴당 옆면 5개인 연속 띠가 아닙니다.");
          check((generated.prompt.match(/source61-roll-rectangle/g) || []).length === 5 * parsed.values[1] && generated.prompt.includes("source61-round-boundary"), "굴림 띠의 5×t 직사각형과 바퀴 경계가 없습니다.");
          check(generated.answerVisual.includes("data-base-perimeter=") && generated.answerVisual.includes("data-target-edge-total="), "답 그림에 밑면 둘레와 모든 모서리 합이 강조되지 않았습니다.");
        }
        if (variant === 3) {
          const areaGa = parsed.values[4];
          check(generated.prompt.includes("source61-triangular-prism-net") && generated.answerVisual.includes("source61-triangular-prism-net"), "삼각기둥 전개도가 문제와 답에 없습니다.");
          check(generated.prompt.includes('data-point-order="ㄷ,ㄴ,ㅊ,ㅈ / ㄹ,ㅁ,ㅅ,ㅇ / apex ㄱ,ㅂ"'), "원문 점 배치 정보가 없습니다.");
          check(generated.prompt.includes(`data-area-ga="${areaGa}"`) && generated.prompt.includes("source61-net-given-area") && generated.prompt.includes(`>${areaGa}cm²</text>`), "가의 넓이가 전개도의 가 면에 표시되지 않았습니다.");
          check(!/공통 높이|data-common-height|H=/.test(generated.prompt), "문제에 공통 높이 또는 H가 노출되었습니다.");
          check(generated.prompt.includes("data-target-edge-orientation=\"horizontal\"") && generated.prompt.includes('data-target-edge="ㄴㅊ"'), "문제의 ㄴㅊ 수평 대상 변 표시가 없습니다.");
          check(generated.prompt.includes("math-mixed-number"), "문제의 비가 대분수 표시가 아닙니다.");
          check(generated.answerVisual.includes("source61-target-edge is-solved") && generated.answerVisual.includes("source61-target-area is-solved"), "답에서 ㄴㅊ와 나 영역이 강조되지 않았습니다.");
          check(generated.answerVisual.includes("data-derived-height=") && generated.answerVisual.includes("공통 높이 H"), "답에 가의 넓이에서 유도한 H가 표시되지 않았습니다.");
          check(generated.prompt.includes("math-fraction") && generated.answerVisual.includes("math-fraction"), "분수에 공통 세로 수식 표시를 사용하지 않았습니다.");
          check(generated.prompt.includes("ㄱㄴ=") && generated.prompt.includes("ㄴㅊ") && generated.prompt.includes("ㄱㅊ="), "삼각형 변 대응이 없습니다.");
        }
        if (variant === 4) {
          check(generated.prompt.includes("source61-concave-prism-net") && generated.answerVisual.includes("source61-concave-prism-net"), "오목한 팔각기둥 전개도가 문제와 답에 없습니다.");
          check((generated.prompt.match(/class="source61-concave-base /g) || []).length === 2, "서로 같은 오목한 밑면 2개가 없습니다.");
          check((generated.prompt.match(/class="source61-concave-side-face/g) || []).length === 8, "가로 띠 7개와 따로 붙은 1개를 합한 옆면 8개가 아닙니다.");
          check(generated.prompt.includes('data-strip-edge-units="1,1,1,1,2,3,2"') && generated.prompt.includes('data-detached-side-edge-units="1"'), "원문 옆면의 이어짐과 따로 붙은 옆면이 기록되지 않았습니다.");
          check(generated.prompt.includes('data-base-edge-units="3,2,1,1,1,1,1,2"'), "오목한 밑면의 여덟 변 구조가 없습니다.");
          check((generated.prompt.match(/data-candidate="[BCDEF]"/g) || []).length === 5 && generated.prompt.includes('data-point="A"'), "점 A와 후보 B부터 F가 모두 없습니다.");
          check(!generated.prompt.includes('data-point-a-strip-match="C"') && !generated.prompt.includes("source61-concave-fold-guide"), "문제 그림에 만나는 점 C가 노출되었습니다.");
          check(generated.answerVisual.includes('data-point-a-strip-match="C"') && generated.answerVisual.includes('data-candidate="C"') && generated.answerVisual.includes("source61-concave-fold-guide is-solved"), "답 그림에서 A와 C의 접힘 대응이 강조되지 않았습니다.");
          check(generated.answerVisual.includes(`data-target-edge-total="${parsed.values[4]}"`), "답 그림에 모든 모서리 길이 합이 없습니다.");
        }
        if (variant === 5) {
          const [baseHeight, longBase, baseArea, shortBase, faceArea, prismHeight] = parsed.values;
          const structure = `right-trapezoidal-prism-net-${baseHeight}-${longBase}-${baseArea}-${faceArea}`;
          check(generated.prompt.includes("source61-trapezoidal-prism-net") && generated.answerVisual.includes("source61-trapezoidal-prism-net"), "직각사다리꼴 밑면의 사각기둥 전개도가 문제와 답에 없습니다.");
          check(generated.prompt.includes(`data-source61-e1-structure="${structure}"`) && generated.answerVisual.includes(`data-source61-e1-structure="${structure}"`), "문제와 답의 전개도 구조 ID가 다릅니다.");
          check(generated.prompt.includes('data-base-face-count="2"') && generated.prompt.includes('data-lateral-face-count="4"'), "같은 사다리꼴 밑면 2개와 옆면 4개의 전개도가 아닙니다.");
          check((generated.prompt.match(/data-side-face="[1-4]"/g) || []).length === 4 && (generated.prompt.match(/data-base-face="[12]"/g) || []).length === 2, "전개도의 면 수가 원문 구조와 다릅니다.");
          check(generated.prompt.includes(`>${baseHeight}cm</text>`) && generated.prompt.includes(`>${longBase}cm</text>`) && generated.prompt.includes(`>${faceArea}cm²</text>`) && generated.prompt.includes(`>밑면 ${baseArea}cm²</text>`), "전개도의 길이와 넓이 표시가 빠졌습니다.");
          check(!generated.prompt.includes(`짧은 밑변 ${shortBase}cm`) && !generated.prompt.includes(`높이 ${prismHeight}cm`) && !generated.prompt.includes("source61-trapezoid-short-edge"), "문제 그림에 계산해야 할 짧은 밑변이나 각기둥 높이가 노출되었습니다.");
          check(generated.answerVisual.includes(`data-short-base="${shortBase}"`) && generated.answerVisual.includes(`data-prism-height="${prismHeight}"`), "답 그림에 짧은 밑변과 각기둥 높이 결과가 없습니다.");
          check(generated.answerVisual.includes("source61-trapezoid-face-ga is-solved") && generated.answerVisual.includes("source61-trapezoid-short-edge is-solved"), "답 그림에서 (가)와 짧은 밑변이 함께 강조되지 않았습니다.");
          check(generated.solution.includes(`${baseArea}×2÷${baseHeight}`) && generated.solution.includes(`${faceArea}÷${shortBase}=${prismHeight}`), "사다리꼴 넓이와 (가)의 넓이를 잇는 풀이가 없습니다.");
        }
        pools.add(generated.verifiedPoolIndex);
        answers.add(String(generated.answer));
        prompts.set(generated.verifiedPoolIndex, generated.prompt.replace(/<p class="question-step"[\s\S]*?<\/p>/g, "").replace(/<span hidden[\s\S]*?<\/span>/g, ""));
        checked += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
    check(prompts.size === 3, `난이도 ${difficulty}에서 고정 문항 ${prompts.size}개만 확인되었습니다.`);
  }
  check(pools.size === 3, "pool 0, 1, 2를 모두 확인하지 못했습니다.");
  check(answers.size === 3, `고정 묶음 답이 3종이어야 하나 ${answers.size}종입니다.`);
  if (sourceAnswers.has(sourceIds[variant])) {
    check(answers.has(sourceAnswers.get(sourceIds[variant])), `원문 답 ${sourceAnswers.get(sourceIds[variant])}이 고정 문항 묶음에 없습니다.`);
  }
}

if (failures.length) {
  console.error(`6-1 2단원 개념탐구 1 각기둥과 각뿔 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6-1 2단원 개념탐구 1 각기둥과 각뿔 감사 통과: 6유형 · 18개 고정 문항 · ${checked.toLocaleString()}회 계산·pool·답 3종·답 그림·원문 ID·난이도·도형 semantic 검사`);
