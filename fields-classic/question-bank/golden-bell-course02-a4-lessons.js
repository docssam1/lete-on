const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const gcdAll = (values) => values.reduce(gcd);
const lcmAll = (values) => values.reduce(lcm);
const MAGIC_LINES = Object.freeze([
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]);

function requireInteger(value, label, minimum = Number.NEGATIVE_INFINITY) {
  if (!Number.isInteger(value) || value < minimum) throw new RangeError(`${label} must be an integer >= ${minimum}`);
  return value;
}

function requireIntegerList(values, label, minimumLength = 1) {
  if (!Array.isArray(values) || values.length < minimumLength) throw new RangeError(`${label} must contain at least ${minimumLength} integers`);
  values.forEach((value, index) => requireInteger(value, `${label}[${index}]`));
  return values;
}

function permutations(values) {
  if (!values.length) return [[]];
  return values.flatMap((value, index) => permutations(values.filter((_, itemIndex) => itemIndex !== index)).map((rest) => [value, ...rest]));
}

function wordValue(word, mapping) {
  return [...word].reduce((value, character) => value * 10 + (/[A-Z]/.test(character) ? mapping[character] : Number(character)), 0);
}

function solveLetters(words, predicate) {
  const letters = [...new Set(words.join("").match(/[A-Z]/g) || [])].sort();
  if (!letters.length || letters.length > 7) throw new RangeError("alphametic must contain 1 to 7 letters");
  const leading = new Set(words.filter((word) => word.length > 1 && /[A-Z]/.test(word[0])).map((word) => word[0]));
  const solutions = [];
  const mapping = {};
  const used = new Set();
  const visit = (index) => {
    if (index === letters.length) {
      const values = words.map((word) => wordValue(word, mapping));
      if (predicate(values)) solutions.push({ mapping: { ...mapping }, values });
      return;
    }
    const letter = letters[index];
    for (let digit = 0; digit <= 9; digit += 1) {
      if (used.has(digit) || (digit === 0 && leading.has(letter))) continue;
      mapping[letter] = digit;
      used.add(digit);
      visit(index + 1);
      used.delete(digit);
      delete mapping[letter];
    }
  };
  visit(0);
  return solutions;
}

function mappingText(mapping) {
  return Object.keys(mapping).sort().map((letter) => `${letter}=${mapping[letter]}`).join(", ");
}

function applyOperation(left, operation, right) {
  if (operation === "+") return left + right;
  if (operation === "-") return left - right;
  if (operation === "×") return left * right;
  throw new RangeError(`unsupported operation: ${operation}`);
}

