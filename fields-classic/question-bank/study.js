import { CURRICULUM } from "./source-data.js?v=20261028m";
import { unitParts, loadGoldenBell } from "./study-map.js?v=20261028x";
import { PHASES, FIXED_LINES, voiceLine, weekBlocks as unitWeekBlocks, weekTypes as unitWeekTypes, buildWeekSlides, slideLine, bellLabel } from "./study-deck.js?v=20261028y";
import { readRecord, saveRecord } from "./study-progress.js?v=20261028n";

// 학생용 단원 공부 — 사이언스 랩 「스스로 공부하기」처럼 한 장씩 넘기는 덱이다(원장 2026-10-24: 「아래로 내려가며 공부하는 게 아니라」).
//  표지 → ① 개념 배우기(골든벨 개념, 덩어리마다 한 장) → ② 게임하기 → ③ 골든벨 → ④ 공부하기(본책 번호판, 묶음마다 한 장) → 끝
//  · 골든벨 화면은 덱 안의 창 하나(golden-bell.html?embed=1)를 계속 쓰고, 장이 바뀌면 postMessage로 그 장의 학습만 연다.
//    「다음」은 그 창 안의 장(개념 덩어리)을 먼저 넘기고, 끝이면 덱의 다음 장으로 간다.
//  · 게임을 마치거나 골든벨 문항을 다 풀면 독쌤이 칭찬하고 저절로 다음 장으로 간다(⏸ 단추로 멈춘다).
//  · 본책 번호를 누르면 같은 유형의 유사문제가 이 장 위에 뜬다(문제은행 학생 화면, embed). 닫으면 번호판으로 돌아온다.
//  · 독쌤 말은 글이 원본이고, 음성은 기기 음성(ko-KR)으로 읽는다. 소리 없이 입을 움직이는 그림은 쓰지 않는다(표정 3장만 바꿔 끼움).
//  · 화면은 그림 액자 틀이다(원장: 「밝아야 돼」 → 「배너 말고 틀」). 섬 그림이 가장자리를 두르고 가운데 넓은 칸에서 공부한다.
//    위 액자에 공부 순서(개념 · 게임 · 골든벨 · 공부하기 · 도착), 아래 액자에 독쌤과 이전/다음. 장이 바뀌면 그림이 그 섬 쪽으로 조금 옮겨 간다.
//  · 게임하기에는 덱 안에 바로 뜨는 우리 게임(study-map.js STUDY_GAMES)을 먼저 둔다 — 지오메트리 게임의 계산·생김새를 가져와
//    골든벨 풀이 순서대로 다시 만든 것(원장: 「링크를 가져오는 거 아냐. 우리 걸 써야 돼」).
//  · 한 주 = 한 단원(원장 2026-10-27 「스스로 공부하기는 한 주 공부하는 흐름대로」): 차시로 나누지 않고 단원 전체를 한 덱으로 —
//    개념 → 게임 → 골든벨 → 공부하기(본책 묶음마다 문제가 화면에: 직접 풀기 · 인쇄해서 풀기 · 유사 문제) → 과제 → 단원 평가(semi test, ○✕ 진단 · 약점 유형)
//    → (그 권의 마지막 단원이면) 권별 테스트 → 도착. 문제는 문제은행 학생 화면(index.html?picks=…&as=student&embed=1)을 장 안에 띄운다.
// 주소: ?book=book-01&unit=0&s=장번호&student=…   (예전 &part= 는 무시한다)

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const book = CURRICULUM.find((entry) => entry.id === params.get("book")) || CURRICULUM[0];
const unitIndex = Math.min(Math.max(Number(params.get("unit")) || 0, 0), book.units.length - 1);
const unit = book.units[unitIndex];
const { count: partCount } = unitParts(unit);
const lastUnit = unitIndex === book.units.length - 1;
const seenKey = `fields-classic-study-seen:${student}:${book.id}:${unitIndex}`;
const seen = (() => { try { return new Set(JSON.parse(localStorage.getItem(seenKey) || "[]")); } catch { return new Set(); } })();
const prefKey = "fields-classic-study-pref";
const pref = (() => { try { return { sound: true, paused: false, ...JSON.parse(localStorage.getItem(prefKey) || "{}") }; } catch { return { sound: true, paused: false }; } })();
const savePref = () => { try { localStorage.setItem(prefKey, JSON.stringify(pref)); } catch {} };

const link = (page, entries) => `./${page}?${new URLSearchParams({ student, ...entries })}`;
const phaseNo = (kind) => PHASES.findIndex(([id]) => id === kind) + 1;

let slides = [{ kind: "cover" }];
let index = 0;
let ready = false;
let bellData = null;

