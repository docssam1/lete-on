# Alpha Prep Interview Studio

Source-faithful interview practice is not the goal of this module. The passages are original prediction material written for learners moving from CARS D toward Bricks Reading 300 Part 1. No licensed textbook page or scan is shipped here.

## Session model

- Four-candidate entrance and seating scene
- Two consecutive interview rounds in a full mock: nonfiction first, then fiction
- A separate 60-second silent read and automatic passage collection for each round
- Questions for the first passage are completed before the second passage is handed out
- Summary, evidence, inference, opinion, and vocabulary-in-context questions
- One peer answer followed by an unannounced listen-link-add question
- Browser speech recognition with typed fallback
- Browser speech synthesis for the director and peers
- Seven-skill report, answer corrections, vocabulary review, and seven-day route

## Cost boundary

Economy mode makes at most one adaptive text request per passage and one final-report request. A two-passage mock therefore uses three text requests. The final request also improves every saved answer, so detailed corrections do not add more calls. The app does not request generated audio. Deep mode allows two adaptive requests per passage. Normalized turn feedback is cached locally, and deterministic coaching completes the session when the server is unavailable.

The browser sends no learner name or audio file to the coach function. It sends the current original passage, question, short transcript, recent turns, and provisional scores. Full session transcripts remain in local storage on the current device.

## Server setup

The Edge Function is in `supabase/functions/alpha-prep-coach`. Configure `OPENAI_API_KEY` as a Supabase secret, then deploy the function through the normal project release process. `ALPHA_PREP_MODEL` is optional and defaults to `gpt-5.6-luna`. The function enforces origin, payload-size, field-length, output-schema, and best-effort per-instance rate limits. A centralized production rate limit should be added if anonymous public traffic becomes substantial.

## Verification

```powershell
node scripts/test-alpha-prep-content.cjs
node scripts/test-alpha-prep-core.mjs
deno check supabase/functions/alpha-prep-coach/index.ts
```

The browser test requires Playwright. In Codex, point `NODE_PATH` to the bundled runtime packages before running `scripts/test-alpha-prep-browser.cjs`.
