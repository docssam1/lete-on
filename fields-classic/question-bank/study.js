import { CURRICULUM } from "./source-data.js?v=20260918a";
import { unitParts, partProblems, lessonsByUnit, lessonsByPart, loadGoldenBell, GEOMETRY_GAMES, geometryGameUrl } from "./study-map.js?v=20261024c";

// 학생용 단원 공부 — 사이언스 랩 「스스로 공부하기」처럼 한 장씩 넘기는 덱이다(원장 2026-10-24: 「아래로 내려가며 공부하는 게 아니라」).
//  표지 → ① 개념 배우기(골든벨 개념, 덩어리마다 한 장) → ② 게임하기 → ③ 골든벨 → ④ 공부하기(본책 번호판, 묶음마다 한 장) → 끝
//  · 골든벨 화면은 덱 안의 창 하나(golden-bell.html?embed=1)를 계속 쓰고, 장이 바뀌면 postMessage로 그 장의 학습만 연다.
//    「다음」은 그 창 안의 장(개념 덩어리)을 먼저 넘기고, 끝이면 덱의 다음 장으로 간다.
//  · 게임을 마치거나 골든벨 문항을 다 풀면 독쌤이 칭찬하고 저절로 다음 장으로 간다(「넘김 멈춤」으로 끈다).
//  · 본책 번호를 누르면 같은 유형의 유사문제가 이 장 위에 뜬다(문제은행 학생 화면, embed). 닫으면 번호판으로 돌아온다.
//  · 독쌤 말은 글이 원본이고, 음성은 기기 음성(ko-KR)으로 읽는다. 소리 없이 입을 움직이는 그림은 쓰지 않는다(표정 3장만 바꿔 끼움).
//  · 화면은 밝은 그림 세계 위의 카드다(원장: 「밝아야 돼. 이런 배너 틀 안에 학습이 되도록」). 다섯 섬 = 개념 · 게임 · 골든벨 · 공부하기 · 완료.
//    장이 바뀌면 지도가 그 섬으로 옮겨 가고 독쌤이 걸어가며, 카드는 섬의 반대쪽에 선다.
//  · 게임하기에는 주제가 같은 기하 게임(geometry/games)을 먼저 넣는다(원장: 「지오메트리 쪽 봐 봐」, 짝은 study-map.js GEOMETRY_GAMES).
// 주소: ?book=book-01&unit=0&part=1&s=장번호&student=…   차시 나누기 규칙은 study-map.js

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const book = CURRICULUM.find((entry) => entry.id === params.get("book")) || CURRICULUM[0];
const unitIndex = Math.min(Math.max(Number(params.get("unit")) || 0, 0), book.units.length - 1);
const unit = book.units[unitIndex];
const { count: partCount } = unitParts(unit);
const part = Math.min(Math.max(Number(params.get("part")) || 1, 1), partCount);
const seenKey = `fields-classic-study-seen:${student}:${book.id}:${unitIndex}`;
const seen = (() => { try { return new Set(JSON.parse(localStorage.getItem(seenKey) || "[]")); } catch { return new Set(); } })();
const prefKey = "fields-classic-study-pref";
const pref = (() => { try { return { sound: true, paused: false, ...JSON.parse(localStorage.getItem(prefKey) || "{}") }; } catch { return { sound: true, paused: false }; } })();
const savePref = () => { try { localStorage.setItem(prefKey, JSON.stringify(pref)); } catch {} };

const link = (page, entries) => `./${page}?${new URLSearchParams({ student, ...entries })}`;
const PHASES = [
  ["concept", "개념 배우기"],
  ["game", "게임하기"],
  ["bell", "골든벨"],
  ["board", "공부하기"]
];
const phaseNo = (kind) => PHASES.findIndex(([id]) => id === kind) + 1;

let slides = [{ kind: "cover" }];
let index = 0;
let ready = false;
let bellData = null;

