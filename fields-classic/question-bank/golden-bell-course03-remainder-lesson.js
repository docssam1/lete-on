const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

const sequenceVisual = (data, phase = "problem") => ({
  kind: "course03-remainder-sequence",
  start: data.start,
  step: data.step,
  length: data.length,
  position: data.position,
  phase
});

const rangeVisual = (data, phase = "problem") => ({
  kind: "course03-remainder-range",
  start: data.start,
  step: data.step,
  lower: data.lower,
  upper: data.upper,
  phase
});

const sequenceItem = (lessonId, id, data, group, label) => ({
  id: `${lessonId}:${id}`,
  prompt: label,
  hint: "같은 간격으로 커지는 수를 한 묶음으로 보고, 시작 위치와 끝 위치를 함께 확인하세요.",
  visual: sequenceVisual(data),
  answerMode: "input",
  inputMode: "numeric",
  typeLabel: "같은 나머지 수열의 항 찾기",
  sourceNo: id.startsWith("practice-") ? String(Number(id.slice("practice-".length))) : "",
  printGroup: group,
  answerRef: `/course23/course-03-a1/${lessonId}:${id}`
});

const rangeItem = (lessonId, id, data, group, label) => ({
  id: `${lessonId}:${id}`,
  prompt: label,
  hint: "첫 수와 간격을 이용해 범위 안의 첫 항과 마지막 항을 표시한 뒤, 양끝을 모두 세세요.",
  visual: rangeVisual(data),
  answerMode: "input",
  inputMode: "numeric",
  typeLabel: "포함 범위에서 같은 나머지 수 세기",
  sourceNo: id.startsWith("practice-") ? String(Number(id.slice("practice-".length))) : "",
  printGroup: group,
  answerRef: `/course23/course-03-a1/${lessonId}:${id}`
});

const sequenceTrack = {
  id: "course-03-a1-remainder-track-1",
  title: "한 수열을 두 식으로 읽기",
  openingPrompt: "같은 간격으로 커지는 수를 양의 나머지식과 음의 나머지식으로 나타내고, 정해진 자리의 규칙을 찾아 보세요.",
  hint: "첫 수를 기준으로 세는 식과, 다음 묶음에서 하나 모자란 식을 나란히 놓아 보세요.",
  beats: [
    { caption: "처음 수에서 같은 간격으로 이동하는 수를 한 줄에 놓아요.", visual: sequenceVisual({ start: 4, step: 6, length: 5, position: 8 }, "problem") },
    { caption: "첫 수와 간격을 이용하면 시작점에서 몇 번 이동했는지 나타낼 수 있어요.", visual: sequenceVisual({ start: 4, step: 6, length: 5, position: 8 }, "positive") },
    { caption: "같은 수열은 다음 묶음의 끝에서 한 칸 모자란 식으로도 나타낼 수 있어요.", visual: sequenceVisual({ start: 4, step: 6, length: 5, position: 8 }, "negative") },
    { caption: "식을 세울 때는 첫 항의 위치와 원하는 항의 위치가 한 칸씩 어긋나지 않았는지 확인해요.", visual: sequenceVisual({ start: 4, step: 6, length: 5, position: 8 }, "verify") }
  ]
};