// ── 장 만들기(study-deck.js) ─────────────────────────────
const buildSlides = () => buildWeekSlides(book, unitIndex, bellData);
const weekBlocks = () => unitWeekBlocks(unit);
const weekTypes = () => unitWeekTypes(unit);
const testId = `${book.id}-u${unitIndex}`;
const testResult = (id = testId) => readRecord(student, "test", id);
// 수행률·진도: 이 주(단원)에서 본 장을 적어 둔다(표지·도착·권별 테스트 안내는 빼고). 「내 학습 상황」(my-study.html)이 읽는다.
const weekKey = `${book.id}-u${unitIndex}`;
const COUNTED = (slide) => !["cover", "end", "booktest"].includes(slide.kind);
function recordVisit() {
  const slide = slides[index];
  if (!ready || !COUNTED(slide)) return;
  const same = slides.filter((entry) => entry.kind === slide.kind);
  const id = `${slide.kind}:${same.indexOf(slide)}`;
  const week = readRecord(student, "week", weekKey) || {};
  const seenIds = new Set(week.seen || []);
  const fresh = !seenIds.has(id);
  seenIds.add(id);
  const phases = {};
  for (const [kind] of PHASES) {
    const all = slides.filter((entry) => entry.kind === kind).length;
    if (all) phases[kind] = [[...seenIds].filter((entry) => entry.startsWith(`${kind}:`)).length, all];
  }
  // 같은 장을 다시 열 때는 마지막 장만 바꾼다(서버에 저장할 일이 덜 생기게)
  if (!fresh && week.last === index + 1) return;
  saveRecord(student, "week", weekKey, { total: slides.filter(COUNTED).length, seen: [...seenIds], phases, last: index + 1, unit: unit.label });
}
// 문제은행 학생 화면 주소. 화면에서 풀 때는 embed, 인쇄할 때는 새 창에서 print=1
function sheetUrl(slide, { print = false } = {}) {
  const base = { mode: "curriculum", book: book.id, build: "1", as: "student" };
  let entries;
  if (slide.kind === "board") {
    const picks = slide.block.numbers.map(({ n, typeId, stage }) => [typeId, stage, refOf(slide.block, n), unitIndex].join("~")).join("|");
    entries = { picks, title: `${book.label} ${unitIndex + 1}단원 · 본책 ${slide.block.label}` };
  } else if (slide.kind === "homework") {
    entries = { picks: weekTypes().map((typeId) => [typeId, "practice", "과제", unitIndex].join("~")).join("|"), title: `${book.label} ${unitIndex + 1}단원 과제` };
  } else {
    entries = { picks: weekTypes().map((typeId) => [typeId, "advanced", "단원 평가", unitIndex].join("~")).join("|"), title: `${book.label} ${unitIndex + 1}단원 평가`, test: "1", testId };
  }
  return link("index.html", { ...base, ...entries, ...(print ? { print: "1" } : { embed: "1" }) });
}
function workMarkup(slide) {
  const help = slide.kind === "board"
    ? `본책 <b>${esc(slide.block.label)}</b>과 같은 유형의 문제예요. 화면에서 풀어도 되고, 인쇄해서 풀어도 돼요. 어려우면 <b>유사 문제 풀기</b>.`
    : slide.kind === "homework"
      ? "이번 주 <b>과제</b>예요. 인쇄해서 집에서 풀고, 화면에서 답을 확인해요."
      : "이번 주 <b>단원 평가</b>예요. 다 풀고 채점하면 ○✕로 약점 유형을 알려 줘요.";
  return `<div class="sd-work">
    <div class="sd-work-bar"><p>${help}</p><a class="sd-btn" href="${esc(sheetUrl(slide, { print: true }))}" target="_blank" rel="noopener">🖨 인쇄해서 풀기</a></div>
    <iframe class="sd-work-frame" id="workFrame" title="${esc(slideTitle(slide))}" src="${esc(sheetUrl(slide))}"></iframe>
  </div>`;
}
function bookTestMarkup() {
  const rows = book.units.map((entry, k) => {
    const result = testResult(`${book.id}-u${k}`);
    return `<li><b>${k + 1}단원</b><span>${esc(entry.label)}</span><small>${result ? `단원 평가 ${result.right} / ${result.total}` : "단원 평가 전"}</small></li>`;
  }).join("");
  return `<div class="sd-cover sd-booktest">
    <p class="sd-cover-kick">${esc(book.label)} 마무리 · ${book.units.length}단원을 다 공부했으면</p>
    <h1>${esc(book.label)} 권별 테스트</h1>
    <p class="sd-cover-lead">원문 시험지 ${book.source.unitTestQuestions.length}문제를 풀고 ○✕로 채점하면 유형별로 진단해 주고, 약점 유형을 다시 공부해요.</p>
    <ol class="sd-unit-results">${rows}</ol>
    <a class="sd-btn primary" href="${esc(link("unit-test-viewer.html", { book: book.id }))}">권별 테스트 풀기 →</a>
  </div>`;
}

