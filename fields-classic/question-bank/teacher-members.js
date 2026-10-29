import { CURRICULUM } from "./source-data.js?v=20261028m";
import { memberCall } from "./study-progress.js?v=20261029q";

// 선생님 보기 · 회원 관리(원장 2026-10-29): 이메일로 가입한 아이들 — 체험 2주 → 원장 승인하면 정식(한 달에 1권씩),
// 「다음 권 추가 요청」이 오면 권 +1. 시작 진도는 학부모(가입할 때)나 원장이 정한다.
// 서버 함수 fields-members(admin-list · admin-update · admin-reissue), 관리자(DOCSSAM) 세션으로만.
// 새 승인번호는 화면에 한 번만 보이고 어디에도 저장하지 않는다.
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const day = (iso) => { if (!iso) return "–"; const d = new Date(iso); return `${d.getMonth() + 1}/${d.getDate()}`; };
const bookNo = (id) => Number(String(id || "").slice(5)) || 1;
const phone = (p) => String(p || "").replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
let list = [];
let filter = "ask";

function statusText(m) {
  if (m.status === "paused") return ["멈춤", "is-paused"];
  if (m.status === "approved") return ["정식", "is-approved"];
  if (!m.open) return ["체험 끝", "is-ended"];
  const left = Math.max(0, Math.ceil((new Date(m.trialUntil).getTime() - Date.now()) / 86400000));
  return [`체험 ${left}일 남음`, "is-trial"];
}
const asks = (m) => [m.approvalRequestedAt && m.status !== "approved" ? `정식 요청 ${day(m.approvalRequestedAt)}` : "", m.bookRequestedAt ? `다음 권 요청 ${day(m.bookRequestedAt)}` : ""].filter(Boolean);
function shown() {
  return list.filter((m) => filter === "all" ? true
    : filter === "ask" ? asks(m).length > 0
    : filter === "trial" ? m.status === "trial" && m.open
    : filter === "ended" ? m.status === "trial" && !m.open
    : m.status === filter);
}

function render() {
  document.querySelectorAll("#membersFilter [data-filter]").forEach((button) => {
    const on = button.dataset.filter === filter;
    button.classList.toggle("is-on", on); button.setAttribute("aria-pressed", String(on));
  });
  const rows = shown();
  $("membersCount").textContent = `${list.length}명 · 요청 ${list.filter((m) => asks(m).length).length}`;
  const bookOptions = (sel) => CURRICULUM.map((book) => `<option value="${book.id}"${book.id === sel ? " selected" : ""}>${esc(book.label)}</option>`).join("");
  const unitOptions = (sel) => [0, 1, 2, 3].map((u) => `<option value="${u}"${u === Number(sel) ? " selected" : ""}>${u + 1}단원</option>`).join("");
  $("membersTable").innerHTML = `<thead><tr><th>아이</th><th>상태</th><th>열린 권</th><th>요청</th><th>시작 진도</th><th>연락처</th><th>할 일</th></tr></thead><tbody>${rows.map((m) => {
    const [label, cls] = statusText(m);
    const req = asks(m);
    return `<tr data-child="${esc(m.child)}">
      <th><b>${esc(m.child)}</b><small>${m.level === "kinder" ? `유치 ${m.age}세` : `초${m.grade}`} · 가입 ${day(m.createdAt)}</small></th>
      <td><span class="ms-status ${cls}">${label}</span>${m.status === "approved" ? `<small>승인 ${day(m.approvedAt)}</small>` : `<small>${day(m.trialUntil)}까지</small>`}</td>
      <td>${m.open ? `<b>${m.books.length ? `${bookNo(m.books[0])}~${bookNo(m.upTo)}권` : "–"}</b>${m.extraBooks ? `<small>추가 ${m.extraBooks}권</small>` : ""}${m.nextOpensAt ? `<small>다음 ${day(m.nextOpensAt)}</small>` : ""}` : "–"}</td>
      <td>${req.length ? req.map((r) => `<em class="ms-ask">${r}</em>`).join("") : "–"}</td>
      <td><select data-start="book" aria-label="시작 권">${bookOptions(m.start?.book)}</select><select data-start="unit" aria-label="시작 단원">${unitOptions(m.start?.unit)}</select><small>${m.start?.setBy === "admin" ? "원장이 정함" : m.start?.setBy === "parent" ? "학부모가 정함" : "처음부터"}</small></td>
      <td><small>${esc(m.email)}</small><small>보호자 ${esc(phone(m.guardianPhone))}</small>${m.childPhone ? `<small>아이 ${esc(phone(m.childPhone))}</small>` : ""}</td>
      <td><div class="ms-member-acts">
        ${m.status !== "approved" ? `<button type="button" class="ms-btn primary" data-op="approve">정식 승인</button>` : ""}
        ${m.status === "trial" ? `<button type="button" class="ms-btn" data-op="trial">체험 +14일</button>` : ""}
        ${m.status === "approved" ? `<button type="button" class="ms-btn${m.bookRequestedAt ? " primary" : ""}" data-op="grant-book">권 +1</button>${m.extraBooks ? `<button type="button" class="ms-btn" data-op="take-book">권 −1</button>` : ""}` : ""}
        ${m.status === "paused" ? `<button type="button" class="ms-btn" data-op="resume">다시 열기</button>` : `<button type="button" class="ms-btn" data-op="pause">멈춤</button>`}
        <button type="button" class="ms-btn" data-op="reissue">승인번호 새로</button>
        <input class="ms-memo" data-memo value="${esc(m.memo)}" placeholder="메모" maxlength="200" aria-label="메모" />
      </div></td></tr>`;
  }).join("") || `<tr><td colspan="7" class="ms-empty">${filter === "ask" ? "새 요청이 없어요." : "해당하는 회원이 없어요."}</td></tr>`}</tbody>`;
}

