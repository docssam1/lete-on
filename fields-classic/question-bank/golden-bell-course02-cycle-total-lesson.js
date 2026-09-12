const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

export function course02CycleTotalModel(visual) {
  if (!visual || visual.kind !== "course02-cycle-total") throw new TypeError("A course02 cycle-total visual is required");
  if (!Number.isInteger(visual.total) || visual.total < 1) throw new RangeError("The total must be a positive integer");
  if (!Array.isArray(visual.cycle) || visual.cycle.length < 2) throw new RangeError("The cycle needs at least two values");
  const fullGroups = Math.floor(visual.total / visual.cycle.length);
  const remainder = visual.total % visual.cycle.length;
  const tail = visual.cycle.slice(0, remainder);
  if (visual.task === "difference") {
    if (!visual.cycle.every((value) => value === "흰 돌" || value === "검은 돌")) throw new TypeError("Difference cycles use black and white stones");
    const counts = { "흰 돌": 0, "검은 돌": 0 };
    for (const value of visual.cycle) counts[value] += fullGroups;
    for (const value of tail) counts[value] += 1;
    const difference = Math.abs(counts["흰 돌"] - counts["검은 돌"]);
    const winner = difference === 0 ? "같음" : counts["흰 돌"] > counts["검은 돌"] ? "흰 돌" : "검은 돌";
    return { task: visual.task, fullGroups, remainder, tail, counts, difference, winner, answer: `${winner} / ${difference}개` };
  }
  if (visual.task === "sum") {
    if (!visual.cycle.every((value) => Number.isInteger(value))) throw new TypeError("Sum cycles use integers");
    const cycleSum = visual.cycle.reduce((sum, value) => sum + value, 0);
    const tailSum = tail.reduce((sum, value) => sum + value, 0);
    const sum = cycleSum * fullGroups + tailSum;
    return { task: visual.task, fullGroups, remainder, tail, cycleSum, tailSum, sum, answer: sum };
  }
  throw new RangeError(`Unknown cycle-total task: ${visual.task}`);
}

export const course02CycleTotalAnswer = (visual) => course02CycleTotalModel(visual).answer;

const visual = (task, cycle, total, phase = "problem") => ({ kind: "course02-cycle-total", task, cycle: Object.freeze([...cycle]), total, phase });

const lessonId = "course-02-a1-cycle-total";
const makeItem = (id, task, cycle, total, printGroup) => ({
  id: `${lessonId}:${id}`,
  prompt: task === "difference"
    ? `${cycle.join(", ")}이 이 순서로 반복됩니다. 돌을 모두 ${total}개 놓았을 때 어느 색 돌이 몇 개 더 많은지 '검은 돌 / 3개'처럼 써 보세요.`
    : `${cycle.join(", ")}이 이 순서로 반복됩니다. ${total}번째 수까지의 합을 구해 보세요.`,
  hint: task === "difference"
    ? "전체 개수를 한 마디의 길이로 나눈 뒤, 완전한 마디와 남은 돌에서 두 색을 각각 세세요."
    : "한 마디의 합에 완전한 마디 수를 곱하고, 마지막에 남은 수를 더하세요.",
  visual: visual(task, cycle, total),
  answerMode: "input",
  inputMode: task === "sum" ? "numeric" : "text",
  typeLabel: task === "difference" ? "반복마디의 전체 개수에서 두 색의 차 구하기" : "반복 수열의 일정한 자리까지 합 구하기",
  sourceNo: id.startsWith("practice-") ? id.slice(9) : "",
  printGroup,
  answerRef: `/course02/course-02-a1/${lessonId}:${id}`
});

