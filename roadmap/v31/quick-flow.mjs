import {completionText} from './progress-display.mjs';
import {trackOf,trackCourses,addBook,saveBookDetails,koreaDate,scopeLabel,TRACKS} from './flow.mjs';
import {esc} from './intake.mjs';
import {parseCourseScope,compareBookPolicy} from './recommendation-policy.mjs';
import {personalBaselineMarkup} from './personal-baseline.mjs';
import {BOOK_TYPES,bookType} from './book-types.mjs';
import {collectScene,sceneScreen,extraLearningMarkup} from './scene-intake.mjs';
import {referenceDisplayUrls,sourcePositionNote} from './result-view.mjs';
import {schoolResultMarkup} from './school-result.mjs';
const choices=(name,value,items)=>`<fieldset class="choices"><legend class="sr-only">선택해 주세요</legend>${items.map(([v,t])=>`<label class="option"><input type="radio" name="${name}" value="${esc(v)}" ${value===v?'checked':''}><span>${esc(t)}</span></label>`).join('')}</fieldset>`;
const select=(name,label,value,items,extra='')=>`<label class="field"><span>${label}</span><select name="${name}" ${extra}>${items.map(([v,t])=>`<option value="${esc(v)}" ${String(value??'')===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
const input=(name,label,value='',extra='')=>`<label class="field"><span>${label}</span><input name="${name}" value="${esc(value)}" ${extra}></label>`;
export const TARGETS={soma:'소마를 고려해요',fields:'필즈를 고려해요',none:'학원 목표 없이 공부해요',undecided:'아직 정하지 않았어요'};
const TRACK_KEYS=['thinking','application','depth','arithmetic'];
const completionLabels={unknown:'진행 상태 모름',in_progress:'진행 중',reported_done:'완료',reviewed_done:'범위 확인 완료',not_started:'미시작'};
export function ensureQuick(s){
 if(!s.wizard.quick){s.wizard.quick={version:1,stage:/^(초[1-6]|중[1-3]|고[1-3])$/.test(s.profile.grade)?s.profile.grade:[4,5,6,7].includes(s.profile.reportedAge)?`p${s.profile.reportedAge}`:'',target:'',level:'L1',draft:{},courseIds:{},sourceSection:''};if(s.wizard.step!=='intro'){s.wizard.quick.resumeStep=s.wizard.step;s.wizard.step=s.wizard.quick.stage?'overview':'stage';}}
 const q=s.wizard.quick;q.draft??={};q.courseIds??={};return s;
}
export const preschool=s=>/^p[4-7]$/.test(s.wizard.quick.stage);
const earlyPrimary=s=>/^초[12]$/.test(s.wizard.quick.stage);
export function collectQuick(s,d,editedField=''){
 const q=s.wizard.quick,step=s.wizard.step;
 if(step==='stage'){
  q.stage=String(d.get('stage')||'');
  if(/^p[4-7]$/.test(q.stage)){s.profile.reportedAge=Number(q.stage.slice(1));s.profile.grade='미취학';if(d.has('birthMonth'))s.profile.reportedBirthMonth=d.get('birthMonth')?Number(d.get('birthMonth')):null;}
  else if(/^(초[1-6]|중[1-3]|고[1-3])$/.test(q.stage)){s.profile.grade=q.stage;}
  s.profile.academicYear=koreaDate().slice(0,4);
 }
 if(step==='learning'){
  if(q.scene?.active)collectScene(s,d,editedField);
  else for(const [key,value] of d.entries())if(key.startsWith('learn:')||key.startsWith('academy:'))q.draft[key]=String(value);
  if(d.has('quickCurriculumStatus')&&!trackCourses(s,'application').length&&!String(q.draft['learn:application:name']||'').trim()){
   const value=d.get('quickCurriculumStatus');
   if(['unknown','not_started'].includes(value)){s.wizard.axisStatus??={};s.wizard.axisStatus.application=value;}
  }
 }
 if(['target','overview'].includes(step)&&d.has('target'))q.target=d.get('target');
 if(['position-quick','overview','goals'].includes(step)){
  if(d.has('learningDirection'))q.learningDirection=d.get('learningDirection');
  for(const [name,values] of Object.entries({depthStyle:['careful','compact','unknown'],drillNeed:['yes','no','unknown'],supportTime:['none','brief','available','unknown'],independentWork:['alone','together','unknown']}))if(d.has(name)&&values.includes(d.get(name)))q[name]=d.get(name);
 }
 if(step==='overview'){q.monthlyLanes??={};for(const [name,value] of d.entries())if(name.startsWith('baselineLane:'))q.monthlyLanes[name.slice(13)]=String(value);if(d.has('referenceLevel'))q.level=d.get('referenceLevel');if(d.has('sourceSection'))q.sourceSection=d.get('sourceSection');if(d.has('personalityVersion'))q.personalityVersion=d.get('personalityVersion');}
}
function editedCourseLevel(c,name,volume){
 if(c?.course===name&&c.volume===volume)return c.level;
 const previous=c?.course===name?parseCourseScope(c):null;
 const known=level=>['elementary','middle','high'].includes(level);
 const inherited=previous&&!previous.ambiguous?(known(previous.level)?previous.level:c.level):undefined;
 const scope=parseCourseScope({course:name,volume,level:inherited});
 // A new explicit school-level label takes precedence over the saved level.
 // A bare range edit must keep the same book's level, never the child's grade.
 if(previous?.ambiguous&&scope.source!=='recorded_scope')throw Error('기존 기록의 과정 구분이 섞여 있어요. 중등 1-2처럼 과정도 함께 적어주세요.');
 if(scope.source==='missing'&&known(inherited))return inherited;
 return scope.level;
}
export function commitLearning(s,{sceneOnly=false}={}){
 const q=s.wizard.quick;
 for(const key of sceneOnly?(q.scene?.pendingTracks||[]):TRACK_KEYS){
  const name=String(q.draft[`learn:${key}:name`]||'').trim(),volume=String(q.draft[`learn:${key}:volume`]||'').trim(),completion=q.draft[`learn:${key}:completion`]||'unknown',range=q.draft[`learn:${key}:range`]||'';
  if(!name){if(volume||range)throw Error(`${TRACKS[key].label}의 교재 이름도 함께 남겨 주세요.`);continue;}
  let c=s.courses.find(c=>c.id===q.courseIds[key]);
  const level=editedCourseLevel(c,name,volume),existing=!!c;
  if(!c){c=addBook(s,key,name);q.courseIds[key]=c.id;}else c.course=name;
  if(q.draft[`learn:${key}:completionInput`])c.completionInput=q.draft[`learn:${key}:completionInput`];else if(!existing)c.completionInput=completion==='unknown'?'unentered':'reported';
  s.wizard.pendingCourseId=c.id;saveBookDetails(s,{volume,range,completion,level});syncQuickCourseDraft(s,c.id);s.wizard.pendingCourseId='';
 }
 const institution=q.draft['academy:institution'];
 if(institution&&(!sceneOnly||q.scene?.academyTouched)){
  const name=institution==='other'?q.draft['academy:name']?.trim():institution;if(!name)throw Error('그 외 학원 이름을 적어 주세요.');
  const old=s.wizard.academies.find(a=>a.id===(q.academyId||'quick-academy')),existing=old?.institution===name?old:s.wizard.academies.find(a=>a.institution===name);
  const a={...(existing||{}),id:existing?.id||(old?'quick-academy-'+crypto.randomUUID():'quick-academy'),institution:name,level:q.draft['academy:level']||'',status:existing?.status||'unknown'},i=s.wizard.academies.findIndex(x=>x.id===a.id);
  if(i<0)s.wizard.academies.push(a);else s.wizard.academies[i]=a;q.academyId=a.id;
 }
 if(sceneOnly&&q.scene){q.scene.pendingTracks=[];q.scene.academyTouched=false;}
}
const quickCourseFields=c=>({name:c.course||'',volume:c.volume||'',range:c.range||'',completion:c.completion||'unknown',completionInput:c.completionInput||''});
const quickCourseFingerprint=c=>JSON.stringify(quickCourseFields(c));
function compatibleCourseFingerprint(value){
 try{const fields=JSON.parse(value);if(fields&&typeof fields==='object'&&!Array.isArray(fields)&&!Object.hasOwn(fields,'completionInput'))return JSON.stringify({...fields,completionInput:''});}catch{}
 return value;
}
export function syncQuickCourseDraft(s,cid){
 const c=s.courses.find(x=>x.id===cid);if(!c)return;
 const key=trackOf(c),q=s.wizard.quick;
 if(!TRACK_KEYS.includes(key)||!q)return;
 if(q.courseIds[key]&&q.courseIds[key]!==cid)return;
 if(!q.courseIds[key]&&trackCourses(s,key).at(-1)?.id!==cid)return;
 q.courseIds[key]=cid;q.draftCourseSnapshots??={};
 for(const [name,value] of Object.entries(quickCourseFields(c)))q.draft[`learn:${key}:${name}`]=value;
 q.draftCourseSnapshots[key]=quickCourseFingerprint(c);
}
function seedDraft(s,key){
 const q=s.wizard.quick,c=s.courses.find(c=>c.id===q.courseIds[key])||trackCourses(s,key).at(-1);
 if(!c)return;
 const previous=compatibleCourseFingerprint(q.draftCourseSnapshots?.[key]),current=quickCourseFingerprint(c);
 if(q.draft[`learn:${key}:name`]===undefined||(previous!==undefined&&previous!==current))syncQuickCourseDraft(s,c.id);
 else if(previous===undefined&&JSON.stringify(Object.fromEntries(Object.keys(quickCourseFields(c)).map(k=>[k,q.draft[`learn:${key}:${k}`]|| (k==='completion'?'unknown':'')])))===current){q.draftCourseSnapshots??={};q.draftCourseSnapshots[key]=current;}
}
const flowLabels={current:'지금 흐름 유지',faster:'선행을 더 빠르게',consolidate:'지금 범위 다지기',deepen:'심화를 더해 깊게'};
const directionDescriptions={current:'지금 속도 그대로',faster:'다음 범위를 앞당겨',consolidate:'지금 범위를 더 탄탄히',deepen:'같은 범위를 더 깊게'};
function directionChoices(value){
 return `<fieldset class="choices direction-choices"><legend class="sr-only">앞으로의 학습 흐름</legend>${[['current','유지'],['faster','빠르게'],['consolidate','다지기'],['deepen','심화']].map(([v,t])=>`<label class="option"><input type="radio" name="learningDirection" value="${v}" ${value===v?'checked':''}><span class="direction-choice-copy"><strong>${t}</strong><small>${directionDescriptions[v]}</small></span></label>`).join('')}</fieldset>`;
}
function recommendationDetails(s){return `<details class="ux-recommendation"><summary>교재 추천과 이유 자세히 보기</summary>${recommendationMarkup(s)}</details>`;}

const normalized=t=>String(t||'').replace(/\s+/g,'').toLowerCase();
export function findBlock(c,model){
 const track=trackOf(c),key={thinking:'thinking1',application:'school',arithmetic:'calc'}[track];if(!key||!['in_progress','reported_done','reviewed_done'].includes(c.completion))return null;
 const n=normalized(c.course),scope=normalized(c.volume);
 let token='';
 if(track==='application'){
  if(n==='디딤돌기본+응용'&&/^[1-3]-[12]$/.test(scope))token=scope+'디딤돌';
  else if(n==='최상위수학'&&/^[23]-[12]$/.test(scope))return null; // 원표는 학년 전체 묶음. 학기 진도로 환산하지 않음.
 }else if(track==='arithmetic'){token=n;if(n==='기적의계산법'&&/^\d+권?$/.test(scope))token+=scope.replace(/권$/,'')+'권';}
 else {token=({'초등팩토':'초등팩토1','pre1031기본':'초등팩토1','pre1031심화':'필즈베이직','1031초급':'프리미어학습집중'})[n]||n;if(n==='pre1031')return null;}
 if(!token)return null;
 const block=model.rows[key].find(b=>normalized(b.label).includes(token));return block?{key,block}:null;
}
export function compareCourses(s,data){
 const model=data.models.find(m=>m.id===s.wizard.quick.level)||data.models[1];
 return s.courses.filter(c=>TRACK_KEYS.includes(trackOf(c))&&c.completion!=='not_started').map(c=>({course:c,match:findBlock(c,model)}));
}
function learningVolume(c){
 const value=String(c.volume||''),track=trackOf(c);
 const curriculum=['application','depth'].includes(track)&&/^(?:(?:초등|중등|고등)\s*)?[1-6]-[12]$/.test(value);
 return curriculum?`<span class="learning-range-token">${esc(value)}</span>`:esc(value);
}
function learningSummary(s,{compact=false}={}){
 const order=earlyPrimary(s)||preschool(s)?['thinking','arithmetic','application','depth']:TRACK_KEYS;
 const visible=compact?order.filter(key=>['thinking','arithmetic'].includes(key)||(key==='application'&&!earlyPrimary(s)&&!preschool(s))||trackCourses(s,key).length||s.wizard.axisStatus?.[key]==='not_started'):order;
 return '<div class="learning-summary'+(compact?' is-compact':'')+'"'+(compact?' style="--compact-columns:'+Math.min(visible.length,3)+'"':'')+'>'+visible.map(key=>{
  const cs=trackCourses(s,key),academies=key==='thinking'?s.wizard.academies:[];
  const courses=cs.map(c=>{const type=bookType(c);return '<strong>'+esc(c.course)+' '+learningVolume(c)+'</strong><span>'+esc(completionText(c))+(c.range?' · '+esc(c.range):'')+'</span>'+(!compact&&type?'<small class="book-type">'+esc(type.type)+'</small>':'');}).join('');
  const experience=academies.map(a=>'<strong>'+esc(a.institution)+(a.level?' · '+esc(a.level):'')+'</strong><span>학원 경험 · 교과 진도와 별도</span>').join('');
  const answer=s.wizard.quick.scene?.choices?.[key];
  const empty=s.wizard.axisStatus?.[key]==='not_started'?'아직 따로 하지 않았어요':answer==='unknown'?'잘 모르겠다고 답했어요':'아직 입력하지 않았어요';
  return '<section data-summary-track="'+key+'"><h2>'+TRACKS[key].label+'</h2>'+(courses+experience||'<span>'+empty+'</span>')+'</section>';
 }).join('')+'</div>';
}
export function directionRecommendation(s){return compareBookPolicy(s);}
function recommendationOptions(s){
 const q=s.wizard.quick;
 return `<details class="recommendation-options"><summary>교재 비교 조건 더하기 · 선택</summary><p class="note">필요한 것만 골라 주세요. 관리 시간과 혼자 푸는 정도는 능력 판정이 아니라 학습량을 정할 때 함께 살펴봐요.</p><div class="learn-fields">${select('depthStyle','심화 운영 방식',q.depthStyle||'unknown',[['unknown','아직 정하지 않았어요'],['careful','유형별로 꼼꼼하게'],['compact','분량을 고려해 조금 빠르게']])}${select('drillNeed','많은 문제 드릴이 필요한가요?',q.drillNeed||'unknown',[['unknown','아직 확인하지 않았어요'],['yes','유형·응용 문제를 많이 연습해야 해요'],['no','지금은 많이 추가할 필요가 없어요']])}${select('supportTime','집에서 도와줄 시간',q.supportTime||'unknown',[['unknown','아직 정하지 않았어요'],['none','함께할 시간이 거의 없어요'],['brief','짧게 확인할 수 있어요'],['available','함께 꼼꼼히 볼 수 있어요']])}${select('independentWork','현재 교재를 푸는 모습',q.independentWork||'unknown',[['unknown','아직 확인하지 않았어요'],['alone','혼자 풀고 설명할 수 있어요'],['together','도움을 받으며 풀어요']])}</div></details>`;
}
function recommendationMarkup(s){
 const r=directionRecommendation(s),ids=new Set([...r.bookKeys,...s.courses.map(c=>bookType(c)?.id)].filter(Boolean)),types=BOOK_TYPES.books.filter(b=>ids.has(b.id));
 return `<aside class="direction-advice" aria-live="polite"><strong>${esc(r.title)}</strong><p>${esc(r.text)}</p>${r.candidates.length?`<ul class="recommendation-candidates">${r.candidates.map(c=>`<li><strong>${esc(c.title)}</strong><span>${esc(c.scope.label)}${c.courseId?' · '+esc(s.courses.find(x=>x.id===c.courseId)?.course||''):''}</span><p>${esc(c.text)}</p>${c.confirmation.map(t=>`<small>${esc(t)}</small>`).join('')}</li>`).join('')}</ul>`:''}${r.questions.map(t=>`<p class="note">${esc(t)}</p>`).join('')}<small>교재 비교 제안 · 풀이를 확인한 뒤 선택해요.</small></aside>${recommendationOptions(s)}${types.length?`<details class="book-information"><summary>교재 특징과 출처 보기</summary>${types.map(b=>`<section><h3>${esc(b.name)}</h3><h4>독쌤 활용 기준</h4><p>${esc(b.type)} · ${esc(b.policy)}</p><h4>출판사 공식 구성</h4><p>${b.facts.map(esc).join(' · ')}</p><p>${esc(b.description)}</p><p class="note">확인한 판본 · ${esc(b.referenceEdition)}</p>${b.sources.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a> <small>${esc(source.year)}</small>`).join('<br>')}${b.id==='ssen'?'<p class="note">초등 현재판의 세부 구성은 확인 중이며, 2019 구성 안내는 구조 참고입니다.</p>':''}${b.id==='ssen_middle'?'<p class="note">공식 구성은 중등 1-1(2026) 소개에서 확인한 내용입니다. 초등 쎈의 현재판 구성과는 따로 살펴봐요.</p>':''}</section>`).join('')}<p class="note">활용 기준은 사용자 교재 운용 정정, 공식 구성은 위 출판사 자료에 따른 설명입니다. 권별 분량·난도나 판매순위를 수치로 비교한 결과는 아닙니다.</p></details>`:''}`;
}
function monthText(data,n){const c=data.columns[n];return c?`${c.age}세 ${c.month}월`:'';}
function compactLabel(b){if(b.end-b.start>=2)return b.label;const step=/필즈 STEP (\d+)/.exec(b.label);if(step)return `STEP ${step[1]}`;const calc=/기적의 계산법 (\d+권)/.exec(b.label);if(calc)return calc[1];if(/^[23]학년 최상위 수학/.test(b.label))return b.label.slice(0,3);return b.label;}
function ageNow(s,data){if(!preschool(s))return null;const month=Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',month:'numeric'}).format(new Date()));const raw=(s.profile.reportedAge-5)*12+month-1-4;return {col:Math.max(0,Math.min(26,raw)),outside:raw<0||raw>26};}
function sourceChart(s,data){
 const q=s.wizard.quick,model=data.models.find(m=>m.id===q.level)||data.models[1],now=ageNow(s,data),matches=compareCourses(s,data),axis={school:'교과',thinking1:'사고력',calc:'연산',home:'가정학습',thinking2:q.target==='fields'?'필즈 대비':'소마 대비'};
 const rows=['school','thinking1','calc','home',...(['soma','fields'].includes(q.target)?['thinking2']:[])];
 const header=`<div class="chart-label chart-head">표준 과정</div><div class="chart-months">${data.columns.map((c,i)=>`<span><b>${i===0||data.columns[i-1].age!==c.age?c.age+'세':''}</b>${c.month}월</span>`).join('')}</div>`;
 return `${now&&!now.outside?'<div class="chart-view-controls"><button type="button" data-show-current-month>지금 나이의 달 보기</button></div>':''}<div class="chart-scroll" data-chart-context="${esc(data.columns.map(c=>c.age+':'+c.month).join('|'))}" tabindex="0" role="region" aria-label="기존 유아 월별 표준 로드맵"><div class="source-chart">${header}${rows.map(key=>{
  const bs=model.rows[key].filter(b=>key==='thinking2'?q.target==='fields'?b.label.startsWith('필즈'):!b.label.startsWith('필즈'):key==='thinking1'&&q.target==='none'?!/프리미어 학습 집중/.test(b.label):true);
  const current=matches.filter(m=>m.match?.key===key);
  return `<div class="chart-label">${axis[key]}</div><div class="chart-track">${bs.map(b=>`<button type="button" class="chart-block axis-${key}" data-source-block="${key}:${model.rows[key].indexOf(b)}" style="grid-column:${b.start+1}/${b.end+2}" title="${esc(b.label)} · ${monthText(data,b.start)}~${monthText(data,b.end)}" aria-label="${esc(b.label)} · ${monthText(data,b.start)}~${monthText(data,b.end)}"><span class="chart-block-name">${esc(compactLabel(b))}</span></button>`).join('')}${current.map(m=>{const n=['reported_done','reviewed_done'].includes(m.course.completion)?m.match.block.end:(m.match.block.start+m.match.block.end)/2;return `<span class="progress-marker" style="left:${(n+.5)/27*100}%" title="${esc(m.course.course)} · ${esc(completionLabels[m.course.completion])}" aria-label="입력한 ${esc(m.course.course)} 위치">◆</span>`;}).join('')}${now&&!now.outside?`<span class="today-marker" style="left:${(now.col+.5)/27*100}%" aria-label="지금 나이의 ${monthText(data,now.col)}"></span>`:''}</div>`;
 }).join('')}</div></div><p class="chart-key">◆ 입력한 교재 위치 <span class="today-key"></span> 지금 나이의 달 <span>표를 누르면 과정 이름과 기간을 볼 수 있어요.</span></p><div id="source-inspector" class="source-inspector" role="status" aria-live="polite"><span>모바일에서는 표를 옆으로 넘겨 볼 수 있어요.</span></div>${now?.outside?'<p class="note">현재 나이는 이 표의 기간 밖입니다. 표의 시작·끝을 실제 현재 위치로 바꾸지 않았어요.</p>':''}`;
}
export function quickScreen(s,data){
 const step=s.wizard.step,q=s.wizard.quick;
 if(step==='intro')return {title:'우리 아이의 배움, 어디서 이어갈까요?',say:'안녕하세요, DOCSSAM입니다.',html:'<p class="intro-copy">많은 학생이 진행한 표준 커리큘럼과 비교하며, 우리 아이의 현재 위치와 앞으로의 방향을 살펴보세요.</p><p class="intro-note">개인별 진단에 앞서 학습 기록으로 보는 가이드입니다.</p><details data-ux-import><summary>보관한 로드맵으로 이어가기</summary><label class="field"><span>이전 입력 사본 (JSON)</span><input type="file" data-import-state accept="application/json,.json"></label><p class="note">선택한 사본으로 이어가며, 현재 저장 기록은 변경 이력에 보존합니다.</p></details>',next:'우리 아이 로드맵 시작하기'};
 if(step==='stage')return {title:'우리 아이는 지금 어디에 해당하나요?',say:'유아는 나이, 학교에 다니면 학년을 골라 주세요.',html:select('stage','나이 또는 학년',q.stage,[['','선택해 주세요'],...Array.from({length:4},(_,i)=>[`p${i+4}`,`유아 ${i+4}세`]),...Array.from({length:6},(_,i)=>[`초${i+1}`,`초등 ${i+1}학년`]),...Array.from({length:3},(_,i)=>[`중${i+1}`,`중학교 ${i+1}학년`]),...Array.from({length:3},(_,i)=>[`고${i+1}`,`고등학교 ${i+1}학년`])],'required')+(/^p[4-6]$/.test(q.stage)?select('birthMonth','몇 월생인가요?',s.profile.reportedBirthMonth,[['','모름'],...Array.from({length:12},(_,i)=>[i+1,`${i+1}월`])]):''),next:'현재 공부 알려주기'};
 if(step==='learning'){for(const key of TRACK_KEYS)seedDraft(s,key);return sceneScreen(s);}
 if(step==='position-quick'){
  const app=trackCourses(s,'application').at(-1),scope=/^([1-6])-([12])$/.exec(app?.volume||''),grade=/^초([1-6])$/.exec(s.profile.grade||'');
  const recorded=TRACK_KEYS.filter(key=>trackCourses(s,key).length).map(key=>({thinking:'사고력',application:'교과',arithmetic:'연산',depth:'심화'})[key]);
  const recordedAcademies=s.wizard.academies.map(a=>a.institution).filter(Boolean);
  const learningRecorded=recorded.length?`지금 입력한 ${recorded.join('·')} 학습을 정리했어요.`:'아는 학습 경험부터 남겨도 괜찮아요.';
  const academyRecorded=recordedAcademies.length?` ${recordedAcademies.join('·')} 학원 경험도 학습 진도와 별도로 기록했어요.`:'';
  const status=(!app?learningRecorded+(s.wizard.axisStatus?.application==='not_started'?' 교과는 아직 따로 하지 않은 것으로 기록했어요.':' 교과는 따로 공부한 내용이 있을 때 추가하면 돼요.'):grade&&scope?Number(scope[1])>Number(grade[1])?`학교는 ${s.profile.grade}, 교과 교재는 ${app.volume} 범위입니다. 학교 학년보다 앞선 범위를 공부하고 있군요.`:Number(scope[1])===Number(grade[1])?`학교 학년과 같은 학년 범위의 교과 교재를 공부하고 있어요.`:`학교는 ${s.profile.grade}, 현재 기록한 교과 교재는 ${app.volume}입니다. 복습인지 현재 학습인지 기록을 함께 살펴볼 수 있어요.`:learningRecorded)+academyRecorded;
  const next=preschool(s)?'학원 방향도 살펴보기':'이 방향으로 로드맵 보기';
  return {title:'지금 공부는 이렇게 기록했어요',say:status,html:learningSummary(s,{compact:true})+'<h2 class="position-direction-title">앞으로의 학습 방향</h2>'+directionChoices(q.learningDirection||'current')+`<div class="position-result-action"><button type="submit" class="primary">${next}</button></div><p class="scene-note">학습 기록입니다. 이해도는 진단으로 확인해요.</p>`+extraLearningMarkup(s),next,hideNext:true};
 }
 if(step==='target')return {title:'생각하고 있는 학원이 있나요?',say:'학원 목표가 없어도 우리 아이의 공부는 이어집니다.',html:choices('target',q.target,Object.entries(TARGETS)),next:'로드맵 보기'};
 if(step==='overview'){
  const title=preschool(s)?`${s.profile.reportedAge}세, 지금부터 이어갈 길`: `${esc(s.profile.grade)}에서 이어갈 학습 로드맵`,matches=compareCourses(s,data),model=data.models.find(m=>m.id===q.level)||data.models[1];
  const position=learningSummary(s);
  const next=matches.map(({course:c,match})=>{
   if(!match){const note=sourcePositionNote(c,{sourceCandidate:!!findBlock({...c,completion:'in_progress'},model)});return `<li data-source-position="${note.position}"><strong>${esc(c.course)} ${learningVolume(c)}</strong><span>${esc(note.text)}</span></li>`;}
   const blocks=model.rows[match.key],i=blocks.indexOf(match.block),after=blocks.slice(i+1,i+3).filter(b=>!(q.target==='none'&&/프리미어/.test(b.label)));
   return `<li data-source-position="matched"><strong>${esc(c.course)} ${learningVolume(c)}</strong><span>${after.length?'원표에서 이어지는 과정 · '+after.map(b=>esc(b.label)).join(' → '):'이 표의 다음 범위는 아래 확장 로드맵에서 살펴볼 수 있어요.'}</span></li>`;
  }).join('');
  const sections=[['S1','5~7세'],['S2','7세~초2'],['S3','초3~초6'],['S4','중1~중3']],urls=referenceDisplayUrls;
  const section=q.sourceSection||(/^중|^고/.test(s.profile.grade)?'S4':Number(s.profile.grade?.slice(1))>=3?'S3':'S2');
  const preschoolGuide='<details class="result-reading-guide"><summary>표준 기준과 현재 위치를 읽는 방법</summary><p>◆는 입력한 교재의 표준표 위치예요. 진행 중은 기존 방식대로 해당 과정의 중간, 완료는 끝에 표시합니다. 실제 학습한 단원이나 숙달을 판정한 결과는 아닙니다. 선택한 비교 기준의 기간은 원자료 그대로입니다.</p><p>소마·필즈 선택은 기관 대비 항목을 바꿉니다. 학원을 선택하지 않아도 교과·사고력·연산·가정학습의 기간은 그대로입니다.</p><p>표의 월축은 5세 5월~7세 7월입니다. 생월은 프로필에 기록하며 능력이나 학습 속도를 바꾸는 계산에 사용하지 않습니다.</p></details>';
  const sourceView=`<details class="school-source-view"><summary>표준 로드맵 전체 보기</summary><div class="result-heading">${select('sourceSection','살펴볼 구간',section,sections)}</div><p class="note">학교 학년보다 높은 과정도 다른 구간에서 볼 수 있어요. 원표는 별도 화면에서 크게 열어요.</p><a class="school-source-link" data-school-reference href="${urls[section]}" target="_blank" rel="noopener noreferrer">표를 넓게 보기 <span aria-hidden="true">↗</span></a></details>`;
  const view=preschool(s)?`<div class="result-heading"><div><p class="eyebrow">기존 표준과 비교하기</p><h2>앞으로 배우는 과정</h2></div>${select('referenceLevel','비교 기준',q.level,data.models.map(m=>[m.id,`${m.summary}`]))}</div>${choices('target',q.target,[['soma','소마 고려'],['fields','필즈 고려'],['none','목표 없음'],['undecided','미정']])}<p class="note">선택한 방향에 따라 아래 학원 대비 줄을 비교해요. 등록·합격이나 자동 진급을 뜻하지 않아요.</p>${sourceChart(s,data)}`:`${schoolResultMarkup(s,data,{section})}`;
  const extras=`${preschool(s)?preschoolGuide:sourceView}${preschool(s)&&next?`<details class="result-next-courses"><summary>현재 교재에서 다음으로</summary><ul class="next-courses">${next}</ul></details>`:''}<details class="result-current-records"><summary>입력한 학습 기록 확인</summary>${position}</details><section class="ux-direction-summary"><h2>선택한 학습 방향</h2><strong>${esc(flowLabels[q.learningDirection]||flowLabels.current)}</strong><span>${esc(directionDescriptions[q.learningDirection]||directionDescriptions.current)}</span></section><p class="lead-note">입력한 진도 비교입니다. 이해와 혼자 푸는 정도는 진단에서 따로 확인해요.</p>${recommendationDetails(s)}<details class="ux-planning-details"><summary>현재 교재에서 이어갈 과정 비교</summary>${personalBaselineMarkup(s,data)}</details><details class="ux-edit-details"><summary>학습 정보 수정하기</summary><div class="actions"><button type="button" data-quick-stage>나이·학년 수정</button><button type="button" data-quick-learning>교재 수정</button>${preschool(s)?'<button type="button" data-quick-target>학원 방향 비교</button>':''}</div></details><details class="ux-more-controls"><summary>목표·성향·시간 더 맞추기</summary><div class="refinement"><div class="actions"><button type="button" data-quick-detail="time">관리할 시간</button><button type="button" data-quick-detail="goals">응용·심화 운영 더 맞추기</button><button type="button" data-quick-detail="interests">황소·과학·영재원 등 목표</button></div><div class="personality-choice">${select('personalityVersion','성향검사 질문 묶음 (선택)',q.personalityVersion||'',[['','질문 묶음 선택'],['young','7~9세용'],['middle','10~12세용'],['high','13~15세용']])}<button type="button" data-quick-personality>성향검사 하기</button></div><a href="workspace.html?tab=plan" data-workspace>이전 기준·학습·진단 기록 <span aria-hidden="true">›</span></a></div><div data-ux-goals-slot></div></details><details class="original-reference"><summary>표준 과정과 근거</summary><div class="section-links">${sections.map(([key,label])=>`<a href="${urls[key]}" target="_blank" rel="noopener">${label} ↗</a>`).join('')}</div><p class="note">기관 일정은 원자료 기준 연도입니다. 현재 지원 조건은 공식 요강을 확인해 주세요.</p></details><div data-ai-slot></div>`;
  return {title:'우리 아이의 로드맵',say:'현재 기록에서, 다음 배움으로 이어가 볼게요.',html:`<div class="ux-overview-head"><p class="result-profile">${esc(q.stage.startsWith('p')?'유아 '+s.profile.reportedAge+'세':s.profile.grade)}${preschool(s)&&[4,5,6].includes(s.profile.reportedAge)&&s.profile.reportedBirthMonth?' · '+s.profile.reportedBirthMonth+'월생':''}${preschool(s)&&q.target?' · '+esc(TARGETS[q.target]):''}</p></div><section class="result-roadmap" data-result-roadmap>${view}</section><div class="result-actions ux-result-actions"><button type="button" class="primary" data-quick-save>이 로드맵 보관하기</button><button type="button" data-monthly-action="open">월별 계획 보기 <span aria-hidden="true">›</span></button></div><details class="result-more" data-result-more><summary>더 알아보기</summary><div class="result-more-body">${extras}</div></details>`,hideNext:true};
 }
 return null;
}
