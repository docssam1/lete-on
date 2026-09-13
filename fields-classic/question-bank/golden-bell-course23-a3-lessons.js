const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const gcdAll = (values) => values.reduce(gcd);
const choose = (n, r) => {
  const k = Math.min(r, n - r);
  let value = 1;
  for (let i = 1; i <= k; i += 1) value = value * (n - k + i) / i;
  return value;
};
const triangular = (n) => n * (n + 1) / 2;
const cleanNumber = (value) => Math.abs(value - Math.round(value)) < 1e-9 ? Math.round(value) : Number(value.toFixed(6));

function digitTotal(end) {
  let total = 0;
  for (let start = 1, digits = 1; start <= end; start *= 10, digits += 1) {
    total += (Math.min(end, start * 10 - 1) - start + 1) * digits;
  }
  return total;
}

function digitAt(position) {
  let remaining = position;
  let start = 1;
  let digits = 1;
  while (remaining > 9 * start * digits) {
    remaining -= 9 * start * digits;
    start *= 10;
    digits += 1;
  }
  const number = start + Math.floor((remaining - 1) / digits);
  const offset = (remaining - 1) % digits;
  return { number, offset, answer: Number(String(number)[offset]) };
}

function digitOccurrences(end, target) {
  let count = 0;
  for (let value = 1; value <= end; value += 1) {
    count += [...String(value)].filter((digit) => Number(digit) === target).length;
  }
  return count;
}

function latticeCount(width, height, blocked = []) {
  const blockedSet = new Set(blocked.map(([x, y, direction]) => `${x},${y},${direction}`));
  const table = Array.from({ length: height + 1 }, () => Array(width + 1).fill(0));
  table[0][0] = 1;
  for (let y = 0; y <= height; y += 1) {
    for (let x = 0; x <= width; x += 1) {
      if (x < width && !blockedSet.has(`${x},${y},R`)) table[y][x + 1] += table[y][x];
      if (y < height && !blockedSet.has(`${x},${y},D`)) table[y + 1][x] += table[y][x];
    }
  }
  return { table, answer: table[height][width] };
}

function ratioText(values) {
  const divisor = gcdAll(values);
  return values.map((value) => value / divisor).join(":");
}

export function course23A3Model(visual) {
  if (!visual || visual.kind !== "course23-a3") throw new TypeError("A course23 A3 visual is required");
  switch (visual.task) {
    case "kaprekar-sum": {
      const square = visual.n ** 2;
      const power = 10 ** String(visual.n).length;
      const front = Math.floor(square / power);
      const back = square % power;
      return { square, front, back, answer: front + back };
    }
    case "power-last": {
      let answer = 1;
      for (let i = 0; i < visual.exponent; i += 1) answer = (answer * visual.base) % 10;
      return { answer };
    }
    case "arithmetic-nth": return { answer: visual.first + visual.diff * (visual.index - 1) };
    case "arithmetic-index": return { answer: (visual.target - visual.first) / visual.diff + 1 };
    case "gauss-sum": return { last: visual.first + visual.diff * (visual.count - 1), answer: visual.count * (2 * visual.first + (visual.count - 1) * visual.diff) / 2 };
    case "triangular": return { answer: triangular(visual.n) };
    case "grouped-cell": return { before: triangular(visual.row - 1), answer: triangular(visual.row - 1) + visual.column };
    case "digit-total": return { answer: digitTotal(visual.end) };
    case "digit-at": return digitAt(visual.position);
    case "digit-occurrences": return { answer: digitOccurrences(visual.end, visual.digit) };
    case "permutation-count": {
      const n = visual.digits.length;
      const hasZero = visual.digits.includes(0);
      const answer = hasZero
        ? (n - 1) * Array.from({ length: visual.length - 1 }, (_, i) => n - 1 - i).reduce((product, value) => product * value, 1)
        : Array.from({ length: visual.length }, (_, i) => n - i).reduce((product, value) => product * value, 1);
      return { answer };
    }
    case "lattice-path": return latticeCount(visual.width, visual.height, visual.blocked);
    case "linked-ratio": {
      const common = visual.ab[1] * visual.bc[0] / gcd(visual.ab[1], visual.bc[0]);
      const values = [visual.ab[0] * common / visual.ab[1], common, visual.bc[1] * common / visual.bc[0]];
      return { values, answer: ratioText(values) };
    }
    case "ratio-change": {
      const k = (visual.final[0] * visual.change[1] - visual.final[1] * visual.change[0]) /
        (visual.final[1] * visual.initial[0] - visual.final[0] * visual.initial[1]);
      return { k, originalA: visual.initial[0] * k, originalB: visual.initial[1] * k, answer: visual.initial[0] * k };
    }
    case "work-together": return { answer: visual.a * visual.b / (visual.a + visual.b) };
    case "pipe-pair": {
      const rate = 2 / visual.all - 1 / visual.ab - 1 / visual.ac;
      return { rate, answer: cleanNumber(1 / rate) };
    }
    case "clock-angle": {
      const raw = Math.abs(30 * (visual.hour % 12) - 5.5 * visual.minute);
      return { raw, answer: Math.min(raw, 360 - raw) };
    }
    case "average-roundtrip": return { answer: cleanNumber(2 * visual.outbound * visual.returning / (visual.outbound + visual.returning)) };
    case "mixed-speed-time": return { answer: cleanNumber((visual.fast * visual.totalTime - visual.distance) / (visual.fast - visual.slow)) };
    case "step-catch": {
      const speedRatio = visual.aSteps / visual.bSteps * visual.bStrideUnits / visual.aStrideUnits;
      return { speedRatio, answer: cleanNumber(visual.gapBSteps / (1 - speedRatio)) };
    }
    case "train-tunnel": return { answer: (visual.longTunnel - visual.shortTunnel) / (visual.longTime - visual.shortTime) };
    case "boat-down-time": {
      const upstreamSpeed = visual.distance / visual.upstreamHours;
      const downstreamSpeed = upstreamSpeed + visual.speedDifference;
      return { upstreamSpeed, downstreamSpeed, answer: cleanNumber(visual.distance / downstreamSpeed * 60) };
    }
    case "concentration-add": return { answer: cleanNumber((visual.target - visual.initial) * visual.mass / (visual.added - visual.target)) };
    case "concentration-mix": return { answer: cleanNumber((visual.c1 * visual.m1 + visual.c2 * visual.m2) / (visual.m1 + visual.m2)) };
    case "concentration-parts": {
      const first = (visual.target - visual.c2) * visual.total / (visual.c1 - visual.c2);
      return { first, second: visual.total - first, answer: first };
    }
    case "percent-population": {
      const male = (visual.change + visual.femaleDecrease * visual.total) / (visual.maleIncrease + visual.femaleDecrease);
      return { male: cleanNumber(male), female: cleanNumber(visual.total - male), answer: cleanNumber(male * (1 + visual.maleIncrease)) };
    }
    case "lever-ratio": {
      const high = visual.target - visual.low;
      const low = visual.high - visual.target;
      return { high, low, answer: ratioText([high, low]) };
    }
    default: throw new RangeError(`Unknown course23 A3 task: ${visual.task}`);
  }
}

