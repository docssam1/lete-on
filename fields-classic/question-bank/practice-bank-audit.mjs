import { TYPES, PRACTICE_EXAM_TYPES } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const RUNS = 3000;
const failures = [];
const byId = new Map(TYPES.map((item) => [item.id, item]));
const labels = ["①", "②", "③", "④", "⑤", "⑥"];

function fail(message) {
  failures.push(message);
}

const MOCK06_PARTICLE_WORDS = [
  "소희", "예린", "유리", "준희", "여울", "민서", "지우", "다현", "서윤", "하린",
  "동그라미", "세모", "별", "네모", "마름모",
  "김밥", "떡볶이", "순대", "만두", "주먹밥", "매운 어묵", "라면", "샌드위치",
  "유부초밥", "매운 떡", "국수", "호떡",
  ...Array.from({ length: 10 }, (_, value) => String(value))
];

function auditHasFinalConsonant(value) {
  const text = String(value);
  const last = [...text].at(-1) || "";
  if (/\d/.test(last)) return [0, 1, 3, 6, 7, 8].includes(Number(last));
  const code = last.charCodeAt(0) || 0;
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

function checkMock06Particles(text, generator, difficulty) {
  // `9이므로`처럼 `이다`의 활용형은 주격 조사와 모양이 같아 이/가는 기계 판정하지 않는다.
  const pairs = [["은", "는"], ["과", "와"], ["을", "를"]];
  for (const word of MOCK06_PARTICLE_WORDS) {
    const hasFinal = auditHasFinalConsonant(word);
    for (const [withFinal, withoutFinal] of pairs) {
      const wrong = hasFinal ? withoutFinal : withFinal;
      if (text.includes(`${word}${wrong}`)) {
        fail(`${generator} 난이도 ${difficulty} 조사 오류: ${word}${wrong}`);
        return;
      }
    }
  }
}

function numericAnswer(problem) {
  const matched = String(problem.answer).match(/-?\d+/);
  return matched ? Number(matched[0]) : Number.NaN;
}

function checkChainedNumberCondition(problem, difficulty) {
  const meta = problem.meta;
  if (difficulty === 1) {
    const expected = meta.base + meta.firstMore;
    if (meta.mode !== "one-step" || meta.answer !== expected || numericAnswer(problem) !== expected) fail("한 단계 조건 수 계산 불일치");
    return;
  }
  if (difficulty === 2) {
    const middle = meta.base + meta.firstMore;
    const expected = middle + meta.secondMore;
    if (meta.mode !== "two-step" || meta.middle !== middle || meta.answer !== expected || numericAnswer(problem) !== expected) fail("두 단계 조건 수 계산 불일치");
    return;
  }
  const a = meta.total - meta.firstGap;
  const b = a + meta.bMore;
  const c = b / 2 + meta.halfMore;
  if (meta.mode !== "three-step" || !Number.isInteger(c) || meta.a !== a || meta.b !== b || meta.c !== c) fail("세 단계 조건 수 계산 불일치");
  if (problem.answer !== `A=${a}권, B=${b}권, C=${c}권`) fail("세 단계 조건 수 답 표기 불일치");
}

const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

function signOf(permutation) {
  let inversions = 0;
  for (let left = 0; left < 3; left += 1) {
    for (let right = left + 1; right < 3; right += 1) if (permutation[left] > permutation[right]) inversions += 1;
  }
  return inversions % 2 ? -1 : 1;
}

const rotations = permutations.flatMap((axes) => (
  [-1, 1].flatMap((sx) => [-1, 1].flatMap((sy) => [-1, 1].map((sz) => ({ axes, signs: [sx, sy, sz] })) ))
)).filter(({ axes, signs }) => signOf(axes) * signs[0] * signs[1] * signs[2] === 1);

function normalize(coords) {
  const mins = [0, 1, 2].map((axis) => Math.min(...coords.map((point) => point[axis])));
  return coords.map((point) => point.map((value, axis) => value - mins[axis])).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}

function key(coords) {
  return normalize(coords).map((point) => point.join(",")).join(";");
}

function canonical(coords) {
  return rotations.map(({ axes, signs }) => key(coords.map((point) => [
    signs[0] * point[axes[0]], signs[1] * point[axes[1]], signs[2] * point[axes[2]]
  ]))).sort()[0];
}

function connected(coords) {
  const remaining = new Set(coords.map((point) => point.join(",")));
  const queue = [coords[0]];
  remaining.delete(coords[0].join(","));
  while (queue.length) {
    const [x, y, z] = queue.shift();
    for (const next of [[x + 1, y, z], [x - 1, y, z], [x, y + 1, z], [x, y - 1, z], [x, y, z + 1], [x, y, z - 1]]) {
      const nextKey = next.join(",");
      if (remaining.delete(nextKey)) queue.push(next);
    }
  }
  return remaining.size === 0;
}

function checkCubeDifferentShape(problem, difficulty) {
  const expectedCount = difficulty === 1 ? 4 : difficulty === 3 ? 6 : 5;
  const { options, answerIndex, optionCount } = problem.meta;
  if (optionCount !== expectedCount || options.length !== expectedCount) fail("다른 입체 보기 수 오류");
  if (options.some((coords) => coords.length !== 5 || !connected(coords))) fail("다른 입체 정육면체 수 또는 연결 오류");
  const classes = options.map(canonical);
  const counts = new Map(classes.map((classKey) => [classKey, classes.filter((value) => value === classKey).length]));
  const singletons = classes.map((classKey, index) => counts.get(classKey) === 1 ? index : -1).filter((index) => index >= 0);
  if (counts.size !== 2 || singletons.length !== 1 || singletons[0] !== answerIndex) fail("다른 입체 정답 유일성 오류");
  if (problem.answer !== labels[answerIndex]) fail("다른 입체 답 표기 오류");
}

function maskedEquationSolutions(equation) {
  const rows = ["top", "bottom", "result"];
  const slots = rows.flatMap((row) => (equation.hidden[row] || []).map((index) => ({ row, index })));
  const solutions = [];
  const assignment = [];
  const numberFor = (row) => Number([...equation[row]].map((digit, index) => {
    const slotIndex = slots.findIndex((slot) => slot.row === row && slot.index === index);
    return slotIndex >= 0 ? assignment[slotIndex] : digit;
  }).join(""));
  const search = (slotIndex) => {
    if (slotIndex === slots.length) {
      const values = rows.map(numberFor);
      if (values[0] + values[1] === values[2]) solutions.push([...assignment]);
      return;
    }
    const slot = slots[slotIndex];
    for (let digit = 0; digit <= 9; digit += 1) {
      if (slot.index === 0 && equation[slot.row].length > 1 && digit === 0) continue;
      assignment[slotIndex] = digit;
      search(slotIndex + 1);
    }
  };
  search(0);
  return solutions;
}

function checkMaskedVerticalAdditions(problem, difficulty) {
  const expectedCount = difficulty;
  const equations = problem.meta?.equations;
  if (problem.visual?.kind !== "masked-vertical-additions" || equations?.length !== expectedCount) {
    fail("가려진 세로셈 식 개수 오류");
    return;
  }
  for (const equation of equations) {
    if (Number(equation.top) + Number(equation.bottom) !== Number(equation.result)) fail("가려진 세로셈 계산 오류");
    const solutions = maskedEquationSolutions(equation);
    if (solutions.length !== 1 || solutions[0].join(",") !== equation.answerDigits.join(",")) fail("가려진 세로셈 정답 유일성 오류");
  }
  const expectedAnswer = equations.map((equation, index) => `${labels[index]} ${equation.answerDigits.join("·")}`).join(", ");
  if (problem.answer !== expectedAnswer) fail("가려진 세로셈 답 표기 오류");
}

function checkGivenShapeExpression(problem, difficulty) {
  const expectedEntries = difficulty + 1;
  const expectedTerms = difficulty + 2;
  const { entries, terms, result } = problem.meta;
  if (entries.length !== expectedEntries || terms.length !== expectedTerms) fail("도형값 혼합식 난이도 구조 오류");
  if (new Set(entries.map((entry) => entry.symbol)).size !== entries.length) fail("도형값 혼합식 도형 중복 오류");
  const values = new Map(entries.map((entry) => [entry.symbol, entry.value]));
  const calculated = terms.reduce((total, term, index) => {
    if (term.value !== values.get(term.symbol)) fail("도형값 혼합식 값 연결 오류");
    if (index === 0) return term.value;
    return term.operator === "+" ? total + term.value : total - term.value;
  }, 0);
  if (calculated !== result || Number(problem.answer) !== result || result < 1) fail("도형값 혼합식 계산 오류");
}

function checkPairedGrowingSequences(problem, difficulty) {
  const expectedGiven = difficulty === 3 ? 4 : 5;
  const expectedAnswers = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
  const expectedGrowth = difficulty === 1 ? 0 : difficulty === 2 ? 1 : 2;
  const rows = problem.meta?.rows;
  if (rows?.length !== 2 || problem.meta.givenCount !== expectedGiven || problem.meta.answerCount !== expectedAnswers) {
    fail("두 규칙 수열 난이도 구조 오류");
    return;
  }
  const firstDiffs = rows[0].full.slice(1).map((value, index) => value - rows[0].full[index]);
  if (firstDiffs.some((value, index) => index > 0 && value - firstDiffs[index - 1] !== expectedGrowth)) fail("커지는 간격 수열 규칙 오류");
  if (rows[1].full.some((value, index) => index > 0 && value !== rows[1].full[index - 1] * 2)) fail("두 배 수열 규칙 오류");
  for (const row of rows) {
    if (row.items.slice(0, expectedGiven).some((value, index) => value !== row.full[index])) fail("두 규칙 수열 보이는 수 오류");
    if (row.items.slice(expectedGiven).some((value) => value !== null)) fail("두 규칙 수열 빈칸 오류");
    if (row.answers.join(",") !== row.full.slice(expectedGiven).join(",")) fail("두 규칙 수열 이어지는 답 오류");
  }
  const expected = `① ${rows[0].answers.join(", ")} / ② ${rows[1].answers.join(", ")}`;
  if (problem.answer !== expected) fail("두 규칙 수열 답 표기 오류");
}

function checkCutReCutPieces(problem, difficulty) {
  const { firstParts, itemCount, firstTotal, eaten, remaining, answer } = problem.meta;
  const expectedFirstParts = difficulty === 3 ? 3 : 2;
  if (firstParts !== expectedFirstParts || firstTotal !== itemCount * firstParts) fail("자르고 다시 자르기 첫 단계 오류");
  if (remaining !== firstTotal - eaten || answer !== remaining * 2) fail("자르고 다시 자르기 과정 계산 오류");
  if (problem.answer !== `${answer}조각` || answer < 1) fail("자르고 다시 자르기 답 표기 오류");
  if (difficulty === 1 && !problem.prompt.includes(`처음 자르면 ${firstTotal}조각`)) fail("자르고 다시 자르기 쉬움 도움말 누락");
}

function checkTriangleFanCount(problem, difficulty) {
  const { rayCount, horizontalCount, horizontalFractions, oneLevel, levelCount, answer } = problem.meta;
  const allowed = difficulty === 1 ? [3] : difficulty === 2 ? [3, 4] : [4, 5];
  if (!allowed.includes(rayCount) || horizontalFractions.length !== horizontalCount) fail("삼각형 세기 난이도 구조 오류");
  if (horizontalFractions.some((value, index) => value <= 0 || value >= 1 || (index > 0 && value <= horizontalFractions[index - 1]))) fail("삼각형 세기 가로선 위치 오류");
  let independentlyCounted = 0;
  for (let left = 0; left < rayCount; left += 1) {
    for (let right = left + 1; right < rayCount; right += 1) independentlyCounted += 1;
  }
  if (oneLevel !== independentlyCounted || levelCount !== horizontalCount + 1 || answer !== independentlyCounted * levelCount) fail("삼각형 세기 계산 오류");
  if (problem.answer !== `${answer}개` || /C\(|조합|제곱/.test(problem.solution)) fail("삼각형 세기 학생용 답·풀이 오류");
}

function independentlyApplyLadder(value, operation) {
  if (operation.kind === "add") return value + operation.amount;
  if (operation.kind === "subtract") return value - operation.amount;
  if (operation.kind === "multiply") return value * operation.amount;
  return Number.NaN;
}

function independentlyRunLadder(startColumn, startValue, rungs) {
  let column = startColumn;
  let value = startValue;
  for (const rung of rungs) {
    if (column !== rung.left && column !== rung.right) continue;
    column = column === rung.left ? rung.right : rung.left;
    value = independentlyApplyLadder(value, rung.operation);
  }
  return { column, value };
}

function checkReverseOperationLadder(problem, difficulty) {
  const { columnCount, rungs, topValues, bottomValues, routes } = problem.meta;
  const expectedColumnCount = difficulty === 1 ? 3 : 4;
  const expectedPairs = difficulty === 1
    ? [[0, 1], [1, 2]]
    : [...(difficulty === 3 ? [[0, 1]] : []), [2, 3], [1, 2], [0, 1], [2, 3]];
  if (columnCount !== expectedColumnCount || rungs.length !== expectedPairs.length) fail("사다리 계산 난이도 구조 오류");
  if (rungs.some((rung, index) => rung.left !== expectedPairs[index][0] || rung.right !== expectedPairs[index][1])) fail("사다리 계산 연결 구조 오류");
  if (topValues.length !== columnCount || bottomValues.length !== columnCount || routes.length !== columnCount) fail("사다리 계산 값 개수 오류");
  const endColumns = [];
  for (let start = 0; start < columnCount; start += 1) {
    const result = independentlyRunLadder(start, topValues[start], rungs);
    endColumns.push(result.column);
    if (bottomValues[result.column] !== result.value) fail("사다리 계산 아래 결과 오류");
    const candidates = [];
    for (let candidate = 1; candidate <= 50; candidate += 1) {
      const trial = independentlyRunLadder(start, candidate, rungs);
      if (trial.column === result.column && trial.value === bottomValues[result.column]) candidates.push(candidate);
    }
    if (candidates.length !== 1 || candidates[0] !== topValues[start]) fail("사다리 계산 위 수 유일성 오류");
  }
  if (new Set(endColumns).size !== columnCount) fail("사다리 계산 경로 도착점 중복 오류");
  if (problem.answer !== topValues.join(", ")) fail("사다리 계산 답 표기 오류");
}

function independentlyEvaluateSigns(numbers, operators) {
  let total = numbers[0];
  for (let index = 0; index < operators.length; index += 1) {
    total = operators[index] === "+" ? total + numbers[index + 1] : total - numbers[index + 1];
  }
  return total;
}

function allPlusMinusPatterns(slotCount) {
  const patterns = [];
  for (let mask = 0; mask < (1 << slotCount); mask += 1) {
    patterns.push(Array.from({ length: slotCount }, (_, index) => (mask & (1 << index)) ? "-" : "+"));
  }
  return patterns;
}

function checkPlusMinusMultiTarget(problem, difficulty) {
  const { numberCount, rowCount, numbers, rows } = problem.meta;
  if (numberCount !== difficulty + 3 || rowCount !== difficulty + 1 || numbers.length !== numberCount || rows.length !== rowCount) fail("여러 목표 부호 넣기 난이도 구조 오류");
  if (new Set(numbers).size !== numbers.length || numbers.some((value, index) => index > 0 && numbers[index - 1] - value !== 2)) fail("여러 목표 부호 넣기 수 배열 오류");
  const patterns = allPlusMinusPatterns(numberCount - 1);
  const exampleResult = numbers.reduce((total, value) => total + value, 0);
  if (problem.visual?.exampleResult !== exampleResult) fail("여러 목표 부호 넣기 보기 계산 오류");
  const targets = new Set();
  for (const row of rows) {
    const solutions = patterns.filter((operators) => independentlyEvaluateSigns(numbers, operators) === row.target);
    if (row.target <= 0 || row.target === exampleResult || solutions.length !== 1) fail("여러 목표 부호 넣기 정답 유일성 오류");
    if (solutions[0]?.join("") !== row.operators.join("")) fail("여러 목표 부호 넣기 부호 연결 오류");
    targets.add(row.target);
  }
  if (targets.size !== rows.length) fail("여러 목표 부호 넣기 목표 중복 오류");
  const expected = rows.map((row, index) => `${labels[index]} ${row.operators.join(" ")}`).join(" / ");
  if (problem.answer !== expected || /조합|경우의 수|제곱/.test(problem.solution)) fail("여러 목표 부호 넣기 학생용 답·풀이 오류");
}

function checkTwoCustomOperations(problem, difficulty) {
  const { offset, secondCopies, queries } = problem.meta;
  const expectedCopies = difficulty === 3 ? 3 : 2;
  if (secondCopies !== expectedCopies || queries?.length !== 2 || problem.visual?.definitions?.length !== 2) fail("두 새 연산 난이도 구조 오류");
  const firstExpected = queries[0].left + queries[0].right + offset;
  let secondExpected = queries[1].left;
  for (let repeat = 0; repeat < secondCopies; repeat += 1) secondExpected += queries[1].right;
  if (queries[0].symbol !== "✣" || queries[1].symbol !== "◎" || queries[0].result !== firstExpected || queries[1].result !== secondExpected) fail("두 새 연산 계산 오류");
  const expectedAnswer = `① ${firstExpected}, ② ${secondExpected}`;
  if (problem.answer !== expectedAnswer || /×|곱하기|제곱/.test(problem.solution)) fail("두 새 연산 학생용 답·풀이 오류");
}

function auditPolygonArea(polygon) {
  let twiceArea = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    twiceArea += current.x * next.y - next.x * current.y;
  }
  return Math.abs(twiceArea) / 2;
}

function independentlyMirrorFold(point, direction) {
  if (direction === "v") return { x: 1 - point.x, y: point.y };
  if (direction === "h") return { x: point.x, y: 1 - point.y };
  if (direction === "vq") return { x: 0.5 - point.x, y: point.y };
  if (direction === "hq") return { x: point.x, y: 0.5 - point.y };
  return { x: Number.NaN, y: Number.NaN };
}

function checkPracticeThreeFoldHoleCount(problem, difficulty) {
  const { directions, holeCount, answer, holes, stages } = problem.meta;
  const expectedDirections = difficulty === 1 ? 2 : 3;
  const expectedHoles = difficulty === 3 ? 3 : 2;
  const validPath = directions.join(",") === "v,h,vq" || directions.join(",") === "h,v,hq";
  if (directions.length !== expectedDirections || holeCount !== expectedHoles) fail("실전 색종이 접기 난이도 구조 오류");
  if (difficulty === 1) {
    if (!["v,h", "h,v"].includes(directions.join(","))) fail("실전 색종이 두 번 접기 순서 오류");
  } else if (!validPath) fail("실전 색종이 세 번 접기 순서 오류");
  if (stages.length !== directions.length + 1 || holes.length !== holeCount) fail("실전 색종이 단계·구멍 개수 오류");
  for (let index = 1; index < stages.length; index += 1) {
    const previousArea = auditPolygonArea(stages[index - 1].polygon);
    const currentArea = auditPolygonArea(stages[index].polygon);
    if (Math.abs(previousArea / 2 - currentArea) > 1e-8) fail("실전 색종이 접힌 넓이 오류");
  }
  let unfolded = holes.map((hole) => ({ ...hole }));
  for (let index = directions.length - 1; index >= 0; index -= 1) {
    const reflected = unfolded.map((point) => independentlyMirrorFold(point, directions[index]));
    unfolded = [...unfolded, ...reflected].filter((point, pointIndex, all) => all.findIndex((other) => Math.hypot(point.x - other.x, point.y - other.y) < 1e-7) === pointIndex);
  }
  if (answer !== unfolded.length || answer !== holeCount * (1 << directions.length) || problem.answer !== `${answer}개`) fail("실전 색종이 펼친 구멍 계산 오류");
  if (difficulty === 2 && (answer !== 16 || !problem.prompt.includes("세 번") || holeCount !== 2)) fail("실전 3회 16번 원본 구조 오류");
}

function checkPracticeInterleavedPairSequence(problem, difficulty) {
  const { strands, rounds, step, starts, shownLength, values, gap, answer } = problem.meta;
  const expectedStrands = difficulty === 3 ? 3 : 2;
  const expectedRounds = difficulty === 1 ? 4 : 5;
  if (strands !== expectedStrands || rounds !== expectedRounds || starts.length !== strands) fail("실전 교대 수열 난이도 구조 오류");
  if (shownLength !== (rounds - 1) * strands + 1 || values.length !== shownLength || gap !== shownLength - 1) fail("실전 교대 수열 길이·빈칸 오류");
  for (let strand = 0; strand < strands; strand += 1) {
    const sequence = values.filter((_, index) => index % strands === strand);
    if (sequence.some((value, index) => value !== starts[strand] + step * index)) fail("실전 교대 수열 규칙 오류");
  }
  const shown = problem.visual?.rows?.[0]?.items;
  if (!shown || shown.some((value, index) => index === gap ? value !== null : value !== values[index])) fail("실전 교대 수열 화면 값 오류");
  if (answer !== values[gap] || Number(problem.answer) !== answer) fail("실전 교대 수열 답 오류");
  if (difficulty === 2 && (strands !== 2 || shownLength !== 9)) fail("실전 4회 9번 원본 구조 오류");
}

function checkPracticeCalendarWeekdaySum(problem, difficulty) {
  const { month, lastDate, firstWeekday, targetWeekday, columns, rows, dates, answer } = problem.meta;
  const expectedDates = Array.from({ length: lastDate }, (_, index) => index + 1)
    .filter((date) => (firstWeekday + date - 1) % 7 === targetWeekday);
  const expectedAnswer = expectedDates.reduce((total, date) => total + date, 0);
  if (month < 1 || month > 12 || ![28, 30, 31].includes(lastDate)) fail("실전 달력 월·날짜 수 오류");
  if (dates.join(",") !== expectedDates.join(",") || answer !== expectedAnswer || Number(problem.answer) !== expectedAnswer) fail("실전 달력 요일 합 오류");
  if (problem.visual?.kind !== "torn-calendar" || problem.visual.month !== month || problem.visual.rows !== rows) fail("실전 달력 화면 연결 오류");
  const expectedColumns = difficulty === 1 ? 7 : difficulty === 2 ? 3 : 2;
  if (columns.length !== expectedColumns || rows.length !== 2) fail("실전 달력 난이도 구조 오류");
  if (difficulty === 2 && (rows[0][1] !== 1 || rows[1][0] !== 7 || targetWeekday !== firstWeekday + 2)) fail("실전 4회 13번 원본 구조 오류");
}

function allOrders(values) {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => allOrders([...values.slice(0, index), ...values.slice(index + 1)])
    .map((rest) => [value, ...rest]));
}

