# Administrator Routing From Student Login

## Behavior

The initial implementation wrongly opened a student learning page named
DOCSSAM. The corrected student form requests `admin-login`, retains the
server-verified common administrator session and redirects to
`fields-classic/admin.html`. The secure approval list must load without a
second login. The Fields server reuses `hs-admin-session` verification and
rate limiting; credentials are not embedded in client code or stored as a
student account. The browser uses the existing administrator session store.

An older learning-only administrator token never grants a full administrator
session. The corrected student page either reuses an existing common session
or returns to the approval-code form, never to the DOCSSAM student page.
The earlier opaque-session endpoint remains available for learning access;
its temporary common-auth session is still closed without revoking other
devices. Normal student login remains on its existing route.

Existing students keep their original account and permission checks. An
administrator is not registered as a student or used to impersonate one.
Each protected answer request rechecks the session and active account. A
disabled administrator or student, expired session or missing session is
denied. RLS and service-only session access remain enabled.

## Verification and Deployment

- Edge Functions deployed: `fields-auth` version 9, `fields-approval-admin`
  version 3, `golden-bell-answers` version 3. The approval endpoint change only
  adds the explicit local 8796 origins. Authentication remains mandatory.
- Additive migration: `fields_admin_learning_sessions`. A session has exactly
  one identity: its existing student reference or an administrator user ID.
- All 18 existing student account records have the same aggregate fingerprint
  before and after deployment. No student approval values changed.
- `fields-admin-learning-auth-audit.mjs`: 28 mock-backed cases passed,
  including student regression, forged roles, inactive accounts, bad codes,
  rate limits, outages, expiry, logout and rejected origins.
- `deno check`: affected Edge Functions passed.
- The initial student-page browser expectation was retired because it
  verified the wrong destination. `fields-admin-redirect-browser-audit.mjs`
  now verifies the administrator URL and secure approval list at 1440px and
  390px, including reload. It passed locally both with isolated fixtures and
  with real backend authentication. The real run did not mock any request.
- `admin-recovery-browser-audit.mjs`: existing administrator controls and
  ordinary student login/reload passed unchanged with isolated fixtures.
- Revoked and anonymous tokens were rejected by the live answer endpoint.
  Isolated learning test sessions were removed after testing. The two common
  administrator sessions used for the corrected test were locally signed out
  and their exact newly created test-device records were removed.
- Security advisor findings: two before, two after, no new findings.

The browser audit requires explicit opt-in and an environment-supplied
credential. It never writes credentials, tokens or answer payloads to its
report. The corrected test does not save screenshots of private student lists.

The owner approved a login-only frontend release on 2026-09-22. Keep all
unfinished workbook changes outside this release. The routing and local
logout improvement require the matching frontend, not just the deployed
backend. After deployment, repeat `fields-admin-redirect-browser-audit.mjs`
against the production origin with live-test opt-in before claiming that the
production redirect is complete. Release evidence belongs with the pull
request and its GitHub Pages run.
