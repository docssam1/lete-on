'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const release=read('data/voice-release-20261023.json'),world={window:{}};
// 2026-11-11 누미 한국어 새 목소리가 이 기록의 한국어 줄을 대신한다(scripts/check-numi-voice.js). 옛 파일은 그대로 남는다.
const numi=fs.existsSync(path.join(root,'data/voice-release-20261111-numi.json'))?read('data/voice-release-20261111-numi.json'):{clips:[],missing:[]},numiFile=new Map(numi.clips.map(c=>[c.text,c.file]));
vm.runInNewContext(fs.readFileSync(path.join(root,'data/tts-map-omni.js'),'utf8'),world);
const map=world.window.NM_TTS_OMNI,requests=[...read('data/voice-recheck-20261022.json'),...read('data/voice-video-20261023.json')];
assert.equal(release.clips.length,47);assert.equal(release.userApprovedAll,true);assert.equal(release.operatorListeningPerformed,false);
assert.deepEqual(release.clips.map(x=>x.lang+'\0'+x.text).sort(),requests.map(x=>x.lang+'\0'+x.text).sort());
assert.equal(release.clips.filter(x=>x.automaticStatus==='HOLD_ASR').length,17);
assert.equal(release.clips.filter(x=>/PASS/.test(x.automaticStatus)).length,30);
assert.equal(release.clips.filter(x=>x.previousFile).length,8);
for(const c of release.clips){
 assert.equal(map[c.lang][c.text],c.lang!=='ko'?c.file:numiFile.has(c.text)?numiFile.get(c.text):numi.missing.includes(c.text)?undefined:c.file);
 assert(fs.existsSync(path.join(root,c.file)),'Approved 2026-10-23 audio must stay recoverable');assert(/^audio\/omni\/(ko|en|zh)-[a-f0-9]{12}\.mp3$/.test(c.file));
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,c.file))).digest('hex'),c.sha256);
 assert(c.duration>.2);assert.equal(c.playbackDuration,c.duration/.8);assert.equal(c.userApproved,true);assert.equal(c.operatorListeningPerformed,false);
 if(c.previousFile){assert.notEqual(c.previousFile,c.file);assert(fs.existsSync(path.join(root,c.previousFile)),'Previous audio must stay recoverable');}
}
assert.equal(Object.values(release.durations).reduce((n,x)=>n+Object.keys(x).length,0),50);
assert.equal(JSON.stringify(world.window.NM_VOICE_DURATIONS.en),JSON.stringify(release.durations.en));
assert.equal(JSON.stringify(world.window.NM_VOICE_DURATIONS.zh),JSON.stringify(release.durations.zh));
if(numi.clips.length)assert.deepEqual(Object.keys(world.window.NM_VOICE_DURATIONS.ko).sort(),Object.keys(release.durations.ko).filter(t=>numiFile.has(t)).sort());
else assert.equal(JSON.stringify(world.window.NM_VOICE_DURATIONS.ko),JSON.stringify(release.durations.ko));
console.log('REVIEWED_VOICE_OK selected=47 newVideo=39 replacedMappings=8 originalMP3s=preserved automaticPass=30 automaticHold=17 userApproved=47');
