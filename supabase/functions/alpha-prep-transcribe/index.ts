import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import {
  appendTranscriptionFields,
  extensionForAudioType,
  extractTranscript,
  MAX_AUDIO_BYTES,
  parseContext,
  validateAudioMetadata,
} from "./core.mjs";

const OPENAI_TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/transcriptions";
const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8150",
  "http://127.0.0.1:8150",
]);
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 40;
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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
  if (!hasValidPublishableKey(req)) return json(req, { error: "unauthorized" }, 401);

  const openAIKey = Deno.env.get("OPENAI_API_KEY") || "";
  if (req.method === "GET") return json(req, { available: Boolean(openAIKey), model: "gpt-transcribe" });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);
  if (!openAIKey) return json(req, { error: "transcriber_not_configured" }, 503);
  if (!withinRateLimit(req)) return json(req, { error: "rate_limited" }, 429);

  const declaredLength = Number(req.headers.get("content-length") || 0);
  if (declaredLength > MAX_AUDIO_BYTES + 40_000) return json(req, { error: "body_too_large" }, 413);
  if (!String(req.headers.get("content-type") || "").toLowerCase().startsWith("multipart/form-data")) {
    return json(req, { error: "content_type_invalid" }, 415);
  }

  try {
    const incoming = await req.formData();
    const audio = incoming.get("audio");
    if (!(audio instanceof File)) throw new Error("audio_invalid");
    const metadata = validateAudioMetadata(audio, incoming.get("durationMs"));
    const context = parseContext(incoming.get("context"));

    const outgoing = new FormData();
    const fileName = `alpha-prep-answer.${extensionForAudioType(metadata.type)}`;
    outgoing.append("file", audio, fileName);
    appendTranscriptionFields(outgoing, context);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    let response: Response;
    try {
      response = await fetch(OPENAI_TRANSCRIPTION_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${openAIKey}` },
        body: outgoing,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      console.error("alpha-prep transcription provider failure", JSON.stringify({ status: response.status }));
      const status = response.status === 429 ? 429 : response.status >= 500 ? 503 : 502;
      return json(req, { error: status === 429 ? "rate_limited" : "transcription_unavailable" }, status);
    }

    const payload = await response.json();
    return json(req, { text: extractTranscript(payload), model: "gpt-transcribe" });
  } catch (error) {
    const code = error instanceof Error ? error.message : "transcription_unavailable";
    const clientErrors = new Set([
      "audio_invalid",
      "audio_type_invalid",
      "audio_size_invalid",
      "audio_duration_invalid",
      "context_invalid",
    ]);
    if (!clientErrors.has(code)) {
      const name = error instanceof Error ? error.name : "unknown";
      console.error("alpha-prep transcription request failure", JSON.stringify({ name }));
    }
    return json(req, { error: clientErrors.has(code) ? code : "transcription_unavailable" }, clientErrors.has(code) ? 400 : 503);
  }
});
