'use strict';
// Import only the selected 26+21 clips. Existing MP3s are kept at their original URLs.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm'),assert=require('node:assert/strict');
const [bundle26,bundle21,decodeFile]=process.argv.slice(2);
if(!decodeFile)throw Error('Usage: node import-reviewed-voice.js candidate26-dir retry21-dir all50-decode.json');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=read(path.join(bundle26,'review.json')),retry=read(path.join(bundle21,'report.json')),decoded=read(decodeFile).clips;
const requests=[...read(path.join(root,'data/voice-recheck-20261022.json')),...read(path.join(root,'data/voice-video-20261023.json'))];
const world={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/tts-map-omni.js'),'utf8'),world);
const map=JSON.parse(JSON.stringify(world.window.NM_TTS_OMNI));
const manifestPath=path.join(root,'data/voice-release-20261023.json');
const previousManifest=fs.existsSync(manifestPath)?read(manifestPath):null;
const sources=[...old.filter(r=>r.mp3_saved).map(r=>({...r,source:path.join(bundle26,'audio',r.filename),automaticStatus:r.status,cer:r.cer})),
 ...retry.map(r=>({...r,filename:path.basename(r.selected_audio),source:path.resolve(bundle21,r.selected_audio),automaticStatus:r.automated_status,cer:r.selected_cer}))];
assert.equal(sources.length,47);assert.equal(new Set(sources.map(r=>r.lang+'\0'+r.text)).size,47);
assert.equal(old.filter(r=>r.mp3_saved).length,26);assert.equal(retry.length,21);
assert.deepEqual(sources.map(r=>r.lang+'\0'+r.text).sort(),requests.map(r=>r.lang+'\0'+r.text).sort());
const durations={ko:{},en:{},zh:{}},clips=[];
for(const r of sources){
 assert(['ko','en','zh'].includes(r.lang));
 const allowed=path.resolve(r.automaticStatus==='PASS_CANDIDATE'?bundle26:bundle21)+path.sep;
 assert(path.resolve(r.source).startsWith(allowed),'Candidate path outside its bundle');
 const sha256=hash(r.source),file='audio/omni/'+r.lang+'-'+sha256.slice(0,12)+'.mp3';
 const measured=decoded.find(x=>x.filename===path.basename(file)&&x.lang===r.lang&&x.text===r.text);
 assert(measured&&measured.playStarted&&measured.duration>.2&&Number.isFinite(measured.duration));
 assert.equal(measured.rate,.8);assert.equal(measured.preservesPitch,true);
 const target=path.join(root,file),prior=previousManifest?.clips.find(x=>x.lang===r.lang&&x.text===r.text);
 const previousFile=map[r.lang][r.text]===file&&prior?prior.previousFile:map[r.lang][r.text]||null;
 if(fs.existsSync(target))assert.equal(hash(target),sha256,'Immutable filename collision');else fs.copyFileSync(r.source,target);
 map[r.lang][r.text]=file;durations[r.lang][r.text]=measured.duration;
 clips.push({lang:r.lang,unitId:r.unit_id,key:r.sentence_id,text:r.text,file,previousFile,sha256,duration:measured.duration,playbackDuration:measured.duration/.8,
  automaticStatus:r.automaticStatus,cer:r.cer,numericRelation:r.numeric_relation||null,userApproved:true,operatorListeningPerformed:false});
}
// Existing N-01 rule recordings complete the video; these three clips are not replaced.
for(const r of decoded.filter(x=>x.originalASRStatus==='EXISTING_RULE')){
 assert(map[r.lang][r.text]);durations[r.lang][r.text]=r.duration;
}
assert.equal(Object.values(durations).reduce((n,x)=>n+Object.keys(x).length,0),50);
const manifest={version:'20261023-approved47',rate:.8,selected:47,videoLines:39,recheckedKoreanLines:8,automaticPass:30,automaticHold:17,
 userApprovedAll:true,operatorListeningPerformed:false,sourceZIPs:[{name:'candidate-set-20261023.zip',sha256:'22adbc2f33e17d7c27033e9f008b93858012ebd7e07594cdc83c9b0ce9bacfda'},
 {name:'retry21-20261023.zip',sha256:'092dd15b9200c8cdce4490cf58d8dc4ad715292ed578acd1845d991a9365fdc5'}],durations,clips};
fs.writeFileSync(path.join(root,'data/voice-release-20261023.json'),JSON.stringify(manifest,null,2)+'\n');
const count=Object.values(map).reduce((n,x)=>n+Object.keys(x).length,0);
fs.writeFileSync(path.join(root,'data/tts-map-omni.js'),'/* Numbers of Magic — OmniVoice recordings. '+count+' text mappings.\n * Approved 2026-10-23 candidates use immutable content hashes; previous MP3s are preserved.\n * Missing lines stay silent; no device TTS fallback. Import: scripts/import-reviewed-voice.js. */\nwindow.NM_TTS_OMNI = '+JSON.stringify(map,null,1)+';\nwindow.NM_VOICE_DURATIONS = '+JSON.stringify(durations,null,1)+';\n');
console.log('REVIEWED_VOICE_IMPORTED '+JSON.stringify({selected:clips.length,mappings:count,automaticPass:30,automaticHold:17,userApprovedAll:true,oldMP3sPreserved:true}));
