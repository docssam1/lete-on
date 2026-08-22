(function (root) {
  "use strict";
  const supplied = root.HIGHSELECT_RUNTIME || {};
  const location = root.location || {};
  const webOrigin = /^https?:$/.test(String(location.protocol || "")) ? String(location.origin || "") : "";
  const sameOriginHost = String(location.hostname || "").trim().toLowerCase();
  root.HIGHSELECT_RUNTIME = {
    apiBase: String(supplied.apiBase || webOrigin),
    assetMode: "signed-page-images",
    assetHosts: Array.isArray(supplied.assetHosts) && supplied.assetHosts.length
      ? supplied.assetHosts.slice()
      : (sameOriginHost ? [sameOriginHost] : []),
    maxPageUrlTtlSeconds: Math.min(900, Math.max(60, Number(supplied.maxPageUrlTtlSeconds || 900)))
  };
})(typeof window !== "undefined" ? window : globalThis);
