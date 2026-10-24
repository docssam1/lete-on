#!/usr/bin/env node
'use strict';
// Actual registered levels/generators; fake DOM/storage. No student or server IO.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),w={console,Math,JSON,Date,Set,Map,URL,URLSearchParams,setTimeout,clearTimeout};
w.window=w;w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
let writes=0;w.localStorage={getItem:()=>null,setItem(){writes++;throw Error('content cannot write storage');}};
vm.createContext(w);const load=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w,{filename:file});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
for(const tag of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
 const file=tag[1].split(/[?#]/)[0];if(!/^(engine\/|data\/)/.test(file)||file==='data/middle-extension.js')continue;
 load(file);if(file==='data/high-pacing.js')break;
}
load('app/exam.js');const api=w.NM_EXAM,C=w.NM_COURSES,plain=x=>JSON.parse(JSON.stringify(x));
const original=JSON.stringify(C),baseCounts=[1,2,3].map(g=>Object.values(C).filter(c=>c.tier==='middle'+g).reduce((n,c)=>n+c.studyPlan.lessons.length,0));
const legacy=JSON.stringify(api.weeklyEnvelope(C.C31,'C31','2026-W43',{compactHigh:true,lesson:0,amount:1}));
function freeze(value){if(!value||typeof value!=='object'||Object.isFrozen(value))return;Object.values(value).forEach(freeze);Object.freeze(value);}freeze(C);
// The extension module may load after the exam module. Consumers must look it up
// dynamically rather than caching an undefined global at script initialization.
load('data/middle-extension.js');const E=w.NM_MIDDLE_EXTENSION,report={version:E.version,bundles:0,envelopes:0,problemSets:0,questions:0,grades:[],externalWrites:0};
assert.equal(E.version,'20261024-middle-extension1');
const badText=value=>/undefined|NaN/.test(JSON.stringify(value));
for(const grade of [1,2,3]){
 const course=E.course(grade),titles=new Set(),shapes=new Set();assert.equal(E.length(grade),12);assert.equal(course.sessions.length,12);assert.equal(course.studyPlan,undefined);
 const source=JSON.stringify(course),coreThreads=new Set(Object.values(C).filter(c=>c.tier==='middle'+grade).flatMap(c=>c.sessions.flatMap(s=>(s.drills||[]).concat(s.creative||[],s.pool||[]).map(d=>d.t+'@'+d.lv))));
 const selected=new Set(),connections=new Set();
 for(const [index,session]of course.sessions.entries()){
  assert.equal(session.id,`M${grade}E-${String(index+1).padStart(2,'0')}`);assert.equal(session.test,false);assert(session.estimatedMinutes>0);
  for(const lang of ['ko','en','zh'])assert(typeof session.title[lang]==='string'&&session.title[lang].length>0);
  titles.add(session.title.ko);shapes.add(session.drills.map(d=>d.t+'@'+d.lv).join('|'));
  assert(session.contentNote.ko.includes('새 유형 12개를 뜻하지 않습니다'));
  const ref=E.reference(grade,index);assert.equal(ref.kind,'middle-extension');assert.equal(ref.extensionId,session.id);assert.equal(ref.lessonIndex,index);assert.equal(ref.extensionIndex,index);assert.equal(ref.scheduleUnits,1);assert.equal(ref.estimatedMinutes,session.estimatedMinutes);assert.deepEqual(plain(ref.sourceIndices),[]);
  assert.equal(ref.startSession,undefined,'extension is not a canonical core session');
  for(const d of session.drills){const th=w.NM_THREADS[d.t],lv=th?.levels.find(l=>l.id===d.lv);assert(th&&lv&&typeof w.NM_TGEN[th.gen]==='function',d.t+'@'+d.lv);assert(d.count>0);selected.add(d.t+'@'+d.lv);if(!coreThreads.has(d.t+'@'+d.lv))connections.add(d.t+'@'+d.lv);assert(!['MD25@1','MD25@2'].includes(d.t+'@'+d.lv),'existing core cube additions are not new extension content');}
  const single=api.plannedEnvelope([ref],'2026-W43',{amount:1,grade:grade+6,cad:'w2',name:'Content fixture'});
  assert(single?.cover.middleExtension);assert.deepEqual(plain(single.sourceSessions),[]);assert.deepEqual(plain(single.assignedExtensionIds),[session.id]);assert(single.cover.courseTitle.includes('선택 심화'));
  assert(single.items.every(it=>it.middleExtension&&it.extensionId===session.id&&it.sourceSession===session.id&&it.legacySession===undefined&&it.sessionLabel.includes('심화')));
  assert.equal(single.items.length,session.drills.length);assert.equal(single.items.reduce((n,it)=>n+it.count,0),24);report.bundles++;
 }
 assert.equal(titles.size,12);assert.equal(shapes.size,12,'new combinations, not a repeated core bundle');assert.equal(JSON.stringify(course),source);
 // Two actual bundles per week, all five supported practice amounts. Reserve
 // questions across the whole envelope so the same visible question cannot fill
 // a second block. Canonical source levels remain untouched throughout.
 for(const amount of [.7,.85,1,1.25,1.5])for(let week=0;week<6;week++){
  const refs=[E.reference(grade,week*2),E.reference(grade,week*2+1)],e=api.plannedEnvelope(refs,'2026-W'+String(43+week),{amount,grade:grade+6,cad:'w2'}),seen=new Set();assert(e);assert.equal(e.lessons.length,2);assert.equal(e.cover.amount,amount);assert.equal(e.courseSessions,12);assert.equal(e.cover.extensionVersion,E.version);
  for(const it of e.items){
   const problems=api.buildProblems(it.thread,it.level,it.count,w.NM_RNG.hashSeed(it.seed),null,null,seen);
   assert.equal(problems.length,it.count);assert.equal(badText(problems),false,it.thread+'@'+it.level);
   const keys=problems.map(api.problemKey);assert.equal(new Set(keys).size,keys.length);assert(problems.every(p=>p.answer!=null&&(p.tex||p.prompt?.ko)));
   report.problemSets++;report.questions+=problems.length;
  }
  assert.equal(e.sourceSessions.length,0);report.envelopes++;
 }
 report.grades.push({grade,bundles:12,weeks:6,selectedLevels:selected.size,outsideCurrentGradeCore:[...connections].sort()});
}
// An ordinary core boundary may share a week with extension 1. Only the genuine
// core indices remain in sourceSessions; extension must not masquerade as C31-S1.
const coreLesson=C.C31.studyPlan.lessons.at(-1),coreRef={courseKey:'C31',lessonIndex:coreLesson.index,startSession:coreLesson.startSession,sourceIndices:plain(coreLesson.sourceIndices)};
const combined=api.plannedEnvelope([coreRef,E.reference(1,0)],'2026-W43',{amount:1,cad:'w2'});assert(combined);assert.deepEqual(plain(combined.sourceSessions),plain(coreLesson.sourceIndices.map(i=>i+1)));assert(combined.cover.courseTitle.includes('C31')&&combined.cover.courseTitle.includes('선택 심화'));
const r=E.reference(1,0);for(const invalid of [{...r,extensionId:'M1E-99'},{...r,courseKey:'C30'},{...r,sourceIndices:[0]},{...r,lessonIndex:4},{...r,grade:4}])assert.equal(api.plannedEnvelope([invalid],'2026-W43',{amount:1}),null);
w.NM_MIDDLE_EXTENSION=undefined;assert.equal(api.plannedEnvelope([r],'2026-W43',{amount:1}),null);w.NM_MIDDLE_EXTENSION=E;
assert.deepEqual(baseCounts,[20,20,20]);assert.equal(JSON.stringify(C),original);assert.equal(JSON.stringify(api.weeklyEnvelope(C.C31,'C31','2026-W43',{compactHigh:true,lesson:0,amount:1})),legacy);assert.equal(writes,0);
// Compare the unchanged API with the actual pre-extension implementation, not
// merely with another invocation of the implementation under test.
const baselineWindow={...w};baselineWindow.window=baselineWindow;vm.createContext(baselineWindow);
vm.runInContext(execFileSync('git',['show',(process.env.NM_EXTENSION_BASELINE_REF||'7528c427cfc5de13ac9ac8515baba05e5c35c8bf')+':number_magic/app/exam.js'],{cwd:path.resolve(root,'..'),encoding:'utf8',maxBuffer:4*1024*1024}),baselineWindow,{filename:'pre-extension-exam.js'});
const coreCases=[
 [{courseKey:'C4',startSession:2},{courseKey:'C5',startSession:1}],
 [{courseKey:'C38',lessonIndex:0,startSession:1},{courseKey:'C39',lessonIndex:0,startSession:1}],
 [{courseKey:'C36',lessonIndex:C.C36.studyPlan.lessons.length-1,startSession:C.C36.studyPlan.lessons.at(-1).startSession}]
];
for(const refs of coreCases)assert.equal(JSON.stringify(api.plannedEnvelope(refs,'2026-W43',{amount:1.25,cad:'w2',grade:8})),JSON.stringify(baselineWindow.NM_EXAM.plannedEnvelope(refs,'2026-W43',{amount:1.25,cad:'w2',grade:8})),'ordinary planned envelopes remain byte-identical');
assert.equal(E.length(4),0);assert.equal(E.course(4),null);assert.equal(E.reference(1,12),null);
console.log(JSON.stringify({...report,coreBundlesUnchanged:baseCounts,legacyEnvelopeUnchanged:true,corePlannedApiByteParity:coreCases.length,lateModuleLookup:true},null,2));
console.log('OK: 36 actual extension bundles, 90 weekly envelopes across five amounts, unique generated questions, truthful labels and unchanged core sources.');
