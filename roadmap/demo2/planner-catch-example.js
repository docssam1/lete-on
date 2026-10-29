/* Fixed, explicitly hypothetical examples using the live engine and original level table. No learner storage. */
(function(global){
'use strict';
const G=global.PlannerProgression,T=global.PlannerTransition;
const CASES=Object.freeze({
 aligned:Object.freeze({title:'같은 속도로 이어지는 계산 예시',grade:'2',mon:'10',school:'5-1',description:'초2 10월 · 디딤돌 응용 5-1을 마쳤다는 가정입니다. L9와 L8의 원자료 일정으로 합류와 이후 속도를 살펴봅니다.'}),
 review:Object.freeze({title:'복습 구간이 다른 초4 예시',grade:'4',mon:'9',school:'5-2',description:'초4 9월 · 디딤돌 응용 5-2를 마쳤다는 가정입니다. 같은 과정 속도와 복습 구간의 배치 차이를 구분해 봅니다.'})
});
function build(caseId='aligned',load='weekly'){
 const id=Object.hasOwn(CASES,caseId)?caseId:'aligned',c=CASES[id],a={grade:c.grade,gradeInput:'current',thinkingExperience:'none',schoolCourse:'elem',schoolBook:'디딤돌 응용',school:c.school,schoolStatus:'done',deepCourse:'none',calc:'기적의 계산법 6권',calcStatus:'progress'},f={grade:c.grade,mon:c.mon,year:'2026',band:'B',speed:'2'};let p=null,s=null;
 for(const [kind,value]of [['goal','step'],['focus','school'],['observation','independent'],['pace','term']])p=G.choose(p,a,f,kind,value);
 for(const [kind,value]of [['book','current'],['range','current'],['deep','none'],['calc','repair'],['checkpoint','observed'],['tempo','gradual'],['allocation','advance'],['load',load==='twiceWeekly'?'twiceWeekly':'weekly']])s=T.choose(s,p,a,f,kind,value);
 return {id,definition:c,answers:a,fields:f,progress:p,transition:s,model:T.timeline(s,p,a,f)};
}
function mount(){
 const graph=document.getElementById('catchExampleGraph');if(!graph)return;let current='aligned',load='weekly';
 function draw(){const e=build(current,load);document.getElementById('catchExampleDescription').textContent=e.definition.description;graph.innerHTML=T.renderGraph(e.transition,e.progress,e.answers,e.fields,{academyLines:false});
 graph.querySelectorAll('[data-atlas-full],[data-transition-open],.transition-axis-buttons,.transition-graph-actions,.catch-example-link').forEach(n=>n.remove());
 const title=graph.querySelector('.transition-graph h4');title.textContent=e.definition.title;
 const c=T.catchDetail(e.model),sample=e.model.references[0],common=[];if(c)for(let t=e.model.catch.x+.25;t<=e.model.now+24;t+=.25){const y=T.at(e.model.gradual,t),z=T.at(sample.points,t);if(y!=null&&z!=null)common.push(Math.abs(y-z));}
 document.getElementById('catchExampleOutcome').textContent=c?T.meetingText(e.model)+' 학습량을 늘려 공부하는 기간은 약 '+c.extraMonths.toFixed(1)+'개월입니다. '+(common.length&&Math.max(...common)<1e-7?'그 뒤 파란 선과 초록 선이 겹쳐 같은 속도로 이어집니다.':'이후 같은 과정 속도로 진행하는 참고 일정입니다. 이후는 학습 성향에 따라 달라짐.'):'이 가정에서는 그래프 기간 안에 같은 범위로 만나지 않습니다.';
 document.querySelectorAll('[data-catch-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.catchCase===current)));document.querySelectorAll('[data-catch-load]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.catchLoad===load)));
 }
 document.addEventListener('click',e=>{const b=e.target.closest('[data-catch-case],[data-catch-load]');if(!b)return;if(b.dataset.catchCase)current=b.dataset.catchCase;if(b.dataset.catchLoad)load=b.dataset.catchLoad;draw();});draw();
}
global.PlannerCatchExample=Object.freeze({CASES,build,mount});if(typeof document!=='undefined')mount();
})(window);
