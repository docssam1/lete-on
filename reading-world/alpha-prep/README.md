# Alpha Prep Interview Studio

Source-faithful interview practice is not the goal of this module. The passages are original prediction material written for learners moving from CARS D toward Bricks Reading 300 Part 1. No licensed textbook page or scan is shipped here.

The coaching profile is calibrated for verbally advanced seven-year-olds reading in the SR 3.x range, especially the upper 3s. Questions keep grade-3-level reasoning while using short, concrete spoken directions.

## Session model

- Four-candidate entrance and seating scene with an original, AI-generated Korean male director portrait
- Ten full mock sets with 20 original one-page prediction passages
- Two consecutive interview rounds in a full mock: nonfiction first, then fiction or fable
- A separate 60-second silent read and automatic passage collection for each round
- Questions for the first passage are completed before the second passage is handed out
- Summary, evidence, inference, opinion, and vocabulary-in-context questions
- Two-step answer-dependent follow-up ladders; economy mode continues the second step locally
- Typed and spoken answers advance immediately with a text-only language note that preserves the learner's meaning; remote coaching enriches that same note in the background and never blocks the interview
- One peer answer followed by an unannounced question that repeats the peer's exact claim before asking the learner to evaluate and extend it
- Tap-to-record answers transcribed by `gpt-transcribe`, with passage vocabulary and question context supplied as recognition hints
- Browser speech recognition as a temporary backup when the protected GPT transcription service is not configured, plus typed fallback
- Browser speech synthesis for the director and peers
- Seven-skill report, answer corrections, vocabulary review, and seven-day route
- Pre-session print preview with one passage per A4 page, plus a separate printable coaching report

## Cost boundary

Economy mode makes at most one adaptive text request per passage and one final-report request. A two-passage mock therefore uses three text requests. The first answer receives an adaptive follow-up and the next answer receives a locally selected second follow-up, so the question ladder continues without another paid request. Answer-by-answer corrections are created and shown as text during the interview, while the final request concentrates on the synthesis, three priorities, and seven-day route. Language corrections are never synthesized as audio, and they do not add API calls. The app does not request generated audio. Deep mode allows two adaptive requests per passage. Normalized turn feedback is cached locally, and deterministic coaching completes the session when the server is unavailable.

The browser allows up to 28 seconds for a live coaching response, matching the server's 30-second boundary closely enough for normal mobile latency. Submitting advances immediately with deterministic local coaching; a successful remote response enriches the saved turn in the background.

The browser sends no learner name or audio file to the coach function. It sends the current original passage, question, short transcript, recent turns, and provisional scores. Full session transcripts remain in local storage on the current device.

The separate transcription function receives one bounded answer recording, its duration, passage title, question, and vocabulary hints. It forwards the audio to OpenAI and returns only the raw transcript. It does not store or log audio, learner names, or transcript text. The prompt explicitly preserves age-appropriate grammar mistakes, repetitions, unfinished phrases, and spoken numbers instead of correcting the child during recognition.

The browser sends the opaque Supabase publishable key in the `apikey` header only. Deploy `alpha-prep-coach` with platform JWT verification disabled; the function validates that header against `SUPABASE_PUBLISHABLE_KEYS` before processing a request. Do not send an `sb_publishable_` key as a bearer JWT.

## Server setup

The coaching Edge Function is in `supabase/functions/alpha-prep-coach`. It forwards validated, text-only coaching requests to the existing Algebra 2 Vertex Gemini proxy and validates the structured response before returning it to the browser. `ALPHA_PREP_COACH_URL` can override the default proxy endpoint for an intentional server migration.

The speech Edge Function is in `supabase/functions/alpha-prep-transcribe`. Set `OPENAI_API_KEY` as a Supabase Edge Function secret, then deploy the function with platform JWT verification disabled. The function still checks the opaque publishable key, allowed origin, upload type, 8 MB size limit, 95-second duration limit, request rate, and provider timeout. Never put the OpenAI key in the browser or repository. The app checks function readiness at startup and automatically keeps the existing browser recognizer as a backup until the secret is present.

Both functions enforce origin, publishable-key, payload-size, field-length, and best-effort per-instance rate limits. A centralized production rate limit should be added if anonymous public traffic becomes substantial.

## Verification

```powershell
node scripts/test-alpha-prep-content.cjs
node scripts/test-alpha-prep-core.mjs
node scripts/test-alpha-prep-transcribe-core.mjs
deno check --config supabase/functions/alpha-prep-coach/deno.json supabase/functions/alpha-prep-coach/index.ts
deno check --config supabase/functions/alpha-prep-transcribe/deno.json supabase/functions/alpha-prep-transcribe/index.ts
```

The browser test requires Playwright. In Codex, point `NODE_PATH` to the bundled runtime packages before running `scripts/test-alpha-prep-browser.cjs`.
