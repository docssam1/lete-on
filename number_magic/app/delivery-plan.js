/* Frozen, non-identifying learning settings for new personal worksheet links.
 * The server gates ownership, membership and SMS consent. This decoder grants no
 * account access; it only reproduces a saved worksheet without current state. */
(function(root){
  'use strict';
  const VERSION='20261026-personal2',LEGACY_VERSION='20261024-personal1',CURRICULUM_REVISION='20261026-curriculum2',EXTENSION_VERSION='20261024-middle-extension1';
  const SOURCE_LIMITS={"C0":19,"C1":6,"C2":6,"C3":8,"C4":9,"C5":8,"C6":8,"C7":4,"C8":9,"C9":11,"C10":6,"C11":8,"C12":6,"C13":4,"C14":4,"C15":4,"C16":5,"C17":9,"C18":5,"C19":4,"C20":7,"C21":6,"C22":4,"C23":7,"C24":7,"C25":4,"C26":8,"C27":12,"C28":12,"C29":11,"C30":9,"C31":11,"C32":8,"C33":7,"C34":9,"C35":8,"C36":10,"C37":13,"C38":8,"C39":9,"C40":7,"C41":8,"C42":8,"C43":6,"C44":6,"C45":7,"C46":8,"C47":5,"C48":4,"C49":7,"C50":7,"C51":8,"C52":5,"C53":8,"C54":7,"C55":9,"C56":8,"C57":8,"C58":8,"C59":10,"C60":10,"C61":9,"C62":8,"C63":8,"C64":4,"C65":7,"C66":8,"C67":8,"C68":7,"C69":5,"C70":5,"C71":4,"C72":6,"C73":5};
  const MULTS=[0.7,0.85,1,1.25,1.5],DAY=86400000;
  const own=(v,k)=>Object.prototype.hasOwnProperty.call(v,k);
  const obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
  const end={1:'C31',2:'C34',3:'C37'},next={1:'C32',2:'C35',3:'C38'};
  function date(value){
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
    const ms=Date.parse(value+'T00:00:00Z'),y=Number(value.slice(0,4));
    return y>=2020&&y<=2100&&Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,10)===value?value:null;
  }
  function weekMonday(value){
    const m=/^(\d{4})-W(\d{2})$/.exec(String(value||''));
    if(!m||+m[1]<2020||+m[1]>2100||+m[2]<1||+m[2]>53)return null;
    const jan4=Date.parse(m[1]+'-01-04T00:00:00Z');
    const ms=jan4-(new Date(jan4).getUTCDay()+6)%7*DAY+(+m[2]-1)*7*DAY;
    return new Date(ms+3*DAY).getUTCFullYear()===+m[1]?ms:null;
  }
  function normalize(value){
    if(!obj(value)||!own(SOURCE_LIMITS,value.courseKey)||!Number.isInteger(value.sessionIndex)
      ||value.sessionIndex<1||value.sessionIndex>SOURCE_LIMITS[value.courseKey]||!date(value.startDate)
      ||!MULTS.includes(value.speed)||!MULTS.includes(value.amount)||!['w1','w2'].includes(value.cadence)
      ||!['p0','p1','p2','p3','p4'].includes(value.pace))return null;
    const p={courseKey:value.courseKey,sessionIndex:value.sessionIndex,startDate:value.startDate,
      speed:value.speed,amount:value.amount,cadence:value.cadence,pace:value.pace};
    if(own(value,'curriculumRevision')){
      if(value.curriculumRevision!==CURRICULUM_REVISION)return null;
      p.curriculumRevision=value.curriculumRevision;
    }
    if(own(value,'middleExtensions')){
      if(!obj(value.middleExtensions)||Object.keys(value.middleExtensions).some(k=>!['1','2','3'].includes(k)||value.middleExtensions[k]!==EXTENSION_VERSION))return null;
      p.middleExtensions={};for(const g of ['1','2','3'])if(own(value.middleExtensions,g))p.middleExtensions[g]=EXTENSION_VERSION;
    }
    if(own(value,'extensionAnchor')){
      const a=value.extensionAnchor;
      if(!obj(a)||!Number.isInteger(a.grade)||!own(end,a.grade)||!Number.isInteger(a.index)||a.index<0||a.index>=12
        ||p.courseKey!==end[a.grade]||p.middleExtensions?.[a.grade]!==EXTENSION_VERSION)return null;
      p.extensionAnchor={grade:a.grade,index:a.index};
      if(own(a,'resume')){
        const r=a.resume;
        if(!obj(r)||r.courseKey!==next[a.grade]||!Number.isInteger(r.sessionIndex)||r.sessionIndex<1||r.sessionIndex>SOURCE_LIMITS[r.courseKey])return null;
        p.extensionAnchor.resume={courseKey:r.courseKey,sessionIndex:r.sessionIndex};
      }
    }
    return p;
  }
  function fromState(state,weekKey){
    if(!obj(state)||!own(state,'learningPlan'))return null;
    if(weekMonday(weekKey)===null)throw new Error('invalid_delivery_week');
    let selected=state.learningPlan,history=state.learningPlanHistory;
    if(history!=null){
      if(!Array.isArray(history)||history.length>1000)throw new Error('invalid_delivery_history');
      let baseline=null,latest=-Infinity;
      for(const h of history){
        if(!obj(h)||!own(h,'effectiveWeek')||!normalize(h.settings)||(own(h.settings,'legacy')&&typeof h.settings.legacy!=='boolean'))throw new Error('invalid_delivery_history');
        if(h.effectiveWeek===null){if(!baseline)baseline=h.settings;continue;}
        const at=weekMonday(h.effectiveWeek);if(at===null)throw new Error('invalid_delivery_history');
        if(at<=weekMonday(weekKey)&&at>=latest){latest=at;selected=h.settings;}
      }
      if(latest===-Infinity&&baseline)selected=baseline;
    }
    if(!normalize(selected))throw new Error('invalid_delivery_plan');
    return selected.legacy===true?null:normalize(selected);
  }
  function fromConfig(c){
    if(!obj(c)||![LEGACY_VERSION,VERSION].includes(c.deliveryPlanVersion)||own(c,'highPlanVersion')||c.k!==1||weekMonday(c.week)===null)return null;
    const p=normalize(c.learningPlan);
    if(c.deliveryPlanVersion===LEGACY_VERSION&&p?.curriculumRevision)return null;
    return p&&c.courseKey===p.courseKey&&c.sessionIndex===p.sessionIndex&&c.amount===p.amount&&c.cadence===p.cadence?p:null;
  }
  function encode(value){
    const p=normalize(value);if(!p)throw new Error('invalid_delivery_plan');
    const s=JSON.stringify(p);
    const b=typeof Buffer!=='undefined'?Buffer.from(s,'ascii').toString('base64'):btoa(s);
    return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function decode(value){
    if(typeof value!=='string'||value.length<1||value.length>2048||!/^[A-Za-z0-9_-]+$/.test(value))return null;
    try{
      const b=value.replace(/-/g,'+').replace(/_/g,'/');
      const s=typeof Buffer!=='undefined'?Buffer.from(b,'base64').toString('utf8'):atob(b);
      const p=normalize(JSON.parse(s));
      return p&&encode(p)===value?p:null;
    }catch(_){return null;}
  }
  function managedVersion(courseKey,version){
    const band=/^C(29|3[0-7])$/.test(courseKey)?'middle':/^C(3[89]|[4-6][0-9])$/.test(courseKey)?'high':/^C7[0-3]$/.test(courseKey)?'calculus':null;
    if(!band)return null;
    const versions={middle:['20261023-middle25','20261026-middle25-v2'],high:['20261023-high3m','20261026-high3m-v2'],calculus:['20261024-calculus3m','20261026-calculus3m-v2']}[band];
    return version===versions[0]?LEGACY_VERSION:version===versions[1]?VERSION:null;
  }
  function resolveCourses(courses,version){
    if(version===VERSION)return courses;
    if(version!==LEGACY_VERSION)return null;
    return root.NM_DELIVERY_COURSES_V1||(typeof module!=='undefined'&&module.exports?require('../data/delivery-courses-v1.js'):null);
  }
  function assignment(courses,value,weekKey,version=VERSION){
    const p=normalize(value);if(!p||weekMonday(weekKey)===null||version===LEGACY_VERSION&&p.curriculumRevision)return null;
    const control=root.NM_PLAN_CONTROL||(typeof module!=='undefined'&&module.exports?require('./plan-control.js'):null);
    const resolved=resolveCourses(courses,version);
    try{return control&&resolved?control.position(resolved,p,weekKey):null;}catch(_){return null;}
  }
  const api={VERSION,LEGACY_VERSION,CURRICULUM_REVISION,managedVersion,resolveCourses,EXTENSION_VERSION,SOURCE_LIMITS,normalize,fromState,fromConfig,encode,decode,assignment,weekMonday};
  root.NM_DELIVERY_PLAN=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

