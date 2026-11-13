// 학부모 로그인·권한 없음 화면(홈과 차시가 같이 쓴다)
import { login, logout, loginError } from "./access.js?v=20261114c";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function renderLogin(root, { onDone }) {
  root.className = "sm-gate";
  root.innerHTML = `
    <div class="hero" aria-hidden="true">🦒</div>
    <h1>레이키즈 학습</h1>
    <p class="lead">학부모님이 로그인해 주세요.<br>필즈 더 클래식과 같은 승인번호를 써요.</p>
    <form class="sm-card" novalidate>
      <p class="who">👨‍👩‍👧 학부모 로그인</p>
      <label class="sm-field"><span>아이 이름</span><input name="name" autocomplete="off" inputmode="text" required></label>
      <label class="sm-field"><span>승인번호</span><input name="code" autocomplete="off" inputmode="text" required></label>
      <p class="sm-msg" role="alert"></p>
      <button class="sm-btn go big" type="submit">들어가기</button>
      <p class="sm-note">원생만 이용할 수 있어요. 승인번호는 학원에서 받을 수 있어요.</p>
    </form>`;
  const form = root.querySelector("form"), msg = root.querySelector(".sm-msg"), btn = form.querySelector("button");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.name.value.trim(), code = form.code.value.trim();
    if (!name || !code) { msg.textContent = "아이 이름과 승인번호를 모두 넣어 주세요."; return; }
    btn.disabled = true; msg.textContent = "";
    try { await login(code, name); onDone(); }
    catch (error) { msg.textContent = loginError(error); btn.disabled = false; }
  });
}

export function renderNoPermission(root, me, { onDone }) {
  root.className = "sm-gate";
  root.innerHTML = `
    <div class="hero" aria-hidden="true">🔒</div>
    <h1>아직 열리지 않았어요</h1>
    <p class="lead"><b>${esc(me?.name)}</b> 계정에 레이키즈 학습이 아직 켜져 있지 않아요.<br>학원에 말씀해 주시면 열어 드려요.</p>
    <button class="sm-btn blue big" type="button">다른 계정으로 로그인</button>`;
  root.querySelector("button").addEventListener("click", async () => { await logout(); onDone(); });
}
