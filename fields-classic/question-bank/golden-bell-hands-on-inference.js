// New practice actions based on place-value grouping and three-digit filtering.
// The teacher examples and their answer strings are not reproduced here.
export const INFERENCE_ROUNDS = Object.freeze([
  Object.freeze({ id: "regroup", kind: "regroup", title: "열 묶음을 바꾸기", prompt: "십 묶음 10개를 백 묶음 1개로 바꾸어 표준 묶음을 만드세요.", bundles: Object.freeze([3, 11, 6]) }),
  Object.freeze({ id: "three-digit", kind: "classify", title: "세 자리 수 찾기", prompt: "모든 카드를 세 자리 수인지 아닌지 나누세요.", numbers: Object.freeze([49, 702, 8, 1001, 314, 86, 999, 5302]), rule: "three-digit" }),
  Object.freeze({ id: "step-down", kind: "sequence", title: "규칙대로 이어 놓기", prompt: "874에서 3씩 작아지는 수를 차례로 네 칸에 놓으세요.", start: 874, step: 3, cards: Object.freeze([868, 871, 862, 865, 859, 874]), length: 4 }),
  Object.freeze({ id: "two-clues", kind: "classify", title: "두 조건으로 걸러내기", prompt: "각 자리 숫자가 1씩 작아지고, 세 자리 숫자의 합이 18인 수만 남기세요. 모든 후보를 판정하세요.", numbers: Object.freeze([765, 876, 654, 543, 764, 675, 756, 853]), rule: "descending-sum" }),
  Object.freeze({ id: "build", kind: "build", title: "조건에 맞게 만들기", prompt: "백의 자리와 일의 자리가 같고, 십의 자리는 백의 자리보다 3 작으며, 각 자리 숫자의 합이 12인 세 자리 홀수를 만드세요.", cards: Object.freeze([5, 5, 2, 3, 6, 7]), length: 3 })
]);

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const isPlacement = (round) => round.kind === "sequence" || round.kind === "build";
const validIndex = (value, length) => Number.isInteger(value) && value >= 0 && value < length;

export function newInferenceState(round) {
  const state = { checked: false, solved: false };
  if (round.kind === "regroup") state.bundles = [...round.bundles];
  if (round.kind === "classify") state.marks = round.numbers.map(() => null);
  if (isPlacement(round)) {
    state.slots = Array(round.length).fill(null);
    state.selectedCard = null;
  }
  return state;
}

export function inferenceCandidatePasses(round, number) {
  if (!Number.isInteger(number) || number < 100 || number > 999) return false;
  if (round.rule === "three-digit") return true;
  if (round.rule !== "descending-sum") return false;
  const h = Math.floor(number / 100);
  const t = Math.floor(number / 10) % 10;
  const o = number % 10;
  return h - t === 1 && t - o === 1 && h + t + o === 18;
}

export function inferenceCheck(round, state) {
  if (round.kind === "regroup") {
    const [h, t, o] = state?.bundles || [];
    return Number.isInteger(h) && Number.isInteger(t) && Number.isInteger(o) &&
      h * 100 + t * 10 + o === round.bundles[0] * 100 + round.bundles[1] * 10 + round.bundles[2] &&
      h >= 0 && t >= 0 && t < 10 && o >= 0 && o < 10;
  }
  if (round.kind === "classify") {
    return Array.isArray(state?.marks) && state.marks.length === round.numbers.length &&
      state.marks.every((mark, i) => typeof mark === "boolean" && mark === inferenceCandidatePasses(round, round.numbers[i]));
  }
  if (!isPlacement(round) || !Array.isArray(state?.slots) || state.slots.length !== round.length ||
      state.slots.some((index) => !validIndex(index, round.cards.length)) || new Set(state.slots).size !== round.length) return false;
  const values = state.slots.map((index) => round.cards[index]);
  if (round.kind === "sequence") return values.every((number, i) => number === round.start - round.step * (i + 1));
  const [h, t, o] = values;
  return h >= 1 && h === o && o % 2 === 1 && t === h - 3 && h + t + o === 12;
}