// ── 장 만들기 ─────────────────────────────────────────────
function buildSlides() {
  const bellBook = bellData?.books.find((entry) => entry.id === book.id);
  const lessons = bellData ? lessonsByPart(unit, lessonsByUnit(book, bellBook).units[unitIndex])[part - 1] : [];
  const list = [{ kind: "cover" }];
  for (const lesson of lessons) list.push({ kind: "concept", lesson });
  const geoSeen = new Set();
  for (const lesson of lessons) {
    for (const [id, title, query] of GEOMETRY_GAMES[`${book.id}/${lesson.id}`] || []) {
      if (geoSeen.has(id + query)) continue;
      geoSeen.add(id + query);
      list.push({ kind: "game", lesson, geo: geometryGameUrl(id, query), title });
    }
  }
  for (const lesson of lessons) {
    const flow = bellData.games.flows[`${book.id}/${lesson.id}`];
    if (flow?.game) list.push({ kind: "game", lesson, game: flow.game, title: bellData.games.flowTitles[flow.game] || "게임" });
    for (const [id, activity] of Object.entries(bellData.games.activities)) {
      if (activity.lesson === lesson.id && bellData.games.handsOnBooks.get(id) === book.id && id !== flow?.game) list.push({ kind: "game", lesson, game: id, title: activity.title });
    }
  }
  for (const lesson of lessons) if (lesson.original?.items?.length) list.push({ kind: "bell", lesson });
  for (const block of partProblems(unit, part)) list.push({ kind: "board", block });
  list.push({ kind: "end" });
  // 같은 종류가 여러 장이면 「2 / 3」을 붙인다
  for (const [kind] of PHASES) {
    const same = list.filter((slide) => slide.kind === kind);
    same.forEach((slide, k) => { slide.of = same.length > 1 ? `${k + 1} / ${same.length}` : ""; });
  }
  return list;
}

// ── 독쌤 ─────────────────────────────────────────────────
const PORTRAIT = { talk: "docssam-guide.webp", think: "docssam-thinking.webp", praise: "docssam-praise.webp" };
let lastLine = null;
function say(text, mood = "talk") {
  lastLine = [text, mood];
  $("guideSay").textContent = text;
  $("guideSayBar").textContent = text;
  $("talk").dataset.mood = mood;
  $("walkerImg").src = `./${PORTRAIT[mood] || PORTRAIT.talk}`;
  const bubble = $("talk");
  bubble.classList.remove("new"); void bubble.offsetWidth; bubble.classList.add("new");
  speak(text);
}
function speak(text) {
  if (typeof speechSynthesis === "undefined") return;
  try {
    speechSynthesis.cancel();
    if (!pref.sound) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const ko = (speechSynthesis.getVoices() || []).find((voice) => /^ko/i.test(voice.lang));
    utterance.lang = "ko-KR"; utterance.rate = 0.95; if (ko) utterance.voice = ko;
    speechSynthesis.speak(utterance);
  } catch {}
}
function paintGuideButtons() {
  $("voiceBtn").textContent = pref.sound ? "🔊" : "🔇";
  $("voiceBtn").setAttribute("aria-pressed", String(pref.sound));
  $("pauseBtn").textContent = pref.paused ? "▶" : "⏸";
  $("pauseBtn").title = pref.paused ? "다음 장으로 저절로 넘어가기 켜기" : "저절로 넘어가기 멈추기";
  $("pauseBtn").setAttribute("aria-pressed", String(pref.paused));
}
$("voiceBtn").addEventListener("click", () => { pref.sound = !pref.sound; savePref(); paintGuideButtons(); if (pref.sound && lastLine) speak(lastLine[0]); else speak(""); });
$("againBtn").addEventListener("click", () => { if (lastLine) { pref.sound = true; savePref(); paintGuideButtons(); speak(lastLine[0]); } });
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
    say(slide.kind === "bell" ? "골든벨 문제를 다 풀었어! 정말 잘했어. 다음으로 넘어가자." : "게임을 끝까지 해냈어! 이제 다음으로 가자.", "praise");
    auto(2600);
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

// ── 기하 게임 창 ──────────────────────────────────────────
// 기하 게임은 제 화면 그대로 띄우고, 제 허브(놀이터)로 돌아가는 단추만 감춘다 — 돌아가기는 덱이 맡는다.
function openGeometry(slide) {
  const frame = $("geoFrame");
  const url = new URL(slide.geo, location.href).href;
  if (frame.src !== url) frame.src = url;
}
$("geoFrame").addEventListener("load", () => {
  try {
    const doc = $("geoFrame").contentDocument;
    const style = doc.createElement("style");
    style.textContent = 'a[href^="../../"]{display:none!important}';
    doc.head.append(style);
  } catch {}
});

