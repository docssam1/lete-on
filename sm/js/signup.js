// 레이키즈 가입(원장 2026-11-17 「이메일 인증 받아 가입 하도록」) — 레이키즈 전용 계정, 기간 없이 계속 이용.
//  ① 보호자 이메일 → 인증번호 메일(Supabase Auth, 필즈 가입과 같은 메일) → 확인
//  ② 이 이메일로 등록한 아이 목록(승인번호 새로 정하기) · 아이 등록하기
//  ③ 아이 이름 · 승인번호 정하기(두 번) · 개인정보 동의 → fields-members sm-register(서버엔 해시만)
//  ④ 정한 승인번호를 한 번 더 보여 준다 → 「이 번호로 시작하기」는 바로 로그인해 처음 화면으로
// 승인번호는 화면에만 보이고 이 기기에도 저장하지 않는다. 보호자 인증 토큰은 이 탭에만(1시간 이하).
import { SB, ANON, smCall, login } from "./access.js?v=20261117a";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const PARENT_KEY = "sm_parent";
let parent = null, mode = "register", target = "";
try { const saved = JSON.parse(sessionStorage.getItem(PARENT_KEY) || "null"); if (saved && saved.until > Date.now()) parent = saved; } catch { /* 없음 */ }

const ERRORS = {
  email_required: "이메일 인증 시간이 지났어요. 인증번호를 다시 받아 주세요.",
  child_invalid: "아이 이름을 확인해 주세요(20자까지).",
  consent_required: "필수 동의 두 가지에 모두 체크해 주세요.",
  name_taken: "같은 이름으로 이미 가입한 아이가 있어요. 이름 뒤에 숫자를 붙여 주세요(예: 민준2).",
  child_not_found: "이 이메일로 등록한 아이가 아니에요.",
  code_invalid: "승인번호는 영문과 숫자로 4~20자를 넣어 주세요.",
  code_weak: "알아내기 쉬운 번호예요. 같은 글자만 쓰거나 1234·ABCD처럼 차례대로 쓰거나 아이 이름과 같으면 안 돼요.",
  code_mismatch: "두 칸의 승인번호가 달라요. 같은 번호를 두 번 넣어 주세요.",
  too_many_children: "한 이메일로는 아이를 6명까지 등록할 수 있어요.",
  over_email_send_rate_limit: "인증 메일을 너무 자주 보냈어요. 잠시 뒤에 다시 받아 주세요.",
  otp_expired: "인증번호가 맞지 않거나 시간이 지났어요. 다시 받아 주세요.",
};
const failText = (error) => ERRORS[error?.message] || (error instanceof TypeError ? "인터넷 연결을 확인해 주세요." : "잠시 뒤에 다시 해 주세요.");
// 서버와 같은 검사 — 보내기 전에 알려 준다
const SEQUENCES = ["0123456789", "9876543210", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ZYXWVUTSRQPONMLKJIHGFEDCBA", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
function codeProblem(code, again, child) {
  const c = String(code || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{4,20}$/.test(c)) return "code_invalid";
  if (/^(.)\1+$/.test(c) || SEQUENCES.some((seq) => seq.includes(c)) || c === String(child || "").toUpperCase()) return "code_weak";
  if (c !== String(again || "").trim().toUpperCase()) return "code_mismatch";
  return "";
}
async function authApi(path, body) {
  const response = await fetch(`${SB}/auth/v1/${path}`, { method: "POST", headers: { apikey: ANON, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error_code || data.code || data.msg || "auth_failed"); error.status = response.status; throw error; }
  return data;
}
const call = async (body) => {
  try { return await smCall(body, parent?.token || ""); }
  catch (error) { if (error.status === 401) { parent = null; try { sessionStorage.removeItem(PARENT_KEY); } catch { /* 없음 */ } show("email"); } throw error; }
};

function show(step) {
  $("emailForm").hidden = step !== "email";
  $("kidsBox").hidden = step !== "kids";
  $("kidForm").hidden = step !== "kid";
  $("doneBox").hidden = step !== "done";
}

// ① 이메일 인증
async function sendCode(event) {
  event?.preventDefault();
  const email = $("email").value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("emailMsg").textContent = "이메일 주소를 확인해 주세요."; return; }
  $("sendBtn").disabled = true; $("emailMsg").textContent = "인증번호를 보내고 있어요…";
  try {
    await authApi("otp", { email, create_user: true });
    $("otpBox").hidden = false; $("sendBtn").hidden = true;
    $("emailMsg").textContent = "메일로 인증번호를 보냈어요. 받은 숫자를 넣어 주세요.";
    $("otp").focus();
  } catch (error) { $("emailMsg").textContent = failText(error); }
  finally { $("sendBtn").disabled = false; }
}
async function verifyCode() {
  const email = $("email").value.trim().toLowerCase(), token = $("otp").value.replace(/\s+/g, "");
  if (!/^\d{6,10}$/.test(token)) { $("emailMsg").textContent = "메일로 받은 숫자를 넣어 주세요."; return; }
  $("verifyBtn").disabled = true; $("emailMsg").textContent = "확인하고 있어요…";
  try {
    const data = await authApi("verify", { email, token, type: "email" });
    parent = { email, token: data.access_token, until: Date.now() + Math.min(Number(data.expires_in) || 3600, 3600) * 1000 - 60000 };
    try { sessionStorage.setItem(PARENT_KEY, JSON.stringify(parent)); } catch { /* 저장 안 됨 */ }
    $("emailMsg").textContent = "";
    await loadKids();
  } catch (error) { $("emailMsg").textContent = failText(error); }
  finally { $("verifyBtn").disabled = false; }
}

// ② 등록한 아이
async function loadKids() {
  const r = await call({ action: "sm-mine" });
  $("emailShown").textContent = `${r.email}`;
  const kids = r.children || [];
  if (!kids.length && !location.hash.includes("forgot")) { openKid("register"); return; }
  $("kids").innerHTML = kids.length ? kids.map((k) => `<div class="kid-row"><span>${esc(k.child)}</span><button class="sm-btn" type="button" data-child="${esc(k.child)}">승인번호 새로 정하기</button></div>`).join("")
    : `<p class="sm-note">이 이메일로 등록한 아이가 없어요.</p>`;
  $("kids").querySelectorAll("[data-child]").forEach((b) => b.addEventListener("click", () => openKid("reissue", b.dataset.child)));
  show("kids");
}

// ③ 아이 등록 / 승인번호 새로 정하기
function openKid(m, child = "") {
  mode = m; target = child;
  $("kidTitle").textContent = m === "register" ? "② 아이 등록" : `「${child}」 승인번호 새로 정하기`;
  $("childField").hidden = m !== "register";
  $("consentBox").hidden = m !== "register";
  $("kidBtn").textContent = m === "register" ? "가입하기" : "새 번호로 바꾸기";
  $("child").value = child; $("code").value = ""; $("code2").value = ""; $("kidMsg").textContent = "";
  show("kid");
  (m === "register" ? $("child") : $("code")).focus();
}
async function submitKid(event) {
  event.preventDefault();
  const child = mode === "register" ? $("child").value.trim() : target, code = $("code").value, again = $("code2").value;
  if (!child) { $("kidMsg").textContent = ERRORS.child_invalid; return; }
  const problem = codeProblem(code, again, child);
  if (problem) { $("kidMsg").textContent = ERRORS[problem]; return; }
  if (mode === "register" && !($("consentPrivacy").checked && $("consentGuardian").checked)) { $("kidMsg").textContent = ERRORS.consent_required; return; }
  $("kidBtn").disabled = true; $("kidMsg").textContent = "저장하고 있어요…";
  try {
    const r = await call(mode === "register" ? { action: "sm-register", child, code: code.trim(), consent: true } : { action: "sm-reissue", child, code: code.trim() });
    $("doneTitle").textContent = mode === "register" ? "가입 완료!" : "승인번호를 새로 정했어요!";
    $("doneName").textContent = r.child;
    $("doneCode").textContent = code.trim().toUpperCase();
    $("startBtn").onclick = async () => {
      $("startBtn").disabled = true;
      try { await login(code.trim(), r.child); location.href = "./index.html"; }
      catch { $("startBtn").disabled = false; location.href = "./index.html"; }
    };
    show("done");
  } catch (error) { $("kidMsg").textContent = failText(error); }
  finally { $("kidBtn").disabled = false; }
}

$("emailForm").addEventListener("submit", sendCode);
$("resendBtn").addEventListener("click", () => { $("otpBox").hidden = true; $("sendBtn").hidden = false; $("otp").value = ""; sendCode(); });
$("verifyBtn").addEventListener("click", verifyCode);
$("otp").addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); verifyCode(); } });
$("addBtn").addEventListener("click", () => openKid("register"));
$("kidCancel").addEventListener("click", () => (parent ? loadKids().catch(() => show("email")) : show("email")));
$("kidForm").addEventListener("submit", submitKid);

if (parent) { $("email").value = parent.email; loadKids().catch(() => show("email")); } else show("email");
