(function(global){
'use strict';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const labels={school:'교과 선행',deep:'교과 심화',thinking:'사고력 수학',calc:'연산'};

function projectedStart(standard,fields,start){
 if(!Number.isFinite(start)||!Number.isFinite(standard.now))return '';
 const year=Number(fields.year),month=Number(fields.mon);
 if(!Number.isInteger(year)||year<2020||year>2100||!Number.isInteger(month)||month<1||month>12)return '';
 const position=year*12+month-1+Math.floor(start);
 return `${Math.floor(position/12)}년 ${position%12+1}월`;
}

function render(answers,fields,standard,{studyAction=false}={}){
 const parent=global.PlannerParentFlow,preferences=parent.preferences(answers.parentFlow);
 const stageLabels=new Map(parent.stages().filter(([id])=>!['none','unknown'].includes(id)));
 const order=parent.ageCopy(preferences.currentAge,answers.grade).order;
 const rows=order.flatMap(axis=>{
  const lane=standard.lanes.find(entry=>entry.id===axis);
  const reference=preferences.academyReports[axis];
  const stage=axis==='thinking'?preferences.thinkingStage:stageLabels.get(preferences.stages[axis]);
  const book=reference?.book||preferences.actualBooks[axis];
  const scope=[stage,book,reference?.level||preferences.bookLevels[axis],reference?.range||preferences.ranges[axis]].filter(Boolean).join(' · ');
  const current=scope||(lane?.status==='known'?lane.current:'');
  if(!current)return [];
  const done=(reference?.status||preferences.statuses[axis]||answers[axis+'Status'])==='done';
  // The current block begins at zero. For a completed course, the next block may begin now.
  const next=!reference&&lane?.status==='known'&&lane.blocks.find(block=>block.title&&!block.sustained&&(done||block.start>0));
  const date=next&&projectedStart(standard,fields,next.start);
  const foundation=axis==='thinking'&&!!preferences.thinkingStage;
  return `<div class="parent-plan-row" data-plan-axis="${axis}"><dt>${labels[axis]}</dt><dd><div class="parent-plan-current"><small>${reference?'학원 수업 참고':done?'마친 학습':'현재 진도'}</small><strong>${esc(current)}</strong>${preferences.independentRanges[axis]?`<span>혼자 푸는 범위 · ${esc(preferences.independentRanges[axis])}</span>`:''}</div><div class="parent-plan-next"><small>다음 학습</small>${next?`<strong>${esc(next.title)}</strong>${date?`<span>예상 시작 · ${esc(date)}</span>`:''}`:foundation?'<strong>킨더팩토</strong><span>언어·수감각 활동이 익숙해지면 시작해요.</span>':`<span>${reference?'현재 학습 범위를 확인하면 이어갈 내용을 볼 수 있어요.':'다음 교재와 시작 시기는 확인이 필요해요.'}</span>`}</div></dd></div>`;
 });
 return `<section class="parent-plan-overview"><header><h3>현재 진도와 다음 학습</h3>${studyAction?'<button type="button" data-parent-study class="parent-primary">학습하기</button>':''}</header>${rows.length?`<dl>${rows.join('')}</dl>`:`<p>${preferences.notStarted?'아직 수학 공부를 시작하기 전이에요.':'현재 교재나 학습 활동을 알려주시면 다음 과정을 이어서 볼 수 있어요.'}</p>`}</section>`;
}

function references(answers,fields={}){
 const intake=global.PlannerIntake;
 const selected=intake.learnerChoice(answers,fields);
 const learner=/^[1-6]$/.test(selected)?'grade:'+selected:/^pre:[4-7]$/.test(selected)?selected:'';
 const month=Number(fields.mon)||new Date().getMonth()+1;
 const link=(href,label)=>`<a href="${esc(href)}" target="_blank" rel="noopener" aria-label="${esc(label+' · 새 탭')}">${esc(label)}</a>`;
 return `<div class="parent-plan-options"><details class="parent-plan-routes"><summary>목표별 로드맵 보기</summary><ul><li>${link('planner.html?senior=premier-cohort','프리미어·필즈 S 합격생 사례')}</li><li>${link('planner.html?academy=academy-hwangso','생각하는 황소 준비')}</li><li><strong>이과 최상위권</strong><div>${link('planner.html?guest=1&goal=contest','KMO')}${link('planner.html?guest=1&goal=giftedSchool','영재학교')}${link('planner.html?guest=1&goal=scienceHigh','과학고')}${link('planner.html?admissions=private','자사고')}</div></li></ul></details><details id="levelGuide" class="level-guide" data-level-guide-load><summary>진도 비교 기준 보기</summary><div data-planner-level-guide-content data-learner="${esc(learner)}" data-month="${esc(month)}"></div></details></div>`;
}

global.PlannerParentOverview=Object.freeze({render,references});
})(typeof window==='undefined'?globalThis:window);