function addFraction(aNumerator, aDenominator, bNumerator, bDenominator) {
  const denominator = lcm(aDenominator, bDenominator);
  const numerator = aNumerator * denominator / aDenominator + bNumerator * denominator / bDenominator;
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

function unitFractionSets(targetNumerator, targetDenominator, termCount, maxDenominator) {
  requireInteger(targetNumerator, "targetNumerator", 1);
  requireInteger(targetDenominator, "targetDenominator", 2);
  requireInteger(termCount, "termCount", 2);
  requireInteger(maxDenominator, "maxDenominator", termCount + 1);
  const targetDivisor = gcd(targetNumerator, targetDenominator);
  const target = [targetNumerator / targetDivisor, targetDenominator / targetDivisor];
  const answers = [];
  const visit = (start, picked, numerator, denominator) => {
    if (picked.length === termCount) {
      if (numerator === target[0] && denominator === target[1]) answers.push([...picked]);
      return;
    }
    for (let value = start; value <= maxDenominator; value += 1) {
      const [nextNumerator, nextDenominator] = addFraction(numerator, denominator, 1, value);
      if (nextNumerator * target[1] > target[0] * nextDenominator) continue;
      visit(value + 1, [...picked, value], nextNumerator, nextDenominator);
    }
  };
  visit(2, [], 0, 1);
  return answers;
}

function resultContractFor(task) {
  if (["formation-line-sums", "unit-fraction-sets"].includes(task)) {
    return { type: "set", order: "ascending", separator: "; " };
  }
  if (["operation-matrix", "consecutive-conditions", "gcd-lcm-relation", "linear-pair", "heads-legs"].includes(task)) {
    return { type: "ordered", separator: ", " };
  }
  if (task === "balance-ratio") return { type: "ratio", separator: ":" };
  return { type: "single-value" };
}

export function course02A4Model(visual) {
  if (!visual || visual.kind !== "course02-a4") throw new TypeError("A course02 A4 visual is required");
  switch (visual.task) {
    case "magic-line-sum": {
      const values = requireIntegerList(visual.values, "values", 9);
      if (values.length !== 9 || new Set(values).size !== 9) throw new RangeError("magic-line-sum requires 9 distinct values");
      const sorted = [...values].sort((a, b) => a - b);
      const step = sorted[1] - sorted[0];
      if (step <= 0 || !sorted.every((value, index) => index === 0 || value - sorted[index - 1] === step)) {
        throw new RangeError("magic-line-sum values must form a nine-term arithmetic progression");
      }
      const total = values.reduce((sum, value) => sum + value, 0);
      if (total % 3 !== 0) throw new RangeError("the nine values do not determine an integer line sum");
      return { total, answer: total / 3, resultContract: resultContractFor(visual.task) };
    }
    case "magic-missing": {
      if (!Array.isArray(visual.cells) || visual.cells.length !== 9) throw new RangeError("magic-missing requires 9 cells");
      const blanks = visual.cells.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
      if (blanks.length !== 1) throw new RangeError("magic-missing requires exactly one blank");
      requireInteger(visual.target, "target");
      visual.cells.forEach((value, index) => { if (value != null) requireInteger(value, `cells[${index}]`); });
      const blank = blanks[0];
      const candidates = MAGIC_LINES.filter((line) => line.includes(blank)).map((line) => visual.target - line.filter((index) => index !== blank).reduce((sum, index) => sum + visual.cells[index], 0));
      if (!candidates.length || new Set(candidates).size !== 1) throw new RangeError("the blank is not uniquely constrained");
      const answer = candidates[0];
      const completed = visual.cells.map((value) => value == null ? answer : value);
      if (new Set(completed).size !== 9 || !MAGIC_LINES.every((line) => line.reduce((sum, index) => sum + completed[index], 0) === visual.target)) {
        throw new RangeError("the completed square does not satisfy every line exactly once");
      }
      return { completed, blank, answer, resultContract: resultContractFor(visual.task) };
    }
    case "formation-line-sums": {
      const values = requireIntegerList(visual.values, "values", 6);
      if (values.length !== 6 || new Set(values).size !== values.length) throw new RangeError("formation values must be 6 distinct integers");
      if (!Array.isArray(visual.lines) || visual.lines.length < 3 || visual.lines.some((line) => !Array.isArray(line) || line.length < 2)) {
        throw new RangeError("formation requires at least three valid lines");
      }
      const targets = new Set();
      for (const arrangement of permutations(values)) {
        const sums = visual.lines.map((line) => line.reduce((sum, index) => {
          if (!Number.isInteger(index) || index < 0 || index >= arrangement.length) throw new RangeError("formation line index is out of range");
          return sum + arrangement[index];
        }, 0));
        if (sums.every((sum) => sum === sums[0])) targets.add(sums[0]);
      }
      const answerValues = [...targets].sort((a, b) => a - b);
      if (!answerValues.length) throw new RangeError("formation has no valid arrangement");
      return { answerValues, answer: answerValues.join("; "), resultContract: resultContractFor(visual.task) };
    }
    case "alphametic-addition": {
      if (!Array.isArray(visual.addends) || visual.addends.length < 2 || !visual.addends.every((word) => /^[A-Z0-9]+$/.test(word)) || !/^[A-Z0-9]+$/.test(visual.result)) {
        throw new RangeError("invalid addition alphametic");
      }
      const words = [...visual.addends, visual.result];
      const solutions = solveLetters(words, (values) => values.slice(0, -1).reduce((sum, value) => sum + value, 0) === values.at(-1));
      if (solutions.length !== 1) throw new RangeError(`addition alphametic must have one solution; found ${solutions.length}`);
      const { mapping, values } = solutions[0];
      const answer = visual.askLetter ? mapping[visual.askLetter] : mappingText(mapping);
      if (answer == null) throw new RangeError("asked letter is not part of the alphametic");
      return { mapping, values, answer, resultContract: resultContractFor(visual.task) };
    }
    case "alphametic-multiplication": {
      const words = [visual.factor, visual.multiplier, visual.result];
      if (!words.every((word) => typeof word === "string" && /^[A-Z0-9]+$/.test(word))) throw new RangeError("invalid multiplication alphametic");
      const solutions = solveLetters(words, ([factor, multiplier, result]) => factor * multiplier === result);
      if (solutions.length !== 1) throw new RangeError(`multiplication alphametic must have one solution; found ${solutions.length}`);
      const { mapping, values } = solutions[0];
      const answer = visual.askLetter ? mapping[visual.askLetter] : mappingText(mapping);
      if (answer == null) throw new RangeError("asked letter is not part of the alphametic");
      return { mapping, values, answer, resultContract: resultContractFor(visual.task) };
    }
    case "operation-matrix": {
      const digits = requireIntegerList(visual.digits, "digits", 4);
      if (digits.length !== 4 || new Set(digits).size !== 4) throw new RangeError("operation matrix requires 4 distinct digits");
      if (![visual.rowOps, visual.colOps, visual.rowTargets, visual.colTargets].every((values) => Array.isArray(values) && values.length === 2)) {
        throw new RangeError("operation matrix requires two row and two column conditions");
      }
      const solutions = permutations(digits).filter((cells) =>
        applyOperation(cells[0], visual.rowOps[0], cells[1]) === visual.rowTargets[0] &&
        applyOperation(cells[2], visual.rowOps[1], cells[3]) === visual.rowTargets[1] &&
        applyOperation(cells[0], visual.colOps[0], cells[2]) === visual.colTargets[0] &&
        applyOperation(cells[1], visual.colOps[1], cells[3]) === visual.colTargets[1]
      );
      if (solutions.length !== 1) throw new RangeError(`operation matrix must have one arrangement; found ${solutions.length}`);
      return { cells: solutions[0], answer: `${solutions[0][0]}, ${solutions[0][1]} / ${solutions[0][2]}, ${solutions[0][3]}`, resultContract: resultContractFor(visual.task) };
    }
    case "gcd-pack": {
      const values = requireIntegerList(visual.values, "values", 2);
      if (values.some((value) => value <= 0)) throw new RangeError("gcd values must be positive");
      return { answer: gcdAll(values), resultContract: resultContractFor(visual.task) };
    }
    case "unit-fraction-sets": {
      const sets = unitFractionSets(visual.targetNumerator, visual.targetDenominator, visual.termCount, visual.maxDenominator);
      if (!sets.length) throw new RangeError("unit-fraction task has no answer set");
      const answerValues = sets.map((denominators) => denominators.map((denominator) => `1/${denominator}`).join("+"));
      return { sets, answerValues, answer: answerValues.join("; "), resultContract: resultContractFor(visual.task) };
    }
    case "lcm-cycle": {
      const periods = requireIntegerList(visual.periods, "periods", 2);
      if (periods.some((value) => value <= 0)) throw new RangeError("periods must be positive");
      return { answer: lcmAll(periods), resultContract: resultContractFor(visual.task) };
    }
    case "consecutive-conditions": {
      const divisors = requireIntegerList(visual.divisors, "divisors", 2);
      const limit = requireInteger(visual.limit ?? 100000, "limit", 1);
      if (divisors.some((value) => value <= 1)) throw new RangeError("consecutive divisors must exceed 1");
      const starts = [];
      for (let start = 1; start <= limit; start += 1) {
        if (divisors.every((divisor, index) => (start + index) % divisor === 0)) starts.push(start);
        if (starts.length === 2) break;
      }
      if (!starts.length) throw new RangeError("no consecutive sequence found within limit");
      const numbers = divisors.map((_, index) => starts[0] + index);
      return { numbers, answer: numbers.join(", "), resultContract: { type: "ordered", separator: ", " } };
    }
    case "gcd-lcm-relation": {
      const [leftRaw, rightRaw] = requireIntegerList(visual.ratio, "ratio", 2);
      if (leftRaw <= 0 || rightRaw <= 0 || visual.ratio.length !== 2) throw new RangeError("ratio must have two positive terms");
      const divisor = gcd(leftRaw, rightRaw);
      const left = leftRaw / divisor;
      const right = rightRaw / divisor;
      let common;
      if (visual.gcd != null) common = requireInteger(visual.gcd, "gcd", 1);
      else if (visual.lcm != null) {
        const givenLcm = requireInteger(visual.lcm, "lcm", 1);
        if (givenLcm % (left * right) !== 0) throw new RangeError("lcm is incompatible with the reduced ratio");
        common = givenLcm / (left * right);
      } else throw new RangeError("gcd or lcm is required");
      const numbers = [left * common, right * common];
      return { numbers, gcd: common, lcm: left * right * common, answer: numbers.join(", "), resultContract: resultContractFor(visual.task) };
    }
    case "balance-ratio": {
      const aCount = requireInteger(visual.aCount, "aCount", 1);
      const bCount = requireInteger(visual.bCount, "bCount", 1);
      const divisor = gcd(aCount, bCount);
      const ratio = [bCount / divisor, aCount / divisor];
      return { ratio, answer: ratio.join(":"), resultContract: resultContractFor(visual.task) };
    }
    case "linear-pair": {
      const coefficients = [visual.a, visual.b, visual.c, visual.d, visual.firstTotal, visual.secondTotal];
      coefficients.forEach((value, index) => requireInteger(value, `coefficient[${index}]`));
      const determinant = visual.a * visual.d - visual.b * visual.c;
      if (determinant === 0) throw new RangeError("linear equations do not determine one pair");
      const first = (visual.firstTotal * visual.d - visual.b * visual.secondTotal) / determinant;
      const second = (visual.a * visual.secondTotal - visual.firstTotal * visual.c) / determinant;
      if (!Number.isInteger(first) || !Number.isInteger(second) || first < 0 || second < 0) throw new RangeError("linear equations do not have a nonnegative integer pair");
      if (visual.a * first + visual.b * second !== visual.firstTotal || visual.c * first + visual.d * second !== visual.secondTotal) throw new RangeError("linear pair verification failed");
      return { values: [first, second], answer: `${first}, ${second}`, resultContract: resultContractFor(visual.task) };
    }
    case "heads-legs": {
      const total = requireInteger(visual.total, "total", 1);
      const measure = requireInteger(visual.measure, "measure", 1);
      const firstUnits = requireInteger(visual.firstUnits, "firstUnits", 1);
      const secondUnits = requireInteger(visual.secondUnits, "secondUnits", 1);
      if (firstUnits === secondUnits) throw new RangeError("the two categories need different unit counts");
      const first = (measure - secondUnits * total) / (firstUnits - secondUnits);
      const second = total - first;
      if (!Number.isInteger(first) || !Number.isInteger(second) || first < 0 || second < 0) throw new RangeError("heads-and-legs conditions do not have one nonnegative integer pair");
      if (first + second !== total || first * firstUnits + second * secondUnits !== measure) throw new RangeError("heads-and-legs verification failed");
      return { values: [first, second], answer: `${first}, ${second}`, resultContract: resultContractFor(visual.task) };
    }
    default: throw new RangeError(`Unknown course02 A4 task: ${visual.task}`);
  }
}

const visual = (task, values, phase = "problem") => ({ kind: "course02-a4", task, ...values, phase });
const withPhase = (base, phase) => ({ ...base, phase });
const formationLines = [[0, 1, 2], [2, 3, 4], [4, 5, 0]];

function promptFor(data) {
  switch (data.task) {
    case "magic-line-sum": return `${data.values.join(", ")}을 한 번씩 쓰는 3×3 마방진의 한 줄의 합을 구하세요.`;
    case "magic-missing": return `가로·세로·대각선의 합이 모두 ${data.target}인 마방진의 빈칸 수를 구하세요.`;
    case "formation-line-sums": return `${data.values.join(", ")}을 한 번씩 놓아 삼각진의 세 줄 합을 같게 할 때 가능한 한 줄의 합을 모두 구하세요.`;
    case "alphametic-addition": return `${data.addends.join(" + ")} = ${data.result}인 덧셈 복면산에서 ${data.askLetter}의 값을 구하세요. 서로 다른 문자는 서로 다른 숫자입니다.`;
    case "alphametic-multiplication": return `${data.factor} × ${data.multiplier} = ${data.result}인 곱셈 복면산에서 ${data.askLetter}의 값을 구하세요. 서로 다른 문자는 서로 다른 숫자입니다.`;
    case "operation-matrix": return `숫자 ${data.digits.join(", ")}를 한 번씩 넣어 가로와 세로의 ${[...new Set([...data.rowOps, ...data.colOps])].join("·")} 조건을 모두 만족하게 하세요. 왼쪽 위부터 두 줄로 쓰세요.`;
    case "gcd-pack": return `${data.values.join(", ")}을 똑같은 크기의 가장 큰 묶음으로 나눌 때 한 묶음의 크기를 구하세요.`;
    case "unit-fraction-sets": return `분모가 ${data.maxDenominator} 이하인 서로 다른 단위분수 ${data.termCount}개의 합이 ${data.targetNumerator}/${data.targetDenominator}가 되는 식을 모두 구하세요.`;
    case "lcm-cycle": return `${data.periods.join("일, ")}일마다 반복하는 일이 오늘 함께 일어났습니다. 다시 함께 일어나는 것은 며칠 뒤인가요?`;
    case "consecutive-conditions": return `연속한 ${data.divisors.length}개의 자연수가 차례로 ${data.divisors.join(", ")}의 배수일 때 가장 작은 수들을 차례로 구하세요.`;
    case "gcd-lcm-relation": return `두 자연수의 비가 ${data.ratio.join(":")}이고 ${data.gcd != null ? `최대공약수가 ${data.gcd}` : `최소공배수가 ${data.lcm}`}일 때 두 수를 작은 비의 항 순서대로 구하세요.`;
    case "balance-ratio": return `${data.aCount}개의 ${data.aLabel}과 ${data.bCount}개의 ${data.bLabel}이 균형을 이룹니다. ${data.aLabel}:${data.bLabel} 한 개의 무게 비를 구하세요.`;
    case "linear-pair": return `${data.a}${data.firstLabel}+${data.b}${data.secondLabel}=${data.firstTotal}, ${data.c}${data.firstLabel}${data.d < 0 ? "-" : "+"}${Math.abs(data.d)}${data.secondLabel}=${data.secondTotal}입니다. ${data.firstLabel}, ${data.secondLabel}의 값을 차례로 구하세요.`;
    case "heads-legs": return `${data.firstLabel}와 ${data.secondLabel}이 모두 ${data.total}개이고, ${data.measureLabel}은 모두 ${data.measure}개입니다. ${data.firstLabel}, ${data.secondLabel}의 수를 차례로 구하세요.`;
    default: throw new RangeError(`Missing prompt for ${data.task}`);
  }
}

function hintFor(data) {
  return ({
    "magic-line-sum": "세 가로줄은 아홉 수를 한 번씩 나눈 것이므로 전체 합을 3으로 나누세요.",
    "magic-missing": "빈칸을 지나는 줄에서 이미 보이는 두 수를 목표 합에서 빼세요.",
    "formation-line-sums": "같은 수 묶음도 놓는 자리에 따라 줄 합이 달라집니다. 가능한 배치를 빠짐없이 비교하세요.",
    "alphametic-addition": "일의 자리부터 더하고 10이 넘는지 받아올림을 따로 표시하세요.",
    "alphametic-multiplication": "일의 자리 곱과 받아올림부터 거꾸로 좁혀 가세요.",
    "operation-matrix": "덧셈·뺄셈·곱셈 기호를 먼저 구별하고 조건이 강한 줄부터 채우세요.",
    "gcd-pack": "모든 수를 동시에 나누는 수 중 가장 큰 수를 찾으세요.",
    "unit-fraction-sets": "분모가 작은 단위분수부터 골라 통분하고, 같은 식의 순서만 바뀐 것은 한 번만 셉니다.",
    "lcm-cycle": "각 주기의 공배수 중 가장 작은 수를 찾으세요.",
    "consecutive-conditions": "첫째 수의 배수를 적고 바로 다음 수들이 각 조건을 만족하는지 확인하세요.",
    "gcd-lcm-relation": "비를 기약비로 만든 뒤 공통 묶음 수를 최대공약수 또는 최소공배수로 정하세요.",
    "balance-ratio": "여러 개의 무게가 같다는 식을 세운 뒤 한 개끼리의 비로 약분하세요.",
    "linear-pair": "한 문자를 없애도록 두 식을 같은 수만큼 묶어 더하거나 빼세요.",
    "heads-legs": `모두 ${data.secondLabel}라고 가정한 표를 만든 뒤 실제 ${data.measureLabel}과의 차를 한 개당 차이로 나누세요.`
  })[data.task];
}

function typeFor(task) {
  return ({
    "magic-line-sum": "마방진에 사용할 수의 전체 합으로 한 줄의 합 구하기",
    "magic-missing": "가로·세로·대각선의 공통 합으로 마방진 빈칸 구하기",
    "formation-line-sums": "주어진 수를 진에 배열해 가능한 공통 줄 합을 모두 찾기",
    "alphametic-addition": "받아올림을 이용해 덧셈 복면산의 문자값 구하기",
    "alphametic-multiplication": "부분곱과 받아올림을 이용해 곱셈 복면산 풀기",
    "operation-matrix": "덧셈·뺄셈·곱셈을 구별해 연산 매트릭스 완성하기",
    "gcd-pack": "공통으로 나누는 가장 큰 묶음 찾기",
    "unit-fraction-sets": "서로 다른 단위분수 합의 가능한 식을 모두 찾기",
    "lcm-cycle": "최소공배수로 반복 주기가 다시 만나는 때 찾기",
    "consecutive-conditions": "연속수와 배수 조건을 동시에 만족하는 가장 작은 수 찾기",
    "gcd-lcm-relation": "기약비와 최대공약수·최소공배수의 관계로 두 수 구하기",
    "balance-ratio": "양팔저울의 균형을 한 개의 무게 비로 바꾸기",
    "linear-pair": "합과 차를 이용해 두 미지수의 값을 함께 구하기",
    "heads-legs": "모두 한 종류라고 가정한 표로 두 종류의 수 구하기"
  })[task];
}

function makeItems(bookId, lessonId, visuals) {
  return visuals.map((itemVisual, index) => {
    const slot = index < 4 ? `practice-${index + 1}` : index === 4 ? "extension" : `similar-${index - 4}`;
    const resultContract = resultContractFor(itemVisual.task);
    return {
      id: `${lessonId}:${slot}`,
      prompt: promptFor(itemVisual),
      hint: hintFor(itemVisual),
      visual: itemVisual,
      answerMode: "input",
      inputMode: resultContract.type === "single-value" ? "numeric" : "text",
      resultContract,
      typeLabel: typeFor(itemVisual.task),
      sourceNo: "",
      printGroup: index % 2 + 1,
      answerRef: `/course23/${bookId}/${lessonId}/${slot}`
    };
  });
}

function makeTrack(id, title, openingPrompt, hint, baseVisual, captions) {
  return {
    id, title, openingPrompt, hint,
    beats: ["problem", "organize", "calculate", "verify"].map((phase, index) => ({ caption: captions[index], visual: withPhase(baseVisual, phase) }))
  };
}

function makeLesson({ lessonId, title, unit, concept, tracks, visuals, sourceNote }) {
  const bookId = "course-02-a4";
  const items = makeItems(bookId, lessonId, visuals);
  return Object.freeze({
    id: lessonId,
    bookId,
    courseId: "course-02",
    label: "A4",
    title,
    unit,
    status: "pilot",
    learnerStage: "필즈 더 클래식 2과정 A4; 연령 미확정",
    representativeConcept: concept,
    story: {
      title: "조건을 눈에 보이게 정리해요",
      text: "학생용 교재의 활동과 권별 테스트에서 확인한 사고 순서를 새 수와 새 그림으로 연습합니다.",
      mission: "연산의 종류와 답의 형태를 먼저 확인하고, 모든 조건으로 다시 검산하세요."
    },
    explanation: { headline: title, steps: tracks.map((track) => track.title) },
    experience: { kind: "course-concept", tracks, openingPrompt: tracks[0].openingPrompt, hint: tracks[0].hint, beats: tracks[0].beats },
    original: { title: "연습", prompt: "개념을 적용해 문제를 풀고 문제마다 바로 확인하세요.", mode: "paged", separateConceptPrint: true, items: items.slice(0, 4) },
    extension: items[4],
    similarPractice: items.slice(5),
    dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: 7 },
    sourceTypeIds: [],
    source: { origin: "textbook-derived", note: sourceNote }
  });
}