const visual = (task, values, phase = "problem") => ({ kind: "course23-a3", task, ...values, phase });
const withPhase = (base, phase) => ({ ...base, phase });

function promptFor(data) {
  switch (data.task) {
    case "kaprekar-sum": return `${data.n}²을 계산한 뒤 앞부분과 뒤 ${String(data.n).length}자리를 더한 값을 구하세요.`;
    case "power-last": return `${data.base}을 ${data.exponent}번 곱한 수의 일의 자리 숫자를 구하세요.`;
    case "arithmetic-nth": return `${data.first}부터 ${Math.abs(data.diff)}씩 ${data.diff > 0 ? "커지는" : "작아지는"} 수열의 ${data.index}번째 수를 구하세요.`;
    case "arithmetic-index": return `${data.first}부터 ${Math.abs(data.diff)}씩 ${data.diff > 0 ? "커지는" : "작아지는"} 수열에서 ${data.target}은 몇 번째 수인지 구하세요.`;
    case "gauss-sum": return `${data.first}부터 시작해 ${Math.abs(data.diff)}씩 ${data.diff > 0 ? "커지는" : "작아지는"} ${data.count}개 수의 합을 구하세요.`;
    case "triangular": return `1부터 ${data.n}까지의 합인 ${data.n}번째 삼각수를 구하세요.`;
    case "grouped-cell": return `첫째 줄에 1개, 둘째 줄에 2개씩 자연수를 이어 쓸 때 ${data.row}번째 줄의 ${data.column}번째 수를 구하세요.`;
    case "digit-total": return `1부터 ${data.end}까지 자연수를 이어 쓸 때 사용한 숫자는 모두 몇 개인가요?`;
    case "digit-at": return `123456789101112…에서 ${data.position}번째 숫자를 구하세요.`;
    case "digit-occurrences": return `1부터 ${data.end}까지 쓸 때 숫자 ${data.digit}은 모두 몇 번 쓰이나요?`;
    case "permutation-count": return `숫자 카드 ${data.digits.join(", ")} 중 ${data.length}장을 골라 한 번씩만 써서 만들 수 있는 ${data.length}자리 수는 몇 개인가요?`;
    case "lattice-path": return `${data.width}칸 가로, ${data.height}칸 세로 격자에서 오른쪽과 아래쪽으로만 가는 최단 경로는 몇 가지인가요?${data.blocked?.length ? " 빨간 길은 지나갈 수 없습니다." : ""}`;
    case "linked-ratio": return `A:B=${data.ab.join(":")}, B:C=${data.bc.join(":")}일 때 A:B:C를 가장 간단한 자연수의 비로 나타내세요.`;
    case "ratio-change": return `A와 B의 수가 ${data.initial.join(":")}이고 A는 ${data.change[0]}만큼, B는 ${data.change[1]}만큼 변한 뒤 ${data.final.join(":")}가 되었습니다. 처음 A의 수를 구하세요.`;
    case "work-together": return `A 혼자 ${data.a}일, B 혼자 ${data.b}일 걸리는 일을 함께 하면 며칠 걸리나요?`;
    case "pipe-pair": return `A·B·C 수도관은 ${data.all}분, A·B는 ${data.ab}분, A·C는 ${data.ac}분에 탱크를 채웁니다. B·C만 쓰면 몇 분 걸리나요?`;
    case "clock-angle": return `${data.hour}시 ${data.minute}분에 시침과 분침이 이루는 작은 각의 크기를 구하세요.`;
    case "average-roundtrip": return `같은 거리를 갈 때 시속 ${data.outbound}km, 올 때 시속 ${data.returning}km였습니다. 왕복 평균속력을 구하세요.`;
    case "mixed-speed-time": return `총 ${data.distance}km를 ${data.totalTime}시간 동안 이동했습니다. 처음에는 시속 ${data.slow}km, 나중에는 시속 ${data.fast}km였습니다. 느린 속력으로 간 시간은 몇 시간인가요?`;
    case "step-catch": return `A가 ${data.aSteps}걸음 걷는 동안 B는 ${data.bSteps}걸음을 걷고, A의 ${data.aStrideUnits}걸음 거리는 B의 ${data.bStrideUnits}걸음 거리와 같습니다. A가 B보다 B의 걸음으로 ${data.gapBSteps}걸음 앞서 있을 때 B는 몇 걸음 뒤에 따라잡나요?`;
    case "train-tunnel": return `${data.longTunnel}m 터널을 ${data.longTime}초, ${data.shortTunnel}m 다리를 ${data.shortTime}초에 완전히 통과한 기차의 초속을 구하세요.`;
    case "boat-down-time": return `${data.distance}km를 거슬러 ${data.upstreamHours}시간 걸렸고 내려갈 때 속력은 시속 ${data.speedDifference}km 더 빠릅니다. 내려가는 데 걸린 시간은 몇 분인가요?`;
    case "concentration-add": return `${data.initial}% 소금물 ${data.mass}g에 ${data.added}% 소금물을 넣어 ${data.target}%로 만들려 합니다. 몇 g을 넣어야 하나요?`;
    case "concentration-mix": return `${data.c1}% 용액 ${data.m1}g과 ${data.c2}% 용액 ${data.m2}g을 섞은 농도를 구하세요.`;
    case "concentration-parts": return `${data.c1}%와 ${data.c2}% 용액을 섞어 ${data.target}% 용액 ${data.total}g을 만듭니다. ${data.c1}% 용액은 몇 g 필요한가요?`;
    case "percent-population": return `지난해 학생은 ${data.total}명입니다. 남학생은 ${data.maleIncrease * 100}% 늘고 여학생은 ${data.femaleDecrease * 100}% 줄어 전체가 ${data.change}명 늘었습니다. 올해 남학생 수를 구하세요.`;
    case "lever-ratio": return `${data.high}% 용액과 ${data.low}% 용액을 섞어 ${data.target}%로 만들 때 높은 농도:낮은 농도의 양의 비를 구하세요.`;
    default: throw new RangeError(`Missing prompt for ${data.task}`);
  }
}

