import { CURRICULUM, TEXTBOOK_STAGES } from "./source-data.js?v=20261024r";
import { lessonsByUnit, unitParts, partProblems, gameTitles, loadGoldenBell } from "./study-map.js?v=20261026j";

// 시작 화면: 권을 고르고 「공부하기」(① 개념 → ② 게임 → ③ 골든벨 → ④ 본책) 또는
// 「시험지 만들기」(권별테스트 원문 풀기 · 권별테스트 유사문제 · 교재에서 단원·난이도 골라 만들기)로 들어간다.
// 이 화면은 길 안내만 한다. 문제를 만들고 채점하는 일은 문제은행(index.html)과 골든벨(golden-bell.html)이 그대로 맡고,
// 여기서는 그 화면들이 받는 주소(book·lesson·phase·units·stage·count·set·build)만 만든다.
// 설계: PROGRAM-STRUCTURE-20261024.md

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const COUNTS = [10, 20, 30];

const view = {
  bookId: CURRICULUM.some((book) => book.id === params.get("book")) ? params.get("book") : CURRICULUM[0].id,
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

function syncAddress() {
  const next = new URLSearchParams(location.search);
  next.set("book", view.bookId);
  if (view.door === "test") next.set("door", "test"); else next.delete("door");
  if (view.mode === "class") next.set("as", "class"); else next.delete("as");
  history.replaceState(null, "", `?${next}`);
}

// 골든벨 학습을 단원에 나눠 담는 규칙·게임 찾기는 study-map.js(학생 차시 화면과 같이 쓴다).
const gamesFor = (lesson) => gameTitles(view.bookId, lesson, goldenBell.games);

// ── 권 고르기 ──
function renderBooks() {
  $("bookList").innerHTML = CURRICULUM.map((book) => `<button type="button" role="radio" data-book="${book.id}" aria-checked="${book.id === view.bookId}">
    <b>${esc(book.label)}</b><span>${esc(book.title)}</span></button>`).join("");
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
      : `<span class="st-step is-empty"><i>②</i>게임 준비 중</span>`}
    ${count
      ? `<a class="st-step" href="${esc(bellLink({ lesson: lesson.id, phase: "original" }))}"><i>③</i>골든벨 ${count}문항${self ? "" : " · 수업 화면"}</a>`
      : `<span class="st-step is-empty"><i>③</i>골든벨 준비 중</span>`}
  </li>`;
}

// 학습형(학생): 원장 지시(2026-10-24) 「학생용은 우선 권 단원 고르기. 1단원을 2번 정도로 나누어 공부」 —
// 단원마다 차시(본책의 개념 1 · 개념 2) 단추만 두고, 차시 안에서 개념 배우기 → 게임하기 → 골든벨 → 공부하기(study.html).
function renderSelfUnits(book) {
  $("unitList").innerHTML = book.units.map((unit, index) => {
    const { count } = unitParts(unit);
    const parts = Array.from({ length: count }, (_, k) => {
      const problems = partProblems(unit, k + 1).reduce((sum, block) => sum + block.numbers.length, 0);
      return `<a class="st-part" href="${esc(link("study.html", { book: book.id, unit: String(index), part: String(k + 1) }))}"><b>${k + 1}차시 · 개념 ${k + 1}</b><span>본책 ${problems}문항</span></a>`;
    }).join("");
    return `<section class="st-unit st-unit-self"><h3><span>${String(index + 1).padStart(2, "0")}</span>${esc(unit.label)}</h3><div class="st-parts">${parts}</div></section>`;
  }).join("");
}

function renderStudy() {
  const book = activeBook();
  document.querySelector(".st-steps").hidden = view.mode === "self";
  if (view.mode === "self") {
    $("studyLead").innerHTML = "단원을 고르고 차시를 눌러요. 차시마다 <b>개념 배우기</b> → <b>게임하기</b> → <b>골든벨</b> → <b>공부하기</b>(본책에서 모르는 문제는 번호를 눌러 유사문제로) 순서예요.";
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
  renderBooks();
  renderDoors();
  syncAddress();
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
renderBooks();
renderDoors();

loadGoldenBell().then((data) => {
  goldenBell = data;
  if (view.door === "study") renderStudy();
}).catch(() => {
  $("unitList").querySelectorAll(".st-loading").forEach((node) => { node.textContent = "골든벨 학습을 불러오지 못했어요. 새로고침해 주세요."; });
});
