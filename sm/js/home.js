// 홈: 로그인 확인 → 책 고르기(A1-2 · A1-3) → 단원 지도
import { gate, logout } from "./access.js?v=20261115a";
import { renderLogin, renderNoPermission } from "./login-view.js?v=20261115a";
import { BOOKS, findBook } from "./book.js?v=20261115a";
import { readLesson } from "./progress.js?v=20261115a";

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

// 고른 책: 주소 ?b= → 이 기기에 기억한 책 → A1-3(처음부터 있던 책)
const BOOK_KEY = "sm-book";
function pickBook() {
  const q = new URLSearchParams(location.search).get("b");
  let saved = null; try { saved = localStorage.getItem(BOOK_KEY); } catch { /* 저장 안 됨 */ }
  return findBook(q) || findBook(saved) || findBook("a1-3");
}

function renderHome(me, BOOK = pickBook()) {
  const child = me.name;
  try { localStorage.setItem(BOOK_KEY, BOOK.id); } catch { /* 저장 안 됨 */ }
  app.className = "sm-home";
  app.innerHTML = `
    <header class="sm-top" style="padding-left:0;padding-right:0">
      <div class="sm-title">레이키즈</div>
      <nav class="sm-books" aria-label="책 고르기">${BOOKS.map((b) => `<button class="sm-btn ${b.id === BOOK.id ? "go" : ""}" type="button" data-book="${b.id}" aria-pressed="${b.id === BOOK.id}">${esc(b.short)}</button>`).join("")}</nav>
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
  app.querySelectorAll("[data-book]").forEach((b) => b.addEventListener("click", () => {
    const next = findBook(b.dataset.book); if (!next || next === BOOK) return;
    history.replaceState(null, "", `?b=${next.id}`); renderHome(me, next);
  }));
  app.querySelector("[data-out]")?.addEventListener("click", async () => { await logout(); start(); });
}

start();