export function inferenceReady(round, state) {
  if (round.kind === "regroup") return true;
  if (round.kind === "classify") return Array.isArray(state?.marks) && state.marks.length === round.numbers.length && state.marks.every((mark) => typeof mark === "boolean");
  return isPlacement(round) && Array.isArray(state?.slots) && state.slots.length === round.length && state.slots.every((index) => validIndex(index, round.cards.length));
}

// Returns a new state; callers can rerender after every button action.
export function inferenceAction(round, state, action, value) {
  if (action === "reset") return newInferenceState(round);
  if (!state || state.solved) return state;
  if (action === "check") return inferenceReady(round, state) ? { ...state, checked: true, solved: inferenceCheck(round, state) } : state;
  if (round.kind === "regroup" && action === "exchange" && Array.isArray(state.bundles) && state.bundles[1] >= 10) {
    const [h, t, o] = state.bundles;
    return { ...state, bundles: [h + 1, t - 10, o], checked: false };
  }
  if (round.kind === "classify" && action === "mark" && typeof value === "string") {
    const match = /^(\d+):(keep|reject)$/.exec(value);
    if (!match) return state;
    const index = Number(match[1]);
    if (!validIndex(index, round.numbers.length)) return state;
    const marks = [...state.marks];
    marks[index] = match[2] === "keep";
    return { ...state, marks, checked: false };
  }
  if (isPlacement(round)) {
    const index = Number(value);
    if (action === "choose" && validIndex(index, round.cards.length)) return { ...state, selectedCard: index };
    if (action === "place" && validIndex(index, round.length)) {
      const slots = [...state.slots];
      if (state.selectedCard === null) slots[index] = null;
      else {
        if (!validIndex(state.selectedCard, round.cards.length)) return state;
        const previous = slots.indexOf(state.selectedCard);
        if (previous !== -1) slots[previous] = null;
        slots[index] = state.selectedCard;
      }
      return { ...state, slots, selectedCard: null, checked: false };
    }
  }
  return state;
}

export function inferenceFeedback(round, state) {
  if (!state?.checked) return "";
  if (!state.solved) {
    if (round.kind === "regroup") return "십 묶음이 10개 미만인지 살펴보세요.";
    if (round.kind === "sequence") return "앞 수에서 3을 빼며 네 칸을 다시 확인하세요.";
    if (round.kind === "build") return "같은 자리 숫자와 자릿수의 합을 차례로 확인하세요.";
    return round.rule === "three-digit" ? "각 카드가 100 이상, 1000 미만인지 다시 확인하세요." : "각 카드를 두 조건에 비추어 다시 판정해 보세요.";
  }
  if (round.kind === "regroup") return "십 묶음 10개는 백 묶음 1개입니다. 이제 각 자리가 표준 묶음이에요.";
  if (round.kind === "sequence") return "매번 3씩 빼면 네 수의 순서가 정해집니다.";
  if (round.kind === "build") return "백과 일의 자리부터 맞추고 십의 자리와 숫자의 합을 확인했어요.";
  return "모든 후보를 조건에 맞게 분류했어요.";
}

