/* 선택한 로드맵의 전체 총평과 인쇄 본문. 현재 답변·진도·완료 기록을 변경하지 않는다. */
(function(global){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=v=>Array.isArray(v)?v:[];
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
const hasText=v=>typeof v==='string'&&v.trim();
const finite=v=>typeof v==='number'&&Number.isFinite(v);
// Annotations are made from text tokens, so names and advice remain escaped.
function ink(value){
 const parts=String(value??'').split(/(참고 진도\(L\d+\)|프리미어 (?:대비|학습 집중)|약 \d+(?:\.\d+)?개월(?: 뒤)?|20\d{2}\.\d{2}(?: ~ 20\d{2}\.\d{2})?|남은 범위|같은 과정 속도)/g);
 return parts.map((part,i)=>i%2?(/^약 |^20\d{2}/.test(part)?'<u class="pr-ink-underline">'+esc(part)+'</u>':'<mark class="pr-ink-highlight">'+esc(part)+'</mark>'):esc(part)).join('');
}
const selectedLanguage=m=>m&&(m.row?.enabled===true||m.enabled===true);
const enabledScience=m=>m&&(m.state?.enabled===true||m.enabled===true);
const chosenGoal=g=>g?.detail&&g.goal&&g.goal!=='none';
const contextGrade=c=>c.fields?.internationalCalendar?'해외 학교 과정':c.grade==='pre'?(c.age?c.age+'세 · 유치':'유치'):Number(c.grade)>=10?'고'+(Number(c.grade)-9):Number(c.grade)>=7?'중'+(Number(c.grade)-6):Number(c.grade)>=1?'초'+Number(c.grade):'현재 학년 확인 전';
const unknown=v=>!hasText(v)||/확인 전|선택 전|잘 모르|미선택|경험 없음/.test(v);
function dateAt(c,offset=0){
 if(finite(c.now)&&global.PlannerTransition?.calendarAt)return global.PlannerTransition.calendarAt(c.now,offset,c.fields||{}).label;
 const y=Number(c.fields?.year),m=Number(c.fields?.mon);
 if(Number.isInteger(y)&&y>0&&Number.isInteger(m)&&m>=1&&m<=12){const n=y*12+m-1+Math.floor(offset);return Math.floor(n/12)+'년 '+(n%12+1)+'월';}
 return offset===0?'현재':offset+'개월 뒤';
}
function blockPeriod(c,b){
 if(b.startLabel||b.endLabel)return [b.startLabel,b.endLabel].filter(Boolean).join(' ~ ')||'범위를 확인한 뒤 연결';
 if(b.completed)return '이수했다고 선택한 범위';
 if(finite(b.start)&&finite(b.end)){const begin=dateAt(c,Math.floor(b.start)),end=dateAt(c,Math.max(Math.floor(b.start),Math.ceil(b.end)-1));return begin===end?begin:begin+' ~ '+end;}
 if(finite(b.start))return dateAt(c,Math.floor(b.start))+'부터';
 return b.sustained?'기존 공부와 꾸준히 병행':'앞 과정과 현재 이해를 확인한 뒤 연결';
}
function subjectName(id){return {school:'교과',thinking:'사고력',comp:'사고력',deep:'심화',calc:'연산',english:'영어',korean:'국어'}[id]||id;}
function frontAdvice(c){
 const pre=c.grade==='pre'&&!c.fields?.internationalCalendar,early=pre||[1,2].includes(Number(c.grade)),middle=Number(c.grade)>=7;
 const ordered=pre?['thinking','comp','school','deep','calc']:['school','thinking','comp','deep','calc'],key=id=>id==='comp'?'thinking':id;
 const selected=list(c.current).filter(x=>!unknown(x.text)&&!/하지 않|진행 안|쉬고 있|없음/.test(x.text)).sort((a,b)=>ordered.indexOf(a.id)-ordered.indexOf(b.id));
 const clean=t=>String(t||'').replace(/\s*진행\s*중\s*$/,'').trim(),amount=n=>String(Math.round(Math.abs(n)*2)/2),frequency=n=>global.PlannerTransition?.frequency?global.PlannerTransition.frequency(n):String(Math.round(n*100)/100),hasFinal=t=>/[가-힣]/.test(t.slice(-1))&&(t.charCodeAt(t.length-1)-0xac00)%28,topic=t=>t+(hasFinal(t)?'은':'는'),object=t=>t+(hasFinal(t)?'을':'를'),valid=t=>hasText(t)&&!/자료 없음|자료가 없|이 시기.*없|비교 자료|대응하는 과정 없음|확인 전/.test(t);
 const lane=id=>list(c.lanes).find(l=>key(l.id)===id),active=l=>list(l?.blocks).filter(b=>!b.completed&&(!finite(b.end)||b.end>0)),primaryLane=lane(pre?'thinking':'school')||list(c.lanes).find(l=>active(l).length),primary=active(primaryLane);
 const compactLabel=t=>String(t||'').replace(/(\d{4})년[^~→]*?(\d{1,2})월/g,(_,y,m)=>y+'.'+String(m).padStart(2,'0'));
 const compactAt=offset=>{const at=finite(c.now)&&global.PlannerTransition?.calendarAt?global.PlannerTransition.calendarAt(c.now,offset,c.fields||{}):null;if(at?.year&&at.month)return at.year+'.'+String(at.month).padStart(2,'0');return compactLabel(dateAt(c,offset));};
 const compactPeriod=b=>b.startLabel||b.endLabel?[b.startLabel,b.endLabel].filter(Boolean).map(compactLabel).join(' ~ '):finite(b.start)&&finite(b.end)?[compactAt(Math.floor(b.start)),compactAt(Math.max(Math.floor(b.start),Math.ceil(b.end)-1))].filter((v,i,a)=>i===0||v!==a[0]).join(' ~ '):compactLabel(blockPeriod(c,b));
 const blockText=b=>b.title+' ('+compactPeriod(b)+')',routeText=(bs,n=3)=>bs.slice(0,n).map(blockText).join(' → '),level=c.levelAssessment||{},demo=pre&&c.demoAssessment?.source==='original-demo-L0-L4'?c.demoAssessment:null;
 const lead=selected.length?'현재 공부는 '+selected.map(x=>x.label+' '+clean(x.text)).join(', ')+'입니다. ':'';
 const referenceRange=(meaning,label)=>meaning?.axes?.find(x=>x.label===label)?.text;
 const positions=list(level.axes).filter(x=>x.ready&&x.referenceId&&x.reference).map(x=>{const range=referenceRange(x.reference,x.label),meaning=valid(range)?range:x.reference.benchmarkLabel||x.reference.name;return valid(meaning)?topic(x.label)+' '+x.referenceId+' ('+meaning+')':null;}).filter(Boolean);
 let position=demo?.primary?'사고력은 ‘'+demo.primary+'’ 참고 흐름에 가장 가깝습니다.':positions.length?(level.scope||'현재 학년')+'의 같은 시기와 비교하면 '+positions.join(', ')+' 예시에 가깝습니다.':pre?'현재 사고력 범위에서 다음 교재로 이어가되, 교과와 연산은 각각 선택한 진도에서 병행합니다.':primary.length?'현재 선택한 '+topic(primaryLane.label)+' '+primary[0].title+'에서 이어집니다.':'현재 알려주신 공부를 출발점으로 두고, 다음 교재와 범위를 고르면 일정이 연결됩니다.';
 if(pre&&level.current){
  const current=level.current,range=referenceRange(current,'사고력'),meaning=current.benchmarkLabel||range;
  if(valid(meaning))position='유아 사고력 기준으로 보면, 현재와 가까운 기준은 ‘'+meaning+'’의 참고 진도('+current.id+')입니다.'+(valid(range)&&range!==meaning?' 같은 시기의 사고력 범위는 ‘'+range+'’입니다.':'');
 }
 let balance='',weak=null;
 if(demo){const axes=list(demo.axes).filter(x=>finite(x.shift)).sort((a,b)=>a.shift-b.shift);if(axes.length>1&&axes.at(-1).shift-axes[0].shift>2){weak=axes.at(-1);const delayed=axes.filter(x=>x.shift-axes[0].shift>2);balance=' '+axes[0].label+' 진도에 비해 '+delayed.map(x=>x.label+'의 같은 과정 진행 시점이 약 '+amount(x.shift-axes[0].shift)+'개월').join(', ')+' 늦습니다. '+(weak.position==='end'?'먼저 보완할 진도는 완료한 ‘'+weak.key+'’의 다음 범위입니다.':topic(weak.label)+' ‘'+weak.key+'’의 남은 범위를 먼저 보완해야 합니다.');}}
 const prose=[lead+position+balance];
 let comparison='';
 if(demo?.premier){
  const target=demo.premier.axes?.find(x=>x.id==='thinking'),actual=demo.axes?.find(x=>x.id==='thinking');
  if(target&&finite(target.gap)){
   comparison='프리미어 참고 흐름과 비교하면 현재 사고력 과정은 '+(target.gap>1?'약 '+amount(target.gap)+'개월 늦은 시점':target.gap< -1?'약 '+amount(target.gap)+'개월 앞선 시점':'비슷한 시점')+'입니다.';
   if(valid(target.expected))comparison+=' 이 시기에 다루는 범위는 ‘'+target.expected+'’입니다.';
   const missing=list(target.missing).map(clean).filter(Boolean);if(missing.length)comparison+=' 지금 남은 진도는 '+missing.map((t,i)=>i===0&&actual?.position!=='end'&&t.includes(actual?.key)?t+' 남은 범위':t).join(' → ')+'입니다.';
   else if(primary[1])comparison+=' 다음 연결은 '+blockText(primary[1])+'입니다.';
  }
 }
 if(!comparison&&level.current){
  const describe=r=>r.id+'의 ‘'+(r.pace?.course||referenceRange(r,pre?'사고력':'교과')||r.name)+'’'+(r.pace?' (한 과정 '+r.pace.months+'개월)':''),cur=level.current;
  comparison='현재 '+(pre?'사고력':'교과')+'와 가까운 참고 진도는 '+describe(cur)+'입니다.';
  const upper=list(level.next).slice(0,2).map(describe);
  if(upper.length)comparison+=' 바로 위 '+(upper.length===2?'두 ':'')+'예시는 '+upper.join(', ')+'입니다.';
 }
 if(level.current?.id==='L0'&&list(level.lower).length)comparison+=' 아래 두 단계도 함께 보면, '+list(level.lower).slice(0,2).map(r=>'‘'+(r.benchmarkLabel||r.name)+'’ 참고 진도('+r.id+')는 '+(r.pace?.course||referenceRange(r,pre?'사고력':'교과'))+(r.pace?' · 한 과정 '+r.pace.months+'개월':'')).join(' / ')+'입니다.';
 if(!comparison)comparison=primary.length?'앞으로의 '+primaryLane.label+' 일정은 '+routeText(primary)+'.':c.mode==='custom'?'맞춤 계획은 아직 고르지 않은 부분이 있습니다. 이어갈 교재·범위를 정한 뒤 남은 기간을 연결하겠습니다.':'다음 과정은 현재 교재와 남은 범위를 확인한 뒤 정하겠습니다.';
 prose.push(comparison);
 const schoolCurrent=selected.find(x=>x.id==='school'),schoolStage=list(level.axes).find(x=>x.id==='school')?.stage||schoolCurrent?.text.match(/(?:중[1-3]-[12]|[1-6]-[12]|공통수학[12])/)?.[0],ahead=!c.fields?.internationalCalendar&&schoolStage&&((pre&&/^[1-6]-/.test(schoolStage))||!pre&&((/^[1-6]-/.test(schoolStage)&&Number(schoolStage[0])>Number(c.grade))||(/^중/.test(schoolStage)&&Number(c.grade)<7)||(/^공통수학/.test(schoolStage)&&Number(c.grade)<10)));
 const high=/^공통수학/.test(schoolStage||''),requirements={giftedSchool:(high?'중등 대수·기하 심화의 빈틈 확인과 현재 고등 범위의 적용·서술':'중등 기본·활용 → 대수·기하 심화와 낯선 문제의 풀이·서술')+' → 수학 준비에 맞춘 과학 기본·탐구',scienceHigh:'중등 수학 기본·활용과 대수·기하 심화 → 학교 수학·과학의 서술·탐구 → 지원 시기의 탐구 설명과 면접',private:(high?'현재 공통수학의 개념·유형과 오답 정리':'중등 기본·준심화 → 공통수학1·2 개념·유형과 오답 정리')+' → 국어·영어·학교 과제를 함께 소화하는 공부',general:(high?'현재 고등 범위의 개념·유형과 취약 단원':'중등 개념·유형·준심화 → 공통수학1·2 기본·유형')+' → 학교 내신과 배운 범위의 학평 문제 적용'};
 const extra=c.extra,chasing=extra?.enabled===true&&extra?.adjusting===true&&extra?.allocation==='advance',catchInfo=chasing&&finite(extra.catch?.months)?extra.catch:null;
 const catchShort=catchInfo?(extra.within===false?'선택 범위 밖의 참고 일정으로는, ':'')+(extra.loadTitle||'선택한 추가 회차')+'를 서서히 늘릴 때 약 '+catchInfo.months.toFixed(1)+'개월 뒤'+(catchInfo.dateLabel?' ('+compactLabel(catchInfo.dateLabel)+')':'')+' '+catchInfo.target+' 참고 예시'+(catchInfo.course?'의 '+catchInfo.course:'의 범위')+'와 만납니다. '+(extra.within===false?'그 범위까지 공부를 이어가는 경우 ':'')+'합류 뒤에는 같은 과정 속도로 이어갑니다.':chasing?'선택한 '+(extra.loadTitle||'추가 회차')+'를 서서히 늘려도 비교하는 24개월 안의 합류 시점은 미정입니다. 목표 회차를 계속 높이는 계획으로 바꾸지는 않습니다.':'';
 const catchDetail=catchInfo?'목표 '+(extra.loadTitle||'선택한 회차')+'를 6개월에 걸쳐 늘립니다(2개월 50%·4개월 80%·6개월 100%). 증량을 적용해 공부하는 기간은 약 '+(finite(catchInfo.extraMonths)?catchInfo.extraMonths.toFixed(1):catchInfo.months.toFixed(1))+'개월입니다. 합류한 과정에서는 '+(finite(catchInfo.baselineSessions)&&finite(catchInfo.sessionHours)?'기본 주 '+catchInfo.baselineSessions+'회 × '+catchInfo.sessionHours+'시간':'해당 과정의 기본 회차')+(finite(catchInfo.maintenanceExtra)?catchInfo.maintenanceExtra>0?'에 평균 주 '+frequency(catchInfo.maintenanceExtra)+'회 추가를 유지합니다.':'로 이어가며 추격을 위한 추가 회차는 마칩니다.':'에 필요한 유지 회차를 다시 확인합니다.')+' 복습·심화·연산은 기존 배분을 유지합니다.'+(extra.within===false?' 현재 선택은 '+(extra.scope||'지금 고른 교재 범위')+'까지이며, 그 뒤의 교재·범위는 따로 정합니다.':''):catchShort;
 let direction='';
 if(chosenGoal(c.goal)){
  if(early)direction='선택하신 '+c.goal.detail.title+'는 부모님이 참고할 장기 목표로 두겠습니다. ';
  if(ahead&&['giftedSchool','scienceHigh'].includes(c.goal.goal))direction+=(pre?(c.age?c.age+'세':'유치'):c.gradeLabel||contextGrade(c))+'에 '+schoolStage+' 교과를 공부하는 현재 구성은 '+c.goal.detail.title+'를 검토할 수 있는 빠른 준비 진도입니다. ';
  else if(!early)direction='선택하신 '+c.goal.detail.title+'에서 지금 남은 준비를 보겠습니다. ';
  direction+='앞으로 확인할 과정은 '+(requirements[c.goal.goal]||c.goal.detail.math)+'입니다.';
 }else if(c.mode==='custom'&&!primary.length)direction='맞춤 계획은 아직 고르지 않은 부분이 있습니다. 현재 교재와 병행 공부를 유지하고, 선택한 범위까지의 일정부터 정하겠습니다.';
 else direction=primary.length?'현재 계획에서 먼저 이어갈 범위는 '+primary.slice(0,3).map(b=>b.title).join(' → ')+'입니다. 이 범위 뒤의 교재는 그때의 풀이와 실제 이수에 맞춰 정하겠습니다.':'현재 교재에서 이어갈 범위를 고른 뒤, 교과·사고력·심화·연산의 다음 일정을 각각 연결하겠습니다.';
 if(c.science)direction+=' 과학의 현재 범위는 ‘'+(c.scienceStage?.known?c.scienceStage.current.title:c.science.orderLabel||'선택한 기본 개념·탐구 과정')+'’입니다.';
 const english=list(c.languages).find(l=>l.id==='english');if(english)direction+=' 영어는 '+(!unknown(english.current)?'‘'+english.current+'’에서 ':'')+'다섯 영역을 같은 주에 병행합니다.';
 if(catchShort)direction+=' '+catchShort;
 prose.push(direction);
 const priorities=[{title:pre?'사고력 · 다음에 이어갈 교재':'교과 · 다음에 이어갈 교재',text:primary.length?routeText(primary):'이어갈 교재와 범위를 아직 고르지 않았습니다. 현재 공부에서 다음 선택을 정하면 날짜가 연결됩니다.',section:'math',sectionLabel:'교재·월별 과정'}];
 const companionIds=pre?['school','deep','calc']:['thinking','deep','calc'],companion=companionIds.flatMap(id=>{const l=lane(id),bs=active(l);return bs.length?[(l.label||subjectName(id))+' · '+routeText(bs,1)]:[];});
 const depthNote=c.independentDepth?'선택한 심화 범위를 별도로 이어갑니다. ':c.sequential?'교과 응용 다음 같은 학기 심화를 이어갑니다. ':'';
 const fix=weak?({school:'응용 문장제의 조건을 끝까지 읽고 식으로 연결하는 범위',thinking:'조건 해석·문장 읽기·규칙 찾기 유형',calc:'계산 정확도와 필산 정렬'})[weak.id]:null;
 priorities.push({title:weak?weak.label+' · 먼저 보완할 진도':c.independentDepth?'심화·연산 · 독립 진도로 병행':'함께 이어갈 사고력·심화·연산',text:(weak?'‘'+weak.key+'’에서 우선 보완할 내용은 '+fix+'입니다. ':'')+depthNote+companion.join(' / '),section:'math',sectionLabel:'교재·월별 과정'});
 const institute=c.institute?.selected&&c.institute.allowed!==false;
 if(chasing)priorities.push({title:catchInfo?'합류까지와 이후의 공부 회차':'선택한 학습량 · 합류 시점 미정',text:catchDetail+(institute?' 영재원 대비는 별도 추가 과정이며 기존 공부의 속도는 유지합니다.':''),section:'comparison',sectionLabel:'진도·학습량 비교'});
 else if(institute)priorities.push({title:'영재원 대비 · 기존 공부에 추가',text:(c.science?.prepPlan?.book||c.institute.label||'선택한 대비 교재')+'로 별도 준비합니다. 기존 교과·사고력·심화·연산과 과학의 진행 속도는 유지합니다.',section:c.science?'science':'direction',sectionLabel:c.science?'과학·영재원 대비':'선택한 목표와 준비'});
 else if(extra)priorities.push({title:'추가 회차를 적용하기 전',text:extra.enabled===true&&extra.allocation==='review'?'새 진도는 유지하고 선택한 복습·심화에 공부량을 더합니다. 합류 시점을 앞당기는 선택은 아닙니다.':'확인할 풀이·추가 분량의 용도·목표 회차를 고른 뒤 현재 속도와 비교합니다. 아직 적용하지 않은 회차로 합류 월을 계산하지 않습니다.',section:'comparison',sectionLabel:'진도·학습량 비교'});
 else if(c.science){const s=c.science,b=list(s.blocks).find(b=>!b.completed&&b.id!=='experiment');priorities.push({title:middle?'과학 · 내신과 선행을 함께':'과학 · 다음 기본 과정',text:b?b.title+' · '+compactPeriod(b)+' · '+(b.material||b.scope||'현재 과학 자료'):s.orderLabel||'선택한 과학 범위에서 기본 개념·탐구를 이어갑니다.',section:'science',sectionLabel:'과학·영재원 대비'});}
 else if(english){const p=list(english.standardStages)[0];priorities.push({title:'영어 · 같은 주에 이어갈 범위',text:[p?.label,p?.date,p?.title].filter(Boolean).join(' · ')+'. 어휘·문법과 구문·독해·듣기·쓰기를 함께 공부합니다.',section:'language-english',sectionLabel:'영어의 병행 과정'});}
 else priorities.push({title:chosenGoal(c.goal)?'목표까지 남은 과정':'다음 과정의 경계',text:chosenGoal(c.goal)?requirements[c.goal.goal]||c.goal.detail.math:primary[1]?'다음 교재는 '+blockText(primary[1])+'. 심화와 연산은 위의 각 일정으로 병행합니다.':primary[0]?'먼저 '+blockText(primary[0])+'의 남은 범위를 이어갑니다.':'현재 교재·범위를 선택한 뒤 다음 일정을 정합니다.',section:chosenGoal(c.goal)?'direction':'math',sectionLabel:chosenGoal(c.goal)?'선택한 목표와 준비':'교재·월별 과정'});
 const observed=c.observation&&c.observation.id!=='unknown'&&hasText(c.observation.method),checkpoints=primary.slice(0,3).map((b,i)=>({title:b.title,date:compactPeriod(b),text:i===0&&observed?c.observation.title:b.method||primary[i+1]?.title&&'이 범위 뒤에 '+object(primary[i+1].title)+' 이어갑니다.'||'이 범위의 개념·조건·풀이를 정리한 뒤 다음 교재를 선택합니다.'}));
 while(checkpoints.length<3)checkpoints.push({title:checkpoints.length===0?'현재 범위부터 선택':'그다음 과정 선택',date:checkpoints.length===0?dateAt(c,0):'교재·범위를 정한 뒤 연결',text:observed&&checkpoints.length===0?c.observation.title:'아직 선택하지 않은 교재의 시작·완료 월은 정하지 않았습니다.'});
 return {prose,priorities,checkpoints};
}
function model(context={}){
 const c=clone(context)||{};
 c.fields=c.fields||{};c.current=list(c.current);c.lanes=list(c.lanes).map(l=>({...l,blocks:list(l.blocks)}));
 c.languages=list(c.languages).filter(selectedLanguage);c.science=enabledScience(c.science)?c.science:null;
 c.goal=chosenGoal(c.goal)?c.goal:null;
 c.institute=c.institute?.selected&&c.institute.allowed!==false?c.institute:null;
 c.name=hasText(c.name)?c.name.trim():'우리 아이';c.gradeLabel=contextGrade(c);c.dateLabel=dateAt(c,0);
 c.observation=c.observation&&hasText(c.observation.method)?c.observation:null;
 c.front=frontAdvice(c);
 const sections=[{id:'overview',title:'독쌤의 전체 총평'},{id:'roadmap',title:'현재 공부와 함께 그린 로드맵'}];
 if(c.graphHtml||c.graphSvg||c.academyHtml)sections.push({id:'comparison',title:'진도·학습량과 학원별 과정 비교'});
 sections.push({id:'math',title:'교재·월별 세부 과정'});
 if(c.science)sections.push({id:'science',title:'과학·영재원 대비'});
 for(const lang of c.languages)sections.push({id:'language-'+lang.id,title:lang.name+'의 병행 과정'});
 if(c.goal||c.institute||list(c.selectedPaths).length||list(c.personalityMethods).length)sections.push({id:'direction',title:'선택한 목표와 다음 준비'});
 if(list(c.scienceQuestions).length&&c.science||list(c.languageQuestions).length&&c.languages.length||list(c.questions).length)sections.push({id:'questions',title:'상황별 학부모 질문'});
 c.sections=sections;
 return c;
}
function render(m,options={}){
 const prefix=String(options.prefix||'report').replace(/[^a-zA-Z0-9_-]/g,'')||'report',id=k=>prefix+'-'+k,sectionTitle=(n,k)=>`<header class="pr-section-heading"><small>${String(n).padStart(2,'0')}</small><h2 class="pr-section-title" id="${id(k)}-title">${esc(m.sections.find(s=>s.id===k)?.title||k)}</h2></header>`;
 const section=(k,cls,body)=>`<section class="pr-page ${cls}" id="${id(k)}" aria-labelledby="${id(k)}-title">${sectionTitle(m.sections.findIndex(s=>s.id===k),k)}${body}</section>`;
 const ref=p=>m.sections.some(s=>s.id===p.section)?`<a class="pr-detail-ref" href="#${id(p.section)}">뒤에서 보기 · ${esc(p.sectionLabel)}</a>`:'';
 const table=(headers,rows)=>`<table class="pr-table"><thead><tr>${headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')}</tr></thead><tbody>${rows.map(row=>'<tr>'+row.map((cell,i)=>i===0?'<th scope="row">'+cell+'</th>':'<td>'+cell+'</td>').join('')+'</tr>').join('')}</tbody></table>`;
 const chunks=(rows,size=10)=>Array.from({length:Math.ceil(rows.length/size)},(_,i)=>rows.slice(i*size,(i+1)*size));
 const facts=`<dl class="pr-current-grid">${m.current.map(x=>'<div><dt>'+esc(x.label)+'</dt><dd>'+esc(x.text)+'</dd></div>').join('')}</dl>`;
 let html=`<div class="pr-document"><section class="pr-page pr-front" id="${id('overview')}" aria-labelledby="${id('overview')}-title"><header class="pr-masthead"><strong>GFIELD</strong><span>우리 아이의 학습 로드맵</span></header><div class="pr-context"><strong>${esc(m.name)}</strong><span>${esc(m.gradeLabel)} · ${esc(m.dateLabel)} · ${m.mode==='custom'?'맞춤 계획':'표준 계획'}</span></div><div class="pr-counsellor"><span class="pr-docssam-portrait"><img src="../v31/assets/math-docssam/docssam-math-A1-mouth-closed.png" width="1024" height="1536" alt="독쌤"></span><h1 id="${id('overview')}-title">독쌤의 전체 총평</h1></div><div class="pr-front-prose">${m.front.prose.map(p=>'<p>'+ink(p)+'</p>').join('')}</div><div class="pr-priorities">${m.front.priorities.map((p,i)=>`<article class="pr-priority"><span>${String(i+1).padStart(2,'0')}</span><div><h2>${esc(p.title)}</h2><p>${ink(p.text)}</p>${ref(p)}</div></article>`).join('')}</div><div class="pr-checkpoints">${m.front.checkpoints.map(p=>`<article><small>${esc(p.title)}</small><strong>${esc(p.date)}</strong><p>${esc(p.text)}</p></article>`).join('')}</div><nav class="pr-contents" aria-label="상세 로드맵 차례"><strong>뒤에서 자세히 살펴보세요</strong>${m.sections.slice(1).map(s=>'<a href="#'+id(s.id)+'">'+esc(s.title)+'</a>').join('')}</nav><div class="pr-signature"><p>지금의 공부를 지키면서, 다음 과정을 함께 그려가겠습니다.</p></div></section>`;
 const preferred=m.grade==='pre'?'thinking':'school',mapLane=m.lanes.find(l=>l.id===preferred&&l.blocks.length)||m.lanes.find(l=>l.blocks.length),stops=list(mapLane?.blocks).filter(b=>!b.completed&&(!finite(b.end)||b.end>0)).slice(0,3);
 const map=`<figure class="pr-map-scene"><img src="assets/learning-landscape-20261023.png" alt="배움의 공간을 연결한 로드맵 풍경"><figcaption>현재 공부에서 이어가는 ${esc(mapLane?.label||'선택한 과정')}</figcaption><ol class="pr-map-stops">${stops.map((b,i)=>'<li><small>'+(i===0?'현재 과정':i===1?'다음 과정':'이어갈 과정')+'</small><strong>'+esc(b.title)+'</strong><span>'+esc(blockPeriod(m,b))+'</span></li>').join('')}</ol></figure>`;
 html+=section('roadmap','pr-roadmap',`<p class="pr-lead">교과·사고력·심화·연산을 각각의 현재 범위에서 함께 봅니다.</p>${facts}${stops.length?map:'<p class="pr-unset">이어갈 범위를 선택하면 현재 공부에서 다음 과정으로 로드맵이 연결됩니다.</p>'}${m.mode==='custom'&&!m.lanes.some(l=>l.blocks.length)?'<p class="pr-note">아직 고르지 않은 맞춤 교재와 범위는 새 일정으로 채우지 않았습니다.</p>':''}`);
 // The caller supplies generated graph markup after removing interactive controls.
 // This explicit trusted field preserves its legend, level explanations and comparison tables.
 const graphMarkup=m.graphHtml||m.graphSvg||'',allocationLabel=({advance:'복습·심화·연산을 유지하며 새 진도에 더 배분',review:'새 진도는 유지하고 복습·심화에 더 배분'})[m.extra?.allocation]||(typeof m.extra?.allocation==='string'?m.extra.allocation:'');
 if(m.sections.some(s=>s.id==='comparison'))html+=section('comparison','pr-comparison',`<p class="pr-lead">현재 공부와 선택한 비교 조건을 같은 기간에서 살펴봅니다.</p>${m.graphTitle?'<h3>'+esc(m.graphTitle)+'</h3>':''}${graphMarkup?'<div class="pr-graph">'+graphMarkup+'</div>':''}${m.extra?'<div class="pr-plan-note"><h3>선택한 학습량 비교</h3><p>'+esc([m.extra.loadTitle,m.extra.meetingText,allocationLabel,m.extra.followup].filter(Boolean).join(' · '))+'</p></div>':''}${m.academyHtml||''}<p class="pr-note">그래프는 선택한 공부의 참고 일정입니다. 학습 능력이나 합격 가능성을 나타내는 점수는 아닙니다.</p>`);
 const laneBody=m.lanes.map(l=>`<article class="pr-lane"><h3>${esc(l.label)}</h3><p class="pr-current-line">현재 · ${esc(l.current||m.current.find(x=>x.id===l.id)?.text||'현재 범위 확인 전')}</p>${l.blocks.length?chunks(l.blocks).map((bs,i)=>`${i?'<p class="pr-continued">'+esc(l.label)+' · 계속</p>':''}${table(['시기','교재·범위','공부 방법과 확인할 점'],bs.map(b=>[esc(blockPeriod(m,b)),esc(b.title)+(b.current?'<small>현재 과정</small>':''),esc(b.method||l.method||l.note||'개념과 조건을 연결하고, 다른 날에도 혼자 풀고 설명하는지 확인합니다.')+(b.sustained?'<small>꾸준히 병행할 기간이며 한 권의 이수 기간은 아닙니다.</small>':'')]))}`).join(''):'<p class="pr-unset">'+esc(l.note||'현재 범위와 이어갈 교재를 확인한 뒤 일정에 연결합니다.')+'</p>'}${l.note&&l.blocks.length?'<p class="pr-note">'+esc(l.note)+'</p>':''}</article>`).join('');
 html+=section('math','pr-math',`<p class="pr-lead">표에서 같은 달에 놓인 공부는 병행합니다. 한 영역의 진도만으로 다른 영역의 이수를 정하지 않습니다.</p>${laneBody||'<p class="pr-unset">현재 선택한 교재와 범위를 확인한 뒤 세부 일정을 연결합니다.</p>'}${m.observation&&hasText(m.observation.method)?'<article class="pr-subsection"><h3>선택한 풀이 모습과 보완 방법</h3><p><strong>'+esc(m.observation.title)+'</strong></p><p>'+esc(m.observation.method)+'</p></article>':''}${list(m.assumptions).length?'<article class="pr-subsection"><h3>일정을 읽는 기준</h3><ul>'+m.assumptions.filter(hasText).map(a=>'<li>'+esc(a)+'</li>').join('')+'</ul></article>':''}`);
 if(m.science){
  const s=m.science,scienceContext={...m,now:s.context?.now??m.now,fields:{...m.fields,year:s.context?.year??m.fields.year}},blocks=list(s.blocks).length?s.blocks:[...list(s.phases),...list(s.next),...list(s.terms),...list(s.continuation),...list(s.schoolTerms)],rows=blocks.map(b=>[esc(b.title),esc(blockPeriod(scienceContext,b)),esc(b.material||b.book||b.bookTitle||'현재 교재·수업 자료'),esc([...new Set([b.scope,b.courseMethod,b.method,b.note,b.preceding].filter(Boolean))].join(' · ')||'기본 개념과 대표 탐구를 설명하고, 자료와 현상을 연결하는지 확인합니다.')+(b.months?'<small>전체 과정 기준 '+esc(b.months)+'개월</small>':'')+(b.completed?'<small>이수했다고 선택한 범위</small>':'')]);
  const levels=m.scienceStage,stagePeriod=schedule=>schedule&&finite(schedule.start)&&finite(schedule.end)?blockPeriod(scienceContext,{start:schedule.start,end:schedule.end}):schedule?.label;
  let body=`<p class="pr-lead">${esc(s.orderLabel||'현재 선택한 과학 과정')}</p>`;
  if(levels){
   body+='<article class="pr-science-stage"><h3>'+esc(levels.current?.title||'현재 과학 공부 확인 전')+'</h3><p>'+esc(levels.current?.explanation||'')+'</p>';
   if(levels.known)body+=table(['구분','공부할 범위','교재·예상 일정','확인할 점'],[levels.current,...list(levels.next)].map((b,i)=>[esc((i===0?'현재 선택 · ':i===1?'다음 단계 · ':'그다음 단계 · ')+b.title),esc(b.scope),esc([b.bookSummary,stagePeriod(b.schedule)].filter(Boolean).join(' · ')),esc(b.readiness)]));
   body+='<p class="pr-note">'+esc(levels.note||'단계 선택만으로 이전 과정의 이수를 기록하지 않습니다.')+'</p><p>'+esc(levels.parentComment||'')+'</p>'+(levels.schoolNote?'<p>'+esc(levels.schoolNote)+'</p>':'')+'</article>';
  }
  body+=`${s.preparation?.deadlineMissed?'<p class="pr-plan-note">초등 과학의 필요한 학습 기간을 줄여 맞추기보다, 현재 범위부터 보완하고 실험과학의 병행 여부를 조정합니다.</p>':''}${chunks(rows).map(rs=>table(['공부할 과정','예상 시기','교재','방법과 확인할 점'],rs)).join('')}`;
  if(s.prepPlan?.mode==='additional'&&s.prepPlan.preserveExistingPace)body+=`<article class="pr-plan-note"><h3>영재원 대비는 별도로 추가합니다</h3><p>${esc([s.institute,s.region].filter(Boolean).join(' · '))}</p><p>${esc(s.prepPlan.book||s.prepBook||'선택한 대비 교재')}</p><p>기존 교과·사고력·심화·연산과 과학의 진행 속도는 유지합니다. 지원 분야에 맞는 문제해결·탐구·설명을 별도 시간에 준비합니다.</p></article>`;
  const goals=[...list(s.goalPlan?.targets),...(s.goalPlan?.physics?[s.goalPlan.physics]:[])];
  body+=goals.map(g=>'<article class="pr-subsection"><h3>'+esc(g.title)+'</h3><ol>'+list(g.steps).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol><p>'+esc(g.note)+'</p></article>').join('');
  html+=section('science','pr-science',body);
 }
 for(const lang of m.languages){
  let body='<p class="pr-lead">현재 · '+esc(lang.current)+'</p><p>'+esc(lang.course?.talk||'')+'</p>';
  if(lang.id==='english')body+='<p class="pr-plan-note">어휘·문법과 구문·독해·듣기·쓰기는 같은 주에 함께 이어갑니다. 읽기 지수는 읽는 책의 범위를 참고하는 정보이며, 영어 전체 실력이나 다음 교재의 이수를 뜻하지 않습니다.</p>'+(lang.reading?.summary?'<p>'+esc(lang.reading.summary)+'</p>':'');
  if(lang.support)body+='<p>'+esc(lang.support)+'</p>';
  if(lang.rhythm)body+='<p class="pr-current-line">학습량 · '+esc(lang.rhythm)+'</p>';
  if(lang.book?.title)body+='<p class="pr-plan-note">이번에 선택한 보완 교재 · '+esc(lang.book.title)+'</p>';
  if(lang.route)body+='<article class="pr-plan-note"><h3>'+esc(lang.route.title||'이번에 보완할 공부')+'</h3>'+[lang.route.method,lang.route.practice,lang.route.check,lang.route.transfer].filter(Boolean).map(t=>'<p>'+esc(t)+'</p>').join('')+'</article>';
  const phases=list(lang.standardStages).length?lang.standardStages:list(lang.phases);
  body+=phases.map(p=>`<article class="pr-language-period"><h3>${esc(p.label||p.title)}</h3><p class="pr-period-date">${esc(p.date||'현재 공부에 맞춰 조정')}</p>${p.title&&p.label?'<p><strong>'+esc(p.title)+'</strong></p>':''}${p.talk?'<p>'+esc(p.talk)+'</p>':''}${p.areas?table(['영역','교재·범위','공부 방법','확인할 점'],Object.entries(p.areas).map(([k,v])=>[esc(({vocabulary:'어휘',sentence:'문법·구문',evidence:'독해',output:'쓰기·표현',writing:'서술·쓰기',listening:'듣기·말하기'}[k]||k)),esc([v.material,v.scope].filter(Boolean).join(' · ')),esc(v.method||''),esc(v.check||'')])):'<p>'+esc(p.method||'')+'</p>'}${p.goal?'<p class="pr-plan-note">'+esc(p.goal)+' '+esc(p.goalNote||'')+'</p>':''}${p.check?'<p class="pr-check-text">다음 과정 전 · '+esc(p.check)+'</p>':''}</article>`).join('');
  if(lang.id!=='english'&&list(lang.tracks).length)body+='<article class="pr-subsection"><h3>같은 주에 이어가는 영역별 공부</h3>'+table(['영역','교재','한 주의 공부','확인할 점'],lang.tracks.map(t=>[esc(t.title),esc(t.material),esc([t.weekly,...list(t.items)].filter(Boolean).join(' · ')),esc(t.check)]))+'</article>';
  const rec=lang.recommendations;
  if(list(rec?.items).length)body+='<article class="pr-subsection"><h3>'+esc(rec.label||'현재 공부에 맞춰 볼 교재')+'</h3><p>'+esc(rec.note||'')+'</p>'+table(['영역','교재·자료','활용 방법'],rec.items.map(b=>[esc(b.area||''),esc(b.title),esc(b.use||b.note||'')]))+'</article>';
  if(list(lang.checkpoints).length)body+='<article class="pr-subsection"><h3>다음 공부로 연결하기 전</h3>'+table(['시점','확인할 내용'],lang.checkpoints.map(p=>[esc([p.date,p.title].filter(Boolean).join(' · ')),esc(p.text)]))+'</article>';
  if(list(lang.later).length)body+='<article class="pr-subsection"><h3>이후에 이어갈 공부</h3>'+table(['시기·방향','이어서 공부할 내용'],lang.later.map(p=>[esc([p.date,p.title].filter(Boolean).join(' · ')),esc(p.text)]))+'</article>';
  if(lang.course?.next)body+='<p class="pr-note">'+esc(lang.course.next)+'</p>';
  html+=section('language-'+lang.id,'pr-language',body);
 }
 if(m.sections.some(s=>s.id==='direction')){
  let body='';
  if(m.goal){const g=m.goal.detail;body+='<h3>'+esc(g.title)+'</h3>'+(g.focus?'<p class="pr-lead">'+esc(g.focus)+'</p>':'')+(list(g.steps).length?'<ol>'+g.steps.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol>':'')+['math','depth','contest','science','prep'].filter(k=>g[k]).map(k=>'<p>'+esc(g[k])+'</p>').join('');if(m.goal.policy?.note)body+='<p class="pr-note">'+esc(m.goal.policy.note)+'</p>';if(list(m.goal.checkpoints).length)body+=table(['언제 다시 볼까요?','할 공부와 확인할 점'],m.goal.checkpoints.map(p=>[esc([p.date,p.title].filter(Boolean).join(' · ')),esc([p.action,p.check].filter(Boolean).join(' '))]));}
  if(m.institute)body+='<article class="pr-plan-note"><h3>'+esc(m.institute.label||'영재원 대비')+'</h3><p>영재원 대비는 기존 공부에 추가합니다. 기존 공부의 속도는 유지하며, 지원 학년·분야의 안내에 맞춰 필요한 준비를 별도로 정합니다.</p></article>';
  const paths={boarding:'보딩 준비',international:'국제학교',center:'영재원 대비',centerEdu:'교육청 영재원 대비',centerUni:'대학부설 영재원 대비'};
  if(list(m.selectedPaths).length)body+='<h3>함께 선택한 방향</h3><ul>'+m.selectedPaths.map(x=>'<li>'+esc(paths[x]||x)+'</li>').join('')+'</ul>';
  if(list(m.personalityMethods).length)body+='<h3>선택한 공부 방법</h3>'+m.personalityMethods.map(x=>'<article class="pr-subsection"><h4>'+esc(x.title)+'</h4><p>'+esc(x.method)+'</p></article>').join('');
  html+=section('direction','pr-direction',body);
 }
 if(m.sections.some(s=>s.id==='questions')){
  const qs=[...list(m.questions),...(m.science?list(m.scienceQuestions):[]),...(m.languages.length?list(m.languageQuestions):[])];
  html+=section('questions','pr-questions',qs.map(q=>'<article class="pr-question"><h3>'+esc(q.question||q.q)+'</h3><p>'+esc(q.answer||q.a)+'</p></article>').join(''));
 }
 return html+'</div>';
}
global.PlannerReport=Object.freeze({model,render,dateAt,blockPeriod});
})(window);
