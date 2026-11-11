import { CURRICULUM } from "./source-data.js?v=20261110x";
import { unitParts, partProblems } from "./study-map.js?v=20261111c";
import { loadLocalAll } from "./study-progress.js?v=20261029q";
import { canRetry, lockCard, accessBanner, wireAccess } from "./fields-access.js?v=20261110s";
import { pickOf, refOf, partPickOption } from "./study-deck.js?v=20261111c";

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
function firstPlace() {
  const known = CURRICULUM.find((book) => book.id === params.get("book"));
  if (known) return { bookId: known.id, unit: Math.min(Math.max(0, Number(params.get("unit")) || 0), known.units.length - 1) };
  const row = loadLocalAll().records.filter((entry) => entry.student_name === student && entry.kind === "week")
    .sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")))[0];
  const match = row && /^(book-\d+)-u(\d+)$/.exec(row.record_key);
  const book = match && CURRICULUM.find((entry) => entry.id === match[1]);
  if (book && book.units[Number(match[2])]) return { bookId: book.id, unit: Number(match[2]) };
  return { bookId: CURRICULUM[0].id, unit: 0 };
}
const view = { ...firstPlace(), picked: new Map() };   // picked: 번호 열쇠 → pick 한 줄
const activeBook = () => CURRICULUM.find((book) => book.id === view.bookId);

function syncAddress() {
  const next = new URLSearchParams(location.search);
  next.set("book", view.bookId); next.set("unit", String(view.unit));
  history.replaceState(null, "", `?${next}`);
}

function renderTabs() {
  const book = activeBook();
  $("bookTabs").innerHTML = CURRICULUM.map((entry) => `<button type="button" role="radio" data-book="${entry.id}" aria-checked="${entry.id === view.bookId}">${esc(entry.label)}</button>`).join("");
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

function renderDock() {
  const book = activeBook(), size = view.picked.size;
  $("pickSummary").textContent = size ? `${book.label} ${view.unit + 1}단원 · ${size}문제 골랐어요${size >= MAX ? ` (한 번에 ${MAX}문제까지)` : ""}` : "틀렸거나 모르는 번호를 눌러요";
  $("clearPicks").hidden = !size;
  const make = $("makeLink");
  make.setAttribute("aria-disabled", String(!size));
  make.textContent = size ? `유사문제 만들기 · ${size}문제` : "유사문제 만들기";
  make.href = size ? link("index.html", { mode: "curriculum", book: book.id, picks: [...view.picked.values()].join("|"), build: "1", as: "student",
    title: `${book.label} ${view.unit + 1}단원 · 오답 유사문제`, back: `./similar.html?${new URLSearchParams({ student, book: book.id, unit: String(view.unit) })}` }) : "./index.html";
}

function show() { renderTabs(); renderNumbers(); renderDock(); syncAddress(); }

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
{
  const html = accessBanner();
  $("accessBanner").innerHTML = html; $("accessBanner").hidden = !html;
}
wireAccess(document.body);
show();
