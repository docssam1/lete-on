const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

export const gcd = (a, b) => {
  let x = Math.abs(Number(a)); let y = Math.abs(Number(b));
  while (y) [x, y] = [y, x % y];
  return x;
};

export const lcm = (a, b) => {
  const x = Math.abs(Number(a)); const y = Math.abs(Number(b));
  return x && y ? Math.abs(x * y) / gcd(x, y) : 0;
};

export const consistency = (conditions) => {
  const normalized = conditions.map(({ divisor, remainder }) => ({ divisor, remainder: ((remainder % divisor) + divisor) % divisor }));
  for (let i = 0; i < normalized.length; i += 1) {
    for (let j = i + 1; j < normalized.length; j += 1) {
      const left = normalized[i]; const right = normalized[j];
      if ((left.remainder - right.remainder) % gcd(left.divisor, right.divisor) !== 0) return false;
    }
  }
  return true;
};

export const period = (conditions) => conditions.reduce((value, condition) => lcm(value, condition.divisor), 1);

export const firstSolution = (conditions, lower = 1) => {
  if (!conditions.length || !consistency(conditions)) return null;
  const maxSearch = Math.max(lower, 1) + period(conditions) * 2;
  for (let value = Math.max(lower, 1); value <= maxSearch; value += 1) {
    if (conditions.every(({ divisor, remainder }) => value % divisor === remainder)) return value;
  }
  return null;
};

export const countSolutions = (conditions, lower, upper) => {
  if (upper < lower) return 0;
  const first = firstSolution(conditions, lower);
  if (first === null) return 0;
  const step = period(conditions);
  return first > upper ? 0 : Math.floor((upper - first) / step) + 1;
};

const rowsFor = (conditions, lower, rowCount = 5) => {
  const step = period(conditions);
  const first = firstSolution(conditions, lower);
  return first === null ? [] : Array.from({ length: rowCount }, (_, index) => first + index * step);
};

const visual = (task, phase = "problem") => ({ ...task, kind: "course03-lcm-remainder", taskKind: task.kind, phase });
const typeLabels = {
  "same-remainder": "같은 나머지의 공통 수",
  "different-remainder": "서로 다른 나머지의 공통 수",
  "different-remainder-range": "범위에서 처음 만나는 공통 수",
  "inclusive-range-count": "범위 안의 공통 수 개수"
};

const item = (lessonId, id, task, prompt, printGroup) => ({
  id: `${lessonId}:${id}`, prompt, hint: "조건을 만족하는 첫 항과 최소공배수 주기를 확인하세요.",
  visual: visual(task), answerMode: "input", inputMode: "numeric", typeLabel: typeLabels[task.kind],
  sourceNo: id.startsWith("original-") ? String(Number(id.slice("original-".length))) : "", printGroup, answerRef: `/course23/course-03-a1/${lessonId}:${id}`
});

const same = (conditions, prompt, id, group) => {
  const lower = Math.max(...conditions.map(({ divisor }) => divisor)) + 1;
  return item(lessonId, id, { kind: "same-remainder", conditions, lower, rows: rowsFor(conditions, lower) }, prompt, group);
};
const different = (conditions, prompt, id, group, lower = 1, upper = null) => item(lessonId, id, { kind: upper === null ? "different-remainder" : "different-remainder-range", conditions, lower, upper, rows: rowsFor(conditions, lower) }, prompt, group);
const countItem = (conditions, prompt, id, group, lower, upper) => item(lessonId, id, { kind: "inclusive-range-count", conditions, lower, upper, rows: rowsFor(conditions, lower) }, prompt, group);

const lessonId = "course-03-a1-lcm-remainder";