const magicTracks = [
  makeTrack("c2a4-magic-total", "전체 합을 세 줄로 나눠요", "아홉 수를 한 번씩 쓰는 마방진의 한 줄 합은 어떻게 찾을까요?", "세 가로줄의 합은 아홉 수의 전체 합입니다.", visual("magic-line-sum", { values: [2, 4, 6, 8, 10, 12, 14, 16, 18] }), ["아홉 수를 빠짐없이 확인합니다.", "세 가로줄이 아홉 수를 한 번씩 나눠 가집니다.", "전체 합을 3으로 나눕니다.", "가로·세로·대각선의 공통 합으로 확인합니다."]),
  makeTrack("c2a4-magic-blank", "빈칸을 지나는 줄부터 계산해요", "공통 합을 알 때 빈칸은 어떻게 정할까요?", "목표 합에서 같은 줄의 두 수를 빼세요.", visual("magic-missing", { cells: [10, 3, 8, 5, null, 9, 6, 11, 4], target: 21 }), ["빈칸과 공통 합을 찾습니다.", "빈칸을 지나는 가로·세로·대각선을 표시합니다.", "각 줄에서 같은 후보가 나오는지 계산합니다.", "완성한 뒤 여덟 줄을 모두 더해 확인합니다."]),
  makeTrack("c2a4-formation", "진의 가능한 줄 합을 모두 찾아요", "같은 수라도 놓는 자리에 따라 가능한 공통 합이 달라질까요?", "꼭짓점과 가운데 자리가 줄에 몇 번 포함되는지 살펴보세요.", visual("formation-line-sums", { values: [1, 2, 3, 4, 5, 6], lines: formationLines }), ["사용할 수와 세 줄을 확인합니다.", "각 수를 한 번씩 놓는 배치를 정리합니다.", "세 줄의 합이 모두 같은 배치만 남깁니다.", "가능한 공통 합을 중복 없이 오름차순으로 확인합니다."])
];

