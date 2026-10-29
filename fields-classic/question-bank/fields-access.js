import { loggedIn, memberCall } from "./study-progress.js?v=20261029q";

// 스스로 공부를 어디까지 열어 주나(원장 2026-10-29 「이메일 인증 후 2주 체험 · 인증하지 않고 둘러보기는 한 주분만 · 그다음 정식」)
//   둘러보기(로그인 안 함)      → 1권 1단원(한 주 = 1·2차시)만
//   가입 회원 · 체험(14일)      → 시작 권 하나(fields-membership.js)
//   가입 회원 · 정식(원장 승인) → 시작 권부터 한 달에 1권씩 + 추가 요청으로 원장이 더 연 권
//   원장이 직접 만든 옛 승인번호(회원 표에 없음)·선생님 → 전부
// 서버(fields-auth)는 체험이 끝났거나 멈춘 회원의 로그인을 막는다. 화면은 여기서 권·단원을 막는다.
// 회원 정식 승인·다음 권 요청은 카톡으로 하고(원장 2026-10-29), 서버에는 「요청함」 표시만 남긴다.
export const KAKAO = "https://open.kakao.com/me/gfield";
export const PREVIEW = { book: "book-01", unit: 0 };

const BOOK_LABEL = (id) => `${Number(String(id).slice(5)) || 1}권`;
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const day = (iso) => { const d = new Date(iso); return `${d.getMonth() + 1}월 ${d.getDate()}일`; };
export const daysLeft = (iso) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));

// 지금 이 기기의 사람: { kind: preview | admin | legacy | member, name, member }
export function viewer() {
  const me = loggedIn();
  if (!me) return { kind: "preview" };
  if (me.type === "admin") return { kind: "admin", name: me.name };
  if (!me.member) return { kind: "legacy", name: me.name };
  return { kind: "member", name: me.name, member: me.member };
}

// 이 권(·단원)을 공부할 수 있나 → { ok, why: preview | book | trial_expired | paused }
export function canStudy(bookId, unitIndex = null) {
  const who = viewer();
  if (who.kind === "admin" || who.kind === "legacy") return { ok: true, who };
  if (who.kind === "preview") {
    const ok = bookId === PREVIEW.book && (unitIndex === null || Number(unitIndex) === PREVIEW.unit);
    return { ok, why: ok ? "" : "preview", who, partial: bookId === PREVIEW.book };
  }
  const m = who.member;
  if (!m.open) return { ok: false, why: m.reason || "paused", who };
  return { ok: (m.books || []).includes(bookId), why: "book", who };
}

let cssAdded = false;
function addCss() {
  if (cssAdded) return;
  cssAdded = true;
  const link = document.createElement("link");
  link.rel = "stylesheet"; link.href = new URL("./fields-access.css?v=20261029q", import.meta.url).href;
  document.head.append(link);
}

// 카톡으로 보낼 말을 미리 복사해 두고 카톡 창을 연다. 서버에는 요청 표시만(로그인한 회원일 때).
export async function askOnKakao(kind, note) {
  const who = viewer();
  const text = kind === "book"
    ? `[다음 권 추가 요청] 아이 이름: ${who.name || ""}${note ? ` · ${note}` : ""}`
    : `[정규회원 승인 요청] 아이 이름: ${who.name || ""}`;
  try { await navigator.clipboard?.writeText(text); } catch {}
  window.open(KAKAO, "_blank", "noopener");
  if (who.kind === "member") await memberCall({ action: "request", kind: kind === "book" ? "book" : "regular" }).catch(() => null);
  return text;
}

