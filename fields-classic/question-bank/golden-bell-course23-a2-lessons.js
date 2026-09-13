const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

const gcd = (a, b) => {
  let x = Math.abs(a); let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
};
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const lcmAll = (values) => values.reduce(lcm, 1);
const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function recurringDecimal(numerator, denominator) {
  const integer = Math.floor(numerator / denominator);
  let remainder = numerator % denominator;
  const seen = new Map();
  const digits = [];
  while (remainder && !seen.has(remainder)) {
    seen.set(remainder, digits.length);
    remainder *= 10;
    digits.push(Math.floor(remainder / denominator));
    remainder %= denominator;
  }
  const start = remainder ? seen.get(remainder) : digits.length;
  return {
    integer,
    prefix: digits.slice(0, start).join(""),
    period: remainder ? digits.slice(start).join("") : "",
    decimal: `${integer}.${digits.join("")}`
  };
}

function reversePredecessors(target) {
  const values = [target * 2];
  const odd = (target + 1) / 3;
  if (Number.isInteger(odd) && odd > 0 && odd % 2 === 1) values.unshift(odd);
  return values;
}

export function course23A2Model(visual) {
  if (!visual || visual.kind !== "course23-a2") throw new TypeError("A course23 A2 visual is required");
  switch (visual.task) {
    case "clone-number": {
      const multiplier = visual.positions.reduce((sum, position) => sum + 10 ** position, 0);
      return { multiplier, answer: visual.base * multiplier };
    }
    case "odd-square": {
      const count = (visual.lastOdd + 1) / 2;
      return { count, answer: count ** 2 };
    }
    case "square-last-odd": {
      const root = Math.sqrt(visual.square);
      return { root, answer: root * 2 - 1 };
    }
    case "operator-rule": {
      const { a, b, rule } = visual;
      const answer = rule === "sum-minus" ? a + b - visual.k
        : rule === "multiply-add-first" ? a * b + a
          : (a + b) * Math.abs(a - b);
      return { answer };
    }
    case "four-fours": {
      const matches = dataIndexes(visual.options).filter((index) => visual.options[index].value === visual.target);
      if (matches.length !== 1) throw new RangeError("Four-fours choices require one answer");
      return { matches, answer: matches[0] + 1 };
    }
    case "weekday-offset": {
      const index = (visual.start + visual.offset) % 7;
      return { index, answer: weekdays[index] };
    }
    case "leap-year-count": {
      const through = (year) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
      return { answer: through(visual.end) - through(visual.start - 1) };
    }
    case "nim-move": {
      const cycle = visual.maxTake + 1;
      return { cycle, answer: visual.stones % cycle };
    }
    case "reverse-rule": {
      const predecessors = reversePredecessors(visual.target);
      return { predecessors, answer: predecessors.reduce((sum, value) => sum + value, 0) };
    }
    case "reverse-transfer": {
      const initialA = visual.finalA * visual.denominator / (visual.denominator - 1);
      return { initialA, initialB: visual.finalB - initialA / visual.denominator, answer: initialA };
    }
    case "digit-product-chain": {
      const sequence = [visual.start];
      while (sequence.at(-1) >= 10) sequence.push(String(sequence.at(-1)).split("").reduce((product, digit) => product * Number(digit), 1));
      return { sequence, answer: sequence.length - 1 };
    }
    case "recurring-decimal": {
      const result = recurringDecimal(visual.numerator, visual.denominator);
      return { ...result, answer: result.period };
    }
    case "divisor-count": {
      const answer = visual.exponents.reduce((product, exponent) => product * (exponent + 1), 1);
      return { answer };
    }
    case "eleven-missing-digit": {
      const candidates = dataIndexes(Array(10)).filter((digit) => Number(visual.digits.map((value) => value === null ? digit : value).join("")) % 11 === 0);
      if (candidates.length !== 1) throw new RangeError("The 11-divisibility item requires one missing digit");
      return { candidates, answer: candidates[0] };
    }
    case "gcd-lcm": {
      const common = gcd(visual.a, visual.b); const multiple = lcm(visual.a, visual.b);
      return { gcd: common, lcm: multiple, answer: visual.ask === "gcd" ? common : multiple };
    }
    case "schedule-cycle": {
      const answer = lcmAll(visual.intervals);
      return { answer };
    }
    case "linear-equation": {
      return { answer: (visual.c - visual.b) / visual.a };
    }
    case "catch-up": {
      const gap = visual.slow * visual.delay;
      return { gap, relative: visual.fast - visual.slow, answer: gap / (visual.fast - visual.slow) };
    }
    case "midpoint": {
      return { answer: (visual.a + visual.b) / 2 };
    }
    case "distance": {
      return { answer: Math.abs(visual.a - visual.b) };
    }
    case "absolute-equation": {
      const values = [visual.center - visual.radius, visual.center + visual.radius];
      return { values, answer: values.join(", ") };
    }
    default: throw new RangeError(`Unknown course23 A2 task: ${visual.task}`);
  }
}

const dataIndexes = (value) => Array.from({ length: value.length }, (_, index) => index);

const visual = (task, values, phase = "problem") => ({ kind: "course23-a2", task, ...values, phase });
const withPhase = (base, phase) => ({ ...base, phase });

