import {trackCourses,koreaDate} from './flow.mjs';
import {commitLearning} from './quick-flow.mjs';
import {esc} from './intake.mjs';
import {bookScopeOptions} from './book-scope-options.mjs';

const tracks=['application','depth','thinking','arithmetic'];
const trackLabels={application:'교과 진도',depth:'심화 진도',thinking:'사고력 진도',arithmetic:'연산 진도'};
const academyNames=['소마','필즈','시매쓰','CMS'];
const U='__unentered__',N='__not_started__',K='__unknown__',CUSTOM='__custom__';
const states=new Set([U,N,K]);
const books={application:['디딤돌 기본+응용','디딤돌 응용','쎈수학','쎈 중등 수학'],depth:['최상위 S 수학','최상위 수학'],thinking:['킨더팩토','키즈팩토','초등팩토','PRE 1031','필즈 베이직','1031 입문','1031 초급','1031 중급'],arithmetic:['소마셈','기적의 계산법','더클셈']};
// Existing catalog B18/B65/B66 and source-monthly S4 names; no old-course renaming.
const schoolRanges=[...Array.from({length:6},(_,i)=>[1,2].map(term=>`초등 ${i+1}-${term}`)).flat(),...Array.from({length:3},(_,i)=>[1,2].map(term=>`중등 ${i+1}-${term}`)).flat(),'공통수학1','공통수학2','대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하'];
const goalLabels={premier:'프리미어',gifted:'영재원',highSchool:'학교·진로'};
const goalText={yes:'생각해요',no:'생각하지 않아요',unentered:'아직 입력하지 않음'};
const stageValid=v=>/^(p[4-7]|초[1-6]|중[1-3]|고[1-3])$/.test(v);
const isPreschool=v=>/^p[4-7]$/.test(v);
const fieldName=(key,field)=>`compact:${key}:${field}`;
const select=(name,value,options,extra='')=>`<select name="${esc(name)}" ${extra}>${options.map(([v,label])=>`<option value="${esc(v)}" ${String(value??'')===String(v)?'selected':''}>${esc(label)}</option>`).join('')}</select>`;
const field=(name,value,label,placeholder='',extra='')=>`<label class="compact-field"><span class="sr-only">${esc(label)}</span><input name="${esc(name)}" value="${esc(value||'')}" aria-label="${esc(label)}" placeholder="${esc(placeholder||label)}" autocomplete="off" ${extra}></label>`;
const wrapSelect=(name,value,options,label,refresh=false)=>`<label class="compact-field"><span class="sr-only">${esc(label)}</span>${select(name,value,options,`aria-label="${esc(label)}"${refresh?' data-compact-refresh':''}`)}</label>`;

