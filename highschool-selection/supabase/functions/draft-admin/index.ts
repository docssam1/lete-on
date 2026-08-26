import { createClient } from "@supabase/supabase-js";

const MODES = ["SH", "DP", "WM", "ED", "DG", "SM"] as const;
const CANDIDATE_COLUMNS = "item_id,mode,family_id,type_id,grade,major,minor,detail,response_type,classification_verified,answer_verified,rights_verified,release_eligible,lineage_relation,difficulty_band,core_condition_verified,solution_structure_verified";

function allowedOrigins(): Set<string> {
  try {
    const parsed = JSON.parse(Deno.env.get("HIGHSELECT_ALLOWED_ORIGINS") || "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : []);
  } catch (_) { return new Set(); }
}
function headers(request: Request): Headers {
  const result = new Headers({ "access-control-allow-headers": "authorization, apikey, content-type, x-client-info", "access-control-allow-methods": "GET, OPTIONS", "cache-control": "no-store", "content-type": "application/json; charset=utf-8", "vary": "Origin", "x-content-type-options": "nosniff" });
  const origin = request.headers.get("origin") || "";
  if (allowedOrigins().has(origin)) result.set("access-control-allow-origin", origin);
  return result;
}
function json(request: Request, status: number, payload: Record<string, unknown>): Response { return new Response(JSON.stringify(payload), { status, headers: headers(request) }); }
function secretKey(): string { return Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""; }
function bearer(request: Request): string { const value = request.headers.get("authorization") || ""; return value.startsWith("Bearer ") ? value.slice(7) : ""; }
function isAllowedOrigin(request: Request): boolean { const origin = request.headers.get("origin"); return !origin || allowedOrigins().has(origin); }

async function requireActiveAdmin(request: Request) {
  const token = bearer(request), url = Deno.env.get("SUPABASE_URL") || "", publicKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "", serviceKey = secretKey();
  if (!token || !url || !publicKey || !serviceKey) throw new Error("authentication_required");
  const userClient = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const service = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data.user || data.user.is_anonymous || data.user.app_metadata?.gfield_role !== "admin") throw new Error("admin_required");
  const { data: staff, error: staffError } = await service.from("hs_staff_accounts").select("status").eq("auth_user_id", data.user.id).maybeSingle();
  if (staffError || staff?.status !== "active") throw new Error("admin_required");
  return { service };
}

function candidate(row: Record<string, unknown>) {
  return { itemId: row.item_id, mode: row.mode, familyId: row.family_id, typeId: row.type_id, curriculum: { grade: row.grade, major: row.major, minor: row.minor, detail: row.detail }, responseType: row.response_type, classificationVerified: row.classification_verified, answerVerified: row.answer_verified, rightsVerified: row.rights_verified, releaseEligible: row.release_eligible, lineageRelation: row.lineage_relation, difficultyBand: row.difficulty_band, coreConditionVerified: row.core_condition_verified, solutionStructureVerified: row.solution_structure_verified };
}

Deno.serve(async request => {
  if (request.method === "OPTIONS") return isAllowedOrigin(request) ? new Response("ok", { headers: headers(request) }) : json(request, 403, { error: "origin_not_allowed" });
  if (request.method !== "GET" || !isAllowedOrigin(request)) return json(request, 403, { error: "request_not_allowed" });
  try {
    const { service } = await requireActiveAdmin(request);
    const url = new URL(request.url), action = url.searchParams.get("action") || "";
    if (action === "readiness") {
      const { data, error } = await service.from("hs_exam_draft_candidates").select("mode");
      if (error || !Array.isArray(data)) throw new Error("readiness_unavailable");
      const candidateCounts = Object.fromEntries(MODES.map(mode => [mode, 0]));
      data.forEach(row => { if (MODES.includes(row.mode as typeof MODES[number])) candidateCounts[row.mode as typeof MODES[number]] += 1; });
      return json(request, 200, { candidateCounts, draftStore: "persistent" });
    }
    if (action === "candidates") {
      const mode = String(url.searchParams.get("mode") || "").toUpperCase();
      if (!MODES.includes(mode as typeof MODES[number])) return json(request, 400, { error: "mode_invalid" });
      const { data, error } = await service.from("hs_exam_draft_candidates").select(CANDIDATE_COLUMNS).eq("mode", mode).eq("classification_verified", true).eq("answer_verified", true).eq("rights_verified", true).eq("release_eligible", true).order("item_id", { ascending: true });
      if (error || !Array.isArray(data)) throw new Error("candidates_unavailable");
      return json(request, 200, { candidates: data.map(row => candidate(row as Record<string, unknown>)) });
    }
    return json(request, 404, { error: "action_not_found" });
  } catch (error) {
    const code = error instanceof Error ? error.message : "server_not_ready";
    return json(request, code === "authentication_required" ? 401 : code === "admin_required" ? 403 : 503, { error: ["authentication_required", "admin_required"].includes(code) ? code : "server_not_ready" });
  }
});
