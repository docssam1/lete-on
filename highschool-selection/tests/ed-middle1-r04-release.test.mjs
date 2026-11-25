// 2026-11-26: owner-approved title/scope copy deletion reflected in the catalog snapshot.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),ctx={};vm.createContext(ctx);
for(const f of ['data/available-mocks.js','promo/course-navigation.js'])vm.runInContext(readFileSync(new URL(f,root),'utf8'),ctx);
const all=JSON.parse(JSON.stringify(ctx.HIGHSELECT_AVAILABLE_MOCKS)),oldIDs=["sh-selection-r01","sh-selection-r02","sh-selection-r03","sh-selection-r04","sh-selection-r05","dp-common1-v14-pilot","dp-common1-r02","dp-common1-r03","dp-common1-r04","dp-common1-final","wm-middle21-basic-mixed-r01","wm-middle21-basic-mixed-r02","wm-middle21-basic-mixed-r03","wm-middle21-basic-mixed-r04","wm-middle21-basic-final","ed-common1-basic-r01","ed-common1-basic-r02","dg-pre-high1-r01","sm-pre-middle-common1-r01","sm-pre-middle-common1-r02","dg-middle1-entry-r01","dg-middle1-entry-r02","wm-common1-basic-r01","wm-common1-basic-r02","wm-common1-basic-r03","wm-common1-basic-r04","wm-common1-basic-final","dp-middle22-transfer-r01","dp-middle22-transfer-r02","dp-middle22-transfer-r03","dp-middle22-transfer-r04","dp-middle22-transfer-final","ed-middle1-authored-r01","ed-middle1-authored-r02","ed-middle1-authored-r03","wm-middle22-basic-r01","wm-middle22-basic-mixed-r02","wm-middle22-basic-mixed-r03","wm-middle22-basic-mixed-r04","wm-middle22-basic-mixed-final","wm-middle31-basic-r01","wm-middle31-basic-r02","wm-middle31-basic-r03","wm-middle31-basic-r04","wm-middle31-basic-final"];
test('ED4 exposes the reviewed 30-question 100-minute document profile',()=>{
 const e=all.find(e=>e.id==='ed-middle1-authored-r04');assert.ok(e);assert.deepEqual([e.programId,e.questionCount,e.durationMinutes,e.pageCount,e.answerPageCount,e.analysisPageCount,e.mode],['ED',30,100,16,16,4,'released']);
});
test('ED4 preserves all existing 45 public edition fields',()=>{
 const retained=oldIDs.map(id=>all.find(e=>e.id===id));assert.ok(retained.every(Boolean));assert.equal(createHash('sha256').update(JSON.stringify(retained)).digest('hex'),'738f8fddd5005fb28c26a2684b8ce03b908f4b9595f87ef6beaadc42ceb9482d');
});
test('ED4 follows the existing Eden middle1 rounds through the course navigation',()=>{
 const nav=ctx.HIGHSELECT_PROMO_NAV;assert.deepEqual(JSON.parse(JSON.stringify(nav.selectionForExam('ed-middle1-authored-r04'))),{program:'ED',course:'middle1'});assert.deepEqual(JSON.parse(JSON.stringify(nav.examsFor('ED','middle1',all))).map(e=>e.id).slice(0,4),['ed-middle1-authored-r01','ed-middle1-authored-r02','ed-middle1-authored-r03','ed-middle1-authored-r04']);
});
test('ED4 public metadata excludes question bodies, keys, and protected object paths',()=>{
 const e=all.find(e=>e.id==='ed-middle1-authored-r04');for(const k of ['questions','stem','text','answer','solution','choices','pages','answerPages','analysisPages','assetFunctions'])assert.equal(Object.hasOwn(e,k),false,k);
});
