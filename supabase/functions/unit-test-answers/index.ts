import { createClient } from "npm:@supabase/supabase-js@2";

// 권별 테스트 정답(원장 2026-10-28 「답안 확인 및 진단하기 · 답안지 인쇄」, 정답은 비공개 DB).
// 정답은 fields_unit_test_answer_keys 에만 있고 git·공개 파일에는 없다. 워밍업 정답(golden-bell-answers)과 같이
// 원장 결정 「모두에게 열기」에 따라 로그인 없이 내준다. 막을 때는 OPEN_ACCESS 를 false 로 두고 다시 배포한다.
// v3(2026-11-14): 2과정 권별 테스트(bookId course-02-g4 · course-02-a5 …)도 받는다.
// v4(2026-11-16): 선발시험(입학 모의고사) 정답도 받는다 — bookId selection-<시험 id>(원장 「답안이 없어」).
// v6(2026-11-16): 식 풀이 work·답 그림 answerVisual도 내보낸다(원장 「이미지 또는 식 형태」).
// v5(2026-11-16): 풀이 두 단계 brief(간단히 보기)·steps(설명 보기)도 내보낸다(원장 「풀이를 써야돼 … 간단히 보기와 설명보기」).
const OPEN_ACCESS = true;

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://127.0.0.1:8767",
  "http://localhost:8767",
  "http://127.0.0.1:8794",
  "http://localhost:8794",
]);

function headers(req: Request) {
  const value = new Headers({
    "Access-Control-Allow-Headers": "content-type, x-fields-session",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) value.set("Access-Control-Allow-Origin", origin);
  return value;
}
const json = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: headers(req) });

function secretKey() {
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (serviceRole) return serviceRole;
  const named = Deno.env.get("SUPABASE_SECRET_KEYS") || "";
  if (named) { try { return String(JSON.parse(named).default || ""); } catch { /* fallback */ } }
  return Deno.env.get("SUPABASE_SECRET_KEY") || "";
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);
  if (!OPEN_ACCESS && !/^[a-f0-9]{64}$/u.test(String(req.headers.get("x-fields-session") || ""))) return json(req, { error: "session_required" }, 401);
  const url = Deno.env.get("SUPABASE_URL") || "";
  const key = secretKey();
  if (!url || !key) return json(req, { error: "server_not_ready" }, 503);
  try {
    const body = await req.json();
    const bookId = String(body?.bookId || "");
    if (!/^(book-[0-9]{2}|course-0[23]-[ag][1-5]|selection-(k[67]|g1)-[0-9]{4}-[0-9]{2})$/u.test(bookId)) return json(req, { error: "book_invalid" }, 400);
    const service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await service.from("fields_unit_test_answer_keys").select("payload,updated_at").eq("book_id", bookId).maybeSingle();
    if (error) return json(req, { error: "lookup_failed" }, 503);
    if (!data) return json(req, { error: "answer_key_unavailable" }, 404);
    // 풀이 두 단계(v5): brief = 간단히 보기 한두 줄, steps = 설명 보기 단계 목록. 답 기록의 sourceNote 는 내보내지 않는다.
    const clean = (value: unknown, max: number) => String(value ?? "").slice(0, max);
    const answers = Object.fromEntries(Object.entries(data.payload?.answers || {}).map(([number, entry]: [string, any]) => [number, {
      text: entry?.text || "", visual: entry?.visual || null,
      ...(entry?.brief ? { brief: clean(entry.brief, 400) } : {}),
      ...(Array.isArray(entry?.steps) && entry.steps.length ? { steps: entry.steps.slice(0, 8).map((step: unknown) => clean(step, 300)) } : {}),
      ...(Array.isArray(entry?.work) && entry.work.length ? { work: entry.work.slice(0, 8).map((line: unknown) => clean(line, 160)) } : {}),
      ...(entry?.answerVisual && typeof entry.answerVisual === "object" && JSON.stringify(entry.answerVisual).length <= 2000 ? { answerVisual: entry.answerVisual } : {}),
    }]));
    return json(req, { bookId, answers, updatedAt: data.updated_at });
  } catch {
    return json(req, { error: "request_invalid" }, 400);
  }
});