// ── 독쌤 ─────────────────────────────────────────────────
const PORTRAIT = { talk: "docssam-guide.webp", think: "docssam-thinking.webp", praise: "docssam-praise.webp" };
let lastLine = null;
function say(text, mood = "talk", voiceId = null) {
  lastLine = [text, mood, voiceId];
  $("guideSay").textContent = text;
  $("talk").dataset.mood = mood;
  $("walkerImg").src = `./${PORTRAIT[mood] || PORTRAIT.talk}`;
  const bubble = $("talk");
  bubble.classList.remove("new"); void bubble.offsetWidth; bubble.classList.add("new");
  return speak(text, voiceId);
}
// 독쌤 복제 음성(OmniVoice, scripts/omnivoice-docssam.py 가 GPU PC에서 만들어 science-lab/audio/docssam/ 에 둔 것).
// 파일 이름 = <줄 id>-<sha1("<목소리>|<글>") 앞 10자>.mp3 — 글이 바뀌면 이름이 바뀌어 옛 음성을 틀지 않는다. 없는 줄은 기기 음성.
const CLONE_BASE = new URL("../../science-lab/audio/docssam/", import.meta.url).href;
let cloneManifest = null;
function cloneFiles() {
  return (cloneManifest ||= fetch(CLONE_BASE + "manifest.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && Array.isArray(j.files) ? { voices: j.voices || [], rates: j.rates || {}, files: new Set(j.files) } : null)).catch(() => null));
}
async function sha10(s) { const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(s)); return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 10); }
async function cloneUrl(id, text) {
  if (!id || !text || typeof crypto?.subtle === "undefined") return null;
  const m = await cloneFiles(); if (!m) return null;
  for (const v of m.voices) { const f = `${id}-${await sha10(`${v}|${text}`)}.mp3`; if (m.files.has(f)) return { url: CLONE_BASE + f, rate: Number(m.rates[v] ?? 1) || 1 }; }
  return null;
}
let cloneAudio = null, cloneEnd = null, speakSeq = 0;
function stopClone() { if (cloneAudio) { try { cloneAudio.pause(); } catch {} cloneAudio = null; } const end = cloneEnd; cloneEnd = null; end?.(); }
// 말이 끝나면(소리가 꺼져 있으면 읽을 만한 시간이 지나면) 풀리는 Promise. 기기 음성이 끝을 알리지 않는 경우를 대비해 최대 시간도 둔다.
// 새 말이 오면 앞의 말은 끊고 바로 풀린다. 복제 음성 파일을 찾는 사이(await)에 새 말이 왔으면 앞의 말은 아예 틀지 않는다 — 안 그러면 두 목소리가 겹친다.
function speak(text, voiceId = null) {
  const reading = Math.min(7000, Math.max(900, String(text || "").length * 75));
  const seq = ++speakSeq;
  return new Promise(async (resolve) => {
    let done = false; const finish = () => { if (!done) { done = true; resolve(); } };
    stopClone();
    try { speechSynthesis?.cancel(); } catch {}
    if (pref.sound && text && voiceId) {
      const clone = await cloneUrl(voiceId, text).catch(() => null);
      if (seq !== speakSeq) { finish(); return; }
      if (clone) {
        try {
          const audio = new Audio(clone.url); cloneAudio = audio; cloneEnd = finish; audio.playbackRate = clone.rate; audio.preservesPitch = true;
          audio.addEventListener("ended", finish); audio.addEventListener("error", finish);
          await audio.play();
          if (seq !== speakSeq) { audio.pause(); finish(); return; }
          setTimeout(finish, reading * 3 + 3000); return;
        } catch { if (seq === speakSeq) stopClone(); else { finish(); return; } }
      }
    }
    if (seq !== speakSeq) { finish(); return; }
    if (typeof speechSynthesis === "undefined") { setTimeout(finish, reading); return; }
    try {
      if (!pref.sound || !text) { setTimeout(finish, text ? reading : 0); return; }
      const utterance = new SpeechSynthesisUtterance(text);
      const ko = (speechSynthesis.getVoices() || []).find((voice) => /^ko/i.test(voice.lang));
      utterance.lang = "ko-KR"; utterance.rate = 0.9;   // 천천히(원장 2026-10-25) if (ko) utterance.voice = ko;
      utterance.onend = finish; utterance.onerror = finish;
      speechSynthesis.speak(utterance);
      setTimeout(finish, reading * 2.5 + 2000);
    } catch { setTimeout(finish, reading); }
  });
}
function paintGuideButtons() {
  $("voiceBtn").textContent = pref.sound ? "🔊" : "🔇";
  $("voiceBtn").setAttribute("aria-pressed", String(pref.sound));
  $("pauseBtn").textContent = pref.paused ? "▶" : "⏸";
  $("pauseBtn").title = pref.paused ? "다음 장으로 저절로 넘어가기 켜기" : "저절로 넘어가기 멈추기";
  $("pauseBtn").setAttribute("aria-pressed", String(pref.paused));
}
$("voiceBtn").addEventListener("click", () => { pref.sound = !pref.sound; savePref(); paintGuideButtons(); if (pref.sound && lastLine) speak(lastLine[0], lastLine[2]); else speak(""); });
$("againBtn").addEventListener("click", () => { if (lastLine) { pref.sound = true; savePref(); paintGuideButtons(); speak(lastLine[0], lastLine[2]); } });
$("pauseBtn").addEventListener("click", () => { pref.paused = !pref.paused; savePref(); paintGuideButtons(); if (pref.paused) cancelAuto(); });

