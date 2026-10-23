"use strict";
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require.resolve('../app/main.js'),'utf8');
const guidance=source.slice(source.indexOf('function middleStudyGuidanceState(){'),source.indexOf('function renderPersonalPlan(){'));
const schedule=source.slice(source.indexOf('function highWeeklySchedule(courseKey){'),source.indexOf('function updateWeeklyDigest(){'));
const courses={C29:{order:29,tier:'middle1',studyPlan:{},units:['a','b']},C30:{order:30,tier:'middle1',units:['c','d']},C31:{order:31,tier:'middle1',units:['e','f']},C32:{order:32,tier:'middle2',units:['g','h']},C38:{order:38,tier:'highmath1'}};
const w={S:{progress:{},roadCadence:'w1',coins:17},current:'C29',Date};w.window=w;w.NM_COURSES=courses;w.NM_HIGH_PACING={};w.currentCourseKey=()=>w.current;w.courseUnitIds=c=>c.units||[];w.stepDone=(id,key)=>!!w.S.progress[id]?.steps?.[key];vm.createContext(w);vm.runInContext(guidance+schedule,w);
let cases=0;
function unchangedRun(){const before=JSON.stringify(w.S),out=w.middleStudyGuidanceState();assert.equal(JSON.stringify(w.S),before,'guidance must be read-only');cases++;return out;}
assert.equal(unchangedRun(),null);
w.S.progress={a:{steps:{stamp:true}},b:{steps:{stamp:true}},c:{steps:{stamp:true}}};assert.equal(unchangedRun().phase,'mid');
w.S.middleStudyGuidanceChoices={'1:mid':'continue'};assert.equal(unchangedRun(),null);
w.S.middleStudyGuidanceChoices={'1:mid':'interested'};assert.equal(unchangedRun().choice,'interested');
for(const id of ['a','b','c','d','e','f'])w.S.progress[id]={steps:{stamp:true}};
w.current='C31';assert.equal(unchangedRun().phase,'end');
w.current='C32';assert.equal(unchangedRun().grade,1,'completion notice can coexist with the next course');
w.S.middleStudyGuidanceChoices['1:end']='continue';assert.equal(unchangedRun(),null);
w.current='C38';assert.equal(unchangedRun(),null);
for(const mode of ['default','manual','admin']){
 w.S={progress:{keep:true},coins:17,roadCadence:'w1',highSchedule:{courseKey:'C29',sessionIndex:3,startDate:'2026-10-19'}};
 if(mode==='manual')w.S.roadManual=true;
 if(mode==='admin')w.S.adminPlan={courseKey:'C29',sessionIndex:3,startDate:'2026-10-19',cadence:'w1'};
 const p=JSON.stringify(w.S.progress);w.highWeeklySchedule('C29');assert.equal(w.S.roadCadence,mode==='default'?'w2':'w1');assert.equal(w.S.highSchedule.startDate,'2026-10-19');assert.equal(JSON.stringify(w.S.progress),p);assert.equal(w.S.coins,17);cases++;
}
console.log('MIDDLE_GUIDANCE_STATE_OK cases='+cases+' progressPreserved=true unmanagedDefault=W2 manualAndAdminPreserved=true');
