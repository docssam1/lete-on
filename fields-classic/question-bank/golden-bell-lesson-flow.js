import { typeExampleGroups } from "./golden-bell-type-examples.js?v=20261028h";
import { typeExamplesMarkup } from "./golden-bell-type-examples-view.js?v=20261028h";

// 개념 단계 안의 학습 순서: ① 개념 설명 → ② 유형별 예제 → ③ 게임 → (골든벨 문제).
// 원장 지시: "개념마다 설명하는 튜토리얼, 문제 유형마다 예제 1~2개, 그다음 게임."
// 레슨별로 켠다 — 아래 표(LESSON_FLOWS)에 있는 레슨만 이 순서가 되고, 나머지 레슨은 예전 개념 화면 그대로다.
// 위의 단계 막대(개념 → 골든벨 → 추가 학습 → 완료)는 그대로 두고, 그 안의 「개념」 단계를 세 칸으로 나눈다.
//
// 표 한 줄: "<책 id>/<레슨 id>": { examples: <golden-bell-type-examples.js의 예제 묶음 id>, game: <게임 id> }
//   게임 id: turn-clock(1권 시계) · b2-*(2권 레벨 게임) · b9-*(9권 레벨 게임) · drill(연습 공방 — drill-recipes.js에 차시가 있어야 한다).
//   새 게임은 아래 mountGame에 한 줄 추가.
//
// 다른 레슨에 붙이는 순서(1~10권 공통):
//  1) 유형 확인: 그 레슨 original.items의 typeLabel 목록(없으면 예제 묶음에 typeOf(item)로 나눈다 — 1권 시계 참고).
//  2) 예제: golden-bell-type-examples.js에 묶음 하나(id, types: { typeLabel: () => [예제, 예제] }).
//     수는 새로 짓고 답·풀이 숫자는 코드로 계산한다(원본 답 금지). 그림 종류가 없으면 golden-bell-type-examples-view.js의
//     figureMarkup에 하나 추가(색표·아이 말 지키기).
//  3) 게임: 레벨 게임 틀(golden-bell-level-game.js)에 { levels, endless, build, check, coach, mission, hint, success, reveal, createBoard }.
//     문제 규칙은 *-game-models.js(브라우저 없이 검사), 3D 판은 golden-bell-3d-engine.js의 createStage3D로(각도만 주고 거리는 자동 맞춤,
//     움직이는 물체가 있으면 frame, 누를 물체는 pickables/onTap). WebGL이 없으면 null → 평면 그림 + flatNotice. HTML 조작은 늘 함께.
//     원본 그림과 같은 판은 avoid로 거른다(mountGame에서 레슨 visual로 채움).
//  4) 이 표에 한 줄, mountGame에 게임 id 한 줄.
//  5) 검사: golden-bell-3d-game-models-audit.mjs(답 다시 구하기·원본과 겹침·말·정답 보호)에 규칙 추가,
//     golden-bell-3d-game-browser-audit.mjs의 풀이 함수 추가(표에 있는 레슨은 자동으로 돈다). 그다음 protection·style·guided 검사.
export const LESSON_FLOWS = Object.freeze({
  "book-01/clock-turning": { examples: "b1-clock", game: "turn-clock" },
  "book-02/balance-order": { examples: "b2-balance", game: "b2-balance" },
  "book-09/cube-min-max-source": { examples: "b9-cube-min-max", game: "b9-cubes" },
  "book-09/magic-square-missing": { examples: "b9-magic", game: "b9-magic" },
  // 게임 칸이 연습 공방인 차시(학생 덱은 덱 안의 연습 공방을 그대로 쓰므로 이 게임을 또 붙이지 않는다)
  "book-02/multiples-2": { examples: "bundle-equations", game: "drill" },
  "book-02/multiples-3": { examples: "bundle-equations", game: "drill" },
  "book-02/multiples-4": { examples: "bundle-equations", game: "drill" },
  "book-02/multiples-5": { examples: "bundle-equations", game: "drill" },
  "book-03/six-multiple-equations": { examples: "bundle-equations", game: "drill" },
  "book-06/consecutive-source": { examples: "consecutive", game: "drill" },
  "book-06/even-odd-order-source": { examples: "consecutive", game: "drill" },
  "book-10/number-count-source": { examples: "consecutive", game: "drill" },
  "book-10/consecutive-even-source": { examples: "consecutive", game: "drill" },
  "book-10/consecutive-odd-source": { examples: "consecutive", game: "drill" },
  "book-08/sum-difference-source": { examples: "sum-multiple", game: "drill" },
  "book-08/sum-multiple-source": { examples: "sum-multiple", game: "drill" },
  "book-08/sum-multiple-applied-source": { examples: "sum-multiple", game: "drill" },
  "book-07/time-unit-source": { examples: "time", game: "drill" },
  "book-07/elapsed-time": { examples: "time", game: "drill" },
  "book-06/rectangle-missing-side": { examples: "perimeter", game: "drill" },
  "book-06/perimeter-source": { examples: "perimeter", game: "drill" },
  "book-07/closed-loop-planting": { examples: "planting", game: "drill" },
  "book-07/distance-line-source": { examples: "distance", game: "drill" },
  "book-06/inclusive-range-count": { examples: "digits", game: "drill" },
  "book-06/number-and-digit-count": { examples: "digits", game: "drill" },
  "book-06/digit-sign-source": { examples: "digits", game: "drill" },
  "book-08/reverse-operation-chain": { examples: "reverse", game: "drill" },
  "book-08/give-same-source": { examples: "reverse", game: "drill" },
  "book-10/napier-split-source": { examples: "split-box", game: "drill" },
  "book-01/book1-equalize-transfer": { examples: "equalize", game: "share-equally" },
  "book-02/give-take-sum-difference": { examples: "equalize", game: "drill" },
  "book-08/equalize-transfer": { examples: "equalize", game: "drill" },
  "book-05/calendar-arithmetic-source": { examples: "calendar", game: "drill" },
  "book-05/calendar-weekday-source": { examples: "calendar", game: "drill" },
  "book-07/calendar-within-month-source": { examples: "calendar", game: "drill" },
  "book-07/calendar-next-month-source": { examples: "calendar", game: "drill" },
  "book-07/calendar-weekday": { examples: "calendar", game: "drill" },
  "book-05/square-number-source": { examples: "figure-numbers", game: "drill" },
  "book-05/triangle-number-source": { examples: "figure-numbers", game: "drill" },
  "book-05/cube-tetrahedral-growth": { examples: "figure-numbers", game: "drill" },
  "book-06/joined-perimeter-source": { examples: "outline", game: "drill" },
  "book-06/cut-grid-perimeter-source": { examples: "outline", game: "drill" },
  "book-06/bent-perimeter-source": { examples: "outline", game: "drill" },
  "book-04/balance-equality-source": { examples: "b4-balance", game: "drill" },
  "book-04/balance-substitution": { examples: "b4-balance", game: "drill" },
  "book-04/compare-order-source": { examples: "relations", game: "drill" },
  "book-04/compare-difference-source": { examples: "relations", game: "drill" },
  "book-04/order-logic-source": { examples: "logic", game: "drill" },
  "book-04/row-logic-source": { examples: "logic", game: "drill" },
  "book-04/cardinal-placement": { examples: "logic", game: "drill" },
  "book-04/circle-logic-source": { examples: "logic", game: "drill" },
  "book-04/table-logic-source": { examples: "logic", game: "drill" },
  "book-03/basic-vertical-cryptarithm": { examples: "crypt", game: "drill" },
  "book-03/cryptarithm-repeated": { examples: "crypt", game: "drill" },
  "book-03/cryptarithm-mixed": { examples: "crypt", game: "drill" },
  "book-03/cryptarithm-linked": { examples: "crypt", game: "drill" },
  "book-08/pyramid-cryptarithm": { examples: "crypt", game: "drill" },
  "book-08/vertical-shape-cryptarithm": { examples: "crypt", game: "drill" },
  "book-08/crypt-source": { examples: "crypt", game: "drill" }
});
export const FLOW_GAME_TITLES = Object.freeze({ "turn-clock": "시계 바늘 돌리기", "b2-balance": "무게 줄 세우기", "b9-cubes": "쌓기나무 탑 쌓기", "b9-magic": "숫자 유리창", drill: "연습 공방", "share-equally": "같아지도록 옮기기" });
const STEPS = [["tutorial", "개념 설명"], ["examples", "유형별 예제"], ["game", "게임"]];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// 레슨마다 화면 상태(지금 칸·예제 위치·게임 진행)를 들고 있다가, 화면을 다시 그려도 이어 간다.
const views = new Map();
let mounted = null, generation = 0;
const keyOf = (bookId, lessonId) => `${bookId}/${lessonId}`;
export function lessonFlowFor(bookId, lesson) { return lesson ? LESSON_FLOWS[keyOf(bookId, lesson.id)] || null : null; }
function viewOf(bookId, lessonId) {
  const key = keyOf(bookId, lessonId);
  if (!views.has(key)) views.set(key, { step: "tutorial", type: 0, example: 0, exStep: 0, seen: new Set(), gameSaved: {} });
  return views.get(key);
}
export function flowStep(bookId, lesson) { return lessonFlowFor(bookId, lesson) ? viewOf(bookId, lesson.id).step : null; }
// 다른 레슨으로 갔다가 오면 개념 설명부터(게임 진행은 남는다).
export function resetLessonFlow(bookId, lessonId) { const v = views.get(keyOf(bookId, lessonId)); if (v) v.step = "tutorial"; }
// 학생 차시 덱(study.html)의 「게임하기」 장: 그 레슨의 게임 칸을 바로 연다.
export function setLessonFlowStep(bookId, lessonId, step) { if (STEPS.some(([id]) => id === step)) viewOf(bookId, lessonId).step = step; }