// ── 저절로 다음 장 ───────────────────────────────────────
let autoTimer = 0;
function auto(ms) {
  cancelAuto();
  if (pref.paused) return;
  const fill = $("nextBtn").querySelector(".sd-fill");
  fill.style.transition = "none"; fill.style.width = "0";
  void fill.offsetWidth;
  fill.style.transition = `width ${ms}ms linear`; fill.style.width = "100%";
  autoTimer = setTimeout(() => go(index + 1), ms);
}
function cancelAuto() {
  clearTimeout(autoTimer); autoTimer = 0;
  const fill = $("nextBtn").querySelector(".sd-fill");
  fill.style.transition = "none"; fill.style.width = "0";
}

// ── 골든벨 창 ─────────────────────────────────────────────
const frame = $("bellFrame");
let frameReady = false;
let pendingOpen = null;
let waiting = null; // 창에 next/prev를 보내고 답(end/start)을 기다리는 중
function frameSend(message) { frame.contentWindow?.postMessage({ type: "fc-study", ...message }, location.origin); }
function openInFrame(slide, atEnd = false) {
  const message = { cmd: "open", lesson: slide.lesson.id, view: slide.kind, game: slide.game || "", atEnd };
  if (!frame.src) {
    frame.src = link("golden-bell.html", { book: book.id, as: "student", embed: "1", lesson: slide.lesson.id, view: slide.kind, game: slide.game || "" });
    pendingOpen = atEnd ? message : null;
    return;
  }
  if (frameReady) frameSend(message); else pendingOpen = message;
}
window.addEventListener("message", (event) => {
  if (event.origin !== location.origin || event.data?.type !== "fc-embed") return;
  if (event.source === $("sheetFrame").contentWindow) return;
  // 단원 평가를 채점했다 → 독쌤이 결과와 약점 유형을 말해 준다
  if (event.source === document.getElementById("workFrame")?.contentWindow) {
    if (event.data.event === "test-result" && event.data.marked === event.data.total) {
      const weak = event.data.weak || [];
      say(weak.length ? `${event.data.total}문제 중 ${event.data.right}문제 맞았어요. ${weak.slice(0, 2).join(", ")}${weak.length > 2 ? ` 말고도 ${weak.length - 2}가지` : ""} 유형이 약해요. 약점 유형 공부하기를 눌러 다시 풀어 봐요.` : `${event.data.total}문제를 모두 맞았어요! 정말 잘했어요.`, weak.length ? "think" : "praise");
      renderSigns();
    }
    return;
  }
  if (event.source !== frame.contentWindow) return;
  const data = event.data;
  const slide = slides[index];
  if (data.event === "ready") {
    frameReady = true;
    if (pendingOpen) { frameSend(pendingOpen); pendingOpen = null; }
    return;
  }
  if (data.event === "state") {
    // 창이 그 안에서 장을 넘겼다(덱은 그대로) — 기다리던 답은 끝
    if (waiting) { waiting = null; clearTimeout(waitTimer); }
    if (slide?.lesson?.id === data.lesson && slide.kind === "concept") {
      $("slidePage").textContent = data.pages > 1 ? `${data.page + 1} / ${data.pages}장` : "";
    }
    return;
  }
  if (data.event === "end" || data.event === "start") {
    const want = waiting; waiting = null; clearTimeout(waitTimer);
    if (want === "next" && data.event === "end") go(index + 1);
    if (want === "prev" && data.event === "start") go(index - 1, { atEnd: true });
    return;
  }
  if (data.event === "done" && slide?.lesson?.id === data.lesson && slide.kind === data.view) {
    const done = slide.kind === "bell" ? FIXED_LINES.bellDone : FIXED_LINES.gameDone;
    say(done.text, "praise", done.id);
    auto(slide.kind === "game" ? 6000 : 2600);   // 게임은 별·결과를 볼 시간을 준다
  }
});
let waitTimer = 0;
function askFrame(cmd) {
  waiting = cmd;
  frameSend({ cmd });
  clearTimeout(waitTimer);
  // 창이 아직 준비 안 됐으면(답이 없으면) 덱이 바로 넘긴다
  waitTimer = setTimeout(() => { if (waiting === cmd) { waiting = null; cmd === "next" ? go(index + 1) : go(index - 1, { atEnd: true }); } }, 2000);
}

