'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'hse-52-local-gate-'));
try {
 const dir=path.join(root,'source-inventory');fs.mkdirSync(dir);for(const f of ['5-2-source-items.json','6-1-source-items.json','6-2-source-items.json'])fs.copyFileSync(path.join(__dirname,'source-inventory',f),path.join(dir,f));
 const file=path.join(dir,'5-2-source-items.json'),original=JSON.parse(fs.readFileSync(file,'utf8'));
 function run(mutator,shouldFail){const d=structuredClone(original),r=d.sourceItems.find(x=>x.sourceItemId==='5-2-u4-e2-example-1');mutator(r);fs.writeFileSync(file,JSON.stringify(d));const out=spawnSync(process.execPath,[path.join(__dirname,'source-inventory-grades-5-2-to-6-audit.js')],{env:{...process.env,HSE_SOURCE_INVENTORY_ROOT:root},encoding:'utf8'});assert.equal(out.status,shouldFail?1:0);assert.equal(out.stderr.includes('원문 잠금 또는 검증된 연습 유형 연결이 잘못되었습니다.'),shouldFail,out.stderr)}
 run(()=>{},false);run(r=>{r.publicDecision='public'},true);run(r=>{r.publisherKeyVerified=true},true);run(r=>{r.sourceVerified=false},true);run(r=>{r.syntheticRuntimeTypeId='5-2-u4-e2-example-2'},true);run(r=>{delete r.syntheticRuntimeTypeId},true);
 console.log('PASS: verified-local entries require original lock, correct source and registered practice');
} finally {fs.rmSync(root,{recursive:true,force:true})}
