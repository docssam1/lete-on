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

function validAnswer(value) {
  if (Array.isArray(value)) return value.length > 0 && value.every(entry => !Array.isArray(entry) && validAnswer(entry));
  return typeof value === "number" ? Number.isFinite(value) : typeof value === "string" && value.trim() !== "";
}

export function hasProtectedAnswer(item) {
  if (!item || typeof item !== "object") return false;
  return item.parts?.length ? item.parts.every(hasProtectedAnswer) : validAnswer(item.answer);
}

export function hydrateProtectedAnswers(value, records) {
  const bindings = [];
  const visit = node => {
    if (!node || typeof node !== "object") return;
    if (node.answerRef) {
      const record = Object.hasOwn(records || {}, node.answerRef) ? records[node.answerRef] : null;
      const hasAnswer = record && Object.hasOwn(record, "answer");
      const hasSolution = typeof record?.solution === "string" && record.solution.trim() !== "";
      if (!record || (hasAnswer ? !validAnswer(record.answer) : !hasSolution)) {
        throw new Error("protected_answers_incomplete");
      }
      bindings.push([node, record]);
    }
    Object.values(node).forEach(visit);
  };
  // Validate the complete book before exposing any answers from this response.
  visit(value);
  for (const [node, record] of bindings) {
    for (const key of ["answer", "solution", "explanation"]) {
      if (Object.hasOwn(record, key)) node[key] = record[key];
    }
  }
}
