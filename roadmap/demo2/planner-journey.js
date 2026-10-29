/* 질문 도중에는 확인된 답만 표시한다. 완성도는 입력 진행 상태이며 학습 성취도가 아니다. */
(function(global){
'use strict';
const I=global.PlannerIntake;
const AXES=[
 {id:'school',label:'교과',key:'school',edit:'schoolCourse',prefix:/^school/,status:'schoolStatus',what:'개념을 익히고 응용 문제에 적용해요.'},
 {id:'deep',label:'심화',key:'deepBook',edit:'deepCourse',prefix:/^deep/,status:'deepStatus',what:'낯선 문제의 조건을 연결하고 풀이를 설명해요.'},
 {id:'thinking',label:'사고력',key:'thinking',edit:'thinkingExperience',prefix:/^(thinking|compExact|preDone)/,status:'thinkingStatus',what:'여러 방법을 찾고 생각하는 힘을 길러요.'},
 {id:'calc',label:'연산',key:'calc',edit:'calc',prefix:/^calc/,status:'calcStatus',what:'계산 원리를 이해하고 정확하게 연습해요.'}
];
const DIRECTIONS=[
 {id:'academic',title:'교과·심화 → 내신·수능',summary:'교과와 심화를 공부하며 내신·수능을 준비해요.',detail:{title:'고등 과정 · 내신·수능',guideKey:'high',sub:'교과와 심화를 공부하며 앞으로의 학교 공부를 준비해요.'}},
 {id:'gifted',title:'영재고 입시 준비',summary:'목표 학교에 맞춰 수학·과학을 준비해요.',detail:{title:'영재학교 입시 준비',guideKey:'choice',sub:'관심과 목표 학교에 맞춰 수학·과학 공부를 이어가요.'}},
 {id:'contest',title:'경시 입문·기본 → KMO',summary:'1차 이후에는 목표에 맞춰 다음 공부를 골라요.',detail:{title:'KMO 기본 · 1차 이후 갈림길',guideKey:'basic',sub:'공통수학1·2 완료 후 입문해요. 1차 이후에는 2차 준비, 고등 과정, 영재고 입시 중에서 방향을 고를 수 있어요.'}}
];
const YOUNG_AXES={
 school:{label:'교과 수학',what:'교과서의 기본 내용을 차근차근 익혀요.'},
 deep:{label:'심화 수학',what:'배운 내용으로 더 깊이 생각하는 문제를 풀어요.'},
 thinking:{label:'사고력 수학',what:'규칙과 도형을 살피고 여러 풀이를 찾아봐요.'},
 calc:{label:'수와 계산',what:'수를 이해하고 덧셈·뺄셈 등을 연습해요.'}
};
function directions(group){
 if(!['preschool','lower'].includes(group))return DIRECTIONS;
 const copy={
  academic:{title:'학교 수학 → 중·고등학교 공부',summary:'기본기를 쌓아 앞으로의 학교 공부와 시험을 준비해요.'},
  gifted:{title:'영재학교 알아보기',summary:'탐구를 즐긴다면 앞으로 어떤 학교에서 공부할지 살펴봐요.'},
  contest:{title:'수학 경시대회 · KMO',summary:'배운 수학으로 어려운 문제에 도전하는 길이에요.'}
 };
 return DIRECTIONS.map(d=>({...d,...copy[d.id]}));
}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function model(answers,fields,question='grade',complete=false){
 const a=I.effective(answers),order=I.order(a,fields),summary=I.summary(a,fields);
 const grade=I.gradeChoice(a,fields),profile=grade?I.profile(a,fields):null,group=I.audience(a,fields);
 const axes=AXES.map(axis=>{
  const required=order.filter(k=>axis.prefix.test(k)),touched=required.some(k=>Object.hasOwn(answers,k));
  const ready=touched&&required.every(k=>I.hasAnswer(a,fields,k))&&!(required.includes(axis.status)&&fields.pendingStatus?.[axis.status]);
  let value=touched?summary.find(s=>s.key===axis.key)?.text||'선택 중':'아직 답변 전';
  if(touched&&!ready){
   if(axis.id==='school'||axis.id==='deep'){
    const book=axis.id==='school'?a.schoolBook:a.deepBook,course=axis.id==='school'?a.schoolCourse:a.deepCourse;
    value=[course==='mid'?'중등 과정':course==='elem'?'초등 과정':'',book&&!I.special(book)?book:'',fields.pendingStatus?.[axis.status]?'상태 확인 전':'선택 중'].filter(Boolean).join(' · ');
   }else if(axis.id==='thinking')value=a.thinkingExperience==='yes'?(a.thinking||'공부한 과정을 고르는 중'):'선택 중';
   else value=a.calc||'선택 중';
  }
  const row=profile?.rows.find(r=>r.key===({thinking:'thinking1'})[axis.id]||r.key===axis.id);
  const next=ready?row?.next:null;
  const copy=['preschool','lower'].includes(group)?YOUNG_AXES[axis.id]:axis;
  return {...axis,...copy,active:axis.prefix.test(question),touched,ready,value,next:next?.shortText||'',detail:{title:copy.label+' · '+(touched?value:'다음 단계 확인'),axis:axis.id==='thinking'?'thinking1':axis.id,kind:'step',sub:ready?'입력한 답을 기준으로 살펴봐요.':'아직 답변을 확인하는 중이에요.'}};
 });
 return {grade:grade?I.studentLabel(a,fields):'우리 아이',audience:group,axes,directions:directions(group),complete,ready:axes.filter(x=>x.ready).length,
  decisions:[['hw','생각하는 황소'],['gifted','영재원']].map(([id,title])=>({id,title,value:answers[id]==='1'?'함께 고려':answers[id]==='0'?'현재 학습 이어가기':answers[id]==='pending'?'아직 고민 중':'아직 선택 전',chosen:answers[id]==='1',answered:Object.hasOwn(answers,id)}))};
}
function render(m,options={}){
 const decisions=m.decisions.filter(d=>d.answered);
 return `<div class="journey-start"><span>${esc(m.grade)}</span><b>지금 공부에서 다음 과정으로</b></div>
 <div class="atlas-lane-key" aria-hidden="true"><span>공부 영역</span><span>현재 학습</span><span>이어갈 공부</span></div>
 <div class="journey-lanes">${m.axes.map(x=>`<article class="journey-lane ${x.ready?'is-ready':x.touched?'is-building':'is-empty'} ${x.active?'is-active':''} ${x.justAdded?'just-added':''}" data-axis="${x.id}"><div class="journey-axis"><b>${x.label}</b>${x.touched?`<small>${x.ready?'답변 반영':'선택 중'}</small>`:''}</div>${!x.touched?`<div class="journey-empty"><span>아직 선택 전</span></div>`:`<button type="button" data-journey-course="${x.id}" ${!x.ready?'disabled':''} aria-haspopup="dialog" aria-controls="courseDetail"><small class="journey-node-label">${x.ready?'지금':'선택 중'}</small><strong>${esc(x.value)}</strong>${x.ready?`<span>${esc(x.what)}</span>`:''}</button>`}<span class="journey-connection" aria-hidden="true"><i></i></span>${x.next?`<button type="button" class="journey-next journey-next-button" data-journey-next="${x.id}" aria-haspopup="dialog" aria-controls="courseDetail"><small>다음에 공부할 내용</small><span>${esc(x.next)}</span></button>`:x.ready?'<p class="journey-next-unset">다음 과정은 함께 정해요.</p>':''}</article>`).join('')}</div>
 ${options.directions===false?'':`<div class="journey-junction"><span>앞으로 어떤 공부를 해볼까요?</span>${m.complete?'<small>관심 있는 방향을 눌러보세요. 나중에 바꿀 수 있어요.</small>':''}</div>
 <div class="journey-directions ${m.complete?'':'is-preview'}">${m.directions.map(d=>`<button type="button" data-journey-direction="${d.id}" aria-haspopup="dialog" aria-controls="courseDetail"><b>${esc(d.title)}</b>${m.complete?`<span>${esc(d.summary)}</span>`:''}<span class="journey-direction-open" aria-hidden="true">→</span></button>`).join('')}</div>
`}
 ${decisions.length?`<div class="journey-decisions">${decisions.map(d=>`<span class="${d.chosen?'is-chosen':''}"><b>${d.title}</b>${d.value}</span>`).join('')}</div>`:''}`;
}
global.PlannerJourney=Object.freeze({model,render});
})(window);