function hintFor(data) {
  const hints = {
    "kaprekar-sum": "제곱한 수를 원래 수의 자릿수만큼 뒤에서 끊으세요.", "power-last": "일의 자리만 곱하며 다시 나온 순환마디를 찾으세요.",
    "arithmetic-nth": "첫수에서 공차를 순서보다 한 번 적게 더합니다.", "arithmetic-index": "첫수와 목표 수의 차를 공차로 나눈 뒤 1을 더합니다.",
    "gauss-sum": "첫수와 끝수를 짝지어 수의 개수만큼 곱한 뒤 2로 나누세요.", "triangular": "n번째 삼각수는 n×(n+1)÷2입니다.",
    "grouped-cell": "앞줄까지의 수는 삼각수이고, 그 뒤에 줄 안의 순서를 더합니다.", "digit-total": "한 자리, 두 자리, 세 자리 수가 쓰는 숫자를 따로 세세요.",
    "digit-at": "한 자리 수 구간부터 사용한 숫자 수를 차례로 빼세요.", "digit-occurrences": "자리별로 목표 숫자가 반복되는 묶음을 세세요.",
    "permutation-count": "첫 자리에 0이 올 수 없는 경우를 먼저 처리하세요.", "lattice-path": "각 점에는 위와 왼쪽에서 오는 방법 수를 더해 적으세요.",
    "linked-ratio": "두 비에서 B의 수를 최소공배수로 같게 만드세요.", "ratio-change": "처음 수를 같은 묶음 수 k로 놓고 바뀐 뒤의 비례식을 세우세요.",
    "work-together": "하루에 하는 일의 양을 각각 전체의 몇 분의 몇으로 나타내세요.", "pipe-pair": "세 관의 합을 두 번 더한 뒤 A+B와 A+C를 빼면 B+C입니다.",
    "clock-angle": "분침은 1분에 6도, 시침은 1분에 0.5도 움직입니다.", "average-roundtrip": "거리가 같으므로 전체 거리 2묶음을 전체 시간으로 나누세요.",
    "mixed-speed-time": "느린 시간과 빠른 시간의 합, 이동 거리의 합을 식으로 세우세요.", "step-catch": "걸음 수와 보폭을 함께 사용해 두 사람의 속력 비를 먼저 구하세요.",
    "train-tunnel": "두 통과 거리의 차는 터널 길이 차와 같아 기차 길이가 없어집니다.", "boat-down-time": "거슬러 간 속력을 먼저 구하고 속력 차를 더하세요.",
    "concentration-add": "넣기 전과 후의 용질 양이 같아지는 식을 세우세요.", "concentration-mix": "각 용액의 용질 양을 더해 전체 용액의 양으로 나누세요.",
    "concentration-parts": "전체 양과 농도 차를 지렛대의 양쪽 거리처럼 비교하세요.", "percent-population": "지난해 남녀를 두 미지수로 놓고 전체 수와 증감 수를 식으로 세우세요.",
    "lever-ratio": "두 농도와 목표 농도의 차를 반대쪽 양의 비로 놓으세요."
  };
  return hints[data.task];
}

function typeFor(task) {
  return ({
    "kaprekar-sum": "제곱수를 두 부분으로 나누어 카프리카 규칙 확인하기", "power-last": "거듭제곱의 일의 자리 순환마디 찾기",
    "arithmetic-nth": "등차수열의 특정 번째 수 구하기", "arithmetic-index": "등차수열에서 주어진 수의 순서 구하기",
    "gauss-sum": "가우스의 짝짓기로 등차수열의 합 구하기", "triangular": "연속한 자연수의 합으로 삼각수 구하기",
    "grouped-cell": "삼각수로 줄별 수 배열의 위치 찾기", "digit-total": "자릿수 구간별로 사용한 숫자의 총개수 구하기",
    "digit-at": "이어 쓴 자연수에서 특정 번째 숫자 찾기", "digit-occurrences": "자연수 범위에서 특정 숫자의 사용 횟수 세기",
    "permutation-count": "서로 다른 숫자 카드로 만들 수 있는 수 세기", "lattice-path": "막힌 길을 반영해 격자의 최단 경로 세기",
    "linked-ratio": "공통항을 맞추어 연비 만들기", "ratio-change": "증감 뒤의 비로 처음 수 구하기",
    "work-together": "단위시간의 일의 양을 더해 함께 걸리는 시간 구하기", "pipe-pair": "수도관 조합의 일률로 남은 두 관의 시간 구하기",
    "clock-angle": "시침과 분침의 속력 차로 작은 각 구하기", "average-roundtrip": "같은 거리 왕복의 평균속력 구하기",
    "mixed-speed-time": "두 속력으로 이동한 시간을 연립해 구하기", "step-catch": "걸음 수와 보폭으로 따라잡는 걸음 수 구하기",
    "train-tunnel": "통과 거리 차로 기차의 속력 구하기", "boat-down-time": "물의 흐름에 따른 하류 이동 시간 구하기",
    "concentration-add": "서로 다른 농도의 용액을 더해 목표 농도 만들기", "concentration-mix": "용질의 양으로 섞은 용액의 농도 구하기",
    "concentration-parts": "지렛대 원리로 두 용액의 양 구하기", "percent-population": "서로 다른 증감률로 집단별 인원 구하기",
    "lever-ratio": "농도 차의 반대비로 섞는 양의 비 구하기"
  })[task];
}

function makeItems(bookId, lessonId, visuals) {
  return visuals.map((itemVisual, index) => {
    const slot = index < 4 ? `practice-${index + 1}` : index === 4 ? "extension" : `similar-${index - 4}`;
    return {
      id: `${lessonId}:${slot}`, prompt: promptFor(itemVisual), hint: hintFor(itemVisual), visual: itemVisual,
      answerMode: "input", inputMode: ["linked-ratio", "lever-ratio"].includes(itemVisual.task) ? "text" : "numeric",
      typeLabel: typeFor(itemVisual.task), sourceNo: "", printGroup: index % 2 + 1,
      answerRef: `/course23/${bookId}/${lessonId}/${slot}`
    };
  });
}