const magicVisuals = [
  visual("magic-line-sum", { values: [2, 4, 6, 8, 10, 12, 14, 16, 18] }),
  visual("magic-missing", { cells: [10, 3, 8, 5, null, 9, 6, 11, 4], target: 21 }),
  visual("formation-line-sums", { values: [1, 2, 3, 4, 5, 6], lines: formationLines }),
  visual("magic-missing", { cells: [13, 6, 11, 8, 10, 12, 9, 14, null], target: 30 }),
  visual("formation-line-sums", { values: [2, 3, 4, 5, 6, 7], lines: formationLines }),
  visual("magic-line-sum", { values: [3, 6, 9, 12, 15, 18, 21, 24, 27] }),
  visual("magic-missing", { cells: [null, 2, 12, 6, 10, 14, 8, 18, 4], target: 30 }),
  visual("formation-line-sums", { values: [3, 4, 5, 6, 7, 8], lines: formationLines }),
  visual("magic-line-sum", { values: [5, 6, 7, 8, 9, 10, 11, 12, 13] }),
  visual("magic-missing", { cells: [25, 4, 19, 10, 16, null, 13, 28, 7], target: 48 })
];

const alphameticTracks = [
  makeTrack("c2a4-add-carry", "덧셈은 받아올림을 따로 적어요", "A7+28=9B에서 일의 자리와 십의 자리를 어떻게 연결할까요?", "7+8에서 생긴 받아올림 1을 십의 자리에 더하세요.", visual("alphametic-addition", { addends: ["A7", "28"], result: "9B", askLetter: "A" }), ["덧셈식과 서로 다른 문자를 확인합니다.", "일의 자리 계산과 받아올림을 분리합니다.", "십의 자리 식으로 문자값을 좁힙니다.", "완성한 실제 덧셈으로 검산합니다."]),
  makeTrack("c2a4-multiply-carry", "곱셈은 부분곱으로 확인해요", "A7×4=2B8에서 일의 자리 곱은 무엇을 알려 줄까요?", "7×4의 일의 자리와 받아올림을 먼저 적으세요.", visual("alphametic-multiplication", { factor: "A7", multiplier: "4", result: "2B8", askLetter: "B" }), ["곱하는 수와 결과의 자릿수를 확인합니다.", "일의 자리 곱과 받아올림을 적습니다.", "십의 자리 곱으로 두 문자를 정합니다.", "완성한 실제 곱셈으로 검산합니다."]),
  makeTrack("c2a4-operation-matrix", "행과 열의 연산 기호를 구별해요", "같은 네 수라도 덧셈·뺄셈·곱셈 조건을 모두 만족하려면 어디부터 볼까요?", "결과가 큰 곱셈 줄이나 순서가 중요한 뺄셈 줄부터 찾으세요.", visual("operation-matrix", { digits: [2, 3, 4, 6], rowOps: ["+", "×"], rowTargets: [8, 12], colOps: ["-", "+"], colTargets: [3, 6] }), ["행과 열의 기호를 각각 읽습니다.", "가능한 숫자쌍을 연산별로 정리합니다.", "교차하는 칸의 조건으로 한 배열을 남깁니다.", "네 행·열 식에 다시 대입해 확인합니다."])
];

