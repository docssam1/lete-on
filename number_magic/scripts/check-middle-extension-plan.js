'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;vm.createContext(w);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const file=m[1].split(/[?#]/)[0];if(!/^(engine\/|data\/)/.test(file))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w,{filename:file});if(file==='data/high-pacing.js')break;
}
const H=require('../data/high-pacing.js'),LP=require('../app/learning-plan.js'),PC=require('../app/plan-control.js'),E=require('../data/middle-extension.js');
const courses=JSON.parse(JSON.stringify(w.NM_COURSES)),original=JSON.stringify(courses),DAY=86400000,WEEK=7*DAY,origin=Date.parse('2026-10-26T00:00:00Z');
const speeds=[.7,.85,1,1.25,1.5],start={1:'C29',2:'C32',3:'C35'},end={1:'C31',2:'C34',3:'C37'},next={1:'C32',2:'C35',3:'C38'};let checks=0;
function check(fn){fn();checks++;}
function weekKey(offset){
  const ms=origin+offset*WEEK,year=new Date(ms+3*DAY).getUTCFullYear(),jan4=Date.UTC(year,0,4),first=jan4-((new Date(jan4).getUTCDay()+6)%7)*DAY;
  return year+'-W'+String(1+Math.round((ms-first)/WEEK)).padStart(2,'0');
}
function settings(grade,extra){return {courseKey:start[grade],sessionIndex:1,startDate:'2026-10-26',cadence:'w2',speed:1,amount:1,pace:'p2',...extra};}
function chosen(grade){return {[grade]:E.version};}
function msDate(project,key){return Date.parse(project.milestones.find(x=>x.key===key).date);}
for(const grade of [1,2,3]){
  const core=settings(grade),selected=settings(grade,{middleExtensions:chosen(grade)}),base=LP.project(courses,core,{now:core.startDate}),p=LP.project(courses,selected,{now:core.startDate});
  check(()=>assert.equal((msDate(base,end[grade])-origin)/WEEK,10,'unselected core stays ten weeks'));
  check(()=>assert.equal((msDate(p,end[grade])-origin)/WEEK,10,'core finish is unchanged when deeper study is selected'));
  check(()=>assert.equal((msDate(p,'M'+grade+'E')-origin)/WEEK,16,'selected core plus deeper study is sixteen weeks'));
  check(()=>assert.equal((msDate(p,next[grade])-msDate(base,next[grade]))/WEEK,6,'only later courses move by six weeks'));
  const standard=LP.standard(courses,selected,{now:core.startDate});
  check(()=>assert.equal((msDate(standard,end[grade])-origin)/WEEK,10));
  check(()=>assert(!standard.milestones.some(x=>x.kind==='middle-extension'),'standard comparison is always the unselected core'));
  check(()=>assert(p.rows.some(row=>row.courseKeys.includes('M'+grade+'E')),'monthly rows explicitly identify the deeper-study phase'));
  check(()=>assert(p.rows.filter(row=>row.courseKeys.includes('M'+grade+'E')).every(row=>!row.courseLabels[row.courseKeys.indexOf('M'+grade+'E')].includes('M'+grade+'E')),'monthly labels show the readable deeper-study title without its internal key'));
  const flat=H.timeline(courses,{...selected,startSession:1}),extension=flat.filter(ref=>ref.kind==='middle-extension');
  check(()=>assert.equal(extension.length,12));
  check(()=>assert.deepEqual(extension.map(ref=>ref.extensionId),Array.from({length:12},(_,i)=>'M'+grade+'E-'+String(i+1).padStart(2,'0'))));
  check(()=>assert(extension.every(ref=>ref.sourceIndices.length===0&&ref.courseKey===end[grade]&&ref.scheduleUnits===1),'deeper-study phases contain no fake canonical sources'));
  for(const speed of speeds)for(const cadence of ['w1','w2']){
    const s={...selected,speed,cadence},project=LP.project(courses,s,{now:s.startDate}),expected=Math.ceil(32/(cadence==='w2'?2:1)/speed-1e-9),refs=[];
    check(()=>assert.equal((msDate(project,'M'+grade+'E')-origin)/WEEK,expected));
    let finalWeek=-1;
    for(let week=0;week<expected;week++){
      const pos=PC.position(courses,s,weekKey(week));refs.push(...pos.weekLessons);
      if(pos.weekLessons.some(ref=>ref.kind==='middle-extension'&&ref.grade===grade))finalWeek=week;
      const assignment=H.assignment(courses,{...s,startSession:s.sessionIndex,weekKey:weekKey(week)});
      check(()=>assert.deepEqual(pos.weekLessons,assignment?.weekLessons||[],'calendar and app use the same phase references'));
    }
    const additions=refs.filter(ref=>ref.kind==='middle-extension'&&ref.grade===grade);
    check(()=>assert.equal(finalWeek+1,expected));
    check(()=>assert.deepEqual(additions.map(ref=>ref.extensionIndex),Array.from({length:12},(_,i)=>i),'all twelve optional lessons appear once'));
    const sources=refs.filter(ref=>ref.kind!=='middle-extension'&&courses[ref.courseKey].tier==='middle'+grade).flatMap(ref=>ref.sourceIndices.map(i=>ref.courseKey+':'+i));
    const expectedSources=Object.keys(courses).filter(k=>courses[k].tier==='middle'+grade).flatMap(k=>courses[k].sessions.map((_,i)=>k+':'+i));
    check(()=>assert.deepEqual(sources,expectedSources,'core source coverage is not altered by opting in'));
  }
  const direct=PC.change(courses,core,{middleExtensions:chosen(grade),extensionAnchor:{grade,index:0}},{weekKey:weekKey(0)});
  check(()=>assert.equal(direct.courseKey,end[grade]));
  check(()=>assert.deepEqual(PC.position(courses,direct,weekKey(0)).extensionAnchor,{grade,index:0}));
  check(()=>assert(PC.position(courses,direct,weekKey(0)).weekLessons.every(ref=>ref.kind==='middle-extension')));
  for(let index=0;index<12;index++)for(const speed of speeds){
    const s={...direct,extensionAnchor:{grade,index},speed},before=PC.position(courses,s,weekKey(0));
    check(()=>assert.deepEqual(before.extensionAnchor,{grade,index}));
    for(const patch of [{speed:.7},{speed:1.5},{amount:1.25},{cadence:'w1'}]){
      const changed=PC.change(courses,s,patch,{weekKey:weekKey(0)}),position=PC.position(courses,changed,weekKey(0));
      check(()=>assert.deepEqual(changed.extensionAnchor,{grade,index},'pacing changes retain the exact optional-phase start'));
      check(()=>assert(position.weekLessons.filter(ref=>ref.kind==='middle-extension'&&ref.grade===grade).every(ref=>ref.extensionIndex>=index),'no earlier optional lesson is reinserted'));
    }
  }
  const partial=PC.change(courses,selected,{speed:1},{weekKey:weekKey(4)}),partialProject=LP.project(courses,partial,{now:'2026-11-23'});
  check(()=>assert.equal(msDate(partialProject,'M'+grade+'E'),origin+16*WEEK,'opting in or rebasing at mid-course preserves the remaining core boundary'));
  const backToCore=PC.change(courses,direct,{courseKey:next[grade],sessionIndex:1},{weekKey:weekKey(0)});
  check(()=>assert.equal(backToCore.extensionAnchor,undefined,'explicit canonical-course selection exits the optional anchor'));
  check(()=>assert.equal(PC.position(courses,direct,weekKey(6)).courseKey,next[grade],'after twelve optional bundles, the next real course follows'));
  for(let from=1;from<=courses[next[grade]].sessions.length;from++)for(const speed of speeds){
    const late=PC.change(courses,settings(grade),{middleExtensions:chosen(grade),extensionAnchor:{grade,index:0,resume:{courseKey:next[grade],sessionIndex:from}}},{weekKey:weekKey(0)});
    late.speed=speed;
    const flat=H.timeline(courses,{...late,startSession:late.sessionIndex}),core=flat.filter(ref=>ref.courseKey===next[grade]&&ref.kind!=='middle-extension');
    check(()=>assert.equal(core[0].startSession,from,'late optional enrollment resumes the exact next-core source'));
    check(()=>assert.deepEqual(core.flatMap(ref=>ref.sourceIndices),Array.from({length:courses[next[grade]].sessions.length-from+1},(_,i)=>from-1+i),'earlier next-core sources are not reinserted'));
    const at=PC.position(courses,late,weekKey(1));
    check(()=>assert.deepEqual(at.extensionAnchor.resume,{courseKey:next[grade],sessionIndex:from}));
    const changed=PC.change(courses,late,{speed:speed===1.5?.7:1.5},{weekKey:weekKey(1)});
    check(()=>assert.deepEqual(changed.extensionAnchor.resume,{courseKey:next[grade],sessionIndex:from},'speed-only edits inside deeper study retain the next-core resume'));
    const project=LP.project(courses,late,{now:late.startDate}),endWeeks=(msDate(project,next[grade])-origin)/WEEK,source=[];
    let finalWeek=-1;
    for(let week=0;week<endWeeks;week++){
      const position=PC.position(courses,late,weekKey(week));
      const refs=position.weekLessons.filter(ref=>ref.courseKey===next[grade]&&ref.kind!=='middle-extension');
      if(refs.length)finalWeek=week;
      source.push(...refs.flatMap(ref=>ref.sourceIndices));
    }
    check(()=>assert.equal(finalWeek+1,endWeeks,'resumed next-core completion matches the monthly milestone'));
    check(()=>assert.deepEqual(source,Array.from({length:courses[next[grade]].sessions.length-from+1},(_,i)=>from-1+i),'weekly output contains only the remaining next-core sources'));
  }
}
const all=settings(1,{middleExtensions:{1:E.version,2:E.version,3:E.version}}),allProject=LP.project(courses,all,{now:all.startDate});
check(()=>assert.deepEqual([1,2,3].map(g=>(msDate(allProject,'M'+g+'E')-origin)/WEEK),[16,32,48]));
check(()=>assert.equal((msDate(allProject,'C48')-msDate(allProject,'M3E'))/WEEK,12,'high-school subject duration stays twelve weeks after optional phases'));
const current=settings(1,{middleExtensions:chosen(1)}),chosenPlan=PC.change(courses,current,{extensionAnchor:{grade:1,index:5}},{weekKey:weekKey(5)});
const history=PC.record(undefined,current,chosenPlan,weekKey(5));
current.middleExtensions[1]='changed';chosenPlan.middleExtensions[1]='changed';chosenPlan.extensionAnchor.index=99;
check(()=>assert.equal(PC.forWeek(history,weekKey(4)).middleExtensions[1],E.version));
check(()=>assert.deepEqual(PC.forWeek(history,weekKey(5)).extensionAnchor,{grade:1,index:5}));
const restored=PC.forWeek(history,weekKey(5));restored.middleExtensions[1]='changed';restored.extensionAnchor.index=99;
check(()=>assert.deepEqual(PC.forWeek(history,weekKey(5)).extensionAnchor,{grade:1,index:5}));
check(()=>assert.equal(PC.forWeek(history,weekKey(5)).middleExtensions[1],E.version));
const resumed=PC.change(courses,settings(1),{middleExtensions:chosen(1),extensionAnchor:{grade:1,index:4,resume:{courseKey:'C32',sessionIndex:5}}},{weekKey:weekKey(0)});
const resumeHistory=PC.record(undefined,resumed,resumed,weekKey(2));
resumed.extensionAnchor.resume.sessionIndex=1;
check(()=>assert.equal(PC.forWeek(resumeHistory,weekKey(2)).extensionAnchor.resume.sessionIndex,5,'history clones the third-level resume object'));
const readResume=PC.forWeek(resumeHistory,weekKey(2));readResume.extensionAnchor.resume.sessionIndex=1;
check(()=>assert.equal(PC.forWeek(resumeHistory,weekKey(2)).extensionAnchor.resume.sessionIndex,5,'reading a snapshot cannot mutate its nested resume source'));
const legacy=settings(1),changed=PC.change(courses,legacy,{middleExtensions:chosen(1)},{weekKey:weekKey(5)}),legacyHistory=PC.record(undefined,legacy,changed,weekKey(5));
check(()=>assert.equal(PC.forWeek(legacyHistory,weekKey(4)).middleExtensions,undefined,'earlier weeks do not acquire a later opt-in'));
for(const patch of [{middleExtensions:{1:'future'}},{middleExtensions:{4:E.version}},{extensionAnchor:{grade:1,index:0}},{middleExtensions:chosen(1),extensionAnchor:{grade:1,index:12}},{middleExtensions:chosen(1),extensionAnchor:{grade:4,index:0}},{middleExtensions:chosen(1),extensionAnchor:{grade:1,index:.5}}])check(()=>assert.throws(()=>PC.change(courses,legacy,patch,{weekKey:weekKey(0)}),/invalid_learning_plan/));
for(const resume of [{courseKey:'C35',sessionIndex:1},{courseKey:'C32',sessionIndex:0},{courseKey:'C32',sessionIndex:courses.C32.sessions.length+1},{courseKey:'C32',sessionIndex:1.5}])check(()=>assert.throws(()=>PC.change(courses,legacy,{middleExtensions:chosen(1),extensionAnchor:{grade:1,index:0,resume}},{weekKey:weekKey(0)}),/invalid_learning_plan/));
check(()=>assert.equal(JSON.stringify(courses),original,'source content, studyPlan bundles, and old source indices stay unchanged'));
console.log('MIDDLE_EXTENSION_PLAN_OK checks='+checks+' core10Weeks=true selected16Weeks=true deeperBundles=12 fiveSpeeds=true phaseRebase=true historyDeepCopy=true legacySourcesUnchanged=true');
