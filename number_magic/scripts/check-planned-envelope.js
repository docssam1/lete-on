#!/usr/bin/env node
'use strict';
// Canonical real course data + actual exam API; fake DOM/storage, no remote IO.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),store=new Map([['nm_ws_amount','1.5']]),w={console,Math,JSON,Date,Set,Map,URL,URLSearchParams,setTimeout,clearTimeout};
w.window=w;w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
let writes=0;w.localStorage={getItem:key=>store.get(key)||null,setItem(){writes++;throw Error('envelope must not write storage');}};
vm.createContext(w);const load=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w,{filename:file});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
for(const tag of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
 const file=tag[1].split(/[?#]/)[0];if(!/^(engine\/|data\/)/.test(file))continue;load(file);if(file==='data/high-pacing.js')break;
}
const C=w.NM_COURSES,P=w.NM_HIGH_PACING;
for(const key of ['C4','C5','C29','C36','C38','C39','C70','C71'])for(const uid of new Set(C[key].sessions.flatMap(s=>s.magic||[]))){
 const file='data/units/'+uid+'.js';if(fs.existsSync(path.join(root,file)))load(file);
}
load('app/exam.js');const api=w.NM_EXAM,plain=x=>JSON.parse(JSON.stringify(x)),week='2026-W43',reports=[];
const before=JSON.stringify(C),storageBefore=JSON.stringify([...store]);
function freeze(value){if(!value||typeof value!=='object'||Object.isFrozen(value))return;Object.values(value).forEach(freeze);Object.freeze(value);}freeze(C);
function test(name,run){run();reports.push(name);}
function ref(key,index){const lesson=P.select(C[key],{lesson:index,k:1});return {courseKey:key,lessonIndex:index,startSession:lesson.startSession,sourceIndices:plain(lesson.sourceIndices),...(lesson.extraPractice?{extraPractice:plain(lesson.extraPractice)}:{})};}
function expectedChild(r,opts={}){return api.weeklyEnvelope(C[r.courseKey],r.courseKey,week,{...opts,compactHigh:!!C[r.courseKey].studyPlan,lesson:r.lessonIndex,startSession:r.startSession,k:1});}
const legacyBefore=JSON.stringify(api.weeklyEnvelope(C.C4,'C4',week,{k:2,cad:'w2',amount:1,grade:2,name:'Fixture'}));
const scheduledBefore=JSON.stringify(api.weeklyEnvelope(C.C38,'C38',week,{compactHigh:true,startSession:1,highStartDate:'2026-10-19',cad:'w2',highSpeed:1.5,amount:1}));
test('multiple exact elementary sessions across and within courses',()=>{
 const refs=[{courseKey:'C4',startSession:2,sourceIndices:[1]},{courseKey:'C4',sessionIndex:3},{courseKey:'C5',startSession:1}],e=api.plannedEnvelope(refs,week,{amount:.7,name:'Fixture',grade:2,cad:'w2'});
 assert(e);assert.equal(e.lessons.length,3);assert.deepEqual(plain(e.lessons.map(r=>r.startSession)),[2,3,1]);assert.deepEqual(plain(e.assignedCourseKeys),['C4','C5']);
 assert.equal(e.cover.name,'Fixture');assert.equal(e.cover.amount,.7);assert.equal(e.cad,'w2');assert.equal(e.cover.studyDays,5);assert.equal(e.planned,true);
 assert(e.cover.courseTitle.includes('C4')&&e.cover.courseTitle.includes('C5'));assert(e.items.every(it=>it.grade===2&&it.sourceSession&&it.sessionLabel.startsWith(it.courseKey+' · ')));
 assert.equal(e.courseSessions,C.C4.sessions.filter(s=>!s.test).length+C.C5.sessions.filter(s=>!s.test).length);
 const second=e.items.filter(it=>it.sourceSession==='C4-S2'),third=e.items.filter(it=>it.sourceSession==='C4-S3');assert(second.length&&third.length);
 assert(second.every(it=>it.seed.includes('plan0s1')));assert(third.every(it=>it.seed.includes('plan1s2')));
 const solo=api.plannedEnvelope([{courseKey:'C4',startSession:2}],week,{amount:.7});assert.equal(second.length,solo.items.length);
});
test('repeated concepts receive one introduction without dropping practice',()=>{
 const e=api.plannedEnvelope([{courseKey:'C4',startSession:1},{courseKey:'C4',startSession:2}],week,{amount:1}),seen=new Set();let repeated=0;
 for(const it of e.items){if(!it.thread||it.noTeach)continue;const key=it.thread+'@'+it.level;if(seen.has(key)){assert.equal(it.skipConcept,true);repeated++;}else{seen.add(key);assert.notEqual(it.skipConcept,true);}}
 assert(repeated>0,'fixture must exercise a shared topic');
});
test('high school course boundary preserves every selected source and count',()=>{
 const refs=[ref('C38',C.C38.studyPlan.lessons.length-1),ref('C39',0)],opts={amount:1.25,grade:10,name:'High fixture',cad:'w2'},e=api.plannedEnvelope(refs,week,opts),children=refs.map(r=>expectedChild(r,opts));
 assert(e?.compactHigh);assert.equal(e.items.length,children.reduce((n,c)=>n+c.items.length,0));assert.equal(e.items.reduce((n,it)=>n+(it.count||0),0),children.flatMap(c=>c.items).reduce((n,it)=>n+(it.count||0),0));
 assert.deepEqual(plain(e.sourceSessions),refs.flatMap(r=>r.sourceIndices.map(i=>i+1)));assert.deepEqual(plain(e.units),[...new Set(children.flatMap(c=>c.units))]);
 assert(e.cover.courseTitle.includes('C38')&&e.cover.courseTitle.includes('C39'));assert(e.items.every(it=>it.grade===10));assert.equal(e.cover.amount,1.25);
});
test('partial compact start never reintroduces completed canonical sources',()=>{
 const course=C.C38,lesson=course.studyPlan.lessons.find(l=>l.sourceIndices.length>1),start=lesson.sourceIndices[1]+1,indices=lesson.sourceIndices.filter(i=>i>=start-1);
 const e=api.plannedEnvelope([{courseKey:'C38',lessonIndex:lesson.index,startSession:start,sourceIndices:plain(indices)}],week,{amount:1});
 assert(e);assert.deepEqual(plain(e.sourceSessions),plain(indices.map(i=>i+1)));assert(e.items.every(it=>!it.legacySession||it.legacySession>=start));
});
test('middle-three print follows its current taught sources without high-school bridge',()=>{
 const key='C36',lesson=C[key].studyPlan.lessons.at(-1),r=ref(key,lesson.index);
 const e=api.plannedEnvelope([r],week,{amount:.85,grade:9}),child=expectedChild(r,{amount:.85,grade:9});
 assert(e);assert.equal(e.items.filter(it=>it.sourceSession===key+'-extra').length,0);
 assert.equal(e.items.length,child.items.length);assert.equal(e.lessons[0].extraPractice,undefined);
});
test('calculus boundary uses its one-to-one source lessons',()=>{
 const refs=[ref('C70',C.C70.studyPlan.lessons.length-1),ref('C71',0)],e=api.plannedEnvelope(refs,week,{amount:1,grade:11});assert(e);assert.equal(e.lessons.length,2);assert.equal(e.sourceSessions.length,2);assert(e.items.every(it=>['C70','C71'].includes(it.courseKey)));
});
test('invalid references fail the whole envelope without silently selecting another source',()=>{
 for(const refs of [[],[{courseKey:'C404',startSession:1}],[{courseKey:'C4',startSession:0}],[{courseKey:'C4',startSession:999}],[{courseKey:'C4'}],[{courseKey:'C38',startSession:1,sourceIndices:[999]}],[{courseKey:'C36',startSession:1,extraPractice:[{t:'MD25',lv:9,n:12}]}]])assert.equal(api.plannedEnvelope(refs,week,{amount:1}),null);
});
test('source sessions, storage and all existing envelope paths remain unchanged',()=>{
 assert.equal(JSON.stringify(C),before);assert.equal(JSON.stringify([...store]),storageBefore);assert.equal(writes,0);assert.equal(api.getAmount(),1.5);
 assert.equal(JSON.stringify(api.weeklyEnvelope(C.C4,'C4',week,{k:2,cad:'w2',amount:1,grade:2,name:'Fixture'})),legacyBefore);
 assert.equal(JSON.stringify(api.weeklyEnvelope(C.C38,'C38',week,{compactHigh:true,startSession:1,highStartDate:'2026-10-19',cad:'w2',highSpeed:1.5,amount:1})),scheduledBefore);
});
console.log(JSON.stringify({realCourseData:true,sourceImmutable:true,externalWrites:0,cases:reports.length,reports},null,2));
console.log('OK: '+reports.length+' planned-envelope cases; elementary/middle/high/calculus exact refs, boundary merging, amount, labels and legacy parity.');
