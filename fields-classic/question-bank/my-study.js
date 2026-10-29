import { CURRICULUM, typeById } from "./source-data.js?v=20261028m";
import { loadRecords, weekRate, loggedIn, logout } from "./study-progress.js?v=20261028n";

// 내 학습 상황(원장 2026-10-27 「학생이 직접 학습 상황을 볼 수 있는 것도 · 수행률 진도」)
//   권마다: 수행률(4주 + 권별 테스트) · 진도(지금 몇 주) · 단원 평가 평균 · 권별 테스트
//   주마다: 수행률 막대 · 개념/게임/골든벨/공부하기/과제 몇 장 봤는지 · 단원 평가 점수 · 이어서 하기
//   약점 유형: 단원 평가·권별 테스트에서 틀린 유형을 모아 다시 공부하기(같은 유형 새 문제 2개씩)
// 기록은 study-progress.js(지금은 이 기기, 로그인하면 서버도).
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const link = (page, entries) => `./${page}?${new URLSearchParams({ student, ...entries })}`;
const PHASES = [["concept", "개념"], ["game", "게임"], ["bell", "워밍업"], ["board", "공부하기"], ["homework", "오늘의 과제"], ["daily", "데일리"], ["test", "단원 평가"]];
let bookId = CURRICULUM.some((book) => book.id === params.get("book")) ? params.get("book") : null;
let records = new Map();
let synced = false;
const get = (kind, key) => records.get(`${kind}:${key}`)?.payload || null;

function bookState(book) {
  const weeks = book.units.map((unit, index) => {
    const key = `${book.id}-u${index}`;
    const week = get("week", key), test = get("test", key);
    return { unit, index, key, week, test, rate: weekRate(week, test) };
  });
  const bookTest = get("book-test", book.id);
  const bookTestDone = bookTest?.marked && bookTest.marked >= bookTest.total;
  const rate = Math.round((weeks.reduce((sum, week) => sum + week.rate, 0) + (bookTestDone ? 100 : 0)) / (weeks.length + 1));
  const started = weeks.filter((week) => week.week);
  const current = weeks.find((week) => week.week && week.rate < 100) || weeks.find((week) => !week.week) || weeks.at(-1);
  const tests = weeks.filter((week) => week.test?.marked);
  const testRate = tests.length ? Math.round(tests.reduce((sum, week) => sum + week.test.right / week.test.total, 0) / tests.length * 100) : null;
  return { weeks, bookTest, bookTestDone, rate, started: started.length, current, testRate };
}

function renderBooks() {
  $("books").innerHTML = CURRICULUM.map((book) => {
    const { rate } = bookState(book);
    return `<button type="button" data-book="${book.id}" class="${book.id === bookId ? "is-on" : ""}" aria-pressed="${book.id === bookId}"><b>${esc(book.label)}</b><small>${rate ? `${rate}%` : "–"}</small><i style="--rate:${rate}%"></i></button>`;
  }).join("");
}

function renderSummary(book, state) {
  const { current, started } = state;
  const progress = !started ? "아직 시작 전" : state.bookTestDone ? "권별 테스트까지 끝" : current.rate >= 100 ? `${current.index + 1}주까지 끝` : `${current.index + 1}주 · ${esc(current.unit.label)}`;
  $("summary").innerHTML = `
    <div class="ms-stat ms-rate"><span>수행률</span><b>${state.rate}<small>%</small></b><i style="--rate:${state.rate}%"></i><small>${book.units.length}주 + 권별 테스트 중</small></div>
    <div class="ms-stat"><span>진도</span><b class="ms-text">${progress}</b><small>${started} / ${book.units.length}주 시작</small></div>
    <div class="ms-stat"><span>단원 평가 평균</span><b>${state.testRate ?? "–"}${state.testRate == null ? "" : "<small>%</small>"}</b><small>${state.weeks.filter((week) => week.test?.marked).length}번 봤어요</small></div>
    <div class="ms-stat"><span>권별 테스트</span><b>${state.bookTest?.marked ? `${state.bookTest.right}<small> / ${state.bookTest.total}</small>` : "–"}</b><small>${state.bookTest?.marked ? `${state.bookTest.marked}문제 채점` : "아직 안 봤어요"}</small></div>`;
}

