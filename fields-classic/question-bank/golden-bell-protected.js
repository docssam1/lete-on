const API_ROOT = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1";
const SESSION_KEY = "gfield_fields_session";

async function request(path, body, token = "") {
  const response = await fetch(`${API_ROOT}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { "x-fields-session": token } : {}) },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `request_failed_${response.status}`);
  return payload;
}

export async function ensureFieldsSession(student) {
  const existing = sessionStorage.getItem(SESSION_KEY) || "";
  if (existing) {
    try {
      await request("fields-auth", { action: "session" }, existing);
      return existing;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }
  const code = sessionStorage.getItem("gf_c") || "";
  const name = sessionStorage.getItem("gf_n") || student || "";
  if (!code || !name) throw new Error("login_required");
  const result = await request("fields-auth", { action: "login", code, name });
  sessionStorage.setItem(SESSION_KEY, result.token);
  return result.token;
}

export async function loadProtectedGoldenBellBook(bookId, student) {
  const token = await ensureFieldsSession(student);
  return request("golden-bell-answers", { bookId }, token);
}

export function hydrateProtectedAnswers(value, records) {
  if (!value || typeof value !== "object") return;
  const record = value.answerRef ? records?.[value.answerRef] : null;
  if (record) {
    if (Object.hasOwn(record, "answer")) value.answer = record.answer;
    if (Object.hasOwn(record, "solution")) value.solution = record.solution;
    if (Object.hasOwn(record, "explanation")) value.explanation = record.explanation;
  }
  Object.values(value).forEach(child => hydrateProtectedAnswers(child, records));
}
