import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const reportSource=readFileSync(new URL('../report-access.js',import.meta.url),'utf8');
const token='a'.repeat(43),rotated='b'.repeat(43),KEY='gfield_hf_report_session_v1';
const uuid='11111111-1111-4111-8111-111111111111';
const claims=()=>({role:'student',backend:'hs-report',userId:uuid,name:'검수 학생',permissions:['hyperfocus'],expiresAt:new Date(Date.now()+3500000).toISOString()});
function setup({handoff=token,stored='',response,fetcher}={}){
 const storage=new Map(stored?[[KEY,stored]]:[]),events=[];
 const root={location:{hash:handoff===null?'':'#hs_handoff='+handoff,href:'https://lete-on.gfieldacademy.net/hyper-focus/'+(handoff===null?'':'#hs_handoff='+handoff)},history:{replaceState(_a,_b,url){events.push(['clean',url])}},sessionStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},alert:()=>events.push(['alert']),fetch:fetcher|| (async(_url,opts)=>{events.push(['fetch',JSON.parse(opts.body)]);return response||{ok:true,json:async()=>({session:claims(),sessionToken:rotated})}})};
 vm.runInNewContext(reportSource,{window:root,URL,URLSearchParams,Date,Object,Array,Number,Error});
 return{api:root.GFieldHFReportAccess,storage,events,root};
}
test('consumes once, strips fragment, stores only rotated token',async()=>{const s=setup();const [a,b]=await Promise.all([s.api.ready(),s.api.ready()]);assert.equal(a.userId,uuid);assert.equal(b.backend,'hs-report');assert.equal(s.events.filter(e=>e[0]==='fetch').length,1);assert.equal(s.events[0][0],'clean');assert.equal(s.storage.get(KEY),rotated);assert.equal(a.permissions.join(','),'hyperfocus')});
test('server-supplied extra paid scope is rejected',async()=>{const s=setup({response:{ok:true,json:async()=>({session:{...claims(),permissions:['hyperfocus','mock']},sessionToken:rotated})}});assert.equal(await s.api.ready(),null);assert.equal(s.storage.has(KEY),false)});
test('resume failure stays in report mode rather than falling back to unrelated HF login',async()=>{const s=setup({handoff:null,stored:rotated,response:{ok:false,json:async()=>({error:'expired'})}});assert.equal(await s.api.ready(),null);assert.equal(s.api.active(),true);assert.equal(await s.api.ready(),null);assert.equal(s.storage.has(KEY),false)});
test('clear during in-flight verification cannot resurrect report session',async()=>{let resolve;const gate=new Promise(r=>{resolve=r});const s=setup({fetcher:()=>gate});const running=s.api.ready();s.api.clear();resolve({ok:true,json:async()=>({session:claims(),sessionToken:rotated})});await running;assert.equal(s.api.active(),false);assert.equal(s.api.current(),null);assert.equal(s.storage.has(KEY),false)});
test('name-only navigation cannot activate report access',()=>{const s=setup({handoff:null});assert.equal(s.api.active(),false);assert.equal(s.api.current(),null)});
test('report diagnosis uses separate UUID history and never legacy auto-import',()=>{const text=readFileSync(new URL('../diagnosis.html',import.meta.url),'utf8');assert.match(text,/currentBackend==='hs-report'\?`gfield_hf_report_\$\{currentUserId\}`/);assert.match(text,/!Array\.isArray\(stored\)&&currentBackend==='legacy'/);assert.match(text,/currentBackend==='hs-report'&&.*GFieldHFPortalAuth\.ready/)});

