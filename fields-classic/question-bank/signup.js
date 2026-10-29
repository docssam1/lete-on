import { CURRICULUM } from "./source-data.js?v=20261028m";
import { login } from "./study-progress.js?v=20261029q";

// 가입(원장 2026-10-29 「이메일로 승인번호가 우선 나오고 그다음 접속」「이메일 인증 후 2주 체험」):
//  ① 보호자 이메일 → 인증번호 메일(Supabase Auth, 수의 마법과 같은 프로젝트) → 확인
//  ② 이 이메일로 가입한 아이가 있으면 목록(승인번호 다시 받기 · 아이 한 명 더)
//  ③ 아이 이름·보호자 전화·아이 전화(선택)·유치 나이/초등 학년·시작 진도·개인정보 동의 → fields-members register
//  ④ 승인번호를 한 번 보여 준다(서버에는 해시만) → 「이 번호로 시작하기」는 바로 로그인
// 승인번호는 화면에만 보이고 이 기기에도 저장하지 않는다.
const SB = "https://fgahqumaldheqettmvqg.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs";
const MEMBERS = `${SB}/functions/v1/fields-members`;
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const day = (iso) => { const d = new Date(iso); return `${d.getMonth() + 1}월 ${d.getDate()}일`; };
const PARENT_KEY = "gf_parent";   // 이 탭에서만: 인증된 보호자 { email, token, until }
let parent = null;
try { const saved = JSON.parse(sessionStorage.getItem(PARENT_KEY) || "null"); if (saved && saved.until > Date.now()) parent = saved; } catch {}

const ERRORS = {
  email_required: "이메일 인증이 끝났어요. 인증번호를 다시 받아 주세요.",
  child_invalid: "아이 이름을 확인해 주세요(20자까지).",
  phone_invalid: "보호자 전화번호를 010으로 시작하는 숫자로 넣어 주세요.",
  child_phone_invalid: "아이 전화번호를 확인해 주세요(없으면 비워 두세요).",
  level_invalid: "유치부면 나이, 초등학생이면 학년을 골라 주세요.",
  consent_required: "필수 동의 두 가지에 모두 체크해 주세요.",
  name_taken: "같은 이름으로 이미 가입한 아이가 있어요. 이름 뒤에 숫자를 붙여 주세요(예: 민준2).",
  child_not_found: "이 이메일로 가입한 아이가 아니에요.",
};
const failText = (error) => ERRORS[error.message] || (error instanceof TypeError ? "인터넷 연결을 확인해 주세요." : "잠시 뒤에 다시 해 주세요.");