function promptFor(data) {
  const model = course23A2Model(data);
  switch (data.task) {
    case "clone-number": return `${data.base}에 ${model.multiplier}을 곱한 값을 분배법칙으로 간단히 구하세요.`;
    case "odd-square": return `1부터 ${data.lastOdd}까지 연속한 홀수의 합을 구하세요.`;
    case "square-last-odd": return `1 + 3 + 5 + … + □ = ${data.square}일 때 □에 알맞은 마지막 홀수를 구하세요.`;
    case "operator-rule": return data.rule === "sum-minus"
      ? `A○B = A + B - ${data.k}로 약속할 때 ${data.a}○${data.b}를 구하세요.`
      : data.rule === "multiply-add-first"
        ? `A○B = A × B + A로 약속할 때 ${data.a}○${data.b}를 구하세요.`
        : `A○B = (A + B) × |A - B|로 약속할 때 ${data.a}○${data.b}를 구하세요.`;
    case "four-fours": return `4를 네 번 사용한 보기 중 값이 ${data.target}인 식의 번호를 쓰세요.`;
    case "weekday-offset": return `${weekdays[data.start]}부터 ${data.offset}일 뒤는 무슨 요일인지 쓰세요.`;
    case "leap-year-count": return `${data.start}년부터 ${data.end}년까지 윤년은 모두 몇 번인지 구하세요. 4의 배수는 윤년이지만 100의 배수는 제외하고, 400의 배수는 다시 포함합니다.`;
    case "nim-move": return `돌 ${data.stones}개에서 두 사람이 번갈아 1개부터 ${data.maxTake}개까지 가져갑니다. 마지막 돌을 가져가는 사람이 이길 때, 먼저 몇 개를 가져가야 이기는 묶음을 만들 수 있을까요?`;
    case "reverse-rule": return `홀수는 3배한 뒤 1을 빼고, 짝수는 2로 나눕니다. 계산 결과가 ${data.target}이 되는 직전의 자연수를 모두 더하세요.`;
    case "reverse-transfer": return `A가 처음 가진 구슬의 1/${data.denominator}을 B에게 주었더니 A는 ${data.finalA}개, B는 ${data.finalB}개가 되었습니다. A가 처음 가진 구슬은 몇 개인가요?`;
    case "digit-product-chain": return `${data.start}의 각 자리 숫자를 곱하고, 한 자리 수가 될 때까지 같은 계산을 반복합니다. 모두 몇 단계가 필요한가요?`;
    case "recurring-decimal": return `${data.numerator}/${data.denominator}을 순환소수로 나타낼 때 반복되는 숫자를 차례로 쓰세요.`;
    case "divisor-count": return `${data.primes.map((prime, i) => `${prime}^${data.exponents[i]}`).join(" × ")}의 약수는 모두 몇 개인가요?`;
    case "eleven-missing-digit": return `${data.digits.map((digit) => digit === null ? "□" : digit).join("")}가 11의 배수가 되도록 □에 알맞은 숫자를 쓰세요.`;
    case "gcd-lcm": return `${data.a}와 ${data.b}의 ${data.ask === "gcd" ? "최대공약수" : "최소공배수"}를 구하세요.`;
    case "schedule-cycle": return `${data.intervals.join("분, ")}분 간격으로 반복되는 일이 동시에 시작했습니다. 다시 동시에 시작하는 것은 몇 분 뒤인가요?`;
    case "linear-equation": return `${data.a}x ${data.b < 0 ? "-" : "+"} ${Math.abs(data.b)} = ${data.c}일 때 x를 구하세요.`;
    case "catch-up": return `분속 ${data.slow}m로 출발한 사람을 ${data.delay}분 뒤 분속 ${data.fast}m로 따라갑니다. 출발한 뒤 몇 분 만에 따라잡나요?`;
    case "midpoint": return `수직선 위 두 점 ${data.a}와 ${data.b}의 중점 좌표를 구하세요.`;
    case "distance": return `수직선 위 두 점 ${data.a}와 ${data.b} 사이의 거리를 구하세요.`;
    case "absolute-equation": return `|x - (${data.center})| = ${data.radius}를 만족하는 두 수를 작은 수부터 쉼표로 구분해 쓰세요.`;
    default: return "";
  }
}

function typeFor(task) {
  return ({
    "clone-number": "복제수를 자릿값의 합으로 나누어 계산하기",
    "odd-square": "연속한 홀수의 합을 사각수로 계산하기",
    "square-last-odd": "사각수에서 마지막 홀수 찾기",
    "operator-rule": "새 연산의 약속을 식에 적용하기",
    "four-fours": "4를 네 번 사용하는 식을 계산순서로 판별하기",
    "weekday-offset": "지난 날수의 나머지로 요일 찾기",
    "leap-year-count": "4·100·400의 배수 조건으로 윤년 세기",
    "nim-move": "마지막 돌을 가져가는 님게임의 필승 묶음",
    "reverse-rule": "연산 규칙을 거꾸로 적용해 직전 수 찾기",
    "reverse-transfer": "주고 난 뒤의 수에서 처음 수 되찾기",
    "digit-product-chain": "자리 숫자의 곱을 한 자리까지 반복하기",
    "recurring-decimal": "분수를 순환소수로 나타내기",
    "divisor-count": "소인수 지수로 약수의 개수 구하기",
    "eleven-missing-digit": "엇갈린 자리의 합으로 11의 배수 판정하기",
    "gcd-lcm": "최대공약수와 최소공배수 구하기",
    "schedule-cycle": "반복 시간의 최소공배수 구하기",
    "linear-equation": "등식의 성질로 일차방정식 풀기",
    "catch-up": "거리 차와 상대속력으로 따라잡는 시간 구하기",
    "midpoint": "수직선 위 두 점의 중점 구하기",
    "distance": "수직선 위 두 점 사이의 거리 구하기",
    "absolute-equation": "절댓값을 거리로 해석해 두 해 찾기"
  })[task];
}

function makeItems(bookId, lessonId, visuals) {
  return visuals.map((itemVisual, index) => {
    const slot = index < 4 ? `practice-${index + 1}` : index === 4 ? "extension" : `similar-${index - 4}`;
    return {
      id: `${lessonId}:${slot}`,
      prompt: promptFor(itemVisual),
      hint: hintFor(itemVisual),
      visual: itemVisual,
      answerMode: "input",
      inputMode: ["weekday-offset", "recurring-decimal", "absolute-equation"].includes(itemVisual.task) ? "text" : "numeric",
      typeLabel: typeFor(itemVisual.task),
      sourceNo: "",
      printGroup: index % 2 + 1,
      answerRef: `/course23/${bookId}/${lessonId}/${slot}`
    };
  });
}

