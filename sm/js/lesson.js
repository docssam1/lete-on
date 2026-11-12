// 차시 진행 — 시작 화면 → 단계(이야기·해 보기·게임) → 별 받기.
//  5세용 규칙(설계서 1·6절): 지시는 독쌤이 소리로, 누를 것은 크게, 틀리면 결과 장면 + 부드러운 격려, 두 번 틀리면 같이 해 준다.
import { gate } from "./access.js?v=20261113v";
import { renderLogin, renderNoPermission } from "./login-view.js?v=20261113v";
import { BOOK, findSession } from "./book.js?v=20261113v";
import { saveLesson } from "./progress.js?v=20261113v";
import { createGuide } from "./guide.js?v=20261113v";
import * as fx from "./fx.js?v=20261113v";

const app = document.getElementById("app");
const params = new URLSearchParams(location.search);
const lessonId = params.get("l") || "u2-s1";
const startAt = Math.max(0, (Number(params.get("s")) || 1) - 1);   // &s=번호: 그 단계부터(선생님이 한 단계만 보여 줄 때)
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, fx.reduced() ? Math.min(ms, 120) : ms));

// 교재 지문(원본 글 그대로). 공개 저장소에 두지 않는 파일(sm/data/*.local.json)에서 읽는다.
// 없으면(배포본) null — 나중에 로그인 세션을 확인하는 서버 함수에서 받도록 바꾼다.
async function loadText(bookId) {
  try {
    const r = await fetch(new URL(`../data/${bookId}.local.json`, import.meta.url), { cache: "no-store" });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

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
  const [mod, text] = await Promise.all([import(`./lessons/${lessonId}.js?v=20261113v`), loadText(BOOK.id)]);
  run(result.me, found, mod.LESSON, text);
}

function run(me, { unit, session }, lesson, text) {
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
      <div class="sm-ask"><button class="sm-guide-host" type="button"></button>
        <div class="txt"><p class="src" hidden></p><p class="say"></p></div>
        <div class="meta"><span class="page"></span><button class="sm-actbtn" type="button" hidden>활동 방법</button></div></div>
      <div class="sm-stage"></div>
      <div class="sm-dock"></div>`;
    const guide = createGuide({ host: main.querySelector(".sm-guide-host"), textEl: main.querySelector(".say"), voiceBtn });
    const ctx = makeContext(main, guide, () => mistakes++, text);
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
function makeContext(main, guide, addMistake, text) {
  const stageEl = main.querySelector(".sm-stage"), dock = main.querySelector(".sm-dock"), pageEl = main.querySelector(".page");
  // 작은 화면(가로로 든 폰 등)에서 고정 크기로 그린 장면이 무대보다 크면 무대에 맞게 줄인다(원장 2026-11-13 「잘렸어」).
  //  무대를 꽉 채우는 장면(3D 캔버스·미로·저울 그림 = position:absolute)은 스스로 맞추므로 건드리지 않는다.
  const fitStage = () => {
    const W = stageEl.clientWidth, H = stageEl.clientHeight;
    if (!W || !H) return;
    for (const el of stageEl.children) {
      if (el.tagName === "CANVAS" || el instanceof SVGElement || el.classList.contains("mz-tools")) continue;
      el.style.transform = "";
      const cs = getComputedStyle(el);
      if (cs.display === "none") continue;
      let k = 1;
      if (cs.position === "absolute" || cs.position === "fixed") {
        // 무대를 채우는 상자: 안의 것(3단계까지)이 상자 밖으로 넘치면 가운데를 기준으로 줄인다
        const box = el.getBoundingClientRect(); if (!box.width || !box.height) continue;
        let t = Infinity, l = Infinity, btm = -Infinity, r = -Infinity;
        for (const c of el.querySelectorAll(":scope > *, :scope > * > *, :scope > * > * > *")) {
          if (c.closest("svg") !== c && c.closest("svg")) continue;      // 그림 속 도형은 빼고 그림 하나로
          const q = c.getBoundingClientRect(); if (!q.width || !q.height) continue;
          t = Math.min(t, q.top); l = Math.min(l, q.left); btm = Math.max(btm, q.bottom); r = Math.max(r, q.right);
        }
        if (t === Infinity) continue;
        const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
        k = Math.min(1, box.width / (2 * Math.max(cx - l, r - cx)), (box.height - 6) / (2 * Math.max(cy - t, btm - cy)));
        el.style.transformOrigin = "center center";
      } else {
        const w = Math.max(el.scrollWidth, el.offsetWidth), h = Math.max(el.scrollHeight, el.offsetHeight);
        k = Math.min(1, W / w, (H - 6) / h);
        el.style.transformOrigin = "top center";
      }
      if (k < 0.995) el.style.transform = `scale(${k.toFixed(3)})`;
    }
  };
  let fitTimer = 0;
  const queueFit = () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitStage, 30); };
  new MutationObserver(queueFit).observe(stageEl, { childList: true, subtree: true });
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(queueFit).observe(stageEl);
  const srcEl = main.querySelector(".src"), actBtn = main.querySelector(".sm-actbtn");
  let activity = null;
  actBtn.addEventListener("click", () => showActivity(activity));
  let cleanups = [];
  const ctx = {
    guide, fx, wait,
    get stage() { return stageEl; },
    get dock() { return dock; },
    reset(page) { stageEl.innerHTML = ""; stageEl.style.display = ""; dock.innerHTML = ""; pageEl.textContent = page || ""; pageEl.hidden = !page; srcEl.hidden = true; srcEl.textContent = ""; actBtn.hidden = true; activity = null; },
    // 같은 쪽의 둘째 지문 등으로 바꿀 때(원본 글 그대로)
    setSource(t) { srcEl.hidden = false; srcEl.classList.remove("missing"); srcEl.textContent = t; },
    // 교재 쪽 정보(원본 글 그대로): { section, title, text, activity, bubbles, labels, frame }
    page(no) { return text?.pages?.[no] || null; },
    // 지문을 원본 그대로 보이고 독쌤이 읽는다. 지문 파일이 없으면 「지문 준비 중」만 보인다.
    async source(no, { read = true } = {}) {
      const entry = text?.pages?.[no] || null;
      pageEl.textContent = `${no}쪽${entry?.section ? ` · ${entry.section}` : ""}`; pageEl.hidden = false;
      const shown = entry?.text || entry?.label || (entry ? entry.title : "") || "";
      srcEl.hidden = !shown;                                       // 지문 파일이 없는 공개 페이지는 독쌤 말만
      srcEl.textContent = shown;   // 활동판 쪽은 이름만 있다
      srcEl.classList.toggle("missing", !entry);
      activity = entry?.activity || null; actBtn.hidden = !activity;
      if (entry?.text && read) await guide.say(entry.text, { display: false });
      return entry;
    },
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

// 활동 상자(원본 그대로) — 학부모·선생님이 볼 수 있게 큰 창으로
function showActivity(act) {
  if (!act) return;
  const d = document.createElement("dialog");
  d.className = "sm-actbox";
  d.innerHTML = `<h2>활동 · ${esc(act.name)}</h2>
    ${act.goal ? `<p class="goal"><b>목 표</b> : ${esc(act.goal)}</p>` : ""}<p class="goal"><b>준비물</b> : ${esc(act.materials)}</p>
    <ol>${act.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>${act.example ? `<p class="ex"><b>예</b> ${esc(act.example)}</p>` : ""}
    <button class="sm-btn go big" type="button">닫기</button>`;
  document.body.append(d);
  d.querySelector("button").addEventListener("click", () => d.close());
  d.addEventListener("close", () => d.remove());
  d.showModal();
}

start();
