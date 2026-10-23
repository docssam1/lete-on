'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;vm.createContext(w);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const file=m[1].split(/[?#]/)[0];if(!/^(engine\/|data\/)/.test(file))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w,{filename:file});if(file==='data/high-pacing.js')break;
}
const PC=require('../app/plan-control.js'),LP=require('../app/learning-plan.js'),H=require('../data/high-pacing.js');
const courses=JSON.parse(JSON.stringify(w.NM_COURSES)),original=JSON.stringify(courses),DAY=86400000,WEEK=7*DAY,origin=Date.parse('2026-10-26T00:00:00Z');
const speeds=[.7,.85,1,1.25,1.5];let checks=0;
function check(fn){fn();checks++;}
function weekKey(offset){
  const ms=origin+offset*WEEK,year=new Date(ms+3*DAY).getUTCFullYear(),jan4=Date.UTC(year,0,4);
  const first=jan4-((new Date(jan4).getUTCDay()+6)%7)*DAY;
  return year+'-W'+String(1+Math.round((ms-first)/WEEK)).padStart(2,'0');
}
const settings=(courseKey,extra)=>({courseKey,sessionIndex:1,startDate:'2026-10-26',cadence:'w2',speed:1,amount:1,pace:'p0',...extra});
const refs=p=>p.weekLessons.flatMap(ref=>ref.sourceIndices.map(i=>ref.courseKey+':'+(i+1)));
const ordinary={C1:{title:{ko:'첫 과정'},sessions:Array.from({length:8},(_,i)=>({minutes:10+i}))},C2:{title:{ko:'다음 과정'},sessions:Array.from({length:6},()=>({minutes:12}))}};
check(()=>assert.deepEqual(PC.choices(ordinary.C1),Array.from({length:8},(_,i)=>({index:i+1,sessionIndex:i+1}))));
check(()=>assert.deepEqual(refs(PC.position(ordinary,settings('C1'),weekKey(0))),['C1:1','C1:2']));
check(()=>assert.deepEqual(refs(PC.position(ordinary,settings('C1'),weekKey(3))),['C1:7','C1:8']));
check(()=>assert.deepEqual(refs(PC.position(ordinary,settings('C1'),weekKey(4))),['C2:1','C2:2']));
check(()=>assert.equal(PC.position(ordinary,settings('C1'),weekKey(7)).complete,true));
for(const speed of speeds)for(const cadence of ['w1','w2'])for(const from of [1,4,8]){
  const s=settings('C1',{speed,cadence,sessionIndex:from}),project=LP.project(ordinary,s,{now:s.startDate});
  const weeks=(Date.parse(project.milestones.slice(-1)[0].date)-origin)/WEEK,all=[];
  for(let week=0;week<weeks;week++)all.push(...refs(PC.position(ordinary,s,weekKey(week))));
  const expected=[...Array.from({length:9-from},(_,i)=>'C1:'+(from+i)),...Array.from({length:6},(_,i)=>'C2:'+(i+1))];
  check(()=>assert.deepEqual(all,expected,'elementary calendar boundaries assign every remaining source exactly once'));
  check(()=>assert.equal(PC.position(ordinary,s,weekKey(weeks)).complete,true));
}
for(const courseKey of ['C29','C38','C70']){
  const course=courses[courseKey],list=PC.choices(course);
  check(()=>assert.equal(list.length,course.studyPlan.lessons.length));
  check(()=>assert.deepEqual(list.map(x=>x.sessionIndex),Array.from(course.studyPlan.lessons,x=>x.startSession)));
  for(const speed of speeds)for(const cadence of ['w1','w2']){
    const s=settings(courseKey,{speed,cadence}),all=[];
    for(let offset=0;offset<8;offset++){
      const a=H.assignment(courses,{...s,startSession:1,weekKey:weekKey(offset)}),p=PC.position(courses,s,weekKey(offset));
      check(()=>assert.deepEqual(refs(p),(a?.weekLessons||[]).flatMap(ref=>ref.sourceIndices.map(i=>ref.courseKey+':'+(i+1)))));
      all.push(...refs(p));
    }
    check(()=>assert.equal(new Set(all).size,all.length,'weekly changes never duplicate source sessions'));
    const before=PC.position(courses,s,weekKey(4));
    for(const nextSpeed of speeds){
      const next=PC.change(courses,s,{speed:nextSpeed},{weekKey:weekKey(4)});
      check(()=>assert.deepEqual([next.courseKey,next.sessionIndex,next.startDate,next.speed],[before.courseKey,before.sessionIndex,'2026-11-23',nextSpeed]));
    }
    check(()=>assert.deepEqual(PC.change(courses,s,{amount:1.5},{weekKey:weekKey(4)}),{...s,courseKey:before.courseKey,sessionIndex:before.sessionIndex,startDate:'2026-11-23',amount:1.5}));
  }
}
// A single elementary plan crosses to the exact same compact assignment as
// the calendar: eight source sessions at two/week end before week five.
const mixed={C1:ordinary.C1,...Object.fromEntries(Object.entries(courses).filter(([key,c])=>+key.slice(1)>=29&&c.studyPlan))};
check(()=>assert.deepEqual(refs(PC.position(mixed,settings('C1'),weekKey(4))),refs(PC.position(courses,settings('C29',{startDate:'2026-11-23'}),weekKey(4)))));
check(()=>{
  const slow=settings('C70',{cadence:'w1',speed:.7}),p=PC.position(courses,slow,weekKey(0));
  assert.deepEqual(refs(p),[]);assert.equal(p.courseKey,'C70');assert.equal(p.sessionIndex,1);assert.notEqual(p.complete,true);
});
for(const speed of speeds)for(const cadence of ['w1','w2']){
  const s=settings('C70',{speed,cadence}),project=LP.project(courses,s,{now:s.startDate});
  const endWeeks=(Date.parse(project.milestones.find(x=>x.key==='C73').date)-origin)/WEEK,all=[];
  for(let week=0;week<endWeeks;week++)all.push(...refs(PC.position(courses,s,weekKey(week))));
  const expected=Object.keys(courses).filter(k=>+k.slice(1)>=70&&+k.slice(1)<=73).flatMap(k=>courses[k].sessions.map((_,i)=>k+':'+(i+1)));
  check(()=>assert.deepEqual(all,expected,'all twenty calculus source sessions appear once through the projected completion week'));
  check(()=>assert.equal(PC.position(courses,s,weekKey(endWeeks)).complete,true));
}
for(const [courseKey,target]of [['C37','C38'],['C69','C70']]){
  const last=PC.choices(courses[courseKey]).slice(-1)[0],s=settings(courseKey,{sessionIndex:last.sessionIndex});
  const first=PC.position(courses,s,weekKey(0));
  check(()=>assert.equal(first.weekLessons[0].courseKey,courseKey));
  let crossed=false;
  for(let week=0;week<4;week++)if(PC.position(courses,s,weekKey(week)).weekLessons.some(ref=>ref.courseKey===target))crossed=true;
  check(()=>assert.equal(crossed,true,'cross-band remaining schedule keeps its next real course'));
}
check(()=>{
  const before=PC.position(ordinary,settings('C1'),weekKey(2));
  const after=PC.change(ordinary,settings('C1'),{cadence:'w1',pace:'p2',amount:.85},{weekKey:weekKey(2)});
  assert.equal(after.courseKey,before.courseKey);assert.equal(after.sessionIndex,before.sessionIndex);assert.equal(after.startDate,'2026-11-09');
});
check(()=>assert.equal(PC.change(courses,settings('C38'),{courseKey:'C70'},{weekKey:weekKey(0)}).sessionIndex,1));
check(()=>assert.equal(PC.change(courses,settings('C38'),{courseKey:'C38',sessionIndex:999},{weekKey:weekKey(0)}).sessionIndex,courses.C38.sessions.length));
check(()=>{
  const lesson=courses.C38.studyPlan.lessons.find(x=>x.sourceIndices.length>1);
  assert(lesson);const next=PC.change(courses,settings('C38'),{sessionIndex:lesson.endSession},{weekKey:weekKey(0)});
  assert.equal(next.sessionIndex,lesson.endSession,'explicit original source starts are retained inside a bundle');
});
for(const [courseKey,course]of Object.entries(courses).filter(([,c])=>c.studyPlan)){
  for(let from=1;from<=course.sessions.length;from++)for(const speed of speeds){
    const s=settings(courseKey,{sessionIndex:from,speed}),before=PC.position(courses,s,weekKey(0));
    check(()=>{
      assert.equal(before.courseKey,courseKey);
      assert.equal(before.sessionIndex,from,'legacy exact source start survives position lookup');
      assert(before.weekLessons.filter(ref=>ref.courseKey===courseKey).every(ref=>ref.sourceIndices.every(i=>i>=from-1)));
    });
    for(const patch of [{speed:.7},{speed:.85},{speed:1},{speed:1.25},{speed:1.5},{amount:1.5},{cadence:'w1'}]){
      const next=PC.change(courses,s,patch,{weekKey:weekKey(0)});
      check(()=>{
        assert.equal(next.sessionIndex,from,'pacing edits preserve the exact source start');
        for(let week=0;week<3;week++){
          const p=PC.position(courses,next,weekKey(week));
          assert(p.weekLessons.filter(ref=>ref.courseKey===courseKey).every(ref=>ref.sourceIndices.every(i=>i>=from-1)),'previous source work is never reinserted');
        }
      });
    }
  }
}
check(()=>assert.equal(PC.change(ordinary,settings('C1'),{speed:1.25},{now:'2026-11-01T15:00:00Z'}).startDate,'2026-11-02','KST Monday rolls over while UTC still Sunday'));
check(()=>assert.deepEqual(PC.position(ordinary,settings('C1'),weekKey(-1)).weekLessons,[]));
const old=settings('C38'),next=PC.change(courses,old,{courseKey:'C70',speed:1.25},{weekKey:weekKey(4)});
let history=PC.record(undefined,old,next,weekKey(4)),snapshot=JSON.stringify(history);
check(()=>assert.deepEqual(PC.forWeek(history,weekKey(3)),old));
check(()=>assert.deepEqual(PC.forWeek(history,weekKey(4)),next));
check(()=>assert.deepEqual(PC.forWeek(history,weekKey(15)),next));
const sameWeek=PC.change(courses,next,{speed:1.5},{weekKey:weekKey(4)}),replaced=PC.record(history,next,sameWeek,weekKey(4));
check(()=>assert.equal(replaced.length,2));check(()=>assert.deepEqual(PC.forWeek(replaced,weekKey(3)),old));
check(()=>assert.equal(JSON.stringify(history),snapshot,'history helpers do not mutate prior snapshots'));
const later=PC.record(replaced,sameWeek,settings('C49'),weekKey(8));
check(()=>assert.deepEqual(PC.forWeek(later,weekKey(7)),sameWeek));
check(()=>assert.deepEqual(PC.forWeek(later,weekKey(8)),settings('C49')));
check(()=>assert.equal(PC.record(later,old,next,weekKey(4)).length,3,'editing a week preserves other existing snapshots'));
check(()=>{const result=PC.forWeek(history,weekKey(4));result.speed=.7;assert.equal(PC.forWeek(history,weekKey(4)).speed,1.25);});
for(const patch of [{speed:0},{speed:2},{amount:-1},{cadence:'w3'},{pace:'p8'},{courseKey:'C999'},{sessionIndex:NaN},{sessionIndex:1.2},{startDate:'2026-10-26'}]){
  check(()=>assert.throws(()=>PC.change(courses,old,patch,{weekKey:weekKey(0)}),/invalid_learning_plan/));
}
for(const badWeek of ['2026-W54','2026-W00','2021-W53','bad'])check(()=>assert.throws(()=>PC.position(courses,old,badWeek),/invalid_learning_plan/));
check(()=>assert.throws(()=>PC.position(courses,{...old,startDate:'2026-02-30'},weekKey(0)),/invalid_learning_plan/));
check(()=>assert.throws(()=>PC.change(courses,old,{}, {now:'bad'}),/invalid_learning_plan/));
check(()=>assert.equal(JSON.stringify(courses),original,'all source sessions, tests, and old link indices are unchanged'));
// Exercise the browser export independently from the CommonJS entry point.
const browser={NM_HIGH_PACING:H,NM_LEARNING_PLAN:LP};browser.window=browser;vm.createContext(browser);
vm.runInContext(fs.readFileSync(path.join(root,'app/plan-control.js'),'utf8'),browser);
check(()=>assert.equal(typeof browser.NM_PLAN_CONTROL.position,'function'));
console.log('PLAN_CONTROL_OK checks='+checks+' fiveSpeeds=true elementaryBoundaries=true compactRebase=true historyPreserved=true sourcesUnchanged=true');
