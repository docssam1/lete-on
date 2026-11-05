/* Select only verified scope equivalents. Exposure is not a mastery judgement. */
(function(g){
'use strict';
const own=(o,k)=>Object.hasOwn(o||{},k);
const dayOK=v=>typeof v==='string'&&/^(?:20\d\d|2100)-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
const variant=v=>({a:'가형',b:'나형'})[v]||v||'';

function catalog(){
 const papers=new Map();
 for(const p of [...(g.PlannerMockSchedule?.PAPERS||[]),...(g.PlannerMockLibrary?.PAPERS||[])]){
  if(p&&typeof p.id==='string')papers.set(p.id,{...(papers.get(p.id)||{}),...p,level:String(p.level),variant:variant(p.variant)});
 }
 const scopes=new Map(),conflicts=new Set();
 for(const group of g.PlannerMockScopeGroups||[]){
  if(!group||typeof group.key!=='string'||!group.key||typeof group.scope!=='string'||!Array.isArray(group.ids))continue;
  for(const id of group.ids){
   if(!papers.has(id))continue;
   const previous=scopes.get(id);
   if(previous&&(previous.key!==group.key||previous.checkpoint!==group.checkpoint||previous.scope!==group.scope))conflicts.add(id);
   else scopes.set(id,group);
  }
 }
 return [...papers.values()].map(p=>{
  const group=conflicts.has(p.id)?null:scopes.get(p.id);
  return Object.freeze({...p,scopeKey:group?.key||null,checkpoint:group?.checkpoint||null,
   scope:group?.scope||p.scope||'',scopeSources:Object.freeze(group&&Array.isArray(group.sourceUrls)?[...new Set(group.sourceUrls.filter(x=>typeof x==='string'))]:[])});
 });
}
function identify(record){
 if(!record||typeof record.exam!=='string'||!['1','2'].includes(String(record.level)))return null;
 return catalog().find(p=>p.exam===record.exam&&p.level===String(record.level))||null;
}
function sourceFor(record){const p=identify(record);return p?.scopeKey?p:null;}

/* Legacy free-text labels are used only to exclude exposed papers, never to
 * establish a source scope. A missing A/B label excludes both possible forms. */
function aliasPapers(record,papers){
 if(!record||typeof record.exam!=='string'||!['1','2'].includes(String(record.level)))return [];
 const match=record.exam.trim().match(/^(20\d\d)\s*년\s*(1[0-2]|[1-9])\s*월\s*(?:(고[12])\s*(?:수학\s*)?)?(?:전국연합학력평가|학력평가|학평|모의평가|모의고사|모평)(?:\s*(?:[·/\-]\s*)?(가형|나형))?$/);
 if(!match||match[3]&&match[3]!=='고'+String(record.level))return [];
 return papers.filter(p=>p.year===+match[1]&&p.month===+match[2]&&p.level===String(record.level)&&(!match[4]||variant(p.variant)===match[4]));
}
function seen(records=[],schedule={}){
 const papers=catalog(),known=new Set(papers.map(p=>p.id)),out=new Set();
 for(const record of Array.isArray(records)?records:[]){
  const exact=papers.find(p=>p.exam===record?.exam&&p.level===String(record?.level));
  for(const p of exact?[exact]:aliasPapers(record,papers))out.add(p.id);
 }
 for(const id of Array.isArray(schedule?.seenPaperIds)?schedule.seenPaperIds:[])if(known.has(id))out.add(id);
 for(const slot of g.PlannerMockSchedule?.PAPERS||[]){
  const override=own(schedule?.overrides,slot.id)?schedule.overrides[slot.id]:null;
  if(override?.status==='done'){
   const id=override.paperId||slot.id;
   if(known.has(id))out.add(id);
  }
 }
 return out;
}
function available(p,day){
 if(!p||!dayOK(day))return false;
 if(p.examDate!==undefined&&p.examDate!==null&&p.examDate!=='')return dayOK(p.examDate)&&p.examDate<=day;
 return Number.isInteger(p.year)&&p.year>=2000&&p.year<=2100&&p.year+'-12-31'<=day;
}
const newest=(a,b)=>b.year-a.year||(b.examDate||b.year+'-'+String(b.month).padStart(2,'0')+'-01').localeCompare(a.examDate||a.year+'-'+String(a.month).padStart(2,'0')+'-01')||b.month-a.month||a.id.localeCompare(b.id);
const reservedHas=(reserved,id)=>typeof reserved?.has==='function'&&reserved.has(id);
function selectInitial(slotId,records,schedule,day,reserved=new Set()){
 if(typeof slotId!=='string'||!slotId)return null;
 const used=seen(records,schedule),eligible=catalog().filter(p=>p.scopeKey&&p.checkpoint===slotId&&!used.has(p.id)&&!reservedHas(reserved,p.id)&&available(p,day));
 const years=new Map();for(const p of eligible){if(!years.has(p.scopeKey))years.set(p.scopeKey,new Set());years.get(p.scopeKey).add(p.year);}
 eligible.sort((a,b)=>Number(years.get(b.scopeKey).size>=2)-Number(years.get(a.scopeKey).size>=2)||newest(a,b));
 return eligible[0]||null;
}
function selectRecheck(record,records,schedule,day,reserved=new Set(),savedId=null){
 const source=sourceFor(record);if(!source)return null;
 const used=seen(records,schedule),eligible=catalog().filter(p=>p.scopeKey===source.scopeKey&&p.year!==source.year&&!used.has(p.id)&&!reservedHas(reserved,p.id)&&available(p,day));
 return eligible.find(p=>p.id===savedId)||eligible.sort(newest)[0]||null;
}
g.PlannerMockMatching=Object.freeze({catalog,identify,sourceFor,seen,available,selectInitial,selectRecheck});
})(window);
