'use strict';
/* 누미 한국어 새 목소리를 앱에 넣는다 (2026-11-11, 원장 「A 1번」 → 시험 12줄 듣고 「진행」).
   node scripts/import-numi-voice.js <후보 폴더> [먼저 쓸 폴더]
     후보 폴더   = numi-voice-candidate 브랜치의 candidate/numi-v2 (mp3 + report.json, 러너가 만든 것)
     먼저 쓸 폴더 = 원장이 들어 보고 고른 시험 12줄(같은 꼴). 있으면 그 줄은 이것을 쓴다.
   하는 일
     1) 지금 연결표의 한국어 줄마다 새 목소리 파일(받아쓰기 검사 통과한 것만)을 audio/omni/ 에 복사한다.
        옛 파일은 지우지 않는다(되돌릴 수 있게). 영어·중국어 줄은 손대지 않는다.
     2) data/tts-map-omni.js 를 다시 쓴다: 한국어 줄 → 새 파일, 길이표(NM_VOICE_DURATIONS) 한국어 → 새 길이,
        재생 속도 NM_TTS_OMNI_RATE = {ko:1, en:0.8, zh:0.8}.
     3) data/voice-release-20261111-numi.json 에 줄마다 파일·해시·길이·받아쓰기 결과·옛 파일을 남긴다.
   새 목소리가 없는 줄은 연결표에서 빠진다(화면 글만 보인다). 다른 목소리를 섞지 않는다. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const VOICE='nm-numi-v2',RATE={ko:1,en:.8,zh:.8};
const REFERENCE='number_magic/scripts/showreel/narration/omnivoice-rec/n01.mp3';
const [candDir,prefDir]=process.argv.slice(2);
if(!candDir)throw Error('Usage: node import-numi-voice.js <candidate dir> [preferred dir]');
const sha1=s=>crypto.createHash('sha1').update(s,'utf8').digest('hex');
const sha256=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const fname=text=>'ko-'+sha1(`${VOICE}|ko|${text}`).slice(0,12)+'.mp3';
const duration=p=>Math.round(Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',p]).toString().trim())*100)/100;
const readReport=d=>d&&fs.existsSync(path.join(d,'report.json'))?JSON.parse(fs.readFileSync(path.join(d,'report.json'),'utf8')):{};

const mapPath=path.join(root,'data/tts-map-omni.js'),world={window:{}};
vm.runInNewContext(fs.readFileSync(mapPath,'utf8'),world);
const map=JSON.parse(JSON.stringify(world.window.NM_TTS_OMNI));
const durations=JSON.parse(JSON.stringify(world.window.NM_VOICE_DURATIONS||{ko:{},en:{},zh:{}}));
const old=path.join(root,'data/voice-release-20261111-numi.json');
const prior=fs.existsSync(old)?JSON.parse(fs.readFileSync(old,'utf8')):null;
const reports=[[prefDir,readReport(prefDir),'trial'],[candDir,readReport(candDir),'full']];

const clips=[],missing=[],ko={};
for(const [text,current] of Object.entries(map.ko)){
  const f=fname(text);
  const pick=reports.find(([d,r])=>d&&r[f]&&r[f].ok===true&&r[f].text===text&&fs.existsSync(path.join(d,f)));
  // 이미 새 목소리로 바뀐 줄을 다시 돌릴 때: 옛 파일 기록을 이어받는다.
  const before=prior?.clips.find(c=>c.text===text);
  const previousFile=before?before.previousFile:current;
  if(!pick){missing.push(text);continue;}
  const [dir,rep,source]=pick,src=path.join(dir,f),dst=path.join(root,'audio/omni',f),hash=sha256(src);
  if(fs.existsSync(dst)&&sha256(dst)!==hash)throw Error('같은 이름의 다른 파일이 이미 있습니다: '+f);
  if(!fs.existsSync(dst))fs.copyFileSync(src,dst);
  const file='audio/omni/'+f,sec=duration(dst);
  ko[text]=file;
  clips.push({lang:'ko',text,file,previousFile,sha256:hash,duration:sec,playbackDuration:Math.round(sec/RATE.ko*100)/100,
    source,cer:rep[f].cer,asr:rep[f].asr,voice:VOICE});
}
for(const text of Object.keys(durations.ko||{})){const c=clips.find(x=>x.text===text);if(c)durations.ko[text]=c.duration;else delete durations.ko[text];}
map.ko=ko;
const count=Object.values(map).reduce((n,v)=>n+Object.keys(v).length,0);
fs.writeFileSync(mapPath,'/* Numbers of Magic — OmniVoice recordings. '+count+' text mappings.\n'+
  ' * Korean: Numi voice nm-numi-v2 (2026-11-11, reference = the approved recording, played at 1.0x). English/Chinese unchanged (0.8x).\n'+
  ' * Previous MP3s are preserved. Missing lines stay silent; no device TTS fallback. Import: scripts/import-numi-voice.js. */\n'+
  'window.NM_TTS_OMNI = '+JSON.stringify(map,null,1)+';\n'+
  'window.NM_VOICE_DURATIONS = '+JSON.stringify(durations,null,1)+';\n'+
  'window.NM_TTS_OMNI_RATE = '+JSON.stringify(RATE)+';\n');
const manifest={version:'2026-11-11-numi',voice:VOICE,reference:REFERENCE,rate:RATE,
  decision:'원장 2026-11-10 「A 1번」(여자 목소리 1번) → 시험 12줄을 듣고 2026-11-11 「진행」',
  trialLinesHeardByOwner:clips.filter(c=>c.source==='trial').length,operatorListeningPerformed:false,
  durations,clips,missing};
fs.writeFileSync(old,JSON.stringify(manifest,null,2)+'\n');
console.log(`NUMI_VOICE_IMPORTED ko=${clips.length} trial=${manifest.trialLinesHeardByOwner} missing=${missing.length}`);
missing.forEach(t=>console.log('  빠짐: '+t));
