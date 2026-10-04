// Age controls question order. It never restricts learning scope or scores ability.
import { createState, acceptPlan, validateState, workload } from './engine.mjs';
export const TRACKS = {
 thinking: {axis:'thinking',label:'사고력',depth:''},
 application: {axis:'curriculum',label:'교과 기본·응용',depth:'기본·응용'},
 depth: {axis:'curriculum',label:'교과 심화',depth:'심화'},
 arithmetic: {axis:'arithmetic',label:'연산',depth:''},
 science: {axis:'science',label:'과학',depth:''}, other: {axis:'other',label:'타 과목',depth:''},
};
export const ELEMENTARY_BOOKS=['디딤돌 기본+응용','최상위 S 수학','최상위 수학','쎈수학'];
export const TYPE_NAMES={A:'기획자형',B:'평화주의자형',C:'아이디어뱅크형',D:'철학자형'};
export const TYPE_HELP={A:'변화하는 이유를 설명하고 작은 시도를 함께 정해 주세요.',B:'작은 목표와 익숙한 시작·마무리 순서를 함께 정해 주세요.',C:'떠오른 생각을 말로 설명하고 마무리하도록 도와주세요.',D:'배우는 이유와 원리를 함께 이야기해 주세요.'};
const copy=x=>structuredClone(x), id=()=>`course-${globalThis.crypto.randomUUID()}`;
export function koreaDate() { return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
export function ensureWizard(input) {
 const s=input||createState(`${koreaDate()}T00:00:00Z`);
 s.profile.reportedAge ??= null; s.profile.reportedBirthMonth ??= null;
 s.wizard ??= {step:'intro',history:[],axisStatus:{},thinkingExperience:'',academies:[],pendingCourseId:'',bookNeed:'standard',interests:[],progression:'continue',skipped:[],selectedCourseIds:null,completed:false};
 s.wizard.history ??=[];s.wizard.axisStatus??={};s.wizard.academies??=[];s.wizard.interests??=[];s.wizard.skipped??=[];
 s.personality ??={status:'not_selected',group:null,answers:[],cursor:0,history:[]};
 return s;
}
export function trackOf(c) { return c.intakeTrack|| (c.axis==='curriculum'?/심화/.test(c.depth||'')?'depth':'application':c.axis); }
export function trackCourses(s,key) { return s.courses.filter(c=>trackOf(c)===key); }
export function scopeLabel(c) { return [c.volume,c.unit,c.range].filter(Boolean).join(' · ')||'범위 미입력'; }
export function personalityGroup(age) { return Number.isInteger(age)&&age>=7&&age<=9?'young':Number.isInteger(age)&&age<=12&&age>=10?'middle':Number.isInteger(age)&&age>=13&&age<=15?'high':null; }
export function scorePersonality(person,data) {
 const qs=data.questions?.[person.group];
 if(person.status!=='completed'||!qs||person.answers.length!==qs.length||person.answers.some(n=>!Number.isInteger(n)||n<0||n>3))return null;
 const scores={A:0,B:0,C:0,D:0};qs.forEach((q,i)=>Object.entries(q.options[person.answers[i]].score).forEach(([k,v])=>scores[k]+=v));
 const sorted=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const primary=sorted[0][0],secondary=sorted[1][0];
 return {scores,primary,secondary,mixed:sorted[1][1]>=sorted[0][1]*.7,label:sorted[1][1]>=sorted[0][1]*.7?`${TYPE_NAMES[primary]} · ${TYPE_NAMES[secondary]}`:TYPE_NAMES[primary],help:TYPE_HELP[primary],sourceId:'PN01',academicAbility:false};
}
export function beginPersonality(s) {
 const group=personalityGroup(s.profile.reportedAge);if(!group)return false;
 const p=s.personality;
 if(p.group!==group||p.status==='completed'||p.status==='skipped') {
  if(p.answers?.length)p.history.push(copy({...p,history:undefined}));
  p.answers=[];p.cursor=0;p.group=group;
 }
 p.status='in_progress'; return true;
}
export function skipPersonality(s) { s.personality.status='skipped';advance(s,'goals'); }
export function setReportedAge(s,age) {
 if(age!==null&&(!Number.isInteger(age)||age<4||age>18))throw Error('나이를 확인해 주세요.');
 const before=s.profile.reportedAge;s.profile.reportedAge=age;
 if(before!==age&&s.personality.group!==personalityGroup(age)&&s.personality.status==='completed')s.personality.status='age_review';
 // Keep previously reported birth month; hiding a field does not erase history.
}
export function addBook(s,track,name) {
 if(!TRACKS[track]||!String(name).trim())throw Error('실제로 공부한 교재 이름을 적어 주세요.');
 const t=TRACKS[track];const c={id:id(),axis:t.axis,intakeTrack:track,subject:track==='other'?'':track==='science'?'과학':'수학',course:String(name).trim(),edition:'',volume:'',unit:'',range:'',depth:t.depth,independence:'',level:'unknown',completion:'unknown',coverageIntent:'unknown',status:'active',plannedRange:'',sourceRole:'parent_report',evidenceDate:koreaDate(),note:'',curriculumTarget:''};
 s.courses.push(c);s.wizard.axisStatus[track]='learning';s.wizard.pendingCourseId=c.id;return c;
}
export function saveBookDetails(s,data) {
 const c=s.courses.find(c=>c.id===s.wizard.pendingCourseId);if(!c)throw Error('상세 내용을 연결할 교재가 없습니다.');
 for(const k of ['volume','unit','range','edition','independence','plannedRange','curriculumTarget','subject','sourceCurriculum','isbn'])if(k in data)c[k]=String(data[k]);
 for(const k of ['completion','level','coverageIntent','status'])if(k in data)c[k]=data[k];
 c.evidenceDate=koreaDate();
 const v=validateState(s);if(!v.valid)throw Error(v.errors.join('\n'));return c;
}
export function curriculumFor(grade,year=2026) {
 const m=/^(초|중|고)([1-6])$/.exec(grade||'');if(!m)return null;
 if(year>=2027)return {name:'2022 개정',year,sourceId:'CUR01'};
 if(year===2026)return {name:(m[1]==='초'||Number(m[2])<=2)?'2022 개정':'2015 개정',year,sourceId:'CUR01'};
 return null;
}
export function bookRecommendation(s,catalog) {
 const need=s.wizard.bookNeed||'standard',policy=catalog.elementary_book_policy;
 const choice=need==='standard'?policy.default:policy.reported_needs[need]||policy.default;
 return {book:choice,sourceId:'UF06',need,reason:{standard:'초등 기본·응용의 표준 교재',progress_late:'가족이 선행이 늦다고 보고한 상황',reading:'가족이 지문 이해를 더 살펴보고 싶다고 선택한 상황',fast:'가족이 빠른 선행을 희망한 상황',consolidation:'가족이 다지기를 희망한 상황'}[need]||'표준 교재 비교',diagnosis:false};
}
export function positionRows(s) {
 return Object.keys(TRACKS).filter(k=>['thinking','application','depth','arithmetic'].includes(k)||trackCourses(s,k).length).map(key=>({key,label:TRACKS[key].label,status:s.wizard.axisStatus[key]||'unknown',courses:trackCourses(s,key).map(c=>({id:c.id,name:c.course,scope:scopeLabel(c),level:c.level,completion:c.completion,independence:c.independence,edition:c.edition}))}));
}
export function nextStep(s,step=s.wizard.step) {
 const w=s.wizard;
 switch(step){
 case 'intro':return 'age';case 'age':return [4,5,6].includes(s.profile.reportedAge)?'birth':'grade';case 'birth':return 'grade';case 'grade':return 'thinking';
 case 'thinking':return ['academy','both'].includes(w.thinkingExperience)?'academy':['books'].includes(w.thinkingExperience)?'books:thinking':'books:application';
 case 'academy':return w.thinkingExperience==='both'?'books:thinking':'books:application';
 case 'books:thinking':return 'books:application';case 'books:application':return 'depth-status';case 'depth-status':return ['learning','paused','done'].includes(w.axisStatus.depth)?'books:depth':'books:arithmetic';case 'books:depth':return 'books:arithmetic';
 case 'books:arithmetic':return 'position';case 'position':return 'personality';case 'personality':return 'goals';case 'personality-result':return 'goals';
 case 'goals':return 'time';case 'time':return 'academy-time';case 'academy-time':return 'interests';
 case 'interests':return w.interests.includes('premier')?'premier':w.interests.includes('hwangso')?'hwangso':nextExtra(s);
 case 'premier':return w.interests.includes('hwangso')?'hwangso':nextExtra(s);
 case 'hwangso':return ['later','none'].includes(s.goals.hwangso)?'hwangso-reason':nextExtra(s);
 case 'hwangso-reason':return nextExtra(s);
 case 'science-detail':return w.interests.includes('gifted')?'gifted':w.interests.includes('competition')?'competition':w.interests.includes('highSchool')?'school':w.interests.includes('other')?'books:other':'routes';
 case 'gifted':return w.interests.includes('competition')?'competition':w.interests.includes('highSchool')?'school':w.interests.includes('other')?'books:other':'routes';
 case 'competition':return w.interests.includes('highSchool')?'school':w.interests.includes('other')?'books:other':'routes';
 case 'school':return w.interests.includes('other')?'books:other':'routes';case 'books:other':return 'routes';
 case 'routes':return 'plan';default:return 'routes';
 }
}
function nextExtra(s){const a=s.wizard.interests;return a.includes('science')?'science-detail':a.includes('gifted')?'gifted':a.includes('competition')?'competition':a.includes('highSchool')?'school':a.includes('other')?'books:other':'routes';}
export function advance(s,target) {s.wizard.history.push(s.wizard.step);s.wizard.step=target||nextStep(s);}
export function back(s){const previous=s.wizard.history.pop();if(previous)s.wizard.step=previous;}
export function chosenWorkload(s,courseIds) {
 const chosen=new Set(courseIds);const relevant=s.activities.filter(a=>a.scope!=='candidate'||(a.courseIds||[]).some(x=>chosen.has(x)));
 const report=workload({...s,activities:relevant});
 return {...report,selectionCourseIds:[...chosen],unattachedCandidateCount:s.activities.filter(a=>a.scope==='candidate'&&!(a.courseIds||[]).length).length};
}
export function saveFamilyPlan(s,{courseIds,progression,title,reason,condition}){
 const pMap={continue:'B09:P1',later:'B09:P2',parallel:'B09:P3',same_scope:'B09:P4',remediation:'B09:P5',undecided:'B09:P6'};
 const routeIds=[pMap[progression]||pMap.continue];
 if(s.wizard.interests.includes('hwangso'))routeIds.push({grade2:'B28:P1',grade3:'B28:P2',none:'B28:P3',undecided:'B28:P5',later:'B28:P6',unknown:'B28:P5'}[s.goals.hwangso]);
 else routeIds.push('B28:P7');
 const reviewPoints=[{id:`review-${crypto.randomUUID()}`,courseId:'',branchId:'B09',trigger:progression==='later'?'manual':'scope_completed',condition:condition||'입력한 범위의 이해·도움·부담과 가족의 병행 여유를 다시 확인할 때',nextAction:'현재 응용 유지·이전 범위 심화 추가·병행·보완을 다시 비교'}];
 const next=acceptPlan(s,{routeIds,courseIds,title:title||'우리 아이 기준 로드맵',reason,reviewPoints});
 const plan=next.plans.at(-1);plan.progression={kind:progression,state:'family_selected',automaticJoin:false,sourceIds:['UF03','F01','F21','F25'],reviewPointIds:reviewPoints.map(p=>p.id)};
 plan.workloadSnapshot=chosenWorkload(s,courseIds);plan.curriculumPolicySnapshot={sourceIds:['UF04','CUR01','CUR02'],bookMapping:'not_verified',automaticCourseRename:false};
 plan.bookRecommendationSnapshot={need:s.wizard.bookNeed||'standard',sourceId:'UF06',isVerifiedState:false};
 next.wizard.completed=true;next.wizard.step='plan';return next;
}
