const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {stripTypeScriptTypes}=require('node:module');
const base=path.resolve(__dirname,'..'),catalog=require('../type-access-catalog.js');
let checks=0;function ok(v,label){assert.ok(v,label);checks++;}
const keys=catalog.keys(),key='hyperfocus-bank-q01',studentId='11111111-1111-4111-8111-111111111111',adminId='22222222-2222-4222-8222-222222222222';
const migration=fs.readFileSync(path.join(base,'supabase/migrations/20260909013000_hyperfocus_type_permission_catalog.sql'),'utf8');
const edgeSource=fs.readFileSync(path.join(base,'supabase/functions/hyperfocus-type-access/index.ts'),'utf8');
const edgeJs=stripTypeScriptTypes(edgeSource.replace(/^import .*\n/,''),{mode:'strip'}).replace('export async function handleRequest','async function handleRequest');
function clientHarness(options={}){
 let clock=Date.now(),auth=null,invokes=0;const events=[],timers=new Map();let nextTimer=1;
 const state={failure:false,data:{},...options};
 const context={module:{exports:{}},require:()=>catalog,location:{hostname:options.host||'example.com',search:options.search||''},URLSearchParams,Date:{now:()=>clock},HFAccessPolicy:{paidPracticeReady:()=>state.paidReady===true},setTimeout:(fn,delay)=>{const id=nextTimer++;timers.set(id,{fn,delay});return id;},clearTimeout:id=>timers.delete(id),CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail;}},dispatchEvent:e=>events.push(e),GFieldHFSupabase:{enabled:()=>state.enabled!==false,ready:async()=>({auth:{onAuthStateChange:fn=>{auth=fn;if(options.initialAuthEvent)fn('SIGNED_IN',{user:{id:studentId}});}},functions:{invoke:async()=>{invokes++;if(state.wait)await state.wait;return state.failure?{error:Error('offline')}:{data:{verified:true,studentId,approvedStudentName:'서버 이름',accountStatus:'active',permissionKeys:[],basePermissions:['hyperfocus'],verifiedAt:clock,validUntil:clock+60000,catalogVersion:catalog.version,...state.data}};}}})}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(base,'type-access.js'),'utf8'),context);
 return {api:context.module.exports,state,events,timers,advance:ms=>clock+=ms,auth:e=>auth(e),get invokes(){return invokes;}};
}
function edge(options={}){
 const now=Date.now(),claims={exp:Math.floor(now/1000)+3600,iat:Math.floor(now/1000),aal:'aal2',session_id:'live',app_metadata:{hf_role:options.role||'admin'},...options.claims};
 const token='x.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.y';let mutationCalls=[],authCalls=0;
 const role=options.role||'admin';const user={id:role==='student'?studentId:adminId,is_anonymous:false,app_metadata:{hf_role:role},...options.user};
 function clientFactory(url,k){const service=k==='secret';return {auth:{getUser:async()=>{authCalls++;return {data:{user:options.authFailure?null:user},error:options.authFailure?new Error('invalid'):null};}},from(table){let eq={};const query={select(){return query;},eq(k,v){eq[k]=v;return query;},maybeSingle:async()=>{
  if(table==='hf_admin_accounts'){const valid=claims.aal==='aal2'&&claims.session_id==='live'&&options.staffVisible!==false;return {data:valid?{role:'admin',account_status:'active',authorization_changed_at:new Date(now-100000).toISOString(),...options.staff}:null,error:null};}
  if(table==='hf_students')return {data:options.studentMissing||(!service&&options.profileVisible===false)?null:{id:eq.id||studentId,display_name:'검수용 학생',account_status:options.studentStatus||'active'},error:null};
  if(table==='hf_permission_catalog')return {data:options.catalogMissing?null:{permission_key:eq.permission_key},error:null};
  throw Error(table);
 },then(resolve){if(table!=='hf_entitlements')throw Error(table);const entries=options.entries||[{permission_key:key,starts_at:new Date(now-1000).toISOString(),expires_at:null,revoked_at:null}];return Promise.resolve({data:entries,error:options.entitlementError?new Error('down'):null}).then(resolve);}};return query;},rpc:async(name,args)=>{mutationCalls.push({name,args});return {data:!options.rpcFailure,error:null};}};}
 const context={Request,Response,TextDecoder,Uint8Array,atob,Date,Set,JSON,console,createClient:clientFactory,Deno:{env:{get:k=>({SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'public',SUPABASE_SECRET_KEY:'secret',CHALLENGE_PRIVATE_DELIVERY_READY:options.ready?'true':'false'})[k]},serve:fn=>context.handler=fn}};
 vm.createContext(context);vm.runInContext(edgeJs,context);
 async function request(body,headers={}){return context.handler(new Request('https://example/challenge-access',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json',...headers},body:JSON.stringify(body)}));}
 return {request,mutationCalls,get authCalls(){return authCalls;}};
}
async function browserAudit(){
 const {chromium}=require('playwright'),http=require('node:http');
 const out=path.join(base,'output/qa/hyperfocus-type-access');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{const file=path.resolve(base,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}const ext=path.extname(file);res.setHeader('content-type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'})[ext]||'application/octet-stream');res.end(data);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const b=await chromium.launch();
 try{
  const page=await b.newPage({viewport:{width:1200,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/supabase-config.js',route=>route.fulfill({contentType:'text/javascript',body:'window.GFIELD_HF_SUPABASE_CONFIG={enabled:true};'}));
  await page.route('**/supabase-client.js',route=>route.fulfill({contentType:'text/javascript',body:`window.__calls=[];window.__fail=false;window.__failureKey=null;window.GFieldHFSupabase={enabled:()=>true,ready:async()=>({auth:{onAuthStateChange:fn=>window.__authChange=fn,getSession:async()=>({data:{session:{expires_at:Date.now()/1000+3600}}})},functions:{invoke:async(name,{body})=>{window.__calls.push({name,body});if(window.__fail||body.permissionKey===window.__failureKey)return{error:{message:'offline'}};return name==='admin-students'?{data:{students:[{id:'${studentId}',name:'검수용 학생 가',status:'active',permissions:['hyperfocus','${key}']},{id:'${adminId}',name:'검수용 학생 나',status:'active',permissions:[]}]}}:{data:{ok:true,studentId:body.studentId,permissionKey:body.permissionKey,enabled:body.enabled}};}}})};`}));
  await page.goto(`http://127.0.0.1:${server.address().port}/type-admin.html`);
  ok(await page.locator('#permissions').isHidden(),'admin initially no student data');ok(await page.evaluate(()=>window.__calls.length)===0,'no automatic network or write');
  await page.click('#reload');await page.selectOption('#student',studentId);ok(await page.locator('#bank-options input').count()===54,'admin 54 type options');
  await page.screenshot({path:path.join(out,'admin-desktop.png')});
  ok(!await page.locator('#individual-mode').isChecked(),'legacy mode remains');
  await page.locator('input[data-key="hyperfocus-bank-q02"]').check();await page.fill('#type-search','주사위');ok(await page.locator('#bank-options input').count()===2,'actual type search');await page.fill('#type-search','');ok(await page.locator('input[data-key="hyperfocus-bank-q02"]').isChecked(),'filtered selection preserved');
  await page.click('#save');let writes=await page.evaluate(()=>window.__calls.filter(c=>c.name==='hyperfocus-type-access'));ok(writes.length===1&&writes[0].body.permissionKey==='hyperfocus-bank-q02','only changed type saved');ok(!await page.locator('#individual-mode').isChecked(),'grant alone not mode switch');
  await page.locator('#individual-mode').check();await page.locator('input[data-key="hyperfocus-bank-q03"]').check();await page.click('#save');writes=await page.evaluate(()=>window.__calls.filter(c=>c.name==='hyperfocus-type-access'));ok(writes.length===3&&writes[1].body.permissionKey==='hyperfocus-bank-q03'&&writes[2].body.permissionKey===catalog.modeKey,'explicit mode saved last');ok(!writes.some(w=>w.body.permissionKey==='hyperfocus'),'base grant untouched');
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'admin-mobile.png')});
  ok(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'390px no horizontal overflow');await page.locator('#type-search').scrollIntoViewIfNeeded();await page.locator('#type-search').focus();await page.screenshot({path:path.join(out,'admin-mobile-types.png')});
  ok(await page.locator('#type-search').evaluate(e=>getComputedStyle(e).fontSize)==='16px','mobile input size');
  await page.locator('input[data-key="hyperfocus-bank-q04"]').check();await page.locator('input[data-key="hyperfocus-bank-q05"]').check();await page.evaluate(()=>window.__failureKey='hyperfocus-bank-q05');await page.click('#save');ok(await page.locator('#change-count').textContent()==='1개 항목 변경','partial save preserves only unsaved change');
  await page.evaluate(()=>window.__authChange('SIGNED_OUT'));ok(await page.locator('#permissions').isHidden()&&await page.locator('#student option').count()===1,'logout removes students and permissions');
  await page.evaluate(()=>window.__fail=true);await page.click('#reload');ok(await page.locator('#permissions').isHidden(),'failure no previous student');ok(errors.length===0,'admin JS errors zero');
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({viewport:[1200,390],horizontalOverflow:false,errors,server:'mocked; no real students or writes'},null,2));
 }finally{await b.close();await new Promise(resolve=>server.close(resolve));}
}

(async()=>{
 ok(keys.length===55&&new Set(keys).size===55,'54 + explicit mode key');
 for(const k of keys){ok(migration.includes("'"+k+"'"),'migration parity '+k);ok(edgeSource.includes('"'+k+'"'),'server parity '+k);}
 for(const invalid of [0,55,-1,1.2,null,undefined,true,[],{},'1e0','0x1','q01','*'])ok(catalog.keyFor(invalid)===null,'invalid type');
 ok(!/insert into public\.hf_entitlements|delete from|drop |alter table|update public/i.test(migration),'additive catalog no student mutation');
 const set={action:'set',studentId,permissionKey:key,enabled:true};
 for(const [label,opts,body,headers,status]of [
 ['no bearer',{},set,{authorization:''},401],['bad token',{authFailure:true},set,{},401],['expired',{claims:{exp:1}},set,{},401],['anonymous',{user:{is_anonymous:true}},set,{},401],
 ['student writes',{role:'student'},set,{},403],['metadata forged',{role:'student',user:{user_metadata:{hf_role:'admin'}}},set,{},403],['MFA',{claims:{aal:'aal1'}},set,{},403],
 ['RLS revoked session',{claims:{session_id:'revoked'}},set,{},403],['inactive admin',{staff:{account_status:'suspended'}},set,{},403],['stale admin',{claims:{iat:1}},set,{},403],
 ['admin role removed',{staffVisible:false},set,{},403],['unknown type',{}, {...set,permissionKey:'hyperfocus-bank-q55'},{},400],['wildcard',{}, {...set,permissionKey:'*'},{},400],
 ['base grant not allowed',{}, {...set,permissionKey:'hyperfocus'},{},400],['challenge grant denied',{}, {...set,permissionKey:'challenge-mock-1'},{},400],
 ['extra field',{}, {...set,mode:true},{},400],['invalid target',{}, {...set,studentId:'123'},{},400],['string enabled',{}, {...set,enabled:'true'},{},400],
 ['cross origin',{},set,{origin:'https://attacker.example'},403],['no target',{studentMissing:true},set,{},404],['inactive target',{studentStatus:'suspended'},set,{},409],
 ['catalog absent',{catalogMissing:true},set,{},503],['self other target',{role:'student'},{action:'self',studentId:adminId},{},403],['inactive profile',{role:'student',profileVisible:false},{action:'self'},{},403],
 ['entitlements unavailable',{role:'student',entitlementError:true},{action:'self'},{},503]
 ]){const f=edge(opts),r=await f.request(body,headers);ok(r.status===status,label);ok(f.mutationCalls.length===0,label+' no writes');}
 for(const k of [key,catalog.modeKey]){const f=edge();ok((await f.request({...set,permissionKey:k})).status===200,'valid explicit key');ok(f.mutationCalls.length===1&&f.mutationCalls[0].args.p_granted_by===adminId,'only requested RPC');}
 const now=Date.now(),row=k=>({permission_key:k,starts_at:new Date(now-1000).toISOString(),expires_at:null,revoked_at:null});
 const self=edge({role:'student',entries:[row('hyperfocus'),row(key),row(catalog.modeKey),row('challenge-mock-1'),{...row('hyperfocus-bank-q02'),expires_at:new Date(now-1).toISOString()}]});
 const reply=await(await self.request({action:'self'})).json();ok(reply.basePermissions.join(',')==='hyperfocus','base grants separately verified');ok(reply.permissionKeys.length===2&&reply.approvedStudentName==='검수용 학생','filtered types + server identity');ok(self.mutationCalls.length===0,'self read only');
 const initialSignIn=clientHarness({initialAuthEvent:true});await initialSignIn.api.ready();ok(initialSignIn.api.allowType(1),'initial SIGNED_IN callback does not cancel first verification');
 const f=clientHarness();ok(!f.api.allowType(1),'unknown state denied');await f.api.ready();for(let i=1;i<=54;i++)ok(f.api.allowType(i),'legacy unchanged '+i);ok(f.api.status().mode==='legacy','verified legacy');ok(!f.api.allowType(1,{paid:true}),'paid requires prior paid grant');
 f.state.data={basePermissions:['hyperfocus','hyperfocus-extra']};await f.api.refresh();ok(!f.api.allowType(1,{paid:true}),'paid delivery gate remains');f.state.paidReady=true;ok(f.api.allowType(1,{paid:true}),'paid original gate allows');
 f.state.data.permissionKeys=[catalog.modeKey,key];await f.api.refresh();ok(f.api.status().mode==='individual'&&f.api.allowType(1)&&!f.api.allowType(2),'individual allows exact type only');ok(f.api.approvedStudentName()==='서버 이름','approved identity');const name=f.api.watermarkIdentity();name.name='forged';ok(f.api.approvedStudentName()==='서버 이름','identity copy');
 const eventCount=f.events.length;f.advance(45000);await f.api.refresh();ok(f.events.length===eventCount&&f.api.allowType(1),'same fresh refresh preserves view');ok([...f.timers.values()].some(t=>t.delay===45000),'background refresh before expiry');
 const tokenEvents=f.events.length;f.auth('TOKEN_REFRESHED');ok(f.api.allowType(1),'normal token refresh keeps fresh view');await new Promise(r=>setImmediate(r));ok(f.events.length===tokenEvents&&f.api.allowType(1),'same identity token refresh emits no clear');
 const oldLease=[...f.timers.values()].find(t=>t.delay===60000);await f.api.refresh();oldLease.fn();ok(f.api.allowType(1),'old lease callback cannot expire renewed state');
 f.state.data.approvedStudentName='갱신된 서버 이름';f.auth('TOKEN_REFRESHED');await new Promise(r=>setImmediate(r));ok(f.events.length>tokenEvents&&f.api.approvedStudentName()==='갱신된 서버 이름','identity change notifies consumers to clear old view');
 f.state.failure=true;f.auth('TOKEN_REFRESHED');await new Promise(r=>setImmediate(r));ok(!f.api.allowType(1)&&!f.api.watermarkIdentity(),'failed token renewal clears');f.state.failure=false;await f.api.refresh();
 let release;f.state.wait=new Promise(r=>release=r);const pending=f.api.refresh();ok(f.api.allowType(1),'fresh while renewal pending');release();await pending;delete f.state.wait;
 f.state.failure=true;await f.api.refresh();ok(!f.api.allowType(1)&&f.api.watermarkIdentity()===null,'failed renewal clears');f.state.failure=false;await f.api.refresh();f.auth('SIGNED_OUT');ok(!f.api.allowType(1)&&f.api.watermarkIdentity()===null,'logout clear');
 const expired=clientHarness();await expired.api.ready();expired.advance(60001);ok(!expired.api.allowType(1)&&expired.api.watermarkIdentity()===null,'expiry deny even before timer');
 const delayed=clientHarness();await delayed.api.ready();let complete;delayed.state.wait=new Promise(r=>complete=r);const renewal=delayed.api.refresh();delayed.advance(60001);complete();await renewal;ok(!delayed.api.allowType(1)&&!delayed.api.watermarkIdentity(),'late renewal cannot revive elapsed lease when expiry timer delayed');
 for(const data of [{verified:false},{basePermissions:['*']},{permissionKeys:['hyperfocus-bank-q55']},{validUntil:1},{accountStatus:'suspended'},{studentId:''},{approvedStudentName:''}]){const h=clientHarness({data});await h.api.ready();ok(!h.api.allowType(1),'malformed server response deny');}
 const revoked=clientHarness();await revoked.api.ready();revoked.state.data.basePermissions=[];await revoked.api.refresh();ok(!revoked.api.allowType(1)&&!revoked.api.watermarkIdentity(),'base revoked blocks');
 const race=clientHarness();let unlock;race.state.wait=new Promise(r=>unlock=r);const racing=race.api.ready();await new Promise(r=>setImmediate(r));race.auth('SIGNED_OUT');unlock();await racing;ok(!race.api.allowType(1),'late prelogout response rejected');
 const local=clientHarness({host:'localhost',search:'?teacherPreview=1&name=forged'});await local.api.ready();ok(local.api.allowType(54)&&local.invokes===0&&!local.api.watermarkIdentity(),'explicit localhost preview no false identity');
 const forged=clientHarness({search:'?teacherPreview=1',enabled:false});await forged.api.ready();ok(!forged.api.allowType(1),'production query cannot bypass');
 if(process.argv.includes('--browser'))await browserAudit();
 console.log(JSON.stringify({status:'passed',checks,permissionKeys:55,remoteWrites:0,release:'held; separate private practice contract exists, hosting and production delivery unverified',authorization:'actual server source; mocked Auth/DB, live RLS not tested'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