function checkPracticeHeightExtremes(problem, difficulty) {
  const { count, names, order, relations, tallest, shortest } = problem.meta;
  const expectedCount = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  if (count !== expectedCount || names.length !== count || order.length !== count || relations.length !== count - 1) fail("실전 키 비교 난이도 구조 오류");
  if (new Set(names).size !== count || new Set(order).size !== count || names.some((name) => !order.includes(name))) fail("실전 키 비교 이름 중복·누락 오류");
  const validOrders = allOrders(names).filter((candidate) => relations.every(({ taller, shorter }) => candidate.indexOf(taller) < candidate.indexOf(shorter)));
  if (validOrders.length !== 1 || validOrders[0].join(",") !== order.join(",")) fail("실전 키 비교 정답 유일성 오류");
  if (tallest !== order[0] || shortest !== order.at(-1) || problem.answer !== `가장 큰 사람 ${tallest}, 가장 작은 사람 ${shortest}`) fail("실전 키 비교 답 오류");
  if (problem.visual?.kind !== "height-extremes" || problem.visual.names.length !== count || problem.visual.clues.length !== count - 1) fail("실전 키 비교 화면 오류");
  if (difficulty === 2 && count !== 5) fail("실전 4회 19번 원본 구조 오류");
}

function checkPracticeAlignedRodLengths(problem, difficulty) {
  const { knownLabel, knownLength, unitTotal, total, rows, values, answerLabels } = problem.meta;
  const expectedCounts = difficulty === 1 ? [3, 3] : difficulty === 3 ? [4, 4, 5, 10] : [3, 3, 4];
  if (knownLabel !== "가" || knownLength <= 0 || total !== knownLength * unitTotal) fail("실전 막대 기준 길이 오류");
  if (rows.length !== expectedCounts.length || rows.some((row, index) => row.length !== expectedCounts[index])) fail("실전 막대 난이도 구조 오류");
  for (const row of rows) {
    const rowTotal = row.reduce((sum, part) => sum + part.length, 0);
    if (rowTotal !== total) fail("실전 막대 한 줄 전체 길이 오류");
    for (const part of row) if (values[part.label] !== part.length) fail("실전 막대 같은 이름 길이 오류");
  }
  const expectedAnswer = answerLabels.map((label) => `${label} ${values[label]}cm`).join(", ");
  if (problem.answer !== expectedAnswer || problem.visual?.kind !== "aligned-rod-lengths") fail("실전 막대 답·화면 연결 오류");
  if (difficulty === 1 && !problem.visual.showTotal) fail("실전 막대 쉬움 힌트 오류");
  if (difficulty === 2 && (unitTotal !== 6 || rows[0].map((part) => part.label).join("") !== "나가가" || rows[1].length !== 3 || rows[2].length !== 4)) fail("실전 4회 2번 원본 구조 오류");
}