function seedGoal(s,key){
 const previous=s.wizard.quick.compact?.lastGoalAnswers?.[key];
 if(key==='premier')return ['consider','current','later'].includes(s.goals.premier)?'yes':s.goals.premier==='none'?'no':'unentered';
 if(s.goals[key]===true)return 'yes';
 return s.wizard.quick.detailStatuses?.[key]==='none'||previous==='no'?'no':'unentered';
}
function makeDraft(s){
 const q=s.wizard.quick,stage=stageValid(q.stage)?q.stage:/^(초[1-6]|중[1-3]|고[1-3])$/.test(s.profile.grade)?s.profile.grade:[4,5,6,7].includes(s.profile.reportedAge)?`p${s.profile.reportedAge}`:'';
 const rows={};
 for(const key of tracks){
  const c=s.courses.find(x=>x.id===q.courseIds?.[key])||trackCourses(s,key).at(-1);
  const legacy=!c&&s.wizard.step==='learning'&&q.scene?.active&&q.scene.context!=='editing'&&['book','both'].includes(q.scene.choices?.[key])&&String(q.draft[`learn:${key}:name`]||'').trim()?{name:String(q.draft[`learn:${key}:name`]).trim(),volume:String(q.draft[`learn:${key}:volume`]||''),range:String(q.draft[`learn:${key}:range`]||''),completion:q.draft[`learn:${key}:completion`]||'unknown',completionInput:q.draft[`learn:${key}:completionInput`]||'unentered'}:null;
  const choice=c?.course||legacy?.name||(s.wizard.axisStatus[key]==='not_started'?N:s.wizard.axisStatus[key]==='unknown'||s.wizard.quick.scene?.choices?.[key]==='unknown'?K:U);
  rows[key]={choice,name:c?.course||legacy?.name||'',volumeChoice:c?.volume||legacy?.volume||'',volume:c?.volume||legacy?.volume||'',courseId:c?.id||'',dirty:false,pendingDraft:legacy,baseline:c?{name:c.course||'',volume:c.volume||'',range:c.range||'',completion:c.completion||'unknown',completionInput:c.completionInput||'',level:c.level||'unknown'}:null};
 }
 const a=s.wizard.academies.find(a=>a.id===q.academyId)||s.wizard.academies.at(-1);
 const institution=a?(academyNames.includes(a.institution)?a.institution:'other'):s.wizard.thinkingExperience==='not_started'?N:U;
 return {version:1,active:true,stage,birthMonth:s.profile.reportedBirthMonth?String(s.profile.reportedBirthMonth):'',rows,academy:{choice:institution,name:a?.institution||'',levelChoice:a?.level||'',level:a?.level||'',id:a?.id||'',dirty:false},goals:Object.fromEntries(Object.keys(goalLabels).map(k=>[k,seedGoal(s,k)])),goalTouched:{},lastGoalAnswers:{...(q.compact?.lastGoalAnswers||{})}};
}
export function ensureCompact(s){
 const q=s.wizard.quick;
 if(!q.compact||q.compact.version!==1)q.compact=makeDraft(s);
 return q.compact;
}
export function startCompact(s,{reset=false}={}){
 if(reset||!s.wizard.quick.compact)s.wizard.quick.compact=makeDraft(s);
 const c=ensureCompact(s);c.active=true;
 if(s.wizard.quick.scene){s.wizard.quick.scene.active=false;s.wizard.quick.scene.context='compact';}
 return c;
}
export function isCompactStep(s){
 const step=s.wizard?.step,q=s.wizard?.quick;
 if(!q)return false;
 if(['intro','stage'].includes(step))return true;
 return step==='learning'&&(q.compact?.active===true||(!q.compact&&q.scene?.context!=='editing'));
}

// Autosave keeps only this editable draft. Course/profile/goal records change on submit.
export function collectCompact(s,d,editedField=''){
 const c=ensureCompact(s);
 if(d.has('compact:stage'))c.stage=String(d.get('compact:stage')||'');
 if(d.has('compact:birthMonth'))c.birthMonth=String(d.get('compact:birthMonth')||'');
 for(const key of tracks){
  const row=c.rows[key],choiceName=fieldName(key,'choice');
  let bookChanged=false;
  if(d.has(choiceName)){
   const next=String(d.get(choiceName)||U);
   if(next!==row.choice){row.choice=next;row.dirty=true;bookChanged=true;if(next===CUSTOM)row.name='';}
   if(!states.has(next)&&next!==CUSTOM)row.name=next;
  }
  const customName=fieldName(key,'name');
  if(row.choice===CUSTOM&&d.has(customName)){const name=String(d.get(customName)||'');if(name!==row.name){row.dirty=true;bookChanged=true;}row.name=name;}
  // The form still contains the previous book's scope during a change event.
  // Drop that scope from the editable draft; saved course/history records stay intact.
  if(bookChanged){row.volumeChoice='';row.volume='';row.pendingDraft=null;row.scopeResetPending=true;continue;}
  const volumeName=fieldName(key,'volume');
  const customVolume=fieldName(key,'customVolume');
  if(row.scopeResetPending){if(![volumeName,customVolume].includes(editedField))continue;delete row.scopeResetPending;}
  if(d.has(volumeName)){
   const next=String(d.get(volumeName)||'');
   if(next!==row.volumeChoice){row.volumeChoice=next;row.dirty=true;}
   if(next!==CUSTOM)row.volume=next;
  }
  if(row.volumeChoice===CUSTOM&&d.has(customVolume)){const value=String(d.get(customVolume)||'');if(value!==row.volume)row.dirty=true;row.volume=value;}
 }
 const a=c.academy;
 for(const [field,name] of [['choice','compact:academy:choice'],['name','compact:academy:name'],['levelChoice','compact:academy:level'],['level','compact:academy:customLevel']])if(d.has(name)){
  const value=String(d.get(name)||'');if(value!==a[field])a.dirty=true;a[field]=value;
 }
 if(academyNames.includes(a.choice))a.name=a.choice;
 if(a.levelChoice!==CUSTOM)a.level=a.levelChoice;
 for(const key of Object.keys(goalLabels)){
  const name=`compact:goal:${key}`;
  if(d.has(name)){
   const value=String(d.get(name)||'unentered');
   if(value!==c.goals[key]||editedField===name)c.goalTouched[key]=true;
   c.goals[key]=value;
  }
 }
 return c;
}