function navMarkup(view) {
  const steps = STEPS.map(([id, label], i) => `<button type="button" class="gb-flow-step${view.step === id ? " active" : ""}" data-flow-go="${id}" aria-current="${view.step === id ? "step" : "false"}"><b>${i + 1}</b><span>${label}</span></button>`).join('<i aria-hidden="true">›</i>');
  return `<nav class="gb-flow" aria-label="개념 학습 순서">${steps}<i aria-hidden="true">›</i><span class="gb-flow-step is-after"><b>★</b><span>골든벨 문제</span></span></nav>`;
}
const NEXT_PHASE = /<button type="button" class="primary-action" data-next-phase="original"([^>]*)>([^<]*)<\/button>\s*$/u;

// 개념 단계 화면. tutorialHtml = 예전 개념 화면(그대로 쓴다). 이 레슨이 표에 없으면 null.
export function renderFlowConcept({ bookId, lesson, tutorialHtml }) {
  const flow = lessonFlowFor(bookId, lesson);
  if (!flow) return null;
  const view = viewOf(bookId, lesson.id);
  const nav = navMarkup(view);
  const forward = (to, label) => `<button type="button" class="primary-action gb-flow-forward" data-flow-go="${to}">${label} ▶</button>`;
  const skip = '<button type="button" class="primary-action gb-flow-skip" data-next-phase="original">골든벨 문제로 바로 가기</button>';
  if (view.step === "tutorial") {
    const body = NEXT_PHASE.test(tutorialHtml)
      ? tutorialHtml.replace(NEXT_PHASE, (_, attrs, label) => `<div class="gb-flow-actions">${forward("examples", "유형별 예제 보기")}<button type="button" class="primary-action gb-flow-skip" data-next-phase="original"${attrs}>${label}</button></div>`)
      : `${tutorialHtml}<div class="gb-flow-actions">${forward("examples", "유형별 예제 보기")}</div>`;
    return `${nav}${body}`;
  }
  const head = `<p class="lesson-kicker">${esc(lesson.unit)} · 개념 학습</p><h2>${esc(lesson.title)}</h2>`;
  if (view.step === "examples") {
    const groups = typeExampleGroups(lesson, flow.examples);
    const total = groups.reduce((s, g) => s + g.count, 0);
    return `${head}${nav}<p class="gb-flow-lead">골든벨 문제 ${total}개는 ${groups.length}가지 유형이에요. 유형마다 예제를 한 단계씩 풀어 봐요. 예제의 수는 골든벨 문제와 달라요.</p><div class="gb-flow-examples" data-flow-examples>${typeExamplesMarkup(groups, exampleView(view, groups))}</div><div class="gb-flow-actions">${forward("game", "게임하러 가기")}${skip}</div>`;
  }
  return `${head}${nav}<p class="gb-flow-lead">${esc(FLOW_GAME_TITLES[flow.game] || "게임")} — 예제에서 본 방법으로 직접 해 봐요. 게임을 다 하면 골든벨 문제로 가요.</p><section class="gold-hands-on gb-flow-game" data-flow-game="${esc(flow.game)}"><div class="gb-flow-game-host" data-flow-game-host><p class="gb-flow-loading" role="status">게임을 불러오고 있어요.</p></div></section><div class="gb-flow-actions"><button type="button" class="primary-action" data-next-phase="original">골든벨 문제 풀기</button></div>`;
}
function exampleView(view, groups) {
  view.type = Math.min(view.type, Math.max(0, groups.length - 1));
  const count = groups[view.type]?.examples.length || 1;
  view.example = Math.min(view.example, count - 1);
  return { type: view.type, example: view.example, step: view.exStep, seen: view.seen };
}

