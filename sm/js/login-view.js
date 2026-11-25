// 학부모 로그인·권한 없음 화면(홈과 차시가 같이 쓴다)
import { login, logout, loginError } from "./access.js?v=20261123a";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function renderLogin(root, { onDone }) {
  root.className = "sm-gate";
  root.innerHTML = `
    <div class="hero" aria-hidden="true">🦒</div>
    <h1>유아 영재 학습 게임</h1>
    <p class="lead">학부모님이 아이 이름과 승인번호로 로그인해 주세요.</p>
    <form class="sm-card" novalidate>
      <p class="who">🔑 학부모 로그인</p>
      <label class="sm-field"><span>아이 이름</span><input name="name" autocomplete="off" inputmode="text" required></label>
      <label class="sm-field"><span>승인번호</span><input name="code" autocomplete="off" inputmode="text" required></label>
      <p class="sm-msg" role="alert"></p>
      <button class="sm-btn go big" type="submit">들어가기</button>
      <p class="sm-note">학원 원생은 필즈 더 클래식과 같은 승인번호를 써요.</p>
    </form>
    <div class="sm-card sm-join">
      <p class="who">✉️ 처음 오셨나요?</p>
      <a class="sm-btn blue big" href="./signup.html" style="text-decoration:none">이메일로 가입하기</a>
      <a class="sm-link" href="./signup.html#forgot">승인번호를 잊었어요</a>
    </div>`;
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
    <p class="lead"><b>${esc(me?.name)}</b> 계정에 유아 영재 학습 게임이 아직 켜져 있지 않아요.<br>학원에 말씀해 주시면 열어 드려요.</p>
    <button class="sm-btn blue big" type="button">다른 계정으로 로그인</button>`;
  root.querySelector("button").addEventListener("click", async () => { await logout(); onDone(); });
}