import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
test('browser report path opens diagnosis while practice remains held and exam denied',{skip:process.env.HF_BROWSER_REVIEW!=='1'},async()=>{
 const {chromium}=require('playwright');
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
 const server=createServer((req,res)=>{try{const filename=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));res.setHeader('Content-Type',mime[path.extname(filename)]||'application/octet-stream');res.end(readFileSync(filename));}catch{res.writeHead(404);res.end('not found');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  const context=await browser.newContext();
  await context.addInitScript(({key,value})=>{sessionStorage.setItem(key,value);window.Chart=class {constructor(){this.data={}}destroy(){}update(){}};},{key:KEY,value:rotated});
  await context.route('https://**/*',async route=>{
   if(route.request().url().includes('/functions/v1/hs-parent-auth?scope=hyperfocus'))await route.fulfill({json:{session:claims()}});else await route.abort();
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base=`http://127.0.0.1:${server.address().port}`;
  await page.goto(base+'/hyper-focus/diagnosis.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('page2').style.display==='block');
  assert.match(await page.locator('#studentInfoDisplay').innerText(),/황소 리포트 연결/);
  assert.equal(await page.evaluate(()=>typeof downloadBook), 'function');
  assert.equal(await page.evaluate(()=>typeof downloadAnswerPdf), 'function');
  await page.evaluate(async()=>{selectedSet.add(1);await renderSimilarUI();});
  await page.evaluate(()=>createSelectedWorksheet());
  assert.match(await page.locator('#worksheet-build-status').innerText(),/검수 대기/);
  await page.goto(base+'/hyper-focus/mock/viewer.html?mode=practice&types=1&count=2&seed=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.body.innerText.includes('비공개 서버 전달 검수 중'));
  assert.equal(await page.locator('.question').count(),0);
  await page.goto(base+'/hyper-focus/mock/viewer.html?mode=exam&exam=premier-final-01',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.body.innerText.includes('모의고사는 별도 승인') || document.body.innerText.includes('모의고사 승인은 별도입니다.'),{timeout:10000});
  assert.equal(await page.locator('.question').count(),0);
  assert.deepEqual(errors,[]);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
});

const loaderSource=readFileSync(new URL('../mock/secure-practice-loader.js',import.meta.url),'utf8');
async function loader(query,valid=true){
 const scripts=[],nodes=[];
 const node=()=>({append(...x){nodes.push(...x)},replaceChildren(){},setAttribute(){},hidden:false,disabled:false});
 const root={location:{search:query,hostname:'lete-on.gfieldacademy.net'},GFieldHFReportAccess:{active:()=>true,ready:async()=>valid?claims():null},document:{getElementById:node,querySelector:node,createElement:()=>node(),head:{append(script){scripts.push(script.src);queueMicrotask(()=>script.onload());}}}};
 vm.runInNewContext(loaderSource,{window:root,URLSearchParams,Number,String,Array,Object,Error});
 await root.HFPracticeBootstrap.ready;return{api:root.HFPracticeBootstrap,scripts,nodes};
}
test('approved report session does not bypass the held secure-practice delivery gate',async()=>{const s=await loader('?mode=practice&types=1&count=2');assert.equal(s.api.remotePractice,true);assert.equal(s.scripts.length,0);assert.ok(s.nodes.some(n=>String(n.textContent).includes('비공개 서버 전달 검수 중')))});
test('held delivery rejects free, paid, excess-count and invalid-session requests without exposing renderer',async()=>{for(const [query,valid] of [['?mode=practice&count=3',true],['?mode=practice&count=2&tier=paid',true],['?mode=practice&count=2&accessTier=paid',true],['?mode=practice&count=2',false]]){const s=await loader(query,valid);assert.equal(s.api.remotePractice,true);assert.equal(s.scripts.length,0)}});
test('diagnosis explicitly retains report practice hold and viewer denies report exam mode',()=>{const diagnosis=readFileSync(new URL('../diagnosis.html',import.meta.url),'utf8'),viewer=readFileSync(new URL('../mock/viewer.html',import.meta.url),'utf8');assert.match(diagnosis,/currentBackend==='hs-report'&&window.GFIELD_HF_SUPABASE_CONFIG\?\.features\?\.securePracticeDelivery!==true/);assert.match(viewer,/if\(reportMode&&mode!=='practice'\)/);assert.ok(!loaderSource.includes('reportPractice=true'))});
const typeSource=readFileSync(new URL('../type-access.js',import.meta.url),'utf8');
const catalogSource=readFileSync(new URL('../type-access-catalog.js',import.meta.url),'utf8');
const portalSource=readFileSync(new URL('../portal-auth.js',import.meta.url),'utf8');
test('verified report type access exposes only basic, not paid or existing HF client',async()=>{
 const s=setup();let reads=0;
 s.root.setTimeout=()=>1;s.root.clearTimeout=()=>{};s.root.HFAccessPolicy={paidPracticeReady:()=>true};
 s.root.GFieldHFSupabase={enabled:()=>true,ready:()=>{reads++;throw new Error('must not access separate HF credentials')}};
 const context=vm.createContext({window:s.root,URL,URLSearchParams,Date,Object,Array,Number,Error,Set,console,sessionStorage:s.root.sessionStorage});
 vm.runInContext(portalSource,context);vm.runInContext(catalogSource,context);vm.runInContext(typeSource,context);
 const session=await s.root.GFieldHFPortalAuth.ready();assert.equal(session.backend,'hs-report');assert.equal(s.root.GFieldHFPortalAuth.canAccess(session,'mock'),false);assert.equal(await s.root.GFieldHFPortalAuth.client(),null);
 const status=await s.root.HFTypeAccess.ready();assert.equal(status.hasBaseAccess,true);assert.equal(status.hasPaidAccess,false);
 for(const id of [1,21,23,54]){assert.equal(s.root.HFTypeAccess.allowType(id),true);assert.equal(s.root.HFTypeAccess.allowType(id,{paid:true}),false)}
 assert.equal(s.root.HFTypeAccess.watermarkIdentity().studentId,uuid);assert.equal(reads,0);
 s.root.fetch=async()=>({ok:false,json:async()=>({error:'REVOKED'})});
 await s.root.HFTypeAccess.refresh();assert.equal(s.root.HFTypeAccess.status().verified,false);assert.equal(s.root.HFTypeAccess.allowType(1),false);assert.equal(s.root.GFieldHFReportAccess.active(),true);assert.equal(await s.root.GFieldHFPortalAuth.ready(),null);assert.equal(reads,0);
});