async function mountGame(gameId, host, { saved, onQuestions, onComplete, lesson }) {
  if (gameId === "drill") {
    // 연습 공방은 창(iframe) 안에서 돈다. 마지막 「골든벨 문제로」를 누르면 골든벨 문제 칸으로 간다.
    if (!document.querySelector('link[data-drill-css]')) document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="./game-drill.css?v=20261027a" data-drill-css>');
    const { mountDrill } = await import("./game-drill.js?v=20261027b");
    return mountDrill(host, { lesson, onDone: () => onQuestions?.() });
  }
  if (gameId === "turn-clock") {
    const { mountClockGame } = await import("./golden-bell-clock-game.js?v=20261024t");
    return mountClockGame(host, { single: false, saved, onQuestions, onComplete });
  }
  const { mountLevelGame } = await import("./golden-bell-level-game.js?v=20261024t");
  if (gameId.startsWith("b2-")) {
    const { BOOK02_LEVEL_GAMES } = await import("./golden-bell-book02-games.js?v=20261024t");
    return mountLevelGame(host, BOOK02_LEVEL_GAMES[gameId], { single: false, saved, onQuestions, onComplete });
  }
  if (gameId.startsWith("b9-")) {
    const [{ BOOK09_LEVEL_GAMES }, models] = await Promise.all([import("./golden-bell-book09-games.js?v=20261024t"), import("./golden-bell-book09-game-models.js?v=20261024t")]);
    // 이 레슨의 원본 그림과 같은 판은 게임에 내지 않는다(그림은 공개 자료, 답은 게임이 스스로 구한다).
    for (const item of lesson.original?.items || []) {
      const v = item.visual;
      if (v?.subtype === "cube-three-views") models.CUBES.avoid.add(models.cubeSignature(v));
      if (v?.subtype === "magic-grid") models.MAGIC.avoid.add(models.magicSignature(v.size, v.shown));
    }
    return mountLevelGame(host, BOOK09_LEVEL_GAMES[gameId], { single: false, saved, onQuestions, onComplete });
  }
  const { HANDS_ON_ACTIVITIES } = await import("./golden-bell-hands-on-models.js?v=20261023t");
  if (Object.hasOwn(HANDS_ON_ACTIVITIES, gameId)) {
    // 골든벨 「직접 해보기」 체험을 게임 칸(.gold-hands-on 안)에 바로 띄운다. 마지막 「연결 문제 풀기」를 누르면 골든벨 문제 칸으로 간다.
    const { mountEmbedHandsOn } = await import("./golden-bell-hands-on.js?v=20261024t");
    host.innerHTML = '<div class="hand-content"></div>';
    mountEmbedHandsOn(host.querySelector(".hand-content"), { active: gameId, states: saved.handsOn ||= {} }, () => onQuestions?.());
    return { dispose() {} };
  }
  throw new Error("game_unknown");
}

