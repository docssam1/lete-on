'use strict';
// Local, real MP3 decoding/playback. Test access to the app closure exists only in this HTTP response.
const fs=require('fs'),path=require('path'),http=require('http'),vm=require('vm'),assert=require('node:assert/strict');
const os=require('os'),{execFileSync}=require('child_process');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),world={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/tts-map-omni.js'),'utf8'),world);
const map=world.window.NM_TTS_OMNI;
let tasks;
if(process.env.NM_VOICE_TASKS)tasks=JSON.parse(fs.readFileSync(process.env.NM_VOICE_TASKS,'utf8'));
else{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'nm-voice-check-'));
 try{const file=path.join(tmp,'tasks.json');execFileSync(process.execPath,[path.join(root,'scripts/generate-nm-audio.js')],{env:{...process.env,DUMP_TASKS:file,GOOGLE_TTS_KEY:'',SUPABASE_SERVICE_ROLE_KEY:''}});tasks=JSON.parse(fs.readFileSync(file,'utf8'));}
 finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
const unique=[...new Map(tasks.map(t=>[t.lang+'\0'+t.text,t])).values()];
for(const t of unique){const f=map[t.lang]?.[t.text];assert(f,'Missing planned audio: '+t.unitId+' '+t.lang);assert(/^audio\/omni\/(ko|en|zh)-[0-9a-f]{12}\.mp3$/.test(f));assert(fs.statSync(path.join(root,f)).size>1000);}
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.mp3':'audio/mpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const p=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');
 if(p===path.join(root,'app/main.js')){let s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('\n})();');assert(i>0);s=s.slice(0,i)+'\nwindow.__VOICE_CHECK={say:(text,lang)=>{S.lang=lang;say(text);},stop:()=>{if(typeof stopVoice===\'function\')stopVoice();}};'+s.slice(i);return res.end(s);}
 res.end(fs.readFileSync(p));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required','--disable-3d-apis','--disable-webgl','--disable-webgl2']});
 try{
  const context=await browser.newContext();await context.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
  const page=await context.newPage();
  await page.addInitScript(()=>{
   sessionStorage.setItem('nm_entry_once_v1',JSON.stringify({mode:'preview',at:Date.now()}));window.__played=[];window.__fallback=0;const play=HTMLMediaElement.prototype.play;
   HTMLMediaElement.prototype.play=function(){window.__played.push(this);return play.call(this);};
   speechSynthesis.speak=()=>window.__fallback++;
  });
  await page.goto(base+'/index.html?enter=1');await page.waitForFunction(()=>window.__VOICE_CHECK);
  const decoded=await page.evaluate(async()=>{
   const ac=new AudioContext(),files=Object.values(NM_TTS_OMNI).flatMap(v=>Object.values(v)),bad=[];let cursor=0;
   await Promise.all(Array.from({length:4},async()=>{while(cursor<files.length){const file=files[cursor++];try{const r=await fetch(file);if(!r.ok)throw Error('HTTP '+r.status);const b=await ac.decodeAudioData(await r.arrayBuffer());let peak=0,sum=0;const a=b.getChannelData(0);for(let i=0;i<a.length;i++){peak=Math.max(peak,Math.abs(a[i]));sum+=a[i]*a[i];}if(b.duration<0.2||!Number.isFinite(b.duration)||peak<0.001)throw Error('empty or silent');}catch(e){bad.push({file,error:String(e)});}}}));await ac.close();return {count:files.length,bad};
  });assert.deepEqual(decoded.bad,[]);
  for(const lang of ['ko','en','zh']){
   const line=unique.find(t=>t.lang===lang&&t.key==='practice-intro');
   await page.evaluate(t=>__VOICE_CHECK.say(t.text,t.lang),line);
   await page.waitForFunction(()=>{const a=__played.at(-1);return a&&!a.paused&&a.currentTime>0.1;});
   assert.equal(await page.evaluate(()=>new URL(__played.at(-1).src).pathname.split('/').slice(-3).join('/')),map[lang][line.text]);
  }
  // A rapid next prompt must stop the previous narration; rejected old play promises must not speak late.
  const lines=unique.filter(t=>t.lang==='ko'&&t.key==='practice-intro').slice(0,2);
  await page.evaluate(t=>__VOICE_CHECK.say(t.text,t.lang),lines[0]);
  await page.waitForFunction(()=>!__played.at(-1).paused&&__played.at(-1).currentTime>0.1);
  await page.evaluate(t=>__VOICE_CHECK.say(t.text,t.lang),lines[1]);
  await page.waitForFunction(()=>!__played.at(-1).paused&&__played.at(-1).currentTime>0.1);
  assert.equal(await page.evaluate(()=>__played.at(-2).paused),true,'Old narration overlaps the next one');
  await page.evaluate(()=>__VOICE_CHECK.stop());assert.equal(await page.evaluate(()=>__played.at(-1).paused),true,'Stop must pause MP3 narration');
  assert.equal(await page.evaluate(()=>__fallback),0,'Valid OmniVoice clips must not fall back');
  // Delayed play rejection from an old prompt must not start obsolete device speech over a new clip.
  await page.evaluate(t=>{const play=HTMLMediaElement.prototype.play;let first=true;HTMLMediaElement.prototype.play=function(){if(first){first=false;window.__rejectVoice=null;return new Promise((_,reject)=>window.__rejectVoice=reject);}return play.call(this);};__VOICE_CHECK.say(t.text,t.lang);},lines[0]);
  await page.evaluate(t=>{__VOICE_CHECK.say(t.text,t.lang);__rejectVoice(new Error('old playback aborted'));},lines[1]);
  await page.waitForFunction(()=>!__played.at(-1).paused&&__played.at(-1).currentTime>0.1);
  assert.equal(await page.evaluate(()=>__fallback),0,'Stale playback rejection speaks an old prompt');
  await page.evaluate(()=>__VOICE_CHECK.stop());
  const report={plannedUnique:unique.length,byLanguage:Object.fromEntries(Object.entries(map).map(([l,v])=>[l,Object.keys(v).length])),decoded:decoded.count,playbackLanguages:3,rapidSwitch:true,stop:true,staleFailureIgnored:true,externalWrites:0};
  if(process.env.NM_VOICE_REPORT)fs.writeFileSync(process.env.NM_VOICE_REPORT,JSON.stringify(report,null,2));console.log('VOICE_BROWSER_OK '+JSON.stringify(report));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
