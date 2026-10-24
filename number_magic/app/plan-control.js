/* Planning controls only change the future schedule. Canonical sessions,
 * completion records, and the configuration embedded in shared links stay intact. */
(function(root){
  'use strict';
  const HIGH=root.NM_HIGH_PACING||(typeof module!=='undefined'&&module.exports?require('../data/high-pacing.js'):null);
  const PLAN=root.NM_LEARNING_PLAN||(typeof module!=='undefined'&&module.exports?require('./learning-plan.js'):null);
  const DAY=86400000,WEEK=7*DAY,MULTS=[0.7,0.85,1,1.25,1.5],PACES=['p0','p1','p2','p3','p4'];
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const extensionEnd={1:'C31',2:'C34',3:'C37'};
  const extensionNext={1:'C32',2:'C35',3:'C38'};
  const copyAnchor=anchor=>({...anchor,...(anchor.resume?{resume:{...anchor.resume}}:{})});
  function extensionData(){
    if(root.NM_MIDDLE_EXTENSION)return root.NM_MIDDLE_EXTENSION;
    if(typeof module!=='undefined'&&module.exports){try{return require('../data/middle-extension.js');}catch(_){return null;}}
    return null;
  }
  function fail(){throw new Error('invalid_learning_plan');}
  function monday(value){
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return fail();
    const ms=Date.parse(value+'T00:00:00Z');
    if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==value)return fail();
    return ms-((new Date(ms).getUTCDay()+6)%7)*DAY;
  }
  function weekMonday(value){
    const m=/^(\d{4})-W(\d{2})$/.exec(String(value||''));
    if(!m||+m[2]<1||+m[2]>53)return fail();
    const jan4=Date.parse(m[1]+'-01-04T00:00:00Z');
    const ms=jan4-((new Date(jan4).getUTCDay()+6)%7)*DAY+(+m[2]-1)*WEEK;
    if(new Date(ms+3*DAY).getUTCFullYear()!==+m[1])return fail();
    return ms;
  }
  function weekOf(ms){
    const year=new Date(ms+3*DAY).getUTCFullYear();
    const first=monday(String(year)+'-01-04');
    return year+'-W'+String(1+Math.round((ms-first)/WEEK)).padStart(2,'0');
  }
  function currentMonday(now){
    const ms=now===undefined?Date.now():now instanceof Date?+now:typeof now==='string'?Date.parse(now):NaN;
    if(!Number.isFinite(ms))return fail();
    return monday(new Date(ms+9*3600000).toISOString().slice(0,10));
  }
  function choices(course){
    if(!course||!Array.isArray(course.sessions)||!course.sessions.length)return fail();
    if(course.studyPlan){
      if(!Array.isArray(course.studyPlan.lessons)||!course.studyPlan.lessons.length)return fail();
      return course.studyPlan.lessons.map((lesson,i)=>{
        const n=Number(lesson.startSession);
        if(!Number.isSafeInteger(n)||n<1||n>course.sessions.length)return fail();
        return {index:i+1,sessionIndex:n};
      });
    }
    return course.sessions.map((_,i)=>({index:i+1,sessionIndex:i+1}));
  }
  function normalize(courses,settings){
    if(!courses||typeof courses!=='object'||!settings||typeof settings!=='object'||Array.isArray(settings))return fail();
    const course=courses[settings.courseKey];
    if(!/^C\d+$/.test(String(settings.courseKey))||!course)return fail();
    choices(course);
    const raw=settings.sessionIndex==null?1:Number(settings.sessionIndex);
    if(!Number.isSafeInteger(raw))return fail();
    // Existing exact-source plans can begin partway through a compact bundle.
    // Keep that source boundary; only the UI's explicit choices use canonical
    // bundle starts, so changing speed never reintroduces earlier source work.
    const sessionIndex=Math.max(1,Math.min(course.sessions.length,raw));
    const speed=settings.speed==null?1:Number(settings.speed),amount=settings.amount==null?1:Number(settings.amount);
    const cadence=settings.cadence==null?'w1':settings.cadence,pace=settings.pace==null?'p2':settings.pace;
    if(!MULTS.includes(speed)||!MULTS.includes(amount)||!['w1','w2'].includes(cadence)||!PACES.includes(pace))return fail();
    if(settings.startDate!=null)monday(settings.startDate);
    const result={...settings,sessionIndex,speed,amount,cadence,pace};
    if(own(settings,'middleExtensions')){
      const selected=settings.middleExtensions;
      if(!selected||typeof selected!=='object'||Array.isArray(selected))return fail();
      const ext=extensionData(),keys=Object.keys(selected);
      if(keys.some(key=>!['1','2','3'].includes(key)||!ext||selected[key]!==ext.version))return fail();
      result.middleExtensions={...selected};
    }
    if(settings.extensionAnchor!=null){
      const anchor=settings.extensionAnchor,grade=Number(anchor.grade),index=Number(anchor.index),ext=extensionData();
      if(!anchor||typeof anchor!=='object'||Array.isArray(anchor)||!ext||!own(extensionEnd,grade)||!Number.isSafeInteger(index)||index<0||index>=ext.length(grade)||settings.courseKey!==extensionEnd[grade]||result.middleExtensions?.[grade]!==ext.version)return fail();
      result.extensionAnchor={grade,index};
      if(anchor.resume!=null){
        const resume=anchor.resume,key=extensionNext[grade],session=Number(resume.sessionIndex);
        if(!resume||typeof resume!=='object'||Array.isArray(resume)||resume.courseKey!==key||!Number.isSafeInteger(session)||session<1||session>courses[key]?.sessions.length)return fail();
        result.extensionAnchor.resume={courseKey:key,sessionIndex:session};
      }
    }else delete result.extensionAnchor;
    return result;
  }
  function sourceRef(courseKey,course,i){
    const n=Number(course.sessions[i]?.minutes);
    return {courseKey,lessonIndex:i,startSession:i+1,endSession:i+1,sourceIndices:[i],estimatedMinutes:Number.isFinite(n)&&n>0?n:0};
  }
  function compactPosition(courses,settings,weekKey){
    const opts={...settings,startSession:settings.sessionIndex,weekKey};
    const assigned=HIGH.assignment(courses,opts);
    if(assigned?.weekLessons?.length){
      const first=assigned.weekLessons[0];
      return {...refPosition(courses,first,settings),weekLessons:assigned.weekLessons};
    }
    // A slow schedule may contain an empty week. Keep the next real lesson as
    // the editable position while returning no assignments for that week.
    const week=weekMonday(weekKey),start=monday(settings.startDate);
    const refs=HIGH.timeline(courses,opts);
    if(!refs?.length)return fail();
    const units=refs.reduce((n,ref)=>n+(Number(ref.scheduleUnits)||1),0);
    const duration=Math.ceil(units/(settings.cadence==='w2'?2:1)/settings.speed-1e-9);
    const elapsed=Math.max(0,(week-start)/WEEK);
    for(let offset=Math.max(0,elapsed+1);offset<duration;offset++){
      const next=HIGH.assignment(courses,{...opts,weekKey:weekOf(start+offset*WEEK)});
      if(next?.weekLessons?.length){const first=next.weekLessons[0];return {...refPosition(courses,first,settings),weekLessons:[]};}
    }
    return {...refPosition(courses,refs[refs.length-1],settings),weekLessons:[],complete:true};
  }
  function refPosition(courses,ref,settings){
    return ref.kind==='middle-extension'
      ?{courseKey:ref.courseKey,sessionIndex:courses[ref.courseKey].sessions.length,extensionAnchor:{grade:ref.grade,index:ref.extensionIndex,
        ...(settings?.extensionAnchor?.grade===ref.grade&&settings.extensionAnchor.resume?{resume:{...settings.extensionAnchor.resume}}:{})}}
      :{courseKey:ref.courseKey,sessionIndex:ref.startSession};
  }
  function position(courses,settings,weekKey){
    const current=normalize(courses,settings),week=weekMonday(weekKey);
    if(!current.startDate)return fail();
    const start=monday(current.startDate),keys=Object.keys(courses).filter(k=>/^C\d+$/.test(k)&&Array.isArray(courses[k]?.sessions)&&courses[k].sessions.length).sort((a,b)=>+a.slice(1)-+b.slice(1));
    let offset=Math.max(0,(week-start)/WEEK),cursor=start;
    const first=keys.indexOf(current.courseKey);
    if(week<start)return {courseKey:current.courseKey,sessionIndex:current.sessionIndex,...(current.extensionAnchor?{extensionAnchor:copyAnchor(current.extensionAnchor)}:{}),weekLessons:[]};
    for(let i=first;i<keys.length;i++){
      const key=keys[i],course=courses[key],from=i===first?current.sessionIndex:1;
      if(course.studyPlan)return compactPosition(courses,{...current,courseKey:key,sessionIndex:from,startDate:new Date(cursor).toISOString().slice(0,10)},weekKey);
      const remaining=course.sessions.length-from+1;
      const weeks=Math.max(1,Math.round(Math.ceil(remaining/(current.cadence==='w2'?2:1))*PLAN.paceMultiplier(courses,current.pace)/current.speed));
      if(offset<weeks){
        const begin=Math.floor(offset*remaining/weeks),end=Math.floor((offset+1)*remaining/weeks);
        const weekLessons=[];
        for(let j=begin;j<end;j++)weekLessons.push(sourceRef(key,course,from-1+j));
        return {courseKey:key,sessionIndex:from+Math.min(begin,remaining-1),weekLessons};
      }
      offset-=weeks;cursor+=weeks*WEEK;
    }
    const lastKey=keys[keys.length-1],last=choices(courses[lastKey]).slice(-1)[0];
    return {courseKey:lastKey,sessionIndex:last.sessionIndex,weekLessons:[],complete:true};
  }
  function change(courses,currentSettings,patch,options){
    options=options||{};
    if(!patch||typeof patch!=='object'||Array.isArray(patch))return fail();
    const allowed=['courseKey','sessionIndex','speed','amount','cadence','pace','middleExtensions','extensionAnchor'];
    if(Object.keys(patch).some(k=>!allowed.includes(k)))return fail();
    const start=options.weekKey==null?currentMonday(options.now):weekMonday(options.weekKey),weekKey=weekOf(start);
    if(options.now!==undefined)currentMonday(options.now);
    const old=normalize(courses,currentSettings);
    const at=position(courses,old,weekKey);
    const explicitAnchor=own(patch,'extensionAnchor')&&patch.extensionAnchor!=null;
    const courseKey=own(patch,'courseKey')?patch.courseKey:explicitAnchor?extensionEnd[patch.extensionAnchor.grade]:at.courseKey;
    const sessionIndex=own(patch,'sessionIndex')?patch.sessionIndex:explicitAnchor?courses[courseKey]?.sessions.length:own(patch,'courseKey')?1:at.sessionIndex;
    const next={...old,...patch,courseKey,sessionIndex,startDate:new Date(start).toISOString().slice(0,10)};
    if(own(patch,'extensionAnchor'))next.extensionAnchor=patch.extensionAnchor;
    else if(own(patch,'courseKey')||own(patch,'sessionIndex'))delete next.extensionAnchor;
    else if(at.extensionAnchor)next.extensionAnchor=copyAnchor(at.extensionAnchor);
    else delete next.extensionAnchor;
    return normalize(courses,next);
  }
  function copySettings(settings){
    if(!settings||typeof settings!=='object'||Array.isArray(settings))return fail();
    return {...settings,
      ...(settings.middleExtensions?{middleExtensions:{...settings.middleExtensions}}:{}),
      ...(settings.extensionAnchor?{extensionAnchor:copyAnchor(settings.extensionAnchor)}:{})};
  }
  function checkedHistory(history){
    if(history==null)return [];
    if(!Array.isArray(history))return fail();
    return history.map(item=>{
      if(!item||typeof item!=='object'||!own(item,'effectiveWeek'))return fail();
      if(item.effectiveWeek!==null)weekMonday(item.effectiveWeek);
      return {effectiveWeek:item.effectiveWeek,settings:copySettings(item.settings)};
    });
  }
  function record(history,currentSettings,nextSettings,weekKey){
    const week=weekMonday(weekKey),items=checkedHistory(history);
    const baseline=items.find(item=>item.effectiveWeek===null)||{effectiveWeek:null,settings:copySettings(currentSettings)};
    const retained=items.filter(item=>item.effectiveWeek!==null&&weekMonday(item.effectiveWeek)!==week);
    // Replacing the same week's edit prevents an unbounded history while the
    // baseline and all earlier weeks retain their original configuration.
    retained.push({effectiveWeek:weekKey,settings:copySettings(nextSettings)});
    return [{effectiveWeek:null,settings:copySettings(baseline.settings)},...retained.sort((a,b)=>weekMonday(a.effectiveWeek)-weekMonday(b.effectiveWeek))];
  }
  function forWeek(history,weekKey){
    const week=weekMonday(weekKey),items=checkedHistory(history);
    let selected=items.find(item=>item.effectiveWeek===null),at=-Infinity;
    for(const item of items){
      if(item.effectiveWeek===null)continue;
      const ms=weekMonday(item.effectiveWeek);
      if(ms<=week&&ms>=at){selected=item;at=ms;}
    }
    return selected?copySettings(selected.settings):null;
  }
  const api={choices,position,change,record,forWeek};
  root.NM_PLAN_CONTROL=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
