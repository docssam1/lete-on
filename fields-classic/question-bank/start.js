import { CURRICULUM, TEXTBOOK_STAGES } from "./source-data.js?v=20261024r";
import { lessonsByUnit, lessonsByPart, unitParts, partProblems, gameTitles, loadGoldenBell } from "./study-map.js?v=20261027p";
import { DRILL_RECIPES } from "./drill-recipes.js?v=20261027m";

// 시작 화면(원장 2026-10-26): 「오늘 공부할 내용은?」 — 1~10권 → 누르면 그 권의 대단원 → 누르면 옆으로 밀려 소단원(차시).
// 한 번에 한 장만 보이고, 위의 길(1권 › 01 도형 움직이기)이나 「‹」로 앞 장으로 돌아간다. 브라우저 뒤로 가기도 앞 장으로.
// 권을 고르고 「공부하기」(① 개념 → ② 게임 → ③ 골든벨 → ④ 본책) 또는
// 「시험지 만들기」(권별테스트 원문 풀기 · 권별테스트 유사문제 · 교재에서 단원·난이도 골라 만들기)로 들어간다.
// 이 화면은 길 안내만 한다. 문제를 만들고 채점하는 일은 문제은행(index.html)과 골든벨(golden-bell.html)이 그대로 맡고,
// 여기서는 그 화면들이 받는 주소(book·lesson·phase·units·stage·count·set·build)만 만든다.
// 설계: PROGRAM-STRUCTURE-20261024.md

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const COUNTS = [10, 20, 30];

const hasBook = CURRICULUM.some((book) => book.id === params.get("book"));
const view = {
  bookId: hasBook ? params.get("book") : CURRICULUM[0].id,
  step: hasBook ? (params.get("unit") !== null && params.get("door") !== "test" && params.get("as") !== "class" ? 2 : 1) : 0,
  unit: Math.max(0, Number(params.get("unit")) || 0),
  door: params.get("door") === "test" ? "test" : "study",
  mode: params.get("as") === "class" ? "class" : "self",
  pick: { units: null, stage: "type", count: 20 }
};
let goldenBell = null; // { books, flows, flowTitles, activities } — 크기가 커서 첫 화면을 그린 뒤 불러온다

function link(page, entries) {
  const url = new URLSearchParams({ student, ...entries });
  return `./${page}?${url}`;
}
const bankLink = (entries) => link("index.html", { mode: "curriculum", book: view.bookId, ...entries });
const bellLink = (entries) => link("golden-bell.html", { book: view.bookId, ...entries });
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
  if (view.step === 0) renderBooks();
  else if (view.step === 1) renderDoors();
  else renderParts();
}
function go(step, push = true) {
  view.step = step;
  showStep();
  syncAddress(push);
  window.scrollTo({ top: 0 });
}

// 골든벨 학습을 단원에 나눠 담는 규칙·게임 찾기는 study-map.js(학생 차시 화면과 같이 쓴다).
const gamesFor = (lesson) => gameTitles(view.bookId, lesson, goldenBell.games);

// ── 권 고르기 ──
function renderBooks() {
  $("bookList").innerHTML = CURRICULUM.map((book) => `<button type="button" data-book="${book.id}"${book.id === view.bookId && hasBook ? ' class="was"' : ""}>
    <b>${esc(book.label)}</b><span>${esc(book.title)}</span><i aria-hidden="true">›</i></button>`).join("");
}

function renderDoors() {
  const book = activeBook();
  $("bookTitle").textContent = `${book.label} · ${book.title}`;
  for (const door of ["study", "test"]) {
    const tab = document.querySelector(`[data-door="${door}"]`);
    tab.setAttribute("aria-selected", String(view.door === door));
    $(`${door}Panel`).hidden = view.door !== door;
  }
  document.querySelectorAll("[data-mode]").forEach((button) => button.setAttribute("aria-checked", String(button.dataset.mode === view.mode)));
  if (view.door === "study") renderStudy(); else renderTest();
}

// ── 공부하기 ──
function bookCell(unitIndex) {
  const self = view.mode === "self";
  const entries = { units: String(unitIndex), count: self ? "10" : "20", build: "1", ...(self ? {} : { form: "lesson" }) };
  const stages = TEXTBOOK_STAGES.map((stage) => `<a href="${esc(bankLink({ ...entries, stage: stage.id }))}">${esc(stage.label)}</a>`).join("");
  return `<div class="st-cell st-book-cell"><b>④ 본책</b><div class="st-stage-links">${stages}</div>
    <small>${self ? "10문제 학습지 · 화면에서 풀고 바로 채점" : "교재형 학습지 20문제 · 인쇄"}</small></div>`;
}

