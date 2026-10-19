import {esc} from './intake.mjs';
import {trackCourses,scopeLabel} from './flow.mjs';
import {academyLevelMarkup,academyTiming} from './academy-input.mjs';

const names={thinking:'사고력',application:'교과',depth:'심화',arithmetic:'연산'};
const institutions=['소마','필즈','시매쓰','CMS'];
const field=(name,label,value='',placeholder='')=>`<label class="field"><span>${esc(label)}</span><input name="${esc(name)}" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off"></label>`;
const select=(name,label,value,items,refresh=false)=>`<label class="field"><span>${esc(label)}</span><select name="${esc(name)}"${refresh?' data-scene-refresh':''}>${items.map(([v,t])=>`<option value="${esc(v)}"${String(value??'')===String(v)?' selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
const option=(value,label,selected=false)=>`<button type="button" class="scene-option" data-scene-answer="${esc(value)}" aria-pressed="${selected}"><span>${esc(label)}</span><span aria-hidden="true">›</span></button>`;
const options=(items,selected)=>`<div class="scene-options">${items.map(([v,t])=>option(v,t,v===selected)).join('')}</div>`;
const schoolRanges=[...Array.from({length:6},(_,i)=>[1,2].map(t=>`초등 ${i+1}-${t}`)).flat(),...Array.from({length:3},(_,i)=>[1,2].map(t=>`중등 ${i+1}-${t}`)).flat(),'공통수학1','공통수학2','대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하'];
const examples={thinking:['킨더팩토','키즈팩토','초등팩토','PRE 1031','필즈 베이직','1031 입문','1031 초급','1031 중급'],application:['디딤돌 기본+응용','디딤돌 응용','쎈수학','쎈 중등 수학'],depth:['최상위 S 수학','최상위 수학'],arithmetic:['소마셈','기적의 계산법','더클셈']};

// Preserve the previous compact draft in place. Copy only its editable values,
// never submit it, normalize old labels, or infer a new course from an academy.
export function prepareTutorial(s,{restart=false}={}){
 const q=s.wizard.quick;
 if(q.intakeMode==='tutorial'&&!restart)return s;
 const c=q.compact;
 if(c?.active){
  if(c.stage)q.stage=c.stage;
  for(const [key,row] of Object.entries(c.rows||{})){
   if(!row.name||['__unentered__','__not_started__','__unknown__'].includes(row.choice))continue;
   if(!row.dirty&&!row.pendingDraft&&row.baseline){
    const saved=s.courses.find(book=>book.id===row.courseId)||s.courses.find(book=>book.id===q.courseIds[key]&&book.course===row.name);
    if(!saved)continue;
    q.courseIds[key]=saved.id;
    for(const [field,value] of Object.entries({name:saved.course||'',volume:saved.volume||'',range:saved.range||'',completion:saved.completion||'unknown',completionInput:saved.completionInput||''}))q.draft[`learn:${key}:${field}`]=value;
    if(q.draftCourseSnapshots)delete q.draftCourseSnapshots[key];
    continue;
   }
   q.draft[`learn:${key}:name`]=row.name;q.draft[`learn:${key}:volume`]=row.volume||'';
   if(row.courseId)q.courseIds[key]=row.courseId;
   const progress=[row.pendingDraft,row.baseline].find(value=>value?.name===row.name);
   for(const [field,fallback] of [['range',''],['completion','unknown'],['completionInput','unentered']])q.draft[`learn:${key}:${field}`]=progress?.[field]??fallback;
   if(row.dirty&&q.draftCourseSnapshots)delete q.draftCourseSnapshots[key];
  }
  const currentAcademy=draft=>{
   const saved=s.wizard.academies.find(record=>record.id===draft?.id)||s.wizard.academies.find(record=>record.institution===draft?.name);
   return saved&&!draft.dirty&&!draft.timingTouched?{...draft,id:saved.id,choice:institutions.includes(saved.institution)?saved.institution:'other',name:saved.institution,level:saved.level||'',timing:academyTiming(saved),timingTouched:false}:draft;
  };
  const a=currentAcademy(c.academy);
  if(a&&!/^__/.test(a.choice||'')&&a.choice){
   q.draft['academy:institution']=a.choice;q.draft['academy:name']=a.name||'';q.draft['academy:level']=a.level||'';
   q.draft['academy:timing']=a.timing||'';q.draft['academy:timingTouched']=a.timingTouched?'yes':'';
   if(a.id)q.academyId=a.id;
  }
  q.scene??={};q.scene.academyDrafts??={};
  for(const [institution,oldDraft] of Object.entries(c.academyDrafts||{})){const draft=currentAcademy(oldDraft);q.scene.academyDrafts[institution]={name:draft.name||'',level:draft.level||'',timing:draft.timing||'',timingTouched:!!draft.timingTouched};}
 }
 q.intakeMode='tutorial';
 q.tutorial={version:1,previousStep:s.wizard.step};
 if(['intro','stage','learning'].includes(s.wizard.step))s.wizard.step='intro';
 return s;
}

export function tutorialEntryScreen(s){
 const q=s.wizard.quick;if(q.intakeMode!=='tutorial')return null;
 if(s.wizard.step==='intro')return {title:'독쌤과 로드맵 만들기',say:'안녕하세요. 우리 아이의 배움 길을 함께 살펴볼 독쌤입니다.',html:'<details class="tutorial-import"><summary>보관한 기록으로 이어가기</summary><label class="field"><span>기록 파일 (JSON)</span><input type="file" data-import-state accept="application/json,.json"></label></details>',next:'독쌤과 시작하기',guideId:'roadmap.welcome',mood:'happy'};
 if(s.wizard.step==='stage')return {title:'우리 아이는 몇 살, 몇 학년인가요?',say:'먼저 아이에 대해 알려 주세요.',html:select('stage','나이 또는 학년',q.stage,[['','선택해 주세요'],...Array.from({length:4},(_,i)=>[`p${i+4}`,`유아 ${i+4}세`]),...Array.from({length:6},(_,i)=>[`초${i+1}`,`초등 ${i+1}학년`]),...Array.from({length:3},(_,i)=>[`중${i+1}`,`중학교 ${i+1}학년`]),...Array.from({length:3},(_,i)=>[`고${i+1}`,`고등학교 ${i+1}학년`])]),next:'이 나이·학년으로 다음',guideId:'roadmap.stage',mood:'listen'};
 if(s.wizard.step==='tutorial-birth')return {title:'몇 월에 태어났나요?',say:'생월은 아이의 기본 정보로만 기록할게요.',html:select('birthMonth','태어난 달',s.profile.reportedBirthMonth,[['','모름'],...Array.from({length:12},(_,i)=>[i+1,`${i+1}월`])]),next:'공부 경험 알려주기',guideId:'roadmap.birth',mood:'listen'};
 if(s.wizard.step==='position-quick')return {title:'앞으로 어떤 방향으로 공부할까요?',say:'알려 주신 공부를 기록했어요. 이어갈 방향을 골라 주세요.',html:`<fieldset class="choices"><legend class="sr-only">학습 방향</legend>${[['current','지금 속도 유지'],['faster','더 빠르게'],['consolidate','지금 범위 다지기'],['deepen','같은 범위 더 깊게']].map(([v,t])=>`<label class="option"><input type="radio" name="learningDirection" value="${v}"${(q.learningDirection||'current')===v?' checked':''}><span>${t}</span></label>`).join('')}</fieldset>`,next:/^p/.test(q.stage)?'학원 방향 살펴보기':'로드맵 보기',guideId:'roadmap.direction',mood:'think'};
 return null;
}

export function collectTutorialBirth(s,value){
 const month=value===''||value===null?null:Number(value);
 if(month!==null&&(!Number.isInteger(month)||month<1||month>12))throw Error('태어난 달을 목록에서 골라 주세요.');
 s.profile.reportedBirthMonth=month;
}
export function nextTutorialEntry(s){
 const step=s.wizard.step;
 if(step==='intro')return 'stage';
 if(step==='stage'){
  if(!/^(p[4-7]|초[1-6]|중[1-3]|고[1-3])$/.test(s.wizard.quick.stage))throw Error('나이 또는 학년을 선택해 주세요.');
  return /^p[4-6]$/.test(s.wizard.quick.stage)?'tutorial-birth':'learning';
 }
 if(step==='tutorial-birth')return 'learning';
 throw Error('인사와 기본 정보 질문을 다시 확인해 주세요.');
}

function bookPicker(s,key,scope=false){
 const q=s.wizard.quick,x=q.scene,name=`learn:${key}:${scope?'volume':'name'}`,value=q.draft[name]||'';
 const label=scope?'단계·권 또는 교재 범위':'교재·과정 이름';
 if(x.pickerModes?.[name]==='custom'||scope&&!['application','depth'].includes(key))return field(name,label,value,scope?'예: A단계, 2권':'교재 이름');
 const items=[...new Set([...(scope?schoolRanges:examples[key]),...(!scope?trackCourses(s,key).map(c=>c.course):[]),value].filter(Boolean))];
 return select(name,label,value,[['','선택해 주세요'],...items.map(v=>[v,v]),['__custom__','목록에 없어요 · 직접 입력']],true);
}

export function tutorialLearningScreen(s){
 const q=s.wizard.quick,x=q.scene,cursor=x.cursor,key=cursor.split('-')[0];
 let title='',say='',html='',next='다음',hideNext=false,mood='listen';
 if(cursor==='tracks'){
  title='어떤 공부를 다시 살펴볼까요?';say='고른 공부부터 하나씩 확인할게요.';html=options(Object.entries(names).map(([v,t])=>[v,t]));hideNext=true;
 }else if(cursor.endsWith('-kind')){
  title=key==='thinking'?'사고력으로 공부한 경험이 있나요?':`${names[key]}${key==='arithmetic'?'은':'는'} 어떻게 공부하고 있나요?`;
  say=key==='thinking'?'학원이나 교재로 공부한 경험을 골라 주세요.':'아직 하지 않았거나 잘 몰라도 괜찮아요.';
  html=options([...(key==='thinking'?[['academy','학원에서 했어요']]:[]),['book','교재로 했어요'],...(key==='thinking'?[['both','학원과 교재 둘 다 했어요']]:[]),['not_started','아직 없어요'],['unknown','잘 모르겠어요']],x.choices[key]);hideNext=true;
 }else if(cursor==='thinking-academy'){
  title='어느 학원에서 공부했나요?';say='다녔던 학원 한 곳을 골라 주세요.';html=options([...institutions.map(v=>[v,v]),['other','그 외 학원']],q.draft['academy:institution']);hideNext=true;
 }else if(cursor==='thinking-academy-name'){
  title='학원 이름을 알려 주실까요?';say='기억나는 이름을 적어 주세요.';html=field('academy:name','학원 이름',q.draft['academy:name']);
 }else if(cursor==='thinking-academy-level'){
  title=`${q.draft['academy:institution']}에서 어떤 반이었나요?`;say='기억나는 반이나 레벨을 골라 주세요.';
  html=academyLevelMarkup(q.draft['academy:institution'],q.draft['academy:level']||'');
 }else if(cursor==='thinking-academy-timing'){
  title='그 학원은 언제 다녔나요?';say='현재 다니는지, 예전에 다녔는지 알려 주세요.';
  html=options([['current','현재 다녀요'],['past','전에 다녔어요'],['unknown','모름']],q.draft['academy:timing']);hideNext=true;
 }else if(cursor.endsWith('-book')){
  title=key==='thinking'&&x.choices.thinking==='both'?'따로 공부한 사고력 교재는 무엇인가요?':`어떤 ${names[key]} 교재로 공부했나요?`;
  say='지금 하거나 마지막으로 했던 교재부터 골라 주세요.';html=bookPicker(s,key);next='이 교재로 다음';
  const others=trackCourses(s,key).filter(c=>c.id!==q.courseIds[key]);
  if(others.length)html+=`<details class="scene-preserved"><summary>함께 보관 중인 교재 ${others.length}개</summary>${others.map(c=>`<p>${esc(c.course)} · ${esc(scopeLabel(c))}</p>`).join('')}</details>`;
 }else if(cursor.endsWith('-scope')){
  title='어느 단계나 권을 공부했나요?';say='교재에 적힌 범위를 알려 주세요. 비워 두어도 괜찮아요.';html=bookPicker(s,key,true);next='진행 상태 알려주기';
 }else if(cursor.endsWith('-progress')){
  title='이 교재는 어디까지 공부했나요?';say='완료 여부를 아는 만큼만 알려 주세요.';
  const witness=q.draft[`learn:${key}:completionInput`],completion=q.draft[`learn:${key}:completion`];
  const value=witness==='unentered'||!witness&&completion==='unknown'?'':completion||'';
  html=select(`learn:${key}:completion`,'진행 상태',value,[['','아직 입력하지 않을게요'],['unknown','진행 상태 모름'],['in_progress','진행 중'],['reported_done','완료'],['reviewed_done','범위 확인 완료'],['not_started','미시작']]);next='이 기록으로 다음';
 }
 if(/-(kind|level|scope)$/.test(cursor))mood='think';
 if(x.direction==='back')say='앞에서 고른 내용을 다시 살펴볼게요.';
 return {title,say,html:`<section class="scene-intake" data-learning-scene="${esc(cursor)}" data-question-count="1" data-direction="${x.direction}">${html}</section>`,next,hideNext,mood,guideId:`roadmap.${cursor}${x.direction==='back'?'.review':''}`};
}

// Stable cue metadata for future, exact-text-matched OmniVoice recordings.
// This module intentionally loads no voice, microphone, or network resource.
export function tutorialCue(s,view){
 const id=view.guideId||`roadmap.${s.wizard.step}`;
 return {id,text:view.say||'',pose:view.mood||(s.wizard.step==='overview'?'happy':'listen'),scene:s.wizard.quick.scene?.active?s.wizard.quick.scene.cursor:s.wizard.step};
}
