# FC Game-Only Capabilities

POST JSON to `fields-game-link`:

- Issue: `{ "action": "issue", "activities": ["turn-clock"] }`, with an existing valid 64-character lowercase hex `x-fields-session` header. One to seven unique activity IDs. The existing `resolveFieldsSession` checks the hashed session and active student or administrator account. No login, approval codes, bearer impersonation, session creation, or session mutations.
- Resolve: `{ "action": "resolve", "token": "fcg1..." }`, anonymously. Returns only `activityId`, `bookId`, `lessonId`, `expiresAt`. Extra fields, including caller-selected books/activities, are rejected. A game token cannot authenticate issuance.

Issue returns `{ links: [{ activityId, bookId, lessonId, token, expiresAt }] }`. Every link is for `book-01` and is issued with an expiry exactly 365 days (31,536,000 seconds) from now, at second precision. Compact tokens are `fcg1.activityId.expSeconds.signature`, about 70-80 ASCII bytes. The HMAC-SHA256 signature is 43-character unpadded base64url; expiry uses canonical unsigned decimal without leading zeros. The fixed server catalog supplies book/lesson scope. No JSON payload, redundant scope/book/lesson, issuance time, nonce, PII, answer content, or Fields session credential is encoded. Request bodies are capped at 4,096 bytes and tokens at 96 characters. Responses, including errors/preflight, use `private, no-store`.

Resolve rejects expired tokens and expiries beyond current time + 365 days + 60 seconds of clock skew, even if correctly signed. Same activity and expiry produce the same token; links are not individualized print/student identifiers. Activity or expiry changes require a new signature. Caller-selected IDs, even matching the signed activity, are rejected rather than used.

HMAC-SHA256 derives a domain-separated signing key from the server's `SUPABASE_SERVICE_ROLE_KEY`, using the existing `SUPABASE_SECRET_KEYS.default` / `SUPABASE_SECRET_KEY` fallback pattern. Never supply this key from a client. Changing the server secret invalidates existing game links. Links are bearer capabilities; anyone holding a link can open only its game until expiry. There is no per-link revocation or coupling to subsequent logout, account deactivation, or general session expiry.

## Deployment Handoff

Main owns deployment and any root configuration. Gateway JWT verification must be disabled for this function only: Fields' custom hex sessions are not Supabase JWTs, and anonymous resolve instead verifies the signed capability. All authorization stays in the handler. No database migration is needed.

Use `supabase functions deploy fields-game-link --no-verify-jwt`, or add this block to the deployment's `supabase/config.toml`:

```toml
[functions.fields-game-link]
verify_jwt = false
```

Do not alter JWT settings or code for existing auth/answer functions. Supabase JS is pinned to `2.112.4`, already pinned in this repository's `highselect-catalog` and `fields-approval-admin` functions. Official reference: https://supabase.com/docs/guides/functions/function-configuration

Tests from repository root (Node with Web Crypto/Fetch globals):

```text
node --test supabase/functions/_shared/fields-game-capability-audit.mjs supabase/functions/fields-game-link/handler-audit.mjs
```