function rowMarkup(s,key){
 const c=ensureCompact(s),row=c.rows[key],names=[...new Set([...books[key],...trackCourses(s,key).map(x=>x.course),...(!states.has(row.choice)&&row.choice!==CUSTOM?[row.choice]:[])].filter(Boolean))];
 const choices=[[U,'교재 선택'],[N,'아직 안 해요'],[K,'잘 모르겠어요'],...names.map(n=>[n,n]),[CUSTOM,'그 외 교재']];
 let html=wrapSelect(fieldName(key,'choice'),row.choice,choices,`${trackLabels[key]} 교재`,true);
 if(row.choice===CUSTOM)html+=field(fieldName(key,'name'),row.name,`${trackLabels[key]} 교재 이름`,'교재 이름','data-compact-book-name');
 const hasBook=!states.has(row.choice);
 const name=row.choice===CUSTOM?row.name:row.choice,record=s.courses.find(course=>course.id===row.courseId&&course.course===name);
 const scope=['application','depth'].includes(key)?null:bookScopeOptions({track:key,bookName:name,edition:record?.edition||'',currentValue:row.volume});
 const ranges=scope?scope.options:schoolRanges.map(value=>[value,value]);
 const options=[['',scope?.placeholder||'범위 선택'],...ranges];
 if(scope)options.push([scope.unknownValue,scope.unknownLabel]);
 for(const value of [...new Set([row.volumeChoice!==CUSTOM?row.volumeChoice:'',row.volume].filter(Boolean))])if(!options.some(([id])=>id===value))options.push([value,`기존 입력 · ${value}`]);
 options.push([CUSTOM,'직접 입력']);
 if(hasBook){
  html+=wrapSelect(fieldName(key,'volume'),row.volumeChoice,options,key==='thinking'?'사고력 권·범위':key==='arithmetic'?'연산 단계·권':`${trackLabels[key]} 범위`,true);
  if(row.volumeChoice===CUSTOM)html+=field(fieldName(key,'customVolume'),row.volume,key==='thinking'?'사고력 권·범위':`${trackLabels[key]} 범위`,scope?.customPlaceholder||'예: 중등 1-2');
 }
 return `<div class="compact-row" data-compact-track="${key}"><h3>${trackLabels[key]}</h3><div class="compact-row-fields${hasBook?' has-scope':''}">${html}</div></div>`;
}
function academyMarkup(s){
 const a=ensureCompact(s).academy;
 let html=wrapSelect('compact:academy:choice',a.choice,[[U,'학원 선택'],[N,'다닌 적 없어요'],[K,'잘 모르겠어요'],...academyNames.map(n=>[n,n]),['other','그 외 학원']],'사고력 학원 경험',true);
 if(a.choice==='other')html+=field('compact:academy:name',a.name,'학원 이름','학원 이름');
 if(!states.has(a.choice)){
  const options=[['','반·레벨 선택'],...(a.level?[ [a.level,a.level] ]:[]),[CUSTOM,'반·레벨 입력']];
  html+=wrapSelect('compact:academy:level',a.levelChoice,options,'학원 반·레벨',true);
  if(a.levelChoice===CUSTOM)html+=field('compact:academy:customLevel',a.level,'학원 반·레벨','기억나는 반·레벨');
 }
 return `<div class="compact-row" data-compact-track="academy"><h3>학원 경험</h3><div class="compact-row-fields${!states.has(a.choice)?' has-scope':''}">${html}</div></div>`;
}
export function compactScreen(s){
 const c=ensureCompact(s),young=isPreschool(c.stage);
 const stages=[['','나이 또는 학년 선택'],...Array.from({length:4},(_,i)=>[`p${i+4}`,`유아 ${i+4}세`]),...Array.from({length:6},(_,i)=>[`초${i+1}`,`초등 ${i+1}학년`]),...Array.from({length:3},(_,i)=>[`중${i+1}`,`중등 ${i+1}학년`]),...Array.from({length:3},(_,i)=>[`고${i+1}`,`고등 ${i+1}학년`])];
 const stage=wrapSelect('compact:stage',c.stage,stages,'아이 나이 또는 학년',true);
 const month=/^p[456]$/.test(c.stage)?wrapSelect('compact:birthMonth',c.birthMonth,[['','몇 월생인가요? · 선택'],...Array.from({length:12},(_,i)=>[String(i+1),`${i+1}월생`])],'태어난 달'):'';
 const goals=young?['premier','gifted']:['gifted','highSchool'];
 const html=`<section class="compact-intake" data-compact-intake><div class="compact-profile"><h2>우리 아이</h2><div class="compact-profile-fields">${stage}${month}</div></div><section class="compact-learning"><div class="compact-section-heading"><h2>지금 공부</h2><p>아는 것만 골라 주세요. 빈칸도 괜찮아요.</p></div>${rowMarkup(s,'application')}${rowMarkup(s,'depth')}${rowMarkup(s,'thinking')}${academyMarkup(s)}${rowMarkup(s,'arithmetic')}</section><section class="compact-goals"><h2>관심 목표</h2>${goals.map(key=>`<div class="compact-goal-row"><h3>${goalLabels[key]}</h3>${wrapSelect(`compact:goal:${key}`,c.goals[key],[['unentered','아직 입력하지 않음'],['yes','생각해요'],['no','생각하지 않아요']],`${goalLabels[key]} 관심`)}</div>`).join('')}</section><p class="compact-footer-note">자세한 기록은 로드맵을 본 뒤 더할 수 있어요.</p></section>`;
 return {title:'우리 아이는 지금 어디쯤일까요?',say:'지금 공부와 관심 목표만 알려 주세요.',html,next:'로드맵 보기',hideNext:false};
}

