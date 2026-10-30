import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler,cleanProfile,cleanConsent,validPin,CONSENT_VERSION} from './handler.mjs';
const NOW=Date.parse('2026-10-30T12:00:00Z'),UID='11111111-2222-4333-8444-555555555555';
const M={user_id:UID,email:'guardian@example.invalid',student_name:'샘플 학생',guardian_phone:'01000000000',school:'elementary',age:null,grade:5,session_version:2,privacy_version:CONSENT_VERSION,marketing_email:false,marketing_sms:false};
function harness(options={}){
 const calls=[];
 const user={id:UID,email:M.email,email_confirmed_at:'2026-10-30',app_metadata:{role:'user'},...options.user};
 const service={auth:{getUser:async token=>({data:{user:options.noUser?null:user},error:null})},
  rpc:async(name,args)=>{calls.push({name,args});if(name==='roadmap_take_attempt')return {data:options.limited?false:true};if(name==='roadmap_verify_pin')return {data:options.badPin?null:UID};return {data:null};},
  from(table){let action='select';const q={select(columns){calls.push({table,columns});return q;},eq(){return q;},gt(){return q;},lt(){return q;},order(){return q;},range(){return q;},limit(){return q;},or(){return q;},delete(){action='delete';return q;},insert(value){calls.push({table,insert:value});return q;},
   async maybeSingle(){if(table==='roadmap_sessions')return {data:options.noSession?null:{user_id:UID,session_version:options.stale?1:2}};if(table==='hs_accounts')return {data:options.admin?{role:'admin',active:true,student:'DOCSSAM'}:{role:'student',active:true,student:'X'}};return {data:options.noMember?null:M};},
   then(resolve,reject){return Promise.resolve({data:table==='roadmap_members'?[M]:[],count:1,error:null}).then(resolve,reject);}};return q;}};
 const handler=createHandler({service,url:'https://example.invalid',publicKey:'public',rateSecret:'test-secret',now:()=>NOW,send:async()=>{calls.push({mail:true});return new Response('{}');}});
 async function request(body,headers={}){const r=await handler(new Request('https://example.invalid',{method:'POST',headers:{'content-type':'application/json',origin:'https://lete-on.gfieldacademy.net',...headers},body:JSON.stringify(body)}));return {status:r.status,data:await r.json(),headers:r.headers};}
 return {calls,request,handler};
}
const jwt=(method='otp',seconds=NOW/1000)=>'h.'+Buffer.from(JSON.stringify({sub:UID,amr:[{method,timestamp:seconds}]})).toString('base64url')+'.s';
const profile={studentName:' 샘플 학생 ',guardianPhone:'010-0000-0000',school:'elementary',grade:5};
test('profile validates actual grade ranges, normalizes contact and rejects injection',()=>{
 assert.equal(cleanProfile(profile).guardianPhone,'01000000000');assert.equal(cleanProfile(profile).age,null);
 assert.throws(()=>cleanProfile({...profile,school:'middle',grade:6}));assert.throws(()=>cleanProfile({...profile,studentName:'<img>'}));
 assert.throws(()=>cleanProfile({...profile,school:'preschool',age:2}));assert.throws(()=>cleanProfile({...profile,guardianPhone:'bad'}));
});
test('required consents cannot be bypassed; optional marketing defaults off',()=>{
 assert.throws(()=>cleanConsent({version:CONSENT_VERSION,privacy:true}));
 assert.throws(()=>cleanConsent({version:'old',privacy:true,guardian:true}));
 assert.equal(cleanConsent({version:CONSENT_VERSION,privacy:true,guardian:true}).marketing_email,false);
});
test('PIN accepts 8–12 digits and rejects trivial values',()=>{assert.equal(validPin('58294716'),true);for(const s of ['1234','12345678','99999999','password123','1234567890123'])assert.equal(validPin(s),false);});
test('unverified request and arbitrary local token cannot access membership',async()=>{
 const h=harness({noSession:true});assert.equal((await h.request({action:'status'})).status,401);
 assert.equal((await h.request({action:'status'},{'x-roadmap-session':'a'.repeat(64)})).status,401);
});
test('rotated or expired session is rejected, not trusted from local storage',async()=>{
 assert.equal((await harness({stale:true}).request({action:'status'},{'x-roadmap-session':'a'.repeat(64)})).status,401);
});
test('password session cannot register or reset a roadmap PIN',async()=>{
 const h=harness();const r=await h.request({action:'reset-pin',pin:'58294716'},{authorization:'Bearer '+jwt('password')});
 assert.equal(r.status,401);assert.equal(h.calls.some(x=>x.name==='roadmap_rotate_pin'),false);
});
test('OTP older than ten minutes cannot reset PIN',async()=>{
 assert.equal((await harness().request({action:'reset-pin',pin:'58294716'},{authorization:'Bearer '+jwt('otp',NOW/1000-601)})).status,401);
});
test('registration derives owner from verified identity, does not accept request owner',async()=>{
 const h=harness();const r=await h.request({action:'register',userId:'attacker',profile,pin:'58294716',consent:{version:CONSENT_VERSION,privacy:true,guardian:true}},{authorization:'Bearer '+jwt()});
 assert.equal(r.status,200);const rpc=h.calls.find(x=>x.name==='roadmap_register');assert.equal(rpc.args.p_user_id,UID);assert.equal(rpc.args.p_email,M.email);
 assert.match(r.data.token,/^[a-f0-9]{64}$/);const session=h.calls.find(x=>x.table==='roadmap_sessions'&&x.insert);assert.notEqual(session.insert.token_hash,r.data.token);
 assert.equal('session_version' in r.data.member,false);assert.equal(h.calls.some(x=>x.columns?.includes('pin_hash')),false);
});
test('PIN reset rotates sessions without changing consent history',async()=>{
 const h=harness();const r=await h.request({action:'reset-pin',pin:'58294716'},{authorization:'Bearer '+jwt()});
 assert.equal(r.status,200);assert.equal(h.calls.some(x=>x.name==='roadmap_rotate_pin'),true);assert.equal(h.calls.some(x=>x.name==='roadmap_register'),false);
});
test('email and IP rate limits fail closed before PIN verification',async()=>{
 const h=harness({limited:true});const r=await h.request({action:'login',email:M.email,pin:'58294716'});assert.equal(r.status,429);assert.equal(h.calls.some(x=>x.name==='roadmap_verify_pin'),false);
});
test('bad PIN is a generic credential error',async()=>{const r=await harness({badPin:true}).request({action:'login',email:M.email,pin:'58294716'});assert.equal(r.status,401);assert.equal(r.data.error,'credentials_invalid');});
test('OTP email requires consent and is never sent during a lookup',async()=>{
 const h=harness();assert.equal((await h.request({action:'send-code',email:M.email})).status,400);assert.equal(h.calls.some(x=>x.mail),false);
 assert.equal((await h.request({action:'send-code',email:M.email,emailConsent:true})).status,200);
});
test('user-edited metadata cannot grant administrative access',async()=>{
 const h=harness({user:{user_metadata:{role:'admin'},app_metadata:{role:'admin'}}});assert.equal((await h.request({action:'admin-list'},{authorization:'Bearer '+jwt()})).status,403);
});
test('admin requires active server role and only receives public profile columns',async()=>{
 const h=harness({admin:true,user:{app_metadata:{role:'admin'}}});const r=await h.request({action:'admin-list'},{authorization:'Bearer '+jwt()});assert.equal(r.status,200);assert.equal(r.data.members[0].student_name,M.student_name);
 assert.equal(h.calls.some(x=>x.columns?.includes('pin_hash')),false);assert.equal('session_version' in r.data.members[0],false);
});
test('withdrawal requires fresh email and an explicit confirmation',async()=>{
 const h=harness();assert.equal((await h.request({action:'withdraw',confirm:true},{'x-roadmap-session':'a'.repeat(64)})).status,401);
 assert.equal((await h.request({action:'withdraw'},{authorization:'Bearer '+jwt()})).status,400);
 assert.equal((await h.request({action:'withdraw',confirm:true},{authorization:'Bearer '+jwt()})).status,200);
});
test('foreign origins, malformed JSON and oversized requests fail closed',async()=>{
 const h=harness();assert.equal((await h.request({action:'status'},{origin:'https://evil.invalid'})).status,403);
 assert.equal((await h.handler(new Request('https://example.invalid',{method:'POST',body:'invalid'}))).status,400);
 assert.equal((await h.handler(new Request('https://example.invalid',{method:'POST',body:' '.repeat(12001)}))).status,413);
});
