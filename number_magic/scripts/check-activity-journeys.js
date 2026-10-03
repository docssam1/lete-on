#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../data/activity-journeys.js'),'utf8');
const load=s=>import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));
(async()=>{
 const api=await load(source);let tests=0;
 const apply=(s,a,v,id)=>{const n=api.act(s,a,v,id);api.assertJourney(n);tests++;return n;};
 function solveTen(s){let v=api.view(s);if(v.word)s=apply(s,'model','+');s=apply(s,'predict',10-v.a);s=apply(s,'begin');for(const o of v.objects.filter(o=>o.origin==='right').slice(0,10-v.a))s=apply(s,'select',o.id);s=apply(s,'move');s=apply(s,'group');s=apply(s,'submit',v.a+v.b);s=apply(s,'meaning','moved');return s;}
 function solveInteger(s){const v=api.view(s);if(v.word)s=apply(s,'model','+');s=apply(s,'start',v.a);s=apply(s,'face',Math.sign(v.b));s=apply(s,'walk',v.op==='+'?1:-1);s=apply(s,'count',Math.abs(v.b));for(let i=0;i<Math.abs(v.b);i++)s=apply(s,'step','one');s=apply(s,'submit',v.a+(v.op==='+'?v.b:-v.b));s=apply(s,'meaning','roles');return s;}
 const g=(a,b)=>b?g(b,a%b):a;
 function solveCommon(s){let v=api.view(s),G=g(v.a,v.b),L=v.a*v.b/G;if(v.word)s=apply(s,'model',v.word);
  if(v.word!=='meet'){for(let n=1;n<=Math.max(v.a,v.b);n++){s=apply(s,'tryGroup',n);if(v.a%n===0&&v.b%n===0)s=apply(s,'common',n);}s=apply(s,'greatest',G);}
  if(v.word!=='divide'){for(let i=0;i<L/v.a;i++)s=apply(s,'track','A');for(let i=0;i<L/v.b;i++)s=apply(s,'track','B');s=apply(s,'least',L);}
  if(v.word){assert.equal(api.equation(s),v.word==='divide'?`${v.a} m · ${v.b} m`:`${v.a} 분 · ${v.b} 분`);assert.ok(!api.equation(s,'en').includes('null'));s=apply(s,'submit',v.word==='divide'?G:L);assert.equal(api.equation(s,'en'),v.word==='divide'?`${G} m`:`${L} min`);s=apply(s,'meaning',v.word);}
  else{s=apply(s,'array');s=apply(s,'regroup');const objects=api.view(s).objects;assert.equal(objects.length,v.a*v.b);const groups=Object.groupBy(objects,o=>o.group);assert.equal(Object.keys(groups).length,L);for(const group of Object.values(groups))assert.equal(group.length,G);s=apply(s,'groups',L);s=apply(s,'names','correct');s=apply(s,'product','multiply');s=apply(s,'submit',v.a*v.b);}
  return s;
 }
 let s=api.createJourney('A-02');assert.equal(api.equation(s),'8 + 7 = ?');assert.equal(api.view(s).objects.length,15);assert.equal(api.view(s).complete,false);
 s=apply(s,'begin');assert.equal(api.view(s).phase,0,'Prediction is required before manipulation');s=apply(s,'submit',15);assert.equal(api.view(s).verified,false);
 s=apply(s,'predict',2);s=apply(s,'begin');s=apply(s,'select','R03');s=apply(s,'move',null,'move-one');assert.equal(api.equation(s),'8 + 7 = ?');assert.deepEqual(api.current(s).moved,['R03']);assert.equal(api.view(s).objects.filter(o=>o.group==='left').length,9);
 const once=JSON.stringify(s);assert.equal(JSON.stringify(apply(s,'move',null,'move-one')),once,'duplicate action does not repeat movement');s=apply(s,'select','R04');s=apply(s,'move');assert.equal(api.equation(s),'8 + 7 = 8 + 2 + 5');assert.equal(api.view(s).grouped,false);
 s=apply(s,'undo');assert.deepEqual(api.current(s).moved,['R03']);assert.deepEqual(api.current(s).selection,['R04']);assert.equal(api.view(s).verified,false);
 s=api.restoreJourney('A-02',JSON.parse(JSON.stringify(s)));assert.deepEqual(api.current(s).moved,['R03']);s=apply(s,'move');s=apply(s,'group');assert.equal(api.equation(s),'8 + 2 + 5 = 10 + 5');s=apply(s,'submit',15);assert.equal(api.view(s).meaning,false);s=apply(s,'meaning','moved');assert.equal(api.view(s).complete,false);
 s=apply(s,'next');assert.equal(api.view(s).objects.length,14);assert.equal(api.equation(s),'9 + 5 = ?');assert.ok(api.view(s).objects.every(o=>/^NT|^NA/.test(o.id)));s=solveTen(s);s=apply(s,'next');assert.equal(api.view(s).objects.length,13);assert.ok(api.view(s).objects.every(o=>/^WT|^WA/.test(o.id)));s=solveTen(s);s=api.finalize(s);assert.equal(api.view(s).complete,true);assert.equal(s.completed.reward,0);assert.equal(api.finalize(s).completed.id,s.completed.id);
 const archive=s.completed.id;s=apply(s,'undo');assert.equal(api.view(s).complete,false);assert.equal(s.completed.id,archive,'review undo preserves historic completion');s=apply(s,'hint');const helped=JSON.stringify(s.assistance),attempts=s.attempts.length;s=apply(s,'reset');assert.equal(JSON.stringify(s.assistance),helped);assert.equal(s.attempts.length,attempts);s=apply(s,'undo');assert.ok(api.view(s).verified);
 for(const uid of ['M-02','T-DV4']){let state=api.createJourney(uid);for(let i=0;i<api.scenes(uid).length;i++){state=uid==='M-02'?solveInteger(state):solveCommon(state);if(i<api.scenes(uid).length-1)state=apply(state,'next');}assert.equal(api.view(state).complete,true);assert.equal(api.finalize(state).completed.reward,0);}
 for(const op of ['+','-'])for(const b of [-3,3])for(const a of [-2,2]){
  const trial=await load(source.replace("{id:'concept',kind:'integer',a:-2,op:'+',b:-3}",`{id:'concept',kind:'integer',a:${a},op:'${op}',b:${b}}`));let p=trial.createJourney('M-02');const step=(action,value)=>p=trial.act(p,action,value);
  step('start',a);step('face',Math.sign(b));const pos=trial.view(p).position;step('walk',op==='+'?1:-1);assert.equal(trial.view(p).position,pos,'turning does not move');step('count',Math.abs(b));for(let i=0;i<Math.abs(b);i++)step('step','one');assert.deepEqual(trial.view(p).path,[0,a,...Array.from({length:Math.abs(b)},(_,i)=>a+(i+1)*Math.sign(b)*(op==='+'?1:-1))]);assert.equal(trial.view(p).face,Math.sign(b));assert.equal(trial.view(p).position,op==='+'?a+b:a-b);tests++;
 }
 const movement=await load(fs.readFileSync(path.join(__dirname,'../app/town3d/movement.js'),'utf8'));
 assert.deepEqual(movement.joystickVector(1,1),{x:0,z:0});
 const walk=fps=>{let p={x:0,z:0};for(let i=0;i<fps;i++)p=movement.moveSafely(p,{x:1,z:1},1/fps,()=>true);return Math.hypot(p.x,p.z);};
 for(const fps of [30,60,120])assert.ok(Math.abs(walk(fps)-4.2)<1e-8,'clock-normalized diagonal speed');
 let p=movement.moveSafely({x:0,z:0},{x:1,z:0},1, x=>x<.1);assert.ok(p.x<.1,'swept collision does not cross a wall');
 assert.equal(api.LINKS['T-DV4'].thread,'DV7');assert.equal(api.LINKS['M-02'].generator,'md2_intAddSub');
 console.log(`OK: ${tests} semantic actions/trials; stable IDs, conservation, undo, reload, non-scored transfer, all integer sign combinations, 24 groups of 2, deduplication, help retention and 30/60/120fps movement`);
})().catch(e=>{console.error(e);process.exitCode=1;});