function makeTrack(id, title, openingPrompt, hint, baseVisual, captions) {
  return { id, title, openingPrompt, hint, beats: ["problem", "organize", "calculate", "verify"].map((phase, index) => ({ caption: captions[index], visual: withPhase(baseVisual, phase) })) };
}

function makeLesson({ bookId, lessonId, title, unit, concept, tracks, visuals, sourceNote }) {
  const items = makeItems(bookId, lessonId, visuals);
  return Object.freeze({
    id: lessonId, bookId, courseId: bookId.startsWith("course-02") ? "course-02" : "course-03", label: "A3",
    title, unit, status: "pilot", learnerStage: `필즈 더 클래식 ${bookId.startsWith("course-02") ? "2과정" : "3과정"} A3; 연령 미확정`,
    representativeConcept: concept,
    story: { title: "개념 실험실", text: "교재의 활동과 권별 테스트에서 확인한 사고 과정을 움직이는 그림으로 익힙니다.", mission: "조건을 식과 그림으로 정리하고 원래 조건으로 검산하세요." },
    explanation: { headline: title, steps: tracks.map((track) => track.title) },
    experience: { kind: "course-concept", tracks, openingPrompt: tracks[0].openingPrompt, hint: tracks[0].hint, beats: tracks[0].beats },
    original: { title: "연습", prompt: "개념을 적용해 문제를 풀고 문제마다 바로 확인하세요.", mode: "paged", separateConceptPrint: true, items: items.slice(0, 4) },
    extension: items[4], similarPractice: items.slice(5),
    dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: 7 },
    sourceTypeIds: [], source: { origin: "textbook-derived", note: sourceNote }
  });
}

const c2 = "course-02-a3";
const c2SequenceTracks = [
  makeTrack("c2a3-kaprekar", "제곱수를 두 부분으로 나눠요", "45²의 앞부분과 뒤 두 자리를 더하면 왜 45가 될까요?", "2025를 20과 25로 나누세요.", visual("kaprekar-sum", { n: 45 }), ["원래 수 45를 제곱합니다.", "2025를 뒤 두 자리 기준으로 20과 25로 나눕니다.", "20+25를 계산합니다.", "합이 원래 수 45와 같은지 확인합니다."]),
  makeTrack("c2a3-last-digit", "일의 자리의 반복을 찾아요", "3을 27번 곱한 수의 일의 자리는 무엇일까요?", "3, 9, 7, 1의 네 수를 한 마디로 보세요.", visual("power-last", { base: 3, exponent: 27 }), ["큰 수 전체를 계산하지 않고 일의 자리만 봅니다.", "3, 9, 7, 1이 네 칸마다 반복됩니다.", "27÷4의 나머지 3을 찾습니다.", "마디의 세 번째 7을 다시 곱셈으로 확인합니다."]),
  makeTrack("c2a3-arithmetic", "첫수와 공차로 먼 순서를 찾아요", "4, 11, 18, …의 42번째 수를 구해 볼까요?", "첫수에서 7을 41번 더합니다.", visual("arithmetic-nth", { first: 4, diff: 7, index: 42 }), ["첫수 4와 공차 7을 찾습니다.", "42번째까지 이동은 41번입니다.", "4+7×41을 계산합니다.", "앞뒤 항의 차가 계속 7인지 확인합니다."])
];
const c2SequenceVisuals = [
  visual("kaprekar-sum", { n: 55 }), visual("power-last", { base: 7, exponent: 50 }), visual("arithmetic-nth", { first: 9, diff: 4, index: 76 }), visual("arithmetic-index", { first: 5, diff: 7, target: 348 }),
  visual("kaprekar-sum", { n: 99 }), visual("power-last", { base: 8, exponent: 25 }), visual("arithmetic-nth", { first: 100, diff: -3, index: 24 }), visual("arithmetic-index", { first: 4, diff: 3, target: 148 }), visual("arithmetic-nth", { first: 384, diff: -5, index: 37 }), visual("power-last", { base: 2, exponent: 73 })
];

const c2TriangleTracks = [
  makeTrack("c2a3-gauss", "처음과 끝을 짝지어 합을 구해요", "2, 5, 8, …, 59의 합을 빠르게 구해 볼까요?", "첫수와 끝수의 합이 같은 짝을 만드세요.", visual("gauss-sum", { first: 2, diff: 3, count: 20 }), ["20개 수를 순서대로 놓습니다.", "첫수와 끝수, 둘째와 끝에서 둘째를 짝짓습니다.", "한 쌍의 합 61을 20번 더한 뒤 2로 나눕니다.", "직접 앞뒤 두 쌍의 합도 61인지 확인합니다."]),
  makeTrack("c2a3-triangle", "한 줄씩 늘어나는 삼각수를 만들어요", "1+2+3+…+12는 얼마일까요?", "같은 삼각형을 뒤집어 직사각형을 만드세요.", visual("triangular", { n: 12 }), ["첫째 줄부터 12번째 줄까지 점을 놓습니다.", "같은 모양을 뒤집어 붙이면 12×13 직사각형이 됩니다.", "두 삼각형이므로 12×13÷2를 계산합니다.", "앞뒤를 짝지어도 같은 합인지 확인합니다."]),
  makeTrack("c2a3-grouped", "앞줄의 삼각수 다음을 찾아요", "8번째 줄의 5번째 수는 무엇일까요?", "7번째 줄까지 쓴 수의 개수에 5를 더하세요.", visual("grouped-cell", { row: 8, column: 5 }), ["각 줄에는 줄 번호만큼 수가 들어갑니다.", "7번째 줄까지는 1+2+…+7개입니다.", "28 다음 5번째 수를 찾습니다.", "8번째 줄이 29부터 36까지인지 확인합니다."])
];
const c2TriangleVisuals = [
  visual("gauss-sum", { first: 5, diff: 4, count: 18 }), visual("triangular", { n: 15 }), visual("grouped-cell", { row: 10, column: 7 }), visual("gauss-sum", { first: 50, diff: 8, count: 20 }),
  visual("triangular", { n: 25 }), visual("grouped-cell", { row: 12, column: 4 }), visual("gauss-sum", { first: 7, diff: 6, count: 24 }), visual("triangular", { n: 40 }), visual("grouped-cell", { row: 20, column: 13 }), visual("gauss-sum", { first: 100, diff: -3, count: 25 })
];

