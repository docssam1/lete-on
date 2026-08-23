(function (root) {
  "use strict";

  // This file is safe to publish. Never place a secret/service-role key here.
  // Supabase remains disabled until a separate Hyper Focus project is verified.
  root.GFIELD_HF_SUPABASE_CONFIG = Object.freeze({
    enabled: false,
    projectUrl: "",
    publishableKey: "",
    adminEmail: "",
    sdkUrl: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/+esm",
    features: Object.freeze({
      secureMockDelivery: false
    })
  });
})(window);
