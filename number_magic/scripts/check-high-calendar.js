'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;vm.createContext(w);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const f=m[1].split(/[?#]/)[0];if(!/^(engine\/|data\/)/.test(f))continue;
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});if(f==='data/high-pacing.js')break;
}
const project=require('../app/learning-plan.js').project,c=w.NM_COURSES,H=w.NM_HIGH_PACING;
const original=JSON.stringify(c),startDate='2026-10-26',start=Date.parse(startDate),WEEK=7*86400000;
let cases=0,assignedEnvelopes=0;
function weekKey(offset){
  const monday=new Date(start+offset*WEEK),year=new Date(+monday+3*86400000).getUTCFullYear();
  const jan4=new Date(Date.UTC(year,0,4)),first=+jan4-((jan4.getUTCDay()+6)%7)*86400000;
  return year+'-W'+String(1+Math.round((+monday-first)/WEEK)).padStart(2,'0');
}
// Explicit business expectations, independent of the projection's duration
// formula: one subject has 24 lessons, and the three subjects have 72 lessons.
const subjectWeeks={w2:{'.7':18,'.85':15,'1':12,'1.25':10,'1.5':8},w1:{'.7':35,'.85':29,'1':24,'1.25':20,'1.5':16}};
const allWeeks={w2:{'.7':52,'.85':43,'1':36,'1.25':29,'1.5':24},w1:{'.7':103,'.85':85,'1':72,'1.25':58,'1.5':48}};
const speedKey=speed=>speed<1?String(speed).slice(1):String(speed);
for(const [courseKey,subjectEnd]of [['C38','C48'],['C49','C57'],['C58','C69']]){
  for(const cadence of ['w1','w2'])for(const speed of [.7,.85,1,1.25,1.5]){
    // Compare actual week-by-week assigned envelopes with every high-school
    // milestone, including fractional carry across all course boundaries.
    const assignedCourseEnd={};
    for(let week=0;week<150;week++)for(const k of [1,2]){
      const assignment=H.assignment(c,{courseKey,startSession:1,startDate,weekKey:weekKey(week),cadence,speed,k});
      if(!assignment)continue;
      assignedEnvelopes++;
      assignment.lessons.forEach(lesson=>{assignedCourseEnd[lesson.courseKey]=week+1;});
    }
    assert.equal(assignedCourseEnd[subjectEnd],subjectWeeks[cadence][speedKey(speed)],'explicit subject completion week');
    if(courseKey==='C38')assert.equal(assignedCourseEnd.C69,allWeeks[cadence][speedKey(speed)],'explicit completion of all three subjects');
    for(const pace of ['p0','p2','p4']){
      const p=project(c,{courseKey,sessionIndex:1,startDate,entryYear:2020,cadence,speed,pace},{now:startDate,months:24});
      for(const milestone of p.milestones.filter(m=>c[m.key].studyPlan)){
        assert.equal((Date.parse(milestone.date)-start)/WEEK,assignedCourseEnd[milestone.key],
          `${courseKey}/${cadence}/${speed}/${pace}: ${milestone.key} matches actual assignment completion`);
      }
      assert(p.rows.flatMap(row=>row.sessionLabels).some(label=>label.includes('학습 묶음')));
      cases++;
    }
  }
}
for(const course of Object.values(c).filter(course=>course.studyPlan))for(let i=1;i<=course.sessions.length;i++){
  const p=project(c,{courseKey:'C'+course.order,sessionIndex:i,startDate,cadence:'w2',speed:1,pace:'p2'},{now:startDate,months:1});
  assert(p.rows[0].sessionLabels[0].startsWith((H.lessonIndex(course,i)+1)+'–'));
  cases++;
}
// Ordinary courses retain their existing per-course rounding behavior.
const ordinary={C1:{title:{ko:'첫 과정'},sessions:[{},{},{}]},C2:{title:{ko:'다음 과정'},sessions:[{},{},{},{},{}]}};
for(const [speed,days]of [[1,[14,35]],[1.5,[7,21]]]){
  const p=project(ordinary,{courseKey:'C1',sessionIndex:1,startDate,cadence:'w2',speed,pace:'p0'},{now:startDate,months:2});
  assert.deepEqual(p.milestones.map(m=>(Date.parse(m.date)-start)/86400000),days,'ordinary course dates retain rounding');
  cases++;
}
assert.equal(JSON.stringify(c),original,'calendar must not mutate any content or plan');
console.log('HIGH_CALENDAR_OK cases='+cases+' assignedEnvelopes='+assignedEnvelopes+' subjectWeeks=12/8/18 defaultThreeSubjects=36Weeks allFiveSpeeds=true legacyStartsPreserved=true ordinaryRoundingPreserved=true');
