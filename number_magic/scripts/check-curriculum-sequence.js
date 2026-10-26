#!/usr/bin/env node
'use strict';
// Inspect the same ordered school/application blocks used by delivery. No
// network, generated files, or student data; optional old-source comparison.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const arg=name=>(process.argv.find(x=>x.startsWith(name+'='))||'').slice(name.length+1);
function load(source){
  const w={console};w.window=w;const ctx=vm.createContext(w);
  const files=['data/threads.js',...['1-3','4-6','7-9','10-12','13-15'].map(g=>'data/g1/'+g+'-threads.js'),'data/wordable.js'];
  for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
  vm.runInContext(source,ctx,{filename:'courses.js'});
  for(const f of ['data/high-pacing.js','data/middle-extension.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
  return w;
}
const key=d=>d.t+'@'+d.lv;
const required={
  C59:['MD38@1','MD38@2','MD38@4'],
  C71:['MD44@4','MD44@5','MD44@1','MD44@2','MD44@3','MD154@1','MD154@2','MD154@3'],
  C72:['MD45@1','MD45@2','MD155@1','MD155@2','MD156@1','MD60@1','MD60@2','MD157@1','MD157@2','MD156@2','MD158@1','MD158@2','MD156@3','MD157@3','MD158@3'],
  C73:['MD46@1','MD46@2','MD46@3','MD159@1','MD61@1','MD62@2','MD159@2','MD61@2','MD62@3','MD159@3']
};
function prerequisites(course,d,role){
  const t=d.t,lv=d.lv;
  if(course==='C71'){
    if(t==='MD44'&&lv===5)return ['MD44@4'];
    if(t==='MD44'&&lv<=3)return ['MD44@5'];
  }
  if(course==='C72'){
    if(t==='MD157')return ['MD60@2','MD156@1'];
    if(t==='MD158')return ['MD157@1','MD60@2'];
  }
  if(course==='C73'&&(t==='MD159'||t==='MD61'||(t==='MD62'&&lv>=2)))return ['MD46@3'];
  if(course==='C35'&&t==='MD83'&&lv===5)return ['MD18@1'];
  if(course==='C36'&&t==='MD66')return ['MD20@1','MD20@2'];
  if(role!=='application'||!['C29','C30','C31','C36','C37'].includes(course))return [];
  if(d.kind==='drawing')return d.mode==='direct'?['MD68@1','MD51@1']:d.mode==='inverse'?['MD68@1','MD69@1']:d.mode==='quadratic'?['MD78@1','MD79@1']:[];
  if(t==='MD89')return ['MD2@1'];
  if(t==='MD70')return ['MD50@1'];
  if(t==='MD77')return ['MD20@2','MD66@1'];
  if(t==='MD85'&&lv>=2)return ['MD85@1'];
  if(t==='MD86'&&lv>=2)return lv>=4?['MD86@1','MD86@2','MD86@3']:['MD86@1'];
  if(t==='MD87'&&lv>=2)return lv>=4?['MD87@1','MD87@3']:['MD87@1'];
  return [];
}
function audit(courses){
  const learned=new Set(),issues=[],coverage={};
  for(const [id,c] of Object.entries(courses)){
    const taught=new Set();
    c.sessions.forEach((s,i)=>{
      if(s.test)return;
      const blocks=[...(s.school||[]).map(d=>[d,'school']),...((s.strategy||{}).practice||[]).map(d=>[d,'strategy']),...(s.application||[]).map(d=>[d,'application'])];
      for(const [d,role] of blocks){
        for(const p of prerequisites(id,d,role))if(!learned.has(p))issues.push(id+' s'+(i+1)+' '+role+' '+key(d)+' before '+p);
        taught.add(key(d));learned.add(key(d));
      }
    });
    coverage[id]=[...taught];
    for(const pin of required[id]||[])if(!taught.has(pin))issues.push(id+' required pin absent: '+pin);
    if(required[id])for(const s of c.sessions.filter(s=>s.test))for(const d of s.pool||[])if(!taught.has(key(d)))issues.push(id+' unpractised assessment '+key(d));
  }
  return {issues,coverage};
}
const world=load(fs.readFileSync(arg('--courses')||path.join(root,'data/courses.js'),'utf8'));
const C=world.NM_COURSES,result=audit(C);
if(process.argv.includes('--expect-regressions')){
  assert(result.issues.length>0,'old source must expose the curriculum gaps');
  console.log(JSON.stringify({status:'EXPECTED REGRESSIONS',...result},null,2));process.exit(0);
}
assert.deepEqual(result.issues,[],'ordered prerequisites and required skill coverage');
assert.equal(Object.keys(C).length,74);
assert.equal(Object.values(C).reduce((n,c)=>n+c.sessions.length,0),551);
assert.equal(C.C0.sessions.length,19);
for(const [i,s] of C.C0.sessions.entries()){
  assert.equal([...s.school,...s.strategy.practice,...s.application].reduce((n,d)=>n+d.count,0),60);
  assert.equal(s.c0.symbols,i===18);
}
for(const tier of ['middle1','middle2','middle3']){
  const band=Object.values(C).filter(c=>c.tier===tier);
  assert.equal(band.reduce((n,c)=>n+c.studyPlan.lessons.length,0),20,tier+' fixed core duration');
  assert.equal(world.NM_MIDDLE_EXTENSION.length(Number(tier.slice(-1))),12,'optional extension duration');
}
for(const tier of ['highmath1','highmath2','algebra','calculus1'])assert.equal(
  Object.values(C).filter(c=>c.tier===tier).reduce((n,c)=>n+world.NM_HIGH_PACING.durationUnits(c),0),24,tier+' fixed duration');
for(const [id,n] of [['C71',24],['C72',56],['C73',40]]){
  const c=C[id];assert.equal(c.sessions.at(-1).pool.reduce((sum,d)=>sum+d.n,0),n,id+' assessment question total');
  for(const s of c.sessions.filter(s=>!s.test)){
    assert(s.minutes>=20&&s.minutes<=35,id+' independent-work budget');
    for(const d of s.school)assert(d.count>=6&&d.count%6===0,id+' six-question skill blocks');
  }
}
if(arg('--baseline')){
  const before=load(fs.readFileSync(arg('--baseline'),'utf8')).NM_COURSES;
  assert.equal(JSON.stringify(C.C0),JSON.stringify(before.C0),'C0 remains byte-for-byte identical data');
  const allowed=new Set(['C29','C30','C31','C35','C36','C37','C59','C71','C72','C73']);
  for(const id of Object.keys(C)){
    assert.equal(C[id].sessions.length,before[id].sessions.length,id+' canonical source count');
    assert.equal(C[id].order,before[id].order,id+' stable course order');
    if(!allowed.has(id))assert.equal(JSON.stringify(C[id]),JSON.stringify(before[id]),id+' unchanged');
  }
}
// Mutation checks demonstrate that this audit rejects both types of regression.
const mutated=JSON.parse(JSON.stringify(C));
for(const s of mutated.C73.sessions)s.school=(s.school||[]).filter(d=>key(d)!=='MD62@2');
assert(audit(mutated).issues.some(x=>x==='C73 required pin absent: MD62@2'));
const reversed=JSON.parse(JSON.stringify(C));
const s=reversed.C30.sessions[0];s.school=s.school.filter(d=>d.t!=='MD50');
assert(audit(reversed).issues.some(x=>x.includes('C30 s1 application MD70@1 before MD50@1')));
console.log(JSON.stringify({status:'PASS',courses:74,sourceSessions:551,requiredPins:Object.values(required).reduce((n,a)=>n+a.length,0),mutationsRejected:2,
  plans:Object.fromEntries(['C29','C30','C31','C35','C36','C37','C59','C71','C72','C73'].map(id=>[id,C[id].sessions.map((s,i)=>({session:i+1,school:(s.school||[]).map(key),application:(s.application||[]).map(key),assessment:(s.pool||[]).map(key),minutes:s.minutes}))]))},null,2));
