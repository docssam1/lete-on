import { CURRICULUM } from "./source-data.js?v=20261101b";
import { lessonsByUnit, unitParts, partProblems, loadGoldenBell } from "./study-map.js?v=20261110h";
import { readRecord, weekRate, loggedIn, checkSession, loadLocalAll, loadRecords } from "./study-progress.js?v=20261029q";
import { canStudy, isPaid, lockCard, accessBanner, wireAccess } from "./fields-access.js?v=20261110f";
import { sessionLessons, sessionPrintHref } from "./study-deck.js?v=20261110h";
import { playIntro, bindPress } from "./study-motion.js?v=20261105a";

// 시작 화면(원장 2026-10-26): 「오늘 공부할 내용은?」 — 1~10권 → 누르면 그 권의 대단원 → 누르면 옆으로 밀려 소단원(차시).
// 한 번에 한 장만 보이고, 위의 길(1권 › 01 도형 움직이기)이나 「‹」로 앞 장으로 돌아간다. 브라우저 뒤로 가기도 앞 장으로.
// 권을 고르고 「공부하기」(대단원 → 차시 카드 → 차시 덱 study.html) 또는
// 「유사문제 만들기」(모르는 문제 유사문제 similar.html · 권별테스트 원문 풀기 · 권별테스트 유사문제)로 들어간다.
// 이 화면은 길 안내만 한다. 문제를 만들고 채점하는 일은 문제은행(index.html)과 골든벨(golden-bell.html)이 그대로 맡고,
// 여기서는 그 화면들이 받는 주소(book·lesson·phase·units·stage·count·set·build)만 만든다.
// 강사용 교안(?as=class, 대문 아래 작은 글자 — 원장 2026-11-10 「강사는 교안이 수업 흐름대로 되어야 하고」): 같은 권 → 대단원 → 차시 카드인데
// 잠금·기록·이어서 하기 없이 차시마다 「교안 열기」(study.html?as=class — 학생 차시 덱과 같은 차례)와 「교재 인쇄」만 둔다.
// 설계: PROGRAM-STRUCTURE-20261024.md

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const hasBook = CURRICULUM.some((book) => book.id === params.get("book"));
const view = {
  bookId: hasBook ? params.get("book") : CURRICULUM[0].id,
  step: hasBook ? (params.get("unit") !== null && params.get("door") !== "test" ? 2 : 1) : 0,
  unit: Math.max(0, Number(params.get("unit")) || 0),
  door: params.get("door") === "test" ? "test" : "study",
  // 학생·학부모 화면은 늘 스스로 공부(self). 수업용(class)은 대문 아래 「강사용 교안」(?as=class)으로만 들어온다
  // (원장 2026-11-10 「강사용은 그냥 판서 수업용 · 학생은 스스로 공부하도록 돕는 거고」) — 화면에서 고르지 않는다.
  mode: params.get("as") === "class" ? "class" : "self"
};
let goldenBell = null; // { books, flows, flowTitles, activities } — 크기가 커서 첫 화면을 그린 뒤 불러온다
let bellReady = null;  // 그 불러오기 Promise(교재 인쇄 주소를 만들 때 기다린다)

function link(page, entries) {
  const url = new URLSearchParams({ student, ...entries });
  return `./${page}?${url}`;
}
const bankLink = (entries) => link("index.html", { mode: "curriculum", book: view.bookId, ...entries });
// 수업(선생님 화면)에서 여는 워밍업은 수업 화면(as=class: 큰 글씨·화면에 맞게)
const bellLink = (entries) => link("golden-bell.html", { book: view.bookId, ...(view.mode === "class" ? { as: "class" } : {}), ...entries });
const activeBook = () => CURRICULUM.find((book) => book.id === view.bookId);

function syncAddress(push = false) {
  const next = new URLSearchParams(location.search);
  if (view.step >= 1) next.set("book", view.bookId); else next.delete("book");
  if (view.step === 2) next.set("unit", String(view.unit)); else next.delete("unit");
  if (view.door === "test") next.set("door", "test"); else next.delete("door");
  if (view.mode === "class") next.set("as", "class"); else next.delete("as");
  const query = next.toString();
  history[push ? "pushState" : "replaceState"]({ step: view.step }, "", query ? `?${query}` : location.pathname);
}