// 잠긴 권·단원 안내 카드(HTML). 단추는 data-fa="signup|login|book|regular"
export function lockCard(why, { bookId = "", here = "" } = {}) {
  addCss();
  const who = viewer();
  const m = who.member;
  const login = `./login.html${here ? `?next=${encodeURIComponent(here)}` : ""}`;
  if (why === "preview") return `<div class="fa-lock"><p class="fa-kick">둘러보기</p>
    <h2>둘러보기는 1권 1단원(한 주 분량)까지예요</h2>
    <p>이메일로 가입하면 승인번호가 바로 나오고 <b>2주 동안 체험</b>할 수 있어요. 체험이 끝난 뒤에는 정식 회원으로 이어서 공부해요.</p>
    <div class="fa-actions"><a class="fa-btn primary" href="./signup.html">이메일로 가입하기 ›</a><a class="fa-btn" href="${login}">승인번호로 로그인</a></div></div>`;
  if (why === "trial_expired" || why === "paused") return `<div class="fa-lock"><p class="fa-kick">${why === "paused" ? "잠시 멈춤" : "체험 끝"}</p>
    <h2>${why === "paused" ? "지금은 공부가 잠시 멈춰 있어요" : "2주 체험이 끝났어요"}</h2>
    <p>정규회원 승인은 카톡으로 요청해 주세요. 승인되면 같은 승인번호로 이어서 공부해요.</p>
    <div class="fa-actions"><button type="button" class="fa-btn primary" data-fa="regular">정규회원 승인 요청(카톡) ›</button></div><p class="fa-small" data-fa-msg></p></div>`;
  // 회원인데 아직 안 열린 권
  const trial = m?.status === "trial";
  const upTo = m?.upTo ? BOOK_LABEL(m.upTo) : "";
  const asked = m?.bookRequestedAt ? `<p class="fa-small">${day(m.bookRequestedAt)}에 추가 요청을 보냈어요. 원장님이 열어 주시면 바로 보여요.</p>` : "";
  return `<div class="fa-lock"><p class="fa-kick">${esc(BOOK_LABEL(bookId))}</p>
    <h2>${esc(BOOK_LABEL(bookId))}은 아직 열리지 않았어요</h2>
    <p>${trial ? `체험 동안은 <b>${esc(upTo)}</b>만 공부해요. 정규회원이 되면 한 달에 1권씩 열려요.` : `지금은 <b>${esc(upTo)}까지</b> 열려 있어요.${m?.nextOpensAt ? ` 다음 권은 ${day(m.nextOpensAt)}에 열려요.` : ""} 더 빨리 하고 싶으면 추가 요청을 보내 주세요.`}</p>
    <div class="fa-actions">${trial ? `<button type="button" class="fa-btn primary" data-fa="regular">정규회원 승인 요청(카톡) ›</button>` : `<button type="button" class="fa-btn primary" data-fa="book" data-book="${esc(bookId)}">다음 권 추가 요청(카톡) ›</button>`}</div>
    ${asked}<p class="fa-small" data-fa-msg></p></div>`;
}

// 카드 안 단추 연결
export function wireAccess(root) {
  root.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-fa]");
    if (!button || !["book", "regular"].includes(button.dataset.fa)) return;
    const box = button.closest(".fa-lock, .fa-banner");
    const msg = box?.querySelector("[data-fa-msg]");
    await askOnKakao(button.dataset.fa, button.dataset.book ? `${BOOK_LABEL(button.dataset.book)} 열어 주세요` : "");
    if (msg) msg.textContent = "보낼 말을 복사해 두었어요. 카톡 창에 붙여 넣어 보내 주세요.";
  });
}

// 머리 띠: 체험 중이면 남은 날 + 정규회원 요청, 둘러보기면 가입 안내
export function accessBanner() {
  addCss();
  const who = viewer();
  if (who.kind === "preview") return `<div class="fa-banner"><span><b>둘러보기</b> · 1권 1단원(한 주 분량)까지 열려 있어요</span><a class="fa-btn small primary" href="./signup.html">이메일로 가입하고 2주 체험 ›</a></div>`;
  if (who.kind !== "member" || !who.member.open) return "";
  const m = who.member;
  if (m.status === "trial") {
    const left = daysLeft(m.trialUntil);
    return `<div class="fa-banner"><span><b>체험 중</b> · ${left ? `${left}일 남았어요` : "오늘까지예요"}(${day(m.trialUntil)}까지) · ${esc(BOOK_LABEL(m.upTo))}</span>${m.approvalRequestedAt ? `<small>정규회원 요청을 보냈어요</small>` : `<button type="button" class="fa-btn small primary" data-fa="regular">정규회원 승인 요청(카톡) ›</button>`}<small data-fa-msg></small></div>`;
  }
  return "";
}

// 화면 전체를 잠금 안내로 바꾼다(study.html 처럼 그 자리에서 공부를 시작하는 화면)
export function lockPage(why, ctx = {}) {
  addCss();
  document.body.className = "fa-page";
  document.body.innerHTML = `<main class="fa-wrap">${lockCard(why, ctx)}<p class="fa-small"><a href="./start.html${ctx.student ? `?student=${encodeURIComponent(ctx.student)}` : ""}">‹ 처음 화면으로</a></p></main>`;
  wireAccess(document.body);
}
