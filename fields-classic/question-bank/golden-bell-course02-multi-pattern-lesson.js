const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const DEFAULT_CYCLES = Object.freeze({
  color: Object.freeze(["노랑", "빨강", "파랑", "초록", "보라"]),
  count: Object.freeze([1, 2, 3, 4]),
  shape: Object.freeze(["동그라미", "세모", "네모", "별", "마름모", "육각형"])
});
const SIZE_CYCLES = Object.freeze({
  shape: Object.freeze(["동그라미", "세모", "네모", "별"]),
  color: Object.freeze(["하양", "초록", "초록"]),
  size: Object.freeze(["큰", "작은", "작은"])
});

const valueAt = (cycle, position) => cycle[(position - 1) % cycle.length];

export function course02MultiPatternAnswer(visual) {
  if (!visual || visual.kind !== "course02-multi-pattern") throw new TypeError("A course02 multi-pattern visual is required");
  if (!Number.isInteger(visual.position) || visual.position < 1) throw new RangeError("Pattern position must be a positive integer");
  const cycles = visual.cycles || (visual.mode === "size" ? SIZE_CYCLES : DEFAULT_CYCLES);
  return visual.mode === "size"
    ? `${valueAt(cycles.size, visual.position)} / ${valueAt(cycles.color, visual.position)} / ${valueAt(cycles.shape, visual.position)}`
    : `${valueAt(cycles.color, visual.position)} / ${valueAt(cycles.count, visual.position)}개 / ${valueAt(cycles.shape, visual.position)}`;
}

const visual = (position, phase = "problem", mode = "count") => ({ kind: "course02-multi-pattern", position, phase, mode, cycles: mode === "size" ? SIZE_CYCLES : DEFAULT_CYCLES });

const makeItem = (lessonId, id, position, printGroup, mode = "count") => ({
  id: `${lessonId}:${id}`,
  prompt: mode === "size"
    ? `모양, 색, 크기가 각각 같은 순서로 반복됩니다. ${position}번째 모양의 크기, 색, 모양을 차례로 써 보세요.`
    : `색, 개수, 모양이 각각 같은 순서로 반복됩니다. ${position}번째 카드의 색, 개수, 모양을 차례로 써 보세요.`,
  hint: mode === "size" ? "모양, 색, 크기의 반복마디를 따로 찾으세요. 답은 '큰 / 초록 / 별'처럼 씁니다." : "세 줄을 한꺼번에 세지 말고, 각 반복마디에서 목표 번째의 자리를 따로 찾으세요. 답은 '색 / 0개 / 모양'처럼 씁니다.",
  visual: visual(position, "problem", mode),
  answerMode: "input",
  inputMode: "text",
  typeLabel: mode === "size" ? "모양·색·크기의 반복을 한 위치에서 합치기" : "서로 다른 반복마디를 한 위치에서 합치기",
  sourceNo: id.startsWith("practice-") ? id.slice(9) : "",
  printGroup,
  answerRef: `/course02/course-02-a1/${lessonId}:${id}`
});

const lessonId = "course-02-a1-multi-pattern-activity";
const original = [makeItem(lessonId, "practice-1", 23, 1), makeItem(lessonId, "practice-2", 34, 1), makeItem(lessonId, "practice-3", 31, 2, "size"), makeItem(lessonId, "practice-4", 44, 2, "size")];
const extension = makeItem(lessonId, "extension", 53, 1, "size");
const similarPractice = [makeItem(lessonId, "similar-1", 29, 1), makeItem(lessonId, "similar-2", 46, 1), makeItem(lessonId, "similar-3", 38, 2, "size"), makeItem(lessonId, "similar-4", 59, 2, "size"), makeItem(lessonId, "similar-5", 73, 1)];

