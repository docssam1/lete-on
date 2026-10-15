/* Planning simulation, not an assessment or a second curriculum. All positions
 * reference existing course/session records. Nothing in this module writes state. */
(function(){
  'use strict';
  const W=typeof window!=='undefined'?window:globalThis;
  const EPS=1e-9;
  const cap=(done,remaining)=>remaining-done<=EPS?remaining:Math.min(remaining,done);
  function courses(){return Object.keys(W.NM_COURSES||{}).filter(k=>/^C\d+$/.test(k)&&!W.NM_COURSES[k].comingSoon).sort((a,b)=>Number(a.slice(1))-Number(b.slice(1))).map(id=>({id,title:W.NM_COURSES[id].title,sessions:W.NM_COURSES[id].sessions.length}));}
  function num(v,min,max,integer){return typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max&&(!integer||Number.isInteger(v));}
  function partial(points,time,remaining,reviewTotal,unitsPerVisit){
    const week=Math.max(0,Math.min(156,time)),lower=points[Math.floor(week)],upper=points[Math.ceil(week)];
    if(Number.isInteger(week))return Object.assign({},lower);
    const work=(week-Math.floor(week))*upper.frequency*unitsPerVisit;
    const reviewWork=Math.min(Math.max(0,reviewTotal-lower.review),work);
    return {week,done:cap(lower.done+work-reviewWork,remaining),review:lower.review+reviewWork,frequency:upper.frequency,minutes:upper.minutes};
  }
  function calculate(input){
    const s=Object.assign({},input),list=courses(),a=list.findIndex(x=>x.id===s.startCourse),b=list.findIndex(x=>x.id===s.targetCourse);
    s.reviewed=s.reviewed===true;
    if(a<0||b<a||!num(s.startSession,1,list[a].sessions,true))throw Error('range');
    if(!num(s.frequency,1,7,true)||!num(s.minutes,5,120,true)||!num(s.holdWeeks,1,8,true)||!num(s.rampWeeks,1,8,true)||!num(s.reviewSessions,0,50,true))throw Error('settings');
    if(!num(s.observedWeeks,2,26,true)||!num(s.observedVisits,4,182,true)||!num(s.completedSessions,1,1000,true)||!num(s.observedMinutes,20,20000,true))throw Error('observation');
    if(s.completedSessions>list.reduce((n,x)=>n+x.sessions,0))throw Error('observation');
    if(s.observedVisits<s.observedWeeks||s.observedVisits>s.observedWeeks*7||s.observedMinutes<s.observedVisits*5)throw Error('observation');
    const day=String(s.startDate||''),target=String(s.targetDate||'');
    const dateMs=x=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(x))return NaN;const ms=Date.parse(x+'T00:00:00Z');return Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,10)===x?ms:NaN;};
    const start=dateMs(day),end=dateMs(target);
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)throw Error('date');
    const deadlineWeeks=(end-start)/604800000;
    if(deadlineWeeks>156)throw Error('date');
    const unitsPerVisit=s.completedSessions/s.observedVisits;
    const observedPerVisit=s.observedMinutes/s.observedVisits;
    // Do not extrapolate from a shorter visit than the observed workload.
    if(s.minutes<observedPerVisit)throw Error('short-visit');
    const remaining=list.slice(a,b+1).reduce((n,x,i)=>n+x.sessions-(i===0?s.startSession-1:0),0);
    const milestones=[];let cursor=0;
    list.slice(a,b+1).forEach((x,i)=>{const count=x.sessions-(i===0?s.startSession-1:0);milestones.push({course:x.id,title:x.title,from:cursor,to:cursor+count});cursor+=count;});
    const scenarios=[];
    for(const kind of ['maintain','time','frequency']){
      let done=0,review=0,arrival=null;const points=[{week:0,done:0,review:0,frequency:s.frequency,minutes:s.minutes}];
      for(let week=1;week<=156;week++){
        const ramp=Math.max(0,Math.min(1,(week-s.holdWeeks)/s.rampWeeks));
        const increased=s.reviewed===true;
        const frequency=s.frequency+(kind==='frequency'&&increased?Math.min(1,7-s.frequency)*ramp:0);
        const minutes=s.minutes+(kind==='time'&&increased?Math.min(5,120-s.minutes)*ramp:0);
        let work=frequency*unitsPerVisit;
        // Extra minutes are for support, not an invented progress multiplier.
        const reviewWork=Math.min(Math.max(0,s.reviewSessions-review),work);review+=reviewWork;work-=reviewWork;
        const before=done;done=cap(done+work,remaining);
        if(arrival===null&&done>=remaining&&work>0)arrival=(week-1)+(reviewWork+remaining-before)/(frequency*unitsPerVisit);
        points.push({week,done,review,frequency,minutes});
      }
      const atDeadline=partial(points,deadlineWeeks,remaining,s.reviewSessions,unitsPerVisit).done;
      const position=units=>{const m=milestones.find(x=>units<x.to-EPS)||milestones[milestones.length-1];return {course:m.course,session:Math.min(list.find(x=>x.id===m.course).sessions,(m.course===s.startCourse?s.startSession:1)+Math.floor(Math.max(0,units-m.from)+EPS)),complete:units>=remaining-EPS};};
      scenarios.push({kind,points,arrivalWeeks:arrival,arrivalDate:arrival===null?null:new Date(start+Math.ceil(arrival*7-EPS)*86400000).toISOString().slice(0,10),atDeadline,position:position(atDeadline),onTime:atDeadline>=remaining-EPS,
        finalFrequency:kind==='frequency'&&s.reviewed?Math.min(7,s.frequency+1):s.frequency,finalMinutes:kind==='time'&&s.reviewed?Math.min(120,s.minutes+5):s.minutes});
    }
    let rampWeight=0;
    for(let week=1;week<=Math.ceil(deadlineWeeks);week++)rampWeight+=Math.max(0,Math.min(1,(week-s.holdWeeks)/s.rampWeeks))*Math.min(1,deadlineWeeks-(week-1));
    let requiredFrequency=null;
    for(let f=s.frequency;f<=7;f++){if((s.frequency*deadlineWeeks+(f-s.frequency)*rampWeight)*unitsPerVisit>=remaining+s.reviewSessions-1e-8){requiredFrequency=f;break;}}
    return {version:'study-projection-v1',input:s,remaining,milestones,unitsPerVisit,deadlineWeeks,scenarios,requiredFrequency,
      status:'conditional-simulation',timeCredit:'none',admissionReadiness:'not-assessed'};
  }
  function atWeek(projection,route,week){return partial(projection.scenarios[route].points,week,projection.remaining,projection.input.reviewSessions,projection.unitsPerVisit);}
  const api={courses,calculate,atWeek};W.NM_STUDY_PROJECTION=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
