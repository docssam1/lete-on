// Offline-only personal delivery flow checks. The real external wiring is not loaded.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {stripTypeScriptTypes} from 'node:module';
import {personalDeliveryState} from './delivery-runtime.mjs';
const src=fs.readFileSync(new URL('./index.ts',import.meta.url),'utf8');
const pure=src.slice(src.indexOf('// @@pure-start'),src.indexOf('// @@pure-end'));
const box={crypto:webcrypto,TextEncoder,Uint8Array,Array,String,Number};vm.createContext(box);
vm.runInContext(stripTypeScriptTypes(pure)+'\nthis.processContact=processContact;this.parseMembership=parseMembership;',box);
const LINK='https://lete-on.gfieldacademy.net/w/?m='+'d'.repeat(32),VERSION='20261024-personal1';
const state={learningPlan:{courseKey:'C31'},roadCadence:'w2'},contact={profile_name:'synthetic-personal',phone:'01000001234',send_dow:1,send_dow2:1};
const ctx={wk:'2026-W43',kstDow:1,gDow:1,gDow2:1,force:false,dry:false};
function fixture(data,st=state){const calls={send:0,legacy:0,reserve:0,rpc:[]};return {calls,personalDeliveryState,membership:async p=>{calls.rpc.push(p);return {data,error:null};},loadState:async()=>st,alreadyLogged:async()=>false,reserve:async()=>{calls.reserve++;return {id:1};},finalize:async()=>({}),worksheetLink:async()=>{calls.legacy++;return {url:'https://legacy.test/pdf',kind:'pdf'};},compose:(name,d,cad,link)=>({msg:link.url,title:'',msgType:'SMS'}),bytes:s=>s.length,send:async()=>{calls.send++;return {ok:true};}};}
const plan={courseKey:'C31',sessionIndex:11,startDate:'2026-10-19',speed:1,amount:1,cadence:'w2',pace:'p2',middleExtensions:{1:'20261024-middle-extension1'},extensionAnchor:{grade:1,index:4}};
const config=p=>({courseKey:p.courseKey,sessionIndex:p.sessionIndex,week:ctx.wk,k:1,amount:p.amount,cadence:p.cadence,deliveryPlanVersion:VERSION,learningPlan:p});
const personal={managed:true,canUse:true,cadence:'w2',wholeWeek:true,deliveryPlanVersion:VERSION,link:LINK,config:config(plan)};
test('personal w2 produces one frozen member link and never opens the old PDF path',async()=>{const d=fixture(personal),r=await box.processContact(d,contact,ctx);assert.equal(d.calls.send,1);assert.equal(d.calls.reserve,1);assert.equal(d.calls.legacy,0);assert.deepEqual(d.calls.rpc.map(p=>p.k),[1]);assert.equal(r.length,1);});
test('missing personal snapshots fail closed before reserving or sending',async()=>{for(const data of[{managed:false},{managed:true,canUse:true,cadence:'w1',link:null},{...personal,link:null},{...personal,deliveryPlanVersion:'future'},{...personal,wholeWeek:false},{...personal,error:'invalid_learning_plan'}]){const d=fixture(data),r=await box.processContact(d,contact,ctx);assert.equal(d.calls.send+d.calls.legacy+d.calls.reserve,0);assert.match(r[0].skip,/membership-error|personal-snapshot-missing/);}});
test('only an explicit server legacy baseline preserves old personal fallback',async()=>{const d=fixture({managed:true,canUse:true,cadence:'w1',link:null,personalPlanLegacy:true});await box.processContact(d,contact,ctx);assert.equal(d.calls.send,1);assert.equal(d.calls.legacy,1);const old=fixture({managed:true,canUse:true,cadence:'w1',link:null},{});await box.processContact(old,contact,ctx);assert.equal(old.calls.send,1);assert.equal(old.calls.legacy,1);});
test('authoritative managed links win over stale personal state and keep w2 delivery',async()=>{const d=fixture({managed:true,canUse:true,cadence:'w2',link:LINK});await box.processContact(d,contact,ctx);assert.equal(d.calls.send,2);assert.equal(d.calls.legacy,0);assert.deepEqual(d.calls.rpc.map(p=>p.k),[1,2]);});
test('expired members and dry runs do not dispatch',async()=>{const denied=fixture({...personal,canUse:false,link:null});await box.processContact(denied,contact,ctx);assert.equal(denied.calls.send+denied.calls.reserve,0);const dry=fixture(personal);const r=await box.processContact(dry,contact,{...ctx,dry:true});assert.equal(dry.calls.send+dry.calls.reserve,0);assert.equal(r[0].link,'member');});
test('actual slow empty week creates no reservation, old PDF fallback or SMS',async()=>{const slow={courseKey:'C73',sessionIndex:1,startDate:'2026-10-19',speed:0.7,amount:1,cadence:'w1',pace:'p2'},cfg=config(slow);assert.equal(personalDeliveryState(cfg),'empty');const d=fixture({...personal,cadence:'w1',config:cfg}),r=await box.processContact(d,contact,ctx);assert.equal(r[0].skip,'no-assigned-worksheet');assert.equal(d.calls.send+d.calls.reserve+d.calls.legacy,0);});
test('invalid or mismatched frozen personal config cannot send or reserve',async()=>{for(const patch of[{config:null},{config:{...personal.config,week:'2026-W44'}},{config:{...personal.config,learningPlan:{...plan,speed:99}}},{cadence:'w1'},{link:'https://legacy.test/pdf'}]){const d=fixture({...personal,...patch}),r=await box.processContact(d,contact,ctx);assert.match(r[0].skip,/membership-error|membership-mismatch/);assert.equal(d.calls.send+d.calls.reserve+d.calls.legacy,0);}});

test('new v2 personal snapshots dispatch through the same gated path, with no legacy fallback',async()=>{
 const cfg={...config(plan),deliveryPlanVersion:'20261026-personal2',learningPlan:{...plan,curriculumRevision:'20261026-curriculum2'}};
 const d=fixture({...personal,deliveryPlanVersion:cfg.deliveryPlanVersion,config:cfg});
 const r=await box.processContact(d,contact,ctx);
 assert.equal(d.calls.send,1);assert.equal(d.calls.reserve,1);assert.equal(d.calls.legacy,0);assert.equal(r.length,1);
});
test('old version plus new curriculum marker fails closed',async()=>{
 const d=fixture({...personal,config:{...config(plan),learningPlan:{...plan,curriculumRevision:'20261026-curriculum2'}}});
 const r=await box.processContact(d,contact,ctx);
 assert.equal(d.calls.send+d.calls.reserve+d.calls.legacy,0);assert.match(r[0].skip,/membership-error/);
});