const tracks = [
  {
    id: "course-02-a1-multi-pattern-track-1",
    title: "세 반복마디를 따로 찾아요",
    openingPrompt: "색은 5개, 개수는 4개, 모양은 6개씩 반복될 때 27번째 카드는 어떻게 생겼을까요?",
    hint: "27을 5, 4, 6으로 각각 나누어 남는 자리를 확인하세요.",
    beats: [
      { caption: "색, 개수, 모양의 반복마디 길이가 서로 다릅니다. 세 줄을 따로 읽어요.", visual: visual(27, "problem") },
      { caption: "색은 5개, 개수는 4개, 모양은 6개가 한 마디입니다. 같은 마디를 두 번 이상 확인해요.", visual: visual(27, "group") },
      { caption: "27을 각 마디 길이로 나눕니다. 나머지가 0이면 그 마디의 마지막 자리를 봅니다.", visual: visual(27, "calculate") },
      { caption: "각 줄에서 찾은 색, 개수, 모양을 한 카드에 합치고 세 조건을 모두 확인해요.", visual: visual(27, "verify") }
    ]
  },
  {
    id: "course-02-a1-multi-pattern-track-2",
    title: "모양·색·크기를 함께 찾아요",
    openingPrompt: "모양은 4개, 색과 크기는 3개씩 반복될 때 26번째 모양을 완성해요.",
    hint: "26을 4와 3으로 각각 나누어 모양, 색, 크기의 자리를 따로 찾으세요.",
    beats: [
      { caption: "한 줄에 섞여 보여도 모양, 색, 크기의 순서를 따로 읽습니다.", visual: visual(26, "problem", "size") },
      { caption: "모양은 네 개, 색과 크기는 세 개가 한 마디입니다. 각 마디를 두 번 확인해요.", visual: visual(26, "group", "size") },
      { caption: "26 ÷ 4는 나머지 2, 26 ÷ 3은 나머지 2입니다. 각 마디의 두 번째 값을 봐요.", visual: visual(26, "calculate", "size") },
      { caption: "찾은 크기, 색, 모양을 하나로 합치고 12번째마다 같은 조합이 반복되는지 확인해요.", visual: visual(26, "verify", "size") }
    ]
  }
];

