import { memberCall, weekRate } from "./study-progress.js?v=20261111p";

// 선생님 보기 · 접속한 회원(원장 2026-11-11 「들어간 회원, 회원정보, 학습 상황도 나올 수 있도록」):
// 모든 승인번호(이메일로 가입한 아이 + 원장이 직접 만든 승인번호)를 마지막 활동 순으로 —
//   접속: 지금 접속 중 · 마지막 활동 · 마지막 로그인 · 30일 로그인 수 (서버 함수 fields-members admin-access, 로그인 세션 기록에서)
//   회원 정보: 이메일 회원이면 나이/학년·상태·열린 권·연락처, 아니면 직접 발급(재원/온라인)·승인 권한
//   학습 상황: 가장 최근에 공부한 차시와 그 단원 수행률(teacher.js가 불러 둔 학생 기록) → 「내 학습 상황」으로
// 관리자(DOCSSAM) 로그인일 때만 부른다. 승인번호(해시 포함)는 서버가 내보내지 않는다.
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const phone = (p) => String(p || "").replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
const bookNo = (id) => Number(String(id || "").slice(5)) || 1;
const DAY = 86400000;
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
function stamp(iso) {
  if (!iso) return "–";
  const d = new Date(iso), time = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  const diff = startOfToday() - new Date(d).setHours(0, 0, 0, 0);
  return diff <= 0 ? `오늘 ${time}` : diff <= DAY ? `어제 ${time}` : `${d.getMonth() + 1}/${d.getDate()} ${time}`;
}
function memberState(m) {
  if (m.status === "paused") return ["멈춤", "is-paused"];
  if (m.status === "approved") return ["정규회원", "is-approved"];
  if (!m.open) return ["체험 끝", "is-ended"];
  return [`체험 ${Math.max(0, Math.ceil((new Date(m.trialUntil).getTime() - Date.now()) / DAY))}일 남음`, "is-trial"];
}

let accounts = [];
// 관리자 접속·열람 기록(원장 2026-11-11 「보안 설정도 하자」) — 서버(fields-members admin-access)의 admin: { sessions, audit }
const ACTION = { login: "관리자 로그인", "admin-login": "관리 화면 로그인", login_failed: "관리자 로그인 실패", login_locked: "관리자 로그인 잠김",
  "admin-access": "접속한 회원 열람", "admin-list": "회원 관리 열람", "admin-reissue": "승인번호 새로 만듦",
  "admin-update:approve": "정규회원 승인", "admin-update:trial": "체험 연장", "admin-update:pause": "멈춤", "admin-update:resume": "다시 열기",
  "admin-update:grant-book": "권 +1", "admin-update:take-book": "권 −1", "admin-update:start": "시작 진도 바꿈", "admin-update:memo": "메모" };
function renderAdminLog(log) {
  const box = $("adminLog");
  if (!box || !log) return;
  box.hidden = false;
  const sessions = (log.sessions || []).slice(0, 8).map((s) => `<li><b>${stamp(s.created_at)}</b> 로그인 <small>마지막 활동 ${stamp(s.last_seen_at || s.created_at)}${new Date(s.expires_at) > new Date() ? " · 아직 열려 있음" : ""}</small></li>`).join("");
  const audit = log.audit === null ? `<p class="ms-note">열람 기록을 남길 표가 아직 없어요.</p>`
    : `<ul class="ms-log">${(log.audit || []).slice(0, 30).map((a) => `<li class="${/fail|locked/.test(a.action) ? "is-warn" : ""}"><b>${stamp(a.at)}</b> ${esc(ACTION[a.action] || a.action)}${a.target ? ` · ${esc(a.target)}` : ""}<small>${esc(a.ip || "")}${a.agent ? ` · ${esc(a.agent.slice(0, 60))}` : ""}</small></li>`).join("") || "<li><small>아직 기록이 없어요.</small></li>"}</ul>`;
  box.innerHTML = `<h2>관리자 접속·열람 기록 <small>모르는 시각·장소가 보이면 관리자 승인번호를 바꿔 주세요</small></h2>
    <div class="ms-log-grid"><section><h3>관리자 로그인</h3><ul class="ms-log">${sessions || "<li><small>기록 없음</small></li>"}</ul></section>
    <section><h3>열람·변경</h3>${audit}</section></div>`;
}
let records = new Map();
let filter = "today";

// 그 학생의 가장 최근 차시 기록(book-NN-u<단원>) → { label, rate, at, book }
function latestStudy(name) {
  const rec = records.get(name);
  if (!rec) return null;
  let best = null;
  for (const [mapKey, entry] of rec) {
    if (!mapKey.startsWith("week:") || !/^book-\d+-u\d+$/.test(entry.key)) continue;
    if (!best || String(entry.updatedAt || "") > String(best.updatedAt || "")) best = entry;
  }
  if (!best) return null;
  const [, book, unit] = best.key.match(/^(book-\d+)-u(\d+)$/);
  const test = rec.get(`test:${best.key}`);
  return { book, label: `${bookNo(book)}권 ${Number(unit) + 1}단원 ${best.payload?.part || 1}차시`, rate: weekRate(best.payload, test?.payload), at: best.updatedAt,
    units: [...rec.keys()].filter((key) => key.startsWith("week:")).length };
}

