import { book02Markup } from "./book02-renderers.js?v=20260913a";

const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

export const STONE_GROWTH_KIND = "course02-stone-growth";

export const stoneStageModel = (stage) => {
  if (!Number.isInteger(stage) || stage < 1) throw new RangeError("stage must be a positive integer");
  const rows = Array.from({ length: stage + 1 }, (_, row) => Array.from({ length: row + 1 }, (_, column) => ({
    row, column, color: row === stage || column === 0 || column === row ? "black" : "white"
  })));
  const blackCount = rows.flat().filter((stone) => stone.color === "black").length;
  const whiteCount = rows.flat().filter((stone) => stone.color === "white").length;
  return Object.freeze({ stage, rows, blackCount, whiteCount, totalCount: blackCount + whiteCount, difference: Math.abs(blackCount - whiteCount), largerColor: blackCount >= whiteCount ? "black" : "white" });
};

export const firstWhiteExceedsStage = () => {
  for (let stage = 1; stage <= 100; stage += 1) if (stoneStageModel(stage).whiteCount > stoneStageModel(stage).blackCount) return stage;
  throw new Error("crossover stage was not found");
};

export const stageForWhiteCount = (target) => {
  for (let stage = 1; stage <= 100; stage += 1) if (stoneStageModel(stage).whiteCount === target) return stage;
  return null;
};

const visual = (stage, phase = "problem", task = "count-black", extra = {}) => ({ kind: STONE_GROWTH_KIND, stage, phase, task, ...extra });
const ref = (lessonId, id) => `/course02/course-02-a1/${lessonId}:${id}`;
const item = (lessonId, id, prompt, stage, task, group) => ({
  id: `${lessonId}:${id}`, prompt, hint: "바깥 줄과 안쪽 줄을 나누어 세고, 꼭짓점은 한 번만 세어 보세요.",
  visual: visual(stage, "problem", task), answerMode: "input", inputMode: "numeric", typeLabel: "두 색 바둑돌 성장 규칙", printGroup: group,
  sourceNo: id.startsWith("practice-") ? id.slice("practice-".length) : "",
  answerRef: ref(lessonId, id)
});

const lessonId = "course-02-a1-stone-growth-activity-03";

const original = [
  item(lessonId, "practice-1", "6번째 그림에서 바깥쪽 검은 돌은 몇 개인지 구해 보세요.", 6, "count-black", 1),
  item(lessonId, "practice-2", "8번째 그림에서 안쪽 흰 돌은 몇 개인지 구해 보세요.", 8, "count-white", 1),
  item(lessonId, "practice-3", "7번째 그림에서 검은 돌과 흰 돌의 개수 차를 구해 보세요.", 7, "difference-color", 2),
  item(lessonId, "practice-4", "흰 돌이 검은 돌보다 처음 많아지는 단계를 구해 보세요.", 8, "first-white-exceeds", 2)
];

const extensionTarget = stoneStageModel(10);
const extension = {
  ...item(lessonId, "extension", `안쪽 흰 돌이 ${extensionTarget.whiteCount}개가 되는 단계는 몇 번째인지 구해 보세요.`, 6, "reverse-white-count", 1),
  visual: visual(6, "problem", "reverse-white-count", { targetWhiteCount: extensionTarget.whiteCount })
};

const similarPractice = [
  item(lessonId, "similar-1", "5번째 그림에서 검은 돌은 몇 개인지 구해 보세요.", 5, "count-black", 1),
  item(lessonId, "similar-2", "9번째 그림에서 흰 돌은 몇 개인지 구해 보세요.", 9, "count-white", 1),
  item(lessonId, "similar-3", "8번째 그림에서 검은 돌과 흰 돌의 개수 차를 구해 보세요.", 8, "difference-color", 2),
  item(lessonId, "similar-4", "흰 돌이 처음으로 더 많아지는 단계의 바로 앞 단계를 확인해 보세요.", 8, "crossover-previous", 2),
  item(lessonId, "similar-5", "11번째 그림에서 흰 돌은 검은 돌보다 몇 개 더 많은지 구해 보세요.", 11, "difference-color", 2)
];

