# Alpha Prep Interview Studio

Source-faithful interview practice is not the goal of this module. The passages are original prediction material written for learners moving from CARS D toward Bricks Reading 300 Part 1. No licensed textbook page or scan is shipped here.

The coaching profile is calibrated for verbally advanced seven-year-olds reading in the SR 3.x range, especially the upper 3s. Questions keep grade-3-level reasoning while using short, concrete spoken directions.

## Session model

- Four-candidate entrance and seating scene
- Ten full mock sets with 20 original one-page prediction passages
- Two consecutive interview rounds in a full mock: nonfiction first, then fiction or fable
- A separate 60-second silent read and automatic passage collection for each round
- Questions for the first passage are completed before the second passage is handed out
- Summary, evidence, inference, opinion, and vocabulary-in-context questions
- Two-step answer-dependent follow-up ladders; economy mode continues the second step locally
- One peer answer followed by an unannounced listen-link-add question
- Browser speech recognition with typed fallback
- Browser speech synthesis for the director and peers
- Seven-skill report, answer corrections, vocabulary review, and seven-day route

## Cost boundary

Economy mode makes at most one adaptive text request per passage and one final-report request. A two-passage mock therefore uses three text requests. The first answer receives an adaptive follow-up and the next answer receives a locally selected second follow-up, so the question ladder continues without another paid request. Answer-by-answer corrections are created during the interview, while the final request concentrates on the synthesis, three priorities, and seven-day route. The app does not request generated audio. Deep mode allows two adaptive requests per passage. Normalized turn feedback is cached locally, and deterministic coaching completes the session when the server is unavailable.

The browser sends no learner name or audio file to the coach function. It sends the current original passage, question, short transcript, recent turns, and provisional scores. Full session transcripts remain in local storage on the current device.

The browser sends the opaque Supabase publishable key in the `apikey` header only. Deploy `alpha-prep-coach` with platform JWT verification disabled; the function validates that header against `SUPABASE_PUBLISHABLE_KEYS` before processing a request. Do not send an `sb_publishable_` key as a bearer JWT.

## Server setup

The Edge Function is in `supabase/functions/alpha-prep-coach`. It forwards validated, text-only coaching requests to the existing Algebra 2 Vertex Gemini proxy and validates the structured response before returning it to the browser. No model credential is shipped to the browser or stored in this repository. `ALPHA_PREP_COACH_URL` can override the default proxy endpoint for an intentional server migration. The function enforces origin, publishable-key, payload-size, field-length, output-schema, and best-effort per-instance rate limits. A centralized production rate limit should be added if anonymous public traffic becomes substantial.

## Verification

```powershell
node scripts/test-alpha-prep-content.cjs
node scripts/test-alpha-prep-core.mjs
deno check supabase/functions/alpha-prep-coach/index.ts
```

The browser test requires Playwright. In Codex, point `NODE_PATH` to the bundled runtime packages before running `scripts/test-alpha-prep-browser.cjs`.