const alphameticVisuals = [
  visual("alphametic-addition", { addends: ["A7", "28"], result: "9B", askLetter: "A" }),
  visual("alphametic-addition", { addends: ["A6", "2B"], result: "83", askLetter: "B" }),
  visual("alphametic-multiplication", { factor: "A7", multiplier: "4", result: "2B8", askLetter: "B" }),
  visual("operation-matrix", { digits: [2, 3, 4, 6], rowOps: ["+", "×"], rowTargets: [8, 12], colOps: ["-", "+"], colTargets: [3, 6] }),
  visual("operation-matrix", { digits: [1, 3, 5, 8], rowOps: ["×", "+"], rowTargets: [8, 8], colOps: ["+", "-"], colTargets: [6, 5] }),
  visual("alphametic-addition", { addends: ["AA", "B7"], result: "102", askLetter: "B" }),
  visual("alphametic-addition", { addends: ["A3", "A8"], result: "9B", askLetter: "B" }),
  visual("alphametic-multiplication", { factor: "2A", multiplier: "B", result: "1A8", askLetter: "A" }),
  visual("alphametic-multiplication", { factor: "A5", multiplier: "6", result: "4B0", askLetter: "B" }),
  visual("operation-matrix", { digits: [2, 4, 5, 9], rowOps: ["-", "×"], rowTargets: [4, 8], colOps: ["+", "-"], colTargets: [13, 3] })
];