// ── 화면 ──────────────────────────────────────────────────
function renderHead() {
  document.title = `${book.label} ${unitIndex + 1}단원 ${part}차시 · ${unit.label}`;
  $("eyebrow").textContent = `${book.label} ${unitIndex + 1}단원 · ${part}차시`;
  $("unitTitle").textContent = unit.label;
  $("studentName").textContent = student;
  $("backLink").href = link("start.html", { book: book.id });
}
// ── 그림 세계: 섬 다섯 개(그림 1672×941 안의 자리, %) ──
// 그림의 다섯 터(아래 왼쪽 → 위 오른쪽). 그림을 바꾸면 이 자리를 다시 잰다.
const ISLANDS = [[15, 78], [35.5, 55], [52, 38.5], [73.5, 33.5], [87.6, 15.5]];
const STATIONS = [["concept", "개념 배우기"], ["game", "게임하기"], ["bell", "골든벨"], ["board", "공부하기"], ["end", "완료"]];
const stationOf = (slide) => Math.max(0, STATIONS.findIndex(([kind]) => kind === slide.kind));
function renderSigns() {
  const slide = slides[index];
  const here = slide.kind === "cover" ? -1 : stationOf(slide);
  $("signs").innerHTML = STATIONS.map(([kind, label], k) => {
    const first = slides.findIndex((entry) => entry.kind === kind);
    const count = slides.filter((entry) => entry.kind === kind).length;
    const state = here === k ? " is-on" : first >= 0 && first < index ? " is-done" : "";
    const [x, y] = ISLANDS[k];
    const note = !ready ? "" : first < 0 ? "준비 중" : kind === "end" ? "" : `${count}장`;
    return `<button type="button" class="sd-sign${state}" style="--x:${x}%;--y:${y + 1.5}%" data-jump="${first}" ${first < 0 ? "disabled" : ""} ${here === k ? 'aria-current="step"' : ""}><b>${first >= 0 && first < index && here !== k ? "✓" : k + 1}</b>${label}${note ? ` <small>${note}</small>` : ""}</button>`;
  }).join("");
}
// 지도 옮기기: 지금 섬이 비어 있는 쪽(카드 반대쪽) 한가운데 오도록. 표지는 지도 전체를 보인다.
function placeWorld() {
  const slide = slides[index];
  const cover = slide.kind === "cover";
  const k = stationOf(slide);
  document.body.dataset.side = cover || slide.kind === "end" ? "cover" : k <= 1 ? "right" : "left";
  const phone = innerWidth <= 760;
  const zoom = cover ? 1 : phone ? 1.35 : 1.5;
  const H = Math.max(innerHeight, innerWidth * 941 / 1672) * zoom;
  const W = H * 1672 / 941;
  const win = $("window").getBoundingClientRect();
  const [sx, sy] = ISLANDS[cover ? 0 : k];
  let tx = win.left + win.width / 2 - (sx / 100) * W;
  let ty = win.top + win.height * (phone ? 0.78 : 0.62) - (sy / 100) * H;
  if (cover && !phone) { tx = (innerWidth - W) / 2; ty = innerHeight - H; }
  // 그림이 빈 데 없이 덮어야 하는 곳: 넓은 화면은 화면 전체, 휴대폰은 위쪽 지도 띠만(띠 아래는 카드가 덮는다)
  const box = phone ? { left: 0, top: 0, right: innerWidth, bottom: win.bottom } : { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
  tx = Math.min(box.left, Math.max(box.right - W, tx));
  ty = Math.min(box.top, Math.max(box.bottom - H, ty));
  const pan = $("pan");
  pan.style.width = `${W}px`; pan.style.height = `${H}px`;
  pan.style.transform = `translate(${Math.round(tx)}px, ${Math.round(ty)}px)`;
  $("walker").style.setProperty("--x", `${sx}%`);
  $("walker").style.setProperty("--y", `${sy}%`);
  // 말풍선: 독쌤 오른쪽 위(화면 안으로)
  const fx = tx + (sx / 100) * W, fy = ty + (sy / 100) * H;
  const talk = $("talk");
  const tw = talk.offsetWidth || 300, th = talk.offsetHeight || 90;
  // 표지에서는 하늘 쪽(왼쪽 위)에 — 섬 표지판을 가리지 않게
  let left = cover ? win.left + 8 : Math.min(Math.max(win.left + 8, fx + 56), win.right - tw - 8);
  let top = cover ? win.top + 8 : fy - th - 190;
  if (!cover && top < win.top + 8) {   // 위에 자리가 없으면(높은 섬) 독쌤 옆으로
    top = fy - th - 60;
    left = fx - tw - 70 >= 8 ? fx - tw - 70 : fx + 70;
  }
  top = Math.min(Math.max(win.top + 8, top), innerHeight - th - 90);
  talk.style.left = `${Math.round(left)}px`; talk.style.top = `${Math.round(top)}px`;
}
addEventListener("resize", () => placeWorld());

function slideHead(slide) {
  if (slide.kind === "cover" || slide.kind === "end") return "";
  const label = PHASES[phaseNo(slide.kind) - 1][1];
  const title = slide.kind === "board" ? `본책 ${slide.block.label}` : slide.kind === "game" ? slide.title : slide.lesson.title;
  return `<p class="sd-kick"><span class="sd-kick-no">${phaseNo(slide.kind)}</span>${label}${slide.of ? ` <em>${slide.of}</em>` : ""}<span id="slidePage" class="sd-page"></span></p><h2>${esc(title)}</h2>`;
}
function coverMarkup() {
  const counts = {
    concept: slides.filter((s) => s.kind === "concept").length,
    game: slides.filter((s) => s.kind === "game").length,
    bell: slides.filter((s) => s.kind === "bell").reduce((sum, s) => sum + s.lesson.original.items.length, 0),
    board: slides.filter((s) => s.kind === "board").reduce((sum, s) => sum + s.block.numbers.length, 0)
  };
  const note = { concept: `${counts.concept}개 개념`, game: `${counts.game}개 게임`, bell: `${counts.bell}문제`, board: `본책 ${counts.board}문제` };
  return `<div class="sd-cover">
    <p class="sd-cover-kick">${esc(book.label)} ${unitIndex + 1}단원 · ${part}차시${partCount > 1 ? ` · 모두 ${partCount}차시` : ""}</p>
    <h1>${esc(unit.label)}</h1>
    <p class="sd-cover-lead">섬을 따라 한 곳씩 가 봐요.</p>
    <ol class="sd-plan">${PHASES.map(([kind, label], k) => `<li class="${ready && !counts[kind] ? "is-empty" : ""}"><b>${k + 1}</b><span>${label}</span><small>${ready ? counts[kind] ? note[kind] : "준비 중" : "불러오는 중…"}</small></li>`).join("")}</ol>
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
  const next = part < partCount;
  return `<div class="sd-cover sd-end">
    <span class="sd-medal" aria-hidden="true">✓</span>
    <h1>${part}차시 완료!</h1>
    <p class="sd-cover-lead">${esc(unit.label)} ${part}차시 공부를 마쳤어요.</p>
    <div class="sd-end-actions">
      ${next ? `<a class="sd-btn primary" href="${esc(link("study.html", { book: book.id, unit: String(unitIndex), part: String(part + 1) }))}">${part + 1}차시 시작하기 ›</a>` : unitIndex + 1 < book.units.length ? `<a class="sd-btn primary" href="${esc(link("study.html", { book: book.id, unit: String(unitIndex + 1), part: "1" }))}">${unitIndex + 2}단원 시작하기 ›</a>` : ""}
      <a class="sd-btn" href="${esc(link("start.html", { book: book.id }))}">단원 고르기</a>
      <button type="button" class="sd-btn" data-act="restart">이 차시 처음부터</button>
    </div>
  </div>`;
}
function lineFor(slide) {
  if (slide.kind === "cover") return ready ? `오늘은 ${unit.label} ${part}차시야. 개념을 배우고, 게임으로 익히고, 골든벨을 풀고, 본책을 풀 거야. 시작하기를 눌러 봐.` : "공부할 것을 준비하고 있어. 잠깐만 기다려 줘.";
  if (slide.kind === "concept") return `${slide.lesson.title} 개념이야. 한 장씩 천천히 보고 다음을 눌러.`;
  if (slide.kind === "game") return slide.geo ? `${slide.title}에 왔어. 배운 것을 직접 해 보자. 다 하면 다음을 눌러.` : `${slide.title} 게임이야. 개념에서 본 풀이 순서대로 손으로 직접 해 봐.`;
  if (slide.kind === "bell") return "골든벨 문제야. 개념에서 배운 대로 한 문제씩 풀어 봐.";
  if (slide.kind === "board") return `본책 ${slide.block.label}을 펴서 풀어 봐. 모르는 번호를 누르면 비슷한 문제가 나와.`;
  return `${part}차시 끝! 오늘 정말 잘했어.`;
}

function show({ atEnd = false } = {}) {
  cancelAuto(); closeSheet(false);
  const slide = slides[index];
  $("stage").dataset.kind = slide.kind;
  $("slideHead").innerHTML = slideHead(slide);
  $("slideHead").hidden = !$("slideHead").innerHTML;
  const geo = Boolean(slide.geo);
  const framed = !geo && ["concept", "game", "bell"].includes(slide.kind);
  $("frameWrap").hidden = !framed;
  $("geoWrap").hidden = !geo;
  $("slideBody").hidden = framed || geo;
  $("slideBody").innerHTML = slide.kind === "cover" ? coverMarkup() : slide.kind === "board" ? boardMarkup(slide.block) : slide.kind === "end" ? endMarkup() : "";
  if (framed) openInFrame(slide, atEnd);
  if (geo) openGeometry(slide); else if ($("geoFrame").getAttribute("src")) $("geoFrame").removeAttribute("src");
  $("prevBtn").disabled = index === 0;
  $("nextBtn").disabled = !ready || index === slides.length - 1;
  $("nextBtn").querySelector(".sd-next-text").textContent = slide.kind === "cover" ? "출발하기 →" : "다음 →";
  $("count").textContent = `${index + 1} / ${slides.length}`;
  renderSigns();
  placeWorld();
  say(lineFor(slide), slide.kind === "end" ? "praise" : "talk");
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
  if (["concept"].includes(slides[index].kind) && frameReady) { askFrame("next"); return; }
  go(index + 1);
}
function prev() {
  cancelAuto();
  if (!$("sheet").hidden) { closeSheet(); return; }
  if (["concept"].includes(slides[index].kind) && frameReady) { askFrame("prev"); return; }
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
  say(`${ref}과 같은 유형의 문제야. 이걸 먼저 풀고 나서 본책 문제를 다시 풀어 봐.`, "think");
}
function closeSheet(talk = true) {
  if ($("sheet").hidden) return;
  $("sheet").hidden = true;
  $("sheetFrame").removeAttribute("src");
  if (talk) say("좋아. 이제 본책으로 돌아가서 그 문제를 다시 풀어 봐.", "talk");
}
$("sheetClose").addEventListener("click", () => closeSheet());

// ── 조작 ──────────────────────────────────────────────────
$("nextBtn").addEventListener("click", next);
$("prevBtn").addEventListener("click", prev);
$("signs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-jump]");
  if (button && !button.disabled) { cancelAuto(); go(Number(button.dataset.jump)); }
});
$("slideBody").addEventListener("click", (event) => {
  const number = event.target.closest(".sd-number");
  if (number) { openSheet(number); return; }
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

renderHead();
paintGuideButtons();
show();
loadGoldenBell().then((data) => {
  bellData = data;
  slides = buildSlides();
  ready = true;
  index = Math.min(Math.max((Number(params.get("s")) || 1) - 1, 0), slides.length - 1);
  show();
}).catch(() => {
  // 골든벨을 못 불러와도 본책 번호판은 쓸 수 있다
  bellData = null;
  slides = buildSlides();
  ready = true;
  index = Math.min(Math.max((Number(params.get("s")) || 1) - 1, 0), slides.length - 1);
  show();
  say("골든벨 학습을 불러오지 못했어. 본책 번호판은 쓸 수 있어. 새로고침하면 다시 불러와.", "think");
});
