import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync,rmSync} from 'node:fs';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url), context={};vm.createContext(context);
for(const name of ['data/available-mocks.js','promo/course-navigation.js'])vm.runInContext(readFileSync(new URL(name,root),'utf8'),context);
const all=JSON.parse(JSON.stringify(context.HIGHSELECT_AVAILABLE_MOCKS));
const oldIDs=["sh-selection-r01","sh-selection-r02","sh-selection-r03","sh-selection-r04","sh-selection-r05","dp-common1-v14-pilot","dp-common1-r02","dp-common1-r03","dp-common1-r04","dp-common1-final","wm-middle21-basic-mixed-r01","wm-middle21-basic-mixed-r02","wm-middle21-basic-mixed-r03","wm-middle21-basic-mixed-r04","wm-middle21-basic-final","ed-common1-basic-r01","ed-common1-basic-r02","dg-pre-high1-r01","sm-pre-middle-common1-r01","sm-pre-middle-common1-r02","dg-middle1-entry-r01","dg-middle1-entry-r02","wm-common1-basic-r01","wm-common1-basic-r02","wm-common1-basic-r03","wm-common1-basic-r04","wm-common1-basic-final","dp-middle22-transfer-r01","dp-middle22-transfer-r02","dp-middle22-transfer-r03","dp-middle22-transfer-r04","dp-middle22-transfer-final","ed-middle1-authored-r01","ed-middle1-authored-r02","wm-middle22-basic-r01","wm-middle22-basic-mixed-r02","wm-middle22-basic-mixed-r03","wm-middle22-basic-mixed-r04","wm-middle22-basic-mixed-final","wm-middle31-basic-r01","wm-middle31-basic-r02","wm-middle31-basic-r03","wm-middle31-basic-r04","wm-middle31-basic-final"];
test('ED3 adds one reviewed subjective round with the exact page and time profile',()=>{
 const e=all.find(e=>e.id==='ed-middle1-authored-r03');assert.ok(e);assert.deepEqual([e.programId,e.questionCount,e.durationMinutes,e.pageCount,e.answerPageCount,e.analysisPageCount],['ED',30,100,14,16,4]);assert.equal(e.mode,'released');
});
test('ED3 addition preserves every field of the existing 44 public editions',()=>{
 const retained=oldIDs.map(id=>all.find(e=>e.id===id));assert.ok(retained.every(Boolean));assert.equal(createHash('sha256').update(JSON.stringify(retained)).digest('hex'),'7fd5c98ae329c12c1e3d68f5e3eb45a91178fcfc61bc65baf6bbc8f47573cb89');
});
test('ED3 is reached from the existing Eden middle1 course in round order',()=>{
 const nav=context.HIGHSELECT_PROMO_NAV;assert.deepEqual(JSON.parse(JSON.stringify(nav.selectionForExam('ed-middle1-authored-r03'))),{program:'ED',course:'middle1'});assert.deepEqual(JSON.parse(JSON.stringify(nav.examsFor('ED','middle1',all))).map(e=>e.id),['ed-middle1-authored-r01','ed-middle1-authored-r02','ed-middle1-authored-r03']);
});
test('ED3 public metadata carries no question text, answer values or private page paths',()=>{
 const e=all.find(e=>e.id==='ed-middle1-authored-r03');for(const key of ['questions','stem','text','answer','solution','choices','pages','answerPages','analysisPages','assetFunctions'])assert.equal(Object.hasOwn(e,key),false,key);
});

test('academy round links resolve to the actual staged protected entry and its resources',()=>{
 const require=createRequire(import.meta.url),{stagePublicIntro}=require('../scripts/stage-public-intro.cjs');
 const parent=mkdtempSync(path.join(tmpdir(),'ed3-stage-contract-')),dest=path.join(parent,'highschool-selection');
 try {
  stagePublicIntro(dest);
  const promo=readFileSync(path.join(dest,'promo/index.html'),'utf8'),entry=readFileSync(path.join(dest,'login.html'),'utf8');
  assert.match(promo,/const examHref=e=>['"]\.\.\/login\.html\?[^'"]*&exam=/);
  assert.match(entry,/id="student-login"/);assert.match(entry,/id="student-code" type="password"/);assert.doesNotMatch(entry,/HIGHSELECT_AUTH\.signIn/);
  for(const match of entry.matchAll(/(?:src|href)="([^"]+)"/g)){
   const target=new URL(match[1],'https://example.test/highschool-selection/login.html');
   if(target.origin!=='https://example.test'||!target.pathname.startsWith('/highschool-selection/')||match[1].startsWith('#'))continue;
   assert.ok(existsSync(path.join(parent,target.pathname.slice(1))),match[1]);
  }
  assert.equal(existsSync(path.join(dest,'public/exam-entry.html')),false);
  assert.equal(existsSync(path.join(dest,'server')),false);
 } finally {rmSync(parent,{recursive:true,force:true});}
});
