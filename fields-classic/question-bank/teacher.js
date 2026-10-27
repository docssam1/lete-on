import { CURRICULUM, typeById } from "./source-data.js?v=20261024r";
import { checkSession, loadClass, logout, weekRate } from "./study-progress.js?v=20261028g";

// 선생님 보기(원장 2026-10-27): 학생마다 권·주차 수행률, 단원 평가·권별 테스트 점수, 약점 유형. 학생 이름을 누르면 그 학생의 「내 학습 상황」.
// 관리자(DOCSSAM) 세션만 연다 — 기록은 서버(fields-progress class)에서. 로그인하지 않고 공부한 기록(데모)은 그 기기에만 있어 여기 안 보인다.
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
let bookId = CURRICULUM.some((book) => book.id === params.get("book")) ? params.get("book") : CURRICULUM[0].id;
let byStudent = new Map();
let students = [];

const when = (iso) => {
  if (!iso) return "–";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return days <= 0 ? "오늘" : days === 1 ? "어제" : days < 30 ? `${days}일 전` : new Date(iso).toLocaleDateString("ko-KR");
};
function studentBook(name, book) {
  const rec = byStudent.get(name) || new Map();
  const get = (kind, key) => rec.get(`${kind}:${key}`) || null;
  const weeks = book.units.map((unit, index) => {
    const key = `${book.id}-u${index}`, week = get("week", key), test = get("test", key);
    return { week: week?.payload, test: test?.payload, rate: weekRate(week?.payload, test?.payload), at: week?.updatedAt || test?.updatedAt };
  });
  const bookTest = get("book-test", book.id);
  const done = bookTest?.payload?.marked >= bookTest?.payload?.total;
  const rate = Math.round((weeks.reduce((sum, week) => sum + week.rate, 0) + (done ? 100 : 0)) / (weeks.length + 1));
  const weak = [...new Set([...weeks.flatMap((week) => week.test?.weak || []), ...(bookTest?.payload?.weak || [])])];
  const latest = [...rec.values()].filter((entry) => entry.key.startsWith(book.id)).map((entry) => entry.updatedAt).sort().at(-1);
  return { weeks, bookTest: bookTest?.payload, rate, weak, latest };
}

