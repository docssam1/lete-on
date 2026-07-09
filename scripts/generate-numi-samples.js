#!/usr/bin/env node
/**
 * One-off: generate 3 candidate Korean voices for "Numi" (Numbers of Magic
 * narrator) so the director can pick one. Reuses the same GOOGLE_TTS_KEY API
 * key already used by scripts/generate-audio.js — no gcloud auth, no service
 * account, so this can never touch a different GCP project/billing account
 * than whatever GOOGLE_TTS_KEY itself belongs to.
 *
 * Usage:
 *   GOOGLE_TTS_KEY=AIza... node scripts/generate-numi-samples.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
if (!GOOGLE_TTS_KEY) {
  console.error('❌  Set GOOGLE_TTS_KEY environment variable first.');
  process.exit(1);
}

const TEXT = '자, 3하고 7을 볼까? 둘을 더하면 몇이 될까? 그렇지, 10! 이렇게 10이 되는 짝을 먼저 묶는 거야. 긴 덧셈도 짝꿍부터 묶으면 아주 쉬워진단다. 준비됐지?';
const OUT_DIR = path.join(__dirname, '../numi-samples');
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

async function synth(voiceName, outFile) {
  const payload = JSON.stringify({
    input: { text: TEXT },
    voice: { languageCode: 'ko-KR', name: voiceName },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, pitch: 1.0 },
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
  await synth('ko-KR-Neural2-A', 'numi_sample_A.mp3');
  await synth('ko-KR-Neural2-B', 'numi_sample_B.mp3');
  try {
    await synth('ko-KR-Chirp3-HD-Leda', 'numi_sample_C.mp3');
  } catch (e) {
    console.warn(`⚠  Chirp3-HD-Leda failed, falling back to Wavenet-A: ${e.message}`);
    await synth('ko-KR-Wavenet-A', 'numi_sample_C.mp3');
  }
})().catch(e => { console.error('❌', e.message); process.exit(1); });
