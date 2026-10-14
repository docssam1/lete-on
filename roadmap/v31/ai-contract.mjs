// This is an optional, read-only helper contract, never a learning-plan engine.
import {BOOK_TYPES,bookType} from './book-types.mjs';
import {parseCourseScope} from './recommendation-policy.mjs';

export const AI_BOOKS=Object.freeze(BOOK_TYPES.books.map(b=>Object.freeze({id:b.id,name:b.name,aliases:Object.freeze([...b.aliases]),type:b.type})));
export const AI_AXES=Object.freeze(['application','depth','thinking','arithmetic']);
const STATES=['unentered','not_started','unknown','in_progress','done'];
const COMPLETIONS=['unknown','not_started','in_progress','done'];
const INPUTS=['unentered','reported','legacy'];
const DIRECTIONS=['maintain','fast','consolidate','deepen','undecided'];
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v)&&[Object.prototype,null].includes(Object.getPrototypeOf(v));
const exact=(v,keys)=>plain(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const inList=(v,list)=>typeof v==='string'&&list.includes(v);
const scopeOK=s=>s===null||(exact(s,['level','grade','semester'])&&['elementary','middle'].includes(s.level)&&Number.isInteger(s.grade)&&s.grade>=1&&s.grade<=(s.level==='middle'?3:6)&&[1,2].includes(s.semester));
const byId=id=>AI_BOOKS.find(b=>b.id===id);
const completion=c=>['reported_done','reviewed_done'].includes(c.completion)?'done':['in_progress','not_started'].includes(c.completion)?c.completion:'unknown';
const inputState=c=>INPUTS.includes(c.completionInput)?c.completionInput:'legacy';
const axisOf=c=>c.intakeTrack||(c.axis==='curriculum'?/심화/.test(c.depth||'')?'depth':'application':c.axis);
const fail=(error='정해진 교재와 학습 상태만 확인할 수 있어요.',code='BAD_REQUEST')=>({valid:false,error,code});

export function collectSafeCourseFacts(s={}){
 const records=Array.isArray(s.courses)?s.courses:[],q=s.wizard?.quick||{};
 const direction=({current:'maintain',faster:'fast',consolidate:'consolidate',deepen:'deepen'})[q.learningDirection]||'undecided';
 const axes=AI_AXES.map(axis=>{
  const cs=records.filter(c=>c&&axisOf(c)===axis);
  const books=cs.flatMap(c=>{
   const known=bookType(c);if(!known)return [];
   const p=parseCourseScope(c),scope=!p.ambiguous&&['elementary','middle'].includes(p.level)&&p.grade&&p.semester?{level:p.level,grade:p.grade,semester:p.semester}:null;
   return [{bookId:known.id,scope,completion:completion(c),completionInput:inputState(c)}];
  }).slice(0,8);
  const choice=q.scene?.choices?.[axis],explicit=s.wizard?.axisStatus?.[axis];
  let state=explicit==='not_started'||choice==='not_started'?'not_started':explicit==='unknown'||choice==='unknown'?'unknown':'unentered';
  if(cs.some(c=>c.completion==='in_progress'))state='in_progress';
  else if(cs.some(c=>['reported_done','reviewed_done'].includes(c.completion)))state='done';
  else if(cs.length&&cs.every(c=>c.completion==='not_started'))state='not_started';
  else if(cs.some(c=>c.completion==='unknown'&&c.completionInput!=='unentered'))state='unknown';
  return {axis,state,books};
 });
 return {version:1,direction,axes};
}

function factsOK(f){
 if(!exact(f,['version','direction','axes'])||f.version!==1||!inList(f.direction,DIRECTIONS)||!Array.isArray(f.axes)||f.axes.length!==4)return false;
 const seen=new Set();
 for(const a of f.axes){
  if(!exact(a,['axis','state','books'])||!inList(a.axis,AI_AXES)||seen.has(a.axis)||!inList(a.state,STATES)||!Array.isArray(a.books)||a.books.length>8)return false;
  seen.add(a.axis);
  for(const b of a.books){
   if(!exact(b,['bookId','scope','completion','completionInput'])||!byId(b.bookId)||!scopeOK(b.scope)||!inList(b.completion,COMPLETIONS)||!inList(b.completionInput,INPUTS))return false;
   if(b.scope&&((b.bookId==='ssen_middle')!==(b.scope.level==='middle')))return false;
  }
 }
 return true;
}

const normalize=t=>t.normalize('NFKC').replace(/[−–—－]/g,'-').replace(/\s+/g,'').toLowerCase();
const parseStatus=Object.freeze({'진행중':['in_progress','reported'],'완료':['done','reported'],'모름':['unknown','reported'],'아직안함':['not_started','reported']});
export function parseBookPhrase(text){
 if(typeof text!=='string'||text.length>120||!text.trim()||/[\r\n\x00-\x1f\x7f<>@:/\\]/.test(text))return fail('교재 이름과 초등·중등 범위만 짧게 적어 주세요.','INVALID_BOOK_PHRASE');
 let t=normalize(text.trim()),status='';
 for(const key of Object.keys(parseStatus))if(t.endsWith(key)){status=key;t=t.slice(0,-key.length);break;}
 const match=/([1-6])-([12])$/.exec(t);if(!match)return fail('초등 또는 중등과 교재 범위를 함께 적어 주세요. 예: 중등 쎈 1-2','INVALID_BOOK_PHRASE');
 let name=t.slice(0,match.index),level='';
 if(name.startsWith('초등')){level='elementary';name=name.slice(2);}else if(name.startsWith('중등')){level='middle';name=name.slice(2);}
 if(!level&&/(초등|중등|중학)/.test(name))level=/(중등|중학)/.test(name)?'middle':'elementary';
 if(!level)return fail('학교 학년과 교재 과정을 구분하려면 초등·중등도 적어 주세요.','INVALID_BOOK_PHRASE');
 const found=AI_BOOKS.filter(b=>(b.id==='ssen_middle')===(level==='middle')).find(b=>b.aliases.some(alias=>normalize(alias)===name));
 if(!found||Number(match[1])>(level==='middle'?3:6))return fail('목록에 있는 교재 한 권과 정확한 초등·중등 범위만 적어 주세요.','INVALID_BOOK_PHRASE');
 const [done,reported]=status?parseStatus[status]:['unknown','unentered'];
 return {valid:true,value:{bookId:found.id,bookName:found.name,axis:['didimdol_s','didimdol_top'].includes(found.id)?'depth':'application',scope:{level,grade:Number(match[1]),semester:Number(match[2])},completion:done,completionInput:reported}};
}

export function validateAIRequest(payload){
 if(!plain(payload))return fail();
 if(payload.kind==='explain')return exact(payload,['kind','facts'])&&factsOK(payload.facts)?{valid:true,value:structuredClone(payload)}:fail();
 if(payload.kind==='parse-book'){
  if(!exact(payload,['kind','text']))return fail();
  const p=parseBookPhrase(payload.text);return p.valid?{valid:true,value:{kind:'parse-book',text:payload.text.trim()},candidate:p.value}:p;
 }
 return fail();
}

const ruleSource={id:'existing_roadmap_rules',title:'기존 로드맵: 학습 축 분리·진도와 진단 구분',url:null,status:'product_rule'};
const userSource={id:'user_book_policy_20261005',title:'사용자 직접 정정: 교재 운용 기준 (2026-10-05)',url:null,status:'user_confirmed'};
const facts={
 independent_axes:{text:'교과·심화·사고력·연산은 각각 입력한 기록으로 살펴봐요.',source:ruleSource},
 no_diagnosis:{text:'진도 기록만으로 약점이나 선발 가능성을 판단하지 않아요.',source:ruleSource},
 optional_curriculum:{text:'교과를 아직 따로 하지 않았거나 입력하지 않아도 사고력·연산 기록부터 이어갈 수 있어요.',source:{id:'user_optional_curriculum',title:'사용자 직접 정정: 초1·2 교과 없는 경로',url:null,status:'user_confirmed'}},
 separate_depth:{text:'응용과 심화는 서로 다른 범위로 공부하거나 심화를 나중에 더할 수 있어요.',source:userSource},
 direction_fast:{text:'빠르게는 희망하는 진행 방향이에요. 실제 속도나 숙달을 확인한 결과는 아니에요.',source:ruleSource},
 direction_consolidate:{text:'다지기를 고르면 현재 범위의 개념과 필요한 유형을 다시 살펴봐요.',source:userSource},
 direction_deepen:{text:'심화는 별도의 범위와 최근 풀이를 확인하며 더할 수 있어요.',source:userSource},
};
const bookExplanationCopy={
 didimdol_application:'디딤돌 기본+응용은 개념 학습에 사용하는 기본 교재예요. 초3 과정부터는 학습량을 고려해 디딤돌 응용을 비교해요.',
 didimdol_eungyong:'디딤돌 응용은 초3 과정부터 기본+응용의 학습량을 고려해 비교하는 교재예요. 실제 학교 학년만으로 적용하지 않아요.',
 didimdol_s:'최상위 S 수학은 유형별 심화 수업이나 집에서 꼼꼼히 공부할 때 비교해요. 학습량도 함께 살펴봐요.',
 didimdol_top:'최상위 수학은 심화를 조금 빠르게 진행하려 할 때 비교해요. 최상위 S에서 자동으로 올라가는 단계는 아니에요.',
 ssen:'쎈수학은 문제 드릴이 많이 필요할 때 쓰는 유형·응용 활용서예요. 초등은 개념·응용·심화를 차근차근 공부하려 할 때 비교하고, 학원에서는 중등 과정에 우선 활용해요.',
 ssen_middle:'쎈 중등 수학은 문제 드릴이 많이 필요할 때 비교해요. 학원에서는 초등보다 중등 과정에 우선 활용해요.',
};
for(const b of BOOK_TYPES.books)facts['book_'+b.id]={text:bookExplanationCopy[b.id],source:{id:'book_'+b.id,title:b.name+' · 사용자 직접 정정: 교재 운용 기준 (2026-10-05)',url:null,status:'user_confirmed'}};

export function eligibleExplanationFacts(f){
 const ids=['independent_axes','no_diagnosis'];
 const application=f.axes.find(a=>a.axis==='application');
 if(['unentered','not_started','unknown'].includes(application?.state))ids.push('optional_curriculum');
 if(f.axes.find(a=>a.axis==='depth')?.books.length)ids.push('separate_depth');
 if(['fast','consolidate','deepen'].includes(f.direction))ids.push('direction_'+f.direction);
 for(const a of f.axes)for(const b of a.books)ids.push('book_'+b.bookId);
 return [...new Set(ids)].map(id=>({id,...facts[id]}));
}

export function explanationFromIds(ids){
 const sources=[...new Map(ids.map(id=>[facts[id].source.id,facts[id].source])).values()];
 return {text:ids.map(id=>facts[id].text).join(' '),factIds:[...ids],provenance:'fixed_source_templates',sources};
}

export function validateModelOutput(kind,data,{eligible=[],candidate}={}){
 if(kind==='explain'){
  const allowed=new Set(eligible.map(f=>f.id));
  if(!exact(data,['factIds'])||!Array.isArray(data.factIds)||data.factIds.length<1||data.factIds.length>4||new Set(data.factIds).size!==data.factIds.length||!data.factIds.every(id=>typeof id==='string'&&allowed.has(id)))return fail('설명 응답을 확인하지 못했어요. 기본 로드맵을 그대로 볼 수 있어요.','BAD_RESPONSE');
  return {valid:true,result:explanationFromIds(data.factIds)};
 }
 if(kind==='parse-book'){
  const c=data?.candidates?.[0];
  const same=candidate&&exact(c,['bookId','bookName','axis','scope','completion','completionInput'])&&['bookId','bookName','axis','completion','completionInput'].every(k=>c[k]===candidate[k])&&exact(c.scope,['level','grade','semester'])&&['level','grade','semester'].every(k=>c.scope[k]===candidate.scope[k]);
  if(!exact(data,['candidates'])||!Array.isArray(data.candidates)||data.candidates.length!==1||!same)return fail('교재 응답을 확인하지 못했어요. 선택 목록으로 입력할 수 있어요.','BAD_RESPONSE');
  return {valid:true,result:{candidates:[structuredClone(candidate)],previewOnly:true}};
 }
 return fail();
}

export function validateAIResponse(kind,data){
 const bad=()=>({valid:false,error:'응답을 확인하지 못했어요. 기본 로드맵을 그대로 볼 수 있어요.'});
 if(!exact(data,['ok','mode','kind','result'])||data.ok!==true||!['mock','live'].includes(data.mode)||data.kind!==kind)return bad();
 const r=data.result;
 if(kind==='explain'){
  if(!exact(r,['text','factIds','provenance','sources'])||!Array.isArray(r.factIds)||r.factIds.length<1||r.factIds.length>4||!r.factIds.every(id=>typeof id==='string'&&Object.hasOwn(facts,id))||new Set(r.factIds).size!==r.factIds.length)return bad();
  if(JSON.stringify(explanationFromIds(r.factIds))!==JSON.stringify(r))return bad();
 }else if(kind==='parse-book'){
  if(!exact(r,['candidates','previewOnly'])||r.previewOnly!==true||!Array.isArray(r.candidates)||r.candidates.length!==1)return bad();
  const c=r.candidates[0];if(!exact(c,['bookId','bookName','axis','scope','completion','completionInput'])||!byId(c.bookId)||c.bookName!==byId(c.bookId).name||!scopeOK(c.scope)||c.scope===null||!inList(c.completion,COMPLETIONS)||!inList(c.completionInput,INPUTS))return bad();
  if((c.bookId==='ssen_middle')!==(c.scope.level==='middle')||c.axis!==(['didimdol_s','didimdol_top'].includes(c.bookId)?'depth':'application'))return bad();
 }else return bad();
 return {valid:true,result:structuredClone(r),mode:data.mode};
}