const styles = `<style>
.hand-inference,.hand-inference *{box-sizing:border-box}.hand-inference{width:100%;max-width:100%;min-width:0;color:#172b34;font:inherit}.hand-inference h3{font-size:1.1rem;margin:0 0 .35rem}.hand-inference p{margin:.3rem 0 .8rem}.hand-inference button{min-height:44px;min-width:0;border:1px solid #78949d;border-radius:6px;background:#fff;color:#172b34;font:inherit;cursor:pointer}.hand-inference button[aria-pressed="true"]{border-color:#087b68;background:#e1f5ee;font-weight:700}.hand-inference button:disabled{opacity:.62;cursor:default}.hand-inference button:focus-visible{outline:3px solid #e39828;outline-offset:2px}.hand-inference-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,7rem),1fr));gap:.5rem;min-width:0}.hand-inference-item{min-width:0;border:1px solid #b7cbd0;border-radius:6px;padding:.45rem}.hand-inference-item strong{display:block;text-align:center;font-size:1.15rem}.hand-inference-actions{display:flex;gap:.35rem;margin-top:.35rem}.hand-inference-actions button{flex:1}.hand-inference-bundles,.hand-inference-slots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;min-width:0}.hand-inference-bundle{text-align:center;border:1px solid #b7cbd0;border-radius:6px;padding:.7rem .25rem}.hand-inference-bundle strong{display:block;font-size:1.45rem}.hand-inference-slots.sequence{grid-template-columns:repeat(4,minmax(0,1fr))}.hand-inference-slots>div{min-width:0;text-align:center}.hand-inference-slots small{display:block;margin-bottom:.25rem}.hand-inference-slots button{width:100%;padding:.2rem;font-variant-numeric:tabular-nums}.hand-inference-bank{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,4.5rem),1fr));gap:.4rem;margin-top:.75rem}.hand-inference-bank button{font-variant-numeric:tabular-nums}.hand-inference-toolbar{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}.hand-inference-toolbar button{padding:.35rem .8rem}.hand-inference-toolbar .primary{background:#087b68;border-color:#087b68;color:#fff}.hand-inference-feedback{min-height:1.5em;margin-top:.75rem!important}.hand-inference-status{font-size:.85rem;color:#435b65}
@media(max-width:390px){.hand-inference{font-size:.94rem}.hand-inference-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hand-inference-item{padding:.35rem}.hand-inference-slots.sequence button{font-size:.85rem}}
</style>`;

function classifyScene(round, state) {
  return `<div class="hand-inference-grid" role="group" aria-label="수 카드 판정">${round.numbers.map((number, index) => {
    const mark = state.marks[index];
    return `<div class="hand-inference-item"><strong>${number}</strong><div class="hand-inference-actions"><button type="button" data-hand-action="mark" data-value="${index}:keep" aria-label="${number} 남기기" aria-pressed="${mark === true}" ${state.solved ? "disabled" : ""}>남기기</button><button type="button" data-hand-action="mark" data-value="${index}:reject" aria-label="${number} 제외하기" aria-pressed="${mark === false}" ${state.solved ? "disabled" : ""}>제외</button></div></div>`;
  }).join("")}</div>`;
}

function placementScene(round, state) {
  const slots = state.slots.map((cardIndex, index) => `<div><small>${round.kind === "build" ? ["백", "십", "일"][index] : `${index + 1}번째`}</small><button type="button" data-hand-action="place" data-value="${index}" aria-label="${index + 1}번째 자리 ${cardIndex === null ? "비어 있음" : round.cards[cardIndex]}${state.selectedCard === null ? ", 눌러 비우기" : ", 선택한 카드 놓기"}" ${state.solved ? "disabled" : ""}>${cardIndex === null ? "?" : round.cards[cardIndex]}</button></div>`).join("");
  const cards = round.cards.map((number, index) => `<button type="button" data-hand-action="choose" data-value="${index}" aria-label="${number} 카드${state.slots.includes(index) ? ", 놓임" : ""}" aria-pressed="${state.selectedCard === index}" ${state.solved ? "disabled" : ""}>${number}</button>`).join("");
  return `${round.kind === "sequence" ? `<p class="hand-inference-status">시작 수 ${round.start}</p>` : ""}<div class="hand-inference-slots ${round.kind === "sequence" ? "sequence" : ""}" role="group" aria-label="${round.kind === "sequence" ? "규칙 수열" : "백 십 일 자리"}">${slots}</div><div class="hand-inference-bank" role="group" aria-label="놓을 숫자 카드">${cards}</div>`;
}

export function inferenceScene(round, state) {
  const scene = round.kind === "regroup"
    ? `<div class="hand-inference-bundles" role="group" aria-label="자리별 묶음">${["백", "십", "일"].map((label, i) => `<div class="hand-inference-bundle"><span>${label} 묶음</span><strong>${state.bundles[i]}</strong></div>`).join("")}</div><div class="hand-inference-toolbar"><button type="button" data-hand-action="exchange" ${state.solved || state.bundles[1] < 10 ? "disabled" : ""}>십 묶음 10개를 백 묶음 1개로</button></div>`
    : round.kind === "classify" ? classifyScene(round, state) : placementScene(round, state);
  return `${styles}<section class="hand-inference" data-inference-round="${esc(round.id)}">${scene}</section>`;
}
