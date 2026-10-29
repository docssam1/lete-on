import { CURRICULUM } from "./source-data.js?v=20261028m";
import { loadRecords, saveRecord } from "./study-progress.js?v=20261028n";
import { sessionCount } from "./study-deck.js?v=20261029f";
import { HOLIDAYS, WEEKDAYS, defaultPlan, sessionSequence, schedule, parseYmd, today } from "./study-plan.js?v=20261029g";

// 학습 진도표 화면 — 계산은 study-plan.js. 계획은 학생 기록 plan/main 에 둔다(이 기기 + 로그인하면 서버).
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const link = (page, entries) => `./${page}?${new URLSearchParams({ student, ...entries })}`;
const bookById = (id) => CURRICULUM.find((book) => book.id === id) || CURRICULUM[0];

let records = new Map();
const get = (kind, key) => records.get(`${kind}:${key}`)?.payload || null;
let plan = defaultPlan(CURRICULUM);

function save() {
  saveRecord(student, "plan", "main", plan);
  records.set("plan:main", { kind: "plan", key: "main", payload: plan, updatedAt: new Date().toISOString() });
}
// 그 차시를 끝냈나: 차시 끝의 데일리 테스트·단원 평가까지 갔거나 그 테스트를 채점했으면
function sessionDone(session) {
  const key = `${session.book}-u${session.unit}`;
  const week = get("week", key);
  const kind = session.lastPart ? "test" : "daily";
  if ((week?.seen || []).some((id) => id.startsWith(`p${session.part}:${kind}:`))) return true;
  const test = get("test", session.lastPart ? key : `${key}-d${session.part}`);
  return Boolean(test?.marked);
}
const dayText = (date) => { const d = parseYmd(date); return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`; };
const sessionText = (s) => `${s.bookLabel} ${s.unit + 1}단원 ${s.part}차시`;
const sessionTags = (s) => [s.lastPart ? "단원 평가" : "데일리 테스트", ...(s.booktest ? ["권별 테스트"] : [])];
const toggle = (list, date) => (list.includes(date) ? list.filter((entry) => entry !== date) : [...list, date].sort());

// ── 계획 정하기 ──
function renderSetup() {
  $("startDate").value = plan.start;
  $("days").innerHTML = WEEKDAYS.map((label, day) => `<button type="button" data-day="${day}" aria-pressed="${plan.days.includes(day)}">${label}</button>`).join("");
  $("fromBook").innerHTML = CURRICULUM.map((book) => `<option value="${book.id}"${book.id === plan.from.book ? " selected" : ""}>${esc(book.label)}</option>`).join("");
  const fromBook = bookById(plan.from.book);
  $("fromUnit").innerHTML = fromBook.units.map((unit, k) => `<option value="${k}"${k === plan.from.unit ? " selected" : ""}>${k + 1}단원 · ${esc(unit.label)}</option>`).join("");
  const parts = sessionCount(fromBook.units[plan.from.unit] || fromBook.units[0]);
  $("fromPart").innerHTML = Array.from({ length: parts }, (_, k) => `<option value="${k + 1}"${k + 1 === plan.from.part ? " selected" : ""}>${k + 1}차시</option>`).join("");
  const firstIndex = CURRICULUM.findIndex((book) => book.id === plan.from.book);
  $("toBook").innerHTML = CURRICULUM.slice(firstIndex).map((book) => `<option value="${book.id}"${book.id === plan.toBook ? " selected" : ""}>${esc(book.label)}까지</option>`).join("");
  $("holidays").checked = plan.holidays !== false;
}

function renderPlan() {
  const sessions = sessionSequence(CURRICULUM, plan.from, plan.toBook);
  const rows = schedule(plan, sessions);
  const base = schedule(plan, sessions, { withChanges: false });
  const now = today();
  const classes = rows.filter((row) => row.session && row.type !== "absent");
  const done = sessions.filter(sessionDone).length;
  const endDate = classes.at(-1)?.date, baseEnd = base.filter((row) => row.session && row.type !== "absent").at(-1)?.date;
  const { absent, makeup } = { absent: (plan.absent || []).length, makeup: (plan.makeup || []).length };
  const behind = absent - makeup;
  const current = sessions.find((session) => !sessionDone(session));
  const todayRow = classes.find((row) => row.date >= now);
  $("summary").innerHTML = `
    <div class="ms-stat ms-rate"><span>진도</span><b>${done}<small> / ${sessions.length}차시</small></b><i style="--rate:${sessions.length ? Math.round((done / sessions.length) * 100) : 0}%"></i><small>${current ? `지금: ${esc(sessionText(current))}` : "모두 마쳤어요"}</small></div>
    <div class="ms-stat"><span>다음 수업</span><b class="ms-text">${todayRow ? `${dayText(todayRow.date)}${todayRow.date === now ? " · 오늘" : ""}` : "–"}</b><small>${todayRow ? esc(sessionText(todayRow.session)) : ""}</small></div>
    <div class="ms-stat"><span>밀림</span><b class="${behind > 0 ? "pl-behind" : ""}">${behind > 0 ? `${behind}<small>차시 밀림</small>` : behind < 0 ? `${-behind}<small>차시 앞섬</small>` : "0<small>차시</small>"}</b><small>결석 ${absent}번 · 보강 ${makeup}번</small></div>
    <div class="ms-stat"><span>끝나는 날</span><b class="ms-text">${endDate ? dayText(endDate).replace(" (", "<small> (").replace(")", ")</small>") : "–"}</b><small>${endDate ? `${endDate.slice(0, 4)}년${baseEnd && baseEnd !== endDate ? ` · 처음 계획 ${dayText(baseEnd)}` : ""}` : "수업 요일을 골라요"}</small></div>`;
  // 달마다 묶어서
  let month = "";
  const body = rows.map((row) => {
    const head = row.date.slice(0, 7) !== month ? (month = row.date.slice(0, 7), `<tr class="pl-month"><th colspan="4">${Number(month.slice(0, 4))}년 ${Number(month.slice(5))}월</th></tr>`) : "";
    const isToday = row.date === now ? " is-today" : "";
    if (row.type === "holiday") return `${head}<tr class="pl-rest${isToday}"><td>${dayText(row.date)}</td><td colspan="2">${esc(row.label)} · 쉬어요</td><td></td></tr>`;
    if (row.type === "off") return `${head}<tr class="pl-rest${isToday}"><td>${dayText(row.date)}</td><td colspan="2">쉬는 날</td><td><button type="button" class="pl-act" data-off="${row.date}">취소</button></td></tr>`;
    if (row.type === "absent") return `${head}<tr class="pl-absent${isToday}"><td>${dayText(row.date)}</td><td colspan="2">결석 · ${esc(sessionText(row.session))}는 다음 수업으로 밀려요</td><td><button type="button" class="pl-act" data-absent="${row.date}">결석 취소</button></td></tr>`;
    const s = row.session, finished = sessionDone(s);
    const state = finished ? `<span class="pl-state is-done">✓ 완료</span>` : row.date === now ? `<span class="pl-state is-now">오늘</span>` : row.date < now ? `<span class="pl-state is-late">아직 안 했어요</span>` : `<span class="pl-state">예정</span>`;
    const act = row.type === "makeup"
      ? `<button type="button" class="pl-act" data-makeup="${row.date}">보강 취소</button>`
      : finished ? "" : `<button type="button" class="pl-act" data-absent="${row.date}">결석</button>`;
    return `${head}<tr class="${row.type === "makeup" ? "pl-makeup" : ""}${finished ? " is-done" : ""}${isToday}"><td>${dayText(row.date)}${row.type === "makeup" ? ` <em class="pl-tag">보강</em>` : ""}</td>
      <td><a href="${esc(link("study.html", { book: s.book, unit: String(s.unit), part: String(s.part) }))}"><b>${esc(sessionText(s))}</b> <span>${esc(s.unitLabel)}</span></a><small>${sessionTags(s).map(esc).join(" · ")}</small></td>
      <td>${state}</td><td>${act}</td></tr>`;
  }).join("");
  $("table").innerHTML = rows.length ? `<table class="pl-table"><thead><tr><th>날짜</th><th>진도</th><th>상태</th><th></th></tr></thead><tbody>${body}</tbody></table>` : `<p class="ms-empty">수업 요일을 하나 이상 골라요.</p>`;
  $("tableNote").textContent = `${sessions.length}차시 · ${plan.days.map((day) => WEEKDAYS[day]).join("·")}요일${plan.holidays !== false ? " · 명절 뺌" : ""}`;
  const holidayNames = HOLIDAYS.filter(({ dates }) => dates.some((date) => date >= plan.start && (!endDate || date <= endDate))).map(({ name, dates }) => `${name}(${dates[0].slice(0, 4)})`);
  $("note").textContent = `결석을 누르면 그날 차시가 다음 수업으로 밀리고, 보강 날을 더하면 한 차시씩 당겨져요.${holidayNames.length ? ` 빼는 명절: ${holidayNames.join(" · ")}.` : ""}`;
}
function render() { renderSetup(); renderPlan(); }

// ── 조작 ──
const change = (fn) => { fn(); save(); render(); };
$("startDate").addEventListener("change", (event) => event.target.value && change(() => { plan.start = event.target.value; }));
$("days").addEventListener("click", (event) => { const button = event.target.closest("[data-day]"); if (button) change(() => { plan.days = toggle(plan.days.map(String), button.dataset.day).map(Number).sort(); }); });
$("fromBook").addEventListener("change", (event) => change(() => {
  plan.from = { book: event.target.value, unit: 0, part: 1 };
  if (CURRICULUM.findIndex((book) => book.id === plan.toBook) < CURRICULUM.findIndex((book) => book.id === plan.from.book)) plan.toBook = plan.from.book;
}));
$("fromUnit").addEventListener("change", (event) => change(() => { plan.from = { ...plan.from, unit: Number(event.target.value), part: 1 }; }));
$("fromPart").addEventListener("change", (event) => change(() => { plan.from = { ...plan.from, part: Number(event.target.value) }; }));
$("toBook").addEventListener("change", (event) => change(() => { plan.toBook = event.target.value; }));
$("holidays").addEventListener("change", (event) => change(() => { plan.holidays = event.target.checked; }));
$("offForm").addEventListener("submit", (event) => { event.preventDefault(); const date = $("offDate").value; if (date) change(() => { plan.off = toggle(plan.off || [], date); }); });
$("makeupForm").addEventListener("submit", (event) => { event.preventDefault(); const date = $("makeupDate").value; if (date) change(() => { plan.makeup = toggle(plan.makeup || [], date); }); });
$("table").addEventListener("click", (event) => {
  const button = event.target.closest(".pl-act");
  if (!button) return;
  if (button.dataset.absent) change(() => { plan.absent = toggle(plan.absent || [], button.dataset.absent); });
  if (button.dataset.makeup) change(() => { plan.makeup = toggle(plan.makeup || [], button.dataset.makeup); });
  if (button.dataset.off) change(() => { plan.off = toggle(plan.off || [], button.dataset.off); });
});
$("printBtn").addEventListener("click", () => print());
$("studentName").textContent = student;
$("backLink").href = link("my-study.html", {});

({ records } = await loadRecords(student));
const saved = get("plan", "main");
if (saved?.start && Array.isArray(saved.days)) plan = { ...defaultPlan(CURRICULUM), ...saved };
// 처음 열면 시작 진도를 지금 공부하는 곳으로(가장 최근 학습 기록)
else {
  const latest = [...records.values()].filter((row) => row.kind === "week").sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
  const match = latest?.key?.match(/^(book-\d+)-u(\d+)$/);
  if (match) plan.from = { book: match[1], unit: Number(match[2]), part: Number(latest.payload?.part) || 1 };
  if (params.get("book") && !match) plan.from = { book: bookById(params.get("book")).id, unit: 0, part: 1 };
}
render();
