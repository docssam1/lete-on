// 홈: 로그인 확인 → 단원 지도(4단원 × 2차시)
import { gate, logout } from "./access.js?v=20261113l";
import { renderLogin, renderNoPermission } from "./login-view.js?v=20261113l";
import { BOOK } from "./book.js?v=20261113l";
import { readLesson } from "./progress.js?v=20261113l";

const app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

async function start() {
  const result = await gate();
  if (!result.ok) {
    if (result.why === "permission") renderNoPermission(app, result.me, { onDone: start });
    else renderLogin(app, { onDone: start });
    return;
  }
  renderHome(result.me);
}

function renderHome(me) {
  const child = me.name;
  app.className = "sm-home";
  app.innerHTML = `
    <header class="sm-top" style="padding-left:0;padding-right:0">
      <div class="sm-title">${esc(BOOK.title)}</div>
      ${me.open ? "" : `<button class="sm-btn" type="button" data-out style="font-size:18px;min-height:56px">로그아웃</button>`}
    </header>
    <p class="sm-hello"><span aria-hidden="true">👋</span> ${me.open ? "" : `${esc(child)}, `}오늘은 무엇을 해 볼까요?</p>
    <section class="sm-units">
      ${BOOK.units.map((u) => `
        <article class="sm-unit" style="--u:${u.color}">
          <span class="emoji" aria-hidden="true">${u.emoji}</span>
          <span class="num">${u.n}</span>
          <h2>${esc(u.title)}</h2>
          <div class="sessions">
            ${u.sessions.map((s) => {
              const rec = readLesson(child, BOOK.id, s.id);
              return s.ready
                ? `<a class="sm-btn ${rec?.done ? "go done" : "blue"}" href="./lesson.html?l=${s.id}" style="text-decoration:none">${s.label}</a>`
                : `<button class="sm-btn" type="button" disabled title="곧 열려요">${s.label} 🔒</button>`;
            }).join("")}
          </div>
        </article>`).join("")}
    </section>`;
  app.querySelector("[data-out]")?.addEventListener("click", async () => { await logout(); start(); });
}

start();
