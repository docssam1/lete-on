// 스스로 공부 학습 기록(원장 2026-10-27 「학생이 직접 학습 상황을 볼 수 있게 · 수행률 진도」)
//   week      <권>-u<단원>   한 주 덱에서 본 장(수행률·진도): { total, seen: [장 열쇠], phases: { 종류: [본 장, 모든 장] }, last }
//   test      <권>-u<단원>   단원 평가: { right, total, marked, weak: [유형 id] }
//   book-test <권>           권별 테스트: { right, total, marked, wrong: [번호], weak: [유형 id] }
// 지금은 데모: 이 기기(localStorage)에 저장한다. 학생이 로그인해 세션(gfield_fields_session)이 있으면 서버(fields-progress)에도 저장한다
// — 승인(로그인) 페이지는 나중에 만든다(원장 「우선은 데모로 두고 나중에 승인 페이지 만들자」). 문제 글·정답은 기록하지 않는다.
const API = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/fields-progress";
const SESSION_KEY = "gfield_fields_session";
const PREFIX = "fields-classic-rec:";
const localKey = (student, kind, key) => `${PREFIX}${student}:${kind}:${key}`;

function session() {
  try { return sessionStorage.getItem(SESSION_KEY) || ""; } catch { return ""; }
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
  call({ action: "save", kind, key, payload }).catch(() => null);
  return entry;
}

// 이 기기 기록 + (로그인했으면) 서버 기록. 같은 열쇠는 더 최근 것.
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
  const remote = await call({ action: "mine" }).catch(() => null);
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
