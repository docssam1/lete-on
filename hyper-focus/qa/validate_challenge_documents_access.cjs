const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const base=path.resolve(__dirname,'..'),out=path.join(base,'output/qa/challenge-document-access');
const results=[];function check(name,pass,detail={}){results.push({name,pass:!!pass,...detail});}
const protectedPattern=/\/(?:challenge-bank|exam-replacements|exam-editions|exam-priority|exam-more|exam-supplement|concept-catalog|concept-specials|concept-book-plan|variant-provider|concepts-two|exam)\.js$/;
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://local').pathname);if(name.endsWith('/'))name+='index.html';const file=path.resolve(base,'.'+name);if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('content-type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch();
 async function open(url,allowed=[],denied=false){
  const page=await browser.newPage({viewport:{width:1200,height:900}}),requested=[],errors=[];
  page.on('request',r=>{if(protectedPattern.test(new URL(r.url()).pathname))requested.push(new URL(r.url()).pathname);});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__prints=0;window.print=()=>window.__prints++;});
  await page.exposeFunction('__docContent',body=>{const latest=JSON.parse(fs.readFileSync(path.join(base,'output/private-challenge/latest.json'))),file=path.join(latest.out,'private/v1/documents',body.productKey+'.'+body.part+'.json');if(!allowed.includes(body.productKey)||!fs.existsSync(file))return {error:{message:'denied'}};const data=JSON.parse(fs.readFileSync(file));return {data:{verified:true,studentId:'11111111-1111-4111-8111-111111111111',approvedStudentName:'권한검수학생',validUntil:Date.now()+60000,contentVersion:data.contentVersion,document:data.document}};});
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==origin){await route.abort();return;}await route.continue();});
  await page.route('**/data.js',route=>route.fulfill({contentType:'text/javascript',body:'window.GFIELD_HF_DATA={students:[],studentCode:{},studentType:{},access:{}};'}));
  await page.route('**/supabase-config.js*',route=>route.fulfill({contentType:'text/javascript',body:'window.GFIELD_HF_SUPABASE_CONFIG={enabled:true};'}));
  await page.route('**/supabase-client.js',route=>route.fulfill({contentType:'text/javascript',body:`window.GFieldHFSupabase={enabled:()=>true,ready:async()=>({auth:{onAuthStateChange:fn=>window.__auth=fn},functions:{invoke:async(name,{body})=>name==='challenge-content'?window.__docContent(body):${denied?"({error:{message:'unauthorized'}})":`({data:{verified:true,studentId:'11111111-1111-4111-8111-111111111111',approvedStudentName:'권한검수학생',accountStatus:'active',permissionKeys:${JSON.stringify(allowed)},verifiedAt:Date.now(),validUntil:Date.now()+60000,deliveryReady:true,catalogVersion:'challenge-access-v1'}})`}}})};`}));
  await page.route('**/portal-auth.js*',route=>route.fulfill({contentType:'text/javascript',body:'window.GFieldHFPortalAuth={ready:async()=>null,canAccess:()=>false,current:()=>null,signOut:async()=>{}};'}));
  await page.goto(origin+url,{waitUntil:'load'});return {page,requested,errors};
 }
 try{
  for(const file of ['concepts.html','exam.html']){
   const f=await open('/challenge/'+file,[],true);await f.page.waitForTimeout(100);
   check(file+' unauthenticated no question scripts',f.requested.length===0,{scripts:f.requested});check(file+' unauthenticated empty content',await f.page.locator('main').innerText()==='');await f.page.close();
  }
  for(const [file,key,selector]of[['concepts.html','challenge-concept-2','.concept-page'],['exam.html','challenge-mock-2','.exam-page']]){
   const f=await open('/challenge/'+file+'?round=2',[key]);await f.page.waitForSelector(selector,{state:'attached',timeout:30000});
   check(file+' round 2 renders',await f.page.locator(selector).count()>0);
   check(file+' approved student name prints',await f.page.locator('body').innerText().then(text=>text.includes('권한검수학생')));
   if(file==='concepts.html'){
    const pages=await f.page.locator('.concept-page:not(.book-blank)').count(),marks=await f.page.locator('.concept-page:not(.book-blank) > .book-watermark span').count();
    check(file+' visible watermark on every printable page',marks===pages*3,{pages,marks});
   }else{
    const pages=await f.page.locator('.exam-page:not(.blank-page)').count(),marks=await f.page.locator('.exam-page:not(.blank-page) > .watermark span').count();
    check(file+' visible watermark on every printable page',marks===pages*3,{pages,marks});
   }
   check(file+' round 1 not rendered',file==='concepts.html'?await f.page.locator('.concept-page[data-round="1"]').count()===0:await f.page.locator('.exam-masthead h1').innerText().then(s=>s.includes('2회')));
   check(file+' only round 2 selectable',await f.page.locator('#round').evaluate(el=>[...el.options].filter(o=>!o.disabled).map(o=>o.value).join(',')==='2'));
   await f.page.screenshot({path:path.join(out,file.replace('.html','')+'-round2.png')});
   await f.page.emulateMedia({media:'print'});await f.page.pdf({path:path.join(out,file.replace('.html','')+'-round2.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
   await f.page.evaluate(()=>window.HFChallengeAccess.clear('expired'));
   check(file+' expiry clears document',await f.page.locator('main').innerHTML()==='');
   check(file+' expiry clears personal name',!(await f.page.locator('body').innerText()).includes('권한검수학생')&&await f.page.locator('input').evaluateAll(els=>els.every(el=>!el.value.includes('권한검수학생'))));
   check(file+' no JS errors',f.errors.length===0,{errors:f.errors});await f.page.close();
  }
  for(const [file,key,selector]of[['concepts.html','challenge-concept-2','.concept-page'],['exam.html','challenge-mock-2','.exam-page']]){
   const f=await open('/challenge/'+file,[key]);await f.page.waitForTimeout(80);
   await f.page.selectOption('#round','2');await f.page.waitForTimeout(300);
   check(file+' selecting approved round after denied default loads',await f.page.locator(selector).count()>0);await f.page.close();
  }
  for(const [file,key,selector,button]of[['concepts.html','challenge-concept-2','.concept-page','#print'],['exam.html','challenge-mock-2','.exam-page','#printExam']]){
   const f=await open('/challenge/'+file+'?round=2',[key]);await f.page.waitForSelector(selector,{state:'attached',timeout:30000});
   await f.page.evaluate(()=>{const real=Date.now;Date.now=()=>real()+61000;});
   await f.page.locator(button).click();check(file+' print rechecks expired permission before timer',await f.page.evaluate(()=>window.__prints===0));
   await f.page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));check(file+' browser print expiry strips content',await f.page.locator('main').innerHTML()==='');await f.page.close();
  }
  const landing=await open('/challenge/',['challenge-concept-2','challenge-mock-2']);await landing.page.waitForTimeout(80);
  await landing.page.screenshot({path:path.join(out,'landing-desktop.png')});await landing.page.setViewportSize({width:390,height:844});await landing.page.screenshot({path:path.join(out,'landing-mobile.png'),fullPage:true});check('landing mobile no horizontal overflow',await landing.page.evaluate(()=>document.documentElement.scrollWidth<=390));
  check('landing unapproved link disabled',await landing.page.locator('[data-access="challenge-concept-1"]').getAttribute('aria-disabled')==='true');await landing.page.locator('[data-access="challenge-concept-1"]').evaluate(el=>el.click());check('landing denied click does not navigate',landing.page.url()===origin+'/challenge/');
  check('landing approved round 2 enabled',await landing.page.locator('[data-access="challenge-mock-2"]').getAttribute('aria-disabled')==='false');await landing.page.evaluate(()=>window.HFChallengeAccess.clear('expired'));check('landing expiry disables all material links',await landing.page.locator('[data-access]').evaluateAll(els=>els.every(e=>e.getAttribute('aria-disabled')==='true')));await landing.page.close();
  const portal=await open('/');await portal.page.waitForTimeout(80);check('portal four program banners',await portal.page.locator('.program-banner').count()===4);await portal.page.screenshot({path:path.join(out,'portal-desktop.png')});await portal.page.setViewportSize({width:390,height:844});await portal.page.screenshot({path:path.join(out,'portal-mobile.png'),fullPage:true});await portal.page.screenshot({path:path.join(out,'portal-mobile-first.png')});check('portal mobile no horizontal overflow',await portal.page.evaluate(()=>document.documentElement.scrollWidth<=390));await portal.page.locator('.program-banner[data-product="mock"]').click();check('portal mock banner requires login',await portal.page.locator('#loginModal').isVisible());await portal.page.close();
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
 const report={passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,results,remoteCalls:0,limitation:'Mocked approval response. Static content delivery is not private or production-verified.'};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
