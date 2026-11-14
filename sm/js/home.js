// 홈: 로그인 확인 → 교재별 구분 상자(A1-2 · A1-3) 안에 단원 지도
import { gate, logout } from "./access.js?v=20261115b";
import { renderLogin, renderNoPermission } from "./login-view.js?v=20261115b";
import { BOOKS, findBook } from "./book.js?v=20261115b";
import { readLesson } from "./progress.js?v=20261115b";

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

// 교재마다 구분 상자 하나(원장 2026-11-13 「교재 구분 박스도 만들어야지」): 이름표 띠 + 그 교재의 단원 카드.
//  주소 ?b= 또는 이 기기에서 마지막에 연 교재 상자로 스크롤한다(수업에서 🏠로 돌아올 때).
const BOOK_KEY = "sm-book";
function lastBook() {
  const q = new URLSearchParams(location.search).get("b");
  let saved = null; try { saved = localStorage.getItem(BOOK_KEY); } catch { /* 저장 안 됨 */ }
  return findBook(q) || findBook(saved);
}

function bookBox(book, child) {
  return `
    <section class="sm-bookbox" id="book-${book.id}" style="--b:${book.color}" aria-label="${esc(book.title)}">
      <header class="sm-bookhead">
        <span class="tag">${esc(book.short)}</span>
        <h2>${esc(book.title)}</h2>
        <span class="note">${esc(book.note || "")}</span>
      </header>
      <div class="sm-units">
        ${book.units.map((u) => `
          <article class="sm-unit" style="--u:${u.color}">
            <span class="emoji" aria-hidden="true">${u.emoji}</span>
            <span class="num">${u.n}</span>
            <h2>${esc(u.title)}</h2>
            <div class="sessions">
              ${u.sessions.map((s) => {
                const rec = readLesson(child, book.id, s.id);
                return s.ready
                  ? `<a class="sm-btn ${rec?.done ? "go done" : "blue"}" href="./lesson.html?l=${s.id}" data-book="${book.id}" style="text-decoration:none">${s.label}</a>`
                  : `<button class="sm-btn" type="button" disabled title="곧 열려요">${s.label} 🔒</button>`;
              }).join("")}
            </div>
          </article>`).join("")}
      </div>
    </section>`;
}

function renderHome(me) {
  const child = me.name;
  app.className = "sm-home";
  app.innerHTML = `
    <header class="sm-top" style="padding-left:0;padding-right:0">
      <div class="sm-title">레이키즈</div>
      <nav class="sm-books" aria-label="교재로 가기">${BOOKS.map((b) => `<a class="sm-btn" href="#book-${b.id}" style="--b:${b.color};text-decoration:none">${esc(b.short)}</a>`).join("")}</nav>
      ${me.open ? "" : `<button class="sm-btn" type="button" data-out style="font-size:18px;min-height:56px">로그아웃</button>`}
    </header>
    <p class="sm-hello"><span aria-hidden="true">👋</span> ${me.open ? "" : `${esc(child)}, `}오늘은 무엇을 해 볼까요?</p>
    ${BOOKS.map((b) => bookBox(b, child)).join("")}`;
  app.querySelectorAll("a[data-book]").forEach((a) => a.addEventListener("click", () => { try { localStorage.setItem(BOOK_KEY, a.dataset.book); } catch { /* 저장 안 됨 */ } }));
  app.querySelector("[data-out]")?.addEventListener("click", async () => { await logout(); start(); });
  const last = lastBook();
  if (last && last !== BOOKS[0]) requestAnimationFrame(() => document.getElementById(`book-${last.id}`)?.scrollIntoView({ block: "start" }));
}

start();