export function teardownLessonFlow() {
  generation++;
  try { mounted?.dispose(); } catch { /* 이미 정리됨 */ }
  mounted = null;
}

// renderContent 뒤에 부른다: 단계 단추·예제 단추를 묶고, 게임 칸이면 게임을 띄운다.
export function mountLessonFlow(container, { bookId, lesson, rerender, onQuestions, onComplete = null }) {
  const flow = lessonFlowFor(bookId, lesson);
  if (!flow) return;
  const view = viewOf(bookId, lesson.id);
  const go = (step) => {
    if (!STEPS.some(([id]) => id === step) || step === view.step) return;
    view.step = step;
    rerender();
    const nav = container.querySelector(".gb-flow");
    if (nav && nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ block: "start" });
    container.querySelector(`.gb-flow-step[data-flow-go="${step}"]`)?.focus({ preventScroll: true });
  };
  container.querySelectorAll(".gb-flow [data-flow-go], .gb-flow-actions [data-flow-go]").forEach((button) => button.addEventListener("click", () => go(button.dataset.flowGo)));
  const examples = container.querySelector("[data-flow-examples]");
  if (examples) {
    const groups = typeExampleGroups(lesson, flow.examples);
    examples.addEventListener("click", (event) => {
      const t = event.target.closest("button");
      if (!t || t.disabled) return;
      const d = t.dataset;
      let focus = null;
      if (d.flowGo) { go(d.flowGo); return; }
      if (d.txType !== undefined) { view.type = Number(d.txType); view.example = 0; view.exStep = 0; focus = `[data-tx-type="${view.type}"]`; }
      else if (d.txExample !== undefined) { view.example = Number(d.txExample); view.exStep = 0; focus = ".tx-next"; }
      else if (d.txStep !== undefined) { view.exStep = Number(d.txStep); focus = t.classList.contains("tx-back") ? ".tx-back:not(:disabled), .tx-next" : ".tx-next"; }
      else return;
      const ex = groups[view.type]?.examples[view.example];
      if (ex && view.exStep >= ex.steps.length) view.seen.add(`${view.type}:${view.example}`);
      examples.innerHTML = typeExamplesMarkup(groups, exampleView(view, groups));
      examples.querySelector(focus)?.focus({ preventScroll: true });
    });
  }
  const host = container.querySelector("[data-flow-game-host]");
  if (host) {
    const token = ++generation;
    view.gameSaved[flow.game] ||= {};
    mountGame(flow.game, host, { saved: view.gameSaved[flow.game], onQuestions, onComplete, lesson }).then((handle) => {
      if (token !== generation || !host.isConnected) { handle?.dispose?.(); return; }
      mounted = handle;
    }).catch(() => {
      if (token === generation && host.isConnected) host.innerHTML = '<p class="gb-flow-loading" role="alert">게임을 불러오지 못했어요. 화면을 새로 고쳐 주세요.</p>';
    });
  }
}
