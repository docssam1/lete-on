import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),ctx={};vm.createContext(ctx);
for(const f of ['data/available-mocks.js','promo/course-navigation.js'])vm.runInContext(readFileSync(new URL(f,root),'utf8'),ctx);
const all=JSON.parse(JSON.stringify(ctx.HIGHSELECT_AVAILABLE_MOCKS));
const r04Old=JSON.parse(readFileSync(new URL('./fixtures/historic-r04-baseline-ids.json',import.meta.url),'utf8'));
const id='ed-common1-basic-r04',version='ed-common1-final-v5-reviewed-20261126-layout-b59c76ddc20d234b-pdf-v8-06ed4b87594f614f';
test('ED common1 round 4 metadata remains unchanged',()=>{
 const e=all.find(x=>x.id===id);assert.ok(e);
 assert.deepEqual(e,{id,programId:'ED',title:'이든 공통수학1 기본반 입반 대비 4회',scope:'중2·중3 전 과정 · 대수20·기하10',mode:'released',durationMinutes:100,sectionMinutes:null,breakMinutes:0,questionCount:30,pageCount:13,answerPageCount:16,analysisPageCount:4});
 for(const key of ['questions','stem','text','answer','solution','choices','pages','answerPages','analysisPages','assetFunctions','version'])assert.equal(Object.hasOwn(e,key),false,key);
});
test('ED common1 round 4 preserves the exact pre-R4 historic48 ID snapshot',()=>{
 assert.equal(r04Old.commit,'185a157f4932e1cdd46b068634e92d048a12ca13');
 const ids=new Set(r04Old.orderedIds);const old=all.filter(x=>ids.has(x.id));assert.equal(old.length,48);assert.equal(old.reduce((n,e)=>n+e.questionCount,0),1890);
 assert.equal(r04Old.canonicalSHA256,'151f3de3d4d930f78dca5db33539e81f5181fbd98aaff96da064bf118992d6b1');
 assert.equal(createHash('sha256').update(JSON.stringify(old)).digest('hex'),'151f3de3d4d930f78dca5db33539e81f5181fbd98aaff96da064bf118992d6b1');
});
test('ED common1 rounds keep the ordered high-advance route through final',()=>{
 const nav=ctx.HIGHSELECT_PROMO_NAV;assert.deepEqual(JSON.parse(JSON.stringify(nav.selectionForExam(id))),{program:'ED',course:'high-advance'});
 assert.deepEqual(JSON.parse(JSON.stringify(nav.examsFor('ED','high-advance',all))).map(e=>e.id),['ed-common1-basic-r01','ed-common1-basic-r02','ed-common1-basic-r03',id,'ed-common1-basic-final']);
});
test('both browser entry pages use the same current metadata and navigation cache tag',()=>{
 for(const f of ['promo/index.html','public/exam-entry.html']){const html=readFileSync(new URL(f,root),'utf8');assert.equal((html.match(new RegExp('available-mocks\\.js\\?v='+version,'g'))||[]).length,1);assert.equal((html.match(new RegExp('course-navigation\\.js\\?v='+version,'g'))||[]).length,1);}
});