function checkPracticeTwoFunctionMachines(problem, difficulty) {
  const { firstExamples, secondExamples, targetInput, middle, result } = problem.meta;
  if (firstExamples.length !== 3 || secondExamples.length !== 3) fail("실전 두 수 규칙 보기 개수 오류");
  const [firstA, firstB] = firstExamples;
  const inputGap = firstB.input - firstA.input;
  const outputGap = firstB.output - firstA.output;
  const multiplier = outputGap / inputGap;
  const add = firstA.output - multiplier * firstA.input;
  if (!Number.isInteger(multiplier) || firstExamples.some(({ input, output }) => multiplier * input + add !== output)) fail("실전 첫 수 변환 규칙 오류");
  const constants = secondExamples.map(({ input, output }) => input * output);
  if (new Set(constants).size !== 1) fail("실전 둘째 수 변환 규칙 오류");
  const expectedMiddle = multiplier * targetInput + add;
  const expectedResult = constants[0] / expectedMiddle;
  if (!Number.isInteger(expectedResult) || middle !== expectedMiddle || result !== expectedResult) fail("실전 두 수 규칙 연쇄 계산 오류");
  if (problem.answer !== `첫 빈칸 ${expectedMiddle}, 다음 빈칸 ${expectedResult}` || problem.visual?.kind !== "two-function-machines") fail("실전 두 수 규칙 답·화면 오류");
  if (difficulty === 2 && (multiplier !== 2 || add !== 2)) fail("실전 4회 10번 원본 규칙 오류");
}

