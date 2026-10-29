'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'hse-inventory-gate-'));
try {
  const dir=path.join(root,'source-inventory');fs.mkdirSync(dir);
  for(const f of ['5-2-source-items.json','6-1-source-items.json','6-2-source-items.json'])fs.copyFileSync(path.join(__dirname,'source-inventory',f),path.join(dir,f));
  const file=path.join(dir,'6-2-source-items.json'), original=JSON.parse(fs.readFileSync(file,'utf8'));
  function check(mutate,expected){const document=structuredClone(original);const row=document.items.find(x=>x.sourceItemId==='6-2-u2-e2-example-1');mutate(row);fs.writeFileSync(file,JSON.stringify(document));const r=spawnSync(process.execPath,[path.join(__dirname,'source-inventory-grades-5-2-to-6-audit.js')],{env:{...process.env,HSE_SOURCE_INVENTORY_ROOT:root},encoding:'utf8'});assert.equal(r.status,expected?1:0);assert.equal(r.stderr.includes('reviewReason가 비어 있으며 확인된 공개 유형 연결이 없습니다.'),expected,r.stderr);}
  check(()=>{},false);
  check(row=>{row.implementationStatus='review-locked';},true);
  check(row=>{row.sourceVerified=false;},true);
  check(row=>{row.publicSourceItemId='6-2-no-such-public-type';},true);
  check(row=>{row.publicSourceItemId='6-2-u2-e2-example-2';},true);
  console.log('PASS: verified public matches may omit hold reason; locked, unverified and missing matches fail');
} finally {fs.rmSync(root,{recursive:true,force:true});}
