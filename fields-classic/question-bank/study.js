import { CURRICULUM, typeById } from "./source-data.js?v=20261028m";
import { unitParts, loadGoldenBell } from "./study-map.js?v=20261029a";
import { PHASES, FIXED_LINES, voiceLine, buildSessionSlides, sessionCount, sessionTypes, dailyTypes, unitTestTypes, DAILY_COUNT, UNIT_TEST_COUNT, slideLine, bellLabel, refOf, sheetLine, testResultLine, SHEET_BACK } from "./study-deck.js?v=20261029f";
import { readRecord, saveRecord } from "./study-progress.js?v=20261029q";
import { canStudy, lockPage } from "./fields-access.js?v=20261029q";

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
//  · 한 단원 = 차시 2번(원장 2026-10-29 「1단원을 2번으로 끊어 줘야 하고」, 7권 2단원·10권 1단원은 3번). 차시 덱 하나:
//    (개념 → 게임(건너뛸 수 있다) → 워밍업)을 개념마다 → 공부하기(그 차시 본책 묶음: 직접 풀기 · 인쇄해서 풀기 · 유사 문제)
//    → 오늘의 과제(칠판 글씨) → 앞 차시는 데일리 테스트 4문제 · 마지막 차시는 단원 평가 10문제(○✕ 진단 · 약점 유형)
//    → (그 권의 마지막 단원 마지막 차시면) 권별 테스트 → 도착. 문제는 문제은행 학생 화면(index.html?picks=…&as=student&embed=1)을 장 안에 띄운다.
// 주소: ?book=book-01&unit=0&part=1&s=장번호&student=…   (part 없으면 1차시)

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const book = CURRICULUM.find((entry) => entry.id === params.get("book")) || CURRICULUM[0];
const unitIndex = Math.min(Math.max(Number(params.get("unit")) || 0, 0), book.units.length - 1);
const unit = book.units[unitIndex];
const parts = sessionCount(unit);
const part = Math.min(Math.max(Number(params.get("part")) || 1, 1), parts);
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
const buildSlides = () => buildSessionSlides(book, unitIndex, part, bellData);
const todayTypes = () => sessionTypes(unit, part);
// 단원 평가는 단원마다 하나(권별 테스트 안내·내 학습 상황이 읽는다), 데일리 테스트는 차시마다
const testId = `${book.id}-u${unitIndex}`;
const dailyId = `${book.id}-u${unitIndex}-d${part}`;
const testResult = (id = testId) => readRecord(student, "test", id);
// 수행률·진도: 이 단원에서 본 장을 차시를 합쳐 적어 둔다(표지·도착·권별 테스트 안내는 빼고). 「내 학습 상황」(my-study.html)·시작 화면이 읽는다.
// 장 id = p<차시>:<종류>:<그 차시에서 몇 번째>
const weekKey = `${book.id}-u${unitIndex}`;
const COUNTED = (slide) => !["cover", "end", "booktest"].includes(slide.kind);
let allSessions = null;   // 차시마다의 장(다른 차시는 수행률 분모로만)
function recordVisit() {
  const slide = slides[index];
  if (!ready || !COUNTED(slide)) return;
  allSessions ||= Array.from({ length: parts }, (_, k) => (k + 1 === part ? slides : buildSessionSlides(book, unitIndex, k + 1, bellData)));
  const same = slides.filter((entry) => entry.kind === slide.kind);
  const id = `p${part}:${slide.kind}:${same.indexOf(slide)}`;
  const week = readRecord(student, "week", weekKey) || {};
  const seenIds = new Set((week.seen || []).filter((entry) => /^p\d+:/.test(entry)));
  const fresh = !seenIds.has(id);
  seenIds.add(id);
  const phases = {};
  for (const [kind] of PHASES) {
    const all = allSessions.reduce((sum, list) => sum + list.filter((entry) => entry.kind === kind).length, 0);
    if (all) phases[kind] = [[...seenIds].filter((entry) => entry.split(":")[1] === kind).length, all];
  }
  // 같은 장을 다시 열 때는 마지막 장만 바꾼다(서버에 저장할 일이 덜 생기게)
  if (!fresh && week.last === index + 1 && week.part === part) return;
  saveRecord(student, "week", weekKey, { total: allSessions.reduce((sum, list) => sum + list.filter(COUNTED).length, 0), seen: [...seenIds], phases, last: index + 1, part, parts, unit: unit.label });
}
// 문제은행 학생 화면 주소. 화면에서 풀 때는 embed, 인쇄할 때는 새 창에서 print=1
function sheetUrl(slide, { print = false } = {}) {
  // 공부하기는 답 확인 때 정답만 손글씨로, 오늘의 과제는 손글씨 정답 + 풀이
  const base = { mode: "curriculum", book: book.id, build: "1", as: "student", ...(slide.kind === "board" ? { hand: "1" } : slide.kind === "homework" ? { hand: "solve" } : {}) };
  let entries;
  if (slide.kind === "board") {
    const picks = slide.block.numbers.map(({ n, typeId, stage }) => [typeId, stage, refOf(slide.block, n), unitIndex].join("~")).join("|");
    entries = { picks, title: `${book.label} ${unitIndex + 1}단원 · 본책 ${slide.block.label}` };
  } else if (slide.kind === "homework") {
    entries = { picks: todayTypes().map((typeId) => [typeId, "practice", "오늘의 과제", unitIndex].join("~")).join("|"), title: `${book.label} ${unitIndex + 1}단원 ${part}차시 · 오늘의 과제` };
  } else if (slide.kind === "daily") {
    entries = { picks: dailyTypes(unit, part).map((typeId) => [typeId, "practice", "데일리 테스트", unitIndex].join("~")).join("|"), title: `${book.label} ${unitIndex + 1}단원 ${part}차시 · 데일리 테스트`, test: "1", testId: dailyId };
  } else {
    entries = { picks: unitTestTypes(unit).map((typeId) => [typeId, "advanced", "단원 평가", unitIndex].join("~")).join("|"), title: `${book.label} ${unitIndex + 1}단원 평가`, test: "1", testId };
  }
  // 공부하기·오늘의 과제를 인쇄하면 맨 앞에 교재 표지(B 딥 그린 · 금 라인, 원장 2026-10-29 「표지도 만들라고」)
  const cover = print && (slide.kind === "board" || slide.kind === "homework") ? { cover: "b" } : {};
  return link("index.html", { ...base, ...entries, ...cover, ...(print ? { print: "1" } : { embed: "1" }) });
}
// 오늘의 과제: 칠판에 손글씨로 할 일을 적어 준다(원장 2026-10-29 「과제는 오늘의 과제 하고 칠판 글씨처럼 써줘야지」)
function chalkMarkup() {
  const types = todayTypes();
  const items = [
    `과제 학습지 ${types.length}문제를 인쇄해요`,
    ...types.slice(0, 4).map((typeId) => `${typeById(typeId)?.label || "같은 유형"} 문제 풀기`),
    ...(types.length > 4 ? [`그 밖의 ${types.length - 4}가지 유형도 풀기`] : []),
    "다 풀면 화면에서 답과 풀이를 확인해요"
  ];
  return `<div class="sd-chalk" role="note"><h3>오늘의 과제</h3><p class="sd-chalk-date">${esc(unit.label)} · ${part}차시</p><ol>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ol></div>`;
}
function workMarkup(slide) {
  const help = slide.kind === "board"
    ? `본책 <b>${esc(slide.block.label)}</b>과 같은 유형의 문제예요. 화면에서 풀어도 되고, 인쇄해서 풀어도 돼요. 어려우면 <b>유사 문제 풀기</b>.`
    : slide.kind === "homework"
      ? "칠판에 적힌 대로 <b>인쇄해서</b> 집에서 풀고, 화면에서 <b>답과 풀이</b>를 확인해요."
      : slide.kind === "daily"
        ? `오늘 배운 것으로 <b>데일리 테스트 ${DAILY_COUNT}문제</b>. 다 풀고 채점하면 ○✕로 알려 줘요.`
        : `이 단원 <b>단원 평가 ${UNIT_TEST_COUNT}문제</b>예요. 다 풀고 채점하면 ○✕로 약점 유형을 알려 줘요.`;
  return `<div class="sd-work${slide.kind === "homework" ? " has-chalk" : ""}">
    ${slide.kind === "homework" ? chalkMarkup() : ""}
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
// spoken: 말풍선 글과 다르게 읽을 때(단원 평가 결과 — 약한 유형 이름은 말풍선에만)
function say(text, mood = "talk", voiceId = null, spoken = text) {
  lastLine = [spoken, mood, voiceId];
  $("guideSay").textContent = text;
  $("talk").dataset.mood = mood;
  $("walkerImg").src = `./${PORTRAIT[mood] || PORTRAIT.talk}`;
  presenter?.mood(mood);
  const bubble = $("talk");
  bubble.classList.remove("new"); void bubble.offsetWidth; bubble.classList.add("new");
  return speak(spoken, voiceId);
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
// 말하는 중인지 알리는 곳(오른쪽 독쌤이 입을 움직인다) — info: { text, audio(복제 음성) | start·charIndex(기기 음성) }
const talkWatchers = new Set();
let talkingNow = null;
const setTalking = (info) => { talkingNow = info; talkWatchers.forEach((fn) => fn(info)); };
function stopClone() { if (cloneAudio) { try { cloneAudio.pause(); } catch {} cloneAudio = null; } const end = cloneEnd; cloneEnd = null; end?.(); }
// 말이 끝나면(소리가 꺼져 있으면 읽을 만한 시간이 지나면) 풀리는 Promise. 기기 음성이 끝을 알리지 않는 경우를 대비해 최대 시간도 둔다.
// 새 말이 오면 앞의 말은 끊고 바로 풀린다. 복제 음성 파일을 찾는 사이(await)에 새 말이 왔으면 앞의 말은 아예 틀지 않는다 — 안 그러면 두 목소리가 겹친다.
function speak(text, voiceId = null) {
  const reading = Math.min(7000, Math.max(900, String(text || "").length * 75));
  const seq = ++speakSeq;
  return new Promise(async (resolve) => {
    let done = false; const finish = () => { if (!done) { done = true; if (seq === speakSeq) setTalking(null); resolve(); } };
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
          setTalking({ text, audio });
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
      utterance.onend = finish; utterance.onerror = finish; const info = { text, start: 0, charIndex: 0 };
      utterance.onstart = () => { if (seq === speakSeq) { info.start = performance.now(); setTalking(info); } };
      utterance.onboundary = (event) => { info.charIndex = event.charIndex || info.charIndex; info.at = performance.now(); };
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
      const line = testResultLine(event.data.total, weak.length ? Math.min(event.data.right, event.data.total - 1) : event.data.total);
      say(weak.length ? `${event.data.total}문제 중 ${event.data.right}문제 맞았어요. ${weak.slice(0, 2).join(", ")}${weak.length > 2 ? ` 말고도 ${weak.length - 2}가지` : ""} 유형이 약해요. 약점 유형 공부하기를 눌러 다시 풀어 봐요.` : line.text, weak.length ? "think" : "praise", line.id, line.text);
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

// ── 판서 오른쪽 독쌤(모든 판서에 기본, 원장 2026-10-29 「전체 판서에 기본으로 켜줘」 · 예전 모양은 &look=plain) ─────
// 원장 2026-10-29 「필기 개념 이런 식으로 · 오른쪽에 독쌤을」「입이 더 움직이고 표정과 행동도 바뀌고 살아 있는 것처럼」.
// 수학 독쌤 그림 10장(assets/docssam-math/, 같은 틀로 잘라 몸이 흔들리지 않는다): 입 A1 다묾 · A2 반 · A3 벌림 · A4 오 · A5 눈 감기,
// 표정 B1 손가락(가리킴·놀람) · B2 갸웃(생각) · B3 미소(칭찬) · B4 격려 · B5 엄지 척. 움직이는 법은 사이언스 랩 독쌤(스킬 docssam-talking-guide)을 따른다:
//  · 입은 소리가 나는 동안에만, 지금 읽는 글자의 모음으로(ㅏㅓ류 벌림 · ㅗㅜ류 오 · 나머지 반), 1초에 12번, 세 번에 한 번은 다문다
//  · 몸은 CSS 움직임만: 가만히 숨쉬기 · 말할 때 끄덕이며 기울기 · 칭찬 깡충 · 놀람 움찔 · 격려 끄덕 · 생각 기울기 · 가리킬 때 앞으로
//  · 말 첫머리에 글에 맞는 몸짓을 잠깐(「봐요」 가리킴, 물음 갸웃, 「잘했어요」 깡충+엄지, 「해 봐요」 격려) 한 뒤 말하는 얼굴로
//  · 오래 가만히 있으면 가끔 끄덕이거나 갸웃한다. 움직임 줄이기 설정이면 몸은 가만히, 얼굴만 바뀐다.
const LOOK = params.get("look") === "plain" ? "" : "sketch";
const FACE = (name) => `./assets/docssam-math/${name}.webp`;
const FACES = { closed: "A1-mouth-closed", half: "A2-mouth-half", open: "A3-mouth-open", o: "A4-mouth-o", blink: "A5-eyes-closed", point: "B1-surprised", think: "B2-puzzled-thinking", smile: "B3-praise", cheer: "B4-encourage", thumbs: "B5-happy-thumbs-up" };
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function mouthFor(ch) {
  const c = (ch || " ").charCodeAt(0) - 0xac00; if (c < 0 || c > 11171) return null;
  const j = Math.floor(c / 28) % 21;
  return [0, 2, 4, 6, 9, 14].includes(j) ? "open" : [8, 12, 13, 17].includes(j) ? "o" : "half";
}
// 말 첫머리 몸짓: 글과 기분(mood)으로 고른다 → [얼굴, 움직임, 길이 ms]
function gestureFor(text, mood) {
  const t = String(text || "");
  if (mood === "praise" || /맞았|정답이에요|잘했|훌륭|해냈|멋져/.test(t)) return ["thumbs", "hop", 1100];
  if (mood === "think" || /\?|볼까요|일까요|생각해/.test(t)) return ["think", "lean", 900];
  if (/해 봐요|할 수 있|천천히|다시/.test(t)) return ["cheer", "nod", 800];
  if (/봐요|보세요|여기|이제|먼저|짜잔/.test(t)) return ["point", "present", 800];
  return null;
}
let presenter = null;
function makePresenter() {
  const aside = document.createElement("aside");
  aside.className = "sd-presenter";
  aside.setAttribute("aria-hidden", "true");
  // 그림을 미리 다 불러 둔다(바꿔 낄 때 깜빡이지 않게)
  aside.innerHTML = `<span class="sd-pres-shadow"></span><div class="sd-pres-act"><div class="sd-pres-bob">${Object.values(FACES).map((name) => `<img src="${FACE(name)}" data-face="${name}" alt="" width="475" height="720" decoding="async" />`).join("")}</div></div>`;
  const act = aside.querySelector(".sd-pres-act");
  const imgs = new Map([...aside.querySelectorAll("img")].map((img) => [img.dataset.face, img]));
  let shown = "";
  const show = (key) => { const name = FACES[key] || key; if (name === shown) return; imgs.get(shown)?.classList.remove("on"); imgs.get(name)?.classList.add("on"); shown = name; };
  let mood = "talk", talk = null, gesture = null, gestureUntil = 0, lastText = "";
  let mouthTimer = 0, blinkTimer = 0, idleTimer = 0, calmTimer = 0, blinking = false, settled = "closed";
  const kick = (motion) => { if (!motion || reducedMotion) return; delete act.dataset.motion; void act.offsetWidth; act.dataset.motion = motion; };
  act.addEventListener("animationend", (event) => { if (/^sd-pres-(hop|shake|nod|present|lean-in)/.test(event.animationName)) delete act.dataset.motion; });
  // 지금 읽는 글자
  function charNow() {
    if (!talk) return "";
    const text = talk.text || "";
    if (talk.audio) {
      const a = talk.audio;
      if (!(a.duration > 0)) return "";
      return text[Math.min(text.length - 1, Math.floor((a.currentTime / a.duration) * text.length))];
    }
    // 기기 음성: 낱말 경계(charIndex)부터 1초에 약 7글자씩 나아간다고 보고 짐작
    const since = (performance.now() - (talk.at || talk.start || performance.now())) / 1000;
    return text[Math.min(text.length - 1, (talk.charIndex || 0) + Math.floor(since * 7))];
  }
  function render() {
    const now = performance.now();
    if (gesture && now < gestureUntil) { show(gesture); return; }
    gesture = null;
    if (talk) {
      const a = talk.audio;
      if (a && (a.paused || a.ended)) { show("closed"); return; }
      const t = a ? a.currentTime : (now - (talk.start || now)) / 1000;
      const m = Math.floor(t * 12) % 3 ? mouthFor(charNow()) : null;
      show(m || "closed");
      return;
    }
    show(blinking ? "blink" : settled);
  }
  function loop() { clearTimeout(mouthTimer); render(); if (talk || gesture) mouthTimer = setTimeout(loop, 80); }
  function blink() {
    clearTimeout(blinkTimer);
    blinkTimer = setTimeout(() => {
      if (!talk && !gesture && settled === "closed" && !reducedMotion) { blinking = true; render(); setTimeout(() => { blinking = false; render(); }, 140); }
      blink();
    }, 2600 + Math.random() * 2600);
  }
  // 오래 가만히 있으면 가끔 끄덕이거나 갸웃
  function idle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!talk && !gesture && settled === "closed") {
        const [face, motion, ms] = Math.random() < 0.5 ? ["cheer", "nod", 1200] : ["think", "lean", 1600];
        gesture = face; gestureUntil = performance.now() + ms; kick(motion); loop();
      }
      idle();
    }, 7000 + Math.random() * 5000);
  }
  const onTalk = (info) => {
    talk = info;
    aside.classList.toggle("talking", Boolean(info));
    if (info && info.text !== lastText) {
      lastText = info.text;
      const g = gestureFor(info.text, mood);
      if (g) { gesture = g[0]; gestureUntil = performance.now() + g[2]; kick(g[1]); }
    }
    if (!info) {
      // 말이 끝나면 기분에 맞는 얼굴로 쉬었다가 기본으로
      settled = mood === "praise" ? "smile" : mood === "think" ? "think" : "closed";
      clearTimeout(calmTimer);
      if (settled !== "closed") calmTimer = setTimeout(() => { settled = "closed"; render(); }, 2600);
    }
    loop();
  };
  talkWatchers.add(onTalk);
  // 처음엔 「자, 봐요」 하는 얼굴. 장 안내 말이 이미 나오고 있으면 바로 입을 움직인다
  if (talkingNow) onTalk(talkingNow); else { gesture = "cheer"; gestureUntil = performance.now() + 1200; kick("nod"); loop(); }
  blink(); idle();
  return {
    el: aside,
    mood(next) {
      mood = next || "talk";
      if (mood === "praise") { gesture = "thumbs"; gestureUntil = performance.now() + 1100; kick("hop"); }
      else if (mood === "think") { gesture = "think"; gestureUntil = performance.now() + 900; kick("lean"); }
      lastText = "";   // 새 말이면 첫머리 몸짓을 다시
      loop();
    },
    dispose() { [mouthTimer, blinkTimer, idleTimer, calmTimer].forEach(clearTimeout); talkWatchers.delete(onTalk); aside.remove(); }
  };
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
  const wrap = document.createElement("div");
  wrap.className = "sd-native";
  let host = wrap;
  // 판서 오른쪽에 독쌤 + 손그림 판서 틀(&look=plain이면 예전 모양)
  if (LOOK && game.board) {
    wrap.classList.add("has-presenter", `look-${LOOK}`);
    host = document.createElement("div");
    host.className = "sd-board-host";
    presenter = makePresenter();
    wrap.append(host, presenter.el);
    document.body.classList.add("has-presenter");
  }
  $("slideBody").replaceChildren(wrap);
  nativeGame = mod[game.mount](host, {
    // 말 끝을 기다릴 수 있게 Promise를 돌려준다(판서가 비트마다 기다린다). voiceId가 있으면 독쌤 복제 음성.
    // 장 안내 말(intro)이 끝난 뒤에 말한다 — 판서 첫 말이 안내 말을 끊거나 겹치지 않게
    // 게임은 id 없이 말한다 → 글로 id를 만들어 녹음을 찾는다(목록: tools/export-study-voice.mjs). 녹음이 없으면 기기 음성
    say: async (text, mood, voiceId) => { await intro; if (slides[index] !== slide) return; return say(text, mood, voiceId || (slide.kind === "game" && text ? voiceLine("game", text).id : null)); },
    board: game.board, lesson: slide.lesson,
    onDone: () => { if (game.doneSay !== null) { const done = game.doneSay ? voiceLine("game", game.doneSay) : FIXED_LINES.nativeDone; say(done.text, "praise", done.id); } auto(game.board ? 4000 : 2200); }
  });
  fitObserver.observe(wrap, { childList: true, subtree: true });
  requestAnimationFrame(fitNative);
}
function disposeNative() {
  fitObserver.disconnect(); try { nativeGame?.dispose(); } catch {} nativeGame = null;
  presenter?.dispose(); presenter = null; document.body.classList.remove("has-presenter");
}
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
  document.title = `${book.label} ${unitIndex + 1}단원 ${part}차시 · ${unit.label}`;
  $("eyebrow").textContent = `${book.label} ${unitIndex + 1}단원 · ${part}차시`;
  $("unitTitle").textContent = unit.label;
  $("studentName").textContent = student;
  $("backLink").href = link("start.html", { book: book.id, unit: String(unitIndex) });
}
// ── 그림 세계: 섬 다섯 개(그림 1672×941 안의 자리, %) ──
// 그림의 다섯 터(아래 왼쪽 → 위 오른쪽). 그림을 바꾸면 이 자리를 다시 잰다.
const ISLANDS = [[15, 78], [35.5, 55], [52, 38.5], [73.5, 33.5], [87.6, 15.5]];
const STATIONS = [["concept", "개념 배우기"], ["game", "게임하기"], ["bell", "워밍업"], ["board", "공부하기"], ["homework", "오늘의 과제"], ["daily", "데일리 테스트"], ["test", "단원 평가"], ["booktest", "권별 테스트"], ["end", "도착"]];
// 데일리 테스트·단원 평가·권별 테스트는 그 차시에 있을 때만(앞 차시는 데일리, 마지막 차시는 단원 평가)
const OPTIONAL = ["daily", "test", "booktest"];
const visibleStations = () => STATIONS.filter(([kind]) => !OPTIONAL.includes(kind) ? true : ready ? slides.some((slide) => slide.kind === kind) : kind === (part < parts ? "daily" : "test"));
const stationOf = (slide) => Math.max(0, visibleStations().findIndex(([kind]) => kind === slide.kind));
function renderSigns() {
  const slide = slides[index];
  const here = slide.kind === "cover" ? -1 : stationOf(slide);
  $("signs").innerHTML = visibleStations().map(([kind, label], k) => {
    const first = slides.findIndex((entry) => entry.kind === kind);
    const count = slides.filter((entry) => entry.kind === kind).length;
    const done = first >= 0 && first < index && here !== k;
    const state = here === k ? " is-on" : done ? " is-done" : "";
    const note = !ready || ["end", "homework", "daily", "test", "booktest"].includes(kind) ? "" : first < 0 ? "준비 중" : `${count}장`;
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
  if (slide.kind === "homework") return `${unitIndex + 1}단원 ${part}차시 · ${todayTypes().length}문제`;
  if (slide.kind === "daily") return `${unitIndex + 1}단원 ${part}차시 · ${DAILY_COUNT}문제`;
  if (slide.kind === "test") return `${unitIndex + 1}단원 평가 · ${UNIT_TEST_COUNT}문제`;
  if (slide.kind === "booktest") return `${book.label} 권별 테스트`;
  return slide.kind === "game" ? slide.title : slide.lesson.title;
}
function slideHead(slide) {
  if (slide.kind === "cover" || slide.kind === "end" || slide.kind === "booktest") return "";
  const label = slide.kind === "bell" ? bellLabel(slide) : PHASES[phaseNo(slide.kind) - 1][1];
  const title = slideTitle(slide);
  // 게임은 건너뛸 수 있다(원장 2026-10-29 「게임은 넘어갈 수 있고」) — 이어진 게임 장을 다 넘어 워밍업으로
  const skip = slide.kind === "game" ? `<button type="button" class="sd-skip" data-act="skip-games">게임 건너뛰기 ›</button>` : "";
  return `<p class="sd-kick"><span class="sd-kick-no">${stationOf(slide) + 1}</span>${label}${slide.of ? ` <em>${slide.of}</em>` : ""}<span id="slidePage" class="sd-page"></span>${skip}</p><h2>${esc(title)}</h2>`;
}
// 표지 공부 순서: 데일리 테스트·단원 평가·권별 테스트는 그 차시에 있는 것만
const planPhases = (counts) => PHASES.filter(([kind]) => !OPTIONAL.includes(kind) || (ready ? counts[kind] : kind === (part < parts ? "daily" : "test")));
function coverMarkup() {
  const counts = {
    concept: slides.filter((s) => s.kind === "concept").length,
    game: slides.filter((s) => s.kind === "game").length,
    bell: slides.filter((s) => s.kind === "bell").reduce((sum, s) => sum + s.lesson.original.items.length, 0),
    board: slides.filter((s) => s.kind === "board").reduce((sum, s) => sum + s.block.numbers.length, 0),
    homework: slides.some((s) => s.kind === "homework") ? todayTypes().length : 0,
    daily: slides.some((s) => s.kind === "daily") ? DAILY_COUNT : 0,
    test: slides.some((s) => s.kind === "test") ? UNIT_TEST_COUNT : 0,
    booktest: slides.some((s) => s.kind === "booktest") ? book.source.unitTestQuestions.length : 0
  };
  const note = { concept: `${counts.concept}개 개념`, game: `${counts.game}개 게임`, bell: `${counts.bell}문제`, board: `본책 ${counts.board}문제`, homework: `${counts.homework}문제 · 집에서`, daily: `${counts.daily}문제 · ○✕`, test: `${counts.test}문제 · ○✕ 진단`, booktest: `${counts.booktest}문제` };
  return `<div class="sd-cover">
    <p class="sd-cover-kick">${esc(book.label)} ${unitIndex + 1}단원 · ${part}차시${parts > 1 ? ` <small>(${parts}차시 중)</small>` : ""}</p>
    <h1>${esc(unit.label)}</h1>
    <p class="sd-cover-lead">섬을 따라 한 곳씩 가 봐요.</p>
    <ol class="sd-plan" style="--n:${planPhases(counts).length}">${planPhases(counts).map(([kind, label], k) => `<li class="${ready && !counts[kind] ? "is-empty" : ""}"><b>${k + 1}</b><span>${label}</span><small>${ready ? counts[kind] ? note[kind] : "준비 중" : "불러오는 중…"}</small></li>`).join("")}</ol>
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
function endMarkup() {
  const lastPart = part >= parts;
  const result = testResult(lastPart ? testId : dailyId);
  const nextLink = !lastPart
    ? `<a class="sd-btn primary" href="${esc(link("study.html", { book: book.id, unit: String(unitIndex), part: String(part + 1) }))}">다음 · ${unitIndex + 1}단원 ${part + 1}차시 시작하기 ›</a>`
    : !lastUnit
      ? `<a class="sd-btn primary" href="${esc(link("study.html", { book: book.id, unit: String(unitIndex + 1), part: "1" }))}">다음 · ${unitIndex + 2}단원 1차시 시작하기 ›</a>`
      : `<a class="sd-btn primary" href="${esc(link("unit-test-viewer.html", { book: book.id }))}">${esc(book.label)} 권별 테스트 ›</a>`;
  return `<div class="sd-cover sd-end">
    <span class="sd-medal" aria-hidden="true">✓</span>
    <h1>${lastPart ? `${unitIndex + 1}단원 공부를 마쳤어요!` : `${unitIndex + 1}단원 ${part}차시를 마쳤어요!`}</h1>
    <p class="sd-cover-lead">${esc(unit.label)}${result ? ` · ${lastPart ? "단원 평가" : "데일리 테스트"} ${result.right} / ${result.total}` : ""}</p>
    <div class="sd-end-actions">
      ${nextLink}
      <a class="sd-btn" href="${esc(link("my-study.html", { book: book.id }))}">내 학습 상황</a>
      <a class="sd-btn" href="${esc(link("start.html", { book: book.id }))}">단원 고르기</a>
      <button type="button" class="sd-btn" data-act="restart">처음부터 다시 하기</button>
    </div>
  </div>`;
}
// 독쌤 말 { id, text } — id가 있으면 독쌤 복제 음성(없으면 기기 음성)
const lineFor = (slide) => slide.kind === "cover" && !ready ? FIXED_LINES.loading : slideLine(slide, { book, unitIndex, part, hasConcept: slides.some((entry) => entry.kind === "concept") });

const WORK_KINDS = ["board", "homework", "daily", "test"];
function show({ atEnd = false } = {}) {
  cancelAuto(); closeSheet(false); closeGate();
  const slide = slides[index];
  $("stage").dataset.kind = slide.kind;
  $("slideHead").innerHTML = slideHead(slide);
  $("slideHead").hidden = !$("slideHead").innerHTML;
  disposeNative();
  const native = Boolean(slide.native);
  const framed = !native && ["concept", "game", "bell"].includes(slide.kind);
  $("frameWrap").hidden = !framed;
  $("slideBody").hidden = framed;
  $("slideBody").innerHTML = slide.kind === "cover" ? coverMarkup() : WORK_KINDS.includes(slide.kind) ? workMarkup(slide) : slide.kind === "booktest" ? bookTestMarkup() : slide.kind === "end" ? endMarkup() : native ? '<p class="sd-wait">준비하고 있어요…</p>' : "";
  $("slideBody").classList.toggle("is-work", WORK_KINDS.includes(slide.kind));
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
  if (ready && ["test", "booktest"].includes(slide.kind)) openGate(slide);
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
  const line = sheetLine(ref);
  say(line.text, "think", line.id);
}
function closeSheet(talk = true) {
  if ($("sheet").hidden) return;
  const weak = $("sheet").dataset.weak === "1";
  $("sheet").hidden = true;
  delete $("sheet").dataset.weak;
  $("sheetClose").textContent = "‹ 본책 번호판";
  $("sheetFrame").removeAttribute("src");
  if (talk) { const back = weak ? FIXED_LINES.gateBack : SHEET_BACK; say(back.text, "talk", back.id); }
}
$("sheetClose").addEventListener("click", () => closeSheet());

// ── 평가 전 팝업: 약점 유형 누적(원장 2026-10-29) ─────────────
// 단원 평가 장: 이 단원 데일리 테스트(앞 차시들) 결과와 약점 유형. 권별 테스트 장: 이 권의 데일리·단원 평가 약점 유형을 모두.
// 「약점 유형 먼저 공부하기」 → 유형마다 2문제(문제은행 학생 화면)를 덱 위 창에 띄운다. 닫으면 그 장에서 시작한다.
const gateShown = new Set();
function weakSummary(kind) {
  const rows = [];
  const units = kind === "booktest" ? book.units.map((_, k) => k) : [unitIndex];
  for (const k of units) {
    const count = sessionCount(book.units[k]);
    for (let d = 1; d < count; d += 1) { const r = readRecord(student, "test", `${book.id}-u${k}-d${d}`); if (r?.marked) rows.push({ label: `${k + 1}단원 ${d}차시 데일리`, ...r, unit: k }); }
    if (kind === "booktest") { const r = readRecord(student, "test", `${book.id}-u${k}`); if (r?.marked) rows.push({ label: `${k + 1}단원 평가`, ...r, unit: k }); }
  }
  const tally = new Map();
  for (const row of rows) for (const typeId of row.weak || []) { const had = tally.get(typeId) || { typeId, unit: row.unit, n: 0 }; had.n += 1; tally.set(typeId, had); }
  return { rows, weak: [...tally.values()].sort((a, b) => b.n - a.n) };
}
function openGate(slide) {
  const { rows, weak } = weakSummary(slide.kind);
  if (!rows.length || gateShown.has(index)) return;
  gateShown.add(index);
  const line = slide.kind === "booktest" ? FIXED_LINES.gateBook : FIXED_LINES.gateTest;
  const what = slide.kind === "booktest" ? "권별 테스트" : "단원 평가";
  const gate = document.createElement("div");
  gate.className = "sd-gate"; gate.setAttribute("role", "dialog"); gate.setAttribute("aria-label", `${what} 전에`);
  gate.innerHTML = `<div class="sd-gate-card">
    <p class="sd-gate-kick">${what}를 보기 전에</p>
    <h3>${weak.length ? `약점 유형 ${weak.length}가지` : "지난 테스트 결과"}</h3>
    <ul class="sd-gate-results">${rows.map((row) => `<li><span>${esc(row.label)}</span><b>${row.right} / ${row.total}</b></li>`).join("")}</ul>
    ${weak.length ? `<ol class="sd-gate-weak">${weak.slice(0, 8).map((row) => `<li>${esc(typeById(row.typeId)?.label || row.typeId)}${row.n > 1 ? ` <small>✕ ${row.n}번</small>` : ""}</li>`).join("")}</ol>` : `<p class="sd-gate-clear">약점 유형이 없어요. 바로 봐도 좋아요.</p>`}
    <div class="sd-gate-actions">${weak.length ? `<button type="button" class="sd-btn primary" data-gate="study">약점 유형 먼저 공부하기 · ${Math.min(weak.length, 8) * 2}문제</button>` : ""}<button type="button" class="sd-btn" data-gate="go">${weak.length ? "바로" : ""} ${what} 보기 ›</button></div>
  </div>`;
  $("stage").append(gate);
  say(line.text, "think", line.id);
  gate.addEventListener("click", (event) => {
    const act = event.target.closest("[data-gate]")?.dataset.gate;
    if (!act) return;
    gate.remove();
    if (act === "study") openWeakSheet(weak.slice(0, 8));
  });
}
function closeGate() { document.querySelectorAll(".sd-gate").forEach((gate) => gate.remove()); }
function openWeakSheet(weak) {
  const picks = weak.flatMap((row) => [0, 1].map(() => [row.typeId, "practice", "약점 유형", row.unit ?? ""].join("~"))).join("|");
  $("sheetTitle").textContent = `약점 유형 다시 공부하기 · ${weak.length}유형`;
  $("sheetClose").textContent = "‹ 다 했어요";
  $("sheetFrame").src = link("index.html", { mode: "curriculum", book: book.id, picks, build: "1", as: "student", embed: "1", title: "약점 유형 다시 공부하기" });
  $("sheet").hidden = false;
  $("sheet").dataset.weak = "1";
  $("sheetClose").focus({ preventScroll: true });
}

// ── 조작 ──────────────────────────────────────────────────
$("nextBtn").addEventListener("click", next);
$("prevBtn").addEventListener("click", prev);
$("firstBtn").addEventListener("click", () => { cancelAuto(); closeSheet(false); go(0); });
// 게임 건너뛰기: 이어진 게임 장을 모두 넘는다
function skipGames() {
  cancelAuto();
  let target = index;
  while (slides[target]?.kind === "game") target += 1;
  go(target);
}
$("slideHead").addEventListener("click", (event) => { if (event.target.closest("[data-act='skip-games']")) skipGames(); });
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
// 열리지 않은 권·단원이면 덱 대신 안내(둘러보기 1권 1단원 · 체험 시작 권 · 정식 한 달에 1권, fields-access.js)
const gate = canStudy(book.id, unitIndex);
if (!gate.ok) lockPage(gate.why, { bookId: book.id, student, here: `study.html${location.search}` });
else {
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
}