const original = [
  makeItem("practice-1", "difference", ["흰 돌", "검은 돌", "검은 돌"], 58, 1),
  makeItem("practice-2", "difference", ["흰 돌", "흰 돌", "검은 돌", "검은 돌", "검은 돌"], 73, 1),
  makeItem("practice-3", "sum", [7, 3, 1, 5], 46, 2),
  makeItem("practice-4", "sum", [2, 6, 4, 9, 3], 63, 2)
];
const extension = makeItem("extension", "difference", ["검은 돌", "흰 돌", "흰 돌", "흰 돌"], 67, 1);
const similarPractice = [
  makeItem("similar-1", "sum", [6, 1, 8], 52, 1),
  makeItem("similar-2", "difference", ["검은 돌", "검은 돌", "흰 돌", "검은 돌", "흰 돌"], 84, 1),
  makeItem("similar-3", "sum", [4, 9, 2, 7], 75, 2),
  makeItem("similar-4", "difference", ["흰 돌", "검은 돌", "흰 돌", "흰 돌", "검은 돌", "검은 돌"], 95, 2),
  makeItem("similar-5", "sum", [3, 8, 5, 1, 6], 91, 1)
];

const tracks = [
  {
    id: "course-02-a1-cycle-total-difference",
    title: "완전한 마디와 남은 돌을 따로 세요",
    openingPrompt: "흰 돌, 검은 돌, 검은 돌, 흰 돌, 검은 돌이 반복될 때 돌 47개 중 어느 색이 몇 개 더 많을까요?",
    hint: "47을 한 마디의 돌 수 5로 나누고, 아홉 마디 뒤에 남은 두 돌까지 세세요.",
    beats: [
      { caption: "흰 돌, 검은 돌, 검은 돌, 흰 돌, 검은 돌의 다섯 개가 한 마디입니다.", visual: visual("difference", ["흰 돌", "검은 돌", "검은 돌", "흰 돌", "검은 돌"], 47, "problem") },
      { caption: "한 마디에는 흰 돌 2개와 검은 돌 3개가 있습니다. 같은 마디를 두 번 확인해요.", visual: visual("difference", ["흰 돌", "검은 돌", "검은 돌", "흰 돌", "검은 돌"], 47, "group") },
      { caption: "47 = 5 × 9 + 2입니다. 아홉 마디를 센 뒤 남은 흰 돌 1개와 검은 돌 1개를 더합니다.", visual: visual("difference", ["흰 돌", "검은 돌", "검은 돌", "흰 돌", "검은 돌"], 47, "calculate") },
      { caption: "흰 돌은 19개, 검은 돌은 28개이므로 검은 돌이 9개 더 많습니다. 두 수의 합도 47인지 확인해요.", visual: visual("difference", ["흰 돌", "검은 돌", "검은 돌", "흰 돌", "검은 돌"], 47, "verify") }
    ]
  },
  {
    id: "course-02-a1-cycle-total-sum",
    title: "한 마디의 합과 남은 수를 더해요",
    openingPrompt: "4, 7, 2, 5가 반복될 때 38번째 수까지의 합은 얼마일까요?",
    hint: "38을 4로 나누어 완전한 마디 수와 남는 수를 찾으세요.",
    beats: [
      { caption: "4, 7, 2, 5의 네 수가 한 마디입니다. 먼저 한 마디의 합을 구해요.", visual: visual("sum", [4, 7, 2, 5], 38, "problem") },
      { caption: "한 마디의 합은 4 + 7 + 2 + 5 = 18입니다. 같은 마디를 두 번 확인해요.", visual: visual("sum", [4, 7, 2, 5], 38, "group") },
      { caption: "38 = 4 × 9 + 2이므로 완전한 아홉 마디 뒤에 4와 7이 남습니다.", visual: visual("sum", [4, 7, 2, 5], 38, "calculate") },
      { caption: "18 × 9 + 4 + 7 = 173입니다. 완전한 36개와 남은 2개로 모두 38개인지 확인해요.", visual: visual("sum", [4, 7, 2, 5], 38, "verify") }
    ]
  }
];

