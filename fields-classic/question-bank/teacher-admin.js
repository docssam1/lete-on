import { CURRICULUM } from "./source-data.js?v=20261111g";
import { memberCall } from "./study-progress.js?v=20261111p";
import { FIELDS_BOOKS, membershipSummary, directSummary } from "./gm-plan.js?v=20261114a";

// 관리자 화면(원장 2026-11-14 「모의고사 회원도 있고 gm 관리 과정 회원도 있겠지? 어드민 좀 쉽게 조작할 수 있도록 바꾸고
// 그리고 gm과정을 권별 이나 기간 둘로 나눠 관리할 수 있도록」):
//   「GM 회원」 탭 — 모든 승인번호(이메일 가입 + 원장이 만든 것). 사람을 누르면 오른쪽에 설정 칸:
//      GM 여는 방식 = 정하지 않음(이메일 회원은 체험·정규 규칙, 원장이 만든 번호는 닫힘) | 권별(고른 권만) | 기간(시작일~끝나는 날, 한 달에 1권씩)
//      + 이메일 회원이면 정규회원 승인·체험 연장·멈춤·시작 진도·메모, 누구든 새 승인번호·사용 중지
//   「모의고사 회원」 탭 — 원장이 만든 승인번호의 모의고사(필즈 더 클래식 대비) 회차 열기/닫기. 회차별 콘텐츠·자료실 편집은 ../admin.html 그대로.
// 서버 함수 fields-members(admin-access · admin-gm · admin-update · admin-reissue · admin-account-create · admin-account-set), 관리자(DOCSSAM) 세션으로만.
// 새 승인번호는 화면에 한 번만 보이고 어디에도 저장하지 않는다.
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const bookNo = (id) => Number(String(id || "").slice(5)) || 1;
// 날짜만(YYYY-MM-DD)은 글자 그대로 읽는다 — 시간대에 따라 하루 밀리지 않게
const parts = (iso) => { const t = String(iso || ""); if (/^\d{4}-\d{2}-\d{2}$/.test(t)) { const [y, m, d] = t.split("-").map(Number); return [y, m, d]; } const d = new Date(t); return [d.getFullYear(), d.getMonth() + 1, d.getDate()]; };
const md = (iso) => { if (!iso) return "–"; const [, m, d] = parts(iso); return `${m}/${d}`; };
const ymd = (iso) => { if (!iso) return ""; const [y, m, d] = parts(iso); return `${y}. ${m}. ${d}.`; };
const today = () => new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
const addMonthsYmd = (from, n) => { const d = new Date(`${from}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + n); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); };
const phone = (p) => String(p || "").replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
const DAY = 86400000;
const ago = (iso) => {
  if (!iso) return "접속 기록 없음";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
  return days <= 0 ? "오늘 접속" : days === 1 ? "어제 접속" : days < 30 ? `${days}일 전 접속` : `${md(iso)} 접속`;
};
const ERR = { name_taken: "이미 있는 이름이에요.", child_invalid: "이름을 확인해 주세요(20자까지).", code_invalid: "승인번호는 영문·숫자 4~20자예요.", code_weak: "너무 쉬운 승인번호예요(같은 글자·차례·이름).",
  code_taken: "다른 사람이 쓰는 승인번호예요.", books_required: "열 권을 하나 이상 골라 주세요.", date_invalid: "날짜를 확인해 주세요.", date_order: "끝나는 날이 시작일보다 앞이에요.", account_not_found: "승인번호를 찾지 못했어요." };
const why = (error) => ERR[error.message] || error.message;

// 모의고사 회차(../admin.html PRODUCTS와 같은 차례 · 서버 PRODUCT_IDS)
const PRODUCTS = [
  { id: "개념완성", name: "개념완성" }, { id: "연산연습", name: "연산 연습" }, { id: "진단모의고사", name: "진단모의고사" },
  { id: "진단약점클리닉", name: "진단 + 약점 클리닉", manualOnly: true, grants: ["진단모의고사"] }, { id: "킬러문항", name: "킬러문항" },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ id: `실전모의고사${n}회`, name: `실전 ${n}회` })),
  ...[1, 2, 3].map((n) => ({ id: `파이널모의고사${n}회`, name: `파이널 ${n}회` })),
  { id: "마무리점검", name: "마무리 점검" }, { id: "강사용교안", name: "강사용 교안", manualOnly: true },
];
const MOCK_IDS = PRODUCTS.filter((p) => p.id !== "강사용교안").map((p) => p.id);

let accounts = [];
let onChange = () => {};
const gmView = { filter: "all", query: "", selected: "", draft: null, creating: false, code: null };
const mockView = { filter: "all", query: "", selected: "", adding: false, codes: null };
const byName = (name) => accounts.find((a) => a.name === name);
const typeLabel = (a) => a.member ? "이메일 가입" : a.type === "online" ? "온라인" : "재원생";

// ── GM 상태 한 줄 ──
export function gmState(a) {
  const g = a.gm || {};
  if (!a.active) return { text: "사용 중지", cls: "is-paused", open: false };
  if (g.reason === "paused") return { text: "멈춤", cls: "is-paused", open: false };
  if (g.plan?.mode === "book") return g.open ? { text: `권별 · ${g.books.map(bookNo).join("·")}권`, cls: "is-approved", open: true } : { text: "권별 · 고른 권 없음", cls: "is-off", open: false };
  if (g.plan?.mode === "period") {
    if (g.reason === "period_ended") return { text: `기간 끝 · ${md(g.plan.endsOn)}`, cls: "is-ended", open: false };
    if (g.reason === "not_started") return { text: `${md(g.plan.startsOn)}부터 기간`, cls: "is-trial", open: false };
    return { text: `기간 · 1~${bookNo(g.upTo)}권${g.plan.endsOn ? ` · ${md(g.plan.endsOn)}까지` : ""}`, cls: "is-approved", open: true };
  }
  if (a.member) {
    if (g.reason === "trial_expired") return { text: "체험 끝", cls: "is-ended", open: false };
    if (g.status === "trial") return { text: `체험 · ${Math.max(0, Math.ceil((new Date(g.trialUntil).getTime() - Date.now()) / DAY))}일 남음`, cls: "is-trial", open: true };
    return { text: `정규 · 1~${bookNo(g.upTo)}권`, cls: "is-approved", open: true };
  }
  return { text: "GM 안 열림", cls: "is-off", open: false };
}
const asks = (a) => {
  const m = a.member;
  if (!m) return [];
  return [m.approvalRequestedAt && m.status !== "approved" && !m.plan ? `정규 요청 ${md(m.approvalRequestedAt)}` : "", m.bookRequestedAt ? `다음 권 요청 ${md(m.bookRequestedAt)}` : ""].filter(Boolean);
};
const endsSoon = (a) => { const e = a.gm?.plan?.mode === "period" && a.gm.open && a.gm.plan.endsOn; return Boolean(e) && new Date(`${e}T23:59:59+09:00`).getTime() - Date.now() < 14 * DAY; };

const GM_FILTERS = [["ask", "요청 있음", (a) => asks(a).length > 0], ["open", "GM 열림", (a) => gmState(a).open], ["soon", "기간 곧 끝남", endsSoon],
  ["closed", "안 열림·끝남", (a) => !gmState(a).open], ["email", "이메일 가입", (a) => Boolean(a.member)], ["all", "전체", () => true]];
const MOCK_FILTERS = [["all", "전체", () => true], ["internal", "재원생", (a) => a.type !== "online"], ["online", "온라인", (a) => a.type === "online"],
  ["mock", "회차 열린 사람", (a) => a.permissions.some((id) => MOCK_IDS.includes(id))], ["teach", "강사용 교안", (a) => a.permissions.includes("강사용교안")], ["off", "사용 중지", (a) => !a.active]];

function filterBar(id, filters, current, rows) {
  $(id).innerHTML = filters.map(([key, label, test]) => `<button type="button" data-filter="${key}" class="${key === current ? "is-on" : ""}" aria-pressed="${key === current}">${label} <small>${rows.filter(test).length}</small></button>`).join("");
}
const matches = (a, q) => !q || a.name.toLowerCase().includes(q.toLowerCase()) || String(a.member?.email || "").toLowerCase().includes(q.toLowerCase());

// ════════ GM 회원 ════════
function gmRows() {
  const test = GM_FILTERS.find(([key]) => key === gmView.filter)?.[2] || (() => true);
  return accounts.filter((a) => test(a) && matches(a, gmView.query))
    .sort((a, b) => asks(b).length - asks(a).length || String(b.lastSeen || "").localeCompare(String(a.lastSeen || "")) || a.name.localeCompare(b.name, "ko"));
}
function renderGmList() {
  filterBar("gmFilter", GM_FILTERS, gmView.filter, accounts.filter((a) => matches(a, gmView.query)));
  const rows = gmRows();
  $("gmList").innerHTML = rows.map((a) => {
    const s = gmState(a), req = asks(a);
    return `<li><button type="button" data-name="${esc(a.name)}" aria-pressed="${a.name === gmView.selected}">
      <span class="ad-row-top"><b>${esc(a.name)}</b>${a.online ? `<em class="ms-online">지금 접속</em>` : ""}<span class="ms-status ${s.cls}">${esc(s.text)}</span></span>
      <small>${esc(typeLabel(a))} · ${esc(ago(a.lastSeen))}</small>${req.length ? `<span class="ad-asks">${req.map((r) => `<em class="ms-ask">${esc(r)}</em>`).join("")}</span>` : ""}</button></li>`;
  }).join("") || `<li class="ad-empty">${gmView.filter === "ask" ? "새 요청이 없어요." : "해당하는 사람이 없어요."}</li>`;
  $("gmCount").textContent = `${accounts.length}`;
}

function draftFrom(a) {
  const p = a.gm?.plan;
  if (p) return { mode: p.mode, books: new Set(p.books), startBook: p.startBook || "book-01", startsOn: p.startsOn || today(), endsOn: p.endsOn || "", extraBooks: p.extraBooks || 0 };
  const start = a.member?.start?.book || "book-01";
  return { mode: "none", books: new Set([start]), startBook: start, startsOn: today(), endsOn: "", extraBooks: 0 };
}
// 저장하면 어떻게 열리는지(서버와 같은 규칙, gm-plan.js)
function previewText(a, d) {
  const planRow = d.mode === "none" ? null : { mode: d.mode, books: [...d.books], start_book: d.startBook, starts_on: d.startsOn, ends_on: d.endsOn || null, extra_books: d.extraBooks };
  const raw = a.member ? { status: a.member.status, trial_until: a.member.trialUntil, approved_at: a.member.approvedAt, created_at: a.member.createdAt, start_book: a.member.start?.book, extra_books: a.member.extraBooks } : null;
  const g = raw ? membershipSummary(raw, planRow) : directSummary(planRow);
  if (!g.open) return { cls: "is-warn", text: { gm_none: d.mode === "book" ? "고른 권이 없어 스스로 공부가 닫혀요(1권 1단원 둘러보기만)." : "스스로 공부가 닫혀 있어요 — 1권 1단원만 둘러볼 수 있어요.", period_ended: `기간이 ${ymd(d.endsOn)}에 끝나 닫혀요.`, not_started: `${ymd(d.startsOn)}부터 열려요.`, trial_expired: "체험이 끝나 로그인할 수 없어요.", paused: "멈춤 상태라 로그인할 수 없어요." }[g.reason] || "닫혀요." };
  const list = g.books.map(bookNo);
  const range = d.mode === "book" || !list.length ? `${list.join("·")}권` : `1~${list.at(-1)}권`;
  return { cls: "", text: `지금 ${range} 열림${g.nextOpensAt ? ` · 다음 권 ${md(g.nextOpensAt)}` : ""}${d.mode === "period" ? (d.endsOn ? ` · ${ymd(d.endsOn)}까지` : " · 끝나는 날 없음") : ""}` };
}

function renderGmDetail() {
  const box = $("gmDetail");
  if (gmView.creating) { box.innerHTML = createForm(); return; }
  const a = byName(gmView.selected);
  if (!a) { box.innerHTML = `<div class="ad-hint"><b>목록에서 사람을 고르세요.</b><p>고르면 여기서 스스로 공부(GM 과정)를 <b>권별</b>이나 <b>기간</b>으로 열 수 있어요.</p><p>모의고사 회차는 위의 「모의고사 회원」 탭에서 열어요.</p></div>`; return; }
  const d = gmView.draft || (gmView.draft = draftFrom(a));
  const s = gmState(a), m = a.member, pv = previewText(a, d);
  const bookSelect = (sel) => FIELDS_BOOKS.map((id) => `<option value="${id}"${id === sel ? " selected" : ""}>${bookNo(id)}권</option>`).join("");
  const noneHint = m ? "가입 규칙대로 — 체험 2주는 시작 권 1권, 정규회원 승인 뒤에는 한 달에 1권씩 열려요." : "스스로 공부가 닫혀 있어요(1권 1단원 둘러보기만). 모의고사만 쓰는 학생은 이대로 두세요.";
  box.innerHTML = `<header class="ad-who"><div><h3>${esc(a.name)}</h3><small>${esc(typeLabel(a))} · ${esc(ago(a.lastSeen))}${a.logins30 ? ` · 30일 ${a.logins30}번 로그인` : ""}</small></div><span class="ms-status ${s.cls}">${esc(s.text)}</span></header>
    ${gmView.code?.name === a.name ? codeBox(gmView.code.code) : ""}
    <section class="ad-block"><h4>스스로 공부(GM 과정) 여는 방식</h4>
      <div class="ad-seg" role="radiogroup" aria-label="여는 방식">${[["none", "정하지 않음"], ["book", "권별"], ["period", "기간"]].map(([key, label]) => `<button type="button" role="radio" data-mode="${key}" aria-checked="${d.mode === key}">${label}</button>`).join("")}</div>
      ${d.mode === "none" ? `<p class="ad-help">${noneHint}</p>` : ""}
      ${d.mode === "book" ? `<p class="ad-help">고른 권만 열려요. 기한은 없어요.</p>
        <div class="ad-books" role="group" aria-label="열 권">${FIELDS_BOOKS.map((id) => `<button type="button" data-book="${id}" aria-pressed="${d.books.has(id)}">${bookNo(id)}권</button>`).join("")}</div>
        <div class="ad-mini"><button type="button" data-books="all">모두 고르기</button><button type="button" data-books="none">모두 빼기</button></div>` : ""}
      ${d.mode === "period" ? `<p class="ad-help">시작일부터 시작 권이 열리고, 한 달마다 1권씩 더 열려요. 끝나는 날이 지나면 닫혀요.</p>
        <div class="ad-form">
          <label>시작 권<select data-field="startBook">${bookSelect(d.startBook)}</select></label>
          <label>시작일<input type="date" data-field="startsOn" value="${esc(d.startsOn)}" /></label>
          <label>끝나는 날<input type="date" data-field="endsOn" value="${esc(d.endsOn)}" /></label>
          <div class="ad-mini" aria-label="끝나는 날 빨리 정하기">${[1, 3, 6, 12].map((n) => `<button type="button" data-months="${n}">${n === 12 ? "1년" : `${n}개월`}</button>`).join("")}<button type="button" data-months="0">끝나는 날 없음</button></div>
          <label>더 연 권<span class="ad-step"><button type="button" data-extra="-1" aria-label="한 권 빼기">−</button><b>${d.extraBooks}</b><button type="button" data-extra="1" aria-label="한 권 더">+</button></span></label>
        </div>` : ""}
      <p class="ad-preview ${pv.cls}">저장하면: <b>${esc(pv.text)}</b></p>
      <div class="ad-actions"><button type="button" class="ms-btn primary" data-act="save-gm">저장</button><button type="button" class="ms-btn" data-act="reset-gm">되돌리기</button></div>
    </section>
    ${m ? `<section class="ad-block"><h4>이메일 가입 회원</h4>
      <p class="ad-kv"><span>가입</span><b>${md(m.createdAt)} · ${m.level === "kinder" ? `유치 ${m.age}세` : `초${m.grade}`}</b></p>
      <p class="ad-kv"><span>연락</span><b>${esc(m.email)} · 보호자 ${esc(phone(m.guardianPhone))}${m.childPhone ? ` · 아이 ${esc(phone(m.childPhone))}` : ""}</b></p>
      <p class="ad-kv"><span>회원 상태</span><b>${m.status === "paused" ? "멈춤" : m.status === "approved" ? `정규회원(${md(m.approvedAt)} 승인)` : `체험 · ${md(m.trialUntil)}까지`}</b></p>
      ${asks(a).length ? `<p class="ad-kv"><span>요청</span><b>${asks(a).map((r) => `<em class="ms-ask">${esc(r)}</em>`).join(" ")}</b></p>` : ""}
      <div class="ad-actions">${m.status !== "approved" ? `<button type="button" class="ms-btn primary" data-op="approve">정규회원 승인</button>` : ""}${m.status === "trial" ? `<button type="button" class="ms-btn" data-op="trial">체험 +14일</button>` : ""}${m.bookRequestedAt && !a.gm?.plan && m.status === "approved" ? `<button type="button" class="ms-btn" data-op="grant-book">권 +1</button>` : ""}${m.status === "paused" ? `<button type="button" class="ms-btn" data-op="resume">다시 열기</button>` : `<button type="button" class="ms-btn" data-op="pause">멈춤</button>`}</div>
      <div class="ad-form"><label>시작 진도<span class="ad-inline"><select data-start="book">${bookSelect(m.start?.book)}</select><select data-start="unit">${[0, 1, 2, 3].map((u) => `<option value="${u}"${u === Number(m.start?.unit) ? " selected" : ""}>${u + 1}단원</option>`).join("")}</select></span></label>
        <label>메모<input data-memo value="${esc(m.memo)}" maxlength="200" placeholder="원장만 보는 메모" /></label></div>
    </section>` : ""}
    <section class="ad-block"><h4>승인번호</h4>
      <div class="ad-actions"><button type="button" class="ms-btn" data-act="reissue">새 승인번호 만들기</button><button type="button" class="ms-btn" data-act="active">${a.active ? "사용 중지" : "다시 사용"}</button><a class="ms-btn" href="./my-study.html?${new URLSearchParams({ student: a.name })}">학습 상황 보기 ›</a></div>
      <p class="ad-help">새 번호를 만들거나 사용을 멈추면 지금 로그인이 끊겨요.</p>
    </section>`;
}
const codeBox = (code) => `<div class="ad-code" role="status"><span>새 승인번호 · 지금 한 번만 보여요</span><b>${esc(code)}</b><button type="button" class="ms-btn" data-act="copy-code" data-code="${esc(code)}">복사</button></div>`;
function createForm() {
  return `<header class="ad-who"><div><h3>새 회원 만들기</h3><small>원장이 직접 승인번호를 만들어 줍니다</small></div></header>
    <form class="ad-block ad-form" id="gmCreate">
      <label>이름(아이디)<input name="child" required maxlength="20" autocomplete="off" placeholder="예: 김민지" /></label>
      <label>구분<select name="type"><option value="internal">재원생</option><option value="online">온라인</option></select></label>
      <label>승인번호<input name="code" maxlength="20" autocomplete="off" placeholder="비워 두면 자동으로 만들어요" /></label>
      <p class="ad-help">만든 뒤 오른쪽 칸에서 GM 여는 방식(권별·기간)을 정해요. 정하지 않으면 스스로 공부는 닫혀 있어요.</p>
      <div class="ad-actions"><button type="submit" class="ms-btn primary">만들기</button><button type="button" class="ms-btn" data-act="cancel-create">닫기</button></div>
    </form>`;
}

function renderGm() { renderGmList(); renderGmDetail(); }
const toDetail = (id) => { if (matchMedia("(max-width: 860px)").matches) $(id).scrollIntoView({ behavior: "smooth", block: "start" }); };
function selectGm(name) { gmView.selected = name; gmView.draft = null; gmView.creating = false; if (gmView.code?.name !== name) gmView.code = null; renderGm(); toDetail("gmDetail"); }
const sayTimers = {};
const say = (id, text) => {
  $(id).textContent = text;
  clearTimeout(sayTimers[id]);
  if (!/…$/.test(text)) sayTimers[id] = setTimeout(() => { $(id).textContent = ""; }, 5000);
};

async function saveGm() {
  const a = byName(gmView.selected), d = gmView.draft;
  if (!a || !d) return;
  say("gmMsg", "저장하고 있어요…");
  try {
    const data = await memberCall({ action: "admin-gm", child: a.name, mode: d.mode, books: [...d.books], startBook: d.startBook, startsOn: d.startsOn, endsOn: d.endsOn || null, extraBooks: d.extraBooks });
    a.gm = data.gm; if (data.member) a.member = data.member;
    gmView.draft = null; renderGm(); onChange();
    say("gmMsg", `${a.name} — ${gmState(a).text}로 저장했어요.`);
  } catch (error) { say("gmMsg", `저장하지 못했어요: ${why(error)}`); }
}
async function memberOp(op, extra = {}, done = "") {
  const a = byName(gmView.selected);
  if (!a) return;
  say("gmMsg", "저장하고 있어요…");
  try {
    const data = await memberCall({ action: "admin-update", child: a.name, op, ...extra });
    a.member = data.member; a.gm = data.member;
    gmView.draft = null; renderGm(); onChange();
    say("gmMsg", done);
  } catch (error) { say("gmMsg", `저장하지 못했어요: ${why(error)}`); }
}
async function reissue(name, view, msgId, rerender) {
  if (!confirm(`${name}의 승인번호를 새로 만들까요? 옛 번호와 지금 로그인은 끊겨요.`)) return;
  try { const data = await memberCall({ action: "admin-reissue", child: name }); view.code = { name, code: data.approvalCode }; rerender(); say(msgId, `${name}의 새 승인번호를 만들었어요. 지금 전해 주세요.`); }
  catch (error) { say(msgId, `만들지 못했어요: ${why(error)}`); }
}
async function setAccount(name, patch, msgId, done, rerender) {
  const a = byName(name);
  say(msgId, "저장하고 있어요…");
  try { const data = await memberCall({ action: "admin-account-set", child: name, ...patch }); Object.assign(a, data.account); rerender(); onChange(); say(msgId, done); return true; }
  catch (error) { say(msgId, `저장하지 못했어요: ${why(error)}`); rerender(); return false; }
}

function wireGm() {
  $("gmFilter").addEventListener("click", (event) => { const b = event.target.closest("[data-filter]"); if (b) { gmView.filter = b.dataset.filter; renderGmList(); } });
  $("gmSearch").addEventListener("input", (event) => { gmView.query = event.target.value.trim(); renderGmList(); });
  $("gmList").addEventListener("click", (event) => { const b = event.target.closest("[data-name]"); if (b) selectGm(b.dataset.name); });
  $("gmNew").addEventListener("click", () => { gmView.creating = true; gmView.selected = ""; renderGm(); $("gmDetail").querySelector("input")?.focus(); });
  const box = $("gmDetail");
  box.addEventListener("click", (event) => {
    const t = event.target.closest("button");
    if (!t) return;
    const d = gmView.draft, a = byName(gmView.selected);
    if (t.dataset.mode && d) { d.mode = t.dataset.mode; renderGmDetail(); return; }
    if (t.dataset.book && d) { d.books.has(t.dataset.book) ? d.books.delete(t.dataset.book) : d.books.add(t.dataset.book); renderGmDetail(); return; }
    if (t.dataset.books && d) { d.books = new Set(t.dataset.books === "all" ? FIELDS_BOOKS : []); renderGmDetail(); return; }
    if (t.dataset.months && d) { const n = Number(t.dataset.months); d.endsOn = n ? addMonthsYmd(d.startsOn || today(), n) : ""; renderGmDetail(); return; }
    if (t.dataset.extra && d) { d.extraBooks = Math.min(10, Math.max(0, d.extraBooks + Number(t.dataset.extra))); renderGmDetail(); return; }
    const act = t.dataset.act, op = t.dataset.op;
    if (act === "save-gm") saveGm();
    else if (act === "reset-gm") { gmView.draft = null; renderGmDetail(); say("gmMsg", "저장된 값으로 되돌렸어요."); }
    else if (act === "cancel-create") { gmView.creating = false; renderGmDetail(); }
    else if (act === "copy-code") navigator.clipboard?.writeText(t.dataset.code).then(() => say("gmMsg", "승인번호를 복사했어요."), () => {});
    else if (act === "reissue" && a) reissue(a.name, gmView, "gmMsg", renderGmDetail);
    else if (act === "active" && a) { if (a.active && !confirm(`${a.name}의 승인번호를 사용 중지할까요? 모의고사와 스스로 공부 모두 로그인할 수 없어요.`)) return; setAccount(a.name, { active: !a.active }, "gmMsg", a.active ? `${a.name} 사용 중지.` : `${a.name} 다시 사용.`, renderGm); }
    else if (op && a) {
      if (op === "pause" && !confirm(`${a.name}의 공부를 멈출까요? 로그인이 끊기고 다시 열 때까지 들어올 수 없어요.`)) return;
      memberOp(op, op === "trial" ? { days: 14 } : {}, { approve: `${a.name} 정규회원 승인 — 오늘부터 한 달에 1권씩 열려요(따로 방식을 정하면 그 방식대로).`, trial: `${a.name} 체험 14일 연장.`, "grant-book": `${a.name} 권 1권 더 열었어요.`, pause: `${a.name} 멈춤.`, resume: `${a.name} 다시 열었어요.` }[op]);
    }
  });
  box.addEventListener("change", (event) => {
    const t = event.target, d = gmView.draft, a = byName(gmView.selected);
    if (t.dataset.field && d) { d[t.dataset.field] = t.value; renderGmDetail(); return; }
    if (t.matches("[data-start]") && a) { const book = box.querySelector('[data-start="book"]').value, unit = Number(box.querySelector('[data-start="unit"]').value); memberOp("start", { start: { book, unit, part: 1 } }, `${a.name} 시작 진도 ${bookNo(book)}권 ${unit + 1}단원.`); }
    else if (t.matches("[data-memo]") && a) memberOp("memo", { memo: t.value }, `${a.name} 메모 저장.`);
  });
  box.addEventListener("submit", async (event) => {
    if (event.target.id !== "gmCreate") return;
    event.preventDefault();
    const f = new FormData(event.target), child = String(f.get("child") || "").replace(/\s+/gu, "");
    say("gmMsg", "만들고 있어요…");
    try {
      const data = await memberCall({ action: "admin-account-create", child, type: f.get("type"), ...(f.get("code") ? { code: String(f.get("code")) } : {}) });
      accounts.push({ ...data.account, member: data.member, gm: data.gm, lastSeen: null, lastLogin: null, logins30: 0, online: false });
      gmView.creating = false; gmView.filter = "all"; selectGm(data.child); onChange();
      gmView.code = { name: data.child, code: data.approvalCode || String(f.get("code")).trim().toUpperCase() }; renderGmDetail();
      say("gmMsg", `${data.child} 승인번호를 만들었어요. 이제 GM 여는 방식을 정해 주세요.`);
    } catch (error) { say("gmMsg", `만들지 못했어요: ${why(error)}`); }
  });
}

// ════════ 모의고사 회원 ════════
const mockAccounts = () => accounts.filter((a) => !a.member);
function renderMockList() {
  const all = mockAccounts().filter((a) => matches(a, mockView.query));
  filterBar("mockFilter", MOCK_FILTERS, mockView.filter, all);
  const test = MOCK_FILTERS.find(([key]) => key === mockView.filter)?.[2] || (() => true);
  const rows = all.filter(test).sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, "ko"));
  $("mockList").innerHTML = rows.map((a) => {
    const n = a.permissions.filter((id) => MOCK_IDS.includes(id)).length;
    return `<li><button type="button" data-name="${esc(a.name)}" aria-pressed="${a.name === mockView.selected}">
      <span class="ad-row-top"><b>${esc(a.name)}</b><span class="ms-status ${a.active ? (n ? "is-approved" : "is-off") : "is-paused"}">${a.active ? `${n}/${MOCK_IDS.length} 회차` : "사용 중지"}</span></span>
      <small>${a.type === "online" ? "온라인" : "재원생"} · ${esc(ago(a.lastSeen))}${a.permissions.includes("강사용교안") ? " · 강사용 교안" : ""}</small></button></li>`;
  }).join("") || `<li class="ad-empty">해당하는 학생이 없어요.</li>`;
  $("mockCount").textContent = `${mockAccounts().length}`;
}
function renderMockDetail() {
  const box = $("mockDetail");
  if (mockView.adding) {
    box.innerHTML = `<header class="ad-who"><div><h3>학생 추가</h3><small>여러 명은 쉼표나 줄바꿈으로</small></div></header>
      <form class="ad-block ad-form" id="mockAdd">
        <label>이름<textarea name="names" rows="4" required placeholder="김민지, 박수아, 이지훈"></textarea></label>
        <label>구분<select name="type"><option value="internal">재원생 — 회차는 진도에 맞춰 하나씩 열기</option><option value="online">온라인 — 모든 회차를 바로 열기</option></select></label>
        <div class="ad-actions"><button type="submit" class="ms-btn primary">추가하고 승인번호 만들기</button><button type="button" class="ms-btn" data-act="cancel-add">닫기</button></div>
      </form>${mockView.codes ? codeList(mockView.codes) : ""}`;
    return;
  }
  const a = byName(mockView.selected);
  if (!a) { box.innerHTML = `${mockView.codes ? codeList(mockView.codes) : ""}<div class="ad-hint"><b>목록에서 학생을 고르세요.</b><p>회차를 눌러 열고 닫아요. 누르는 즉시 저장돼요.</p><p>회차별 안내·과제·교재와 자료실은 <a href="../admin.html">모의고사 콘텐츠 편집</a>에서 바꿔요.</p></div>`; return; }
  const on = new Set(a.permissions);
  box.innerHTML = `<header class="ad-who"><div><h3>${esc(a.name)}</h3><small>${a.type === "online" ? "온라인" : "재원생"} · ${esc(ago(a.lastSeen))}</small></div><span class="ms-status ${a.active ? "is-approved" : "is-paused"}">${a.active ? "사용 중" : "사용 중지"}</span></header>
    ${mockView.code?.name === a.name ? codeBox(mockView.code.code) : ""}
    <section class="ad-block"><h4>모의고사 회차 <small>누르면 바로 저장</small></h4>
      <div class="ad-products" role="group" aria-label="회차">${PRODUCTS.filter((p) => p.id !== "강사용교안").map((p) => `<button type="button" data-product="${esc(p.id)}" aria-pressed="${on.has(p.id)}"${a.active ? "" : " disabled"}>${esc(p.name)}</button>`).join("")}</div>
      <div class="ad-mini"><button type="button" data-all="on"${a.active ? "" : " disabled"}>모든 회차 열기</button><button type="button" data-all="off"${a.active ? "" : " disabled"}>모든 회차 닫기</button></div>
    </section>
    <section class="ad-block"><h4>그 밖의 권한</h4>
      <div class="ad-products"><button type="button" data-product="강사용교안" aria-pressed="${on.has("강사용교안")}"${a.active ? "" : " disabled"}>강사용 교안</button></div>
      <p class="ad-help">스스로 공부(GM 과정)는 「GM 회원」 탭에서 열어요 — 지금 <b>${esc(gmState(a).text)}</b>.</p>
    </section>
    <section class="ad-block"><h4>승인번호</h4>
      <div class="ad-actions"><button type="button" class="ms-btn" data-act="type">${a.type === "online" ? "재원생으로 바꾸기" : "온라인으로 바꾸기"}</button><button type="button" class="ms-btn" data-act="reissue">새 승인번호 만들기</button><button type="button" class="ms-btn" data-act="active">${a.active ? "사용 중지" : "다시 사용"}</button></div>
    </section>`;
}
const codeList = (codes) => `<div class="ad-code ad-code-list" role="status"><span>새 승인번호 · 지금 한 번만 보여요</span><ul>${codes.map((c) => `<li><b>${esc(c.child)}</b> ${c.code ? `<code>${esc(c.code)}</code>` : `<small>${esc(c.error)}</small>`}</li>`).join("")}</ul><button type="button" class="ms-btn" data-act="copy-codes">모두 복사</button></div>`;
function renderMock() { renderMockList(); renderMockDetail(); }

function wireMock() {
  $("mockFilter").addEventListener("click", (event) => { const b = event.target.closest("[data-filter]"); if (b) { mockView.filter = b.dataset.filter; renderMockList(); } });
  $("mockSearch").addEventListener("input", (event) => { mockView.query = event.target.value.trim(); renderMockList(); });
  $("mockList").addEventListener("click", (event) => { const b = event.target.closest("[data-name]"); if (b) { mockView.selected = b.dataset.name; mockView.adding = false; if (mockView.code?.name !== b.dataset.name) mockView.code = null; renderMock(); toDetail("mockDetail"); } });
  $("mockNew").addEventListener("click", () => { mockView.adding = true; mockView.selected = ""; mockView.codes = null; renderMock(); $("mockDetail").querySelector("textarea")?.focus(); });
  const box = $("mockDetail");
  box.addEventListener("click", async (event) => {
    const t = event.target.closest("button");
    if (!t || t.disabled) return;
    const a = byName(mockView.selected);
    if (t.dataset.act === "cancel-add") { mockView.adding = false; renderMockDetail(); return; }
    if (t.dataset.act === "copy-codes") { navigator.clipboard?.writeText((mockView.codes || []).filter((c) => c.code).map((c) => `${c.child}: ${c.code}`).join("\n")).then(() => say("mockMsg", "승인번호를 복사했어요."), () => {}); return; }
    if (t.dataset.act === "copy-code") { navigator.clipboard?.writeText(t.dataset.code).then(() => say("mockMsg", "승인번호를 복사했어요."), () => {}); return; }
    if (!a) return;
    if (t.dataset.product) {
      const set = new Set(a.permissions), id = t.dataset.product, product = PRODUCTS.find((p) => p.id === id);
      if (set.has(id)) set.delete(id); else { set.add(id); (product?.grants || []).forEach((g) => set.add(g)); }
      const label = product?.name || id;
      setAccount(a.name, { permissions: [...set] }, "mockMsg", `${a.name} · ${label} ${set.has(id) ? "열었어요" : "닫았어요"}.`, renderMock);
    } else if (t.dataset.all) {
      const keep = a.permissions.filter((id) => !MOCK_IDS.includes(id));
      const next = t.dataset.all === "on" ? [...new Set([...keep, ...PRODUCTS.filter((p) => !p.manualOnly).map((p) => p.id)])] : keep;
      if (t.dataset.all === "off" && !confirm(`${a.name}의 모의고사 회차를 모두 닫을까요?`)) return;
      setAccount(a.name, { permissions: next }, "mockMsg", `${a.name} · 모든 회차를 ${t.dataset.all === "on" ? "열었어요" : "닫았어요"}.`, renderMock);
    } else if (t.dataset.act === "type") setAccount(a.name, { type: a.type === "online" ? "internal" : "online" }, "mockMsg", `${a.name} 구분을 바꿨어요.`, renderMock);
    else if (t.dataset.act === "reissue") reissue(a.name, mockView, "mockMsg", renderMockDetail);
    else if (t.dataset.act === "active") { if (a.active && !confirm(`${a.name}의 승인번호를 사용 중지할까요? 모의고사와 스스로 공부 모두 로그인할 수 없어요.`)) return; setAccount(a.name, { active: !a.active }, "mockMsg", a.active ? `${a.name} 사용 중지.` : `${a.name} 다시 사용.`, renderMock); }
  });
  box.addEventListener("submit", async (event) => {
    if (event.target.id !== "mockAdd") return;
    event.preventDefault();
    const f = new FormData(event.target), type = f.get("type");
    const names = [...new Set(String(f.get("names") || "").split(/[,\n]/).map((n) => n.replace(/\s+/gu, "")).filter(Boolean))];
    if (!names.length) return;
    say("mockMsg", `${names.length}명 만들고 있어요…`);
    const permissions = type === "online" ? PRODUCTS.filter((p) => !p.manualOnly).map((p) => p.id) : [];
    const codes = [];
    for (const child of names) {
      try {
        const data = await memberCall({ action: "admin-account-create", child, type, permissions });
        accounts.push({ ...data.account, member: data.member, gm: data.gm, lastSeen: null, lastLogin: null, logins30: 0, online: false });
        codes.push({ child, code: data.approvalCode });
      } catch (error) { codes.push({ child, error: why(error) }); }
    }
    mockView.codes = codes; mockView.adding = true; renderMock(); onChange();
    const ok = codes.filter((c) => c.code).length;
    say("mockMsg", `${ok}명 만들었어요${codes.length > ok ? ` · ${codes.length - ok}명은 건너뜀` : ""}. 아래 승인번호를 지금 전해 주세요.`);
  });
}

// teacher.js가 admin-access로 불러 둔 승인번호 목록을 받아 두 탭을 그린다. changed()는 숫자·접속 탭을 다시 그리라는 신호.
// 목록은 접속 탭(teacher-access.js)과 같은 배열을 함께 쓴다 — 여기서 바꾸면 그쪽에도 보인다.
export function initAdmin(list, changed = () => {}) {
  accounts = list;
  for (const a of accounts) { a.permissions = Array.isArray(a.permissions) ? a.permissions : []; a.active = a.active !== false; }
  onChange = changed;
  if (accounts.some((a) => asks(a).length)) gmView.filter = "ask";
  wireGm(); wireMock();
  renderGm(); renderMock();
  return { accounts: () => accounts };
}