const trackVisual = (stage, phase, task) => visual(stage, phase, task);
const tracks = [
  {
    id: "course-02-a1-stone-growth-track-1", title: "두 색 돌을 따로 세기",
    openingPrompt: "삼각형의 바깥 줄과 안쪽 줄을 나누어 두 색의 개수를 찾아요.",
    hint: "같은 색이 놓인 줄의 길이를 차례로 적고, 겹치는 꼭짓점은 한 번만 세세요.",
    beats: [
      { caption: "한 단계의 돌을 바깥 줄과 안쪽 줄로 나누어 관찰해요.", visual: trackVisual(5, "problem", "count-black") },
      { caption: "바깥 줄의 돌과 안쪽 줄의 돌을 색별로 따로 세어요.", visual: trackVisual(5, "count", "count-both") },
      { caption: "각 단계에서 색별 개수가 어떻게 늘어나는지 표로 정리해요.", visual: trackVisual(6, "formula", "count-both") },
      { caption: "표의 합이 전체 돌 개수와 같은지 다시 세어 확인해요.", visual: trackVisual(7, "verify", "count-both") }
    ]
  },
  {
    id: "course-02-a1-stone-growth-track-2", title: "두 색의 차와 처음 역전되는 단계",
    openingPrompt: "색별 개수의 차를 비교하고 흰 돌이 처음 더 많아지는 때를 찾아요.",
    hint: "앞 단계가 아직 역전되지 않았는지 확인한 뒤, 다음 단계에서 부등호가 바뀌는지 살펴보세요.",
    beats: [
      { caption: "같은 단계의 검은 돌과 흰 돌을 짝지어 차를 비교해요.", visual: trackVisual(6, "problem", "difference-color") },
      { caption: "색별 개수와 차이를 표에 적어 어느 색이 많은지 표시해요.", visual: trackVisual(7, "count", "difference-color") },
      { caption: "흰 돌이 더 많아지는 후보 단계와 바로 앞 단계를 함께 비교해요.", visual: trackVisual(8, "formula", "first-white-exceeds") },
      { caption: "두 단계의 부등호를 확인해 최초 역전 단계가 최소인지 검증해요.", visual: trackVisual(9, "verify", "first-white-exceeds") }
    ]
  }
];

export const COURSE02_A1_STONE_GROWTH_LESSON = Object.freeze({
  id: lessonId, courseId: "course-02", bookId: "course-02-a1", label: "A1", title: "도형에서 규칙 찾기", unit: "도형에서 규칙 찾기", status: "pilot",
  learnerStage: "필즈 더 클래식 2과정 A1; 연령 미확정",
  representativeConcept: "성장하는 삼각형에서 두 색 바둑돌의 개수와 차를 비교하고 최초 역전 단계를 찾기",
  story: { title: "두 색 돌의 성장", text: "삼각형이 커질 때 바깥과 안쪽의 돌을 색별로 세어 봐요.", mission: "두 색의 개수와 차가 단계에 따라 어떻게 바뀌는지 확인하세요." },
  explanation: { headline: "바깥 돌과 안쪽 돌을 나누어 세기", steps: ["바깥 줄의 돌은 변과 꼭짓점을 겹치지 않게 셉니다.", "안쪽 돌은 줄별 누적으로 셉니다.", "두 색의 개수와 차를 비교하고 앞 단계와 대조해 최초 역전을 확인합니다."] },
  experience: { kind: "course-concept", tracks },
  original: { title: "연습", prompt: "두 색 바둑돌의 개수와 차를 구해 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension, similarPractice,
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  sourceTypeIds: [], source: { origin: "textbook-derived", note: "교재 구조를 참고한 새 개념 학습입니다." }
});

const ledger = (model, task) => {
  const entries = task === "count-black" ? [`검은 돌: ${model.blackCount}개`] : task === "count-white" ? [`흰 돌: ${model.whiteCount}개`] : [`검은 돌: ${model.blackCount}개`, `흰 돌: ${model.whiteCount}개`, `차: ${model.difference}개`, `더 많은 색: ${model.largerColor === "black" ? "검은색" : "흰색"}`];
  return `<div class="course02-stone-ledger"><strong>확인표</strong>${entries.map((entry) => `<span>${esc(entry)}</span>`).join("")}</div>`;
};

export function course02StoneGrowthConceptMarkup(input) {
  if (!input || input.kind !== STONE_GROWTH_KIND || !Number.isInteger(input.stage) || input.stage < 1) return "";
  const phase = input.phase || "problem";
  const crossoverStage = firstWhiteExceedsStage();
  const reverseStage = input.task === "reverse-white-count" ? stageForWhiteCount(input.targetWhiteCount) : null;
  const stages = ["first-white-exceeds", "crossover-previous"].includes(input.task)
    ? phase === "verify" ? [crossoverStage - 1, crossoverStage] : [crossoverStage - 3, crossoverStage - 2, crossoverStage - 1]
    : input.task === "reverse-white-count"
      ? phase === "verify" && reverseStage ? [reverseStage] : [Math.max(1, input.stage - 2), Math.max(1, input.stage - 1), input.stage]
      : [input.stage];
  const model = stoneStageModel(stages.at(-1));
  const adapted = { kind: "book2", subtype: "stone-growth", stages, target: "" };
  const base = book02Markup(adapted).replace(/<strong>.*?<\/strong>/, "");
  const showLedger = phase === "count" || phase === "formula" || phase === "verify";
  const crossoverLedgers = phase === "verify" && ["first-white-exceeds", "crossover-previous"].includes(input.task)
    ? stages.map((stage) => ledger(stoneStageModel(stage), "difference-color")).join("")
    : "";
  return `<div class="course02-stone-growth-concept" data-phase="${esc(phase)}" data-stage="${model.stage}">${base}${crossoverLedgers || (showLedger ? ledger(model, input.task) : "")}</div>`;
}