async function authApi(path, body) {
  const response = await fetch(`${SB}/auth/v1/${path}`, { method: "POST", headers: { apikey: ANON, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error_code || data.code || data.msg || "auth_failed"); error.status = response.status; throw error; }
  return data;
}
async function members(body) {
  const response = await fetch(MEMBERS, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${parent?.token || ""}`, apikey: ANON }, body: JSON.stringify(body), cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) { parent = null; try { sessionStorage.removeItem(PARENT_KEY); } catch {} }
    const error = new Error(data.error || "request_failed"); error.status = response.status; throw error;
  }
  return data;
}

// ── ① 이메일 인증 ──
const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
async function sendCode() {
  const email = $("email").value.trim().toLowerCase();
  if (!emailOk(email)) { $("emailMsg").textContent = "이메일 주소를 확인해 주세요."; return; }
  $("sendBtn").disabled = $("resendBtn").disabled = true; $("emailMsg").textContent = "인증번호를 보내고 있어요…";
  try {
    await authApi("otp", { email, create_user: true });
    $("otpBox").hidden = false; $("sendBtn").hidden = true;
    $("emailMsg").textContent = `${email}로 인증번호를 보냈어요. 메일이 안 보이면 스팸함도 봐 주세요.`;
    $("otp").focus();
  } catch (error) {
    $("emailMsg").textContent = error.status === 429 ? "인증번호를 여러 번 보냈어요. 1분쯤 뒤에 다시 해 주세요." : failText(error);
  } finally { $("sendBtn").disabled = $("resendBtn").disabled = false; }
}
async function verifyCode() {
  const email = $("email").value.trim().toLowerCase(), token = $("otp").value.replace(/\s+/g, "");
  if (!/^\d{6,10}$/.test(token)) { $("emailMsg").textContent = "메일로 받은 숫자를 넣어 주세요."; return; }
  $("verifyBtn").disabled = true; $("emailMsg").textContent = "확인하고 있어요…";
  try {
    const data = await authApi("verify", { email, token, type: "email" });
    parent = { email, token: data.access_token, until: Date.now() + Math.min(Number(data.expires_in) || 3600, 3600) * 1000 - 60000 };
    try { sessionStorage.setItem(PARENT_KEY, JSON.stringify(parent)); } catch {}
    $("emailMsg").textContent = "";
    await afterVerify();
  } catch (error) {
    $("emailMsg").textContent = error.status === 429 ? "시도가 많아요. 잠시 뒤에 다시 해 주세요." : "인증번호가 맞지 않거나 시간이 지났어요. 다시 받아 주세요.";
  } finally { $("verifyBtn").disabled = false; }
}

// ── ② 이 이메일의 아이들 ──
async function afterVerify() {
  $("emailForm").hidden = true;
  $("verifiedAs").textContent = `✓ ${parent.email} 인증됨`;
  let mine = null;
  try { mine = await members({ action: "mine" }); } catch (error) { showEmail(failText(error)); return; }
  if (!mine.children.length) return showChildForm();
  $("heading").textContent = "가입한 아이";
  $("lead").textContent = "승인번호를 잊었으면 새로 받아요. 새 번호를 받으면 옛 번호로는 로그인할 수 없어요.";
  $("mine").hidden = false;
  $("mine").innerHTML = `<p class="ms-signup-email">✓ ${esc(parent.email)} 인증됨</p><ul class="ms-kids">${mine.children.map((kid) => `<li>
      <b>${esc(kid.child)}</b><small>${kid.status === "approved" ? "정식 회원" : kid.status === "paused" ? "잠시 멈춤" : kid.open ? `체험 중 · ${day(kid.trialUntil)}까지` : "체험 끝 · 정규회원 승인 요청은 카톡으로"}${kid.upTo ? ` · ${Number(kid.upTo.slice(5))}권까지` : ""}</small>
      <button type="button" class="ms-btn" data-reissue="${esc(kid.child)}">승인번호 다시 받기</button></li>`).join("")}</ul>
    <button type="button" class="ms-btn" id="addKid">아이 한 명 더 가입하기</button>`;
  $("addKid").addEventListener("click", () => { $("mine").hidden = true; showChildForm(); });
}
$("mine").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-reissue]");
  if (!button) return;
  if (!confirm(`${button.dataset.reissue}의 승인번호를 새로 받을까요? 옛 번호로는 더 이상 로그인할 수 없어요.`)) return;
  button.disabled = true;
  try { const data = await members({ action: "reissue", child: button.dataset.reissue }); showCode(data.child, data.approvalCode, null); }
  catch (error) { button.disabled = false; alert(failText(error)); if (!parent) showEmail(); }
});
function showEmail(message = "") {
  for (const id of ["mine", "childForm", "done"]) $(id).hidden = true;
  $("emailForm").hidden = false; $("otpBox").hidden = true; $("sendBtn").hidden = false; $("otp").value = "";
  $("emailMsg").textContent = message;
}

// ── ③ 아이 정보 ──
function showChildForm() {
  $("heading").textContent = "아이 정보";
  $("lead").innerHTML = "가입하면 <b>2주 동안 체험</b>해요. 체험 동안은 시작 권 하나를 공부하고, 정식 회원이 되면 한 달에 1권씩 열려요.";
  $("childForm").hidden = false;
  $("child").focus();
}
$("startBook").innerHTML = CURRICULUM.map((book) => `<option value="${book.id}">${esc(book.label)} · ${esc(book.title)}</option>`).join("");
$("childForm").addEventListener("change", (event) => {
  if (event.target.name !== "level") return;
  $("ageRow").hidden = event.target.value !== "kinder";
  $("gradeRow").hidden = event.target.value !== "elementary";
});
$("childForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const level = document.querySelector("input[name=level]:checked")?.value || "";
  const body = {
    action: "register",
    child: $("child").value.replace(/\s+/gu, ""),
    guardianPhone: $("guardianPhone").value, childPhone: $("childPhone").value,
    level, age: level === "kinder" ? Number($("age").value) : null, grade: level === "elementary" ? Number($("grade").value) : null,
    consent: { privacy: $("consentPrivacy").checked, guardian: $("consentGuardian").checked },
    ...($("startBook").value !== "book-01" || $("startUnit").value !== "0" ? { start: { book: $("startBook").value, unit: Number($("startUnit").value), part: 1 } } : {}),
  };
  const local = !body.child ? "child_invalid" : !/^01\d{8,9}$/.test(body.guardianPhone.replace(/\D/g, "")) ? "phone_invalid"
    : !level || (level === "kinder" && !body.age) || (level === "elementary" && !body.grade) ? "level_invalid"
    : !body.consent.privacy || !body.consent.guardian ? "consent_required" : "";
  if (local) { $("childMsg").textContent = ERRORS[local]; return; }
  $("registerBtn").disabled = true; $("childMsg").textContent = "승인번호를 만들고 있어요…";
  try {
    const data = await members(body);
    showCode(data.child, data.approvalCode, data.member);
  } catch (error) {
    $("childMsg").textContent = failText(error);
    if (!parent) showEmail(ERRORS.email_required);
  } finally { $("registerBtn").disabled = false; }
});

// ── ④ 승인번호 ──
function showCode(child, code, member) {
  for (const id of ["emailForm", "mine", "childForm"]) $(id).hidden = true;
  $("heading").textContent = "승인번호가 나왔어요";
  $("lead").innerHTML = "이 번호는 <b>지금 한 번만</b> 보여요. 적어 두거나 사진으로 찍어 두세요. 잊으면 이 화면에서 이메일 인증을 하고 다시 받아요.";
  $("done").hidden = false;
  $("done").innerHTML = `<dl class="ms-code"><dt>이름</dt><dd>${esc(child)}</dd><dt>승인번호</dt><dd class="ms-code-value">${esc(code)}</dd></dl>
    ${member ? `<p>2주 체험 · <b>${day(member.trialUntil)}까지</b> · ${Number(String(member.upTo || "book-01").slice(5))}권</p>` : ""}
    <div class="ms-login-actions"><button type="button" class="ms-btn primary" id="goStudy">이 번호로 공부 시작하기 ›</button><button type="button" class="ms-btn" id="copyCode">번호 복사</button></div>
    <p id="doneMsg" class="ms-login-error" role="alert"></p>`;
  $("copyCode").addEventListener("click", async () => { try { await navigator.clipboard.writeText(`${child} ${code}`); $("doneMsg").textContent = "복사했어요."; } catch { $("doneMsg").textContent = "길게 눌러 직접 적어 두세요."; } });
  $("goStudy").addEventListener("click", async () => {
    $("goStudy").disabled = true;
    try { const me = await login(code, child); location.assign(`./start.html?${new URLSearchParams({ student: me.name })}`); }
    catch (error) { $("goStudy").disabled = false; $("doneMsg").textContent = "로그인하지 못했어요. 로그인 화면에서 이 번호를 넣어 주세요."; }
  });
}

$("emailForm").addEventListener("submit", (event) => { event.preventDefault(); sendCode(); });
$("resendBtn").addEventListener("click", sendCode);
$("verifyBtn").addEventListener("click", verifyCode);
$("otp").addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); verifyCode(); } });
if (parent) { $("email").value = parent.email; afterVerify(); } else $("email").focus();
