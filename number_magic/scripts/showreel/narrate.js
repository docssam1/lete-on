#!/usr/bin/env node
/* 쇼릴 내레이션 MP3 만들기 — narration.json 의 줄마다 Google TTS(GOOGLE_TTS_KEY, 앱 음성과 같은 키)로.
   GitHub Actions(.github/workflows/showreel-narration.yml)에서 돈다 — 키는 저장소 비밀값에만 있다.
   출력: narration/<목소리>/<줄 id>.mp3. 기본 목소리는 전 줄, samples 목소리는 sampleLines 만(원장이 골라 보게). */
'use strict';
const https = require('https'), fs = require('fs'), path = require('path');
const KEY = process.env.GOOGLE_TTS_KEY;
if(!KEY){ console.error('GOOGLE_TTS_KEY 없음'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'narration.json'), 'utf8'));
const OUT = path.join(__dirname, 'narration');
function post(body){
  return new Promise((res, rej) => {
    const req = https.request({ hostname:'texttospeech.googleapis.com', path:`/v1/text:synthesize?key=${encodeURIComponent(KEY)}`,
      method:'POST', headers:{ 'Content-Type':'application/json' } }, r => { const c = []; r.on('data', d => c.push(d)); r.on('end', () => res({ status:r.statusCode, body:Buffer.concat(c) })); });
    req.on('error', rej); req.write(body); req.end();
  });
}
async function synth(voice, line){
  const r = await post(JSON.stringify({ input:{ text:line.text }, voice:{ languageCode:'ko-KR', name:voice },
    audioConfig:{ audioEncoding:'MP3', speakingRate:cfg.speakingRate || 1, sampleRateHertz:24000 } }));
  if(r.status !== 200) throw new Error(`${voice} ${line.id}: ${r.status} ${r.body.toString().slice(0, 200)}`);
  const dir = path.join(OUT, voice); fs.mkdirSync(dir, { recursive:true });
  const buf = Buffer.from(JSON.parse(r.body.toString()).audioContent, 'base64');
  fs.writeFileSync(path.join(dir, line.id + '.mp3'), buf);
  console.log(`✓ ${voice}/${line.id}.mp3 ${(buf.length / 1024).toFixed(1)}KB`);
}
(async () => {
  for(const l of cfg.lines) await synth(cfg.voice, l);
  for(const v of cfg.samples || []) for(const id of cfg.sampleLines || []){
    const l = cfg.lines.find(x => x.id === id);
    try { await synth(v, l); } catch(e){ console.warn('⚠', e.message); }
  }
})().catch(e => { console.error('❌', e.message); process.exit(1); });