const sameTrack = {
  id: "course-03-a1-lcm-same-remainder", title: "같은 나머지를 묶어 주기를 찾아요",
  openingPrompt: "공통 나머지를 먼저 빼고, 남은 수가 반복되는 간격을 찾아 보세요.",
  hint: "공통 나머지를 뺀 뒤 나눗셈 수들의 최소공배수를 주기로 사용하세요.",
  beats: [
    { caption: "각 조건에서 같은 나머지를 확인해요.", visual: visual({ kind: "same-remainder", conditions: [{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], lower: 1, rows: rowsFor([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], 1) }, "problem") },
    { caption: "공통 나머지를 빼면 남은 수는 모든 나눗셈 수의 배수예요.", visual: visual({ kind: "same-remainder", conditions: [{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], lower: 1, rows: rowsFor([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], 1) }, "subtract") },
    { caption: "나눗셈 수들의 최소공배수를 반복 간격으로 정해요.", visual: visual({ kind: "same-remainder", conditions: [{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], lower: 1, rows: rowsFor([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], 1) }, "period") },
    { caption: "첫 항과 주기를 이용해 조건을 다시 확인해요.", visual: visual({ kind: "same-remainder", conditions: [{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], lower: 1, rows: rowsFor([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], 1) }, "verify") }
  ]
};

const differentTrack = {
  id: "course-03-a1-lcm-different-remainder", title: "처음 만나는 항과 주기를 찾아요",
  openingPrompt: "서로 다른 나머지 조건을 만족하는 첫 항을 찾고, 그 뒤의 반복 간격을 확인해 보세요.",
  hint: "조건에 맞는 수를 차례로 확인해 첫 공통항을 찾은 뒤 최소공배수를 더하세요.",
  beats: [
    { caption: "각 조건의 수열을 나란히 놓고 처음 만나는 항을 찾아요.", visual: visual({ kind: "different-remainder", conditions: [{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], lower: 1, rows: rowsFor([{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], 1) }, "problem") },
    { caption: "첫 공통항은 모든 나머지 조건을 동시에 확인해요.", visual: visual({ kind: "different-remainder", conditions: [{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], lower: 1, rows: rowsFor([{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], 1) }, "first") },
    { caption: "첫 공통항 뒤에는 최소공배수만큼씩 같은 규칙이 반복돼요.", visual: visual({ kind: "different-remainder", conditions: [{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], lower: 1, rows: rowsFor([{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], 1) }, "period") },
    { caption: "범위 문제에서는 아래 경계와 위 경계를 모두 포함해 세어요.", visual: visual({ kind: "different-remainder-range", conditions: [{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], lower: 1, upper: 200, rows: rowsFor([{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], 1) }, "verify") }
  ]
};

const original = [
  same([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], "두 나누는 수보다 크면서 두 조건을 동시에 만족하는 가장 작은 자연수를 구하세요.", "original-01", 1),
  same([{ divisor: 6, remainder: 2 }, { divisor: 9, remainder: 2 }], "두 나누는 수보다 크면서 두 조건을 동시에 만족하는 가장 작은 자연수를 구하세요.", "original-02", 1),
  different([{ divisor: 5, remainder: 2 }, { divisor: 7, remainder: 3 }], "두 조건을 동시에 만족하는 가장 작은 자연수를 구하세요.", "original-03", 2),
  different([{ divisor: 4, remainder: 1 }, { divisor: 7, remainder: 2 }], "두 조건을 동시에 만족하는 가장 작은 자연수를 구하세요.", "original-04", 2)
];

const extension = different([{ divisor: 6, remainder: 5 }, { divisor: 8, remainder: 3 }], "조건을 만족하는 수 중 가장 작은 세 자리 수를 구하세요.", "extension", 1, 100, null);

const similar = [
  same([{ divisor: 8, remainder: 3 }, { divisor: 12, remainder: 3 }], "두 나누는 수보다 크면서 두 조건을 동시에 만족하는 가장 작은 자연수를 구하세요.", "similar-01", 2),
  different([{ divisor: 7, remainder: 4 }, { divisor: 9, remainder: 1 }], "두 조건을 동시에 만족하는 수 중 50보다 큰 가장 작은 수를 구하세요.", "similar-02", 1, 51),
  different([{ divisor: 5, remainder: 1 }, { divisor: 6, remainder: 4 }], "두 조건을 동시에 만족하는 수 중 가장 작은 세 자리 수를 구하세요.", "similar-03", 2, 100),
  countItem([{ divisor: 4, remainder: 3 }, { divisor: 9, remainder: 6 }], "두 조건을 동시에 만족하는 20 이상 150 이하의 자연수는 모두 몇 개인가요.", "similar-04", 1, 20, 150),
  countItem([{ divisor: 10, remainder: 7 }, { divisor: 15, remainder: 7 }], "두 조건을 동시에 만족하는 30 이상 200 이하의 자연수는 모두 몇 개인가요.", "similar-05", 2, 30, 200)
];

export const COURSE03_A1_LCM_REMAINDER_LESSON = Object.freeze({
  id: lessonId, bookId: "course-03-a1", courseId: "course-03", label: "A1", title: "최소공배수와 나머지가 같은 수",
  unit: "나머지 정리", representativeConcept: "여러 나머지 조건의 공통해와 반복 주기", learnerStage: "필즈 더 클래식 3과정 A1; 연령 미확정",
  status: "pilot",
  story: { title: "두 갈래 수열이 만나는 곳", text: "서로 다른 조건에서 출발한 수들이 같은 수에서 만나는 규칙을 찾아요.", mission: "첫 공통 수와 다시 만나는 간격을 모두 확인하세요." },
  explanation: { headline: "첫 공통 수와 반복 간격 찾기", steps: ["각 나머지 조건을 만족하는 수를 따로 늘어놓습니다.", "처음 함께 나타나는 수를 찾습니다.", "나누는 수들의 최소공배수만큼 더해 다시 만나는지 확인합니다."] },
  sourceTypeIds: [], source: { origin: "textbook-derived", note: "교재 구조를 참고한 새 개념 학습입니다." },
  experience: { kind: "course-concept", tracks: [sameTrack, differentTrack], openingPrompt: sameTrack.openingPrompt, hint: sameTrack.hint, beats: sameTrack.beats },
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  original: { title: "연습", prompt: "나머지 조건을 동시에 만족하는 수를 구해 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension, similarPractice: similar
});

const valuesForCondition = ({ divisor, remainder }, lower, count = 7) => {
  const normalized = ((remainder % divisor) + divisor) % divisor;
  let first = normalized || divisor;
  while (first < Math.max(1, lower)) first += divisor;
  return Array.from({ length: count }, (_, index) => first + index * divisor);
};

function sequenceMarkup(data) {
  const rows = data.rows?.length ? data.rows : rowsFor(data.conditions, data.lower);
  const phase = data.phase || "problem";
  const first = rows[0] ?? null;
  const candidateRows = data.conditions.map((condition) => {
    const values = valuesForCondition(condition, data.lower);
    return `<div class="course03-lcm-candidate-row"><strong>${esc(condition.divisor)}로 나눈 나머지 ${esc(condition.remainder)}</strong>${values.map((value) => `<span class="${phase !== "problem" && value === first ? "is-common" : ""}">${esc(value)}</span>`).join("")}</div>`;
  }).join("");
  const cells = rows.map((value) => `<span class="course03-lcm-cell">${esc(value)}</span>`).join("");
  const equations = phase === "verify" ? data.conditions.map(({ divisor, remainder }) => `<p>${esc(rows[0])} ÷ ${esc(divisor)} → 나머지 ${esc(remainder)}</p>`).join("") : "";
  const commonRemainder = data.conditions.every((condition) => condition.remainder === data.conditions[0].remainder) ? data.conditions[0].remainder : null;
  const explanation = phase === "subtract" && commonRemainder !== null
    ? `<p class="course03-lcm-rule">어떤 수 − ${esc(commonRemainder)}는 ${data.conditions.map(({ divisor }) => esc(divisor)).join("과 ")}의 공배수예요.</p>`
    : phase === "period" ? `<p class="course03-lcm-rule">첫 공통 수에서 ${esc(period(data.conditions))}씩 더하면 다시 두 조건을 만족해요.</p>` : "";
  const commonSequence = ["period", "verify"].includes(phase) ? `<div class="course03-lcm-sequence" aria-label="공통 수와 반복 간격">${cells}</div>` : "";
  return `<div class="course03-lcm-visual" data-phase="${esc(phase)}"><div class="course03-lcm-conditions">${data.conditions.map(({ divisor, remainder }) => `<span>${esc(divisor)}로 나누어 ${esc(remainder)}가 남음</span>`).join("")}</div>${phase === "problem" ? '<p class="course03-lcm-question">두 조건이 처음 만나는 수는?</p>' : candidateRows}${explanation}${commonSequence}${equations}</div>`;
}

export function course03LcmRemainderConceptMarkup(data) {
  return data?.kind === "course03-lcm-remainder" ? sequenceMarkup(data) : "";
}
