(function (root) {
  "use strict";

  const PINNED_SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/+esm";
  const memory = new Map();
  let clientPromise = null;

  function config() {
    return root.GFIELD_HF_SUPABASE_CONFIG || {};
  }

  function enabled() {
    return config().enabled === true;
  }

  function storageAdapter() {
    try {
      const probe = "__gfield_hf_session_probe__";
      root.sessionStorage.setItem(probe, "1");
      root.sessionStorage.removeItem(probe);
      return root.sessionStorage;
    } catch (_) {
      return {
        getItem: key => memory.has(key) ? memory.get(key) : null,
        setItem: (key, value) => memory.set(key, String(value)),
        removeItem: key => memory.delete(key)
      };
    }
  }

  function assertPublicConfig(value) {
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(value.projectUrl || ""))) {
      throw new Error("Hyper Focus Supabase projectUrl이 올바르지 않습니다.");
    }
    const key = String(value.publishableKey || "");
    if (!key.startsWith("sb_publishable_") && !key.startsWith("eyJ")) {
      throw new Error("브라우저에는 Supabase publishable key만 설정해야 합니다.");
    }
  }

  async function ready() {
    if (!enabled()) return null;
    if (clientPromise) return clientPromise;
    clientPromise = (async () => {
      const value = config();
      assertPublicConfig(value);
      const sdk = await import(value.sdkUrl || PINNED_SDK_URL);
      if (typeof sdk.createClient !== "function") throw new Error("Supabase SDK를 불러오지 못했습니다.");
      return sdk.createClient(value.projectUrl, value.publishableKey, {
        auth: {
          storage: storageAdapter(),
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
    })().catch(error => {
      clientPromise = null;
      throw error;
    });
    return clientPromise;
  }

  async function signedAssetUrl(assetType, assetId) {
    if (!enabled()) throw new Error("Supabase가 아직 활성화되지 않았습니다.");
    if (!["vip", "mock"].includes(assetType)) throw new Error("지원하지 않는 자료 유형입니다.");
    const client = await ready();
    const { data, error } = await client.functions.invoke("signed-asset-url", {
      body: { assetType, assetId }
    });
    if (error || !data?.url) throw new Error("자료 이용 권한을 확인하지 못했습니다.");
    return data.url;
  }

  root.GFieldHFSupabase = Object.freeze({
    sdkVersion: "2.112.3",
    enabled,
    ready,
    signedAssetUrl,
    config
  });
})(window);
