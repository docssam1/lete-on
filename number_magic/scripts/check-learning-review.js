#!/usr/bin/env node
'use strict';
/* 2026-10-10 후속 회귀. 원본/누락 변이는 메모리에만 두며 제품 파일을 바꾸지 않는다.
   node scripts/check-learning-review.js [--browser] [--baseline=<커밋>]
   NM_LEARNING_ARTIFACTS=<E: 검수 폴더>면 실제 화면/인쇄 근거를 저장한다. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..'),REPO=path.dirname(ROOT);
/* 기본 검사는 얕은 clone에서도 실행된다. 이번 전후 비교 때만 --baseline=13d4ecc5를 준다. */
const baselineRef=(process.argv.find(a=>a.startsWith('--baseline='))||'').slice(11);
const historical=file=>execFileSync('git',['show',baselineRef+':number_magic/'+file],{cwd:REPO,encoding:'utf8'});
const appHtml=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
function loadCourses(source){
  const w={console};w.window=w;
  const ctx=vm.createContext(w);
  const tags=[...appHtml.replace(/<!--[\s\S]*?-->/g,'').matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)];
  for(const [,src] of tags){
    const f=src.split('?')[0];
    if(!/^data\/(?:threads|middle-pacing|wordable|courses)\.js$|^data\/g1\/[^/]+-threads\.js$/.test(f))continue;
    vm.runInContext(f==='data/courses.js'?source:fs.readFileSync(path.join(ROOT,f),'utf8'),ctx,{filename:f});
  }
  return w;
}
const plain=v=>JSON.parse(JSON.stringify(v));
const currentWorld=loadCourses(fs.readFileSync(path.join(ROOT,'data/courses.js'),'utf8')),after=plain(currentWorld.NM_COURSES);
if(baselineRef){
  const before=plain(loadCourses(historical('data/courses.js')).NM_COURSES);
  for(const key of Object.keys(before).filter(k=>k!=='C0'))assert.deepEqual(after[key],before[key],key+' must not change');
  const semantics=v=>JSON.parse(JSON.stringify(v,(key,value)=>['count','minutes'].includes(key)?undefined:value));
  assert.deepEqual(semantics(after.C0),semantics(before.C0),'C0 types, levels, roles and sequence must stay the same');
}
assert.equal(after.C0.sessions.length,19);
for(const s of after.C0.sessions){
  assert(s.minutes>=15&&s.minutes<=25);
  for(const d of s.school)assert(d.count>=(!d.review&&d.difficulty==='hard'?12:6)&&d.count%6===0);
}
/* 부분분수 합은 16종뿐이다. 예시/따라 풀기 4종을 제외한 12종 상한을 실제 생성기로 전수 확인한다. */
const fractionWorld={console,NM_TGEN:{}};fractionWorld.window=fractionWorld;
const fractionCtx=vm.createContext(fractionWorld);
for(const f of ['engine/rng.js','engine/threads/fr.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),fractionCtx,{filename:f});
const fractionKeys=new Set();
for(let start=1;start<=4;start++)for(let length=4;length<=7;length++){
  const draws=[(start-.5)/4,(length-3.5)/4];
  const p=fractionWorld.NM_TGEN.fr4_unlikeAddSub({mode:'chain'},()=>draws.shift());
  fractionKeys.add(p.tex);assert.equal(p.answer,start+length);
  const sum=Array.from({length},(_,i)=>1/((start+i)*(start+i+1))).reduce((a,n)=>a+n,0);
  assert(Math.abs(sum-(1/start-1/p.answer))<1e-12);
}
assert.equal(fractionKeys.size,16);assert.equal(currentWorld.NM_COUNT_CAP['FR4@4'],12);
console.log('PASS — FR4 L4 exactly 16 variants, 12 practice + 4 teaching; no repeated padding');
/* 실제 검사기에 G1 태그를 하나씩 빼서 실패하는지 확인한다(저장소는 그대로). */
const checker=fs.readFileSync(path.join(__dirname,'check-session-roles.js'),'utf8');
function checkMutation(html){
  let status=0;
  const injectedFs=Object.assign({},fs,{readFileSync:(file,...args)=>path.resolve(file)===path.join(ROOT,'index.html')?html:fs.readFileSync(file,...args)});
  try{
    vm.runInNewContext(checker,{__dirname,require:name=>name==='fs'?injectedFs:require(name),
      process:{argv:['node','check'],exit:n=>{status=n;throw Error('EXPECTED_EXIT');}},
      console:{log(){}},Set,Map},{filename:'check-session-roles.js',timeout:20000});
  }catch(e){if(e.message!=='EXPECTED_EXIT')throw e;}
  return status;
}
assert.equal(checkMutation(appHtml),0);
const groups=['1-3','4-6','7-9','10-12','13-15'];
for(const g of groups){
  const tag='<script src="data/g1/'+g+'-threads.js"></script>';
  assert(appHtml.includes(tag));
  assert.equal(checkMutation(appHtml.replace(tag,'')),1,'missing G1 '+g+' must fail');
}
console.log('PASS — 19 preschool sessions within budget; 5 G1 omissions rejected'+(baselineRef?'; all other courses unchanged from '+baselineRef:''));
if(!process.argv.includes('--browser'))process.exit(0);

async function browserChecks(){
  const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
  const {NO_WEBGL_ARGS}=require('./lib/nm-onboard');
  const out=process.env.NM_LEARNING_ARTIFACTS;
  if(out)fs.mkdirSync(out,{recursive:true});
  const {server,base}=await serve();
  const original=baselineRef?historical('app/exam.js'):null;
  const current=fs.readFileSync(path.join(ROOT,'app/exam.js'),'utf8');
  const fixture='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<link rel="stylesheet" href="app/learning-stage.css"><link rel="stylesheet" href="app/living-lesson.css">'+
    '<style>body{margin:16px;font-family:system-ui,sans-serif}.nm-unit-view{max-width:780px;margin:auto}</style></head>'+
    '<body><main class="nm-unit-view" data-learning-band="preschool"><div id="lesson"></div></main>'+
    '<script src="data/living-lessons.js"></script><script type="module">import {mount} from "./app/hop-lesson.js";'+
    'window.controller=mount(document.getElementById("lesson"),"N-07",new URL(location.href).searchParams.get("lang"));</script></body></html>';
  const browser=await chromium.launch({args:NO_WEBGL_ARGS}),report={print:[],hop:[]};
  try{
    // 변경 전후 패커에 같은 문항/답을 준다. 저장소를 바꾸지 않는 검사 전용 읽기 고리.
    const cases=[['NL17',2],['NL19',2],['DC2',3],['DC3',6]];
    const baseline=new Map();
    for(const [version,source] of original?[['before',original],['after',current]]:[['after',current]]){
      const ctx=await browser.newContext({viewport:{width:1280,height:1200},serviceWorkers:'block'});
      await ctx.route('**/*',r=>/supabase\.(co|in)/.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
      await ctx.route('**/app/exam.js*',r=>r.fulfill({contentType:'text/javascript',body:source.replace('window.NM_EXAM = NM_EXAM;',
        'window.NM_EXAM = NM_EXAM; window.__nmReview={renderRoundPages,problemKey};')}));
      await ctx.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;window.print=()=>{};});
      const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/number_magic/drill.html',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.__nmReview);
      await page.emulateMedia({media:'print'});
      await page.addStyleTag({content:'html,body,.nm-print-sheet{width:190mm!important}'});
      for(const lang of ['ko','en','zh'])for(const [thread,level] of cases){
        await page.evaluate(l=>localStorage.setItem('nm_state_v1',JSON.stringify({lang:l})),lang);
        const cfg={thread,level,count:12,seed:'numbers-review-20261010'};
        const signature=await page.evaluate(cfg=>{
          const r=__nmReview.renderRoundPages(Object.assign({},cfg),{count:cfg.count});
          NM_EXAM.renderPrint(cfg);
          return {keys:r.problems.map(__nmReview.problemKey),answers:r.problems.map(p=>p.answer),sizes:r.pageSizes,
            guided:r.guidedProblems.map(__nmReview.problemKey)};
        },cfg);
        await page.evaluate(()=>document.fonts.ready);
        const key=lang+'-'+thread+'-L'+level;
        if(version==='before')baseline.set(key,signature);
        else{
          const b=baseline.get(key);
          if(b){
            assert.deepEqual(signature.keys,b.keys,key+' problem order');
            assert.deepEqual(signature.answers,b.answers,key+' answers');
            assert.deepEqual(signature.guided,b.guided,key+' teaching examples');
            assert(signature.sizes.length<=b.sizes.length,key+' no added pages');
          }
          assert.equal(signature.keys.length,12);
          assert.equal(signature.sizes.reduce((a,n)=>a+n,0),12);
          assert.equal(new Set(signature.keys).size,12);
          if(lang==='ko')assert.deepEqual(signature.sizes,({NL17:[6,6],NL19:[4,4,4],DC2:[6,6],DC3:[0,6,6]})[thread],key+' balanced practice pages');
          const over=await page.evaluate(()=>[...document.querySelectorAll('.nm-print-sheet .nm-w2-page')].flatMap((p,i)=>{
            const worst=Math.max(p.scrollHeight-p.clientHeight,...[...p.querySelectorAll('.nm-w2-item')].map(e=>e.scrollHeight-e.clientHeight));
            return worst>3?[{page:i+1,worst}]:[];
          }));
          assert.deepEqual(over,[],key+' A4 overflow');
          report.print.push({key,before:b?b.sizes:null,after:signature.sizes});
          if(out&&lang==='ko'){
            await page.pdf({path:path.join(out,key+'.pdf'),preferCSSPageSize:true,printBackground:true});
            await page.locator('.nm-print-sheet .nm-w2-page').last().screenshot({path:path.join(out,key+'-last.png')});
          }
        }
      }
      assert.deepEqual(errors,[]);await ctx.close();
    }
    for(const [lang,width,reduced] of [['ko',390,false],['en',1280,false],['zh',390,true]]){
      const ctx=await browser.newContext({viewport:{width,height:960},reducedMotion:reduced?'reduce':'no-preference'});
      await ctx.route('**/__nm-hop-check.html*',r=>r.fulfill({contentType:'text/html',body:fixture}));
      const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/number_magic/__nm-hop-check.html?lang='+lang);
      await page.waitForFunction(()=>window.controller);
      const state=()=>page.evaluate(()=>controller.getState());
      const settled=()=>page.waitForFunction(()=>document.getElementById('lesson').dataset.moving==='false');
      const move=async()=>{await page.locator('[data-act="hop"]').click();await settled();};
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert(await page.locator('#lesson button').evaluateAll(a=>a.every(b=>b.getBoundingClientRect().height>=44)));
      await page.evaluate(()=>{window.frogNode=document.querySelector('.nm-hop-frog');});
      await page.locator('[data-predict]').first().click();assert.equal((await state()).pos,0);
      for(let round=0;round<4;round++){
        const v=await state(),[a,op,c]=v.input;
        for(let i=0;i<a+c;i++){
          if(!reduced&&i===0){
            await page.evaluate(()=>{window.samples=[];window.sampling=setInterval(()=>{
              const frog=document.querySelector('.nm-hop-frog'),body=document.querySelector('.nm-hop-body');
              samples.push({x:new DOMMatrix(getComputedStyle(frog).transform).m41,y:new DOMMatrix(getComputedStyle(body).transform).m42});
            },20);});
            await page.locator('[data-act="hop"]').click();
            await page.evaluate(()=>{document.querySelector('.nm-hop-stage').click();document.querySelector('[data-act="hop"]').click();});
            if(out&&lang==='ko'&&round===0){
              await page.waitForTimeout(90);
              await page.locator('.nm-hop-stage').screenshot({path:path.join(out,'hop-ko-390-inflight.png')});
            }
            await settled();
            const samples=await page.evaluate(()=>{clearInterval(sampling);return window.samples;});
            assert(samples.some(p=>p.x>24&&p.x<55.2&&p.y<-2),'visible in-flight hop');
            assert.equal((await state()).pos,1,'rapid clicks must not queue hidden hops');
          }else if(i===1){
            assert.equal(await page.evaluate(()=>document.activeElement.dataset.act),'hop','keep keyboard focus between hops');
            await page.keyboard.press('Enter');await settled();
            assert.equal((await state()).pos,2,'keyboard repeats hop without refocusing');
          }else if(!reduced&&op==='-'&&i===a){
            const start=(await state()).pos;
            await page.locator('[data-act="hop"]').click();
            const airborne=await page.evaluate(()=>new Promise(resolve=>setTimeout(()=>{
              const frog=document.querySelector('.nm-hop-frog'),body=document.querySelector('.nm-hop-body');
              resolve({x:new DOMMatrix(getComputedStyle(frog).transform).m41,y:new DOMMatrix(getComputedStyle(body).transform).m42,
                pos:controller.getState().pos,complete:controller.getState().complete});
            },130)));
            assert(airborne.x<24+start*31.2&&airborne.x>24+(start-1)*31.2&&airborne.y<-2,'backward hop travels left and up');
            assert.equal(airborne.pos,start,'do not commit position before landing');
            await settled();
          }else await move();
        }
        const done=await state();assert(done.complete);assert.equal(done.pos,op==='+'?a+c:a-c);
        assert.equal(await page.evaluate(()=>frogNode===document.querySelector('.nm-hop-frog')),round===0);
        await page.locator('[data-act="undo"]').focus();await page.keyboard.press('Enter');
        assert.equal((await state()).complete,false);await move();
        await page.locator('[data-act="next"]').click();assert.equal((await state()).pos,0);
      }
      if(!reduced){
        await page.locator('[data-act="hop"]').click();await page.locator('[data-act="reset"]').click();await page.waitForTimeout(430);
        assert.equal((await state()).pos,0,'reset cancels pending landing');
        await page.locator('[data-act="hop"]').click();await page.locator('[data-act="next"]').click();await page.waitForTimeout(430);
        assert.equal((await state()).pos,0,'next cancels pending landing');
        await page.locator('[data-act="hop"]').click();await page.emulateMedia({reducedMotion:'reduce'});await settled();
        assert.equal((await state()).pos,1,'motion preference settles the pending hop');
      }
      await page.locator('[data-act="reset"]').click();
      if(out)await page.locator('#lesson').screenshot({path:path.join(out,'hop-'+lang+'-'+width+'.png')});
      if(!reduced){
        await page.emulateMedia({reducedMotion:'no-preference'});
        await page.locator('[data-act="hop"]').click();
      }
      await page.evaluate(()=>{window.oldHost=document.getElementById('lesson');oldHost.remove();});
      await page.waitForFunction(()=>!window.oldHost.__livingLesson);
      assert.equal(await page.evaluate(()=>oldHost.getAnimations({subtree:true}).length),0);
      assert.deepEqual(errors,[]);
      report.hop.push({lang,width,reduced,rounds:4});await ctx.close();
    }
    if(out)fs.writeFileSync(path.join(out,'learning-review.json'),JSON.stringify(report,null,2));
    console.log('PASS — 12 multilingual A4 samples'+(baselineRef?' preserve baseline problem/answer order':'')+'; 12 hop rounds, actual forward/backward arc, rapid clicks, reset/next, keyboard, disposal and reduced motion');
  }finally{await browser.close();server.close();}
}
browserChecks().catch(e=>{console.error(e);process.exitCode=1;});
