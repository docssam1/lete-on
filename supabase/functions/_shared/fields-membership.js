// 지필드 사고력 수학 스스로 공부 회원 — 열리는 범위 계산(fields-auth · fields-members가 같이 쓴다).
// 원장 2026-10-29: 체험(승인 전)은 가입 뒤 2주 · 시작 권 1권만. 정규(원장 승인)는 한 달에 1권씩 열리고, 더 하려면 추가 요청 → 원장이 1권 더.
// 승인번호 없이 「체험하기」(로그인 안 함)는 1권 1단원만 — 그건 화면(fields-access.js)이 막는다.
export const FIELDS_BOOKS = ["book-01", "book-02", "book-03", "book-04", "book-05", "book-06", "book-07", "book-08", "book-09", "book-10"];
export const TRIAL_DAYS = 14;

// 달 수(달력 기준): 1월 15일 → 2월 15일이 1달
export function monthsBetween(from, to) {
  const a = new Date(from), b = new Date(to);
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  if (b.getUTCDate() < a.getUTCDate()) months -= 1;
  return Math.max(0, months);
}
const addMonths = (date, n) => { const d = new Date(date); d.setUTCMonth(d.getUTCMonth() + n); return d; };

// 회원 한 명의 지금 상태: { open, reason?, status, trialUntil, upTo(마지막으로 열린 권), books, nextOpensAt, start }
export function membershipSummary(m, now = new Date()) {
  if (!m) return null;
  const start = { book: m.start_book, unit: m.start_unit, part: m.start_part, setBy: m.start_set_by || "" };
  const base = { status: m.status, trialUntil: m.trial_until, approvedAt: m.approved_at, start, approvalRequestedAt: m.approval_requested_at, bookRequestedAt: m.book_requested_at, extraBooks: m.extra_books || 0 };
  if (m.status === "paused") return { ...base, open: false, reason: "paused", books: [] };
  const s = Math.max(0, FIELDS_BOOKS.indexOf(m.start_book));
  let count, nextOpensAt = null;
  if (m.status === "trial") {
    if (new Date(m.trial_until) < now) return { ...base, open: false, reason: "trial_expired", books: [] };
    count = 1 + (m.extra_books || 0);
  } else {
    const months = monthsBetween(m.approved_at || m.created_at, now);
    count = 1 + months + (m.extra_books || 0);
    nextOpensAt = addMonths(m.approved_at || m.created_at, months + 1).toISOString();
  }
  const last = Math.min(FIELDS_BOOKS.length - 1, s + count - 1);
  return { ...base, open: true, upTo: FIELDS_BOOKS[last], books: FIELDS_BOOKS.slice(0, last + 1), nextOpensAt: last < FIELDS_BOOKS.length - 1 ? nextOpensAt : null };
}
