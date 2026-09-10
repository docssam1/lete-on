// Safe local default. The release runner supplies a reviewed manifest pin to the
// deployment artifact only after private upload and public-path checks pass.
// No credentials belong in this file. Environment false overrides a ready build.
export const RELEASE_CONFIG = Object.freeze({ ready: false, manifestSha256: "" });
