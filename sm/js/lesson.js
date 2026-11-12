// 차시 진행 — 시작 화면 → 단계(이야기·해 보기·게임) → 별 받기.
//  5세용 규칙(설계서 1·6절): 지시는 독쌤이 소리로, 누를 것은 크게, 틀리면 결과 장면 + 부드러운 격려, 두 번 틀리면 같이 해 준다.
import { gate } from "./access.js?v=20261112b";
import { renderLogin, renderNoPermission } from "./login-view.js?v=20261112b";
import { BOOK, findSession } from "./book.js?v=20261112b";
import { saveLesson } from "./progress.js?v=20261112b";
import { createGuide } from "./guide.js?v=20261112b";
import * as fx from "./fx.js?v=20261112b";

const app = document.getElementById("app");
const params = new URLSearchParams(location.search);
const lessonId = params.get("l") || "u2-s1";
const startAt = Math.max(0, (Number(params.get("s")) || 1) - 1);   // &s=번호: 그 단계부터(선생님이 한 단계만 보여 줄 때)
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, fx.reduced() ? Math.min(ms, 120) : ms));

async function start() {
  const result = await gate();
  if (!result.ok) {
    app.className = "";
    if (result.why === "permission") renderNoPermission(app, result.me, { onDone: start });
    else renderLogin(app, { onDone: start });
    return;
  }
  const found = findSession(lessonId);
  if (!found?.session.ready) { location.replace("./index.html"); return; }
  const mod = await import(`./lessons/${lessonId}.js?v=20261112b`);
  run(result.me, found, mod.LESSON);
}

function run(me, { unit, session }, lesson) {
  app.className = "sm-lesson";
  app.innerHTML = `
    <header class="sm-top">
      <a class="sm-btn round" href="./index.html" aria-label="처음 화면으로" style="text-decoration:none"><span class="ico">🏠</span></a>
      <div class="sm-title">${unit.n}. ${esc(unit.title)} · ${esc(session.label)}</div>
      <div class="sm-steps" aria-hidden="true">${lesson.steps.map(() => "<b></b>").join("")}</div>
      <div class="sm-stars" aria-label="모은 별"><i>⭐</i><i>⭐</i><i>⭐</i></div>
      <button class="sm-btn round sm-voice" type="button" aria-label="소리 끄기">🔊</button>
    </header>
    <section class="sm-main"></section>`;
  const main = app.querySelector(".sm-main");
  const voiceBtn = app.querySelector(".sm-voice");
  const dots = [...app.querySelectorAll(".sm-steps b")];
  const starEls = [...app.querySelectorAll(".sm-stars i")];
  let mistakes = 0;

  // 시작 화면 — 첫 누름이 있어야 기기가 소리를 낼 수 있다
  main.innerHTML = `
    <div class="sm-cover">
      <div>
        <span class="badge">${unit.n}단원 · ${esc(session.label)} · ${esc(session.pages)}</span>
        <div class="art" aria-hidden="true">${lesson.coverArt}</div>
        <h1>${esc(lesson.title)}</h1>
        <p>${esc(lesson.subtitle)}</p>
        <button class="sm-btn go big pulse" type="button" data-start><span class="ico">▶</span> 시작!</button>
      </div>
    </div>`;
  main.querySelector("[data-start]").addEventListener("click", async () => {
    fx.sound.pop();
    main.innerHTML = `
      <div class="sm-ask"><button class="sm-guide-host" type="button"></button><p class="say"></p><span class="page"></span></div>
      <div class="sm-stage"></div>
      <div class="sm-dock"></div>`;
    const guide = createGuide({ host: main.querySelector(".sm-guide-host"), textEl: main.querySelector(".say"), voiceBtn });
    const ctx = makeContext(main, guide, () => mistakes++);
    for (let i = Math.min(startAt, lesson.steps.length - 1); i < lesson.steps.length; i++) {
      dots.forEach((d, k) => { d.className = k < i ? "done" : k === i ? "now" : ""; });
      const step = lesson.steps[i];
      ctx.reset(step.page);
      await step.run(ctx);
      ctx.dispose();
      fx.sound.pop();
    }
    dots.forEach((d) => { d.className = "done"; });
    const stars = mistakes <= 2 ? 3 : mistakes <= 6 ? 2 : 1;
    saveLesson(me.name, BOOK.id, lessonId, { done: true, stars });
    finish(main, guide, stars, lesson);
  });

  function finish(root, guide, stars, lessonDef) {
    root.querySelector(".sm-stage")?.remove(); root.querySelector(".sm-dock")?.remove();
    const cover = document.createElement("div");
    cover.className = "sm-cover";
    cover.innerHTML = `<div>
        <div class="got">${[1, 2, 3].map((k, i) => `<span style="animation-delay:${0.25 + i * 0.35}s;${k > stars ? "filter:grayscale(1) opacity(.3)" : ""}">⭐</span>`).join("")}</div>
        <h1>${esc(lessonDef.doneTitle || "오늘 공부 끝!")}</h1>
        <p>${esc(lessonDef.doneText || "")}</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <a class="sm-btn go big" href="./index.html" style="text-decoration:none"><span class="ico">🏠</span> 처음 화면</a>
          <button class="sm-btn big" type="button" data-again><span class="ico">↺</span> 다시 하기</button>
        </div></div>`;
    root.append(cover);
    cover.querySelector("[data-again]").addEventListener("click", () => location.reload());
    starEls.forEach((el, i) => setTimeout(() => el.classList.toggle("on", i < stars), 300 + i * 350));
    fx.sound.fanfare(); fx.rain(2.6);
    setTimeout(() => fx.burst(innerWidth / 2, innerHeight * 0.3, { power: 2.2 }), 400);
    guide.praise(`${me.name}, 정말 잘했어요! 별을 ${stars}개 모았어요!`);
  }
}