function lessonRow(lesson) {
  const self = view.mode === "self";
  const tutorial = Boolean(goldenBell.games.flows[`${view.bookId}/${lesson.id}`]);
  const concept = tutorial ? "튜토리얼" : lesson.experience ? "개념 설명" : "개념 쪽";
  const games = gamesFor(lesson);
  const count = lesson.original?.items?.length || 0;
  return `<li class="st-lesson">
    <span class="st-lesson-title">${esc(lesson.title)}</span>
    <a class="st-step${tutorial ? " has-tutorial" : ""}" href="${esc(bellLink({ lesson: lesson.id }))}"><i>①</i>${concept}</a>
    ${games.length
      ? `<a class="st-step" href="${esc(bellLink({ lesson: lesson.id }))}"><i>②</i>${esc(games.join(" · "))}</a>`
      : DRILL_RECIPES[`${view.bookId}/${lesson.id}`]   // 골든벨 게임이 없는 차시는 연습 공방(drill.html)으로
        ? `<a class="st-step" href="./drill.html?book=${esc(view.bookId)}&amp;lesson=${esc(lesson.id)}"><i>②</i>연습 공방</a>`
        : `<span class="st-step is-empty"><i>②</i>게임 준비 중</span>`}
    ${count
      ? `<a class="st-step" href="${esc(bellLink({ lesson: lesson.id, phase: "original" }))}"><i>③</i>골든벨 ${count}문항${self ? "" : " · 수업 화면"}</a>`
      : `<span class="st-step is-empty"><i>③</i>골든벨 준비 중</span>`}
  </li>`;
}

// 학습형(학생): 원장 지시(2026-10-24) 「학생용은 우선 권 단원 고르기. 1단원을 2번 정도로 나누어 공부」 —
// 대단원을 누르면 그 단원의 차시(소단원) 장으로 넘어가고, 차시 안에서 개념 배우기 → 게임하기 → 골든벨 → 공부하기(study.html).
const problemCount = (unit, part) => partProblems(unit, part).reduce((sum, block) => sum + block.numbers.length, 0);
function renderSelfUnits(book) {
  $("unitList").innerHTML = `<div class="st-unit-cards">${book.units.map((unit, index) => {
    const { count } = unitParts(unit);
    const problems = Array.from({ length: count }, (_, k) => problemCount(unit, k + 1)).reduce((a, b) => a + b, 0);
    return `<button type="button" class="st-unit-card" data-unit="${index}"><span class="st-unit-no">${String(index + 1).padStart(2, "0")}</span><b>${esc(unit.label)}</b><small>${count}차시 · 본책 ${problems}문항</small><i aria-hidden="true">›</i></button>`;
  }).join("")}</div>`;
}
// 소단원(차시): 차시마다 그 차시에서 배우는 골든벨 학습 이름을 보여 준다(불러오기 전에는 번호와 문항 수만)
function renderParts() {
  const book = activeBook(), unit = book.units[view.unit];
  $("unitTitle").innerHTML = `<span>${String(view.unit + 1).padStart(2, "0")}</span>${esc(unit.label)}`;
  const { count } = unitParts(unit);
  let byPart = null;
  if (goldenBell) {
    const bellBook = goldenBell.books.find((entry) => entry.id === book.id);
    byPart = lessonsByPart(unit, lessonsByUnit(book, bellBook).units[view.unit]);
  }
  $("partList").innerHTML = Array.from({ length: count }, (_, k) => {
    const titles = (byPart?.[k] || []).map((lesson) => lesson.title);
    return `<a class="st-part" href="${esc(link("study.html", { book: book.id, unit: String(view.unit), part: String(k + 1) }))}">
      <span class="st-part-no">${k + 1}차시</span>
      <b>${titles.length ? esc(titles.join(" · ")) : `개념 ${k + 1}`}</b>
      <small>본책 ${problemCount(unit, k + 1)}문항</small><i aria-hidden="true">›</i></a>`;
  }).join("");
}

