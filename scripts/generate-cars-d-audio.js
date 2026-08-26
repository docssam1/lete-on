#!/usr/bin/env node
/**
 * Generate and upload CARS Plus Level D practice audio.
 *
 * Storage paths:
 *   audio/cars-level-d/cd1-extra.mp3
 *   audio/cars-level-d/cd1-new.mp3
 *   ... cd15
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
const VOICE_NAME = 'en-US-Neural2-F';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const OUT_DIR = path.join(__dirname, '../audio-generated/cars-level-d');

if (!GOOGLE_TTS_KEY) {
  console.error('❌ Set GOOGLE_TTS_KEY environment variable first.');
  process.exit(1);
}
if (!SUPABASE_KEY) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY before uploading audio.');
  process.exit(1);
}

const window = { LESSONS: {} };
const dataDir = path.join(__dirname, '../reading-world/data');

function load(fileName) {
  const file = path.join(dataDir, fileName);
  if (!fs.existsSync(file)) throw new Error(`Missing data file: ${fileName}`);
  try {
    eval(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`${fileName} eval error: ${error.message}`);
  }
}

// cd1 is a standalone lesson. cd2~cd15 use the compact registration engine.
load('cd1.js');
load('cars-d-engine.js');
for (let i = 2; i <= 15; i++) load(`cd${i}-data.js`);

const tasks = [];
for (let i = 1; i <= 15; i++) {
  const lessonId = `cd${i}`;
  const lesson = window.LESSONS[lessonId];
  if (!lesson) throw new Error(`Lesson was not registered: ${lessonId}`);
  if (lesson.bookId !== 'cars-level-d') throw new Error(`${lessonId} has wrong bookId: ${lesson.bookId}`);

  if (lesson.extraLearning?.passage?.length) {
    tasks.push({
      lessonId,
      type: 'extra',
      text: lesson.extraLearning.passage.join('\n\n'),
      storagePath: `cars-level-d/${lessonId}-extra.mp3`,
    });
  }
  if (lesson.newPassage?.passage?.length) {
    tasks.push({
      lessonId,
      type: 'new',
      text: lesson.newPassage.passage.join('\n\n'),
      storagePath: `cars-level-d/${lessonId}-new.mp3`,
    });
  }
}

if (tasks.length !== 30) {
  throw new Error(`Expected 30 CARS D audio tasks, found ${tasks.length}`);
}

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks),
      }));
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
  const response = await httpRequest({
    hostname: 'texttospeech.googleapis.com',
    path: `/v1/text:synthesize?key=${encodeURIComponent(GOOGLE_TTS_KEY)}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, payload);
  if (response.status !== 200) {
    throw new Error(`Google TTS ${response.status}: ${response.body.toString().slice(0, 300)}`);
  }
  const json = JSON.parse(response.body.toString());
  return Buffer.from(json.audioContent, 'base64');
}

async function uploadToSupabase(buffer, storagePath) {
  const response = await httpRequest({
    hostname: new URL(SUPABASE_URL).hostname,
    path: `/storage/v1/object/audio/${storagePath}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      apikey: SUPABASE_KEY,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
  }, buffer);
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Supabase upload ${response.status}: ${response.body.toString().slice(0, 300)}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/audio/${storagePath}`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const totalChars = tasks.reduce((sum, task) => sum + task.text.length, 0);
  console.log(`📚 CARS Plus Level D: ${tasks.length} passages, ${totalChars.toLocaleString()} characters`);
  console.log(`🎙 Voice: ${VOICE_NAME}`);

  let done = 0;
  let failed = 0;
  for (const task of tasks) {
    const label = `${task.lessonId}-${task.type}`;
    process.stdout.write(`  🎙 ${label} (${task.text.length} chars)... `);
    try {
      const mp3 = await generateMp3(task.text);
      const localPath = path.join(OUT_DIR, `${label}.mp3`);
      fs.writeFileSync(localPath, mp3);
      const url = await uploadToSupabase(mp3, task.storagePath);
      done++;
      console.log(`✅ ${(mp3.length / 1024).toFixed(0)} KB → ${url}`);
    } catch (error) {
      failed++;
      console.log(`❌ ${error.message}`);
    }
  }

  console.log(`\nComplete: ${done}/${tasks.length}, failed: ${failed}`);
  if (failed) process.exit(1);
}

main().catch(error => {
  console.error('❌', error);
  process.exit(1);
});