function hintFor(data) {
  return ({
    "clone-number": "곱하는 수를 100, 10, 1 같은 자릿값의 합으로 나누어 각각 곱하세요.",
    "odd-square": "마지막 홀수가 몇 번째 홀수인지 찾으면 그 순서의 제곱이 합입니다.",
    "square-last-odd": "주어진 사각수의 제곱근을 찾고, 그 순서의 홀수 2×순서-1을 구하세요.",
    "operator-rule": "동그라미를 보통 연산으로 계산하지 말고, 약속된 식에 A와 B를 넣으세요.",
    "four-fours": "곱셈과 나눗셈을 먼저 계산하고, 괄호가 있으면 괄호부터 계산하세요.",
    "weekday-offset": "지난 날수를 7로 나눈 나머지만큼 시작 요일에서 이동하세요.",
    "leap-year-count": "4의 배수 개수에서 100의 배수 개수를 빼고 400의 배수 개수를 다시 더하세요.",
    "nim-move": `한 차례에 가져갈 수 있는 최대 수보다 1 큰 수로 돌을 묶으세요.`,
    "reverse-rule": "짝수였던 직전 수는 2배하고, 홀수였던 직전 수는 1을 더해 3으로 나눌 수 있는지 확인하세요.",
    "reverse-transfer": "A에게 남은 양이 처음의 몇 분의 몇인지 먼저 찾으세요.",
    "digit-product-chain": "각 단계에서 나온 수의 자릿수를 다시 곱하고 단계 수를 표시하세요.",
    "recurring-decimal": "나눗셈에서 같은 나머지가 다시 나오면 그때부터 숫자가 반복됩니다.",
    "divisor-count": "각 소인수의 지수에 1을 더한 수들을 모두 곱하세요.",
    "eleven-missing-digit": "왼쪽부터 번갈아 더한 두 자리 묶음의 차가 0 또는 11의 배수가 되는지 확인하세요.",
    "gcd-lcm": "공통으로 나누는 가장 큰 수와 공통으로 만나는 가장 작은 배수를 구분하세요.",
    "schedule-cycle": "각 간격의 공배수 중 가장 작은 수를 찾으세요.",
    "linear-equation": "문자항만 남도록 양변에 같은 수를 더하거나 빼고, 마지막에 계수로 나누세요.",
    "catch-up": "먼저 간 거리 ÷ 두 사람의 속력 차로 계산하세요.",
    "midpoint": "두 좌표를 더한 뒤 2로 나누세요.",
    "distance": "큰 좌표에서 작은 좌표를 빼세요.",
    "absolute-equation": "기준점에서 같은 거리만큼 왼쪽과 오른쪽에 한 점씩 있습니다."
  })[data.task];
}

function makeTrack(id, title, openingPrompt, hint, baseVisual, captions) {
  return {
    id, title, openingPrompt, hint,
    beats: ["problem", "organize", "calculate", "verify"].map((phase, index) => ({ caption: captions[index], visual: withPhase(baseVisual, phase) }))
  };
}

function makeLesson({ bookId, lessonId, title, unit, concept, tracks, visuals, sourceNote }) {
  const items = makeItems(bookId, lessonId, visuals);
  return Object.freeze({
    id: lessonId, bookId, courseId: bookId.startsWith("course-02") ? "course-02" : "course-03", label: "A2",
    title, unit, status: "pilot", learnerStage: `필즈 더 클래식 ${bookId.startsWith("course-02") ? "2과정" : "3과정"} A2; 연령 미확정`,
    representativeConcept: concept,
    story: { title: "개념 실험실", text: "교재의 활동 구조를 움직이는 그림과 계산 단계로 다시 확인합니다.", mission: "조건을 정리하고 계산한 뒤 원래 조건으로 검산하세요." },
    explanation: { headline: title, steps: tracks.map((track) => track.title) },
    experience: { kind: "course-concept", tracks, openingPrompt: tracks[0].openingPrompt, hint: tracks[0].hint, beats: tracks[0].beats },
    original: { title: "연습", prompt: "개념을 적용해 문제를 풀고 문제마다 바로 확인하세요.", mode: "paged", separateConceptPrint: true, items: items.slice(0, 4) },
    extension: items[4], similarPractice: items.slice(5),
    dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: 7 },
    sourceTypeIds: [], source: { origin: "textbook-derived", note: sourceNote }
  });
}

const c2b = "course-02-a2";
const c2CloneTracks = [
  makeTrack("c2a2-clone", "복제수를 자릿값으로 펼쳐요", "37 × 101을 긴 곱셈 없이 계산해 볼까요?", "101을 100+1로 나누어 보세요.", visual("clone-number", { base: 37, positions: [2, 0] }), ["101은 1이 백의 자리와 일의 자리에 놓인 수입니다.", "37 × (100 + 1)로 식을 펼칩니다.", "3700과 37을 더해 3737을 만듭니다.", "3737은 37이 두 번 이어진 복제수인지 확인합니다."]),
  makeTrack("c2a2-power", "10, 100, 1000을 만들어 계산해요", "48 × 1001은 어떻게 빠르게 계산할까요?", "1001=1000+1입니다.", visual("clone-number", { base: 48, positions: [3, 0] }), ["1001의 두 1이 떨어진 자리를 확인합니다.", "48 × (1000 + 1)로 나눕니다.", "48000 + 48을 계산합니다.", "답 48048에서 48이 같은 간격으로 복제됐는지 확인합니다."])
];
const c2CloneVisuals = [
  visual("clone-number", { base: 24, positions: [2, 0] }), visual("clone-number", { base: 63, positions: [3, 0] }),
  visual("clone-number", { base: 18, positions: [4, 2, 0] }), visual("clone-number", { base: 42, positions: [2, 1, 0] }),
  visual("clone-number", { base: 75, positions: [3, 0] }), visual("clone-number", { base: 31, positions: [4, 2, 0] }),
  visual("clone-number", { base: 56, positions: [2, 0] }), visual("clone-number", { base: 12, positions: [5, 3, 1] }),
  visual("clone-number", { base: 89, positions: [3, 0] }), visual("clone-number", { base: 27, positions: [4, 3, 2, 1, 0] })
];