const c2DigitsTracks = [
  makeTrack("c2a3-digit-total", "자릿수 구간을 나누어 세요", "1부터 365까지 쓰면 숫자는 모두 몇 개일까요?", "1~9, 10~99, 100~365를 따로 세세요.", visual("digit-total", { end: 365 }), ["한 자리, 두 자리, 세 자리 구간을 표시합니다.", "각 구간의 수 개수에 자릿수를 곱합니다.", "9+90×2+266×3을 계산합니다.", "마지막 수 365까지 포함했는지 확인합니다."]),
  makeTrack("c2a3-digit-at", "몇 번째 숫자가 놓인 수를 찾아요", "1234567891011…의 250번째 숫자는 무엇일까요?", "한 자리 수가 사용한 9개 숫자부터 빼세요.", visual("digit-at", { position: 250 }), ["한 자리 수 구간은 숫자 9개를 씁니다.", "남은 자리가 두 자리 수 구간을 넘는지 확인합니다.", "몫으로 해당 수, 나머지로 그 수 안의 자리를 찾습니다.", "이어 쓴 수에서 앞뒤 숫자까지 확인합니다."]),
  makeTrack("c2a3-digit-count", "특정 숫자의 반복 횟수를 세요", "1부터 120까지 숫자 1은 몇 번 쓰일까요?", "일의 자리와 십의 자리, 백의 자리를 따로 세세요.", visual("digit-occurrences", { end: 120, digit: 1 }), ["숫자 1이 놓일 수 있는 자리를 나눕니다.", "각 자리에서 10개씩 반복되는 묶음을 셉니다.", "끝부분 100~120의 추가 횟수를 더합니다.", "실제 범위를 순회한 개수와 맞는지 확인합니다."])
];
const c2DigitsVisuals = [
  visual("digit-total", { end: 250 }), visual("digit-at", { position: 199 }), visual("digit-occurrences", { end: 150, digit: 5 }), visual("digit-total", { end: 499 }),
  visual("digit-at", { position: 500 }), visual("digit-occurrences", { end: 200, digit: 2 }), visual("digit-total", { end: 1500 }), visual("digit-at", { position: 999 }), visual("digit-occurrences", { end: 365, digit: 3 }), visual("digit-at", { position: 2026 })
];

const c2PathTracks = [
  makeTrack("c2a3-permutation", "첫 자리부터 가능한 카드를 세요", "0, 1, 2, 3, 4로 세 자리 수를 몇 개 만들 수 있을까요?", "첫 자리에는 0을 놓을 수 없습니다.", visual("permutation-count", { digits: [0, 1, 2, 3, 4], length: 3 }), ["서로 다른 카드이고 한 번씩만 사용합니다.", "첫 자리는 0을 뺀 4가지입니다.", "둘째 4가지, 셋째 3가지를 곱합니다.", "0으로 시작하는 배열이 빠졌는지 확인합니다."]),
  makeTrack("c2a3-lattice", "각 점까지 오는 방법 수를 더해요", "가로 4칸, 세로 3칸 격자의 최단 경로를 세어 볼까요?", "오른쪽 4번과 아래 3번의 순서를 생각하세요.", visual("lattice-path", { width: 4, height: 3, blocked: [] }), ["오른쪽과 아래쪽 이동만 사용합니다.", "시작점에는 1을 적고 가장자리를 채웁니다.", "각 점에 위와 왼쪽 수를 더합니다.", "도착점 35를 7C3과 비교해 확인합니다."]),
  makeTrack("c2a3-blocked", "막힌 길은 더하지 않아요", "가로 4칸, 세로 3칸에서 한 길이 막히면 몇 가지일까요?", "막힌 선을 건너오는 수는 0으로 처리하세요.", visual("lattice-path", { width: 4, height: 3, blocked: [[1, 1, "R"], [3, 0, "D"]] }), ["빨간 선은 지나갈 수 없는 길입니다.", "시작점부터 가능한 방향만 따라갑니다.", "막힌 길에서는 이웃 수를 전달하지 않습니다.", "도착점의 수를 다른 순서로 다시 채워 확인합니다."])
];
const c2PathVisuals = [
  visual("permutation-count", { digits: [1, 2, 3, 4, 5], length: 5 }), visual("lattice-path", { width: 3, height: 3, blocked: [] }), visual("permutation-count", { digits: [0, 1, 2, 3, 4, 5], length: 3 }), visual("lattice-path", { width: 4, height: 3, blocked: [[1, 1, "R"]] }),
  visual("lattice-path", { width: 5, height: 3, blocked: [[2, 1, "D"], [3, 2, "R"]] }), visual("permutation-count", { digits: [0, 2, 4, 6, 8], length: 4 }), visual("lattice-path", { width: 5, height: 4, blocked: [] }), visual("lattice-path", { width: 4, height: 4, blocked: [[0, 2, "R"], [2, 1, "D"]] }), visual("permutation-count", { digits: [1, 3, 5, 7, 9], length: 3 }), visual("lattice-path", { width: 6, height: 3, blocked: [[2, 0, "D"], [4, 2, "R"]] })
];

export const COURSE02_A3_LESSONS = Object.freeze([
  makeLesson({ bookId: c2, lessonId: "course-02-a3-kaprekar-sequences", title: "카프리카 규칙과 등차수열을 연결해요", unit: "카프리카수와 등차수열", concept: "제곱수의 분할, 거듭제곱의 일의 자리 마디, 등차수열의 순서와 값을 구분하기", tracks: c2SequenceTracks, visuals: c2SequenceVisuals, sourceNote: "교사용 지도서 01단원의 카프리카수·순환마디·등차수열 활동과 권별 테스트 구조를 대조해 새 수로 구성했습니다." }),
  makeLesson({ bookId: c2, lessonId: "course-02-a3-triangular-groups", title: "짝짓기와 삼각수로 묶음수열을 풀어요", unit: "삼각수와 묶음수열", concept: "가우스 짝짓기, 삼각수, 줄별 수 배열을 하나의 누적합으로 연결하기", tracks: c2TriangleTracks, visuals: c2TriangleVisuals, sourceNote: "교사용 지도서 02단원의 사각수·가우스 합·삼각수·묶음수열 활동을 대조해 새 수로 구성했습니다." }),
  makeLesson({ bookId: c2, lessonId: "course-02-a3-digit-counting", title: "자리별로 숫자의 개수와 위치를 찾아요", unit: "수와 숫자의 개수", concept: "자릿수 구간을 나누어 전체 숫자 수, 특정 숫자 수, 이어 쓴 수의 위치 찾기", tracks: c2DigitsTracks, visuals: c2DigitsVisuals, sourceNote: "교사용 지도서 03단원의 숫자 사용 횟수·전체 자릿수·마지막 숫자 활동을 대조해 새 범위로 구성했습니다." }),
  makeLesson({ bookId: c2, lessonId: "course-02-a3-paths-cases", title: "배열과 격자로 경우의 수를 세어요", unit: "최단거리와 경우의 수", concept: "첫 자리 제약이 있는 배열과 막힌 길이 있는 격자의 최단 경로를 빠짐없이 세기", tracks: c2PathTracks, visuals: c2PathVisuals, sourceNote: "교사용 지도서 04단원의 숫자 카드 배열·최단거리·갈 수 없는 길 활동을 대조해 새 격자로 구성했습니다." })
]);