function checkPracticeVerticalShapeCryptarithm(problem, difficulty) {
  const { visible, values, valueSum, solutionCount } = problem.meta;
  const solutions = [];
  for (let spade = 1; spade <= 9; spade += 1) for (let heart = 0; heart <= 9; heart += 1) for (let star = 1; star <= 9; star += 1) {
    if (new Set([spade, heart, star]).size !== 3) continue;
    if ((10 * spade + heart) + (10 * star + heart) === 110 * star + visible) solutions.push({ spade, heart, star });
  }
  if (solutions.length !== 1 || solutionCount !== 1) fail("실전 도형 세로셈 유일해 오류");
  const expected = solutions[0];
  if (expected.spade !== values.spade || expected.heart !== values.heart || expected.star !== values.star) fail("실전 도형 세로셈 값 오류");
  if (valueSum !== expected.spade + expected.heart + expected.star) fail("실전 도형 세로셈 합 오류");
  const baseAnswer = `♠=${expected.spade}, ♥=${expected.heart}, ★=${expected.star}`;
  if (problem.answer !== (difficulty === 3 ? `${baseAnswer}, 합 ${valueSum}` : baseAnswer)) fail("실전 도형 세로셈 답 표기 오류");
  if (problem.visual?.first?.join("") !== "♠♥" || problem.visual?.second?.join("") !== "★♥" || problem.visual?.sum?.join("") !== `★★${visible}`) fail("실전 도형 세로셈 화면 구조 오류");
  if (difficulty === 2 && ![0, 2, 4, 6].includes(visible)) fail("실전 4회 15번 원본 구조 오류");
}

function checkPracticeSquareSymbolChain(problem, difficulty) {
  const { rows, given, target, result } = problem.meta;
  const values = { ...given };
  for (const row of rows) {
    const equalIndex = row.indexOf("=");
    const expression = row.slice(0, equalIndex);
    const output = row[equalIndex + 1];
    let value = typeof expression[0] === "number" ? expression[0] : values[expression[0]];
    for (let index = 1; index < expression.length; index += 2) {
      const operator = expression[index];
      const token = expression[index + 1];
      const operand = typeof token === "number" ? token : values[token];
      if (!Number.isFinite(value) || !Number.isFinite(operand)) fail("실전 연속 도형식 계산 순서 오류");
      value = operator === "+" ? value + operand : value - operand;
    }
    if (values[output] != null && values[output] !== value) fail("실전 연속 도형식 주어진 값 불일치");
    values[output] = value;
  }
  if (values[target] !== result || Number(problem.answer) !== result) fail("실전 연속 도형식 답 오류");
  const expectedRows = difficulty === 3 ? 5 : 4;
  if (rows.length !== expectedRows || rows[0].join("") !== "square+square+square=circle") fail("실전 연속 도형식 난이도 구조 오류");
  if (difficulty === 2 && (target !== "star" || Object.keys(given).join(",") !== "square")) fail("실전 4회 16번 원본 구조 오류");
  if (problem.visual?.kind !== "symbol-chain") fail("실전 연속 도형식 화면 연결 오류");
}

function independentlyFindUnusedCards(targets, candidates) {
  const unused = [];
  const search = (targetIndex, remaining) => {
    if (targetIndex === targets.length) {
      if (remaining.length === 1) unused.push(remaining[0]);
      return;
    }
    for (let left = 0; left < remaining.length; left += 1) {
      for (let right = left + 1; right < remaining.length; right += 1) {
        if (remaining[left] + remaining[right] !== targets[targetIndex]) continue;
        search(targetIndex + 1, remaining.filter((_, index) => index !== left && index !== right));
      }
    }
  };
  search(0, candidates);
  return [...new Set(unused)];
}

function checkPracticeUnusedNumberCardEquations(problem, difficulty) {
  const { limit, equationCount, targets, candidates, unusedValues, shownPairs } = problem.meta;
  const expectedCount = difficulty === 1 ? 2 : difficulty === 3 ? 4 : 3;
  if (equationCount !== expectedCount || limit !== expectedCount * 3 + 1 || targets.length !== expectedCount) fail("실전 5회 수 카드 식 난이도 구조 오류");
  const all = [...targets, ...candidates].sort((a, b) => a - b);
  if (all.some((value, index) => value !== index + 1)) fail("실전 5회 수 카드 범위·중복 오류");
  const independent = independentlyFindUnusedCards(targets, candidates);
  if (independent.length !== 1 || unusedValues.join(",") !== independent.join(",") || numericAnswer(problem) !== independent[0]) fail("실전 5회 수 카드 남는 답 유일성 오류");
  if (shownPairs.length !== equationCount || shownPairs.some((pair, index) => pair[0] + pair[1] !== targets[index])) fail("실전 5회 수 카드 보기 풀이 오류");
  if (problem.visual?.kind !== "unused-card-equations") fail("실전 5회 수 카드 식 화면 연결 오류");
}

function independentlySolveLetterCryptarithm(first, second, resultSymbol) {
  const solutions = [];
  for (let A = 0; A <= 9; A += 1) for (let B = 0; B <= 9; B += 1) for (let C = 0; C <= 9; C += 1) {
    if (new Set([A, B, C]).size !== 3) continue;
    const value = { A, B, C };
    if (!value[first[0]] || !value[second[0]] || !value[resultSymbol]) continue;
    const left = 10 * value[first[0]] + value[first[1]] + 10 * value[second[0]] + value[second[1]];
    if (left === 111 * value[resultSymbol]) solutions.push(value);
  }
  return solutions;
}

function checkPracticeTwoDigitLetterCryptarithm(problem, difficulty) {
  const { first, second, resultSymbol, values, valueSum } = problem.meta;
  const solutions = independentlySolveLetterCryptarithm(first, second, resultSymbol);
  if (solutions.length !== 1 || JSON.stringify(solutions[0]) !== JSON.stringify(values)) fail("실전 5회 글자 복면산 단일해 오류");
  if (valueSum !== values.A + values.B + values.C) fail("실전 5회 글자 복면산 합 오류");
  const expected = `A=${values.A}, B=${values.B}, C=${values.C}${difficulty === 3 ? `, 합 ${valueSum}` : ""}`;
  if (problem.answer !== expected || problem.visual?.kind !== "cryptarithm-vertical") fail("실전 5회 글자 복면산 답·화면 오류");
  if (difficulty === 2 && (first.length !== 2 || second.length !== 2 || new Set([...first, ...second, resultSymbol]).size !== 3)) fail("실전 5회 6번 원본 글자 구조 오류");
}