const multipleTracks = [
  makeTrack("c2a4-gcd-fractions", "최대공약수로 묶고 단위분수로 나눠요", "여러 수를 똑같이 가장 크게 묶는 수는 무엇일까요?", "모든 수를 나누는 공약수 중 가장 큰 수를 찾으세요.", visual("gcd-pack", { values: [42, 70] }), ["각 수의 약수를 찾습니다.", "공통 약수만 남깁니다.", "가장 큰 공약수를 한 묶음의 크기로 정합니다.", "원래 수가 같은 크기 묶음으로 정확히 나뉘는지 확인합니다."]),
  makeTrack("c2a4-lcm-cycle", "최소공배수로 다시 만나는 때를 찾아요", "서로 다른 주기가 다시 함께 시작하는 때는 어떻게 찾을까요?", "각 주기의 공배수 중 가장 작은 수를 찾으세요.", visual("lcm-cycle", { periods: [6, 8, 15] }), ["반복하는 세 주기를 확인합니다.", "각 주기의 배수를 적습니다.", "처음 만나는 공배수를 고릅니다.", "그 날이 모든 주기로 나누어지는지 확인합니다."]),
  makeTrack("c2a4-consecutive", "연속수 조건은 첫 수부터 확인해요", "연속한 수가 서로 다른 수의 배수라면 가장 작은 묶음을 어떻게 찾을까요?", "첫째 조건의 배수마다 바로 다음 수를 검사하세요.", visual("consecutive-conditions", { divisors: [4, 7, 5] }), ["연속한 수의 순서와 배수 조건을 짝지읍니다.", "첫째 수의 배수 후보를 작은 것부터 적습니다.", "뒤의 연속수들이 나머지 조건을 만족하는지 계산합니다.", "더 작은 후보가 없고 세 조건이 모두 맞는지 확인합니다."]),
  makeTrack("c2a4-gcd-lcm", "기약비에 공통 묶음을 곱해요", "두 수의 비와 최대공약수 또는 최소공배수는 어떻게 연결될까요?", "기약비의 두 항은 서로소이므로 공통 묶음이 최대공약수입니다.", visual("gcd-lcm-relation", { ratio: [3, 5], gcd: 4 }), ["두 수의 비를 기약비로 만듭니다.", "두 수를 기약비×공통 묶음으로 놓습니다.", "주어진 최대공약수나 최소공배수로 묶음을 정합니다.", "구한 두 수의 최대공약수와 최소공배수를 다시 확인합니다."])
];

const multipleVisuals = [
  visual("gcd-pack", { values: [42, 70] }),
  visual("unit-fraction-sets", { targetNumerator: 1, targetDenominator: 2, termCount: 3, maxDenominator: 24 }),
  visual("lcm-cycle", { periods: [6, 8, 15] }),
  visual("consecutive-conditions", { divisors: [4, 7, 5] }),
  visual("gcd-lcm-relation", { ratio: [4, 7], lcm: 252 }),
  visual("gcd-pack", { values: [54, 90, 126] }),
  visual("unit-fraction-sets", { targetNumerator: 2, targetDenominator: 3, termCount: 3, maxDenominator: 24 }),
  visual("lcm-cycle", { periods: [9, 12, 20] }),
  visual("consecutive-conditions", { divisors: [5, 8, 7] }),
  visual("gcd-lcm-relation", { ratio: [5, 8], gcd: 6 })
];

const ratioTracks = [
  makeTrack("c2a4-balance", "균형을 한 개의 무게 비로 바꿔요", "같은 높이에서 균형인 두 묶음을 한 개씩 비교하려면 어떻게 할까요?", "3A=2B라면 A:B는 계수를 반대로 놓은 2:3입니다.", visual("balance-ratio", { aCount: 3, bCount: 2, aLabel: "사과", bLabel: "참외" }), ["양쪽 물체의 개수를 셉니다.", "수평인 저울을 같은 무게 식으로 씁니다.", "한 개의 무게 비로 바꾸고 약분합니다.", "비의 양쪽에 원래 개수를 곱해 균형을 확인합니다."]),
  makeTrack("c2a4-sum-difference", "두 식을 더하거나 빼서 하나를 없애요", "두 종류의 합과 차를 알 때 각각의 값은 어떻게 찾을까요?", "같은 문자의 계수를 맞추면 더하거나 뺄 때 한 문자가 없어집니다.", visual("linear-pair", { a: 1, b: 1, c: 1, d: -1, firstTotal: 27, secondTotal: 5, firstLabel: "큰 수", secondLabel: "작은 수" }), ["두 조건을 각각 식으로 씁니다.", "없앨 문자의 계수를 맞춥니다.", "두 식을 더하거나 빼서 한 값을 구합니다.", "두 식 모두에 대입해 두 값을 확인합니다."]),
  makeTrack("c2a4-assumption", "모두 한 종류라고 가정해 표를 만들어요", "머리 수와 다리 수로 두 동물의 수를 어떻게 나눌까요?", "모두 다리가 적은 동물이라고 가정하고 실제 다리 수와의 차를 보세요.", visual("heads-legs", { total: 18, measure: 50, firstUnits: 4, secondUnits: 2, firstLabel: "토끼", secondLabel: "닭", measureLabel: "다리" }), ["두 종류의 전체 마릿수와 다리 수를 확인합니다.", "모두 닭이라고 가정한 표를 만듭니다.", "실제와 가정의 다리 차를 한 마리당 차이로 나눕니다.", "구한 두 마릿수로 머리와 다리 수를 다시 확인합니다."])
];

