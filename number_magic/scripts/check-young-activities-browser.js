'use strict';
// Exercise the real split generator, learner-age branch, controls and stylesheet.
// API calls are mocked; this check never writes a real learner or server record.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright'),ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_SPLIT_ARTIFACTS;
const server=http.createServer((req,res)=>{
 const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.mp3':'audio/mpeg'})[path.extname(f)]||'application/octet-stream');let data=fs.readFileSync(f);
 if(f.endsWith('/app/main.js')){let s=data.toString(),i=s.lastIndexOf('\n})();');assert(i>0);data=s.slice(0,i)+`\nwindow.__YOUNG={open:(uid,step,older)=>{S.schoolAge={entryYear:older?2023:2027};S.unit=uid;S.view='unit';S.step=step;S.sub={skipAsked:true,started:true,labStarted:true};render();},problem:()=>JSON.parse(JSON.stringify(S.sub.cur||null)),state:()=>JSON.parse(JSON.stringify({coins:S.coins,progress:S.progress}))};`+s.slice(i);}

 res.end(data);
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,b=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),report=[];
try{if(OUT)fs.mkdirSync(OUT,{recursive:true});for(const [width,height,lang]of [[390,667,'ko'],[1280,720,'ko'],[390,844,'en'],[390,844,'zh']]){
 const c=await b.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());await c.route('**/functions/v1/nm-review',r=>r.fulfill({json:{scope:'learning_review',username:'young-fixture',token:'b'.repeat(64),expiresAt:new Date(Date.now()+7200000).toISOString()}}));
 await p.goto(base+'/number_magic/access.html?lang='+lang);await p.click('#open-book');await p.fill('#login-user','young-fixture');await p.fill('#login-password','fixture-only');await p.click('#login-submit');await p.waitForFunction(()=>window.__YOUNG&&document.querySelector('#nmReviewLogout'));const original=await p.evaluate(()=>__YOUNG.state());
 for(let n=1;n<=15;n++)for(const step of ['practice','lab','discover']){
 const unit='N-'+String(n).padStart(2,'0');await p.evaluate(x=>__YOUNG.open(...x),[unit,step,false]);await p.waitForTimeout(80);while(await p.locator('#nmSymClose').count())await p.click('#nmSymClose');const problem=await p.evaluate(()=>__YOUNG.problem());
 const info=await p.evaluate(()=>{const r=document.querySelector('.nm-unit-view');const cues=[...r.querySelectorAll('.nm-number-cue')].filter(x=>x.getBoundingClientRect().width);const map={};for(const x of cues){const k=x.textContent.trim(),v=getComputedStyle(x).color;if(map[k]&&map[k]!==v)throw Error('number-color mismatch '+k);map[k]=v;}
 return{horizontal:document.documentElement.scrollWidth>innerWidth,flag:r.dataset.youngNumbers,cues:cues.length,numerals:[...r.querySelectorAll('.nm-numi-dialogue .nm-dialog-figure')].map(e=>parseFloat(getComputedStyle(e).fontSize)),choicesColored:!!r.querySelector('button.nm-number-cue,button .nm-number-cue,.nm-numpad .nm-number-cue'),prompt:r.querySelector('.nm-bubble')?.textContent||'',widget:document.querySelector('#pracWidget,#labWidget')?.firstElementChild?.className,scroll:document.querySelector('#stepBody').scrollHeight-document.querySelector('#stepBody').clientHeight};});
 assert.equal(info.flag,'true');assert(!info.horizontal,JSON.stringify({unit,step,...info}));assert(!info.choicesColored,'choices must not be color-coded by answer');assert(info.numerals.every(n=>n>=36),'small meaningful numeral '+JSON.stringify({unit,step,...info}));await p.waitForTimeout(20);assert.deepEqual(await p.evaluate(()=>__YOUNG.problem()),problem,'decorating must never change problem data');
 if(OUT&&lang==='ko'&&((n<=6&&step==='lab')||(n===10&&step==='practice')||(n===1&&step==='discover')))await p.screenshot({path:path.join(OUT,`${width}-${unit}-${step}.png`)});report.push({width,height,lang,unit,step,...info,problemUnchanged:true});
 }
 await p.evaluate(()=>__YOUNG.open('N-01','practice',true));assert.equal(await p.locator('.nm-number-cue').count(),0,'older learners retain their typography');assert.deepEqual(await p.evaluate(()=>__YOUNG.state()),original);assert.deepEqual(errors,[]);await c.close();
 }if(OUT)fs.writeFileSync(path.join(OUT,'all-young-result.json'),JSON.stringify(report,null,2));console.log('ALL_YOUNG_OK '+JSON.stringify({screens:report.length,units:15,languages:3,cuedScreens:report.filter(x=>x.cues).length,problemChanges:0,externalWrites:0}));
}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
