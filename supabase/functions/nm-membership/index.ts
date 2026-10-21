// Numbers of Magic — nm-membership edge function (membership / admin / manual worksheet SMS)
// POST /functions/v1/nm-membership  { action, ... }   — deploy with verify_jwt=false (this function authenticates itself:
// Supabase JWT via auth.getUser for `status`, opaque admin session for admin_*, unguessable share token for resolve_worksheet).
// The service-role key is used only here on the server; nothing secret is ever returned. SQL: ./schema.sql
import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { createHandler } from "./handler.mjs";
import courseLimits from "./course-limits.json" with { type: "json" };

const SB_URL = Deno.env.get("SUPABASE_URL") || "";
const SB_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

let handler: ((req: Request) => Promise<Response>) | null = null;

function build() {
  const sb = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
  return createHandler({
    courseLimits,
    rpc: (action: string, payload: unknown, actor: string | null, ipHash: string) =>
      sb.rpc("nm_membership_rpc", { p_action: action, p_payload: payload, p_actor: actor, p_ip_hash: ipHash }),
    // Verifies the actual bearer token with the Auth server; user_metadata is never read.
    getUser: async (jwt: string) => {
      const { data, error } = await sb.auth.getUser(jwt);
      if (error || !data?.user?.id) return null;
      const u: any = data.user;
      return { id: String(u.id), emailVerified: !!u.email && !!u.email_confirmed_at };
    },
    // Same lookup order as weekly-notify: Edge secret first, then Vault (service-only nm_notify_secret RPC).
    notifySecret: async () => {
      const env = (Deno.env.get("NOTIFY_TRIGGER_KEY") ?? "").trim();
      if (env) return env;
      const { data } = await sb.rpc("nm_notify_secret", { p_name: "NOTIFY_TRIGGER_KEY" });
      return String(data ?? "").trim();
    },
    // Calls the existing weekly-notify with the manual_payload branch. Ambiguous upstream result => ok:null (never retried).
    callWeeklyNotify: async (triggerKey: string, manual: unknown) => {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 25000);
      try {
        const r = await fetch(`${SB_URL}/functions/v1/weekly-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}` },
          body: JSON.stringify({ trigger_key: triggerKey, manual_payload: manual }),
          signal: ctl.signal,
        });
        const j: any = await r.json().catch(() => null);
        if (!j || typeof j !== "object") return { ok: null, status: "failed" };
        if (typeof j.error === "string" && [400, 403, 409, 503].includes(r.status)) return { ok: false, status: "failed" }; // rejected before any send
        return { ok: j.ok, status: j.status };
      } finally { clearTimeout(timer); }
    },
  });
}

Deno.serve((req: Request) => {
  if (!SB_URL || !SB_SERVICE) {
    return Promise.resolve(new Response(JSON.stringify({ error: "server_not_ready" }), {
      status: 503, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    }));
  }
  handler ??= build();
  return handler(req);
});
