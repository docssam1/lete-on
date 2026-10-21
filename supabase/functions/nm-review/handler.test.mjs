import test from 'node:test';import assert from 'node:assert/strict';import {createHandler}from './handler.mjs';
const TOKEN='a'.repeat(64),exp=()=>new Date(Date.now()+3600000).toISOString();
function setup(reply){const calls=[];const fn=createHandler(async(...args)=>{calls.push(args);return {data:typeof reply==='function'?reply(...args):reply,error:null};});return {calls,post:(body,headers={})=>fn(new Request('https://example.test',{method:'POST',headers:{apikey:'public-key','Content-Type':'application/json','x-forwarded-for':'192.0.2.1',...headers},body:JSON.stringify(body)})),fn};}
test('learning-only action/field allowlist; IP is hashed',async()=>{
 const t=setup({token:TOKEN,username:'review-fixture',scope:'learning_review',expiresAt:exp()});
 let r=await t.post({action:'login',username:'review-fixture',code:'mock-only-code'});assert.equal(r.status,200);assert.match(t.calls[0][2],/^[a-f0-9]{64}$/);assert(!t.calls[0][2].includes('192.0.2.1'));
 for(const body of [{action:'admin_list',token:TOKEN},{action:'login',username:'review-fixture',code:'mock',role:'admin'},{action:'status',token:TOKEN,owner_id:'fake'},{action:'status',token:'fake'},{action:'login',username:'review-fixture',code:'x'.repeat(73)}])assert([400,401].includes((await t.post(body)).status));
 assert.equal(t.calls.length,1);
});
test('origin, method and body limits; no error reflections',async()=>{
 const t=setup({error:'private-error-secret',status:401});
 assert.equal((await t.post({action:'status',token:TOKEN},{origin:'https://attacker.invalid'})).status,403);
 assert.equal((await t.fn(new Request('https://example.test',{method:'GET'}))).status,405);
 assert.equal((await t.fn(new Request('https://example.test',{method:'OPTIONS',headers:{origin:'https://lete-on.gfieldacademy.net'}}))).status,204);
 assert.equal((await t.post({action:'login',username:'fixture',code:'mock-only'})).status,401);
 const r=await t.post({action:'status',token:TOKEN});assert.deepEqual(await r.json(),{error:'unauthorized'});
 assert.equal((await t.post({action:'login',username:'fixture',code:'x'.repeat(3000)})).status,413);
});
test('status never returns token or other private keys; rate limit retained',async()=>{
 const t=setup({username:'review-fixture',scope:'learning_review',expiresAt:exp(),token:TOKEN,adminToken:'secret',phone:'private',code_hash:'secret'});
 const r=await t.post({action:'status',token:TOKEN}),j=await r.json();assert.equal(j.scope,'learning_review');for(const k of ['token','adminToken','phone','code_hash'])assert.equal(j[k],undefined);
 const lim=setup({error:'rate_limited',status:429}),l=await lim.post({action:'login',username:'fixture',code:'mock-only'});assert.equal(l.status,429);assert.equal(l.headers.get('Retry-After'),'900');
});
test('database outage and malformed scope fail closed',async()=>{
 for(const data of [null,{username:'fixture',scope:'admin',expiresAt:exp()},{username:'fixture',scope:'learning_review',expiresAt:'invalid'}])assert.equal((await setup(data).post({action:'status',token:TOKEN})).status,503);
 const fn=createHandler(async()=>{throw Error('secret');});const r=await fn(new Request('https://example.test',{method:'POST',headers:{apikey:'public'},body:JSON.stringify({action:'status',token:TOKEN})}));assert.deepEqual(await r.json(),{error:'unavailable'});
});
