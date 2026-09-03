import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import {
  buildInstructions,
  extractOutputText,
  parseModelResult,
  schemaFor,
  validatePayload,
} from "./core.mjs";

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8150",
  "http://127.0.0.1:8150",
]);
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 30;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function withinRateLimit(req: Request): boolean {
  const now = Date.now();
  const forwarded = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const client = forwarded.split(",")[0].trim().slice(0, 80) || "unknown";
  const current = rateBuckets.get(client);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(client, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    current.count += 1;
    if (current.count > RATE_LIMIT) return false;
  }
  if (rateBuckets.size > 512) {
    for (const [key, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(key);
      if (rateBuckets.size <= 384) break;
    }
  }
  return true;
}

function allowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") || "";
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function hasValidPublishableKey(req: Request): boolean {
  const supplied = req.headers.get("apikey") || "";
  if (!supplied) return false;
  try {
    const configured = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}");
    return Object.values(configured).some((key) => key === supplied);
  } catch (_) {
    return false;
  }
}

function headersFor(req: Request): Headers {
  const headers = new Headers({
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "600",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Pragma": "no-cache",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: headersFor(req) });
}

Deno.serve(async (req: Request) => {
  if (!allowedOrigin(req)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headersFor(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);
  if (!hasValidPublishableKey(req)) return json(req, { error: "unauthorized" }, 401);
  if (!withinRateLimit(req)) return json(req, { error: "rate_limited" }, 429);
  const declaredLength = Number(req.headers.get("content-length") || 0);
  if (declaredLength > 30_000) return json(req, { error: "body_too_large" }, 413);

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY") || "";
    if (!apiKey) return json(req, { error: "coach_not_configured" }, 503);
    const payload = validatePayload(await req.json());
    const mode = payload.mode;
    const schema = schemaFor(mode);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 24_000);
    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: Deno.env.get("ALPHA_PREP_MODEL") || "gpt-5.6-luna",
          instructions: buildInstructions(mode),
          input: JSON.stringify(payload),
          store: false,
          max_output_tokens: mode === "report" ? 2600 : 750,
          reasoning: { effort: mode === "report" ? "medium" : "low" },
          text: {
            format: {
              type: "json_schema",
              name: mode === "report" ? "alpha_prep_report" : "alpha_prep_turn",
              strict: true,
              schema,
            },
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const status = response.status >= 500 ? 503 : 502;
      return json(req, { error: "coach_unavailable" }, status);
    }
    const modelResponse = await response.json();
    return json(req, parseModelResult(mode, extractOutputText(modelResponse)));
  } catch (error) {
    const code = error instanceof Error ? error.message : "coach_unavailable";
    const clientErrors = new Set([
      "body_invalid", "mode_invalid", "passage_invalid", "turn_invalid", "turns_invalid",
    ]);
    return json(req, { error: clientErrors.has(code) ? code : "coach_unavailable" }, clientErrors.has(code) ? 400 : 503);
  }
});