function checkPracticeRecorderMatchstickLength(problem, difficulty) {
  const { pencilUnits, topMatchCount, bottomMatchCount, topPencilCount, bottomPencilCount, answer, rows } = problem.meta;
  const top = topMatchCount + topPencilCount * pencilUnits;
  const bottom = bottomMatchCount + bottomPencilCount * pencilUnits;
  if (top !== bottom || answer !== top || numericAnswer(problem) !== top) fail("실전 5회 리코더 길이 계산 오류");
  if (difficulty === 1 && pencilUnits !== 1) fail("실전 5회 리코더 쉬움 구조 오류");
  if (difficulty === 2 && ![2, 3].includes(pencilUnits)) fail("실전 5회 리코더 같게 구조 오류");
  if (difficulty === 3 && ![3, 4].includes(pencilUnits)) fail("실전 5회 리코더 어려움 구조 오류");
  if (rows.length !== 2 || rows[0].length !== topMatchCount + 1 || rows[1].map((item) => item.kind).join(",") !== "pencil,match,pencil") fail("실전 5회 리코더 그림 구조 오류");
  if (problem.visual?.kind !== "recorder-matchstick-length") fail("실전 5회 리코더 화면 연결 오류");
}

function independentlyTransformCell(cell, index, operation) {
  const row = Math.floor(index / 2);
  const column = index % 2;
  let nextRow = row;
  let nextColumn = column;
  let direction = cell.direction || 0;
  if (operation === "flip-lr") {
    nextColumn = 1 - column;
    direction = (4 - direction) % 4;
  } else if (operation === "flip-tb") {
    nextRow = 1 - row;
    direction = (2 - direction + 4) % 4;
  } else if (operation === "rotate-cw") {
    nextRow = column;
    nextColumn = 1 - row;
    direction = (direction + 1) % 4;
  } else if (operation === "rotate-ccw") {
    nextRow = 1 - column;
    nextColumn = row;
    direction = (direction + 3) % 4;
  }
  return { index: nextRow * 2 + nextColumn, cell: { ...cell, direction } };
}

function checkPracticeShapeRotateFlipGrid(problem, difficulty) {
  const { start, operations, stages, final } = problem.meta;
  let independent = start.map((cell) => ({ ...cell }));
  for (const operation of operations) {
    const next = Array(4);
    independent.forEach((cell, index) => {
      const moved = independentlyTransformCell(cell, index, operation);
      next[moved.index] = moved.cell;
    });
    independent = next;
  }
  if (JSON.stringify(independent) !== JSON.stringify(final) || JSON.stringify(stages.at(-1)) !== JSON.stringify(final)) fail("실전 5회 도형 움직이기 결과 오류");
  if (new Set(start.map((cell) => cell.shape)).size !== 4 || final.some((cell) => !cell)) fail("실전 5회 도형 움직이기 도형 중복·누락 오류");
  const expectedLength = difficulty;
  if (operations.length !== expectedLength) fail("실전 5회 도형 움직이기 난이도 단계 오류");
  if (difficulty === 2 && operations.join(",") !== "flip-lr,rotate-cw") fail("실전 5회 12번 원본 움직임 순서 오류");
  if (problem.visual?.kind !== "shape-transform-grid" || problem.answerVisual?.kind !== "shape-transform-grid") fail("실전 5회 도형 움직이기 화면 연결 오류");
}

function checkPracticeTwoDigitCardThresholdCount(problem, difficulty) {
  const { cards, threshold, numbers, answer } = problem.meta;
  const independent = [];
  for (const tens of cards) for (const ones of cards) {
    if (tens === 0 || tens === ones) continue;
    const value = tens * 10 + ones;
    if (value > threshold) independent.push(value);
  }
  independent.sort((a, b) => a - b);
  const expectedCards = difficulty === 1 ? 4 : difficulty === 3 ? 6 : 5;
  if (cards.length !== expectedCards || new Set(cards).size !== cards.length || !cards.includes(0)) fail("실전 5회 두 자리 카드 구성 오류");
  if (independent.join(",") !== numbers.join(",") || answer !== independent.length || numericAnswer(problem) !== answer) fail("실전 5회 두 자리 카드 개수 오류");
  if (problem.visual?.kind !== "cards") fail("실전 5회 두 자리 카드 화면 연결 오류");
}

function checkPracticeCubeAddToMatch(problem, difficulty) {
  const { map, fullMap, width, depth, height, current, target, need } = problem.meta;
  const independentCurrent = map.flat().reduce((total, value) => total + value, 0);
  const independentTarget = width * depth * height;
  if (map.length !== depth || map.some((row) => row.length !== width || row.some((value) => value < 1 || value > height))) fail("실전 5회 쌓기나무 높이표 오류");
  if (fullMap.some((row) => row.some((value) => value !== height))) fail("실전 5회 완성 정육면체 오류");
  if (current !== independentCurrent || target !== independentTarget || need !== target - current || numericAnswer(problem) !== need) fail("실전 5회 쌓기나무 필요 개수 오류");
  if (difficulty === 2 && (width !== 4 || depth !== 4 || height !== 4 || need < 18 || need > 24)) fail("실전 5회 16번 원본 크기·범위 오류");
  if (/제곱|세제곱/.test(problem.solution) || problem.visual?.kind !== "cube-add-to-match") fail("실전 5회 쌓기나무 학생 풀이·화면 오류");
}

function checkPracticeOverlappingRunSequence(problem, difficulty) {
  const { start, full, items, blanks, answers } = problem.meta;
  const expected = [start, start + 1, start + 2, start + 2, start + 3, start + 4, start + 3, start + 4, start + 5, start + 6, start + 4, start + 5, start + 6];
  if (full.join(",") !== expected.join(",")) fail("실전 5회 연속수 묶음 규칙 오류");
  if (blanks.length !== (difficulty === 3 ? 2 : 1) || blanks.some((index, answerIndex) => answers[answerIndex] !== full[index] || items[index] !== null)) fail("실전 5회 연속수 묶음 빈칸 오류");
  if (problem.answer !== answers.join(", ") || problem.visual?.kind !== "overlapping-run-sequence") fail("실전 5회 연속수 묶음 답·화면 오류");
  if (difficulty === 2 && blanks.join(",") !== "10") fail("실전 5회 18번 원본 빈칸 위치 오류");
}

