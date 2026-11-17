import { CURRICULUM as COURSE1_BOOKS, COURSE2_CURRICULUM, bookById } from "./source-data.js?v=20261117a";
import { unitParts, partProblems } from "./study-map.js?v=20261117a";
import { loadLocalAll, loggedIn, checkSession } from "./study-progress.js?v=20261117a";
import { canRetry, lockCard, accessBanner, wireAccess } from "./fields-access.js?v=20261116g1";
import { pickOf, refOf, partPickOption } from "./study-deck.js?v=20261117a";
import { course2Html, course3Html } from "./course2-list.js?v=20261116g1";

// 모르는 문제 유사문제(similar.html, 원장 2026-11-10 「문제은행은 모르는 문제 유사문제 만들기로 학생 모드에 있어야 돼」).
// 권 · 단원을 고르면 본책 번호판(차시마다 활동 · 확인 · 연습 · 도전)이 나온다. 모르는 번호를 누르고 「유사문제 만들기」 →
// 번호마다 같은 유형·같은 단계의 새 문제 한 문제(문제은행 학생 화면: index.html?as=student&picks=유형~단계~표시~단원[~조건]|…).
// 번호판과 picks는 스스로 공부 덱과 같은 것(study-map.js partProblems · study-deck.js pickOf)을 쓴다 — 덱의 본책 장과 어긋나지 않게.
// 유료(정식) 회원 기능이다(원장 2026-11-10 「유료 회원일 때는 각 단원에서 선택하여 다시 풀기 할 수 있도록」) — 단원마다 들어오는 길: 시작 화면 차시 장 · 내 학습 상황 단원 카드.
// 이 화면은 번호만 고른다. 문제를 만들고 답을 확인하는 일은 문제은행 학생 화면이 그대로 맡는다.

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const MAX = 20;   // 한 번에 만드는 문제 수(학습지 한 장 분량)
const link = (page, entries) => `./${page}?${new URLSearchParams({ student, ...entries })}`;

// 처음 보여 줄 곳: 주소(?book=&unit=) → 이 기기에서 가장 최근에 공부한 단원 → 1권 1단원
// 과정마다 번호판이 있는 권: 1과정 1~10권, 2과정은 본책을 옮긴 권(지금 G1 — source-data.js COURSE2_CURRICULUM)
const booksOf = (course) => course === "2" ? COURSE2_CURRICULUM : COURSE1_BOOKS;
const CURRICULUM = COURSE1_BOOKS;
function firstPlace() {
  const known = bookById(params.get("book"));
  if (known) return { bookId: known.id, unit: Math.min(Math.max(0, Number(params.get("unit")) || 0), known.units.length - 1) };
  const row = loadLocalAll().records.filter((entry) => entry.student_name === student && entry.kind === "week")
    .sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")))[0];
  const match = row && /^(book-\d+)-u(\d+)$/.exec(row.record_key);
  const book = match && bookById(match[1]);
  if (book && book.units[Number(match[2])]) return { bookId: book.id, unit: Number(match[2]) };
  return { bookId: CURRICULUM[0].id, unit: 0 };
}
const COURSES = [{ id: "1", label: "1과정" }, { id: "2", label: "2과정" }, { id: "3", label: "3과정" }];
const view = { ...firstPlace(), course: COURSES.some((c) => c.id === params.get("course")) ? params.get("course") : "1", picked: new Map() };   // picked: 번호 열쇠 → pick 한 줄
const activeBook = () => booksOf(view.course).find((book) => book.id === view.bookId) || booksOf(view.course)[0];
if (!booksOf(view.course).some((book) => book.id === view.bookId)) { view.bookId = booksOf(view.course)[0]?.id; view.unit = 0; }

function syncAddress() {
  const next = new URLSearchParams(location.search);
  next.set("book", view.bookId); next.set("unit", String(view.unit));
  if (view.course === "1") next.delete("course"); else next.set("course", view.course);
  history.replaceState(null, "", `?${next}`);
}

function renderTabs() {
  const book = activeBook();
  $("bookTabs").innerHTML = booksOf(view.course).map((entry) => `<button type="button" role="radio" data-book="${entry.id}" aria-checked="${entry.id === view.bookId}">${esc(entry.label)}</button>`).join("");
  $("unitTabs").innerHTML = book.units.map((unit, index) => `<button type="button" role="radio" data-unit="${index}" aria-checked="${index === view.unit}"><b>${index + 1}</b>${esc(unit.label)}</button>`).join("");
}

