(function(root){
  'use strict';
  const DAY=86400000, MULTS=[0.7,0.85,1,1.25,1.5];
  const HIGH=root.NM_HIGH_PACING || (typeof module!=='undefined'&&module.exports?require('../data/high-pacing.js'):null);
  const langText=(v,l)=>typeof v==='string'?v:(v&&(v[l]||v.ko))||'';
  function paceMultiplier(courses,pace){
    const offsets={p0:0,p1:3,p2:7,p3:12,p4:17};
    const base=Object.keys(courses||{}).filter(k=>/^C\d+$/.test(k)&&+k.slice(1)>=1&&+k.slice(1)<=25).reduce((n,k)=>n+(courses[k].sessions||[]).length,0)/4;
    return base?(base+(offsets[pace]===undefined?7:offsets[pace]))/base:1;
  }
  function date(value){
    if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)){
      const d=new Date(value+'T00:00:00Z');
      if(Number.isFinite(+d)&&d.toISOString().slice(0,10)===value)return d;
      throw new Error('invalid_date');
    }
    const d=value instanceof Date?value:new Date(value||Date.now());
    if(!Number.isFinite(+d))throw new Error('invalid_date');
    // All calendar labels use the Korean date, independent of the machine timezone.
    return new Date(new Date(+d+9*3600000).toISOString().slice(0,10)+'T00:00:00Z');
  }
  function academicGrade(entryYear,d){
    if(!Number.isInteger(Number(entryYear))||Number(entryYear)<2000||Number(entryYear)>2100)return null;
    return d.getUTCFullYear()-(d.getUTCMonth()<2?1:0)-Number(entryYear)+1;
  }
  function schoolLabel(entryYear,d,lang,birthYear){
    const g=academicGrade(entryYear,d),m=d.getUTCMonth()+1;
    if(g===null)return lang==='en'?'Grade not entered':lang==='zh'?'未填写年级':'학년 입력 필요';
    let grade;
    if(lang==='en')grade=g<=0?'Preschool ('+(1-g)+' years to school)':g>12?'Graduated':'Grade '+g;
    else if(lang==='zh')grade=g<=0?'学前'+(1-g)+'年':g>12?'已毕业':g<=6?'小'+g:g<=9?'初'+(g-6):'高'+(g-9);
    else grade=g<=0?(d.getUTCFullYear()-(Number(birthYear)||Number(entryYear)-7)+1)+'세':g>12?'졸업':g<=6?'초'+g:g<=9?'중'+(g-6):'고'+(g-9);
    return grade+(lang==='en'?' · month '+m:' '+m+(lang==='zh'?'月':'월'));
  }
  function project(courses,settings,options){
    settings=settings||{};options=options||{};if(HIGH)HIGH.attach(courses);
    const lang=['ko','en','zh'].includes(options.lang)?options.lang:'ko';
    const today=date(options.now||new Date()),start=date(settings.startDate||today);
    const keys=Object.keys(courses||{}).filter(k=>/^C\d+$/.test(k)).sort((a,b)=>+a.slice(1)-+b.slice(1));
    const first=keys.indexOf(settings.courseKey||'C1');
    if(first<0)throw new Error('invalid_course');
    const speed=MULTS.includes(Number(settings.speed))?Number(settings.speed):1;
    const pace=paceMultiplier(courses,settings.pace||'p2');
    const cadence=settings.cadence==='w2'?2:1,segments=[];
    let cursor=+start;
    for(let i=first;i<keys.length;i++){
      const c=courses[keys[i]],n=(c.sessions||[]).length;if(!n)continue;
      const from=i===first?Math.max(1,Math.min(n,Math.floor(Number(settings.sessionIndex)||1))):1;
      const compact=!!c.studyPlan, count=compact?HIGH.length(c):n;
      const firstLesson=compact?HIGH.lessonIndex(c,from)+1:from;
      const remaining=count-firstLesson+1;
      // Carry fractional high-school weeks across course boundaries. Rounding
      // each small course separately would erase the selected learning speed.
      const courseCadence=options.standard&&compact?(/^middle[123]$/.test(c.tier)?1:2):cadence;
      const weeks=compact?remaining/courseCadence/speed
        :Math.max(1,Math.round(Math.ceil(remaining/cadence)*pace/speed));
      const end=cursor+weeks*7*DAY;
      segments.push({key:keys[i],title:langText(c.title,lang),start:cursor,end,from:firstLesson,n:count,compact});cursor=end;
    }
    const firstDate=new Date(Math.max(+start,+today));
    let month=new Date(Date.UTC(firstDate.getUTCFullYear(),firstDate.getUTCMonth(),1));
    const rows=[],months=Math.min(36,Math.max(1,Math.floor(Number(options.months)||12)));
    for(let i=0;i<months;i++){
      const next=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth()+1,1));
      const spans=segments.filter(s=>s.start<+next&&s.end>+month);
      rows.push({month:month.toISOString().slice(0,7),schoolLabel:schoolLabel(settings.entryYear,month,lang,settings.birthYear),courseKeys:spans.map(s=>s.key),courseLabels:spans.map(s=>s.key+' · '+s.title),sessionLabels:spans.map(s=>{
        const count=s.n-s.from+1;
        const a=Math.min(s.n,s.from+Math.floor(Math.max(0,+month-s.start)/(s.end-s.start)*count));
        const b=Math.min(s.n,s.from-1+Math.ceil(Math.min(s.end,+next)-s.start>0?(Math.min(s.end,+next)-s.start)/(s.end-s.start)*count:1));
        return a+'–'+Math.max(a,b)+(s.compact?(lang==='en'?' study bundles':lang==='zh'?'学习组':' 학습 묶음'):(lang==='en'?' sessions':lang==='zh'?'课次':'회차'));
      })});month=next;
    }
    return {rows,milestones:segments.map(s=>{
      // A calendar milestone is the end of the final assigned week. Only this
      // cumulative display boundary is rounded; segment durations stay exact.
      const end=s.compact?+start+Math.ceil((s.end-+start)/(7*DAY)-1e-9)*7*DAY:s.end;
      return {key:s.key,title:s.title,date:new Date(end).toISOString().slice(0,10),
        schoolLabel:schoolLabel(settings.entryYear,new Date(end),lang,settings.birthYear)};
    }),estimated:true};
  }
  function recommend(courses,settings,options){
    const lang=(options||{}).lang||'ko';
    const t=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
    return {title:t('유아 연산 참고 속도','Preschool pace reference','学前运算参考进度'),
      advice:t('수 개념과 계산 방법을 말로 설명하는지, 도형·규칙 활동도 함께 익히는지 살펴보며 속도를 조정해요.','Adjust the pace by checking number concepts, spoken explanations, shapes and patterns.','根据数概念、口头解释、图形与规律活动的掌握情况调整进度。'),
      reference:t('원장 기준: 빠른 유아는 6세 3월 과정 1에서 시작해 한 달에 한 과정을 참고해요. 필즈·소마 공식 진도나 입학 기준으로 표시하지 않아요.','Director reference: a fast preschool plan starts Course 1 in March of Korean age 6, at about one course a month. This is not an official Fields or SOMA entry requirement.','园长参考：进度较快的幼儿可从韩国年龄6岁3月开始课程1，参考每月一课程。这不是Fields或SOMA的官方进度或入学标准。'),
      sources:[{label:t('소마 공식 과정 안내','SOMA official programs','SOMA官方课程'),url:'https://new.somai.co.kr/menu/150/page/'},{label:t('필즈 대치 공식 유아 안내','Fields Daechi official preschool information','Fields大峙官方学前信息'),url:'https://www2.fieldsgood.co.kr/fet/index.php?fc_ccode=F001'}]};
  }
  function standard(courses,settings,options){
    return project(courses,{...settings,speed:1,cadence:'w1',pace:'p2'},{...options,standard:true});
  }
  const api={project,standard,recommend,academicGrade,schoolLabel,paceMultiplier};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.NM_LEARNING_PLAN=api;
})(typeof window!=='undefined'?window:globalThis);
