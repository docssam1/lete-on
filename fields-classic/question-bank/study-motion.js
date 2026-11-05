// 스스로 공부 덱의 움직임(원장 2026-11-04 「이 스킬 사용하여 조금 더 꾸미자」 — Anime.js · Motion · Bklit UI 소개 영상)
//  · 표지 들어오기·도착 장 메달과 숫자 = Anime.js(vendor/animejs-4.5.0, MIT) — 한 장에 한 번, 짜인 순서로
//  · 장 넘김·단추 누름 = Motion(vendor/motion-12.43.0, MIT, 전역 Motion) — 아이가 누른 데 답하는 움직임만
//  · 숫자·그래프는 Bklit UI가 React 전용이라 같은 생각(숫자가 올라가고 고리가 차오름)을 Anime.js와 SVG로 그린다
// 움직임 줄이기 설정이면 아무것도 움직이지 않고 끝 모습만 보인다. frontend-design 스킬: 움직임은 한 곳에 한 번.
import { animate, createTimeline, stagger, splitText, svg } from "./vendor/animejs-4.5.0/anime.esm.min.js";

const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const M = () => globalThis.Motion;

// 표지: 단원 이름이 글자째 올라오고, 공부 순서가 하나씩 놓인 뒤 「출발하기」가 살짝 튄다
export function playCover(root) {
  if (still() || !root) return;
  const title = root.querySelector("h1"), kick = root.querySelector(".sd-cover-kick"), lead = root.querySelector(".sd-cover-lead");
  const steps = root.querySelectorAll(".sd-plan li"), start = root.querySelector(".sd-start");
  const { chars } = splitText(title, { chars: true });
  const tl = createTimeline({ defaults: { ease: "out(3)" } });
  tl.add([kick, lead].filter(Boolean), { opacity: [0, 1], y: [8, 0], duration: 420 }, 0)
    .add(chars, { opacity: [0, 1], y: ["60%", "0%"], duration: 520, delay: stagger(28) }, 80)
    .add(steps, { opacity: [0, 1], y: [14, 0], duration: 420, delay: stagger(70) }, 260);
  if (start) tl.add(start, { scale: [0.9, 1], opacity: [0, 1], duration: 520, ease: "outElastic(1, .6)" }, "-=200");
}

// 스스로 공부 첫 화면(start.html, 원장 2026-11-04 「스스로 공부 첫 화면에도 넣어줘」): 제목이 글자째 올라오고 교재 목록이 하나씩 들어온다
export function playIntro(title, items) {
  if (still() || !title) return;
  const { chars } = splitText(title, { chars: true });
  const tl = createTimeline({ defaults: { ease: "out(3)" } });
  tl.add(chars, { opacity: [0, 1], y: ["60%", "0%"], duration: 520, delay: stagger(30) }, 0);
  if (items?.length) tl.add(items, { opacity: [0, 1], x: [-18, 0], duration: 420, delay: stagger(55) }, 220);
}

// 도착: 메달의 체크가 그려지고, 오늘 한 공부의 수가 0부터 올라가고, 점수 고리가 차오른다
export function playEnd(root) {
  if (!root) return;
  const nums = [...root.querySelectorAll("[data-count]")];
  const ring = root.querySelector(".sd-ring-bar");
  if (still()) return;
  const medal = root.querySelector(".sd-medal");
  const tl = createTimeline({ defaults: { ease: "out(3)" } });
  if (medal) {
    tl.add(medal, { scale: [0.4, 1], opacity: [0, 1], duration: 600, ease: "outElastic(1, .55)" }, 0);
    const check = medal.querySelector("path");
    if (check) tl.add(svg.createDrawable(check), { draw: ["0 0", "0 1"], duration: 520 }, 220);
  }
  nums.forEach((el, k) => {
    const to = Number(el.dataset.count), box = { n: 0 };
    el.textContent = "0";
    tl.add(box, { n: to, duration: 700, modifier: Math.round, onUpdate: () => { el.textContent = String(box.n); } }, 380 + k * 90);
  });
  if (ring) tl.add(svg.createDrawable(ring), { draw: ["0 0", `0 ${ring.dataset.frac}`], duration: 900 }, 420);
}

// 장 넘김: 앞으로 가면 오른쪽에서, 뒤로 가면 왼쪽에서 들어온다(누른 데 답하는 움직임)
export function enterSlide(el, dir) {
  const motion = M();
  if (still() || !motion || !el || !dir) return;
  motion.animate(el, { opacity: [0, 1], x: [dir * 28, 0] }, { duration: 0.32, ease: [0.2, 0.7, 0.2, 1] });
}

// 단추를 누르면 쏙 들어갔다가 튀어나온다(덱 기본 · 다른 화면은 고를 것을 넘긴다)
let pressBound = false;
export function bindPress(selector = ".sd-btn, .sd-step, .sd-skip, .sd-number, .sd-plan li") {
  const motion = M();
  if (pressBound || still() || !motion) return;
  pressBound = true;
  motion.press(selector, (el) => {
    motion.animate(el, { scale: 0.94 }, { type: "spring", stiffness: 700, damping: 30 });
    return () => motion.animate(el, { scale: 1 }, { type: "spring", stiffness: 500, damping: 14 });
  });
}

// 점수 고리(Bklit의 원형 게이지와 같은 생각): 맞힌 수 / 전체
export function ringMarkup(right, total) {
  const r = 34, frac = total ? right / total : 0;
  return `<svg class="sd-ring" viewBox="0 0 84 84" role="img" aria-label="${total}문제 중 ${right}문제 맞힘">
    <circle class="sd-ring-track" cx="42" cy="42" r="${r}" />
    <circle class="sd-ring-bar" cx="42" cy="42" r="${r}" data-frac="${frac.toFixed(3)}" pathLength="1" stroke-dasharray="${frac} 1" transform="rotate(-90 42 42)" />
    <text x="42" y="40" text-anchor="middle"><tspan data-count="${right}">${right}</tspan></text><text class="sd-ring-total" x="42" y="57" text-anchor="middle">/ ${total}</text>
  </svg>`;
}