// 번호판: 차시마다 한 묶음, 그 안에 활동 · 확인 · 연습 · 도전 줄
function renderNumbers() {
  const book = activeBook(), unit = book.units[view.unit];
  // 오답 유사문제는 정식 회원 것(fields-access.js canRetry) — 둘러보기·체험은 안내 카드
  const gate = canRetry(book.id, view.unit);
  $("dock").hidden = !gate.ok;
  if (!gate.ok) { $("numberList").innerHTML = lockCard(gate.why, { bookId: book.id, here: `similar.html${location.search}` }); return; }
  const { count } = unitParts(unit);
  const sessions = Array.from({ length: count }, (_, k) => {
    const part = k + 1, option = partPickOption(book.id, view.unit, part);
    const rows = partProblems(unit, part).map((block) => `<div class="sm-block"><span>${esc(block.label)}</span><div class="sm-nums">${block.numbers.map(({ n, typeId, stage }) => {
      const key = `${part}:${block.section}:${block.group}:${n}`;
      const pick = pickOf(typeId, stage, `본책 ${refOf(block, n)}`, view.unit, option);
      return `<button type="button" data-key="${esc(key)}" data-pick="${esc(pick)}" aria-pressed="${view.picked.has(key)}" aria-label="${esc(`${refOf(block, n)}`)}">${n}</button>`;
    }).join("")}</div></div>`).join("");
    return rows ? `<section class="sm-part"><h3>${part}차시</h3>${rows}</section>` : "";
  }).join("");
  $("numberList").innerHTML = sessions || `<p class="st-empty">이 단원의 본책 번호를 준비하고 있어요.</p>`;
}

// 시험지 짜기(원장 2026-11-17): 번호마다 문제 수(1~3) · 난이도(더 쉽게 / 본책과 같게 / 더 어렵게) · 미리보기 →
// 「시험지 만들기」는 문제은행 3단계 시험지(미리보기·답안 보기·문제 인쇄, index.html &paper=1)를 새 창으로, 「화면에서 풀기」는 한 문제씩 푸는 학생 화면.
const opts = { each: 1, level: "actual" };
function pickParams() {
  const book = activeBook();
  const total = Math.min(MAX * 3, view.picked.size * opts.each);
  return { mode: "curriculum", book: book.id, picks: [...view.picked.values()].join("|"), each: String(opts.each), level: opts.level, build: "1",
    title: `${book.label} ${view.unit + 1}단원 · 오답 유사문제`, total };
}
function renderDock() {
  const book = activeBook(), size = view.picked.size;
  const total = size * opts.each;
  $("pickSummary").textContent = size ? `${book.label} ${view.unit + 1}단원 · 번호 ${size}개 · ${total}문제${size >= MAX ? ` (번호는 한 번에 ${MAX}개까지)` : ""}` : "틀렸거나 모르는 번호를 눌러요";
  ["clearPicks", "previewBtn", "solveLink", "pickOptions"].forEach((id) => { $(id).hidden = !size; });
  document.querySelectorAll("#pickOptions [data-each]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.each) === opts.each)));
  document.querySelectorAll("#pickOptions [data-level]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.level === opts.level)));
  const make = $("makeLink");
  make.setAttribute("aria-disabled", String(!size));
  make.textContent = size ? `시험지 만들기 · ${total}문제` : "시험지 만들기";
  const { total: _t, ...base } = pickParams();
  const back = `./similar.html?${new URLSearchParams({ student, book: book.id, unit: String(view.unit), ...(book.course ? { course: String(book.course) } : {}) })}`;
  make.href = size ? link("index.html", { ...base, paper: "1", form: "exam", cols: "2" }) : "./index.html";
  $("solveLink").href = size ? link("index.html", { ...base, as: "student", lead: "1", back }) : "./index.html";
  if (!$("previewPanel").hidden) refreshPreview();
}
let previewTimer = 0;
function refreshPreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    if (!view.picked.size) { $("previewPanel").hidden = true; return; }
    const { total, ...base } = pickParams();
    $("previewFrame").src = link("index.html", { ...base, paper: "1", form: "exam", cols: "2", preview: "1" });
  }, 250);
}
document.querySelectorAll("#pickOptions [data-each]").forEach((b) => b.addEventListener("click", () => { opts.each = Number(b.dataset.each); renderDock(); }));
document.querySelectorAll("#pickOptions [data-level]").forEach((b) => b.addEventListener("click", () => { opts.level = b.dataset.level; renderDock(); }));
$("previewBtn").addEventListener("click", () => { $("previewPanel").hidden = false; refreshPreview(); $("previewPanel").scrollIntoView({ behavior: "smooth", block: "start" }); });
$("previewClose").addEventListener("click", () => { $("previewPanel").hidden = true; $("previewFrame").removeAttribute("src"); });