function renderStudy() {
  const book = activeBook();
  document.querySelector(".st-steps").hidden = view.mode === "self";
  if (view.mode === "self") {
    $("studyLead").textContent = "대단원을 골라요.";
    return renderSelfUnits(book);
  }
  $("studyLead").innerHTML = view.mode === "self"
    ? ""
    : "선생님 화면에 띄워 같은 순서로 수업해요. ④ 본책은 교재형 학습지로 인쇄해요.";
  if (!goldenBell) {
    $("unitList").innerHTML = book.units.map((unit, index) => `<section class="st-unit"><h3><span>${String(index + 1).padStart(2, "0")}</span>${esc(unit.label)}</h3>
      <div class="st-unit-body"><p class="st-loading">골든벨 학습을 불러오는 중…</p>${bookCell(index)}</div></section>`).join("");
    return;
  }
  const bellBook = goldenBell.books.find((entry) => entry.id === book.id);
  const { units, rest } = lessonsByUnit(book, bellBook);
  const unitBlocks = book.units.map((unit, index) => `<section class="st-unit">
    <h3><span>${String(index + 1).padStart(2, "0")}</span>${esc(unit.label)}<small>본책 ${unit.typeIds.length}개 유형 · 골든벨 학습 ${units[index].length}개</small></h3>
    <div class="st-unit-body">
      ${units[index].length ? `<ol class="st-lessons">${units[index].map(lessonRow).join("")}</ol>` : `<p class="st-empty">이 단원은 본책 문제로 공부해요. 골든벨 학습은 준비하고 있어요.</p>`}
      ${bookCell(index)}
    </div>
  </section>`).join("");
  const restBlock = rest.length ? `<section class="st-unit st-rest">
    <h3><span>+</span>그 밖의 골든벨<small>본책 단원과 짝이 없는 골든벨 학습 ${rest.length}개</small></h3>
    <div class="st-unit-body"><ol class="st-lessons">${rest.map(lessonRow).join("")}</ol></div>
  </section>` : "";
  $("unitList").innerHTML = unitBlocks + restBlock;
}

// ── 시험지 만들기 ──
function renderTest() {
  const book = activeBook();
  const questions = book.source.unitTestQuestions || [];
  const verified = questions.filter((question) => question.verified).length;
  $("unitTestFreshMeta").textContent = verified === questions.length
    ? `${questions.length}문항`
    : `${questions.length}문항 중 ${verified}문항을 준비했어요 — 준비한 문항만 나와요`;
  $("unitTestSource").href = link("unit-test-viewer.html", { book: book.id });
  $("unitTestFresh").href = bankLink({ set: "unit-test", fresh: "1", build: "1" });
  $("bankMore").href = link("index.html", {});
  if (!view.pick.units || view.pick.units.bookId !== book.id) view.pick.units = { bookId: book.id, set: new Set(book.units.map((_, index) => index)) };
  $("pickUnits").innerHTML = book.units.map((unit, index) => `<label><input type="checkbox" value="${index}" ${view.pick.units.set.has(index) ? "checked" : ""} /><span>${esc(unit.label)}</span></label>`).join("");
  $("pickStages").innerHTML = TEXTBOOK_STAGES.map((stage) => `<label><input type="radio" name="stage" value="${stage.id}" ${stage.id === view.pick.stage ? "checked" : ""} /><span>${esc(stage.label)}<small>${esc(stage.sourceLabel)}</small></span></label>`).join("");
  $("pickCounts").innerHTML = COUNTS.map((count) => `<label><input type="radio" name="count" value="${count}" ${count === view.pick.count ? "checked" : ""} /><span>${count}문제</span></label>`).join("");
  renderPickSummary();
}

function renderPickSummary() {
  const book = activeBook();
  const units = [...view.pick.units.set].sort();
  const stage = TEXTBOOK_STAGES.find((entry) => entry.id === view.pick.stage);
  $("pickSummary").textContent = units.length
    ? `${book.label} ${units.length === book.units.length ? "전체 단원" : units.map((index) => book.units[index].label).join(" · ")} · ${stage.label} · ${view.pick.count}문제`
    : "단원을 하나 이상 골라 주세요";
  $("pickForm").querySelector("button[type=submit]").disabled = !units.length;
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
document.querySelector(".st-mode").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;
  view.mode = button.dataset.mode;
  renderDoors();
  syncAddress();
});
$("pickForm").addEventListener("change", (event) => {
  const input = event.target;
  if (input.type === "checkbox") {
    if (input.checked) view.pick.units.set.add(Number(input.value)); else view.pick.units.set.delete(Number(input.value));
  } else if (input.name === "stage") view.pick.stage = input.value;
  else if (input.name === "count") view.pick.count = Number(input.value);
  renderPickSummary();
});
$("pickForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const units = [...view.pick.units.set].sort();
  if (!units.length) return;
  location.assign(bankLink({ units: units.join(","), stage: view.pick.stage, count: String(view.pick.count), build: "1" }));
});

$("studentName").textContent = student;
$("introLink").href = link("home.html", {});
$("bankLink").href = link("index.html", {});
showStep();
syncAddress();

loadGoldenBell().then((data) => {
  goldenBell = data;
  if (view.step === 2) renderParts();
  else if (view.step === 1 && view.door === "study") renderStudy();
}).catch(() => {
  $("unitList").querySelectorAll(".st-loading").forEach((node) => { node.textContent = "골든벨 학습을 불러오지 못했어요. 새로고침해 주세요."; });
});