const c3 = "course-03-a3";
const c3RatioTracks = [
  makeTrack("c3a3-linked", "가운데 항을 같게 맞춰요", "A:B=3:4, B:C=5:2일 때 A:B:C는 무엇일까요?", "B를 4와 5의 최소공배수 20으로 맞추세요.", visual("linked-ratio", { ab: [3, 4], bc: [5, 2] }), ["두 비가 공통으로 가진 B를 찾습니다.", "B의 4와 5를 20으로 맞춥니다.", "A:B=15:20, B:C=20:8을 연결합니다.", "15:20:8이 더 약분되지 않는지 확인합니다."]),
  makeTrack("c3a3-change", "바뀌기 전을 같은 묶음으로 놓아요", "A:B=3:4에서 A는 8 늘고 B는 4 줄어 5:4가 되었습니다. 처음 A는?", "처음 A=3k, B=4k로 놓으세요.", visual("ratio-change", { initial: [3, 4], change: [8, -4], final: [5, 4] }), ["처음 두 수를 3k와 4k로 놓습니다.", "변화 뒤 수는 3k+8과 4k-4입니다.", "(3k+8):(4k-4)=5:4를 풉니다.", "처음 수에 변화를 적용해 최종 비를 확인합니다."])
];
const c3RatioVisuals = [
  visual("linked-ratio", { ab: [2, 3], bc: [4, 5] }), visual("ratio-change", { initial: [7, 9], change: [10, -5], final: [16, 17] }), visual("linked-ratio", { ab: [5, 6], bc: [9, 4] }), visual("ratio-change", { initial: [3, 5], change: [12, 0], final: [1, 1] }),
  visual("linked-ratio", { ab: [4, 7], bc: [3, 8] }), visual("ratio-change", { initial: [2, 3], change: [6, -3], final: [4, 3] }), visual("linked-ratio", { ab: [7, 10], bc: [15, 4] }), visual("ratio-change", { initial: [5, 8], change: [15, 0], final: [1, 1] }), visual("linked-ratio", { ab: [3, 8], bc: [6, 5] }), visual("ratio-change", { initial: [4, 7], change: [8, -2], final: [2, 3] })
];

const c3ClockWorkTracks = [
  makeTrack("c3a3-work", "하루에 하는 일의 양을 더해요", "A는 12일, B는 6일 걸리는 일을 함께 하면 며칠일까요?", "하루 일률 1/12과 1/6을 더하세요.", visual("work-together", { a: 12, b: 6 }), ["전체 일을 1로 놓습니다.", "A와 B의 하루 일률을 각각 1/12, 1/6로 씁니다.", "두 일률을 더해 1/4을 얻습니다.", "4일 동안 하면 전체 일 1이 되는지 확인합니다."]),
  makeTrack("c3a3-pipes", "겹쳐 센 수도관을 빼요", "세 관 20분, A+B 40분, A+C 30분이면 B+C는?", "전체 일률의 두 배에서 두 묶음의 일률을 빼세요.", visual("pipe-pair", { all: 20, ab: 40, ac: 30 }), ["각 시간의 역수를 1분 동안 채우는 양으로 바꿉니다.", "전체 일률을 두 번 더하면 A·B·C가 두 번씩 있습니다.", "A+B와 A+C를 빼면 B+C만 남습니다.", "B+C의 일률을 다시 시간으로 바꿔 검산합니다."]),
  makeTrack("c3a3-clock", "두 바늘의 움직임을 따로 계산해요", "7시 20분에 시침과 분침의 작은 각은 몇 도일까요?", "분침은 120도, 시침은 210+10도입니다.", visual("clock-angle", { hour: 7, minute: 20 }), ["정각의 시침 위치와 분침 위치를 먼저 표시합니다.", "20분 동안 분침은 120도, 시침은 10도 더 갑니다.", "두 위치 220도와 120도의 차를 구합니다.", "360도에서 뺀 각과 비교해 더 작은 각을 고릅니다."])
];
const c3ClockWorkVisuals = [
  visual("work-together", { a: 15, b: 10 }), visual("pipe-pair", { all: 20, ab: 40, ac: 30 }), visual("clock-angle", { hour: 3, minute: 20 }), visual("work-together", { a: 8, b: 24 }),
  visual("clock-angle", { hour: 5, minute: 40 }), visual("pipe-pair", { all: 12, ab: 24, ac: 18 }), visual("work-together", { a: 18, b: 9 }), visual("clock-angle", { hour: 8, minute: 10 }), visual("pipe-pair", { all: 30, ab: 60, ac: 45 }), visual("clock-angle", { hour: 2, minute: 30 })
];