const rangeTrack = {
  id: "course-03-a1-remainder-track-2",
  title: "포함 범위에서 항의 개수 세기",
  openingPrompt: "같은 간격의 수 중에서 정해진 범위의 양끝을 포함하는 항을 빠짐없이 세어 보세요.",
  hint: "범위 안에 들어오는 첫 항과 마지막 항을 찾고, 두 항 사이의 이동 횟수에 첫 항을 더하세요.",
  beats: [
    { caption: "수직선에 아래쪽 경계와 위쪽 경계를 먼저 표시해요.", visual: rangeVisual({ start: 7, step: 5, lower: 18, upper: 52 }, "problem") },
    { caption: "범위 안에 들어오는 첫 항과 마지막 항을 표에서 찾고 양끝을 지우지 않아요.", visual: rangeVisual({ start: 7, step: 5, lower: 18, upper: 52 }, "table") },
    { caption: "첫 항에서 마지막 항까지의 차이를 같은 간격으로 나누어 이동 횟수를 확인해요.", visual: rangeVisual({ start: 7, step: 5, lower: 18, upper: 52 }, "count") },
    { caption: "이동 횟수에 첫 항을 하나로 세어 더하면 범위 안의 항 개수가 돼요.", visual: rangeVisual({ start: 7, step: 5, lower: 18, upper: 52 }, "verify") }
  ]
};

const lessonId = "course-03-a1-positive-negative-remainder";
const original = [
  sequenceItem(lessonId, "practice-01", { start: 5, step: 7, length: 4, position: 9 }, 1, "5부터 7씩 커지는 수열의 9번째 수를 구해 보세요."),
  sequenceItem(lessonId, "practice-02", { start: 8, step: 9, length: 5, position: 11 }, 1, "8부터 9씩 커지는 수열의 11번째 수를 구해 보세요."),
  rangeItem(lessonId, "practice-03", { start: 6, step: 8, lower: 22, upper: 70 }, 2, "범위의 양끝을 포함해 조건에 맞는 수의 개수를 구해 보세요."),
  rangeItem(lessonId, "practice-04", { start: 3, step: 11, lower: 25, upper: 91 }, 2, "수직선에서 범위 안에 놓이는 항을 모두 세어 보세요.")
];

const extension = rangeItem(lessonId, "extension", { start: 9, step: 13, lower: 40, upper: 150 }, 1, "두 경계에 걸친 수열에서 포함되는 항의 개수를 구해 보세요.");

const similar = [
  sequenceItem(lessonId, "similar-01", { start: 2, step: 11, length: 6, position: 10 }, 2, "2부터 11씩 커지는 수열의 10번째 수를 구해 보세요."),
  sequenceItem(lessonId, "similar-02", { start: 10, step: 12, length: 4, position: 7 }, 1, "10부터 12씩 커지는 수열의 7번째 수를 구해 보세요."),
  rangeItem(lessonId, "similar-03", { start: 4, step: 9, lower: 30, upper: 86 }, 2, "범위의 양끝을 포함하는 항의 개수를 세어 보세요."),
  rangeItem(lessonId, "similar-04", { start: 11, step: 14, lower: 45, upper: 160 }, 1, "첫 항과 마지막 항을 찾아 간격으로 개수를 확인해 보세요."),
  rangeItem(lessonId, "similar-05", { start: 1, step: 16, lower: 33, upper: 130 }, 2, "수직선과 표를 함께 사용해 조건을 만족하는 항을 찾아 보세요.")
];

const makeExperience = () => ({
  kind: "course-concept",
  tracks: [sequenceTrack, rangeTrack],
  openingPrompt: sequenceTrack.openingPrompt,
  hint: sequenceTrack.hint,
  beats: sequenceTrack.beats
});