// 과정: 1과정은 본책 번호 → 유사문제, 2과정은 권마다 그림으로 따져 보기·직접 해 보기·권별 테스트(course2-list.js), 3과정은 권별 테스트
let course2Cache = null, course3Cache = null;
async function renderCourse() {
  const c = view.course, one = c === "1", board = c !== "3";   // 번호판: 1과정 · 2과정(본책을 옮긴 권)
  $("courseTabs").innerHTML = COURSES.map((x) => `<button type="button" role="radio" data-course="${x.id}" aria-checked="${x.id === c}">${x.label}</button>`).join("");
  $("brandCourse").textContent = `GIFTED MATH BANK · ${c}과정`;
  ["smBookRow", "smUnitRow", "numberList"].forEach((id) => { $(id).hidden = !board; });
  if (!board) $("dock").hidden = true;
  $("coursePanel").hidden = one;
  $("smHeading").textContent = one ? "틀렸거나 모르는 번호를 골라요" : c === "2" ? "2과정 · 틀렸거나 모르는 번호를 골라요" : "3과정 · 권을 골라요";
  $("smLead").textContent = one ? "본책에서 틀렸거나 막힌 번호를 누르면 같은 유형의 새 문제가 나와요. 새 문제를 풀어 보고 본책 문제를 다시 풀어요."
    : c === "2" ? "본책 번호를 누르면 같은 유형의 새 문제가 나와요(지금은 G1). 아래 권마다 「그림으로 따져 보기」와 권별 테스트가 있어요."
    : "권을 다 배우면 권별 테스트를 풀고 번호마다 ○ · ✕로 채점해요. 그림으로 따져 보기와 유사문제는 3과정도 준비하고 있어요.";
  if (c === "2") $("coursePanel").innerHTML = course2Cache || (course2Cache = await course2Html());
  else if (c === "3") $("coursePanel").innerHTML = course3Cache || (course3Cache = await course3Html());
}
function show() { renderCourse(); if (view.course !== "3") { renderTabs(); renderNumbers(); renderDock(); } syncAddress(); }
$("courseTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-course]");
  if (!button || button.dataset.course === view.course) return;
  view.course = button.dataset.course; view.picked.clear();
  if (view.course !== "3" && !booksOf(view.course).some((book) => book.id === view.bookId)) { view.bookId = booksOf(view.course)[0].id; view.unit = 0; }
  show();
});

$("bookTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-book]");
  if (!button || button.dataset.book === view.bookId) return;
  view.bookId = button.dataset.book; view.unit = 0; view.picked.clear();
  show();
});
$("unitTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-unit]");
  if (!button || Number(button.dataset.unit) === view.unit) return;
  view.unit = Number(button.dataset.unit); view.picked.clear();
  show();
});
$("numberList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-key]");
  if (!button) return;
  const key = button.dataset.key;
  if (view.picked.has(key)) view.picked.delete(key);
  else if (view.picked.size < MAX) view.picked.set(key, button.dataset.pick);
  button.setAttribute("aria-pressed", String(view.picked.has(key)));
  renderDock();
});
$("clearPicks").addEventListener("click", () => { view.picked.clear(); renderNumbers(); renderDock(); });
$("makeLink").addEventListener("click", (event) => { if (!view.picked.size) event.preventDefault(); });

$("studentName").textContent = student;
$("introLink").href = link("home.html", {});
$("startLink").href = link("start.html", {});
$("myStudyLink").href = link("my-study.html", { book: view.bookId });
// 로그인했으면 GM 상태(권별·기간)를 서버에서 다시 받아 잠금을 정한다(원장 2026-11-14) — 연결이 안 되면 이 탭에 적힌 것으로
if (loggedIn()) await checkSession();
{
  const html = accessBanner();
  $("accessBanner").innerHTML = html; $("accessBanner").hidden = !html;
}
wireAccess(document.body);
show();
