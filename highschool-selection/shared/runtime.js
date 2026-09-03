(function (root) {
  "use strict";
  const supplied = root.HIGHSELECT_RUNTIME || {};
  const location = root.location || {};
  const webOrigin = /^https?:$/.test(String(location.protocol || "")) ? String(location.origin || "") : "";
  const sameOriginHost = String(location.hostname || "").trim().toLowerCase();
  const staticHosts = new Set(["lete-on.gfieldacademy.net", "docssam1.github.io"]);
  const staticHosted = staticHosts.has(sameOriginHost) || sameOriginHost.endsWith(".github.io");
  const supabaseUrl = String(supplied.supabaseUrl || "https://fgahqumaldheqettmvqg.supabase.co").replace(/\/$/, "");
  root.HIGHSELECT_RUNTIME = {
    apiBase: String(supplied.apiBase == null ? (staticHosted ? "" : webOrigin) : supplied.apiBase).replace(/\/$/, ""),
    staticHosted,
    supabaseUrl,
    supabasePublishableKey: String(supplied.supabasePublishableKey || "sb_publishable_OsjJG92BLMaZrc2jTClt0g_ecdTtf_I"),
    adminSessionUrl: String(supplied.adminSessionUrl || `${supabaseUrl}/functions/v1/hs-admin-session`),
    catalogApiUrl: String(supplied.catalogApiUrl || `${supabaseUrl}/functions/v1/highselect-catalog`),
    assetMode: "signed-page-images",
    assetHosts: Array.isArray(supplied.assetHosts) && supplied.assetHosts.length
      ? supplied.assetHosts.slice()
      : (sameOriginHost ? [sameOriginHost] : []),
    maxPageUrlTtlSeconds: Math.min(900, Math.max(60, Number(supplied.maxPageUrlTtlSeconds || 900)))
  };
})(typeof window !== "undefined" ? window : globalThis);
