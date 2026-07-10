#!/usr/bin/env node
/**
 * One-off: generate a few candidate narrator voices for the Library storybook
 * reader (currently plain en-US-Neural2-F, same flat settings as the CARS
 * test passages) so we can pick something that sounds more like a read-aloud
 * novel and less like an exam prompt. Reuses the existing GOOGLE_TTS_KEY.
 *
 * The sample text is the real book page — pulled at runtime from Supabase
 * (same anon key already used by generate-audio.js, safe to keep in git per
 * project convention), never hardcoded here, so no licensed passage text
 * ever lands in this file/the git history.
 *
 * Usage:
 *   GOOGLE_TTS_KEY=AIza... node scripts/generate-library-voice-samples.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
if (!GOOGLE_TTS_KEY) {
  console.error('❌  Set GOOGLE_TTS_KEY environment variable first.');
  process.exit(1);
}

const SUPABASE_URL = 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
const BOOK_ID = 'library-mth1';
const PAGE_INDEX = 3; // real page with a mix of narration + dialogue

const OUT_DIR = path.join(__dirname, '../library-voice-samples');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function fetchPageText() {
  const res = await httpRequest({
    hostname: new URL(SUPABASE_URL).hostname,
    path: `/rest/v1/library_books?book_id=eq.${BOOK_ID}&select=pages`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'apikey': SUPABASE_KEY },
  });
  if (res.status !== 200) throw new Error(`Could not fetch library book: ${res.body.toString().slice(0, 200)}`);
  const rows = JSON.parse(res.body.toString());
  const page = (rows[0] || {}).pages[PAGE_INDEX];
  return (page.paragraphs || []).join(' ');
}

function toSsml(plainText) {
  // Break on sentence-ish boundaries and insert pauses for narrator pacing.
  const withBreaks = plainText.replace(/([.!?]["”]?)\s+/g, '$1<break time="380ms"/> ');
  return `<speak>${withBreaks}</speak>`;
}

async function synth(voiceName, outFile, text, { ssml, speakingRate, pitch } = {}) {
  const audioConfig = { audioEncoding: 'MP3' };
  if (speakingRate !== undefined) audioConfig.speakingRate = speakingRate;
  if (pitch !== undefined) audioConfig.pitch = pitch;
  const payload = JSON.stringify({
    input: ssml ? { ssml: toSsml(text) } : { text },
    voice: { languageCode: 'en-US', name: voiceName },
    audioConfig,
  });
  const res = await httpRequest({
    hostname: 'texttospeech.googleapis.com',
    path: `/v1/text:synthesize?key=${encodeURIComponent(GOOGLE_TTS_KEY)}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, payload);
  if (res.status !== 200) throw new Error(`Google TTS ${res.status} (${voiceName}): ${res.body.toString().slice(0, 300)}`);
  const json = JSON.parse(res.body.toString());
  const buf = Buffer.from(json.audioContent, 'base64');
  fs.writeFileSync(path.join(OUT_DIR, outFile), buf);
  console.log(`✓ ${outFile} (${(buf.length / 1024).toFixed(1)} KB)`);
}

(async () => {
  const text = await fetchPageText();
  console.log(`Sample text (${text.length} chars) pulled from Supabase — not written to git.`);

  // A — current production voice/settings, unchanged, for comparison.
  await synth('en-US-Neural2-F', 'sample_A_current.mp3', text, { speakingRate: 0.95 });

  // B — same voice, but with narrator pacing (SSML pauses, slower, slightly
  // lower pitch) — cheapest upgrade, no tier change.
  await synth('en-US-Neural2-F', 'sample_B_neural2_paced.mp3', text, { ssml: true, speakingRate: 0.92, pitch: -1.5 });

  // C — Google's Studio voice, purpose-built for long-form narration/audiobooks.
  try {
    await synth('en-US-Studio-O', 'sample_C_studio.mp3', text, {});
  } catch (e) {
    console.warn(`⚠  Studio-O with no audioConfig overrides failed: ${e.message}`);
  }

  // D — newest Chirp3-HD voice, most natural/expressive prosody available.
  try {
    await synth('en-US-Chirp3-HD-Leda', 'sample_D_chirp3hd.mp3', text, {});
  } catch (e) {
    console.warn(`⚠  Chirp3-HD-Leda failed: ${e.message}`);
  }
})().catch(e => { console.error('❌', e.message); process.exit(1); });