// ── 단계에 주는 도구 ─────────────────────────────────────
function makeContext(main, guide, addMistake) {
  const stageEl = main.querySelector(".sm-stage"), dock = main.querySelector(".sm-dock"), pageEl = main.querySelector(".page");
  let cleanups = [];
  const ctx = {
    guide, fx, wait,
    get stage() { return stageEl; },
    get dock() { return dock; },
    reset(page) { stageEl.innerHTML = ""; stageEl.style.display = ""; dock.innerHTML = ""; pageEl.textContent = page || ""; pageEl.hidden = !page; },
    onDispose(fn) { cleanups.push(fn); },
    dispose() { cleanups.splice(0).reverse().forEach((f) => { try { f(); } catch { /* 계속 */ } }); },
    mistake() { addMistake(); },
    // 큰 「다음」 단추 하나 → 누르면 끝
    next(label = "다음", { icon = "▶", cls = "go" } = {}) {
      dock.innerHTML = "";
      const b = document.createElement("button");
      b.type = "button"; b.className = `sm-btn ${cls} big pulse`; b.innerHTML = `<span class="ico">${icon}</span> ${esc(label)}`;
      dock.append(b);
      return new Promise((resolve) => b.addEventListener("click", () => { fx.sound.tap(); b.disabled = true; resolve(); }, { once: true }));
    },
    // 그림 고르기. choices: [{value, art, name}]. correct가 있으면 맞힐 때까지(틀리면 흔들고 격려, 두 번째부터 hint()).
    choose(choices, { correct = null, wrongSay = "다시 한번 볼까요?", hint = null, praise = null, host = dock } = {}) {
      host.innerHTML = "";
      const buttons = choices.map((c) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "sm-pick"; b.dataset.value = c.value;
        b.innerHTML = `<span class="art" aria-hidden="true">${c.art || ""}</span><span class="name">${esc(c.name)}</span>`;
        b.setAttribute("aria-label", c.name);
        host.append(b);
        return b;
      });
      return new Promise((resolve) => {
        let wrong = 0;
        const onClick = async (event) => {
          const b = event.target.closest(".sm-pick"); if (!b || b.disabled) return;
          const value = b.dataset.value;
          if (correct === null || value === String(correct)) {
            buttons.forEach((x) => { x.disabled = true; });
            b.classList.add("is-right");
            if (correct !== null) { fx.cheer(b); if (praise) await guide.praise(praise); }
            else fx.sound.pop();
            host.removeEventListener("click", onClick);
            resolve(value);
          } else {
            wrong++; addMistake();
            fx.sound.bad(); b.classList.remove("is-wrong"); void b.offsetWidth; b.classList.add("is-wrong");
            if (wrong >= 2 && hint) hint(wrong); else guide.encourage(wrongSay);
          }
        };
        host.addEventListener("click", onClick);
      });
    },
    // 숫자 고르기: 빈칸 + 1~max 단추. 맞힐 때까지.
    number(correct, { max = 10, before = "", after = "", hint = null, host = dock } = {}) {
      host.innerHTML = `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:18px">
          <div style="display:flex;align-items:center;gap:12px;font-size:28px;font-weight:800">${before}<span class="sm-answer" aria-live="polite">?</span>${esc(after)}</div>
          <div class="sm-pad">${Array.from({ length: max }, (_, i) => `<button class="sm-btn" type="button" data-n="${i + 1}">${i + 1}</button>`).join("")}</div></div>`;
      const box = host.querySelector(".sm-answer");
      return new Promise((resolve) => {
        let wrong = 0;
        const onClick = async (event) => {
          const b = event.target.closest("[data-n]"); if (!b) return;
          const n = Number(b.dataset.n);
          box.textContent = n; box.classList.remove("filled"); void box.offsetWidth; box.classList.add("filled");
          fx.sound.tap();
          if (n === correct) {
            host.querySelectorAll("[data-n]").forEach((x) => { x.disabled = true; });
            fx.cheer(box);
            host.removeEventListener("click", onClick);
            resolve(n);
          } else {
            wrong++; addMistake(); fx.sound.bad(); fx.shake(box);
            if (hint) await hint(wrong); else guide.encourage("다시 세어 볼까요?");
          }
        };
        host.addEventListener("click", onClick);
      });
    }
  };
  return ctx;
}

start();
