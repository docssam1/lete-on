/* Profile-owned learning evidence. No direct storage, network, scoring or pace writes.
 * Old global NM_STATS has no reliable profile owner/time: never import it here. */
(function(){
  'use strict';
  const W=typeof window==='undefined'?globalThis:window, DAY=86400000;
  const day=ms=>{const d=new Date(ms);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  const dateMs=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return NaN;const n=Date.parse(s+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===s?n:NaN;};
  const finite=(n,a,b)=>typeof n==='number'&&Number.isFinite(n)&&n>=a&&n<=b;
  const integer=(n,a,b)=>finite(n,a,b)&&Number.isInteger(n);
  const course=(c,s)=>{const x=(W.NM_COURSES||{})[c];return x&&!x.comingSoon&&integer(s,1,x.sessions.length);};
  const events=state=>state&&state.studyLog&&Array.isArray(state.studyLog.events)?state.studyLog.events:[];
  function valid(e,now){
    if(!e||typeof e.id!=='string'||e.id.length>160||!e.id||!finite(e.at,1,now)||!Number.isFinite(dateMs(e.day))||e.day>day(now))return false;
    if(e.kind==='attempt')return typeof e.thread==='string'&&integer(e.level,1,1000)&&integer(e.total,1,1000)&&integer(e.correct,0,e.total)&&integer(e.answered,0,e.total)&&finite(e.activeSec,0,14400)&&typeof e.exposed==='boolean'&&e.correct<=e.answered&&(!e.course||course(e.course,e.session));
    if(e.kind==='session')return course(e.course,e.session)&&integer(e.minutes,5,120)&&e.whole===true&&e.source==='adult-confirmed'&&
      (e.total===null&&e.correct===null||integer(e.total,1,1000)&&integer(e.correct,0,e.total));
    return false;
  }
  function append(state,event,now){
    now=now||Date.now();
    if(!valid(event,now)||events(state).some(x=>x.id===event.id))return false;
    if(state.studyLog&&state.studyLog.version!==1)return false; // preserve unknown future schema
    if(!state.studyLog)state.studyLog={version:1,events:[]};
    if(!Array.isArray(state.studyLog.events))return false;
    state.studyLog.events.push(Object.assign({},event));return true;
  }
  function summarize(state,options){
    const o=options||{},now=o.now||Date.now(),today=day(now),cut=dateMs(today)-27*DAY;
    const schemaSafe=!state.studyLog||state.studyLog.version===1;
    const ids=new Set();
    const all=(schemaSafe?events(state):[]).filter(e=>{if(!valid(e,now)||ids.has(e.id))return false;ids.add(e.id);return true;}).sort((a,b)=>a.day.localeCompare(b.day)||a.at-b.at||a.id.localeCompare(b.id));
    const start=(W.NM_COURSES||{})[o.course],same=e=>!start||((W.NM_COURSES||{})[e.course]||{}).tier===start.tier;
    const recent=all.filter(e=>dateMs(e.day)>=cut&&same(e));
    const completed=recent.filter(e=>e.kind==='session'),days=[...new Set(completed.map(e=>e.day))].sort();
    const seen=new Set(),newSessions=[];
    for(const e of all.filter(e=>e.kind==='session')){const k=e.course+':'+e.session;if(!seen.has(k)){seen.add(k);if(recent.includes(e))newSessions.push(e);}}
    const attempts=recent.filter(e=>e.kind==='attempt'&&!e.exposed);
    // Whole-session grading includes the online subset: prioritize the complete
    // aggregate, but retain every online attempt for incomplete/recurrence guards.
    const aggregates=completed.filter(e=>e.total!==null);
    const quality=aggregates.concat(attempts.filter(a=>!aggregates.some(e=>a.day===e.day&&a.course===e.course&&a.session===e.session)));
    const conflict=aggregates.some(e=>attempts.some(a=>a.day===e.day&&a.course===e.course&&a.session===e.session&&
      (a.total>e.total||a.correct>e.correct||a.total-a.correct>e.total-e.correct)));
    const total=quality.reduce((n,e)=>n+e.total,0),correct=quality.reduce((n,e)=>n+e.correct,0);
    const byType={};for(const e of attempts){const k=e.thread+':'+e.level;(byType[k]||(byType[k]=[])).push(e);}
    const recurring=Object.keys(byType).filter(k=>byType[k].length>=2&&byType[k].slice(-2).every(e=>e.correct/e.total<.6));
    const qDays=[...new Set(quality.map(e=>e.day))].sort(),rates=qDays.map(d=>{const q=quality.filter(e=>e.day===d);return q.reduce((n,e)=>n+e.correct,0)/q.reduce((n,e)=>n+e.total,0);});
    const decline=rates.length>=4&&((rates.at(-1)+rates.at(-2))/2<(rates[0]+rates[1])/2-.1-1e-9);
    const span=days.length?(dateMs(days.at(-1))-dateMs(days[0]))/DAY+1:0;
    const calendarSpan=days.length?(dateMs(today)-dateMs(days[0]))/DAY+1:0;
    const minutes=completed.reduce((n,e)=>n+e.minutes,0),dayMinutes=days.map(d=>completed.filter(e=>e.day===d).reduce((n,e)=>n+e.minutes,0));
    const reasons=[];
    if(!schemaSafe)reasons.push('log-version');
    if(span<14)reasons.push('observe-days');if(days.length<4)reasons.push('observe-visits');
    if(!newSessions.length)reasons.push('no-new-session');
    if(!days.length||dateMs(today)-dateMs(days.at(-1))>7*DAY)reasons.push('stale');
    if(total<40||qDays.length<4)reasons.push('quality-missing');
    if(attempts.some(e=>e.answered<e.total))reasons.push('incomplete');
    if(total&&correct/total<.85)reasons.push('accuracy');if(recurring.length)reasons.push('recurring');if(decline)reasons.push('decline');
    const onlineTotal=attempts.reduce((n,e)=>n+e.total,0),onlineCorrect=attempts.reduce((n,e)=>n+e.correct,0);
    if(onlineTotal&&onlineCorrect/onlineTotal<.85&&!reasons.includes('accuracy'))reasons.push('accuracy');
    if(attempts.length>=2&&attempts.slice(-2).every(e=>e.correct/e.total<.6))reasons.push('recent-low');
    if(conflict)reasons.push('conflict');
    if(dayMinutes.some(n=>n>120))reasons.push('time-range');
    const measured=span>=14&&days.length>=4&&newSessions.length>0&&days.length&&dateMs(today)-dateMs(days.at(-1))<=7*DAY&&!dayMinutes.some(n=>n>120);
    const projection=measured?{observedWeeks:Math.max(2,Math.ceil(calendarSpan/7)),observedVisits:days.length,completedSessions:newSessions.length,observedMinutes:minutes}:null;
    const next=nextPosition(state,o.course,o.session||1,all);
    return {version:'learning-evidence-v1',windowStart:new Date(cut).toISOString().slice(0,10),windowEnd:today,
      scopeTier:start?start.tier:null,attempts:recent.filter(e=>e.kind==='attempt').length,activeSec:recent.filter(e=>e.kind==='attempt').reduce((n,e)=>n+e.activeSec,0),
      visits:days.length,spanDays:calendarSpan,studySpanDays:span,completedSessions:newSessions.length,reviewSessions:completed.length-newSessions.length,
      total,correct,rate:total?correct/total:null,recurring,decline,reasons,projection,next,
      status:reasons.length?'maintain-observe':'eligible-to-compare',automaticChange:false,
      averageMinutes:days.length?Math.ceil(minutes/days.length):null};
  }
  function nextPosition(state,c,s,provided){
    if(state.studyLog&&state.studyLog.version!==1)return {course:c,session:s,verified:false};
    const list=Object.keys(W.NM_COURSES||{}).filter(k=>/^C\d+$/.test(k)&&!W.NM_COURSES[k].comingSoon).sort((a,b)=>+a.slice(1)-+b.slice(1));
    let i=list.indexOf(c);if(i<0||!course(c,s))return {course:c,session:s,verified:false};
    const done=new Set((provided||events(state).filter(e=>valid(e,Date.now()))).filter(e=>e.kind==='session').map(e=>e.course+':'+e.session));
    const original=c+':'+s;while(done.has(list[i]+':'+s)){s++;if(s>W.NM_COURSES[list[i]].sessions.length){if(i===list.length-1)return {course:list[i],session:s-1,complete:true,verified:true};i++;s=1;}}
    return {course:list[i],session:s,verified:original!==list[i]+':'+s};
  }
  // Monotonic active-time accumulator. A late event never backfills an idle gap.
  function clockModel(now){let last=now,active=0,touch=null,visible=true,alive=true;
    function settle(n){if(alive&&visible&&touch!==null)active+=Math.max(0,Math.min(n,touch+60000)-last);last=n;}
    return {touch(n){settle(n);touch=n;},visible(v,n){settle(n);visible=v;touch=null;},read(n){settle(n);return active/1000;},stop(n){settle(n);alive=false;return active/1000;}};
  }
  let binding=null;
  function bind(b){binding=b;}
  const state=()=>binding&&binding.state();
  const id=()=>W.crypto&&W.crypto.randomUUID?W.crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  function write(e,owner){
    const s=state();if(!s||owner&&s!==owner)return false;
    const previous=s.studyLog;if(!append(s,e))return false;
    try{if(binding.save()===false)throw Error('save');return true;}
    catch(error){s.studyLog.events=s.studyLog.events.filter(x=>x.id!==e.id);if(!previous)delete s.studyLog;
      if(W.dispatchEvent)W.dispatchEvent(new Event('nm:study-record-error'));return false;}
  }
  function begin(root,selector){
    const owner=state();if(!owner||!root||!W.document)return null;
    if(root.__nmStudyClock)root.__nmStudyClock.stop();
    const m=clockModel(performance.now());let stopped=false,last=0;
    const alive=()=>root.isConnected&&!!root.querySelector(selector)&&state()===owner;
    const touch=()=>{if(alive()&&!document.hidden)m.touch(performance.now());};
    const visibility=()=>m.visible(!document.hidden&&alive(),performance.now());
    const observer=new MutationObserver(()=>{if(!alive())ctl.stop();});
    const ctl={owner,id:id(),sample(){if(!alive()){ctl.stop();return 0;}const n=m.read(performance.now()),delta=Math.max(0,n-last);last=n;return Math.round(delta*10)/10;},stop(){if(stopped)return;stopped=true;m.stop(performance.now());for(const name of ['input','pointerdown','keydown'])root.removeEventListener(name,touch,true);document.removeEventListener('visibilitychange',visibility);observer.disconnect();if(root.__nmStudyClock===ctl)delete root.__nmStudyClock;}};
    root.__nmStudyClock=ctl;for(const name of ['input','pointerdown','keydown'])root.addEventListener(name,touch,true);
    document.addEventListener('visibilitychange',visibility);if(document.hidden)m.visible(false,performance.now());
    observer.observe(document.body,{childList:true,subtree:true});return ctl;
  }
  function attempt(data,run){
    if(!run)return false;
    return write(Object.assign({},data,{kind:'attempt',at:Date.now(),day:day(Date.now()),activeSec:run.sample()}),run.owner);
  }
  function confirmSession(data){
    if(!data.whole)throw Error('whole');
    const e=Object.assign({},data,{id:id(),kind:'session',at:Date.now(),source:'adult-confirmed'});
    const s=state();if(events(s).some(x=>x.kind==='session'&&x.course===e.course&&x.session===e.session&&x.day===e.day))throw Error('duplicate-session-day');
    if(!valid(e,Date.now())||dateMs(e.day)<dateMs(day(Date.now()))-27*DAY)throw Error('session');
    if(!write(e))throw Error('save');return e;
  }
  function saveGoal(goal){
    const s=state();if(!s||!course(goal.startCourse,goal.startSession)||!course(goal.targetCourse,1)||+goal.targetCourse.slice(1)<+goal.startCourse.slice(1)||!Number.isFinite(dateMs(goal.targetDate))||goal.targetDate<=day(Date.now()))throw Error('goal');
    if(dateMs(goal.targetDate)-dateMs(day(Date.now()))>156*7*DAY)throw Error('goal');
    const previous=s.studyGoal;
    s.studyGoal={startCourse:goal.startCourse,startSession:goal.startSession,targetCourse:goal.targetCourse,targetDate:goal.targetDate,at:Date.now()};
    try{if(binding.save()===false)throw Error('save');}catch(error){if(previous)s.studyGoal=previous;else delete s.studyGoal;throw Error('save');}
  }
  const api={append,valid,summarize,nextPosition,clockModel,bind,begin,attempt,confirmSession,saveGoal,id,day,
    current:()=>state()?summarize(state(),{course:state().studyGoal&&state().studyGoal.startCourse,session:state().studyGoal&&state().studyGoal.startSession}):null,
    snapshot:()=>state(),isBound:()=>!!state()};
  W.NM_STUDY_RECORDS=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