const ratioVisuals = [
  visual("balance-ratio", { aCount: 3, bCount: 2, aLabel: "사과", bLabel: "참외" }),
  visual("linear-pair", { a: 1, b: 1, c: 1, d: -1, firstTotal: 27, secondTotal: 5, firstLabel: "큰 수", secondLabel: "작은 수" }),
  visual("heads-legs", { total: 18, measure: 50, firstUnits: 4, secondUnits: 2, firstLabel: "토끼", secondLabel: "닭", measureLabel: "다리" }),
  visual("balance-ratio", { aCount: 4, bCount: 6, aLabel: "파란 추", bLabel: "빨간 추" }),
  visual("linear-pair", { a: 2, b: 3, c: 1, d: 1, firstTotal: 49, secondTotal: 19, firstLabel: "별", secondLabel: "하트" }),
  visual("heads-legs", { total: 15, measure: 38, firstUnits: 3, secondUnits: 2, firstLabel: "세발자전거", secondLabel: "두발자전거", measureLabel: "바퀴" }),
  visual("linear-pair", { a: 3, b: 2, c: 1, d: 1, firstTotal: 58, secondTotal: 21, firstLabel: "가", secondLabel: "나" }),
  visual("balance-ratio", { aCount: 5, bCount: 2, aLabel: "네모", bLabel: "세모" }),
  visual("heads-legs", { total: 13, measure: 90, firstUnits: 8, secondUnits: 6, firstLabel: "거미", secondLabel: "딱정벌레", measureLabel: "다리" }),
  visual("linear-pair", { a: 2, b: 1, c: 1, d: -1, firstTotal: 41, secondTotal: 7, firstLabel: "상자", secondLabel: "봉투" })
];

export const COURSE02_A4_LESSONS = Object.freeze([
  makeLesson({
    lessonId: "course-02-a4-magic-formations",
    title: "마방진과 진의 같은 줄 조건을 찾아요",
    unit: "마방진",
    concept: "전체 합으로 마방진의 한 줄 합을 정하고, 빈칸과 여러 답이 가능한 진의 결과 계약을 구별하기",
    tracks: magicTracks,
    visuals: magicVisuals,
    sourceNote: "학생용 교재 1단원 「마방진」 6~31쪽의 마방진·정다각별·삼각진 활동과 2A4 권별 테스트 3~4쪽 및 답안 10쪽의 단일·복수정답 계약을 대조해 새 수와 진으로 구성했습니다."
  }),
  makeLesson({
    lessonId: "course-02-a4-alphametics",
    title: "연산을 구별해 복면산과 매트릭스를 풀어요",
    unit: "복면산",
    concept: "덧셈의 받아올림, 곱셈의 부분곱, 행·열의 덧셈·뺄셈·곱셈 조건을 분리해 유일한 값을 찾기",
    tracks: alphameticTracks,
    visuals: alphameticVisuals,
    sourceNote: "학생용 교재 2단원 「복면산」 34~62쪽의 덧셈 복면산·곱셈 복면산·매트릭스 활동과 2A4 권별 테스트 4~5쪽을 대조해 새 식과 숫자로 구성했습니다."
  }),
  makeLesson({
    lessonId: "course-02-a4-multiples-divisors",
    title: "최대공약수와 최소공배수의 관계를 연결해요",
    unit: "배수와 약수",
    concept: "최대공약수·단위분수, 최소공배수·주기·연속수, 기약비와 최대공약수·최소공배수의 관계를 검산하기",
    tracks: multipleTracks,
    visuals: multipleVisuals,
    sourceNote: "학생용 교재 3단원 「배수와 약수」 66~100쪽의 최대공약수와 단위분수·최소공배수와 연속수·두 수의 관계 활동과 2A4 권별 테스트 5~7쪽을 대조해 새 조건으로 구성했습니다."
  }),
  makeLesson({
    lessonId: "course-02-a4-ratio-assumption",
    title: "비와 두 식을 세우고 가정표로 확인해요",
    unit: "비와 가정하여 풀기",
    concept: "양팔저울의 등가비, 합과 차를 이용한 연립 조건, 모두 한 종류라고 가정한 표를 실제 조건으로 검산하기",
    tracks: ratioTracks,
    visuals: ratioVisuals,
    sourceNote: "학생용 교재 4단원 「비와 가정하여 풀기」 104~137쪽의 양팔저울과 연비·합과 차·가정하여 해결하기 활동과 2A4 권별 테스트 7~9쪽을 대조해 새 상황과 수로 구성했습니다."
  })
]);

function magicGridMarkup(data, model, solved) {
  const cells = data.task === "magic-missing" ? data.cells : Array(9).fill(null);
  const labels = cells.map((value, index) => {
    const shown = value == null ? (solved && data.task === "magic-missing" && index === model.blank ? model.answer : "") : value;
    return `<rect x="${18 + index % 3 * 54}" y="${18 + Math.floor(index / 3) * 54}" width="54" height="54"/><text x="${45 + index % 3 * 54}" y="${51 + Math.floor(index / 3) * 54}">${esc(shown)}</text>`;
  }).join("");
  return `<svg class="a4-magic-grid" viewBox="0 0 198 198" role="img" aria-label="3 곱하기 3 마방진">${labels}</svg>`;
}

function formationMarkup(data) {
  const points = [[100, 18], [150, 102], [198, 186], [100, 186], [2, 186], [50, 102]];
  const lines = data.lines.map((line) => `<polyline points="${line.map((index) => points[index].join(",")).join(" ")}"/>`).join("");
  const nodes = points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15"/>`).join("");
  return `<svg class="a4-formation" viewBox="-20 0 240 215" role="img" aria-label="세 줄의 합을 같게 만드는 삼각진">${lines}${nodes}<text x="100" y="210" text-anchor="middle">${esc(data.values.join(" · "))}</text></svg>`;
}

function solvedWord(word, mapping) {
  return [...word].map((character) => Object.hasOwn(mapping || {}, character) ? mapping[character] : character).join("");
}

function alphameticMarkup(data, model, solved) {
  const operation = data.task === "alphametic-addition" ? "+" : "×";
  const rows = data.task === "alphametic-addition" ? [...data.addends, data.result] : [data.factor, data.multiplier, data.result];
  const shownRows = solved ? rows.map((row) => solvedWord(row, model.mapping)) : rows;
  return `<div class="a4-alphametic" role="img" aria-label="${data.task === "alphametic-addition" ? "덧셈" : "곱셈"} 복면산">${shownRows.map((row, index) => `<div>${index === rows.length - 2 ? `<b>${operation}</b>` : ""}<span>${esc(row)}</span></div>`).join("")}</div>`;
}

