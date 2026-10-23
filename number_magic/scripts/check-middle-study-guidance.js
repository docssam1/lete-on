#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const G=require('../app/middle-study-guidance.js');
let cases=0;
for(const grade of [1,2,3])for(const phase of ['mid','end'])for(const lang of ['ko','en','zh']){
  const options=Object.freeze({grade,phase,lang,choice:'interested'}),m=G.model(options);
  assert.equal(m.grade,grade);assert.equal(m.phase,phase);assert.equal(m.lang,lang);
  assert.match(m.core,/2\.5/);assert.match(m.total,/4/);assert.match(m.extra,/1\.5/);
  assert(m.noChoice&&m.unchanged&&m.interested&&m.continue&&m.example);
  assert.notEqual(m.core,m.total);cases++;
}
for(const options of [{grade:0,phase:'mid'},{grade:4,phase:'end'},{grade:1,phase:'other'}])assert.equal(G.model(options),null);
assert.match(G.model({grade:3,phase:'end',lang:'ko'}).example,/세제곱의 합·차/);
assert.equal(G.model({grade:1,phase:'mid',lang:'ko'}).continue,'기본 학습 계속');
assert.equal(G.model({grade:1,phase:'end',lang:'ko'}).continue,'다음 연산 과정 보기');
assert.equal(G.model({grade:1,phase:'mid',lang:'unknown'}).lang,'ko');
console.log('MIDDLE_STUDY_GUIDANCE_OK models='+cases+' validScopes=3 optionalGuidance=true');