const c2PromiseTracks = [
  makeTrack("c2a2-square", "홀수를 더해 사각수를 만들어요", "1+3+5+7+9의 합을 점을 하나씩 늘려 확인해 볼까요?", "다섯 번째 홀수까지의 합은 5×5입니다.", visual("odd-square", { lastOdd: 9 }), ["1, 3, 5, 7, 9를 차례로 놓습니다.", "새 홀수를 ㄱ자 모양으로 붙이면 정사각형이 한 겹씩 커집니다.", "다섯 겹이므로 5×5를 계산합니다.", "홀수의 합 25와 5×5가 같은지 확인합니다."]),
  makeTrack("c2a2-operator", "새 연산의 약속을 그대로 적용해요", "A○B=A×B+A라면 4○6은 얼마일까요?", "A 자리에 4, B 자리에 6을 넣으세요.", visual("operator-rule", { a: 4, b: 6, rule: "multiply-add-first" }), ["○는 보통 연산 기호가 아니라 새 약속입니다.", "A와 B 자리에 4와 6을 넣습니다.", "4×6+4를 순서대로 계산합니다.", "24+4=28인지 원래 약속에 다시 넣어 확인합니다."]),
  makeTrack("c2a2-four-fours", "4를 네 번 써서 수를 만들어요", "4를 네 번 사용해 15를 만든 식은 어느 것일까요?", "곱셈과 나눗셈을 먼저 계산해 각 식의 값을 비교하세요.", visual("four-fours", { target: 15, options: [{ label: "4+4+4+4", value: 16 }, { label: "4×4-4÷4", value: 15 }, { label: "(4+4)÷4+4", value: 6 }] }), ["모든 식에 숫자 4가 네 번 사용됐는지 확인합니다.", "괄호, 곱셈·나눗셈, 덧셈·뺄셈 순서로 계산합니다.", "세 식의 값 16, 15, 6을 목표 수와 비교합니다.", "4×4-4÷4=16-1=15이므로 2번입니다."])
];
const c2PromiseVisuals = [
  visual("odd-square", { lastOdd: 11 }), visual("square-last-odd", { square: 81 }),
  visual("operator-rule", { a: 8, b: 5, rule: "sum-minus", k: 3 }), visual("four-fours", { target: 15, options: [{ label: "4+4+4+4", value: 16 }, { label: "4×4-4÷4", value: 15 }, { label: "(4+4)÷4+4", value: 6 }] }),
  visual("odd-square", { lastOdd: 13 }), visual("square-last-odd", { square: 144 }),
  visual("operator-rule", { a: 9, b: 5, rule: "sum-times-difference" }), visual("four-fours", { target: 5, options: [{ label: "(4×4+4)÷4", value: 5 }, { label: "4+4÷4+4", value: 9 }, { label: "4×4÷4+4", value: 8 }] }),
  visual("operator-rule", { a: 6, b: 2, rule: "sum-minus", k: 1 }), visual("four-fours", { target: 7, options: [{ label: "4+4-4÷4", value: 7 }, { label: "(4+4+4)÷4", value: 3 }, { label: "4×4-4-4", value: 8 }] })
];

const c2CalendarTracks = [
  makeTrack("c2a2-leap", "4·100·400의 조건으로 윤년을 세요", "2001년부터 2100년까지 윤년은 몇 번일까요?", "4의 배수에서 100의 배수를 빼고 400의 배수를 더하세요.", visual("leap-year-count", { start: 2001, end: 2100 }), ["먼저 4의 배수인 해를 표시합니다.", "그중 100의 배수인 해는 윤년에서 제외합니다.", "다만 400의 배수인 해는 다시 윤년에 포함합니다.", "2004년부터 2096년까지 24번이고 2100년은 제외되는지 확인합니다."]),
  makeTrack("c2a2-calendar", "7일씩 묶어 요일을 찾아요", "월요일부터 45일 뒤는 무슨 요일일까요?", "45를 7로 나눈 나머지만 이동하세요.", visual("weekday-offset", { start: 1, offset: 45 }), ["요일은 일곱 개가 같은 순서로 반복됩니다.", "45일을 7일짜리 여섯 묶음과 남은 3일로 나눕니다.", "월요일에서 3칸 이동합니다.", "목요일에서 다시 7일을 더해도 같은 요일인지 확인합니다."]),
  makeTrack("c2a2-nim", "상대와 합쳐 일정한 묶음을 만들어요", "돌 17개에서 한 번에 1~3개를 가져갈 때 먼저 몇 개를 가져갈까요?", "상대와 내가 가져간 돌의 합을 4개로 맞추세요.", visual("nim-move", { stones: 17, maxTake: 3 }), ["한 번에 최대 3개이므로 4개가 한 승리 묶음입니다.", "17을 4개씩 묶으면 1개가 남습니다.", "먼저 1개를 가져가 16개를 남깁니다.", "상대가 가져간 수와 합쳐 매번 4개가 되게 가져가면 마지막 돌을 가져갑니다."])
];
const c2CalendarVisuals = [
  visual("leap-year-count", { start: 2001, end: 2100 }), visual("weekday-offset", { start: 5, offset: 73 }),
  visual("nim-move", { stones: 23, maxTake: 3 }), visual("nim-move", { stones: 29, maxTake: 4 }),
  visual("leap-year-count", { start: 1901, end: 2000 }), visual("nim-move", { stones: 31, maxTake: 5 }),
  visual("weekday-offset", { start: 3, offset: 58 }), visual("nim-move", { stones: 26, maxTake: 4 }),
  visual("weekday-offset", { start: 6, offset: 202 }), visual("nim-move", { stones: 38, maxTake: 5 })
];

