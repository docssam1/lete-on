const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const BLADE_NAMES = Object.freeze(["위", "오른쪽 위", "오른쪽 아래", "왼쪽 아래", "왼쪽 위"]);
const CYCLE = Object.freeze([4, 0, 2, 0, 4]);

export function course02WindmillAnswer(visual) {
  if (!visual || visual.kind !== "course02-windmill-pattern") throw new TypeError("A windmill-pattern visual is required");
  if (!Number.isInteger(visual.position) || visual.position < 1) throw new RangeError("Pattern position must be a positive integer");
  return BLADE_NAMES[CYCLE[(visual.position - 1) % CYCLE.length]];
}

const visual = (position, phase = "problem") => ({ kind: "course02-windmill-pattern", position, phase });
const lessonId = "course-02-a1-windmill-pattern";
const makeItem = (id, position, printGroup) => ({
  id: `${lessonId}:${id}`,
  prompt: `바람개비의 색칠 위치가 같은 순서로 반복됩니다. ${position}번째에 색칠할 날개의 위치를 써 보세요.`,
  hint: "첫째부터 다섯째까지를 한 마디로 묶고, 목표 번째를 5로 나눈 나머지를 확인하세요.",
  visual: visual(position), answerMode: "input", inputMode: "text",
  typeLabel: "바람개비 색칠 위치의 반복", sourceNo: id.startsWith("practice-") ? id.slice(9) : "", printGroup,
  answerRef: `/course02/course-02-a1/${lessonId}:${id}`
});

const original = [12, 16, 21, 28].map((position, index) => makeItem(`practice-${index + 1}`, position, index < 2 ? 1 : 2));
const extension = makeItem("extension", 37, 1);
const similarPractice = [43, 50, 61, 74, 89].map((position, index) => makeItem(`similar-${index + 1}`, position, index % 2 + 1));
const tracks = [
  { id: "course-02-a1-windmill-track-1", title: "갔다 돌아오는 색칠 위치", openingPrompt: "색칠한 날개가 왼쪽 위, 위, 오른쪽 아래, 위, 왼쪽 위 순서로 반복될 때 18번째 위치를 찾아요.", hint: "서로 다른 위치는 세 곳이지만 한 마디에는 다섯 그림이 있습니다.", beats: [
    { caption: "색칠한 날개의 위치를 첫째부터 차례로 읽어요.", visual: visual(18, "problem") },
    { caption: "왼쪽 위, 위, 오른쪽 아래, 위, 왼쪽 위의 다섯 그림이 한 마디입니다. 같은 마디를 두 번 확인해요.", visual: visual(18, "group") },
    { caption: "18 ÷ 5는 몫 3, 나머지 3입니다. 다음 마디의 세 번째 위치를 봐요.", visual: visual(18, "calculate") },
    { caption: "한 마디의 세 번째인 오른쪽 아래 날개를 색칠하고, 앞뒤 위치의 흐름도 확인해요.", visual: visual(18, "verify") }
  ] },
  { id: "course-02-a1-windmill-track-2", title: "마디의 마지막 자리", openingPrompt: "25번째 바람개비에서 색칠할 날개의 위치를 찾아요.", hint: "25를 5로 나눈 나머지가 0이면 다섯째 그림을 사용합니다.", beats: [
    { caption: "두 마디와 다음 그림을 보며 반복이 이어지는지 확인해요.", visual: visual(25, "problem") },
    { caption: "다섯 그림을 한 마디로 묶습니다. 처음과 마지막은 모두 왼쪽 위입니다.", visual: visual(25, "group") },
    { caption: "25 ÷ 5는 몫 5, 나머지 0입니다. 0번째가 아니라 다섯째 위치를 봐요.", visual: visual(25, "calculate") },
    { caption: "다섯째 위치인 왼쪽 위 날개를 색칠하고 5마디가 정확히 끝나는지 확인해요.", visual: visual(25, "verify") }
  ] }
];

