// Safe local default. The release runner changes only its private deployment
// artifact after the package is uploaded and verified. Environment false wins.
export const RELEASE_CONFIG = Object.freeze({ ready: false });
