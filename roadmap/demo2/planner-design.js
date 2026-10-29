/* Inspectable design study. Uses the existing model and keeps all live planner storage untouched. */
(function(){
'use strict';
const G=PlannerProgression,T=PlannerTransition,W=PlannerWorkspace;
const answers={grade:'5',gradeInput:'current',thinkingExperience:'none',schoolCourse:'elem',schoolBook:'디딤돌 응용',school:'5-2',schoolStatus:'progress',deepCourse:'none',calc:'기적의 계산법 6권',calcStatus:'progress'},fields={year:'2026',grade:'5',mon:'10',band:'B',speed:'2'};
let progress=null,transition=null,selectedCourse=10,selectedDepth=null,currentView='map';
for(const [k,v]of [['goal','step'],['focus','school'],['observation','independent'],['pace','term']])progress=G.choose(progress,answers,fields,k,v);
for(const [k,v]of [['book','current'],['range','sequence'],['deep','deep0'],['deepScope','same'],['cadence','sequential'],['calc','current'],['checkpoint','observed'],['tempo','gradual'],['allocation','advance'],['load','weekly']])transition=T.choose(transition,progress,answers,fields,k,v);
const $=id=>document.getElementById(id),month=x=>{const c=T.calendarAt(model.m.now,x-model.m.now,fields);return c.year+'년 '+c.month+'월';};let model;
function selectPane(pane){document.querySelector('main').classList.toggle('mobile-result',pane==='result');document.querySelectorAll('[data-pane]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pane===pane)));}
function selectView(view){currentView=view;for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-selected',String(b.dataset.view===view));for(const id of ['map','graph','table'])$('design-'+id).hidden=id!==view;if(view==='map')requestAnimationFrame(drawRoute);}
function selectCourse(id,depthIndex=null){
 selectedCourse=id;selectedDepth=depthIndex;const r=model.rows.find(r=>r.id===id);if(!r)return;
 const index=model.rows.indexOf(r),depth=depthIndex===null?null:model.depthSlots[depthIndex];
 for(const b of document.querySelectorAll('[data-course]')){const matchingPart=b.classList.contains('map-stop')||(depth?b.dataset.depth===String(depthIndex):!b.hasAttribute('data-depth')),on=+b.dataset.course===id&&matchingPart;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));}
 $('course-context').textContent=depth?'살펴보는 과정 · 같은 학기 심화':'살펴보는 과정 · 교과 응용';
 $('course-book').textContent=depth?depth.depthTitle:r.school;
 $('deep-book').textContent=depth?'앞선 교과 · '+r.school:'다음 심화 · '+r.deep;
 $('course-date').textContent=(depth?depth.start:r.start)+' → '+(depth?depth.end:r.end);
 document.querySelector('.course-number').textContent='0'+(index+1);
 $('course-action').textContent=depth?'같은 학기의 조건 해석과 풀이 설명을 깊게 다룹니다. 응용 다음 심화가 끝나면 다음 학기 교과로 이어갑니다.':index===0?'다른 날에도 혼자 풀고, 식을 세운 이유를 설명하는지 확인한 뒤 같은 학기 심화로 이어갑니다.':'앞 학기의 심화까지 확인한 뒤, 새 학기의 개념과 응용을 연결합니다.';
 drawRoute();
}
function drawRoute(){
 const terrain=document.querySelector('.landscape'),r=terrain.getBoundingClientRect();if(!r.width||!r.height)return;
 const points=[...document.querySelectorAll('.map-stop .stop-base')].map(n=>{const b=n.getBoundingClientRect();return {x:(b.left+b.width/2-r.left)/r.width*1000,y:(b.top+b.height/2-r.top)/r.height*590};});
 let d='M'+points[0].x+' '+points[0].y;const segments=[];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],mid=(a.x+b.x)/2;d+='C'+mid+' '+a.y+' '+mid+' '+b.y+' '+b.x+' '+b.y;segments.push(d);}
 for(const cls of ['.path-wash','.path-outline'])document.querySelector(cls).setAttribute('d',d);document.querySelector('.path-progress').setAttribute('d',selectedCourse===12?d:segments[0]);
}
function render(){
 model=W.model(transition,progress,answers,fields,['international']);const months=W.monthsFor(model,fields),total=months.length;
 $('design-current-study').innerHTML=W.currentSummary(answers,fields);
 for(const pin of document.querySelectorAll('.map-stop[data-course]')){const row=model.rows.find(r=>r.id===+pin.dataset.course);if(row)pin.querySelector('.stop-label>span').textContent='디딤돌 응용 → 최상위 S';}
 $('selected-load').textContent=$('footer-summary').textContent='목표 '+(transition.load==='twiceWeekly'?'주 2회':'주 1회')+' 추가';
 $('month-axis').innerHTML=months.map(m=>'<span>'+m.date.grade+'<b>'+m.date.month+'월</b></span>').join('');$('month-axis').style.gridTemplateColumns='repeat('+total+',minmax(42px,1fr))';
 const groups=[];months.forEach((m,i)=>{const key=m.date.year+'년 '+m.date.quarter+'분기';if(groups.at(-1)?.key===key)groups.at(-1).count++;else groups.push({key,start:i,count:1});});$('quarter-axis').style.gridTemplateColumns='repeat('+total+',minmax(42px,1fr))';$('quarter-axis').innerHTML=groups.map(g=>'<span style="grid-column:'+ (g.start+1)+' / span '+g.count+'">'+g.key+'</span>').join('');
 const bars=model.rows.flatMap(r=>{const s=model.m.segments.find(s=>s.gain>0&&T.schoolNumber(G.stage(s.course,'school'))===r.id);if(!s)return[];return[{id:r.id,title:r.school,start:Math.max(0,s.scenarioEnd-s.duration-model.m.now),end:Math.min(total,s.scenarioEnd-model.m.now),depth:null}];});
 model.depthSlots.forEach((slot,i)=>bars.push({id:slot.id,title:slot.depthTitle,start:Math.max(0,slot.scenarioEnd-slot.duration-model.m.now),end:Math.min(total,slot.scenarioEnd-model.m.now),depth:i}));
 const visibleBars=bars.filter(b=>b.end>b.start).sort((a,b)=>a.start-b.start||a.end-b.end);
 for(const id of ['quarter-axis','month-axis','course-bars'])$(id).style.minWidth=Math.max(580,total*48)+'px';
 $('course-bars').style.height=visibleBars.length*32+'px';
 $('course-bars').innerHTML=visibleBars.map((b,i)=>'<button type="button" class="course-bar'+(b.depth===null?'':' is-depth')+'" data-course="'+b.id+'"'+(b.depth===null?'':' data-depth="'+b.depth+'"')+' style="left:'+b.start/total*100+'%;width:'+((b.end-b.start)/total*100)+'%;top:'+i*32+'px" aria-pressed="false">'+b.title+'</button>').join('');
 $('graph-slot').innerHTML=T.renderGraph(transition,progress,answers,fields);PlannerAnnotations.decorate($('graph-slot'),model);$('table-slot').innerHTML=W.renderSchedule(transition,progress,answers,fields,['international']);
 $('level-detail').innerHTML=[model.m.base,...model.m.references.map(r=>r.id)].filter(Boolean).map(id=>G.renderLevelMeaning(model.d.b.c,id)).join('');
 $('graph-comment').textContent=model.c?'이 가정에서는 약 '+model.c.months.toFixed(1)+'개월 뒤 같은 범위에 이릅니다. 그다음에도 같은 과정의 속도와 복습 간격을 함께 살펴봅니다.':'이 조건에서는 24개월 안에 상위 예시와 만나지 않습니다. 6개월 뒤에는 목표 회차를 더 늘리지 않고 유지합니다. 자료 밖의 합류 시점은 정하지 않습니다.';
 const label=$('graph-slot').querySelector('.curve-chase-label');if(label)label.textContent='목표 회차를 유지하며 합류까지';
 selectCourse(selectedCourse,selectedDepth);selectView(currentView);
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.pane){selectPane(b.dataset.pane);return;}if(b.dataset.view){selectView(b.dataset.view);return;}if(b.dataset.load){transition=T.choose(transition,progress,answers,fields,'load',b.dataset.load);document.querySelectorAll('[data-load]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();return;}if(b.dataset.course){selectCourse(+b.dataset.course,b.hasAttribute('data-depth')?+b.dataset.depth:null);return;}if(b.classList.contains('faq-question')){const on=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(on));document.querySelector('.faq-answer').hidden=!on;}if(b.classList.contains('review-plan')){if(matchMedia('(max-width:760px)').matches){selectPane('result');selectView('map');}else selectView('table');$('result-title').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});}});
document.querySelector('.result-tabs').addEventListener('keydown',e=>{const views=['map','graph','table'],i=views.indexOf(currentView);let next;if(e.key==='ArrowRight')next=(i+1)%3;else if(e.key==='ArrowLeft')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();selectView(views[next]);document.getElementById('design-tab-'+views[next]).focus();});
render();new ResizeObserver(drawRoute).observe(document.querySelector('.landscape'));
})();