function checkPracticeAlternatingLineTotal(problem, difficulty) {
  const { firstCount, includeEnds, secondCount, total, line } = problem.meta;
  const expectedSecond = firstCount - 1 + (includeEnds ? 2 : 0);
  if (secondCount !== expectedSecond || total !== firstCount + secondCount || numericAnswer(problem) !== total) fail("실전 5회 번갈아 줄 세우기 계산 오류");
  if (line.filter((item) => item === "boy").length !== firstCount || line.filter((item) => item === "girl").length !== secondCount) fail("실전 5회 번갈아 줄 세우기 그림 수 오류");
  if (line.some((item, index) => index > 0 && item === line[index - 1])) fail("실전 5회 번갈아 줄 세우기 교대 오류");
  if (difficulty === 2 && includeEnds) fail("실전 5회 19번 원본 양 끝 조건 오류");
  if (difficulty === 3 && !includeEnds) fail("실전 5회 줄 세우기 어려움 조건 오류");
  if (problem.visual?.kind !== "alternating-people") fail("실전 5회 줄 세우기 화면 연결 오류");
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.chainedNumberCondition({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution) {
      fail(`조건 수 난이도 ${difficulty} 빈 문제`);
      break;
    }
    if (/undefined|NaN|null/.test(`${problem.prompt} ${problem.answer} ${problem.solution}`)) {
      fail(`조건 수 난이도 ${difficulty} 화면 문자열 오류`);
      break;
    }
    checkChainedNumberCondition(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.maskedVerticalAdditions({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`가려진 세로셈 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkMaskedVerticalAdditions(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.cubeDifferentShape({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`다른 입체 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkCubeDifferentShape(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.givenShapeExpression({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`도형값 혼합식 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkGivenShapeExpression(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.pairedGrowingSequences({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`두 규칙 수열 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPairedGrowingSequences(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.cutReCutPieces({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution) {
      fail(`자르고 다시 자르기 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkCutReCutPieces(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.triangleFanCount({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`삼각형 세기 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkTriangleFanCount(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.reverseOperationLadder({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`사다리 계산 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkReverseOperationLadder(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.plusMinusMultiTarget({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`여러 목표 부호 넣기 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPlusMinusMultiTarget(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.twoCustomOperations({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`두 새 연산 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkTwoCustomOperations(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceThreeFoldHoleCount({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 색종이 접기 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeThreeFoldHoleCount(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceInterleavedPairSequence({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 교대 수열 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeInterleavedPairSequence(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceCalendarWeekdaySum({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 같은 요일 합 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeCalendarWeekdaySum(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceHeightExtremes({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 키 비교 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeHeightExtremes(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceAlignedRodLengths({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 막대 길이 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeAlignedRodLengths(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceTwoFunctionMachines({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 두 수 규칙 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeTwoFunctionMachines(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceVerticalShapeCryptarithm({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 도형 세로셈 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeVerticalShapeCryptarithm(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const difficulty of [1, 2, 3]) {
  for (let run = 0; run < RUNS; run += 1) {
    const problem = GENERATORS.practiceSquareSymbolChain({ difficulty });
    if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual) {
      fail(`실전 연속 도형식 난이도 ${difficulty} 빈 문제`);
      break;
    }
    checkPracticeSquareSymbolChain(problem, difficulty);
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const [generator, label, check] of [
  ["practiceUnusedNumberCardEquations", "남는 수 카드 식", checkPracticeUnusedNumberCardEquations],
  ["practiceTwoDigitLetterCryptarithm", "두 자리 글자 복면산", checkPracticeTwoDigitLetterCryptarithm],
  ["practiceRecorderMatchstickLength", "리코더 성냥개비 길이", checkPracticeRecorderMatchstickLength],
  ["practiceShapeRotateFlipGrid", "도형 뒤집기·돌리기", checkPracticeShapeRotateFlipGrid],
  ["practiceTwoDigitCardThresholdCount", "기준보다 큰 두 자리 수", checkPracticeTwoDigitCardThresholdCount],
  ["practiceCubeAddToMatch", "정육면체까지 더 쌓기", checkPracticeCubeAddToMatch],
  ["practiceOverlappingRunSequence", "겹쳐 이어지는 수열", checkPracticeOverlappingRunSequence],
  ["practiceAlternatingLineTotal", "번갈아 줄 세우기", checkPracticeAlternatingLineTotal]
]) {
  for (const difficulty of [1, 2, 3]) {
    for (let run = 0; run < RUNS; run += 1) {
      const problem = GENERATORS[generator]({ difficulty });
      const visibleText = `${problem?.prompt ?? ""} ${problem?.answer ?? ""} ${problem?.solution ?? ""}`;
      if (!problem?.prompt || problem.answer == null || !problem.solution || !problem.visual) {
        fail(`${label} 난이도 ${difficulty} 빈 문제`);
        break;
      }
      if (/undefined|NaN|null|조합|순열|제곱/.test(visibleText)) {
        fail(`${label} 난이도 ${difficulty} 학생용 문자열 오류`);
        break;
      }
      check(problem, difficulty);
      if (failures.length) break;
    }
    if (failures.length) break;
  }
  if (failures.length) break;
}

function allPermutations(values) {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => allPermutations([...values.slice(0, index), ...values.slice(index + 1)]).map((rest) => [value, ...rest]));
}

function canonicalTetromino2d(cells) {
  const variants = [];
  for (let flip = 0; flip < 2; flip += 1) {
    for (let turn = 0; turn < 4; turn += 1) {
      const transformed = cells.map(([sourceRow, sourceColumn]) => {
        let row = sourceRow;
        let column = flip ? -sourceColumn : sourceColumn;
        for (let step = 0; step < turn; step += 1) [row, column] = [column, -row];
        return [row, column];
      });
      const minRow = Math.min(...transformed.map(([row]) => row));
      const minColumn = Math.min(...transformed.map(([, column]) => column));
      variants.push(transformed.map(([row, column]) => [row - minRow, column - minColumn]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((cell) => cell.join(",")).join(";"));
    }
  }
  return variants.sort()[0];
}

function auditTetromino(mask) {
  const cells = Array.from({ length: 16 }, (_, index) => index).filter((index) => mask & (1 << index));
  if (cells.length !== 4) return null;
  const pending = new Set(cells);
  const queue = [cells[0]];
  pending.delete(cells[0]);
  while (queue.length) {
    const current = queue.shift();
    const row = Math.floor(current / 4);
    const column = current % 4;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nextRow = row + dr;
      const nextColumn = column + dc;
      const next = nextRow * 4 + nextColumn;
      if (nextRow >= 0 && nextRow < 4 && nextColumn >= 0 && nextColumn < 4 && pending.delete(next)) queue.push(next);
    }
  }
  if (pending.size) return null;
  return { mask, cells, shape: canonicalTetromino2d(cells.map((index) => [Math.floor(index / 4), index % 4])) };
}

function buildAuditCongruentPartitions() {
  const pieces = [];
  for (let mask = 0; mask < (1 << 16); mask += 1) {
    const piece = auditTetromino(mask);
    if (piece) pieces.push(piece);
  }
  const found = new Map();
  const cover = (remaining, groups, shape) => {
    if (!remaining) {
      const sorted = [...groups].sort((a, b) => a.mask - b.mask);
      found.set(sorted.map((group) => group.mask).join(","), sorted.map((group) => group.cells));
      return;
    }
    const first = Array.from({ length: 16 }, (_, index) => index).find((index) => remaining & (1 << index));
    for (const piece of pieces) {
      if (!(piece.mask & (1 << first)) || (piece.mask & remaining) !== piece.mask || (shape && piece.shape !== shape)) continue;
      cover(remaining ^ piece.mask, [...groups, piece], shape || piece.shape);
    }
  };
  cover((1 << 16) - 1, [], null);
  return [...found.values()];
}

const AUDIT_CONGRUENT_PARTITIONS = buildAuditCongruentPartitions();
const AUDIT_LO_SHU = (() => {
  const base = [8, 1, 6, 3, 5, 7, 4, 9, 2];
  const grids = [];
  for (let flip = 0; flip < 2; flip += 1) {
    for (let turns = 0; turns < 4; turns += 1) {
      const output = Array(9);
      base.forEach((value, index) => {
        let row = Math.floor(index / 3);
        let column = index % 3;
        if (flip) column = 2 - column;
        for (let turn = 0; turn < turns; turn += 1) [row, column] = [column, 2 - row];
        output[row * 3 + column] = value;
      });
      grids.push(output);
    }
  }
  return [...new Map(grids.map((grid) => [grid.join(","), grid])).values()];
})();
const AUDIT_SEVEN_PERMUTATIONS = allPermutations([1, 2, 3, 4, 5, 6, 7]);

function checkMock06(problem, generator) {
  const meta = problem.meta;
  if (generator === "practiceCongruentEqualSumPartition") {
    const covered = meta.groups.flat().sort((a, b) => a - b);
    const shapes = meta.groups.map((group) => canonicalTetromino2d(group.map((index) => [Math.floor(index / 4), index % 4])));
    const sums = meta.groups.map((group) => group.reduce((total, index) => total + meta.values[index], 0));
    const independent = AUDIT_CONGRUENT_PARTITIONS.filter((groups) => new Set(groups.map((group) => group.reduce((total, index) => total + meta.values[index], 0))).size === 1);
    if (covered.join(",") !== Array.from({ length: 16 }, (_, index) => index).join(",") || new Set(shapes).size !== 1 || new Set(sums).size !== 1 || sums[0] !== meta.target || independent.length !== 1 || meta.solutionCount !== 1) fail("실전 6회 합동 분할 유일성 오류");
    return;
  }
  if (generator === "practiceTwoMagicColoredSums") {
    const values = [];
    for (const square of meta.squares) {
      const grid = square.solution;
      const lineSums = [0, 1, 2].flatMap((row) => [grid.slice(row * 3, row * 3 + 3).reduce((a, b) => a + b, 0), grid[row] + grid[row + 3] + grid[row + 6]]);
      lineSums.push(grid[0] + grid[4] + grid[8], grid[2] + grid[4] + grid[6]);
      const candidates = AUDIT_LO_SHU.filter((candidate) => square.shown.every((shown, index) => shown == null || candidate[index] === shown));
      if ([...grid].sort((a, b) => a - b).join(",") !== "1,2,3,4,5,6,7,8,9" || lineSums.some((sum) => sum !== 15) || candidates.length !== 1 || candidates[0][square.target] !== grid[square.target]) fail("실전 6회 두 마방진 오류");
      values.push(grid[square.target]);
    }
    if (numericAnswer(problem) !== values[0] + values[1]) fail("실전 6회 두 마방진 합 오류");
    return;
  }
  if (generator === "practiceDistinctZeroOneShapeValues") {
    const { values, roles, base } = meta;
    if (new Set(Object.values(values)).size !== 4 || values[roles.zero] !== 0 || values[roles.one] !== 1 || values[roles.root] !== base || values[roles.same] !== base * base) fail("실전 6회 0·1 도형값 오류");
    return;
  }
  if (generator === "practiceShapeValueMatrix") {
    const { values, layout, rowSums, columnSums } = meta;
    const rows = layout.map((row) => row.reduce((sum, symbol) => sum + values[symbol], 0));
    const columns = [0, 1, 2, 3].map((column) => layout.reduce((sum, row) => sum + values[row[column]], 0));
    const square = columnSums[0] / 4;
    const triangle = (rowSums[3] - square) / 3;
    const star = rowSums[1] - rowSums[2] + triangle;
    const diamond = rowSums[2] - square - star - triangle;
    const circle = (rowSums[0] - square - diamond) / 2;
    if (rows.join(",") !== rowSums.join(",") || columns.join(",") !== columnSums.join(",") || [triangle, circle, diamond, square, star].join(",") !== [values.triangle, values.circle, values.diamond, values.square, values.star].join(",") || new Set(Object.values(values)).size !== 5) fail("실전 6회 도형 매트릭스 오류");
    return;
  }
  if (generator === "practiceRepeatedTwoDigitShapeAddition") {
    const { values, tens, ones, hundreds, relationCount, addendCount, addend, total } = meta;
    if (values[tens] * relationCount !== values[ones] || addend !== values[tens] * 10 + values[ones] || total !== values[hundreds] * 10 + values[tens] || addend * addendCount !== total || new Set(Object.values(values)).size !== 3) fail("실전 6회 반복 두 자리 도형식 오류");
    return;
  }
  if (generator === "practiceFivePersonPhotoLine") {
    const [first, second, middle, fourth, rightmost] = meta.order;
    const candidates = allPermutations(meta.order).filter((order) => order.indexOf(second) === order.indexOf(first) + 1 && order.indexOf(rightmost) === 4 && order.indexOf(fourth) - order.indexOf(first) === 3);
    if (candidates.length !== 1 || candidates[0][2] !== middle || problem.answer !== meta.order.join(" - ")) fail("실전 6회 사진 줄 순서 유일성 오류");
    return;
  }
  if (generator === "practiceFoodPreferenceLogic") {
    const { people, foods, assignments, roles } = meta;
    const candidates = allPermutations(foods).map((ordered) => Object.fromEntries(people.map((person, index) => [person, ordered[index]]))).filter((candidate) => candidate[roles.hotPerson] === assignments[roles.hotPerson] && candidate[roles.dislikedFoodPerson] === assignments[roles.dislikedFoodPerson] && candidate[roles.referencePerson] !== assignments[roles.dislikedFoodPerson] && candidate[roles.friendPerson] !== assignments[roles.dislikedFoodPerson] && candidate[roles.referencePerson] !== assignments[roles.friendPerson]);
    if (candidates.length !== 1 || people.some((person) => candidates[0][person] !== assignments[person])) fail("실전 6회 음식 논리 유일성 오류");
    return;
  }
  if (generator === "practiceRelativeNumberGridNine") {
    const source = [7, 4, 1, 6, 5, 9, 3, 8, 2];
    const expected = source.map((value) => meta.mapped[value - 1]);
    if ([...meta.mapped].sort((a, b) => a - b).join(",") !== "1,2,3,4,5,6,7,8,9" || expected.join(",") !== meta.grid.join(",") || new Set(meta.grid).size !== 9) fail("실전 6회 1~9 상대 위치 오류");
    return;
  }
  if (generator === "practiceThreeFoldLineUnfold") {
    const expected = [meta.position / 2, 1 - meta.position / 2].sort((a, b) => a - b);
    if (meta.foldCount !== 3 || meta.answerLineCount !== 4 || meta.vertical.join(",") !== expected.join(",") || meta.horizontal.join(",") !== expected.join(",")) fail("실전 6회 세 번 접은 선 펼치기 오류");
    return;
  }
  if (generator === "practiceDirectionalTriangleSums") {
    const sums = (values) => {
      const rows = [0, 0, 0]; const columns = [0, 0, 0];
      meta.activeCells.forEach(([row, column], index) => { rows[row] += values[index]; columns[column] += values[index]; });
      return { rows, columns };
    };
    const candidates = AUDIT_SEVEN_PERMUTATIONS.filter((values) => {
      if (meta.given && values[meta.given.index] !== meta.given.value) return false;
      const result = sums(values);
      return result.rows.join(",") === meta.rowSums.join(",") && result.columns.join(",") === meta.columnSums.join(",");
    });
    if (candidates.length !== 1 || candidates[0].join(",") !== meta.values.join(",") || meta.solutionCount !== 1) fail("실전 6회 방향 합 수 배치 유일성 오류");
    return;
  }
  if (generator === "practiceTwoClassTotalDifference") {
    if (meta.larger + meta.smaller !== meta.total || meta.larger - meta.smaller !== meta.difference || numericAnswer(problem) !== meta.larger) fail("실전 6회 두 반 전체·차 오류");
    return;
  }
  if (generator === "practiceNumberBallPairTargets") {
    for (const row of meta.rows) {
      const representations = [];
      for (let left = 0; left < meta.cards.length; left += 1) for (let right = left + 1; right < meta.cards.length; right += 1) {
        const a = meta.cards[left]; const b = meta.cards[right];
        if (a + b === row.target) representations.push(`${Math.min(a, b)}+${Math.max(a, b)}`);
        if (Math.abs(a - b) === row.target) representations.push(`${Math.max(a, b)}-${Math.min(a, b)}`);
      }
      const expression = row.operator === "+" ? row.left + row.right : row.left - row.right;
      if (representations.length !== 1 || expression !== row.target) fail("실전 6회 수 공 목표식 유일성 오류");
    }
    return;
  }
  if (generator === "practiceDiagonalDifferenceSquare") {
    for (const entry of [...meta.examples, meta.target]) if (Math.abs(entry.corners[0] + entry.corners[3] - entry.corners[1] - entry.corners[2]) !== entry.result) fail("실전 6회 대각선 합 차 규칙 오류");
    if (numericAnswer(problem) !== meta.target.result) fail("실전 6회 대각선 합 차 답 오류");
    return;
  }
  if (generator === "practiceThreePersonBookChain") {
    if (meta.a + meta.addToA !== meta.targetA || meta.a + meta.moreForB !== meta.b || meta.b / 2 + meta.extraForC !== meta.c || !problem.answer.includes(`A ${meta.a}권`) || !problem.answer.includes(`B ${meta.b}권`) || !problem.answer.includes(`C ${meta.c}권`)) fail("실전 6회 읽은 책 수 조건 오류");
    return;
  }
  if (generator === "practiceGridColorCountSequence") {
    const sourceCounts = [1, 2, 3, 4, 5, 6, 9];
    if (meta.panels.length !== 7 || meta.panels.some((cells, index) => cells.length !== sourceCounts[index] || new Set(cells).size !== cells.length || cells.some((cell) => cell < 0 || cell > 8)) || meta.answerCells.join(",") !== meta.panels[meta.missing].join(",") || meta.answerCount !== sourceCounts[meta.missing]) fail("실전 6회 3×3 색칠 규칙 오류");
  }
}

const MOCK06_GENERATOR_CHECKS = [
  "practiceCongruentEqualSumPartition", "practiceTwoMagicColoredSums", "practiceDistinctZeroOneShapeValues",
  "practiceShapeValueMatrix", "practiceRepeatedTwoDigitShapeAddition", "practiceFivePersonPhotoLine",
  "practiceFoodPreferenceLogic", "practiceRelativeNumberGridNine", "practiceThreeFoldLineUnfold",
  "practiceDirectionalTriangleSums", "practiceTwoClassTotalDifference", "practiceNumberBallPairTargets",
  "practiceDiagonalDifferenceSquare", "practiceThreePersonBookChain", "practiceGridColorCountSequence"
];

for (const generator of MOCK06_GENERATOR_CHECKS) {
  for (const difficulty of [1, 2, 3]) {
    for (let run = 0; run < RUNS; run += 1) {
      const problem = GENERATORS[generator]?.({ difficulty });
      const visibleText = `${problem?.prompt ?? ""} ${problem?.answer ?? ""} ${problem?.solution ?? ""}`;
      const particleText = `${visibleText} ${JSON.stringify(problem?.visual ?? {})}`;
      if (!problem?.prompt || problem.answer == null || !problem.solution || !problem.visual) {
        fail(`${generator} 난이도 ${difficulty} 빈 문제`);
        break;
      }
      if (/undefined|NaN|null|조합|순열|제곱|\b(circle|triangle|square|star|diamond)\b/.test(visibleText)) {
        fail(`${generator} 난이도 ${difficulty} 학생용 문자열 오류`);
        break;
      }
      checkMock06Particles(particleText, generator, difficulty);
      if (failures.length) break;
      checkMock06(problem, generator);
      if (failures.length) break;
    }
    if (failures.length) break;
  }
  if (failures.length) break;
}

for (const [examId, number] of [["mock-3", 3]]) {
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === examId);
  const question = exam?.questions.find((item) => item.number === number);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "chained-number-condition" || !question.verified || !type?.sourceMatched || type.generator !== "chainedNumberCondition") {
    fail(`${examId} ${number}번 연결 오류`);
  }
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 4);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "cube-different-shape" || !question.verified || !type?.sourceMatched || type.generator !== "cubeDifferentShape") fail("mock-3 4번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 6);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "vertical-addition" || !question.verified || !type?.sourceMatched || type.generator !== "maskedVerticalAdditions") fail("mock-3 6번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 8);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "given-shape-expression" || !question.verified || !type?.sourceMatched || type.generator !== "givenShapeExpression") fail("mock-3 8번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 9);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "paired-growing-sequences" || !question.verified || !type?.sourceMatched || type.generator !== "pairedGrowingSequences") fail("mock-3 9번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 10);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "cut-recut-pieces" || !question.verified || !type?.sourceMatched || type.generator !== "cutReCutPieces") fail("mock-3 10번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 12);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "triangle-count" || !question.verified || !type?.sourceMatched || type.generator !== "triangleFanCount") fail("mock-3 12번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 13);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "reverse-operation-ladder" || !question.verified || !type?.sourceMatched || type.generator !== "reverseOperationLadder") fail("mock-3 13번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 14);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "plus-minus-multi-target" || !question.verified || !type?.sourceMatched || type.generator !== "plusMinusMultiTarget") fail("mock-3 14번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 15);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "two-custom-operations" || !question.verified || !type?.sourceMatched || type.generator !== "twoCustomOperations") fail("mock-3 15번 연결 오류");
}

{
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-3");
  const question = exam?.questions.find((item) => item.number === 16);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== "practice-three-fold-hole-count" || !question.verified || !type?.sourceMatched || type.generator !== "practiceThreeFoldHoleCount") fail("mock-3 16번 연결 오류");
}

for (const [number, typeId, generator] of [
  [2, "aligned-rod-common-length", "practiceAlignedRodLengths"],
  [9, "interleaved-pair-sequence", "practiceInterleavedPairSequence"],
  [10, "two-function-machine-chain", "practiceTwoFunctionMachines"],
  [13, "calendar-all-weekday-sum", "practiceCalendarWeekdaySum"],
  [15, "vertical-shape-cryptarithm-values", "practiceVerticalShapeCryptarithm"],
  [16, "square-symbol-chain", "practiceSquareSymbolChain"],
  [19, "height-extremes-chain", "practiceHeightExtremes"]
]) {
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-4");
  const question = exam?.questions.find((item) => item.number === number);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== typeId || !question.verified || !type?.sourceMatched || type.generator !== generator) fail(`mock-4 ${number}번 연결 오류`);
}

for (const [number, typeId, generator] of [
  [3, "unused-number-card-equations", "practiceUnusedNumberCardEquations"],
  [6, "two-digit-letter-cryptarithm", "practiceTwoDigitLetterCryptarithm"],
  [10, "recorder-matchstick-length", "practiceRecorderMatchstickLength"],
  [12, "shape-rotate-flip-grid", "practiceShapeRotateFlipGrid"],
  [15, "two-digit-card-threshold-count", "practiceTwoDigitCardThresholdCount"],
  [16, "cube-add-to-match", "practiceCubeAddToMatch"],
  [18, "overlapping-run-sequence", "practiceOverlappingRunSequence"],
  [19, "alternating-line-total", "practiceAlternatingLineTotal"]
]) {
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-5");
  const question = exam?.questions.find((item) => item.number === number);
  const type = byId.get(question?.typeId);
  if (question?.typeId !== typeId || !question.verified || !type?.sourceMatched || type.generator !== generator) fail(`mock-5 ${number}번 연결 오류`);
}

for (const [number, typeId, generator, worksheetCode] of [
  [1, "congruent-equal-sum-partition-draw", "practiceCongruentEqualSumPartition"],
  [2, "paired-magic-square-colored-sum", "practiceTwoMagicColoredSums"],
  [3, "triangle-max-edge-sum", "triangleMaxEdgeSum"],
  [4, "distinct-zero-one-shape-values", "practiceDistinctZeroOneShapeValues"],
  [5, "shape-value-matrix-all", "practiceShapeValueMatrix"],
  [6, "repeated-two-digit-shape-addition", "practiceRepeatedTwoDigitShapeAddition"],
  [7, "five-person-photo-order", "practiceFivePersonPhotoLine"],
  [8, "food-preference-logic-four", "practiceFoodPreferenceLogic"],
  [9, "relative-position-number-grid-nine", "practiceRelativeNumberGridNine"],
  [10, "three-fold-line-unfold", "practiceThreeFoldLineUnfold"],
  [11, "cube-fill-box", "cubeFillBoxWorksheet"],
  [12, "directional-triangle-sum-grid", "practiceDirectionalTriangleSums"],
  [13, "sudoku-four-square-region", "sudokuFourSquareRegion"],
  [14, "two-class-total-difference", "practiceTwoClassTotalDifference"],
  [15, "set-union-count", "setUnionCount"],
  [16, "number-ball-pair-targets", "practiceNumberBallPairTargets"],
  [17, "diagonal-sum-difference-square", "practiceDiagonalDifferenceSquare"],
  [18, "three-person-book-chain", "practiceThreePersonBookChain"],
  [19, "cube-hidden-count", null, "IN"],
  [20, "grid-color-count-sequence", "practiceGridColorCountSequence"]
]) {
  const exam = PRACTICE_EXAM_TYPES.find((item) => item.id === "mock-6");
  const question = exam?.questions.find((item) => item.number === number);
  const type = byId.get(question?.typeId);
  const engineMatches = generator ? type?.generator === generator : type?.worksheetCode === worksheetCode;
  if (question?.typeId !== typeId || !question.verified || !type?.sourceMatched || !engineMatches) fail(`mock-6 ${number}번 연결 오류`);
}

try {
  const sandbox = { window: {} };
  const answerDataUrl = new URL("../mock/answer-data.js", import.meta.url);
  runInNewContext(readFileSync(answerDataUrl, "utf8"), sandbox);
  const answerData = sandbox.window.FIELDS_MOCK_ANSWERS;
  for (let round = 1; round <= 6; round += 1) {
    const exam = answerData?.[`mock-${round}`];
    const numbers = exam?.questions?.map((question) => question.no) || [];
    if (numbers.length !== 20 || numbers.join(",") !== Array.from({ length: 20 }, (_, index) => index + 1).join(",")) {
      fail(`실전 ${round}회 답안 20문항 등록 오류`);
      continue;
    }
    for (const question of exam.questions) {
      if (!byId.has(question.typeId) || !question.domain || !question.middle || !question.type || !question.answer || !question.note) {
        fail(`실전 ${round}회 ${question.no}번 답안 메타데이터 오류`);
        break;
      }
    }
  }
} catch (error) {
  fail(`모의고사 답안 데이터 실행 오류: ${error.message}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`실전 모의고사 문제은행 검산 완료: 기존 생성기 26종과 실전 6회 전용 생성기 15종을 난이도별 ${RUNS}회씩 검산, 원본 46문항 연결 정상`);
