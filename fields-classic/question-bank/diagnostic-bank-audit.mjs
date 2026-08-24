import { TYPES, DIAGNOSTIC_EXAM_TYPES } from "./source-data.js";
import { GENERATORS } from "./generators.js";

const RUNS = 3000;
const byId = new Map(TYPES.map((item) => [item.id, item]));
const failures = [];

function fail(message) {
  failures.push(message);
}

function numericAnswer(problem) {
  const matched = String(problem.answer).match(/-?\d+/);
  return matched ? Number(matched[0]) : Number.NaN;
}

function tokenValue(tokens, assign) {
  return tokens.reduce((total, token) => total * 10 + (typeof token === "number" ? token : assign[token]), 0);
}

function cryptarithmSolutionCount(first, second, sum) {
  let count = 0;
  for (let square = 0; square <= 9; square += 1) {
    for (let circle = 0; circle <= 9; circle += 1) {
      if (square === circle) continue;
      const assign = { "□": square, "○": circle };
      if ([first, second, sum].some((tokens) => typeof tokens[0] === "string" && assign[tokens[0]] === 0)) continue;
      if (tokenValue(first, assign) + tokenValue(second, assign) === tokenValue(sum, assign)) count += 1;
    }
  }
  return count;
}

const checks = {
  setUnionCount(problem) {
    const { first, second, both, total } = problem.meta;
    if (first + second - both !== total || numericAnswer(problem) !== total) fail("두 집합 전체 수 계산 불일치");
    if (both >= first || both >= second) fail("두 집합 공통 수 범위 오류");
    if (/야구을|태권도을|포도을|줄넘기을/.test(problem.prompt)) fail("두 집합 문장 조사 오류");
  },
  diagnosticAnimalBalanceOrder(problem, difficulty) {
    const { ordered, relations } = problem.meta;
    const expectedCount = difficulty === 1 ? 2 : difficulty === 3 ? 4 : 3;
    if (ordered.length !== expectedCount || relations.length !== expectedCount - 1) fail("동물 저울 수 또는 동물 수 오류");
    for (let index = 0; index < ordered.length - 1; index += 1) {
      const light = ordered[index];
      const heavy = ordered[index + 1];
      const relation = relations.find((item) => (
        (item.left === light && item.right === heavy && item.heavier === "right")
        || (item.left === heavy && item.right === light && item.heavier === "left")
      ));
      if (!relation) fail("동물 저울의 인접 무게 관계 불일치");
    }
    if (problem.answer !== ordered.join(", ")) fail("동물 저울 순서 답 불일치");
  },
  diagnosticPartWholeBar(problem) {
    const { total, parts, blankIndex, answer } = problem.meta;
    if (parts.reduce((sum, value) => sum + value, 0) !== total) fail("부분-전체 막대 합 불일치");
    if (parts[blankIndex] !== answer || numericAnswer(problem) !== answer) fail("부분-전체 막대 답 불일치");
    if (problem.visual.parts.filter((value) => value === null).length !== 1) fail("부분-전체 막대 빈칸 수 오류");
  },
  diagnosticDialogueConditionNumber(problem) {
    const { base, more, less, answer } = problem.meta;
    if (base + more - less !== answer || numericAnswer(problem) !== answer) fail("대화 문장제 계산 불일치");
  },
  diagnosticNumberRelation(problem) {
    const { examples, targets, answerValues, answer } = problem.meta;
    for (const disc of [...examples, ...targets]) {
      if (disc.outer.reduce((sum, value) => sum + value, 0) !== disc.center * 2) fail("원판 관계식 불일치");
    }
    if (targets.some((disc, index) => disc.outer[disc.blankIndex] !== answerValues[index])) fail("원판 빈칸 답 불일치");
    const expected = answerValues.length === 1 ? answerValues[0] : answerValues.reduce((sum, value) => sum + value, 0);
    if (answer !== expected || numericAnswer(problem) !== expected) fail("원판 최종 답 불일치");
  },
  diagnosticTwoDigitCryptarithm(problem) {
    const { first, second, sum, square, circle, solutions } = problem.meta;
    const assign = { "□": square, "○": circle };
    if (tokenValue(first, assign) + tokenValue(second, assign) !== tokenValue(sum, assign)) fail("복면산 식 불성립");
    if (solutions !== 1 || cryptarithmSolutionCount(first, second, sum) !== 1) fail("복면산 답이 유일하지 않음");
    if (problem.answer !== `□=${square}, ○=${circle}`) fail("복면산 답 표기 불일치");
  }
};

for (const [generatorName, check] of Object.entries(checks)) {
  const generator = GENERATORS[generatorName];
  if (!generator) {
    fail(`${generatorName} 생성기 없음`);
    continue;
  }
  for (const difficulty of [1, 2, 3]) {
    for (let run = 0; run < RUNS; run += 1) {
      const problem = generator({ difficulty });
      if (!problem || !problem.prompt || !problem.answer || !problem.solution) {
        fail(`${generatorName} 난이도 ${difficulty} 빈 문제`);
        break;
      }
      if (/undefined|NaN|null/.test(`${problem.prompt} ${problem.answer} ${problem.solution}`)) {
        fail(`${generatorName} 난이도 ${difficulty} 화면 문자열 오류`);
        break;
      }
      check(problem, difficulty);
      if (failures.length) break;
    }
    if (failures.length) break;
  }
  if (failures.length) break;
}

const diagnostic = DIAGNOSTIC_EXAM_TYPES.find((exam) => exam.id === "diagnostic-mock");
if (!diagnostic || diagnostic.questions.length !== 25) fail("진단 모의고사 25문항 목록 오류");
for (const question of diagnostic?.questions || []) {
  const item = byId.get(question.typeId);
  const ready = question.verified
    && (item?.sourceMatched || item?.bankApproved)
    && ((item?.generator && GENERATORS[item.generator]) || item?.worksheetCode);
  if (!ready) fail(`진단 ${question.number}번 잠금: ${question.typeId}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`진단 모의고사 문제은행 검산 완료: 전용 4유형 ${RUNS * 3 * 4}회, 기존 교정 2유형 ${RUNS * 3 * 2}회, 전체 25/25 준비됨`);