function applyInterest(s,key,value){
 if(value==='unentered')return;
 if(!['yes','no'].includes(value))throw Error('관심 목표 선택을 확인해 주세요.');
 const yes=value==='yes',w=s.wizard;
 if(key==='premier')s.goals.premier=yes?(['consider','current','later'].includes(s.goals.premier)?s.goals.premier:'consider'):'none';
 else s.goals[key]=yes;
 if(yes&&!w.interests.includes(key))w.interests.push(key);
 if(!yes)w.interests=w.interests.filter(x=>x!==key);
 // Keep institution/year/user notes and all historical snapshots.
 if(key!=='premier'&&!yes){s.wizard.quick.detailStatuses??={};s.wizard.quick.detailStatuses[key]='none';}
}

export function commitCompact(s){
 const next=structuredClone(s),c=ensureCompact(next),q=next.wizard.quick;
 if(!stageValid(c.stage))throw Error('아이의 나이 또는 학년을 골라 주세요.');
 q.stage=c.stage;
 if(isPreschool(c.stage)){
  next.profile.reportedAge=Number(c.stage.slice(1));next.profile.grade='미취학';
  if(/^p[456]$/.test(c.stage)){
   if(c.birthMonth&&!/^(?:[1-9]|1[0-2])$/.test(c.birthMonth))throw Error('태어난 달을 확인해 주세요.');
   next.profile.reportedBirthMonth=c.birthMonth?Number(c.birthMonth):null;
  }
 }else next.profile.grade=c.stage;
 next.profile.academicYear=koreaDate().slice(0,4);
 q.scene??={};q.scene.choices??={};
 // Do not reuse hidden legacy drafts: only this page's resolved rows are committed.
 for(const key of tracks){
  const row=c.rows[key];
  if(states.has(row.choice)){
   q.draft[`learn:${key}:name`]='';q.draft[`learn:${key}:volume`]='';q.draft[`learn:${key}:range`]='';
   if(row.choice===U)delete q.scene.choices[key];else q.scene.choices[key]=row.choice===N?'not_started':'unknown';
   if(!trackCourses(next,key).length){if(row.choice===N)next.wizard.axisStatus[key]='not_started';else if(row.choice===K)next.wizard.axisStatus[key]='unknown';else delete next.wizard.axisStatus[key];}
   continue;
  }
  const name=String(row.choice===CUSTOM?row.name:row.choice).trim(),volume=String(row.volume||'').trim();
  if(!name)throw Error(`${trackLabels[key]} 교재 이름을 적거나 교재 선택으로 바꿔 주세요.`);
  const old=next.courses.find(x=>x.id===row.courseId);
  // A different book is a new record; older books remain available after results.
  if(old?.course===name)q.courseIds[key]=old.id;else delete q.courseIds[key];
  const sameScope=old?.course===name&&old.volume===volume,pending=row.pendingDraft,samePending=!!pending&&pending.name===name&&pending.volume===volume;
  q.draft[`learn:${key}:name`]=name;q.draft[`learn:${key}:volume`]=volume;
  q.draft[`learn:${key}:range`]=sameScope?old.range||'':samePending?pending.range:'';
  q.draft[`learn:${key}:completion`]=sameScope?old.completion||'unknown':samePending?pending.completion:'unknown';
  q.draft[`learn:${key}:completionInput`]=sameScope?old.completionInput||'unentered':samePending?pending.completionInput:'unentered';
  q.scene.choices[key]='book';
  // commitLearning inherits saved middle/high level for bare range edits.
 }
 const a=c.academy;
 if(states.has(a.choice)){
  q.draft['academy:institution']='';
  if(!next.wizard.academies.length)next.wizard.thinkingExperience=a.choice===N?'not_started':a.choice===K?'unknown':next.wizard.thinkingExperience;
 }else{
  if(!academyNames.includes(a.choice)&&a.choice!=='other')throw Error('학원 선택을 확인해 주세요.');
  if(a.choice==='other'&&!a.name.trim())throw Error('그 외 학원 이름을 적거나 학원 선택으로 바꿔 주세요.');
  q.academyId=a.id||q.academyId||'';q.draft['academy:institution']=a.choice;q.draft['academy:name']=a.name;q.draft['academy:level']=a.level||'';
 }
 commitLearning(next);
 const thinkingBooks=trackCourses(next,'thinking').length>0,hasAcademy=next.wizard.academies.length>0;
 if(thinkingBooks||hasAcademy)next.wizard.thinkingExperience=thinkingBooks&&hasAcademy?'both':hasAcademy?'academy':'books';
 else if(c.rows.thinking.choice===N&&[U,N].includes(c.academy.choice))next.wizard.thinkingExperience='not_started';
 else if(c.rows.thinking.choice===K||c.academy.choice===K)next.wizard.thinkingExperience='unknown';
 const visibleGoals=isPreschool(c.stage)?['premier','gifted']:['gifted','highSchool'];
 for(const key of visibleGoals)if(c.goalTouched[key])applyInterest(next,key,c.goals[key]);
 c.lastGoalAnswers={...c.lastGoalAnswers,...Object.fromEntries(visibleGoals.filter(k=>c.goalTouched[k]&&c.goals[k]!=='unentered').map(k=>[k,c.goals[k]]))};
 q.scene.active=false;c.active=false;next.wizard.step='overview';
 Object.assign(s,next);return s;
}
export function compactGoalSummary(s){
 const q=s.wizard.quick,keys=isPreschool(q.stage)?['premier','gifted']:['gifted','highSchool'];
 const rows=keys.map(key=>{const value=seedGoal(s,key);return value==='unentered'?'':`<span>${goalLabels[key]} · ${goalText[value]}</span>`;}).filter(Boolean);
 return rows.length?`<p class="compact-goal-summary" data-compact-goal-summary>${rows.join('')}</p>`:'';
}