function shown() {
  const now = Date.now(), today = startOfToday();
  const seenAt = (a) => (a.lastSeen ? new Date(a.lastSeen).getTime() : 0);
  return accounts.filter((a) => filter === "all" ? true
    : filter === "now" ? a.online
    : filter === "today" ? seenAt(a) >= today
    : seenAt(a) >= now - 7 * DAY)
    .sort((a, b) => String(b.lastSeen || "").localeCompare(String(a.lastSeen || "")) || a.name.localeCompare(b.name, "ko"));
}

function render() {
  document.querySelectorAll("#accessFilter [data-filter]").forEach((button) => {
    const on = button.dataset.filter === filter;
    button.classList.toggle("is-on", on); button.setAttribute("aria-pressed", String(on));
  });
  const rows = shown();
  const online = accounts.filter((a) => a.online).length;
  $("accessCount").textContent = `승인번호 ${accounts.length}개 · 지금 ${online}명`;
  $("accessTable").innerHTML = `<thead><tr><th>이름</th><th>접속</th><th>회원 정보</th><th>학습 상황</th></tr></thead><tbody>${rows.map((a) => {
    const m = a.member, study = latestStudy(a.name);
    const teach = a.permissions.includes("강사용교안");
    const info = m
      ? (() => { const [label, cls] = memberState(m); return `<span class="ms-status ${cls}">${label}</span>
          <small>${m.level === "kinder" ? `유치 ${m.age}세` : `초${m.grade}`} · ${m.open && m.books?.length ? `${bookNo(m.books[0]) === bookNo(m.upTo) ? "" : `${bookNo(m.books[0])}~`}${bookNo(m.upTo)}권 열림` : "열린 권 없음"}</small>
          <small>${esc(m.email)} · 보호자 ${esc(phone(m.guardianPhone))}</small>${m.memo ? `<small>메모: ${esc(m.memo)}</small>` : ""}`; })()
      : `<span class="ms-status">${a.type === "internal" ? "재원생" : a.type === "online" ? "온라인" : "직접 발급"}</span><small>원장이 만든 승인번호${a.active ? "" : " · 사용 중지"}</small>`;
    return `<tr class="${a.lastSeen ? "" : "is-idle"}">
      <th><b>${esc(a.name)}</b>${a.online ? `<em class="ms-online">지금 접속</em>` : ""}${teach ? `<em class="ms-teach">강사용 교안</em>` : ""}</th>
      <td>${a.lastSeen ? `<b>${stamp(a.lastSeen)}</b><small>로그인 ${stamp(a.lastLogin)} · 30일 ${a.logins30}번</small>` : "<small>아직 로그인 기록 없음</small>"}</td>
      <td>${info}</td>
      <td>${study ? `<b>${esc(study.label)}</b><small>그 단원 수행률 ${study.rate}% · ${stamp(study.at)}</small>` : "<small>저장된 공부 기록 없음</small>"}
        <a class="ms-link" href="./my-study.html?${new URLSearchParams({ student: a.name, ...(study ? { book: study.book } : {}) })}">학습 상황 보기 ›</a></td></tr>`;
  }).join("") || `<tr><td colspan="4" class="ms-empty">${{ now: "지금 접속한 사람이 없어요.", today: "오늘 들어온 사람이 없어요.", week: "7일 동안 들어온 사람이 없어요." }[filter] || "승인번호가 없어요."}</td></tr>`}</tbody>`;
}

// byStudent: teacher.js가 불러 둔 학생 기록 Map(학생 → Map(`kind:key` → { key, payload, updatedAt }))
export async function initAccess(byStudent) {
  records = byStudent || new Map();
  $("accessBox").hidden = false;
  $("accessMsg").textContent = "접속 기록을 불러오는 중…";
  let adminLog = null;
  try { const data = await memberCall({ action: "admin-access" }); accounts = data.accounts || []; adminLog = data.admin || null; }
  catch (error) { $("accessMsg").textContent = `접속 기록을 불러오지 못했어요(${error.message}).`; return; }
  const today = startOfToday();
  filter = accounts.some((a) => a.lastSeen && new Date(a.lastSeen).getTime() >= today) ? "today"
    : accounts.some((a) => a.lastSeen && Date.now() - new Date(a.lastSeen).getTime() < 7 * DAY) ? "week" : "all";
  $("accessMsg").textContent = "접속은 승인번호로 로그인한 기록이에요. 로그인 없이 둘러본 사람은 남지 않아요.";
  render();
  renderAdminLog(adminLog);
  $("accessFilter").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) { filter = button.dataset.filter; render(); }
  });
}