function render() {
  const book = CURRICULUM.find((entry) => entry.id === bookId);
  const rows = students.map((name) => ({ name, ...studentBook(name, book) })).sort((a, b) => String(b.latest || "").localeCompare(String(a.latest || "")) || a.name.localeCompare(b.name, "ko"));
  const started = rows.filter((row) => row.latest);
  $("books").innerHTML = CURRICULUM.map((entry) => {
    const count = students.filter((name) => studentBook(name, entry).latest).length;
    return `<button type="button" data-book="${entry.id}" class="${entry.id === bookId ? "is-on" : ""}" aria-pressed="${entry.id === bookId}"><b>${esc(entry.label)}</b><small>${count ? `${count}명` : "–"}</small><i style="--rate:${students.length ? Math.round((count / students.length) * 100) : 0}%"></i></button>`;
  }).join("");
  const avg = started.length ? Math.round(started.reduce((sum, row) => sum + row.rate, 0) / started.length) : 0;
  const tests = started.flatMap((row) => row.weeks.filter((week) => week.test?.marked).map((week) => week.test.right / week.test.total));
  $("summary").innerHTML = `
    <div class="ms-stat"><span>학생</span><b>${students.length}<small>명</small></b><small>승인된 학생</small></div>
    <div class="ms-stat"><span>${esc(book.label)} 공부 중</span><b>${started.length}<small>명</small></b><small>기록이 있는 학생</small></div>
    <div class="ms-stat ms-rate"><span>평균 수행률</span><b>${avg}<small>%</small></b><i style="--rate:${avg}%"></i><small>공부 중인 학생 기준</small></div>
    <div class="ms-stat"><span>단원 평가 평균</span><b>${tests.length ? Math.round((tests.reduce((a, b) => a + b, 0) / tests.length) * 100) : "–"}${tests.length ? "<small>%</small>" : ""}</b><small>${tests.length}번 채점</small></div>`;
  const head = `<thead><tr><th>학생</th>${book.units.map((unit, index) => `<th title="${esc(unit.label)}">${index + 1}주</th>`).join("")}<th>권별 테스트</th><th>약점 유형</th><th>최근</th></tr></thead>`;
  const body = rows.map((row) => `<tr class="${row.latest ? "" : "is-idle"}">
    <th><a href="./my-study.html?${new URLSearchParams({ student: row.name, book: book.id })}">${esc(row.name)}</a></th>
    ${row.weeks.map((week) => `<td><i class="ms-bar" style="--rate:${week.rate}%"></i><span>${week.rate ? `${week.rate}%` : "–"}</span>${week.test?.marked ? `<small>평가 ${week.test.right}/${week.test.total}</small>` : ""}</td>`).join("")}
    <td>${row.bookTest?.marked ? `<b>${row.bookTest.right}</b>/${row.bookTest.total}` : "–"}</td>
    <td>${row.weak.length ? `<span class="ms-weak-count">${row.weak.length}</span>` : "–"}</td>
    <td>${when(row.latest)}</td></tr>`).join("");
  $("classTable").innerHTML = head + `<tbody>${body}</tbody>`;
  $("classCount").textContent = `${rows.length}명 · 이름을 누르면 그 학생의 학습 상황`;
  // 반 전체에서 많이 틀린 유형 → 그 유형으로 학습지 만들기(문제은행 2단계 상세 편집으로)
  const counts = new Map();
  for (const row of rows) for (const typeId of row.weak) counts.set(typeId, (counts.get(typeId) || 0) + 1);
  const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([typeId, count]) => ({ type: typeById(typeId), count })).filter((entry) => entry.type);
  $("weak").hidden = false;
  if (!top.length) $("weak").innerHTML = `<h2>반 전체 약점 유형</h2><p class="ms-empty">아직 채점한 단원 평가·권별 테스트가 없어요.</p>`;
  else {
    const picks = top.flatMap(({ type }) => [0, 1].map(() => `${type.id}~practice~반 약점 유형`)).join("|");
    $("weak").innerHTML = `<h2>반 전체 약점 유형 <small>많이 틀린 순</small></h2>
      <ul class="ms-weak-list">${top.map(({ type, count }) => `<li><b>${esc(type.label)}</b><small>${esc(type.middle)} · ${count}명</small></li>`).join("")}</ul>
      <a class="ms-btn primary" href="./index.html?${new URLSearchParams({ mode: "curriculum", book: book.id, picks, build: "1", title: `${book.label} 반 약점 유형 학습지` })}">이 유형들로 학습지 만들기 · ${top.length}유형 × 2문제 ›</a>`;
  }
  for (const id of ["books", "summary", "classBox"]) $(id).hidden = false;
}

$("books").addEventListener("click", (event) => {
  const button = event.target.closest("[data-book]");
  if (!button) return;
  bookId = button.dataset.book;
  const url = new URL(location.href); url.searchParams.set("book", bookId); history.replaceState(null, "", url);
  render();
});

const me = await checkSession();
if (!me || me.type !== "admin") {
  $("status").innerHTML = `선생님(관리자)으로 로그인해야 볼 수 있어요. <a class="ms-btn primary" href="./login.html?next=teacher.html">로그인 ›</a>`;
} else {
  $("who").innerHTML = `<span>${esc(me.name)}</span><button type="button" id="logoutBtn">로그아웃</button>`;
  $("logoutBtn").addEventListener("click", async () => { await logout(); location.assign("./login.html?next=teacher.html"); });
  const data = await loadClass().catch(() => null);
  if (!data) $("status").textContent = "기록을 불러오지 못했어요. 새로고침해 주세요.";
  else {
    $("status").textContent = "로그인한 학생의 기록이에요. 로그인 없이(데모) 공부한 것은 그 기기에만 있어요.";
    for (const row of data.records || []) {
      if (!byStudent.has(row.student_name)) byStudent.set(row.student_name, new Map());
      byStudent.get(row.student_name).set(`${row.kind}:${row.record_key}`, { key: row.record_key, payload: row.payload, updatedAt: row.updated_at });
    }
    students = [...new Set([...(data.students || []).map((entry) => entry.name), ...byStudent.keys()])];
    render();
  }
}