function renderWeeks(book, state) {
  const rows = state.weeks.map(({ unit, index, week, test, rate }) => {
    const phases = PHASES.filter(([kind]) => !week || week.phases?.[kind]).map(([kind, label]) => {
      if (kind === "test") return `<li class="${test?.marked >= test?.total ? "is-done" : ""}"><b>${label}</b><span>${test?.marked ? `${test.right} / ${test.total}` : "전"}</span></li>`;
      const [seen, all] = week?.phases?.[kind] || [0, 0];
      return `<li class="${all && seen >= all ? "is-done" : seen ? "is-part" : ""}"><b>${label}</b><span>${all ? `${seen} / ${all}장` : "–"}</span></li>`;
    }).join("");
    const go = week ? link("study.html", { book: book.id, unit: String(index), part: String(week.part || 1), s: String(week.last || 1) }) : link("study.html", { book: book.id, unit: String(index), part: "1" });
    return `<li class="ms-week${rate >= 100 ? " is-done" : week ? " is-on" : ""}">
      <div class="ms-week-head"><span class="ms-week-no">${index + 1}주</span><b>${esc(unit.label)}</b><em>${rate}%</em></div>
      <i class="ms-bar" style="--rate:${rate}%"></i>
      <ol class="ms-phases">${phases}</ol>
      <a class="ms-btn${week && rate < 100 ? " primary" : ""}" href="${esc(go)}">${!week ? "시작하기" : rate >= 100 ? "다시 보기" : "이어서 하기"} ›</a>
    </li>`;
  });
  const bt = state.bookTest;
  rows.push(`<li class="ms-week ms-book-test${state.bookTestDone ? " is-done" : ""}">
    <div class="ms-week-head"><span class="ms-week-no">마무리</span><b>${esc(book.label)} 권별 테스트</b><em>${bt?.marked ? `${bt.right} / ${bt.total}` : "전"}</em></div>
    <i class="ms-bar" style="--rate:${bt?.marked ? Math.round((bt.right / bt.total) * 100) : 0}%"></i>
    <p class="ms-week-note">${bt?.wrong?.length ? `틀린 번호 ${bt.wrong.join(", ")}` : bt?.marked ? "틀린 번호가 없어요" : `${book.units.length}주를 마치면 풀어요 · 원문 ${book.source.unitTestQuestions?.length || 25}문제`}</p>
    <a class="ms-btn" href="${esc(link("unit-test-viewer.html", { book: book.id }))}">${bt?.marked ? "답안지 보기" : "풀기"} ›</a>
  </li>`);
  $("weeks").innerHTML = rows.join("");
}

function renderWeak(book, state) {
  const sources = new Map();
  for (const week of state.weeks) for (const typeId of week.test?.weak || []) sources.set(typeId, [...(sources.get(typeId) || []), `${week.index + 1}주 단원 평가`]);
  // 데일리 테스트(차시마다) 약점도 모은다(원장 2026-10-29 「데일리 테스트 결과와 약점 유형 누적」)
  for (const week of state.weeks) for (let d = 1; d <= 3; d += 1) for (const typeId of get("test", `${week.key}-d${d}`)?.weak || []) sources.set(typeId, [...(sources.get(typeId) || []), `${week.index + 1}주 ${d}차시 데일리`]);
  for (const typeId of state.bookTest?.weak || []) sources.set(typeId, [...(sources.get(typeId) || []), "권별 테스트"]);
  const weak = [...sources].map(([typeId, where]) => ({ type: typeById(typeId), where })).filter((entry) => entry.type);
  if (!weak.length) {
    $("weak").innerHTML = `<h2 id="weakHeading">약점 유형</h2><p class="ms-empty">${state.weeks.some((week) => week.test?.marked) || state.bookTest?.marked ? "약점 유형이 없어요. 잘하고 있어요!" : "단원 평가를 보면 약한 유형을 여기에 모아 줘요."}</p>`;
    return;
  }
  const picks = weak.flatMap(({ type }) => [0, 1].map(() => `${type.id}~practice~약점 유형`)).join("|");
  const href = link("index.html", { mode: "curriculum", book: book.id, picks, build: "1", as: "student", title: `${book.label} 약점 유형 다시 공부하기` });
  $("weak").innerHTML = `<h2 id="weakHeading">약점 유형 <small>${weak.length}가지</small></h2>
    <ul class="ms-weak-list">${weak.map(({ type, where }) => `<li><b>${esc(type.label)}</b><small>${esc(type.middle)} · ${esc([...new Set(where)].join(" · "))}</small></li>`).join("")}</ul>
    <a class="ms-btn primary" href="${esc(href)}">약점 유형 다시 공부하기 · ${weak.length}유형 × 2문제 ›</a>`;
}

function render() {
  const book = CURRICULUM.find((entry) => entry.id === bookId);
  const state = bookState(book);
  renderBooks();
  renderSummary(book, state);
  renderWeeks(book, state);
  renderWeak(book, state);
  document.title = `내 학습 상황 · ${book.label}`;
  $("backLink").href = link("start.html", { book: book.id });
  const me = loggedIn();
  if (me?.type === "admin") $("backLink").href = `./teacher.html?${new URLSearchParams({ book: book.id })}`;
  $("note").textContent = me?.type === "admin" ? `선생님 보기 · ${student} 학생의 서버 기록이에요.` : synced ? "로그인한 기록이에요. 다른 기기에서 공부한 것도 함께 보여요." : "이 기기에 저장된 기록이에요. 로그인하면 다른 기기에서도 이어서 보여요.";
}

$("studentName").textContent = student;
$("planLink").href = link("plan.html", {});
// 머리줄: 로그인했으면 로그아웃, 아니면 로그인(승인 페이지)
function paintWho() {
  const me = loggedIn();
  $("who").innerHTML = me ? `<button type="button" id="logoutBtn">로그아웃</button>` : `<a href="./login.html?next=my-study.html">로그인</a>`;
  document.getElementById("logoutBtn")?.addEventListener("click", async () => { await logout(); location.assign("./login.html?next=my-study.html"); });
}
paintWho();
$("books").addEventListener("click", (event) => {
  const button = event.target.closest("[data-book]");
  if (!button) return;
  bookId = button.dataset.book;
  const url = new URL(location.href); url.searchParams.set("book", bookId); history.replaceState(null, "", url);
  render();
});
({ records, synced } = await loadRecords(student));
// 권을 안 정했으면 가장 최근에 공부한 권
if (!bookId) {
  const latest = [...records.values()].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
  bookId = latest?.key?.split("-u")[0] || CURRICULUM[0].id;
  if (!CURRICULUM.some((book) => book.id === bookId)) bookId = CURRICULUM[0].id;
}
render();
