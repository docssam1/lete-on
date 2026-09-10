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

// ── Load all unit data ─────────────────────────────────────────────────────────
const window = { NM_UNITS: {} };
const unitsDir = path.join(__dirname, '../data/units');
/* 유아(N)는 전면 음성(원장 지시: "유아쪽은 mp3를 넣고 다른쪽은 대표적인 것만") —
   N 유닛은 intro·finish에 더해 correct/wrong·마법 노트 rule까지 생성한다. */
/* 2026-09-10 — 짝 찾기(pairMul) 게임을 붙인 B-16·C-02를 명시적으로 추가한다.
   B·C 시리즈 전체(58유닛)를 여는 게 아니다 — 그건 별도로 비용 검토가 필요하다. */
const EXTRA_UNIT_FILES = ['B-16.js', 'C-02.js'];
const unitFiles = fs.readdirSync(unitsDir)
  .filter(f => /^[AN]-\d+\.js$/.test(f) || EXTRA_UNIT_FILES.includes(f))
  .sort();

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

  /* 정답/오답 코멘트 전면 음성 — 유아(tier basic) + 짝 찾기(selectPairs) 게임을 붙인
     유닛(2026-09-10, pickTile이 tier와 무관하게 항상 말한다 — app/main.js 참고).
     마법 노트 rule은 유아 전용이라 그대로 basic만. */
  const FULL_VOICE_UNITS = new Set(['A-01', 'B-16', 'C-02']);
  if (unit.tier === 'basic' || FULL_VOICE_UNITS.has(id)) {
    ['correct', 'wrong'].forEach(kind => {
      (unit.voice?.[kind] || []).forEach((line, i) => {
        for (const lang of ['ko', 'en', 'zh']) {
          const text = typeof line === 'string' ? line : line[lang];
          if (text) tasks.push({
            unitId: id, key: `${kind}${i}`, lang,
            text,
            storagePath: `number-magic/${id}-${kind}${i}-${lang}.mp3`,
          });
        }
      });
    });
    if (unit.tier === 'basic' && unit.discover?.rule) {
      for (const lang of ['ko', 'en', 'zh']) {
        const text = unit.discover.rule[lang];
        if (text) tasks.push({
          unitId: id, key: 'rule', lang,
          text,
          storagePath: `number-magic/${id}-rule-${lang}.mp3`,
        });
      }
    }
  }
}

/* 유닛에 안 묶인 전역 UI 문구 — 짝 찾기(pairMul)에서 짝을 하나 찾았지만 더 있을 때
   부르는 onePairMore(2026-09-10, app/main.js I18N.onePairMore와 정확히 같은 문자열
   이어야 say()가 찾아 재생한다 — 하나라도 다르면 조용히 Web Speech로 폴백한다). */
const GLOBAL_TASKS = {
  onePairMore: { ko: '정답! 하나 더 있어', en: 'Correct! One more to find', zh: '答对了！还有一对' },
};
for (const [key, byLang] of Object.entries(GLOBAL_TASKS)) {
  for (const lang of ['ko', 'en', 'zh']) {
    const text = byLang[lang];
    if (text) tasks.push({
      unitId: 'ui', key, lang,
      text,
      storagePath: `number-magic/ui-${key}-${lang}.mp3`,
    });
  }
}

const totalChars = tasks.reduce((s, t) => s + t.text.length, 0);
console.log(`📋  ${tasks.length} tasks (~${totalChars.toLocaleString()} chars total)`);
if (process.env.DRY_RUN) {   // 과금·업로드 없이 태스크 목록만 점검
  const byUnit = {};
  tasks.forEach(t => { byUnit[t.unitId] = (byUnit[t.unitId] || 0) + 1; });
  console.log(Object.entries(byUnit).map(([k, v]) => `${k}:${v}`).join(' '));
  process.exit(0);
}
/* 키 확인은 DRY_RUN 통과 뒤로 옮겼다(2026-09-10) — 전엔 여기 도달하기 전에 죽어서
   "과금·업로드 없이 태스크 목록만 점검"이라는 DRY_RUN의 존재 의미가 없었다. */
if (!GOOGLE_TTS_KEY) {
  console.error('❌  Set GOOGLE_TTS_KEY environment variable first.');
  process.exit(1);
}
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