// ── 한 장씩 넘기기: 권 → 대단원 → 소단원 ──
let shownStep = -1;
function showStep() {
  const book = activeBook();
  if (view.unit >= book.units.length) view.unit = 0;
  document.querySelectorAll(".st-pane").forEach((pane) => {
    const on = Number(pane.dataset.step) === view.step;
    pane.hidden = !on;
    if (on && shownStep >= 0 && shownStep !== view.step) {
      pane.classList.remove("slide-fwd", "slide-back"); void pane.offsetWidth;
      pane.classList.add(view.step > shownStep ? "slide-fwd" : "slide-back");
    }
  });
  shownStep = view.step;
  const unit = book.units[view.unit];
  const crumbs = [`<button type="button" data-go="0"${view.step === 0 ? ' aria-current="page"' : ""}>교재</button>`];
  if (view.step >= 1) crumbs.push(`<button type="button" data-go="1"${view.step === 1 ? ' aria-current="page"' : ""}>${esc(book.label)}</button>`);
  if (view.step === 2) crumbs.push(`<button type="button" data-go="2" aria-current="page">${String(view.unit + 1).padStart(2, "0")} ${esc(unit.label)}</button>`);
  $("crumbs").innerHTML = crumbs.join('<span aria-hidden="true">›</span>');
  if (view.step === 0) { renderBooks(); renderQuick(); }
  else if (view.step === 1) renderDoors();
  else renderParts();
}
function go(step, push = true) {
  view.step = step;
  showStep();
  syncAddress(push);
  window.scrollTo({ top: 0 });
}

// 골든벨 학습을 단원에 나눠 담는 규칙은 study-map.js(학생 차시 화면과 같이 쓴다).
const isClass = () => view.mode === "class";
// 수업용은 회원 잠금에 걸리지 않는다(fields-access.js 머리말)
const gateOf = (bookId, unit) => isClass() ? { ok: true, who: {} } : canStudy(bookId, unit);

// ── 권 고르기 ──
function renderBooks() {
  // 열리지 않은 권(둘러보기·체험·정식의 범위 밖)은 「잠김」 표시 — 눌러 들어가면 단원 장에서 안내한다(fields-access.js)
  $("bookList").innerHTML = CURRICULUM.map((book) => {
    const gate = gateOf(book.id);
    const mark = gate.who.kind === "preview" && gate.ok ? `<em class="st-lock-tag is-open">1단원 둘러보기</em>` : gate.ok ? "" : `<em class="st-lock-tag">잠김</em>`;
    return `<button type="button" data-book="${book.id}" class="${[book.id === view.bookId && hasBook ? "was" : "", gate.ok ? "" : "is-locked"].filter(Boolean).join(" ")}">
    <b>${esc(book.label)}</b><span>${esc(book.title)}</span>${mark}<i aria-hidden="true">›</i></button>`;
  }).join("");
}

function renderDoors() {
  const book = activeBook();
  $("bookTitle").textContent = `${book.label} · ${book.title}`;
  for (const door of ["study", "test"]) {
    const tab = document.querySelector(`[data-door="${door}"]`);
    tab.setAttribute("aria-selected", String(view.door === door));
    $(`${door}Panel`).hidden = view.door !== door;
  }
  if (view.door === "study") renderStudy(); else renderTest();
}

