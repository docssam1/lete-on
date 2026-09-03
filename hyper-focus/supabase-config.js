(function (root) {
  "use strict";

  // This file is safe to publish. Never place a secret/service-role key here.
  // The verified Hyper Focus project serves authenticated students and private assets.
  root.GFIELD_HF_SUPABASE_CONFIG = Object.freeze({
    enabled: true,
    projectUrl: "https://uqtkxhchtbcizzteuvsq.supabase.co",
    publishableKey: "sb_publishable_eYf7Q48ml5LZcBmtJ1X--w_Nbe4l47i",
    adminEmail: "docssam1@gmail.com",
    sdkUrl: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/+esm",
    features: Object.freeze({
      secureMockDelivery: true,
      // Keep paid 3+ practice questions closed until a server-side problem
      // source and delivery endpoint are deployed. The free two remain live.
      securePracticeDelivery: false
    })
  });
})(window);