// ── 덱 안의 우리 게임 ──────────────────────────────────────
let nativeGame = null;
const loadedCss = new Set();
async function mountNative(slide, intro = Promise.resolve()) {
  const game = slide.native;
  if (!loadedCss.has(game.css)) {
    loadedCss.add(game.css);
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet"; linkEl.href = game.css;
    document.head.append(linkEl);
  }
  const mod = await import(game.module);
  if (slides[index] !== slide) return;   // 불러오는 사이에 장을 넘겼다
  const host = document.createElement("div");
  host.className = "sd-native";
  $("slideBody").replaceChildren(host);
  nativeGame = mod[game.mount](host, {
    // 말 끝을 기다릴 수 있게 Promise를 돌려준다(판서가 비트마다 기다린다). voiceId가 있으면 독쌤 복제 음성.
    // 장 안내 말(intro)이 끝난 뒤에 말한다 — 판서 첫 말이 안내 말을 끊거나 겹치지 않게
    say: async (text, mood, voiceId) => { await intro; if (slides[index] !== slide) return; return say(text, mood, voiceId); },
    board: game.board, lesson: slide.lesson,
    onDone: () => { if (game.doneSay !== null) { const done = game.doneSay ? voiceLine("game", game.doneSay) : FIXED_LINES.nativeDone; say(done.text, "praise", done.id); } auto(game.board ? 4000 : 2200); }
  });
  fitObserver.observe(host, { childList: true, subtree: true });
  requestAnimationFrame(fitNative);
}
function disposeNative() { fitObserver.disconnect(); try { nativeGame?.dispose(); } catch {} nativeGame = null; }
// 작은 가로 화면(원장 2026-10-26 「한 화면에 가득 차야지」): 게임판이 칸보다 크면 아래로 내리지 않고 통째로 줄여 한 화면에 넣는다
const fitObserver = new MutationObserver(() => requestAnimationFrame(fitNative));
function fitNative() {
  const body = $("slideBody"), host = body.querySelector(":scope > .sd-native");
  if (!host || slides[index]?.kind !== "game") return;
  host.style.zoom = "";
  const cs = getComputedStyle(body), avail = body.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const need = host.scrollHeight;
  if (need > avail + 2) host.style.zoom = String(Math.max(0.55, Math.floor((avail / need) * 100) / 100));
}
addEventListener("resize", () => requestAnimationFrame(fitNative));