// ── 공부하기 ──
// 학습형(학생): 원장 지시(2026-10-24) 「학생용은 우선 권 단원 고르기. 1단원을 2번 정도로 나누어 공부」 —
// 대단원을 누르면 그 단원의 차시(소단원) 장으로 넘어가고, 차시 안에서 개념 배우기 → 게임하기 → 골든벨 → 공부하기(study.html).
const problemCount = (unit, part) => partProblems(unit, part).reduce((sum, block) => sum + block.numbers.length, 0);
function renderSelfUnits(book) {
  $("unitList").innerHTML = `<div class="st-unit-cards">${book.units.map((unit, index) => {
    const { count } = unitParts(unit);
    const problems = Array.from({ length: count }, (_, k) => problemCount(unit, k + 1)).reduce((a, b) => a + b, 0);
    const key = `${book.id}-u${index}`, rate = isClass() ? 0 : weekRate(readRecord(student, "week", key), readRecord(student, "test", key));
    const test = isClass() ? null : readRecord(student, "test", key);
    const locked = !gateOf(book.id, index).ok;
    return `<button type="button" class="st-unit-card${locked ? " is-locked" : ""}" data-unit="${index}">${locked ? `<em class="st-lock-tag">잠김</em>` : ""}<span class="st-unit-no">${String(index + 1).padStart(2, "0")}</span><b>${esc(unit.label)}</b><small>${count}차시 · 본책 ${problems}문항 · 단원 평가</small>${rate ? `<span class="st-unit-rate" style="--rate:${rate}%"><em>수행률 ${rate}%</em>${test?.marked ? `<em>단원 평가 ${test.right}/${test.total}</em>` : ""}</span>` : ""}<i aria-hidden="true">›</i></button>`;
  }).join("")}${!isClass() && book.source.unitTestQuestions?.length && canStudy(book.id, book.units.length - 1).ok ? `<a class="st-unit-card st-book-test" href="${esc(link("unit-test-viewer.html", { book: book.id }))}"><span class="st-unit-no">✓</span><b>${esc(book.label)} 권별 테스트</b><small>${book.units.length}단원을 마치면 · ${book.source.unitTestQuestions.length}문제 · ○✕ 진단</small><i aria-hidden="true">›</i></a>` : ""}</div>`;
}
const studyLink = (bookId, unitIndex, part, last = 0) => link("study.html", { book: bookId, unit: String(unitIndex), part: String(part), ...(last ? { s: String(last) } : {}), ...(isClass() ? { as: "class" } : {}) });
// 한 차시 교재 인쇄 주소와 그 차시 학습 묶음 — 덱과 같은 것(study-deck.js sessionPrintHref · sessionLessons)
function sessionLinks(book, unitIndex, part) {
  return { bookPrint: sessionPrintHref(book, unitIndex, part, goldenBell, link), lessons: sessionLessons(book, unitIndex, goldenBell, part) };
}

// ── 학부모가 처음 와도 바로 시작하게(원장 2026-11-09 「처음부터 또는 진도 선택부터 유연하게 · 책 시작하는 처음에 교재를 인쇄하겠습니까」) ──
// 첫 장 맨 위에 세 갈래: 이어서 하기(공부 기록이 있으면) · 처음부터(또는 정해 둔 시작 진도) · 진도 골라 시작(아래 권 목록).
// 한 권을 처음 시작할 때 한 번만 「교재를 인쇄할까요?」를 묻고, 고른 답은 이 기기에 권마다 기억한다.
const PRINT_KEY = (bookId) => `gm-print-ask:${student}:${bookId}`;
function printPref(bookId, value) {
  try {
    if (value) localStorage.setItem(PRINT_KEY(bookId), value);
    return localStorage.getItem(PRINT_KEY(bookId)) || "";
  } catch { return value || ""; }
}
const bookById = (id) => CURRICULUM.find((book) => book.id === id);
const placeLabel = (book, unit, part) => `${book.label} ${unit + 1}단원 ${part}차시`;
// 이 학생의 차시 기록(kind week) — 처음엔 이 기기 것, 로그인했으면 서버 것까지 합쳐 다시 그린다
let weekRows = loadLocalAll().records.filter((row) => row.student_name === student && row.kind === "week")
  .map((row) => ({ key: row.record_key, payload: row.payload, at: String(row.updated_at || "") }));
const startedBook = (bookId) => weekRows.some((row) => row.key.startsWith(`${bookId}-u`));
function latestPlace() {
  const row = [...weekRows].sort((a, b) => b.at.localeCompare(a.at))[0];
  const match = row && /^(book-\d+)-u(\d+)$/.exec(row.key);
  const book = match && bookById(match[1]);
  if (!book || !book.units[Number(match[2])]) return null;
  const unit = Number(match[2]), { count } = unitParts(book.units[unit]);
  const part = Math.min(Math.max(1, Number(row.payload?.part) || 1), count);
  return { book, unit, part, last: Number(row.payload?.last) || 1 };
}
function firstPlace() {
  const start = loggedIn()?.member?.start;
  const book = start?.book && bookById(start.book);
  if (book && book.units[Number(start.unit) || 0]) {
    const unit = Number(start.unit) || 0, { count } = unitParts(book.units[unit]);
    return { book, unit, part: Math.min(Math.max(1, Number(start.part) || 1), count), last: 0, chosen: true };
  }
  return { book: CURRICULUM[0], unit: 0, part: 1, last: 0, chosen: false };
}
function renderQuick() {
  $("quickStart").hidden = view.mode === "class";
  const now = latestPlace(), first = firstPlace();
  const cont = $("quickContinue");
  cont.hidden = !now;
  if (now) {
    cont.dataset.start = `${now.book.id}|${now.unit}|${now.part}|${now.last}`;
    cont.innerHTML = `<b>이어서 하기</b><span>${esc(placeLabel(now.book, now.unit, now.part))} · ${esc(now.book.units[now.unit].label)}</span>`;
  }
  const firstBtn = $("quickFirst");
  firstBtn.dataset.start = `${first.book.id}|${first.unit}|${first.part}|`;
  firstBtn.classList.toggle("is-main", !now);
  firstBtn.innerHTML = first.chosen
    ? `<b>정해 둔 진도부터</b><span>${esc(placeLabel(first.book, first.unit, first.part))} · ${esc(first.book.units[first.unit].label)}</span>`
    : `<b>처음부터 시작</b><span>1권 1단원 1차시 · ${esc(first.book.units[0].label)}</span>`;
  $("pickTitle").textContent = "권 고르기 · 권을 누르면 단원과 차시가 나와요";
}

