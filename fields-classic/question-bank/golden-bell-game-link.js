const API = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/fields-game-link";

async function request(body, session = "") {
  const response = await fetch(API, {
    method: "POST", credentials: "omit", cache: "no-store",
    headers: { "Content-Type": "application/json", ...(session ? { "x-fields-session": session } : {}) },
    body: JSON.stringify(body), signal: AbortSignal.timeout(20000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "game_link_unavailable");
  return data;
}

export async function issueGameLinks(activities, session) {
  return request({ action: "issue", activities }, session);
}

// QR capabilities are never exchanged for, or stored as, Fields login sessions.
export async function resolveGameLink(token) {
  return request({ action: "resolve", token });
}

export function gameLinkURL(token) {
  const url = new URL("https://lete-on.gfieldacademy.net/fields-classic/question-bank/game.html");
  url.hash = token;
  return url.href;
}
