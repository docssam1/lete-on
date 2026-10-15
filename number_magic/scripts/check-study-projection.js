#!/usr/bin/env node
'use strict';
const assert=require('assert/strict');
// Independent small course fixture: 3 + 4 canonical sessions, start at session 2.
global.NM_COURSES={C0:{title:{ko:'기초'},sessions:[{},{},{}]},C1:{title:{ko:'다음'},sessions:[{},{},{},{}]}};
const P=require('../data/study-projection');
const input={startCourse:'C0',startSession:2,targetCourse:'C1',startDate:'2026-10-15',targetDate:'2026-11-12',frequency:2,minutes:20,holdWeeks:2,rampWeeks:2,reviewSessions:0,observedWeeks:2,observedVisits:4,completedSessions:4,observedMinutes:80,reviewed:true};
const before=JSON.stringify([input,global.NM_COURSES]),p=P.calculate(input);
assert.equal(p.remaining,6);assert.equal(p.scenarios[0].arrivalWeeks,3);assert.equal(p.scenarios[0].arrivalDate,'2026-11-05');
assert.equal(p.scenarios[1].arrivalWeeks,3,'extra time cannot be converted to unsupported progress');
for(const s of p.scenarios){assert.equal(s.points[1].done,2);assert.equal(s.points[2].done,4);assert.equal(s.points[2].frequency,2);assert.equal(s.points[2].minutes,20);}
const faster=p.scenarios[2];assert.equal(faster.points[3].frequency,2.5);assert.equal(faster.points[4].frequency,3);assert(faster.arrivalWeeks<3);
const observedRate=P.calculate({...input,frequency:1.47});assert.equal(observedRate.scenarios[0].points[1].done,1.47);assert.equal(observedRate.scenarios[2].points[1].frequency,1.47);assert.equal(observedRate.scenarios[2].finalFrequency,2.47);assert(Number.isInteger(observedRate.requiredFrequency),'required added schedule uses integer weekly visits');
const review=P.calculate({...input,reviewSessions:3});assert.equal(review.scenarios[0].points[1].done,0);assert.equal(review.scenarios[0].points[1].review,2);assert.equal(review.scenarios[0].arrivalWeeks,4.5);
const withheld=P.calculate({...input,reviewed:false});assert.equal(withheld.scenarios[2].arrivalWeeks,3);
assert.equal(JSON.stringify([input,global.NM_COURSES]),before);
const partial=P.calculate({...input,startSession:3,targetCourse:'C0',targetDate:'2026-10-19'});
assert.equal(partial.remaining,1);assert.equal(partial.scenarios[0].arrivalWeeks,.5);assert.equal(partial.scenarios[0].onTime,true);assert.equal(partial.scenarios[0].atDeadline,1);
const reviewPartial=P.calculate({...input,reviewSessions:1});
assert.equal(P.atWeek(reviewPartial,0,.25).done,0,'partial week spends review time before progressing');
assert.equal(P.atWeek(reviewPartial,0,.75).done,.5);
const earlyArrival=P.calculate({...input,startSession:3,targetCourse:'C0',frequency:4,reviewSessions:1});assert.equal(earlyArrival.scenarios[0].arrivalWeeks,.5,'review-first arrival uses full weekly capacity');
const dayEdge=P.calculate({...input,startSession:1,targetCourse:'C0',frequency:3,observedVisits:5,completedSessions:7,observedMinutes:100,targetDate:'2026-10-20'});
assert.equal(dayEdge.scenarios[0].arrivalDate,'2026-10-20');assert.equal(dayEdge.scenarios[0].position.complete,true);assert.equal(dayEdge.scenarios[0].atDeadline,3);
for(const change of [{observedWeeks:1},{observedVisits:0},{completedSessions:0},{observedMinutes:1},{frequency:0},{frequency:8},{holdWeeks:0},{minutes:15},{targetCourse:'C99'},{targetDate:'bad'},{startSession:0}])assert.throws(()=>P.calculate({...input,...change}));
let n=0;
for(const frequency of [1,2,4,7])for(const holdWeeks of [1,2,4])for(const rampWeeks of [1,2,4])for(const reviewSessions of [0,2,10]){
 const out=P.calculate({...input,frequency,holdWeeks,rampWeeks,reviewSessions});
 for(const s of out.scenarios){let done=-1;for(const point of s.points){assert(point.done>=done);assert(point.done<=out.remaining);done=point.done;assert(point.frequency<=7);if(point.week<=holdWeeks){assert.equal(point.frequency,frequency);assert.equal(point.minutes,20);}}}
 assert.equal(out.scenarios[1].arrivalWeeks,out.scenarios[0].arrivalWeeks);n++;
}
console.log('STUDY_PROJECTION_OK cases='+n+' delayedRamp=true additionalTimeCredit=0 writes=0');
