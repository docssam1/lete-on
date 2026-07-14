#!/usr/bin/env node
/**
 * Numbers of Magic — static voice TTS generation
 *
 * Extracts all static voice texts from unit data files (practice.intro,
 * lab.intro, voice.finish) for Korean, English, and Chinese, generates
 * Google Neural2 MP3s, uploads to Supabase Storage, and writes
 * number_magic/data/tts-map.js so the app can play them directly.
 *
 * Usage:
 *   GOOGLE_TTS_KEY=AIza... node number_magic/scripts/generate-nm-audio.js
 *
 * Re-running is safe: existing files are overwritten (x-upsert:true).
 */

'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────
const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
const SUPABASE_URL = 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
const OUT_DIR = path.join(__dirname, '../audio-generated');
const TTS_MAP_FILE = path.join(__dirname, '../data/tts-map.js');

// Google Neural2 voices by language
const VOICES = {
  ko: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-C' },
  en: { languageCode: 'en-US', name: 'en-US-Neural2-F' },
  zh: { languageCode: 'cmn-CN', name: 'cmn-CN-Neural2-A' },
};

if (!GOOGLE_TTS_KEY) {
  console.error('❌  Set GOOGLE_TTS_KEY environment variable first.');
  process.exit(1);
}

// ── Load all unit data ─────────────────────────────────────────────────────────
const window = { NM_UNITS: {} };
const unitsDir = path.join(__dirname, '../data/units');
const unitFiles = fs.readdirSync(unitsDir).filter(f => /^A-\d+\.js$/.test(f)).sort();

for (const file of unitFiles) {
  try {
    eval(fs.readFileSync(path.join(unitsDir, file), 'utf8'));
  } catch (e) {
    console.warn(`⚠  ${file} eval error:`, e.message);
  }
}

const units = Object.values(window.NM_UNITS);
console.log(`📦  Loaded ${units.length} units`);

// ── Build task list ────────────────────────────────────────────────────────────
// Each task: { unitId, key, lang, text, storagePath }
const tasks = [];

for (const unit of units) {
  const id = unit.id;

  // practice.intro
  if (unit.practice?.intro) {
    for (const lang of ['ko', 'en', 'zh']) {
      const text = unit.practice.intro[lang];
      if (text) tasks.push({
        unitId: id, key: 'practice-intro', lang,
        text,
        storagePath: `number-magic/${id}-practice-intro-${lang}.mp3`,
      });
    }
  }

  // lab.intro
  if (unit.lab?.intro) {
    for (const lang of ['ko', 'en', 'zh']) {
      const text = unit.lab.intro[lang];
      if (text) tasks.push({
        unitId: id, key: 'lab-intro', lang,
        text,
        storagePath: `number-magic/${id}-lab-intro-${lang}.mp3`,
      });
    }
  }

  // voice.finish
  if (unit.voice?.finish) {
    for (const lang of ['ko', 'en', 'zh']) {
      const text = typeof unit.voice.finish === 'string'
        ? unit.voice.finish
        : unit.voice.finish[lang];
      if (text) tasks.push({
        unitId: id, key: 'finish', lang,
        text,
        storagePath: `number-magic/${id}-finish-${lang}.mp3`,
      });
    }
  }
}

const totalChars = tasks.reduce((s, t) => s + t.text.length, 0);
console.log(`📋  ${tasks.length} tasks (~${totalChars.toLocaleString()} chars total)`);
console.log(`🎙  Voices: ko-KR-Neural2-C / en-US-Neural2-F / cmn-CN-Neural2-A`);
console.log('');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── HTTP + TTS + Storage helpers ──────────────────────────────────────────────
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

async function generateMp3(text, lang) {
  const voice = VOICES[lang];
  const payload = JSON.stringify({
    input: { text },
    voice,
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.92 },
  });
  const res = await httpRequest({
    hostname: 'texttospeech.googleapis.com',
    path: `/v1/text:synthesize?key=${encodeURIComponent(GOOGLE_TTS_KEY)}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, payload);
  if (res.status !== 200) throw new Error(`TTS ${res.status}: ${res.body.toString().slice(0, 200)}`);
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
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Upload ${res.status}: ${res.body.toString().slice(0, 200)}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/audio/${storagePath}`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  let done = 0, failed = 0;
  // map: { lang: { text: url } }
  const map = { ko: {}, en: {}, zh: {} };

  for (const task of tasks) {
    const label = `${task.unitId} ${task.key} [${task.lang}]`;
    process.stdout.write(`  🎙  ${label} (${task.text.length}c)... `);

    try {
      const mp3 = await generateMp3(task.text, task.lang);

      // Save locally
      const localName = task.storagePath.replace('number-magic/', '').replace(/\//g, '-');
      fs.writeFileSync(path.join(OUT_DIR, localName), mp3);

      const url = await uploadToSupabase(mp3, task.storagePath);
      map[task.lang][task.text] = url;
      done++;
      console.log(`✓ (${mp3.length.toLocaleString()}B)`);
    } catch (e) {
      failed++;
      console.log(`✗ ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 150));
  }

  console.log('');
  console.log(`✅  Done: ${done} generated, ${failed} failed`);

  // Write tts-map.js
  const mapContent = `/* Numbers of Magic — pre-generated TTS lookup map
 * Generated by: number_magic/scripts/generate-nm-audio.js
 * ${new Date().toISOString()}
 */
window.NM_TTS_MAP = ${JSON.stringify(map, null, 2)};
`;
  fs.writeFileSync(TTS_MAP_FILE, mapContent);
  console.log(`\n📝  Wrote ${TTS_MAP_FILE}`);
  console.log('   Commit data/tts-map.js and deploy to use MP3 audio.');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