export const COURSE03_A1_REMAINDER_LESSON = Object.freeze({
  id: lessonId,
  bookId: "course-03-a1",
  courseId: "course-03",
  label: "A1",
  title: "양의 나머지와 음의 나머지를 함께 읽어요",
  unit: "나머지 정리",
  representativeConcept: "같은 나머지를 가진 수열을 양의 식과 음의 식으로 나타내고 포함 범위의 항 수 세기",
  story: { title: "두 식으로 여는 수열 상자", text: "같은 수열을 서로 다른 두 식으로 읽고 범위 안의 수를 빠짐없이 찾아요.", mission: "항 번호의 시작과 범위의 양끝을 정확히 확인하세요." },
  explanation: { headline: "같은 수열의 두 표현", steps: ["첫 항에서 시작하면 이동 횟수는 항 번호보다 1 작습니다.", "바로 앞 묶음에서 시작하는 음의 식은 항 번호를 그대로 사용합니다.", "범위 문제는 첫 항과 마지막 항을 모두 포함해 셉니다."] },
  learnerStage: "필즈 더 클래식 3과정 A1; 연령 미확정",
  status: "pilot",
  source: { origin: "textbook-derived", note: "교재 구조를 참고해 새 예시로 구성한 개념 학습입니다." },
  experience: makeExperience(),
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  original: { title: "연습", prompt: "같은 나머지 수열의 항과 범위 안의 개수를 구해 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension,
  similarPractice: similar
});

const sequenceValues = (visual) => Array.from({ length: visual.length }, (_, i) => visual.start + visual.step * i);

function sequenceMarkup(visual) {
  const values = sequenceValues(visual);
  const phase = visual.phase || "problem";
  const shown = values.map((value, i) => `<span class="course03-sequence-cell${i + 1 === visual.position ? " is-target" : ""}">${value}</span>`).join("");
  const distantTarget = visual.position > visual.length ? `<span class="course03-sequence-gap" aria-hidden="true">…</span><span class="course03-sequence-cell is-target">${visual.position}번째 ?</span>` : "";
  const positive = `${visual.start} + ${visual.step}a`;
  const negative = `${visual.start - visual.step} + ${visual.step}b`;
  const target = visual.start + visual.step * (visual.position - 1);
  const detail = phase === "positive" ? `<p class="course03-equation">${esc(positive)} <span>a는 0부터 시작하고, ${visual.position}번째에서는 a = ${visual.position - 1}</span></p>` : "";
  const reverse = phase === "negative" ? `<p class="course03-equation">${esc(negative)} <span>b는 1부터 시작하고, ${visual.position}번째에서는 b = ${visual.position}</span></p>` : "";
  const verify = phase === "verify" ? `<div class="course03-proof"><p>${visual.start} + ${visual.step} × ${visual.position - 1} = ${target}</p><p>${visual.start - visual.step} + ${visual.step} × ${visual.position} = ${target}</p><p>${visual.position}번째 수는 ${target}입니다.</p></div>` : "";
  return `<div class="course03-remainder-visual" data-phase="${esc(phase)}"><div class="course03-sequence" aria-label="같은 간격 수열">${shown}${distantTarget}</div>${detail}${reverse}${verify}</div>`;
}

function rangeMarkup(visual) {
  const phase = visual.phase || "problem";
  const values = Array.from({ length: Math.max(1, Math.floor((visual.upper - visual.start) / visual.step) + 1) }, (_, i) => visual.start + visual.step * i);
  const inside = values.filter((value) => value >= visual.lower && value <= visual.upper);
  const cells = values.map((value) => `<span class="course03-range-cell${value >= visual.lower && value <= visual.upper ? " is-inside" : ""}">${value}</span>`).join("");
  const table = phase === "table" || phase === "count" || phase === "verify" ? `<table class="course03-range-table"><caption>범위의 양끝을 포함해 확인하기</caption><tbody><tr>${inside.map((value) => `<td>${value}</td>`).join("")}</tr></tbody></table>` : "";
  const proof = phase === "verify" ? `<p class="course03-proof">${inside.length}개 항을 양끝까지 포함해 세어요.</p>` : "";
  return `<div class="course03-remainder-visual" data-phase="${esc(phase)}"><p class="course03-range-label">${visual.lower} 이상 ${visual.upper} 이하</p><div class="course03-number-line" aria-label="범위 수직선">${cells}</div>${table}${proof}</div>`;
}

export function course03RemainderConceptMarkup(visual) {
  if (visual?.kind === "course03-remainder-sequence") return sequenceMarkup(visual);
  if (visual?.kind === "course03-remainder-range") return rangeMarkup(visual);
  return "";
}
