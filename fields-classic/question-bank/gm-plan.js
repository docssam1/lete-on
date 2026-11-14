// ⚠ 이 파일은 supabase/functions/_shared/fields-membership.js 를 그대로 옮긴 것이다(관리자 화면의 「저장하면 이렇게 열려요」 미리보기용).
// 서버 쪽을 고치면 cp 로 다시 옮기고 node fields-classic/question-bank/tools/check-gm-plan-copy.mjs 로 확인한다.
// 지필드 사고력 수학 스스로 공부(GM 과정) 회원 — 열리는 범위 계산(fields-auth · fields-members가 같이 쓴다).
// 원장 2026-10-29: 체험(승인 전)은 가입 뒤 2주 · 시작 권 1권만. 정규(원장 승인)는 한 달에 1권씩 열리고, 더 하려면 추가 요청 → 원장이 1권 더.
// 원장 2026-11-14 「gm과정을 권별 이나 기간 둘로 나눠 관리」: 승인번호마다 GM 열기 방식(표 fields_gm_plans)을 둘 수 있다.
//   권별(book)  — 원장이 고른 권만, 기한 없이
//   기간(period)— 시작일부터 끝나는 날(없으면 계속)까지, 시작 권부터 한 달에 1권씩 + 원장이 더 연 권
// 방식이 정해져 있으면 그것이 먼저다. 없으면 이메일 가입 회원은 위 체험·정규 규칙, 원장이 직접 만든 승인번호(모의고사 회원 등)는
// GM이 열리지 않는다(reason gm_none — 화면이 둘러보기처럼 1권 1단원만 연다. 원장 2026-11-14 「GM은 따로 켜야 열림」).
// 승인번호 없이 「둘러보기」(로그인 안 함)는 1권 1단원만 — 그건 화면(fields-access.js)이 막는다.
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
// 날짜(YYYY-MM-DD)는 한국 시각으로 그날 0시 ~ 그날 끝까지
const dayStart = (d) => new Date(`${String(d).slice(0, 10)}T00:00:00+09:00`);
const dayEnd = (d) => new Date(`${String(d).slice(0, 10)}T23:59:59.999+09:00`);
const sortBooks = (list) => FIELDS_BOOKS.filter((id) => (list || []).includes(id));

// 방식 표의 한 줄 → 화면에 보낼 꼴
export function planView(row) {
  if (!row) return null;
  return { mode: row.mode, books: sortBooks(row.books), startBook: row.start_book, startsOn: String(row.starts_on || "").slice(0, 10),
    endsOn: row.ends_on ? String(row.ends_on).slice(0, 10) : null, extraBooks: row.extra_books || 0, updatedAt: row.updated_at || null };
}

// 방식대로 지금 열린 권: { open, reason?, books, upTo, nextOpensAt, endsOn }
function planOpen(plan, now) {
  if (plan.mode === "book") {
    const books = sortBooks(plan.books);
    return books.length ? { open: true, books, upTo: books.at(-1), nextOpensAt: null } : { open: false, reason: "gm_none", books: [] };
  }
  if (plan.startsOn && dayStart(plan.startsOn) > now) return { open: false, reason: "not_started", books: [] };
  if (plan.endsOn && dayEnd(plan.endsOn) < now) return { open: false, reason: "period_ended", books: [] };
  const s = Math.max(0, FIELDS_BOOKS.indexOf(plan.startBook));
  const from = plan.startsOn ? dayStart(plan.startsOn) : now;
  const months = monthsBetween(from, now);
  const last = Math.min(FIELDS_BOOKS.length - 1, s + months + (plan.extraBooks || 0));
  let nextOpensAt = last < FIELDS_BOOKS.length - 1 ? addMonths(from, months + 1).toISOString() : null;
  if (nextOpensAt && plan.endsOn && new Date(nextOpensAt) > dayEnd(plan.endsOn)) nextOpensAt = null;
  return { open: true, books: FIELDS_BOOKS.slice(0, last + 1), upTo: FIELDS_BOOKS[last], nextOpensAt };   // 시작 권 앞의 권도 복습용으로 연다(예전 정규 규칙과 같다)
}

// 이메일 가입 회원 한 명의 지금 상태(m = fields_members 한 줄, planRow = fields_gm_plans 한 줄 또는 null)
// { kind:"member", open, reason?, status, trialUntil, upTo, books, nextOpensAt, start, plan(정해 둔 방식 또는 null), endsOn }
export function membershipSummary(m, planRow = null, now = new Date()) {
  if (!m) return null;
  const start = { book: m.start_book, unit: m.start_unit, part: m.start_part, setBy: m.start_set_by || "" };
  const plan = planView(planRow);
  const base = { kind: "member", status: m.status, trialUntil: m.trial_until, approvedAt: m.approved_at, start, approvalRequestedAt: m.approval_requested_at, bookRequestedAt: m.book_requested_at, extraBooks: m.extra_books || 0, plan, endsOn: plan?.mode === "period" ? plan.endsOn : null };
  if (m.status === "paused") return { ...base, open: false, reason: "paused", books: [] };
  if (plan) return { ...base, ...planOpen(plan, now) };
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

// 원장이 직접 만든 승인번호(회원 표에 없음)의 GM 상태. 방식이 없으면 열리지 않는다(gm_none).
export function directSummary(planRow, now = new Date()) {
  const plan = planView(planRow);
  const base = { kind: "direct", status: "direct", plan, endsOn: plan?.mode === "period" ? plan.endsOn : null,
    start: plan ? { book: plan.mode === "book" ? (plan.books[0] || "book-01") : plan.startBook, unit: 0, part: 1, setBy: "admin" } : null };
  if (!plan) return { ...base, open: false, reason: "gm_none", books: [] };
  return { ...base, ...planOpen(plan, now) };
}

// 로그인을 막아야 하나: 이메일 가입 회원의 체험 끝·멈춤만. 방식(권별·기간)으로 닫힌 것은 로그인은 되고 화면이 막는다
// (모의고사 회원도 같은 승인번호로 모의고사에 들어가야 하므로).
export const blocksLogin = (summary) => Boolean(summary && summary.kind === "member" && !summary.open && ["trial_expired", "paused"].includes(summary.reason));
