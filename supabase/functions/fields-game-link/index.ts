import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { createFieldsGameLinkHandler, secretKey } from "./handler.js";

// Custom Fields session authentication for issue; signed game-only access for
// anonymous resolve. Deploy with verify_jwt=false, never a frontend service key.
Deno.serve(createFieldsGameLinkHandler({
  getSecret: () => secretKey((name: string) => Deno.env.get(name)),
  getService: (key: string) => {
    const url = Deno.env.get("SUPABASE_URL") || "";
    if (!url) throw new Error("server_not_ready");
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  },
}));