function operationMatrixMarkup(data, model, solved) {
  const cell = (x, y, index) => `<rect x="${x}" y="${y}" width="54" height="54"/><text x="${x + 27}" y="${y + 34}">${solved ? model.cells[index] : "□"}</text>`;
  return `<svg class="a4-operation-matrix" viewBox="0 0 260 210" role="img" aria-label="가로와 세로의 연산 매트릭스">${cell(55, 35, 0)}${cell(109, 35, 1)}${cell(55, 89, 2)}${cell(109, 89, 3)}<text x="82" y="28">${esc(data.colOps[0])}</text><text x="136" y="28">${esc(data.colOps[1])}</text><text x="82" y="165">${esc(data.colTargets[0])}</text><text x="136" y="165">${esc(data.colTargets[1])}</text><text x="37" y="69">${esc(data.rowOps[0])}</text><text x="37" y="123">${esc(data.rowOps[1])}</text><text x="184" y="69">${esc(data.rowTargets[0])}</text><text x="184" y="123">${esc(data.rowTargets[1])}</text><text x="110" y="196">${esc(data.digits.join(" · "))}</text></svg>`;
}

function balanceMarkup(data) {
  const left = Array.from({ length: data.aCount }, (_, index) => `<circle cx="${66 + (index % 3) * 23}" cy="${91 - Math.floor(index / 3) * 22}" r="9"/>`).join("");
  const right = Array.from({ length: data.bCount }, (_, index) => `<rect x="${177 + (index % 3) * 23}" y="${82 - Math.floor(index / 3) * 22}" width="18" height="18"/>`).join("");
  return `<svg class="a4-balance" viewBox="0 0 300 180" role="img" aria-label="양팔저울의 균형"><line x1="150" y1="28" x2="150" y2="132"/><line x1="45" y1="68" x2="255" y2="68"/><line x1="65" y1="68" x2="65" y2="116"/><line x1="235" y1="68" x2="235" y2="116"/><path d="M35 116 H95 L85 138 H45 Z"/><path d="M205 116 H265 L255 138 H215 Z"/>${left}${right}<text x="65" y="166">${esc(data.aLabel)}</text><text x="235" y="166">${esc(data.bLabel)}</text></svg>`;
}

function headsLegsMarkup(data, model, solved) {
  const assumed = data.total * data.secondUnits;
  const difference = data.measure - assumed;
  const perItem = data.firstUnits - data.secondUnits;
  return `<table class="a4-assumption"><caption>가정하여 확인하는 표</caption><thead><tr><th>단계</th><th>${esc(data.firstLabel)}</th><th>${esc(data.secondLabel)}</th><th>${esc(data.measureLabel)}</th></tr></thead><tbody><tr><th>모두 ${esc(data.secondLabel)}라고 가정</th><td>0</td><td>${data.total}</td><td>${assumed}</td></tr><tr><th>실제와의 차</th><td colspan="2">한 개당 ${perItem}</td><td>${difference}</td></tr>${solved ? `<tr><th>검산</th><td>${model.values[0]}</td><td>${model.values[1]}</td><td>${data.measure}</td></tr>` : ""}</tbody></table>`;
}

export function course02A4ConceptMarkup(data) {
  if (!data || data.kind !== "course02-a4") return "";
  const phase = data.phase || "problem";
  const solved = phase === "verify";
  const model = course02A4Model(data);
  let body = "";
  if (["magic-line-sum", "magic-missing"].includes(data.task)) {
    body = `${magicGridMarkup(data, model, solved)}<p>${data.task === "magic-line-sum" ? `전체 합 ${model.total} ÷ 3` : `한 줄의 합 ${data.target}`}</p>`;
  } else if (data.task === "formation-line-sums") {
    body = formationMarkup(data);
  } else if (["alphametic-addition", "alphametic-multiplication"].includes(data.task)) {
    body = alphameticMarkup(data, model, solved);
  } else if (data.task === "operation-matrix") {
    body = operationMatrixMarkup(data, model, solved);
  } else if (data.task === "gcd-pack") {
    body = `<div class="a4-number-groups">${data.values.map((value) => `<span>${value}</span>`).join("")}</div><p>모두 나누는 가장 큰 수</p>`;
  } else if (data.task === "unit-fraction-sets") {
    body = `<div class="a4-fraction-goal"><span>서로 다른 단위분수 ${data.termCount}개</span><b>=</b><span>${data.targetNumerator}/${data.targetDenominator}</span></div>`;
  } else if (data.task === "lcm-cycle") {
    body = `<div class="a4-cycle">${data.periods.map((period) => `<span style="--period:${period}">${period}일</span>`).join("")}</div>`;
  } else if (data.task === "consecutive-conditions") {
    body = `<div class="a4-consecutive">${data.divisors.map((divisor, index) => `<span><b>${index + 1}번째 수</b>${divisor}의 배수</span>`).join("")}</div>`;
  } else if (data.task === "gcd-lcm-relation") {
    body = `<div class="a4-ratio-blocks"><span>${data.ratio[0]}묶음</span><b>:</b><span>${data.ratio[1]}묶음</span></div><p>${data.gcd != null ? `최대공약수 ${data.gcd}` : `최소공배수 ${data.lcm}`}</p>`;
  } else if (data.task === "balance-ratio") {
    body = balanceMarkup(data);
  } else if (data.task === "linear-pair") {
    body = `<div class="a4-equation-pair"><p>${data.a}${esc(data.firstLabel)} + ${data.b}${esc(data.secondLabel)} = ${data.firstTotal}</p><p>${data.c}${esc(data.firstLabel)} ${data.d < 0 ? "-" : "+"} ${Math.abs(data.d)}${esc(data.secondLabel)} = ${data.secondTotal}</p></div>`;
  } else if (data.task === "heads-legs") {
    body = headsLegsMarkup(data, model, solved);
  }
  const guidance = phase === "problem" ? "" : `<p class="a4-guidance">${esc(hintFor(data))}</p>`;
  const answer = solved ? `<strong class="a4-answer">정답 ${esc(model.answer)}</strong>` : "";
  return `<div class="course02-a4-visual" data-task="${esc(data.task)}" data-phase="${esc(phase)}">${body}${guidance}${answer}</div>`;
}
