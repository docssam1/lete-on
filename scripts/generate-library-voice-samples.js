#!/usr/bin/env node
/**
 * One-off: generate a few candidate narrator voices for the Library storybook
 * reader (currently plain en-US-Neural2-F, same flat settings as the CARS
 * test passages) so we can pick something that sounds more like a read-aloud
 * novel and less like an exam prompt. Reuses the existing GOOGLE_TTS_KEY.
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

// Magic Tree House #1, page 4 (real text) — mixes narration + dialogue so the
// voices can be judged on both.
const PLAIN_TEXT = `Jack crawled through a hole in the tree house floor. Wow. The tree house was filled with books. Books everywhere. Very old books with dusty covers. New books with shiny, bright covers. "Look. You can see far, far away," said Annie. She was peering out the tree house window. "Hi, Henry!" shouted Annie. "Shush!" said Jack. "We're not supposed to be up here."`;

// Same text, but with SSML pauses between sentences and a slightly slower,
// warmer cadence for the "storybook narrator" variant.
const SSML_TEXT = `<speak>
Jack crawled through a hole in the tree house floor.<break time="450ms"/>
Wow.<break time="300ms"/> The tree house was filled with books.<break time="350ms"/>
Books everywhere.<break time="300ms"/> Very old books with dusty covers.<break time="250ms"/> New books with shiny, bright covers.<break time="500ms"/>
"Look. You can see far, far away," said Annie.<break time="300ms"/> She was peering out the tree house window.<break time="500ms"/>
"Hi, Henry!" shouted Annie.<break time="400ms"/>
"Shush!" said Jack. "We're not supposed to be up here."
</speak>`;

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

async function synth(voiceName, outFile, { ssml, speakingRate, pitch } = {}) {
  const audioConfig = { audioEncoding: 'MP3' };
  if (speakingRate !== undefined) audioConfig.speakingRate = speakingRate;
  if (pitch !== undefined) audioConfig.pitch = pitch;
  const payload = JSON.stringify({
    input: ssml ? { ssml: SSML_TEXT } : { text: PLAIN_TEXT },
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
  // A — current production voice/settings, unchanged, for comparison.
  await synth('en-US-Neural2-F', 'sample_A_current.mp3', { speakingRate: 0.95 });

  // B — same voice, but with narrator pacing (SSML pauses, slower, slightly
  // lower pitch) — cheapest upgrade, no tier change.
  await synth('en-US-Neural2-F', 'sample_B_neural2_paced.mp3', { ssml: true, speakingRate: 0.92, pitch: -1.5 });

  // C — Google's Studio voice, purpose-built for long-form narration/audiobooks.
  try {
    await synth('en-US-Studio-O', 'sample_C_studio.mp3', {});
  } catch (e) {
    console.warn(`⚠  Studio-O with no audioConfig overrides failed: ${e.message}`);
  }

  // D — newest Chirp3-HD voice, most natural/expressive prosody available.
  try {
    await synth('en-US-Chirp3-HD-Leda', 'sample_D_chirp3hd.mp3', {});
  } catch (e) {
    console.warn(`⚠  Chirp3-HD-Leda failed: ${e.message}`);
  }
})().catch(e => { console.error('❌', e.message); process.exit(1); });
