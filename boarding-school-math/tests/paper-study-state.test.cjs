const test=require('node:test'),assert=require('node:assert/strict');
const model=require('../shared/paper-study-state.js'),library=require('../competition/amc-original-paper-library.js'),keys=require('../competition/amc-original-answer-key-reference.js');
function store(){const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),values};}
test('paper state persists by source identity, separates forms, and cannot invent completion for a missing paper',()=>{
 const storage=store(),state=model.create(storage,library,keys);
 assert.equal(state.state('amc10',2026,'B'),'new');assert.equal(state.mark('amc10',2026,'B','started'),true);assert.equal(state.state('amc10',2026,'B'),'started');assert.equal(state.state('amc10',2026,'A'),'new');
 state.mark('amc10',2026,'B','complete');state.mark('amc10',2026,'B','started');assert.equal(model.create(storage,library,keys).state('amc10',2026,'B'),'complete');
 for(const [p,y,f]of [['amc8',2021,''],['amc10',2026,'C'],['__proto__',2026,'A'],['amc12',2099,'A']])assert.equal(state.mark(p,y,f,'complete'),false);
 const raw=JSON.parse(storage.getItem(model.storageKey));assert.deepEqual(raw,{'amc10:2026:B':'complete'});assert.doesNotMatch(JSON.stringify(raw),/answer|score|student|name|grade/);
});
test('corrupt or untrusted stored entries are discarded and blocked storage remains usable in this page',()=>{
 const storage=store();storage.setItem(model.storageKey,JSON.stringify({'amc8:2026:':{answers:['A']},'unknown:2026:A':'complete','amc8:2025:':'started'}));const state=model.create(storage,library,keys);
 assert.equal(state.state('amc8',2026,''),'new');assert.equal(state.state('amc8',2025,''),'started');
 const blocked=model.create({getItem:()=>null,setItem:()=>{throw Error('quota');}},library,keys);assert.equal(blocked.mark('amc8',2025,'','started'),false);assert.equal(blocked.state('amc8',2025,''),'started');
});
test('the recent study inventory contains only primary, checked papers and preserves prior direct archive routes',()=>{
 const manifest=require('../competition/amc-study-paper-manifest.js');assert.equal(manifest.papers.length,60);let count=0;
 for(const p of ['amc8','amc10','amc12'])for(const y of library.studyYearsFor(p))for(const f of library.formsFor(p,y)){const row=manifest.paperFor(p,y,f);assert.ok(row);assert.equal(row.available,true);assert.ok([200,206].includes(row.httpStatus));assert.equal(row.pdfUrl,library.printRoute(p,y,f));assert.equal(keys.formFor(p,y,f).itemCount,25);count++;}
 assert.equal(count,44);assert.equal(library.studyYearsFor('amc8').length,8);assert.equal(library.studyYearsFor('amc8').includes(2021),false);assert.equal(library.studyYearsFor('amc10').at(-1),2019);assert.match(library.archiveRoute('amc10',2009,'A'),/2009A$/);
});
test('completed paper scores validate contest maximums and half-point increments without storing answers',()=>{
 const storage=store(),state=model.create(storage,library,keys);
 assert.equal(state.mark('amc10',2025,'A','complete',{points:100.5,max:150}),true);
 assert.deepEqual(model.create(storage,library,keys).resultFor('amc10',2025,'A'),{points:100.5,max:150});
 for(const score of [{points:100.25,max:150},{points:151,max:150},{points:20,max:25},{points:NaN,max:150}])assert.equal(state.mark('amc10',2025,'A','complete',score),false);
 assert.equal(state.mark('amc8',2025,'','complete',{points:20.5,max:25}),false);
 assert.equal(state.mark('aime',2025,'I','complete',{points:16,max:15}),false);
 assert.doesNotMatch(storage.getItem(model.storageKey),/answer|student|name|grade/);
});
test('only an available paper version can supply a reader URL; pending translations cannot impersonate originals',()=>{
 const versions=require('../competition/amc-paper-languages.js');
 assert.equal(versions.versionFor('amc10',2026,'B','en',library).url,library.printRoute('amc10',2026,'B'));
 for(const language of ['ko','zh-Hans'])assert.deepEqual(versions.versionFor('amc10',2026,'B',language,library),{language,status:'pending',url:null,source:'translated'});
 assert.equal(versions.versionFor('amc8',2021,'','en',library),null);
 assert.ok(versions.requiredChecks.includes('curriculumTerminology'));
});
