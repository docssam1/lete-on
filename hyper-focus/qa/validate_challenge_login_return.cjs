'use strict';
// Mocked authentication UI only: no real account, student row, grant or external request.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=path.resolve(__dirname,'..'),out=path.join(base,'output/qa/challenge-login-return');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8'),defaultTitle=html.match(/id="loginTitle"[^>]*>([^<]+)</)[1];
const student={role:'student',name:'로컬 검수 학생',permissions:[]},admin={role:'admin',name:'로컬 검수 관리자',permissions:[]};
const server=http.createServer((req,res)=>{let pathname=new URL(req.url,'http://local').pathname;if(pathname.endsWith('/'))pathname+='index.html';const target=path.resolve(base,'.'+pathname.replace(/^\/hyper-focus/,''));if(!target.startsWith(base+path.sep)){res.writeHead(403).end();return;}fs.readFile(target,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('content-type',({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'})[path.extname(target)]||'application/octet-stream');res.end(data);});});
(async()=>{fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch();let checks=0,cases=0;const external=[],errors=[];
async function open(query,{ready=null,result=student,width=1280,pending=false}={}){
 const page=await browser.newPage({viewport:{width,height:950}});page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin!==origin){external.push(url.href);return route.abort();}
  if(['/hyper-focus/challenge/','/hyper-focus/challenge/studio.html','/hyper-focus/admin.html'].includes(url.pathname))return route.fulfill({contentType:'text/html; charset=utf-8',body:`<!doctype html><html lang="ko"><title>검수용 이동 확인</title><main>${url.pathname}</main></html>`});
  if(url.pathname==='/hyper-focus/data.js')return route.fulfill({contentType:'application/javascript',body:'window.GFIELD_HF_DATA={students:[],studentCode:{},studentType:{},access:{}};'});
  if(url.pathname==='/hyper-focus/supabase-config.js')return route.fulfill({contentType:'application/javascript',body:'window.GFIELD_HF_SUPABASE_CONFIG={enabled:false,features:{secureMockDelivery:false}};'});
  if(url.pathname==='/hyper-focus/portal-auth.js')return route.fulfill({contentType:'application/javascript',body:`window.__authCalls=[];window.__loginResult=${JSON.stringify(result)};window.GFieldHFPortalAuth={ready:()=>${pending?'new Promise(resolve=>window.__resolveReady=resolve)':`Promise.resolve(${JSON.stringify(ready)})`},signIn:async(name,code)=>{window.__authCalls.push({name,code});return window.__loginResult;},signOut:async()=>{},canAccess:()=>false};`});
  return route.continue();
 });await page.goto(origin+'/hyper-focus/'+query);return page;
}
async function submit(page){await page.locator('#loginName').fill('로컬 검수 학생');await page.locator('#loginCode').fill('GF0000');await page.locator('#loginForm button[type=submit]').click();}
try{
 for(const width of [1280,390]){
  const page=await open('?login=1&next=challenge',{result:null,width});await page.locator('#loginModal.visible').waitFor();assert.equal(await page.locator('#loginTitle').innerText(),'챌린지 학습 로그인');checks++;
  await page.locator('#loginForm button[type=submit]').click();assert.equal(await page.evaluate(()=>__authCalls.length),0);assert((await page.locator('#loginError').innerText()).includes('모두 입력'));checks+=2;
  await submit(page);await page.waitForFunction(()=>document.querySelector('#loginError').textContent.includes('일치하지'));assert(await page.locator('#loginModal').isVisible());assert.equal(new URL(page.url()).pathname,'/hyper-focus/');assert.equal(await page.evaluate(()=>__authCalls.length),1);checks+=3;
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Login overflow');checks++;await page.screenshot({path:path.join(out,`failed-login-${width}.png`),fullPage:true});
  await page.evaluate(s=>window.__loginResult=s,student);await submit(page);await page.waitForURL(origin+'/hyper-focus/challenge/');assert.equal(new URL(page.url()).search,'');checks++;await page.close();cases++;
 }
 {
  const page=await open('?login=1&next=challenge',{pending:true});await page.waitForFunction(()=>!!window.__resolveReady);assert.equal(new URL(page.url()).pathname,'/hyper-focus/');assert.equal(await page.evaluate(()=>__authCalls.length),0);checks+=2;
  await page.evaluate(s=>window.__resolveReady(s),student);await page.waitForURL(origin+'/hyper-focus/challenge/');checks++;await page.close();cases++;
 }
 {
  const page=await open('?login=1&next=challenge-bank',{result:student});await page.locator('#loginModal.visible').waitFor();await submit(page);await page.waitForURL(origin+'/hyper-focus/challenge/studio.html?tab=bank');assert.equal(new URL(page.url()).search,'?tab=bank');checks+=2;await page.close();cases++;
 }
 {
  const page=await open('?login=1&next=challenge',{result:admin});await page.locator('#loginModal.visible').waitFor();await submit(page);await page.waitForURL(origin+'/hyper-focus/admin.html');checks++;await page.close();cases++;
 }
 {
  const page=await open('?login=1&next=challenge',{ready:admin});await page.locator('#libraryHome:not([hidden])').waitFor();assert.equal(new URL(page.url()).pathname,'/hyper-focus/');assert.equal(await page.locator('#memberType').innerText(),'관리자');checks+=2;await page.close();cases++;
 }
 const invalid=['?login=1','?login=1&next=https%3A%2F%2Fevil.invalid%2F','?login=1&next=%2F%2Fevil.invalid','?login=1&next=javascript%3Aalert(1)','?login=1&next=challenge%2F','?login=1&next=..%2Fchallenge','?login=1&next=Challenge','?login=1&next=%20challenge','?login=1&next=challenge%20','?login=1&next=challenge&next=https%3A%2F%2Fevil.invalid','?login=1&next=challenge&next=challenge','?login=1&returnTo=https%3A%2F%2Fevil.invalid','?login=1&next=%2563hallenge'];
 for(const query of invalid){const page=await open(query);await page.locator('#loginModal.visible').waitFor();assert.equal(await page.locator('#loginTitle').innerText(),defaultTitle);await submit(page);await page.locator('#libraryHome:not([hidden])').waitFor();await page.locator('#loginModal').waitFor({state:'hidden'});assert.equal(new URL(page.url()).pathname,'/hyper-focus/');assert.equal(new URL(page.url()).origin,origin);checks+=3;await page.close();cases++;}
 {
  const page=await open('?login=1&next=challenge&returnTo=https%3A%2F%2Fevil.invalid',{ready:student});await page.waitForURL(origin+'/hyper-focus/challenge/');checks++;await page.close();cases++;
 }
 {
  const page=await open('?login=1',{ready:student});await page.locator('#libraryHome:not([hidden])').waitFor();assert.equal(new URL(page.url()).pathname,'/hyper-focus/');assert(await page.locator('#loginModal').isHidden());checks+=2;await page.close();cases++;
 }
 assert.deepEqual(errors,[]);assert(external.every(url=>['fonts.googleapis.com','fonts.gstatic.com','raw.githubusercontent.com'].includes(new URL(url).hostname)),'Unexpected external navigation/request');checks+=2;
 const report={status:'PASS',checks,cases,defaultTitle,acceptedDestination:'./challenge/',acceptedBankDestination:'./challenge/studio.html?tab=bank',adminLoginDestination:'./admin.html',restoredAdminPreservesExistingRoot:true,externalFontRequestsBlocked:external.length,realStudentReads:0,remoteWrites:0};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));}})().catch(error=>{console.error(error);process.exitCode=1;});
