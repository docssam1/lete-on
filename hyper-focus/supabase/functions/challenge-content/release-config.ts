// Safe public default. Production delivery is enabled only after a private
// package and its pinned manifest hash have been verified in Supabase.
export const RELEASE_CONFIG = Object.freeze({
  ready: false,
  manifestSha256: "",
  releasePrefix: "",
});
