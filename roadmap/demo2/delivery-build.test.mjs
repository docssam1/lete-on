import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const {build}=createRequire(import.meta.url)('./tools/build-delivery.cjs');
test('delivery preserves executable order and uses content-addressed, reproducible public bundles',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'gfield-delivery-'));
 try{
  const a=build(dir),before=Object.fromEntries(a.assets.map(n=>[n,fs.readFileSync(path.join(dir,n),'utf8')]));
  const b=build(dir);assert.deepEqual(b,a);assert.equal(a.entryScripts,9);assert.equal(a.runtimeScripts,119);assert.equal(a.styles,57);
  const entry=before[a.entry],runtime=before[a.runtime];assert.ok(entry.indexOf('/* planner.js?')<entry.indexOf('/* planner-intake.js?'));assert.ok(runtime.indexOf('/* planner-guide.js?')<runtime.indexOf('/* planner-ui.js?'));
  assert.ok(!runtime.includes('/* planner-parent-flow.js?'));assert.ok(entry.includes('/* planner-parent-flow.js?'));
  assert.ok(entry.indexOf('/* planner-level-guide-entry.js?')<entry.indexOf('/* planner-parent-boot.js?'));
  assert.ok(entry.indexOf('/* planner-parent-overview.js?')<entry.indexOf('/* planner-parent-boot.js?'));
  const html=fs.readFileSync(path.join(dir,'planner.html'),'utf8');assert.ok(html.includes('class="member-checking"'));assert.ok(html.includes('data-entry-bundle="'+a.entry+'"'));
  assert.deepEqual(fs.readdirSync(dir).sort(),[...a.assets,'manifest.json','planner.html'].sort());
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