export const COURSE02_A1_CYCLE_TOTAL_LESSON = Object.freeze({
  id: lessonId,
  courseId: "course-02",
  bookId: "course-02-a1",
  label: "A1",
  title: "반복마디로 전체의 차와 합을 구해요",
  unit: "마디수열과 규칙 찾기",
  status: "pilot",
  learnerStage: "필즈 더 클래식 2과정 A1; 연령 미확정",
  representativeConcept: "전체 항을 완전한 반복마디와 남은 항으로 나누어 두 색의 개수 차 또는 수열의 합 구하기",
  story: { title: "끝까지 이어진 반복 줄", text: "같은 마디가 길게 반복되어도 모든 항을 하나씩 세지 않고 전체를 구할 수 있습니다.", mission: "완전한 마디와 남은 항을 빠짐없이 합쳐 확인하세요." },
  explanation: { headline: "완전한 마디와 남은 항을 함께 계산하는 방법", steps: ["문제에서 반복되는 한 마디를 정확히 찾습니다.", "전체 항 수를 마디 길이로 나누어 완전한 마디 수와 남은 항 수를 구합니다.", "마디마다의 개수나 합을 계산한 뒤 남은 항을 더하고 전체 항 수로 검산합니다."] },
  experience: { kind: "course-concept", tracks },
  original: { title: "연습", prompt: "반복마디 전체와 남은 항을 나누어 계산해 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension,
  similarPractice,
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  sourceTypeIds: [],
  source: { origin: "textbook-derived", note: "교재의 반복마디 전체 개수와 누적합 활동 구조를 참고한 새 개념 학습입니다." }
});

function tokenMarkup(value, highlighted = false) {
  if (typeof value === "number") return `<span class="cycle-total-token number${highlighted ? " target" : ""}">${value}</span>`;
  return `<span class="cycle-total-token stone ${value === "검은 돌" ? "black" : "white"}${highlighted ? " target" : ""}"><i aria-hidden="true"></i><b>${esc(value)}</b></span>`;
}

function cyclePreview(cycle) {
  const set = (label, values, part) => `<span class="cycle-total-set" data-cycle-part="${part}" style="--cycle-length:${values.length}"><em>${label}</em>${values.map((value) => tokenMarkup(value)).join("")}</span>`;
  return `<div class="cycle-total-preview">${set("첫째 마디", cycle, "full")}${set("둘째 마디", cycle, "full")}${set("다음 2개", cycle.slice(0, 2), "partial")}</div>`;
}

export function course02CycleTotalConceptMarkup(visualData) {
  if (!visualData || visualData.kind !== "course02-cycle-total") return "";
  const phase = visualData.phase || "problem";
  const model = course02CycleTotalModel(visualData);
  const summary = visualData.task === "difference"
    ? `<div class="cycle-total-counts"><span>흰 돌 <b>${model.counts["흰 돌"]}개</b></span><span>검은 돌 <b>${model.counts["검은 돌"]}개</b></span></div>`
    : `<div class="cycle-total-counts"><span>한 마디의 합 <b>${model.cycleSum}</b></span><span>남은 수의 합 <b>${model.tailSum}</b></span></div>`;
  const answer = visualData.task === "difference" ? model.answer : `${model.answer}`;
  return `<div class="course02-cycle-total" data-phase="${esc(phase)}" data-task="${esc(visualData.task)}">
    ${["problem", "group"].includes(phase) ? cyclePreview(visualData.cycle) : `<div class="cycle-total-one-cycle"><strong>한 마디</strong>${visualData.cycle.map((value) => tokenMarkup(value)).join("")}</div>`}
    <p class="cycle-total-target">${visualData.task === "sum" ? `${visualData.total}번째 수까지` : `돌 전체 ${visualData.total}개`}</p>
    ${["calculate", "verify"].includes(phase) ? `<p class="cycle-total-equation">${visualData.total} = ${visualData.cycle.length} × ${model.fullGroups} + ${model.remainder}</p>${summary}` : ""}
    ${phase === "verify" ? `<p class="cycle-total-answer"><strong>답</strong> ${esc(answer)}</p>` : ""}
  </div>`;
}