const c2ReverseTracks = [
  makeTrack("c2a2-reverse-rule", "마지막 수에서 가능한 직전 수를 찾아요", "규칙을 계산한 결과가 8이라면 직전 수는 무엇일까요?", "짝수였던 경우와 홀수였던 경우를 따로 거꾸로 계산하세요.", visual("reverse-rule", { target: 8 }), ["앞으로는 홀수×3-1, 짝수÷2입니다.", "거꾸로는 2배, 또는 1을 더해 3으로 나누기입니다.", "8의 직전 수 후보는 16과 3입니다.", "16÷2=8, 3×3-1=8을 각각 확인합니다."]),
  makeTrack("c2a2-digits", "자리 숫자의 곱을 한 자리까지 반복해요", "68은 몇 단계를 거쳐 한 자리 수가 될까요?", "6×8에서 시작해 나온 수의 자리 숫자를 다시 곱하세요.", visual("digit-product-chain", { start: 68 }), ["68의 자리 숫자 6과 8을 곱합니다.", "48이 나오면 다시 4×8을 계산합니다.", "32, 6으로 이어져 한 자리 수가 됩니다.", "68→48→32→6이므로 3단계인지 확인합니다."]),
  makeTrack("c2a2-reverse-transfer", "주고 난 뒤에서 처음 수를 되찾아요", "A가 가진 것의 1/3을 B에게 준 뒤 A가 24개라면 처음에는 몇 개였을까요?", "남은 24개는 처음의 2/3입니다.", visual("reverse-transfer", { finalA: 24, finalB: 30, denominator: 3 }), ["A가 준 양과 남은 양을 구분합니다.", "A에게 남은 24개는 처음의 2/3입니다.", "24÷2×3으로 처음 36개를 찾습니다.", "36의 1/3인 12개를 주면 A가 24개가 되는지 확인합니다."])
];
const c2ReverseVisuals = [
  visual("reverse-rule", { target: 14 }), visual("digit-product-chain", { start: 68 }),
  visual("reverse-transfer", { finalA: 30, finalB: 24, denominator: 3 }), visual("reverse-transfer", { finalA: 36, finalB: 29, denominator: 4 }),
  visual("digit-product-chain", { start: 77 }), visual("reverse-transfer", { finalA: 40, finalB: 31, denominator: 5 }),
  visual("reverse-rule", { target: 44 }), visual("reverse-transfer", { finalA: 42, finalB: 36, denominator: 3 }),
  visual("digit-product-chain", { start: 86 }), visual("reverse-transfer", { finalA: 45, finalB: 33, denominator: 4 })
];

export const COURSE02_A2_LESSONS = Object.freeze([
  makeLesson({ bookId: c2b, lessonId: "course-02-a2-clone-numbers", title: "10의 거듭제곱과 복제수를 펼쳐 계산해요", unit: "10의 거듭제곱과 복제수", concept: "복제수를 자릿값의 합으로 나누고 분배법칙으로 빠르게 계산하기", tracks: c2CloneTracks, visuals: c2CloneVisuals, sourceNote: "교사용 지도서 01단원의 복제수와 10의 거듭제곱 활동 구조를 바탕으로 수와 문장을 새로 구성했습니다." }),
  makeLesson({ bookId: c2b, lessonId: "course-02-a2-square-promises", title: "사각수와 새 연산의 약속을 찾아요", unit: "포포즈와 약속", concept: "연속한 홀수의 합을 사각수로 보고, 정의된 새 연산을 식에 정확히 대입하기", tracks: c2PromiseTracks, visuals: c2PromiseVisuals, sourceNote: "교사용 지도서 02단원의 사각수·연산 약속 활동 구조를 바탕으로 새 문제를 구성했습니다." }),
  makeLesson({ bookId: c2b, lessonId: "course-02-a2-calendar-nim", title: "요일의 반복과 님게임의 필승 묶음을 찾아요", unit: "달력과 님게임", concept: "7일 주기의 나머지와 상대와 합쳐 만드는 일정한 돌 묶음으로 결과 예측하기", tracks: c2CalendarTracks, visuals: c2CalendarVisuals, sourceNote: "교사용 지도서 03단원의 달력과 님게임 활동 구조를 바탕으로 날짜와 돌 수를 새로 구성했습니다." }),
  makeLesson({ bookId: c2b, lessonId: "course-02-a2-reverse-thinking", title: "마지막 결과에서 처음을 거꾸로 찾아요", unit: "거꾸로 생각하기", concept: "앞으로 적용한 연산이나 주고받기 과정을 역연산으로 되짚어 처음 값 찾기", tracks: c2ReverseTracks, visuals: c2ReverseVisuals, sourceNote: "교사용 지도서 04단원의 수 규칙과 표로 거꾸로 풀기 활동 구조를 바탕으로 새 문제를 구성했습니다." })
]);

const c3b = "course-03-a2";
const c3DecimalTracks = [
  makeTrack("c3a2-repeat", "같은 나머지에서 순환마디를 찾아요", "1/7의 소수에서 어떤 숫자가 반복될까요?", "나눗셈의 나머지가 다시 1이 되는 지점을 찾으세요.", visual("recurring-decimal", { numerator: 1, denominator: 7 }), ["1을 7로 나누며 나머지를 차례로 적습니다.", "나머지에 10을 곱해 다음 자리 숫자를 만듭니다.", "같은 나머지 1이 다시 나오면 한 순환마디가 끝납니다.", "142857 다음에 다시 142857이 이어지는지 확인합니다."]),
  makeTrack("c3a2-eleven", "엇갈린 자리의 합으로 11의 배수를 판정해요", "257□5가 11의 배수라면 □는 무엇일까요?", "홀수 번째 자리의 합과 짝수 번째 자리의 합의 차를 비교하세요.", visual("eleven-missing-digit", { digits: [2, 5, 7, null, 5] }), ["숫자를 왼쪽부터 한 자리씩 번갈아 두 묶음으로 나눕니다.", "첫째 묶음은 2+7+5, 둘째 묶음은 5+□입니다.", "두 합의 차가 0 또는 11의 배수가 되게 합니다.", "□=9를 넣은 25795가 11로 나누어지는지 확인합니다."]),
  makeTrack("c3a2-divisors", "소인수의 지수로 약수 수를 세요", "2³×3²의 약수는 몇 개일까요?", "2의 지수는 0~3, 3의 지수는 0~2에서 고릅니다.", visual("divisor-count", { primes: [2, 3], exponents: [3, 2] }), ["각 약수는 소인수의 지수를 골라 만듭니다.", "2의 지수는 4가지, 3의 지수는 3가지입니다.", "서로 독립인 선택 수 4×3을 계산합니다.", "직접 약수를 묶어 세어 12개인지 확인합니다."])
];
const c3DecimalVisuals = [
  visual("recurring-decimal", { numerator: 1, denominator: 3 }), visual("eleven-missing-digit", { digits: [2, 5, 7, null, 5] }),
  visual("divisor-count", { primes: [2, 3], exponents: [4, 1] }), visual("divisor-count", { primes: [2, 5, 7], exponents: [2, 1, 1] }),
  visual("recurring-decimal", { numerator: 4, denominator: 27 }), visual("eleven-missing-digit", { digits: [4, null, 5, 3, 1] }),
  visual("recurring-decimal", { numerator: 5, denominator: 13 }), visual("divisor-count", { primes: [2, 3, 11], exponents: [1, 2, 1] }),
  visual("recurring-decimal", { numerator: 7, denominator: 11 }), visual("eleven-missing-digit", { digits: [7, 4, 6, null, 9] })
];

