'use strict';
// Read-only navigation review on synthetic local profiles. All external writes blocked.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_NAV_ARTIFACTS||'/tmp/nm-navigation-targets';
const bridge=`\nwindow.__NAV=(()=>{let baseline;return{ready:()=>booted,prepare:()=>{guardianEntry=false;S.onboarded=true;S.symbolDex=Object.fromEntries(allUnitSymbols().map(s=>[s.sym,{unitId:s.unitId,earnedAt:1}]));baseline=JSON.stringify(S);},reset:()=>{S=JSON.parse(baseline);wsHelperId=null;guardianEntry=false;render();},view:v=>{S.view=v;render();},course:()=>enterContinueUnit('N-01',true),continued:()=>{S.view='title';enterContinueUnit('N-01',false);},story:()=>enterRoadUnit('N-01'),tier:()=>{enterTier('numberland');enterUnit('N-01');},catalog:()=>CUR.tiers.map(t=>({id:t.id,title:t.title})),catalogTier:id=>enterTier(id),mail:()=>{S.placement={course:'C1'};S._mbWeek=null;S.view='mailbox';render();},helper:()=>{wsHelperId=NM_EXAM.worksheetCode({thread:'ML12',level:1,count:12,seed:'navcheck'});history.replaceState(null,'',location.pathname+'?enter=1&ws='+encodeURIComponent(wsHelperId));S.view='town';render();return wsHelperId;},dex:()=>{S._dexFrom='title';S.view='symboldex';render();},state:()=>JSON.parse(JSON.stringify({view:S.view,unit:S.unit,tier:S.tierId,unitReturn:S.unitReturn,courseOrigin:S._fromCourseRoad,storyOrigin:S._fromRoadmap,week:S._mbWeek,helper:wsHelperId,coins:S.coins,progress:S.progress}))};})();`;
const server=http.createServer((req,res)=>{const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');let body=fs.readFileSync(f);if(f.endsWith('/app/main.js')){const s=body.toString(),i=s.lastIndexOf('\n})();');body=s.slice(0,i)+bridge+s.slice(i);}res.end(body);});
const labelPatterns={courseroad:/연산|course roadmap|运算路线/i,roadmap:/스토리|story map|故事地图/i,tier:/단원 목록|unit list|单元列表/i,town:/마을|village|村庄/i,title:/모드 선택|mode selection|模式选择/i,worksheethelper:/학습지 도우미|worksheet helper|学习单助手/i,mailbox:/선택한 학습지|selected worksheet|所选学习单/i};
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),report={cases:[],errors:[],externalWrites:[]};
 async function context(width,lang){const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'}),p=await ctx.newPage();p.on('pageerror',e=>report.errors.push(e.message));await ctx.route('**/*',r=>{const q=r.request();if(q.url().startsWith(base+'/')&&q.method()==='GET')return r.continue();if(q.method()!=='GET')report.externalWrites.push(q.url());return r.abort();});await ctx.route('**/app/entry.js?*',r=>r.fulfill({contentType:'text/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));await ctx.addInitScript(lang=>localStorage.setItem('nm_preview_state_v1',JSON.stringify({lang,name:'Navigation fixture',onboarded:true,avatar:{kind:'boy',name:'길잡이'},character:{number:3,color:'blue'},coins:777,progress:{},account:{status:'active'},r0BannerSeen:true,firstWeek:'2026-W01',attend:{days:1,last:new Date(Date.now()+9*3600000).toISOString().slice(0,10)}})),lang);await p.goto(base+'/number_magic/index.html?enter=1');await p.waitForFunction(()=>window.__NAV?.ready());await p.evaluate(()=>__NAV.prepare());return{ctx,p};}
 const state=p=>p.evaluate(()=>__NAV.state());
 async function back(p,selector,key,destination,width,lang,extra={}){
  const e=p.locator(selector).first();await e.waitFor();const before=await state(p),label=await e.innerText(),aria=await e.getAttribute('aria-label'),layout=await e.evaluate(e=>{const r=e.getBoundingClientRect(),b=e.closest('.nm-unit-bar,.nmsc-header');return{w:r.width,h:r.height,scroll:e.scrollWidth,client:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,barOverflow:b?b.scrollWidth-b.clientWidth:0};});
  if(destination==='tier')assert(label.includes(extra.tierName||(lang==='ko'?'베이직':lang==='en'?'Basic':'BASIC')),'unit exit names the actual destination tier');
  const actions=await p.locator('.nm-skip-btns .nm-btn').evaluateAll(es=>es.map(e=>{const r=document.createRange();r.selectNodeContents(e);const b=e.getBoundingClientRect();return{lines:r.getClientRects().length,h:b.height,right:b.right,bottom:b.bottom};}));
  assert(actions.every(x=>x.lines===1&&x.h>=44&&x.right<=width&&x.bottom<=844),'practice entry actions fit on one line inside the phone viewport');
  if(key==='course-unit'||(lang==='ko'&&width===390))await p.screenshot({path:path.join(OUT,`${width}-${lang}-${key}-before.png`)});
  await e.click();const after=await state(p),correct=destination==='worksheethelper'?after.helper===extra.code:after.view===destination&&(destination!=='mailbox'||after.week===extra.week),row={width,lang,key,label,aria,layout,before,after,destination,correct,...extra};report.cases.push(row);
  assert(correct,`${width} ${lang} ${key} restores ${destination}`);assert.match(label,key==='village-mode-selection'?/마을 나가기|Leave village|离开村庄/i:labelPatterns[destination],`${key} names its destination or leave action`);assert(layout.scroll<=layout.client+1&&layout.scrollHeight<=layout.clientHeight+1,`${key} button text fits`);assert(layout.barOverflow<=1,`${key} header text fits`);assert(layout.h>=44,`${key} touch target >=44px`);assert.equal(after.coins,before.coins,`${key} keeps coins`);assert.deepEqual(after.progress,before.progress,`${key} keeps progress`);return after;
 }
 try{
  for(const [width,lang]of [[390,'ko'],[320,'ko'],[390,'en'],[320,'en'],[390,'zh'],[320,'zh']].filter(c=>!process.env.NM_NAV_CASE||c.join('-')===process.env.NM_NAV_CASE)){
   const {ctx,p}=await context(width,lang);
   try{
    for(const [key,open,destination]of [['course-unit','course','courseroad'],['story-unit','story','roadmap'],['tier-unit','tier','tier']]){await p.evaluate(()=>__NAV.reset());await p.evaluate(name=>__NAV[name](),open);await back(p,'#backMap',key,destination,width,lang);}
    await p.evaluate(()=>{__NAV.reset();__NAV.helper();});await p.waitForSelector('#wshGoUnit');const code=(await state(p)).helper;await p.locator('#wshGoUnit').click();await back(p,'#backMap','worksheet-helper-unit','worksheethelper',width,lang,{code});await back(p,'#wshBack','worksheet-helper-town','town',width,lang);
    await p.evaluate(()=>{__NAV.reset();__NAV.mail();});await p.locator('[data-week]').nth(1).click();await p.waitForSelector('#mbGoUnit');const week=(await state(p)).week;await p.locator('#mbGoUnit').click();await back(p,'#backMap','weekly-envelope-unit','mailbox',width,lang,{week});
    await p.evaluate(()=>{__NAV.reset();__NAV.dex();});await back(p,'.nmsc-back,#dexBack','desk-symbol-collection','title',width,lang);
    await p.evaluate(()=>{__NAV.reset();__NAV.view('town');});await back(p,'#townLeave','village-mode-selection','title',width,lang);
    if(width===390&&lang==='ko'){
     await p.evaluate(()=>{__NAV.reset();__NAV.course();});await p.locator('#charChipBtn').click();await p.locator('#backCloset').click();await p.evaluate(()=>__NAV.tier());await back(p,'#backMap','course-closet-tier','tier',width,lang);
     await p.evaluate(()=>{__NAV.reset();__NAV.continued();});await back(p,'#backMap','desk-continue-unit','title',width,lang);
     await p.evaluate(()=>{__NAV.reset();__NAV.catalogTier('intermediate');});
     assert.deepEqual(await p.locator('.nm-level-group-title').allTextContents(),['창의수연 중급 전략','구구 기초 · 필요할 때 복습']);
     assert.equal(await p.locator('.nm-level.open .nm-unit[data-unit]').first().getAttribute('data-unit'),'C-01','ADVANCE starts with creative strategy');
     assert.equal(await p.locator('.nm-level-group-title').last().evaluate(e=>e.nextElementSibling?.querySelector('.nm-unit')?.getAttribute('data-unit')),'B-01','times tables remain optional review');
     assert.equal(await p.locator('.nm-tier-progress-n').innerText(),'0/35','optional times tables do not inflate creative progress');
     assert.equal(await p.locator('.nm-levels').evaluate(e=>e.scrollWidth<=e.clientWidth),true,'ADVANCE catalog fits a phone');
     await p.screenshot({path:path.join(OUT,'390-ko-advance.png')});
    }
    const upper=await p.evaluate(()=>__NAV.catalog().filter(t=>!['numberland','beginner','intermediate','advanced'].includes(t.id)));
    for(const tier of upper){
     await p.evaluate(id=>{__NAV.reset();__NAV.catalogTier(id);},tier.id);
     assert.equal(await p.locator('.nm-unit-title').evaluate(e=>e.firstChild.textContent),tier.title,'upper-school catalog title is preserved');
     await p.locator('.nm-unit[data-unit]:not(.trial-locked)').first().click();
     await back(p,'#backMap','upper-tier-'+tier.id,'tier',width,lang,{tierName:tier.title});
    }
    console.log('NAV_CASE_OK '+width+' '+lang);
   }finally{await ctx.close();fs.writeFileSync(path.join(OUT,'navigation-targets.json'),JSON.stringify(report,null,2));}
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalWrites,[]);console.log('NAVIGATION_TARGETS_OK cases='+new Set(report.cases.map(x=>x.width+'-'+x.lang)).size+' routes='+report.cases.length+' externalWrites=0');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