// ── 화면 ──────────────────────────────────────────────────
function renderHead() {
  document.title = `${book.label} ${unitIndex + 1}단원 · ${unit.label}`;
  $("eyebrow").textContent = `${book.label} ${unitIndex + 1}단원 · 이번 주`;
  $("unitTitle").textContent = unit.label;
  $("studentName").textContent = student;
  $("backLink").href = link("start.html", { book: book.id, unit: String(unitIndex) });
}
// ── 그림 세계: 섬 다섯 개(그림 1672×941 안의 자리, %) ──
// 그림의 다섯 터(아래 왼쪽 → 위 오른쪽). 그림을 바꾸면 이 자리를 다시 잰다.
const ISLANDS = [[15, 78], [35.5, 55], [52, 38.5], [73.5, 33.5], [87.6, 15.5]];
const STATIONS = [["concept", "개념 배우기"], ["game", "게임하기"], ["bell", "워밍업"], ["board", "공부하기"], ["homework", "과제"], ["test", "단원 평가"], ["booktest", "권별 테스트"], ["end", "도착"]];
const visibleStations = () => STATIONS.filter(([kind]) => kind !== "booktest" || slides.some((slide) => slide.kind === "booktest"));
const stationOf = (slide) => Math.max(0, visibleStations().findIndex(([kind]) => kind === slide.kind));
function renderSigns() {
  const slide = slides[index];
  const here = slide.kind === "cover" ? -1 : stationOf(slide);
  $("signs").innerHTML = visibleStations().map(([kind, label], k) => {
    const first = slides.findIndex((entry) => entry.kind === kind);
    const count = slides.filter((entry) => entry.kind === kind).length;
    const done = first >= 0 && first < index && here !== k;
    const state = here === k ? " is-on" : done ? " is-done" : "";
    const note = !ready || ["end", "homework", "test", "booktest"].includes(kind) ? "" : first < 0 ? "준비 중" : `${count}장`;
    return `<button type="button" class="sd-step${state}" data-jump="${first}" ${first < 0 ? "disabled" : ""} ${here === k ? 'aria-current="step"' : ""}><b>${done ? "✓" : k + 1}</b><span>${label}${note ? ` <small>${note}</small>` : ""}</span></button>`;
  }).join("");
}
// 액자 그림 옮기기: 지금 섬이 화면 가운데 쪽으로 오게 조금씩(칸이 가운데를 덮으므로 가장자리 풍경이 바뀐다).
function placeWorld() {
  const slide = slides[index];
  const k = slide.kind === "cover" ? 0 : stationOf(slide);
  const H = Math.max(innerHeight, innerWidth * 941 / 1672) * 1.18;
  const W = H * 1672 / 941;
  const [sx, sy] = ISLANDS[Math.round((k * (ISLANDS.length - 1)) / Math.max(1, visibleStations().length - 1))];
  const tx = Math.min(0, Math.max(innerWidth - W, innerWidth / 2 - (sx / 100) * W));
  const ty = Math.min(0, Math.max(innerHeight - H, innerHeight / 2 - (sy / 100) * H));
  const pan = $("pan");
  pan.style.width = `${W}px`; pan.style.height = `${H}px`;
  pan.style.transform = `translate(${Math.round(tx)}px, ${Math.round(ty)}px)`;
}
addEventListener("resize", () => placeWorld());

