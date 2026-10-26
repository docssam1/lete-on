#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;vm.createContext(w);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
for(const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const file=match[1].split(/[?#]/)[0];if(!/^(engine\/|data\/)/.test(file))continue;
  if(file==='data/high-pacing.js')break;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w,{filename:file});
  if(file==='data/courses.js')break;
}
const H=require('../data/high-pacing.js'),P=require('../app/learning-plan.js'),courses=w.NM_COURSES;
const canonical=JSON.stringify(courses),sourceArrays=new Map(Object.values(courses).map(c=>[c,c.sessions]));
H.attach(courses);
assert.equal(JSON.stringify(courses,(key,value)=>key==='studyPlan'?undefined:value),canonical,'source content unchanged');
const calc=['C70','C71','C72','C73'];
assert.deepEqual(calc.map(key=>courses[key].sessions.length),[5,4,6,5]);
assert.equal(calc.reduce((n,key)=>n+courses[key].sessions.filter(s=>s.test).length,0),4,'four original checks');
assert.equal(calc.reduce((n,key)=>n+H.length(courses[key]),0),20,'twenty whole source lessons');
assert.equal(calc.reduce((n,key)=>n+H.durationUnits(courses[key]),0),24,'twenty-four calendar units');
for(const key of calc){
  const course=courses[key];
  assert.equal(course.sessions,sourceArrays.get(course),'source array identity preserved');
  assert.equal(course.studyPlan.version,'20261026-calculus3m-v2');
  assert.equal(course.studyPlan.weeksW2,course.sessions.length*6/5/2);
  for(const lesson of course.studyPlan.lessons){
    assert.deepEqual(lesson.sourceIndices,[lesson.index],'one source session per lesson');
    assert.equal(lesson.scheduleUnits,6/5);
    assert.equal(H.lessonUnits(course,lesson.index),6/5);
    assert.deepEqual(H.select(course,{startSession:lesson.index+1}),lesson,'legacy start returns the same whole lesson');
    assert.equal(H.durationUnits(course,lesson.index+1),(course.sessions.length-lesson.index)*6/5);
    const source=course.sessions[lesson.index];
    if(source.test){
      const questions=source.pool.reduce((n,item)=>n+(item.n||8),0);
      assert.equal(lesson.estimatedTestMinutes,questions*70/60,'calculus check uses seventy seconds per question');
    }
  }
  assert.equal(H.durationUnits(course,course.sessions.length+1),0);
  assert.equal(H.weeks(course,'w2'),Math.ceil(course.sessions.length*6/5/2));
}
for(const tier of ['highmath1','highmath2','algebra']){
  const band=Object.values(courses).filter(c=>c.tier===tier);
  assert.equal(band.reduce((n,c)=>n+H.length(c),0),24,'existing high lesson counts');
  assert.equal(band.reduce((n,c)=>n+H.durationUnits(c),0),24,'existing high calendar units');
  band.forEach(c=>assert.equal(c.studyPlan.version,'20261026-high3m-v2'));
}
const attached=JSON.stringify(courses),startDate='2026-10-26',start=Date.parse(startDate),WEEK=604800000;
function weekKey(offset){
  const monday=new Date(start+offset*WEEK),year=new Date(+monday+3*86400000).getUTCFullYear();
  const jan4=new Date(Date.UTC(year,0,4)),first=+jan4-((jan4.getUTCDay()+6)%7)*86400000;
  return year+'-W'+String(1+Math.round((+monday-first)/WEEK)).padStart(2,'0');
}
function audit(courseKey,startSession,cadence,speed){
  const expected=[],ordered=Object.entries(courses).filter(([,c])=>c.studyPlan)
    .sort((a,b)=>a[1].order-b[1].order);
  const base=ordered.findIndex(([key])=>key===courseKey);
  for(const [offset,[key,course]]of ordered.slice(base).entries()){
    const first=offset?0:H.lessonIndex(course,startSession);
    for(const lesson of course.studyPlan.lessons.slice(first)){
      const sourceIndices=lesson.sourceIndices.filter(index=>offset||lesson.index!==first||index>=startSession-1);
      if(sourceIndices.length)expected.push({key,index:lesson.index,sourceIndices,
        ticks:course.tier==='calculus1'?6:5});
    }
  }
  const ticks=expected.reduce((n,ref)=>n+ref.ticks,0),percent=Math.round(speed*100),perWeek=cadence==='w2'?2:1;
  const complete=Math.ceil(ticks*100/(perWeek*percent*5)),seen=[],sourceSeen=[],ends={};
  for(let week=0;week<=complete;week++){
    const selected=[];
    for(const k of [1,2]){
      const result=H.assignment(courses,{courseKey,startSession,startDate,weekKey:weekKey(week),cadence,speed,k});
      if(cadence==='w1'&&k===2)assert.equal(result,null,'no duplicate envelope at one per week');
      if(!result)continue;
      assert(week<complete,'no wrapping after completion');
      selected.push(...result.lessons);
    }
    let budget=0;
    const due=expected.filter(ref=>{
      budget+=ref.ticks;
      return budget*100>week*perWeek*percent*5&&budget*100<=(week+1)*perWeek*percent*5;
    });
    assert.deepEqual(selected.map(ref=>ref.courseKey+'#'+ref.lessonIndex),due.map(ref=>ref.key+'#'+ref.index),'integer budget assigns exact lessons');
    for(const ref of selected){
      seen.push(ref.courseKey+'#'+ref.lessonIndex);
      sourceSeen.push(...ref.sourceIndices.map(index=>ref.courseKey+'#'+index));
      ends[ref.courseKey]=week+1;
    }
  }
  assert.deepEqual(seen,expected.map(ref=>ref.key+'#'+ref.index),'every lesson once in order');
  assert.deepEqual(sourceSeen,expected.flatMap(ref=>ref.sourceIndices.map(index=>ref.key+'#'+index)),'every retained source once');
  const settings={courseKey,sessionIndex:startSession,startDate,cadence,speed,pace:'p2',entryYear:2020};
  const saved=JSON.stringify(settings),projection=P.project(courses,settings,{now:startDate,months:36});
  for(const milestone of projection.milestones){
    assert.equal((Date.parse(milestone.date)-start)/WEEK,ends[milestone.key],
      `${courseKey}/${startSession}/${cadence}/${speed}: calendar matches assignment ${milestone.key}`);
  }
  assert.equal(JSON.stringify(settings),saved,'personal settings remain unchanged');
  return {complete,ends};
}
let cases=0;
for(const key of calc)for(let session=1;session<=courses[key].sessions.length;session++)
  for(const cadence of ['w1','w2'])for(const speed of [.7,.85,1,1.25,1.5]){
    audit(key,session,cadence,speed);cases++;
  }
for(const key of ['C29','C37','C38','C49','C58','C69'])
  for(const cadence of ['w1','w2'])for(const speed of [.7,.85,1,1.25,1.5]){
    audit(key,courses[key].sessions.length,cadence,speed);cases++;
  }
const exact=audit('C70',1,'w2',1);
assert.equal(exact.complete,12);
assert.deepEqual(calc.map(key=>exact.ends[key]),[3,6,9,12]);
assert.equal(audit('C70',1,'w1',1).complete,24,'explicit slower personal cadence retained');
assert.equal(audit('C70',1,'w2',1.5).complete,8);
assert.equal(audit('C70',1,'w2',.7).complete,18);
const standard=P.standard(courses,{courseKey:'C70',startDate,cadence:'w1',speed:.7},{now:startDate});
assert.equal((Date.parse(standard.milestones.at(-1).date)-start)/WEEK,12,'reference standard uses twelve weeks');
const four=audit('C38',1,'w2',1);
assert.deepEqual(['C48','C57','C69','C73'].map(key=>four.ends[key]),[12,24,36,48],'four distinct high subjects each twelve weeks');
assert.equal(JSON.stringify(courses),attached,'all calendars preserve source and study plans');
console.log('CALCULUS_PACING_OK cases='+cases+' sourceSessions=20 checks=4 units=24 standardWeeks=12 speeds=5 partialStarts=20 crossBoundary=true canonicalMutation=0');
