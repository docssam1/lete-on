import { login, logout, checkSession, loggedIn } from "./study-progress.js?v=20261029q";
import { KAKAO } from "./fields-access.js?v=20261029q";

// 승인(로그인) 페이지(원장 2026-10-27): 승인번호 + 이름 → 학생은 스스로 공부 첫 화면, 관리자(DOCSSAM)는 선생님 보기.
// 승인번호는 가입(signup.html, 이메일 인증)에서 받는다. 체험이 끝났거나 멈춘 회원은 서버가 막고, 여기서 카톡 요청 단추를 보인다.
// &next=my-study.html 처럼 돌아갈 화면을 줄 수 있다(같은 폴더의 html 만).
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const next = /^[\w-]+\.html$/u.test(params.get("next") || "") ? params.get("next") : "";
const MESSAGES = {
  credentials_invalid: "승인번호와 이름을 다시 확인해 주세요.",
  too_many_attempts: "로그인 시도가 많아요. 잠시 뒤에 다시 해 주세요.",
  admin_auth_unavailable: "관리자 확인에 연결하지 못했어요. 잠시 뒤에 다시 해 주세요.",
  trial_expired: "2주 체험이 끝났어요. 정규회원 승인은 카톡으로 요청해 주세요. 승인되면 같은 번호로 이어서 공부해요.",
  paused: "지금은 공부가 잠시 멈춰 있어요. 카톡으로 문의해 주세요."
};
// 체험이 끝난 회원(서버 403): 카톡으로 보낼 말을 복사해 두고 카톡 창을 연다(원장 2026-10-29 「정규회원 승인 요청은 카톡으로」)
let askName = "";
$("askBtn").addEventListener("click", async () => {
  try { await navigator.clipboard?.writeText(`[정규회원 승인 요청] 아이 이름: ${askName}`); } catch {}
  window.open(KAKAO, "_blank", "noopener");
  $("error").textContent = "보낼 말을 복사해 두었어요. 카톡 창에 붙여 넣어 보내 주세요.";
});
const destination = (me) => {
  const page = me.type === "admin" ? (next || "teacher.html") : (next && next !== "teacher.html" ? next : "start.html");
  return `./${page}?${new URLSearchParams(me.type === "admin" ? {} : { student: me.name })}`;
};

function showAlready(me) {
  $("already").hidden = false;
  $("already").innerHTML = `<p><b>${me.name}</b>${me.type === "admin" ? " (선생님)" : ""}으로 로그인되어 있어요.</p>
    <div class="ms-login-actions"><a class="ms-btn primary" href="${destination(me)}">계속하기 ›</a><button type="button" class="ms-btn" id="logoutBtn">로그아웃</button></div>`;
  $("form").hidden = true;
  $("logoutBtn").addEventListener("click", async () => { await logout(); $("already").hidden = true; $("form").hidden = false; $("code").focus(); });
}

$("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = $("code").value.trim(), name = $("name").value.replace(/\s+/gu, "");
  if (!code || !name) { $("error").textContent = "승인번호와 이름을 모두 넣어 주세요."; return; }
  $("submit").disabled = true; $("error").textContent = "확인하고 있어요…"; $("ask").hidden = true;
  try {
    const me = await login(code, name);
    location.assign(destination(me));
  } catch (error) {
    $("error").textContent = MESSAGES[error.message] || (error instanceof TypeError ? "인터넷 연결을 확인해 주세요." : "로그인하지 못했어요. 다시 해 주세요.");
    if (error.message === "trial_expired" || error.message === "paused") { askName = name; $("ask").hidden = false; }
  } finally { $("submit").disabled = false; }
});

if (loggedIn()) {
  showAlready(loggedIn());
  checkSession().then((me) => { if (me) showAlready(me); else { $("already").hidden = true; $("form").hidden = false; } });
} else $("code").focus();
