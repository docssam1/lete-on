'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const D=require('../app/diagnostic-roadmap.js'),P=require('../app/learning-plan.js');
const now='2026-10-22T03:00:00Z';
assert.equal(D.profile({age:'',profileGrade:'e3'},now),null);
assert.equal(D.profile({age:'10',profileGrade:''},now),null);
assert.equal(D.profile({age:'10',profileGrade:'m4'},now),null);
const p=D.profile({age:'11',profileGrade:'e4'},now);assert.equal(p.birthYear,2016);assert.equal(p.entryYear,2023);
assert.equal(D.profile(p,'2027-01-01T00:00Z').age,'12');assert.equal(D.profile(p,'2027-01-01T00:00Z').profileGrade,'e4');
assert.equal(D.profile(p,'2027-03-01T00:00Z').profileGrade,'e5');assert.equal(D.profile(p,'2027-03-01T00:00Z').entryYear,2023);
assert.equal(D.addMonths('2026-10-31T00:00Z',2).toISOString().slice(0,10),'2026-12-31');
assert.equal(D.addMonths('2026-12-31T00:00Z',2).toISOString().slice(0,10),'2027-02-28');
global.window={};require('../data/threads.js');const {NM_COURSES:c}=require('../data/courses.js'),before=JSON.stringify(c);
for(const courseKey of ['C1','C29','C32','C38','C45']){
 const q=P.project(c,{courseKey,entryYear:p.entryYear,birthYear:p.birthYear,startDate:'2026-10-22',cadence:'w2',speed:1,sessionIndex:2},{now,months:24});
 assert.equal(q.rows[0].courseKeys[0],courseKey);assert.equal(q.rows[0].schoolLabel,'초4 10월');assert.equal(q.rows.find(r=>r.month==='2027-03').schoolLabel,'초5 3월');
 assert(q.milestones.length>0);assert(q.milestones.every(m=>m.date>='2026-10-22'));assert.equal(q.milestones[0].key,courseKey);
}
assert.equal(JSON.stringify(c),before);
const w={};w.window=w;vm.runInNewContext(fs.readFileSync(require.resolve('../data/diagnostic-reference.js'),'utf8'),w);
const ref=w.NM_DIAGNOSTIC_REFERENCE,source=require('../../roadmap/v31/data/source-monthly.json');
assert.equal(ref.sourceSHA256,crypto.createHash('sha256').update(fs.readFileSync(require.resolve('../../roadmap/v31/data/source-monthly.json'))).digest('hex'));
assert(ref.rows.some(r=>/필즈 S2/.test(r.name)));assert(ref.rows.some(r=>/소마 프리미어/.test(r.name)));assert(ref.rows.some(r=>/이과 최상위/.test(r.note)));
for(const r of ref.rows.filter(r=>r.source==='build35')){const sec=source.sections.find(s=>s.id===r.section),orig=sec.rows.find(x=>x.id===r.id),blocks=orig.blocks.filter(x=>x.label);assert.equal(r.blocks.length,blocks.length);r.blocks.forEach((b,i)=>{assert.equal(b.from,sec.columns[blocks[i].start].label);assert.equal(b.to,sec.columns[blocks[i].end].label);assert.equal(b.label,blocks[i].label.replace(/\|/g,' '));});}
const html=fs.readFileSync(require.resolve('../../roadmap/index.html'),'utf8');
assert.equal(ref.currentSHA256,crypto.createHash('sha256').update(html).digest('hex'));
const first=ref.rows.find(r=>r.id==='current:L0:calc'),last=ref.rows.find(r=>r.id==='current:L4:calc');
assert.equal(first.blocks[0].label,'소마셈 K 수 감각·기초 연산');assert.equal(first.blocks[0].from,'5세 1월');assert.equal(first.blocks[0].to,'5세 9월');assert.equal(first.blocks[0].outside,true);
assert.equal(last.blocks.at(-1).to,'8세 7월');assert.equal(last.blocks.at(-1).outside,true);
assert.equal(ref.rows.filter(r=>r.source==='current').length,5);
for(const key of ['C1','C29','C38']){
 const settings={courseKey:key,entryYear:p.entryYear,startDate:'2026-10-22',cadence:'w1',speed:1};
 const standard=P.project(c,settings,{now}),fast=P.project(c,{...settings,speed:1.5},{now}),slow=P.project(c,{...settings,speed:0.7},{now});
 assert(fast.milestones.at(-1).date<standard.milestones.at(-1).date);assert(slow.milestones.at(-1).date>standard.milestones.at(-1).date);
}
console.log('DIAGNOSTIC_ROADMAP_OK required profile, actual grade independent of middle/high topics, January/March transitions, two calendar months, source spans and immutable progress');