export const COURSE02_A1_WINDMILL_PATTERN_LESSON = Object.freeze({
  id: lessonId, courseId: "course-02", bookId: "course-02-a1", label: "A1", title: "바람개비의 색칠 위치를 찾아요", unit: "마디수열과 규칙 찾기", status: "pilot",
  learnerStage: "필즈 더 클래식 2과정 A1; 연령 미확정",
  representativeConcept: "갔다 돌아오는 색칠 위치 다섯 그림을 한 마디로 묶어 먼 번째 위치 찾기",
  story: { title: "바람개비 조명", text: "바람개비의 한 날개가 정해진 순서로 색칠됩니다.", mission: "서로 다른 위치의 수가 아니라 반복되는 그림의 수로 한 마디를 찾으세요." },
  explanation: { headline: "색칠 위치의 반복마디", steps: ["첫째부터 색칠된 날개의 위치를 차례로 읽습니다.", "다섯 그림을 한 마디로 묶고 두 마디가 같은지 확인합니다.", "목표 번째를 5로 나눈 나머지로 색칠할 위치를 찾습니다."] },
  experience: { kind: "course-concept", tracks },
  original: { title: "연습", prompt: "목표 번째 바람개비의 알맞은 날개 위치를 찾아 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension, similarPractice,
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  sourceTypeIds: [], source: { origin: "textbook-derived", note: "교재의 위치 반복 활동 구조를 참고한 새 개념 학습입니다." }
});

const polar = (radius, degrees) => {
  const angle = degrees * Math.PI / 180;
  return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius];
};
const point = ([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`;
const blade = (index, filled) => {
  const angle = -90 + index * 72;
  const points = [polar(5, angle - 28), polar(31, angle - 17), polar(43, angle), polar(31, angle + 17), polar(5, angle + 28)].map(point).join(" ");
  return `<polygon points="${points}" class="${filled ? "filled" : ""}" />`;
};
const windmillSvg = (filledIndex, label) => `<figure class="windmill-figure"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(label)}"><g>${Array.from({ length: 5 }, (_, index) => blade(index, index === filledIndex)).join("")}</g><circle cx="50" cy="50" r="3" /></svg><figcaption>${esc(label)}</figcaption></figure>`;

export function course02WindmillConceptMarkup(visualData) {
  if (!visualData || visualData.kind !== "course02-windmill-pattern") return "";
  const phase = visualData.phase || "problem";
  const slot = (visualData.position - 1) % 5;
  const long = phase === "problem" || phase === "group";
  const indexes = long ? [...CYCLE, ...CYCLE, ...CYCLE.slice(0, 2)] : CYCLE;
  const figures = (values, offset = 0) => values.map((filled, index) => windmillSvg(filled, `${offset + index + 1}번째`)).join("");
  const sequence = long
    ? `<div class="windmill-cycle-set"><em>첫째 마디</em>${figures(CYCLE)}</div><div class="windmill-cycle-set"><em>둘째 마디</em>${figures(CYCLE, 5)}</div><div class="windmill-cycle-set partial"><em>다음 2개</em>${figures(CYCLE.slice(0, 2), 10)}</div>`
    : figures(indexes);
  const equation = phase === "calculate" || phase === "verify" ? `<p class="windmill-equation">${visualData.position} ÷ 5 = ${Math.floor(visualData.position / 5)} · 나머지 ${visualData.position % 5}<strong>${visualData.position % 5 === 0 ? "다섯째" : `${visualData.position % 5}번째`} 위치</strong></p>` : "";
  const target = phase === "verify" ? windmillSvg(CYCLE[slot], `${visualData.position}번째 · ${course02WindmillAnswer(visualData)}`) : `<div class="windmill-target"><strong>${visualData.position}번째</strong><span>어느 날개일까요?</span></div>`;
  return `<div class="course02-windmill-pattern" data-phase="${esc(phase)}"><div class="windmill-sequence${long ? " grouped" : ""}">${sequence}</div>${equation}<div class="windmill-answer">${target}</div></div>`;
}
