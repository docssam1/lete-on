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
/* 2026-09-10 — anon 키로는 더 이상 업로드가 안 된다. 2026-08-25 보안 강화 마이그레이션
   (restrict_public_storage_to_read_only)이 storage 버킷을 anon read-only로 잠갔다 —
   anon 키는 store.js에도 박혀 있는 공개 키라 쓰기 허용은 그 자체로 취약점이었다.
   reading-world 쪽 scripts/generate-audio.js가 이미 쓰는 것과 같은 패턴(서비스
   롤 키, 저장소 Actions Secret에 이미 등록돼 있음)으로 맞춘다. */
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const OUT_DIR = path.join(__dirname, '../audio-generated');
const TTS_MAP_FILE = path.join(__dirname, '../data/tts-map.js');

// Google voices by language — cmn-CN has no Neural2 tier, Wavenet is the best available
const VOICES = {
  ko: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-C' },
  en: { languageCode: 'en-US', name: 'en-US-Neural2-F' },
  zh: { languageCode: 'cmn-CN', name: 'cmn-CN-Wavenet-A' },
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
if (!SUPABASE_KEY) {
  console.error('❌  Set SUPABASE_SERVICE_ROLE_KEY environment variable first (anon key is read-only on storage since 2026-08-25).');
  process.exit(1);
}
console.log(`🎙  Voices: ko-KR-Neural2-C / en-US-Neural2-F / cmn-CN-Wavenet-A`);
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
  /* map: { lang: { text: url } } — 기존 맵으로 시작해서 성공한 항목만 덮어쓴다
     (2026-09-10). 전엔 매번 빈 맵으로 시작해 실패한 태스크의 자리를 그냥 비워
     버렸다 — 이번 실행에서 813개 전부 실패하자 기존에 잘 있던 486줄(A·N 시리즈
     실음성)까지 통째로 지워져 커밋됐다. 실패는 이전 값을 그대로 둔다. */
  const map = { ko: {}, en: {}, zh: {} };
  try {
    const prevWindow = { NM_TTS_MAP: {} };
    eval(fs.readFileSync(TTS_MAP_FILE, 'utf8').replace(/window\.NM_TTS_MAP/, 'prevWindow.NM_TTS_MAP'));
    for (const lang of ['ko', 'en', 'zh']) Object.assign(map[lang], prevWindow.NM_TTS_MAP[lang] || {});
  } catch (e) {
    console.warn(`⚠  Could not load existing ${TTS_MAP_FILE}, starting fresh:`, e.message);
  }

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
