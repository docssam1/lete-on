'use strict';
// Full real MP3 playback in the actual learning note, API fixtures only.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_REVIEWED_VOICE_ARTIFACTS||'/tmp/nm-reviewed-voice-video-20261023';
const bridge=`window.__V47={note:lang=>{S.lang=lang;S.unit='N-01';S.view='unit';S.step='discover';S.sub={};render();},snapshot:()=>JSON.parse(JSON.stringify({coins:S.coins,progress:S.progress,speed:S.roadSpeed,placement:S.placement}))};`;
const server=http.createServer((req,res)=>{
 const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.mp3':'audio/mpeg','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');
 let s=fs.readFileSync(f);if(f.endsWith('/app/main.js')){s=s.toString();const i=s.lastIndexOf('\n})();');s=s.slice(0,i)+bridge+s.slice(i);}res.end(s);
});
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const b=await chromium.launch({args:['--mute-audio','--autoplay-policy=no-user-gesture-required','--disable-webgl','--disable-webgl2']});
 try{
  const report=await Promise.all(['ko','en','zh'].map(async lang=>{
   const c=await b.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
   await c.route('**/functions/v1/nm-review',r=>r.fulfill({json:{scope:'learning_review',username:'voice47-fixture',token:'a'.repeat(64),expiresAt:new Date(Date.now()+7200000).toISOString()}}));
   await c.addInitScript(()=>{
    window.__clips=[];window.__recordFull=false;window.__cuts=[];window.__overlaps=[];window.__ended=[];
    const play=HTMLMediaElement.prototype.play,pause=HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.play=function(){
     if(__recordFull){const others=__clips.filter(a=>a!==this&&!a.paused&&!a.ended);if(others.length)__overlaps.push(others.length);__clips.push(this);this.addEventListener('ended',()=>__ended.push({file:new URL(this.src).pathname,rate:this.playbackRate}),{once:true});}
     return play.call(this);
    };
    HTMLMediaElement.prototype.pause=function(){if(__recordFull&&!this.paused&&!this.ended&&this.currentTime>.05&&this.duration-this.currentTime>.08)__cuts.push({src:this.src,at:this.currentTime,duration:this.duration});return pause.call(this);};
   });
   await p.goto(base+'/number_magic/access.html?lang='+lang);await p.click('#open-book');await p.fill('#login-user','voice47-fixture');await p.fill('#login-password','fixture-only');await p.click('#login-submit');await p.waitForFunction(()=>window.__V47&&document.querySelector('#nmReviewLogout'));await p.evaluate(lang=>__V47.note(lang),lang);
   await p.waitForSelector('#mnvOpen');for(let i=0;i<10&&await p.locator('#nmSymClose').count();i++)await p.click('#nmSymClose');const keep=await p.evaluate(()=>__V47.snapshot());
   const coverage=await p.evaluate(lang=>{const v=NM_MAGIC_NOTE_VIDEOS.get('N-01',lang),text=v.cues[0].text[lang],old=NM_TTS_OMNI[lang][text];delete NM_TTS_OMNI[lang][text];const missing=NM_MAGIC_NOTE_PLAYER.available('N-01',lang);NM_TTS_OMNI[lang][text]=old;return {missing,ready:NM_MAGIC_NOTE_PLAYER.available('N-01',lang),duration:v.duration,cues:v.cues.length};},lang);assert.equal(coverage.missing,false);assert.equal(coverage.ready,true);
   await p.click('#mnvOpen');await p.waitForFunction(()=>NM_MAGIC_NOTE_PLAYER.current.time>.8);await p.click('.mnv [data-act=play]');const paused=await p.evaluate(()=>NM_MAGIC_NOTE_PLAYER.current.time);await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>NM_MAGIC_NOTE_PLAYER.current.time),paused);assert.equal(await p.evaluate(()=>NM_VOICE.isSpeaking()),false);
   await p.click('.mnv [data-act=play]');await p.waitForFunction(()=>NM_MAGIC_NOTE_PLAYER.current.time>1.2);await p.click('.mnv [data-act=close]');assert.equal(await p.evaluate(()=>NM_VOICE.isSpeaking()),false);assert.equal(await p.evaluate(()=>document.activeElement.id),'mnvOpen');
   await p.evaluate(()=>{__recordFull=true;__clips=[];__cuts=[];__overlaps=[];__ended=[];});await p.click('#mnvOpen');
   await p.waitForFunction(lang=>NM_MAGIC_NOTE_PLAYER.current.time>NM_MAGIC_NOTE_VIDEOS.get('N-01',lang).atCanonical(26),lang,{timeout:60000});await p.screenshot({path:path.join(OUT,lang+'-counting.png')});
   await p.waitForFunction(()=>!document.querySelector('.mnv-end').hidden,null,{timeout:100000});
   const result=await p.evaluate(()=>({started:__clips.length,ended:__ended.length,cuts:__cuts,overlaps:__overlaps,rates:__ended.map(x=>x.rate),speaking:NM_VOICE.isSpeaking(),time:NM_MAGIC_NOTE_PLAYER.current.time}));assert.equal(result.started,coverage.cues);assert.equal(result.ended,coverage.cues);assert.deepEqual(result.cuts,[]);assert.deepEqual(result.overlaps,[]);assert(result.rates.every(r=>r===.8));assert.equal(result.speaking,false);assert(Math.abs(result.time-coverage.duration)<.001);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:path.join(OUT,lang+'-finished.png')});
   await p.evaluate(()=>window.__recordFull=false);await p.click('.mnv [data-act=again]');await p.waitForFunction(()=>NM_MAGIC_NOTE_PLAYER.current.time>.8);await p.click('.mnv [data-act=close]');assert.equal(await p.evaluate(()=>NM_VOICE.isSpeaking()),false);
   await p.emulateMedia({reducedMotion:'reduce'});await p.click('#mnvOpen');assert.equal(await p.locator('.mnv [data-act=next]').count(),1);await p.click('.mnv [data-act=next]');await p.click('.mnv [data-act=close]');assert.equal(await p.evaluate(()=>NM_VOICE.isSpeaking()),false);
   assert.deepEqual(await p.evaluate(()=>__V47.snapshot()),keep);assert.deepEqual(errors,[]);await c.close();
   console.log('VIDEO_LANGUAGE_OK '+lang);return {lang,...coverage,fullCuesPlayed:result.started,allEnded:true,noOverlap:true,noTruncation:true,pauseResume:true,restartClose:true,reducedMotion:true,progressPreserved:true,externalWrites:0,operatorListeningPerformed:false};
  }));
  fs.writeFileSync(path.join(OUT,'video-report.json'),JSON.stringify(report,null,2));console.log('REVIEWED_VOICE_VIDEO_OK '+JSON.stringify(report));
 }finally{await b.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
