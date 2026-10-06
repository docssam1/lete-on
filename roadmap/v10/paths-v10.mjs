import {acceptPlan,activeModules,getAnswer} from './engine.mjs';
import {ensureWizard,trackOf,scopeLabel,personalityGroup,chosenWorkload} from './flow.mjs';
import {observationFor,courseScope} from './advisor.mjs';

export const RELATIONS={R01:'기본·응용 이어가기',R02:'응용을 이어가고 심화는 나중 추가',R03:'서로 다른 범위의 응용·심화 병행',R04:'같은 범위 응용 뒤 심화',R05:'심화 중심에서 응용 병행으로',R06:'필요 범위 보완 후 합류',R07:'일부 과정 조정·휴식·재개',R08:'판단 보류·후보 비교'};
export const INTENTS={continue:'계속하기',reduce:'분량 조정',pause:'잠시 쉬기',start_later:'나중 시작',focus:'중심으로 배우기',parallel:'함께 배우기',review_or_remediate:'범위 확인·보완 검토',undecided:'아직 결정하지 않음'};
export const TRIGGERS={family_review:'가족이 다시 살펴볼 때',scope_change:'범위가 바뀌었을 때',reported_burden:'부담이 달라졌을 때',observation_added:'최근 학습 모습을 확인했을 때',diagnosis_added:'진단 근거가 추가됐을 때',schedule_change:'시간 여건이 달라졌을 때',goal_change:'목표가 달라졌을 때'};
const clone=x=>structuredClone(x), uid=p=>`${p}-${crypto.randomUUID()}`;
export function ensureV10(input){
 const s=ensureWizard(input),w=s.wizard;
 if(!w.v10){
  w.v10={version:10,direction:'continue',variant:'parallel',intents:{},plannedCourses:[],relations:[],reviewedScopes:{},legacySelections:[]};
  if(s.plans.length||w.completed||w.history.length)w.v10.legacySelections.push({progression:w.progression||'unknown',reviewRequired:true,at:new Date().toISOString(),note:'이전 진행 방향 보존. 대상 범위·합류 관계는 추정하지 않음.'});
 }
 for(const [k,v] of Object.entries({intents:{},plannedCourses:[],relations:[],reviewedScopes:{},legacySelections:[]}))w.v10[k]??=v;
 s.goals.hwangsoInquiry??=w.interests.includes('hwangso')?'answered':'not_asked';
 return s;
}
export function levelFromScope(volume){
 const v=String(volume||'').trim();
 return /^(?:중(?:등)?\s*[1-3]|중학교)/.test(v)?'middle':/^(?:고(?:등)?\s*[1-3]|공통수학|대수|미적분|확률과\s*통계|기하)/.test(v)?'high':/^[1-6]\s*[-－]\s*[12]$/.test(v)?'elementary':'unknown';
}
export function nextV10(s,step=s.wizard.step){
 const w=s.wizard;
 switch(step){
 case 'intro':return 'age';case 'age':case 'birth':return 'grade';case 'grade':return 'thinking';
 case 'thinking':return ['academy','both'].includes(w.thinkingExperience)?'academy':w.thinkingExperience==='books'?'books:thinking':'books:application';
 case 'academy':return w.thinkingExperience==='both'?'books:thinking':'books:application';
 case 'books:thinking':return 'books:application';case 'books:application':return 'depth-status';
 case 'depth-status':return ['learning','paused','done'].includes(w.axisStatus.depth)?'books:depth':'books:arithmetic';case 'books:depth':return 'books:arithmetic';
 case 'books:arithmetic':return 'position';case 'position':return personalityGroup(s.profile.reportedAge)?'personality':'interests';
 case 'personality':case 'personality-result':return 'interests';
 case 'interests':return 'time';case 'time':case 'academy-time':return 'goals';
 case 'goals':return extra(s);
 case 'premier':return w.interests.includes('hwangso')?'hwangso':extra(s,'premier');
 case 'hwangso':return 'hwangso-reason';case 'hwangso-reason':return extra(s,'hwangso');
 case 'science-detail':return extra(s,'science');case 'gifted':return extra(s,'gifted');case 'competition':return extra(s,'competition');case 'school':return extra(s,'highSchool');case 'books:other':return 'routes';
 default:return 'routes';
 }
}
function extra(s,after=''){
 const keys=['premier','hwangso','science','gifted','competition','highSchool','other'];
 const steps=['premier','hwangso','science-detail','gifted','competition','school','books:other'];
 for(let i=after?keys.indexOf(after)+1:0;i<keys.length;i++)if(s.wizard.interests.includes(keys[i]))return steps[i];
 return 'routes';
}
export function selectedIds(s){return s.wizard.selectedCourseIds??s.courses.filter(c=>c.status!=='ended').map(c=>c.id);}
export function courseIntent(s,c){
 const v=s.wizard.v10;if(v.intents[c.id])return v.intents[c.id];
 if(v.direction==='undecided')return 'undecided';
 if(c.status==='paused')return 'pause';if(c.status==='reduced')return 'reduce';
 if(trackOf(c)==='depth'&&v.direction==='depth_focus')return 'focus';
 if(trackOf(c)==='depth'&&v.direction==='add_depth'&&v.variant==='parallel')return 'parallel';
 return 'continue';
}
export function addPlanned(s,input){
 if(!['application','depth','thinking','arithmetic','science','other'].includes(input.track))throw Error('예정 과정의 축을 확인해 주세요.');
 if(!String(input.name||'').trim())throw Error('나중에 추가할 교재·과정 이름을 알려 주세요. 범위는 모름으로 남길 수 있어요.');
 const v=s.wizard.v10,p={id:input.id||uid('planned'),track:input.track,name:String(input.name).trim(),scope:String(input.scope||''),state:'planned',sourceRole:'family_wish'};
 const i=v.plannedCourses.findIndex(x=>x.id===p.id);if(i>=0)v.plannedCourses[i]=p;else v.plannedCourses.push(p);return p;
}
export function saveRelation(s,input){
 if(!RELATIONS[input.kind])throw Error('관계를 선택해 주세요.');
 const courses=new Set(s.courses.map(c=>c.id)),planned=new Set(s.wizard.v10.plannedCourses.map(p=>p.id));
 const sourceIds=[...new Set(input.sourceCourseIds||[])],targetIds=[...new Set(input.targetPlannedCourseIds||[])];
 if(sourceIds.some(x=>!courses.has(x))||targetIds.some(x=>!planned.has(x)))throw Error('관계에 연결한 과정을 확인해 주세요.');
 if(!TRIGGERS[input.reviewTrigger||'family_review'])throw Error('다시 살펴볼 계기를 확인해 주세요.');
 const r={id:input.id||uid('relation'),kind:input.kind,sourceCourseIds:sourceIds,targetPlannedCourseIds:targetIds,parallelCourseIds:[],scopeSnapshots:sourceIds.map(id=>({courseId:id,scope:courseScope(s.courses.find(c=>c.id===id))})),condition:String(input.condition||''),reviewTrigger:input.reviewTrigger||'family_review',conditionEvidenceIds:[],unresolved:[],status:'candidate',automaticJoin:false,sourceIds:input.kind==='R05'?['UF03']:['UF03','F01','F21','F25']};
 const v=s.wizard.v10,i=v.relations.findIndex(x=>x.id===r.id);if(i>=0)v.relations[i]=r;else v.relations.push(r);return r;
}
export function defaultKind(s){const v=s.wizard.v10;return v.direction==='add_depth'?({later:'R02',parallel:'R03',same_scope:'R04'}[v.variant]||'R03'):v.direction==='depth_focus'?'R05':v.direction==='undecided'?'R08':'R01';}
export function relationCandidates(s){
 const v=s.wizard.v10,ids=selectedIds(s),courses=s.courses.filter(c=>ids.includes(c.id)),kind=defaultKind(s);
 const primary=courses.filter(c=>['application','depth'].includes(trackOf(c)));
 const derived={id:'primary-direction',kind,sourceCourseIds:primary.map(c=>c.id),targetPlannedCourseIds:v.plannedCourses.map(p=>p.id),parallelCourseIds:courses.filter(c=>!primary.includes(c)).map(c=>c.id),scopeSnapshots:primary.map(c=>({courseId:c.id,scope:courseScope(c)})),condition:v.reviewCondition||'',reviewTrigger:'family_review',conditionEvidenceIds:[],unresolved:[],status:'candidate',automaticJoin:false,sourceIds:kind==='R05'?['UF03']:['UF03','F01','F21','F25']};
 const adjustments=courses.filter(c=>['reduce','pause','review_or_remediate'].includes(v.intents[c.id])).map(c=>({...clone(derived),id:`adjust-${c.id}`,kind:v.intents[c.id]==='review_or_remediate'?'R06':'R07',sourceCourseIds:[c.id],targetPlannedCourseIds:[],parallelCourseIds:courses.filter(x=>x.id!==c.id).map(x=>x.id),scopeSnapshots:[{courseId:c.id,scope:courseScope(c)}]}));
 return [derived,...adjustments,...clone(v.relations)].map(r=>{
  r.unresolved=[];
  if(!r.sourceCourseIds.length)r.unresolved.push('기준으로 연결할 실제 과정·범위 확인');
  if(['R02','R04','R05','R06'].includes(r.kind)&&!r.targetPlannedCourseIds.length)r.unresolved.push('나중 추가·합류 대상 범위 확인');
  for(const cid of r.sourceCourseIds){const c=s.courses.find(c=>c.id===cid);if(observationFor(s,c).status!=='parent_report'||observationFor(s,c).help==='unknown'||observationFor(s,c).burden==='unknown')r.unresolved.push(`${c.course} ${scopeLabel(c)} 최근 수행 확인`);}
  if(s.support.weekdayMinutes===null||s.support.weekendMinutes===null)r.unresolved.push('가정 시간 여건 미확인');
  r.conditionEvidenceIds=r.sourceCourseIds.filter(cid=>observationFor(s,s.courses.find(c=>c.id===cid)).status==='parent_report').map(cid=>`observation:${cid}`);
  return r;
 });
}
export function pendingReviews(s){
 const v=s.wizard.v10,needed=new Set();
 for(const r of relationCandidates(s))if(!['R01','R08'].includes(r.kind))r.sourceCourseIds.forEach(cid=>needed.add(cid));
 return [...needed].filter(cid=>{const c=s.courses.find(c=>c.id===cid);return observationFor(s,c).status!=='parent_report'&&v.reviewedScopes[cid]!==JSON.stringify(courseScope(c));});
}
export function markReview(s,cid){const c=s.courses.find(c=>c.id===cid);if(c)s.wizard.v10.reviewedScopes[cid]=JSON.stringify(courseScope(c));}
export function acceptV10(s,{title,reason}={}){
 const relations=relationCandidates(s),ids=selectedIds(s),v=s.wizard.v10;
 const points=relations.map(r=>({id:uid('review'),courseId:r.sourceCourseIds[0]||'',branchId:r.kind==='R07'?'B95':'B09',trigger:'manual',condition:r.condition||'대상 범위의 최근 수행·도움·부담과 시간 여건을 다시 살펴볼 때',nextAction:`${RELATIONS[r.kind]}: 시작·유지·보류·변경 중 가족이 다시 선택`,relationId:r.id}));
 const statuses=Object.fromEntries(ids.map(cid=>{const c=s.courses.find(c=>c.id===cid),a=courseIntent(s,c);return [cid,a==='pause'?'paused':a==='reduce'?'reduced':a==='continue'?'active':c.status];}));
 const routeIds=['B09'];
 if(s.wizard.interests.includes('hwangso'))routeIds.push(({grade2:'B28:P1',grade3:'B28:P2',later:'B28:P6',none:'B28:P3',undecided:'B28:P5',unknown:'B28:P5'})[s.goals.hwangso]);
 const n=acceptPlan(s,{routeIds,courseIds:ids,trackStatuses:statuses,title:title||s.wizard.planTitle||'우리 아이 기준 로드맵',reason:reason||s.wizard.planReason||'',reviewPoints:points});
 const p=n.plans.at(-1);
 p.courseRelations=relations.map(r=>({...r,status:'family_selected',conditionEvidenceSnapshots:r.sourceCourseIds.map(cid=>({courseId:cid,observation:clone(observationFor(s,s.courses.find(c=>c.id===cid)))}))}));
 p.plannedCourseSnapshots=clone(v.plannedCourses);p.courseIntents=Object.fromEntries(ids.map(cid=>[cid,courseIntent(s,s.courses.find(c=>c.id===cid))]));
 p.reviewRecordIds=s.records.map(r=>r.id);
 p.progression={kind:'per_course_relations',legacyKind:s.wizard.progression||null,state:'family_selected',automaticJoin:false,reviewPointIds:points.map(x=>x.id)};
 p.workloadSnapshot=chosenWorkload(s,ids);p.hwangsoInquiry=s.goals.hwangsoInquiry;p.versionContract=10;
 n.wizard.completed=true;n.wizard.step='plan';n.wizard.v10.pendingAcceptance=false;return n;
}
export function relationReview(s,r){
 const reasons=[];
 for(const x of r.scopeSnapshots){const c=s.courses.find(c=>c.id===x.courseId);if(!c||JSON.stringify(courseScope(c))!==JSON.stringify(x.scope))reasons.push('scope_change');if(c&&observationFor(s,c).burden==='high')reasons.push('reported_burden');}
 const p=s.plans.find(x=>x.id===s.activePlanId);
 for(const x of r.scopeSnapshots){const c=s.courses.find(c=>c.id===x.courseId),previous=r.conditionEvidenceSnapshots?.find(e=>e.courseId===x.courseId)?.observation;if(c&&previous&&observationFor(s,c).at!==previous.at)reasons.push('observation_added');}
 if(p&&s.records.some(e=>e.kind==='diagnostic'&&r.sourceCourseIds.includes(e.courseId)&&!(p.reviewRecordIds||[]).includes(e.id)))reasons.push('diagnosis_added');
 if(p&&JSON.stringify(p.goalsSnapshot)!==JSON.stringify(s.goals))reasons.push('goal_change');
 if(p&&JSON.stringify(p.supportSnapshot)!==JSON.stringify(s.support))reasons.push('schedule_change');
 return {needsReview:reasons.length>0,reasons:[...new Set(reasons)],automaticJoin:false};
}
export function relatedBranches(s,catalog,contract){
 const ids=new Set(activeModules(s,contract).branchIds);
 if(s.goals.gifted&&/과학/.test(s.goals.giftedField||''))for(let n=57;n<=64;n++)ids.add(`B${n}`);
 if(!s.wizard.interests.includes('hwangso')||s.goals.hwangso==='none')for(let n=29;n<=35;n++)ids.delete(`B${n}`);
 return catalog.branches.filter(b=>ids.has(b.id));
}
export function unansweredBranch(s,branch){
 return branch.question_ids.filter(qid=>!getAnswer(s,qid));
}
export function branchTarget(s,b){
 const n=Number(b.id.slice(1));
 const track=n>=14&&n<=18?'thinking':n>=19&&n<=22?'arithmetic':n>=57&&n<=64?'science':n===99?'other':'application';
 return s.courses.find(c=>trackOf(c)===track)?.id||s.courses[0]?.id||'';
}
export function branchQuestions(s,branch,courseId=''){
 const c=s.courses.find(c=>c.id===courseId),o=c?observationFor(s,c):null;
 return branch.question_ids.filter(qid=>{
  const a=getAnswer(s,qid,courseId);
  if(a&&(!a.scopeSnapshot||c&&JSON.stringify(a.scopeSnapshot)===JSON.stringify(courseScope(c))))return false;
  if(qid==='Q01')return s.profile.reportedAge===null;
  if(qid==='Q02')return !s.profile.grade;
  if(qid==='Q10')return !s.courses.length;
  if(qid==='Q11'&&c)return !c.course;
  if(qid==='Q12'&&c)return !(c.volume||c.range);
  if(qid==='Q13'&&c)return c.completion==='unknown';
  if(['Q15','Q16','Q17'].includes(qid)&&o?.status==='parent_report')return false;
  if(qid==='Q43'&&s.goals.hwangsoInquiry==='answered')return false;
  return true;
 });
}
export function validateRelations(s){
 const errors=[],actual=new Set(s.courses.map(c=>c.id));
 const check=(relations,planned,label,validActual)=>{
  if(!Array.isArray(relations)||!Array.isArray(planned)){errors.push(`${label}: 관계·예정 과정 형식 확인`);return;}
  const targetIds=new Set(),relationIds=new Set();
  for(const p of planned){if(!p||typeof p.id!=='string'||targetIds.has(p.id)||actual.has(p.id)||typeof p.name!=='string'||typeof p.scope!=='string'||!['application','depth','thinking','arithmetic','science','other'].includes(p.track)||p.state!=='planned')errors.push(`${label}: 예정 과정은 실제 기록과 별도여야 합니다.`);else targetIds.add(p.id);}
  for(const r of relations){
   if(!r||!RELATIONS[r.kind]||r.automaticJoin!==false||typeof r.id!=='string'||relationIds.has(r.id)){errors.push(`${label}: 관계 값·자동 합류 금지 확인`);continue;}relationIds.add(r.id);
   if(!Array.isArray(r.sourceCourseIds)||r.sourceCourseIds.some(x=>!validActual.has(x))||!Array.isArray(r.targetPlannedCourseIds)||r.targetPlannedCourseIds.some(x=>!targetIds.has(x)))errors.push(`${label}: 연결 과정 확인`);
   if(!TRIGGERS[r.reviewTrigger]||typeof r.condition!=='string'||!Array.isArray(r.scopeSnapshots))errors.push(`${label}: 범위·재확인 조건 확인`);
  }
 };
 if(s.wizard?.v10){const v=s.wizard.v10;if(!v||typeof v!=='object'||Array.isArray(v))return ['진행 관계 초안 형식 확인'];check(v.relations,v.plannedCourses,'초안',actual);if(!v.intents||Object.entries(v.intents).some(([k,v])=>!actual.has(k)||!INTENTS[v]))errors.push('과정별 진행 선택 확인');}
 for(const p of s.plans)if(p.courseRelations)check(p.courseRelations,p.plannedCourseSnapshots||[],'기준 계획',new Set([...actual,...p.courseIds]));
 return errors;
}