const c3GcdTracks = [
  makeTrack("c3a2-gcd-lcm", "최대공약수와 최소공배수를 연결해요", "36과 84의 최대공약수와 최소공배수를 찾아볼까요?", "두 수를 공통 부분과 서로소인 부분으로 나누세요.", visual("gcd-lcm", { a: 36, b: 84, ask: "lcm" }), ["두 수를 소인수 또는 공통 묶음으로 나눕니다.", "공통으로 묶이는 가장 큰 수는 12입니다.", "36×84=최대공약수×최소공배수를 사용합니다.", "최소공배수 252가 두 수로 모두 나누어지는지 확인합니다."]),
  makeTrack("c3a2-cycle", "반복 일정이 다시 만나는 때를 찾아요", "8분, 12분, 18분 간격의 일이 다시 동시에 시작하는 때는 언제일까요?", "세 간격의 최소공배수를 찾으세요.", visual("schedule-cycle", { intervals: [8, 12, 18] }), ["각 일이 시작되는 시간을 배수로 표시합니다.", "두 일정이 만나는 시간을 먼저 찾고 세 번째와 비교합니다.", "8, 12, 18의 최소공배수는 72입니다.", "72가 세 간격으로 모두 나누어지는지 확인합니다."])
];
const c3GcdVisuals = [
  visual("gcd-lcm", { a: 48, b: 72, ask: "gcd" }), visual("gcd-lcm", { a: 45, b: 60, ask: "lcm" }),
  visual("schedule-cycle", { intervals: [6, 8] }), visual("schedule-cycle", { intervals: [9, 12, 15] }),
  visual("gcd-lcm", { a: 56, b: 98, ask: "gcd" }), visual("schedule-cycle", { intervals: [10, 14] }),
  visual("gcd-lcm", { a: 64, b: 80, ask: "lcm" }), visual("schedule-cycle", { intervals: [12, 18, 30] }),
  visual("gcd-lcm", { a: 75, b: 105, ask: "gcd" }), visual("schedule-cycle", { intervals: [16, 20, 24] })
];

const c3SpeedTracks = [
  makeTrack("c3a2-equation", "양변에 같은 계산을 해 x를 남겨요", "5x+3=28을 어떻게 풀까요?", "양변에서 3을 빼고 5로 나누세요.", visual("linear-equation", { a: 5, b: 3, c: 28 }), ["등호의 양쪽 값은 같습니다.", "양변에서 3을 빼 5x=25로 만듭니다.", "양변을 5로 나누어 x=5를 구합니다.", "5×5+3=28인지 원래 식에 넣어 확인합니다."]),
  makeTrack("c3a2-catch", "먼저 간 거리와 속력 차를 비교해요", "분속 60m로 간 사람을 8분 뒤 분속 180m로 따라가면 몇 분 뒤 만날까요?", "먼저 간 거리 480m를 속력 차 120m로 나누세요.", visual("catch-up", { slow: 60, delay: 8, fast: 180 }), ["앞사람이 먼저 간 거리를 구합니다.", "두 사람 사이의 거리는 60×8=480m입니다.", "매분 줄어드는 거리는 180-60=120m입니다.", "480÷120=4분 뒤 두 사람의 이동 위치가 같은지 확인합니다."])
];
const c3SpeedVisuals = [
  visual("linear-equation", { a: 4, b: 7, c: 39 }), visual("linear-equation", { a: 7, b: -5, c: 30 }),
  visual("catch-up", { slow: 70, delay: 6, fast: 140 }), visual("catch-up", { slow: 80, delay: 9, fast: 200 }),
  visual("linear-equation", { a: 6, b: 11, c: 53 }), visual("catch-up", { slow: 50, delay: 12, fast: 150 }),
  visual("linear-equation", { a: 9, b: -8, c: 55 }), visual("catch-up", { slow: 90, delay: 10, fast: 240 }),
  visual("linear-equation", { a: 8, b: 6, c: 70 }), visual("catch-up", { slow: 60, delay: 15, fast: 210 })
];

const c3LineTracks = [
  makeTrack("c3a2-midpoint", "두 좌표의 한가운데를 찾아요", "-6과 10의 중점은 어디일까요?", "두 좌표의 합을 2로 나누세요.", visual("midpoint", { a: -6, b: 10 }), ["두 점을 수직선에 정확히 표시합니다.", "두 점 사이를 같은 길이로 나누는 점을 찾습니다.", "(-6+10)÷2=2를 계산합니다.", "2에서 양쪽 점까지 거리가 각각 8인지 확인합니다."]),
  makeTrack("c3a2-absolute", "절댓값을 기준점에서의 거리로 봐요", "|x-3|=5인 두 점은 어디일까요?", "3에서 왼쪽과 오른쪽으로 각각 5만큼 이동하세요.", visual("absolute-equation", { center: 3, radius: 5 }), ["절댓값은 수직선 위 두 점 사이의 거리입니다.", "기준점 3과 거리가 5인 점을 양쪽에서 찾습니다.", "3-5=-2, 3+5=8입니다.", "-2와 8이 모두 3에서 5만큼 떨어졌는지 확인합니다."])
];
const c3LineVisuals = [
  visual("midpoint", { a: -8, b: 4 }), visual("distance", { a: -7, b: 9 }),
  visual("absolute-equation", { center: -2, radius: 6 }), visual("midpoint", { a: -15, b: 7 }),
  visual("distance", { a: -12, b: -3 }), visual("absolute-equation", { center: 5, radius: 9 }),
  visual("midpoint", { a: -4, b: 18 }), visual("distance", { a: 13, b: -11 }),
  visual("absolute-equation", { center: 0, radius: 12 }), visual("midpoint", { a: -21, b: 5 })
];

