'use strict';
/* 누미 한국어 새 목소리(2026-11-11) 검사 — scripts/import-numi-voice.js 가 만든 것과 앱 연결표가 맞는지.
   한국어 줄은 전부 새 목소리 파일·해시가 기록과 같고, 옛 파일은 남아 있어 되돌릴 수 있고,
   재생 속도는 한국어 1.0 · 영어/중국어 0.8, 길이표는 기록과 같다. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),world={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/tts-map-omni.js'),'utf8'),world);
const w=world.window,release=JSON.parse(fs.readFileSync(path.join(root,'data/voice-release-20261111-numi.json'),'utf8'));
assert.deepEqual(JSON.parse(JSON.stringify(w.NM_TTS_OMNI_RATE)),{ko:1,en:.8,zh:.8});
assert.deepEqual(release.rate,{ko:1,en:.8,zh:.8});assert.equal(release.voice,'nm-numi-v2');
const ko=w.NM_TTS_OMNI.ko,byText=new Map(release.clips.map(c=>[c.text,c]));
assert.equal(Object.keys(ko).length,release.clips.length,'연결표 한국어 줄 수와 기록이 다릅니다');
for(const [text,file] of Object.entries(ko)){
  const c=byText.get(text);assert(c,'기록에 없는 한국어 줄: '+text);assert.equal(file,c.file);
  assert(/^audio\/omni\/ko-[0-9a-f]{12}\.mp3$/.test(file));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),c.sha256);
  assert(c.duration>.2);assert(c.cer<=.12,'받아쓰기 검사를 통과하지 못한 줄: '+text);
  if(c.previousFile){assert.notEqual(c.previousFile,file);assert(fs.existsSync(path.join(root,c.previousFile)),'옛 음성이 남아 있어야 합니다: '+c.previousFile);}
}
assert.equal(JSON.stringify(w.NM_VOICE_DURATIONS),JSON.stringify(release.durations));
for(const [text,sec] of Object.entries(release.durations.ko))assert.equal(sec,byText.get(text).duration);
console.log(`NUMI_VOICE_OK ko=${release.clips.length} trial=${release.trialLinesHeardByOwner} missing=${release.missing.length} rate=ko1/en0.8/zh0.8`);
