#!/usr/bin/env node
'use strict';
// 2026-10-15 supersedes the 10-04 automatic-increase contract.
// All scores/goals preserve current workload; next-stage probes cannot increase it.
const assert=require('assert');
const P=require('../data/placement-paths.js');
const values=[.7,.85,1,1.25,1.5];
let n=0;
for(const goal of ['curriculum','competition','science'])for(const cadence of ['w1','w2'])
  for(let previous=0;previous<=6;previous++)for(let current=0;current<=10;current++)for(let next=0;next<=4;next++){
    const r={bands:{previous:{correct:previous},current:{correct:current},next:{correct:next}}};
    const sel={goal,cadence};
    for(const speed of values)for(const amount of values){
      const before=JSON.stringify([r,sel]);
      const out=P.autoPlan(r,sel,{speed,amount});
      assert.equal(out.version,'observe-plan-v2');assert.equal(out.speed,speed);assert.equal(out.amount,amount);
      assert.equal(out.applied,false);assert.equal(out.basis,'observe');assert.equal(out.cadence,cadence);
      assert.equal(JSON.stringify([r,sel]),before,'do not mutate evidence');
      for(const line of out.reasons.concat(out.note))for(const lang of ['ko','en','zh'])assert(line[lang]);
      n++;
    }
    const out=P.autoPlan(r,sel);assert.equal(out.speed,1);assert.equal(out.amount,1);
  }
assert.throws(()=>P.autoPlan(null,{}),/required/);
assert.equal(P.autoPlan({bands:{}},{},{speed:Infinity,amount:99}).speed,1);
assert.equal(P.autoPlan({bands:{}},{cadence:'w2'},{cadence:'w1'}).cadence,'w1');
console.log('PLACEMENT_OBSERVE_OK cases='+n+' automaticChanges=0');
