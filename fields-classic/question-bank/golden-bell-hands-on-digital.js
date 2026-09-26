import { BOOK01_INTERNALS } from "./book01-generators.js";

// These are new practice examples for the two transformations on source slide 4.
export const DIGITAL_ROUNDS = Object.freeze([
  { source: [2], operation: "mirror-left-right" },
  { source: [6], operation: "rotate-half" },
  { source: [5], operation: "mirror-left-right" },
  { source: [9], operation: "rotate-half" },
  { source: [2, 9], operation: "rotate-half" },
  { source: [2, 2], operation: "mirror-left-right" }
].map((round) => Object.freeze({ ...round, result: BOOK01_INTERNALS.transformDisplay(round.source, round.operation) })));

const SEGMENTS = {
  0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg",
  5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg"
};

const PATHS = {
  a: "M17 9H57", b: "M65 17V57", c: "M65 70V110", d: "M17 118H57",
  e: "M9 70V110", f: "M9 17V57", g: "M17 63H57"
};

function digitSvg(digit, decorative = false) {
  return `<svg viewBox="0 0 74 127" ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="디지털 숫자 ${digit}"`}><g class="hand-digital-off">${Object.values(PATHS).map((path) => `<path d="${path}"/>`).join("")}</g><g class="hand-digital-on">${[...SEGMENTS[digit]].map((part) => `<path d="${PATHS[part]}"/>`).join("")}</g></svg>`;
}

export function digitalScene(round, state) {
  const source = round.source.join("");
  const turn = round.operation === "rotate-half";
  const transformed = state.digitalShown ? `<div class="hand-digital-digits ${turn ? "half-turn" : "right-flip"}" role="img" aria-label="변환된 디지털 숫자 모양">${round.source.map((digit) => digitSvg(digit, true)).join("")}</div>` : `<span class="hand-digital-hidden">?</span>`;
  const count = round.result.length;
  const keys = Array.from({ length: 10 }, (_, n) => `<button type="button" data-hand-action="digit" data-value="${n}" aria-label="${n} 입력" ${!state.digitalShown || state.solved || state.digitalAnswer.length >= count ? "disabled" : ""}>${n}</button>`).join("");
  return `<div class="hand-digital"><div class="hand-digital-row"><figure><div class="hand-digital-digits">${round.source.map(digitSvg).join("")}</div><figcaption>처음 ${source}</figcaption></figure><span class="hand-digital-arrow" aria-hidden="true">→</span><figure><div class="hand-digital-result" aria-live="polite">${transformed}</div><figcaption>${turn ? "반 바퀴 돌린 뒤" : "오른쪽으로 뒤집은 뒤"}</figcaption></figure></div><div class="hand-controls"><button type="button" data-hand-action="digital-transform" ${state.digitalShown || state.solved ? "disabled" : ""}>${turn ? "반 바퀴 돌리기" : "오른쪽으로 뒤집기"}</button></div><div class="hand-digital-answer"><span>읽은 수</span><output aria-live="polite">${state.digitalAnswer || "?"}</output><button type="button" data-hand-action="digit-erase" aria-label="마지막 숫자 지우기" ${!state.digitalAnswer || state.solved ? "disabled" : ""}>⌫</button></div><div class="hand-digital-keypad" role="group" aria-label="숫자 입력">${keys}</div></div>`;
}

export function digitalCheck(round, state) {
  return state.digitalShown && state.digitalAnswer === round.result.join("");
}

export function digitalFeedback(round, state) {
  if (!state.solved) return "켜진 막대의 자리와 숫자 순서까지 다시 살펴보세요.";
  return `${round.source.join("")}을 ${round.operation === "rotate-half" ? "반 바퀴 돌리면" : "오른쪽으로 뒤집으면"} ${round.result.join("")}이 됩니다.`;
}