const c3SpeedTracks = [
  makeTrack("c3a3-average", "같은 거리의 왕복 시간을 더해요", "갈 때 60km/h, 올 때 90km/h의 평균속력은?", "거리를 각각 180km로 놓으면 시간이 3시간과 2시간입니다.", visual("average-roundtrip", { outbound: 60, returning: 90 }), ["평균속력은 두 속력의 단순 평균이 아닙니다.", "같은 거리를 최소공배수 180km로 놓습니다.", "전체 360km를 5시간으로 나눕니다.", "72km/h로 5시간 가면 360km인지 확인합니다."]),
  makeTrack("c3a3-mixed", "두 속력의 시간을 나누어 찾아요", "240km를 3시간 동안 60km/h와 100km/h로 갔다면 느리게 간 시간은?", "느린 시간을 x, 빠른 시간을 3-x로 놓으세요.", visual("mixed-speed-time", { distance: 240, totalTime: 3, slow: 60, fast: 100 }), ["두 이동 시간의 합은 3시간입니다.", "이동 거리는 60x+100(3-x)입니다.", "거리 식을 풀어 느린 시간을 구합니다.", "두 구간 거리의 합이 240km인지 확인합니다."]),
  makeTrack("c3a3-train", "두 통과 기록의 차를 이용해요", "800m 터널 10초, 400m 다리 6초인 기차의 초속은?", "두 식을 빼면 기차 길이가 없어집니다.", visual("train-tunnel", { longTunnel: 800, longTime: 10, shortTunnel: 400, shortTime: 6 }), ["완전 통과 거리는 구조물 길이와 기차 길이의 합입니다.", "두 기록의 거리 차는 400m, 시간 차는 4초입니다.", "400÷4로 초속을 구합니다.", "두 기록에서 계산한 기차 길이가 같은지 확인합니다."])
];
const c3SpeedVisuals = [
  visual("average-roundtrip", { outbound: 80, returning: 120 }), visual("mixed-speed-time", { distance: 260, totalTime: 3, slow: 60, fast: 100 }), visual("step-catch", { aSteps: 5, bSteps: 4, aStrideUnits: 3, bStrideUnits: 2, gapBSteps: 8 }), visual("train-tunnel", { longTunnel: 900, longTime: 12, shortTunnel: 500, shortTime: 8 }),
  visual("boat-down-time", { distance: 100, upstreamHours: 2.5, speedDifference: 8 }), visual("average-roundtrip", { outbound: 50, returning: 75 }), visual("mixed-speed-time", { distance: 180, totalTime: 3, slow: 40, fast: 80 }), visual("train-tunnel", { longTunnel: 700, longTime: 9, shortTunnel: 300, shortTime: 5 }), visual("boat-down-time", { distance: 72, upstreamHours: 2, speedDifference: 12 }), visual("average-roundtrip", { outbound: 72, returning: 48 })
];

const c3ConcentrationTracks = [
  makeTrack("c3a3-add", "용질의 양을 보존해요", "8% 소금물 400g에 5%를 넣어 7%로 만들려면?", "처음과 넣은 용질의 합이 완성된 용질의 양과 같습니다.", visual("concentration-add", { initial: 8, mass: 400, added: 5, target: 7 }), ["각 용액에서 농도와 전체 양을 확인합니다.", "추가할 양을 x g으로 놓습니다.", "0.08×400+0.05x=0.07(400+x)를 풉니다.", "구한 양으로 전체 용질과 농도를 다시 계산합니다."]),
  makeTrack("c3a3-lever", "농도 차를 반대쪽 양에 놓아요", "14%와 4%를 섞어 10%로 만들 때 양의 비는?", "목표와의 차 4와 6을 반대쪽에 놓으세요.", visual("lever-ratio", { high: 14, low: 4, target: 10 }), ["목표 농도 10을 두 농도 사이에 놓습니다.", "14와의 차는 4, 4와의 차는 6입니다.", "높은 농도:낮은 농도는 6:4입니다.", "3:2로 약분한 뒤 가중평균이 10인지 확인합니다."]),
  makeTrack("c3a3-percent", "서로 다른 증감률을 두 식으로 풀어요", "500명에서 남 10% 증가, 여 8% 감소, 전체 14명 증가라면 올해 남학생은?", "지난해 남학생 m, 여학생 500-m으로 놓으세요.", visual("percent-population", { total: 500, maleIncrease: 0.1, femaleDecrease: 0.08, change: 14 }), ["지난해 남녀의 합은 500명입니다.", "남학생 증가분과 여학생 감소분의 차는 14명입니다.", "0.1m-0.08(500-m)=14를 풉니다.", "올해 남녀를 더해 514명인지 확인합니다."])
];
const c3ConcentrationVisuals = [
  visual("concentration-add", { initial: 8, mass: 400, added: 5, target: 7 }), visual("concentration-mix", { c1: 12, m1: 200, c2: 6, m2: 100 }), visual("concentration-parts", { c1: 15, c2: 5, target: 11, total: 300 }), visual("lever-ratio", { high: 18, low: 6, target: 10 }),
  visual("percent-population", { total: 500, maleIncrease: 0.1, femaleDecrease: 0.08, change: 14 }), visual("concentration-add", { initial: 12, mass: 300, added: 4, target: 10 }), visual("concentration-mix", { c1: 20, m1: 150, c2: 5, m2: 250 }), visual("concentration-parts", { c1: 16, c2: 4, target: 10, total: 240 }), visual("lever-ratio", { high: 21, low: 7, target: 12 }), visual("percent-population", { total: 600, maleIncrease: 0.12, femaleDecrease: 0.06, change: 27 })
];

export const COURSE03_A3_LESSONS = Object.freeze([
  makeLesson({ bookId: c3, lessonId: "course-03-a3-linked-ratios", title: "공통항과 변화량으로 연비를 풀어요", unit: "비와 비례식의 활용", concept: "공통항을 맞춘 연비와 증감 뒤 비례식을 이용해 처음 수 찾기", tracks: c3RatioTracks, visuals: c3RatioVisuals, sourceNote: "A3+ 교사용 지도서 01단원과 권별 테스트의 연비·증감 비례식 문제를 대조해 새 수로 구성했습니다." }),
  makeLesson({ bookId: c3, lessonId: "course-03-a3-clock-work", title: "움직이는 바늘과 함께 하는 일을 계산해요", unit: "시계와 각·일", concept: "시침·분침의 각속도와 단위시간의 일의 양을 각각 식으로 나타내기", tracks: c3ClockWorkTracks, visuals: c3ClockWorkVisuals, sourceNote: "A3+ 단원 표지와 실제 지도서 활동, 권별 테스트를 교차 대조해 시계 각·일·수도관 유형을 함께 구성했습니다." }),
  makeLesson({ bookId: c3, lessonId: "course-03-a3-average-relative-speed", title: "거리와 시간으로 평균·상대속력을 풀어요", unit: "평균속력과 상대속도", concept: "같은 거리 왕복, 두 속력 이동, 보폭, 기차와 배 문제를 거리-시간 식으로 검산하기", tracks: c3SpeedTracks, visuals: c3SpeedVisuals, sourceNote: "A3+ 교사용 지도서 03단원과 권별 테스트의 평균속력·보폭·기차·배 유형을 대조해 새 수로 구성했습니다." }),
  makeLesson({ bookId: c3, lessonId: "course-03-a3-ratio-concentration", title: "용질의 양과 농도 차로 섞는 양을 찾아요", unit: "비와 농도", concept: "용질 보존식, 지렛대 비, 서로 다른 증감률을 그림과 식으로 연결하기", tracks: c3ConcentrationTracks, visuals: c3ConcentrationVisuals, sourceNote: "A3+ 교사용 지도서 04단원과 권별 테스트의 농도·혼합·백분율 문제를 대조해 새 수로 구성했습니다." })
]);