// 차시 공부를 연다. 그 권을 처음 시작하고 아직 묻지 않았으면 「교재를 인쇄할까요?」를 먼저 묻는다.
let asking = null;
async function startSession(target) {
  const [bookId, unitText, partText, lastText] = String(target).split("|");
  const book = bookById(bookId), unit = Number(unitText) || 0, part = Number(partText) || 1, last = Number(lastText) || 0;
  if (!book) return;
  if (!gateOf(book.id, unit).ok) {   // 열리지 않은 진도 → 그 단원 장으로 가서 잠김 안내를 보여 준다
    view.bookId = book.id; view.unit = unit; view.door = "study";
    return go(2);
  }
  const href = studyLink(book.id, unit, part, last);
  if (view.mode === "class" || startedBook(book.id) || printPref(book.id)) return location.assign(href);
  try { await bellReady; } catch {}
  const links = goldenBell ? sessionLinks(book, unit, part) : null;
  if (!links) return location.assign(href);
  asking = { book, href, print: links.bookPrint };
  $("printAskText").textContent = `${book.label}을 처음 시작해요. 종이 교재를 인쇄해서 같이 공부할까요? 「인쇄하고 시작」을 누르면 ${unit + 1}단원 ${part}차시 교재가 새 창에 열리고, 이 창에서는 공부가 시작돼요.`;
  $("printAsk").showModal();
}
$("printAskYes").addEventListener("click", () => {
  if (!asking) return;
  printPref(asking.book.id, "print");
  window.open(asking.print, "_blank", "noopener");
  $("printAsk").close();
  location.assign(asking.href);
});
$("printAskNo").addEventListener("click", () => {
  if (!asking) return;
  printPref(asking.book.id, "screen");
  $("printAsk").close();
  location.assign(asking.href);
});
$("printAsk").addEventListener("close", () => { asking = null; });
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-start]");
  if (!target || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  event.preventDefault();
  startSession(target.dataset.start);
});
$("quickPick").addEventListener("click", () => {
  $("pickTitle").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  $("bookList").querySelector("button")?.focus({ preventScroll: true });
});

