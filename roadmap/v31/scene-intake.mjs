import {trackCourses,TRACKS,scopeLabel} from './flow.mjs';
import {esc} from './intake.mjs';
import {parseCourseScope} from './recommendation-policy.mjs';
import {academyLevelAllowed,academyLevelMarkup,academyLevelOptions,academyTiming,academyTimingMarkup} from './academy-input.mjs';
import {tutorialLearningScreen} from './tutorial-intake.mjs';

const keys=['thinking','application','depth','arithmetic'];
const names={thinking:'사고력',application:'교과',depth:'심화',arithmetic:'연산'};
const academyNames=['소마','필즈','시매쓰','CMS'];
const low=s=>/^(p[4-7]|초[12])$/.test(s.wizard.quick.stage);
const first=s=>low(s)?'thinking':'application';
const field=(name,label,value='',extra='')=>`<label class="field"><span>${label}</span><input name="${name}" value="${esc(value)}" ${extra}></label>`;
const select=(name,label,value,items,extra='')=>`<label class="field"><span>${label}</span><select name="${name}" ${extra}>${items.map(([v,t])=>`<option value="${esc(v)}" ${String(value??'')===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
const customChoice='__custom__';
const schoolRanges=[...Array.from({length:6},(_,i)=>[1,2].map(term=>`초등 ${i+1}-${term}`)).flat(),...Array.from({length:3},(_,i)=>[1,2].map(term=>`중등 ${i+1}-${term}`)).flat()];
function picker(s,name,label,items,placeholder){
 const q=s.wizard.quick,x=q.scene,value=String(q.draft[name]||'');
 if(x.pickerModes?.[name]==='custom')return field(name,label,value,`placeholder="${esc(placeholder)}" autocomplete="off"`);
 const values=[...new Set([...items,value].filter(v=>v&&v!==customChoice))];
 return select(name,label,value,[['','선택해 주세요'],...values.map(v=>[v,v]),[customChoice,'목록에 없어요 · 직접 입력']],'data-scene-refresh');
}
const latestAcademy=s=>s.wizard.academies.find(a=>a.id===(s.wizard.quick.academyId||'quick-academy'))||s.wizard.academies.at(-1);
export function startScene(s,{track='',returnTo='position-quick',editing=false,entry='kind'}={}){
 const q=s.wizard.quick,old=q.scene,tutorial=q.intakeMode==='tutorial';
 q.scene={version:tutorial?2:1,active:true,cursor:track?`${track}-${entry==='book'?'book':'kind'}`:editing?'tracks':`${tutorial?'thinking':first(s)}-kind`,history:[],choices:{...old?.choices},pendingTracks:[],academyTouched:false,academyDrafts:{...old?.academyDrafts},context:editing?'editing':'initial',returnTo,direction:'forward'};
 for(const record of s.wizard.academies){const institution=academyNames.includes(record.institution)?record.institution:'other';if(!tutorial||!q.scene.academyDrafts[institution])q.scene.academyDrafts[institution]={name:record.institution,level:record.level||'',timing:academyTiming(record),timingTouched:false};}
 for(const key of keys)if(!tutorial&&!q.courseIds[key]&&trackCourses(s,key).length)delete q.draft[`learn:${key}:name`];
 if(track&&entry==='book'){q.scene.directBook=true;q.scene.choices[track]='book';}
 const a=latestAcademy(s);
 if(a&&(!tutorial||!q.draft['academy:institution'])){const institution=academyNames.includes(a.institution)?a.institution:'other';q.academyId=a.id;q.draft['academy:institution']=institution;q.draft['academy:name']=a.institution;q.draft['academy:level']=a.level||'';q.draft['academy:timing']=academyTiming(a);delete q.draft['academy:timingTouched'];q.scene.academyDrafts[institution]={name:a.institution,level:a.level||'',timing:academyTiming(a),timingTouched:false};}
 return q.scene;
}
export function ensureScene(s){return s.wizard.quick.scene?.active?s.wizard.quick.scene:startScene(s);}
function move(s,cursor){const x=ensureScene(s);x.history.push(x.cursor);x.cursor=cursor;x.direction='forward';return 'learning';}
export function backScene(s){const x=s.wizard.quick.scene;if(s.wizard.step!=='learning'||!x?.active||!x.history.length)return false;x.cursor=x.history.pop();x.direction='back';return true;}
export function chooseScene(s,value){
 const x=ensureScene(s),key=x.cursor.replace(/-kind$/,'');
 if(x.version===2&&x.cursor==='thinking-academy'){
  if(![...academyNames,'other'].includes(value))throw Error('다녔던 학원을 골라 주세요.');
  collectScene(s,new Map([['academy:institution',value]]));
  return move(s,value==='other'?'thinking-academy-name':academyLevelOptions(value).ask?'thinking-academy-level':'thinking-academy-timing');
 }
 if(x.version===2&&x.cursor==='thinking-academy-timing'){
  if(!['current','past','unknown'].includes(value))throw Error('다닌 시점을 골라 주세요.');
  s.wizard.quick.draft['academy:timing']=value;s.wizard.quick.draft['academy:timingTouched']='yes';x.academyTouched=true;
  if(x.choices.thinking==='both')return move(s,'thinking-book');
  return afterTrack(s,'thinking');
 }
 if(x.cursor==='tracks'){if(!keys.includes(value))throw Error('추가할 학습을 골라 주세요.');return move(s,`${value}-kind`);}
 if(!keys.includes(key)||!['book','academy','both','not_started','unknown'].includes(value)||(['academy','both'].includes(value)&&key!=='thinking'))throw Error('공부한 방법을 골라 주세요.');
 x.choices[key]=value;
 x.pendingTracks=x.pendingTracks.filter(k=>k!==key);
 if(key==='thinking')x.academyTouched=false;
 if(['unknown','not_started'].includes(value)&&!trackCourses(s,key).length)s.wizard.axisStatus[key]=value;
 if(key==='thinking')s.wizard.thinkingExperience=value==='book'?'books':value;
 if(value==='book')return move(s,`${key}-book`);
 if(['academy','both'].includes(value))return move(s,'thinking-academy');
 return afterTrack(s,key);
}
function afterTrack(s,key){
 const x=ensureScene(s);
 if(x.context==='editing'||key==='depth'){x.active=false;return x.returnTo;}
 if(x.version===2){if(key==='thinking')return move(s,'application-kind');if(key==='application')return move(s,'arithmetic-kind');x.active=false;return x.returnTo;}
 if(key==='application')return move(s,'thinking-kind');
 if(key==='thinking')return move(s,'arithmetic-kind');
 x.active=false;return x.returnTo;
}
export function collectScene(s,d,editedField=''){
 const q=s.wizard.quick,x=ensureScene(s),cursor=x.cursor;
 if(x.version===2&&cursor.startsWith('thinking-academy')&&!d.has('academy:institution'))d=new Map([['academy:institution',q.draft['academy:institution']||''],...d.entries()]);
 if(cursor.startsWith('thinking-academy')&&d.has('academy:institution')){
  const old=q.draft['academy:institution']||'',next=String(d.get('academy:institution')||'');x.academyDrafts??={};
  if(next!==old){
   x.academyDrafts[old]={name:q.draft['academy:name']||'',level:q.draft['academy:level']||'',timing:q.draft['academy:timing']||'',timingTouched:q.draft['academy:timingTouched']==='yes'};
   const a=s.wizard.academies.find(a=>next==='other'?!academyNames.includes(a.institution):a.institution===next),cache=x.academyDrafts[next];
   q.draft['academy:institution']=next;q.draft['academy:name']=cache?.name??a?.institution??'';q.draft['academy:level']=cache?.level??a?.level??'';q.draft['academy:timing']=cache?.timing??academyTiming(a);q.draft['academy:timingTouched']=cache?.timingTouched?'yes':'';
  }else{
   const nameChanged=next==='other'&&d.has('academy:name')&&String(d.get('academy:name'))!==q.draft['academy:name'];
   if(nameChanged){const name=String(d.get('academy:name'));q.draft['academy:name']=name;const record=s.wizard.academies.find(a=>a.institution===name);q.draft['academy:level']=record?.level||'';q.draft['academy:timing']=academyTiming(record);delete q.draft['academy:timingTouched'];}
   if(d.has('academy:level')){
    const selected=String(d.get('academy:level')),previous=q.draft['academy:level']||'';
    if(!academyLevelAllowed(next,selected,previous))throw Error('반·레벨은 목록에서 선택해 주세요. 기존 입력값은 그대로 보관할 수 있어요.');
    q.draft['academy:level']=selected;
   }
   if(!nameChanged&&d.has('academy:timing')){const timing=String(d.get('academy:timing')||'');if(['current','past','unknown'].includes(timing)){if(timing!==q.draft['academy:timing']||editedField==='academy:timing')q.draft['academy:timingTouched']='yes';q.draft['academy:timing']=timing;}}
  }
 }
 if(cursor.endsWith('-progress')&&d.has(`learn:${cursor.split('-')[0]}:completion`)){const name=`learn:${cursor.split('-')[0]}:completion`;if(x.version!==2||d.get(name)||editedField===name)q.draft[`learn:${cursor.split('-')[0]}:completionInput`]=d.get(name)?'reported':'unentered';}
 if(/-(book|scope|progress)$/.test(cursor))for(const [key,value] of d.entries())if(key.startsWith(`learn:${cursor.split('-')[0]}:`)){
  if(/-(book|scope)$/.test(cursor)&&/(name|volume)$/.test(key)&&String(value)===customChoice){x.pickerModes??={};x.pickerModes[key]='custom';continue;}
  q.draft[key]=String(value);
 }
}
export function nextScene(s){
 const q=s.wizard.quick,x=ensureScene(s),key=x.cursor.split('-')[0];
 if(x.cursor==='tracks'||x.cursor.endsWith('-kind'))throw Error('아는 방법을 골라 주세요. 모름으로 이어가도 괜찮아요.');
 if(x.version===2){
  if(x.cursor==='thinking-academy')throw Error('다녔던 학원을 골라 주세요.');
  if(x.cursor==='thinking-academy-name'){if(!String(q.draft['academy:name']||'').trim())throw Error('학원 이름을 알려 주세요.');return move(s,'thinking-academy-timing');}
  if(x.cursor==='thinking-academy-level')return move(s,'thinking-academy-timing');
  if(x.cursor==='thinking-academy-timing')throw Error('다닌 시점을 골라 주세요.');
  if(x.cursor.endsWith('-book')){if(!String(q.draft[`learn:${key}:name`]||'').trim())throw Error('교재 이름을 골라 주세요. 모르면 이전 질문에서 모름을 고를 수 있어요.');return move(s,`${key}-scope`);}
  if(x.cursor.endsWith('-scope'))return move(s,`${key}-progress`);
 }
 if(x.cursor==='thinking-academy'){
  const institution=q.draft['academy:institution'];
  if(institution==='other'&&!String(q.draft['academy:name']||'').trim())throw Error('학원 이름을 적거나 선택하지 않음으로 이어가 주세요.');
  x.academyTouched=!!institution;
  if(x.choices.thinking==='both')return move(s,'thinking-book');
  return afterTrack(s,'thinking');
 }
 if(/-(book|progress)$/.test(x.cursor)){
  const name=String(q.draft[`learn:${key}:name`]||'').trim(),volume=String(q.draft[`learn:${key}:volume`]||'').trim();
  if(!name){if(volume||String(q.draft[`learn:${key}:range`]||'').trim())throw Error('교재·과정 이름도 함께 적어 주세요.');if(!trackCourses(s,key).length)s.wizard.axisStatus[key]='unknown';return afterTrack(s,key);}
  if(key==='thinking'&&x.academyTouched){x.choices.thinking='both';s.wizard.thinkingExperience='both';}
  if(!x.pendingTracks.includes(key))x.pendingTracks.push(key);
  return afterTrack(s,key);
 }
 throw Error('질문 흐름을 다시 확인해 주세요.');
}
export function deferScene(s,value){const x=ensureScene(s),key=x.cursor.split('-')[0];if(!x.directBook||!x.cursor.endsWith('-book')||!['unknown','not_started'].includes(value))throw Error('입력 장면을 다시 확인해 주세요.');x.cursor=`${key}-kind`;return chooseScene(s,value);}
export function progressScene(s){const x=ensureScene(s);if(!x.cursor.endsWith('-book'))return;return move(s,x.cursor.replace('-book','-progress'));}
export function academyBookScene(s){const x=ensureScene(s);x.choices.thinking='both';s.wizard.thinkingExperience='both';x.academyTouched=!!s.wizard.quick.draft['academy:institution'];return move(s,'thinking-book');}
export function markSceneBook(s){const q=s.wizard.quick,x=ensureScene(s),key=x.cursor.split('-')[0];if(!x.cursor.endsWith('-book'))throw Error('교재 입력을 먼저 확인해 주세요.');if(!String(q.draft[`learn:${key}:name`]||'').trim())throw Error('지금 교재 이름을 적은 뒤 다른 교재를 더할 수 있어요.');if(!x.pendingTracks.includes(key))x.pendingTracks.push(key);return key;}
export function anotherBookScene(s,key){const q=s.wizard.quick,x=ensureScene(s);delete q.courseIds[key];if(q.draftCourseSnapshots)delete q.draftCourseSnapshots[key];for(const field of ['name','volume','range','completion','completionInput'])q.draft[`learn:${key}:${field}`]=field==='completionInput'?'unentered':field==='completion'?'unknown':'';if(x.pickerModes)for(const field of ['name','volume'])delete x.pickerModes[`learn:${key}:${field}`];x.cursor=`${key}-book`;x.direction='forward';x.newBook=true;}
export function sceneScreen(s){
 const q=s.wizard.quick,x=ensureScene(s),cursor=x.cursor,key=cursor.split('-')[0],prefix=`learn:${key}:`;
 if(x.version===2)return tutorialLearningScreen(s);
 const button=(value,label)=>`<button type="button" class="scene-option" data-scene-answer="${value}"><span>${label}</span><span aria-hidden="true">›</span></button>`;
 let title='',say='',html='',next='다음',hideNext=false,count=1;
 if(cursor==='tracks'){
  title='어떤 공부를 더 알려주실까요?';say='바꾸고 싶은 내용만 골라 주세요.';
  html=`<div class="scene-options">${keys.map(k=>button(k,names[k])).join('')}</div>`;hideNext=true;
 }else if(cursor.endsWith('-kind')){
  title=`${names[key]}${['application','depth'].includes(key)?'는':'은'} 어떻게 공부하고 있나요?`;say=key==='thinking'?'학원과 별도 교재를 함께 기록할 수 있어요.':'아직 하지 않았거나 잘 몰라도 괜찮아요.';
  html=`<div class="scene-options">${key==='thinking'?button('academy','학원에서 공부해요'):''}${button('book','교재로 공부해요')}${key==='thinking'?button('both','학원과 교재를 함께 해요'):''}${button('not_started','아직 따로 안 해요')}${button('unknown','잘 모르겠어요')}</div>`;hideNext=true;
 }else if(cursor==='thinking-academy'){
  title='사고력 학원에 다닌 경험이 있나요?';say='학원을 고른 뒤 기억나는 반이나 레벨을 선택해 주세요.';
  const institution=q.draft['academy:institution']||'';
  html=select('academy:institution','다녔던 학원',institution,[['','선택하지 않음'],...academyNames.map(n=>[n,n]),['other','그 외']],'data-scene-refresh');
  if(institution){count=institution==='other'||academyLevelOptions(institution).ask?3:2;html+=institution==='other'?field('academy:name','학원 이름',q.draft['academy:name'],'placeholder="다녔던 학원 이름"'):academyLevelMarkup(institution,q.draft['academy:level']||'');html+=academyTimingMarkup(q.draft['academy:timing']||'');}
  html+='<p class="scene-note">학원 경험은 학습 기록입니다. 등록·합격이나 교과 진도로 판단하지 않아요.</p>';
  if(x.choices.thinking==='both')next='별도 교재 알려주기';
  else html+='<button type="button" class="scene-text-action" data-scene-academy-book>별도 사고력 교재도 함께 기록</button>';
 }else if(cursor.endsWith('-book')){
  count=2;title=key==='thinking'?x.choices.thinking==='both'?'별도로 하는 사고력 교재는 무엇인가요?':'어떤 사고력 교재·과정을 했나요?':`지금 하는 ${names[key]} 교재는 무엇인가요?`;
  say=key==='application'?'기본·응용 교재부터 알려주세요. 심화는 따로 더할 수 있어요.':key==='depth'?'따로 하는 심화 교재를 알려주세요. 교과와 범위가 달라도 괜찮아요.':'마지막으로 했거나 지금 하는 교재부터 알려주세요.';
  const examples=key==='thinking'?['킨더팩토','키즈팩토','초등팩토','PRE 1031','필즈 베이직','1031 입문','1031 초급']:key==='arithmetic'?['소마셈','기적의 계산법','더클셈']:key==='depth'?['최상위 S 수학','최상위 수학']:['디딤돌 기본+응용','디딤돌 응용','쎈수학','쎈 중등 수학'];
  const scope=key==='thinking'?['과정·단계·레벨·권','예: 초급, A단계, 2권']:key==='arithmetic'?['단계·권','예: P단계, 3권']:['교재 범위','예: 초등 2-1, 중등 1-1'];
  const bookNames=[...examples,...trackCourses(s,key).map(c=>c.course)];
  html=picker(s,prefix+'name',key==='thinking'?'교재·과정 이름':'교재 이름',bookNames,'교재 이름')+(['application','depth'].includes(key)?picker(s,prefix+'volume',scope[0],schoolRanges,scope[1]):field(prefix+'volume',scope[0],q.draft[prefix+'volume'],`placeholder="${scope[1]}"`))+`<button type="button" class="scene-text-action" data-scene-progress>진행 상태도 남기기 · 선택</button>`;
  html+=`<p class="scene-note" data-empty-book-note>${trackCourses(s,key).length?'비워도 기존 기록은 지워지지 않아요.':'교재·범위를 비우면 ‘아직 입력하지 않음’으로 넘어가요.'}</p>`;
  if(x.directBook)html+='<details class="scene-preserved"><summary>지금은 모르거나 따로 안 했다면</summary><div class="scene-result-buttons"><button type="button" data-scene-defer="unknown">잘 모르겠어요</button><button type="button" data-scene-defer="not_started">아직 따로 안 해요</button></div></details>';
 const saved=s.courses.find(c=>c.id===q.courseIds[key]),savedLevel=saved?parseCourseScope(saved).level:'unknown',levelLabel={elementary:'초등',middle:'중등',high:'고등'}[savedLevel];
  if(['application','depth'].includes(key)&&levelLabel)html+=`<p class="scene-note" data-saved-course-level="${savedLevel}">저장된 과정은 ${levelLabel}이에요. 바꾸려면 범위를 골라 주세요. 목록에 없으면 직접 입력할 수 있어요.</p>`;
  const others=trackCourses(s,key).filter(c=>c.id!==q.courseIds[key]);
  if(others.length)html+=`<details class="scene-preserved"><summary>함께 기록한 교재 ${others.length}개</summary>${others.map(c=>`<p>${esc(c.course)} · ${esc(scopeLabel(c))}</p>`).join('')}</details>`;
  html+=`<details class="scene-preserved"><summary>교재를 여러 권 기록하려면</summary><button type="button" data-quick-add="${key}">다른 교재 추가</button></details>`;
 }else if(cursor.endsWith('-progress')){
  count=2;title='어디까지 공부했나요?';say='진행 중과 완료를 나누어 기록할게요.';next='이 기록으로 다음';
  html=select(prefix+'completion','진행 상태',q.draft[prefix+'completionInput']==='unentered'||(!q.draft[prefix+'completionInput']&&q.draft[prefix+'completion']==='unknown')?'':q.draft[prefix+'completion']||'',[['','선택하지 않음'],['unknown','진행 상태 모름'],['in_progress','진행 중'],['reported_done','완료'],['reviewed_done','범위 확인 완료'],['not_started','미시작']])+field(prefix+'range','마지막 단원·진행량',q.draft[prefix+'range'],'placeholder="예: 절반, 48쪽, 3단원"');
 }
 return {title,say,html:`<section class="scene-intake" data-learning-scene="${cursor}" data-question-count="${count}" data-direction="${x.direction}">${html}</section>`,next,hideNext};
}

export function extraLearningMarkup(s){
 return `<details class="scene-result-add"><summary>교과·심화도 공부했다면 추가하기</summary><div class="scene-result-buttons"><button type="button" data-scene-open="application">교과도 했어요</button><button type="button" data-scene-open="depth">심화도 했어요</button></div></details>`;
}