export const COURSE03_A2_LESSONS = Object.freeze([
  makeLesson({ bookId: c3b, lessonId: "course-03-a2-decimals-divisors", title: "순환마디와 약수의 개수를 규칙으로 찾아요", unit: "유한소수와 순환소수", concept: "나눗셈의 반복되는 나머지로 순환마디를 찾고 소인수 지수의 선택 수로 약수 개수 구하기", tracks: c3DecimalTracks, visuals: c3DecimalVisuals, sourceNote: "교사용 지도서 01단원의 순환소수와 약수 개수 활동 구조를 바탕으로 새 수를 구성했습니다." }),
  makeLesson({ bookId: c3b, lessonId: "course-03-a2-gcd-lcm", title: "최대공약수와 최소공배수를 상황에 맞게 골라요", unit: "최대공약수와 최소공배수", concept: "두 수의 공통 묶음과 반복 일정의 첫 만남을 구분해 최대공약수 또는 최소공배수 적용하기", tracks: c3GcdTracks, visuals: c3GcdVisuals, sourceNote: "교사용 지도서 02단원의 두 수 관계와 반복 일정 활동 구조를 바탕으로 새 문제를 구성했습니다." }),
  makeLesson({ bookId: c3b, lessonId: "course-03-a2-equations-speed", title: "방정식과 상대속력으로 모르는 값을 찾아요", unit: "상대속도와 따라잡기", concept: "등식의 양변을 같은 방식으로 정리하고 먼저 간 거리를 상대속력으로 나누어 따라잡는 시간 구하기", tracks: c3SpeedTracks, visuals: c3SpeedVisuals, sourceNote: "교사용 지도서 03단원의 방정식과 상대속도 활동 구조를 바탕으로 수와 상황을 새로 구성했습니다." }),
  makeLesson({ bookId: c3b, lessonId: "course-03-a2-number-line", title: "수직선에서 중점과 절댓값을 거리로 읽어요", unit: "수직선좌표와 절대값", concept: "좌표를 수직선에 표시하고 중점, 두 점 사이 거리, 절댓값 방정식의 두 해 구하기", tracks: c3LineTracks, visuals: c3LineVisuals, sourceNote: "교사용 지도서 04단원의 수직선 좌표와 절댓값 활동 구조를 바탕으로 새 좌표를 구성했습니다." })
]);

function numberLineMarkup(values, highlighted = []) {
  const minimum = Math.min(...values) - 2; const maximum = Math.max(...values) + 2;
  const width = 520; const left = 28; const right = width - 28;
  const x = (value) => left + (value - minimum) / (maximum - minimum) * (right - left);
  const ticks = Array.from(new Set([minimum, maximum, 0, ...values])).sort((a, b) => a - b).map((value) => `<g transform="translate(${x(value)} 0)"><line y1="49" y2="61"/><text y="82">${esc(value)}</text></g>`).join("");
  const points = values.map((value, index) => `<g class="${highlighted.includes(index) ? "is-answer" : ""}" transform="translate(${x(value)} 0)"><circle cy="55" r="7"/><text y="35">${String.fromCharCode(65 + index)}</text></g>`).join("");
  return `<svg class="course23-a2-numberline" viewBox="0 0 ${width} 96" role="img" aria-label="수직선"><line class="axis" x1="${left}" y1="55" x2="${right}" y2="55"/>${ticks}${points}</svg>`;
}

