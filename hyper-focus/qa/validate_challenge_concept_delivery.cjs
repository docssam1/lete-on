#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'..'),clientPath=path.join(base,'challenge/concept-client.js'),clientSource=fs.readFileSync(clientPath,'utf8');
const variants=require('../challenge/variant-provider.js'),taxonomy=require('../challenge/challenge-taxonomy.js'),privateGuide=require('../challenge/concept-guide.js'),release=require('./stage_public_release.cjs');
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
const first=variants.list()[0],classified=taxonomy.getTaxonomy(first,first.round,first.section),privateValue=privateGuide.forRow({taxonomy:classified});
const delivered={typeId:privateValue.typeId,title:privateValue.title,hierarchy:privateValue.hierarchy,rule:privateValue.rule,steps:privateValue.steps,commonMistake:privateValue.commonMistake,selfCheck:privateValue.selfCheck,evidenceLabel:privateValue.evidenceLabel,status:privateValue.status,evidenceStatus:privateValue.evidenceStatus};
const publicBundle=release.CHALLENGE_PUBLIC.map(file=>fs.readFileSync(path.join(base,'challenge',file))).join('\n');

for(const row of variants.list()){
 const value=privateGuide.forRow({taxonomy:taxonomy.getTaxonomy(row,row.round,row.section)});
 for(const text of [value.rule,...value.steps,value.commonMistake,value.selfCheck])ok(!clientSource.includes(text),'public client excludes private concept phrase');
 for(const text of [value.rule,value.steps[0],value.steps[2],value.commonMistake,value.selfCheck])ok(!publicBundle.includes(text),'public release allowlist excludes private guide phrase');
}
ok(!/evidenceId\s*:|catalog:|solution:/.test(clientSource),'public client excludes private evidence pointers');
ok(release.CHALLENGE_PUBLIC.includes('concept-client.js'),'public release includes thin concept client');
ok(release.CHALLENGE_PUBLIC.includes('question-identity.js'),'public release includes duplicate identity helper');
ok(!release.CHALLENGE_PUBLIC.includes('concept-guide.js'),'public release excludes private concept guide');
const buildSource=fs.readFileSync(path.join(base,'qa/build_challenge_private_package.cjs'),'utf8'),safeLine=buildSource.match(/const safeFiles=\[[^\n]+/s)?.[0]||'';
ok(safeLine.includes("'concept-client.js'")&&safeLine.includes("'question-identity.js'")&&!safeLine.includes("'concept-guide.js'"),'private package public allowlist excludes guide');

let calls=[],allowed=true,response={verified:true,concept:delivered};
const context={console,JSON,Object,Array,Set,Map,Promise,TypeError,Error,RangeError,globalThis:null};context.globalThis=context;context.window=context;
context.HFChallengePublicCatalog={variants:variants.list()};context.HFChallengeTaxonomy=taxonomy;
context.HFChallengeAccess={allow:(product,typeId)=>{calls.push({kind:'allow',product,typeId});return allowed;}};
context.HFChallengeContent={request:async body=>{calls.push({kind:'request',body});return response;}};
vm.createContext(context);vm.runInContext(clientSource,context,{filename:clientPath});
const api=context.HFChallengeConceptClient;
ok(api===context.HFChallengeConceptGuide,'remote runtime exposes compatibility guide API');
ok(api.has(first.typeId)&&api.has(classified.typeId)&&!api.has('unknown'),'has uses public metadata only');
(async()=>{
 const value=await api.forRow({...first,taxonomy:classified});
 ok(calls.some(call=>call.kind==='allow'&&call.product==='challenge-bank'&&call.typeId===first.typeId),'client checks source type entitlement');
 ok(calls.some(call=>call.kind==='request'&&JSON.stringify(call.body)===JSON.stringify({action:'concept',typeId:first.typeId})),'client requests concept by source type');
 ok(value.rule===privateValue.rule&&value.typeId===classified.typeId&&Object.isFrozen(value)&&Object.isFrozen(value.steps),'validated concept returned deeply frozen');
 allowed=false;calls=[];await assert.rejects(()=>api.forRow({...first,taxonomy:classified}),/이용 승인/);ok(!calls.some(call=>call.kind==='request'),'denied client never requests private content');
 allowed=true;response={verified:true,concept:{...delivered,answer:'LEAK'}};await assert.rejects(()=>api.forRow({...first,taxonomy:classified}),/안전하게/);ok(true,'extra answer field rejected');
 response={verified:true,concept:{...delivered,typeId:'other'}};await assert.rejects(()=>api.forRow({...first,taxonomy:classified}),/안전하게/);ok(true,'wrong concept type rejected');
 response={verified:true,concept:{...delivered,hierarchy:{...delivered.hierarchy,subtype:{...delivered.hierarchy.subtype,id:'other'}}}};await assert.rejects(()=>api.forRow({...first,taxonomy:classified}),/요청한 소유형/);ok(true,'wrong hierarchy rejected');
 console.log(JSON.stringify({status:'passed',checks,publicClient:'content-free',authorization:'challenge-bank source typeId',privateConceptTypes:privateGuide.typeCount,sourceTypes:variants.list().length,remoteWrites:0}));
})().catch(error=>{console.error(error);process.exitCode=1;});