function slideTitle(slide) {
  if (slide.kind === "board") return `본책 ${slide.block.label}`;
  if (slide.kind === "homework") return `${unitIndex + 1}단원 과제 · ${weekTypes().length}문제`;
  if (slide.kind === "test") return `${unitIndex + 1}단원 평가 · ${weekTypes().length}문제`;
  if (slide.kind === "booktest") return `${book.label} 권별 테스트`;
  return slide.kind === "game" ? slide.title : slide.lesson.title;
}
function slideHead(slide) {
  if (slide.kind === "cover" || slide.kind === "end" || slide.kind === "booktest") return "";
  const label = slide.kind === "bell" ? bellLabel(slide) : PHASES[phaseNo(slide.kind) - 1][1];
  const title = slideTitle(slide);
  return `<p class="sd-kick"><span class="sd-kick-no">${phaseNo(slide.kind)}</span>${label}${slide.of ? ` <em>${slide.of}</em>` : ""}<span id="slidePage" class="sd-page"></span></p><h2>${esc(title)}</h2>`;
}
function coverMarkup() {
  const counts = {
    concept: slides.filter((s) => s.kind === "concept").length,
    game: slides.filter((s) => s.kind === "game").length,
    bell: slides.filter((s) => s.kind === "bell").reduce((sum, s) => sum + s.lesson.original.items.length, 0),
    board: slides.filter((s) => s.kind === "board").reduce((sum, s) => sum + s.block.numbers.length, 0),
    homework: slides.some((s) => s.kind === "homework") ? weekTypes().length : 0,
    test: slides.some((s) => s.kind === "test") ? weekTypes().length : 0,
    booktest: slides.some((s) => s.kind === "booktest") ? book.source.unitTestQuestions.length : 0
  };
  const note = { concept: `${counts.concept}개 개념`, game: `${counts.game}개 게임`, bell: `${counts.bell}문제`, board: `본책 ${counts.board}문제`, homework: `${counts.homework}문제`, test: `${counts.test}문제 · ○✕ 진단`, booktest: `${counts.booktest}문제` };
  return `<div class="sd-cover">
    <p class="sd-cover-kick">${esc(book.label)} ${unitIndex + 1}단원 · 이번 주 공부</p>
    <h1>${esc(unit.label)}</h1>
    <p class="sd-cover-lead">섬을 따라 한 곳씩 가 봐요.</p>
    <ol class="sd-plan" style="--n:${PHASES.filter(([kind]) => kind !== "booktest" || counts.booktest).length}">${PHASES.filter(([kind]) => kind !== "booktest" || counts.booktest).map(([kind, label], k) => `<li class="${ready && !counts[kind] ? "is-empty" : ""}"><b>${k + 1}</b><span>${label}</span><small>${ready ? counts[kind] ? note[kind] : "준비 중" : "불러오는 중…"}</small></li>`).join("")}</ol>
    <button type="button" class="sd-btn primary sd-start" data-act="next" ${ready ? "" : "disabled"}>출발하기 →</button>
  </div>`;
}
function boardMarkup(block) {
  return `<p class="sd-board-help">본책을 펴서 <b>${esc(block.label)}</b> 문제를 풀어요. 모르는 번호를 누르면 같은 유형의 비슷한 문제가 나와요.</p>
    <div class="sd-numbers">${block.numbers.map(({ n, typeId, stage }) => {
      const ref = refOf(block, n);
      const key = `${block.section}${block.group}-${n}`;
      return `<button type="button" class="sd-number${seen.has(key) ? " is-seen" : ""}" data-key="${key}" data-type="${esc(typeId)}" data-stage="${stage}" data-ref="${esc(ref)}" aria-label="${esc(ref)} 비슷한 문제">${n}</button>`;
    }).join("")}</div>
    <p class="sd-board-note">○ 표시는 한 번 눌러 본 번호예요. 다 풀었으면 다음으로 가요.</p>`;
}
const refOf = (block, n) => block.label.includes(" ") ? `${block.label}-${n}번` : `${block.label} ${n}번`; // 활동 1-3번 · 연습 7번
function endMarkup() {
  const result = testResult();
  return `<div class="sd-cover sd-end">
    <span class="sd-medal" aria-hidden="true">✓</span>
    <h1>${unitIndex + 1}단원 한 주 공부를 마쳤어요!</h1>
    <p class="sd-cover-lead">${esc(unit.label)}${result ? ` · 단원 평가 ${result.right} / ${result.total}` : ""}</p>
    <div class="sd-end-actions">
      ${!lastUnit ? `<a class="sd-btn primary" href="${esc(link("study.html", { book: book.id, unit: String(unitIndex + 1) }))}">다음 주 · ${unitIndex + 2}단원 시작하기 ›</a>` : `<a class="sd-btn primary" href="${esc(link("unit-test-viewer.html", { book: book.id }))}">${esc(book.label)} 권별 테스트 ›</a>`}
      <a class="sd-btn" href="${esc(link("my-study.html", { book: book.id }))}">내 학습 상황</a>
      <a class="sd-btn" href="${esc(link("start.html", { book: book.id }))}">단원 고르기</a>
      <button type="button" class="sd-btn" data-act="restart">처음부터 다시 하기</button>
    </div>
  </div>`;
}
// 독쌤 말 { id, text } — id가 있으면 독쌤 복제 음성(없으면 기기 음성)
const lineFor = (slide) => slide.kind === "cover" && !ready ? FIXED_LINES.loading : slideLine(slide, { book, unitIndex });

function show({ atEnd = false } = {}) {
  cancelAuto(); closeSheet(false);
  const slide = slides[index];
  $("stage").dataset.kind = slide.kind;
  $("slideHead").innerHTML = slideHead(slide);
  $("slideHead").hidden = !$("slideHead").innerHTML;
  disposeNative();
  const native = Boolean(slide.native);
  const framed = !native && ["concept", "game", "bell"].includes(slide.kind);
  $("frameWrap").hidden = !framed;
  $("slideBody").hidden = framed;
  $("slideBody").innerHTML = slide.kind === "cover" ? coverMarkup() : ["board", "homework", "test"].includes(slide.kind) ? workMarkup(slide) : slide.kind === "booktest" ? bookTestMarkup() : slide.kind === "end" ? endMarkup() : native ? '<p class="sd-wait">준비하고 있어요…</p>' : "";
  $("slideBody").classList.toggle("is-work", ["board", "homework", "test"].includes(slide.kind));
  const line = lineFor(slide);
  const intro = say(line.text, slide.kind === "end" ? "praise" : "talk", line.id);
  if (framed) openInFrame(slide, atEnd);
  if (native) mountNative(slide, intro).catch(() => { $("slideBody").innerHTML = '<p class="sd-wait">불러오지 못했어요. 새로고침해 주세요.</p>'; });
  $("prevBtn").disabled = index === 0;
  $("firstBtn").disabled = index === 0;
  $("nextBtn").disabled = !ready || index === slides.length - 1;
  $("nextBtn").querySelector(".sd-next-text").textContent = slide.kind === "cover" ? "출발하기 →" : "다음 →";
  $("count").textContent = `${index + 1} / ${slides.length}`;
  renderSigns();
  placeWorld();
  recordVisit();
  const url = new URL(location.href);
  url.searchParams.set("s", String(index + 1));
  history.replaceState(null, "", url);
}
function go(target, options) {
  if (!ready) return;
  const next = Math.min(Math.max(target, 0), slides.length - 1);
  if (next === index) return;
  index = next;
  show(options);
  $("stage").scrollTop = 0;
}
function next() {
  cancelAuto();
  if (!$("sheet").hidden) { closeSheet(); return; }
  if (slides[index].kind === "concept" && !slides[index].native && frameReady) { askFrame("next"); return; }
  go(index + 1);
}
function prev() {
  cancelAuto();
  if (!$("sheet").hidden) { closeSheet(); return; }
  if (slides[index].kind === "concept" && !slides[index].native && frameReady) { askFrame("prev"); return; }
  const target = index - 1;
  go(target, { atEnd: slides[target]?.kind === "concept" });
}

