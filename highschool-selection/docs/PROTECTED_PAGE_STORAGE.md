# Protected page storage

Exam page images can be served by the existing protected page functions from a
private Storage bucket. The exam API, grant check, and signed GET contract stay
the same. `storage-assets-entry.ts` is the read-only deployment entry; its
`bank-private.json` mapping is generated outside the public checkout.

The server validates the session, active account, per-exam grant, origin,
signature, and ten-minute expiry before reading Storage. Each mapped image must
match its expected byte length and SHA-256. A public or missing bucket, missing
object, or integrity mismatch fails closed. The response contains JPEG bytes
with `private, no-store`; it never redirects to a Storage URL.

No importer, bucket creation, upload, deletion, or key management route belongs
in the final reader deployment. Migration payloads and run-specific test
credentials remain outside Git. Keep verified rollback sources and validate old
signed URLs before switching a published edition's storage.

Regression checks:

```sh
node --test highschool-selection/tests/private-storage-assets.test.mjs
node --test highschool-selection/tests/launch-exams-core.test.mjs highschool-selection/tests/promo-course-navigation.test.cjs
```