export function course23A2ConceptMarkup(data) {
  if (!data || data.kind !== "course23-a2") return "";
  const phase = data.phase || "problem"; const model = course23A2Model(data);
  let body = "";
  if (data.task === "clone-number") {
    const terms = data.positions.map((position) => 10 ** position);
    body = `<div class="a2-place-row"><b>${data.base}</b><span>×</span><b>${model.multiplier}</b></div>${phase === "problem" ? "" : `<div class="a2-place-parts">${terms.map((term) => `<span>${term}</span>`).join("<b>+</b>")}</div>`}${["calculate", "verify"].includes(phase) ? `<p>${terms.map((term) => `${data.base}×${term}`).join(" + ")} = <strong>${model.answer}</strong></p>` : ""}`;
  } else if (["odd-square", "square-last-odd"].includes(data.task)) {
    const count = data.task === "odd-square" ? model.count : model.root;
    const cells = Array.from({ length: Math.min(count ** 2, 100) }, (_, i) => `<i class="${i >= (count - 1) ** 2 ? "new" : ""}"></i>`).join("");
    body = `<div class="a2-square-grid" style="--n:${count}">${cells}</div><p>${data.task === "odd-square" ? `1+3+…+${data.lastOdd} = ${count}×${count}` : `${data.square}=${count}×${count}, ${count}번째 홀수`}${phase === "verify" ? ` = <strong>${model.answer}</strong>` : ""}</p>`;
  } else if (data.task === "operator-rule") {
    const rule = data.rule === "sum-minus" ? `A+B-${data.k}` : data.rule === "multiply-add-first" ? "A×B+A" : "(A+B)×|A-B|";
    body = `<div class="a2-operator"><span>A○B</span><b>=</b><span>${rule}</span></div>${phase === "problem" ? "" : `<p>A=${data.a}, B=${data.b}</p>`}${phase === "verify" ? `<strong class="a2-answer">${data.a}○${data.b} = ${model.answer}</strong>` : ""}`;
  } else if (data.task === "four-fours") {
    body = `<div class="a2-four-fours">${data.options.map((option, index) => `<span class="${phase === "verify" && index + 1 === model.answer ? "answer" : ""}"><b>${index + 1}</b>${esc(option.label)}${phase === "problem" ? "" : `<small>= ${option.value}</small>`}</span>`).join("")}</div>${phase === "verify" ? `<p>조건에 맞는 식은 <strong>${model.answer}번</strong></p>` : ""}`;
  } else if (data.task === "weekday-offset") {
    body = `<div class="a2-weekdays">${weekdays.map((day, index) => `<span class="${index === data.start ? "start" : ""} ${phase === "verify" && index === model.index ? "answer" : ""}">${day.slice(0, 1)}</span>`).join("")}</div><p>${data.offset} = 7 × ${Math.floor(data.offset / 7)} + ${data.offset % 7}${phase === "verify" ? ` → <strong>${model.answer}</strong>` : ""}</p>`;
  } else if (data.task === "leap-year-count") {
    const years = Array.from({ length: data.end - data.start + 1 }, (_, index) => data.start + index).filter((year) => year % 4 === 0);
    const shownYears = years.length > 14 ? [...years.slice(0, 7), null, ...years.slice(-7)] : years;
    body = `<div class="a2-leap-years">${shownYears.map((year) => year === null ? "<b>…</b>" : `<span class="${year % 400 === 0 ? "include" : year % 100 === 0 ? "exclude" : "include"}">${year}</span>`).join("")}</div><p>4의 배수 - 100의 배수 + 400의 배수${phase === "verify" ? ` = <strong>${model.answer}번</strong>` : ""}</p>`;
  } else if (data.task === "nim-move") {
    const stones = Array.from({ length: data.stones }, (_, i) => `<i class="${phase !== "problem" && (i + 1) % model.cycle === 0 ? "group-end" : ""} ${phase === "verify" && i < model.answer ? "take" : ""}"></i>`).join("");
    body = `<div class="a2-stones">${stones}</div><p>${data.stones} = ${model.cycle} × ${Math.floor(data.stones / model.cycle)} + ${model.answer}${phase === "verify" ? ` → 먼저 <strong>${model.answer}개</strong>` : ""}</p>`;
  } else if (data.task === "reverse-rule") {
    body = `<div class="a2-reverse"><strong>${data.target}</strong><div>${model.predecessors.map((value) => `<span>${value}<small>${value % 2 ? "×3-1" : "÷2"}</small></span>`).join("")}</div></div>${phase === "verify" ? `<p>직전 수의 합 = <strong>${model.answer}</strong></p>` : ""}`;
  } else if (data.task === "reverse-transfer") {
    body = `<div class="a2-transfer"><span>A <b>${phase === "verify" ? model.initialA : "?"}</b></span><i>1/${data.denominator}을 B에게</i><span>A <b>${data.finalA}</b> · B <b>${data.finalB}</b></span></div>${phase === "verify" ? `<p>${data.finalA}÷${data.denominator - 1}×${data.denominator} = <strong>${model.answer}</strong></p>` : ""}`;
  } else if (data.task === "digit-product-chain") {
    body = `<div class="a2-digit-chain">${model.sequence.map((value, index) => `<span>${value}${index < model.sequence.length - 1 ? "<small>자리 숫자를 곱해요</small>" : ""}</span>`).join("<b>→</b>")}</div>${phase === "verify" ? `<p>한 자리 수까지 <strong>${model.answer}단계</strong></p>` : ""}`;
  } else if (data.task === "recurring-decimal") {
    body = `<div class="a2-decimal"><span>${data.numerator}/${data.denominator}</span><b>=</b><span>${model.decimal}${model.period ? "…" : ""}</span></div>${phase === "verify" ? `<p>순환마디 <strong>${model.period}</strong></p>` : ""}`;
  } else if (data.task === "divisor-count") {
    body = `<div class="a2-primes">${data.primes.map((prime, i) => `<span>${prime}<sup>${data.exponents[i]}</sup></span>`).join("<b>×</b>")}</div>${phase === "problem" ? "" : `<p>${data.exponents.map((exponent) => `(${exponent}+1)`).join(" × ")}${phase === "verify" ? ` = <strong>${model.answer}개</strong>` : ""}</p>`}`;
  } else if (data.task === "eleven-missing-digit") {
    body = `<div class="a2-eleven-digits">${data.digits.map((digit) => `<span>${digit === null ? (phase === "verify" ? model.answer : "□") : digit}</span>`).join("")}</div><p>엇갈린 자리의 합을 비교해요.${phase === "verify" ? ` 빈칸은 <strong>${model.answer}</strong>` : ""}</p>`;
  } else if (data.task === "gcd-lcm") {
    body = `<div class="a2-gcd"><span>${data.a}</span><b>공통 묶음</b><span>${data.b}</span></div>${phase === "problem" ? "" : `<p>최대공약수 ${model.gcd} · 최소공배수 ${model.lcm}</p>`}${phase === "verify" ? `<strong class="a2-answer">답 ${model.answer}</strong>` : ""}`;
  } else if (data.task === "schedule-cycle") {
    body = `<div class="a2-schedules">${data.intervals.map((interval) => `<span>${interval}분 간격<small>${Array.from({ length: Math.min(6, model.answer / interval) }, (_, i) => (i + 1) * interval).join(" · ")}</small></span>`).join("")}</div>${phase === "verify" ? `<p>처음 다시 만나는 때 <strong>${model.answer}분 뒤</strong></p>` : ""}`;
  } else if (data.task === "linear-equation") {
    body = `<div class="a2-equation"><p>${data.a}x ${data.b < 0 ? "-" : "+"} ${Math.abs(data.b)} = ${data.c}</p>${phase === "problem" ? "" : `<p>${data.a}x = ${data.c - data.b}</p>`}${["calculate", "verify"].includes(phase) ? `<p>x = (${data.c - data.b}) ÷ ${data.a}</p>` : ""}${phase === "verify" ? `<strong>x = ${model.answer}</strong>` : ""}</div>`;
  } else if (data.task === "catch-up") {
    body = `<div class="a2-catch"><span>먼저 간 사람<br><b>${data.slow}m/분</b></span><i style="--gap:${Math.min(100, model.gap / 8)}px"></i><span>따라가는 사람<br><b>${data.fast}m/분</b></span></div>${phase === "problem" ? "" : `<p>거리 차 ${model.gap}m · 상대속력 ${model.relative}m/분</p>`}${phase === "verify" ? `<strong class="a2-answer">${model.answer}분 뒤</strong>` : ""}`;
  } else {
    const values = data.task === "absolute-equation" ? [data.center, ...model.values] : [data.a, data.b, model.answer];
    const labels = data.task === "absolute-equation" ? [0, ...(phase === "verify" ? [1, 2] : [])] : phase === "verify" ? [2] : [];
    body = `${numberLineMarkup(values, labels)}<p>${data.task === "midpoint" ? `(${data.a}+${data.b})÷2` : data.task === "distance" ? `|${data.a}-${data.b}|` : `${data.center}±${data.radius}`}${phase === "verify" ? ` = <strong>${model.answer}</strong>` : ""}</p>`;
  }
  return `<div class="course23-a2-visual" data-task="${esc(data.task)}" data-phase="${esc(phase)}">${body}</div>`;
}
