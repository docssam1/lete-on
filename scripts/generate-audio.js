#!/usr/bin/env node
/**
 * Google Cloud TTS Neural2 audio generation script for Gfield Reading Town
 *
 * Usage:
 *   set GOOGLE_TTS_KEY=AIza... && node scripts/generate-audio.js   (Windows)
 *   GOOGLE_TTS_KEY=AIza... node scripts/generate-audio.js          (Mac/Linux)
 *
 * Generates MP3 files for all Level C extraLearning + newPassage passages,
 * uploads them to Supabase Storage, and prints the URLs.
 *
 * Free tier: 1,000,000 chars/month for Neural2 voices — more than enough.
 * Character estimate: ~16,000 chars (Level C) + ~14,000 chars (Level B extras)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────
const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
const VOICE_NAME = 'en-US-Neural2-F';   // Natural female Neural2 voice
const SUPABASE_URL = 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
const OUT_DIR = path.join(__dirname, '../audio-generated');

if (!GOOGLE_TTS_KEY) {
  console.error('❌  Set GOOGLE_TTS_KEY environment variable first.');
  console.error('    Windows: set GOOGLE_TTS_KEY=AIza... && node scripts/generate-audio.js');
  process.exit(1);
}

// ── Load lesson data ───────────────────────────────────────────────────────────
const window = { LESSONS: {} };
const LESSON1 = {};
const dataDir = path.join(__dirname, '../reading-world/data');

// Level C (lc1~lc10)
for (let i = 1; i <= 10; i++) {
  const file = path.join(dataDir, `lc${i}.js`);
  if (fs.existsSync(file)) {
    try { eval(fs.readFileSync(file, 'utf8')); } catch(e) { console.warn(`⚠  lc${i}.js eval error:`, e.message); }
  }
}

// Level B (lesson2~lesson10) — extraLearning / newPassage only
for (let i = 2; i <= 10; i++) {
  const file = path.join(dataDir, `lesson${i}.js`);
  if (fs.existsSync(file)) {
    try { eval(fs.readFileSync(file, 'utf8')); } catch(e) { console.warn(`⚠  lesson${i}.js eval error:`, e.message); }
  }
}

// ── Build task list ────────────────────────────────────────────────────────────
const tasks = [];

for (const [lessonId, lesson] of Object.entries(window.LESSONS)) {
  const bookId = lesson.bookId || 'cars-level-b';

  if (lesson.extraLearning?.passage?.length) {
    tasks.push({
      lessonId, bookId,
      type: 'extra',
      text: lesson.extraLearning.passage.join('\n\n'),
      storagePath: `${bookId}/${lessonId}-extra.mp3`,
    });
  }

  if (lesson.newPassage?.passage?.length) {
    tasks.push({
      lessonId, bookId,
      type: 'new',
      text: lesson.newPassage.passage.join('\n\n'),
      storagePath: `${bookId}/${lessonId}-new.mp3`,
    });
  }
}

const totalChars = tasks.reduce((s, t) => s + t.text.length, 0);
console.log(`📋  ${tasks.length} passages | ~${totalChars.toLocaleString()} characters`);
console.log(`🎙  Voice: ${VOICE_NAME} (Google Neural2)`);
console.log('');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Helpers ────────────────────────────────────────────────────────────────────
function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function generateMp3(text) {
  const payload = JSON.stringify({
    input: { text },
    voice: { languageCode: 'en-US', name: VOICE_NAME },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
  });
  const res = await httpRequest({
    hostname: 'texttospeech.googleapis.com',
    path: `/v1/text:synthesize?key=${encodeURIComponent(GOOGLE_TTS_KEY)}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, payload);
  if (res.status !== 200) throw new Error(`Google TTS ${res.status}: ${res.body.toString().slice(0, 300)}`);
  const json = JSON.parse(res.body.toString());
  return Buffer.from(json.audioContent, 'base64');
}

async function uploadToSupabase(mp3Buffer, storagePath) {
  const res = await httpRequest({
    hostname: new URL(SUPABASE_URL).hostname,
    path: `/storage/v1/object/audio/${storagePath}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
  }, mp3Buffer);
  if (res.status !== 200 && res.status !== 201) throw new Error(`Supabase upload ${res.status}: ${res.body.toString().slice(0, 200)}`);
  return `${SUPABASE_URL}/storage/v1/object/public/audio/${storagePath}`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  let done = 0, failed = 0, totalUsed = 0;
  const results = {};

  for (const task of tasks) {
    const label = `${task.lessonId}-${task.type}`;
    process.stdout.write(`  🎙  ${label} (${task.text.length} chars)... `);

    try {
      // Check if already uploaded
      const checkRes = await httpRequest({
        hostname: new URL(SUPABASE_URL).hostname,
        path: `/storage/v1/object/info/public/audio/${task.storagePath}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${SUPABASE_KEY}` },
      });
      if (checkRes.status === 200) {
        const url = `${SUPABASE_URL}/storage/v1/object/public/audio/${task.storagePath}`;
        console.log(`skip (already exists)`);
        results[label] = url;
        continue;
      }

      const mp3 = await generateMp3(task.text);

      // Save locally as backup
      const localPath = path.join(OUT_DIR, task.storagePath.replace('/', '-'));
      fs.writeFileSync(localPath, mp3);

      const url = await uploadToSupabase(mp3, task.storagePath);
      results[label] = url;
      totalUsed += task.text.length;
      done++;
      console.log(`✓  (${mp3.length.toLocaleString()} bytes)`);
    } catch (e) {
      failed++;
      console.log(`✗  ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log('');
  console.log(`✅  Done: ${done} generated, ${failed} failed`);
  console.log(`📊  Characters used this run: ~${totalUsed.toLocaleString()}`);
  console.log('');
  console.log('Generated URLs:');
  for (const [k, v] of Object.entries(results)) console.log(`  ${k}: ${v}`);

  fs.writeFileSync(path.join(OUT_DIR, 'urls.json'), JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${path.join(OUT_DIR, 'urls.json')}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
