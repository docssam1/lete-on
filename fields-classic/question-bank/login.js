import { login, logout, checkSession, loggedIn } from "./study-progress.js?v=20261028n";

// 승인(로그인) 페이지(원장 2026-10-27): 승인번호 + 이름 → 학생은 스스로 공부 첫 화면, 관리자(DOCSSAM)는 선생님 보기.
// &next=my-study.html 처럼 돌아갈 화면을 줄 수 있다(같은 폴더의 html 만).
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const next = /^[\w-]+\.html$/u.test(params.get("next") || "") ? params.get("next") : "";
const MESSAGES = {
  credentials_invalid: "승인번호와 이름을 다시 확인해 주세요.",
  too_many_attempts: "로그인 시도가 많아요. 잠시 뒤에 다시 해 주세요.",
  admin_auth_unavailable: "관리자 확인에 연결하지 못했어요. 잠시 뒤에 다시 해 주세요."
};
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
  $("submit").disabled = true; $("error").textContent = "확인하고 있어요…";
  try {
    const me = await login(code, name);
    location.assign(destination(me));
  } catch (error) {
    $("error").textContent = MESSAGES[error.message] || (error instanceof TypeError ? "인터넷 연결을 확인해 주세요." : "로그인하지 못했어요. 다시 해 주세요.");
  } finally { $("submit").disabled = false; }
});

if (loggedIn()) {
  showAlready(loggedIn());
  checkSession().then((me) => { if (me) showAlready(me); else { $("already").hidden = true; $("form").hidden = false; } });
} else $("code").focus();