function latticeMarkup(data, model, solved) {
  const gap = 46; const pad = 24; const width = data.width * gap + pad * 2; const height = data.height * gap + pad * 2;
  const blocked = new Set((data.blocked || []).map(([x, y, direction]) => `${x},${y},${direction}`));
  const lines = [];
  for (let y = 0; y <= data.height; y += 1) for (let x = 0; x <= data.width; x += 1) {
    if (x < data.width) lines.push(`<line class="${blocked.has(`${x},${y},R`) ? "blocked" : ""}" x1="${pad + x * gap}" y1="${pad + y * gap}" x2="${pad + (x + 1) * gap}" y2="${pad + y * gap}"/>`);
    if (y < data.height) lines.push(`<line class="${blocked.has(`${x},${y},D`) ? "blocked" : ""}" x1="${pad + x * gap}" y1="${pad + y * gap}" x2="${pad + x * gap}" y2="${pad + (y + 1) * gap}"/>`);
  }
  const labels = solved ? model.table.flatMap((row, y) => row.map((value, x) => `<text x="${pad + x * gap}" y="${pad + y * gap + 5}">${value}</text>`)).join("") : "";
  return `<svg class="a3-lattice" viewBox="0 0 ${width} ${height}" role="img" aria-label="최단거리 격자">${lines.join("")}${labels}<circle cx="${pad}" cy="${pad}" r="6"/><circle class="finish" cx="${pad + data.width * gap}" cy="${pad + data.height * gap}" r="6"/></svg>`;
}

export function course23A3ConceptMarkup(data) {
  if (!data || data.kind !== "course23-a3") return "";
  const phase = data.phase || "problem"; const solved = phase === "verify"; const model = course23A3Model(data);
  let body = "";
  if (data.task === "lattice-path") body = latticeMarkup(data, model, phase !== "problem");
  else if (["triangular", "grouped-cell"].includes(data.task)) {
    const n = data.task === "triangular" ? data.n : data.row;
    const rows = Array.from({ length: Math.min(n, 14) }, (_, row) => `<span>${Array.from({ length: row + 1 }, () => "<i></i>").join("")}</span>`).join("");
    body = `<div class="a3-triangle">${rows}</div><p>${data.task === "triangular" ? `${n}×${n + 1}÷2` : `앞 ${n - 1}줄 ${model.before}개 + ${data.column}`}${solved ? ` = <strong>${model.answer}</strong>` : ""}</p>`;
  } else if (["digit-total", "digit-at", "digit-occurrences"].includes(data.task)) {
    const labels = data.task === "digit-total" ? ["1~9", "10~99", `100~${data.end}`] : data.task === "digit-at" ? ["한 자리 9개", "두 자리 180개", `${data.position}번째`] : ["일의 자리", "십의 자리", "끝 구간"];
    body = `<div class="a3-place-bands">${labels.map((label, index) => `<span class="${phase !== "problem" && index < 2 ? "done" : ""}">${esc(label)}</span>`).join("")}</div>${solved ? `<p>조건에 맞는 값은 <strong>${model.answer}</strong></p>` : ""}`;
  } else if (["concentration-add", "concentration-mix", "concentration-parts", "lever-ratio"].includes(data.task)) {
    const left = data.initial ?? data.c1 ?? data.high; const right = data.added ?? data.c2 ?? data.low;
    body = `<div class="a3-mixture"><span style="--fill:${Math.max(18, left * 3)}%"><b>${left}%</b></span><b>+</b><span style="--fill:${Math.max(18, right * 3)}%"><b>${right}%</b></span><b>→</b><span class="target"><b>${data.target ?? model.answer}%</b></span></div>${solved ? `<p>답 <strong>${model.answer}${data.task === "lever-ratio" ? "" : ""}</strong></p>` : ""}`;
  } else if (["average-roundtrip", "mixed-speed-time", "step-catch", "train-tunnel", "boat-down-time"].includes(data.task)) {
    body = `<div class="a3-route"><span>출발</span><i></i><span>도착</span></div><div class="a3-formula">${phase === "problem" ? "거리 = 속력 × 시간" : hintFor(data)}${solved ? `<strong>${model.answer}</strong>` : ""}</div>`;
  } else if (["work-together", "pipe-pair", "clock-angle"].includes(data.task)) {
    body = data.task === "clock-angle"
      ? `<div class="a3-clock" style="--minute:${data.minute * 6}deg;--hour:${(data.hour % 12) * 30 + data.minute * .5}deg"><i class="minute"></i><i class="hour"></i><b>${data.hour}:${String(data.minute).padStart(2, "0")}</b></div>${solved ? `<p>작은 각 <strong>${model.answer}°</strong></p>` : ""}`
      : `<div class="a3-work"><span>A</span><span>B</span>${data.task === "pipe-pair" ? "<span>C</span>" : ""}</div><p>전체 일 = 1${phase === "problem" ? "" : ` · 단위시간의 양을 더해요`}${solved ? ` · 답 <strong>${model.answer}</strong>` : ""}</p>`;
  } else {
    const values = data.task === "kaprekar-sum" ? [data.n, model.square, `${model.front}+${model.back}`]
      : data.task === "power-last" ? [data.base, `${data.exponent}번`, "일의 자리 마디"]
        : data.task === "linked-ratio" ? [data.ab.join(":"), data.bc.join(":"), phase === "problem" ? "공통항" : model.values.join(":")]
          : data.task === "ratio-change" ? [data.initial.join(":"), data.change.join(", "), data.final.join(":")]
            : data.task === "permutation-count" ? [data.digits.join(" · "), `${data.length}자리`, "첫 자리 0 제외"]
              : data.task === "percent-population" ? [data.total, `+${data.maleIncrease * 100}%`, `-${data.femaleDecrease * 100}%`]
                : [data.first, data.diff, data.index ?? data.count ?? data.target];
    body = `<div class="a3-flow">${values.map((value) => `<span>${esc(value)}</span>`).join("<b>→</b>")}</div>${phase === "problem" ? "" : `<p>${hintFor(data)}</p>`}${solved ? `<strong class="a3-answer">답 ${esc(model.answer)}</strong>` : ""}`;
  }
  return `<div class="course23-a3-visual" data-task="${esc(data.task)}" data-phase="${esc(phase)}">${body}</div>`;
}
