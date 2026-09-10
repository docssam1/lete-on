// Sealed source default. The short-lived operator upload replaces this file only
// inside a local deployment payload, then restores it immediately after upload.
export const RELEASE = { issuedAt: 0, expiresAt: 0, tokenSha256: "", files: {} };