// 한 단원 = 차시 2번(원장 2026-10-29 「1단원을 2번으로 끊어 줘야 하고」): 대단원을 누르면 차시마다 공부 순서를 보여 주고
// 차시마다 「N차시 공부 시작하기」로 덱(study.html?part=N)을 연다.
function renderParts() {
  const book = activeBook(), unit = book.units[view.unit];
  $("unitTitle").innerHTML = `<span>${String(view.unit + 1).padStart(2, "0")}</span>${esc(unit.label)}`;
  const gate = gateOf(book.id, view.unit);
  if (!gate.ok) { $("partList").innerHTML = lockCard(gate.why, { bookId: book.id, here: "start.html" }); return; }
  const { count } = unitParts(unit);
  const last = view.unit === book.units.length - 1;
  // 강사용 교안은 학생 기록을 보지 않는다(점수·이어서 하기 없음)
  const week = isClass() ? null : readRecord(student, "week", `${book.id}-u${view.unit}`);
  const result = isClass() ? null : readRecord(student, "test", `${book.id}-u${view.unit}`);
  const sessions = Array.from({ length: count }, (_, k) => {
    const part = k + 1, lessons = goldenBell ? sessionLessons(book, view.unit, goldenBell, part) : [];
    const daily = part > 1 && !isClass() ? readRecord(student, "test", `${book.id}-u${view.unit}-d${part - 1}`) : null;
    const lastPart = part === count;
    // 2차시부터 맨 앞에 지난 차시 데일리 테스트(원장 2026-10-29 「데일리 테스트는 다음날이야」), 마지막 차시 끝에 단원 평가
    const steps = [
      ...(part > 1 ? [[`데일리 테스트`, daily ? `${part - 1}차시 복습 4문제 · ${daily.right} / ${daily.total}` : `${part - 1}차시 복습 4문제 · ○✕`]] : []),
      ...(lessons.length ? [["개념 → 게임 → 워밍업", lessons.map((lesson) => lesson.title).join(" · ")]] : []),
      ["공부하기", isClass() ? `본책 ${problemCount(unit, part)}문항 · 한 문제씩 화면에` : `본책 ${problemCount(unit, part)}문항 · 화면에서 · 인쇄해서 · 유사 문제`],
      ["오늘의 과제", "칠판에 적힌 과제 · 집에서"],
      ...(lastPart ? [["단원 평가", result ? `10문제 · ${result.right} / ${result.total}` : "10문제 · ○✕ 진단 · 약점 유형"]] : []),
      ...(lastPart && last && book.source.unitTestQuestions?.length ? [["권별 테스트", `${book.label} ${book.source.unitTestQuestions.length}문제 · ${book.units.length}단원을 마치면`]] : [])
    ];
    const on = week?.part === part;
    const { bookPrint } = goldenBell ? sessionLinks(book, view.unit, part) : {};
    const wantPrint = !isClass() && printPref(book.id) === "print";
    const startWord = isClass() ? "교안 열기" : on ? "이어서 하기" : "공부 시작하기";
    // 한 차시 교재 인쇄(원장 2026-10-29 「워밍업 교재 표지와 같게, 한 회차 교재 구성 전체를 묶으라고」):
    // 워밍업 교재 표지 → (2차시부터) 지난 차시 데일리 테스트 → 워밍업 학습마다 개념·워밍업 → 본책 → 오늘의 과제 → (마지막 차시) 단원 평가 (golden-bell.html?sessionbook=1)
    return `<section class="st-session${on ? " is-on" : ""}"><h4>${part}차시</h4>
      <ol class="st-week">${steps.map(([label, note], i) => `<li><b>${i + 1}</b><span>${esc(label)}</span><small>${esc(note)}</small></li>`).join("")}</ol>
      <a class="st-week-start st-btn${isClass() || on || (!week && part === 1) ? " primary" : ""}" data-start="${book.id}|${view.unit}|${part}|${on ? week.last || 1 : ""}" href="${esc(studyLink(book.id, view.unit, part, on ? week.last || 1 : 0))}">${part}차시 ${startWord} ›</a>
      ${goldenBell ? `<a class="st-session-print${wantPrint ? " is-wanted" : ""}" href="${esc(bookPrint)}" target="_blank" rel="noopener">${part}차시 교재 인쇄 <small>표지 · ${part > 1 ? "데일리 테스트 · " : ""}개념 · 워밍업 · 본책 · 과제${lastPart ? " · 단원 평가" : ""}</small></a>` : ""}</section>`;
  });
  // 단원마다 「골라서 다시 풀기」(원장 2026-11-10 「유료 회원일 때는 각 단원에서 선택하여 다시 풀기」) — 정식 회원이 아니면 눌렀을 때 안내가 나온다
  const retry = isClass() ? "" : `<a class="st-retry" href="${esc(link("similar.html", { book: book.id, unit: String(view.unit) }))}"><b>골라서 다시 풀기</b><span>이 단원 본책에서 모르는 번호를 골라 같은 유형의 새 문제로 다시 풀어요</span>${isPaid() ? "" : `<em class="st-lock-tag">정규회원</em>`}<i aria-hidden="true">›</i></a>`;
  $("partList").innerHTML = `<div class="st-sessions">${sessions.join("")}</div>${retry}`;
}

function renderStudy() {
  const book = activeBook();
  $("studyLead").textContent = isClass() ? "수업할 대단원을 골라요. 차시마다 교안과 교재 인쇄가 나와요." : "대단원을 골라요.";
  renderSelfUnits(book);
  // 강사용: 본책 단원과 짝이 없는 워밍업 학습은 여기서 수업 화면으로 바로 연다(차시 교안에는 들어가지 않는다)
  if (!isClass() || !goldenBell) return;
  const { rest } = lessonsByUnit(book, goldenBell.books.find((entry) => entry.id === book.id));
  if (rest.length) $("unitList").insertAdjacentHTML("beforeend", `<section class="st-rest"><h3>그 밖의 워밍업 <small>본책 단원과 짝이 없는 학습 ${rest.length}개 · 수업 화면으로 열려요</small></h3>
    <div class="st-rest-links">${rest.map((lesson) => `<a href="${esc(bellLink({ lesson: lesson.id }))}">${esc(lesson.title)}</a>`).join("")}</div></section>`);
}

