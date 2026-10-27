// 스스로 공부 학습 기록(원장 2026-10-27 「학생이 직접 학습 상황을 볼 수 있게 · 수행률 진도」)
//   week      <권>-u<단원>   한 주 덱에서 본 장(수행률·진도): { total, seen: [장 열쇠], phases: { 종류: [본 장, 모든 장] }, last }
//   test      <권>-u<단원>   단원 평가: { right, total, marked, weak: [유형 id] }
//   book-test <권>           권별 테스트: { right, total, marked, wrong: [번호], weak: [유형 id] }
// 늘 이 기기(localStorage)에 저장하고, 승인 페이지(login.html)로 로그인한 학생이면 서버(fields-progress → fields_study_records)에도 저장한다.
// 로그인 없이 쓰면(데모) 이 기기에만 남는다. 문제 글·정답은 기록하지 않는다.
// 로그인은 fields-auth(승인번호 + 이름, 12시간 세션)를 그대로 쓴다 — 관리자 DOCSSAM 은 선생님 보기(teacher.html).
const ROOT = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1";
const API = `${ROOT}/fields-progress`;
const SESSION_KEY = "gfield_fields_session";
const NAME_KEY = "gf_n", TYPE_KEY = "gf_t";
const PREFIX = "fields-classic-rec:";
const localKey = (student, kind, key) => `${PREFIX}${student}:${kind}:${key}`;

function session() {
  try { return sessionStorage.getItem(SESSION_KEY) || ""; } catch { return ""; }
}
const stored = (key) => { try { return sessionStorage.getItem(key) || ""; } catch { return ""; } };
// 로그인한 사람(없으면 null) — 화면 머리줄의 이름·로그아웃, 선생님 보기 판단에 쓴다(서버 확인 전 값)
export function loggedIn() {
  return session() ? { name: stored(NAME_KEY), type: stored(TYPE_KEY) || "student" } : null;
}
async function auth(body, token = "") {
  const response = await fetch(`${ROOT}/fields-auth`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { "x-fields-session": token } : {}) }, body: JSON.stringify(body), cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(payload.error || `request_failed_${response.status}`); error.status = response.status; throw error; }
  return payload;
}
export async function login(code, name) {
  const result = await auth({ action: "login", code: String(code || "").trim(), name: String(name || "").replace(/\s+/gu, "") });
  try {
    sessionStorage.setItem(SESSION_KEY, result.token);
    sessionStorage.setItem(NAME_KEY, result.name);
    sessionStorage.setItem(TYPE_KEY, result.type === "admin" ? "admin" : "student");
  } catch {}
  return { name: result.name, type: result.type === "admin" ? "admin" : "student" };
}
// 저장된 세션이 아직 살아 있는지 서버에 묻는다. 만료됐으면 지운다.
export async function checkSession() {
  const token = session();
  if (!token) return null;
  try {
    const result = await auth({ action: "session" }, token);
    return { name: result.name, type: result.type === "admin" ? "admin" : "student" };
  } catch (error) {
    if (error.status === 401) clearSession();
    return null;
  }
}
function clearSession() { try { [SESSION_KEY, NAME_KEY, TYPE_KEY, "gf_c"].forEach((key) => sessionStorage.removeItem(key)); } catch {} }
export async function logout() {
  const token = session();
  clearSession();
  if (token) await auth({ action: "logout" }, token).catch(() => null);
}
async function call(body) {
  const token = session();
  if (!token) return null;
  const response = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", "x-fields-session": token }, body: JSON.stringify(body), cache: "no-store", keepalive: body.action === "save" });
  if (!response.ok) return null;
  return response.json().catch(() => null);
}

export function readRecord(student, kind, key) {
  try { return JSON.parse(localStorage.getItem(localKey(student, kind, key)) || "null")?.payload ?? null; } catch { return null; }
}

export function saveRecord(student, kind, key, payload) {
  const entry = { payload, updatedAt: new Date().toISOString() };
  try { localStorage.setItem(localKey(student, kind, key), JSON.stringify(entry)); } catch {}
  // 서버에는 로그인한 학생 자신의 공부만(선생님이 둘러보거나 데모 이름으로 연 것은 이 기기에만)
  const me = loggedIn();
  if (me && me.type === "student" && me.name === student) call({ action: "save", kind, key, payload }).catch(() => null);
  return entry;
}

// 선생님 보기: 학생 전체 기록과 승인된 학생 이름(관리자 세션만)
export async function loadClass() {
  return call({ action: "class" });
}

// 이 기기 기록 + (로그인했으면) 서버 기록. 같은 열쇠는 더 최근 것. 선생님(관리자)이 다른 학생을 열면 그 학생의 서버 기록.
export async function loadRecords(student) {
  const records = new Map();
  try {
    const head = `${PREFIX}${student}:`;
    for (let index = 0; index < localStorage.length; index += 1) {
      const name = localStorage.key(index);
      if (!name?.startsWith(head)) continue;
      const [kind, ...rest] = name.slice(head.length).split(":");
      const entry = JSON.parse(localStorage.getItem(name) || "null");
      if (entry) records.set(`${kind}:${rest.join(":")}`, { kind, key: rest.join(":"), payload: entry.payload, updatedAt: entry.updatedAt });
    }
  } catch {}
  const me = loggedIn();
  const remote = !me ? null : me.type === "admin" ? await call({ action: "student", name: student }).catch(() => null)
    : me.name === student ? await call({ action: "mine" }).catch(() => null) : null;
  for (const row of remote?.records || []) {
    const id = `${row.kind}:${row.record_key}`;
    const local = records.get(id);
    if (!local || String(local.updatedAt) < String(row.updated_at)) records.set(id, { kind: row.kind, key: row.record_key, payload: row.payload, updatedAt: row.updated_at });
  }
  return { records, synced: Boolean(remote) };
}

// 한 단원(주)의 수행률: 본 장 / 모든 장(표지·도착 빼고). 단원 평가는 채점까지 해야 끝.
export function weekRate(week, test) {
  if (!week?.total) return 0;
  const seen = new Set(week.seen || []);
  const testSlide = (week.phases?.test?.[1] || 0) > 0;
  let done = [...seen].filter((id) => !id.startsWith("test:")).length;
  if (testSlide && test?.marked && test.marked >= test.total) done += 1;
  return Math.min(100, Math.round((done / week.total) * 100));
}
