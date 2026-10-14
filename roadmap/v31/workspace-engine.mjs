// Monthly records are an extension of the existing questionnaire, not a replacement.
// Dates, scope correspondence and reference periods are never inferred from age or progress.
import {academyContext} from './academy-reference.mjs';
import {synchronizeComparison,assertPreviewComparison} from './comparison-guard.mjs';
const clone = value => structuredClone(value);
const uid = prefix => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
const at = () => new Date().toISOString();
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) ? value : [];
const unique = values => [...new Set(values)];
const unknownDate = () => ({precision:'unknown',value:''});
const fail = (code,message,details=[]) => Object.assign(new Error(message),{code,details});
export const AXES = Object.freeze([
  {id:'curriculum',label:'수학 교과'},{id:'thinking',label:'수학 사고력'},{id:'arithmetic',label:'수학 연산'},
  {id:'science',label:'과학'},{id:'gifted',label:'영재원'},{id:'other',label:'타 과목·비교과'},{id:'competition',label:'대회'},
]);
export const GIFTED_CARDS = Object.freeze([
  {id:'wish_decision',label:'희망과 결정'},{id:'current_learning',label:'현재 학습 점검'},
  {id:'format_practice',label:'유형 익힘'},{id:'independent_answers',label:'독립 답안 확인'},
  {id:'needed_practice',label:'필요한 연습'},{id:'application_schedule',label:'접수와 공식 일정'},
  {id:'post_application',label:'지원 후 수업'},
]);
const DOMAINS=['plan','actual','official','reference','mapping','condition','goal','assessment'];
const LEARNING_STATES=['planned','in_progress','paused','completed'];
const ACTION_STATES=['considering','planned','confirmed','completed'];
const INTENTS=['wish','undecided','hold','none'];
function stable(value){
  if(Array.isArray(value))return `[${value.map(stable).join(',')}]`;
  if(object(value))return `{${Object.keys(value).sort().filter(k=>value[k]!==undefined).map(k=>`${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
  return JSON.stringify(value)??'null';
}
function digest(value){
  const text=stable(value);let a=2166136261,b=2246822519;
  for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b^text.charCodeAt(i),3266489917);}
  return `${(a>>>0).toString(16).padStart(8,'0')}${(b>>>0).toString(16).padStart(8,'0')}`;
}
function validCalendar(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const [y,m,d]=value.split('-').map(Number),dt=new Date(0);dt.setUTCFullYear(y,m-1,d);dt.setUTCHours(0,0,0,0);
  return y>=1&&dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;
}
export function normalizeWorkspaceDate(input){
  if(input===undefined||input===null||input==='')return unknownDate();
  if(typeof input==='string')input={precision:/^\d{4}-\d{2}-\d{2}$/.test(input)?'date':/^\d{4}-\d{2}$/.test(input)?'month':/^\d{4}$/.test(input)?'year':'unknown',value:input};
  if(!object(input)||!['date','month','year','unknown'].includes(input.precision))throw fail('INVALID_DATE','날짜 정밀도를 확인해 주세요.');
  const precision=input.precision,value=String(input.value||'');
  if(precision==='unknown'){if(value)throw fail('INVALID_DATE','모르는 날짜에 임의 값을 넣을 수 없습니다.');return unknownDate();}
  if(precision==='date'&&!validCalendar(value)||precision==='month'&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)||precision==='year'&&!/^[1-9]\d{3}$/.test(value))throw fail('INVALID_DATE','입력한 날짜 형식을 확인해 주세요.');
  return {precision,value};
}
export function dateMonth(input){const value=normalizeWorkspaceDate(input);return ['month','date'].includes(value.precision)?value.value.slice(0,7):null;}
function monthNumber(value){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(value)))return null;const [y,m]=value.split('-').map(Number);return y*12+m-1;}
function monthText(value){return `${Math.floor(value/12)}-${String(value%12+1).padStart(2,'0')}`;}
function addMonths(value,delta){const n=monthNumber(value);return n===null||!Number.isInteger(delta)?null:monthText(n+delta);}
function dateBounds(value){
  const d=normalizeWorkspaceDate(value);if(d.precision==='unknown')return null;
  if(d.precision==='date')return [d.value,d.value];
  if(d.precision==='year')return [`${d.value}-01-01`,`${d.value}-12-31`];
  const [y,m]=d.value.split('-').map(Number),dt=new Date(0);dt.setUTCFullYear(y,m,0);
  return [`${d.value}-01`,`${d.value}-${String(dt.getUTCDate()).padStart(2,'0')}`];
}
function normalizePeriod(period={}){return {...clone(period),start:normalizeWorkspaceDate(period.start),end:normalizeWorkspaceDate(period.end),confirmed:period.confirmed===true};}
function periodErrors(period){
  const errors=[];try{const p=normalizePeriod(period),a=dateBounds(p.start),b=dateBounds(p.end);if(a&&b&&a[0]>b[1])errors.push('시작이 종료보다 늦습니다.');}catch(e){errors.push(e.message);}return errors;
}
function freshWorkspace(){return {schemaVersion:1,revisions:Object.fromEntries(DOMAINS.map(k=>[k,0])),drafts:[],learningItems:[],activityItems:[],officialItems:[],referenceSources:[],referenceHistory:[],scopeMappings:[],conditions:[],goals:[],assessments:[],relations:[],links:[],actualRecords:[],planVersions:[],currentPlanId:null,previews:[],candidates:[],applications:[],reports:[],view:{month:'',mode:'table'}};}
export function ensureWorkspace(input){
  const s=clone(input),defaults=freshWorkspace();
  if(s.workspace===undefined)s.workspace=defaults;
  if(!object(s.workspace))throw fail('INVALID_WORKSPACE','월별 기록 형식을 확인해 주세요.');
  for(const [key,value] of Object.entries(defaults))if(s.workspace[key]===undefined)s.workspace[key]=clone(value);
  for(const domain of DOMAINS)s.workspace.revisions[domain]??=0;
  return synchronizeComparison(s);
}
function bump(w,domain){w.revisions[domain]++;}
function legacyItems(s){return list(s.courses).map(c=>({
  id:`legacy:${c.id}`,legacyCourseId:c.id,legacy:true,kind:'learning',axis:c.axis,subtrack:c.intakeTrack||'',title:c.course||c.subject||'학습 기록',bookName:c.course||'',volume:c.volume||'',edition:c.edition||'',scope:c.range||c.unit||c.volume||'',level:c.volume||'',
  status:c.status==='paused'?'paused':['reported_done','reviewed_done'].includes(c.completion)?'completed':c.completion==='not_started'?'planned':c.completion==='in_progress'?'in_progress':'unknown',
  statusSource:'existing_user_record',legacyCompletion:c.completion,completionScope:'',plan:normalizePeriod(),source:{role:c.sourceRole||'legacy_user_record',legacyCourseId:c.id},operationalStatus:'active',
}));}
function learningItems(s){const own=list(s.workspace.learningItems),ids=new Set(own.map(x=>x.id));return [...own,...legacyItems(s).filter(x=>!ids.has(x.id))];}
function allItems(s){return [...learningItems(s),...s.workspace.activityItems,...s.workspace.officialItems];}
function resolveItem(s,id){return allItems(s).find(x=>x.id===id);}
function setItem(array,item){const i=array.findIndex(x=>x.id===item.id);if(i>=0)array[i]=clone(item);else array.push(clone(item));}
export function workspaceBasis(input){
  const s=ensureWorkspace(input),w=s.workspace;
  const payloads={plan:[w.learningItems,w.activityItems,w.relations,w.links,w.currentPlanId,w.planVersions.at(-1),s.activePlanId,s.plans,s.profile,s.support,s.academy,s.courses],actual:[w.actualRecords,s.records],official:w.officialItems,reference:[w.referenceSources,w.referenceHistory],mapping:w.scopeMappings,condition:w.conditions,goal:[w.goals,s.goals,s.wizard?.quick?.target,s.wizard?.quick?.learningDirection],assessment:w.assessments};
  const domains=Object.fromEntries(DOMAINS.map(k=>[k,{revision:w.revisions[k],fingerprint:digest(payloads[k])}]));
  return {id:`basis-${digest(domains)}`,domains};
}
export function saveWorkspaceDraft(input,draft){
  const s=ensureWorkspace(input);if(!object(draft))throw fail('INVALID_DRAFT','작성 중인 내용을 확인해 주세요.');
  const saved={...clone(draft),id:draft.id||uid('draft'),savedAt:at(),basis:workspaceBasis(s)};setItem(s.workspace.drafts,saved);return {state:s,draft:clone(saved)};
}
export function workspaceIdentity(a={},b={}){
  const fields=['bookName','volume','edition','scope'];const differences=fields.filter(k=>a[k]&&b[k]&&a[k]!==b[k]);
  const unknown=fields.filter(k=>!a[k]||!b[k]);
  return {state:differences.length?'different':unknown.length?'unknown':'same',differences,unknown};
}
function learningErrors(item){
  const errors=[];if(!AXES.some(a=>a.id===item.axis))errors.push('학습 영역을 선택해 주세요.');
  if(!LEARNING_STATES.includes(item.status))errors.push('학습 상태를 선택해 주세요.');
  if(item.status==='completed'&&!String(item.completionScope||'').trim())errors.push('완료한 범위 확인이 필요합니다. 작성 중 내용으로 보관할 수 있습니다.');
  if(item.cardType&&!GIFTED_CARDS.some(c=>c.id===item.cardType))errors.push('영재원 카드 종류를 확인해 주세요.');
  errors.push(...periodErrors(item.plan));return errors;
}
function eventErrors(item){
  const errors=[];if(!AXES.some(a=>a.id===item.axis)||!String(item.title||'').trim())errors.push('활동의 영역과 이름을 확인해 주세요.');
  if(!ACTION_STATES.includes(item.actionStatus)||!INTENTS.includes(item.intent))errors.push('행동 상태와 의향을 따로 선택해 주세요.');
  if(item.cardType&&!GIFTED_CARDS.some(c=>c.id===item.cardType))errors.push('영재원 카드 종류를 확인해 주세요.');
  errors.push(...periodErrors(item.plan));return errors;
}
function officialConfirmed(proof){
  const fields=['institution','program','recruitmentYear','calendarYear','stage','url','checkedAt','sourceCopyId'];
  const checks=['institution','program','recruitmentYear','calendarYear','stage','date'];
  let p;try{p=normalizePeriod(proof.period);}catch{return false;}
  return proof.verified===true&&fields.every(k=>String(proof[k]||'').trim())&&checks.every(k=>proof.verification?.[k]===true)&&/^https:\/\//.test(proof.url)&&!!dateMonth(p.start)&&String(proof.calendarYear)===p.start.value.slice(0,4)&&periodErrors(p).length===0;
}
function conditionsFor(s,item){return list(item.requiredConditionIds).map(id=>s.workspace.conditions.find(x=>x.id===id)||{id,state:'unknown'});}
function applyOperation(s,op){
  const w=s.workspace;if(!object(op)||!op.type)throw fail('INVALID_OPERATION','변경 종류를 확인해 주세요.');
  switch(op.type){
    case 'learning.upsert':{
      const item={...clone(op.item),id:op.item?.id||uid('learning'),kind:'learning',operationalStatus:op.item?.operationalStatus||'active',plan:normalizePeriod(op.item?.plan)};
      const existing=resolveItem(s,item.id);if(existing?.kind==='official')throw fail('OFFICIAL_LOCK','공식 일정은 일반 편집으로 옮길 수 없습니다.');
      const errors=learningErrors(item);if(errors.length)throw fail('INVALID_LEARNING',errors.join('\n'),errors);
      if(conditionsFor(s,item).some(c=>c.state!=='met'||c.sourceStatus==='unverified_original'||c.appliesToMonth&&c.appliesToMonth!==dateMonth(item.plan.start))&&dateMonth(item.plan.start))throw fail('CONDITION_UNCONFIRMED','진입 조건 확인이 남아 있습니다. 희망월은 검토 메모로 보관해 주세요.');
      setItem(w.learningItems,item);bump(w,'plan');break;
    }
    case 'event.upsert':{
      const item={...clone(op.item),id:op.item?.id||uid('event'),kind:'event',operationalStatus:op.item?.operationalStatus||'active',plan:normalizePeriod(op.item?.plan),intent:op.item?.intent||'undecided'};
      const errors=eventErrors(item);if(errors.length)throw fail('INVALID_EVENT',errors.join('\n'),errors);
      if(resolveItem(s,item.id)?.kind==='official')throw fail('OFFICIAL_LOCK','공식 일정은 별도로 정정해야 합니다.');
      setItem(w.activityItems,item);bump(w,'plan');break;
    }
    case 'actual.append': appendActualInPlace(s,op.record);break;
    case 'item.cancel':{
      const item=resolveItem(s,op.itemId);if(!item)throw fail('NOT_FOUND','취소할 항목이 없습니다.');
      if(item.kind==='official')throw fail('OFFICIAL_LOCK','공식 일정은 개인 취소로 변경하지 않습니다.');
      const amended={...clone(item),operationalStatus:'cancelled',cancelReason:String(op.reason||''),cancelledAt:at()};setItem(item.kind==='event'?w.activityItems:w.learningItems,amended);bump(w,'plan');break;
    }
    case 'relation.upsert':{
      const r={...clone(op.relation),id:op.relation?.id||uid('relation')};
      if(!['display','sequence','schedule','entry'].includes(r.kind)||!resolveItem(s,r.fromId)||!resolveItem(s,r.toId)||r.fromId===r.toId)throw fail('INVALID_RELATION','관계 종류와 연결 항목을 확인해 주세요.');
      if(r.kind==='schedule'&&(!Number.isInteger(r.gapMonths)||!r.evidence))throw fail('MISSING_RELATION_EVIDENCE','일정 관계에는 확인된 월 간격과 근거가 필요합니다.');
      setItem(w.relations,r);bump(w,'plan');break;
    }
    case 'relation.detach':w.relations=w.relations.filter(r=>r.id!==op.relationId);bump(w,'plan');break;
    case 'link.upsert':{
      const link={...clone(op.link),id:op.link?.id||uid('link')};if(!resolveItem(s,link.itemId))throw fail('NOT_FOUND','연결할 원본 학습·활동을 확인해 주세요.');setItem(w.links,link);bump(w,'plan');break;
    }
    case 'link.detach':w.links=w.links.filter(l=>l.id!==op.linkId);bump(w,'plan');break;
    case 'condition.upsert':{
      const c={...clone(op.condition),id:op.condition?.id||uid('condition')};if(!['met','unknown','needs_check'].includes(c.state))throw fail('INVALID_CONDITION','조건 확인 상태를 확인해 주세요.');
      if(c.state!=='unknown'&&!c.evidence)throw fail('MISSING_CONDITION_EVIDENCE','조건 판단 근거가 필요합니다.');setItem(w.conditions,c);bump(w,'condition');break;
    }
    case 'goal.upsert':{const goal={...clone(op.goal),id:op.goal?.id||uid('goal')};setItem(w.goals,goal);bump(w,'goal');break;}
    case 'assessment.upsert':{const assessment={...clone(op.assessment),id:op.assessment?.id||uid('assessment')};setItem(w.assessments,assessment);bump(w,'assessment');break;}
    case 'mapping.upsert':{const mapping={...clone(op.mapping),id:op.mapping?.id||uid('mapping')};setItem(w.scopeMappings,mapping);bump(w,'mapping');break;}
    case 'official.upsert':{
      const proof={...clone(op.proof),id:op.proof?.id||uid('official'),kind:'official',axis:op.proof?.axis||'gifted'};
      if(w.officialItems.some(x=>x.id===proof.id))throw fail('OFFICIAL_LOCK','기존 공식 근거는 정정 공고 대조로만 변경합니다.');
      proof.period=normalizePeriod(proof.period);proof.confirmed=officialConfirmed(proof);proof.title||=`${proof.institution||'기관 미정'} ${proof.stage||'공식 일정 확인'}`;proof.locked=proof.confirmed;
      setItem(w.officialItems,proof);bump(w,'official');break;
    }
    case 'official.correct':{
      const previous=w.officialItems.find(x=>x.id===op.correctsProofId);if(!previous||!String(op.reason||'').trim())throw fail('INVALID_OFFICIAL_CORRECTION','정정 대상과 이유를 확인해 주세요.');
      const proof={...clone(op.proof),id:op.proof?.id||uid('official'),kind:'official',axis:op.proof?.axis||previous.axis,period:normalizePeriod(op.proof?.period),correctsProofId:previous.id,reason:op.reason};
      if(proof.id===previous.id||w.officialItems.some(x=>x.id===proof.id))throw fail('ID_REUSE','공식 정정은 새 근거 ID로 남깁니다.');
      if(['institution','program','recruitmentYear','calendarYear','stage'].some(k=>String(proof[k])!==String(previous[k]))||!officialConfirmed(proof))throw fail('INVALID_OFFICIAL_CORRECTION','같은 기관·과정·연도·단계의 공식 정정 근거를 확인해 주세요.');
      proof.confirmed=true;proof.locked=true;w.officialItems.push(proof);bump(w,'official');break;
    }
    default:throw fail('INVALID_OPERATION','지원하지 않는 변경 종류입니다.');
  }
}
function appendActualInPlace(s,raw){
  if(!object(raw))throw fail('INVALID_RECORD','실제 기록을 확인해 주세요.');
  const w=s.workspace,item=resolveItem(s,raw.learningId||raw.itemId);if(!item||item.kind==='official')throw fail('NOT_FOUND','기록할 학습·행동을 선택해 주세요.');
  const record={...clone(raw),id:raw.id||uid('actual'),learningId:item.kind==='learning'?item.id:undefined,itemId:item.id,occurred:normalizeWorkspaceDate(raw.occurred),recordedAt:at()};
  if(w.actualRecords.some(r=>r.id===record.id))throw fail('ID_REUSE','이미 기록한 실제 기록 ID입니다.');
  if(!['start','pause','resume','complete','progress','correction','action'].includes(record.kind))throw fail('INVALID_RECORD','실제 기록 종류를 확인해 주세요.');
  if(item.kind==='learning'&&record.kind==='complete'&&!String(record.scope||item.scope||'').trim())throw fail('MISSING_SCOPE','완료한 실제 범위를 확인해 주세요.');
  if(record.kind==='correction'){
    const original=w.actualRecords.find(r=>r.id===record.correctsRecordId);if(!original||original.itemId!==item.id||!String(record.reason||'').trim())throw fail('INVALID_CORRECTION','같은 항목의 원기록과 정정 이유를 확인해 주세요.');
    if(!object(record.replacement))throw fail('INVALID_CORRECTION','정정할 내용을 별도로 기록해 주세요.');
    if(record.replacement.occurred!==undefined)record.replacement.occurred=normalizeWorkspaceDate(record.replacement.occurred);
  }
  if(item.kind==='learning'&&['start','resume'].includes(record.kind)&&item.status==='completed')throw fail('REDO_REQUIRED','완료 범위를 다시 공부하려면 새 재학습 항목을 만드세요.');
  w.actualRecords.push(record);bump(w,'actual');
  // Rebuild the current state from all preserved actual records, not from a plan date.
  if(item.kind==='learning'&&record.kind!=='progress'){
    const own={...clone(item),status:item.initialStatus||item.status},effective=effectiveRecords(w,item.id);
    own.initialStatus=item.initialStatus||item.status;
    for(const r of effective){if(r.kind==='start'||r.kind==='resume')own.status='in_progress';else if(r.kind==='pause')own.status='paused';else if(r.kind==='complete'){own.status='completed';own.completionScope=r.scope||own.scope;}}
    setItem(w.learningItems,own);
  }else if(item.kind==='event'&&(record.kind==='complete'||record.kind==='action'&&record.actionStatus==='completed')){
    setItem(w.activityItems,{...clone(item),actionStatus:'completed'});
  }
}
export function appendWorkspaceActual(input,record){const s=ensureWorkspace(input);appendActualInPlace(s,record);const check=validateWorkspaceState(s);if(!check.valid)throw fail('INVALID_RECORD',check.errors.join('\n'),check.errors);return {state:s,record:clone(s.workspace.actualRecords.at(-1))};}
function effectiveRecords(w,itemId){
  const originals=w.actualRecords.filter(r=>r.itemId===itemId&&r.kind!=='correction'),corrections=w.actualRecords.filter(r=>r.itemId===itemId&&r.kind==='correction');
  return originals.map(r=>{const correction=corrections.filter(c=>c.correctsRecordId===r.id).at(-1);return correction?{...r,...clone(correction.replacement),id:r.id,correctedBy:correction.id}:r;});
}
function actualSegments(s,item){
  const records=effectiveRecords(s.workspace,item.id),segments=[];let open=null;
  for(const r of records){
    if(r.kind==='start'||r.kind==='resume'){if(open)segments.push(open);open={start:r.occurred,end:unknownDate(),recordIds:[r.id]};}
    else if(r.kind==='pause'||r.kind==='complete'){if(open){open.end=r.occurred;open.recordIds.push(r.id);segments.push(open);open=null;}else segments.push({start:unknownDate(),end:r.occurred,recordIds:[r.id]});}
    else if(r.kind==='action')segments.push({start:r.occurred,end:r.occurred,recordIds:[r.id]});
  }
  if(open)segments.push(open);return clone(segments);
}
function relationErrors(s){
  const errors=[],relations=s.workspace.relations,visiting=new Set(),visited=new Set();
  function visit(id){if(visiting.has(id)){errors.push('일정·순서 관계가 순환합니다.');return;}if(visited.has(id))return;visiting.add(id);for(const r of relations.filter(r=>r.fromId===id&&['sequence','schedule'].includes(r.kind)))visit(r.toId);visiting.delete(id);visited.add(id);}
  for(const r of relations)visit(r.fromId);
  for(const r of relations.filter(r=>r.required&&r.kind==='schedule')){
    const from=resolveItem(s,r.fromId),to=resolveItem(s,r.toId);if(!from||!to)continue;
    const end=from.kind==='official'?from.period?.end:from.plan?.end,start=to.kind==='official'?to.period?.start:to.plan?.start;
    const a=dateBounds(end),b=dateBounds(start);if(a&&b&&a[0]>b[1])errors.push(`${from.title}와 ${to.title}의 필수 선후 관계를 위반합니다.`);
    const am=dateMonth(end),bm=dateMonth(start);if(am&&bm&&r.gapMonths>0&&monthNumber(bm)-monthNumber(am)<r.gapMonths)errors.push(`${to.title}: 명시된 월 간격을 확인해 주세요.`);
  }
  return unique(errors);
}
function normalizeOperation(op){const next=clone(op);next.id||=uid('operation');if(['learning.upsert','event.upsert'].includes(next.type)&&object(next.item))next.item.id||=uid(next.type.split('.')[0]);if(next.type==='actual.append'&&object(next.record))next.record.id||=uid('actual');if(next.type==='official.upsert'&&object(next.proof))next.proof.id||=uid('official');return next;}
function dependencySuggestions(s,direct){
  const suggestions=[];
  for(const op of direct.filter(x=>x.type==='learning.upsert'||x.type==='event.upsert')){
    const before=resolveItem(s,op.item.id),oldEnd=dateMonth(before?.plan?.end),newEnd=dateMonth(op.item.plan?.end);if(!oldEnd||!newEnd||oldEnd===newEnd)continue;
    for(const r of s.workspace.relations.filter(x=>x.fromId===op.item.id&&x.kind==='schedule'&&Number.isInteger(x.gapMonths)&&x.evidence)){
      const target=resolveItem(s,r.toId);if(!target||target.kind==='official'||direct.some(d=>d.item?.id===target.id))continue;
      const ts=dateMonth(target.plan?.start),te=dateMonth(target.plan?.end);if(!ts||!te)continue;
      const delta=monthNumber(newEnd)-monthNumber(oldEnd),amended=clone(target);amended.plan={...amended.plan,start:{precision:'month',value:addMonths(ts,delta)},end:{precision:'month',value:addMonths(te,delta)}};
      suggestions.push({id:uid('dependent'),type:target.kind==='event'?'event.upsert':'learning.upsert',item:amended,dependent:true,relationId:r.id,evidence:clone(r.evidence)});
    }
  }
  return suggestions;
}
function operationDiff(s,op){
  if(op.type==='link.upsert'||op.type==='link.detach'){
    const old=s.workspace.links.find(link=>link.id===(op.link?.id||op.linkId)),link=op.link||old,item=link?resolveItem(s,link.itemId):null;
    const card=GIFTED_CARDS.find(card=>card.id===link?.cardType),title=link?.title||[item?.title,card?.label].filter(Boolean).join(' · ')||'학습 기록 연결';
    const decorate=value=>value?{...clone(value),title:value.title||title,originalItemId:item?.id||value.itemId,originalTitle:item?.title||'',cardLabel:card?.label||'',note:value.note||''}:null;
    const after=op.type==='link.detach'?{...decorate(old),title:`${title} · 연결 해제`,detached:true,note:'연결만 해제하며 원본 학습과 실제 기록은 보존합니다.'}:decorate(op.link);
    return {operationId:op.id,type:op.type,itemId:item?.id||link?.itemId||null,before:decorate(old),after,dependent:false,evidence:clone(op.link?.source||item?.source||null)};
  }
  const id=op.item?.id||op.itemId||op.record?.itemId||op.record?.learningId||op.proof?.id;return {operationId:op.id,type:op.type,itemId:id||null,before:id?clone(resolveItem(s,id)||null):null,after:clone(op.item||op.record||op.proof||op.relation||op.condition||null),dependent:!!op.dependent,evidence:clone(op.evidence||op.item?.source||null)};
}
export function prepareWorkspaceChange(input,{operations=[],selectedOperationIds}={}){
  const s=ensureWorkspace(input),direct=list(operations).map(normalizeOperation),dependent=dependencySuggestions(s,direct),all=[...direct,...dependent],selected=selectedOperationIds||direct.map(o=>o.id),scratch=clone(s),blocking=[];
  if(!all.length)blocking.push({code:'EMPTY_CHANGE',message:'적용할 항목이 없습니다.'});
  if(unique(all.map(o=>o.id)).length!==all.length)blocking.push({code:'ID_REUSE',message:'변경 ID가 중복됩니다.'});
  for(const op of all.filter(o=>selected.includes(o.id)))try{applyOperation(scratch,op);}catch(e){blocking.push({operationId:op.id,code:e.code||'INVALID_OPERATION',message:e.message});}
  blocking.push(...relationErrors(scratch).map(message=>({code:'RELATION_CONFLICT',message})));
  const changedIds=new Set(all.map(o=>o.item?.id||o.itemId));
  const preview={id:uid('preview'),createdAt:at(),basis:workspaceBasis(s),operations:all,selectedOperationIds:clone(selected),direct:direct.map(o=>operationDiff(s,o)),dependent:dependent.map(o=>operationDiff(s,o)),unchanged:allItems(s).filter(i=>!changedIds.has(i.id)).map(i=>({itemId:i.id,title:i.title,axis:i.axis})),blocking,status:'review'};
  s.workspace.previews.push(preview);return {state:s,preview:clone(preview)};
}
export function applyWorkspaceChange(input,previewId,{requestId,operationIds}={}){
  const s=ensureWorkspace(input),w=s.workspace,p=w.previews.find(p=>p.id===previewId);if(!p)throw fail('NOT_FOUND','검토한 변경안을 찾을 수 없습니다.');
  if(!String(requestId||'').trim())throw fail('MISSING_REQUEST_ID','적용 요청 식별자가 필요합니다.');
  const selected=operationIds||p.selectedOperationIds,requestFingerprint=digest({previewId,selected:[...selected].sort()}),existing=w.applications.find(x=>x.requestId===requestId);
  if(existing){if(existing.requestFingerprint!==requestFingerprint)throw fail('ID_REUSE','같은 요청 ID로 다른 변경을 적용할 수 없습니다.');return {state:s,receipt:{...clone(existing),replayed:true}};}
  assertPreviewComparison(s,p);
  const basis=workspaceBasis(s);if(stable(basis)!==stable(p.basis))throw fail('STALE_PREVIEW','검토 이후 내용이 바뀌었습니다. 최신 내용과 다시 비교해 주세요.',DOMAINS.filter(k=>stable(basis.domains[k])!==stable(p.basis.domains[k])));
  if(!selected.length||selected.some(id=>!p.operations.some(o=>o.id===id)))throw fail('BLOCKED_CHANGE','적용 대상을 명시적으로 선택해 주세요.');
  const scratch=clone(s),errors=[];for(const op of p.operations.filter(o=>selected.includes(o.id)))try{applyOperation(scratch,op);}catch(e){errors.push({operationId:op.id,code:e.code,message:e.message});}
  errors.push(...relationErrors(scratch).map(message=>({code:'RELATION_CONFLICT',message})));
  if(errors.length)throw fail('BLOCKED_CHANGE',errors.map(e=>e.message).join('\n'),errors);
  const nw=scratch.workspace,previousId=nw.currentPlanId,version=Math.max(0,...nw.planVersions.map(p=>p.version))+1;
  const plan={id:uid('monthly-plan'),version,previousVersionId:previousId,appliedAt:at(),selectedOperationIds:clone(selected),learningItems:clone(nw.learningItems),activityItems:clone(nw.activityItems),relations:clone(nw.relations),links:clone(nw.links)};
  nw.planVersions.push(plan);nw.currentPlanId=plan.id;
  const receipt={requestId,requestFingerprint,previewId,operationIds:clone(selected),planId:plan.id,planVersion:version,appliedAt:plan.appliedAt,status:'applied'};
  nw.applications.push(receipt);nw.previews.find(p=>p.id===previewId).status='applied';
  const check=validateWorkspaceState(scratch);if(!check.valid)throw fail('BLOCKED_CHANGE',check.errors.join('\n'),check.errors);
  return {state:scratch,receipt:clone(receipt)};
}
export function saveWorkspaceReference(input,template){
  const s=ensureWorkspace(input);if(!object(template)||!template.id||!Array.isArray(template.steps))throw fail('INVALID_REFERENCE','참조 자료의 식별자와 단계 목록을 확인해 주세요.');
  const previous=s.workspace.referenceSources.find(t=>t.id===template.id);if(previous)s.workspace.referenceHistory.push(clone(previous));
  const saved={...clone(template),savedAt:at(),revision:(previous?.revision||0)+1};setItem(s.workspace.referenceSources,saved);bump(s.workspace,'reference');return {state:s,template:clone(saved)};
}
export function generateWorkspaceCandidate(input,{templateId,startMonth='',mappings=[],id}={}){
  const s=ensureWorkspace(input),template=s.workspace.referenceSources.find(t=>t.id===templateId);if(!template)throw fail('NOT_FOUND','참조 자료를 찾을 수 없습니다.');
  if(template.referenceComparison)assertPreviewComparison(s,{operations:[{item:{source:{referenceComparison:template.referenceComparison}}}]});
  if(template.comparisonModel)assertPreviewComparison(s,{operations:[{item:{source:{comparisonModel:template.comparisonModel}}}]});
  if(startMonth&&monthNumber(startMonth)===null)throw fail('INVALID_DATE','후보 시작 연월을 확인해 주세요.');
  for(const mapping of mappings){const saved={...clone(mapping),id:`${templateId}:${mapping.stepId}`,templateId};const previous=s.workspace.scopeMappings.find(m=>m.id===saved.id);if(stable(saved)!==stable(previous)){setItem(s.workspace.scopeMappings,saved);bump(s.workspace,'mapping');}}
  const candidate={id:id||uid('candidate'),createdAt:at(),basis:workspaceBasis(s),templateId,source:{copyId:template.copyId||'',version:template.version||'',hash:template.hash||'',sourceUrl:template.sourceUrl||'',sourcePosition:template.sourcePosition||''},items:[],operations:[],excluded:[],unknowns:[],status:'unapplied'};
  for(const step of template.steps){
    const map=mappings.find(m=>m.stepId===step.id),source={...candidate.source,stepId:step.id,sourcePosition:step.sourcePosition||template.sourcePosition||'',rawCell:clone(step.rawCell??null),originalRelative:clone(step.originalRelative||step.relative||null),...(template.comparisonModel?{comparisonModel:clone(template.comparisonModel),appliedRelative:clone(step.relative||null),stepSourceHash:step.sourceHash,stepSourcePath:step.sourcePath}:{}),...(template.referenceComparison?{referenceComparison:clone(template.referenceComparison)}:{}),role:template.role||'reference'};
    if(step.internalOnly||step.hidden&&!step.useConfirmed||step.scheduleEligible===false||['explanation','metadata','internal_evidence'].includes(step.role)){
      candidate.excluded.push({stepId:step.id,reason:step.internalOnly||step.role==='internal_evidence'?'내부 교재는 출처 증거로만 보존':step.hidden&&!step.useConfirmed?'숨김 표의 현재 사용 여부 미확인':'설명·메타데이터는 근거로 보존하며 학습 일정에 넣지 않음',source});continue;
    }
    const current=map?.learningId?resolveItem(s,map.learningId):null;
    const knownDifference=current?workspaceIdentity(current,step).state==='different':false;
    const identity=map?.identityConfirmed===true&&map.scopeConfirmed===true&&['confirmed','not_applicable'].includes(map.editionState)&&!knownDifference;
    if(identity&&map.status==='completed'){candidate.excluded.push({stepId:step.id,reason:'동일 범위 완료 확인',source,learningId:map.learningId||null});continue;}
    const sourceVerified=!!template.copyId&&!!template.hash&&!!source.sourcePosition&&step.relative?.quality==='verified'&&step.relative.unit==='month'&&Number.isInteger(step.relative.start)&&Number.isInteger(step.relative.end)&&step.relative.start>=0&&step.relative.end>=step.relative.start;
    let plan=normalizePeriod(),reason='범위·판본 대응 확인 필요';
    if(identity&&map.status==='not_started'&&current&&['in_progress','paused','completed'].includes(current.status))reason='기존 실제 상태와 미시작 대응이 달라 잔여 기간 확인이 필요합니다';
    else if(identity&&map.status==='not_started'&&sourceVerified&&startMonth){plan={start:{precision:'month',value:addMonths(startMonth,step.relative.start)},end:{precision:'month',value:addMonths(startMonth,step.relative.end)},confirmed:false};reason='';}
    else if(identity&&map.status==='partial'&&map.remainingPlan){plan=normalizePeriod(map.remainingPlan);reason=(!dateMonth(plan.start)&&!dateMonth(plan.end))?'잔여 기간 미정':'';}
    else if(identity)reason=map.status==='partial'?'부분 진행의 잔여 기간 미정':!sourceVerified?'상대 월 배치 근거 미확인':!startMonth?'후보 시작 기준 미정':'미시작 여부 미확인';
    const requiredConditionIds=list(step.conditions),conditions=requiredConditionIds.map(id=>s.workspace.conditions.find(c=>c.id===id)||{id,state:'unknown'});
    if(conditions.some(c=>c.state!=='met'||c.sourceStatus==='unverified_original'||c.appliesToMonth&&c.appliesToMonth!==dateMonth(plan.start))){reason='진입 조건 확인이 남아 있습니다';plan=normalizePeriod();}
    const item={...clone(current||{}),id:map?.learningId||uid('learning'),kind:'learning',axis:step.axis||'curriculum',subtrack:step.subtrack||current?.subtrack||'',title:step.title||step.bookName||'참조 과정',bookName:step.bookName||'',volume:step.volume||'',edition:step.edition||'',scope:identity&&map.status==='partial'?map.remainingScope||step.scope||'':step.scope||'',level:step.level||'',status:current?.status||(identity&&map.status==='partial'?'in_progress':'planned'),plan,requiredConditionIds,source,candidateId:candidate.id,relative:clone(step.relative||null),unresolved:reason?[reason]:[]};
    candidate.items.push(item);if(reason)candidate.unknowns.push({itemId:item.id,stepId:step.id,reason});
    if(identity)candidate.operations.push({id:uid('operation'),type:'learning.upsert',item});
  }
  s.workspace.candidates.push(candidate);return {state:s,candidate:clone(candidate)};
}
function rowFor(item,kind,period,index=0){
  const p=normalizePeriod(period),startMonth=dateMonth(p.start),endMonth=dateMonth(p.end);if(!startMonth&&!endMonth)return null;
  return {id:`${item.id}:${kind}:${index}`,itemId:item.id,axis:item.axis,subtrack:item.subtrack||'',title:item.title||item.bookName||'학습 기록',kind,startMonth,endMonth,openStart:!startMonth,openEnd:!endMonth,status:item.kind==='event'?item.actionStatus:(item.status||(item.confirmed?'confirmed':'unknown')),operationalStatus:item.operationalStatus||'active',dates:{start:p.start,end:p.end},cardType:item.cardType||'',level:item.level||'',source:clone(item.source||{}),legacy:!!item.legacy};
}
function rowInMonth(row,month){if(!month)return true;const n=monthNumber(month),a=monthNumber(row.startMonth),b=monthNumber(row.endMonth);if(a===null)return n===b;if(b===null)return n>=a;return n>=a&&n<=b;}
export function workspaceProjection(input,{month,fromMonth,toMonth}={}){
  const s=ensureWorkspace(input),w=s.workspace,basis=workspaceBasis(s),currentPlan=w.planVersions.find(p=>p.id===w.currentPlanId)||null;
  const snapshotId=`snapshot-${digest(basis)}`,items=allItems(s).map(item=>({...clone(item),itemId:item.id,actualSegments:item.kind==='official'?[]:actualSegments(s,item)}));
  const allRows=[],unknownItems=[];
  const superseded=new Set(w.officialItems.map(p=>p.correctsProofId).filter(Boolean));
  for(const item of items){
    if(item.kind==='official'){
      if(superseded.has(item.id))continue;
      const row=item.confirmed?rowFor(item,'official',item.period):null;if(row)allRows.push(row);else unknownItems.push({...clone(item),reason:'공식 일정 확인 필요'});continue;
    }
    const planRow=rowFor(item,'plan',item.plan);if(planRow)allRows.push(planRow);
    const actualRows=item.actualSegments.map((p,i)=>rowFor(item,'actual',p,i)).filter(Boolean);allRows.push(...actualRows);
    const undatedRecords=effectiveRecords(w,item.id).filter(r=>!dateMonth(r.occurred));
    if(!planRow&&!actualRows.length||undatedRecords.length)unknownItems.push({...clone(item),reason:undatedRecords.length?'실제 기록의 월 미정':'시점 미정',undatedRecordIds:undatedRecords.map(r=>r.id)});
  }
  const selectedMonth=month??w.view.month??'',monthlyRows=allRows.filter(r=>rowInMonth(r,selectedMonth));
  const axes=AXES.map(axis=>({...axis,items:items.filter(i=>i.axis===axis.id),rows:monthlyRows.filter(r=>r.axis===axis.id),levels:unique(items.filter(i=>i.axis===axis.id).map(i=>i.level||'레벨 미분류')).map(label=>({label,orderKnown:false,rows:monthlyRows.filter(r=>r.axis===axis.id&&(r.level||'레벨 미분류')===label)}))}));
  const knownMonths=allRows.flatMap(r=>[r.startMonth,r.endMonth]).filter(Boolean).sort(),start=fromMonth||knownMonths[0]||selectedMonth,end=toMonth||knownMonths.at(-1)||selectedMonth,months=[];
  const a=monthNumber(start),b=monthNumber(end);if(a!==null&&b!==null&&b>=a)for(let n=a;n<=b&&n<a+240;n++)months.push(monthText(n));
  return {academy:academyContext(s),snapshotId,snapshot:{id:snapshotId,basis,planVersion:currentPlan?.version||0},basis,currentPlan:clone(currentPlan),month:selectedMonth,months,items,allRows,monthlyRows,unknownItems,actualRecords:clone(w.actualRecords),axes,events:items.filter(i=>i.kind==='event'),counts:{items:items.length,rows:allRows.length,unknown:unknownItems.length,selectedMonth:monthlyRows.length},links:clone(w.links),limitations:['월별 구간은 입력·출처에 근거한 계획 또는 실제 기록입니다. 능력이나 합격 가능성을 계산하지 않습니다.','기존 설문과 원표 비교는 유지됩니다. 시점 미정은 오늘로 채우지 않습니다.']};
}
export function issueWorkspaceReport(input,{title='우리 아이 월별 기록',previousReportId}={}){
  const s=ensureWorkspace(input);if(previousReportId&&!s.workspace.reports.some(r=>r.id===previousReportId))throw fail('NOT_FOUND','이전 발행 보고서를 확인해 주세요.');
  const snapshot=workspaceProjection(s),report={id:uid('report'),version:Math.max(0,...s.workspace.reports.map(r=>r.version))+1,title,issuedAt:at(),previousReportId:previousReportId||null,snapshot:clone(snapshot),basis:clone(snapshot.basis),referenceCopies:clone(s.workspace.referenceSources),officialCopies:clone(s.workspace.officialItems)};
  report.contentFingerprint=digest(report);s.workspace.reports.push(report);return {state:s,report:clone(report)};
}
export function validateWorkspaceState(input){
  if(input.workspace===undefined)return {valid:true,errors:[]};const errors=[],w=input.workspace;
  if(!object(w))return {valid:false,errors:['월별 기록은 객체여야 합니다.']};
  for(const k of Object.keys(freshWorkspace()))if(Array.isArray(freshWorkspace()[k])&&!Array.isArray(w[k]))errors.push(`${k}: 목록 형식을 확인해 주세요.`);
  for(const domain of DOMAINS)if(!Number.isInteger(w.revisions?.[domain])||w.revisions[domain]<0)errors.push(`${domain}: 근거 리비전을 확인해 주세요.`);
  if(errors.length)return {valid:false,errors};
  for(const key of ['learningItems','activityItems','officialItems','actualRecords','previews','candidates','reports','applications','planVersions']){
    const ids=w[key].map(x=>key==='applications'?x.requestId:x.id);if(ids.some(id=>typeof id!=='string'||!id)||unique(ids).length!==ids.length)errors.push(`${key}: 중복 또는 누락된 식별자가 있습니다.`);
  }
  for(const item of w.learningItems)errors.push(...learningErrors(item).map(e=>`${item.id}: ${e}`));
  for(const item of w.activityItems)errors.push(...eventErrors(item).map(e=>`${item.id}: ${e}`));
  for(const p of w.officialItems){errors.push(...periodErrors(p.period));if(p.confirmed&&!officialConfirmed(p))errors.push(`${p.id}: 공식 확인 근거가 맞지 않습니다.`);}
  for(const r of w.actualRecords){try{normalizeWorkspaceDate(r.occurred);}catch(e){errors.push(`${r.id}: ${e.message}`);}if(!resolveItem(input,r.itemId))errors.push(`${r.id}: 원본 항목이 없습니다.`);if(r.kind==='correction'&&(!w.actualRecords.some(x=>x.id===r.correctsRecordId)||!r.reason))errors.push(`${r.id}: 정정 원기록과 이유가 필요합니다.`);}
  for(const item of [...learningItems(input),...w.activityItems])for(const segment of actualSegments(input,item))errors.push(...periodErrors(segment).map(e=>`${item.id}: 실제 구간 ${e}`));
  if(w.currentPlanId&&!w.planVersions.some(p=>p.id===w.currentPlanId))errors.push('현재 월별 계획 버전을 찾을 수 없습니다.');
  for(const r of w.reports){const copy=clone(r),expected=copy.contentFingerprint;delete copy.contentFingerprint;if(expected!==digest(copy))errors.push(`${r.id}: 발행 보고서 내용이 변경됐습니다.`);}
  errors.push(...relationErrors(input));return {valid:errors.length===0,errors:unique(errors)};
}