export const COURSE02_A1_MULTI_PATTERN_LESSON = Object.freeze({
  id: lessonId,
  courseId: "course-02",
  bookId: "course-02-a1",
  label: "A1",
  title: "여러 반복마디를 한 카드로 합쳐요",
  unit: "마디수열과 규칙 찾기",
  status: "pilot",
  learnerStage: "필즈 더 클래식 2과정 A1; 연령 미확정",
  representativeConcept: "색·개수·모양 또는 모양·색·크기의 서로 다른 반복마디를 각각 계산해 같은 번째 그림으로 합치기",
  story: { title: "세 줄 카드 공방", text: "한 그림을 이루는 세 가지 조건이 서로 다른 속도로 반복됩니다.", mission: "같은 번째에서 세 줄의 값을 모아 그림 하나를 완성하세요." },
  explanation: { headline: "세 반복마디를 따로 찾고 합치는 방법", steps: ["문제에 나온 색, 개수, 모양 또는 크기의 한 마디를 각각 찾습니다.", "목표 번째를 각 마디 길이로 나누어 남는 자리를 확인합니다.", "찾은 세 값을 한 그림에 합친 뒤 모든 조건을 다시 확인합니다."] },
  experience: { kind: "course-concept", tracks },
  original: { title: "연습", prompt: "각 줄의 규칙으로 목표 번째 카드를 완성해 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension,
  similarPractice,
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  sourceTypeIds: [],
  source: { origin: "textbook-derived", note: "교재의 복합 반복 활동 구조를 참고한 새 개념 학습입니다." }
});

const shapeGlyph = { "동그라미": "●", "세모": "▲", "네모": "■", "별": "★", "마름모": "◆", "육각형": "⬢" };
const colorClass = { "노랑": "yellow", "빨강": "red", "파랑": "blue", "초록": "green", "보라": "purple" };

function tokenMarkup(kind, value, highlighted = false) {
  if (kind === "color") return `<span class="multi-pattern-token color ${esc(colorClass[value])}${highlighted ? " target" : ""}"><i aria-hidden="true"></i><b>${esc(value)}</b></span>`;
  if (kind === "count") return `<span class="multi-pattern-token count${highlighted ? " target" : ""}"><i>${esc(value)}</i><b>${esc(value)}개</b></span>`;
  if (kind === "size") return `<span class="multi-pattern-token size${highlighted ? " target" : ""}"><i class="${value === "큰" ? "large" : "small"}" aria-hidden="true"></i><b>${esc(value)}</b></span>`;
  return `<span class="multi-pattern-token shape${highlighted ? " target" : ""}"><i aria-hidden="true">${esc(shapeGlyph[value] || value)}</i><b>${esc(value)}</b></span>`;
}

function cycleRow(kind, label, cycle, phase, position) {
  const showLong = phase === "problem" || phase === "group";
  const slot = (position - 1) % cycle.length;
  const cycleSet = (groupLabel, values, part) => `<span class="multi-pattern-cycle-set" data-cycle-part="${part}" style="--cycle-size:${values.length}"><em>${esc(groupLabel)}</em>${values.map((value) => tokenMarkup(kind, value)).join("")}</span>`;
  const run = showLong
    ? `<div class="multi-pattern-run grouped">${cycleSet("첫째 마디", cycle, "full")}${cycleSet("둘째 마디", cycle, "full")}${cycleSet("다음 2개", cycle.slice(0, 2), "partial")}</div>`
    : `<div class="multi-pattern-run" style="--cycle-size:${cycle.length}">${cycle.map((value, index) => tokenMarkup(kind, value, index === slot)).join("")}</div>`;
  const equation = phase === "calculate" || phase === "verify"
    ? `<strong class="multi-pattern-equation">${position} ÷ ${cycle.length} = ${Math.floor(position / cycle.length)} · 나머지 ${position % cycle.length}<span>${position % cycle.length === 0 ? `${cycle.length}번째` : `${position % cycle.length}번째`}</span></strong>`
    : "";
  return `<section class="multi-pattern-row" data-pattern-kind="${kind}"><h3>${esc(label)}</h3>${run}${equation}</section>`;
}

export function course02MultiPatternConceptMarkup(visualData) {
  if (!visualData || visualData.kind !== "course02-multi-pattern") return "";
  const phase = visualData.phase || "problem";
  const cycles = visualData.cycles || (visualData.mode === "size" ? SIZE_CYCLES : DEFAULT_CYCLES);
  const answer = course02MultiPatternAnswer(visualData);
  const sizeMode = visualData.mode === "size";
  const [first, second, shape] = answer.split(" / ");
  const color = sizeMode ? second : first;
  const pieceCount = sizeMode ? 1 : Number.parseInt(second, 10);
  const pieces = Array.from({ length: pieceCount }, () => `<span class="result-piece${sizeMode && first === "큰" ? " large" : ""}">${esc(shapeGlyph[shape] || shape)}</span>`).join("");
  const result = phase === "verify" ? `<div class="multi-pattern-result" aria-label="${visualData.position}번째 카드 ${esc(answer)}"><div class="result-pieces ${esc(colorClass[color] || (color === "하양" ? "white" : color))}" aria-hidden="true">${pieces}</div><b>${esc(first)} · ${esc(second)} · ${esc(shape)}</b></div>` : `<div class="multi-pattern-result pending"><strong>${visualData.position}번째 카드</strong><span>${sizeMode ? "모양 + 색 + 크기" : "색 + 개수 + 모양"}</span></div>`;
  const rows = sizeMode
    ? [cycleRow("shape", "모양", cycles.shape, phase, visualData.position), cycleRow("color", "색", cycles.color, phase, visualData.position), cycleRow("size", "크기", cycles.size, phase, visualData.position)]
    : [cycleRow("color", "색", cycles.color, phase, visualData.position), cycleRow("count", "개수", cycles.count, phase, visualData.position), cycleRow("shape", "모양", cycles.shape, phase, visualData.position)];
  return `<div class="course02-multi-pattern" data-phase="${esc(phase)}" data-position="${visualData.position}">
    <div class="multi-pattern-rows">${rows.join("")}</div>
    <div class="multi-pattern-combine"><span aria-hidden="true">↓</span>${result}</div>
  </div>`;
}