async function update(child, body, done) {
  $("membersMsg").textContent = "저장하고 있어요…";
  try {
    const data = await memberCall({ action: "admin-update", child, ...body });
    list = list.map((m) => (m.child === child ? data.member : m));
    render();
    $("membersMsg").textContent = done;
  } catch (error) { $("membersMsg").textContent = `저장하지 못했어요(${error.message}).`; }
}

export async function initMembers() {
  $("membersBox").hidden = false;
  $("membersMsg").textContent = "회원을 불러오는 중…";
  try { list = (await memberCall({ action: "admin-list" })).members || []; }
  catch (error) { $("membersMsg").textContent = `회원을 불러오지 못했어요(${error.message}).`; return; }
  if (!list.some((m) => asks(m).length)) filter = list.length ? "all" : "ask";
  $("membersMsg").textContent = list.length ? "" : "아직 이메일로 가입한 아이가 없어요.";
  render();
  $("membersFilter").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) { filter = button.dataset.filter; render(); }
  });
  $("membersTable").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-op]");
    if (!button) return;
    const child = button.closest("tr").dataset.child, op = button.dataset.op;
    if (op === "reissue") {
      if (!confirm(`${child}의 승인번호를 새로 만들까요? 옛 번호와 지금 로그인은 끊겨요.`)) return;
      try { const data = await memberCall({ action: "admin-reissue", child }); $("membersMsg").innerHTML = `<b>${esc(data.child)}</b> 새 승인번호 <b class="ms-code-inline">${esc(data.approvalCode)}</b> — 지금 한 번만 보여요. 학부모께 전해 주세요.`; }
      catch (error) { $("membersMsg").textContent = `만들지 못했어요(${error.message}).`; }
      return;
    }
    if (op === "pause" && !confirm(`${child}의 공부를 멈출까요? 로그인이 끊기고 다시 열 때까지 들어올 수 없어요.`)) return;
    const done = { approve: `${child} 정식 승인 — 오늘부터 한 달에 1권씩 열려요.`, trial: `${child} 체험 14일 연장.`, "grant-book": `${child} 권 1권 더 열었어요.`, "take-book": `${child} 추가 권 1권 줄였어요.`, pause: `${child} 멈춤.`, resume: `${child} 다시 열었어요.` }[op];
    update(child, { op, ...(op === "trial" ? { days: 14 } : {}) }, done);
  });
  $("membersTable").addEventListener("change", (event) => {
    const row = event.target.closest("tr");
    if (!row) return;
    const child = row.dataset.child;
    if (event.target.matches("[data-start]")) {
      const book = row.querySelector('[data-start="book"]').value, unit = Number(row.querySelector('[data-start="unit"]').value);
      update(child, { op: "start", start: { book, unit, part: 1 } }, `${child} 시작 진도 ${bookNo(book)}권 ${unit + 1}단원.`);
    } else if (event.target.matches("[data-memo]")) update(child, { op: "memo", memo: event.target.value }, `${child} 메모 저장.`);
  });
}