// ── 유사문제 창(본책 번호를 눌렀을 때) ────────────────────
function openSheet(button) {
  const ref = button.dataset.ref;
  seen.add(button.dataset.key);
  button.classList.add("is-seen");
  try { localStorage.setItem(seenKey, JSON.stringify([...seen])); } catch {}
  $("sheetTitle").textContent = `${ref} · 비슷한 문제`;
  $("sheetFrame").src = link("index.html", { mode: "curriculum", book: book.id, units: String(unitIndex), only: button.dataset.type, stage: button.dataset.stage, count: "1", build: "1", as: "student", embed: "1", ref: `${unitIndex + 1}단원 ${ref}` });
  $("sheet").hidden = false;
  $("sheetClose").focus({ preventScroll: true });
  say(`${ref}과 같은 유형의 문제예요. 이 문제를 먼저 풀고 본책 문제를 다시 풀어 봐요.`, "think");
}
function closeSheet(talk = true) {
  if ($("sheet").hidden) return;
  $("sheet").hidden = true;
  $("sheetFrame").removeAttribute("src");
  if (talk) say("좋아요. 이제 본책으로 돌아가서 그 문제를 다시 풀어 봐요.", "talk");
}
$("sheetClose").addEventListener("click", () => closeSheet());

// ── 조작 ──────────────────────────────────────────────────
$("nextBtn").addEventListener("click", next);
$("prevBtn").addEventListener("click", prev);
$("firstBtn").addEventListener("click", () => { cancelAuto(); closeSheet(false); go(0); });
$("signs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-jump]");
  if (button && !button.disabled) { cancelAuto(); go(Number(button.dataset.jump)); }
});
$("slideBody").addEventListener("click", (event) => {
  const number = event.target.closest(".sd-number");
  if (number) { openSheet(number); return; }
  // 게임 장의 단추는 게임이 맡는다(게임이 누른 단추를 다시 그려 문서에서 떼어 낸 뒤라 closest로는 못 가린다)
  if (slides[index]?.native || !event.target.isConnected || event.target.closest(".sd-native")) return;
  const act = event.target.closest("[data-act]")?.dataset.act;
  if (act === "next") next();
  if (act === "restart") go(0);
});
window.addEventListener("keydown", (event) => {
  if (event.target.closest?.("input,textarea,select")) return;
  if (["ArrowRight", "PageDown"].includes(event.key)) { event.preventDefault(); next(); }
  else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); prev(); }
  else if (event.key === "Escape" && !$("sheet").hidden) closeSheet();
});
// 손으로 무언가를 하면 저절로 넘기기를 멈춘다(읽는 중에 넘어가지 않게)
$("stage").addEventListener("pointerdown", () => { if (autoTimer) cancelAuto(); });

// &at=game 처럼 장 종류로 열기(첫 화면 「사고력 게임」 카드) — 덱 길이가 바뀌어도 그 종류의 첫 장으로 간다. 없으면 &s=장 번호
function startIndex() {
  const at = slides.findIndex((slide) => slide.kind === params.get("at"));
  if (at >= 0) return at;
  return Math.min(Math.max((Number(params.get("s")) || 1) - 1, 0), slides.length - 1);
}
renderHead();
paintGuideButtons();
show();
loadGoldenBell().then((data) => {
  bellData = data;
  slides = buildSlides();
  ready = true;
  index = startIndex();
  show();
}).catch(() => {
  // 골든벨을 못 불러와도 본책 번호판은 쓸 수 있다
  bellData = null;
  slides = buildSlides();
  ready = true;
  index = startIndex();
  show();
  say(FIXED_LINES.bellLoadFail.text, "think", FIXED_LINES.bellLoadFail.id);
});
