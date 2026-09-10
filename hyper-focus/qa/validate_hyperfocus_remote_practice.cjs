/* Local mock transport only. No deployment, database changes, real student lookup, or pool promotion. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'hyper-focus/output/qa/hf-remote-practice');
const fixtureCatalog={schemaVersion:1,contentVersion:'fixture-v1',types:Array.from({length:54},(_,i)=>({typeId:i+1,title:'검수 유형 '+(i+1),pools:Object.fromEntries(['easy','same','hard'].map(d=>[d,{free:{count:2,releaseStatus:'verified'},paid:{count:20,releaseStatus:'verified'}}]))}))};
const prohibited=/\/hyper-focus\/(data\.js|generator\/|mock\/(variation-bank|mock-core|exam-blueprints)\.js)/;
const init=options=>{
 window.__env={name:'검수학생',studentId:'fixture-student',permissionIds:[1,2,54],paid:false,failType:false,failContent:false,revoked:false,...options};
 window.__calls=[];window.__releases=[];window.__mutate=null;window.__printCount=0;window.print=()=>window.__printCount++;
 window.__client={
  auth:{onAuthStateChange:callback=>{window.__auth=callback;return {data:{subscription:{unsubscribe(){}}}};}},
  functions:{invoke:async(name,{body})=>{
   window.__calls.push({name,body:JSON.parse(JSON.stringify(body))});
   const e=window.__env,now=Date.now();
   if(name==='hyperfocus-type-access'){
    if(e.failType)return{error:{message:'mock failure'},data:null};
    return{error:null,data:{verified:true,accountStatus:'active',studentId:e.studentId,approvedStudentName:e.name,permissionKeys:[HFTypeAccessCatalog.modeKey,...(e.revoked?[]:e.permissionIds.map(id=>HFTypeAccessCatalog.keyFor(id)))],basePermissions:e.paid?['hyperfocus','hyperfocus-extra']:['hyperfocus'],catalogVersion:HFTypeAccessCatalog.version,verifiedAt:now,validUntil:now+60000}};
   }
   if(name!=='hyperfocus-practice-content')throw Error('Unexpected function '+name);
   if(e.failContent)return{error:{message:'mock failure'},data:null};
   const data={verified:true,studentId:e.studentId,approvedStudentName:e.name,validUntil:now+60000,contentVersion:HFPracticeCatalog.contentVersion,part:body.part,accessTier:body.accessTier};
   data[body.part]=body.types.flatMap((t,ti)=>Array.from({length:body.countPerType},(_,i)=>{
    const n=ti*body.countPerType+i+1,base={id:'fixture-'+t.typeId+'-'+t.difficulty+'-'+i,number:n,typeId:t.typeId,difficulty:t.difficulty};
    return body.part==='questions'?{...base,prompt:'검수용 조건을 살펴보고 답을 쓰세요.',problemHtml:'<svg viewBox="0 0 360 180"><defs><linearGradient id="paint"><stop offset="0" stop-color="#eee"/><stop offset="1" stop-color="#aac"/></linearGradient><clipPath id="clip"><rect x="0" y="0" width="360" height="180"/></clipPath></defs><g clip-path="url(#clip)"><rect x="12" y="12" width="320" height="120" fill="url(#paint)"/><text x="40" y="75">그림 '+n+'</text></g></svg>'}:{...base,answerHtml:'<b>정답 검수 '+n+'</b>',solution:'조건을 하나씩 확인하는 검수용 풀이입니다.'};
   }));
   if(window.__mutate)window.__mutate(data);
   if(e.holdContent)await new Promise(resolve=>window.__releases.push(resolve));
   return {data,error:null};
  }}
 };
};
async function setup(browser,options={}){
 const context=await browser.newContext({viewport:{width:1100,height:950}}),page=await context.newPage(),requests=[],errors=[];
await page.addInitScript(init,options);page.on('pageerror',e=>errors.push(e.message));if(options.clock)await page.clock.install();
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());requests.push(url.pathname);
  if(url.pathname.endsWith('/supabase-config.js'))return route.fulfill({contentType:'text/javascript',body:'window.GFIELD_HF_SUPABASE_CONFIG={enabled:true,features:{securePracticeDelivery:'+String(options.feature!==false)+',secureMockDelivery:true}};'});
  if(url.pathname.endsWith('/supabase-client.js'))return route.fulfill({contentType:'text/javascript',body:'window.GFieldHFSupabase={enabled:()=>true,ready:async()=>window.__client};'});
  if(url.pathname.endsWith('/portal-auth.js'))return route.fulfill({contentType:'text/javascript',body:'window.GFieldHFPortalAuth={ready:async()=>({name:"검수학생",backend:"supabase"}),isSupabaseEnabled:()=>true,canAccess:()=>true};'});
  if(url.pathname.endsWith('/practice-public-catalog.js')){const c=JSON.parse(JSON.stringify(fixtureCatalog));if(options.held)for(const type of c.types)for(const pool of Object.values(type.pools))for(const p of Object.values(pool))p.releaseStatus='held';return route.fulfill({contentType:'text/javascript',body:'window.HFPracticeCatalog='+JSON.stringify(c)+';'});}
  if(options.exam&&url.pathname.endsWith('/secure-mock.js'))return route.fulfill({contentType:'text/javascript',body:'window.GFieldHFSecureMock={loadExam:async id=>({id,title:"기존 보호 시험",subtitle:"검수",attemptId:"fixture-attempt",questions:[{number:1,typeTitle:"기존 유형",typeCode:"Q01",questionKey:"fixture-q",revision:1,prompt:"기존 시험 문항",problemHtml:"<svg viewBox=\\"0 0 100 100\\"><rect width=\\"80\\" height=\\"80\\"/></svg>"}]}),loadAnswers:async()=>({answers:[]})};'});
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep))return route.fulfill({status:403,body:'blocked'});
  try{const body=fs.readFileSync(file),ext=path.extname(file);return route.fulfill({contentType:ext==='.html'?'text/html; charset=utf-8':ext==='.js'?'text/javascript; charset=utf-8':ext==='.json'?'application/json':ext==='.png'?'image/png':'application/octet-stream',body});}catch(_){return route.fulfill({status:404,body:'not found'});}
 });
 const base=options.teacher?'http://127.0.0.1':'https://student.invalid',query=options.query||(options.exam?'exam=fixture-exam':'mode=practice&types=1&count=2&seed=17&student=위조이름');
 await page.goto(base+'/hyper-focus/mock/viewer.html?'+query+(options.teacher?'&teacherPreview=1':''));await page.waitForFunction(()=>window.HFPracticeBootstrap);if(!options.deferReady)await page.evaluate(()=>HFPracticeBootstrap.ready);await page.waitForTimeout(60);
 return {page,context,requests,errors,close:()=>context.close()};
}
async function run(){
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch();let checks=0;const evidence=[];
 const check=(v,message)=>{assert(v,message);checks++;};
 try{
  let test=await setup(browser),page=test.page;
  check(await page.locator('.remote-practice-sheet:not(.solutions)').count()===2,'remote questions');
  check(!test.requests.some(p=>prohibited.test(p)),'remote must never load authored/generator scripts');
  check(await page.locator('.solutions').count()===0,'no answers in initial DOM');
  check(await page.evaluate(()=>__calls.filter(c=>c.name==='hyperfocus-practice-content').every(c=>c.body.part==='questions')),'no answer request before click');
  check((await page.locator('.watermark').allTextContents()).every(s=>s.includes('검수학생')&&!s.includes('위조')),'server-only watermark');
  check(!new URL(page.url()).searchParams.has('student'),'URL name removed');
  await page.locator('#answerBtn').click();check(await page.locator('.solutions.show').count()===2,'explicit answer delivery');
  check(await page.evaluate(()=>__calls.filter(c=>c.body?.part==='answers').length)===1,'single explicit answer request');
  await page.locator('#answerBtn').click();check(await page.locator('.solutions.show').count()===0,'answers close');
  await page.locator('#answerBtn').click();check(await page.evaluate(()=>__calls.filter(c=>c.body?.part==='answers').length)===1,'cached authorized answers reopen');
  await page.screenshot({path:path.join(out,'remote-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:850});check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'390px no horizontal overflow');await page.screenshot({path:path.join(out,'remote-390.png'),fullPage:true});
  await page.emulateMedia({media:'print'});await page.pdf({path:path.join(out,'remote-questions-answers.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});await page.emulateMedia({media:'screen'});
  const sanitizer=await page.evaluate(()=>{
   const raw='<script>window.bad=1</script><iframe src="https://evil.invalid"></iframe><svg onload="bad()"><foreignObject><img src="https://evil.invalid"/></foreignObject><animate attributeName="href" values="javascript:bad()"/><defs><clipPath id="cut"><rect width="10" height="10"/></clipPath></defs><g clip-path="url(#cut)"><path d="M0 0L9 9"/></g></svg><img src="https://evil.invalid" onerror="bad()"><div style="position:fixed;background:url(https://evil.invalid);color:red" id="pages">safe</div>';
   const safe=HFPracticeContent.safeHtml(raw),holder=document.createElement('div');holder.innerHTML=safe;document.body.append(holder);
   return {safe,script:holder.querySelectorAll('script,iframe,foreignObject,animate').length,events:[...holder.querySelectorAll('*')].some(e=>[...e.attributes].some(a=>a.name.startsWith('on'))),clip:holder.querySelector('g').getAttribute('clip-path'),id:holder.querySelector('clipPath').id};
  });
  check(sanitizer.script===0&&!sanitizer.events,'executable markup removed');check(!sanitizer.safe.includes('https://evil')&&!sanitizer.safe.includes('position:fixed'),'remote/style exfil removed');check(sanitizer.clip==='url(#'+sanitizer.id+')','SVG reference remapped');check(!test.requests.some(p=>p.includes('evil')),'inert parsing makes no remote request');
  const validation=await page.evaluate(async()=>{
   const base={action:'practice',types:[{typeId:1,difficulty:'same'}],countPerType:1,seed:17,accessTier:'free',part:'questions'},rejects=[];
   const bad=[{countPerType:0},{countPerType:3},{countPerType:21,accessTier:'paid'},{seed:-1},{seed:4294967296},{seed:1.5},{types:[]},{types:[{typeId:55,difficulty:'same'}]},{types:[{typeId:1,difficulty:'same'},{typeId:1,difficulty:'easy'}]},{types:Array.from({length:21},(_,i)=>({typeId:i+1,difficulty:'same'}))},{types:[{typeId:1,difficulty:'unknown'}]},{part:'both'},{accessTier:'admin'}];
   for(const input of bad){try{HFPracticeContent.validateRequest({...base,...input});rejects.push(false);}catch(_){rejects.push(true);}}
   for(const field of ['answerHtml','payload','answerCandidates','machineReadable','evidence']){__mutate=data=>{data.questions[0][field]='secret';};try{await HFPracticeContent.request(base);rejects.push(false);}catch(_){rejects.push(true);}}
   for(const mutate of [d=>d.studentId='different',d=>d.approvedStudentName='다른 학생',d=>d.validUntil=Date.now()-1,d=>d.validUntil=Date.now()+100000,d=>d.contentVersion='new',d=>d.part='answers',d=>d.accessTier='paid',d=>d.questions[0].number=2,d=>d.questions[0].typeId=2,d=>d.questions[0].difficulty='hard',d=>d.questions[0].id='',d=>d.questions=[]]){
    __mutate=mutate;try{await HFPracticeContent.request(base);rejects.push(false);}catch(_){rejects.push(true);}
   }
   __mutate=null;const q=await HFPracticeContent.request(base);
   for(const mutate of [d=>d.answers[0].id='mismatch',d=>d.answers[0].payload={},d=>d.answers[0].solution=null]){
    __mutate=mutate;try{await HFPracticeContent.request({...base,part:'answers'},q);rejects.push(false);}catch(_){rejects.push(true);}
   }
   __mutate=null;return rejects;
  });for(const result of validation)check(result,'negative schema/identity/answer binding');
  await page.evaluate(()=>{__env.revoked=true;return HFTypeAccess.refresh();});check(await page.locator('.remote-practice-sheet').count()===0,'revocation clears questions and answers');check(await page.locator('.watermark').count()===0,'revocation clears student watermark');await test.close();
  for(const options of [{feature:false},{held:true},{query:'mode=practice&types=1&count=2&seed=17&teacherPreview=1'}]){
   test=await setup(browser,options);check(!test.requests.some(p=>prohibited.test(p)),'locked/production teacher query cannot load content scripts');if(options.feature===false||options.held)check(await test.page.locator('.remote-practice-sheet').count()===0,'feature/held fail closed');await test.close();
  }
  test=await setup(browser,{query:'mode=practice&types=1&count=1&seed=1788900012345'});check(await test.page.locator('.remote-practice-sheet').count()===1,'legacy timestamp seed normalized');check(await test.page.evaluate(()=>__calls.find(c=>c.name==='hyperfocus-practice-content').body.seed<=4294967295),'server seed uint32');await test.close();
test=await setup(browser,{clock:true});page=test.page;await page.evaluate(()=>document.querySelector('.prompt').dataset.edit='preserve');await page.clock.runFor(61000);await page.waitForTimeout(30);check(await page.locator('.prompt[data-edit="preserve"]').count()===1,'same lease renewal preserves existing DOM past 60s');check(await page.evaluate(()=>__calls.filter(c=>c.name==='hyperfocus-practice-content').length)>=2,'background content renewal');await page.evaluate(()=>{__env.failContent=true;});await page.clock.runFor(45000);await page.waitForTimeout(30);check(await page.locator('.remote-practice-sheet').count()===0,'renewal failure clears content');await test.close();
  test=await setup(browser,{holdContent:true,deferReady:true});page=test.page;await page.waitForFunction(()=>__releases.length===1);await page.evaluate(()=>{__auth('SIGNED_OUT');__releases.splice(0).forEach(fn=>fn());});await page.evaluate(()=>HFPracticeBootstrap.ready);check(await page.locator('.remote-practice-sheet').count()===0,'late question response cannot restore signed-out content');await test.close();
  test=await setup(browser);page=test.page;await page.evaluate(()=>{__env.holdContent=true;});await page.locator('#answerBtn').click();await page.waitForFunction(()=>__releases.length===1);await page.evaluate(async()=>{__env.name='다른 검수학생';await HFTypeAccess.refresh();__releases.splice(0).forEach(fn=>fn());});await page.waitForTimeout(30);check(await page.locator('.remote-practice-sheet').count()===0,'late answers cannot restore previous student');await test.close();
  test=await setup(browser,{teacher:true,query:'mode=practice&types=1&count=1&seed=17&student=교사용검토'});check(test.requests.some(p=>p.endsWith('/generator/q01.js')),'explicit local teacher keeps legacy generator');check(await test.page.locator('.question').count()===1,'local teacher practice still renders');check(await test.page.evaluate(()=>__calls.length)===0,'teacher preview no server lookup');await test.close();
  test=await setup(browser,{exam:true});check(await test.page.locator('.prompt').innerText()==='기존 시험 문항','existing remote exam rendering preserved');check(await test.page.evaluate(()=>__calls.every(c=>c.name!=='hyperfocus-practice-content')),'exam never routed to practice API');await test.close();
  test=await setup(browser,{paid:true,query:'mode=practice&types=1&count=2&seed=17'});check(await test.page.locator('#regenBtn').isVisible(),'paid partial pool permits other questions');await test.close();
  test=await setup(browser);page=test.page;check(!await page.locator('#regenBtn').isVisible(),'fixed free pair cannot regenerate');
  const latestPath=path.join(root,'hyper-focus/output/private-practice/latest.json');
  check(fs.existsSync(latestPath),'current private package required for visual preservation QA');
  if(fs.existsSync(latestPath)){
   const latest=JSON.parse(fs.readFileSync(latestPath,'utf8')),bundle=path.isAbsolute(latest.out)?latest.out:path.resolve(root,latest.out),manifest=JSON.parse(fs.readFileSync(path.join(bundle,'private/manifest.json'),'utf8')),samples=[];
   for(const [typeKey,types] of Object.entries(manifest.bank))for(const difficulty of ['easy','same','hard']){
    const shard=types[difficulty].free.shards[0],q=JSON.parse(fs.readFileSync(path.join(bundle,'private',shard.questions.path),'utf8')).items[0],a=JSON.parse(fs.readFileSync(path.join(bundle,'private',shard.answers.path),'utf8')).items.find(a=>a.id===q.id);samples.push({typeId:Number(typeKey.slice(1)),difficulty,q,a});
   }
   check(samples.length===162&&new Set(samples.map(s=>s.typeId)).size===54,'54 types at all three difficulty levels');
   const audit=await page.evaluate(samples=>samples.map(s=>{
    const raw=document.createElement('template');raw.innerHTML=s.q.problemHtml;const clean=document.createElement('template');clean.innerHTML=HFPracticeContent.safeHtml(s.q.problemHtml);
    const visual=['svg','path','rect','circle','polygon','polyline','line','ellipse','text','img','image','table','td','linearGradient','clipPath'];
    return {typeId:s.typeId,difficulty:s.difficulty,lost:visual.flatMap(tag=>raw.content.querySelectorAll(tag).length===clean.content.querySelectorAll(tag).length?[]:[tag]),unsafe:clean.content.querySelectorAll('script,iframe,foreignObject').length};
   }),samples);
   for(const row of audit)check(row.lost.length===0&&row.unsafe===0,'actual pool visual nodes preserved: '+row.typeId+' '+row.difficulty);
   evidence.push({actualPackageVersion:manifest.contentVersion,sanitizedPools:audit.length,release:'held; local synthetic verification only'});
   for(const typeId of [1,11,12,13,25,54]){
    const s=samples.find(s=>s.typeId===typeId&&s.difficulty==='hard');
    await page.evaluate(s=>{document.querySelector('#pages').innerHTML='<section class="sheet remote-practice-sheet"><div class="watermark">교사용 검토 · GFIELD · LETE-ON</div><div class="head"><h1>실제 유형 '+s.typeId+' · 검수</h1></div><article class="question"><div class="prompt"></div><div class="figure"></div></article><div class="solution"></div></section>';document.querySelector('.prompt').textContent=s.q.prompt;document.querySelector('.figure').innerHTML=HFPracticeContent.safeHtml(s.q.problemHtml);const solution=document.querySelector('.solution');solution.innerHTML=HFPracticeContent.safeHtml(s.a.answerHtml);const p=document.createElement('p');p.textContent=s.a.solution;solution.append(p);},s);
    for(const width of [1100,390]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'actual pool mobile overflow '+typeId);await page.screenshot({path:path.join(out,'actual-q'+typeId+'-'+width+'.png'),fullPage:true});}
   }
   await page.evaluate(samples=>{
    const pages=document.querySelector('#pages');pages.replaceChildren();
    for(const part of ['questions','answers'])for(const s of samples){
     const section=document.createElement('section');section.className='sheet remote-practice-sheet';const mark=document.createElement('div');mark.className='watermark';mark.textContent='교사용 검토 · GFIELD · LETE-ON';section.append(mark);
     const header=document.createElement('div');header.className='head';const title=document.createElement('h1');title.textContent='유형 '+s.typeId+' · '+s.difficulty+' · '+(part==='questions'?'문제 검수':'풀이 검수');header.append(title);section.append(header);
     const item=document.createElement('article');item.className=part==='questions'?'question':'solution';
     if(part==='questions'){const prompt=document.createElement('div');prompt.className='prompt';prompt.textContent=s.q.prompt;item.append(prompt);const art=document.createElement('div');art.className='figure';art.innerHTML=HFPracticeContent.safeHtml(s.q.problemHtml);item.append(art);}
     else{item.innerHTML=HFPracticeContent.safeHtml(s.a.answerHtml);const p=document.createElement('p');p.textContent=s.a.solution;item.append(p);}
     section.append(item);pages.append(section);
    }
   },samples);
   await page.emulateMedia({media:'print'});const printOverflow=await page.evaluate(()=>[...document.querySelectorAll('.remote-practice-sheet')].flatMap((s,i)=>s.getBoundingClientRect().height>1124?[i+1]:[]));check(printOverflow.length===0,'all 162 actual pools fit question and answer A4 sheets');
   const textBounds=await page.evaluate(()=>{
    const scan=()=>[...document.querySelectorAll('.remote-practice-sheet')].flatMap((sheet,i)=>{
     const page=sheet.getBoundingClientRect(),walker=document.createTreeWalker(sheet,NodeFilter.SHOW_TEXT),outside=[];let node;
     while(node=walker.nextNode()){
      if(!node.textContent.trim()||node.parentElement.closest('.watermark,script,style'))continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const b of range.getClientRects())if(b.width&&b.height&&(b.left<page.left-2||b.right>page.right+2||b.top<page.top-2||b.bottom>page.bottom+2)){outside.push({page:i+1,text:node.textContent.slice(0,100)});break;}
     }
     return outside;
    });
    const normal=scan(),header=document.querySelectorAll('.remote-practice-sheet .head h1')[162],prior=header.style.transform;
    header.style.transform='translateX(800px)';const detectsShiftedAnswerHeader=scan().some(x=>x.page===163);header.style.transform=prior;
    return {normal,detectsShiftedAnswerHeader,restored:scan()};
   });
   check(textBounds.normal.length===0,'all question and answer text stays inside each A4 page horizontally and vertically');
   check(textBounds.detectsShiftedAnswerHeader,'negative control catches shifted/clipped answer heading');
   check(textBounds.restored.length===0,'negative control restores clean text bounds');
   await page.pdf({path:path.join(out,'actual-all-types-questions-answers.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});await page.emulateMedia({media:'screen'});evidence.push({actualQuestionAndAnswerSheets:samples.length*2,printOverflow,textBounds});
  }
  await test.close();
  return {passed:true,checks,evidence,scope:'student practice request isolation; direct legacy URLs remain a separate deployment gate',release:'not deployed; securePracticeDelivery remains false'};
 }finally{await browser.close();}
 return {checks,evidence};
}
run().then(report=>{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}).catch(error=>{console.error(error);process.exitCode=1;});