// ── 유사문제 만들기 ──
function renderTest() {
  const book = activeBook();
  const questions = book.source.unitTestQuestions || [];
  const verified = questions.filter((question) => question.verified).length;
  $("unitTestFreshMeta").textContent = verified === questions.length
    ? `${questions.length}문항`
    : `${questions.length}문항 중 ${verified}문항을 준비했어요 — 준비한 문항만 나와요`;
  $("unitTestSource").href = link("unit-test-viewer.html", { book: book.id });
  $("unitTestFresh").href = bankLink({ set: "unit-test", fresh: "1", build: "1" });
  $("similarLink").href = link("similar.html", { book: book.id });
}

// ── 이벤트 ──
$("bookList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-book]");
  if (!button) return;
  view.bookId = button.dataset.book;
  go(1);
});
$("unitList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-unit]");
  if (!button) return;
  view.unit = Number(button.dataset.unit);
  go(2);
});
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-go]");
  if (!button || Number(button.dataset.go) === view.step) return;
  go(Number(button.dataset.go));
});
window.addEventListener("popstate", () => {
  const next = new URLSearchParams(location.search), known = CURRICULUM.some((book) => book.id === next.get("book"));
  if (known) view.bookId = next.get("book");
  view.unit = Math.max(0, Number(next.get("unit")) || 0);
  view.step = known ? (next.get("unit") !== null ? 2 : 1) : 0;
  showStep();
});
document.querySelector(".st-door-switch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-door]");
  if (!button) return;
  view.door = button.dataset.door;
  renderDoors();
  syncAddress();
});
$("studentName").textContent = student;
if (view.mode === "class") {
  document.body.classList.add("is-class");
  $("brandName").textContent = "강사용 교안";
  $("todayHeading").textContent = "어느 차시를 수업할까요?";
  document.title = "GM 강사용 교안";
}
$("introLink").href = link("home.html", {});
$("myStudyLink").href = link("my-study.html", { book: view.bookId });
$("planLink").href = link("plan.html", { book: view.bookId });
// 로그인(승인 페이지): 로그인했으면 「로그인됨」, 선생님이면 선생님 보기로
{
  const me = loggedIn();
  $("loginLink").textContent = !me ? "로그인" : me.type === "admin" ? "선생님 보기" : "로그인됨";
  $("loginLink").href = !me ? "./login.html" : me.type === "admin" ? "./teacher.html" : "./login.html";
}
// 둘러보기·체험 띠. 세션을 서버에 다시 물어 회원 상태(열린 권·남은 날)가 바뀌었으면 다시 그린다
function paintBanner() {
  const html = accessBanner();
  $("accessBanner").innerHTML = html; $("accessBanner").hidden = !html;
}
wireAccess(document.body);
paintBanner();
showStep();
syncAddress();
// 첫 화면 움직임(study-motion.js · 스킬 web-ui-library-picks, 원장 2026-11-04 「스스로 공부 첫 화면에도 넣어줘」):
// 처음 열 때 한 번 — 제목이 글자째 올라오고 교재 목록이 하나씩 들어온다. 단추는 누르면 쏙(Motion)
if (view.step === 0) playIntro($("todayHeading"), [...document.querySelectorAll("#quickStart > button:not([hidden]), #bookList > button")]);
const PRESS = ".st-quick-card, .st-book-list button, .st-units button, .st-units a, .st-week-start, .st-door-switch button, .st-back, .st-crumbs button";
bindPress(PRESS);
addEventListener("load", () => bindPress(PRESS));
if (loggedIn()) checkSession().then(async () => {
  // 서버에 남은 공부 기록(다른 기기에서 한 것)까지 합쳐 「이어서 하기」를 다시 정한다
  const { records } = await loadRecords(student);
  weekRows = [...records.values()].filter((row) => row.kind === "week").map((row) => ({ key: row.key, payload: row.payload, at: String(row.updatedAt || "") }));
  paintBanner(); showStep();
}).catch(() => {});

bellReady = loadGoldenBell();
bellReady.then((data) => {
  goldenBell = data;
  if (view.step === 2) renderParts();
  else if (view.step === 1 && view.door === "study") renderStudy();
}).catch(() => {
});
